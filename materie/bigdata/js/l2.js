/* Lezione 2: che cos'è esattamente una tabella */
INIT[2]=function(){
  codeHL($('#lezione-2'));
  /* four inserts into Sales */
  (function(){
    const root=$('#b2ins'),m=el('div','duo');root.append(legend([[GRN,'riga accettata','box'],[RED,'riga rifiutata','box'],['#fff','cella che viola una regola','dash']]),m);
    const C=[{t:'id',w:30,a:'e',c:PKC},{t:'data',w:56},{t:'cliente',w:52,a:'e',c:FKC},{t:'prod',w:44},{t:'qtà',w:40,a:'e'}];
    [['Un sales_id che esiste già',[3,'09-04',2,'abc',4],0,false,'sales_id 3 c\'è già: la <span style="color:var(--yellow)">chiave primaria</span> rifiuta un duplicato.'],
     ['Un cliente che non esiste',[7,'09-04',9,'abc',3],2,false,'Il cliente 9 non c\'è: la <span style="color:var(--pink)">chiave esterna</span> lo rifiuta.'],
     ['Una quantità pari a zero',[7,'09-04',2,'abc',0],4,false,'<span style="color:var(--orange)">quantity &gt; 0</span> è falso: il vincolo CHECK la rifiuta.'],
     ['Un cliente sconosciuto',[7,'09-04',null,'abc',3],-1,true,'customer_id è NULL, e una chiave esterna lo permette.']].forEach(([title,row,bad,ok,note])=>{
      const t=sTab(4,4,C,[[6,'09-03',2,'xyz',3].map(v=>({v,f:GRAY})),row],{bg:i=>i===1?(ok?OKBG:BADBG):null});
      const ex=bad>=0?rect(colX(4,C,bad)+1,4+26+25+1,C[bad].w-2,23,'none','#fff',' stroke-width="2"'):'';
      tabCell(m,title,t,verdict(ok,note),300,ex)});
  })();
  /* CHAR versus VARCHAR, and DECIMAL(5,2) */
  (function(){
    const duo=el('div','duo');$('#b2types').append(duo);
    const q=v=>"'"+v+"'";
    const rows=[['',4],['ab',4],['abcd',4],['abcdefgh',4]].map(([v])=>{const c=v.slice(0,4);return [q(v),q(c.padEnd(4,'·')),4,q(c),c.length+1]});
    const t=sTab(4,4,[{t:'valore',w:84},{t:'CHAR(4)',w:72},{t:'byte',w:46,a:'e'},{t:'VARCHAR(4)',w:86},{t:'byte',w:46,a:'e'}],rows.map(r=>[r[0],r[1],{v:r[2],f:MSC},r[3],{v:r[4],f:MSC}]),{rh:28});
    cell(duo,'Byte occupati dal testo',t.s,t.w+8,t.h+8,'Memorizzazione di CHAR e VARCHAR','CHAR occupa sempre 4 byte; VARCHAR occupa la lunghezza più 1.');
    let s='';const bw=26;
    [[12.5,'12.50'],[999.99,'999.99'],[1000.5,'1000.50']].forEach(([n,str],i)=>{const y=26+i*58,[ip,dp]=str.split('.'),ok=ip.length<=3;
      s+=tx(52,y+19,fe(n),{s:15,f:'#fff',a:'end'});
      const digits=ip.padStart(3,' ').split('');const x0=112-(ip.length>3?(ip.length-3)*bw:0);
      digits.forEach((d,k)=>{const x=x0+k*bw,extra=ip.length>3&&k<ip.length-3;s+=rect(x,y,bw-3,28,'#0d0d0d',extra?RED:'#666')+tx(x+(bw-3)/2,y+20,d===' '?'0':d,{s:15,f:extra?RED:(d===' '?'#444':'#fff')})});
      const xp=x0+digits.length*bw;s+=tx(xp+4,y+22,'.',{s:16,f:'#fff'});
      dp.split('').forEach((d,k)=>{const x=xp+12+k*bw;s+=rect(x,y,bw-3,28,'#0d0d0d','#666')+tx(x+(bw-3)/2,y+20,d,{s:15,f:'#fff'})});
      s+=tx(272,y+19,ok?'ci sta':'non ci sta',{s:14,f:ok?GRN:RED,a:'start'})});
    cell(duo,'Numeri in DECIMAL(5,2)',s,370,196,'Caselle di DECIMAL(5,2)','Posto per 3 cifre prima del punto decimale: il valore massimo è 999.99.');
  })();
  /* full scan versus index */
  (function(){
    const duo=el('div','duo'),root=$('#b2idx');root.append(legend([['#8a8a8a','righe lette','box'],[GRN,'riga trovata','box']]),duo);
    const n=64,target=37,r=lcg(5),perm=[...Array(n).keys()].map(i=>i+1);for(let i=n-1;i>0;i--){const j=Math.floor(r()*(i+1));[perm[i],perm[j]]=[perm[j],perm[i]]}
    const pos=perm.indexOf(target);let lo=0,hi=n-1;const probes=[];while(lo<=hi){const mid=(lo+hi)>>1;probes.push(mid);if(mid+1===target)break;if(mid+1<target)lo=mid+1;else hi=mid-1}
    const grid=(lab,fill)=>{let s='';for(let i=0;i<n;i++){const x=6+(i%8)*36,y=6+Math.floor(i/8)*36,f=fill(i);s+=rect(x,y,33,33,f||'#1a1a1a')+tx(x+16.5,y+22,lab(i),{s:13,f:f===GRN||f==='#8a8a8a'?'#000':'#ccc'})}return s};
    cell(duo,'Scansione di tutta la tabella',grid(i=>perm[i],i=>i<pos?'#8a8a8a':i===pos?GRN:null),300,300,'Griglia della scansione completa','Legge <b>'+(pos+1)+'</b> righe su 64; nel caso peggiore tutte e 64.');
    cell(duo,'Ricerca attraverso l\'indice',grid(i=>i+1,i=>{const k=probes.indexOf(i);return k<0?null:k===probes.length-1?GRN:'#8a8a8a'}),300,300,'Griglia della ricerca con indice','Legge <b>'+probes.length+'</b> righe; mai più di 7 su 64 righe.');
  })();
  /* update anomaly versus third normal form */
  (function(){
    const duo=el('div','duo');$('#b2anom').append(duo);const NEW='123-000000',OLD='123-456789';
    let s=mono(8,18,'UPDATE Employee')+mono(8,36,"SET dep_phone = '"+NEW+"'")+mono(8,54,'WHERE <tspan style="fill:'+PRC+'">employee_id = 1</tspan>;');
    const C1=[{t:'emp_id',w:52,a:'e',c:PKC},{t:'name',w:52},{t:'dep_code',w:66},{t:'dep_name',w:70},{t:'dep_phone',w:96}];
    const t1=sTab(4,70,C1,[[1,'Mary','FIN','Finance',{v:NEW,f:'#fff',bg:BADBG}],[2,'John','FIN','Finance',{v:OLD,bg:BADBG}],[3,'Lucy','FIN','Finance',{v:OLD,bg:BADBG}]]);
    s+=t1.s;cell(duo,'Una sola tabella Employee',s,344,70+t1.h+8,'Tabella denormalizzata dopo l\'aggiornamento','<span class="bad">Ora Finance ha 2 numeri di telefono.</span> Due righe non sono mai state aggiornate.');
    s=mono(8,18,'UPDATE Department')+mono(8,36,"SET dep_phone = '"+NEW+"'")+mono(8,54,'WHERE <tspan style="fill:'+PRC+'">dep_id = 1</tspan>;');
    const t2=sTab(4,70,[{t:'dep_id',w:52,a:'e',c:PKC},{t:'dep_code',w:68},{t:'dep_name',w:72},{t:'dep_phone',w:96}],[[1,'FIN','Finance',{v:NEW,bg:OKBG}]]);
    const t3=sTab(4,70+t2.h+16,[{t:'emp_id',w:52,a:'e',c:PKC},{t:'first',w:52},{t:'last',w:58},{t:'dep_id',w:52,a:'e',c:FKC}],[[1,'Mary','Johns',{v:1,f:FKC}],[2,'John','White',{v:1,f:FKC}],[3,'Lucy','Smith',{v:1,f:FKC}]]);
    s+=t2.s+t3.s;cell(duo,'Department + Employee (terza forma normale)',s,344,70+t2.h+16+t3.h+8,'Tabelle normalizzate dopo l\'aggiornamento','<span class="ok">Finance ha 1 numero di telefono,</span> memorizzato in una sola riga.');
  })();
  /* OLTP schema versus warehouse schema */
  (function(){
    const duo=el('div','duo'),root=$('#b2shape');root.append(legend([[PRC,'tabelle e join che servono alla domanda'],['#555','altre tabelle e collegamenti']]),duo);
    const draw=(nodes,edges,path,bw)=>{let s='';const P=new Set(path.flat());
      edges.forEach(([a,b])=>{const on=path.some(([u,v])=>(u===a&&v===b)||(u===b&&v===a));s+=line(nodes[a][0],nodes[a][1],nodes[b][0],nodes[b][1],on?PRC:'#555',on?3:1.5)});
      Object.entries(nodes).forEach(([k,[x,y]])=>{const on=P.has(k);s+=rect(x-bw/2,y-14,bw,28,'#0b0b0b',on?PRC:'#555',on?' stroke-width="2"':'')+tx(x,y+5,k,{s:14,f:on?'#fff':'#999'})});return s};
    const N1={Continents:[62,22],Countries:[62,74],Cities:[62,126],Addresses:[62,178],Shops:[62,238],Customers:[180,178],sales_header:[180,238],Colors:[180,126],Categories:[298,22],Subcategory:[298,74],Product:[298,126],sales_details:[298,178]};
    const E1=[['Continents','Countries'],['Countries','Cities'],['Cities','Addresses'],['Addresses','Customers'],['Addresses','Shops'],['Customers','sales_header'],['Shops','sales_header'],['sales_header','sales_details'],['sales_details','Product'],['Product','Colors'],['Product','Subcategory'],['Subcategory','Categories']];
    const P1=[['sales_details','sales_header'],['sales_header','Customers'],['Customers','Addresses'],['Addresses','Cities'],['Cities','Countries'],['Countries','Continents'],['sales_details','Product'],['Product','Subcategory'],['Subcategory','Categories']];
    cell(duo,'OLTP: 12 tabelle normalizzate',draw(N1,E1,P1,108),360,256,'Schema OLTP','<b>10 tabelle, 9 join.</b> Continente e categoria stanno alle estremità di due catene.');
    const N2={'Fact Sales':[180,128],'Dim Customers':[70,40],'Dim Product':[290,40],'Dim Shops':[70,216],'Dim Date':[290,216],'Dim Time':[180,40]};
    const E2=[['Fact Sales','Dim Customers'],['Fact Sales','Dim Product'],['Fact Sales','Dim Shops'],['Fact Sales','Dim Date'],['Fact Sales','Dim Time']];
    cell(duo,'Data warehouse: fatti e dimensioni',draw(N2,E2,[['Fact Sales','Dim Customers'],['Fact Sales','Dim Product']],104),360,256,'Schema del warehouse','<b>3 tabelle, 2 join.</b> Il continente è una colonna di Dim Customers, la categoria una colonna di Dim Product.');
  })();
  /* one fact row read through its surrogate keys */
  (function(){
    const order=[5,2,4,1,3],dc=order.map((cid,i)=>{const c=CUST.find(x=>x[0]===cid);return [i+1,cid,capw(c[1])+' '+capw(c[2]),capw(c[3])]});
    const dd=[[1,'2018-09-01','sabato'],[2,'2018-09-02','domenica'],[3,'2018-09-03','lunedì']],dp=[[1,'abc'],[2,'xyz']];
    const fact=SAL.map(r=>[dd.find(d=>d[1]===r[1])[0],dc.find(c=>c[1]===r[2])[0],dp.find(p=>p[1]===r[3])[0],r[4],r[4]*r[5]]);const sel=2,f=fact[sel];
    const K=v=>({v,f:PKC});let s='';
    const Cc=[{t:'cust_key',w:66,a:'e',c:PKC},{t:'chiave di business',w:124,a:'e'},{t:'nome',w:96},{t:'città',w:68}];
    const tc=sTab(6,26,Cc,dc.map(r=>[K(r[0]),r[1],r[2],r[3]]),{bg:i=>dc[i][0]===f[1]?HLBG:null});
    const Cp=[{t:'prod_key',w:68,a:'e',c:PKC},{t:'chiave di business',w:124}],xp=372;
    const tp=sTab(xp,26,Cp,dp.map(r=>[K(r[0]),r[1]]),{bg:i=>dp[i][0]===f[2]?HLBG:null});
    const Cd=[{t:'date_key',w:66,a:'e',c:PKC},{t:'data',w:88},{t:'giorno',w:76}],xd=xp,yd=26+tp.h+46;
    const td=sTab(xd,yd,Cd,dd.map(r=>[K(r[0]),r[1],r[2]]),{bg:i=>dd[i][0]===f[0]?HLBG:null});
    s+=tc.s+tp.s+td.s+tx(6+173,16,'Dimensione cliente',{s:14,f:GRAY})+tx(xp+90,16,'Dimensione prodotto',{s:14,f:GRAY})+tx(xd+115,yd-8,'Dimensione data',{s:14,f:GRAY});
    const Cf=[{t:'date_key',w:70,a:'e',c:FKC},{t:'cust_key',w:70,a:'e',c:FKC},{t:'prod_key',w:70,a:'e',c:FKC},{t:'quantità',w:70,a:'e',c:MSC},{t:'importo',w:70,a:'e',c:MSC}];
    const yf=288,xf=150,FK=v=>({v,f:FKC});
    const tf=sTab(xf,yf,Cf,fact.map(r=>[FK(r[0]),FK(r[1]),FK(r[2]),{v:r[3],f:MSC},{v:fe(r[4]),f:MSC}]),{bg:i=>i===sel?HLBG:null});
    s+=tf.s+tx(xf+175,yf-10,'Tabella dei fatti delle vendite',{s:14,f:GRAY});
    svgBox($('#b2star'),720,yf+tf.h+12,s,'Una riga dei fatti collegata alle sue righe di dimensione','46rem');
    $('#b2star').append(el('div','cellnote','La vendita evidenziata si legge così: domenica 2 settembre 2018 Mark Smith di Liverpool ha comprato 10 unità di xyz per 15. La sua chiave surrogata è 5, la sua chiave di business 3.'));
  })();
  /* UPDATE and DELETE, with and without WHERE */
  (function(){
    const m=el('div','duo');$('#b2dml').append(m);const C=[{t:'id',w:30,a:'e',c:PKC},{t:'first',w:48},{t:'last',w:48},{t:'city',w:76}];
    const st=[[10,'mark','smith','liverpool'],[20,'mary','jane','london']];
    [['Partenza',['due righe inserite','dallo script',''],st,[]],
     ['DELETE',['DELETE FROM Customers','WHERE <tspan style="fill:'+PRC+'">customer_id = 10</tspan>;',''],[st[1]],[]],
     ['UPDATE',['UPDATE Customers',"SET city = 'Milan'",'WHERE <tspan style="fill:'+PRC+'">customer_id = 20</tspan>;'],[[20,'mary','jane','Milan']],[0]],
     ['UPDATE senza WHERE',['UPDATE Customers',"SET city = 'Milan';",''],[[10,'mark','smith','Milan'],[20,'mary','jane','Milan']],[0,1]]].forEach(([title,sql,rows,ch])=>{
      let s=sql.map((l,i)=>mono(4,16+i*18,l,{s:12.5,f:title==='Partenza'?GRAY:'#ddd'})).join('');
      const t=sTab(2,62,C,rows,{bg:i=>ch.includes(i)?(title.includes('senza')?BADBG:HLBG):null});
      cell(m,title,'<g transform="translate(43,0)">'+s+t.s+'</g>',300,62+26+2*25+6,title,title==='Partenza'?'Entrambi i clienti.':title==='DELETE'?'1 riga cancellata.':title==='UPDATE'?'1 riga aggiornata.':'<span class="bad">2 righe aggiornate:</span> tutte.')});
  })();
  /* CASE branches */
  (function(){
    const br=c=>c==='milan'?0:(c==='liverpool'||c==='london')?1:2,lab=['Italy','UK','N/A'],bgc=['rgba(255,255,255,.16)','rgba(255,255,255,.08)',null];
    const t=sTab(4,4,[{t:'customer_id',w:90,a:'e',c:PKC},{t:'last_name',w:84},{t:'city',w:84},{t:'Country',w:76},{t:'ramo',w:150,c:PRC}],CUST.map(c=>[c[0],c[2],c[3],{v:lab[br(c[3])],b:1},{v:['WHEN city = \'milan\'','WHEN city IN (...)','ELSE'][br(c[3])],f:PRC}]),{bg:i=>bgc[br(CUST[i][3])]});
    svgBox($('#b2case'),t.w+8,t.h+8,t.s,'Risultato della query con CASE','34rem');
  })();
  /* a SELECT step by step */
  (function(){
    let s='';const rows=SAL.map(r=>({id:r[0],d:r[1],p:r[3],q:r[4],pr:r[5],a:r[4]*r[5]})),keep=r=>r.p==='xyz';
    const C1=[{t:'id',w:28,a:'e'},{t:'product',w:62},{t:'qty',w:38,a:'e'},{t:'price',w:48,a:'e'}];
    const t1=sTab(2,44,C1,rows.map(r=>[r.id,r.p,r.q,r.pr.toFixed(2)]),{op:i=>keep(rows[i])?1:.3,bg:i=>keep(rows[i])?HLBG:null});
    const kept=rows.filter(keep),C2=[{t:'sales_date',w:84},{t:'product',w:60},{t:'qty',w:36,a:'e'},{t:'amount',w:58,a:'e',c:MSC}];
    const x2=206,t2=sTab(x2,44,C2,kept.map(r=>[r.d,r.p,r.q,{v:fe(r.a),f:MSC}]));
    const sorted=kept.slice().sort((a,b)=>b.q-a.q),x3=x2+238+28;
    const t3=sTab(x3,44,C2,sorted.map(r=>[r.d,r.p,r.q,{v:fe(r.a),f:MSC}]));
    s+=t1.s+t2.s+t3.s+tx(2+88,16,'1. FROM e WHERE',{s:14,f:'#fff',w:500})+tx(2+88,34,'3 righe su 6 tenute',{s:13,f:GRAY})+tx(x2+119,16,'2. Select list',{s:14,f:'#fff',w:500})+tx(x2+119,34,'4 colonne, amount calcolato',{s:13,f:GRAY})+
      tx(x3+119,16,'3. ORDER BY',{s:14,f:'#fff',w:500})+tx(x3+119,34,'quantity, dalla più grande',{s:13,f:GRAY});
    s+=tx(x2-14,130,'→',{s:20,f:GRAY})+tx(x3-14,130,'→',{s:20,f:GRAY});
    svgBox($('#b2sel'),720,44+t1.h+8,s,'Una query SELECT passo per passo','46rem');
  })();
};
QZ['2a']=()=>[{q:'Quale tipo di integrità protegge il vincolo <code>CHECK (quantity &gt; 0)</code>?',o:['L\'integrità dell\'entità','L\'integrità referenziale','L\'integrità del dominio','Nessuna: CHECK è solo un commento'],a:2,
  e:'CHECK, insieme ai tipi di dato e ai vincoli NULL, tiene tutti i valori di una colonna dentro lo stesso dominio.',h:'Ricorda i tre tipi di integrità e quale strumento protegge ciascuno.'}];
