/* Lezione 11: preparazione dei dati (Telco Customer Churn) e caso delle prenotazioni alberghiere (Hotel Booking Demand) */
const MISSC=PUR,OUTC=RED,CANC=ORG,p1=v=>v.toFixed(1).replace('.',',');
/* vertical bar chart helper: bars [[label,value,colour]], returns svg string */
function vbars11(bars,o){o=o||{};const W=o.W||340,H=o.H||200,top=o.top||24,bot=o.bot||34,L=o.L||16,R=W-(o.R||16),max=o.max||Math.max(...bars.map(b=>b[1])),bw=o.bw||Math.min(70,(R-L)/bars.length*.62);
  let s='';const Y=v=>H-bot-v/max*(H-bot-top),step=(R-L)/bars.length;
  bars.forEach(([l,v,c],i)=>{const x=L+step*i+(step-bw)/2;s+=rect(x,Y(v),bw,H-bot-Y(v),c||'#9a9a9a')+tx(x+bw/2,Y(v)-6,o.fmt?o.fmt(v):p1(v)+'%',{s:13,f:'#fff',w:600});
    String(l).split('|').forEach((t,k)=>s+=tx(x+bw/2,H-bot+17+k*15,t,{s:12.5,f:'#ccc'}))});
  return s+line(L,H-bot,R,H-bot,'#777',1.2)}
