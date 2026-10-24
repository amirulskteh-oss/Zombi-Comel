// Playwright smoke test sebenar dalam Chromium headless untuk binaan docs/.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const root = path.join(__dirname, '..', 'docs');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
const server = http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname); } catch { res.writeHead(400).end(); return; }
  const target = path.resolve(root, '.' + pathname);
  if (target !== root && !target.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  let file = target;
  try { if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html'); } catch {}
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404).end('Not found'); return; }
    res.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(data);
  });
});

(async () => {
  let browser;
  try {
    await new Promise((resolve, reject) => { server.once('error', reject); server.listen(4173, '127.0.0.1', resolve); });
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    const pageErrors = [];
    const consoleErrors = [];
    page.on('pageerror', e => pageErrors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    const failedResponses = [];
    page.on('response', r => {
      if (r.status() >= 400 && !/favicon\\.ico$/i.test(new URL(r.url()).pathname)) failedResponses.push({ status: r.status(), url: r.url() });
    });
    const response = await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle', timeout: 30000 });
    assert.equal(response.status(), 200, 'halaman utama mesti HTTP 200');
    assert.match(await page.title(), /Zombi Comel/i, 'tajuk halaman mesti betul');
    // Kanvas boleh sengaja tersembunyi semasa overlay onboarding; sahkan ia wujud dan disediakan.
    const canvas = page.locator('canvas#game');
    await canvas.waitFor({ state: 'attached', timeout: 10000 });
    const dimensions = await canvas.evaluate(c => ({ width: c.width, height: c.height, cssWidth: c.getBoundingClientRect().width, cssHeight: c.getBoundingClientRect().height, hidden: c.getClientRects().length === 0 }));
    assert.ok(dimensions.width >= 360 && dimensions.height >= 600, 'kanvas mesti mempunyai resolusi sebenar');
    assert.ok(dimensions.cssWidth >= 0 && dimensions.cssHeight >= 0, 'dimensi CSS kanvas boleh dibaca');
    await page.waitForTimeout(1200);
    assert.deepEqual(pageErrors, [], 'tiada pengecualian JavaScript semasa startup');
    assert.deepEqual(consoleErrors.filter(x => !/favicon\.ico.*404/i.test(x)), [], 'tiada ralat console semasa startup');
    assert.deepEqual(failedResponses, [], 'semua aset dan permintaan halaman mesti berjaya dimuat');
    const layout = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, page: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
    assert.ok(layout.page <= layout.viewport + 1, `halaman tidak boleh melimpah mendatar: ${JSON.stringify(layout)}`);
    const manifest = await page.evaluate(async () => {
      const link = document.querySelector('link[rel="manifest"]');
      if (!link) return null;
      const r = await fetch(link.href);
      return r.ok ? r.json() : null;
    });
    assert.ok(manifest && manifest.name === 'Zombi Comel', 'manifest PWA mesti boleh dibaca');
    console.log('✓ Chromium sebenar: halaman utama HTTP 200');
    console.log('✓ canvas dirender: ' + JSON.stringify(dimensions));
    console.log('✓ tiada pengecualian JavaScript atau ralat console startup');
    console.log('✓ semua permintaan aset berjaya dimuat');
    console.log('✓ susun atur mudah alih tanpa limpahan mendatar: ' + JSON.stringify(layout));
    console.log('✓ manifest PWA boleh dimuat dan sah');
    console.log('Ujian runtime Chromium lulus');
  } catch (err) {
    console.error(err && err.stack || err);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})();
