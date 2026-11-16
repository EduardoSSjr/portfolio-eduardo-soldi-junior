import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import resumeUrl from "../../assets/documents/EduardoSoldiCV.pdf?url";
import { ORIGIN_LABELS, isOpenSource, projects } from "./projects.js";

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const themeToggle = document.querySelector(".theme-toggle");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const siteHeader = document.querySelector(".site-header");
const showcase = document.querySelector("#projects-showcase");
const currentYear = document.querySelector("#current-year");

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

const formatNumber = (index) => String(index + 1).padStart(2, "0");

function renderProjectPanel(project, index) {
  const technologies = project.technologies
    .map((technology) => `<span>${technology}</span>`)
    .join("");

  return `
    <div class="showcase-top">
      <div class="showcase-tags">
        <span class="showcase-origin">${ORIGIN_LABELS[project.origin]}</span>
        <small>${project.highlight}</small>
        ${project.inProgress ? `<span class="showcase-status">Em evolução</span>` : ""}
      </div>
      <span class="showcase-count">${formatNumber(index)} / ${formatNumber(projects.length - 1)}</span>
    </div>
    <h3>${project.title}</h3>
    <p class="showcase-description">${project.description}</p>
    <div class="showcase-details">
      <div>
        <span>Contexto</span>
        <p>${project.context}</p>
      </div>
      <div>
        <span>Resultado</span>
        <p>${project.impact}</p>
      </div>
    </div>
    <div class="showcase-technologies" aria-label="Tecnologias usadas">${technologies}</div>
    ${
      isOpenSource(project)
        ? `<a class="showcase-repository" href="${project.repository}" target="_blank" rel="noreferrer">
            Ver no GitHub <span aria-hidden="true">↗</span>
          </a>`
        : ""
    }
  `;
}

// A Vitrine: abas (lista de projetos) + um painel com o projeto selecionado.
function setupShowcase() {
  if (!showcase) return;

  const tablist = showcase.querySelector(".showcase-tabs");
  const panel = showcase.querySelector(".showcase-panel");
  let selectedIndex = -1;
  // Só existe enquanto a Vitrine está fixa (desktop, sem preferência por menos movimento).
  let scrollToProject = null;

  const tabs = projects.map((project, index) => {
    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = "showcase-tab";
    tab.id = `projeto-aba-${index + 1}`;
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", panel.id);
    tab.innerHTML = `
      <span class="showcase-tab-number" aria-hidden="true">${formatNumber(index)}</span>
      <span class="showcase-tab-title">${project.title.split(" — ")[0]}</span>
      <span class="showcase-tab-origin">${ORIGIN_LABELS[project.origin]}</span>
    `;
    tab.addEventListener("click", () => goTo(index));
    return tab;
  });

  function select(index) {
    if (index === selectedIndex) return;
    const isFirstRender = selectedIndex === -1;
    selectedIndex = index;

    tabs.forEach((tab, tabIndex) => {
      const isSelected = tabIndex === index;
      tab.setAttribute("aria-selected", String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
    });
    panel.setAttribute("aria-labelledby", tabs[index].id);
    panel.innerHTML = renderProjectPanel(projects[index], index);

    // Só opacidade e deslocamento: o conteúdo nunca fica invisível para leitores de tela.
    if (!isFirstRender && !reducedMotion.matches) {
      gsap.fromTo(
        panel.children,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.32, stagger: 0.03, ease: "power2.out" },
      );
    }
  }

  // Com a Vitrine fixa, a aba e o scroll precisam concordar: escolher uma aba
  // rola até o trecho dela, e a seleção acompanha o scroll.
  function goTo(index) {
    select(index);
    scrollToProject?.(index);
  }

  // Padrão de abas da ARIA: setas (com volta nas pontas), Home e End.
  const keyTargets = {
    ArrowDown: (index) => (index + 1) % tabs.length,
    ArrowRight: (index) => (index + 1) % tabs.length,
    ArrowUp: (index) => (index - 1 + tabs.length) % tabs.length,
    ArrowLeft: (index) => (index - 1 + tabs.length) % tabs.length,
    Home: () => 0,
    End: () => tabs.length - 1,
  };

  tablist.addEventListener("keydown", (event) => {
    const target = keyTargets[event.key];
    if (!target) return;

    event.preventDefault();
    const index = target(selectedIndex);
    goTo(index);
    tabs[index].focus();
  });

  tablist.replaceChildren(...tabs);
  select(0);

  // No celular as abas viram uma faixa horizontal (veja o CSS).
  const narrow = window.matchMedia("(max-width: 880px)");
  const updateOrientation = () =>
    tablist.setAttribute("aria-orientation", narrow.matches ? "horizontal" : "vertical");
  updateOrientation();
  narrow.addEventListener("change", updateOrientation);

  const lastIndex = projects.length - 1;
  const pinOffset = () => siteHeader.offsetHeight + 24;
  const pinMedia = window.matchMedia("(min-width: 881px) and (prefers-reduced-motion: no-preference)");
  let pin = null;

  // A Vitrine só pode ficar fixa se o painel mais alto couber inteiro na tela;
  // senão o fim dele (e o "Ver no GitHub") ficaria inalcançável.
  function tallestPanelFits() {
    const current = panel.innerHTML;
    let tallest = 0;
    projects.forEach((project, index) => {
      panel.innerHTML = renderProjectPanel(project, index);
      tallest = Math.max(tallest, panel.offsetHeight);
    });
    panel.innerHTML = current;
    return tallest <= window.innerHeight - pinOffset();
  }

  function createPin() {
    const distancePerProject = () => window.innerHeight * 0.6;
    // Durante um scroll disparado por aba, ignora as seleções intermediárias.
    let pendingIndex = null;

    pin = ScrollTrigger.create({
      trigger: showcase,
      start: () => `top ${pinOffset()}px`,
      end: () => `+=${distancePerProject() * lastIndex}`,
      pin: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const index = Math.round(self.progress * lastIndex);
        if (pendingIndex !== null) {
          if (index === pendingIndex) pendingIndex = null;
          return;
        }
        select(index);
      },
    });

    scrollToProject = (index) => {
      pendingIndex = index;
      const top = pin.start + (pin.end - pin.start) * (index / lastIndex);
      window.scrollTo({ top, behavior: "smooth" });
    };
  }

  function updatePin() {
    const shouldPin = pinMedia.matches && tallestPanelFits();
    if (shouldPin === Boolean(pin)) return;

    if (shouldPin) {
      createPin();
    } else {
      pin.kill(true);
      pin = null;
      scrollToProject = null;
    }
  }

  updatePin();
  pinMedia.addEventListener("change", updatePin);
  window.addEventListener("resize", updatePin);
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
}

function setupMotion() {
  if (reducedMotion.matches) return;

  const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
  heroTimeline
    .from(".site-header", { y: -16, opacity: 0, duration: 0.55 })
    .from(
      "[data-hero-reveal]",
      { y: 26, opacity: 0, duration: 0.72, stagger: 0.07 },
      "-=0.22",
    )
    .from(
      ".capability-card",
      { x: 22, opacity: 0, duration: 0.5, stagger: 0.08 },
      "-=0.42",
    );

  gsap.utils.toArray("[data-scroll-reveal]").forEach((element) => {
    gsap.from(element, {
      y: 28,
      opacity: 0,
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
setupShowcase();
setupResumeLinks();
setupTheme();
setupMenu();
setupHeader();
setupSectionNavigation();
setupPointerInteractions();
setupMotion();
