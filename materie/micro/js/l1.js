INIT[1]=function(){
function analyse(items,pairs,ans){
  const n=items.length;
  const Rel=Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>i===j));
  pairs.forEach(([i,j],k)=>{Rel[i][j]=ans[k]!=='<';Rel[j][i]=ans[k]!=='>';});
  let viol=null;
  for(let x=0;x<n;x++)for(let y=0;y<n;y++)for(let z=0;z<n;z++)
    if(!viol&&Rel[x][y]&&Rel[y][z]&&!Rel[x][z])viol=[x,y,z];
  let levels=null;
  if(!viol){
    levels=[];let rem=items.map((_,i)=>i);
    while(rem.length){
      const m=rem.filter(x=>rem.every(y=>Rel[y][x]));
      if(!m.length)break;
      levels.push(m);rem=rem.filter(x=>!m.includes(x));
    }
  }
  const rel=(x,y)=>items[x]+(Rel[x][y]&&Rel[y][x]?' \\ind ':' \\spf ')+items[y];
  const rank=levels?levels.slice().reverse().map(l=>l.map(i=>items[i]).join(' \\ind ')).join(' \\spf '):'';
  return {viol,levels,rel,rank,items};
}
function questionnaire(root,items,init,render){
  const pairs=[];
  for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++)pairs.push([i,j]);
  const ans=init.slice();
  const rows=el('div','pairs'),o=out();root.append(rows,o);
  const segs=pairs.map(([i,j],k)=>{
    const row=el('div','pair');
    [['>','preferisco '+items[i]],['=','indifferente'],['<','preferisco '+items[j]]].forEach(([v,t])=>{
      const b=btn(t);b.dataset.v=v;b.onclick=()=>{ans[k]=v;upd()};row.append(b);
    });
    rows.append(row);return row;
  });
  function upd(){
    segs.forEach((s,k)=>s.querySelectorAll('button').forEach(b=>press(b,b.dataset.v===ans[k])));
    o.innerHTML=render(analyse(items,pairs,ans));
  }
  upd();
}
const violText=r=>{const [x,y,z]=r.viol;
  return '<span class="bad">Non è una relazione di preferenza.</span> Hai detto '+K(r.rel(x,y))+' e '+K(r.rel(y,z))+
    ', ma anche '+K(r.items[z]+' \\spf '+r.items[x])+': la transitività salta.'};

questionnaire($('#hero'),['a','b','c'],['>','<','>'],r=>
  r.viol?violText(r):'<span class="ok">È una relazione di preferenza.</span> L\'ordine è '+K(r.rank)+'.');

questionnaire($('#build'),['a','b','c','d'],['>','>','>','=','>','>'],r=>{
  if(r.viol)return violText(r)+' Senza transitività può non esserci nessuna minimale da cui partire.';
  const lv=r.levels.map((l,k)=>'<div class="lv"><b>'+l.map(i=>r.items[i]).join(', ')+'</b><i>u = '+(k+1)+'</i><small>M<sub>'+(k+1)+'</sub></small></div>')
    .join('<span class="lt" aria-hidden="true">≺</span>');
  return 'Preferenze: '+K(r.rank)+'<div class="levels">'+lv+'</div>';
});

