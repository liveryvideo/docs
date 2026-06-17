#!/usr/bin/env node
/**
 * Generates `docs/llms.txt` and `docs/llms-full.txt` from the docsify content.
 *
 * - `llms.txt`      An index of the documentation following the llmstxt.org
 *                   spec: a title, a short summary and curated sections of
 *                   links (one per page, pointing at the raw `.md` source so
 *                   that an LLM can fetch the plain Markdown).
 * - `llms-full.txt` The same pages with their full Markdown content inlined,
 *                   ready to be ingested directly into an LLM context window.
 *
 * The page list and grouping are derived from `docs/_navbar.md`, so the output
 * stays in sync with the navigation that humans see. Run via `npm run llms`.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(import.meta.url));
const docsDir = join(root, 'docs');

const { homepage, description } = require('./package.json');
const SITE_NAME = 'Livery Video Docs';
const BASE_URL = (homepage || 'https://docs.livery.live').replace(/\/$/, '');

/** Build the absolute URL to a page's raw Markdown source. */
const mdUrl = (path) => `${BASE_URL}/${path.replace(/^\//, '')}`;

/**
 * Parse `_navbar.md` into ordered groups of links.
 * Top-level `- Group` lines start a section; indented `- [Title](/path 'Desc')`
 * lines are the pages within it.
 *
 * @returns {{ title: string, links: { title: string, path: string, desc: string }[] }[]}
 */
function parseNavbar(markdown) {
  const linkRe = /\[([^\]]+)\]\(([^ )]+)(?:\s+['"]([^'"]*)['"])?\)/;
  const groups = [];
  let current = null;

  for (const rawLine of markdown.split('\n')) {
    const line = rawLine.replace(/\s+$/, '');
    if (!line.trim() || line.trim().startsWith('<!--')) continue;

    const indent = line.length - line.trimStart().length;
    const match = line.trim().match(/^[-*]\s+(.*)$/);
    if (!match) continue;
    const content = match[1];

    const link = content.match(linkRe);
    if (link && indent > 0) {
      // A page within the current group.
      if (!current) current = { title: 'Documentation', links: [] };
      current.links.push({
        title: link[1].trim(),
        path: link[2].trim(),
        desc: (link[3] || '').trim(),
      });
    } else if (!link) {
      // A top-level group heading.
      current = { title: content.trim(), links: [] };
      groups.push(current);
    }
  }

  return groups.filter((group) => group.links.length > 0);
}

/** Extract a one-line summary: the first real paragraph of the README. */
function summaryFromReadme(markdown) {
  for (const block of markdown.split(/\n\s*\n/)) {
    const text = block.trim();
    if (!text || text.startsWith('#') || text.startsWith('![') || text.startsWith('?>')) {
      continue;
    }
    return text.replace(/\s+/g, ' ').trim();
  }
  return description || '';
}

/** Render the llms.txt index file. */
function renderIndex(summary, groups) {
  const lines = [`# ${SITE_NAME}`, '', `> ${summary}`, ''];
  for (const group of groups) {
    lines.push(`## ${group.title}`, '');
    for (const link of group.links) {
      const suffix = link.desc ? `: ${link.desc}` : '';
      lines.push(`- [${link.title}](${mdUrl(link.path)})${suffix}`);
    }
    lines.push('');
  }
  return `${lines.join('\n').trim()}\n`;
}

/** Render the llms-full.txt file with each page's Markdown inlined. */
async function renderFull(summary, groups) {
  const sections = [`# ${SITE_NAME}`, '', `> ${summary}`, ''];
  for (const group of groups) {
    for (const link of group.links) {
      const file = join(docsDir, link.path.replace(/^\//, ''));
      let content;
      try {
        content = (await readFile(file, 'utf8')).trim();
      } catch {
        console.warn(`  ! skipping ${link.path} (not found locally)`);
        continue;
      }
      sections.push(
        '---',
        '',
        `# ${link.title}`,
        `Source: ${mdUrl(link.path)}`,
        '',
        content,
        '',
      );
    }
  }
  return `${sections.join('\n').trim()}\n`;
}

async function main() {
  const [navbar, readme] = await Promise.all([
    readFile(join(docsDir, '_navbar.md'), 'utf8'),
    readFile(join(docsDir, 'README.md'), 'utf8'),
  ]);

  const groups = parseNavbar(navbar);
  const summary = summaryFromReadme(readme);
  const pageCount = groups.reduce((n, group) => n + group.links.length, 0);

  const index = renderIndex(summary, groups);
  const full = await renderFull(summary, groups);

  await Promise.all([
    writeFile(join(docsDir, 'llms.txt'), index),
    writeFile(join(docsDir, 'llms-full.txt'), full),
  ]);

  console.log(`Generated docs/llms.txt and docs/llms-full.txt (${pageCount} pages).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
