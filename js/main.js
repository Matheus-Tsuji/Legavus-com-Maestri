// Orquestração: navegação entre telas e passagem de estado entre os módulos.
import { iniciarPreparacao } from "./preparacao.js";
import { iniciarCaptura } from "./captura.js";
import { iniciarRetorno } from "./retorno.js";

export function mostrarTela(nome) {
  for (const v of document.querySelectorAll("[data-view]")) {
    const ativa = v.dataset.view === nome;
    v.classList.toggle("view-active", ativa);
    v.classList.toggle("view-hidden", !ativa);
  }
  scrollTo(0, 0);
  const titulo = document.querySelector(`[data-view="${nome}"] h1`);
  titulo.tabIndex = -1;
  titulo.focus();
}

iniciarPreparacao((entidades) => {
  mostrarTela("captura");
  iniciarRetorno(iniciarCaptura(entidades));
});
