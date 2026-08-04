# Brixia Fly Day — Clone statico

Ricostruzione fedele in **HTML/CSS/JS puro** (nessuna dipendenza, nessun build) del sito
[brixiafly.biz](https://www.brixiafly.biz/), originariamente realizzato con Wix.

## Come aprirlo

- **Semplice:** doppio click su `index.html`. Funziona tutto, font compresi.
- **Con server locale** (se hai Node o Python installati):

```bash
npx serve .
# oppure
python -m http.server 8000
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
├── CLAUDE.md             # Note tecniche su architettura e convenzioni
└── assets/
    ├── css/style.css     # Tutto lo stile + responsive
    ├── js/main.js        # Nav mobile, header scroll, reveal, statement, form
    └── img/              # Immagini SEGNAPOSTO — sostituiscile con le tue
```

> **Attenzione:** header e footer sono copiati identici in tutte le pagine. Se cambi una voce di
> menu, un link social o un recapito, va aggiornato in **tutti** i file HTML.

## Cosa personalizzare

- **Immagini:** sostituisci i file in `assets/img/` mantenendo lo stesso nome, oppure cambia i
  `src` nell'HTML. Nomi attuali: `hero-home.svg`, `hero-inner.svg`, `placeholder-wide.svg`,
  `placeholder-tall.svg`, `placeholder-square.svg`, `map.svg`.
  Nelle tre schede della home ("Il nostro spirito") il punto da modificare è marcato nel codice
  con un commento `► IMMAGINE 1/2/3`: formato consigliato 1600×900 (16:9), `.jpg` o `.webp`.
  Le foto vengono ritagliate automaticamente, quindi proporzioni diverse non rompono l'allineamento.
- **Form contatti:** al momento è dimostrativo (mostra un messaggio di conferma, non invia
  email). Va collegato a un servizio (Formspree, un endpoint tuo, ecc.).
- **Testi legali:** Privacy e Cookie Policy contengono testo segnaposto da sostituire.
- **Social:** i link Facebook/Instagram nel footer puntano a `#` — inserisci gli URL reali.

## Design system

| Elemento | Valore |
|----------|--------|
| Verde scuro (sfondo) | `#1F2521` |
| Verde più profondo | `#171B18` |
| Oro (accento) | `#CDA434` |
| Oro per fondi chiari | `#7A5C10` |
| Crema (testo su scuro) | `#EFE9DC` |
| Titoli | Fraunces (variabile) |
| Corpo | Manrope |

I colori e le altre costanti sono variabili CSS in `:root`, in cima a `style.css`: modifica lì per
propagare il cambiamento a tutto il sito.
I font sono caricati da Google Fonts; offline c'è un fallback a Georgia / system sans.

## Animazioni

Gli elementi con classe `reveal` compaiono allo scroll (`data-delay="1".."4"` per scaglionarli).
Il blocco manifesto della home compare parola per parola: il ritmo si regola con `--stagger` e
`--lead-in` nella regola `.statement`.
Tutte le animazioni rispettano `prefers-reduced-motion`.
