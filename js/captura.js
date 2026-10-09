// Tela 2.1: Captura. TipTap com @ (Pessoa) e # (Lugar), pop-up de nova entidade, validações e Ver JSON.
// API conferida em @tiptap/extension-mention@2.11.5 e @tiptap/suggestion@2.11.5 (src): Mention aceita
// um único `suggestion`, então os dois gatilhos viram dois plugins Suggestion com PluginKeys próprias.
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Mention from "@tiptap/extension-mention";
import Suggestion from "@tiptap/suggestion";
import { PluginKey } from "https://esm.sh/@tiptap/pm@2.27.3/state";
import { Decoration, DecorationSet } from "https://esm.sh/@tiptap/pm@2.27.3/view";
import { salvarEntidadeNoArquivo } from "../services/mock.js";

const $ = (id) => document.getElementById(id);
const MIN_PALAVRAS = 50;

// Gatilhos. Novo tipo (Obra, Experiência…) = nova linha aqui + lista em `entidades`.
const GATILHOS = [
  { char: "@", entityType: "Pessoa", lista: "pessoas", artigo: "nova pessoa" },
  { char: "#", entityType: "Lugar", lista: "lugares", artigo: "novo lugar" }
];
const charDo = (tipo) => GATILHOS.find((g) => g.entityType === tipo).char;

// Busca única para todos os gatilhos: includes, sem diferenciar maiúsculas, máx. 10.
export function buscarEntidades(lista, query) {
  const q = query.toLowerCase();
  return lista.filter((e) => e.label.toLowerCase().includes(q)).slice(0, 10);
}

// ---------- Menu de sugestões (um só popup, compartilhado pelos gatilhos) ----------
function criarMenu(gatilho, aoCriar) {
  let el, props, sel = 0, fechadoPorEsc = false;

  const itens = () => props.items;
  function desenhar() {
    if (fechadoPorEsc || !itens().length) { esconder(); return; }
    if (!el) {
      el = document.createElement("div");
      el.className = "tiptap-suggestions-popup";
      document.body.append(el);
    }
    const ul = document.createElement("ul");
    ul.className = "suggestion-list";
    ul.setAttribute("role", "listbox");
    ul.setAttribute("aria-label", gatilho.entityType === "Pessoa" ? "Pessoas" : "Lugares");
    itens().forEach((item, i) => {
      const li = document.createElement("li");
      li.className = "suggestion-item" + (item.criar ? " suggestion-item-create" : "") + (i === sel ? " is-selected" : "");
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", i === sel);
      li.dataset.index = i;
      li.textContent = item.criar ? `＋ Criar “${item.criar}” como ${gatilho.artigo}` : item.label;
      li.addEventListener("mousedown", (e) => { e.preventDefault(); escolher(i); });
      ul.append(li);
    });
    el.replaceChildren(ul);
    const r = props.clientRect?.();
    if (r) {
      const left = Math.max(8, Math.min(r.left, innerWidth - el.offsetWidth - 8));
      const abaixo = r.bottom + 6 + el.offsetHeight <= innerHeight;
      el.style.left = left + "px";
      el.style.top = (abaixo ? r.bottom + 6 : Math.max(8, r.top - 6 - el.offsetHeight)) + "px";
    }
    el.querySelector(".is-selected")?.scrollIntoView({ block: "nearest" });
  }
  function esconder() { el?.remove(); el = null; }
  function escolher(i) {
    const item = itens()[i];
    if (!item) return;
    if (item.criar) { esconder(); aoCriar(gatilho, item.criar, props, () => desenhar()); }
    else props.command({ id: item.id, label: item.label, entityType: item.entityType, status: item.status === "new" ? "new" : "existing" });
  }

  return {
    onStart: (p) => { props = p; sel = 0; fechadoPorEsc = false; desenhar(); },
    onUpdate: (p) => { props = p; sel = 0; desenhar(); },
    onExit: () => { esconder(); fechadoPorEsc = false; },
    onKeyDown: ({ event }) => {
      if (!el) return false;
      const n = itens().length;
      if (event.key === "ArrowDown") { sel = (sel + 1) % n; desenhar(); return true; }
      if (event.key === "ArrowUp") { sel = (sel - 1 + n) % n; desenhar(); return true; }
      if (event.key === "Enter" || event.key === "Tab") { escolher(sel); return true; }
      if (event.key === "Escape") { fechadoPorEsc = true; esconder(); return true; } // o texto digitado fica
      return false;
    }
  };
}

