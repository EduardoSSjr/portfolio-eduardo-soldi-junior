export const ORIGIN_LABELS = {
  "open-source": "Código aberto",
  corporate: "Corporativo",
  academic: "Acadêmico",
};

// Falha alto em vez de renderizar um card inconsistente: a origem decide se o
// projeto pode (e precisa) ter repositório público.
export function defineProject(project) {
  const { title, origin, repository } = project;

  if (!(origin in ORIGIN_LABELS)) {
    throw new Error(`Projeto "${title}": origem "${origin}" desconhecida.`);
  }
  if (origin === "open-source" && !repository) {
    throw new Error(`Projeto "${title}": código aberto precisa de repositório.`);
  }
  if (origin !== "open-source" && repository) {
    throw new Error(`Projeto "${title}": origem ${ORIGIN_LABELS[origin]} não pode ter repositório.`);
  }
  return project;
}

export const projects = [
  defineProject({
    title: "tailor-resume — Skill de IA para adaptar currículos",
    origin: "open-source",
    description:
      "Skill para o Claude Code que adapta um currículo em LaTeX para cada vaga, sem nunca inventar experiência.",
    technologies: ["Claude Code", "Agent Skills", "Spec-Driven Development", "Evals de IA", "LaTeX"],
    highlight: "Skill de IA",
    context:
      "Adaptar o currículo para cada vaga é repetitivo, e pedir isso a uma IA genérica cria um problema pior: ela inventa habilidades e experiências que a pessoa não tem. A skill reescreve apenas a ênfase e a ordem do que já está no currículo, pergunta quando a vaga exige algo que não aparece nele e entrega o PDF compilado dentro do limite de páginas.",
    impact:
      "Em uso real nas minhas próprias candidaturas e pronta para outras pessoas usarem: qualquer um pode clonar o repositório e instalar com um script (Windows, Linux ou macOS). As regras de fidelidade são verificadas por uma suíte de evals, e todo o desenvolvimento está documentado em issues públicas.",
    repository: "https://github.com/EduardoSSjr/tailor-resume",
    inProgress: true,
  }),
  defineProject({
    title: "Automação de Relatórios com n8n",
    origin: "corporate",
    description:
      "Fluxo automatizado para geração, organização e padronização de relatórios internos, reduzindo etapas manuais e melhorando a produtividade.",
    technologies: ["n8n", "APIs", "Webhooks", "Automação"],
    highlight: "Automação operacional",
    context:
      "Projeto voltado a eliminar tarefas repetitivas no processo de consolidação e encaminhamento de informações internas.",
    impact:
      "Maior padronização, menos intervenção manual e melhor previsibilidade na rotina operacional.",
  }),
  defineProject({
    title: "Integração de IA com Excel via VBA",
    origin: "corporate",
    description:
      "Integração entre Microsoft Excel, VBA e OpenAI API em uma planilha financeira, criando apoio inteligente para análise de informações.",
    technologies: ["VBA", "Excel", "OpenAI API", "Automação"],
    highlight: "IA aplicada",
    context:
      "Projeto desenvolvido para ampliar a capacidade analítica em planilhas já utilizadas no dia a dia, sem exigir troca de ferramenta.",
    impact:
      "Apoio mais rápido a análises, consulta assistida por IA e ganho de produtividade em tarefas financeiras.",
  }),
  defineProject({
    title: "Bankup — Sistema Financeiro Web",
    origin: "academic",
    description:
      "Projeto integrador da FATEC com desenvolvimento de sistema financeiro web, banco relacional, API e estrutura conteinerizada.",
    technologies: ["JavaScript", "PostgreSQL", "Docker", "API"],
    highlight: "Projeto integrador",
    context:
      "Desenvolvimento acadêmico com foco em aplicação web financeira, estruturação de regras de negócio e integração entre camadas.",
    impact:
      "Consolidação de conhecimentos em desenvolvimento web, banco de dados e organização de uma arquitetura aplicada.",
  }),
];
