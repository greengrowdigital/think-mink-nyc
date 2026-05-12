// Think Mink NYC — Admin dashboard

(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const STORAGE_KEY = "tm_bookings";
  const AUTH_KEY = "tm_admin_unlocked";
  const PASSWORD = "thinkmink2026";

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

  function isUnlocked() {
    return sessionStorage.getItem(AUTH_KEY) === "1";
  }
  function unlock() {
    sessionStorage.setItem(AUTH_KEY, "1");
  }
  function lock() {
    sessionStorage.removeItem(AUTH_KEY);
  }

  function showGate() {
    $("#adminGate").hidden = false;
    $("#adminDash").hidden = true;
  }
  function showDash() {
    $("#adminGate").hidden = true;
    $("#adminDash").hidden = false;
    render();
  }

  function login() {
    const val = $("#adminPass").value.trim();
    const err = $("#adminError");
    if (val === PASSWORD) {
      unlock();
      err.textContent = "";
      $("#adminPass").value = "";
      showDash();
      window.TM_toast && window.TM_toast("Welcome back");
    } else {
      err.textContent = "Wrong password. Try `thinkmink2026`.";
    }
  }

  function logout() {
    lock();
    showGate();
    window.TM_toast && window.TM_toast("Logged out");
  }

  function render() {
    const bookings = getBookings();
    const now = new Date().toISOString().slice(0, 10);
    const upcoming = bookings.filter((b) => b.date >= now);

    $("#statTotal").textContent = bookings.length;
    $("#statUpcoming").textContent = upcoming.length;
    const revenue = upcoming.reduce((sum, b) => sum + (b.price || 0), 0);
    $("#statRevenue").textContent = "$" + revenue.toLocaleString();
    const customers = new Set(bookings.map((b) => (b.email || "").toLowerCase())).size;
    $("#statCustomers").textContent = customers;

    renderBookingsTable(upcoming);
    renderServiceBars(bookings);
    renderCustomers(bookings);
  }

  function renderBookingsTable(list) {
    const wrap = $("#bookingsTable");
    if (!list.length) {
      wrap.innerHTML = `
        <div class="empty-state">
          No upcoming bookings yet. Click <strong>Seed demo data</strong> above to populate sample bookings.
        </div>`;
      return;
    }
    const sorted = [...list].sort(
      (a, b) => (a.date + a.time).localeCompare(b.date + b.time)
    );
    wrap.innerHTML =
      `<div class="table-row head"><div>Date / Time</div><div>Customer</div><div>Service</div><div>Stylist</div><div></div></div>` +
      sorted
        .map((b) => {
          const niceDate = new Date(b.date + "T12:00:00").toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
          return `
          <div class="table-row" data-id="${b.id}">
            <div>
              <div class="name">${niceDate} · ${b.time}</div>
              <div class="muted" style="font-size:0.78rem;">${b.id}</div>
            </div>
            <div>
              <div class="name">${b.name || "—"}</div>
              <div class="muted" style="font-size:0.78rem;">${b.email || ""}</div>
            </div>
            <div>
              <div>${b.serviceName}</div>
              <div class="muted" style="font-size:0.78rem;">$${b.price} · ${b.duration} min</div>
            </div>
            <div>
              <span class="pill">${(b.stylistName || "").replace("First available", "Open")}</span>
            </div>
            <div class="row-actions">
              <button class="del" data-action="delete">Cancel</button>
            </div>
          </div>`;
        })
        .join("");

    wrap.querySelectorAll("[data-action='delete']").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const row = e.target.closest(".table-row");
        const id = row.dataset.id;
        if (!confirm("Cancel this booking?")) return;
        const all = getBookings().filter((b) => b.id !== id);
        saveBookings(all);
        render();
        window.TM_toast && window.TM_toast("Booking cancelled");
      });
    });
  }

  function renderServiceBars(bookings) {
    const counts = {};
    bookings.forEach((b) => {
      counts[b.serviceName] = (counts[b.serviceName] || 0) + 1;
    });
    const list = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const max = list[0] ? list[0][1] : 1;
    const wrap = $("#serviceBars");
    if (!list.length) {
      wrap.innerHTML = `<div class="empty-state">No data yet.</div>`;
      return;
    }
    wrap.innerHTML = list
      .map(
        ([name, n]) => `
        <div class="bar">
          <div class="bar-label"><span>${name}</span><strong>${n}</strong></div>
          <div class="bar-track"><div class="bar-fill" style="width:${
            (n / max) * 100
          }%"></div></div>
        </div>
      `
      )
      .join("");
  }

  function renderCustomers(bookings) {
    const map = new Map();
    bookings.forEach((b) => {
      const key = (b.email || "").toLowerCase();
      if (!key) return;
      const cur = map.get(key) || {
        name: b.name,
        email: b.email,
        phone: b.phone,
        bookings: 0,
        spent: 0,
        last: "",
      };
      cur.bookings += 1;
      cur.spent += b.price || 0;
      if (b.date > cur.last) cur.last = b.date;
      cur.name = cur.name || b.name;
      cur.phone = cur.phone || b.phone;
      map.set(key, cur);
    });
    const list = [...map.values()].sort((a, b) => b.spent - a.spent);
    const wrap = $("#customersTable");
    if (!list.length) {
      wrap.innerHTML = `<div class="empty-state">No customers yet.</div>`;
      return;
    }
    wrap.innerHTML =
      `<div class="table-row head"><div>Name</div><div>Contact</div><div>Last visit</div><div>Lifetime $</div></div>` +
      list
        .map(
          (c) => `
        <div class="table-row">
          <div>
            <div class="name">${c.name || "—"}</div>
            <div class="muted" style="font-size:0.78rem;">${c.bookings} booking${
            c.bookings === 1 ? "" : "s"
          }</div>
          </div>
          <div>
            <div>${c.email}</div>
            <div class="muted" style="font-size:0.78rem;">${c.phone || ""}</div>
          </div>
          <div>${c.last || "—"}</div>
          <div><strong>$${c.spent.toLocaleString()}</strong></div>
        </div>`
        )
        .join("");
  }

  // === Tools ===
  function exportCsv() {
    const bookings = getBookings();
    if (!bookings.length) {
      window.TM_toast && window.TM_toast("Nothing to export");
      return;
    }
    const cols = [
      "id",
      "createdAt",
      "date",
      "time",
      "serviceName",
      "serviceCat",
      "price",
      "duration",
      "stylistName",
      "name",
      "email",
      "phone",
      "notes",
      "status",
    ];
    const escape = (v) =>
      '"' + String(v == null ? "" : v).replace(/"/g, '""') + '"';
    const rows = [cols.join(",")].concat(
      bookings.map((b) => cols.map((c) => escape(b[c])).join(","))
    );
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `thinkmink-bookings-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    window.TM_toast && window.TM_toast("CSV exported");
  }

  function seedDemo() {
    if (
      !confirm(
        "Add 8 sample bookings? (You can clear all afterwards from the toolbar.)"
      )
    )
      return;
    const services = TM_DATA.services;
    const stylists = TM_DATA.stylists;
    const lash = TM_DATA.lashTeam;
    const names = [
      ["Aaliyah Brooks", "aaliyah.b@example.com", "646-555-0102"],
      ["Tasha Williams", "tasha.w@example.com", "917-555-0144"],
      ["Maya Patel", "maya.p@example.com", "718-555-0123"],
      ["Brianna Carter", "brianna.c@example.com", "212-555-0177"],
      ["Joelle Roman", "joelle.r@example.com", "347-555-0188"],
      ["Devon James", "devon.j@example.com", "929-555-0166"],
      ["Sasha Liu", "sasha.l@example.com", "718-555-0155"],
      ["Imani Foster", "imani.f@example.com", "646-555-0111"],
    ];
    const today = new Date();
    const out = getBookings();
    names.forEach((row, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() + (i + 1) * 2);
      const svc = services[i % services.length];
      const isBeauty = svc.cat === "Lash" || svc.cat === "Beauty";
      const sList = isBeauty ? lash : stylists;
      const st = sList[i % sList.length];
      out.push({
        id: "TM-DEMO-" + (i + 1),
        createdAt: new Date().toISOString(),
        serviceId: svc.id,
        serviceName: svc.name,
        serviceCat: svc.cat,
        price: svc.price,
        duration: svc.duration,
        stylistId: st.id,
        stylistName: st.name,
        date: d.toISOString().slice(0, 10),
        time: ["10:00", "11:00", "13:00", "14:00", "16:00", "18:00"][i % 6],
        name: row[0],
        email: row[1],
        phone: row[2],
        notes: "",
        status: "confirmed",
      });
    });
    saveBookings(out);
    render();
    window.TM_toast && window.TM_toast("Seeded 8 bookings");
  }

  function clearAll() {
    if (!confirm("Delete ALL bookings? This cannot be undone.")) return;
    saveBookings([]);
    render();
    window.TM_toast && window.TM_toast("All bookings cleared");
  }

  // === Search ===
  function initSearch() {
    const s = $("#bookingSearch");
    s.addEventListener("input", () => {
      const q = s.value.toLowerCase();
      const today = new Date().toISOString().slice(0, 10);
      const list = getBookings().filter(
        (b) =>
          b.date >= today &&
          ((b.name || "").toLowerCase().includes(q) ||
            (b.email || "").toLowerCase().includes(q) ||
            (b.serviceName || "").toLowerCase().includes(q))
      );
      renderBookingsTable(list);
    });
  }

  function init() {
    if (!$("#adminGate")) return;

    $("#adminLogin").addEventListener("click", login);
    $("#adminPass").addEventListener("keydown", (e) => {
      if (e.key === "Enter") login();
    });
    $("#adminLogout").addEventListener("click", logout);
    $("#exportCsv").addEventListener("click", exportCsv);
    $("#seedDemo").addEventListener("click", seedDemo);
    $("#clearAll").addEventListener("click", clearAll);
    initSearch();

    document.addEventListener("tm:route", (e) => {
      if (e.detail !== "admin") return;
      if (isUnlocked()) {
        showDash();
      } else {
        showGate();
      }
    });

    // Re-render if returning to admin tab and already unlocked
    if (location.hash.replace("#", "") === "admin" && isUnlocked()) {
      showDash();
    }
  }

  window.TM_initAdmin = init;
})();
