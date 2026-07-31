const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const projectsList = document.querySelector("#projects-list");
const currentYear = document.querySelector("#current-year");
const modal = document.querySelector("#project-modal");
const modalTitle = document.querySelector("#modal-title");
const modalHighlight = document.querySelector("#modal-highlight");
const modalDescription = document.querySelector("#modal-description");
const modalContext = document.querySelector("#modal-context");
const modalImpact = document.querySelector("#modal-impact");
const modalTechnologies = document.querySelector("#modal-technologies");
const modalLink = document.querySelector("#modal-link");

function createProjectCard(project) {
  const card = document.createElement("button");
  const hasUrl = project.url && project.url !== "#";

  card.className = "project-card";
  card.type = "button";
  card.dataset.project = project.title;
  card.setAttribute("aria-label", `Abrir detalhes do projeto ${project.title}`);

  const technologies = project.technologies
    .map((technology) => `<span>${technology}</span>`)
    .join("");

  card.innerHTML = `
    <div>
      <small>${project.highlight}</small>
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <div class="tech-list" aria-label="Tecnologias usadas">
        ${technologies}
      </div>
    </div>
    <span class="project-link">${hasUrl ? "Acessar projeto" : "Abrir resumo do projeto"}</span>
  `;

  if (hasUrl) {
    card.addEventListener("click", () => {
      window.open(project.url, "_blank", "noreferrer");
    });
    return card;
  }

  card.addEventListener("click", () => {
    openProjectModal(project);
  });

  return card;
}

function openProjectModal(project) {
  modalHighlight.textContent = project.highlight;
  modalTitle.textContent = project.title;
  modalDescription.textContent = project.description;
  modalContext.textContent = project.context;
  modalImpact.textContent = project.impact;
  modalTechnologies.innerHTML = project.technologies
    .map((technology) => `<span>${technology}</span>`)
    .join("");

  if (project.url && project.url !== "#") {
    modalLink.hidden = false;
    modalLink.href = project.url;
  } else {
    modalLink.hidden = true;
    modalLink.removeAttribute("href");
  }

  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeProjectModal() {
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function renderProjects() {
  projectsList.innerHTML = "";
  projects.forEach((project) => {
    projectsList.appendChild(createProjectCard(project));
  });
}

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.addEventListener("click", (event) => {
  if (event.target.tagName === "A") {
    navLinks.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

modal.addEventListener("click", (event) => {
  if (event.target.matches("[data-close-modal='true']")) {
    closeProjectModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
    closeProjectModal();
  }
});

currentYear.textContent = new Date().getFullYear();
renderProjects();
