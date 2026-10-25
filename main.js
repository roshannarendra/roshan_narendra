(function () {
  // Mobile menu
  var burger = document.querySelector(".burger");
  var menu = document.getElementById("mobile-menu");
  var overlay = document.querySelector(".overlay");

  function setMenu(open) {
    if (!burger) return;
    burger.setAttribute("aria-expanded", String(open));
    menu.hidden = !open;
    overlay.hidden = !open;
    document.body.classList.toggle("menu-open", open);
  }

  if (burger) {
    burger.addEventListener("click", function () {
      setMenu(burger.getAttribute("aria-expanded") !== "true");
    });
    overlay.addEventListener("click", function () { setMenu(false); });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 960) setMenu(false);
  });

  // Count-up stats
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var values = document.querySelectorAll(".stat-value");
  var stats = document.querySelector(".stats");

  function format(el, v) {
    var d = parseInt(el.dataset.decimals, 10) || 0;
    return v.toFixed(d) + (el.dataset.suffix || "");
  }

  function run() {
    values.forEach(function (el, i) {
      var target = parseFloat(el.dataset.target);
      if (reduced) { el.textContent = format(el, target); return; }
      var duration = 1500 + i * 80;
      var delay = 480 + i * 90;
      setTimeout(function () {
        var start = performance.now();
        function tick(now) {
          var t = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(1 - t, 3);
          el.textContent = format(el, target * eased);
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }, delay);
    });
  }

  if (!stats) {
    /* no hero stats on this page */
  } else if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { io.disconnect(); run(); }
    }, { threshold: 0.25 });
    io.observe(stats);
  } else {
    run();
  }
})();

// Footer watermark: fit viewBox to rendered glyph bounds
function fitWatermark() {
  var svg = document.getElementById("watermarkSvg");
  var text = document.getElementById("watermarkText");
  if (!svg || !text) return;
  try {
    var b = text.getBBox();
    svg.setAttribute("viewBox", b.x + " " + b.y + " " + b.width + " " + b.height);
    // only 87% of the brand name shows: the page edge crops the bottom 13%
    var box = svg.parentNode; if (box) box.style.marginBottom = (-0.13 * svg.getBoundingClientRect().height).toFixed(1) + "px";
  } catch (e) {}
}
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(fitWatermark);
} else {
  window.addEventListener("load", fitWatermark);
}
window.addEventListener("resize", fitWatermark);

// Scroll reveal for Our Projects
(function () {
  var els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.15 });
  els.forEach(function (e) { io.observe(e); });
})();

// Stacked project cards: each next card covers 90% of the previous one
(function () {
  var list = document.querySelector(".projects-list");
  var card = document.querySelector(".project-card");
  if (!list || !card) return;
  function setPeek() { list.style.setProperty("--peek", card.offsetHeight * 0.1 + "px"); }
  setPeek();
  window.addEventListener("resize", setPeek);
  window.addEventListener("load", setPeek);
})();

// Newsletter signup (footer on every page). No backend: validates, saves locally, confirms.
(function () {
  var form = document.getElementById("subscribeForm");
  var msg = document.getElementById("subscribeMsg");
  if (!form) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var input = form.querySelector("input[type=email]");
    var v = input.value.trim();
    var ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    msg.className = "subscribe-msg " + (ok ? "ok" : "err");
    if (!ok) { msg.textContent = "Please enter a valid email address."; input.focus(); return; }
    try {
      var list = JSON.parse(localStorage.getItem("rn_subscribers") || "[]");
      if (list.indexOf(v) === -1) list.push(v);
      localStorage.setItem("rn_subscribers", JSON.stringify(list));
    } catch (err) {}
    msg.textContent = "You're in! Thanks for subscribing.";
    input.value = "";
  });
})();

// Respect "Reduce Motion": stop the looping background videos
(function () {
  var mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  function apply() {
    document.querySelectorAll("video").forEach(function (v) {
      if (mq.matches) { v.removeAttribute("autoplay"); v.pause(); } else { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    });
  }
  apply();
  if (mq.addEventListener) mq.addEventListener("change", apply);
})();

// Count-up stats: real numbers live in the HTML; the animation starts from zero only when JS runs
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll(".stat-value").forEach(function (el) {
    el.textContent = (0).toFixed(parseInt(el.dataset.decimals, 10) || 0) + (el.dataset.suffix || "");
  });
})();

