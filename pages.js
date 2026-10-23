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
      { id: "bajaj", cat: "3d-animation", title: "Bajaj Electricals", sum: "Product visualization and 3D animation campaign for one of India's largest electricals brands.", tags: ["3D Animation", "Product Viz", "Motion"], via: "Via Nova Films", img: IMG("bajaj"),
        list: ["Product visualization", "3D animation campaign", "Motion graphics"] },
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
    grid.innerHTML = CASES.map(function (c) {
      return '<button type="button" class="case" data-cat="' + c.cat + '" data-id="' + c.id + '">' +
        '<div class="case-img" style="background:' + c.img + '"></div>' +
        '<div class="case-body"><span class="case-cat">' + LABEL[c.cat] + "</span><h3>" + c.title + "</h3><p>" + c.sum + "</p>" +
        '<div class="tagrow">' + c.tags.map(function (t) { return "<span>" + t + "</span>"; }).join("") + "</div></div></button>";
    }).join("");

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
      var b = e.target.closest(".case");
      if (b) openCase(b.getAttribute("data-id"));
    });
    $("#caseClose").addEventListener("click", function () { modal.close ? modal.close() : modal.removeAttribute("open"); });
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
})();
