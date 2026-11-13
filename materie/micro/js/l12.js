INIT[12]=function(){
const BOS=[[[2,1],[0,0]],[[0,0],[1,2]]];
/* Battaglia dei sessi e scelta in funzione della convinzione */
(function(){
  const root=$('#bos12'),duo=el('div','duo');root.append(duo);
  const m=gameMatrix(['A','B'],['A','B'],BOS,{cw:80,x0:40});
  cell(duo,'Battaglia dei sessi',m.s,m.W,m.H,'Matrice della battaglia dei sessi');
  const W=300,H=230,ax=40,ay=14,aw=240,ah=170,X=q=>ax+q*aw,Y=v=>ay+ah-v/2*ah;
  let s='<path d="M'+ax+' '+ay+'V'+(ay+ah)+'H'+(ax+aw)+'" fill="none" stroke="#fff" stroke-width="1.5"/>';
  [0,1,2].forEach(v=>{s+=tx(ax-8,Y(v)+5,v,{s:13,f:GRAY,a:'end'})});
  [[0,'0'],[1/3,'1/3'],[1,'1']].forEach(([q,t])=>{s+=tx(X(q),ay+ah+18,t,{s:13,f:GRAY})});
  s+=tx(ax+aw/2,ay+ah+36,'q = probabilità che 2 scelga A',{s:12,f:GRAY});
  s+='<line x1="'+X(1/3)+'" y1="'+ay+'" x2="'+X(1/3)+'" y2="'+(ay+ah)+'" stroke="#777" stroke-dasharray="4 5"/>';
  s+='<line x1="'+X(0)+'" y1="'+Y(0)+'" x2="'+X(1)+'" y2="'+Y(2)+'" stroke="'+PINK+'" stroke-width="3"/>'+tx(X(.86)-6,Y(1.72)-8,'A: 2q',{s:13,f:PINK,a:'end'});
  s+='<line x1="'+X(0)+'" y1="'+Y(1)+'" x2="'+X(1)+'" y2="'+Y(0)+'" stroke="'+ORG+'" stroke-width="3"/>'+tx(X(.08),Y(.92)-10,'B: 1 − q',{s:13,f:ORG,a:'start'});
  s+=tx(X(.17),Y(1.85),'conviene B',{s:12,f:ORG})+tx(X(.7),Y(.8),'conviene A',{s:12,f:PINK});
  cell(duo,'Payoff atteso del giocatore 1',s,W,H,'Payoff atteso del giocatore 1 da A e da B in funzione della probabilità q di A: le rette si incrociano in un terzo');
})();
/* I tre casi di payoff atteso */
(function(){
  const root=$('#eu12'),g=el('div','multi');root.append(legend([[PINK,'peso della cella: più intenso, più probabile','box']]),g);
  [[[.5,.5],[1,0]],[[1,0],[.5,.5]],[[.5,.5],[.5,.5]]].forEach(([sg,th])=>{
    const cw=72,rh=46,x0=44,y0=46;let s='',tot=0;
    s+=tx(x0+cw,14,'θ: A '+fmt(th[0])+' · B '+fmt(th[1]),{s:12,f:PUR});
    ['A','B'].forEach((c,j)=>{s+=tx(x0+j*cw+cw/2,y0-8,c,{s:14,i:1,serif:1,f:P2C})});
    ['A','B'].forEach((r,i)=>{s+=tx(x0-8,y0+i*rh+rh/2+5,r,{s:14,i:1,serif:1,f:P1C,a:'end'})+tx(10,y0+i*rh+rh/2+5,fmt(sg[i]),{s:12,f:TEAL,a:'start'});
      ['A','B'].forEach((c,j)=>{const w=sg[i]*th[j],u=BOS[i][j][0];tot+=w*u;
        s+='<rect x="'+(x0+j*cw)+'" y="'+(y0+i*rh)+'" width="'+cw+'" height="'+rh+'" fill="rgba(220,117,205,'+(w*0.9).toFixed(2)+')" stroke="#555"/>'+
          tx(x0+j*cw+cw/2,y0+i*rh+20,u,{s:16,f:w>.3?'#000':P1C,w:600})+tx(x0+j*cw+cw/2,y0+i*rh+37,'peso '+fmt(w),{s:11,f:w>.3?'#000':GRAY})})});
    s+=tx(16,y0-8,'σ',{s:13,f:TEAL,i:1,serif:1});
    cell(g,'σ₁ = ('+fmt(sg[0])+', '+fmt(sg[1])+')',s,x0+2*cw+8,y0+2*rh+8,'Matrice pesata','payoff atteso = <b>'+fmt(tot)+'</b>');
  });
})();
/* L'isola degli occhi azzurri: induzione su 1, 2, 3 */
(function(){
  const root=$('#eyes12'),W=560,cw=176,rh=58,y0=46;let s='';
  [1,2,3].forEach((k,c)=>{const x=10+c*cw;s+=tx(x+cw/2,20,k+(k===1?' persona':' persone')+' con occhi azzurri',{s:13,f:'#fff'});
    for(let d=1;d<=3;d++){const y=y0+(d-1)*rh,hit=d===k,after=d>k;
      s+='<rect x="'+(x+6)+'" y="'+y+'" width="'+(cw-12)+'" height="'+(rh-10)+'" rx="5" fill="'+(hit?'rgba(88,196,221,.18)':'none')+'" stroke="'+(hit?BLUE:'#333')+'"/>';
      for(let j=0;j<k;j++){const cx=x+cw/2-(k-1)*16+j*32;s+='<circle cx="'+cx+'" cy="'+(y+18)+'" r="10" fill="'+(after?'#333':BLUE)+'" stroke="'+(hit?'#fff':'none')+'" stroke-width="2"/>'}
      s+=tx(x+cw/2,y+42,after?'—':hit?(k===1?'compie il rito':'compiono il rito'):'nessun rito',{s:12,f:hit?BLUE:GRAY});
    }});
  s+=tx(W/2,y0+3*rh+8,'riga 1: primo giorno dopo l\'annuncio · riga 2: secondo giorno · riga 3: terzo giorno',{s:12,f:GRAY});
  root.append(legend([[BLUE,'persona con gli occhi azzurri','dot'],[BLUE,'giorno del rito','box']]));
  svgBox(root,W,y0+3*rh+16,s,'Con k persone dagli occhi azzurri, tutte compiono il rito il giorno k dopo l\'annuncio','34rem');
})();
};
QZ['12a']=()=>[
 {q:'Battaglia dei sessi: il giocatore 1 gioca '+K('\\sig_1=(1/4,\\ 3/4)')+' e crede '+K('\\bel_{-1}=(1/2,\\ 1/2)')+'. Qual è il suo payoff atteso?',
  o:['0,5','0,625','0,75','1'],a:1,
  e:K('\\tfrac14\\cdot\\tfrac12\\cdot 2+\\tfrac34\\cdot\\tfrac12\\cdot 1=0{,}25+0{,}375=0{,}625')+'. Le celle fuori diagonale danno 0.',
  h:'Contano solo le celle '+K('(A,A)')+' e '+K('(B,B)')+': moltiplica i due pesi per il payoff.'}
];
QZ['12b']=()=>[
 {q:'Che cosa ha aggiunto, di nuovo, l\'annuncio dello straniero?',
  o:['Il fatto che sull\'isola ci sono persone con gli occhi azzurri','Il numero esatto di persone con gli occhi azzurri','Il fatto che «c\'è almeno una persona con gli occhi azzurri» è conoscenza comune','Niente: non ha effetto'],a:2,
  e:'Tutti sapevano già che c\'erano occhi azzurri: ognuno ne vede almeno 99. Non sapevano che tutti sanno che tutti sanno… L\'annuncio pubblico lo rende conoscenza comune, e l\'induzione può partire.',
  h:'Che cosa sa una persona con gli occhi azzurri prima dell\'annuncio? E che cosa sa di ciò che sanno gli altri?'}
];
QZ['12']=()=>[
 {q:'Che cos\'è una convinzione '+K('\\bel_{-i}')+'?',
  o:['La strategia mista di '+K('i'),'Una distribuzione di probabilità sulle strategie degli altri','La strategia che gli altri giocano davvero','Il payoff atteso di '+K('i')],a:1,
  e:'È ciò che '+K('i')+' crede delle scelte altrui. Può essere sbagliata, ed è soggettiva.',
  h:'Di chi sono le strategie su cui è definita?'},
 {q:'Battaglia dei sessi, '+K('\\sig_1=(1,0)')+' e '+K('\\bel_{-1}=(1/2,1/2)')+'. Payoff atteso del giocatore 1?',
  o:['2','1','0,75','0,5'],a:1,
  e:'Gioca '+K('A')+' di sicuro: con probabilità ½ prende 2, con ½ prende 0. Media 1.',
  h:'Guarda solo la riga '+K('A')+'.'},
 {q:'Il giocatore 1 della battaglia dei sessi crede che il 2 scelga '+K('A')+' con probabilità '+K('q=1/4')+'. Che cosa gli conviene?',
  o:[K('A'),K('B'),'È indifferente','Dipende dal giocatore 2'],a:1,
  e:K('A')+' gli dà '+K('2q=0{,}5')+', '+K('B')+' gli dà '+K('1-q=0{,}75')+'. Conviene '+K('A')+' solo per '+K('q \\gt 1/3')+'.',
  h:'Confronta '+K('2q')+' con '+K('1-q')+'.'},
 {q:'Quale di queste affermazioni sulla razionalità in teoria dei giochi è corretta?',
  o:['Un giocatore razionale massimizza il proprio guadagno in denaro','La razionalità esclude preferenze per l\'equità','Un giocatore razionale massimizza il suo payoff atteso soggettivo, qualunque cosa misurino i payoff','Un giocatore razionale conosce le strategie degli altri'],a:2,
  e:'La teoria accoglie ogni preferenza coerente rappresentabile con numeri. Le strategie altrui non le conosce: ha solo convinzioni.',
  h:'Che cosa possono rappresentare i payoff?'},
 {q:'Un fatto è conoscenza comune quando…',
  o:['tutti lo sanno','la maggioranza lo sa','tutti lo sanno, tutti sanno che tutti lo sanno, e così via all\'infinito','è stato annunciato'],a:2,
  e:'Il primo livello non basta, come mostra l\'isola: tutti sapevano degli occhi azzurri, ma non era conoscenza comune.',
  h:'Ripensa all\'effetto dell\'annuncio sull\'isola.'}
];

