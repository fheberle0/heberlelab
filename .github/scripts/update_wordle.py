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


HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )
}


def scrape_nyt_api(date_str):
    """
    Primary source: NYT Wordle API.
    date_str format: YYYY-MM-DD
    Returns (puzzle_num, word) or None.
    """
    url = f"https://www.nytimes.com/svc/wordle/v2/{date_str}.json"
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            word = data.get("solution", "").lower()
            num  = data.get("days_since_launch") or data.get("id")
            if word and len(word) == 5 and num is not None:
                log(f"NYT API: #{num} = {word.upper()} (date {date_str})")
                return int(num), word
        log(f"NYT API: unexpected response {resp.status_code}")
    except Exception as e:
        log(f"NYT API error: {e}")
    return None


def scrape_rockpapershotgun():
    """
    Fallback: Rock Paper Shotgun Wordle archive (server-rendered HTML).
    Returns (puzzle_num, word) or None.
    """
    url = "https://www.rockpapershotgun.com/wordle-past-answers"
    try:
        resp = requests.get(url, headers=HEADERS, timeout=20)
        resp.raise_for_status()
        # Page lists answers like "Wordle 1941: YODEL" or in a table
        # Try various patterns
        patterns = [
            r'Wordle\s+(\d{3,4}):\s*([A-Z]{5})',
            r'#(\d{3,4})\s*[–-]\s*([A-Z]{5})',
            r'(\d{3,4})\s+([A-Z]{5})\b',
        ]
        for pat in patterns:
            matches = re.findall(pat, resp.text)
            if matches:
                pairs = [(int(n), w.lower()) for n, w in matches]
                pairs.sort(key=lambda x: x[0], reverse=True)
                num, word = pairs[0]
                log(f"RPS fallback: #{num} = {word.upper()}")
                return num, word
        log("RPS fallback: no matches found")
    except Exception as e:
        log(f"RPS fallback error: {e}")
    return None


def scrape_answer():
    """
    Try sources in order. Returns (puzzle_num, word) or None.
    """
    # Try yesterday and the day before in case of timezone edge cases
    now_utc = datetime.now(timezone.utc)
    for days_ago in [1, 2]:
        date = (now_utc - timedelta(days=days_ago)).strftime("%Y-%m-%d")
        result = scrape_nyt_api(date)
        if result:
            return result

    # Fallback to Rock Paper Shotgun
    return scrape_rockpapershotgun()


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
    manual_num  = os.environ.get("PUZZLE_NUM", "").strip()
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
            log("All sources failed — exiting")
            sys.exit(1)
        puzzle_num, word = result

    updated = update_firebase(db, puzzle_num, word)
    log(f"Done. {'Updated' if updated else 'No change'}.")


if __name__ == "__main__":
    main()
