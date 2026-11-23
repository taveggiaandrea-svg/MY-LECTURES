/* Pagina «Domande all'AI»: legge l'archivio /api/domande (sul server del sito, dietro la password),
   mostra quante domande nascono da ogni lezione e l'elenco completo, con filtro, esportazione e cancellazione. */
(function(){
  const $=s=>document.querySelector(s),esc=t=>String(t??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const box=$('#dom'),stat=$('#domstat'),sel=$('#dommat'),cerca=$('#domq');
  let tutte=[];
  const quando=t=>{try{return new Date(t).toLocaleString('it-IT',{dateStyle:'medium',timeStyle:'short'})}catch(e){return t}};
  function disegna(){
    const m=sel.value,q=cerca.value.trim().toLowerCase();
    const r=tutte.filter(d=>(!m||d.materia===m)&&(!q||(d.domanda+' '+d.risposta+' '+d.titolo).toLowerCase().includes(q)));
    /* conteggio per lezione: dove nascono più domande */
    const per={};r.forEach(d=>{const k=d.corso+'|'+d.lezione;(per[k]=per[k]||{corso:d.corso,lezione:d.lezione,titolo:d.titolo,n:0,ult:''}).n++;per[k].ult=d.quando});
    const righe=Object.values(per).sort((a,b)=>b.n-a.n||String(a.corso).localeCompare(b.corso)||a.lezione-b.lezione);
    stat.innerHTML=r.length?'<div class="scroll"><table class="tight"><thead><tr><th>Corso</th><th class="n">Lezione</th><th>Titolo</th><th class="n">Domande</th></tr></thead><tbody>'+
      righe.map(x=>'<tr><td>'+esc(x.corso)+'</td><td class="n">'+esc(x.lezione)+'</td><td>'+esc(x.titolo)+'</td><td class="n"><strong>'+x.n+'</strong></td></tr>').join('')+'</tbody></table></div>':'';
    box.innerHTML=r.length?r.slice().reverse().map(d=>
      '<article class="dq" data-id="'+d.id+'"><p class="dqm">'+esc(quando(d.quando))+' · '+esc(d.corso)+' · lezione '+esc(d.lezione)+(d.titolo?' · '+esc(d.titolo):'')+'</p>'+
      '<p class="dqq">'+esc(d.domanda)+'</p>'+
      (d.risposta?'<details><summary>Risposta'+(d.modello?' ('+esc(d.modello)+')':'')+'</summary><div class="dqa">'+esc(d.risposta)+'</div></details>':'<p class="dqm">Nessuna risposta'+(d.errore?': '+esc(d.errore):'')+'</p>')+
      '<button type="button" class="btn dqx">Elimina</button></article>').join(''):
      '<p>'+(tutte.length?'Nessuna domanda corrisponde al filtro.':'Ancora nessuna domanda: compariranno qui appena userai «Chiedi all\'AI» in una lezione.')+'</p>';
  }
  box.addEventListener('click',async e=>{const b=e.target.closest('.dqx');if(!b)return;
    /* due clic per cancellare, senza finestre di conferma */
    if(!b.dataset.ok){b.dataset.ok=1;b.textContent='Conferma eliminazione';setTimeout(()=>{if(b.isConnected){delete b.dataset.ok;b.textContent='Elimina'}},4000);return}
    const id=b.closest('.dq').dataset.id;b.disabled=true;
    try{const r=await fetch('/api/domande/'+id,{method:'DELETE'});if(!r.ok)throw 0;tutte=tutte.filter(d=>String(d.id)!==id);disegna()}catch(_){b.disabled=false;b.textContent='Non riuscito, riprova'}});
  sel.onchange=disegna;cerca.oninput=disegna;
  fetch('/api/domande',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.json()}).then(j=>{
    tutte=j;const mats=[...new Set(j.map(d=>d.materia+'|'+d.corso))];
    sel.innerHTML='<option value="">Tutte le materie ('+j.length+')</option>'+mats.map(x=>{const [m,c]=x.split('|');return '<option value="'+esc(m)+'">'+esc(c)+' ('+j.filter(d=>d.materia===m).length+')</option>'}).join('');
    disegna()}).catch(e=>{box.innerHTML='<p>Archivio non raggiungibile ('+esc(e.message)+'). Funziona solo sul sito pubblicato.</p>'});
})();
