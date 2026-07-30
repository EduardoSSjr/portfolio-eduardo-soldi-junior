const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const projectsList = document.querySelector("#projects-list");
const currentYear = document.querySelector("#current-year");

function createProjectCard(project) {
  const card = document.createElement("a");
  card.className = "project-card";
  card.href = project.url;
  card.setAttribute("aria-label", `Abrir projeto ${project.title}`);

  if (project.url && project.url !== "#") {
    card.target = "_blank";
    card.rel = "noreferrer";
  }

  const technologies = project.technologies
    .map((technology) => `<span>${technology}</span>`)
    .join("");

  card.innerHTML = `
    <div>
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <div class="tech-list" aria-label="Tecnologias usadas">
        ${technologies}
      </div>
    </div>
    <span class="project-link">Ver detalhes</span>
  `;

  return card;
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

currentYear.textContent = new Date().getFullYear();
renderProjects();
