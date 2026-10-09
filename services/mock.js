// Servicos simulados. Cada funcao e um ponto de troca pelo backend real.
import { entidades } from "../data/entidades.js";

// Simulacao de falha (NOK): adicione o nome da funcao ao Set, ou abra a pagina com
// ?nok=conectarIA,ativarLeitorNarrativo (nomes separados por virgula).
export const simulacao = {
  falhar: new Set(new URLSearchParams(globalThis.location?.search).get("nok")?.split(",") ?? [])
};

// Espera aleatoria entre 400ms e 1200ms; rejeita se a funcao estiver marcada para falhar.
function simular(nome, resultado) {
  const ms = 400 + Math.random() * 800;
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (simulacao.falhar.has(nome)) reject(new Error(`[NOK] ${nome} (falha simulada)`));
      else resolve(resultado());
    }, ms)
  );
}

// Contadores dos proximos ids (P006, L006...), partindo do tamanho das listas mock.
const proximoId = { Pessoa: entidades.pessoas.length + 1, Lugar: entidades.lugares.length + 1 };

// TROCAR PELO BACKEND: buscar Pessoas e Lugares do Grafo do usuario.
export function carregarEntidadesDoUsuario() {
  return simular("carregarEntidadesDoUsuario", () => structuredClone(entidades));
}

// TROCAR PELO BACKEND: abrir conexao com o servico de IA.
export function conectarIA() {
  return simular("conectarIA", () => ({ sucesso: true }));
}

// TROCAR PELO BACKEND: ativar o Leitor Narrativo.
export function ativarLeitorNarrativo() {
  return simular("ativarLeitorNarrativo", () => ({ sucesso: true }));
}

// TROCAR PELO BACKEND: enviar a narrativa ao Leitor Narrativo (payload: PLANO.md 4.2).
export function enviarAoLeitorNarrativo(payload) {
  return simular("enviarAoLeitorNarrativo", () => ({
    sucesso: true,
    parecer: "[CONTEUDO DO LEITOR: Parecer Narrativo]",
    narrativaRevisada: "[CONTEUDO DO LEITOR: Narrativa Revisada]",
    lacunas: ["[CONTEUDO DO LEITOR: Lacuna 1]", "[CONTEUDO DO LEITOR: Lacuna 2]"],
    perguntasValidacao: ["[CONTEUDO DO LEITOR: Pergunta 1]", "[CONTEUDO DO LEITOR: Pergunta 2]"],
    dossieResumo: "[CONTEUDO DO LEITOR: Dossie Narrativo]",
    referenciasIdentificadas: (payload?.referencias ?? []).map((r) => ({
      tipo: r.tipo,
      id: r.idGrafo,
      label: r.texto,
      status: r.status,
      origem: "marcado_pelo_usuario"
    }))
  }));
}

// TROCAR PELO BACKEND: gravar a nova entidade no "arquivo texto fonte das entidades".
// Gera o id (P006, L006...) e marca status "new"; incluir na lista em memoria fica com quem chama.
export function salvarEntidadeNoArquivo(entidade) {
  return simular("salvarEntidadeNoArquivo", () => {
    const tipo = entidade.entityType === "Lugar" ? "Lugar" : "Pessoa";
    const id = tipo[0] + String(proximoId[tipo]++).padStart(3, "0");
    return { ...entidade, id, status: "new" };
  });
}
