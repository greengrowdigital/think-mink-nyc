// Think Mink NYC — main app: router, animations, rendering

(function () {
  const VIEWS = [
    "home",
    "shop-wigs",
    "shop-frontals",
    "shop-bundles",
    "talent-stylists",
    "talent-lash",
    "contact",
    "book",
    "admin",
  ];

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // === Toast ===
  function toast(msg, ms = 2400) {
    const t = $("#toast");
    t.textContent = msg;
    t.hidden = false;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => {
      t.classList.remove("show");
      setTimeout(() => (t.hidden = true), 300);
    }, ms);
  }
  window.TM_toast = toast;

  // === Router ===
  function currentRoute() {
    const hash = (location.hash || "#home").replace(/^#/, "");
    return VIEWS.includes(hash) ? hash : "home";
  }

  function setRoute(route, opts = {}) {
    const valid = VIEWS.includes(route) ? route : "home";
    document.body.dataset.route = valid;

    $$(".view").forEach((v) => {
      const match = v.dataset.view === valid;
      v.hidden = !match;
      if (match) {
        v.style.animation = "none";
        // restart animation
        void v.offsetWidth;
        v.style.animation = "";
        observeReveals(v);
      }
    });

    $$(".primary-nav a").forEach((a) => {
      const href = a.getAttribute("href") || "";
      a.classList.toggle("is-active", href === "#" + valid);
    });

    if (!opts.silent) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    // Notify other modules
    document.dispatchEvent(new CustomEvent("tm:route", { detail: valid }));
  }

  function initRouter() {
    document.addEventListener("click", (e) => {
      const link = e.target.closest("[data-link]");
      if (!link) return;
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      e.preventDefault();
      location.hash = href;
      // close mobile menu
      $("#primaryNav").classList.remove("open");
      $("#menuToggle").classList.remove("open");
    });
    window.addEventListener("hashchange", () => setRoute(currentRoute()));
  }

  // === Reveals ===
  let revealObs = null;
  function observeReveals(scope = document) {
    if (!revealObs) {
      revealObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              revealObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
      );
    }
    $$(".reveal", scope).forEach((el) => {
      if (!el.classList.contains("in")) revealObs.observe(el);
    });
  }

  // === Nav scroll state ===
  function initNavScroll() {
    const nav = $("#nav");
    const onScroll = () => {
      nav.classList.toggle("scrolled", window.scrollY > 30);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // === Mobile menu ===
  function initMobileMenu() {
    const t = $("#menuToggle");
    const m = $("#primaryNav");
    t.addEventListener("click", () => {
      t.classList.toggle("open");
      m.classList.toggle("open");
    });
  }

  // Returns <img> markup using a curated Unsplash photo with picsum fallback.
  function imgHTML(seed, idx, alt, w = 600, h = 750) {
    const u = TM_DATA.imgFor(seed, idx, w, h);
    return `<img class="media-img" src="${u.primary}" onerror="this.onerror=null;this.src='${u.fallback}';" loading="lazy" alt="${alt}" />`;
  }

  // === Render product cards ===
  function productCardHTML(p, tag, idx = 0) {
    const tint = `linear-gradient(160deg, ${p.grad[0]}aa 0%, ${p.grad[1]}88 100%)`;
    return `
      <article class="product-card reveal" data-pid="${p.id}" data-tags="${(
      p.tags || []
    ).join(",")}">
        <div class="product-media">
          ${tag ? `<span class="product-tag">${tag}</span>` : ""}
          ${imgHTML("mink-" + p.id, idx, p.name)}
          <div class="media-tint" style="background: ${tint};"></div>
          <div class="media-label">${p.name}</div>
        </div>
        <div class="product-info">
          <div>
            <h3>${p.name}</h3>
            <div class="meta">${p.meta || ""}</div>
          </div>
          <div class="product-price">$${p.price}</div>
        </div>
      </article>
    `;
  }

  function renderFeatured() {
    const grid = $("#featuredGrid");
    if (!grid) return;
    const featured = TM_DATA.featuredIds
      .map((id) =>
        [...TM_DATA.wigs, ...TM_DATA.frontals, ...TM_DATA.bundles].find(
          (p) => p.id === id
        )
      )
      .filter(Boolean);
    grid.innerHTML = featured
      .map((p, i) => productCardHTML(p, i === 0 ? "NEW DROP" : "", i))
      .join("");
  }

  function renderProductPages() {
    const wigs = $("#wigsGrid");
    if (wigs)
      wigs.innerHTML = TM_DATA.wigs
        .map((p, i) => productCardHTML(p, null, i))
        .join("");
    const front = $("#frontalsGrid");
    if (front)
      front.innerHTML = TM_DATA.frontals
        .map((p, i) => productCardHTML(p, null, i + 4))
        .join("");
    const bundles = $("#bundlesGrid");
    if (bundles)
      bundles.innerHTML = TM_DATA.bundles
        .map((p, i) => productCardHTML(p, null, i + 8))
        .join("");
  }

  function initFilters() {
    $$(".filter-bar").forEach((bar) => {
      const target = bar.dataset.filterBar;
      let gridId;
      if (target === "wigs") gridId = "#wigsGrid";
      else if (target === "frontals") gridId = "#frontalsGrid";
      else if (target === "bundles") gridId = "#bundlesGrid";
      const grid = $(gridId);
      bar.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;
        $$("button", bar).forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const f = btn.dataset.filter;
        $$(".product-card", grid).forEach((card) => {
          const tags = (card.dataset.tags || "").split(",");
          card.style.display = f === "all" || tags.includes(f) ? "" : "none";
        });
      });
    });
  }

  // === Talent rail (home) ===
  function renderTalentRail() {
    const rail = $("#talentRail");
    if (!rail) return;
    rail.innerHTML = TM_DATA.stylists
      .slice(0, 5)
      .map((s, i) => {
        const tint = `linear-gradient(180deg, ${s.grad[0]}33 0%, #000000dd 100%)`;
        return `
        <a href="#talent-stylists" data-link class="talent-card">
          ${imgHTML("stylist-" + s.id, i + 2, s.name, 600, 800)}
          <div class="media-tint" style="background: ${tint};"></div>
          <div class="portrait">
            <span>
              <span class="name">${s.name}</span>
              <span class="role">${s.role}</span>
            </span>
          </div>
        </a>
      `;
      })
      .join("");
  }

  // === Staff pages ===
  function staffCardHTML(s, i) {
    const tint = `linear-gradient(180deg, ${s.grad[0]}22 0%, ${s.grad[1]}99 100%)`;
    return `
      <article class="staff-card reveal">
        <div class="staff-portrait">
          ${imgHTML("staff-" + s.id, i + 5, s.name)}
          <div class="media-tint" style="background: ${tint};"></div>
          <span class="staff-portrait-label">${s.name.split(" ")[0]}</span>
        </div>
        <div class="staff-body">
          <h3>${s.name}</h3>
          <p class="staff-role">${s.role}</p>
          <p class="staff-bio">${s.bio}</p>
          <div class="staff-specialties">
            ${s.specialties.map((sp) => `<span class="specialty">${sp}</span>`).join("")}
          </div>
        </div>
      </article>
    `;
  }

  function renderStaffPages() {
    const sGrid = $("#stylistsGrid");
    if (sGrid)
      sGrid.innerHTML = TM_DATA.stylists.map((s, i) => staffCardHTML(s, i)).join("");
    const lGrid = $("#lashGrid");
    if (lGrid)
      lGrid.innerHTML = TM_DATA.lashTeam
        .map((s, i) => staffCardHTML(s, i + 6))
        .join("");

    // Service menus
    const hairList = $("#hairServicesList");
    if (hairList) {
      hairList.innerHTML = TM_DATA.services
        .filter((s) => s.cat === "Hair" || s.cat === "Education")
        .map(serviceRowHTML)
        .join("");
    }
    const beautyList = $("#beautyServicesList");
    if (beautyList) {
      beautyList.innerHTML = TM_DATA.services
        .filter((s) => s.cat === "Lash" || s.cat === "Beauty")
        .map(serviceRowHTML)
        .join("");
    }
  }

  function serviceRowHTML(s) {
    return `
      <div class="service-row">
        <div>
          <div class="svc-name">${s.name}</div>
          <div class="svc-meta">${s.cat} · ${s.duration} min · ${s.desc}</div>
        </div>
        <div class="svc-price">$${s.price}</div>
      </div>
    `;
  }

  // === Mosaic (IG-style) ===
  function renderMosaic() {
    const grid = $("#mosaicGrid");
    if (!grid) return;
    const tags = [
      "BODY WAVE INSTALL",
      "613 GLUELESS",
      "FAUX LOCS",
      "GLITTER GLAM",
      "BOB SEASON",
      "VOLUME LASH",
      "SWOOP PONY",
      "BRIDAL",
    ];
    const grads = [
      ["#ed45a0", "#664398"],
      ["#7fccf7", "#ed45a0"],
      ["#664398", "#7fccf7"],
      ["#ff8dc8", "#664398"],
      ["#0a0a0a", "#ed45a0"],
      ["#ed45a0", "#ff8dc8"],
      ["#7fccf7", "#664398"],
      ["#664398", "#0a0a0a"],
    ];
    grid.innerHTML = tags
      .map((t, i) => {
        const tint = `linear-gradient(160deg, ${grads[i][0]}44 0%, ${grads[i][1]}99 100%)`;
        return `
          <div class="mosaic-tile reveal" data-tag="${t}">
            ${imgHTML("mosaic-" + i, i + 10, t, 500, 500)}
            <div class="media-tint" style="background: ${tint};"></div>
          </div>
        `;
      })
      .join("");
  }

  // === Testimonials ===
  function renderTestimonials() {
    const wrap = $("#testimonialsGrid");
    if (!wrap) return;
    wrap.innerHTML = TM_DATA.testimonials
      .map(
        (t) => `
        <article class="testimonial reveal">
          <p class="testimonial-quote italic">"${t.quote}"</p>
          <p class="testimonial-attrib">
            <strong>${t.name}</strong>
            <span>${t.role}</span>
          </p>
        </article>
      `
      )
      .join("");
  }

  // === Why us ===
  function renderWhyUs() {
    const wrap = $("#whyUsGrid");
    if (!wrap) return;
    wrap.innerHTML = TM_DATA.whyUs
      .map(
        (w) => `
        <article class="why-card reveal">
          <h3>${w.title}</h3>
          <p>${w.body}</p>
        </article>
      `
      )
      .join("");
  }

  // === FAQ accordion ===
  function renderFAQ() {
    $$(".faq-list").forEach((list) => {
      const limit = parseInt(list.dataset.limit, 10) || TM_DATA.faq.length;
      list.innerHTML = TM_DATA.faq
        .slice(0, limit)
        .map(
          (item, i) => `
          <details class="faq-item reveal" ${i === 0 ? "open" : ""}>
            <summary>${item.q}</summary>
            <p>${item.a}</p>
          </details>
        `
        )
        .join("");
    });
  }

  // === Care guide ===
  function renderCareGuide() {
    const wrap = $("#careGuide");
    if (!wrap) return;
    wrap.innerHTML = TM_DATA.careGuide
      .map(
        (c) => `
        <article class="care-step reveal">
          <span class="care-step-num">${c.step}</span>
          <h3>${c.title}</h3>
          <p>${c.body}</p>
        </article>
      `
      )
      .join("");
  }

  // === Slogan band (rotating words) ===
  function renderSloganBand() {
    const track = $("#sloganTrack");
    if (!track) return;
    const words = TM_DATA.sloganWords;
    // Build two passes so the track can loop seamlessly
    const html = [...words, ...words]
      .map(
        (w, i) =>
          `<span class="slogan-word ${i % 2 ? "alt" : ""}">${w}</span><span class="slogan-dot">●</span>`
      )
      .join("");
    track.innerHTML = html;
  }

  function renderBigSlogan() {
    const track = $("#bigSloganTrack");
    if (!track) return;
    const t = TM_DATA.bigSlogan;
    const block = `<span class="big-slogan-text">${t}</span><span class="big-slogan-star">✦</span>`;
    track.innerHTML = block.repeat(6);
  }

  // === Salon journey ===
  function renderSalonJourney() {
    const rail = $("#journeyRail");
    if (!rail) return;
    const salonIds = TM_DATA.salonIds;
    rail.innerHTML = TM_DATA.journey
      .map((j, i) => {
        const id = salonIds[j.salonIdx % salonIds.length];
        const primary = `https://images.unsplash.com/photo-${id}?w=800&q=80&auto=format&fit=crop`;
        const fallback = `https://picsum.photos/seed/${j.seedKey}/800/1000?grayscale`;
        return `
          <article class="journey-card reveal" style="--i: ${i};">
            <div class="journey-media">
              <img class="media-img" src="${primary}" onerror="this.onerror=null;this.src='${fallback}';" loading="lazy" alt="${j.title}" />
              <div class="journey-tint"></div>
              <span class="journey-num">${j.no}</span>
            </div>
            <div class="journey-body">
              <h3>${j.title}</h3>
              <p>${j.body}</p>
            </div>
          </article>
        `;
      })
      .join("");
  }

  // === Stat counters ===
  function renderStats() {
    const grid = $("#statsGrid");
    if (!grid) return;
    grid.innerHTML = TM_DATA.stats
      .map(
        (s, i) => `
        <div class="stat-tile reveal" style="--i: ${i};">
          <p class="stat-num" data-target="${s.num}" data-suffix="${s.suffix}" data-short="${s.short ? 1 : 0}">0${s.suffix}</p>
          <p class="stat-label">${s.label}</p>
        </div>
      `
      )
      .join("");
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || "";
    const isShort = el.dataset.short === "1";
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      const val = Math.round(target * eased);
      el.textContent = formatStat(val, isShort) + suffix;
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = formatStat(target, isShort) + suffix;
    }
    requestAnimationFrame(tick);
  }
  function formatStat(n, short) {
    if (!short) return n.toLocaleString("en-US");
    if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "K";
    return String(n);
  }
  function initStatCounters() {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          if (el.dataset.counted === "1") return;
          el.dataset.counted = "1";
          animateCounter(el);
          obs.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    $$(".stat-num").forEach((el) => obs.observe(el));
  }

  // === Letter stagger animation ===
  function initLetterStagger() {
    $$("[data-stagger]").forEach((el) => {
      const lines = $$(".line", el);
      lines.forEach((line, li) => {
        const text = line.textContent;
        line.innerHTML = "";
        [...text].forEach((char, i) => {
          const span = document.createElement("span");
          span.className = "char";
          span.style.setProperty("--d", `${(li * 8 + i) * 0.04}s`);
          span.textContent = char === " " ? " " : char;
          line.appendChild(span);
        });
      });
    });
  }

  // === Hero parallax ===
  function initHeroParallax() {
    const heroContent = $(".hero-content");
    const heroMedia = $(".hero-video") || $(".hero-fallback");
    if (!heroContent) return;
    let raf;
    function update() {
      const y = window.scrollY;
      if (y > window.innerHeight) return;
      const offsetText = Math.min(y * 0.35, 200);
      const offsetMedia = y * 0.2;
      heroContent.style.transform = `translateY(${offsetText}px)`;
      heroContent.style.opacity = String(Math.max(1 - y / 600, 0));
      if (heroMedia)
        heroMedia.style.transform = `translateY(${offsetMedia}px) scale(${1 + y / 4000})`;
    }
    window.addEventListener(
      "scroll",
      () => {
        if (!raf) {
          raf = requestAnimationFrame(() => {
            update();
            raf = null;
          });
        }
      },
      { passive: true }
    );
    update();
  }

  // === Length guide ===
  function renderLengthGuide() {
    const wrap = $("#lengthGuide");
    if (!wrap) return;
    wrap.innerHTML = TM_DATA.lengthGuide
      .map(
        (l) => `
        <div class="length-row">
          <strong class="length-len">${l.len}</strong>
          <span class="length-desc">${l.desc}</span>
        </div>
      `
      )
      .join("");
  }

  // === Newsletter ===
  function initNewsletter() {
    const f = $("#newsletterForm");
    if (!f) return;
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const note = $("#newsletterNote");
      const email = new FormData(f).get("email");
      const subs = JSON.parse(localStorage.getItem("tm_subs") || "[]");
      if (subs.includes(email)) {
        note.textContent = "Already subscribed.";
      } else {
        subs.push(email);
        localStorage.setItem("tm_subs", JSON.stringify(subs));
        note.textContent = "You're in. Watch your inbox.";
        f.reset();
      }
      setTimeout(() => (note.textContent = ""), 5000);
    });
  }

  // === Contact form ===
  function initContactForm() {
    const f = $("#contactForm");
    if (!f) return;
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const note = $("#contactNote");
      const data = Object.fromEntries(new FormData(f));
      const all = JSON.parse(localStorage.getItem("tm_messages") || "[]");
      all.push({ ...data, id: "M" + Date.now(), createdAt: new Date().toISOString() });
      localStorage.setItem("tm_messages", JSON.stringify(all));
      f.reset();
      note.textContent = "Message received — we'll respond within 24h.";
      setTimeout(() => (note.textContent = ""), 5000);
      toast("Message sent");
    });
  }

  // === Year ===
  function initFooter() {
    $("#year").textContent = new Date().getFullYear();
  }

  // === Boot ===
  function boot() {
    const safe = (label, fn) => {
      try {
        fn();
      } catch (err) {
        console.error("[Think Mink] " + label + " failed:", err);
      }
    };

    safe("initRouter", initRouter);
    safe("initNavScroll", initNavScroll);
    safe("initMobileMenu", initMobileMenu);
    safe("renderFeatured", renderFeatured);
    safe("renderProductPages", renderProductPages);
    safe("initFilters", initFilters);
    safe("renderTalentRail", renderTalentRail);
    safe("renderStaffPages", renderStaffPages);
    safe("renderMosaic", renderMosaic);
    safe("renderTestimonials", renderTestimonials);
    safe("renderWhyUs", renderWhyUs);
    safe("renderFAQ", renderFAQ);
    safe("renderCareGuide", renderCareGuide);
    safe("renderLengthGuide", renderLengthGuide);
    safe("renderSloganBand", renderSloganBand);
    safe("renderBigSlogan", renderBigSlogan);
    safe("renderSalonJourney", renderSalonJourney);
    safe("renderStats", renderStats);
    safe("initLetterStagger", initLetterStagger);
    safe("initStatCounters", initStatCounters);
    safe("initHeroParallax", initHeroParallax);
    safe("initNewsletter", initNewsletter);
    safe("initContactForm", initContactForm);
    safe("initFooter", initFooter);

    if (window.TM_initBooking) safe("initBooking", window.TM_initBooking);
    if (window.TM_initAdmin) safe("initAdmin", window.TM_initAdmin);

    safe("setRoute", () => setRoute(currentRoute(), { silent: true }));
    safe("observeReveals", () => observeReveals());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
