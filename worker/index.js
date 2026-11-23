import { DurableObject } from "cloudflare:workers";

// Protegge tutto il sito con una password (autenticazione HTTP Basic).
// Dopo la password, /api/domande è l'archivio delle domande fatte all'assistente «Chiedi all'AI»
// (un Durable Object con SQLite: si crea da solo al primo deploy, nessuna impostazione nel pannello).
// Utente e password stanno nei segreti Cloudflare SITE_USER e SITE_PASSWORD:
// finché non sono impostati il sito resta chiuso a tutti.

const enc = new TextEncoder();

function uguali(a, b) {
  const x = enc.encode(a), y = enc.encode(b);
  if (x.byteLength !== y.byteLength) return false;
  return crypto.subtle.timingSafeEqual(x, y);
}

function chiedi(msg) {
  return new Response(msg, {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Le mie lezioni", charset="UTF-8"',
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

export default {
  async fetch(request, env) {
    const user = env.SITE_USER, pass = env.SITE_PASSWORD;
    if (!user || !pass) return chiedi("Sito privato: password non ancora impostata.");

    const h = request.headers.get("Authorization") || "";
    const [tipo, dati] = h.split(" ");
    if (tipo !== "Basic" || !dati) return chiedi("Sito privato.");

    let testo;
    try {
      testo = new TextDecoder().decode(Uint8Array.from(atob(dati), c => c.charCodeAt(0)));
    } catch {
      return chiedi("Sito privato.");
    }
    const i = testo.indexOf(":");
    if (i < 0 || !uguali(testo.slice(0, i), user) || !uguali(testo.slice(i + 1), pass)) {
      return chiedi("Utente o password sbagliati.");
    }

    const url = new URL(request.url);
    if (url.pathname === "/api/domande" || url.pathname.startsWith("/api/domande/")) return domande(request, url, env);

    const r = await env.ASSETS.fetch(request);
    const out = new Response(r.body, r);
    out.headers.set("X-Robots-Tag", "noindex, nofollow");
    out.headers.set("Cache-Control", "private, no-store");
    return out;
  },
};

/* ---------- Archivio delle domande all'assistente ---------- */
const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
});
const testo = (v, max) => (typeof v === "string" ? v : v == null ? "" : String(v)).slice(0, max);

async function domande(request, url, env) {
  if (!env.DOMANDE) return json({ error: "archivio non configurato" }, 500);
  const db = env.DOMANDE.get(env.DOMANDE.idFromName("archivio"));
  const m = url.pathname.match(/^\/api\/domande\/(\d+)$/);
  if (request.method === "POST" && url.pathname === "/api/domande") {
    let b;
    try { b = await request.json(); } catch { return json({ error: "JSON non valido" }, 400); }
    const d = {
      materia: testo(b.materia, 40), corso: testo(b.corso, 120), lezione: Number.isInteger(b.lezione) ? b.lezione : null,
      titolo: testo(b.titolo, 200), domanda: testo(b.domanda, 4000), risposta: testo(b.risposta, 20000),
      modello: testo(b.modello, 60), errore: testo(b.errore, 500),
    };
    if (!d.domanda.trim()) return json({ error: "domanda vuota" }, 400);
    return json({ id: await db.aggiungi(d) }, 201);
  }
  if (request.method === "GET" && url.pathname === "/api/domande") {
    const righe = await db.elenco();
    if (url.searchParams.get("formato") === "csv") {
      const cols = ["id", "quando", "materia", "corso", "lezione", "titolo", "domanda", "risposta", "modello", "errore"];
      const q = v => '"' + String(v ?? "").replace(/"/g, '""') + '"';
      const csv = "\ufeff" + cols.join(",") + "\r\n" + righe.map(r => cols.map(c => q(r[c])).join(",")).join("\r\n");
      return new Response(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="domande-ai.csv"', "Cache-Control": "no-store" } });
    }
    return json(righe);
  }
  if (request.method === "DELETE" && m) return json({ cancellate: await db.cancella(Number(m[1])) });
  return json({ error: "richiesta non prevista" }, 405);
}

export class Domande extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.sql = ctx.storage.sql;
    this.sql.exec(`CREATE TABLE IF NOT EXISTS domande (
      id INTEGER PRIMARY KEY AUTOINCREMENT, quando TEXT NOT NULL, materia TEXT, corso TEXT, lezione INTEGER,
      titolo TEXT, domanda TEXT NOT NULL, risposta TEXT, modello TEXT, errore TEXT)`);
  }
  aggiungi(d) {
    this.sql.exec("INSERT INTO domande (quando, materia, corso, lezione, titolo, domanda, risposta, modello, errore) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      new Date().toISOString(), d.materia, d.corso, d.lezione, d.titolo, d.domanda, d.risposta, d.modello, d.errore);
    return this.sql.exec("SELECT last_insert_rowid() AS id").one().id;
  }
  elenco() { return this.sql.exec("SELECT * FROM domande ORDER BY id").toArray(); }
  cancella(id) { this.sql.exec("DELETE FROM domande WHERE id = ?", id); return this.sql.exec("SELECT changes() AS n").one().n; }
}
