# Especificacao do Redesign do Portfolio

## Objetivo

Redesenhar o portfolio de Eduardo Soldi Junior para gerar uma primeira impressao mais memoravel e autoral, mantendo leitura profissional e objetiva para recrutadores. O site tambem deve funcionar como vitrine para clientes interessados em automacao, integracao e melhoria de processos.

## Publico Prioritario

1. Recrutadores e gestores avaliando oportunidades em Analise e Desenvolvimento de Sistemas, automacao, dados, integracao e infraestrutura.
2. Empresas ou clientes interessados em projetos de tecnologia e automacao de processos.

## Posicionamento

Eduardo combina experiencia real em operacao e infraestrutura corporativa com desenvolvimento, automacao, dados e integracao de sistemas. A mensagem central deve comunicar capacidade de entender processos reais e transformar demandas operacionais em solucoes tecnicas confiaveis.

## Direcao Criativa

- Referencia de ambicao: portfolios contemporaneos e interativos, no nivel de cuidado visual associado a Awwwards.
- Estetica: escura, sofisticada e tecnica, com roxo profundo como cor principal, lavanda e violeta eletrico como destaques; pode haver um acento quente discreto para contraste.
- Evitar: aparencia generica de template, excesso de cards, gradientes decorativos, texto de marketing vazio, efeitos que prejudiquem a leitura ou a navegacao.
- A primeira tela deve ser forte, editorial e claramente identificar Eduardo, sua area e sua proposta de valor.
- Usar composicoes abstratas relacionadas a fluxos, automacao, dados, integracao e sistemas. Nao inventar clientes, resultados numericos ou cases.

## Conteudo a Preservar

- Nome: Eduardo Soldi Junior.
- Cargo: Analista e Desenvolvedor de Sistemas.
- Focos: desenvolvimento de sistemas, analise de sistemas, automacoes, dados, inteligencia artificial e infraestrutura.
- Contatos atuais: eduardosjr06@gmail.com, WhatsApp +55 12 98202-2685, LinkedIn linkedin.com/in/eduardosoldi, GitHub github.com/EduardoSSjr.
- Projetos existentes em src/js/projects.js, mantidos como dados editaveis e exibidos em cards/modais.
- Secoes: inicio, sobre, habilidades, projetos e contato.
- Vercel Analytics ja esta configurado via script em index.html.

## Curriculo para Download

- Copiar C:\Users\edxlty\Downloads\EduardoSoldiCV.pdf para assets/documents/EduardoSoldiCV.pdf.
- Criar links de download com o atributo download no menu, na primeira tela e na secao de contato.
- Nome sugerido no download: Curriculo-Eduardo-Soldi-Junior.pdf.
- Validar que o arquivo responde corretamente no ambiente local e depois da publicacao na Vercel.

## Motion e Interacao

- Animacoes de entrada suaves e coordenadas quando elementos entram na viewport.
- Microinteracoes claras em botoes, links, cards e abertura/fechamento de modais.
- Uma interacao visual de maior impacto na primeira tela e movimento leve nas demais secoes.
- Respeitar prefers-reduced-motion: reduzir ou remover animacoes para usuarios que solicitam menos movimento.
- Nenhuma animacao deve bloquear navegacao, esconder informacao ou causar mudancas bruscas de layout.

## Requisitos Tecnicos

- Manter HTML, CSS e JavaScript puro; nao migrar para framework sem aprovacao explicita.
- Manter layout responsivo para desktop e celular.
- Usar semanticamente HTML, foco visivel, menu acessivel e modal operavel por teclado.
- Usar assets locais otimizados quando houver imagens; nao usar links temporarios locais ou arquivos fora do repositorio.
- Garantir que todos os links de email, WhatsApp, LinkedIn, GitHub, projetos e curriculo funcionem.
- Preservar o deploy atual via GitHub para Vercel e dominio esjr.com.br.

## Processo de Implementacao

1. Inspecionar o estado atual do site, arquivos, links e curriculo.
2. Criar uma direcao visual e implementar primeiro a estrutura e a primeira dobra.
3. Aplicar o mesmo sistema visual as secoes restantes, sem perder clareza de curriculo profissional.
4. Adicionar motion, interacoes e comportamento de acessibilidade.
5. Copiar e conectar o curriculo para download.
6. Validar em desktop e mobile, incluindo links e modais.
7. Apresentar a versao local para aprovacao antes de publicar no GitHub e na Vercel.

## Criterios de Aceite

- O site passa uma percepcao de portfolio profissional autoral, e nao de template generico.
- Um recrutador entende em poucos segundos quem e Eduardo, sua area e seus diferenciais.
- Um visitante consegue baixar o curriculo em PDF sem erro.
- A navegacao, o menu, os modais e todos os links funcionam em desktop e celular.
- As animacoes enriquecem a experiencia sem comprometer desempenho, acessibilidade ou leitura.
- Nenhuma publicacao ocorre sem aprovacao explicita da versao local.
