/* Lezione 4: gli strumenti dei Big Data */
INIT[4]=function(){
  codeHL($('#lezione-4'));
  /* nodes, racks, clusters */
  (function(){
    const trio=el('div','trio');$('#b4clus').append(legend([['#e6e6e6','blocco da 0,25 TB','box'],['#9a9a9a','nodo attivo']]),trio);
    [1,4,16].forEach(n=>{let s='';const racks=2;
      for(let r=0;r<racks;r++){const rx=8+r*114;s+=rect(rx,8,106,212,'none','#444')+tx(rx+53,238,'rack '+(r+1),{s:13,f:GRAY});
        for(let k=0;k<8;k++){const id=r*8+k,on=id<n,y=14+k*25.5;s+=rect(rx+5,y,96,21,on?'#1c1c1c':'#0d0d0d',on?'#9a9a9a':'#262626');
          if(on){const mine=Math.ceil((40-id)/n)>0?[...Array(40).keys()].filter(b=>b%n===id).length:0;
            for(let b=0;b<Math.min(mine,mine>10?7:10);b++)s+=rect(rx+9+b*9,y+5,6,11,'#e6e6e6');if(mine>10)s+=tx(rx+98,y+15,'×'+mine,{s:12.5,a:'end',f:'#e6e6e6'})}}}
      const k=Math.ceil(40/n),h=k*0.5;
      cell(trio,n+(n>1?' nodi':' nodo'),s,236,246,n+(n>1?' nodi':' nodo'),k+' blocc'+(k>1?'hi':'o')+' sul nodo più carico: <b>'+(h>=1?fi(h,1)+(h===1?' ora':' ore'):Math.round(h*60)+' minuti')+'</b>.')});
  })();
  /* eventual consistency at three moments */
  (function(){
    const root=$('#b4base');root.append(legend([[GRN,'aggiornato','box'],[RED,'valore superato','box'],['#fff','messaggio di replica']]));
    let s='<defs>'+arrowDef('b4m','#fff')+'</defs>';
    const titles=['1. Scrittura sul nodo 1','2. Lettura sul nodo 3','3. Dopo la replica'],notes=['Il nodo 1 conferma subito:','Il nodo 3 dà il valore vecchio:','Tutte le repliche concordano:'],notes2=['basically available','soft state','eventual consistency'];
    [[['London','Liverpool','Liverpool'],[],'scrittura: city = London',''],[['London','Liverpool','Liverpool'],[[0,1],[0,2]],'','lettura → Liverpool'],[['London','London','London'],[],'','']].forEach(([v,msg,w,rd],ix)=>{
      const ox=ix*242,N=[[ox+58,74,'Nodo 1'],[ox+182,74,'Nodo 2'],[ox+120,170,'Nodo 3']];
      s+=tx(ox+120,18,titles[ix],{s:14.5,f:'#fff',w:500});
      [[0,1],[0,2],[1,2]].forEach(([a,b])=>s+=line(N[a][0],N[a][1],N[b][0],N[b][1],'#333',1.5));
      msg.forEach(([a,b])=>{const x1=N[a][0],y1=N[a][1],x2=N[b][0],y2=N[b][1];s+='<line x1="'+(x1+(x2-x1)*.42)+'" y1="'+(y1+(y2-y1)*.42)+'" x2="'+(x1+(x2-x1)*.62)+'" y2="'+(y1+(y2-y1)*.62)+'" stroke="#fff" stroke-width="2.5" marker-end="url(#b4m)"/>'});
      N.forEach(([x,y,l],j)=>{const ok=v[j]===v[0];s+=rect(x-52,y-23,104,46,'#0d0d0d',ok?GRN:RED,' stroke-width="2"')+tx(x,y-5,l,{s:13,f:GRAY})+tx(x,y+15,v[j],{s:14.5,f:ok?'#fff':RED})});
      if(w)s+=lbl(ox+8,42,w,'#fff',{s:13,a:'start'});if(rd)s+=lbl(ox+120,212,rd,RED,{s:13});
      s+=tx(ox+120,240,notes[ix],{s:13.5,f:GRAY})+tx(ox+120,258,notes2[ix],{s:13.5,f:'#fff',w:600});
    });
    svgBox(root,724,266,s,'Coerenza finale in tre momenti','46rem');
  })();
  /* one customer in four NoSQL models */
  (function(){
    const duo=el('div','duo');$('#b4models').append(duo);
    let t=sTab(4,4,[{t:'chiave',w:120,c:PKC},{t:'valore',w:120}],[[{v:'first_name',f:PKC},'Mary'],[{v:'last_name',f:PKC},'Smith'],[{v:'city',f:PKC},'Liverpool'],[{v:'street_address',f:PKC},'123, Main St.']],{rh:28});
    tabCell(duo,'Chiave-valore',t,'Solo coppie, trovate per chiave. Strumenti: DynamoDB, BerkeleyDB, Project Voldemort.',330,'',206);
    let s=['{','  <tspan style="fill:'+PKC+'">"_id"</tspan>: "xyz123456",','  "first_name": "John",','  "last_name": "Doe",','  "address": {','    "street": "105, Main Street",','    "city": "London",','    "Country": "UK"','  }','}'].map((l,i)=>mono(40,22+i*19,l.replace(/^ +/,m=>'&#160;'.repeat(m.length)),{s:13})).join('');
    cell(duo,'Documento',s,330,206,'Documento','Un documento JSON che descrive se stesso e può contenere annidamenti. Strumenti: MongoDB, CouchDB.');
    s='';let cy=12;[['cust:1001',['first_name = Mary','last_name = Smith','city = Liverpool']],['cust:1002',['first_name = John','city = London']],['cust:1003',['last_name = Doe','email = jd@mail.com']]].forEach(([k,cols])=>{
      s+=tx(8,cy+16,k,{s:13.5,a:'start',f:PKC});let x=80,yy=cy;cols.forEach(c=>{const w=c.length*6.3+12;if(x+w>328){x=80;yy+=25}s+=rect(x,yy,w,22,'#141414','#444')+tx(x+w/2,yy+16,c,{s:12.5,f:'#fff'});x+=w+5});cy=yy+34});
    cell(duo,'Orientato alle colonne',s,330,190,'Famiglia di colonne','Ogni chiave di riga ha il proprio insieme di coppie colonna = valore. Strumenti: HBase, Cassandra.');
    s='';const nd=[[80,96,'Person','Mary Smith','#bbb'],[256,46,'City','Liverpool','#888'],[256,150,'Street','123, Main St.','#888']];
    [[0,1,'LIVES_IN'],[0,2,'LIVES_AT']].forEach(([a,b,l])=>{s+=line(nd[a][0],nd[a][1],nd[b][0],nd[b][1],'#777',2)+lbl((nd[a][0]+nd[b][0])/2-18,(nd[a][1]+nd[b][1])/2+(b===1?-10:22),l,GRAY,{s:12.5})});
    nd.forEach(([x,y,t_,l,c])=>{s+='<ellipse cx="'+x+'" cy="'+y+'" rx="62" ry="28" fill="#111" stroke="'+c+'" stroke-width="2"/>'+tx(x,y-4,t_,{s:12.5,f:GRAY})+tx(x,y+14,l,{s:13.5,f:'#fff'})});
    cell(duo,'Grafo',s,330,190,'Grafo','I luoghi diventano nodi, collegati da relazioni con un nome. Strumento: Neo4j.');
  })();
  /* dictionary encoding, as in the slide */
  (function(){
    const col=[2009,2010,2012,2009,2011,2009,2009,2009,2010,2012,2011,2011],dict=[2009,2010,2011,2012];let s='';
    s+=tx(110,18,'Year',{s:14,f:GRAY})+tx(380,18,'codice',{s:14,f:GRAY})+tx(590,18,'dizionario',{s:14,f:GRAY});
    col.forEach((y,i)=>{const yy=28+i*28,c=dict.indexOf(y);s+=rect(60,yy,100,24,'#141414','#666')+tx(110,yy+17,y,{s:14,f:'#fff'})+line(166,yy+12,326,yy+12,'#444',1,' stroke-dasharray="4 4"')+rect(330,yy,100,24,'#141414','#666')+tx(380,yy+17,c.toString(2).padStart(2,'0'),{s:14,f:MSC})});
    dict.forEach((y,j)=>{const yy=28+j*28;s+=rect(510,yy,160,24,'#141414','#666')+tx(590,yy+17,j+' ('+j.toString(2).padStart(2,'0')+')  →  '+y,{s:14,f:'#fff'})});
    s+=tx(590,28+4*28+26,'4 valori distinti',{s:13.5,f:GRAY})+tx(590,28+4*28+46,'= 2 bit per codice',{s:13.5,f:MSC});
    svgBox($('#b4dict'),720,28+12*28+6,s,'Codifica a dizionario di una colonna Year','40rem');
  })();
  /* run-length encoding, unsorted and sorted */
  (function(){
    const duo=el('div','duo');$('#b4rle').append(duo);const r=lcg(21),vals=Array.from({length:24},()=>Math.floor(r()*4)),sorted=vals.slice().sort((a,b)=>a-b);
    const shade=['#f0f0f0','#b4b4b4','#7a7a7a','#4a4a4a'];
    const runs=a=>{const o=[];a.forEach((v,i)=>{const l=o[o.length-1];if(l&&l[0]===v)l[2]++;else o.push([v,i+1,1])});return o};
    [['Non ordinata',vals],['Ordinata',sorted]].forEach(([title,a])=>{let s='';
      a.forEach((v,i)=>{const x=20+(i%8)*37,y=10+Math.floor(i/8)*40;s+=rect(x,y,34,34,shade[v])+tx(x+17,y+23,v,{s:15,f:v<2?'#000':'#fff'})});
      const rr=runs(a);rr.forEach((t,k)=>{s+=mono(14+(k%3)*104,150+Math.floor(k/3)*20,'('+t.join(', ')+')',{s:12.5,f:'#ddd'})});
      cell(duo,title,s,330,150+6*20+6,title,'<b>'+rr.length+' terne</b> per 24 valori.')});
  })();
  /* property graph model */
  (function(){
    let s='<defs>'+arrowDef('b4pa','#ccc')+'</defs>';const E=[100,104],Co=[380,104],Ci=[640,104];
    s+=line(Co[0]-58,104,E[0]+60,104,'#ccc',2.5,' marker-end="url(#b4pa)"')+line(Co[0]+56,104,Ci[0]-62,104,'#ccc',2.5,' marker-end="url(#b4pa)"');
    s+=lbl(240,80,':HAS_CEO',FKC,{s:14,w:600})+tx(240,96,'start_date: 2008-01-20',{s:13,f:GRAY})+lbl(510,94,':LOCATED_IN',FKC,{s:14,w:600});
    [[E,'Employee'],[Co,'Company'],[Ci,'City']].forEach(([[x,y],l])=>{s+='<circle cx="'+x+'" cy="'+y+'" r="54" fill="#111" stroke="#bbb" stroke-width="2"/>'+tx(x,y+5,l,{s:15,f:'#fff'})});
    s+=tx(100,184,'name: Amy Peters',{s:13,f:GRAY})+tx(100,202,'date_of_birth: 1984-03-01',{s:13,f:GRAY})+tx(100,220,'employee_ID: 1',{s:13,f:GRAY});
    s+=tx(510,184,'le relazioni hanno una direzione',{s:13,f:GRAY});
    svgBox($('#b4pg'),720,228,s,'Property graph con un dipendente, un\'azienda e una città','44rem');
  })();
  /* traversal: films directed by Ava Reyes with their actors */
  (function(){
    const P=[['ava','Ava Reyes',110,90],['omar','Omar Diaz',110,290],['leo','Leo Marsh',610,60],['nina','Nina Park',620,170],['sara','Sara Kim',610,290]];
    const M=[['hl','Harbor Lights',360,70],['pm','Paper Moons',360,180],['qe','Quiet Engines',360,290]];
    const E=[['ava','hl','DIRECTED'],['ava','pm','DIRECTED'],['omar','qe','DIRECTED'],['leo','hl','ACTED_IN'],['nina','hl','ACTED_IN'],['nina','pm','ACTED_IN'],['sara','pm','ACTED_IN'],['leo','qe','ACTED_IN'],['sara','qe','ACTED_IN']];
    const all={};P.concat(M).forEach(n=>all[n[0]]=n);
    const hitE=E.filter(e=>(e[0]==='ava')||(e[2]==='ACTED_IN'&&(e[1]==='hl'||e[1]==='pm')));const hitN=new Set(hitE.flat());
    let s='';E.forEach(e=>{const a=all[e[0]],b=all[e[1]],on=hitE.includes(e);s+=line(a[2],a[3],b[2],b[3],on?PRC:'#333',on?3:1.5)});
    hitE.forEach(e=>{const a=all[e[0]],b=all[e[1]];s+=lbl((a[2]+b[2])/2,(a[3]+b[3])/2+4,e[2],PRC,{s:12.5})});
    P.concat(M).forEach(n=>{const on=hitN.has(n[0]),mv=n[0].length===2;s+='<ellipse cx="'+n[2]+'" cy="'+n[3]+'" rx="'+(mv?70:56)+'" ry="24" fill="#111" stroke="'+(on?PRC:'#444')+'" stroke-width="2"/>'+tx(n[2],n[3]+5,n[1],{s:14,f:on?'#fff':'#777'})});
    $('#b4trav').append(legend([[PRC,'pattern trovato dalla query'],['#444','resto del grafo']]));
    svgBox($('#b4trav'),720,320,s,'Grafo di persone e film con un attraversamento','44rem');
    $('#b4trav').append(el('div','cellnote','Risultato: Harbor Lights con Leo Marsh e Nina Park; Paper Moons con Nina Park e Sara Kim.'));
  })();
  /* vector database flow */
  (function(){
    const st=[['1. Contenuto','testo o immagine'],['2. Embedding','modello di ML'],['3. Record','id + vettore','+ metadati'],['4. Indice ANN','struttura','per la vicinanza'],['5. Ricerca','primi k','vicini']];let s='<defs>'+arrowDef('b4fa',GRAY)+'</defs>';
    st.forEach((x,i)=>{const cx=72+i*144;s+=rect(cx-62,20,124,78,'#0d0d0d',i===4?BLUE:'#666')+tx(cx,44,x[0],{s:14,f:'#fff',w:500});x.slice(1).forEach((l,j)=>s+=tx(cx,66+j*18,l,{s:13,f:GRAY}));
      if(i<4)s+=line(cx+64,59,cx+78,59,GRAY,2,' marker-end="url(#b4fa)"')});
    s+=tx(360,128,'richiesta «città italiane» → embedding → vettore → record più vicini, ordinati per similarità',{s:13.5,f:GRAY});
    svgBox($('#b4flow'),720,140,s,'Flusso di un database vettoriale','46rem');
  })();
  /* vectors: drag the query */
  (function(){
    const pts=[['Roma',.62,.38],['Milano',.7,.44],['Parigi',.52,.52],['Berlino',.4,.6],['Madrid',.78,.3],['pizza',-.32,.64],['pasta',-.22,.74],['risotto',-.45,.56],['sushi',-.62,.42],['cucciolo',-.6,-.42],['gattino',-.48,-.55],['cavallo',-.75,-.22],['pappagallo',-.3,-.68],['auto',.52,-.5],['camion',.68,-.64],['bicicletta',.32,-.42]];
    const root=$('#b4vec'),W=520,H=520,X=v=>W/2+v*230,Y=v=>H/2-v*230;let q=[.66,.2];
    root.append(legend([[ORG,'richiesta (trascinala)','dot'],[BLUE,'i tre più simili','dot'],['#777','altri vettori memorizzati','dot']]));
    const box=el('div');box.style.cssText='width:100%;max-width:30rem;touch-action:none;cursor:grab';root.append(box);const o=out();root.append(o);
    function draw(){const sc=pts.map(p=>({p,c:(p[1]*q[0]+p[2]*q[1])/(Math.hypot(p[1],p[2])*Math.hypot(q[0],q[1]))})).sort((a,b)=>b.c-a.c);const top=new Set(sc.slice(0,3).map(x=>x.p[0]));
      let s=line(20,H/2,W-20,H/2,'#333',1)+line(W/2,20,W/2,H-20,'#333',1)+tx(W-22,H/2+20,'dimensione 1',{s:13,f:GRAY,a:'end'})+tx(W/2+8,32,'dimensione 2',{s:13,f:GRAY,a:'start'});
      s+=line(W/2,H/2,X(q[0]),Y(q[1]),ORG,2);sc.slice(0,3).forEach(x=>s+=line(W/2,H/2,X(x.p[1]),Y(x.p[2]),BLUE,1.5,' stroke-dasharray="4 4"'));
      pts.forEach(p=>{const on=top.has(p[0]);s+='<circle cx="'+X(p[1])+'" cy="'+Y(p[2])+'" r="'+(on?7:5)+'" fill="'+(on?BLUE:'#777')+'"/>'+(p[0]==='Roma'?lbl(X(p[1])-10,Y(p[2])+14,p[0],on?'#fff':'#999',{a:'end',s:14}):lbl(X(p[1])+10,Y(p[2])+5,p[0],on?'#fff':'#999',{a:'start',s:14}))});
      s+='<circle cx="'+X(q[0])+'" cy="'+Y(q[1])+'" r="12" fill="'+ORG+'"/>'+lbl(X(q[0])+16,Y(q[1])+24,'richiesta',ORG,{a:'start',s:14});
      box.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Spazio vettoriale a due dimensioni con una richiesta trascinabile">'+s+'</svg>';
      o.innerHTML='I più vicini per similarità del coseno: '+sc.slice(0,3).map(x=>'<b>'+x.p[0]+'</b> <span style="color:var(--blue)">'+x.c.toFixed(3).replace('.',',').replace('-','−')+'</span>').join('; ')+'.'}
    drag(box,e=>{const sv=box.querySelector('svg'),[x,y]=svgPoint(sv,e,W,H);let a=clamp(Math.round((x-W/2)/230*100)/100,-1,1),b=clamp(Math.round((H/2-y)/230*100)/100,-1,1);if(Math.hypot(a,b)<.06)a=.06;q=[a,b];draw()});
    draw();
  })();
};
QZ['4a']=()=>[{q:'Un sistema BASE ha appena accettato un nuovo indirizzo sul nodo 1. Una lettura sul nodo 3 un attimo dopo restituisce l\'indirizzo vecchio. Il sistema è guasto?',
  o:['Sì: ha violato la disponibilità di base.','No: è la coerenza finale all\'opera, e il nodo 3 si allineerà.','Sì: ogni sistema NoSQL garantisce transazioni ACID.','No, perché il nodo 3 avrebbe dovuto rifiutarsi di rispondere.'],a:1,
  e:'Con la coerenza finale un nodo può avere il valore vecchio subito dopo una scrittura; risponde comunque e si allinea quando la replica è completa.',h:'Ricorda le tre parole di BASE e il secondo riquadro della figura.'}];
