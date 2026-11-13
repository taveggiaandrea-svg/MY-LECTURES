# Le mie lezioni

Sito statico con le lezioni interattive di tutte le materie, nello stile delle lezioni scritte di 3Blue1Brown. Ogni materia è una cartella; lo stile e il codice comune sono condivisi, così ogni materia nuova ha lo stesso aspetto.

## Per chi ci lavora (persone o AI)

Leggere prima `METODO.md`: contiene tutte le regole di scrittura, di stile, di disegno delle figure e di verifica. Questo file spiega solo come è organizzato il repository.

### Struttura

```
shared/style.css     foglio di stile comune (non duplicarlo nelle materie)
shared/core.js       colori, macro KaTeX, funzioni di base, quiz, player, componenti (piani, alberi, matrici)
shared/boot.js       riquadri neri, tema, navigazione fra le lezioni, montaggio pigro
shared/home.js       tema della pagina iniziale
materie/<id>/
  materia.json       titolo, breve, descrizione, fonte, ordine nella pagina iniziale, numero della miniatura
  top.html           barra superiore della materia (il nome porta alla pagina iniziale) e apertura di <main>
  lezioni/lN.html    una lezione per file: <article class="lesson" data-n="N" id="lezione-N" data-title="...">
  foot.html          chiusura di <main> e piè di pagina con le fonti
  js/macro.js        (facoltativo) macro KaTeX della materia: Object.assign(MAC,{...})
  js/thumbs.js       miniature: THUMB[n] = SVG 108x72
  js/lN.js           INIT[N]=function(){...} per le figure; QZ['Na']=()=>[...] per i quiz
build.py             costruisce site/ (pagina iniziale + una pagina per materia)
test.py              test in browser di tutto il sito
site/                il sito pubblicato: si genera con build.py, non si modifica a mano
```

### Aggiungere una materia

1. Creare `materie/<id>/` con `materia.json`, `top.html` (copiare quello di `micro` e cambiare nome e link alle lezioni), `foot.html` con le fonti, le lezioni in `lezioni/` e il codice in `js/`.
2. Gli id degli elementi devono essere unici dentro la materia.
3. `python3 build.py <cartella dist di katex@0.16.9>` la prima volta (poi basta `python3 build.py`).
4. `python3 test.py shots` e guardare gli screenshot in `.shots/`.
5. Salvare le modifiche e caricarle: il sito si aggiorna da solo.

### Aggiungere una lezione a una materia esistente

Aggiungere `lezioni/lN.html` e `js/lN.js`, un link in `top.html`, una miniatura in `js/thumbs.js`, poi ricostruire e testare.

## Pubblicazione

Il sito si pubblica dalla cartella `site/`, senza comando di build. Va tenuto privato: alcune fonti hanno licenze che non permettono di distribuire opere derivate. Le pagine hanno già `noindex` e `robots.txt` blocca i motori di ricerca, ma la protezione vera è l'accesso con autenticazione davanti al sito.