INIT[11]=function(){
  /* time spent */
  (function(){
    const T=[['Caricare i dati',19,1],['Ripulire i dati',26,1],['Scegliere il modello',11,0],['Addestrare e valutare il modello',12,0],['Mettere in produzione',11,0],['Altro',21,0]];let s='';const L=270,R=640,X=v=>L+v/30*(R-L);
    T.forEach(([n,v,h],i)=>{const y=14+i*36;s+=tx(L-12,y+19,n,{s:13.5,f:h?'#fff':'#bbb',a:'end'})+rect(L,y+4,X(v)-L,22,h?ORG:'#777')+tx(X(v)+8,y+21,v+'%',{s:13.5,f:'#fff',a:'start',w:600})});
    s+=lbl(R-4,250,'caricare + ripulire ≈ 45%',ORG,{a:'end',s:14,w:600});
    svgBox($('#b11time'),660,262,s,'Tempo dei data scientist per attività','42rem');
  })();
  /* cricket example */
  (function(){
    const duo=el('div','duo');$('#b11cricket').append(duo);
    cell(duo,'Genere mancante non trattato',vbars11([['Femmine|(2)',50,PINK],['Maschi|(4)',50,BLUE],['Mancante|(2)',100,MISSC]],{max:110,H:210}),340,210,'Prima del trattamento','Sembra: <b>nessuna differenza</b>.');
    cell(duo,'Genere recuperato',vbars11([['Femmine|(4)',75,PINK],['Maschi|(4)',50,BLUE]],{max:110,H:210}),340,210,'Dopo il trattamento','Le femmine giocano <b>di più</b>.');
  })();
  /* listwise vs pairwise deletion */
  (function(){
    const duo=el('div','duo');$('#b11del').append(duo);
    const R=[['M',25,343],['F',null,280],['M',33,332],['M',null,272],['F',25,null],['M',29,326],[null,26,259],['M',32,297]];
    const cols=[{t:'Gender',w:80,a:'m'},{t:'Manpower',w:100,a:'m'},{t:'Sales',w:90,a:'m'}];
    const cellv=v=>v===null?{v:'·',f:MISSC,b:true}:String(v);
    const inc=r=>r.some(v=>v===null);
    const t1=sTab(0,0,cols,R.map(r=>r.map(cellv)),{op:i=>inc(R[i])?.28:1,bg:i=>inc(R[i])?'rgba(252,98,85,.10)':null});
    tabCell(duo,'Listwise',t1,'<b>n = 4</b> per ogni analisi: metà delle righe perse.',300,[40,130,225].map(x=>tx(x,t1.h+22,'n = 4',{s:13,f:RED})).join(''),t1.h+32);
    const t2=sTab(0,0,cols,R.map(r=>r.map(cellv)));
    let ns='';[['n = 7',40],['n = 6',130],['n = 7',225]].forEach(([t,x])=>ns+=tx(x,t2.h+22,t,{s:13,f:GRN}));
    tabCell(duo,'Pairwise',t2,'Ogni variabile usa <b>tutte le righe</b> in cui è presente.',300,ns,t2.h+32);
  })();
  /* multivariate outliers */
  (function(){
    let s='';const r=lcg(1111),L=70,R=640,T=16,B=290,X=v=>L+(v-150)/45*(R-L),Y=v=>B-(v-45)/45*(B-T);const P=[];
    for(let i=0;i<70;i++){const h=158+r()*30,w=-45+0.65*h+gauss10(r)*3.2;P.push([h,w])}
    const O=[[183,56],[186,59],[160,79]];
    [150,160,170,180,190].forEach(v=>s+=line(X(v),T,X(v),B,'#1d1d1d',1)+tx(X(v),B+18,String(v),{s:12.5,f:GRAY}));[50,60,70,80,90].forEach(v=>s+=line(L,Y(v),R,Y(v),'#1d1d1d',1)+tx(L-8,Y(v)+4,String(v),{s:12.5,f:GRAY,a:'end'}));
    const hs=P.map(p=>p[0]).concat(O.map(o=>o[0])),ws=P.map(p=>p[1]).concat(O.map(o=>o[1]));
    s+=rect(X(Math.min(...hs)),B-10,X(Math.max(...hs))-X(Math.min(...hs)),6,'rgba(255,255,255,.25)')+rect(L+4,Y(Math.max(...ws)),6,Y(Math.min(...ws))-Y(Math.max(...ws)),'rgba(255,255,255,.25)');
    P.forEach(([h,w])=>s+='<circle cx="'+X(h).toFixed(1)+'" cy="'+Y(w).toFixed(1)+'" r="4" fill="#ddd"/>');
    O.forEach(([h,w])=>s+='<circle cx="'+X(h)+'" cy="'+Y(w)+'" r="6.5" fill="'+OUTC+'"/>');
    s+=lbl(X(160)+12,Y(79)+5,'troppo pesante',OUTC,{a:'start',s:13})+lbl(X(184.5),Y(56)+26,'troppo leggeri',OUTC,{s:13});
    s+=line(L,B,R,B,'#777',1.2)+line(L,T,L,B,'#777',1.2)+tx((L+R)/2,B+38,'altezza (cm)',{s:13,f:GRAY})+tx(18,(T+B)/2,'peso (kg)',{s:13,f:GRAY,x:' transform="rotate(-90 18 '+(T+B)/2+')"'});
    s+=tx(R,T+12,'fasce chiare sugli assi: intervallo dei valori',{s:12,f:GRAY,a:'end'});
    svgBox($('#b11multi'),680,340,s,'Anomali multivariati in altezza e peso','42rem');
  })();
  /* box plot rule on churners' TotalCharges */
  (function(){
    const OUTS=[5638,5639,5643,5686,5688,5743,5743,5746,5763,5770,5770,5786,5795,5813,5885,5893,5916,5919,5921,5941,5961,6010,6015,6018,6040,6056,6110,6125,6128,6137,6143,6145,6146,6206,6215,6220,6253,6254,6281,6283,6287,6341,6383,6396,6405,6414,6419,6428,6440,6441,6448,6465,6529,6548,6579,6582,6585,6603,6615,6710,6786,6822,6852,6860,6872,6874,6876,6886,6890,6903,6938,6941,6975,6980,6981,6986,7008,7041,7102,7133,7156,7177,7220,7250,7262,7300,7318,7349,7373,7432,7447,7482,7492,7532,7535,7548,7612,7675,7690,7691,7724,7724,7752,7804,7856,7969,8110,8128,8685];
    const q1=134.5,md=703.6,q3=2331.3,fen=q3+1.5*(q3-q1),mn=18.85;let s='';const L=30,R=690,X=v=>L+v/9000*(R-L),y=110;
    [0,3000,6000,9000].forEach(v=>s+=line(X(v),30,X(v),180,'#1d1d1d',1)+tx(X(v),198,fi(v,0),{s:12.5,f:GRAY}));
    s+=line(X(mn),y,X(q1),y,'#bbb',1.5)+line(X(q3),y,X(5626),y,'#bbb',1.5)+line(X(5626),y-10,X(5626),y+10,'#bbb',1.5);
    s+=rect(X(q1),y-22,X(q3)-X(q1),44,'rgba(255,134,47,.12)',CANC,' stroke-width="2"')+line(X(md),y-22,X(md),y+22,'#fff',3);
    s+=line(X(fen),34,X(fen),170,YEL,2,' stroke-dasharray="6 4"')+lbl(X(fen)+6,48,'staccionata ≈ 5.630 $',YEL,{a:'start',s:13});
    const r=lcg(77);OUTS.forEach(v=>s+='<circle cx="'+X(v).toFixed(1)+'" cy="'+(y+(r()-.5)*34).toFixed(1)+'" r="3" fill="'+OUTC+'" fill-opacity=".85"/>');
    s+=tx(X(q1),y+40,'Q₁',{s:13,f:'#ddd'})+tx(X(q3),y+40,'Q₃',{s:13,f:'#ddd'})+tx(X(md),y-30,'mediana 704',{s:12.5,f:'#fff'});
    s+=tx((X(q3)+X(fen))/2,y-30,'1,5 × IQR',{s:12.5,f:GRAY})+line(X(q3),y-26,X(fen),y-26,'#666',1)+lbl(X(7200),y+48,'109 anomali',OUTC,{s:13});
    s+=tx((L+R)/2,222,'spesa totale dei clienti persi ($)',{s:13,f:GRAY});
    svgBox($('#b11fence'),720,232,s,'Regola del box plot','44rem');
  })();
  /* impact on statistics */
  (function(){
    const S=[['Media',5.45,30],['Mediana',5,5.5],['Moda',5,5],['Dev. standard',1.04,85.03]];let s='';const B=200,T=26,Y=v=>B-v/90*(B-T);
    [0,30,60,90].forEach(v=>s+=line(40,Y(v),680,Y(v),'#1d1d1d',1)+tx(34,Y(v)+4,String(v),{s:12,f:GRAY,a:'end'}));
    S.forEach(([n,a,b],i)=>{const x=80+i*155;s+=rect(x,Y(a),46,B-Y(a),'#9a9a9a')+rect(x+54,Y(b),46,B-Y(b),OUTC)+tx(x+23,Y(a)-6,fi(a,2),{s:12.5,f:'#ddd'})+tx(x+77,Y(b)-6,fi(b,2),{s:12.5,f:OUTC,w:600})+tx(x+50,B+20,n,{s:13,f:'#ddd'})});
    s+=line(40,B,680,B,'#777',1.2)+rect(470,6,12,12,'#9a9a9a')+tx(488,17,'senza 300',{s:12.5,f:'#ddd',a:'start'})+rect(570,6,12,12,OUTC)+tx(588,17,'con 300',{s:12.5,f:'#ddd',a:'start'});
    svgBox($('#b11stat'),700,232,s,'Effetto di un valore anomalo sulle statistiche','42rem');
  })();
  /* impact on regression */
  (function(){
    const r=lcg(2011),P=[];for(let i=0;i<12;i++){const x=.5+i*.8;P.push([x,2*x+2+gauss10(r)*1.1])}const O=[11.5,4];
    const fit=pts=>{const mx=st10.mean(pts.map(p=>p[0])),my=st10.mean(pts.map(p=>p[1]));let a=0,b=0;pts.forEach(([x,y])=>{a+=(x-mx)*(y-my);b+=(x-mx)**2});const sl=a/b;return [sl,my-sl*mx]};
    const [s1,i1]=fit(P),[s2,i2]=fit(P.concat([O]));let s='';const L=50,R=650,T=14,B=270,X=v=>L+v/12*(R-L),Y=v=>B-v/28*(B-T);
    [0,7,14,21,28].forEach(v=>s+=line(L,Y(v),R,Y(v),'#1d1d1d',1)+tx(L-8,Y(v)+4,String(v),{s:12,f:GRAY,a:'end'}));[0,2,4,6,8,10,12].forEach(v=>s+=tx(X(v),B+18,String(v),{s:12,f:GRAY}));
    s+='<clipPath id="b11rc"><rect x="'+L+'" y="'+T+'" width="'+(R-L)+'" height="'+(B-T)+'"/></clipPath><g clip-path="url(#b11rc)">'+line(X(0),Y(i1),X(12),Y(i1+12*s1),'#9a9a9a',2.5)+line(X(0),Y(i2),X(12),Y(i2+12*s2),OUTC,2.5,' stroke-dasharray="7 4"')+'</g>';
    P.forEach(([x,y])=>s+='<circle cx="'+X(x)+'" cy="'+Y(y)+'" r="5" fill="#fff"/>');s+='<circle cx="'+X(O[0])+'" cy="'+Y(O[1])+'" r="7" fill="'+OUTC+'"/>';
    s+=line(L,B,R,B,'#777',1.2)+line(L,T,L,B,'#777',1.2);
    s+=lbl(L+14,T+18,'pendenza senza l\'anomalo: '+fi(s1,2),'#ddd',{a:'start',s:13.5})+lbl(L+14,T+40,'pendenza con l\'anomalo: '+fi(s2,2),OUTC,{a:'start',s:13.5});
    svgBox($('#b11reg'),680,296,s,'Effetto di un valore anomalo sulla regressione','42rem');
  })();
  /* transformations */
  (function(){
    const t=el('div','trio');$('#b11tr').append(t);
    const H=[['Spesa totale ($)',[2439,1175,692,476,413,381,366,314,295,229,174,89],'0','8.685','+0,96'],['√ spesa totale',[458,873,772,753,831,619,506,505,525,521,435,245],'0','93,2','+0,31'],['ln(spesa totale + 1)',[11,0,0,42,213,510,406,646,913,1382,1318,1602],'0','9,07','−0,82']];
    H.forEach(([n,c,lo,hi,sk])=>{const mx=Math.max(...c);let s='';c.forEach((v,i)=>s+=rect(12+i*19.5,130-v/mx*112,17,v/mx*112,'#aaa'));s+=line(10,130,246,130,'#777',1.2)+tx(12,146,lo,{s:12,f:GRAY,a:'start'})+tx(246,146,hi,{s:12,f:GRAY,a:'end'});
      cell(t,n,s,256,152,n,'asimmetria <b>'+sk+'</b>')});
  })();
  /* one-hot */
  (function(){
    const rows=[['Month-to-month',1,0,0],['One year',0,1,0],['Month-to-month',1,0,0],['Two year',0,0,1],['One year',0,1,0]];
    const c1=[{t:'Contract',w:150}],c2=[{t:'Contract_M2M',w:120,a:'m',c:BLUE},{t:'Contract_1Y',w:110,a:'m',c:BLUE},{t:'Contract_2Y',w:110,a:'m',c:BLUE}];
    const a=sTab(10,10,c1,rows.map(r=>[r[0]])),b=sTab(250,10,c2,rows.map(r=>r.slice(1).map(v=>({v:String(v),f:v?'#fff':'#666',b:!!v,bg:v?'rgba(88,196,221,.22)':null}))));
    const s=a.s+b.s+'<defs>'+arrowDef('b11oh','#aaa')+'</defs>'+line(172,90,236,90,'#aaa',2,' marker-end="url(#b11oh)"')+tx(204,80,'One to Many',{s:12,f:GRAY});
    svgBox($('#b11onehot'),600,a.h+24,s,'Codifica one-hot del contratto','38rem');
  })();
  /* churn by tenure group */
  (function(){
    svgBox($('#b11tg'),420,220,vbars11([['0-12',47.4,CANC],['13-24',28.7,CANC],['25-48',20.4,CANC],['49-72',9.5,CANC]],{W:420,H:220,max:55,bot:40})+tx(210,214,'classe di permanenza (mesi)',{s:12.5,f:GRAY}),'Tasso di abbandono per classe di permanenza','28rem');
  })();
  /* leakage crosstab */
  (function(){
    const cols=[{t:'reservation_status',w:180},{t:'is_canceled = 0',w:140,a:'e'},{t:'is_canceled = 1',w:140,a:'e'}];
    const z={v:'0',f:'#555'},rows=[['Check-Out',{v:'75.166',f:'#fff',b:true,bg:'rgba(88,196,221,.22)'},z],['Canceled',z,{v:'43.017',f:'#fff',b:true,bg:'rgba(255,134,47,.25)'}],['No-Show',z,{v:'1.207',f:'#fff',b:true,bg:'rgba(255,134,47,.25)'}]];
    const t=sTab(10,8,cols,rows,{rh:30,fs:14});
    svgBox($('#b11leak'),490,t.h+20,t.s,'Stato della prenotazione e target','32rem');
  })();
  /* missing as predictor */
  (function(){
    let s='';const G=[['Agenzia',39.0,24.7],['Società',38.2,17.5],['Paese',37.1,13.7]];const B=190,Y=v=>B-v/45*(B-24);
    G.forEach(([n,p,m],i)=>{const x=60+i*200;s+=rect(x,Y(p),56,B-Y(p),'#9a9a9a')+rect(x+64,Y(m),56,B-Y(m),CANC)+tx(x+28,Y(p)-6,p1(p)+'%',{s:13,f:'#ddd'})+tx(x+92,Y(m)-6,p1(m)+'%',{s:13,f:CANC,w:600})+tx(x+60,B+20,n,{s:13.5,f:'#ddd'})});
    s+=line(30,B,650,B,'#777',1.2)+rect(390,4,12,12,'#9a9a9a')+tx(408,15,'valore presente',{s:12.5,f:'#ddd',a:'start'})+rect(530,4,12,12,CANC)+tx(548,15,'valore mancante',{s:12.5,f:'#ddd',a:'start'});
    svgBox($('#b11flag'),680,220,s,'Cancellazioni per presenza del valore','42rem');
  })();
  /* signal of new features */
  (function(){
    const duo=el('div','duo');$('#b11sig').append(duo);
    cell(duo,'Per gruppo di paese',vbars11([['Portogallo',56.7,CANC],['Europa',22.1,'#9a9a9a'],['Resto del|mondo',31.3,'#9a9a9a'],['Sconosciuto',11.9,'#9a9a9a']],{max:65,H:220,bot:44}),340,220,'Cancellazioni per gruppo di paese','Portogallo: <b>più della metà</b>.');
    cell(duo,'Per anticipo (giorni)',vbars11([['0-7',9.6,'#9a9a9a'],['8-30',27.9,'#9a9a9a'],['31-90',37.7,'#9a9a9a'],['91-180',44.7,'#9a9a9a'],['181+',57.0,CANC]],{max:65,H:220,bot:44}),340,220,'Cancellazioni per anticipo','Più lontana, <b>più a rischio</b>.');
  })();
};
QZ['11a']=()=>[{q:'In una tabella di studenti ci sono Student_ID, Gender, Prev_Exam_Marks, Height, Weight e Play Cricket (0 o 1), e si vuole prevedere chi gioca a cricket. Quale affermazione è corretta?',o:['Play Cricket è un predittore numerico continuo','Student_ID è un buon predittore perché è diverso per ogni studente','Play Cricket è il target ed è categorica, anche se salvata come numero','Gender è il target'],a:2,
  e:'Il target è ciò che si vuole prevedere, Play Cricket; i suoi valori 0 e 1 sono codici di due categorie. Student_ID è un identificativo, non un predittore.',h:'Conta il livello di misura, non il formato di memorizzazione.'}];
