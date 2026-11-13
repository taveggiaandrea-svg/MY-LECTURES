INIT[2]=function(){
(function(){
  const root=$('#choice');
  const probs=[['a','b'],['a','c'],['b','c'],['a','b','c']];
  let ch=['a','a','b','a'];
  const set=p=>'\\{'+p.join(',')+'\\}';
  const pre=group('Carica un esempio',[['primo: razionale',['a','a','b','a']],['secondo: vincitore battuto',['b','a','b','a']],['terzo: ciclo',['a','c','b','a']]].map(([t,v])=>{
    const b=btn(t);b.onclick=()=>{ch=v.slice();upd()};return b}));
  const rows=el('div','pairs');root.append(pre,el('div','pick','Oppure decidi tu la scelta da ogni insieme'),rows);
  const segs=probs.map((p,k)=>{
    const row=el('div','pair');row.append(el('span','lab',K('\\cf('+set(p)+')=')));
    p.forEach(x=>{const b=btn(K(x),true);b.dataset.x=x;b.style.minWidth='2.8rem';
      b.setAttribute('aria-label','Da '+p.join(', ')+' sceglie '+x);
      b.onclick=()=>{ch[k]=x;upd()};row.append(b)});
    rows.append(row);return row;
  });
  const o=out();root.append(o);
  const perms=[['a','b','c'],['a','c','b'],['b','a','c'],['b','c','a'],['c','a','b'],['c','b','a']];
  function upd(){
    segs.forEach((r,k)=>r.querySelectorAll('button').forEach(b=>press(b,b.dataset.x===ch[k])));
    const ok=perms.find(p=>probs.every((A,k)=>p.find(x=>A.includes(x))===ch[k]));
    if(ok){o.innerHTML='<span class="ok">Razionalizzabile.</span> Si comporta come se massimizzasse '+K(ok.join(' \\spf '))+'.';return}
    const top=ch[3];let msg='';
    probs.slice(0,3).forEach((B,k)=>{if(!msg&&B.includes(top)&&ch[k]!==top)
      msg='Da '+K(set(probs[3]))+' sceglie '+K(top)+', che sta anche in '+K(set(B))+'; ma da lì sceglie '+K(ch[k])+'.'});
    o.innerHTML='<span class="bad">Non razionalizzabile.</span> '+msg+' È una violazione della proprietà α.';
  }
  upd();
})();

/* Mediana */
(function(){
  const root=$('#median');let on=[true,true,true,true,true];
  const pre=group('Carica un insieme di alternative disponibili',[['tutte e cinque',[1,1,1,1,1]],['solo a₃, a₄, a₅',[0,0,1,1,1]]].map(([t,v])=>{const b=btn(t);b.onclick=()=>{on=v.map(Boolean);upd()};return b}));
  const svg=el('div');svg.style.cssText='width:100%;max-width:32rem;cursor:pointer';
  const o=out();root.append(pre,legend([[GRN,'disponibile','dot'],[GRAY,'tolta','dot'],[PINK,'scelta: la mediana']]),svg,o);
  const X=i=>70+i*100;
  function upd(){
    const av=on.map((v,i)=>v?i:-1).filter(i=>i>=0),pick=av[Math.floor((av.length-1)/2)];
    let s='<line x1="30" y1="50" x2="510" y2="50" stroke="'+GRAY+'" stroke-width="2"/>';
    on.forEach((v,i)=>{
      s+='<g data-i="'+i+'" tabindex="0" role="button" aria-pressed="'+v+'" aria-label="Alternativa a'+(i+1)+(v?', disponibile':', non disponibile')+'" style="cursor:pointer">'+
        '<rect x="'+(X(i)-45)+'" y="5" width="90" height="100" fill="transparent"/>'+
        (i===pick?'<circle cx="'+X(i)+'" cy="50" r="19" fill="none" stroke="'+PINK+'" stroke-width="3.5"/>':'')+
        '<circle cx="'+X(i)+'" cy="50" r="10" fill="'+(v?GRN:'#000')+'" stroke="'+(v?GRN:GRAY)+'" stroke-width="2"/>'+
        '<text x="'+X(i)+'" y="98" text-anchor="middle" font-size="20" font-style="italic" style="font-family:var(--serif);'+(v?'':'fill:'+GRAY)+'">a<tspan font-size="14" dy="5">'+(i+1)+'</tspan></text></g>';
    });
    svg.innerHTML='<svg viewBox="0 0 540 112" role="group" aria-label="Alternative da a1 ad a5: tocca per togliere o rimettere">'+s+'</svg>';
    svg.querySelectorAll('g').forEach(g=>{const t=()=>{const i=+g.dataset.i;if(on[i]&&on.filter(Boolean).length===1)return;on[i]=!on[i];upd()};
      g.onclick=t;g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();t()}}});
    let t='Sceglie '+K('a_'+(pick+1))+', la mediana di '+av.length+(av.length===1?' alternativa':' alternative')+
      (av.length%2===0?' (la più a sinistra delle due centrali)':'')+'.';
    if(on[2]&&pick!==2)t+=' <span class="bad">Violazione della proprietà α:</span> da tutte e cinque sceglieva '+K('a_3')+', che è ancora disponibile.';
    else if(av.length<5)t+=' Nessuna violazione rispetto alla scelta dall\'insieme completo.';
    o.innerHTML=t;
  }
  upd();
})();

