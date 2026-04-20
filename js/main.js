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

  var galleryModalState = { urls: [], index: 0, title: "", desc: "" };
  var videoModalEl = null;

  function initGalleryModal() {
    var modal = document.getElementById("galleryModal");
    var imgEl = document.getElementById("galleryModalImg");
    var counterEl = document.getElementById("galleryCounter");
    var thumbsEl = document.getElementById("galleryThumbs");
    var metaEl = document.getElementById("galleryMeta");
    var titleEl = document.getElementById("galleryTitle");
    var descEl = document.getElementById("galleryDesc");
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
      if (thumbsEl) {
        var allThumbs = thumbsEl.querySelectorAll(".gallery-modal__thumb");
        for (var ti = 0; ti < allThumbs.length; ti++) {
          allThumbs[ti].classList.toggle("is-active", ti === i);
        }
      }
    }

    function renderThumbs(urls) {
      if (!thumbsEl) return;
      thumbsEl.innerHTML = "";
      if (!urls || urls.length <= 1) {
        thumbsEl.setAttribute("hidden", "");
        return;
      }
      urls.forEach(function (u, thumbIndex) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "gallery-modal__thumb";
        btn.setAttribute("aria-label", "Фото " + (thumbIndex + 1));
        var im = document.createElement("img");
        im.src = u;
        im.alt = "";
        im.loading = "lazy";
        btn.appendChild(im);
        btn.addEventListener("click", function () {
          galleryModalState.index = thumbIndex;
          updateImg();
        });
        thumbsEl.appendChild(btn);
      });
      thumbsEl.removeAttribute("hidden");
    }

    function openGallery(urls, startIndex, meta) {
      if (!urls || !urls.length) return;
      galleryModalState.urls = urls;
      galleryModalState.index = Math.max(0, Math.min(startIndex || 0, urls.length - 1));
      galleryModalState.title = meta && meta.title ? meta.title : "";
      galleryModalState.desc = meta && meta.desc ? meta.desc : "";
      if (metaEl && titleEl && descEl) {
        titleEl.textContent = galleryModalState.title;
        descEl.textContent = galleryModalState.desc;
        if (galleryModalState.title || galleryModalState.desc) metaEl.removeAttribute("hidden");
        else metaEl.setAttribute("hidden", "");
      }
      renderThumbs(urls);
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
      if (thumbsEl) {
        thumbsEl.innerHTML = "";
        thumbsEl.setAttribute("hidden", "");
      }
      if (metaEl) {
        metaEl.setAttribute("hidden", "");
      }
      if (titleEl) titleEl.textContent = "";
      if (descEl) descEl.textContent = "";
      galleryModalState.urls = [];
      galleryModalState.title = "";
      galleryModalState.desc = "";
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
    var root = document.getElementById("reviews3d");
    var track = document.getElementById("reviewsTrack");
    var prev = document.getElementById("reviewsPrev");
    var next = document.getElementById("reviewsNext");
    var counter = document.getElementById("reviewsCounter");
    var empty = document.getElementById("reviewsEmpty");
    if (!root || !track || !prev || !next || !counter || !empty) return;

    var FALLBACK_REVIEWS = [
      {
        rating: 5,
        quote:
          "Денис сделал нам чат-бота для записи пациентов. Через неделю после запуска бот закрывал 40% обращений без участия администратора. Через месяц мы убрали одну смену на ресепшене.",
        name: "Андрей В.",
        role: "Клиника, администратор",
        avatar:
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=160&h=160&fit=crop&auto=format",
      },
      {
        rating: 5,
        quote:
          "За 10 дней получили рабочий прототип, за 3 недели — полную версию. Бот обрабатывает большую часть звонков, и команда перестала тонуть в рутине.",
        name: "Мария Л.",
        role: "Ресторан, управляющая",
        avatar:
          "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=160&h=160&fit=crop&auto=format",
      },
      {
        rating: 5,
        quote:
          "ИИ-аналитика для маркетплейсов сняла с нас 3 часа ручной работы в день. Каждое утро получаем готовый отчёт и понятные действия.",
        name: "Екатерина С.",
        role: "Маркетплейсы, собственный бренд",
        avatar:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&h=160&fit=crop&auto=format",
      },
      {
        rating: 5,
        quote:
          "Личный бренд запустили быстро и без бесконечных правок. Сайт выглядит дороже рынка и с первого экрана вызывает доверие.",
        name: "Игорь К.",
        role: "Эксперт, консалтинг",
        avatar:
          "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=160&h=160&fit=crop&auto=format",
      },
      {
        rating: 5,
        quote:
          "Получили не просто лендинг, а внятную структуру пути клиента. Конверсия выросла почти вдвое без увеличения рекламного бюджета.",
        name: "Ольга Н.",
        role: "Онлайн-школа, продюсер",
        avatar:
          "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=160&h=160&fit=crop&auto=format",
      },
      {
        rating: 5,
        quote:
          "Проект шёл в нормальном темпе: чёткие шаги, без затягивания. Через три недели уже вели трафик на готовую посадку.",
        name: "Руслан П.",
        role: "Сервисный бизнес, сооснователь",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&auto=format",
      },
      {
        rating: 5,
        quote:
          "Под премиальный продукт получили спокойный, дорогой визуал. Клиенты прямо отмечают, что сайт выглядит уверенно и внушает доверие.",
        name: "Лилия Т.",
        role: "Бьюти-бренд, основатель",
        avatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&h=160&fit=crop&auto=format",
      },
      {
        rating: 5,
        quote:
          "Дизайн, логика и интеграции собраны в одну систему. Команда перестала терять лиды и быстрее закрывает запросы.",
        name: "Сергей М.",
        role: "B2B, отдел продаж",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&auto=format",
      },
      {
        rating: 5,
        quote:
          "Всё объяснено по-человечески: что делаем, зачем и какой будет эффект. Результат — красивый сайт, который реально продаёт.",
        name: "Анна Р.",
        role: "Образовательный проект",
        avatar:
          "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=160&h=160&fit=crop&auto=format",
      },
    ];
    var items = [];
    var active = 0;
    var autoTimer = null;
    var touchStartX = 0;
    var touchMoveX = 0;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function starString(n) {
      var count = Math.max(1, Math.min(5, Number(n) || 5));
      return new Array(count + 1).join("★");
    }

    function cardHtml(item) {
      var reply = item.reply
        ? '<div class="review-3d-card__reply"><strong>💬 Ответ:</strong> ' + escapeHtml(item.reply) + "</div>"
        : "";
      return (
        '<div class="review-3d-card__stars">' +
        starString(item.rating) +
        '</div><blockquote class="review-3d-card__quote">' +
        escapeHtml(item.quote || "") +
        '</blockquote><div class="review-3d-card__author"><img class="review-3d-card__avatar" src="' +
        escapeAttr(item.avatar || "") +
        '" alt="' +
        escapeAttr(item.name || "") +
        '"><div><p class="review-3d-card__name">' +
        escapeHtml(item.name || "") +
        '</p><p class="review-3d-card__role">' +
        escapeHtml(item.role || "") +
        "</p></div></div>" +
        reply
      );
    }

    function escapeHtml(v) {
      return String(v || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    function escapeAttr(v) {
      return escapeHtml(v).replace(/"/g, "&quot;");
    }

    function render() {
      track.innerHTML = "";
      if (!items.length) {
        empty.hidden = false;
        counter.textContent = "0 / 0";
        return;
      }
      empty.hidden = true;
      counter.textContent = active + 1 + " / " + items.length;

      var prevIdx = (active - 1 + items.length) % items.length;
      var nextIdx = (active + 1) % items.length;
      var visible = [
        { idx: prevIdx, side: "prev" },
        { idx: active, side: "center" },
        { idx: nextIdx, side: "next" },
      ];

      visible.forEach(function (entry) {
        var card = document.createElement("article");
        card.className = "review-3d-card" + (entry.side === "center" ? " is-active" : "");
        card.setAttribute("role", "listitem");
        card.innerHTML = cardHtml(items[entry.idx]);
        if (entry.side === "center") {
          card.style.transform = "translate3d(-50%, 0, 0) scale(1) rotateY(0deg)";
          card.style.opacity = "1";
          card.style.zIndex = "3";
          card.style.filter = "none";
        } else if (entry.side === "prev") {
          card.style.transform = "translate3d(-78%, 16px, -150px) scale(0.8) rotateY(35deg)";
          card.style.opacity = "0.5";
          card.style.zIndex = "2";
          card.style.filter = "brightness(0.82)";
        } else {
          card.style.transform = "translate3d(-22%, 16px, -150px) scale(0.8) rotateY(-35deg)";
          card.style.opacity = "0.5";
          card.style.zIndex = "2";
          card.style.filter = "brightness(0.82)";
        }
        track.appendChild(card);
      });
    }

    function nextSlide() {
      if (!items.length) return;
      active = (active + 1) % items.length;
      render();
    }

    function prevSlide() {
      if (!items.length) return;
      active = (active - 1 + items.length) % items.length;
      render();
    }

    function startAuto() {
      if (reduceMotion || items.length < 2) return;
      if (autoTimer) window.clearInterval(autoTimer);
      autoTimer = window.setInterval(nextSlide, 5000);
    }

    function stopAuto() {
      if (autoTimer) {
        window.clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    function bindTouch() {
      root.addEventListener(
        "touchstart",
        function (e) {
          if (!e.touches || !e.touches[0]) return;
          touchStartX = e.touches[0].clientX;
          touchMoveX = touchStartX;
          stopAuto();
        },
        { passive: true }
      );

      root.addEventListener(
        "touchmove",
        function (e) {
          if (!e.touches || !e.touches[0]) return;
          touchMoveX = e.touches[0].clientX;
        },
        { passive: true }
      );

      root.addEventListener("touchend", function () {
        var dx = touchMoveX - touchStartX;
        if (Math.abs(dx) > 42) {
          if (dx < 0) nextSlide();
          else prevSlide();
        }
        startAuto();
      });
    }

    function loadReviews() {
      return fetch("/api/reviews/public", {
        method: "GET",
        credentials: "same-origin",
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Cannot load reviews");
          return res.json();
        })
        .then(function (data) {
          items = Array.isArray(data) && data.length ? data : FALLBACK_REVIEWS.slice();
          active = 0;
          render();
          startAuto();
        })
        .catch(function () {
          items = FALLBACK_REVIEWS.slice();
          render();
          startAuto();
        });
    }

    prev.addEventListener("click", function () {
      prevSlide();
      startAuto();
    });

    next.addEventListener("click", function () {
      nextSlide();
      startAuto();
    });

    root.addEventListener("mouseenter", stopAuto);
    root.addEventListener("mouseleave", startAuto);
    bindTouch();
    loadReviews();
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
    var avatarInput = document.getElementById("reviewAvatarInput");
    var avatarPreview = document.getElementById("reviewAvatarPreview");
    var avatarPlaceholder = document.getElementById("reviewAvatarPlaceholder");
    var avatarDrop = modal ? modal.querySelector(".review-avatar-drop") : null;
    var step1 = document.getElementById("reviewStep1");
    var step2 = document.getElementById("reviewStep2");
    var step3 = document.getElementById("reviewStep3");
    var backBtn = document.getElementById("reviewBackBtn");
    var consentCheckbox = document.getElementById("reviewConsentCheckbox");
    var finalSubmitBtn = document.getElementById("reviewFinalSubmitBtn");
    var closeAfterSuccessBtn = document.getElementById("reviewCloseAfterSuccessBtn");
    var submitError = document.getElementById("reviewSubmitError");
    var pendingPayload = null;

    function setStep(step) {
      if (!step1 || !step2 || !step3) return;
      var isFirst = step === 1;
      var isSecond = step === 2;
      var isThird = step === 3;
      step1.classList.toggle("review-form__step--active", isFirst);
      step2.classList.toggle("review-form__step--active", isSecond);
      step3.classList.toggle("review-form__step--active", isThird);
      step1.hidden = !isFirst;
      step2.hidden = !isSecond;
      step3.hidden = !isThird;
    }

    function openModal() {
      if (!modal) return;
      setStep(1);
      modal.removeAttribute("hidden");
      body.style.overflow = "hidden";
      if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
      if (!modal) return;
      modal.setAttribute("hidden", "");
      body.style.overflow = "";
      resetReviewForm();
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

    function syncAvatarPreview() {
      if (!avatarInput || !avatarPreview || !avatarPlaceholder) return;
      var file = avatarInput.files && avatarInput.files[0];
      if (!file) {
        avatarPreview.hidden = true;
        avatarPreview.removeAttribute("src");
        avatarPlaceholder.hidden = false;
        return;
      }
      var url = URL.createObjectURL(file);
      avatarPreview.src = url;
      avatarPreview.hidden = false;
      avatarPlaceholder.hidden = true;
    }

    if (avatarInput) {
      avatarInput.addEventListener("change", syncAvatarPreview);
    }

    if (avatarDrop && avatarInput) {
      ["dragenter", "dragover"].forEach(function (ev) {
        avatarDrop.addEventListener(ev, function (e) {
          e.preventDefault();
          e.stopPropagation();
        });
      });
      avatarDrop.addEventListener("drop", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var dt = e.dataTransfer;
        if (!dt || !dt.files || !dt.files.length) return;
        try {
          var d = new DataTransfer();
          d.items.add(dt.files[0]);
          avatarInput.files = d.files;
          syncAvatarPreview();
        } catch (_e) {
          /* fallback for old browsers */
        }
      });
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

    function resetReviewForm() {
      if (form) form.reset();
      setStep(1);
      pendingPayload = null;
      syncFileList();
      syncAvatarPreview();
      if (consentCheckbox) consentCheckbox.checked = false;
      if (finalSubmitBtn) finalSubmitBtn.disabled = true;
      if (submitError) {
        submitError.hidden = true;
        submitError.textContent = "";
      }
    }

    if (consentCheckbox && finalSubmitBtn) {
      consentCheckbox.addEventListener("change", function () {
        finalSubmitBtn.disabled = !consentCheckbox.checked;
        if (consentCheckbox.checked && submitError && !submitError.hidden) {
          submitError.hidden = true;
          submitError.textContent = "";
        }
      });
    }

    if (backBtn) {
      backBtn.addEventListener("click", function () {
        setStep(1);
      });
    }

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (step1 && !step1.classList.contains("review-form__step--active")) return;
        var fd = new FormData(form);
        var payload = {};
        fd.forEach(function (val, key) {
          if (typeof val === "string") payload[key] = val;
        });
        pendingPayload = payload;
        if (consentCheckbox) consentCheckbox.checked = false;
        if (finalSubmitBtn) finalSubmitBtn.disabled = true;
        if (submitError) {
          submitError.hidden = true;
          submitError.textContent = "";
        }
        setStep(2);
      });
    }

    if (finalSubmitBtn) {
      finalSubmitBtn.addEventListener("click", async function () {
        if (!consentCheckbox || !consentCheckbox.checked) {
          if (submitError) {
            submitError.textContent = "Необходимо дать согласие на обработку данных";
            submitError.hidden = false;
          }
          return;
        }
        finalSubmitBtn.disabled = true;
        try {
          var submitData = new FormData();
          submitData.append("name", String((pendingPayload && pendingPayload.review_name) || "").trim());
          submitData.append("contact", String((pendingPayload && pendingPayload.review_contact) || "").trim());
          submitData.append("role", String((pendingPayload && pendingPayload.review_role) || "").trim());
          submitData.append("quote", String((pendingPayload && pendingPayload.review_text) || "").trim());
          submitData.append("consent", "true");
          if (avatarInput && avatarInput.files && avatarInput.files[0]) {
            submitData.append("avatar", avatarInput.files[0]);
          }
          if (fileInput && fileInput.files && fileInput.files[0]) {
            submitData.append("attachment", fileInput.files[0]);
          }
          var res = await fetch("/api/reviews/submit", {
            method: "POST",
            body: submitData,
          });
          if (!res.ok) {
            var errText = "Не удалось отправить отзыв. Попробуйте позже.";
            try {
              var errPayload = await res.json();
              if (errPayload && errPayload.error) errText = String(errPayload.error);
            } catch (_e2) {
              /* ignore parse error */
            }
            throw new Error(errText);
          }
          if (submitError) {
            submitError.hidden = true;
            submitError.textContent = "";
          }
          setStep(3);
        } catch (err) {
          finalSubmitBtn.disabled = false;
          if (submitError) {
            submitError.textContent = (err && err.message) || "Не удалось отправить отзыв";
            submitError.hidden = false;
          }
        }
      });
    }

    if (closeAfterSuccessBtn) {
      closeAfterSuccessBtn.addEventListener("click", function () {
        closeModal();
      });
    }

    resetReviewForm();
  }

  initReviewStars();
  initReviewsSlider();
  initReviewFormModal();

  var FALLBACK_PORTFOLIO_ITEMS = [
    { id: 1, title: "AI кампания для MOVITRA", description: "Серия визуалов и креативов для рекламной кампании.", photo: "image_work/DenBOND_ai-movitra-ice.webp", category: "ai-content" },
    { id: 2, title: "AI визуал для бренда", description: "Концепт изображений под social media и performance.", photo: "image_work/DenBOND_ai-maslenitsa.webp", category: "ai-content" },
    { id: 3, title: "AI креатив Times Square", description: "Промо-стиль для digital-outdoor подачи.", photo: "image_work/DenBOND_ai-timessquare.webp", category: "ai-content" },
    { id: 4, title: "Портфолио-сайт", description: "Разработка и сборка современного сайта-портфолио.", photo: "image_work/DenBOND_portfolio.webp", category: "development" },
    { id: 5, title: "Telegram-бот", description: "Сценарии, автоматизация заявок и интеграции.", photo: "image_work/DenBOND_bot-screen.webp", category: "bots" },
    { id: 6, title: "Карточка для маркетплейса", description: "Оформление карточки товара и визуальная подача.", photo: "image_work/DenBOND_wb-shirt-result.webp", category: "marketplaces" }
  ];
  var PORTFOLIO_ITEMS = FALLBACK_PORTFOLIO_ITEMS.slice();

  function normalizePortfolioItems(items) {
    if (!Array.isArray(items)) return [];
    return items
      .map(function (it, idx) {
        if (!it || typeof it !== "object") return null;
        var photo =
          typeof it.photo === "string" && it.photo.trim()
            ? it.photo.trim()
            : typeof it.thumb === "string" && it.thumb.trim()
              ? it.thumb.trim()
              : Array.isArray(it.gallery) && it.gallery[0]
                ? String(it.gallery[0]).trim()
                : "";
        var video =
          typeof it.video === "string" && it.video.trim() ? it.video.trim() : "";
        if (!photo && !video) return null;
        return {
          id: Number(it.id) || idx + 1,
          title: typeof it.title === "string" && it.title.trim() ? it.title.trim() : "Проект",
          description: typeof it.description === "string" ? it.description.trim() : "",
          photo: photo,
          video: video,
          category: typeof it.category === "string" && it.category.trim() ? it.category.trim() : "development",
        };
      })
      .filter(Boolean);
  }

  function loadPortfolioItems() {
    return fetch("/api/works", {
      method: "GET",
      credentials: "same-origin",
    })
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load works");
        return res.json();
      })
      .then(function (items) {
        var normalized = normalizePortfolioItems(items);
        PORTFOLIO_ITEMS = normalized.length ? normalized : FALLBACK_PORTFOLIO_ITEMS.slice();
      })
      .catch(function () {
        PORTFOLIO_ITEMS = FALLBACK_PORTFOLIO_ITEMS.slice();
      });
  }

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
      vid.muted = true;
      vid.defaultMuted = true;

      function playIconVisible(on) {
        if (!playIc) return;
        playIc.style.opacity = on ? "" : "0";
      }

      var PREVIEW_T = 0.1;
      function setPreviewFrame() {
        try {
          vid.currentTime = PREVIEW_T;
        } catch (e) {
          /* ignore */
        }
      }
      function pauseAtPreview() {
        vid.pause();
        setPreviewFrame();
      }
      if (vid.readyState >= 2) {
        pauseAtPreview();
      } else {
        vid.addEventListener(
          "loadeddata",
          function () {
            pauseAtPreview();
          },
          { once: true }
        );
      }
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
          pauseAtPreview();
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
                  all[i].muted = true;
                  all[i].pause();
                  try {
                    all[i].currentTime = 0.1;
                  } catch (e2) {
                    /* ignore */
                  }
                }
              }
              vid.play().catch(function () {});
              playIconVisible(false);
            } else {
              pauseAtPreview();
              playIconVisible(true);
            }
          },
          { passive: true }
        );
      }
    }

    function createCardEl(item) {
      var categoryMap = {
        "video": "Видеопродакшн",
        "ai-content": "AI-контент",
        "development": "Разработка",
        "bots": "Боты",
        "marketplaces": "Маркетплейсы"
      };
      var article = document.createElement("article");
      article.className = "portfolio-card";
      article.setAttribute("data-id", String(item.id));

      var media = document.createElement("div");
      media.className = "portfolio-card__media";
      if (item.video) {
        var vid = document.createElement("video");
        vid.className = "portfolio-card__video portfolio-card__img";
        vid.src = item.video;
        vid.muted = true;
        vid.defaultMuted = true;
        vid.playsInline = true;
        vid.setAttribute("playsinline", "");
        vid.setAttribute("preload", "metadata");
        media.appendChild(vid);
      } else {
        var img = document.createElement("img");
        img.src = item.photo;
        img.alt = item.title || "";
        img.loading = "lazy";
        img.className = "portfolio-card__img";
        media.appendChild(img);
      }

      var body = document.createElement("div");
      body.className = "portfolio-card__body";
      var h = document.createElement("h3");
      h.className = "portfolio-card__title";
      h.textContent = item.title || "";
      var p = document.createElement("p");
      p.className = "portfolio-card__desc";
      p.textContent = item.description || "";
      body.appendChild(h);
      body.appendChild(p);
      var categoryText = categoryMap[item.category] || item.category || "";
      if (categoryText) {
        var tg = document.createElement("span");
        tg.className = "portfolio-card__tag";
        tg.textContent = categoryText;
        body.appendChild(tg);
      }

      article.appendChild(media);
      article.appendChild(body);
      article.addEventListener("click", function () {
        if (item.video && window.openVideoModal) {
          window.openVideoModal(item.video);
          return;
        }
        if (window.openGalleryModal && item.photo) {
          window.openGalleryModal([item.photo], 0, {
            title: item.title || "",
            desc: item.description || "",
          });
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
        if (item.video) {
          bindVideoCard(el, item);
        }
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

    window.__refreshPortfolio = function () {
      loadPortfolioItems().then(render);
    };

    loadPortfolioItems().then(render);
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
    var contactStep1 = document.getElementById("contactFormStep1");
    var contactStepThanks = document.getElementById("contactFormStepThanks");
    var contactConsent = document.getElementById("contactConsentCheckbox");
    var contactConsentWrap = document.getElementById("contactConsentWrap");
    var contactConsentHint = document.getElementById("contactConsentHint");
    var contactSubmitBtn = document.getElementById("contactSubmitBtn");
    var contactOkBtn = document.getElementById("contactFormOkBtn");

    function resetContactUi() {
      if (contactStep1) {
        contactStep1.classList.add("contact-form__step--active");
        contactStep1.hidden = false;
      }
      if (contactStepThanks) {
        contactStepThanks.classList.remove("contact-form__step--active");
        contactStepThanks.hidden = true;
      }
      if (contactConsentWrap) contactConsentWrap.classList.remove("is-invalid");
      if (contactConsentHint) {
        contactConsentHint.textContent = "Необходимо дать согласие";
        contactConsentHint.hidden = true;
      }
      if (contactSubmitBtn) contactSubmitBtn.disabled = !(contactConsent && contactConsent.checked);
    }

    if (contactConsent && contactSubmitBtn) {
      contactSubmitBtn.disabled = !contactConsent.checked;
      contactConsent.addEventListener("change", function () {
        contactSubmitBtn.disabled = !contactConsent.checked;
        if (contactConsent.checked) {
          if (contactConsentWrap) contactConsentWrap.classList.remove("is-invalid");
          if (contactConsentHint) contactConsentHint.hidden = true;
        }
      });
    }

    if (contactOkBtn) {
      contactOkBtn.addEventListener("click", function () {
        contactForm.reset();
        document.querySelectorAll(".tag.is-active").forEach(function (t) {
          t.classList.remove("is-active");
        });
        resetContactUi();
      });
    }

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (contactConsent && !contactConsent.checked) {
        if (contactConsentWrap) contactConsentWrap.classList.add("is-invalid");
        if (contactConsentHint) contactConsentHint.hidden = false;
        if (contactSubmitBtn) contactSubmitBtn.disabled = true;
        return;
      }
      var data = new FormData(contactForm);
      var name = String(data.get("name") || "").trim();
      var contact = String(data.get("contact") || "").trim();
      var message = String(data.get("message") || "").trim();
      var email = contact.indexOf("@") !== -1 ? contact : "";
      var phone = email ? "" : contact;

      fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          email: email,
          phone: phone,
          message: message,
        }),
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Lead save failed");
          if (contactStep1) {
            contactStep1.classList.remove("contact-form__step--active");
            contactStep1.hidden = true;
          }
          if (contactStepThanks) {
            contactStepThanks.classList.add("contact-form__step--active");
            contactStepThanks.hidden = false;
          }
        })
        .catch(function () {
          if (contactConsentHint) {
            contactConsentHint.textContent = "Не удалось отправить заявку. Попробуйте позже.";
            contactConsentHint.hidden = false;
          }
        });
    });

    resetContactUi();
  }
})();