// Long headings read better in the text face; keep the pixel face for short lines (4 words or fewer)
(function () {
  document.querySelectorAll(".section-title, .page-hero h1, .seo-home h2").forEach(function (h) {
    if (h.textContent.trim().split(/\s+/).length > 4) h.classList.add("sans-head");
  });
})();

// Header: add a backdrop once the page scrolls
(function () {
  function onScroll() { document.body.classList.toggle("scrolled", window.scrollY > 8); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();

// Services submenu: desktop toggle (touch/keyboard) + mobile accordion
(function () {
  var items = document.querySelectorAll(".nav-item");
  function closeAll(except) {
    items.forEach(function (it) {
      if (it !== except) { it.classList.remove("open"); var b = it.querySelector(".sub-toggle"); if (b) b.setAttribute("aria-expanded", "false"); }
    });
  }
  items.forEach(function (it) {
    var b = it.querySelector(".sub-toggle");
    if (!b) return;
    b.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = !it.classList.contains("open");
      closeAll(it);
      it.classList.toggle("open", open);
      b.setAttribute("aria-expanded", String(open));
    });
  });
  document.addEventListener("click", function (e) { if (!e.target.closest(".nav-item")) closeAll(null); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(null); });

  // Mobile menu: the "Services" word and the arrow both open / close the sub-menu (no page jump).
  // Visitors still reach the services page through "View all services" inside the sub-menu.
  document.querySelectorAll(".m-item").forEach(function (it) {
    var link = it.querySelector(".m-row > a"), btn = it.querySelector(".m-toggle");
    if (!link || !btn) return;
    function toggle() {
      var open = !it.classList.contains("open");
      it.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
      link.setAttribute("aria-expanded", String(open));
    }
    link.setAttribute("role", "button");
    link.setAttribute("aria-expanded", "false");
    link.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); toggle(); });
    btn.addEventListener("click", toggle);
  });
})();

// Drawer close button
(function () {
  var burger = document.querySelector(".burger");
  document.querySelectorAll(".drawer-close").forEach(function (b) {
    b.addEventListener("click", function () { if (burger) burger.click(); burger && burger.focus(); });
  });
})();

