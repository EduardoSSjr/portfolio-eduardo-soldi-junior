import { expect, test } from "@playwright/test";

const TAILOR_RESUME = "tailor-resume — Skill de IA para adaptar currículos";
const N8N = "Automação de Relatórios com n8n";
const VBA = "Integração de IA com Excel via VBA";
const BANKUP = "Bankup — Sistema Financeiro Web";
const PROJETOS = [TAILOR_RESUME, N8N, VBA, BANKUP];
const REPOSITORIO_TAILOR_RESUME = "https://github.com/EduardoSSjr/tailor-resume";

// A aba mostra só o nome curto do projeto, antes do travessão.
const tituloCurto = (titulo) => titulo.split(" — ")[0];

const secaoProjetos = (page) => page.getByRole("region", { name: "Projetos em destaque" });
const abas = (page) => secaoProjetos(page).getByRole("tab");
const aba = (page, titulo) => abas(page).filter({ hasText: tituloCurto(titulo) });
const painel = (page) => secaoProjetos(page).getByRole("tabpanel");

const irParaProjetos = (page) =>
  secaoProjetos(page).evaluate((secao) => secao.scrollIntoView({ block: "start" }));

const indiceSelecionado = (page) =>
  abas(page).evaluateAll((todas) => todas.findIndex((a) => a.getAttribute("aria-selected") === "true"));

// Espera a rolagem terminar (duas leituras iguais seguidas) e devolve o scrollY final.
async function scrollParado(page) {
  let anterior = -1;
  await expect
    .poll(async () => {
      const atual = await page.evaluate(() => window.scrollY);
      const parado = atual === anterior;
      anterior = atual;
      return parado;
    })
    .toBe(true);
  return anterior;
}

async function rolar(page, deltaY) {
  await page.mouse.wheel(0, deltaY);
  return scrollParado(page);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await irParaProjetos(page);
});

test("as abas listam tailor-resume, n8n, VBA e Bankup, nessa ordem", async ({ page }) => {
  await expect(abas(page)).toHaveCount(4);
  for (const [indice, titulo] of PROJETOS.entries()) {
    await expect(abas(page).nth(indice)).toContainText(tituloCurto(titulo));
  }
});

test("o tailor-resume abre selecionado, com o painel completo", async ({ page }) => {
  await expect(aba(page, TAILOR_RESUME)).toHaveAttribute("aria-selected", "true");

  const projeto = painel(page);
  await expect(projeto.getByRole("heading", { name: TAILOR_RESUME })).toBeVisible();
  await expect(projeto.getByText("Código aberto", { exact: true })).toBeVisible();
  await expect(projeto.getByText("Em evolução", { exact: true })).toBeVisible();
  await expect(projeto.getByText("Skill de IA", { exact: true })).toBeVisible();
  await expect(projeto).toContainText("sem nunca inventar experiência");
  await expect(projeto).toContainText("Contexto");
  await expect(projeto).toContainText("pedir isso a uma IA genérica");
  await expect(projeto).toContainText("Resultado");
  await expect(projeto).toContainText("qualquer um pode clonar o repositório");
  await expect(projeto.getByRole("list", { name: "Tecnologias usadas" })).toContainText(
    "Spec-Driven Development",
  );
  await expect(projeto.getByRole("link", { name: "Ver no GitHub" })).toHaveAttribute(
    "href",
    REPOSITORIO_TAILOR_RESUME,
  );
});

for (const [titulo, origem] of [
  [N8N, "Corporativo"],
  [VBA, "Corporativo"],
  [BANKUP, "Acadêmico"],
]) {
  test(`projeto sem código público "${titulo}" mostra ${origem}, sem repositório nem evolução`, async ({
    page,
  }) => {
    await aba(page, titulo).click();

    await expect(aba(page, titulo)).toHaveAttribute("aria-selected", "true");
    const projeto = painel(page);
    await expect(projeto.getByRole("heading", { name: titulo })).toBeVisible();
    await expect(projeto.getByText(origem, { exact: true })).toBeVisible();
    await expect(projeto.getByRole("link")).toHaveCount(0);
    await expect(projeto).not.toContainText("Em evolução");
  });
}

test.describe("teclado nas abas", () => {
  test("setas movem seleção e foco entre as abas, com volta nas pontas", async ({ page }) => {
    await aba(page, TAILOR_RESUME).focus();

    await page.keyboard.press("ArrowDown");
    await expect(aba(page, N8N)).toBeFocused();
    await expect(aba(page, N8N)).toHaveAttribute("aria-selected", "true");
    await expect(painel(page).getByRole("heading", { name: N8N })).toBeVisible();

    await page.keyboard.press("ArrowRight");
    await expect(aba(page, VBA)).toHaveAttribute("aria-selected", "true");

    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowUp");
    await expect(aba(page, BANKUP)).toBeFocused();
    await expect(aba(page, BANKUP)).toHaveAttribute("aria-selected", "true");
  });

  test("Home e End vão para a primeira e a última aba", async ({ page }) => {
    await aba(page, TAILOR_RESUME).focus();

    await page.keyboard.press("End");
    await expect(aba(page, BANKUP)).toHaveAttribute("aria-selected", "true");

    await page.keyboard.press("Home");
    await expect(aba(page, TAILOR_RESUME)).toBeFocused();
    await expect(aba(page, TAILOR_RESUME)).toHaveAttribute("aria-selected", "true");
  });

  test("só a aba selecionada entra na ordem do Tab, e o Tab segue para o painel", async ({ page }) => {
    await aba(page, TAILOR_RESUME).focus();

    await page.keyboard.press("Tab");
    await expect(painel(page)).toBeFocused();
  });
});

