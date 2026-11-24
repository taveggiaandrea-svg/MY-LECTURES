#!/usr/bin/env python3
"""Costruisce il sito statico in site/ a partire da shared/ e materie/.

Uso: python3 build.py [cartella-katex-dist]
La cartella di KaTeX 0.16.9 (dist) serve solo per copiare i file in site/assets/katex;
se manca e site/assets/katex esiste già, i file esistenti vengono tenuti.
"""
import json, os, re, shutil, sys, html

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.join(HERE, 'site')
rd = lambda *p: open(os.path.join(HERE, *p), encoding='utf-8').read()

def write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, 'w', encoding='utf-8').write(text)

LOGO = '''<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%231b2a3a'/%3E%3Cstop offset='1' stop-color='%230b0f14'/%3E%3C/linearGradient%3E%3ClinearGradient id='l' x1='0' y1='0' x2='1' y2='0'%3E%3Cstop offset='0' stop-color='%233fa9c9'/%3E%3Cstop offset='1' stop-color='%237fd6ea'/%3E%3C/linearGradient%3E%3ClinearGradient id='r' x1='1' y1='0' x2='0' y2='0'%3E%3Cstop offset='0' stop-color='%23b8559f'/%3E%3Cstop offset='1' stop-color='%23ea95dc'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='64' height='64' rx='15' fill='url(%23bg)'/%3E%3Crect x='.75' y='.75' width='62.5' height='62.5' rx='14.3' fill='none' stroke='%23fff' stroke-opacity='.12' stroke-width='1.5'/%3E%3Cpath d='M31 25Q22 19 11 22V49Q22 46 31 51Z' fill='url(%23l)'/%3E%3Cpath d='M33 25Q42 19 53 22V49Q42 46 33 51Z' fill='url(%23r)'/%3E%3Cpath d='M15 29Q22 27.5 27 30M15 35Q22 33.5 27 36M15 41Q22 39.5 27 42M37 30Q42 27.5 49 29M37 36Q42 33.5 49 35M37 42Q42 39.5 49 41' stroke='%230b0f14' stroke-opacity='.35' stroke-width='1.6' fill='none' stroke-linecap='round'/%3E%3Ccircle cx='32' cy='13' r='7' fill='%23FFFF00' opacity='.18'/%3E%3Ccircle cx='32' cy='13' r='4.2' fill='%23FFFF00'/%3E%3C/svg%3E">'''+'\n'
FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@300..700'
         '&family=Source+Serif+4:ital,opsz,wght@0,8..60,300..700;1,8..60,300..700&display=swap">\n')
THEME = "<script>try{if(localStorage.getItem('tema')==='light')document.documentElement.setAttribute('data-theme','light')}catch(e){}</script>\n"

def head(title, up, lang='it', extra=''):
    return ('<!DOCTYPE html>\n<html lang="' + lang + '">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
            '<meta name="robots" content="noindex, nofollow">\n'
            '<title>' + html.escape(title) + '</title>\n' + LOGO + FONTS +
            '<link rel="stylesheet" href="' + up + 'assets/katex/katex.min.css">\n'
            '<link rel="stylesheet" href="' + up + 'assets/style.css">\n' + extra + THEME + '</head>\n<body>\n')

def katex_assets():
    src = sys.argv[1] if len(sys.argv) > 1 else None
    dst = os.path.join(SITE, 'assets', 'katex')
    if src:
        if os.path.isdir(dst):
            shutil.rmtree(dst)
        os.makedirs(os.path.join(dst, 'contrib'))
        for f in ('katex.min.css', 'katex.min.js'):
            shutil.copy(os.path.join(src, f), dst)
        shutil.copy(os.path.join(src, 'contrib', 'auto-render.min.js'), os.path.join(dst, 'contrib'))
        shutil.copytree(os.path.join(src, 'fonts'), os.path.join(dst, 'fonts'))
    elif not os.path.isdir(dst):
        sys.exit('Manca KaTeX: passare la cartella dist di katex@0.16.9 come argomento.')

def lessons_of(src):
    d = os.path.join(src, 'lezioni')
    return sorted((int(re.match(r'l(\d+)\.html$', f).group(1)) for f in os.listdir(d) if re.match(r'l\d+\.html$', f)))

