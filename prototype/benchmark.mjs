import assert from 'node:assert/strict';
import {readFile, mkdir, writeFile} from 'node:fs/promises';
import {availableParallelism, arch, platform, release, totalmem} from 'node:os';
import {spawnSync} from 'node:child_process';
import {extname, resolve, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {coordinate, home, homeTile, homeZoom, tiers} from './model.mjs';

const root = fileURLToPath(new URL('.', import.meta.url));
const manifest = JSON.parse(await readFile(new URL('package.json', import.meta.url)));
const versions = {};
for (const [name, expected] of Object.entries({...manifest.dependencies, ...manifest.devDependencies})) {
  const installed = JSON.parse(await readFile(new URL(`node_modules/${name}/package.json`, import.meta.url)));
  assert.equal(installed.version, expected, `Install the locked ${name} version before benchmarking`);
  versions[name] = installed.version;
}
const core = JSON.parse(await readFile(new URL('node_modules/playwright-core/package.json', import.meta.url)));
versions['playwright-core'] = core.version;
const {chromium, webkit, devices} = await import('playwright');
const engine = process.env.ENGINE ?? 'chromium';
const browserType = {chromium, webkit}[engine];
const launched = await browserType.launch({
  channel: engine === 'chromium' && !process.env.BROWSER_PATH ? 'chrome' : undefined,
  executablePath: process.env.BROWSER_PATH || undefined,
  headless: process.env.HEADED !== '1',
});
const mime = {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml'};
const phone = devices['iPhone 13'];
const profiles = {
  desktop: {viewport: {width: 1365, height: 900}, deviceScaleFactor: 1},
  phone: {viewport: phone.viewport, deviceScaleFactor: phone.deviceScaleFactor,
    hasTouch: true, isMobile: true},
};
const repetitions = Number(process.env.REPETITIONS ?? 5);
const renderers = (process.env.RENDERERS ?? 'leaflet,maplibre').split(',');
const workloads = (process.env.TIERS ?? Object.keys(tiers).join(',')).split(',');
const run = spawnSync('sw_vers', {encoding: 'utf8'});
const result = {environment: {engine, version: launched.version(), os: platform(), osBuild: run.stdout?.trim(),
  kernel: release(), arch: arch(), logicalCpuAvailability: availableParallelism(), physicalMemoryBytes: totalmem(),
  node: process.version, repetitions, profiles, headed: process.env.HEADED === '1',
  dependencies: versions, network: 'intercepted local files only; fresh browser context per repetition'}, trials: []};
const origin = 'http://explorer.test';
const screenshots = new URL('screenshots/', import.meta.url);
await mkdir(screenshots, {recursive: true});

async function serve(route) {
  const url = new URL(route.request().url());
  if (url.origin !== origin) return route.abort();
  const path = url.pathname === '/' ? '/index.html' : url.pathname;
  const local = resolve(root, `.${path}`);
  if (!local.startsWith(root.endsWith(sep) ? root : root + sep)) return route.abort();
  try {
    await route.fulfill({body: await readFile(local), contentType: mime[extname(path)] ?? 'application/octet-stream'});
  } catch {
    await route.fulfill({status: 404, body: 'Missing local file'});
  }
}

async function clickCoordinate(page, xy, profile) {
  const [x, y] = await page.evaluate(c => {
    const p = window.experiment.map.project(c);
    return [p.x, p.y];
  }, coordinate(...xy));
  const {width, height} = page.viewportSize();
  assert.ok(x >= 0 && y >= 0 && x < width && y < height, 'Benchmark tile must be in view');
  if (profile === 'phone') await page.touchscreen.tap(x, y);
  else await page.mouse.click(x, y);
}

async function exercise(page, tier, profile, capture) {
  const failures = [];
  page.on('pageerror', error => failures.push(error.message));
  await page.goto(`${origin}/?renderer=${capture.renderer}&tier=${tier}`);
  await page.waitForFunction(() => window.experiment || document.querySelector('output').dataset.error === 'true',
    null, {timeout: 45000});
  const timings = await page.evaluate(() => ({...window.experiment?.timing,
    navigationToUsable: performance.now()}));
  assert.ok(Number.isFinite(timings.total), await page.locator('output').innerText());
  assert.equal(await page.evaluate(() => window.experiment.state().size), tiers[tier]);
  const [x, y] = homeTile;
  const expectedId = `14/${x}/${y}`;
  const selectStart = performance.now();
  await clickCoordinate(page, [x + 0.5, y + 0.5], profile);
  await page.locator('#inspection').getByText(expectedId, {exact: true}).waitFor({timeout: 4000});
  await page.evaluate(() => window.experiment.map.settled());
  timings.selectionRoundTrip = performance.now() - selectStart;
  assert.equal(await page.locator('#inspection').getByText('Unknown', {exact: true}).count(), 2);
  await page.locator('#route').selectOption('9007199254740997');

  await page.locator('nav summary').click();
  const toggleStart = performance.now();
  for (const name of ['grid', 'visited', 'outline', 'route']) {
    const input = page.locator(`[data-layer="${name}"]`);
    await input.uncheck();
    assert.equal(await page.evaluate(key => window.experiment.visibility[key], name), false);
    await input.check();
    assert.equal(await page.evaluate(key => window.experiment.visibility[key], name), true);
  }
  await page.evaluate(() => window.experiment.map.settled());
  timings.togglesRoundTrip = performance.now() - toggleStart;
  await page.locator('nav summary').click();

  if (capture.enabled) {
    await page.screenshot({path: fileURLToPath(new URL(`${capture.renderer}-${profile}.png`, screenshots))});
  }

  const revised = page.waitForFunction(() => document.querySelector('output').textContent.endsWith('corrected'));
  await page.locator('#corrected').check();
  await revised;
  timings.replacement = await page.evaluate(() => window.experiment.timing.total);
  assert.equal(await page.evaluate(() => window.experiment.state().size), tiers[tier] - 1);
  await page.locator('#inspection').getByText('Unvisited', {exact: true}).waitFor({timeout: 4000});
  assert.equal(await page.locator('#route-choice').isVisible(), false);
  if (profile === 'phone') await page.locator('#panel summary').click();
  await clickCoordinate(page, [x + 1.5, y + 0.5], profile);
  const corrected = await page.evaluate(() => window.experiment.state().selection);
  assert.deepEqual(corrected.activities, ['9007199254740993']);
  assert.equal(corrected.first, '2025-04-05T11:00:00Z');

  await page.locator('#fit').click();
  await page.evaluate(() => window.experiment.map.settled());
  const fittedZoom = await page.evaluate(() => window.experiment.map.zoomLevel());
  assert.ok(fittedZoom < homeZoom);
  await page.locator('#home').click();
  await page.evaluate(() => window.experiment.map.settled());

  Object.assign(timings, await page.evaluate(async ({destination}) => {
    const {map} = window.experiment;
    const gaps = [];
    let frame;
    let last = performance.now();
    function sample(now) {
      gaps.push(now - last);
      last = now;
      frame = requestAnimationFrame(sample);
    }
    const start = performance.now();
    frame = requestAnimationFrame(sample);
    await map.animate(destination, 15);
    await map.settled();
    cancelAnimationFrame(frame);
    const sorted = gaps.slice().sort((a, b) => a - b);
    return {panZoomSettled: performance.now() - start, animationFrames: gaps.length,
      frameGapP95: sorted[Math.ceil(sorted.length * 0.95) - 1],
      jsHeapBytes: performance.memory?.usedJSHeapSize ?? null,
      webgl2: Boolean(document.createElement('canvas').getContext('webgl2')),
      dpr: devicePixelRatio};
  }, {destination: [home[0] + 0.12, home[1] + 0.03]}));
  assert.deepEqual(failures, []);
  return timings;
}

try {
  for (const profile of ['desktop', 'phone']) {
    for (const tier of (profile === 'desktop' ? workloads : workloads.slice(0, 1))) {
      for (let trial = 0; trial < (profile === 'desktop' ? repetitions : 1); trial++) {
        for (const renderer of trial % 2 ? [...renderers].reverse() : renderers) {
          const context = await launched.newContext(profiles[profile]);
          await context.route('**/*', serve);
          const page = await context.newPage();
          try {
            const timing = await exercise(page, tier, profile, {renderer, enabled: tier === 'small' && trial === 0});
            result.trials.push({renderer, profile, tier, trial, timing});
            console.log(renderer, profile, tier, trial, Math.round(timing.total), 'ms');
          } catch (error) {
            result.trials.push({renderer, profile, tier, trial, error: error.message});
            console.error(renderer, profile, tier, trial, error.message);
          } finally {
            await context.close();
          }
        }
      }
    }
  }
  await writeFile(process.env.RESULT_PATH ?? new URL('benchmark-results.json', import.meta.url),
    JSON.stringify(result, null, 2) + '\n');
  if (result.trials.some(trial => trial.error)) process.exitCode = 1;
} finally {
  await launched.close();
}
