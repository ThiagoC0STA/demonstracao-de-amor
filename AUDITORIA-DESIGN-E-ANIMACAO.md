# Auditoria de Design e Animação — Carta pra Lilian

> Revisão feita lendo o código inteiro (seções, tokens, sistema de animação, 3D).
> Olhar de direção de arte e de motion design. Objetivo: sair de "bonito e seguro"
> para 10/10 que impressiona de verdade.

---

## 1. Resumo em 3 linhas

O projeto já tem fundação boa: dark cinematográfico, paleta de um acento só (dourado), grão de filme, vinheta, 3D, reduced-motion tratado. O que segura a nota não é falta de coisa, é **excesso das coisas erradas**: glow no texto, glassmorphism em todo card, gradiente decorativo em tudo. Isso é exatamente o que faz parecer "template de casamento 2019" em vez de "experiência autoral". E a animação é competente mas **monótona**: tudo entra do mesmo jeito (fade + sobe + desfoca), não tem coreografia, não tem momento-assinatura, não usa o scroll como narrativa.

**Tese central: tirar os truques baratos de "premium" e reconstruir o impacto com tipografia, luz, composição e movimento com peso.** É assim que ohzi.io e activetheory.net (suas referências de imersividade) impressionam: contenção + um ou dois momentos absurdos, não decoração em tudo.

---

## 2. Nota atual, por eixo

| Eixo | Hoje | Teto realista | O que separa |
|---|---|---|---|
| Tipografia | 6.5 | 10 | Fonte display genérica (Playfair), itálico em tudo, sem refinamento de eixo/figuras/tracking |
| Cor e composição | 6 | 10 | Glow + glass + gradiente competindo, dourado usado em excesso simultâneo |
| Animação / motion | 6 | 10 | Entrada única repetida, sem scrub de scroll, sem parallax, sem momento-assinatura, 3D parado |
| Fundação técnica | 8 | 10 | Código morto, sem mouse-presence, perf de múltiplos canvas a vigiar |

A boa notícia: a Fase 0 (limpeza) sozinha já sobe os dois primeiros eixos de ~6 pra ~8 com baixo esforço. O "uau" mora na Fase 2.

---

## 3. O diagnóstico central (ler antes de tudo)

Três tratamentos estão sendo usados como muleta de "ficar caro" e produzem o efeito oposto:

1. **`text-glow`** (sombra dourada no texto, em `globals.css` linha 106). Aplicado no subtítulo e nos títulos da Timeline. Glow em texto é o tell número 1 de site amador. Impacto de verdade vem de tamanho, peso, contraste e uma fonte de luz só.
2. **`glass-panel`** (blur + borda dourada translúcida, `globals.css` linha 98). Usado nos cards da Timeline, no MediaFrame e no botão de áudio. Blur em tudo virou ruído visual e achata a profundidade real do "quarto escuro" que o 3D já cria.
3. **Gradientes decorativos** empilhados: `from-gold/5 to-transparent` por cima dos cards, `shadow-[0_0_15px_...]` colorido no trilho, scrims duplicados. Gradiente intencional (a luz radial do fundo, o sangramento pro papel da carta) é ótimo. Gradiente como enfeite é o que data o visual.

Esses três aparecem, inclusive, na sua própria lista do brief pessoal de "o que NÃO fazer" (sem glow, sem glass excessivo, sem gradiente de startup 2019). Este projeto pode sobrescrever o brief de produto porque é peça artística, mas **essas três regras valem aqui também** porque não são gosto, são craft.

Tirar esses três e deixar o conteúdo (foto + tipo + luz) respirar é metade do caminho pra 10/10.

---

## 4. Tipografia

### Diagnóstico

- **Display genérico.** Playfair Display é lindo e está em todo site romântico do planeta. Em itálico gigante (clamp até 6.5rem) lê como convite de casamento padrão, não como peça autoral.
- **Itálico como default.** Quase todo headline é itálico (Opening, Timeline, MemoryScene, Ending, Intro). Itálico devia ser acento, não a régua. Sem contraste roman/itálico não há hierarquia de voz.
- **Sem refinamento de craft.** Nenhum `font-feature-settings` (ligaturas, alternates), nenhum controle de figuras (os números "01..05" da Timeline e o drop cap merecem tratamento), tracking global fixo `-0.02em` que fica frouxo nos tamanhos display.
- **Corpo da carta em Inter.** A carta é o clímax emocional e está tipografada em fonte de UI. Carta nenhuma no mundo é escrita em Inter. Pede uma serifada de leitura.
- **Assinatura em Caveat.** Caveat é marker casual. "seu, pra sempre" pede uma script de pena, mais íntima.

