(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const seen = new WeakSet();
  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('plumae-reveal--pending');
        entry.target.classList.add('plumae-reveal--visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px 40px 0px' })
    : null;

  function init(root = document) {
    root.querySelectorAll('.plumae-reveal').forEach((el) => {
      if (seen.has(el)) return;
      seen.add(el);
      if (!observer || el.getBoundingClientRect().top < window.innerHeight) {
        el.classList.add('plumae-reveal--visible');
      } else {
        el.classList.add('plumae-reveal--pending');
        observer.observe(el);
      }
    });
  }
  init();
  document.addEventListener('shopify:section:load', (event) => init(event.target));
})();

(() => {
  const menu = document.querySelector('.pl-redesign-header__menu');
  if (!menu) return;
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      menu.querySelector('summary')?.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });
})();

(() => {
  function init(root = document) {
    root.querySelectorAll('.pl-product-reviews').forEach((section) => {
      if (section.dataset.reviewsInitialized) return;
      const items = [...section.querySelectorAll('[data-pl-review-item]')];
      const previous = section.querySelector('[data-pl-reviews-previous]');
      const next = section.querySelector('[data-pl-reviews-next]');
      const indicator = section.querySelector('[data-pl-reviews-page]');
      if (!previous || !next || !indicator || items.length <= 3) return;
      section.dataset.reviewsInitialized = 'true';
      const total = Math.ceil(items.length / 3);
      let page = 0;
      function showPage(index) {
        page = Math.max(0, Math.min(index, total - 1));
        items.forEach((item, position) => { item.hidden = Math.floor(position / 3) !== page; });
        indicator.textContent = `${page + 1} / ${total}`;
        previous.disabled = page === 0;
        next.disabled = page === total - 1;
      }
      previous.addEventListener('click', () => showPage(page - 1));
      next.addEventListener('click', () => showPage(page + 1));
      section.addEventListener('shopify:block:select', (event) => {
        const index = items.findIndex((item) => item === event.target || item.contains(event.target));
        if (index >= 0) showPage(Math.floor(index / 3));
      });
      showPage(0);
      section.classList.add('pl-product-reviews--ready');
    });
  }
  init();
  document.addEventListener('shopify:section:load', (event) => init(event.target));
})();

(() => {
  const start = Date.parse('2026-10-19T07:00:00Z'); // 19 okt 09:00 Europe/Amsterdam
  const end = Date.parse('2026-10-25T20:00:00Z');   // 25 okt 21:00 Europe/Amsterdam (wintertijd)
  function updateOffers(root = document) {
    const active = Boolean(window.Shopify?.designMode) || (Date.now() >= start && Date.now() < end);
    root.querySelectorAll('[data-pl-shipping-offer]').forEach((offer) => {
      offer.hidden = !active;
    });
    root.querySelectorAll('[data-pl-shipping-default]').forEach((defaultMessage) => {
      defaultMessage.hidden = active;
    });
  }
  updateOffers();
  document.addEventListener('shopify:section:load', (event) => updateOffers(event.target));
  window.setInterval(updateOffers, 60000);
})();
