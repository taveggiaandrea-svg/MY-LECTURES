/* Lezione 3: come si combinano due tabelle */
INIT[3]=function(){
  codeHL($('#lezione-3'));
  /* cartesian product with the ON predicate */
  (function(){
    let s='';const x0=150,cw=106,y0=58,rh=42;
    BSL.forEach((sl,j)=>{const x=x0+j*cw+cw/2;s+=tx(x,20,'qty '+sl[2],{s:13.5,f:GRAY})+tx(x,40,'buyer_id '+sl[0],{s:13.5,f:FKC})});
    BUY.forEach((b,i)=>{const y=y0+i*rh;s+=tx(x0-12,y+18,b[0],{s:14,a:'end',f:'#fff'})+tx(x0-12,y+35,'buyer_id '+b[1],{s:13,a:'end',f:PKC});
      BSL.forEach((sl,j)=>{const m=b[1]===sl[0],x=x0+j*cw;s+=rect(x+4,y+3,cw-8,rh-6,m?'rgba(255,134,47,.85)':'#141414',m?PRC:'#2a2a2a')+tx(x+cw/2,y+26,b[1]+' = '+sl[0],{s:14,f:m?'#000':'#666'})})});
    svgBox($('#b3cart'),720,y0+4*rh+8,s,'Prodotto cartesiano di acquirenti e vendite','46rem');
    $('#b3cart').append(el('div','cellnote','20 coppie, 5 con il predicato vero. La riga di Lucy Thin non ha celle arancioni: non ha comprato nulla.'));
  })();
  /* four joins */
  (function(){
    const duo=el('div','duo'),root=$('#b3joins');root.append(legend([[PUR,'NULL: nessun partner trovato','box']]),duo);
    const sales=BSL.concat([[9,4,7]]),C=[{t:'buyer_name',w:84},{t:'b.id',w:42,a:'e',c:PKC},{t:'s.id',w:42,a:'e',c:FKC},{t:'qty',w:48,a:'e'}];
    const inner=[];BUY.forEach(b=>sales.forEach(sl=>{if(b[1]===sl[0])inner.push([b[0],b[1],sl[0],sl[2]])}));
    const lostB=BUY.filter(b=>!sales.some(sl=>sl[0]===b[1])).map(b=>[b[0],b[1],null,null]);
    const lostS=sales.filter(sl=>!BUY.some(b=>b[1]===sl[0])).map(sl=>[null,null,sl[0],sl[2]]);
    const maxRows=inner.length+lostB.length+lostS.length;
    [['INNER JOIN',inner,'solo le coppie che si abbinano'],['LEFT OUTER JOIN',inner.concat(lostB),'ogni acquirente tenuto'],['RIGHT OUTER JOIN',inner.concat(lostS),'ogni vendita tenuta'],['FULL OUTER JOIN',inner.concat(lostB,lostS),'entrambi i lati tenuti']].forEach(([title,rows,note])=>{
      const t=sTab(4,4,C,rows,{bg:i=>i>=inner.length?'rgba(202,163,232,.16)':null});
      tabCell(duo,title,t,'<b>'+rows.length+' righe:</b> '+note+'.',330,'',26+maxRows*25+8)});
  })();
  /* UNION and UNION ALL */
  (function(){
    const duo=el('div','duo');$('#b3union').append(duo);const C=[{t:'id',w:40,a:'e'},{t:'descr',w:60},{t:'origine',w:70}];
    [['UNION',[[1,'a','t1 e t2'],[2,'b','t1'],[3,'c','t2']],'3 righe: il duplicato viene eliminato.'],['UNION ALL',[[1,'a','t1'],[2,'b','t1'],[1,'a','t2'],[3,'c','t2']],'4 righe: il duplicato resta.']].forEach(([title,rows,note])=>{
      const t=sTab(4,4,C,rows.map(r=>[r[0],r[1],{v:r[2],f:GRAY}]),{bg:i=>rows[i][0]===1?HLBG:null});tabCell(duo,title,t,note,330,'',26+4*25+8)});
  })();
  /* three valued logic and a left join */
  (function(){
    let s='';const V=v=>v===null?{v:'UNKNOWN',f:NLC}:v?{v:'TRUE',f:GRN}:{v:'FALSE',f:RED};
    const t1=sTab(4,30,[{t:'confronto',w:130},{t:'esito',w:90}],[['5 &gt; 2',V(true)],['1 = 1',V(true)],[{v:'NULL &gt; 99'},V(null)],[{v:'NULL = NULL'},V(null)],[{v:'5 &lt;&gt; NULL'},V(null)]]);
    s+=t1.s+tx(114,18,'Confronti',{s:14,f:'#fff',w:500});
    const rows=[];CUST.forEach(c=>{const ss=SAL.filter(r=>r[2]===c[0]);if(ss.length)ss.forEach(r=>rows.push([c[2],r[2],r[3],r[4]]));else rows.push([c[2],null,null,null])});
    const C=[{t:'last_name',w:78},{t:'s.cust_id',w:66,a:'e',c:FKC},{t:'product',w:60},{t:'qty',w:36,a:'e'},{t:'= NULL',w:82,a:'m',c:PRC},{t:'IS NULL',w:66,a:'m',c:PRC}];
    const t2=sTab(262,30,C,rows.map(r=>[r[0],r[1],r[2],r[3],V(null),V(r[1]===null)]),{bg:i=>rows[i][1]===null?'rgba(202,163,232,.16)':null});
    s+=t2.s+tx(262+194,18,'Customers c LEFT JOIN Sales s',{s:14,f:'#fff',w:500});
    svgBox($('#b3null'),720,30+t2.h+8,s,'Logica a tre valori e un left join','46rem');
    $('#b3null').append(el('div','cellnote','<code>WHERE s.customer_id = NULL</code> tiene <span class="bad">0</span> righe: ogni riga è UNKNOWN. <code>WHERE s.customer_id IS NULL</code> ne tiene <span class="ok">1</span>: Bianchi, il cliente senza vendite.'));
  })();
  /* how GROUP BY works */
  (function(){
    const rows=[[43659,29825],[43660,29672],[43661,29734],[43662,29994],[43663,29565],[51803,30097],[69427,30097],[44529,30098],[46063,30098],[75123,18759]];
    const keep=r=>r[1]===30097||r[1]===30098;let s='';
    const C=[{t:'OrderID',w:70,a:'e'},{t:'CustomerID',w:86,a:'e'}];
    const t1=sTab(4,30,C,rows.map(r=>[r[0],{v:r[1],f:keep(r)?'#fff':GRAY}]),{op:i=>keep(rows[i])?1:.3,bg:i=>keep(rows[i])?HLBG:null});
    s+=t1.s+tx(82,18,'Orders',{s:14,f:'#fff',w:500});
    s+=tx(222,104,'WHERE',{s:13.5,f:PRC})+tx(222,122,'CustomerID IN',{s:13,f:PRC})+tx(222,140,'(30097, 30098)',{s:13,f:PRC})+tx(222,166,'→',{s:20,f:GRAY});
    const g=[[[51803,30097],[69427,30097]],[[44529,30098],[46063,30098]]];
    g.forEach((gr,k)=>{const y=60+k*110;const t=sTab(306,y,C,gr);s+=t.s+'<path d="M300 '+(y+30)+'h-6v'+(t.h-30)+'h6" fill="none" stroke="'+MSC+'" stroke-width="2"/>'});
    s+=tx(384,46,'GROUP BY CustomerID',{s:13.5,f:'#fff',w:500});
    s+=tx(520,166,'COUNT(*)',{s:13.5,f:MSC})+tx(520,188,'→',{s:20,f:GRAY});
    const t3=sTab(560,124,[{t:'CustomerID',w:86,a:'e'},{t:'COUNT(*)',w:70,a:'e',c:MSC}],[[30097,{v:2,f:MSC}],[30098,{v:2,f:MSC}]]);
    s+=t3.s+tx(638,112,'Risultato',{s:14,f:'#fff',w:500});
    svgBox($('#b3group'),720,30+t1.h+8,s,'Come funziona GROUP BY','46rem');
  })();
  /* HAVING with and without WHERE */
  (function(){
    const duo=el('div','duo'),root=$('#b3having');root.append(legend([[GRN,'prodotto che supera HAVING','box'],['#555','prodotto escluso','box'],[PRC,'HAVING SUM(quantity) &gt; 60']]),duo);
    const names={1:'Chai',2:'Chang',3:'Aniseed Syrup',4:'Cajun'};
    [['Tutte le voci',0],['WHERE quantity &gt; 10',10]].forEach(([title,w])=>{
      const W=340,L=104,R=318,X=v=>L+v/80*(R-L);let s='';
      [0,20,40,60,80].forEach(v=>{s+=line(X(v),10,X(v),182,'#222',1)+tx(X(v),200,v,{s:13,f:GRAY})});
      [1,2,3,4].forEach((p,i)=>{const its=ITEMS.filter(it=>it[1]===p&&it[2]>w),sum=its.reduce((a,it)=>a+it[2],0),ok=sum>60,y=20+i*42;
        s+=tx(L-8,y+19,names[p],{s:13.5,a:'end',f:'#fff'})+rect(L,y+2,X(sum)-L,26,ok?GRN:'#555')+lbl(X(sum)+6,y+20,sum,ok?GRN:GRAY,{a:'start'})});
      s+=line(X(60),6,X(60),186,PRC,2.5)+tx((L+R)/2,218,'quantità totale',{s:13,f:GRAY});
      cell(duo,title,s,W,226,title,w?'Passa solo <b>Cajun (65)</b>: le sue voci sono grandi.':'Passano <b>Chang (71)</b> e <b>Cajun (65)</b>.')});
  })();
  /* self-contained versus correlated subquery */
  (function(){
    const duo=el('div','duo');$('#b3subq').append(duo);
    const rows=ORD.slice().sort((a,b)=>a[0]<b[0]?-1:a[0]>b[0]?1:a[1]-b[1]);const max=rows.reduce((m,r)=>r[0]>m?r[0]:m,'');
    const last=cid=>rows.filter(r=>r[1]===cid).reduce((m,r)=>r[0]>m?r[0]:m,'');
    let t=sTab(4,4,[{t:'lastname',w:84},{t:'orderdate',w:90},{t:'risultato interno',w:120,c:MSC}],rows.map(r=>[r[2],r[0],{v:max,f:MSC}]),{bg:i=>rows[i][0]===max?OKBG:null,op:i=>rows[i][0]===max?1:.45});
    cell(duo,'Indipendente: eseguita una volta',t.s,t.w+8,t.h+8,'Sottoquery indipendente','<b>1 riga:</b> Anders, che ha fatto l\'ultimo ordine (15 luglio 2018).');
    t=sTab(4,4,[{t:'lastname',w:84},{t:'orderdate',w:90},{t:'risultato interno',w:120,c:MSC}],rows.map(r=>[r[2],r[0],{v:last(r[1]),f:MSC}]),{bg:i=>rows[i][0]===last(rows[i][1])?OKBG:null,op:i=>rows[i][0]===last(rows[i][1])?1:.45});
    cell(duo,'Correlata: eseguita una volta per ordine',t.s,t.w+8,t.h+8,'Sottoquery correlata','<b>2 righe:</b> l\'ultimo ordine di ogni cliente.');
  })();
  /* four window functions */
  (function(){
    const duo=el('div','duo'),root=$('#b3win');root.append(legend([[WNC,'righe nella finestra della riga segnata','box'],['#fff','riga segnata','dash']]),duo);
    const C=[{t:'nome',w:68},{t:'data',w:50},{t:'importo',w:66,a:'e'},{t:'',w:84,a:'e',c:WNC}];
    const byDate=ORD.slice();const part=cid=>byDate.filter(r=>r[1]===cid);
    const panel=(title,colname,rows,vals,winOf,mark,extra,note)=>{const cc=C.map((c,j)=>j===3?{...c,t:colname}:c);
      const t=sTab(4,4,cc,rows.map((r,i)=>[r[2],r[0].slice(8)+'/'+r[0].slice(5,7),fe(r[3]),{v:fe(vals[i]),f:WNC}]),{bg:i=>i===mark?'rgba(92,208,179,.45)':winOf.includes(i)?WINBG:null});
      let s=t.s+(mark>=0?rect(4,4+26+mark*25,t.w,25,'none','#fff',' stroke-width="1.5" stroke-dasharray="4 3"'):'')+(extra||'');
      cell(duo,title,s,t.w+40,t.h+8,title,note)};
    /* ROW_NUMBER over amount descending */
    const rn=[1,2].flatMap(c=>part(c).slice().sort((a,b)=>b[3]-a[3]));const rnv=rn.map(r=>rn.filter(x=>x[1]===r[1]).indexOf(r)+1);
    panel('ROW_NUMBER()','rn',rn,rnv,[],-1,'','ORDER BY TotalAmount DESC: rn = 1 è l\'ordine più grande di ogni cliente.');
    /* LAG */
    const lag=byDate.map(r=>{const p=part(r[1]),k=p.indexOf(r);return k?p[k-1][3]:0});
    let ar='<defs>'+arrowDef('b3la',GRAY)+'</defs>';byDate.forEach((r,i)=>{const p=part(r[1]),k=p.indexOf(r);if(k){const y1=4+26+(i-1)*25+13,y2=y1+25;ar+='<path d="M'+(4+186)+' '+(y1-2)+' L'+(4+206)+' '+(y2-4)+'" fill="none" stroke="'+GRAY+'" stroke-width="1.2" marker-end="url(#b3la)"/>'}});
    panel('LAG(TotalAmount, 1, 0)','Previous',byDate,lag,[],-1,ar,'Ogni riga riceve l\'importo precedente dello stesso cliente; la prima riceve il valore predefinito 0.');
    /* moving average and running total */
    const avg=byDate.map(r=>{const p=part(r[1]),k=p.indexOf(r),w=p.slice(Math.max(0,k-2),k+1);return w.reduce((a,x)=>a+x[3],0)/w.length});
    panel('AVG, da 2 PRECEDING a CURRENT ROW','MovingAvg',byDate,avg,[0,1],2,'','Finestra del terzo ordine di Anders: i suoi primi tre ordini, media 974,6.');
    const run=byDate.map(r=>{const p=part(r[1]),k=p.indexOf(r);return p.slice(0,k+1).reduce((a,x)=>a+x[3],0)});
    panel('SUM, UNBOUNDED PRECEDING','RunningTotal',byDate,run,[0,1,2],3,'','Finestra del quarto ordine di Anders: tutti i suoi ordini fino a lì, totale 3549.');
  })();
};
QZ['3a']=()=>[{q:'Dopo <code>Customers c LEFT JOIN Sales s ON c.customer_id = s.customer_id</code>, quante righe tiene <code>WHERE s.customer_id = NULL</code>?',
  o:['1, Bianchi, che non ha vendite','7','0','L\'RDBMS restituisce un errore'],a:2,
  e:'s.customer_id = NULL è UNKNOWN su ogni riga, compresa quella di Bianchi, e WHERE scarta UNKNOWN: zero righe. IS NULL restituirebbe Bianchi.',h:'Che cosa restituisce il confronto di qualunque cosa con NULL usando =, e quali esiti tiene WHERE?'}];
