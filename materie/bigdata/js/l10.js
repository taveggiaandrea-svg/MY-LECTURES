/* Lezione 10: KNIME e analisi di base dei dati (dataset IBM Telco Customer Churn) */
const TELSC=[[31,639],[72,1849],[14,773],[21,416],[72,6130],[15,1071],[1,60],[66,1374],[5,426],[53,4872],[7,665],[57,1088],[4,191],[31,2484],[47,943],[9,191],[45,892],[43,3539],[45,929],[65,1293],[3,79],[62,4820],[56,3808],[6,487],[7,151],[17,1454],[29,602],[21,2158],[13,966],[37,3341],[1,45],[47,3650],[26,1407],[21,1559],[28,2290],[1,25],[47,949],[1,20],[56,5841],[63,6479],[17,1207],[3,246],[71,7532],[1,95],[63,4449],[17,1111],[1,19],[57,5012],[2,187],[63,5040],[29,2263],[4,365],[72,8436],[36,2498],[68,4911],[1,51],[8,412],[18,411],[1,20],[5,353],[35,1655],[71,7283],[19,1495],[57,2258],[56,4093],[20,434],[28,543],[44,2265],[72,8306],[1,93],[2,104],[2,109],[4,285],[23,454],[11,484],[35,2442],[55,1140],[62,7159],[47,4536],[26,1908],[8,438],[41,3089],[11,202],[10,857],[10,492],[71,1672],[63,6536],[8,446],[4,184],[46,4630],[15,1346],[25,2029],[7,344],[72,7898],[53,3046],[5,392],[1,49],[21,2254],[29,535],[12,224],[19,1376],[12,594],[68,1378],[30,2680],[50,4304],[43,2342],[72,7346],[17,1071],[2,97],[45,4192],[72,4575],[8,564],[27,805],[16,1391],[56,4261],[51,4473],[51,1529],[26,2089],[3,197],[71,5140],[1,90],[1,21],[72,8033],[40,1716],[28,1655],[47,4065],[62,2346],[28,2626],[25,1952],[68,5763],[36,1267],[1,69],[1,45],[22,472],[32,2954],[27,1894],[51,3121],[49,3472],[23,1677],[2,35],[6,124],[2,39],[71,1813],[42,3944],[4,215],[2,44],[18,358],[6,171],[2,185],[1,96],[14,1044],[30,1562],[27,2210],[9,714],[17,1166],[29,2830],[33,2990],[66,7384],[2,165],[45,2320],[15,309],[8,607],[10,914],[6,129],[53,4921],[1,45],[72,6735],[65,7246],[72,7790],[5,478],[67,5798],[71,5154],[52,2276],[70,5222],[35,3528],[31,1520],[1,94],[47,4042],[71,7904],[72,6369],[28,2434],[16,1449],[72,1751],[70,5264],[30,2624],[23,1222],[63,6110],[2,139],[1,54],[3,293],[1,87],[68,1396],[43,2907],[1,51],[1,19],[3,274],[23,1868],[7,481],[67,5884],[9,530],[13,357],[8,366],[52,4327],[48,4445],[33,641],[72,1779],[17,1323],[70,8152],[48,3545],[72,7286],[5,375],[20,1641],[1,50],[6,218],[72,8405],[35,739],[24,453],[34,2004],[24,2283],[27,1499],[3,189],[12,1000],[61,1552],[6,434],[47,3826],[19,1932],[4,221],[1,20],[22,2157],[2,132],[24,2231],[6,355],[26,1190],[10,1038],[60,1205],[24,1559],[39,1971],[71,6224],[19,1687],[22,413],[16,1483],[40,855],[1,20],[8,760],[55,3132],[55,3617],[1,43],[61,3779],[46,1489],[61,5527],[29,655],[10,187],[3,271],[12,1133],[68,5647],[9,296],[26,2515],[4,208],[69,4578],[12,356],[15,1400],[1,85],[62,1297],[60,3582],[47,3866],[5,114],[1,85],[29,2516],[45,4634],[31,3144],[51,4019],[66,4859],[2,116],[63,1209],[72,6689],[50,5348],[22,1049],[1,45],[17,1607],[6,495],[26,684],[45,4369],[60,3603],[71,7383],[46,3255],[40,3707],[2,179],[25,547],[32,2619],[63,3708],[1,44],[3,92],[32,2202],[18,392],[70,7842],[1,70],[5,420],[12,246],[2,194],[65,7082],[50,5190],[24,2542],[42,4323],[12,224],[7,673],[9,770],[31,2641],[29,1696],[37,695],[2,33],[72,6786],[13,1029],[1,44],[61,5321],[23,1284],[70,3370],[16,1213],[5,250],[2,38],[1,44]];
const CHY=ORG,CHN=BLUE,MEANC=YEL,MEDC=PINK;
/* simple statistics on arrays */
const st10={mean:a=>a.reduce((x,y)=>x+y,0)/a.length,
  median:a=>{const b=[...a].sort((x,y)=>x-y),m=b.length>>1;return b.length%2?b[m]:(b[m-1]+b[m])/2},
  r:(xs,ys)=>{const mx=st10.mean(xs),my=st10.mean(ys);let sxy=0,sx=0,sy=0;xs.forEach((x,i)=>{sxy+=(x-mx)*(ys[i]-my);sx+=(x-mx)**2;sy+=(ys[i]-my)**2});return sxy/Math.sqrt(sx*sy)}};
