/**
 * 请柬静态资源 + 祝福簿接口。
 * 亲友打开同一地址时，祝福互相可见。
 *
 *   node server/wishes.cjs
 */
'use strict';

var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');

var ROOT = path.resolve(__dirname, '..');
var DATA_DIR = path.join(ROOT, 'data');
var DATA_FILE = path.join(DATA_DIR, 'wishes.json');
var PORT = Number(process.env.PORT || 3456);
var MAX_WISHES = 200;

var MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.mp3': 'audio/mpeg',
  '.ico': 'image/x-icon',
};

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function readWishes() {
  try {
    var parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

function writeWishes(items) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
}

function send(res, status, type, body) {
  cors(res);
  res.writeHead(status, { 'Content-Type': type });
  res.end(body);
}

function sendJson(res, status, data) {
  send(res, status, 'application/json; charset=utf-8', JSON.stringify(data));
}

function clean(text, max) {
  return String(text || '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function handleApi(req, res) {
  if (req.method === 'OPTIONS') {
    cors(res);
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'GET') {
    sendJson(res, 200, readWishes());
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'method not allowed' });
    return;
  }

  var chunks = [];
  var size = 0;
  var aborted = false;

  req.on('data', function (chunk) {
    size += chunk.length;
    if (size > 4096) {
      aborted = true;
      req.destroy();
      return;
    }
    chunks.push(chunk);
  });

  req.on('end', function () {
    if (aborted) return;

    var raw;
    try {
      raw = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
    } catch (err) {
      sendJson(res, 400, { error: 'invalid json' });
      return;
    }

    var name = clean(raw.name || raw.guestName, 12);
    var message = clean(raw.message || raw.content || raw.wish, 36);
    if (!name || !message) {
      sendJson(res, 400, { error: 'name and message required' });
      return;
    }

    var items = readWishes();
    var exists = items.some(function (wish) {
      return wish && wish.name === name && wish.message === message;
    });

    if (!exists) {
      items.push({
        name: name,
        message: message,
        at: Number(raw.at) || Date.now(),
      });
      writeWishes(items.slice(-MAX_WISHES));
    }

    sendJson(res, 201, { ok: true });
  });
}

function safePath(pathname) {
  var decoded = decodeURIComponent(pathname || '/');
  if (decoded === '/') decoded = '/index.html';

  var resolved = path.normalize(path.join(ROOT, decoded));
  if (resolved !== ROOT && resolved.indexOf(ROOT + path.sep) !== 0) return null;

  var relative = path.relative(ROOT, resolved).replace(/\\/g, '/');
  if (!relative || relative.indexOf('..') === 0) return null;
  if (/^(node_modules|\.git|server|data)\b/.test(relative)) return null;
  if (/(^|\/)\./.test(relative)) return null;

  return resolved;
}

function serveStatic(req, res) {
  var file = safePath(url.parse(req.url).pathname);
  if (!file) {
    send(res, 403, 'text/plain; charset=utf-8', 'Forbidden');
    return;
  }

  fs.stat(file, function (err, stat) {
    if (err || !stat.isFile()) {
      send(res, 404, 'text/plain; charset=utf-8', 'Not Found');
      return;
    }

    var ext = path.extname(file).toLowerCase();
    cors(res);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
}

http.createServer(function (req, res) {
  var pathname = url.parse(req.url).pathname;
  if (pathname === '/api/wishes') {
    handleApi(req, res);
    return;
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    send(res, 405, 'text/plain; charset=utf-8', 'Method Not Allowed');
    return;
  }
  serveStatic(req, res);
}).listen(PORT, '0.0.0.0', function () {
  process.stdout.write('invitation + wishes book at http://localhost:' + PORT + '\n');
});
