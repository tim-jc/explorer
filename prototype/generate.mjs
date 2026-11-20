import {mkdir, writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {coordinate, homeTile, tileAt, tiers} from './model.mjs';

const activities = ['9007199254740992', '9007199254740993', '9007199254740995', '9007199254740997'];
const known = ['2024-03-03T10:00:00Z', '2025-04-05T11:00:00Z', '2026-01-02T12:00:00Z'];

export function generate(count, corrected = false) {
  const [ox, oy] = homeTile;
  const tiles = new Map();
  function add(x, y, kind) {
    const id = `${x}/${y}`;
    if (tiles.size >= count || tiles.has(id)) return;
    tiles.set(id, [x, y, kind]);
  }

  const side = Math.floor(Math.sqrt(count * 0.36));
  for (let y = 0; y < side; y++) {
    for (let x = 0; x < side + (y % 5); x++) add(ox + x, oy + y, 0);
  }
  const island = Math.floor(Math.sqrt(count * 0.14));
  for (let y = 0; y < island; y++) {
    for (let x = 0; x < island; x++) add(ox + side + 8 + x, oy - 16 + y, 1);
  }
  for (let x = 0; x < Math.floor(count * 0.12); x++) {
    const y = oy + side + 4 + Math.floor(x / 8) % 51;
    add(ox - 350 + x % 800, y, 2);
  }
  let hash = 482347;
  function next() {
    hash = (Math.imul(hash, 1664525) + 1013904223) >>> 0;
    return hash >>> 10;
  }
  while (tiles.size < count) add(ox - 350 + next() % 1100, oy - 150 + next() % 650, 2);

  // Small authored inspection tracks. Every vertex is an accepted full-resolution
  // sample. Bulk coverage classes remain authored rendering inputs.
  const shapes = [
    [[1.12, 0.20], [1.38, 0.31], [1.55, 0.40], [1.78, 0.35]],
    [[1.14, 0.42], [1.42, 0.50], [1.68, 0.55]],
    [[1.18, 0.73], [1.41, 0.63], [1.72, 0.66]],
    [[0.16, 0.25], [0.43, 0.50], [0.74, 0.64]],
  ].map(track => track.map(([x, y]) => coordinate(ox + x, oy + y)));
  const acceptedSamples = Object.fromEntries(activities.flatMap((id, index) =>
    corrected && index !== 1 ? [] : [[id, shapes[index]]]));
  if (corrected) tiles.delete(`${ox}/${oy}`);
  const visits = indexAcceptedSamples(acceptedSamples);
  const rows = [...tiles.values()].map(row => {
    const ids = visits.get(row.slice(0, 2).join('/'));
    if (!ids) return row;
    const indices = [...ids].map(id => activities.indexOf(id));
    return [...row, indices, ...visitExtrema(indices)];
  });
  return {
    schema: 'explorer-experiment-v2', revision: corrected ? 'corrected' : 'original',
    provenance: {policy: 'synthetic-sample-only-v1', lineage: 'authored accepted full-resolution samples'},
    square: corrected ? [ox + 1, oy + 1, side - 1] : [ox, oy, side],
    cartography: {
      minorRoads: [shapes[0], ...Array.from({length: 6}, (_, i) =>
        [[-2, i + 0.1], [2.1, i + 0.12], [5.5, i + 0.8], [12, i + 0.6]]
          .map(([x, y]) => coordinate(ox + x, oy + y)))],
      paths: Array.from({length: 6}, (_, i) =>
        [[i + 0.3, -2], [i + 0.1, 2], [i + 0.8, 4], [i + 0.2, 9]]
          .map(([x, y]) => coordinate(ox + x, oy + y))),
    },
    activities, acceptedSamples, tiles: rows,
  };
}

export function indexAcceptedSamples(samplesByActivity) {
  const visits = new Map();
  for (const [id, samples] of Object.entries(samplesByActivity)) {
    for (const sample of samples) {
      const key = tileAt(sample).join('/');
      if (!visits.has(key)) visits.set(key, new Set());
      visits.get(key).add(id);
    }
  }
  return visits;
}

function visitExtrema(visits) {
  const dates = visits.map(index => known[index]).filter(Boolean).sort();
  return [dates[0] ?? null, dates.at(-1) ?? null];
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const directory = new URL('./data/', import.meta.url);
  await mkdir(directory, {recursive: true});
  for (const [tier, count] of Object.entries(tiers)) {
    for (const corrected of [false, true]) {
      const dataset = generate(count, corrected);
      await writeFile(new URL(`${tier}-${dataset.revision}.json`, directory), JSON.stringify(dataset));
    }
  }
}