def variants_of(mid):
    """Altre lingue della materia: sottocartelle di due lettere con una propria cartella lezioni/ (per esempio materie/bigdata/en/)."""
    base = os.path.join(HERE, 'materie', mid)
    return sorted(d for d in os.listdir(base) if re.fullmatch(r'[a-z]{2}', d) and os.path.isdir(os.path.join(base, d, 'lezioni')))

LANGNUMS = {}  # lingua -> numeri delle lezioni presenti, per la materia in costruzione (riempito da build_subject)

def lang_bar(mid, cur, langs):
    """Selettore di lingua nella barra superiore. langs: [(codice, nome, percorso relativo dalla pagina corrente)].
    data-nums elenca le lezioni presenti in quella lingua: boot.js spegne il link sulle lezioni che lì non ci sono."""
    if len(langs) < 2:
        return ''
    links = ''.join('<a href="%s" data-lang="%s" data-mid="%s" data-nums="%s"%s>%s</a>' % (href, code, mid, ','.join(map(str, LANGNUMS.get(code, []))), ' aria-current="true"' if code == cur else '', name)
                    for code, name, href in langs)
    return '<div class="lang" role="group" aria-label="Lingua / Language">' + links + '</div>\n  '

def lang_redirect(mid, cur, langs):
    """Nel <head>: se l'utente ha scelto un'altra lingua per questa materia, apre subito quella pagina, alla stessa lezione."""
    if len(langs) < 2:
        return ''
    m = ','.join("%s:'%s'" % (code, href) for code, _, href in langs)
    ln = ','.join("%s:[%s]" % (code, ','.join(map(str, LANGNUMS.get(code, [])))) for code, _, _ in langs)
    # una pagina preparata in background (prerender) non deve reindirizzarsi; le regole di speculazione chiedono a Chrome
    # di preparare in anticipo l'altra lingua, così il cambio dal selettore è immediato
    # non si cambia lingua se la lezione dell'indirizzo in quella lingua non c'è
    return ("<script>try{var p=localStorage.getItem('lingua-%s'),m={%s},L={%s},h=location.hash.match(/lezione-(\\d+)/);"
            "if(!document.prerendering&&p&&p!=='%s'&&m[p]&&!(h&&L[p].indexOf(+h[1])<0))location.replace(m[p]+location.hash)}catch(e){}</script>\n"
            '<script type="speculationrules">{"prerender":[{"where":{"selector_matches":".lang a:not([aria-current])"},"eagerness":"eager"}]}</script>\n') % (mid, m, ln, cur)

def build_page(mid, meta, src, out, up, cur, langs):
    """Costruisce una pagina della materia dalla cartella src (la materia o una sua lingua) in site/<out>/.
    I file che una lingua non ha (miniature, componenti, stile) vengono presi dalla cartella principale della materia."""
    main = os.path.join(HERE, 'materie', mid)
    pick = lambda *p: os.path.join(src, *p) if os.path.exists(os.path.join(src, *p)) else os.path.join(main, *p)
    rf = lambda path: open(path, encoding='utf-8').read()
    nums = lessons_of(src)
    body = rf(pick('top.html'))
    body = body.replace('<button class="tog"', lang_bar(mid, cur, langs) + '<button class="tog"', 1)
    for n in nums:
        body += '<!-- ===================== LEZIONE %d ===================== -->\n' % n + rf(os.path.join(src, 'lezioni', 'l%d.html' % n))
    body += rf(pick('foot.html'))
    css = pick('style.css')
    extra = '<link rel="stylesheet" href="style.css">\n' if os.path.exists(css) else ''
    if extra:
        write(os.path.join(SITE, out, 'style.css'), rf(css))
    extra += lang_redirect(mid, cur, langs)
    # pagine delle lezioni: la barra di scorrimento la disegna boot.js; la classe va messa subito, così la pagina non cambia larghezza al caricamento
    extra += "<script>document.documentElement.classList.add('lp')</script>\n"
    page = (head(meta['titolo'], up, meta.get('lingua', 'it'), extra) + body +
            '<script src="' + up + 'assets/katex/katex.min.js"></script>\n'
            '<script src="' + up + 'assets/katex/contrib/auto-render.min.js"></script>\n'
            '<script src="app.js"></script>\n</body>\n</html>\n')
    js = [rd('shared', 'core.js')]
    for f in ('macro.js', 'thumbs.js', 'shared.js'):
        p = pick('js', f)
        if os.path.exists(p):
            js.append(rf(p))
    js += [rf(os.path.join(src, 'js', 'l%d.js' % n)) for n in nums if os.path.exists(os.path.join(src, 'js', 'l%d.js' % n))]
    js.append(rd('shared', 'boot.js'))
    js.append(rd('shared', 'topgrid.js'))
    write(os.path.join(SITE, out, 'index.html'), page)
    write(os.path.join(SITE, out, 'app.js'), '(function(){\n' + '\n'.join(js) + '\n})();\n')
    titles = [re.search(r'data-title="([^"]*)"', rf(os.path.join(src, 'lezioni', 'l%d.html' % n))).group(1) for n in nums]
    return nums, titles

