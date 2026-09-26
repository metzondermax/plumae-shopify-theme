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