/* Condorcet */
(function(){
  const root=$('#cond');
  const P=[['a','b','c'],['a','c','b'],['b','a','c'],['b','c','a'],['c','a','b'],['c','b','a']];
  const idx=[0,3,4];let mode='maj';
  const bM=btn('maggioranza'),bU=btn('unanimità');const top=group('Scegli la regola con cui unire i tre criteri',[bM,bU]);
  bM.onclick=()=>{mode='maj';upd()};bU.onclick=()=>{mode='una';upd()};
  const crit=[0,1,2].map(i=>{const b=btn('',true);b.setAttribute('aria-label','Cambia il criterio '+(i+1));
    b.onclick=()=>{idx[i]=(idx[i]+1)%6;upd()};return b});
  const crow=group('I tre criteri: tocca un criterio per passare all\'ordinamento successivo',crit);
  const svg=el('div');svg.style.cssText='width:100%;max-width:20rem';
  const o=out();root.append(top,crow,legend([[BLUE,'batte'],[GRAY,'coppia senza risposta','dash']]),svg,o);
  const pos={a:[160,42],b:[66,196],c:[254,196]};
  const cut=(p,q,r1,r2)=>{const dx=q[0]-p[0],dy=q[1]-p[1],d=Math.hypot(dx,dy);
    return [p[0]+dx/d*r1,p[1]+dy/d*r1,q[0]-dx/d*r2,q[1]-dy/d*r2].map(v=>v.toFixed(1))};
  function upd(){
    press(bM,mode==='maj');press(bU,mode==='una');
    crit.forEach((b,i)=>b.innerHTML=K(P[idx[i]].join(' \\spf_'+(i+1)+' ')));
    const above=(x,y)=>idx.filter(k=>P[k].indexOf(x)<P[k].indexOf(y)).length;
    const need=mode==='maj'?2:3;
    let lines='';const wins={a:0,b:0,c:0},beats=[],inc=[];
    [['a','b'],['b','c'],['a','c']].forEach(([x,y])=>{
      const n=above(x,y);let w=null,l=null;
      if(n>=need){w=x;l=y}else if(3-n>=need){w=y;l=x}
      if(w){wins[w]++;beats.push(w+' \\spf '+l);
        const s=cut(pos[w],pos[l],28,35);
        lines+='<line x1="'+s[0]+'" y1="'+s[1]+'" x2="'+s[2]+'" y2="'+s[3]+'" stroke="'+BLUE+'" stroke-width="3" marker-end="url(#arw)"/>';
      }else{inc.push(x+' e '+y);
        const s=cut(pos[x],pos[y],28,28);
        lines+='<line x1="'+s[0]+'" y1="'+s[1]+'" x2="'+s[2]+'" y2="'+s[3]+'" stroke="'+GRAY+'" stroke-width="2" stroke-dasharray="5 7"/>';
      }
    });
    const nodes=Object.keys(pos).map(k=>'<text x="'+pos[k][0]+'" y="'+(pos[k][1]+10)+'" text-anchor="middle" font-size="30" font-style="italic" style="font-family:var(--serif)">'+k+'</text>').join('');
    svg.innerHTML='<svg viewBox="0 0 320 240" role="img" aria-label="Confronti a coppie fra a, b e c"><defs><marker id="arw" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="'+BLUE+'"/></marker></defs>'+lines+nodes+'</svg>';
    const order=Object.keys(wins).sort((p,q)=>wins[q]-wins[p]).join(' \\spf ');
    if(mode==='maj'){
      const cyc=wins.a===1&&wins.b===1&&wins.c===1;
      o.innerHTML=cyc?'<span class="bad">Completa, ma non transitiva.</span> '+beats.map(K).join(', ')+': un ciclo.'
        :'<span class="ok">Completa e transitiva.</span> Ne esce '+K(order)+'.';
    }else{
      o.innerHTML=inc.length?'<span class="bad">Transitiva, ma non completa.</span> I criteri non sono unanimi su '+inc.join(', su ')+': quelle coppie restano senza risposta.'
        :'<span class="ok">Completa e transitiva.</span> I tre criteri coincidono: '+K(order)+'.';
    }
  }
  upd();
})();

