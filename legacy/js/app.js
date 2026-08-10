/* Investors Circle — Interactive charts & UI */

const portfolioGrowth = [
  { year: "2020", retail: 8, circle: 14 },
  { year: "2021", retail: 10, circle: 22 },
  { year: "2022", retail: 9, circle: 28 },
  { year: "2023", retail: 11, circle: 35 },
  { year: "2024", retail: 12, circle: 42 },
  { year: "2025", retail: 13, circle: 47 },
];

const marketInsights = [
  { market: "Gachibowli", yield: 4.2, appreciation: 18, demand: 92 },
  { market: "Financial District", yield: 3.8, appreciation: 22, demand: 88 },
  { market: "Kokapet", yield: 4.5, appreciation: 25, demand: 95 },
  { market: "Tellapur", yield: 4.8, appreciation: 20, demand: 85 },
  { market: "Narsingi", yield: 4.1, appreciation: 19, demand: 80 },
  { market: "Miyapur", yield: 5.2, appreciation: 15, demand: 78 },
];

const rentalProjection = [
  { month: "Jan", projected: 2.1, actual: 2.0 },
  { month: "Feb", projected: 2.2, actual: 2.3 },
  { month: "Mar", projected: 2.3, actual: 2.2 },
  { month: "Apr", projected: 2.4, actual: 2.5 },
  { month: "May", projected: 2.5, actual: 2.4 },
  { month: "Jun", projected: 2.6, actual: 2.7 },
  { month: "Jul", projected: 2.7, actual: 2.8 },
  { month: "Aug", projected: 2.8, actual: 2.9 },
  { month: "Sep", projected: 2.9, actual: 3.0 },
  { month: "Oct", projected: 3.0, actual: 3.1 },
  { month: "Nov", projected: 3.1, actual: 3.2 },
  { month: "Dec", projected: 3.2, actual: 3.4 },
];

const stats = [
  { value: 47.2, prefix: "", suffix: "%", decimals: 1 },
  { value: 12, prefix: "₹", suffix: "Cr+", decimals: 0 },
  { value: 14, prefix: "", suffix: "", decimals: 0 },
  { value: 100, prefix: "", suffix: "%", decimals: 0 },
];

let growthChart = null;
let marketChart = null;
let rentalChart = null;

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: "rgba(255,255,255,0.7)", font: { family: "Inter" } } },
    tooltip: {
      backgroundColor: "rgba(11,16,30,0.92)",
      borderColor: "rgba(255,255,255,0.1)",
      borderWidth: 1,
      titleFont: { family: "Inter" },
      bodyFont: { family: "Inter" },
      padding: 12,
      cornerRadius: 12,
    },
  },
  scales: {
    x: {
      grid: { color: "rgba(255,255,255,0.06)" },
      ticks: { color: "rgba(255,255,255,0.5)", font: { family: "Inter", size: 11 } },
    },
    y: {
      grid: { color: "rgba(255,255,255,0.06)" },
      ticks: { color: "rgba(255,255,255,0.5)", font: { family: "Inter", size: 11 } },
    },
  },
};

function initGrowthChart() {
  const ctx = document.getElementById("growthChart");
  if (!ctx || growthChart) return;

  growthChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: portfolioGrowth.map((d) => d.year),
      datasets: [
        {
          label: "Circle Members",
          data: portfolioGrowth.map((d) => d.circle),
          borderColor: "#d4af37",
          backgroundColor: "rgba(212,175,55,0.15)",
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: "#d4af37",
        },
        {
          label: "Retail Market",
          data: portfolioGrowth.map((d) => d.retail),
          borderColor: "rgba(255,255,255,0.4)",
          backgroundColor: "rgba(255,255,255,0.05)",
          fill: true,
          tension: 0.4,
          pointRadius: 4,
        },
      ],
    },
    options: {
      ...chartDefaults,
      scales: {
        ...chartDefaults.scales,
        y: { ...chartDefaults.scales.y, ticks: { ...chartDefaults.scales.y.ticks, callback: (v) => v + "%" } },
      },
    },
  });
}

