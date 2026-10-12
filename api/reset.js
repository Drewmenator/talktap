// Deletes the logged history for one child. POST {pin, kid}. Gated by the parent code.
import { blobList, blobDelete } from "./_blob.js";
const PREFIX = process.env.BLOB_PREFIX || "tt";
export default async function handler(req, res) {
  try { return await main(req, res); } catch (err) { return res.status(500).json({ error: String(err && err.message || err) }); }
}
async function main(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  let body = req.body; if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = null; } }
  if (!body || !process.env.PARENT_PIN || String(body.pin) !== process.env.PARENT_PIN) return res.status(401).json({ error: "wrong code" });
  const kid = String(body.kid || "").toLowerCase().replace(/[^a-z0-9_-]/g, "");
  if (!kid) return res.status(400).json({ error: "kid required" });
  const urls = []; let cursor;
  do { const r = await blobList(`${PREFIX}/events/${kid}/`, cursor); for (const b of (r.blobs || [])) urls.push(b.url); cursor = r.hasMore && r.cursor ? r.cursor : undefined; } while (cursor);
  for (let i = 0; i < urls.length; i += 100) await blobDelete(urls.slice(i, i + 100));
  return res.status(200).json({ ok: true, deleted: urls.length });
}
