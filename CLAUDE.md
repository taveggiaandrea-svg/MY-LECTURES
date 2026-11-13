# Istruzioni per Claude

Questo repository è il sito «Le mie lezioni» di Andrea: lezioni interattive in stile 3Blue1Brown, una cartella per materia.

Prima di qualsiasi modifica leggi `README.md` (struttura del repository, come aggiungere materie e lezioni, come costruire e testare) e `METODO.md` (regole di scrittura, stile, figure, quiz, verifica). Seguili alla lettera.

Regole fisse:
- Non modificare `site/` a mano: si rigenera con `python3 build.py` (la prima volta passando la cartella dist di katex@0.16.9, installabile con `npm install katex@0.16.9`).
- Prima di caricare: `python3 test.py shots`, zero problemi, e guarda gli screenshot delle figure nuove.
- Testi in italiano, senza trattini lunghi o medi.
- Il sito resta privato: non aggiungere nulla che lo renda indicizzabile o pubblico.
- Alla fine di ogni lavoro: commit con un messaggio chiaro e push su `main`; Cloudflare Pages pubblica da solo la cartella `site/`.