const gauss10=r=>{const u=Math.max(r(),1e-9),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)};
INIT[10]=function(){
  /* node in its four states */
  (function(){
    const g=el('div','multi');$('#b10node').append(g);
    const st=[['Non configurato','red','In attesa di configurazione o di dati.'],['Configurato','yel','Pronto per l\'esecuzione.'],['Eseguito','grn','Risultati disponibili a valle.'],['Errore','err','L\'esecuzione è fallita.']];
    st.forEach(([t,k,n])=>{
      let s=tx(90,20,'Row Filter',{s:13,f:'#ddd'});
      s+='<path d="M28 52l10 6l-10 6z" fill="#000" stroke="#bbb" stroke-width="1.5"/><path d="M142 52l10 6l-10 6z" fill="#000" stroke="#bbb" stroke-width="1.5"/>';
      s+=line(10,58,28,58,'#777',1.5)+line(152,58,170,58,'#777',1.5);
      s+=rect(60,30,60,56,'#FFD94A','#000',' rx="8"')+line(72,46,108,46,'#000',3)+line(72,58,100,58,'#000',3)+line(72,70,92,70,'#000',3);
      s+=rect(56,96,68,22,'#1b1b1b','#555',' rx="11"');
      const on={red:RED,yel:YEL,grn:GRN};
      if(k==='err'){s+='<circle cx="90" cy="107" r="8" fill="'+RED+'"/>'+line(86,103,94,111,'#000',2)+line(94,103,86,111,'#000',2)}
      else ['red','yel','grn'].forEach((c,i)=>{s+='<circle cx="'+(70+i*20)+'" cy="107" r="6.5" fill="'+(c===k?on[c]:'#333')+'"/>'});
      s+=tx(16,46,'in',{s:12,f:GRAY,a:'start'})+tx(164,46,'out',{s:12,f:GRAY,a:'end'});
      cell(g,t,s,180,126,'Nodo: '+t,n);
    });
  })();
  /* workflow of the lesson */
  (function(){
    let s='<defs>'+arrowDef('b10ar','#888')+'</defs>';
    const src=[70,190];
    const nd=[['Statistics','posizione, variabilità, forma',BLUE],['Histogram','distribuzione della permanenza',BLUE],['Crosstab','tabella di contingenza, χ², V di Cramér',YEL],['Scatter Plot','permanenza e spesa totale',YEL],['Linear Correlation','matrice di r e test t',YEL],['Box Plot','permanenza per abbandono',YEL],['One-way ANOVA','permanenza per contratto, test F',YEL]];
    nd.forEach(([n,q,c],i)=>{const y=34+i*52,x=330;
      s+='<path d="M'+(src[0]+30)+' '+src[1]+' C 200 '+src[1]+', 230 '+y+', '+(x-34)+' '+y+'" fill="none" stroke="#888" stroke-width="1.4" marker-end="url(#b10ar)"/>';
      s+=rect(x-26,y-18,36,36,c,'#000',' rx="6"')+tx(x+24,y-3,n,{s:14,f:'#fff',a:'start'})+tx(x+24,y+14,q,{s:12.5,f:GRAY,a:'start'})});
    s+=rect(src[0]-30,src[1]-24,60,48,'#ccc','#000',' rx="7"')+tx(src[0],src[1]+44,'CSV Reader',{s:14,f:'#fff'})+tx(src[0],src[1]+61,'telco_customer_churn.csv',{s:11.5,f:GRAY});
    s+=line(src[0]-14,src[1]-8,src[0]+14,src[1]-8,'#000',2.5)+line(src[0]-14,src[1],src[0]+14,src[1],'#000',2.5)+line(src[0]-14,src[1]+8,src[0]+6,src[1]+8,'#000',2.5);
    svgBox($('#b10wf'),640,390,s,'Workflow della lezione 10','40rem');
  })();
  /* data types tree */
  (function(){
    let s='';const b=(x,y,w,t,c,o)=>rect(x-w/2,y-16,w,32,'#111',c,' rx="6"')+tx(x,y+5,t,{s:o||14,f:c});
    s+=b(360,24,120,'Dati','#fff');
    s+=line(360,40,180,72,'#666')+line(360,40,540,72,'#666');
    s+=b(180,88,190,'Quantitativi (numerici)',BLUE,13.5)+b(540,88,190,'Qualitativi (categorici)',PINK,13.5);
    [[90,180,BLUE,'Discreti'],[270,180,BLUE,'Continui'],[450,540,PINK,'Nominali'],[630,540,PINK,'Ordinali']].forEach(([x,px,c,t])=>{s+=line(px,104,x,136,'#666')+b(x,152,140,t,c)});
    const ex=[[90,['n. di stanze,','prodotti acquistati'],'tenure (mesi, 0-72)'],[270,['vendite, reddito,','spesa mensile'],'MonthlyCharges ($)'],[450,['genere, metodo di','pagamento, regione'],'gender, PaymentMethod'],[630,['durata del contratto,','istruzione, voto 1-5'],'Contract']];
    ex.forEach(([x,l,t])=>{s+=tx(x,192,l[0],{s:12.5,f:'#ccc'})+tx(x,208,l[1],{s:12.5,f:'#ccc'})+tx(x,236,t,{s:12.5,f:'#fff',w:600})});
    svgBox($('#b10types'),720,250,s,'Tipi di dati','44rem');
  })();
  /* measurement levels staircase */
  (function(){
    let s='';const L=[['NOMINALE','categorie senza ordine','=, ≠','moda, frequenze, χ²','#3d6f99'],['ORDINALE','categorie ordinate','+ <, >','+ mediana, percentili','#2c5a85'],['A INTERVALLI','differenze, nessuno zero vero','+ +, −','+ media, dev. standard, correlazione','#22476e'],['DI RAPPORTI','differenze, zero vero','+ ×, ÷','+ CV, rapporti, tassi di crescita','#173658']];
    s+=tx(468,18,'operazioni',{s:12.5,f:GRAY})+tx(540,18,'statistiche ammesse',{s:12.5,f:GRAY,a:'start'});
    L.forEach(([n,d,o,st_,c],i)=>{const x=10+i*40,y=30+i*58;s+=rect(x,y,300,46,c)+tx(x+12,y+20,n,{s:13.5,f:'#fff',w:600,a:'start'})+tx(x+12,y+37,d,{s:12.5,f:'#dfe9f2',a:'start'});
      s+=tx(468,y+28,o,{s:14,f:'#fff'})+tx(540,y+28,st_,{s:13,f:'#ddd',a:'start'})});
    svgBox($('#b10levels'),760,262,s,'Livelli di misura','46rem');
  })();
  /* tenure histogram */
  (function(){
    const H=[1371,698,568,479,453,423,364,384,416,404,450,1033];let s='';const L=60,R=700,T=20,B=250,X=v=>L+v/72*(R-L),Y=v=>B-v/1500*(B-T);
    [0,500,1000,1500].forEach(v=>{s+=line(L,Y(v),R,Y(v),'#262626',1)+tx(L-8,Y(v)+4,fi(v,0),{s:12.5,f:GRAY,a:'end'})});
    H.forEach((v,i)=>{s+=rect(X(i*6)+1.5,Y(v),X(6)-X(0)-3,B-Y(v),'#9a9a9a')+tx(X(i*6+3),Y(v)-6,fi(v,0),{s:11.5,f:'#ddd'})});
    for(let v=0;v<=72;v+=12)s+=tx(X(v),B+18,String(v),{s:12.5,f:GRAY});
    s+=line(L,B,R,B,'#777',1.2);
    s+=line(X(32.4),T,X(32.4),B,MEANC,2)+lbl(X(32.4)+6,T+60,'media 32,4',MEANC,{a:'start',s:13})+line(X(29),T,X(29),B,MEDC,2,' stroke-dasharray="6 4"')+lbl(X(29)-6,T+60,'mediana 29',MEDC,{a:'end',s:13});
    s+=tx((L+R)/2,B+38,'mesi di permanenza (tenure)',{s:13,f:GRAY})+tx(16,(T+B)/2,'clienti',{s:13,f:GRAY,x:' transform="rotate(-90 16 '+(T+B)/2+')"'});
    svgBox($('#b10hist'),720,300,s,'Istogramma dei mesi di permanenza','44rem');
  })();
  /* mean vs median on three scales */
  (function(){
    let s='';const rows=[['tenure (mesi)',0,72,32.4,29,0],['MonthlyCharges ($)',18.25,118.75,64.8,70.4,1],['TotalCharges ($)',18.8,8684.8,2283,1397,0]];const L=40,R=680;
    rows.forEach(([n,lo,hi,mn,md,d],k)=>{const y=58+k*86,X=v=>L+(v-lo)/(hi-lo)*(R-L);
      s+=tx(L,y-36,n,{s:13.5,f:'#ddd',a:'start'})+line(L,y,R,y,'#666',1.5)+tx(L,y+20,fi(lo,d===1?2:1),{s:12,f:GRAY})+tx(R,y+20,fi(hi,d===1?2:1),{s:12,f:GRAY});
      const dx=X(mn)-X(md),near=Math.abs(dx)<70;
      s+='<circle cx="'+X(md)+'" cy="'+y+'" r="7" fill="'+MEDC+'"/><circle cx="'+X(mn)+'" cy="'+y+'" r="7" fill="none" stroke="'+MEANC+'" stroke-width="3"/>';
      const am=mn>md?'start':'end',ad=mn>md?'end':'start',om=mn>md?10:-10;
      s+=lbl(X(mn)+om,y-13,'media '+fi(mn,1),MEANC,{a:am,s:13})+lbl(X(md)-om,y-13,'mediana '+fi(md,1),MEDC,{a:ad,s:13});
    });
    svgBox($('#b10mm'),720,284,s,'Media e mediana di tre variabili','44rem');
  })();
  /* skewness: three simulated densities */
  (function(){
    const t=el('div','trio');$('#b10shape').append(t);
    const mk=(f,title,label,note)=>{const N=240,xs=[],ys=[];for(let i=0;i<=N;i++){const x=i/N;xs.push(x);ys.push(f(x))}
      const tot=ys.reduce((a,b)=>a+b,0),mean=xs.reduce((a,x,i)=>a+x*ys[i],0)/tot;let acc=0,med=0;for(let i=0;i<=N;i++){acc+=ys[i];if(acc>=tot/2){med=xs[i];break}}
      const mx=Math.max(...ys),X=x=>16+x*228,Y=y=>140-y/mx*118;let d='M'+X(0)+' 140';xs.forEach((x,i)=>d+=' L'+X(x).toFixed(1)+' '+Y(ys[i]).toFixed(1));d+=' L'+X(1)+' 140Z';
      let s='<path d="'+d+'" fill="rgba(255,255,255,.12)" stroke="#ddd" stroke-width="2"/>'+line(16,140,244,140,'#666',1.2);
      s+=line(X(mean),20,X(mean),140,MEANC,2.2)+line(X(med),20,X(med),140,MEDC,2.2,' stroke-dasharray="5 4"');
      cell(t,title,s,260,150,label,note)};
    const gam=(x,a,b)=>x<=0?0:Math.pow(x,a-1)*Math.exp(-x/b);
    mk(x=>gam(1-x,2.2,.12),'Asimmetria negativa','Coda a sinistra','<span style="color:var(--yellow)">media</span> &lt; <span style="color:var(--pink)">mediana</span>');
    mk(x=>Math.exp(-((x-.5)**2)/(2*.12*.12)),'Simmetrica','Simmetrica','<span style="color:var(--yellow)">media</span> = <span style="color:var(--pink)">mediana</span>');
    mk(x=>gam(x,2.2,.12),'Asimmetria positiva','Coda a destra','<span style="color:var(--yellow)">media</span> &gt; <span style="color:var(--pink)">mediana</span>');
  })();
  /* row vs column percentages */
  (function(){
    const duo=el('div','duo');$('#b10pct').append(duo);
    const C=[['Mensile',2220,1655],['Un anno',1307,166],['Due anni',1647,48]];
    let a='';C.forEach(([n,no,yes],i)=>{const y=26+i*58,tot=no+yes,w=220,wy=yes/tot*w;
      a+=tx(10,y+18,n,{s:13,f:'#ddd',a:'start'})+rect(90,y,w-wy,28,CHN)+rect(90+w-wy,y,wy,28,CHY)+tx(90+w+8,y+19,fi(yes/tot*100,1)+'%',{s:13.5,f:CHY,a:'start',w:600})});
    a+=rect(90,200,12,12,CHN)+tx(108,211,'resta',{s:12.5,f:'#ddd',a:'start'})+rect(160,200,12,12,CHY)+tx(178,211,'se ne va',{s:12.5,f:'#ddd',a:'start'});
    cell(duo,'Per riga: il tasso di abbandono',a,360,220,'Percentuali per riga','Dentro ogni contratto, quanti <b>se ne vanno</b>.');
    let b='';const cs=['#e6e6e6','#9a9a9a','#555'];const grp=[['se ne va',[1655,166,48]],['resta',[2220,1307,1647]]];
    grp.forEach(([n,v],k)=>{const x=70+k*150,tot=v[0]+v[1]+v[2],H=170;let y=24;
      b+=tx(x+35,16,n,{s:13,f:k?CHN:CHY});
      v.forEach((c,j)=>{const h=c/tot*H;b+=rect(x,y,70,h,cs[j],'#000');if(h>16)b+=tx(x+35,y+h/2+5,fi(c/tot*100,1)+'%',{s:12.5,f:j<2?'#000':'#fff'});y+=h})});
    [['mensile',cs[0]],['un anno',cs[1]],['due anni',cs[2]]].forEach(([n,c],j)=>{b+=rect(14+j*104,204,12,12,c)+tx(32+j*104,215,n,{s:12.5,f:'#ddd',a:'start'})});
    cell(duo,'Per colonna: chi sono i clienti persi',b,360,220,'Percentuali per colonna','Fra chi se ne va, l\'88,6% era <b>mensile</b>.');
  })();
  /* observed vs expected */
  (function(){
    const duo=el('div','duo');$('#b10chi').append(duo);
    const draw=(rows,title,note,lab)=>{let s='';const H=170,M=1700,Y=v=>190-v/M*H,w=40,gap=rows.length===2?120:90,x0=rows.length===2?90:50;
      [0,500,1000,1500].forEach(v=>{s+=line(30,Y(v),330,Y(v),'#222',1)+tx(26,Y(v)+4,fi(v,0),{s:11.5,f:GRAY,a:'end'})});
      rows.forEach(([n,o,e],i)=>{const x=x0+i*gap;s+=rect(x,Y(o),w,190-Y(o),CHY)+rect(x+w+6,Y(e),w,190-Y(e),'none',TEAL,' stroke-dasharray="5 3" stroke-width="2"');
        s+=tx(x+w/2,Y(o)-5,fi(o,0),{s:11.5,f:CHY})+tx(x+w*1.5+6,Y(e)-5,fi(e,0),{s:11.5,f:TEAL})+tx(x+w+3,208,n,{s:12.5,f:'#ddd'})});
      s+=line(30,190,330,190,'#777',1.2);
      cell(duo,title,s,340,216,lab,note)};
    draw([['Donne',939,925.6],['Uomini',930,943.4]],'Genere: se ne vanno','χ² = 0,5: <b>quasi nessuna distanza</b> dall\'indipendenza.','Osservati e attesi per genere');
    draw([['Mensile',1655,1028.3],['Un anno',166,390.9],['Due anni',48,449.8]],'Contratto: se ne vanno','χ² = 1.184,6: <b>lontanissimi</b> dall\'indipendenza.','Osservati e attesi per contratto');
    const lg=el('div','cellnote');lg.innerHTML='<span style="color:var(--orange)">■</span> osservati &nbsp; <span style="color:var(--teal)">⬚</span> attesi con indipendenza';$('#b10chi').append(lg);
  })();
  /* Cramér's V */
  (function(){
    const V=[['Contract',41],['TechSupport',34],['InternetService',32],['PaymentMethod',30],['PaperlessBilling',19],['Partner',15],['gender',1]];let s='';const L=150,R=640,X=v=>L+v/50*(R-L);
    s+=rect(L,14,X(10)-L,V.length*38+4,'rgba(255,255,255,.03)')+rect(X(10),14,X(25)-X(10),V.length*38+4,'rgba(255,255,255,.06)')+rect(X(25),14,R-X(25),V.length*38+4,'rgba(255,255,255,.1)');
    [[5,'bassa'],[17.5,'media'],[37.5,'alta']].forEach(([v,t])=>s+=tx(X(v),V.length*38+36,'forza '+t,{s:12.5,f:GRAY}));
    V.forEach(([n,v],i)=>{const y=20+i*38;s+=tx(L-10,y+18,n,{s:13,f:'#ddd',a:'end'})+rect(L,y+4,Math.max(2,X(v)-L),22,v>25?'#fff':v>=10?'#aaa':'#666')+tx(X(v)+8,y+20,v+'%',{s:13.5,f:'#fff',a:'start',w:600})});
    [10,25].forEach(v=>s+=line(X(v),14,X(v),V.length*38+18,'#555',1,' stroke-dasharray="4 4"')+tx(X(v),V.length*38+52,v+'%',{s:12,f:GRAY}));
    svgBox($('#b10cram'),680,V.length*38+62,s,'V di Cramér con l\'abbandono','42rem');
  })();
  /* scatter tenure vs total charges */
  (function(){
    let s='';const L=70,R=690,T=16,B=300,X=v=>L+v/72*(R-L),Y=v=>B-v/9000*(B-T);
    const mx=st10.mean(TELSC.map(p=>p[0])),my=st10.mean(TELSC.map(p=>p[1]));
    s+=rect(X(mx),T,R-X(mx),Y(my)-T,'rgba(131,193,103,.10)')+rect(L,Y(my),X(mx)-L,B-Y(my),'rgba(131,193,103,.10)');
    [0,3000,6000,9000].forEach(v=>{s+=line(L,Y(v),R,Y(v),'#222',1)+tx(L-8,Y(v)+4,fi(v,0),{s:12.5,f:GRAY,a:'end'})});
    for(let v=0;v<=72;v+=12)s+=tx(X(v),B+18,String(v),{s:12.5,f:GRAY});
    TELSC.forEach(([a,b])=>s+='<circle cx="'+X(a).toFixed(1)+'" cy="'+Y(b).toFixed(1)+'" r="3.2" fill="'+BLUE+'" fill-opacity=".75"/>');
    s+=line(X(mx),T,X(mx),B,'#ddd',1.3,' stroke-dasharray="6 4"')+line(L,Y(my),R,Y(my),'#ddd',1.3,' stroke-dasharray="6 4"');
    s+=lbl(X(mx)+6,T+14,'media permanenza',null,{a:'start',s:12.5})+lbl(R-4,Y(my)-8,'media spesa totale',null,{a:'end',s:12.5});
    s+=line(L,B,R,B,'#777',1.2)+line(L,T,L,B,'#777',1.2)+tx((L+R)/2,B+38,'mesi di permanenza (tenure)',{s:13,f:GRAY})+tx(16,(T+B)/2,'spesa totale ($)',{s:13,f:GRAY,x:' transform="rotate(-90 16 '+(T+B)/2+')"'});
    s+=lbl(L+12,T+20,'r del campione = '+fi(st10.r(TELSC.map(p=>p[0]),TELSC.map(p=>p[1])),2),'#fff',{a:'start',s:13.5});
    svgBox($('#b10scat'),720,350,s,'Permanenza e spesa totale','44rem');
  })();
  /* simulated correlations */
  (function(){
    const t=el('div','trio');$('#b10corr').append(t);const r=lcg(1010);
    const mk=(gen,title,label)=>{const P=[];for(let i=0;i<60;i++)P.push(gen());const xs=P.map(p=>p[0]),ys=P.map(p=>p[1]);
      const mnx=Math.min(...xs),mxx=Math.max(...xs),mny=Math.min(...ys),mxy=Math.max(...ys),X=v=>20+(v-mnx)/(mxx-mnx)*210,Y=v=>136-(v-mny)/(mxy-mny)*116;
      let s=line(14,142,240,142,'#666',1.2)+line(14,142,14,12,'#666',1.2)+tx(236,156,'X',{s:12,f:GRAY,a:'end'})+tx(8,20,'Y',{s:12,f:GRAY});
      P.forEach(([a,b])=>s+='<circle cx="'+X(a).toFixed(1)+'" cy="'+Y(b).toFixed(1)+'" r="3.4" fill="'+BLUE+'"/>');
      cell(t,title,s,250,160,label,'r = '+fi(st10.r(xs,ys),2))};
    mk(()=>{const x=r()*10;return [x,x+gauss10(r)*1.3]},'Positiva forte','Correlazione positiva');
    mk(()=>{const x=r()*10;return [x,-x+gauss10(r)*3.2]},'Negativa','Correlazione negativa');
    mk(()=>{const x=r()*10-5;return [x,x*x+gauss10(r)*1.4]},'Forte ma non lineare','Relazione a parabola');
  })();
  /* box plot tenure by churn */
  (function(){
    let s='';const L=110,R=690,X=v=>L+v/72*(R-L);
    const G=[['Churn = No',[0,15,38,61,72],37.6,CHN,50],['Churn = Yes',[1,2,10,29,72],18.0,CHY,140]];
    for(let v=0;v<=72;v+=12){s+=line(X(v),20,X(v),180,'#222',1)+tx(X(v),198,String(v),{s:12.5,f:GRAY})}
    G.forEach(([n,q,m,c,y])=>{s+=tx(L-12,y+5,n,{s:13,f:c,a:'end'})+line(X(q[0]),y,X(q[1]),y,'#bbb',1.5)+line(X(q[3]),y,X(q[4]),y,'#bbb',1.5)+line(X(q[0]),y-10,X(q[0]),y+10,'#bbb',1.5)+line(X(q[4]),y-10,X(q[4]),y+10,'#bbb',1.5);
      s+=rect(X(q[1]),y-20,X(q[3])-X(q[1]),40,'rgba(255,255,255,.06)',c,' stroke-width="2"')+line(X(q[2]),y-20,X(q[2]),y+20,'#fff',3)+'<circle cx="'+X(m)+'" cy="'+y+'" r="5.5" fill="'+MEANC+'"/>';
      s+=tx(X(q[2]),y-27,'mediana '+q[2],{s:12.5,f:'#fff'})});
    s+=tx((L+R)/2,222,'mesi di permanenza (tenure)',{s:13,f:GRAY});
    svgBox($('#b10box'),720,232,s,'Box plot della permanenza per abbandono','44rem');
  })();
  /* ANOVA: between vs within */
  (function(){
    const duo=el('div','duo');$('#b10anova').append(duo);const mus=[30,55,80];
    const mk=(sd,seed,title,label)=>{const r=lcg(seed),P=mus.map(m=>{const a=[];for(let i=0;i<12;i++)a.push(m+gauss10(r)*sd);return a});
      const all=P.flat(),gm=st10.mean(all),n=all.length,c=3;let ssb=0,ssw=0;P.forEach(a=>{const m=st10.mean(a);ssb+=a.length*(m-gm)**2;a.forEach(v=>ssw+=(v-m)**2)});
      const F=(ssb/(c-1))/(ssw/(n-c)),Y=v=>176-v/110*160;let s=line(20,Y(0),330,Y(0),'#555',1);
      P.forEach((a,g)=>{const x=70+g*100,m=st10.mean(a);a.forEach((v,i)=>s+='<circle cx="'+(x-22+(i%6)*9)+'" cy="'+Y(Math.max(2,Math.min(108,v))).toFixed(1)+'" r="3.6" fill="#ddd"/>');s+=line(x-32,Y(m),x+32,Y(m),MEANC,3)+tx(x,194,'gruppo '+(g+1),{s:12.5,f:GRAY})});
      cell(duo,title,s,340,202,label,'F = '+fi(F,1))};
    mk(5,77,'Poca variabilità dentro i gruppi','Gruppi compatti');
    mk(26,77,'Molta variabilità dentro i gruppi','Gruppi dispersi');
  })();
};
QZ['10a']=()=>[{q:'Hai collegato un nodo Statistics all\'uscita di un CSV Reader, ma non l\'hai ancora configurato né eseguito. Che luce mostra il semaforo del nodo Statistics?',o:['Verde: il nodo è collegato','Gialla: pronto per l\'esecuzione','Rossa: in attesa di configurazione o di dati','Croce rossa: errore'],a:2,
  e:'Un nodo appena aggiunto aspetta la configurazione o i dati in ingresso: luce rossa. Diventa giallo dopo la configurazione (F6) e verde dopo l\'esecuzione (F7).',h:'Il collegamento non basta: che cosa manca ancora?'}];
