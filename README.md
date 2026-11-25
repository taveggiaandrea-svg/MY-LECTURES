# Le mie lezioni

Sito statico con le lezioni interattive di tutte le materie, nello stile delle lezioni scritte di 3Blue1Brown. Ogni materia è una cartella; lo stile e il codice comune sono condivisi, così ogni materia nuova ha lo stesso aspetto.

## Per chi ci lavora (persone o AI)

Leggere prima `METODO.md`: contiene tutte le regole di scrittura, di stile, di disegno delle figure e di verifica. Questo file spiega solo come è organizzato il repository.

### Struttura

```
shared/style.css     foglio di stile comune (non duplicarlo nelle materie)
shared/core.js       colori, macro KaTeX, funzioni di base, quiz (le risposte verificate restano salvate nel browser), player, componenti (piani, alberi, matrici), mappe mentali dei riepiloghi (`MAPPA[N]` nel js della lezione, `<div class="w" data-mappa="N"></div>` nella sezione `recap`)
shared/boot.js       riquadri neri, tema, navigazione fra le lezioni, montaggio pigro, assistente «Chiedi all'AI» (Gemini in streaming, lezione aperta + mappa del corso + estratti delle altre lezioni), barra di scorrimento come mappa della lezione (quiz in azzurro velato, sezioni `recap` in ambra velato), barra disegnata dal sito al posto di quella del browser (clic o tocco = salto esatto al punto, cursore trascinabile), indice iniziale di ogni lezione generato dai titoli h2 (UI.toc), percentuale di avanzamento a decine accanto al cursore, calcolata solo sul testo da studiare (esclusi quiz e navigazione)
shared/home.js       tema della pagina iniziale
shared/topgrid.js    griglia animata nella barra superiore (una griglia che subisce lente trasformazioni lineari), in tutte le pagine
materie/<id>/
  materia.json       titolo, breve, descrizione, fonte, ordine nella pagina iniziale, numero della miniatura, lingua (facoltativa, "it" se manca), nome_lingua per il selettore (facoltativo, per esempio "IT")
  top.html           barra superiore della materia (il nome porta alla pagina iniziale) e apertura di <main>
  lezioni/lN.html    una lezione per file (si può partire da l0, per esempio una mappa del corso): <article class="lesson" data-n="N" id="lezione-N" data-title="...">
  foot.html          chiusura di <main> e piè di pagina con le fonti
  js/macro.js        (facoltativo) macro KaTeX della materia: Object.assign(MAC,{...}); per una materia in un'altra lingua anche Object.assign(UI,{...}) con i testi fissi dell'interfaccia
  js/thumbs.js       miniature: THUMB[n] = SVG 108x72
  js/lN.js           INIT[N]=function(){...} per le figure; QZ['Na']=()=>[...] per i quiz
  js/shared.js       (facoltativo) componenti della materia usati da più lezioni, caricati dopo thumbs.js
  style.css          (facoltativo) stile proprio della materia, caricato dopo shared/style.css: solo ciò che manca, mai una copia
  <xx>/              (facoltativa) un'altra lingua della materia, con codice di due lettere (per esempio en/): lezioni/, js/lN.js, js/macro.js, top.html, foot.html e un materia.json con i soli campi che cambiano (titolo, lingua, nome_lingua); i file che mancano (miniature, shared.js, style.css) si prendono dalla cartella principale
shared/domande.js    pagina «Domande all'AI» (site/domande/): legge l'archivio delle domande all'assistente
build.py             costruisce site/ (pagina iniziale, una pagina per materia, pagina delle domande)
worker/index.js      password del sito e archivio /api/domande (Durable Object con SQLite)
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

Se il corso è diviso fra più docenti, ogni `<article class="lesson">` porta `data-docente="L. Molteni"` (stesso valore per tutte le lezioni di un docente). Dove il valore cambia, `shared/boot.js` aggiunge da solo lo stacco: etichetta «Parte N · docente» nell'apertura di ogni lezione, riquadro «Fine della parte di …» prima dei link in fondo all'ultima lezione del docente, riquadro «Inizia la parte di …» e segno colorato nel menu sulla prima lezione del docente successivo (parte 1 blu, 2 arancione, 3 verde). Big Data: lezioni 1-8 A. Rezzani, 9-16 L. Molteni, 17-24 Tonini.

### Lezioni di riepilogo

Alla fine del gruppo di lezioni di ogni docente c'è una lezione di riepilogo (mappe mentali, definizioni pratiche, tabelle per scegliere lo strumento, quiz misto). Il file si chiama `l1NN.html` con NN = ultima lezione del gruppo (Big Data: `l108.html` dopo la lezione 8, `l116.html` dopo la 16): `build.py` la mette subito dopo quella lezione. L'articolo porta `data-label="Riepilogo 1-8"`, usato al posto del numero nei link in fondo alle lezioni, e lo stesso `data-docente` del gruppo. Le mappe multiple usano chiavi come `MAPPA['108a']`.

### Quiz e assistente

Le domande del quiz finale sono numerate («Domanda 1.»). Con la risposta giusta compare la spiegazione («Perché.»); con una sbagliata il suggerimento e il pulsante «Mostra la soluzione», che rivela la risposta e la spiegazione. «Chiedi all'AI» riceve anche i quiz della lezione aperta: domande, opzioni, risposta giusta, spiegazione e risposta già data dallo studente (letta da `localStorage`), con l'istruzione di guidare con indizi se lo studente non ha ancora risposto. L'indice iniziale della lezione è compatto, su una colonna.

### Materie in più lingue

Una materia può avere una seconda lingua in una sottocartella di due lettere (oggi solo `materie/bigdata/en/`). `build.py` costruisce una pagina per lingua (`site/bigdata/` e `site/bigdata/en/`), aggiunge nella barra superiore il selettore delle lingue e uno script che ricorda la scelta (`localStorage`, chiave `lingua-<id>`) e riapre la stessa lezione nell'altra lingua, nello stesso punto (lezione, sezione e posizione passano in `localStorage`, chiave `salto-lingua`). Le regole di speculazione scritte da `build.py` fanno preparare a Chrome l'altra lingua in background, così il cambio è immediato; il passaggio fra le pagine è in dissolvenza (`@view-transition`). Dalla pagina iniziale il link della materia porta direttamente alla lingua scelta. `test.py` prova anche le pagine delle lingue.

Le due versioni sono copie separate: testo, figure (le etichette stanno dentro `js/lN.js`) e quiz. Una correzione a una figura o a un dato va fatta in entrambe le cartelle. Nella versione italiana i numeri seguono le convenzioni italiane (virgola decimale; punto delle migliaia dalle cinque cifre in su; in `js/macro.js` la funzione `fi`), mentre codice SQL e Spark, contenuto delle tabelle e risultati delle query restano con il punto decimale (funzione `fe`).

**Big Data: le lezioni nuove si scrivono prima in italiano** (in `materie/bigdata/`). La versione inglese in `materie/bigdata/en/` si aggiunge solo su richiesta; finché manca, la pagina inglese non ha quella lezione: sulle lezioni che esistono solo in italiano il link EN del selettore è spento (`build.py` scrive in `data-nums` le lezioni di ogni lingua, `boot.js` lo legge), e il reindirizzamento automatico alla lingua scelta non scatta se la lezione dell'indirizzo in quella lingua non c'è. Oggi: lezioni 1-9 in italiano e inglese, 10-16 solo in italiano. Le lezioni 10-16 usano anche i dati veri dei dataset pubblici del corso (Telco, Hotel Booking Demand, tweet, immagini di fusioni), salvati come piccoli estratti dentro `js/l10.js`, `js/l11.js` e `js/l16.js`; gli helper `st10`, `gauss10`, `vbars11` e `cm12` definiti in una lezione sono riusati dalle successive.

## Pubblicazione

Il sito è un Worker di Cloudflare (`wrangler.jsonc`): a ogni push su `main` Cloudflare esegue `npx wrangler deploy` e pubblica la cartella `site/`. Indirizzo: https://my-lectures.taveggiaandrea.workers.dev/.

Va tenuto privato: alcune fonti hanno licenze che non permettono di distribuire opere derivate. Ogni richiesta passa prima da `worker/index.js`, che chiede utente e password (autenticazione HTTP Basic). Le credenziali sono i segreti `SITE_USER` e `SITE_PASSWORD`, impostati nel pannello Cloudflare (Worker my-lectures, Settings, Variables and secrets) e mai scritti nel repository. Se mancano, il sito resta chiuso a tutti. Per provarlo in locale: un file `.dev.vars` (escluso da git) con le due variabili e `npx wrangler dev`. In più le pagine hanno `noindex` e `robots.txt` blocca i motori di ricerca.

## Archivio delle domande all'assistente

Ogni domanda fatta a «Chiedi all'AI» viene salvata, con materia, lezione, risposta e modello, nell'archivio `/api/domande` del Worker: un Durable Object con SQLite dichiarato in `wrangler.jsonc`, che Cloudflare crea da solo al primo deploy (nessuna impostazione nel pannello). Sta dietro la stessa password del sito. La pagina `domande/` mostra quante domande nascono da ogni lezione, l'elenco completo con ricerca e cancellazione, e l'esportazione in CSV o JSON (`/api/domande?formato=csv`). Serve a capire quali dubbi sorgono e a scrivere le lezioni future in modo che la risposta ci sia già: prima di scrivere o rivedere una lezione, leggere le domande della materia.