QZ['4b']=()=>[{q:'Una colonna Year contiene gli anni dal 2009 al 2013. Quanti bit servono a ogni codice del dizionario?',o:['2','5','13','3'],a:3,
  e:'Cinque valori distinti: 2 bit danno solo 4 codici, 3 bit ne danno 8, quindi l\'arrotondamento per eccesso di log₂ 5 è 3.',h:'Quanti codici diversi si possono scrivere con 2 bit, e bastano?'}];
QZ['4c']=()=>[{q:'In uno schema relazionale con le tabelle Person, Movie, Directed (person_id, movie_id) e ActedIn (person_id, movie_id), quanti JOIN servono alla query «film diretti da Ava Reyes, con i loro attori»?',o:['1','2','4','6'],a:2,
  e:'Person (regista) → Directed → Movie → ActedIn → Person (attore): cinque riferimenti a tabelle, quattro join. Un database a grafo segue direttamente i due tipi di archi.',h:'Scrivi la catena di tabelle dal regista agli attori.'}];
QZ['4']=()=>[
  {q:'Una colonna Country ha 1.000.000 di righe e 200 valori distinti. Con la codifica a dizionario, quanti bit servono a ogni codice, e quanto spazio occupano all\'incirca i codici?',o:['200 bit; circa 25 MB','7 bit; circa 0,9 MB','8 bit; circa 1 MB','8 bit; circa 8 MB'],a:2,
   e:'7 bit danno solo 128 codici, quindi 200 valori richiedono ⌈log₂ 200⌉ = 8 bit, un byte: 1.000.000 di codici occupano circa 1.000.000 di byte, 1 MB, più un piccolo dizionario.',h:'Trova la più piccola potenza di 2 che arriva a 200, poi converti i bit in byte.'},
  {q:'Un bonifico preleva 100 da A, poi il server si guasta prima del versamento su B. Quale proprietà ACID garantisce che il prelievo venga annullato?',o:['Atomicità','Durabilità','Isolamento','Coerenza'],a:0,
   e:'L\'atomicità è la proprietà del tutto o niente: o avvengono sia il prelievo sia il versamento, o non avviene nessuno dei due.',h:'Rileggi i quattro significati in una riga e abbina ciascuno a ciò che è andato storto qui.'},
  {q:'In quale famiglia NoSQL ogni record porta con sé i nomi dei propri campi, può contenere record annidati e non deve avere la stessa struttura degli altri?',o:['Chiave-valore','Orientata ai grafi','Orientata alle colonne','Orientata ai documenti'],a:3,
   e:'Record che descrivono se stessi, annidabili e senza vincoli di schema sono documenti in JSON o XML, come in MongoDB e CouchDB.',h:'Confronta i quattro riquadri della figura sui modelli.'},
  {q:'Una colonna di 1200 righe contiene i codici 0, 1, 2 e 3, 300 volte ciascuno. Ordinata, quante terne run-length le servono?',o:['1200','300','2','4'],a:3,
   e:'Ordinata, la colonna è 300 zeri, poi 300 uno, 300 due e 300 tre: quattro sequenze, quattro terne.',h:'Immagina la colonna ordinata: dove comincia una sequenza nuova?'},
  {q:'Prendi a = (3, 4), b = (6, 8) e c = (4, −3). Quale affermazione è vera?',o:['b è più vicino ad a di c sia per coseno sia per distanza, con coseno 0,5','a e c hanno similarità del coseno 1','a e b hanno coseno 1 e distanza euclidea 5; a e c hanno coseno 0','Tutti e tre hanno la stessa similarità del coseno'],a:2,
   e:'b = 2a punta nella stessa direzione: coseno 1, distanza √(3² + 4²) = 5. a · c = 12 − 12 = 0, quindi a e c sono perpendicolari: coseno 0.',h:'Controlla se b è un multiplo di a, e calcola il prodotto scalare di a e c.'},
  {q:'Quale abbinamento fra dati e modello di coerenza è in linea con la discussione della lezione?',o:['Saldi bancari: BASE; like sui social: ACID','Saldi bancari: ACID; un contatore di like su un social network: BASE','Entrambi richiedono BASE','Entrambi richiedono ACID, altrimenti i dati vanno persi'],a:1,
   e:'Un bonifico deve essere tutto o niente e sempre coerente (ACID); un contatore di like può essere per un attimo non aggiornato su alcuni nodi e diventare coerente dopo (BASE), in cambio di disponibilità e scala.',h:'Chiediti dove un valore temporaneamente sbagliato sarebbe accettabile.'}
];
