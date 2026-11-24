/* Lezione 13: alberi di decisione, random forest, gradient boosting (soggiorni, target high_value) */
const HIC=GRN,CHU=ORG,STY=BLUE,BOOC=PINK;
/* a tree node box: x,y centre; title; share bar */
function node13(x,y,w,t1,t2,share,o){o=o||{};let s=rect(x-w/2,y-28,w,56,'#111',o.leaf?'#888':'#ddd',' rx="6"'+(o.leaf?' stroke-dasharray="4 3"':''));
  s+=tx(x,y-10,t1,{s:12.5,f:o.leaf?GRAY:'#ddd'})+tx(x,y+7,t2,{s:13,f:'#fff',w:600});
  if(share!==undefined)s+=rect(x-w/2+10,y+14,w-20,7,'#333')+rect(x-w/2+10,y+14,(w-20)*share,7,HIC);return s}
INIT[13]=function(){
  /* anatomy */
  (function(){
    let s='';const E=(x1,y1,x2,y2,t,a)=>line(x1,y1,x2,y2,'#777',1.5)+lbl((x1+x2)/2+(a||0),(y1+y2)/2+4,t,'#ccc',{s:12.5});
    s+=E(360,62,180,150,'notti ≤ 4,5',-40)+E(360,62,540,150,'notti &gt; 4,5',40)+E(180,206,90,292,'≤ 3,5',-24)+E(180,206,270,292,'&gt; 3,5',24);
    for(let k=0;k<6;k++)s+=line(540,206,430+k*44,292,'#555',1);
    s+=node13(360,34,170,'RADICE · 51.370','High 20,4%',.204)+node13(180,178,170,'NODO · 39.844','High 7,5%',.075)+node13(540,178,170,'NODO · 11.526','High 65,0%',.65);
    s+=node13(90,320,150,'FOGLIA','High 3,0%',.03,{leaf:1})+node13(270,320,150,'FOGLIA','High 26,3%',.263,{leaf:1});
    s+=rect(410,292,260,56,'none','#555',' rx="6" stroke-dasharray="4 3"')+tx(540,316,'12 figli, uno per mese',{s:13,f:'#ccc'})+tx(540,334,'(arrival_date_month)',{s:12,f:GRAY});
    s+=rect(458,140,276,224,'none',YEL,' rx="10" stroke-dasharray="6 5"')+tx(724,382,'un sottoalbero',{s:12.5,f:YEL,a:'end'});
    svgBox($('#b13anat'),740,392,s,'Anatomia di un albero','46rem');
  })();
  /* churn example tree */
  (function(){
    let s='';const N=(x,y,c,st,leaf,lab)=>{const w=120;let r=rect(x-w/2,y-24,w,48,'#111',leaf?'#888':'#ddd',' rx="6"'+(leaf?' stroke-dasharray="4 3"':''));
      r+=tx(x,y-6,'<tspan style="fill:'+CHU+'">'+c+' se ne vanno</tspan>',{s:12.5})+tx(x,y+12,'<tspan style="fill:'+STY+'">'+st+' restano</tspan>',{s:12.5});
      const tot=c+st;r+=rect(x-w/2+8,y+16,(w-16)*c/tot,5,CHU)+rect(x-w/2+8+(w-16)*c/tot,y+16,(w-16)*st/tot,5,STY);if(lab)r+=tx(x,y+40,lab,{s:12,f:lab==='se ne va'?CHU:STY,w:600});return r};
    const E=(x1,y1,x2,y2,t,dx)=>line(x1,y1,x2,y2,'#777',1.4)+lbl((x1+x2)/2+(dx||0),(y1+y2)/2+4,t,'#ccc',{s:12.5});
    s+=E(360,52,220,124,'tecnologia vecchia',-50)+E(360,52,560,124,'nuova',30)+E(220,148,120,224,'≤ 2,3 anni',-40)+E(220,148,330,224,'&gt; 2,3 anni',40)+E(120,248,60,324,'età ≤ 35',-30)+E(120,248,200,324,'&gt; 35',22);
    s+=N(360,30,50,50)+N(220,126,30,50)+N(560,126,20,0,1,'se ne va')+N(120,226,25,10)+N(330,226,5,40,1,'resta')+N(60,326,20,0,1,'se ne va')+N(200,326,5,10,1,'resta');
    svgBox($('#b13churn'),640,380,s,'Albero dei clienti che se ne vanno','40rem');
  })();
  /* Gini / entropy and split quality */
  (function(){
    const duo=el('div','duo');$('#b13gini').append(duo);
    let a='';const L=40,R=320,T=14,B=170,X=p=>L+p*(R-L),Y=v=>B-v*(B-T);
    [0,.5,1].forEach(v=>a+=line(L,Y(v),R,Y(v),'#1d1d1d',1)+tx(L-6,Y(v)+4,fi(v,1),{s:12,f:GRAY,a:'end'}));[0,.5,1].forEach(p=>a+=tx(X(p),B+16,fi(p,1),{s:12,f:GRAY}));
    const path=f=>{let d='';for(let i=0;i<=100;i++){const p=i/100;d+=(d?'L':'M')+X(p).toFixed(1)+' '+Y(f(p)).toFixed(1)}return d};
    const H=p=>p<=0||p>=1?0:-(p*Math.log2(p)+(1-p)*Math.log2(1-p)),G=p=>1-p*p-(1-p)*(1-p);
    a+='<path d="'+path(H)+'" fill="none" stroke="#fff" stroke-width="2.5"/><path d="'+path(p=>H(p)/2)+'" fill="none" stroke="#999" stroke-width="1.8" stroke-dasharray="5 4"/><path d="'+path(G)+'" fill="none" stroke="'+HIC+'" stroke-width="2.8"/>';
    a+=lbl(X(.5),Y(1)-4,'entropia',null,{s:12.5})+lbl(X(.5),Y(.5)+18,'Gini',HIC,{s:12.5})+line(L,B,R,B,'#777',1.2)+tx((L+R)/2,B+34,'quota p della prima classe',{s:12.5,f:GRAY});
    cell(duo,'Impurità di un nodo',a,340,210,'Gini ed entropia','Zero se il nodo è <b>puro</b>, massimo a p = 0,5.');
    const b=vbars11([['Radice|50 / 50',.5,'#9a9a9a'],['Tecnologia|30/50 · 20/0',.375,HIC],['Anni &gt; 2,3|35/20 · 15/30',.455,'#9a9a9a']],{max:.6,H:210,bot:44,fmt:v=>fi(v,3)});
    cell(duo,'Gini medio dopo il taglio',b,340,210,'Gini dei tagli possibili','Vince la tecnologia: <b>0,375</b>.');
  })();
  /* bias-variance targets */
  (function(){
    const g=el('div','multi');$('#b13bv').append(g);const r=lcg(1313);
    [['Bassa distorsione, bassa varianza',0,0,7,'l\'obiettivo'],['Bassa distorsione, alta varianza',0,0,26,'albero profondo'],['Alta distorsione, bassa varianza',24,-18,7,'troppo semplice'],['Alta distorsione, alta varianza',22,-16,26,'il caso peggiore']].forEach(([t,dx,dy,sd,n])=>{
      let s='';[64,46,28,12].forEach((rr,k)=>s+='<circle cx="80" cy="80" r="'+rr+'" fill="'+(k%2?'#1b1b1b':'#2a2a2a')+'" stroke="#444"/>');s+='<circle cx="80" cy="80" r="4" fill="'+YEL+'"/>';
      for(let i=0;i<12;i++){const x=80+dx+gauss10(r)*sd*.6,y=80+dy+gauss10(r)*sd*.6;s+='<circle cx="'+Math.max(10,Math.min(150,x)).toFixed(1)+'" cy="'+Math.max(10,Math.min(150,y)).toFixed(1)+'" r="3.6" fill="'+BOOC+'"/>'}
      cell(g,t,s,160,160,t,n)});
  })();
  /* bagging vs boosting */
  (function(){
    const duo=el('div','duo');$('#b13bag').append(duo);
    let a='<defs>'+arrowDef('b13a','#888')+'</defs>';[['campione 1',1190],['campione 2',1140],['campione 3',1170]].forEach(([n,v],i)=>{const x=60+i*110;
      a+=tx(x,20,n,{s:12,f:GRAY})+'<path d="M'+x+' 34l-26 40h52z" fill="none" stroke="#bbb" stroke-width="1.5"/>'+tx(x,66,'T'+(i+1),{s:13,f:'#fff'})+tx(x,96,fi(v,0)+' €',{s:13.5,f:'#fff',w:600})+line(x,104,170,150,'#666',1.2,' marker-end="url(#b13a)"')});
    a+=rect(90,154,160,34,'#111',HIC,' rx="6"')+tx(170,176,'media = 1.167 €',{s:14,f:HIC,w:600})+tx(170,210,'in parallelo, indipendenti',{s:12.5,f:GRAY});
    cell(duo,'Bagging: alberi in parallelo',a,340,220,'Bagging','Ogni albero prevede <b>l\'affitto</b>.');
    let b='<defs>'+arrowDef('b13b','#888')+'</defs>';const S=[['media',1418,''],['albero 1',1272.5,'−145,5'],['albero 2',1180,'−92,5'],['albero 3',1195.4,'+15,4']];
    S.forEach(([n,v,c],i)=>{const y=22+i*46;b+=tx(14,y+16,n,{s:12.5,f:'#ccc',a:'start'})+(c?tx(96,y+16,c,{s:13,f:BOOC,a:'start',w:600}):'')+tx(168,y+16,'→ '+fi(v,1).replace(/,0$/,'')+' €',{s:13.5,f:'#fff',a:'start',w:600})+tx(336,y+16,'errore '+fi(1160-v,1).replace(/,0$/,''),{s:11.5,f:GRAY,a:'end'});
      if(i<3)b+=line(60,y+22,60,y+42,'#666',1.2,' marker-end="url(#b13b)"')});
    b+=tx(170,212,'in sequenza: ogni albero impara l\'errore',{s:12.5,f:GRAY});
    cell(duo,'Boosting: alberi in sequenza',b,340,220,'Boosting','Ogni albero prevede <b>l\'errore che resta</b>.');
  })();
  /* boosting worked example, four panels */
  (function(){
    const g=el('div','multi');$('#b13boost').append(g);
    const xs=[750,800,850,900,950],ys=[1160,1200,1280,1450,2000];let F=xs.map(()=>1418);
    const steps=[null,925,825,925];const mse=a=>a.reduce((s,v,i)=>s+(ys[i]-v)**2,0)/5;
    steps.forEach((cut,k)=>{
      if(cut){const res=ys.map((y,i)=>y-F[i]);const L=xs.map((x,i)=>x<cut?i:-1).filter(i=>i>=0),R=xs.map((x,i)=>x>=cut?i:-1).filter(i=>i>=0);
        const ml=L.reduce((s,i)=>s+res[i],0)/L.length,mr=R.reduce((s,i)=>s+res[i],0)/R.length;F=F.map((f,i)=>f+(xs[i]<cut?ml:mr))}
      const X=x=>20+(x-725)/250*170,Y=v=>140-(v-1000)/1100*124;let s=line(14,140,196,140,'#666',1)+line(14,140,14,10,'#666',1);
      let d='';xs.forEach((x,i)=>{const x0=i?X((x+xs[i-1])/2):X(725),x1=i<4?X((x+xs[i+1])/2):X(975);d+=(d?'L':'M')+x0.toFixed(1)+' '+Y(F[i]).toFixed(1)+'L'+x1.toFixed(1)+' '+Y(F[i]).toFixed(1)});
      s+='<path d="'+d+'" fill="none" stroke="'+BOOC+'" stroke-width="2.6"/>';
      xs.forEach((x,i)=>s+=line(X(x),Y(ys[i]),X(x),Y(F[i]),'#666',1,' stroke-dasharray="2 2"')+'<circle cx="'+X(x)+'" cy="'+Y(ys[i])+'" r="4.5" fill="#fff"/>');
      if(cut)s+=line(X(cut),12,X(cut),140,YEL,1.2,' stroke-dasharray="4 3"')+tx(X(cut),10,'taglio '+cut,{s:11,f:YEL});
      cell(g,k?'Passo '+k:'Passo 0: la media',s,210,150,'Passo '+k,'MSE '+fi(Math.round(mse(F)),0));
    });
  })();
  /* sigmoid */
  (function(){
    let s='';const L=60,R=660,T=14,B=200,X=f=>L+(f+5)/10*(R-L),Y=p=>B-p*(B-T);
    [0,.5,1].forEach(v=>s+=line(L,Y(v),R,Y(v),'#1d1d1d',1)+tx(L-8,Y(v)+4,fi(v,1),{s:12,f:GRAY,a:'end'}));for(let f=-5;f<=5;f++)s+=tx(X(f),B+18,f<0?'−'+(-f):String(f),{s:12,f:GRAY});
    let d='';for(let i=0;i<=200;i++){const f=-5+i/20;d+=(d?'L':'M')+X(f).toFixed(1)+' '+Y(1/(1+Math.exp(-f))).toFixed(1)}s+='<path d="'+d+'" fill="none" stroke="'+BOOC+'" stroke-width="3"/>';
    [[-2,.12],[0,.5],[1.5,.82],[3,.95]].forEach(([f,p])=>s+=line(X(f),B,X(f),Y(p),'#555',1,' stroke-dasharray="3 3"')+'<circle cx="'+X(f)+'" cy="'+Y(p)+'" r="5.5" fill="#fff"/>'+lbl(X(f)+(f<0?-10:10),Y(p)+(f<0?-8:18),fi(p,2),'#fff',{a:f<0?'end':'start',s:13.5}));
    s+=line(L,B,R,B,'#777',1.2)+tx((L+R)/2,B+38,'punteggio F (somma degli alberi)',{s:13,f:GRAY})+tx(18,(T+B)/2,'P(High)',{s:13,f:GRAY,x:' transform="rotate(-90 18 '+(T+B)/2+')"'});
    svgBox($('#b13sig'),680,250,s,'Funzione logistica','42rem');
  })();
  /* results */
  (function(){
    const M=[['Albero',.810,.832,'#9a9a9a'],['Random forest',.844,.905,GRN],['Gradient boosting',.862,.894,PINK],['XGBoost',.850,.891,ORG]];let s='';const B=200,T=20,Y=v=>B-(v-.75)/.2*(B-T);
    [.75,.8,.85,.9,.95].forEach(v=>s+=line(50,Y(v),660,Y(v),'#1d1d1d',1)+tx(44,Y(v)+4,fi(v,2),{s:12,f:GRAY,a:'end'}));
    M.forEach(([n,r,p,c],i)=>{const x=80+i*148;s+=rect(x,Y(r),48,B-Y(r),c)+rect(x+56,Y(p),48,B-Y(p),c,null,' fill-opacity=".55"')+tx(x+24,Y(r)-6,fi(r,3),{s:12,f:'#fff'})+tx(x+80,Y(p)-6,fi(p,3),{s:12,f:'#fff'})+tx(x+52,B+18,n,{s:12.5,f:'#ddd'})+tx(x+24,B+34,'sens.',{s:11,f:GRAY})+tx(x+80,B+34,'prec.',{s:11,f:GRAY})});
    s+=line(50,B,660,B,'#777',1.2)+tx(660,12,'(l\'asse parte da 0,75)',{s:11.5,f:GRAY,a:'end'});
    svgBox($('#b13res'),680,246,s,'Sensibilità e precisione dei quattro modelli','42rem');
  })();
  /* importance */
  (function(){
    const duo=el('div','duo');$('#b13imp').append(duo);
    const hb=(rows,max,fmt,c)=>{let s='';rows.forEach(([n,v],i)=>{const y=8+i*25;s+=tx(152,y+15,n,{s:12,f:'#ddd',a:'end'})+rect(158,y+4,v/max*130,15,c)+tx(162+v/max*130,y+16,fmt(v),{s:11.5,f:'#fff',a:'start'})});return s};
    cell(duo,'Random forest: statistiche dei tagli',hb([['total_nights',2.88],['stays_in_week_nights',2.32],['stays_in_weekend_nights',1.84],['reserved_room_type',1.50],['arrival_date_month',1.48],['total_guests',1.45],['lead_time',.93],['adults',.72]],3,v=>fi(v,2),GRN),340,212,'Statistiche dei tagli','Massimo possibile: 3.');
    cell(duo,'XGBoost: media di |SHAP|',hb([['total_nights',.188],['arrival_date_month',.073],['hotel',.038],['market_segment',.031],['reserved_room_type',.030],['meal',.030],['lead_time',.019],['total_guests',.015]],.2,v=>fi(v,3),ORG),340,212,'Importanza SHAP','Su P(High), 300 prenotazioni.');
  })();
  /* SHAP by month */
  (function(){
    const V=[-.080,-.085,-.080,-.002,.033,.073,.135,.131,.046,-.036,-.096,-.054],Mn=['gen','feb','mar','apr','mag','giu','lug','ago','set','ott','nov','dic'];let s='';const Z=130,Y=v=>Z-v/.16*110;
    [-.1,0,.1].forEach(v=>s+=line(40,Y(v),680,Y(v),v?'#1d1d1d':'#777',v?1:1.2)+tx(34,Y(v)+4,(v>0?'+':'')+fi(v,1),{s:12,f:GRAY,a:'end'}));
    V.forEach((v,i)=>{const x=56+i*52;s+=rect(x,Math.min(Y(v),Z),38,Math.abs(Y(v)-Z),v>0?HIC:RED)+tx(x+19,v>0?Y(v)-6:Y(v)+16,(v>0?'+':'')+fi(v,3),{s:11.5,f:'#fff'})+tx(x+19,262,Mn[i],{s:12.5,f:'#ddd'})});
    svgBox($('#b13month'),700,274,s,'SHAP medio per mese di arrivo','44rem');
  })();
  /* waterfall single booking */
  (function(){
    const C=[['total_nights',.391],['arrival_date_month',.138],['total_guests',.117],['reserved_room_type',-.032],['market_segment',.025],['lead_time',.024],['altre variabili',.015]];
    let s='';const L=40,R=680,X=v=>L+v*(R-L);let cur=.17;
    [0,.25,.5,.75,1].forEach(v=>s+=line(X(v),10,X(v),C.length*30+66,'#1d1d1d',1)+tx(X(v),C.length*30+82,fi(v,2),{s:12,f:GRAY}));
    s+=rect(X(0),12,X(.17)-X(0),20,'#777')+tx(X(.17)+8,27,'previsione media 0,17',{s:12.5,f:'#ddd',a:'start'});
    C.forEach(([n,v],i)=>{const y=42+i*30,a=Math.min(cur,cur+v),b=Math.max(cur,cur+v);s+=rect(X(a),y,Math.max(2,X(b)-X(a)),20,v>0?HIC:RED)+tx(v>0?X(b)+8:X(a)-8,y+15,n+' '+(v>0?'+':'−')+fi(Math.abs(v),3),{s:12.5,f:'#ddd',a:v>0?'start':'end'});cur+=v});
    const y=42+C.length*30;s+=rect(X(0),y,X(.84)-X(0),20,'#fff')+tx(X(.84)-8,y+15,'previsione del modello ≈ 0,84',{s:12.5,f:'#000',a:'end',w:600});
    svgBox($('#b13water'),720,C.length*30+92,s,'Spiegazione SHAP di una prenotazione','44rem');
  })();
  /* partial dependence */
  (function(){
    const P=[[1,0],[2,0],[3,.1],[4,.25],[5,.40],[6,.58],[7,.70],[8,.77],[9,.81],[10,.83],[11,.84],[13,.88],[14,.88]];let s='';const L=60,R=660,T=14,B=230,X=v=>L+v/14*(R-L),Y=v=>B-v*(B-T);
    [0,.25,.5,.75,1].forEach(v=>s+=line(L,Y(v),R,Y(v),'#1d1d1d',1)+tx(L-8,Y(v)+4,fi(v,2),{s:12,f:GRAY,a:'end'}));for(let v=0;v<=14;v+=2)s+=tx(X(v),B+18,String(v),{s:12,f:GRAY});
    s+='<polyline points="'+P.map(([v,p])=>X(v)+','+Y(p)).join(' ')+'" fill="none" stroke="'+TEAL+'" stroke-width="3"/>';P.forEach(([v,p])=>s+='<circle cx="'+X(v)+'" cy="'+Y(p)+'" r="4.5" fill="'+TEAL+'"/>');
    s+=line(X(5),B,X(5),Y(.4),YEL,1.3,' stroke-dasharray="4 3"')+line(L,Y(.4),X(5),Y(.4),YEL,1.3,' stroke-dasharray="4 3"')+lbl(X(5)+8,Y(.4)+16,'PD(5) = 0,40',YEL,{a:'start',s:13.5});
    s+=line(L,B,R,B,'#777',1.2)+line(L,T,L,B,'#777',1.2)+tx((L+R)/2,B+38,'notti totali imposte a ogni prenotazione',{s:13,f:GRAY})+tx(18,(T+B)/2,'P(High) media',{s:13,f:GRAY,x:' transform="rotate(-90 18 '+(T+B)/2+')"'});
    svgBox($('#b13pdp'),680,280,s,'Dipendenza parziale delle notti','42rem');
  })();
};
QZ['13a']=()=>[{q:'Nell\'albero dei 100 clienti, un cliente ha la tecnologia vecchia, è cliente da 1 anno e ha 50 anni. In quale foglia finisce e come viene classificato?',o:['Nella foglia 20 / 0: se ne va','Nella foglia 5 / 10: resta','Nella foglia 5 / 40: resta','Nella foglia 20 / 0 della tecnologia nuova: se ne va'],a:1,
  e:'Vecchia, al massimo 2,3 anni, età oltre 35: foglia con 5 che se ne vanno e 10 che restano. La classe prevista è quella maggioritaria, resta.',h:'Segui i rami dall\'alto: tecnologia, poi anni, poi età.'}];
