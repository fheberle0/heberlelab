// Heberle Lab Recipe Book — Grocery List
// Shared, realtime household list backed by Firebase Firestore.

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, updateDoc, deleteDoc, doc,
  onSnapshot, query, orderBy, serverTimestamp, increment, writeBatch
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD-ElHm_NAMab1OSOyZ6duDzRpw7uGb-NM",
  authDomain: "recipe-book-c45f2.firebaseapp.com",
  projectId: "recipe-book-c45f2",
  storageBucket: "recipe-book-c45f2.firebasestorage.app",
  messagingSenderId: "863240407393",
  appId: "1:863240407393:web:5da755904aa7ac5a165d20"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ITEMS_COLLECTION = "groceryItems";
const LIST_COLLECTION = "groceryList";

var itemsCache = [];   // full grocery catalog, kept live via onSnapshot
var listCache = [];    // current live list, kept live via onSnapshot

function esc(s) {
  var div = document.createElement("div");
  div.textContent = s == null ? "" : String(s);
  return div.innerHTML;
}

// --- item name language (English / Swedish) ---
var currentLang = "en";
var langToggle = document.getElementById("rb-grocery-lang-toggle");
if (langToggle) {
  langToggle.querySelectorAll("[data-ing-lang]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      langToggle.querySelectorAll("[data-ing-lang]").forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      currentLang = btn.dataset.ingLang;
      renderList();
    });
  });
}

// --- add-item form + autocomplete ---
var addInput = document.getElementById("rb-grocery-add-input");
var addResults = document.getElementById("rb-grocery-add-results");
var addForm = document.getElementById("rb-grocery-add-form");

function findExactMatch(name) {
  var lower = name.trim().toLowerCase();
  return itemsCache.find(function (i) { return i.name.toLowerCase() === lower; }) || null;
}

async function addItemToList(rawName) {
  var name = rawName.trim();
  if (!name) return;

  var match = findExactMatch(name);
  var itemId, category;

  if (match) {
    itemId = match.id;
    category = match.category || null;
    updateDoc(doc(db, ITEMS_COLLECTION, match.id), { useCount: increment(1) }).catch(function () {});
  } else {
    var newItemRef = await addDoc(collection(db, ITEMS_COLLECTION), {
      name: name,
      nameSv: null,
      category: null,
      useCount: 1
    });
    itemId = newItemRef.id;
    category = null;
  }

  await addDoc(collection(db, LIST_COLLECTION), {
    itemId: itemId,
    name: match ? match.name : name,
    nameSv: match ? (match.nameSv || null) : null,
    category: category,
    note: null,
    checked: false,
    createdAt: serverTimestamp()
  });

  if (addInput) addInput.value = "";
  hideResults();
}

function hideResults() {
  if (addResults) {
    addResults.hidden = true;
    addResults.innerHTML = "";
  }
}

function renderAutocomplete(qstr) {
  if (!addResults) return;
  var q = qstr.trim().toLowerCase();
  if (!q) { hideResults(); return; }

  var matches = itemsCache
    .filter(function (i) { return i.name.toLowerCase().indexOf(q) > -1; })
    .sort(function (a, b) { return (b.useCount || 0) - (a.useCount || 0); })
    .slice(0, 8);

  if (!matches.length) {
    addResults.innerHTML = '<div class="rb-search-empty">No matches — press Enter to add "' + esc(qstr.trim()) + '" as new</div>';
    addResults.hidden = false;
    return;
  }

  addResults.innerHTML = matches.map(function (m) {
    return '<button type="button" class="rb-search-result" data-name="' + esc(m.name) + '">' +
      '<span class="rb-search-result-title">' + esc(m.name) + '</span>' +
      (m.category ? '<span class="rb-search-result-cat">' + esc(m.category) + '</span>' : '') +
      '</button>';
  }).join("");
  addResults.hidden = false;

  addResults.querySelectorAll("[data-name]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      addItemToList(btn.dataset.name);
    });
  });
}

if (addInput) {
  addInput.addEventListener("input", function () {
    renderAutocomplete(addInput.value);
  });
  addInput.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      hideResults();
      addInput.blur();
    }
  });
  document.addEventListener("click", function (e) {
    if (addResults && !addResults.contains(e.target) && e.target !== addInput) {
      hideResults();
    }
  });
}

