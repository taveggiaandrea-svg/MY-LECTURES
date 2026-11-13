# Metodo per creare lezioni interattive in stile 3Blue1Brown

Istruzioni operative per un'AI che deve trasformare una fonte (libro, capitoli, slide, appunti, paper) in un sito di lezioni interattive nello stile delle lezioni **scritte** di 3Blue1Brown (3b1b). Il metodo vale per qualunque materia: matematica, economia, informatica, fisica, statistica, diritto, storia del pensiero. Gli esempi tra parentesi sono solo esempi.

Si riprende lo **stile**, mai gli asset: niente logo, niente personaggi «pi», niente testi o immagini copiati dal sito 3b1b.

Il documento è diviso in 14 parti. Le parti 0 e 1 sono quelle che contano di più: vanno lette per prime e ricontrollate prima di ogni consegna. Le appendici contengono il foglio di stile completo e il codice JavaScript di base, da copiare così come sono.

---

## 0. I principi non negoziabili

Sono le correzioni che un utente esigente ha dovuto chiedere più volte. Vanno rispettate dalla prima stesura.

1. **Una figura mostra un meccanismo, non ridice una frase.** Niente schemi a scatole e frecce che equivalgono al testo accanto. Prova di utilità: «che cosa vede il lettore qui che la frase vicina non gli dà?». Se la risposta è «niente», la figura si toglie o si rifà.
2. **Le figure devono essere leggibili a colpo d'occhio.** Preferire diagrammi statici che fanno capire il meccanismo senza toccare nulla: il lettore deve capire guardando, non premendo tasti. I pulsanti e i selettori si usano solo quando l'interazione insegna davvero qualcosa che un disegno fermo non può mostrare (trascinare un punto per vedere come cambia un risultato). Un confronto fra due o tre casi si mostra con due o tre riquadri affiancati, non con un selettore.
3. **Niente muri di testo.** Al massimo circa 150 parole per figura; mai più di tre o quattro paragrafi di fila senza una figura, una formula in blocco o un quiz. Ma le figure devono essere utili e coerenti con il testo sopra e sotto: mai aggiunte per fare numero.
4. **Mai elenchi puntati o numerati nelle lezioni.** Solo prosa. Le tabelle sono ammesse per riepiloghi e confronti.
5. **Ogni termine, simbolo o sigla si spiega prima di usarlo**, in una riga, anche se è stato definito in una lezione precedente (lo si richiama). Nomi propri e riferimenti storici: una riga di spiegazione, oppure si tolgono.
6. **Si spiega perché una cosa e non un'altra**: prima si mostra che cosa va storto con l'alternativa più ovvia («il candidato più naturale sarebbe..., ma...»), poi si introduce la scelta giusta.
7. **Poche cose per volta.** Una figura, un'idea. Mai più oggetti nuovi nello stesso paragrafo o nello stesso disegno.
8. **Sintetico, intuitivo, con esempi numerici.** Ogni formula arriva dopo un esempio concreto e viene riletta a parole.
9. **Le immagini utili della fonte vanno riprodotte**, ridisegnate nello stile della pagina, con gli stessi dati. Se un'immagine non viene riprodotta, o viene sostituita da dati simulati o da numeri presi da un'altra fonte, lo si dichiara nella didascalia e nel messaggio finale.
10. **Le domande nel testo sono quiz**, mai un pulsante «Rivela». Il blocco richiudibile serve solo per dimostrazioni e derivazioni.
11. **Animazioni e confronti fra stati usano controlli da video** (play/pausa, tempo, barra trascinabile), mai un selettore «prima / dopo» in cima alla figura.
12. **I comandi non si confondono con le legende**: ogni gruppo di pulsanti o slider ha sopra una riga che dice che cosa si sta scegliendo.
13. **Fedeltà alla fonte.** Definizioni, enunciati, esempi e numeri sono quelli della fonte, riscritti con parole proprie. Nessuna invenzione presentata come fonte. Ogni aggiunta (analogia, esempio, controesempio, visualizzazione) va dichiarata. Se la fonte contiene un errore o un refuso, lo si segnala nella pagina e nel messaggio finale invece di scegliere in silenzio.
14. **Sempre lo stesso file e lo stesso link.** A ogni modifica si aggiorna lo stesso file e la stessa pagina pubblicata; mai un nuovo file per ogni versione.

---

## 1. Flusso di lavoro

1. **Leggere tutta la fonte prima di scrivere.** Per ogni capitolo o slide annotare: definizioni, proposizioni, dimostrazioni, esempi numerici, esercizi e domande poste al lettore, figure, dati con le cifre esatte, citazioni. Se il lavoro è lungo, salvare questi appunti in un file di note: servono per non perdere nulla e per il controllo di copertura finale. Le figure della fonte vanno guardate come immagini (renderizzare le pagine del PDF), non solo come testo estratto.
2. **Proporre un piano breve e aspettare conferma**: titolo in forma di domanda per ogni lezione, sezioni, quale figura per ciascun concetto, quali immagini della fonte verranno ridisegnate, tabella dei colori delle variabili. Non costruire e non pubblicare nulla prima della conferma.
3. **Scrivere** testo, figure e quiz seguendo le parti 2-9.
4. **Verificare in un browser vero**, a due larghezze e nei due temi (parte 11).
5. **Controllo di copertura**: ripassare la fonte pagina per pagina e verificare che ogni definizione, proposizione, esempio, domanda ed esercizio con soluzione compaia nella lezione corrispondente. Le domande aperte della fonte diventano quiz o esempi svolti.
6. **Revisione indipendente**: far rileggere le lezioni a un secondo agente che non ha visto la stesura, chiedendogli di ricalcolare ogni numero, ogni esempio e la risposta di ogni quiz, di confrontare enunciati e fonte, e di elencare le lacune di copertura. Correggere ciò che trova. Dargli accesso diretto alla fonte: se non può leggerla, la revisione vale a metà e va detto.
7. **Consegnare**: aggiornare lo stesso file e la stessa pagina; dopo aver scritto il file nella cartella dell'utente, rileggerlo (dimensione, numero di lezioni presenti), perché la scrittura può fallire in silenzio.
8. **Messaggio finale**: che cosa è stato verificato e che cosa no; elenco di ogni aggiunta rispetto alla fonte, di ogni dato simulato o preso altrove, di ogni immagine non riprodotta, dei refusi trovati nella fonte. Breve, senza preamboli.

---

## 2. Come si scrive una lezione

Lo schema ricalca le lezioni scritte di 3b1b sulle reti neurali.

- **Titolo in forma di domanda** («Che cosa vuol dire...?», «Come si trova...?»), sopra la dicitura del capitolo o della fonte e sotto una riga di descrizione.
- **Si apre con un problema concreto da toccare**, non con una definizione: una figura, un caso reale, un piccolo gioco, oppure due domande a cui rispondere d'istinto. Più avanti la lezione riprende l'apertura e la spiega.
- **Dalla seconda lezione in poi**, due o tre righe di aggancio alla precedente.
- **Intuizione prima della notazione**: prima la situazione a parole, poi la figura, alla fine la formula, che arriva come modo compatto di dire qualcosa che il lettore ha già visto.
- **Definizioni minime e provvisorie**, da raffinare dopo. Ogni termine nuovo in grassetto alla prima comparsa, con la spiegazione nella stessa frase.
- **Le sezioni si collegano con una domanda** che nasce dal limite della precedente («Si può sempre fare?»). I titoli di sezione sono affermazioni o domande, mai etichette («Quando i numeri non bastano», non «Rappresentabilità»).
- **Paragrafi di due-quattro righe**, mai oltre un centinaio di parole. Voce diretta, seconda persona, frasi brevi.
- **Una sola frase in grassetto per sezione**: l'idea da portarsi via.
- **Enunciati formali** (definizioni, proposizioni) in paragrafi rientrati con il nome in grassetto: «**Proposizione.** ...». Niente riquadri, niente barre laterali.
- **Dimostrazioni e derivazioni** in un blocco richiudibile con un titolo che dice che cosa contiene («Perché vale», «Da dove viene la formula»). Le precisazioni brevi restano nel testo.
- **Quiz dentro il flusso**: uno-tre quiz di una domanda ciascuno, subito dopo il concetto che mettono alla prova.
- **Notazione coerente** in tutta la pagina; i rimandi («lezione 7») devono puntare alla lezione giusta. Se si riordinano le lezioni, ricontrollare tutti i rimandi.
- **Chiusura**: «Se di questa lezione dovesse restarti una sola cosa: ...», poi una riga di aggancio alla lezione successiva.
- **Citazioni** della fonte: brevi, tradotte nella lingua della pagina, con autore e anno.
- Quando un numero o un'immagine non viene dalla fonte principale, la didascalia lo dice in una frase.

