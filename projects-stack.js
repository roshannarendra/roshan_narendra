/* Home "Our Projects": the title and the first card stop in the middle of the screen, card 2 then card 3 stack
   in underneath, and then the whole group scrolls away together. Scroll position drives it; no layout of other sections is touched. */
(function () {
  var sec = document.querySelector("#projects");
  if (!sec) return;
  var title = sec.querySelector(".projects-title");
  var list = sec.querySelector(".projects-list");
  var cards = list ? Array.prototype.slice.call(list.querySelectorAll(".project-card")) : [];
  if (!title || cards.length < 2) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // wrap the title and the list so they can be pinned and centred as one block
  var stage = document.createElement("div"); stage.className = "projects-stage";
  var inner = document.createElement("div"); inner.className = "projects-inner";
  sec.insertBefore(stage, title);
  stage.appendChild(inner);
  inner.appendChild(title);
  inner.appendChild(list);
  sec.classList.add("is-stack");

  var N = cards.length, vh = 0, step = 0, hold = 0, total = 0, secTop = 0, scale = 1, travel = 0, ticking = false;
  var TOP_SAFE = 92, BOTTOM_SAFE = 24;                       // room for the fixed header, and a little air below

  function ease(t) { return 1 - Math.pow(1 - t, 3); }

  function measure() {
    vh = window.innerHeight;
    var maxH = 0;
    cards.forEach(function (c, i) {
      c.style.setProperty("--n", i);
      Array.prototype.forEach.call(c.querySelectorAll(".project-img"), function (im) { im.style.aspectRatio = ""; im.style.height = ""; });
      maxH = Math.max(maxH, c.offsetHeight);
    });
    // every card ends at the same height, so a later card fully covers the one under it (only its top edge stays visible)
    cards.forEach(function (c) {
      var d = maxH - c.offsetHeight;
      if (d < 1) return;
      var imgs = c.querySelectorAll(".project-img"), base = imgs[0] ? imgs[0].offsetHeight : 0;
      Array.prototype.forEach.call(imgs, function (im) { im.style.aspectRatio = "auto"; im.style.height = (base + d) + "px"; });
    });
    var peek = maxH * 0.1;
    list.style.setProperty("--peek", peek + "px");
    list.style.height = (maxH + (N - 1) * peek) + "px";
    var blockH = title.offsetHeight + parseFloat(getComputedStyle(title).marginBottom || 0) + list.offsetHeight;
    scale = Math.min(1, (vh - TOP_SAFE - BOTTOM_SAFE) / blockH);
    inner.style.transform = scale < 1 ? "scale(" + scale.toFixed(4) + ")" : "";
    stage.style.height = vh + "px";
    step = vh * 0.75;                                         // scroll distance each extra card takes to arrive
    hold = vh * 0.3;                                          // a short pause on the finished stack
    total = (N - 1) * step + hold;
    sec.style.height = (vh + total) + "px";
    travel = vh;                                              // arriving cards start fully below the stage
    secTop = sec.getBoundingClientRect().top + window.pageYOffset;
    update();
  }

  function update() {
    ticking = false;
    var s = Math.max(0, Math.min(total, window.pageYOffset - secTop));
    cards.forEach(function (c, i) {
      if (i === 0) { c.style.transform = ""; return; }
      var q = Math.max(0, Math.min(1, (s - (i - 1) * step) / step));
      c.style.transform = q >= 1 ? "" : "translateY(" + ((1 - ease(q)) * travel).toFixed(1) + "px)";
    });
  }

  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", measure);
  window.addEventListener("load", measure);
  if ("ResizeObserver" in window) new ResizeObserver(function () { measure(); }).observe(cards[0]);
  measure();
})();
