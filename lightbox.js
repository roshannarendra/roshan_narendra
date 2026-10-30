/* Video lightbox: click a project video to open it large in the middle of the screen with full controls. */
(function () {
  var tiles = document.querySelectorAll(".projects .project-img, .si-pic");

  var ICON = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.2 5.2 19.8 12 8.2 18.8Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/></svg>',
    vol: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5h3.5l4.5 3.8V5.7L7.5 9.5H4Z"/><path class="w" d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    mute: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5h3.5l4.5 3.8V5.7L7.5 9.5H4Z"/><path d="m16 9.5 5 5m0-5-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    full: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    exit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>'
  };

  var root, stage, vid, bigBtn, playBtn, seek, cur, dur, muteBtn, fsBtn, closeBtn, hideTimer, lastFocus, seeking = false;

  function fmt(s) {
    if (!isFinite(s)) return "0:00";
    var m = Math.floor(s / 60), r = Math.floor(s % 60);
    return m + ":" + (r < 10 ? "0" : "") + r;
  }

  function build() {
    root = document.createElement("div");
    root.className = "vlb";
    root.hidden = true;
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-label", "Video player");
    root.innerHTML =
      '<div class="vlb-back" data-close></div>' +
      '<div class="vlb-stage">' +
        '<video class="vlb-video" playsinline preload="auto"></video>' +
        '<button type="button" class="vlb-big" aria-label="Play">' + ICON.play + '</button>' +
        '<button type="button" class="vlb-close" aria-label="Close video">' + ICON.close + '</button>' +
        '<div class="vlb-bar">' +
          '<button type="button" class="vlb-play" aria-label="Pause">' + ICON.pause + '</button>' +
          '<span class="vlb-time"><b class="vlb-cur">0:00</b> / <span class="vlb-dur">0:00</span></span>' +
          '<input class="vlb-seek" type="range" min="0" max="1000" value="0" step="1" aria-label="Seek">' +
          '<button type="button" class="vlb-btn vlb-mute" aria-label="Mute">' + ICON.vol + '</button>' +
          '<button type="button" class="vlb-btn vlb-fs" aria-label="Full screen">' + ICON.full + '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(root);

    stage = root.querySelector(".vlb-stage");
    vid = root.querySelector(".vlb-video");
    bigBtn = root.querySelector(".vlb-big");
    playBtn = root.querySelector(".vlb-play");
    seek = root.querySelector(".vlb-seek");
    cur = root.querySelector(".vlb-cur");
    dur = root.querySelector(".vlb-dur");
    muteBtn = root.querySelector(".vlb-mute");
    fsBtn = root.querySelector(".vlb-fs");
    closeBtn = root.querySelector(".vlb-close");

    root.addEventListener("click", function (e) { if (e.target.hasAttribute("data-close")) close(); });
    closeBtn.addEventListener("click", close);
    vid.addEventListener("click", toggle);
    bigBtn.addEventListener("click", toggle);
    playBtn.addEventListener("click", toggle);
    muteBtn.addEventListener("click", function () { vid.muted = !vid.muted; syncMute(); });
    fsBtn.addEventListener("click", toggleFs);
    vid.addEventListener("dblclick", toggleFs);

    vid.addEventListener("play", syncPlay);
    vid.addEventListener("pause", syncPlay);
    vid.addEventListener("ended", syncPlay);
    vid.addEventListener("loadedmetadata", function () { dur.textContent = fmt(vid.duration); });
    vid.addEventListener("timeupdate", function () {
      if (seeking) return;
      cur.textContent = fmt(vid.currentTime);
      seek.value = vid.duration ? Math.round(vid.currentTime / vid.duration * 1000) : 0;
      paintSeek();
    });
    seek.addEventListener("input", function () {
      seeking = true;
      if (vid.duration) { vid.currentTime = seek.value / 1000 * vid.duration; cur.textContent = fmt(vid.currentTime); }
      paintSeek();
    });
    seek.addEventListener("change", function () { seeking = false; });
    seek.addEventListener("pointerup", function () { seeking = false; });

    ["fullscreenchange", "webkitfullscreenchange"].forEach(function (ev) {
      document.addEventListener(ev, function () {
        var on = !!nativeFs();
        setFsIcon(on || stage.classList.contains("is-max"));
        stage.classList.toggle("is-fs", on);
      });
    });

    stage.addEventListener("pointermove", wake);
    stage.addEventListener("pointerdown", wake);
    document.addEventListener("keydown", onKey);
  }

  function paintSeek() { seek.style.setProperty("--p", (seek.value / 10) + "%"); }
  function syncPlay() {
    var on = !vid.paused && !vid.ended;
    playBtn.innerHTML = on ? ICON.pause : ICON.play;
    playBtn.setAttribute("aria-label", on ? "Pause" : "Play");
    bigBtn.innerHTML = ICON.play;
    stage.classList.toggle("is-paused", !on);
    if (on) wake(); else stage.classList.add("show-ui");
  }
  function syncMute() {
    muteBtn.innerHTML = vid.muted ? ICON.mute : ICON.vol;
    muteBtn.setAttribute("aria-label", vid.muted ? "Unmute" : "Mute");
  }
  function toggle() {
    if (vid.paused || vid.ended) { if (vid.ended) vid.currentTime = 0; vid.play(); } else vid.pause();
  }
  function nativeFs() { return document.fullscreenElement || document.webkitFullscreenElement; }
  function setFsIcon(on) {
    fsBtn.innerHTML = on ? ICON.exit : ICON.full;
    fsBtn.setAttribute("aria-label", on ? "Exit full screen" : "Full screen");
  }
  // stand-in full screen for browsers/webviews that refuse the real one: the player fills the window
  function setMax(on) {
    stage.classList.toggle("is-max", on);
    document.documentElement.classList.toggle("vlb-max", on);
    setFsIcon(on);
  }
  function toggleFs() {
    if (nativeFs()) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
    if (stage.classList.contains("is-max")) { setMax(false); return; }
    var req = stage.requestFullscreen || stage.webkitRequestFullscreen;
    if (req && document.fullscreenEnabled !== false) {
      var p;
      try { p = req.call(stage); } catch (e) { setMax(true); return; }
      if (p && p.catch) p.catch(function () { setMax(true); });
      setTimeout(function () { if (!nativeFs() && !stage.classList.contains("is-max") && !root.hidden) setMax(true); }, 450);
    } else if (vid.webkitEnterFullscreen && !req) {
      vid.webkitEnterFullscreen();
    } else setMax(true);
  }
  function wake() {
    stage.classList.add("show-ui");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () { if (!vid.paused) stage.classList.remove("show-ui"); }, 2600);
  }
  function onKey(e) {
    if (root.hidden) return;
    var k = e.key;
    if (k === "Escape") { if (stage.classList.contains("is-max")) setMax(false); else if (!nativeFs()) close(); }
    else if (k === " " || k === "k" || k === "K") { if (document.activeElement !== seek) { e.preventDefault(); toggle(); } }
    else if (k === "ArrowRight") { vid.currentTime = Math.min(vid.duration || 0, vid.currentTime + 5); wake(); }
    else if (k === "ArrowLeft") { vid.currentTime = Math.max(0, vid.currentTime - 5); wake(); }
    else if (k === "m" || k === "M") { vid.muted = !vid.muted; syncMute(); }
    else if (k === "f" || k === "F") { toggleFs(); }
    else if (k === "Tab") {
      var f = root.querySelectorAll("button, input");
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  function open(src, poster, label) {
    if (!root) build();
    lastFocus = document.activeElement;
    vid.poster = poster || "";
    vid.src = src;
    vid.muted = false;
    vid.setAttribute("aria-label", label || "Project video");
    seek.value = 0; paintSeek(); cur.textContent = "0:00"; dur.textContent = "0:00";
    syncMute();
    root.hidden = false;
    document.body.classList.add("vlb-open");
    if (window.__lenis) window.__lenis.stop();
    requestAnimationFrame(function () { root.classList.add("on"); });
    stage.classList.add("show-ui", "is-paused");
    var p = vid.play();
    if (p && p.catch) p.catch(function () { vid.muted = true; syncMute(); vid.play().catch(function () {}); });
    closeBtn.focus();
  }

  function close() {
    if (!root || root.hidden) return;
    if (document.fullscreenElement || document.webkitFullscreenElement) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    vid.pause();
    setMax(false);
    root.classList.remove("on");
    document.body.classList.remove("vlb-open");
    setTimeout(function () { root.hidden = true; vid.removeAttribute("src"); vid.load(); }, 220);
    if (window.__lenis) window.__lenis.start();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  Array.prototype.forEach.call(tiles, function (tile) {
    var v = tile.querySelector("video");
    if (!v) return;
    var label = (v.getAttribute("aria-label") || "Project video");
    tile.classList.add("is-playable");
    tile.setAttribute("tabindex", "0");
    tile.setAttribute("role", "button");
    tile.setAttribute("aria-label", "Open video: " + label);
    var pill = document.createElement("span");
    pill.className = "vlb-pill";
    pill.setAttribute("aria-hidden", "true");
    pill.innerHTML = ICON.play + '<b>0:00</b>';
    tile.appendChild(pill);
    function setDur() { if (isFinite(v.duration)) pill.lastChild.textContent = fmt(v.duration); }
    if (v.readyState >= 1) setDur(); else v.addEventListener("loadedmetadata", setDur);
    var snd = document.createElement("button");
    snd.type = "button";
    snd.className = "vlb-snd";
    snd.setAttribute("aria-label", "Turn sound on");
    snd.innerHTML = ICON.mute;
    snd.addEventListener("click", function (e) {
      e.stopPropagation();
      v.muted = !v.muted;
      snd.innerHTML = v.muted ? ICON.mute : ICON.vol;
      snd.setAttribute("aria-label", v.muted ? "Turn sound on" : "Turn sound off");
      if (!v.muted) Array.prototype.forEach.call(tiles, function (o) { var ov = o.querySelector("video"); if (ov && ov !== v) { ov.muted = true; var b = o.querySelector(".vlb-snd"); if (b) b.innerHTML = ICON.mute; } });
    });
    snd.addEventListener("keydown", function (e) { e.stopPropagation(); });
    tile.appendChild(snd);
    function go() { v.muted = true; snd.innerHTML = ICON.mute; open(v.getAttribute("src") || v.currentSrc, v.getAttribute("poster"), label); }
    tile.addEventListener("click", go);
    tile.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
  });

  // gallery and service-page work tiles (built by pages.js) open in the same player
  document.addEventListener("click", function (e) {
    if (e.target.closest(".w-sound, .g-snd")) return;
    var t = e.target.closest(".w-video, .g-item.is-video");
    if (!t) return;
    var src, poster, label = t.getAttribute("aria-label") || "Video";
    var v = t.querySelector("video");
    if (v) { src = v.getAttribute("data-src") || v.getAttribute("src"); poster = v.getAttribute("poster"); }
    else { var im = t.querySelector("img"); poster = im && im.getAttribute("src"); src = poster && poster.replace(/-poster.webp$/, ".mp4"); }
    if (!src) return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    label = label.replace(/^Play /, "");
    open(src, poster, label);
  }, true);
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    var t = document.activeElement;
    if (t && t.matches && t.matches(".w-video, .g-item.is-video")) { e.preventDefault(); t.click(); }
  }, true);
})();
