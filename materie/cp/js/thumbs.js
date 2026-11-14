/* miniatures: each one recalls the main figure of its lesson */
(function(){
  const sv=s=>'<svg viewBox="0 0 108 72" aria-hidden="true">'+s+'</svg>';
  /* lesson 1: the 4-bit wheel with the seam between 7 and -8 */
  let t='<circle cx="54" cy="36" r="24" fill="none" stroke="#555" stroke-width="2"/>';
  for(let k=0;k<16;k++){const a=(-90+k*22.5)*Math.PI/180;t+='<circle cx="'+(54+24*Math.cos(a)).toFixed(1)+'" cy="'+(36+24*Math.sin(a)).toFixed(1)+'" r="2.6" fill="'+(k<8?BLUE:PUR)+'"/>'}
  const s1=(-90+7.5*22.5)*Math.PI/180;t+='<line x1="'+(54+14*Math.cos(s1)).toFixed(1)+'" y1="'+(36+14*Math.sin(s1)).toFixed(1)+'" x2="'+(54+33*Math.cos(s1)).toFixed(1)+'" y2="'+(36+33*Math.sin(s1)).toFixed(1)+'" stroke="'+RED+'" stroke-width="2.5"/>';
  THUMB[1]=sv(t);
  /* lesson 2: pointer, header, contiguous data */
  t='<line x1="6" y1="44" x2="102" y2="44" stroke="#444"/><line x1="6" y1="58" x2="102" y2="58" stroke="#444"/>'+
    '<rect x="12" y="44" width="12" height="14" fill="'+PINK+'" fill-opacity=".7"/><rect x="50" y="44" width="14" height="14" fill="'+ORG+'" fill-opacity=".8"/>';
  for(let k=0;k<4;k++)t+='<rect x="'+(66+k*9)+'" y="45" width="7" height="12" fill="'+BLUE+'" fill-opacity=".75"/>';
  t+='<path d="M18 44C18 18 52 18 56 40" fill="none" stroke="'+PINK+'" stroke-width="2"/>';
  THUMB[2]=sv(t);
  /* lesson 3: Monte Carlo points and the quarter circle */
  t='<rect x="30" y="8" width="56" height="56" fill="none" stroke="#666"/>';
  let sd=11;const r=()=>{sd=(sd*16807)%2147483647;return (sd-1)/2147483646};for(let k=0;k<70;k++){const x=r(),y=r();t+='<circle cx="'+(30+x*56).toFixed(1)+'" cy="'+(64-y*56).toFixed(1)+'" r="1.6" fill="'+(x*x+y*y<=1?BLUE:'#666')+'"/>'}
  t+='<path d="M86 64A56 56 0 0 0 30 8" fill="none" stroke="'+YEL+'" stroke-width="2"/>';
  THUMB[3]=sv(t);
  /* lesson 4: a small configuration graph with a local minimum */
  t='';const g4=[[20,52],[40,22],[60,46],[82,20],[92,54]],e4=[[0,1],[1,2],[2,3],[3,4],[0,2],[2,4]];
  e4.forEach(([a,b])=>{t+='<line x1="'+g4[a][0]+'" y1="'+g4[a][1]+'" x2="'+g4[b][0]+'" y2="'+g4[b][1]+'" stroke="#555" stroke-width="2"/>'});
  g4.forEach((p,k)=>{t+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="6" fill="#111" stroke="'+(k===2?PUR:k===4?PINK:'#999')+'" stroke-width="2.5"/>'});
  t+='<path d="M24 46Q34 30 54 44" fill="none" stroke="'+GRN+'" stroke-width="2"/>';
  THUMB[4]=sv(t);
  /* lesson 5: a TSP route through random cities */
  t='';sd=77;const pts5=[];for(let k=0;k<12;k++){const a=2*Math.PI*k/12;pts5.push([54+30*Math.cos(a)+(r()-.5)*10,36+24*Math.sin(a)+(r()-.5)*8])}
  t+='<path d="M'+pts5.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join('L')+'Z" fill="none" stroke="'+PINK+'" stroke-width="2"/>';
  pts5.forEach(p=>{t+='<circle cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="2.4" fill="#fff"/>'});
  THUMB[5]=sv(t);
  /* lesson 6: two objects, one shared array */
  t='<rect x="10" y="10" width="34" height="18" fill="none" stroke="#999"/><rect x="10" y="44" width="34" height="18" fill="none" stroke="#999"/>';
  for(let k=0;k<4;k++)t+='<rect x="'+(62+k*10)+'" y="28" width="9" height="16" fill="'+BLUE+'" fill-opacity=".75"/>';
  t+='<path d="M44 19C56 19 54 32 62 34" fill="none" stroke="'+PINK+'" stroke-width="2"/><path d="M44 53C56 53 54 40 62 38" fill="none" stroke="'+PINK+'" stroke-width="2"/>';
  THUMB[6]=sv(t);
})();
