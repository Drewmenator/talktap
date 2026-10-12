// Returns an aggregated progress report for the parent page. Gated by the parent code.
import { list } from "@vercel/blob";
const PREFIX = process.env.BLOB_PREFIX || "tt";
const MODES = ["find","read","say","ask"];
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const pin = String(req.query.pin || "");
  if (!process.env.PARENT_PIN || pin !== process.env.PARENT_PIN) return res.status(401).json({ error: "wrong code" });
  const days = Math.min(Math.max(parseInt(req.query.days || "30", 10) || 30, 1), 365);
  const since = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
  const files = []; let cursor;
  do {
    const r = await list({ prefix: `${PREFIX}/events/`, cursor, limit: 1000 });
    for (const b of r.blobs) { const m = b.pathname.match(/events\/([^/]+)\/(\d{4}-\d{2}-\d{2})\/([^/]+)\.json$/); if (m && m[2] >= since) files.push({ kid: m[1], day: m[2], url: b.url }); }
    cursor = r.hasMore ? r.cursor : undefined;
  } while (cursor);
  const events = [];
  await Promise.all(files.map(async f => { try { const r = await fetch(f.url + "?t=" + Date.now(), { cache: "no-store" }); const arr = await r.json(); if (Array.isArray(arr)) for (const e of arr) events.push({ ...e, kid: f.kid, day: f.day }); } catch {} }));
  events.sort((a, b) => a.client_ts < b.client_ts ? -1 : 1);
  const kids = {};
  for (const e of events) {
    const k = kids[e.kid] ||= { kid: e.kid, days: {}, modes: {}, said: {}, trouble: {}, sessions: {}, level: null, wh: null, last: null, total: 0 };
    k.total++; k.last = e.client_ts;
    if (e.level) k.level = e.level; if (e.wh) k.wh = e.wh;
    const d = k.days[e.day] ||= { day: e.day, tries: 0, right: 0, first: 0, said: 0, sessions: new Set() };
    d.tries++; if (e.correct || e.score > 0) d.right++; if (e.first_try) d.first++; if (e.mode === "say" && e.score === 2) d.said++; if (e.session_id) d.sessions.add(e.session_id);
    const m = k.modes[e.mode] ||= { mode: e.mode, tries: 0, right: 0, first: 0 };
    m.tries++; if (e.correct || e.score > 0) m.right++; if (e.first_try) m.first++;
    if (e.mode === "say" && e.score === 2 && e.target) k.said[e.target] = (k.said[e.target] || 0) + 1;
    if (e.mode !== "say" && e.correct === false && e.item) { const t = k.trouble[e.item] ||= { item: e.item, wrong: 0, right: 0 }; t.wrong++; }
    if (e.mode !== "say" && e.correct === true && e.item) { const t = k.trouble[e.item] ||= { item: e.item, wrong: 0, right: 0 }; t.right++; }
    const s = k.sessions[e.session_id || e.day] ||= { first: e.client_ts, last: e.client_ts, day: e.day };
    if (e.client_ts > s.last) s.last = e.client_ts; if (e.client_ts < s.first) s.first = e.client_ts;
  }
  const out = Object.values(kids).map(k => {
    const minutesByDay = {};
    for (const s of Object.values(k.sessions)) { const mins = Math.min((Date.parse(s.last) - Date.parse(s.first)) / 60000 + 0.5, 60); minutesByDay[s.day] = (minutesByDay[s.day] || 0) + mins; }
    return {
      kid: k.kid, total: k.total, level: k.level, wh: k.wh, last: k.last,
      days: Object.values(k.days).sort((a, b) => a.day < b.day ? -1 : 1).map(d => ({ day: d.day, tries: d.tries, right: d.right, first: d.first, said: d.said, minutes: Math.round(minutesByDay[d.day] || 0) })),
      modes: MODES.filter(m => k.modes[m]).map(m => k.modes[m]),
      said: Object.entries(k.said).sort((a, b) => b[1] - a[1]).slice(0, 40).map(([w, n]) => ({ word: w, times: n })),
      trouble: Object.values(k.trouble).filter(t => t.wrong >= 2 && t.wrong > t.right).sort((a, b) => b.wrong - a.wrong).slice(0, 12),
      mastered: Object.values(k.trouble).filter(t => t.right >= 3 && t.wrong === 0).length
    };
  });
  return res.status(200).json({ days, generated: new Date().toISOString(), kids: out });
}
