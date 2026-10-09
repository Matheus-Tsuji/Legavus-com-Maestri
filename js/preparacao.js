// Tela 1: Preparação. Passo 1 carrega entidades; passo 2 conecta IA e ativa o Leitor.
import { carregarEntidadesDoUsuario, conectarIA, ativarLeitorNarrativo } from "../services/mock.js";

const $ = (id) => document.getElementById(id);
const TEXTO_STATUS = { idle: "Aguardando", loading: "Carregando…", ok: "OK", nok: "NOK" };
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

function barra(id, pct) {
  $(id).style.setProperty("--progress", pct + "%");
  $(id).setAttribute("aria-valuenow", pct);
}

function status(id, s) {
  $(id).dataset.status = s;
  $(id).textContent = TEXTO_STATUS[s];
}

// aoAvancar(entidades) é chamado no clique de #btn-avancar-captura.
export function iniciarPreparacao(aoAvancar) {
  let entidades = null;

  async function passo1() {
    $("btn-passo-1").disabled = true;
    $("btn-retry-passo-1").hidden = true;
    const contador = $("contador-referencias");
    for (const t of ["pessoas", "lugares"]) { barra("progresso-" + t, 15); status("status-" + t, "loading"); }
    contador.textContent = "Carregando referências do seu Grafo…";
    try {
      entidades = await carregarEntidadesDoUsuario();
    } catch {
      for (const t of ["pessoas", "lugares"]) { barra("progresso-" + t, 0); status("status-" + t, "nok"); }
      contador.textContent = "Não foi possível carregar as referências.";
      $("btn-retry-passo-1").hidden = false;
      return;
    }
    // Contagem visível item a item: primeiro Pessoas, depois Lugares.
    const total = entidades.pessoas.length + entidades.lugares.length;
    let n = 0;
    for (const t of ["pessoas", "lugares"]) {
      const lista = entidades[t];
      for (let i = 1; i <= lista.length; i++) {
        n++;
        barra("progresso-" + t, Math.round((i / lista.length) * 100));
        contador.textContent = `Carregando referências do seu Grafo… [${n}/${total}]`;
        await esperar(90);
      }
      status("status-" + t, "ok");
    }
    contador.textContent = "✓ Referências carregadas";
    $("btn-passo-2").disabled = false;
  }

  // Etapas já OK são puladas no "Tentar novamente".
  const etapas2 = [
    { id: "conectar-ia", fn: conectarIA },
    { id: "ativar-leitor", fn: ativarLeitorNarrativo }
  ];

  async function passo2() {
    $("btn-passo-2").disabled = true;
    $("btn-retry-passo-2").hidden = true;
    for (const { id, fn } of etapas2) {
      if ($("status-" + id).dataset.status === "ok") continue;
      barra("progresso-" + id, 60);
      status("status-" + id, "loading");
      try {
        await fn();
      } catch {
        barra("progresso-" + id, 0);
        status("status-" + id, "nok");
        $("btn-retry-passo-2").hidden = false;
        return;
      }
      barra("progresso-" + id, 100);
      status("status-" + id, "ok");
    }
    $("btn-avancar-captura").disabled = false;
  }

  $("btn-passo-1").addEventListener("click", passo1);
  $("btn-retry-passo-1").addEventListener("click", passo1);
  $("btn-passo-2").addEventListener("click", passo2);
  $("btn-retry-passo-2").addEventListener("click", passo2);
  $("btn-avancar-captura").addEventListener("click", () => aoAvancar(entidades));
}