/* Satisficing */
(function(){
  const names=['a','b','c','d'],v=[-1,-2,1,3];let on=[true,true,true,true];
  const sl=$('#vstar'),svg=$('#sat'),o=$('#satOut'),row=$('#satAvail');
  const bs=names.map((n,i)=>{const b=btn(K(n),true);b.style.minWidth='2.8rem';b.setAttribute('aria-label','Candidato '+n);
    b.onclick=()=>{if(on[i]&&on.filter(Boolean).length===1)return;on[i]=!on[i];draw()};row.append(b);return b});
  $('#satLeg').append(legend([[YEL,'soddisfacente','box'],['#5a5a5a','insoddisfacente','box'],[PINK,'scelta'],[ORG,'livello di aspirazione','dash']]));
  const Y=x=>24+(4.5-x)/8*200,cx=i=>140+i*120;
  function draw(){
    const t=+sl.value;$('#vstarv').textContent=fmt(t);
    bs.forEach((b,i)=>press(b,on[i]));
    const av=names.map((_,i)=>i).filter(i=>on[i]);
    let pick=av.find(i=>v[i]>=t);if(pick===undefined)pick=av[av.length-1];
    let s='';
    [-2,0,2,4].forEach(g=>{s+='<text class="g" x="58" y="'+(Y(g)+5)+'" font-size="14" text-anchor="end">'+fmt(g)+'</text>'});
    s+='<text class="g" x="16" y="'+Y(1)+'" font-size="14" text-anchor="middle" transform="rotate(-90 16 '+Y(1)+')">valutazione v</text>';
    names.forEach((n,i)=>{
      const y0=Y(0),y1=Y(v[i]),sat=v[i]>=t,op=on[i]?1:.2;
      s+='<g opacity="'+op+'"><rect x="'+(cx(i)-34)+'" y="'+Math.min(y0,y1)+'" width="68" height="'+Math.abs(y1-y0)+'" fill="'+(sat?YEL:'#5a5a5a')+'"'+
        (i===pick?' stroke="'+PINK+'" stroke-width="4"':'')+'/>'+
        '<text x="'+cx(i)+'" y="'+(v[i]>=0?y1-10:y1+21)+'" font-size="15" text-anchor="middle">'+fmt(v[i])+'</text>'+
        '<text x="'+cx(i)+'" y="250" font-size="21" text-anchor="middle" font-style="italic" style="font-family:var(--serif)">'+n+'</text></g>';
      if(i===pick)s+='<text x="'+cx(i)+'" y="268" font-size="14" text-anchor="middle" style="fill:'+PINK+'">scelta</text>';
    });
    s+='<line x1="70" y1="'+Y(0)+'" x2="590" y2="'+Y(0)+'" stroke="#fff" stroke-width="1.5"/>'+
       '<line x1="70" y1="'+Y(t)+'" x2="590" y2="'+Y(t)+'" stroke="'+ORG+'" stroke-width="2.5" stroke-dasharray="8 6"/>'+
       '<text x="598" y="'+(Y(t)+6)+'" font-size="18" font-style="italic" style="fill:'+ORG+';font-family:var(--serif)">v*</text>';
    svg.innerHTML=s;
    const idx=names.map((_,i)=>i),satL=idx.filter(i=>v[i]>=t),unL=idx.filter(i=>v[i]<t).reverse();
    const pref=satL.concat(unL).map(i=>names[i]).join(' \\spf ');
    const why=av.some(i=>v[i]>=t)?'è il primo disponibile con '+K('\\vv \\ge \\vs'):'nessun disponibile raggiunge '+K('\\vs')+', quindi è l\'ultimo esaminato';
    o.innerHTML='Sceglie '+K(names[pick])+': '+why+'.<br>Preferenza che razionalizza: '+K(pref);
  }
  sl.oninput=draw;draw();
})();

