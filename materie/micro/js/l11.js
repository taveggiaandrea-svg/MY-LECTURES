INIT[11]=function(){
const pleg=()=>legend([[P1C,'giocatore 1 (payoff e nodi)','box'],[P2C,'giocatore 2','box'],['#fff','insieme di informazione con più nodi','dash']]);
/* Gioco dei prezzi: sequenziale e simultaneo */
(function(){
  const root=$('#price11'),duo=el('div','duo');root.append(pleg(),duo);
  [[false,'Sequenziale: 2 vede la scelta di 1'],[true,'Simultaneo: 2 non la vede']].forEach(([sim,t])=>{
    const n=[{id:'r',x:150,y:34,p:'1'},{id:'a',x:75,y:112,p:'2',lx:-14,ly:-4},{id:'b',x:225,y:112,p:'2',lx:14,ly:-4},
      {id:'aa',x:38,y:188,pay:[1,1]},{id:'ab',x:112,y:188,pay:[0,2]},{id:'ba',x:188,y:188,pay:[2,0]},{id:'bb',x:262,y:188,pay:[0.5,0.5]}];
    const p=sim?'':'′';
    const s=gameTree({nodes:n,edges:[['r','a','H',-9],['r','b','L',9],['a','aa','H',-9],['a','ab','L',9],['b','ba','H'+p,-9],['b','bb','L'+p,9]],infos:sim?[['a','b']]:[]});
    cell(duo,t,s,300,222,'Albero del gioco dei prezzi, versione '+(sim?'simultanea':'sequenziale'));
  });
})();
/* Sasso, carta, forbici */
(function(){
  const root=$('#rps11'),A=['R','P','S'],beats={R:'S',S:'P',P:'R'};
  const nodes=[{id:'r',x:300,y:34,p:'1'}],edges=[];
  A.forEach((a,i)=>{const cx=100+i*200;nodes.push({id:a,x:cx,y:112,p:i===0?'2':'',lx:-14,ly:-4});edges.push(['r',a,a,i===0?-9:i===2?9:9]);
    A.forEach((b,j)=>{const id=a+b,v=a===b?0:beats[a]===b?1:-1;nodes.push({id,x:cx-62+j*62,y:190,pay:[v,-v]});edges.push([a,id,b,j===0?-8:8])})});
  root.append(pleg());
  svgBox(root,600,224,gameTree({nodes,edges,infos:[['R','P','S']]}),'Albero di sasso, carta, forbici con il giocatore 2 in un unico insieme di informazione','36rem');
})();
/* Il gioco con tre decisioni */
(function(){
  const root=$('#tree11');
  const nodes=[{id:'r',x:50,y:70,p:'1'},{id:'o1',x:50,y:160,pay:[2,2]},{id:'n2',x:180,y:70,p:'2'},{id:'o2',x:180,y:160,pay:[1,3]},
    {id:'n3',x:310,y:70,p:'1'},{id:'a',x:270,y:160,pay:[4,2]},{id:'b',x:350,y:160,pay:[3,4]}];
  const edges=[['r','o1','O',9],['r','n2','I',0],['n2','o2','O',9],['n2','n3','I',0],['n3','a','A',-9],['n3','b','B',9]];
  let s=gameTree({nodes,edges}).replace(/<text x="115" y="68"/,'<text x="115" y="60"');
  root.append(pleg());
  svgBox(root,400,196,s,'Albero: il giocatore 1 sceglie O o I; dopo I il giocatore 2 sceglie O o I; dopo I il giocatore 1 sceglie A o B','28rem');
})();
/* Strategie come funzioni: il progetto benefico */
(function(){
  const root=$('#charity11'),W=420,H=330,ax=58,ay=16,L=260,X=v=>ax+v/600*L,Y=v=>ay+L-v/600*L,f=v=>v.toFixed(1);
  let s='<path d="M'+ax+' '+ay+'V'+(ay+L)+'H'+(ax+L)+'" fill="none" stroke="#fff" stroke-width="1.5"/>';
  [0,300,600].forEach(v=>{s+=tx(X(v),ay+L+18,v,{s:13,f:GRAY})+(v?tx(ax-8,Y(v)+5,v,{s:13,f:GRAY,a:'end'}):'')});
  s+=tx(ax+L/2,ay+L+38,'contributo osservato x',{s:13,f:GRAY})+tx(16,ay+L/2,'risposta y = s₂(x)',{s:13,f:GRAY,x:' transform="rotate(-90 16 '+(ay+L/2)+')"'});
  s+='<line x1="'+X(300)+'" y1="'+Y(600)+'" x2="'+X(600)+'" y2="'+Y(300)+'" stroke="#777" stroke-width="1.4" stroke-dasharray="5 5"/>'+tx(X(290),Y(560),'x + y = 900',{s:12,f:GRAY,a:'end'});
  s+='<path d="M'+f(X(0))+' '+f(Y(0))+'H'+f(X(300))+'M'+f(X(300))+' '+f(Y(600))+'L'+f(X(600))+' '+f(Y(300))+'" fill="none" stroke="'+P2C+'" stroke-width="3.5"/>';
  s+='<circle cx="'+X(300)+'" cy="'+Y(0)+'" r="4" fill="#000" stroke="'+P2C+'" stroke-width="2"/>';
  s+='<line x1="'+X(0)+'" y1="'+Y(300)+'" x2="'+X(600)+'" y2="'+Y(300)+'" stroke="'+TEAL+'" stroke-width="3" stroke-dasharray="9 5"/>';
  root.append(legend([[P2C,'«completo quello che manca, se posso»'],[TEAL,'«verso sempre 300»','dash']]));
  svgBox(root,W,H,s,'Due strategie del giocatore 2 come funzioni del contributo osservato','26rem');
})();
/* Forma normale del gioco con tre decisioni */
(function(){
  const m=gameMatrix(['OA','OB','IA','IB'],['O','I'],[[[2,2],[2,2]],[[2,2],[2,2]],[[1,3],[4,2]],[[1,3],[3,4]]],{cw:84,x0:60});
  svgBox($('#nf11'),m.W,m.H,m.s,'Matrice del gioco con tre decisioni','16rem');
})();
/* Gioco dei prezzi in forma normale */
(function(){
  const root=$('#nfp11'),duo=el('div','duo');root.append(duo);
  const a=gameMatrix(['H','L'],["HH′","HL′","LH′","LL′"],[[[1,1],[1,1],[0,2],[0,2]],[[2,0],[0.5,0.5],[2,0],[0.5,0.5]]],{cw:66,x0:40,ps:13});
  const b=gameMatrix(['H','L'],['H','L'],[[[1,1],[0,2]],[[2,0],[0.5,0.5]]],{cw:80,x0:40});
  cell(duo,'Sequenziale',a.s,a.W,a.H,'Matrice 2 per 4 del gioco dei prezzi sequenziale');
  cell(duo,'Simultaneo',b.s,b.W,b.H,'Matrice 2 per 2 del gioco dei prezzi simultaneo');
})();
/* Giochi classici */
(function(){
  const root=$('#classic11'),g=el('div','multi');root.append(g);
  [['Matching pennies',['T','C'],['T','C'],[[[1,-1],[-1,1]],[[-1,1],[1,-1]]]],
   ['Dilemma del prigioniero',['C','D'],['C','D'],[[[2,2],[0,3]],[[3,0],[1,1]]]],
   ['Battaglia dei sessi',['A','B'],['A','B'],[[[2,1],[0,0]],[[0,0],[1,2]]]],
   ['Falco e colomba',['H','D'],['H','D'],[[[0,0],[3,1]],[[1,3],[2,2]]]],
   ['Coordinamento',['A','B'],['A','B'],[[[1,1],[0,0]],[[0,0],[1,1]]]],
   ['Coordinamento di Pareto',['A','B'],['A','B'],[[[2,2],[0,0]],[[0,0],[1,1]]]]].forEach(([t,r,c,v])=>{
    const m=gameMatrix(r,c,v,{cw:66,x0:34,y0:24});cell(g,t,m.s,m.W,m.H,t)});
})();
};
QZ['11a']=()=>[
 {q:'Nella versione simultanea del gioco dei prezzi, quanti insiemi di informazione ha l\'impresa 2, e quante scelte deve specificare?',
  o:['Due insiemi, due scelte','Un insieme, una scelta','Due insiemi, una scelta','Un insieme, due scelte'],a:1,
  e:'I suoi due nodi sono uniti da un unico insieme di informazione: non sa dove si trova, quindi può decidere una cosa sola. Nella versione sequenziale gli insiemi sono due, e le scelte due.',
  h:'Conta i gruppi di nodi che l\'impresa 2 non sa distinguere.'}
];
QZ['11b']=()=>[
 {q:'Nel gioco con tre decisioni, quanti profili di strategie ci sono?',
  o:['4','6','8','3'],a:2,
  e:'Il giocatore 1 ha 4 strategie ('+K('OA, OB, IA, IB')+'), il giocatore 2 ne ha 2 ('+K('O, I')+'): i profili sono '+K('4\\times 2=8')+', le celle della matrice.',
  h:'L\'insieme dei profili è il prodotto cartesiano dei due spazi di strategie.'}
];
QZ['11']=()=>[
 {q:'Che cos\'è una strategia?',
  o:['L\'azione che il giocatore sceglie per prima','Un piano che dice che cosa fare in ogni insieme di informazione del giocatore','Una distribuzione di probabilità sulle azioni','Il cammino seguito nell\'albero durante la partita'],a:1,
  e:'È un piano completo e contingente, anche per gli insiemi di informazione che il piano stesso non raggiunge.',
  h:'Ricorda perché '+K('O')+' da solo non basta come strategia.'},
 {q:'In un gioco delle slide '+K('\\sS_1=\\{O,A,P\\}')+' e '+K('\\sS_2=\\{A,P\\}')+'. Quanti profili di strategie ci sono?',
  o:['5','6','9','3'],a:1,
  e:K('3\\times 2=6')+'.',
  h:'Moltiplica il numero di strategie dei due giocatori.'},
 {q:'Nell\'albero con tre decisioni, quale profilo dà al giocatore 1 il payoff 4?',
  o:[K('(OA,\\ I)'),K('(IA,\\ I)'),K('(IA,\\ O)'),K('(IB,\\ I)')],a:1,
  e:'Il giocatore 1 entra, il 2 entra, il 1 sceglie '+K('A')+': si arriva alla foglia '+K('(4,2)')+'. È l\'esempio delle slide, '+K('\\uu_1(IA,I)=4')+'.',
  h:'Parti dalla radice e segui le azioni prescritte.'},
 {q:'Il passaggio fra forma estesa e forma normale…',
  o:['è unico in entrambi i versi','è unico dalla forma estesa alla normale, ma non al contrario','è unico dalla normale all\'estesa, ma non al contrario','non è mai unico'],a:1,
  e:'A ogni albero corrisponde una sola matrice; la stessa matrice può venire da alberi diversi, come il gioco dei prezzi simultaneo con l\'una o l\'altra impresa alla radice.',
  h:'Pensa a sasso, carta, forbici con l\'uno o l\'altro giocatore alla radice.'},
 {q:'Nel progetto benefico il giocatore 2 osserva il contributo '+K('x')+' prima di scegliere. Che cos\'è una sua strategia?',
  o:['Un numero in '+K('[0,600]'),'Una coppia di numeri','Una funzione che a ogni '+K('x')+' associa un '+K('y')+' in '+K('[0,600]'),'Una probabilità su '+K('[0,600]')],a:2,
  e:'Ha un insieme di informazione per ogni '+K('x')+' possibile, e il piano deve dire che cosa fa in ciascuno.',
  h:'Quanti insiemi di informazione ha il giocatore 2?'}
];

