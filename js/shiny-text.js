/**
 * ShinyText без React — аналог useAnimationFrame + useTransform из motion/react.
 * Разметка: <span class="shiny-text" data-shiny-text data-speed="2" ...>текст</span>
 */
(function () {
  "use strict";

  function parseBool(v, def) {
    if (v === undefined || v === null || v === "") return def;
    if (v === "false" || v === "0") return false;
    return v === "true" || v === "1";
  }

  function initOne(el) {
    if (el.getAttribute("data-shiny-init") === "1") return;
    el.setAttribute("data-shiny-init", "1");

    var speed = parseFloat(el.dataset.speed, 10);
    if (isNaN(speed)) speed = 2;
    var delay = parseFloat(el.dataset.delay, 10);
    if (isNaN(delay)) delay = 0;
    var spread = parseFloat(el.dataset.spread, 10);
    if (isNaN(spread)) spread = 120;
    var color = el.dataset.color || "#b5b5b5";
    var shineColor = el.dataset.shineColor || el.dataset.shinecolor || "#ffffff";
    var directionLeft = el.dataset.direction !== "right";
    var yoyo = parseBool(el.dataset.yoyo, false);
    var pauseOnHover = parseBool(
      el.getAttribute("data-pause-on-hover") || el.dataset.pauseOnHover,
      false
    );
    var disabled = parseBool(el.getAttribute("data-disabled"), false);

    var animationDuration = speed * 1000;
    var delayDuration = delay * 1000;
    var directionRef = directionLeft ? 1 : -1;

    el.style.backgroundImage =
      "linear-gradient(" +
      spread +
      "deg, " +
      color +
      " 0%, " +
      color +
      " 35%, " +
      shineColor +
      " 50%, " +
      color +
      " 65%, " +
      color +
      " 100%)";
    el.style.backgroundSize = "200% auto";
    el.style.webkitBackgroundClip = "text";
    el.style.backgroundClip = "text";
    el.style.webkitTextFillColor = "transparent";

    if (disabled) {
      el.classList.add("is-disabled");
      return;
    }

    var elapsed = 0;
    var lastTime = null;
    var isPaused = false;
    var rafId = null;

    function setProgress(p) {
      var pos = 150 - p * 2;
      el.style.backgroundPosition = pos + "% center";
    }

    function tick(time) {
      if (disabled) return;
      if (isPaused) {
        lastTime = null;
        rafId = requestAnimationFrame(tick);
        return;
      }

      if (lastTime === null) {
        lastTime = time;
        rafId = requestAnimationFrame(tick);
        return;
      }

      var deltaTime = time - lastTime;
      lastTime = time;
      elapsed += deltaTime;

      var p;

      if (yoyo) {
        var cycleDuration = animationDuration + delayDuration;
        var fullCycle = cycleDuration * 2;
        var cycleTime = elapsed % fullCycle;

        if (cycleTime < animationDuration) {
          p = (cycleTime / animationDuration) * 100;
          p = directionRef === 1 ? p : 100 - p;
        } else if (cycleTime < cycleDuration) {
          p = directionRef === 1 ? 100 : 0;
        } else if (cycleTime < cycleDuration + animationDuration) {
          var reverseTime = cycleTime - cycleDuration;
          p = 100 - (reverseTime / animationDuration) * 100;
          p = directionRef === 1 ? p : 100 - p;
        } else {
          p = directionRef === 1 ? 0 : 100;
        }
      } else {
        var cDur = animationDuration + delayDuration;
        var cTime = elapsed % cDur;
        if (cTime < animationDuration) {
          p = (cTime / animationDuration) * 100;
          p = directionRef === 1 ? p : 100 - p;
        } else {
          p = directionRef === 1 ? 100 : 0;
        }
      }

      setProgress(p);
      rafId = requestAnimationFrame(tick);
    }

    if (pauseOnHover) {
      el.addEventListener("mouseenter", function () {
        isPaused = true;
      });
      el.addEventListener("mouseleave", function () {
        isPaused = false;
      });
    }

    rafId = requestAnimationFrame(tick);
  }

  function initAll() {
    document.querySelectorAll("[data-shiny-text]").forEach(initOne);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
