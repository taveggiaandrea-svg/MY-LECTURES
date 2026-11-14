/* Computer Programming: interface in English and small drawing helpers shared by the lessons */
Object.assign(UI,{check:'Check',pickFirst:'Pick an answer first.',right:'Correct.',wrong:'Not quite.',play:'Play',pause:'Pause',seek:'Position in the animation',
  prev:'Previous lesson',next:'Next lesson',toLight:'Switch to light theme',toDark:'Switch to dark theme'});
/* colour roles of this subject: ndarray and its data BLUE, Python list PUR, header and metadata ORG, pointers and results PINK,
   bits set to 1 and the estimate of pi YEL, views TEAL, correct GRN, overflow and errors RED, virtual copies dashed grey */
const ARR=BLUE,LST=PUR,HDR=ORG,PTR=PINK,ONE=YEL,VW=TEAL;
Object.assign(MAC,{'\\bits':col(ORG,'b'),'\\Npts':col(ORG,'n'),'\\Nin':col(PINK,R`n_{\text{in}}`),'\\piest':col(YEL,R`\hat\pi`),'\\dimd':col(ORG,'d')});
/* numbers in English: point as decimal separator, trailing zeros removed; fk adds thousands separators */
const fe=(v,d)=>{const p=Math.pow(10,d===undefined?2:d);return String(Math.round(v*p)/p).replace('-','−')};
const fk=v=>Math.round(v).toLocaleString('en-US');
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const rect=(x,y,w,h,f,st,o)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+(f||'none')+'"'+(st?' stroke="'+st+'"':'')+(o||'')+'/>';
const line=(x1,y1,x2,y2,c,w,o)=>'<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+c+'" stroke-width="'+(w||1.5)+'"'+(o||'')+'/>';
/* label with a black outline, readable over lines */
const lbl=(x,y,t,c,o)=>{o=o||{};return '<text x="'+x+'" y="'+y+'" font-size="'+(o.s||13.5)+'" text-anchor="'+(o.a||'middle')+'"'+(o.w?' font-weight="'+o.w+'"':'')+' style="paint-order:stroke;stroke:#000;stroke-width:4px;fill:'+(c||'#fff')+'">'+t+'</text>'};
const MONO='font-family:ui-monospace,Menlo,Consolas,monospace';
const mono=(x,y,t,o)=>{o=o||{};return '<text x="'+x+'" y="'+y+'" font-size="'+(o.s||13)+'" text-anchor="'+(o.a||'start')+'"'+(o.w?' font-weight="'+o.w+'"':'')+' style="'+MONO+';fill:'+(o.f||'#ddd')+'">'+t+'</text>'};
/* seeded random numbers, so every figure shows the same sample on every visit */
const lcg=seed=>{let x=seed;return()=>{x=(x*16807)%2147483647;return (x-1)/2147483646}};
/* English slider: label, value on the right formatted by show(v) */
const sld=(label,min,max,step,val,on,show)=>{
  const l=el('label','sl'),s=el('span','',label),i=el('input'),v=el('span','v');
  i.type='range';i.min=min;i.max=max;i.step=step;i.value=val;
  i.oninput=()=>{v.textContent=show(+i.value);on(+i.value)};v.textContent=show(val);
  l.append(s,i,v);return l;
};
/* a grid of cells with numbers. vals: 2-d array; o: cw, ch, f (text colour), fill(i,j), dash(i,j) for virtual cells, s font size */
function grid(x,y,vals,o){
  o=o||{};const cw=o.cw||34,ch=o.ch||30,fs=o.s||14;let s='';
  vals.forEach((row,i)=>row.forEach((v,j)=>{const X=x+j*cw,Y=y+i*ch,dv=o.dash&&o.dash(i,j);
    s+=rect(X,Y,cw,ch,(o.fill&&o.fill(i,j))||'#0d0d0d',dv?'#666':'#555',dv?' stroke-dasharray="3 3"':'')+
      (v===''||v===null||v===undefined?'':tx(X+cw/2,Y+ch/2+fs*0.36,v,{s:fs,f:dv?'#7a7a7a':(o.fc&&o.fc(i,j))||o.f||'#fff'}))}));
  return s;
}
/* python keywords in pre.code blocks, comments in grey (text nodes outside coloured spans only) */
const PYK=/\b(import|from|as|for|in|if|else|def|return|while|True|False|None|and|or|not|print)\b/g;
function codeHL(root){root.querySelectorAll('pre.code:not([data-hl])').forEach(pre=>{pre.dataset.hl=1;
  [...pre.childNodes].forEach(n=>{if(n.nodeType!==3)return;
    const html=n.nodeValue.split('\n').map(ln=>{const k=ln.indexOf('#');const a=k<0?ln:ln.slice(0,k),c=k<0?'':ln.slice(k);
      return esc(a).replace(PYK,m=>'<span class="kw">'+m+'</span>')+(c?'<span style="color:var(--dim)">'+esc(c)+'</span>':'')}).join('\n');
    const sp=document.createElement('span');sp.innerHTML=html;n.replaceWith(...sp.childNodes)})})}
/* arrow markers, one id per figure */
const arrowM=(id,c)=>'<defs>'+arrowDef(id,c)+'</defs>';