QZ['3b']=()=>[{q:'Stessa media mobile. Quanto vale sul quarto ordine di Anders (625,2)?',o:['974,6','1036,33','887,25','625,2'],a:1,
  e:'La finestra contiene i suoi ordini 2, 3 e 4: (1813 + 670,8 + 625,2) / 3 = 1036,33.',h:'Trova quali dei suoi ordini cadono nella finestra del quarto, poi fanne la media.'}];
QZ['3c']=()=>[{q:'Se il WHERE del secondo riquadro fosse <code>quantity &gt;= 10</code> invece di <code>quantity &gt; 10</code>, quali prodotti supererebbero <code>HAVING SUM(i.quantity) &gt; 60</code>?',o:['Solo Chef Anton\'s Cajun Seasoning','Chang e Chef Anton\'s Cajun Seasoning','Chai, Chang e Chef Anton\'s Cajun Seasoning','Nessuno'],a:1,
  e:'Con >= 10 tornano le voci pari esattamente a 10: Chang diventa 10 + 40 + 15 = 65, Chai 12 + 15 = 27, Aniseed Syrup 10 + 35 = 45, Cajun resta 65. Passano Chang e Cajun.',h:'Trova le voci con quantità esattamente 10 e riaggiungile ai loro prodotti.'}];
