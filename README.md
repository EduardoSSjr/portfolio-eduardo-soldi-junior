# Portfolio Eduardo Soldi Junior

Portfólio profissional de Eduardo Soldi Junior, Analista e Desenvolvedor de Sistemas.

O projeto usa Vite, HTML, CSS, JavaScript puro e GSAP. A versão de produção continua sendo um site estático, responsivo e compatível com a Vercel.

## Estrutura

```text
.
├── assets/documents
├── docs
├── index.html
├── package.json
├── playwright.config.js
├── src
│   ├── css/site.css
│   └── js
│       ├── projects.js
│       └── site.js
├── tests
└── pnpm-lock.yaml
```

## Como executar localmente

Instale as dependências:

```bash
pnpm install
```

Inicie o ambiente de desenvolvimento:

```bash
pnpm dev
```

Para gerar a versão estática otimizada:

```bash
pnpm build
```

## Testes

A suíte usa [Playwright](https://playwright.dev) e roda contra o **build de produção** (`vite build` + `vite preview`), o mesmo artefato publicado na Vercel. Os testes verificam só o comportamento visível — o que o visitante vê e faz — e não a estrutura interna do código, para sobreviver a mudanças de visual.

Na primeira vez, instale o navegador:

```bash
pnpm exec playwright install chromium
```

Depois, rode a suíte:

```bash
pnpm test
```

## Como adicionar novos projetos

Edite `src/js/projects.js` e adicione um item ao array `projects`, envolvido em `defineProject`:

```js
defineProject({
  title: "Nome do projeto",
  origin: "corporate", // "open-source" | "corporate" | "academic"
  description: "Descrição curta, exibida no painel da Vitrine.",
  technologies: ["Tecnologia 1", "Tecnologia 2"],
  highlight: "Área do projeto",
  context: "Qual problema o projeto resolve (exibido no painel).",
  impact: "O que mudou, sem números inventados (exibido no painel).",
  repository: "https://github.com/...", // só para "open-source", obrigatório nele
  inProgress: true, // opcional: exibe a etiqueta "Em evolução"
})
```

A `origin` decide como o projeto aparece (veja os termos em `GLOSSARY.md`): só projetos de código aberto têm repositório e o link "Ver no GitHub". Uma combinação inválida — código aberto sem repositório, outra origem com repositório, origem desconhecida — lança um erro ao carregar o site, em vez de exibir um projeto inconsistente.

Os projetos aparecem na **Vitrine**: uma aba por projeto, na ordem do array, e um painel com o projeto selecionado. No desktop a Vitrine fica fixa enquanto a página rola, e o scroll avança de um projeto para o próximo — desde que o painel mais alto caiba inteiro na tela. Em telas baixas, no celular e com `prefers-reduced-motion` ela rola como uma seção comum e as abas funcionam por clique e teclado. Por isso, se um projeto novo tiver textos muito longos, a Vitrine pode deixar de ficar fixa em notebooks menores.

## Como fazer novos commits

Comandos principais:

```bash
git status
git add .
git commit -m "descreva sua alteracao"
```

No Codex, voce tambem pode pedir algo como:

> Faça um commit com as alterações atuais usando a mensagem "atualiza seção de projetos".

## Como enviar para o GitHub manualmente

Caso o GitHub CLI nao esteja instalado ou autenticado, crie um repositorio vazio no GitHub chamado `portfolio` ou `portfolio-eduardo-soldi-junior` e execute:

```bash
git remote add origin https://github.com/SEU-USUARIO/portfolio.git
git branch -M main
git push -u origin main
```

Se preferir usar outro nome de repositorio, ajuste a URL do remote.

## Deploy na Vercel

1. Após aprovação visual, envie o projeto ao GitHub.
2. Importe o repositório na Vercel.
3. Use o preset Vite.
4. Build command: `pnpm build`.
5. Output directory: `dist`.
6. Preserve o domínio e o script do Vercel Analytics já presente no HTML.

A publicação só deve ocorrer após aprovação explícita da versão local.