QZ['10b']=()=>[{q:'Il livello di soddisfazione di un cliente, espresso con un voto da 1 a 5, è una variabile...',o:['nominale: le categorie non hanno ordine','ordinale: c\'è un ordine, ma la distanza fra 4 e 5 non è definita','di rapporti: 4 è il doppio di 2','continua: può assumere qualsiasi valore'],a:1,
  e:'I voti sono ordinati, ma dicono solo quale categoria viene prima, non di quanto: è una variabile ordinale. Le slide la citano proprio come esempio di ordinale.',h:'Si può dire che un voto è migliore di un altro? E di quanto?'}];
QZ['10c']=()=>[{q:'Due variabili hanno media 64,8 e 2.283 e deviazione standard 30,1 e 2.267. Quale è relativamente più variabile?',o:['La prima, perché il suo CV è più alto','La seconda, con CV di circa 99% contro 46%','Sono ugualmente variabili','Non si può dire senza conoscere le unità di misura'],a:1,
  e:'CV = s / media × 100: 30,1 / 64,8 = 46% e 2.267 / 2.283 = 99%. Il CV è un numero puro, quindi il confronto ha senso anche fra grandezze diverse.',h:'Dividi ogni deviazione standard per la sua media.'}];
QZ['10d']=()=>[{q:'Con α = 5% un test dà p-value = 0,08. Che cosa concludi?',o:['Si rifiuta H₀','Non si rifiuta H₀','H₀ è dimostrata vera','Si commette sicuramente un errore di primo tipo'],a:1,
  e:'0,08 non è minore di 0,05, quindi non si rifiuta H₀. Non rifiutare non vuol dire dimostrare che H₀ è vera: i dati non bastano a escluderla.',h:'Confronta il p-value con α.'}];
