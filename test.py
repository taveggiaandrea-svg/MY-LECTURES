#!/usr/bin/env python3
"""Test in browser del sito costruito: python3 test.py [shots]
Serve site/ via HTTP, apre la pagina iniziale e ogni lezione di ogni materia a 1150 e 400 px,
clicca pulsanti, muove slider, risponde ai quiz e segnala errori. Con 'shots' salva uno screenshot per figura."""
import asyncio, json, os, re, sys, threading, http.server, functools
from playwright.async_api import async_playwright
HERE=os.path.dirname(os.path.abspath(__file__)); SITE=os.path.join(HERE,'site'); SHOTS=os.path.join(HERE,'.shots')
PORT=8765
def serve():
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self,*a): pass
    h=functools.partial(Q,directory=SITE)
    http.server.ThreadingHTTPServer(('127.0.0.1',PORT),h).serve_forever()
async def block(r):
    await (r.continue_() if r.request.url.startswith('http://127.0.0.1') else r.abort())
CHECK="""(sel)=>{const a=document.querySelector(sel);const txt=a.innerText;
 return {sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,kerr:a.querySelectorAll('.katex-error').length,
 nan:(a.innerHTML.match(/NaN|undefined|Infinity/g)||[]).length,raw:(txt.match(/\\\\[a-zA-Z]{2,}/g)||[]).slice(0,5),
 empty:[...a.querySelectorAll('.stage .w')].filter(w=>!w.children.length).map(w=>w.id),lists:a.querySelectorAll('ul,ol,li').length,
 figs:a.querySelectorAll('figure').length,quiz:a.querySelectorAll('.q').length}}"""
async def main():
    shots=len(sys.argv)>1 and sys.argv[1]=='shots'; os.makedirs(SHOTS,exist_ok=True)
    threading.Thread(target=serve,daemon=True).start()
    subs=sorted(d for d in os.listdir(SITE) if os.path.exists(os.path.join(SITE,d,'index.html')))
    bad=0
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for w in (1150,400):
            pg=await b.new_page(viewport={'width':w,'height':900});errs=[]
            pg.on('pageerror',lambda e:errs.append(str(e)))
            await pg.route('**/*',block)
            await pg.goto('http://127.0.0.1:%d/'%PORT);await pg.wait_for_timeout(300)
            sw=await pg.evaluate('[document.documentElement.scrollWidth,document.documentElement.clientWidth,document.querySelectorAll(".subj").length]')
            print('home',w,sw,errs or 'ok');bad+=bool(errs)or sw[0]>sw[1]
            if shots: await pg.screenshot(path=os.path.join(SHOTS,'home_%d.png'%w),full_page=True)
            await pg.close()
            for s in subs:
                n=len(re.findall(r'class="lesson"',open(os.path.join(SITE,s,'index.html'),encoding='utf-8').read()))
                for k in range(1,n+1):
                    pg=await b.new_page(viewport={'width':w,'height':900});errs=[]
                    pg.on('pageerror',lambda e:errs.append(str(e)))
                    pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
                    await pg.route('**/*',block)
                    await pg.goto('http://127.0.0.1:%d/%s/#lezione-%d'%(PORT,s,k));await pg.wait_for_timeout(500)
                    sel='#lezione-%d'%k
                    await pg.evaluate("(s)=>{document.querySelectorAll(s+' .stage button').forEach(b=>{if(!b.disabled)b.click()});document.querySelectorAll(s+' .stage input[type=range]').forEach(i=>{for(const v of [i.min,i.max,(+i.min+ +i.max)/2]){i.value=v;i.dispatchEvent(new Event('input',{bubbles:true}))}});document.querySelectorAll(s+' .q').forEach(q=>{const o=q.querySelector('.opts .btn');if(!o)return;o.click();const c=q.querySelector('.chk');if(c)c.click()})}",sel)
                    info=await pg.evaluate(CHECK,sel)
                    errs=[e for e in errs if 'fonts.g' not in e and 'net::' not in e and 'Failed to load resource' not in e]
                    probs=[x for x in ('kerr','nan','lists') if info[x]]+(['overflow'] if info['sw']>info['cw'] else [])+info['empty']+info['raw']+errs[:3]
                    bad+=bool(probs)
                    print(s,k,w,'figure',info['figs'],'quiz',info['quiz'],'OK' if not probs else probs)
                    if shots and w==1150:
                        await pg.evaluate("document.querySelectorAll('details').forEach(d=>d.open=true)")
                        figs=pg.locator(sel+' figure')
                        for i in range(await figs.count()):
                            await figs.nth(i).scroll_into_view_if_needed();await figs.nth(i).screenshot(path=os.path.join(SHOTS,'%s_L%d_f%02d.png'%(s,k,i)))
                    await pg.close()
        await b.close()
    print('PROBLEMI:',bad)
asyncio.run(main())
