(function () {
  "use strict";

  var THEME_KEY = "theme";
  var THEME_KEY_LEGACY = "denbond-theme";
  var html = document.documentElement;
  var body = document.body;

  /* Theme */
  function getStoredTheme() {
    try {
      var t = localStorage.getItem(THEME_KEY);
      if (t === "light" || t === "dark") return t;
      t = localStorage.getItem(THEME_KEY_LEGACY);
      if (t === "light" || t === "dark") {
        localStorage.setItem(THEME_KEY, t);
        return t;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  function applyTheme(theme) {
    if (theme !== "light" && theme !== "dark") theme = "dark";
    html.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
      localStorage.setItem(THEME_KEY_LEGACY, theme);
    } catch (e) {
      /* ignore */
    }
  }

  var initial = getStoredTheme();
  if (initial === "light" || initial === "dark") {
    applyTheme(initial);
  } else {
    applyTheme("dark");
  }

  var themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
      themeToggle.classList.add("is-spinning");
      applyTheme(next);
      window.setTimeout(function () {
        themeToggle.classList.remove("is-spinning");
      }, 450);
    });
  }

  /* Nav: glassmorphism + класс .scrolled при прокрутке > 50px */
  var nav = document.getElementById("nav");
  var burger = document.getElementById("burger");
  var mobileMenu = document.getElementById("mobileMenu");
  var mobileLinks = mobileMenu ? mobileMenu.querySelectorAll("a") : [];

  function updateNavScrolled() {
    if (!nav) return;
    if (window.scrollY > 50) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }

  var navScrollTicking = false;
  window.addEventListener(
    "scroll",
    function () {
      if (!navScrollTicking) {
        window.requestAnimationFrame(function () {
          updateNavScrolled();
          navScrollTicking = false;
        });
        navScrollTicking = true;
      }
    },
    { passive: true }
  );

  updateNavScrolled();

  function setMenuOpen(open) {
    if (!burger || !mobileMenu) return;
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    var closeLab =
      window.SiteI18n && window.SiteI18n.t ? window.SiteI18n.t("navAria.closeMenu") : "Закрыть меню";
    var openLab =
      window.SiteI18n && window.SiteI18n.t ? window.SiteI18n.t("navAria.openMenu") : "Открыть меню";
    burger.setAttribute("aria-label", open ? closeLab : openLab);
    mobileMenu.classList.toggle("is-open", open);
    if (open) {
      mobileMenu.removeAttribute("hidden");
      mobileMenu.removeAttribute("inert");
      body.style.overflow = "hidden";
    } else {
      mobileMenu.setAttribute("hidden", "");
      mobileMenu.setAttribute("inert", "");
      body.style.overflow = "";
    }
  }

  if (burger && mobileMenu) {
    burger.addEventListener("click", function () {
      setMenuOpen(!mobileMenu.classList.contains("is-open"));
    });
    mobileLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        setMenuOpen(false);
      });
    });
  }

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function revealElementsStagger(elements) {
    if (!elements || !elements.length) return;
    if (prefersReducedMotion.matches) {
      elements.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }
    elements.forEach(function (el, i) {
      window.setTimeout(function () {
        el.classList.add("is-visible");
      }, i * 100);
    });
  }

  function initSectionScrollReveal() {
    var sections = document.querySelectorAll("main > section:not(.hero)");
    sections.forEach(function (section) {
      var obs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var items = entry.target.querySelectorAll(".section-animate");
            revealElementsStagger(Array.prototype.slice.call(items));
            obs.unobserve(entry.target);
          });
        },
        { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.06 }
      );
      obs.observe(section);
    });
  }

  function initHero() {
    var hero = document.getElementById("hero");
    var content = document.getElementById("heroContent");
    if (!hero) return;

    function updateHeroTextFade() {
      if (!content || prefersReducedMotion.matches) return;
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;
      var heroH = hero.offsetHeight || 1;
      var t = scrollY / (heroH * 0.72);
      if (t > 1) t = 1;
      if (t < 0) t = 0;
      content.style.opacity = String(1 - t);
    }

    if (prefersReducedMotion.matches) {
      hero.classList.add("hero--ready");
      return;
    }

    window.requestAnimationFrame(function () {
      hero.classList.add("hero--ready");
    });

    window.addEventListener("scroll", updateHeroTextFade, { passive: true });
    updateHeroTextFade();
  }

  initSectionScrollReveal();
  initHero();

  /* Approach list stagger */
  var approachList = document.getElementById("approachList");
  if (approachList) {
    var approachIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            approachList.classList.add("is-revealed");
            approachIo.unobserve(approachList);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
    );
    approachIo.observe(approachList);
  }

  /* Manifest quote */
  var manifestQuote = document.getElementById("manifestQuote");
  if (manifestQuote) {
    var mqIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            manifestQuote.classList.add("is-visible");
            mqIo.unobserve(manifestQuote);
          }
        });
      },
      { threshold: 0.35 }
    );
    mqIo.observe(manifestQuote);
  }

  /* Tilt для карточек — disabled on mobile (≤767) */
  function bindTilt(card) {
    card.addEventListener("mousemove", function (e) {
      if (window.innerWidth <= 767) return;
      var r = card.getBoundingClientRect();
      var x = e.clientX - r.left;
      var y = e.clientY - r.top;
      var midX = r.width / 2;
      var midY = r.height / 2;
      var rotateX = ((y - midY) / midY) * -5;
      var rotateY = ((x - midX) / midX) * 5;
      card.style.transform =
        "perspective(900px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) translateZ(0)";
      card.style.boxShadow = "0 20px 50px var(--shadow)";
    });
    card.addEventListener("mouseleave", function () {
      card.style.transform = "";
      card.style.boxShadow = "";
    });
  }

  var galleryModalState = { urls: [], index: 0 };
  var videoModalEl = null;

  function initGalleryModal() {
    var modal = document.getElementById("galleryModal");
    var imgEl = document.getElementById("galleryModalImg");
    var counterEl = document.getElementById("galleryCounter");
    var backdrop = modal ? modal.querySelector(".gallery-modal__backdrop") : null;
    var closeBtn = modal ? modal.querySelector(".gallery-modal__close") : null;
    var prevBtn = document.getElementById("galleryPrev");
    var nextBtn = document.getElementById("galleryNext");
    if (!modal || !imgEl) return;

    function updateImg() {
      var urls = galleryModalState.urls;
      var i = galleryModalState.index;
      if (!urls.length) return;
      var nextSrc = urls[i];
      function show() {
        imgEl.src = nextSrc;
        imgEl.style.opacity = "1";
      }
      imgEl.style.transition = "opacity 0.2s ease";
      if (imgEl.getAttribute("src")) {
        imgEl.style.opacity = "0";
        window.setTimeout(show, 200);
      } else {
        show();
      }
      if (counterEl) counterEl.textContent = i + 1 + " / " + urls.length;
    }

    function openGallery(urls, startIndex) {
      if (!urls || !urls.length) return;
      galleryModalState.urls = urls;
      galleryModalState.index = Math.max(0, Math.min(startIndex || 0, urls.length - 1));
      modal.removeAttribute("hidden");
      modal.style.opacity = "0";
      body.style.overflow = "hidden";
      updateImg();
      window.requestAnimationFrame(function () {
        modal.style.transition = "opacity 0.3s ease";
        modal.style.opacity = "1";
      });
      if (closeBtn) closeBtn.focus();
    }

    function closeGallery() {
      modal.setAttribute("hidden", "");
      modal.style.opacity = "";
      modal.style.transition = "";
      imgEl.removeAttribute("src");
      imgEl.style.opacity = "";
      imgEl.style.transition = "";
      galleryModalState.urls = [];
      body.style.overflow = "";
    }

    function go(delta) {
      var n = galleryModalState.urls.length;
      if (!n) return;
      galleryModalState.index = (galleryModalState.index + delta + n) % n;
      updateImg();
    }

    if (backdrop) backdrop.addEventListener("click", closeGallery);
    if (closeBtn) closeBtn.addEventListener("click", closeGallery);
    if (prevBtn) prevBtn.addEventListener("click", function () { go(-1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { go(1); });

    var touchStartX = null;
    modal.addEventListener(
      "touchstart",
      function (e) {
        if (e.touches.length) touchStartX = e.touches[0].clientX;
      },
      { passive: true }
    );
    modal.addEventListener(
      "touchend",
      function (e) {
        if (touchStartX == null || !e.changedTouches.length) return;
        var dx = e.changedTouches[0].clientX - touchStartX;
        touchStartX = null;
        if (Math.abs(dx) < 48) return;
        if (dx < 0) go(1);
        else go(-1);
      },
      { passive: true }
    );

    document.addEventListener("keydown", function (e) {
      if (modal.hasAttribute("hidden")) return;
      if (e.key === "Escape") {
        closeGallery();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      }
    });

    window.openGalleryModal = openGallery;
    window.closeGalleryModal = closeGallery;
  }

  function initVideoModal() {
    var modal = document.getElementById("videoModal");
    videoModalEl = modal;
    var vidEl = document.getElementById("videoModalVideo");
    var backdrop = modal ? modal.querySelector(".video-modal__backdrop") : null;
    var closeBtn = modal ? modal.querySelector(".video-modal__close") : null;
    if (!modal || !vidEl) return;

    function closeVideo() {
      vidEl.pause();
      vidEl.removeAttribute("src");
      vidEl.classList.remove("video-modal__video--vertical", "video-modal__video--horizontal");
      vidEl.load();
      modal.setAttribute("hidden", "");
      modal.style.opacity = "";
      modal.style.transition = "";
      body.style.overflow = "";
    }

    function syncVideoAspect() {
      vidEl.classList.remove("video-modal__video--vertical", "video-modal__video--horizontal");
      var w = vidEl.videoWidth;
      var h = vidEl.videoHeight;
      if (!w || !h) return;
      if (h > w) {
        vidEl.classList.add("video-modal__video--vertical");
      } else {
        vidEl.classList.add("video-modal__video--horizontal");
      }
    }

    function openVideo(src) {
      if (!src) return;
      vidEl.classList.remove("video-modal__video--vertical", "video-modal__video--horizontal");
      vidEl.src = src;
      vidEl.setAttribute("autoplay", "");
      vidEl.setAttribute("controls", "");
      vidEl.setAttribute("playsinline", "");
      modal.removeAttribute("hidden");
      modal.style.opacity = "0";
      body.style.overflow = "hidden";
      vidEl.onloadedmetadata = function () {
        syncVideoAspect();
        vidEl.onloadedmetadata = null;
      };
      window.requestAnimationFrame(function () {
        modal.style.transition = "opacity 0.3s ease";
        modal.style.opacity = "1";
      });
      vidEl.play().catch(function () {});
      if (closeBtn) closeBtn.focus();
    }

    if (backdrop) backdrop.addEventListener("click", closeVideo);
    if (closeBtn) closeBtn.addEventListener("click", closeVideo);
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (!modal || modal.hasAttribute("hidden")) return;
      var g = document.getElementById("galleryModal");
      if (g && !g.hasAttribute("hidden")) return;
      closeVideo();
    });

    window.openVideoModal = openVideo;
    window.closeVideoModal = closeVideo;
  }

  initGalleryModal();
  initVideoModal();

  /* Отзывы: звёзды + стек карточек при скролле */
  function initReviewStars() {
    var nodes = document.querySelectorAll(".review-stars[data-rating]");
    var path =
      "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z";
    nodes.forEach(function (el, elIdx) {
      var r = parseFloat(el.getAttribute("data-rating"), 10);
      if (isNaN(r)) return;
      var max = 5;
      var html = "";
      for (var i = 1; i <= max; i++) {
        var gid = "review-star-grad-" + elIdx + "-" + i;
        if (r >= i) {
          html +=
            '<svg class="review-star" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="' +
            path +
            '"/></svg>';
        } else if (r > i - 1) {
          var frac = r - (i - 1);
          html +=
            '<svg class="review-star" viewBox="0 0 20 20" aria-hidden="true"><defs><linearGradient id="' +
            gid +
            '"><stop offset="' +
            frac * 100 +
            '%" stop-color="currentColor"/><stop offset="' +
            frac * 100 +
            '%" stop-color="var(--text-muted)"/></linearGradient></defs><path fill="url(#' +
            gid +
            ')" d="' +
            path +
            '"/></svg>';
        } else {
          html +=
            '<svg class="review-star review-star--empty" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="' +
            path +
            '"/></svg>';
        }
      }
      el.innerHTML = html;
    });
  }

  function initReviewsSlider() {
    var root = document.getElementById("reviewsSlider");
    var viewport = document.getElementById("reviewsSliderViewport");
    var track = document.getElementById("reviewsSliderTrack");
    var stage = root ? root.querySelector(".reviews-slider__stage") : null;
    var prevBtn = document.getElementById("reviewsPrev");
    var nextBtn = document.getElementById("reviewsNext");
    var dotsWrap = document.getElementById("reviewsDots");
    var counterEl = document.getElementById("reviewsCounter");
    if (!root || !viewport || !track) return;
    var slides = track.querySelectorAll(".review-card--slide");
    var n = slides.length;
    if (!n) return;

    var idx = 0;
    var timer = null;
    var intervalMs = 6500;
    var inView = false;
    var hoverPause = false;
    var dotButtons = [];

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.add("reviews-slider--static");
      track.classList.add("reviews-slider__track--static");
      var hintEl = root.querySelector(".reviews-slider__hint");
      if (hintEl) {
        hintEl.textContent =
          "Отзывов: " + n + " — пролистайте блок ниже.";
      }
      return;
    }

    function applyTransform() {
      var h = viewport.offsetHeight;
      if (h < 8) return;
      track.style.transform = "translateY(" + -idx * h + "px)";
    }

    function updateUI() {
      if (counterEl) counterEl.textContent = idx + 1 + " / " + n;
      for (var d = 0; d < dotButtons.length; d++) {
        dotButtons[d].classList.toggle("is-active", d === idx);
        dotButtons[d].setAttribute("aria-selected", d === idx ? "true" : "false");
      }
    }

    function goTo(i) {
      idx = ((i % n) + n) % n;
      applyTransform();
      updateUI();
      syncTimer();
    }

    function metrics() {
      var h = viewport.offsetHeight;
      if (h < 8) return;
      for (var i = 0; i < n; i++) {
        slides[i].style.height = h + "px";
      }
      track.style.height = n * h + "px";
      applyTransform();
    }

    function syncTimer() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
      if (!inView || hoverPause) return;
      timer = window.setInterval(function () {
        goTo(idx + 1);
      }, intervalMs);
    }

    track.style.transition = "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)";

    if (dotsWrap) {
      for (var di = 0; di < n; di++) {
        (function (j) {
          var b = document.createElement("button");
          b.type = "button";
          b.className = "reviews-slider__dot" + (j === 0 ? " is-active" : "");
          b.setAttribute("role", "tab");
          b.setAttribute("aria-label", "Отзыв " + (j + 1) + " из " + n);
          b.setAttribute("aria-selected", j === 0 ? "true" : "false");
          b.addEventListener("click", function () {
            goTo(j);
          });
          dotsWrap.appendChild(b);
          dotButtons.push(b);
        })(di);
      }
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(idx - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(idx + 1); });

    if (stage) {
      stage.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          goTo(idx - 1);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          goTo(idx + 1);
        }
      });
    }

    root.setAttribute("role", "region");
    root.setAttribute("aria-label", "Отзывы клиентов, карусель");

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          inView = entry.isIntersecting;
          syncTimer();
        });
      },
      { root: null, rootMargin: "0px 0px -5% 0px", threshold: 0.12 }
    );
    io.observe(root);

    viewport.addEventListener("mouseenter", function () {
      hoverPause = true;
      syncTimer();
    });
    viewport.addEventListener("mouseleave", function () {
      hoverPause = false;
      syncTimer();
    });

    window.addEventListener(
      "resize",
      function () {
        metrics();
        updateUI();
      },
      { passive: true }
    );

    metrics();
    updateUI();
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        metrics();
        updateUI();
      });
    });
  }

  function initReviewFormModal() {
    var modal = document.getElementById("reviewFormModal");
    var openBtn = document.getElementById("openReviewForm");
    var form = document.getElementById("reviewSubmitForm");
    var backdrop = modal ? modal.querySelector(".review-form-modal__backdrop") : null;
    var closeBtn = modal ? modal.querySelector(".review-form-modal__close") : null;
    var fileInput = document.getElementById("reviewFiles");
    var fileList = document.getElementById("reviewFilesList");
    var dropZone = modal ? modal.querySelector(".review-file-drop") : null;

    function openModal() {
      if (!modal) return;
      modal.removeAttribute("hidden");
      body.style.overflow = "hidden";
      if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
      if (!modal) return;
      modal.setAttribute("hidden", "");
      body.style.overflow = "";
    }

    if (openBtn) openBtn.addEventListener("click", openModal);
    if (backdrop) backdrop.addEventListener("click", closeModal);
    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape" || !modal || modal.hasAttribute("hidden")) return;
      closeModal();
    });

    function syncFileList() {
      if (!fileInput || !fileList) return;
      var files = fileInput.files;
      if (!files || !files.length) {
        fileList.textContent = "";
        return;
      }
      var parts = [];
      for (var i = 0; i < files.length; i++) {
        parts.push(files[i].name);
      }
      fileList.textContent = parts.join(", ");
    }

    if (fileInput) {
      fileInput.addEventListener("change", syncFileList);
    }

    if (dropZone && fileInput) {
      ["dragenter", "dragover"].forEach(function (ev) {
        dropZone.addEventListener(ev, function (e) {
          e.preventDefault();
          e.stopPropagation();
        });
      });
      dropZone.addEventListener("dragleave", function (e) {
        e.preventDefault();
      });
      dropZone.addEventListener("drop", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var dt = e.dataTransfer;
        if (!dt || !dt.files || !dt.files.length) return;
        try {
          var d = new DataTransfer();
          for (var j = 0; j < dt.files.length; j++) {
            d.items.add(dt.files[j]);
          }
          fileInput.files = d.files;
          syncFileList();
        } catch (err) {
          /* старые браузеры — остаётся только выбор через input */
        }
      });
    }

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var fd = new FormData(form);
        var payload = {};
        fd.forEach(function (val, key) {
          if (typeof val === "string") payload[key] = val;
        });
        console.log("Отзыв (демо), поля:", payload);
        if (fileInput && fileInput.files && fileInput.files.length) {
          var info = [];
          for (var k = 0; k < fileInput.files.length; k++) {
            var f = fileInput.files[k];
            info.push(f.name + " (" + f.type + ", " + f.size + " байт)");
          }
          console.log("Отзыв (демо), вложения:", info);
        }
        var rmsg =
          window.SiteI18n && window.SiteI18n.t
            ? window.SiteI18n.t("reviews.alertThanks")
            : "Спасибо! Отзыв принят (демо — данные в консоли).";
        alert(rmsg);
        form.reset();
        syncFileList();
        closeModal();
      });
    }
  }

  initReviewStars();
  initReviewsSlider();
  initReviewFormModal();

  var PORTFOLIO_ITEMS = [
    {
      id: 1,
      category: "ai-content",
      kind: "image",
      thumb: "image_work/ai-movitra-ice.png",
      gallery: [
        "image_work/ai-movitra-ice.png",
        "image_work/ai-cartier.jpg",
        "image_work/photo4.jpg",
        "image_work/photo4.png",
        "image_work/photo2.jpg",
        "image_work/photo1.jpg",
      ],
      galleryPhotoCount: 6,
    },
    {
      id: 2,
      category: "ai-content",
      kind: "image",
      thumb: "image_work/ai-maslenitsa.jpg",
      gallery: ["image_work/ai-maslenitsa.jpg", "image_work/photo3.jpg", "image_work/photo5.jpg"],
      galleryPhotoCount: 3,
    },
    {
      id: 3,
      category: "ai-content",
      kind: "image",
      thumb: "image_work/ai-timessquare.png",
      gallery: ["image_work/ai-timessquare.png", "image_work/photo6.jpg", "image_work/ai-glasses-table.jpg"],
      galleryPhotoCount: 3,
    },
    {
      id: 4,
      category: "video",
      kind: "video",
      video: "video_work/reel3.mp4",
      badge: true,
    },
    {
      id: 5,
      category: "video",
      kind: "video",
      video: "video_work/reel4.mp4",
    },
    {
      id: 6,
      category: "video",
      kind: "video",
      video: "video_work/reel1.mp4",
    },
    {
      id: 7,
      category: "video",
      kind: "video",
      video: "video_work/reel2.mp4",
    },
    {
      id: 8,
      category: "video",
      kind: "video",
      video: "video_work/reel5.mp4",
    },
    {
      id: 9,
      category: "video",
      kind: "video",
      video: "video_work/reel6.mp4",
    },
    {
      id: 10,
      category: "development",
      kind: "image",
      thumb: "image_work/bot-screen.jpg",
      gallery: ["image_work/bot-screen.jpg"],
    },
    {
      id: 11,
      category: "marketplaces",
      kind: "image",
      thumb: "image_work/wb-shirt-result.png",
      gallery: ["image_work/wb-shirt-result.png", "image_work/photo1.png", "image_work/photo3.png"],
      galleryPhotoCount: 3,
    },
    {
      id: 12,
      category: "development",
      kind: "image",
      thumb: "image_work/portfolio.png",
      gallery: ["image_work/portfolio.png"],
    },
    {
      id: 13,
      category: "bots",
      kind: "video",
      video: "video_work/table-automation-bot.mp4",
    },
  ];

  function initPortfolio() {
    var grid = document.getElementById("portfolioGrid");
    var tabs = document.getElementById("portfolioTabs");
    var moreWrap = document.getElementById("portfolioMoreWrap");
    var moreBtn = document.getElementById("portfolioMore");
    if (!grid || !tabs) return;

    var activeFilter = "all";
    var expandedAll = false;

    function filterList() {
      if (activeFilter === "all") return PORTFOLIO_ITEMS;
      return PORTFOLIO_ITEMS.filter(function (it) {
        return it.category === activeFilter;
      });
    }

    function buildDisplayList() {
      var list = filterList();
      if (activeFilter === "all") {
        return expandedAll ? list : list.slice(0, 6);
      }
      return list;
    }

    function showMoreVisible() {
      if (activeFilter !== "all") return false;
      return PORTFOLIO_ITEMS.length > 6 && !expandedAll;
    }

    function animateCards(cards) {
      function vis(card) {
        card.classList.add("is-visible");
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }
      if (prefersReducedMotion.matches) {
        cards.forEach(vis);
        return;
      }
      cards.forEach(function (card, i) {
        window.setTimeout(function () {
          vis(card);
        }, i * 50);
      });
    }

    function bindVideoCard(card, item) {
      var vid = card.querySelector(".portfolio-card__video");
      var playIc = card.querySelector(".portfolio-card__play");
      if (!vid) return;

      function playIconVisible(on) {
        if (!playIc) return;
        playIc.style.opacity = on ? "" : "0";
      }

      vid.pause();
      vid.currentTime = 0;
      playIconVisible(true);

      var hoverFine = window.matchMedia("(hover: hover)").matches;
      var coarsePointer = window.matchMedia("(hover: none)").matches;

      if (hoverFine) {
        card.addEventListener("mouseenter", function () {
          playIconVisible(false);
          vid.play().catch(function () {});
        });
        card.addEventListener("mouseleave", function () {
          playIconVisible(true);
          vid.pause();
          vid.currentTime = 0;
        });
      }

      if (coarsePointer) {
        card.addEventListener(
          "touchstart",
          function () {
            card.setAttribute("data-video-suppress-modal", "1");
            if (vid.paused) {
              var all = document.querySelectorAll(".portfolio-card__video");
              for (var i = 0; i < all.length; i++) {
                if (all[i] !== vid) {
                  all[i].pause();
                  all[i].currentTime = 0;
                }
              }
              vid.play().catch(function () {});
              playIconVisible(false);
            } else {
              vid.pause();
              vid.currentTime = 0;
              playIconVisible(true);
            }
          },
          { passive: true }
        );
      }
    }

    function createCardEl(item) {
      var getCopy =
        window.SiteI18n && window.SiteI18n.getPortfolioCardCopy
          ? window.SiteI18n.getPortfolioCardCopy.bind(window.SiteI18n)
          : function (id) {
              return { title: "", desc: "", tag: "" };
            };
      var copy = getCopy(item.id);

      var article = document.createElement("article");
      article.className = "portfolio-card";
      article.setAttribute("data-id", String(item.id));
      article.style.opacity = "0";
      article.style.transform = "translateY(20px)";
      article.style.transition = "opacity 0.4s ease, transform 0.4s ease";

      var media = document.createElement("div");
      media.className = "portfolio-card__media";

      if (item.kind === "image") {
        var img = document.createElement("img");
        img.src = item.thumb;
        img.alt = "";
        img.loading = "lazy";
        img.className = "portfolio-card__img";
        media.appendChild(img);
        if (item.galleryPhotoCount && item.galleryPhotoCount > 1) {
          var gc = document.createElement("span");
          gc.className = "portfolio-card__gallery-count";
          gc.setAttribute("aria-hidden", "true");
          var cam =
            window.InlineIcons && window.InlineIcons.raw && window.InlineIcons.raw.camera
              ? window.InlineIcons.raw.camera
              : "";
          gc.innerHTML =
            '<span class="portfolio-card__gallery-cam">' +
            cam +
            "</span><span class=\"portfolio-card__gallery-num\">" +
            item.galleryPhotoCount +
            "</span>";
          media.appendChild(gc);
        }
      } else if (item.kind === "video") {
        media.classList.add("portfolio-card__media--video");
        var v = document.createElement("video");
        v.className = "portfolio-card__video";
        v.setAttribute("muted", "");
        v.setAttribute("loop", "");
        v.setAttribute("playsinline", "");
        v.setAttribute("preload", "metadata");
        v.src = item.video;
        media.appendChild(v);
        var play = document.createElement("div");
        play.className = "portfolio-card__play";
        play.setAttribute("aria-hidden", "true");
        play.innerHTML =
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>';
        media.appendChild(play);
        if (item.badge && window.SiteI18n && window.SiteI18n.getPortfolioBadgeText) {
          var bd = document.createElement("span");
          bd.className = "portfolio-card__badge";
          bd.textContent = window.SiteI18n.getPortfolioBadgeText();
          media.appendChild(bd);
        }
      }

      var body = document.createElement("div");
      body.className = "portfolio-card__body";
      var h = document.createElement("h3");
      h.className = "portfolio-card__title";
      h.textContent = copy.title;
      var p = document.createElement("p");
      p.className = "portfolio-card__desc";
      p.textContent = copy.desc;
      body.appendChild(h);
      body.appendChild(p);
      if (copy.tag) {
        var tg = document.createElement("span");
        tg.className = "portfolio-card__tag";
        if (window.InlineIcons && window.InlineIcons.s14 && window.InlineIcons.tagIconKey) {
          var svgHtml = window.InlineIcons.s14(window.InlineIcons.tagIconKey(copy.tag));
          if (svgHtml) {
            var ic = document.createElement("span");
            ic.className = "portfolio-card__tag-icon";
            ic.setAttribute("aria-hidden", "true");
            ic.innerHTML = svgHtml;
            tg.appendChild(ic);
          }
        }
        var tx = document.createElement("span");
        tx.className = "portfolio-card__tag-text";
        tx.textContent = copy.tag;
        tg.appendChild(tx);
        body.appendChild(tg);
      }

      article.appendChild(media);
      article.appendChild(body);

      if (item.kind === "video") bindVideoCard(article, item);

      article.addEventListener("click", function (e) {
        if (item.kind === "video" && article.getAttribute("data-video-suppress-modal") === "1") {
          article.removeAttribute("data-video-suppress-modal");
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        if (item.gallery && item.gallery.length && window.openGalleryModal) {
          window.openGalleryModal(item.gallery, 0);
        } else if (item.video && window.openVideoModal) {
          window.openVideoModal(item.video);
        }
      });

      return article;
    }

    function render() {
      grid.innerHTML = "";
      var list = buildDisplayList();
      var els = [];
      list.forEach(function (item) {
        var el = createCardEl(item);
        grid.appendChild(el);
        els.push(el);
      });
      if (moreWrap) moreWrap.hidden = !showMoreVisible();
      window.requestAnimationFrame(function () {
        animateCards(els);
      });
    }

    tabs.querySelectorAll(".portfolio-tab").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var f = btn.getAttribute("data-filter") || "all";
        activeFilter = f;
        expandedAll = false;
        tabs.querySelectorAll(".portfolio-tab").forEach(function (b) {
          var on = b === btn;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-selected", on ? "true" : "false");
        });
        render();
      });
    });

    if (moreBtn) {
      moreBtn.addEventListener("click", function () {
        expandedAll = true;
        render();
      });
    }

    window.__refreshPortfolio = render;

    render();
  }

  function initAboutStats() {
    var root = document.getElementById("aboutStats");
    if (!root || prefersReducedMotion.matches) {
      if (root) {
        root.querySelectorAll(".about-stat__value[data-count]").forEach(function (el) {
          var c = parseFloat(el.getAttribute("data-count"), 10);
          var fmt = el.getAttribute("data-format");
          if (fmt === "views") el.textContent = "1M+";
          else el.textContent = c + "+";
        });
      }
      return;
    }

    function formatViews(n) {
      if (n >= 1000000) return "1M+";
      if (n >= 1000) return Math.round(n / 1000) + "K+";
      return String(Math.round(n)) + "+";
    }

    function runCount(el, target, duration, format) {
      var start = performance.now();
      function frame(now) {
        var t = Math.min(1, (now - start) / duration);
        var eased = 1 - Math.pow(1 - t, 2);
        var val = Math.round(target * eased);
        if (format === "views") {
          el.textContent = formatViews(val);
        } else {
          el.textContent = val + "+";
        }
        if (t < 1) {
          requestAnimationFrame(frame);
        } else {
          if (format === "views") el.textContent = "1M+";
          else el.textContent = target + "+";
        }
      }
      requestAnimationFrame(frame);
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          io.unobserve(root);
          root.querySelectorAll(".about-stat__value[data-count]").forEach(function (el) {
            var target = parseFloat(el.getAttribute("data-count"), 10);
            var fmt = el.getAttribute("data-format");
            if (fmt === "views") runCount(el, 1000000, 2000, "views");
            else runCount(el, target, 2000, "plus");
          });
        });
      },
      { threshold: 0.35 }
    );
    io.observe(root);
  }

  initPortfolio();
  initAboutStats();

  window.__onSiteLangChange = function () {
    if (typeof window.__refreshPortfolio === "function") {
      window.__refreshPortfolio();
    }
  };

  if (window.SiteI18n && window.SiteI18n.initLangSwitcher) {
    window.SiteI18n.initLangSwitcher();
  }

  window.addEventListener("resize", function () {
    if (window.innerWidth <= 767) {
      document.querySelectorAll("[data-tilt]").forEach(function (card) {
        card.style.transform = "";
        card.style.boxShadow = "";
      });
    }
  });

  /* Form tag groups */
  document.querySelectorAll(".tag-group").forEach(function (group) {
    var name = group.getAttribute("data-name");
    var hiddenId = name === "budget" ? "budgetInput" : "timelineInput";
    var hidden = document.getElementById(hiddenId);
    var tags = group.querySelectorAll(".tag");

    tags.forEach(function (tag) {
      tag.addEventListener("click", function () {
        tags.forEach(function (t) {
          t.classList.remove("is-active");
        });
        tag.classList.add("is-active");
        if (hidden) hidden.value = tag.getAttribute("data-value") || "";
      });
    });
  });

  var contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(contactForm);
      console.log("Заявка (демо):", Object.fromEntries(data.entries()));
      var msg =
        window.SiteI18n && window.SiteI18n.t
          ? window.SiteI18n.t("contact.alertThanks")
          : "Спасибо! Заявка принята (демо-режим — данные выведены в консоль).";
      alert(msg);
      contactForm.reset();
      document.querySelectorAll(".tag.is-active").forEach(function (t) {
        t.classList.remove("is-active");
      });
    });
  }
})();