QZ['2b']=()=>[{q:'Quale regola viola la tabella Employee(employee_id, first_name, last_name, dep_code, dep_name, dep_phone)?',
  o:['La prima forma normale, perché alcuni valori non sono atomici','L\'integrità dell\'entità, perché i duplicati sono permessi','La terza forma normale, per via di una dipendenza transitiva','L\'integrità del dominio, perché i telefoni sono testo'],a:2,
  e:'Il nome e il telefono del reparto dipendono dal codice del reparto, una colonna non chiave, quindi la tabella ha una dipendenza transitiva e viola la terza forma normale.',h:'Chiediti, colonna per colonna, da che cosa dipende ogni valore.'}];
QZ['2c']=()=>[{q:'Sulle sei vendite del corso, quante righe restituisce <code>WHERE product_name = \'abc\' OR product_name = \'xyz\' AND quantity &gt; 5</code>?',o:['1','3','6','4'],a:3,
  e:'AND ha la precedenza su OR, quindi la condizione si legge product = \'abc\' OR (product = \'xyz\' AND quantity &gt; 5). Passano le tre vendite di abc, più la vendita 3 (xyz, 10): quattro righe.',h:'Valuta AND prima di OR, poi conta le righe che soddisfano almeno uno dei due lati.'}];
QZ['2d']=()=>[{q:'Con la query CASE qui sopra sui cinque clienti del corso, quante righe ottengono Country = \'UK\'?',o:['2','1','3','5'],a:2,
  e:'doe e jane abitano a london, smith a liverpool: tre righe soddisfano city IN (\'liverpool\', \'london\'). Rossi ottiene Italy, Bianchi (rome) ottiene N/A.',h:'Scorri le cinque città e guarda quale WHEN viene soddisfatto per primo da ciascuna.'}];