QZ['3']=()=>[
  {q:'Con gli acquirenti e le vendite della lezione (senza la vendita in più), quante righe restituisce <code>buyers LEFT OUTER JOIN sales</code>?',o:['4','5','6','20'],a:2,
   e:'Adam e Pil hanno due vendite ciascuno, Eva una, e Lucy nessuna ma comunque una riga con dei NULL: 2 + 2 + 1 + 1 = 6.',h:'Conta le righe del risultato acquirente per acquirente; un acquirente senza vendite compare comunque una volta.'},
  {q:'Con t1 = {(1,\'a\'), (2,\'b\')} e t2 = {(1,\'a\'), (3,\'c\')}, quante righe restituiscono UNION e UNION ALL?',o:['4 e 4','3 e 3','2 e 4','3 e 4'],a:3,
   e:'Entrambe le tabelle contengono (1, \'a\'): UNION ALL tiene tutte e quattro le righe, UNION elimina il duplicato e ne restituisce tre.',h:'Scrivi le quattro righe e cerca quella che compare in entrambe le tabelle.'},
  {q:'Sulla tabella OrderItem del corso, quante righe restituisce <code>SELECT orderid, SUM(quantity) FROM OrderItem GROUP BY orderid HAVING COUNT(*) &gt;= 2</code>, e quale ordine ha la somma più grande?',o:['9 righe; l\'ordine 2','6 righe; l\'ordine 5','6 righe; l\'ordine 2','3 righe; l\'ordine 5'],a:1,
   e:'Gli ordini da 1 a 6 hanno due o più voci (l\'ordine 1 ne ha tre); gli ordini 7, 8 e 9 hanno una voce ciascuno e vengono scartati da HAVING. Le somme sono 27, 49, 45, 21, 50 e 21: l\'ordine 5 (35 + 15 = 50) è il più grande, appena sopra l\'ordine 2 (49).',h:'Conta prima le voci di ogni ordine, poi somma le loro quantità.'},
  {q:'Che tipo di sottoquery contiene <code>WHERE o.orderdate = (SELECT MAX(orderdate) FROM Orders o2 WHERE o2.customerid = o.customerid)</code>?',o:['Indipendente','Una verifica EXISTS','Che restituisce una tabella','Correlata'],a:3,
   e:'La query interna usa o.customerid della riga esterna, quindi è correlata e viene valutata di nuovo per ogni riga esterna.',h:'Cerca una colonna della query esterna usata dentro quella interna.'},
  {q:'Nell\'esempio di LAG della lezione, quanto vale PreviousPurchase sull\'ordine di Trujillo da 1444,8?',o:['1863,4','3730','0','2490,5'],a:1,
   e:'Gli ordini di Trujillo in ordine di data sono 1863,4, 3730, 1444,8, 2490,5. Sul terzo, LAG(TotalAmount, 1, 0) restituisce il secondo: 3730.',h:'LAG con n = 1 guarda una riga indietro dentro la stessa partizione, in ordine di OrderDate.'},
  {q:'Sul terzo ordine di Trujillo, quanto vale il totale progressivo <code>SUM(TotalAmount) OVER (PARTITION BY customerid ORDER BY OrderDate ROWS UNBOUNDED PRECEDING)</code>, e che quota è di <code>SUM(TotalAmount) OVER (PARTITION BY customerid)</code> sulla stessa riga?',o:['7038,2, circa il 74%','5593,4, circa il 59%','7038,2, circa il 52%','9528,7, il 100%'],a:0,
   e:'Totale progressivo: 1863,4 + 3730 + 1444,8 = 7038,2. Il totale della partizione è l\'intero 9528,7 di Trujillo, e 7038,2 / 9528,7 ≈ 0,74.',h:'La prima finestra si ferma alla riga corrente; la seconda copre tutta la partizione.'}
];
