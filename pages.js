// Page-specific behaviour for the inner pages (case studies, about, contact).
(function () {
  var SITE = {
    email: "support@one47.online",
    whatsapp: "919220641865",   // enquiries are sent to this WhatsApp number (country code + number, no + or spaces)
    webhook: ""                 // URL of the automation (see automation/README.md). Empty = open WhatsApp with the message pre-filled.
  };

  var page = document.currentScript.getAttribute("data-page");
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* =============== Case studies =============== */
  if (page === "case-studies") {
    var IMG = function (n) { return "url(assets/img/" + n + ".jpg)"; };
    var CASES = [
      { id: "bajaj", cat: "3d-animation", title: "Bajaj Electricals", sum: "Product visualization and 3D animation campaign for one of India's largest electricals brands.", tags: ["3D Animation", "Product Viz", "Motion"], via: "Via Nova Films", img: "url(assets/work/3d-motion/bajaj-mixer-poster.webp)", video: "assets/work/3d-motion/bajaj-mixer.mp4",
        list: ["Product visualization", "3D animation campaign", "Motion graphics"] },
      { id: "honeywell", cat: "3d-animation", title: "Honeywell — Secure Connection", sum: "3D motion graphics and explainer animation for enterprise security solutions.", tags: ["3D Motion", "Explainer"], via: "", img: "url(assets/work/3d-motion/honeywell-poster.webp)", video: "assets/work/3d-motion/honeywell.mp4",
        list: ["3D motion graphics", "Explainer animations", "Complex technical ideas turned into clear visuals", "Strict brand standards followed"] },
      { id: "neofinity", cat: "3d-animation", title: "NeoFinity — Rewards & Gold", sum: "3D product animations and motion graphics for fintech and digital payment platforms.", tags: ["3D Animation", "Motion Graphics", "Fintech"], via: "", img: "url(assets/work/3d-motion/reward-final-2-0-poster.webp)", video: "assets/work/3d-motion/reward-final-2-0.mp4",
        list: ["3D product animations", "Motion graphics for websites, ads and social media", "Production-ready assets", "Consistent visual quality"] },
      { id: "moehair", cat: "3d-animation", title: "Moehair", sum: "3D product renders and animations for e-commerce marketing and product launches.", tags: ["Product Viz", "3D Animation", "E-commerce"], via: "", img: "url(assets/work/2d-motion/moehair-poster.webp)", video: "assets/work/2d-motion/moehair.mp4",
        list: ["3D product renders", "Product animations", "Visuals optimized for web and social platforms"] },
      { id: "exhibition", cat: "architectural", title: "Exhibition Stall Concepts", sum: "3D concepts and renders for exhibition stalls and stands.", tags: ["Exhibition Design", "3D Rendering"], via: "", img: "url(assets/work/stalls/aurolab-view01.webp)",
        list: ["Stall and stand 3D concepts", "Multiple camera views per design", "Marketing-ready renders"] },
      { id: "rm-homes", cat: "architectural", title: "RM Homes", sum: "Architectural 3D visualization and rendering for residential property marketing.", tags: ["Architectural Viz", "3D Rendering"], via: "Via Tecvision", img: IMG("realty"),
        list: ["Architectural 3D visualization", "Residential property rendering", "Marketing-ready visuals"] },
      { id: "beyond-realty", cat: "branding", title: "Beyond Realty", sum: "Brand identity and motion design for a premium real estate firm, including promotional visuals and social assets.", tags: ["Branding", "Motion Design"], via: "", img: IMG("architecture"),
        list: ["Brand identity", "Motion design", "Promotional visuals", "Social assets"] },
      { id: "velvotic", cat: "shopify", title: "Velvotic", sum: "End-to-end Shopify setup and launch, with ads driving ROAS from day one.", tags: ["Shopify", "Meta Ads"], via: "", img: IMG("ecommerce"),
        list: ["End-to-end Shopify setup & launch", "Theme customization & management", "Meta Pixel & conversion tracking", "Ad creatives & ROAS optimization"] },
      { id: "elyora", cat: "shopify", title: "Elyora", sum: "Launch of a modern clothing brand on Shopify, with ROAS-optimized Meta campaigns.", tags: ["Shopify", "Fashion"], via: "", img: IMG("phone-apps"),
        list: ["Modern clothing brand launch", "Mobile optimization & support", "Tax, SEO & app integration", "ROAS-optimized Meta campaigns"] },
      { id: "mantramoda", cat: "shopify", title: "MantraModa", sum: "Shopify setup for a T-shirt brand, from theme and variants to shipping and SEO.", tags: ["Shopify", "Apparel"], via: "", img: IMG("adobe"),
        list: ["T-shirt brand Shopify setup", "Theme & variant management", "Shipping, apps & SEO", "Mobile optimization & testing"] },
      { id: "pradernvastra", cat: "shopify", title: "PradernVastra", sum: "Product cataloging and storefront setup, launch-ready.", tags: ["Shopify", "Catalogue"], via: "", img: IMG("workspace"),
        list: ["Product cataloging", "Listings, variants & pricing", "Collections & navigation", "Theme setup & launch readiness"] }
    ];
    var LABEL = { "3d-animation": "3D Animation", architectural: "Architectural Viz", branding: "Branding", shopify: "Shopify" };
    var cats = ["all"].concat(Object.keys(LABEL));
    var filters = $("#filters"), grid = $("#cases"), empty = $("#empty");

    filters.innerHTML = cats.map(function (c, i) {
      return '<button type="button" class="chip' + (i === 0 ? " on" : "") + '" data-cat="' + c + '">' + (c === "all" ? "All" : LABEL[c]) + "</button>";
    }).join("");
    var DIM = {"assets/img/realty.jpg":[72,72],"assets/img/architecture.jpg":[72,72],"assets/img/ecommerce.jpg":[72,72],"assets/img/phone-apps.jpg":[72,72],"assets/img/adobe.jpg":[72,72],"assets/img/workspace.jpg":[72,72]};
    grid.innerHTML = CASES.map(function (c) {
      var mm = /url\(["']?([^"')]+)["']?\)/.exec(c.img), src = mm ? mm[1] : "";
      var st = [[LABEL[c.cat], "Category"]].concat(c.tags.filter(function (t) { return t !== LABEL[c.cat]; }).slice(0, 2).map(function (t, i) { return [t, i ? "Focus" : "Service"]; }));
      return '<article class="pf case" data-cat="' + c.cat + '" data-id="' + c.id + '"><div class="pf-pic"><img src="' + src + '" alt="' + c.title + '" decoding="async">' +
        '<button type="button" class="pf-save" aria-pressed="false" aria-label="Save ' + c.title + '"><i class="fa-regular fa-bookmark"></i></button></div>' +
        '<h3 class="pf-name">' + c.title + '</h3><p class="pf-desc">' + c.sum + "</p>" +
        '<dl class="pf-stats">' + st.map(function (s) { return "<div><dt>" + s[1] + "</dt><dd>" + s[0] + "</dd></div>"; }).join("") + "</dl>" +
        '<div class="pf-act"><button type="button" class="pf-btn" data-open="' + c.id + '"><i class="fa-regular fa-eye"></i> View project</button>' +
        '<a class="pf-sq" href="contact?service=' + c.cat.split("-")[0] + '" aria-label="Start a similar project"><i class="fa-regular fa-envelope"></i></a></div></article>';
    }).join("");
    if (window.pfSync) window.pfSync(grid);

    function applyFilter(cat) {
      var shown = 0;
      $$(".case", grid).forEach(function (el) {
        var on = cat === "all" || el.getAttribute("data-cat") === cat;
        el.classList.toggle("hide", !on);
        if (on) shown++;
      });
      $$(".chip", filters).forEach(function (ch) { ch.classList.toggle("on", ch.getAttribute("data-cat") === cat); });
      empty.style.display = shown ? "none" : "block";
      try { history.replaceState(null, "", cat === "all" ? location.pathname : "#" + cat); } catch (e) {}
    }
    filters.addEventListener("click", function (e) {
      var b = e.target.closest(".chip");
      if (b) applyFilter(b.getAttribute("data-cat"));
    });
    var hash = location.hash.replace("#", "");
    if (hash && LABEL[hash]) applyFilter(hash);

    var modal = $("#caseModal");
    function openCase(id) {
      var c = CASES.filter(function (x) { return x.id === id; })[0];
      if (!c) return;
      $("#caseImg").style.background = c.img;
      $("#caseImg").innerHTML = "";
      if (c.video) player($("#caseImg"), { src: c.video, poster: c.img.replace(/^url\(|\)$/g, ""), dur: 0, audio: true });
      $("#caseCat").textContent = LABEL[c.cat];
      $("#caseTitle").textContent = c.title;
      $("#caseSummary").textContent = c.sum;
      $("#caseTags").innerHTML = c.tags.map(function (t) { return "<span>" + t + "</span>"; }).join("");
      $("#caseList").innerHTML = c.list.map(function (l) { return "<li>" + l + "</li>"; }).join("");
      $("#caseVia").textContent = c.via;
      $("#caseVia").style.display = c.via ? "block" : "none";
      $("#caseCta").href = "contact?service=" + c.cat;
      if (modal.showModal) modal.showModal(); else modal.setAttribute("open", "");
    }
    grid.addEventListener("click", function (e) {
      if (e.target.closest("a, .pf-save")) return;
      var b = e.target.closest(".case");
      if (b) openCase(b.getAttribute("data-id"));
    });
    $("#caseClose").addEventListener("click", function () { modal.close ? modal.close() : modal.removeAttribute("open"); });
    modal.addEventListener("close", function () { $("#caseImg").innerHTML = ""; });
    modal.addEventListener("click", function (e) { if (e.target === modal) modal.close(); });
  }

  /* =============== About: count-up =============== */
  if (page === "about") {
    var nums = $$("[data-count]");
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var count = function (el) {
      var target = parseFloat(el.getAttribute("data-count")), suf = el.getAttribute("data-suffix") || "";
      if (reduced) { el.textContent = target + suf; return; }
      var t0 = performance.now(), dur = 1600;
      (function tick(now) {
        var t = Math.min((now - t0) / dur, 1), e = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * e) + suf;
        if (t < 1) requestAnimationFrame(tick);
      })(t0);
    };
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { count(en.target); io.unobserve(en.target); } });
      }, { threshold: 0.4 });
      nums.forEach(function (n) { io.observe(n); });
    } else nums.forEach(count);
  }

  /* =============== Contact form =============== */
  if (page === "contact") {
    var form = $("#contactForm"), ok = $("#formOk");

    var q = new URLSearchParams(location.search).get("service");
    var sel = $("#service");
    if (q && $("option[value='" + q + "']", sel)) sel.value = q;

    var KEYS = ["name", "email", "phone", "service", "budget", "message"];
    try {
      var draft = JSON.parse(localStorage.getItem("rn_draft") || "{}");
      KEYS.forEach(function (k) { if (draft[k] && !(k === "service" && q)) $("#" + k).value = draft[k]; });
    } catch (e) {}
    form.addEventListener("input", function (ev) {
      var d = {}; KEYS.forEach(function (k) { d[k] = $("#" + k).value; });
      try { localStorage.setItem("rn_draft", JSON.stringify(d)); } catch (e) {}
      var f = ev.target.closest(".field"); if (f) f.classList.remove("bad");
    });

    var setBad = function (id, bad) { $("#" + id).closest(".field").classList.toggle("bad", bad); return bad; };
    // phone / WhatsApp is required: digits and common separators, 8-15 digits (international format)
    var validPhone = function (s) {
      return /^\+?[\d\s().-]+$/.test(s) && s.replace(/\D/g, "").length >= 8 && s.replace(/\D/g, "").length <= 15;
    };
    var validate = function () {
      var v = function (id) { return $("#" + id).value.trim(); };
      var bad = [];
      if (setBad("name", v("name").length < 2)) bad.push("name");
      if (setBad("email", !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v("email")))) bad.push("email");
      if (setBad("phone", !validPhone(v("phone")))) bad.push("phone");
      if (setBad("service", v("service") === "")) bad.push("service");
      if (setBad("message", v("message").length < 10)) bad.push("message");
      var c = $("#consent").checked;
      $("#consentErr").style.display = c ? "none" : "block";
      if (!c) bad.push("consent");
      return bad;
    };

    var submitBtn = $("button[type=submit]", form), submitHtml = submitBtn.innerHTML;
    function showDone(data, delivered, urls) {
      var first = data.name.split(" ")[0];
      $("#waBtn").href = urls.wa; $("#mailBtn").href = urls.mail;
      $("#waBtn").style.display = delivered ? "none" : "";
      $("#mailBtn").style.display = delivered ? "none" : "";
      ok.querySelector("h3").textContent = delivered ? "Message sent!" : "Almost done!";
      $("#okText").textContent = delivered
        ? "Thanks " + first + " — your enquiry has reached us. We'll contact you on " + data.phone + " shortly."
        : "Thanks " + first + " — your message is ready. Tap “Send on WhatsApp” to deliver it to us (or use email).";
      form.style.display = "none";
      ok.classList.add("show");
      ok.scrollIntoView({ behavior: "smooth", block: "center" });
      submitBtn.disabled = false; submitBtn.innerHTML = submitHtml;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.website.value) return;
      var bad = validate();
      if (bad.length) { var first = $("#" + bad[0]); if (first) first.focus(); return; }
      var data = {};
      KEYS.forEach(function (k) { data[k] = $("#" + k).value.trim(); });
      data.date = new Date().toISOString();
      try {
        var list = JSON.parse(localStorage.getItem("rn_inquiries") || "[]");
        list.push(data);
        localStorage.setItem("rn_inquiries", JSON.stringify(list));
        localStorage.removeItem("rn_draft");
      } catch (err) {}

      var label = $("#service option[value='" + data.service + "']").textContent;
      var text = "New enquiry from the website\n\nName: " + data.name + "\nPhone/WhatsApp: " + data.phone + "\nEmail: " + data.email +
        "\nService: " + label + "\nBudget: " + (data.budget || "-") + "\n\n" + data.message;
      var urls = {
        wa: "https://wa.me/" + SITE.whatsapp + "?text=" + encodeURIComponent(text),
        mail: "mailto:" + SITE.email + "?subject=" + encodeURIComponent("Enquiry from " + data.name) + "&body=" + encodeURIComponent(text)
      };

      if (SITE.webhook) {
        // automation: the enquiry goes straight to the owner's WhatsApp, nothing more for the visitor to do
        submitBtn.disabled = true; submitBtn.textContent = "Sending…";
        var payload = { name: data.name, email: data.email, phone: data.phone, service: label, budget: data.budget, message: data.message, text: text, page: location.href, website: "" };
        fetch(SITE.webhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
          .then(function (r) { if (!r.ok) throw new Error("bad status"); showDone(data, true, urls); })
          .catch(function () { showDone(data, false, urls); });   // automation unreachable: fall back to WhatsApp / email
      } else {
        // no automation configured yet: open WhatsApp with the message pre-filled (visitor taps Send)
        window.open(urls.wa, "_blank", "noopener");
        showDone(data, false, urls);
      }
    });

    $("#againBtn").addEventListener("click", function () {
      form.reset();
      form.style.display = "";
      ok.classList.remove("show");
      $$(".field", form).forEach(function (f) { f.classList.remove("bad"); });
      $("#name").focus();
    });
  }


  /* =============== Work media: shared helpers (gallery + service pages) =============== */
  var SVC_LABEL = { "3d-animation": "3D Animation & Product Viz", motion: "Motion Design", branding: "Brand Identity", architectural: "Architectural Visualization" };
  var SVC_ORDER = ["3d-animation", "motion", "branding", "architectural"];
  function fmt(s) { return s >= 60 ? Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0") : "0:" + String(s).padStart(2, "0"); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); }
  function card(m, i) {
    var src = m.type === "video" ? m.poster : m.thumb;
    return '<button type="button" class="g-item' + (m.type === "video" ? " is-video" : "") + (m.w / m.h > 1.5 ? " g-wide" : "") + '" data-ar="' + (m.w / m.h).toFixed(3) + '" data-i="' + i + '" aria-label="Open ' + esc(m.title) + '">' +
      '<img src="' + src + '" alt="' + esc(m.title) + " — " + esc(SVC_LABEL[m.svc] || m.label) + '" loading="lazy" decoding="async" />' +
      (m.type === "video" ? '<span class="g-play" aria-hidden="true"><i class="fa-solid fa-play"></i></span><span class="g-dur">' + fmt(m.dur) + "</span>" + (m.audio ? '<span class="g-snd" title="Has sound"><i class="fa-solid fa-volume-high"></i></span>' : "") : "") +
      '<span class="g-cap"><b>' + esc(m.title) + "</b><small>" + esc(SVC_LABEL[m.svc] || m.label) + "</small></span></button>";
  }
  // custom film player: big play, scrubber, time, sound, fullscreen. Controls sit inside the frame so portrait films keep them too.
  function player(box, m) {
    box.innerHTML = '<div class="vp is-paused">' +
      '<video src="' + m.src + '" poster="' + m.poster + '" loop playsinline preload="auto"></video>' +
      '<button type="button" class="vp-big" aria-label="Play or pause"><i class="fa-solid fa-play"></i></button>' +
      '<div class="vp-bar">' +
        '<button type="button" class="vp-play" aria-label="Play or pause"><i class="fa-solid fa-play"></i></button>' +
        '<span class="vp-time"><b>0:00</b> / <em>' + fmt(m.dur || 0) + '</em></span>' +
        '<div class="vp-seek" role="slider" tabindex="0" aria-label="Seek" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i class="vp-fill"></i><b class="vp-knob"></b></div>' +
        (m.audio ? '<button type="button" class="vp-mute" aria-label="Mute or unmute"><i class="fa-solid fa-volume-high"></i></button>' : "") +
        '<button type="button" class="vp-fs" aria-label="Full screen"><i class="fa-solid fa-expand"></i></button>' +
      '</div></div>';
    var root = $(".vp", box), v = $("video", root), seek = $(".vp-seek", root), fill = $(".vp-fill", root), knob = $(".vp-knob", root), cur = $(".vp-time b", root), tot = $(".vp-time em", root), idle;
    if (m.w && m.h) { root.classList.add("sized"); root.style.setProperty("--ar", (m.w / m.h).toFixed(4)); }
    function icons() {
      var p = v.paused; root.classList.toggle("is-paused", p);
      $$(".vp-big i, .vp-play i", root).forEach(function (i) { i.className = "fa-solid " + (p ? "fa-play" : "fa-pause"); });
    }
    function wake() { root.classList.add("show"); clearTimeout(idle); if (!v.paused) idle = setTimeout(function () { root.classList.remove("show"); }, 2400); }
    function toggle() { if (v.paused) { var p = v.play(); if (p && p.catch) p.catch(function () { v.muted = true; v.play().catch(function () {}); }); } else v.pause(); wake(); }
    function paint() {
      var d = v.duration || m.dur || 1, pc = Math.min(100, (v.currentTime / d) * 100);
      fill.style.width = pc + "%"; knob.style.left = pc + "%"; cur.textContent = fmt(Math.floor(v.currentTime)); if (isFinite(v.duration)) tot.textContent = fmt(Math.round(v.duration)); seek.setAttribute("aria-valuenow", Math.round(pc));
    }
    function scrub(e) { var r = seek.getBoundingClientRect(), f = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)); v.currentTime = f * (v.duration || m.dur || 0); paint(); }
    v.addEventListener("play", function () { icons(); wake(); }); v.addEventListener("pause", function () { icons(); wake(); });
    v.addEventListener("timeupdate", paint);
    $(".vp-big", root).addEventListener("click", toggle); $(".vp-play", root).addEventListener("click", toggle);
    var drag = false;
    seek.addEventListener("pointerdown", function (e) { drag = true; seek.setPointerCapture(e.pointerId); scrub(e); wake(); });
    seek.addEventListener("pointermove", function (e) { if (drag) scrub(e); });
    seek.addEventListener("pointerup", function () { drag = false; });
    seek.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") { v.currentTime += 3; e.stopPropagation(); } else if (e.key === "ArrowLeft") { v.currentTime -= 3; e.stopPropagation(); } });
    var mute = $(".vp-mute", root);
    if (mute) mute.addEventListener("click", function () { v.muted = !v.muted; $("i", mute).className = "fa-solid " + (v.muted ? "fa-volume-xmark" : "fa-volume-high"); wake(); });
    var fsBtn = $(".vp-fs", root), lbox = box.closest("dialog") || box;
    function fsIcon() { var on = document.fullscreenElement === root || root.classList.contains("is-max"); $("i", fsBtn).className = "fa-solid " + (on ? "fa-compress" : "fa-expand"); fsBtn.setAttribute("aria-label", on ? "Exit full screen" : "Full screen"); }
    function maximise(on) { root.classList.toggle("is-max", on); lbox.classList.toggle("vp-max", on); fsIcon(); }
    var real = false;
    function toggleFs() {
      if (root.classList.contains("is-max")) { if (document.fullscreenElement) { try { document.exitFullscreen(); } catch (x) {} } maximise(false); return; }
      maximise(true);                                  // always fills the window...
      try {                                            // ...and also hides the browser chrome where the browser allows it
        if (document.fullscreenEnabled && root.requestFullscreen) { var r = root.requestFullscreen(); if (r && r.then) r.then(function () { real = true; }, function () {}); }
      } catch (x) {}
    }
    fsBtn.addEventListener("click", toggleFs);
    v.addEventListener("dblclick", toggleFs);
    document.addEventListener("fullscreenchange", function () {
      if (!document.fullscreenElement && real && root.classList.contains("is-max")) { real = false; maximise(false); } else fsIcon();
    });
    lbox.addEventListener("cancel", function (e) { if (root.classList.contains("is-max")) { e.preventDefault(); maximise(false); } });
    root.addEventListener("pointermove", wake); root.addEventListener("pointerdown", wake);
    var p0 = v.play(); if (p0 && p0.catch) p0.catch(function () { v.muted = true; v.play().catch(function () {}); });
    wake();
  }
  // lightbox wired to a list of items (getView returns the current list); render(n) can reveal more items first
  function viewer(getView, reveal) {
    var lb = $("#lightbox"); if (!lb) return null;
    var cur = -1;
    function open(i) {
      var view = getView(), m = view[i]; if (!m) return; cur = i;
      if (m.type === "video") player($("#lbMedia"), m);
      else $("#lbMedia").innerHTML = '<div class="vp vp-img sized" style="--ar:' + (m.w / m.h).toFixed(4) + '"><img src="' + m.src + '" alt="' + esc(m.title) + '" /></div>';
      $("#lbTitle").textContent = m.title;
      $("#lbCat").textContent = (SVC_LABEL[m.svc] || m.label) + (m.type === "video" ? " · video" : "");
      $("#lbPrev").style.visibility = i > 0 ? "visible" : "hidden";
      $("#lbNext").style.visibility = i < view.length - 1 ? "visible" : "hidden";
      if (!lb.open) { lb.showModal ? lb.showModal() : lb.setAttribute("open", ""); }
    }
    function step(d) { var n = cur + d; if (n < 0 || n >= getView().length) return; if (reveal) reveal(n); open(n); }
    $("#lbPrev").addEventListener("click", function () { step(-1); });
    $("#lbNext").addEventListener("click", function () { step(1); });
    $("#lbClose").addEventListener("click", function () { lb.close(); });
    lb.addEventListener("close", function () { $("#lbMedia").innerHTML = ""; lb.classList.remove("vp-max"); });
    lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener("keydown", function (e) { if (e.key === "ArrowLeft") step(-1); else if (e.key === "ArrowRight") step(1); });
    return { open: open };
  }

  /* =============== Gallery =============== */
  if (page === "gallery") {
    var grid = $("#gGrid"), chips = $("#gFilters"), more = $("#gMore"), count = $("#gCount");
    var items = [], view = [], shown = 0, STEP = 24;
    var v = viewer(function () { return view; }, function (n) { while (n >= shown && shown < view.length) render(false); });

    // bento: every tile keeps its real shape; wide pieces span two columns, row spans are measured
    var ROW = 8;
    function layout() {
      var cs = getComputedStyle(grid), cols = cs.gridTemplateColumns.split(" ").length, gap = parseFloat(cs.columnGap) || 0;
      var colW = (grid.clientWidth - gap * (cols - 1)) / cols;
      $$(".g-item", grid).forEach(function (it) {
        var ar = parseFloat(it.getAttribute("data-ar")) || 1, wide = it.classList.contains("g-wide") && cols > 1;
        var w = wide ? colW * 2 + gap : colW;
        it.style.gridRowEnd = "span " + Math.max(1, Math.round((w / ar + gap) / (ROW + gap)));
      });
    }
    if ("ResizeObserver" in window) new ResizeObserver(layout).observe(grid); else window.addEventListener("resize", layout);
    function render(reset) {
      if (reset) { grid.innerHTML = ""; shown = 0; }
      var slice = view.slice(shown, shown + STEP);
      grid.insertAdjacentHTML("beforeend", slice.map(function (m, k) { return card(m, shown + k); }).join(""));
      shown += slice.length;
      layout();
      more.style.display = shown < view.length ? "" : "none";
      count.textContent = "Showing " + shown + " of " + view.length;
    }
    function filter(cat) {
      view = cat === "all" ? items : items.filter(function (m) { return m.svc === cat; });
      $$(".chip", chips).forEach(function (c) { c.classList.toggle("on", c.getAttribute("data-cat") === cat); });
      render(true);
      try { history.replaceState(null, "", cat === "all" ? location.pathname : "#" + cat); } catch (e) {}
    }
    grid.addEventListener("click", function (e) { var b = e.target.closest(".g-item"); if (b && v) v.open(parseInt(b.getAttribute("data-i"), 10)); });
    more.addEventListener("click", function () { render(false); });

    fetch("assets/work/manifest.json?v=5").then(function (r) { return r.json(); }).then(function (data) {
      // videos first inside each service, then images
      items = data.slice().sort(function (a, b) {
        return SVC_ORDER.indexOf(a.svc) - SVC_ORDER.indexOf(b.svc) || (a.type === b.type ? 0 : a.type === "video" ? -1 : 1);
      });
      var n = {}; items.forEach(function (m) { n[m.svc] = (n[m.svc] || 0) + 1; });
      chips.innerHTML = '<button type="button" class="chip on" data-cat="all">All <span>' + items.length + "</span></button>" +
        SVC_ORDER.map(function (c) { return '<button type="button" class="chip" data-cat="' + c + '">' + SVC_LABEL[c] + " <span>" + (n[c] || 0) + "</span></button>"; }).join("");
      chips.addEventListener("click", function (e) { var b = e.target.closest(".chip"); if (b) filter(b.getAttribute("data-cat")); });
      var h = location.hash.replace("#", ""); filter(n[h] ? h : "all");
      $("#gTotal").textContent = items.length;
    }).catch(function (err) { if (window.console) console.error(err); grid.innerHTML = '<p class="empty" style="display:block">The gallery could not be loaded. Please refresh the page.</p>'; });
  }

  /* =============== Service pages: "Selected work" (featured film, reels, stills) =============== */
  /* =============== Film reels: clear "scroll this way" controls (arrows, hint, progress) =============== */
  if (page === "service" && $("#svcReels")) {
    var rrow = $("#svcReels"), rnav = document.createElement("div");
    rnav.className = "reel-nav"; rnav.hidden = true;
    rnav.innerHTML = '<div class="rn-pill">' +
      '<button type="button" class="rn-btn" data-d="-1" aria-label="Previous films"><i class="fa-solid fa-arrow-left"></i></button>' +
      '<div class="rn-track" aria-hidden="true"><i class="rn-fill"></i></div>' +
      '<span class="rn-count" aria-live="polite"></span>' +
      '<button type="button" class="rn-btn rn-next" data-d="1" aria-label="Next films"><i class="fa-solid fa-arrow-right"></i></button></div>';
    rrow.parentNode.insertBefore(rnav, rrow.nextSibling);
    var rfill = $(".rn-fill", rnav), rbtns = $(".rn-btn", rnav), rcount = $(".rn-count", rnav);
    function rUpdate() {
      var max = rrow.scrollWidth - rrow.clientWidth, can = max > 4;
      rnav.hidden = !can; rrow.classList.toggle("is-scroll", can);
      if (!can) return;
      var vis = rrow.clientWidth / rrow.scrollWidth, pos = max ? rrow.scrollLeft / max : 0;
      rfill.style.width = Math.max(14, vis * 100) + "%"; rfill.style.left = (pos * (100 - Math.max(14, vis * 100))) + "%";
      var tl = $(".w-tile", rrow), tw = tl[0] && tl[0].offsetWidth > 40 ? tl[0].offsetWidth + 12 : rrow.clientWidth * .62, first = Math.round(rrow.scrollLeft / tw), seen = Math.max(1, Math.round(rrow.clientWidth / tw)), total = parseInt(rrow.getAttribute("data-total") || tl.length, 10);
      rcount.textContent = (first + 1) + "–" + Math.min(total, first + seen) + " of " + total;
      rbtns[0].disabled = rrow.scrollLeft <= 4; rbtns[1].disabled = rrow.scrollLeft >= max - 4;
      rrow.classList.toggle("at-end", rrow.scrollLeft >= max - 4); rrow.classList.toggle("at-start", rrow.scrollLeft <= 4);
    }
    rnav.addEventListener("click", function (e) {
      var b = e.target.closest(".rn-btn"); if (!b || b.disabled) return;
      var t = rrow.querySelector(".w-tile"), step = (t ? t.offsetWidth + 12 : rrow.clientWidth * .8) * (rrow.clientWidth > 700 ? 2 : 1);
      rrow.scrollBy({ left: step * parseInt(b.getAttribute("data-d"), 10), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
    rrow.addEventListener("scroll", rUpdate, { passive: true });
    window.addEventListener("resize", rUpdate);
    if ("MutationObserver" in window) new MutationObserver(rUpdate).observe(rrow, { childList: true });
    rUpdate(); setTimeout(rUpdate, 600); setTimeout(rUpdate, 1800); window.addEventListener("load", rUpdate);
  }

  if (page === "service") {
    var host = $("#svcWork");
    if (host) {
      var sid = host.getAttribute("data-svc");
      var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      var pick = [];                                  // every item that can be opened in the viewer, in on-page order
      var sv = viewer(function () { return pick; }, null);
      var io2 = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var v = en.target;
          if (en.isIntersecting) {
            if (!v.src && v.getAttribute("data-src")) v.src = v.getAttribute("data-src");
            if (!reduceMotion) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
          } else if (!v.paused) v.pause();
        });
      }, { threshold: 0.35 }) : null;

      function tile(m, cls) {
        var idx = pick.push(m) - 1;
        if (m.type === "video") {
          return '<button type="button" class="w-tile w-video ' + cls + '" data-i="' + idx + '" aria-label="Play ' + esc(m.title) + '">' +
            '<video muted loop playsinline preload="none" poster="' + m.poster + '" data-src="' + m.src + '"></video>' +
            '<span class="w-badge"><i class="fa-solid fa-play"></i> ' + fmt(m.dur) + "</span>" +
            (m.audio ? '<span class="w-sound" role="button" tabindex="0" aria-label="Turn sound on" aria-pressed="false"><i class="fa-solid fa-volume-xmark"></i></span>' : "") + "</button>";
        }
        return '<button type="button" class="w-tile ' + cls + '" data-i="' + idx + '" aria-label="Open ' + esc(m.title) + '">' +
          '<img src="' + m.thumb + '" alt="' + esc(m.title) + " — " + esc(SVC_LABEL[m.svc]) + '" width="' + m.w + '" height="' + m.h + '" loading="lazy" decoding="async" /></button>';
      }
      function toggleSound(btn) {
        var v = btn.parentNode.querySelector("video"); if (!v) return;
        var on = v.muted;
        $$("#svcWork video").forEach(function (o) { o.muted = true; });
        $$("#svcWork .w-sound").forEach(function (o) { o.setAttribute("aria-pressed", "false"); o.setAttribute("aria-label", "Turn sound on"); o.firstChild.className = "fa-solid fa-volume-xmark"; });
        if (on) {
          if (!v.src && v.getAttribute("data-src")) v.src = v.getAttribute("data-src");
          v.muted = false; var p = v.play(); if (p && p.catch) p.catch(function () { v.muted = true; });
          btn.setAttribute("aria-pressed", "true"); btn.setAttribute("aria-label", "Turn sound off"); btn.firstChild.className = "fa-solid fa-volume-high";
        }
      }
      host.addEventListener("click", function (e) { var s = e.target.closest(".w-sound"); if (s) { e.stopPropagation(); e.preventDefault(); toggleSound(s); } }, true);
      host.addEventListener("keydown", function (e) { var s = e.target.closest && e.target.closest(".w-sound"); if (s && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); e.stopPropagation(); toggleSound(s); } }, true);
      function watch(root) { if (io2) $$("video", root).forEach(function (v) { io2.observe(v); }); }

      fetch("assets/work/manifest.json?v=5").then(function (r) { return r.json(); }).then(function (data) {
        var mine = data.filter(function (m) { return m.svc === sid; });
        var vids = mine.filter(function (m) { return m.type === "video"; });
        var imgs = mine.filter(function (m) { return m.type === "image"; });
        var area = function (m) { return m.w * m.h; };
        var wide = function (m) { var r = m.w / m.h; return r >= 1.3 && r <= 2.4; };

        // 1) featured: the biggest landscape film, otherwise the biggest landscape still
        var featured = vids.filter(wide).sort(function (a, b) { return area(b) - area(a); })[0] ||
                       imgs.filter(wide).sort(function (a, b) { return area(b) - area(a); })[0] || null;
        var rest = mine.filter(function (m) { return m !== featured; });
        if (featured) {
          $("#svcFeatured").innerHTML = tile(featured, "w-featured");
          watch($("#svcFeatured"));
        } else $("#svcFeatured").style.display = "none";

        // 2) reels: remaining films (vertical ones first)
        var reels = rest.filter(function (m) { return m.type === "video"; }).sort(function (a, b) {
          return (b.h / b.w > 1 ? 1 : 0) - (a.h / a.w > 1 ? 1 : 0);
        });
        var RSHOW = 6, rshown = 0, rrowEl = $("#svcReels"), moreBtn = $("#svcReelsMore"); rrowEl.setAttribute("data-total", reels.length);
        function moreReels(step) {
          var slice = reels.slice(rshown, rshown + (step || RSHOW));
          var html = slice.map(function (m) { return tile(m, m.h > m.w * 1.2 ? "w-tall" : m.w > m.h * 1.6 ? "w-wide" : "w-sq"); }).join("");
          rrowEl.insertAdjacentHTML("beforeend", html); rshown += slice.length;
          watch(rrowEl);
          moreBtn.textContent = rshown < reels.length ? "Show more films" : "Show fewer films";
          moreBtn.style.display = reels.length > RSHOW ? "" : "none";
        }
        function lessReels() {
          $$(".w-tile", rrowEl).slice(RSHOW).forEach(function (t) { t.remove(); });
          rshown = Math.min(RSHOW, reels.length); rrowEl.classList.remove("is-expanded"); rrowEl.scrollLeft = 0;
          moreBtn.textContent = "Show more films";
          rrowEl.scrollIntoView({ block: "center", behavior: "smooth" });
        }
        if (reels.length) {
          moreReels();
          moreBtn.addEventListener("click", function () {
            if (rshown >= reels.length) { lessReels(); return; }
            rrowEl.classList.add("is-expanded");   // spread the films into a grid so the new ones are visible
            moreReels(8);
          });
        } else { $("#svcReelsBlock").style.display = "none"; }

        // 3) stills wall
        var stills = rest.filter(function (m) { return m.type === "image"; });
        var SSHOW = 18, sshown = 0;
        function moreStills() {
          var slice = stills.slice(sshown, sshown + SSHOW);
          $("#svcWall").insertAdjacentHTML("beforeend", slice.map(function (m) { return tile(m, "w-still"); }).join(""));
          sshown += slice.length;
          $("#svcStillsMore").style.display = sshown < stills.length ? "" : "none";
        }
        if (stills.length) { moreStills(); $("#svcStillsMore").addEventListener("click", moreStills); } else { $("#svcStillsBlock").style.display = "none"; }

        var c = $("#svcCount"); if (c) c.textContent = mine.length;
      }).catch(function () { host.style.display = "none"; });

      host.addEventListener("click", function (e) {
        var b = e.target.closest(".w-tile"); if (b && sv) sv.open(parseInt(b.getAttribute("data-i"), 10));
      });
    }
  }

})();
