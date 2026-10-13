#!/usr/bin/env python3
"""
Daily script: scrape yesterday's Wordle answer and push to Firebase.
Called by GitHub Actions (update-wordle.yml).

Required environment variables:
  FIREBASE_SERVICE_ACCOUNT  — JSON string of the Firebase service account key

Optional (for manual override via workflow_dispatch):
  PUZZLE_NUM   — puzzle number to add directly
  PUZZLE_WORD  — puzzle word to add directly
"""

import json
import os
import re
import sys
from datetime import datetime, timedelta, timezone

import requests
import firebase_admin
from firebase_admin import credentials, firestore


# ── Helpers ───────────────────────────────────────────────────────────────────

def log(msg):
    print(f"[{datetime.now(timezone.utc).strftime('%H:%M:%S')}] {msg}", flush=True)


def init_firebase():
    sa_json = os.environ.get("FIREBASE_SERVICE_ACCOUNT")
    if not sa_json:
        log("ERROR: FIREBASE_SERVICE_ACCOUNT environment variable not set")
        sys.exit(1)
    sa_info = json.loads(sa_json)
    cred = credentials.Certificate(sa_info)
    firebase_admin.initialize_app(cred)
    return firestore.client()


def scrape_answer():
    """
    Scrape yesterday's Wordle answer from yourdictionary.com.
    Returns (puzzle_num, word) or None on failure.
    """
    url = "https://wordfinder.yourdictionary.com/wordle/answers/"
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        )
    }
    try:
        resp = requests.get(url, headers=headers, timeout=30)
        resp.raise_for_status()
    except Exception as e:
        log(f"ERROR: Failed to fetch page: {e}")
        return None

    text = resp.text

    # Find yesterday's date string (the page renders each row as "Oct. 12  1941  YODEL")
    # We look for a 5-letter all-caps word paired with a puzzle number in the table rows.
    # The simplest approach: find all (num, WORD) pairs, return the highest-numbered visible one
    # (today's answer shows "Reveal" so it won't match [A-Z]{5}).
    pattern = re.compile(r'(\d{3,4})\s+([A-Z]{5})\b')
    matches = pattern.findall(text)
    if not matches:
        log("ERROR: No puzzle answers found in page")
        return None

    # Take the highest puzzle number found
    pairs = [(int(n), w) for n, w in matches]
    pairs.sort(key=lambda x: x[0], reverse=True)
    latest_num, latest_word = pairs[0]
    log(f"Scraped: #{latest_num} = {latest_word}")
    return latest_num, latest_word.lower()


def get_current_data(db):
    """Fetch existing Firestore document."""
    doc = db.collection("wordle").document("answers").get()
    if doc.exists:
        return doc.to_dict()
    return {}


def update_firebase(db, puzzle_num, word):
    """Add a new answer to Firestore if it's not already there."""
    doc_ref = db.collection("wordle").document("answers")
    data = get_current_data(db)

    by_number = data.get("byNumber", {})
    existing_num = str(puzzle_num)

    if existing_num in by_number:
        existing = by_number[existing_num]
        if existing == word:
            log(f"Already up to date: #{puzzle_num} = {word}")
            return False
        else:
            log(f"WARNING: #{puzzle_num} already has '{existing}', got '{word}' — skipping")
            return False

    # Add the new entry
    by_number[existing_num] = word

    # Rebuild sorted used words list
    used_set = set(by_number.values())
    used_list = sorted(used_set)

    doc_ref.update({
        f"byNumber.{existing_num}": word,
        "usedWords": used_list,
        "lastPuzzleNum": puzzle_num,
        "lastPuzzleWord": word,
        "lastUpdated": firestore.SERVER_TIMESTAMP,
        "totalPuzzles": len(by_number),
    })
    log(f"✓ Updated Firebase: added #{puzzle_num} = {word}")
    log(f"  Total puzzles now: {len(by_number)}, unique words: {len(used_list)}")
    return True


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    log("Starting Wordle update script")

    db = init_firebase()

    # Check for manual override
    manual_num = os.environ.get("PUZZLE_NUM", "").strip()
    manual_word = os.environ.get("PUZZLE_WORD", "").strip().upper()

    if manual_num and manual_word:
        puzzle_num = int(manual_num)
        word = manual_word.lower()
        log(f"Manual override: #{puzzle_num} = {word}")
        if len(word) != 5 or not word.isalpha():
            log(f"ERROR: '{word}' is not a valid 5-letter word")
            sys.exit(1)
    else:
        result = scrape_answer()
        if not result:
            log("Failed to scrape answer — exiting")
            sys.exit(1)
        puzzle_num, word = result

    updated = update_firebase(db, puzzle_num, word)
    log(f"Done. {'Updated' if updated else 'No change'}.")


if __name__ == "__main__":
    main()
