/* Draggable reel carousel for the home hero. Uses the site's own videos and posters; clicking a card opens the shared player. */
(function () {
  var stage = document.querySelector(".rm-carousel");
  if (!stage) return;

  var REELS = [
    ["assets/work/3d-motion/scene-04-animation", "3D scene animation", 11],
    ["assets/work/2d-motion/reel3-0", "Reel", 10],
    ["assets/work/2d-motion/perf-binate-reel-2", "Brand reel", 11],
    ["assets/work/2d-motion/indoor-render1", "Product render", 18],
    ["assets/work/2d-motion/outdoor-hand-bags1", "Handbag film", 23],
    ["assets/work/2d-motion/ai-women-sneaker-tiramisu-gif1", "Sneaker loop", 9],
    ["assets/work/2d-motion/outdoor-men-loafers-pool-video", "Lifestyle film", 12],
    ["assets/work/2d-motion/ai-blue-berry-gif1", "Social loop", 11],
    ["assets/work/2d-motion/ai-women-sneaker-lemon-gif-reel-size", "Sneaker reel", 8],
    ["assets/work/2d-motion/ai-grid-video", "Grid motion", 10]
  ];
  var N = REELS.length, PITCH = 196, LOOP = N * PITCH, SPEED = 50, RATIO = 540 / 960;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mobile = window.matchMedia("(max-width:820px)");
  var f = function (n) { return n.toFixed(1); };
  var fmt = function (s) { return Math.floor(s / 60) + ":" + (s % 60 < 10 ? "0" : "") + (s % 60); };
  var PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.2 5.2 19.8 12 8.2 18.8Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>';

  function roundedPath(p, r) {
    var d = "";
    for (var i = 0; i < p.length; i++) {
      var c = p[i], a = p[(i + p.length - 1) % p.length], b = p[(i + 1) % p.length];
      var v1 = [a[0] - c[0], a[1] - c[1]], v2 = [b[0] - c[0], b[1] - c[1]];
      var l1 = Math.hypot(v1[0], v1[1]), l2 = Math.hypot(v2[0], v2[1]), rr = Math.min(r, l1 / 2, l2 / 2);
      d += (i ? "L" : "M") + f(c[0] + v1[0] / l1 * rr) + " " + f(c[1] + v1[1] / l1 * rr) +
           "Q" + f(c[0]) + " " + f(c[1]) + " " + f(c[0] + v2[0] / l2 * rr) + " " + f(c[1] + v2[1] / l2 * rr);
    }
    return d + "Z";
  }

  var cards = REELS.map(function (r, i) {
    var el = document.createElement("div");
    el.className = "rm-card";
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", "Play " + r[1]);
    var vid = document.createElement("div");
    vid.className = "rm-vid";
    var img = document.createElement("img");
    img.className = "rm-poster";
    img.alt = "";
    img.decoding = "async";
    img.src = r[0] + "-poster.webp";
    vid.appendChild(img);
    var video = null;
    if (!reduce) {
      video = document.createElement("video");
      video.muted = true; video.loop = true; video.playsInline = true; video.preload = "none";
      video.setAttribute("muted", ""); video.setAttribute("playsinline", "");
      video.addEventListener("playing", function () { video.classList.add("on"); });
      vid.appendChild(video);
    }
    var pill = document.createElement("span");
    pill.className = "rm-pill";
    pill.setAttribute("aria-hidden", "true");
    pill.innerHTML = PLAY + "<b>" + fmt(r[2]) + "</b>";
    el.appendChild(vid); el.appendChild(pill);
    stage.appendChild(el);
    return { el: el, vid: vid, video: video, pill: pill, src: r[0] + ".mp4", poster: r[0] + "-poster.webp", title: r[1], vis: false, t: 0 };
  });

  var geo, pos = 0, vel = 0, dragging = false, running = false;
  function measure() {
    var w = stage.clientWidth, h = stage.clientHeight;
    geo = mobile.matches ? { k: w / 640, cx: 320, norm: 314, cy0: h / 2 / (w / 640) } : { k: w / 1440, cx: 720, norm: 706, cy0: 247 };
  }
  function draw() {
    var k = geo.k, cx = geo.cx, norm = geo.norm, cy0 = geo.cy0, sw = stage.clientWidth;
    cards.forEach(function (c, i) {
      var t = ((((i * PITCH - pos) % LOOP) + LOOP + LOOP / 2) % LOOP) - LOOP / 2;
      c.t = t;
      var x = cx + t * (1 + 0.083 * Math.pow(t / norm, 2));
      var d = Math.abs(x - cx) / norm;
      var w = 170 + 48 * d * d, xl = x - w / 2, xr = x + w / 2;
      c.vis = xr * k > -8 && xl * k < sw + 8;
      if (!c.vis) { c.el.style.visibility = "hidden"; return; }
      c.el.style.visibility = "visible";
      var hl = 280 + 92 * Math.pow(Math.abs(xl - cx) / norm, 2.6);
      var hr = 280 + 92 * Math.pow(Math.abs(xr - cx) / norm, 2.6);
      var cy = cy0 - 12 * d * d, H = Math.max(hl, hr);
      var pw = w * k, ph = H * k, hlp = hl * k, hrp = hr * k;
      var pts = [[0, (ph - hlp) / 2], [pw, (ph - hrp) / 2], [pw, (ph + hrp) / 2], [0, (ph + hlp) / 2]];
      var s = c.el.style;
      s.width = f(pw) + "px"; s.height = f(ph) + "px";
      s.transform = "translate(" + f(xl * k) + "px," + f((cy - H / 2) * k) + "px)";
      s.clipPath = "path('" + roundedPath(pts, 15 * k) + "')";
      var th = Math.max(ph, pw / RATIO), tw = th * RATIO;
      c.vid.style.width = f(tw) + "px"; c.vid.style.height = f(th) + "px";
      c.vid.style.transform = "translate(" + f((pw - tw) / 2) + "px," + f((ph - th) / 2) + "px)";
      c.pill.style.transform = "translate(" + f(10 * k + 6) + "px," + f((ph + hlp) / 2 - 30 - 10 * k - 6) + "px)";
    });
  }

  // videos: load and play only the cards on screen, and only while the carousel is in view
  function syncVideos() {
    if (reduce) return;
    cards.forEach(function (c) {
      var v = c.video; if (!v) return;
      if (running && c.vis) {
        if (!v.getAttribute("src")) v.src = c.src;
        var p = v.play(); if (p && p.catch) p.catch(function () {});
      } else if (!v.paused) v.pause();
    });
  }

  var last = performance.now();
  function tick(now) {
    if (!running) return;
    var dt = Math.min(0.1, (now - last) / 1000); last = now;
    if (!dragging && !reduce) {
      pos += (SPEED + vel) * dt;
      vel *= Math.pow(0.05, dt);
      if (Math.abs(vel) < 0.5) vel = 0;
    }
    draw();
    requestAnimationFrame(tick);
  }
  function start() { if (running) return; running = true; last = performance.now(); requestAnimationFrame(tick); syncVideos(); }
  function stop() { running = false; syncVideos(); }

  measure(); draw();
  new ResizeObserver(function () { measure(); draw(); }).observe(stage);
  if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { en[0].isIntersecting && !document.hidden ? start() : stop(); }, { threshold: 0.15 }).observe(stage);
  else start();
  document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); else if (stage.getBoundingClientRect().bottom > 0) start(); });
  if (!reduce) setInterval(syncVideos, 500);

  // drag / fling, tap to open
  var lastX = 0, lastT = 0, downX = 0, downY = 0, moved = 0, downCard = null;
  stage.addEventListener("pointerdown", function (e) {
    dragging = true; vel = 0; lastX = downX = e.clientX; downY = e.clientY; lastT = performance.now(); moved = 0;
    var el = e.target.closest && e.target.closest(".rm-card");
    downCard = el ? cards.filter(function (c) { return c.el === el; })[0] : null;
    stage.classList.add("rm-drag");
    try { stage.setPointerCapture(e.pointerId); } catch (x) {}
  });
  stage.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    var t = performance.now(), dx = e.clientX - lastX, dts = Math.max(0.001, (t - lastT) / 1000);
    moved = Math.max(moved, Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY));
    pos -= dx / geo.k;
    vel = vel * 0.5 + (-dx / geo.k / dts - SPEED) * 0.5;
    lastX = e.clientX; lastT = t;
    if (!running) draw();
  });
  function end() {
    if (!dragging) return;
    dragging = false; stage.classList.remove("rm-drag");
    if (performance.now() - lastT > 100) vel = 0;
    if (moved < 7 && downCard && window.__openVideo) window.__openVideo(downCard.src, downCard.poster, downCard.title);
    downCard = null;
  }
  stage.addEventListener("pointerup", end);
  stage.addEventListener("pointercancel", function () { moved = 99; end(); });

  // keyboard: arrows move, Enter plays the centre card
  stage.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { pos += PITCH; vel = 0; draw(); e.preventDefault(); }
    else if (e.key === "ArrowLeft") { pos -= PITCH; vel = 0; draw(); e.preventDefault(); }
    else if (e.key === "Enter" || e.key === " ") {
      var best = cards.slice().sort(function (a, b) { return Math.abs(a.t) - Math.abs(b.t); })[0];
      if (best && window.__openVideo) { window.__openVideo(best.src, best.poster, best.title); e.preventDefault(); }
    }
  });
})();
