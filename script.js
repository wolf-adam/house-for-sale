// ----- Mobile nav toggle -----
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

navToggle.addEventListener("click", () => {
  const open = navMenu.classList.toggle("nav__menu--open");
  navToggle.setAttribute("aria-expanded", String(open));
});

navMenu.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    navMenu.classList.remove("nav__menu--open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

// ----- Before/after compare slider -----
const compareRange = document.getElementById("compareRange");
const compareAfter = document.getElementById("compareAfter");
const compareHandle = document.getElementById("compareHandle");
const compareBox = document.getElementById("compare");

function updateCompare(pct) {
  compareAfter.style.width = pct + "%";
  compareHandle.style.left = pct + "%";
  // Keep the "after" image aligned with the container instead of the clipping box.
  compareAfter.firstElementChild.style.width = compareBox.clientWidth + "px";
}

compareRange.addEventListener("input", () => updateCompare(Number(compareRange.value)));
window.addEventListener("resize", () => updateCompare(Number(compareRange.value)));
updateCompare(50);

// ----- Calendar -----
const calendarEl = document.getElementById("calendar");
const bookingSelection = document.getElementById("bookingSelection");
const today = new Date();
today.setHours(0, 0, 0, 0);

let viewYear = today.getFullYear();
let viewMonth = today.getMonth();
let selectedDate = null;

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DOW_NAMES = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function renderCalendar() {
  const first = new Date(viewYear, viewMonth, 1);
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  // Monday-based offset (0 = Monday).
  const offset = (first.getDay() + 6) % 7;

  const canGoBack = viewYear > today.getFullYear() || viewMonth > today.getMonth();

  let html = `
    <div class="calendar__header">
      <button type="button" class="calendar__nav" data-nav="-1" ${canGoBack ? "" : "disabled"} aria-label="Previous month">&larr;</button>
      <h3>${MONTH_NAMES[viewMonth]} ${viewYear}</h3>
      <button type="button" class="calendar__nav" data-nav="1" aria-label="Next month">&rarr;</button>
    </div>
    <div class="calendar__grid">
      ${DOW_NAMES.map((d) => `<span class="calendar__dow">${d}</span>`).join("")}
  `;

  for (let i = 0; i < offset; i++) {
    html += `<span class="calendar__day calendar__day--empty"></span>`;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(viewYear, viewMonth, day);
    const isPast = date < today;
    const isToday = date.getTime() === today.getTime();
    const isSelected = selectedDate && date.getTime() === selectedDate.getTime();
    const classes = [
      "calendar__day",
      isToday ? "calendar__day--today" : "",
      isSelected ? "calendar__day--selected" : "",
    ].filter(Boolean).join(" ");
    html += `<button type="button" class="${classes}" data-day="${day}" ${isPast ? "disabled" : ""}>${day}</button>`;
  }

  html += `</div>`;
  calendarEl.innerHTML = html;
}

calendarEl.addEventListener("click", (e) => {
  const navBtn = e.target.closest("[data-nav]");
  if (navBtn) {
    viewMonth += Number(navBtn.dataset.nav);
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    renderCalendar();
    return;
  }

  const dayBtn = e.target.closest("[data-day]");
  if (dayBtn && !dayBtn.disabled) {
    selectedDate = new Date(viewYear, viewMonth, Number(dayBtn.dataset.day));
    renderCalendar();
    updateSelectionText();
  }
});

function updateSelectionText() {
  if (!selectedDate) {
    bookingSelection.textContent = "No date selected yet.";
    return;
  }
  const dateStr = selectedDate.toLocaleDateString(undefined, {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  bookingSelection.innerHTML = `Selected: <strong>${dateStr}</strong>`;
}

renderCalendar();

// ----- Forms (mailto: fallback — swap for Formspree/EmailJS when ready) -----
const OWNER_EMAIL = "viewings@sunnymeadow.example";

function setStatus(el, message, ok) {
  el.textContent = message;
  el.className = "form-status " + (ok ? "form-status--ok" : "form-status--error");
}

function openMailto(subject, bodyLines) {
  const body = encodeURIComponent(bodyLines.join("\n"));
  window.location.href = `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${body}`;
}

const bookingForm = document.getElementById("bookingForm");
const bookingStatus = document.getElementById("bookingStatus");

bookingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(bookingForm);
  const name = (data.get("name") || "").trim();
  const email = (data.get("email") || "").trim();
  const slot = data.get("slot");

  if (!name || !email) {
    setStatus(bookingStatus, "Please fill in your name and email.", false);
    return;
  }
  if (!selectedDate) {
    setStatus(bookingStatus, "Please pick a date on the calendar.", false);
    return;
  }
  if (!slot) {
    setStatus(bookingStatus, "Please choose a time slot.", false);
    return;
  }

  openMailto("Viewing request — Sunny Meadow House", [
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${(data.get("phone") || "").trim() || "—"}`,
    `Date: ${selectedDate.toLocaleDateString()}`,
    `Time: ${slot}`,
    `Message: ${(data.get("message") || "").trim() || "—"}`,
  ]);
  setStatus(bookingStatus, "Opening your email app to send the request…", true);
});

const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(contactForm);
  const name = (data.get("name") || "").trim();
  const email = (data.get("email") || "").trim();
  const message = (data.get("message") || "").trim();

  if (!name || !email || !message) {
    setStatus(contactStatus, "Please fill in all fields.", false);
    return;
  }

  openMailto(`Message from ${name} — Sunny Meadow House`, [
    `Name: ${name}`,
    `Email: ${email}`,
    "",
    message,
  ]);
  setStatus(contactStatus, "Opening your email app to send the message…", true);
});
