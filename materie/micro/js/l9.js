INIT[9]=function(){
/* preferenze del gioco: per ogni individuo le caverne dalla preferita all'ultima */
const P={1:['B','C','D','A'],2:['B','D','A','C'],3:['A','B','C','D'],4:['B','C','A','D']};
const IND=[1,2,3,4];
const holder=(al,h)=>IND.find(i=>al[i-1]===h);
const rank=(i,h)=>P[i].indexOf(h);

/* tabella delle preferenze con un'allocazione evidenziata.
   mode 'envy': per ogni caverna preferita alla propria dice di chi è (più debole = rosso, più forte = grigio)
   mode 'plain': solo l'allocazione */
function prefTable(al,mode){
  const cw=64,ch=48,x0=62,y0=64,W=x0+4*cw+10,H=y0+4*ch+8;
  let s='<defs>'+arrowDef('pwA',ORG)+'</defs>';
  s+=tx(x0+2,16,'più forte',{a:'start',f:ORG,s:13})+tx(x0+4*cw-6,16,'più debole',{a:'end',f:ORG,s:13});
  s+='<line x1="'+(x0+68)+'" y1="12" x2="'+(x0+4*cw-82)+'" y2="12" stroke="'+ORG+'" stroke-width="2" marker-end="url(#pwA)"/>';
  IND.forEach((i,c)=>{const cx=x0+c*cw+cw/2-3;
    s+='<circle cx="'+cx+'" cy="42" r="14" fill="none" stroke="#fff" stroke-width="1.5"/>'+tx(cx,47,i,{s:16})});
  ['1ª','2ª','3ª','4ª'].forEach((t,r)=>{s+=tx(x0-12,y0+r*ch+ch/2+3,t,{a:'end',f:GRAY,s:13})});
  s+=tx(14,y0+2*ch,'scelta',{f:GRAY,s:13,x:' transform="rotate(-90 14 '+(y0+2*ch)+')"'});
  IND.forEach((i,c)=>{const mine=rank(i,al[i-1]);
    P[i].forEach((h,r)=>{const x=x0+c*cw,y=y0+r*ch,cx=x+cw/2-3;
      let fill='none',stroke='none',col='#6b6b6b',tag='',tcol=GRAY;
      if(r===mine){fill=PINK;col='#000'}
      else if(r<mine&&mode==='envy'){const k=holder(al,h);
        if(k>i){fill=RED;col='#000';tcol='#000';tag='è di '+k}else{stroke='#777';col='#e6e6e6';tag='è di '+k}}
      else if(r<mine){col='#e6e6e6'}
      s+='<rect x="'+(x+1)+'" y="'+(y+2)+'" width="'+(cw-8)+'" height="'+(ch-6)+'" rx="4" fill="'+fill+'" stroke="'+stroke+'" stroke-width="1.3"/>';
      s+=tx(cx,y+(tag?21:ch/2+5),h,{s:18,f:col,serif:1,i:1});
      if(tag)s+=tx(cx,y+38,tag,{s:13,f:tcol});
    })});
  return {s,W,H};
}
const ENVY_LEG=[[PINK,'la caverna che occupa','box'],[RED,'la preferisce, ed è di uno più debole: può prenderla','box'],['#777','la preferisce, ma è di uno più forte','dash']];
const alName=al=>'('+al.join(',\\,')+')';

/* Apertura: l'allocazione di partenza del gioco */
(function(){
  const root=$('#jun0'),t=prefTable(['D','A','C','B'],'envy');
  root.append(legend(ENVY_LEG));svgBox(root,t.W,t.H,t.s,'Tabella delle preferenze dei quattro giocatori con l\'allocazione di partenza D, A, C, B','21rem');
})();

/* Due partite del gioco, passo per passo */
(function(){
  const root=$('#junPlay');
  const games=[
    {t:'Partenza (D, A, C, B)',rows:[
      {who:null,c:{A:2,B:4,C:3,D:1},out:[]},
      {who:1,to:'B',c:{A:2,B:1,C:3,D:0},out:[4]},
      {who:2,to:'D',c:{A:0,B:1,C:3,D:2},out:[4]},
      {who:3,to:'A',c:{A:3,B:1,C:0,D:2},out:[4]},
      {who:4,to:'C',c:{A:3,B:1,C:4,D:2},out:[]}]},
    {t:'Partenza (A, B, D, C)',rows:[
      {who:null,c:{A:1,B:2,C:4,D:3},out:[]},
      {who:3,to:'C',c:{A:1,B:2,C:3,D:0},out:[4]},
      {who:4,to:'D',c:{A:1,B:2,C:3,D:4},out:[]},
      {who:1,to:'B',c:{A:0,B:1,C:3,D:4},out:[2]},
      {who:2,to:'D',c:{A:0,B:1,C:3,D:2},out:[4]},
      {who:3,to:'A',c:{A:3,B:1,C:0,D:2},out:[4]},
      {who:4,to:'C',c:{A:3,B:1,C:4,D:2},out:[]}]}];
  root.append(legend([[PINK,'chi si è appena mosso','box'],[RED,'rimasto senza caverna','box'],['#555','caverna vuota','dash']]));
  const duo=el('div','duo');root.append(duo);
  games.forEach(g=>{
    const d=el('div');d.append(el('h4','',g.t));duo.append(d);
    const lw=78,cw=44,rh=38,y0=34,W=lw+4*cw+62,H=y0+g.rows.length*rh+6;
    let s='';['A','B','C','D'].forEach((h,c)=>{s+=tx(lw+c*cw+cw/2,22,h,{s:17,serif:1,i:1})});
    s+=tx(lw+4*cw+33,22,'fuori',{s:13,f:GRAY});
    g.rows.forEach((r,k)=>{const y=y0+k*rh,last=k===g.rows.length-1;
      s+=tx(lw-10,y+rh/2+5,r.who?'tocca a '+r.who:'inizio',{a:'end',s:13,f:r.who?'#fff':GRAY});
      ['A','B','C','D'].forEach((h,c)=>{const v=r.c[h],x=lw+c*cw,mv=r.who&&r.to===h;
        s+='<rect x="'+(x+3)+'" y="'+(y+3)+'" width="'+(cw-6)+'" height="'+(rh-6)+'" rx="4" fill="'+(mv?PINK:'none')+'" stroke="'+(mv?PINK:(v?(last?'#fff':'#777'):'#555'))+'" stroke-width="'+(last&&v?1.8:1.2)+'"'+(v?'':' stroke-dasharray="3 4"')+'/>';
        if(v)s+=tx(x+cw/2,y+rh/2+5,v,{s:16,f:mv?'#000':'#fff'})});
      r.out.forEach((o,q)=>{const x=lw+4*cw+16+q*30;
        s+='<rect x="'+x+'" y="'+(y+5)+'" width="30" height="'+(rh-10)+'" rx="4" fill="'+RED+'"/>'+tx(x+15,y+rh/2+5,o,{s:16,f:'#000'})});
    });
    svgBox(d,W,H,s,'Sequenza di mosse del gioco della giungla: '+g.t,'21rem');
  });
  const o=out();o.innerHTML='Le due partite partono da allocazioni diverse e fanno un numero diverso di mosse, ma finiscono nello stesso punto: '+K('(B,\\,D,\\,A,\\,C)')+'.';root.append(o);
})();

/* Assegnazione e allocazione */
(function(){
  const root=$('#junAssign'),duo=el('div','duo');root.append(legend([['#fff','individui','dot'],[GRN,'case','box'],[RED,'casa assegnata due volte','box']]),duo);
  [{t:'Un\'assegnazione che non è un\'allocazione',m:['A','B','B','D']},{t:'Un\'allocazione',m:['D','A','C','B']}].forEach(g=>{
    const d=el('div');d.append(el('h4','',g.t));duo.append(d);
    const Y=k=>34+k*50,xl=70,xr=230;let s='';
    const cnt={};g.m.forEach(h=>cnt[h]=(cnt[h]||0)+1);
    g.m.forEach((h,i)=>{const k='ABCD'.indexOf(h);s+='<line x1="'+(xl+16)+'" y1="'+Y(i)+'" x2="'+(xr-18)+'" y2="'+Y(k)+'" stroke="'+(cnt[h]>1?RED:'#fff')+'" stroke-width="2"/>'});
    IND.forEach((i,k)=>{s+='<circle cx="'+xl+'" cy="'+Y(k)+'" r="15" fill="#000" stroke="#fff" stroke-width="1.5"/>'+tx(xl,Y(k)+5,i,{s:16})});
    'ABCD'.split('').forEach((h,k)=>{const c=cnt[h]>1?RED:GRN;
      s+='<rect x="'+(xr-16)+'" y="'+(Y(k)-16)+'" width="32" height="32" rx="4" fill="'+(cnt[h]?c:'none')+'" stroke="'+c+'" stroke-width="1.6"'+(cnt[h]?'':' stroke-dasharray="3 4"')+'/>'+tx(xr,Y(k)+6,h,{s:17,serif:1,i:1,f:cnt[h]?'#000':GRN})});
    svgBox(d,300,222,s,g.t,'18rem');
  });
})();

/* Equilibrio: l'allocazione di partenza e quella finale a confronto */
(function(){
  const root=$('#junEq'),duo=el('div','duo');root.append(legend(ENVY_LEG),duo);
  [['D','A','C','B'],['B','D','A','C']].forEach((al,k)=>{
    const d=el('div');d.append(el('h4','',K(alName(al))+(k?': un equilibrio':': non è un equilibrio')));duo.append(d);
    const t=prefTable(al,'envy');svgBox(d,t.W,t.H,t.s,'Tabella delle preferenze con l\'allocazione '+al.join(', '),'21rem');
  });
})();

/* Dittatura seriale */
(function(){
  const root=$('#junSerial');
  const cw=128,ch=44,x0=30,y0=70,W=x0+4*cw,H=y0+4*ch+50;
  let s='<defs>'+arrowDef('sdA','#fff')+'</defs>',taken=[];
  IND.forEach((i,c)=>{const x=x0+c*cw,cx=x+44;
    s+=tx(cx,20,(c+1)+'° a scegliere',{s:13,f:GRAY});
    s+='<circle cx="'+cx+'" cy="46" r="14" fill="none" stroke="#fff" stroke-width="1.5"/>'+tx(cx,51,i,{s:16});
    const pick=P[i].find(h=>!taken.includes(h));
    P[i].forEach((h,r)=>{const y=y0+r*ch,gone=taken.includes(h),me=h===pick;
      s+='<rect x="'+(cx-26)+'" y="'+(y+3)+'" width="52" height="'+(ch-8)+'" rx="4" fill="'+(me?PINK:'none')+'" stroke="'+(me?PINK:'none')+'"/>';
      s+=tx(cx,y+ch/2+5,h,{s:18,serif:1,i:1,f:me?'#000':gone?'#777':'#cfcfcf'});
      if(gone)s+='<line x1="'+(cx-17)+'" y1="'+(y+ch/2-1)+'" x2="'+(cx+17)+'" y2="'+(y+ch/2-1)+'" stroke="'+RED+'" stroke-width="2.5"/>'});
    s+=tx(cx,y0+4*ch+26,'prende '+pick,{s:14,f:PINK});
    if(c<3)s+='<line x1="'+(cx+38)+'" y1="46" x2="'+(cx+cw-42)+'" y2="46" stroke="#fff" stroke-width="1.8" marker-end="url(#sdA)"/>';
    taken.push(pick);
  });
  root.append(legend([[PINK,'la casa che prende','box'],[RED,'già presa da chi ha scelto prima']]));
  svgBox(root,W,H,s,'Dittatura seriale: gli individui scelgono in ordine di forza la casa migliore fra quelle rimaste','36rem');
})();

/* Schema della dimostrazione di unicità */
(function(){
  const root=$('#junUniq');
  const X=[70,120,194,268,342,416,490,564],lab=['1','2','…','i*−1','i*','j','k','n'],cw=58;
  let s=tx(22,30,'i',{i:1,s:16})+tx(22,74,'a(i)',{i:1,s:16,f:PINK})+tx(22,118,'b(i)',{i:1,s:16,f:PUR});
  X.forEach((x,c)=>{s+=tx(x,30,lab[c],{s:15,i:1});
    [[62,'a'],[106,'b']].forEach(([y,row])=>{
      let f='#3a3a3a';
      if(c===4)f=row==='a'?ORG:BLUE;
      if(c===5&&row==='b')f=ORG;
      if(c===6&&row==='a')f=BLUE;
      if(c===2){s+=tx(x,y+6,'…',{s:15,f:GRAY});return}
      s+='<rect x="'+(x-cw/2+4)+'" y="'+(y-16)+'" width="'+(cw-8)+'" height="30" rx="4" fill="'+f+'"/>';
      if(c<4)s+=tx(x,y+5,'=',{s:14,f:GRAY});
    })});
  s+=tx(157,150,'qui a e b coincidono',{s:13,f:GRAY})+tx(453,150,'tutti più deboli di i*',{s:13,f:GRAY});
  root.append(legend([[ORG,'la casa a(i*)','box'],[BLUE,'la casa b(i*)','box'],['#3a3a3a','altre case','box']]));
  svgBox(root,600,162,s,'Le due allocazioni a e b coincidono fino a i* meno 1; la casa a di i* tocca in b a un individuo j più debole, e la casa b di i* tocca in a a un individuo k più debole','36rem');
})();

/* Clan, primo round: i sei scambi a due */
(function(){
  const root=$('#clanSwap'),al=['D','A','C','B'];
  const pairs=[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]],rh=40,W=560,H=34+pairs.length*rh+6;
  let s=tx(60,20,'scambio',{s:13,f:GRAY})+tx(220,20,'il primo',{s:13,f:GRAY})+tx(420,20,'il secondo',{s:13,f:GRAY});
  pairs.forEach(([i,j],k)=>{const y=34+k*rh;
    s+='<line x1="10" y1="'+y+'" x2="'+(W-10)+'" y2="'+y+'" stroke="#333"/>';
    s+=tx(60,y+rh/2+5,i+' ↔ '+j,{s:16});
    [[i,j,220],[j,i,420]].forEach(([me,ot,x])=>{const from=al[me-1],to=al[ot-1],good=rank(me,to)<rank(me,from),c=good?GRN:RED;
      s+=tx(x-12,y+rh/2+5,me+':  '+from+' → '+to,{s:16,f:c});
      s+=tx(x+62,y+rh/2+5,good?'ci guadagna':'ci perde',{s:13,f:c,a:'start'})});
  });
  root.append(legend([[GRN,'riceve una caverna che preferisce','box'],[RED,'riceve una caverna peggiore','box']]));
  svgBox(root,W,H,s,'I sei scambi possibili fra due giocatori a partire da D, A, C, B: in ognuno uno dei due ci perde','34rem');
})();