// Navigation: skip link, sliding highlight, smart header, progress bar, services menu, drawer
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var header = $(".header");
  var pill = $(".nav-pill");

  /* ---- skip link ---- */
  var main = $("main");
  if (main) {
    if (!main.id) main.id = "main";
    var skip = document.createElement("a");
    skip.className = "skip-link"; skip.href = "#" + main.id; skip.textContent = "Skip to content";
    document.body.insertBefore(skip, document.body.firstChild);
  }

  /* ---- sliding highlight ---- */
  if (pill) {
    var glow = document.createElement("span");
    glow.className = "nav-glow"; glow.setAttribute("aria-hidden", "true");
    pill.insertBefore(glow, pill.firstChild);
    var links = $$(":scope > a, :scope > .nav-item > a", pill);
    var activeLink = links.filter(function (a) { return a.classList.contains("active"); })[0] || null;
    function moveTo(a, isActive) {
      if (!a) { glow.classList.remove("on"); return; }
      var p = header.getBoundingClientRect(), r = a.getBoundingClientRect();
      glow.style.left = (r.left - p.left) + "px";
      glow.style.width = r.width + "px";
      glow.classList.add("moving"); clearTimeout(glow._t); glow._t = setTimeout(function () { glow.classList.remove("moving"); }, 220);
      glow.classList.add("on");
      glow.classList.toggle("active", !!isActive);
    }
    links.forEach(function (a) {
      a.addEventListener("mouseenter", function () { moveTo(a, a === activeLink); });
      a.addEventListener("focus", function () { moveTo(a, a === activeLink); });
    });
    pill.addEventListener("mouseleave", function () { moveTo(activeLink, true); });
    pill.addEventListener("focusout", function (e) { if (!pill.contains(e.relatedTarget)) moveTo(activeLink, true); });
    window.addEventListener("resize", function () { moveTo(activeLink, true); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { moveTo(activeLink, true); });
    moveTo(activeLink, true);
  }

  /* ---- smart header + reading progress ---- */
  var bar = document.createElement("div");
  bar.className = "scroll-progress"; bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);
  var lastY = window.scrollY, ticking = false, docH = 0;
  function measure() { docH = document.documentElement.scrollHeight - window.innerHeight; }
  measure(); window.addEventListener("resize", measure); window.addEventListener("load", measure);
  if ("ResizeObserver" in window) new ResizeObserver(measure).observe(document.body);
  function menuOpen() { return document.body.classList.contains("menu-open") || !!$(".nav-item.open"); }
  function update() {
    var y = window.scrollY, h = docH;
    bar.style.transform = "scaleX(" + (h > 0 ? Math.min(y / h, 1) : 0) + ")";
    if (!reduced) {
      if (menuOpen() || y < 120) document.body.classList.remove("nav-hidden");
      else if (y > lastY + 6) document.body.classList.add("nav-hidden");
      else if (y < lastY - 6) document.body.classList.remove("nav-hidden");
    }
    lastY = y; ticking = false;
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  // keyboard users: never leave focus on a hidden header
  document.addEventListener("focusin", function (e) { if (e.target.closest && e.target.closest(".header")) document.body.classList.remove("nav-hidden"); });
  update();

  /* ---- services submenu: hover intent + arrow keys ---- */
  $$(".nav-item").forEach(function (item) {
    var toggle = $(".sub-toggle", item), link = $(":scope > a", item), sub = $(".submenu", item);
    if (!toggle || !sub) return;
    var items = $$("a", sub), t;
    function open(focusFirst) {
      clearTimeout(t); item.classList.add("open"); toggle.setAttribute("aria-expanded", "true");
      if (focusFirst) items[0].focus();
    }
    function close(refocus) {
      clearTimeout(t); item.classList.remove("open"); toggle.setAttribute("aria-expanded", "false");
      if (refocus) toggle.focus();
    }
    item.addEventListener("mouseenter", function () { clearTimeout(t); t = setTimeout(function () { open(false); }, 70); });
    item.addEventListener("mouseleave", function () { clearTimeout(t); t = setTimeout(function () { close(false); }, 180); });
    [link, toggle].forEach(function (el) {
      el.addEventListener("keydown", function (e) {
        if (e.key === "ArrowDown") { e.preventDefault(); open(true); }
      });
    });
    sub.addEventListener("keydown", function (e) {
      var i = items.indexOf(document.activeElement);
      if (e.key === "ArrowDown") { e.preventDefault(); items[(i + 1) % items.length].focus(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
      else if (e.key === "Home") { e.preventDefault(); items[0].focus(); }
      else if (e.key === "End") { e.preventDefault(); items[items.length - 1].focus(); }
      else if (e.key === "Escape") { e.stopPropagation(); close(true); }
      else if (e.key === "Tab") { close(false); }
    });
  });

  /* ---- prefetch pages on hover / touch so navigation feels instant ---- */
  var done = {};
  function prefetch(a) {
    var href = a.getAttribute("href");
    if (!href || href.charAt(0) === "#" || /^(https?:|mailto:|tel:)/.test(href) || done[href]) return;
    done[href] = 1;
    var l = document.createElement("link"); l.rel = "prefetch"; l.href = href; document.head.appendChild(l);
  }
  document.addEventListener("mouseover", function (e) { var a = e.target.closest && e.target.closest("a"); if (a && (a.closest(".header") || a.closest(".footer-col"))) prefetch(a); });
  document.addEventListener("touchstart", function (e) { var a = e.target.closest && e.target.closest("a"); if (a) prefetch(a); }, { passive: true });

  /* ---- drawer: focus handling, tab trap, swipe to close ---- */
  var drawer = $("#mobile-menu"), burger = $(".burger");
  if (drawer && burger) {
    new MutationObserver(function () {
      if (!drawer.hidden) { var c = $(".drawer-close", drawer); if (c) c.focus(); }
    }).observe(drawer, { attributes: true, attributeFilter: ["hidden"] });
    drawer.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      var f = $$("a, button", drawer).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    var sx = null;
    drawer.addEventListener("touchstart", function (e) { sx = drawer.scrollTop <= 0 ? e.touches[0].clientY : null; }, { passive: true });
    drawer.addEventListener("touchend", function (e) {
      if (sx !== null && e.changedTouches[0].clientY - sx > 90) burger.click();
      sx = null;
    }, { passive: true });
  }
})();

// Header clock (Gurgaon / India Standard Time)
(function () {
  var els = document.querySelectorAll("[data-clock]");
  if (!els.length) return;
  function fmt() {
    return new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false });
  }
  function tick() { var t = fmt(); els.forEach(function (e) { e.textContent = t; }); }
  tick();
  setInterval(tick, 1000);
})();

