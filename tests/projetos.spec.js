import { expect, test } from "@playwright/test";

const TAILOR_RESUME = "tailor-resume — Skill de IA para adaptar currículos";
const N8N = "Automação de Relatórios com n8n";
const VBA = "Integração de IA com Excel via VBA";
const BANKUP = "Bankup — Sistema Financeiro Web";
const SEM_CODIGO_PUBLICO = [N8N, VBA, BANKUP];
const REPOSITORIO_TAILOR_RESUME = "https://github.com/EduardoSSjr/tailor-resume";

const secaoProjetos = (page) => page.getByRole("region", { name: "Projetos em destaque" });
const projetos = (page) => secaoProjetos(page).getByRole("article");
const card = (page, titulo) =>
  projetos(page).filter({ has: page.getByRole("heading", { name: titulo }) });
const botaoDetalhes = (page, titulo) =>
  page.getByRole("button", { name: `Ver detalhes do projeto ${titulo}` });

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  // Os cards só aparecem quando entram na tela (animação de scroll), como para
  // um visitante de verdade: rola até o fim da seção antes de cada teste.
  await secaoProjetos(page).evaluate((secao) => secao.scrollIntoView({ block: "end" }));
});

test("tailor-resume é o primeiro projeto, seguido de n8n, VBA e Bankup", async ({ page }) => {
  await expect(projetos(page).getByRole("heading", { level: 3 })).toHaveText([
    TAILOR_RESUME,
    N8N,
    VBA,
    BANKUP,
  ]);
});

// O selo exato também garante que o card corporativo não acrescenta o nome da
// empresa ("Corporativo · ...").
for (const [titulo, origem] of [
  [TAILOR_RESUME, "Código aberto"],
  [N8N, "Corporativo"],
  [VBA, "Corporativo"],
  [BANKUP, "Acadêmico"],
]) {
  test(`card "${titulo}" mostra o selo de origem ${origem}`, async ({ page }) => {
    await expect(card(page, titulo).getByText(origem, { exact: true })).toBeVisible();
  });
}

test("card do tailor-resume está em evolução e leva ao repositório no GitHub", async ({ page }) => {
  const tailorResume = card(page, TAILOR_RESUME);

  await expect(tailorResume).toContainText("Em evolução");
  await expect(tailorResume.getByRole("link")).toHaveAttribute("href", REPOSITORIO_TAILOR_RESUME);
});

for (const titulo of SEM_CODIGO_PUBLICO) {
  test(`projeto sem código público "${titulo}" não tem repositório nem etiqueta de evolução`, async ({
    page,
  }) => {
    await expect(card(page, titulo).getByRole("link")).toHaveCount(0);
    await expect(card(page, titulo)).not.toContainText("Em evolução");
  });
}

test("a página não tem links para #", async ({ page }) => {
  await expect(page.locator('a[href="#"]')).toHaveCount(0);
});

test.describe("detalhes do projeto", () => {
  test("projeto de código aberto oferece Ver no GitHub", async ({ page }) => {
    await botaoDetalhes(page, TAILOR_RESUME).click();

    const dialogo = page.getByRole("dialog", { name: TAILOR_RESUME });
    await expect(dialogo).toBeVisible();
    await expect(dialogo.getByRole("link", { name: "Ver no GitHub" })).toHaveAttribute(
      "href",
      REPOSITORIO_TAILOR_RESUME,
    );
  });

  for (const titulo of SEM_CODIGO_PUBLICO) {
    test(`projeto sem código público "${titulo}" abre sem nenhum link`, async ({ page }) => {
      await botaoDetalhes(page, titulo).click();

      const dialogo = page.getByRole("dialog", { name: titulo });
      await expect(dialogo).toBeVisible();
      await expect(dialogo.getByRole("link")).toHaveCount(0);
    });
  }

  test("clicar no corpo do card abre os detalhes", async ({ page }) => {
    await card(page, BANKUP).getByRole("heading", { name: BANKUP }).click();

    await expect(page.getByRole("dialog", { name: BANKUP })).toBeVisible();
  });

  test("Esc fecha e devolve o foco ao card", async ({ page }) => {
    await botaoDetalhes(page, N8N).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(botaoDetalhes(page, N8N)).toBeFocused();
  });

  test("botão Fechar fecha e devolve o foco ao card", async ({ page }) => {
    await botaoDetalhes(page, TAILOR_RESUME).click();

    await page.getByRole("button", { name: "Fechar detalhes do projeto" }).click();

    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(botaoDetalhes(page, TAILOR_RESUME)).toBeFocused();
  });

  for (const tecla of ["Tab", "Shift+Tab"]) {
    test(`${tecla} não deixa o foco sair do modal aberto`, async ({ page }) => {
      await botaoDetalhes(page, TAILOR_RESUME).click();
      const dialogo = page.getByRole("dialog", { name: TAILOR_RESUME });

      for (let i = 0; i < 4; i += 1) {
        await page.keyboard.press(tecla);
        await expect(dialogo.locator(":focus")).toHaveCount(1);
      }
    });
  }
});
