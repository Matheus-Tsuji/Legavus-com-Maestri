# Pesquisa: GSAP, ScrollTrigger, SplitText/SplitType e Lenis

## Documentação Oficial
- **GSAP Oficial:** https://gsap.com/docs/v3/
- **GSAP ScrollTrigger:** https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- **Lenis Smooth Scroll:** https://github.com/darkroomengineering/lenis
- **SplitType:** https://www.jsdelivr.com/package/npm/split-type

## Integração Técnica

### 1. Lenis Smooth Scroll com GSAP Ticker
A documentação oficial do Lenis (darkroomengineering/lenis) detalha a sincronização ideal com o GSAP ScrollTrigger:
```javascript
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  respectReducedMotion: true // Respeita nativamente a preferência do usuário
});

// Sincroniza eventos de scroll do Lenis com ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

// Adiciona o requestAnimationFrame do Lenis ao ticker do GSAP
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);
```

### 2. Divisão de Texto (SplitText / SplitType)
Para animações tipográficas premium (títulos revelados por palavras ou letras), utilizamos a biblioteca de código aberto `split-type` combinada com tweens escalonados (`stagger`) do GSAP:
```javascript
const split = new SplitType('.titulo-revelar', { types: 'lines, words' });
gsap.from(split.words, {
  y: 30,
  opacity: 0,
  duration: 0.8,
  stagger: 0.04,
  ease: 'power3.out'
});
```

### 3. Acessibilidade (`prefers-reduced-motion`)
- O Lenis 1.3+ já possui `respectReducedMotion: true` ativado por padrão.
- No GSAP, deve-se verificar:
```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
  // Desativa animações com movimento físico, mantendo transições instantâneas ou fade sutil
}
```
- No editor TipTap: o cursor personalizado e efeitos que possam distrair a digitação devem ser explicitamente desativados sobre o elemento do editor (`.ProseMirror`).
