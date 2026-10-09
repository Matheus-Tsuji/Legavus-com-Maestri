// Animações (GSAP + SplitType + Lenis). Só observa o DOM (classes e data-*) do contrato;
// não depende da lógica de main.js / preparacao.js / captura.js / retorno.js.
const { gsap, ScrollTrigger, SplitType, Lenis } = window;
const reduzido = matchMedia("(prefers-reduced-motion: reduce)").matches;

if (gsap && !reduzido) iniciar();

function iniciar() {
  gsap.registerPlugin(ScrollTrigger);
  const E = "power3.out";

  // ---- Rolagem suave: Lenis no ticker do GSAP ----
  let lenis = null;
  if (Lenis) {
    lenis = new Lenis({ autoRaf: false });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // ---- Títulos: revelação por palavra, dentro de linhas mascaradas ----
  const splits = new Map();
  function revelarTitulos(raiz, animar = true) {
    if (!SplitType) return;
    for (const el of raiz.querySelectorAll(".display")) {
      splits.get(el)?.revert();
      const s = new SplitType(el, { types: "lines,words" });
      splits.set(el, s);
      el.classList.add("is-split");
      if (animar) gsap.from(s.words, { yPercent: 115, duration: 1, ease: E, stagger: 0.07, delay: 0.1 });
    }
  }
  let larguraAnt = innerWidth;
  addEventListener("resize", () => {
    clearTimeout(revelarTitulos.t);
    revelarTitulos.t = setTimeout(() => {
      if (innerWidth === larguraAnt) return;
      larguraAnt = innerWidth;
      for (const v of document.querySelectorAll(".view-active, .col-dossie")) revelarTitulos(v, false);
    }, 200);
  });

  // ---- Entrada de tela (Preparação e Captura) ----
  function entrarTela(view, inicial) {
    revelarTitulos(view);
    const blocos = view.querySelectorAll(view.matches("#view-preparacao") ? ".lede, .prep-step, .prep-footer" : ".field, .actions");
    gsap.from(blocos, { opacity: 0, y: 18, duration: 0.7, ease: E, stagger: 0.08, delay: inicial ? 0.45 : 0.25, clearProps: "all" });
  }
  const estavaAtiva = new Map();
  for (const v of document.querySelectorAll("[data-view]")) estavaAtiva.set(v, v.classList.contains("view-active"));
  document.fonts.ready.then(() => {
    entrarTela(document.querySelector(".view-active"), true);
    revelarTitulos(document.querySelector(".col-dossie")); // painel sempre visível: título entra uma vez
  });

  // ---- Observador único: classes e data-* do contrato ----
  const alvos = [...document.querySelectorAll("[data-view], .modal, #painel-dossie, .status-badge, .step-item")];
  const obsAttr = new MutationObserver((muts) => {
    for (const m of muts) {
      const el = m.target;
      if (el.matches("[data-view]")) {
        const ativa = el.classList.contains("view-active");
        if (ativa && !estavaAtiva.get(el)) entrarTela(el, false);
        estavaAtiva.set(el, ativa);
      } else if (el.matches(".modal")) {
        const aberto = el.classList.contains("modal-open");
        aberto ? lenis?.stop() : document.querySelector(".modal-open") || lenis?.start();
        if (aberto && m.oldValue?.includes("modal-open") === false) {
          gsap.from(el, { opacity: 0, duration: 0.25, ease: "none", clearProps: "all" });
          gsap.from(el.querySelector(".modal-box"), { y: 24, scale: 0.97, duration: 0.45, ease: E, clearProps: "all" });
        }
      } else if (el.id === "painel-dossie") {
        if (el.dataset.state === "ready" && m.oldValue !== "ready") {
          gsap.from("#dossie-conteudo .chips-block, #dossie-conteudo .accordion-item", { opacity: 0, y: 14, duration: 0.6, ease: E, stagger: 0.09, clearProps: "all" });
        }
      } else if (el.matches(".step-item")) {
        if (el.classList.contains("is-active") && !m.oldValue?.includes("is-active")) gsap.fromTo(el.querySelector(".step-dot"), { scale: 0.7 }, { scale: 1, duration: 0.5, ease: "back.out(2)", clearProps: "all" });
      } else if (el.matches(".status-badge")) {
        if (el.dataset.status !== m.oldValue) gsap.fromTo(el, { scale: 0.85 }, { scale: 1, duration: 0.5, ease: "back.out(2)", clearProps: "all" });
      }
    }
  });
  for (const el of alvos) {
    const attr = el.matches(".status-badge") ? "data-status" : el.id === "painel-dossie" ? "data-state" : "class";
    obsAttr.observe(el, { attributes: true, attributeFilter: [attr], attributeOldValue: true });
  }

  // ---- Contador de referências: leve pulso a cada atualização do texto ----
  const contador = document.getElementById("contador-referencias");
  new MutationObserver(() => {
    if (contador.textContent.startsWith("✓")) gsap.fromTo(contador, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.5, ease: E, clearProps: "all" });
  }).observe(contador, { childList: true, characterData: true, subtree: true });

  // ---- Menu de sugestões: entra suavemente (o TipTap o cria e remove do DOM; a saída é instantânea) ----
  new MutationObserver((muts) => {
    for (const m of muts) for (const n of m.addedNodes) {
      if (!n.matches?.(".tiptap-suggestions-popup")) continue;
      n.setAttribute("data-lenis-prevent", "");
      gsap.fromTo(n, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.2, ease: E });
    }
  }).observe(document.body, { childList: true });

  // ---- Cursor discreto (só ponteiro fino); some sobre o editor e campos ----
  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const c = document.createElement("div");
    c.className = "cursor";
    c.setAttribute("aria-hidden", "true");
    document.body.appendChild(c);
    const x = gsap.quickTo(c, "x", { duration: 0.25, ease: E });
    const y = gsap.quickTo(c, "y", { duration: 0.25, ease: E });
    addEventListener("pointermove", (e) => {
      x(e.clientX);
      y(e.clientY);
      const t = e.target.closest?.(".ProseMirror, input, select, textarea, pre") ? "off" : e.target.closest?.("a, button, .accordion-header, label.check") ? "hover" : "";
      c.dataset.estado = t;
      c.classList.add("is-on");
    });
    document.documentElement.addEventListener("pointerleave", () => c.classList.remove("is-on"));
  }
}
