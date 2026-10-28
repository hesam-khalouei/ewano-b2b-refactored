
/* EWANO B2B — Navigation & Slide Engine */
(function () {
  'use strict';

  let slides = [];
  let totalSlides = 0;
  let currentIndex = 0;
  let deckInitialized = false;

  function toPersianDigits(number) {
    const digits = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    return String(number).replace(/\d/g, digit => digits[digit]);
  }

  function $(selector) {
    return document.querySelector(selector);
  }

  function $$(selector) {
    return Array.from(document.querySelectorAll(selector));
  }

  function initDeck() {
    if (deckInitialized) return;

    slides = $$('.slide');
    totalSlides = slides.length;

    if (totalSlides === 0) {
      console.warn('[Navigation] هنوز اسلایدی بارگذاری نشده.');
      return;
    }

    if (!$('#chapterNav') || !$('#slideDots')) {
      console.warn('[Navigation] Header یا Footer هنوز آماده نیست.');
      return;
    }

    console.log(`[Navigation] ${totalSlides} اسلاید آماده شد.`);

    const totalSlideNumEl = $('#totalSlideNum');

    if (totalSlideNumEl) {
      totalSlideNumEl.textContent = toPersianDigits(totalSlides);
    }

    const dotsContainer = $('#slideDots');

    if (dotsContainer) {
      dotsContainer.innerHTML = '';

      slides.forEach((slide, index) => {
        const dot = document.createElement('div');

        dot.className =
          'slide-dot' +
          (index >= 10 && index <= 14 ? ' journey-dot' : '');

        dot.title =
          slide.getAttribute('data-title') ||
          `اسلاید ${index + 1}`;

        dot.setAttribute('role', 'button');
        dot.setAttribute('tabindex', '0');
        dot.setAttribute(
          'aria-label',
          `رفتن به اسلاید ${index + 1}`
        );

        dot.addEventListener('click', () => goToSlide(index));

        dot.addEventListener('keydown', event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            goToSlide(index);
          }
        });

        dotsContainer.appendChild(dot);
      });
    }

    const drawerList = $('#drawerList');

    if (drawerList) {
      drawerList.innerHTML = '';

      slides.forEach((slide, index) => {
        const item = document.createElement('button');

        item.type = 'button';
        item.className = 'drawer-item';

        const title =
          slide.getAttribute('data-title') || 'اسلاید';

        const number = document.createElement('span');
        number.className = 'drawer-item-number';
        number.textContent = toPersianDigits(index + 1);

        const text = document.createElement('span');
        text.className = 'drawer-item-title';
        text.textContent = title;

        item.append(number, text);

        item.addEventListener('click', () => {
          goToSlide(index);
          toggleDrawer(false);
        });

        drawerList.appendChild(item);
      });
    }

    currentIndex = 0;
    updateDeckUI();
    deckInitialized = true;

    initMapTooltips();
    setupCardExpand();
  }

  function updateDeckUI() {
    if (!slides.length) return;

    slides.forEach((slide, index) => {
      const active = index === currentIndex;

      slide.classList.toggle('active', active);
      slide.setAttribute('aria-hidden', String(!active));

      // با جابه‌جایی اسلاید، اسکرول آن از ابتدا شروع شود.
      if (active) {
        slide.scrollTop = 0;
      }
    });

    const currentNum = $('#currentSlideNum');

    if (currentNum) {
      currentNum.textContent =
        toPersianDigits(currentIndex + 1);
    }

    const progressFill = $('#progressFill');

    if (progressFill) {
      progressFill.style.width =
        `${((currentIndex + 1) / totalSlides) * 100}%`;
    }

    const prevButton = $('#prevBtn');
    const nextButton = $('#nextBtn');

    if (prevButton) {
      prevButton.disabled = currentIndex === 0;
    }

    if (nextButton) {
      nextButton.disabled = currentIndex === totalSlides - 1;
    }

    const dotsContainer = $('#slideDots');

    if (dotsContainer) {
      Array.from(dotsContainer.children).forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
        dot.setAttribute(
          'aria-current',
          index === currentIndex ? 'step' : 'false'
        );
      });
    }

    const drawerList = $('#drawerList');

    if (drawerList) {
      Array.from(drawerList.children).forEach((item, index) => {
        item.classList.toggle('active', index === currentIndex);
      });
    }

    const activeChapter = parseInt(
      slides[currentIndex].getAttribute('data-chapter') || '0',
      10
    );

    $$('.chapter-btn').forEach((button, index) => {
      button.classList.toggle('active', index === activeChapter);
    });
  }

  function goToSlide(index) {
    if (!Number.isInteger(index)) return;
    if (index < 0 || index >= totalSlides) return;

    currentIndex = index;
    updateDeckUI();
  }

  function nextSlide() {
    if (currentIndex < totalSlides - 1) {
      currentIndex++;
      updateDeckUI();
    }
  }

  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
      updateDeckUI();
    }
  }

  function toggleDrawer(forceState) {
    const drawer = $('#drawerBackdrop');
    if (!drawer) return;

    const shouldOpen =
      typeof forceState === 'boolean'
        ? forceState
        : !drawer.classList.contains('open');

    drawer.classList.toggle('open', shouldOpen);
    document.body.classList.toggle('drawer-open', shouldOpen);

    const button = document.querySelector(
      '[onclick="toggleDrawer()"]'
    );

    if (button) {
      button.setAttribute('aria-expanded', String(shouldOpen));
    }
  }

  async function toggleFullScreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.warn('امکان تغییر حالت تمام‌صفحه وجود ندارد.', error);
    }
  }

  window.toggleDebitCardFlip = function (element) {
    const card = element || $('#debitCardFlipper');

    if (card) {
      card.classList.toggle('is-flipped');
    }
  };

  window.toggleVoucherFlip = function (element) {
    if (element) {
      element.classList.toggle('is-flipped');
    }
  };

  window.addEventListener('keydown', event => {
    if (
      ['INPUT', 'TEXTAREA', 'SELECT'].includes(
        document.activeElement?.tagName
      )
    ) {
      return;
    }

    if (
      event.key === 'ArrowLeft' ||
      event.key === 'PageDown' ||
      event.key === ' '
    ) {
      event.preventDefault();
      nextSlide();
    } else if (
      event.key === 'ArrowRight' ||
      event.key === 'PageUp'
    ) {
      event.preventDefault();
      prevSlide();
    } else if (event.key === 'Home') {
      event.preventDefault();
      goToSlide(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      goToSlide(totalSlides - 1);
    } else if (event.key === 'f' || event.key === 'F') {
      toggleFullScreen();
    } else if (event.key === 'Escape') {
      toggleDrawer(false);
    }
  });

  /* Iran map tooltip data */

  const MAP_DATA = [
    { key: 'Alborz', fa: 'البرز', center: 'کرج', stores: 450 },
    { key: 'Ardabil', fa: 'اردبیل', center: 'اردبیل', stores: 65 },
    { key: 'Bushehr', fa: 'بوشهر', center: 'بوشهر', stores: 110 },
    { key: 'ChaharmahalandBakhtiari', fa: 'چهارمحال و بختیاری', center: 'شهرکرد', stores: 45 },
    { key: 'EastAzerbaijan', fa: 'آذربایجان شرقی', center: 'تبریز', stores: 420 },
    { key: 'Fars', fa: 'فارس', center: 'شیراز', stores: 480 },
    { key: 'Gilan', fa: 'گیلان', center: 'رشت', stores: 280 },
    { key: 'Golestan', fa: 'گلستان', center: 'گرگان', stores: 85 },
    { key: 'Hamadan', fa: 'همدان', center: 'همدان', stores: 80 },
    { key: 'Hormozgan', fa: 'هرمزگان', center: 'بندرعباس', stores: 190 },
    { key: 'Ilam', fa: 'ایلام', center: 'ایلام', stores: 25 },
    { key: 'Isfahan', fa: 'اصفهان', center: 'اصفهان', stores: 550 },
    { key: 'Kerman', fa: 'کرمان', center: 'کرمان', stores: 220 },
    { key: 'Kermanshah', fa: 'کرمانشاه', center: 'کرمانشاه', stores: 210 },
    { key: 'Khuzestan', fa: 'خوزستان', center: 'اهواز', stores: 350 },
    { key: 'KohgiluyehAndBoyerAhmad', fa: 'کهگیلویه و بویراحمد', center: 'یاسوج', stores: 30 },
    { key: 'Kurdistan', fa: 'کردستان', center: 'سنندج', stores: 90 },
    { key: 'Lorestan', fa: 'لرستان', center: 'خرم‌آباد', stores: 70 },
    { key: 'Markazi', fa: 'مرکزی', center: 'اراک', stores: 140 },
    { key: 'Mazandaran', fa: 'مازندران', center: 'ساری', stores: 170 },
    { key: 'NorthKhorasan', fa: 'خراسان شمالی', center: 'بجنورد', stores: 40 },
    { key: 'Qazvin', fa: 'قزوین', center: 'قزوین', stores: 150 },
    { key: 'Qom', fa: 'قم', center: 'قم', stores: 240 },
    { key: 'RazaviKhorasan', fa: 'خراسان رضوی', center: 'مشهد', stores: 700 },
    { key: 'Semnan', fa: 'سمنان', center: 'سمنان', stores: 50 },
    { key: 'SistanAndBaluchestan', fa: 'سیستان و بلوچستان', center: 'زاهدان', stores: 100 },
    { key: 'SouthKhorasan', fa: 'خراسان جنوبی', center: 'بیرجند', stores: 35 },
    { key: 'Tehran', fa: 'تهران', center: 'تهران', stores: 3200 },
    { key: 'WestAzerbaijan', fa: 'آذربایجان غربی', center: 'ارومیه', stores: 160 },
    { key: 'Yazd', fa: 'یزد', center: 'یزد', stores: 180 },
    { key: 'Zanjan', fa: 'زنجان', center: 'زنجان', stores: 55 }
  ];

  function initMapTooltips() {
    const svg = $('.imap-svg');
    const box = $('.imap-map');

    if (!svg || !box) return;

    const byKey = {};

    MAP_DATA.forEach(item => {
      byKey[item.key] = item;
    });

    let tip = document.getElementById('imapTip');

    if (!tip) {
      tip = document.createElement('div');
      tip.id = 'imapTip';
      tip.className = 'imap-tip-rich';
      tip.setAttribute('role', 'status');
      box.appendChild(tip);
    }

    const digits = '۰۱۲۳۴۵۶۷۸۹';

    function formatPersian(number) {
      return number
        .toLocaleString('en-US')
        .replace(/,/g, '٬')
        .replace(/[0-9]/g, digit => digits[+digit]);
    }

    function showTooltip(element, x, y) {
      const item = byKey[element.getAttribute('data-k')];
      if (!item) return;

      const bounds = box.getBoundingClientRect();

      tip.innerHTML = `
        <div class="tip-title-row">
          <span class="tip-prov-name">استان ${item.fa}</span>
          <span class="tip-city-name">مرکز: ${item.center || '—'}</span>
        </div>
        <div class="tip-merch-row">
          <span>تعداد مرچنت:</span>
          <strong class="tip-merch-num">
            ${item.stores ? formatPersian(item.stores) : '۰'} فروشگاه
          </strong>
        </div>
      `;

      tip.style.left = `${x - bounds.left}px`;
      tip.style.top = `${y - bounds.top}px`;
      tip.classList.add('show');
    }

    svg.querySelectorAll('.imap-prov').forEach(province => {
      province.addEventListener('pointermove', event => {
        showTooltip(province, event.clientX, event.clientY);
      });

      province.addEventListener('click', event => {
        showTooltip(province, event.clientX, event.clientY);
      });

      province.addEventListener('pointerleave', () => {
        tip.classList.remove('show');
      });

      province.addEventListener('focus', () => {
        const bounds = province.getBoundingClientRect();

        showTooltip(
          province,
          bounds.left + bounds.width / 2,
          bounds.top + bounds.height / 2
        );
      });

      province.addEventListener('blur', () => {
        tip.classList.remove('show');
      });
    });
  }

  /* Expandable cards: particularly useful on touch devices */

  function setupCardExpand() {
    $$('.glass-card:not(.no-collapse), .service-tile').forEach(card => {
      card.addEventListener('click', event => {
        if (
          event.target.closest(
            'button, a, input, select, label'
          )
        ) {
          return;
        }

        card.classList.toggle('expanded-box');
      });
    });
  }

  window.goToSlide = goToSlide;
  window.nextSlide = nextSlide;
  window.prevSlide = prevSlide;
  window.toggleDrawer = toggleDrawer;
  window.toggleFullScreen = toggleFullScreen;

  let componentsReady = false;
  let slidesReady = false;

  function tryInit() {
    if (componentsReady && slidesReady) {
      initDeck();
    }
  }

  window.addEventListener('componentsLoaded', () => {
    componentsReady = true;
    tryInit();
  });

  window.addEventListener('slidesLoaded', () => {
    slidesReady = true;
    tryInit();
  });

  if ($('#chapterNav')) {
    componentsReady = true;
  }

  if ($$('.slide').length > 0) {
    slidesReady = true;
  }

  tryInit();
})();