if (addForm) {
  addForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (addInput) addItemToList(addInput.value);
  });
}

// --- toggle / delete / clear-checked ---
function toggleChecked(id, checked) {
  updateDoc(doc(db, LIST_COLLECTION, id), { checked: checked }).catch(function () {});
}

function deleteItem(id) {
  deleteDoc(doc(db, LIST_COLLECTION, id)).catch(function () {});
}

async function clearChecked() {
  var checkedItems = listCache.filter(function (i) { return i.checked; });
  if (!checkedItems.length) return;
  var batch = writeBatch(db);
  checkedItems.forEach(function (i) {
    batch.delete(doc(db, LIST_COLLECTION, i.id));
  });
  await batch.commit();
}

// --- rendering the list ---
var listRoot = document.getElementById("rb-grocery-list-root");

function renderRow(i) {
  var en = i.name || "";
  var sv = i.nameSv || en;
  var displayName = currentLang === "sv" ? sv : en;
  return '<li class="rb-ingredient rb-grocery-item' + (i.checked ? ' is-checked' : '') + '">' +
    '<input type="checkbox" class="rb-grocery-checkbox" data-id="' + i.id + '"' + (i.checked ? ' checked' : '') + '>' +
    '<span class="rb-grocery-name">' + esc(displayName) + '</span>' +
    (i.note ? '<span class="rb-grocery-note">' + esc(i.note) + '</span>' : '') +
    '<button type="button" class="rb-grocery-delete" data-id="' + i.id + '" aria-label="Remove">×</button>' +
    '</li>';
}

function renderList() {
  if (!listRoot) return;

  if (!listCache.length) {
    listRoot.innerHTML = '<p class="rb-grocery-empty">Nothing on the list yet — add something above.</p>';
    return;
  }

  var unchecked = listCache.filter(function (i) { return !i.checked; });
  var checked = listCache.filter(function (i) { return i.checked; });

  var byCategory = {};
  unchecked.forEach(function (i) {
    var cat = i.category || "Other";
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(i);
  });

  var categories = Object.keys(byCategory).sort(function (a, b) {
    if (a === "Other") return 1;
    if (b === "Other") return -1;
    return a.localeCompare(b);
  });

  var html = "";

  if (!unchecked.length) {
    html += '<p class="rb-grocery-empty">Nothing left to buy — nice work.</p>';
  }

  categories.forEach(function (cat) {
    var items = byCategory[cat];
    html += '<details class="rb-category" open>';
    html += '<summary class="rb-category-summary">' + esc(cat) + ' <span class="rb-category-count">(' + items.length + ')</span></summary>';
    html += '<ul class="rb-ingredient-list">';
    items.forEach(function (i) { html += renderRow(i); });
    html += '</ul></details>';
  });

  if (checked.length) {
    html += '<details class="rb-category">';
    html += '<summary class="rb-category-summary">Checked <span class="rb-category-count">(' + checked.length + ')</span></summary>';
    html += '<ul class="rb-ingredient-list">';
    checked.forEach(function (i) { html += renderRow(i); });
    html += '</ul></details>';
    html += '<button type="button" class="rb-reset-btn" id="rb-grocery-clear-checked-dyn" style="margin-top:0.75rem;">Clear checked</button>';
  }

  listRoot.innerHTML = html;

  listRoot.querySelectorAll(".rb-grocery-checkbox").forEach(function (cb) {
    cb.addEventListener("change", function () {
      toggleChecked(cb.dataset.id, cb.checked);
    });
  });
  listRoot.querySelectorAll(".rb-grocery-delete").forEach(function (btn) {
    btn.addEventListener("click", function () {
      deleteItem(btn.dataset.id);
    });
  });
  var dynClear = document.getElementById("rb-grocery-clear-checked-dyn");
  if (dynClear) dynClear.addEventListener("click", clearChecked);
}

// --- live listeners ---
onSnapshot(collection(db, ITEMS_COLLECTION), function (snapshot) {
  itemsCache = snapshot.docs.map(function (d) {
    return Object.assign({ id: d.id }, d.data());
  });
});

onSnapshot(query(collection(db, LIST_COLLECTION), orderBy("createdAt")), function (snapshot) {
  listCache = snapshot.docs.map(function (d) {
    return Object.assign({ id: d.id }, d.data());
  });
  renderList();
});
