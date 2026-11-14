/* Big Data and Databases: interface in English and small drawing helpers shared by the four lessons */
Object.assign(UI,{check:'Check',pickFirst:'Pick an answer first.',right:'Correct.',wrong:'Not quite.',play:'Play',pause:'Pause',seek:'Position in the animation',
  prev:'Previous lesson',next:'Next lesson',toLight:'Switch to light theme',toDark:'Switch to dark theme'});
/* colour roles of this subject: primary key YEL, foreign key PINK, conditions ORG, NULL PUR, measures BLUE, windows TEAL, accepted GRN, rejected RED */
const PKC=YEL,FKC=PINK,PRC=ORG,NLC=PUR,MSC=BLUE,WNC=TEAL;
Object.assign(MAC,{'\\kk':col(BLUE,'k'),'\\qv':col(ORG,'q'),'\\vb':col(BLUE,'v')});
/* numbers in English: point as decimal separator, trailing zeros removed */
const fe=(v,d)=>{if(v===null||v===undefined)return 'NULL';const p=Math.pow(10,d===undefined?2:d);return String(Math.round(v*p)/p)};
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
/* a table drawn in SVG. cols: [{t:header, w:width, a:'s'|'e', c:header colour}]; rows: arrays of cells, a cell is a string or
   {v:text, f:colour, b:bold, st:struck}; o.bg(i) row background, o.op(i) row opacity. Returns {s,w,h}. */
function sTab(x,y,cols,rows,o){
  o=o||{};const rh=o.rh||25,hh=o.hh||26,fs=o.fs||13.5;let s='',cx=x;const w=cols.reduce((a,c)=>a+c.w,0);
  const pos=c=>c.a==='e'?[cx+c.w-7,'end']:c.a==='m'?[cx+c.w/2,'middle']:[cx+7,'start'];
  cols.forEach(c=>{const [tx_,an]=pos(c);s+='<text x="'+tx_+'" y="'+(y+hh-9)+'" font-size="'+(fs-.5)+'" text-anchor="'+an+'" style="fill:'+(c.c||GRAY)+'">'+c.t+'</text>';cx+=c.w});
  s+='<line x1="'+x+'" y1="'+(y+hh)+'" x2="'+(x+w)+'" y2="'+(y+hh)+'" stroke="#555"/>';
  rows.forEach((r,i)=>{const ry=y+hh+i*rh,bg=o.bg?o.bg(i):null,op=o.op?o.op(i):1;
    if(bg)s+='<rect x="'+x+'" y="'+ry+'" width="'+w+'" height="'+rh+'" fill="'+bg+'"/>';
    s+='<g opacity="'+op+'">';cx=x;
    r.forEach((cell,j)=>{const c=cols[j],v=typeof cell==='object'&&cell!==null?cell:{v:cell};const [tx_,an]=pos(c);
      const txt=v.v===null?'NULL':v.v,fill=v.f||(v.v===null?PUR:'#fff');if(v.bg)s+='<rect x="'+cx+'" y="'+ry+'" width="'+c.w+'" height="'+rh+'" fill="'+v.bg+'"/>';
      s+='<text x="'+tx_+'" y="'+(ry+rh-8)+'" font-size="'+fs+'" text-anchor="'+an+'"'+(v.b?' font-weight="600"':'')+(v.st?' text-decoration="line-through"':'')+' style="fill:'+fill+'">'+txt+'</text>';cx+=c.w});
    s+='</g><line x1="'+x+'" y1="'+(ry+rh)+'" x2="'+(x+w)+'" y2="'+(ry+rh)+'" stroke="#262626"/>'});
  return {s,w,h:hh+rows.length*rh};
}
/* rounded label with outline, readable over lines */
const lbl=(x,y,t,c,o)=>{o=o||{};return '<text x="'+x+'" y="'+y+'" font-size="'+(o.s||13.5)+'" text-anchor="'+(o.a||'middle')+'"'+(o.w?' font-weight="'+o.w+'"':'')+' style="paint-order:stroke;stroke:#000;stroke-width:4px;fill:'+(c||'#fff')+'">'+t+'</text>'};
const rect=(x,y,w,h,f,st,o)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+(f||'none')+'"'+(st?' stroke="'+st+'"':'')+(o||'')+'/>';
const line=(x1,y1,x2,y2,c,w,o)=>'<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+c+'" stroke-width="'+(w||1.5)+'"'+(o||'')+'/>';
const verdict=(ok,t)=>'<span class="'+(ok?'ok':'bad')+'">'+(ok?'Accepted.':'Rejected.')+'</span> '+t;
const OKBG='rgba(131,193,103,.22)',BADBG='rgba(252,98,85,.24)',HLBG='rgba(255,255,255,.1)',WINBG='rgba(92,208,179,.22)';
/* datasets from the course scripts and slides */
const CUST=[[1,'marco','rossi','milan'],[2,'john','doe','london'],[3,'mark','smith','liverpool'],[4,'mary','jane','london'],[5,'mario','bianchi','rome']];
const SAL=[[1,'2018-09-01',1,'xyz',5,1.5],[2,'2018-09-01',2,'abc',2,2],[3,'2018-09-02',3,'xyz',10,1.5],[4,'2018-09-02',4,'abc',4,2],[5,'2018-09-03',1,'abc',2,2.2],[6,'2018-09-03',2,'xyz',3,1.5]];
const ORD=[['2018-07-04',1,'Anders',440],['2018-07-05',1,'Anders',1813],['2018-07-05',1,'Anders',670.8],['2018-07-08',1,'Anders',625.2],['2018-07-15',1,'Anders',517.8],
  ['2018-07-04',2,'Trujillo',1863.4],['2018-07-06',2,'Trujillo',3730],['2018-07-07',2,'Trujillo',1444.8],['2018-07-09',2,'Trujillo',2490.5]];
