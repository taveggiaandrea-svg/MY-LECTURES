/* Lezione 7: Structured Streaming, grafi, MLlib */
const GV={a:['Alice',34],b:['Bob',36],c:['Charlie',30],d:['David',29],e:['Esther',32],f:['Fanny',36],g:['Gabby',60]};
const GE=[['a','b','friend'],['b','c','follow'],['c','b','follow'],['f','c','follow'],['e','f','follow'],['e','d','friend'],['d','a','friend'],['a','e','friend']];
const GU={a:[60,72],b:[150,26],c:[240,72],d:[60,172],e:[150,172],f:[240,172],g:[312,30]};
/* an edge between two circles, shortened, with an offset for the pair b, c */
const gEdge=(P,s,d,r,st,mk)=>{let [x1,y1]=P[s],[x2,y2]=P[d];const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L;
  const both=GE.some(e=>e[0]===d&&e[1]===s),off=both?5:0,ox=-uy*off,oy=ux*off;
  return '<line x1="'+(x1+ux*r+ox)+'" y1="'+(y1+uy*r+oy)+'" x2="'+(x2-ux*(r+4)+ox)+'" y2="'+(y2-uy*(r+4)+oy)+'" '+st+(mk?' marker-end="url(#'+mk+')"':'')+'/>'};