/* Clan, secondo round: la rotazione a tre */
(function(){
  const root=$('#clanCycle'),N={1:[320,78],3:[492,300],2:[148,300]},r=34;
  const cut=(p,q)=>{const dx=q[0]-p[0],dy=q[1]-p[1],d=Math.hypot(dx,dy);return [p[0]+dx/d*(r+8),p[1]+dy/d*(r+8),q[0]-dx/d*(r+16),q[1]-dy/d*(r+16)].map(v=>v.toFixed(1))};
  const arr=(a,b)=>{const c=cut(N[a],N[b]);return '<line x1="'+c[0]+'" y1="'+c[1]+'" x2="'+c[2]+'" y2="'+c[3]+'" stroke="'+GRN+'" stroke-width="3.5" marker-end="url(#ccA)"/>'};
  let s='<defs>'+arrowDef('ccA',GRN)+'</defs>'+arr(1,3)+arr(3,2)+arr(2,1);
  const house={1:'D',2:'A',3:'C'};
  [1,2,3].forEach(i=>{s+='<circle cx="'+N[i][0]+'" cy="'+N[i][1]+'" r="'+r+'" fill="#000" stroke="#fff" stroke-width="2"/>'+tx(N[i][0],N[i][1]-2,i,{s:22})+tx(N[i][0],N[i][1]+19,'in '+house[i],{s:13,f:GRAY})});
  s+=tx(444,166,'1 passa in C',{s:16,a:'start',f:GRN})+tx(444,188,'la preferisce a D',{s:13,a:'start',f:GRAY});
  s+=tx(320,362,'3 passa in A',{s:16,f:GRN})+tx(320,384,'la preferisce a C',{s:13,f:GRAY});
  s+=tx(196,166,'2 passa in D',{s:16,a:'end',f:GRN})+tx(196,188,'la preferisce ad A',{s:13,a:'end',f:GRAY});
  s+='<circle cx="578" cy="46" r="26" fill="#000" stroke="'+GRAY+'" stroke-width="2"/>'+tx(578,44,4,{s:20,f:'#c9c9c9'})+tx(578,60,'in B',{s:13,f:GRAY})+tx(578,92,'resta dov\'è',{s:13,f:GRAY});
  s+=tx(320,220,'tre ci guadagnano',{s:15,f:GRN})+tx(320,244,'nessuno ci perde',{s:15,f:'#fff'});
  root.append(legend([[GRN,'va nella caverna di…']]));
  svgBox(root,640,400,s,'Rotazione a tre: 1 passa nella caverna C di 3, 3 nella caverna A di 2, 2 nella caverna D di 1; 4 resta in B','34rem');
})();

