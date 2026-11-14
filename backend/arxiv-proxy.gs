// ============================================================
// My Private Diary – live arXiv helper (standalone Google Apps Script)
// No Google Sheet needed. Used by the Research Desk tab to load the newest arXiv papers,
// because arXiv blocks direct requests from web pages.
//
// Setup (2 minutes):
//  1. Go to https://script.google.com → New project → paste this whole file → Save.
//  2. Deploy → New deployment → type "Web app" → Execute as: Me → Who has access: Anyone → Deploy.
//  3. Authorize when asked, copy the web app URL (ends in /exec).
//  4. In the diary: Research Desk → "Set up live arXiv" → paste the URL.
// This script only reads the public arXiv API. It never sees your diary data.
// ============================================================

function doGet(e) {
  try {
    if (!e || !e.parameter || !e.parameter.data) return respond(true, 'arXiv helper is running ✅ — ' + new Date().toISOString());
    var payload = JSON.parse(e.parameter.data);
    if (payload.action === 'arxiv') return searchArxiv(payload);
    return respond(false, 'Unknown action: ' + payload.action);
  } catch (err) {
    return respond(false, 'Server error: ' + err.message);
  }
}

// ── arXiv search (used by the Research Desk tab) ─────────────────
// Read-only proxy to the public arXiv API, so the static Splat Survey
// Desk page can load papers newer than its built-in snapshot.
// Request: {action:'arxiv', query:'abs:"gaussian splatting"', start:0, max:100}
// Response: {success:true, papers:[{i,t,a,d,ab,cm,c}], total}
function searchArxiv(p) {
  var query    = String(p.query || 'abs:"gaussian splatting"').slice(0, 500);
  var fallback = p.fallback ? String(p.fallback).slice(0, 300) : '';
  var start = Math.max(0, Math.min(5000, parseInt(p.start, 10) || 0));
  var max   = Math.max(1, Math.min(200, parseInt(p.max, 10) || 100));
  var key   = 'arxiv2:' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(
                Utilities.DigestAlgorithm.MD5, query + '|' + fallback + '|' + start + '|' + max));
  var cache = CacheService.getScriptCache();
  var hit   = cache.get(key);
  if (hit) return respond(true, 'ok (cached)', JSON.parse(hit));

  var res = arxivQuery_(query, start, max);
  if (res.error && fallback) res = arxivQuery_(fallback, start, max);   // arXiv rejected the main query: try the simple one
  if (res.error) return respond(false, res.error);

  var out = { papers: res.papers, total: res.total, usedQuery: res.query, fetchedAt: new Date().toISOString() };
  var json = JSON.stringify(out);
  if (json.length < 95000) cache.put(key, json, 1800); // 30 min
  return respond(true, 'ok', out);
}

// One arXiv API call. Returns {papers,total,query} or {error}.
function arxivQuery_(query, start, max) {
  var url = 'https://export.arxiv.org/api/query?search_query=' + encodeURIComponent(query) +
            '&sortBy=submittedDate&sortOrder=descending&start=' + start + '&max_results=' + max;
  var res = UrlFetchApp.fetch(url, { muteHttpExceptions: true, headers: { 'User-Agent': 'my-private-diary/1.0' } });
  if (res.getResponseCode() !== 200) return { error: 'arXiv answered HTTP ' + res.getResponseCode() };
  var root;
  try { root = XmlService.parse(res.getContentText()).getRootElement(); }
  catch (e) { return { error: 'arXiv sent a reply that is not a feed (it may be rate-limiting; try again in a minute)' }; }
  if (root.getName() !== 'feed') return { error: 'arXiv sent a reply that is not a feed (it may be rate-limiting; try again in a minute)' };
  var atom  = XmlService.getNamespace('http://www.w3.org/2005/Atom');
  var ax    = XmlService.getNamespace('arxiv', 'http://arxiv.org/schemas/atom');
  var os    = XmlService.getNamespace('opensearch', 'http://a9.com/-/spec/opensearch/1.1/');
  var clean = function (s) { return String(s || '').replace(/\s+/g, ' ').trim(); };
  var entries = root.getChildren('entry', atom);
  // arXiv reports a bad query as one entry titled "Error" with an /api/errors id
  for (var k = 0; k < entries.length; k++) {
    var eid = clean(entries[k].getChildText('id', atom));
    if (/\/api\/errors/.test(eid) || clean(entries[k].getChildText('title', atom)) === 'Error')
      return { error: 'arXiv rejected the query: ' + clean(entries[k].getChildText('summary', atom)) };
  }
  var papers = [];
  entries.forEach(function (en) {
    var id = clean(en.getChildText('id', atom)).replace(/^.*\/abs\//, '').replace(/v\d+$/, '');
    var m  = id.match(/^(\d{2})(\d{2})\.\d{4,5}$/);
    var valid = (m && +m[2] >= 1 && +m[2] <= 12) || /^[a-z-]+(\.[A-Z]{2})?\/\d{7}$/.test(id);
    if (!valid) return;
    var ab   = clean(en.getChildText('summary', atom));
    var cm   = clean(en.getChildText('comment', ax));
    var code = (cm + ' ' + ab).match(/https?:\/\/github\.com\/[\w.-]+\/[\w.-]+/);
    papers.push({
      i: id,
      t: clean(en.getChildText('title', atom)),
      a: en.getChildren('author', atom).map(function (x) { return clean(x.getChildText('name', atom)); }).join(', '),
      d: clean(en.getChildText('published', atom)).slice(0, 10),
      ab: ab.length > 900 ? ab.slice(0, 900) + '…' : ab,
      cm: cm,
      c: code ? code[0].replace(/\.$/, '') : ''
    });
  });
  var total = parseInt(clean(root.getChildText('totalResults', os)), 10) || papers.length;
  return { papers: papers, total: total, query: query };
}



function respond(success, message, extra) {
  var payload = Object.assign({ success: success, message: message }, extra || {});
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
