// Think Mink NYC — booking flow (5-step stepper, persists to localStorage)

(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const STORAGE_KEY = "tm_bookings";

  let state = {
    step: 1,
    serviceId: null,
    stylistId: null,
    date: null, // ISO date string YYYY-MM-DD
    time: null, // "10:30"
    info: {},
  };

  // Default time slots
  const SLOTS = [
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
  ];

  function getBookings() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  }
  function saveBookings(arr) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  }

  function reset() {
    state = {
      step: 1,
      serviceId: null,
      stylistId: null,
      date: null,
      time: null,
      info: {},
    };
    $("#bookingSuccess").hidden = true;
    $$(".step", $("#booking")).forEach((el) => (el.hidden = el.dataset.step !== "1"));
    renderStepper();
    renderServicePicker();
    updateButtons();
  }

  function renderStepper() {
    $$("#stepper li").forEach((li) => {
      const n = +li.dataset.step;
      li.classList.toggle("active", n === state.step);
      li.classList.toggle("done", n < state.step);
    });
  }

  function show(step) {
    $$(".step", $("#booking")).forEach((el) => (el.hidden = +el.dataset.step !== step));
    state.step = step;
    renderStepper();
    updateButtons();
    if (step === 2) renderStylistPicker();
    if (step === 3) renderCalendar();
    if (step === 5) renderConfirm();
  }

  function updateButtons() {
    const next = $("#nextBtn");
    const back = $("#backBtn");
    back.hidden = state.step === 1;
    if (state.step === 5) {
      next.textContent = "Confirm booking";
    } else {
      next.textContent = "Next";
    }
    const canAdvance = canProceed();
    next.disabled = !canAdvance;
  }

  function canProceed() {
    if (state.step === 1) return !!state.serviceId;
    if (state.step === 2) return !!state.stylistId;
    if (state.step === 3) return !!state.date && !!state.time;
    if (state.step === 4) {
      const f = $("#infoForm");
      if (!f) return false;
      return f.checkValidity();
    }
    return true;
  }

  // === Step 1: Service picker ===
  function renderServicePicker() {
    const wrap = $("#servicePicker");
    if (!wrap) return;
    const byCat = {};
    TM_DATA.services.forEach((s) => {
      (byCat[s.cat] = byCat[s.cat] || []).push(s);
    });
    wrap.innerHTML = Object.entries(byCat)
      .flatMap(([cat, list]) => list)
      .map(
        (s) => `
        <button type="button" class="service-tile ${
          state.serviceId === s.id ? "selected" : ""
        }" data-svc="${s.id}">
          <div class="svc-cat">${s.cat}</div>
          <h4>${s.name}</h4>
          <div class="desc muted">${s.desc}</div>
          <div class="row">
            <span>${s.duration} min</span>
            <span class="price">$${s.price}</span>
          </div>
        </button>
      `
      )
      .join("");

    wrap.addEventListener(
      "click",
      (e) => {
        const tile = e.target.closest("[data-svc]");
        if (!tile) return;
        state.serviceId = tile.dataset.svc;
        $$(".service-tile", wrap).forEach((t) =>
          t.classList.toggle("selected", t.dataset.svc === state.serviceId)
        );
        updateButtons();
      },
      { once: true }
    );
  }

  // === Step 2: Stylist picker ===
  function renderStylistPicker() {
    const wrap = $("#stylistPicker");
    if (!wrap) return;
    const service = TM_DATA.serviceById(state.serviceId);
    const isBeauty = service && (service.cat === "Lash" || service.cat === "Beauty");
    const list = isBeauty ? TM_DATA.lashTeam : TM_DATA.stylists;

    wrap.innerHTML =
      `<button type="button" class="stylist-tile ${
        state.stylistId === "any" ? "selected" : ""
      }" data-sid="any">
        <div class="stylist-avatar" style="background: linear-gradient(135deg, #ed45a0, #7fccf7);">★</div>
        <div class="name">First available</div>
        <div class="role">Any artist</div>
      </button>` +
      list
        .map(
          (s) => `
        <button type="button" class="stylist-tile ${
          state.stylistId === s.id ? "selected" : ""
        }" data-sid="${s.id}">
          <div class="stylist-avatar" style="background: linear-gradient(135deg, ${s.grad[0]}, ${s.grad[1]});">${s.name.charAt(
            0
          )}</div>
          <div class="name">${s.name}</div>
          <div class="role">${s.role.split("·")[0].trim()}</div>
        </button>
      `
        )
        .join("");

    wrap.addEventListener("click", (e) => {
      const tile = e.target.closest("[data-sid]");
      if (!tile) return;
      state.stylistId = tile.dataset.sid;
      $$(".stylist-tile", wrap).forEach((t) =>
        t.classList.toggle("selected", t.dataset.sid === state.stylistId)
      );
      updateButtons();
    });
  }

  // === Step 3: Calendar + timeslots ===
  let calMonth = null; // {y, m}
  function renderCalendar() {
    const cal = $("#calendar");
    if (!cal) return;
    const today = new Date();
    if (!calMonth) calMonth = { y: today.getFullYear(), m: today.getMonth() };

    const monthName = new Date(calMonth.y, calMonth.m).toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });

    const firstDay = new Date(calMonth.y, calMonth.m, 1).getDay();
    const daysInMonth = new Date(calMonth.y, calMonth.m + 1, 0).getDate();
    const todayISO = today.toISOString().slice(0, 10);

    const dayHeader = ["S", "M", "T", "W", "T", "F", "S"];

    let html = `
      <div class="cal-nav" style="grid-column: 1 / -1; display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.5rem;">
        <button class="btn btn-ghost" id="calPrev" type="button" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;">‹</button>
        <strong>${monthName}</strong>
        <button class="btn btn-ghost" id="calNext" type="button" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;">›</button>
      </div>
      <div class="cal-head" style="display: contents;">
        ${dayHeader.map((d) => `<span>${d}</span>`).join("")}
      </div>
    `;

    for (let i = 0; i < firstDay; i++) {
      html += `<div class="cal-cell empty"></div>`;
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${calMonth.y}-${String(calMonth.m + 1).padStart(2, "0")}-${String(
        d
      ).padStart(2, "0")}`;
      const past = dateStr < todayISO;
      const selected = state.date === dateStr;
      html += `<button type="button" class="cal-cell ${selected ? "selected" : ""}" data-date="${dateStr}" ${
        past ? "disabled" : ""
      }>${d}</button>`;
    }
    cal.innerHTML = html;

    $("#calPrev").addEventListener("click", () => {
      if (calMonth.m === 0) {
        calMonth = { y: calMonth.y - 1, m: 11 };
      } else {
        calMonth = { y: calMonth.y, m: calMonth.m - 1 };
      }
      renderCalendar();
    });
    $("#calNext").addEventListener("click", () => {
      if (calMonth.m === 11) {
        calMonth = { y: calMonth.y + 1, m: 0 };
      } else {
        calMonth = { y: calMonth.y, m: calMonth.m + 1 };
      }
      renderCalendar();
    });
    cal.querySelectorAll(".cal-cell[data-date]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        state.date = btn.dataset.date;
        state.time = null;
        $$(".cal-cell", cal).forEach((c) =>
          c.classList.toggle("selected", c.dataset.date === state.date)
        );
        renderTimeslots();
        updateButtons();
      });
    });

    renTimeslotsHeader();
    renderTimeslots();
  }

  function renTimeslotsHeader() {
    const ts = $("#timeslots");
    if (!ts) return;
    if (!state.date) {
      ts.innerHTML = `<p class="muted" style="grid-column: 1 / -1;">Pick a date to see available times.</p>`;
    }
  }

  function renderTimeslots() {
    const ts = $("#timeslots");
    if (!ts || !state.date) return;
    const taken = getBookings()
      .filter((b) => b.date === state.date && (b.stylistId === state.stylistId || state.stylistId === "any"))
      .map((b) => b.time);
    ts.innerHTML = SLOTS.map((t) => {
      const isTaken = taken.includes(t);
      const isSel = state.time === t;
      return `<button type="button" class="slot ${isSel ? "selected" : ""}" data-time="${t}" ${
        isTaken ? "disabled" : ""
      } style="${isTaken ? "opacity:0.3; text-decoration: line-through;" : ""}">${t}</button>`;
    }).join("");
    $$(".slot[data-time]", ts).forEach((b) => {
      b.addEventListener("click", () => {
        if (b.disabled) return;
        state.time = b.dataset.time;
        $$(".slot", ts).forEach((s) =>
          s.classList.toggle("selected", s.dataset.time === state.time)
        );
        updateButtons();
      });
    });
  }

  // === Step 4: info form ===
  function watchInfoForm() {
    const f = $("#infoForm");
    if (!f) return;
    f.addEventListener("input", updateButtons);
    f.addEventListener("change", updateButtons);
  }

  // === Step 5: confirm ===
  function renderConfirm() {
    const card = $("#confirmCard");
    const svc = TM_DATA.serviceById(state.serviceId);
    const stylist =
      state.stylistId === "any"
        ? { name: "First available" }
        : TM_DATA.allStaff().find((x) => x.id === state.stylistId) || { name: "—" };
    const data = Object.fromEntries(new FormData($("#infoForm")));
    state.info = data;

    const deposit = Math.round((svc.price || 0) * 0.5);
    const niceDate = new Date(state.date + "T12:00:00").toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    card.innerHTML = `
      <div class="row"><div class="label">Service</div><div class="value">${svc.name}</div></div>
      <div class="row"><div class="label">With</div><div class="value">${stylist.name}</div></div>
      <div class="row"><div class="label">Date</div><div class="value">${niceDate}</div></div>
      <div class="row"><div class="label">Time</div><div class="value">${state.time}</div></div>
      <div class="row"><div class="label">Duration</div><div class="value">${svc.duration} min</div></div>
      <div class="row"><div class="label">Name</div><div class="value">${data.name || ""}</div></div>
      <div class="row"><div class="label">Email</div><div class="value">${data.email || ""}</div></div>
      <div class="row"><div class="label">Phone</div><div class="value">${data.phone || ""}</div></div>
      ${data.notes ? `<div class="row"><div class="label">Notes</div><div class="value">${data.notes}</div></div>` : ""}
      <div class="row"><div class="label">Service total</div><div class="value">$${svc.price}</div></div>
      <div class="row"><div class="label">Deposit due now</div><div class="value total">$${deposit}</div></div>
    `;
  }

  function confirmBooking() {
    const svc = TM_DATA.serviceById(state.serviceId);
    const data = state.info;
    const booking = {
      id: "TM-" + Date.now().toString(36).toUpperCase(),
      createdAt: new Date().toISOString(),
      serviceId: state.serviceId,
      serviceName: svc.name,
      serviceCat: svc.cat,
      price: svc.price,
      duration: svc.duration,
      stylistId: state.stylistId,
      stylistName:
        state.stylistId === "any"
          ? "First available"
          : (TM_DATA.allStaff().find((x) => x.id === state.stylistId) || {}).name ||
            "—",
      date: state.date,
      time: state.time,
      name: data.name || "",
      email: data.email || "",
      phone: data.phone || "",
      notes: data.notes || "",
      status: "confirmed",
    };
    const all = getBookings();
    all.push(booking);
    saveBookings(all);

    // Hide stepper + steps, show success
    $$(".step", $("#booking")).forEach((s) => (s.hidden = true));
    $("#stepper").style.opacity = 0.4;
    $("#nextBtn").hidden = true;
    $("#backBtn").hidden = true;
    $("#confirmId").textContent = booking.id;
    $("#confirmEmail").textContent = booking.email;
    $("#bookingSuccess").hidden = false;
    window.TM_toast && window.TM_toast("Booking confirmed");

    // Reset state so next visit starts clean
    state = {
      step: 1,
      serviceId: null,
      stylistId: null,
      date: null,
      time: null,
      info: {},
    };
  }

  // === Nav buttons ===
  function initNavButtons() {
    $("#nextBtn").addEventListener("click", () => {
      if (!canProceed()) return;
      if (state.step === 5) {
        confirmBooking();
        return;
      }
      show(state.step + 1);
    });
    $("#backBtn").addEventListener("click", () => {
      if (state.step > 1) show(state.step - 1);
    });
  }

  // === Reset booking when entering view ===
  function onRouteChange() {
    document.addEventListener("tm:route", (e) => {
      if (e.detail === "book") {
        // If already booked, leave success state visible. Otherwise reset stepper.
        if ($("#bookingSuccess").hidden) {
          $("#stepper").style.opacity = "";
          $("#nextBtn").hidden = false;
          reset();
        }
      }
    });
  }

  function init() {
    if (!$("#booking")) return;
    reset();
    watchInfoForm();
    initNavButtons();
    onRouteChange();

    // Service picker uses {once:true} listener — rebind on reset
    $("#servicePicker").addEventListener("click", (e) => {
      const tile = e.target.closest("[data-svc]");
      if (!tile) return;
      state.serviceId = tile.dataset.svc;
      $$(".service-tile", $("#servicePicker")).forEach((t) =>
        t.classList.toggle("selected", t.dataset.svc === state.serviceId)
      );
      updateButtons();
    });
  }

  window.TM_initBooking = init;
})();