/* Cinema: la ricetta «togli i peggiori» passo per passo */
(function(){
  const g=$('#seats'),o=$('#seatOut');let sel=null,selInfo=null,k=100;
  $('#cinemaLeg').append(legend([['rgba(255,255,0,.25)','utilità bassa','box'],[YEL,'utilità alta','box'],['#2a2a2a','non ancora tolto','box'],[PINK,'posto selezionato','dash']]));
  const seats=[];
  for(let r=1;r<=10;r++)for(let c=1;c<=10;c++){
    const u=10*r-c+1,b=el('button','seat');b.type='button';b.dataset.u=u;
    b.setAttribute('aria-label','Fila '+r+', colonna '+c);
    b.onclick=()=>{if(sel)press(sel,false);sel=b;selInfo=[r,c,u];press(b,true);pl.seek(DUR)};
    g.append(b);seats.push(b);if(r===7&&c===4){sel=b;selInfo=[r,c,u];press(b,true)}
  }
  function showSeat(r,c,u){
    o.innerHTML='Fila '+r+', colonna '+c+': '+K('\\uu = 10\\cdot'+r+' - '+c+' + 1 = '+u)+
      '. Lo preferisce ad altri <span class="num">'+(u-1)+'</span> posti; <span class="num">'+(100-u)+'</span> sono migliori.';
  }
  const DUR=20;
  function frame(t){
    k=Math.round(t/DUR*100);
    seats.forEach(b=>{const u=+b.dataset.u;
      if(u<=k){b.style.background='';b.style.setProperty('--a',(0.08+0.92*u/100).toFixed(3))}else b.style.background='#2a2a2a';
      b.style.boxShadow=(u===k&&k<100)?'0 0 0 2px #fff':''});
    if(k>=100)showSeat.apply(null,selInfo);
    else if(k===0)o.innerHTML='All\'inizio nessun posto ha ancora un numero. La ricetta cerca il posto peggiore di tutti: prima fila, il più lontano dall\'uscita.';
    else{const r=Math.ceil(k/10),c=10*r-k+1;
      o.innerHTML='Passo <span class="num">'+k+'</span> di 100. Fra i posti rimasti il peggiore è quello in fila '+r+', colonna '+c+': viene tolto e riceve '+K('\\uu = '+k)+'.'}
  }
  const pl=player($('#cinemaPlay'),DUR,frame);pl.seek(DUR);
})();

/* Lessicografiche sul quadrato */
(function(){
  const svg=$('#sq'),s1=$('#z1'),s2=$('#z2');
  $('#sqLeg').append(legend([[BLUE,'preferite a z','box'],['#fff','escluse (stessa prima coordinata, più in basso)','dash']]));
  const X=v=>40+280*v,Y=v=>300-280*v;
  function draw(){
    const a=+s1.value,b=+s2.value,x=X(a),y=Y(b);
    $('#z1v').textContent=fmt(a);$('#z2v').textContent=fmt(b);
    svg.innerHTML=
      '<rect x="'+x+'" y="20" width="'+(320-x)+'" height="280" fill="'+BLUE+'" fill-opacity=".3"/>'+
      '<rect x="40" y="20" width="280" height="280" fill="none" stroke="'+GRAY+'" stroke-width="1.5"/>'+
      '<line x1="'+x+'" y1="'+y+'" x2="'+x+'" y2="20" stroke="'+BLUE+'" stroke-width="3.5"/>'+
      '<line x1="'+x+'" y1="300" x2="'+x+'" y2="'+y+'" stroke="#fff" stroke-width="1.5" stroke-dasharray="4 6"/>'+
      '<circle cx="'+x+'" cy="'+y+'" r="7" fill="#fff"/>'+
      '<text x="'+(x+(a>.8?-14:14))+'" y="'+(y+(b<.12?-10:22))+'" font-size="18" font-style="italic" text-anchor="'+(a>.8?'end':'start')+'" style="font-family:var(--serif)">z</text>'+
      '<text class="g" x="40" y="322" font-size="14" text-anchor="middle">0</text>'+
      '<text class="g" x="320" y="322" font-size="14" text-anchor="middle">1</text>'+
      '<text class="g" x="30" y="26" font-size="14" text-anchor="end">1</text>'+
      '<text class="g" x="180" y="334" font-size="14" text-anchor="middle">prima coordinata x₁</text>'+
      '<text class="g" x="14" y="160" font-size="14" text-anchor="middle" transform="rotate(-90 14 160)">seconda coordinata x₂</text>';
  }
  drag(svg,e=>{const [px,py]=svgPoint(svg,e,340,340);
    s1.value=Math.min(1,Math.max(0,(px-40)/280)).toFixed(2);
    s2.value=Math.min(1,Math.max(0,(300-py)/280)).toFixed(2);draw()});
  s1.oninput=draw;s2.oninput=draw;draw();
})();

