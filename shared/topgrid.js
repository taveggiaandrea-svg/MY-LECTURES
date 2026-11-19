/* griglia animata nella barra: una griglia che subisce lentamente trasformazioni lineari */
(function(){const top=document.querySelector('.top');if(!top)return;const cv=document.createElement('canvas');if(!cv.getContext)return;cv.className='tg';cv.setAttribute('aria-hidden','true');top.insertBefore(cv,top.firstChild);const c=cv.getContext('2d');
  const MS=[[1,0,0,1],[1,.9,0,1],[.82,.5,-.5,.82],[1.25,.25,.35,.8],[.7,-.45,.6,1.05],[1,0,0,1]],SEG=7,HOLD=1.6,TOT=(MS.length-1)*(SEG+HOLD);
  const ez=t=>t*t*t*(t*(6*t-15)+10);let W=0,Hh=0,raf=null,t0=null;
  function size(){const d=Math.min(2,window.devicePixelRatio||1);W=cv.clientWidth;Hh=cv.clientHeight;cv.width=W*d;cv.height=Hh*d;c.setTransform(d,0,0,d,0,0)}
  function draw(sec){const u=sec%TOT,k=Math.floor(u/(SEG+HOLD)),f=ez(Math.min(1,(u-k*(SEG+HOLD))/SEG)),A=MS[k],B=MS[k+1],m=A.map((v,i)=>v+(B[i]-v)*f);
    c.clearRect(0,0,W,Hh);const s=34,ox=W*.2,oy=Hh/2+6,sk=-.32,P=(x,y)=>{const X=m[0]*x+m[1]*y,Y=m[2]*x+m[3]*y;return [ox+s*(X+sk*Y),oy-s*Y*.62]};
    for(let pass=0;pass<2;pass++)for(let i=-64;i<=64;i++){const main=i%4===0;if((pass===1)!==main)continue;c.strokeStyle=main?'rgba(88,160,230,.42)':'rgba(255,255,255,.13)';c.lineWidth=main?1.2:1;
      let a=P(i,-90),b=P(i,90);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();a=P(-90,i);b=P(90,i);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke()}}
  function tick(ts){if(t0==null)t0=ts;draw((ts-t0)/1000);raf=requestAnimationFrame(tick)}
  const still=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  function start(){if(!raf&&!still&&!document.hidden)raf=requestAnimationFrame(tick)}
  function stop(){if(raf){cancelAnimationFrame(raf);raf=null}}
  size();draw(0);start();window.addEventListener('resize',()=>{size();draw(0)});document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
})();
