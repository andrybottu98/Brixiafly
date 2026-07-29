# Brixia Fly Day — Clone statico

Ricostruzione fedele in **HTML/CSS/JS puro** (nessuna dipendenza, nessun build) del sito
[brixiafly.biz](https://www.brixiafly.biz/), originariamente realizzato con Wix.

## Come aprirlo

- **Semplice:** doppio click su `index.html` (si apre nel browser).
- **Consigliato** (per far funzionare al 100% i font e i percorsi): servilo con un piccolo server locale, es.:

```bash
npx serve .
```

## Struttura

```
brixiafly-clone/
├── index.html            # Home
├── chi-siamo.html        # Chi Siamo (storia, valori, numeri)
├── location.html         # Location + come arrivare
├── espositori.html       # Espositori / categorie
├── programma.html        # Programma (8 sezioni tematiche)
├── contatti.html         # Contatti + form
├── privacy-policy.html   # Legale (testo segnaposto)
├── cookie-policy.html    # Legale (testo segnaposto)
└── assets/
    ├── css/style.css     # Tutto lo stile + responsive
    ├── js/main.js        # Nav mobile, header scroll, reveal, form
    └── img/              # Immagini SEGNAPOSTO — sostituiscile con le tue
```

## Cosa personalizzare

- **Immagini e video:** sostituisci i file in `assets/img/` mantenendo lo stesso nome,
  oppure cambia i `src` nell'HTML. Nomi attuali: `hero-home.svg`, `hero-inner.svg`,
  `placeholder-wide.svg`, `placeholder-tall.svg`, `placeholder-square.svg`, `map.svg`.
- **Form contatti:** al momento è dimostrativo (mostra un messaggio di conferma, non invia
  email). Va collegato a un servizio (Formspree, un endpoint tuo, ecc.).
- **Testi legali:** Privacy e Cookie Policy contengono testo segnaposto da sostituire.
- **Social:** i link Facebook/Instagram nel footer puntano a `#` — inserisci gli URL reali.

## Design system

| Elemento | Valore |
|----------|--------|
| Verde scuro (sfondo) | `#1F2521` |
| Oro (accento) | `#CDA434` |
| Crema (testo su scuro) | `#EFE9DC` |
| Titoli | Hedvig Letters Serif |
| Corpo | Manrope |

I font sono caricati da Google Fonts; offline c'è un fallback a Georgia / system sans.
Animazioni e scroll rispettano `prefers-reduced-motion`.