const FRI='stroke="#fff" stroke-width="1.8"',FOL='stroke="#9a9a9a" stroke-width="1.6" stroke-dasharray="5 4"';
const gNode=(x,y,r,l,o)=>{o=o||{};return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+(o.f||'#1a1a1a')+'" stroke="'+(o.st||'#bbb')+'" stroke-width="1.5"/>'+tx(x,y+r*.36,l,{s:o.s||14,f:o.c||'#fff',w:600})};
INIT[7]=function(){
  codeHL($('#lezione-7'));
  /* streaming word count, animated */
  (function(){
    const root=$('#b7stream'),W=720,H=212;
    const box_=el('div');box_.style.cssText='width:100%;max-width:46rem';box_.className='wscroll';root.append(box_);const o=out();root.append(o);
    const L=[[1,'cat dog'],[1,'dog dog'],[2,'owl cat'],[3,'dog'],[3,'owl']];
    const R={1:{cat:1,dog:3},2:{cat:2,dog:3,owl:1},3:{cat:2,dog:4,owl:2}};
    const steps=[2.5,3,3,3,3,3,3.5];
    const msgs=['La query, contare le parole, si scrive una volta sola. Il flusso comincia.','<b>Tempo 1.</b> Arrivano due righe e vengono aggiunte alla tabella di input come righe nuove.','<b>Risultato al tempo 1:</b> cat 1, dog 3. Viene scritta l\'intera tabella dei risultati.',
      '<b>Tempo 2.</b> Una nuova riga di testo, «owl cat», diventa una nuova riga della tabella.','<b>Risultato al tempo 2:</b> cat passa a 2 e owl compare con 1; dog non cambia.','<b>Tempo 3.</b> Due righe nuove, «dog» e «owl».','<b>Risultato al tempo 3:</b> dog 4 e owl 2. Sono state elaborate solo le righe nuove.'];
    const ry=r=>84+r*28;
    function frame(t){const {i,u}=stepAt(steps,t),e=ease(u);let s='<defs>'+arrowDef('b7a1',GRAY)+'</defs>';
      const now=i===0?0:Math.ceil(i/2);
      s+=rect(14,70,136,104,'#0d0d0d','#666')+tx(82,90,'flusso di dati',{s:13.5,f:'#fff'})+tx(82,112,now?'tempo '+now:'in attesa',{s:13,f:GRAY});
      s+=line(152,122,180,122,GRAY,1.6,' marker-end="url(#b7a1)"');
      s+=tx(280,26,'Tabella di input (illimitata)',{s:14,f:'#fff',w:500})+tx(574,26,'Tabella dei risultati',{s:14,f:'#fff',w:500});
      s+=tx(196,62,'tempo',{s:13,f:GRAY,a:'start'})+tx(256,62,'riga',{s:13,f:GRAY,a:'start'})+line(190,68,370,68,'#555',1);
      s+=tx(484,62,'parola',{s:13,f:GRAY,a:'start'})+tx(664,62,'conteggio',{s:13,f:BLUE,a:'end'})+line(478,68,670,68,'#555',1);
      s+=line(380,122,468,122,GRAY,1.6,' marker-end="url(#b7a1)"')+tx(424,108,'query:',{s:12.5,f:GRAY})+tx(424,144,'conta parole',{s:12.5,f:GRAY});
      L.forEach(([tt,l],r)=>{if(tt>now)return;const arriving=i%2===1&&tt===now,x=arriving?lerp(30,196,e):196,a=arriving?e:1,c=tt===now?'#fff':'#8a8a8a';
        s+='<g opacity="'+a+'">'+tx(x,ry(r)+5,String(tt),{s:13.5,f:c,a:'start'})+tx(x+60,ry(r)+5,l,{s:13.5,f:c,a:'start'})+'</g>';if(!arriving)s+=line(190,ry(r)+14,370,ry(r)+14,'#222',1)});
      const shown=i===0?0:(i%2===0?now:now-1);
      if(shown){const cur=R[shown],prev=R[shown-1]||{},fresh=i%2===0;
        Object.keys(cur).sort().forEach((w,r)=>{const ch=fresh&&cur[w]!==prev[w];if(ch)s+=rect(478,ry(r)-14,192,26,'rgba(255,255,255,.12)');
          s+=tx(484,ry(r)+5,w,{s:13.5,f:'#fff',a:'start'})+tx(664,ry(r)+5,String(cur[w]),{s:13.5,f:BLUE,a:'end',w:ch?600:undefined})+line(478,ry(r)+14,670,ry(r)+14,'#222',1)})}
      box_.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Animazione del conteggio delle parole in streaming">'+s+'</svg>';o.innerHTML='Passo '+(i+1)+' di 7. '+msgs[i]}
    player(root,steps.reduce((a,b)=>a+b),frame);
  })();
  /* GraphX property graph */
  (function(){
    const N={3:[95,56,'rxin','student'],7:[325,56,'jgonzal','postdoc'],5:[210,180,'franklin','professor'],2:[210,292,'istoica','professor']};
    const E=[[3,7,'Collaborator'],[5,3,'Advisor'],[2,5,'Colleague'],[5,7,'PI']],hw=62,hh=24;
    const clip=(ax,ay,bx,by)=>{const dx=bx-ax,dy=by-ay,t=Math.min(hw/Math.abs(dx||1e-9),hh/Math.abs(dy||1e-9));return [ax+dx*t,ay+dy*t]};
    let s='<defs>'+arrowDef('b7g1','#ddd')+'</defs>';
    E.forEach(([a,b,l])=>{const [x1,y1]=clip(N[a][0],N[a][1],N[b][0],N[b][1]),[x2,y2]=clip(N[b][0],N[b][1],N[a][0],N[a][1]);
      s+=line(x1,y1,x2+(x1-x2)*.04,y2+(y1-y2)*.04,'#ddd',1.6,' marker-end="url(#b7g1)"');s+=lbl((x1+x2)/2,(y1+y2)/2+4,l,'#ccc',{s:13})});
    Object.keys(N).forEach(k=>{const [x,y,n,r]=N[k];s+=box(x-hw,y-hh,hw*2,hh*2,[k+' · '+n,r],{fs:13.5})});
    const tv=sTab(440,24,[{t:'Id',w:40},{t:'Proprietà (V)',w:170}],[['3','(rxin, student)'],['7','(jgonzal, postdoc)'],['5','(franklin, professor)'],['2','(istoica, professor)']]);
    const te=sTab(440,182,[{t:'SrcId',w:56},{t:'DstId',w:56},{t:'Proprietà (E)',w:110}],[['3','7','Collaborator'],['5','3','Advisor'],['2','5','Colleague'],['5','7','PI']]);
    s+=tv.s+te.s+tx(440,14,'Tabella dei vertici',{s:13,f:GRAY,a:'start'})+tx(440,172,'Tabella degli archi',{s:13,f:GRAY,a:'start'});
    svgBox($('#b7pg'),720,322,s,'Esempio di property graph in GraphX','46rem');
  })();
  /* the GraphFrames graph */
  (function(){
    const sc=2,ox=10,oy=24,P={};Object.keys(GU).forEach(k=>P[k]=[GU[k][0]*sc+ox,GU[k][1]*sc+oy]);
    let s='<defs>'+arrowDef('b7f1','#fff')+arrowDef('b7f2','#9a9a9a')+'</defs>';
    s+=line(200,14,240,14,'#fff',1.8)+tx(248,19,'friend',{s:13,f:'#fff',a:'start'})+'<line x1="330" y1="14" x2="370" y2="14" '+FOL+'/>'+tx(378,19,'follow',{s:13,f:'#ccc',a:'start'});
    GE.forEach(([a,b,t])=>s+=gEdge(P,a,b,24,t==='friend'?FRI:FOL,t==='friend'?'b7f1':'b7f2'));
    const lp={a:[-34,5,'end'],b:[0,-34,'middle'],c:[34,5,'start'],d:[-34,5,'end'],e:[0,44,'middle'],f:[34,5,'start'],g:[0,44,'middle']};
    Object.keys(P).forEach(k=>{const [x,y]=P[k],[dx,dy,an]=lp[k];s+=gNode(x,y,24,k,{s:16})+tx(x+dx,y+dy,GV[k][0]+', '+GV[k][1],{s:13.5,f:GRAY,a:an})});
    svgBox($('#b7gf'),720,414,s,'Grafo sociale del notebook su GraphFrames','46rem');
  })();
  /* query results, four panels */
  (function(){
    const duo=el('div','duo');$('#b7gq').append(duo);const P=GU,r=16;let n=0;
    const base=(fade)=>{n++;let s='<defs>'+arrowDef('b7q'+n+'a','#fff')+arrowDef('b7q'+n+'b','#9a9a9a')+arrowDef('b7q'+n+'c','#3a3a3a')+'</defs>';
      GE.forEach(e=>{const f=fade&&fade(e);s+=gEdge(P,e[0],e[1],r,f?'stroke="#3a3a3a" stroke-width="1.4"'+(e[2]==='follow'?' stroke-dasharray="5 4"':''):(e[2]==='friend'?FRI:FOL),f?'b7q'+n+'c':(e[2]==='friend'?'b7q'+n+'a':'b7q'+n+'b'))});return s};
    const deg={};Object.keys(GV).forEach(k=>deg[k]=[0,0]);GE.forEach(([a,b])=>{deg[a][1]++;deg[b][0]++});
    const rows=Object.keys(GV).filter(k=>deg[k][0]+deg[k][1]).map(k=>[GV[k][0]+' ('+k+')',String(deg[k][0]),String(deg[k][1]),String(deg[k][0]+deg[k][1])]);
    const t=sTab(20,8,[{t:'vertice',w:110},{t:'entrante',w:66,a:'e',c:BLUE},{t:'uscente',w:62,a:'e',c:BLUE},{t:'grado',w:54,a:'e',c:BLUE}],rows);
    cell(duo,'inDegrees, outDegrees, degrees',t.s,340,200,'Gradi','I gradi entranti sommano a 8, come quelli uscenti: uno per arco.');
    const OFF={a:[-24,5,'end'],b:[22,-10,'start'],c:[22,5,'start'],d:[-24,5,'end'],e:[0,36,'middle'],f:[22,5,'start'],g:[0,34,'middle']};
    const keep=['a','b','e'];let s=base(e=>!(e[2]==='friend'&&keep.includes(e[0])&&keep.includes(e[1])));
    Object.keys(P).forEach(k=>{const [x,y]=P[k],on=keep.includes(k);s+=gNode(x,y,r,k,{st:on?'#fff':'#444',c:on?'#fff':'#555',f:on?'#1a1a1a':'#0d0d0d'})+tx(x+OFF[k][0],y+OFF[k][1],String(GV[k][1]),{s:13,f:on?'#fff':'#555',a:OFF[k][2]})});
    cell(duo,'Sottografo: amici con più di 30 anni',s,340,214,'Sottografo','Restano Alice, Bob ed Esther, con due archi.');
    s=base()+'<rect x="30" y="6" width="234" height="196" rx="16" fill="none" stroke="#9a9a9a" stroke-dasharray="6 4"/>'+'<rect x="290" y="6" width="44" height="58" rx="14" fill="none" stroke="#9a9a9a" stroke-dasharray="6 4"/>';
    Object.keys(P).forEach(k=>s+=gNode(P[k][0],P[k][1],r,k));s+=tx(147,218,'componente 1',{s:13,f:GRAY})+tx(268,82,'componente 2',{s:12,f:GRAY,a:'start'});
    cell(duo,'Componenti connesse',s,340,228,'Componenti connesse','Due componenti: tutti gli altri, e Gabby da sola.');
    s='<polygon points="'+['a','d','e'].map(k=>P[k].join(',')).join(' ')+'" fill="rgba(255,255,255,.13)"/>'+base();
    const tri={a:1,d:1,e:1};Object.keys(P).forEach(k=>{const [x,y]=P[k];s+=gNode(x,y,r,k)+tx(x+OFF[k][0],y+OFF[k][1],String(tri[k]||0),{s:14,f:tri[k]?'#fff':'#666',w:600,a:OFF[k][2]})});
    cell(duo,'Conteggio dei triangoli',s,340,214,'Conteggio dei triangoli','Alice, David ed Esther stanno ciascuno su un triangolo.');
  })();
  /* ML pipeline */
  (function(){
    let s='<defs>'+arrowDef('b7p1',GRAY)+'</defs>';const cx=c=>10+c*118,W=100,H=56;
    const B=(c,y,l,k,o)=>box(cx(c),y,W,H,[l,k],Object.assign({fs:13.5},o||{}));
    const A=(c,y)=>line(cx(c)+W+2,y+H/2,cx(c+1)-3,y+H/2,GRAY,1.5,' marker-end="url(#b7p1)"');
    s+=tx(10,22,'pipeline.fit(training)',{s:14,f:'#fff',a:'start',w:500});
    const y1=34;s+=B(0,y1,'training','DataFrame',{f:'#141414',st:'#555'})+B(1,y1,'Tokenizer','transformer')+B(2,y1,'HashingTF','transformer')+rect(cx(3),y1,W,H,'#0d0d0d','#fff',' stroke-width="2"')+tx(cx(3)+W/2,y1+16,'Logistic',{s:13.5,f:'#fff'})+tx(cx(3)+W/2,y1+32,'Regression',{s:13.5,f:'#fff'})+tx(cx(3)+W/2,y1+48,'estimator',{s:12.5,f:GRAY})+B(4,y1,'modello','transformer');
    [0,1,2,3].forEach(c=>s+=A(c,y1));
    [['«sugar flour eggs»','etichetta 1'],['sugar, flour,','eggs'],['posizioni 864,','351, 289'],['impara un peso','per posizione'],['tokenizer, hashing','e pesi']].forEach(([a,b],c)=>{s+=tx(cx(c)+W/2,y1+H+20,a,{s:12.5,f:GRAY})+tx(cx(c)+W/2,y1+H+36,b,{s:12.5,f:GRAY})});
    const y2=206;s+=tx(10,194,'model.transform(test), poi valutazione',{s:14,f:'#fff',a:'start',w:500});
    s+=B(0,y2,'test','DataFrame',{f:'#141414',st:'#555'})+B(1,y2,'Tokenizer','transformer')+B(2,y2,'HashingTF','transformer')+B(3,y2,'modello LR','transformer')+B(4,y2,'previsioni','DataFrame',{f:'#141414',st:'#555'})+B(5,y2,'Evaluator','evaluator',{sw:2,st:'#fff'});
    [0,1,2,3,4].forEach(c=>s+=A(c,y2));
    s+=line(cx(4)+W/2,y1+H+44,cx(3)+W/2+6,y2-4,GRAY,1.3,' stroke-dasharray="5 4" marker-end="url(#b7p1)"');
    s+=tx(cx(3)+W/2,y2+H+20,'punteggio e',{s:12.5,f:GRAY})+tx(cx(3)+W/2,y2+H+36,'probabilità',{s:12.5,f:GRAY})+tx(cx(4)+W/2,y2+H+20,'aggiunge la colonna',{s:12.5,f:GRAY})+tx(cx(4)+W/2,y2+H+36,'prediction',{s:12.5,f:GRAY})+tx(cx(5)+W/2,y2+H+20,'accuratezza,',{s:12.5,f:GRAY})+tx(cx(5)+W/2,y2+H+36,'F1, AUC',{s:12.5,f:GRAY});
    svgBox($('#b7pipe'),720,306,s,'La pipeline di regressione logistica','46rem');
  })();
  /* predictions on the test set */
  (function(){
    const rows=[[4,'I like fried eggs','eggs +1,52',0.38,0.59,1,1],[5,'he day trip to the island was so exhausting','trip −1,52, exhausting +1,52',-1.14,0.24,0,0],
      [6,'I like the sea, the sun and I like swimming','nessuna',-1.14,0.24,0,0],[7,'eggs sea flour','eggs +1,52, sea −1,52, flour +2,28',1.14,0.76,1,1]];
    const X=[14,50,410,480,570,660],hd=['id','frase, e le parole con un peso','punteggio','P(etich. 1)','previsione','etichetta'];
    let s='';hd.forEach((h,j)=>s+=tx(X[j]+(j>1?50:0),20,h,{s:13,f:j===3?BLUE:GRAY,a:j>1?'end':'start'}));s+=line(10,28,710,28,'#555',1);
    rows.forEach((r,k)=>{const y=34+k*54;
      s+=tx(X[0],y+20,String(r[0]),{s:13.5,f:'#fff',a:'start'})+tx(X[1],y+20,'"'+r[1]+'"',{s:13.5,f:'#fff',a:'start'})+tx(X[1],y+40,r[2],{s:12.5,f:GRAY,a:'start'});
      s+=tx(X[2]+50,y+28,fi(r[3],2),{s:13.5,f:'#fff',a:'end'})+tx(X[3]+50,y+28,fi(r[4],2),{s:13.5,f:BLUE,a:'end'})+tx(X[4]+50,y+28,r[5]+' ✓',{s:13.5,f:GRN,a:'end'})+tx(X[5]+50,y+28,String(r[6]),{s:13.5,f:'#fff',a:'end'});
      s+=line(10,y+52,710,y+52,'#222',1)});
    svgBox($('#b7pred'),720,34+4*54+4,s,'Previsioni sul test set','46rem');
  })();
  wideFigs(7);
};
QZ['7a']=()=>[{q:'Dopo il tempo 3 della figura, al tempo 4 arriva la riga «owl owl cat». In modalità complete, quale tabella dei risultati viene scritta?',o:['cat 1, owl 2','cat 3, owl 4','cat 3, dog 4, owl 4','cat 3, dog 0, owl 4'],a:2,
  e:'La riga nuova aggiunge 2 a owl (2 + 2 = 4) e 1 a cat (2 + 1 = 3); dog resta a 4. La modalità complete scrive l\'intera tabella, comprese le righe che non cambiano.',h:'Parti dal risultato al tempo 3 e aggiungi solo le parole della riga nuova.'}];
QZ['7b']=()=>[{q:'Nel grafo di GraphFrames, quanto valgono il grado entrante di Bob (b) e il grado uscente di Esther (e)?',o:['1 e 2','2 e 2','2 e 1','3 e 2'],a:1,
  e:'Bob riceve archi da Alice (friend) e da Charlie (follow): grado entrante 2. Esther manda archi a Fanny (follow) e a David (friend): grado uscente 2.',h:'Conta le punte di freccia che arrivano su b, e le frecce che partono da e.'}];
QZ['7c']=()=>[{q:'Nella pipeline del corso, quale stadio è un estimator, e che cosa restituisce pipeline.fit(training)?',o:['Tokenizer; un DataFrame di parole','HashingTF; un vettore di 1000 numeri','LogisticRegression; un modello, che è un transformer','LogisticRegression; l\'accuratezza sul test set'],a:2,
  e:'LogisticRegression è l\'algoritmo di apprendimento, l\'estimator. Adattare la pipeline restituisce un modello, un transformer che aggiunge le previsioni a qualunque DataFrame; l\'accuratezza viene dopo, da un evaluator.',h:'Ricorda che cosa produce un estimator quando viene adattato ai dati.'}];
QZ['7d']=()=>[{q:'La frase di prova 6 non contiene nessuna parola con peso diverso da zero. Che cosa decide la sua previsione?',o:['Niente: Spark si rifiuta di prevedere','La sola intercetta: punteggio −1,14, probabilità 0,24, etichetta 0','La parola «sea», che spinge verso l\'etichetta 0','La parola più lunga della frase'],a:1,
  e:'Senza parole con un peso il punteggio è l\'intercetta, −1,14, e 1/(1 + e^1,14) ≈ 0,24, sotto 0,5. «sea,» con la virgola è una parola diversa da «sea», quindi non porta alcun peso.',h:'Guarda bene come il tokenizer divide «the sea, the sun».'}];
QZ['7']=()=>[
  {q:'Dopo il tempo 3 dell\'esempio in streaming (cat 2, dog 4, owl 2), al tempo 4 arriva la riga «cat cat». In modalità complete, quante righe ha la tabella dei risultati scritta, e quanto vale il conteggio di cat?',o:['1 riga, cat 2','3 righe, cat 4','3 righe, cat 2','4 righe, cat 4'],a:1,
   e:'La modalità complete scrive l\'intera tabella: sempre tre parole, quindi tre righe, e cat diventa 2 + 2 = 4.',h:'Parti dal risultato al tempo 3 e ricorda che cosa scrive la modalità complete.'},
  {q:'Nel notebook del corso, che cosa cambia fra la query statica sui file di eventi e quella in streaming?',o:['La query in streaming richiede un groupBy diverso','readStream sostituisce read, con un\'opzione per prendere un file per trigger; la query è la stessa','Le query in streaming non possono usare le finestre','La query in streaming va scritta in SQL'],a:1,
   e:'Structured Streaming permette di scrivere il calcolo come sui dati statici: sono nuovi solo readStream (con maxFilesPerTrigger 1 per riprodurre i file) e la destinazione di writeStream.',h:'Ricorda che cosa promette Structured Streaming sul modo di esprimere un calcolo.'},
  {q:'Nel notebook su GraphFrames, il sottografo si costruisce con filterVertices("age > 30"). Quali vertici restano se il filtro è invece "age > 28" (sempre solo archi friend, vertici isolati eliminati)?',o:['Alice, Bob, Esther','Alice, Bob, David, Esther','Alice, Bob, Charlie, David, Esther','Tutti e sette'],a:1,
   e:'Gli archi friend sono a→b, e→d, d→a, a→e. Con David (29) ora tenuto, sopravvivono tutti e quattro, e collegano Alice, Bob, David ed Esther. Charlie, Fanny e Gabby non hanno più archi friend, quindi vengono eliminati.',h:'Elenca prima gli archi friend, poi controlla le età dei loro estremi.'},
  {q:'Supponi che Gabby cominci a seguire Alice (un nuovo arco g→a di tipo follow). Quante componenti connesse ha il grafo, e quanti archi follow?',o:['2 componenti, 5 archi follow','1 componente, 4 archi follow','1 componente, 5 archi follow','2 componenti, 4 archi follow'],a:2,
   e:'Il nuovo arco collega Gabby al resto, quindi tutti stanno in una sola componente; gli archi follow passano da 4 a 5.',h:'Gabby era una componente a sé solo perché non aveva archi.'},
  {q:'Con i pesi appresi dalla pipeline del corso (intercetta −1,14, flour +2,28, sea −1,52), che cosa prevede il modello per la nuova frase «flour sea»?',o:['Probabilità circa 0,41, etichetta 0','Probabilità circa 0,59, etichetta 1','Probabilità circa 0,76, etichetta 1','Probabilità 0,5, nessuna previsione'],a:0,
   e:'Punteggio = −1,14 + 2,28 − 1,52 = −0,38, e 1/(1 + e^0,38) ≈ 0,41, sotto 0,5: etichetta 0.',h:'Somma l\'intercetta e i due pesi, poi chiediti se il punteggio è positivo o negativo.'},
  {q:'Nel secondo esempio del corso, VectorAssembler, LinearRegression e RegressionEvaluator sono, in quest\'ordine,',o:['estimator, transformer, evaluator','transformer, transformer, estimator','evaluator, estimator, transformer','transformer, estimator, evaluator'],a:3,
   e:'VectorAssembler trasforma un DataFrame in un altro aggiungendo la colonna features (transformer); LinearRegression adatta un modello (estimator); RegressionEvaluator calcola una metrica delle previsioni (evaluator).',h:'Chiediti di ciascuno: aggiunge una colonna, impara dai dati, o dà un punteggio alle previsioni?'}
];
/* mappa mentale del riepilogo */
MAPPA[7]={c:'Come gestisce Spark i dati che non smettono di arrivare?',r:[
  {t:'Structured Streaming',c:BLUE,v:['Un flusso è una tabella illimitata','La query si scrive una volta, come in batch','A ogni trigger si aggiorna la tabella dei risultati','readStream, window, writeStream']},
  {t:'Grafi',c:PINK,v:['Property graph: vertici e archi con proprietà','GraphX su RDD, GraphFrames su DataFrame','Gradi e sottografi','PageRank, componenti connesse, triangoli']},
  {t:'MLlib',c:GRN,v:['Regressione, classificazione, clustering, raccomandazione','Training set e test set','Preparare, addestrare, provare su dati nuovi']},
  {t:'Pipeline',c:YEL,v:['Transformer: aggiunge una colonna','Estimator: impara un modello','Evaluator: misura la qualità','Stessi passi per addestramento e prova']},
  {t:'Regressione logistica',c:TEAL,v:['Punteggio z = intercetta + somma dei pesi','Probabilità p = 1/(1 + e^(−z))','Sopra 0,5: etichetta 1']}]};
