// Orquestração: navegação entre telas, stepper de fases e passagem de estado entre os módulos.
import { iniciarPreparacao } from "./preparacao.js";
import { iniciarCaptura } from "./captura.js";
import { iniciarRetorno } from "./retorno.js";

// Fase `n` ativa; as anteriores concluídas. n = 6 → todas concluídas (aria-current fica na 5).
export function stepper(n) {
  const atual = Math.min(n, 5);
  for (const li of document.querySelectorAll("#stepper-fluxo .step-item")) {
    const s = Number(li.dataset.step);
    li.classList.toggle("is-completed", s < n);
    li.classList.toggle("is-active", s === n);
    if (s === atual) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
  }
}

export function mostrarTela(nome) {
  for (const v of document.querySelectorAll("[data-view]")) {
    const ativa = v.dataset.view === nome;
    v.classList.toggle("view-active", ativa);
    v.classList.toggle("view-hidden", !ativa);
  }
  scrollTo(0, 0);
  document.querySelector(".col-esq-corpo")?.scrollTo(0, 0); // desktop: a coluna rola sozinha
  const titulo = document.querySelector(`[data-view="${nome}"] h1`);
  titulo.tabIndex = -1;
  titulo.focus();
}

iniciarPreparacao((entidades) => {
  mostrarTela("captura");
  stepper(2);
  iniciarRetorno(iniciarCaptura(entidades));
});