QZ['13b']=()=>[{q:'Un nodo contiene 20 clienti che se ne vanno e 20 che restano. Quanto vale il suo indice di Gini?',o:['0','0,25','0,5','1'],a:2,
  e:'p = 0,5 per entrambe le classi: 1 − (0,25 + 0,25) = 0,5, il massimo con due classi.',h:'Gini = 1 − somma dei quadrati delle quote.'}];
QZ['13c']=()=>[{q:'In una random forest, perché a ogni taglio si considera solo un sottoinsieme casuale di variabili?',o:['Per rendere ogni albero più accurato da solo','Per rendere gli alberi diversi fra loro, così la media riduce davvero la varianza','Per risparmiare memoria','Per ridurre la distorsione di ogni albero'],a:1,
  e:'Se una variabile fortissima fosse sempre disponibile, tutti gli alberi la userebbero in cima e si somiglierebbero. La media di alberi simili non riduce la varianza.',h:'Che cosa succede alla media di cento copie dello stesso albero?'}];
QZ['13d']=()=>[{q:'Aggiungi sempre più alberi a un gradient boosting con tasso di apprendimento fisso. Che cosa succede all\'errore sul test?',o:['Scende sempre, come in una random forest','Scende e poi può risalire: il numero di alberi va scelto sulla validazione','Resta costante','Sale fin dal primo albero'],a:1,
  e:'Ogni albero riduce l\'errore sul training; oltre un certo punto il modello comincia a imparare il rumore. Nella random forest invece più alberi non fanno male.',h:'Ricorda la tabella del confronto fra le due famiglie.'}];
