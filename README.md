# Portfolio Eduardo Soldi Junior

Primeira versao do portfolio profissional de Eduardo Soldi Junior, Analista e Desenvolvedor de Sistemas.

O projeto foi criado com HTML, CSS e JavaScript puro, com foco em uma pagina responsiva, limpa e preparada para deploy futuro na Vercel.

## Estrutura

```text
.
├── assets/images
├── docs
├── index.html
├── src/css/style.css
├── src/js/main.js
└── src/js/projects.js
```

## Como abrir localmente

Basta abrir o arquivo `index.html` no navegador.

Tambem e possivel usar uma extensao como Live Server no VS Code para recarregamento automatico durante edicoes.

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

## Deploy futuro na Vercel

1. Envie o projeto para um repositorio no GitHub.
2. Acesse a Vercel e importe esse repositorio.
3. Como o projeto e estatico, a Vercel deve reconhecer automaticamente a estrutura.
4. Configure o dominio na Vercel.
5. Atualize os apontamentos DNS na Hostinger conforme as instrucoes da Vercel.

Como este projeto usa apenas arquivos estaticos, nao e necessario configurar build command.
