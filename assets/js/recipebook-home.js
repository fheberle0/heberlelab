(function () {
  "use strict";

  // --- search autocomplete ---
  var input = document.getElementById("rb-search-input");
  var resultsBox = document.getElementById("rb-search-results");
  var index = (typeof RECIPE_INDEX !== "undefined") ? RECIPE_INDEX : [];

  function renderResults(matches, query) {
    if (!matches.length) {
      resultsBox.innerHTML = '<div class="rb-search-empty">No recipes match "' + query + '"</div>';
      resultsBox.hidden = false;
      return;
    }
    resultsBox.innerHTML = matches
      .slice(0, 8)
      .map(function (r) {
        return (
          '<a class="rb-search-result" href="' + r.url + '">' +
          '<span class="rb-search-result-title">' + r.title + '</span>' +
          '<span class="rb-search-result-cat">' + r.category + '</span>' +
          '</a>'
        );
      })
      .join("");
    resultsBox.hidden = false;
  }

  function search(query) {
    query = query.trim().toLowerCase();
    if (!query) {
      resultsBox.hidden = true;
      resultsBox.innerHTML = "";
      return;
    }
    var matches = index.filter(function (r) {
      return r.title.toLowerCase().indexOf(query) > -1 || r.category.toLowerCase().indexOf(query) > -1;
    });
    renderResults(matches, query);
  }

  if (input) {
    input.addEventListener("input", function () {
      search(input.value);
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        input.value = "";
        resultsBox.hidden = true;
        resultsBox.innerHTML = "";
        input.blur();
      } else if (e.key === "Enter") {
        var first = resultsBox.querySelector(".rb-search-result");
        if (first) window.location.href = first.getAttribute("href");
      }
    });

    document.addEventListener("click", function (e) {
      if (!resultsBox.contains(e.target) && e.target !== input) {
        resultsBox.hidden = true;
      }
    });

    input.addEventListener("focus", function () {
      if (input.value.trim()) search(input.value);
    });
  }

  // --- expand all / collapse all ---
  var categories = document.querySelectorAll(".rb-category");
  var expandBtn = document.getElementById("rb-expand-all");
  var collapseBtn = document.getElementById("rb-collapse-all");

  if (expandBtn) {
    expandBtn.addEventListener("click", function () {
      categories.forEach(function (c) { c.open = true; });
    });
  }
  if (collapseBtn) {
    collapseBtn.addEventListener("click", function () {
      categories.forEach(function (c) { c.open = false; });
    });
  }
})();