QZ['11b']=()=>[{q:'Nella tabella dei venditori, con la sostituzione per genere, quale valore riceve un uomo con Manpower mancante, se gli uomini con il valore presente hanno 25, 33, 29 e 32?',o:['28,33','29,75','25','30,5'],a:1,
  e:'(25 + 33 + 29 + 32) / 4 = 119 / 4 = 29,75. 28,33 è la media generale dei 6 valori presenti.',h:'Media solo degli uomini.'}];
QZ['11c']=()=>[{q:'Per una variabile Q₁ = 9 e Q₃ = 55. Oltre quale valore un dato è anomalo secondo la regola del box plot?',o:['55','64','124','101,5'],a:2,
  e:'IQR = 55 − 9 = 46; staccionata superiore = 55 + 1,5 × 46 = 55 + 69 = 124. Sono i quartili della permanenza Telco: con un massimo di 72 mesi, nessun cliente è anomalo.',h:'Prima calcola l\'IQR, poi aggiungi 1,5 volte l\'IQR a Q₃.'}];
QZ['11d']=()=>[{q:'Il metodo di pagamento ha quattro categorie senza ordine. Come lo codifichi per una regressione logistica?',o:['Con gli interi 1, 2, 3, 4','Con quattro colonne 0/1 (one-hot)','Con la normalizzazione min-max','Lo lasci come testo'],a:1,
  e:'Per una variabile nominale serve la codifica one-hot: con 1, 2, 3, 4 il modello leggerebbe un ordine e distanze che non esistono.',h:'La variabile è nominale o ordinale?'}];
