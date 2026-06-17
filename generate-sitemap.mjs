#!/usr/bin/env node
/**
 * Generates `docs/sitemap.xml` from the docsify content.
 *
 * Docsify renders client-side, so a runtime plugin can't emit a static sitemap
 * that crawlers will fetch. Instead we walk the local Markdown at build time
 * and write a standard `sitemap.xml`.
 *
 * Only top-level `*.md` pages are included. Files and directories whose name
 * starts with `_` are docsify partials (navbar, 404, embedded `_example-*` /
 * `interactions/*` fragments) and are skipped. The `/npm/*` proxy routes and
 * the deprecated-page redirects defined in `index.html` are virtual (no local
 * file), so they're naturally excluded.
 *
 * URLs follow the site's `routerMode: 'history'` config: `web-player.md` maps
 * to `${BASE_URL}/web-player` and `README.md` maps to `${BASE_URL}/`.
 *
 * `lastmod` is taken from each file's last git commit date when available, so
 * a fresh CI clone still produces meaningful dates. Run via `npm run sitemap`.
 */
import { readdir, writeFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(import.meta.url));
const docsDir = join(root, 'docs');

const { homepage } = require('./package.json');
const BASE_URL = (homepage || 'https://docs.livery.live').replace(/\/$/, '');

/** Map a top-level Markdown filename to its public (history-mode) URL. */
const pageUrl = (file) =>
  file === 'README.md' ? `${BASE_URL}/` : `${BASE_URL}/${file.replace(/\.md$/, '')}`;

/** Last git commit date (YYYY-MM-DD) for a file, or null if unavailable. */
async function lastModified(file) {
  try {
    const { stdout } = await execFileAsync(
      'git',
      ['log', '-1', '--format=%cs', '--', file],
      { cwd: root },
    );
    const date = stdout.trim();
    if (date) return date;
  } catch {
    // git not available or file untracked; fall back to mtime below.
  }
  try {
    const { mtime } = await stat(join(docsDir, file));
    return mtime.toISOString().slice(0, 10);
  } catch {
    return null;
  }
}

/** Escape the five XML predefined entities for safe attribute/text content. */
const xmlEscape = (value) =>
  value.replace(/[&<>"']/g, (char) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char],
  );

function renderSitemap(entries) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];
  for (const { url, lastmod } of entries) {
    lines.push('  <url>', `    <loc>${xmlEscape(url)}</loc>`);
    if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`);
    lines.push('  </url>');
  }
  lines.push('</urlset>');
  return `${lines.join('\n')}\n`;
}

async function main() {
  const files = (await readdir(docsDir))
    .filter((name) => name.endsWith('.md') && !name.startsWith('_'))
    .sort((a, b) => (a === 'README.md' ? -1 : b === 'README.md' ? 1 : a.localeCompare(b)));

  const entries = await Promise.all(
    files.map(async (file) => ({
      url: pageUrl(file),
      lastmod: await lastModified(join('docs', file)),
    })),
  );

  await writeFile(join(docsDir, 'sitemap.xml'), renderSitemap(entries));
  console.log(`Generated docs/sitemap.xml (${entries.length} pages).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
