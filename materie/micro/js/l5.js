INIT[5]=function(){
/* Stati del mondo e atti: la tabella delle slide in un solo disegno */
(function(){
  const root=$('#states5'),ST=['ABC','ACB','BAC','BCA','CAB','CBA'],rh=40,W=560,y0=44;
  let s=tx(40,26,'stato',{s:13,f:GRAY})+tx(190,26,'ordine d\'arrivo',{s:13,f:GRAY})+tx(380,26,'atto f',{s:15,f:PINK,i:1})+tx(490,26,'atto g',{s:15,f:PUR,i:1});
  ST.forEach((o,k)=>{const y=y0+k*rh,fw=o[0]==='A',gw=o[0]==='C';
    s+='<line x1="10" y1="'+y+'" x2="'+(W-10)+'" y2="'+y+'" stroke="#2a2a2a"/>'+tx(40,y+rh/2+5,k+1,{s:15});
    o.split('').forEach((h,i)=>{const cx=140+i*50;
      s+='<circle cx="'+cx+'" cy="'+(y+rh/2)+'" r="'+(i?12:15)+'" fill="'+(i?'none':'#fff')+'" stroke="'+(i?'#777':'#fff')+'" stroke-width="1.5"/>'+tx(cx,y+rh/2+5,h,{s:i?14:16,f:i?'#c9c9c9':'#000',w:i?400:600})});
    [[380,fw,'+10'],[490,gw,'+20']].forEach(a=>{s+='<rect x="'+(a[0]-36)+'" y="'+(y+6)+'" width="72" height="'+(rh-12)+'" rx="4" fill="'+(a[1]?GRN:'none')+'" stroke="'+(a[1]?GRN:RED)+'" stroke-width="1.4"/>'+tx(a[0],y+rh/2+5,a[1]?a[2]:'−10',{s:15,f:a[1]?'#000':RED})});
  });
  s+=tx(140,y0+6*rh+20,'1°',{s:13,f:GRAY})+tx(190,y0+6*rh+20,'2°',{s:13,f:GRAY})+tx(240,y0+6*rh+20,'3°',{s:13,f:GRAY});
  root.append(legend([['#fff','il cavallo che vince','dot'],[GRN,'la scommessa paga (euro)','box'],[RED,'la scommessa perde (euro)','dash']]));
  svgBox(root,W,y0+6*rh+28,s,'Tabella dei sei stati del mondo con i pagamenti degli atti f e g: f paga 10 quando vince Ace, g paga 20 quando vince Challenger, altrimenti si perdono 10','34rem');
})();
/* Il triangolo delle convinzioni: chi sceglie f e chi sceglie g */
(function(){
  const root=$('#seu5'),A=[60,330],C=[500,330],B=[280,36];
  const P=(a,b,c)=>[a*A[0]+b*B[0]+c*C[0],a*A[1]+b*B[1]+c*C[1]];
  const M=P(.6,0,.4),pp=p=>p[0].toFixed(1)+' '+p[1].toFixed(1);
  let s='<path d="M'+pp(A)+'L'+pp(B)+'L'+pp(M)+'Z" fill="'+PINK+'" fill-opacity=".28"/><path d="M'+pp(B)+'L'+pp(C)+'L'+pp(M)+'Z" fill="'+PUR+'" fill-opacity=".28"/>';
  s+='<path d="M'+pp(A)+'L'+pp(B)+'L'+pp(C)+'Z" fill="none" stroke="#fff" stroke-width="1.5"/><line x1="'+B[0]+'" y1="'+B[1]+'" x2="'+M[0]+'" y2="'+M[1]+'" stroke="#fff" stroke-width="2.5"/>';
  s+=tx(A[0]-8,A[1]+22,'vince Ace di sicuro',{s:13,f:GRAY,a:'start'})+tx(C[0]+8,C[1]+22,'vince Challenger di sicuro',{s:13,f:GRAY,a:'end'})+tx(B[0],B[1]-12,'vince Bolt di sicuro',{s:13,f:GRAY});
  s+=tx(150,314,'sceglie f',{s:17,f:PINK})+tx(372,314,'sceglie g',{s:17,f:PUR});
  const D=P(.5,.3,.2),E=P(.3,.3,.4);
  s+='<circle cx="'+D[0]+'" cy="'+D[1]+'" r="7" fill="#fff" stroke="#000" stroke-width="1.5"/>'+tx(D[0]-12,D[1]-4,'Dario',{s:14,a:'end'})+tx(D[0]-12,D[1]+14,'A 50%, B 30%, C 20%',{s:12,f:'#c9c9c9',a:'end'});
  s+='<circle cx="'+E[0]+'" cy="'+E[1]+'" r="7" fill="#fff" stroke="#000" stroke-width="1.5"/>'+tx(E[0]+12,E[1]-4,'Elena',{s:14,a:'start'})+tx(E[0]+12,E[1]+14,'A 30%, B 30%, C 40%',{s:12,f:'#c9c9c9',a:'start'});
  s+=tx(M[0],M[1]+20,'A 60%, C 40%',{s:12,f:GRAY});
  root.append(legend([[PINK,'convinzioni per cui conviene f','box'],[PUR,'convinzioni per cui conviene g','box'],['#fff','confine: π(vince A) = 1,5 · π(vince C)']]));
  svgBox(root,560,360,s,'Triangolo delle probabilità soggettive di vittoria dei tre cavalli, diviso dalla retta in cui la probabilità di Ace è una volta e mezza quella di Challenger','34rem');
})();
};
QZ['5a']=()=>[
 {q:'Un terzo atto: 10 euro alla pari su Bolt. In quanti dei sei stati del mondo fa vincere 10 euro?',
  o:['Uno','Due','Tre','Dipende dalle probabilità'],a:1,
  e:'Bolt vince negli stati BAC e BCA. Per descrivere l\'atto bastano gli stati e i premi: le probabilità non servono.',
  h:'Scorri la colonna dell\'ordine d\'arrivo e conta le righe in cui Bolt è primo.'}
];
QZ['5b']=()=>[
 {q:'Una persona neutrale al rischio crede che Ace vinca con probabilità 0,4, Bolt con 0,3 e Challenger con 0,3. Quale atto sceglie?',
  o:[K('\\af')+', perché Ace è il favorito',K('\\ag')+', perché ha l\'utilità attesa più alta','È indifferente','Non si può dire senza le probabilità oggettive'],a:1,
  e:K('\\UU(\\af)=0{,}4\\cdot 10-0{,}6\\cdot 10=-2')+' e '+K('\\UU(\\ag)=0{,}3\\cdot 20-0{,}7\\cdot 10=-1')+'. Infatti '+K('0{,}4/0{,}3\\approx 1{,}33 \\lt 1{,}5')+': Ace è favorito, ma non abbastanza da compensare il premio doppio su Challenger.',
  h:'Calcola le due utilità attese con '+K('\\vv(z)=z')+', oppure confronta '+K('0{,}4/0{,}3')+' con '+K('3/2')+'.'}
];
QZ['5']=()=>[
 {q:'Che cos\'è un atto?',
  o:['Una distribuzione di probabilità sui premi','Una funzione che a ogni stato del mondo associa un premio','Una probabilità per ogni stato del mondo','Una funzione di utilità sui premi'],a:1,
  e:'Un atto dice che cosa si ottiene in ciascuno stato. La prima risposta descrive una lotteria, la terza le convinzioni '+K('\\ppi')+'.',
  h:'Nella tabella della corsa, un atto è una colonna intera.'},
 {q:'Perché per la corsa dei cavalli non bastano le lotterie delle lezioni 3 e 4?',
  o:['Perché i premi non sono in denaro','Perché gli esiti possibili sono più di due','Perché le probabilità non sono note né osservabili','Perché gli scommettitori non sono razionali'],a:2,
  e:'Una lotteria è un elenco di premi con le loro probabilità. Per il SuperEnalotto quei numeri esistono; per una corsa no.',
  h:'Che cosa serve per scrivere una lotteria, oltre ai premi?'},
 {q:'Due persone hanno la stessa funzione '+K('\\vv')+' e davanti agli stessi due atti scelgono in modo diverso. Secondo la SEU, perché?',
  o:['Almeno una delle due non è razionale','Attribuiscono probabilità diverse agli stati del mondo','Gli atti danno premi diversi alle due persone','Non può succedere'],a:1,
  e:'Nella SEU le probabilità '+K('\\ppi')+' sono soggettive: con la stessa '+K('\\vv')+', convinzioni diverse bastano a cambiare la scelta. È il caso di Dario ed Elena.',
  h:'Nella formula della SEU ci sono due ingredienti personali. Uno è '+K('\\vv')+'; l\'altro?'},
 {q:'Con '+K('\\vv')+' lineare, per chi crede che Challenger vinca con probabilità 0,2 l\'atto '+K('\\af')+' è preferito a '+K('\\ag')+' quando la probabilità di vittoria di Ace è almeno…',
  o:['0,2','0,3','0,4','0,5'],a:1,
  e:'Serve '+K('\\ppi(\\text{vince A}) \\ge \\tfrac32\\cdot 0{,}2=0{,}3')+'.',
  h:'Usa la soglia: la probabilità di Ace deve essere almeno una volta e mezza quella di Challenger.'}
];

