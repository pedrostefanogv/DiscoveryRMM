#!/usr/bin/env node
/**
 * Gera paginas estaticas por capitulo da documentacao (SEO).
 *
 * As rotas sao hash routes (#/docs/<id>), que buscadores nao indexam por
 * capitulo. Roda DEPOIS do vite build e escreve, a partir dos mesmos dados
 * (src/data/docs): dist/docs/<id>/index.html (pt-BR), dist/docs/en/<id>/index.html
 * (en-US), os indices de cada idioma e o sitemap.xml com home + capitulos.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const ORIGIN = 'https://pedrostefanogv.github.io';

const { createServer } = await import('vite');
const server = await createServer({ root: ROOT, configFile: path.join(ROOT, 'vite.config.ts'), server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
let pt, en, base;
try {
  const mod = await server.ssrLoadModule('/src/data/docs/index.ts');
  pt = mod.getDocsContent('pt-BR');
  en = mod.getDocsContent('en-US');
  base = server.config.base || '/';
} finally { await server.close(); }

const esc = (v) => String(v == null ? '' : v).split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('"').join('&quot;');
const pre = (code) => '<pre><code>' + esc(code) + '</code></pre>';
const pill = (route) => (route ? '<p class="route">' + esc(route) + '</p>' : '');
const paras = (items) => items.map((p) => '<p>' + esc(p) + '</p>').join('');

function block(b) {
  if (b.type === 'paragraphs') return paras(b.items);
  if (b.type === 'callout') return '<aside class="callout"><strong>' + esc(b.title) + '</strong><p>' + esc(b.text) + '</p></aside>';
  if (b.type === 'code') return '<figure class="code"><figcaption>' + esc(b.language + (b.title ? ' - ' + b.title : '')) + '</figcaption>' + pre(b.snippet) + '</figure>';
  if (b.type === 'image') return '<figure class="shot"><img src="' + esc(base + 'screenshots/' + b.file) + '" alt="' + esc(b.alt) + '" width="1280" height="800" loading="lazy" decoding="async">' + (b.caption ? '<figcaption>' + esc(b.caption) + '</figcaption>' : '') + '</figure>';
  if (b.type === 'table') {
    const head = b.headers.map((h) => '<th scope="col">' + esc(h) + '</th>').join('');
    const rows = b.rows.map((row) => '<tr>' + row.map((c, i) => (i === 0 ? '<th scope="row">' + esc(c) + '</th>' : '<td>' + esc(c) + '</td>')).join('') + '</tr>').join('');
    return '<table><caption>' + esc(b.caption) + '</caption><thead><tr>' + head + '</tr></thead><tbody>' + rows + '</tbody></table>';
  }
  if (b.type === 'cards') {
    const items = b.items.map((c) => {
      const inner = '<h4>' + esc(c.title) + '</h4>' + (c.badge ? '<span class="badge">' + esc(c.badge) + '</span>' : '') + '<p>' + esc(c.description) + '</p>' + (c.meta ? '<span class="meta">' + esc(c.meta) + '</span>' : '');
      const target = c.href && c.href.indexOf('#/docs/') === 0 ? base + 'docs/' + c.href.slice(7) : c.href;
      return target ? '<a class="card" href="' + esc(target) + '">' + inner + '</a>' : '<article class="card">' + inner + '</article>';
    }).join('');
    return (b.title ? '<h3>' + esc(b.title) + '</h3>' : '') + '<div class="cards">' + items + '</div>';
  }
  if (b.type === 'steps') {
    const items = b.items.map((s) => '<li><h4>' + esc(s.title) + '</h4><p>' + esc(s.description) + '</p>' + (s.code ? pre(s.code) : '') + pill(s.route) + '</li>').join('');
    return (b.title ? '<h3>' + esc(b.title) + '</h3>' : '') + '<ol class="steps">' + items + '</ol>';
  }
  if (b.type === 'accordion') {
    const items = b.items.map((i) => '<details><summary>' + esc(i.summary) + '</summary>' + paras(i.paragraphs) + (i.code ? pre(i.code) : '') + pill(i.route) + '</details>').join('');
    return (b.title ? '<h3>' + esc(b.title) + '</h3>' : '') + items;
  }
  return '';
}

const STYLE = ':root{color-scheme:light dark;--bg:#0d1117;--fg:#e6edf3;--muted:#9aa7b4;--card:#161b22;--border:#30363d;--accent:#22d3ee}' +
  '@media (prefers-color-scheme:light){:root{--bg:#fff;--fg:#1f2937;--muted:#556070;--card:#f6f8fa;--border:#d8dee4;--accent:#0e7490}}' +
  'body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.65 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}' +
  '.wrap{max-width:1150px;margin:0 auto;padding:28px 20px 72px;display:grid;grid-template-columns:260px minmax(0,1fr);gap:32px}' +
  '@media (max-width:900px){.wrap{grid-template-columns:1fr}}' +
  'nav.toc a{display:block;padding:5px 8px;color:var(--muted);text-decoration:none;border-radius:6px;font-size:.86rem}nav.toc a:hover{color:var(--fg);background:var(--card)}' +
  'nav.toc a[aria-current=page]{color:var(--accent);font-weight:600}nav.toc h2{font-size:.72rem;text-transform:uppercase;letter-spacing:.06em;color:var(--accent);margin:18px 0 6px}' +
  'a.top{color:var(--accent);text-decoration:none;font-size:.86rem;display:inline-block;margin-right:14px}.lead{color:var(--muted);font-size:1.05rem}' +
  '.badge{display:inline-block;font-size:.72rem;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);margin-bottom:6px}' +
  'table{width:100%;border-collapse:collapse;margin:18px 0;font-size:.9rem}th,td{border:1px solid var(--border);padding:8px 10px;text-align:left;vertical-align:top}' +
  'thead th{background:var(--card)}caption{text-align:left;color:var(--muted);font-size:.82rem;padding-bottom:8px}' +
  '.callout{border-left:3px solid var(--accent);background:var(--card);padding:12px 16px;border-radius:8px;margin:18px 0}.callout p{margin:.4em 0 0}' +
  'pre{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:12px 14px;overflow:auto;font-size:.82rem;margin:0}' +
  'figure.code{margin:18px 0}figure.code figcaption{font-size:.75rem;color:var(--muted);padding:8px 12px;border-bottom:1px solid var(--border)}' +
  '.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px}' +
  '.card{display:block;border:1px solid var(--border);border-radius:10px;padding:14px;background:var(--card);text-decoration:none;color:inherit}' +
  '.card h4{margin:0 0 6px;font-size:.95rem}.card .meta{display:block;margin-top:8px;color:var(--accent);font-size:.8rem}' +
  '.steps h4{margin:0 0 4px;font-size:.95rem}.route{color:var(--muted);font-size:.8rem}' +
  'details{border:1px solid var(--border);border-radius:8px;padding:10px 14px;margin:10px 0;background:var(--card)}summary{cursor:pointer;font-weight:600}' +
  '.shot{margin:22px 0}.shot img{width:100%;height:auto;border:1px solid var(--border);border-radius:10px}.shot figcaption{color:var(--muted);font-size:.82rem;margin-top:8px}' +
  '.pager{display:flex;justify-content:space-between;gap:16px;margin-top:40px;border-top:1px solid var(--border);padding-top:16px;font-size:.86rem}.pager a{color:var(--accent);text-decoration:none}';

function tocHtml(content, currentId, prefix) {
  return content.parts.map((part) => {
    const items = content.sections.filter((s) => s.part === part.id);
    if (!items.length) return '';
    return '<h2>' + esc(part.label) + '</h2>' + items.map((s) => '<a href="' + prefix + s.id + '/"' + (s.id === currentId ? ' aria-current="page"' : '') + '>' + esc(s.navLabel) + '</a>').join('');
  }).join('');
}

function page(o) {
  const isPt = o.lang === 'pt-BR';
  const title = o.section ? o.section.title + ' - DiscoveryRMM' : 'Documentacao - DiscoveryRMM';
  const description = o.section ? o.section.lead : o.content.ui.portalBadge;
  const body = o.section
    ? '<span class="badge">' + esc(o.section.badge) + '</span><h1>' + esc(o.section.title) + '</h1><p class="lead">' + esc(o.section.lead) + '</p>' + o.section.blocks.map(block).join('\n')
    : '<h1>' + esc(o.content.ui.portalTitle) + '</h1><p class="lead">' + esc(o.content.ui.portalBadge) + '</p>' + o.content.sections.map((s) => '<p><a href="' + o.prefix + s.id + '/">' + esc(s.navLabel) + ' - ' + esc(s.title) + '</a></p>').join('');
  const pager = o.section
    ? '<div class="pager">' + (o.prev ? '<a href="' + o.prefix + o.prev.id + '/">Anterior: ' + esc(o.prev.navLabel) + '</a>' : '<span></span>') + (o.next ? '<a href="' + o.prefix + o.next.id + '/">Proximo: ' + esc(o.next.navLabel) + '</a>' : '<span></span>') + '</div>'
    : '';
  const interactive = o.section ? base + '#/docs/' + o.section.id : base + '#/docs';
  const otherLang = isPt ? o.prefix + '../en/' : o.prefix + '../';
  return ['<!doctype html>', '<html lang="' + o.lang + '">', '<head>', '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<title>' + esc(title) + '</title>', '<meta name="description" content="' + esc(description) + '">',
    '<link rel="canonical" href="' + ORIGIN + o.canonicalPath + '">',
    '<link rel="alternate" hreflang="pt-BR" href="' + ORIGIN + o.canonicalPath + '">',
    '<link rel="alternate" hreflang="en-US" href="' + ORIGIN + o.altPath + '">',
    '<link rel="alternate" hreflang="x-default" href="' + ORIGIN + o.canonicalPath + '">',
    '<meta property="og:type" content="article">', '<meta property="og:title" content="' + esc(title) + '">',
    '<meta property="og:description" content="' + esc(description) + '">', '<style>' + STYLE + '</style>', '</head>', '<body>', '<div class="wrap">',
    '<nav class="toc" aria-label="' + esc(o.content.ui.portalTitle) + '">',
    '<a class="top" href="' + o.homePath + '">' + (isPt ? 'Voltar ao site' : 'Back to site') + '</a>',
    '<a class="top" href="' + otherLang + '">' + (isPt ? 'English version' : 'Versao em portugues') + '</a>',
    tocHtml(o.content, o.section ? o.section.id : '', o.prefix), '</nav>', '<main>',
    '<a class="top" href="' + interactive + '">' + (isPt ? 'Abrir versao interativa' : 'Open interactive version') + '</a>',
    body, pager, '</main>', '</div>', '</body>', '</html>', ''].join('\n');
}

function writePage(rel, html) {
  const file = path.join(DIST, rel, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html, 'utf8');
}

const urls = [ORIGIN + base];
for (const item of [{ lang: 'pt-BR', content: pt, dir: 'docs' }, { lang: 'en-US', content: en, dir: 'docs/en' }]) {
  const prefix = base + item.dir + '/';
  const altDir = item.dir === 'docs' ? 'docs/en' : 'docs';
  writePage(item.dir, page({ content: item.content, section: null, lang: item.lang, canonicalPath: base + item.dir + '/', homePath: base, altPath: base + altDir + '/', prefix: prefix }));
  urls.push(ORIGIN + base + item.dir + '/');
  item.content.sections.forEach((section, index) => {
    const rel = item.dir + '/' + section.id;
    writePage(rel, page({
      content: item.content, section: section, lang: item.lang, canonicalPath: base + rel + '/', homePath: base,
      altPath: base + altDir + '/' + section.id + '/', prefix: prefix,
      prev: index > 0 ? item.content.sections[index - 1] : null,
      next: index < item.content.sections.length - 1 ? item.content.sections[index + 1] : null,
    }));
    urls.push(ORIGIN + base + rel + '/');
  });
}

const unique = Array.from(new Set(urls));
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + unique.map((url) => {
  const isHome = url === ORIGIN + base;
  return '  <url>\n    <loc>' + url + '</loc>\n    <changefreq>' + (isHome ? 'weekly' : 'monthly') + '</changefreq>\n    <priority>' + (isHome ? '1.0' : '0.6') + '</priority>\n  </url>';
}).join('\n') + '\n</urlset>\n';
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap, 'utf8');
console.log('[prerender-docs] ' + unique.length + ' URLs no sitemap; paginas em dist/docs e dist/docs/en (base ' + base + ')');