---

## 3. Struttura della pagina

- **Un solo file HTML**, una lezione per capitolo o per blocco di slide. Ogni lezione è un `<article class="lesson" data-n="N" id="lezione-N" data-title="Titolo">`; se ne vede una alla volta (le altre hanno `hidden`). La lezione corrente va nell'hash `#lezione-N` (con `history.replaceState`), letto al caricamento.
- **Barra superiore sticky**, scura e traslucida in entrambi i temi, con una griglia prospettica animata dietro il titolo (codice in appendice A): nome del corso a sinistra, link alle lezioni («1 · Nome breve») e pulsante sole/luna a destra. Su telefono il nome sparisce e i link scorrono in orizzontale.
- **Ogni lezione è una pila di `<section>` a tutta larghezza** con sfondo alternato; dentro, una colonna centrale `.col`. La prima sezione (`.hero`) è una fascia azzurrina con capitolo, titolo e descrizione, centrati.
- **In fondo a ogni lezione**: sezione «Mettiti alla prova» con il quiz finale, frase di chiusura, due grandi link «Lezione precedente / successiva» con miniatura e titolo (generati dallo script).
- **Ogni lezione ha una miniatura**: un piccolo SVG 108x72 su fondo nero che richiama la sua figura principale.
- **Tabella riassuntiva** (lezione, concetto, idea, formula) alla fine di ogni blocco di lezioni e comunque nell'ultima.
- **Piè di pagina**: fonti complete per lezione, licenze, e la dicitura che si tratta di una rielaborazione per studio personale quando la licenza della fonte vieta opere derivate.
- **Confini di programma** (opzionale, utile per gli esami): un riquadro arancione «Fine del programma di ...» alla fine dell'ultima lezione inclusa, un'etichetta «Oltre il programma» sotto il titolo delle lezioni successive, una linea arancione nella barra fra le due parti.

---

## 4. Sistema visivo

Le proporzioni del testo sono quelle di 3b1b: testo grande, interlinea ampia, colonna stretta. Non rimpicciolire per far stare più contenuto.

- **Font** (Google Fonts): titoli e interfaccia in **Figtree**, testo in **Source Serif 4**, entrambi a peso 350; `h3` a 500; grassetto a 600.
- **Misure**: `html{font-size:105%}` (corpo 16,8 px), interlinea 2 (1,8 su telefono). `h1` 1,875rem, `h2` 1,5rem, `h3` 1,25rem, tutti centrati, in Figtree, interlinea 1,5. Colonna larga 43,75rem. Sezioni con `padding:4rem 20px`. Dentro la colonna gli elementi sono distanziati con `display:flex; flex-direction:column; gap:1.6rem` e margini a zero. Il testo negli SVG non scende sotto 13 px a larghezza piena.
- **Pulsanti**: Figtree, sfondo blu del tema al 15% circa, nessun bordo, raggio 10px, padding .62rem .9rem; selezionato con sfondo blu pieno.
- **Didascalie**: grigie, centrate, **non in corsivo**, interlinea 1,5, larghe al massimo 38rem.
- **Tema**: scuro di partenza (sfondo `#111`, non nero puro, così i riquadri neri delle figure si staccano); chiaro con `data-theme="light"` su `<html>`, impostato da un piccolo script nel `<head>` che legge `localStorage` dentro try/catch, e dal pulsante sole/luna. Tutti i colori sono variabili CSS (appendice A).
- **Tavolozza delle variabili**: i colori di Manim (`#58C4DD` blu, `#FFFF00` giallo, `#DC75CD` rosa, `#83C167` verde, `#FF862F` arancione, `#5CD0B3` verde acqua, `#CAA3E8` viola, `#FC6255` rosso). Nel tema chiaro, nel testo, si usano le versioni scure definite nei token, perché giallo e azzurro su bianco non si leggono.

---

## 5. I riquadri delle figure

Ogni figura sta in un **riquadro nero** (`.stage`), come un fotogramma: legenda, disegno, eventuali controlli e riga di risultato dentro; didascalia fuori, sullo sfondo della pagina. Il riquadro è nero in entrambi i temi, con bordo sottile e angoli vivi. Poiché `.stage` ridefinisce i token con i valori scuri, dentro si usano sempre bianco e colori Manim.

HTML di una figura:

```html
<figure>
  <div class="w" id="nomeUnico"></div>
  <figcaption>Che cosa c'è sugli assi, che cosa vuol dire ogni colore, che cosa notare.</figcaption>
</figure>
```

Lo script di avvio avvolge in un `.stage` tutto ciò che in una `<figure>` non è didascalia. Ogni figura viene disegnata da una funzione dentro `INIT[N]`, che parte solo quando la lezione N viene aperta per la prima volta: con molte lezioni, montare tutto al caricamento blocca la pagina. **Gli id devono essere unici in tutta la pagina**, non solo nella lezione: un id ripetuto fa disegnare la figura nella lezione sbagliata (nascosta) senza errori visibili.

Le tabelle restano sullo sfondo del testo, fuori dai riquadri.

---

## 6. Un colore per variabile

Decidere all'inizio una tabella simbolo → colore e rispettarla ovunque: testo, formule, figure, quiz, in tutte le lezioni. Si colorano solo i simboli chiave; il resto resta neutro. Regola pratica per assegnare i colori per ruolo:

| Ruolo del simbolo | Colore |
|---|---|
| Relazioni o operatori centrali della materia | blu |
| Quantità di valore, punteggi, utilità, costi | giallo |
| Funzioni o oggetti scelti, risultati, domande | rosa |
| Insiemi, spazi, collezioni | verde |
| Parametri esterni, soglie, prezzi, passi | arancione |
| Probabilità, pesi, coefficienti di miscela | verde acqua |
| Il secondo oggetto di un confronto | viola |
| Errori, esiti negativi | rosso |

In un gioco o in un confronto fra due agenti, ogni agente ha un colore fisso (per esempio rosa il primo, azzurro il secondo) per nodi, payoff e testo. Verde e rosso servono anche per esito positivo e negativo nelle righe di risultato e nei quiz.

**Formule con KaTeX** e macro che assegnano una **classe**, non un colore fisso, così il colore segue il tema:

```js
const R=String.raw;
const BLUE='#58C4DD',YEL='#FFFF00',PINK='#DC75CD',GRN='#83C167',ORG='#FF862F',TEAL='#5CD0B3',PUR='#CAA3E8',RED='#FC6255',GRAY='#8c8c8c';
const NAME={[BLUE]:'blue',[YEL]:'yellow',[PINK]:'pink',[GRN]:'green',[ORG]:'orange',[TEAL]:'teal',[PUR]:'purple',[RED]:'red'};
const col=(c,s)=>R`\htmlClass{k-${NAME[c]}}{${s}}`;
const MAC={
  '\\rel':R`\mathrel{${col(BLUE,R`\succsim`)}}`,   // esempio: relazione in blu
  '\\uu':col(YEL,'u'),                               // esempio: valore in giallo
  '\\sX':col(GRN,'X')                                // esempio: insieme in verde
};
```

