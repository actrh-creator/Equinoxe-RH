import { readFileSync, mkdirSync, writeFileSync, existsSync, createReadStream, statSync } from 'node:fs';
import { dirname, join, extname, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const distDir = join(root, 'dist');
const port = 4173;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
};

function getRoutes() {
  const xml = readFileSync(join(root, 'public/sitemap.xml'), 'utf8');
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map((m) => m[1].replace('https://www.act-rh.com', ''))
    .map((p) => (p === '' ? '/' : p));
}

// Petit serveur statique maison : on évite les libs type serve-handler, qui
// trébuchent sur les fichiers dupliqués/accentués générés par des conflits
// de sync iCloud présents dans public/ (ex: "Réf - Toulouse Métropole.webp").
function startServer() {
  const shellHtml = readFileSync(join(distDir, 'index.html'), 'utf8');

  const server = createServer((req, res) => {
    const pathname = decodeURIComponent(req.url.split('?')[0]);
    const hasExtension = /\.[a-zA-Z0-9]+$/.test(pathname);

    if (hasExtension) {
      const safePath = normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, '');
      const filePath = join(distDir, safePath);
      if (!filePath.startsWith(distDir + sep) && filePath !== distDir) {
        res.writeHead(403).end();
        return;
      }
      try {
        const stat = statSync(filePath);
        if (stat.isFile()) {
          res.setHeader('Content-Type', MIME_TYPES[extname(filePath).toLowerCase()] ?? 'application/octet-stream');
          createReadStream(filePath).pipe(res);
          return;
        }
      } catch {
        // fichier absent -> 404 ci-dessous
      }
      res.writeHead(404).end();
      return;
    }

    // Routes applicatives : sert la version déjà prerendue si elle existe,
    // sinon la coquille SPA (comme la redirection "/* -> index.html" de Netlify).
    const candidate = pathname === '/' ? null : join(distDir, pathname, 'index.html');
    const alreadyPrerendered = candidate && existsSync(candidate);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(alreadyPrerendered ? readFileSync(candidate) : shellHtml);
  });
  return new Promise((resolve) => server.listen(port, () => resolve(server)));
}

async function prerenderRoute(browser, route) {
  const page = await browser.newPage();
  const url = `http://localhost:${port}${route}`;
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  // Laisse React terminer le rendu (fetch Supabase pour le blog, etc.)
  await new Promise((r) => setTimeout(r, 500));
  const html = await page.content();
  await page.close();

  const outDir = route === '/' ? distDir : join(distDir, route);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), html);
  console.log(`  ✓ ${route}`);
}

async function main() {
  if (!existsSync(distDir)) {
    console.error('dist/ introuvable — lance `npm run build` avant le prerendering.');
    process.exit(1);
  }

  const routes = getRoutes();
  console.log(`Prerendering de ${routes.length} routes...`);

  const server = await startServer();
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

  try {
    for (const route of routes) {
      await prerenderRoute(browser, route);
    }
  } finally {
    await browser.close();
    server.close();
  }

  console.log('Prerendering terminé.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