QZ['10e']=()=>[{q:'Un manager legge che «l\'88,6% dei clienti persi aveva un contratto mensile» e conclude che chi ha un contratto mensile se ne va quasi sempre. Che cosa non va?',o:['Niente, le due frasi dicono la stessa cosa','L\'88,6% è una percentuale per colonna (la composizione dei clienti persi); il tasso di abbandono dei mensili è la percentuale per riga, 42,7%','Il dato giusto sarebbe il 55%','Bisognerebbe usare la V di Cramér'],a:1,
  e:'La percentuale per colonna dice chi sono i clienti persi; quella per riga dice quanti se ne vanno dentro ogni contratto. Fra i mensili se ne va il 42,7%, non quasi tutti.',h:'Su quale totale è calcolato l\'88,6%?'}];
QZ['10f']=()=>[{q:'Misuri la spesa in centesimi invece che in dollari. Che cosa succede a covarianza e correlazione con la permanenza?',o:['Cambiano tutte e due','La covarianza diventa 100 volte più grande, la correlazione resta uguale','Restano uguali tutte e due','La correlazione diventa 100 volte più grande'],a:1,
  e:'La covarianza dipende dalle unità di misura; r la divide per il prodotto delle deviazioni standard, che cambiano dello stesso fattore, quindi resta uguale.',h:'Quale dei due indici è standardizzato?'}];