Avvertenze che evitano errori già incontrati:

- Delimitatori `\( \)` e `\[ \]`, **mai** `$`: nel testo possono comparire prezzi.
- Non chiamare una macro con un nome che KaTeX usa già (`\sp`, `\lq`, `\ce`): se una formula non si colora o dà errore, rinominare la macro.
- Nell'HTML scrivere `\lt` e `\gt` al posto di `<` e `>` dentro le formule.
- Decimali con la virgola nelle lingue che la usano: `0{,}6`.
- Dopo il rendering, incollare la punteggiatura che segue una formula in uno span `white-space:nowrap` (lo fa `renderMath`, appendice B).
- Nei pulsanti selezionati forzare `color:inherit` sulle formule.
- Formule in blocco in un contenitore `.eq` con `overflow-x:auto`.
- Se KaTeX non si carica, la funzione `K` restituisce la stringa grezza senza rompere la pagina.
- Lo stesso simbolo non deve avere due significati nella stessa lezione (per esempio una lettera usata sia come parametro sia come fattore di scala): usare un'altra lettera.

---

## 7. Le figure

### 7.1 Che cosa disegnare

Tutte le figure sono SVG scritti a mano con `viewBox` (scalano), più un `<canvas>` solo se serve colorare una regione campionando una griglia. Nessuna libreria di grafici.

Tipi che funzionano bene a colpo d'occhio:

