// Minimal Vercel Blob client over its REST API, no package needed.
const API = "https://blob.vercel-storage.com";
const token = () => process.env.BLOB_READ_WRITE_TOKEN;
export async function blobList(prefix, cursor) {
  const u = new URL(API + "/");
  u.searchParams.set("prefix", prefix); u.searchParams.set("limit", "1000"); if (cursor) u.searchParams.set("cursor", cursor);
  const r = await fetch(u, { headers: { authorization: `Bearer ${token()}`, "x-api-version": "7" } });
  if (!r.ok) throw new Error(`blob list ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return r.json(); // { blobs:[{url,pathname,size,uploadedAt}], cursor, hasMore }
}
export async function blobPut(pathname, body, contentType) {
  const r = await fetch(`${API}/${pathname}`, {
    method: "PUT", body,
    headers: { authorization: `Bearer ${token()}`, "x-api-version": "7", "x-content-type": contentType, "x-add-random-suffix": "0", "x-allow-overwrite": "1", "x-cache-control-max-age": "60" }
  });
  if (!r.ok) throw new Error(`blob put ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return r.json();
}
export async function blobGetJson(url) {
  const r = await fetch(url + (url.includes("?") ? "&" : "?") + "t=" + Date.now(), { cache: "no-store" });
  if (!r.ok) return null;
  try { return await r.json(); } catch { return null; }
}
export async function blobDelete(urls) {
  if (!urls.length) return;
  const r = await fetch(`${API}/delete`, { method: "POST", headers: { authorization: `Bearer ${token()}`, "x-api-version": "7", "content-type": "application/json" }, body: JSON.stringify({ urls }) });
  if (!r.ok) throw new Error(`blob delete ${r.status}: ${(await r.text()).slice(0, 200)}`);
}
