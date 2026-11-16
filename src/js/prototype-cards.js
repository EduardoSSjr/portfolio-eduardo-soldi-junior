// PROTÓTIPO DESCARTÁVEL (ticket #3) — não é código de produção.
// Três variantes da seção de projetos, trocadas por ?variant= na própria página.
// Só é carregado em `pnpm dev` (import dinâmico atrás de import.meta.env.DEV).
import "../css/prototype-cards.css";

const VARIANTS = [
  { key: "atual", name: "Atual (#2)" },
  { key: "A", name: "Índice editorial" },
  { key: "B", name: "Vitrine com abas" },
  { key: "C", name: "Fichas técnicas no fluxo" },
];

let ctx;

export function mountPrototype(context) {
  ctx = context;
  renderSwitcher();
  renderVariant(currentVariant());

  document.addEventListener("keydown", (event) => {
    if (event.target.closest("input, textarea, [contenteditable]")) return;
    if (!document.querySelector(".modal[hidden]")) return; // não troca com o modal aberto
    if (event.key === "ArrowLeft") cycle(-1);
    if (event.key === "ArrowRight") cycle(1);
  });
}

function currentVariant() {
  const key = new URLSearchParams(location.search).get("variant") ?? "atual";
  return VARIANTS.find((variant) => variant.key === key) ?? VARIANTS[0];
}

function cycle(step) {
  const index = VARIANTS.indexOf(currentVariant());
  const next = VARIANTS[(index + step + VARIANTS.length) % VARIANTS.length];
  const url = new URL(location.href);
  url.searchParams.set("variant", next.key);
  history.replaceState(null, "", url);
  renderVariant(next);
}

function renderVariant(variant) {
  const { list } = ctx;
  list.className = variant.key === "atual" ? "projects-grid" : `proto proto-${variant.key}`;
  if (variant.key === "atual") ctx.renderCurrent();
  if (variant.key === "A") renderIndex(list);
  if (variant.key === "B") renderShowcase(list);
  if (variant.key === "C") renderFlow(list);
  document.querySelector(".proto-switcher-label").textContent = `${variant.key} · ${variant.name}`;
}

// ---------- peças comuns ----------

const tags = (project) => `
  <span class="proto-origin">${ctx.ORIGIN_LABELS[project.origin]}</span>
  ${project.inProgress ? `<span class="proto-status">Em evolução</span>` : ""}`;

const actions = (project) => `
  <button class="proto-details" type="button" data-details aria-label="Ver detalhes do projeto ${project.title}">
    Ver detalhes <span aria-hidden="true">↗</span>
  </button>
  ${
    ctx.isOpenSource(project)
      ? `<a class="proto-repo" href="${project.repository}" target="_blank" rel="noreferrer">Código no GitHub <span aria-hidden="true">↗</span></a>`
      : ""
  }`;

const number = (index) => String(index + 1).padStart(2, "0");

function wireDetails(root, project) {
  const button = root.querySelector("[data-details]");
  button.addEventListener("click", () => ctx.openProjectModal(project, button));
}

// ---------- A · Índice editorial ----------

function renderIndex(list) {
  list.replaceChildren(
    ...ctx.projects.map((project, index) => {
      const row = document.createElement("article");
      row.className = "pa-row";
      row.innerHTML = `
        <span class="pa-num">${number(index)}</span>
        <div class="pa-main">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <p class="pa-stack">${project.technologies.join(" / ")}</p>
        </div>
        <div class="pa-side">
          <div class="pa-tags">${tags(project)}<small>${project.highlight}</small></div>
          <div class="pa-actions">${actions(project)}</div>
        </div>`;
      wireDetails(row, project);
      return row;
    }),
  );
}

// ---------- B · Vitrine com abas ----------

function renderShowcase(list) {
  const tabs = document.createElement("div");
  tabs.className = "pb-tabs";
  tabs.setAttribute("role", "tablist");
  tabs.setAttribute("aria-label", "Projetos");

  const panel = document.createElement("article");
  panel.className = "pb-panel";
  panel.setAttribute("role", "tabpanel");

  const select = (index) => {
    const project = ctx.projects[index];
    tabs.querySelectorAll("[role=tab]").forEach((tab, i) => tab.setAttribute("aria-selected", String(i === index)));
    panel.innerHTML = `
      <div class="pb-top"><div class="pb-tags">${tags(project)}<small>${project.highlight}</small></div><span class="pb-num">${number(index)} / ${number(ctx.projects.length - 1)}</span></div>
      <h3>${project.title}</h3>
      <p class="pb-desc">${project.description}</p>
      <div class="pb-context"><span>Contexto</span><p>${project.context}</p></div>
      <div class="pb-chips">${project.technologies.map((t) => `<span>${t}</span>`).join("")}</div>
      <div class="pb-actions">${actions(project)}</div>`;
    wireDetails(panel, project);
  };

  ctx.projects.forEach((project, index) => {
    const tab = document.createElement("button");
    tab.type = "button";
    tab.setAttribute("role", "tab");
    tab.className = "pb-tab";
    tab.innerHTML = `<span class="pb-tab-num">${number(index)}</span><span class="pb-tab-title">${project.title.split(" — ")[0]}</span><span class="pb-tab-origin">${ctx.ORIGIN_LABELS[project.origin]}</span>`;
    tab.addEventListener("click", () => select(index));
    tabs.appendChild(tab);
  });

  list.replaceChildren(tabs, panel);
  select(0);
}

// ---------- C · Fichas técnicas no fluxo ----------

function renderFlow(list) {
  list.replaceChildren(
    ...ctx.projects.map((project, index) => {
      const sheet = document.createElement("article");
      sheet.className = "pc-sheet";
      sheet.innerHTML = `
        <span class="pc-node" aria-hidden="true"></span>
        <dl class="pc-meta">
          <div><dt>nº</dt><dd>${number(index)}</dd></div>
          <div><dt>origem</dt><dd class="pc-origin">${ctx.ORIGIN_LABELS[project.origin]}</dd></div>
          <div><dt>área</dt><dd>${project.highlight}</dd></div>
          ${project.inProgress ? `<div><dt>estado</dt><dd class="pc-status">em evolução</dd></div>` : ""}
        </dl>
        <div class="pc-body">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <p class="pc-result"><span>Resultado</span>${project.impact}</p>
        </div>
        <div class="pc-side">
          <ul class="pc-stack">${project.technologies.map((t) => `<li>${t}</li>`).join("")}</ul>
          <div class="pc-actions">${actions(project)}</div>
        </div>`;
      wireDetails(sheet, project);
      return sheet;
    }),
  );
}

// ---------- barra flutuante ----------

function renderSwitcher() {
  const bar = document.createElement("div");
  bar.className = "proto-switcher";
  bar.innerHTML = `
    <button type="button" aria-label="Variante anterior">←</button>
    <span class="proto-switcher-label"></span>
    <button type="button" aria-label="Próxima variante">→</button>`;
  const [prev, next] = bar.querySelectorAll("button");
  prev.addEventListener("click", () => cycle(-1));
  next.addEventListener("click", () => cycle(1));
  document.body.appendChild(bar);
}