// ---------- Nó EntityReference ----------
function criarEntityReference(entidades, aoCriar) {
  return Mention.extend({
    name: "entityReference",

    addOptions() {
      return { ...this.parent?.(), deleteTriggerWithBackspace: true };
    },

    addAttributes() {
      const attr = (nome, data) => ({
        default: null,
        parseHTML: (el) => el.getAttribute(data),
        renderHTML: (a) => (a[nome] ? { [data]: a[nome] } : {})
      });
      return {
        id: attr("id", "data-id"),
        label: attr("label", "data-label"),
        entityType: attr("entityType", "data-entity-type"),
        status: { ...attr("status", "data-status"), default: "existing" }
      };
    },

    parseHTML() {
      return [{ tag: 'span[data-type="entity-reference"]' }];
    },

    renderHTML({ node, HTMLAttributes }) {
      return ["span", { ...HTMLAttributes, "data-type": "entity-reference", class: "entity-chip" }, node.attrs.label];
    },

    renderText({ node }) {
      return charDo(node.attrs.entityType) + node.attrs.label;
    },

    addProseMirrorPlugins() {
      const tipoNo = this.name;
      return GATILHOS.map((g) =>
        Suggestion({
          editor: this.editor,
          char: g.char,
          pluginKey: new PluginKey("entity-" + g.lista),
          items: ({ query }) => {
            const achados = buscarEntidades(entidades[g.lista], query);
            return query.trim() ? [...achados, { criar: query }] : achados;
          },
          command: ({ editor, range, props }) => inserirReferencia(editor, range, props, tipoNo),
          allow: ({ state, range }) =>
            !!state.doc.resolve(range.from).parent.type.contentMatch.matchType(state.schema.nodes[tipoNo]),
          render: () => criarMenu(g, aoCriar)
        })
      );
    }
  });
}

function inserirReferencia(editor, range, attrs, tipoNo = "entityReference") {
  if (editor.view.state.selection.$to.nodeAfter?.text?.startsWith(" ")) range.to += 1;
  editor.chain().focus().insertContentAt(range, [{ type: tipoNo, attrs }, { type: "text", text: " " }]).run();
}

// ---------- Validações ----------
export function contarPalavras(texto) {
  return texto.split(/\s+/).filter(Boolean).length;
}

function hojeISO() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

// Datas como 'aaaa-mm-dd' comparam corretamente como texto.
function erroData(v) {
  if (!v) return "Informe a data da experiência.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v) || isNaN(new Date(v + "T00:00"))) return "Data inválida.";
  if (v >= hojeISO()) return "A data precisa estar no passado.";
  return "";
}