/* Da un'allocazione a un'altra: chi sale e chi scende nella propria classifica */
function rankChart(root,alA,alB,nA,nB){
  const X=i=>120+(i-1)*118,Y=r=>50+r*66,W=560,H=346;
  let s='<defs>'+arrowDef('rkG',GRN)+arrowDef('rkR',RED)+'</defs>';
  ['1ª scelta','2ª scelta','3ª scelta','4ª scelta'].forEach((t,r)=>{s+='<line x1="70" y1="'+Y(r)+'" x2="'+(W-14)+'" y2="'+Y(r)+'" stroke="#2a2a2a"/>'+tx(62,Y(r)+5,t,{a:'end',s:13,f:GRAY})});
  IND.forEach(i=>{const a=alA[i-1],b=alB[i-1],ra=rank(i,a),rb=rank(i,b),x=X(i);
    s+=tx(x,H-30,i,{s:17})+tx(x,H-10,ra===rb?'resta in '+a:(rb<ra?'sta meglio':'sta peggio'),{s:13,f:ra===rb?GRAY:rb<ra?GRN:RED});
    if(ra===rb){s+='<circle cx="'+x+'" cy="'+Y(ra)+'" r="17" fill="'+PUR+'" stroke="#fff" stroke-width="2.5"/>'+tx(x,Y(ra)+6,a,{s:17,serif:1,i:1,f:'#000'});return}
    const up=rb<ra,c=up?GRN:RED,d=up?-1:1;
    s+='<line x1="'+x+'" y1="'+(Y(ra)+d*19)+'" x2="'+x+'" y2="'+(Y(rb)-d*26)+'" stroke="'+c+'" stroke-width="3.5" marker-end="url(#'+(up?'rkG':'rkR')+')"/>';
    s+='<circle cx="'+x+'" cy="'+Y(ra)+'" r="17" fill="#000" stroke="#fff" stroke-width="2"/>'+tx(x,Y(ra)+6,a,{s:17,serif:1,i:1});
    s+='<circle cx="'+x+'" cy="'+Y(rb)+'" r="17" fill="'+PUR+'"/>'+tx(x,Y(rb)+6,b,{s:17,serif:1,i:1,f:'#000'});
  });
  s+=tx(W/2+28,H-52,'individuo',{s:13,f:GRAY});
  root.append(legend([['#fff',nA,'dash'],[PUR,nB,'dot'],[GRN,'sta meglio'],[RED,'sta peggio']]));
  svgBox(root,W,H,s,'Posizione, nella classifica di ciascun individuo, della casa ricevuta in '+nA+' e in '+nB,'34rem');
}
rankChart($('#parDom'),['D','A','C','B'],['C','D','A','B'],'a = (D, A, C, B)','b = (C, D, A, B)');
rankChart($('#parCmp'),['B','D','A','C'],['C','D','A','B'],'esito della giungla (B, D, A, C)','esito del clan (C, D, A, B)');