/* services hub: lazy looping film previews */
(function () {
  var vis = document.querySelectorAll(".svc-vis[data-vid]");
  if (!vis.length) return;
  var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  vis.forEach(function (a) {
    var v = document.createElement("video");
    v.muted = true; v.loop = true; v.playsInline = true; v.preload = "none";
    v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.setAttribute("aria-hidden", "true");
    v.poster = a.getAttribute("data-poster");
    v.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:cover";
    a.insertBefore(v, a.firstChild);
  });
  if (calm || !("IntersectionObserver" in window)) return;
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var v = e.target.querySelector("video"), a = e.target;
      if (e.isIntersecting) { if (!v.src) v.src = a.getAttribute("data-vid"); var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      else v.pause();
    });
  }, { threshold: 0.3 });
  vis.forEach(function (a) { io.observe(a); });
})();

// Profile cards: the bookmark button saves a card in this browser
(function () {
  var KEY = "one47_saved", saved = [];
  try { saved = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) {}
  function nameOf(b) { var c = b.closest(".pf"), n = c && c.querySelector(".pf-name"); return n ? n.textContent.trim() : ""; }
  function paint(b, on) { b.setAttribute("aria-pressed", String(on)); var i = b.querySelector("i"); if (i) i.className = on ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark"; }
  function sync(root) { Array.prototype.forEach.call((root || document).querySelectorAll(".pf-save"), function (b) { paint(b, saved.indexOf(nameOf(b)) > -1); }); }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(".pf-save"); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    var n = nameOf(b), on = b.getAttribute("aria-pressed") !== "true";
    saved = saved.filter(function (x) { return x !== n; }); if (on) saved.push(n);
    try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (err) {}
    paint(b, on);
  });
  sync();
  window.addEventListener("load", function () { sync(); });
  window.pfSync = sync;
})();

// Videos: play only while visible, so scrolling never competes with several decoders
(function () {
  var vids = Array.prototype.slice.call(document.querySelectorAll("video[autoplay]"));
  if (!vids.length) return;
  var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  vids.forEach(function (v) { v.muted = true; v.setAttribute("playsinline", ""); });
  if (calm || !("IntersectionObserver" in window)) { vids.forEach(function (v) { v.pause(); v.removeAttribute("autoplay"); }); return; }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) { if (v.preload === "none") v.preload = "metadata"; var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      else v.pause();
    });
  }, { threshold: 0.12, rootMargin: "80px 0px" });
  vids.forEach(function (v) { v.pause(); io.observe(v); });
})();

// Service intro: the lead sentence lights up word by word as it scrolls into the reading zone
(function () {
  var lead = document.querySelector(".si-lead"); if (!lead) return;
  var text = lead.textContent.trim(), words = text.split(/\s+/);
  lead.setAttribute("aria-label", text);
  lead.innerHTML = words.map(function (w) { return '<span class="w" aria-hidden="true">' + w + "</span>"; }).join(" ");
  var spans = Array.prototype.slice.call(lead.querySelectorAll(".w"));
  var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (calm || !("IntersectionObserver" in window)) { spans.forEach(function (s) { s.classList.add("on"); }); return; }
  var live = false, tick = false;
  function paint() {
    tick = false;
    var r = lead.getBoundingClientRect(), vh = window.innerHeight;
    var p = Math.max(0, Math.min(1, (vh * 0.88 - r.top) / (r.height + vh * 0.36)));
    var n = Math.round(p * spans.length);
    for (var i = 0; i < spans.length; i++) spans[i].classList.toggle("on", i < n);
  }
  function ask() { if (live && !tick) { tick = true; requestAnimationFrame(paint); } }
  new IntersectionObserver(function (es) { live = es[0].isIntersecting; if (live) ask(); }, { rootMargin: "0px 0px 0px 0px" }).observe(lead);
  window.addEventListener("scroll", ask, { passive: true }); window.addEventListener("resize", ask);
  paint();
})();
