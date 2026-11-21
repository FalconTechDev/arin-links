import { readFileSync, writeFileSync } from "node:fs";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const old = JSON.parse(readFileSync("stats.json", "utf8"));

async function telegram(h) {
  const r = await fetch(`https://t.me/${h}`, { headers: { "user-agent": UA } });
  const m = (await r.text()).match(/tgme_page_extra">([^<]*)</);
  return m ? parseInt(m[1].replace(/\D/g, ""), 10) || null : null;
}
async function tiktok(h) {
  const r = await fetch(`https://www.tiktok.com/@${h}`, { headers: { "user-agent": UA, "accept-language": "en-US,en;q=0.9" } });
  const m = (await r.text()).match(/"followerCount":(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}
async function safe(name, fn) {
  try { const v = await fn(); console.log(name, v); return v; }
  catch (e) { console.log(name, "error", String(e)); return null; }
}
const tg = await safe("telegram", () => telegram("aaaeeezz"));
const tt = await safe("tiktok", () => tiktok("arinwit6"));
const next = { tiktok: tt ?? old.tiktok, telegram: tg ?? old.telegram };
writeFileSync("stats.json", JSON.stringify(next) + "\n");
console.log("result", JSON.stringify(next), tt == null ? "(tiktok: null, kept old)" : "");