/* Pompa di denaro: il ciclo degli scambi, leggibile a colpo d'occhio */
(function(){
  const root=$('#pump'),P={a:[320,74],c:[492,300],b:[148,300]},r=36;
  const cut=(p,q)=>{const dx=q[0]-p[0],dy=q[1]-p[1],d=Math.hypot(dx,dy);return [p[0]+dx/d*(r+8),p[1]+dy/d*(r+8),q[0]-dx/d*(r+16),q[1]-dy/d*(r+16)].map(v=>v.toFixed(1))};
  const arrow=(x,y)=>{const s=cut(P[x],P[y]);return '<line x1="'+s[0]+'" y1="'+s[1]+'" x2="'+s[2]+'" y2="'+s[3]+'" stroke="'+PINK+'" stroke-width="3.5" marker-end="url(#pmp)"/>'};
  const it=t=>'<tspan font-style="italic" style="font-family:var(--serif)">'+t+'</tspan>';
  const lab=(x,y,anc,x1,x2,to)=>'<text x="'+x+'" y="'+y+'" text-anchor="'+anc+'" font-size="16">da {'+it(x1)+', '+it(x2)+'} sceglie '+it(to)+'</text>'+
    '<text x="'+x+'" y="'+(y+24)+'" text-anchor="'+anc+'" font-size="17" font-weight="500" style="fill:'+RED+'">paga 1 $</text>';
  let s='<defs><marker id="pmp" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="'+PINK+'"/></marker></defs>';
  s+=arrow('a','c')+arrow('c','b')+arrow('b','a');
  Object.keys(P).forEach(k=>{s+='<circle cx="'+P[k][0]+'" cy="'+P[k][1]+'" r="'+r+'" fill="#000" stroke="'+(k==='a'?'#fff':GRAY)+'" stroke-width="'+(k==='a'?3:2)+'"/>'+
    '<text x="'+P[k][0]+'" y="'+(P[k][1]+10)+'" text-anchor="middle" font-size="30" font-style="italic" style="font-family:var(--serif)">'+k+'</text>'});
  s+='<text class="g" x="320" y="22" text-anchor="middle" font-size="14">parte da qui</text>';
  s+=lab(446,170,'start','a','c','c')+lab(320,372,'middle','b','c','b')+lab(194,170,'end','a','b','a');
  s+='<text class="g" x="320" y="222" text-anchor="middle" font-size="15">un giro completo</text>'+
     '<text x="320" y="262" text-anchor="middle" font-size="34" font-weight="500" style="fill:'+RED+'">−3 $</text>';
  const svg=el('div');svg.style.cssText='width:100%;max-width:36rem';
  svg.innerHTML='<svg viewBox="0 0 640 410" role="img" aria-label="Ciclo della pompa di denaro: da a passa a c, da c a b, da b di nuovo ad a, pagando un dollaro a ogni scambio">'+s+'</svg>';
  root.append(legend([[PINK,'scambio accettato'],[RED,'quanto paga a ogni scambio','box']]),svg);
})();
};
QZ['2a']=()=>[
 {q:'Perché nessuna preferenza sui quattro piatti (salmone, bistecca, lumache, cosce di rana) razionalizza il cliente?',
  o:['Perché detesta lumache e cosce di rana','Perché i prezzi dei piatti sono diversi','Perché servirebbe salmone sopra bistecca e, insieme, bistecca sopra salmone','Perché non conosce la città'],a:2,
  e:'Dalla coppia sceglie il salmone, dal menu completo la bistecca: le due scelte chiedono ordini opposti.',h:'Confronta la scelta dal menu corto con quella dal menu lungo.'}
];
QZ['2c']=()=>[
 {q:'Le slide chiedono: un trader convinto che '+K('2+3=6')+' può sopravvivere a lungo sul mercato?',
  o:['Sì: un errore di calcolo non c\'entra con le preferenze','No: chi se ne accorge può guadagnare a sue spese quante volte vuole','Sì, purché le sue scelte soddisfino la completezza','Dipende dalla sua avversione al rischio'],a:1,
  e:'È la logica della pompa di denaro: basta vendergli, separati, due e tre oggetti al prezzo che lui ritiene giusto per sei, e ripetere. Un\'incoerenza sistematica è un\'occasione di guadagno per gli altri. Le slide lasciano la domanda aperta: questa è la risposta che suggerisce l\'argomento.',
  h:'Pensa a che cosa gli proporresti tu, sapendo come fa i conti.'}
];
QZ['2b']=()=>[
 {q:'Le alternative sono '+K('a, b, c, d')+' e '+K('\\cf(\\{a,b,c,d\\}) = b')+'. Se la funzione di scelta soddisfa la proprietà α, quale di queste scelte è obbligata?',
  o:[K('\\cf(\\{a,b\\}) = b'),K('\\cf(\\{a,c,d\\}) = a'),K('\\cf(\\{c,d\\}) = c'),'Nessuna: la proprietà α riguarda solo l\'insieme completo'],a:0,
  e:K('b')+' è scelto dall\'insieme grande e sta ancora in '+K('\\{a,b\\}')+': deve essere scelto anche da lì. Sugli insiemi senza '+K('b')+' la proprietà, da questa sola informazione, non dice nulla.',
  h:'La proprietà scatta solo per i sottoinsiemi che contengono ancora l\'alternativa scelta dall\'insieme grande.'}
];
QZ['2']=()=>[
 {q:'Con tre alternative ci sono 24 funzioni di scelta. Quante sono razionalizzabili?',o:['3','6','12','24'],a:1,
  e:'Una per ciascuno dei 6 ordinamenti stretti di tre alternative.',h:'Quanti modi ci sono di mettere in fila tre alternative?'},
 {q:'Che cosa richiede la proprietà α?',
  o:['Se '+K('\\cf(\\sA) \\in \\sB \\subset \\sA')+', allora '+K('\\cf(\\sB) = \\cf(\\sA)'),'Se '+K('\\sB \\subset \\sA')+', allora '+K('\\cf(\\sB) = \\cf(\\sA)'),
     K('\\cf(\\sA)')+' è l\'alternativa con il valore più alto in '+K('\\sA'),'Se '+K('\\cf(\\sB) \\in \\sA')+', allora '+K('\\cf(\\sA) \\in \\sB')],a:0,
  e:'Vale solo quando la scelta dall\'insieme grande è ancora disponibile in quello piccolo.',h:'La condizione scatta solo se il prescelto di '+K('\\sA')+' sta ancora in '+K('\\sB')+'.'},
 {q:'La procedura «prendo il primo abbastanza buono, altrimenti l\'ultimo» è razionalizzabile?',
  o:['Mai','Solo se il livello di aspirazione è più basso di tutte le valutazioni','Solo se l\'ordine di esame coincide con l\'ordine di qualità','Sempre'],a:3,
  e:'La preferenza: prima i soddisfacenti nell\'ordine di esame, poi gli insoddisfacenti in ordine inverso.',h:'Guarda la preferenza che la figura mostra al variare della soglia.'},
 {q:'I candidati dell\'esempio hanno '+K('\\vv(a)=-1')+', '+K('\\vv(b)=-2')+', '+K('\\vv(c)=1')+', '+K('\\vv(d)=3')+' e sono esaminati in ordine alfabetico. Con livello di aspirazione '+K('\\vs = 2')+', chi viene scelto da '+K('\\{a,b,c\\}')+'?',
  o:[K('a'),K('b'),K('c'),'Nessuno: la procedura non sceglie'],a:2,
  e:'Nessuno dei tre raggiunge 2, quindi la regola prende l\'ultimo nell\'ordine di esame. Che sia anche il migliore dei tre è un caso.',h:'Controlla prima se qualcuno dei tre raggiunge la soglia; poi applica la seconda parte della regola.'},
 {q:'Nella pompa di denaro, la persona parte con '+K('a')+' e accetta tre scambi da un dollaro. Che cosa ha in mano alla fine?',
  o:[K('a')+', e tre dollari in meno',K('b')+', e tre dollari in meno',K('c')+', e tre dollari in meno',K('a')+', e nessuna perdita'],a:0,
  e:'Passa da '+K('a')+' a '+K('c')+', da '+K('c')+' a '+K('b')+' e da '+K('b')+' di nuovo ad '+K('a')+', pagando ogni volta.',h:'Segui i tre scambi nella figura della pompa di denaro.'}
];

