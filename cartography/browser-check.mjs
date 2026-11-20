// Run with the locked Slice 4 dependencies installed. No provider traffic leaves the browser.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {extname, resolve, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium, devices} from '../prototype/node_modules/playwright/index.mjs';

const browser = await chromium.launch({channel: 'chrome'});
const root = fileURLToPath(new URL('../', import.meta.url));
const localOrigin = 'http://localhost:8767';
const mime = {'.mjs': 'text/javascript', '.js': 'text/javascript', '.html': 'text/html', '.css': 'text/css'};
try {
  for (const [name, profile] of [['desktop', {viewport: {width: 1365, height: 900}}], ['phone', devices['iPhone 13']]]) {
    const context = await browser.newContext(profile);
    await context.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.origin === 'https://tiles.openfreemap.org') {
        if (url.pathname.endsWith('/dark')) return route.fulfill({status: 503, headers: {'access-control-allow-origin': '*'}, body: 'Mocked provider error'});
        return route.fulfill({headers: {'access-control-allow-origin': '*'}, json: {version: 8, center: [0, 0], zoom: 2, sources: {}, layers: [
          {id: 'mock', type: 'background', paint: {'background-color': '#bbc1aa'}},
        ]}});
      }
      if (url.origin !== localOrigin) return route.abort();
      const path = resolve(root, '.' + url.pathname);
      if (!path.startsWith(root.endsWith(sep) ? root : root + sep)) return route.abort();
      try {
        await route.fulfill({contentType: mime[extname(path)], body: await readFile(path)});
      } catch {
        await route.fulfill({status: 404, body: 'Missing local asset'});
      }
    });
    const page = await context.newPage();
    await page.goto(localOrigin + '/cartography/index.html');
    const active = page.locator('#active');
    await page.waitForFunction(() => document.querySelector('#active').textContent.includes('zoom 13.00'));
    await page.locator('#region').selectOption('alps');
    await page.locator('#scale').selectOption('Road');
    const centre = await active.getAttribute('data-centre');
    await page.getByText('Overlays', {exact: true}).click();
    await page.getByLabel('Grid', {exact: true}).uncheck();
    await page.getByLabel('Coverage', {exact: true}).check();
    await page.getByText('Overlays', {exact: true}).click();

    await page.locator('#style').selectOption('streets-v4');
    await page.locator('#apply').click();
    assert.match(await page.locator('#status').innerText(), /requires a browser key/);

    await page.locator('#style').selectOption('liberty');
    await page.locator('#apply').click();
    await page.waitForFunction(() => document.querySelector('#active').textContent.includes('OpenFreeMap · Liberty'));
    assert.match(await active.innerText(), /zoom 16\.00/);
    assert.equal(await active.getAttribute('data-centre'), centre);
    assert.equal(await page.locator('#credit a').count(), 3);
    await page.getByText('Overlays', {exact: true}).click();
    assert.equal(await page.getByLabel('Grid', {exact: true}).isChecked(), false);
    assert.equal(await page.getByLabel('Coverage', {exact: true}).isChecked(), true);
    await page.getByText('Overlays', {exact: true}).click();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    const panel = await page.locator('.panel').boundingBox();
    assert.ok(panel.width <= page.viewportSize().width - 10);

    await page.locator('#style').selectOption('dark');
    await page.locator('#apply').click();
    await page.waitForFunction(() => document.querySelector('#status').textContent.includes('did not load'),
      null, {timeout: 16000});
    await page.waitForFunction(() => document.querySelector('#active').textContent.includes('Local control'));
    assert.equal(await page.locator('#credit a').count(), 0);
    assert.equal(await active.getAttribute('data-centre'), centre);

    await page.goto(localOrigin + '/cartography/raster.html');
    await page.waitForFunction(() => document.querySelector('#active').textContent.includes('Leaflet zoom 17'));
    assert.match(await page.locator('#credit').innerText(), /no external basemap/);
    await context.close();
    console.log(`${name}: mocked MapLibre switch, error and recovery, responsive panel, local Leaflet`);
  }
} finally {
  await browser.close();
}
