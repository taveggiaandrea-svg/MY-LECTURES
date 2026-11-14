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
})();
