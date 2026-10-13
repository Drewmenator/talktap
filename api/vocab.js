// Parent-added words. One JSON file per family at <prefix>/vocab/custom.json.
// GET returns the list (public, like the pictures). POST {pin, word} upserts by id. DELETE {pin, id} removes.
import { blobList, blobPut, blobGetJson } from "./_blob.js";
const PREFIX = process.env.BLOB_PREFIX || "tt";
const PATH = `${PREFIX}/vocab/custom.json`;
export const config = { api: { bodyParser: { sizeLimit: "1mb" } } };
export default async function handler(req, res) {
  try { return await main(req, res); } catch (err) { return res.status(500).json({ error: String(err && err.message || err) }); }
}
async function current() {
  const { blobs } = await blobList(PATH);
  const b = (blobs || []).find(x => x.pathname === PATH);
  if (!b) return [];
  const j = await blobGetJson(b.url);
  return Array.isArray(j) ? j : [];
}
async function main(req, res) {
  if (req.method === "GET") { res.setHeader("Cache-Control", "no-store"); return res.status(200).json(await current()); }
  let body = req.body; if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = null; } }
  if (!body || !process.env.PARENT_PIN || String(body.pin) !== process.env.PARENT_PIN) return res.status(401).json({ error: "wrong code" });
  const list = await current();
  if (req.method === "DELETE") {
    const id = String(body.id || "");
    const next = list.filter(w => w.id !== id);
    await blobPut(PATH, JSON.stringify(next), "application/json");
    return res.status(200).json({ ok: true, count: next.length });
  }
  if (req.method !== "POST") return res.status(405).json({ error: "GET, POST or DELETE" });
  const w = body.word; if (!w || typeof w !== "object") return res.status(400).json({ error: "word required" });
  const clean = {
    id: String(w.id || "").replace(/[^a-z0-9_-]/gi, "").slice(0, 40),
    w: String(w.w || "").slice(0, 40).trim(), e: String(w.e || "⭐").slice(0, 8), cat: String(w.cat || "objects").slice(0, 20),
    st: Array.isArray(w.st) ? w.st.slice(0, 5).map(s => String(s || "").slice(0, 80)) : [],
    img: w.img ? String(w.img).slice(0, 60) : null, audio: w.audio ? String(w.audio).slice(0, 300) : null,
    tip: String(w.tip || "").slice(0, 200), added: new Date().toISOString()
  };
  if (!clean.id || !clean.w) return res.status(400).json({ error: "id and word required" });
  const next = list.filter(x => x.id !== clean.id).concat([clean]).slice(-400);
  await blobPut(PATH, JSON.stringify(next), "application/json");
  return res.status(200).json({ ok: true, count: next.length });
}