// ---------- Inicialização ----------
// Retorna { editor, montarPayload, validar } para o retorno.js.
export function iniciarCaptura(entidades) {
  const titulo = $("input-titulo"), data = $("input-data");
  const tocado = new Set();
  let criacao = null; // { gatilho, props, reabrir } enquanto o modal de entidade está aberto

  // A lista é carregada uma vez (Tela 1) e fica em memória. Ponto de troca por API assíncrona: `items` acima.
  const editor = new Editor({
    element: $("editor-tiptap"),
    extensions: [StarterKit, criarEntityReference(entidades, abrirModalEntidade)],
    editorProps: {
      attributes: { "aria-labelledby": "rotulo-narrativa", "aria-multiline": "true", role: "textbox" },
      // Placeholder: is-editor-empty + data-placeholder no 1º parágrafo (convenção do CSS do Prisma).
      decorations: ({ doc }) => {
        const p = doc.firstChild;
        if (doc.childCount !== 1 || !p.isTextblock || p.content.size) return null;
        const texto = $("editor-tiptap").dataset.placeholder;
        return DecorationSet.create(doc, [Decoration.node(0, p.nodeSize, { class: "is-editor-empty", "data-placeholder": texto })]);
      }
    },
    onUpdate: validar,
    onTransaction: atualizarToolbar
  });

  // ----- Toolbar -----
  const COMANDOS = {
    bold: (c) => c.toggleBold(), italic: (c) => c.toggleItalic(), strike: (c) => c.toggleStrike(),
    "heading-1": (c) => c.toggleHeading({ level: 1 }), "heading-2": (c) => c.toggleHeading({ level: 2 }),
    "heading-3": (c) => c.toggleHeading({ level: 3 }), paragraph: (c) => c.setParagraph(),
    bulletList: (c) => c.toggleBulletList(), orderedList: (c) => c.toggleOrderedList(),
    blockquote: (c) => c.toggleBlockquote(), codeBlock: (c) => c.toggleCodeBlock(),
    horizontalRule: (c) => c.setHorizontalRule(), undo: (c) => c.undo(), redo: (c) => c.redo()
  };
  const ATIVO = {
    bold: ["bold"], italic: ["italic"], strike: ["strike"], "heading-1": ["heading", { level: 1 }],
    "heading-2": ["heading", { level: 2 }], "heading-3": ["heading", { level: 3 }], paragraph: ["paragraph"],
    bulletList: ["bulletList"], orderedList: ["orderedList"], blockquote: ["blockquote"], codeBlock: ["codeBlock"]
  };
  const botoes = [...$("editor-toolbar").querySelectorAll("[data-command]")];
  for (const b of botoes) {
    b.addEventListener("click", () => COMANDOS[b.dataset.command](editor.chain().focus()).run());
  }
  function atualizarToolbar() {
    for (const b of botoes) {
      const cmd = b.dataset.command;
      if (ATIVO[cmd]) b.setAttribute("aria-pressed", editor.isActive(...ATIVO[cmd]));
      b.disabled = !COMANDOS[cmd](editor.can().chain()).run();
    }
  }

  // ----- Validação e botão Revisar -----
  data.max = (() => { const d = new Date(); d.setDate(d.getDate() - 1); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); })();

  function validar() {
    const eTitulo = titulo.value.trim().length > 9 ? "" : "O título precisa ter mais de 9 caracteres.";
    const eData = erroData(data.value);
    const palavras = contarPalavras(editor.getText());

    for (const [campo, erro, msg] of [[titulo, eTitulo, "msg-erro-titulo"], [data, eData, "msg-erro-data"]]) {
      const mostrar = tocado.has(campo) && erro;
      $(msg).textContent = mostrar || "";
      campo.setAttribute("aria-invalid", !!mostrar);
    }
    $("contador-palavras").textContent = `${palavras} / ${MIN_PALAVRAS} palavras`;
    $("contador-palavras").classList.toggle("is-valid", palavras >= MIN_PALAVRAS);
    $("msg-validacao-narrativa").textContent =
      palavras >= MIN_PALAVRAS ? "" : `Faltam ${MIN_PALAVRAS - palavras} palavras para revisar.`;

    const ok = !eTitulo && !eData && palavras >= MIN_PALAVRAS;
    // Enquanto o Leitor analisa (painel em loading), o retorno.js mantém Revisar travado.
    $("btn-revisar").disabled = !ok || $("painel-dossie").dataset.state === "loading";
    return ok;
  }
  for (const campo of [titulo, data]) {
    campo.addEventListener("input", validar);
    campo.addEventListener("change", validar);
    campo.addEventListener("blur", () => { tocado.add(campo); validar(); });
  }

  // ----- Payload -----
  function montarPayload() {
    const json = editor.getJSON();
    const referencias = new Map();
    editor.state.doc.descendants((n) => {
      if (n.type.name !== "entityReference") return;
      const a = n.attrs;
      referencias.set(a.id, { tipo: a.entityType, idGrafo: a.id, texto: a.label, status: a.status });
    });
    return {
      titulo: titulo.value.trim(),
      data: data.value,
      dataAproximada: $("check-data-aproximada").checked,
      texto: editor.getText(),
      tiptapJson: json,
      referencias: [...referencias.values()]
    };
  }

  // ----- Modais -----
  let focoAntes = null;
  function abrirModal(id, focar) {
    focoAntes = document.activeElement;
    $(id).classList.replace("modal-hidden", "modal-open");
    focar.focus();
  }
  function fecharModal(id) {
    $(id).classList.replace("modal-open", "modal-hidden");
    focoAntes?.focus();
  }

  // Ver JSON
  $("btn-ver-json").addEventListener("click", () => {
    $("json-tiptap-output").textContent = JSON.stringify(editor.getJSON(), null, 2);
    $("json-payload-output").textContent = JSON.stringify(montarPayload(), null, 2);
    abrirModal("modal-json", $("btn-fechar-json"));
  });
  $("btn-fechar-json").addEventListener("click", () => fecharModal("modal-json"));

  // Nova Pessoa / Novo Lugar
  const salvar = $("btn-salvar-entidade");
  function abrirModalEntidade(gatilho, nome, props, reabrir) {
    criacao = { gatilho, props, reabrir };
    const pessoa = gatilho.entityType === "Pessoa";
    $("modal-entidade-titulo").textContent = pessoa ? "Adicionar Nova Pessoa" : "Adicionar Novo Lugar";
    $("form-nova-pessoa").hidden = !pessoa;
    $("form-novo-lugar").hidden = pessoa;
    $("form-nova-pessoa").reset();
    $("form-novo-lugar").reset();
    const campoNome = $(pessoa ? "pessoa-nome" : "lugar-nome");
    campoNome.value = nome;
    campoNome.removeAttribute("aria-invalid");
    salvar.textContent = "Salvar";
    salvar.disabled = false;
    $("msg-erro-entidade").textContent = "";
    abrirModal("modal-entidade", campoNome);
  }

  function cancelarEntidade() {
    const { props, reabrir } = criacao;
    criacao = null;
    $("modal-entidade").classList.replace("modal-open", "modal-hidden");
    editor.commands.focus(props.range.to);
    reabrir(); // volta à lista de sugestões, texto digitado intacto
  }

  async function salvarEntidade() {
    const { gatilho, props } = criacao;
    const pessoa = gatilho.entityType === "Pessoa";
    const campoNome = $(pessoa ? "pessoa-nome" : "lugar-nome");
    const label = campoNome.value.trim();
    if (!label) { campoNome.setAttribute("aria-invalid", "true"); campoNome.focus(); return; }

    const extras = pessoa
      ? { idade: $("pessoa-idade").value, sexo: $("pessoa-sexo").value }
      : { pais: $("lugar-pais").value.trim(), uf: $("lugar-uf").value.trim().toUpperCase(), cidade: $("lugar-cidade").value.trim() };
    salvar.disabled = true;
    salvar.textContent = "Salvando…";
    $("msg-erro-entidade").textContent = "";
    let nova;
    try {
      nova = await salvarEntidadeNoArquivo({ label, entityType: gatilho.entityType, ...extras });
    } catch {
      salvar.disabled = false;
      salvar.textContent = "Salvar";
      $("msg-erro-entidade").textContent = "Não foi possível salvar. Tente novamente.";
      return;
    }
    entidades[gatilho.lista].push(nova);
    criacao = null;
    $("modal-entidade").classList.replace("modal-open", "modal-hidden");
    inserirReferencia(editor, props.range, { id: nova.id, label: nova.label, entityType: nova.entityType, status: "new" });
  }

  $("btn-cancelar-entidade").addEventListener("click", cancelarEntidade);
  salvar.addEventListener("click", salvarEntidade);
  for (const f of ["form-nova-pessoa", "form-novo-lugar"]) {
    $(f).addEventListener("submit", (e) => { e.preventDefault(); salvarEntidade(); });
  }

  // Escape e clique no fundo fecham os modais.
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (criacao) cancelarEntidade();
    else if ($("modal-json").classList.contains("modal-open")) fecharModal("modal-json");
  });
  for (const id of ["modal-entidade", "modal-json"]) {
    $(id).addEventListener("click", (e) => {
      if (e.target !== e.currentTarget) return;
      if (id === "modal-entidade") cancelarEntidade(); else fecharModal(id);
    });
  }

  atualizarToolbar();
  validar();
  return { editor, montarPayload, validar };
}
