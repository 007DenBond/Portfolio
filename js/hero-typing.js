(function () {
  "use strict";

  function rand(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  function getHeroParts() {
    if (!window.SiteI18n || !window.SiteI18n.STR) return null;
    var lang = window.SiteI18n.getLang();
    var h = window.SiteI18n.STR[lang];
    if (!h || !h.hero) return null;
    var hero = h.hero;
    if (hero.titleStart != null && hero.titleMiddle != null && hero.titleEnd != null) {
      return {
        start: String(hero.titleStart),
        middle: String(hero.titleMiddle),
        end: String(hero.titleEnd),
        full: String(hero.titleStart) + String(hero.titleMiddle) + String(hero.titleEnd),
      };
    }
    if (hero.title) {
      var t = String(hero.title);
      return { start: "", middle: t, end: "", full: t };
    }
    return null;
  }

  function initHeroTyping() {
    var elStart = document.getElementById("heroTypingStart");
    var elMiddle = document.getElementById("heroTypingMiddle");
    var elEnd = document.getElementById("heroTypingEnd");
    var elCursor = document.getElementById("heroTypingCursor");
    if (!elStart || !elMiddle || !elEnd || !elCursor) return;

    var mqMobile = window.matchMedia("(max-width: 768px)");
    var mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    var timeouts = [];

    function clearTimers() {
      timeouts.forEach(function (id) {
        clearTimeout(id);
      });
      timeouts = [];
    }

    function pushT(fn, delay) {
      timeouts.push(setTimeout(fn, delay));
    }

    var h1 = elStart.closest(".hero__title");

    function syncAria(full) {
      if (h1) h1.setAttribute("aria-label", full);
    }

    function resetCursorState() {
      elCursor.classList.remove("is-hidden");
      elCursor.classList.add("typing-cursor--active");
    }

    function finishCursor() {
      elCursor.classList.remove("typing-cursor--active");
      pushT(function () {
        elCursor.classList.add("is-hidden");
      }, rand(1400, 1800));
    }

    function run() {
      clearTimers();
      var parts = getHeroParts();
      elStart.textContent = "";
      elMiddle.textContent = "";
      elEnd.textContent = "";

      if (!parts) return;

      syncAria(parts.full);

      if (mqReduce.matches) {
        elStart.textContent = parts.start;
        elMiddle.textContent = parts.middle;
        elEnd.textContent = parts.end;
        elCursor.classList.remove("typing-cursor--active");
        elCursor.classList.add("is-hidden");
        return;
      }

      resetCursorState();

      var m = mqMobile.matches;
      var dStart = m ? 70 : 95;
      var pauseAfterStart = m ? 200 : 280;
      var dMid = m ? 38 : 48;
      var dEnd = m ? 58 : 72;
      var pauseBeforeMiddle = m ? 220 : 300;

      function typeChunk(el, text, index, delayPerChar, done) {
        if (index >= text.length) {
          done();
          return;
        }
        el.textContent = text.slice(0, index + 1);
        pushT(function () {
          typeChunk(el, text, index + 1, delayPerChar, done);
        }, delayPerChar);
      }

      pushT(function () {
        typeChunk(elStart, parts.start, 0, dStart, function () {
          pushT(function () {
            typeChunk(elMiddle, parts.middle, 0, dMid, function () {
              typeChunk(elEnd, parts.end, 0, dEnd, finishCursor);
            });
          }, pauseBeforeMiddle);
        });
      }, pauseAfterStart);
    }

    run();

    var prev = window.__onSiteLangChange;
    window.__onSiteLangChange = function (lang) {
      if (typeof prev === "function") prev(lang);
      run();
    };

    mqReduce.addEventListener("change", run);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeroTyping);
  } else {
    initHeroTyping();
  }
})();
