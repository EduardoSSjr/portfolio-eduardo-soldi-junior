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
// Mesmo breakpoint do bloco @media (max-width: 880px) do CSS.
const narrowScreen = window.matchMedia("(max-width: 880px)");
// Quanto rolar para avançar um projeto na Vitrine fixa: pouco mais de um giro
// da roda do mouse (~100px), em qualquer tamanho de tela.
const SCROLL_PER_PROJECT = 120;

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

// Posição do projeto na lista, a partir de 1 e com dois dígitos: 0 -> "01".
const formatOrdinal = (index) => String(index + 1).padStart(2, "0");
// Nome curto exibido na aba: o título antes do travessão.
const shortTitle = (project) => project.title.split(" — ")[0];

function renderProjectPanel(project, index) {
  const technologies = project.technologies
    .map((technology) => `<li>${technology}</li>`)
    .join("");

  return `
    <div class="showcase-top">
      <div class="showcase-tags">
        <span class="showcase-origin">${ORIGIN_LABELS[project.origin]}</span>
        <small>${project.highlight}</small>
        ${project.inProgress ? `<span class="showcase-status">Em evolução</span>` : ""}
      </div>
      <span class="showcase-count">${formatOrdinal(index)} / ${formatOrdinal(projects.length - 1)}</span>
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
    <ul class="showcase-technologies" aria-label="Tecnologias usadas">${technologies}</ul>
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
      <span class="showcase-tab-number" aria-hidden="true">${formatOrdinal(index)}</span>
      <span class="showcase-tab-title">${shortTitle(project)}</span>
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
  const updateOrientation = () =>
    tablist.setAttribute("aria-orientation", narrowScreen.matches ? "horizontal" : "vertical");
  updateOrientation();
  narrowScreen.addEventListener("change", updateOrientation);

  const lastIndex = projects.length - 1;
  const pinOffset = () => siteHeader.offsetHeight + 24;
  let pin = null;
  let removePin = null;

  // Altura do painel mais alto. A medição usa um painel invisível à parte, com a
  // mesma largura: o painel real não é tocado, então foco e animações em
  // andamento seguem intactos.
  function measureTallestPanel() {
    const probe = document.createElement("div");
    probe.className = panel.className;
    probe.setAttribute("aria-hidden", "true");
    probe.inert = true;
    Object.assign(probe.style, {
      position: "absolute",
      visibility: "hidden",
      width: `${panel.offsetWidth}px`,
    });
    showcase.append(probe);

    const tallest = Math.max(
      ...projects.map((project, index) => {
        probe.innerHTML = renderProjectPanel(project, index);
        return probe.offsetHeight;
      }),
    );
    probe.remove();
    return tallest;
  }

  function createPin() {
    // Durante um scroll disparado por aba, ignora as seleções intermediárias.
    let pendingIndex = null;
    // Se a pessoa rolar por conta própria, o scroll da aba é interrompido e
    // talvez nunca chegue ao destino: a seleção volta a seguir o scroll.
    const releasePending = () => {
      pendingIndex = null;
    };

    pin = ScrollTrigger.create({
      trigger: showcase,
      start: () => `top ${pinOffset()}px`,
      end: () => `+=${SCROLL_PER_PROJECT * lastIndex}`,
      pin: true,
      // Prepara o pin um pouco antes de ele "pegar", evitando um tranco de um quadro.
      anticipatePin: 1,
      // Ao parar de rolar, assenta no projeto mais próximo. Sem inércia: a
      // velocidade da rolagem não arremessa a Vitrine para um projeto adiante.
      snap: {
        snapTo: 1 / lastIndex,
        inertia: false,
        delay: 0.08,
        duration: { min: 0.15, max: 0.3 },
        ease: "power1.out",
      },
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

    const userScrollEvents = ["wheel", "touchstart"];
    userScrollEvents.forEach((type) =>
      window.addEventListener(type, releasePending, { passive: true }),
    );
    // Teclas de rolagem também contam. As que as abas tratam (setas, Home, End)
    // já chegam aqui com preventDefault e não rolam a página.
    const releaseOnKey = (event) => {
      if (!event.defaultPrevented) releasePending();
    };
    window.addEventListener("keydown", releaseOnKey);

    scrollToProject = (index) => {
      pendingIndex = index;
      const top = pin.start + (pin.end - pin.start) * (index / lastIndex);
      window.scrollTo({ top, behavior: "smooth" });
    };

    removePin = () => {
      userScrollEvents.forEach((type) => window.removeEventListener(type, releasePending));
      window.removeEventListener("keydown", releaseOnKey);
      pin.kill(true);
      pin = null;
      scrollToProject = null;
    };
  }

  function updateLayout() {
    const tallest = measureTallestPanel();

    // No desktop, todo projeto ocupa a altura do mais alto: trocar de projeto
    // não estica nem encolhe a Vitrine. No celular, cada painel tem sua altura,
    // para projetos curtos não deixarem um vão na tela estreita.
    panel.style.minHeight = narrowScreen.matches ? "" : `${tallest}px`;

    // A Vitrine só pode ficar fixa se o painel mais alto couber inteiro na tela;
    // senão o fim dele (e o "Ver no GitHub") ficaria inalcançável.
    const fits = tallest <= window.innerHeight - pinOffset();
    const shouldPin = !narrowScreen.matches && !reducedMotion.matches && fits;

    if (shouldPin && !pin) createPin();
    else if (!shouldPin && pin) removePin();
    else if (pin) ScrollTrigger.refresh();
  }

  // Debounce: só reavalia quando o redimensionamento para, e não a cada evento.
  let resizeTimer;
  const scheduleUpdateLayout = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateLayout, 150);
  };

  updateLayout();
  narrowScreen.addEventListener("change", updateLayout);
  reducedMotion.addEventListener("change", updateLayout);
  window.addEventListener("resize", scheduleUpdateLayout);
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

  narrowScreen.addEventListener("change", () => {
    if (!narrowScreen.matches) closeMenu();
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
