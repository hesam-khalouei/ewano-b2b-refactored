
/* EWANO B2B — Bootstrap & Initialization */
(function () {
  'use strict';

  const CONFIG = {
    DEBUG: false,
    REQUIRED_FNS: [
      'goToSlide',
      'nextSlide',
      'prevSlide',
      'toggleDrawer',
      'toggleFullScreen'
    ],
    REQUIRED_DOM: [
      '.stage-container',
      '.deck-header',
      '.deck-footer'
    ]
  };

  const log = {
    info(message) {
      if (CONFIG.DEBUG) {
        console.log(`[Ewano] ${message}`);
      }
    },

    warn(message) {
      if (CONFIG.DEBUG) {
        console.warn(`[Ewano] ${message}`);
      }
    },

    error(message) {
      console.error(`[Ewano] ${message}`);
    },

    summary(count) {
      if (CONFIG.DEBUG) {
        console.log(
          `Ewano B2B Presentation — ${count} slides`
        );
      }
    }
  };

  function isFunction(name) {
    return typeof window[name] === 'function';
  }

  function query(selector) {
    return document.querySelector(selector);
  }

  function ensureActiveSlide() {
    const slides = document.querySelectorAll('.slide');

    if (slides.length === 0) {
      log.error('هیچ اسلایدی پیدا نشد!');
      return null;
    }

    if (!document.querySelector('.slide.active')) {
      slides[0].classList.add('active');
      log.info('اسلاید اول به عنوان active تنظیم شد');
    }

    return slides;
  }

  function checkRequiredFunctions() {
    const missing = CONFIG.REQUIRED_FNS.filter(
      name => !isFunction(name)
    );

    missing.forEach(name => {
      log.warn(`تابع ${name} پیدا نشد`);
    });

    return missing.length === 0;
  }

  function checkRequiredDOM() {
    const missing = CONFIG.REQUIRED_DOM.filter(
      selector => !query(selector)
    );

    missing.forEach(selector => {
      log.warn(`عنصر ${selector} پیدا نشد`);
    });

    return missing.length === 0;
  }

  function setupResizeHandler() {
    let timer;

    window.addEventListener('resize', () => {
      clearTimeout(timer);

      timer = setTimeout(() => {
        log.info(
          `viewport: ${window.innerWidth}×${window.innerHeight}`
        );
      }, 200);
    });
  }

  function setupVisibilityHandler() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        log.info('صفحه مخفی شد — pause');
      } else {
        log.info('صفحه دوباره نمایان شد — resume');
      }
    });
  }

  function setupErrorBoundary() {
    window.addEventListener('error', event => {
      log.error(
        `خطای JS: ${event.message} در ` +
        `${event.filename}:${event.lineno}`
      );
    });

    window.addEventListener('unhandledrejection', event => {
      log.error(`Promise rejection: ${event.reason}`);
    });
  }

  let bootstrapped = false;

  function bootstrap() {
    if (bootstrapped) return;

    // اسلایدها و کامپوننت‌ها باید بارگذاری شده باشند.
    if (
      !document.querySelector('.slide') ||
      !query('.deck-header') ||
      !query('.deck-footer')
    ) {
      return;
    }

    bootstrapped = true;
    log.info('شروع bootstrap...');

    if (!checkRequiredDOM()) {
      log.warn('برخی عناصر اصلی DOM پیدا نشدند');
    }

    const slides = ensureActiveSlide();

    if (!slides) return;

    if (!checkRequiredFunctions()) {
      log.warn('برخی توابع اصلی تعریف نشده‌اند');
    }

    setupResizeHandler();
    setupVisibilityHandler();
    setupErrorBoundary();

    log.summary(slides.length);
    log.info('bootstrap کامل شد');
  }

  window.addEventListener('slidesLoaded', bootstrap);
  window.addEventListener('componentsLoaded', bootstrap);

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      bootstrap,
      { once: true }
    );
  } else {
    bootstrap();
  }
})();
