INIT[8]=function(){
/* Apertura e ritorno: cercare il paniere migliore sulla retta di bilancio */
function chase(root,withMrs){
  const P1=2,P2=1,W=20,pl=plane(20,[0,10,20],'Insieme di bilancio, curva di indifferenza e paniere z trascinabile sulla retta di bilancio');
  pl.svg.style.touchAction='none';pl.svg.style.cursor='grab';
  const st={x:withMrs?2:8},o=out();
  const lg=[[GRN,'panieri acquistabili','box'],[BLUE,'curva di indifferenza di z'],[TEAL,'acquistabili e migliori di z','box']];
  if(withMrs)lg.push(['#fff','retta con pendenza −MRS(z)']);
  root.append(legend(lg),pl.svg,o);
  function draw(){
    const z=[st.x,W-P1*st.x],u=z[0]*z[1],best=Math.abs(st.x-5)<1e-9;
    let s=pl.tri(P1,P2,W,GRN);
    if(!best){const d=Math.sqrt(400-8*u),a=(20-d)/4,b=(20+d)/4,pts=[[a,W-P1*a],[b,W-P1*b]];
      for(let i=0;i<=40;i++){const x=b+(a-b)*i/40;pts.push([x,u/x])}
      s+='<path d="'+pl.path(pts)+'Z" fill="'+TEAL+'" fill-opacity=".5"/>'}
    s+='<path d="'+pl.path(hyp(u,20))+'" fill="none" stroke="'+BLUE+'" stroke-width="3"/>'+pl.bline(P1,P2,W,GRN);
    if(withMrs){const m=z[1]/z[0],n=Math.hypot(1,m),dx=6/n,dy=6*m/n;
      s+='<line x1="'+pl.X(z[0]-dx)+'" y1="'+pl.Y(z[1]+dy)+'" x2="'+pl.X(z[0]+dx)+'" y2="'+pl.Y(z[1]-dy)+'" stroke="#fff" stroke-width="2"/>'}
    pl.svg.innerHTML=pl.defs+pl.clip(s)+pl.axes()+pl.dot(z,'#fff',9)+pl.lab(z,'z',14,-12);
    let h;
    if(!withMrs){
      h=K('z='+pt(z))+' costa '+K('2\\cdot'+tn(z[0])+'+1\\cdot'+tn(z[1])+'=20')+', e vale '+K('\\uu(z)='+tn(u))+'.<br>'+
        (best?'<span class="ok">Nessun paniere acquistabile è migliore di questo.</span> La curva tocca la retta senza attraversarla.'
             :'Puoi permetterti di meglio: spostati verso '+(st.x>5?'meno bene 1 e più bene 2':'più bene 1 e meno bene 2')+'.');
    }else{
      const m=z[1]/z[0];
      h=K('\\mrs(z)=z_2/z_1='+tn(m)+'\\qquad \\pu/\\pd=2')+'<br>'+
        (best?'<span class="ok">I due tassi coincidono:</span> nessuno scambio conviene. È la soluzione, '+K('(5;\\,10)')+'.'
         :m<2?'Per te un\'unità del bene 1 vale '+fmt(m)+' unità del bene 2, ma al mercato ne costa 2: conviene cedere bene 1.'
             :'Per te un\'unità del bene 1 vale '+fmt(m)+' unità del bene 2 e al mercato ne costa solo 2: conviene comprarne ancora.');
    }
    o.innerHTML=h;
  }
  drag(pl.svg,e=>{const [px,py]=svgPoint(pl.svg,e,S,S),vx=(px-x0)/L*20,vy=(y0+L-py)/L*20;
    st.x=r1(clamp((vx+40-2*vy)/5,0.5,9.5));draw()});
  draw();
}
chase($('#open5'),false);
chase($('#mrs5'),true);

/* Il problema del consumatore per tre preferenze */
(function(){
  const root=$('#opt5'),W=12,Rg=20,pl=plane(Rg,[0,10,20],'Soluzione del problema del consumatore per tre preferenze');
  const PF=[
    {t:'complementari: min{x₁, x₂}',bg:[3,6,9,12,15].map(m=>[[m,Rg],[m,m],[Rg,m]]),cur:x=>{const m=Math.min(x[0],x[1]);return [[m,Rg],[m,m],[Rg,m]]}},
    {t:'sostituti: x₁ + x₂',bg:[5,10,15,20,25,30].map(k=>[[0,k],[k,0]]),cur:x=>{const k=x[0]+x[1];return [[0,k],[k,0]]}},
    {t:'x₁ · x₂',bg:[4,16,49,100,169].map(k=>hyp(k,Rg)),cur:x=>hyp(x[0]*x[1],Rg)}];
  const st={f:0,p1:1,p2:2},o=out();
  const bs=PF.map((r,i)=>{const b=btn(r.t);b.onclick=()=>{st.f=i;draw()};return b});
  root.append(group('Scegli il consumatore',bs),legend([[GRN,'insieme di bilancio','box'],[GRAY,'curve di indifferenza'],[BLUE,'curva della soluzione'],[PINK,'soluzione','dot']]),pl.svg,
    slider('prezzo del bene 1',0.6,3,0.1,st.p1,v=>{st.p1=v;draw()}),slider('prezzo del bene 2',0.6,3,0.1,st.p2,v=>{st.p2=v;draw()}),o);
  function draw(){
    bs.forEach((b,i)=>press(b,i===st.f));
    const a=st.p1,b=st.p2,eq=Math.abs(a-b)<1e-9;let x,all=false,h;
    if(st.f===0){x=[W/(a+b),W/(a+b)];h=K('x^*='+pt(x))+': quantità uguali, '+K('\\wl/(\\pu+\\pd)=12/'+tn(a+b))+'.'}
    else if(st.f===1){if(eq){all=true;x=[W/(2*a),W/(2*b)];h='I due prezzi sono uguali: <span class="ok">ogni paniere della retta di bilancio è una soluzione.</span>'}
      else{x=a<b?[W/a,0]:[0,W/b];h=K('x^*='+pt(x))+': il bene '+(a<b?1:2)+' costa meno, e tutta la ricchezza va lì.'}}
    else{x=[W/(2*a),W/(2*b)];h=K('x^*='+pt(x))+': metà della ricchezza per ciascun bene, '+K('\\wl/(2\\pu)')+' e '+K('\\wl/(2\\pd)')+'.'}
    let s=pl.tri(a,b,W,GRN);
    PF[st.f].bg.forEach(c=>{s+='<path d="'+pl.path(c)+'" fill="none" stroke="'+GRAY+'" stroke-width="1.2"/>'});
    s+=pl.bline(a,b,W,GRN)+'<path d="'+pl.path(PF[st.f].cur(x))+'" fill="none" stroke="'+BLUE+'" stroke-width="3"'+(all?' stroke-dasharray="2 7"':'')+'/>';
    if(all)s+=pl.bline(a,b,W,PINK,'stroke-linecap="round" stroke-width="6"').replace('stroke-width="3"','');
    pl.svg.innerHTML=pl.defs+pl.clip(s)+pl.axes()+(all?'':pl.dot(x,PINK,8));
    o.innerHTML=h;
  }
  draw();
})();

/* Soluzione interna o d'angolo: u = x1 + radice di x2 */
(function(){
  const root=$('#corner5'),W=6,Rg=7,pl=plane(Rg,[0,2,4,6],'Soluzione del problema del consumatore con utilità x1 più radice di x2');
  const st={p1:2},o=out();
  root.append(legend([[GRN,'insieme di bilancio','box'],[GRAY,'curve di indifferenza'],[BLUE,'curva della soluzione'],[PINK,'soluzione','dot']]),pl.svg,
    slider('prezzo del bene 1',1,8,0.1,st.p1,v=>{st.p1=v;draw()}),o);
  function draw(){
    const p=st.p1,inner=2*Math.sqrt(W)>=p,x=inner?[W/p-p/4,p*p/4]:[0,W],m=2*Math.sqrt(x[1]);
    let s=pl.tri(p,1,W,GRN);
    [1.5,3,4.5,6,7.5].forEach(k=>{s+='<path d="'+pl.path(qcurve(k,Rg))+'" fill="none" stroke="'+GRAY+'" stroke-width="1.2"/>'});
    s+=pl.bline(p,1,W,GRN)+'<path d="'+pl.path(qcurve(x[0]+Math.sqrt(x[1]),Rg))+'" fill="none" stroke="'+BLUE+'" stroke-width="3"/>';
    pl.svg.innerHTML=pl.defs+pl.clip(s)+pl.axes()+pl.dot(x,PINK,8);
    o.innerHTML=K('x^*='+pt(x)+'\\qquad \\mrs(x^*)=2\\sqrt{x_2^*}='+tn(m)+'\\qquad \\pu/\\pd='+tn(p))+'<br>'+
      (inner?'<span class="ok">Soluzione interna:</span> il saggio marginale di sostituzione è pari al rapporto fra i prezzi.'
            :'<span class="bad">Soluzione d\'angolo:</span> tutta la ricchezza nel bene 2, e '+K('\\mrs(x^*) \\lt \\pu/\\pd')+'. Venderebbe altro bene 1, ma non ne ha.');
  }
  draw();
})();

/* UMP ed EMP: lo stesso punto visto da due problemi */
(function(){
  const root=$('#dual8'),duo=el('div','duo'),Rg=5.4;
  const hp=k=>{const a=[];for(let i=0;i<=60;i++){const x=k/Rg+(Rg-k/Rg)*Math.pow(i/60,2);a.push([x,k/x])}return a};
  root.append(legend([[GRN,'ciò che è fissato'],[GRAY,'ciò che si fa variare'],[BLUE,'il livello ottimo'],[PINK,'soluzione','dot']]),duo);
  (function(){const m=mini(Rg,280);
    let s=m.tri(2,1,4,GRN,.25);[1,3.4].forEach(k=>{s+=m.path(hp(k),GRAY,1.5)});
    s+=m.path(hp(2),BLUE,3)+m.bl(2,1,4,GRN,3)+m.dot([1,2],PINK,7);
    s+=m.lab([3.4,1.5],'u = 2',0,0,BLUE,13)+m.lab([1,2],'(1, 2)',10,-6,PINK,14);
    cell(duo,'Massimo dell\'utilità',m.axes()+s,m.S,m.H,'Insieme di bilancio con ricchezza 4 e tre curve di indifferenza: la più alta che lo tocca passa per (1, 2)',
      'Ricchezza fissa a 4: la curva più alta che tocca il triangolo è '+K('\\uu=2')+'.')})();
  (function(){const m=mini(Rg,280);
    const up=hp(2);let d='M'+up.map(p=>m.X(p[0]).toFixed(1)+' '+m.Y(p[1]).toFixed(1)).join('L')+'L'+m.X(Rg).toFixed(1)+' '+m.Y(Rg).toFixed(1)+'Z';
    let s='<path d="'+d+'" fill="'+GRN+'" fill-opacity=".22"/>';
    s+=m.bl(2,1,3,GRAY,1.5)+m.bl(2,1,5,GRAY,1.5)+m.bl(2,1,4,BLUE,3)+m.path(up,GRN,3)+m.dot([1,2],PINK,7);
    s+=m.lab([1.5,0],'3',-4,-8,GRAY,13,'end')+m.lab([2,0],'4',2,-8,BLUE,13)+m.lab([2.5,0],'5',6,-8,GRAY,13);
    s+=m.lab([3.2,3.6],'utilità ≥ 2',0,0,GRN,13,'middle')+m.lab([1,2],'(1, 2)',10,-6,PINK,14)+tx(m.X(2),m.Y(0)+0,'',{});
    cell(duo,'Minimo della spesa',m.axes()+s,m.S,m.H,'Regione con utilità almeno 2 e tre rette di spesa 3, 4 e 5: la più bassa che la tocca passa per (1, 2)',
      'Utilità fissa a 2: la retta di spesa più bassa che tocca la regione è quella da 4.')})();
})();
/* Compensazione di Hicks */
(function(){
  const root=$('#hicks8'),pl=plane(26,[0,12,24],'Compensazione di Hicks dopo un aumento del prezzo del bene 2');
  const A=[6,6],B=[12,3],C=[6,1.5];
  let s=pl.tri(1,4,24,GRN,.2)+pl.bline(1,1,12,GRAY,'stroke-dasharray="6 6"').replace('stroke-width="3"','stroke-width="2"')+
    pl.bline(1,4,12,GRN).replace('stroke-width="3"','stroke-width="1.6"')+pl.bline(1,4,24,GRN)+
    '<path d="'+pl.path(hyp(36,26))+'" fill="none" stroke="'+BLUE+'" stroke-width="3"/>';
  const T=(p,t,dx,dy,c,a)=>'<text x="'+(pl.X(p[0])+dx)+'" y="'+(pl.Y(p[1])+dy)+'" font-size="14" text-anchor="'+(a||'start')+'" style="paint-order:stroke;stroke:#000;stroke-width:4px;fill:'+c+'">'+t+'</text>';
  pl.svg.innerHTML=pl.defs+pl.clip(s)+pl.axes()+pl.dot(A,'#fff',8)+pl.dot(B,PINK,8)+pl.dot(C,PUR,7)+
    T(A,'(6, 6)',12,-10,'#fff')+T(B,'(12, 3)',6,-14,PINK)+T([2.6,13.8],'utilità 36',8,0,BLUE);
  root.append(legend([[GRAY,'retta di partenza, prezzi (1, 1)','dash'],[GRN,'nuovi prezzi (1, 4): sottile con ricchezza 12, spessa con 24'],[BLUE,'curva di indifferenza di partenza'],['#fff','scelta di partenza','dot'],[PINK,'domanda compensata','dot'],[PUR,'domanda senza compensazione','dot']]),pl.svg);
})();
};
QZ['8a']=()=>[
 {q:'Un consumatore con '+K('\\uu=\\min\\{x_1,x_2\\}')+' ha ricchezza 18 e affronta i prezzi '+K('(2,\\,1)')+'. Quale paniere compra?',
  o:[K('(9;\\,0)'),K('(4{,}5;\\,9)'),K('(6;\\,6)'),K('(0;\\,18)')],a:2,
  e:'Quantità uguali, spendendo tutto: '+K('\\wl/(\\pu+\\pd)=18/3=6')+' di ciascun bene.',h:'La soluzione ha la stessa quantità dei due beni e sta sulla retta di bilancio.'}
];
QZ['8b']=()=>[
 {q:'Un consumatore con '+K('\\uu=x_1x_2')+' ha ricchezza 12 e affronta i prezzi '+K('(2,\\,1)')+'. Quale paniere compra?',
  o:[K('(6;\\,6)'),K('(4;\\,4)'),K('(6;\\,0)'),K('(3;\\,6)')],a:3,
  e:'Spende 6 per ciascun bene: '+K('6/2=3')+' e '+K('6/1=6')+'. Infatti '+K('\\mrs=x_2/x_1=6/3=2=\\pu/\\pd')+'.',h:'Con questa utilità la ricchezza si divide a metà fra i due beni: quante unità compra con ciascuna metà?'}
];
QZ['8c']=()=>[
 {q:'In un paniere '+K('z')+' sulla retta di bilancio vale '+K('\\mrs(z)=3')+', mentre '+K('\\pu/\\pd=2')+'. Che cosa conviene fare?',
  o:['Niente: '+K('z')+' è già la soluzione','Cedere bene 1 e comprare più bene 2','Comprare più bene 1 cedendo bene 2','Spendere meno di tutta la ricchezza'],a:2,
  e:'Per il consumatore un\'unità del bene 1 vale 3 unità del bene 2, ma al mercato ne costa solo 2: ogni unità in più del bene 1 è un affare.',
  h:'Confronta quanto vale per te un\'unità del bene 1 con quanto costa, tutto misurato in unità del bene 2.'}
];
QZ['8d']=()=>[
 {q:'Stessi prezzi '+K('(2,\\,1)')+' e stessa utilità '+K('\\uu=x_1x_2')+', ma ora l\'utilità richiesta è 8. Qual è la spesa minima?',
  o:['4','6','8','16'],a:2,
  e:'Nel punto ottimo '+K('\\mrs=x_2/x_1=2')+', quindi '+K('x_2=2x_1')+'; con '+K('x_1x_2=8')+' si ottiene '+K('(2;\\,4)')+', che costa '+K('2\\cdot 2+4=8')+'.',
  h:'Anche qui la curva tocca la retta dove '+K('\\mrs=\\pu/\\pd')+'. Trova il punto della curva '+K('x_1x_2=8')+' con '+K('x_2/x_1=2')+'.'}
];
QZ['8']=()=>[
 {q:'La preferenza è monotona, convessa e differenziabile, e nella soluzione '+K('x^*')+' il consumatore non compra il bene 1: '+K('x^*_1=0')+'. Che cosa si può dire di sicuro?',
  o:[K('\\mrs(x^*) = \\pu/\\pd'),K('\\mrs(x^*) \\le \\pu/\\pd'),K('\\mrs(x^*) \\ge \\pu/\\pd'),'Niente: nell\'angolo il saggio marginale di sostituzione non è definito'],a:1,
  e:'Il bene 1 vale per lui al più quanto costa. Non può venderne altro, quindi l\'uguaglianza non è garantita.',h:'Pensa all\'esempio con '+K('\\uu=x_1+\\sqrt{x_2}')+' quando il bene 1 è molto caro.'},
 {q:'Un consumatore con '+K('\\uu=x_1^{1/2}x_2^{1/2}')+' ha ricchezza 12 e affronta i prezzi '+K('(1,\\,4)')+'. Quanto vale l\'utilità indiretta '+K('\\vv(\\pp,\\wl)')+'?',
  o:['3','6','9','12'],a:0,
  e:'Spende 6 per bene: compra '+K('(6;\\,1{,}5)')+', e '+K('\\sqrt{6\\cdot 1{,}5}=\\sqrt{9}=3')+'. Con la formula: '+K('\\tfrac12\\cdot 12/(1^{1/2}\\cdot 4^{1/2})=3')+'.',
  h:'Trova prima il paniere domandato (metà della ricchezza per bene), poi calcola la sua utilità.'},
 {q:'Tutti i prezzi raddoppiano e l\'utilità richiesta '+K('\\ub')+' resta la stessa. Che cosa succede alla domanda compensata e alla funzione di spesa?',
  o:[K('\\hh')+' raddoppia, '+K('\\ee')+' resta uguale',K('\\hh')+' resta uguale, '+K('\\ee')+' raddoppia','Raddoppiano entrambe','Restano uguali entrambe'],a:1,
  e:'Il paniere meno caro è lo stesso, ma costa il doppio: '+K('\\hh')+' è omogenea di grado zero nei prezzi, '+K('\\ee')+' di grado uno.',
  h:'Se tutti i prezzi raddoppiano, cambia quale paniere è il meno caro? E quanto costa?'},
 {q:'A che cosa è uguale '+K('\\hh(\\pp,\\,\\vv(\\pp,\\wl))')+'?',
  o:[K('\\ee(\\pp,\\wl)'),K('\\dx(\\pp,\\wl)'),K('\\wl'),K('\\vv(\\pp,\\wl)')],a:1,
  e:'Chiedere il modo meno caro di raggiungere proprio l\'utilità massima ottenibile con '+K('\\wl')+' riporta al paniere che la massimizza.',
  h:'È una delle due identità che legano domanda walrasiana e domanda hicksiana.'},
 {q:'Si sostituisce l\'utilità '+K('\\uu')+' con '+K('\\uu^3')+', che rappresenta la stessa preferenza. Che cosa cambia?',
  o:['La domanda walrasiana','L\'utilità indiretta','Entrambe','Nessuna delle due'],a:1,
  e:'Il paniere migliore è lo stesso, quindi '+K('\\dx(\\pp,\\wl)')+' non cambia. Il valore del massimo sì: diventa '+K('\\vv^3')+'.',
  h:'Quale dei due oggetti è un paniere, e quale è un numero di utilità?'}
];