QZ['2']=()=>[
  {q:'Quale valore <b>non</b> sta in una colonna DECIMAL(5,2)? (I valori sono scritti come in SQL, con il punto decimale.)',o:['999.99','12.5','1000.5','-45.1'],a:2,
   e:'Cinque cifre in tutto, due dopo il punto decimale, quindi al massimo tre prima: 1000.5 ne richiede quattro.',h:'DECIMAL(precision, scale): precision conta tutte le cifre, scale solo quelle dopo il punto decimale.'},
  {q:'In un data warehouse, quali tabelle sono tenute in terza forma normale?',o:['Le tabelle dei fatti','Le dimensioni','Entrambe','Nessuna: un warehouse non è mai normalizzato'],a:0,
   e:'Le dimensioni sono denormalizzate (prima forma normale) per essere lette facilmente; le tabelle dei fatti, con misure e chiavi, sono normalizzate (terza forma normale).',h:'Pensa a quale tipo di tabella è lunga e stretta, fatta di chiavi e numeri, e quale raccoglie tutti gli attributi di un\'entità.'},
  {q:'Sui cinque clienti del corso, dopo <code>UPDATE Customers SET city = \'milan\';</code> quanti clienti abitano a Milano?',o:['1','5','2','0, l\'istruzione viene rifiutata'],a:1,
   e:'Senza WHERE, UPDATE imposta la città di ogni riga: ora tutti e cinque i clienti abitano a Milano.',h:'Quale parte di un UPDATE limita le righe che tocca, e c\'è?'},
  {q:'Sulle sei vendite del corso, quante righe restituisce <code>WHERE price*quantity &gt; 4 AND customer_id &lt;&gt; 1 OR product_name = \'abc\'</code>?',o:['3','4','5','6'],a:2,
   e:'AND si valuta prima di OR. La parte con AND vale per le vendite 3 (15), 4 (8) e 6 (4,5); la vendita 2 ha importo esattamente 4 e le vendite 1 e 5 sono del cliente 1. L\'OR aggiunge le vendite di abc 2, 4 e 5. In tutto: vendite 2, 3, 4, 5 e 6, cinque righe; resta fuori solo la vendita 1.',h:'Valuta AND prima di OR, e calcola ogni importo; attenzione alla vendita con importo esattamente 4.'},
  {q:'Nel piccolo warehouse della lezione, a quale cliente punta la chiave surrogata cust_key = 1?',o:['Marco Rossi, chiave di business 1','John Doe, chiave di business 2','Mark Smith, chiave di business 3','Mario Bianchi, chiave di business 5'],a:3,
   e:'Le chiavi surrogate seguono l\'ordine di caricamento (Bianchi, Doe, Jane, Rossi, Smith), quindi la chiave 1 è Mario Bianchi, la cui chiave di business è 5.',h:'Una chiave surrogata la crea l\'ETL nell\'ordine di caricamento, non la copia dalla fonte.'},
  {q:'Con la tabella Sales definita nella lezione e i clienti da 1 a 5, quanti vincoli viola <code>INSERT INTO Sales VALUES (7, \'2018-09-04\', 9, \'abc\', 0, 2.00)</code>?',o:['Nessuno','Uno','Due','Tre'],a:2,
   e:'Il cliente 9 non esiste, quindi la chiave esterna (integrità referenziale) non è rispettata; la quantità 0 viola CHECK (quantity &gt; 0) (integrità del dominio). sales_id 7 è nuovo, quindi la chiave primaria va bene: due vincoli.',h:'Controlla la riga nuova colonna per colonna rispetto al CREATE TABLE.'}
];
