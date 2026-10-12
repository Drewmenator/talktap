// Appends a batch of answer events to one JSON file per child, per day, per device.
import { put, list } from "@vercel/blob";
const PREFIX = process.env.BLOB_PREFIX || "tt";
const ALLOWED = ["kid","mode","level","wh","item","target","choice","correct","first_try","score","voice","client_ts","session_id"];
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  let body = req.body; if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = null; } }
  if (!body || !Array.isArray(body.events) || !body.device) return res.status(400).json({ error: "bad body" });
  const device = String(body.device).replace(/[^a-z0-9_-]/gi, "").slice(0, 40) || "dev";
  const groups = {};
  for (const e of body.events.slice(0, 500)) {
    const kid = String(e.kid || "").toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 20); if (!kid) continue;
    const ts = e.client_ts && !isNaN(Date.parse(e.client_ts)) ? new Date(e.client_ts) : new Date();
    const day = ts.toISOString().slice(0, 10);
    const clean = {}; for (const k of ALLOWED) if (e[k] !== undefined) clean[k] = typeof e[k] === "string" ? e[k].slice(0, 120) : e[k];
    clean.client_ts = ts.toISOString(); clean.received_at = new Date().toISOString();
    (groups[`${kid}/${day}`] ||= []).push(clean);
  }
  let written = 0;
  for (const [key, evs] of Object.entries(groups)) {
    const path = `${PREFIX}/events/${key}/${device}.json`;
    let existing = [];
    try {
      const { blobs } = await list({ prefix: path, limit: 1 });
      const hit = blobs.find(b => b.pathname === path);
      if (hit) { const r = await fetch(hit.url + "?t=" + Date.now(), { cache: "no-store" }); if (r.ok) existing = await r.json(); }
    } catch {}
    if (!Array.isArray(existing)) existing = [];
    const merged = existing.concat(evs).slice(-5000);
    await put(path, JSON.stringify(merged), { access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json", cacheControlMaxAge: 0 });
    written += evs.length;
  }
  return res.status(200).json({ ok: true, written });
}