/* Trasformazioni dell'utilità */
(function(){
  const U={a:5,b:-1,c:-1,d:-17},names=Object.keys(U);
  const F=[
    {t:'3\\uu-7',f:u=>3*u-7,inc:true},{t:'\\uu^3',f:u=>u*u*u,inc:true},{t:'e^{\\uu/5}',f:u=>Math.exp(u/5),inc:true},
    {t:'-\\uu',f:u=>-u,inc:false},{t:'\\uu^2',f:u=>u*u,inc:false}
  ];
  $('#trLeg').append(legend([[YEL,'valore di un\'alternativa','dot'],[YEL,'stessa alternativa prima e dopo']]));
  let cur=0;const bs=F.map((o,i)=>{const b=btn(K('f(\\uu)='+o.t),true);b.onclick=()=>{cur=i;draw()};$('#fbtns').append(b);return b});
  const order=v=>{const vals=[...new Set(names.map(n=>v[n]))].sort((p,q)=>q-p);
    return vals.map(x=>names.filter(n=>v[n]===x).join(' \\ind ')).join(' \\spf ')};
  function axis(v,y,below){
    const vs=names.map(n=>v[n]),mn=Math.min(...vs),mx=Math.max(...vs);
    const X=x=>70+(mx===mn?.5:(x-mn)/(mx-mn))*500;
    const groups=[...new Set(vs)].sort((p,q)=>p-q);
    let s='<line x1="70" y1="'+y+'" x2="570" y2="'+y+'" stroke="'+GRAY+'" stroke-width="1.5"/>';
    groups.forEach((g,i)=>{
      const ty=below?y+26+(i%2)*19:y-14-(i%2)*19;
      s+='<circle cx="'+X(g)+'" cy="'+y+'" r="6" fill="'+YEL+'"/>'+
        '<text x="'+X(g)+'" y="'+ty+'" font-size="16" text-anchor="middle"><tspan font-style="italic" style="font-family:var(--serif)">'+
        names.filter(n=>v[n]===g).join(', ')+'</tspan><tspan class="g" dx="7" font-size="14">'+fmt(g)+'</tspan></text>';
    });
    return {s,X};
  }
  function draw(){
    bs.forEach((b,i)=>press(b,i===cur));
    const W={};names.forEach(n=>W[n]=F[cur].f(U[n]));
    const A=axis(U,62,false),B=axis(W,150,true);
    let l='';names.forEach(n=>{l+='<line x1="'+A.X(U[n])+'" y1="62" x2="'+B.X(W[n])+'" y2="150" stroke="'+YEL+'" stroke-opacity=".45" stroke-width="1.5"/>'});
    $('#tr').innerHTML='<text x="28" y="68" font-size="19" font-style="italic" fill="'+YEL+'" style="fill:'+YEL+';font-family:var(--serif)">u</text><text x="26" y="156" font-size="19" font-style="italic" style="fill:'+YEL+';font-family:var(--serif)">w</text>'+l+A.s+B.s;
    const same=names.every(p=>names.every(q=>Math.sign(W[p]-W[q])===Math.sign(U[p]-U[q])));
    $('#trOut').innerHTML=same
      ?'<span class="ok">'+(F[cur].inc?'Crescente.':'Stesso ordine.')+'</span> L\'ordine resta '+K(order(W))+': '+K('\\ww')+' rappresenta le stesse preferenze.'
      :'<span class="bad">Non crescente.</span> La garanzia cade, e qui l\'ordine diventa '+K(order(W))+': '+K('\\ww')+' descrive preferenze diverse.';
  }
  draw();
})();