function initMarketChart() {
  const ctx = document.getElementById("marketChart");
  if (!ctx || marketChart) return;

  marketChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: marketInsights.map((d) => d.market),
      datasets: [
        {
          label: "Appreciation %",
          data: marketInsights.map((d) => d.appreciation),
          backgroundColor: "#d4af37",
          borderRadius: 6,
        },
      ],
    },
    options: {
      ...chartDefaults,
      plugins: { ...chartDefaults.plugins, legend: { display: false } },
      onHover: (_, elements) => {
        if (elements.length) highlightMarket(marketInsights[elements[0].index].market);
      },
    },
  });
}

function initRentalChart() {
  const ctx = document.getElementById("rentalChart");
  if (!ctx || rentalChart) return;

  rentalChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: rentalProjection.map((d) => d.month),
      datasets: [
        {
          label: "Projected",
          data: rentalProjection.map((d) => d.projected),
          borderColor: "rgba(255,255,255,0.4)",
          borderDash: [5, 5],
          tension: 0.4,
          pointRadius: 0,
        },
        {
          label: "Actual",
          data: rentalProjection.map((d) => d.actual),
          borderColor: "#00d4ff",
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: "#00d4ff",
        },
      ],
    },
    options: {
      ...chartDefaults,
      scales: {
        ...chartDefaults.scales,
        y: { ...chartDefaults.scales.y, min: 1.5, max: 4, ticks: { ...chartDefaults.scales.y.ticks, callback: (v) => v + "%" } },
      },
    },
  });
}

function renderMarketCards() {
  const container = document.getElementById("marketCards");
  if (!container) return;

  container.innerHTML = marketInsights
    .map(
      (m) => `
    <div class="market-card glass-panel" data-market="${m.market}">
      <div class="market-card-header">
        <strong>${m.market}</strong>
        <span class="yield">${m.appreciation}% YoY</span>
      </div>
      <div class="market-metrics">
        <div>
          <div class="metric-label">Rental Yield</div>
          <div>${m.yield}%</div>
        </div>
        <div>
          <div class="metric-label">Demand Index</div>
          <div class="demand-bar"><div class="demand-fill" style="width:${m.demand}%"></div></div>
          <div style="margin-top:0.25rem">${m.demand}</div>
        </div>
      </div>
    </div>`
    )
    .join("");

  container.querySelectorAll(".market-card").forEach((card) => {
    card.addEventListener("mouseenter", () => highlightMarket(card.dataset.market));
    card.addEventListener("mouseleave", () => highlightMarket(null));
  });
}

function highlightMarket(name) {
  document.querySelectorAll(".market-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.market === name);
  });
}

function initChartTabs() {
  const tabs = document.querySelectorAll(".chart-tab");
  const panels = document.querySelectorAll(".chart-panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      tabs.forEach((t) => t.classList.toggle("active", t === tab));
      panels.forEach((p) => p.classList.toggle("hidden", p.dataset.panel !== target));

      if (target === "growth") initGrowthChart();
      if (target === "markets") {
        initMarketChart();
        renderMarketCards();
      }
      if (target === "rental") initRentalChart();
    });
  });

  initGrowthChart();
}

function animateCounter(el, target, prefix, suffix, decimals, duration = 2000) {
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;
    const formatted = decimals > 0 ? current.toFixed(decimals) : Math.round(current);
    el.textContent = `${prefix}${formatted}${suffix}`;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function initStats() {
  const statEls = document.querySelectorAll("[data-stat-index]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const i = Number(entry.target.dataset.statIndex);
        const s = stats[i];
        animateCounter(entry.target, s.value, s.prefix, s.suffix, s.decimals);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );
  statEls.forEach((el) => observer.observe(el));
}

function initChips() {
  document.querySelectorAll(".chip-group[data-multi]").forEach((group) => {
    group.querySelectorAll(".chip").forEach((chip) => {
      chip.addEventListener("click", () => chip.classList.toggle("selected"));
    });
  });

  document.querySelectorAll(".chip-group:not([data-multi])").forEach((group) => {
    group.querySelectorAll(".chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        group.querySelectorAll(".chip").forEach((c) => c.classList.remove("selected"));
        chip.classList.add("selected");
        const input = chip.querySelector("input");
        if (input) input.checked = true;
      });
    });
  });
}

function initForm() {
  const form = document.getElementById("applyForm");
  const success = document.getElementById("successPanel");
  if (!form || !success) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.style.display = "none";
    document.querySelector(".apply-header").style.display = "none";
    success.classList.add("show");
    success.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  initChartTabs();
  initStats();
  initChips();
  initForm();
  initScrollAnimations();
});
