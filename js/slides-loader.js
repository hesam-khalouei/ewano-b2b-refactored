
/* EWANO B2B — Slides Loader */
(function () {
  'use strict';

  const MANIFEST_PATH = 'data/slides.json';
  const BASE_PATH = 'slides/';
  const container = document.getElementById('stageContainer');

  async function loadSlide(file) {
    try {
      const response = await fetch(BASE_PATH + file);

      if (!response.ok) {
        throw new Error(`فایل ${file} پیدا نشد.`);
      }

      return await response.text();
    } catch (error) {
      console.error(
        `[SlidesLoader] خطا در بارگذاری ${file}:`,
        error
      );

      return `
        <div class="glass-card" role="alert"
          style="padding:40px;text-align:center;color:#F16273;">
          <h3>خطا در بارگذاری اسلاید</h3>
          <p>${file}</p>
        </div>
      `;
    }
  }

  async function initSlides() {
    if (!container) return;

    try {
      const response = await fetch(MANIFEST_PATH);

      if (!response.ok) {
        throw new Error(
          `فایل manifest پیدا نشد: ${MANIFEST_PATH}`
        );
      }

      const manifest = await response.json();
      const slideFiles = manifest.slides;

      if (!Array.isArray(slideFiles) || slideFiles.length === 0) {
        throw new Error(
          'فهرست اسلایدها در data/slides.json معتبر نیست.'
        );
      }

      const results = await Promise.all(
        slideFiles.map(loadSlide)
      );

      container.innerHTML = results.join('');

      const firstSlide = container.querySelector('.slide');

      if (firstSlide) {
        firstSlide.classList.add('active');
      }

      console.info(
        `[SlidesLoader] ${slideFiles.length} اسلاید پردازش شد.`
      );

      window.dispatchEvent(new Event('slidesLoaded'));
    } catch (error) {
      console.error(
        '[SlidesLoader] راه‌اندازی اسلایدها ناموفق بود:',
        error
      );

      container.innerHTML = `
        <div class="glass-card" role="alert"
          style="padding:40px;text-align:center;">
          <h2>بارگذاری ارائه ناموفق بود</h2>
          <p>
            مطمئن شوید پروژه از طریق یک سرور محلی اجرا شده
            و فایل data/slides.json در دسترس است.
          </p>
        </div>
      `;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      initSlides,
      { once: true }
    );
  } else {
    initSlides();
  }
})();
