# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Cos'è

Sito statico del **Brixia Fly Day** (festival di pesca a mosca, Calvisano BS): ricostruzione in
HTML/CSS/JS puro dell'originale [brixiafly.biz](https://www.brixiafly.biz/), fatto in Wix.
Nessun framework, nessuna dipendenza npm, nessuno step di build, nessun test.
I contenuti sono **in italiano**: copy, `alt`, commenti nel codice e messaggi di commit vanno in italiano.

## Comandi

Non c'è build né test suite. Per vedere le modifiche si apre direttamente `index.html` nel browser
(`file://` funziona: nessuna chiamata di rete, solo percorsi relativi e font da CDN).

**Node e Python ci sono** (verificato il 2026-08-04: Node v25.8.2, Python 3.14.3 — una versione
precedente di questo file diceva il contrario). Quindi si possono usare:

- `node --check assets/js/main.js` per validare la sintassi del JS dopo una modifica;
- `npx serve .` oppure `python -m http.server 8000` per il preview su `http://` invece che `file://`.

Restano comunque assenti build, bundler e test suite: la resa visiva va sempre verificata
ricaricando la pagina nel browser.

## Architettura

### Otto pagine indipendenti, header e footer duplicati

`index` · `chi-siamo` · `location` · `espositori` · `programma` · `contatti` · `privacy-policy` · `cookie-policy`

Non esiste templating: **header e footer sono copiati identici in tutte le pagine**. Toccare una
voce di menu, un link social o un dato di contatto significa modificare *tutti* i file HTML, non uno.
L'unica differenza fra le copie è `aria-current="page"` sul link della pagina corrente.

