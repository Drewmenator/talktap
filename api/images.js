// Lists the stored image URLs by name so the app can load them. Public (the images are public anyway).
import { blobList } from "./_blob.js";
const PREFIX = process.env.BLOB_PREFIX || "tt";
export default async function handler(req, res) {
  try {
    const out = {}; let cursor;
    do { const r = await blobList(`${PREFIX}/img/`, cursor); for (const b of (r.blobs || [])) { const m = b.pathname.match(/img\/([^/]+)\.(png|jpg|webp)$/); if (m) out[m[1]] = b.url; } cursor = r.hasMore && r.cursor ? r.cursor : undefined; } while (cursor);
    res.setHeader("Cache-Control", "public, max-age=300");
    return res.status(200).json(out);
  } catch (err) { return res.status(500).json({ error: String(err && err.message || err) }); }
}
