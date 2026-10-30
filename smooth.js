/* Smooth wheel scrolling (Lenis). Skipped for reduced-motion users; touch devices keep native scrolling. */
(function () {
  if (!window.Lenis) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.matchMedia("(pointer: coarse)").matches) return;

  var lenis = new window.Lenis({ lerp: 0.1, wheelMultiplier: 0.9, smoothWheel: true, anchors: true });
  window.__lenis = lenis;
  function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  // stop smoothing while the menu is open, resume when it closes
  var body = document.body;
  new MutationObserver(function () {
    if (body.classList.contains("menu-open")) lenis.stop(); else lenis.start();
  }).observe(body, { attributes: true, attributeFilter: ["class"] });

  // scrollable panels keep their own native scrolling
  document.querySelectorAll(".mobile-menu, .mega, .drawer, textarea, select").forEach(function (el) { el.setAttribute("data-lenis-prevent", ""); });
})();
