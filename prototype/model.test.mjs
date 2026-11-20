import assert from 'node:assert/strict';
import test from 'node:test';
import {generate, indexAcceptedSamples} from './generate.mjs';
import {activityRoute, coordinate, homeTile, inspect, readDataset, tileAt, tiers, viewportGrid} from './model.mjs';

for (const [name, count] of Object.entries(tiers)) {
  test(`${name}: deterministic, exact count and unique canonical IDs`, () => {
    const payload = generate(count);
    assert.equal(JSON.stringify(payload), JSON.stringify(generate(count)));
    const dataset = readDataset(payload);
    assert.equal(dataset.tiles.size, count);
    assert.equal(dataset.visited.features.length, count);
    assert.equal(new Set(payload.tiles.map(row => row[2])).size, 3);
    for (const row of payload.tiles) {
      const [x, y, , activities, first, last] = row;
      assert.deepEqual(tileAt(coordinate(x + 0.5, y + 0.5)), [x, y]);
      if (!activities) continue;
      assert.equal(new Set(activities).size, activities.length);
      assert.equal(first === null, last === null);
      if (first) assert.ok(first <= last);
    }
  });
}

test('JSON round trip preserves adjacent unsafe decimal identifiers', () => {
  const dataset = readDataset(JSON.parse(JSON.stringify(generate(tiers.small))));
  const [x, y] = homeTile;
  const selected = inspect(dataset, x + 1, y);
  assert.equal(selected.id, `14/${x + 1}/${y}`);
  assert.deepEqual(selected.activities, ['9007199254740992', '9007199254740993', '9007199254740995']);
  assert.deepEqual(selected.centre, coordinate(x + 1.5, y + 0.5));
  assert.equal(selected.classification, 'Largest cluster');
  assert.equal(selected.activities.length, 3);
  assert.ok(activityRoute(dataset.payload, selected.activities[1]).length > 2);
});

test('unknown chronology survives replacement and withdrawn evidence is removed', () => {
  const original = readDataset(generate(tiers.small));
  const corrected = readDataset(generate(tiers.small, true));
  const [x, y] = homeTile;
  const unknown = inspect(original, x, y);
  assert.equal(unknown.first, null);
  assert.equal(unknown.last, null);
  assert.deepEqual(unknown.activities, ['9007199254740997']);
  assert.equal(inspect(corrected, x, y).classification, 'Unvisited');
  assert.equal(corrected.visited.features.length, original.visited.features.length - 1);
  const changed = inspect(corrected, x + 1, y);
  assert.deepEqual(changed.activities, ['9007199254740993']);
  assert.notEqual(changed.first, inspect(original, x + 1, y).first);
  assert.notEqual(changed.last, inspect(original, x + 1, y).last);
  assert.notDeepEqual(corrected.outline, original.outline);
  assert.equal(original.payload.provenance.policy, corrected.payload.provenance.policy);
});

test('grid crosses synthetic home and is disabled below inspection zoom', () => {
  const [x, y] = homeTile;
  const bounds = [coordinate(x, y + 5), coordinate(x + 5, y)];
  assert.equal(viewportGrid(bounds, 11.99).features.length, 0);
  assert.ok(viewportGrid(bounds, 12).features.some(f => f.geometry.coordinates[0][0] === coordinate(x + 2, y)[0]));
});

test('reported northwest tile is supported by the displayed unknown-chronology track', () => {
  const payload = generate(tiers.small);
  const [x, y] = homeTile;
  const id = '9007199254740997';
  const tile = inspect(readDataset(payload), x, y);
  assert.equal(tile.id, '14/8180/5600');
  assert.equal(tile.classification, 'Largest cluster');
  assert.deepEqual(tile.activities, [id]);
  assert.equal(tile.first, null);
  assert.equal(tile.last, null);
  assert.ok(activityRoute(payload, id).every(sample => tileAt(sample).join('/') === '8180/5600'));
});

test('every claimed relationship across both revisions of all workloads has an accepted sample and a display route', () => {
  for (const count of Object.values(tiers)) {
    for (const corrected of [false, true]) {
      const payload = JSON.parse(JSON.stringify(generate(count, corrected)));
      const expected = new Map();
      for (const [id, samples] of Object.entries(payload.acceptedSamples)) {
        assert.deepEqual(activityRoute(payload, id), samples);
        for (const sample of samples) {
          const key = tileAt(sample).join('/');
          if (!expected.has(key)) expected.set(key, new Set());
          expected.get(key).add(id);
        }
      }
      const actual = new Map(payload.tiles.filter(row => row[3]).map(([x, y, , indices]) =>
        [`${x}/${y}`, new Set(indices.map(index => payload.activities[index]))]));
      assert.deepEqual(actual, expected);
      assert.equal(payload.tiles.length, count - Number(corrected));
      assert.equal(inspect(readDataset(payload), homeTile[0] + 2, homeTile[1]).evidence, 'rendering-only');
      if (corrected) {
        for (const id of ['9007199254740992', '9007199254740995', '9007199254740997']) {
          assert.equal(activityRoute(payload, id), null);
        }
      }
    }
  }
});

test('a display segment crossing a tile without a sample does not qualify it', () => {
  const [x, y] = homeTile;
  const id = '9007199254740997';
  const acceptedSamples = {[id]: [coordinate(x + 0.5, y + 0.5), coordinate(x + 2.5, y + 0.5)]};
  assert.equal(activityRoute({acceptedSamples}, id).length, 2);
  const visits = indexAcceptedSamples(acceptedSamples);
  assert.deepEqual([...visits.keys()], [`${x}/${y}`, `${x + 2}/${y}`]);
});