/* Relazione come tabella di sì e di no */
(function(){
  const root=$('#relgrid'),N=['a','b','c'];
  const Rl=[[1,1,0],[0,1,0],[0,0,1]];
  const pre=[['mancano risposte',[[1,1,0],[0,1,0],[0,0,1]]],['gira in tondo',[[1,1,0],[0,1,1],[1,0,1]]],['preferenza',[[1,1,1],[0,1,1],[0,1,1]]]];
  const pb=pre.map(([t,m])=>{const b=btn(t);b.onclick=()=>{m.forEach((r,i)=>r.forEach((v,j)=>Rl[i][j]=v));upd()};return b});
  const g=el('div','grid3'),o=out();
  root.append(group('Carica un esempio, poi modifica le caselle',pb),legend([[BLUE,'sì: la riga vale almeno quanto la colonna','box'],['#333','no','box']]),g,o);
  g.append(el('span','',''));N.forEach(n=>g.append(el('span','hd',n)));
  const cells=[];
  N.forEach((n,i)=>{g.append(el('span','hd',n));cells.push(N.map((m,j)=>{const b=el('button','btn');b.type='button';
    if(i===j)b.disabled=true;else b.onclick=()=>{Rl[i][j]=1-Rl[i][j];upd()};g.append(b);return b}))});
  function upd(){
    N.forEach((n,i)=>N.forEach((m,j)=>{const b=cells[i][j];b.className='btn '+(Rl[i][j]?'yes':'no');b.textContent=Rl[i][j]?'sì':'no';
      b.setAttribute('aria-label',n+' almeno quanto '+m+': '+(Rl[i][j]?'sì':'no'))}));
    let miss=null,viol=null;
    for(let i=0;i<3;i++)for(let j=i+1;j<3;j++)if(!miss&&!Rl[i][j]&&!Rl[j][i])miss=[i,j];
    for(let x=0;x<3;x++)for(let y=0;y<3;y++)for(let z=0;z<3;z++)if(!viol&&x!==y&&y!==z&&Rl[x][y]&&Rl[y][z]&&!Rl[x][z])viol=[x,y,z];
    let h=miss?'<span class="bad">Non completa:</span> fra '+K(N[miss[0]])+' e '+K(N[miss[1]])+' non c\'è nessun sì.'
              :'<span class="ok">Completa:</span> ogni coppia ha almeno un sì.';
    h+='<br>'+(viol?'<span class="bad">Non transitiva:</span> '+K(N[viol[0]]+' \\pf '+N[viol[1]])+' e '+K(N[viol[1]]+' \\pf '+N[viol[2]])+', ma non '+K(N[viol[0]]+' \\pf '+N[viol[2]])+'.'
              :'<span class="ok">Transitiva:</span> i sì si incastrano.');
    if(!miss&&!viol){const sc=N.map((_,i)=>Rl[i].reduce((p,q)=>p+q,0)),ord=[0,1,2].sort((p,q)=>sc[q]-sc[p]);
      let t=N[ord[0]];for(let k=1;k<3;k++)t+=(Rl[ord[k]][ord[k-1]]?' \\ind ':' \\spf ')+N[ord[k]];
      h+='<br>È una relazione di preferenza: '+K(t)+'.'}
    o.innerHTML=h;
  }
  upd();
})();

