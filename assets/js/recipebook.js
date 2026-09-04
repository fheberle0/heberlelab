(function () {
  "use strict";

  var main = document.querySelector(".rb-recipe");
  if (!main) return;

  var baseServings = parseFloat(main.dataset.baseServings) || 4;
  var servingsInput = document.getElementById("rb-servings");
  var stepBtns = document.querySelectorAll(".rb-step-btn");
  var unitBtns = document.querySelectorAll(".rb-unit-toggle .rb-toggle-btn");
  var langBtns = document.querySelectorAll(".rb-lang-toggle .rb-toggle-btn");
  var ingredientEls = document.querySelectorAll(".rb-ingredient");

  // --- fraction parsing / formatting ---
  // Handles: "1 1/2", "2/3", "3", "3-4" (ranges are left unscaled), "to taste" (left as-is)
  function parseAmount(str) {
    if (!str) return null;
    str = str.trim();
    if (!str || /taste|to taste/i.test(str) || str.indexOf("-") > -1) return null;

    var parts = str.split(" ");
    var total = 0;
    var found = false;
    parts.forEach(function (p) {
      if (p.indexOf("/") > -1) {
        var frac = p.split("/");
        var n = parseFloat(frac[0]);
        var d = parseFloat(frac[1]);
        if (!isNaN(n) && !isNaN(d) && d !== 0) {
          total += n / d;
          found = true;
        }
      } else {
        var v = parseFloat(p);
        if (!isNaN(v)) {
          total += v;
          found = true;
        }
      }
    });
    return found ? total : null;
  }

  var COMMON_FRACTIONS = [
    [0.125, "1/8"], [0.25, "1/4"], [0.333, "1/3"], [0.375, "3/8"],
    [0.5, "1/2"], [0.625, "5/8"], [0.667, "2/3"], [0.75, "3/4"], [0.875, "7/8"]
  ];

  function formatAmount(value) {
    if (value <= 0) return "0";
    var whole = Math.floor(value);
    var remainder = value - whole;
    var fracStr = "";

    if (remainder > 0.03) {
      var closest = null;
      var closestDiff = 1;
      COMMON_FRACTIONS.forEach(function (pair) {
        var diff = Math.abs(pair[0] - remainder);
        if (diff < closestDiff) {
          closestDiff = diff;
          closest = pair[1];
        }
      });
      if (closest && closestDiff < 0.05) {
        fracStr = closest;
      } else {
        // not close to a common fraction, round to 2 decimals
        return (Math.round(value * 100) / 100).toString();
      }
    }

    if (whole === 0 && fracStr) return fracStr;
    if (fracStr) return whole + " " + fracStr;
    return whole.toString();
  }

  function applyServings() {
    var isBatchMode = servingsInput.dataset.scaleMode === "batch";
    var fallback = isBatchMode ? 1 : baseServings;
    var target = parseFloat(servingsInput.value) || fallback;

    if (isBatchMode) {
      target = Math.max(1, Math.round(target));
      servingsInput.value = target;
    }

    var multiplier = isBatchMode ? target : (target / baseServings);

    if (isBatchMode) {
      var perUnit = parseFloat(servingsInput.dataset.perUnitServings) || 0;
      var note = document.getElementById("rb-servings-note");
      if (note) note.textContent = "≈ " + Math.round(perUnit * multiplier) + " servings";
    }

    ingredientEls.forEach(function (el) {
      var usSpan = el.querySelector(".rb-amount-us");
      var metricSpan = el.querySelector(".rb-amount-metric");

      var usBase = parseAmount(el.dataset.amountUs);
      var unitUs = el.dataset.unitUs || "";
      if (usSpan && usBase !== null) {
        usSpan.textContent = formatAmount(usBase * multiplier) + (unitUs ? " " + unitUs : "");
      }

      var metricBase = parseAmount(el.dataset.amountMetric);
      var unitMetric = el.dataset.unitMetric || "";
      if (metricSpan && metricBase !== null) {
        var scaled = metricBase * multiplier;
        var rounded = scaled >= 10 ? Math.round(scaled) : Math.round(scaled * 10) / 10;
        metricSpan.textContent = rounded + (unitMetric ? " " + unitMetric : "");
      }
    });
  }

  if (servingsInput) {
    servingsInput.addEventListener("input", applyServings);
    stepBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var step = parseFloat(btn.dataset.step);
        var fallback = servingsInput.dataset.scaleMode === "batch" ? 1 : baseServings;
        var current = parseFloat(servingsInput.value) || fallback;
        var next = Math.max(1, current + step);
        servingsInput.value = next;
        applyServings();
      });
    });
  }

  // --- unit toggle ---
  unitBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      unitBtns.forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      main.classList.toggle("rb-metric-mode", btn.dataset.unit === "metric");
    });
  });

  // --- ingredient name language toggle (English / Swedish) ---
  // Independent of the EN/BG "which language is main" toggle above — this only
  // swaps the words inside whichever span currently holds the English text.
  var ingLangBtns = document.querySelectorAll(".rb-ingredient-lang-toggle .rb-toggle-btn");
  var itemNameEls = document.querySelectorAll(".rb-item-name");

  ingLangBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      ingLangBtns.forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      var mode = btn.dataset.ingLang;

      itemNameEls.forEach(function (el) {
        el.style.transition = "opacity 0.15s ease";
        el.style.opacity = "0";
        setTimeout(function () {
          el.textContent = mode === "sv" ? el.dataset.sv : el.dataset.en;
          el.style.opacity = "1";
        }, 150);
      });
    });
  });

  // --- language toggle ---
  // Flex "order" swaps instantly with no native transition, so we use a
  // FLIP animation: record each span's position before the swap, then
  // animate from the old position to the new one with a transform.
  var langSpans = document.querySelectorAll(".rb-lang-primary, .rb-lang-secondary");

  function animateLangSwap(newMode) {
    var before = [];
    langSpans.forEach(function (el) {
      before.push({ el: el, rect: el.getBoundingClientRect() });
    });

    main.classList.toggle("rb-bg-mode", newMode === "bg");

    before.forEach(function (record) {
      var after = record.el.getBoundingClientRect();
      var dy = record.rect.top - after.top;
      if (Math.abs(dy) > 0.5) {
        record.el.style.transition = "none";
        record.el.style.transform = "translateY(" + dy + "px)";
      }
    });

    // force reflow so the transform above actually applies before we animate it away
    void main.offsetHeight;

    before.forEach(function (record) {
      record.el.style.transition = "transform 0.32s ease";
      record.el.style.transform = "";
    });
  }

  langBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      langBtns.forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      animateLangSwap(btn.dataset.lang);
    });
  });
  // --- reset servings to original ---
  var resetBtn = document.querySelector(".rb-reset-btn");
  if (resetBtn && servingsInput) {
    resetBtn.addEventListener("click", function () {
      servingsInput.value = servingsInput.dataset.scaleMode === "batch" ? 1 : baseServings;
      applyServings();
    });
  }

  // --- step timers ---
  (function () {
    var timerBtns = document.querySelectorAll(".rb-step-timer-btn");
    if (!timerBtns.length) return;

    var bar = document.querySelector(".rb-timer-bar");
    var timers = {};
    var nextId = 1;

    // --- screen wake lock: keep the screen on while a timer is running,
    // so the alert actually has a chance to be seen/heard. Only helps while
    // the tab is in the foreground (e.g. phone propped on the counter) —
    // it can't wake a locked screen or a backgrounded tab; that would need
    // real push notifications and a backend to send them.
    var wakeLock = null;

    async function requestWakeLock() {
      if (!("wakeLock" in navigator)) return;
      try {
        wakeLock = await navigator.wakeLock.request("screen");
        wakeLock.addEventListener("release", function () {
          wakeLock = null;
        });
      } catch (e) {
        // unavailable (unsupported browser, battery saver, etc.) — fail silently
      }
    }

    function releaseWakeLock() {
      if (wakeLock) {
        wakeLock.release().catch(function () {});
        wakeLock = null;
      }
    }

    function formatTime(sec) {
      var m = Math.floor(sec / 60);
      var s = sec % 60;
      return m + ":" + (s < 10 ? "0" : "") + s;
    }

    var audioCtx = null;
    function getAudioCtx() {
      if (!audioCtx) {
        try {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) { /* Web Audio unavailable */ }
      }
      return audioCtx;
    }

    function beep() {
      var ctx = getAudioCtx();
      if (!ctx) return;
      try {
        [0, 0.22, 0.44].forEach(function (delay) {
          var osc = ctx.createOscillator();
          var gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = 880;
          gain.gain.setValueAtTime(0.15, ctx.currentTime + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.18);
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + 0.18);
        });
      } catch (e) { /* ignore */ }
    }

    var originalTitle = document.title;
    var titleFlashInterval = null;
    function flashTitle() {
      var count = 0;
      if (titleFlashInterval) clearInterval(titleFlashInterval);
      titleFlashInterval = setInterval(function () {
        document.title = count % 2 === 0 ? "⏰ Timer done!" : originalTitle;
        count++;
        if (count > 6) {
          clearInterval(titleFlashInterval);
          document.title = originalTitle;
        }
      }, 800);
    }

    function updateBarVisibility() {
      var hasActiveTimers = Object.keys(timers).length > 0;
      bar.classList.toggle("is-visible", hasActiveTimers);
      if (hasActiveTimers && !wakeLock) {
        requestWakeLock();
      } else if (!hasActiveTimers && wakeLock) {
        releaseWakeLock();
      }
    }

    function updateChip(timer) {
      var remaining = Math.max(0, Math.round((timer.endTime - Date.now()) / 1000));
      timer.chipEl.querySelector(".rb-timer-chip-time").textContent = formatTime(remaining);
      return remaining;
    }

    function resetButton(btn) {
      btn.textContent = btn.dataset.originalLabel;
      btn.classList.remove("is-running", "is-done");
      delete btn.dataset.timerId;
    }

    function cancelTimer(id) {
      var timer = timers[id];
      if (!timer) return;
      clearInterval(timer.intervalId);
      if (timer.beepIntervalId) clearInterval(timer.beepIntervalId);
      if (timer.beepTimeoutId) clearTimeout(timer.beepTimeoutId);
      if (timer.chipEl.parentNode) timer.chipEl.parentNode.removeChild(timer.chipEl);
      resetButton(timer.btnEl);
      delete timers[id];
      updateBarVisibility();
    }

    function completeTimer(id) {
      var timer = timers[id];
      if (!timer) return;
      clearInterval(timer.intervalId);
      timer.stepEl.classList.add("rb-timer-done-flash");
      timer.btnEl.textContent = "Done (tap to stop)";
      timer.btnEl.classList.remove("is-running");
      timer.btnEl.classList.add("is-done");
      flashTitle();

      // Repeat the alert every 2s for up to 60s, or until dismissed via the
      // chip's × button or the step button — whichever comes first.
      beep();
      timer.beepIntervalId = setInterval(beep, 2000);
      timer.beepTimeoutId = setTimeout(function () {
        stopAlert(id);
      }, 60000);
    }

    function stopAlert(id) {
      var timer = timers[id];
      if (!timer) return;
      if (timer.beepIntervalId) clearInterval(timer.beepIntervalId);
      if (timer.beepTimeoutId) clearTimeout(timer.beepTimeoutId);
      if (timer.chipEl.parentNode) timer.chipEl.parentNode.removeChild(timer.chipEl);
      timer.stepEl.classList.remove("rb-timer-done-flash");
      resetButton(timer.btnEl);
      delete timers[id];
      updateBarVisibility();
    }

    function startTimer(btn) {
      getAudioCtx();
      var minutes = parseFloat(btn.dataset.minutes);
      var stepEl = btn.closest(".rb-step");
      var label = btn.dataset.label || "Timer";
      var id = nextId++;

      var chip = document.createElement("div");
      chip.className = "rb-timer-chip";
      chip.innerHTML =
        '<span class="rb-timer-chip-label">' + label + "</span>" +
        '<span class="rb-timer-chip-time"></span>' +
        '<button type="button" class="rb-timer-chip-cancel" aria-label="Cancel timer">×</button>';
      bar.appendChild(chip);

      var timer = { endTime: Date.now() + Math.round(minutes * 60 * 1000), chipEl: chip, btnEl: btn, stepEl: stepEl };
      timers[id] = timer;
      updateChip(timer);
      updateBarVisibility();

      btn.textContent = "Cancel";
      btn.classList.add("is-running");
      btn.dataset.timerId = id;

      timer.intervalId = setInterval(function () {
        var remaining = updateChip(timer);
        if (remaining <= 0) completeTimer(id);
      }, 1000);

      chip.querySelector(".rb-timer-chip-cancel").addEventListener("click", function () {
        cancelTimer(id);
      });
    }

    timerBtns.forEach(function (btn) {
      btn.dataset.originalLabel = btn.textContent;
      btn.addEventListener("click", function () {
        var id = btn.dataset.timerId;
        if (id && timers[id]) {
          cancelTimer(id);
        } else {
          startTimer(btn);
        }
      });
    });

    // When the tab regains focus, immediately recompute every active timer
    // from its real end time rather than waiting for the next tick — this
    // corrects any drift from background-tab throttling and catches timers
    // that should have already finished while the tab was backgrounded.
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState !== "visible") return;
      Object.keys(timers).forEach(function (id) {
        var timer = timers[id];
        var remaining = updateChip(timer);
        if (remaining <= 0) completeTimer(id);
      });
      if (Object.keys(timers).length > 0) requestWakeLock();
    });
  })();
})();
