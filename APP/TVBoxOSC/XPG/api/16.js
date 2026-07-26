/*
@header({
  searchable: 0,
  filterable: 0,
  quickSearch: 0,
  title: '88看球[体]',
  author: 'OpenClaw',
  lang: 'cat'
})
*/

let host = 'https://www.88kanqiu.app';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
const headers = {
  'User-Agent': UA,
  'Referer': host + '/',
  'Accept': 'text/html,application/json,*/*'
};

const B64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function stripHtml(s) {
  return String(s || '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function absUrl(url) {
  url = String(url || '').trim();
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (url.indexOf('//') === 0) return 'https:' + url;
  if (url.charAt(0) === '/') return host + url;
  return host + '/' + url;
}

function safeJson(text, def) {
  try { return JSON.parse(text || '{}'); } catch (e) { return def || {}; }
}

// TV 端 JS 环境不一定有 atob/TextDecoder；这里按 PHP 源的 base64_decode 逻辑手写 UTF-8 解码。
function base64ToUtf8(str) {
  str = String(str || '').replace(/[^A-Za-z0-9+/=]/g, '');
  const bytes = [];
  for (let i = 0; i < str.length; i += 4) {
    const c1 = B64_CHARS.indexOf(str.charAt(i));
    const c2 = B64_CHARS.indexOf(str.charAt(i + 1));
    const c3 = B64_CHARS.indexOf(str.charAt(i + 2));
    const c4 = B64_CHARS.indexOf(str.charAt(i + 3));
    if (c1 < 0 || c2 < 0) continue;
    const n = (c1 << 18) | (c2 << 12) | ((c3 < 0 ? 0 : c3) << 6) | (c4 < 0 ? 0 : c4);
    bytes.push((n >> 16) & 255);
    if (str.charAt(i + 2) !== '=') bytes.push((n >> 8) & 255);
    if (str.charAt(i + 3) !== '=') bytes.push(n & 255);
  }

  let out = '';
  for (let i = 0; i < bytes.length;) {
    const b1 = bytes[i++];
    if (b1 < 0x80) {
      out += String.fromCharCode(b1);
    } else if (b1 >= 0xc0 && b1 < 0xe0) {
      const b2 = bytes[i++] || 0;
      out += String.fromCharCode(((b1 & 0x1f) << 6) | (b2 & 0x3f));
    } else if (b1 >= 0xe0 && b1 < 0xf0) {
      const b2 = bytes[i++] || 0;
      const b3 = bytes[i++] || 0;
      out += String.fromCharCode(((b1 & 0x0f) << 12) | ((b2 & 0x3f) << 6) | (b3 & 0x3f));
    } else {
      const b2 = bytes[i++] || 0;
      const b3 = bytes[i++] || 0;
      const b4 = bytes[i++] || 0;
      const cp = ((b1 & 0x07) << 18) | ((b2 & 0x3f) << 12) | ((b3 & 0x3f) << 6) | (b4 & 0x3f);
      const u = cp - 0x10000;
      out += String.fromCharCode(0xd800 + (u >> 10), 0xdc00 + (u & 0x3ff));
    }
  }
  return out;
}

function decodePlaySource(raw) {
  raw = String(raw || '').trim();
  if (!raw) return null;
  for (let prefix = 0; prefix <= 8; prefix++) {
    for (let suffix = 0; suffix <= 4; suffix++) {
      if (raw.length <= prefix + suffix) continue;
      const candidate = raw.slice(prefix, raw.length - suffix);
      try {
        const decoded = base64ToUtf8(candidate);
        const pos = decoded.indexOf('{');
        if (pos < 0) continue;
        const obj = JSON.parse(decoded.slice(pos));
        if (obj && typeof obj === 'object') return obj;
      } catch (e) {}
    }
  }
  return null;
}

function toDirectPlayUrl(url) {
  url = String(url || '').trim();
  if (!url) return '';
  const m = url.match(/[?&]url=([^&]+)/);
  if (m && m[1]) {
    try { return decodeURIComponent(m[1]); } catch (e) { return m[1]; }
  }
  return url;
}

async function fetchText(url, referer) {
  const hd = {
    'User-Agent': UA,
    'Referer': referer || host + '/',
    'Accept': 'text/html,application/json,*/*'
  };

  // 部分壳只有 Java.req，部分壳只有 req；两种都兼容。
  if (typeof Java !== 'undefined' && Java && Java.req) {
    const r = Java.req(url, { headers: hd });
    return String((r && (r.body || r.content)) || '');
  }
  const r2 = await req(url, { headers: hd });
  return String((r2 && (r2.content || r2.body)) || '');
}

function getClasses() {
  return [
    { type_id: 'live', type_name: '正在直播' },
    { type_id: '0', type_name: '全部直播' },
    { type_id: '1', type_name: '篮球直播' },
    { type_id: '8', type_name: '足球直播' },
    { type_id: '21', type_name: '其他直播' }
  ];
}

function parseList(html, onlyLiving) {
  const list = [];
  const reg = /<li[^>]*class=["'][^"']*list-group-item[^"']*["'][^>]*>[\s\S]*?<\/li>/gi;
  let m;
  while ((m = reg.exec(String(html || ''))) !== null) {
    const item = m[0];
    const hrefMatch = item.match(/<a[^>]+href=["']([^"']*\/live\/\d+\/play[^"']*)["'][^>]*>/i);
    if (!hrefMatch) continue;

    const time = stripHtml((item.match(/class=["'][^"']*category-game-time[^"']*["'][^>]*>([\s\S]*?)<\//i) || [])[1]);
    const gameType = stripHtml((item.match(/class=["'][^"']*game-type[^"']*["'][^>]*>([\s\S]*?)<\//i) || [])[1]);

    const teams = [];
    const teamReg = /class=["'][^"']*team-name[^"']*["'][^>]*>([\s\S]*?)<\//gi;
    let tm;
    while ((tm = teamReg.exec(item)) !== null) teams.push(stripHtml(tm[1]));

    let title = [time, gameType, teams.length >= 2 ? teams[0] + ' vs ' + teams[1] : teams.join(' vs ')].filter(Boolean).join(' ').trim();
    if (!title || title === 'vs') title = stripHtml(item).replace(/直播中|观看|高清|视频直播/g, '').trim();
    if (!title) continue;

    const btnTextMatch = item.match(/<a[^>]+href=["'][^"']*\/live\/\d+\/play[^"']*["'][^>]*>([\s\S]*?)<\/a>/i);
    const remark = stripHtml(btnTextMatch ? btnTextMatch[1] : '') || '直播中';
    if (onlyLiving && remark !== '直播中') continue;
    const picMatch = item.match(/<img[^>]+(?:data-src|src)=["']([^"']+)["']/i);

    list.push({
      vod_id: absUrl(hrefMatch[1]) + '###' + encodeURIComponent(title),
      vod_name: title,
      vod_pic: absUrl(picMatch ? picMatch[1] : '/static/img/default.png'),
      vod_remarks: remark
    });
  }
  return list;
}

async function fetchGroupList(group) {
  let paths = ['/'];
  if (group === 'basketball') {
    paths = ['/match/1/live', '/match/2/live', '/match/20/live', '/match/4/live'];
  } else if (group === 'football') {
    paths = ['/match/3/live', '/match/8/live', '/match/9/live', '/match/10/live', '/match/14/live', '/match/15/live', '/match/12/live', '/match/13/live', '/match/7/live', '/match/11/live', '/match/27/live', '/match/26/live', '/match/31/live', '/match/23/live'];
  } else if (group === 'other') {
    paths = ['/match/21/live', '/match/29/live', '/match/25/live', '/match/19/live', '/match/38/live'];
  }

  const all = [];
  const seen = {};
  for (let i = 0; i < paths.length; i++) {
    try {
      const html = await fetchText(host + paths[i], host + '/');
      const items = parseList(html);
      for (let j = 0; j < items.length; j++) {
        const key = items[j].vod_id;
        if (seen[key]) continue;
        seen[key] = true;
        all.push(items[j]);
      }
    } catch (e) {}
  }
  return all;
}

async function init(cfg) {
  if (cfg && cfg.ext && String(cfg.ext).indexOf('http') === 0) host = String(cfg.ext).trim().replace(/\/$/, '');
}

async function home(filter) {
  return JSON.stringify({ class: getClasses(), filters: {} });
}

async function homeVod() {
  return await category('0', 1, false, {});
}

async function category(tid, pg, filter, extend) {
  tid = String((extend && extend.cateId) || tid || '0');
  pg = parseInt(pg) || 1;
  let group = '';
  if (tid === '1' || tid === 'basketball') group = 'basketball';
  else if (tid === '8' || tid === 'football') group = 'football';
  else if (tid === '21' || tid === 'other') group = 'other';

  let list = [];
  try {
    const onlyLiving = tid === 'live';
    list = group ? await fetchGroupList(group) : parseList(await fetchText(host + '/', host + '/'), onlyLiving);
  } catch (e) {
    list = [];
  }
  return JSON.stringify({ code: 1, msg: '数据列表', page: pg, pagecount: 1, limit: 20, total: list.length, list });
}

async function detail(id) {
  id = Array.isArray(id) ? id[0] : id;
  let realId = String(id || '');
  let displayName = '赛事直播';
  if (realId.indexOf('###') >= 0) {
    const parts = realId.split('###');
    realId = parts[0];
    try { displayName = decodeURIComponent(parts[1] || '赛事直播'); } catch (e) { displayName = parts[1] || '赛事直播'; }
  }

  const match = realId.match(/\/live\/(\d+)\/play/);
  const gameId = match ? match[1] : '';
  if (!gameId) return JSON.stringify({ code: 1, page: 1, pagecount: 1, limit: 0, total: 0, list: [] });

  let playUrls = '';
  try {
    const content = await fetchText(host + '/live/' + gameId + '/source', realId);
    const json = safeJson(content, {});
    const data = decodePlaySource(json.data || '');
    const links = (data && data.links) || [];
    const arr = [];
    for (let i = 0; i < links.length; i++) {
      const u = toDirectPlayUrl(links[i].url || '');
      if (u) arr.push((links[i].name || ('线路' + (i + 1))) + '$' + u);
    }
    playUrls = arr.join('#');
  } catch (e) {
    playUrls = '';
  }

  return JSON.stringify({
    code: 1,
    msg: '数据列表',
    page: 1,
    pagecount: 1,
    limit: 1,
    total: 1,
    list: [{
      vod_id: realId,
      vod_name: displayName,
      vod_pic: host + '/static/img/default.png',
      vod_remarks: '直播中',
      vod_play_from: '88看球',
      vod_play_url: playUrls,
      vod_content: '实时体育直播'
    }]
  });
}

async function search(wd, quick, pg) {
  return JSON.stringify({ code: 1, msg: '数据列表', page: parseInt(pg) || 1, pagecount: 1, limit: 20, total: 0, list: [] });
}

async function play(flag, id, flags) {
  const isDirect = /\.(m3u8|mp4)(\?|$)/i.test(String(id || ''));
  return JSON.stringify({ parse: isDirect ? 0 : 1, url: id, header: headers });
}

// OK影视/部分 CAT 壳兼容入口。
async function homeContent(filter) { return safeJson(await home(filter), { class: [], filters: {} }); }
async function homeVideoContent() { return safeJson(await homeVod(), { list: [] }); }
async function categoryContent(tid, pg, filter, extend) { return safeJson(await category(tid, pg, filter, extend || {}), { list: [] }); }
async function detailContent(ids) { return safeJson(await detail(ids), { list: [] }); }
async function searchContent(wd, quick, pg) { return safeJson(await search(wd, quick, pg || 1), { list: [] }); }
async function playerContent(flag, id, flags) { return safeJson(await play(flag, id, flags), { parse: 1, url: id }); }

export function __jsEvalReturn() {
  return {
    init,
    home,
    homeVod,
    category,
    search,
    detail,
    play,
    homeContent,
    homeVideoContent,
    categoryContent,
    detailContent,
    searchContent,
    playerContent
  };
}