def build_subject(mid):
    meta = json.loads(rd('materie', mid, 'materia.json'))
    main = os.path.join(HERE, 'materie', mid)
    cur = meta.get('lingua', 'it')
    vars_ = [(v, dict(meta, **json.loads(rd('materie', mid, v, 'materia.json'))) if os.path.exists(os.path.join(main, v, 'materia.json')) else dict(meta, lingua=v))
             for v in variants_of(mid)]
    codes = [(cur, meta.get('nome_lingua', cur.upper()), '')] + [(v, m.get('nome_lingua', v.upper()), v + '/') for v, m in vars_]
    # percorsi relativi: dalla pagina principale './' e 'en/'; da una lingua '../' e './'
    rel = lambda here: [(c, n, ('./' if p == here else (p if here == '' else '../' + p))) for c, n, p in codes]
    LANGNUMS.clear(); LANGNUMS[cur] = lessons_of(main)
    for v, _ in vars_:
        LANGNUMS[v] = lessons_of(os.path.join(main, v))
    nums, titles = build_page(mid, meta, main, mid, '../', cur, rel(''))
    for v, m in vars_:
        build_page(mid, m, os.path.join(main, v), os.path.join(mid, v), '../../', v, rel(v + '/'))
    return meta, nums, titles

def thumb_svg(mid, k):
    """Estrae la miniatura k della materia eseguendo thumbs.js in Node, se disponibile."""
    p = os.path.join(HERE, 'materie', mid, 'js', 'thumbs.js')
    if not os.path.exists(p):
        return ''
    core = rd('shared', 'core.js')
    consts = core[:core.index('const MAC')]
    code = consts + 'const THUMB={};\n' + open(p, encoding='utf-8').read() + '\nprocess.stdout.write(THUMB[%d]||"");' % k
    tmp = os.path.join(SITE, '.thumb.js')
    write(tmp, code)
    try:
        import subprocess
        return subprocess.run(['node', tmp], capture_output=True, text=True, timeout=20).stdout
    except Exception:
        return ''
    finally:
        os.remove(tmp)

# pagina iniziale: le materie con più lingue portano direttamente alla lingua scelta l'ultima volta (niente doppio caricamento)
LANGLINKS = ("document.querySelectorAll('.subj[data-alt]').forEach(function(a){try{var p=localStorage.getItem('lingua-'+a.dataset.mid),"
             "m=JSON.parse(a.dataset.alt);if(p&&m[p])a.href=a.dataset.mid+'/'+m[p]}catch(e){}});")