/* Scala di Mohs: dieci minerali in ordine, nessuna distanza */
(function(){
  const root=$('#mohs'),M=['talco','gesso','calcite','fluorite','apatite','ortoclasio','quarzo','topazio','corindone','diamante'],X=k=>40+k*64,W=656;
  let s='<defs>'+arrowDef('moA',GRAY)+'</defs><line x1="'+X(0)+'" y1="50" x2="'+X(9)+'" y2="50" stroke="#555" stroke-width="2"/>';
  M.forEach((m,k)=>{s+='<circle cx="'+X(k)+'" cy="50" r="15" fill="#000" stroke="'+YEL+'" stroke-width="2"/>'+tx(X(k),56,k+1,{s:16,f:YEL})+tx(X(k),k%2?104:86,m,{s:13,f:'#e6e6e6'})+(k%2?'<line x1="'+X(k)+'" y1="68" x2="'+X(k)+'" y2="90" stroke="#555"/>':'')});
  s+='<line x1="'+X(2.5)+'" y1="16" x2="'+X(6.5)+'" y2="16" stroke="'+GRAY+'" stroke-width="1.6" marker-end="url(#moA)"/>'+tx(X(1.2),21,'più tenero',{s:13,f:GRAY})+tx(X(7.8),21,'più duro',{s:13,f:GRAY});
  svgBox(root,W,114,s,'Scala di Mohs: talco 1, gesso 2, calcite 3, fluorite 4, apatite 5, ortoclasio 6, quarzo 7, topazio 8, corindone 9, diamante 10','38rem');
})();
};
QZ['1b']=()=>[
 {q:'Una relazione completa è per forza riflessiva?',
  o:['Sì: basta applicare la completezza alla coppia '+K('(x,x)'),'No: la completezza riguarda solo coppie di alternative diverse','Solo se è anche transitiva','Solo se l\'insieme è finito'],a:0,
  e:'La completezza vale per ogni '+K('x')+' e '+K('y')+', anche uguali: con '+K('y=x')+' dice «'+K('x \\pf x')+' oppure '+K('x \\pf x')+'», cioè '+K('x \\pf x')+'.',
  h:'Nella definizione di completezza, '+K('x')+' e '+K('y')+' devono essere diversi?'}
];
QZ['1a']=()=>[
 {q:'Una persona ha una relazione di preferenza e ti dice '+K('a \\spf b')+' e '+K('b \\ind c')+'. Che cosa puoi concludere su '+K('a')+' e '+K('c')+'?',
  o:[K('a \\spf c'),K('a \\ind c'),K('c \\spf a'),'Niente: dipende dalla persona'],a:0,
  e:'Per transitività '+K('a \\pf c')+'. Se valesse anche '+K('c \\pf a')+', da '+K('b \\pf c')+' seguirebbe '+K('b \\pf a')+', contro '+K('a \\spf b')+'.',
  h:'Usa la transitività due volte: una per ottenere '+K('a \\pf c')+', una per escludere '+K('c \\pf a')+'.'}
];
QZ['1']=()=>[
 {q:'Quali due proprietà definiscono una relazione di preferenza?',
  o:['Riflessività e simmetria','Completezza e transitività','Transitività e antisimmetria','Completezza e simmetria'],a:1,
  e:'Completa: ogni coppia è confrontabile. Transitiva: i confronti si incastrano.',h:'Pensa alle due richieste fatte alle risposte del questionario.'},
 {q:'Tre criteri senza pareggi, aggregati a maggioranza. La relazione che ne esce è…',
  o:['sempre completa e transitiva','sempre transitiva, ma non necessariamente completa','sempre completa, ma non necessariamente transitiva','né completa né transitiva'],a:2,
  e:'Su ogni coppia almeno due criteri su tre sono d\'accordo, quindi è completa. Il paradosso di Condorcet mostra che può girare in tondo.',h:'Torna alla figura di Condorcet e guarda che cosa manca con ciascuna regola.'},
 {q:K('\\uu')+' rappresenta '+K('\\pf')+'. Quale di queste funzioni la rappresenta di sicuro?',
  o:[K('\\ww = -\\uu'),K('\\ww = \\uu^2'),K('\\ww = 3\\uu - 7'),K('\\ww = |\\uu|')],a:2,
  e:K('3\\uu-7')+' è una funzione crescente di '+K('\\uu')+', quindi conserva l\'ordine.',h:'Serve una trasformazione crescente.'},
 {q:'Nel cinema del libro, 40 file per 50 colonne, quanto vale l\'utilità del posto in fila 2, colonna 50?',
  o:['2','50','51','99'],a:2,
  e:K('\\uu = 50\\cdot 2 - 50 + 1 = 51')+': è il primo posto della seconda fila a essere tolto, subito dopo i 50 della prima.',h:'Applica '+K('\\uu(x) = 50\\,r(x) - c(x) + 1')+' con '+K('r=2')+' e '+K('c=50')+'.'},
 {q:'Le preferenze lessicografiche sul quadrato unitario…',
  o:['non sono complete','non sono transitive','sono una relazione di preferenza, ma nessuna funzione di utilità le rappresenta','sono rappresentate da '+K('\\uu(x_1,x_2)=x_1+x_2')],a:2,
  e:'Sono complete e transitive. Ma servirebbe un intervallo di numeri separato per ogni valore di '+K('x_1')+', e non ce ne sono abbastanza.',h:'Completezza e transitività qui valgono: il problema è un altro.'}
];

