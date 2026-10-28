
/* EWANO B2B — Components Loader */
(function () {
  'use strict';

  const COMPONENTS = [
    { file: 'header.html', target: '#headerSlot' },
    { file: 'footer.html', target: '#footerSlot' },
    { file: 'drawer.html', target: '#drawerSlot' }
  ];

  async function loadComponent({ file, target }) {
    try {
      const response = await fetch('components/' + file);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();
      const element = document.querySelector(target);

      if (element) {
        element.innerHTML = html;
      }
    } catch (error) {
      console.error(
        `[ComponentsLoader] خطا در بارگذاری ${file}:`,
        error
      );
    }
  }

  async function initComponents() {
    await Promise.all(COMPONENTS.map(loadComponent));

    console.log('Header, Footer, Drawer بارگذاری شدند.');
    window.dispatchEvent(new Event('componentsLoaded'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      initComponents,
      { once: true }
    );
  } else {
    initComponents();
  }
})();