QZ['10g']=()=>[{q:'Tre gruppi hanno medie molto diverse, ma dentro ogni gruppo i valori sono dispersissimi. Che cosa ti aspetti dall\'ANOVA?',o:['F grande, perché le medie sono diverse','F piccolo, perché la variabilità dentro i gruppi è grande rispetto a quella fra i gruppi','F = 0','Non si può fare l\'ANOVA con tre gruppi'],a:1,
  e:'F = MSB / MSW: una variabilità dentro i gruppi (MSW) grande abbassa F, come nel secondo riquadro della figura.',h:'Che cosa c\'è al denominatore di F?'}];
QZ['10']=()=>[
  {q:'Per i 7.043 clienti la tabella genere per abbandono ha totali di riga 3.488 (donne) e 3.555 (uomini), e 1.869 clienti persi in tutto. Quante donne perse ti aspetteresti se genere e abbandono fossero indipendenti?',o:['939','circa 926','circa 943','934,5'],a:1,
   e:'E = totale di riga × totale di colonna / N = 3.488 × 1.869 / 7.043 ≈ 925,6. Le osservate sono 939: molto vicine, da cui il χ² piccolo.',h:'Usa la formula della frequenza attesa.'},
  {q:'Con χ² = 1.184,6, N = 7.043 e una tabella 3 × 2, quanto vale la V di Cramér e come si legge?',o:['0,17: forza media','0,41: forza alta','0,84: quasi perfetta','1.184,6: non si può normalizzare'],a:1,
   e:'k è il minore fra righe e colonne, 2, quindi k − 1 = 1: V = √(1.184,6 / 7.043) = √0,168 ≈ 0,41, sopra la soglia del 25%: forza alta.',h:'k − 1 vale 1 in una tabella con due colonne.'},
  {q:'Qual è l\'IQR della permanenza dei clienti persi, se il loro 25° percentile è 2 mesi e il 75° è 29?',o:['10 mesi','27 mesi','71 mesi','29 mesi'],a:1,
   e:'IQR = 75° percentile − 25° percentile = 29 − 2 = 27 mesi. 10 è la mediana, 71 il campo di variazione (72 − 1).',h:'IQR non usa né il minimo né il massimo.'},
  {q:'Vuoi sapere se la spesa mensile media è diversa fra i quattro metodi di pagamento. Quale strumento scegli?',o:['Tabella di contingenza e χ²','Correlazione lineare e test t','ANOVA a un fattore e test F','V di Cramér'],a:2,
   e:'Una variabile quantitativa (spesa mensile) e una qualitativa (metodo di pagamento): si confrontano le medie con l\'ANOVA.',h:'Di che tipo sono le due variabili?'},
  {q:'Un analista trova r = 0,02 fra la temperatura esterna e il consumo di energia di un edificio e conclude che non c\'è alcun legame. Che cosa gli diresti?',o:['Ha ragione: r vicino a zero vuol dire nessuna relazione','r misura solo il legame lineare: il consumo potrebbe salire sia col freddo sia col caldo, una relazione a U; va guardato il diagramma','Dovrebbe calcolare la covarianza, che è più affidabile','Deve usare il test χ²'],a:1,
   e:'Un legame forte ma non lineare, come una parabola, può dare r ≈ 0. Per questo le slide insistono: guarda sempre il diagramma di dispersione.',h:'Ricorda il terzo riquadro della figura sulle correlazioni.'},
  {q:'Su 7.043 clienti un test trova una differenza significativa (p &lt; 0,001) fra due gruppi, ma la differenza fra le medie è di pochi giorni di permanenza. Come la leggi?',o:['È una scoperta importante, perché il p-value è piccolissimo','Con campioni molto grandi quasi ogni differenza è significativa: conta anche quanto è grande, e qui è trascurabile','Il test è sbagliato','Bisogna aumentare α'],a:1,
   e:'Le slide lo dicono nelle ipotesi dell\'ANOVA: con campioni molto grandi quasi ogni differenza diventa significativa, quindi si guarda sempre anche l\'ampiezza della differenza.',h:'Il p-value dice se un effetto esiste, non quanto è grande.'}
];
MAPPA[10]={c:'Che cosa dicono i dati prima di qualsiasi modello?',r:[
  {t:'KNIME',c:BLUE,v:['Nodi collegati in un workflow','Quattro stati: rosso, giallo, verde, errore','Configura con F6, esegui con F7','Metanodi e componenti; file .knwf e .knar']},
  {t:'Tipi di variabile',c:PINK,v:['Qualitative: nominali, ordinali','Quantitative: discrete, continue','Scale a intervalli e di rapporti','Ogni livello eredita le statistiche di sopra']},
  {t:'Una variabile',c:YEL,v:['Frequenze e istogramma','Media, mediana, moda','Range, IQR, deviazione standard, CV','Asimmetria e curtosi']},
  {t:'Test d\'ipotesi',c:ORG,v:['H₀ contro H₁','Errori di primo e secondo tipo','p-value minore di α: si rifiuta H₀','Grandi campioni: guarda anche l\'ampiezza']},
  {t:'Due qualitative',c:GRN,v:['Tabella di contingenza','Percentuali nella direzione dell\'indipendente','χ²: osservati contro attesi','V di Cramér: contratto 41%']},
  {t:'Quantitative',c:TEAL,v:['Scatter plot, covarianza, r','r = 0 non vuol dire nessun legame','Confronto fra medie: box plot','ANOVA: F = MSB / MSW']}]};
