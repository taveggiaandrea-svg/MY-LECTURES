INIT[10]=function(){
/* Scatola di Edgeworth: r = 2 (le scelte non combaciano) e r = 1 (equilibrio) */
(function(){
  const root=$('#edge10'),duo=el('div','duo');
  root.append(legend([[GRN,'retta di bilancio'],['#fff','dotazione','dot'],[YEL,'curva di Ann'],[PUR,'curva di Bob'],[PINK,'scelta di Ann','dot'],[TEAL,'scelta di Bob','dot']]),duo);
  const S=260,m=34,L=192,X=v=>m+v/6*L,Y=v=>m+L-v/6*L,f=v=>v.toFixed(1);
  const curve=(fn,lo,hi)=>{let d='';for(let i=0;i<=80;i++){const x=lo+(hi-lo)*i/80,y=fn(x);if(y<0||y>6)continue;d+=(d?'L':'M')+f(X(x))+' '+f(Y(y))}return d};
  [[2,[4,4],[5,2],'r = 2: le richieste non combaciano'],[1,[4,2],[4,2],'r = 1: equilibrio']].forEach(([r,A,B,t])=>{
    let s='<rect x="'+m+'" y="'+m+'" width="'+L+'" height="'+L+'" fill="none" stroke="#fff" stroke-width="1.5"/>';
    s+=tx(m-4,m+L+16,'Ann',{s:13,f:YEL,a:'end'})+tx(m+L+4,m-6,'Bob',{s:13,f:PUR,a:'start'});
    s+=tx(m+L/2,m+L+18,'mele di Ann →',{s:12,f:GRAY})+tx(m+L/2,m-8,'← mele di Bob',{s:12,f:GRAY});
    s+=tx(m-8,m+L/2,'banane di Ann',{s:12,f:GRAY,x:' transform="rotate(-90 '+(m-8)+' '+(m+L/2)+')"'});
    /* retta di bilancio: r x1 + x2 = 6r */
    const x0=Math.max(0,6-6/r);s+='<line x1="'+f(X(x0))+'" y1="'+f(Y(6*r-r*x0))+'" x2="'+f(X(6))+'" y2="'+f(Y(0))+'" stroke="'+GRN+'" stroke-width="2.5"/>';
    const kA=Math.pow(A[0],2)*A[1];s+='<path d="'+curve(x=>kA/(x*x),0.3,6)+'" fill="none" stroke="'+YEL+'" stroke-width="2"/>';
    const yB=[6-B[0],6-B[1]],kB=yB[0]*yB[1]*yB[1];s+='<path d="'+curve(x=>6-Math.sqrt(kB/(6-x)),0,5.9)+'" fill="none" stroke="'+PUR+'" stroke-width="2"/>';
    s+='<circle cx="'+X(6)+'" cy="'+Y(0)+'" r="6" fill="#fff" stroke="#000" stroke-width="1.5"/>';
    if(r===1)s+='<circle cx="'+X(4)+'" cy="'+Y(2)+'" r="7" fill="'+PINK+'" stroke="#000" stroke-width="1.5"/><circle cx="'+X(4)+'" cy="'+Y(2)+'" r="3.5" fill="'+TEAL+'"/>';
    else s+='<circle cx="'+X(A[0])+'" cy="'+Y(A[1])+'" r="7" fill="'+PINK+'" stroke="#000" stroke-width="1.5"/><circle cx="'+X(B[0])+'" cy="'+Y(B[1])+'" r="7" fill="'+TEAL+'" stroke="#000" stroke-width="1.5"/>';
    const note=r===1?'Ann chiede (4, 2), Bob (2, 4): in tutto <span class="ok">(6, 6)</span>.':'Ann chiede (4, 4), Bob (1, 4): in tutto <span class="bad">5 mele e 8 banane</span>.';
    cell(duo,t,s,S+20,S+12,'Scatola di Edgeworth con '+t,note);
  });
})();
/* Domanda in eccesso di mele nel gioco */
(function(){
  const root=$('#z10'),W=560,H=300+20,ax=60,ay=20,aw=470,ah=230,lo=0.25,hi=4,ymin=-3,ymax=6;
  const X=r=>ax+(r-lo)/(hi-lo)*aw,Y=v=>ay+(ymax-v)/(ymax-ymin)*ah,f=v=>v.toFixed(1);
  let s='<line x1="'+ax+'" y1="'+Y(0)+'" x2="'+(ax+aw)+'" y2="'+Y(0)+'" stroke="#fff" stroke-width="1.5"/><line x1="'+ax+'" y1="'+ay+'" x2="'+ax+'" y2="'+(ay+ah)+'" stroke="#fff" stroke-width="1.5"/>';
  [-2,0,2,4,6].forEach(v=>{s+=tx(ax-8,Y(v)+5,fmt(v),{s:13,f:GRAY,a:'end'})});
  [1,2,3,4].forEach(r=>{s+=tx(X(r),Y(0)+18,fmt(r),{s:13,f:GRAY})+'<line x1="'+X(r)+'" y1="'+(Y(0)-4)+'" x2="'+X(r)+'" y2="'+(Y(0)+4)+'" stroke="#fff"/>'});
  s+=tx(ax+aw,ay+ah+40,'prezzo relativo delle mele r',{s:13,f:GRAY,a:'end'});
  const path=fn=>{let d='';for(let i=0;i<=120;i++){const r=lo+(hi-lo)*i/120,v=fn(r);if(v>ymax)continue;d+=(d?'L':'M')+f(X(r))+' '+f(Y(v))}return d};
  s+='<path d="'+path(r=>-2)+'" fill="none" stroke="'+YEL+'" stroke-width="2.5" stroke-dasharray="7 5"/>';
  s+='<path d="'+path(r=>2/r)+'" fill="none" stroke="'+PUR+'" stroke-width="2.5" stroke-dasharray="7 5"/>';
  s+='<path d="'+path(r=>2/r-2)+'" fill="none" stroke="'+PINK+'" stroke-width="3.5"/>';
  s+='<circle cx="'+X(1)+'" cy="'+Y(0)+'" r="7" fill="'+ORG+'" stroke="#000" stroke-width="1.5"/>'+tx(X(1)-10,Y(0)+22,'equilibrio: r = 1',{s:14,f:ORG,a:'end'});
  s+=tx(X(3.2),Y(-2)+20,'Ann: −2',{s:13,f:YEL})+tx(X(0.62),Y(4.6),'Bob: 2/r',{s:13,f:PUR,a:'start'})+tx(X(1.7),Y(0.75),'totale: 2/r − 2',{s:13,f:PINK,a:'start'});
  root.append(legend([[YEL,'eccesso di Ann','dash'],[PUR,'eccesso di Bob','dash'],[PINK,'domanda in eccesso totale'],[ORG,'prezzo di equilibrio','dot']]));
  svgBox(root,W,H,s,'Domanda in eccesso di mele: Ann sempre meno 2, Bob 2 diviso r, totale 2 diviso r meno 2, che si annulla in r uguale 1','34rem');
})();
};
QZ['10a']=()=>[
 {q:'Il moderatore annuncia '+K('r=1/2')+'. Che cosa succede sul mercato delle mele?',
  o:['Torna: domanda totale 6','Domanda in eccesso: se ne chiedono 8','Offerta in eccesso: se ne chiedono 5','Nessuno vuole mele'],a:1,
  e:'Ann chiede sempre 4 mele, Bob '+K('2/r=4')+': in tutto 8, ma ce ne sono 6. Il prezzo delle mele va alzato.',
  h:'Usa le domande '+K('(4,\\ 2r)')+' e '+K('(2/r,\\ 4)')+'.'}
];
QZ['10b']=()=>[
 {q:'Con i prezzi '+K('(r,1)')+', quanto vale la ricchezza di Ann se '+K('r=3')+'?',
  o:['6','18','3','2'],a:1,
  e:'La ricchezza è il valore della dotazione: '+K('\\pp\\cdot e(\\text{Ann}) = 3\\cdot 6 + 1\\cdot 0 = 18')+'. Se le mele rincarano, Ann diventa più ricca.',
  h:'Ann possiede 6 mele e nessuna banana. Quanto valgono a quei prezzi?'}
];
QZ['10c']=()=>[
 {q:'Perché nell\'esempio con l\'esternalità l\'equilibrio non è Pareto stabile?',
  o:['Perché i prezzi non sono positivi','Perché l\'individuo 1 subisce un danno dal consumo dell\'altro, che nessun prezzo tiene in conto','Perché le preferenze non sono monotone','Perché c\'è un solo bene'],a:1,
  e:'Il secondo sceglie il bene 2 guardando solo ai prezzi e al proprio piacere; il danno che quel consumo fa al primo non entra nella sua scelta. Dando al primo metà del bene 2 e al secondo tutto il bene 1 stanno meglio entrambi: il primo passa da −1 a −0,5, il secondo da 3 a 3,5.',
  h:'Quale ipotesi usa la dimostrazione del teorema, e quale ipotesi del modello viene a mancare?'}
];
QZ['10']=()=>[
 {q:'In un\'economia con due beni e prezzi positivi tutti spendono esattamente il valore della propria dotazione, e il mercato delle mele torna. Che cosa si può dire di quello delle banane?',
  o:['Torna anch\'esso','Non si può dire nulla','Ha per forza una domanda in eccesso','Torna solo se le preferenze sono Cobb–Douglas'],a:0,
  e:'Sommando i vincoli di bilancio, '+K('\\pu\\cdot(\\text{eccesso di mele}) = -\\pd\\cdot(\\text{eccesso di banane})')+'. Con prezzi positivi, se il primo è zero lo è anche il secondo.',
  h:'Somma i vincoli di bilancio di tutti gli individui.'},
 {q:'Il gioco delle mele non soddisfa le ipotesi della proposizione di esistenza, eppure ha un equilibrio. Perché non c\'è contraddizione?',
  o:['Perché il gioco ha due soli individui','Perché le ipotesi sono sufficienti, non necessarie','Perché la domanda di Bob non è continua','Perché l\'equilibrio trovato è sbagliato'],a:1,
  e:'La proposizione dice: se valgono le ipotesi, un equilibrio esiste. Non dice che senza di esse non esiste.',
  h:'Che tipo di condizione è un «se… allora…»?'},
 {q:'Che cosa afferma il primo teorema dell\'economia del benessere?',
  o:['Ogni allocazione Pareto stabile è un equilibrio','Ogni allocazione di equilibrio è Pareto stabile','L\'equilibrio è equo','L\'equilibrio è unico'],a:1,
  e:'Dice solo che in equilibrio non si spreca nulla. Non dice niente su equità o unicità.',
  h:'In quale verso va il collegamento fra equilibrio e Pareto?'},
 {q:'Se '+K('(\\pp,\\aA)')+' è un equilibrio concorrenziale, quale di questi lo è di sicuro?',
  o:[K('(2\\pp,\\ \\aA)'),K('(\\pp,\\ 2\\aA)'),K('(\\pp + (1,1),\\ \\aA)'),K('(\\pp,\\ e)')],a:0,
  e:'Moltiplicare tutti i prezzi per lo stesso numero positivo non cambia nessun insieme di bilancio, quindi né le scelte né la realizzabilità.',
  h:'Che cosa lascia invariato l\'insieme di bilancio '+K('\\pp\\cdot x \\le \\pp\\cdot e(i)')+'?'},
 {q:'Dalla simulazione d\'esame: '+K('\\uu_A=x_1x_2')+', '+K('\\uu_B=x_1^2x_2')+', '+K('e_A=(2,3)')+', '+K('e_B=(5,4)')+', prezzi '+K('(\\pu,1)')+'. Qual è il prezzo di equilibrio del bene 1?',
  o:['1',K('25/16'),K('7/9'),'2'],a:1,
  e:'A spende metà della ricchezza '+K('2\\pu+3')+' sul bene 1: '+K('(2\\pu+3)/(2\\pu)')+'. B ne spende due terzi di '+K('5\\pu+4')+': '+K('2(5\\pu+4)/(3\\pu)')+'. Ponendo la somma uguale a 7 e moltiplicando per '+K('6\\pu')+': '+K('6\\pu+9+20\\pu+16=42\\pu')+', cioè '+K('\\pu=25/16')+'.',
  h:'Con '+K('x_1^\\alpha x_2^\\beta')+' la quota di ricchezza spesa sul bene 1 è '+K('\\alpha/(\\alpha+\\beta)')+'. Poi fai tornare il mercato del bene 1: in tutto ce ne sono 7.'}
];

