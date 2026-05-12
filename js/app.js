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

  // === Loader ===
  function hideLoader() {
    setTimeout(() => $("#loader").classList.add("hidden"), 1100);
  }

  // === Cursor halo ===
  function initCursor() {
    const halo = $("#cursorHalo");
    let tx = 0,
      ty = 0,
      x = 0,
      y = 0;
    document.addEventListener("mousemove", (e) => {
      tx = e.clientX;
      ty = e.clientY;
    });
    function tick() {
      x += (tx - x) * 0.15;
      y += (ty - y) * 0.15;
      halo.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    }
    tick();
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

  // === Render product cards ===
  function productCardHTML(p, tag) {
    const grad =
      "background: linear-gradient(135deg, " +
      p.grad[0] +
      " 0%, " +
      p.grad[1] +
      " 100%);";
    const dark = p.darkText ? "color: #1a1a1a;" : "color: rgba(255,255,255,0.92);";
    return `
      <article class="product-card reveal" data-pid="${p.id}" data-tags="${(
      p.tags || []
    ).join(",")}">
        <div class="product-media">
          ${tag ? `<span class="product-tag">${tag}</span>` : ""}
          <div class="swatch" style="${grad} ${dark}">${p.name}</div>
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
      .map((p, i) => productCardHTML(p, i === 0 ? "NEW DROP" : ""))
      .join("");
  }

  function renderProductPages() {
    const wigs = $("#wigsGrid");
    if (wigs) wigs.innerHTML = TM_DATA.wigs.map((p) => productCardHTML(p)).join("");
    const front = $("#frontalsGrid");
    if (front) front.innerHTML = TM_DATA.frontals.map((p) => productCardHTML(p)).join("");
    const bundles = $("#bundlesGrid");
    if (bundles) bundles.innerHTML = TM_DATA.bundles.map((p) => productCardHTML(p)).join("");
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
      .map(
        (s) => `
        <a href="#talent-stylists" data-link class="talent-card">
          <div class="portrait" style="background: linear-gradient(135deg, ${s.grad[0]}, ${s.grad[1]});">
            <span>
              <span class="name">${s.name}</span>
              <span class="role">${s.role}</span>
            </span>
          </div>
        </a>
      `
      )
      .join("");
  }

  // === Staff pages ===
  function staffCardHTML(s) {
    return `
      <article class="staff-card reveal">
        <div class="staff-portrait" style="background: linear-gradient(135deg, ${s.grad[0]}, ${s.grad[1]});">
          ${s.name.split(" ")[0]}
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
    if (sGrid) sGrid.innerHTML = TM_DATA.stylists.map(staffCardHTML).join("");
    const lGrid = $("#lashGrid");
    if (lGrid) lGrid.innerHTML = TM_DATA.lashTeam.map(staffCardHTML).join("");

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
      .map(
        (t, i) => `
        <div class="mosaic-tile reveal" data-tag="${t}" style="background: linear-gradient(135deg, ${grads[i][0]}, ${grads[i][1]});"></div>
      `
      )
      .join("");
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

  // === Policy modal ===
  function initPolicyModal() {
    const modal = $("#policyModal");
    const open = () => {
      modal.hidden = false;
    };
    const close = () => {
      modal.hidden = true;
    };
    document.addEventListener("click", (e) => {
      if (e.target.matches(".policy-link") || e.target.id === "policyLink") {
        e.preventDefault();
        open();
      }
      if (e.target === modal) close();
    });
    $("#modalClose").addEventListener("click", close);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) close();
    });
  }

  // === Year ===
  function initFooter() {
    $("#year").textContent = new Date().getFullYear();
  }

  // === Boot ===
  function boot() {
    initRouter();
    initNavScroll();
    initMobileMenu();
    initCursor();
    renderFeatured();
    renderProductPages();
    initFilters();
    renderTalentRail();
    renderStaffPages();
    renderMosaic();
    initContactForm();
    initPolicyModal();
    initFooter();

    // Booking + admin init their own listeners
    if (window.TM_initBooking) window.TM_initBooking();
    if (window.TM_initAdmin) window.TM_initAdmin();

    setRoute(currentRoute(), { silent: true });
    observeReveals();
    hideLoader();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