const BUY=[['Adam Brun',1],['Lucy Thin',2],['Eva Unirt',3],['Pil Trun',4]];
const BSL=[[1,2,25],[1,3,5],[4,1,65],[3,5,11],[4,2,1003]];
const PRODS=[[1,'Chai'],[2,'Chang'],[3,'Aniseed Syrup'],[4,"Chef Anton's Cajun Seasoning"],[5,"Chef Anton's Gumbo Mix"]];
const ITEMS=[[1,1,12],[1,2,10],[1,3,5],[2,1,9],[2,2,40],[3,3,10],[3,4,35],[4,1,15],[4,2,6],[5,3,35],[5,4,15],[6,1,6],[6,2,15],[7,3,6],[8,4,15],[9,1,6]]; /* order, product, quantity */
const capw=s=>s.charAt(0).toUpperCase()+s.slice(1);
/* SQL keywords in pre.code blocks (text nodes outside coloured spans only) */
const KWS=/\b(SELECT|FROM|WHERE|GROUP BY|HAVING|ORDER BY|INSERT INTO|VALUES|UPDATE|SET|DELETE|CREATE TABLE|DROP TABLE|NOT NULL|NULL|AND|OR|NOT|AS|ON|JOIN|INNER|LEFT|RIGHT|FULL|OUTER|CROSS|UNION|ALL|DISTINCT|IS|EXISTS|OVER|PARTITION BY|ROWS BETWEEN|PRECEDING|FOLLOWING|CURRENT ROW|UNBOUNDED|DESC|ASC|COUNT|SUM|AVG|MAX|MIN|COALESCE|ROW_NUMBER|LAG|LEAD|INT|VARCHAR|DECIMAL|DATE|MATCH|RETURN)\b/g;
function codeHL(root){root.querySelectorAll('pre.code:not([data-hl])').forEach(pre=>{pre.dataset.hl=1;
  const w=document.createTreeWalker(pre,NodeFilter.SHOW_TEXT),ns=[];while(w.nextNode())ns.push(w.currentNode);
  ns.forEach(n=>{if(n.parentElement!==pre)return;const t=n.nodeValue;KWS.lastIndex=0;if(!KWS.test(t))return;KWS.lastIndex=0;
    const sp=document.createElement('span');sp.innerHTML=esc(t).replace(KWS,m=>'<span class="kw">'+m+'</span>');n.replaceWith(...sp.childNodes)})})}
const mono=(x,y,t,o)=>{o=o||{};return '<text x="'+x+'" y="'+y+'" font-size="'+(o.s||13)+'" text-anchor="'+(o.a||'start')+'" style="font-family:ui-monospace,Menlo,Consolas,monospace;fill:'+(o.f||'#ddd')+'">'+t+'</text>'};
const lcg=seed=>{let x=seed;return()=>{x=(x*16807)%2147483647;return x/2147483647}};
/* x of column j in a sTab starting at x0 */
const colX=(x0,cols,j)=>x0+cols.slice(0,j).reduce((a,c)=>a+c.w,0);
/* a table panel inside a .duo/.trio grid, centred in a viewBox at least minW wide so text keeps the same size across panels */
function tabCell(host,title,t,note,minW,extra,H){const W=Math.max(minW||330,t.w+8),dx=(W-t.w)/2-4;
  return cell(host,title,'<g transform="translate('+dx+',0)">'+t.s+(extra||'')+'</g>',W,H||t.h+8,title,note)}
