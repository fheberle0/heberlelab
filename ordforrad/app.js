import React, { useState, useEffect, useMemo, useRef, useCallback } from 'https://esm.sh/react@18.3.1';
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client';
import { Flame, Clock, CheckCircle2, Sparkles, ChevronDown, RotateCcw, X, Grid3x3, PenLine, ListChecks, Lock, TrendingUp, Award, ArrowLeft, Flag, BookOpen, ExternalLink, Search, Repeat } from './icons.js';
import { supabaseClient } from './supabase-client.js';
const SUPABASE_FUNCTIONS_URL = 'https://ttyfammnucxnypyfabks.supabase.co/functions/v1';

/* ============================================================
   ORDFÖRRÅD — Swedish vocabulary trainer
   Flow: Flashcards (primary, 3-correct-to-graduate) →
         unlocks Övningar (MCQ/Type/Blank) + Matchningsspel,
         both scoped to *today's* introduced words only.
   ============================================================ */

const VOCAB = [{
  "id": 87,
  "sv": "och (vardagl. å; förk. o.)",
  "en": "and",
  "t": "c",
  "es": "Jag dricker kaffe och te.",
  "ee": "I drink coffee and tea.",
  "lv": "A1",
  "wpm": 26019.68
}, {
  "id": 88,
  "sv": "vara (vardagl. va)",
  "en": "to be",
  "t": "v",
  "lv": "A1",
  "wpm": 23017.26
}, {
  "id": 89,
  "sv": "i",
  "en": "in",
  "t": "p",
  "es": "Hon bor i Stockholm.",
  "ee": "She lives in Stockholm.",
  "ch": 1,
  "lv": "A1",
  "wpm": 19272.89
}, {
  "id": 90,
  "sv": "ha",
  "en": "to have",
  "t": "v",
  "c": "(har, hade, haft)",
  "es": "Jag har en idé.",
  "ee": "I have an idea.",
  "ch": 1,
  "lv": "A1",
  "wpm": 15983.31
}, {
  "id": 91,
  "sv": "dess",
  "en": "its",
  "t": "p",
  "es": "Katten rör dess svans.",
  "ee": "The cat moves its tail.",
  "lv": "A1",
  "wpm": 15935.58
}, {
  "id": 92,
  "sv": "det",
  "en": "it",
  "t": "p",
  "es": "Det är kallt idag.",
  "ee": "It is cold today.",
  "lv": "A1",
  "wpm": 14582.21
}, {
  "id": 93,
  "sv": "en",
  "en": "a/an",
  "t": "d",
  "es": "Jag ser en hund.",
  "ee": "I see a dog.",
  "lv": "A1",
  "wpm": 14511.22
}, {
  "id": 94,
  "sv": "som",
  "en": "who/that",
  "t": "p",
  "es": "Hon är personen som hjälper mig.",
  "ee": "She is the person who helps me.",
  "lv": "A1",
  "wpm": 12734.7
}, {
  "id": 95,
  "sv": "på",
  "en": "on",
  "t": "p",
  "es": "Nyckeln ligger på bordet.",
  "ee": "The key lies on the table.",
  "ch": 1,
  "lv": "A1",
  "wpm": 12591.15
}, {
  "id": 96,
  "sv": "å",
  "en": "and (spoken)",
  "t": "p",
  "es": "Vi köper kaffe å bröd.",
  "ee": "We buy coffee and bread.",
  "lv": "A1",
  "wpm": 12462.73
}, {
  "id": 97,
  "sv": "av",
  "en": "of/by",
  "t": "p",
  "es": "En bok av Strindberg.",
  "ee": "A book by Strindberg.",
  "lv": "A1",
  "wpm": 11540.13
}, {
  "id": 98,
  "sv": "för",
  "en": "for",
  "t": "p",
  "es": "Detta är för dig.",
  "ee": "This is for you.",
  "lv": "A1",
  "wpm": 11408.82
}, {
  "id": 99,
  "sv": "att",
  "en": "to (infinitive marker)",
  "t": "s",
  "es": "Jag gillar att läsa.",
  "ee": "I like to read.",
  "ch": 2,
  "lv": "A1",
  "wpm": 11271.57
}, {
  "id": 100,
  "sv": "kunna",
  "en": "can/be able to",
  "t": "v",
  "c": "(kan, kunde, kunnat)",
  "ch": 1,
  "lv": "A1",
  "wpm": 11119.08
}, {
  "id": 101,
  "sv": "skola",
  "en": "school",
  "t": "n",
  "es": "Barnen går till skolan.",
  "ee": "The children go to school.",
  "lv": "A1",
  "wpm": 10411.19,
  "g": "en"
}, {
  "id": 102,
  "sv": "jag",
  "en": "I",
  "t": "p",
  "es": "Jag bor i Stockholm.",
  "ee": "I live in Stockholm.",
  "lv": "A1",
  "wpm": 9390.67
}, {
  "id": 103,
  "sv": "inte (formellt: icke, ej)",
  "en": "not",
  "t": "a",
  "es": "Jag förstår inte.",
  "ee": "I do not understand.",
  "lv": "A1",
  "wpm": 9073.55
}, {
  "id": 104,
  "sv": "med",
  "en": "with",
  "t": "p",
  "es": "Hon kommer med mig.",
  "ee": "She comes with me.",
  "lv": "A1",
  "wpm": 8790.85
}, {
  "id": 105,
  "sv": "till",
  "en": "to",
  "t": "p",
  "es": "Vi går till skolan.",
  "ee": "We go to school.",
  "lv": "A1",
  "wpm": 8662.68
}, {
  "id": 106,
  "sv": "liten",
  "en": "small",
  "t": "a",
  "c": "(litet, lilla)",
  "es": "Huset är litet.",
  "ee": "The house is small.",
  "ch": 3,
  "lv": "A1",
  "wpm": 8654.67
}, {
  "id": 107,
  "sv": "den",
  "en": "it / that (common gender)",
  "t": "d",
  "es": "Den boken är bra.",
  "ee": "That book is good.",
  "lv": "A1",
  "wpm": 6896.18
}, {
  "id": 108,
  "sv": "ett",
  "en": "one",
  "t": "d",
  "es": "Jag har ett äpple.",
  "ee": "I have one apple.",
  "lv": "A1",
  "wpm": 6314.26
}, {
  "id": 109,
  "sv": "analog",
  "en": "analog",
  "t": "a",
  "es": "Klockan är analog.",
  "ee": "The clock is analog.",
  "lv": "A1",
  "wpm": 5649.0
}, {
  "id": 110,
  "sv": "unna",
  "en": "to treat oneself",
  "t": "v",
  "es": "Hon unnar sig kaffe.",
  "ee": "She treats herself to coffee.",
  "lv": "A1",
  "wpm": 5559.15
}, {
  "id": 111,
  "sv": "om",
  "en": "about / if",
  "t": "p",
  "es": "Om det regnar stannar vi.",
  "ee": "If it rains we stay.",
  "lv": "A1",
  "wpm": 5278.24
}, {
  "id": 112,
  "sv": "vi",
  "en": "we",
  "t": "p",
  "es": "Vi bor här.",
  "ee": "We live here.",
  "ch": 1,
  "lv": "A1",
  "wpm": 4723.57
}, {
  "id": 113,
  "sv": "men",
  "en": "but",
  "t": "c",
  "es": "Jag vill gå men jag arbetar.",
  "ee": "I want to go but I work.",
  "ch": 1,
  "lv": "A1",
  "wpm": 4545.97
}, {
  "id": 114,
  "sv": "man",
  "en": "one (impersonal 'you')",
  "t": "p",
  "es": "Man äter middag klockan sex.",
  "ee": "One eats dinner at six.",
  "lv": "A1",
  "wpm": 4446.34
}, {
  "id": 115,
  "sv": "de (vardagl. dom)",
  "en": "the",
  "t": "d",
  "es": "De gamla husen är vackra.",
  "ee": "The old houses are beautiful.",
  "lv": "A1",
  "wpm": 4437.26
}, {
  "id": 116,
  "sv": "få",
  "en": "to get",
  "t": "v",
  "es": "Jag får ett brev.",
  "ee": "I receive a letter.",
  "lv": "A1",
  "wpm": 4060.39
}, {
  "id": 117,
  "sv": "så",
  "en": "so / such",
  "t": "a",
  "es": "Det är så kallt.",
  "ee": "It is so cold.",
  "lv": "A1",
  "wpm": 4004.97
}, {
  "id": 118,
  "sv": "som",
  "en": "who/that",
  "t": "c",
  "es": "Hon är personen som hjälper mig.",
  "ee": "She is the person who helps me.",
  "lv": "A1",
  "wpm": 3762.28
}, {
  "id": 119,
  "sv": "sig (vardagl. sej)",
  "en": "oneself",
  "t": "p",
  "es": "Han tvättar sig.",
  "ee": "He washes himself.",
  "lv": "A1",
  "wpm": 3469.03
}, {
  "id": 120,
  "sv": "han",
  "en": "he",
  "t": "p",
  "es": "Han arbetar idag.",
  "ee": "He works today.",
  "ch": 1,
  "lv": "A1",
  "wpm": 3380.88
}, {
  "id": 121,
  "sv": "de (vardagl. dom)",
  "en": "they",
  "t": "p",
  "es": "De arbetar tillsammans.",
  "ee": "They work together.",
  "lv": "A1",
  "wpm": 3345.8
}, {
  "id": 122,
  "sv": "bli",
  "en": "to become",
  "t": "v",
  "c": "(blir, blev, blivit)",
  "es": "Han vill bli läkare.",
  "ee": "He wants to become a doctor.",
  "ch": 2,
  "lv": "A1",
  "wpm": 3293.35
}, {
  "id": 123,
  "sv": "komma",
  "en": "to come",
  "t": "v",
  "c": "(kommer, kom, kommit)",
  "es": "Han kommer snart.",
  "ee": "He arrives soon.",
  "ch": 1,
  "lv": "A1",
  "wpm": 3224.74
}, {
  "id": 124,
  "sv": "det",
  "en": "it",
  "t": "d",
  "es": "Det är kallt idag.",
  "ee": "It is cold today.",
  "ch": 1,
  "lv": "A1",
  "wpm": 3221.41
}, {
  "id": 125,
  "sv": "sin",
  "en": "his/her/its own",
  "t": "p",
  "es": "Han säljer sin bil.",
  "ee": "He sells his car.",
  "lv": "A1",
  "wpm": 3217.3
}, {
  "id": 126,
  "sv": "eller",
  "en": "or",
  "t": "c",
  "es": "Te eller kaffe?",
  "ee": "Tea or coffee?",
  "ch": 1,
  "lv": "A1",
  "wpm": 3138.92
}, {
  "id": 127,
  "sv": "från",
  "en": "from",
  "t": "p",
  "es": "Jag kommer från Sverige.",
  "ee": "I come from Sweden.",
  "ch": 1,
  "lv": "A1",
  "wpm": 3117.46
}, {
  "id": 128,
  "sv": "mycket",
  "en": "much / very",
  "t": "a",
  "es": "Det är mycket arbete.",
  "ee": "It is much work.",
  "lv": "A1",
  "wpm": 3112.13
}, {
  "id": 129,
  "sv": "vilja",
  "en": "to want",
  "t": "v",
  "es": "Hon har stark vilja.",
  "ee": "She has strong will.",
  "lv": "A1",
  "wpm": 3004.91
}, {
  "id": 130,
  "sv": "all",
  "en": "all",
  "t": "p",
  "es": "All mat är slut.",
  "ee": "All food is gone.",
  "lv": "A1",
  "wpm": 2975.47
}, {
  "id": 131,
  "sv": "göra",
  "en": "to do/make",
  "t": "v",
  "c": "(gör, gjorde, gjort)",
  "ch": 1,
  "lv": "A1",
  "wpm": 2942.04
}, {
  "id": 132,
  "sv": "om",
  "en": "about / if",
  "t": "s",
  "es": "Om det regnar stannar vi.",
  "ee": "If it rains we stay.",
  "ch": 1,
  "lv": "A1",
  "wpm": 2630.45
}, {
  "id": 133,
  "sv": "annan",
  "en": "another",
  "t": "p",
  "c": "(annat, andra)",
  "es": "Jag vill ha en annan bok.",
  "ee": "I want another book.",
  "ch": 1,
  "lv": "A1",
  "wpm": 2624.2
}, {
  "id": 134,
  "sv": "du",
  "en": "you",
  "t": "p",
  "es": "Du talar svenska.",
  "ee": "You speak Swedish.",
  "lv": "A1",
  "wpm": 2581.46
}, {
  "id": 135,
  "sv": "någon (vardagl. nån, förk. ngn)",
  "en": "someone / anyone",
  "t": "p",
  "es": "Någon ringer.",
  "ee": "Someone calls.",
  "lv": "A1",
  "wpm": 2565.69
}, {
  "id": 136,
  "sv": "finna",
  "en": "to find",
  "t": "v",
  "es": "Hon finner nyckeln.",
  "ee": "She finds the key.",
  "lv": "A1",
  "wpm": 2465.41
}, {
  "id": 137,
  "sv": "ta (el. taga)",
  "en": "to take",
  "t": "v",
  "es": "Hon tar bussen.",
  "ee": "She takes the bus.",
  "lv": "A1",
  "wpm": 2452.4
}, {
  "id": 138,
  "sv": "när",
  "en": "when",
  "t": "a",
  "es": "När börjar filmen?",
  "ee": "When does the movie start?",
  "ch": 3,
  "lv": "A1",
  "wpm": 2386.89
}, {
  "id": 139,
  "sv": "se",
  "en": "to see",
  "t": "v",
  "c": "(ser, såg, sett)",
  "es": "Jag ser huset.",
  "ee": "I see the house.",
  "ch": 1,
  "lv": "A1",
  "wpm": 2253.32
}, {
  "id": 140,
  "sv": "måste",
  "en": "must",
  "t": "a",
  "es": "Jag måste gå.",
  "ee": "I must go.",
  "lv": "A1",
  "wpm": 2214.95
}, {
  "id": 141,
  "sv": "detta",
  "en": "this",
  "t": "p",
  "es": "Detta hus är gammalt.",
  "ee": "This house is old.",
  "lv": "A1",
  "wpm": 2200.74
}, {
  "id": 142,
  "sv": "stor",
  "en": "big",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Det är en stor stad.",
  "ee": "It is a big city.",
  "ch": 3,
  "lv": "A1",
  "wpm": 2046.73
}, {
  "id": 143,
  "sv": "nu",
  "en": "now",
  "t": "a",
  "es": "Jag arbetar nu.",
  "ee": "I work now.",
  "lv": "A1",
  "wpm": 2033.06
}, {
  "id": 144,
  "sv": "gå",
  "en": "to go",
  "t": "v",
  "es": "Vi går hem.",
  "ee": "We go home.",
  "ch": 2,
  "lv": "A1",
  "wpm": 2001.14
}, {
  "id": 145,
  "sv": "säga",
  "en": "to say",
  "t": "v",
  "c": "(säger, sa/sade, sagt)",
  "ch": 1,
  "lv": "A1",
  "wpm": 1998.46
}, {
  "id": 146,
  "sv": "den",
  "en": "it / that (common gender)",
  "t": "p",
  "es": "Den boken är bra.",
  "ee": "That book is good.",
  "ch": 1,
  "lv": "A1",
  "wpm": 1981.49
}, {
  "id": 147,
  "sv": "vad (vardagl. va)",
  "en": "what",
  "t": "p",
  "es": "Vad gör du?",
  "ee": "What are you doing?",
  "lv": "A1",
  "wpm": 1911.2
}, {
  "id": 148,
  "sv": "år",
  "en": "year",
  "t": "n",
  "g": "ett",
  "c": "(-et, –, -en)",
  "es": "Jag bodde där ett år.",
  "ee": "I lived there for one year.",
  "ch": 1,
  "lv": "A1",
  "wpm": 1886.72
}, {
  "id": 149,
  "sv": "äga",
  "en": "to own",
  "t": "v",
  "c": "(äger, ägde, ägt)",
  "ch": 14,
  "lv": "A1",
  "wpm": 1867.88
}, {
  "id": 150,
  "sv": "under",
  "en": "under",
  "t": "p",
  "es": "Boken ligger under bordet.",
  "ee": "The book lies under the table.",
  "ch": 3,
  "lv": "A1",
  "wpm": 1851.63
}, {
  "id": 151,
  "sv": "betyda",
  "en": "to mean",
  "t": "v",
  "c": "(-er, btydde, betytt)",
  "es": "Detta ord betyder mycket.",
  "ee": "This word means a lot.",
  "ch": 5,
  "lv": "A1",
  "wpm": 1811.72
}, {
  "id": 152,
  "sv": "också (vardagl. oxå)",
  "en": "also",
  "t": "a",
  "es": "Jag vill också komma.",
  "ee": "I also want to come.",
  "lv": "A1",
  "wpm": 1797.39
}, {
  "id": 153,
  "sv": "där",
  "en": "there",
  "t": "a",
  "es": "Han står där.",
  "ee": "He stands there.",
  "lv": "A1",
  "wpm": 1790.68
}, {
  "id": 154,
  "sv": "då",
  "en": "then",
  "t": "a",
  "es": "När det regnar stannar vi då.",
  "ee": "When it rains we stay then.",
  "ch": 1,
  "lv": "A1",
  "wpm": 1788.93
}, {
  "id": 155,
  "sv": "min",
  "en": "my",
  "t": "p",
  "c": "(mitt, mina)",
  "es": "Det är min bok.",
  "ee": "It is my book.",
  "ch": 1,
  "lv": "A1",
  "wpm": 1757.18
}, {
  "id": 156,
  "sv": "böra",
  "en": "should",
  "t": "a",
  "lv": "A1",
  "wpm": 1743.31
}, {
  "id": 157,
  "sv": "hur",
  "en": "how",
  "t": "a",
  "es": "Hur mår du?",
  "ee": "How are you?",
  "lv": "A1",
  "wpm": 1690.32
}, {
  "id": 158,
  "sv": "mig (vardagl. mej)",
  "en": "me",
  "t": "p",
  "es": "Hjälp mig.",
  "ee": "Help me.",
  "lv": "A1",
  "wpm": 1622.7
}, {
  "id": 159,
  "sv": "mot",
  "en": "against / toward",
  "t": "p",
  "es": "Bilen kör mot staden.",
  "ee": "The car drives toward the city.",
  "ch": 9,
  "lv": "A1",
  "wpm": 1592.42
}, {
  "id": 160,
  "sv": "bara",
  "en": "only / just",
  "t": "a",
  "es": "Jag vill bara sova.",
  "ee": "I only want to sleep.",
  "lv": "A1",
  "wpm": 1582.15
}, {
  "id": 161,
  "sv": "vilken",
  "en": "which",
  "t": "p",
  "c": "(vilket, vilka)",
  "es": "Vilken bok vill du ha?",
  "ee": "Which book do you want?",
  "ch": 1,
  "lv": "A1",
  "wpm": 1512.84
}, {
  "id": 162,
  "sv": "ut",
  "en": "out",
  "t": "a",
  "es": "Han går ut.",
  "ee": "He goes out.",
  "lv": "A1",
  "wpm": 1481.5
}, {
  "id": 163,
  "sv": "ny",
  "en": "new",
  "t": "a",
  "c": "(nytt, nya)",
  "es": "Jag köpte en ny bil.",
  "ee": "I bought a new car.",
  "ch": 2,
  "lv": "A1",
  "wpm": 1446.08
}, {
  "id": 164,
  "sv": "vid",
  "en": "by / at",
  "t": "p",
  "es": "Vi sitter vid bordet.",
  "ee": "We sit at the table.",
  "lv": "A1",
  "wpm": 1439.02
}, {
  "id": 165,
  "sv": "än",
  "en": "than",
  "t": "c",
  "es": "Hon är äldre än jag.",
  "ee": "She is older than I am.",
  "lv": "A1",
  "wpm": 1428.89
}, {
  "id": 166,
  "sv": "bra",
  "en": "good",
  "t": "a",
  "es": "Det är bra.",
  "ee": "It is good.",
  "lv": "A1",
  "wpm": 1428.27
}, {
  "id": 167,
  "sv": "ingen",
  "en": "no one / none",
  "t": "p",
  "es": "Ingen kommer idag.",
  "ee": "No one comes today.",
  "ch": 7,
  "lv": "A1",
  "wpm": 1350.9
}, {
  "id": 168,
  "sv": "dem (vardagl. dom)",
  "en": "them",
  "t": "p",
  "es": "Jag ser dem.",
  "ee": "I see them.",
  "lv": "A1",
  "wpm": 1341.39
}, {
  "id": 169,
  "sv": "efter",
  "en": "after",
  "t": "p",
  "es": "Vi går hem efter mötet.",
  "ee": "We go home after the meeting.",
  "lv": "A1",
  "wpm": 1323.97
}, {
  "id": 170,
  "sv": "upp",
  "en": "up",
  "t": "p",
  "es": "H an går upp.",
  "ee": "He goes up.",
  "lv": "A1",
  "wpm": 1322.38
}, {
  "id": 171,
  "sv": "hon",
  "en": "she",
  "t": "p",
  "es": "Hon läser en bok.",
  "ee": "She reads a book.",
  "ch": 1,
  "lv": "A1",
  "wpm": 1291.75
}, {
  "id": 172,
  "sv": "lite",
  "en": "a little",
  "t": "a",
  "es": "Jag vill ha lite kaffe.",
  "ee": "I want a little coffee.",
  "ch": 2,
  "lv": "A1",
  "wpm": 1288.09
}, {
  "id": 173,
  "sv": "denna",
  "en": "this",
  "t": "p",
  "es": "Denna bok är bra.",
  "ee": "This book is good.",
  "lv": "A1",
  "wpm": 1279.97
}, {
  "id": 174,
  "sv": "in",
  "en": "in",
  "t": "a",
  "es": "Hunden går in.",
  "ee": "The dog goes in.",
  "lv": "A1",
  "wpm": 1274.61
}, {
  "id": 175,
  "sv": "mycket",
  "en": "much / very",
  "t": "a",
  "es": "Det är mycket arbete.",
  "ee": "It is much work.",
  "lv": "A1",
  "wpm": 1271.67
}, {
  "id": 176,
  "sv": "över",
  "en": "over / above",
  "t": "p",
  "es": "Fågeln flyger över huset.",
  "ee": "The bird flies over the house.",
  "lv": "A1",
  "wpm": 1267.18
}, {
  "id": 177,
  "sv": "ge (formellt giva)",
  "en": "to give",
  "t": "v",
  "es": "Jag ger dig boken.",
  "ee": "I give you the book.",
  "lv": "A1",
  "wpm": 1208.51
}, {
  "id": 178,
  "sv": "vår (vardagl. våran)",
  "en": "our",
  "t": "p",
  "es": "Vår bil är blå.",
  "ee": "Our car is blue.",
  "lv": "A1",
  "wpm": 1206.78
}, {
  "id": 179,
  "sv": "del",
  "en": "part / some",
  "t": "n",
  "g": "en",
  "es": "En del människor arbetar här.",
  "ee": "Some people work here.",
  "ch": 15,
  "lv": "A1",
  "wpm": 1202.45
}, {
  "id": 180,
  "sv": "här",
  "en": "here",
  "t": "a",
  "es": "Jag bor här.",
  "ee": "I live here.",
  "ch": 1,
  "lv": "A1",
  "wpm": 1194.91
}, {
  "id": 181,
  "sv": "även",
  "en": "also / even",
  "t": "a",
  "es": "Hon kommer även imorgon.",
  "ee": "She also comes tomorrow.",
  "lv": "A1",
  "wpm": 1191.77
}, {
  "id": 182,
  "sv": "skriva",
  "en": "to write",
  "t": "v",
  "c": "(skriver, skrev, skrivit)",
  "es": "Jag skriver ett brev.",
  "ee": "I write a letter.",
  "ch": 1,
  "lv": "A1",
  "wpm": 1141.32
}, {
  "id": 183,
  "sv": "tid",
  "en": "time",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Jag har inte tid.",
  "ee": "I don't have time.",
  "ch": 3,
  "lv": "A1",
  "wpm": 1127.59
}, {
  "id": 184,
  "sv": "ju",
  "en": "after all / you know",
  "t": "a",
  "es": "Det är ju sant.",
  "ee": "It is true after all.",
  "lv": "A1",
  "wpm": 1119.58
}, {
  "id": 185,
  "sv": "sedan (vardagl. sen)",
  "en": "since / later",
  "t": "a",
  "es": "Vi ses sedan.",
  "ee": "We see each other later.",
  "lv": "A1",
  "wpm": 1115.12
}, {
  "id": 186,
  "sv": "te sig",
  "en": "to appear / seem",
  "t": "v",
  "es": "Han te sig lugn.",
  "ee": "He appears calm.",
  "lv": "A1",
  "wpm": 1115.09
}, {
  "id": 187,
  "sv": "riva",
  "en": "to tear / demolish",
  "t": "v",
  "c": "(river, rev, rivit)",
  "ch": 4,
  "lv": "A1",
  "wpm": 1088.02
}, {
  "id": 188,
  "sv": "börja",
  "en": "to begin",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Filmen börjar nu.",
  "ee": "The movie begins now.",
  "ch": 3,
  "lv": "A1",
  "wpm": 1039.45
}, {
  "id": 189,
  "sv": "hel",
  "en": "a whole",
  "t": "a",
  "es": "Hela huset är tyst.",
  "ee": "The whole house is quiet.",
  "lv": "A1",
  "wpm": 1034.76
}, {
  "id": 190,
  "sv": "dag",
  "en": "day",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "Det är en bra dag.",
  "ee": "It is a good day.",
  "ch": 2,
  "lv": "A1",
  "wpm": 1033.61
}, {
  "id": 191,
  "sv": "själv",
  "en": "self",
  "t": "p",
  "es": "Jag gör det själv.",
  "ee": "I do it myself.",
  "ch": 2,
  "lv": "A1",
  "wpm": 1033.19
}, {
  "id": 192,
  "sv": "människa",
  "en": "human / person",
  "t": "n",
  "g": "en",
  "c": "(-n, människor, människorna)",
  "es": "Varje människa är viktig.",
  "ee": "Every person is important.",
  "ch": 13,
  "lv": "A1",
  "wpm": 1030.33
}, {
  "id": 193,
  "sv": "land",
  "en": "country",
  "t": "n",
  "g": "ett",
  "c": "(-et, länder, länderna)",
  "es": "Sverige är ett land.",
  "ee": "Sweden is a country.",
  "ch": 1,
  "lv": "A1",
  "wpm": 949.12
}, {
  "id": 194,
  "sv": "svensk",
  "en": "Swedish",
  "t": "a",
  "es": "Han är svensk.",
  "ee": "He is Swedish.",
  "lv": "A1",
  "wpm": 948.52
}, {
  "id": 195,
  "sv": "fråga",
  "en": "question",
  "t": "n",
  "g": "en",
  "es": "Jag frågar läraren.",
  "ee": "I ask the teacher.",
  "lv": "A1",
  "wpm": 938.78
}, {
  "id": 196,
  "sv": "oss",
  "en": "us",
  "t": "p",
  "es": "Han hjälper oss.",
  "ee": "He helps us.",
  "ch": 6,
  "lv": "A1",
  "wpm": 934.32
}, {
  "id": 197,
  "sv": "tro",
  "en": "to believe",
  "t": "v",
  "es": "Hon har en stark tro.",
  "ee": "She has a strong belief.",
  "lv": "A1",
  "wpm": 928.39
}, {
  "id": 198,
  "sv": "el",
  "en": "electricity",
  "t": "n",
  "g": "en",
  "es": "El är dyr idag.",
  "ee": "Electricity is expensive today.",
  "lv": "A1",
  "wpm": 925.85
}, {
  "id": 199,
  "sv": "tycka",
  "en": "to think / feel (opinion)",
  "t": "v",
  "c": "(-er, -te, -t)",
  "es": "Jag tycker om kaffe.",
  "ee": "I like coffee.",
  "ch": 5,
  "lv": "A1",
  "wpm": 924.85
}, {
  "id": 200,
  "sv": "kommentar",
  "en": "comment",
  "t": "n",
  "g": "en",
  "es": "Hon skrev en kommentar.",
  "ee": "She wrote a comment.",
  "lv": "A1",
  "wpm": 924.68
}, {
  "id": 201,
  "sv": "veta",
  "en": "to know",
  "t": "v",
  "lv": "A1",
  "wpm": 894.31
}, {
  "id": 202,
  "sv": "idag (el. i dag)",
  "en": "today",
  "t": "a",
  "es": "Vi arbetar idag.",
  "ee": "We work today.",
  "lv": "A1",
  "wpm": 865.13
}, {
  "id": 203,
  "sv": "försöka",
  "en": "to try",
  "t": "v",
  "c": "(-er, -te, -t)",
  "es": "Jag försöker förstå.",
  "ee": "I try to understand.",
  "ch": 17,
  "lv": "A1",
  "wpm": 859.72
}, {
  "id": 204,
  "sv": "behöva",
  "en": "to need",
  "t": "v",
  "c": "(-er, -de, -t)",
  "es": "Jag behöver hjälp.",
  "ee": "I need help.",
  "ch": 4,
  "lv": "A1",
  "wpm": 858.16
}, {
  "id": 205,
  "sv": "samma",
  "en": "same",
  "t": "p",
  "es": "Vi har samma bok.",
  "ee": "We have the same book.",
  "ch": 1,
  "lv": "A1",
  "wpm": 844.13
}, {
  "id": 206,
  "sv": "mellan",
  "en": "between",
  "t": "p",
  "es": "Boken ligger mellan stolarna.",
  "ee": "The book lies between the chairs.",
  "ch": 3,
  "lv": "A1",
  "wpm": 841.51
}, {
  "id": 207,
  "sv": "känna",
  "en": "to feel / know",
  "t": "v",
  "es": "Jag känner honom.",
  "ee": "I know him.",
  "lv": "A1",
  "wpm": 840.25
}, {
  "id": 208,
  "sv": "läsa",
  "en": "to read",
  "t": "v",
  "c": "(-er, -te, -t)",
  "ch": 1,
  "lv": "A1",
  "wpm": 823.05
}, {
  "id": 209,
  "sv": "ro",
  "en": "to row",
  "t": "v",
  "es": "De ror på sjön.",
  "ee": "They row on the lake.",
  "lv": "A1",
  "wpm": 816.02
}, {
  "id": 210,
  "sv": "kanske",
  "en": "maybe",
  "t": "a",
  "es": "Han kommer kanske.",
  "ee": "He may come.",
  "ch": 2,
  "lv": "A1",
  "wpm": 809.75
}, {
  "id": 211,
  "sv": "lik",
  "en": "similar",
  "t": "a",
  "es": "De två husen är lika.",
  "ee": "The two houses are similar.",
  "lv": "A1",
  "wpm": 808.09
}, {
  "id": 212,
  "sv": "låta",
  "en": "to let / sound",
  "t": "v",
  "c": "(låter, lät, låtit)",
  "ch": 5,
  "lv": "A1",
  "wpm": 807.17
}, {
  "id": 213,
  "sv": "olik",
  "en": "different",
  "t": "a",
  "c": "(-t, -a)",
  "es": "De har olika idéer.",
  "ee": "They have different ideas.",
  "ch": 6,
  "lv": "A1",
  "wpm": 790.47
}, {
  "id": 214,
  "sv": "sådan",
  "en": "such",
  "t": "p",
  "es": "Jag vill ha en sådan bok.",
  "ee": "I want such a book.",
  "lv": "A1",
  "wpm": 788.97
}, {
  "id": 215,
  "sv": "sätt",
  "en": "way/method",
  "t": "n",
  "g": "ett",
  "es": "Det finns ett bättre sätt.",
  "ee": "There is a better way.",
  "lv": "A1",
  "wpm": 784.91
}, {
  "id": 216,
  "sv": "hans",
  "en": "his",
  "t": "p",
  "es": "Det är hans bil.",
  "ee": "It is his car.",
  "ch": 5,
  "lv": "A1",
  "wpm": 774.6
}, {
  "id": 217,
  "sv": "din",
  "en": "your",
  "t": "p",
  "c": "(ditt, dina)",
  "es": "Var är din bok?",
  "ee": "Where is your book?",
  "ch": 3,
  "lv": "A1",
  "wpm": 771.62
}, {
  "id": 218,
  "sv": "gång",
  "en": "time/occasion",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Det är första gången.",
  "ee": "It is the first time.",
  "ch": 5,
  "lv": "A1",
  "wpm": 763.39
}, {
  "id": 219,
  "sv": "stå",
  "en": "to stand",
  "t": "v",
  "es": "Bilen står här.",
  "ee": "The car stands here.",
  "lv": "A1",
  "wpm": 761.8
}, {
  "id": 220,
  "sv": "inom",
  "en": "within",
  "t": "p",
  "es": "Vi ses inom en vecka.",
  "ee": "We meet within a week.",
  "lv": "A1",
  "wpm": 758.15
}, {
  "id": 221,
  "sv": "visa",
  "en": "to show",
  "t": "v",
  "es": "Han visar vägen.",
  "ee": "He shows the way.",
  "lv": "A1",
  "wpm": 757.44
}, {
  "id": 222,
  "sv": "använda",
  "en": "to use",
  "t": "v",
  "c": "(-er, använde, använt)",
  "es": "Jag använder datorn.",
  "ee": "I use the computer.",
  "ch": 1,
  "lv": "A1",
  "wpm": 749.26
}, {
  "id": 223,
  "sv": "vända",
  "en": "to turn",
  "t": "v",
  "es": "Hon vänder bilen.",
  "ee": "She turns the car.",
  "lv": "A1",
  "wpm": 749.26
}, {
  "id": 224,
  "sv": "hålla",
  "en": "to hold",
  "t": "v",
  "es": "Han håller boken.",
  "ee": "He holds the book.",
  "lv": "A1",
  "wpm": 739.42
}, {
  "id": 225,
  "sv": "genom",
  "en": "through",
  "t": "p",
  "es": "Vi går genom parken.",
  "ee": "We walk through the park.",
  "ch": 10,
  "lv": "A1",
  "wpm": 733.74
}, {
  "id": 226,
  "sv": "helt",
  "en": "completely",
  "t": "a",
  "es": "Jag är helt säker.",
  "ee": "I am completely sure.",
  "ch": 2,
  "lv": "A1",
  "wpm": 721.67
}, {
  "id": 227,
  "sv": "fler",
  "en": "more",
  "t": "a",
  "es": "Vi behöver fler stolar.",
  "ee": "We need more chairs.",
  "lv": "A1",
  "wpm": 717.99
}, {
  "id": 228,
  "sv": "utan",
  "en": "without",
  "t": "p",
  "es": "Jag går utan jacka.",
  "ee": "I go without a jacket.",
  "lv": "A1",
  "wpm": 707.53
}, {
  "id": 229,
  "sv": "väl",
  "en": "well / probably",
  "t": "a",
  "es": "Det går väl bra.",
  "ee": "It will probably go well.",
  "ch": 2,
  "lv": "A1",
  "wpm": 705.75
}, {
  "id": 230,
  "sv": "barn",
  "en": "child",
  "t": "n",
  "g": "ett",
  "c": "(-et, –, -en)",
  "es": "Barnet sover.",
  "ee": "The child sleeps.",
  "ch": 1,
  "lv": "A1",
  "wpm": 700.31
}, {
  "id": 231,
  "sv": "enligt",
  "en": "according to",
  "t": "p",
  "es": "Enligt läraren är det rätt.",
  "ee": "According to the teacher it is correct.",
  "ch": 15,
  "lv": "A1",
  "wpm": 680.22
}, {
  "id": 232,
  "sv": "tänka",
  "en": "to think",
  "t": "v",
  "es": "Jag tänker på dig.",
  "ee": "I think about you.",
  "lv": "A1",
  "wpm": 666.7
}, {
  "id": 233,
  "sv": "ni",
  "en": "you (plural)",
  "t": "p",
  "es": "Ni kommer imorgon.",
  "ee": "You arrive tomorrow.",
  "ch": 1,
  "lv": "A1",
  "wpm": 665.01
}, {
  "id": 234,
  "sv": "viktig",
  "en": "important",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Det är en viktig fråga.",
  "ee": "It is an important question.",
  "ch": 6,
  "lv": "A1",
  "wpm": 662.11
}, {
  "id": 235,
  "sv": "ring",
  "en": "ring",
  "t": "n",
  "g": "en",
  "es": "Hon bär en ring.",
  "ee": "She wears a ring.",
  "lv": "A1",
  "wpm": 658.84
}, {
  "id": 236,
  "sv": "eftersom",
  "en": "because",
  "t": "s",
  "es": "Jag stannar eftersom jag är trött.",
  "ee": "I stay because I am tired.",
  "ch": 14,
  "lv": "A1",
  "wpm": 652.0
}, {
  "id": 237,
  "sv": "liv",
  "en": "life",
  "t": "n",
  "g": "ett",
  "c": "(-et, –, -en)",
  "es": "Livet är långt.",
  "ee": "Life is long.",
  "ch": 3,
  "lv": "A1",
  "wpm": 624.66
}, {
  "id": 238,
  "sv": "deras",
  "en": "their",
  "t": "p",
  "es": "Deras hus är stort.",
  "ee": "Their house is big.",
  "ch": 6,
  "lv": "A1",
  "wpm": 623.86
}, {
  "id": 239,
  "sv": "värld",
  "en": "world",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "Världen förändras.",
  "ee": "The world changes.",
  "ch": 13,
  "lv": "A1",
  "wpm": 617.89
}, {
  "id": 240,
  "sv": "viss",
  "en": "certain",
  "t": "a",
  "es": "En viss oro finns.",
  "ee": "A certain concern exists.",
  "lv": "A1",
  "wpm": 614.61
}, {
  "id": 241,
  "sv": "dock",
  "en": "however",
  "t": "a",
  "es": "Han kommer dock senare.",
  "ee": "He comes however later.",
  "lv": "A1",
  "wpm": 614.54
}, {
  "id": 242,
  "sv": "egen",
  "en": "own",
  "t": "a",
  "es": "Hon har en egen bil.",
  "ee": "She has her own car.",
  "lv": "A1",
  "wpm": 612.48
}, {
  "id": 243,
  "sv": "folk",
  "en": "people",
  "t": "n",
  "g": "ett",
  "es": "Det är mycket folk här.",
  "ee": "There are many people here.",
  "ch": 2,
  "lv": "A1",
  "wpm": 606.98
}, {
  "id": 244,
  "sv": "regering",
  "en": "government",
  "t": "n",
  "g": "en",
  "es": "Regeringen beslutar.",
  "ee": "The government decides.",
  "lv": "A1",
  "wpm": 603.37
}, {
  "id": 245,
  "sv": "fram",
  "en": "forward",
  "t": "p",
  "es": "Han går fram.",
  "ee": "He walks forward.",
  "lv": "A1",
  "wpm": 600.53
}, {
  "id": 246,
  "sv": "honom",
  "en": "him",
  "t": "p",
  "es": "Jag ser honom.",
  "ee": "I see him.",
  "ch": 6,
  "lv": "A1",
  "wpm": 597.56
}, {
  "id": 247,
  "sv": "söka",
  "en": "to search / apply",
  "t": "v",
  "c": "(-er, -te, -t)",
  "ch": 1,
  "lv": "A1",
  "wpm": 596.07
}, {
  "id": 248,
  "sv": "dig (vardagl. dej)",
  "en": "you (object)",
  "t": "p",
  "es": "Jag ser dig.",
  "ee": "I see you.",
  "lv": "A1",
  "wpm": 590.81
}, {
  "id": 249,
  "sv": "utan",
  "en": "but (rather)",
  "t": "c",
  "es": "Inte blå utan grön.",
  "ee": "Not blue but green.",
  "ch": 2,
  "lv": "A1",
  "wpm": 586.71
}, {
  "id": 250,
  "sv": "sak",
  "en": "thing",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Det är en viktig sak.",
  "ee": "It is an important thing.",
  "ch": 2,
  "lv": "A1",
  "wpm": 581.51
}, {
  "id": 251,
  "sv": "hög",
  "en": "high",
  "t": "a",
  "es": "Huset är högt.",
  "ee": "The house is tall.",
  "lv": "A1",
  "wpm": 578.03
}, {
  "id": 252,
  "sv": "länge",
  "en": "long time",
  "t": "a",
  "es": "Vi väntar länge.",
  "ee": "We wait a long time.",
  "lv": "A1",
  "wpm": 568.83
}, {
  "id": 253,
  "sv": "person",
  "en": "person",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Han är en snäll person.",
  "ee": "He is a kind person.",
  "ch": 1,
  "lv": "A1",
  "wpm": 568.43
}, {
  "id": 254,
  "sv": "ligga",
  "en": "to lie",
  "t": "v",
  "c": "(ligger, låg, legat)",
  "es": "Staden ligger vid havet.",
  "ee": "The city lies by the sea.",
  "ch": 1,
  "lv": "A1",
  "wpm": 566.6
}, {
  "id": 255,
  "sv": "son",
  "en": "son",
  "t": "n",
  "g": "en",
  "c": "(-en, söner, sönerna)",
  "es": "Han har en son.",
  "ee": "He has a son.",
  "ch": 1,
  "lv": "A1",
  "wpm": 560.93
}, {
  "id": 256,
  "sv": "både",
  "en": "both",
  "t": "c",
  "es": "Både du och jag kommer.",
  "ee": "Both you and I come.",
  "lv": "A1",
  "wpm": 554.95
}, {
  "id": 257,
  "sv": "just",
  "en": "just / exactly",
  "t": "a",
  "es": "Det är just det.",
  "ee": "That is exactly it.",
  "ch": 6,
  "lv": "A1",
  "wpm": 545.57
}, {
  "id": 258,
  "sv": "lägga",
  "en": "to put / lay",
  "t": "v",
  "c": "(lägger, la/lade, lagt)",
  "es": "Jag lägger boken här.",
  "ee": "I put the book here.",
  "ch": 3,
  "lv": "A1",
  "wpm": 545.17
}, {
  "id": 259,
  "sv": "antal",
  "en": "number / several",
  "t": "n",
  "g": "ett",
  "es": "Ett antal människor kom.",
  "ee": "A number of people came.",
  "lv": "A1",
  "wpm": 542.86
}, {
  "id": 260,
  "sv": "redan",
  "en": "already",
  "t": "a",
  "es": "Jag har redan ätit.",
  "ee": "I have already eaten.",
  "ch": 15,
  "lv": "A1",
  "wpm": 533.67
}, {
  "id": 261,
  "sv": "kvinna",
  "en": "woman",
  "t": "n",
  "g": "en",
  "c": "(-n, -or, -orna)",
  "es": "En kvinna talar.",
  "ee": "A woman speaks.",
  "ch": 1,
  "lv": "A1",
  "wpm": 521.11
}, {
  "id": 262,
  "sv": "problem",
  "en": "problem",
  "t": "n",
  "g": "ett",
  "c": "(-et, −, -en)",
  "es": "Problemet är svårt.",
  "ee": "The problem is difficult.",
  "ch": 13,
  "lv": "A1",
  "wpm": 520.62
}, {
  "id": 263,
  "sv": "fall",
  "en": "case / fall",
  "t": "n",
  "g": "ett",
  "es": "Det är ett svårt fall.",
  "ee": "It is a difficult case.",
  "lv": "A1",
  "wpm": 520.07
}, {
  "id": 264,
  "sv": "man",
  "en": "man",
  "t": "n",
  "g": "en",
  "c": "(-nen, män, männen)",
  "es": "En man står där.",
  "ee": "A man stands there.",
  "ch": 1,
  "lv": "A1",
  "wpm": 520.07
}, {
  "id": 265,
  "sv": "aldrig",
  "en": "never",
  "t": "a",
  "es": "Jag glömmer aldrig.",
  "ee": "I never forget.",
  "ch": 5,
  "lv": "A1",
  "wpm": 511.81
}, {
  "id": 266,
  "sv": "ofta",
  "en": "often",
  "t": "a",
  "es": "Vi går ofta dit.",
  "ee": "We often go there.",
  "ch": 2,
  "lv": "A1",
  "wpm": 501.79
}, {
  "id": 267,
  "sv": "varje",
  "en": "every",
  "t": "d",
  "es": "Jag arbetar varje dag.",
  "ee": "I work every day.",
  "ch": 6,
  "lv": "A1",
  "wpm": 501.7
}, {
  "id": 268,
  "sv": "artikel",
  "en": "article",
  "t": "n",
  "g": "en",
  "c": "(-n, artiklar, artiklarna)",
  "es": "Artikeln publiceras.",
  "ee": "The article is published.",
  "ch": 2,
  "lv": "A1",
  "wpm": 501.28
}, {
  "id": 269,
  "sv": "anse",
  "en": "to consider",
  "t": "v",
  "es": "De anser det viktigt.",
  "ee": "They consider it important.",
  "lv": "A1",
  "wpm": 500.58
}, {
  "id": 270,
  "sv": "öva",
  "en": "to practice",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Jag övar svenska.",
  "ee": "I practice Swedish.",
  "ch": 3,
  "lv": "A1",
  "wpm": 496.12
}, {
  "id": 271,
  "sv": "lag",
  "en": "team",
  "t": "n",
  "g": "ett",
  "es": "Lagen gäller.",
  "ee": "The law applies.",
  "lv": "A1",
  "wpm": 489.85
}, {
  "id": 272,
  "sv": "slag",
  "en": "kind / type",
  "t": "n",
  "g": "ett",
  "es": "Det är ett nytt slag.",
  "ee": "It is a new kind.",
  "lv": "A1",
  "wpm": 487.59
}, {
  "id": 273,
  "sv": "tal",
  "en": "speech",
  "t": "n",
  "g": "ett",
  "c": "(-et, –, -en)",
  "es": "Han höll ett tal.",
  "ee": "He gave a speech.",
  "ch": 3,
  "lv": "A1",
  "wpm": 485.93
}, {
  "id": 274,
  "sv": "åt",
  "en": "to / toward",
  "t": "p",
  "es": "Han gick åt vänster.",
  "ee": "He went to the left.",
  "lv": "A1",
  "wpm": 484.56
}, {
  "id": 275,
  "sv": "nog",
  "en": "probably / enough",
  "t": "a",
  "es": "Det är nog sant.",
  "ee": "It is probably true.",
  "lv": "A1",
  "wpm": 482.6
}, {
  "id": 276,
  "sv": "bok",
  "en": "book",
  "t": "n",
  "g": "en",
  "c": "(-en, böcker, böckerna)",
  "es": "Jag läser en bok.",
  "ee": "I read a book.",
  "ch": 1,
  "lv": "A1",
  "wpm": 478.59
}, {
  "id": 277,
  "sv": "varför",
  "en": "why",
  "t": "a",
  "es": "Varför går du?",
  "ee": "Why do you go?",
  "ch": 2,
  "lv": "A1",
  "wpm": 475.84
}, {
  "id": 278,
  "sv": "handla",
  "en": "to shop / act",
  "t": "v",
  "c": "(-r, -ade, -at)",
  "es": "Jag handlar mat.",
  "ee": "I shop for food.",
  "ch": 7,
  "lv": "A1",
  "wpm": 475.07
}, {
  "id": 279,
  "sv": "gammal",
  "en": "old",
  "t": "a",
  "c": "(-t, gamla)",
  "es": "Det är ett gammalt hus.",
  "ee": "It is an old house.",
  "ch": 3,
  "lv": "A1",
  "wpm": 470.38
}, {
  "id": 280,
  "sv": "bild",
  "en": "image",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Bilden är fin.",
  "ee": "The picture is nice.",
  "ch": 2,
  "lv": "A1",
  "wpm": 468.8
}, {
  "id": 281,
  "sv": "sida",
  "en": "page",
  "t": "n",
  "g": "en",
  "c": "(-n, -or, -orna)",
  "es": "Jag läser en sida.",
  "ee": "I read a page.",
  "ch": 1,
  "lv": "A1",
  "wpm": 466.09
}, {
  "id": 282,
  "sv": "så",
  "en": "so / such",
  "t": "s",
  "es": "Det är så kallt.",
  "ee": "It is so cold.",
  "ch": 2,
  "lv": "A1",
  "wpm": 465.43
}, {
  "id": 283,
  "sv": "öka",
  "en": "to increase",
  "t": "v",
  "es": "Priserna ökar.",
  "ee": "Prices increase.",
  "lv": "A1",
  "wpm": 462.83
}, {
  "id": 284,
  "sv": "därför",
  "en": "therefore",
  "t": "a",
  "es": "Jag är trött därför går jag.",
  "ee": "I am tired therefore I go.",
  "ch": 10,
  "lv": "A1",
  "wpm": 461.58
}, {
  "id": 285,
  "sv": "sen",
  "en": "then / later",
  "t": "a",
  "es": "Vi ses sen.",
  "ee": "See you later.",
  "lv": "A1",
  "wpm": 459.09
}, {
  "id": 286,
  "sv": "god",
  "en": "good",
  "t": "a",
  "c": "(gott, goda)",
  "es": "Maten är god.",
  "ee": "The food is good.",
  "ch": 2,
  "lv": "A1",
  "wpm": 453.87
}, {
  "id": 287,
  "sv": "hos",
  "en": "at / with",
  "t": "p",
  "es": "Jag bor hos henne.",
  "ee": "I live with her.",
  "lv": "A1",
  "wpm": 453.15
}, {
  "id": 288,
  "sv": "alltid",
  "en": "always",
  "t": "a",
  "es": "Hon är alltid glad.",
  "ee": "She is always happy.",
  "ch": 3,
  "lv": "A1",
  "wpm": 446.85
}, {
  "id": 289,
  "sv": "skapa",
  "en": "to create",
  "t": "v",
  "es": "Hon skapar konst.",
  "ee": "She creates art.",
  "lv": "A1",
  "wpm": 445.51
}, {
  "id": 290,
  "sv": "arbete",
  "en": "work",
  "t": "n",
  "g": "ett",
  "c": "(-t, -n, -ena)",
  "es": "Jag har mycket arbete.",
  "ee": "I have a lot of work.",
  "ch": 6,
  "lv": "A1",
  "wpm": 441.9
}, {
  "id": 291,
  "sv": "kapa",
  "en": "to cut",
  "t": "v",
  "es": "Han kapar trädet.",
  "ee": "He cuts the tree.",
  "lv": "A1",
  "wpm": 435.8
}, {
  "id": 292,
  "sv": "samt",
  "en": "and / as well as",
  "t": "c",
  "es": "Te samt kaffe serveras.",
  "ee": "Tea as well as coffee is served.",
  "lv": "A1",
  "wpm": 435.23
}, {
  "id": 293,
  "sv": "blogg",
  "en": "blog",
  "t": "n",
  "g": "en",
  "es": "Hon skriver en blogg.",
  "ee": "She writes a blog.",
  "lv": "A1",
  "wpm": 430.91
}, {
  "id": 294,
  "sv": "innan",
  "en": "before",
  "t": "s",
  "es": "Vi äter innan filmen.",
  "ee": "We eat before the movie.",
  "lv": "A1",
  "wpm": 429.65
}, {
  "id": 295,
  "sv": "som",
  "en": "who/that",
  "t": "a",
  "es": "Hon är personen som hjälper mig.",
  "ee": "She is the person who helps me.",
  "ch": 1,
  "lv": "A1",
  "wpm": 429.24
}, {
  "id": 296,
  "sv": "ur",
  "en": "out of",
  "t": "p",
  "es": "Han tog boken ur väskan.",
  "ee": "He took the book out of the bag.",
  "ch": 7,
  "lv": "A1",
  "wpm": 427.0
}, {
  "id": 297,
  "sv": "gälla",
  "en": "to apply / concern",
  "t": "v",
  "es": "Regeln gäller här.",
  "ee": "The rule applies here.",
  "lv": "A1",
  "wpm": 426.9
}, {
  "id": 298,
  "sv": "verka",
  "en": "to seem / appear",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Det verkar svårt.",
  "ee": "It seems difficult.",
  "ch": 11,
  "lv": "A1",
  "wpm": 423.62
}, {
  "id": 299,
  "sv": "tala",
  "en": "to speak",
  "t": "v",
  "c": "(talar, talade, talat)",
  "es": "Hon talar svenska.",
  "ee": "She speaks Swedish.",
  "ch": 1,
  "lv": "A1",
  "wpm": 423.1
}, {
  "id": 300,
  "sv": "bära",
  "en": "to carry / wear",
  "t": "v",
  "lv": "A1",
  "wpm": 422.35
}, {
  "id": 301,
  "sv": "för",
  "en": "for",
  "t": "a",
  "es": "Detta är för dig.",
  "ee": "This is for you.",
  "lv": "A1",
  "wpm": 421.08
}, {
  "id": 302,
  "sv": "väg",
  "en": "road",
  "t": "n",
  "g": "en",
  "c": "(-en , -ar, -arna)",
  "es": "Vi går på en lång väg.",
  "ee": "We walk on a long road.",
  "ch": 7,
  "lv": "A1",
  "wpm": 420.51
}, {
  "id": 303,
  "sv": "samhälle",
  "en": "society",
  "t": "n",
  "g": "ett",
  "c": "(-t, -en, -ena)",
  "es": "Samhället förändras.",
  "ee": "Society changes.",
  "ch": 18,
  "lv": "A1",
  "wpm": 420.38
}, {
  "id": 304,
  "sv": "alltså",
  "en": "therefore / so",
  "t": "a",
  "es": "Det är sent alltså går vi.",
  "ee": "It is late so we go.",
  "lv": "A1",
  "wpm": 419.06
}, {
  "id": 305,
  "sv": "stat",
  "en": "state",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Staten beslutar.",
  "ee": "The state decides.",
  "ch": 16,
  "lv": "A1",
  "wpm": 416.16
}, {
  "id": 306,
  "sv": "stad",
  "en": "city",
  "t": "n",
  "g": "en",
  "c": "(-en, städer, städerna)",
  "es": "Stockholm är en stor stad.",
  "ee": "Stockholm is a big city.",
  "ch": 2,
  "lv": "A1",
  "wpm": 413.66
}, {
  "id": 307,
  "sv": "höra",
  "en": "to hear",
  "t": "v",
  "c": "(hör, hörde, hört)",
  "ch": 1,
  "lv": "A1",
  "wpm": 412.78
}, {
  "id": 308,
  "sv": "innebära",
  "en": "to mean / imply",
  "t": "v",
  "es": "Det innebär ett problem.",
  "ee": "It means a problem.",
  "lv": "A1",
  "wpm": 412.65
}, {
  "id": 309,
  "sv": "genom att",
  "en": "by / by means of",
  "t": "s",
  "es": "Hon lär sig genom att läsa.",
  "ee": "She learns by reading.",
  "ch": 16,
  "lv": "A1",
  "wpm": 412.39
}, {
  "id": 310,
  "sv": "företag",
  "en": "company",
  "t": "n",
  "g": "ett",
  "c": "(-et, –, -en)",
  "es": "Företaget växer.",
  "ee": "The company grows.",
  "ch": 2,
  "lv": "A1",
  "wpm": 412.18
}, {
  "id": 311,
  "sv": "möjlighet",
  "en": "opportunity",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Det finns en möjlighet.",
  "ee": "There is a possibility.",
  "ch": 20,
  "lv": "A1",
  "wpm": 411.21
}, {
  "id": 312,
  "sv": "ord",
  "en": "word",
  "t": "n",
  "g": "ett",
  "c": "(-et, –, -en)",
  "es": "Det är ett svårt ord.",
  "ee": "That is a difficult word.",
  "ch": 1,
  "lv": "A1",
  "wpm": 410.3
}, {
  "id": 313,
  "sv": "politisk",
  "en": "political",
  "t": "a",
  "es": "Det är en politisk fråga.",
  "ee": "It is a political question.",
  "lv": "A1",
  "wpm": 409.23
}, {
  "id": 314,
  "sv": "välja",
  "en": "to choose",
  "t": "v",
  "es": "Jag väljer kaffe.",
  "ee": "I choose coffee.",
  "lv": "A1",
  "wpm": 403.72
}, {
  "id": 315,
  "sv": "er",
  "en": "you (plural object)",
  "t": "p",
  "es": "Jag ser er.",
  "ee": "I see you.",
  "ch": 2,
  "lv": "A1",
  "wpm": 403.6
}, {
  "id": 316,
  "sv": "förstå",
  "en": "to understand",
  "t": "v",
  "c": "(förstår, förstod, förstått)",
  "es": "Jag förstår dig.",
  "ee": "I understand you.",
  "ch": 2,
  "lv": "A1",
  "wpm": 403.12
}, {
  "id": 317,
  "sv": "inlägg",
  "en": "post / entry",
  "t": "n",
  "g": "ett",
  "es": "Hon skrev ett inlägg.",
  "ee": "She wrote a post.",
  "lv": "A1",
  "wpm": 403.03
}, {
  "id": 318,
  "sv": "ägg",
  "en": "egg",
  "t": "n",
  "g": "ett",
  "c": "(-et, −, -en)",
  "es": "Jag äter ett ägg.",
  "ee": "I eat an egg.",
  "ch": 15,
  "lv": "A1",
  "wpm": 403.03
}, {
  "id": 319,
  "sv": "te",
  "en": "tea",
  "t": "n",
  "g": "ett",
  "c": "(-et, -er-, -erna)",
  "es": "Hon dricker te.",
  "ee": "She drinks tea.",
  "ch": 4,
  "lv": "A1",
  "wpm": 401.97
}, {
  "id": 320,
  "sv": "spela",
  "en": "to play",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "De spelar fotboll.",
  "ee": "They play football.",
  "ch": 3,
  "lv": "A1",
  "wpm": 401.87
}, {
  "id": 321,
  "sv": "så att",
  "en": "so that",
  "t": "s",
  "es": "Jag talar långsamt så att du förstår.",
  "ee": "I speak slowly so that you understand.",
  "lv": "A1",
  "wpm": 400.31
}, {
  "id": 322,
  "sv": "lika",
  "en": "like / equally",
  "t": "a",
  "es": "Husen är lika.",
  "ee": "The houses are alike.",
  "lv": "A1",
  "wpm": 394.25
}, {
  "id": 323,
  "sv": "hitta",
  "en": "to find",
  "t": "v",
  "es": "Jag hittar boken.",
  "ee": "I find the book.",
  "lv": "A1",
  "wpm": 390.73
}, {
  "id": 324,
  "sv": "tag",
  "en": "while",
  "t": "n",
  "g": "ett",
  "es": "Vänta ett tag.",
  "ee": "Wait a while.",
  "lv": "A1",
  "wpm": 390.12
}, {
  "id": 325,
  "sv": "dra",
  "en": "to pull / leave",
  "t": "v",
  "c": "(-r, drog, dragit)",
  "es": "Han drar dörren.",
  "ee": "He pulls the door.",
  "ch": 6,
  "lv": "A1",
  "wpm": 389.89
}, {
  "id": 326,
  "sv": "leda",
  "en": "to lead",
  "t": "v",
  "lv": "A1",
  "wpm": 388.53
}, {
  "id": 327,
  "sv": "gärna",
  "en": "gladly / gladly",
  "t": "a",
  "es": "Jag kommer gärna.",
  "ee": "I gladly come.",
  "lv": "A1",
  "wpm": 387.27
}, {
  "id": 328,
  "sv": "ändå",
  "en": "still / anyway",
  "t": "a",
  "es": "Jag går ändå.",
  "ee": "I go anyway.",
  "lv": "A1",
  "wpm": 386.11
}, {
  "id": 329,
  "sv": "förslag",
  "en": "suggestion",
  "t": "n",
  "g": "ett",
  "c": "(-et, –, -en)",
  "es": "Han ger ett förslag.",
  "ee": "He gives a suggestion.",
  "ch": 2,
  "lv": "A1",
  "wpm": 385.31
}, {
  "id": 330,
  "sv": "lyckas",
  "en": "to succeed",
  "t": "v",
  "es": "Hon lyckas bra.",
  "ee": "She succeeds well.",
  "lv": "A1",
  "wpm": 384.14
}, {
  "id": 331,
  "sv": "dessutom",
  "en": "moreover / also",
  "t": "a",
  "es": "Han arbetar och studerar dessutom.",
  "ee": "He works and also studies.",
  "ch": 17,
  "lv": "A1",
  "wpm": 381.45
}, {
  "id": 332,
  "sv": "område",
  "en": "area",
  "t": "n",
  "g": "ett",
  "es": "Det är ett stort område.",
  "ee": "It is a large area.",
  "lv": "A1",
  "wpm": 380.95
}, {
  "id": 333,
  "sv": "lag",
  "en": "team",
  "t": "n",
  "g": "en",
  "es": "Lagen gäller.",
  "ee": "The law applies.",
  "lv": "A1",
  "wpm": 380.83
}, {
  "id": 334,
  "sv": "svår",
  "en": "difficult",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Uppgiften är svår.",
  "ee": "The task is difficult.",
  "ch": 5,
  "lv": "A1",
  "wpm": 379.67
}, {
  "id": 335,
  "sv": "lära",
  "en": "to learn",
  "t": "v",
  "lv": "A1",
  "wpm": 376.66
}, {
  "id": 336,
  "sv": "sätta",
  "en": "to put / set",
  "t": "v",
  "c": "(-er, satte, satt)",
  "es": "Hon sätter boken här.",
  "ee": "She puts the book here.",
  "ch": 1,
  "lv": "A1",
  "wpm": 375.3
}, {
  "id": 337,
  "sv": "plats",
  "en": "place",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Vi hittar en plats.",
  "ee": "We find a place.",
  "ch": 3,
  "lv": "A1",
  "wpm": 374.33
}, {
  "id": 338,
  "sv": "lång",
  "en": "long",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Resan är lång.",
  "ee": "The trip is long.",
  "ch": 1,
  "lv": "A1",
  "wpm": 372.0
}, {
  "id": 339,
  "sv": "lämna",
  "en": "to leave",
  "t": "v",
  "c": "(-r, -ade, -t)",
  "es": "Han lämnar huset.",
  "ee": "He leaves the house.",
  "ch": 7,
  "lv": "A1",
  "wpm": 369.7
}, {
  "id": 340,
  "sv": "bygga",
  "en": "to build",
  "t": "v",
  "c": "(-er, -de, -t)",
  "es": "De bygger ett hus.",
  "ee": "They build a house.",
  "ch": 6,
  "lv": "A1",
  "wpm": 368.34
}, {
  "id": 341,
  "sv": "politik",
  "en": "politics",
  "t": "n",
  "g": "en",
  "c": "(-en)",
  "es": "Hon studerar politik.",
  "ee": "She studies politics.",
  "ch": 10,
  "lv": "A1",
  "wpm": 367.14
}, {
  "id": 342,
  "sv": "tidigare",
  "en": "earlier",
  "t": "a",
  "es": "Han kom tidigare.",
  "ee": "He came earlier.",
  "ch": 12,
  "lv": "A1",
  "wpm": 366.98
}, {
  "id": 343,
  "sv": "kalla",
  "en": "to call",
  "t": "v",
  "es": "Vi kallar honom Erik.",
  "ee": "We call him Erik.",
  "lv": "A1",
  "wpm": 365.74
}, {
  "id": 344,
  "sv": "peng",
  "en": "money",
  "t": "n",
  "g": "en",
  "es": "J ag har lite pengar.",
  "ee": "I have some money.",
  "lv": "A1",
  "wpm": 365.1
}, {
  "id": 345,
  "sv": "väldigt",
  "en": "very",
  "t": "a",
  "es": "Det är väldigt kallt.",
  "ee": "It is very cold.",
  "lv": "A1",
  "wpm": 363.6
}, {
  "id": 346,
  "sv": "leva",
  "en": "to live",
  "t": "v",
  "lv": "A1",
  "wpm": 363.55
}, {
  "id": 347,
  "sv": "ställa",
  "en": "to place / ask",
  "t": "v",
  "c": "(ställer, ställde, ställt)",
  "es": "Hon ställer en fråga.",
  "ee": "She asks a question.",
  "ch": 7,
  "lv": "A1",
  "wpm": 361.06
}, {
  "id": 348,
  "sv": "följa",
  "en": "to follow",
  "t": "v",
  "c": "(-er, -de, -t)",
  "es": "Jag följer honom.",
  "ee": "I follow him.",
  "ch": 4,
  "lv": "A1",
  "wpm": 359.7
}, {
  "id": 349,
  "sv": "vecka",
  "en": "week",
  "t": "n",
  "g": "en",
  "c": "(-n, -or, -orna)",
  "es": "Vi ses nästa vecka.",
  "ee": "We meet next week.",
  "ch": 2,
  "lv": "A1",
  "wpm": 357.71
}, {
  "id": 350,
  "sv": "ja",
  "en": "yes",
  "t": "i",
  "es": "Ja, jag kommer.",
  "ee": "Yes, I will come.",
  "ch": 1,
  "lv": "A1",
  "wpm": 353.15
}, {
  "id": 351,
  "sv": "ske",
  "en": "to happen",
  "t": "v",
  "es": "Det sker snart.",
  "ee": "It happens soon.",
  "lv": "A1",
  "wpm": 351.8
}, {
  "id": 352,
  "sv": "parti",
  "en": "party",
  "t": "n",
  "g": "ett",
  "es": "Ett parti vinner valet.",
  "ee": "A party wins the election.",
  "lv": "A1",
  "wpm": 348.11
}, {
  "id": 353,
  "sv": "kräva",
  "en": "to demand / require",
  "t": "v",
  "es": "Jobbet kräver tid.",
  "ee": "The job requires time.",
  "lv": "A1",
  "wpm": 347.5
}, {
  "id": 354,
  "sv": "utveckling",
  "en": "development",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "Utvecklingen går snabbt.",
  "ee": "The development goes quickly.",
  "ch": 13,
  "lv": "A1",
  "wpm": 341.81
}, {
  "id": 355,
  "sv": "faktiskt",
  "en": "actually",
  "t": "a",
  "es": "Det är faktiskt sant.",
  "ee": "It is actually true.",
  "ch": 2,
  "lv": "A1",
  "wpm": 341.44
}, {
  "id": 356,
  "sv": "ena",
  "en": "to unite",
  "t": "v",
  "es": "De enar gruppen.",
  "ee": "They unite the group.",
  "lv": "A1",
  "wpm": 340.46
}, {
  "id": 357,
  "sv": "svara",
  "en": "to answer",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Hon svarar snabbt.",
  "ee": "She answers quickly.",
  "ch": 1,
  "lv": "A1",
  "wpm": 339.8
}, {
  "id": 358,
  "sv": "ner",
  "en": "down",
  "t": "p",
  "es": "Hunden går ner.",
  "ee": "The dog goes down.",
  "ch": 2,
  "lv": "A1",
  "wpm": 339.66
}, {
  "id": 359,
  "sv": "fortsätta",
  "en": "to continue",
  "t": "v",
  "c": "(fortsätter, fortsatte, fortsatt)",
  "es": "Vi fortsätter arbetet.",
  "ee": "We continue the work.",
  "ch": 6,
  "lv": "A1",
  "wpm": 337.29
}, {
  "id": 360,
  "sv": "skola",
  "en": "school",
  "t": "n",
  "g": "en",
  "c": "(-n, -or, -orna)",
  "es": "Barnen går till skolan.",
  "ee": "The children go to school.",
  "ch": 3,
  "lv": "A1",
  "wpm": 334.72
}, {
  "id": 361,
  "sv": "bruka",
  "en": "to use / usually",
  "t": "v",
  "c": "(-ade, har brukat)",
  "es": "Jag brukar gå hit.",
  "ee": "I usually go here.",
  "ch": 5,
  "lv": "A1",
  "wpm": 334.18
}, {
  "id": 362,
  "sv": "mål",
  "en": "goal",
  "t": "n",
  "g": "ett",
  "es": "Han gör ett mål.",
  "ee": "He scores a goal.",
  "lv": "A1",
  "wpm": 331.84
}, {
  "id": 363,
  "sv": "par",
  "en": "pair / couple",
  "t": "n",
  "g": "ett",
  "c": "(-et, –, -en)",
  "es": "Ett par skor ligger där.",
  "ee": "A pair of shoes lies there.",
  "ch": 1,
  "lv": "A1",
  "wpm": 331.61
}, {
  "id": 364,
  "sv": "sent",
  "en": "late",
  "t": "a",
  "es": "Det är sent.",
  "ee": "It is late.",
  "lv": "A1",
  "wpm": 330.39
}, {
  "id": 365,
  "sv": "ekonomisk",
  "en": "economic",
  "t": "a",
  "es": "Det är ett ekonomiskt problem.",
  "ee": "It is an economic problem.",
  "lv": "A1",
  "wpm": 327.88
}, {
  "id": 367,
  "sv": "dålig",
  "en": "bad",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Det är dåligt väder.",
  "ee": "It is bad weather.",
  "ch": 2,
  "lv": "A1",
  "wpm": 323.94
}, {
  "id": 368,
  "sv": "namn",
  "en": "name",
  "t": "n",
  "g": "ett",
  "c": "(-et, –, -en)",
  "es": "Jag skriver mitt namn.",
  "ee": "I write my name.",
  "ch": 1,
  "lv": "A1",
  "wpm": 323.21
}, {
  "id": 369,
  "sv": "igen",
  "en": "again",
  "t": "a",
  "es": "Vi ses igen.",
  "ee": "We meet again.",
  "lv": "A1",
  "wpm": 321.76
}, {
  "id": 370,
  "sv": "verkligen",
  "en": "really",
  "t": "a",
  "es": "Det är verkligen bra.",
  "ee": "It is really good.",
  "ch": 9,
  "lv": "A1",
  "wpm": 321.76
}, {
  "id": 371,
  "sv": "mena",
  "en": "to mean",
  "t": "v",
  "es": "Jag menar det.",
  "ee": "I mean it.",
  "lv": "A1",
  "wpm": 320.45
}, {
  "id": 372,
  "sv": "fortfarande",
  "en": "still",
  "t": "a",
  "es": "Han arbetar fortfarande.",
  "ee": "He still works.",
  "ch": 17,
  "lv": "A1",
  "wpm": 319.39
}, {
  "id": 373,
  "sv": "grupp",
  "en": "group",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "En grupp kommer.",
  "ee": "A group arrives.",
  "ch": 1,
  "lv": "A1",
  "wpm": 315.91
}, {
  "id": 374,
  "sv": "beslut",
  "en": "decision",
  "t": "n",
  "g": "ett",
  "es": "Regeringen fattar ett beslut.",
  "ee": "The government makes a decision.",
  "lv": "A1",
  "wpm": 315.74
}, {
  "id": 375,
  "sv": "även om",
  "en": "even if",
  "t": "s",
  "es": "Jag går även om det regnar.",
  "ee": "I go even if it rains.",
  "lv": "A1",
  "wpm": 314.71
}, {
  "id": 376,
  "sv": "enda",
  "en": "only / single",
  "t": "a",
  "es": "Det är den enda vägen.",
  "ee": "It is the only road.",
  "lv": "A1",
  "wpm": 314.53
}, {
  "id": 377,
  "sv": "bort",
  "en": "away",
  "t": "p",
  "es": "Han går bort.",
  "ee": "He goes away.",
  "lv": "A1",
  "wpm": 313.64
}, {
  "id": 378,
  "sv": "slå",
  "en": "to hit / beat",
  "t": "v",
  "c": "(-r, slog, slagit)",
  "es": "Han slår bollen.",
  "ee": "He hits the ball.",
  "ch": 4,
  "lv": "A1",
  "wpm": 312.71
}, {
  "id": 379,
  "sv": "möjlig",
  "en": "possible",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Det är möjligt.",
  "ee": "It is possible.",
  "ch": 18,
  "lv": "A1",
  "wpm": 310.72
}, {
  "id": 380,
  "sv": "många",
  "en": "many",
  "t": "p",
  "es": "Många människor kommer.",
  "ee": "Many people come.",
  "ch": 5,
  "lv": "A1",
  "wpm": 310.01
}, {
  "id": 381,
  "sv": "hända",
  "en": "to happen",
  "t": "v",
  "c": "(-er, -de, -t)",
  "es": "Det händer ibland.",
  "ee": "It happens sometimes.",
  "ch": 14,
  "lv": "A1",
  "wpm": 307.66
}, {
  "id": 382,
  "sv": "ämna",
  "en": "to intend",
  "t": "a",
  "es": "Jag ämnar resa.",
  "ee": "I intend to travel.",
  "lv": "A1",
  "wpm": 307.66
}, {
  "id": 383,
  "sv": "endast",
  "en": "only",
  "t": "a",
  "es": "Endast två personer kom.",
  "ee": "Only two people came.",
  "lv": "A1",
  "wpm": 302.17
}, {
  "id": 384,
  "sv": "miljon",
  "en": "million",
  "t": "n",
  "g": "en",
  "es": "Staden har en miljon invånare.",
  "ee": "The city has one million inhabitants.",
  "lv": "A1",
  "wpm": 301.59
}, {
  "id": 385,
  "sv": "vidare",
  "en": "further",
  "t": "a",
  "es": "Vi går vidare.",
  "ee": "We go further.",
  "lv": "A1",
  "wpm": 297.7
}, {
  "id": 386,
  "sv": "ganska",
  "en": "rather / quite",
  "t": "a",
  "es": "Det är ganska bra.",
  "ee": "It is quite good.",
  "lv": "A1",
  "wpm": 295.35
}, {
  "id": 387,
  "sv": "svar",
  "en": "answer",
  "t": "n",
  "g": "ett",
  "c": "(-et, −, -en)",
  "es": "Hon ger ett svar.",
  "ee": "She gives an answer.",
  "ch": 11,
  "lv": "A1",
  "wpm": 291.65
}, {
  "id": 388,
  "sv": "varenda",
  "en": "every single",
  "t": "d",
  "es": "Varenda dag arbetar han.",
  "ee": "Every single day he works.",
  "lv": "A1",
  "wpm": 291.39
}, {
  "id": 389,
  "sv": "istället (el. i stället)",
  "en": "instead",
  "t": "a",
  "es": "Vi går hem istället.",
  "ee": "We go home instead.",
  "lv": "A1",
  "wpm": 291.38
}, {
  "id": 390,
  "sv": "först",
  "en": "first",
  "t": "a",
  "es": "Vi äter först.",
  "ee": "We eat first.",
  "lv": "A1",
  "wpm": 290.35
}, {
  "id": 391,
  "sv": "arbeta",
  "en": "to work",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Jag arbetar här.",
  "ee": "I work here.",
  "ch": 1,
  "lv": "A1",
  "wpm": 289.93
}, {
  "id": 392,
  "sv": "heller",
  "en": "either / neither",
  "t": "a",
  "es": "Jag vill inte heller.",
  "ee": "I don't want to either.",
  "lv": "A1",
  "wpm": 288.81
}, {
  "id": 393,
  "sv": "riktigt",
  "en": "really / properly",
  "t": "a",
  "es": "Det är riktigt bra.",
  "ee": "It is really good.",
  "lv": "A1",
  "wpm": 288.62
}, {
  "id": 394,
  "sv": "hand",
  "en": "hand",
  "t": "n",
  "g": "en",
  "c": "(-en, händer, händerna)",
  "es": "Hon håller min hand.",
  "ee": "She holds my hand.",
  "ch": 15,
  "lv": "A1",
  "wpm": 288.6
}, {
  "id": 395,
  "sv": "uppgift",
  "en": "assignment",
  "t": "n",
  "g": "en",
  "es": "Uppgiften är svår.",
  "ee": "The assignment is difficult.",
  "lv": "A1",
  "wpm": 287.98
}, {
  "id": 396,
  "sv": "fungera (vardagl. funka)",
  "en": "to function",
  "t": "v",
  "es": "Maskinen fungerar.",
  "ee": "The machine works.",
  "lv": "A1",
  "wpm": 287.4
}, {
  "id": 397,
  "sv": "beta",
  "en": "to graze",
  "t": "v",
  "es": "Korna betar.",
  "ee": "The cows graze.",
  "lv": "A1",
  "wpm": 286.58
}, {
  "id": 398,
  "sv": "köpa",
  "en": "to buy",
  "t": "v",
  "c": "(-er, -te, -t)",
  "ch": 4,
  "lv": "A1",
  "wpm": 284.11
}, {
  "id": 399,
  "sv": "nästan",
  "en": "almost",
  "t": "a",
  "es": "Jag är nästan klar.",
  "ee": "I am almost finished.",
  "ch": 3,
  "lv": "A1",
  "wpm": 284.0
}, {
  "id": 400,
  "sv": "bra",
  "en": "good",
  "t": "a",
  "es": "Det är bra.",
  "ee": "It is good.",
  "lv": "A1",
  "wpm": 283.65
}, {
  "id": 401,
  "sv": "bland",
  "en": "among",
  "t": "p",
  "es": "Boken ligger bland pappren.",
  "ee": "The book lies among the papers.",
  "ch": 20,
  "lv": "A1",
  "wpm": 282.47
}, {
  "id": 402,
  "sv": "december",
  "en": "December",
  "t": "n",
  "es": "Vi ses i december.",
  "ee": "We meet in December.",
  "ch": 6,
  "lv": "A1",
  "wpm": 280.83
}, {
  "id": 403,
  "sv": "sitta",
  "en": "to sit",
  "t": "v",
  "c": "(sitter, satt, suttit)",
  "es": "Han sitter vid bordet.",
  "ee": "He sits at the table.",
  "ch": 11,
  "lv": "A1",
  "wpm": 280.32
}, {
  "id": 404,
  "sv": "precis",
  "en": "exactly / just",
  "t": "a",
  "es": "Det är precis rätt.",
  "ee": "It is exactly right.",
  "ch": 2,
  "lv": "A1",
  "wpm": 277.18
}, {
  "id": 405,
  "sv": "hennes",
  "en": "her",
  "t": "p",
  "es": "Det är hennes bok.",
  "ee": "It is her book.",
  "ch": 5,
  "lv": "A1",
  "wpm": 275.94
}, {
  "id": 406,
  "sv": "åta sig",
  "en": "to undertake",
  "t": "v",
  "es": "Hon åtar sig arbetet.",
  "ee": "She undertakes the work.",
  "lv": "A1",
  "wpm": 275.39
}, {
  "id": 407,
  "sv": "bland annat (förk. bl.a.)",
  "en": "among other things",
  "t": "a",
  "es": "Vi talar om Sverige bland annat.",
  "ee": "We talk about Sweden among other things.",
  "lv": "A1",
  "wpm": 275.2
}, {
  "id": 408,
  "sv": "krig",
  "en": "war",
  "t": "n",
  "g": "ett",
  "es": "Kriget tog slut.",
  "ee": "The war ended.",
  "lv": "A1",
  "wpm": 275.09
}, {
  "id": 409,
  "sv": "till exempel (förk. t.ex., t ex)",
  "en": "for example",
  "t": "a",
  "es": "Vi läser svenska till exempel.",
  "ee": "We study Swedish for example.",
  "lv": "A1",
  "wpm": 274.97
}, {
  "id": 410,
  "sv": "tillsammans",
  "en": "together",
  "t": "a",
  "es": "Vi arbetar tillsammans.",
  "ee": "We work together.",
  "ch": 2,
  "lv": "A1",
  "wpm": 274.88
}, {
  "id": 411,
  "sv": "henne",
  "en": "her (object)",
  "t": "p",
  "es": "Jag ser henne.",
  "ee": "I see her.",
  "ch": 6,
  "lv": "A1",
  "wpm": 272.82
}, {
  "id": 412,
  "sv": "intressant",
  "en": "interesting",
  "t": "a",
  "c": "(-a)",
  "es": "Filmen är intressant.",
  "ee": "The movie is interesting.",
  "ch": 5,
  "lv": "A1",
  "wpm": 272.16
}, {
  "id": 413,
  "sv": "val",
  "en": "election",
  "t": "n",
  "g": "ett",
  "es": "Valet är viktigt.",
  "ee": "The election is important.",
  "lv": "A1",
  "wpm": 269.93
}, {
  "id": 414,
  "sv": "kyrka",
  "en": "church",
  "t": "n",
  "g": "en",
  "c": "(-n, -or, -orna)",
  "es": "Kyrkan är gammal.",
  "ee": "The church is old.",
  "ch": 5,
  "lv": "A1",
  "wpm": 268.45
}, {
  "id": 415,
  "sv": "egentligen",
  "en": "actually",
  "t": "a",
  "es": "Egentligen vill jag gå hem.",
  "ee": "Actually I want to go home.",
  "lv": "A1",
  "wpm": 267.44
}, {
  "id": 416,
  "sv": "inför",
  "en": "before / ahead of",
  "t": "p",
  "es": "De talar inför publiken.",
  "ee": "They speak before the audience.",
  "lv": "A1",
  "wpm": 267.33
}, {
  "id": 417,
  "sv": "historia",
  "en": "history",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Han berättar en historia.",
  "ee": "He tells a story.",
  "ch": 8,
  "lv": "A1",
  "wpm": 267.25
}, {
  "id": 418,
  "sv": "jobb",
  "en": "job",
  "t": "n",
  "g": "ett",
  "c": "(-et, –, -en)",
  "es": "Hon har ett nytt jobb.",
  "ee": "She has a new job.",
  "ch": 1,
  "lv": "A1",
  "wpm": 266.97
}, {
  "id": 419,
  "sv": "berätta",
  "en": "to tell",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Hon berättar en historia.",
  "ee": "She tells a story.",
  "ch": 3,
  "lv": "A1",
  "wpm": 266.34
}, {
  "id": 420,
  "sv": "vanlig",
  "en": "usual / common",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Det är en vanlig dag.",
  "ee": "It is a normal day.",
  "ch": 2,
  "lv": "A1",
  "wpm": 265.84
}, {
  "id": 421,
  "sv": "rätta",
  "en": "to correct",
  "t": "v",
  "es": "Läraren rättar provet.",
  "ee": "The teacher corrects the test.",
  "lv": "A1",
  "wpm": 265.36
}, {
  "id": 422,
  "sv": "januari",
  "en": "January",
  "t": "n",
  "es": "Snön faller i januari.",
  "ee": "Snow falls in January.",
  "ch": 8,
  "lv": "A1",
  "wpm": 264.41
}, {
  "id": 423,
  "sv": "information",
  "en": "information",
  "t": "n",
  "g": "en",
  "c": "(-en)",
  "es": "Vi får information.",
  "ee": "We receive information.",
  "ch": 12,
  "lv": "A1",
  "wpm": 264.14
}, {
  "id": 424,
  "sv": "flest",
  "en": "most",
  "t": "a",
  "es": "Flest personer kommer.",
  "ee": "Most people come.",
  "lv": "A1",
  "wpm": 262.77
}, {
  "id": 425,
  "sv": "ung",
  "en": "young",
  "t": "a",
  "es": "Hon är ung.",
  "ee": "She is young.",
  "lv": "A1",
  "wpm": 260.53
}, {
  "id": 426,
  "sv": "en",
  "en": "a/an",
  "t": "p",
  "es": "Jag ser en hund.",
  "ee": "I see a dog.",
  "ch": 1,
  "lv": "A1",
  "wpm": 260.31
}, {
  "id": 427,
  "sv": "tillbaka (vardagl. tillbaks)",
  "en": "back",
  "t": "p",
  "es": "Han kommer tillbaka.",
  "ee": "He comes back.",
  "lv": "A1",
  "wpm": 259.58
}, {
  "id": 428,
  "sv": "film",
  "en": "film",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Vi ser en film.",
  "ee": "We watch a film.",
  "ch": 3,
  "lv": "A1",
  "wpm": 258.67
}, {
  "id": 429,
  "sv": "ibland (el. i bland)",
  "en": "sometimes",
  "t": "a",
  "es": "Jag går dit ibland.",
  "ee": "I go there sometimes.",
  "lv": "A1",
  "wpm": 258.58
}, {
  "id": 430,
  "sv": "medan (vardagl. medans)",
  "en": "while",
  "t": "s",
  "es": "Hon läser medan jag skriver.",
  "ee": "She reads while I write.",
  "lv": "A1",
  "wpm": 257.43
}, {
  "id": 431,
  "sv": "slut",
  "en": "end",
  "t": "n",
  "g": "ett",
  "es": "Filmen har ett slut.",
  "ee": "The film has an end.",
  "lv": "A1",
  "wpm": 256.6
}, {
  "id": 432,
  "sv": "massa",
  "en": "a lot",
  "t": "n",
  "g": "en",
  "c": "(-n, -or, orna)",
  "es": "Det finns en massa böcker.",
  "ee": "There are a lot of books.",
  "ch": 6,
  "lv": "A1",
  "wpm": 255.87
}, {
  "id": 433,
  "sv": "tanke",
  "en": "thought",
  "t": "n",
  "g": "en",
  "es": "Tanken utvecklas.",
  "ee": "The thought develops.",
  "lv": "A1",
  "wpm": 251.61
}, {
  "id": 434,
  "sv": "akt",
  "en": "act (stage)",
  "t": "n",
  "g": "en",
  "es": "Pjäsen har tre akter.",
  "ee": "The play has three acts.",
  "lv": "A1",
  "wpm": 251.45
}, {
  "id": 435,
  "sv": "procent",
  "en": "percent",
  "t": "n",
  "g": "en",
  "c": "(-en)",
  "es": "Priset ökar en procent.",
  "ee": "The price increases one percent.",
  "ch": 7,
  "lv": "A1",
  "wpm": 251.21
}, {
  "id": 436,
  "sv": "månad",
  "en": "month",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Vi väntar en månad.",
  "ee": "We wait a month.",
  "ch": 7,
  "lv": "A1",
  "wpm": 251.14
}, {
  "id": 437,
  "sv": "sista",
  "en": "last",
  "t": "a",
  "es": "Det är sista dagen.",
  "ee": "It is the last day.",
  "lv": "A1",
  "wpm": 250.04
}, {
  "id": 438,
  "sv": "ätt",
  "en": "clan / lineage",
  "t": "n",
  "g": "en",
  "es": "Han tillhör en gammal ätt.",
  "ee": "He belongs to an old lineage.",
  "lv": "A1",
  "wpm": 249.91
}, {
  "id": 439,
  "sv": "sluta",
  "en": "to stop",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Jag slutar arbeta.",
  "ee": "I stop working.",
  "ch": 3,
  "lv": "A1",
  "wpm": 249.47
}, {
  "id": 440,
  "sv": "verksamhet",
  "en": "activity / operation",
  "t": "n",
  "g": "en",
  "es": "Företaget har stor verksamhet.",
  "ee": "The company has large operations.",
  "lv": "A1",
  "wpm": 249.2
}, {
  "id": 441,
  "sv": "rätt",
  "en": "dish / right",
  "t": "n",
  "g": "en",
  "es": "Jag beställer en rätt.",
  "ee": "I order a dish.",
  "lv": "A1",
  "wpm": 249.15
}, {
  "id": 442,
  "sv": "samtidigt",
  "en": "at the same time",
  "t": "a",
  "es": "Han arbetar samtidigt.",
  "ee": "He works at the same time.",
  "lv": "A1",
  "wpm": 247.54
}, {
  "id": 443,
  "sv": "emot",
  "en": "against / toward",
  "t": "p",
  "es": "Han går emot vinden.",
  "ee": "He walks against the wind.",
  "ch": 17,
  "lv": "A1",
  "wpm": 247.28
}, {
  "id": 444,
  "sv": "stöd",
  "en": "support",
  "t": "n",
  "g": "ett",
  "c": "(-et, −, -en)",
  "es": "Stödet fortsätter.",
  "ee": "The support continues.",
  "ch": 20,
  "lv": "A1",
  "wpm": 244.26
}, {
  "id": 445,
  "sv": "familj",
  "en": "family",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Min familj bor här.",
  "ee": "My family lives here.",
  "ch": 2,
  "lv": "A1",
  "wpm": 244.19
}, {
  "id": 446,
  "sv": "vem",
  "en": "who",
  "t": "p",
  "es": "Vem kommer?",
  "ee": "Who comes?",
  "lv": "A1",
  "wpm": 243.27
}, {
  "id": 447,
  "sv": "åka",
  "en": "to travel / go",
  "t": "v",
  "c": "(-er, -te, -t)",
  "ch": 5,
  "lv": "A1",
  "wpm": 243.14
}, {
  "id": 448,
  "sv": "betala",
  "en": "to pay",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Jag betalar maten.",
  "ee": "I pay for the food.",
  "ch": 17,
  "lv": "A1",
  "wpm": 242.04
}, {
  "id": 449,
  "sv": "kommun",
  "en": "municipality",
  "t": "n",
  "g": "en",
  "es": "Kommunen bygger en skola.",
  "ee": "The municipality builds a school.",
  "lv": "A1",
  "wpm": 242.01
}, {
  "id": 450,
  "sv": "resultat",
  "en": "result",
  "t": "n",
  "g": "ett",
  "c": "(-et, −, -en)",
  "es": "Resultatet publiceras.",
  "ee": "The result is published.",
  "ch": 20,
  "lv": "A1",
  "wpm": 241.96
}, {
  "id": 451,
  "sv": "utveckla",
  "en": "to develop",
  "t": "v",
  "es": "Företaget utvecklar teknik.",
  "ee": "The company develops technology.",
  "lv": "A1",
  "wpm": 241.91
}, {
  "id": 452,
  "sv": "föra",
  "en": "to lead / carry",
  "t": "v",
  "lv": "A1",
  "wpm": 240.44
}, {
  "id": 453,
  "sv": "hjälpa",
  "en": "to help",
  "t": "v",
  "c": "(hjälper, hjälpte, hjälpt)",
  "es": "Jag hjälper dig.",
  "ee": "I help you.",
  "ch": 13,
  "lv": "A1",
  "wpm": 238.92
}, {
  "id": 454,
  "sv": "nästa",
  "en": "next",
  "t": "a",
  "es": "Nästa vecka reser vi.",
  "ee": "Next week we travel.",
  "ch": 4,
  "lv": "A1",
  "wpm": 237.94
}, {
  "id": 455,
  "sv": "nära",
  "en": "near",
  "t": "a",
  "es": "Huset ligger nära skolan.",
  "ee": "The house lies near the school.",
  "lv": "A1",
  "wpm": 237.62
}, {
  "id": 456,
  "sv": "nej",
  "en": "no",
  "t": "i",
  "es": "Nej, jag vill inte.",
  "ee": "No, I don't want to.",
  "lv": "A1",
  "wpm": 237.61
}, {
  "id": 457,
  "sv": "text",
  "en": "text",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Jag läser en text.",
  "ee": "I read a text.",
  "ch": 1,
  "lv": "A1",
  "wpm": 234.6
}, {
  "id": 458,
  "sv": "exempel",
  "en": "example",
  "t": "n",
  "g": "ett",
  "c": "(exemplet, –, exemplen)",
  "es": "Det är ett bra exempel.",
  "ee": "It is a good example.",
  "ch": 1,
  "lv": "A1",
  "wpm": 232.43
}, {
  "id": 459,
  "sv": "särskilt",
  "en": "especially",
  "t": "a",
  "es": "Det är särskilt viktigt.",
  "ee": "It is especially important.",
  "lv": "A1",
  "wpm": 232.35
}, {
  "id": 460,
  "sv": "debatt",
  "en": "debate",
  "t": "n",
  "g": "en",
  "es": "Debatten fortsätter.",
  "ee": "The debate continues.",
  "lv": "A1",
  "wpm": 232.07
}, {
  "id": 461,
  "sv": "när det gäller",
  "en": "when it comes to",
  "t": "p",
  "es": "När det gäller arbete är han noggrann.",
  "ee": "When it comes to work he is careful.",
  "lv": "A1",
  "wpm": 230.03
}, {
  "id": 462,
  "sv": "på grund av (förk. p.g.a, pga., p g a)",
  "en": "because of",
  "t": "a",
  "es": "Vi stannar hemma på grund av regn.",
  "ee": "We stay home because of rain.",
  "lv": "A1",
  "wpm": 229.03
}, {
  "id": 463,
  "sv": "situation",
  "en": "situation",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Det är en svår situation.",
  "ee": "It is a difficult situation.",
  "ch": 5,
  "lv": "A1",
  "wpm": 229.02
}, {
  "id": 464,
  "sv": "europeisk",
  "en": "European",
  "t": "a",
  "es": "Det är en europeisk stad.",
  "ee": "It is a European city.",
  "lv": "A1",
  "wpm": 228.56
}, {
  "id": 465,
  "sv": "form",
  "en": "shape",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Det är en ny form.",
  "ee": "It is a new form.",
  "ch": 1,
  "lv": "A1",
  "wpm": 228.11
}, {
  "id": 466,
  "sv": "orm",
  "en": "snake",
  "t": "n",
  "g": "en",
  "es": "En orm ligger på vägen.",
  "ee": "A snake lies on the road.",
  "lv": "A1",
  "wpm": 228.11
}, {
  "id": 467,
  "sv": "råd",
  "en": "advice",
  "t": "n",
  "g": "ett",
  "c": "(-et, −, -en)",
  "es": "Han ger ett råd.",
  "ee": "He gives advice.",
  "ch": 19,
  "lv": "A1",
  "wpm": 228.07
}, {
  "id": 468,
  "sv": "november",
  "en": "November",
  "t": "n",
  "es": "Det regnar i november.",
  "ee": "It rains in November.",
  "ch": 8,
  "lv": "A1",
  "wpm": 228.05
}, {
  "id": 469,
  "sv": "makt",
  "en": "power",
  "t": "n",
  "g": "en",
  "es": "Regeringen har makt.",
  "ee": "The government has power.",
  "lv": "A1",
  "wpm": 228.02
}, {
  "id": 470,
  "sv": "social",
  "en": "social",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Det är en social fråga.",
  "ee": "It is a social issue.",
  "ch": 13,
  "lv": "A1",
  "wpm": 226.91
}, {
  "id": 471,
  "sv": "vinna",
  "en": "to win",
  "t": "v",
  "c": "(-er, vann, vunnit)",
  "es": "Laget vinner.",
  "ee": "The team wins.",
  "ch": 6,
  "lv": "A1",
  "wpm": 226.63
}, {
  "id": 472,
  "sv": "kvar",
  "en": "remaining",
  "t": "p",
  "es": "Han är kvar här.",
  "ee": "He remains here.",
  "lv": "A1",
  "wpm": 226.35
}, {
  "id": 473,
  "sv": "system",
  "en": "system",
  "t": "n",
  "g": "ett",
  "c": "(-et, –, -en)",
  "es": "Systemet fungerar.",
  "ee": "The system works.",
  "ch": 1,
  "lv": "A1",
  "wpm": 225.72
}, {
  "id": 474,
  "sv": "vänta",
  "en": "to wait",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Vi väntar här.",
  "ee": "We wait here.",
  "ch": 4,
  "lv": "A1",
  "wpm": 225.55
}, {
  "id": 475,
  "sv": "tidig",
  "en": "early",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Det är en tidig morgon.",
  "ee": "It is an early morning.",
  "ch": 17,
  "lv": "A1",
  "wpm": 225.46
}, {
  "id": 476,
  "sv": "åtgärd",
  "en": "measure / action",
  "t": "n",
  "g": "en",
  "es": "Regeringen tar en åtgärd.",
  "ee": "The government takes a measure.",
  "lv": "A1",
  "wpm": 223.86
}, {
  "id": 477,
  "sv": "krav",
  "en": "demand / requirement",
  "t": "n",
  "g": "ett",
  "es": "Jobbet har många krav.",
  "ee": "The job has many requirements.",
  "lv": "A1",
  "wpm": 223.66
}, {
  "id": 478,
  "sv": "skillnad",
  "en": "difference",
  "t": "n",
  "g": "en",
  "es": "Det finns en skillnad.",
  "ee": "There is a difference.",
  "lv": "A1",
  "wpm": 223.65
}, {
  "id": 479,
  "sv": "riksdag",
  "en": "parliament",
  "t": "n",
  "g": "en",
  "es": "Riksdagen beslutar.",
  "ee": "The parliament decides.",
  "lv": "A1",
  "wpm": 223.14
}, {
  "id": 480,
  "sv": "internationell",
  "en": "international",
  "t": "a",
  "es": "Det är en internationell fråga.",
  "ee": "It is an international question.",
  "lv": "A1",
  "wpm": 222.66
}, {
  "id": 481,
  "sv": "nationell",
  "en": "national",
  "t": "a",
  "es": "Det är en nationell lag.",
  "ee": "It is a national law.",
  "lv": "A1",
  "wpm": 222.66
}, {
  "id": 482,
  "sv": "jobba",
  "en": "to work",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Jag jobbar idag.",
  "ee": "I work today.",
  "ch": 1,
  "lv": "A1",
  "wpm": 221.99
}, {
  "id": 483,
  "sv": "klara",
  "en": "to manage / pass",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Hon klarar provet.",
  "ee": "She passes the test.",
  "ch": 16,
  "lv": "A1",
  "wpm": 218.16
}, {
  "id": 484,
  "sv": "typ",
  "en": "type",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Det är en ny typ.",
  "ee": "It is a new type.",
  "ch": 5,
  "lv": "A1",
  "wpm": 217.75
}, {
  "id": 485,
  "sv": "kring",
  "en": "around",
  "t": "p",
  "es": "Vi sitter kring bordet.",
  "ee": "We sit around the table.",
  "lv": "A1",
  "wpm": 217.05
}, {
  "id": 486,
  "sv": "båda (vardgl. bägge)",
  "en": "both",
  "t": "p",
  "es": "Båda kommer.",
  "ee": "Both come.",
  "lv": "A1",
  "wpm": 217.0
}, {
  "id": 487,
  "sv": "cirka (förk. ca)",
  "en": "about / approximately",
  "t": "a",
  "es": "Cirka tio personer kommer.",
  "ee": "About ten people come.",
  "lv": "A1",
  "wpm": 216.97
}, {
  "id": 488,
  "sv": "tur",
  "en": "turn / luck",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Vi tar en tur.",
  "ee": "We take a trip.",
  "ch": 11,
  "lv": "A1",
  "wpm": 216.52
}, {
  "id": 489,
  "sv": "polis",
  "en": "police officer",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Polisen hjälper oss.",
  "ee": "The police officer helps us.",
  "ch": 1,
  "lv": "A1",
  "wpm": 216.42
}, {
  "id": 490,
  "sv": "medium",
  "en": "medium",
  "t": "n",
  "g": "ett",
  "c": "(mediet, medier, medierna)",
  "es": "TV är ett medium.",
  "ee": "TV is a medium.",
  "ch": 20,
  "lv": "A1",
  "wpm": 215.79
}, {
  "id": 491,
  "sv": "låg",
  "en": "low",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Priset är lågt.",
  "ee": "The price is low.",
  "ch": 20,
  "lv": "A1",
  "wpm": 214.24
}, {
  "id": 492,
  "sv": "varandra (vardagl. varann)",
  "en": "each other",
  "t": "p",
  "es": "De hjälper varandra.",
  "ee": "They help each other.",
  "lv": "A1",
  "wpm": 214.16
}, {
  "id": 493,
  "sv": "mun",
  "en": "mouth",
  "t": "n",
  "g": "en",
  "c": "(-nen, -nar, -narna)",
  "es": "Barnet öppnar munnen.",
  "ee": "The child opens the mouth.",
  "ch": 4,
  "lv": "A1",
  "wpm": 213.93
}, {
  "id": 494,
  "sv": "ansvar",
  "en": "responsibility",
  "t": "n",
  "g": "ett",
  "es": "Han har ett stort ansvar.",
  "ee": "He has a big responsibility.",
  "lv": "A1",
  "wpm": 213.48
}, {
  "id": 495,
  "sv": "roll",
  "en": "role",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Hon spelar en roll.",
  "ee": "She plays a role.",
  "ch": 3,
  "lv": "A1",
  "wpm": 213.39
}, {
  "id": 496,
  "sv": "regel",
  "en": "rule",
  "t": "n",
  "g": "en",
  "es": "Det är en viktig regel.",
  "ee": "It is an important rule.",
  "lv": "A1",
  "wpm": 211.92
}, {
  "id": 497,
  "sv": "oktober",
  "en": "October",
  "t": "n",
  "es": "Vi ses i oktober.",
  "ee": "We meet in October.",
  "ch": 8,
  "lv": "A1",
  "wpm": 211.56
}, {
  "id": 498,
  "sv": "prata",
  "en": "to talk",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Vi pratar svenska.",
  "ee": "We speak Swedish.",
  "ch": 1,
  "lv": "A1",
  "wpm": 211.06
}, {
  "id": 499,
  "sv": "organisation",
  "en": "organization",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Organisationen växer.",
  "ee": "The organization grows.",
  "ch": 13,
  "lv": "A1",
  "wpm": 210.61
}, {
  "id": 500,
  "sv": "medlem",
  "en": "member",
  "t": "n",
  "g": "en",
  "es": "Hon är medlem i klubben.",
  "ee": "She is a member of the club.",
  "lv": "A1",
  "wpm": 210.54
}, {
  "id": 501,
  "sv": "fråga",
  "en": "to ask",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Jag frågar läraren.",
  "ee": "I ask the teacher.",
  "ch": 1,
  "lv": "A1",
  "wpm": 210.47
}, {
  "id": 502,
  "sv": "anmäla",
  "en": "to report / register",
  "t": "v",
  "es": "Hon anmäler sig till kursen.",
  "ee": "She registers for the course.",
  "lv": "A1",
  "wpm": 209.8
}, {
  "id": 503,
  "sv": "nå",
  "en": "to reach",
  "t": "v",
  "es": "Vi når målet.",
  "ee": "We reach the goal.",
  "lv": "A1",
  "wpm": 209.69
}, {
  "id": 504,
  "sv": "bo",
  "en": "to live",
  "t": "v",
  "c": "(-r, bodde, bott)",
  "es": "Jag bor i Stockholm.",
  "ee": "I live in Stockholm.",
  "ch": 1,
  "lv": "A1",
  "wpm": 209.48
}, {
  "id": 505,
  "sv": "krona",
  "en": "krona (Swedish currency)",
  "t": "n",
  "g": "en",
  "c": "(-n, -or, -orna)",
  "es": "Boken kostar hundra kronor.",
  "ee": "The book costs one hundred kronor.",
  "ch": 4,
  "lv": "A1",
  "wpm": 207.79
}, {
  "id": 506,
  "sv": "stämma",
  "en": "to be correct / to tune",
  "t": "v",
  "es": "Det stämmer.",
  "ee": "That is correct.",
  "lv": "A1",
  "wpm": 207.42
}, {
  "id": 507,
  "sv": "rättighet",
  "en": "right",
  "t": "n",
  "g": "en",
  "es": "Rättigheten skyddas.",
  "ee": "The right is protected.",
  "lv": "A1",
  "wpm": 207.42
}, {
  "id": 508,
  "sv": "sedan (vardagl. sen)",
  "en": "since / later",
  "t": "p",
  "es": "Vi ses sedan.",
  "ee": "We see each other later.",
  "lv": "A1",
  "wpm": 207.3
}, {
  "id": 509,
  "sv": "bakom",
  "en": "behind",
  "t": "p",
  "es": "Bilen står bakom huset.",
  "ee": "The car stands behind the house.",
  "lv": "A1",
  "wpm": 206.72
}, {
  "id": 510,
  "sv": "efter att",
  "en": "after",
  "t": "s",
  "es": "Vi går hem efter att filmen slutar.",
  "ee": "We go home after the movie ends.",
  "lv": "A1",
  "wpm": 206.69
}, {
  "id": 511,
  "sv": "därmed",
  "en": "thereby",
  "t": "a",
  "es": "Han accepterar därmed beslutet.",
  "ee": "He thereby accepts the decision.",
  "lv": "A1",
  "wpm": 206.58
}, {
  "id": 512,
  "sv": "med",
  "en": "with",
  "t": "a",
  "es": "Hon kommer med mig.",
  "ee": "She comes with me.",
  "ch": 1,
  "lv": "A1",
  "wpm": 206.58
}, {
  "id": 513,
  "sv": "hus",
  "en": "house",
  "t": "n",
  "g": "ett",
  "c": "(-et, −, -en)",
  "es": "De bor i ett hus.",
  "ee": "They live in a house.",
  "ch": 6,
  "lv": "A1",
  "wpm": 206.57
}, {
  "id": 514,
  "sv": "vän",
  "en": "friend",
  "t": "n",
  "g": "en",
  "c": "(-nen, -ner, -nerna)",
  "es": "Min vän ringer.",
  "ee": "My friend calls.",
  "ch": 2,
  "lv": "A1",
  "wpm": 205.79
}, {
  "id": 515,
  "sv": "dela",
  "en": "to share",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Vi delar maten.",
  "ee": "We share the food.",
  "ch": 6,
  "lv": "A1",
  "wpm": 205.43
}, {
  "id": 516,
  "sv": "februari",
  "en": "February",
  "t": "n",
  "es": "Snön faller i februari.",
  "ee": "Snow falls in February.",
  "ch": 8,
  "lv": "A1",
  "wpm": 205.04
}, {
  "id": 517,
  "sv": "kort",
  "en": "short",
  "t": "a",
  "es": "Mötet är kort.",
  "ee": "The meeting is short.",
  "lv": "A1",
  "wpm": 204.59
}, {
  "id": 518,
  "sv": "grund",
  "en": "foundation / reason",
  "t": "n",
  "g": "en",
  "es": "Det finns en grund för beslutet.",
  "ee": "There is a basis for the decision.",
  "lv": "A1",
  "wpm": 204.34
}, {
  "id": 519,
  "sv": "runt",
  "en": "around",
  "t": "p",
  "es": "Vi går runt sjön.",
  "ee": "We walk around the lake.",
  "lv": "A1",
  "wpm": 203.5
}, {
  "id": 520,
  "sv": "framtid",
  "en": "future",
  "t": "n",
  "g": "en",
  "c": "(-en)",
  "es": "Hon tänker på framtiden.",
  "ee": "She thinks about the future.",
  "ch": 9,
  "lv": "A1",
  "wpm": 203.16
}, {
  "id": 521,
  "sv": "köra",
  "en": "to drive",
  "t": "v",
  "c": "(kör, körde, kört)",
  "ch": 8,
  "lv": "A1",
  "wpm": 203.16
}, {
  "id": 522,
  "sv": "etikett",
  "en": "label",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Flaskan har en etikett.",
  "ee": "The bottle has a label.",
  "ch": 14,
  "lv": "A1",
  "wpm": 202.31
}, {
  "id": 523,
  "sv": "fri",
  "en": "free",
  "t": "a",
  "es": "Hon är fri idag.",
  "ee": "She is free today.",
  "lv": "A1",
  "wpm": 201.84
}, {
  "id": 524,
  "sv": "behov",
  "en": "need",
  "t": "n",
  "g": "ett",
  "c": "(-et, −, -en)",
  "es": "Det finns ett behov.",
  "ee": "There is a need.",
  "ch": 20,
  "lv": "A1",
  "wpm": 201.71
}, {
  "id": 525,
  "sv": "timme (el. timma)",
  "en": "hour",
  "t": "n",
  "g": "en",
  "es": "Mötet tar en timme.",
  "ee": "The meeting takes one hour.",
  "lv": "A1",
  "wpm": 201.49
}, {
  "id": 526,
  "sv": "september",
  "en": "September",
  "t": "n",
  "es": "Skolan börjar i september.",
  "ee": "School begins in September.",
  "ch": 8,
  "lv": "A1",
  "wpm": 201.31
}, {
  "id": 527,
  "sv": "hoppas",
  "en": "to hope",
  "t": "v",
  "es": "Jag hoppas på sol.",
  "ee": "I hope for sun.",
  "ch": 14,
  "lv": "A1",
  "wpm": 200.99
}, {
  "id": 528,
  "sv": "ensam",
  "en": "alone",
  "t": "a",
  "c": "(-t, ensamma)",
  "es": "Han sitter ensam.",
  "ee": "He sits alone.",
  "ch": 11,
  "lv": "A1",
  "wpm": 200.63
}, {
  "id": 529,
  "sv": "snart",
  "en": "soon",
  "t": "a",
  "es": "Vi ses snart.",
  "ee": "See you soon.",
  "ch": 9,
  "lv": "A1",
  "wpm": 199.9
}, {
  "id": 530,
  "sv": "rätt",
  "en": "dish / right",
  "t": "a",
  "es": "Jag beställer en rätt.",
  "ee": "I order a dish.",
  "lv": "A1",
  "wpm": 198.64
}, {
  "id": 531,
  "sv": "förklara",
  "en": "to explain",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Läraren förklarar.",
  "ee": "The teacher explains.",
  "ch": 16,
  "lv": "A1",
  "wpm": 198.04
}, {
  "id": 532,
  "sv": "ledning",
  "en": "management",
  "t": "n",
  "g": "en",
  "es": "Ledningen beslutar.",
  "ee": "The leadership decides.",
  "lv": "A1",
  "wpm": 197.93
}, {
  "id": 533,
  "sv": "intresse",
  "en": "interest",
  "t": "n",
  "g": "ett",
  "es": "Jag har ett nytt intresse.",
  "ee": "I have a new interest.",
  "lv": "A1",
  "wpm": 197.41
}, {
  "id": 534,
  "sv": "tvinga",
  "en": "to force",
  "t": "v",
  "es": "Reglerna tvingar oss.",
  "ee": "The rules force us.",
  "lv": "A1",
  "wpm": 196.99
}, {
  "id": 535,
  "sv": "påverka",
  "en": "to influence",
  "t": "v",
  "es": "Nyheter påverkar människor.",
  "ee": "News influence people.",
  "lv": "A1",
  "wpm": 196.4
}, {
  "id": 536,
  "sv": "anledning",
  "en": "reason",
  "t": "n",
  "g": "en",
  "es": "Det finns en anledning.",
  "ee": "There is a reason.",
  "lv": "A1",
  "wpm": 195.88
}, {
  "id": 537,
  "sv": "titta",
  "en": "to look",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Jag tittar på TV.",
  "ee": "I watch TV.",
  "ch": 1,
  "lv": "A1",
  "wpm": 195.79
}, {
  "id": 538,
  "sv": "minska",
  "en": "to decrease",
  "t": "v",
  "es": "Priserna minskar.",
  "ee": "Prices decrease.",
  "lv": "A1",
  "wpm": 195.42
}, {
  "id": 539,
  "sv": "i alla fall (el. iallafall; förk. iaf)",
  "en": "in any case",
  "t": "a",
  "es": "Vi kommer i alla fall.",
  "ee": "We come anyway.",
  "lv": "A1",
  "wpm": 195.28
}, {
  "id": 540,
  "sv": "däremot",
  "en": "however",
  "t": "a",
  "es": "Han vill däremot stanna.",
  "ee": "However he wants to stay.",
  "lv": "A1",
  "wpm": 194.9
}, {
  "id": 541,
  "sv": "direkt",
  "en": "directly",
  "t": "a",
  "es": "Vi går direkt hem.",
  "ee": "We go directly home.",
  "lv": "A1",
  "wpm": 194.63
}, {
  "id": 542,
  "sv": "ekonomi",
  "en": "economy",
  "t": "n",
  "g": "en",
  "c": "(-n)",
  "es": "Ekonomin växer.",
  "ee": "The economy grows.",
  "ch": 1,
  "lv": "A1",
  "wpm": 194.28
}, {
  "id": 543,
  "sv": "bestämma",
  "en": "to decide",
  "t": "v",
  "es": "Vi bestämmer idag.",
  "ee": "We decide today.",
  "lv": "A1",
  "wpm": 192.88
}, {
  "id": 544,
  "sv": "skicka",
  "en": "to send",
  "t": "v",
  "es": "Jag skickar ett brev.",
  "ee": "I send a letter.",
  "lv": "A1",
  "wpm": 192.84
}, {
  "id": 545,
  "sv": "trots",
  "en": "despite",
  "t": "p",
  "es": "Vi går trots regnet.",
  "ee": "We go despite the rain.",
  "lv": "A1",
  "wpm": 192.43
}, {
  "id": 546,
  "sv": "åsikt",
  "en": "opinion",
  "t": "n",
  "g": "en",
  "es": "Hon har en stark åsikt.",
  "ee": "She has a strong opinion.",
  "lv": "A1",
  "wpm": 192.3
}, {
  "id": 547,
  "sv": "diskussion",
  "en": "discussion",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Diskussionen fortsätter.",
  "ee": "The discussion continues.",
  "ch": 17,
  "lv": "A1",
  "wpm": 192.14
}, {
  "id": 548,
  "sv": "rad",
  "en": "row / series",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Det finns en rad hus.",
  "ee": "There is a row of houses.",
  "ch": 11,
  "lv": "A1",
  "wpm": 192.14
}, {
  "id": 549,
  "sv": "faktum",
  "en": "fact",
  "t": "n",
  "g": "ett",
  "es": "Det är ett faktum.",
  "ee": "It is a fact.",
  "lv": "A1",
  "wpm": 192.11
}, {
  "id": 550,
  "sv": "tidning",
  "en": "newspaper",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "Jag läser en tidning.",
  "ee": "I read a newspaper.",
  "ch": 2,
  "lv": "A1",
  "wpm": 191.91
}, {
  "id": 551,
  "sv": "mening",
  "en": "sentence / meaning",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "Jag skriver en mening.",
  "ee": "I write a sentence.",
  "ch": 1,
  "lv": "A1",
  "wpm": 191.16
}, {
  "id": 552,
  "sv": "utanför",
  "en": "outside",
  "t": "p",
  "es": "Han väntar utanför huset.",
  "ee": "He waits outside the house.",
  "lv": "A1",
  "wpm": 190.63
}, {
  "id": 553,
  "sv": "rätt",
  "en": "dish / right",
  "t": "a",
  "es": "Jag beställer en rätt.",
  "ee": "I order a dish.",
  "lv": "A1",
  "wpm": 190.49
}, {
  "id": 554,
  "sv": "gemensam",
  "en": "common / shared",
  "t": "a",
  "c": "(-t, -ma)",
  "es": "De har ett gemensamt mål.",
  "ee": "They have a common goal.",
  "ch": 17,
  "lv": "A1",
  "wpm": 189.45
}, {
  "id": 555,
  "sv": "klar",
  "en": "clear / ready",
  "t": "a",
  "es": "Jag är klar.",
  "ee": "I am ready.",
  "lv": "A1",
  "wpm": 187.9
}, {
  "id": 556,
  "sv": "juni",
  "en": "June",
  "t": "n",
  "es": "Vi reser i juni.",
  "ee": "We travel in June.",
  "ch": 8,
  "lv": "A1",
  "wpm": 186.95
}, {
  "id": 557,
  "sv": "is",
  "en": "ice",
  "t": "n",
  "g": "en",
  "es": "Isen smälter.",
  "ee": "The ice melts.",
  "lv": "A1",
  "wpm": 186.84
}, {
  "id": 558,
  "sv": "bil",
  "en": "car",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "Bilen är ny.",
  "ee": "The car is new.",
  "ch": 6,
  "lv": "A1",
  "wpm": 186.44
}, {
  "id": 559,
  "sv": "myndighet",
  "en": "authority",
  "t": "n",
  "g": "en",
  "es": "Myndigheten beslutar.",
  "ee": "The authority decides.",
  "lv": "A1",
  "wpm": 186.22
}, {
  "id": 560,
  "sv": "nummer (förk. nr)",
  "en": "number",
  "t": "n",
  "g": "ett",
  "lv": "A1",
  "wpm": 186.0
}, {
  "id": 561,
  "sv": "allmän",
  "en": "general",
  "t": "a",
  "es": "Det är en allmän regel.",
  "ee": "It is a general rule.",
  "lv": "A1",
  "wpm": 185.28
}, {
  "id": 562,
  "sv": "musik",
  "en": "music",
  "t": "n",
  "g": "en",
  "c": "(-en)",
  "es": "Jag lyssnar på musik.",
  "ee": "I listen to music.",
  "ch": 3,
  "lv": "A1",
  "wpm": 185.07
}, {
  "id": 563,
  "sv": "ändra",
  "en": "to change",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Vi ändrar planen.",
  "ee": "We change the plan.",
  "ch": 10,
  "lv": "A1",
  "wpm": 184.81
}, {
  "id": 564,
  "sv": "träffa",
  "en": "to meet",
  "t": "v",
  "c": "(-r, -ade, -at)",
  "es": "Jag träffar honom.",
  "ee": "I meet him.",
  "ch": 5,
  "lv": "A1",
  "wpm": 184.74
}, {
  "id": 565,
  "sv": "ihop",
  "en": "together",
  "t": "p",
  "es": "Vi arbetar ihop.",
  "ee": "We work together.",
  "lv": "A1",
  "wpm": 183.73
}, {
  "id": 566,
  "sv": "diskutera",
  "en": "to discuss",
  "t": "v",
  "c": "(-r, -de, -t )",
  "es": "De diskuterar frågan.",
  "ee": "They discuss the question.",
  "ch": 2,
  "lv": "A1",
  "wpm": 183.54
}, {
  "id": 567,
  "sv": "driva",
  "en": "to run / operate",
  "t": "v",
  "es": "Han driver ett företag.",
  "ee": "He runs a company.",
  "lv": "A1",
  "wpm": 183.3
}, {
  "id": 568,
  "sv": "sälja",
  "en": "to sell",
  "t": "v",
  "es": "De säljer bilar.",
  "ee": "They sell cars.",
  "lv": "A1",
  "wpm": 182.71
}, {
  "id": 569,
  "sv": "sakna",
  "en": "to miss",
  "t": "v",
  "es": "Jag saknar dig.",
  "ee": "I miss you.",
  "lv": "A1",
  "wpm": 182.57
}, {
  "id": 570,
  "sv": "program",
  "en": "program",
  "t": "n",
  "g": "ett",
  "c": "(-met, –, -men)",
  "es": "Programmet startar.",
  "ee": "The program starts.",
  "ch": 3,
  "lv": "A1",
  "wpm": 182.39
}, {
  "id": 571,
  "sv": "ifrån",
  "en": "from",
  "t": "p",
  "es": "Jag kommer ifrån Sverige.",
  "ee": "I come from Sweden.",
  "lv": "A1",
  "wpm": 181.44
}, {
  "id": 572,
  "sv": "länka",
  "en": "to link",
  "t": "v",
  "es": "Hon länkar artikeln.",
  "ee": "She links the article.",
  "lv": "A1",
  "wpm": 179.35
}, {
  "id": 573,
  "sv": "kunskap",
  "en": "knowledge",
  "t": "n",
  "g": "en",
  "es": "Kunskap är viktig.",
  "ee": "Knowledge is important.",
  "lv": "A1",
  "wpm": 179.19
}, {
  "id": 574,
  "sv": "snabbt",
  "en": "quickly",
  "t": "a",
  "es": "Han springer snabbt.",
  "ee": "He runs quickly.",
  "lv": "A1",
  "wpm": 178.68
}, {
  "id": 575,
  "sv": "maj",
  "en": "May",
  "t": "n",
  "es": "Blommor växer i maj.",
  "ee": "Flowers grow in May.",
  "ch": 8,
  "lv": "A1",
  "wpm": 177.76
}, {
  "id": 576,
  "sv": "amerikansk",
  "en": "American",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Han är amerikansk.",
  "ee": "He is American.",
  "ch": 5,
  "lv": "A1",
  "wpm": 177.66
}, {
  "id": 577,
  "sv": "tyda",
  "en": "to interpret",
  "t": "v",
  "es": "Det är svårt att tyda texten.",
  "ee": "It is hard to interpret the text.",
  "lv": "A1",
  "wpm": 177.46
}, {
  "id": 578,
  "sv": "särskild",
  "en": "special",
  "t": "a",
  "es": "Det är en särskild dag.",
  "ee": "It is a special day.",
  "lv": "A1",
  "wpm": 177.43
}, {
  "id": 579,
  "sv": "början",
  "en": "beginning",
  "t": "n",
  "g": "en",
  "es": "Det är en början.",
  "ee": "It is a beginning.",
  "lv": "A1",
  "wpm": 176.59
}, {
  "id": 580,
  "sv": "naturligtvis",
  "en": "of course",
  "t": "a",
  "es": "Naturligtvis kommer jag.",
  "ee": "Of course I come.",
  "ch": 13,
  "lv": "A1",
  "wpm": 176.31
}, {
  "id": 581,
  "sv": "skäl",
  "en": "reason",
  "t": "n",
  "g": "ett",
  "es": "Det finns ett skäl.",
  "ee": "There is a reason.",
  "lv": "A1",
  "wpm": 175.99
}, {
  "id": 582,
  "sv": "fin",
  "en": "fine / nice",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Det är en fin dag.",
  "ee": "It is a nice day.",
  "ch": 2,
  "lv": "A1",
  "wpm": 174.99
}, {
  "id": 583,
  "sv": "genomföra",
  "en": "to carry out",
  "t": "v",
  "es": "De genomför planen.",
  "ee": "They carry out the plan.",
  "lv": "A1",
  "wpm": 174.86
}, {
  "id": 584,
  "sv": "liksom",
  "en": "as well as / like",
  "t": "a",
  "es": "Han arbetar liksom jag.",
  "ee": "He works like me.",
  "lv": "A1",
  "wpm": 174.75
}, {
  "id": 585,
  "sv": "via",
  "en": "via / through",
  "t": "p",
  "es": "Vi reser via Berlin.",
  "ee": "We travel via Berlin.",
  "lv": "A1",
  "wpm": 174.12
}, {
  "id": 586,
  "sv": "före",
  "en": "before",
  "t": "p",
  "es": "Vi äter före mötet.",
  "ee": "We eat before the meeting.",
  "lv": "A1",
  "wpm": 173.85
}, {
  "id": 587,
  "sv": "dom",
  "en": "verdict",
  "t": "n",
  "g": "en",
  "es": "Domaren ger en dom.",
  "ee": "The judge gives a verdict.",
  "lv": "A1",
  "wpm": 173.6
}, {
  "id": 588,
  "sv": "risk",
  "en": "risk",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Risken bedöms.",
  "ee": "The risk is assessed.",
  "ch": 20,
  "lv": "A1",
  "wpm": 173.27
}, {
  "id": 589,
  "sv": "enkel",
  "en": "simple",
  "t": "a",
  "c": "(-t, enkla)",
  "es": "Frågan är enkel.",
  "ee": "The question is simple.",
  "ch": 10,
  "lv": "A1",
  "wpm": 173.1
}, {
  "id": 590,
  "sv": "alls",
  "en": "at all",
  "t": "a",
  "es": "Jag förstår inte alls.",
  "ee": "I do not understand at all.",
  "lv": "A1",
  "wpm": 173.06
}, {
  "id": 591,
  "sv": "pris",
  "en": "price",
  "t": "n",
  "g": "ett",
  "c": "(-et, -er, -erna)",
  "es": "Priset är högt.",
  "ee": "The price is high.",
  "ch": 6,
  "lv": "A1",
  "wpm": 172.92
}, {
  "id": 592,
  "sv": "räkna",
  "en": "to count",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Jag räknar pengarna.",
  "ee": "I count the money.",
  "ch": 3,
  "lv": "A1",
  "wpm": 172.91
}, {
  "id": 593,
  "sv": "beskriva",
  "en": "to describe",
  "t": "v",
  "c": "(beskriver, beskrev, beskrivit)",
  "es": "Hon beskriver staden.",
  "ee": "She describes the city.",
  "ch": 15,
  "lv": "A1",
  "wpm": 172.36
}, {
  "id": 594,
  "sv": "hem",
  "en": "home",
  "t": "p",
  "es": "Huset är ett hem.",
  "ee": "The house is a home.",
  "lv": "A1",
  "wpm": 172.22
}, {
  "id": 595,
  "sv": "möta",
  "en": "to meet",
  "t": "v",
  "lv": "A1",
  "wpm": 172.02
}, {
  "id": 596,
  "sv": "såsom",
  "en": "such as",
  "t": "s",
  "es": "Frukt såsom äpplen.",
  "ee": "Fruit such as apples.",
  "lv": "A1",
  "wpm": 171.86
}, {
  "id": 597,
  "sv": "idé",
  "en": "idea",
  "t": "n",
  "g": "en",
  "c": "(-n, -er, -erna)",
  "es": "Jag har en idé.",
  "ee": "I have an idea.",
  "ch": 4,
  "lv": "A1",
  "wpm": 171.57
}, {
  "id": 598,
  "sv": "gram",
  "en": "gram",
  "t": "n",
  "g": "ett",
  "c": "(-met, −, -men)",
  "es": "Det väger ett gram.",
  "ee": "It weighs one gram.",
  "ch": 4,
  "lv": "A1",
  "wpm": 171.53
}, {
  "id": 599,
  "sv": "förra",
  "en": "last (previous)",
  "t": "a",
  "es": "Jag bodde där förra året.",
  "ee": "I lived there last year.",
  "lv": "A1",
  "wpm": 170.92
}, {
  "id": 600,
  "sv": "tjänst",
  "en": "service",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Han gör mig en tjänst.",
  "ee": "He does me a favor.",
  "ch": 13,
  "lv": "A1",
  "wpm": 170.63
}, {
  "id": 601,
  "sv": "heta",
  "en": "to be called",
  "t": "v",
  "c": "(heter, hette, hetat)",
  "ch": 1,
  "lv": "A1",
  "wpm": 170.22
}, {
  "id": 602,
  "sv": "kultur",
  "en": "culture",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Sverige har en rik kultur.",
  "ee": "Sweden has a rich culture.",
  "ch": 10,
  "lv": "A1",
  "wpm": 170.1
}, {
  "id": 603,
  "sv": "äta",
  "en": "to eat",
  "t": "v",
  "c": "(äter, åt, ätit)",
  "ch": 3,
  "lv": "A1",
  "wpm": 169.74
}, {
  "id": 604,
  "sv": "syfte",
  "en": "purpose",
  "t": "n",
  "g": "ett",
  "es": "Projektet har ett tydligt syfte.",
  "ee": "The project has a clear purpose.",
  "lv": "A1",
  "wpm": 168.82
}, {
  "id": 605,
  "sv": "princip",
  "en": "principle",
  "t": "n",
  "g": "en",
  "es": "Det är en viktig princip.",
  "ee": "It is an important principle.",
  "lv": "A1",
  "wpm": 167.86
}, {
  "id": 606,
  "sv": "flytta",
  "en": "to move",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "De flyttar till Stockholm.",
  "ee": "They move to Stockholm.",
  "ch": 6,
  "lv": "A1",
  "wpm": 167.68
}, {
  "id": 607,
  "sv": "ute",
  "en": "outside",
  "t": "a",
  "es": "Barnen leker ute.",
  "ee": "The children play outside.",
  "ch": 13,
  "lv": "A1",
  "wpm": 167.61
}, {
  "id": 608,
  "sv": "utgöra",
  "en": "to constitute",
  "t": "v",
  "es": "Det utgör ett problem.",
  "ee": "It constitutes a problem.",
  "lv": "A1",
  "wpm": 167.61
}, {
  "id": 609,
  "sv": "politiker",
  "en": "politician",
  "t": "n",
  "g": "en",
  "c": "(-n, −, -na)",
  "es": "Politikern talar.",
  "ee": "The politician speaks.",
  "ch": 10,
  "lv": "A1",
  "wpm": 167.43
}, {
  "id": 610,
  "sv": "lätt",
  "en": "easy",
  "t": "a",
  "es": "Uppgiften är lätt.",
  "ee": "The task is easy.",
  "lv": "A1",
  "wpm": 167.41
}, {
  "id": 611,
  "sv": "förälder",
  "en": "parent",
  "t": "n",
  "g": "en",
  "c": "(-n, föräldrar, föräldrarna)",
  "es": "En förälder väntar.",
  "ee": "A parent waits.",
  "ch": 6,
  "lv": "A1",
  "wpm": 167.0
}, {
  "id": 612,
  "sv": "marknad",
  "en": "market",
  "t": "n",
  "g": "en",
  "es": "Marknaden är stor.",
  "ee": "The market is large.",
  "lv": "A1",
  "wpm": 166.13
}, {
  "id": 613,
  "sv": "nämligen",
  "en": "namely",
  "t": "a",
  "es": "Han kommer nämligen idag.",
  "ee": "He is coming today, you see.",
  "lv": "A1",
  "wpm": 165.98
}, {
  "id": 614,
  "sv": "tydlig",
  "en": "clear",
  "t": "a",
  "es": "Regeln är tydlig.",
  "ee": "The rule is clear.",
  "lv": "A1",
  "wpm": 165.93
}, {
  "id": 615,
  "sv": "utbildning",
  "en": "education",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "Hon studerar utbildning.",
  "ee": "She studies education.",
  "ch": 16,
  "lv": "A1",
  "wpm": 165.87
}, {
  "id": 616,
  "sv": "röra",
  "en": "to move / touch",
  "t": "v",
  "lv": "A1",
  "wpm": 165.68
}, {
  "id": 617,
  "sv": "nivå",
  "en": "level",
  "t": "n",
  "g": "en",
  "c": "(-n, -er, -erna)",
  "es": "Priset ligger på en hög nivå.",
  "ee": "The price is at a high level.",
  "ch": 20,
  "lv": "A1",
  "wpm": 165.64
}, {
  "id": 618,
  "sv": "april",
  "en": "April",
  "t": "n",
  "es": "Blommor växer i april.",
  "ee": "Flowers grow in April.",
  "ch": 8,
  "lv": "A1",
  "wpm": 165.36
}, {
  "id": 619,
  "sv": "mängd",
  "en": "amount",
  "t": "n",
  "g": "en",
  "es": "Det finns en stor mängd böcker.",
  "ee": "There is a large amount of books.",
  "lv": "A1",
  "wpm": 165.27
}, {
  "id": 620,
  "sv": "betydelse",
  "en": "meaning",
  "t": "n",
  "g": "en",
  "es": "Ordet har en ny betydelse.",
  "ee": "The word has a new meaning.",
  "lv": "A1",
  "wpm": 165.2
}, {
  "id": 621,
  "sv": "kristen",
  "en": "Christian",
  "t": "a",
  "c": "(kristna)",
  "es": "Han är kristen.",
  "ee": "He is Christian.",
  "ch": 10,
  "lv": "A1",
  "wpm": 164.51
}, {
  "id": 622,
  "sv": "dö",
  "en": "to die",
  "t": "v",
  "c": "(-r, dog, -tt)",
  "ch": 6,
  "lv": "A1",
  "wpm": 164.3
}, {
  "id": 623,
  "sv": "mars",
  "en": "March",
  "t": "n",
  "es": "Snön smälter i mars.",
  "ee": "The snow melts in March.",
  "ch": 8,
  "lv": "A1",
  "wpm": 164.22
}, {
  "id": 624,
  "sv": "allt",
  "en": "everything",
  "t": "a",
  "es": "Allt är klart.",
  "ee": "Everything is ready.",
  "lv": "A1",
  "wpm": 163.95
}, {
  "id": 625,
  "sv": "kväll",
  "en": "evening",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "Vi ses ikväll.",
  "ee": "See you tonight.",
  "ch": 3,
  "lv": "A1",
  "wpm": 163.87
}, {
  "id": 626,
  "sv": "bildning",
  "en": "education / cultivation",
  "t": "n",
  "g": "en",
  "es": "Bildning är viktigt.",
  "ee": "Education is important.",
  "lv": "A1",
  "wpm": 163.82
}, {
  "id": 627,
  "sv": "länk",
  "en": "link",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "Hon skickar en länk.",
  "ee": "She sends a link.",
  "ch": 11,
  "lv": "A1",
  "wpm": 163.54
}, {
  "id": 628,
  "sv": "växa",
  "en": "to grow",
  "t": "v",
  "c": "(-er, -te, -t)",
  "ch": 6,
  "lv": "A1",
  "wpm": 162.65
}, {
  "id": 629,
  "sv": "per",
  "en": "per",
  "t": "p",
  "es": "Priset är tio kronor per kilo.",
  "ee": "The price is ten kronor per kilo.",
  "lv": "A1",
  "wpm": 162.15
}, {
  "id": 630,
  "sv": "offentlig",
  "en": "public",
  "t": "a",
  "es": "Det är ett offentligt möte.",
  "ee": "It is a public meeting.",
  "lv": "A1",
  "wpm": 161.83
}, {
  "id": 631,
  "sv": "såväl",
  "en": "as well as",
  "t": "c",
  "es": "Han arbetar såväl hemma som på kontoret.",
  "ee": "He works both at home and at the office.",
  "lv": "A1",
  "wpm": 161.72
}, {
  "id": 632,
  "sv": "våga",
  "en": "to dare",
  "t": "v",
  "es": "Hon vågar tala.",
  "ee": "She dares to speak.",
  "lv": "A1",
  "wpm": 161.66
}, {
  "id": 633,
  "sv": "vatten",
  "en": "water",
  "t": "n",
  "g": "ett",
  "c": "(vattnet)",
  "es": "Jag dricker vatten.",
  "ee": "I drink water.",
  "ch": 1,
  "lv": "A1",
  "wpm": 161.3
}, {
  "id": 634,
  "sv": "håll",
  "en": "direction / side",
  "t": "n",
  "g": "ett",
  "es": "Han går åt mitt håll.",
  "ee": "He walks in my direction.",
  "lv": "A1",
  "wpm": 161.22
}, {
  "id": 635,
  "sv": "mänsklig",
  "en": "human",
  "t": "a",
  "es": "Det är en mänsklig rättighet.",
  "ee": "It is a human right.",
  "lv": "A1",
  "wpm": 160.58
}, {
  "id": 636,
  "sv": "demokrati",
  "en": "democracy",
  "t": "n",
  "g": "en",
  "es": "Sverige är en demokrati.",
  "ee": "Sweden is a democracy.",
  "lv": "A1",
  "wpm": 160.56
}, {
  "id": 637,
  "sv": "fatta",
  "en": "to make / understand",
  "t": "v",
  "es": "Regeringen fattar beslut.",
  "ee": "The government makes decisions.",
  "lv": "A1",
  "wpm": 160.43
}, {
  "id": 638,
  "sv": "jord",
  "en": "earth / soil",
  "t": "n",
  "g": "en",
  "es": "Jorden är våt.",
  "ee": "The soil is wet.",
  "lv": "A1",
  "wpm": 159.88
}, {
  "id": 639,
  "sv": "känsla",
  "en": "feeling",
  "t": "n",
  "g": "en",
  "es": "Jag har en stark känsla.",
  "ee": "I have a strong feeling.",
  "lv": "A1",
  "wpm": 159.45
}, {
  "id": 640,
  "sv": "förändring",
  "en": "change",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "Förändringen märks.",
  "ee": "The change is noticeable.",
  "ch": 18,
  "lv": "A1",
  "wpm": 159.43
}, {
  "id": 641,
  "sv": "nämna",
  "en": "to mention",
  "t": "v",
  "es": "Han nämner problemet.",
  "ee": "He mentions the problem.",
  "lv": "A1",
  "wpm": 159.17
}, {
  "id": 642,
  "sv": "tyvärr",
  "en": "unfortunately",
  "t": "a",
  "es": "Tyvärr kan jag inte komma.",
  "ee": "Unfortunately I cannot come.",
  "ch": 4,
  "lv": "A1",
  "wpm": 159.15
}, {
  "id": 643,
  "sv": "enskild",
  "en": "individual",
  "t": "a",
  "es": "En enskild person talar.",
  "ee": "An individual person speaks.",
  "lv": "A1",
  "wpm": 159.02
}, {
  "id": 644,
  "sv": "rätt",
  "en": "dish / right",
  "t": "p",
  "c": "(-a)",
  "es": "Jag beställer en rätt.",
  "ee": "I order a dish.",
  "ch": 1,
  "lv": "A1",
  "wpm": 158.98
}, {
  "id": 645,
  "sv": "be (el. bedja)",
  "en": "to ask / pray",
  "t": "v",
  "es": "Hon ber om hjälp.",
  "ee": "She asks for help.",
  "lv": "A1",
  "wpm": 158.82
}, {
  "id": 646,
  "sv": "punkt",
  "en": "point",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Vi diskuterar en punkt.",
  "ee": "We discuss a point.",
  "ch": 11,
  "lv": "A1",
  "wpm": 158.58
}, {
  "id": 647,
  "sv": "ändring",
  "en": "amendment",
  "t": "n",
  "g": "en",
  "es": "Ändringen godkänns.",
  "ee": "The amendment is approved.",
  "lv": "A1",
  "wpm": 158.58
}, {
  "id": 648,
  "sv": "mission",
  "en": "mission",
  "t": "n",
  "g": "en",
  "es": "Organisationen har en mission.",
  "ee": "The organization has a mission.",
  "lv": "A1",
  "wpm": 158.08
}, {
  "id": 649,
  "sv": "igår (el. i går)",
  "en": "yesterday",
  "t": "a",
  "es": "Jag arbetade igår.",
  "ee": "I worked yesterday.",
  "lv": "A1",
  "wpm": 157.53
}, {
  "id": 650,
  "sv": "kommission",
  "en": "commission",
  "t": "n",
  "g": "en",
  "es": "Kommissionen möts.",
  "ee": "The commission meets.",
  "lv": "A1",
  "wpm": 157.33
}, {
  "id": 651,
  "sv": "ort",
  "en": "place / locality",
  "t": "n",
  "g": "en",
  "es": "Han bor i en liten ort.",
  "ee": "He lives in a small locality.",
  "lv": "A1",
  "wpm": 156.85
}, {
  "id": 652,
  "sv": "anta",
  "en": "to assume / accept",
  "t": "v",
  "es": "Jag antar det.",
  "ee": "I assume that.",
  "lv": "A1",
  "wpm": 156.58
}, {
  "id": 653,
  "sv": "trots att",
  "en": "although",
  "t": "s",
  "es": "Jag går trots att det regnar.",
  "ee": "I go although it rains.",
  "lv": "A1",
  "wpm": 156.41
}, {
  "id": 654,
  "sv": "spel",
  "en": "game",
  "t": "n",
  "g": "ett",
  "c": "(-et, –, -en)",
  "es": "Barnen spelar ett spel.",
  "ee": "The children play a game.",
  "ch": 2,
  "lv": "A1",
  "wpm": 156.33
}, {
  "id": 655,
  "sv": "språk",
  "en": "language",
  "t": "n",
  "g": "ett",
  "c": "(-et, –, -en)",
  "es": "Svenska är ett språk.",
  "ee": "Swedish is a language.",
  "ch": 1,
  "lv": "A1",
  "wpm": 156.31
}, {
  "id": 656,
  "sv": "föreslå",
  "en": "to suggest",
  "t": "v",
  "c": "(-r, förslog, föreslagit)",
  "es": "Hon föreslår en idé.",
  "ee": "She suggests an idea.",
  "ch": 11,
  "lv": "A1",
  "wpm": 156.27
}, {
  "id": 657,
  "sv": "igenom",
  "en": "through",
  "t": "p",
  "es": "Vi går igenom parken.",
  "ee": "We walk through the park.",
  "lv": "A1",
  "wpm": 154.93
}, {
  "id": 658,
  "sv": "undra",
  "en": "to wonder",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Jag undrar varför.",
  "ee": "I wonder why.",
  "ch": 14,
  "lv": "A1",
  "wpm": 154.38
}, {
  "id": 659,
  "sv": "eget",
  "en": "own",
  "t": "a",
  "es": "Huset är hans eget.",
  "ee": "The house is his own.",
  "lv": "A1",
  "wpm": 154.19
}, {
  "id": 660,
  "sv": "möte",
  "en": "meeting",
  "t": "n",
  "g": "ett",
  "es": "Vi har ett möte.",
  "ee": "We have a meeting.",
  "lv": "A1",
  "wpm": 153.97
}, {
  "id": 661,
  "sv": "mat",
  "en": "food",
  "t": "n",
  "g": "en",
  "c": "(-en)",
  "es": "Jag lagar mat.",
  "ee": "I cook food.",
  "ch": 2,
  "lv": "A1",
  "wpm": 153.94
}, {
  "id": 662,
  "sv": "gräns",
  "en": "border / limit",
  "t": "n",
  "g": "en",
  "es": "Landet har en gräns.",
  "ee": "The country has a border.",
  "lv": "A1",
  "wpm": 153.55
}, {
  "id": 663,
  "sv": "lyssna",
  "en": "to listen",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Jag lyssnar på musik.",
  "ee": "I listen to music.",
  "ch": 1,
  "lv": "A1",
  "wpm": 152.94
}, {
  "id": 664,
  "sv": "delta",
  "en": "to participate",
  "t": "v",
  "es": "Hon deltar i mötet.",
  "ee": "She participates in the meeting.",
  "lv": "A1",
  "wpm": 152.8
}, {
  "id": 665,
  "sv": "samarbete",
  "en": "cooperation",
  "t": "n",
  "g": "ett",
  "es": "De startar ett samarbete.",
  "ee": "They start a cooperation.",
  "lv": "A1",
  "wpm": 152.7
}, {
  "id": 666,
  "sv": "annars",
  "en": "otherwise",
  "t": "a",
  "es": "Vi går nu annars blir det sent.",
  "ee": "We go now otherwise it becomes late.",
  "ch": 18,
  "lv": "A1",
  "wpm": 152.6
}, {
  "id": 667,
  "sv": "falla",
  "en": "to fall",
  "t": "v",
  "es": "Löven faller.",
  "ee": "The leaves fall.",
  "lv": "A1",
  "wpm": 152.58
}, {
  "id": 668,
  "sv": "nära",
  "en": "near",
  "t": "a",
  "es": "Huset ligger nära skolan.",
  "ee": "The house lies near the school.",
  "ch": 1,
  "lv": "A1",
  "wpm": 152.36
}, {
  "id": 669,
  "sv": "rum",
  "en": "room",
  "t": "n",
  "g": "ett",
  "c": "(-met, −, -men)",
  "es": "Vi sitter i ett rum.",
  "ee": "We sit in a room.",
  "ch": 5,
  "lv": "A1",
  "wpm": 152.07
}, {
  "id": 670,
  "sv": "ungefär",
  "en": "about / approximately",
  "t": "a",
  "es": "Det är ungefär tio personer.",
  "ee": "It is about ten people.",
  "ch": 3,
  "lv": "A1",
  "wpm": 151.93
}, {
  "id": 671,
  "sv": "starta",
  "en": "to start",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "De startar projektet.",
  "ee": "They start the project.",
  "ch": 6,
  "lv": "A1",
  "wpm": 151.68
}, {
  "id": 672,
  "sv": "inse",
  "en": "to realize",
  "t": "v",
  "es": "Jag inser problemet.",
  "ee": "I realize the problem.",
  "lv": "A1",
  "wpm": 151.51
}, {
  "id": 673,
  "sv": "internet",
  "en": "internet",
  "t": "n",
  "es": "Jag läser nyheter på internet.",
  "ee": "I read news on the internet.",
  "ch": 15,
  "lv": "A1",
  "wpm": 151.38
}, {
  "id": 674,
  "sv": "hov",
  "en": "court (royal)",
  "t": "n",
  "g": "ett",
  "es": "Kungen har ett hov.",
  "ee": "The king has a court.",
  "lv": "A1",
  "wpm": 150.99
}, {
  "id": 675,
  "sv": "öppen",
  "en": "open",
  "t": "a",
  "c": "(öppet, öppna)",
  "es": "Dörren är öppen.",
  "ee": "The door is open.",
  "ch": 4,
  "lv": "A1",
  "wpm": 150.86
}, {
  "id": 676,
  "sv": "bidra",
  "en": "to contribute",
  "t": "v",
  "es": "Hon bidrar till projektet.",
  "ee": "She contributes to the project.",
  "lv": "A1",
  "wpm": 150.84
}, {
  "id": 677,
  "sv": "död",
  "en": "death",
  "t": "n",
  "g": "en",
  "es": "Döden kom plötsligt.",
  "ee": "Death came suddenly.",
  "lv": "A1",
  "wpm": 150.59
}, {
  "id": 678,
  "sv": "luta",
  "en": "to lean",
  "t": "v",
  "es": "Han lutar sig mot väggen.",
  "ee": "He leans against the wall.",
  "lv": "A1",
  "wpm": 150.2
}, {
  "id": 679,
  "sv": "öga",
  "en": "eye",
  "t": "n",
  "g": "ett",
  "c": "(-t, -on, -onen)",
  "es": "Hon öppnar ögat.",
  "ee": "She opens the eye.",
  "ch": 19,
  "lv": "A1",
  "wpm": 150.07
}, {
  "id": 680,
  "sv": "säkert",
  "en": "certainly / safe",
  "t": "a",
  "es": "Det är säkert sant.",
  "ee": "It is certainly true.",
  "lv": "A1",
  "wpm": 149.46
}, {
  "id": 681,
  "sv": "ämne",
  "en": "subject / topic",
  "t": "n",
  "g": "ett",
  "c": "(-t, -n, -na)",
  "es": "Vi studerar ett ämne.",
  "ee": "We study a subject.",
  "ch": 16,
  "lv": "A1",
  "wpm": 149.25
}, {
  "id": 682,
  "sv": "få",
  "en": "few",
  "t": "a",
  "es": "Få människor vet svaret.",
  "ee": "Few people know the answer.",
  "ch": 2,
  "lv": "A1",
  "wpm": 148.91
}, {
  "id": 683,
  "sv": "augusti",
  "en": "August",
  "t": "n",
  "es": "Skolan börjar i augusti.",
  "ee": "School begins in August.",
  "ch": 8,
  "lv": "A1",
  "wpm": 148.76
}, {
  "id": 684,
  "sv": "socialdemokrat (vardagl. sosse)",
  "en": "social democrat",
  "t": "n",
  "g": "en",
  "es": "Han är socialdemokrat.",
  "ee": "He is a social democrat.",
  "lv": "A1",
  "wpm": 148.49
}, {
  "id": 685,
  "sv": "projekt",
  "en": "project",
  "t": "n",
  "g": "ett",
  "c": "(-et, −, -en)",
  "es": "De startar ett projekt.",
  "ee": "They start a project.",
  "ch": 18,
  "lv": "A1",
  "wpm": 148.31
}, {
  "id": 686,
  "sv": "övrig",
  "en": "other / remaining",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Övriga frågor diskuteras.",
  "ee": "Other questions are discussed.",
  "ch": 18,
  "lv": "A1",
  "wpm": 148.21
}, {
  "id": 687,
  "sv": "dels",
  "en": "partly / partly",
  "t": "c",
  "es": "Han arbetar dels hemma.",
  "ee": "He works partly at home.",
  "lv": "A1",
  "wpm": 148.09
}, {
  "id": 688,
  "sv": "framför allt (el. framförallt)",
  "en": "above all",
  "t": "a",
  "es": "Det är framför allt viktigt.",
  "ee": "It is above all important.",
  "lv": "A1",
  "wpm": 147.43
}, {
  "id": 689,
  "sv": "positiv",
  "en": "positive",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Hon är positiv.",
  "ee": "She is positive.",
  "ch": 5,
  "lv": "A1",
  "wpm": 147.36
}, {
  "id": 690,
  "sv": "rolig",
  "en": "funny / fun",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Filmen är rolig.",
  "ee": "The movie is fun.",
  "ch": 2,
  "lv": "A1",
  "wpm": 147.33
}, {
  "id": 691,
  "sv": "port",
  "en": "gate",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "Porten är stängd.",
  "ee": "The gate is closed.",
  "ch": 18,
  "lv": "A1",
  "wpm": 146.95
}, {
  "id": 692,
  "sv": "bero",
  "en": "to depend",
  "t": "v",
  "es": "Det beror på vädret.",
  "ee": "It depends on the weather.",
  "lv": "A1",
  "wpm": 146.68
}, {
  "id": 693,
  "sv": "kropp",
  "en": "body",
  "t": "n",
  "g": "en",
  "es": "Kroppen behöver vila.",
  "ee": "The body needs rest.",
  "lv": "A1",
  "wpm": 145.82
}, {
  "id": 694,
  "sv": "minnas",
  "en": "to remember",
  "t": "v",
  "es": "Jag minns honom.",
  "ee": "I remember him.",
  "lv": "A1",
  "wpm": 145.43
}, {
  "id": 695,
  "sv": "handling",
  "en": "action / act",
  "t": "n",
  "g": "en",
  "es": "Handlingen börjar.",
  "ee": "The action begins.",
  "lv": "A1",
  "wpm": 145.37
}, {
  "id": 696,
  "sv": "rösta",
  "en": "to vote",
  "t": "v",
  "es": "Vi röstar idag.",
  "ee": "We vote today.",
  "lv": "A1",
  "wpm": 145.06
}, {
  "id": 697,
  "sv": "riktig",
  "en": "real / correct",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Det är en riktig historia.",
  "ee": "It is a real story.",
  "ch": 20,
  "lv": "A1",
  "wpm": 144.98
}, {
  "id": 698,
  "sv": "rapport",
  "en": "report",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Hon skriver en rapport.",
  "ee": "She writes a report.",
  "ch": 20,
  "lv": "A1",
  "wpm": 144.86
}, {
  "id": 699,
  "sv": "lösning",
  "en": "solution",
  "t": "n",
  "g": "en",
  "es": "Vi hittar en lösning.",
  "ee": "We find a solution.",
  "lv": "A1",
  "wpm": 144.58
}, {
  "id": 700,
  "sv": "personlig",
  "en": "personal",
  "t": "a",
  "es": "Det är en personlig fråga.",
  "ee": "It is a personal question.",
  "lv": "A1",
  "wpm": 143.81
}, {
  "id": 701,
  "sv": "kommentera",
  "en": "to comment",
  "t": "v",
  "es": "Hon kommenterar artikeln.",
  "ee": "She comments on the article.",
  "lv": "A1",
  "wpm": 142.95
}, {
  "id": 702,
  "sv": "som att",
  "en": "as if",
  "t": "s",
  "es": "Han talar som att han vet.",
  "ee": "He speaks as if he knows.",
  "lv": "A1",
  "wpm": 142.78
}, {
  "id": 703,
  "sv": "gilla",
  "en": "to like",
  "t": "v",
  "es": "Jag gillar kaffe.",
  "ee": "I like coffee.",
  "lv": "A1",
  "wpm": 142.42
}, {
  "id": 704,
  "sv": "bryta",
  "en": "to break",
  "t": "v",
  "es": "Han bryter pinnen.",
  "ee": "He breaks the stick.",
  "lv": "A1",
  "wpm": 142.11
}, {
  "id": 705,
  "sv": "hjälp",
  "en": "help",
  "t": "n",
  "g": "en",
  "es": "Jag behöver hjälp.",
  "ee": "I need help.",
  "lv": "A1",
  "wpm": 142.06
}, {
  "id": 706,
  "sv": "juli",
  "en": "July",
  "t": "n",
  "es": "Vi reser i juli.",
  "ee": "We travel in July.",
  "ch": 8,
  "lv": "A1",
  "wpm": 142.01
}, {
  "id": 707,
  "sv": "innehålla",
  "en": "to contain",
  "t": "v",
  "es": "Boken innehåller många bilder.",
  "ee": "The book contains many pictures.",
  "lv": "A1",
  "wpm": 141.45
}, {
  "id": 708,
  "sv": "liknande",
  "en": "similar",
  "t": "a",
  "es": "De har liknande idéer.",
  "ee": "They have similar ideas.",
  "lv": "A1",
  "wpm": 140.93
}, {
  "id": 709,
  "sv": "tillfälle",
  "en": "opportunity",
  "t": "n",
  "g": "ett",
  "es": "Det är ett bra tillfälle.",
  "ee": "It is a good opportunity.",
  "lv": "A1",
  "wpm": 140.9
}, {
  "id": 710,
  "sv": "inte ens",
  "en": "not even",
  "t": "a",
  "es": "Han kom inte ens.",
  "ee": "He did not even come.",
  "lv": "A1",
  "wpm": 140.79
}, {
  "id": 711,
  "sv": "känd",
  "en": "known",
  "t": "a",
  "es": "Hon är känd.",
  "ee": "She is well known.",
  "lv": "A1",
  "wpm": 140.65
}, {
  "id": 712,
  "sv": "forskning",
  "en": "research",
  "t": "n",
  "g": "en",
  "es": "Forskning är viktig.",
  "ee": "Research is important.",
  "lv": "A1",
  "wpm": 140.49
}, {
  "id": 713,
  "sv": "kraft",
  "en": "power",
  "t": "n",
  "g": "en",
  "es": "Det finns en stark kraft.",
  "ee": "There is a strong force.",
  "lv": "A1",
  "wpm": 140.46
}, {
  "id": 714,
  "sv": "helt enkelt",
  "en": "simply",
  "t": "a",
  "es": "Det är helt enkelt sant.",
  "ee": "It is simply true.",
  "ch": 20,
  "lv": "A1",
  "wpm": 140.11
}, {
  "id": 715,
  "sv": "brott",
  "en": "crime",
  "t": "n",
  "g": "ett",
  "es": "Brottet är allvarligt.",
  "ee": "The crime is serious.",
  "lv": "A1",
  "wpm": 139.94
}, {
  "id": 716,
  "sv": "exempelvis",
  "en": "for example",
  "t": "a",
  "es": "Exempelvis kan vi resa.",
  "ee": "For example we can travel.",
  "ch": 20,
  "lv": "A1",
  "wpm": 139.94
}, {
  "id": 717,
  "sv": "röst",
  "en": "voice",
  "t": "n",
  "g": "en",
  "es": "Rösten hörs.",
  "ee": "The voice is heard.",
  "lv": "A1",
  "wpm": 139.89
}, {
  "id": 718,
  "sv": "bjuda",
  "en": "to invite",
  "t": "v",
  "c": "(bjuder, bjöd, bjudit)",
  "es": "Hon bjuder oss.",
  "ee": "She invites us.",
  "ch": 11,
  "lv": "A1",
  "wpm": 139.86
}, {
  "id": 719,
  "sv": "till och med (förk. t.o.m., t o m)",
  "en": "even",
  "t": "a",
  "es": "H an kom till och med tidigt.",
  "ee": "He even came early.",
  "lv": "A1",
  "wpm": 139.7
}, {
  "id": 720,
  "sv": "hävda",
  "en": "to claim",
  "t": "v",
  "es": "Han hävdar att det är sant.",
  "ee": "He claims that it is true.",
  "lv": "A1",
  "wpm": 139.57
}, {
  "id": 721,
  "sv": "hamna",
  "en": "to end up",
  "t": "v",
  "es": "Han hamnar i Stockholm.",
  "ee": "He ends up in Stockholm.",
  "lv": "A1",
  "wpm": 139.4
}, {
  "id": 722,
  "sv": "effekt",
  "en": "effect",
  "t": "n",
  "g": "en",
  "es": "Medicinen har effekt.",
  "ee": "The medicine has an effect.",
  "lv": "A1",
  "wpm": 138.78
}, {
  "id": 723,
  "sv": "enhet",
  "en": "unit",
  "t": "n",
  "g": "en",
  "es": "Det är en viktig enhet.",
  "ee": "It is an important unit.",
  "lv": "A1",
  "wpm": 138.39
}, {
  "id": 724,
  "sv": "det vill säga (förk. d.v.s., dvs.)",
  "en": "that is to say",
  "t": "a",
  "es": "Han är läkare det vill säga doktor.",
  "ee": "He is a physician that is to say a doctor.",
  "lv": "A1",
  "wpm": 138.07
}, {
  "id": 725,
  "sv": "kontakt",
  "en": "contact",
  "t": "n",
  "g": "en",
  "es": "Kontakten fortsätter.",
  "ee": "The contact continues.",
  "lv": "A1",
  "wpm": 137.86
}, {
  "id": 726,
  "sv": "takt",
  "en": "pace",
  "t": "n",
  "g": "en",
  "es": "Musiken går i snabb takt.",
  "ee": "The music goes at a fast pace.",
  "lv": "A1",
  "wpm": 137.86
}, {
  "id": 727,
  "sv": "värde",
  "en": "value",
  "t": "n",
  "g": "ett",
  "es": "Det är ett viktigt värde.",
  "ee": "It is an important value.",
  "lv": "A1",
  "wpm": 137.82
}, {
  "id": 728,
  "sv": "förutsättning",
  "en": "condition",
  "t": "n",
  "g": "en",
  "es": "Det är en viktig förutsättning.",
  "ee": "It is an important condition.",
  "lv": "A1",
  "wpm": 137.72
}, {
  "id": 729,
  "sv": "sats",
  "en": "sentence",
  "t": "n",
  "g": "en",
  "es": "Jag skriver en sats.",
  "ee": "I write a sentence.",
  "lv": "A1",
  "wpm": 137.65
}, {
  "id": 730,
  "sv": "medlemsstat",
  "en": "member state",
  "t": "n",
  "g": "en",
  "es": "Sverige är en medlemsstat.",
  "ee": "Sweden is a member state.",
  "lv": "A1",
  "wpm": 137.58
}, {
  "id": 731,
  "sv": "hinna",
  "en": "to have time",
  "t": "v",
  "c": "(hinner, hann, hunnit)",
  "es": "Jag hinner inte.",
  "ee": "I do not have time.",
  "ch": 8,
  "lv": "A1",
  "wpm": 137.35
}, {
  "id": 732,
  "sv": "sanning",
  "en": "truth",
  "t": "n",
  "g": "en",
  "es": "Det är en sanning.",
  "ee": "It is a truth.",
  "lv": "A1",
  "wpm": 136.75
}, {
  "id": 733,
  "sv": "religion",
  "en": "religion",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Religion är viktig.",
  "ee": "Religion is important.",
  "ch": 10,
  "lv": "A1",
  "wpm": 136.55
}, {
  "id": 734,
  "sv": "källa",
  "en": "source",
  "t": "n",
  "g": "en",
  "c": "(-n, -or, -orna)",
  "es": "Artikeln har en källa.",
  "ee": "The article has a source.",
  "ch": 1,
  "lv": "A1",
  "wpm": 136.13
}, {
  "id": 735,
  "sv": "må",
  "en": "to feel",
  "t": "v",
  "c": "(mår, mådde, mått)",
  "es": "Jag mår bra.",
  "ee": "I feel well.",
  "ch": 2,
  "lv": "A1",
  "wpm": 135.98
}, {
  "id": 736,
  "sv": "kostnad",
  "en": "cost",
  "t": "n",
  "g": "en",
  "es": "Det är en hög kostnad.",
  "ee": "It is a high cost.",
  "lv": "A1",
  "wpm": 135.72
}, {
  "id": 737,
  "sv": "medborgare",
  "en": "citizen",
  "t": "n",
  "g": "en",
  "es": "Varje medborgare röstar.",
  "ee": "Every citizen votes.",
  "lv": "A1",
  "wpm": 135.65
}, {
  "id": 738,
  "sv": "förhållande",
  "en": "relationship",
  "t": "n",
  "g": "ett",
  "es": "De har ett långt förhållande.",
  "ee": "They have a long relationship.",
  "lv": "A1",
  "wpm": 135.64
}, {
  "id": 739,
  "sv": "far (el. fader, vardagl. farsa)",
  "en": "father",
  "t": "n",
  "g": "en",
  "es": "Min far arbetar.",
  "ee": "My father works.",
  "lv": "A1",
  "wpm": 135.06
}, {
  "id": 740,
  "sv": "miljard",
  "en": "billion",
  "t": "n",
  "g": "en",
  "es": "Företaget tjänar en miljard kronor.",
  "ee": "The company earns one billion kronor.",
  "lv": "A1",
  "wpm": 134.96
}, {
  "id": 741,
  "sv": "ungdom",
  "en": "youth",
  "t": "n",
  "g": "en",
  "es": "Ungdom är viktig.",
  "ee": "Youth is important.",
  "lv": "A1",
  "wpm": 134.37
}, {
  "id": 742,
  "sv": "släppa",
  "en": "to release",
  "t": "v",
  "es": "Han släpper bollen.",
  "ee": "He releases the ball.",
  "lv": "A1",
  "wpm": 134.32
}, {
  "id": 743,
  "sv": "enbart",
  "en": "only",
  "t": "a",
  "es": "Det är enbart sant.",
  "ee": "It is only true.",
  "lv": "A1",
  "wpm": 134.15
}, {
  "id": 744,
  "sv": "drag",
  "en": "move / trait",
  "t": "n",
  "g": "ett",
  "es": "Det är ett viktigt drag.",
  "ee": "It is an important trait.",
  "lv": "A1",
  "wpm": 134.15
}, {
  "id": 745,
  "sv": "verklighet",
  "en": "reality",
  "t": "n",
  "g": "en",
  "es": "Det blir verklighet.",
  "ee": "It becomes reality.",
  "lv": "A1",
  "wpm": 133.94
}, {
  "id": 746,
  "sv": "författare",
  "en": "author",
  "t": "n",
  "g": "en",
  "c": "(-n, −, -na)",
  "es": "Hon är en känd författare.",
  "ee": "She is a known author.",
  "ch": 5,
  "lv": "A1",
  "wpm": 133.87
}, {
  "id": 747,
  "sv": "tillgång",
  "en": "asset",
  "t": "n",
  "g": "en",
  "es": "Vatten är en tillgång.",
  "ee": "Water is an asset.",
  "lv": "A1",
  "wpm": 133.5
}, {
  "id": 748,
  "sv": "nödvändig",
  "en": "necessary",
  "t": "a",
  "es": "Det är nödvändigt.",
  "ee": "It is necessary.",
  "lv": "A1",
  "wpm": 133.42
}, {
  "id": 749,
  "sv": "full",
  "en": "full",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Glaset är fullt.",
  "ee": "The glass is full.",
  "ch": 12,
  "lv": "A1",
  "wpm": 133.12
}, {
  "id": 750,
  "sv": "frihet",
  "en": "freedom",
  "t": "n",
  "g": "en",
  "c": "(-en)",
  "es": "Frihet är viktigt.",
  "ee": "Freedom is important.",
  "ch": 14,
  "lv": "A1",
  "wpm": 132.47
}, {
  "id": 751,
  "sv": "passa",
  "en": "to suit / fit",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Tröjan passar bra.",
  "ee": "The sweater fits well.",
  "ch": 6,
  "lv": "A1",
  "wpm": 132.39
}, {
  "id": 752,
  "sv": "lokal",
  "en": "local",
  "t": "a",
  "es": "Det är en lokal fråga.",
  "ee": "It is a local question.",
  "lv": "A1",
  "wpm": 132.16
}, {
  "id": 753,
  "sv": "ytterligare",
  "en": "additional",
  "t": "a",
  "es": "Vi behöver ytterligare hjälp.",
  "ee": "We need additional help.",
  "lv": "A1",
  "wpm": 131.58
}, {
  "id": 754,
  "sv": "öppna",
  "en": "to open",
  "t": "v",
  "c": "(-r, de, -t)",
  "es": "Han öppnar dörren.",
  "ee": "He opens the door.",
  "ch": 11,
  "lv": "A1",
  "wpm": 131.53
}, {
  "id": 755,
  "sv": "införa",
  "en": "to introduce",
  "t": "v",
  "es": "Regeringen inför en lag.",
  "ee": "The government introduces a law.",
  "lv": "A1",
  "wpm": 130.26
}, {
  "id": 756,
  "sv": "ledare",
  "en": "leader",
  "t": "n",
  "g": "en",
  "es": "Han är en bra ledare.",
  "ee": "He is a good leader.",
  "lv": "A1",
  "wpm": 129.98
}, {
  "id": 757,
  "sv": "mamma",
  "en": "mother",
  "t": "n",
  "g": "en",
  "c": "(-n, -or, -orna)",
  "es": "Min mamma ringer.",
  "ee": "My mother calls.",
  "ch": 2,
  "lv": "A1",
  "wpm": 129.87
}, {
  "id": 758,
  "sv": "sammanhang",
  "en": "context",
  "t": "n",
  "g": "ett",
  "es": "Ordet står i ett sammanhang.",
  "ee": "The word stands in a context.",
  "lv": "A1",
  "wpm": 129.67
}, {
  "id": 759,
  "sv": "svensk",
  "en": "a Swede",
  "t": "n",
  "g": "en",
  "c": "(-t, -a)",
  "es": "Han är en svensk.",
  "ee": "He is a Swede.",
  "ch": 1,
  "lv": "A1",
  "wpm": 129.62
}, {
  "id": 760,
  "sv": "hemma",
  "en": "at home",
  "t": "a",
  "es": "Jag är hemma.",
  "ee": "I am at home.",
  "lv": "A1",
  "wpm": 129.59
}, {
  "id": 761,
  "sv": "produkt",
  "en": "product",
  "t": "n",
  "g": "en",
  "es": "Företaget säljer en produkt.",
  "ee": "The company sells a product.",
  "lv": "A1",
  "wpm": 129.58
}, {
  "id": 762,
  "sv": "därefter",
  "en": "after that",
  "t": "a",
  "es": "Vi äter därefter.",
  "ee": "We eat after that.",
  "lv": "A1",
  "wpm": 129.33
}, {
  "id": 763,
  "sv": "efter",
  "en": "after",
  "t": "a",
  "es": "Vi går hem efter mötet.",
  "ee": "We go home after the meeting.",
  "ch": 3,
  "lv": "A1",
  "wpm": 129.33
}, {
  "id": 764,
  "sv": "match",
  "en": "match",
  "t": "n",
  "g": "en",
  "c": "(-en , -er, -erna)",
  "es": "Laget spelar en match.",
  "ee": "The team plays a match.",
  "ch": 20,
  "lv": "A1",
  "wpm": 129.11
}, {
  "id": 765,
  "sv": "tro",
  "en": "faith / belief",
  "t": "n",
  "g": "en",
  "c": "(tror, trodde, trott)",
  "es": "Hon har en stark tro.",
  "ee": "She has a strong faith.",
  "ch": 2,
  "lv": "A1",
  "wpm": 129.11
}, {
  "id": 766,
  "sv": "alldeles",
  "en": "completely",
  "t": "a",
  "es": "Det är alldeles sant.",
  "ee": "It is completely true.",
  "lv": "A1",
  "wpm": 128.37
}, {
  "id": 767,
  "sv": "lätt",
  "en": "easy",
  "t": "a",
  "c": "(-a)",
  "es": "Uppgiften är lätt.",
  "ee": "The task is easy.",
  "ch": 1,
  "lv": "A1",
  "wpm": 128.34
}, {
  "id": 768,
  "sv": "sann",
  "en": "True",
  "t": "a",
  "c": "(sant, sanna)",
  "ch": 20,
  "lv": "A1",
  "wpm": 128.33
}, {
  "id": 769,
  "sv": "uppfattning",
  "en": "perception",
  "t": "n",
  "g": "en",
  "es": "Uppfattningen förändras.",
  "ee": "The perception changes.",
  "lv": "A1",
  "wpm": 128.3
}, {
  "id": 770,
  "sv": "demokrat",
  "en": "democrat",
  "t": "n",
  "g": "en",
  "es": "Han är demokrat.",
  "ee": "He is a democrat.",
  "lv": "A1",
  "wpm": 128.13
}, {
  "id": 771,
  "sv": "bolag",
  "en": "company",
  "t": "n",
  "g": "ett",
  "c": "(-et, −, -en)",
  "es": "Bolaget växer.",
  "ee": "The company grows.",
  "ch": 18,
  "lv": "A1",
  "wpm": 128.01
}, {
  "id": 772,
  "sv": "erfarenhet",
  "en": "experience",
  "t": "n",
  "g": "en",
  "es": "Jag har erfarenhet.",
  "ee": "I have experience.",
  "lv": "A1",
  "wpm": 127.97
}, {
  "id": 773,
  "sv": "kritik",
  "en": "criticism",
  "t": "n",
  "g": "en",
  "es": "Artikeln får kritik.",
  "ee": "The article receives criticism.",
  "lv": "A1",
  "wpm": 127.81
}, {
  "id": 774,
  "sv": "grad",
  "en": "degree",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Temperaturen är tio grader.",
  "ee": "The temperature is ten degrees.",
  "ch": 14,
  "lv": "A1",
  "wpm": 127.76
}, {
  "id": 775,
  "sv": "jude",
  "en": "Jew",
  "t": "n",
  "g": "en",
  "c": "(-n, judar, judarna)",
  "es": "Han är jude.",
  "ee": "He is Jewish.",
  "ch": 10,
  "lv": "A1",
  "wpm": 127.57
}, {
  "id": 776,
  "sv": "vacker",
  "en": "beautiful",
  "t": "a",
  "c": "(-t, -vackra)",
  "es": "Staden är vacker.",
  "ee": "The city is beautiful.",
  "ch": 6,
  "lv": "A1",
  "wpm": 127.57
}, {
  "id": 777,
  "sv": "erbjuda",
  "en": "to offer",
  "t": "v",
  "es": "Företaget erbjuder hjälp.",
  "ee": "The company offers help.",
  "lv": "A1",
  "wpm": 127.44
}, {
  "id": 778,
  "sv": "kamp",
  "en": "struggle",
  "t": "n",
  "g": "en",
  "es": "Kampen fortsätter.",
  "ee": "The struggle continues.",
  "lv": "A1",
  "wpm": 127.43
}, {
  "id": 779,
  "sv": "period",
  "en": "period",
  "t": "n",
  "g": "en",
  "es": "Det är en svår period.",
  "ee": "It is a difficult period.",
  "lv": "A1",
  "wpm": 127.37
}, {
  "id": 780,
  "sv": "modern",
  "en": "modern",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Huset är modernt.",
  "ee": "The house is modern.",
  "ch": 7,
  "lv": "A1",
  "wpm": 127.04
}, {
  "id": 781,
  "sv": "spelare",
  "en": "player",
  "t": "n",
  "g": "en",
  "es": "Spelaren springer.",
  "ee": "The player runs.",
  "lv": "A1",
  "wpm": 127.02
}, {
  "id": 782,
  "sv": "elev",
  "en": "student",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Eleven läser.",
  "ee": "The student reads.",
  "ch": 1,
  "lv": "A1",
  "wpm": 127.01
}, {
  "id": 783,
  "sv": "utredning",
  "en": "investigation",
  "t": "n",
  "g": "en",
  "es": "Polisen gör en utredning.",
  "ee": "The police make an investigation.",
  "lv": "A1",
  "wpm": 126.93
}, {
  "id": 784,
  "sv": "ingå",
  "en": "to be included",
  "t": "v",
  "es": "Han ingår i gruppen.",
  "ee": "He is included in the group.",
  "lv": "A1",
  "wpm": 126.92
}, {
  "id": 785,
  "sv": "kung",
  "en": "king",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "Kungen talar.",
  "ee": "The king speaks.",
  "ch": 2,
  "lv": "A1",
  "wpm": 126.7
}, {
  "id": 786,
  "sv": "bestå",
  "en": "to consist",
  "t": "v",
  "es": "Teamet består av fem personer.",
  "ee": "The team consists of five people.",
  "lv": "A1",
  "wpm": 126.46
}, {
  "id": 787,
  "sv": "katt",
  "en": "cat",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Katten sover.",
  "ee": "The cat sleeps.",
  "ch": 2,
  "lv": "A1",
  "wpm": 126.45
}, {
  "id": 788,
  "sv": "konstatera",
  "en": "to note / establish",
  "t": "v",
  "es": "De konstaterar resultatet.",
  "ee": "They establish the result.",
  "lv": "A1",
  "wpm": 126.41
}, {
  "id": 789,
  "sv": "dit",
  "en": "there (to)",
  "t": "a",
  "es": "Vi går dit.",
  "ee": "We go there.",
  "ch": 13,
  "lv": "A1",
  "wpm": 126.29
}, {
  "id": 790,
  "sv": "klart",
  "en": "clear / obviously",
  "t": "a",
  "es": "Det är klart.",
  "ee": "It is clear.",
  "lv": "A1",
  "wpm": 126.22
}, {
  "id": 791,
  "sv": "nuvarande",
  "en": "current",
  "t": "a",
  "es": "Den nuvarande planen gäller.",
  "ee": "The current plan applies.",
  "lv": "A1",
  "wpm": 126.21
}, {
  "id": 792,
  "sv": "styra",
  "en": "to govern / steer",
  "t": "v",
  "es": "Hon styr landet.",
  "ee": "She governs the country.",
  "lv": "A1",
  "wpm": 126.2
}, {
  "id": 793,
  "sv": "förlora",
  "en": "to lose",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Laget förlorar.",
  "ee": "The team loses.",
  "ch": 18,
  "lv": "A1",
  "wpm": 126.19
}, {
  "id": 794,
  "sv": "vit",
  "en": "white",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Huset är vitt.",
  "ee": "The house is white.",
  "ch": 7,
  "lv": "A1",
  "wpm": 126.15
}, {
  "id": 795,
  "sv": "klocka",
  "en": "clock",
  "t": "n",
  "g": "en",
  "c": "(-n, -or, -orna)",
  "es": "Klockan är ny.",
  "ee": "The clock is new.",
  "ch": 3,
  "lv": "A1",
  "wpm": 125.96
}, {
  "id": 796,
  "sv": "påstå",
  "en": "to claim",
  "t": "v",
  "es": "Han påstår det.",
  "ee": "He claims that.",
  "lv": "A1",
  "wpm": 125.75
}, {
  "id": 797,
  "sv": "skatt",
  "en": "tax",
  "t": "n",
  "g": "en",
  "es": "Regeringen höjer skatten.",
  "ee": "The government raises the tax.",
  "lv": "A1",
  "wpm": 125.65
}, {
  "id": 798,
  "sv": "besluta",
  "en": "to decide",
  "t": "v",
  "es": "Regeringen beslutar.",
  "ee": "The government decides.",
  "lv": "A1",
  "wpm": 125.13
}, {
  "id": 799,
  "sv": "befolkning",
  "en": "population",
  "t": "n",
  "g": "en",
  "c": "(-en)",
  "es": "Landet har en stor befolkning.",
  "ee": "The country has a large population.",
  "ch": 10,
  "lv": "A1",
  "wpm": 125.01
}, {
  "id": 800,
  "sv": "avse",
  "en": "to concern",
  "t": "v",
  "es": "Regeln avser alla.",
  "ee": "The rule concerns everyone.",
  "lv": "A1",
  "wpm": 124.91
}, {
  "id": 801,
  "sv": "ro",
  "en": "calm / peace",
  "t": "n",
  "g": "en",
  "es": "Vi behöver lite ro.",
  "ee": "We need some peace.",
  "lv": "A1",
  "wpm": 124.53
}, {
  "id": 802,
  "sv": "privat",
  "en": "private",
  "t": "a",
  "es": "Det är ett privat möte.",
  "ee": "It is a private meeting.",
  "lv": "A1",
  "wpm": 124.48
}, {
  "id": 803,
  "sv": "steg",
  "en": "step",
  "t": "n",
  "g": "ett",
  "es": "Vi tar ett steg fram.",
  "ee": "We take a step forward.",
  "lv": "A1",
  "wpm": 124.22
}, {
  "id": 804,
  "sv": "art",
  "en": "species",
  "t": "n",
  "g": "en",
  "es": "Det finns en ny art.",
  "ee": "There is a new species.",
  "lv": "A1",
  "wpm": 123.8
}, {
  "id": 805,
  "sv": "stödja",
  "en": "to support",
  "t": "v",
  "es": "De stödjer projektet.",
  "ee": "They support the project.",
  "lv": "A1",
  "wpm": 123.76
}, {
  "id": 806,
  "sv": "ond",
  "en": "evil / bad",
  "t": "a",
  "es": "Det var en ond handling.",
  "ee": "It was an evil act.",
  "lv": "A1",
  "wpm": 123.18
}, {
  "id": 807,
  "sv": "plan",
  "en": "plan",
  "t": "n",
  "g": "en",
  "es": "Vi gör en plan.",
  "ee": "We make a plan.",
  "lv": "A1",
  "wpm": 122.73
}, {
  "id": 808,
  "sv": "resa",
  "en": "trip",
  "t": "n",
  "g": "en",
  "lv": "A1",
  "wpm": 122.43
}, {
  "id": 809,
  "sv": "utom",
  "en": "except",
  "t": "p",
  "es": "Alla kom utom honom.",
  "ee": "Everyone came except him.",
  "ch": 17,
  "lv": "A1",
  "wpm": 122.27
}, {
  "id": 810,
  "sv": "hund",
  "en": "dog",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "Hunden sover.",
  "ee": "The dog sleeps.",
  "ch": 2,
  "lv": "A1",
  "wpm": 122.24
}, {
  "id": 811,
  "sv": "syn",
  "en": "sight / view",
  "t": "n",
  "g": "en",
  "es": "Det är en vacker syn.",
  "ee": "It is a beautiful sight.",
  "lv": "A1",
  "wpm": 122.2
}, {
  "id": 812,
  "sv": "glömma",
  "en": "to forget",
  "t": "v",
  "c": "(glömmer, glömde, glömt)",
  "es": "Jag glömmer nyckeln.",
  "ee": "I forget the key.",
  "ch": 11,
  "lv": "A1",
  "wpm": 122.09
}, {
  "id": 813,
  "sv": "avtal",
  "en": "agreement",
  "t": "n",
  "g": "ett",
  "es": "De skriver ett avtal.",
  "ee": "They sign an agreement.",
  "lv": "A1",
  "wpm": 121.92
}, {
  "id": 814,
  "sv": "lek",
  "en": "game",
  "t": "n",
  "g": "en",
  "es": "Barnen leker en lek.",
  "ee": "The children play a game.",
  "lv": "A1",
  "wpm": 121.7
}, {
  "id": 815,
  "sv": "kul",
  "en": "fun",
  "t": "a",
  "c": "(ugs)",
  "es": "Det är kul.",
  "ee": "It is fun.",
  "ch": 2,
  "lv": "A1",
  "wpm": 121.6
}, {
  "id": 816,
  "sv": "natt",
  "en": "night",
  "t": "n",
  "g": "en",
  "c": "(-en, nätter, nätterna)",
  "es": "Vi stannar en natt.",
  "ee": "We stay one night.",
  "ch": 12,
  "lv": "A1",
  "wpm": 121.51
}, {
  "id": 817,
  "sv": "förändra",
  "en": "to change",
  "t": "v",
  "es": "De förändrar planen.",
  "ee": "They change the plan.",
  "lv": "A1",
  "wpm": 121.43
}, {
  "id": 818,
  "sv": "ange",
  "en": "to state / indicate",
  "t": "v",
  "es": "Han anger sitt namn.",
  "ee": "He states his name.",
  "lv": "A1",
  "wpm": 121.39
}, {
  "id": 819,
  "sv": "någonting",
  "en": "something",
  "t": "p",
  "es": "Jag hör någonting.",
  "ee": "I hear something.",
  "lv": "A1",
  "wpm": 121.12
}, {
  "id": 820,
  "sv": "förstås",
  "en": "of course",
  "t": "a",
  "es": "Det är förstås sant.",
  "ee": "It is of course true.",
  "ch": 3,
  "lv": "A1",
  "wpm": 121.03
}, {
  "id": 821,
  "sv": "individ",
  "en": "individual",
  "t": "n",
  "g": "en",
  "es": "Varje individ är unik.",
  "ee": "Each individual is unique.",
  "lv": "A1",
  "wpm": 120.93
}, {
  "id": 822,
  "sv": "älska",
  "en": "to love",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Jag älskar musik.",
  "ee": "I love music.",
  "ch": 3,
  "lv": "A1",
  "wpm": 120.93
}, {
  "id": 823,
  "sv": "motion",
  "en": "exercise",
  "t": "n",
  "g": "en",
  "es": "Motionspasset börjar.",
  "ee": "The exercise session begins.",
  "lv": "A1",
  "wpm": 120.87
}, {
  "id": 824,
  "sv": "glad",
  "en": "happy",
  "t": "a",
  "c": "(glatt, glada)",
  "es": "Hon är glad.",
  "ee": "She is happy.",
  "ch": 7,
  "lv": "A1",
  "wpm": 120.57
}, {
  "id": 825,
  "sv": "ned",
  "en": "down",
  "t": "p",
  "es": "Hunden går ned.",
  "ee": "The dog goes down.",
  "lv": "A1",
  "wpm": 120.5
}, {
  "id": 826,
  "sv": "dator",
  "en": "computer",
  "t": "n",
  "g": "en",
  "c": "(-n, -er, -erna)",
  "es": "Datorn startar.",
  "ee": "The computer starts.",
  "ch": 2,
  "lv": "A1",
  "wpm": 120.28
}, {
  "id": 827,
  "sv": "miljö",
  "en": "environment",
  "t": "n",
  "g": "en",
  "es": "Miljön är viktig.",
  "ee": "The environment is important.",
  "lv": "A1",
  "wpm": 120.16
}, {
  "id": 828,
  "sv": "ek",
  "en": "oak",
  "t": "n",
  "g": "en",
  "es": "En ek växer här.",
  "ee": "An oak grows here.",
  "lv": "A1",
  "wpm": 119.87
}, {
  "id": 829,
  "sv": "åtminstone",
  "en": "at least",
  "t": "a",
  "es": "Han försöker åtminstone.",
  "ee": "He tries at least.",
  "lv": "A1",
  "wpm": 119.86
}, {
  "id": 830,
  "sv": "presentera",
  "en": "to present",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Hon presenterar planen.",
  "ee": "She presents the plan.",
  "ch": 1,
  "lv": "A1",
  "wpm": 119.78
}, {
  "id": 831,
  "sv": "stanna",
  "en": "to stay",
  "t": "v",
  "c": "(-r, -ade, -t)",
  "es": "Vi stannar här.",
  "ee": "We stay here.",
  "ch": 5,
  "lv": "A1",
  "wpm": 119.33
}, {
  "id": 832,
  "sv": "byta",
  "en": "to change",
  "t": "v",
  "c": "(byter, bytte, bytt)",
  "ch": 2,
  "lv": "A1",
  "wpm": 119.29
}, {
  "id": 833,
  "sv": "alternativ",
  "en": "alternative",
  "t": "n",
  "g": "ett",
  "es": "Det finns ett alternativ.",
  "ee": "There is an alternative.",
  "lv": "A1",
  "wpm": 118.94
}, {
  "id": 834,
  "sv": "minut",
  "en": "minute",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Vänta en minut.",
  "ee": "Wait a minute.",
  "ch": 3,
  "lv": "A1",
  "wpm": 118.87
}, {
  "id": 835,
  "sv": "ingenting",
  "en": "nothing",
  "t": "p",
  "es": "Jag ser ingenting.",
  "ee": "I see nothing.",
  "ch": 9,
  "lv": "A1",
  "wpm": 118.79
}, {
  "id": 836,
  "sv": "uppleva",
  "en": "to experience",
  "t": "v",
  "es": "Vi upplever något nytt.",
  "ee": "We experience something new.",
  "lv": "A1",
  "wpm": 118.65
}, {
  "id": 837,
  "sv": "samla",
  "en": "to collect",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Han samlar frimärken.",
  "ee": "He collects stamps.",
  "ch": 16,
  "lv": "A1",
  "wpm": 118.53
}, {
  "id": 838,
  "sv": "svart",
  "en": "black",
  "t": "a",
  "c": "(-a)",
  "es": "Bilen är svart.",
  "ee": "The car is black.",
  "ch": 7,
  "lv": "A1",
  "wpm": 118.26
}, {
  "id": 839,
  "sv": "bakgrund",
  "en": "background",
  "t": "n",
  "g": "en",
  "es": "Han har en lång bakgrund.",
  "ee": "He has a long background.",
  "lv": "A1",
  "wpm": 118.12
}, {
  "id": 840,
  "sv": "skott",
  "en": "shot",
  "t": "n",
  "g": "ett",
  "es": "De hör ett skott.",
  "ee": "They hear a shot.",
  "lv": "A1",
  "wpm": 118.07
}, {
  "id": 841,
  "sv": "ö",
  "en": "island",
  "t": "n",
  "g": "en",
  "c": "(-n, -ar, -arna)",
  "es": "Vi bor på en ö.",
  "ee": "We live on an island.",
  "ch": 8,
  "lv": "A1",
  "wpm": 118.02
}, {
  "id": 842,
  "sv": "kärlek",
  "en": "love",
  "t": "n",
  "g": "en",
  "es": "Kärlek är viktigt.",
  "ee": "Love is important.",
  "lv": "A1",
  "wpm": 118.0
}, {
  "id": 843,
  "sv": "metod",
  "en": "method",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "De använder en metod.",
  "ee": "They use a method.",
  "ch": 11,
  "lv": "A1",
  "wpm": 117.61
}, {
  "id": 844,
  "sv": "äldre",
  "en": "older",
  "t": "a",
  "es": "Han är äldre än jag.",
  "ee": "He is older than me.",
  "ch": 16,
  "lv": "A1",
  "wpm": 117.18
}, {
  "id": 845,
  "sv": "säker",
  "en": "safe / certain",
  "t": "a",
  "c": "(-t, säkra)",
  "es": "Jag är säker.",
  "ee": "I am sure.",
  "ch": 10,
  "lv": "A1",
  "wpm": 117.08
}, {
  "id": 846,
  "sv": "borgare",
  "en": "bourgeois / citizen",
  "t": "n",
  "g": "en",
  "es": "Han är en borgare.",
  "ee": "He is a citizen.",
  "lv": "A1",
  "wpm": 117.01
}, {
  "id": 847,
  "sv": "gud",
  "en": "god",
  "t": "n",
  "g": "en",
  "es": "De tror på en gud.",
  "ee": "They believe in a god.",
  "lv": "A1",
  "wpm": 116.98
}, {
  "id": 848,
  "sv": "insats",
  "en": "effort",
  "t": "n",
  "g": "en",
  "es": "Det krävs en stor insats.",
  "ee": "It requires a big effort.",
  "lv": "A1",
  "wpm": 116.63
}, {
  "id": 849,
  "sv": "tysk",
  "en": "German",
  "t": "a",
  "es": "Han är tysk.",
  "ee": "He is German.",
  "lv": "A1",
  "wpm": 116.47
}, {
  "id": 850,
  "sv": "kontroll",
  "en": "control",
  "t": "n",
  "g": "en",
  "es": "Polisen gör en kontroll.",
  "ee": "The police make a check.",
  "lv": "A1",
  "wpm": 116.35
}, {
  "id": 851,
  "sv": "lösa",
  "en": "to solve",
  "t": "v",
  "lv": "A1",
  "wpm": 116.34
}, {
  "id": 852,
  "sv": "kolla",
  "en": "to check",
  "t": "v",
  "es": "Jag kollar mejlet.",
  "ee": "I check the email.",
  "lv": "A1",
  "wpm": 116.13
}, {
  "id": 853,
  "sv": "fylla",
  "en": "to fill",
  "t": "v",
  "c": "(-er, -de, -t)",
  "es": "Hon fyller glaset.",
  "ee": "She fills the glass.",
  "ch": 11,
  "lv": "A1",
  "wpm": 116.0
}, {
  "id": 854,
  "sv": "bestämmelse",
  "en": "regulation",
  "t": "n",
  "g": "en",
  "es": "Det finns en ny bestämmelse.",
  "ee": "There is a new regulation.",
  "lv": "A1",
  "wpm": 115.66
}, {
  "id": 855,
  "sv": "ris",
  "en": "rice / criticism",
  "t": "n",
  "g": "ett",
  "c": "(-et)",
  "es": "Jag äter ris.",
  "ee": "I eat rice.",
  "ch": 12,
  "lv": "A1",
  "wpm": 115.66
}, {
  "id": 856,
  "sv": "drabba",
  "en": "to affect",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Olyckan drabbar många.",
  "ee": "The accident affects many.",
  "ch": 20,
  "lv": "A1",
  "wpm": 115.55
}, {
  "id": 857,
  "sv": "nät",
  "en": "net / network",
  "t": "n",
  "g": "ett",
  "c": "(-et, –, -en)",
  "es": "De bygger ett nät.",
  "ee": "They build a network.",
  "ch": 2,
  "lv": "A1",
  "wpm": 115.48
}, {
  "id": 858,
  "sv": "teknik",
  "en": "technology",
  "t": "n",
  "g": "en",
  "es": "Ny teknik utvecklas.",
  "ee": "New technology develops.",
  "lv": "A1",
  "wpm": 115.08
}, {
  "id": 859,
  "sv": "resurs",
  "en": "resource",
  "t": "n",
  "g": "en",
  "es": "Vatten är en resurs.",
  "ee": "Water is a resource.",
  "lv": "A1",
  "wpm": 115.04
}, {
  "id": 860,
  "sv": "försök",
  "en": "attempt",
  "t": "n",
  "g": "ett",
  "es": "Han gör ett försök.",
  "ee": "He makes an attempt.",
  "lv": "A1",
  "wpm": 114.85
}, {
  "id": 861,
  "sv": "fara",
  "en": "to travel",
  "t": "v",
  "es": "Han far till Stockholm.",
  "ee": "He travels to Stockholm.",
  "lv": "A1",
  "wpm": 114.82
}, {
  "id": 862,
  "sv": "tjäna",
  "en": "to earn",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Hon tjänar pengar.",
  "ee": "She earns money.",
  "ch": 6,
  "lv": "A1",
  "wpm": 114.8
}, {
  "id": 863,
  "sv": "argument",
  "en": "argument",
  "t": "n",
  "g": "ett",
  "es": "Han ger ett argument.",
  "ee": "He gives an argument.",
  "lv": "A1",
  "wpm": 114.69
}, {
  "id": 864,
  "sv": "behandla",
  "en": "to treat",
  "t": "v",
  "es": "De behandlar frågan.",
  "ee": "They treat the issue.",
  "lv": "A1",
  "wpm": 114.58
}, {
  "id": 865,
  "sv": "ren",
  "en": "clean / pure",
  "t": "a",
  "es": "Vattnet är rent.",
  "ee": "The water is clean.",
  "lv": "A1",
  "wpm": 114.14
}, {
  "id": 866,
  "sv": "fru",
  "en": "wife",
  "t": "n",
  "g": "en",
  "c": "(-n, -ar, -arna)",
  "es": "Hans fru arbetar.",
  "ee": "His wife works.",
  "ch": 1,
  "lv": "A1",
  "wpm": 114.0
}, {
  "id": 867,
  "sv": "sjuk",
  "en": "sick",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Jag är sjuk.",
  "ee": "I am sick.",
  "ch": 15,
  "lv": "A1",
  "wpm": 113.46
}, {
  "id": 868,
  "sv": "istället för (el. i stället för)",
  "en": "instead of",
  "t": "p",
  "es": "Vi går hem istället för att stanna.",
  "ee": "We go home instead of staying.",
  "lv": "A1",
  "wpm": 113.32
}, {
  "id": 869,
  "sv": "våld",
  "en": "violence",
  "t": "n",
  "g": "ett",
  "es": "Våld är farligt.",
  "ee": "Violence is dangerous.",
  "lv": "A1",
  "wpm": 113.28
}, {
  "id": 870,
  "sv": "utföra",
  "en": "to perform",
  "t": "v",
  "es": "De utför arbetet.",
  "ee": "They perform the work.",
  "lv": "A1",
  "wpm": 113.17
}, {
  "id": 871,
  "sv": "ställning",
  "en": "position",
  "t": "n",
  "g": "en",
  "es": "Hon tar en ställning.",
  "ee": "She takes a position.",
  "lv": "A1",
  "wpm": 113.06
}, {
  "id": 872,
  "sv": "främst",
  "en": "mainly",
  "t": "a",
  "es": "Han arbetar främst hemma.",
  "ee": "He works mainly at home.",
  "lv": "A1",
  "wpm": 112.96
}, {
  "id": 873,
  "sv": "räcka",
  "en": "to be enough",
  "t": "v",
  "es": "Det räcker.",
  "ee": "It is enough.",
  "lv": "A1",
  "wpm": 112.94
}, {
  "id": 874,
  "sv": "bättre",
  "en": "better",
  "t": "a",
  "es": "Det är bättre nu.",
  "ee": "It is better now.",
  "lv": "A1",
  "wpm": 112.92
}, {
  "id": 875,
  "sv": "fundera",
  "en": "to think",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Jag funderar.",
  "ee": "I think.",
  "ch": 7,
  "lv": "A1",
  "wpm": 112.8
}, {
  "id": 876,
  "sv": "visst",
  "en": "certainly",
  "t": "a",
  "es": "Visst är det sant.",
  "ee": "Certainly it is true.",
  "lv": "A1",
  "wpm": 112.62
}, {
  "id": 877,
  "sv": "sommar",
  "en": "summer",
  "t": "n",
  "g": "en",
  "c": "(-en, somrar, somrarna)",
  "es": "Vi reser i sommar.",
  "ee": "We travel in summer.",
  "ch": 2,
  "lv": "A1",
  "wpm": 112.48
}, {
  "id": 878,
  "sv": "rörelse",
  "en": "movement",
  "t": "n",
  "g": "en",
  "es": "Rörelsen växer.",
  "ee": "The movement grows.",
  "lv": "A1",
  "wpm": 112.44
}, {
  "id": 879,
  "sv": "kund",
  "en": "customer",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Kunden väntar.",
  "ee": "The customer waits.",
  "ch": 7,
  "lv": "A1",
  "wpm": 112.31
}, {
  "id": 880,
  "sv": "villkor",
  "en": "condition",
  "t": "n",
  "g": "ett",
  "es": "Det är ett viktigt villkor.",
  "ee": "It is an important condition.",
  "lv": "A1",
  "wpm": 112.19
}, {
  "id": 881,
  "sv": "tillbaka (vardagl. tillbaks)",
  "en": "back",
  "t": "a",
  "es": "Han kommer tillbaka.",
  "ee": "He comes back.",
  "lv": "A1",
  "wpm": 112.16
}, {
  "id": 882,
  "sv": "högt",
  "en": "high",
  "t": "a",
  "es": "Priset är högt.",
  "ee": "The price is high.",
  "lv": "A1",
  "wpm": 112.04
}, {
  "id": 883,
  "sv": "president",
  "en": "president",
  "t": "n",
  "g": "en",
  "es": "Presidenten talar.",
  "ee": "The president speaks.",
  "lv": "A1",
  "wpm": 111.99
}, {
  "id": 884,
  "sv": "emellertid",
  "en": "however",
  "t": "a",
  "es": "Han kommer emellertid senare.",
  "ee": "However he comes later.",
  "lv": "A1",
  "wpm": 111.59
}, {
  "id": 885,
  "sv": "händelse",
  "en": "event",
  "t": "n",
  "g": "en",
  "es": "Det var en viktig händelse.",
  "ee": "It was an important event.",
  "lv": "A1",
  "wpm": 111.44
}, {
  "id": 886,
  "sv": "uppstå",
  "en": "to arise",
  "t": "v",
  "es": "Ett problem uppstår.",
  "ee": "A problem arises.",
  "lv": "A1",
  "wpm": 111.37
}, {
  "id": 887,
  "sv": "acceptera",
  "en": "to accept",
  "t": "v",
  "es": "Jag accepterar beslutet.",
  "ee": "I accept the decision.",
  "lv": "A1",
  "wpm": 111.33
}, {
  "id": 888,
  "sv": "huvud",
  "en": "head",
  "t": "n",
  "g": "ett",
  "c": "(-et, -en, -ena)",
  "es": "Han skakar på huvudet.",
  "ee": "He shakes his head.",
  "ch": 15,
  "lv": "A1",
  "wpm": 111.17
}, {
  "id": 889,
  "sv": "sök",
  "en": "search",
  "t": "n",
  "g": "ett",
  "es": "Han gör ett sök.",
  "ee": "He performs a search.",
  "ch": 11,
  "lv": "A1",
  "wpm": 110.86
}, {
  "id": 890,
  "sv": "snabb",
  "en": "fast",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Hunden är snabb.",
  "ee": "The dog is fast.",
  "ch": 9,
  "lv": "A1",
  "wpm": 110.8
}, {
  "id": 891,
  "sv": "så kallad (förk. s.k., s k)",
  "en": "so-called",
  "t": "a",
  "es": "Det är en så kallad expert.",
  "ee": "He is a so-called expert.",
  "lv": "A1",
  "wpm": 110.51
}, {
  "id": 892,
  "sv": "framför",
  "en": "in front of",
  "t": "p",
  "es": "Bilen står framför huset.",
  "ee": "The car stands in front of the house.",
  "lv": "A1",
  "wpm": 110.51
}, {
  "id": 893,
  "sv": "ande",
  "en": "spirit",
  "t": "n",
  "g": "en",
  "lv": "A1",
  "wpm": 110.42
}, {
  "id": 894,
  "sv": "bilda",
  "en": "to form",
  "t": "v",
  "es": "De bildar en grupp.",
  "ee": "They form a group.",
  "lv": "A1",
  "wpm": 110.42
}, {
  "id": 895,
  "sv": "orsak",
  "en": "cause",
  "t": "n",
  "g": "en",
  "es": "Det finns en orsak.",
  "ee": "There is a cause.",
  "lv": "A1",
  "wpm": 110.42
}, {
  "id": 896,
  "sv": "försvinna",
  "en": "to disappear",
  "t": "v",
  "es": "Nyckeln försvinner.",
  "ee": "The key disappears.",
  "lv": "A1",
  "wpm": 110.33
}, {
  "id": 897,
  "sv": "fel",
  "en": "error",
  "t": "n",
  "g": "ett",
  "es": "Det är ett fel.",
  "ee": "It is an error.",
  "lv": "A1",
  "wpm": 110.16
}, {
  "id": 898,
  "sv": "innehåll",
  "en": "content",
  "t": "n",
  "g": "ett",
  "es": "Boken har ett rikt innehåll.",
  "ee": "The book has rich content.",
  "lv": "A1",
  "wpm": 110.12
}, {
  "id": 899,
  "sv": "natur",
  "en": "nature",
  "t": "n",
  "g": "en",
  "c": "(-en)",
  "es": "Naturen är vacker.",
  "ee": "Nature is beautiful.",
  "ch": 5,
  "lv": "A1",
  "wpm": 110.01
}, {
  "id": 900,
  "sv": "begrepp",
  "en": "concept",
  "t": "n",
  "g": "ett",
  "es": "Det är ett svårt begrepp.",
  "ee": "It is a difficult concept.",
  "lv": "A1",
  "wpm": 109.99
}, {
  "id": 901,
  "sv": "för att",
  "en": "in order to",
  "t": "s",
  "es": "Jag studerar för att lära.",
  "ee": "I study in order to learn.",
  "ch": 16,
  "lv": "A1",
  "wpm": 109.47
}, {
  "id": 902,
  "sv": "konflikt",
  "en": "conflict",
  "t": "n",
  "g": "en",
  "es": "Konflikten löses.",
  "ee": "The conflict is resolved.",
  "lv": "A1",
  "wpm": 109.19
}, {
  "id": 903,
  "sv": "tack",
  "en": "thanks",
  "t": "i",
  "es": "Tack för hjälpen.",
  "ee": "Thanks for the help.",
  "lv": "A1",
  "wpm": 108.87
}, {
  "id": 904,
  "sv": "djur",
  "en": "animal",
  "t": "n",
  "g": "ett",
  "es": "Jag ser ett djur.",
  "ee": "I see an animal.",
  "lv": "A1",
  "wpm": 108.73
}, {
  "id": 905,
  "sv": "chans",
  "en": "chance",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Jag får en chans.",
  "ee": "I get a chance.",
  "ch": 17,
  "lv": "A1",
  "wpm": 108.16
}, {
  "id": 906,
  "sv": "samtidigt som",
  "en": "while",
  "t": "s",
  "es": "Han arbetar samtidigt som hon studerar.",
  "ee": "He works while she studies.",
  "lv": "A1",
  "wpm": 108.12
}, {
  "id": 907,
  "sv": "demokratisk",
  "en": "democratic",
  "t": "a",
  "es": "Det är ett demokratiskt land.",
  "ee": "It is a democratic country.",
  "lv": "A1",
  "wpm": 107.94
}, {
  "id": 908,
  "sv": "fel",
  "en": "error",
  "t": "a",
  "es": "Det är ett fel.",
  "ee": "It is an error.",
  "lv": "A1",
  "wpm": 107.8
}, {
  "id": 909,
  "sv": "läge",
  "en": "situation",
  "t": "n",
  "g": "ett",
  "c": "(-t, -n, -na)",
  "es": "Läget är svårt.",
  "ee": "The situation is difficult.",
  "ch": 2,
  "lv": "A1",
  "wpm": 107.77
}, {
  "id": 910,
  "sv": "sprida",
  "en": "to spread",
  "t": "v",
  "es": "De sprider nyheten.",
  "ee": "They spread the news.",
  "lv": "A1",
  "wpm": 107.63
}, {
  "id": 911,
  "sv": "växt",
  "en": "plant",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Växten växer.",
  "ee": "The plant grows.",
  "ch": 12,
  "lv": "A1",
  "wpm": 107.37
}, {
  "id": 912,
  "sv": "förutom",
  "en": "besides",
  "t": "p",
  "es": "Alla kom förutom honom.",
  "ee": "Everyone came besides him.",
  "lv": "A1",
  "wpm": 106.41
}, {
  "id": 913,
  "sv": "i samband med",
  "en": "in connection with",
  "t": "p",
  "es": "Mötet sker i samband med konferensen.",
  "ee": "The meeting occurs in connection with the conference.",
  "lv": "A1",
  "wpm": 106.3
}, {
  "id": 914,
  "sv": "styck",
  "en": "piece",
  "t": "n",
  "es": "Han köper ett styck bröd.",
  "ee": "He buys a piece of bread.",
  "lv": "A1",
  "wpm": 106.25
}, {
  "id": 915,
  "sv": "utskott",
  "en": "committee",
  "t": "n",
  "g": "ett",
  "es": "Utskottet möts.",
  "ee": "The committee meets.",
  "lv": "A1",
  "wpm": 106.04
}, {
  "id": 916,
  "sv": "muslim",
  "en": "Muslim",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Han är muslim.",
  "ee": "He is Muslim.",
  "ch": 10,
  "lv": "A1",
  "wpm": 105.98
}, {
  "id": 917,
  "sv": "ordning",
  "en": "order",
  "t": "n",
  "g": "en",
  "es": "Det finns en ordning.",
  "ee": "There is an order.",
  "lv": "A1",
  "wpm": 105.89
}, {
  "id": 918,
  "sv": "uppdrag",
  "en": "assignment",
  "t": "n",
  "g": "ett",
  "es": "Han får ett uppdrag.",
  "ee": "He gets an assignment.",
  "lv": "A1",
  "wpm": 105.87
}, {
  "id": 919,
  "sv": "mark",
  "en": "ground",
  "t": "n",
  "g": "en",
  "es": "De går på marken.",
  "ee": "They walk on the ground.",
  "lv": "A1",
  "wpm": 105.63
}, {
  "id": 920,
  "sv": "säkerhet",
  "en": "safety",
  "t": "n",
  "g": "en",
  "es": "Säkerhet är viktigt.",
  "ee": "Security is important.",
  "lv": "A1",
  "wpm": 105.63
}, {
  "id": 921,
  "sv": "linje",
  "en": "line",
  "t": "n",
  "g": "en",
  "c": "(-n, -er, -erna)",
  "es": "Vi följer en linje.",
  "ee": "We follow a line.",
  "ch": 9,
  "lv": "A1",
  "wpm": 105.51
}, {
  "id": 922,
  "sv": "bank",
  "en": "bank",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Hon arbetar på en bank.",
  "ee": "She works at a bank.",
  "ch": 1,
  "lv": "A1",
  "wpm": 105.47
}, {
  "id": 923,
  "sv": "önska",
  "en": "to wish",
  "t": "v",
  "es": "Jag önskar lycka.",
  "ee": "I wish good luck.",
  "lv": "A1",
  "wpm": 105.47
}, {
  "id": 924,
  "sv": "givetvis",
  "en": "of course",
  "t": "a",
  "es": "Jag kommer givetvis.",
  "ee": "Of course I come.",
  "lv": "A1",
  "wpm": 105.17
}, {
  "id": 925,
  "sv": "studie",
  "en": "study",
  "t": "n",
  "g": "en",
  "es": "Studien publiceras.",
  "ee": "The study is published.",
  "lv": "A1",
  "wpm": 105.12
}, {
  "id": 926,
  "sv": "fredag",
  "en": "Friday",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "Vi ses på fredag.",
  "ee": "We meet on Friday.",
  "ch": 5,
  "lv": "A1",
  "wpm": 104.7
}, {
  "id": 927,
  "sv": "lärare",
  "en": "teacher",
  "t": "n",
  "g": "en",
  "c": "(-n, –, -lärarna)",
  "es": "Läraren förklarar.",
  "ee": "The teacher explains.",
  "ch": 1,
  "lv": "A1",
  "wpm": 104.69
}, {
  "id": 928,
  "sv": "statlig",
  "en": "state / governmental",
  "t": "a",
  "es": "Det är en statlig myndighet.",
  "ee": "It is a state authority.",
  "lv": "A1",
  "wpm": 104.45
}, {
  "id": 929,
  "sv": "söndag",
  "en": "Sunday",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "Vi ses på söndag.",
  "ee": "We meet on Sunday.",
  "ch": 5,
  "lv": "A1",
  "wpm": 104.44
}, {
  "id": 930,
  "sv": "fel",
  "en": "error",
  "t": "a",
  "c": "(-et, −, -en)",
  "es": "Det är ett fel.",
  "ee": "It is an error.",
  "ch": 10,
  "lv": "A1",
  "wpm": 104.42
}, {
  "id": 931,
  "sv": "speciellt",
  "en": "especially",
  "t": "a",
  "es": "Det är speciellt viktigt.",
  "ee": "It is especially important.",
  "lv": "A1",
  "wpm": 104.35
}, {
  "id": 932,
  "sv": "röd",
  "en": "red",
  "t": "a",
  "c": "(rött, -a)",
  "es": "Bilen är röd.",
  "ee": "The car is red.",
  "ch": 5,
  "lv": "A1",
  "wpm": 104.34
}, {
  "id": 933,
  "sv": "television (el. teve, tv)",
  "en": "television",
  "t": "n",
  "g": "en",
  "es": "Jag ser på television.",
  "ee": "I watch television.",
  "lv": "A1",
  "wpm": 104.3
}, {
  "id": 934,
  "sv": "hot",
  "en": "threat",
  "t": "n",
  "g": "ett",
  "es": "Det finns ett hot.",
  "ee": "There is a threat.",
  "lv": "A1",
  "wpm": 104.27
}, {
  "id": 935,
  "sv": "verk",
  "en": "work",
  "t": "n",
  "g": "ett",
  "es": "Han skriver ett verk.",
  "ee": "He writes a work.",
  "lv": "A1",
  "wpm": 104.0
}, {
  "id": 936,
  "sv": "publicera",
  "en": "to publish",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Hon publicerar artikeln.",
  "ee": "She publishes the article.",
  "ch": 20,
  "lv": "A1",
  "wpm": 103.98
}, {
  "id": 937,
  "sv": "stund",
  "en": "moment",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Vänta en stund.",
  "ee": "Wait a moment.",
  "ch": 3,
  "lv": "A1",
  "wpm": 103.98
}, {
  "id": 938,
  "sv": "tillhöra",
  "en": "to belong",
  "t": "v",
  "es": "Han tillhör gruppen.",
  "ee": "He belongs to the group.",
  "lv": "A1",
  "wpm": 103.16
}, {
  "id": 939,
  "sv": "omfatta",
  "en": "to include",
  "t": "v",
  "es": "Projektet omfattar många ämnen.",
  "ee": "The project includes many subjects.",
  "lv": "A1",
  "wpm": 103.14
}, {
  "id": 940,
  "sv": "material",
  "en": "material",
  "t": "n",
  "g": "ett",
  "es": "Materialet är starkt.",
  "ee": "The material is strong.",
  "lv": "A1",
  "wpm": 102.94
}, {
  "id": 941,
  "sv": "pelare",
  "en": "pillar",
  "t": "n",
  "g": "en",
  "es": "Byggnaden har en pelare.",
  "ee": "The building has a pillar.",
  "lv": "A1",
  "wpm": 102.91
}, {
  "id": 942,
  "sv": "hjärta",
  "en": "heart",
  "t": "n",
  "g": "ett",
  "c": "(-t, -n, -na)",
  "es": "Hjärtat slår.",
  "ee": "The heart beats.",
  "ch": 14,
  "lv": "A1",
  "wpm": 102.88
}, {
  "id": 943,
  "sv": "knappast",
  "en": "hardly",
  "t": "a",
  "es": "Han kommer knappast.",
  "ee": "He hardly comes.",
  "lv": "A1",
  "wpm": 102.76
}, {
  "id": 944,
  "sv": "befinna",
  "en": "to be located",
  "t": "v",
  "es": "Han befinner sig här.",
  "ee": "He is located here.",
  "lv": "A1",
  "wpm": 102.66
}, {
  "id": 945,
  "sv": "part",
  "en": "party",
  "t": "n",
  "g": "en",
  "es": "De två parterna möts.",
  "ee": "The two parties meet.",
  "lv": "A1",
  "wpm": 102.65
}, {
  "id": 946,
  "sv": "trevlig",
  "en": "nice",
  "t": "a",
  "c": "(-t, -a)",
  "es": "H an är trevlig.",
  "ee": "He is nice.",
  "ch": 2,
  "lv": "A1",
  "wpm": 102.64
}, {
  "id": 947,
  "sv": "höst",
  "en": "autumn",
  "t": "n",
  "g": "en",
  "es": "Hösten är kall.",
  "ee": "Autumn is cold.",
  "lv": "A1",
  "wpm": 102.61
}, {
  "id": 948,
  "sv": "skilja",
  "en": "to separate",
  "t": "v",
  "c": "(-er, skilde, skilt)",
  "es": "De skiljer sig.",
  "ee": "They separate.",
  "ch": 1,
  "lv": "A1",
  "wpm": 102.57
}, {
  "id": 949,
  "sv": "ens",
  "en": "even",
  "t": "a",
  "es": "Inte ens jag vet.",
  "ee": "Not even I know.",
  "lv": "A1",
  "wpm": 102.09
}, {
  "id": 950,
  "sv": "förmåga",
  "en": "ability",
  "t": "n",
  "g": "en",
  "es": "Hon har en stor förmåga.",
  "ee": "She has a great ability.",
  "lv": "A1",
  "wpm": 102.02
}, {
  "id": 951,
  "sv": "döda",
  "en": "to kill",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Hunden dödar inte.",
  "ee": "The dog does not kill.",
  "ch": 12,
  "lv": "A1",
  "wpm": 101.92
}, {
  "id": 952,
  "sv": "stånd",
  "en": "stand / position",
  "t": "n",
  "g": "ett",
  "es": "Han tar ett stånd.",
  "ee": "He takes a stand.",
  "lv": "A1",
  "wpm": 101.76
}, {
  "id": 953,
  "sv": "peka",
  "en": "to point",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Han pekar på huset.",
  "ee": "He points at the house.",
  "ch": 19,
  "lv": "A1",
  "wpm": 101.73
}, {
  "id": 954,
  "sv": "bedömning",
  "en": "assessment",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "Vi gör en bedömning.",
  "ee": "We make an assessment.",
  "ch": 16,
  "lv": "A1",
  "wpm": 101.49
}, {
  "id": 955,
  "sv": "ringa",
  "en": "to call",
  "t": "v",
  "es": "Jag ringer dig.",
  "ee": "I call you.",
  "lv": "A1",
  "wpm": 101.34
}, {
  "id": 956,
  "sv": "betrakta",
  "en": "to regard",
  "t": "v",
  "es": "Han betraktar bilden.",
  "ee": "He regards the picture.",
  "lv": "A1",
  "wpm": 101.05
}, {
  "id": 957,
  "sv": "by",
  "en": "village",
  "t": "n",
  "g": "en",
  "es": "De bor i en by.",
  "ee": "They live in a village.",
  "lv": "A1",
  "wpm": 100.93
}, {
  "id": 958,
  "sv": "utifrån",
  "en": "from outside",
  "t": "p",
  "es": "Han ser det utifrån.",
  "ee": "He sees it from outside.",
  "lv": "A1",
  "wpm": 100.69
}, {
  "id": 959,
  "sv": "brist",
  "en": "lack",
  "t": "n",
  "g": "en",
  "es": "Det finns en brist.",
  "ee": "There is a lack.",
  "lv": "A1",
  "wpm": 100.59
}, {
  "id": 960,
  "sv": "hänga",
  "en": "to hang",
  "t": "v",
  "c": "(-er, -de, -t)",
  "es": "Jackan hänger där.",
  "ee": "The jacket hangs there.",
  "ch": 5,
  "lv": "A1",
  "wpm": 100.43
}, {
  "id": 961,
  "sv": "tillräckligt",
  "en": "enough",
  "t": "a",
  "es": "Det är tillräckligt.",
  "ee": "It is enough.",
  "lv": "A1",
  "wpm": 100.4
}, {
  "id": 962,
  "sv": "måndag",
  "en": "Monday",
  "t": "n",
  "g": "en",
  "es": "Vi ses på måndag.",
  "ee": "We meet on Monday.",
  "lv": "A1",
  "wpm": 100.12
}, {
  "id": 963,
  "sv": "aktuell",
  "en": "current",
  "t": "a",
  "es": "Det är en aktuell fråga.",
  "ee": "It is a current issue.",
  "lv": "A1",
  "wpm": 99.75
}, {
  "id": 964,
  "sv": "någonsin (vardagl. nånsin)",
  "en": "ever",
  "t": "a",
  "es": "Har du någonsin varit där?",
  "ee": "Have you ever been there?",
  "lv": "A1",
  "wpm": 99.71
}, {
  "id": 965,
  "sv": "tillåta",
  "en": "to allow",
  "t": "v",
  "es": "De tillåter det.",
  "ee": "They allow it.",
  "lv": "A1",
  "wpm": 99.66
}, {
  "id": 966,
  "sv": "universitet",
  "en": "university",
  "t": "n",
  "g": "ett",
  "c": "(-et, –, -en)",
  "es": "Hon studerar vid universitetet.",
  "ee": "She studies at the university.",
  "ch": 1,
  "lv": "A1",
  "wpm": 99.16
}, {
  "id": 967,
  "sv": "konsekvens",
  "en": "consequence",
  "t": "n",
  "g": "en",
  "es": "Konsekvensen diskuteras.",
  "ee": "The consequence is discussed.",
  "lv": "A1",
  "wpm": 99.15
}, {
  "id": 968,
  "sv": "ställe",
  "en": "place",
  "t": "n",
  "g": "ett",
  "c": "(-t, -n, -na)",
  "es": "Det är ett bra ställe.",
  "ee": "It is a good place.",
  "ch": 14,
  "lv": "A1",
  "wpm": 98.93
}, {
  "id": 969,
  "sv": "hård",
  "en": "hard",
  "t": "a",
  "c": "(hårt, -a)",
  "es": "Stenen är hård.",
  "ee": "The stone is hard.",
  "ch": 7,
  "lv": "A1",
  "wpm": 98.66
}, {
  "id": 970,
  "sv": "majoritet",
  "en": "majority",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Majoriteten röstar ja.",
  "ee": "The majority votes yes.",
  "ch": 18,
  "lv": "A1",
  "wpm": 98.59
}, {
  "id": 971,
  "sv": "domstol",
  "en": "court",
  "t": "n",
  "g": "en",
  "es": "Domstolen beslutar.",
  "ee": "The court decides.",
  "lv": "A1",
  "wpm": 98.49
}, {
  "id": 972,
  "sv": "ordförande",
  "en": "chairperson",
  "t": "n",
  "g": "en",
  "es": "Ordföranden talar.",
  "ee": "The chairperson speaks.",
  "lv": "A1",
  "wpm": 98.46
}, {
  "id": 973,
  "sv": "lördag",
  "en": "Saturday",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "Vi ses på lördag.",
  "ee": "We meet on Saturday.",
  "ch": 5,
  "lv": "A1",
  "wpm": 98.43
}, {
  "id": 974,
  "sv": "låt",
  "en": "song",
  "t": "n",
  "g": "en",
  "es": "Jag lyssnar på en låt.",
  "ee": "I listen to a song.",
  "lv": "A1",
  "wpm": 98.35
}, {
  "id": 975,
  "sv": "herr",
  "en": "mister",
  "t": "n",
  "es": "Herr Andersson talar.",
  "ee": "Mr Andersson speaks.",
  "lv": "A1",
  "wpm": 98.28
}, {
  "id": 976,
  "sv": "sekvens",
  "en": "sequence",
  "t": "n",
  "g": "en",
  "es": "Filmen har en sekvens.",
  "ee": "The film has a sequence.",
  "lv": "A1",
  "wpm": 98.23
}, {
  "id": 977,
  "sv": "förekomma",
  "en": "to occur",
  "t": "v",
  "es": "Problemet förekommer ofta.",
  "ee": "The problem occurs often.",
  "lv": "A1",
  "wpm": 98.18
}, {
  "id": 978,
  "sv": "stoppa",
  "en": "to stop",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Polisen stoppar bilen.",
  "ee": "The police stop the car.",
  "ch": 11,
  "lv": "A1",
  "wpm": 98.15
}, {
  "id": 979,
  "sv": "nyhet",
  "en": "news",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Jag läser en nyhet.",
  "ee": "I read a news story.",
  "ch": 18,
  "lv": "A1",
  "wpm": 97.8
}, {
  "id": 980,
  "sv": "journalist",
  "en": "journalist",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Journalisten skriver.",
  "ee": "The journalist writes.",
  "ch": 2,
  "lv": "A1",
  "wpm": 97.73
}, {
  "id": 981,
  "sv": "kris",
  "en": "crisis",
  "t": "n",
  "g": "en",
  "es": "Det är en kris.",
  "ee": "It is a crisis.",
  "lv": "A1",
  "wpm": 97.59
}, {
  "id": 982,
  "sv": "rycka",
  "en": "to pull",
  "t": "v",
  "es": "H an rycker i dörren.",
  "ee": "He pulls the door.",
  "lv": "A1",
  "wpm": 97.44
}, {
  "id": 983,
  "sv": "trycka",
  "en": "to press",
  "t": "v",
  "c": "(-er, -te, -t)",
  "es": "Han trycker på knappen.",
  "ee": "He presses the button.",
  "ch": 18,
  "lv": "A1",
  "wpm": 97.44
}, {
  "id": 984,
  "sv": "betydligt",
  "en": "considerably",
  "t": "a",
  "es": "Det är betydligt bättre.",
  "ee": "It is considerably better.",
  "lv": "A1",
  "wpm": 97.4
}, {
  "id": 985,
  "sv": "kosta",
  "en": "to cost",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Boken kostar mycket.",
  "ee": "The book costs much.",
  "ch": 4,
  "lv": "A1",
  "wpm": 97.1
}, {
  "id": 986,
  "sv": "band",
  "en": "band",
  "t": "n",
  "g": "ett",
  "es": "De spelar i ett band.",
  "ee": "They play in a band.",
  "lv": "A1",
  "wpm": 97.09
}, {
  "id": 987,
  "sv": "numera (el. numer)",
  "en": "nowadays",
  "t": "a",
  "es": "Numera arbetar jag hemma.",
  "ee": "Nowadays I work at home.",
  "lv": "A1",
  "wpm": 97.08
}, {
  "id": 988,
  "sv": "tillstånd",
  "en": "permit",
  "t": "n",
  "g": "ett",
  "es": "Han får ett tillstånd.",
  "ee": "He receives a permit.",
  "lv": "A1",
  "wpm": 97.07
}, {
  "id": 989,
  "sv": "värd",
  "en": "host",
  "t": "a",
  "lv": "A1",
  "wpm": 97.06
}, {
  "id": 990,
  "sv": "igen",
  "en": "again",
  "t": "p",
  "es": "Vi ses igen.",
  "ee": "We meet again.",
  "ch": 1,
  "lv": "A1",
  "wpm": 96.98
}, {
  "id": 991,
  "sv": "imorgon (el. i morgon)",
  "en": "tomorrow",
  "t": "a",
  "es": "Vi ses imorgon.",
  "ee": "We meet tomorrow.",
  "lv": "A1",
  "wpm": 96.53
}, {
  "id": 992,
  "sv": "klass",
  "en": "class",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Hon går i en klass.",
  "ee": "She attends a class.",
  "ch": 1,
  "lv": "A1",
  "wpm": 96.49
}, {
  "id": 993,
  "sv": "uttrycka",
  "en": "to express",
  "t": "v",
  "es": "Han uttrycker sin åsikt.",
  "ee": "He expresses his opinion.",
  "lv": "A1",
  "wpm": 96.1
}, {
  "id": 994,
  "sv": "slutsats",
  "en": "conclusion",
  "t": "n",
  "g": "en",
  "es": "Vi drar en slutsats.",
  "ee": "We draw a conclusion.",
  "lv": "A1",
  "wpm": 95.99
}, {
  "id": 995,
  "sv": "global",
  "en": "global",
  "t": "a",
  "es": "Det är ett globalt problem.",
  "ee": "It is a global problem.",
  "lv": "A1",
  "wpm": 95.78
}, {
  "id": 996,
  "sv": "mitt",
  "en": "my / mine",
  "t": "a",
  "es": "Det är mitt hus.",
  "ee": "It is my house.",
  "lv": "A1",
  "wpm": 95.61
}, {
  "id": 997,
  "sv": "stol",
  "en": "chair",
  "t": "n",
  "g": "en",
  "es": "Han sitter på stolen.",
  "ee": "He sits on the chair.",
  "lv": "A1",
  "wpm": 95.52
}, {
  "id": 998,
  "sv": "ytterligare",
  "en": "additional",
  "t": "a",
  "es": "Vi behöver ytterligare hjälp.",
  "ee": "We need additional help.",
  "lv": "A1",
  "wpm": 95.35
}, {
  "id": 999,
  "sv": "effektiv",
  "en": "efficient",
  "t": "a",
  "es": "Metoden är effektiv.",
  "ee": "The method is efficient.",
  "lv": "A1",
  "wpm": 95.24
}, {
  "id": 1000,
  "sv": "resa",
  "en": "to travel",
  "t": "v",
  "c": "(-er, -te, -t)",
  "ch": 6,
  "lv": "A1",
  "wpm": 95.16,
  "es": "Jag reser till Spanien.",
  "ee": "I travel to Spain."
}, {
  "id": 1001,
  "sv": "förbättra",
  "en": "to improve",
  "t": "v",
  "es": "De förbättrar systemet.",
  "ee": "They improve the system.",
  "lv": "A1",
  "wpm": 95.1
}, {
  "id": 1002,
  "sv": "rädda",
  "en": "to save",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Brandmännen räddar huset.",
  "ee": "The firefighters save the house.",
  "ch": 20,
  "lv": "A1",
  "wpm": 95.09
}, {
  "id": 1003,
  "sv": "list",
  "en": "list",
  "t": "n",
  "g": "en",
  "es": "Han använder en list.",
  "ee": "He uses a trick.",
  "lv": "A1",
  "wpm": 94.89
}, {
  "id": 1004,
  "sv": "relation",
  "en": "relationship",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "De har en nära relation.",
  "ee": "They have a close relationship.",
  "ch": 6,
  "lv": "A1",
  "wpm": 94.81
}, {
  "id": 1005,
  "sv": "agera",
  "en": "to act",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Regeringen agerar snabbt.",
  "ee": "The government acts quickly.",
  "ch": 19,
  "lv": "A1",
  "wpm": 94.6
}, {
  "id": 1006,
  "sv": "central",
  "en": "central",
  "t": "a",
  "es": "Det är en central fråga.",
  "ee": "It is a central issue.",
  "lv": "A1",
  "wpm": 94.56
}, {
  "id": 1007,
  "sv": "flera",
  "en": "several",
  "t": "p",
  "es": "Flera personer kommer.",
  "ee": "Several people arrive.",
  "ch": 4,
  "lv": "A1",
  "wpm": 94.49
}, {
  "id": 1008,
  "sv": "undersökning",
  "en": "investigation",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "De gör en undersökning.",
  "ee": "They conduct an investigation.",
  "ch": 12,
  "lv": "A1",
  "wpm": 94.27
}, {
  "id": 1009,
  "sv": "uppnå",
  "en": "to achieve",
  "t": "v",
  "es": "Hon uppnår målet.",
  "ee": "She achieves the goal.",
  "lv": "A1",
  "wpm": 94.18
}, {
  "id": 1010,
  "sv": "krona (förk. kr.)",
  "en": "krona (Swedish currency)",
  "t": "n",
  "g": "en",
  "es": "Boken kostar hundra kronor.",
  "ee": "The book costs one hundred kronor.",
  "lv": "A1",
  "wpm": 94.15
}, {
  "id": 1011,
  "sv": "perspektiv",
  "en": "perspective",
  "t": "n",
  "g": "ett",
  "es": "Vi ser saken från ett nytt perspektiv.",
  "ee": "We see the issue from a new perspective.",
  "lv": "A1",
  "wpm": 94.04
}, {
  "id": 1012,
  "sv": "plötsligt",
  "en": "suddenly",
  "t": "a",
  "es": "Plötsligt börjar det regna.",
  "ee": "Suddenly it starts to rain.",
  "lv": "A1",
  "wpm": 93.95
}, {
  "id": 1013,
  "sv": "naturlig",
  "en": "natural",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Det är en naturlig process.",
  "ee": "It is a natural process.",
  "ch": 13,
  "lv": "A1",
  "wpm": 93.87
}, {
  "id": 1014,
  "sv": "ålder",
  "en": "age",
  "t": "n",
  "g": "en",
  "es": "Han når hög ålder.",
  "ee": "He reaches an old age.",
  "lv": "A1",
  "wpm": 93.87
}, {
  "id": 1015,
  "sv": "process",
  "en": "process",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Projektet är en lång process.",
  "ee": "The project is a long process.",
  "ch": 16,
  "lv": "A1",
  "wpm": 93.76
}, {
  "id": 1016,
  "sv": "uttryck",
  "en": "expression",
  "t": "n",
  "g": "ett",
  "es": "Uttrycket används ofta.",
  "ee": "The expression is used often.",
  "lv": "A1",
  "wpm": 93.7
}, {
  "id": 1017,
  "sv": "lista",
  "en": "list",
  "t": "n",
  "g": "en",
  "es": "Jag gör en lista.",
  "ee": "I make a list.",
  "lv": "A1",
  "wpm": 93.66
}, {
  "id": 1018,
  "sv": "allra",
  "en": "very / most",
  "t": "a",
  "es": "Det är allra bäst.",
  "ee": "It is the very best.",
  "lv": "A1",
  "wpm": 93.57
}, {
  "id": 1019,
  "sv": "sökning",
  "en": "search",
  "t": "n",
  "g": "en",
  "es": "Han gör en sökning.",
  "ee": "He performs a search.",
  "lv": "A1",
  "wpm": 93.56
}, {
  "id": 1020,
  "sv": "ökning",
  "en": "increase",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "Priset visar en ökning.",
  "ee": "The price shows an increase.",
  "ch": 14,
  "lv": "A1",
  "wpm": 93.56
}, {
  "id": 1021,
  "sv": "därför att",
  "en": "because",
  "t": "s",
  "es": "Jag stannar därför att jag är trött.",
  "ee": "I stay because I am tired.",
  "lv": "A1",
  "wpm": 93.55
}, {
  "id": 1022,
  "sv": "rysk",
  "en": "Russian",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Han är rysk.",
  "ee": "He is Russian.",
  "ch": 12,
  "lv": "A1",
  "wpm": 93.55
}, {
  "id": 1023,
  "sv": "jämföra (förk. jfr)",
  "en": "to compare",
  "t": "v",
  "es": "Vi jämför resultaten.",
  "ee": "We compare the results.",
  "lv": "A1",
  "wpm": 93.52
}, {
  "id": 1024,
  "sv": "tills",
  "en": "until",
  "t": "s",
  "es": "Vi väntar tills imorgon.",
  "ee": "We wait until tomorrow.",
  "lv": "A1",
  "wpm": 93.48
}, {
  "id": 1025,
  "sv": "intresserad",
  "en": "interested",
  "t": "a",
  "c": "(intresserat, intresserade)",
  "es": "Jag är intresserad.",
  "ee": "I am interested.",
  "ch": 2,
  "lv": "A1",
  "wpm": 93.21
}, {
  "id": 1026,
  "sv": "totalt",
  "en": "total",
  "t": "a",
  "es": "Det är totalt tio personer.",
  "ee": "There are ten people in total.",
  "lv": "A1",
  "wpm": 92.97
}, {
  "id": 1027,
  "sv": "hantera",
  "en": "to handle",
  "t": "v",
  "es": "De hanterar problemet.",
  "ee": "They handle the problem.",
  "lv": "A1",
  "wpm": 92.87
}, {
  "id": 1028,
  "sv": "förvänta",
  "en": "to expect",
  "t": "v",
  "es": "Jag förväntar mig hjälp.",
  "ee": "I expect help.",
  "lv": "A1",
  "wpm": 92.79
}, {
  "id": 1029,
  "sv": "medel",
  "en": "means / method",
  "t": "n",
  "g": "ett",
  "es": "Det är ett viktigt medel.",
  "ee": "It is an important means.",
  "lv": "A1",
  "wpm": 92.73
}, {
  "id": 1030,
  "sv": "vika",
  "en": "to fold",
  "t": "v",
  "lv": "A1",
  "wpm": 92.39
}, {
  "id": 1031,
  "sv": "döma",
  "en": "to judge",
  "t": "v",
  "lv": "A1",
  "wpm": 92.38
}, {
  "id": 1032,
  "sv": "besöka",
  "en": "to visit",
  "t": "v",
  "c": "(-er, -te, -t)",
  "es": "Vi besöker museet.",
  "ee": "We visit the museum.",
  "ch": 6,
  "lv": "A1",
  "wpm": 92.36
}, {
  "id": 1033,
  "sv": "hem",
  "en": "home",
  "t": "n",
  "g": "ett",
  "es": "Huset är ett hem.",
  "ee": "The house is a home.",
  "lv": "A1",
  "wpm": 92.26
}, {
  "id": 1034,
  "sv": "var",
  "en": "was",
  "t": "v",
  "es": "Han var glad igår.",
  "ee": "He was happy yesterday.",
  "lv": "A1",
  "wpm": 92.16
}, {
  "id": 1035,
  "sv": "täcka",
  "en": "to cover",
  "t": "v",
  "es": "Snön täcker marken.",
  "ee": "Snow covers the ground.",
  "lv": "A1",
  "wpm": 92.1
}, {
  "id": 1036,
  "sv": "borgerlig",
  "en": "bourgeois / civic",
  "t": "a",
  "es": "Det är en borgerlig regering.",
  "ee": "It is a bourgeois government.",
  "lv": "A1",
  "wpm": 92.09
}, {
  "id": 1037,
  "sv": "inleda",
  "en": "to begin",
  "t": "v",
  "es": "De inleder mötet.",
  "ee": "They begin the meeting.",
  "lv": "A1",
  "wpm": 92.09
}, {
  "id": 1038,
  "sv": "helg",
  "en": "weekend",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Vi ses i helgen.",
  "ee": "We meet this weekend.",
  "ch": 5,
  "lv": "A1",
  "wpm": 92.06
}, {
  "id": 1039,
  "sv": "undvika",
  "en": "to avoid",
  "t": "v",
  "es": "Vi undviker problemet.",
  "ee": "We avoid the problem.",
  "lv": "A1",
  "wpm": 92.02
}, {
  "id": 1040,
  "sv": "ryck",
  "en": "jerk",
  "t": "n",
  "g": "ett",
  "es": "Han gör ett ryck.",
  "ee": "He makes a jerk.",
  "lv": "A1",
  "wpm": 91.76
}, {
  "id": 1041,
  "sv": "tryck",
  "en": "pressure",
  "t": "n",
  "g": "ett",
  "es": "Maskinen ger ett tryck.",
  "ee": "The machine creates pressure.",
  "lv": "A1",
  "wpm": 91.76
}, {
  "id": 1042,
  "sv": "tydligen",
  "en": "apparently",
  "t": "a",
  "es": "Han kommer tydligen.",
  "ee": "Apparently he comes.",
  "lv": "A1",
  "wpm": 91.69
}, {
  "id": 1043,
  "sv": "aktiv",
  "en": "active",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Hon är aktiv.",
  "ee": "She is active.",
  "ch": 3,
  "lv": "A1",
  "wpm": 91.62
}, {
  "id": 1044,
  "sv": "höja",
  "en": "to raise",
  "t": "v",
  "c": "(-er, -de, -t)",
  "ch": 20,
  "lv": "A1",
  "wpm": 91.58
}, {
  "id": 1045,
  "sv": "pappa",
  "en": "dad",
  "t": "n",
  "g": "en",
  "c": "(-an, -or, -orna)",
  "es": "Min pappa arbetar.",
  "ee": "My dad works.",
  "ch": 2,
  "lv": "A1",
  "wpm": 91.48
}, {
  "id": 1046,
  "sv": "varken…eller",
  "en": "neither…nor",
  "t": "c",
  "es": "Han vill varken äta eller dricka.",
  "ee": "He wants neither to eat nor drink.",
  "lv": "A1",
  "wpm": 91.32
}, {
  "id": 1047,
  "sv": "religiös",
  "en": "religious",
  "t": "a",
  "es": "Han är religiös.",
  "ee": "He is religious.",
  "lv": "A1",
  "wpm": 91.15
}, {
  "id": 1048,
  "sv": "råka",
  "en": "to happen to",
  "t": "v",
  "es": "Jag råkar se honom.",
  "ee": "I happen to see him.",
  "lv": "A1",
  "wpm": 91.0
}, {
  "id": 1049,
  "sv": "verklig",
  "en": "real",
  "t": "a",
  "es": "Det är en verklig historia.",
  "ee": "It is a real story.",
  "lv": "A1",
  "wpm": 90.87
}, {
  "id": 1050,
  "sv": "rent",
  "en": "cleanly / purely",
  "t": "a",
  "es": "Vattnet är rent.",
  "ee": "The water is clean.",
  "lv": "A1",
  "wpm": 90.85
}, {
  "id": 1051,
  "sv": "fantastisk",
  "en": "fantastic",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Filmen är fantastisk.",
  "ee": "The film is fantastic.",
  "ch": 5,
  "lv": "A1",
  "wpm": 90.78
}, {
  "id": 1052,
  "sv": "grundläggande",
  "en": "essential",
  "t": "a",
  "es": "Det är grundläggande kunskap.",
  "ee": "It is fundamental knowledge.",
  "lv": "A1",
  "wpm": 90.73
}, {
  "id": 1053,
  "sv": "upptäcka",
  "en": "to discover",
  "t": "v",
  "es": "De upptäcker något nytt.",
  "ee": "They discover something new.",
  "lv": "A1",
  "wpm": 90.72
}, {
  "id": 1054,
  "sv": "erkänna",
  "en": "to admit",
  "t": "v",
  "es": "Han erkänner felet.",
  "ee": "He admits the mistake.",
  "lv": "A1",
  "wpm": 90.67
}, {
  "id": 1055,
  "sv": "helig",
  "en": "holy",
  "t": "a",
  "es": "Det är en helig plats.",
  "ee": "It is a holy place.",
  "lv": "A1",
  "wpm": 90.59
}, {
  "id": 1056,
  "sv": "lön",
  "en": "salary",
  "t": "n",
  "g": "en",
  "es": "Hon får en hög lön.",
  "ee": "She receives a high salary.",
  "lv": "A1",
  "wpm": 90.42
}, {
  "id": 1057,
  "sv": "historisk",
  "en": "historical",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Det är ett historiskt beslut.",
  "ee": "It is a historical decision.",
  "ch": 5,
  "lv": "A1",
  "wpm": 90.34
}, {
  "id": 1058,
  "sv": "rest",
  "en": "remnant",
  "t": "n",
  "g": "en",
  "es": "En rest finns kvar.",
  "ee": "A remnant remains.",
  "lv": "A1",
  "wpm": 90.27
}, {
  "id": 1059,
  "sv": "halv",
  "en": "half",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Han äter en halv pizza.",
  "ee": "He eats half a pizza.",
  "ch": 3,
  "lv": "A1",
  "wpm": 90.13
}, {
  "id": 1060,
  "sv": "andel",
  "en": "share",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "Hon äger en andel.",
  "ee": "She owns a share.",
  "ch": 18,
  "lv": "A1",
  "wpm": 90.06
}, {
  "id": 1061,
  "sv": "besök",
  "en": "visit",
  "t": "n",
  "g": "ett",
  "es": "Vi gör ett besök.",
  "ee": "We make a visit.",
  "lv": "A1",
  "wpm": 90.06
}, {
  "id": 1062,
  "sv": "teknisk",
  "en": "technical",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Det är en teknisk lösning.",
  "ee": "It is a technical solution.",
  "ch": 13,
  "lv": "A1",
  "wpm": 90.04
}, {
  "id": 1063,
  "sv": "kasta",
  "en": "to throw",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Han kastar bollen.",
  "ee": "He throws the ball.",
  "ch": 3,
  "lv": "A1",
  "wpm": 89.78
}, {
  "id": 1064,
  "sv": "hemsida",
  "en": "website",
  "t": "n",
  "g": "en",
  "es": "Hon öppnar en hemsida.",
  "ee": "She opens a website.",
  "lv": "A1",
  "wpm": 89.75
}, {
  "id": 1065,
  "sv": "bedöma",
  "en": "to assess",
  "t": "v",
  "es": "De bedömer resultatet.",
  "ee": "They assess the result.",
  "lv": "A1",
  "wpm": 89.72
}, {
  "id": 1066,
  "sv": "torsdag",
  "en": "Thursday",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar- arna)",
  "es": "Vi ses på torsdag.",
  "ee": "We meet on Thursday.",
  "ch": 5,
  "lv": "A1",
  "wpm": 89.68
}, {
  "id": 1067,
  "sv": "tillväxt",
  "en": "growth",
  "t": "n",
  "g": "en",
  "es": "Företaget visar tillväxt.",
  "ee": "The company shows growth.",
  "lv": "A1",
  "wpm": 89.64
}, {
  "id": 1068,
  "sv": "läsare",
  "en": "reader",
  "t": "n",
  "g": "en",
  "c": "(-n, −, läsarna)",
  "es": "Läsaren förstår.",
  "ee": "The reader understands.",
  "ch": 14,
  "lv": "A1",
  "wpm": 89.59
}, {
  "id": 1069,
  "sv": "forskare",
  "en": "researcher",
  "t": "n",
  "g": "en",
  "c": "(-n, −, -na)",
  "es": "Forskaren arbetar.",
  "ee": "The researcher works.",
  "ch": 6,
  "lv": "A1",
  "wpm": 89.52
}, {
  "id": 1070,
  "sv": "bidrag",
  "en": "contribution",
  "t": "n",
  "g": "ett",
  "es": "Han ger ett bidrag.",
  "ee": "He gives a contribution.",
  "lv": "A1",
  "wpm": 89.28
}, {
  "id": 1071,
  "sv": "onsdag",
  "en": "Wednesday",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "Vi ses på onsdag.",
  "ee": "We meet on Wednesday.",
  "ch": 5,
  "lv": "A1",
  "wpm": 89.16
}, {
  "id": 1072,
  "sv": "vilja",
  "en": "will / willpower",
  "t": "n",
  "g": "en",
  "c": "(vill, ville, velat)",
  "es": "Hon har stark vilja.",
  "ee": "She has a strong will.",
  "ch": 4,
  "lv": "A1",
  "wpm": 89.16
}, {
  "id": 1073,
  "sv": "sol",
  "en": "sun",
  "t": "n",
  "g": "en",
  "c": "(-en)",
  "es": "Solen skiner.",
  "ee": "The sun shines.",
  "ch": 2,
  "lv": "A1",
  "wpm": 89.1
}, {
  "id": 1074,
  "sv": "inte minst",
  "en": "not least",
  "t": "a",
  "es": "Problemet är viktigt inte minst här.",
  "ee": "The problem is important not least here.",
  "lv": "A1",
  "wpm": 89.08
}, {
  "id": 1075,
  "sv": "analys",
  "en": "analysis",
  "t": "n",
  "g": "en",
  "es": "Analysen visar resultat.",
  "ee": "The analysis shows results.",
  "lv": "A1",
  "wpm": 88.93
}, {
  "id": 1076,
  "sv": "ovan",
  "en": "above",
  "t": "a",
  "es": "Texten står ovan.",
  "ee": "The text stands above.",
  "lv": "A1",
  "wpm": 88.85
}, {
  "id": 1077,
  "sv": "lagstiftning",
  "en": "legislation",
  "t": "n",
  "g": "en",
  "es": "Ny lagstiftning införs.",
  "ee": "New legislation is introduced.",
  "lv": "A1",
  "wpm": 88.83
}, {
  "id": 1078,
  "sv": "militär",
  "en": "military",
  "t": "a",
  "es": "Det är en militär bas.",
  "ee": "It is a military base.",
  "lv": "A1",
  "wpm": 88.82
}, {
  "id": 1079,
  "sv": "toppa",
  "en": "to top",
  "t": "v",
  "es": "Hon toppar listan.",
  "ee": "She tops the list.",
  "lv": "A1",
  "wpm": 88.72
}, {
  "id": 1080,
  "sv": "sort",
  "en": "kind",
  "t": "n",
  "g": "en",
  "es": "Det finns en sort.",
  "ee": "There is a kind.",
  "lv": "A1",
  "wpm": 88.57
}, {
  "id": 1081,
  "sv": "fördel",
  "en": "advantage",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "Det är en stor fördel.",
  "ee": "It is a big advantage.",
  "ch": 17,
  "lv": "A1",
  "wpm": 88.33
}, {
  "id": 1082,
  "sv": "skydda",
  "en": "to protect",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "De skyddar naturen.",
  "ee": "They protect nature.",
  "ch": 15,
  "lv": "A1",
  "wpm": 88.3
}, {
  "id": 1083,
  "sv": "nyttja",
  "en": "to use",
  "t": "v",
  "es": "Vi nyttjar resurser.",
  "ee": "We use resources.",
  "lv": "A1",
  "wpm": 88.29
}, {
  "id": 1084,
  "sv": "utnyttja",
  "en": "to exploit",
  "t": "v",
  "es": "De utnyttjar möjligheten.",
  "ee": "They exploit the opportunity.",
  "lv": "A1",
  "wpm": 88.29
}, {
  "id": 1085,
  "sv": "teori",
  "en": "theory",
  "t": "n",
  "g": "en",
  "es": "Teorin diskuteras.",
  "ee": "The theory is discussed.",
  "lv": "A1",
  "wpm": 88.16
}, {
  "id": 1086,
  "sv": "fransk",
  "en": "French",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Hon är fransk.",
  "ee": "She is French.",
  "ch": 5,
  "lv": "A1",
  "wpm": 88.02
}, {
  "id": 1087,
  "sv": "pågå",
  "en": "to continue",
  "t": "v",
  "c": "(-r, pågick, pågått)",
  "es": "Mötet pågår.",
  "ee": "The meeting continues.",
  "ch": 20,
  "lv": "A1",
  "wpm": 87.99
}, {
  "id": 1088,
  "sv": "samling",
  "en": "collection",
  "t": "n",
  "g": "en",
  "es": "Hon har en samling.",
  "ee": "She has a collection.",
  "lv": "A1",
  "wpm": 87.94
}, {
  "id": 1089,
  "sv": "flertal",
  "en": "several",
  "t": "n",
  "g": "ett",
  "es": "Ett flertal personer kommer.",
  "ee": "Several people arrive.",
  "lv": "A1",
  "wpm": 87.89
}, {
  "id": 1090,
  "sv": "snarare",
  "en": "rather",
  "t": "a",
  "es": "Det är snarare ett problem.",
  "ee": "It is rather a problem.",
  "lv": "A1",
  "wpm": 87.88
}, {
  "id": 1091,
  "sv": "försvara",
  "en": "to defend",
  "t": "v",
  "es": "Han försvarar laget.",
  "ee": "He defends the team.",
  "lv": "A1",
  "wpm": 87.72
}, {
  "id": 1092,
  "sv": "modell",
  "en": "model",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "De bygger en modell.",
  "ee": "They build a model.",
  "ch": 13,
  "lv": "A1",
  "wpm": 87.56
}, {
  "id": 1093,
  "sv": "skön",
  "en": "beautiful / pleasant",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Det är en skön dag.",
  "ee": "It is a pleasant day.",
  "ch": 7,
  "lv": "A1",
  "wpm": 87.52
}, {
  "id": 1094,
  "sv": "vapen",
  "en": "weapon",
  "t": "n",
  "g": "ett",
  "es": "Polisen hittar ett vapen.",
  "ee": "The police find a weapon.",
  "lv": "A1",
  "wpm": 87.52
}, {
  "id": 1095,
  "sv": "således",
  "en": "thus",
  "t": "a",
  "es": "Han vann således loppet.",
  "ee": "Thus he won the race.",
  "lv": "A1",
  "wpm": 87.49
}, {
  "id": 1096,
  "sv": "förening",
  "en": "association",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "De startar en förening.",
  "ee": "They start an association.",
  "ch": 17,
  "lv": "A1",
  "wpm": 87.48
}, {
  "id": 1097,
  "sv": "lyfta",
  "en": "to lift",
  "t": "v",
  "es": "Han lyfter lådan.",
  "ee": "He lifts the box.",
  "lv": "A1",
  "wpm": 87.39
}, {
  "id": 1098,
  "sv": "eftermiddag (förk. em.)",
  "en": "afternoon",
  "t": "n",
  "g": "en",
  "es": "Vi ses på eftermiddagen.",
  "ee": "We meet in the afternoon.",
  "lv": "A1",
  "wpm": 87.36
}, {
  "id": 1099,
  "sv": "soldat",
  "en": "soldier",
  "t": "n",
  "g": "en",
  "es": "Soldaten marscherar.",
  "ee": "The soldier marches.",
  "lv": "A1",
  "wpm": 87.29
}, {
  "id": 1100,
  "sv": "märka",
  "en": "to notice",
  "t": "v",
  "c": "(-er, -te, -t)",
  "es": "Jag märker förändringen.",
  "ee": "I notice the change.",
  "ch": 20,
  "lv": "A1",
  "wpm": 87.24
}, {
  "id": 1101,
  "sv": "gemenskap",
  "en": "community",
  "t": "n",
  "g": "en",
  "es": "Vi känner gemenskap.",
  "ee": "We feel community.",
  "lv": "A1",
  "wpm": 87.17
}, {
  "id": 1102,
  "sv": "ösa",
  "en": "to pour / scoop",
  "t": "v",
  "lv": "A1",
  "wpm": 87.12
}, {
  "id": 1103,
  "sv": "fast",
  "en": "although / fixed",
  "t": "c",
  "es": "Jag går fast det regnar.",
  "ee": "I go although it rains.",
  "lv": "A1",
  "wpm": 87.09
}, {
  "id": 1104,
  "sv": "styrka",
  "en": "strength",
  "t": "n",
  "g": "en",
  "es": "Hon har stor styrka.",
  "ee": "She has great strength.",
  "lv": "A1",
  "wpm": 86.87
}, {
  "id": 1105,
  "sv": "ersätta",
  "en": "to replace",
  "t": "v",
  "es": "De ersätter chefen.",
  "ee": "They replace the boss.",
  "lv": "A1",
  "wpm": 86.51
}, {
  "id": 1106,
  "sv": "kille",
  "en": "guy",
  "t": "n",
  "g": "en",
  "c": "(-n, -ar, -arna)",
  "es": "Killen springer.",
  "ee": "The guy runs.",
  "ch": 1,
  "lv": "A1",
  "wpm": 86.47
}, {
  "id": 1107,
  "sv": "vård",
  "en": "care",
  "t": "n",
  "g": "en",
  "c": "(-en)",
  "es": "Han får vård.",
  "ee": "He receives care.",
  "ch": 15,
  "lv": "A1",
  "wpm": 86.44
}, {
  "id": 1108,
  "sv": "fullt",
  "en": "full",
  "t": "a",
  "es": "Rummet är fullt.",
  "ee": "The room is full.",
  "lv": "A1",
  "wpm": 86.4
}, {
  "id": 1109,
  "sv": "ägna",
  "en": "to devote",
  "t": "v",
  "es": "Hon ägnar tid åt studier.",
  "ee": "She devotes time to studies.",
  "lv": "A1",
  "wpm": 86.39
}, {
  "id": 1110,
  "sv": "oavsett",
  "en": "regardless",
  "t": "p",
  "es": "Oavsett väder går vi.",
  "ee": "Regardless of the weather we go.",
  "lv": "A1",
  "wpm": 86.16
}, {
  "id": 1111,
  "sv": "poäng",
  "en": "point",
  "t": "n",
  "g": "en",
  "es": "Han gör en poäng.",
  "ee": "He scores a point.",
  "lv": "A1",
  "wpm": 86.13
}, {
  "id": 1112,
  "sv": "satsa",
  "en": "to invest / bet",
  "t": "v",
  "es": "De satsar pengar.",
  "ee": "They invest money.",
  "lv": "A1",
  "wpm": 86.11
}, {
  "id": 1113,
  "sv": "moderat",
  "en": "moderate",
  "t": "n",
  "g": "en",
  "es": "Han är moderat.",
  "ee": "He is a moderate.",
  "lv": "A1",
  "wpm": 86.02
}, {
  "id": 1114,
  "sv": "rida",
  "en": "to ride",
  "t": "v",
  "c": "(-er, red, ridit)",
  "ch": 8,
  "lv": "A1",
  "wpm": 85.96
}, {
  "id": 1115,
  "sv": "jo",
  "en": "yes (contradicting)",
  "t": "i",
  "es": "Jo, det är sant.",
  "ee": "Yes it is, actually.",
  "ch": 11,
  "lv": "A1",
  "wpm": 85.95
}, {
  "id": 1116,
  "sv": "tisdag",
  "en": "Tuesday",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "Vi ses på tisdag.",
  "ee": "We meet on Tuesday.",
  "ch": 5,
  "lv": "A1",
  "wpm": 85.94
}, {
  "id": 1117,
  "sv": "död",
  "en": "death",
  "t": "a",
  "es": "Döden kom plötsligt.",
  "ee": "Death came suddenly.",
  "lv": "A1",
  "wpm": 85.9
}, {
  "id": 1118,
  "sv": "allmänt",
  "en": "generally",
  "t": "a",
  "es": "Det är allmänt känt.",
  "ee": "It is generally known.",
  "lv": "A1",
  "wpm": 85.48
}, {
  "id": 1119,
  "sv": "avsluta",
  "en": "to finish",
  "t": "v",
  "es": "De avslutar mötet.",
  "ee": "They finish the meeting.",
  "lv": "A1",
  "wpm": 85.39
}, {
  "id": 1120,
  "sv": "sova",
  "en": "to sleep",
  "t": "v",
  "c": "(sover, sov, sovit)",
  "ch": 3,
  "lv": "A1",
  "wpm": 85.26
}, {
  "id": 1121,
  "sv": "inne",
  "en": "inside",
  "t": "a",
  "es": "Han är inne.",
  "ee": "He is inside.",
  "lv": "A1",
  "wpm": 85.1
}, {
  "id": 1122,
  "sv": "flicka",
  "en": "girl",
  "t": "n",
  "g": "en",
  "c": "(-n, -or, orna)",
  "es": "Flickan läser.",
  "ee": "The girl reads.",
  "ch": 1,
  "lv": "A1",
  "wpm": 85.02
}, {
  "id": 1123,
  "sv": "sedan (vardagl. sen)",
  "en": "since / later",
  "t": "s",
  "es": "Vi ses sedan.",
  "ee": "We see each other later.",
  "lv": "A1",
  "wpm": 84.79
}, {
  "id": 1124,
  "sv": "total",
  "en": "total",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Det är en total förändring.",
  "ee": "It is a total change.",
  "ch": 7,
  "lv": "A1",
  "wpm": 84.78
}, {
  "id": 1125,
  "sv": "allvarlig",
  "en": "serious",
  "t": "a",
  "es": "Det är ett allvarligt problem.",
  "ee": "It is a serious problem.",
  "lv": "A1",
  "wpm": 84.74
}, {
  "id": 1126,
  "sv": "fram",
  "en": "forward",
  "t": "a",
  "es": "Han går fram.",
  "ee": "He walks forward.",
  "lv": "A1",
  "wpm": 84.73
}, {
  "id": 1127,
  "sv": "ljus",
  "en": "light",
  "t": "n",
  "g": "ett",
  "es": "Ljuset tänds.",
  "ee": "The light turns on.",
  "lv": "A1",
  "wpm": 84.31
}, {
  "id": 1128,
  "sv": "sjukdom",
  "en": "illness",
  "t": "n",
  "g": "en",
  "es": "Sjukdomen behandlas.",
  "ee": "The illness is treated.",
  "lv": "A1",
  "wpm": 84.27
}, {
  "id": 1129,
  "sv": "unge",
  "en": "kid / child",
  "t": "n",
  "g": "en",
  "es": "En unge leker.",
  "ee": "A child plays.",
  "lv": "A1",
  "wpm": 84.16
}, {
  "id": 1130,
  "sv": "i form av",
  "en": "in the form of",
  "t": "p",
  "es": "Det kommer i form av stöd.",
  "ee": "It comes in the form of support.",
  "lv": "A1",
  "wpm": 84.01
}, {
  "id": 1131,
  "sv": "vikt",
  "en": "weight",
  "t": "n",
  "g": "en",
  "es": "Han lyfter en vikt.",
  "ee": "He lifts a weight.",
  "lv": "A1",
  "wpm": 83.95
}, {
  "id": 1132,
  "sv": "rik",
  "en": "rich",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Han är rik.",
  "ee": "He is rich.",
  "ch": 10,
  "lv": "A1",
  "wpm": 83.8
}, {
  "id": 1133,
  "sv": "region",
  "en": "region",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Regionen utvecklas.",
  "ee": "The region develops.",
  "ch": 9,
  "lv": "A1",
  "wpm": 83.76
}, {
  "id": 1134,
  "sv": "samtal",
  "en": "conversation",
  "t": "n",
  "g": "ett",
  "es": "Vi har ett samtal.",
  "ee": "We have a conversation.",
  "lv": "A1",
  "wpm": 83.69
}, {
  "id": 1135,
  "sv": "negativ",
  "en": "negative",
  "t": "a",
  "c": "(-t, a)",
  "es": "Resultatet är negativt.",
  "ee": "The result is negative.",
  "ch": 5,
  "lv": "A1",
  "wpm": 83.54
}, {
  "id": 1136,
  "sv": "mycket",
  "en": "much / very",
  "t": "p",
  "es": "Det är mycket arbete.",
  "ee": "It is much work.",
  "ch": 3,
  "lv": "A1",
  "wpm": 83.53
}, {
  "id": 1137,
  "sv": "i år",
  "en": "this year",
  "t": "a",
  "es": "Vi reser i år.",
  "ee": "We travel this year.",
  "lv": "A1",
  "wpm": 83.52
}, {
  "id": 1138,
  "sv": "igång",
  "en": "started",
  "t": "p",
  "es": "Projektet är igång.",
  "ee": "The project has started.",
  "lv": "A1",
  "wpm": 83.49
}, {
  "id": 1139,
  "sv": "vändning",
  "en": "turn",
  "t": "n",
  "g": "en",
  "es": "Historien får en vändning.",
  "ee": "The story takes a turn.",
  "lv": "A1",
  "wpm": 83.42
}, {
  "id": 1140,
  "sv": "antingen…eller",
  "en": "either…or",
  "t": "c",
  "es": "Antingen går vi eller stannar.",
  "ee": "Either we go or stay.",
  "lv": "A1",
  "wpm": 83.19
}, {
  "id": 1141,
  "sv": "föda",
  "en": "to give birth",
  "t": "v",
  "lv": "A1",
  "wpm": 83.1
}, {
  "id": 1142,
  "sv": "åter",
  "en": "again / back",
  "t": "a",
  "es": "Han kommer åter.",
  "ee": "He comes again.",
  "lv": "A1",
  "wpm": 83.06
}, {
  "id": 1143,
  "sv": "arbetare",
  "en": "worker",
  "t": "n",
  "g": "en",
  "es": "Arbetaren bygger.",
  "ee": "The worker builds.",
  "lv": "A1",
  "wpm": 83.02
}, {
  "id": 1144,
  "sv": "skjuta",
  "en": "to shoot / push",
  "t": "v",
  "c": "(skjuter, sköt, skjutit)",
  "es": "Han skjuter bollen.",
  "ee": "He shoots the ball.",
  "ch": 14,
  "lv": "A1",
  "wpm": 83.01
}, {
  "id": 1145,
  "sv": "tradition",
  "en": "tradition",
  "t": "n",
  "g": "en",
  "es": "Traditionen fortsätter.",
  "ee": "The tradition continues.",
  "lv": "A1",
  "wpm": 82.91
}, {
  "id": 1146,
  "sv": "hämta",
  "en": "to fetch",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Jag hämtar boken.",
  "ee": "I fetch the book.",
  "ch": 13,
  "lv": "A1",
  "wpm": 82.84
}, {
  "id": 1147,
  "sv": "församling",
  "en": "assembly",
  "t": "n",
  "g": "en",
  "es": "Församlingen samlas.",
  "ee": "The congregation gathers.",
  "lv": "A1",
  "wpm": 82.73
}, {
  "id": 1148,
  "sv": "hav",
  "en": "sea",
  "t": "n",
  "g": "ett",
  "c": "(-et, −, -en)",
  "es": "Havet är kallt.",
  "ee": "The sea is cold.",
  "ch": 8,
  "lv": "A1",
  "wpm": 82.66
}, {
  "id": 1149,
  "sv": "energi",
  "en": "energy",
  "t": "n",
  "g": "en",
  "c": "(-n, -er, -erna)",
  "es": "Hon har mycket energi.",
  "ee": "She has much energy.",
  "ch": 15,
  "lv": "A1",
  "wpm": 82.37
}, {
  "id": 1150,
  "sv": "bred",
  "en": "wide",
  "t": "a",
  "c": "(brett, -a)",
  "es": "Vägen är bred.",
  "ee": "The road is wide.",
  "ch": 7,
  "lv": "A1",
  "wpm": 82.28
}, {
  "id": 1151,
  "sv": "vad gäller",
  "en": "regarding",
  "t": "p",
  "es": "Vad gäller arbete är han noggrann.",
  "ee": "Regarding work he is careful.",
  "lv": "A1",
  "wpm": 82.23
}, {
  "id": 1152,
  "sv": "fast",
  "en": "although / fixed",
  "t": "p",
  "es": "Jag går fast det regnar.",
  "ee": "I go although it rains.",
  "lv": "A1",
  "wpm": 82.22
}, {
  "id": 1153,
  "sv": "påpeka",
  "en": "to point out",
  "t": "v",
  "es": "Han påpekar felet.",
  "ee": "He points out the mistake.",
  "lv": "A1",
  "wpm": 82.21
}, {
  "id": 1154,
  "sv": "bättra",
  "en": "to improve",
  "t": "v",
  "es": "Vi bättrar resultatet.",
  "ee": "We improve the result.",
  "lv": "A1",
  "wpm": 82.19
}, {
  "id": 1155,
  "sv": "skaffa",
  "en": "to obtain",
  "t": "v",
  "es": "Han skaffar en bil.",
  "ee": "He gets a car.",
  "lv": "A1",
  "wpm": 82.09
}, {
  "id": 1156,
  "sv": "utgå",
  "en": "to start / assume",
  "t": "v",
  "es": "Mötet utgår från planen.",
  "ee": "The meeting proceeds from the plan.",
  "lv": "A1",
  "wpm": 82.08
}, {
  "id": 1157,
  "sv": "samtlig",
  "en": "all",
  "t": "a",
  "es": "Samtliga elever kommer.",
  "ee": "All students come.",
  "lv": "A1",
  "wpm": 81.95
}, {
  "id": 1158,
  "sv": "stärka",
  "en": "to strengthen",
  "t": "v",
  "es": "De stärker laget.",
  "ee": "They strengthen the team.",
  "lv": "A1",
  "wpm": 81.95
}, {
  "id": 1159,
  "sv": "läkare",
  "en": "doctor",
  "t": "n",
  "g": "en",
  "c": "(-n, –, läkarna)",
  "es": "Läkaren hjälper.",
  "ee": "The doctor helps.",
  "ch": 1,
  "lv": "A1",
  "wpm": 81.81
}, {
  "id": 1160,
  "sv": "fattig",
  "en": "poor",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Han är fattig.",
  "ee": "He is poor.",
  "ch": 10,
  "lv": "A1",
  "wpm": 81.56
}, {
  "id": 1161,
  "sv": "grepp",
  "en": "grip",
  "t": "n",
  "g": "ett",
  "es": "Han tar ett grepp.",
  "ee": "He takes a grip.",
  "lv": "A1",
  "wpm": 81.5
}, {
  "id": 1162,
  "sv": "hej",
  "en": "hello",
  "t": "i",
  "es": "Hej, hur mår du?",
  "ee": "Hi, how are you?",
  "ch": 1,
  "lv": "A1",
  "wpm": 81.45
}, {
  "id": 1163,
  "sv": "utsätta",
  "en": "to expose",
  "t": "v",
  "es": "Han utsätter sig för risk.",
  "ee": "He exposes himself to risk.",
  "lv": "A1",
  "wpm": 81.45
}, {
  "id": 1164,
  "sv": "spännande",
  "en": "exciting",
  "t": "a",
  "c": "(−)",
  "es": "Filmen är spännande.",
  "ee": "The film is exciting.",
  "ch": 5,
  "lv": "A1",
  "wpm": 81.2
}, {
  "id": 1165,
  "sv": "fort",
  "en": "fast",
  "t": "a",
  "es": "Han springer fort.",
  "ee": "He runs fast.",
  "lv": "A1",
  "wpm": 81.07
}, {
  "id": 1166,
  "sv": "sikt",
  "en": "sight / aim",
  "t": "n",
  "g": "en",
  "es": "Han har god sikt.",
  "ee": "He has good visibility.",
  "lv": "A1",
  "wpm": 81.06
}, {
  "id": 1167,
  "sv": "revolution",
  "en": "revolution",
  "t": "n",
  "g": "en",
  "es": "Revolutionen börjar.",
  "ee": "The revolution begins.",
  "lv": "A1",
  "wpm": 81.03
}, {
  "id": 1168,
  "sv": "brev",
  "en": "letter",
  "t": "n",
  "g": "ett",
  "c": "(-et, −, -en)",
  "es": "Jag skriver ett brev.",
  "ee": "I write a letter.",
  "ch": 6,
  "lv": "A1",
  "wpm": 80.95
}, {
  "id": 1169,
  "sv": "personal",
  "en": "staff",
  "t": "n",
  "g": "en",
  "es": "Personalen arbetar.",
  "ee": "The staff works.",
  "lv": "A1",
  "wpm": 80.84
}, {
  "id": 1170,
  "sv": "skada",
  "en": "injury",
  "t": "n",
  "g": "en",
  "es": "Han får en skada.",
  "ee": "He gets an injury.",
  "lv": "A1",
  "wpm": 80.74
}, {
  "id": 1171,
  "sv": "illa",
  "en": "badly",
  "t": "a",
  "es": "Han mår illa.",
  "ee": "He feels sick.",
  "lv": "A1",
  "wpm": 80.73
}, {
  "id": 1172,
  "sv": "kämpa",
  "en": "to fight",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "De kämpar hårt.",
  "ee": "They fight hard.",
  "ch": 6,
  "lv": "A1",
  "wpm": 80.69
}, {
  "id": 1173,
  "sv": "alltför",
  "en": "too much",
  "t": "a",
  "es": "Det är alltför dyrt.",
  "ee": "It is far too expensive.",
  "lv": "A1",
  "wpm": 80.65
}, {
  "id": 1174,
  "sv": "tecken",
  "en": "sign",
  "t": "n",
  "g": "ett",
  "es": "Tecknet visas.",
  "ee": "The sign appears.",
  "lv": "A1",
  "wpm": 80.61
}, {
  "id": 1175,
  "sv": "siffra",
  "en": "number",
  "t": "n",
  "g": "en",
  "c": "(-n, -or, -orna)",
  "es": "Hon skriver en siffra.",
  "ee": "She writes a number.",
  "ch": 3,
  "lv": "A1",
  "wpm": 80.59
}, {
  "id": 1176,
  "sv": "tydligt",
  "en": "clearly",
  "t": "a",
  "es": "Han talar tydligt.",
  "ee": "He speaks clearly.",
  "lv": "A1",
  "wpm": 80.52
}, {
  "id": 1177,
  "sv": "än (el. ännu)",
  "en": "yet / still",
  "t": "a",
  "es": "Inte än.",
  "ee": "Not yet.",
  "lv": "A1",
  "wpm": 80.5
}, {
  "id": 1178,
  "sv": "hårt",
  "en": "hard",
  "t": "a",
  "es": "Han arbetar hårt.",
  "ee": "He works hard.",
  "lv": "A1",
  "wpm": 80.46
}, {
  "id": 1179,
  "sv": "absolut",
  "en": "absolutely",
  "t": "a",
  "es": "Ja absolut.",
  "ee": "Yes absolutely.",
  "lv": "A1",
  "wpm": 80.27
}, {
  "id": 1180,
  "sv": "eka",
  "en": "to echo",
  "t": "v",
  "es": "Rösten ekar.",
  "ee": "The voice echoes.",
  "lv": "A1",
  "wpm": 80.26
}, {
  "id": 1181,
  "sv": "engelsk",
  "en": "English",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Han talar engelsk dialekt.",
  "ee": "He speaks an English dialect.",
  "ch": 5,
  "lv": "A1",
  "wpm": 80.2
}, {
  "id": 1182,
  "sv": "praktik",
  "en": "practice",
  "t": "n",
  "g": "en",
  "c": "(-en)",
  "es": "Hon gör praktik.",
  "ee": "She does an internship.",
  "ch": 16,
  "lv": "A1",
  "wpm": 79.79
}, {
  "id": 1183,
  "sv": "förmodligen",
  "en": "probably",
  "t": "a",
  "es": "Han kommer förmodligen.",
  "ee": "He probably comes.",
  "lv": "A1",
  "wpm": 79.75
}, {
  "id": 1184,
  "sv": "hoppa",
  "en": "to jump",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Barnet hoppar.",
  "ee": "The child jumps.",
  "ch": 8,
  "lv": "A1",
  "wpm": 79.72
}, {
  "id": 1185,
  "sv": "morgon",
  "en": "morning",
  "t": "n",
  "g": "en",
  "c": "(-en, morgnar, morgnarna)",
  "es": "Vi ses imorgon morgon.",
  "ee": "We meet tomorrow morning.",
  "ch": 13,
  "lv": "A1",
  "wpm": 79.54
}, {
  "id": 1186,
  "sv": "tjej",
  "en": "girl",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Tjejen skrattar.",
  "ee": "The girl laughs.",
  "ch": 1,
  "lv": "A1",
  "wpm": 79.44
}, {
  "id": 1187,
  "sv": "konstig",
  "en": "strange",
  "t": "a",
  "es": "Det är konstigt.",
  "ee": "It is strange.",
  "lv": "A1",
  "wpm": 79.43
}, {
  "id": 1188,
  "sv": "union",
  "en": "union",
  "t": "n",
  "g": "en",
  "es": "De bildar en union.",
  "ee": "They form a union.",
  "lv": "A1",
  "wpm": 79.39
}, {
  "id": 1189,
  "sv": "kommande",
  "en": "coming",
  "t": "a",
  "es": "Kommande vecka reser vi.",
  "ee": "Next week we travel.",
  "lv": "A1",
  "wpm": 79.27
}, {
  "id": 1190,
  "sv": "avgöra",
  "en": "to decide",
  "t": "v",
  "es": "Domaren avgör matchen.",
  "ee": "The referee decides the match.",
  "lv": "A1",
  "wpm": 79.23
}, {
  "id": 1191,
  "sv": "chef",
  "en": "boss",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Chefen beslutar.",
  "ee": "The boss decides.",
  "ch": 13,
  "lv": "A1",
  "wpm": 79.17
}, {
  "id": 1192,
  "sv": "vis",
  "en": "way",
  "t": "n",
  "g": "ett",
  "es": "På detta vis fungerar det.",
  "ee": "In this way it works.",
  "lv": "A1",
  "wpm": 79.11
}, {
  "id": 1193,
  "sv": "strid",
  "en": "battle",
  "t": "n",
  "g": "en",
  "es": "Striden börjar.",
  "ee": "The battle begins.",
  "lv": "A1",
  "wpm": 78.98
}, {
  "id": 1194,
  "sv": "sända",
  "en": "to send",
  "t": "v",
  "es": "De sänder nyheter.",
  "ee": "They broadcast news.",
  "lv": "A1",
  "wpm": 78.93
}, {
  "id": 1195,
  "sv": "missa",
  "en": "to miss",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Jag missar bussen.",
  "ee": "I miss the bus.",
  "ch": 14,
  "lv": "A1",
  "wpm": 78.88
}, {
  "id": 1196,
  "sv": "bedriva",
  "en": "to conduct",
  "t": "v",
  "es": "Företaget bedriver handel.",
  "ee": "The company conducts trade.",
  "lv": "A1",
  "wpm": 78.64
}, {
  "id": 1197,
  "sv": "etcetera (el. et cetera, förk. etc.)",
  "en": "etcetera",
  "t": "a",
  "es": "Listan fortsätter etcetera.",
  "ee": "The list continues etcetera.",
  "lv": "A1",
  "wpm": 78.45
}, {
  "id": 1198,
  "sv": "anföra",
  "en": "to lead / cite",
  "t": "v",
  "es": "Han anför ett argument.",
  "ee": "He presents an argument.",
  "lv": "A1",
  "wpm": 78.34
}, {
  "id": 1199,
  "sv": "varm",
  "en": "warm",
  "t": "a",
  "es": "Soppan är varm.",
  "ee": "The soup is warm.",
  "lv": "A1",
  "wpm": 78.22
}, {
  "id": 1200,
  "sv": "hit",
  "en": "here (toward)",
  "t": "a",
  "es": "Kom hit.",
  "ee": "Come here.",
  "ch": 13,
  "lv": "A1",
  "wpm": 78.19
}, {
  "id": 1201,
  "sv": "berättelse",
  "en": "story",
  "t": "n",
  "g": "en",
  "es": "Hon berättar en berättelse.",
  "ee": "She tells a story.",
  "lv": "A1",
  "wpm": 78.05
}, {
  "id": 1202,
  "sv": "produktion",
  "en": "production",
  "t": "n",
  "g": "en",
  "es": "Företaget ökar produktionen.",
  "ee": "The company increases production.",
  "lv": "A1",
  "wpm": 77.86
}, {
  "id": 1203,
  "sv": "kapitel (förk. kap.)",
  "en": "chapter",
  "t": "n",
  "g": "ett",
  "es": "Jag läser ett kapitel.",
  "ee": "I read a chapter.",
  "lv": "A1",
  "wpm": 77.76
}, {
  "id": 1204,
  "sv": "hindra",
  "en": "to prevent",
  "t": "v",
  "es": "De hindrar olyckan.",
  "ee": "They prevent the accident.",
  "lv": "A1",
  "wpm": 77.58
}, {
  "id": 1205,
  "sv": "konst",
  "en": "art",
  "t": "n",
  "g": "en",
  "es": "Hon studerar konst.",
  "ee": "She studies art.",
  "lv": "A1",
  "wpm": 77.53
}, {
  "id": 1206,
  "sv": "speciell",
  "en": "special",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Det är en speciell dag.",
  "ee": "It is a special day.",
  "ch": 6,
  "lv": "A1",
  "wpm": 77.45
}, {
  "id": 1207,
  "sv": "allvar",
  "en": "seriousness",
  "t": "n",
  "g": "ett",
  "es": "Han talar med allvar.",
  "ee": "He speaks with seriousness.",
  "lv": "A1",
  "wpm": 77.42
}, {
  "id": 1208,
  "sv": "grön",
  "en": "green",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Gräset är grönt.",
  "ee": "The grass is green.",
  "ch": 7,
  "lv": "A1",
  "wpm": 77.31
}, {
  "id": 1209,
  "sv": "vår",
  "en": "spring",
  "t": "n",
  "g": "en",
  "c": "(-t, -a)",
  "es": "Vår bil är blå.",
  "ee": "Our car is blue.",
  "ch": 6,
  "lv": "A1",
  "wpm": 77.26
}, {
  "id": 1210,
  "sv": "meddela",
  "en": "to inform",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Hon meddelar nyheten.",
  "ee": "She informs the news.",
  "ch": 20,
  "lv": "A1",
  "wpm": 77.16
}, {
  "id": 1211,
  "sv": "omöjlig",
  "en": "impossible",
  "t": "a",
  "es": "Det är omöjligt.",
  "ee": "It is impossible.",
  "lv": "A1",
  "wpm": 77.05
}, {
  "id": 1212,
  "sv": "tillämpa",
  "en": "to apply",
  "t": "v",
  "es": "De tillämpar lagen.",
  "ee": "They apply the law.",
  "lv": "A1",
  "wpm": 77.02
}, {
  "id": 1213,
  "sv": "skydd",
  "en": "protection",
  "t": "n",
  "g": "ett",
  "es": "De ger skydd.",
  "ee": "They provide protection.",
  "lv": "A1",
  "wpm": 76.99
}, {
  "id": 1214,
  "sv": "hittills",
  "en": "so far",
  "t": "a",
  "es": "Hittills går det bra.",
  "ee": "So far it goes well.",
  "lv": "A1",
  "wpm": 76.96
}, {
  "id": 1215,
  "sv": "sällan",
  "en": "seldom",
  "t": "a",
  "es": "Jag reser sällan.",
  "ee": "I travel seldom.",
  "ch": 5,
  "lv": "A1",
  "wpm": 76.95
}, {
  "id": 1216,
  "sv": "position",
  "en": "position",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Han tar en position.",
  "ee": "He takes a position.",
  "ch": 1,
  "lv": "A1",
  "wpm": 76.89
}, {
  "id": 1217,
  "sv": "behandling",
  "en": "treatment",
  "t": "n",
  "g": "en",
  "es": "Behandlingen fortsätter.",
  "ee": "The treatment continues.",
  "lv": "A1",
  "wpm": 76.64
}, {
  "id": 1218,
  "sv": "omfattande",
  "en": "extensive",
  "t": "a",
  "es": "Det är en omfattande studie.",
  "ee": "It is an extensive study.",
  "lv": "A1",
  "wpm": 76.54
}, {
  "id": 1219,
  "sv": "skog",
  "en": "forest",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "Vi går i skogen.",
  "ee": "We walk in the forest.",
  "ch": 7,
  "lv": "A1",
  "wpm": 76.52
}, {
  "id": 1220,
  "sv": "kritisera",
  "en": "to criticize",
  "t": "v",
  "es": "Han kritiserar beslutet.",
  "ee": "He criticizes the decision.",
  "lv": "A1",
  "wpm": 76.46
}, {
  "id": 1221,
  "sv": "förklaring",
  "en": "explanation",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "Jag ger en förklaring.",
  "ee": "I give an explanation.",
  "ch": 9,
  "lv": "A1",
  "wpm": 76.39
}, {
  "id": 1222,
  "sv": "springa",
  "en": "to run",
  "t": "v",
  "c": "(-er, sprang, sprungit)",
  "es": "Hunden springer.",
  "ee": "The dog runs.",
  "ch": 7,
  "lv": "A1",
  "wpm": 76.39
}, {
  "id": 1223,
  "sv": "oerhört",
  "en": "extremely",
  "t": "a",
  "es": "Det är oerhört svårt.",
  "ee": "It is extremely difficult.",
  "lv": "A1",
  "wpm": 76.26
}, {
  "id": 1224,
  "sv": "uppfatta",
  "en": "to perceive",
  "t": "v",
  "es": "Jag uppfattar budskapet.",
  "ee": "I perceive the message.",
  "lv": "A1",
  "wpm": 76.24
}, {
  "id": 1225,
  "sv": "foto",
  "en": "photo",
  "t": "n",
  "g": "ett",
  "c": "(-t, -n, -na)",
  "es": "Jag tar ett foto.",
  "ee": "I take a photo.",
  "ch": 1,
  "lv": "A1",
  "wpm": 76.14
}, {
  "id": 1226,
  "sv": "islam",
  "en": "Islam",
  "t": "n",
  "g": "en",
  "es": "Han studerar islam.",
  "ee": "He studies Islam.",
  "lv": "A1",
  "wpm": 76.13
}, {
  "id": 1227,
  "sv": "stänga",
  "en": "to close",
  "t": "v",
  "c": "(stänger, stängde, stängt)",
  "es": "Hon stänger dörren.",
  "ee": "She closes the door.",
  "ch": 11,
  "lv": "A1",
  "wpm": 76.1
}, {
  "id": 1228,
  "sv": "aning",
  "en": "idea / hint",
  "t": "n",
  "g": "en",
  "es": "Jag har en aning.",
  "ee": "I have an idea.",
  "lv": "A1",
  "wpm": 76.09
}, {
  "id": 1229,
  "sv": "försvar",
  "en": "defense",
  "t": "n",
  "g": "ett",
  "es": "Han bygger ett försvar.",
  "ee": "He builds a defense.",
  "lv": "A1",
  "wpm": 76.08
}, {
  "id": 1230,
  "sv": "meter",
  "en": "meter",
  "t": "n",
  "g": "en",
  "es": "Staven är en meter.",
  "ee": "The stick is one meter.",
  "lv": "A1",
  "wpm": 76.04
}, {
  "id": 1231,
  "sv": "evolution",
  "en": "evolution",
  "t": "n",
  "g": "en",
  "es": "Evolutionen fortsätter.",
  "ee": "Evolution continues.",
  "lv": "A1",
  "wpm": 75.98
}, {
  "id": 1232,
  "sv": "funktion",
  "en": "function",
  "t": "n",
  "g": "en",
  "es": "Maskinen har en funktion.",
  "ee": "The machine has a function.",
  "lv": "A1",
  "wpm": 75.88
}, {
  "id": 1233,
  "sv": "dotter",
  "en": "daughter",
  "t": "n",
  "g": "en",
  "c": "(-n, döttrar, döttrarna)",
  "es": "Min dotter studerar.",
  "ee": "My daughter studies.",
  "ch": 1,
  "lv": "A1",
  "wpm": 75.82
}, {
  "id": 1234,
  "sv": "värdering",
  "en": "valuation / value judgment",
  "t": "n",
  "g": "en",
  "es": "Hon gör en värdering.",
  "ee": "She makes an evaluation.",
  "lv": "A1",
  "wpm": 75.62
}, {
  "id": 1235,
  "sv": "råda",
  "en": "to advise",
  "t": "v",
  "lv": "A1",
  "wpm": 75.56
}, {
  "id": 1236,
  "sv": "ersättning",
  "en": "compensation",
  "t": "n",
  "g": "en",
  "es": "Han får ersättning.",
  "ee": "He receives compensation.",
  "lv": "A1",
  "wpm": 75.51
}, {
  "id": 1237,
  "sv": "slippa",
  "en": "to not have to / be excused from",
  "t": "v",
  "es": "Jag slipper jobbet.",
  "ee": "I don't have to do the job.",
  "lv": "A1",
  "wpm": 75.51
}, {
  "id": 1238,
  "sv": "självklart",
  "en": "of course",
  "t": "a",
  "es": "Självklart kommer jag.",
  "ee": "Of course I come.",
  "ch": 3,
  "lv": "A1",
  "wpm": 75.31
}, {
  "id": 1239,
  "sv": "lämplig",
  "en": "suitable",
  "t": "a",
  "es": "Det är en lämplig plats.",
  "ee": "It is a suitable place.",
  "lv": "A1",
  "wpm": 75.27
}, {
  "id": 1240,
  "sv": "ting",
  "en": "thing",
  "t": "n",
  "g": "ett",
  "es": "Det är ett märkligt ting.",
  "ee": "It is a strange thing.",
  "lv": "A1",
  "wpm": 75.13
}, {
  "id": 1241,
  "sv": "minne",
  "en": "memory",
  "t": "n",
  "g": "ett",
  "es": "Jag har ett minne.",
  "ee": "I have a memory.",
  "lv": "A1",
  "wpm": 75.11
}, {
  "id": 1242,
  "sv": "strategi",
  "en": "strategy",
  "t": "n",
  "g": "en",
  "es": "De utvecklar en strategi.",
  "ee": "They develop a strategy.",
  "lv": "A1",
  "wpm": 75.1
}, {
  "id": 1243,
  "sv": "dyka",
  "en": "to dive / appear",
  "t": "v",
  "c": "(-er, dök, dykit)",
  "ch": 19,
  "lv": "A1",
  "wpm": 75.09
}, {
  "id": 1244,
  "sv": "orka",
  "en": "to have the energy",
  "t": "v",
  "c": "(-r, -ade, -t)",
  "es": "Jag orkar inte.",
  "ee": "I do not have the energy.",
  "ch": 8,
  "lv": "A1",
  "wpm": 75.09
}, {
  "id": 1245,
  "sv": "kontrollera",
  "en": "to control / check",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "De kontrollerar systemet.",
  "ee": "They check the system.",
  "ch": 3,
  "lv": "A1",
  "wpm": 74.97
}, {
  "id": 1246,
  "sv": "planera",
  "en": "to plan",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Vi planerar resan.",
  "ee": "We plan the trip.",
  "ch": 8,
  "lv": "A1",
  "wpm": 74.86
}, {
  "id": 1247,
  "sv": "färg",
  "en": "color",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Bilen har en fin färg.",
  "ee": "The car has a nice color.",
  "ch": 7,
  "lv": "A1",
  "wpm": 74.81
}, {
  "id": 1248,
  "sv": "lova",
  "en": "to promise",
  "t": "v",
  "es": "Han lovar hjälp.",
  "ee": "He promises help.",
  "lv": "A1",
  "wpm": 74.62
}, {
  "id": 1249,
  "sv": "citera",
  "en": "to quote",
  "t": "v",
  "es": "Hon citerar boken.",
  "ee": "She quotes the book.",
  "lv": "A1",
  "wpm": 74.41
}, {
  "id": 1250,
  "sv": "finansiell",
  "en": "financial",
  "t": "a",
  "es": "Det är en finansiell fråga.",
  "ee": "It is a financial issue.",
  "lv": "A1",
  "wpm": 74.34
}, {
  "id": 1251,
  "sv": "ständigt",
  "en": "constantly",
  "t": "a",
  "es": "Han arbetar ständigt.",
  "ee": "He works constantly.",
  "lv": "A1",
  "wpm": 74.22
}, {
  "id": 1252,
  "sv": "spår",
  "en": "trace",
  "t": "n",
  "g": "ett",
  "c": "(-et, −, -en)",
  "es": "Vi följer ett spår.",
  "ee": "We follow a track.",
  "ch": 9,
  "lv": "A1",
  "wpm": 74.17
}, {
  "id": 1253,
  "sv": "kall",
  "en": "cold",
  "t": "a",
  "es": "Vattnet är kallt.",
  "ee": "The water is cold.",
  "lv": "A1",
  "wpm": 74.14
}, {
  "id": 1254,
  "sv": "vuxen",
  "en": "adult",
  "t": "a",
  "c": "(vuxet, vuxna)",
  "es": "Han är vuxen.",
  "ee": "He is an adult.",
  "ch": 6,
  "lv": "A1",
  "wpm": 74.07
}, {
  "id": 1255,
  "sv": "allians",
  "en": "alliance",
  "t": "n",
  "g": "en",
  "es": "De bildar en allians.",
  "ee": "They form an alliance.",
  "lv": "A1",
  "wpm": 74.06
}, {
  "id": 1256,
  "sv": "faktor",
  "en": "factor",
  "t": "n",
  "g": "en",
  "c": "(-n, -er, -erna)",
  "es": "Det är en viktig faktor.",
  "ee": "It is an important factor.",
  "ch": 14,
  "lv": "A1",
  "wpm": 73.95
}, {
  "id": 1257,
  "sv": "kvalitet (el. kvalité)",
  "en": "quality",
  "t": "n",
  "g": "en",
  "es": "Produkten har hög kvalitet.",
  "ee": "The product has high quality.",
  "lv": "A1",
  "wpm": 73.93
}, {
  "id": 1258,
  "sv": "upp",
  "en": "up",
  "t": "a",
  "es": "H an går upp.",
  "ee": "He goes up.",
  "ch": 2,
  "lv": "A1",
  "wpm": 73.89
}, {
  "id": 1259,
  "sv": "utländsk",
  "en": "foreign",
  "t": "a",
  "es": "Hon arbetar i ett utländskt företag.",
  "ee": "She works in a foreign company.",
  "lv": "A1",
  "wpm": 73.89
}, {
  "id": 1260,
  "sv": "svag",
  "en": "weak",
  "t": "a",
  "es": "Han känner sig svag.",
  "ee": "He feels weak.",
  "lv": "A1",
  "wpm": 73.87
}, {
  "id": 1261,
  "sv": "sköta",
  "en": "to manage",
  "t": "v",
  "es": "Hon sköter företaget.",
  "ee": "She manages the company.",
  "lv": "A1",
  "wpm": 73.72
}, {
  "id": 1262,
  "sv": "vägra",
  "en": "to refuse",
  "t": "v",
  "es": "Han vägrar svara.",
  "ee": "He refuses to answer.",
  "lv": "A1",
  "wpm": 73.64
}, {
  "id": 1263,
  "sv": "rike",
  "en": "kingdom",
  "t": "n",
  "g": "ett",
  "es": "Riket växer.",
  "ee": "The kingdom grows.",
  "lv": "A1",
  "wpm": 73.5
}, {
  "id": 1264,
  "sv": "framgå",
  "en": "to appear / become clear",
  "t": "v",
  "es": "Det framgår av rapporten.",
  "ee": "It appears from the report.",
  "lv": "A1",
  "wpm": 73.41
}, {
  "id": 1265,
  "sv": "judisk",
  "en": "Jewish",
  "t": "a",
  "es": "Han studerar judisk historia.",
  "ee": "He studies Jewish history.",
  "lv": "A1",
  "wpm": 73.26
}, {
  "id": 1266,
  "sv": "studera",
  "en": "to study",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Jag studerar svenska.",
  "ee": "I study Swedish.",
  "ch": 1,
  "lv": "A1",
  "wpm": 73.17
}, {
  "id": 1267,
  "sv": "farlig",
  "en": "dangerous",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Det är farligt.",
  "ee": "It is dangerous.",
  "ch": 20,
  "lv": "A1",
  "wpm": 73.07
}, {
  "id": 1268,
  "sv": "framgång",
  "en": "success",
  "t": "n",
  "g": "en",
  "es": "Projektet är en framgång.",
  "ee": "The project is a success.",
  "lv": "A1",
  "wpm": 73.07
}, {
  "id": 1269,
  "sv": "tolka",
  "en": "to interpret",
  "t": "v",
  "es": "Hon tolkar texten.",
  "ee": "She interprets the text.",
  "lv": "A1",
  "wpm": 73.02
}, {
  "id": 1270,
  "sv": "billig",
  "en": "cheap",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Boken är billig.",
  "ee": "The book is cheap.",
  "ch": 7,
  "lv": "A1",
  "wpm": 73.02
}, {
  "id": 1271,
  "sv": "iväg",
  "en": "away",
  "t": "p",
  "es": "H an springer iväg.",
  "ee": "He runs away.",
  "lv": "A1",
  "wpm": 72.74
}, {
  "id": 1272,
  "sv": "student",
  "en": "student",
  "t": "n",
  "g": "en",
  "es": "Studenten studerar.",
  "ee": "The student studies.",
  "lv": "A1",
  "wpm": 72.69
}, {
  "id": 1273,
  "sv": "och så vidare (förk. o.s.v., osv.)",
  "en": "etcetera",
  "t": "a",
  "es": "Listan fortsätter och så vidare.",
  "ee": "The list continues etcetera.",
  "lv": "A1",
  "wpm": 72.62
}, {
  "id": 1274,
  "sv": "visserligen",
  "en": "admittedly",
  "t": "a",
  "es": "Det är visserligen sant.",
  "ee": "Admittedly it is true.",
  "lv": "A1",
  "wpm": 72.58
}, {
  "id": 1275,
  "sv": "vara",
  "en": "goods / product",
  "t": "n",
  "g": "en",
  "c": "(är, var, varit)",
  "ch": 1,
  "lv": "A1",
  "wpm": 72.57,
  "es": "Butiken säljer varor.",
  "ee": "The shop sells goods."
}, {
  "id": 1276,
  "sv": "undantag",
  "en": "exception",
  "t": "n",
  "g": "ett",
  "es": "Det finns ett undantag.",
  "ee": "There is an exception.",
  "lv": "A1",
  "wpm": 72.4
}, {
  "id": 1277,
  "sv": "tillgänglig",
  "en": "available",
  "t": "a",
  "es": "Informationen är tillgänglig.",
  "ee": "The information is available.",
  "lv": "A1",
  "wpm": 72.31
}, {
  "id": 1278,
  "sv": "enorm",
  "en": "enormous",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Det är ett enormt problem.",
  "ee": "It is an enormous problem.",
  "ch": 17,
  "lv": "A1",
  "wpm": 72.24
}, {
  "id": 1279,
  "sv": "behålla",
  "en": "to keep",
  "t": "v",
  "es": "Han behåller boken.",
  "ee": "He keeps the book.",
  "lv": "A1",
  "wpm": 72.2
}, {
  "id": 1280,
  "sv": "dricka",
  "en": "to drink",
  "t": "v",
  "c": "(dricker, drack, druckit)",
  "es": "Jag dricker vatten.",
  "ee": "I drink water.",
  "ch": 2,
  "lv": "A1",
  "wpm": 72.16
}, {
  "id": 1281,
  "sv": "aktion",
  "en": "action",
  "t": "n",
  "g": "en",
  "es": "De startar en aktion.",
  "ee": "They start an action.",
  "lv": "A1",
  "wpm": 72.14
}, {
  "id": 1282,
  "sv": "bry sig",
  "en": "to care",
  "t": "v",
  "es": "H an bryr sig.",
  "ee": "He cares.",
  "lv": "A1",
  "wpm": 72.13
}, {
  "id": 1283,
  "sv": "relativt",
  "en": "relatively",
  "t": "a",
  "es": "Det är relativt lätt.",
  "ee": "It is relatively easy.",
  "lv": "A1",
  "wpm": 72.06
}, {
  "id": 1284,
  "sv": "tung",
  "en": "heavy",
  "t": "a",
  "es": "Väskan är tung.",
  "ee": "The bag is heavy.",
  "lv": "A1",
  "wpm": 72.04
}, {
  "id": 1285,
  "sv": "arbetsgivare",
  "en": "employer",
  "t": "n",
  "g": "en",
  "es": "Arbetsgivaren anställer.",
  "ee": "The employer hires.",
  "lv": "A1",
  "wpm": 71.89
}, {
  "id": 1286,
  "sv": "med hjälp av",
  "en": "with the help of",
  "t": "p",
  "es": "Han löser det med hjälp av en vän.",
  "ee": "He solves it with the help of a friend.",
  "lv": "A1",
  "wpm": 71.84
}, {
  "id": 1287,
  "sv": "tvärtom (el. tvärt om)",
  "en": "on the contrary",
  "t": "a",
  "es": "Det är tvärtom.",
  "ee": "It is the opposite.",
  "lv": "A1",
  "wpm": 71.67
}, {
  "id": 1288,
  "sv": "notera",
  "en": "to note",
  "t": "v",
  "es": "Han noterar resultatet.",
  "ee": "He notes the result.",
  "lv": "A1",
  "wpm": 71.48
}, {
  "id": 1289,
  "sv": "nation",
  "en": "nation",
  "t": "n",
  "g": "en",
  "es": "Nationen växer.",
  "ee": "The nation grows.",
  "lv": "A1",
  "wpm": 71.44
}, {
  "id": 1290,
  "sv": "sänka",
  "en": "to lower",
  "t": "v",
  "es": "De sänker priset.",
  "ee": "They lower the price.",
  "lv": "A1",
  "wpm": 71.42
}, {
  "id": 1291,
  "sv": "ärende",
  "en": "matter",
  "t": "n",
  "g": "ett",
  "es": "Han har ett ärende.",
  "ee": "He has a matter.",
  "lv": "A1",
  "wpm": 71.39
}, {
  "id": 1292,
  "sv": "givare",
  "en": "donor",
  "t": "n",
  "g": "en",
  "es": "Givaren hjälper.",
  "ee": "The donor helps.",
  "lv": "A1",
  "wpm": 71.09
}, {
  "id": 1293,
  "sv": "kull",
  "en": "litter",
  "t": "n",
  "g": "en",
  "es": "Hunden har en kull.",
  "ee": "The dog has a litter.",
  "lv": "A1",
  "wpm": 71.03
}, {
  "id": 1294,
  "sv": "nyligen",
  "en": "recently",
  "t": "a",
  "es": "Han kom nyligen.",
  "ee": "He came recently.",
  "lv": "A1",
  "wpm": 71.03
}, {
  "id": 1295,
  "sv": "rättelse",
  "en": "correction",
  "t": "n",
  "g": "en",
  "es": "De gör en rättelse.",
  "ee": "They make a correction.",
  "lv": "A1",
  "wpm": 71.0
}, {
  "id": 1296,
  "sv": "delvis",
  "en": "partly",
  "t": "a",
  "es": "Projektet lyckas delvis.",
  "ee": "The project partly succeeds.",
  "lv": "A1",
  "wpm": 70.94
}, {
  "id": 1297,
  "sv": "medföra",
  "en": "to entail",
  "t": "v",
  "es": "Det medför risk.",
  "ee": "It entails risk.",
  "lv": "A1",
  "wpm": 70.92
}, {
  "id": 1298,
  "sv": "ifrågasätta",
  "en": "to question",
  "t": "v",
  "es": "Hon ifrågasätter beslutet.",
  "ee": "She questions the decision.",
  "lv": "A1",
  "wpm": 70.79
}, {
  "id": 1299,
  "sv": "för övrigt",
  "en": "by the way",
  "t": "a",
  "es": "För övrigt mår jag bra.",
  "ee": "By the way I feel well.",
  "lv": "A1",
  "wpm": 70.76
}, {
  "id": 1300,
  "sv": "län",
  "en": "county",
  "t": "n",
  "g": "ett",
  "c": "(-et, −, -en)",
  "es": "Han bor i ett län.",
  "ee": "He lives in a county.",
  "ch": 17,
  "lv": "A1",
  "wpm": 70.61
}, {
  "id": 1301,
  "sv": "gata",
  "en": "street",
  "t": "n",
  "g": "en",
  "c": "(-n, -or, -orna)",
  "es": "Bilen står på gatan.",
  "ee": "The car stands on the street.",
  "ch": 3,
  "lv": "A1",
  "wpm": 70.48
}, {
  "id": 1302,
  "sv": "medveten",
  "en": "aware",
  "t": "a",
  "es": "Hon är medveten.",
  "ee": "She is aware.",
  "lv": "A1",
  "wpm": 70.44
}, {
  "id": 1303,
  "sv": "serie",
  "en": "series",
  "t": "n",
  "g": "en",
  "c": "(-n, -er, -erna)",
  "es": "Jag ser en serie.",
  "ee": "I watch a series.",
  "ch": 7,
  "lv": "A1",
  "wpm": 70.44
}, {
  "id": 1304,
  "sv": "rimlig",
  "en": "reasonable",
  "t": "a",
  "es": "Det är ett rimligt pris.",
  "ee": "It is a reasonable price.",
  "lv": "A1",
  "wpm": 70.42
}, {
  "id": 1305,
  "sv": "ty",
  "en": "because",
  "t": "c",
  "es": "Han stannar ty han är trött.",
  "ee": "He stays because he is tired.",
  "lv": "A1",
  "wpm": 70.38
}, {
  "id": 1306,
  "sv": "invandrare",
  "en": "immigrant",
  "t": "n",
  "g": "en",
  "es": "Invandraren arbetar.",
  "ee": "The immigrant works.",
  "lv": "A1",
  "wpm": 70.38
}, {
  "id": 1307,
  "sv": "dörr",
  "en": "door",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "Dörren är stängd.",
  "ee": "The door is closed.",
  "ch": 14,
  "lv": "A1",
  "wpm": 70.02
}, {
  "id": 1308,
  "sv": "direktiv",
  "en": "directive",
  "t": "n",
  "g": "ett",
  "es": "Regeringen ger ett direktiv.",
  "ee": "The government gives a directive.",
  "lv": "A1",
  "wpm": 69.99
}, {
  "id": 1309,
  "sv": "stiga",
  "en": "to rise",
  "t": "v",
  "c": "(stiger, steg, stigit)",
  "es": "Temperaturen stiger.",
  "ee": "The temperature rises.",
  "ch": 3,
  "lv": "A1",
  "wpm": 69.91
}, {
  "id": 1310,
  "sv": "tiga",
  "en": "to remain silent",
  "t": "v",
  "lv": "A1",
  "wpm": 69.91
}, {
  "id": 1311,
  "sv": "fot",
  "en": "foot",
  "t": "n",
  "g": "en",
  "c": "(-en, fötter, fötterna)",
  "es": "Han skadar sin fot.",
  "ee": "He injures his foot.",
  "ch": 15,
  "lv": "A1",
  "wpm": 69.9
}, {
  "id": 1312,
  "sv": "begränsad",
  "en": "limited",
  "t": "a",
  "es": "Resurserna är begränsade.",
  "ee": "The resources are limited.",
  "lv": "A1",
  "wpm": 69.9
}, {
  "id": 1313,
  "sv": "vag",
  "en": "vague",
  "t": "a",
  "es": "Planen är vag.",
  "ee": "The plan is vague.",
  "lv": "A1",
  "wpm": 69.88
}, {
  "id": 1314,
  "sv": "äntligen",
  "en": "finally",
  "t": "a",
  "es": "Vi är äntligen hemma.",
  "ee": "We are finally home.",
  "ch": 17,
  "lv": "A1",
  "wpm": 69.88
}, {
  "id": 1315,
  "sv": "vänster",
  "en": "left",
  "t": "a",
  "es": "Han svänger vänster.",
  "ee": "He turns left.",
  "lv": "A1",
  "wpm": 69.77
}, {
  "id": 1316,
  "sv": "ner (el. ned)",
  "en": "down",
  "t": "a",
  "es": "Hunden går ner.",
  "ee": "The dog goes down.",
  "lv": "A1",
  "wpm": 69.65
}, {
  "id": 1317,
  "sv": "väcka",
  "en": "to wake",
  "t": "v",
  "es": "H on väcker barnet.",
  "ee": "She wakes the child.",
  "lv": "A1",
  "wpm": 69.65
}, {
  "id": 1318,
  "sv": "leta",
  "en": "to search",
  "t": "v",
  "c": "(-r, -ade, -t)",
  "es": "Jag letar efter boken.",
  "ee": "I search for the book.",
  "ch": 6,
  "lv": "A1",
  "wpm": 69.52
}, {
  "id": 1319,
  "sv": "häst",
  "en": "horse",
  "t": "n",
  "g": "en",
  "es": "Hästen springer.",
  "ee": "The horse runs.",
  "lv": "A1",
  "wpm": 69.47
}, {
  "id": 1320,
  "sv": "kategori",
  "en": "category",
  "t": "n",
  "g": "en",
  "c": "(-n, -er, -erna)",
  "es": "Produkten hör till en kategori.",
  "ee": "The product belongs to a category.",
  "ch": 11,
  "lv": "A1",
  "wpm": 69.47
}, {
  "id": 1321,
  "sv": "brittisk",
  "en": "British",
  "t": "a",
  "es": "Han är brittisk.",
  "ee": "He is British.",
  "lv": "A1",
  "wpm": 69.43
}, {
  "id": 1322,
  "sv": "följd",
  "en": "consequence",
  "t": "n",
  "g": "en",
  "es": "Det får en följd.",
  "ee": "It has a consequence.",
  "lv": "A1",
  "wpm": 69.24
}, {
  "id": 1323,
  "sv": "ed",
  "en": "oath",
  "t": "n",
  "g": "en",
  "es": "Han svär en ed.",
  "ee": "He swears an oath.",
  "lv": "A1",
  "wpm": 69.22
}, {
  "id": 1324,
  "sv": "fred",
  "en": "peace",
  "t": "n",
  "g": "en",
  "es": "Landet vill ha fred.",
  "ee": "The country wants peace.",
  "lv": "A1",
  "wpm": 69.22
}, {
  "id": 1325,
  "sv": "traditionell",
  "en": "traditional",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Det är en traditionell rätt.",
  "ee": "It is a traditional dish.",
  "ch": 12,
  "lv": "A1",
  "wpm": 69.22
}, {
  "id": 1326,
  "sv": "användning",
  "en": "use",
  "t": "n",
  "g": "en",
  "es": "Det finns en användning.",
  "ee": "There is a use.",
  "lv": "A1",
  "wpm": 69.21
}, {
  "id": 1327,
  "sv": "riskera",
  "en": "to risk",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Han riskerar livet.",
  "ee": "He risks his life.",
  "ch": 20,
  "lv": "A1",
  "wpm": 69.16
}, {
  "id": 1328,
  "sv": "tappa",
  "en": "to drop",
  "t": "v",
  "es": "Hon tappar glaset.",
  "ee": "She drops the glass.",
  "lv": "A1",
  "wpm": 69.16
}, {
  "id": 1329,
  "sv": "inkomst",
  "en": "income",
  "t": "n",
  "g": "en",
  "es": "Han har hög inkomst.",
  "ee": "He has a high income.",
  "lv": "A1",
  "wpm": 69.04
}, {
  "id": 1330,
  "sv": "nöjd",
  "en": "satisfied",
  "t": "a",
  "c": "(nöjt, nöjda)",
  "es": "Jag är nöjd.",
  "ee": "I am satisfied.",
  "ch": 15,
  "lv": "A1",
  "wpm": 69.02
}, {
  "id": 1331,
  "sv": "kläder",
  "en": "clothes",
  "t": "n",
  "c": "(-na)",
  "es": "Jag köper kläder.",
  "ee": "I buy clothes.",
  "ch": 6,
  "lv": "A1",
  "wpm": 69.0
}, {
  "id": 1332,
  "sv": "spara",
  "en": "to save",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Vi sparar pengar.",
  "ee": "We save money.",
  "ch": 7,
  "lv": "A1",
  "wpm": 68.81
}, {
  "id": 1333,
  "sv": "styrelse",
  "en": "board",
  "t": "n",
  "g": "en",
  "es": "Styrelsen möts.",
  "ee": "The board meets.",
  "lv": "A1",
  "wpm": 68.79
}, {
  "id": 1334,
  "sv": "intervju",
  "en": "interview",
  "t": "n",
  "g": "en",
  "c": "(-n, -er, -erna)",
  "es": "Hon gör en intervju.",
  "ee": "She conducts an interview.",
  "ch": 10,
  "lv": "A1",
  "wpm": 68.72
}, {
  "id": 1335,
  "sv": "starkt",
  "en": "strong",
  "t": "a",
  "es": "Det är starkt kaffe.",
  "ee": "It is strong coffee.",
  "lv": "A1",
  "wpm": 68.69
}, {
  "id": 1336,
  "sv": "slutligen",
  "en": "finally",
  "t": "a",
  "es": "Slutligen tackar jag.",
  "ee": "Finally I thank you.",
  "lv": "A1",
  "wpm": 68.46
}, {
  "id": 1337,
  "sv": "bit",
  "en": "piece",
  "t": "n",
  "g": "en",
  "es": "Han äter en bit.",
  "ee": "He eats a piece.",
  "ch": 14,
  "lv": "A1",
  "wpm": 68.3
}, {
  "id": 1338,
  "sv": "muslimsk",
  "en": "Muslim",
  "t": "a",
  "es": "Det är en muslimsk tradition.",
  "ee": "It is a Muslim tradition.",
  "lv": "A1",
  "wpm": 68.24
}, {
  "id": 1339,
  "sv": "vetenskaplig",
  "en": "scientific",
  "t": "a",
  "es": "Det är en vetenskaplig studie.",
  "ee": "It is a scientific study.",
  "lv": "A1",
  "wpm": 68.23
}, {
  "id": 1340,
  "sv": "överens",
  "en": "in agreement",
  "t": "a",
  "es": "De är överens.",
  "ee": "They agree.",
  "lv": "A1",
  "wpm": 67.86
}, {
  "id": 1341,
  "sv": "framtida",
  "en": "future",
  "t": "a",
  "es": "Det är en framtida plan.",
  "ee": "It is a future plan.",
  "lv": "A1",
  "wpm": 67.84
}, {
  "id": 1342,
  "sv": "bevis",
  "en": "evidence",
  "t": "n",
  "g": "ett",
  "es": "Beviset presenteras.",
  "ee": "The evidence is presented.",
  "lv": "A1",
  "wpm": 67.69
}, {
  "id": 1343,
  "sv": "fast",
  "en": "although / fixed",
  "t": "a",
  "es": "Jag går fast det regnar.",
  "ee": "I go although it rains.",
  "lv": "A1",
  "wpm": 67.58
}, {
  "id": 1344,
  "sv": "sexuell",
  "en": "sexual",
  "t": "a",
  "es": "Det är en sexuell fråga.",
  "ee": "It is a sexual question.",
  "lv": "A1",
  "wpm": 67.49
}, {
  "id": 1345,
  "sv": "exakt",
  "en": "exact",
  "t": "a",
  "es": "Resultatet är exakt.",
  "ee": "The result is exact.",
  "lv": "A1",
  "wpm": 67.27
}, {
  "id": 1346,
  "sv": "arbetsmarknad",
  "en": "labor market",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Arbetsmarknaden förändras.",
  "ee": "The labor market changes.",
  "ch": 20,
  "lv": "A1",
  "wpm": 67.26
}, {
  "id": 1347,
  "sv": "underbar",
  "en": "wonderful",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Det är en underbar dag.",
  "ee": "It is a wonderful day.",
  "ch": 7,
  "lv": "A1",
  "wpm": 67.23
}, {
  "id": 1348,
  "sv": "post",
  "en": "post / position",
  "t": "n",
  "g": "en",
  "c": "(-en)",
  "es": "Han får en post.",
  "ee": "He gets a position.",
  "ch": 13,
  "lv": "A1",
  "wpm": 67.02
}, {
  "id": 1349,
  "sv": "extra",
  "en": "extra",
  "t": "a",
  "es": "Han arbetar extra.",
  "ee": "He works extra.",
  "lv": "A1",
  "wpm": 66.9
}, {
  "id": 1350,
  "sv": "offer",
  "en": "victim",
  "t": "n",
  "g": "ett",
  "lv": "A1",
  "wpm": 66.85
}, {
  "id": 1351,
  "sv": "sektor",
  "en": "sector",
  "t": "n",
  "g": "en",
  "es": "Sektorn växer.",
  "ee": "The sector grows.",
  "lv": "A1",
  "wpm": 66.75
}, {
  "id": 1352,
  "sv": "vinst",
  "en": "profit",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Företaget gör en vinst.",
  "ee": "The company makes a profit.",
  "ch": 20,
  "lv": "A1",
  "wpm": 66.65
}, {
  "id": 1353,
  "sv": "England",
  "en": "England",
  "t": "p",
  "es": "Han reser till England.",
  "ee": "He travels to England.",
  "ch": 1,
  "lv": "A1",
  "wpm": 66.6
}, {
  "id": 1354,
  "sv": "inflytande",
  "en": "influence",
  "t": "n",
  "g": "ett",
  "es": "Hon har inflytande.",
  "ee": "She has influence.",
  "lv": "A1",
  "wpm": 66.6
}, {
  "id": 1355,
  "sv": "budskap",
  "en": "message",
  "t": "n",
  "g": "ett",
  "es": "Han skickar ett budskap.",
  "ee": "He sends a message.",
  "lv": "A1",
  "wpm": 66.59
}, {
  "id": 1356,
  "sv": "klicka",
  "en": "to click",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Jag klickar på länken.",
  "ee": "I click the link.",
  "ch": 11,
  "lv": "A1",
  "wpm": 66.58
}, {
  "id": 1357,
  "sv": "tips",
  "en": "tip",
  "t": "n",
  "g": "ett",
  "c": "(-et, –, tipsen)",
  "es": "Han ger ett tips.",
  "ee": "He gives a tip.",
  "ch": 3,
  "lv": "A1",
  "wpm": 66.37
}, {
  "id": 1358,
  "sv": "världskrig",
  "en": "world war",
  "t": "n",
  "g": "ett",
  "es": "Världen minns ett världskrig.",
  "ee": "The world remembers a world war.",
  "lv": "A1",
  "wpm": 66.36
}, {
  "id": 1359,
  "sv": "med tanke på",
  "en": "considering",
  "t": "p",
  "es": "Med tanke på vädret stannar vi.",
  "ee": "Considering the weather we stay.",
  "lv": "A1",
  "wpm": 66.31
}, {
  "id": 1360,
  "sv": "självklar",
  "en": "self-evident",
  "t": "a",
  "es": "Det är en självklar sak.",
  "ee": "It is a self-evident thing.",
  "lv": "A1",
  "wpm": 66.24
}, {
  "id": 1361,
  "sv": "båt",
  "en": "boat",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "Båten ligger i hamnen.",
  "ee": "The boat lies in the harbor.",
  "ch": 8,
  "lv": "A1",
  "wpm": 66.17
}, {
  "id": 1362,
  "sv": "borta",
  "en": "away",
  "t": "a",
  "es": "Han är borta.",
  "ee": "He is away.",
  "ch": 13,
  "lv": "A1",
  "wpm": 66.14
}, {
  "id": 1363,
  "sv": "regional",
  "en": "regional",
  "t": "a",
  "es": "Det är en regional fråga.",
  "ee": "It is a regional issue.",
  "lv": "A1",
  "wpm": 66.06
}, {
  "id": 1364,
  "sv": "framåt",
  "en": "forward",
  "t": "a",
  "es": "Vi går framåt.",
  "ee": "We move forward.",
  "lv": "A1",
  "wpm": 66.04
}, {
  "id": 1365,
  "sv": "karaktär",
  "en": "character",
  "t": "n",
  "g": "en",
  "es": "Filmen har en karaktär.",
  "ee": "The film has a character.",
  "lv": "A1",
  "wpm": 66.0
}, {
  "id": 1366,
  "sv": "skiva",
  "en": "disc",
  "t": "n",
  "g": "en",
  "es": "Jag lyssnar på en skiva.",
  "ee": "I listen to a record.",
  "lv": "A1",
  "wpm": 66.0
}, {
  "id": 1367,
  "sv": "omkring",
  "en": "around",
  "t": "a",
  "es": "De går omkring.",
  "ee": "They walk around.",
  "lv": "A1",
  "wpm": 65.97
}, {
  "id": 1368,
  "sv": "ansikte",
  "en": "face",
  "t": "n",
  "g": "ett",
  "c": "(-et, -en, -na)",
  "es": "Jag ser ett ansikte.",
  "ee": "I see a face.",
  "ch": 7,
  "lv": "A1",
  "wpm": 65.96
}, {
  "id": 1369,
  "sv": "i början",
  "en": "in the beginning",
  "t": "p",
  "es": "I början är det svårt.",
  "ee": "In the beginning it is difficult.",
  "lv": "A1",
  "wpm": 65.88
}, {
  "id": 1370,
  "sv": "aktivitet",
  "en": "activity",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Vi planerar en aktivitet.",
  "ee": "We plan an activity.",
  "ch": 3,
  "lv": "A1",
  "wpm": 65.76
}, {
  "id": 1371,
  "sv": "ost",
  "en": "cheese",
  "t": "n",
  "g": "en",
  "es": "Jag äter ost.",
  "ee": "I eat cheese.",
  "lv": "A1",
  "wpm": 65.67
}, {
  "id": 1372,
  "sv": "fängelse",
  "en": "prison",
  "t": "n",
  "g": "ett",
  "c": "(-t, -r, -rna)",
  "es": "Han sitter i fängelse.",
  "ee": "He sits in prison.",
  "ch": 20,
  "lv": "A1",
  "wpm": 65.6
}, {
  "id": 1373,
  "sv": "motsvarande",
  "en": "corresponding",
  "t": "a",
  "es": "Det är motsvarande resultat.",
  "ee": "It is a corresponding result.",
  "lv": "A1",
  "wpm": 65.56
}, {
  "id": 1374,
  "sv": "synas",
  "en": "to be seen",
  "t": "v",
  "lv": "A1",
  "wpm": 65.54
}, {
  "id": 1375,
  "sv": "mor (el. moder, vardagl. morsa)",
  "en": "mother",
  "t": "n",
  "g": "en",
  "es": "Min mor arbetar.",
  "ee": "My mother works.",
  "lv": "A1",
  "wpm": 65.46
}, {
  "id": 1376,
  "sv": "an",
  "en": "on / toward",
  "t": "p",
  "es": "Han går an.",
  "ee": "It is acceptable.",
  "lv": "A1",
  "wpm": 65.44
}, {
  "id": 1377,
  "sv": "samman",
  "en": "together",
  "t": "p",
  "es": "Vi arbetar samman.",
  "ee": "We work together.",
  "lv": "A1",
  "wpm": 65.44
}, {
  "id": 1378,
  "sv": "ända",
  "en": "until",
  "t": "a",
  "es": "Vi väntar ända tills kväll.",
  "ee": "We wait until evening.",
  "lv": "A1",
  "wpm": 65.38
}, {
  "id": 1379,
  "sv": "ledamot",
  "en": "member",
  "t": "n",
  "g": "en",
  "es": "Ledamoten talar.",
  "ee": "The member speaks.",
  "lv": "A1",
  "wpm": 65.34
}, {
  "id": 1380,
  "sv": "i enlighet med",
  "en": "in accordance with",
  "t": "p",
  "es": "I enlighet med lagen gäller detta.",
  "ee": "In accordance with the law this applies.",
  "lv": "A1",
  "wpm": 65.2
}, {
  "id": 1381,
  "sv": "civil",
  "en": "civil",
  "t": "a",
  "es": "Det är en civil konflikt.",
  "ee": "It is a civil conflict.",
  "lv": "A1",
  "wpm": 65.17
}, {
  "id": 1382,
  "sv": "uppenbar",
  "en": "obvious",
  "t": "a",
  "es": "Felet är uppenbart.",
  "ee": "The mistake is obvious.",
  "lv": "A1",
  "wpm": 65.12
}, {
  "id": 1383,
  "sv": "skull",
  "en": "sake",
  "t": "n",
  "es": "Han gör det för din skull.",
  "ee": "He does it for your sake.",
  "lv": "A1",
  "wpm": 65.07
}, {
  "id": 1384,
  "sv": "arbetslöshet",
  "en": "unemployment",
  "t": "n",
  "g": "en",
  "c": "(-en)",
  "es": "Arbetslösheten minskar.",
  "ee": "Unemployment decreases.",
  "ch": 20,
  "lv": "A1",
  "wpm": 65.0
}, {
  "id": 1385,
  "sv": "fysisk",
  "en": "physical",
  "t": "a",
  "es": "Det kräver fysisk styrka.",
  "ee": "It requires physical strength.",
  "lv": "A1",
  "wpm": 64.96
}, {
  "id": 1386,
  "sv": "generation",
  "en": "generation",
  "t": "n",
  "g": "en",
  "es": "En ny generation växer.",
  "ee": "A new generation grows.",
  "lv": "A1",
  "wpm": 64.92
}, {
  "id": 1387,
  "sv": "återigen",
  "en": "again",
  "t": "a",
  "es": "Han försöker återigen.",
  "ee": "He tries again.",
  "lv": "A1",
  "wpm": 64.84
}, {
  "id": 1388,
  "sv": "djup",
  "en": "deep",
  "t": "a",
  "es": "Sjön är djup.",
  "ee": "The lake is deep.",
  "lv": "A1",
  "wpm": 64.61
}, {
  "id": 1389,
  "sv": "initiativ",
  "en": "initiative",
  "t": "n",
  "g": "ett",
  "es": "Hon tar ett initiativ.",
  "ee": "She takes an initiative.",
  "lv": "A1",
  "wpm": 64.56
}, {
  "id": 1390,
  "sv": "fastställa",
  "en": "to determine",
  "t": "v",
  "es": "De fastställer resultatet.",
  "ee": "They determine the result.",
  "lv": "A1",
  "wpm": 64.47
}, {
  "id": 1391,
  "sv": "parlament",
  "en": "parliament",
  "t": "n",
  "g": "ett",
  "c": "(-et, −, -en)",
  "es": "Parlamentet röstar.",
  "ee": "The parliament votes.",
  "ch": 10,
  "lv": "A1",
  "wpm": 64.38
}, {
  "id": 1392,
  "sv": "säsong",
  "en": "season",
  "t": "n",
  "g": "en",
  "es": "En ny säsong börjar.",
  "ee": "A new season begins.",
  "lv": "A1",
  "wpm": 64.38
}, {
  "id": 1393,
  "sv": "levande",
  "en": "alive",
  "t": "a",
  "es": "Fisken är levande.",
  "ee": "The fish is alive.",
  "lv": "A1",
  "wpm": 64.27
}, {
  "id": 1394,
  "sv": "tacka",
  "en": "to thank",
  "t": "v",
  "es": "Jag tackar dig.",
  "ee": "I thank you.",
  "lv": "A1",
  "wpm": 64.24
}, {
  "id": 1395,
  "sv": "hota",
  "en": "to threaten",
  "t": "v",
  "es": "Han hotar dem.",
  "ee": "He threatens them.",
  "lv": "A1",
  "wpm": 64.07
}, {
  "id": 1396,
  "sv": "tusentals",
  "en": "thousands",
  "t": "a",
  "es": "Tusentals människor samlas.",
  "ee": "Thousands of people gather.",
  "lv": "A1",
  "wpm": 64.02
}, {
  "id": 1397,
  "sv": "eventuell",
  "en": "possible / potential",
  "t": "a",
  "es": "Det finns en eventuell risk.",
  "ee": "There is a potential risk.",
  "lv": "A1",
  "wpm": 64.0
}, {
  "id": 1398,
  "sv": "pojke",
  "en": "boy",
  "t": "n",
  "g": "en",
  "c": "(-n, -ar, -arna)",
  "es": "Pojken leker.",
  "ee": "The boy plays.",
  "ch": 1,
  "lv": "A1",
  "wpm": 63.91
}, {
  "id": 1399,
  "sv": "version",
  "en": "version",
  "t": "n",
  "g": "en",
  "es": "Det finns en ny version.",
  "ee": "There is a new version.",
  "lv": "A1",
  "wpm": 63.9
}, {
  "id": 1400,
  "sv": "existera",
  "en": "to exist",
  "t": "v",
  "es": "Problemet existerar fortfarande.",
  "ee": "The problem still exists.",
  "lv": "A1",
  "wpm": 63.72
}, {
  "id": 1401,
  "sv": "trött",
  "en": "tired",
  "t": "a",
  "es": "Jag är trött.",
  "ee": "I am tired.",
  "ch": 2,
  "lv": "A1",
  "wpm": 63.63
}, {
  "id": 1402,
  "sv": "himmel",
  "en": "sky",
  "t": "n",
  "g": "en",
  "c": "(himlen)",
  "ch": 20,
  "lv": "A1",
  "wpm": 63.39
}, {
  "id": 1403,
  "sv": "reaktion",
  "en": "reaction",
  "t": "n",
  "g": "en",
  "es": "Hon visar en stark reaktion.",
  "ee": "She shows a strong reaction.",
  "lv": "A1",
  "wpm": 63.39
}, {
  "id": 1404,
  "sv": "dyr",
  "en": "expensive",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Bilen är dyr.",
  "ee": "The car is expensive.",
  "ch": 7,
  "lv": "A1",
  "wpm": 63.35
}, {
  "id": 1,
  "sv": "andra",
  "en": "second / other",
  "t": "n",
  "es": "Hon bor på andra våningen.",
  "ee": "She lives on the second floor.",
  "ch": 4,
  "lv": "A1"
}, {
  "id": 2,
  "sv": "arton",
  "en": "eighteen",
  "t": "n",
  "es": "Jag är arton år gammal.",
  "ee": "I am eighteen years old.",
  "lv": "A1"
}, {
  "id": 3,
  "sv": "bakre",
  "en": "rear / back",
  "t": "a",
  "es": "Den bakre dörren är stängd.",
  "ee": "The rear door is closed.",
  "ch": 3,
  "lv": "A1"
}, {
  "id": 4,
  "sv": "brunch",
  "en": "brunch",
  "t": "n",
  "g": "en",
  "es": "Vi äter brunch på söndag.",
  "ee": "We eat brunch on Sunday.",
  "lv": "A1"
}, {
  "id": 5,
  "sv": "decimeter",
  "en": "decimeter",
  "t": "n",
  "g": "en",
  "es": "Linjalen är tre decimeter lång.",
  "ee": "The ruler is three decimeters long.",
  "lv": "A1"
}, {
  "id": 6,
  "sv": "elva",
  "en": "eleven",
  "t": "n",
  "c": "(-n, -or, -orna)",
  "es": "Klockan är elva nu.",
  "ee": "It is eleven o’clock now.",
  "ch": 9,
  "lv": "A1"
}, {
  "id": 7,
  "sv": "ett",
  "en": "one",
  "t": "n",
  "es": "Jag har ett äpple.",
  "ee": "I have one apple.",
  "lv": "A1"
}, {
  "id": 8,
  "sv": "Europa",
  "en": "Europe",
  "t": "p",
  "es": "Sverige ligger i Europa.",
  "ee": "Sweden is in Europe.",
  "ch": 10,
  "lv": "A1"
}, {
  "id": 9,
  "sv": "fem",
  "en": "five",
  "t": "n",
  "es": "Vi är fem personer här.",
  "ee": "There are five people here.",
  "lv": "A1"
}, {
  "id": 10,
  "sv": "femte",
  "en": "fifth",
  "t": "n",
  "es": "Hon bor på femte våningen.",
  "ee": "She lives on the fifth floor.",
  "ch": 8,
  "lv": "A1"
}, {
  "id": 11,
  "sv": "femtio",
  "en": "fifty",
  "t": "n",
  "es": "Bussen kostar femtio kronor.",
  "ee": "The bus costs fifty kronor.",
  "ch": 7,
  "lv": "A1"
}, {
  "id": 12,
  "sv": "femton",
  "en": "fifteen",
  "t": "n",
  "es": "Jag är femton år gammal.",
  "ee": "I am fifteen years old.",
  "lv": "A1"
}, {
  "id": 13,
  "sv": "fjorton",
  "en": "fourteen",
  "t": "n",
  "es": "Hon är fjorton år.",
  "ee": "She is fourteen years old.",
  "lv": "A1"
}, {
  "id": 14,
  "sv": "fjärde",
  "en": "fourth",
  "t": "n",
  "es": "Han kom på fjärde plats.",
  "ee": "He came in fourth place.",
  "ch": 4,
  "lv": "A1"
}, {
  "id": 15,
  "sv": "främre",
  "en": "front",
  "t": "a",
  "es": "Den främre dörren är öppen.",
  "ee": "The front door is open.",
  "ch": 3,
  "lv": "A1"
}, {
  "id": 16,
  "sv": "fyra",
  "en": "four",
  "t": "n",
  "c": "(-n, -or, -orna)",
  "es": "Vi är fyra personer.",
  "ee": "There are four of us.",
  "ch": 9,
  "lv": "A1"
}, {
  "id": 17,
  "sv": "fyrtio",
  "en": "forty",
  "t": "n",
  "es": "Hon är fyrtio år gammal.",
  "ee": "She is forty years old.",
  "lv": "A1"
}, {
  "id": 18,
  "sv": "första",
  "en": "first",
  "t": "n",
  "es": "Detta är min första dag.",
  "ee": "This is my first day.",
  "ch": 4,
  "lv": "A1"
}, {
  "id": 19,
  "sv": "Grekland",
  "en": "Greece",
  "t": "p",
  "es": "De reser till Grekland i sommar.",
  "ee": "They travel to Greece in summer.",
  "ch": 16,
  "lv": "A1"
}, {
  "id": 20,
  "sv": "Göteborg",
  "en": "Gothenburg",
  "t": "p",
  "es": "Göteborg ligger på västkusten.",
  "ee": "Gothenburg is on the west coast.",
  "ch": 9,
  "lv": "A1"
}, {
  "id": 21,
  "sv": "hekto",
  "en": "hectogram",
  "t": "n",
  "g": "ett",
  "c": "(-t, −, -na)",
  "es": "Jag köper ett hekto ost.",
  "ee": "I buy one hectogram of cheese.",
  "ch": 4,
  "lv": "A1"
}, {
  "id": 23,
  "sv": "hundra",
  "en": "one hundred",
  "t": "n",
  "es": "Boken kostar hundra kronor.",
  "ee": "The book costs one hundred kronor.",
  "ch": 6,
  "lv": "A1"
}, {
  "id": 24,
  "sv": "hundratusen",
  "en": "one hundred thousand",
  "t": "n",
  "es": "Staden har hundratusen invånare.",
  "ee": "The city has one hundred thousand inhabitants.",
  "lv": "A1"
}, {
  "id": 25,
  "sv": "hörsel",
  "en": "hearing",
  "t": "n",
  "g": "en",
  "es": "Hennes hörsel är mycket bra.",
  "ee": "Her hearing is very good.",
  "lv": "A1"
}, {
  "id": 26,
  "sv": "inrikesminister",
  "en": "minister of the interior",
  "t": "n",
  "g": "en",
  "es": "Inrikesministern talar i TV.",
  "ee": "The interior minister speaks on TV.",
  "lv": "A1"
}, {
  "id": 27,
  "sv": "inrikespolitik",
  "en": "domestic politics",
  "t": "n",
  "g": "en",
  "es": "De diskuterar inrikespolitik.",
  "ee": "They discuss domestic politics.",
  "lv": "A1"
}, {
  "id": 28,
  "sv": "Italien",
  "en": "Italy",
  "t": "p",
  "es": "Vi åker till Italien på semester.",
  "ee": "We go to Italy on vacation.",
  "ch": 1,
  "lv": "A1"
}, {
  "id": 29,
  "sv": "Kina",
  "en": "China",
  "t": "p",
  "es": "Hon arbetar i Kina.",
  "ee": "She works in China.",
  "ch": 3,
  "lv": "A1"
}, {
  "id": 30,
  "sv": "kvällsmål",
  "en": "evening meal",
  "t": "n",
  "g": "ett",
  "es": "Vi äter ett kvällsmål tillsammans.",
  "ee": "We eat an evening meal together.",
  "lv": "A1"
}, {
  "id": 31,
  "sv": "känsel",
  "en": "touch",
  "t": "n",
  "g": "en",
  "es": "Hans känsel i handen är svag.",
  "ee": "His sense of touch in the hand is weak.",
  "lv": "A1"
}, {
  "id": 32,
  "sv": "mellanmål",
  "en": "snack",
  "t": "n",
  "g": "ett",
  "es": "Jag äter ett mellanmål på eftermiddagen.",
  "ee": "I eat a snack in the afternoon.",
  "lv": "A1"
}, {
  "id": 33,
  "sv": "miljard",
  "en": "billion",
  "t": "n",
  "es": "Företaget tjänar en miljard kronor.",
  "ee": "The company earns one billion kronor.",
  "lv": "A1"
}, {
  "id": 34,
  "sv": "miljon",
  "en": "million",
  "t": "n",
  "c": "(-en, -er, -erna)",
  "es": "Staden har en miljon invånare.",
  "ee": "The city has one million inhabitants.",
  "ch": 6,
  "lv": "A1"
}, {
  "id": 35,
  "sv": "milligram",
  "en": "milligram",
  "t": "n",
  "g": "ett",
  "es": "Medicinen innehåller ett milligram.",
  "ee": "The medicine contains one milligram.",
  "lv": "A1"
}, {
  "id": 36,
  "sv": "millimeter",
  "en": "Millimeter",
  "t": "n",
  "g": "en",
  "es": "Pappret är en millimeter tjockt.",
  "ee": "The paper is one millimeter thick.",
  "lv": "A1"
}, {
  "id": 37,
  "sv": "morbror",
  "en": "maternal uncle",
  "t": "n",
  "g": "en",
  "c": "(morbroder, morbröder, morbröderna)",
  "es": "Min morbror bor i Malmö.",
  "ee": "My maternal uncle lives in Malmö.",
  "ch": 6,
  "lv": "A1"
}, {
  "id": 38,
  "sv": "månadsskifte",
  "en": "turn of the month",
  "t": "n",
  "g": "ett",
  "es": "Betalningen sker vid månadsskiftet.",
  "ee": "The payment happens at the turn of the month.",
  "lv": "A1"
}, {
  "id": 39,
  "sv": "nia",
  "en": "nine (grade/number)",
  "t": "n",
  "g": "en",
  "c": "(-n, -or, -orna)",
  "es": "Hon fick en nia på provet.",
  "ee": "She got a nine on the test.",
  "ch": 9,
  "lv": "A1"
}, {
  "id": 40,
  "sv": "nio",
  "en": "nine",
  "t": "n",
  "es": "Klockan är nio.",
  "ee": "It is nine o’clock.",
  "lv": "A1"
}, {
  "id": 41,
  "sv": "nionde",
  "en": "ninth",
  "t": "n",
  "es": "Han bor på nionde våningen.",
  "ee": "He lives on the ninth floor.",
  "ch": 8,
  "lv": "A1"
}, {
  "id": 42,
  "sv": "nittio",
  "en": "ninety",
  "t": "n",
  "es": "Min farfar är nittio år.",
  "ee": "My grandfather is ninety years old.",
  "lv": "A1"
}, {
  "id": 43,
  "sv": "nitton",
  "en": "nineteen",
  "t": "n",
  "es": "Jag är nitton år.",
  "ee": "I am nineteen years old.",
  "ch": 5,
  "lv": "A1"
}, {
  "id": 44,
  "sv": "nordost",
  "en": "northeast",
  "t": "n",
  "es": "Staden ligger nordost om här.",
  "ee": "The city lies northeast of here.",
  "lv": "A1"
}, {
  "id": 45,
  "sv": "Norge",
  "en": "Norway",
  "t": "p",
  "es": "Norge ligger norr om Sverige.",
  "ee": "Norway lies north of Sweden.",
  "ch": 2,
  "lv": "A1"
}, {
  "id": 46,
  "sv": "pingst",
  "en": "Pentecost",
  "t": "n",
  "g": "en",
  "es": "Vi firar pingst i maj.",
  "ee": "We celebrate Pentecost in May.",
  "lv": "A1"
}, {
  "id": 47,
  "sv": "Polen",
  "en": "Poland",
  "t": "p",
  "es": "De kommer från Polen.",
  "ee": "They come from Poland.",
  "ch": 10,
  "lv": "A1"
}, {
  "id": 48,
  "sv": "Ryssland",
  "en": "Russia",
  "t": "p",
  "es": "Ryssland är ett stort land.",
  "ee": "Russia is a large country.",
  "ch": 10,
  "lv": "A1"
}, {
  "id": 49,
  "sv": "sex",
  "en": "six",
  "t": "n",
  "es": "Vi är sex personer här.",
  "ee": "There are six people here.",
  "lv": "A1"
}, {
  "id": 50,
  "sv": "sexa",
  "en": "six (grade/number)",
  "t": "n",
  "g": "en",
  "c": "(-n, or, sexorna)",
  "es": "Hon fick en sexa på provet.",
  "ee": "She got a six on the test.",
  "ch": 9,
  "lv": "A1"
}, {
  "id": 51,
  "sv": "sextio",
  "en": "sixty",
  "t": "n",
  "es": "Min far är sextio år.",
  "ee": "My father is sixty years old.",
  "lv": "A1"
}, {
  "id": 52,
  "sv": "sexton",
  "en": "sixteen",
  "t": "n",
  "es": "Hon är sexton år.",
  "ee": "She is sixteen years old.",
  "lv": "A1"
}, {
  "id": 53,
  "sv": "sju",
  "en": "seven",
  "t": "n",
  "es": "Klockan är sju.",
  "ee": "It is seven o’clock.",
  "lv": "A1"
}, {
  "id": 54,
  "sv": "sjua",
  "en": "seven (grade/number)",
  "t": "n",
  "g": "en",
  "c": "(-n, sjuor, -orna)",
  "es": "Han fick en sjua i betyg.",
  "ee": "He got a seven as a grade.",
  "ch": 9,
  "lv": "A1"
}, {
  "id": 55,
  "sv": "sjunde",
  "en": "seventh",
  "t": "n",
  "es": "Hon bor på sjunde våningen.",
  "ee": "She lives on the seventh floor.",
  "ch": 8,
  "lv": "A1"
}, {
  "id": 56,
  "sv": "sjuttio",
  "en": "seventy",
  "t": "n",
  "es": "Min farmor är sjuttio år.",
  "ee": "My grandmother is seventy years old.",
  "lv": "A1"
}, {
  "id": 57,
  "sv": "sjutton",
  "en": "seventeen",
  "t": "n",
  "es": "Jag är sjutton år.",
  "ee": "I am seventeen years old.",
  "ch": 6,
  "lv": "A1"
}, {
  "id": 58,
  "sv": "sjätte",
  "en": "sixth",
  "t": "n",
  "es": "Detta är sjätte gången.",
  "ee": "This is the sixth time.",
  "ch": 8,
  "lv": "A1"
}, {
  "id": 59,
  "sv": "Stockholm",
  "en": "Stockholm",
  "t": "p",
  "es": "Stockholm är Sveriges huvudstad.",
  "ee": "Stockholm is the capital of Sweden.",
  "lv": "A1"
}, {
  "id": 60,
  "sv": "storasyster",
  "en": "older sister",
  "t": "n",
  "g": "en",
  "es": "Min storasyster bor i Stockholm.",
  "ee": "My older sister lives in Stockholm.",
  "lv": "A1"
}, {
  "id": 61,
  "sv": "Storbritannien",
  "en": "United Kingdom",
  "t": "p",
  "es": "Hon arbetar i Storbritannien.",
  "ee": "She works in the United Kingdom.",
  "lv": "A1"
}, {
  "id": 62,
  "sv": "syd",
  "en": "south",
  "t": "n",
  "lv": "A1"
}, {
  "id": 63,
  "sv": "sydväst",
  "en": "southwest",
  "t": "n",
  "es": "Vi reser mot sydväst.",
  "ee": "We travel southwest.",
  "lv": "A1"
}, {
  "id": 64,
  "sv": "sydöst",
  "en": "southeast",
  "t": "n",
  "es": "Staden ligger sydöst om här.",
  "ee": "The city lies southeast of here.",
  "lv": "A1"
}, {
  "id": 65,
  "sv": "syssling",
  "en": "second cousin",
  "t": "n",
  "g": "en",
  "es": "Min syssling bor i Norge.",
  "ee": "My second cousin lives in Norway.",
  "lv": "A1"
}, {
  "id": 66,
  "sv": "tia",
  "en": "ten (grade/number)",
  "t": "n",
  "g": "en",
  "c": "(-n, -or, -orna)",
  "es": "Hon fick en tia på provet.",
  "ee": "She got a ten on the test.",
  "ch": 9,
  "lv": "A1"
}, {
  "id": 67,
  "sv": "tio",
  "en": "ten",
  "t": "n",
  "es": "Klockan är tio.",
  "ee": "It is ten o’clock.",
  "lv": "A1"
}, {
  "id": 68,
  "sv": "tionde",
  "en": "tenth",
  "t": "n",
  "es": "Han bor på tionde våningen.",
  "ee": "He lives on the tenth floor.",
  "ch": 8,
  "lv": "A1"
}, {
  "id": 69,
  "sv": "tiotusen",
  "en": "ten thousand",
  "t": "n",
  "es": "Staden har tiotusen invånare.",
  "ee": "The town has ten thousand inhabitants.",
  "lv": "A1"
}, {
  "id": 70,
  "sv": "tjugo",
  "en": "twenty",
  "t": "n",
  "es": "Jag är tjugo år.",
  "ee": "I am twenty years old.",
  "lv": "A1"
}, {
  "id": 71,
  "sv": "tolv",
  "en": "twelve",
  "t": "n",
  "es": "Klockan är tolv.",
  "ee": "It is twelve o’clock.",
  "lv": "A1"
}, {
  "id": 72,
  "sv": "tre",
  "en": "three",
  "t": "n",
  "es": "Vi är tre personer.",
  "ee": "There are three of us.",
  "ch": 1,
  "lv": "A1"
}, {
  "id": 73,
  "sv": "tredje",
  "en": "third",
  "t": "n",
  "es": "Detta är tredje gången.",
  "ee": "This is the third time.",
  "ch": 4,
  "lv": "A1"
}, {
  "id": 74,
  "sv": "trettio",
  "en": "thirty",
  "t": "n",
  "es": "Hon är trettio år.",
  "ee": "She is thirty years old.",
  "lv": "A1"
}, {
  "id": 75,
  "sv": "tretton",
  "en": "thirteen",
  "t": "n",
  "es": "Han är tretton år.",
  "ee": "He is thirteen years old.",
  "lv": "A1"
}, {
  "id": 76,
  "sv": "tusen",
  "en": "thousand",
  "t": "n",
  "es": "Boken kostar tusen kronor.",
  "ee": "The book costs one thousand kronor.",
  "ch": 7,
  "lv": "A1"
}, {
  "id": 77,
  "sv": "två",
  "en": "two",
  "t": "n",
  "es": "Jag har två bröder.",
  "ee": "I have two brothers.",
  "ch": 1,
  "lv": "A1"
}, {
  "id": 78,
  "sv": "utbildningsminister",
  "en": "minister of education",
  "t": "n",
  "g": "en",
  "es": "Utbildningsministern talar i TV.",
  "ee": "The minister of education speaks on TV.",
  "lv": "A1"
}, {
  "id": 79,
  "sv": "veckodag",
  "en": "weekday",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "Idag är en vanlig veckodag.",
  "ee": "Today is a normal weekday.",
  "ch": 5,
  "lv": "A1"
}, {
  "id": 80,
  "sv": "åtta",
  "en": "eight (grade/number)",
  "t": "n",
  "g": "en",
  "es": "Hon fick en åtta på provet.",
  "ee": "She got an eight on the test.",
  "lv": "A1"
}, {
  "id": 81,
  "sv": "åtta",
  "en": "eight (grade/number)",
  "t": "n",
  "c": "(-n, -or, -orna)",
  "es": "Hon fick en åtta på provet.",
  "ee": "She got an eight on the test.",
  "ch": 9,
  "lv": "A1"
}, {
  "id": 82,
  "sv": "åttio",
  "en": "eighty",
  "t": "n",
  "es": "Min morfar är åttio år.",
  "ee": "My grandfather is eighty years old.",
  "lv": "A1"
}, {
  "id": 83,
  "sv": "åttonde",
  "en": "eighth",
  "t": "n",
  "es": "Han bor på åttonde våningen.",
  "ee": "He lives on the eighth floor.",
  "ch": 8,
  "lv": "A1"
}, {
  "id": 84,
  "sv": "änkeman",
  "en": "widower",
  "t": "n",
  "g": "en",
  "es": "Min granne är änkeman.",
  "ee": "My neighbor is a widower.",
  "lv": "A1"
}, {
  "id": 85,
  "sv": "änkling",
  "en": "widower (alt.)",
  "t": "n",
  "g": "en",
  "es": "Han blev änkling förra året.",
  "ee": "He became a widower last year.",
  "lv": "A1"
}, {
  "id": 86,
  "sv": "ögonlock",
  "en": "eyelid",
  "t": "n",
  "g": "ett",
  "es": "Hans ögonlock är stängt.",
  "ee": "His eyelid is closed.",
  "lv": "A1"
}, {
  "id": 1407,
  "sv": "kurs",
  "en": "course",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Kursen börjar idag.",
  "ee": "The course begins today.",
  "ch": 1,
  "lv": "A2",
  "wpm": 63.24
}, {
  "id": 1413,
  "sv": "upplevelse",
  "en": "experience",
  "t": "n",
  "g": "en",
  "c": "(-n, -r, -rna)",
  "es": "Upplevelsen minns.",
  "ee": "The experience is remembered.",
  "ch": 19,
  "lv": "A2",
  "wpm": 62.97
}, {
  "id": 1414,
  "sv": "riktning",
  "en": "direction",
  "t": "n",
  "g": "en",
  "es": "Riktningen ändras.",
  "ee": "The direction changes.",
  "lv": "A2",
  "wpm": 62.93
}, {
  "id": 1415,
  "sv": "vetenskap",
  "en": "science",
  "t": "n",
  "g": "en",
  "es": "Vetenskapen avancerar.",
  "ee": "Science advances.",
  "lv": "A2",
  "wpm": 62.83
}, {
  "id": 1417,
  "sv": "handel",
  "en": "trade",
  "t": "n",
  "g": "en",
  "es": "Handeln ökar.",
  "ee": "Trade increases.",
  "lv": "A2",
  "wpm": 62.81
}, {
  "id": 1430,
  "sv": "direkt",
  "en": "directly",
  "t": "a",
  "es": "Vi går direkt hem.",
  "ee": "We go directly home.",
  "ch": 3,
  "lv": "A2",
  "wpm": 62.17
}, {
  "id": 1436,
  "sv": "rubrik",
  "en": "title",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Rubriken syns.",
  "ee": "The title is visible.",
  "ch": 18,
  "lv": "A2",
  "wpm": 61.88
}, {
  "id": 1447,
  "sv": "luft",
  "en": "air",
  "t": "n",
  "g": "en",
  "c": "(-en)",
  "es": "Luften är ren.",
  "ee": "The air is clean.",
  "ch": 10,
  "lv": "A2",
  "wpm": 61.33
}, {
  "id": 1448,
  "sv": "industri",
  "en": "industry",
  "t": "n",
  "g": "en",
  "c": "(-n, -er, -erna)",
  "es": "Industrin växer.",
  "ee": "Industry grows.",
  "ch": 10,
  "lv": "A2",
  "wpm": 61.23
}, {
  "id": 1449,
  "sv": "tåg",
  "en": "train",
  "t": "n",
  "g": "ett",
  "es": "Tåget går.",
  "ee": "The train departs.",
  "lv": "A2",
  "wpm": 61.07
}, {
  "id": 1450,
  "sv": "skada",
  "en": "to harm / injure",
  "t": "v",
  "es": "Han skadar sig lätt.",
  "ee": "He injures himself easily.",
  "lv": "A2",
  "wpm": 61.02
}, {
  "id": 1454,
  "sv": "förhandling",
  "en": "negotiation",
  "t": "n",
  "g": "en",
  "es": "Förhandlingen börjar.",
  "ee": "The negotiation begins.",
  "lv": "A2",
  "wpm": 60.69
}, {
  "id": 1469,
  "sv": "kommunikation",
  "en": "communication",
  "t": "n",
  "g": "en",
  "es": "Kommunikationen fungerar.",
  "ee": "Communication works.",
  "lv": "A2",
  "wpm": 59.79
}, {
  "id": 1472,
  "sv": "patient",
  "en": "patient",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Patienten väntar.",
  "ee": "The patient waits.",
  "ch": 19,
  "lv": "A2",
  "wpm": 59.58
}, {
  "id": 1475,
  "sv": "hälsa",
  "en": "health",
  "t": "n",
  "g": "en",
  "es": "Hälsan förbättras.",
  "ee": "Health improves.",
  "lv": "A2",
  "wpm": 59.45
}, {
  "id": 1477,
  "sv": "centrum",
  "en": "center",
  "t": "n",
  "g": "ett",
  "es": "Centrum är livligt.",
  "ee": "The center is lively.",
  "lv": "A2",
  "wpm": 59.43
}, {
  "id": 1482,
  "sv": "bord",
  "en": "table",
  "t": "n",
  "g": "ett",
  "es": "Boken ligger på bordet.",
  "ee": "The book lies on the table.",
  "lv": "A2",
  "wpm": 59.07
}, {
  "id": 1490,
  "sv": "publik",
  "en": "audience",
  "t": "n",
  "g": "en",
  "c": "(-en)",
  "es": "Publiken applåderar.",
  "ee": "The audience applauds.",
  "ch": 20,
  "lv": "A2",
  "wpm": 58.71
}, {
  "id": 1502,
  "sv": "utmaning",
  "en": "challenge",
  "t": "n",
  "g": "en",
  "es": "Utmaningen accepteras.",
  "ee": "The challenge is accepted.",
  "lv": "A2",
  "wpm": 58.16
}, {
  "id": 1503,
  "sv": "hopp",
  "en": "hope",
  "t": "n",
  "g": "ett",
  "es": "Hoppet finns.",
  "ee": "Hope exists.",
  "lv": "A2",
  "wpm": 58.14
}, {
  "id": 1505,
  "sv": "dröm",
  "en": "dream",
  "t": "n",
  "g": "en",
  "c": "(-men, -mar, -marna)",
  "es": "Drömmen fortsätter.",
  "ee": "The dream continues.",
  "ch": 11,
  "lv": "A2",
  "wpm": 58.07
}, {
  "id": 1532,
  "sv": "investering",
  "en": "investment",
  "t": "n",
  "g": "en",
  "es": "Investeringen ger resultat.",
  "ee": "The investment yields results.",
  "lv": "A2",
  "wpm": 57.01
}, {
  "id": 1534,
  "sv": "försäljning",
  "en": "sale",
  "t": "n",
  "g": "en",
  "es": "Försäljningen ökar.",
  "ee": "Sales increase.",
  "lv": "A2",
  "wpm": 56.93
}, {
  "id": 1546,
  "sv": "omkring",
  "en": "around",
  "t": "p",
  "es": "De går omkring.",
  "ee": "They walk around.",
  "lv": "A2",
  "wpm": 56.37
}, {
  "id": 1554,
  "sv": "minister",
  "en": "minister",
  "t": "n",
  "g": "en",
  "es": "Ministern talar.",
  "ee": "The minister speaks.",
  "lv": "A2",
  "wpm": 55.85
}, {
  "id": 1560,
  "sv": "nätverk",
  "en": "network",
  "t": "n",
  "g": "ett",
  "es": "Nätverket växer.",
  "ee": "The network grows.",
  "lv": "A2",
  "wpm": 55.73
}, {
  "id": 1561,
  "sv": "scen",
  "en": "stage",
  "t": "n",
  "g": "en",
  "es": "Scenen är ljus.",
  "ee": "The stage is bright.",
  "lv": "A2",
  "wpm": 55.67
}, {
  "id": 1585,
  "sv": "klimat",
  "en": "climate",
  "t": "n",
  "g": "ett",
  "c": "(-et, −, -en)",
  "es": "Klimatet förändras.",
  "ee": "The climate changes.",
  "ch": 12,
  "lv": "A2",
  "wpm": 54.24
}, {
  "id": 1586,
  "sv": "var",
  "en": "where",
  "t": "p",
  "es": "Var bor du?",
  "ee": "Where do you live?",
  "ch": 1,
  "lv": "A2",
  "wpm": 54.15
}, {
  "id": 1609,
  "sv": "dokument",
  "en": "document",
  "t": "n",
  "g": "ett",
  "c": "(-et, −, -en)",
  "es": "Dokumentet skrivs.",
  "ee": "The document is written.",
  "ch": 11,
  "lv": "A2",
  "wpm": 53.17
}, {
  "id": 1613,
  "sv": "middag",
  "en": "dinner",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "De lagar middag.",
  "ee": "They cook dinner.",
  "ch": 3,
  "lv": "A2",
  "wpm": 53.1
}, {
  "id": 1618,
  "sv": "fast",
  "en": "although / fixed",
  "t": "s",
  "es": "Jag går fast det regnar.",
  "ee": "I go although it rains.",
  "lv": "A2",
  "wpm": 53.01
}, {
  "id": 1623,
  "sv": "professor",
  "en": "professor",
  "t": "n",
  "g": "en",
  "es": "Professorn föreläser.",
  "ee": "The professor lectures.",
  "lv": "A2",
  "wpm": 52.61
}, {
  "id": 1632,
  "sv": "buss",
  "en": "bus",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "Bussen kommer.",
  "ee": "The bus arrives.",
  "ch": 3,
  "lv": "A2",
  "wpm": 52.35
}, {
  "id": 1637,
  "sv": "plan",
  "en": "level / court (surface)",
  "t": "n",
  "g": "ett",
  "es": "De spelar på planen.",
  "ee": "They play on the court.",
  "lv": "A2",
  "wpm": 52.0
}, {
  "id": 1638,
  "sv": "stil",
  "en": "style",
  "t": "n",
  "g": "en",
  "es": "Stilen är enkel.",
  "ee": "The style is simple.",
  "lv": "A2",
  "wpm": 51.78
}, {
  "id": 1643,
  "sv": "berg",
  "en": "mountain",
  "t": "n",
  "g": "ett",
  "c": "(-et, −, -en)",
  "es": "Berget är högt.",
  "ee": "The mountain is high.",
  "ch": 10,
  "lv": "A2",
  "wpm": 51.57
}, {
  "id": 1649,
  "sv": "träning",
  "en": "training",
  "t": "n",
  "g": "en",
  "es": "Träningen börjar.",
  "ee": "The training begins.",
  "lv": "A2",
  "wpm": 51.25
}, {
  "id": 1663,
  "sv": "sjukhus",
  "en": "hospital",
  "t": "n",
  "g": "ett",
  "es": "Sjukhuset öppnar.",
  "ee": "The hospital opens.",
  "lv": "A2",
  "wpm": 50.51
}, {
  "id": 1675,
  "sv": "dialog",
  "en": "dialogue",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Dialogen fortsätter.",
  "ee": "The dialogue continues.",
  "ch": 1,
  "lv": "A2",
  "wpm": 50.17
}, {
  "id": 1677,
  "sv": "vägg",
  "en": "wall",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "Väggen är vit.",
  "ee": "The wall is white.",
  "ch": 17,
  "lv": "A2",
  "wpm": 50.14
}, {
  "id": 1690,
  "sv": "kollega",
  "en": "colleague",
  "t": "n",
  "g": "en",
  "c": "(-n, -or, -orna)",
  "es": "Kollegan hjälper.",
  "ee": "The colleague helps.",
  "ch": 5,
  "lv": "A2",
  "wpm": 49.68
}, {
  "id": 1696,
  "sv": "meddelande",
  "en": "message",
  "t": "n",
  "g": "ett",
  "c": "(-n, −, -na)",
  "es": "Meddelandet skickas.",
  "ee": "The message is sent.",
  "ch": 11,
  "lv": "A2",
  "wpm": 49.48
}, {
  "id": 1705,
  "sv": "telefon",
  "en": "telephone",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Telefonen ringer.",
  "ee": "The phone rings.",
  "ch": 2,
  "lv": "A2",
  "wpm": 48.95
}, {
  "id": 1707,
  "sv": "slut",
  "en": "end",
  "t": "p",
  "es": "Filmen har ett slut.",
  "ee": "The film has an end.",
  "lv": "A2",
  "wpm": 48.93
}, {
  "id": 1724,
  "sv": "väder",
  "en": "weather",
  "t": "n",
  "g": "ett",
  "c": "(vädret, väder, vädren)",
  "ch": 8,
  "lv": "A2",
  "wpm": 48.25
}, {
  "id": 1730,
  "sv": "trafik",
  "en": "traffic",
  "t": "n",
  "g": "en",
  "c": "(-en)",
  "es": "Trafiken ökar.",
  "ee": "Traffic increases.",
  "ch": 9,
  "lv": "A2",
  "wpm": 48.01
}, {
  "id": 1734,
  "sv": "bröd",
  "en": "bread",
  "t": "n",
  "g": "ett",
  "c": "(-et, −, -en)",
  "es": "Jag köper bröd.",
  "ee": "I buy bread.",
  "ch": 4,
  "lv": "A2",
  "wpm": 47.92
}, {
  "id": 1737,
  "sv": "butik",
  "en": "store",
  "t": "n",
  "g": "en",
  "es": "Butiken öppnar.",
  "ee": "The store opens.",
  "lv": "A2",
  "wpm": 47.83
}, {
  "id": 1744,
  "sv": "vänster",
  "en": "left",
  "t": "n",
  "es": "Han svänger vänster.",
  "ee": "He turns left.",
  "lv": "A2",
  "wpm": 47.58
}, {
  "id": 1757,
  "sv": "opposition",
  "en": "opposition",
  "t": "n",
  "g": "en",
  "es": "Oppositionen kritiserar.",
  "ee": "The opposition criticizes.",
  "lv": "A2",
  "wpm": 47.11
}, {
  "id": 1760,
  "sv": "visa",
  "en": "song / ballad",
  "t": "n",
  "g": "en",
  "c": "(-r, -de, -t)",
  "es": "Han sjunger en visa.",
  "ee": "He sings a ballad.",
  "ch": 2,
  "lv": "A2",
  "wpm": 46.94
}, {
  "id": 1764,
  "sv": "tack",
  "en": "thanks",
  "t": "n",
  "g": "ett",
  "es": "Tack för hjälpen.",
  "ee": "Thanks for the help.",
  "ch": 2,
  "lv": "A2",
  "wpm": 46.74
}, {
  "id": 1773,
  "sv": "vad",
  "en": "what",
  "t": "a",
  "es": "Vad gör du?",
  "ee": "What are you doing?",
  "ch": 1,
  "lv": "A2",
  "wpm": 46.51
}, {
  "id": 1787,
  "sv": "kommitté",
  "en": "committee",
  "t": "n",
  "g": "en",
  "es": "Kommittén möts.",
  "ee": "The committee meets.",
  "lv": "A2",
  "wpm": 46.0
}, {
  "id": 1797,
  "sv": "kvar",
  "en": "remaining",
  "t": "a",
  "es": "Han är kvar här.",
  "ee": "He remains here.",
  "ch": 14,
  "lv": "A2",
  "wpm": 45.69
}, {
  "id": 1799,
  "sv": "tak",
  "en": "ceiling",
  "t": "n",
  "g": "ett",
  "es": "Taket är högt.",
  "ee": "The ceiling is high.",
  "lv": "A2",
  "wpm": 45.67
}, {
  "id": 1802,
  "sv": "överenskommelse",
  "en": "agreement",
  "t": "n",
  "g": "en",
  "es": "Överenskommelsen nås.",
  "ee": "The agreement is reached.",
  "lv": "A2",
  "wpm": 45.61
}, {
  "id": 1803,
  "sv": "kampanj",
  "en": "campaign",
  "t": "n",
  "g": "en",
  "es": "Kampanjen börjar.",
  "ee": "The campaign begins.",
  "lv": "A2",
  "wpm": 45.59
}, {
  "id": 1806,
  "sv": "budget",
  "en": "budget",
  "t": "n",
  "g": "en",
  "es": "Budgeten är klar.",
  "ee": "The budget is ready.",
  "lv": "A2",
  "wpm": 45.56
}, {
  "id": 1812,
  "sv": "verktyg",
  "en": "tool",
  "t": "n",
  "g": "ett",
  "es": "Verktyget ligger här.",
  "ee": "The tool lies here.",
  "lv": "A2",
  "wpm": 45.4
}, {
  "id": 1814,
  "sv": "betyg",
  "en": "rating",
  "t": "n",
  "g": "ett",
  "c": "(-et, −, -en)",
  "es": "Betyget är högt.",
  "ee": "The rating is high.",
  "ch": 16,
  "lv": "A2",
  "wpm": 45.28
}, {
  "id": 1821,
  "sv": "vinter",
  "en": "winter",
  "t": "n",
  "g": "en",
  "c": "(-n, vintrar, vintrarna)",
  "es": "Vintern är kall.",
  "ee": "Winter is cold.",
  "ch": 5,
  "lv": "A2",
  "wpm": 44.95
}, {
  "id": 1823,
  "sv": "skyldighet",
  "en": "duty",
  "t": "n",
  "g": "en",
  "es": "Skyldigheten uppfylls.",
  "ee": "The duty is fulfilled.",
  "lv": "A2",
  "wpm": 44.81
}, {
  "id": 1831,
  "sv": "för",
  "en": "because",
  "t": "c",
  "es": "Jag stannar hemma, för jag är sjuk.",
  "ee": "I'm staying home, because I'm sick.",
  "lv": "A2",
  "wpm": 44.36
}, {
  "id": 1835,
  "sv": "yta",
  "en": "surface",
  "t": "n",
  "g": "en",
  "es": "Ytan är slät.",
  "ee": "The surface is smooth.",
  "lv": "A2",
  "wpm": 44.18
}, {
  "id": 1845,
  "sv": "konferens",
  "en": "conference",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Konferensen öppnar.",
  "ee": "The conference opens.",
  "ch": 3,
  "lv": "A2",
  "wpm": 43.68
}, {
  "id": 1847,
  "sv": "runt",
  "en": "around",
  "t": "a",
  "es": "Vi går runt sjön.",
  "ee": "We walk around the lake.",
  "lv": "A2",
  "wpm": 43.65
}, {
  "id": 1850,
  "sv": "kanal",
  "en": "channel",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Kanalen sänder.",
  "ee": "The channel broadcasts.",
  "ch": 9,
  "lv": "A2",
  "wpm": 43.59
}, {
  "id": 1863,
  "sv": "vind",
  "en": "wind",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "Vinden blåser.",
  "ee": "The wind blows.",
  "ch": 15,
  "lv": "A2",
  "wpm": 43.29
}, {
  "id": 1865,
  "sv": "mitt",
  "en": "my / mine",
  "t": "n",
  "g": "en",
  "es": "Det är mitt hus.",
  "ee": "It is my house.",
  "ch": 6,
  "lv": "A2",
  "wpm": 43.27
}, {
  "id": 1881,
  "sv": "kort",
  "en": "card / photo",
  "t": "n",
  "g": "ett",
  "es": "Jag har ett foto på kortet.",
  "ee": "I have a photo on the card.",
  "lv": "A2",
  "wpm": 43.02
}, {
  "id": 1885,
  "sv": "fönster",
  "en": "window",
  "t": "n",
  "g": "ett",
  "c": "(fönstret, −, fönstren)",
  "es": "Fönstret är stängt.",
  "ee": "The window is closed.",
  "ch": 17,
  "lv": "A2",
  "wpm": 42.75
}, {
  "id": 1888,
  "sv": "ljud",
  "en": "sound",
  "t": "n",
  "g": "ett",
  "c": "(-et, –, -en)",
  "es": "Ljudet ökar.",
  "ee": "The sound increases.",
  "ch": 3,
  "lv": "A2",
  "wpm": 42.67
}, {
  "id": 1892,
  "sv": "fara",
  "en": "danger",
  "t": "n",
  "g": "en",
  "es": "Faran är över.",
  "ee": "The danger is over.",
  "lv": "A2",
  "wpm": 42.39
}, {
  "id": 1898,
  "sv": "riktlinje",
  "en": "guideline",
  "t": "n",
  "g": "en",
  "es": "Riktlinjen gäller.",
  "ee": "The guideline applies.",
  "lv": "A2",
  "wpm": 42.17
}, {
  "id": 1908,
  "sv": "dess",
  "en": "its",
  "t": "a",
  "es": "Katten rör dess svans.",
  "ee": "The cat moves its tail.",
  "lv": "A2",
  "wpm": 41.98
}, {
  "id": 1919,
  "sv": "snö",
  "en": "snow",
  "t": "n",
  "g": "en",
  "es": "Snön ligger kvar.",
  "ee": "The snow remains.",
  "lv": "A2",
  "wpm": 41.31
}, {
  "id": 1932,
  "sv": "oavsett",
  "en": "regardless",
  "t": "a",
  "es": "Oavsett väder går vi.",
  "ee": "Regardless of the weather we go.",
  "lv": "A2",
  "wpm": 40.87
}, {
  "id": 1940,
  "sv": "sjö",
  "en": "lake",
  "t": "n",
  "g": "en",
  "c": "(-n, -ar, -arna)",
  "es": "Sjön fryser.",
  "ee": "The lake freezes.",
  "ch": 10,
  "lv": "A2",
  "wpm": 40.7
}, {
  "id": 1944,
  "sv": "kaffe",
  "en": "coffee",
  "t": "n",
  "g": "ett",
  "c": "(-et)",
  "es": "Jag dricker kaffe.",
  "ee": "I drink coffee.",
  "ch": 1,
  "lv": "A2",
  "wpm": 40.67
}, {
  "id": 1974,
  "sv": "extra",
  "en": "extra",
  "t": "a",
  "es": "Han arbetar extra.",
  "ee": "He works extra.",
  "ch": 1,
  "lv": "A2",
  "wpm": 39.67
}, {
  "id": 1976,
  "sv": "lokal",
  "en": "local",
  "t": "n",
  "g": "en",
  "es": "Det är en lokal fråga.",
  "ee": "It is a local question.",
  "lv": "A2",
  "wpm": 39.58
}, {
  "id": 1983,
  "sv": "restaurang",
  "en": "restaurant",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Vi äter på restaurang.",
  "ee": "We eat at a restaurant.",
  "ch": 1,
  "lv": "A2",
  "wpm": 39.29
}, {
  "id": 1987,
  "sv": "kamera",
  "en": "camera",
  "t": "n",
  "g": "en",
  "es": "Kameran startar.",
  "ee": "The camera starts.",
  "lv": "A2",
  "wpm": 39.24
}, {
  "id": 1991,
  "sv": "ända (el. ände)",
  "en": "until",
  "t": "n",
  "g": "en",
  "es": "Vi väntar ända tills kväll.",
  "ee": "We wait until evening.",
  "lv": "A2",
  "wpm": 39.0
}, {
  "id": 1993,
  "sv": "strand",
  "en": "beach",
  "t": "n",
  "g": "en",
  "c": "(-en, stränder, stränderna)",
  "es": "Stranden är lång.",
  "ee": "The beach is long.",
  "ch": 15,
  "lv": "A2",
  "wpm": 38.97
}, {
  "id": 1994,
  "sv": "pension",
  "en": "pension",
  "t": "n",
  "g": "en",
  "es": "Pensionen betalas.",
  "ee": "The pension is paid.",
  "lv": "A2",
  "wpm": 38.96
}, {
  "id": 1995,
  "sv": "hem",
  "en": "home",
  "t": "a",
  "es": "Huset är ett hem.",
  "ee": "The house is a home.",
  "ch": 3,
  "lv": "A2",
  "wpm": 38.95
}, {
  "id": 2000,
  "sv": "medicin",
  "en": "medicine",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Medicinen fungerar.",
  "ee": "The medicine works.",
  "ch": 6,
  "lv": "A2",
  "wpm": 38.84
}, {
  "id": 2001,
  "sv": "sport",
  "en": "sport",
  "t": "n",
  "g": "en",
  "es": "Sporten engagerar.",
  "ee": "Sport engages.",
  "ch": 7,
  "lv": "A2",
  "wpm": 38.76
}, {
  "id": 2006,
  "sv": "ifrån",
  "en": "from",
  "t": "a",
  "es": "Jag kommer ifrån Sverige.",
  "ee": "I come from Sweden.",
  "lv": "A2",
  "wpm": 38.64
}, {
  "id": 2013,
  "sv": "köp",
  "en": "purchase",
  "t": "n",
  "g": "ett",
  "c": "(-et, −, -en)",
  "es": "Köpet var dyrt.",
  "ee": "The purchase was expensive.",
  "ch": 7,
  "lv": "A2",
  "wpm": 38.33
}, {
  "id": 2026,
  "sv": "fest",
  "en": "party",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Festen startar.",
  "ee": "The party starts.",
  "ch": 2,
  "lv": "A2",
  "wpm": 38.12
}, {
  "id": 2044,
  "sv": "trend",
  "en": "trend",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Trenden fortsätter.",
  "ee": "The trend continues.",
  "ch": 12,
  "lv": "A2",
  "wpm": 37.69
}, {
  "id": 2054,
  "sv": "demonstration",
  "en": "demonstration",
  "t": "n",
  "g": "en",
  "es": "Demonstrationen börjar.",
  "ee": "The demonstration begins.",
  "lv": "A2",
  "wpm": 37.37
}, {
  "id": 2057,
  "sv": "kandidat",
  "en": "candidate",
  "t": "n",
  "g": "en",
  "es": "Kandidaten talar.",
  "ee": "The candidate speaks.",
  "lv": "A2",
  "wpm": 37.23
}, {
  "id": 2064,
  "sv": "genomförande",
  "en": "implementation",
  "t": "n",
  "g": "ett",
  "es": "Genomförandet börjar.",
  "ee": "The implementation begins.",
  "lv": "A2",
  "wpm": 37.04
}, {
  "id": 2067,
  "sv": "föreställning",
  "en": "performance",
  "t": "n",
  "g": "en",
  "es": "Föreställningen börjar.",
  "ee": "The performance begins.",
  "lv": "A2",
  "wpm": 36.97
}, {
  "id": 2068,
  "sv": "än",
  "en": "than",
  "t": "s",
  "es": "Hon är äldre än jag.",
  "ee": "She is older than I am.",
  "ch": 12,
  "lv": "A2",
  "wpm": 36.96
}, {
  "id": 2074,
  "sv": "gäst",
  "en": "guest",
  "t": "n",
  "g": "en",
  "es": "Gästen anländer.",
  "ee": "The guest arrives.",
  "lv": "A2",
  "wpm": 36.85
}, {
  "id": 2079,
  "sv": "kort",
  "en": "short",
  "t": "a",
  "c": "(-et, -, -en)",
  "es": "Mötet är kort.",
  "ee": "The meeting is short.",
  "ch": 4,
  "lv": "A2",
  "wpm": 36.7
}, {
  "id": 2081,
  "sv": "lära",
  "en": "teaching / doctrine",
  "t": "n",
  "g": "en",
  "c": "(lär, lärde, lärt)",
  "ch": 11,
  "lv": "A2",
  "wpm": 36.63,
  "es": "Han följer en gammal lära.",
  "ee": "He follows an old teaching."
}, {
  "id": 2096,
  "sv": "över",
  "en": "over / above",
  "t": "a",
  "es": "Fågeln flyger över huset.",
  "ee": "The bird flies over the house.",
  "ch": 3,
  "lv": "A2",
  "wpm": 36.31
}, {
  "id": 2101,
  "sv": "fil",
  "en": "file",
  "t": "n",
  "g": "en",
  "c": "(-en)",
  "es": "Filen sparas.",
  "ee": "The file is saved.",
  "ch": 4,
  "lv": "A2",
  "wpm": 36.17
}, {
  "id": 2103,
  "sv": "hemma",
  "en": "at home",
  "t": "p",
  "es": "Jag är hemma.",
  "ee": "I am at home.",
  "ch": 2,
  "lv": "A2",
  "wpm": 36.09
}, {
  "id": 2116,
  "sv": "räkning",
  "en": "bill",
  "t": "n",
  "g": "en",
  "es": "Räkningen kommer.",
  "ee": "The bill arrives.",
  "lv": "A2",
  "wpm": 35.61
}, {
  "id": 2124,
  "sv": "bibliotek",
  "en": "library",
  "t": "n",
  "g": "ett",
  "c": "(-et, en, -ena)",
  "es": "Biblioteket är tyst.",
  "ee": "The library is quiet.",
  "ch": 5,
  "lv": "A2",
  "wpm": 35.39
}, {
  "id": 2140,
  "sv": "balans",
  "en": "balance",
  "t": "n",
  "g": "en",
  "c": "(-en)",
  "es": "Balansen hålls.",
  "ee": "Balance is maintained.",
  "ch": 20,
  "lv": "A2",
  "wpm": 35.09
}, {
  "id": 2145,
  "sv": "lunch",
  "en": "lunch",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Vi äter lunch.",
  "ee": "We eat lunch.",
  "ch": 3,
  "lv": "A2",
  "wpm": 34.98
}, {
  "id": 2147,
  "sv": "militär",
  "en": "serviceman / soldier",
  "t": "n",
  "g": "en",
  "es": "Han är en militär.",
  "ee": "He is a serviceman.",
  "lv": "A2",
  "wpm": 34.9
}, {
  "id": 2150,
  "sv": "alternativ",
  "en": "alternative",
  "t": "a",
  "c": "(-et, –, -en)",
  "es": "Det finns ett alternativ.",
  "ee": "There is an alternative.",
  "ch": 1,
  "lv": "A2",
  "wpm": 34.82
}, {
  "id": 2152,
  "sv": "hälsa",
  "en": "to greet",
  "t": "v",
  "c": "(-r, -de, -t)",
  "es": "Jag hälsar på min granne.",
  "ee": "I greet my neighbor.",
  "ch": 2,
  "lv": "A2",
  "wpm": 34.8
}, {
  "id": 2157,
  "sv": "protest",
  "en": "protest",
  "t": "n",
  "g": "en",
  "es": "Protesten sprids.",
  "ee": "The protest spreads.",
  "lv": "A2",
  "wpm": 34.62
}, {
  "id": 2158,
  "sv": "test",
  "en": "test",
  "t": "n",
  "g": "en",
  "es": "Vi skriver ett test.",
  "ee": "We write a test.",
  "lv": "A2",
  "wpm": 34.62
}, {
  "id": 2171,
  "sv": "flod",
  "en": "river",
  "t": "n",
  "g": "en",
  "c": "(-en, floder, floderna)",
  "es": "Floden rinner.",
  "ee": "The river flows.",
  "ch": 10,
  "lv": "A2",
  "wpm": 34.29
}, {
  "id": 2173,
  "sv": "mörker",
  "en": "darkness",
  "t": "n",
  "g": "ett",
  "c": "(mörkret)",
  "es": "Mörkret faller.",
  "ee": "Darkness falls.",
  "ch": 15,
  "lv": "A2",
  "wpm": 34.28
}, {
  "id": 2174,
  "sv": "begränsning",
  "en": "limitation",
  "t": "n",
  "g": "en",
  "es": "Begränsningen märks.",
  "ee": "The limitation appears.",
  "lv": "A2",
  "wpm": 34.27
}, {
  "id": 2177,
  "sv": "minoritet",
  "en": "minority",
  "t": "n",
  "g": "en",
  "es": "Minoriteten protesterar.",
  "ee": "The minority protests.",
  "lv": "A2",
  "wpm": 34.2
}, {
  "id": 2198,
  "sv": "mönster",
  "en": "pattern",
  "t": "n",
  "g": "ett",
  "es": "Mönstret upprepas.",
  "ee": "The pattern repeats.",
  "lv": "A2",
  "wpm": 33.72
}, {
  "id": 2246,
  "sv": "standard",
  "en": "standard",
  "t": "n",
  "g": "en",
  "es": "Standarden gäller.",
  "ee": "The standard applies.",
  "lv": "A2",
  "wpm": 32.74
}, {
  "id": 2247,
  "sv": "olycka",
  "en": "accident",
  "t": "n",
  "g": "en",
  "c": "(-n, -or, -orna)",
  "es": "Olyckan rapporteras.",
  "ee": "The accident is reported.",
  "ch": 20,
  "lv": "A2",
  "wpm": 32.73
}, {
  "id": 2249,
  "sv": "maskin",
  "en": "machine",
  "t": "n",
  "g": "en",
  "es": "Maskinen startar.",
  "ee": "The machine starts.",
  "lv": "A2",
  "wpm": 32.7
}, {
  "id": 2250,
  "sv": "transport",
  "en": "transport",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Transporten fungerar.",
  "ee": "Transport works.",
  "ch": 9,
  "lv": "A2",
  "wpm": 32.7
}, {
  "id": 2256,
  "sv": "golv",
  "en": "floor",
  "t": "n",
  "g": "ett",
  "c": "(-et, −, -en)",
  "es": "Golvet är rent.",
  "ee": "The floor is clean.",
  "ch": 17,
  "lv": "A2",
  "wpm": 32.64
}, {
  "id": 2261,
  "sv": "semester",
  "en": "vacation",
  "t": "n",
  "g": "en",
  "c": "(-n, -rar, -rarna)",
  "es": "Semestern börjar.",
  "ee": "The vacation begins.",
  "ch": 5,
  "lv": "A2",
  "wpm": 32.51
}, {
  "id": 2264,
  "sv": "tysk",
  "en": "German",
  "t": "n",
  "g": "en",
  "c": "(-t, -a)",
  "es": "Han är tysk.",
  "ee": "He is German.",
  "ch": 5,
  "lv": "A2",
  "wpm": 32.38
}, {
  "id": 2276,
  "sv": "beräkning",
  "en": "calculation",
  "t": "n",
  "g": "en",
  "es": "Beräkningen görs.",
  "ee": "The calculation is made.",
  "lv": "A2",
  "wpm": 31.99
}, {
  "id": 2285,
  "sv": "domare",
  "en": "judge",
  "t": "n",
  "g": "en",
  "es": "Domaren dömer.",
  "ee": "The judge rules.",
  "lv": "A2",
  "wpm": 31.82
}, {
  "id": 2287,
  "sv": "signal",
  "en": "signal",
  "t": "n",
  "g": "en",
  "es": "Signalen ges.",
  "ee": "The signal is given.",
  "lv": "A2",
  "wpm": 31.8
}, {
  "id": 2292,
  "sv": "rättegång",
  "en": "trial",
  "t": "n",
  "g": "en",
  "es": "Rättegången börjar.",
  "ee": "The trial begins.",
  "lv": "A2",
  "wpm": 31.75
}, {
  "id": 2298,
  "sv": "försäkring",
  "en": "insurance",
  "t": "n",
  "g": "en",
  "es": "Försäkringen gäller.",
  "ee": "The insurance applies.",
  "lv": "A2",
  "wpm": 31.67
}, {
  "id": 2311,
  "sv": "utrustning",
  "en": "equipment",
  "t": "n",
  "g": "en",
  "es": "Utrustningen används.",
  "ee": "The equipment is used.",
  "lv": "A2",
  "wpm": 31.48
}, {
  "id": 2315,
  "sv": "kök",
  "en": "kitchen",
  "t": "n",
  "g": "ett",
  "c": "(-et, −, -en)",
  "es": "Köket är nytt.",
  "ee": "The kitchen is new.",
  "ch": 11,
  "lv": "A2",
  "wpm": 31.43
}, {
  "id": 2317,
  "sv": "visst",
  "en": "certainly",
  "t": "i",
  "es": "Visst är det sant.",
  "ee": "Certainly it is true.",
  "lv": "A2",
  "wpm": 31.4
}, {
  "id": 2328,
  "sv": "symbol",
  "en": "symbol",
  "t": "n",
  "g": "en",
  "es": "Symbolen betyder något.",
  "ee": "The symbol means something.",
  "lv": "A2",
  "wpm": 31.17
}, {
  "id": 2344,
  "sv": "förbättring",
  "en": "improvement",
  "t": "n",
  "g": "en",
  "es": "Förbättringen syns.",
  "ee": "The improvement is visible.",
  "lv": "A2",
  "wpm": 30.87
}, {
  "id": 2362,
  "sv": "omröstning",
  "en": "vote",
  "t": "n",
  "g": "en",
  "es": "Omröstningen avslutas.",
  "ee": "The vote concludes.",
  "lv": "A2",
  "wpm": 30.56
}, {
  "id": 2367,
  "sv": "stopp",
  "en": "stop",
  "t": "n",
  "g": "ett",
  "c": "(-et, −, -en)",
  "es": "Stoppet är kort.",
  "ee": "The stop is short.",
  "ch": 18,
  "lv": "A2",
  "wpm": 30.49
}, {
  "id": 2374,
  "sv": "bort",
  "en": "away",
  "t": "a",
  "es": "Han går bort.",
  "ee": "He goes away.",
  "ch": 13,
  "lv": "A2",
  "wpm": 30.4
}, {
  "id": 2385,
  "sv": "utvärdering",
  "en": "evaluation",
  "t": "n",
  "g": "en",
  "es": "Utvärderingen görs.",
  "ee": "The evaluation is done.",
  "lv": "A2",
  "wpm": 30.3
}, {
  "id": 2388,
  "sv": "seminarium",
  "en": "seminar",
  "t": "n",
  "g": "ett",
  "c": "(seminariet, seminarier, seminarierna)",
  "es": "Seminariet startar.",
  "ee": "The seminar starts.",
  "ch": 16,
  "lv": "A2",
  "wpm": 30.27
}, {
  "id": 2401,
  "sv": "adress",
  "en": "address",
  "t": "n",
  "g": "en",
  "es": "Adressen ändras.",
  "ee": "The address changes.",
  "lv": "A2",
  "wpm": 29.89
}, {
  "id": 2406,
  "sv": "kontrakt",
  "en": "contract",
  "t": "n",
  "g": "ett",
  "es": "Kontraktet skrivs.",
  "ee": "The contract is signed.",
  "lv": "A2",
  "wpm": 29.78
}, {
  "id": 2410,
  "sv": "röstning",
  "en": "voting",
  "t": "n",
  "g": "en",
  "es": "Röstningen sker.",
  "ee": "The voting takes place.",
  "lv": "A2",
  "wpm": 29.75
}, {
  "id": 2425,
  "sv": "smak",
  "en": "taste",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Smaken är god.",
  "ee": "The taste is good.",
  "ch": 12,
  "lv": "A2",
  "wpm": 29.35
}, {
  "id": 2426,
  "sv": "order",
  "en": "order",
  "t": "n",
  "g": "en",
  "es": "Ordern skickas.",
  "ee": "The order is sent.",
  "lv": "A2",
  "wpm": 29.34
}, {
  "id": 2430,
  "sv": "absolut",
  "en": "absolutely",
  "t": "a",
  "es": "Ja absolut.",
  "ee": "Yes absolutely.",
  "ch": 2,
  "lv": "A2",
  "wpm": 29.29
}, {
  "id": 2463,
  "sv": "recension",
  "en": "review",
  "t": "n",
  "g": "en",
  "es": "Recensionen publiceras.",
  "ee": "The review is published.",
  "lv": "A2",
  "wpm": 28.65
}, {
  "id": 2464,
  "sv": "till",
  "en": "to",
  "t": "a",
  "es": "Vi går till skolan.",
  "ee": "We go to school.",
  "ch": 1,
  "lv": "A2",
  "wpm": 28.65
}, {
  "id": 2469,
  "sv": "förbindelse",
  "en": "connection",
  "t": "n",
  "g": "en",
  "es": "Förbindelsen etableras.",
  "ee": "The connection is established.",
  "lv": "A2",
  "wpm": 28.54
}, {
  "id": 2474,
  "sv": "cykel",
  "en": "bicycle",
  "t": "n",
  "g": "en",
  "es": "Cykeln är snabb.",
  "ee": "The bicycle is fast.",
  "lv": "A2",
  "wpm": 28.46
}, {
  "id": 2475,
  "sv": "design",
  "en": "design",
  "t": "n",
  "g": "en",
  "c": "(-en)",
  "es": "Designen är modern.",
  "ee": "The design is modern.",
  "ch": 1,
  "lv": "A2",
  "wpm": 28.45
}, {
  "id": 2499,
  "sv": "planering",
  "en": "planning",
  "t": "n",
  "g": "en",
  "es": "Planeringen börjar.",
  "ee": "Planning begins.",
  "lv": "A2",
  "wpm": 28.05
}, {
  "id": 2516,
  "sv": "frukost",
  "en": "breakfast",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "Jag äter frukost.",
  "ee": "I eat breakfast.",
  "ch": 3,
  "lv": "A2",
  "wpm": 27.59
}, {
  "id": 2519,
  "sv": "prognos",
  "en": "forecast",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Prognosen publiceras.",
  "ee": "The forecast is published.",
  "ch": 9,
  "lv": "A2",
  "wpm": 27.55
}, {
  "id": 2521,
  "sv": "advokat",
  "en": "lawyer",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Advokaten försvarar.",
  "ee": "The lawyer defends.",
  "ch": 1,
  "lv": "A2",
  "wpm": 27.53
}, {
  "id": 2525,
  "sv": "regn",
  "en": "rain",
  "t": "n",
  "g": "ett",
  "c": "(-et, −, -en)",
  "es": "Regnet faller.",
  "ee": "The rain falls.",
  "ch": 8,
  "lv": "A2",
  "wpm": 27.44
}, {
  "id": 2529,
  "sv": "fabrik",
  "en": "factory",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Fabriken producerar.",
  "ee": "The factory produces.",
  "ch": 6,
  "lv": "A2",
  "wpm": 27.37
}, {
  "id": 2607,
  "sv": "moderat",
  "en": "moderate",
  "t": "a",
  "es": "Han är moderat.",
  "ee": "He is a moderate.",
  "lv": "A2",
  "wpm": 26.38
}, {
  "id": 2608,
  "sv": "data",
  "en": "data",
  "t": "n",
  "es": "Data analyseras.",
  "ee": "Data are analyzed.",
  "lv": "A2",
  "wpm": 26.32
}, {
  "id": 2617,
  "sv": "regelverk",
  "en": "regulation set",
  "t": "n",
  "g": "ett",
  "es": "Regelverket följs.",
  "ee": "The regulations are followed.",
  "lv": "A2",
  "wpm": 26.23
}, {
  "id": 2619,
  "sv": "vittne",
  "en": "witness",
  "t": "n",
  "g": "ett",
  "es": "Vittnet talar.",
  "ee": "The witness speaks.",
  "lv": "A2",
  "wpm": 26.21
}, {
  "id": 2620,
  "sv": "ljus",
  "en": "light",
  "t": "a",
  "c": "(-t, -a)",
  "es": "Ljuset tänds.",
  "ee": "The light turns on.",
  "ch": 7,
  "lv": "A2",
  "wpm": 26.17
}, {
  "id": 2659,
  "sv": "konto",
  "en": "account",
  "t": "n",
  "g": "ett",
  "c": "(-t, -n, -na)",
  "es": "Jag öppnar konto.",
  "ee": "I open an account.",
  "ch": 20,
  "lv": "A2",
  "wpm": 25.67
}, {
  "id": 2660,
  "sv": "ju",
  "en": "after all / you know",
  "t": "c",
  "es": "Det är ju sant.",
  "ee": "It is true after all.",
  "lv": "A2",
  "wpm": 25.65
}, {
  "id": 2666,
  "sv": "paket",
  "en": "package",
  "t": "n",
  "g": "ett",
  "c": "(-et, –, -en)",
  "es": "Paketet levereras.",
  "ee": "The package is delivered.",
  "ch": 2,
  "lv": "A2",
  "wpm": 25.51
}, {
  "id": 2678,
  "sv": "bro",
  "en": "bridge",
  "t": "n",
  "g": "en",
  "c": "(-n, -ar, -arna)",
  "es": "Bron är gammal.",
  "ee": "The bridge is old.",
  "ch": 9,
  "lv": "A2",
  "wpm": 25.37
}, {
  "id": 2688,
  "sv": "tystnad",
  "en": "silence",
  "t": "n",
  "g": "en",
  "es": "Tystnaden varar.",
  "ee": "The silence lasts.",
  "lv": "A2",
  "wpm": 25.3
}, {
  "id": 2695,
  "sv": "flygplan",
  "en": "airplane",
  "t": "n",
  "g": "ett",
  "es": "Flygplanet lyfter.",
  "ee": "The airplane takes off.",
  "lv": "A2",
  "wpm": 25.2
}, {
  "id": 2739,
  "sv": "flyg",
  "en": "flight",
  "t": "n",
  "g": "ett",
  "c": "(-et, −, -en)",
  "es": "Flyget landar.",
  "ee": "The flight lands.",
  "ch": 9,
  "lv": "A2",
  "wpm": 24.66
}, {
  "id": 2789,
  "sv": "opinion",
  "en": "opinion",
  "t": "n",
  "g": "en",
  "es": "Opinionen förändras.",
  "ee": "The opinion changes.",
  "lv": "A2",
  "wpm": 23.75
}, {
  "id": 2795,
  "sv": "vidare",
  "en": "further",
  "t": "a",
  "es": "Vi går vidare.",
  "ee": "We go further.",
  "lv": "A2",
  "wpm": 23.71
}, {
  "id": 2814,
  "sv": "agenda",
  "en": "agenda",
  "t": "n",
  "g": "en",
  "es": "Agendan godkänns.",
  "ee": "The agenda is approved.",
  "lv": "B1",
  "wpm": 23.43
}, {
  "id": 2838,
  "sv": "resolution",
  "en": "resolution",
  "t": "n",
  "g": "en",
  "es": "Resolutionen antas.",
  "ee": "The resolution is adopted.",
  "lv": "B1",
  "wpm": 23.04
}, {
  "id": 2855,
  "sv": "lektion",
  "en": "lesson",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Lektionen är lång.",
  "ee": "The lesson is long.",
  "ch": 15,
  "lv": "B1",
  "wpm": 22.89
}, {
  "id": 2860,
  "sv": "teater",
  "en": "theater",
  "t": "n",
  "g": "en",
  "c": "(-n, teatrar, teatrarna)",
  "es": "Teatern öppnar.",
  "ee": "The theater opens.",
  "ch": 5,
  "lv": "B1",
  "wpm": 22.82
}, {
  "id": 2889,
  "sv": "potential",
  "en": "potential",
  "t": "n",
  "g": "en",
  "es": "Potentialen är stor.",
  "ee": "The potential is large.",
  "lv": "B1",
  "wpm": 22.48
}, {
  "id": 2892,
  "sv": "biljett",
  "en": "ticket",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Biljetten kontrolleras.",
  "ee": "The ticket is checked.",
  "ch": 5,
  "lv": "B1",
  "wpm": 22.43
}, {
  "id": 2926,
  "sv": "ton",
  "en": "tone",
  "t": "n",
  "g": "ett",
  "es": "Tonen är vänlig.",
  "ee": "The tone is friendly.",
  "lv": "B1",
  "wpm": 22.11
}, {
  "id": 2929,
  "sv": "station",
  "en": "station",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Vi möts på stationen.",
  "ee": "We meet at the station.",
  "ch": 9,
  "lv": "B1",
  "wpm": 22.08
}, {
  "id": 2935,
  "sv": "brand",
  "en": "fire",
  "t": "n",
  "g": "en",
  "es": "Branden släcks.",
  "ee": "The fire is extinguished.",
  "lv": "B1",
  "wpm": 21.99
}, {
  "id": 2941,
  "sv": "motor",
  "en": "engine",
  "t": "n",
  "g": "en",
  "es": "Motoren startar.",
  "ee": "The engine starts.",
  "lv": "B1",
  "wpm": 21.82
}, {
  "id": 2945,
  "sv": "äventyr",
  "en": "adventure",
  "t": "n",
  "g": "ett",
  "es": "Äventyret börjar.",
  "ee": "The adventure begins.",
  "lv": "B1",
  "wpm": 21.8
}, {
  "id": 2950,
  "sv": "paragraf",
  "en": "paragraph",
  "t": "n",
  "g": "en",
  "es": "Paragrafen citeras.",
  "ee": "The paragraph is cited.",
  "lv": "B1",
  "wpm": 21.73
}, {
  "id": 2970,
  "sv": "lager",
  "en": "storage",
  "t": "n",
  "g": "ett",
  "c": "(lagret, −, lagren)",
  "ch": 15,
  "lv": "B1",
  "wpm": 21.45
}, {
  "id": 2979,
  "sv": "hastighet",
  "en": "speed",
  "t": "n",
  "g": "en",
  "es": "Hastigheten ökar.",
  "ee": "The speed increases.",
  "lv": "B1",
  "wpm": 21.38
}, {
  "id": 3010,
  "sv": "mätning",
  "en": "measurement",
  "t": "n",
  "g": "en",
  "es": "Mätningen upprepas.",
  "ee": "The measurement is repeated.",
  "lv": "B1",
  "wpm": 21.02
}, {
  "id": 3024,
  "sv": "föreläsning",
  "en": "lecture",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "Föreläsningen börjar.",
  "ee": "The lecture begins.",
  "ch": 9,
  "lv": "B1",
  "wpm": 20.77
}, {
  "id": 3032,
  "sv": "tills",
  "en": "until",
  "t": "p",
  "es": "Vi väntar tills imorgon.",
  "ee": "We wait until tomorrow.",
  "lv": "B1",
  "wpm": 20.69
}, {
  "id": 3044,
  "sv": "inne",
  "en": "inside",
  "t": "p",
  "es": "Han är inne.",
  "ee": "He is inside.",
  "ch": 11,
  "lv": "B1",
  "wpm": 20.48
}, {
  "id": 3066,
  "sv": "djup",
  "en": "depth",
  "t": "n",
  "g": "ett",
  "es": "Sjöns djup är okänt.",
  "ee": "The lake's depth is unknown.",
  "lv": "B1",
  "wpm": 20.27
}, {
  "id": 3101,
  "sv": "sömn",
  "en": "sleep",
  "t": "n",
  "g": "en",
  "es": "Sömnen förbättras.",
  "ee": "Sleep improves.",
  "lv": "B1",
  "wpm": 19.96
}, {
  "id": 3112,
  "sv": "experiment",
  "en": "experiment",
  "t": "n",
  "g": "ett",
  "c": "(-et, −, -en)",
  "es": "Experimentet lyckas.",
  "ee": "The experiment succeeds.",
  "ch": 5,
  "lv": "B1",
  "wpm": 19.82
}, {
  "id": 3131,
  "sv": "exakt",
  "en": "exact",
  "t": "a",
  "c": "(-a)",
  "es": "Resultatet är exakt.",
  "ee": "The result is exact.",
  "ch": 10,
  "lv": "B1",
  "wpm": 19.65
}, {
  "id": 3168,
  "sv": "presentation",
  "en": "presentation",
  "t": "n",
  "g": "en",
  "es": "Presentationen visas.",
  "ee": "The presentation is shown.",
  "lv": "B1",
  "wpm": 19.28
}, {
  "id": 3169,
  "sv": "stress",
  "en": "stress",
  "t": "n",
  "g": "en",
  "c": "(-en)",
  "es": "Stress minskar.",
  "ee": "Stress decreases.",
  "ch": 19,
  "lv": "B1",
  "wpm": 19.27
}, {
  "id": 3178,
  "sv": "valrörelse",
  "en": "election campaign",
  "t": "n",
  "g": "en",
  "es": "Valrörelsen börjar.",
  "ee": "The election campaign begins.",
  "lv": "B1",
  "wpm": 19.2
}, {
  "id": 3219,
  "sv": "godkännande",
  "en": "approval",
  "t": "n",
  "g": "ett",
  "es": "Godkännandet ges.",
  "ee": "Approval is granted.",
  "lv": "B1",
  "wpm": 18.8
}, {
  "id": 3224,
  "sv": "stycke",
  "en": "paragraph",
  "t": "n",
  "g": "ett",
  "es": "Stycket skrivs.",
  "ee": "The paragraph is written.",
  "lv": "B1",
  "wpm": 18.73
}, {
  "id": 3227,
  "sv": "kant",
  "en": "edge",
  "t": "n",
  "g": "en",
  "es": "Kanten är skarp.",
  "ee": "The edge is sharp.",
  "lv": "B1",
  "wpm": 18.68
}, {
  "id": 3250,
  "sv": "studio",
  "en": "studio",
  "t": "n",
  "g": "en",
  "c": "(-n, -r, -rna)",
  "es": "Studion är redo.",
  "ee": "The studio is ready.",
  "ch": 3,
  "lv": "B1",
  "wpm": 18.46
}, {
  "id": 3258,
  "sv": "reportage",
  "en": "reportage",
  "t": "n",
  "g": "ett",
  "es": "Reportaget visas.",
  "ee": "The report is shown.",
  "lv": "B1",
  "wpm": 18.34
}, {
  "id": 3269,
  "sv": "vid",
  "en": "wide",
  "t": "a",
  "es": "Floden är vid.",
  "ee": "The river is wide.",
  "ch": 3,
  "lv": "B1",
  "wpm": 18.24
}, {
  "id": 3305,
  "sv": "vis",
  "en": "way",
  "t": "a",
  "es": "På detta vis fungerar det.",
  "ee": "In this way it works.",
  "lv": "B1",
  "wpm": 17.93
}, {
  "id": 3310,
  "sv": "bokstav",
  "en": "letter",
  "t": "n",
  "g": "en",
  "c": "(-en, bokstäver, bokstäverna)",
  "es": "Bokstaven skrivs.",
  "ee": "The letter is written.",
  "ch": 4,
  "lv": "B1",
  "wpm": 17.89
}, {
  "id": 3316,
  "sv": "test",
  "en": "test",
  "t": "n",
  "g": "ett",
  "es": "Vi skriver ett test.",
  "ee": "We write a test.",
  "lv": "B1",
  "wpm": 17.8
}, {
  "id": 3348,
  "sv": "skratt",
  "en": "laughter",
  "t": "n",
  "g": "ett",
  "es": "Skrattet sprider sig.",
  "ee": "The laughter spreads.",
  "lv": "B1",
  "wpm": 17.58
}, {
  "id": 3358,
  "sv": "leverantör",
  "en": "supplier",
  "t": "n",
  "g": "en",
  "es": "Leverantören levererar.",
  "ee": "The supplier delivers.",
  "lv": "B1",
  "wpm": 17.46
}, {
  "id": 3374,
  "sv": "innan",
  "en": "before",
  "t": "p",
  "es": "Vi äter innan filmen.",
  "ee": "We eat before the movie.",
  "lv": "B1",
  "wpm": 17.32
}, {
  "id": 3386,
  "sv": "innovation",
  "en": "innovation",
  "t": "n",
  "g": "en",
  "es": "Innovationen sprids.",
  "ee": "The innovation spreads.",
  "lv": "B1",
  "wpm": 17.23
}, {
  "id": 3388,
  "sv": "uppföljning",
  "en": "follow-up",
  "t": "n",
  "g": "en",
  "es": "Uppföljningen görs.",
  "ee": "The follow-up is done.",
  "lv": "B1",
  "wpm": 17.21
}, {
  "id": 3392,
  "sv": "innan",
  "en": "before",
  "t": "a",
  "es": "Vi äter innan filmen.",
  "ee": "We eat before the movie.",
  "lv": "B1",
  "wpm": 17.15
}, {
  "id": 3416,
  "sv": "mobil",
  "en": "mobile (movable)",
  "t": "a",
  "es": "Det är en mobil enhet.",
  "ee": "It's a mobile unit.",
  "lv": "B1",
  "wpm": 16.93
}, {
  "id": 3418,
  "sv": "ett",
  "en": "one",
  "t": "p",
  "es": "Jag har ett äpple.",
  "ee": "I have one apple.",
  "ch": 1,
  "lv": "B1",
  "wpm": 16.92
}, {
  "id": 3421,
  "sv": "rösträtt",
  "en": "voting right",
  "t": "n",
  "g": "en",
  "es": "Rösträtten skyddas.",
  "ee": "Voting rights are protected.",
  "lv": "B1",
  "wpm": 16.89
}, {
  "id": 3428,
  "sv": "livsstil",
  "en": "lifestyle",
  "t": "n",
  "g": "en",
  "es": "Livsstilen ändras.",
  "ee": "Lifestyle changes.",
  "lv": "B1",
  "wpm": 16.85
}, {
  "id": 3450,
  "sv": "mjölk",
  "en": "milk",
  "t": "n",
  "g": "en",
  "c": "(-en)",
  "es": "Barnet dricker mjölk.",
  "ee": "The child drinks milk.",
  "ch": 4,
  "lv": "B1",
  "wpm": 16.68
}, {
  "id": 3451,
  "sv": "policy",
  "en": "policy",
  "t": "n",
  "g": "en",
  "es": "Policyn uppdateras.",
  "ee": "The policy is updated.",
  "lv": "B1",
  "wpm": 16.68
}, {
  "id": 3464,
  "sv": "inspelning",
  "en": "recording",
  "t": "n",
  "g": "en",
  "es": "Inspelningen börjar.",
  "ee": "The recording begins.",
  "lv": "B1",
  "wpm": 16.53
}, {
  "id": 3492,
  "sv": "delegation",
  "en": "delegation",
  "t": "n",
  "g": "en",
  "es": "Delegationen reser.",
  "ee": "The delegation travels.",
  "lv": "B1",
  "wpm": 16.19
}, {
  "id": 3516,
  "sv": "entreprenör",
  "en": "entrepreneur",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Entreprenören startar företag.",
  "ee": "The entrepreneur starts a company.",
  "ch": 18,
  "lv": "B1",
  "wpm": 15.98
}, {
  "id": 3563,
  "sv": "rapportering",
  "en": "reporting",
  "t": "n",
  "g": "en",
  "es": "Rapporteringen sker.",
  "ee": "The reporting occurs.",
  "lv": "B1",
  "wpm": 15.6
}, {
  "id": 3594,
  "sv": "passagerare",
  "en": "passenger",
  "t": "n",
  "g": "en",
  "es": "Passageraren väntar.",
  "ee": "The passenger waits.",
  "lv": "B1",
  "wpm": 15.38
}, {
  "id": 3632,
  "sv": "teknologi",
  "en": "technology",
  "t": "n",
  "g": "en",
  "es": "Teknologin utvecklas.",
  "ee": "The technology develops.",
  "lv": "B1",
  "wpm": 15.17
}, {
  "id": 3652,
  "sv": "handlingsplan",
  "en": "action plan",
  "t": "n",
  "g": "en",
  "es": "Handlingsplanen skrivs.",
  "ee": "The action plan is written.",
  "lv": "B1",
  "wpm": 15.09
}, {
  "id": 3687,
  "sv": "ton",
  "en": "ton (metric weight)",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Bilen väger ett ton.",
  "ee": "The car weighs a ton.",
  "ch": 2,
  "lv": "B1",
  "wpm": 14.81
}, {
  "id": 3711,
  "sv": "upptäckt",
  "en": "discovery",
  "t": "n",
  "g": "en",
  "es": "Upptäckten publiceras.",
  "ee": "The discovery is published.",
  "lv": "B1",
  "wpm": 14.72
}, {
  "id": 3745,
  "sv": "marknadsekonomi",
  "en": "market economy",
  "t": "n",
  "g": "en",
  "es": "Marknadsekonomin förändras.",
  "ee": "The market economy changes.",
  "lv": "B1",
  "wpm": 14.46
}, {
  "id": 3782,
  "sv": "lista",
  "en": "list",
  "t": "v",
  "c": "(-n, -or, -orna)",
  "es": "Jag gör en lista.",
  "ee": "I make a list.",
  "ch": 2,
  "lv": "B1",
  "wpm": 14.2
}, {
  "id": 3799,
  "sv": "uppskattning",
  "en": "estimate",
  "t": "n",
  "g": "en",
  "es": "Uppskattningen revideras.",
  "ee": "The estimate is revised.",
  "lv": "B1",
  "wpm": 14.07
}, {
  "id": 3857,
  "sv": "styrka",
  "en": "strength",
  "t": "v",
  "es": "Hon har stor styrka.",
  "ee": "She has great strength.",
  "lv": "B1",
  "wpm": 13.77
}, {
  "id": 3862,
  "sv": "val",
  "en": "whale",
  "t": "n",
  "g": "en",
  "es": "Valen simmar i havet.",
  "ee": "The whale swims in the sea.",
  "lv": "B1",
  "wpm": 13.73
}, {
  "id": 3891,
  "sv": "mobil",
  "en": "mobile phone",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Mobilen är ny.",
  "ee": "The phone is new.",
  "ch": 1,
  "lv": "B1",
  "wpm": 13.55
}, {
  "id": 3894,
  "sv": "skärm",
  "en": "screen",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "Skärmen lyser.",
  "ee": "The screen lights up.",
  "ch": 11,
  "lv": "B1",
  "wpm": 13.54
}, {
  "id": 3913,
  "sv": "avhandling",
  "en": "dissertation",
  "t": "n",
  "g": "en",
  "es": "Avhandlingen skrivs.",
  "ee": "The dissertation is written.",
  "lv": "B1",
  "wpm": 13.44
}, {
  "id": 3953,
  "sv": "hypotes",
  "en": "hypothesis",
  "t": "n",
  "g": "en",
  "es": "Hypotesen testas.",
  "ee": "The hypothesis is tested.",
  "lv": "B1",
  "wpm": 13.18
}, {
  "id": 3955,
  "sv": "stämma",
  "en": "voice (singing part)",
  "t": "n",
  "g": "en",
  "c": "(-er, stämde, stämt)",
  "es": "Hon sjunger andra stämman.",
  "ee": "She sings the second voice.",
  "ch": 16,
  "lv": "B1",
  "wpm": 13.18
}, {
  "id": 4006,
  "sv": "hjul",
  "en": "wheel",
  "t": "n",
  "g": "ett",
  "es": "Hjulet snurrar.",
  "ee": "The wheel spins.",
  "lv": "B1",
  "wpm": 12.89
}, {
  "id": 4047,
  "sv": "minut (förk. min.)",
  "en": "minute",
  "t": "n",
  "g": "en",
  "es": "Vänta en minut.",
  "ee": "Wait a minute.",
  "lv": "B1",
  "wpm": 12.69
}, {
  "id": 4058,
  "sv": "leverans",
  "en": "delivery",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Leveransen anländer.",
  "ee": "The delivery arrives.",
  "ch": 18,
  "lv": "B1",
  "wpm": 12.62
}, {
  "id": 4090,
  "sv": "besättning",
  "en": "crew",
  "t": "n",
  "g": "en",
  "es": "Besättningen arbetar.",
  "ee": "The crew works.",
  "lv": "B1",
  "wpm": 12.46
}, {
  "id": 4148,
  "sv": "ankomst",
  "en": "arrival",
  "t": "n",
  "g": "en",
  "es": "Ankomsten sker snart.",
  "ee": "The arrival happens soon.",
  "lv": "B1",
  "wpm": 12.18
}, {
  "id": 4162,
  "sv": "doft",
  "en": "smell",
  "t": "n",
  "g": "en",
  "es": "Doften sprider sig.",
  "ee": "The smell spreads.",
  "lv": "B1",
  "wpm": 12.12
}, {
  "id": 4253,
  "sv": "evenemang",
  "en": "event",
  "t": "n",
  "g": "ett",
  "es": "Evenemanget börjar.",
  "ee": "The event begins.",
  "lv": "B2",
  "wpm": 11.69
}, {
  "id": 4273,
  "sv": "partnerskap",
  "en": "partnership",
  "t": "n",
  "g": "ett",
  "es": "Partnerskapet stärks.",
  "ee": "The partnership strengthens.",
  "lv": "B2",
  "wpm": 11.58
}, {
  "id": 4327,
  "sv": "observation",
  "en": "observation",
  "t": "n",
  "g": "en",
  "es": "Observationen rapporteras.",
  "ee": "The observation is reported.",
  "lv": "B2",
  "wpm": 11.31
}, {
  "id": 4359,
  "sv": "sändning",
  "en": "broadcast",
  "t": "n",
  "g": "en",
  "c": "(-en)",
  "es": "Sändningen startar.",
  "ee": "The broadcast starts.",
  "ch": 20,
  "lv": "B2",
  "wpm": 11.18
}, {
  "id": 4362,
  "sv": "rabatt",
  "en": "discount",
  "t": "n",
  "g": "en",
  "es": "Jag fick rabatt.",
  "ee": "I got a discount.",
  "lv": "B2",
  "wpm": 11.17
}, {
  "id": 4400,
  "sv": "fras",
  "en": "phrase",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Frasen upprepas.",
  "ee": "The phrase repeats.",
  "ch": 2,
  "lv": "B2",
  "wpm": 10.97
}, {
  "id": 4414,
  "sv": "ringa",
  "en": "to call",
  "t": "a",
  "c": "(-er, -de, -t)",
  "es": "Jag ringer dig.",
  "ee": "I call you.",
  "ch": 3,
  "lv": "B2",
  "wpm": 10.93
}, {
  "id": 4474,
  "sv": "liksom",
  "en": "as well as / like",
  "t": "s",
  "es": "Han arbetar liksom jag.",
  "ee": "He works like me.",
  "lv": "B2",
  "wpm": 10.64
}, {
  "id": 4525,
  "sv": "föda",
  "en": "to give birth",
  "t": "n",
  "g": "en",
  "lv": "B2",
  "wpm": 10.47
}, {
  "id": 4596,
  "sv": "examen",
  "en": "degree",
  "t": "n",
  "g": "en",
  "c": "(−, examina)",
  "es": "Examen erhålls.",
  "ee": "The degree is obtained.",
  "ch": 6,
  "lv": "B2",
  "wpm": 10.17
}, {
  "id": 4608,
  "sv": "beställning",
  "en": "order",
  "t": "n",
  "g": "en",
  "es": "Beställningen kommer.",
  "ee": "The order arrives.",
  "lv": "B2",
  "wpm": 10.12
}, {
  "id": 4628,
  "sv": "inbjudan",
  "en": "invitation",
  "t": "n",
  "g": "en",
  "es": "Inbjudan skickas.",
  "ee": "The invitation is sent.",
  "ch": 14,
  "lv": "B2",
  "wpm": 10.03
}, {
  "id": 4700,
  "sv": "rätta",
  "en": "to correct",
  "t": "n",
  "es": "Läraren rättar provet.",
  "ee": "The teacher corrects the test.",
  "lv": "B2",
  "wpm": 9.72
}, {
  "id": 4777,
  "sv": "meny",
  "en": "menu",
  "t": "n",
  "g": "en",
  "c": "(-n, -en, -er)",
  "es": "Menyn är lång.",
  "ee": "The menu is long.",
  "ch": 4,
  "lv": "B2",
  "wpm": 9.45
}, {
  "id": 4782,
  "sv": "publikation",
  "en": "publication",
  "t": "n",
  "g": "en",
  "es": "Publikationen släpps.",
  "ee": "The publication is released.",
  "lv": "B2",
  "wpm": 9.44
}, {
  "id": 4791,
  "sv": "jag",
  "en": "I",
  "t": "n",
  "g": "ett",
  "es": "Jag bor i Stockholm.",
  "ee": "I live in Stockholm.",
  "ch": 1,
  "lv": "B2",
  "wpm": 9.39
}, {
  "id": 4815,
  "sv": "ovan",
  "en": "above",
  "t": "p",
  "es": "Texten står ovan.",
  "ee": "The text stands above.",
  "lv": "B2",
  "wpm": 9.28
}, {
  "id": 4906,
  "sv": "för",
  "en": "for",
  "t": "n",
  "g": "en",
  "es": "Detta är för dig.",
  "ee": "This is for you.",
  "ch": 1,
  "lv": "B2",
  "wpm": 8.96
}, {
  "id": 4922,
  "sv": "räddning",
  "en": "rescue",
  "t": "n",
  "g": "en",
  "es": "Räddningen lyckas.",
  "ee": "The rescue succeeds.",
  "lv": "B2",
  "wpm": 8.92
}, {
  "id": 4926,
  "sv": "mode",
  "en": "fashion",
  "t": "n",
  "g": "ett",
  "c": "(-t, -en, -ena)",
  "es": "Modet förändras.",
  "ee": "Fashion changes.",
  "ch": 7,
  "lv": "B2",
  "wpm": 8.89
}, {
  "id": 4927,
  "sv": "programledare",
  "en": "host",
  "t": "n",
  "g": "en",
  "es": "Programledaren talar.",
  "ee": "The host speaks.",
  "lv": "B2",
  "wpm": 8.89
}, {
  "id": 4947,
  "sv": "lik",
  "en": "corpse",
  "t": "n",
  "g": "ett",
  "es": "Liket hittades i floden.",
  "ee": "The corpse was found in the river.",
  "lv": "B2",
  "wpm": 8.81
}, {
  "id": 4969,
  "sv": "popularitet",
  "en": "popularity",
  "t": "n",
  "g": "en",
  "es": "Populariteten ökar.",
  "ee": "Popularity increases.",
  "lv": "B2",
  "wpm": 8.75
}, {
  "id": 5024,
  "sv": "applåd",
  "en": "applause",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Applåden hörs.",
  "ee": "The applause is heard.",
  "ch": 8,
  "lv": "B2",
  "wpm": 8.54
}, {
  "id": 5029,
  "sv": "slut",
  "en": "end",
  "t": "a",
  "c": "(-et, –, -en)",
  "es": "Filmen har ett slut.",
  "ee": "The film has an end.",
  "ch": 2,
  "lv": "B2",
  "wpm": 8.53
}, {
  "id": 5054,
  "sv": "badrum",
  "en": "bathroom",
  "t": "n",
  "g": "ett",
  "c": "(-met, −, -en)",
  "es": "Badrummet är litet.",
  "ee": "The bathroom is small.",
  "ch": 17,
  "lv": "B2",
  "wpm": 8.44
}, {
  "id": 5056,
  "sv": "sovrum",
  "en": "bedroom",
  "t": "n",
  "g": "ett",
  "es": "Sovrummet är lugnt.",
  "ee": "The bedroom is quiet.",
  "lv": "B2",
  "wpm": 8.44
}, {
  "id": 5089,
  "sv": "respons",
  "en": "response",
  "t": "n",
  "g": "en",
  "c": "(-en)",
  "es": "Responsen är snabb.",
  "ee": "The response is quick.",
  "ch": 2,
  "lv": "B2",
  "wpm": 8.35
}, {
  "id": 5095,
  "sv": "bara",
  "en": "only / just",
  "t": "s",
  "es": "Jag vill bara sova.",
  "ee": "I only want to sleep.",
  "ch": 7,
  "lv": "B2",
  "wpm": 8.32
}, {
  "id": 5116,
  "sv": "bagage",
  "en": "luggage",
  "t": "n",
  "g": "ett",
  "c": "(-t, −, -en)",
  "es": "Bagaget hämtas.",
  "ee": "The luggage is collected.",
  "ch": 7,
  "lv": "B2",
  "wpm": 8.28
}, {
  "id": 5170,
  "sv": "markering",
  "en": "mark",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "Markeringen syns.",
  "ee": "The mark is visible.",
  "ch": 2,
  "lv": "B2",
  "wpm": 8.12
}, {
  "id": 5202,
  "sv": "inspektion",
  "en": "inspection",
  "t": "n",
  "g": "en",
  "es": "Inspektionen genomförs.",
  "ee": "The inspection is conducted.",
  "lv": "B2",
  "wpm": 8.05
}, {
  "id": 5266,
  "sv": "pilot",
  "en": "pilot",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Piloten talar.",
  "ee": "The pilot speaks.",
  "ch": 13,
  "lv": "B2",
  "wpm": 7.88
}, {
  "id": 5284,
  "sv": "gud",
  "en": "god",
  "t": "i",
  "es": "De tror på en gud.",
  "ee": "They believe in a god.",
  "lv": "B2",
  "wpm": 7.82
}, {
  "id": 5458,
  "sv": "magasin",
  "en": "magazine",
  "t": "n",
  "g": "ett",
  "es": "Magasinet säljs.",
  "ee": "The magazine sells.",
  "lv": "B2",
  "wpm": 7.39
}, {
  "id": 5479,
  "sv": "sex",
  "en": "six",
  "t": "n",
  "g": "ett",
  "es": "Vi är sex personer här.",
  "ee": "There are six people here.",
  "lv": "B2",
  "wpm": 7.35
}, {
  "id": 5494,
  "sv": "nej",
  "en": "no",
  "t": "n",
  "g": "ett",
  "es": "Nej, jag vill inte.",
  "ee": "No, I don't want to.",
  "ch": 1,
  "lv": "B2",
  "wpm": 7.32
}, {
  "id": 5536,
  "sv": "språkbruk",
  "en": "language use",
  "t": "n",
  "g": "ett",
  "es": "Språkbruket varierar.",
  "ee": "Language use varies.",
  "lv": "B2",
  "wpm": 7.23
}, {
  "id": 5578,
  "sv": "central",
  "en": "central",
  "t": "n",
  "g": "en",
  "c": "(-t, -a)",
  "es": "Det är en central fråga.",
  "ee": "It is a central issue.",
  "ch": 18,
  "lv": "B2",
  "wpm": 7.15
}, {
  "id": 5621,
  "sv": "trots",
  "en": "despite",
  "t": "n",
  "g": "ett",
  "es": "Vi går trots regnet.",
  "ee": "We go despite the rain.",
  "ch": 18,
  "lv": "C1",
  "wpm": 7.05
}, {
  "id": 5674,
  "sv": "mus",
  "en": "mouse",
  "t": "n",
  "g": "en",
  "c": "(-en)",
  "es": "Musen rör sig.",
  "ee": "The mouse moves.",
  "ch": 11,
  "lv": "C1",
  "wpm": 6.96
}, {
  "id": 5755,
  "sv": "hög",
  "en": "pile / heap",
  "t": "n",
  "g": "en",
  "c": "(-t, -a)",
  "es": "Det ligger en hög med böcker.",
  "ee": "There's a pile of books.",
  "ch": 17,
  "lv": "C1",
  "wpm": 6.77
}, {
  "id": 5760,
  "sv": "utifrån",
  "en": "from outside",
  "t": "a",
  "es": "Han ser det utifrån.",
  "ee": "He sees it from outside.",
  "ch": 13,
  "lv": "C1",
  "wpm": 6.76
}, {
  "id": 5797,
  "sv": "vika",
  "en": "to fold",
  "t": "a",
  "lv": "C1",
  "wpm": 6.69
}, {
  "id": 5813,
  "sv": "måste",
  "en": "must",
  "t": "n",
  "g": "ett",
  "es": "Jag måste gå.",
  "ee": "I must go.",
  "ch": 4,
  "lv": "C1",
  "wpm": 6.66
}, {
  "id": 5880,
  "sv": "parameter",
  "en": "parameter",
  "t": "n",
  "g": "en",
  "es": "Parametern justeras.",
  "ee": "The parameter is adjusted.",
  "lv": "C1",
  "wpm": 6.54
}, {
  "id": 5946,
  "sv": "session",
  "en": "session",
  "t": "n",
  "g": "en",
  "es": "Sessionen öppnas.",
  "ee": "The session opens.",
  "lv": "C1",
  "wpm": 6.46
}, {
  "id": 5952,
  "sv": "utanför",
  "en": "outside",
  "t": "a",
  "es": "Han väntar utanför huset.",
  "ee": "He waits outside the house.",
  "ch": 3,
  "lv": "C1",
  "wpm": 6.45
}, {
  "id": 5957,
  "sv": "firande",
  "en": "celebration",
  "t": "n",
  "es": "Firandet börjar.",
  "ee": "The celebration begins.",
  "lv": "C1",
  "wpm": 6.43
}, {
  "id": 5990,
  "sv": "handledare",
  "en": "supervisor",
  "t": "n",
  "g": "en",
  "es": "Handledaren ger råd.",
  "ee": "The supervisor gives advice.",
  "lv": "C1",
  "wpm": 6.37
}, {
  "id": 5993,
  "sv": "media",
  "en": "media",
  "t": "n",
  "es": "Media rapporterar.",
  "ee": "The media report.",
  "lv": "C1",
  "wpm": 6.37
}, {
  "id": 5997,
  "sv": "röra",
  "en": "mess",
  "t": "n",
  "g": "en",
  "lv": "C1",
  "wpm": 6.37,
  "es": "Rummet är en enda röra.",
  "ee": "The room is a total mess."
}, {
  "id": 6013,
  "sv": "destination",
  "en": "destination",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Destinationen nås.",
  "ee": "The destination is reached.",
  "ch": 8,
  "lv": "C1",
  "wpm": 6.34
}, {
  "id": 6026,
  "sv": "procedur",
  "en": "procedure",
  "t": "n",
  "g": "en",
  "es": "Proceduren följs.",
  "ee": "The procedure is followed.",
  "lv": "C1",
  "wpm": 6.32
}, {
  "id": 6046,
  "sv": "nu",
  "en": "now",
  "t": "n",
  "g": "ett",
  "es": "Jag arbetar nu.",
  "ee": "I work now.",
  "ch": 1,
  "lv": "C1",
  "wpm": 6.28
}, {
  "id": 6099,
  "sv": "ambulans",
  "en": "ambulance",
  "t": "n",
  "g": "en",
  "es": "Ambulansen kommer.",
  "ee": "The ambulance arrives.",
  "lv": "C1",
  "wpm": 6.21
}, {
  "id": 6124,
  "sv": "tangentbord",
  "en": "keybord",
  "t": "n",
  "g": "ett",
  "c": "(-et, −, -en)",
  "es": "Tangentbordet klickar.",
  "ee": "The keyboard clicks.",
  "ch": 11,
  "lv": "C1",
  "wpm": 6.18
}, {
  "id": 6284,
  "sv": "stavning",
  "en": "spelling",
  "t": "n",
  "g": "en",
  "es": "Stavningen kontrolleras.",
  "ee": "The spelling is checked.",
  "lv": "C1",
  "wpm": 5.75
}, {
  "id": 6373,
  "sv": "bokhandel",
  "en": "bookstore",
  "t": "n",
  "g": "en",
  "es": "Bokhandeln öppnar.",
  "ee": "The bookstore opens.",
  "lv": "C1",
  "wpm": 5.43
}, {
  "id": 6447,
  "sv": "variabel",
  "en": "variable",
  "t": "n",
  "g": "en",
  "es": "Variabeln ändras.",
  "ee": "The variable changes.",
  "lv": "C1",
  "wpm": 5.18
}, {
  "id": 6704,
  "sv": "brandman",
  "en": "firefighter",
  "t": "n",
  "g": "en",
  "es": "Brandmannen arbetar.",
  "ee": "The firefighter works.",
  "lv": "C1",
  "wpm": 4.33
}, {
  "id": 6709,
  "sv": "broms",
  "en": "brake",
  "t": "n",
  "g": "en",
  "es": "Bromsen används.",
  "ee": "The brake is used.",
  "lv": "C1",
  "wpm": 4.32
}, {
  "id": 6901,
  "sv": "landning",
  "en": "landing",
  "t": "n",
  "g": "en",
  "es": "Landningen sker.",
  "ee": "The landing occurs.",
  "lv": "C1",
  "wpm": 3.71
}, {
  "id": 6924,
  "sv": "kafé (el. café)",
  "en": "café",
  "t": "n",
  "g": "ett",
  "es": "Vi möts på ett kafé.",
  "ee": "We meet at a café.",
  "lv": "C1",
  "wpm": 3.66
}, {
  "id": 6963,
  "sv": "klausul",
  "en": "clause",
  "t": "n",
  "g": "en",
  "es": "Klausulen diskuteras.",
  "ee": "The clause is discussed.",
  "lv": "C1",
  "wpm": 3.56
}, {
  "id": 7010,
  "sv": "mapp",
  "en": "folder",
  "t": "n",
  "g": "en",
  "c": "(-en, -ar, -arna)",
  "es": "Mappen öppnas.",
  "ee": "The folder opens.",
  "ch": 11,
  "lv": "C1",
  "wpm": 3.44
}, {
  "id": 7108,
  "sv": "avresa",
  "en": "departure",
  "t": "n",
  "g": "en",
  "es": "Avresan närmar sig.",
  "ee": "The departure approaches.",
  "lv": "C2",
  "wpm": 3.19
}, {
  "id": 7126,
  "sv": "bokning",
  "en": "booking",
  "t": "n",
  "g": "en",
  "es": "Bokningen bekräftas.",
  "ee": "The booking is confirmed.",
  "lv": "C2",
  "wpm": 3.14
}, {
  "id": 7166,
  "sv": "underskrift",
  "en": "signature",
  "t": "n",
  "g": "en",
  "es": "Underskriften behövs.",
  "ee": "The signature is needed.",
  "lv": "C2",
  "wpm": 3.06
}, {
  "id": 7431,
  "sv": "simulering",
  "en": "simulation",
  "t": "n",
  "g": "en",
  "es": "Simuleringen körs.",
  "ee": "The simulation runs.",
  "lv": "C2",
  "wpm": 2.52
}, {
  "id": 7452,
  "sv": "dricks",
  "en": "tip",
  "t": "n",
  "g": "en",
  "c": "(-en)",
  "es": "Han lämnar dricks.",
  "ee": "He leaves a tip.",
  "ch": 8,
  "lv": "C2",
  "wpm": 2.45
}, {
  "id": 7456,
  "sv": "algoritm",
  "en": "algorithm",
  "t": "n",
  "g": "en",
  "es": "Algoritmen förbättras.",
  "ee": "The algorithm improves.",
  "lv": "C2",
  "wpm": 2.42
}, {
  "id": 7503,
  "sv": "startpunkt",
  "en": "starting point",
  "t": "n",
  "g": "en",
  "es": "Startpunkten är här.",
  "ee": "The starting point is here.",
  "lv": "C2",
  "wpm": 2.33
}, {
  "id": 7858,
  "sv": "servitör",
  "en": "waiter",
  "t": "n",
  "g": "en",
  "c": "(-en, -er, -erna)",
  "es": "Servitören hjälper oss.",
  "ee": "The waiter helps us.",
  "ch": 1,
  "lv": "C2",
  "wpm": 1.47
}, {
  "id": 8195,
  "sv": "variabel",
  "en": "variable",
  "t": "a",
  "es": "Variabeln ändras.",
  "ee": "The variable changes.",
  "lv": "C2",
  "wpm": 0.63
}, {
  "id": 8314,
  "sv": "avresa",
  "en": "departure",
  "t": "v",
  "es": "Avresan närmar sig.",
  "ee": "The departure approaches.",
  "lv": "C2",
  "wpm": 0.33
}, {
  "id": 8426,
  "sv": "Ursäkta.",
  "en": "Excuse me.",
  "ch": 1
}, {
  "id": 8427,
  "sv": "Jag har en fråga.",
  "en": "I have a question.",
  "ch": 1
}, {
  "id": 8428,
  "sv": "Vad betyder det",
  "en": "What does that mean?",
  "ch": 1
}, {
  "id": 8429,
  "sv": "Hur säger man … på svenska",
  "en": "How do you say … in Swedish?",
  "ch": 1
}, {
  "id": 8430,
  "sv": "Vad heter … på svenska?",
  "en": "What is … called in Swedish?",
  "ch": 1
}, {
  "id": 8431,
  "sv": "Hur uttalar man …",
  "en": "How do you pronounce … ?",
  "ch": 1
}, {
  "id": 8432,
  "sv": "Hur stavar/skriver man …",
  "en": "How do you spell/write … ?",
  "ch": 1
}, {
  "id": 8433,
  "sv": "Kan du säga det en gång till",
  "en": "Could you repeat that?",
  "ch": 1
}, {
  "id": 8434,
  "sv": "Jag förstår inte.",
  "en": "I don't understand.",
  "ch": 1
}, {
  "id": 8435,
  "sv": "Jaha! Nu förstår jag!",
  "en": "Ah! Now I understand!",
  "ch": 1
}, {
  "id": 8436,
  "sv": "Förstår du/ni",
  "en": "Do you understand?",
  "ch": 1
}, {
  "id": 8437,
  "sv": "Har ni några frågor",
  "en": "Do you have any questions?",
  "ch": 1
}, {
  "id": 8438,
  "sv": "Titta på sidan X i textboken/övningsboken.",
  "en": "Look at page X in the textbook/exercise book.",
  "ch": 1
}, {
  "id": 8439,
  "sv": "Läs texten på sidan X.",
  "en": "Read the text on page X.",
  "ch": 1
}, {
  "id": 8440,
  "sv": "Stäng boken.",
  "en": "Close the book.",
  "ch": 1
}, {
  "id": 8441,
  "sv": "Lyssna.",
  "en": "Listen.",
  "ch": 1
}, {
  "id": 8442,
  "sv": "Säg efter mig.",
  "en": "Repeat after me.",
  "ch": 1
}, {
  "id": 8443,
  "sv": "Skriv",
  "en": "Write!",
  "ch": 1,
  "t": "v"
}, {
  "id": 8444,
  "sv": "Arbeta i par.",
  "en": "Work in pairs.",
  "ch": 1
}, {
  "id": 8445,
  "sv": "Prata svenska",
  "en": "Speak Swedish.",
  "ch": 1
}, {
  "id": 8446,
  "sv": "rivstart",
  "en": "flying start",
  "c": "(-en,-er, -erna)",
  "ch": 1,
  "t": "n",
  "g": "en"
}, {
  "id": 8447,
  "sv": "kapitel",
  "en": "chapter",
  "c": "(kapitlet, –, kapitlen)",
  "ch": 1,
  "t": "n",
  "g": "ett"
}, {
  "id": 8448,
  "sv": "Du kan svenska",
  "en": "You speak Swedish!",
  "ch": 1
}, {
  "id": 8449,
  "sv": "och",
  "en": "and",
  "ch": 1,
  "t": "c"
}, {
  "id": 8450,
  "sv": "hamburgare",
  "en": "hamburger",
  "c": "(-n, –, hamburgarna)",
  "ch": 1,
  "t": "n",
  "g": "en"
}, {
  "id": 8451,
  "sv": "kanelbulle",
  "en": "cinnamon roll/bun",
  "c": "(-n, -ar, -arna)",
  "ch": 1,
  "t": "n",
  "g": "en"
}, {
  "id": 8452,
  "sv": "konsonant",
  "en": "consonant",
  "c": "(-en, -er, -erna)",
  "ch": 1,
  "t": "n",
  "g": "en"
}, {
  "id": 8453,
  "sv": "Jag heter",
  "en": "My name is",
  "ch": 1
}, {
  "id": 8454,
  "sv": "jaha",
  "en": "I see",
  "ch": 1,
  "t": "i"
}, {
  "id": 8455,
  "sv": "vad bra",
  "en": "that’s great",
  "ch": 1
}, {
  "id": 8456,
  "sv": "Vad talar du för språk",
  "en": "What languages do you speak?",
  "ch": 1
}, {
  "id": 8457,
  "sv": "vad … för",
  "en": "what",
  "ch": 1
}, {
  "id": 8458,
  "sv": "lite some",
  "en": "a little",
  "ch": 1
}, {
  "id": 8459,
  "sv": "spanska",
  "en": "Spanish",
  "ch": 1,
  "t": "n",
  "g": "en"
}, {
  "id": 8460,
  "sv": "så klart",
  "en": "of course",
  "ch": 1
}, {
  "id": 8461,
  "sv": "Vad heter du",
  "en": "What is your name?",
  "ch": 1
}, {
  "id": 8462,
  "sv": "Och du",
  "en": "And you?",
  "ch": 1
}, {
  "id": 8463,
  "sv": "pyttelite",
  "en": "a tiny bit",
  "ch": 1,
  "t": "a"
}, {
  "id": 8464,
  "sv": "italienska",
  "en": "Italian",
  "ch": 1,
  "t": "n",
  "g": "en"
}, {
  "id": 8465,
  "sv": "Vad kul",
  "en": "Great!/How fun!",
  "ch": 1
}, {
  "id": 8466,
  "sv": "ringa in",
  "en": "circle",
  "ch": 1
}, {
  "id": 8467,
  "sv": "inte",
  "en": "not",
  "ch": 1,
  "t": "a"
}, {
  "id": 8468,
  "sv": "sätta ett kryss make an x",
  "en": "tick",
  "ch": 1
}, {
  "id": 8469,
  "sv": "alla",
  "en": "all/everyone",
  "ch": 1,
  "t": "d"
}, {
  "id": 8470,
  "sv": "frågeord",
  "en": "question words",
  "c": "( -et, –, -en)",
  "ch": 1,
  "t": "n",
  "g": "ett"
}, {
  "id": 8471,
  "sv": "mingla",
  "en": "mingle",
  "c": "(-r, -de, -t)",
  "ch": 1,
  "t": "v"
}, {
  "id": 8472,
  "sv": "Colombia",
  "en": "Colombia",
  "ch": 1,
  "t": "pn"
}, {
  "id": 8473,
  "sv": "Irland",
  "en": "Ireland",
  "ch": 1,
  "t": "pn"
}, {
  "id": 8474,
  "sv": "varandra",
  "en": "each other",
  "ch": 1,
  "t": "p"
}, {
  "id": 8475,
  "sv": "de",
  "en": "they",
  "ch": 1,
  "t": "p"
}, {
  "id": 8476,
  "sv": "subjektspronomen",
  "en": "subject pronoun",
  "ch": 1,
  "t": "n",
  "g": "ett"
}, {
  "id": 8477,
  "sv": "pronomen",
  "en": "pronoun",
  "c": "(-et, –, -en)",
  "ch": 1,
  "t": "n",
  "g": "ett"
}, {
  "id": 8478,
  "sv": "busschaufför",
  "en": "bus driver",
  "c": "(-en, -er, -erna)",
  "ch": 1,
  "t": "n",
  "g": "en"
}, {
  "id": 8479,
  "sv": "webbdesigner",
  "en": "web designer",
  "c": "(-n, webbdesigner, webbdesignerna)",
  "ch": 1,
  "t": "n",
  "g": "en"
}, {
  "id": 8480,
  "sv": "nähä",
  "en": "I see",
  "c": "(ugs)",
  "ch": 1,
  "t": "i"
}, {
  "id": 8481,
  "sv": "lycka till",
  "en": "good luck",
  "ch": 1
}, {
  "id": 8482,
  "sv": "negation",
  "en": "negation",
  "c": "(-en, -er, -erna)",
  "ch": 1,
  "t": "n",
  "g": "en"
}, {
  "id": 8483,
  "sv": "Ukraina",
  "en": "Ukraine",
  "ch": 1,
  "t": "pn"
}, {
  "id": 8484,
  "sv": "portugisiska",
  "en": "Portuguese",
  "ch": 1,
  "t": "n",
  "g": "en"
}, {
  "id": 8485,
  "sv": "IT-företag",
  "en": "IT company",
  "c": "(-et, –, -en)",
  "ch": 1,
  "t": "n",
  "g": "ett"
}, {
  "id": 8486,
  "sv": "IT IT",
  "en": "information technology",
  "ch": 1
}, {
  "id": 8487,
  "sv": "förskolelärare",
  "en": "preschool teacher",
  "c": "(-n, –, -förskolelärarna)",
  "ch": 1,
  "t": "n",
  "g": "en"
}, {
  "id": 8488,
  "sv": "studera till",
  "en": "study to be",
  "ch": 1
}, {
  "id": 8489,
  "sv": "kryssa för",
  "en": "tick, cross",
  "c": "(-r, -de, -t)",
  "ch": 1
}, {
  "id": 8490,
  "sv": "rätt alternativ",
  "en": "correct answer, correct option",
  "ch": 1
}, {
  "id": 8491,
  "sv": "schweizare",
  "en": "Swiss",
  "c": "(-n, –, schweizarna)",
  "ch": 1,
  "t": "n",
  "g": "en"
}, {
  "id": 8492,
  "sv": "också",
  "en": "also too",
  "ch": 1,
  "t": "a"
}, {
  "id": 8493,
  "sv": "bo ihop",
  "en": "live together",
  "ch": 1
}, {
  "id": 8494,
  "sv": "sedan",
  "en": "since",
  "ch": 1,
  "t": "s"
}, {
  "id": 8495,
  "sv": "separerad",
  "en": "separated",
  "c": "(separerat, separerade)",
  "ch": 1,
  "t": "a"
}, {
  "id": 8496,
  "sv": "bonusbarn",
  "en": "stepchild",
  "c": "(-et, –, -en)",
  "ch": 1,
  "t": "n",
  "g": "ett"
}, {
  "id": 8497,
  "sv": "Tjena",
  "en": "Hi!",
  "ch": 2,
  "t": "i"
}, {
  "id": 8498,
  "sv": "Hur mår du",
  "en": "How are you?",
  "ch": 2
}, {
  "id": 8499,
  "sv": "bara bra",
  "en": "I'm fine, well",
  "ch": 2
}, {
  "id": 8500,
  "sv": "bra fine",
  "en": "well",
  "ch": 2
}, {
  "id": 8501,
  "sv": "Jo tack.",
  "en": "Thanks (for asking)",
  "ch": 2
}, {
  "id": 8502,
  "sv": "Det är bra.",
  "en": "I'm fine.",
  "ch": 2
}, {
  "id": 8503,
  "sv": "Hur är läget",
  "en": "How are things?, How's it going?",
  "ch": 2
}, {
  "id": 8504,
  "sv": "Det är lugnt.",
  "en": "Great, Okay",
  "ch": 2
}, {
  "id": 8505,
  "sv": "kanonbra",
  "en": "great",
  "ch": 2,
  "t": "a"
}, {
  "id": 8506,
  "sv": "Hejsan",
  "en": "Hi there!",
  "ch": 2,
  "t": "i"
}, {
  "id": 8507,
  "sv": "Hur är det",
  "en": "How are things?",
  "ch": 2
}, {
  "id": 8508,
  "sv": "Allt väl",
  "en": "All well?",
  "ch": 2
}, {
  "id": 8509,
  "sv": "för mycket",
  "en": "too much",
  "ch": 2
}, {
  "id": 8510,
  "sv": "jodå",
  "en": "allright",
  "ch": 2,
  "t": "i"
}, {
  "id": 8511,
  "sv": "Tja",
  "en": "Hey!, Hi!",
  "c": "(= Tjena!)",
  "ch": 2,
  "t": "i"
}, {
  "id": 8512,
  "sv": "så där",
  "en": "so-so",
  "ch": 2
}, {
  "id": 8513,
  "sv": "nja",
  "en": "we-ell…",
  "ch": 2,
  "t": "i"
}, {
  "id": 8514,
  "sv": "Hur står det till",
  "en": "How are you?",
  "ch": 2
}, {
  "id": 8515,
  "sv": "ganska fairly",
  "en": "quite",
  "ch": 2
}, {
  "id": 8516,
  "sv": "Jag är förkyld.",
  "en": "I have a cold.",
  "ch": 2
}, {
  "id": 8517,
  "sv": "God morgon",
  "en": "Good morning!",
  "ch": 2
}, {
  "id": 8518,
  "sv": "Jättetrött",
  "en": "really tired",
  "ch": 2,
  "t": "a"
}, {
  "id": 8519,
  "sv": "Oj då",
  "en": "Oh!, Wow!",
  "ch": 2
}, {
  "id": 8520,
  "sv": "God dag.",
  "en": "Hello.",
  "ch": 2
}, {
  "id": 8521,
  "sv": "västra Sverige",
  "en": "western Sweden",
  "ch": 2
}, {
  "id": 8522,
  "sv": "betonad",
  "en": "emphasized",
  "c": "(betonat, betonade)",
  "ch": 2,
  "t": "a"
}, {
  "id": 8523,
  "sv": "intonation",
  "en": "intonation",
  "c": "(-en, -er, -erna)",
  "ch": 2,
  "t": "n",
  "g": "en"
}, {
  "id": 8524,
  "sv": "thailändsk",
  "en": "Thai",
  "ch": 2,
  "t": "a"
}, {
  "id": 8525,
  "sv": "Norden",
  "en": "the Nordic countries",
  "ch": 2,
  "t": "pn"
}, {
  "id": 8526,
  "sv": "Thailand",
  "en": "Thailand",
  "ch": 2,
  "t": "pn"
}, {
  "id": 8527,
  "sv": "IT-ingenjör",
  "en": "computer engineer",
  "c": "(-en, -er, -erna)",
  "ch": 2,
  "t": "n",
  "g": "en"
}, {
  "id": 8528,
  "sv": "spelföretag",
  "en": "gaming company",
  "c": "(-et, –, -en)",
  "ch": 2,
  "t": "n",
  "g": "ett"
}, {
  "id": 8529,
  "sv": "ibland",
  "en": "sometimes",
  "ch": 2,
  "t": "a"
}, {
  "id": 8530,
  "sv": "i sommar",
  "en": "this summer",
  "ch": 2
}, {
  "id": 8531,
  "sv": "det blir",
  "en": "it will be",
  "ch": 2
}, {
  "id": 8532,
  "sv": "Skandinavien",
  "en": "Scandinavia",
  "ch": 2,
  "t": "pn"
}, {
  "id": 8533,
  "sv": "Danmark",
  "en": "Denmark",
  "ch": 2,
  "t": "pn"
}, {
  "id": 8534,
  "sv": "Island",
  "en": "Iceland",
  "ch": 2,
  "t": "pn"
}, {
  "id": 8535,
  "sv": "självstyrande",
  "en": "autonomous, self-governing",
  "ch": 2,
  "t": "a"
}, {
  "id": 8536,
  "sv": "Färöarna",
  "en": "Faroe Islands",
  "ch": 2,
  "t": "pn"
}, {
  "id": 8537,
  "sv": "Grönland",
  "en": "Greenland",
  "ch": 2,
  "t": "pn"
}, {
  "id": 8538,
  "sv": "Finland",
  "en": "Finland",
  "ch": 2,
  "t": "pn"
}, {
  "id": 8539,
  "sv": "Åland",
  "en": "Aaland Islands",
  "ch": 2,
  "t": "pn"
}, {
  "id": 8540,
  "sv": "till exempel",
  "en": "for example",
  "ch": 2,
  "t": "a"
}, {
  "id": 8541,
  "sv": "ses",
  "en": "to meet",
  "c": "(ses, sågs, setts)",
  "ch": 2,
  "t": "v"
}, {
  "id": 8542,
  "sv": "höras",
  "en": "be in touch",
  "c": "(hörs, hördes, hörts)",
  "ch": 2,
  "t": "v"
}, {
  "id": 8543,
  "sv": "klasskompis",
  "en": "classmate",
  "c": "(-en, -ar, -arna)",
  "ch": 2,
  "t": "n",
  "g": "en"
}, {
  "id": 8544,
  "sv": "det här",
  "en": "this",
  "ch": 2
}, {
  "id": 8545,
  "sv": "träffas",
  "en": "to meet",
  "c": "(träffas, träffades, träffats)",
  "ch": 2,
  "t": "v"
}, {
  "id": 8546,
  "sv": "Kom in",
  "en": "Come in!",
  "ch": 2
}, {
  "id": 8547,
  "sv": "webb",
  "en": "Internet",
  "c": "(-en)",
  "ch": 2,
  "t": "n",
  "g": "en"
}, {
  "id": 8548,
  "sv": "thai",
  "en": "Thai",
  "ch": 2,
  "t": "n",
  "g": "en"
}, {
  "id": 8549,
  "sv": "ska",
  "en": "will",
  "ch": 2,
  "t": "v"
}, {
  "id": 8550,
  "sv": "Vi ses",
  "en": "See you!",
  "ch": 2
}, {
  "id": 8551,
  "sv": "just det",
  "en": "exactly",
  "ch": 2
}, {
  "id": 8552,
  "sv": "Ha det så bra",
  "en": "Be well!",
  "ch": 2
}, {
  "id": 8553,
  "sv": "Du med",
  "en": "You too!",
  "ch": 2
}, {
  "id": 8554,
  "sv": "Hej då",
  "en": "Good bye!",
  "ch": 2
}, {
  "id": 8555,
  "sv": "på stan",
  "en": "downtown, in the city",
  "c": "(= staden)",
  "ch": 2
}, {
  "id": 8556,
  "sv": "tuggummipaket",
  "en": "pack of chewing gum",
  "c": "(-et, –, -en)",
  "ch": 2,
  "t": "n",
  "g": "ett"
}, {
  "id": 8557,
  "sv": "läsplatta",
  "en": "e-reader",
  "c": "(-n, -or, -orna)",
  "ch": 2,
  "t": "n",
  "g": "en"
}, {
  "id": 8558,
  "sv": "cerat",
  "en": "chapstick, lip balm",
  "c": "(-et, –, -en)",
  "ch": 2,
  "t": "n",
  "g": "ett"
}, {
  "id": 8559,
  "sv": "suddgummi",
  "en": "eraser",
  "c": "(-t, -n, -na)",
  "ch": 2,
  "t": "n",
  "g": "ett"
}, {
  "id": 8560,
  "sv": "Tack så mycket.",
  "en": "Thank you very much.",
  "ch": 2
}, {
  "id": 8561,
  "sv": "Det var så lite.",
  "en": "It was nothing.",
  "ch": 2
}, {
  "id": 8562,
  "sv": "bussbiljett",
  "en": "bus ticket",
  "c": "(-en, -er, -erna)",
  "ch": 2,
  "t": "n",
  "g": "en"
}, {
  "id": 8563,
  "sv": "läppglans",
  "en": "lip gloss",
  "c": "(-et)",
  "ch": 2,
  "t": "n",
  "g": "en"
}, {
  "id": 8564,
  "sv": "flaska vatten",
  "en": "a bottle of water",
  "t": "n",
  "g": "en",
  "ch": 2
}, {
  "id": 8565,
  "sv": "pengar",
  "en": "money",
  "c": "(-na)",
  "ch": 2,
  "t": "n"
}, {
  "id": 8566,
  "sv": "par skor",
  "en": "a pair of shoes",
  "t": "n",
  "g": "ett",
  "ch": 2
}, {
  "id": 8567,
  "sv": "necessär",
  "en": "toiletry bag",
  "c": "(-en, -er, -erna)",
  "ch": 2,
  "t": "n",
  "g": "en"
}, {
  "id": 8568,
  "sv": "singular",
  "en": "singular",
  "ch": 2,
  "t": "n",
  "g": "en"
}, {
  "id": 8569,
  "sv": "obestämd form",
  "en": "indefinite form",
  "ch": 2
}, {
  "id": 8570,
  "sv": "obestämd",
  "en": "indefinite",
  "c": "(obestämt, obestämda)",
  "ch": 2,
  "t": "a"
}, {
  "id": 8571,
  "sv": "halsduk",
  "en": "scarf",
  "c": "(-en, -ar, -arna)",
  "ch": 2,
  "t": "n",
  "g": "en"
}, {
  "id": 8572,
  "sv": "Sidan",
  "en": "27",
  "ch": 3,
  "t": "n",
  "g": "en"
}, {
  "id": 8573,
  "sv": "baklänges",
  "en": "backwards",
  "ch": 3,
  "t": "a"
}, {
  "id": 8574,
  "sv": "kasta tärning",
  "en": "roll dice",
  "ch": 3
}, {
  "id": 8575,
  "sv": "tärning",
  "en": "dice",
  "c": "(-en, -ar, -arna)",
  "ch": 3,
  "t": "n",
  "g": "en"
}, {
  "id": 8576,
  "sv": "nummer",
  "en": "number",
  "c": "(numret, –, numren)",
  "ch": 3,
  "t": "n",
  "g": "ett"
}, {
  "id": 8577,
  "sv": "hur många",
  "en": "how many",
  "ch": 3
}, {
  "id": 8578,
  "sv": "imorgon",
  "en": "tomorrow",
  "ch": 3,
  "t": "a"
}, {
  "id": 8579,
  "sv": "När är du född",
  "en": "When were you born?",
  "ch": 3
}, {
  "id": 8580,
  "sv": "född",
  "en": "born",
  "ch": 3,
  "t": "a"
}, {
  "id": 8581,
  "sv": "samma år som",
  "en": "same year as",
  "ch": 3
}, {
  "id": 8582,
  "sv": "ojojoj oh",
  "en": "oh no",
  "ch": 3
}, {
  "id": 8583,
  "sv": "jamen",
  "en": "yes, but",
  "ch": 3,
  "t": "i"
}, {
  "id": 8584,
  "sv": "faktiskt inte",
  "en": "actually not",
  "ch": 3
}, {
  "id": 8585,
  "sv": "jag fyller",
  "en": "83 i år I turn 83 this year",
  "ch": 3
}, {
  "id": 8586,
  "sv": "fylla år",
  "en": "turn (age)",
  "c": "(-er, -de, -t)",
  "ch": 3
}, {
  "id": 8587,
  "sv": "hur mycket",
  "en": "how much",
  "ch": 3
}, {
  "id": 8588,
  "sv": "Hur mycket är klockan",
  "en": "What time is it?",
  "ch": 3
}, {
  "id": 8589,
  "sv": "Hon/Den är …",
  "en": "It is …",
  "ch": 3
}, {
  "id": 8590,
  "sv": "halv sju",
  "en": "six thirty",
  "ch": 3
}, {
  "id": 8591,
  "sv": "kvart i",
  "en": "quarter to",
  "ch": 3
}, {
  "id": 8592,
  "sv": "fem över halv",
  "en": "thrity-five past",
  "ch": 3
}, {
  "id": 8593,
  "sv": "kvart över",
  "en": "quarter past",
  "ch": 3
}, {
  "id": 8594,
  "sv": "fem i",
  "en": "five to",
  "ch": 3
}, {
  "id": 8595,
  "sv": "fem i halv",
  "en": "twenty-five past",
  "ch": 3
}, {
  "id": 8596,
  "sv": "timme",
  "en": "hour",
  "c": "(-en, -ar, -arna)",
  "ch": 3,
  "t": "n",
  "g": "en"
}, {
  "id": 8597,
  "sv": "Kanon",
  "en": "Great!",
  "ch": 3,
  "t": "i"
}, {
  "id": 8598,
  "sv": "vilken tid",
  "en": "what time",
  "ch": 3
}, {
  "id": 8599,
  "sv": "hur dags",
  "en": "what time",
  "ch": 3
}, {
  "id": 8600,
  "sv": "fikapaus",
  "en": "coffee break",
  "c": "(-en,-er, -erna)(= kaffepaus)",
  "ch": 3,
  "t": "n",
  "g": "en"
}, {
  "id": 8601,
  "sv": "sista last",
  "en": "final",
  "ch": 3
}, {
  "id": 8602,
  "sv": "vid fem",
  "en": "at five",
  "ch": 3
}, {
  "id": 8603,
  "sv": "ta",
  "en": "take",
  "c": "(tar, tog, tagit)",
  "ch": 3,
  "t": "v"
}, {
  "id": 8604,
  "sv": "ta en tupplur",
  "en": "take a nap",
  "c": "(-en, -ar, -arna)",
  "ch": 3
}, {
  "id": 8605,
  "sv": "diska",
  "en": "wash the dishes",
  "c": "(-r, -de, -t)",
  "ch": 3,
  "t": "v"
}, {
  "id": 8606,
  "sv": "teve",
  "en": "tv",
  "c": "(-n, teveapparater, teveapparaterna)",
  "ch": 3,
  "t": "n",
  "g": "en"
}, {
  "id": 8607,
  "sv": "chatta",
  "en": "chat (online)",
  "c": "(-r, -de, -t)",
  "ch": 3,
  "t": "v"
}, {
  "id": 8608,
  "sv": "gå och lägga sig",
  "en": "go to bed",
  "ch": 3
}, {
  "id": 8609,
  "sv": "jämföra",
  "en": "compare",
  "c": "(jämför, -de, -t)",
  "ch": 3,
  "t": "v"
}, {
  "id": 8610,
  "sv": "danskurs",
  "en": "dance course",
  "c": "(-en, -er, -erna)",
  "ch": 3,
  "t": "n",
  "g": "en"
}, {
  "id": 8611,
  "sv": "idag",
  "en": "today",
  "ch": 3,
  "t": "a"
}, {
  "id": 8612,
  "sv": "pommes frites",
  "en": "french fries",
  "ch": 3
}, {
  "id": 8613,
  "sv": "bearnaisesås",
  "en": "Bernaise sauce",
  "c": "(-en)",
  "ch": 3,
  "t": "n",
  "g": "en"
}, {
  "id": 8614,
  "sv": "på eftermiddagen",
  "en": "in the afternoon",
  "ch": 3
}, {
  "id": 8615,
  "sv": "eftermiddag",
  "en": "afternoon",
  "c": "(-en, -ar, -arna)",
  "ch": 3,
  "t": "n",
  "g": "en"
}, {
  "id": 8616,
  "sv": "favoritprogram",
  "en": "favorite show",
  "c": "(-met, –, -men)",
  "ch": 3,
  "t": "n",
  "g": "ett"
}, {
  "id": 8617,
  "sv": "sedan then",
  "en": "afterwards",
  "ch": 3
}, {
  "id": 8618,
  "sv": "Tyskland",
  "en": "Germany",
  "ch": 3,
  "t": "pn"
}, {
  "id": 8619,
  "sv": "reflexiva verb",
  "en": "reflexive verbs",
  "ch": 3
}, {
  "id": 8620,
  "sv": "på kvällen",
  "en": "in the evening",
  "ch": 3
}, {
  "id": 8621,
  "sv": "bestämd form",
  "en": "definite form",
  "ch": 3
}, {
  "id": 8622,
  "sv": "båda",
  "en": "both",
  "ch": 3,
  "t": "p"
}, {
  "id": 8623,
  "sv": "åh",
  "en": "oh",
  "ch": 3,
  "t": "i"
}, {
  "id": 8624,
  "sv": "God natt",
  "en": "Good night!",
  "ch": 3
}, {
  "id": 8625,
  "sv": "Sov gott",
  "en": "Sleep well!",
  "ch": 3
}, {
  "id": 8626,
  "sv": "köpcentrum",
  "en": "mall",
  "c": "(köpcentret, –, köpcentren)",
  "ch": 3,
  "t": "n",
  "g": "ett"
}, {
  "id": 8627,
  "sv": "rakt fram",
  "en": "straight ahead",
  "ch": 3
}, {
  "id": 8628,
  "sv": "det ligger",
  "en": "it is located",
  "ch": 3
}, {
  "id": 8629,
  "sv": "höger sida",
  "en": "on the right hand side",
  "ch": 3
}, {
  "id": 8630,
  "sv": "imperativ",
  "en": "imperative",
  "ch": 3,
  "t": "n",
  "g": "en"
}, {
  "id": 8631,
  "sv": "ordföljd",
  "en": "word order",
  "c": "(-en)",
  "ch": 3,
  "t": "n",
  "g": "en"
}, {
  "id": 8632,
  "sv": "yoga",
  "en": "yoga",
  "c": "(-r, -de, -t)",
  "ch": 3,
  "t": "n",
  "g": "en"
}, {
  "id": 8633,
  "sv": "örtte",
  "en": "herbal tea",
  "c": "(-t, -er, -erna)",
  "ch": 3,
  "t": "n",
  "g": "ett"
}, {
  "id": 8634,
  "sv": "mineralvatten",
  "en": "mineral water",
  "c": "(mineralvattnet)",
  "ch": 3,
  "t": "n",
  "g": "ett"
}, {
  "id": 8635,
  "sv": "champagne",
  "en": "champagne",
  "c": "(-n)",
  "ch": 3,
  "t": "n",
  "g": "en"
}, {
  "id": 8636,
  "sv": "närbutik",
  "en": "local grocery store",
  "c": "(-n, -er, -erna)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8637,
  "sv": "kontantkort",
  "en": "prepaid card",
  "c": "(-et, −, -en)",
  "ch": 4,
  "t": "n",
  "g": "ett"
}, {
  "id": 8638,
  "sv": "näsduk",
  "en": "handkerchief",
  "c": "(-en, -ar, -arna)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8639,
  "sv": "jättehungrig",
  "en": "really hungry",
  "c": "(-t, -a)",
  "ch": 4,
  "t": "a"
}, {
  "id": 8640,
  "sv": "kebabställe",
  "en": "kebab place",
  "c": "(-t, −, -ena)",
  "ch": 4,
  "t": "n",
  "g": "ett"
}, {
  "id": 8641,
  "sv": "gärna happily",
  "en": "willingly",
  "ch": 4
}, {
  "id": 8642,
  "sv": "klockan tre three",
  "en": "o’clock",
  "ch": 4
}, {
  "id": 8643,
  "sv": "annan dag",
  "en": "another day",
  "t": "n",
  "g": "en",
  "ch": 4
}, {
  "id": 8644,
  "sv": "hjälpverb",
  "en": "helping verbs, auxiliary verbs",
  "ch": 4,
  "t": "n",
  "g": "ett"
}, {
  "id": 8645,
  "sv": "muntlig övning",
  "en": "oral exercise",
  "c": "(-en, -ar, -arna)",
  "ch": 4
}, {
  "id": 8646,
  "sv": "skulle vilja",
  "en": "would like to",
  "ch": 4
}, {
  "id": 8647,
  "sv": "Något annat",
  "en": "Anything else?",
  "ch": 4
}, {
  "id": 8648,
  "sv": "javisst yes",
  "en": "of course",
  "ch": 4
}, {
  "id": 8649,
  "sv": "mer",
  "en": "more",
  "ch": 4,
  "t": "a"
}, {
  "id": 8650,
  "sv": "nej tack",
  "en": "no thank you",
  "ch": 4
}, {
  "id": 8651,
  "sv": "Det var bra så.",
  "en": "That is all.",
  "ch": 4
}, {
  "id": 8652,
  "sv": "Det blir … kronor.",
  "en": "That comes to… kronor.",
  "ch": 4
}, {
  "id": 8653,
  "sv": "Tar ni kort",
  "en": "Do you take credit cards?",
  "ch": 4
}, {
  "id": 8654,
  "sv": "leg",
  "en": "ID",
  "c": "(-et, -, -en) (legitimation)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8655,
  "sv": "falafelmeny",
  "en": "falafel menu",
  "c": "(-n, -er, -erna)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8656,
  "sv": "Vill du äta här eller ta med",
  "en": "Do you want to eat here,",
  "ch": 4
}, {
  "id": 8657,
  "sv": "or do you want this to go",
  "en": "mellanläsk (-en, -, -en) medium soft drink",
  "ch": 4
}, {
  "id": 8658,
  "sv": "Var det bra så",
  "en": "Will that be all?",
  "ch": 4
}, {
  "id": 8659,
  "sv": "tjuga",
  "en": "a twenty-kronor bill",
  "c": "(-n, -or, -orna) (en tjugolapp)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8660,
  "sv": "… tack.",
  "en": "one … please.",
  "t": "n",
  "g": "en",
  "ch": 4
}, {
  "id": 8661,
  "sv": "latte",
  "en": "latte",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8662,
  "sv": "Vill du ha",
  "en": "Do you want …?",
  "ch": 4
}, {
  "id": 8663,
  "sv": "lyxbulle",
  "en": "luxury roll",
  "c": "(-en, -ar, arna)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8664,
  "sv": "Jag tar den.",
  "en": "I’ll take it.",
  "ch": 4
}, {
  "id": 8665,
  "sv": "varsågod",
  "en": "you’re welcome",
  "ch": 4,
  "t": "i"
}, {
  "id": 8666,
  "sv": "jag vill ha",
  "en": "I want",
  "ch": 4
}, {
  "id": 8667,
  "sv": "jag skulle vilja ha",
  "en": "I would like",
  "ch": 4
}, {
  "id": 8668,
  "sv": "den/det där",
  "en": "that",
  "ch": 4
}, {
  "id": 8669,
  "sv": "prislista",
  "en": "list of prices",
  "c": "(-n, -or, -orna)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8670,
  "sv": "demonstrativa pronomen",
  "en": "demonstrative pronouns",
  "ch": 4
}, {
  "id": 8671,
  "sv": "dosa",
  "en": "box (small)",
  "c": "(-n, -or, -orna)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8672,
  "sv": "godispåse",
  "en": "bag of candy",
  "c": "(-en, -ar, -arna)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8673,
  "sv": "lunchrestaurang",
  "en": "lunch restaurant",
  "c": "(-en, -er, erna)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8674,
  "sv": "lasagne",
  "en": "lasagna",
  "c": "(-n, -r, -rna)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8675,
  "sv": "ostsmörgås",
  "en": "cheese sandwich",
  "c": "(-en, -ar, -arna)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8676,
  "sv": "räksallad",
  "en": "shrimp salad",
  "c": "(-en, -er, -erna)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8677,
  "sv": "sushi",
  "en": "sushi",
  "c": "(-n)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8678,
  "sv": "thaicurry",
  "en": "Thai curry",
  "c": "(-n)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8679,
  "sv": "wrap",
  "en": "wrap",
  "c": "(-en, -s, -sen)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8680,
  "sv": "brownie",
  "en": "brownie",
  "c": "(-n, -s)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8681,
  "sv": "chokladboll",
  "en": "chocolate ball",
  "c": "(-en, -ar- arna)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8682,
  "sv": "chokadruta",
  "en": "chocolate square",
  "c": "(-n, -or, -orna)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8683,
  "sv": "dammsugare",
  "en": "vacuum cleaner (a type of marzipa treat)",
  "c": "(-n, −, -arna)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8684,
  "sv": "morotskaka",
  "en": "carrot cake",
  "c": "(-n, -or, -orna)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8685,
  "sv": "mazarin",
  "en": "almond pastry",
  "c": "(-en, -er, -erna)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8686,
  "sv": "wienerbröd",
  "en": "Danish pastry",
  "c": "(-et, -en, ena)",
  "ch": 4,
  "t": "n",
  "g": "ett"
}, {
  "id": 8687,
  "sv": "kan jag få",
  "en": "may I have",
  "ch": 4
}, {
  "id": 8688,
  "sv": "Ja tack",
  "en": "nästa? Next, please?",
  "ch": 4
}, {
  "id": 8689,
  "sv": "Något mer",
  "en": "Anything else?",
  "ch": 4
}, {
  "id": 8690,
  "sv": "några",
  "en": "a few",
  "ch": 4,
  "t": "d"
}, {
  "id": 8691,
  "sv": "sammansatta ord",
  "en": "compound words",
  "ch": 4
}, {
  "id": 8692,
  "sv": "snabbmatställe",
  "en": "fast food place",
  "c": "(-t, -n, -ena)",
  "ch": 4,
  "t": "n",
  "g": "ett"
}, {
  "id": 8693,
  "sv": "paprika",
  "en": "pepper",
  "c": "(-n, -or, -orna)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8694,
  "sv": "druva/vindruva",
  "en": "grape",
  "c": "(-n, -or, -orna)",
  "ch": 4
}, {
  "id": 8695,
  "sv": "purjolök",
  "en": "leek",
  "c": "(-en, -ar, -arna)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8696,
  "sv": "Vad kostar det",
  "en": "How much does it cost?",
  "ch": 4
}, {
  "id": 8697,
  "sv": "pluralform",
  "en": "plural form",
  "c": "(-en, -er, -erna)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8698,
  "sv": "mataffär",
  "en": "grocery store",
  "c": "(-en, -er, -erna)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8699,
  "sv": "till vänster",
  "en": "to the left",
  "ch": 4
}, {
  "id": 8700,
  "sv": "till höger",
  "en": "to the right",
  "ch": 4
}, {
  "id": 8701,
  "sv": "bageri",
  "en": "bakery",
  "c": "(-et, -er, -erna)",
  "ch": 4,
  "t": "n",
  "g": "ett"
}, {
  "id": 8702,
  "sv": "chark",
  "en": "cured meat, deli section",
  "c": "(-en)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8703,
  "sv": "snacks",
  "en": "snacks",
  "ch": 4,
  "t": "n"
}, {
  "id": 8704,
  "sv": "bakprodukt",
  "en": "baking ingredient",
  "c": "(-en, -er, -erna)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8705,
  "sv": "Var finns …",
  "en": "Where is … ?",
  "ch": 4
}, {
  "id": 8706,
  "sv": "falukorv",
  "en": "Swedish bologna sausage",
  "c": "(-en, -ar, -arna)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8707,
  "sv": "Ursäkta har ni …",
  "en": "Excuse me, do you have …?",
  "ch": 4
}, {
  "id": 8708,
  "sv": "förlåt mig excuse me",
  "en": "pardon me",
  "ch": 4
}, {
  "id": 8709,
  "sv": "ehh",
  "en": "umm",
  "ch": 4,
  "t": "i"
}, {
  "id": 8710,
  "sv": "parmesanost",
  "en": "Parmesan cheese",
  "c": "(-en, -ar, -arna)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8711,
  "sv": "slut run out",
  "en": "finished",
  "ch": 4
}, {
  "id": 8712,
  "sv": "titta på",
  "en": "look at",
  "ch": 4
}, {
  "id": 8713,
  "sv": "köttfärs",
  "en": "minced meat",
  "c": "(-en, -er, -erna)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8714,
  "sv": "ostbåge",
  "en": "cheese curls, cheese puffs",
  "c": "(-en, -ar, -arna)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8715,
  "sv": "sill",
  "en": "herring",
  "c": "(-en, -ar, -arna)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8716,
  "sv": "saltlakrits",
  "en": "salty licorice",
  "c": "(-et)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8717,
  "sv": "fläskkotlett",
  "en": "pork chop",
  "c": "(-en, -er, -erna)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8718,
  "sv": "duschkräm",
  "en": "body wash",
  "c": "(-en)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8719,
  "sv": "tub",
  "en": "tube",
  "c": "(-en, -er, -erna)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8720,
  "sv": "kaviar",
  "en": "cod roe spread",
  "c": "(-en)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8721,
  "sv": "ketchup",
  "en": "ketchup",
  "c": "(-en)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8722,
  "sv": "knäckebröd",
  "en": "crisp bread",
  "c": "(-et)",
  "ch": 4,
  "t": "n",
  "g": "ett"
}, {
  "id": 8723,
  "sv": "lingonsylt",
  "en": "lingonberry preserves",
  "c": "(-en)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8724,
  "sv": "mjukost",
  "en": "cheese spread",
  "c": "(-en, -ar, -arna)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8725,
  "sv": "schampo",
  "en": "shampoo",
  "c": "(-t, -n, -na)",
  "ch": 4,
  "t": "n",
  "g": "ett"
}, {
  "id": 8726,
  "sv": "tandkräm",
  "en": "toothpaste",
  "c": "(-en, -er, -erna)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8727,
  "sv": "tandpetare",
  "en": "toothpick",
  "c": "(-n, −, -na)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8728,
  "sv": "Vad ska vi äta",
  "en": "What are we going to eat?",
  "ch": 4
}, {
  "id": 8729,
  "sv": "Vad gott",
  "en": "Delicious!",
  "ch": 4
}, {
  "id": 8730,
  "sv": "sugen",
  "en": "have a craving",
  "ch": 4,
  "t": "a"
}, {
  "id": 8731,
  "sv": "pytt i panna",
  "en": "hash",
  "c": "(-n)",
  "ch": 4
}, {
  "id": 8732,
  "sv": "id-kort",
  "en": "ID card",
  "c": "(-et, −, -en)",
  "ch": 4,
  "t": "n",
  "g": "ett"
}, {
  "id": 8733,
  "sv": "Australien",
  "en": "Australia",
  "ch": 4,
  "t": "pn"
}, {
  "id": 8734,
  "sv": "Spanien",
  "en": "Spain",
  "ch": 4,
  "t": "pn"
}, {
  "id": 8735,
  "sv": "Vad ska du äta till middag",
  "en": "What are you having for dinner",
  "ch": 4
}, {
  "id": 8736,
  "sv": "inköpslista",
  "en": "grocery list",
  "c": "(-n, -or, -orna)",
  "ch": 4,
  "t": "n",
  "g": "en"
}, {
  "id": 8737,
  "sv": "riven ost",
  "en": "grated cheese",
  "ch": 4
}, {
  "id": 8738,
  "sv": "Ska vi gå på …",
  "en": "Shall we go to …?",
  "ch": 5
}, {
  "id": 8739,
  "sv": "experimentteater",
  "en": "experimental theater",
  "c": "(-n, experimentteatrar, experimentteatrarna)",
  "ch": 5,
  "t": "n",
  "g": "en"
}, {
  "id": 8740,
  "sv": "Vilken dag",
  "en": "Which day?",
  "ch": 5
}, {
  "id": 8741,
  "sv": "Vad synd",
  "en": "Too bad!",
  "ch": 5
}, {
  "id": 8742,
  "sv": "Vad ska ni se",
  "en": "What are you going to see?",
  "ch": 5
}, {
  "id": 8743,
  "sv": "Var går den",
  "en": "Where does it play?",
  "ch": 5
}, {
  "id": 8744,
  "sv": "Den börjar klockan …",
  "en": "It starts at …",
  "ch": 5
}, {
  "id": 8745,
  "sv": "ta ett glas …",
  "en": "have a glass of …",
  "ch": 5
}, {
  "id": 8746,
  "sv": "Vilka spelar",
  "en": "Who’s playing?",
  "ch": 5
}, {
  "id": 8747,
  "sv": "Hur så",
  "en": "How so?",
  "ch": 5
}, {
  "id": 8748,
  "sv": "drömspel",
  "en": "dream play",
  "c": "(-et, −, -en)",
  "ch": 5,
  "t": "n",
  "g": "ett"
}, {
  "id": 8749,
  "sv": "inte precis",
  "en": "not exactly",
  "ch": 5
}, {
  "id": 8750,
  "sv": "i stället",
  "en": "instead",
  "ch": 5
}, {
  "id": 8751,
  "sv": "ikväll",
  "en": "tonight",
  "ch": 5,
  "t": "a"
}, {
  "id": 8752,
  "sv": "akrobatisk",
  "en": "acrobatic",
  "c": "(-t, -a)",
  "ch": 5,
  "t": "a"
}, {
  "id": 8753,
  "sv": "varför inte",
  "en": "why not",
  "ch": 5
}, {
  "id": 8754,
  "sv": "hög ton",
  "en": "high pitch",
  "ch": 5
}, {
  "id": 8755,
  "sv": "Jag tycker om att…",
  "en": "I like to…",
  "ch": 5
}, {
  "id": 8756,
  "sv": "Har du/ni lust att",
  "en": "Would you like to?",
  "ch": 5
}, {
  "id": 8757,
  "sv": "vad kul/roligt/skoj",
  "en": "sounds fun",
  "ch": 5
}, {
  "id": 8758,
  "sv": "Kan vi inte … i stället",
  "en": "Couldn't we … instead?",
  "ch": 5
}, {
  "id": 8759,
  "sv": "presens futurum",
  "en": "future tense",
  "ch": 5
}, {
  "id": 8760,
  "sv": "Vad ska ni/du göra på …",
  "en": "What are you doing on …?",
  "ch": 5
}, {
  "id": 8761,
  "sv": "Vad gör du på fritiden",
  "en": "What do you do in your free time?",
  "ch": 5
}, {
  "id": 8762,
  "sv": "klassisk musik",
  "en": "classical music",
  "ch": 5
}, {
  "id": 8763,
  "sv": "vattengympa",
  "en": "water aerobics",
  "c": "(vard)",
  "ch": 5,
  "t": "n",
  "g": "en"
}, {
  "id": 8764,
  "sv": "stan",
  "en": "the city",
  "ch": 5,
  "t": "n",
  "g": "en"
}, {
  "id": 8765,
  "sv": "på landet",
  "en": "in the countryside",
  "ch": 5
}, {
  "id": 8766,
  "sv": "teveserie",
  "en": "tv series",
  "c": "(-n, -er, -erna)",
  "ch": 5,
  "t": "n",
  "g": "en"
}, {
  "id": 8767,
  "sv": "polisserie",
  "en": "cop show, crime drama series",
  "c": "(-n, -r, -rna)",
  "ch": 5,
  "t": "n",
  "g": "en"
}, {
  "id": 8768,
  "sv": "på vintern",
  "en": "in the winter",
  "ch": 5
}, {
  "id": 8769,
  "sv": "vi tror att we believe that",
  "en": "we think that",
  "ch": 5
}, {
  "id": 8770,
  "sv": "Tror ni",
  "en": "Do you think so?",
  "ch": 5
}, {
  "id": 8771,
  "sv": "adverb",
  "en": "adverb",
  "c": "(-et, −, -en)",
  "ch": 5,
  "t": "n",
  "g": "ett"
}, {
  "id": 8772,
  "sv": "special",
  "en": "special",
  "ch": 5,
  "t": "n",
  "g": "en"
}, {
  "id": 8773,
  "sv": "innebandy",
  "en": "floorball",
  "c": "(-n)",
  "ch": 5,
  "t": "n",
  "g": "en"
}, {
  "id": 8774,
  "sv": "trumpet",
  "en": "trumpet",
  "c": "(-en, -er, -erna)",
  "ch": 5,
  "t": "n",
  "g": "en"
}, {
  "id": 8775,
  "sv": "skridsko",
  "en": "skate",
  "c": "(-n, -or, -orna)",
  "ch": 5,
  "t": "n",
  "g": "en"
}, {
  "id": 8776,
  "sv": "skateboard",
  "en": "skateboard",
  "c": "(-en, ar, -arna)",
  "ch": 5,
  "t": "n",
  "g": "en"
}, {
  "id": 8777,
  "sv": "Jag gillar att",
  "en": "I like to",
  "ch": 5
}, {
  "id": 8778,
  "sv": "Vilken … ska vi se",
  "en": "Which… should we watch?",
  "ch": 5
}, {
  "id": 8779,
  "sv": "bioannons",
  "en": "film listings, movie showtimes",
  "c": "(-en, -er, -erna)",
  "ch": 5,
  "t": "n",
  "g": "en"
}, {
  "id": 8780,
  "sv": "skräckfilm",
  "en": "horror movie",
  "c": "(-en, -er, -erna)",
  "ch": 5,
  "t": "n",
  "g": "en"
}, {
  "id": 8781,
  "sv": "hemmakväll",
  "en": "a night in, an evening at home",
  "c": "(-en, -ar, -arna)",
  "ch": 5,
  "t": "n",
  "g": "en"
}, {
  "id": 8782,
  "sv": "i så fall",
  "en": "in that case",
  "ch": 5
}, {
  "id": 8783,
  "sv": "fotbollsmatch",
  "en": "football game, soccer game",
  "c": "(-en, -er, -erna)",
  "ch": 5,
  "t": "n",
  "g": "en"
}, {
  "id": 8784,
  "sv": "koreansk",
  "en": "Korean",
  "c": "(-t, -a)",
  "ch": 5,
  "t": "a"
}, {
  "id": 8785,
  "sv": "tänk själv",
  "en": "think for yourself",
  "ch": 5
}, {
  "id": 8786,
  "sv": "skriv ner",
  "en": "write down",
  "ch": 5
}, {
  "id": 8787,
  "sv": "nyckelord",
  "en": "key words",
  "c": "(-et, −, -en)",
  "ch": 5,
  "t": "n",
  "g": "ett"
}, {
  "id": 8788,
  "sv": "jätterolig",
  "en": "really fun, funny",
  "c": "(-t, -a)",
  "ch": 5,
  "t": "a"
}, {
  "id": 8789,
  "sv": "actionfilm",
  "en": "action movie",
  "c": "(-en, -er, -erna)",
  "ch": 5,
  "t": "n",
  "g": "en"
}, {
  "id": 8790,
  "sv": "science",
  "en": "fiction-film (-en, -er, -erna) science fiction movie",
  "ch": 5
}, {
  "id": 8791,
  "sv": "thriller",
  "en": "thriller",
  "c": "(-n, -ers alt. -rar)",
  "ch": 5,
  "t": "n",
  "g": "en"
}, {
  "id": 8792,
  "sv": "tillbaka",
  "en": "back",
  "ch": 5,
  "t": "a"
}, {
  "id": 8793,
  "sv": "Jag älskar dig",
  "en": "I love you",
  "ch": 5
}, {
  "id": 8794,
  "sv": "Var den bra",
  "en": "Was it good?",
  "ch": 5
}, {
  "id": 8795,
  "sv": "toppenkväll",
  "en": "great night",
  "c": "(-en, -ar, -arna)",
  "ch": 5,
  "t": "n",
  "g": "en"
}, {
  "id": 8796,
  "sv": "preteritum",
  "en": "past tense",
  "ch": 5,
  "t": "n",
  "g": "ett"
}, {
  "id": 8797,
  "sv": "ändelse",
  "en": "suffix",
  "c": "(-n, -er, -erna)",
  "ch": 5,
  "t": "n",
  "g": "en"
}, {
  "id": 8798,
  "sv": "fader",
  "en": "father",
  "c": "(fadern, fäder, fäderna)",
  "ch": 5,
  "t": "n",
  "g": "en"
}, {
  "id": 8799,
  "sv": "vampyr",
  "en": "vampire",
  "c": "(-en, -er, -erna)",
  "ch": 5,
  "t": "n",
  "g": "en"
}, {
  "id": 8800,
  "sv": "förkyld",
  "en": "have a cold",
  "c": "(förkylt, -a)",
  "ch": 5,
  "t": "a"
}, {
  "id": 8801,
  "sv": "byt",
  "en": "change",
  "ch": 5,
  "t": "v"
}, {
  "id": 8802,
  "sv": "Hör du",
  "en": "Do you hear?",
  "ch": 5
}, {
  "id": 8803,
  "sv": "jogga",
  "en": "jogging",
  "c": "(-r, -de, -t)",
  "ch": 5,
  "t": "v"
}, {
  "id": 8804,
  "sv": "gå ut och äta",
  "en": "go out to eat",
  "ch": 5
}, {
  "id": 8805,
  "sv": "Nobelpristagare",
  "en": "Nobel prize winner",
  "c": "(-n, −, -arna)",
  "ch": 6,
  "t": "n",
  "g": "en"
}, {
  "id": 8806,
  "sv": "stadshus",
  "en": "city hall",
  "c": "(-et, −, -en)",
  "ch": 6,
  "t": "n",
  "g": "ett"
}, {
  "id": 8807,
  "sv": "Är det sant",
  "en": "Is it true? Really?",
  "ch": 6
}, {
  "id": 8808,
  "sv": "80-talet",
  "en": "eighties",
  "ch": 6,
  "t": "n",
  "g": "ett"
}, {
  "id": 8809,
  "sv": "forskningsstipendium",
  "en": "research grant",
  "ch": 6,
  "t": "n",
  "g": "ett"
}, {
  "id": 8810,
  "sv": "molekyl",
  "en": "molecule",
  "c": "(-en, -er, -erna)",
  "ch": 6,
  "t": "n",
  "g": "en"
}, {
  "id": 8811,
  "sv": "i höstas last fall",
  "en": "autumn",
  "ch": 6
}, {
  "id": 8812,
  "sv": "plastförälder",
  "en": "step parent",
  "c": "(-n, plastföräldrar, plastföräldrarna)",
  "ch": 6,
  "t": "n",
  "g": "en"
}, {
  "id": 8813,
  "sv": "bonussyskon",
  "en": "step-siblings",
  "c": "(-et, −, -en)",
  "ch": 6,
  "t": "n",
  "g": "ett"
}, {
  "id": 8814,
  "sv": "släktmiddag",
  "en": "family dinner",
  "c": "(-en, -ar, -arna) (extended)",
  "ch": 6,
  "t": "n",
  "g": "en"
}, {
  "id": 8815,
  "sv": "julmat",
  "en": "Christmas food",
  "c": "(-en)",
  "ch": 6,
  "t": "n",
  "g": "en"
}, {
  "id": 8816,
  "sv": "prisutdelning",
  "en": "award ceremony",
  "c": "(-en, -ar, -arna)",
  "ch": 6,
  "t": "n",
  "g": "en"
}, {
  "id": 8817,
  "sv": "nästa gång",
  "en": "next time",
  "ch": 6
}, {
  "id": 8818,
  "sv": "objektspronomen",
  "en": "object pronoun",
  "ch": 6,
  "t": "n",
  "g": "ett"
}, {
  "id": 8819,
  "sv": "mig",
  "en": "me",
  "ch": 6,
  "t": "p"
}, {
  "id": 8820,
  "sv": "dig",
  "en": "you",
  "ch": 6,
  "t": "p"
}, {
  "id": 8821,
  "sv": "den/det",
  "en": "it",
  "ch": 6
}, {
  "id": 8822,
  "sv": "dem",
  "en": "them",
  "ch": 6,
  "t": "p"
}, {
  "id": 8823,
  "sv": "tidsadverb",
  "en": "adverbs of time",
  "c": "(-et, −, -en)",
  "ch": 6,
  "t": "n",
  "g": "ett"
}, {
  "id": 8824,
  "sv": "far",
  "en": "father",
  "c": "(fadern, fäder, fädren)",
  "ch": 6,
  "t": "n",
  "g": "en"
}, {
  "id": 8825,
  "sv": "mor",
  "en": "mother",
  "c": "(modern, mödrar, mödrarna)",
  "ch": 6,
  "t": "n",
  "g": "en"
}, {
  "id": 8826,
  "sv": "plastpappa",
  "en": "stepfather",
  "c": "(-n, -or, -orna)",
  "ch": 6,
  "t": "n",
  "g": "en"
}, {
  "id": 8827,
  "sv": "låtsaspappa",
  "en": "stepfather",
  "c": "(-n, -or, -orna)",
  "ch": 6,
  "t": "n",
  "g": "en"
}, {
  "id": 8828,
  "sv": "regnbåge",
  "en": "rainbow",
  "c": "(-n, -ar, -arna)",
  "ch": 6,
  "t": "n",
  "g": "en"
}, {
  "id": 8829,
  "sv": "regnbågsfamilj",
  "en": "rainbow family",
  "c": "(-en, -er, -erna)",
  "ch": 6,
  "t": "n",
  "g": "en"
}, {
  "id": 8830,
  "sv": "relativt pronomen",
  "en": "relative pronoun",
  "ch": 6
}, {
  "id": 8831,
  "sv": "meteorolog",
  "en": "meteorologist",
  "c": "(-en, -er, -erna)",
  "ch": 6,
  "t": "n",
  "g": "en"
}, {
  "id": 8832,
  "sv": "ge",
  "en": "respons respond, react",
  "c": "(-r, gav, gett)",
  "ch": 6,
  "t": "v"
}, {
  "id": 8833,
  "sv": "dansare",
  "en": "dancer",
  "c": "(-n, −, -na)",
  "ch": 6,
  "t": "n",
  "g": "en"
}, {
  "id": 8834,
  "sv": "Vad heter din …",
  "en": "What is the name of your … ?",
  "ch": 6
}, {
  "id": 8835,
  "sv": "Din då",
  "en": "What about yours?",
  "ch": 6
}, {
  "id": 8836,
  "sv": "Nämen",
  "en": "No, really!",
  "ch": 6,
  "t": "i"
}, {
  "id": 8837,
  "sv": "Nederländerna",
  "en": "Netherlands",
  "ch": 6,
  "t": "pn"
}, {
  "id": 8838,
  "sv": "possesiva pronomen",
  "en": "possesive pronouns",
  "ch": 6
}, {
  "id": 8839,
  "sv": "ditt",
  "en": "your",
  "ch": 6,
  "t": "p"
}, {
  "id": 8840,
  "sv": "dina",
  "en": "your",
  "ch": 6,
  "t": "p"
}, {
  "id": 8841,
  "sv": "Stämmer det",
  "en": "Is that correct?",
  "ch": 6
}, {
  "id": 8842,
  "sv": "flera gånger",
  "en": "several times",
  "ch": 6
}, {
  "id": 8843,
  "sv": "dynamit",
  "en": "dynamite",
  "c": "(-en)",
  "ch": 6,
  "t": "n",
  "g": "en"
}, {
  "id": 8844,
  "sv": "Nobeldagen",
  "en": "Nobel Day",
  "ch": 6,
  "t": "pn"
}, {
  "id": 8845,
  "sv": "Carl XIV Gustav",
  "en": "Carl Gustav XIV, King of Sweden",
  "ch": 6
}, {
  "id": 8846,
  "sv": "konserthus",
  "en": "concert hall",
  "c": "(-et, −, -en)",
  "ch": 6,
  "t": "n",
  "g": "ett"
}, {
  "id": 8847,
  "sv": "riksbanken",
  "en": "the national bank",
  "c": "(-en, -er, -erna)",
  "ch": 6,
  "t": "pn"
}, {
  "id": 8848,
  "sv": "samma dag",
  "en": "same day",
  "ch": 6
}, {
  "id": 8849,
  "sv": "fredspris",
  "en": "peace prize",
  "c": "(-et)",
  "ch": 6,
  "t": "n",
  "g": "ett"
}, {
  "id": 8850,
  "sv": "prissumma",
  "en": "prize sum",
  "c": "(-n, or, -orna)",
  "ch": 6,
  "t": "n",
  "g": "en"
}, {
  "id": 8851,
  "sv": "festsal",
  "en": "ballroom",
  "c": "(-en, -ar, -arna)",
  "ch": 6,
  "t": "n",
  "g": "en"
}, {
  "id": 8852,
  "sv": "växa upp",
  "en": "grow up",
  "ch": 6
}, {
  "id": 8853,
  "sv": "nitroglycerin",
  "en": "nitroglycerin",
  "c": "(-en, −, -et)",
  "ch": 6,
  "t": "n",
  "g": "ett"
}, {
  "id": 8854,
  "sv": "tjäna pengar",
  "en": "earn money",
  "ch": 6
}, {
  "id": 8855,
  "sv": "cirka",
  "en": "approximately",
  "ch": 6,
  "t": "a"
}, {
  "id": 8856,
  "sv": "understruken",
  "en": "underlined",
  "c": "(understrukna)",
  "ch": 6,
  "t": "a"
}, {
  "id": 8857,
  "sv": "Portugal",
  "en": "Portugal",
  "ch": 6,
  "t": "pn"
}, {
  "id": 8858,
  "sv": "alltså so",
  "en": "thus",
  "ch": 6
}, {
  "id": 8859,
  "sv": "tenniskarriär",
  "en": "tennis career",
  "ch": 6,
  "t": "n",
  "g": "en"
}, {
  "id": 8860,
  "sv": "klädfirma",
  "en": "clothing company",
  "c": "(-n, -or, -orna)",
  "ch": 6,
  "t": "n",
  "g": "en"
}, {
  "id": 8861,
  "sv": "Kan du säga det igen",
  "en": "Could you say that again?",
  "ch": 6
}, {
  "id": 8862,
  "sv": "Lite långsammare",
  "en": "tack. A bit slower, thanks.",
  "ch": 6
}, {
  "id": 8863,
  "sv": "En gång till",
  "en": "One more time!",
  "ch": 6
}, {
  "id": 8864,
  "sv": "Va",
  "en": "What?",
  "ch": 6,
  "t": "i"
}, {
  "id": 8865,
  "sv": "är känd för",
  "en": "is known for",
  "ch": 6
}, {
  "id": 8866,
  "sv": "som vuxen",
  "en": "as an adult",
  "ch": 6
}, {
  "id": 8867,
  "sv": "sent i livet",
  "en": "late in life",
  "ch": 6
}, {
  "id": 8868,
  "sv": "uppfinnare",
  "en": "inventor",
  "c": "(-n, −, -na)",
  "ch": 6,
  "t": "n",
  "g": "en"
}, {
  "id": 8869,
  "sv": "jqshopping",
  "en": "shopping",
  "c": "(-en)",
  "ch": 7,
  "t": "n",
  "g": "en"
}, {
  "id": 8870,
  "sv": "galleria",
  "en": "mall, deparment store",
  "c": "(-n, -or, orna)",
  "ch": 7,
  "t": "n",
  "g": "en"
}, {
  "id": 8871,
  "sv": "småsaker",
  "en": "small things, odds and ends",
  "c": "(-na)",
  "ch": 7,
  "t": "n"
}, {
  "id": 8872,
  "sv": "hårvax",
  "en": "hair wax",
  "c": "(-et, −, -en)",
  "ch": 7,
  "t": "n",
  "g": "ett"
}, {
  "id": 8873,
  "sv": "ansiktskräm",
  "en": "face cream",
  "c": "(-en, -er, -erna)",
  "ch": 7,
  "t": "n",
  "g": "en"
}, {
  "id": 8874,
  "sv": "i slutet av",
  "en": "at the end of",
  "ch": 7
}, {
  "id": 8875,
  "sv": "outlet",
  "en": "outlet",
  "c": "(-en, -s)",
  "ch": 7,
  "t": "n",
  "g": "en"
}, {
  "id": 8876,
  "sv": "systemkamera",
  "en": "SLR camera",
  "c": "(-n, -or, -orna)",
  "ch": 7,
  "t": "n",
  "g": "en"
}, {
  "id": 8877,
  "sv": "jättedyr",
  "en": "really expensive",
  "c": "(-t, -a)",
  "ch": 7,
  "t": "a"
}, {
  "id": 8878,
  "sv": "fota (fotografera)",
  "en": "photograph, take a photo",
  "c": "(-r, -de, -t)",
  "ch": 7
}, {
  "id": 8879,
  "sv": "mest",
  "en": "mostly",
  "ch": 7,
  "t": "a"
}, {
  "id": 8880,
  "sv": "second hand-affär",
  "en": "second hand shop",
  "c": "(-en, -er, -erna)",
  "ch": 7
}, {
  "id": 8881,
  "sv": "femhundra",
  "en": "five hundred",
  "ch": 7,
  "t": "num"
}, {
  "id": 8882,
  "sv": "hårschampo",
  "en": "shampoo",
  "c": "(-t, -n, -na)",
  "ch": 7,
  "t": "n",
  "g": "ett"
}, {
  "id": 8883,
  "sv": "musikaffär",
  "en": "music store",
  "c": "(-en, -er, -erna)",
  "ch": 7,
  "t": "n",
  "g": "en"
}, {
  "id": 8884,
  "sv": "trumset",
  "en": "drumset",
  "c": "(-et, −, -en)",
  "ch": 7,
  "t": "n",
  "g": "ett"
}, {
  "id": 8885,
  "sv": "begagnad",
  "en": "used, second hand",
  "c": "(-t, -e)",
  "ch": 7,
  "t": "a"
}, {
  "id": 8886,
  "sv": "i våras",
  "en": "last spring",
  "ch": 7
}, {
  "id": 8887,
  "sv": "loppis",
  "en": "flea market",
  "c": "(-en, -ar, -arna)",
  "ch": 7,
  "t": "n",
  "g": "en"
}, {
  "id": 8888,
  "sv": "nätet",
  "en": "the internet",
  "c": "(internet)",
  "ch": 7,
  "t": "n",
  "g": "ett"
}, {
  "id": 8889,
  "sv": "fungera",
  "en": "work",
  "c": "(-r, -de, -t)",
  "ch": 7,
  "t": "v"
}, {
  "id": 8890,
  "sv": "textil",
  "en": "textile",
  "c": "(-en, -er, -erna)",
  "ch": 7,
  "t": "n",
  "g": "en"
}, {
  "id": 8891,
  "sv": "per person",
  "en": "per person",
  "ch": 7
}, {
  "id": 8892,
  "sv": "indefinit pronomen",
  "en": "indefinite pronoun",
  "ch": 7
}, {
  "id": 8893,
  "sv": "byxor",
  "en": "pants, trousers",
  "c": "(-na)",
  "ch": 7,
  "t": "n"
}, {
  "id": 8894,
  "sv": "trosor",
  "en": "womens’ underwear, knickers, pants",
  "c": "(-na)",
  "ch": 7,
  "t": "n"
}, {
  "id": 8895,
  "sv": "bh",
  "en": "bra",
  "c": "(-:n, -:ar, -:arna)",
  "ch": 7,
  "t": "n",
  "g": "en"
}, {
  "id": 8896,
  "sv": "kalsonger",
  "en": "mens’ underwear",
  "c": "(-na)",
  "ch": 7,
  "t": "n"
}, {
  "id": 8897,
  "sv": "randig",
  "en": "striped",
  "c": "(-t, a,)",
  "ch": 7,
  "t": "a"
}, {
  "id": 8898,
  "sv": "rutig",
  "en": "checkered",
  "c": "(-t, -a)",
  "ch": 7,
  "t": "a"
}, {
  "id": 8899,
  "sv": "prickig",
  "en": "spotted, polka-dot",
  "c": "(-t, -a)",
  "ch": 7,
  "t": "a"
}, {
  "id": 8900,
  "sv": "omodern",
  "en": "outdated, old-fashioned",
  "c": "(-t, -a)",
  "ch": 7,
  "t": "a"
}, {
  "id": 8901,
  "sv": "shoppingexperiment",
  "en": "shopping experiment",
  "c": "(-et, −, -en)",
  "ch": 7,
  "t": "n",
  "g": "ett"
}, {
  "id": 8902,
  "sv": "singelmamma",
  "en": "single mother",
  "c": "(-n, -or, -orna)",
  "ch": 7,
  "t": "n",
  "g": "en"
}, {
  "id": 8903,
  "sv": "shoppingstrejk",
  "en": "shopping strike",
  "ch": 7,
  "t": "n",
  "g": "en"
}, {
  "id": 8904,
  "sv": "ute på stan",
  "en": "in town, about town",
  "ch": 7
}, {
  "id": 8905,
  "sv": "Eller hur?",
  "en": "Right?",
  "ch": 7
}, {
  "id": 8906,
  "sv": "inget",
  "en": "no, nothing",
  "ch": 7,
  "t": "d"
}, {
  "id": 8907,
  "sv": "inga",
  "en": "no",
  "ch": 7,
  "t": "d"
}, {
  "id": 8908,
  "sv": "Bra, va?",
  "en": "Great, no?",
  "ch": 7
}, {
  "id": 8909,
  "sv": "på rätt plats",
  "en": "in the right place",
  "ch": 7
}, {
  "id": 8910,
  "sv": "underlakan",
  "en": "sheet",
  "c": "(-et, −, -en)",
  "ch": 7,
  "t": "n",
  "g": "ett"
}, {
  "id": 8911,
  "sv": "örngott",
  "en": "pillowcase",
  "c": "(-et, −, -en)",
  "ch": 7,
  "t": "n",
  "g": "ett"
}, {
  "id": 8912,
  "sv": "påslakan",
  "en": "duvet cover",
  "c": "(-et, −, -en)",
  "ch": 7,
  "t": "n",
  "g": "ett"
}, {
  "id": 8913,
  "sv": "sängavdelning",
  "en": "bed section",
  "c": "(-en , -ar, -arna)",
  "ch": 7,
  "t": "n",
  "g": "en"
}, {
  "id": 8914,
  "sv": "flytta ihop",
  "en": "move in together",
  "ch": 7
}, {
  "id": 8915,
  "sv": "Vad kan jag hjälpa er med?",
  "en": "What can I help you with?",
  "ch": 7
}, {
  "id": 8916,
  "sv": "Det går bra",
  "en": "You are welcome to",
  "c": "(att)",
  "ch": 7
}, {
  "id": 8917,
  "sv": "dubbelsäng",
  "en": "double bed",
  "c": "(-en, -ar, -arna)",
  "ch": 7,
  "t": "n",
  "g": "en"
}, {
  "id": 8918,
  "sv": "Det låter bra.",
  "en": "That sounds good.",
  "ch": 7
}, {
  "id": 8919,
  "sv": "kvalitet",
  "en": "quality",
  "c": "(-en, -er, -erna)",
  "ch": 7,
  "t": "n",
  "g": "en"
}, {
  "id": 8920,
  "sv": "just nu",
  "en": "right now",
  "ch": 7
}, {
  "id": 8921,
  "sv": "specialerbjudande",
  "en": "special offer",
  "ch": 7,
  "t": "n",
  "g": "ett"
}, {
  "id": 8922,
  "sv": "duntäcke",
  "en": "down duvet",
  "c": "(-t, -n, -na)",
  "ch": 7,
  "t": "n",
  "g": "ett"
}, {
  "id": 8923,
  "sv": "extra kostnad",
  "en": "extra cost",
  "ch": 7
}, {
  "id": 8924,
  "sv": "sänglampa",
  "en": "bedside lamp",
  "c": "(-n, -or, -orna)",
  "ch": 7,
  "t": "n",
  "g": "en"
}, {
  "id": 8925,
  "sv": "halva priset",
  "en": "half price",
  "ch": 7
}, {
  "id": 8926,
  "sv": "plural",
  "en": "plural",
  "ch": 7,
  "t": "n",
  "g": "en"
}, {
  "id": 8927,
  "sv": "öppet köp",
  "en": "refund policy",
  "ch": 7
}, {
  "id": 8928,
  "sv": "Hur mycket får de kosta?",
  "en": "How much can they cost?",
  "ch": 7
}, {
  "id": 8929,
  "sv": "Passar de bra?",
  "en": "Do they fit well?",
  "ch": 7
}, {
  "id": 8930,
  "sv": "Hur mycket kostar den?",
  "en": "How much does it cost?",
  "ch": 7
}, {
  "id": 8931,
  "sv": "storlek mindre",
  "en": "one size smaller",
  "t": "n",
  "g": "en",
  "ch": 7
}, {
  "id": 8932,
  "sv": "storlek större",
  "en": "one size larger",
  "t": "n",
  "g": "en",
  "ch": 7
}, {
  "id": 8933,
  "sv": "Vilken storlek har du?",
  "en": "What size are you?",
  "ch": 7
}, {
  "id": 8934,
  "sv": "Vill du ha hjälp?",
  "en": "Would you like some help?",
  "ch": 7
}, {
  "id": 8935,
  "sv": "Kan jag hjälpa till?",
  "en": "Can I help you?",
  "ch": 7
}, {
  "id": 8936,
  "sv": "för stora",
  "en": "too large",
  "ch": 7
}, {
  "id": 8937,
  "sv": "för små",
  "en": "too small",
  "ch": 7
}, {
  "id": 8938,
  "sv": "bytesrätt",
  "en": "right to exchange",
  "c": "(-en, -er, -erna)",
  "ch": 7,
  "t": "n",
  "g": "en"
}, {
  "id": 8939,
  "sv": "ögonskugga",
  "en": "eye shadow",
  "c": "(-n, -or, -orna)",
  "ch": 7,
  "t": "n",
  "g": "en"
}, {
  "id": 8940,
  "sv": "då ska vi se",
  "en": "let's see",
  "ch": 7
}, {
  "id": 8941,
  "sv": "Jag tittar bara.",
  "en": "I’m just looking.",
  "ch": 7
}, {
  "id": 8942,
  "sv": "Säg till om du behöver hjälp.",
  "en": "Let me know if you need help.",
  "ch": 7
}, {
  "id": 8943,
  "sv": "löparsko",
  "en": "running shoe",
  "c": "( -n-, -r, -rna)",
  "ch": 7,
  "t": "n",
  "g": "en"
}, {
  "id": 8944,
  "sv": "Kan du hjälpa mig?",
  "en": "Can you help me",
  "ch": 7
}, {
  "id": 8945,
  "sv": "spela roll",
  "en": "matter",
  "ch": 7
}, {
  "id": 8946,
  "sv": "löpband",
  "en": "treadmill",
  "c": "(-et, −, -en)",
  "ch": 7,
  "t": "n",
  "g": "ett"
}, {
  "id": 8947,
  "sv": "Sitter de bra?",
  "en": "Do they fit well?",
  "ch": 7
}, {
  "id": 8948,
  "sv": "komparation",
  "en": "comparison",
  "ch": 7,
  "t": "n",
  "g": "en"
}, {
  "id": 8949,
  "sv": "vildmark",
  "en": "wilderness",
  "c": "(-en, −, -erna)",
  "ch": 7,
  "t": "n",
  "g": "en"
}, {
  "id": 8950,
  "sv": "fleece-tröja",
  "en": "fleece sweater",
  "c": "(-n, -or, -orna)",
  "ch": 7,
  "t": "n",
  "g": "en"
}, {
  "id": 8951,
  "sv": "sportstrumpa",
  "en": "sports socks",
  "c": "(-n, -or, -orna)",
  "ch": 7,
  "t": "n",
  "g": "en"
}, {
  "id": 8952,
  "sv": "Hur kan jag hjälpa dig?",
  "en": "How can I help you?",
  "ch": 7
}, {
  "id": 8953,
  "sv": "Ursäkta/ Förlåt, har du tid?",
  "en": "Excuse me/I'm sorry, do you have a moment?",
  "ch": 7
}, {
  "id": 8954,
  "sv": "Jag tänkte köpa…",
  "en": "I’d like to buy…",
  "ch": 7
}, {
  "id": 8955,
  "sv": "Har ni …?",
  "en": "Do you have…?",
  "ch": 7
}, {
  "id": 8956,
  "sv": "Vill du prova?",
  "en": "Would you like to try it on?",
  "ch": 7
}, {
  "id": 8957,
  "sv": "Hur var den/det/de?",
  "en": "How was it/were they?",
  "ch": 7
}, {
  "id": 8958,
  "sv": "Har ni några större/mindre?",
  "en": "Do you have any in a larger/smaller size?",
  "ch": 7
}, {
  "id": 8959,
  "sv": "Tack för hjälpen.",
  "en": "Thanks for your help.",
  "ch": 7
}, {
  "id": 8960,
  "sv": "prata engelska",
  "en": "speak English",
  "ch": 7
}, {
  "id": 8961,
  "sv": "Jag läser svenska.",
  "en": "I study Swedish.",
  "ch": 7
}, {
  "id": 8962,
  "sv": "Jag lär mig svenska.",
  "en": "I am learning Swedish",
  "ch": 7
}, {
  "id": 8963,
  "sv": "Har du tid?",
  "en": "Do you have a moment?",
  "ch": 7
}, {
  "id": 8964,
  "sv": "Hur gick det?",
  "en": "How did it go?",
  "ch": 7
}, {
  "id": 8965,
  "sv": "par gånger",
  "en": "a few times",
  "t": "n",
  "g": "ett",
  "ch": 7
}, {
  "id": 8966,
  "sv": "prislapp",
  "en": "price tag",
  "c": "(-en, -ar, -arna)",
  "ch": 7,
  "t": "n",
  "g": "en"
}, {
  "id": 8967,
  "sv": "Jag ska kolla.",
  "en": "I will check.",
  "ch": 7
}, {
  "id": 8968,
  "sv": "Tack, då vet jag.",
  "en": "Thank you, then I know.",
  "ch": 7
}, {
  "id": 8969,
  "sv": "utrop",
  "en": "exclamation",
  "c": "(-et, −, -en)",
  "ch": 7,
  "t": "n",
  "g": "ett"
}, {
  "id": 8970,
  "sv": "specialpris",
  "en": "special price",
  "c": "(-et, -er, -erna)",
  "ch": 7,
  "t": "n",
  "g": "ett"
}, {
  "id": 8971,
  "sv": "förra året",
  "en": "last year",
  "ch": 7
}, {
  "id": 8972,
  "sv": "neongrön",
  "en": "neon green",
  "c": "(-t, -a)",
  "ch": 7,
  "t": "a"
}, {
  "id": 8973,
  "sv": "bagageband",
  "en": "bagage carousel",
  "c": "(-et, −, -en)",
  "ch": 7,
  "t": "n",
  "g": "ett"
}, {
  "id": 8974,
  "sv": "siden",
  "en": "silk",
  "c": "(-et)",
  "ch": 7,
  "t": "n",
  "g": "ett"
}, {
  "id": 8975,
  "sv": "sidenklänning",
  "en": "silk dress",
  "c": "(-en, -ar, -arna)",
  "ch": 7,
  "t": "n",
  "g": "en"
}, {
  "id": 8976,
  "sv": "Skansen",
  "en": "Skansen",
  "ch": 8,
  "t": "pn"
}, {
  "id": 8977,
  "sv": "friluftsmuseum",
  "en": "open air museum",
  "c": "(-et, -er, -erna)",
  "ch": 8,
  "t": "n",
  "g": "ett"
}, {
  "id": 8978,
  "sv": "vilda djur",
  "en": "wild animals",
  "ch": 8
}, {
  "id": 8979,
  "sv": "säl",
  "en": "seal",
  "c": "(-en, -ar, -arna)",
  "ch": 8,
  "t": "n",
  "g": "en"
}, {
  "id": 8980,
  "sv": "lodjur",
  "en": "lynx",
  "c": "(-et, −, -en)",
  "ch": 8,
  "t": "n",
  "g": "ett"
}, {
  "id": 8981,
  "sv": "SOFO",
  "en": "South of Folkungagatan, an area of Södermalm in Stockholm",
  "ch": 8,
  "t": "pn"
}, {
  "id": 8982,
  "sv": "Drottningholm",
  "en": "location of Drottningholm Palace, residence of royal family",
  "ch": 8,
  "t": "pn"
}, {
  "id": 8983,
  "sv": "slottsteater",
  "en": "palace theater",
  "c": "(-n, slottsteatrar, slottsteatrarna)",
  "ch": 8,
  "t": "n",
  "g": "en"
}, {
  "id": 8984,
  "sv": "första gången",
  "en": "first time",
  "ch": 8
}, {
  "id": 8985,
  "sv": "Kanada",
  "en": "Canada",
  "ch": 8,
  "t": "pn"
}, {
  "id": 8986,
  "sv": "väderprognos",
  "en": "weather forecast",
  "c": "(-en, -er, -erna)",
  "ch": 8,
  "t": "n",
  "g": "en"
}, {
  "id": 8987,
  "sv": "regnkläder",
  "en": "rainclothes",
  "c": "(-na)",
  "ch": 8,
  "t": "n"
}, {
  "id": 8988,
  "sv": "solglasögon",
  "en": "sunglasses",
  "c": "(-en)",
  "ch": 8,
  "t": "n"
}, {
  "id": 8989,
  "sv": "varm tröja",
  "en": "warm sweater",
  "ch": 8
}, {
  "id": 8990,
  "sv": "myggmedel",
  "en": "moquito",
  "c": "(myggmedlet, −, myggmedlen)",
  "ch": 8,
  "t": "n",
  "g": "ett"
}, {
  "id": 8991,
  "sv": "repellent hemma hos",
  "en": "at the home of",
  "ch": 8
}, {
  "id": 8992,
  "sv": "mitt i stan",
  "en": "in the middle of the city, downtown",
  "ch": 8
}, {
  "id": 8993,
  "sv": "göra-lista",
  "en": "to-do list",
  "t": "v",
  "ch": 8
}, {
  "id": 8994,
  "sv": "gå på museum",
  "en": "go to a museum",
  "ch": 8
}, {
  "id": 8995,
  "sv": "promenera i …",
  "en": "take a walk in…",
  "ch": 8
}, {
  "id": 8996,
  "sv": "designprylar",
  "en": "design stuff",
  "ch": 8,
  "t": "n"
}, {
  "id": 8997,
  "sv": "gå ut",
  "en": "go out (clubbing)",
  "ch": 8
}, {
  "id": 8998,
  "sv": "Moderna museet",
  "en": "Museum of Modern Art",
  "ch": 8
}, {
  "id": 8999,
  "sv": "paddla",
  "en": "kanot go canoeing",
  "c": "(-r, -de, -t)",
  "ch": 8,
  "t": "v"
}, {
  "id": 9000,
  "sv": "tänk dig att",
  "en": "imagine that",
  "ch": 8
}, {
  "id": 9001,
  "sv": "borde",
  "en": "should",
  "ch": 8,
  "t": "v"
}, {
  "id": 9002,
  "sv": "supinum",
  "en": "supine",
  "ch": 8,
  "t": "n",
  "g": "ett"
}, {
  "id": 9003,
  "sv": "presens perfekt",
  "en": "present perfect",
  "ch": 8
}, {
  "id": 9004,
  "sv": "prickruta",
  "en": "dotted square",
  "c": "(-n)",
  "ch": 8,
  "t": "n",
  "g": "en"
}, {
  "id": 9005,
  "sv": "ordningstal",
  "en": "ordinal numbers",
  "c": "(-et, −, -en)",
  "ch": 8,
  "t": "n",
  "g": "ett"
}, {
  "id": 9006,
  "sv": "trettonde",
  "en": "thirteenth",
  "ch": 8,
  "t": "num"
}, {
  "id": 9007,
  "sv": "fjortonde",
  "en": "fourteenth",
  "ch": 8,
  "t": "num"
}, {
  "id": 9008,
  "sv": "nfemtonde",
  "en": "fifteenth",
  "ch": 8,
  "t": "num"
}, {
  "id": 9009,
  "sv": "sextonde",
  "en": "sixteenth",
  "ch": 8,
  "t": "num"
}, {
  "id": 9010,
  "sv": "sjuttonde",
  "en": "seventeenth",
  "ch": 8,
  "t": "num"
}, {
  "id": 9011,
  "sv": "artonde",
  "en": "eighteenth",
  "ch": 8,
  "t": "num"
}, {
  "id": 9012,
  "sv": "tjugoförsta",
  "en": "twenty-first",
  "ch": 8,
  "t": "num"
}, {
  "id": 9013,
  "sv": "trettioförsta",
  "en": "thirty-first",
  "ch": 8,
  "t": "num"
}, {
  "id": 9014,
  "sv": "första i tolfte",
  "en": "first of December",
  "ch": 8
}, {
  "id": 9015,
  "sv": "Vad är det för datum idag?",
  "en": "What is the date today?",
  "ch": 8
}, {
  "id": 9016,
  "sv": "nationaldag",
  "en": "national day",
  "c": "(-en, -ar, -arna)",
  "ch": 8,
  "t": "n",
  "g": "en"
}, {
  "id": 9017,
  "sv": "o.s.v.",
  "en": "e.t.c",
  "ch": 8
}, {
  "id": 9018,
  "sv": "sommarstuga",
  "en": "summer cottage,",
  "c": "(-n, -or, -orna)",
  "ch": 8,
  "t": "n",
  "g": "en"
}, {
  "id": 9019,
  "sv": "holiday",
  "en": "home",
  "ch": 8
}, {
  "id": 9020,
  "sv": "karaoke",
  "en": "karaoke",
  "c": "(-n)",
  "ch": 8,
  "t": "n",
  "g": "en"
}, {
  "id": 9021,
  "sv": "någon gång",
  "en": "some time",
  "ch": 8
}, {
  "id": 9022,
  "sv": "Det var 2009",
  "en": "It was in 2009",
  "ch": 8
}, {
  "id": 9023,
  "sv": "jättenervös",
  "en": "really nervous",
  "c": "(-t, -a)",
  "ch": 8,
  "t": "a"
}, {
  "id": 9024,
  "sv": "för … år sedan",
  "en": "… years ago",
  "ch": 8
}, {
  "id": 9025,
  "sv": "höjdrädd",
  "en": "afraid of heights",
  "c": "(-a)",
  "ch": 8,
  "t": "a"
}, {
  "id": 9026,
  "sv": "i present",
  "en": "as a gift",
  "ch": 8
}, {
  "id": 9027,
  "sv": "i två år nu",
  "en": "for two years now",
  "ch": 8
}, {
  "id": 9028,
  "sv": "dansgolv",
  "en": "dance floor",
  "c": "(-et, −, -en)",
  "ch": 8,
  "t": "n",
  "g": "ett"
}, {
  "id": 9029,
  "sv": "tidspreposition",
  "en": "preposition of time",
  "ch": 8,
  "t": "n",
  "g": "en"
}, {
  "id": 9030,
  "sv": "åka snowboard",
  "en": "go snowboarding",
  "ch": 8
}, {
  "id": 9031,
  "sv": "åka skridskor",
  "en": "go ice skating",
  "ch": 8
}, {
  "id": 9032,
  "sv": "baka kanelbullar",
  "en": "bake cinnamon rolls",
  "ch": 8
}, {
  "id": 9033,
  "sv": "tälta",
  "en": "go camping (in a tent)",
  "c": "(-r, -ade, -t)",
  "ch": 8,
  "t": "v"
}, {
  "id": 9034,
  "sv": "mejla",
  "en": "email",
  "c": "(-r, -de, -t)",
  "ch": 8,
  "t": "v"
}, {
  "id": 9035,
  "sv": "Vi ses snart!",
  "en": "See you soon!",
  "ch": 8
}, {
  "id": 9036,
  "sv": "Egypten",
  "en": "Egypt",
  "ch": 8,
  "t": "pn"
}, {
  "id": 9037,
  "sv": "Det är varmt.",
  "en": "It is hot.",
  "ch": 8
}, {
  "id": 9038,
  "sv": "Det blåser.",
  "en": "It is windy.",
  "ch": 8
}, {
  "id": 9039,
  "sv": "Det är kallt.",
  "en": "It is cold.",
  "ch": 8
}, {
  "id": 9040,
  "sv": "Det regnar.",
  "en": "It is raining.",
  "ch": 8
}, {
  "id": 9041,
  "sv": "Det åskar.",
  "en": "There is a thunder storm.",
  "ch": 8
}, {
  "id": 9042,
  "sv": "Det snöar.",
  "en": "It is snowing.",
  "ch": 8
}, {
  "id": 9043,
  "sv": "Solen skiner.",
  "en": "The sun is shining.",
  "ch": 8
}, {
  "id": 9044,
  "sv": "Det är dimma.",
  "en": "It is foggy.",
  "ch": 8
}, {
  "id": 9045,
  "sv": "Det är molnigt.",
  "en": "It is cloudy.",
  "ch": 8
}, {
  "id": 9046,
  "sv": "Det är mulet.",
  "en": "It is overcast.",
  "ch": 8
}, {
  "id": 9047,
  "sv": "Vad är det för väder idag?",
  "en": "What is the weather like today?",
  "ch": 8
}, {
  "id": 9048,
  "sv": "sluta röka",
  "en": "stop smoking",
  "ch": 8
}, {
  "id": 9049,
  "sv": "Får man röka här inne?",
  "en": "Can one smoke inside?",
  "ch": 8
}, {
  "id": 9050,
  "sv": "gå ut och röka",
  "en": "go out and smoke",
  "ch": 8
}, {
  "id": 9051,
  "sv": "lägga på",
  "en": "add",
  "ch": 8
}, {
  "id": 9052,
  "sv": "vinterjacka",
  "en": "winter coat",
  "c": "(-n, -or, -orna)",
  "ch": 8,
  "t": "n",
  "g": "en"
}, {
  "id": 9053,
  "sv": "Sverigeresa",
  "en": "trip to Sweden",
  "c": "(-n, -or, -orna)",
  "ch": 8,
  "t": "n",
  "g": "en"
}, {
  "id": 9054,
  "sv": "frågealternativ",
  "en": "multiple choice answers",
  "c": "(-en, −, -ena)",
  "ch": 8,
  "t": "n",
  "g": "ett"
}, {
  "id": 9055,
  "sv": "gå på klubb",
  "en": "go clubbing",
  "ch": 8
}, {
  "id": 9056,
  "sv": "våffla",
  "en": "waffle",
  "c": "(-n, våfflor, våfflorna)",
  "ch": 8,
  "t": "n",
  "g": "en"
}, {
  "id": 9057,
  "sv": "Ska vi bo på vandrarhem/hotell?",
  "en": "Shall we stay at a hostel/hotel?",
  "ch": 8
}, {
  "id": 9058,
  "sv": "i en timme",
  "en": "for an hour",
  "ch": 8
}, {
  "id": 9059,
  "sv": "ex",
  "en": "ex (-boyfriend, -girlfriend)",
  "c": "(-et, −, -en)",
  "ch": 8,
  "t": "n",
  "g": "ett"
}, {
  "id": 9060,
  "sv": "restaurangvagn",
  "en": "restaurant carriage, dining car",
  "c": "(-en, -ar, -arna)",
  "ch": 9,
  "t": "n",
  "g": "en"
}, {
  "id": 9061,
  "sv": "första till vänster",
  "en": "first on the left",
  "ch": 9
}, {
  "id": 9062,
  "sv": "andra till höger",
  "en": "second on the right",
  "ch": 9
}, {
  "id": 9063,
  "sv": "max",
  "en": "max",
  "c": "(maximalt)",
  "ch": 9,
  "t": "a"
}, {
  "id": 9064,
  "sv": "Hur lång tid tar det?",
  "en": "How long does it take?",
  "ch": 9
}, {
  "id": 9065,
  "sv": "mack",
  "en": "gas station, petrol station",
  "c": "(-en ,-ar, -arna)",
  "ch": 9,
  "t": "n",
  "g": "en"
}, {
  "id": 9066,
  "sv": "avgångstid",
  "en": "departure time",
  "c": "(-en, -er, -erna)",
  "ch": 9,
  "t": "n",
  "g": "en"
}, {
  "id": 9067,
  "sv": "handbagage",
  "en": "hand luggage",
  "c": "(-et, −, -en)",
  "ch": 9,
  "t": "n",
  "g": "ett"
}, {
  "id": 9068,
  "sv": "Helsingfors",
  "en": "Helsinki",
  "ch": 9,
  "t": "pn"
}, {
  "id": 9069,
  "sv": "nästa station",
  "en": "next station",
  "ch": 9
}, {
  "id": 9070,
  "sv": "det beror på",
  "en": "it depends",
  "ch": 9
}, {
  "id": 9071,
  "sv": "fast pris",
  "en": "fixed price",
  "ch": 9
}, {
  "id": 9072,
  "sv": "taxameter",
  "en": "taximeter",
  "c": "(-n, taxametrar, taxametrarna)",
  "ch": 9,
  "t": "n",
  "g": "en"
}, {
  "id": 9073,
  "sv": "Mexiko",
  "en": "Mexico",
  "ch": 9,
  "t": "pn"
}, {
  "id": 9074,
  "sv": "gå i tvåan",
  "en": "in second grade",
  "ch": 9
}, {
  "id": 9075,
  "sv": "nollåtta",
  "en": "oh-eight, Stocolmer",
  "c": "(stockholmare)",
  "ch": 9,
  "t": "n",
  "g": "en"
}, {
  "id": 9076,
  "sv": "jättenöjd",
  "en": "very satisfied",
  "c": "(-t, -a)",
  "ch": 9,
  "t": "a"
}, {
  "id": 9077,
  "sv": "sjuttiosexa",
  "en": "someone born in -76",
  "ch": 9,
  "t": "n",
  "g": "en"
}, {
  "id": 9078,
  "sv": "åttiofemma",
  "en": "someone born in -85",
  "ch": 9,
  "t": "n",
  "g": "en"
}, {
  "id": 9079,
  "sv": "femtiosjua",
  "en": "the fifty-seven",
  "ch": 9,
  "t": "n",
  "g": "en"
}, {
  "id": 9080,
  "sv": "yngre",
  "en": "younger",
  "c": "(ung, yngre, yngst)",
  "ch": 9,
  "t": "a"
}, {
  "id": 9081,
  "sv": "sexa whiskey",
  "en": "6 cl of whiskey",
  "t": "n",
  "g": "en",
  "ch": 9
}, {
  "id": 9082,
  "sv": "Vilken tur!",
  "en": "What luck!",
  "ch": 9
}, {
  "id": 9083,
  "sv": "skostorlek",
  "en": "shoe size",
  "c": "(-en, -ar, -arna)",
  "ch": 9,
  "t": "n",
  "g": "en"
}, {
  "id": 9084,
  "sv": "födelseår",
  "en": "birth year",
  "c": "(-et, −, -en)",
  "ch": 9,
  "t": "n",
  "g": "ett"
}, {
  "id": 9085,
  "sv": "gatunummer",
  "en": "street number",
  "c": "(gatunumret, gatunumren)",
  "ch": 9,
  "t": "n",
  "g": "ett"
}, {
  "id": 9086,
  "sv": "våningsplan",
  "en": "floor, storey",
  "c": "(-et, −, -en)",
  "ch": 9,
  "t": "n",
  "g": "ett"
}, {
  "id": 9087,
  "sv": "centiliter alkohol",
  "en": "centiliters of alcohol",
  "ch": 9
}, {
  "id": 9088,
  "sv": "tärningsslag",
  "en": "dice roll",
  "c": "(-et, −, -en)",
  "ch": 9,
  "t": "n",
  "g": "ett"
}, {
  "id": 9089,
  "sv": "årskurs",
  "en": "year, grade",
  "c": "(-en, -er, -erna)",
  "ch": 9,
  "t": "n",
  "g": "en"
}, {
  "id": 9090,
  "sv": "Kommer du ihåg?",
  "en": "Do you remember?",
  "ch": 9
}, {
  "id": 9091,
  "sv": "Indien",
  "en": "India",
  "ch": 9,
  "t": "pn"
}, {
  "id": 9092,
  "sv": "partikelverb",
  "en": "phrasal verb",
  "c": "(-et,−, -en)",
  "ch": 9,
  "t": "n",
  "g": "ett"
}, {
  "id": 9093,
  "sv": "obetonad",
  "en": "unstressed",
  "c": "(-t,-e)",
  "ch": 9,
  "t": "a"
}, {
  "id": 9094,
  "sv": "pendeltåg",
  "en": "commuter train",
  "c": "(-et, −, -en)",
  "ch": 9,
  "t": "n",
  "g": "ett"
}, {
  "id": 9095,
  "sv": "ta flyget",
  "en": "fly, take a plane",
  "ch": 9
}, {
  "id": 9096,
  "sv": "camping",
  "en": "camping",
  "c": "(-en, -ar, -arna)",
  "ch": 9,
  "t": "n",
  "g": "en"
}, {
  "id": 9097,
  "sv": "Köpenhamn",
  "en": "Copenhagen",
  "ch": 9,
  "t": "pn"
}, {
  "id": 9098,
  "sv": "Öresundsbron",
  "en": "Öresund bridge",
  "ch": 9,
  "t": "pn"
}, {
  "id": 9099,
  "sv": "framtidsadverb",
  "en": "adverbs for future",
  "ch": 9,
  "t": "n",
  "g": "ett"
}, {
  "id": 9100,
  "sv": "varje dag",
  "en": "every day",
  "ch": 9
}, {
  "id": 9101,
  "sv": "komma in till/på",
  "en": "arriving at",
  "ch": 9
}, {
  "id": 9102,
  "sv": "byte till",
  "en": "change to",
  "c": "(buss/tåg/båt)",
  "ch": 9
}, {
  "id": 9103,
  "sv": "försenad",
  "en": "delayed",
  "c": "(-t, -e)",
  "ch": 9,
  "t": "a"
}, {
  "id": 9104,
  "sv": "anslutningsbuss",
  "en": "connecting bus",
  "c": "(-en, -ar, -arna)",
  "ch": 9,
  "t": "n",
  "g": "en"
}, {
  "id": 9105,
  "sv": "flygbuss",
  "en": "airport bus",
  "c": "(-en, -ar, -arna)",
  "ch": 9,
  "t": "n",
  "g": "en"
}, {
  "id": 9106,
  "sv": "sista utrop",
  "en": "last call",
  "ch": 9
}, {
  "id": 9107,
  "sv": "flight",
  "en": "flight",
  "ch": 9,
  "t": "n",
  "g": "en"
}, {
  "id": 9108,
  "sv": "gate",
  "en": "gate",
  "c": "(-n, -r, -rna)",
  "ch": 9,
  "t": "n",
  "g": "en"
}, {
  "id": 9109,
  "sv": "Hur kommer vi till …?",
  "en": "How do we get to…?",
  "ch": 9
}, {
  "id": 9110,
  "sv": "receptionist",
  "en": "receptionist",
  "c": "(-en, -er, -erna)",
  "ch": 9,
  "t": "n",
  "g": "en"
}, {
  "id": 9111,
  "sv": "två dagar sen",
  "en": "two days ago",
  "ch": 9
}, {
  "id": 9112,
  "sv": "jättefin",
  "en": "really nice",
  "c": "(-t, -a)",
  "ch": 9,
  "t": "a"
}, {
  "id": 9113,
  "sv": "surrealism",
  "en": "surrealism",
  "c": "(-en)",
  "ch": 9,
  "t": "n",
  "g": "en"
}, {
  "id": 9114,
  "sv": "så långt",
  "en": "so far",
  "ch": 9
}, {
  "id": 9115,
  "sv": "Går bussen ofta?",
  "en": "Does the bus go frequently?",
  "ch": 9
}, {
  "id": 9116,
  "sv": "var tionde",
  "en": "every ten",
  "ch": 9
}, {
  "id": 9117,
  "sv": "fem över",
  "en": "fime past",
  "ch": 9
}, {
  "id": 9118,
  "sv": "och så vidare",
  "en": "and so on",
  "ch": 9,
  "t": "a"
}, {
  "id": 9119,
  "sv": "olika platser",
  "en": "different places",
  "ch": 9
}, {
  "id": 9120,
  "sv": "För en … sedan",
  "en": "a … ago",
  "ch": 9
}, {
  "id": 9121,
  "sv": "tobaksaffär",
  "en": "tobacco shop",
  "c": "(-en, -er, -erna)",
  "ch": 9,
  "t": "n",
  "g": "en"
}, {
  "id": 9122,
  "sv": "mittemot",
  "en": "opposite",
  "ch": 9,
  "t": "a"
}, {
  "id": 9123,
  "sv": "på kartan",
  "en": "on the map",
  "ch": 9
}, {
  "id": 9124,
  "sv": "tvärgata",
  "en": "cross-street",
  "c": "(-n, -or, -orna)",
  "ch": 9,
  "t": "n",
  "g": "en"
}, {
  "id": 9125,
  "sv": "Där ligger…",
  "en": "… is located there",
  "ch": 9
}, {
  "id": 9126,
  "sv": "artificiell ö",
  "en": "artificial island",
  "ch": 9
}, {
  "id": 9127,
  "sv": "på ön",
  "en": "on the island",
  "ch": 9
}, {
  "id": 9128,
  "sv": "inte bara en…",
  "en": "not just a…",
  "ch": 9
}, {
  "id": 9129,
  "sv": "känd person",
  "en": "famous person",
  "ch": 9
}, {
  "id": 9130,
  "sv": "sms-konversation",
  "en": "text conversation",
  "c": "(-en, -er, -erna)",
  "ch": 9,
  "t": "n",
  "g": "en"
}, {
  "id": 9131,
  "sv": "slappa",
  "en": "relax",
  "c": "(-r, -de, -t)",
  "ch": 9,
  "t": "v"
}, {
  "id": 9132,
  "sv": "avslut",
  "en": "ending",
  "c": "(-a)",
  "ch": 9,
  "t": "n",
  "g": "ett"
}, {
  "id": 9133,
  "sv": "hörs",
  "en": "be in touch",
  "ch": 9,
  "t": "v"
}, {
  "id": 9134,
  "sv": "tolva",
  "en": "twelve",
  "c": "(-n, -or, -orna)",
  "ch": 9,
  "t": "n",
  "g": "en"
}, {
  "id": 9135,
  "sv": "Lite om …",
  "en": "A little bit about …",
  "ch": 9
}, {
  "id": 9136,
  "sv": "ligger i",
  "en": "is located in",
  "ch": 9
}, {
  "id": 9137,
  "sv": "fakta om",
  "en": "facts about",
  "ch": 10
}, {
  "id": 9138,
  "sv": "polcirkel",
  "en": "Arctic circle",
  "c": "(-n, polcirklar, polcirklarna)",
  "ch": 10,
  "t": "n",
  "g": "en"
}, {
  "id": 9139,
  "sv": "kustlinje",
  "en": "coastline",
  "c": "(-n, -er, -erna)",
  "ch": 10,
  "t": "n",
  "g": "en"
}, {
  "id": 9140,
  "sv": "tiotusental",
  "en": "tens of thousands",
  "ch": 10,
  "t": "n",
  "g": "ett"
}, {
  "id": 9141,
  "sv": "Gotland&nbsp;",
  "en": "Gotland, island in the Baltic",
  "ch": 10,
  "t": "pn"
}, {
  "id": 9142,
  "sv": "Öland&nbsp;",
  "en": "Öland, island in the Baltic",
  "ch": 10,
  "t": "pn"
}, {
  "id": 9143,
  "sv": "Östersjön",
  "en": "Baltic Sea",
  "ch": 10,
  "t": "pn"
}, {
  "id": 9144,
  "sv": "ytan",
  "en": "the surface",
  "ch": 10,
  "t": "n",
  "g": "en"
}, {
  "id": 9145,
  "sv": "ursprungsbefolkning",
  "en": "indigenous people",
  "c": "(-en, -ar, -arna)",
  "ch": 10,
  "t": "n",
  "g": "en"
}, {
  "id": 9146,
  "sv": "meänkieli&nbsp;",
  "en": "meänkieli, Finnish dialect in Northern Sweden",
  "ch": 10,
  "t": "pn"
}, {
  "id": 9147,
  "sv": "jordbruksland",
  "en": "farmland",
  "c": "(-et, -jordbruksländer, jordbruksländerna)",
  "ch": 10,
  "t": "n",
  "g": "ett"
}, {
  "id": 9148,
  "sv": "emigrera",
  "en": "emigrate",
  "c": "(-r, -de, -t)",
  "ch": 10,
  "t": "v"
}, {
  "id": 9149,
  "sv": "Nordamerika",
  "en": "North America",
  "ch": 10,
  "t": "pn"
}, {
  "id": 9150,
  "sv": "Sydeuropa",
  "en": "Southern Europe",
  "ch": 10,
  "t": "pn"
}, {
  "id": 9151,
  "sv": "sämre",
  "en": "worse",
  "ch": 10,
  "t": "a"
}, {
  "id": 9152,
  "sv": "Latinamerika",
  "en": "Latin America",
  "ch": 10,
  "t": "pn"
}, {
  "id": 9153,
  "sv": "Mellanöstern",
  "en": "Middle East",
  "ch": 10,
  "t": "pn"
}, {
  "id": 9154,
  "sv": "forna Jugoslavien",
  "en": "former Yugoslavia",
  "ch": 10
}, {
  "id": 9155,
  "sv": "EU-medborgare",
  "en": "EU citizen",
  "c": "(-n, −, EU-medborgarna)",
  "ch": 10,
  "t": "n",
  "g": "en"
}, {
  "id": 9156,
  "sv": "femtedel",
  "en": "a fifth",
  "c": "(-en, -ar, -arna)",
  "ch": 10,
  "t": "n",
  "g": "en"
}, {
  "id": 9157,
  "sv": "wood",
  "en": "pulp",
  "ch": 10
}, {
  "id": 9158,
  "sv": "telekom",
  "en": "telecommunications",
  "ch": 10,
  "t": "n",
  "g": "en"
}, {
  "id": 9159,
  "sv": "skogsvaror",
  "en": "forestry goods",
  "ch": 10,
  "t": "n"
}, {
  "id": 9160,
  "sv": "mineralvaror",
  "en": "mineral goods",
  "ch": 10,
  "t": "n"
}, {
  "id": 9161,
  "sv": "kemivaror",
  "en": "chemical goods",
  "ch": 10,
  "t": "n"
}, {
  "id": 9162,
  "sv": "energivaror",
  "en": "energy goods",
  "ch": 10,
  "t": "n"
}, {
  "id": 9163,
  "sv": "verkstadsprodukter",
  "en": "manufactured goods",
  "ch": 10,
  "t": "n"
}, {
  "id": 9164,
  "sv": "övriga",
  "en": "other",
  "ch": 10,
  "t": "d"
}, {
  "id": 9165,
  "sv": "de flesta",
  "en": "most people",
  "ch": 10
}, {
  "id": 9166,
  "sv": "popstjärna",
  "en": "pop star",
  "c": "(-n, -or, -orna)",
  "ch": 10,
  "t": "n",
  "g": "en"
}, {
  "id": 9167,
  "sv": "idrottare",
  "en": "athlete",
  "c": "(-n, −, idrottarna)",
  "ch": 10,
  "t": "n",
  "g": "en"
}, {
  "id": 9168,
  "sv": "operasångare",
  "en": "opera singer",
  "c": "(-n, −, operasångarna)",
  "ch": 10,
  "t": "n",
  "g": "en"
}, {
  "id": 9169,
  "sv": "det mesta",
  "en": "most",
  "ch": 10
}, {
  "id": 9170,
  "sv": "studenttidning",
  "en": "student paper",
  "c": "(-en, -ar, -arna)",
  "ch": 10,
  "t": "n",
  "g": "en"
}, {
  "id": 9171,
  "sv": "utbytesstudent",
  "en": "exchange student",
  "c": "(-en, -er, -erna)",
  "ch": 10,
  "t": "n",
  "g": "en"
}, {
  "id": 9172,
  "sv": "kilometer",
  "en": "kilometer",
  "c": "(-n)",
  "ch": 10,
  "t": "n",
  "g": "en"
}, {
  "id": 9173,
  "sv": "fläskfilé",
  "en": "pork tenderloin",
  "c": "(-n, -er, -erna)",
  "ch": 10,
  "t": "n",
  "g": "en"
}, {
  "id": 9174,
  "sv": "jättekonstig",
  "en": "really strange",
  "c": "(-t, -a)",
  "ch": 10,
  "t": "a"
}, {
  "id": 9175,
  "sv": "mitt på dagen",
  "en": "middle of the day",
  "ch": 10
}, {
  "id": 9176,
  "sv": "kaffe latte",
  "en": "latte",
  "ch": 10
}, {
  "id": 9177,
  "sv": "jättegullig",
  "en": "really cute",
  "c": "(-t, -a)",
  "ch": 10,
  "t": "a"
}, {
  "id": 9178,
  "sv": "föräldraledig",
  "en": "on parental leave",
  "c": "(-t, -a)",
  "ch": 10,
  "t": "a"
}, {
  "id": 9179,
  "sv": "Österrike",
  "en": "Austria",
  "ch": 10,
  "t": "pn"
}, {
  "id": 9180,
  "sv": "köttbulle",
  "en": "meatball",
  "c": "(köttbullar, köttbullarna)",
  "ch": 10,
  "t": "n",
  "g": "en"
}, {
  "id": 9181,
  "sv": "Frankrike",
  "en": "France",
  "ch": 10,
  "t": "pn"
}, {
  "id": 9182,
  "sv": "Usch!",
  "en": "Yuck!",
  "ch": 10
}, {
  "id": 9183,
  "sv": "Lettland",
  "en": "Latvia",
  "ch": 10,
  "t": "pn"
}, {
  "id": 9184,
  "sv": "gullig",
  "en": "cute",
  "c": "(-t, -a)",
  "ch": 10,
  "t": "a"
}, {
  "id": 9185,
  "sv": "kvadratkilometer",
  "en": "kilometer squared",
  "c": "(-n, −, kvadratkilometrarna)",
  "ch": 10,
  "t": "n",
  "g": "en"
}, {
  "id": 9186,
  "sv": "konstitutionell monarki",
  "en": "constitutional monarchy",
  "ch": 10
}, {
  "id": 9187,
  "sv": "Kebnekaise",
  "en": "Kebnekaise, Sweden's highest peak",
  "ch": 10,
  "t": "pn"
}, {
  "id": 9188,
  "sv": "Klarälven-Götaälv (Sveriges längsta älv)",
  "en": "Klarälven (\"The clear river\" in Swedish) is a river flowing through Norway and Sweden. Together with Göta älv, which it is called as the river has passed through the lake Vänern, thus regarded as an entity, Göta älv—Klarälven is the longest river in Scandinavia and in the Nordic countries and its Swedish part the longest river of Sweden.",
  "ch": 10
}, {
  "id": 9189,
  "sv": "romani chib",
  "en": "Romani language",
  "ch": 10
}, {
  "id": 9190,
  "sv": "svensk krona",
  "en": "Swedish krona",
  "c": "(SEK)",
  "ch": 10
}, {
  "id": 9191,
  "sv": "minoritetsspråk",
  "en": "minority language",
  "c": "(-et, −, -en)",
  "ch": 10,
  "t": "n",
  "g": "ett"
}, {
  "id": 9192,
  "sv": "statskick",
  "en": "government",
  "c": "(-et, , -en)",
  "ch": 10,
  "t": "n",
  "g": "ett"
}, {
  "id": 9193,
  "sv": "befokningstäthet",
  "en": "population density",
  "ch": 10,
  "t": "n",
  "g": "en"
}, {
  "id": 9194,
  "sv": "landsnummer",
  "en": "country code",
  "c": "(landsnumret, −, landsnumren)",
  "ch": 10,
  "t": "n",
  "g": "ett"
}, {
  "id": 9195,
  "sv": "bruttonationalprodukt",
  "en": "Gross Domestic Product, GDP",
  "c": "(BNP)",
  "ch": 10,
  "t": "n",
  "g": "en"
}, {
  "id": 9196,
  "sv": "förnamn",
  "en": "first name, given name",
  "c": "(-et, −, -en)",
  "ch": 10,
  "t": "n",
  "g": "ett"
}, {
  "id": 9197,
  "sv": "tilltalsnamn",
  "en": "first name",
  "c": "(-et, −, -en)",
  "ch": 10,
  "t": "n",
  "g": "ett"
}, {
  "id": 9198,
  "sv": "kvinnonamn",
  "en": "woman’s name",
  "c": "(-et, −, -en)",
  "ch": 10,
  "t": "n",
  "g": "ett"
}, {
  "id": 9199,
  "sv": "mansnamn",
  "en": "man’s name",
  "c": "(-et, −, -en)",
  "ch": 10,
  "t": "n",
  "g": "ett"
}, {
  "id": 9200,
  "sv": "åkermark",
  "en": "field, farmland",
  "c": "(-en, -er, -erna)",
  "ch": 10,
  "t": "n",
  "g": "en"
}, {
  "id": 9201,
  "sv": "protestant",
  "en": "Protestant",
  "c": "(-en, -er, -erna)",
  "ch": 10,
  "t": "n",
  "g": "en"
}, {
  "id": 9202,
  "sv": "hindu",
  "en": "Hindu",
  "c": "(-n, -er, -erna)",
  "ch": 10,
  "t": "n",
  "g": "en"
}, {
  "id": 9203,
  "sv": "buddhist",
  "en": "Buddhist",
  "c": "(-en, -er, -erna)",
  "ch": 10,
  "t": "n",
  "g": "en"
}, {
  "id": 9204,
  "sv": "pappersmassa",
  "en": "wood pulp",
  "c": "(-n, pappersmassor, pappersmassorna)",
  "ch": 10,
  "t": "n",
  "g": "en"
}, {
  "id": 9205,
  "sv": "operasångerska",
  "en": "opera singer (female)",
  "c": "(-n, operasångerskor, operasångerskorna)",
  "ch": 10,
  "t": "n",
  "g": "en"
}, {
  "id": 9206,
  "sv": "det bästa",
  "en": "the best",
  "ch": 11
}, {
  "id": 9207,
  "sv": "bra sätt",
  "en": "a good way",
  "t": "n",
  "g": "ett",
  "ch": 11
}, {
  "id": 9208,
  "sv": "verbfras",
  "en": "verb phrase",
  "c": "(-en, -er, -erna)",
  "ch": 11,
  "t": "n",
  "g": "en"
}, {
  "id": 9209,
  "sv": "åka på semester",
  "en": "go on vacation, holiday",
  "ch": 11
}, {
  "id": 9210,
  "sv": "gå ut med hunden",
  "en": "walk the dog",
  "ch": 11
}, {
  "id": 9211,
  "sv": "konstutställning",
  "en": "art exhibit",
  "c": "(-en, -ar, -arna)",
  "ch": 11,
  "t": "n",
  "g": "en"
}, {
  "id": 9212,
  "sv": "språkkurs",
  "en": "language course",
  "c": "(-en, -er, -erna)",
  "ch": 11,
  "t": "n",
  "g": "en"
}, {
  "id": 9213,
  "sv": "dejta",
  "en": "date",
  "c": "(-r, -de, -t)",
  "ch": 11,
  "t": "v"
}, {
  "id": 9214,
  "sv": "vara trött",
  "en": "på be tired of",
  "ch": 11
}, {
  "id": 9215,
  "sv": "bjuda hem",
  "en": "invite home",
  "ch": 11
}, {
  "id": 9216,
  "sv": "tjejkompis",
  "en": "girl friend (platonic, female friend)",
  "c": "(-en, -ar, -arna)",
  "ch": 11,
  "t": "n",
  "g": "en"
}, {
  "id": 9217,
  "sv": "par personer",
  "en": "a couple of people",
  "t": "n",
  "g": "ett",
  "ch": 11
}, {
  "id": 9218,
  "sv": "i 70-årsåldern",
  "en": "in his/her seventies",
  "ch": 11
}, {
  "id": 9219,
  "sv": "dagisbarn",
  "en": "preschool children",
  "c": "(-et, −, -en)",
  "ch": 11,
  "t": "n",
  "g": "ett"
}, {
  "id": 9220,
  "sv": "nybörjarkurs",
  "en": "beginner’s course",
  "c": "(-en, -er, -erna)",
  "ch": 11,
  "t": "n",
  "g": "en"
}, {
  "id": 9221,
  "sv": "nätdejting",
  "en": "internet dating",
  "c": "(-en)",
  "ch": 11,
  "t": "n",
  "g": "en"
}, {
  "id": 9222,
  "sv": "dejtingsajt",
  "en": "dating site",
  "c": "(-en, -er, -erna)",
  "ch": 11,
  "t": "n",
  "g": "en"
}, {
  "id": 9223,
  "sv": "barnfri",
  "en": "without children",
  "c": "(-tt, -a)",
  "ch": 11,
  "t": "a"
}, {
  "id": 9224,
  "sv": "singeltjej",
  "en": "single girl",
  "c": "(-en, -er, -erna)",
  "ch": 11,
  "t": "n",
  "g": "en"
}, {
  "id": 9225,
  "sv": "inget för mig",
  "en": "not for me",
  "ch": 11
}, {
  "id": 9226,
  "sv": "inte heller",
  "en": "neither",
  "ch": 11
}, {
  "id": 9227,
  "sv": "sportbar",
  "en": "sports bar",
  "c": "(-en, -er, -erna)",
  "ch": 11,
  "t": "n",
  "g": "en"
}, {
  "id": 9228,
  "sv": "sporthatare",
  "en": "sports-hater",
  "c": "(-n, −, -sporthatarna)",
  "ch": 11,
  "t": "n",
  "g": "en"
}, {
  "id": 9229,
  "sv": "korvkiosk",
  "en": "hot dog stand",
  "c": "(-en, -er, -erna)",
  "ch": 11,
  "t": "n",
  "g": "en"
}, {
  "id": 9230,
  "sv": "älgstek",
  "en": "moose steak",
  "c": "(-en, -ar, -arna)",
  "ch": 11,
  "t": "n",
  "g": "en"
}, {
  "id": 9231,
  "sv": "i skogen",
  "en": "in the forest",
  "ch": 11
}, {
  "id": 9232,
  "sv": "Inte jag heller",
  "en": "Me neither",
  "ch": 11
}, {
  "id": 9233,
  "sv": "äventyrlig",
  "en": "adventurous",
  "c": "(-t, -a)",
  "ch": 11,
  "t": "a"
}, {
  "id": 9234,
  "sv": "töntig",
  "en": "dorky, uncool",
  "c": "(-t, -a)",
  "ch": 11,
  "t": "a"
}, {
  "id": 9235,
  "sv": "Jag håller med.",
  "en": "I agree.",
  "ch": 11
}, {
  "id": 9236,
  "sv": "Va!",
  "en": "What!",
  "ch": 11
}, {
  "id": 9237,
  "sv": "Konjunktion",
  "en": "conjunction",
  "ch": 11,
  "t": "n",
  "g": "en"
}, {
  "id": 9238,
  "sv": "papperskorg",
  "en": "waste paper basket",
  "c": "(-en, -ar, -arna)",
  "ch": 11,
  "t": "n",
  "g": "en"
}, {
  "id": 9239,
  "sv": "sladd",
  "en": "cord",
  "c": "(-en, -ar, -arna)",
  "ch": 11,
  "t": "n",
  "g": "en"
}, {
  "id": 9240,
  "sv": "kursiv stil",
  "en": "cursive, italics",
  "c": "(-en, -ar, -arna)",
  "ch": 11
}, {
  "id": 9241,
  "sv": "snabel-a",
  "en": "the @ symbol",
  "c": "(-:et, -:n, -:na)",
  "ch": 11,
  "t": "n",
  "g": "ett"
}, {
  "id": 9242,
  "sv": "fet stil",
  "en": "bold",
  "ch": 11
}, {
  "id": 9243,
  "sv": "bindestreck",
  "en": "hyphen",
  "c": "(-et, −, -en)",
  "ch": 11,
  "t": "n",
  "g": "ett"
}, {
  "id": 9244,
  "sv": "understreck",
  "en": "underline",
  "c": "(-et, −, -en)",
  "ch": 11,
  "t": "n",
  "g": "ett"
}, {
  "id": 9245,
  "sv": "utropstecken",
  "en": "exclamation point",
  "ch": 11,
  "t": "n",
  "g": "ett"
}, {
  "id": 9246,
  "sv": "snedstreck",
  "en": "slash",
  "c": "(-et, −, -en)",
  "ch": 11,
  "t": "n",
  "g": "ett"
}, {
  "id": 9247,
  "sv": "typsnitt",
  "en": "font",
  "c": "(-et, −, -en)",
  "ch": 11,
  "t": "n",
  "g": "ett"
}, {
  "id": 9248,
  "sv": "krascha",
  "en": "crash",
  "c": "(-r, -de, -t)",
  "ch": 11,
  "t": "v"
}, {
  "id": 9249,
  "sv": "antivirusprogram",
  "en": "antivirus program",
  "c": "(-met, −, -men)",
  "ch": 11,
  "t": "n",
  "g": "ett"
}, {
  "id": 9250,
  "sv": "Pang!",
  "en": "Bang!",
  "ch": 11
}, {
  "id": 9251,
  "sv": "Hur då?",
  "en": "How?",
  "ch": 11
}, {
  "id": 9252,
  "sv": "USB-ingång",
  "en": "USB port",
  "c": "(-en)",
  "ch": 11,
  "t": "n",
  "g": "en"
}, {
  "id": 9253,
  "sv": "Klockan är mycket!",
  "en": "It's late!",
  "ch": 11
}, {
  "id": 9254,
  "sv": "förbjudet",
  "en": "prohibited",
  "ch": 11,
  "t": "a"
}, {
  "id": 9255,
  "sv": "e-postadress",
  "en": "email address",
  "c": "(-en, -er, -erna)",
  "ch": 11,
  "t": "n",
  "g": "en"
}, {
  "id": 9256,
  "sv": "stavelse",
  "en": "syllable",
  "c": "(-n, -er, -rna)",
  "ch": 11,
  "t": "n",
  "g": "en"
}, {
  "id": 9257,
  "sv": "bra idé",
  "en": "good idea",
  "ch": 11
}, {
  "id": 9258,
  "sv": "råg",
  "en": "rye",
  "c": "(-en)",
  "ch": 12,
  "t": "n",
  "g": "en"
}, {
  "id": 9259,
  "sv": "vardagsmat",
  "en": "simple, everyday food",
  "c": "(-en)",
  "ch": 12,
  "t": "n",
  "g": "en"
}, {
  "id": 9260,
  "sv": "kokt",
  "en": "boiled",
  "c": "(-a)",
  "ch": 12,
  "t": "a"
}, {
  "id": 9261,
  "sv": "potatismos",
  "en": "mashed potatoes",
  "c": "(-et)",
  "ch": 12,
  "t": "n",
  "g": "ett"
}, {
  "id": 9262,
  "sv": "stekt potatis",
  "en": "fried potatoes",
  "ch": 12
}, {
  "id": 9263,
  "sv": "potatisgratäng",
  "en": "potato gratin",
  "c": "(-en)",
  "ch": 12,
  "t": "n",
  "g": "en"
}, {
  "id": 9264,
  "sv": "bakad potatis",
  "en": "baked potato",
  "ch": 12
}, {
  "id": 9265,
  "sv": "potatissallad",
  "en": "potato salad",
  "c": "(-en)",
  "ch": 12,
  "t": "n",
  "g": "en"
}, {
  "id": 9266,
  "sv": "färskpotatis",
  "en": "new potatoes",
  "c": "(-en, −, -arna)",
  "ch": 12,
  "t": "n",
  "g": "en"
}, {
  "id": 9267,
  "sv": "nykokt",
  "en": "freshly boiled",
  "c": "(-a)",
  "ch": 12,
  "t": "a"
}, {
  "id": 9268,
  "sv": "1600-tal",
  "en": "17th century",
  "c": "(-et)",
  "ch": 12,
  "t": "n",
  "g": "ett"
}, {
  "id": 9269,
  "sv": "1800-tal",
  "en": "19th century",
  "c": "(-et)",
  "ch": 12,
  "t": "n",
  "g": "ett"
}, {
  "id": 9270,
  "sv": "rågmjöl",
  "en": "rye flour",
  "c": "(-et)",
  "ch": 12,
  "t": "n",
  "g": "ett"
}, {
  "id": 9271,
  "sv": "skafferi",
  "en": "pantry",
  "c": "(-t, -r, -rna)",
  "ch": 12,
  "t": "n",
  "g": "ett"
}, {
  "id": 9272,
  "sv": "älgpark",
  "en": "moose park",
  "c": "(-en, -er, -erna)",
  "ch": 12,
  "t": "n",
  "g": "en"
}, {
  "id": 9273,
  "sv": "trettiotal",
  "en": "around thirty",
  "c": "(-et)",
  "ch": 12,
  "t": "n",
  "g": "ett"
}, {
  "id": 9274,
  "sv": "älgbulle",
  "en": "moose meatball",
  "c": "(-n, -ar, -arna)",
  "ch": 12,
  "t": "n",
  "g": "en"
}, {
  "id": 9275,
  "sv": "älgburgare",
  "en": "moose burger",
  "c": "(-n, −, -na)",
  "ch": 12,
  "t": "n",
  "g": "en"
}, {
  "id": 9276,
  "sv": "nötkött",
  "en": "beef",
  "c": "(-et)",
  "ch": 12,
  "t": "n",
  "g": "ett"
}, {
  "id": 9277,
  "sv": "ostkust",
  "en": "east coast",
  "c": "(-en)",
  "ch": 12,
  "t": "n",
  "g": "en"
}, {
  "id": 9278,
  "sv": "västkust",
  "en": "west coast",
  "c": "(-en)",
  "ch": 12,
  "t": "n",
  "g": "en"
}, {
  "id": 9279,
  "sv": "ättika",
  "en": "Swedish vinegar",
  "c": "(-n)",
  "ch": 12,
  "t": "n",
  "g": "en"
}, {
  "id": 9280,
  "sv": "strömming",
  "en": "Baltic herring",
  "c": "(-en, -ar, -arna)",
  "ch": 12,
  "t": "n",
  "g": "en"
}, {
  "id": 9281,
  "sv": "rökt",
  "en": "smoked",
  "c": "(-a)",
  "ch": 12,
  "t": "a"
}, {
  "id": 9282,
  "sv": "böckling",
  "en": "smoked Baltic herring",
  "c": "(-en, -ar, -arna)",
  "ch": 12,
  "t": "n",
  "g": "en"
}, {
  "id": 9283,
  "sv": "surströmming",
  "en": "fermented Baltic herring",
  "c": "(-en, -ar, -arna)",
  "ch": 12,
  "t": "n",
  "g": "en"
}, {
  "id": 9284,
  "sv": "fermenterad",
  "en": "fermented",
  "c": "(fermenterat, -e)",
  "ch": 12,
  "t": "a"
}, {
  "id": 9285,
  "sv": "odlad lax",
  "en": "farmed salmon",
  "ch": 12
}, {
  "id": 9286,
  "sv": "förr i tiden",
  "en": "the olden days",
  "ch": 12
}, {
  "id": 9287,
  "sv": "festmat",
  "en": "party food, holiday food",
  "c": "(-en)",
  "ch": 12,
  "t": "n",
  "g": "en"
}, {
  "id": 9288,
  "sv": "grillad",
  "en": "barbeque",
  "c": "(grillat, -e)",
  "ch": 12,
  "t": "a"
}, {
  "id": 9289,
  "sv": "gravad",
  "en": "cured",
  "c": "(gravat, -e)",
  "ch": 12,
  "t": "a"
}, {
  "id": 9290,
  "sv": "självplock",
  "en": "pick-your-own",
  "ch": 12,
  "t": "n",
  "g": "ett"
}, {
  "id": 9291,
  "sv": "strawberry",
  "en": "cake",
  "ch": 12
}, {
  "id": 9292,
  "sv": "som de är",
  "en": "as they are",
  "ch": 12
}, {
  "id": 9293,
  "sv": "matvana",
  "en": "eating habits",
  "c": "(-n, matvanor, matvanorna)",
  "ch": 12,
  "t": "n",
  "g": "en"
}, {
  "id": 9294,
  "sv": "tillräckig",
  "en": "enough",
  "c": "(-t, -a)",
  "ch": 12,
  "t": "a"
}, {
  "id": 9295,
  "sv": "vegetarian",
  "en": "vegetarian",
  "c": "(-en, -er, -erna)",
  "ch": 12,
  "t": "n",
  "g": "en"
}, {
  "id": 9296,
  "sv": "pannkaka",
  "en": "pancake",
  "c": "(-n, pannkakor, pannkakorna)",
  "ch": 12,
  "t": "n",
  "g": "en"
}, {
  "id": 9297,
  "sv": "mörk choklad",
  "en": "dark chocolate",
  "ch": 12
}, {
  "id": 9298,
  "sv": "mjölkchoklad",
  "en": "milk chocolate",
  "ch": 12,
  "t": "n",
  "g": "en"
}, {
  "id": 9299,
  "sv": "biff med lök",
  "en": "steak with onions",
  "ch": 12
}, {
  "id": 9300,
  "sv": "kåldolme",
  "en": "cabbage roll",
  "c": "(-n, kåldolmar, kåldolmarna)",
  "ch": 12,
  "t": "n",
  "g": "en"
}, {
  "id": 9301,
  "sv": "småkakor",
  "en": "small cookies, biscuits",
  "c": "(-na)",
  "ch": 12,
  "t": "n"
}, {
  "id": 9302,
  "sv": "köttindustri",
  "en": "meat industry",
  "c": "(-n)",
  "ch": 12,
  "t": "n",
  "g": "en"
}, {
  "id": 9303,
  "sv": "sparris",
  "en": "asparagus",
  "c": "(-en, -ar, -arna)",
  "ch": 12,
  "t": "n",
  "g": "en"
}, {
  "id": 9304,
  "sv": "tofu",
  "en": "tofu",
  "c": "(-n)",
  "ch": 12,
  "t": "n",
  "g": "en"
}, {
  "id": 9305,
  "sv": "urgod",
  "en": "super good, delicious",
  "c": "(urgott, -a)",
  "ch": 12,
  "t": "a"
}, {
  "id": 9306,
  "sv": "nudlar",
  "en": "noodles",
  "ch": 12,
  "t": "n"
}, {
  "id": 9307,
  "sv": "ripa",
  "en": "grouse",
  "c": "(-n, -or, -orna)",
  "ch": 12,
  "t": "n",
  "g": "en"
}, {
  "id": 9308,
  "sv": "bisats",
  "en": "subordinate clause",
  "c": "(-en, -er, -erna)",
  "ch": 12,
  "t": "n",
  "g": "en"
}, {
  "id": 9309,
  "sv": "subjunktion",
  "en": "subordinating conjunction",
  "c": "(-en, -er, -erna)",
  "ch": 12,
  "t": "n",
  "g": "en"
}, {
  "id": 9310,
  "sv": "australiensisk",
  "en": "Australian",
  "c": "(-t, -a)",
  "ch": 12,
  "t": "a"
}, {
  "id": 9311,
  "sv": "brasiliansk",
  "en": "Brasilian",
  "c": "(-t, -a)",
  "ch": 12,
  "t": "a"
}, {
  "id": 9312,
  "sv": "colombiansk",
  "en": "Colombian",
  "c": "(-t, -a)",
  "ch": 12,
  "t": "a"
}, {
  "id": 9313,
  "sv": "etiopisk",
  "en": "Ethiopian",
  "c": "(-t, -a)",
  "ch": 12,
  "t": "a"
}, {
  "id": 9314,
  "sv": "indonesisk",
  "en": "Indonesian",
  "c": "(-t, -a)",
  "ch": 12,
  "t": "a"
}, {
  "id": 9315,
  "sv": "kenyansk",
  "en": "Kenyan",
  "c": "(-t, -a)",
  "ch": 12,
  "t": "a"
}, {
  "id": 9316,
  "sv": "kubansk",
  "en": "Cuban",
  "c": "(-t, -a)",
  "ch": 12,
  "t": "a"
}, {
  "id": 9317,
  "sv": "libanesisk",
  "en": "Lebanese",
  "c": "(-t, -a)",
  "ch": 12,
  "t": "a"
}, {
  "id": 9318,
  "sv": "marockansk",
  "en": "Moroccan",
  "c": "(-t, -a)",
  "ch": 12,
  "t": "a"
}, {
  "id": 9319,
  "sv": "mexikansk",
  "en": "Mexican",
  "c": "(-t, -a)",
  "ch": 12,
  "t": "a"
}, {
  "id": 9320,
  "sv": "nyzeeländsk",
  "en": "New Zealander",
  "c": "(-t, -a)",
  "ch": 12,
  "t": "a"
}, {
  "id": 9321,
  "sv": "pakistansk",
  "en": "Pakistani",
  "c": "(-t, -a)",
  "ch": 12,
  "t": "a"
}, {
  "id": 9322,
  "sv": "sydafrikansk",
  "en": "South African",
  "c": "(-t, -a)",
  "ch": 12,
  "t": "a"
}, {
  "id": 9323,
  "sv": "tunisisk",
  "en": "Tunisian",
  "c": "(-t, -a)",
  "ch": 12,
  "t": "a"
}, {
  "id": 9324,
  "sv": "ungersk",
  "en": "Hungarian",
  "c": "(-t, -a)",
  "ch": 12,
  "t": "a"
}, {
  "id": 9325,
  "sv": "makaroner",
  "en": "macaroni",
  "c": "(-na)",
  "ch": 12,
  "t": "n"
}, {
  "id": 9326,
  "sv": "blodpudding",
  "en": "blood pudding, black pudding",
  "c": "(-en)",
  "ch": 12,
  "t": "n",
  "g": "en"
}, {
  "id": 9327,
  "sv": "uteservering",
  "en": "outdoor dining area",
  "c": "(-en, -ar, -arna)",
  "ch": 12,
  "t": "n",
  "g": "en"
}, {
  "id": 9328,
  "sv": "Kan vi få notan?",
  "en": "May we have the bill?",
  "ch": 12
}, {
  "id": 9329,
  "sv": "vissa",
  "en": "certain",
  "ch": 12,
  "t": "d"
}, {
  "id": 9330,
  "sv": "frasbetoning",
  "en": "phrase emphasis",
  "c": "(-en, -ar, -arna)",
  "ch": 12,
  "t": "n",
  "g": "en"
}, {
  "id": 9331,
  "sv": "jordgubbstårta",
  "en": "strawberry cake",
  "c": "(-n, jordgubbstårtor, jordgubbstårtorna)",
  "ch": 12,
  "t": "n",
  "g": "en"
}, {
  "id": 9332,
  "sv": "skolklass",
  "en": "class",
  "c": "(-en, -er, -erna)",
  "ch": 13,
  "t": "n",
  "g": "en"
}, {
  "id": 9333,
  "sv": "mikrobiolog",
  "en": "microbiologist",
  "c": "(-en, -er, -erna)",
  "ch": 13,
  "t": "n",
  "g": "en"
}, {
  "id": 9334,
  "sv": "fotbollsproffs",
  "en": "football, soccer player",
  "c": "(-et, −, -en)",
  "ch": 13,
  "t": "n",
  "g": "ett"
}, {
  "id": 9335,
  "sv": "jobba hemifrån",
  "en": "work from home",
  "ch": 13
}, {
  "id": 9336,
  "sv": "vara liten",
  "en": "be small, young",
  "ch": 13
}, {
  "id": 9337,
  "sv": "Det stämmer",
  "en": "That's right",
  "ch": 13
}, {
  "id": 9338,
  "sv": "bortifrån",
  "en": "from over there",
  "ch": 13,
  "t": "a"
}, {
  "id": 9339,
  "sv": "ninifrån",
  "en": "from inside",
  "ch": 13,
  "t": "a"
}, {
  "id": 9340,
  "sv": "uppifrån",
  "en": "from above",
  "ch": 13,
  "t": "a"
}, {
  "id": 9341,
  "sv": "nnerifrån",
  "en": "from below",
  "ch": 13,
  "t": "a"
}, {
  "id": 9342,
  "sv": "framifrån",
  "en": "from in front",
  "ch": 13,
  "t": "a"
}, {
  "id": 9343,
  "sv": "toppjobb",
  "en": "great job",
  "c": "(-et, −, -en)",
  "ch": 13,
  "t": "n",
  "g": "ett"
}, {
  "id": 9344,
  "sv": "läkemedelsföretag",
  "en": "pharmaceutical company",
  "c": "(-et, −, -en)",
  "ch": 13,
  "t": "n",
  "g": "ett"
}, {
  "id": 9345,
  "sv": "doktorera",
  "en": "get a PhD",
  "c": "(-r, -de, -t)",
  "ch": 13,
  "t": "v"
}, {
  "id": 9346,
  "sv": "hushållsarbete",
  "en": "household chores",
  "c": "(-t, −, -n)",
  "ch": 13,
  "t": "n",
  "g": "ett"
}, {
  "id": 9347,
  "sv": "stressig",
  "en": "stressful",
  "c": "(-t, -a)",
  "ch": 13,
  "t": "a"
}, {
  "id": 9348,
  "sv": "försova",
  "en": "sig oversleep",
  "c": "(-er, försov, försovit)",
  "ch": 13,
  "t": "v"
}, {
  "id": 9349,
  "sv": "frukostmöte",
  "en": "breakfast meeting",
  "c": "(-t, -n, -na)",
  "ch": 13,
  "t": "n",
  "g": "ett"
}, {
  "id": 9350,
  "sv": "labb",
  "en": "lab, laboratory",
  "c": "(-et, −, -en)",
  "ch": 13,
  "t": "n",
  "g": "ett"
}, {
  "id": 9351,
  "sv": "hämtmat",
  "en": "takeout food",
  "c": "(-en)",
  "ch": 13,
  "t": "n",
  "g": "en"
}, {
  "id": 9352,
  "sv": "kyckingfilé",
  "en": "chicken fillet",
  "c": "(-n, -er, -erna)",
  "ch": 13,
  "t": "n",
  "g": "en"
}, {
  "id": 9353,
  "sv": "saffransrisotto",
  "en": "saffron risotto",
  "c": "(-n)",
  "ch": 13,
  "t": "n",
  "g": "en"
}, {
  "id": 9354,
  "sv": "middagsgäst",
  "en": "dinner guest",
  "c": "(-en, -er, -erna)",
  "ch": 13,
  "t": "n",
  "g": "en"
}, {
  "id": 9355,
  "sv": "duka",
  "en": "set the table",
  "c": "(-r, -de, -t)",
  "ch": 13,
  "t": "v"
}, {
  "id": 9356,
  "sv": "ringa på dörren",
  "en": "ring the doorbell",
  "ch": 13
}, {
  "id": 9357,
  "sv": "Genève",
  "en": "Geneva",
  "ch": 13,
  "t": "pn"
}, {
  "id": 9358,
  "sv": "videokonferens",
  "en": "video conference",
  "c": "(-en, -er, -erna)",
  "ch": 13,
  "t": "n",
  "g": "en"
}, {
  "id": 9359,
  "sv": "ligga på topp",
  "en": "be at the top",
  "ch": 13
}, {
  "id": 9360,
  "sv": "flygvärdinna",
  "en": "air hostess, stewardess",
  "c": "(-n, flygvärdinnor, flygvärdinnorna)",
  "ch": 13,
  "t": "n",
  "g": "en"
}, {
  "id": 9361,
  "sv": "i förrgår",
  "en": "the day before yesterday",
  "ch": 13
}, {
  "id": 9362,
  "sv": "trädgårdsmästare",
  "en": "gardener",
  "c": "(-n, −, trädgårdsmästarna)",
  "ch": 13,
  "t": "n",
  "g": "en"
}, {
  "id": 9363,
  "sv": "tennislärare",
  "en": "tennis instructor",
  "c": "(-n, −, tennislärarna)",
  "ch": 13,
  "t": "n",
  "g": "en"
}, {
  "id": 9364,
  "sv": "bröllopsfotograf",
  "en": "wedding photographer",
  "c": "(-en, −, -erna)",
  "ch": 13,
  "t": "n",
  "g": "en"
}, {
  "id": 9365,
  "sv": "barnvakt",
  "en": "babysitter",
  "c": "(-en, -er, -erna)",
  "ch": 13,
  "t": "n",
  "g": "en"
}, {
  "id": 9366,
  "sv": "simlärare",
  "en": "swimming instructor",
  "c": "(-n, −, simlärarna)",
  "ch": 13,
  "t": "n",
  "g": "en"
}, {
  "id": 9367,
  "sv": "personlig tränare",
  "en": "personal trainer",
  "ch": 13
}, {
  "id": 9368,
  "sv": "taxichaufför",
  "en": "taxi driver",
  "c": "(-en, -er, -erna)",
  "ch": 13,
  "t": "n",
  "g": "en"
}, {
  "id": 9369,
  "sv": "datasupporttekniker",
  "en": "IT support technician",
  "c": "(-n, −, -na)",
  "ch": 13,
  "t": "n",
  "g": "en"
}, {
  "id": 9370,
  "sv": "bilmekaniker",
  "en": "car mechanic",
  "c": "(-n, −, -na)",
  "ch": 13,
  "t": "n",
  "g": "en"
}, {
  "id": 9371,
  "sv": "händig",
  "en": "dexterous, skillful",
  "c": "(-t, -a)",
  "ch": 13,
  "t": "a"
}, {
  "id": 9372,
  "sv": "gröna fingrar",
  "en": "green thumb, green fingers",
  "ch": 13
}, {
  "id": 9373,
  "sv": "idrottslärare",
  "en": "physical education teacher",
  "c": "(-n, −, idrottslärarna)",
  "ch": 13,
  "t": "n",
  "g": "en"
}, {
  "id": 9374,
  "sv": "litteraturvetenskap",
  "en": "literature studies",
  "c": "(-en)",
  "ch": 13,
  "t": "n",
  "g": "en"
}, {
  "id": 9375,
  "sv": "extrajobb",
  "en": "extra work, part-time job",
  "c": "(-et, −, -en)",
  "ch": 13,
  "t": "n",
  "g": "ett"
}, {
  "id": 9376,
  "sv": "infinitiv",
  "en": "infinitive",
  "c": "(-et, −, -en)",
  "ch": 13,
  "t": "n",
  "g": "en"
}, {
  "id": 9377,
  "sv": "vattengympapass",
  "en": "water arerobics session",
  "c": "(-et, −, -en)",
  "ch": 13,
  "t": "n",
  "g": "ett"
}, {
  "id": 9378,
  "sv": "stå i baren",
  "en": "man the bar",
  "ch": 13
}, {
  "id": 9379,
  "sv": "hotellfrukost",
  "en": "hotel breakfast",
  "c": "(-en, -ar, -arna)",
  "ch": 13,
  "t": "n",
  "g": "en"
}, {
  "id": 9380,
  "sv": "mobiltelefoni",
  "en": "cell phone technology,",
  "c": "(-n)",
  "ch": 13,
  "t": "n",
  "g": "en"
}, {
  "id": 9381,
  "sv": "mobile",
  "en": "technology",
  "ch": 13
}, {
  "id": 9382,
  "sv": "vänliga hälsningar",
  "en": "best regards",
  "ch": 13
}, {
  "id": 9383,
  "sv": "landställe",
  "en": "country home",
  "c": "(-t, -n, -na)",
  "ch": 14,
  "t": "n",
  "g": "ett"
}, {
  "id": 9384,
  "sv": "charmig",
  "en": "charming",
  "c": "(-t, -a)",
  "ch": 14,
  "t": "a"
}, {
  "id": 9385,
  "sv": "närmaste",
  "en": "closest",
  "ch": 14,
  "t": "a"
}, {
  "id": 9386,
  "sv": "åka båt",
  "en": "go boating",
  "ch": 14
}, {
  "id": 9387,
  "sv": "barfota",
  "en": "barefoot",
  "ch": 14,
  "t": "a"
}, {
  "id": 9388,
  "sv": "filmjölk",
  "en": "soured milk",
  "c": "(-en)",
  "ch": 14,
  "t": "n",
  "g": "en"
}, {
  "id": 9389,
  "sv": "blåbär",
  "en": "blueberries",
  "c": "(-et, −, -en)",
  "ch": 14,
  "t": "n",
  "g": "ett"
}, {
  "id": 9390,
  "sv": "klippa gräs",
  "en": "cut the grass, mow the lawn",
  "c": "(-er, -te, -t)",
  "ch": 14
}, {
  "id": 9391,
  "sv": "fritidshus",
  "en": "holiday home",
  "c": "(-et, −, -en)",
  "ch": 14,
  "t": "n",
  "g": "ett"
}, {
  "id": 9392,
  "sv": "numrera",
  "en": "number",
  "c": "(-r, -de, -t)",
  "ch": 14,
  "t": "v"
}, {
  "id": 9393,
  "sv": "uteplats",
  "en": "patio",
  "c": "(-en, -er, -erna)",
  "ch": 14,
  "t": "n",
  "g": "en"
}, {
  "id": 9394,
  "sv": "Skåne",
  "en": "Skåne, in southern Sweden",
  "ch": 14,
  "t": "pn"
}, {
  "id": 9395,
  "sv": "Småland",
  "en": "Småland, in the southeast",
  "ch": 14,
  "t": "pn"
}, {
  "id": 9396,
  "sv": "direkt tal",
  "en": "direct speech",
  "ch": 14
}, {
  "id": 9397,
  "sv": "indirekt tal",
  "en": "indirect speech",
  "ch": 14
}, {
  "id": 9398,
  "sv": "till lunch",
  "en": "for lunch",
  "ch": 14
}, {
  "id": 9399,
  "sv": "bilfärja",
  "en": "car ferry",
  "c": "(-n, -or, -orna)",
  "ch": 14,
  "t": "n",
  "g": "en"
}, {
  "id": 9400,
  "sv": "titta efter",
  "en": "look for",
  "ch": 14
}, {
  "id": 9401,
  "sv": "två gånger i timmen",
  "en": "twice an hour",
  "ch": 14
}, {
  "id": 9402,
  "sv": "mås",
  "en": "seagull",
  "c": "(-en, -ar, -arna)",
  "ch": 14,
  "t": "n",
  "g": "en"
}, {
  "id": 9403,
  "sv": "färjeläge",
  "en": "ferry landing",
  "c": "(-t, -n, -na)",
  "ch": 14,
  "t": "n",
  "g": "ett"
}, {
  "id": 9404,
  "sv": "grusväg",
  "en": "gravel road",
  "c": "(-en, -ar, -arna)",
  "ch": 14,
  "t": "n",
  "g": "en"
}, {
  "id": 9405,
  "sv": "glittra",
  "en": "glitter, shine",
  "c": "(-r, -de, -t)",
  "ch": 14,
  "t": "v"
}, {
  "id": 9406,
  "sv": "kliva ur",
  "en": "step out",
  "c": "(kliver, klev, klivit)",
  "ch": 14
}, {
  "id": 9407,
  "sv": "måla om",
  "en": "repaint",
  "c": "(-r, -de, -t)",
  "ch": 14
}, {
  "id": 9408,
  "sv": "dass",
  "en": "outhouse",
  "c": "(-et, −, -en)",
  "ch": 14,
  "t": "n",
  "g": "ett"
}, {
  "id": 9409,
  "sv": "nubbe",
  "en": "snaps, flavored vodka",
  "c": "(-n, -ar, -arna)",
  "ch": 14,
  "t": "n",
  "g": "en"
}, {
  "id": 9410,
  "sv": "helan",
  "en": "the whole",
  "ch": 14,
  "t": "n",
  "g": "en"
}, {
  "id": 9411,
  "sv": "halvan",
  "en": "the half",
  "ch": 14,
  "t": "n",
  "g": "en"
}, {
  "id": 9412,
  "sv": "Skål!",
  "en": "Cheers!",
  "ch": 14
}, {
  "id": 9413,
  "sv": "i halsen",
  "en": "in the throat",
  "ch": 14
}, {
  "id": 9414,
  "sv": "många, fler",
  "en": "many, more",
  "ch": 14
}, {
  "id": 9415,
  "sv": "snapsvisa",
  "en": "drinking song",
  "c": "(-n, -or, -orna)",
  "ch": 14,
  "t": "n",
  "g": "en"
}, {
  "id": 9416,
  "sv": "varje år",
  "en": "every year",
  "ch": 14
}, {
  "id": 9417,
  "sv": "ont i ryggen",
  "en": "have a backache",
  "ch": 14
}, {
  "id": 9418,
  "sv": "medan",
  "en": "while",
  "ch": 14,
  "t": "s"
}, {
  "id": 9419,
  "sv": "kantarell",
  "en": "chanterelles",
  "c": "(-en, -er, -erna)",
  "ch": 14,
  "t": "n",
  "g": "en"
}, {
  "id": 9420,
  "sv": "vaniljsås",
  "en": "custard",
  "c": "(-en, -er, -erna)",
  "ch": 14,
  "t": "n",
  "g": "en"
}, {
  "id": 9421,
  "sv": "jaktkompis",
  "en": "hunting friends",
  "c": "(-en, -ar, -arna)",
  "ch": 14,
  "t": "n",
  "g": "en"
}, {
  "id": 9422,
  "sv": "bastu",
  "en": "sauna",
  "c": "(-n, -r, -rna)",
  "ch": 14,
  "t": "n",
  "g": "en"
}, {
  "id": 9423,
  "sv": "Tack för ikväll!",
  "en": "Thank you for a nice evening!",
  "ch": 14
}, {
  "id": 9424,
  "sv": "Ta för er!",
  "en": "Help yourselves!",
  "ch": 14
}, {
  "id": 9425,
  "sv": "skåla",
  "en": "toast",
  "c": "(-r, -de, -t)",
  "ch": 14,
  "t": "v"
}, {
  "id": 9426,
  "sv": "dra sig hemåt",
  "en": "go home",
  "ch": 14
}, {
  "id": 9427,
  "sv": "vett och etikett",
  "en": "common sense and etiquette",
  "ch": 14
}, {
  "id": 9428,
  "sv": "yttersko",
  "en": "outdoor shoe",
  "c": "(-n, -r, -rna)",
  "ch": 14,
  "t": "n",
  "g": "en"
}, {
  "id": 9429,
  "sv": "innesko",
  "en": "indoor shoe",
  "c": "(-n, -r, -rna)",
  "ch": 14,
  "t": "n",
  "g": "en"
}, {
  "id": 9430,
  "sv": "värdinna",
  "en": "hostess",
  "c": "(-n, -or, -orna)",
  "ch": 14,
  "t": "n",
  "g": "en"
}, {
  "id": 9431,
  "sv": "Tack för senast!",
  "en": "Thank you for a nice evening/dinner/party!",
  "ch": 14
}, {
  "id": 9432,
  "sv": "etikettsregel",
  "en": "rule of etiquette",
  "c": "(-n, etikettsregler, etikettsreglerna)",
  "ch": 14,
  "t": "n",
  "g": "en"
}, {
  "id": 9433,
  "sv": "70-årsfest",
  "en": "70th birthday party",
  "c": "(-en , -er, -erna)",
  "ch": 14,
  "t": "n",
  "g": "en"
}, {
  "id": 9434,
  "sv": "kickoff",
  "en": "launch event",
  "c": "(-en, -er, -erna)",
  "ch": 14,
  "t": "n",
  "g": "en"
}, {
  "id": 9435,
  "sv": "barnkalas",
  "en": "children’s party",
  "c": "(-et, −, -en)",
  "ch": 14,
  "t": "n",
  "g": "ett"
}, {
  "id": 9436,
  "sv": "inflyttningsfest",
  "en": "housewarming party",
  "c": "(-en , -er, -erna)",
  "ch": 14,
  "t": "n",
  "g": "en"
}, {
  "id": 9437,
  "sv": "klassfest",
  "en": "class party",
  "c": "(-en, -er, -erna)",
  "ch": 14,
  "t": "n",
  "g": "en"
}, {
  "id": 9438,
  "sv": "knytis (knytkalas)",
  "en": "potluck",
  "c": "0",
  "ch": 14
}, {
  "id": 9439,
  "sv": "grillfest",
  "en": "barbeque party",
  "c": "(-en, -er, -erna)",
  "ch": 14,
  "t": "n",
  "g": "en"
}, {
  "id": 9440,
  "sv": "Kläder efter väder!",
  "en": "Dress according to weather!",
  "ch": 14
}, {
  "id": 9441,
  "sv": "vigsel",
  "en": "wedding ceremony",
  "c": "(-n, vigslar, vigslarna)",
  "ch": 14,
  "t": "n",
  "g": "en"
}, {
  "id": 9442,
  "sv": "äga rum",
  "en": "take place",
  "c": "(-er, -de, -t)",
  "ch": 14
}, {
  "id": 9443,
  "sv": "festvåning",
  "en": "party venue",
  "c": "(-en, -ar, -arna)",
  "ch": 14,
  "t": "n",
  "g": "en"
}, {
  "id": 9444,
  "sv": "O.S.A",
  "en": "please reply by",
  "ch": 14,
  "t": "n"
}, {
  "id": 9445,
  "sv": "önskelista",
  "en": "wish list, registry",
  "c": "(-n, -or, -orna)",
  "ch": 14,
  "t": "n",
  "g": "en"
}, {
  "id": 9446,
  "sv": "presentshopp",
  "en": "gift store",
  "c": "(-en, -ar, -arna)",
  "ch": 14,
  "t": "n",
  "g": "en"
}, {
  "id": 9447,
  "sv": "brännboll",
  "en": "rounders",
  "c": "(-en, -ar, -arna)",
  "ch": 14,
  "t": "n",
  "g": "en"
}, {
  "id": 9448,
  "sv": "brännbollsturnering",
  "en": "rounders tournament",
  "c": "(-en, -ar, -arna)",
  "ch": 14,
  "t": "n",
  "g": "en"
}, {
  "id": 9449,
  "sv": "fotbollsplan",
  "en": "soccer, football field",
  "c": "(-en, -er, -erna)",
  "ch": 14,
  "t": "n",
  "g": "en"
}, {
  "id": 9450,
  "sv": "picknick",
  "en": "picnic",
  "c": "(-en, -ar, -arna)",
  "ch": 14,
  "t": "n",
  "g": "en"
}, {
  "id": 9451,
  "sv": "gymnastiksal",
  "en": "gymnasium",
  "c": "(-en, -ar, -arna)",
  "ch": 14,
  "t": "n",
  "g": "en"
}, {
  "id": 9452,
  "sv": "danssko",
  "en": "dance shoe",
  "c": "(-n, -r, -rna)",
  "ch": 14,
  "t": "n",
  "g": "en"
}, {
  "id": 9453,
  "sv": "buffé",
  "en": "buffet",
  "c": "(-n, -er, -erna)",
  "ch": 14,
  "t": "n",
  "g": "en"
}, {
  "id": 9454,
  "sv": "valfri klädsel",
  "en": "no dress code",
  "ch": 14
}, {
  "id": 9455,
  "sv": "toppendag",
  "en": "great day",
  "ch": 14,
  "t": "n",
  "g": "en"
}, {
  "id": 9456,
  "sv": "bästa hälsningar",
  "en": "best regards, warm greetings",
  "ch": 14
}, {
  "id": 9457,
  "sv": "bör",
  "en": "should, must",
  "ch": 14,
  "t": "v"
}, {
  "id": 9458,
  "sv": "medelsvensson",
  "en": "the average Svensson, the average Swede",
  "ch": 15,
  "t": "n",
  "g": "en"
}, {
  "id": 9459,
  "sv": "hälften",
  "en": "half",
  "ch": 15,
  "t": "n",
  "g": "en"
}, {
  "id": 9460,
  "sv": "skilja sig",
  "en": "get divorced",
  "c": "(skilde, skilt)",
  "ch": 15
}, {
  "id": 9461,
  "sv": "starköl",
  "en": "strong beer, with alcohol content over 3.5%",
  "c": "(-en, -ar, -arna)",
  "ch": 15,
  "t": "n",
  "g": "en"
}, {
  "id": 9462,
  "sv": "centiliter",
  "en": "centiliter",
  "c": "(-n, −, -na)",
  "ch": 15,
  "t": "n",
  "g": "en"
}, {
  "id": 9463,
  "sv": "starksprit",
  "en": "spitits, liqor",
  "c": "(-en)",
  "ch": 15,
  "t": "n",
  "g": "en"
}, {
  "id": 9464,
  "sv": "per vecka",
  "en": "per week",
  "ch": 15
}, {
  "id": 9465,
  "sv": "mindre",
  "en": "less",
  "ch": 15,
  "t": "a"
}, {
  "id": 9466,
  "sv": "motionera",
  "en": "exercise",
  "c": "(-r, -de, -t)",
  "ch": 15,
  "t": "v"
}, {
  "id": 9467,
  "sv": "minst",
  "en": "at least",
  "ch": 15,
  "t": "a"
}, {
  "id": 9468,
  "sv": "reflexiva pronomen",
  "en": "reflexive pronoun",
  "ch": 15
}, {
  "id": 9469,
  "sv": "trivs",
  "en": "thrive",
  "ch": 15,
  "t": "v"
}, {
  "id": 9470,
  "sv": "Varför då?",
  "en": "Why?",
  "ch": 15
}, {
  "id": 9471,
  "sv": "Hur länge då?",
  "en": "How long?",
  "ch": 15
}, {
  "id": 9472,
  "sv": "Hur mycket då?",
  "en": "How much?",
  "ch": 15
}, {
  "id": 9473,
  "sv": "Hur många då?",
  "en": "How many?",
  "ch": 15
}, {
  "id": 9474,
  "sv": "Vem då?",
  "en": "Who?",
  "ch": 15
}, {
  "id": 9475,
  "sv": "Vad då?",
  "en": "What?",
  "ch": 15
}, {
  "id": 9476,
  "sv": "Grattis!",
  "en": "Congratulations!",
  "ch": 15
}, {
  "id": 9477,
  "sv": "dubbelbokad",
  "en": "double booked",
  "c": "(dubbelbokat, dubbelbokade)",
  "ch": 15,
  "t": "a"
}, {
  "id": 9478,
  "sv": "Försäkringskassan",
  "en": "Swedish Social Insurance Agency",
  "ch": 15,
  "t": "pn"
}, {
  "id": 9479,
  "sv": "föräldrapenning",
  "en": "parental benefits",
  "c": "(-en)",
  "ch": 15,
  "t": "n",
  "g": "en"
}, {
  "id": 9480,
  "sv": "långt ifrån",
  "en": "far away",
  "ch": 15
}, {
  "id": 9481,
  "sv": "veckonummer",
  "en": "number of the week",
  "c": "(veckonumret, −, veckonumren)",
  "ch": 15,
  "t": "n",
  "g": "ett"
}, {
  "id": 9482,
  "sv": "småprata",
  "en": "make small talk",
  "c": "(-r, -de, -t)",
  "ch": 15,
  "t": "v"
}, {
  "id": 9483,
  "sv": "Arlanda",
  "en": "Arlanda, international airport near Stockholm",
  "ch": 15,
  "t": "pn"
}, {
  "id": 9484,
  "sv": "hela tiden",
  "en": "all the time",
  "ch": 15
}, {
  "id": 9485,
  "sv": "klättra upp",
  "en": "climb up",
  "c": "(-r, -de, -t)",
  "ch": 15
}, {
  "id": 9486,
  "sv": "bara vara",
  "en": "just be, not do anything in particular",
  "ch": 15
}, {
  "id": 9487,
  "sv": "verka som",
  "en": "seem like",
  "c": "(-r, -de, -t)",
  "ch": 15
}, {
  "id": 9488,
  "sv": "bit ifrån",
  "en": "a short distance away from",
  "t": "n",
  "g": "en",
  "ch": 15
}, {
  "id": 9489,
  "sv": "deppig",
  "en": "depressed",
  "c": "(-t, -a)",
  "ch": 15,
  "t": "a"
}, {
  "id": 9490,
  "sv": "personnummer",
  "en": "social security number, identification number",
  "c": "(personnumret, −, personnumren)",
  "ch": 15,
  "t": "n",
  "g": "ett"
}, {
  "id": 9491,
  "sv": "badplats",
  "en": "beach, bath",
  "c": "(-en, -er, -erna)",
  "ch": 15,
  "t": "n",
  "g": "en"
}, {
  "id": 9492,
  "sv": "självständiga pronomen",
  "en": "independent pronouns",
  "ch": 15
}, {
  "id": 9493,
  "sv": "fotbollsträning",
  "en": "soccer practice, football practice",
  "c": "(-en, -ar, -arna)",
  "ch": 15,
  "t": "n",
  "g": "en"
}, {
  "id": 9494,
  "sv": "göra läxan",
  "en": "do homework",
  "c": "(gör, gjorde, gjort)",
  "ch": 15
}, {
  "id": 9495,
  "sv": "både och",
  "en": "both",
  "ch": 15
}, {
  "id": 9496,
  "sv": "medeltemperatur",
  "en": "average temperature",
  "c": "(-en)",
  "ch": 15,
  "t": "n",
  "g": "en"
}, {
  "id": 9497,
  "sv": "grader Celsius",
  "en": "degrees Celsius, degrees centigrade",
  "ch": 15
}, {
  "id": 9498,
  "sv": "blåsig",
  "en": "windy",
  "c": "(-t, -a)",
  "ch": 15,
  "t": "a"
}, {
  "id": 9499,
  "sv": "minusgrad",
  "en": "negative degree",
  "c": "(-en, -er, -erna)",
  "ch": 15,
  "t": "n",
  "g": "en"
}, {
  "id": 9500,
  "sv": "snöig",
  "en": "snowy",
  "c": "(-t, -a)",
  "ch": 15,
  "t": "a"
}, {
  "id": 9501,
  "sv": "Sibirien",
  "en": "Siberia",
  "ch": 15,
  "t": "pn"
}, {
  "id": 9502,
  "sv": "Golfstömmen",
  "en": "Gulf Stream",
  "ch": 15,
  "t": "pn"
}, {
  "id": 9503,
  "sv": "ostadig",
  "en": "unsteady",
  "c": "(-t, -a)",
  "ch": 15,
  "t": "a"
}, {
  "id": 9504,
  "sv": "aprilväder (aprilvädret) (svenskt uttryck för omväxlande väder)",
  "en": "April weather, unsteady weather",
  "c": "0",
  "ch": 15
}, {
  "id": 9505,
  "sv": "Kiruna",
  "en": "Kiruna, city in northern Sweden",
  "ch": 15,
  "t": "pn"
}, {
  "id": 9506,
  "sv": "meteorologi",
  "en": "meteorology",
  "c": "(-n)",
  "ch": 15,
  "t": "n",
  "g": "en"
}, {
  "id": 9507,
  "sv": "värre",
  "en": "worse",
  "ch": 15,
  "t": "a"
}, {
  "id": 9508,
  "sv": "räcker",
  "en": "be enough",
  "ch": 15,
  "t": "v"
}, {
  "id": 9509,
  "sv": "stå stilla",
  "en": "stand still",
  "c": "(-r, -stod, stått)",
  "ch": 15
}, {
  "id": 9510,
  "sv": "faktaruta",
  "en": "fact sheet, fact square",
  "c": "(-n, -or, -orna)",
  "ch": 15,
  "t": "n",
  "g": "en"
}, {
  "id": 9511,
  "sv": "lager på lager",
  "en": "layer on layer",
  "ch": 15
}, {
  "id": 9512,
  "sv": "långkalsonger",
  "en": "long underwear",
  "c": "(-na)",
  "ch": 15,
  "t": "n"
}, {
  "id": 9513,
  "sv": "helst",
  "en": "preferably",
  "ch": 15,
  "t": "a"
}, {
  "id": 9514,
  "sv": "röra på sig",
  "en": "move",
  "c": "(rör, rörde, rört)",
  "ch": 15
}, {
  "id": 9515,
  "sv": "vante",
  "en": "glove",
  "c": "(-n, -ar, -arna)",
  "ch": 15,
  "t": "n",
  "g": "en"
}, {
  "id": 9516,
  "sv": "första klass",
  "en": "first grade",
  "ch": 16
}, {
  "id": 9517,
  "sv": "utan att",
  "en": "without",
  "ch": 16
}, {
  "id": 9518,
  "sv": "ta paus",
  "en": "take a break",
  "ch": 16
}, {
  "id": 9519,
  "sv": "studier",
  "en": "studies",
  "c": "(-n, -er, -erna)",
  "ch": 16,
  "t": "n"
}, {
  "id": 9520,
  "sv": "komvux",
  "en": "secondary education for adults",
  "ch": 16,
  "t": "n",
  "g": "en"
}, {
  "id": 9521,
  "sv": "samhällskunskap",
  "en": "social studies, civics",
  "c": "(-en)",
  "ch": 16,
  "t": "n",
  "g": "en"
}, {
  "id": 9522,
  "sv": "yrkesliv",
  "en": "working life",
  "c": "(-et)",
  "ch": 16,
  "t": "n",
  "g": "ett"
}, {
  "id": 9523,
  "sv": "utbildningssystem",
  "en": "education system",
  "c": "(-et, −, -en)",
  "ch": 16,
  "t": "n",
  "g": "ett"
}, {
  "id": 9524,
  "sv": "det vill säga",
  "en": "that is to say",
  "ch": 16,
  "t": "a"
}, {
  "id": 9525,
  "sv": "hösttermin",
  "en": "fall semester, autumn term",
  "c": "(-en, -er, -erna)",
  "ch": 16,
  "t": "n",
  "g": "en"
}, {
  "id": 9526,
  "sv": "vårtermin",
  "en": "spring semester, spring term",
  "c": "(-en, -er, -erna)",
  "ch": 16,
  "t": "n",
  "g": "en"
}, {
  "id": 9527,
  "sv": "jullov",
  "en": "Christmas holiday, Christmas break",
  "c": "(-et)",
  "ch": 16,
  "t": "n",
  "g": "ett"
}, {
  "id": 9528,
  "sv": "sportlov",
  "en": "February break",
  "c": "(-et)",
  "ch": 16,
  "t": "n",
  "g": "ett"
}, {
  "id": 9529,
  "sv": "påsklov",
  "en": "Easter break",
  "c": "(-et)",
  "ch": 16,
  "t": "n",
  "g": "ett"
}, {
  "id": 9530,
  "sv": "icke godkänt",
  "en": "fail",
  "ch": 16
}, {
  "id": 9531,
  "sv": "fordonsprogrammet",
  "en": "vehicle program",
  "ch": 16,
  "t": "n",
  "g": "ett"
}, {
  "id": 9532,
  "sv": "studielån",
  "en": "student loan",
  "c": "(-et, −, -en)",
  "ch": 16,
  "t": "n",
  "g": "ett"
}, {
  "id": 9533,
  "sv": "låna ut",
  "en": "lend",
  "c": "(-r, -de, -t)",
  "ch": 16
}, {
  "id": 9534,
  "sv": "forskarutbildning",
  "en": "prostgraduate studies, doctoral program",
  "c": "(-en)",
  "ch": 16,
  "t": "n",
  "g": "en"
}, {
  "id": 9535,
  "sv": "doktorsexamen",
  "en": "doctoral degree, PhD",
  "ch": 16,
  "t": "n",
  "g": "en"
}, {
  "id": 9536,
  "sv": "industriland",
  "en": "industrialized country",
  "c": "(-et, industriländer, industriländerna)",
  "ch": 16,
  "t": "n",
  "g": "ett"
}, {
  "id": 9537,
  "sv": "statlig skola",
  "en": "state-run school",
  "ch": 16
}, {
  "id": 9538,
  "sv": "plugghäst",
  "en": "nerd, someone who studies hard",
  "c": "(-en, -ar, -arna)",
  "ch": 16,
  "t": "n",
  "g": "en"
}, {
  "id": 9539,
  "sv": "extraövning",
  "en": "extra exercises",
  "c": "(-en, -ar, -arna)",
  "ch": 16,
  "t": "n",
  "g": "en"
}, {
  "id": 9540,
  "sv": "skolka",
  "en": "skip school",
  "c": "(-r, -de, -t)",
  "ch": 16,
  "t": "v"
}, {
  "id": 9541,
  "sv": "fint väder",
  "en": "nice weather",
  "ch": 16
}, {
  "id": 9542,
  "sv": "favoritämne",
  "en": "favorite subject",
  "c": "(-t, -n, -na)",
  "ch": 16,
  "t": "n",
  "g": "ett"
}, {
  "id": 9543,
  "sv": "småtråkig",
  "en": "a bit boring",
  "c": "(-t, -a)",
  "ch": 16,
  "t": "a"
}, {
  "id": 9544,
  "sv": "mattelärare",
  "en": "mathematics teacher",
  "c": "(-n)",
  "ch": 16,
  "t": "n",
  "g": "en"
}, {
  "id": 9545,
  "sv": "historielärare",
  "en": "history teacher",
  "c": "(-n, −, -historielärarna)",
  "ch": 16,
  "t": "n",
  "g": "en"
}, {
  "id": 9546,
  "sv": "Sydamerika",
  "en": "South America",
  "ch": 16,
  "t": "pn"
}, {
  "id": 9547,
  "sv": "teknisk fysik",
  "en": "technical physics",
  "ch": 16
}, {
  "id": 9548,
  "sv": "masterexamen",
  "en": "masters degree",
  "ch": 16,
  "t": "n",
  "g": "en"
}, {
  "id": 9549,
  "sv": "nanoteknik",
  "en": "nanotechnology",
  "c": "(-en)",
  "ch": 16,
  "t": "n",
  "g": "en"
}, {
  "id": 9550,
  "sv": "skoltrött",
  "en": "tired of school, lost motivation",
  "c": "(-a)",
  "ch": 16,
  "t": "a"
}, {
  "id": 9551,
  "sv": "spela gitarr",
  "en": "play guitar",
  "c": "(-r, -de, -t)",
  "ch": 16
}, {
  "id": 9552,
  "sv": "hoppa av",
  "en": "dropped out",
  "c": "(-r, -de, -t)",
  "ch": 16
}, {
  "id": 9553,
  "sv": "söka jobb",
  "en": "look for work",
  "c": "(-er, -te, -t)",
  "ch": 16
}, {
  "id": 9554,
  "sv": "bilverkstad",
  "en": "auto repair",
  "c": "(-en, bilverkstäder, bilverkstäderna)",
  "ch": 16,
  "t": "n",
  "g": "en"
}, {
  "id": 9555,
  "sv": "Berlin",
  "en": "Berlin",
  "ch": 16,
  "t": "pn"
}, {
  "id": 9556,
  "sv": "juristprogram",
  "en": "law program, law school",
  "c": "(-met, −, -men)",
  "ch": 16,
  "t": "n",
  "g": "ett"
}, {
  "id": 9557,
  "sv": "advokatbyrå",
  "en": "law firm",
  "c": "(-n, -er, -erna)",
  "ch": 16,
  "t": "n",
  "g": "en"
}, {
  "id": 9558,
  "sv": "andra chans",
  "en": "second chance",
  "ch": 16
}, {
  "id": 9559,
  "sv": "stödord",
  "en": "key words",
  "c": "(-et, −, -en)",
  "ch": 16,
  "t": "n",
  "g": "ett"
}, {
  "id": 9560,
  "sv": "naturkunskap",
  "en": "science",
  "c": "(-en)",
  "ch": 16,
  "t": "n",
  "g": "en"
}, {
  "id": 9561,
  "sv": "slöjd",
  "en": "shop class, woodwork",
  "c": "(-en)",
  "ch": 16,
  "t": "n",
  "g": "en"
}, {
  "id": 9562,
  "sv": "relativa bisatser",
  "en": "relative clause",
  "ch": 16
}, {
  "id": 9563,
  "sv": "satsadverb",
  "en": "clause adverb",
  "ch": 16,
  "t": "n",
  "g": "ett"
}, {
  "id": 9564,
  "sv": "verbpartikel verb",
  "en": "particle",
  "ch": 16
}, {
  "id": 9565,
  "sv": "byggnadsingenjör",
  "en": "structural engineer",
  "c": "(-en, -er, -erna)",
  "ch": 16,
  "t": "n",
  "g": "en"
}, {
  "id": 9566,
  "sv": "fast jobb",
  "en": "permanent position",
  "ch": 16
}, {
  "id": 9567,
  "sv": "frilansa",
  "en": "freelance",
  "c": "(-r, -de, -t)",
  "ch": 16,
  "t": "v"
}, {
  "id": 9568,
  "sv": "börsmäklare",
  "en": "stockbroker",
  "c": "(-n, −, börsmäklarna)",
  "ch": 16,
  "t": "n",
  "g": "en"
}, {
  "id": 9569,
  "sv": "KTH = Kungliga Tekniska Högskolan",
  "en": "Royal Institute of Technology",
  "ch": 16
}, {
  "id": 9570,
  "sv": "byggföretag",
  "en": "construction company",
  "c": "(-et, −, -en)",
  "ch": 16,
  "t": "n",
  "g": "ett"
}, {
  "id": 9571,
  "sv": "tidsutryck",
  "en": "expressions of time",
  "c": "(-et, −, -en)",
  "ch": 16,
  "t": "n",
  "g": "ett"
}, {
  "id": 9572,
  "sv": "tandkirurg",
  "en": "dental surgeon",
  "c": "(-en, -er, -erna)",
  "ch": 16,
  "t": "n",
  "g": "en"
}, {
  "id": 9573,
  "sv": "skoltid",
  "en": "schooling",
  "c": "(-en, -er, -erna)",
  "ch": 16,
  "t": "n",
  "g": "en"
}, {
  "id": 9574,
  "sv": "framtidsplan",
  "en": "plan for the future",
  "c": "(-en, -er, -erna)",
  "ch": 16,
  "t": "n",
  "g": "en"
}, {
  "id": 9575,
  "sv": "hyreslägenhet",
  "en": "rental apartment",
  "c": "(-en, -er, -erna)",
  "ch": 17,
  "t": "n",
  "g": "en"
}, {
  "id": 9576,
  "sv": "tvättstuga",
  "en": "laundry room",
  "c": "(-n, -or, -orna)",
  "ch": 17,
  "t": "n",
  "g": "en"
}, {
  "id": 9577,
  "sv": "öppen spis",
  "en": "fireplace",
  "ch": 17
}, {
  "id": 9578,
  "sv": "i bra skick",
  "en": "in good condition",
  "ch": 17
}, {
  "id": 9579,
  "sv": "mambo (vard)",
  "en": "someone who lives with his/her parents",
  "c": "0",
  "ch": 17
}, {
  "id": 9580,
  "sv": "särbo (vard)",
  "en": "a couple that do not live together",
  "c": "0",
  "ch": 17
}, {
  "id": 9581,
  "sv": "strax utanför",
  "en": "just outside of",
  "ch": 17
}, {
  "id": 9582,
  "sv": "elda",
  "en": "make a fire",
  "c": "(-r, -de, -t)",
  "ch": 17,
  "t": "v"
}, {
  "id": 9583,
  "sv": "hyreskontrakt",
  "en": "rental contract, lease",
  "c": "(-et, −, -en)",
  "ch": 17,
  "t": "n",
  "g": "ett"
}, {
  "id": 9584,
  "sv": "i andra hand",
  "en": "sublet",
  "ch": 17
}, {
  "id": 9585,
  "sv": "månadsavgift",
  "en": "monthly fee",
  "c": "(-en, -er, -erna)",
  "ch": 17,
  "t": "n",
  "g": "en"
}, {
  "id": 9586,
  "sv": "nyrenoverad",
  "en": "newly renovated",
  "c": "(-e)",
  "ch": 17,
  "t": "a"
}, {
  "id": 9587,
  "sv": "renoveringsobjekt",
  "en": "an object for renovation, a run-down place",
  "c": "(-et, −, -en)",
  "ch": 17,
  "t": "n",
  "g": "ett"
}, {
  "id": 9588,
  "sv": "kakelugn",
  "en": "tile stove",
  "c": "(-en, -ar, -arna)",
  "ch": 17,
  "t": "n",
  "g": "en"
}, {
  "id": 9589,
  "sv": "kokvrå",
  "en": "kitchenette",
  "c": "(-n, -er, -erna)",
  "ch": 17,
  "t": "n",
  "g": "en"
}, {
  "id": 9590,
  "sv": "wc = water closet",
  "en": "toilet",
  "c": "(-:t, -:n, -:na)",
  "ch": 17
}, {
  "id": 9591,
  "sv": "studentrum",
  "en": "studen room, dorm room",
  "c": "(-met, −, -men)",
  "ch": 17,
  "t": "n",
  "g": "ett"
}, {
  "id": 9592,
  "sv": "radhus",
  "en": "semi-detached",
  "c": "(-et, −, -en)",
  "ch": 17,
  "t": "n",
  "g": "ett"
}, {
  "id": 9593,
  "sv": "parhus",
  "en": "semi-detached, two-family house",
  "c": "(-et, −, -en)",
  "ch": 17,
  "t": "n",
  "g": "ett"
}, {
  "id": 9594,
  "sv": "husbåt",
  "en": "houseboat",
  "c": "(-en, -ar, -arna)",
  "ch": 17,
  "t": "n",
  "g": "en"
}, {
  "id": 9595,
  "sv": "tänka på",
  "en": "think about",
  "c": "(-er, -te, -t)",
  "ch": 17
}, {
  "id": 9596,
  "sv": "ha råd",
  "en": "be able to afford",
  "ch": 17
}, {
  "id": 9597,
  "sv": "singelhushåll",
  "en": "household with a single person",
  "c": "(-et, −, -en)",
  "ch": 17,
  "t": "n",
  "g": "ett"
}, {
  "id": 9598,
  "sv": "urbanisering",
  "en": "urbanization",
  "c": "(-en)",
  "ch": 17,
  "t": "n",
  "g": "en"
}, {
  "id": 9599,
  "sv": "storstadsregion",
  "en": "metropolitan area",
  "c": "(-en, -er, -erna)",
  "ch": 17,
  "t": "n",
  "g": "en"
}, {
  "id": 9600,
  "sv": "andrahandslägenhet",
  "en": "sublet apartment",
  "c": "(-en, -er, -erna)",
  "ch": 17,
  "t": "n",
  "g": "en"
}, {
  "id": 9601,
  "sv": "närförort",
  "en": "inner suburb",
  "c": "(-en, -er, -erna)",
  "ch": 17,
  "t": "n",
  "g": "en"
}, {
  "id": 9602,
  "sv": "pendlingsavstånd",
  "en": "commuting distance",
  "c": "(-et, −, -en)",
  "ch": 17,
  "t": "n",
  "g": "ett"
}, {
  "id": 9603,
  "sv": "inneboende",
  "en": "lodger",
  "c": "(-n)",
  "ch": 17,
  "t": "n",
  "g": "en"
}, {
  "id": 9604,
  "sv": "hellre",
  "en": "rather",
  "ch": 17,
  "t": "a"
}, {
  "id": 9605,
  "sv": "bostadsannons",
  "en": "housing ad, house listings",
  "c": "(-en, -er, -erna)",
  "ch": 17,
  "t": "n",
  "g": "en"
}, {
  "id": 9606,
  "sv": "högstbjudande",
  "en": "highest bidder",
  "ch": 17,
  "t": "n",
  "g": "en"
}, {
  "id": 9607,
  "sv": "det står",
  "en": "it says",
  "ch": 17
}, {
  "id": 9608,
  "sv": "eller högstbjudande",
  "en": "or the highest bid",
  "ch": 17
}, {
  "id": 9609,
  "sv": "sant",
  "en": "true",
  "ch": 17,
  "t": "a"
}, {
  "id": 9610,
  "sv": "sophämtning",
  "en": "garbage removal",
  "c": "(-en)",
  "ch": 17,
  "t": "n",
  "g": "en"
}, {
  "id": 9611,
  "sv": "sopor",
  "en": "garbage",
  "c": "(-na)",
  "ch": 17,
  "t": "n"
}, {
  "id": 9612,
  "sv": "jättehög",
  "en": "really high",
  "c": "(-t, -a)",
  "ch": 17,
  "t": "a"
}, {
  "id": 9613,
  "sv": "lika ... som",
  "en": "as... as",
  "ch": 17
}, {
  "id": 9614,
  "sv": "kvadrat (vard), kvadratmeter",
  "en": "square meter",
  "c": "0",
  "ch": 17
}, {
  "id": 9615,
  "sv": "renoveringschans",
  "en": "opportunity for renovation",
  "c": "(-en, -er, -erna)",
  "ch": 17,
  "t": "n",
  "g": "en"
}, {
  "id": 9616,
  "sv": "opraktisk",
  "en": "impractical",
  "c": "(-t, -a)",
  "ch": 17,
  "t": "a"
}, {
  "id": 9617,
  "sv": "närmare",
  "en": "closer",
  "ch": 17,
  "t": "a"
}, {
  "id": 9618,
  "sv": "fundera på",
  "en": "consider",
  "c": "(-r, -de, -t)",
  "ch": 17
}, {
  "id": 9619,
  "sv": "kolla upp",
  "en": "look up",
  "c": "(-r, -de, -t)",
  "ch": 17
}, {
  "id": 9620,
  "sv": "bingo",
  "en": "bingo",
  "c": "(-n)",
  "ch": 17,
  "t": "n",
  "g": "en"
}, {
  "id": 9621,
  "sv": "gräsklippning",
  "en": "mowing the lawn, cutting the grass",
  "c": "(-en, -ar, -arna)",
  "ch": 17,
  "t": "n",
  "g": "en"
}, {
  "id": 9622,
  "sv": "inte riktigt",
  "en": "not really",
  "ch": 17
}, {
  "id": 9623,
  "sv": "swimmingpool",
  "en": "swimming pool",
  "c": "(-en, -er, -erna)",
  "ch": 17,
  "t": "n",
  "g": "en"
}, {
  "id": 9624,
  "sv": "trädgårsdsarbete",
  "en": "yard work, gardening",
  "c": "(-t)",
  "ch": 17,
  "t": "n",
  "g": "ett"
}, {
  "id": 9625,
  "sv": "lägenhetsvisning",
  "en": "apartment viewing",
  "c": "(-en, -ar, -arna)",
  "ch": 17,
  "t": "n",
  "g": "en"
}, {
  "id": 9626,
  "sv": "hälsa välkommen",
  "en": "greet, welcome",
  "c": "(-r, -de, -t)",
  "ch": 17
}, {
  "id": 9627,
  "sv": "prospekt",
  "en": "prospectus, brochure",
  "c": "(-et, −, -en)",
  "ch": 17,
  "t": "n",
  "g": "ett"
}, {
  "id": 9628,
  "sv": "kristallkrona",
  "en": "crystal chandelier",
  "c": "(-n, -or, -orna)",
  "ch": 17,
  "t": "n",
  "g": "en"
}, {
  "id": 9629,
  "sv": "svartvit",
  "en": "black and white",
  "c": "(-t, -a)",
  "ch": 17,
  "t": "a"
}, {
  "id": 9630,
  "sv": "färgglad",
  "en": "colorful",
  "c": "(färglatt, färgglada)",
  "ch": 17,
  "t": "a"
}, {
  "id": 9631,
  "sv": "designlampa",
  "en": "designer lamp",
  "c": "(-n, -or, -orna)",
  "ch": 17,
  "t": "n",
  "g": "en"
}, {
  "id": 9632,
  "sv": "välplanerad",
  "en": "well planned",
  "c": "(välplanerat, välplanerade)",
  "ch": 17,
  "t": "a"
}, {
  "id": 9633,
  "sv": "trägolv",
  "en": "wood floors",
  "c": "(-et, −, -en)",
  "ch": 17,
  "t": "n",
  "g": "ett"
}, {
  "id": 9634,
  "sv": "innergård",
  "en": "inner courtyard",
  "c": "(-en, -ar, -arna)",
  "ch": 17,
  "t": "n",
  "g": "en"
}, {
  "id": 9635,
  "sv": "lägga ett bud",
  "en": "make a bid",
  "c": "(-er, la/lade, lagt)",
  "ch": 17
}, {
  "id": 9636,
  "sv": "mellan ... och",
  "en": "between... and",
  "ch": 17
}, {
  "id": 9637,
  "sv": "soffbord",
  "en": "coffee table",
  "c": "(-et, −, -en)",
  "ch": 17,
  "t": "n",
  "g": "ett"
}, {
  "id": 9638,
  "sv": "krukväxt",
  "en": "potted plant",
  "c": "(-en, -er, -erna)",
  "ch": 17,
  "t": "n",
  "g": "en"
}, {
  "id": 9639,
  "sv": "golvlampa",
  "en": "floorlamp",
  "c": "(-n, -or, -orna)",
  "ch": 17,
  "t": "n",
  "g": "en"
}, {
  "id": 9640,
  "sv": "irriterad",
  "en": "annoyed, irritated",
  "c": "(irriterat, irriterade)",
  "ch": 17,
  "t": "a"
}, {
  "id": 9641,
  "sv": "matbord",
  "en": "dining table",
  "c": "(-et, −, -en)",
  "ch": 17,
  "t": "n",
  "g": "ett"
}, {
  "id": 9642,
  "sv": "skrivbordslampa",
  "en": "desk lamp",
  "c": "(-n, -or, -orna)",
  "ch": 17,
  "t": "n",
  "g": "en"
}, {
  "id": 9643,
  "sv": "drömlägenhet",
  "en": "dream apartment",
  "c": "(-en, -er, -erna)",
  "ch": 17,
  "t": "n",
  "g": "en"
}, {
  "id": 9644,
  "sv": "Aldrig i livet!",
  "en": "Never in my life!",
  "ch": 17
}, {
  "id": 9645,
  "sv": "fy",
  "en": "Yuck!",
  "ch": 17,
  "t": "i"
}, {
  "id": 9646,
  "sv": "drömboende",
  "en": "dream home",
  "c": "(-t, -n, -na)",
  "ch": 17,
  "t": "n",
  "g": "ett"
}, {
  "id": 9647,
  "sv": "luftig",
  "en": "airy",
  "c": "(-t, -a)",
  "ch": 17,
  "t": "a"
}, {
  "id": 9648,
  "sv": "hemmabio",
  "en": "home cinema system",
  "c": "(-n)",
  "ch": 17,
  "t": "n",
  "g": "en"
}, {
  "id": 9649,
  "sv": "kaffeapparat",
  "en": "coffee maker",
  "c": "(-en, -er, -erna)",
  "ch": 18,
  "t": "n",
  "g": "en"
}, {
  "id": 9650,
  "sv": "kratta löv",
  "en": "rake leaves",
  "c": "(-r, -de, -t)",
  "ch": 18
}, {
  "id": 9651,
  "sv": "ta upp båten",
  "en": "bring in the boat",
  "c": "(-r, tog, tagit)",
  "ch": 18
}, {
  "id": 9652,
  "sv": "äsch",
  "en": "oh",
  "ch": 18,
  "t": "i"
}, {
  "id": 9653,
  "sv": "handla om",
  "en": "it is about",
  "c": "(-r, -de, -t)",
  "ch": 18
}, {
  "id": 9654,
  "sv": "dags",
  "en": "time",
  "ch": 18,
  "t": "a"
}, {
  "id": 9655,
  "sv": "suffix",
  "en": "suffix",
  "c": "(-et, −, -en)",
  "ch": 18,
  "t": "n",
  "g": "ett"
}, {
  "id": 9656,
  "sv": "hålla igång",
  "en": "keep going",
  "c": "(-er, höll, hållit)",
  "ch": 18
}, {
  "id": 9657,
  "sv": "kaffekonsumtion",
  "en": "coffee consumption",
  "ch": 18,
  "t": "n",
  "g": "en"
}, {
  "id": 9658,
  "sv": "oftare",
  "en": "more often",
  "ch": 18,
  "t": "a"
}, {
  "id": 9659,
  "sv": "samhällsfråga",
  "en": "a social issue",
  "c": "(-n, -or, -orna)",
  "ch": 18,
  "t": "n",
  "g": "en"
}, {
  "id": 9660,
  "sv": "koffein",
  "en": "caffeine",
  "c": "(-et)",
  "ch": 18,
  "t": "n",
  "g": "ett"
}, {
  "id": 9661,
  "sv": "koffeinfri",
  "en": "decaffeinated",
  "c": "(-tt, -a)",
  "ch": 18,
  "t": "a"
}, {
  "id": 9662,
  "sv": "kaffeimport",
  "en": "coffee imports",
  "c": "(-en)",
  "ch": 18,
  "t": "n",
  "g": "en"
}, {
  "id": 9663,
  "sv": "snabbkaffe",
  "en": "instant coffee",
  "c": "(-t)",
  "ch": 18,
  "t": "n",
  "g": "ett"
}, {
  "id": 9664,
  "sv": "mer än hälften",
  "en": "more, than half",
  "ch": 18
}, {
  "id": 9665,
  "sv": "mindre än hälften",
  "en": "less, than half",
  "ch": 18
}, {
  "id": 9666,
  "sv": "funka",
  "en": "work",
  "c": "(-r, -de, -t)",
  "ch": 18,
  "t": "v"
}, {
  "id": 9667,
  "sv": "bli över",
  "en": "be left over",
  "c": "(-r, blev, blivit)",
  "ch": 18
}, {
  "id": 9668,
  "sv": "kopieringsmaskin",
  "en": "copier, copy machine",
  "c": "(-en, -er, -erna)",
  "ch": 18,
  "t": "n",
  "g": "en"
}, {
  "id": 9669,
  "sv": "kortläsare",
  "en": "card reader",
  "c": "(-n, −, kortläsarna)",
  "ch": 18,
  "t": "n",
  "g": "en"
}, {
  "id": 9670,
  "sv": "projektor",
  "en": "projector",
  "c": "(-n, -er, -erna)",
  "ch": 18,
  "t": "n",
  "g": "en"
}, {
  "id": 9671,
  "sv": "kaffebryggare",
  "en": "coffee maker",
  "c": "(-n, −, kaffebryggarna)",
  "ch": 18,
  "t": "n",
  "g": "en"
}, {
  "id": 9672,
  "sv": "skopa",
  "en": "scoop",
  "c": "(-n, -or, -orna)",
  "ch": 18,
  "t": "n",
  "g": "en"
}, {
  "id": 9673,
  "sv": "timer",
  "en": "timer",
  "c": "(-n)",
  "ch": 18,
  "t": "n",
  "g": "en"
}, {
  "id": 9674,
  "sv": "matchande",
  "en": "matching",
  "ch": 18,
  "t": "a"
}, {
  "id": 9675,
  "sv": "adapter",
  "en": "adapter",
  "c": "(-n, -adaptrar, adaptrarna)",
  "ch": 18,
  "t": "n",
  "g": "en"
}, {
  "id": 9676,
  "sv": "stänga av",
  "en": "turn off",
  "c": "(-er, -de, -t)",
  "ch": 18
}, {
  "id": 9677,
  "sv": "dubbelsidig",
  "en": "double sided",
  "c": "(-t, -a)",
  "ch": 18,
  "t": "a"
}, {
  "id": 9678,
  "sv": "fyll på",
  "en": "refill",
  "c": "(-er, -de, -t)",
  "ch": 18
}, {
  "id": 9679,
  "sv": "IT-avdelning",
  "en": "IT department",
  "c": "(-en, -ar, -arna)",
  "ch": 18,
  "t": "n",
  "g": "en"
}, {
  "id": 9680,
  "sv": "vara sist",
  "en": "be last",
  "c": "(är, var, varit)",
  "ch": 18
}, {
  "id": 9681,
  "sv": "genitiv",
  "en": "genitive",
  "c": "(-et, −, -en)",
  "ch": 18,
  "t": "n",
  "g": "en"
}, {
  "id": 9682,
  "sv": "plats i kön",
  "en": "place in line",
  "ch": 18
}, {
  "id": 9683,
  "sv": "slå ett nummer",
  "en": "punch a number",
  "c": "(-r, slog, slagit)",
  "ch": 18
}, {
  "id": 9684,
  "sv": "beställa tid",
  "en": "make an appointment",
  "c": "(-er, -de, -t)",
  "ch": 18
}, {
  "id": 9685,
  "sv": "klippning",
  "en": "haircut",
  "c": "(-en, -ar, -arna)",
  "ch": 18,
  "t": "n",
  "g": "en"
}, {
  "id": 9686,
  "sv": "lånekort",
  "en": "library card",
  "c": "(-et, −, -en)",
  "ch": 18,
  "t": "n",
  "g": "ett"
}, {
  "id": 9687,
  "sv": "ännu",
  "en": "yet",
  "ch": 18,
  "t": "a"
}, {
  "id": 9688,
  "sv": "Barcelona",
  "en": "Barcelona",
  "ch": 18,
  "t": "pn"
}, {
  "id": 9689,
  "sv": "ingår",
  "en": "included",
  "ch": 18,
  "t": "v"
}, {
  "id": 9690,
  "sv": "senaste",
  "en": "latest",
  "ch": 18,
  "t": "a"
}, {
  "id": 9691,
  "sv": "spellista",
  "en": "playlist",
  "c": "(-n, -or, -orna)",
  "ch": 18,
  "t": "n",
  "g": "en"
}, {
  "id": 9692,
  "sv": "hörlurar",
  "en": "earphones",
  "c": "(-na)",
  "ch": 18,
  "t": "n"
}, {
  "id": 9693,
  "sv": "improvisera",
  "en": "improvise",
  "c": "(-r, -de, -t)",
  "ch": 18,
  "t": "v"
}, {
  "id": 9694,
  "sv": "sportbil",
  "en": "sports car",
  "c": "(-en, -ar, -arna)",
  "ch": 18,
  "t": "n",
  "g": "en"
}, {
  "id": 9695,
  "sv": "Spotify",
  "en": "Spotify",
  "ch": 18,
  "t": "pn"
}, {
  "id": 9696,
  "sv": "musikindustri",
  "en": "music industry",
  "c": "(-n, -er, -erna)",
  "ch": 18,
  "t": "n",
  "g": "en"
}, {
  "id": 9697,
  "sv": "strömmad",
  "en": "streamed",
  "ch": 18,
  "t": "a"
}, {
  "id": 9698,
  "sv": "webb-sida",
  "en": "web page",
  "c": "(-n, -or, -orna)",
  "ch": 18,
  "t": "n",
  "g": "en"
}, {
  "id": 9699,
  "sv": "internetbolag",
  "en": "internet company",
  "c": "(-et, −, -en)",
  "ch": 18,
  "t": "n",
  "g": "ett"
}, {
  "id": 9700,
  "sv": "miljonär",
  "en": "millionaire",
  "c": "(-en, -er, -erna)",
  "ch": 18,
  "t": "n",
  "g": "en"
}, {
  "id": 9701,
  "sv": "nörd",
  "en": "nerd",
  "c": "(-en, -ar, -arna)",
  "ch": 18,
  "t": "n",
  "g": "en"
}, {
  "id": 9702,
  "sv": "datanörd",
  "en": "computer nerd",
  "c": "(-en, -ar, -arna)",
  "ch": 18,
  "t": "n",
  "g": "en"
}, {
  "id": 9703,
  "sv": "personalavdelning",
  "en": "human resources department",
  "c": "(-en, -ar, -arna)",
  "ch": 18,
  "t": "n",
  "g": "en"
}, {
  "id": 9704,
  "sv": "Vem kan jag hälsa från?",
  "en": "Who can I say called?",
  "ch": 18
}, {
  "id": 9705,
  "sv": "support",
  "en": "support",
  "c": "(-en)",
  "ch": 18,
  "t": "n",
  "g": "en"
}, {
  "id": 9706,
  "sv": "be",
  "en": "ask",
  "c": "(ber, bad, bett)",
  "ch": 18,
  "t": "v"
}, {
  "id": 9707,
  "sv": "var god dröj",
  "en": "please hold",
  "ch": 18
}, {
  "id": 9708,
  "sv": "ingen fara",
  "en": "no problem",
  "ch": 18
}, {
  "id": 9709,
  "sv": "smarta telefoner",
  "en": "smartphones",
  "ch": 18
}, {
  "id": 9710,
  "sv": "tandklinik",
  "en": "dental clinic",
  "c": "(-en, -er, -erna)",
  "ch": 18,
  "t": "n",
  "g": "en"
}, {
  "id": 9711,
  "sv": "vabba (vard), ta ledigt för vård av sjukt barn",
  "en": "stay home from work to care for a sick child",
  "c": "0",
  "ch": 18
}, {
  "id": 9712,
  "sv": "AW",
  "en": "After work drinks after work",
  "ch": 18,
  "t": "n",
  "g": "en"
}, {
  "id": 9713,
  "sv": "vara ledig",
  "en": "be off work, have free time",
  "ch": 18
}, {
  "id": 9714,
  "sv": "Jag är ledsen",
  "en": "I’m sorry",
  "ch": 18
}, {
  "id": 9715,
  "sv": "kroppsdel",
  "en": "body part",
  "c": "(-en, -ar, -arna)",
  "ch": 19,
  "t": "n",
  "g": "en"
}, {
  "id": 9716,
  "sv": "navel",
  "en": "bellybutton",
  "c": "(-n, -navlar, navlarna)",
  "ch": 19,
  "t": "n",
  "g": "en"
}, {
  "id": 9717,
  "sv": "stjärt",
  "en": "buttocks",
  "c": "(-en, -ar, -arna)",
  "ch": 19,
  "t": "n",
  "g": "en"
}, {
  "id": 9718,
  "sv": "doktor",
  "en": "doctor, physician",
  "c": "(-n, -er, -erna)",
  "ch": 19,
  "t": "n",
  "g": "en"
}, {
  "id": 9719,
  "sv": "ont i huvudet",
  "en": "headache",
  "ch": 19
}, {
  "id": 9720,
  "sv": "var tredje",
  "en": "every third",
  "ch": 19
}, {
  "id": 9721,
  "sv": "huvudvärkstablett",
  "en": "headache pill, painkiller",
  "c": "(-en, -er, -erna)",
  "ch": 19,
  "t": "n",
  "g": "en"
}, {
  "id": 9722,
  "sv": "om dagen",
  "en": "a day",
  "ch": 19
}, {
  "id": 9723,
  "sv": "snusa",
  "en": "use snus, use snuff",
  "c": "(-r, -de, -t)",
  "ch": 19,
  "t": "v"
}, {
  "id": 9724,
  "sv": "hel del",
  "en": "a great deal",
  "t": "n",
  "g": "en",
  "ch": 19
}, {
  "id": 9725,
  "sv": "croupier",
  "en": "croupier",
  "c": "(-n, -er, -erna)",
  "ch": 19,
  "t": "n",
  "g": "en"
}, {
  "id": 9726,
  "sv": "kasino",
  "en": "casino",
  "c": "(-t, -n, -na)",
  "ch": 19,
  "t": "n",
  "g": "ett"
}, {
  "id": 9727,
  "sv": "superkoncentrerad",
  "en": "super concentrated",
  "c": "(-e)",
  "ch": 19,
  "t": "a"
}, {
  "id": 9728,
  "sv": "koncentrerad",
  "en": "concentrated",
  "c": "(-e)",
  "ch": 19,
  "t": "a"
}, {
  "id": 9729,
  "sv": "hockeytränare",
  "en": "ice hockey coach",
  "c": "(-n, −, -hockeytränarna)",
  "ch": 19,
  "t": "n",
  "g": "en"
}, {
  "id": 9730,
  "sv": "ha fullt upp",
  "en": "be kept busy",
  "ch": 19
}, {
  "id": 9731,
  "sv": "bero på",
  "en": "be due to",
  "c": "(-r, -dde, -t)",
  "ch": 19
}, {
  "id": 9732,
  "sv": "Maldiverna",
  "en": "The Maldives",
  "ch": 19,
  "t": "pn"
}, {
  "id": 9733,
  "sv": "ja- och nej fråga",
  "en": "yes and no question",
  "c": "(-n, -or, -orna)",
  "ch": 19
}, {
  "id": 9734,
  "sv": "kunglighet",
  "en": "royalty",
  "c": "(-en, -er, -erna)",
  "ch": 19,
  "t": "n",
  "g": "en"
}, {
  "id": 9735,
  "sv": "seriefigur",
  "en": "cartoon character",
  "c": "(-en, -er, -erna)",
  "ch": 19,
  "t": "n",
  "g": "en"
}, {
  "id": 9736,
  "sv": "betala räkningar",
  "en": "pay bills",
  "c": "(-r -de, -t)",
  "ch": 19
}, {
  "id": 9737,
  "sv": "må illa",
  "en": "feel ill, feel nauseated",
  "c": "(-r, -dde, -tt)",
  "ch": 19
}, {
  "id": 9738,
  "sv": "göra ont",
  "en": "hurt",
  "c": "(gör, gjorde, gjort)",
  "ch": 19
}, {
  "id": 9739,
  "sv": "svettas",
  "en": "to sweat",
  "c": "(svettas, svettades, svettats)",
  "ch": 19,
  "t": "v"
}, {
  "id": 9740,
  "sv": "svårt att andas",
  "en": "hard to breathe",
  "ch": 19
}, {
  "id": 9741,
  "sv": "blodtryck",
  "en": "blood pressure",
  "c": "(-et, −, -en)",
  "ch": 19,
  "t": "n",
  "g": "ett"
}, {
  "id": 9742,
  "sv": "blodtrycksmedicin",
  "en": "blood pressure medicine",
  "c": "(-en, -er, -erna)",
  "ch": 19,
  "t": "n",
  "g": "en"
}, {
  "id": 9743,
  "sv": "astmamedicin",
  "en": "asthma medicine",
  "c": "(-en, -er, -erna)",
  "ch": 19,
  "t": "n",
  "g": "en"
}, {
  "id": 9744,
  "sv": "slem",
  "en": "slime",
  "c": "(-met)",
  "ch": 19,
  "t": "n",
  "g": "ett"
}, {
  "id": 9745,
  "sv": "ont i magen",
  "en": "stomachache",
  "ch": 19
}, {
  "id": 9746,
  "sv": "Krya på dig!",
  "en": "Get well!",
  "ch": 19
}, {
  "id": 9747,
  "sv": "Aj!",
  "en": "Ow!",
  "ch": 19
}, {
  "id": 9748,
  "sv": "febertermometer",
  "en": "thermometer",
  "c": "(-n, febertermometrar, febertermometrarna)",
  "ch": 19,
  "t": "n",
  "g": "en"
}, {
  "id": 9749,
  "sv": "hostmedicin",
  "en": "cough syrup",
  "c": "(-en, -er, -erna)",
  "ch": 19,
  "t": "n",
  "g": "en"
}, {
  "id": 9750,
  "sv": "hjärntumör",
  "en": "brain tumor",
  "c": "(-en, -er, -erna)",
  "ch": 19,
  "t": "n",
  "g": "en"
}, {
  "id": 9751,
  "sv": "migrän",
  "en": "migraine",
  "c": "(-en)",
  "ch": 19,
  "t": "n",
  "g": "en"
}, {
  "id": 9752,
  "sv": "tycka synd om",
  "en": "feel sorry for",
  "c": "(-er, -te, -t)",
  "ch": 19
}, {
  "id": 9753,
  "sv": "symtom",
  "en": "symptom",
  "c": "(-et, −, -en)",
  "ch": 19,
  "t": "n",
  "g": "ett"
}, {
  "id": 9754,
  "sv": "läkarbesök",
  "en": "visit to the doctor",
  "c": "(-et, −, -en)",
  "ch": 19,
  "t": "n",
  "g": "ett"
}, {
  "id": 9755,
  "sv": "relationsexpert",
  "en": "relationship expert",
  "c": "(-en, -er, -erna)",
  "ch": 19,
  "t": "n",
  "g": "en"
}, {
  "id": 9756,
  "sv": "vara ihop",
  "en": "be together, have a relationship",
  "c": "(är, var, varit)",
  "ch": 19
}, {
  "id": 9757,
  "sv": "tevekväll",
  "en": "evening in front of the tv",
  "c": "(-en, -ar, -arna)",
  "ch": 19,
  "t": "n",
  "g": "en"
}, {
  "id": 9758,
  "sv": "skogspromenad",
  "en": "walk in the forest",
  "c": "(-en, -er, -erna)",
  "ch": 19,
  "t": "n",
  "g": "en"
}, {
  "id": 9759,
  "sv": "supertidig",
  "en": "super early",
  "c": "(-t, -a)",
  "ch": 19,
  "t": "a"
}, {
  "id": 9760,
  "sv": "få tillbaka",
  "en": "have back",
  "c": "(-r, fick, fått)",
  "ch": 19
}, {
  "id": 9761,
  "sv": "göra slut",
  "en": "break up",
  "c": "(gör, gjorde, gjort)",
  "ch": 19
}, {
  "id": 9762,
  "sv": "fågelhatare",
  "en": "bird-hater",
  "c": "(-n, −, -na)",
  "ch": 19,
  "t": "n",
  "g": "en"
}, {
  "id": 9763,
  "sv": "tänka positivt",
  "en": "think positive",
  "c": "(-er, -te, tänkt)",
  "ch": 19
}, {
  "id": 9764,
  "sv": "fågelfri",
  "en": "bird-free",
  "c": "(-tt, -a)",
  "ch": 19,
  "t": "a"
}, {
  "id": 9765,
  "sv": "sömntabletter",
  "en": "sleeping pills",
  "c": "(-en, -er, -erna)",
  "ch": 19,
  "t": "n"
}, {
  "id": 9766,
  "sv": "magproblem",
  "en": "stomach problems",
  "c": "(-et, −, -en)",
  "ch": 19,
  "t": "n",
  "g": "ett"
}, {
  "id": 9767,
  "sv": "underrubrik",
  "en": "subheading",
  "c": "(-en, -er, -erna)",
  "ch": 20,
  "t": "n",
  "g": "en"
}, {
  "id": 9768,
  "sv": "gå upp",
  "en": "go up",
  "c": "(-r, gick, gått)",
  "ch": 20
}, {
  "id": 9769,
  "sv": "snökaos",
  "en": "snow chaos",
  "c": "(-et, −, -en)",
  "ch": 20,
  "t": "n",
  "g": "ett"
}, {
  "id": 9770,
  "sv": "arbetlöshet",
  "en": "unemployment",
  "c": "(-en)",
  "ch": 20,
  "t": "n",
  "g": "en"
}, {
  "id": 9771,
  "sv": "gå ner",
  "en": "go down",
  "c": "(-r, gick, gått)",
  "ch": 20
}, {
  "id": 9772,
  "sv": "vann",
  "en": "won",
  "ch": 20,
  "t": "v"
}, {
  "id": 9773,
  "sv": "oavgjort",
  "en": "tie",
  "ch": 20,
  "t": "n",
  "g": "ett"
}, {
  "id": 9774,
  "sv": "tomte, jultomte",
  "en": "Santa Claus",
  "c": "(-n, -ar, -arna)",
  "ch": 20
}, {
  "id": 9775,
  "sv": "bostadslån",
  "en": "mortgage",
  "c": "(-et, −, -en)",
  "ch": 20,
  "t": "n",
  "g": "ett"
}, {
  "id": 9776,
  "sv": "seriekrock",
  "en": "pileup",
  "c": "(-en, -ar, -arna)",
  "ch": 20,
  "t": "n",
  "g": "en"
}, {
  "id": 9777,
  "sv": "färre",
  "en": "fewer",
  "ch": 20,
  "t": "a"
}, {
  "id": 9778,
  "sv": "chefsekonom",
  "en": "chief economist",
  "c": "(-en, -er, -erna)",
  "ch": 20,
  "t": "n",
  "g": "en"
}, {
  "id": 9779,
  "sv": "rekordlåg",
  "en": "record low",
  "c": "(-t, -a)",
  "ch": 20,
  "t": "a"
}, {
  "id": 9780,
  "sv": "gå ut hårt",
  "en": "start out aggressive",
  "ch": 20
}, {
  "id": 9781,
  "sv": "göra mål",
  "en": "make a goal",
  "c": "(gör, gjorde, gjort)",
  "ch": 20
}, {
  "id": 9782,
  "sv": "publikstöd",
  "en": "audience support",
  "c": "(-et)",
  "ch": 20,
  "t": "n",
  "g": "ett"
}, {
  "id": 9783,
  "sv": "trafikolycka",
  "en": "traffic accident",
  "c": "(-n, -or, -orna)",
  "ch": 20,
  "t": "n",
  "g": "en"
}, {
  "id": 9784,
  "sv": "bilist",
  "en": "driver",
  "c": "(-en, -er, -erna)",
  "ch": 20,
  "t": "n",
  "g": "en"
}, {
  "id": 9785,
  "sv": "snöoväder",
  "en": "snow storm",
  "c": "(snöovädret, −, snöovädren)",
  "ch": 20,
  "t": "n",
  "g": "ett"
}, {
  "id": 9786,
  "sv": "dela ut",
  "en": "give out",
  "c": "(-r, -de, -t)",
  "ch": 20
}, {
  "id": 9787,
  "sv": "klappar, julklappar",
  "en": "Christmas presents",
  "c": "(-na)",
  "ch": 20
}, {
  "id": 9788,
  "sv": "taxibolag",
  "en": "taxi company",
  "c": "(-et, −, -en)",
  "ch": 20,
  "t": "n",
  "g": "ett"
}, {
  "id": 9789,
  "sv": "specialutbildad",
  "en": "specially trained",
  "c": "(-e)",
  "ch": 20,
  "t": "a"
}, {
  "id": 9790,
  "sv": "Bahamas",
  "en": "Bahamas",
  "ch": 20,
  "t": "pn"
}, {
  "id": 9791,
  "sv": "storvinst",
  "en": "big win",
  "c": "(-en, -er, -erna)",
  "ch": 20,
  "t": "n",
  "g": "en"
}, {
  "id": 9792,
  "sv": "ta det lugnt",
  "en": "take it easy",
  "ch": 20
}, {
  "id": 9793,
  "sv": "tidningssida",
  "en": "newspaper page",
  "c": "(-n, -or, -orna)",
  "ch": 20,
  "t": "n",
  "g": "en"
}, {
  "id": 9794,
  "sv": "drabbas",
  "en": "be affected",
  "c": "(drabbas, drabbades, drabbats)",
  "ch": 20,
  "t": "v"
}, {
  "id": 9795,
  "sv": "göra i ordning",
  "en": "organize",
  "c": "(gör, gjorde, gjort)",
  "ch": 20
}, {
  "id": 9796,
  "sv": "banktjänsteman",
  "en": "bank official, bank clerk",
  "c": "(-nen, banktjänstemän, banktjänstemännen)",
  "ch": 20,
  "t": "n",
  "g": "en"
}, {
  "id": 9797,
  "sv": "vinkonsumtion",
  "en": "wine consumption",
  "c": "(-en)",
  "ch": 20,
  "t": "n",
  "g": "en"
}, {
  "id": 9798,
  "sv": "ekonominyheter",
  "en": "financial news",
  "c": "(-na)",
  "ch": 20,
  "t": "n"
}, {
  "id": 9799,
  "sv": "stå i",
  "en": "is worth",
  "c": "(-r, stod, stått)",
  "ch": 20
}, {
  "id": 9800,
  "sv": "Norrland",
  "en": "Norrland, nothern region of Sweden",
  "ch": 20,
  "t": "pn"
}, {
  "id": 9801,
  "sv": "Svealand",
  "en": "Svealand, central region of Sweden",
  "ch": 20,
  "t": "pn"
}, {
  "id": 9802,
  "sv": "Götaland",
  "en": "Götaland, southern region of Sweden",
  "ch": 20,
  "t": "pn"
}, {
  "id": 9803,
  "sv": "fattas",
  "en": "missing",
  "c": "(fattas, fattades, fattats)",
  "ch": 20,
  "t": "v"
}, {
  "id": 9804,
  "sv": "kulturhistoriker",
  "en": "cultural historian",
  "c": "(-n, −, -na)",
  "ch": 20,
  "t": "n",
  "g": "en"
}, {
  "id": 9805,
  "sv": "roa sig",
  "en": "amuse onself",
  "c": "(-r, -de, -t)",
  "ch": 20
}, {
  "id": 9806,
  "sv": "namninsamling",
  "en": "petition",
  "c": "(-en, -ar, -arna)",
  "ch": 20,
  "t": "n",
  "g": "en"
}, {
  "id": 9807,
  "sv": "ändra sig",
  "en": "change one’s mind",
  "c": "(-r, -de, -t)",
  "ch": 20
}, {
  "id": 9808,
  "sv": "Schweiz",
  "en": "Switzerland",
  "ch": 20,
  "t": "pn"
}, {
  "id": 9809,
  "sv": "föra över",
  "en": "transfer",
  "c": "(för, -de, -t)",
  "ch": 20
}, {
  "id": 9810,
  "sv": "nåt (=något)",
  "en": "anything",
  "c": "0",
  "ch": 20
}, {
  "id": 9811,
  "sv": "packa upp",
  "en": "unpack",
  "c": "(-r, -de, -t)",
  "ch": 20
}, {
  "id": 9812,
  "sv": "giftspindel",
  "en": "poisonous spider",
  "c": "(-n, -giftspindlar, giftspindlarna)",
  "ch": 20,
  "t": "n",
  "g": "en"
}, {
  "id": 9813,
  "sv": "glasburk",
  "en": "glass jar",
  "c": "(-en, -ar, -arna)",
  "ch": 20,
  "t": "n",
  "g": "en"
}, {
  "id": 9814,
  "sv": "terrarium",
  "en": "terrarium",
  "c": "(terrariet, terrarier, terrarierna)",
  "ch": 20,
  "t": "n",
  "g": "ett"
}, {
  "id": 9815,
  "sv": "krypa in",
  "en": "crawl in",
  "c": "(-er, kröp, krupit)",
  "ch": 20
}, {
  "id": 9816,
  "sv": "medievana",
  "en": "habit of media consumption",
  "c": "(-n, -or, -orna)",
  "ch": 20,
  "t": "n",
  "g": "en"
}, {
  "id": 9817,
  "sv": "slå ihop",
  "en": "add up",
  "c": "(-r, slog, slagit)",
  "ch": 20
}, {
  "id": 9818,
  "sv": "kvällstidning",
  "en": "evening paper",
  "c": "(-en, -ar, -arna)",
  "ch": 20,
  "t": "n",
  "g": "en"
}, {
  "id": 9819,
  "sv": "webbradio",
  "en": "radio on the web",
  "c": "(-n)",
  "ch": 20,
  "t": "n",
  "g": "en"
}, {
  "id": 9820,
  "sv": "Saco (Sveriges akademikers centralorganisation)",
  "en": "Swedish Confederation of Professional Associations",
  "c": "0",
  "ch": 20
}, {
  "id": 9821,
  "sv": "biomedicin",
  "en": "medical biology",
  "c": "(-en)",
  "ch": 20,
  "t": "n",
  "g": "en"
}, {
  "id": 9822,
  "sv": "biomedicinsk analytiker",
  "en": "biomedical analyst",
  "ch": 20
}, {
  "id": 9823,
  "sv": "gymnasieäarare",
  "en": "high school teacher",
  "c": "(-n, −, -gymnasielärarna)",
  "ch": 20,
  "t": "n",
  "g": "en"
}, {
  "id": 9824,
  "sv": "optimist",
  "en": "optimist",
  "c": "(-en, -er, -erna)",
  "ch": 20,
  "t": "n",
  "g": "en"
}, {
  "id": 9825,
  "sv": "kulturarbetare",
  "en": "worker in the culture sector",
  "c": "(-n, −, kulturarbetarna)",
  "ch": 20,
  "t": "n",
  "g": "en"
}, {
  "id": 9826,
  "sv": "typ/typer av",
  "en": "types of, sorts of",
  "ch": 20
}, {
  "id": 9827,
  "sv": "gruvteknik",
  "en": "mining technology",
  "c": "(-en, -er, -erna)",
  "ch": 20,
  "t": "n",
  "g": "en"
}, {
  "id": 9828,
  "sv": "skjutsköterska",
  "en": "nurse",
  "c": "(-n, -or, -orna)",
  "ch": 20,
  "t": "n",
  "g": "en"
}, {
  "id": 9829,
  "sv": "akuten",
  "en": "emergency room",
  "ch": 20,
  "t": "n",
  "g": "en"
}, {
  "id": 9830,
  "sv": "akutsjuksköterska",
  "en": "ER nurse",
  "c": "(-n, -or, -orna)",
  "ch": 20,
  "t": "n",
  "g": "en"
}, {
  "id": 9831,
  "sv": "operationssjukssköterska",
  "en": "surgical nurse",
  "c": "(-n, -or, -orna)",
  "ch": 20,
  "t": "n",
  "g": "en"
}, {
  "id": 9832,
  "sv": "systemutvecklare",
  "en": "system developer",
  "c": "(-n, −, systemutveckarna)",
  "ch": 20,
  "t": "n",
  "g": "en"
}, {
  "id": 9833,
  "sv": "informatör",
  "en": "public relations specialist",
  "c": "(-en, -er, -erna)",
  "ch": 20,
  "t": "n",
  "g": "en"
}, {
  "id": 9834,
  "sv": "industriarbete",
  "en": "industrial worker",
  "c": "(-t, -n, -na)",
  "ch": 20,
  "t": "n",
  "g": "ett"
}, {
  "id": 9835,
  "sv": "truckförare",
  "en": "truck driver",
  "c": "(-n, −, -na)",
  "ch": 20,
  "t": "n",
  "g": "en"
}, {
  "id": 9836,
  "sv": "montör",
  "en": "fitter",
  "c": "(-en, -er, -erna)",
  "ch": 20,
  "t": "n",
  "g": "en"
}, {
  "id": 9837,
  "sv": "Högskoleverket",
  "en": "Swedish Agency for Higher Education",
  "ch": 20,
  "t": "pn"
}, {
  "id": 9838,
  "sv": "vägledare",
  "en": "councelor",
  "c": "(-n, −, -vägledarna)",
  "ch": 20,
  "t": "n",
  "g": "en"
}, {
  "id": 9839,
  "sv": "studievägledare",
  "en": "academic counselor",
  "c": "(-n, −, studievägledarna)",
  "ch": 20,
  "t": "n",
  "g": "en"
}, {
  "id": 9840,
  "sv": "yrkesvägledare",
  "en": "professional counselor",
  "c": "(-n, −, yrkesvägledarna)",
  "ch": 20,
  "t": "n",
  "g": "en"
}, {
  "id": 9841,
  "sv": "nyhetsartikel",
  "en": "news article",
  "c": "(-n, nyhetsartiklar, nyhetsartiklarna)",
  "ch": 20,
  "t": "n",
  "g": "en"
}, {
  "id": 9842,
  "sv": "väcka intresse",
  "en": "arouse interest",
  "c": "(-er, väckte, väckt)",
  "ch": 20
}];
const VERBS = [{
  "id": 1,
  "inf": "vara",
  "pres": "är",
  "past": "var",
  "sup": "varit",
  "en": "to be"
}, {
  "id": 2,
  "inf": "ha",
  "pres": "har",
  "past": "hade",
  "sup": "haft",
  "en": "to have"
}, {
  "id": 3,
  "inf": "kunna",
  "pres": "kan",
  "past": "kunde",
  "sup": "kunnat",
  "en": "can, be able to"
}, {
  "id": 4,
  "inf": "unna",
  "pres": "unnar",
  "past": "unnade",
  "sup": "unnat",
  "en": "to not begrudge"
}, {
  "id": 5,
  "inf": "få",
  "pres": "får",
  "past": "fick",
  "sup": "fått",
  "en": "to get, may"
}, {
  "id": 6,
  "inf": "bli",
  "pres": "blir",
  "past": "blev",
  "sup": "blivit",
  "en": "to become"
}, {
  "id": 7,
  "inf": "komma",
  "pres": "kommer",
  "past": "kom",
  "sup": "kommit",
  "en": "to come"
}, {
  "id": 8,
  "inf": "vilja",
  "pres": "vill",
  "past": "ville",
  "sup": "velat",
  "en": "to want"
}, {
  "id": 9,
  "inf": "göra",
  "pres": "gör",
  "past": "gjorde",
  "sup": "gjort",
  "en": "to do, make"
}, {
  "id": 10,
  "inf": "finna",
  "pres": "finner",
  "past": "fann",
  "sup": "funnit",
  "en": "to find"
}, {
  "id": 11,
  "inf": "ta",
  "pres": "tar",
  "past": "tog",
  "sup": "tagit",
  "en": "to take"
}, {
  "id": 12,
  "inf": "se",
  "pres": "ser",
  "past": "såg",
  "sup": "sett",
  "en": "to see"
}, {
  "id": 13,
  "inf": "gå",
  "pres": "går",
  "past": "gick",
  "sup": "gått",
  "en": "to go, walk"
}, {
  "id": 14,
  "inf": "säga",
  "pres": "säger",
  "past": "sade",
  "sup": "sagt",
  "en": "to say"
}, {
  "id": 15,
  "inf": "äga",
  "pres": "äger",
  "past": "ägde",
  "sup": "ägt",
  "en": "to own"
}, {
  "id": 16,
  "inf": "betyda",
  "pres": "betyder",
  "past": "betydde",
  "sup": "betytt",
  "en": "to mean"
}, {
  "id": 17,
  "inf": "ge",
  "pres": "ger",
  "past": "gav",
  "sup": "gett",
  "en": "to give"
}, {
  "id": 18,
  "inf": "skriva",
  "pres": "skriver",
  "past": "skrev",
  "sup": "skrivit",
  "en": "to write"
}, {
  "id": 19,
  "inf": "riva",
  "pres": "river",
  "past": "rev",
  "sup": "rivit",
  "en": "to tear down"
}, {
  "id": 20,
  "inf": "börja",
  "pres": "börjar",
  "past": "började",
  "sup": "börjat",
  "en": "to begin"
}, {
  "id": 21,
  "inf": "tro",
  "pres": "tror",
  "past": "trodde",
  "sup": "trott",
  "en": "to believe"
}, {
  "id": 22,
  "inf": "tycka",
  "pres": "tycker",
  "past": "tyckte",
  "sup": "tyckt",
  "en": "to think, have an opinion"
}, {
  "id": 23,
  "inf": "veta",
  "pres": "vet",
  "past": "visste",
  "sup": "vetat",
  "en": "to know"
}, {
  "id": 24,
  "inf": "försöka",
  "pres": "försöker",
  "past": "försökte",
  "sup": "försökt",
  "en": "to try"
}, {
  "id": 25,
  "inf": "behöva",
  "pres": "behöver",
  "past": "behövde",
  "sup": "behövt",
  "en": "to need"
}, {
  "id": 26,
  "inf": "känna",
  "pres": "känner",
  "past": "kände",
  "sup": "känt",
  "en": "to feel, know (someone)"
}, {
  "id": 27,
  "inf": "läsa",
  "pres": "läser",
  "past": "läste",
  "sup": "läst",
  "en": "to read"
}, {
  "id": 28,
  "inf": "ro",
  "pres": "ror",
  "past": "rodde",
  "sup": "rott",
  "en": "to row"
}, {
  "id": 29,
  "inf": "låta",
  "pres": "låter",
  "past": "lät",
  "sup": "låtit",
  "en": "to let, sound"
}, {
  "id": 30,
  "inf": "stå",
  "pres": "står",
  "past": "stod",
  "sup": "stått",
  "en": "to stand"
}, {
  "id": 31,
  "inf": "visa",
  "pres": "visar",
  "past": "visade",
  "sup": "visat",
  "en": "to show"
}, {
  "id": 32,
  "inf": "använda",
  "pres": "använder",
  "past": "använde",
  "sup": "använt",
  "en": "to use"
}, {
  "id": 33,
  "inf": "vända",
  "pres": "vänder",
  "past": "vände",
  "sup": "vänt",
  "en": "to turn"
}, {
  "id": 34,
  "inf": "hålla",
  "pres": "håller",
  "past": "höll",
  "sup": "hållit",
  "en": "to hold"
}, {
  "id": 35,
  "inf": "tänka",
  "pres": "tänker",
  "past": "tänkte",
  "sup": "tänkt",
  "en": "to think"
}, {
  "id": 36,
  "inf": "söka",
  "pres": "söker",
  "past": "sökte",
  "sup": "sökt",
  "en": "to search, apply"
}, {
  "id": 37,
  "inf": "ligga",
  "pres": "ligger",
  "past": "låg",
  "sup": "legat",
  "en": "to lie (down)"
}, {
  "id": 38,
  "inf": "lägga",
  "pres": "lägger",
  "past": "lade",
  "sup": "lagt",
  "en": "to put, lay"
}, {
  "id": 39,
  "inf": "anse",
  "pres": "anser",
  "past": "ansåg",
  "sup": "ansett",
  "en": "to consider"
}, {
  "id": 40,
  "inf": "öva",
  "pres": "övar",
  "past": "övade",
  "sup": "övat",
  "en": "to practice"
}, {
  "id": 41,
  "inf": "handla",
  "pres": "handlar",
  "past": "handlade",
  "sup": "handlat",
  "en": "to shop, act"
}, {
  "id": 42,
  "inf": "öka",
  "pres": "ökar",
  "past": "ökade",
  "sup": "ökat",
  "en": "to increase"
}, {
  "id": 43,
  "inf": "skapa",
  "pres": "skapar",
  "past": "skapade",
  "sup": "skapat",
  "en": "to create"
}, {
  "id": 44,
  "inf": "kapa",
  "pres": "kapar",
  "past": "kapade",
  "sup": "kapat",
  "en": "to cut"
}, {
  "id": 45,
  "inf": "gälla",
  "pres": "gäller",
  "past": "gällde",
  "sup": "gällt",
  "en": "to apply, be valid"
}, {
  "id": 46,
  "inf": "verka",
  "pres": "verkar",
  "past": "verkade",
  "sup": "verkat",
  "en": "to seem, appear"
}, {
  "id": 47,
  "inf": "tala",
  "pres": "talar",
  "past": "talade",
  "sup": "talat",
  "en": "to speak"
}, {
  "id": 48,
  "inf": "bära",
  "pres": "bär",
  "past": "bar",
  "sup": "burit",
  "en": "to carry, wear"
}, {
  "id": 49,
  "inf": "höra",
  "pres": "hör",
  "past": "hörde",
  "sup": "hört",
  "en": "to hear"
}, {
  "id": 50,
  "inf": "innebära",
  "pres": "innebär",
  "past": "innebar",
  "sup": "inneburit",
  "en": "to mean, imply"
}, {
  "id": 51,
  "inf": "välja",
  "pres": "väljer",
  "past": "valde",
  "sup": "valt",
  "en": "to choose"
}, {
  "id": 52,
  "inf": "förstå",
  "pres": "förstår",
  "past": "förstod",
  "sup": "förstått",
  "en": "to understand"
}, {
  "id": 53,
  "inf": "spela",
  "pres": "spelar",
  "past": "spelade",
  "sup": "spelat",
  "en": "to play"
}, {
  "id": 54,
  "inf": "dra",
  "pres": "drar",
  "past": "drog",
  "sup": "dragit",
  "en": "to pull, leave"
}, {
  "id": 55,
  "inf": "leda",
  "pres": "leder",
  "past": "ledde",
  "sup": "lett",
  "en": "to lead"
}, {
  "id": 56,
  "inf": "lyckas",
  "pres": "lyckas",
  "past": "lyckades",
  "sup": "lyckats",
  "en": "to succeed"
}, {
  "id": 57,
  "inf": "lära",
  "pres": "lär",
  "past": "lärde",
  "sup": "lärt",
  "en": "to teach, learn"
}, {
  "id": 58,
  "inf": "sätta",
  "pres": "sätter",
  "past": "satte",
  "sup": "satt",
  "en": "to put, set"
}, {
  "id": 59,
  "inf": "lämna",
  "pres": "lämnar",
  "past": "lämnade",
  "sup": "lämnat",
  "en": "to leave"
}, {
  "id": 60,
  "inf": "bygga",
  "pres": "bygger",
  "past": "byggde",
  "sup": "byggt",
  "en": "to build"
}, {
  "id": 61,
  "inf": "kalla",
  "pres": "kallar",
  "past": "kallade",
  "sup": "kallat",
  "en": "to call"
}, {
  "id": 62,
  "inf": "leva",
  "pres": "lever",
  "past": "levde",
  "sup": "levt",
  "en": "to live"
}, {
  "id": 63,
  "inf": "ställa",
  "pres": "ställer",
  "past": "ställde",
  "sup": "ställt",
  "en": "to place, ask"
}, {
  "id": 64,
  "inf": "följa",
  "pres": "följer",
  "past": "följde",
  "sup": "följt",
  "en": "to follow"
}, {
  "id": 65,
  "inf": "ske",
  "pres": "sker",
  "past": "skedde",
  "sup": "skett",
  "en": "to happen"
}, {
  "id": 66,
  "inf": "kräva",
  "pres": "kräver",
  "past": "krävde",
  "sup": "krävt",
  "en": "to demand, require"
}, {
  "id": 67,
  "inf": "ena",
  "pres": "enar",
  "past": "enade",
  "sup": "enat",
  "en": "to unite"
}, {
  "id": 68,
  "inf": "svara",
  "pres": "svarar",
  "past": "svarade",
  "sup": "svarat",
  "en": "to answer"
}, {
  "id": 69,
  "inf": "fortsätta",
  "pres": "fortsätter",
  "past": "fortsatte",
  "sup": "fortsatt",
  "en": "to continue"
}, {
  "id": 70,
  "inf": "bruka",
  "pres": "brukar",
  "past": "brukade",
  "sup": "brukat",
  "en": "to usually do, use"
}, {
  "id": 71,
  "inf": "mena",
  "pres": "menar",
  "past": "menade",
  "sup": "menat",
  "en": "to mean"
}, {
  "id": 72,
  "inf": "slå",
  "pres": "slår",
  "past": "slog",
  "sup": "slagit",
  "en": "to hit, beat"
}, {
  "id": 73,
  "inf": "hända",
  "pres": "händer",
  "past": "hände",
  "sup": "hänt",
  "en": "to happen"
}, {
  "id": 74,
  "inf": "arbeta",
  "pres": "arbetar",
  "past": "arbetade",
  "sup": "arbetat",
  "en": "to work"
}, {
  "id": 75,
  "inf": "fungera",
  "pres": "fungerar",
  "past": "fungerade",
  "sup": "fungerat",
  "en": "to function"
}, {
  "id": 76,
  "inf": "beta",
  "pres": "betar",
  "past": "betade",
  "sup": "betat",
  "en": "to graze"
}, {
  "id": 77,
  "inf": "köpa",
  "pres": "köper",
  "past": "köpte",
  "sup": "köpt",
  "en": "to buy"
}, {
  "id": 78,
  "inf": "sitta",
  "pres": "sitter",
  "past": "satt",
  "sup": "suttit",
  "en": "to sit"
}, {
  "id": 79,
  "inf": "berätta",
  "pres": "berättar",
  "past": "berättade",
  "sup": "berättat",
  "en": "to tell"
}, {
  "id": 80,
  "inf": "rätta",
  "pres": "rättar",
  "past": "rättade",
  "sup": "rättat",
  "en": "to correct"
}, {
  "id": 81,
  "inf": "sluta",
  "pres": "slutar",
  "past": "slutade",
  "sup": "slutat",
  "en": "to stop, end"
}, {
  "id": 82,
  "inf": "åka",
  "pres": "åker",
  "past": "åkte",
  "sup": "åkt",
  "en": "to travel, go (by vehicle)"
}, {
  "id": 83,
  "inf": "betala",
  "pres": "betalar",
  "past": "betalade",
  "sup": "betalat",
  "en": "to pay"
}, {
  "id": 84,
  "inf": "utveckla",
  "pres": "utvecklar",
  "past": "utvecklade",
  "sup": "utvecklat",
  "en": "to develop"
}, {
  "id": 85,
  "inf": "föra",
  "pres": "för",
  "past": "förde",
  "sup": "fört",
  "en": "to lead, carry"
}, {
  "id": 86,
  "inf": "hjälpa",
  "pres": "hjälper",
  "past": "hjälpte",
  "sup": "hjälpt",
  "en": "to help"
}, {
  "id": 87,
  "inf": "vinna",
  "pres": "vinner",
  "past": "vann",
  "sup": "vunnit",
  "en": "to win"
}, {
  "id": 88,
  "inf": "vänta",
  "pres": "väntar",
  "past": "väntade",
  "sup": "väntat",
  "en": "to wait"
}, {
  "id": 89,
  "inf": "jobba",
  "pres": "jobbar",
  "past": "jobbade",
  "sup": "jobbat",
  "en": "to work"
}, {
  "id": 90,
  "inf": "klara",
  "pres": "klarar",
  "past": "klarade",
  "sup": "klarat",
  "en": "to manage, pass"
}, {
  "id": 91,
  "inf": "prata",
  "pres": "pratar",
  "past": "pratade",
  "sup": "pratat",
  "en": "to talk"
}, {
  "id": 92,
  "inf": "fråga",
  "pres": "frågar",
  "past": "frågade",
  "sup": "frågat",
  "en": "to ask"
}, {
  "id": 93,
  "inf": "anmäla",
  "pres": "anmäler",
  "past": "anmälde",
  "sup": "anmält",
  "en": "to report, register"
}, {
  "id": 94,
  "inf": "nå",
  "pres": "når",
  "past": "nådde",
  "sup": "nått",
  "en": "to reach"
}, {
  "id": 95,
  "inf": "bo",
  "pres": "bor",
  "past": "bodde",
  "sup": "bott",
  "en": "to live, reside"
}, {
  "id": 96,
  "inf": "stämma",
  "pres": "stämmer",
  "past": "stämde",
  "sup": "stämt",
  "en": "to be correct, tune"
}, {
  "id": 97,
  "inf": "dela",
  "pres": "delar",
  "past": "delade",
  "sup": "delat",
  "en": "to share"
}, {
  "id": 98,
  "inf": "köra",
  "pres": "kör",
  "past": "körde",
  "sup": "kört",
  "en": "to drive"
}, {
  "id": 99,
  "inf": "hoppas",
  "pres": "hoppas",
  "past": "hoppades",
  "sup": "hoppats",
  "en": "to hope"
}, {
  "id": 100,
  "inf": "förklara",
  "pres": "förklarar",
  "past": "förklarade",
  "sup": "förklarat",
  "en": "to explain"
}, {
  "id": 101,
  "inf": "tvinga",
  "pres": "tvingar",
  "past": "tvingade",
  "sup": "tvingat",
  "en": "to force"
}, {
  "id": 102,
  "inf": "påverka",
  "pres": "påverkar",
  "past": "påverkade",
  "sup": "påverkat",
  "en": "to influence"
}, {
  "id": 103,
  "inf": "titta",
  "pres": "tittar",
  "past": "tittade",
  "sup": "tittat",
  "en": "to look"
}, {
  "id": 104,
  "inf": "minska",
  "pres": "minskar",
  "past": "minskade",
  "sup": "minskat",
  "en": "to decrease"
}, {
  "id": 105,
  "inf": "bestämma",
  "pres": "bestämmer",
  "past": "bestämde",
  "sup": "bestämt",
  "en": "to decide"
}, {
  "id": 106,
  "inf": "skicka",
  "pres": "skickar",
  "past": "skickade",
  "sup": "skickat",
  "en": "to send"
}, {
  "id": 107,
  "inf": "ändra",
  "pres": "ändrar",
  "past": "ändrade",
  "sup": "ändrat",
  "en": "to change"
}, {
  "id": 108,
  "inf": "träffa",
  "pres": "träffar",
  "past": "träffade",
  "sup": "träffat",
  "en": "to meet"
}, {
  "id": 109,
  "inf": "diskutera",
  "pres": "diskuterar",
  "past": "diskuterade",
  "sup": "diskuterat",
  "en": "to discuss"
}, {
  "id": 110,
  "inf": "driva",
  "pres": "driver",
  "past": "drev",
  "sup": "drivit",
  "en": "to run, operate, drive"
}, {
  "id": 111,
  "inf": "sälja",
  "pres": "säljer",
  "past": "sålde",
  "sup": "sålt",
  "en": "to sell"
}, {
  "id": 112,
  "inf": "sakna",
  "pres": "saknar",
  "past": "saknade",
  "sup": "saknat",
  "en": "to miss"
}, {
  "id": 113,
  "inf": "länka",
  "pres": "länkar",
  "past": "länkade",
  "sup": "länkat",
  "en": "to link"
}, {
  "id": 114,
  "inf": "tyda",
  "pres": "tyder",
  "past": "tydde",
  "sup": "tytt",
  "en": "to interpret"
}, {
  "id": 115,
  "inf": "genomföra",
  "pres": "genomför",
  "past": "genomförde",
  "sup": "genomfört",
  "en": "to carry out"
}, {
  "id": 116,
  "inf": "räkna",
  "pres": "räknar",
  "past": "räknade",
  "sup": "räknat",
  "en": "to count"
}, {
  "id": 117,
  "inf": "beskriva",
  "pres": "beskriver",
  "past": "beskrev",
  "sup": "beskrivit",
  "en": "to describe"
}, {
  "id": 118,
  "inf": "möta",
  "pres": "möter",
  "past": "mötte",
  "sup": "mött",
  "en": "to meet"
}, {
  "id": 119,
  "inf": "heta",
  "pres": "heter",
  "past": "hette",
  "sup": "hetat",
  "en": "to be called, named"
}, {
  "id": 120,
  "inf": "äta",
  "pres": "äter",
  "past": "åt",
  "sup": "ätit",
  "en": "to eat"
}, {
  "id": 121,
  "inf": "flytta",
  "pres": "flyttar",
  "past": "flyttade",
  "sup": "flyttat",
  "en": "to move"
}, {
  "id": 122,
  "inf": "utgöra",
  "pres": "utgör",
  "past": "utgjorde",
  "sup": "utgjort",
  "en": "to constitute"
}, {
  "id": 123,
  "inf": "röra",
  "pres": "rör",
  "past": "rörde",
  "sup": "rört",
  "en": "to move, touch"
}, {
  "id": 124,
  "inf": "dö",
  "pres": "dör",
  "past": "dog",
  "sup": "dött",
  "en": "to die"
}, {
  "id": 125,
  "inf": "växa",
  "pres": "växer",
  "past": "växte",
  "sup": "växt",
  "en": "to grow"
}, {
  "id": 126,
  "inf": "våga",
  "pres": "vågar",
  "past": "vågade",
  "sup": "vågat",
  "en": "to dare"
}, {
  "id": 127,
  "inf": "fatta",
  "pres": "fattar",
  "past": "fattade",
  "sup": "fattat",
  "en": "to grasp, understand"
}, {
  "id": 128,
  "inf": "nämna",
  "pres": "nämner",
  "past": "nämnde",
  "sup": "nämnt",
  "en": "to mention"
}, {
  "id": 129,
  "inf": "be",
  "pres": "ber",
  "past": "bad",
  "sup": "bett",
  "en": "to ask, pray"
}, {
  "id": 130,
  "inf": "anta",
  "pres": "antar",
  "past": "antog",
  "sup": "antagit",
  "en": "to assume, accept"
}, {
  "id": 131,
  "inf": "föreslå",
  "pres": "föreslår",
  "past": "föreslog",
  "sup": "föreslagit",
  "en": "to suggest"
}, {
  "id": 132,
  "inf": "undra",
  "pres": "undrar",
  "past": "undrade",
  "sup": "undrat",
  "en": "to wonder"
}, {
  "id": 133,
  "inf": "lyssna",
  "pres": "lyssnar",
  "past": "lyssnade",
  "sup": "lyssnat",
  "en": "to listen"
}, {
  "id": 134,
  "inf": "delta",
  "pres": "deltar",
  "past": "deltog",
  "sup": "deltagit",
  "en": "to participate"
}, {
  "id": 135,
  "inf": "falla",
  "pres": "faller",
  "past": "föll",
  "sup": "fallit",
  "en": "to fall"
}, {
  "id": 136,
  "inf": "starta",
  "pres": "startar",
  "past": "startade",
  "sup": "startat",
  "en": "to start"
}, {
  "id": 137,
  "inf": "inse",
  "pres": "inser",
  "past": "insåg",
  "sup": "insett",
  "en": "to realize"
}, {
  "id": 138,
  "inf": "bidra",
  "pres": "bidrar",
  "past": "bidrog",
  "sup": "bidragit",
  "en": "to contribute"
}, {
  "id": 139,
  "inf": "luta",
  "pres": "lutar",
  "past": "lutade",
  "sup": "lutat",
  "en": "to lean"
}, {
  "id": 140,
  "inf": "bero",
  "pres": "beror",
  "past": "berodde",
  "sup": "berott",
  "en": "to depend"
}, {
  "id": 141,
  "inf": "minnas",
  "pres": "minns",
  "past": "mindes",
  "sup": "mints",
  "en": "to remember"
}, {
  "id": 142,
  "inf": "rösta",
  "pres": "röstar",
  "past": "röstade",
  "sup": "röstat",
  "en": "to vote"
}, {
  "id": 143,
  "inf": "kommentera",
  "pres": "kommenterar",
  "past": "kommenterade",
  "sup": "kommenterat",
  "en": "to comment"
}, {
  "id": 144,
  "inf": "gilla",
  "pres": "gillar",
  "past": "gillade",
  "sup": "gillat",
  "en": "to like"
}, {
  "id": 145,
  "inf": "bryta",
  "pres": "bryter",
  "past": "bröt",
  "sup": "brutit",
  "en": "to break"
}, {
  "id": 146,
  "inf": "innehålla",
  "pres": "innehåller",
  "past": "innehöll",
  "sup": "innehållit",
  "en": "to contain"
}, {
  "id": 147,
  "inf": "bjuda",
  "pres": "bjuder",
  "past": "bjöd",
  "sup": "bjudit",
  "en": "to invite, offer"
}, {
  "id": 148,
  "inf": "hävda",
  "pres": "hävdar",
  "past": "hävdade",
  "sup": "hävdat",
  "en": "to claim"
}, {
  "id": 149,
  "inf": "hamna",
  "pres": "hamnar",
  "past": "hamnade",
  "sup": "hamnat",
  "en": "to end up"
}, {
  "id": 150,
  "inf": "hinna",
  "pres": "hinner",
  "past": "hann",
  "sup": "hunnit",
  "en": "to have time"
}];
const VOCAB_BY_ID = new Map(VOCAB.map(v => [v.id, v]));
const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const MILESTONES = [50, 100, 250, 500, 1000, 1500, 2000, 2500, 3000];
function computeProgressStats(vocab, srs) {
  const cefrBuckets = {};
  CEFR_LEVELS.forEach(l => {
    cefrBuckets[l] = {
      total: 0,
      learned: 0
    };
  });
  const rivstartBucket = {
    total: 0,
    learned: 0
  };
  let totalWpm = 0,
    learnedWpm = 0,
    totalLearned = 0;
  for (const item of vocab) {
    const isLearned = !!srs[item.id];
    if (isLearned) totalLearned++;
    if (item.lv && cefrBuckets[item.lv]) {
      cefrBuckets[item.lv].total++;
      if (isLearned) cefrBuckets[item.lv].learned++;
    } else {
      rivstartBucket.total++;
      if (isLearned) rivstartBucket.learned++;
    }
    if (item.wpm) {
      totalWpm += item.wpm;
      if (isLearned) learnedWpm += item.wpm;
    }
  }
  const coveragePct = totalWpm > 0 ? learnedWpm / totalWpm * 100 : 0;
  const rawPct = vocab.length > 0 ? totalLearned / vocab.length * 100 : 0;
  return {
    cefrBuckets,
    rivstartBucket,
    coveragePct,
    rawPct,
    totalLearned,
    total: vocab.length
  };
}
function computeGrowthSeries(srs) {
  const entries = Object.values(srs);
  const dated = entries.filter(c => c.graduatedAt).map(c => c.graduatedAt.slice(0, 10));
  const undatedCount = entries.length - dated.length;
  const counts = {};
  dated.forEach(d => {
    counts[d] = (counts[d] || 0) + 1;
  });
  const days = Object.keys(counts).sort();
  let cumulative = 0;
  const series = [];
  if (undatedCount > 0) {
    cumulative += undatedCount;
    series.push({
      label: 'tidigare',
      cumulative
    });
  }
  days.forEach(d => {
    cumulative += counts[d];
    series.push({
      label: d,
      cumulative
    });
  });
  return series;
}
const HARD_LAPSES_THRESHOLD = 2;
const HARD_EF_THRESHOLD = 1.8;
const HARD_RESETS_THRESHOLD = 2;
function computeHardWordIds(state) {
  const auto = new Set();
  Object.entries(state.srs).forEach(([id, c]) => {
    if ((c.lapses || 0) >= HARD_LAPSES_THRESHOLD || (c.ef || 2.5) <= HARD_EF_THRESHOLD) auto.add(Number(id));
  });
  Object.entries(state.learning).forEach(([id, c]) => {
    if ((c.resets || 0) >= HARD_RESETS_THRESHOLD) auto.add(Number(id));
  });
  (state.manualHardIds || []).forEach(id => auto.add(id));
  (state.dismissedHardIds || []).forEach(id => auto.delete(id));
  return auto;
}
function isWordHard(state, id) {
  const auto = state.srs[id] && ((state.srs[id].lapses || 0) >= HARD_LAPSES_THRESHOLD || (state.srs[id].ef || 2.5) <= HARD_EF_THRESHOLD) || state.learning[id] && (state.learning[id].resets || 0) >= HARD_RESETS_THRESHOLD;
  const manual = (state.manualHardIds || []).includes(id);
  const dismissed = (state.dismissedHardIds || []).includes(id);
  return (auto || manual) && !dismissed;
}
const WORD_TYPE_LABELS = {
  n: 'noun',
  v: 'verb',
  a: 'adj/adv',
  p: 'pronoun',
  c: 'conj',
  s: 'subj',
  d: 'det',
  i: 'interj',
  pr: 'prep',
  num: 'numeral',
  pt: 'particle',
  pn: 'proper name'
};
const POS_FILTER_LABELS = {
  n: 'Substantiv',
  v: 'Verb',
  a: 'Adjektiv/Adverb',
  p: 'Pronomen',
  c: 'Konjunktion',
  s: 'Subjunktion',
  d: 'Determinerare',
  i: 'Interjektion',
  pr: 'Preposition',
  num: 'Räkneord',
  pt: 'Partikel',
  pn: 'Egennamn',
  '': 'Övrigt (otaggat)'
};
const STORAGE_KEY = 'ordforrad-state';
const todayStr = () => new Date().toISOString().slice(0, 10);
const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function cleanAnswer(raw) {
  return (raw || '').replace(/\s*\([^)]*\)/g, '').trim();
}
function extractAlts(raw) {
  const alts = [];
  const m = (raw || '').match(/\(([^)]*)\)/);
  if (m) {
    m[1].split(/[;,]/).forEach(part => {
      const mm = part.match(/(?:el\.|vardagl\.|förk\.)\s*(.+)/i);
      if (mm) alts.push(mm[1].trim());
    });
  }
  return alts;
}
function answerVariants(raw) {
  const cleaned = cleanAnswer(raw);
  const parts = cleaned.split('/').map(s => s.trim()).filter(Boolean);
  const alts = extractAlts(raw);
  return [...parts, ...alts].map(s => s.toLowerCase());
}
function checkTyped(input, correctRaw) {
  const norm = input.trim().toLowerCase();
  return answerVariants(correctRaw).includes(norm);
}
const LINKING_VERBS = new Set(['är', 'var', 'blir', 'blev', 'blivit', 'varit', 'vara']);
function findBlankWord(exampleSv, baseForm, wordType) {
  if (!exampleSv) return null;
  const cleanedBase = cleanAnswer(baseForm).split(' ')[0].toLowerCase();
  const stem = cleanedBase.slice(0, Math.min(3, cleanedBase.length));
  if (!stem || stem.length < 2) return null;
  const words = exampleSv.match(/[A-Za-zÅÄÖåäöÉé]+/g) || [];
  for (let i = 0; i < words.length; i++) {
    const lw = words[i].toLowerCase();
    if (lw.startsWith(stem) || stem.length >= 3 && stem.startsWith(lw)) {
      // Skip sentences where the blank is a predicate adjective/noun directly
      // after a linking verb ("Klockan är ___.") — almost anything fits there,
      // so it doesn't actually test knowledge of this specific word.
      const preceding = i > 0 ? words[i - 1].toLowerCase() : null;
      if ((wordType === 'a' || wordType === 'n') && preceding && LINKING_VERBS.has(preceding)) {
        return null;
      }
      return words[i];
    }
  }
  return null;
}
function pickDistractors(pool, correctItem, direction, count) {
  const correctText = cleanAnswer(direction === 'sv-en' ? correctItem.en : correctItem.sv).split('/')[0].trim().toLowerCase();
  const candidates = shuffle(pool.filter(v => v.id !== correctItem.id));
  const chosen = [];
  const seen = new Set([correctText]);
  for (const c of candidates) {
    const text = cleanAnswer(direction === 'sv-en' ? c.en : c.sv).split('/')[0].trim();
    const key = text.toLowerCase();
    if (key && !seen.has(key)) {
      seen.add(key);
      chosen.push(text);
    }
    if (chosen.length >= count) break;
  }
  return chosen;
}
function pickExtraExerciseType(card, lastType) {
  const candidates = ['mcq', 'type'];
  if (findBlankWord(card.es, card.sv, card.t)) candidates.push('blank');
  const filtered = candidates.filter(t => t !== lastType);
  const pool = filtered.length ? filtered : candidates;
  return pool[Math.floor(Math.random() * pool.length)];
}
function randDirection() {
  return Math.random() < 0.5 ? 'sv-en' : 'en-sv';
}

// Free-review mode: still honor the "Swedish-first until proven" rule for
// words that haven't yet been graded Good/Easy; graduated words get random direction.
function pickFreeReviewDirection(state, item) {
  const learningEntry = state.learning[item.id];
  if (learningEntry && !learningEntry.everGoodOrEasy) return 'sv-en';
  return randDirection();
}
function pickRandomCard(pool, avoidId) {
  if (pool.length === 1) return pool[0];
  let candidate;
  do {
    candidate = pool[Math.floor(Math.random() * pool.length)];
  } while (candidate.id === avoidId);
  return candidate;
}
function defaultAppState() {
  return {
    srs: {},
    // id -> { ef, interval, reps, due, lapses }  (graduated words)
    learning: {},
    // id -> { streak }  (in-progress, not yet graduated)
    todayIntroducedIds: [],
    // ids introduced today, for the Övningar/Matchningsspel pool
    seenMilestones: [],
    // milestone thresholds already celebrated (never re-shown)
    manualHardIds: [],
    // ids the user explicitly flagged as hard
    dismissedHardIds: [],
    // ids the user explicitly un-flagged (suppresses auto-detection)
    requiredReps: 3,
    newIntroducedToday: 0,
    bonusNewToday: 0,
    lastActiveDate: todayStr(),
    dailyNewLimit: 15,
    scope: 'all',
    totalReviews: 0,
    streak: 0,
    lastStudyDate: null
  };
}
function rolloverDay(state) {
  const today = todayStr();
  if (state.lastActiveDate !== today) {
    let streak = state.streak;
    if (state.lastStudyDate) {
      const diffDays = Math.round((new Date(today) - new Date(state.lastStudyDate)) / 86400000);
      if (diffDays > 1) streak = 0;
    }
    return {
      ...state,
      newIntroducedToday: 0,
      bonusNewToday: 0,
      todayIntroducedIds: [],
      lastActiveDate: today,
      streak
    };
  }
  return state;
}

/* Simplified SM-2 style scheduler, grade: 0=Again 1=Hard 2=Good 3=Easy */
function gradeCard(card, grade, now) {
  let {
    ef = 2.5,
    interval = 0,
    reps = 0,
    lapses = 0
  } = card || {};
  let dueDate;
  if (grade === 0) {
    lapses += 1;
    reps = 0;
    ef = Math.max(1.3, ef - 0.2);
    interval = 0;
    dueDate = now;
  } else {
    if (grade === 1) {
      ef = Math.max(1.3, ef - 0.15);
      interval = reps === 0 ? 1 : Math.max(1, Math.round(interval * 1.2));
    } else if (grade === 2) {
      if (reps === 0) interval = 1;else if (reps === 1) interval = 6;else interval = Math.max(1, Math.round(interval * ef));
    } else if (grade === 3) {
      ef = Math.min(3.0, ef + 0.15);
      interval = reps === 0 ? 4 : Math.max(1, Math.round(interval * ef * 1.3) + 1);
    }
    reps += 1;
    dueDate = addDays(now, interval);
  }
  return {
    ef,
    interval,
    reps,
    lapses,
    due: dueDate.toISOString()
  };
}
function useAppState(userId) {
  const [state, setState] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const saveTimer = useRef(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      let s = null;
      try {
        const {
          data,
          error
        } = await supabaseClient.from('progress').select('data').eq('user_id', userId).maybeSingle();
        if (error) throw error;
        if (data && data.data) s = data.data;
      } catch (e) {
        s = null;
      }
      if (!s || Object.keys(s).length === 0) s = defaultAppState();
      if (s.learning === undefined) s.learning = {};
      Object.keys(s.learning).forEach(id => {
        if (s.learning[id].everGoodOrEasy === undefined) {
          s.learning[id] = {
            ...s.learning[id],
            everGoodOrEasy: (s.learning[id].streak || 0) > 0
          };
        }
      });
      if (s.requiredReps === undefined) s.requiredReps = 3;
      if (s.bonusNewToday === undefined) s.bonusNewToday = 0;
      if (s.todayIntroducedIds === undefined) s.todayIntroducedIds = [];
      if (s.seenMilestones === undefined) s.seenMilestones = [];
      if (s.manualHardIds === undefined) s.manualHardIds = [];
      if (s.dismissedHardIds === undefined) s.dismissedHardIds = [];
      s = rolloverDay(s);
      if (!cancelled) {
        setState(s);
        setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);
  const persist = useCallback(s => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        const {
          error
        } = await supabaseClient.from('progress').upsert({
          user_id: userId,
          data: s
        }, {
          onConflict: 'user_id'
        });
        if (error) throw error;
        setSaveError(false);
      } catch (e) {
        setSaveError(true);
      }
    }, 800);
  }, [userId]);
  const update = useCallback(updater => {
    setState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      persist(next);
      return next;
    });
  }, [persist]);
  return {
    state,
    loaded,
    update,
    saveError
  };
}
function cardStats(vocab, state) {
  const now = new Date();
  let due = 0,
    learning = 0,
    mastered = 0,
    untouched = 0;
  for (const item of vocab) {
    if (state.srs[item.id]) {
      const c = state.srs[item.id];
      if (c.interval >= 21) mastered++;
      if (new Date(c.due) <= now) due++;
    } else if (state.learning[item.id]) {
      learning++;
    } else {
      untouched++;
    }
  }
  return {
    due,
    learning,
    mastered,
    untouched,
    total: vocab.length
  };
}
function buildFlashQueue(vocab, state) {
  const now = new Date();
  const pool = state.scope === 'all' ? vocab : vocab.filter(v => String(v.ch) === state.scope);
  const due = [];
  const inLearning = [];
  const unseen = [];
  for (const item of pool) {
    if (state.srs[item.id]) {
      if (new Date(state.srs[item.id].due) <= now) due.push(item);
    } else if (state.learning[item.id]) {
      inLearning.push(item);
    } else {
      unseen.push(item);
    }
  }
  const remainingNew = Math.max(0, state.dailyNewLimit + (state.bonusNewToday || 0) - state.newIntroducedToday);
  const freshPicks = unseen.slice(0, remainingNew);
  const newLearningEntries = {};
  freshPicks.forEach(item => {
    newLearningEntries[item.id] = {
      streak: 0,
      everGoodOrEasy: false
    };
  });
  const learningItems = [...inLearning, ...freshPicks].map(item => {
    const isFresh = !state.learning[item.id];
    const everGoodOrEasy = isFresh ? false : !!(state.learning[item.id] && state.learning[item.id].everGoodOrEasy);
    return {
      ...item,
      _kind: 'learning',
      _direction: everGoodOrEasy ? randDirection() : 'sv-en'
    };
  });
  const reviewItems = due.map(item => ({
    ...item,
    _kind: 'review',
    _direction: randDirection()
  }));
  const queue = shuffle([...reviewItems, ...learningItems]);
  return {
    queue,
    newLearningEntries,
    newIds: freshPicks.map(i => i.id)
  };
}
function randomRequeuePos(index, len, minGap) {
  const start = Math.min(len, index + minGap);
  if (start >= len) return len;
  return start + Math.floor(Math.random() * (len - start + 1));
}
function OrdforradApp({
  userId,
  userEmail,
  userName,
  onLogout,
  onUpdateName
}) {
  const {
    state,
    loaded,
    update,
    saveError
  } = useAppState(userId);
  const [screen, setScreen] = useState('home'); // home | flash | flash-summary | extras | match
  const [session, setSession] = useState(null);
  const [extrasSession, setExtrasSession] = useState(null);
  const [scopeOpen, setScopeOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [milestoneToast, setMilestoneToast] = useState(null);
  const chapters = useMemo(() => {
    const set = new Set();
    VOCAB.forEach(v => {
      if (v.ch) set.add(v.ch);
    });
    return Array.from(set).sort((a, b) => a - b);
  }, []);
  const scopedVocab = useMemo(() => {
    if (!state) return [];
    return state.scope === 'all' ? VOCAB : VOCAB.filter(v => String(v.ch) === state.scope);
  }, [state && state.scope]);
  const stats = useMemo(() => {
    if (!state) return null;
    return cardStats(scopedVocab, state);
  }, [state, scopedVocab]);
  const remainingNew = state ? Math.max(0, state.dailyNewLimit + (state.bonusNewToday || 0) - state.newIntroducedToday) : 0;
  const canStartFlash = stats && (stats.due > 0 || stats.learning > 0 || remainingNew > 0 && stats.untouched > 0);
  const capReached = stats && remainingNew === 0 && stats.due === 0 && stats.learning === 0 && stats.untouched > 0;
  const flashDoneForNow = stats && stats.due === 0 && stats.learning === 0 && remainingNew === 0;
  const hardWordIds = useMemo(() => state ? computeHardWordIds(state) : new Set(), [state && state.srs, state && state.learning, state && state.manualHardIds, state && state.dismissedHardIds]);
  const hardWordItems = useMemo(() => {
    return Array.from(hardWordIds).map(id => VOCAB_BY_ID.get(id)).filter(Boolean);
  }, [hardWordIds]);
  const extrasPool = useMemo(() => {
    if (!state) return [];
    // Today's new words, plus hard words duplicated (over-represented) so they show up more often.
    const todayItems = state.todayIntroducedIds.map(id => VOCAB_BY_ID.get(id)).filter(Boolean);
    return [...todayItems, ...hardWordItems, ...hardWordItems];
  }, [state && state.todayIntroducedIds, hardWordItems]);
  const extrasUnlocked = flashDoneForNow;
  const matchPool = useMemo(() => {
    const seen = new Set();
    const combined = [...(state ? state.todayIntroducedIds.map(id => VOCAB_BY_ID.get(id)).filter(Boolean) : []), ...hardWordItems];
    return combined.filter(w => {
      if (seen.has(w.id)) return false;
      seen.add(w.id);
      return true;
    });
  }, [state && state.todayIntroducedIds, hardWordItems]);
  const canExtras = extrasUnlocked && extrasPool.length >= 1;
  const canMatch = extrasUnlocked && matchPool.length >= 2;
  const canHardPractice = extrasUnlocked && hardWordItems.length >= 1;
  const startFlash = () => {
    if (!state) return;
    const {
      queue,
      newLearningEntries,
      newIds
    } = buildFlashQueue(VOCAB, state);
    if (queue.length === 0) return;
    if (newIds.length > 0) {
      update(prev => ({
        ...prev,
        learning: {
          ...prev.learning,
          ...newLearningEntries
        },
        newIntroducedToday: prev.newIntroducedToday + newIds.length,
        todayIntroducedIds: [...prev.todayIntroducedIds, ...newIds]
      }));
    }
    setSession({
      queue,
      index: 0,
      results: {
        again: 0,
        hard: 0,
        good: 0,
        easy: 0
      },
      graduatedCount: 0
    });
    setScreen('flash');
  };
  const startExtras = () => {
    if (extrasPool.length === 0) return;
    const lastTypeLocal = {};
    const queue = shuffle(extrasPool).map(item => {
      const extype = pickExtraExerciseType(item, lastTypeLocal[item.id]);
      lastTypeLocal[item.id] = extype;
      return {
        ...item,
        _exerciseType: extype,
        _direction: randDirection()
      };
    });
    setExtrasSession({
      queue,
      index: 0,
      results: {
        correct: 0,
        incorrect: 0
      }
    });
    setScreen('extras');
  };
  const startMatch = () => {
    if (matchPool.length < 2) return;
    setScreen('match');
  };
  const startHardPractice = () => {
    if (hardWordItems.length === 0) return;
    const lastTypeLocal = {};
    const queue = shuffle(hardWordItems).map(item => {
      const extype = pickExtraExerciseType(item, lastTypeLocal[item.id]);
      lastTypeLocal[item.id] = extype;
      return {
        ...item,
        _exerciseType: extype,
        _direction: randDirection()
      };
    });
    setExtrasSession({
      queue,
      index: 0,
      results: {
        correct: 0,
        incorrect: 0
      }
    });
    setScreen('extras');
  };
  const resetProgress = () => {
    update(() => defaultAppState());
    setConfirmReset(false);
    setSession(null);
    setExtrasSession(null);
    setScreen('home');
  };
  const currentCard = session ? session.queue[session.index] : null;
  const advanceFlash = (nextQueue, patch) => {
    setSession(prev => {
      const nextIndex = prev.index + 1;
      const merged = {
        ...prev,
        ...patch,
        queue: nextQueue,
        index: nextIndex
      };
      if (nextIndex >= nextQueue.length) setScreen('flash-summary');
      return merged;
    });
  };
  const handleFlashGrade = g => {
    if (!session || !currentCard) return;
    const card = currentCard;
    const now = new Date();
    const gradeNames = ['again', 'hard', 'good', 'easy'];
    let graduated = false;
    if (card._kind === 'review') {
      const prevCard = state.srs[card.id];
      const updated = gradeCard(prevCard, g, now);
      update(prev => ({
        ...prev,
        srs: {
          ...prev.srs,
          [card.id]: updated
        },
        totalReviews: prev.totalReviews + 1,
        lastStudyDate: todayStr(),
        streak: prev.lastStudyDate === todayStr() ? prev.streak : prev.streak + 1
      }));
      let nextQueue = session.queue;
      if (g === 0) {
        nextQueue = [...session.queue];
        const insertAt = randomRequeuePos(session.index, nextQueue.length, 3);
        nextQueue.splice(insertAt, 0, {
          ...card,
          _kind: 'review',
          _direction: randDirection()
        });
      }
      const nextResults = {
        ...session.results,
        [gradeNames[g]]: session.results[gradeNames[g]] + 1
      };
      advanceFlash(nextQueue, {
        results: nextResults
      });
    } else {
      const prevEntry = state.learning[card.id] || {
        streak: 0,
        everGoodOrEasy: false,
        resets: 0
      };
      const prevStreak = prevEntry.streak || 0;
      let nextEverGoodOrEasy = prevEntry.everGoodOrEasy;
      if (g === 2 || g === 3) nextEverGoodOrEasy = true;
      let crossedMilestone = null;
      update(prev => {
        const next = {
          ...prev,
          totalReviews: prev.totalReviews + 1,
          lastStudyDate: todayStr(),
          streak: prev.lastStudyDate === todayStr() ? prev.streak : prev.streak + 1
        };
        if (g === 0) {
          next.learning = {
            ...prev.learning,
            [card.id]: {
              streak: 0,
              everGoodOrEasy: nextEverGoodOrEasy,
              resets: (prevEntry.resets || 0) + 1
            }
          };
        } else {
          const newStreak = prevStreak + 1;
          if (newStreak >= prev.requiredReps) {
            graduated = true;
            const restLearning = {
              ...prev.learning
            };
            delete restLearning[card.id];
            next.learning = restLearning;
            const graduatedCard = gradeCard(undefined, g, now);
            // Preserve the struggle signal: a word that needed several resets to
            // finally graduate should still show up as "hard" afterward, not reset to 0.
            graduatedCard.lapses = Math.max(graduatedCard.lapses, prevEntry.resets || 0);
            next.srs = {
              ...prev.srs,
              [card.id]: {
                ...graduatedCard,
                graduatedAt: now.toISOString()
              }
            };
            const newTotal = Object.keys(next.srs).length;
            const seen = prev.seenMilestones || [];
            const hit = MILESTONES.find(m => newTotal >= m && !seen.includes(m));
            if (hit) {
              crossedMilestone = hit;
              next.seenMilestones = [...seen, hit];
            }
          } else {
            next.learning = {
              ...prev.learning,
              [card.id]: {
                streak: newStreak,
                everGoodOrEasy: nextEverGoodOrEasy,
                resets: prevEntry.resets || 0
              }
            };
          }
        }
        return next;
      });
      if (crossedMilestone) {
        setMilestoneToast(crossedMilestone);
        setTimeout(() => setMilestoneToast(null), 4000);
      }
      let nextQueue = session.queue;
      if (!graduated) {
        nextQueue = [...session.queue];
        const requeued = {
          ...card,
          _kind: 'learning',
          _direction: nextEverGoodOrEasy ? randDirection() : 'sv-en'
        };
        const insertAt = randomRequeuePos(session.index, nextQueue.length, 3);
        nextQueue.splice(insertAt, 0, requeued);
      }
      const nextResults = {
        ...session.results,
        [gradeNames[g]]: session.results[gradeNames[g]] + 1
      };
      advanceFlash(nextQueue, {
        results: nextResults,
        graduatedCount: session.graduatedCount + (graduated ? 1 : 0)
      });
    }
  };
  const handleExtrasResult = correct => {
    setExtrasSession(prev => ({
      ...prev,
      index: prev.index + 1,
      results: {
        correct: prev.results.correct + (correct ? 1 : 0),
        incorrect: prev.results.incorrect + (correct ? 0 : 1)
      }
    }));
  };
  const toggleHardWord = id => {
    update(prev => {
      const currentlyHard = isWordHard(prev, id);
      const manual = new Set(prev.manualHardIds || []);
      const dismissed = new Set(prev.dismissedHardIds || []);
      if (currentlyHard) {
        manual.delete(id);
        dismissed.add(id);
      } else {
        manual.add(id);
        dismissed.delete(id);
      }
      return {
        ...prev,
        manualHardIds: Array.from(manual),
        dismissedHardIds: Array.from(dismissed)
      };
    });
  };
  if (!loaded || !state) {
    return /*#__PURE__*/React.createElement("div", {
      className: "ord-root ord-loading"
    }, /*#__PURE__*/React.createElement(Style, null), /*#__PURE__*/React.createElement("div", {
      className: "ord-loading-tile"
    }, "ORDFÖRRÅD"));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "ord-root"
  }, /*#__PURE__*/React.createElement(Style, null), saveError && /*#__PURE__*/React.createElement("div", {
    className: "ord-save-error"
  }, "Kunde inte spara — kontrollera din internetanslutning"), milestoneToast && /*#__PURE__*/React.createElement("div", {
    className: "ord-milestone-toast"
  }, /*#__PURE__*/React.createElement(Award, {
    size: 20
  }), " ", milestoneToast, " ord inlärda! 🎉"), screen === 'home' && /*#__PURE__*/React.createElement(HomeScreen, {
    state: state,
    stats: stats,
    chapters: chapters,
    scopeOpen: scopeOpen,
    setScopeOpen: setScopeOpen,
    onSetScope: scope => update(prev => ({
      ...prev,
      scope
    })),
    onStartFlash: startFlash,
    onExtras: startExtras,
    onMatch: startMatch,
    canStartFlash: canStartFlash,
    canExtras: canExtras,
    canMatch: canMatch,
    extrasUnlocked: extrasUnlocked,
    extrasPoolCount: extrasPool.length,
    capReached: capReached,
    onBumpLimit: () => update(prev => ({
      ...prev,
      bonusNewToday: (prev.bonusNewToday || 0) + 15
    })),
    confirmReset: confirmReset,
    setConfirmReset: setConfirmReset,
    onReset: resetProgress,
    userEmail: userEmail,
    userName: userName,
    onLogout: onLogout,
    onUpdateName: onUpdateName,
    onOpenProgress: () => setScreen('progress'),
    onOpenHardWords: () => setScreen('hardwords'),
    hardWordCount: hardWordItems.length,
    onOpenDictionary: () => setScreen('dictionary'),
    onOpenVerbs: () => setScreen('verbs'),
    onOpenFreeReview: () => setScreen('freereview')
  }), screen === 'progress' && /*#__PURE__*/React.createElement(ProgressScreen, {
    state: state,
    onExit: () => setScreen('home')
  }), screen === 'flash' && session && currentCard && /*#__PURE__*/React.createElement(FlashScreen, {
    card: currentCard,
    onGrade: handleFlashGrade,
    index: session.index,
    total: session.queue.length,
    onExit: () => setScreen('home'),
    isHard: isWordHard(state, currentCard.id),
    onToggleHard: () => toggleHardWord(currentCard.id)
  }), screen === 'flash-summary' && session && /*#__PURE__*/React.createElement(SummaryScreen, {
    results: session.results,
    reviewed: session.index,
    graduatedCount: session.graduatedCount,
    onDone: () => {
      setSession(null);
      setScreen('home');
    }
  }), screen === 'extras' && extrasSession && /*#__PURE__*/React.createElement(ExtrasScreen, {
    session: extrasSession,
    onResult: handleExtrasResult,
    onExit: () => {
      setExtrasSession(null);
      setScreen('home');
    }
  }), screen === 'match' && /*#__PURE__*/React.createElement(MatchingGame, {
    words: matchPool.slice(0, 8),
    onExit: () => setScreen('home')
  }), screen === 'hardwords' && /*#__PURE__*/React.createElement(HardWordsScreen, {
    words: hardWordItems,
    state: state,
    onToggleHard: toggleHardWord,
    onPractice: startHardPractice,
    canPractice: canHardPractice,
    onExit: () => setScreen('home')
  }), screen === 'dictionary' && /*#__PURE__*/React.createElement(DictionaryScreen, {
    onExit: () => setScreen('home')
  }), screen === 'verbs' && /*#__PURE__*/React.createElement(VerbsScreen, {
    onExit: () => setScreen('home')
  }), screen === 'freereview' && /*#__PURE__*/React.createElement(FreeReviewScreen, {
    state: state,
    onExit: () => setScreen('home')
  }));
}

/* ---------------- Home Screen ---------------- */

function HomeScreen({
  state,
  stats,
  chapters,
  scopeOpen,
  setScopeOpen,
  onSetScope,
  onStartFlash,
  onExtras,
  onMatch,
  canStartFlash,
  canExtras,
  canMatch,
  extrasUnlocked,
  extrasPoolCount,
  capReached,
  onBumpLimit,
  confirmReset,
  setConfirmReset,
  onReset,
  userEmail,
  userName,
  onLogout,
  onOpenProgress,
  onUpdateName,
  onOpenHardWords,
  hardWordCount,
  onOpenDictionary,
  onOpenVerbs,
  onOpenFreeReview
}) {
  const scopeLabel = state.scope === 'all' ? 'Alla ord — frequency order' : `Rivstart · Kapitel ${state.scope}`;
  let extrasHelperText = null;
  if (!extrasUnlocked) extrasHelperText = 'Lås upp genom att slutföra dagens flashcards';else if (extrasPoolCount === 0) extrasHelperText = 'Inga ord introducerade idag att öva extra på';
  return /*#__PURE__*/React.createElement("div", {
    className: "ord-home"
  }, /*#__PURE__*/React.createElement("header", {
    className: "ord-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ord-eyebrow"
  }, "SVENSKA · ORDINLÄRNING"), /*#__PURE__*/React.createElement("h1", {
    className: "ord-title"
  }, "Ordförråd"), /*#__PURE__*/React.createElement("div", {
    className: "ord-sub"
  }, "din avgångstavla för svenska ord")), /*#__PURE__*/React.createElement("div", {
    className: "ord-user-banner"
  }, userName ? `Hej, ${userName}! 👋` : `Inloggad som ${userEmail}`), /*#__PURE__*/React.createElement("div", {
    className: "ord-board"
  }, /*#__PURE__*/React.createElement(BoardStat, {
    icon: /*#__PURE__*/React.createElement(Clock, {
      size: 18
    }),
    value: stats.due,
    label: "due now"
  }), /*#__PURE__*/React.createElement(BoardStat, {
    icon: /*#__PURE__*/React.createElement(Sparkles, {
      size: 18
    }),
    value: stats.learning,
    label: "learning"
  }), /*#__PURE__*/React.createElement(BoardStat, {
    icon: /*#__PURE__*/React.createElement(CheckCircle2, {
      size: 18
    }),
    value: stats.mastered,
    label: "mastered"
  }), /*#__PURE__*/React.createElement(BoardStat, {
    icon: /*#__PURE__*/React.createElement(Flame, {
      size: 18
    }),
    value: state.streak,
    label: "day streak"
  })), /*#__PURE__*/React.createElement("button", {
    className: "ord-progress-link",
    onClick: onOpenProgress
  }, /*#__PURE__*/React.createElement(TrendingUp, {
    size: 15
  }), " Se dina framsteg"), /*#__PURE__*/React.createElement("div", {
    className: "ord-scope"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ord-scope-btn",
    onClick: () => setScopeOpen(!scopeOpen)
  }, /*#__PURE__*/React.createElement("span", null, scopeLabel), /*#__PURE__*/React.createElement(ChevronDown, {
    size: 16,
    style: {
      transform: scopeOpen ? 'rotate(180deg)' : 'none',
      transition: 'transform .2s'
    }
  })), scopeOpen && /*#__PURE__*/React.createElement("div", {
    className: "ord-scope-menu"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ord-scope-item" + (state.scope === 'all' ? ' active' : ''),
    onClick: () => {
      onSetScope('all');
      setScopeOpen(false);
    }
  }, "Alla ord ", /*#__PURE__*/React.createElement("span", {
    className: "ord-scope-item-sub"
  }, "frequency order · ", VOCAB.length, " words")), chapters.map(ch => /*#__PURE__*/React.createElement("button", {
    key: ch,
    className: "ord-scope-item" + (state.scope === String(ch) ? ' active' : ''),
    onClick: () => {
      onSetScope(String(ch));
      setScopeOpen(false);
    }
  }, "Kapitel ", ch, " ", /*#__PURE__*/React.createElement("span", {
    className: "ord-scope-item-sub"
  }, "Rivstart"))))), /*#__PURE__*/React.createElement("div", {
    className: "ord-section-label"
  }, "1 · FLASHCARDS"), /*#__PURE__*/React.createElement("button", {
    className: "ord-start-btn",
    onClick: onStartFlash,
    disabled: !canStartFlash
  }, canStartFlash ? 'Börja repetera' : capReached ? 'Dagens gräns för nya ord nådd' : 'Inget att repetera — kom tillbaka senare'), capReached && /*#__PURE__*/React.createElement("button", {
    className: "ord-bump-btn",
    onClick: onBumpLimit
  }, "+ Studera 15 fler ord idag ändå"), /*#__PURE__*/React.createElement("div", {
    className: "ord-section-label"
  }, "2 · EXTRA ÖVNING ", !extrasUnlocked && /*#__PURE__*/React.createElement(Lock, {
    size: 11,
    style: {
      verticalAlign: -1,
      marginLeft: 3
    }
  })), /*#__PURE__*/React.createElement("button", {
    className: "ord-extras-btn",
    onClick: onExtras,
    disabled: !canExtras
  }, /*#__PURE__*/React.createElement(ListChecks, {
    size: 16
  }), " Övningar ", extrasUnlocked && extrasPoolCount > 0 ? `(${extrasPoolCount} ord)` : ''), /*#__PURE__*/React.createElement("button", {
    className: "ord-match-btn",
    onClick: onMatch,
    disabled: !canMatch
  }, /*#__PURE__*/React.createElement(Grid3x3, {
    size: 16
  }), " Matchningsspel"), extrasHelperText && /*#__PURE__*/React.createElement("div", {
    className: "ord-extras-helper"
  }, extrasHelperText), /*#__PURE__*/React.createElement("div", {
    className: "ord-section-label"
  }, "3 · VERKTYG"), /*#__PURE__*/React.createElement("button", {
    className: "ord-extras-btn",
    onClick: onOpenHardWords
  }, /*#__PURE__*/React.createElement(Flag, {
    size: 16
  }), " Svåra ord ", hardWordCount > 0 ? `(${hardWordCount})` : ''), /*#__PURE__*/React.createElement("button", {
    className: "ord-extras-btn",
    onClick: onOpenVerbs
  }, /*#__PURE__*/React.createElement(Repeat, {
    size: 16
  }), " Verb — böjningar"), /*#__PURE__*/React.createElement("button", {
    className: "ord-extras-btn",
    onClick: onOpenFreeReview
  }, /*#__PURE__*/React.createElement(Sparkles, {
    size: 16
  }), " Fri repetition"), /*#__PURE__*/React.createElement("button", {
    className: "ord-match-btn",
    onClick: onOpenDictionary
  }, /*#__PURE__*/React.createElement(BookOpen, {
    size: 16
  }), " Ordbok"), /*#__PURE__*/React.createElement("div", {
    className: "ord-progress-bar-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ord-progress-label"
  }, /*#__PURE__*/React.createElement("span", null, stats.total - stats.untouched, " / ", stats.total, " introduced")), /*#__PURE__*/React.createElement("div", {
    className: "ord-progress-track"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ord-progress-fill",
    style: {
      width: `${(stats.total - stats.untouched) / stats.total * 100}%`
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ord-footnote"
  }, "Nya ord/dag: ", state.dailyNewLimit, state.bonusNewToday ? ` (+${state.bonusNewToday} idag)` : '', " · Krav för att lära sig ett ord: ", state.requiredReps, " rätt · Repetitioner totalt: ", state.totalReviews), /*#__PURE__*/React.createElement("div", {
    className: "ord-reset-zone"
  }, !confirmReset ? /*#__PURE__*/React.createElement("button", {
    className: "ord-reset-link",
    onClick: () => setConfirmReset(true)
  }, "Börja om från början") : /*#__PURE__*/React.createElement("div", {
    className: "ord-reset-confirm"
  }, /*#__PURE__*/React.createElement("span", null, "Radera all statistik och börja om helt?"), /*#__PURE__*/React.createElement("div", {
    className: "ord-reset-confirm-btns"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ord-reset-yes",
    onClick: onReset
  }, "Ja, radera allt"), /*#__PURE__*/React.createElement("button", {
    className: "ord-reset-no",
    onClick: () => setConfirmReset(false)
  }, "Avbryt")))), /*#__PURE__*/React.createElement(InviteFriend, null), /*#__PURE__*/React.createElement("div", {
    className: "ord-account-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ord-account-email"
  }, userEmail), /*#__PURE__*/React.createElement(EditName, {
    currentName: userName,
    onUpdate: onUpdateName
  }), /*#__PURE__*/React.createElement("button", {
    className: "ord-reset-link",
    onClick: onLogout
  }, "Logga ut")));
}
function EditName({
  currentName,
  onUpdate
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(currentName || '');
  const [saving, setSaving] = useState(false);
  const submit = async e => {
    e.preventDefault();
    if (!name.trim() || saving) return;
    setSaving(true);
    const ok = await onUpdate(name.trim());
    setSaving(false);
    if (ok) setOpen(false);
  };
  if (!open) {
    return /*#__PURE__*/React.createElement("button", {
      className: "ord-reset-link",
      onClick: () => {
        setName(currentName || '');
        setOpen(true);
      }
    }, currentName ? 'Ändra namn' : 'Lägg till namn');
  }
  return /*#__PURE__*/React.createElement("form", {
    className: "ord-edit-name-form",
    onSubmit: submit
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: name,
    onChange: e => setName(e.target.value),
    placeholder: "Ditt förnamn",
    className: "ord-edit-name-input",
    autoFocus: true
  }), /*#__PURE__*/React.createElement("button", {
    className: "ord-reset-link",
    type: "submit",
    disabled: saving
  }, saving ? '...' : 'Spara'), /*#__PURE__*/React.createElement("button", {
    className: "ord-reset-link",
    type: "button",
    onClick: () => setOpen(false),
    disabled: saving
  }, "Avbryt"));
}
function InviteFriend() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('');
  const sendInvite = async e => {
    e.preventDefault();
    if (!email.trim() || status === 'sending') return;
    setStatus('sending');
    setErrorMsg('');
    try {
      const {
        data: {
          session
        }
      } = await supabaseClient.auth.getSession();
      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/invite-friend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          friendEmail: email.trim()
        })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Något gick fel');
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Något gick fel');
    }
  };
  if (!open) {
    return /*#__PURE__*/React.createElement("button", {
      className: "ord-invite-link",
      onClick: () => setOpen(true)
    }, "Gillar du Ordförråd? Bjud in en vän!");
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "ord-invite-box"
  }, status === 'sent' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ord-type-feedback correct"
  }, "Inbjudan skickad till ", email, "!"), /*#__PURE__*/React.createElement("button", {
    className: "ord-reset-link",
    onClick: () => {
      setOpen(false);
      setStatus('idle');
      setEmail('');
    }
  }, "Stäng")) : /*#__PURE__*/React.createElement("form", {
    className: "ord-login-form",
    onSubmit: sendInvite,
    style: {
      marginTop: 0
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "email",
    required: true,
    value: email,
    onChange: e => setEmail(e.target.value),
    placeholder: "väns@epost.se",
    className: "ord-type-input",
    autoComplete: "email"
  }), /*#__PURE__*/React.createElement("button", {
    className: "ord-start-btn",
    type: "submit",
    disabled: status === 'sending',
    style: {
      marginBottom: 0
    }
  }, status === 'sending' ? 'Skickar...' : 'Skicka inbjudan'), status === 'error' && /*#__PURE__*/React.createElement("div", {
    className: "ord-type-feedback incorrect"
  }, errorMsg), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ord-reset-link",
    onClick: () => {
      setOpen(false);
      setStatus('idle');
    }
  }, "Avbryt")));
}
function BoardStat({
  icon,
  value,
  label
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ord-board-stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ord-board-icon"
  }, icon), /*#__PURE__*/React.createElement("div", {
    className: "ord-board-value"
  }, value), /*#__PURE__*/React.createElement("div", {
    className: "ord-board-label"
  }, label));
}

/* ---------------- Progress screen (CEFR breakdown, coverage estimate, growth chart, milestones) ---------------- */

const CEFR_LABELS = {
  A1: 'A1 · Nybörjare',
  A2: 'A2',
  B1: 'B1 · Medel',
  B2: 'B2',
  C1: 'C1 · Avancerad',
  C2: 'C2'
};
function ProgressScreen({
  state,
  onExit
}) {
  const progress = useMemo(() => computeProgressStats(VOCAB, state.srs), [state.srs]);
  const growthSeries = useMemo(() => computeGrowthSeries(state.srs), [state.srs]);
  return /*#__PURE__*/React.createElement("div", {
    className: "ord-progress-screen"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ord-review-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ord-exit-btn",
    onClick: onExit
  }, /*#__PURE__*/React.createElement(ArrowLeft, {
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    className: "ord-eyebrow",
    style: {
      margin: 0
    }
  }, "DINA FRAMSTEG")), /*#__PURE__*/React.createElement("div", {
    className: "ord-coverage-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ord-coverage-split"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ord-coverage-stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ord-coverage-pct"
  }, progress.coveragePct.toFixed(0), "%"), /*#__PURE__*/React.createElement("div", {
    className: "ord-coverage-label"
  }, "ordfrekvenstäckning")), /*#__PURE__*/React.createElement("div", {
    className: "ord-coverage-divider"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ord-coverage-stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ord-coverage-pct ord-coverage-pct-raw"
  }, progress.rawPct.toFixed(1), "%"), /*#__PURE__*/React.createElement("div", {
    className: "ord-coverage-label"
  }, "av hela ordlistan"))), /*#__PURE__*/React.createElement("div", {
    className: "ord-coverage-note"
  }, /*#__PURE__*/React.createElement("strong", null, progress.totalLearned, " av ", progress.total), " ord inlärda totalt. Täckningssiffran visar hur vanliga dina ord är i löpande text — det är ", /*#__PURE__*/React.createElement("em", null, "inte"), " samma sak som att förstå en text. Verklig förståelse kräver oftast 95%+ täckning, så se den som en riktning, inte ett facit.")), /*#__PURE__*/React.createElement("div", {
    className: "ord-progress-section-title"
  }, "Nivå (CEFR)"), /*#__PURE__*/React.createElement("div", {
    className: "ord-cefr-list"
  }, CEFR_LEVELS.map(lv => {
    const b = progress.cefrBuckets[lv];
    if (b.total === 0) return null;
    const pct = b.learned / b.total * 100;
    return /*#__PURE__*/React.createElement("div", {
      className: "ord-cefr-row",
      key: lv
    }, /*#__PURE__*/React.createElement("div", {
      className: "ord-cefr-row-top"
    }, /*#__PURE__*/React.createElement("span", null, CEFR_LABELS[lv]), /*#__PURE__*/React.createElement("span", {
      className: "ord-cefr-count"
    }, b.learned, " / ", b.total)), /*#__PURE__*/React.createElement("div", {
      className: "ord-progress-track"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ord-progress-fill",
      style: {
        width: `${pct}%`
      }
    })));
  }), progress.rivstartBucket.total > 0 && /*#__PURE__*/React.createElement("div", {
    className: "ord-cefr-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ord-cefr-row-top"
  }, /*#__PURE__*/React.createElement("span", null, "Rivstart (ej CEFR-taggat)"), /*#__PURE__*/React.createElement("span", {
    className: "ord-cefr-count"
  }, progress.rivstartBucket.learned, " / ", progress.rivstartBucket.total)), /*#__PURE__*/React.createElement("div", {
    className: "ord-progress-track"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ord-progress-fill",
    style: {
      width: `${progress.rivstartBucket.learned / progress.rivstartBucket.total * 100}%`
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "ord-progress-section-title"
  }, "Tillväxt över tid"), /*#__PURE__*/React.createElement(GrowthChart, {
    series: growthSeries
  }), /*#__PURE__*/React.createElement("div", {
    className: "ord-progress-section-title"
  }, "Milstolpar"), /*#__PURE__*/React.createElement("div", {
    className: "ord-milestone-grid"
  }, MILESTONES.map(m => {
    const reached = progress.totalLearned >= m;
    return /*#__PURE__*/React.createElement("div", {
      key: m,
      className: "ord-milestone-badge" + (reached ? ' reached' : '')
    }, /*#__PURE__*/React.createElement(Award, {
      size: 16
    }), /*#__PURE__*/React.createElement("span", null, m));
  })));
}
function GrowthChart({
  series
}) {
  if (series.length < 2) {
    return /*#__PURE__*/React.createElement("div", {
      className: "ord-growth-empty"
    }, series.length === 0 ? 'Inga ord inlärda ännu — kom igång med flashcards!' : 'Fortsätt öva så växer grafen fram.');
  }
  const W = 400,
    H = 140,
    PAD = 24;
  const maxVal = series[series.length - 1].cumulative;
  const points = series.map((d, i) => {
    const x = PAD + i / (series.length - 1) * (W - PAD * 2);
    const y = H - PAD - d.cumulative / maxVal * (H - PAD * 2);
    return [x, y];
  });
  const pathD = points.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const areaD = pathD + ` L${points[points.length - 1][0].toFixed(1)},${H - PAD} L${points[0][0].toFixed(1)},${H - PAD} Z`;
  return /*#__PURE__*/React.createElement("div", {
    className: "ord-growth-chart"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${W} ${H}`,
    width: "100%",
    height: H
  }, /*#__PURE__*/React.createElement("path", {
    d: areaD,
    fill: "rgba(162,62,42,0.1)"
  }), /*#__PURE__*/React.createElement("path", {
    d: pathD,
    fill: "none",
    stroke: "#A23E2A",
    strokeWidth: "2.5"
  }), points.map((p, i) => /*#__PURE__*/React.createElement("circle", {
    key: i,
    cx: p[0],
    cy: p[1],
    r: i === points.length - 1 ? 4 : 2.5,
    fill: "#A23E2A"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ord-growth-labels"
  }, /*#__PURE__*/React.createElement("span", null, series[0].label === 'tidigare' ? 'tidigare' : series[0].label), /*#__PURE__*/React.createElement("span", {
    className: "ord-growth-max"
  }, maxVal, " ord"), /*#__PURE__*/React.createElement("span", null, series[series.length - 1].label)));
}

/* ---------------- Shared exercise frame (consistent layout for every type) ---------------- */

function TopBar({
  index,
  total,
  onExit
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ord-review-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ord-exit-btn",
    onClick: onExit
  }, /*#__PURE__*/React.createElement(X, {
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    className: "ord-review-progress"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ord-review-progress-track"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ord-review-progress-fill",
    style: {
      width: `${index / total * 100}%`
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "ord-review-progress-count"
  }, index + 1, " / ", total)));
}
function ExerciseFrame({
  eyebrow,
  stage,
  action
}) {
  useEffect(() => {
    // Every new turn remounts this frame — make sure the question itself is
    // visible from the start, even if a mobile keyboard is about to shift things.
    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ord-exercise-eyebrow"
  }, eyebrow), /*#__PURE__*/React.createElement("div", {
    className: "ord-stage"
  }, stage), /*#__PURE__*/React.createElement("div", {
    className: "ord-action-row"
  }, action));
}
function isTouchDevice() {
  return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
}

/* ---------------- Flashcard screen (primary activity) ---------------- */

function FlashScreen({
  card,
  onGrade,
  index,
  total,
  onExit,
  isHard,
  onToggleHard
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ord-review"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ord-review-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ord-exit-btn",
    onClick: onExit
  }, /*#__PURE__*/React.createElement(X, {
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    className: "ord-review-progress"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ord-review-progress-track"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ord-review-progress-fill",
    style: {
      width: `${index / total * 100}%`
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "ord-review-progress-count"
  }, index + 1, " / ", total)), /*#__PURE__*/React.createElement("button", {
    className: "ord-flag-btn" + (isHard ? ' flagged' : ''),
    onClick: onToggleHard,
    title: isHard ? 'Ta bort från svåra ord' : 'Markera som svårt'
  }, /*#__PURE__*/React.createElement(Flag, {
    size: 16
  }))), /*#__PURE__*/React.createElement(FlashcardExercise, {
    key: index,
    card: card,
    onGrade: onGrade
  }));
}
function FlashcardExercise({
  card,
  onGrade
}) {
  const [flipped, setFlipped] = useState(false);
  useEffect(() => {
    const onKey = e => {
      if (e.key === ' ' || e.key === 'Enter') {
        if (!flipped) {
          e.preventDefault();
          setFlipped(true);
        }
      } else if (flipped && ['1', '2', '3', '4'].includes(e.key)) {
        onGrade(parseInt(e.key, 10) - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flipped, onGrade]);
  const direction = card._direction;
  const front = direction === 'sv-en' ? card.sv : card.en;
  const back = direction === 'sv-en' ? card.en : card.sv;
  const frontLabel = direction === 'sv-en' ? 'SVENSKA' : 'ENGLISH';
  const backLabel = direction === 'sv-en' ? 'ENGLISH' : 'SVENSKA';
  const modeLabel = card._kind === 'learning' ? 'NYTT ORD' : 'REPETITION';
  return /*#__PURE__*/React.createElement(ExerciseFrame, {
    eyebrow: `${frontLabel} · ${modeLabel}`,
    stage: /*#__PURE__*/React.createElement("div", {
      className: "ord-flap" + (flipped ? ' is-flipped' : ''),
      onClick: () => setFlipped(f => !f)
    }, /*#__PURE__*/React.createElement("div", {
      className: "ord-flap-face ord-flap-front"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ord-flap-eyebrow"
    }, frontLabel), /*#__PURE__*/React.createElement("div", {
      className: "ord-flap-word"
    }, front), card.t && WORD_TYPE_LABELS[card.t] && /*#__PURE__*/React.createElement("div", {
      className: "ord-flap-tag"
    }, WORD_TYPE_LABELS[card.t], card.g ? ` · ${card.g}` : ''), /*#__PURE__*/React.createElement("div", {
      className: "ord-flap-hint"
    }, "tap, space, or enter to flip")), /*#__PURE__*/React.createElement("div", {
      className: "ord-flap-face ord-flap-back"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ord-flap-eyebrow"
    }, backLabel), /*#__PURE__*/React.createElement("div", {
      className: "ord-flap-word"
    }, back), card.c && /*#__PURE__*/React.createElement("div", {
      className: "ord-flap-conj"
    }, card.c), card.es && /*#__PURE__*/React.createElement("div", {
      className: "ord-flap-example"
    }, /*#__PURE__*/React.createElement("div", null, card.es), /*#__PURE__*/React.createElement("div", {
      className: "ord-flap-example-en"
    }, card.ee)))),
    action: flipped ? /*#__PURE__*/React.createElement("div", {
      className: "ord-grade-row"
    }, /*#__PURE__*/React.createElement("button", {
      className: "ord-grade-btn ord-grade-again",
      onClick: () => onGrade(0)
    }, /*#__PURE__*/React.createElement("span", {
      className: "ord-grade-key"
    }, "1"), "Again"), /*#__PURE__*/React.createElement("button", {
      className: "ord-grade-btn ord-grade-hard",
      onClick: () => onGrade(1)
    }, /*#__PURE__*/React.createElement("span", {
      className: "ord-grade-key"
    }, "2"), "Hard"), /*#__PURE__*/React.createElement("button", {
      className: "ord-grade-btn ord-grade-good",
      onClick: () => onGrade(2)
    }, /*#__PURE__*/React.createElement("span", {
      className: "ord-grade-key"
    }, "3"), "Good"), /*#__PURE__*/React.createElement("button", {
      className: "ord-grade-btn ord-grade-easy",
      onClick: () => onGrade(3)
    }, /*#__PURE__*/React.createElement("span", {
      className: "ord-grade-key"
    }, "4"), "Easy")) : /*#__PURE__*/React.createElement("button", {
      className: "ord-reveal-btn",
      onClick: () => setFlipped(true)
    }, /*#__PURE__*/React.createElement(RotateCcw, {
      size: 16
    }), " Visa svar ", /*#__PURE__*/React.createElement("span", {
      className: "ord-key-hint"
    }, "space / enter"))
  });
}

/* ---------------- Extras (Övningar): MCQ / Type / Blank, no scheduling effect ---------------- */

function ExtrasScreen({
  session,
  onResult,
  onExit
}) {
  const done = session.index >= session.queue.length;
  const current = !done ? session.queue[session.index] : null;
  return /*#__PURE__*/React.createElement("div", {
    className: "ord-review"
  }, /*#__PURE__*/React.createElement(TopBar, {
    index: Math.min(session.index, session.queue.length - 1),
    total: session.queue.length,
    onExit: onExit
  }), done ? /*#__PURE__*/React.createElement("div", {
    className: "ord-summary"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ord-eyebrow"
  }, "ÖVNINGAR KLARA"), /*#__PURE__*/React.createElement("h2", {
    className: "ord-summary-title"
  }, "Bra övat!"), /*#__PURE__*/React.createElement("div", {
    className: "ord-summary-count"
  }, session.results.correct, " rätt · ", session.results.incorrect, " fel"), /*#__PURE__*/React.createElement("button", {
    className: "ord-start-btn",
    onClick: onExit
  }, "Tillbaka")) : /*#__PURE__*/React.createElement(ExtraTurn, {
    key: session.index,
    card: current,
    onResult: onResult
  }));
}
function ExtraTurn({
  card,
  onResult
}) {
  if (card._exerciseType === 'blank') return /*#__PURE__*/React.createElement(BlankExercise, {
    card: card,
    onResult: onResult
  });
  if (card._exerciseType === 'type') return /*#__PURE__*/React.createElement(TypeExercise, {
    card: card,
    direction: card._direction,
    onResult: onResult
  });
  return /*#__PURE__*/React.createElement(MCQExercise, {
    card: card,
    direction: card._direction,
    onResult: onResult
  });
}
function MCQExercise({
  card,
  direction,
  onResult
}) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const {
    prompt,
    correct,
    options,
    promptLabel
  } = useMemo(() => {
    const promptText = direction === 'sv-en' ? card.sv : card.en;
    const correctRaw = direction === 'sv-en' ? card.en : card.sv;
    const correctText = cleanAnswer(correctRaw).split('/')[0].trim();
    const distractors = pickDistractors(VOCAB, card, direction, 3);
    return {
      prompt: promptText,
      correct: correctText,
      options: shuffle([correctText, ...distractors]),
      promptLabel: direction === 'sv-en' ? 'SVENSKA' : 'ENGLISH'
    };
  }, [card.id, direction]);
  const choose = useCallback(opt => {
    setSelected(sel => {
      if (sel !== null) return sel; // already answered
      return opt;
    });
  }, []);
  useEffect(() => {
    if (selected === null || revealed) return;
    setRevealed(true);
    const t = setTimeout(() => onResult(selected === correct), 700);
    return () => clearTimeout(t);
  }, [selected]);
  useEffect(() => {
    const onKey = e => {
      if (revealed) return;
      const idx = ['1', '2', '3', '4'].indexOf(e.key);
      if (idx !== -1 && idx < options.length) choose(options[idx]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [revealed, options, choose]);
  return /*#__PURE__*/React.createElement(ExerciseFrame, {
    eyebrow: `${promptLabel} · FLERVAL`,
    stage: /*#__PURE__*/React.createElement("div", {
      className: "ord-prompt-tile"
    }, prompt),
    action: /*#__PURE__*/React.createElement("div", {
      className: "ord-mcq-grid"
    }, options.map((opt, i) => /*#__PURE__*/React.createElement("button", {
      key: i,
      className: "ord-mcq-opt" + (revealed && opt === correct ? ' correct' : '') + (revealed && opt === selected && opt !== correct ? ' incorrect' : ''),
      onClick: () => choose(opt),
      disabled: revealed
    }, /*#__PURE__*/React.createElement("span", {
      className: "ord-mcq-key"
    }, i + 1), opt)))
  });
}
function TypeExercise({
  card,
  direction,
  onResult
}) {
  const [value, setValue] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => {
    if (!isTouchDevice()) inputRef.current && inputRef.current.focus();
  }, []);
  const prompt = direction === 'sv-en' ? card.sv : card.en;
  const targetRaw = direction === 'sv-en' ? card.en : card.sv;
  const promptLabel = direction === 'sv-en' ? 'SVENSKA' : 'ENGLISH';
  const answerHint = direction === 'sv-en' ? 'Skriv på engelska' : 'Skriv på svenska';
  const submit = () => {
    if (revealed || !value.trim()) return;
    setIsCorrect(checkTyped(value, targetRaw));
    setRevealed(true);
  };
  useEffect(() => {
    const onKey = e => {
      if (e.key !== 'Enter') return;
      if (!revealed) submit();else onResult(isCorrect);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [revealed, isCorrect, value]);
  return /*#__PURE__*/React.createElement(ExerciseFrame, {
    eyebrow: `${promptLabel} · SKRIV ORDET`,
    stage: /*#__PURE__*/React.createElement("div", {
      className: "ord-prompt-tile"
    }, prompt),
    action: !revealed ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
      ref: inputRef,
      className: "ord-type-input",
      value: value,
      onChange: e => setValue(e.target.value),
      placeholder: answerHint,
      autoComplete: "off",
      autoCapitalize: "off",
      spellCheck: "false"
    }), /*#__PURE__*/React.createElement("button", {
      className: "ord-reveal-btn",
      onClick: submit
    }, "Kontrollera ", /*#__PURE__*/React.createElement("span", {
      className: "ord-key-hint"
    }, "enter"))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "ord-type-feedback" + (isCorrect ? ' correct' : ' incorrect')
    }, isCorrect ? 'Rätt!' : `Rätt svar: ${cleanAnswer(targetRaw)}`), /*#__PURE__*/React.createElement("button", {
      className: "ord-reveal-btn",
      onClick: () => onResult(isCorrect)
    }, "Fortsätt ", /*#__PURE__*/React.createElement("span", {
      className: "ord-key-hint"
    }, "enter")))
  });
}
function BlankExercise({
  card,
  onResult
}) {
  const [value, setValue] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const inputRef = useRef(null);
  const blankWord = useMemo(() => findBlankWord(card.es, card.sv, card.t), [card.id]);
  const sentenceParts = useMemo(() => {
    if (!blankWord) return ['', ''];
    const idx = card.es.indexOf(blankWord);
    return [card.es.slice(0, idx), card.es.slice(idx + blankWord.length)];
  }, [card.id, blankWord]);
  useEffect(() => {
    if (!isTouchDevice()) inputRef.current && inputRef.current.focus();
  }, []);
  useEffect(() => {
    if (!blankWord) onResult(true);
  }, [blankWord]);
  const submit = () => {
    if (revealed || !value.trim()) return;
    const norm = value.trim().toLowerCase();
    const ok = norm === blankWord.toLowerCase() || answerVariants(card.sv).includes(norm);
    setIsCorrect(ok);
    setRevealed(true);
  };
  useEffect(() => {
    if (!blankWord) return;
    const onKey = e => {
      if (e.key !== 'Enter') return;
      if (!revealed) submit();else onResult(isCorrect);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [revealed, isCorrect, value, blankWord]);
  if (!blankWord) return null;
  return /*#__PURE__*/React.createElement(ExerciseFrame, {
    eyebrow: `LUCKTEXT · ${cleanAnswer(card.en)}`,
    stage: /*#__PURE__*/React.createElement("div", {
      className: "ord-prompt-tile ord-blank-sentence"
    }, sentenceParts[0], /*#__PURE__*/React.createElement("span", {
      className: "ord-blank-gap"
    }, revealed ? blankWord : '·····'), sentenceParts[1]),
    action: !revealed ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
      ref: inputRef,
      className: "ord-type-input",
      value: value,
      onChange: e => setValue(e.target.value),
      placeholder: "Fyll i det saknade ordet",
      autoComplete: "off",
      spellCheck: "false"
    }), /*#__PURE__*/React.createElement("button", {
      className: "ord-reveal-btn",
      onClick: submit
    }, "Kontrollera ", /*#__PURE__*/React.createElement("span", {
      className: "ord-key-hint"
    }, "enter"))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "ord-type-feedback" + (isCorrect ? ' correct' : ' incorrect')
    }, isCorrect ? 'Rätt!' : `Rätt svar: ${blankWord}`), /*#__PURE__*/React.createElement("button", {
      className: "ord-reveal-btn",
      onClick: () => onResult(isCorrect)
    }, "Fortsätt ", /*#__PURE__*/React.createElement("span", {
      className: "ord-key-hint"
    }, "enter")))
  });
}

/* ---------------- Matching Game (extra practice, no scheduling effect) ---------------- */

function MatchingGame({
  words,
  onExit
}) {
  const [svCol, setSvCol] = useState([]);
  const [enCol, setEnCol] = useState([]);
  const [selectedSv, setSelectedSv] = useState(null);
  const [selectedEn, setSelectedEn] = useState(null);
  const [matchedIds, setMatchedIds] = useState([]);
  const [wrongFlash, setWrongFlash] = useState(null);
  useEffect(() => {
    setSvCol(shuffle(words.map(w => ({
      id: w.id,
      text: cleanAnswer(w.sv)
    }))));
    setEnCol(shuffle(words.map(w => ({
      id: w.id,
      text: cleanAnswer(w.en).split('/')[0].trim()
    }))));
    setMatchedIds([]);
  }, [words]);
  useEffect(() => {
    if (selectedSv == null || selectedEn == null) return;
    if (selectedSv === selectedEn) {
      const id = selectedSv;
      setMatchedIds(m => [...m, id]);
      setSelectedSv(null);
      setSelectedEn(null);
    } else {
      setWrongFlash({
        sv: selectedSv,
        en: selectedEn
      });
      const t = setTimeout(() => {
        setWrongFlash(null);
        setSelectedSv(null);
        setSelectedEn(null);
      }, 500);
      return () => clearTimeout(t);
    }
  }, [selectedSv, selectedEn]);
  const allMatched = words.length > 0 && matchedIds.length === words.length;
  return /*#__PURE__*/React.createElement("div", {
    className: "ord-review"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ord-review-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ord-exit-btn",
    onClick: onExit
  }, /*#__PURE__*/React.createElement(X, {
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    className: "ord-eyebrow"
  }, "MATCHNINGSSPEL")), allMatched ? /*#__PURE__*/React.createElement("div", {
    className: "ord-summary"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "ord-summary-title"
  }, "Klart!"), /*#__PURE__*/React.createElement("div", {
    className: "ord-summary-count"
  }, words.length, " par matchade"), /*#__PURE__*/React.createElement("button", {
    className: "ord-start-btn",
    onClick: onExit
  }, "Tillbaka")) : /*#__PURE__*/React.createElement("div", {
    className: "ord-match-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ord-match-col"
  }, svCol.map(item => /*#__PURE__*/React.createElement("button", {
    key: 'sv' + item.id,
    disabled: matchedIds.includes(item.id),
    className: "ord-match-tile" + (matchedIds.includes(item.id) ? ' matched' : '') + (selectedSv === item.id ? ' selected' : '') + (wrongFlash && wrongFlash.sv === item.id ? ' wrong' : ''),
    onClick: () => setSelectedSv(item.id)
  }, item.text))), /*#__PURE__*/React.createElement("div", {
    className: "ord-match-col"
  }, enCol.map(item => /*#__PURE__*/React.createElement("button", {
    key: 'en' + item.id,
    disabled: matchedIds.includes(item.id),
    className: "ord-match-tile" + (matchedIds.includes(item.id) ? ' matched' : '') + (selectedEn === item.id ? ' selected' : '') + (wrongFlash && wrongFlash.en === item.id ? ' wrong' : ''),
    onClick: () => setSelectedEn(item.id)
  }, item.text)))));
}

/* ---------------- Hard Words screen (compiled list + practice launcher) ---------------- */

function HardWordsScreen({
  words,
  state,
  onToggleHard,
  onPractice,
  canPractice,
  onExit
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ord-review"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ord-review-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ord-exit-btn",
    onClick: onExit
  }, /*#__PURE__*/React.createElement(ArrowLeft, {
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    className: "ord-eyebrow",
    style: {
      margin: 0
    }
  }, "SVÅRA ORD (", words.length, ")")), words.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "ord-growth-empty"
  }, "Inga svåra ord ännu. Ord flaggas automatiskt om du missar dem upprepade gånger — eller flagga ett ord själv med flagg-ikonen under flashcards.") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "ord-start-btn",
    onClick: onPractice,
    disabled: !canPractice,
    style: {
      marginTop: 6
    }
  }, "Öva svåra ord"), /*#__PURE__*/React.createElement("div", {
    className: "ord-hardword-list"
  }, words.map(w => {
    const manual = (state.manualHardIds || []).includes(w.id);
    return /*#__PURE__*/React.createElement("div", {
      className: "ord-hardword-row",
      key: w.id
    }, /*#__PURE__*/React.createElement("div", {
      className: "ord-hardword-text"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ord-hardword-sv"
    }, cleanAnswer(w.sv), w.g ? /*#__PURE__*/React.createElement("span", {
      className: "ord-hardword-gender"
    }, " (", w.g, ")") : null), /*#__PURE__*/React.createElement("div", {
      className: "ord-hardword-en"
    }, cleanAnswer(w.en)), w.c && /*#__PURE__*/React.createElement("div", {
      className: "ord-hardword-conj"
    }, w.c)), /*#__PURE__*/React.createElement("div", {
      className: "ord-hardword-meta"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ord-hardword-tag"
    }, manual ? 'manuellt' : 'auto'), /*#__PURE__*/React.createElement("button", {
      className: "ord-flag-btn flagged",
      onClick: () => onToggleHard(w.id),
      title: "Ta bort från svåra ord"
    }, /*#__PURE__*/React.createElement(Flag, {
      size: 14
    }))));
  }))));
}

/* ---------------- Dictionary screen (lazy-loaded Folkets Lexikon lookup) ---------------- */

let dictionaryCache = null;
let dictionaryReverseCache = null;
function loadDictionary() {
  if (dictionaryCache) return Promise.resolve(dictionaryCache);
  return fetch('./dictionary.json').then(r => r.json()).then(data => {
    dictionaryCache = data;
    const reverse = {};
    Object.entries(data).forEach(([sv, translations]) => {
      translations.forEach(en => {
        const key = en.toLowerCase();
        if (!reverse[key]) reverse[key] = [];
        reverse[key].push(sv);
      });
    });
    dictionaryReverseCache = reverse;
    return data;
  });
}
function DictionaryScreen({
  onExit
}) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [direction, setDirection] = useState('sv-en');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  useEffect(() => {
    loadDictionary().then(() => setLoading(false)).catch(() => {
      setLoadError(true);
      setLoading(false);
    });
  }, []);
  useEffect(() => {
    if (loading || !query.trim()) {
      setResults([]);
      return;
    }
    const q = query.trim().toLowerCase();
    const source = direction === 'sv-en' ? dictionaryCache : dictionaryReverseCache;
    if (!source) return;
    const prefixMatches = [];
    const substringMatches = [];
    for (const key of Object.keys(source)) {
      const lk = key.toLowerCase();
      if (lk.startsWith(q)) prefixMatches.push(key);else if (substringMatches.length < 300 && lk.includes(q)) substringMatches.push(key);
    }
    prefixMatches.sort((a, b) => {
      const la = a.toLowerCase(),
        lb = b.toLowerCase();
      if (la === q && lb !== q) return -1;
      if (lb === q && la !== q) return 1;
      return la.length - lb.length || la.localeCompare(lb);
    });
    const combined = [...prefixMatches, ...substringMatches].slice(0, 40);
    setResults(combined.map(key => ({
      key,
      translations: source[key]
    })));
  }, [query, direction, loading]);
  const translateUrl = `https://translate.google.com/?sl=${direction === 'sv-en' ? 'sv' : 'en'}&tl=${direction === 'sv-en' ? 'en' : 'sv'}&text=${encodeURIComponent(query)}&op=translate`;
  return /*#__PURE__*/React.createElement("div", {
    className: "ord-review"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ord-review-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ord-exit-btn",
    onClick: onExit
  }, /*#__PURE__*/React.createElement(ArrowLeft, {
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    className: "ord-eyebrow",
    style: {
      margin: 0
    }
  }, "ORDBOK")), /*#__PURE__*/React.createElement("div", {
    className: "ord-dict-toggle"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ord-dict-dir-btn" + (direction === 'sv-en' ? ' active' : ''),
    onClick: () => {
      setDirection('sv-en');
      setResults([]);
    }
  }, "Svenska → Engelska"), /*#__PURE__*/React.createElement("button", {
    className: "ord-dict-dir-btn" + (direction === 'en-sv' ? ' active' : ''),
    onClick: () => {
      setDirection('en-sv');
      setResults([]);
    }
  }, "Engelska → Svenska")), /*#__PURE__*/React.createElement("div", {
    className: "ord-dict-search"
  }, /*#__PURE__*/React.createElement(Search, {
    size: 16,
    className: "ord-dict-search-icon"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: query,
    onChange: e => setQuery(e.target.value),
    placeholder: direction === 'sv-en' ? 'Sök ett svenskt ord...' : 'Search an English word...',
    className: "ord-dict-input",
    autoFocus: true
  })), loading && /*#__PURE__*/React.createElement("div", {
    className: "ord-growth-empty"
  }, "Laddar ordbok..."), loadError && /*#__PURE__*/React.createElement("div", {
    className: "ord-growth-empty"
  }, "Kunde inte ladda ordboken. Kontrollera din anslutning."), !loading && !loadError && /*#__PURE__*/React.createElement("div", {
    className: "ord-dict-results"
  }, query.trim() && results.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "ord-growth-empty"
  }, "Inga träffar för \"", query, "\"."), results.map(r => /*#__PURE__*/React.createElement("div", {
    className: "ord-dict-row",
    key: r.key
  }, /*#__PURE__*/React.createElement("div", {
    className: "ord-dict-word"
  }, r.key), /*#__PURE__*/React.createElement("div", {
    className: "ord-dict-translations"
  }, r.translations.join(', '))))), /*#__PURE__*/React.createElement("div", {
    className: "ord-dict-external"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ord-progress-section-title"
  }, "Fler resurser"), /*#__PURE__*/React.createElement("a", {
    className: "ord-dict-external-link",
    href: translateUrl,
    target: "_blank",
    rel: "noopener noreferrer"
  }, /*#__PURE__*/React.createElement(ExternalLink, {
    size: 14
  }), " Google Translate"), /*#__PURE__*/React.createElement("a", {
    className: "ord-dict-external-link",
    href: "https://folkets-lexikon.csc.kth.se/folkets/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, /*#__PURE__*/React.createElement(ExternalLink, {
    size: 14
  }), " Folkets Lexikon (webb)")));
}

/* ---------------- Verbs screen: browse all forms, or drill them ---------------- */

const VERB_FORM_LABELS = {
  pres: 'Presens (nutid)',
  past: 'Preteritum (dåtid)',
  sup: 'Supinum (med har/hade)'
};

/* ---------------- Free Review: unlimited random drill across everything introduced so far ---------------- */

function FreeReviewScreen({
  state,
  onExit
}) {
  const [mode, setMode] = useState('setup'); // setup | active
  const [selectedTypes, setSelectedTypes] = useState(null);
  const [currentCard, setCurrentCard] = useState(null);
  const [cardCount, setCardCount] = useState(0);
  const [results, setResults] = useState({
    again: 0,
    hard: 0,
    good: 0,
    easy: 0
  });
  const introducedItems = useMemo(() => {
    const ids = new Set([...Object.keys(state.srs), ...Object.keys(state.learning)].map(Number));
    return Array.from(ids).map(id => VOCAB_BY_ID.get(id)).filter(Boolean);
  }, [state.srs, state.learning]);
  const categoryCounts = useMemo(() => {
    const counts = {};
    introducedItems.forEach(item => {
      const key = item.t || '';
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [introducedItems]);
  useEffect(() => {
    if (selectedTypes === null && Object.keys(categoryCounts).length > 0) {
      setSelectedTypes(new Set(Object.keys(categoryCounts)));
    }
  }, [categoryCounts, selectedTypes]);
  const toggleType = key => {
    setSelectedTypes(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);else next.add(key);
      return next;
    });
  };
  const filteredPool = useMemo(() => {
    if (!selectedTypes) return [];
    return introducedItems.filter(item => selectedTypes.has(item.t || ''));
  }, [introducedItems, selectedTypes]);
  const startSession = () => {
    if (filteredPool.length === 0) return;
    const first = filteredPool[Math.floor(Math.random() * filteredPool.length)];
    setCurrentCard({
      ...first,
      _kind: 'review',
      _direction: pickFreeReviewDirection(state, first)
    });
    setCardCount(1);
    setResults({
      again: 0,
      hard: 0,
      good: 0,
      easy: 0
    });
    setMode('active');
  };
  const handleGrade = g => {
    const gradeNames = ['again', 'hard', 'good', 'easy'];
    setResults(prev => ({
      ...prev,
      [gradeNames[g]]: prev[gradeNames[g]] + 1
    }));
    const next = pickRandomCard(filteredPool, currentCard.id);
    setCurrentCard({
      ...next,
      _kind: 'review',
      _direction: pickFreeReviewDirection(state, next)
    });
    setCardCount(c => c + 1);
  };
  if (mode === 'active' && currentCard) {
    return /*#__PURE__*/React.createElement("div", {
      className: "ord-review"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ord-review-top"
    }, /*#__PURE__*/React.createElement("button", {
      className: "ord-exit-btn",
      onClick: onExit
    }, /*#__PURE__*/React.createElement(X, {
      size: 18
    })), /*#__PURE__*/React.createElement("div", {
      className: "ord-freereview-count"
    }, cardCount, " kort · fri repetition")), /*#__PURE__*/React.createElement(FlashcardExercise, {
      key: cardCount,
      card: currentCard,
      onGrade: handleGrade
    }));
  }
  const available = Object.keys(categoryCounts);
  return /*#__PURE__*/React.createElement("div", {
    className: "ord-review"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ord-review-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ord-exit-btn",
    onClick: onExit
  }, /*#__PURE__*/React.createElement(ArrowLeft, {
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    className: "ord-eyebrow",
    style: {
      margin: 0
    }
  }, "FRI REPETITION")), introducedItems.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "ord-growth-empty"
  }, "Du har inte introducerat några ord ännu. Gör dagens flashcards först.") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ord-growth-empty",
    style: {
      marginBottom: 16
    }
  }, "Repetera fritt bland alla ", introducedItems.length, " ord du hittills introducerat, oavsett datum eller ämnesscope. Rundan fortsätter tills du avslutar den själv — inget påverkar din vanliga repetitionsplanering."), /*#__PURE__*/React.createElement("div", {
    className: "ord-progress-section-title"
  }, "Filtrera efter ordklass"), /*#__PURE__*/React.createElement("div", {
    className: "ord-pos-filter-list"
  }, available.map(key => /*#__PURE__*/React.createElement("label", {
    className: "ord-pos-filter-item",
    key: key || 'none'
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: selectedTypes ? selectedTypes.has(key) : true,
    onChange: () => toggleType(key)
  }), /*#__PURE__*/React.createElement("span", null, POS_FILTER_LABELS[key] || 'Övrigt'), /*#__PURE__*/React.createElement("span", {
    className: "ord-pos-filter-count"
  }, categoryCounts[key])))), /*#__PURE__*/React.createElement("button", {
    className: "ord-start-btn",
    onClick: startSession,
    disabled: filteredPool.length === 0,
    style: {
      marginTop: 16
    }
  }, filteredPool.length > 0 ? `Starta (${filteredPool.length} ord)` : 'Välj minst en ordklass')));
}
function VerbsScreen({
  onExit
}) {
  const [mode, setMode] = useState('menu'); // menu | browse | practice-setup | practice
  const [session, setSession] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [quizActive, setQuizActive] = useState(false);
  const [quizBlanks, setQuizBlanks] = useState({});
  const [quizKey, setQuizKey] = useState(0);
  const startPractice = () => {
    const forms = ['pres', 'past', 'sup'];
    const turns = shuffle(VERBS).slice(0, 20).map(v => ({
      verb: v,
      form: forms[Math.floor(Math.random() * forms.length)]
    }));
    setSession({
      turns,
      index: 0,
      results: {
        correct: 0,
        incorrect: 0
      }
    });
    setMode('practice');
  };
  const handleResult = correct => {
    setSession(prev => ({
      ...prev,
      index: prev.index + 1,
      results: {
        correct: prev.results.correct + (correct ? 1 : 0),
        incorrect: prev.results.incorrect + (correct ? 0 : 1)
      }
    }));
  };
  const generateQuizBlanks = () => {
    const cols = ['pres', 'past', 'sup'];
    const map = {};
    VERBS.forEach(v => {
      const n = 1 + Math.floor(Math.random() * 3); // 1, 2, or 3
      map[v.id] = new Set(shuffle(cols).slice(0, n));
    });
    return map;
  };
  const startQuiz = () => {
    setQuizBlanks(generateQuizBlanks());
    setQuizActive(true);
    setQuizKey(k => k + 1);
    setExpandedId(null);
  };
  const resetQuiz = () => {
    setQuizBlanks(generateQuizBlanks());
    setQuizKey(k => k + 1);
  };
  if (mode === 'browse') {
    return /*#__PURE__*/React.createElement("div", {
      className: "ord-review"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ord-review-top"
    }, /*#__PURE__*/React.createElement("button", {
      className: "ord-exit-btn",
      onClick: () => {
        setMode('menu');
        setQuizActive(false);
      }
    }, /*#__PURE__*/React.createElement(ArrowLeft, {
      size: 18
    })), /*#__PURE__*/React.createElement("div", {
      className: "ord-eyebrow",
      style: {
        margin: 0
      }
    }, "VERB (", VERBS.length, ")")), /*#__PURE__*/React.createElement("div", {
      className: "ord-verb-quiz-row"
    }, !quizActive ? /*#__PURE__*/React.createElement("button", {
      className: "ord-verb-quiz-btn",
      onClick: startQuiz
    }, "Quiza mig") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "ord-verb-quiz-btn",
      onClick: resetQuiz
    }, "Nytt quiz"), /*#__PURE__*/React.createElement("button", {
      className: "ord-reset-link",
      onClick: () => setQuizActive(false)
    }, "Avsluta quiz"))), !quizActive && /*#__PURE__*/React.createElement("div", {
      className: "ord-verb-hint"
    }, "Tryck på ett ord för att se den engelska betydelsen."), /*#__PURE__*/React.createElement("div", {
      className: "ord-verb-table-head"
    }, /*#__PURE__*/React.createElement("span", null, "Infinitiv"), /*#__PURE__*/React.createElement("span", null, "Presens"), /*#__PURE__*/React.createElement("span", null, "Preteritum"), /*#__PURE__*/React.createElement("span", null, "Supinum")), /*#__PURE__*/React.createElement("div", {
      className: "ord-verb-list"
    }, VERBS.map(v => {
      const blanks = quizActive ? quizBlanks[v.id] : null;
      return /*#__PURE__*/React.createElement("div", {
        key: v.id,
        className: "ord-verb-row-wrap"
      }, /*#__PURE__*/React.createElement("div", {
        className: "ord-verb-row",
        onClick: quizActive ? undefined : () => setExpandedId(id => id === v.id ? null : v.id)
      }, /*#__PURE__*/React.createElement("span", {
        className: "ord-verb-inf"
      }, v.inf), ['pres', 'past', 'sup'].map(col => blanks && blanks.has(col) ? /*#__PURE__*/React.createElement(QuizCell, {
        key: quizKey + '-' + col,
        correctValue: v[col]
      }) : /*#__PURE__*/React.createElement("span", {
        key: col
      }, v[col]))), !quizActive && expandedId === v.id && /*#__PURE__*/React.createElement("div", {
        className: "ord-verb-en-reveal"
      }, v.en));
    })));
  }
  if (mode === 'practice' && session) {
    const done = session.index >= session.turns.length;
    return /*#__PURE__*/React.createElement("div", {
      className: "ord-review"
    }, /*#__PURE__*/React.createElement(TopBar, {
      index: Math.min(session.index, session.turns.length - 1),
      total: session.turns.length,
      onExit: () => {
        setSession(null);
        setMode('menu');
      }
    }), done ? /*#__PURE__*/React.createElement("div", {
      className: "ord-summary"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ord-eyebrow"
    }, "VERBÖVNING KLAR"), /*#__PURE__*/React.createElement("h2", {
      className: "ord-summary-title"
    }, "Bra jobbat!"), /*#__PURE__*/React.createElement("div", {
      className: "ord-summary-count"
    }, session.results.correct, " rätt · ", session.results.incorrect, " fel"), /*#__PURE__*/React.createElement("button", {
      className: "ord-start-btn",
      onClick: () => {
        setSession(null);
        setMode('menu');
      }
    }, "Tillbaka")) : /*#__PURE__*/React.createElement(VerbPracticeTurn, {
      key: session.index,
      turn: session.turns[session.index],
      onResult: handleResult
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "ord-review"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ord-review-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ord-exit-btn",
    onClick: onExit
  }, /*#__PURE__*/React.createElement(ArrowLeft, {
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    className: "ord-eyebrow",
    style: {
      margin: 0
    }
  }, "VERB — BÖJNINGAR")), /*#__PURE__*/React.createElement("div", {
    className: "ord-growth-empty",
    style: {
      marginBottom: 16
    }
  }, VERBS.length, " av de vanligaste svenska verben, med presens, preteritum och supinum — oberoende av vilka ord du redan mött i flashcards."), /*#__PURE__*/React.createElement("button", {
    className: "ord-start-btn",
    onClick: startPractice
  }, "Öva verbformer"), /*#__PURE__*/React.createElement("button", {
    className: "ord-extras-btn",
    onClick: () => setMode('browse')
  }, /*#__PURE__*/React.createElement(BookOpen, {
    size: 16
  }), " Bläddra bland alla verb"));
}
function VerbPracticeTurn({
  turn,
  onResult
}) {
  const [value, setValue] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => {
    if (!isTouchDevice()) inputRef.current && inputRef.current.focus();
  }, []);
  const target = turn.verb[turn.form];
  const targetVariants = target.toLowerCase().split('/').map(s => s.trim());
  const submit = () => {
    if (revealed || !value.trim()) return;
    setIsCorrect(targetVariants.includes(value.trim().toLowerCase()));
    setRevealed(true);
  };
  useEffect(() => {
    const onKey = e => {
      if (e.key !== 'Enter') return;
      if (!revealed) submit();else onResult(isCorrect);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [revealed, isCorrect, value]);
  return /*#__PURE__*/React.createElement(ExerciseFrame, {
    eyebrow: VERB_FORM_LABELS[turn.form],
    stage: /*#__PURE__*/React.createElement("div", {
      className: "ord-prompt-tile"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        opacity: 0.7,
        marginBottom: 8,
        fontFamily: 'var(--font-mono)'
      }
    }, "INFINITIV"), turn.verb.inf, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        opacity: 0.6,
        marginTop: 10
      }
    }, turn.verb.en)),
    action: !revealed ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
      ref: inputRef,
      className: "ord-type-input",
      value: value,
      onChange: e => setValue(e.target.value),
      placeholder: "Skriv formen...",
      autoComplete: "off",
      spellCheck: "false"
    }), /*#__PURE__*/React.createElement("button", {
      className: "ord-reveal-btn",
      onClick: submit
    }, "Kontrollera ", /*#__PURE__*/React.createElement("span", {
      className: "ord-key-hint"
    }, "enter"))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "ord-type-feedback" + (isCorrect ? ' correct' : ' incorrect')
    }, isCorrect ? 'Rätt!' : `Rätt svar: ${target}`), /*#__PURE__*/React.createElement("button", {
      className: "ord-reveal-btn",
      onClick: () => onResult(isCorrect)
    }, "Fortsätt ", /*#__PURE__*/React.createElement("span", {
      className: "ord-key-hint"
    }, "enter")))
  });
}
function QuizCell({
  correctValue
}) {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState('blank'); // blank | correct | wrong
  const inputRef = useRef(null);
  const submit = e => {
    e.stopPropagation();
    if (status !== 'blank' || !value.trim()) return;
    const ok = value.trim().toLowerCase() === correctValue.toLowerCase();
    if (ok) {
      setStatus('correct');
    } else {
      setStatus('wrong');
      setTimeout(() => {
        setStatus('blank');
        setValue('');
      }, 650);
    }
  };
  if (status === 'correct') {
    return /*#__PURE__*/React.createElement("span", {
      className: "ord-quizcell correct"
    }, correctValue);
  }
  return /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    className: "ord-quizcell-input" + (status === 'wrong' ? ' wrong' : ''),
    value: value,
    onChange: e => setValue(e.target.value),
    onClick: e => e.stopPropagation(),
    onKeyDown: e => {
      if (e.key === 'Enter') submit(e);
    },
    disabled: status === 'wrong',
    autoComplete: "off",
    spellCheck: "false"
  });
}

/* ---------------- Summary Screen (flashcards) ---------------- */

function SummaryScreen({
  results,
  reviewed,
  graduatedCount,
  onDone
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ord-summary"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ord-eyebrow"
  }, "FLASHCARDS KLARA"), /*#__PURE__*/React.createElement("h2", {
    className: "ord-summary-title"
  }, "Bra jobbat!"), /*#__PURE__*/React.createElement("div", {
    className: "ord-summary-count"
  }, reviewed, " kort repeterade", graduatedCount > 0 ? ` · ${graduatedCount} nya ord lärda` : ''), /*#__PURE__*/React.createElement("div", {
    className: "ord-summary-grid"
  }, /*#__PURE__*/React.createElement(SummaryStat, {
    label: "Again",
    value: results.again,
    color: "var(--c-red)"
  }), /*#__PURE__*/React.createElement(SummaryStat, {
    label: "Hard",
    value: results.hard,
    color: "var(--c-mustard)"
  }), /*#__PURE__*/React.createElement(SummaryStat, {
    label: "Good",
    value: results.good,
    color: "var(--c-slate)"
  }), /*#__PURE__*/React.createElement(SummaryStat, {
    label: "Easy",
    value: results.easy,
    color: "var(--c-forest)"
  })), /*#__PURE__*/React.createElement("button", {
    className: "ord-start-btn",
    onClick: onDone
  }, "Tillbaka"));
}
function SummaryStat({
  label,
  value,
  color
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ord-summary-stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ord-summary-stat-value",
    style: {
      color
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    className: "ord-summary-stat-label"
  }, label));
}

/* ---------------- Styles ---------------- */

function Style() {
  return /*#__PURE__*/React.createElement("style", null, `
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

      :root {
        --c-paper: #F3EFE6;
        --c-ink: #232420;
        --c-red: #A23E2A;
        --c-slate: #3E5C6B;
        --c-mustard: #C99A2E;
        --c-forest: #45623F;
        --c-line: #DAD3C2;
        --font-display: 'Fraunces', Georgia, serif;
        --font-body: 'Inter', -apple-system, sans-serif;
        --font-mono: 'IBM Plex Mono', ui-monospace, monospace;
      }

      .ord-root { min-height: 100%; background: var(--c-paper); color: var(--c-ink); font-family: var(--font-body); padding: 28px 20px 40px; box-sizing: border-box; }
      .ord-root * { box-sizing: border-box; }
      .ord-loading { display: flex; align-items: center; justify-content: center; min-height: 300px; }
      .ord-loading-tile { font-family: var(--font-mono); letter-spacing: 0.15em; font-size: 13px; padding: 14px 22px; background: var(--c-ink); color: var(--c-paper); border-radius: 4px; animation: ord-pulse 1.2s ease-in-out infinite; }
      @keyframes ord-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }

      .ord-home { max-width: 460px; margin: 0 auto; }
      .ord-header { margin-bottom: 24px; }
      .ord-eyebrow { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.16em; color: var(--c-slate); margin-bottom: 6px; }
      .ord-title { font-family: var(--font-display); font-size: 42px; font-weight: 600; margin: 0; letter-spacing: -0.01em; line-height: 1; }
      .ord-sub { font-size: 14px; color: #6b6656; margin-top: 6px; font-style: italic; }

      .ord-board { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--c-ink); border-radius: 6px; overflow: hidden; margin-bottom: 24px; border: 1px solid var(--c-ink); }
      .ord-board-stat { background: var(--c-ink); color: var(--c-paper); padding: 14px 8px; display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center; }
      .ord-board-icon { color: var(--c-mustard); margin-bottom: 2px; }
      .ord-board-value { font-family: var(--font-mono); font-size: 22px; font-weight: 500; }
      .ord-board-label { font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; color: #B8B3A2; }

      .ord-scope { position: relative; margin-bottom: 20px; }
      .ord-scope-btn { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; background: transparent; border: 1px solid var(--c-line); border-radius: 6px; font-family: var(--font-mono); font-size: 12.5px; color: var(--c-ink); cursor: pointer; }
      .ord-scope-btn:hover { border-color: var(--c-slate); }
      .ord-scope-menu { position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 10; background: #FBF9F4; border: 1px solid var(--c-line); border-radius: 6px; max-height: 260px; overflow-y: auto; box-shadow: 0 8px 24px rgba(35,36,32,0.12); }
      .ord-scope-item { display: flex; justify-content: space-between; align-items: baseline; width: 100%; padding: 10px 14px; background: none; border: none; border-bottom: 1px solid var(--c-line); font-family: var(--font-body); font-size: 13.5px; text-align: left; cursor: pointer; color: var(--c-ink); }
      .ord-scope-item:last-child { border-bottom: none; }
      .ord-scope-item:hover { background: var(--c-line); }
      .ord-scope-item.active { color: var(--c-red); font-weight: 600; }
      .ord-scope-item-sub { font-family: var(--font-mono); font-size: 10px; color: #8a8570; }

      .ord-section-label { font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.1em; color: #9a927c; margin-bottom: 8px; display: flex; align-items: center; }

      .ord-start-btn { width: 100%; padding: 16px; background: var(--c-red); color: #FBF3E8; border: none; border-radius: 6px; font-family: var(--font-display); font-weight: 600; font-size: 17px; cursor: pointer; letter-spacing: 0.01em; margin-bottom: 10px; transition: transform .1s, background .15s; }
      .ord-start-btn:hover:not(:disabled) { background: #8C3220; }
      .ord-start-btn:active:not(:disabled) { transform: scale(0.98); }
      .ord-start-btn:disabled { background: #C9C2AC; color: #8a8570; cursor: default; }

      .ord-bump-btn { width: 100%; padding: 11px; background: transparent; color: var(--c-red); border: 1.5px dashed var(--c-red); border-radius: 6px; font-family: var(--font-mono); font-weight: 500; font-size: 12.5px; cursor: pointer; margin-bottom: 20px; transition: background .15s; }
      .ord-bump-btn:hover { background: rgba(162,62,42,0.06); }

      .ord-extras-btn, .ord-match-btn { width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 13px; background: transparent; color: var(--c-slate); border: 1.5px solid var(--c-slate); border-radius: 6px; font-family: var(--font-body); font-weight: 600; font-size: 14px; cursor: pointer; margin-bottom: 8px; transition: background .15s; }
      .ord-extras-btn:hover:not(:disabled), .ord-match-btn:hover:not(:disabled) { background: rgba(62,92,107,0.08); }
      .ord-extras-btn:disabled, .ord-match-btn:disabled { border-color: #C9C2AC; color: #ACA795; cursor: default; }
      .ord-extras-helper { font-family: var(--font-mono); font-size: 10.5px; color: #9a927c; text-align: center; margin-bottom: 16px; margin-top: -2px; }

      .ord-progress-bar-wrap { margin-bottom: 18px; margin-top: 8px; }
      .ord-progress-label { font-family: var(--font-mono); font-size: 11px; color: #6b6656; margin-bottom: 6px; }
      .ord-progress-track { height: 6px; background: var(--c-line); border-radius: 3px; overflow: hidden; }
      .ord-progress-fill { height: 100%; background: var(--c-forest); border-radius: 3px; transition: width .3s; }

      .ord-footnote { font-size: 11.5px; color: #8a8570; font-family: var(--font-mono); text-align: center; }

      .ord-reset-zone { margin-top: 22px; text-align: center; }
      .ord-reset-link { background: none; border: none; color: #A39C86; font-family: var(--font-mono); font-size: 11px; text-decoration: underline; cursor: pointer; padding: 4px; }
      .ord-reset-link:hover { color: var(--c-red); }
      .ord-reset-confirm { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 14px; background: rgba(162,62,42,0.06); border: 1px solid rgba(162,62,42,0.25); border-radius: 8px; }
      .ord-reset-confirm span { font-size: 12.5px; color: var(--c-ink); }
      .ord-reset-confirm-btns { display: flex; gap: 8px; }
      .ord-reset-yes { padding: 8px 14px; background: var(--c-red); color: #FBF3E8; border: none; border-radius: 6px; font-family: var(--font-body); font-weight: 600; font-size: 12.5px; cursor: pointer; }
      .ord-reset-no { padding: 8px 14px; background: transparent; color: var(--c-ink); border: 1px solid var(--c-line); border-radius: 6px; font-family: var(--font-body); font-size: 12.5px; cursor: pointer; }

      /* Unified session layout: top bar (fixed) -> stage (flex:1, centered) -> action row (fixed) */
      .ord-review { max-width: 460px; margin: 0 auto; min-height: 82vh; display: flex; flex-direction: column; }
      .ord-review-top { display: flex; align-items: center; gap: 12px; margin-bottom: 6px; }
      .ord-exit-btn { width: 34px; height: 34px; border-radius: 50%; border: 1px solid var(--c-line); background: transparent; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--c-ink); flex-shrink: 0; }
      .ord-flag-btn { width: 34px; height: 34px; border-radius: 50%; border: 1px solid var(--c-line); background: transparent; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #A39C86; flex-shrink: 0; }
      .ord-flag-btn:hover { border-color: var(--c-red); color: var(--c-red); }
      .ord-flag-btn.flagged { background: rgba(162,62,42,0.1); border-color: var(--c-red); color: var(--c-red); }
      .ord-exit-btn:hover { background: var(--c-line); }
      .ord-review-progress { flex: 1; display: flex; align-items: center; gap: 10px; }
      .ord-review-progress-track { flex: 1; height: 4px; background: var(--c-line); border-radius: 2px; overflow: hidden; }
      .ord-review-progress-fill { height: 100%; background: var(--c-slate); transition: width .25s; }
      .ord-review-progress-count { font-family: var(--font-mono); font-size: 11px; color: #6b6656; white-space: nowrap; }

      .ord-exercise-eyebrow { font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.14em; color: var(--c-slate); text-transform: uppercase; text-align: center; margin: 14px 0 0; }

      .ord-stage { flex: 1; display: flex; align-items: center; justify-content: center; padding: 14px 0; perspective: 1400px; min-height: 0; }
      .ord-action-row { flex-shrink: 0; padding-bottom: 8px; }

      .ord-prompt-tile { width: 100%; max-width: 400px; font-family: var(--font-display); font-size: 28px; font-weight: 600; text-align: center; padding: 32px 24px; background: var(--c-ink); color: var(--c-paper); border-radius: 10px; }
      .ord-blank-sentence { font-size: 19px; line-height: 1.6; padding: 26px 20px; }
      .ord-blank-gap { font-family: var(--font-mono); color: var(--c-mustard); font-weight: 600; border-bottom: 2px solid var(--c-mustard); padding: 0 4px; }

      .ord-flap { position: relative; width: 100%; max-width: 400px; min-height: 260px; cursor: pointer; transform-style: preserve-3d; transition: transform .5s cubic-bezier(.4,.2,.2,1); }
      .ord-flap.is-flipped { transform: rotateX(180deg); }
      .ord-flap-face { position: absolute; inset: 0; backface-visibility: hidden; border-radius: 10px; background: var(--c-ink); color: var(--c-paper); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px 24px; text-align: center; box-shadow: 0 10px 30px rgba(35,36,32,0.18); }
      .ord-flap-front { background: var(--c-ink); }
      .ord-flap-back { background: var(--c-slate); transform: rotateX(180deg); }
      .ord-flap-eyebrow { font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.18em; color: var(--c-mustard); margin-bottom: 14px; }
      .ord-flap-word { font-family: var(--font-display); font-size: 30px; font-weight: 600; line-height: 1.15; }
      .ord-flap-tag { margin-top: 12px; font-family: var(--font-mono); font-size: 11px; color: #C9C2AC; border: 1px solid #55584f; border-radius: 20px; padding: 3px 10px; }
      .ord-flap-hint { position: absolute; bottom: 16px; font-family: var(--font-mono); font-size: 10px; color: #7b7a6e; letter-spacing: 0.04em; }
      .ord-flap-conj { font-family: var(--font-mono); font-size: 13px; color: #E4DCC8; margin-top: 10px; }
      .ord-flap-example { margin-top: 18px; font-size: 13.5px; color: #EDE7D8; line-height: 1.5; font-style: italic; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 14px; }
      .ord-flap-example-en { color: #C9C2AC; margin-top: 3px; font-style: normal; font-size: 12.5px; }

      .ord-key-hint { font-family: var(--font-mono); font-size: 9.5px; opacity: 0.6; margin-left: 6px; font-weight: 400; }

      .ord-grade-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
      .ord-grade-btn { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 12px 4px; border-radius: 8px; border: none; cursor: pointer; font-family: var(--font-body); font-weight: 600; font-size: 12.5px; color: #FBF3E8; transition: transform .1s; }
      .ord-grade-btn:active { transform: scale(0.96); }
      .ord-grade-key { font-family: var(--font-mono); font-size: 10px; opacity: 0.75; font-weight: 400; }
      .ord-grade-again { background: var(--c-red); }
      .ord-grade-hard { background: var(--c-mustard); color: #2A2416; }
      .ord-grade-good { background: var(--c-slate); }
      .ord-grade-easy { background: var(--c-forest); }
      .ord-reveal-btn { width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 14px; background: var(--c-ink); color: var(--c-paper); border: none; border-radius: 8px; font-family: var(--font-body); font-weight: 600; font-size: 14px; cursor: pointer; }
      .ord-reveal-btn:active { transform: scale(0.98); }

      .ord-mcq-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      .ord-mcq-opt { display: flex; align-items: center; gap: 8px; padding: 16px 10px; border-radius: 8px; border: 1.5px solid var(--c-line); background: #FBF9F4; font-family: var(--font-body); font-size: 14px; font-weight: 500; cursor: pointer; transition: background .15s, border-color .15s; }
      .ord-mcq-opt:hover:not(:disabled) { border-color: var(--c-slate); }
      .ord-mcq-opt.correct { background: var(--c-forest); border-color: var(--c-forest); color: #F3EFE6; }
      .ord-mcq-opt.incorrect { background: var(--c-red); border-color: var(--c-red); color: #F3EFE6; }
      .ord-mcq-opt:disabled { cursor: default; }
      .ord-mcq-key { font-family: var(--font-mono); font-size: 10px; opacity: 0.55; border: 1px solid currentColor; border-radius: 4px; padding: 1px 5px; flex-shrink: 0; }

      .ord-type-input { width: 100%; padding: 14px; border: 1.5px solid var(--c-line); border-radius: 8px; font-family: var(--font-body); font-size: 16px; margin-bottom: 10px; background: #FBF9F4; color: var(--c-ink); }
      .ord-type-input:focus { outline: none; border-color: var(--c-red); }
      .ord-type-feedback { padding: 14px; border-radius: 8px; text-align: center; font-family: var(--font-body); font-weight: 600; font-size: 15px; margin-bottom: 10px; }
      .ord-type-feedback.correct { background: rgba(69,98,63,0.15); color: var(--c-forest); }
      .ord-type-feedback.incorrect { background: rgba(162,62,42,0.12); color: var(--c-red); }

      .ord-match-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 14px; margin-top: 16px; }
      .ord-match-col { display: flex; flex-direction: column; gap: 8px; }
      .ord-match-tile { padding: 13px 10px; border-radius: 7px; border: 1.5px solid var(--c-line); background: #FBF9F4; font-family: var(--font-body); font-size: 13px; font-weight: 500; cursor: pointer; text-align: center; transition: all .15s; min-height: 46px; display: flex; align-items: center; justify-content: center; }
      .ord-match-tile.selected { border-color: var(--c-slate); background: rgba(62,92,107,0.1); }
      .ord-match-tile.matched { background: var(--c-forest); border-color: var(--c-forest); color: #F3EFE6; opacity: 0.55; cursor: default; }
      .ord-match-tile.wrong { background: var(--c-red); border-color: var(--c-red); color: #F3EFE6; }

      .ord-summary { max-width: 420px; margin: 40px auto 0; text-align: center; }
      .ord-summary-title { font-family: var(--font-display); font-size: 32px; margin: 6px 0 4px; }
      .ord-summary-count { font-family: var(--font-mono); font-size: 13px; color: #6b6656; margin-bottom: 24px; }
      .ord-summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 16px; }
      .ord-summary-stat { background: #FBF9F4; border: 1px solid var(--c-line); border-radius: 8px; padding: 14px 6px; }
      .ord-summary-stat-value { font-family: var(--font-mono); font-size: 22px; font-weight: 500; }
      .ord-summary-stat-label { font-size: 10.5px; color: #6b6656; margin-top: 2px; letter-spacing: 0.04em; }

      @media (prefers-reduced-motion: reduce) { .ord-flap, .ord-progress-fill, .ord-review-progress-fill { transition: none !important; } }

      /* Mobile: the flex-centered stage created a huge gap above short content
         (prompt tile / sentence) once the on-screen keyboard shrank the viewport,
         sometimes pushing the actual question off the top of the screen. */
      @media (max-width: 480px), (max-height: 700px) {
        .ord-review { min-height: auto; }
        .ord-stage { align-items: flex-start; padding-top: 6px; padding-bottom: 6px; }
        .ord-card-stage { align-items: flex-start; padding-top: 6px; }
      }
      button:focus-visible, .ord-flap:focus-visible, input:focus-visible { outline: 2px solid var(--c-red); outline-offset: 2px; }

      .ord-progress-link { display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; background: none; border: none; color: var(--c-slate); font-family: var(--font-mono); font-size: 11.5px; font-weight: 500; cursor: pointer; padding: 6px; margin-bottom: 20px; text-decoration: underline; text-underline-offset: 3px; }
      .ord-progress-link:hover { color: var(--c-red); }

      .ord-milestone-toast { position: fixed; top: 18px; left: 50%; transform: translateX(-50%); z-index: 50; display: flex; align-items: center; gap: 8px; background: var(--c-forest); color: #F3EFE6; padding: 12px 20px; border-radius: 30px; font-family: var(--font-body); font-weight: 600; font-size: 13.5px; box-shadow: 0 8px 24px rgba(0,0,0,0.2); animation: ord-toast-in .3s ease-out; }
      @keyframes ord-toast-in { from { opacity: 0; transform: translate(-50%, -10px); } to { opacity: 1; transform: translate(-50%, 0); } }

      .ord-progress-screen { max-width: 460px; margin: 0 auto; }
      .ord-coverage-card { background: var(--c-ink); color: var(--c-paper); border-radius: 10px; padding: 26px 20px 22px; margin: 18px 0 24px; }
      .ord-coverage-split { display: flex; align-items: stretch; }
      .ord-coverage-stat { flex: 1; text-align: center; }
      .ord-coverage-divider { width: 1px; background: rgba(255,255,255,0.15); margin: 4px 4px; }
      .ord-coverage-pct { font-family: var(--font-display); font-size: 44px; font-weight: 700; color: var(--c-mustard); line-height: 1; }
      .ord-coverage-pct-raw { color: #8FAFC0; }
      .ord-coverage-label { font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.06em; text-transform: uppercase; color: #C9C2AC; margin-top: 6px; }
      .ord-coverage-note { font-size: 12px; color: #B8B3A2; margin-top: 18px; line-height: 1.55; text-align: center; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.12); }
      .ord-coverage-note strong { color: #E4DCC8; }
      .ord-coverage-note em { font-style: normal; text-decoration: underline; text-decoration-color: rgba(201,154,46,0.5); }

      .ord-progress-section-title { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; color: #9a927c; text-transform: uppercase; margin: 22px 0 10px; }

      .ord-cefr-list { display: flex; flex-direction: column; gap: 14px; }
      .ord-cefr-row-top { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 5px; }
      .ord-cefr-count { font-family: var(--font-mono); color: #8a8570; }

      .ord-growth-chart { background: #FBF9F4; border: 1px solid var(--c-line); border-radius: 8px; padding: 14px 14px 10px; }
      .ord-growth-empty { background: #FBF9F4; border: 1px solid var(--c-line); border-radius: 8px; padding: 30px 16px; text-align: center; font-size: 13px; color: #8a8570; }
      .ord-growth-labels { display: flex; justify-content: space-between; align-items: center; font-family: var(--font-mono); font-size: 10px; color: #9a927c; margin-top: 6px; }
      .ord-growth-max { color: var(--c-red); font-weight: 600; }

      .ord-milestone-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
      .ord-milestone-badge { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 14px 6px; border-radius: 8px; border: 1.5px solid var(--c-line); background: #FBF9F4; color: #C9C2AC; font-family: var(--font-mono); font-size: 12px; font-weight: 600; }
      .ord-milestone-badge.reached { border-color: var(--c-mustard); background: rgba(201,154,46,0.1); color: #8C6A1F; }

      .ord-hardword-list { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
      .ord-hardword-row { display: flex; justify-content: space-between; align-items: center; gap: 10px; background: #FBF9F4; border: 1px solid var(--c-line); border-radius: 8px; padding: 12px 14px; }
      .ord-hardword-sv { font-family: var(--font-display); font-size: 16px; font-weight: 600; }
      .ord-hardword-gender { font-family: var(--font-mono); font-size: 11px; color: #8a8570; font-weight: 400; }
      .ord-hardword-en { font-size: 13px; color: #6b6656; margin-top: 2px; }
      .ord-hardword-conj { font-family: var(--font-mono); font-size: 11px; color: var(--c-slate); margin-top: 3px; }
      .ord-hardword-meta { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
      .ord-hardword-tag { font-family: var(--font-mono); font-size: 9.5px; letter-spacing: 0.04em; color: #A39C86; text-transform: uppercase; }

      .ord-dict-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 16px 0 12px; }
      .ord-dict-dir-btn { padding: 10px 8px; border-radius: 6px; border: 1.5px solid var(--c-line); background: #FBF9F4; font-family: var(--font-body); font-size: 12.5px; font-weight: 600; color: #8a8570; cursor: pointer; }
      .ord-dict-dir-btn.active { border-color: var(--c-slate); background: rgba(62,92,107,0.08); color: var(--c-slate); }
      .ord-dict-search { position: relative; margin-bottom: 16px; }
      .ord-dict-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #A39C86; }
      .ord-dict-input { width: 100%; padding: 12px 12px 12px 38px; border: 1.5px solid var(--c-line); border-radius: 8px; font-family: var(--font-body); font-size: 15px; background: #FBF9F4; color: var(--c-ink); }
      .ord-dict-input:focus { outline: none; border-color: var(--c-red); }
      .ord-dict-results { display: flex; flex-direction: column; gap: 6px; max-height: 45vh; overflow-y: auto; }
      .ord-dict-row { padding: 10px 12px; background: #FBF9F4; border: 1px solid var(--c-line); border-radius: 6px; }
      .ord-dict-word { font-family: var(--font-display); font-weight: 600; font-size: 14.5px; }
      .ord-dict-translations { font-size: 12.5px; color: #6b6656; margin-top: 2px; }
      .ord-dict-external { margin-top: 22px; padding-bottom: 20px; }
      .ord-dict-external-link { display: flex; align-items: center; gap: 8px; padding: 12px 14px; margin-bottom: 8px; border: 1px solid var(--c-line); border-radius: 8px; color: var(--c-slate); font-family: var(--font-body); font-size: 13.5px; font-weight: 500; text-decoration: none; }
      .ord-dict-external-link:hover { border-color: var(--c-slate); background: rgba(62,92,107,0.06); }

      .ord-verb-table-head { display: grid; grid-template-columns: 1.1fr 1fr 1fr 1fr; gap: 6px; padding: 0 10px 8px; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.04em; text-transform: uppercase; color: #9a927c; }
      .ord-verb-list { display: flex; flex-direction: column; gap: 4px; max-height: 65vh; overflow-y: auto; }
      .ord-verb-row { display: grid; grid-template-columns: 1.1fr 1fr 1fr 1fr; gap: 6px; padding: 10px; background: #FBF9F4; border: 1px solid var(--c-line); border-radius: 6px; font-size: 12.5px; align-items: center; cursor: default; }
      .ord-verb-row:hover { border-color: var(--c-slate); background: rgba(62,92,107,0.06); }
      .ord-verb-inf { font-family: var(--font-display); font-weight: 600; }

      .ord-verb-hint { font-family: var(--font-mono); font-size: 10.5px; color: #A39C86; text-align: center; margin-bottom: 10px; }
      .ord-verb-quiz-row { display: flex; gap: 10px; align-items: center; justify-content: center; margin-bottom: 8px; }
      .ord-verb-quiz-btn { padding: 10px 18px; background: var(--c-red); color: #FBF3E8; border: none; border-radius: 6px; font-family: var(--font-body); font-weight: 600; font-size: 13px; cursor: pointer; }
      .ord-verb-quiz-btn:hover { background: #8C3220; }

      .ord-verb-row-wrap { display: flex; flex-direction: column; }
      .ord-verb-row-wrap .ord-verb-row { cursor: pointer; }
      .ord-verb-en-reveal { font-size: 12px; color: var(--c-slate); font-style: italic; padding: 6px 10px 8px; margin-top: 4px; }

      .ord-pos-filter-list { display: flex; flex-direction: column; gap: 6px; }
      .ord-pos-filter-item { display: flex; align-items: center; gap: 10px; padding: 11px 14px; background: #FBF9F4; border: 1.5px solid var(--c-line); border-radius: 8px; cursor: pointer; font-size: 13.5px; }
      .ord-pos-filter-item input[type="checkbox"] { width: 17px; height: 17px; accent-color: var(--c-red); flex-shrink: 0; }
      .ord-pos-filter-item span:nth-child(2) { flex: 1; }
      .ord-pos-filter-count { font-family: var(--font-mono); font-size: 11px; color: #8a8570; }
      .ord-freereview-count { flex: 1; font-family: var(--font-mono); font-size: 12px; color: #6b6656; text-align: center; }

      .ord-quizcell-input { width: 100%; min-width: 0; padding: 5px 6px; border: 1.5px solid var(--c-line); border-radius: 4px; font-family: var(--font-body); font-size: 12px; background: #fff; color: var(--c-ink); }
      .ord-quizcell-input:focus { outline: none; border-color: var(--c-slate); }
      .ord-quizcell-input.wrong { background: rgba(162,62,42,0.15); border-color: var(--c-red); color: var(--c-red); }
      .ord-quizcell.correct { display: inline-block; padding: 5px 6px; background: rgba(69,98,63,0.15); border: 1.5px solid var(--c-forest); border-radius: 4px; color: var(--c-forest); font-weight: 600; }

      .ord-save-error { max-width: 460px; margin: 0 auto 16px; padding: 10px 14px; background: rgba(162,62,42,0.1); border: 1px solid rgba(162,62,42,0.3); border-radius: 6px; font-family: var(--font-mono); font-size: 11.5px; color: var(--c-red); text-align: center; }

      .ord-account-row { max-width: 460px; margin: 14px auto 0; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 8px 10px; font-family: var(--font-mono); font-size: 11px; color: #A39C86; }

      .ord-user-banner { text-align: center; font-family: var(--font-body); font-size: 14px; font-weight: 600; color: var(--c-ink); margin: -4px 0 18px; }

      .ord-edit-name-form { display: flex; align-items: center; gap: 6px; }
      .ord-edit-name-input { font-family: var(--font-mono); font-size: 11px; padding: 4px 8px; border: 1px solid var(--c-line); border-radius: 4px; background: #FBF9F4; color: var(--c-ink); width: 110px; }
      .ord-edit-name-input:focus { outline: none; border-color: var(--c-red); }

      .ord-invite-link { display: block; width: 100%; text-align: center; padding: 12px; margin-top: 6px; background: rgba(201,154,46,0.1); border: 1px dashed var(--c-mustard); border-radius: 6px; font-family: var(--font-body); font-size: 13px; font-weight: 600; color: #8C6A1F; cursor: pointer; }
      .ord-invite-link:hover { background: rgba(201,154,46,0.18); }
      .ord-invite-box { margin-top: 6px; padding: 16px; background: #FBF9F4; border: 1px solid var(--c-line); border-radius: 8px; }
      .ord-account-email { opacity: 0.8; }

      .ord-login { max-width: 380px; margin: 60px auto 0; }
      .ord-login-form { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; }
      .ord-login-sent { margin-top: 20px; text-align: center; font-size: 14.5px; line-height: 1.6; }
      .ord-login-sent p { margin-bottom: 14px; }
    `);
}

/* ---------------- Auth gate: magic-link login, wraps the whole app ---------------- */

function AuthGate() {
  const [session, setSession] = useState(undefined); // undefined = checking, null = logged out
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [authError, setAuthError] = useState('');
  useEffect(() => {
    supabaseClient.auth.getSession().then(({
      data
    }) => setSession(data.session));
    const {
      data: listener
    } = supabaseClient.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);
  const sendMagicLink = async e => {
    e.preventDefault();
    if (!email.trim() || sending) return;
    setSending(true);
    setAuthError('');
    const redirectTo = window.location.origin + window.location.pathname;
    const {
      error
    } = await supabaseClient.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: redirectTo
      }
    });
    setSending(false);
    if (error) setAuthError('Något gick fel. Försök igen om en liten stund.');else setSent(true);
  };
  if (session === undefined) {
    return /*#__PURE__*/React.createElement("div", {
      className: "ord-root ord-loading"
    }, /*#__PURE__*/React.createElement(Style, null), /*#__PURE__*/React.createElement("div", {
      className: "ord-loading-tile"
    }, "ORDFÖRRÅD"));
  }
  if (!session) {
    return /*#__PURE__*/React.createElement("div", {
      className: "ord-root"
    }, /*#__PURE__*/React.createElement(Style, null), /*#__PURE__*/React.createElement("div", {
      className: "ord-login"
    }, /*#__PURE__*/React.createElement("header", {
      className: "ord-header"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ord-eyebrow"
    }, "SVENSKA · ORDINLÄRNING"), /*#__PURE__*/React.createElement("h1", {
      className: "ord-title"
    }, "Ordförråd"), /*#__PURE__*/React.createElement("div", {
      className: "ord-sub"
    }, "din avgångstavla för svenska ord")), sent ? /*#__PURE__*/React.createElement("div", {
      className: "ord-login-sent"
    }, /*#__PURE__*/React.createElement("p", null, "Kolla din inkorg — vi har skickat en inloggningslänk till ", /*#__PURE__*/React.createElement("strong", null, email), "."), /*#__PURE__*/React.createElement("button", {
      className: "ord-reset-link",
      onClick: () => {
        setSent(false);
        setEmail('');
      }
    }, "Skicka till en annan adress")) : /*#__PURE__*/React.createElement("form", {
      className: "ord-login-form",
      onSubmit: sendMagicLink
    }, /*#__PURE__*/React.createElement("input", {
      type: "email",
      required: true,
      value: email,
      onChange: e => setEmail(e.target.value),
      placeholder: "din@epost.se",
      className: "ord-type-input",
      autoComplete: "email"
    }), /*#__PURE__*/React.createElement("button", {
      className: "ord-start-btn",
      type: "submit",
      disabled: sending,
      style: {
        marginBottom: 0
      }
    }, sending ? 'Skickar...' : 'Skicka inloggningslänk'), authError && /*#__PURE__*/React.createElement("div", {
      className: "ord-type-feedback incorrect"
    }, authError))));
  }
  const updateDisplayName = async patch => {
    const {
      data,
      error
    } = await supabaseClient.auth.updateUser({
      data: patch
    });
    if (!error && data && data.user) {
      setSession(prev => ({
        ...prev,
        user: data.user
      }));
    }
    return !error;
  };
  const meta = session.user.user_metadata || {};
  const needsNamePrompt = !meta.display_name && !meta.name_prompt_skipped;
  if (needsNamePrompt) {
    return /*#__PURE__*/React.createElement(NameOnboarding, {
      onComplete: name => updateDisplayName({
        display_name: name
      }),
      onSkip: () => updateDisplayName({
        name_prompt_skipped: true
      })
    });
  }
  return /*#__PURE__*/React.createElement(OrdforradApp, {
    userId: session.user.id,
    userEmail: session.user.email,
    userName: meta.display_name || '',
    onLogout: () => supabaseClient.auth.signOut(),
    onUpdateName: name => updateDisplayName({
      display_name: name
    })
  });
}
function NameOnboarding({
  onComplete,
  onSkip
}) {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const submit = async e => {
    e.preventDefault();
    if (!name.trim() || saving) return;
    setSaving(true);
    await onComplete(name.trim());
    setSaving(false);
  };
  const skip = async () => {
    if (saving) return;
    setSaving(true);
    await onSkip();
    setSaving(false);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "ord-root"
  }, /*#__PURE__*/React.createElement(Style, null), /*#__PURE__*/React.createElement("div", {
    className: "ord-login"
  }, /*#__PURE__*/React.createElement("header", {
    className: "ord-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ord-eyebrow"
  }, "SVENSKA · ORDINLÄRNING"), /*#__PURE__*/React.createElement("h1", {
    className: "ord-title"
  }, "Ordförråd"), /*#__PURE__*/React.createElement("div", {
    className: "ord-sub"
  }, "vad heter du?")), /*#__PURE__*/React.createElement("form", {
    className: "ord-login-form",
    onSubmit: submit
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: name,
    onChange: e => setName(e.target.value),
    placeholder: "Ditt förnamn",
    className: "ord-type-input",
    autoComplete: "given-name",
    autoFocus: true
  }), /*#__PURE__*/React.createElement("button", {
    className: "ord-start-btn",
    type: "submit",
    disabled: saving,
    style: {
      marginBottom: 0
    }
  }, saving ? 'Sparar...' : 'Fortsätt'), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ord-reset-link",
    onClick: skip,
    disabled: saving
  }, "Hoppa över"))));
}
const rootEl = document.getElementById('root');
createRoot(rootEl).render(/*#__PURE__*/React.createElement(AuthGate, null));