### Plano

**Troca de família (alto impacto, baixo risco):**

- **Display: Fraunces** (variável, via `next/font/google`). Tem eixo óptico (`opsz`), `SOFT` e `WONK` — feita exatamente pra display old-style quente e characterful. Fraunces itálico em tamanho grande é de cair o queixo e é muito menos batido que Playfair.
- **Corpo da carta: Newsreader** (ou Lora / Source Serif 4). Serifada de leitura, faz a carta parecer manuscrita/tipografada de verdade.
- **Meta / UI / labels: Inter** fica (já cumpre bem o papel de "voz técnica" nos eyebrows e botões).
- **Assinatura: uma script de pena** tipo Pinyon Script ou Mr De Haviland no lugar de Caveat (opcional; Caveat funciona se quiser tom mais leve).

```ts
// app/layout.tsx (conferir a API de next/font no guia do repo antes de aplicar)
import { Fraunces, Newsreader, Inter, Pinyon_Script } from "next/font/google";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"], // eixos variáveis = controle fino
  style: ["normal", "italic"],
  display: "swap",
});
```

**Refinamentos de craft (depois da troca):**

- Tracking por tamanho: display `-0.03em` a `-0.04em`, itálico um pouco mais solto que o roman.
- `font-feature-settings: "liga" 1, "calt" 1;` no display; figuras old-style ou lining intencionais nos números da Timeline.
- Usar os eixos do Fraunces: `opsz` alto nos títulos, baixo nos textos pequenos; `SOFT` levemente alto pra dar a curva "amorosa".
- **Desitalizar.** Definir hierarquia com roman + peso, e usar itálico só em 1 palavra de destaque por bloco (ex.: "o que eu *amo* em você" já faz isso certo, é o modelo a seguir).
- Escala modular real (razão ~1.25) com line-heights alinhados ao tamanho.

---

## 5. Cor, luz e composição

### Diagnóstico

- Acento dourado bom (`#e5b874`, champagne quente), mas usado em fill + borda + glow + gradiente + trilho ao mesmo tempo. Acento perde força quando está em todo lugar.
- Glass + glow + gradiente (seção 3) brigam com a profundidade real que a luz 3D cria.
- Composição "centralizada e segura" em quase tudo. Cinema de verdade usa assimetria, escala extrema e espaço negativo como ferramenta.

### O que está ótimo (manter)

- Fundo radial "um quarto mal iluminado" no `body` (depth sem cara de gradiente).
- Grão de filme estático + vinheta.
- A virada do clímax: dark para papel quente na carta, com sangramento em vez de banda branca. Isso é direção de arte de verdade. Manter e até reforçar.
- Three-point lighting (key dourado / fill vinho / rim branco) nas cenas 3D.

### Plano

- **Matar `text-glow`.** Substituir impacto por tamanho/peso/contraste e a luz radial de fundo.
- **Tirar `glass-panel` do conteúdo.** Cards da Timeline viram tipo flutuando no escuro com filete de 1px (`rgba(cream, .08)`) e a foto carregando o peso. Glass só sobrevive, se quiser, no botão de áudio (chrome funcional).
- **Podar gradientes decorativos:** fora o `from-gold/5` dos cards e o `shadow` colorido do trilho. Manter os intencionais (luz de fundo, sangramento do papel, scrim sobre foto).
- **Disciplinar o dourado:** que seja luz e acento de tipo, não preencher tudo. Hierarquia: fundo → superfície → filete → texto secundário → texto primário → dourado.
- **Compor com mais coragem:** títulos maiores e mais à esquerda, fotos quebrando a grade, mais espaço negativo entre beats. O olho precisa de um caminho, não de tudo no centro.

---

## 6. Animação e motion (o centro do pedido)

Hoje o motion é seguro: `fadeInUp`, palavras com blur-in, stagger, flip card, trilho preenchendo no scroll, dodecaedro girando, coração pulsando. É bonito, mas **previsível e uniforme**: a mesma entrada em todas as seções, nenhum momento que faça parar e dizer "como fizeram isso".

### 6.1 Princípios (a régua nova)