QZ['13e']=()=>[{q:'Il manager chiede: «perché il modello dà 0,84 a questa specifica prenotazione?». Quale lente usi?',o:['Le statistiche dei tagli della foresta','I valori SHAP di quella prenotazione','La dipendenza parziale delle notti','L\'AUC'],a:1,
  e:'Solo SHAP spiega una singola previsione (portata locale), dividendola fra le variabili a partire dalla previsione media.',h:'Quale lente ha portata locale?'}];
QZ['13']=()=>[
  {q:'Un taglio divide un nodo di 100 unità in due figli: 60 unità con Gini 0,3 e 40 unità con Gini 0,1. Quanto vale il Gini del taglio?',o:['0,20','0,22','0,40','0,18'],a:1,
   e:'Media pesata: 0,6 × 0,3 + 0,4 × 0,1 = 0,18 + 0,04 = 0,22.',h:'Pesa ogni figlio con la sua quota di unità.'},
  {q:'Un taglio ha guadagno di informazione 0,40 e SplitINFO 2,0. Qual è il gain ratio, e a che cosa serve?',o:['0,80: premia i tagli con molti gruppi','0,20: penalizza i tagli in molti gruppi piccoli','2,40: somma le due misure','0,40: lo SplitINFO non conta'],a:1,
   e:'Gain ratio = IG / SplitINFO = 0,40 / 2,0 = 0,20. Lo SplitINFO cresce con il numero di gruppi, quindi il rapporto protegge da variabili come il mese o il paese.',h:'Si divide il guadagno per lo SplitINFO.'},
  {q:'Nell\'esempio degli affitti, dopo il passo 1 i residui sono −112,5, −72,5, 7,5, 177,5 e 0. Il secondo albero taglia a 825. Che cosa prevede per gli appartamenti di 750 e 800 piedi quadrati?',o:['−112,5','−92,5','−72,5','61,7'],a:1,
   e:'A sinistra del taglio ci sono i residui −112,5 e −72,5: la loro media è −92,5. A destra (7,5 + 177,5 + 0) / 3 ≈ 61,7.',h:'Una foglia prevede la media dei residui che contiene.'},
  {q:'Un albero di boosting dà a una prenotazione un punteggio complessivo F = 0. Qual è la probabilità prevista di High?',o:['0','0,12','0,50','1'],a:2,
   e:'p = 1 / (1 + e⁰) = 1 / 2 = 0,5.',h:'Usa la funzione logistica.'},
  {q:'Quale coppia descrive correttamente gli alberi singoli dentro i due tipi di insieme?',o:['Foresta: alberi bassi; boosting: alberi profondi','Foresta: alberi profondi non potati; boosting: alberi bassi, da 2 a 6 livelli','Tutti e due: alberi potati con MDL','Foresta: un solo albero; boosting: cento alberi uguali'],a:1,
   e:'La foresta media alberi profondi (bassa distorsione, alta varianza) per ridurre la varianza; il boosting somma alberi bassi (alta distorsione, bassa varianza) per ridurre la distorsione.',h:'Quale errore attacca ciascuna famiglia?'},
  {q:'La dipendenza parziale dice PD(5) = 0,40. Quale lettura è corretta?',o:['Il 40% delle prenotazioni dura 5 notti','Se ogni prenotazione durasse 5 notti, lasciando il resto com\'è, la probabilità media prevista di High sarebbe 0,40','Allungare un soggiorno a 5 notti causa un aumento del ricavo del 40%','Le prenotazioni di 5 notti sono High nel 40% dei dati'],a:1,
   e:'È la previsione media del modello con le notti forzate a 5 per tutte le prenotazioni. Non è una frequenza nei dati, e non è un effetto causale.',h:'Ricorda la formula di PD(v) e che importanza non vuol dire causalità.'}
];
MAPPA[13]={c:'Come decide un albero, e perché cento alberi decidono meglio?',r:[
  {t:'Alberi',c:GRN,v:['Radice, nodi, rami, foglie','Classificazione e regressione','Supervisionato, a differenza del clustering','Ricorsivo e avido']},
  {t:'Criteri di taglio',c:BLUE,v:['Gini: 1 − somma dei quadrati','Entropia e guadagno di informazione','Gain ratio contro i tagli in molti gruppi','Potatura MDL, minimo 20 unità']},
  {t:'Algoritmi',c:TEAL,v:['CART, C4.5, CHAID, QUEST','KNIME: Decision Tree Learner simile a C4.5','Ensemble basati su CART']},
  {t:'Distorsione e varianza',c:YEL,v:['Errore = distorsione² + varianza + rumore','Foresta: riduce la varianza','Boosting: riduce la distorsione']},
  {t:'Foresta e boosting',c:PINK,v:['Bootstrap e √p variabili per taglio','Alberi sui residui, tasso 0,1','XGBoost: perdita + complessità','Accuratezza: 0,928 albero, 0,950-0,951 insiemi']},
  {t:'Importanza',c:ORG,v:['Statistiche dei tagli','SHAP: contributi che sommano alla previsione','Dipendenza parziale: forma dell\'effetto','Importanza non è causalità']}]};
