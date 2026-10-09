// Tela 2.2: Dossiê Narrativo (retorno do Leitor), acordeão, comparação original × revisada e stepper.
import { enviarAoLeitorNarrativo } from "../services/mock.js";
import { stepper } from "./main.js";

const $ = (id) => document.getElementById(id);
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

function lista(el, itens) {
  const ul = document.createElement("ul");
  for (const t of itens) {
    const li = document.createElement("li");
    li.textContent = t;
    ul.append(li);
  }
  el.replaceChildren(ul);
}

function chips(refs) {
  const box = $("dossie-chips-container");
  if (!refs.length) { box.textContent = "Nenhuma referência marcada com @ ou #."; return; }
  box.replaceChildren(...refs.map((r) => {
    const c = document.createElement("span");
    c.className = "chip";
    c.dataset.entityType = r.tipo;
    c.dataset.status = r.status;
    const info = document.createElement("small");
    info.textContent = `${r.tipo} · ${r.id} · ${r.status}`;
    c.append(r.label + " ", info);
    return c;
  }));
}

// captura = { montarPayload, validar, estado } de iniciarCaptura().
// Enviar: fase 3 + Dossiê carregando → Leitor → Dossiê pronto → fase 4 (Análise Ontológica) → todas concluídas.
export function iniciarRetorno(captura) {
  const painel = $("painel-dossie"), enviar = $("btn-enviar-analise");
  const msg = $("msg-validacao-narrativa");
  let versoes = { original: "", revisada: "" };
  let fase = 2; // fase do stepper antes do envio, para restaurar se o Leitor falhar

  function mostrarVersao(modo) {
    for (const b of $("toggle-comparacao").querySelectorAll("[data-mode]")) b.setAttribute("aria-pressed", b.dataset.mode === modo);
    $("dossie-narrativa-texto").textContent = versoes[modo];
  }

  function ocupado(sim) {
    captura.estado.ocupado = sim;
    enviar.disabled = true; // depois do registro só reabilita quando o usuário editar (validar)
  }

  enviar.addEventListener("click", async () => {
    const payload = captura.montarPayload();
    const anterior = painel.dataset.state;
    ocupado(true);
    stepper(3);
    painel.dataset.state = "loading";
    msg.textContent = "";
    let r;
    try {
      r = await enviarAoLeitorNarrativo(payload);
    } catch {
      painel.dataset.state = anterior;
      stepper(fase);
      ocupado(false);
      captura.validar();
      msg.textContent = "O Leitor Narrativo não respondeu. Tente enviar novamente.";
      return;
    }
    chips(r.referenciasIdentificadas);
    $("dossie-parecer-texto").textContent = r.parecer;
    lista($("dossie-lacunas-texto"), r.lacunas);
    lista($("dossie-perguntas-texto"), r.perguntasValidacao);
    $("dossie-resumo-texto").textContent = r.dossieResumo;
    versoes = { original: payload.texto, revisada: r.narrativaRevisada };
    mostrarVersao($("toggle-comparacao").querySelector('[aria-pressed="true"]').dataset.mode);
    painel.dataset.state = "ready";

    stepper(4);
    msg.textContent = "Análise ontológica em andamento…";
    await esperar(1200); // TROCAR PELO BACKEND: envio para Análise Ontológica e Registro (sem função no mock por ora).
    stepper((fase = 6));
    ocupado(false);
    msg.textContent = "✓ Experiência registrada (simulação).";
  });

  $("toggle-comparacao").addEventListener("click", (e) => {
    const b = e.target.closest("[data-mode]");
    if (b) mostrarVersao(b.dataset.mode);
  });
}