QZ['11e']=()=>[{q:'Perché la regola dell\'IQR non funziona sui giorni in lista d\'attesa?',o:['Perché la variabile è categorica','Perché il 97% dei valori è zero: Q₁ = Q₃ = 0, IQR = 0, e ogni attesa verrebbe considerata anomala','Perché i valori sono negativi','Perché gli alberi non accettano valori grandi'],a:1,
  e:'Con IQR = 0 entrambe le staccionate stanno a zero: le 3.693 prenotazioni che hanno atteso verrebbero azzerate. Meglio un indicatore, che conserva il segnale (63,9% contro 36,2% di cancellazioni).',h:'Quanto valgono Q₁ e Q₃ se quasi tutti i valori sono uguali?'}];
QZ['11']=()=>[
  {q:'Un\'azienda ha un questionario in cui chi ha un reddito basso tende a non rispondere alla domanda sul reddito. Come si classifica il meccanismo e che cosa conviene fare?',o:['MCAR: cancellare le righe','MAR: imputare la media','MNAR: la mancanza dipende dal valore stesso; aggiungere un indicatore o una categoria «non dichiarato»','Strutturale: mettere zero'],a:2,
   e:'La probabilità di mancare dipende dal valore mancante: è MNAR. Cancellare o imputare la media distorcerebbe il quadro; un indicatore conserva l\'informazione.',h:'Da che cosa dipende la probabilità che il reddito manchi?'},
  {q:'Undici valori fra 4 e 7 hanno media 5,45. Si aggiunge un dodicesimo valore, 300. Quanto diventa la media?',o:['5,50','30,00','85,03','27,72'],a:1,
   e:'La somma degli undici valori è 5,45 × 11 = 60; con 300 diventa 360, divisa per 12 dà 30. La mediana invece passa solo da 5 a 5,5.',h:'Ricava la somma dalla media, aggiungi 300, dividi per 12.'},
  {q:'Quale di queste colonne del dataset alberghiero è leakage per prevedere la cancellazione al momento della prenotazione?',o:['lead_time, i giorni fra prenotazione e arrivo','deposit_type, il tipo di caparra','assigned_room_type, la camera assegnata all\'arrivo','total_of_special_requests'],a:2,
   e:'La camera assegnata si decide all\'arrivo, quindi non si conosce quando si prenota; e chi cancella non arriva mai. Le altre tre sono note al momento della prenotazione.',h:'Per ogni colonna: la conoscerei quando serve la previsione?'},
  {q:'La colonna company manca nel 94% delle prenotazioni e chi ha una società cancella nel 17,5% dei casi contro il 38,2%. Che cosa fa il workflow?',o:['Cancella le righe senza società','Imputa la società più frequente','Crea l\'indicatore has_company e toglie il codice','Toglie la colonna e non ne tiene traccia'],a:2,
   e:'È un mancante strutturale (non è una prenotazione aziendale) e la sua presenza predice: l\'indicatore conserva il segnale, il codice con troppi valori si toglie.',h:'La mancanza qui è un\'informazione?'},
  {q:'Un modello di k-NN e una random forest vengono addestrati su dati con alcuni valori estremi ma veri. Per quale dei due conviene di più limitare gli estremi?',o:['Per la random forest, perché crea alberi profondi','Per il k-NN, perché un valore estremo altera le distanze e il vicinato','Per nessuno dei due','Per tutti e due allo stesso modo'],a:1,
   e:'I modelli basati sulle distanze soffrono molto gli anomali; gli alberi tagliano su soglie e guardano solo l\'ordine dei valori, quindi ne risentono poco.',h:'Ricorda la tabella dei modelli di machine learning.'},
  {q:'Per bilanciare i clienti persi uno studente applica SMOTE a tutto il dataset e poi divide in addestramento e test. Che cosa non va?',o:['Niente, SMOTE va sempre applicato prima','I casi sintetici finiscono anche nel test: la valutazione non è più fatta su dati veri','SMOTE funziona solo con le immagini','Bisognava usare la normalizzazione'],a:1,
   e:'La regola delle slide: si aumenta solo l\'insieme di addestramento, mai quello di test, e si valida sempre su dati veri al 100%.',h:'Su quali dati deve avvenire la valutazione?'}
];
MAPPA[11]={c:'Come si preparano i dati per un modello?',r:[
  {t:'I passi',c:BLUE,v:['Ruoli, livelli, uni e bivariata (lezione 10)','Mancanti, anomali, feature','Fino all\'80% del tempo di un progetto']},
  {t:'Valori mancanti',c:PUR,v:['Perché manca? MCAR, MAR, MNAR, strutturale','Cancellare: listwise o pairwise','Imputare: media, mediana, moda, modello','Telco: 11 clienti nuovi, spesa = 0']},
  {t:'Valori anomali',c:RED,v:['Univariati e multivariati','Box plot: oltre 1,5 IQR dai quartili','Spostano media e dev. standard, non la mediana','Errore o valore naturale?']},
  {t:'Trattamenti',c:ORG,v:['Cancellare, sostituire, limitare','Trasformare: radice, logaritmo','Gli alberi ne risentono poco']},
  {t:'Feature engineering',c:GRN,v:['One-hot e codifica ordinale','Min-max e z-score','Interazioni, classi, polinomi','GenAI propone, l\'uomo verifica; SMOTE solo sul training']},
  {t:'Caso alberghi',c:YEL,v:['119.390 prenotazioni, 37% cancellate','Leakage: reservation_status','Mancanti travestiti: NA, NULL, Undefined','Indicatori, gruppi, 187 righe errate tolte']}]};
