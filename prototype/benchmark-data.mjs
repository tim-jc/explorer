import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {arch, platform, release, totalmem} from 'node:os';
import {readDataset, tiers} from './model.mjs';

const repetitions = 9;
const result = {scope: 'Node data-stage baseline only; no DOM, Canvas, WebGL or basemap',
  environment: {node: process.version, os: platform(), kernel: release(), arch: arch(), memoryBytes: totalmem(),
    repetitions, cache: 'warm OS local filesystem cache after one full untimed parse/preparation; ascending tiers'},
  datasets: {}};

for (const tier of Object.keys(tiers)) {
  const file = new URL(`./data/${tier}-original.json`, import.meta.url);
  const bytes = readFileSync(file);
  const warmup = readDataset(JSON.parse(bytes));
  const counts = [0, 0, 0];
  let unknown = 0;
  for (const row of warmup.tiles.values()) {
    counts[row[2]]++;
    if (row[4] === null) unknown++;
  }
  const trials = [];
  for (let i = 0; i < repetitions; i++) {
    global.gc?.();
    const start = performance.now();
    const content = readFileSync(file, 'utf8');
    const loaded = performance.now();
    const payload = JSON.parse(content);
    const parsed = performance.now();
    const dataset = readDataset(payload);
    const prepared = performance.now();
    if (dataset.tiles.size !== tiers[tier]) throw new Error('Unexpected dataset size');
    trials.push({readMs: loaded - start, parseMs: parsed - loaded, prepareMs: prepared - parsed});
  }
  result.datasets[tier] = {bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex'),
    counts, unknown, trials};
}
console.log(JSON.stringify(result, null, 2));
