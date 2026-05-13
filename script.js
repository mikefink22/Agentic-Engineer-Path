/* ════════════════════════════════════════════════════
   AGENTIC ENGINEER ROADMAP — script.js
   ════════════════════════════════════════════════════ */

const STORAGE_KEY = "agentic_roadmap_v1";

/* ─── Niveles de seniority ───────────────────────────── */
const LEVELS = [
  {
    min: 0,
    label: "Junior Auditor",
    cloud: "Dominando fundamentos de infraestructura básica.",
    tags: ["SOLID", "DRY"],
    aws: "Preparando Cloud Practitioner",
  },
  {
    min: 20,
    label: "Mid Validator",
    cloud: "Aplicando patrones Well-Architected en proyectos reales.",
    tags: ["SOLID", "DRY", "Hexagonal", "DI"],
    aws: "Estudiando CLF-C02",
  },
  {
    min: 45,
    label: "Senior Validator",
    cloud: "Diseñando sistemas escalables con alta disponibilidad en AWS.",
    tags: ["SOLID", "DRY", "Hexagonal", "DI", "CQRS", "MCP"],
    aws: "CLF-C02 en progreso",
  },
  {
    min: 70,
    label: "Agentic Engineer",
    cloud: "Orquestando agentes y auditando infraestructura cloud compleja.",
    tags: ["SOLID", "DRY", "Hexagonal", "DI", "CQRS", "MCP", "DDD", "ADR"],
    aws: "Cloud Practitioner ✓",
  },
];

/* ─── Datos del radar por nivel ──────────────────────── */
function getRadarData(perc) {
  const scale = perc / 100;
  return [
    Math.round(Math.min(100, (20 + perc * 0.75))),   // C# Mastery
    Math.round(Math.min(100, (15 + perc * 0.85))),   // Arquitectura
    Math.round(Math.min(100, (25 + perc * 0.65))),   // AWS Cloud
    Math.round(Math.min(100, (10 + perc * 0.90))),   // Testing
    Math.round(Math.min(100, (10 + perc * 0.80))),   // Security
    Math.round(Math.min(100, (15 + perc * 0.80))),   // Data / MCP
  ];
}

/* ─── Navegación de secciones ────────────────────────── */
function showSection(id) {
  document
    .querySelectorAll(".tab-content")
    .forEach((s) => s.classList.add("hidden"));
  document
    .querySelectorAll(".nav-btn")
    .forEach((b) => b.classList.remove("active"));
  document.getElementById("sec-" + id).classList.remove("hidden");
  document.getElementById("btn-" + id).classList.add("active");
}

/* ─── Sincronizar progreso ───────────────────────────── */
function syncProgress() {
  const checks = document.querySelectorAll('input[type="checkbox"]');
  const checked = Array.from(checks).filter((c) => c.checked).length;
  const perc = checks.length > 0 ? Math.round((checked / checks.length) * 100) : 0;

  // Barra global (sidebar)
  document.getElementById("global-bar").style.width = perc + "%";
  document.getElementById("global-perc").innerText = perc + "%";

  // Panel dinámico del dashboard
  updateDashboard(perc);

  // Persistencia
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(Array.from(checks).map((c) => c.checked))
  );
}

/* ─── Actualizar panel del dashboard ─────────────────── */
function updateDashboard(perc) {
  // Barra de seniority
  const senBar = document.getElementById("seniority-bar");
  const senPerc = document.getElementById("seniority-perc");
  const senLabel = document.getElementById("seniority-label");
  if (senBar) senBar.style.width = perc + "%";
  if (senPerc) senPerc.textContent = perc + "%";

  // Determinar nivel
  const level = [...LEVELS].reverse().find((l) => perc >= l.min) || LEVELS[0];

  if (senLabel) senLabel.textContent = level.label;

  const cloudText = document.getElementById("cloud-mindset-text");
  if (cloudText) cloudText.textContent = level.cloud;

  const awsLabel = document.getElementById("aws-cert-label");
  if (awsLabel) awsLabel.textContent = level.aws;

  const archTags = document.getElementById("arch-tags");
  if (archTags) {
    archTags.innerHTML = level.tags
      .map(
        (t) =>
          `<span class="px-2 py-0.5 bg-slate-800 rounded text-[10px] text-slate-400 border border-slate-700">${t}</span>`
      )
      .join("");
  }

  // Actualizar radar
  if (window._radarChart) {
    window._radarChart.data.datasets[0].data = getRadarData(perc);
    window._radarChart.update("none");
  }
}