Le due pagine legali fanno storia a sé: `<body class="dark">`, header con `scrolled` già applicato
(non c'è hero sotto cui scorrere) e contenuto in `.container.legal`.

### Un solo CSS, un solo JS

- `assets/css/style.css` (~420 righe) — tutto lo stile del sito, diviso da banner in commento
  (HEADER, HERO, SECTION TITLES + GRIDS, CONTACT, FOOTER, LEGAL, SCROLL REVEAL, RESPONSIVE).
  I **design token** stanno in `:root` in cima: colori, font, `--container`, `--header-h`, `--ease`.
  Usa sempre le variabili esistenti invece di riscrivere i valori esadecimali.

  Due convenzioni da rispettare:

  - **Scala tipografica** `--step-1` … `--step-6`: ogni `font-size` di titoli, lead e componenti
    pesca da lì. Non scrivere `clamp()` nuovi né `font-size` inline nell'HTML — se serve una misura
    che non c'è, si aggiunge un gradino, non un valore isolato. (Fuori scala di proposito solo
    `.stat__num`, che è un elemento grafico.)
  - **`--gold-ink` (#7A5C10) sui fondi chiari**: l'oro pieno `--gold` su crema o bianco sta a
    1.9-2.4:1 e non è leggibile. Sui fondi scuri va invece l'oro pieno.
  - **`.dark` e `.darker` vanno sempre scritti in coppia**: sono due fondi scuri con lo stesso
    trattamento del testo, ma una regola scritta solo per `.dark` lascia su `.darker` il colore
    pensato per il fondo chiaro. È già successo con `.lead` e `.section-head p`.
- `assets/js/main.js` — una IIFE con `"use strict"`, blocchi indipendenti: header solido allo
  scroll, menu mobile, split in parole (`.statement` e `[data-split]`), lunghezza dei tracciati
  delle icone, video dell'hero, scroll reveal, count-up dei numeri, form contatti demo, anno nel
  footer. Ogni blocco fa il proprio `if (el)`: lo stesso file gira su tutte le pagine, quindi
  **ogni nuovo blocco deve tollerare l'assenza dei suoi elementi**. La variabile `reduce`
  (`prefers-reduced-motion`) è letta una volta sola in cima e va riusata, non riletta.

### Video dell'hero (solo home)

`assets/video/hero-brixiafly.mp4` — 1600×900, H.264, senza audio, 7 s in loop, 1,6 MB
(l'originale 4K è 35 MB). Tre regole da non rompere:

1. **Il fermo immagine c'è sempre**: `<picture>` con AVIF/WebP/JPG dentro `.hero__bg`. È lui
   l'elemento LCP, il video ci si sovrappone in dissolvenza.
2. **La sorgente sta in `data-video`, non in `src`**: il JS la copia in `src` solo se non c'è
   reduced motion, lo schermo è ≥821px e il browser non segnala `saveData`. Mettere `src` o
   `autoplay` nell'HTML farebbe scaricare 1,6 MB anche a chi non li vedrà mai.
3. **Il pulsante `.hero__motion` non è decorativo**: un video che parte da solo e dura più di
   5 secondi deve poter essere fermato (WCAG 2.2.2). Compare via JS solo a video avviato.

### Sistema di layout

Gerarchia ricorrente in ogni pagina:

```
section.section[.dark|.darker][.section--tight]   ← padding verticale + tema di sfondo
  └ div.container                                  ← larghezza max + gutter
      └ div.section-head (span.eyebrow + h2)       ← intestazione centrata, opzionale
      └ componente: .grid.grid-2/3/4 · .split · .stats · .chips · .travel · .eventinfo
```

I fondi si alternano: crema (default) → `.dark` (#1F2521) → `.darker` (#171B18). `.dark` non cambia
solo lo sfondo, riassegna anche i colori di titoli e `.lead` ai discendenti — per questo molti
componenti hanno una variante `.dark .componente`.

### Scroll reveal — la convenzione da non rompere

`main.js` osserva ogni `.reveal` con un `IntersectionObserver` e aggiunge `.in` quando entra in
viewport; il CSS anima da `opacity: 0; translateY(28px)`. Due regole:

1. Gli elementi **già visibili al caricamento** (tutti quelli dentro `.hero`) hanno `class="reveal in"`
   scritto a mano nell'HTML, altrimenti resterebbero invisibili finché non si scrolla.
2. Lo scaglionamento si fa con `data-delay="1".."4"` sull'elemento, non con CSS inline.

Se `prefers-reduced-motion: reduce`, il JS applica `.in` a tutto subito e il blocco media in fondo
al CSS neutralizza le animazioni: **ogni nuova animazione va disattivata anche lì**.

### Componenti con più di una variante

- `.card` — base scura con icona SVG (`.card__icon`), usata in chi-siamo/location/programma.
  Varianti: `.card--light` (fondo bianco) e `.card--photo` (scheda bianca con foto in alto,
  `.card__media`, usata nei tre pilastri della home). `.card--photo` espone `--card-pad` e
  `--card-ratio` per regolare margini e proporzione della foto.
- `.statement` — blocco manifesto della home: serif corsivo oro fra due filetti, con comparsa
  parola per parola. Il testo va scritto normale nell'HTML: è `main.js` a spezzarlo in
  `span.statement__w` e a passare gli indici. Ritmo regolato da `--stagger` e `--lead-in`;
  lo spazio verticale attorno dal token globale `--statement-space`, che agisce sia sulla sezione
  sia sul `padding-top` della sezione seguente (`.section--statement + .section`).

### Responsive

Tutti i breakpoint stanno in fondo al CSS, in un unico posto: **960px** (griglie a 4 → 2),
**820px** (menu hamburger a tutto schermo, split in colonna), **560px** (tutto a colonna singola).
Non aggiungere media query sparse nel file.

## Stato dei contenuti

Da sostituire prima di andare online — non sono dimenticanze da "correggere" in autonomia,
ma segnaposto in attesa di materiale reale:

- **La home ha le foto vere**; le pagine interne no. Restano segnaposto `hero-inner.svg`
  (5 pagine), `placeholder-wide.svg` (3), `placeholder-tall.svg` e `map.svg`.
  Le foto reali (`hero-home`, `card-missione`, `card-esperienza`, `card-comunita`,
  `evento-fiume`) sono in tre formati AVIF/WebP/JPG serviti con `<picture>`, larghezza
  tarata sulla resa effettiva: **900px per le card** (che renderizzano a ~300 CSS px),
  1200px per gli split, 1920px per il fermo immagine dell'hero. Non serve di più.
- Il form contatti è **dimostrativo**: `main.js` intercetta il submit, mostra `.form-success` e
  resetta i campi. Nessun backend, nessuna email inviata.
- Privacy e Cookie Policy contengono testo generico non validato legalmente.
- I link social nel footer puntano a `#`.