1. **Amplitude de tempo.** Hoje quase tudo é 0.7–1.4s no mesmo `expo.out`. Motion bom contrasta micro rápido (120–200ms em hover/clique) com beats lentos e cinematográficos (1.2–2.4s). Definir e usar 3 curvas: snappy, smooth, dramatic.
2. **Scroll é a linha do tempo.** Lenis + ScrollTrigger já estão integrados (LenisProvider). Hoje as seções só dão fade ao entrar (`whileInView`). Trocar os momentos-chave por reveal **scrubbado** ao progresso do scroll (GSAP `scrub`), não disparo on-enter. Isso transforma rolar em dirigir o filme.
3. **Continuidade entre seções.** Nada de corte seco. A cor/luz de uma seção entra na próxima, com wipe ou push. A carta já faz isso uma vez (sangramento). Fazer disso a regra.
4. **Profundidade / parallax.** Frente, meio e fundo (tipo, foto, partícula) se movem em velocidades diferentes no scroll. Profundidade é o que vende "imersão".
5. **Presença do mouse.** Parallax sutil do 3D e do tipo seguindo o cursor, CTAs magnéticos, cards inclinando na direção do ponteiro. É a assinatura ohzi. Usar `gsap.quickTo` pra performar.

### 6.2 Momentos-assinatura (escolher 2 ou 3 e caprichar)

São esses que fazem a peça ser lembrada. Todos on-theme (amor), nada gratuito.

1. **Partículas formando um coração.** O campo de poeira que já existe (`ParticleField`) se junta e se desenha como um coração no Ending (ou como transição), segura, e dispersa. Partícula formando forma é o clássico que arranca reação, e aqui é temático. Dá pra mapear as partículas a pontos da silhueta do coração e interpolar posição.
2. **Tipografia cinética na abertura.** As linhas do Opening como tipo grande com reveal por máscara (linha sobe de trás de um clip) **scrubbado ao scroll**, com leve escala/parallax. Tipo com massa, não palavra com blur.
3. **Câmera 3D dirigida pelo scroll** na MemoryScene. Em vez de girar sozinho, o dodecaedro tem a câmera orbitando/aproximando conforme você rola, revelando as fotos em sequência; mouse adiciona parallax. Hoje ele só gira (`MemoryPolyhedron`).
4. **Assinatura que se escreve.** "seu, pra sempre" desenhando com traço SVG (`stroke-dashoffset`) como caneta de verdade, em vez de fade. Beat íntimo e memorável no fim da carta.
5. **Transições de seção com varredura de luz.** Um sweep dourado ou cortina de papel entre o dark e a carta (estender o sangramento que já existe pra uma transição deliberada).
6. **Revelação de foto com máscara + parallax interno** na Timeline: imagem revelada por `clip-path` (inset abrindo) com a foto se movendo dentro do frame no scroll, no lugar do `rotateY`/fade atual.

### 6.3 Coreografia por seção (concreto)

- **InteractiveIntro (gate):** o burst de coração é bom. Refinar o "não" que foge pra parecer brincalhão-elegante, não infantil, e fazer a dissolução pra primeira seção ser cross-fade + leve escala (hoje é fade puro do overlay).
- **Opening:** trocar `whileInView` por reveal scrubbado; parallax no glow de fundo; última linha (acento dourado) ganha um filete que se desenha embaixo.
- **Timeline:** tirar o glass, foto com `clip-path` + parallax interno, trilho mantém o preenchimento mas perde o glow; nó "ativo" acende quando o capítulo entra no centro.
- **WhatILove:** refinar o flip (profundidade, brilho/glare no virar, stagger do conteúdo interno) ou trocar por revelar-com-tilt no hover. O flip atual é correto mas tem cara de PowerPoint.
- **MemoryScene:** câmera dirigida pelo scroll + parallax de mouse; as frases trocam junto com a face que aparece, não num `setInterval` solto.
- **Letter:** parágrafos revelando linha a linha amarrados ao scroll + assinatura desenhando (SVG). Manter o grão de papel sutil.
- **Ending:** partículas formando o coração + última linha desenhando; "voltar ao topo" magnético.

### 6.4 Performance e acessibilidade do motion

- Reduced-motion já está muito bem tratado (provider + fallback CSS + freeze dos canvas). Manter como condição de qualquer coisa nova.
- Vigiar múltiplos `<Canvas>` (MemoryScene + Ending) no mobile: considerar baixar `count` de partículas e `dpr` em telas pequenas.
- `filter: blur()` animado é caro na GPU. O blur-in por palavra é ok, mas não espalhar pra listas grandes; preferir transform/opacity.
- Cursor e parallax de mouse com `gsap.quickTo` (não setState por frame).
- `will-change` só nos elementos em movimento, e tirar depois.

