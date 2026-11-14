/* NEXORA AI — interaction layer (vanilla JavaScript) */
document.documentElement.classList.add("js");

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

function closeMenu() {
  if (!menuToggle || !navLinks) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  navLinks.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    navLinks.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 720) closeMenu();
  });
}

// Scroll-reveal: content remains visible if JavaScript is unavailable.
const revealItems = document.querySelectorAll(".reveal");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

// Demo chart period controls: changes the illustrative chart and value.
const chartData = {
  7: {
    value: "₹2,14,800",
    line: "M0 126 C35 119 55 92 82 104 S130 74 160 89 S205 57 235 68 S285 48 315 58 S365 28 395 45 S445 31 475 23 S500 20 520 14"
  },
  30: {
    value: "₹8,42,500",
    line: "M0 128 C35 118 45 105 78 112 S125 90 155 98 S205 63 235 79 S285 50 315 67 S365 34 395 54 S445 24 475 37 S500 22 520 18"
  },
  90: {
    value: "₹24,68,200",
    line: "M0 142 C35 134 45 118 78 126 S125 109 155 113 S205 91 235 100 S285 70 315 82 S365 61 395 66 S445 39 475 48 S500 27 520 14"
  }
};

const chartLine = document.getElementById("chartLine");
const chartArea = document.getElementById("chartArea");
const chartValue = document.getElementById("chartValue");
const chartTabs = document.querySelectorAll(".chart-tab");

chartTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const selected = chartData[tab.dataset.period];
    if (!selected || !chartLine || !chartArea || !chartValue) return;

    chartTabs.forEach((button) => {
      const active = button === tab;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    chartLine.setAttribute("d", selected.line);
    chartArea.setAttribute("d", `${selected.line} L520 170 L0 170Z`);
    chartValue.textContent = selected.value;
  });
});

// Pricing CTA preselects the matching plan in the demo form.
const planSelect = document.getElementById("plan");
document.querySelectorAll("[data-plan]").forEach((button) => {
  button.addEventListener("click", () => {
    if (planSelect) planSelect.value = button.dataset.plan;
  });
});

// Frontend-only contact form. No details are sent to a server.
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.classList.remove("error");

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      formStatus.textContent = "Please check the fields and try again.";
      formStatus.classList.add("error");
      return;
    }

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const firstName = name.split(/\s+/)[0] || "there";

    formStatus.textContent = `Thanks, ${firstName}! Your demo request has been recorded for this preview.`;
    contactForm.reset();
  });

  contactForm.addEventListener("input", () => {
    formStatus.textContent = "";
    formStatus.classList.remove("error");
  });
}

// Current year in footer.
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
