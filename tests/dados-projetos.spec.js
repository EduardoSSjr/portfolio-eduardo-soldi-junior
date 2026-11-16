import { expect, test } from "@playwright/test";
import { defineProject } from "../src/js/projects.js";

const base = {
  title: "Projeto de teste",
  description: "Descrição.",
  technologies: ["JavaScript"],
  highlight: "Teste",
  context: "Contexto.",
  impact: "Resultado.",
};

test("projeto de código aberto com repositório é aceito", () => {
  const projeto = { ...base, origin: "open-source", repository: "https://github.com/x/y" };

  expect(defineProject(projeto)).toEqual(projeto);
});

test("projeto sem código público (corporativo ou acadêmico) é aceito sem repositório", () => {
  expect(() => defineProject({ ...base, origin: "corporate" })).not.toThrow();
  expect(() => defineProject({ ...base, origin: "academic" })).not.toThrow();
});

test("código aberto sem repositório é rejeitado", () => {
  expect(() => defineProject({ ...base, origin: "open-source" })).toThrow(
    /Projeto de teste.*código aberto.*repositório/i,
  );
});

test("projeto corporativo com repositório é rejeitado", () => {
  expect(() =>
    defineProject({ ...base, origin: "corporate", repository: "https://github.com/x/y" }),
  ).toThrow(/Projeto de teste.*não pode ter repositório/i);
});

test("origem desconhecida é rejeitada", () => {
  expect(() => defineProject({ ...base, origin: "pessoal" })).toThrow(
    /Projeto de teste.*origem "pessoal"/i,
  );
});
