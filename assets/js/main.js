/* Brixia Fly Day — interazioni */
(function () {
  "use strict";

  /* Letto una volta sola: decide se gli effetti di movimento vanno preparati o no */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Header: solid on scroll ---- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 40);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Mobile nav ---- */
  var toggle = document.querySelector(".nav-toggle");
  var body = document.body;
  if (toggle) {
    var setNav = function (open) {
      body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Chiudi menu" : "Apri menu");
    };
    toggle.addEventListener("click", function () {
      setNav(!body.classList.contains("nav-open"));
    });
    document.querySelectorAll(".nav a").forEach(function (a) {
      a.addEventListener("click", function () { setNav(false); });
    });
    /* Esc chiude il menu e riporta il focus sul pulsante */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && body.classList.contains("nav-open")) {
        setNav(false);
        toggle.focus();
      }
    });
  }

  /* ---- Split in parole: lo statement e ogni elemento con data-split ----
     Ogni parola diventa uno span .word con il proprio indice, così il CSS può
     scaglionare la comparsa. Il testo va scritto normale nell'HTML. */
  document.querySelectorAll(".statement, [data-split]").forEach(function (el) {
    var text = el.textContent.trim();
    var words = text.split(/\s+/);
    /* sui titoli l'aria-label rimette insieme la frase: senza, uno screen reader
       può leggere gli span parola per parola, con una pausa fra l'una e l'altra */
    if (/^H[1-6]$/.test(el.tagName)) el.setAttribute("aria-label", text);
    el.textContent = "";
    words.forEach(function (word, i) {
      var span = document.createElement("span");
      span.className = "word";
      span.style.setProperty("--i", i);
      span.textContent = word;
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
    });
    el.style.setProperty("--words", words.length);
  });

  /* ---- Icone: lunghezza reale di ogni tracciato ----
     Serve al disegno progressivo in CSS. Se non la impostiamo (reduced motion,
     o JS non eseguito) il fallback della variabile lascia l'icona già intera. */
  if (!reduce) {
    document.querySelectorAll(".card__icon svg").forEach(function (svg) {
      svg.querySelectorAll("path, circle, line, rect, polyline, polygon").forEach(function (shape) {
        if (typeof shape.getTotalLength !== "function") return;
        var len = shape.getTotalLength();
        if (len) shape.style.setProperty("--len", len);
      });
    });
  }

  /* ---- Hero: video di sfondo ----
     Non viene nemmeno scaricato se l'utente ha chiesto meno animazioni, se lo
     schermo è stretto o se il browser segnala risparmio dati: in quei casi resta
     il fermo immagine, che c'è comunque. Per questo la sorgente sta in un
     data-attribute e non nell'attributo src. */
  var heroVideo = document.querySelector(".hero__video");
  var motionBtn = document.querySelector(".hero__motion");

  function etichettaPausa(inPausa) {
    if (!motionBtn) return;
    motionBtn.classList.toggle("is-paused", inPausa);
    motionBtn.setAttribute("aria-label", inPausa ? "Riprendi il video di sfondo" : "Metti in pausa il video di sfondo");
  }

  if (heroVideo && heroVideo.getAttribute("data-video")) {
    var conn = navigator.connection || {};
    var schermoLargo = window.matchMedia("(min-width: 821px)").matches;
    if (!reduce && schermoLargo && !conn.saveData) {
      heroVideo.addEventListener("playing", function () {
        heroVideo.classList.add("is-playing");
        if (motionBtn) motionBtn.hidden = false;
      });
      heroVideo.src = heroVideo.getAttribute("data-video");
      var avvio = heroVideo.play();
      /* se l'autoplay viene negato dal browser non succede nulla: resta il poster */
      if (avvio && typeof avvio.catch === "function") { avvio.catch(function () {}); }
    }
  }

  if (motionBtn && heroVideo) {
    motionBtn.addEventListener("click", function () {
      if (heroVideo.paused) { heroVideo.play(); etichettaPausa(false); }
      else { heroVideo.pause(); etichettaPausa(true); }
    });
  }

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---- Numeri: conteggio quando entrano in viewport ----
     La stringa originale viene ripristinata alla fine, così il formato scritto
     nell'HTML resta l'unica fonte di verità. */
  var nums = document.querySelectorAll(".stat__num");
  if (nums.length && !reduce && "IntersectionObserver" in window) {
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        countIO.unobserve(e.target);
        countUp(e.target);
      });
    }, { threshold: 0.25 });
    nums.forEach(function (el) {
      var parsed = parseNum(el.textContent);
      if (!parsed) return;
      /* azzerato subito: se lo lasciassimo pieno si vedrebbe il valore vero
         mentre entra dal basso, e poi il salto a zero all'avvio del conteggio */
      el.dataset.full = parsed.full;
      el.textContent = parsed.prefix + "0" + parsed.suffix;
      countIO.observe(el);
    });
  }

  function parseNum(text) {
    var match = text.match(/\d+/);            /* "2500", "7×", "54"… */
    if (!match) return null;
    var target = parseInt(match[0], 10);
    if (!target) return null;
    return {
      full: text,
      target: target,
      prefix: text.slice(0, match.index),
      suffix: text.slice(match.index + match[0].length)
    };
  }

  function countUp(el) {
    var parsed = parseNum(el.dataset.full || el.textContent);
    if (!parsed) return;
    var start = null;
    var dur = 1400;
    requestAnimationFrame(function frame(now) {
      if (start === null) start = now;
      var t = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - t, 3);     /* ease-out cubico */
      el.textContent = t < 1
        ? parsed.prefix + Math.round(parsed.target * eased) + parsed.suffix
        : parsed.full;                        /* la stringa originale resta la fonte di verità */
      if (t < 1) requestAnimationFrame(frame);
    });
  }

  /* ---- Contact form (demo, no backend) ---- */
  var form = document.querySelector(".form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var ok = form.querySelector(".form-success");
      if (ok) ok.classList.add("show");
      form.reset();
    });
  }

  /* ---- Footer year ---- */
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();