/* ─── Cargar progreso guardado ───────────────────────── */
function loadProgress() {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const checks = document.querySelectorAll('input[type="checkbox"]');
  checks.forEach((c, i) => {
    if (saved[i]) c.checked = true;
  });
  syncProgress();
}

/* ─── Inicializar radar chart ────────────────────────── */
function initChart() {
  const canvas = document.getElementById("radarChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  window._radarChart = new Chart(ctx, {
    type: "radar",
    data: {
      labels: [
        "C# / .NET",
        "Arquitectura",
        "AWS Cloud",
        "Testing",
        "Seguridad",
        "Data / MCP",
      ],
      datasets: [
        {
          label: "Nivel Actual",
          data: getRadarData(0),
          backgroundColor: "rgba(100, 116, 139, 0.15)",
          borderColor: "#64748b",
          borderWidth: 1.5,
          pointBackgroundColor: "#64748b",
          pointRadius: 3,
        },
        {
          label: "Meta Validador Senior",
          data: [85, 95, 85, 95, 85, 90],
          backgroundColor: "rgba(14, 165, 233, 0.1)",
          borderColor: "#0ea5e9",
          borderWidth: 1.5,
          borderDash: [4, 3],
          pointBackgroundColor: "#0ea5e9",
          pointRadius: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          min: 0,
          max: 100,
          grid: { color: "rgba(255,255,255,0.05)" },
          angleLines: { color: "rgba(255,255,255,0.05)" },
          ticks: { display: false, stepSize: 25 },
          pointLabels: { color: "#94a3b8", font: { size: 10 } },
        },
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: "#94a3b8", font: { size: 10 }, boxWidth: 12 },
        },
      },
    },
  });
}

/* ─── Modal de recursos ──────────────────────────────── */
const resources = {
  aws: {
    title: "AWS Cloud Practitioner",
    content: `<p class="text-sm text-slate-300 leading-relaxed">Enfócate en IAM, VPC, S3 y el Well-Architected Framework. Para el examen CLF-C02 usa AWS Skill Builder (gratuito) y los practice exams oficiales.</p>
    <a href="https://explore.skillbuilder.aws/" target="_blank" class="mt-4 inline-flex items-center gap-2 text-xs text-sky-400 hover:underline"><i class="fa-solid fa-arrow-up-right-from-square"></i> Abrir AWS Skill Builder</a>`,
  },
  csharp: {
    title: "Dominio .NET / C#",
    content: `<p class="text-sm text-slate-300 leading-relaxed">Nick Chapsas para performance y patrones modernos; Milan Jovanović para Clean Architecture y DDD. Felipe Gavilán para implementaciones prácticas paso a paso.</p>
    <a href="https://www.youtube.com/@nickchapsas" target="_blank" class="mt-4 inline-flex items-center gap-2 text-xs text-sky-400 hover:underline"><i class="fa-brands fa-youtube"></i> Nick Chapsas</a>`,
  },
  owasp: {
    title: "Seguridad OWASP Top 10",
    content: `<p class="text-sm text-slate-300 leading-relaxed">Para 2025 prestá especial atención a A01 (Broken Access Control), A05 (Injection incluyendo Prompt Injection) y A10 (Mishandling Exceptions) — los tres más críticos para código generado por IA.</p>
    <a href="https://owasp.org/www-project-top-ten/" target="_blank" class="mt-4 inline-flex items-center gap-2 text-xs text-sky-400 hover:underline"><i class="fa-solid fa-arrow-up-right-from-square"></i> OWASP Top 10</a>`,
  },
  mcp: {
    title: "Model Context Protocol (MCP)",
    content: `<p class="text-sm text-slate-300 leading-relaxed">MCP es el estándar para conectar agentes de IA con herramientas externas. Implementá un servidor en Python con FastMCP que exponga Tools, Resources y Prompts. Usá <code class="text-sky-400">uv</code> como gestor de paquetes.</p>
    <a href="https://modelcontextprotocol.io/docs/develop/build-server" target="_blank" class="mt-4 inline-flex items-center gap-2 text-xs text-sky-400 hover:underline"><i class="fa-solid fa-arrow-up-right-from-square"></i> Docs MCP</a>`,
  },
};

function openModal(key) {
  const data = resources[key];
  if (!data) return;
  document.getElementById("modal-body").innerHTML = `
    <h3 class="text-xl font-bold text-white">${data.title}</h3>
    <div class="h-px bg-slate-800 my-4"></div>
    ${data.content}`;
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

/* ─── Init ───────────────────────────────────────────── */
window.onload = () => {
  initChart();
  loadProgress();
};
