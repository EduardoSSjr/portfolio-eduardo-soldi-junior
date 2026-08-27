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
├── src
│   ├── css/site.css
│   └── js
│       ├── projects.js
│       └── site.js
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

## Como adicionar novos projetos

Edite o arquivo `src/js/projects.js` e adicione um novo item no array `projects`:

```js
{
  title: "Nome do projeto",
  description: "Descricao curta do projeto.",
  technologies: ["Tecnologia 1", "Tecnologia 2"],
  url: "https://link-do-projeto.com"
}
```

Se ainda nao houver link publico para o projeto, mantenha `url: "#"`.

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