/* L'esito del clan visto con gli occhi della giungla */
(function(){
  const root=$('#clanEnvy'),t=prefTable(['C','D','A','B'],'envy');
  root.append(legend(ENVY_LEG));svgBox(root,t.W,t.H,t.s,'Tabella delle preferenze con l\'esito del clan C, D, A, B: gli individui 1 e 2 preferiscono B, che è del più debole 4','21rem');
})();
};
QZ['9a']=()=>[
 {q:'Si parte da '+K('(D,\\,A,\\,C,\\,B)')+'. Quali giocatori possono prendersi subito una caverna che preferiscono alla propria?',
  o:['Solo il giocatore 1','I giocatori 1, 2 e 3','Tutti e quattro','Nessuno: ognuno ha già una caverna'],a:1,
  e:'Tutti e tre preferiscono B, che è del più debole 4; in più 1 preferisce anche C, che è di 3. Il giocatore 4 ha già la sua preferita, e comunque non ha nessuno sotto di sé.',
  h:'Guarda le caselle rosse nella tabella: in quali colonne compaiono?'}
];
QZ['9b']=()=>[
 {q:'In '+K('(B,\\,D,\\,A,\\,C)')+' l\'individuo 2 occupa D, ma preferirebbe B. Perché l\'allocazione è comunque un equilibrio?',
  o:['Perché 2 è indifferente fra B e D','Perché B è occupata da 1, che è più forte di 2','Perché 2 ha già cambiato caverna una volta','Perché in un equilibrio ognuno ha la sua caverna preferita'],a:1,
  e:'L\'equilibrio vieta solo di preferire la casa di qualcuno più debole. Desiderare la casa di uno più forte non destabilizza niente: non la si può prendere.',
  h:'Rileggi la definizione: di chi deve essere la casa che l\'individuo preferisce, perché l\'equilibrio salti?'}
];
QZ['9c']=()=>[
 {q:'Terzo round: si riparte dall\'esito della giungla, '+K('(B,\\,D,\\,A,\\,C)')+', con le regole del clan. Il gruppo riesce a concordare un cambiamento?',
  o:['Sì: 2 e 4 si scambiano D e C','Sì: basta una rotazione a tre come nel secondo round','No: ogni cambiamento farebbe stare peggio qualcuno','No: le regole del clan vietano di toccare un equilibrio'],a:2,
  e:'1 e 3 hanno già la loro caverna preferita, quindi non possono cambiare senza perderci. Restano 2 e 4, con D e C: lo scambio darebbe a 2 la caverna C, che per lui è l\'ultima.',
  h:'Parti da chi ha già la caverna preferita: può essere spostato? Poi guarda che cosa resta agli altri.'}
];
QZ['9']=()=>[
 {q:'Stesse preferenze del gioco, ma con la forza rovesciata: '+K('4 \\pw 3 \\pw 2 \\pw 1')+'. Qual è l\'equilibrio della giungla?',
  o:[K('(B,\\,D,\\,A,\\,C)'),K('(D,\\,A,\\,C,\\,B)'),K('(C,\\,D,\\,A,\\,B)'),K('(A,\\,B,\\,C,\\,D)')],a:2,
  e:'Dittatura seriale nell\'ordine 4, 3, 2, 1: 4 prende B; 3 prende A; 2 trova B occupata e prende D; a 1 resta C. È proprio l\'esito del gioco del clan.',
  h:'Applica la dittatura seriale partendo dal più forte, che ora è 4.'},
 {q:'Un\'allocazione è un equilibrio della giungla quando…',
  o:['ogni individuo occupa la sua casa preferita','nessun individuo preferisce alla propria la casa di qualcuno più debole','nessun individuo preferisce alla propria la casa di qualcun altro','nessun\'altra allocazione la domina nel senso di Pareto'],a:1,
  e:'Conta solo l\'invidia verso i più deboli, perché solo a loro si può portare via la casa.',
  h:'Quali case un individuo può davvero ottenere, in una giungla?'},
 {q:'Perché '+K('\\aB=(C,\\,D,\\,A,\\,B)')+' domina nel senso di Pareto '+K('\\aA=(D,\\,A,\\,C,\\,B)')+'?',
  o:['Perché in '+K('\\aB')+' tutti hanno la loro casa preferita','Perché 1, 2 e 3 stanno meglio in '+K('\\aB')+' e 4 non sta peggio','Perché '+K('\\aB')+' è un equilibrio della giungla e '+K('\\aA')+' no','Perché la maggioranza preferisce '+K('\\aB')],a:1,
  e:'1 passa da D a C, 2 da A a D, 3 da C ad A: tre miglioramenti. 4 resta in B. Nessuno peggiora e almeno uno migliora.',
  h:'La dominanza di Pareto chiede due cose: nessuno peggiora, e almeno uno migliora.'},
 {q:'Quale di queste affermazioni è vera, per una giungla con preferenze strette?',
  o:['Ogni allocazione Pareto stabile è l\'equilibrio della giungla','L\'equilibrio è unico ed è Pareto stabile, ma possono esserci altre allocazioni Pareto stabili','Possono esserci più equilibri, tutti Pareto stabili','L\'equilibrio è unico, ma può non essere Pareto stabile'],a:1,
  e:'L\'equilibrio è quello della dittatura seriale nell\'ordine di forza, ed è Pareto stabile. L\'esito del clan mostra che esistono allocazioni Pareto stabili diverse dall\'equilibrio.',
  h:'Confronta l\'esito della giungla con quello del clan: sono due allocazioni diverse. Che proprietà hanno in comune?'},
 {q:'Nell\'esito del clan, '+K('(C,\\,D,\\,A,\\,B)')+', con la forza '+K('1 \\pw 2 \\pw 3 \\pw 4')+', che cosa farebbe saltare l\'equilibrio?',
  o:['2 prenderebbe C a 1','1 prenderebbe B a 4','3 prenderebbe B a 4','Niente: è un equilibrio'],a:1,
  e:'1 occupa C ma preferisce B, che è di 4, il più debole: gli basta presentarsi. Lo stesso vale per 2, che occupa D e preferisce B. Invece 3 ha già la sua preferita, e 2 non può togliere niente a 1.',
  h:'Cerca le caselle rosse nella tabella dell\'esito del clan: in quali colonne stanno, e di chi è la caverna?'}
];

