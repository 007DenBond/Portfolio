(function () {
  "use strict";

  var LANG_KEY = "site-lang";

  var STR = {
    ru: {
      nav: {
        about: "Обо мне",
        services: "Услуги",
        work: "Работы",
        testimonials: "Отзывы",
        contact: "Связаться",
      },
      hero: {
        title: "Я создаю цифровые решения, которые работают ЗА ВАС",
        titleStart: "Я",
        titleMiddle: " создаю цифровые решения, которые работают ",
        titleEnd: "ЗА ВАС",
        subtitle: "AI-КОНТЕНТ, ВИДЕОПРОДАКШН, САЙТЫ И БОТЫ ПОД КЛЮЧ",
        cta: "Обсудить проект",
        ctaWork: "Мои работы",
        scroll: "Прокрутить вниз",
      },
      about: {
        titleBefore: "Я не просто пишу код — я собираю ",
        titleHi: "впечатление",
        eyebrow: "AI · WEB · AUTOMATION",
        headline: "Делаю цифровые продукты, которые выглядят дороже и работают под бизнес-результат",
        leadNew:
          "Я соединяю дизайн, AI и разработку в одну систему: от визуальной подачи до логики взаимодействия и автоматизации, чтобы проект был не просто красивым, а действительно полезным и измеримым.",
        m1t: "AI-решения",
        m1d: "Инструменты и сценарии, которые ускоряют процессы и уменьшают ручную рутину.",
        m2t: "Сайты",
        m2d: "Продуманные интерфейсы с понятной структурой, фокусом на доверие и конверсию.",
        m3t: "Видеопродакшн",
        m3d: "Контент, который цепляет внимание и поддерживает визуальный стиль проекта.",
        m4t: "Системный подход",
        m4d: "От идеи до запуска: единая логика, аккуратная упаковка и рабочие интеграции.",
        accent: "Не просто красиво — а под задачу бизнеса, с быстрым выходом в прод.",
        lead: "Создаю AI-контент рекламного качества. Снимаю и монтирую видео — один из моих рилсов набрал 1\u00A0000\u00A0000+ просмотров. Разрабатываю Telegram-ботов и сайты.",
        li1: "AI-контент и генерация",
        li2: "Видеопродакшн",
        li3: "Сайты и лендинги",
        li4: "Боты и автоматизация",
        footer: "Быстро, красиво и не бездумно — с ясной структурой, вкусом к деталям и 1\u00A0000\u00A0000+ просмотров на счету.",
        stat1: "просмотров",
        stat2: "работ",
        stat3: "AI + ВИДЕО + КОД",
        stat3a: "3",
        stat3mid: " в ",
        stat3b: "1",
      },
      services: {
        title: "Услуги",
        c1t: "AI-контент",
        c1d: "Генерация рекламных визуалов, креативов и контента для соцсетей с помощью искусственного интеллекта",
        c2t: "Видеопродакшн",
        c2d: "Съёмка, монтаж и продакшн рилсов и рекламных роликов",
        c3t: "Сайты и лендинги",
        c3d: "Разработка современных сайтов с анимациями и адаптивом",
        c4t: "Боты и автоматизация",
        c4d: "Telegram-боты, AI-автоматизация процессов, интеграции с API",
      },
      portfolio: {
        title: "Мои работы",
        tabAll: "Все",
        tabAi: "AI-контент",
        tabVideo: "Видео",
        tabDev: "Разработка",
        tabBots: "Боты и автоматизация",
        tabMp: "Маркетплейсы",
        showMore: "Показать ещё",
        badgeViews: "1M+ просмотров",
      },
      contact: {
        title: "Давайте обсудим проект",
        subtitle: "Отвечу в течение 2 часов",
        photoAlt: "Контакт",
        submit: "Отправить",
        consent: "Согласен на обработку персональных данных",
        consentHtml:
          'Согласен с <a href="/privacy-policy/" target="_blank" rel="noopener noreferrer">политикой конфиденциальности</a> и обработкой персональных данных',
        phName: "Ваше имя",
        phContact: "Email или Telegram",
        phMessage: "Расскажите о проекте",
        labelName: "Имя",
        labelContact: "Контакт",
        labelMessage: "Сообщение",
        alertThanks: "Спасибо! Заявка принята (демо — данные в консоли).",
      },
      approach: {
        headBefore: "Как устроен ",
        headGold: "процесс",
        headAfter: "",
        s1t: "Анализ",
        s1p: "Изучаю задачу, продукт и цели. Понимаю ЧТО нужно, а не просто «сделать красиво».",
        s2t: "Прототип",
        s2p: "Собираю структуру, wireframe и сценарий. Согласовываем до начала работы.",
        s3t: "Продакшн",
        s3p: "Реализую — код, контент, анимации. Сдаю готовый результат.",
      },
      manifest: {
        quote:
          "Хороший сайт — это не когда «нормально сверстано». Это когда у проекта появляется энергия, форма и ощущение, что он живой.",
      },
      trust: {
        whyTitle: "Почему ко мне идут не просто за кодом",
        intro:
          "Я думаю не только о сборке, но и о том, как проект выглядит, воспринимается и работает на человека.",
        v1t: "Внешний вид",
        v1d:
          "Проект должен сразу производить сильное впечатление. Чтобы он выглядел дороже, цеплял взгляд и запоминался, а не был просто ещё одним сайтом.",
        v2t: "Понятная структура",
        v2d:
          "Важно, чтобы человеку было легко ориентироваться. Куда смотреть, что читать, что нажать и почему это вообще для него важно — всё считывается быстро и естественно.",
        v3t: "Подача и восприятие",
        v3d:
          "Недостаточно просто сделать — важно, как это подано. Где человек зацепится взглядом, что почувствует, что запомнит и почему проект будет восприниматься сильнее конкурентов.",
        v4t: "Скорость запуска",
        v4d:
          "Результат должен появляться быстро, без бесконечных согласований и затягивания процесса — с ясными шагами и нормальным темпом движения к запуску.",
        reviewsTitle: "Что говорят клиенты",
        reviewsHint: "9 отзывов — пролистайте влево или вправо.",
        leaveReview: "Оставить отзыв",
      },
      reviews: {
        modalTitle: "Оставить отзыв",
        modalHint:
          "Расскажите о проекте. Можно прикрепить скрин или короткое видео — так отзыву доверяют больше.",
        name: "Имя",
        namePh: "Как к вам обращаться",
        contact: "Контакт",
        contactPh: "Почта или Telegram",
        text: "Отзыв",
        textPh: "Текст отзыва",
        file: "Вложение",
        fileDrop: "Фото или видео — перетащите сюда или нажмите для выбора",
        submit: "Отправить отзыв",
        alertThanks: "Спасибо! Отзыв принят (демо — данные в консоли).",
      },
      navAria: {
        openMenu: "Открыть меню",
        closeMenu: "Закрыть меню",
      },
    },
    en: {
      nav: {
        about: "About",
        services: "Services",
        work: "Work",
        testimonials: "Testimonials",
        contact: "Contact",
      },
      hero: {
        title: "I create digital solutions that work FOR YOU",
        titleStart: "I",
        titleMiddle: " create digital solutions that work ",
        titleEnd: "FOR YOU",
        subtitle: "AI CONTENT, VIDEO PRODUCTION, WEBSITES & BOTS",
        cta: "Discuss a project",
        ctaWork: "My work",
        scroll: "Scroll down",
      },
      about: {
        titleBefore: "I don't just write code — I craft an ",
        titleHi: "impression",
        eyebrow: "AI · WEB · AUTOMATION",
        headline: "I build digital products that look premium and work for business outcomes",
        leadNew:
          "I combine design, AI, and development into one system: from visual storytelling to interaction logic and automation, so the project is not just beautiful, but truly useful and measurable.",
        m1t: "AI solutions",
        m1d: "Tools and workflows that speed up processes and reduce manual routine.",
        m2t: "Websites",
        m2d: "Structured interfaces focused on trust, clarity, and conversion.",
        m3t: "Video production",
        m3d: "Content that captures attention and supports your brand language.",
        m4t: "System approach",
        m4d: "From idea to launch: one logic, clear packaging, and working integrations.",
        accent: "Not just beautiful — built for business goals and fast launch.",
        lead: "I create ad-quality AI content. I shoot and edit video — one of my reels hit 1,000,000+ views. I build Telegram bots and websites.",
        li1: "AI Content & Generation",
        li2: "Video Production",
        li3: "Websites & Landing Pages",
        li4: "Bots & Automation",
        footer: "Fast, beautiful, and never mindless — with clear structure, taste for detail, and 1,000,000+ views under my belt.",
        stat1: "views",
        stat2: "projects",
        stat3: "AI + VIDEO + CODE",
        stat3a: "3",
        stat3mid: " in ",
        stat3b: "1",
      },
      services: {
        title: "Services",
        c1t: "AI Content",
        c1d: "Generating ad-quality visuals, creatives and social media content using artificial intelligence",
        c2t: "Video Production",
        c2d: "Shooting, editing and producing reels and ad videos",
        c3t: "Websites & Landing Pages",
        c3d: "Building modern websites with animations and responsive design",
        c4t: "Bots & Automation",
        c4d: "Telegram bots, AI workflow automation, API integrations",
      },
      portfolio: {
        title: "My Work",
        tabAll: "All",
        tabAi: "AI Content",
        tabVideo: "Video",
        tabDev: "Development",
        tabBots: "Bots & Automation",
        tabMp: "Marketplaces",
        showMore: "Show More",
        badgeViews: "1M+ views",
      },
      contact: {
        title: "Let's discuss your project",
        subtitle: "I'll reply within 2 hours",
        photoAlt: "Contact",
        submit: "Send",
        consent: "I agree to the processing of personal data",
        consentHtml:
          'I agree with the <a href="/privacy-policy/" target="_blank" rel="noopener noreferrer">privacy policy</a> and personal data processing',
        phName: "Your name",
        phContact: "Email or Telegram",
        phMessage: "Tell us about your project",
        labelName: "Name",
        labelContact: "Contact",
        labelMessage: "Message",
        alertThanks: "Thank you! Request received (demo — see console).",
      },
      approach: {
        headBefore: "How the ",
        headGold: "Process",
        headAfter: " Works",
        s1t: "Analysis",
        s1p:
          "I study the task, product and goals. I figure out WHAT's needed — not just 'make it pretty'.",
        s2t: "Prototype",
        s2p:
          "I build the structure, wireframe and user flow. We align before work begins.",
        s3t: "Production",
        s3p: "I deliver — code, content, animations. Ready result, on time.",
      },
      manifest: {
        quote:
          "A good site isn't “well coded enough.” It's when the project gains energy, shape, and feels alive.",
      },
      trust: {
        whyTitle: "Why people come for more than code",
        intro:
          "I think not only about implementation, but about how the project looks, is perceived, and works for people.",
        v1t: "Visual impact",
        v1d:
          "A project should make a strong first impression. It should look premium, catch attention, and stay memorable instead of feeling like just another site.",
        v2t: "Clear structure",
        v2d:
          "People should instantly understand where to look, what to read, what to click, and why it matters to them.",
        v3t: "Presentation and perception",
        v3d:
          "It's not enough to build it — the delivery matters. What grabs attention, what users feel, what they remember, and why your project feels stronger than competitors.",
        v4t: "Launch speed",
        v4d:
          "Results should come fast, without endless approvals and delays — with clear steps and real momentum toward launch.",
        reviewsTitle: "What clients say",
        reviewsHint: "9 reviews — swipe left or right.",
        leaveReview: "Leave a review",
      },
      reviews: {
        modalTitle: "Leave a review",
        modalHint:
          "Tell us about the project. You can attach a screenshot or short video — reviews with proof feel more trustworthy.",
        name: "Name",
        namePh: "How should we address you",
        contact: "Contact",
        contactPh: "Email or Telegram",
        text: "Review",
        textPh: "Review text",
        file: "Attachment",
        fileDrop: "Photo or video — drag here or click to choose",
        submit: "Submit review",
        alertThanks: "Thank you! Review received (demo — see console).",
      },
      navAria: {
        openMenu: "Open menu",
        closeMenu: "Close menu",
      },
    },
  };

  var portfolioCardEn = {
    1: {
      title: "Premium AI Visuals",
      desc: "AI-generated premium advertising visuals for an optics chain",
      tag: "AI Generation",
    },
    2: {
      title: "Holiday AI Creatives",
      desc: "Viral holiday visuals — AI-generated unique content for social media",
      tag: "AI Generation",
    },
    3: {
      title: "AI Content for Social Media",
      desc: "AI-generated content for Instagram and social media",
      tag: "AI Generation",
    },
    4: {
      title: "Reel — 1M+ Views",
      desc: "Viral reel that gained over 1,000,000 views",
      tag: "Video Production",
    },
    5: {
      title: "Food Content",
      desc: "Ad reel — shot and edited",
      tag: "Video Production",
    },
    6: {
      title: "Fashion Content",
      desc: "Image reel — shot and edited",
      tag: "Video Production",
    },
    7: {
      title: "Ad Video",
      desc: "Creative ad reel for social media",
      tag: "Video Production",
    },
    8: {
      title: "Automotive Content",
      desc: "Atmospheric reel — shot and edited",
      tag: "Video Production",
    },
    9: {
      title: "AI Education",
      desc: "Content about AI tools and neural networks",
      tag: "Video Production",
    },
    10: {
      title: "AI Bot for Marketplace Listings",
      desc: "Telegram bot: product photo → AI analysis → ready listing for WB, Ozon, Yandex Market",
      tag: "AI Bot",
    },
    11: {
      title: "Marketplace Listings",
      desc: "Sales-driven design and infographics for Wildberries",
      tag: "Marketplaces",
    },
    12: {
      title: "Personal Portfolio Website",
      desc: "Design and development from scratch — AI particles, animations, dark theme",
      tag: "Development",
    },
    13: {
      title: "Report Automation",
      desc:
        "2 days → 10 seconds. Manual calculation replaced with instant file upload. Result: −16 hours per week.",
      tag: "Python · Automation · Excel · Telegram Bot",
    },
    14: {
      title: "Short-form Video",
      desc: "Engaging reel with dynamic editing and premium visual rhythm",
      tag: "Video Production",
    },
  };

  var portfolioCardRu = {
    1: {
      title: "AI-визуалы премиум",
      desc: "AI-генерация рекламных визуалов премиального уровня для сети оптик",
      tag: "AI-генерация",
    },
    2: {
      title: "AI-креативы к праздникам",
      desc: "Вирусные праздничные визуалы — AI-генерация уникального контента для соцсетей",
      tag: "AI-генерация",
    },
    3: {
      title: "AI-контент для соцсетей",
      desc: "AI-генерация контента для Instagram и социальных сетей",
      tag: "AI-генерация",
    },
    4: {
      title: "Рилс — 1М+ просмотров",
      desc: "Вирусный рилс набравший более 1 000 000 просмотров",
      tag: "Видеопродакшн",
    },
    5: {
      title: "Фуд-контент",
      desc: "Рекламный рилс — съёмка и монтаж",
      tag: "Видеопродакшн",
    },
    6: {
      title: "Фэшн-контент",
      desc: "Имиджевый рилс — съёмка и монтаж",
      tag: "Видеопродакшн",
    },
    7: {
      title: "Рекламный ролик",
      desc: "Креативный рекламный рилс для соцсетей",
      tag: "Видеопродакшн",
    },
    8: {
      title: "Автомобильный контент",
      desc: "Атмосферный рилс — съёмка и монтаж",
      tag: "Видеопродакшн",
    },
    9: {
      title: "AI-обучение",
      desc: "Контент об AI-инструментах и нейросетях",
      tag: "Видеопродакшн",
    },
    10: {
      title: "AI-бот карточек для маркетплейсов",
      desc: "Telegram-бот: фото товара → AI-анализ → готовая карточка для WB, OZON, Яндекс Маркет",
      tag: "AI Бот",
    },
    11: {
      title: "Карточки для маркетплейсов",
      desc: "Продающий дизайн и инфографика для Wildberries",
      tag: "Маркетплейсы",
    },
    12: {
      title: "Персональный сайт-портфолио",
      desc: "Дизайн и разработка с нуля — AI-частицы, анимации, тёмная тема",
      tag: "Разработка",
    },
    13: {
      title: "Автоматизация отчётов",
      desc:
        "2 дня → 10 секунд. Раньше подсчёт вели вручную — теперь загружаешь файл и получаешь результат мгновенно. Результат: −16 часов в неделю.",
      tag: "Python · Автоматизация · Excel · Telegram Bot",
    },
    14: {
      title: "Короткий видео-формат",
      desc: "Динамичный рилс с акцентным монтажом и премиальной подачей",
      tag: "Видеопродакшн",
    },
  };

  function getStoredLang() {
    try {
      return localStorage.getItem(LANG_KEY);
    } catch (e) {
      return null;
    }
  }

  function setStoredLang(lang) {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch (e) {
      /* ignore */
    }
  }

  function getLang() {
    var l = getStoredLang();
    if (l === "en" || l === "ru") return l;
    return "ru";
  }

  function setLang(lang) {
    if (lang !== "en" && lang !== "ru") lang = "ru";
    document.documentElement.setAttribute("lang", lang === "en" ? "en" : "ru");
    document.documentElement.setAttribute("data-site-lang", lang);
    setStoredLang(lang);
    applyStaticStrings(lang);
    updateLangButtons(lang);
    var burger = document.getElementById("burger");
    if (burger) {
      var menuOpen = burger.classList.contains("is-open");
      burger.setAttribute(
        "aria-label",
        t(lang, menuOpen ? "navAria.closeMenu" : "navAria.openMenu")
      );
    }
    if (typeof window.__onSiteLangChange === "function") {
      window.__onSiteLangChange(lang);
    }
  }

  function t(lang, path) {
    var parts = path.split(".");
    var o = STR[lang];
    for (var i = 0; i < parts.length; i++) {
      if (!o) return path;
      o = o[parts[i]];
    }
    return typeof o === "string" ? o : path;
  }

  function applyStaticStrings(lang) {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (!key) return;
      var val = t(lang, key);
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        if (el.hasAttribute("data-i18n-placeholder")) {
          el.setAttribute("placeholder", val);
        } else {
          el.value = val;
        }
      } else {
        el.textContent = val;
      }
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      if (!key) return;
      el.setAttribute("placeholder", t(lang, key));
    });
    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-alt");
      if (!key) return;
      el.setAttribute("alt", t(lang, key));
    });
    document.querySelectorAll("[data-i18n-aria-label]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria-label");
      if (!key) return;
      el.setAttribute("aria-label", t(lang, key));
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      if (!key) return;
      el.innerHTML = t(lang, key);
    });
  }

  function updateLangButtons(active) {
    document.querySelectorAll(".lang-switch__btn").forEach(function (btn) {
      var isRu = btn.getAttribute("data-lang") === "ru";
      var isEn = btn.getAttribute("data-lang") === "en";
      var on = (active === "ru" && isRu) || (active === "en" && isEn);
      btn.classList.toggle("is-active", on);
    });
  }

  function initLangSwitcher() {
    var wrap = document.getElementById("langSwitch");
    if (!wrap) return;
    wrap.querySelectorAll(".lang-switch__btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var lang = btn.getAttribute("data-lang");
        if (lang === "ru" || lang === "en") setLang(lang);
      });
    });
    setLang(getLang());
  }

  function getPortfolioCardCopy(id) {
    var lang = getLang();
    var src = lang === "en" ? portfolioCardEn : portfolioCardRu;
    return src[id] || portfolioCardRu[id];
  }

  function getPortfolioBadgeText() {
    return t(getLang(), "portfolio.badgeViews");
  }

  window.SiteI18n = {
    getLang: getLang,
    setLang: setLang,
    initLangSwitcher: initLangSwitcher,
    t: function (path) {
      return t(getLang(), path);
    },
    getPortfolioCardCopy: getPortfolioCardCopy,
    getPortfolioBadgeText: getPortfolioBadgeText,
    STR: STR,
  };
})();
