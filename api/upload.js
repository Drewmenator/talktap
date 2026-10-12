// Stores an image in Blob under <prefix>/img/<name>. POST {pin, name, data (base64 png)}. Gated by the parent code.
import { blobPut } from "./_blob.js";
const PREFIX = process.env.BLOB_PREFIX || "tt";
export const config = { api: { bodyParser: { sizeLimit: "4mb" } } };
export default async function handler(req, res) {
  try { return await main(req, res); } catch (err) { return res.status(500).json({ error: String(err && err.message || err) }); }
}
async function main(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  let body = req.body; if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = null; } }
  if (!body || !process.env.PARENT_PIN || String(body.pin) !== process.env.PARENT_PIN) return res.status(401).json({ error: "wrong code" });
  const name = String(body.name || "").replace(/[^a-z0-9_-]/gi, "").slice(0, 60);
  if (!name || typeof body.data !== "string") return res.status(400).json({ error: "name and data required" });
  const bytes = Buffer.from(body.data, "base64");
  if (bytes.length < 1000 || bytes.length > 3_500_000) return res.status(400).json({ error: "bad size " + bytes.length });
  const type = body.type === "image/webp" ? "webp" : body.type === "image/jpeg" ? "jpg" : "png";
  const r = await blobPut(`${PREFIX}/img/${name}.${type}`, bytes, body.type || "image/png");
  return res.status(200).json({ ok: true, url: r.url, size: bytes.length });
}
