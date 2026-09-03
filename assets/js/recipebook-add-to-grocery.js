// Heberle Lab Recipe Book — "Add to grocery list" button on ingredient rows
// Reads whatever amount/name is currently displayed (respecting the page's
// unit mode and serving/loaf scaling at the moment of the click) and sends
// it to the same Firestore-backed list used by /recipebook/list/.

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, updateDoc, doc,
  serverTimestamp, increment, getDocs
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

var addBtns = document.querySelectorAll(".rb-grocery-add-btn");
if (addBtns.length) {

  // One-time fetch of the catalog for name-matching — a recipe page is
  // typically a brief visit, so a live subscription isn't worth keeping
  // open the way it is on the grocery list page itself.
  var itemsCache = [];
  getDocs(collection(db, ITEMS_COLLECTION)).then(function (snapshot) {
    itemsCache = snapshot.docs.map(function (d) {
      return Object.assign({ id: d.id }, d.data());
    });
  }).catch(function () {});

  function findExactMatch(name) {
    var lower = name.trim().toLowerCase();
    return itemsCache.find(function (i) { return i.name.toLowerCase() === lower; }) || null;
  }

  function getVisibleAmount(li) {
    var usSpan = li.querySelector(".rb-amount-us");
    var metricSpan = li.querySelector(".rb-amount-metric");
    if (metricSpan && getComputedStyle(metricSpan).display !== "none") {
      return metricSpan.textContent.trim();
    }
    if (usSpan) return usSpan.textContent.trim();
    return "";
  }

  function getIngredientNames(li) {
    var nameSpan = li.querySelector(".rb-item-name");
    if (!nameSpan) return { en: "", sv: "" };
    return {
      en: (nameSpan.dataset.en || "").trim(),
      sv: (nameSpan.dataset.sv || "").trim()
    };
  }

  async function addIngredientToGroceryList(name, nameSv, amount) {
    var match = findExactMatch(name);
    var itemId, category, listNameSv;

    if (match) {
      itemId = match.id;
      category = match.category || null;
      listNameSv = match.nameSv || nameSv || null;
      var updates = { useCount: increment(1) };
      if (!match.nameSv && nameSv) updates.nameSv = nameSv; // backfill the catalog if we now have a translation
      updateDoc(doc(db, ITEMS_COLLECTION, match.id), updates).catch(function () {});
    } else {
      var newItemRef = await addDoc(collection(db, ITEMS_COLLECTION), {
        name: name,
        nameSv: nameSv || null,
        category: null,
        useCount: 1
      });
      itemId = newItemRef.id;
      category = null;
      listNameSv = nameSv || null;
    }

    await addDoc(collection(db, LIST_COLLECTION), {
      itemId: itemId,
      name: match ? match.name : name,
      nameSv: listNameSv,
      category: category,
      note: amount || null,
      checked: false,
      createdAt: serverTimestamp()
    });
  }

  addBtns.forEach(function (btn) {
    btn.addEventListener("click", async function () {
      if (btn.classList.contains("is-added")) return;
      var li = btn.closest(".rb-ingredient");
      if (!li) return;
      var names = getIngredientNames(li);
      var amount = getVisibleAmount(li);
      if (!names.en) return;

      btn.disabled = true;
      try {
        await addIngredientToGroceryList(names.en, names.sv, amount);
        btn.textContent = "✓";
        btn.classList.add("is-added");
        btn.setAttribute("aria-label", "Added to grocery list");
        btn.title = "Added to grocery list";
      } catch (e) {
        btn.disabled = false;
        console.error("Failed to add to grocery list:", e);
      }
    });
  });
}