- **più riquadri affiancati** (classe `.duo` per due, `.trio` per tre, `.multi` per una griglia) che confrontano casi diversi con lo stesso disegno: «prima / dopo», «rispettato / violato», tre funzioni diverse, sei esempi classici;
- **un grafico con la costruzione disegnata** (una curva, una corda, una freccia che porta al risultato, un tratto evidenziato in rosso dove una regola è violata);
- **tabelle disegnate in SVG** con le celle colorate per significato (che cosa si può ottenere, che cosa è vietato, chi ci guadagna e chi ci perde);
- **diagrammi di flusso logico solo se mostrano un meccanismo** (una rotazione fra tre agenti, un'induzione su 1, 2, 3 casi), mai come riassunto del testo;
- **linee dei numeri** con marcatori per confrontare valori a colpo d'occhio;
- **barre semplici** per dati sperimentali (etichetta, barra, percentuale), con numero di partecipanti e data nella didascalia;
- **alberi** per processi sequenziali, con linee tratteggiate per ciò che non si può distinguere;
- **matrici** colorate con i valori dei due agenti in colori diversi.

Le figure interattive (trascinare un punto, uno slider) vanno bene quando muovere un parametro è l'esperienza che insegna. In quel caso la figura si apre già su un caso interessante.

### 7.2 Regole di disegno

- **Legenda** sopra il disegno per ogni colore o tratto usato (forme: linea, punto, quadrato, tratteggio). Gli assi hanno un'etichetta a parole.
- **Riga di risultato** (classe `.out`, `aria-live="polite"`) sotto il disegno nelle figure interattive: dice a parole che cosa succede e mostra i valori con le formule colorate. Altezza minima fissa, così la figura non salta. Nelle figure statiche a più riquadri, una nota breve sotto ogni riquadro con il verdetto («**Rispettato.** ...», «**Violato.** ...»), in verde o rosso.
- **Poco testo nel disegno**: lettere dei punti, numeri degli assi in grigio, etichette brevi. Etichette con contorno nero (`paint-order:stroke; stroke:#000; stroke-width:3px`) quando passano sopra linee.
- **Precisione**: assi che non sporgono oltre l'area, etichette che non si sovrappongono fra loro né alle curve, cerchi veri (stessa scala sui due assi), elementi ritagliati con `clipPath`, numeri degli assi non tagliati, intervallo degli assi che contiene tutti i dati, rette che passano davvero per i punti indicati.
- **I numeri del disegno sono calcolati, non disegnati a occhio**: se un punto è «la soluzione», il codice la calcola con la formula della lezione; se una curva è «la curva di livello per quel punto», la costante si ricava dal punto. Quando una figura è qualitativa (curve indicative), la didascalia lo dice.
- **Didascalia completa**: insieme al testo vicino deve spiegare tutta la figura (assi, colori, che cosa notare, che cosa fare). Per figure a più riquadri scrivere «nel primo riquadro... nel secondo...», **mai** «a sinistra / a destra»: su telefono i riquadri vanno uno sotto l'altro.
- **Stesso esempio, più figure**: lo stesso caso numerico torna in più figure della lezione con un elemento in più. Per questo conviene scrivere funzioni riutilizzabili con opzioni (un piano cartesiano, un riquadro con titolo, un albero, una matrice) invece di una funzione per figura.

### 7.3 Interazione, quando serve

- Slider con etichetta a sinistra che dice che cosa sono e valore a destra.
- Trascinamento con Pointer Events, `setPointerCapture`, `touch-action:none`; coordinate da `getBoundingClientRect` rapportate al `viewBox`; con due punti si prende il più vicino al `pointerdown`; valori arrotondati e scatto ai bordi per raggiungere i casi limite.
- Un selettore fra alternative (`aria-pressed`) ha sempre sopra una riga che dice che cosa si sceglie.
- Il verdetto calcolato dalla figura deve seguire la definizione esatta, con una piccola tolleranza numerica.

### 7.4 Animazioni

Tutto ciò che avanza a passi si mostra con i **controlli da video** (funzione `player`, appendice B): play/pausa in basso a sinistra, tempo trascorso e totale, barra trascinabile. Lente (almeno 10-15 secondi in tutto), fluide (valori interpolati con una curva morbida), mai elementi sovrapposti in nessun istante, riga di risultato che racconta il passo corrente («Passo 2 di 3. ...»). Partono ferme. Se però un disegno fermo con tutti i passi visibili insieme spiega altrettanto bene, preferire il disegno fermo.

---

## 8. Quiz

- **Quiz finale**: quattro-sei domande per lezione nella sezione «Mettiti alla prova». **Quiz nel testo**: una domanda ciascuno, subito dopo il concetto.
- Si sceglie un'opzione (pulsanti a tutta larghezza, testo allineato a sinistra), poi si preme **«Verifica»**. Giusta: opzione in verde e spiegazione breve. Sbagliata: opzione in rosso e un **suggerimento che non svela la soluzione**.
- Le alternative sbagliate sono plausibili e nessuna deve poter essere corretta anch'essa. La posizione della risposta giusta varia (non sempre la prima).
- Almeno una domanda per lezione chiede un calcolo con i numeri di un esempio della lezione. Le domande della fonte («Is X true?», «Which one would you choose?») diventano quiz.
- Formato dei dati (appendice B): `QZ['3a']=()=>[{q:'domanda', o:['opz. 1','opz. 2','opz. 3','opz. 4'], a:1, e:'spiegazione', h:'suggerimento'}]`, con `a` indice da 0. Nell'HTML: `<div class="quiz inq" data-quiz="3a"></div>` nel testo, `<div class="quiz" data-quiz="3"></div>` alla fine.

---

## 9. Lingua e tono

- Lingua della pagina coerente in tutto (testo, figure, quiz, interfaccia).
- Seconda persona, frasi brevi, nessun tono promozionale.
- Termini tecnici nella lingua della pagina, con l'originale tra parentesi alla prima comparsa quando serve («convinzione, in inglese *belief*»).
- Se l'utente ha regole tipografiche (per esempio niente trattini lunghi), rispettarle anche dentro figure, quiz e didascalie.

---

## 10. Organizzazione del codice

Tenere i pezzi separati e concatenarli con uno script di build: aggiungere una lezione non deve toccare le altre.

```
src/
  style.css          foglio di stile (appendice A)
  top.html           barra superiore e apertura di <main>
  l1.html ... lN.html   una lezione per file
  foot.html          chiusura di <main> e piè di pagina
  js/core.js         colori, macro, funzioni di base (appendice B)
  js/shared.js       componenti riutilizzabili (piani, alberi, matrici, riquadri)
  js/thumbs.js       miniature: THUMB[n] = stringa SVG
  js/l1.js ... lN.js    INIT[n]=function(){...}; QZ['na']=()=>[...]
  js/boot.js         riquadri, tema, navigazione, montaggio pigro (appendice B)
build.py             concatena tutto in un file
test.py              test automatici in browser
```

Lo script di build:

1. legge `katex.min.css` dalla copia locale di KaTeX (installata con npm) e incorpora i soli font `.woff2` come `data:` URI, così le formule hanno i font giusti anche offline;
2. scrive l'`<head>`: titolo, Google Fonts (Figtree e Source Serif 4), il CSS di KaTeX, il foglio di stile, lo script che legge il tema da `localStorage`;
3. concatena `top.html`, le lezioni in ordine, `foot.html`;
4. in fondo al body: `katex.min.js` e `contrib/auto-render.min.js` di KaTeX 0.16.9 da cdnjs, poi tutto il JavaScript dentro **una sola funzione autoeseguita** `(function(){ ... })();` nell'ordine core, shared, thumbs, l1...lN, boot;
5. produce due file: quello per la pubblicazione e quello autonomo con `<!DOCTYPE html>`, `<meta charset>` e `<meta viewport>`.

---

## 11. Verifica prima di consegnare

Con Playwright e Chromium. I CDN spesso non sono raggiungibili dall'ambiente di lavoro: installare `katex` con npm e instradare le richieste a cdnjs verso la copia locale (`page.route`).

Per ogni lezione, a 1150 px e a 400 px:

1. aprire `#lezione-N`; cliccare tutti i pulsanti delle figure; portare ogni slider a minimo, massimo e metà; rispondere a ogni quiz;
2. controllare: nessun errore JavaScript (`pageerror` e `console.error`), nessun elemento `.katex-error`, nessuna macro rimasta come testo (`\nome` nel testo visibile), nessun `NaN`, `undefined` o `Infinity` nell'HTML, nessuna figura vuota, `scrollWidth` uguale a `clientWidth` (niente scorrimento orizzontale), nessun `<ul>`, `<ol>`, `<li>`, numero di quiz e miniature attesi;
3. fare uno screenshot di **ogni figura** e guardarlo davvero: etichette sovrapposte o tagliate, curve fuori dagli assi, testi illeggibili, label di una curva sopra un'altra curva. Prima di fotografare aprire tutti i `<details>`, altrimenti le figure al loro interno risultano invisibili e il test si blocca. Per le animazioni guardare inizio, metà e fine;
4. contare parole e figure per lezione (circa 150 parole per figura al massimo);
5. almeno a campione: tema chiaro e larghezza telefono.

Problemi già incontrati e la loro causa:

- scorrimento orizzontale su telefono: aggiungere `.lesson{overflow-x:clip}`, `position:relative` ai contenitori scorrevoli, `max-width:100%` ai `summary`;
- figura vuota senza errori: id duplicato in un'altra lezione;
- figura che si apre in un riquadro sbagliato: funzione di disegno che cerca un id ancora presente in una lezione da cui il contenuto è stato spostato;
- formula non colorata: nome di macro già usato da KaTeX;
- regole `display` che annullano `hidden`: mettere `[hidden]{display:none!important}`.

---

## 12. Consegna e aggiornamenti

- Prima consegna: un file `.html` unico, e la proposta in una riga di pubblicarlo come pagina con link. Non pubblicare senza conferma.
- Aggiornamenti: stesso file nella stessa cartella, stessa pagina pubblicata (stesso link). Rileggere il file scritto nella cartella dell'utente.
- Il messaggio finale è breve e dice: che cosa è cambiato, che cosa è stato verificato e che cosa no, le aggiunte rispetto alla fonte, i dati presi altrove, i refusi della fonte, le domande aperte per l'utente. Niente riepilogo dei passaggi fatti.

---

## 13. Che cosa evitare

Elementi tipici delle pagine generate automaticamente: etichette in maiuscolo monospaziato, schede con bordo e angoli arrotondati attorno a ogni blocco, barre colorate sul lato delle definizioni, «pillole», emoji come segnaposto, font come Inter o IBM Plex, tavolozze grigio-blu smorzate, didascalie in corsivo, gradienti decorativi, animazioni che non spiegano nulla.

Nelle lezioni: elenchi puntati; schemi che ridicono il testo; paragrafi lunghi senza figure; pulsanti «Rivela» per le domande; selettori in cima alle figure per passare da uno stato all'altro quando bastano due riquadri; animazioni veloci o a scatti; termini usati senza spiegazione; figure con troppi elementi; numeri disegnati a occhio; un nuovo file a ogni modifica.

---

## 14. In caso di dubbio: guardare 3b1b

Per decidere come rendere un titolo, una didascalia, un quiz, una spaziatura o quanto testo mettere fra due figure, guardare come lo fa 3Blue1Brown invece di decidere a memoria. Lezioni di riferimento:

- https://www.3blue1brown.com/lessons/neural-networks (apertura con figura, definizioni provvisorie, quiz)
- https://www.3blue1brown.com/lessons/gradient-descent (dal caso semplice al generale)
- https://www.3blue1brown.com/lessons/backpropagation (intuizione senza notazione)
- https://www.3blue1brown.com/lessons/backpropagation-calculus (formule con un colore per variabile)

Basarsi sulla parte scritta, non sui video. Se il sito contraddice questo documento, vale il sito, tranne che per queste scelte volute: riquadri neri attorno alle figure, sfondo scuro `#111`, pagina che si apre in tema scuro, barra superiore traslucida con griglia animata, figure statiche a colpo d'occhio, controlli da video per le animazioni, nessun elenco puntato, quiz al posto dei «Rivela».

---

## Appendice A. Foglio di stile completo

Da copiare in `src/style.css`. Le classi `.duo`, `.trio`, `.multi` e `.cellnote` servono per le figure a più riquadri; `.stmt` per gli enunciati; `.reveal` per le dimostrazioni; `.navend` e `.th` per i link fra lezioni e le miniature.

```css
/* Fasce a tutta larghezza alternate, colonna centrale di lettura, titoli centrati.
   Ogni figura sta in un riquadro nero, come un fotogramma, in entrambi i temi. */
:root,.stage,.top{
  --bg:#111; --band:#181818; --hero:#12222f; --fg:#fff; --gray:#c9c9c9; --dim:#8c8c8c; --rule:#333;
  --theme:#6db9f4; --on-theme:#000; --tint:rgba(109,185,244,.16); --tint2:rgba(109,185,244,.3); --track:#1c1c1c;
  --blue:#58C4DD; --yellow:#FFFF00; --pink:#DC75CD; --green:#83C167; --orange:#FF862F; --teal:#5CD0B3; --purple:#CAA3E8; --red:#FC6255;
  --right:rgba(131,193,103,.28); --wrong:rgba(252,98,85,.28);
}
:root{
  color-scheme:dark; --frame:#3a3a3a;
  --serif:'Source Serif 4',Georgia,'Times New Roman',serif;
  --sans:'Figtree',system-ui,-apple-system,'Segoe UI',sans-serif;
}
:root[data-theme="light"]{
  color-scheme:light; --frame:#000;
  --bg:#fff; --band:#f6f6f6; --hero:#dbeaf6; --fg:#000; --gray:#3d3d3d; --dim:#6b6b6b; --rule:#dadada;
  --theme:#1f7dc7; --on-theme:#fff; --tint:rgba(31,125,199,.14); --tint2:rgba(31,125,199,.26); --track:#e6e6e6;
  --blue:#1489a8; --yellow:#a67800; --pink:#b53aa3; --green:#4a8a2a; --orange:#cc5c08; --teal:#12897a; --purple:#7745b5; --red:#cc3528;
  --right:rgba(74,138,42,.22); --wrong:rgba(204,53,40,.2);
}
*{box-sizing:border-box}
[hidden]{display:none!important}
html{font-size:105%;scroll-padding-top:5rem}
body{margin:0;background:var(--bg);color:var(--fg);font:350 1rem/2 var(--serif);-webkit-text-size-adjust:100%}
a{color:var(--theme)}
strong,b{font-weight:600}
p{margin:0}
h1,h2,h3{font-family:var(--sans);font-weight:350;text-align:center;text-wrap:balance;margin:0;line-height:1.5}
h1{font-size:1.875rem}
h2{font-size:1.5rem}
h3{font-size:1.25rem;font-weight:500;margin-top:1.2rem}

.top{position:sticky;top:env(safe-area-inset-top,0px);z-index:20;background:rgba(0,0,0,.78);-webkit-backdrop-filter:saturate(1.4) blur(14px);backdrop-filter:saturate(1.4) blur(14px);color:#fff;
  display:flex;align-items:center;gap:1.2rem;padding:1.05rem 1.6rem;font-family:var(--sans);font-size:1.02rem;line-height:1.3;overflow:hidden;border-bottom:1px solid rgba(255,255,255,.07)}
@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){.top{background:#000}}
.top::before{content:"";position:absolute;left:-40px;top:-30px;width:560px;height:260px;pointer-events:none;z-index:0;
  background-image:linear-gradient(rgba(88,160,230,.34) 1px,transparent 1px),linear-gradient(90deg,rgba(88,160,230,.34) 1px,transparent 1px),linear-gradient(rgba(255,255,255,.13) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.13) 1px,transparent 1px);
  background-size:184px 184px,184px 184px,46px 46px,46px 46px;
  transform:perspective(420px) rotateX(58deg) rotateZ(-9deg);transform-origin:0 0;
  animation:topgrid 26s linear infinite;will-change:background-position;
  -webkit-mask-image:radial-gradient(ellipse 70% 80% at 12% 10%,#000 0%,rgba(0,0,0,.5) 45%,transparent 78%);mask-image:radial-gradient(ellipse 70% 80% at 12% 10%,#000 0%,rgba(0,0,0,.5) 45%,transparent 78%)}
@keyframes topgrid{from{background-position:0 0,0 0,0 0,0 0}to{background-position:184px 184px,184px 184px,184px 184px,184px 184px}}
.top>*{position:relative;z-index:1}
.top .name{font-family:var(--serif);font-weight:400;font-size:1.45rem;letter-spacing:.005em;margin-right:auto;white-space:nowrap;color:#fff;text-decoration:none}
.top .right{display:flex;align-items:center;justify-content:flex-end;gap:.4rem;min-width:0;flex:0 1 auto}
.top nav{display:flex;gap:.25rem;overflow-x:auto;scrollbar-width:none;min-width:0;flex:0 1 auto;padding:0 14px;
  -webkit-mask-image:linear-gradient(90deg,transparent 0,#000 18px,#000 calc(100% - 18px),transparent 100%);mask-image:linear-gradient(90deg,transparent 0,#000 18px,#000 calc(100% - 18px),transparent 100%)}
.top nav::-webkit-scrollbar{display:none}
.top nav a{color:#fff;text-decoration:none;padding:.5rem .8rem;border-radius:10px;white-space:nowrap;transition:background .15s}
.top nav a:hover{background:rgba(109,185,244,.12)}
.top nav a[aria-current="page"]{background:rgba(109,185,244,.2);color:#6db9f4}
.tog{flex:none;background:none;border:0;color:#fff;cursor:pointer;padding:6px;border-radius:10px;display:grid;place-items:center}
.tog:hover{background:rgba(109,185,244,.12)}
.tog svg{width:22px;height:22px}

section{padding:4rem 20px}
.lesson{overflow-x:clip;position:relative}
.scroll,.eq{position:relative}
.lesson>section:nth-of-type(odd){background:var(--band)}
.lesson>section.hero{background:var(--hero);padding-block:3.2rem}
.col{max-width:43.75rem;margin:0 auto;display:flex;flex-direction:column;gap:1.6rem;min-width:0}
.col>*{min-width:0}
.hero .col{align-items:center;text-align:center;gap:.6rem}
.hero .chap{font-family:var(--sans);font-size:1.05rem;color:var(--gray)}
.hero .desc{max-width:34rem;line-height:1.8;margin-top:.4rem}
.stmt{padding-inline:1.6rem}
.eq{overflow-x:auto;overflow-y:hidden;padding:2px 0}
.katex-display{margin:.2rem 0}
.katex{text-transform:none;letter-spacing:0}

figure{margin:.6rem 0;display:flex;flex-direction:column;align-items:center;gap:1rem;width:100%}
figcaption{color:var(--gray);text-align:center;line-height:1.5;max-width:38rem}
svg{display:block;width:100%;height:auto;max-width:100%}
svg text{font-family:var(--sans);fill:var(--fg)}
svg .g{fill:var(--gray)}
.stage{width:100%;display:flex;flex-direction:column;align-items:center;gap:1rem;background:#000;color:var(--fg);color-scheme:dark;border:1px solid var(--frame);padding:1.6rem 1.4rem}
.k-blue{color:var(--blue)}.k-yellow{color:var(--yellow)}.k-pink{color:var(--pink)}.k-green{color:var(--green)}.k-orange{color:var(--orange)}.k-teal{color:var(--teal)}.k-purple{color:var(--purple)}.k-red{color:var(--red)}
.w{width:100%;display:flex;flex-direction:column;align-items:center;gap:1rem}
.ctl{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;align-items:center}
.ctl .lab{font-family:var(--sans);color:var(--gray);font-size:.95rem;margin-right:4px}
.btn{font:350 1rem/1.3 var(--sans);color:var(--fg);background:var(--tint);border:0;border-radius:10px;padding:.62rem .9rem;cursor:pointer;min-height:2.5rem}
.btn:hover{background:var(--tint2)}
.btn{transition:background-color .15s}
.btn[aria-pressed="true"],.btn.solid{background:var(--theme);color:var(--on-theme)}
.btn[aria-pressed="true"] .katex *{color:inherit!important}
.btn:focus-visible,input:focus-visible,summary:focus-visible,a:focus-visible{outline:2px solid var(--fg);outline-offset:2px}
.out{font-family:var(--sans);text-align:center;line-height:1.7;max-width:38rem;min-height:3.4em}
.ok{color:var(--green)}.bad{color:var(--red)}
.num{font-variant-numeric:tabular-nums}
.sl{display:grid;grid-template-columns:auto 1fr 3.4rem;gap:12px;align-items:center;width:100%;max-width:26rem;font-family:var(--sans);line-height:1.3}
.sl output,.sl span.v{text-align:right;font-variant-numeric:tabular-nums;color:var(--gray)}
input[type=range]{width:100%;margin:0;accent-color:var(--theme)}

.bars{display:grid;gap:6px;width:100%;max-width:30rem;font-family:var(--sans);line-height:1.4}
.bars h4{font:500 1rem var(--sans);margin:.8rem 0 .1rem;text-align:center}
.bar{display:grid;grid-template-columns:9rem 1fr 3rem;gap:10px;align-items:center}
.bar i{display:block;height:1rem;background:var(--track);position:relative}
.bar i::after{content:"";position:absolute;inset:0;width:var(--w);background:var(--theme);transition:width .35s ease}
.bar b{font-weight:400;text-align:right;font-variant-numeric:tabular-nums}
.scroll{overflow-x:auto;width:100%}
table{border-collapse:collapse;width:100%;font-family:var(--sans);line-height:1.5;font-size:.95rem}
th,td{padding:.55rem .7rem;border-bottom:1px solid var(--rule);text-align:left;vertical-align:top}
th{font-weight:500;color:var(--gray)}
td.n,th.n{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
td.c,th.c{text-align:center}

details.reveal{width:100%;display:flex;flex-direction:column;align-items:center}
details.reveal summary{list-style:none;cursor:pointer;font:350 1rem/1.3 var(--sans);background:var(--tint);border-radius:10px;padding:.62rem 1.1rem;width:max-content;max-width:100%;text-align:center;margin:0 auto}
details.reveal summary::-webkit-details-marker{display:none}
details.reveal summary:hover{background:var(--tint2)}
details.reveal[open] summary{margin-bottom:1.2rem;color:var(--gray)}
details.reveal .in{display:flex;flex-direction:column;gap:1.2rem}

.quiz{display:flex;flex-direction:column;gap:2.6rem}
.q{display:flex;flex-direction:column;gap:.9rem}
.q>p{font-weight:600}
.opts{display:grid;gap:8px}
.opts .btn{text-align:left;padding:.7rem 1rem;line-height:1.5}
.opts .btn.right{background:var(--right);color:var(--fg)}
.opts .btn.wrong{background:var(--wrong);color:var(--fg)}
.q .chk{align-self:flex-start}
.fb{font-family:var(--sans);line-height:1.7;color:var(--gray)}
.fb b{color:var(--fg)}

.legend{display:flex;flex-wrap:wrap;gap:.3rem 1.1rem;justify-content:center;font-family:var(--sans);color:var(--gray);line-height:1.4;font-size:.95rem}
.legend i{display:inline-block;width:1.1em;height:3px;vertical-align:middle;margin-right:.4em;border-radius:2px}
.legend i.dot{width:.7em;height:.7em;border-radius:50%}
.legend i.box{width:.9em;height:.9em;border-radius:0}
.legend i.dash{background:none!important;border-top:3px dashed;height:0}
.pick{font-family:var(--sans);color:var(--gray);font-size:.95rem;line-height:1.3;text-align:center}
.grp{display:flex;flex-direction:column;align-items:center;gap:.5rem;width:100%}
.player{display:flex;align-items:center;gap:.9rem;width:100%;max-width:34rem;font-family:var(--sans);font-size:1rem;line-height:1}
.player button{background:none;border:0;color:#fff;padding:.3rem;border-radius:8px;display:flex;cursor:pointer}
.player button:hover{background:var(--tint)}
.player .tm{font-variant-numeric:tabular-nums;white-space:nowrap;color:var(--gray)}
.player input[type=range]{flex:1;accent-color:#fff;height:4px}
.duo{display:grid;grid-template-columns:1fr 1fr;gap:1rem;width:100%;align-items:start}
.duo>div{display:flex;flex-direction:column;align-items:center;gap:.6rem;min-width:0}
.duo h4{font:500 1rem/1.3 var(--sans);margin:0;text-align:center}
.navend{display:grid;grid-template-columns:1fr 1fr;gap:.8rem}
.navend a{font-family:var(--sans);background:var(--tint);color:var(--fg);text-decoration:none;border-radius:10px;padding:1rem 1.1rem;line-height:1.4;display:flex;flex-direction:row;align-items:center;gap:.9rem}
.navend a:hover{background:var(--tint2)}
.navend a small{color:var(--gray);font-size:.85rem}
.navend a .tx{display:flex;flex-direction:column;gap:.2rem;flex:1;min-width:0}
.navend a.next{flex-direction:row-reverse;text-align:right;grid-column:2}
.th{flex:none;width:108px;aspect-ratio:3/2;background:#000;border:1px solid var(--frame);display:block}
.th svg{display:block;width:100%;height:100%}
.inq{width:100%}
footer{padding:2.4rem 20px;color:var(--dim);font-size:.88rem;line-height:1.7;border-top:1px solid var(--rule)}
footer .col{gap:.6rem}
@media (max-width:560px){
  html{font-size:100%}
  body{line-height:1.8}
  section{padding:3rem 16px}
  .top .name{display:none}
  .stmt{padding-inline:.8rem}
  .bar{grid-template-columns:6.6rem 1fr 2.6rem}
  .navend{grid-template-columns:1fr}.navend a.next{grid-column:1}
  .th{width:84px}
  .duo{grid-template-columns:1fr}
  .top{padding:.6rem .5rem;gap:.3rem;font-size:.95rem}
  .top nav a{padding:.42rem .65rem}
  .btn{padding:.6rem .75rem}
  .stage{padding:1.1rem .8rem}
}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}*{transition:none!important}.top::before{animation:none}}

.trio{display:grid;grid-template-columns:repeat(3,1fr);gap:.8rem;width:100%;align-items:start}
.trio>div{display:flex;flex-direction:column;align-items:center;gap:.5rem;min-width:0}
.trio h4{font:500 .95rem/1.3 var(--sans);margin:0;text-align:center;min-height:2.6em;display:flex;align-items:center}
.stage:has(.player) .out{min-height:5.2em}
@media (max-width:560px){.trio{grid-template-columns:1fr}.trio>div{max-width:20rem;margin:0 auto;width:100%}.trio h4{min-height:0}}
.multi{display:grid;grid-template-columns:repeat(auto-fit,minmax(10.5rem,1fr));gap:1rem .8rem;width:100%;align-items:start;justify-items:center}
.multi>div{display:flex;flex-direction:column;align-items:center;gap:.4rem;min-width:0;width:100%;max-width:17rem}
.multi h4{font:500 .95rem/1.3 var(--sans);margin:0;text-align:center}
.cellnote{font:400 .9rem/1.35 var(--sans);color:var(--gray);text-align:center}
.cellnote .ok,.cellnote .bad{font-weight:600}
.duo>div{max-width:22rem;justify-self:center;width:100%}```

Nel `<head>`, prima del foglio di stile, lo script del tema:

```html
<script>try{if(localStorage.getItem('tema')==='light')document.documentElement.setAttribute('data-theme','light')}catch(e){}</script>
```

---

## Appendice B. JavaScript di base

### B.1 `core.js`: costanti, macro, funzioni di aiuto, quiz, player

```js
'use strict';
const R=String.raw;
const BLUE='#58C4DD',YEL='#FFFF00',PINK='#DC75CD',GRN='#83C167',ORG='#FF862F',TEAL='#5CD0B3',PUR='#CAA3E8',RED='#FC6255',GRAY='#8c8c8c';
const NAME={[BLUE]:'blue',[YEL]:'yellow',[PINK]:'pink',[GRN]:'green',[ORG]:'orange',[TEAL]:'teal',[PUR]:'purple',[RED]:'red'};
const col=(c,s)=>R`\htmlClass{k-${NAME[c]}}{${s}}`;
const MAC={ /* una macro per ogni simbolo colorato della tabella dei colori */ };

const hasK=typeof katex!=='undefined';
const K=s=>hasK?katex.renderToString(s,{throwOnError:false,macros:MAC,trust:true,strict:'ignore'}):s;
function renderMath(root){
  if(typeof renderMathInElement==='undefined')return;
  renderMathInElement(root,{macros:MAC,throwOnError:false,trust:true,strict:'ignore',
    delimiters:[{left:'\\[',right:'\\]',display:true},{left:'\\(',right:'\\)',display:false}]});
  /* la punteggiatura dopo una formula non va a capo da sola */
  root.querySelectorAll('.katex').forEach(k=>{
    if(k.closest('.katex-display'))return;const n=k.nextSibling;
    if(n&&n.nodeType===3){const m=n.nodeValue.match(/^[.,;:!?»)]+/);
      if(m){const w=document.createElement('span');w.style.whiteSpace='nowrap';k.parentNode.insertBefore(w,k);w.append(k,m[0]);n.nodeValue=n.nodeValue.slice(m[0].length)}}
  });
}
const $=s=>document.querySelector(s);
const el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!==undefined)e.innerHTML=h;return e};
const btn=(label,html)=>{const b=el('button','btn');b.type='button';if(html)b.innerHTML=label;else b.textContent=label;return b};
const press=(b,on)=>b.setAttribute('aria-pressed',on?'true':'false');
const fmt=v=>String(Math.round(v*100)/100).replace('-','−').replace('.',',');   /* numeri con la virgola */
const out=()=>{const o=el('div','out');o.setAttribute('aria-live','polite');return o};
const slider=(label,min,max,step,val,on)=>{
  const l=el('label','sl'),s=el('span','',label),i=el('input'),v=el('span','v');
  i.type='range';i.min=min;i.max=max;i.step=step;i.value=val;
  i.oninput=()=>{v.textContent=fmt(+i.value);on(+i.value)};v.textContent=fmt(val);
  l.append(s,i,v);return l;
};
/* legenda: [colore, testo, forma] con forma '' (linea), 'dot', 'box', 'dash' */
const legend=items=>el('div','legend',items.map(a=>'<span><i class="'+(a[2]||'')+'" style="'+(a[2]==='dash'?'border-color:':'background:')+a[0]+'"></i>'+a[1]+'</span>').join(''));
/* gruppo di pulsanti con la riga che dice che cosa si sceglie */
const group=(label,buttons)=>{const g=el('div','grp');g.append(el('div','pick',label));const c=el('div','ctl');buttons.forEach(b=>c.append(b));g.append(c);return g};
/* SVG statico dentro un contenitore a larghezza massima */
const svgBox=(root,w,h,inner,label,maxw)=>{const d=el('div');d.style.cssText='width:100%;max-width:'+(maxw||'34rem');
  d.innerHTML='<svg viewBox="0 0 '+w+' '+h+'" role="img" aria-label="'+label+'">'+inner+'</svg>';root.append(d);return d};
/* testo SVG: o = {s dimensione, a ancoraggio, w peso, i corsivo, serif, f colore, x attributi extra} */
const tx=(x,y,t,o)=>{o=o||{};return '<text x="'+x+'" y="'+y+'" font-size="'+(o.s||14)+'" text-anchor="'+(o.a||'middle')+'"'+(o.w?' font-weight="'+o.w+'"':'')+(o.i?' font-style="italic"':'')+
  ' style="'+(o.i||o.serif?'font-family:var(--serif);':'')+(o.f?'fill:'+o.f:'')+'"'+(o.x||'')+'>'+t+'</text>'};
const arrowDef=(id,c)=>'<marker id="'+id+'" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto"><path d="M0 0L10 5L0 10z" fill="'+c+'"/></marker>';
/* riquadro con titolo e nota dentro una griglia .duo / .trio / .multi */
const cell=(host,title,svgInner,W,H,label,foot)=>{const d=el('div');if(title)d.append(el('h4','',title));
  const b=el('div');b.style.width='100%';b.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+label+'">'+svgInner+'</svg>';d.append(b);
  if(foot)d.append(el('div','cellnote',foot));host.append(d);return d};
const svgPoint=(svg,e,W,H)=>{const r=svg.getBoundingClientRect();return [(e.clientX-r.left)/r.width*W,(e.clientY-r.top)/r.height*H]};
const drag=(node,move)=>{let down=false;
  node.addEventListener('pointerdown',e=>{down=true;try{node.setPointerCapture(e.pointerId)}catch(_){}move(e,true);e.preventDefault()});
  node.addEventListener('pointermove',e=>{if(down)move(e,false)});
  ['pointerup','pointercancel'].forEach(t=>node.addEventListener(t,()=>{down=false}));
};
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));

/* controlli da video: play/pausa, tempo, barra trascinabile; onFrame riceve il tempo in secondi */
function player(host,dur,onFrame){
  const IC={play:'<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5z" fill="currentColor"/></svg>',
    pause:'<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6.5 5h4v14h-4zM13.5 5h4v14h-4z" fill="currentColor"/></svg>'};
  const bar=el('div','player'),b=el('button','',IC.play),tm=el('span','tm'),sc=el('input');
  b.type='button';b.setAttribute('aria-label','Riproduci');
  sc.type='range';sc.min=0;sc.max=dur;sc.step=0.01;sc.value=0;sc.setAttribute('aria-label','Posizione nell\'animazione');
  bar.append(b,tm,sc);host.append(bar);
  let pos=0,raf=null,last=0;const f=x=>{const s=Math.floor(x+1e-6);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
  function show(){sc.value=pos;tm.textContent=f(pos)+' / '+f(dur);onFrame(pos)}
  function stop(){if(raf){cancelAnimationFrame(raf);raf=null}b.innerHTML=IC.play;b.setAttribute('aria-label','Riproduci')}
  function tick(ts){if(!last)last=ts;pos=Math.min(dur,pos+Math.min(0.1,(ts-last)/1000));last=ts;show();if(pos>=dur){raf=null;stop()}else raf=requestAnimationFrame(tick)}
  function play(){if(pos>=dur)pos=0;last=0;b.innerHTML=IC.pause;b.setAttribute('aria-label','Pausa');raf=requestAnimationFrame(tick)}
  b.addEventListener('click',()=>raf?stop():play());
  sc.addEventListener('input',()=>{stop();pos=+sc.value;show()});
  show();return {stop,play};
}

/* quiz a scelta multipla: si sceglie, poi «Verifica» */
function quiz(root,qs){
  qs.forEach(q=>{
    const box=el('div','q');box.append(el('p','',q.q));
    const opts=el('div','opts'),fb=el('div','fb'),chk=btn('Verifica');chk.classList.add('solid','chk');fb.setAttribute('aria-live','polite');
    let sel=null;
    const bs=q.o.map((t,i)=>{const b=btn(t,true);b.onclick=()=>{sel=i;bs.forEach((x,j)=>{press(x,j===i);x.classList.remove('right','wrong')});fb.innerHTML=''};opts.append(b);return b});
    chk.onclick=()=>{if(sel===null){fb.innerHTML='Scegli prima una risposta.';return}
      press(bs[sel],false);bs[sel].classList.add(sel===q.a?'right':'wrong');
      fb.innerHTML=sel===q.a?'<b>Esatto.</b> '+q.e:'<b>Non proprio.</b> '+q.h};
    box.append(opts,chk,fb);root.append(box);
  });
}
const INIT={},QZ={},THUMB={};
```

### B.2 `boot.js`: riquadri, tema, navigazione, montaggio pigro

```js
/* ogni figura in un riquadro nero */
document.querySelectorAll('figure').forEach(f=>{
  const kids=[...f.children].filter(c=>c.tagName!=='FIGCAPTION'&&!c.classList.contains('scroll'));
  if(!kids.length)return;const st=el('div','stage');f.insertBefore(st,kids[0]);kids.forEach(k=>st.append(k));
});
/* tema chiaro / scuro */
(function(){
  const b=$('#tog'),root=document.documentElement;
  const moon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/></svg>';
  const sun='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  function paint(){const light=root.getAttribute('data-theme')==='light';
    b.innerHTML=light?moon:sun;b.setAttribute('aria-label',light?'Passa al tema scuro':'Passa al tema chiaro')}
  b.onclick=()=>{const light=root.getAttribute('data-theme')==='light';
    root.setAttribute('data-theme',light?'dark':'light');
    try{localStorage.setItem('tema',light?'dark':'light')}catch(e){}paint()};
  paint();
})();
/* navigazione: una lezione alla volta, figure e quiz montati alla prima apertura */
const lessons=[...document.querySelectorAll('.lesson')],links=[...document.querySelectorAll('.top nav a')];
const LAST=lessons.length,done={};
lessons.forEach(l=>{
  const n=+l.dataset.n,nav=l.querySelector('.navend');if(!nav)return;
  const card=(m,cls,lab)=>'<a class="'+cls+'" href="#lezione-'+m+'" data-go="'+m+'"><span class="th" aria-hidden="true">'+(THUMB[m]||'')+
    '</span><span class="tx"><small>'+lab+'</small>'+m+' · '+lessons[m-1].dataset.title+'</span></a>';
  nav.innerHTML=(n>1?card(n-1,'prev','Lezione precedente'):'')+(n<LAST?card(n+1,'next','Lezione successiva'):'');
});
function show(n,scroll){
  lessons.forEach(l=>{l.hidden=+l.dataset.n!==n});
  links.forEach(a=>{if(+a.dataset.go===n){a.setAttribute('aria-current','page');try{a.scrollIntoView({block:'nearest',inline:'nearest'})}catch(_){}}else a.removeAttribute('aria-current')});
  if(!done[n]){done[n]=true;const art=lessons[n-1];
    renderMath(art);
    try{if(INIT[n])INIT[n]()}catch(e){console.error(e)}
    art.querySelectorAll('[data-quiz]').forEach(q=>{const f=QZ[q.dataset.quiz];if(f)quiz(q,f())});
  }
  if(scroll)window.scrollTo(0,0);
}
document.addEventListener('click',e=>{
  const a=e.target.closest('[data-go]');if(!a)return;
  e.preventDefault();const n=+a.dataset.go;
  try{history.replaceState(null,'','#lezione-'+n)}catch(_){}
  show(n,true);
});
(function(){const m=location.hash.match(/lezione-(\d+)/);show(m?clamp(+m[1],1,LAST):1,false)})();
renderMath(document.querySelector('footer'));
```

### B.3 Scheletri HTML

Barra superiore (`top.html`):

```html
<header class="top">
  <a class="name" href="#lezione-1" data-go="1">Nome del corso</a>
  <div class="right">
  <nav aria-label="Lezioni">
    <a href="#lezione-1" data-go="1">1 · Nome breve</a>
    <a href="#lezione-2" data-go="2">2 · Nome breve</a>
  </nav>
  <button class="tog" id="tog" type="button"></button>
  </div>
</header>
<main>
```

Una lezione (`lN.html`):

```html
<article class="lesson" data-n="2" id="lezione-2" data-title="Titolo in forma di domanda?" hidden>
<section class="hero"><div class="col">
  <p class="chap">Capitolo 2 · Fonte</p>
  <h1>Titolo in forma di domanda?</h1>
  <p class="desc">Una riga che dice di che cosa parla la lezione.</p>
</div></section>

<section><div class="col">
  <p>Due righe di aggancio alla lezione precedente.</p>
  <p>Il problema concreto da cui si parte.</p>
  <figure>
    <div class="w" id="apertura2"></div>
    <figcaption>Che cosa mostra la figura e che cosa notare.</figcaption>
  </figure>
  <div class="quiz inq" data-quiz="2a"></div>
</div></section>

<section><div class="col">
  <h2>Una sezione che si apre con una domanda</h2>
  <p class="stmt"><strong>Definizione.</strong> Testo con le formule \(\uu(x)\).</p>
  <div class="eq">\[ \uu(x) = \sum_i x_i \]</div>
  <details class="reveal"><summary>Perché vale</summary><div class="in">
    <p>La dimostrazione.</p>
  </div></details>
</div></section>

<section><div class="col">
  <h2>Mettiti alla prova</h2>
  <div class="quiz" data-quiz="2"></div>
</div></section>

<section><div class="col">
  <p>Se di questa lezione dovesse restarti una sola cosa: <strong>l'idea centrale.</strong></p>
  <p>Una riga sulla lezione successiva.</p>
  <nav class="navend" aria-label="Altre lezioni"></nav>
</div></section>
</article>
```

Il JavaScript della lezione (`lN.js`):

```js
INIT[2]=function(){
  /* figura statica a due riquadri: stesso disegno, due casi */
  (function(){
    const root=$('#apertura2'),duo=el('div','duo');
    root.append(legend([[BLUE,'curva'],[PINK,'punto scelto','dot']]),duo);
    [['Primo caso',1],['Secondo caso',2]].forEach(([titolo,k])=>{
      let s='<path d="M30 10V190H250" fill="none" stroke="#fff" stroke-width="1.5"/>';
      /* ... disegno calcolato dai dati del caso k ... */
      cell(duo,titolo,s,260,210,'Descrizione per lettori di schermo','<span class="ok">Verdetto.</span> Una frase.');
    });
  })();
};
QZ['2a']=()=>[
  {q:'Domanda subito dopo il concetto?',o:['Opzione','Opzione giusta','Opzione','Opzione'],a:1,
   e:'Perché è giusta, con il conto.',h:'Un indizio che non svela la risposta.'}
];
QZ['2']=()=>[ /* quattro-sei domande */ ];
```

### B.4 Schema del test automatico (`test.py`)

```python
# per ogni lezione N e per le larghezze 1150 e 400:
#   page.route("https://**/*", ...)  -> serve KaTeX dalla copia locale, blocca il resto
#   page.goto(file + "#lezione-N"); attendere 500 ms
#   cliccare ogni ".stage button"; portare ogni slider a min, max, metà; rispondere a ogni quiz
#   raccogliere: errori di pagina e console, numero di .katex-error, macro grezze nel testo,
#   NaN/undefined/Infinity nell'HTML, figure .w vuote, scrollWidth > clientWidth,
#   presenza di ul/ol/li, numero di figure, quiz, miniature, parole
#   aprire tutti i <details>, poi fare lo screenshot di ogni <figure>
# stampare una riga per lezione e larghezza; guardare gli screenshot uno per uno
```

---

## Lista di controllo finale

Prima di ogni consegna, per ogni lezione:

- titolo in forma di domanda, apertura concreta, aggancio alla lezione precedente, chiusura «Se di questa lezione...»;
- ogni termine spiegato prima dell'uso; ogni scelta motivata con il problema dell'alternativa;
- nessun elenco puntato; circa 150 parole per figura al massimo;
- ogni figura supera la prova di utilità, si capisce a colpo d'occhio, ha legenda e didascalia completa, non ha etichette sovrapposte, usa i colori della tabella;
- nessun «a sinistra / a destra» nelle didascalie di figure a più riquadri;
- quiz nel testo e quiz finale; risposte ricalcolate; posizione della risposta giusta variata;
- contenuti della fonte coperti tutti; aggiunte, dati presi altrove e refusi della fonte dichiarati;
- test automatici puliti a due larghezze; screenshot guardati;
- revisione indipendente fatta e correzioni applicate;
- stesso file e stesso link aggiornati, file riletto dopo la scrittura.