test.describe("desktop: Vitrine guiada pelo scroll", () => {
  test("rolar avança os projetos em ordem, com a Vitrine fixa na tela", async ({ page }) => {
    const vistos = [await indiceSelecionado(page)];

    for (let passo = 0; passo < 16 && vistos.at(-1) < 3; passo += 1) {
      await rolar(page, 200);
      const atual = await indiceSelecionado(page);
      if (atual !== vistos.at(-1)) vistos.push(atual);
      await expect(secaoProjetos(page).getByRole("tablist")).toBeInViewport();
    }

    expect(vistos).toEqual([0, 1, 2, 3]);
  });

  test("clicar numa aba leva o scroll até o projeto dela, nos dois sentidos", async ({ page }) => {
    const inicio = await scrollParado(page);

    await aba(page, BANKUP).click();
    const noBankup = await scrollParado(page);
    expect(noBankup).toBeGreaterThan(inicio + 200);
    await expect(aba(page, BANKUP)).toHaveAttribute("aria-selected", "true");
    await expect(painel(page).getByRole("heading", { name: BANKUP })).toBeVisible();

    await aba(page, TAILOR_RESUME).click();
    expect(await scrollParado(page)).toBeLessThan(noBankup - 200);
    await expect(aba(page, TAILOR_RESUME)).toHaveAttribute("aria-selected", "true");
  });

  // Rolar por conta própria no meio do scroll disparado pela aba interrompe esse
  // scroll antes do destino; a seleção precisa voltar a acompanhar a rolagem.
  test("rolar durante o scroll de uma aba não trava a seleção", async ({ page }) => {
    await aba(page, BANKUP).click();
    const noBankup = await scrollParado(page);

    await aba(page, TAILOR_RESUME).click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(noBankup - 50);
    // PageUp em vez da roda: page.mouse.wheel retorna antes de o evento chegar à página.
    await page.keyboard.press("PageUp");
    // Garante a interrupção, que no headless nem sempre acontece: para onde está.
    await page.evaluate(() => window.scrollTo({ top: window.scrollY, behavior: "instant" }));
    await scrollParado(page);

    // O scroll interrompido nunca chegou ao tailor-resume; de volta ao fim, vale o Bankup.
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), noBankup - 20);
    await scrollParado(page);

    await expect(aba(page, BANKUP)).toHaveAttribute("aria-selected", "true");
  });
});

// Se a Vitrine fixa for mais alta que a tela, o fim do painel fica inalcançável.
for (const viewport of [
  { width: 1280, height: 720 },
  { width: 1024, height: 768 },
  { width: 900, height: 700 },
]) {
  test.describe(`tela ${viewport.width}x${viewport.height}`, () => {
    test.use({ viewport });

    test("rolando, o painel inteiro do tailor-resume aparece na tela", async ({ page }) => {
      const link = painel(page).getByRole("link", { name: "Ver no GitHub" });
      let alcancou = false;

      for (let passo = 0; passo < 20 && !alcancou; passo += 1) {
        await rolar(page, 120);
        if ((await aba(page, TAILOR_RESUME).getAttribute("aria-selected")) !== "true") break;
        alcancou = await link.evaluate((el) => el.getBoundingClientRect().bottom <= innerHeight);
      }

      expect(alcancou).toBe(true);
    });
  });
}

for (const [contexto, opcoes] of [
  ["celular", { viewport: { width: 390, height: 844 } }],
  ["menos movimento", { reducedMotion: "reduce" }],
  // Desktop largo, mas baixo demais para o painel mais alto: fixar esconderia o fim dele.
  ["tela baixa demais para o painel", { viewport: { width: 1280, height: 560 } }],
]) {
  test.describe(`${contexto}: Vitrine sem pin`, () => {
    test.use(opcoes);

    test("rolar passa pela Vitrine sem trocar de projeto", async ({ page }) => {
      for (let passo = 0; passo < 8; passo += 1) {
        await page.mouse.wheel(0, 250);
      }

      await expect(secaoProjetos(page).getByRole("tablist")).not.toBeInViewport();
      await expect(aba(page, TAILOR_RESUME)).toHaveAttribute("aria-selected", "true");
    });

    test("as abas trocam o projeto por clique", async ({ page }) => {
      await aba(page, VBA).click();

      await expect(aba(page, VBA)).toHaveAttribute("aria-selected", "true");
      await expect(painel(page).getByRole("heading", { name: VBA })).toBeVisible();
    });
  });
}

// As entradas no scroll não podem tirar conteúdo da árvore de acessibilidade
// (visibility: hidden): getByRole só encontra o que um leitor de tela encontra.
test("os projetos já estão acessíveis a leitores de tela antes de rolar até eles", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 2, name: "Projetos em destaque" })).toBeAttached();
  await expect(abas(page)).toHaveCount(4);
});

test("a página não tem links para # nem janela de detalhes", async ({ page }) => {
  await expect(page.locator('a[href="#"]')).toHaveCount(0);
  // getByRole ignora elementos ocultos; o modal fechado passaria despercebido.
  await expect(page.locator('[role="dialog"]')).toHaveCount(0);
});
