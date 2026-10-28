
/* Ewano B2B — Interactive PWA demo */
(function () {
  'use strict';

  let initialized = false;
  let previousScreen = 'ph-home';

  function initDemo() {
    if (initialized) return;

    const demoTabs = document.querySelectorAll('.demo-tab');

    if (!demoTabs.length) return;

    initialized = true;

    function showPhoneScreen(id) {
      if (!document.getElementById(id)) return;

      const currentScreen = document.querySelector('.ph-screen.active');

      if (currentScreen && currentScreen.id !== id) {
        previousScreen = currentScreen.id;
      }

      demoTabs.forEach(tab => {
        tab.classList.toggle(
          'active',
          tab.dataset.screen === id
        );
      });

      document.querySelectorAll('.ph-screen').forEach(screen => {
        screen.classList.toggle('active', screen.id === id);
      });
    }

    window.showPhoneScreen = showPhoneScreen;

    window.phoneBack = function () {
      showPhoneScreen(previousScreen);
    };

    demoTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        showPhoneScreen(tab.dataset.screen);
      });
    });

    document.querySelectorAll('.ph-nav a[data-tab]').forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        showPhoneScreen(link.dataset.tab);
      });
    });
  }

  window.addEventListener('slidesLoaded', initDemo);

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      initDemo,
      { once: true }
    );
  } else {
    initDemo();
  }
})();
