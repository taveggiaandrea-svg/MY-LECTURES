// Protegge tutto il sito con una password (autenticazione HTTP Basic).
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

    const r = await env.ASSETS.fetch(request);
    const out = new Response(r.body, r);
    out.headers.set("X-Robots-Tag", "noindex, nofollow");
    out.headers.set("Cache-Control", "private, no-store");
    return out;
  },
};
