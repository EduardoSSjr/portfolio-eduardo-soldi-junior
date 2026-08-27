import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import resumeUrl from "../../assets/documents/EduardoSoldiCV.pdf?url";
import { projects } from "./projects.js";

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const themeToggle = document.querySelector(".theme-toggle");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const siteHeader = document.querySelector(".site-header");
const projectsList = document.querySelector("#projects-list");
const currentYear = document.querySelector("#current-year");
const modal = document.querySelector("#project-modal");
const modalDialog = modal?.querySelector(".modal-dialog");
const modalTitle = document.querySelector("#modal-title");
const modalHighlight = document.querySelector("#modal-highlight");
const modalDescription = document.querySelector("#modal-description");
const modalContext = document.querySelector("#modal-context");
const modalImpact = document.querySelector("#modal-impact");
const modalTechnologies = document.querySelector("#modal-technologies");
const modalLink = document.querySelector("#modal-link");
let lastFocusedElement = null;

function setupTheme() {
  if (!themeToggle) return;

  const icon = themeToggle.querySelector(".theme-toggle-icon");
  const label = themeToggle.querySelector(".theme-toggle-label");

  themeToggle.addEventListener("click", () => {
    const isLight = document.documentElement.dataset.theme !== "light";

    document.documentElement.dataset.theme = isLight ? "light" : "dark";
    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeToggle.setAttribute("aria-label", isLight ? "Ativar modo escuro" : "Ativar modo claro");
    icon.textContent = isLight ? "☾" : "☼";
    label.textContent = isLight ? "Escuro" : "Claro";
  });
}

function setupResumeLinks() {
  document.querySelectorAll(".resume-download").forEach((link) => {
    link.href = resumeUrl;
    link.download = "Curriculo-Eduardo-Soldi-Junior.pdf";
  });
}

function createProjectCard(project, index) {
  const card = document.createElement("button");
  const technologies = project.technologies
    .map((technology) => `<span>${technology}</span>`)
    .join("");

  card.className = "project-card";
  card.type = "button";
  card.dataset.project = project.title;
  card.setAttribute("aria-label", `Abrir detalhes do projeto ${project.title}`);
  card.setAttribute("data-scroll-reveal", "");

  card.innerHTML = `
    <div class="project-card-top">
      <small>${project.highlight}</small>
      <span class="project-number">${String(index + 1).padStart(2, "0")}</span>
    </div>
    <h3>${project.title}</h3>
    <p>${project.description}</p>
    <div class="tech-list" aria-label="Tecnologias usadas">
      ${technologies}
    </div>
    <span class="project-action">
      Ver detalhes
      <i aria-hidden="true">↗</i>
    </span>
  `;

  card.addEventListener("click", () => openProjectModal(project, card));
  return card;
}

function renderProjects() {
  if (!projectsList) return;

  projectsList.replaceChildren();
  projects.forEach((project, index) => {
    projectsList.appendChild(createProjectCard(project, index));
  });
}

function getFocusableElements() {
  if (!modalDialog) return [];

  return [
    ...modalDialog.querySelectorAll(
      'a[href]:not([hidden]), button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ];
}

function openProjectModal(project, trigger) {
  if (!modal) return;

  lastFocusedElement = trigger;
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

  modal.hidden = false;
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modal.querySelector(".modal-close")?.focus();

  if (!reducedMotion.matches) {
    gsap.fromTo(
      modalDialog,
      { y: 24, autoAlpha: 0, scale: 0.985 },
      { y: 0, autoAlpha: 1, scale: 1, duration: 0.34, ease: "power3.out" },
    );
  }
}

function closeProjectModal() {
  if (!modal || modal.hidden) return;

  const finishClosing = () => {
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    lastFocusedElement?.focus();
  };

  if (reducedMotion.matches) {
    finishClosing();
    return;
  }

  gsap.to(modalDialog, {
    y: 14,
    autoAlpha: 0,
    duration: 0.18,
    ease: "power2.in",
    onComplete: finishClosing,
  });
}

function setupMenu() {
  if (!menuToggle || !navLinks) return;

  const closeMenu = () => {
    navLinks.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 880) closeMenu();
  });
}

function setupHeader() {
  if (!siteHeader) return;

  const updateHeader = () => {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 20);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

function setupModal() {
  if (!modal) return;

  modal.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-modal='true']")) {
      closeProjectModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (modal.hidden) return;

    if (event.key === "Escape") {
      closeProjectModal();
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = getFocusableElements();
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

function setupSectionNavigation() {
  const sections = document.querySelectorAll("main section[id]");
  const anchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        anchors.forEach((anchor) => {
          const isCurrent = anchor.getAttribute("href") === `#${entry.target.id}`;
          anchor.toggleAttribute("aria-current", isCurrent);
        });
      });
    },
    { rootMargin: "-34% 0px -58%", threshold: 0 },
  );

  sections.forEach((section) => observer.observe(section));
}

function setupPointerInteractions() {
  if (!window.matchMedia("(pointer: fine)").matches || reducedMotion.matches) return;

  const heroVisual = document.querySelector(".hero-visual");

  heroVisual?.addEventListener("pointermove", (event) => {
    const bounds = heroVisual.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;

    heroVisual.style.setProperty("--pointer-x", `${x * 100}%`);
    heroVisual.style.setProperty("--pointer-y", `${y * 100}%`);
    heroVisual.style.setProperty("--tilt-x", `${(0.5 - y) * 4}deg`);
    heroVisual.style.setProperty("--tilt-y", `${(x - 0.5) * 4}deg`);
  });

  heroVisual?.addEventListener("pointerleave", () => {
    heroVisual.style.setProperty("--pointer-x", "50%");
    heroVisual.style.setProperty("--pointer-y", "50%");
    heroVisual.style.setProperty("--tilt-x", "0deg");
    heroVisual.style.setProperty("--tilt-y", "0deg");
  });

  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 100;
      const y = ((event.clientY - bounds.top) / bounds.height) * 100;

      card.style.setProperty("--pointer-x", `${x}%`);
      card.style.setProperty("--pointer-y", `${y}%`);
    });
  });
}

function setupMotion() {
  if (reducedMotion.matches) return;

  const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
  heroTimeline
    .from(".site-header", { y: -16, autoAlpha: 0, duration: 0.55 })
    .from(
      "[data-hero-reveal]",
      { y: 26, autoAlpha: 0, duration: 0.72, stagger: 0.07 },
      "-=0.22",
    )
    .from(
      ".capability-card",
      { x: 22, autoAlpha: 0, duration: 0.5, stagger: 0.08 },
      "-=0.42",
    );

  gsap.utils.toArray("[data-scroll-reveal]").forEach((element) => {
    gsap.from(element, {
      y: 28,
      autoAlpha: 0,
      duration: 0.68,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 88%",
        once: true,
      },
    });
  });
}

currentYear.textContent = new Date().getFullYear();
renderProjects();
setupResumeLinks();
setupTheme();
setupMenu();
setupHeader();
setupModal();
setupSectionNavigation();
setupPointerInteractions();
setupMotion();