---

## 7. Limpeza técnica (rápido e higiênico)

- **`components/sections/Preloader.tsx`** está órfão (não é importado pelo `page.tsx`, que usa `InteractiveIntro`). Confirmar e remover.
- **`hooks/useGsap.ts`** está órfão (a Timeline foi reescrita sem GSAP pin). Confirmar e remover.
- **`README.md`** ainda cita Hero/Preloader. Atualizar depois das mudanças.
- Revisar `app/page.tsx`: o `Hero` já foi removido nesta sessão (e os arquivos `Hero.tsx`/`Hero3DText.tsx` deletados); confirmar que nada mais referencia.
- Após remover `text-glow`/`glass-panel`, apagar as classes não usadas de `globals.css`.

---

## 8. Roadmap por fases

Ordenado por relação impacto/esforço. Dá pra parar em qualquer fase e já estar melhor.

### Fase 0 — Fundação e limpeza (esforço baixo, impacto alto)
Tira a peça do "template" e bota no "desenhado".
- Remover `text-glow`, podar `glass-panel` e gradientes decorativos.
- Trocar fontes: Fraunces (display) + Newsreader (carta) + Inter (meta) + script (assinatura).
- Tracking/figuras/eixos variáveis + desitalizar a hierarquia.
- Definir 3 curvas de easing com contraste real e padronizar durações.
- Apagar código morto (Preloader, useGsap).

### Fase 1 — Linguagem de movimento (esforço médio, impacto alto)
- ScrollTrigger com `scrub` nos reveals-chave (Opening, Timeline, Letter).
- Parallax de profundidade (tipo/foto/partícula em velocidades diferentes).
- Presença de mouse (parallax 3D + CTA magnético + tilt nos cards) com `quickTo`.
- Transições de continuidade entre seções (sweep/cortina).

### Fase 2 — Momentos-assinatura (esforço médio-alto, impacto máximo)
É aqui que impressiona.
- Partículas formando o coração no Ending.
- Câmera 3D dirigida pelo scroll na MemoryScene.
- Assinatura desenhando com traço SVG.
- Tipografia cinética scrubbada na abertura.

### Fase 3 — Polimento (esforço baixo-médio, impacto de acabamento)
- Glare/brilho nos hovers, micro-timing pass.
- QA de performance (mobile, múltiplos canvas, blur).
- QA de acessibilidade (reduced-motion em todo o novo motion, foco, contraste).
- Atualizar README.

---

## 9. Checklist 10/10

Tipografia
- [ ] Display trocado pra Fraunces (ou equivalente characterful), não Playfair
- [ ] Carta em serifada de leitura, não Inter
- [ ] Itálico é acento, não régua
- [ ] Eixos variáveis, ligaturas e figuras tratados; tracking por tamanho

Design
- [ ] Zero `text-glow`
- [ ] Glass só em chrome funcional, não em conteúdo
- [ ] Gradiente só onde é intencional (luz, sangramento, scrim)
- [ ] Dourado disciplinado: luz e acento, não preenchimento
- [ ] Composição com assimetria e espaço negativo

Animação
- [ ] 3 curvas de easing com contraste real, em uso
- [ ] Reveals-chave scrubbados ao scroll (não só on-enter)
- [ ] Parallax de profundidade
- [ ] Presença de mouse (parallax + magnético + tilt)
- [ ] Continuidade entre seções (sem corte seco)
- [ ] 2–3 momentos-assinatura entregues (coração de partículas, câmera 3D no scroll, assinatura desenhando)
- [ ] reduced-motion cobrindo todo o motion novo

Técnico
- [ ] Código morto removido
- [ ] Perf ok no mobile
- [ ] README atualizado

---

## Nota de implementação

O `AGENTS.md` do projeto avisa que esta versão do Next pode ter breaking changes em relação ao conhecido. Antes de mexer em `next/font`, metadata ou estrutura de arquivo, conferir o guia em `node_modules/next/dist/docs/`. As mudanças de Fase 0 e 2 são as que mais movem a agulha; se for pra fazer só uma coisa, é a Fase 0 (fundação) seguida do momento-assinatura das partículas formando o coração.
