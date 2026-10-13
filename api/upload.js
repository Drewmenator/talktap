// Stores an image under <prefix>/img/<name> or an audio clip under <prefix>/aud/<name>. POST {pin, name, type, data (base64)}. Gated by the parent code.
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
  if (bytes.length < 300 || bytes.length > 3_500_000) return res.status(400).json({ error: "bad size " + bytes.length });
  const AUDIO = { "audio/mp4": "m4a", "audio/webm": "webm", "audio/mpeg": "mp3", "audio/aac": "aac", "audio/x-m4a": "m4a" };
  const isAudio = !!AUDIO[body.type];
  const type = isAudio ? AUDIO[body.type] : body.type === "image/webp" ? "webp" : body.type === "image/jpeg" ? "jpg" : "png";
  const r = await blobPut(`${PREFIX}/${isAudio ? "aud" : "img"}/${name}.${type}`, bytes, body.type || "image/png");
  return res.status(200).json({ ok: true, url: r.url, size: bytes.length });
}