def build_home(subjects):
    cards = ''
    for mid, meta, nums, titles in subjects:
        alt = {v: v + '/' for v in variants_of(mid)}
        cards += ('<a class="subj" href="' + mid + '/"' + (' data-mid="' + mid + '" data-alt=\'' + json.dumps(alt) + '\'' if alt else '') + '>'
                  '<span class="th" aria-hidden="true">' + thumb_svg(mid, meta.get('miniatura', 1)) + '</span>'
                  '<span class="tx"><b>' + html.escape(meta['titolo']) + '</b>'
                  '<span>' + html.escape(meta['descrizione']) + '</span>'
                  '<small>' + str(len(nums)) + ' lezioni · ' + html.escape(meta.get('fonte', '')) + '</small></span></a>\n')
    page = (head('Le mie lezioni', '') +
            '<header class="top solo">\n  <a class="name" href="./">Le mie lezioni</a>\n  <div class="right">\n'
            '  <button class="tog" id="tog" type="button"></button>\n  </div>\n</header>\n<main>\n'
            '<section class="hero"><div class="col">\n  <p class="chap">Un posto solo per tutte le materie</p>\n'
            '  <h1>Le mie lezioni</h1>\n  <p class="desc">Lezioni interattive costruite dalle fonti di ciascun corso: '
            'figure da guardare, formule colorate, quiz per verificarsi.</p>\n</div></section>\n'
            '<section><div class="col">\n<h2>Materie</h2>\n<div class="subjects">\n' + cards + '</div>\n'
            '<p class="domlink"><a href="domande/">Le domande fatte a «Chiedi all\'AI»</a></p>\n</div></section>\n</main>\n'
            '<footer><div class="col"><p>Rielaborazioni a scopo di studio personale. Le fonti di ogni materia sono indicate in fondo alle sue lezioni; '
            'alcune licenze non permettono di distribuire opere derivate, quindi questo sito non va reso pubblico.</p></div></footer>\n'
            '<script>' + rd('shared', 'home.js') + rd('shared', 'topgrid.js') + LANGLINKS + '</script>\n</body>\n</html>\n')
    write(os.path.join(SITE, 'index.html'), page)

def build_questions():
    """Pagina privata con l'archivio delle domande all'assistente (i dati vengono da /api/domande, nel Worker)."""
    page = (head("Domande all'AI", '../') +
            '<header class="top solo">\n  <a class="name" href="../">Le mie lezioni</a>\n  <div class="right">\n'
            '  <button class="tog" id="tog" type="button"></button>\n  </div>\n</header>\n<main>\n'
            '<section class="hero"><div class="col">\n  <p class="chap">Archivio di «Chiedi all\'AI»</p>\n'
            '  <h1>Che cosa ho chiesto all\'AI?</h1>\n  <p class="desc">Ogni domanda fatta all\'assistente, con la lezione da cui è nata e la risposta: '
            'serve a capire quali dubbi sorgono e a scrivere le prossime lezioni in modo che la risposta ci sia già.</p>\n</div></section>\n'
            '<section><div class="col">\n<h2>Dove nascono le domande</h2>\n<div id="domstat"></div>\n</div></section>\n'
            '<section><div class="col">\n<h2>Tutte le domande</h2>\n<div class="domctl"><select id="dommat" aria-label="Materia"></select>'
            '<input id="domq" type="search" placeholder="Cerca nel testo" aria-label="Cerca">'
            '<a class="btn" href="../api/domande?formato=csv" download>Esporta CSV</a><a class="btn" href="../api/domande" target="_blank" rel="noopener">JSON</a></div>\n'
            '<div id="dom"><p>Caricamento…</p></div>\n</div></section>\n</main>\n'
            '<script>' + rd('shared', 'home.js') + rd('shared', 'domande.js') + rd('shared', 'topgrid.js') + '</script>\n</body>\n</html>\n')
    write(os.path.join(SITE, 'domande', 'index.html'), page)

def main():
    katex_assets()
    write(os.path.join(SITE, 'assets', 'style.css'), rd('shared', 'style.css'))
    write(os.path.join(SITE, 'robots.txt'), 'User-agent: *\nDisallow: /\n')
    mids = sorted(d for d in os.listdir(os.path.join(HERE, 'materie')) if os.path.exists(os.path.join(HERE, 'materie', d, 'materia.json')))
    subjects = []
    for mid in mids:
        meta, nums, titles = build_subject(mid)
        subjects.append((mid, meta, nums, titles))
        print('materia', mid, len(nums), 'lezioni')
    subjects.sort(key=lambda s: s[1].get('ordine', 99))
    build_home(subjects)
    build_questions()
    print('sito scritto in', SITE)

if __name__ == '__main__':
    main()
