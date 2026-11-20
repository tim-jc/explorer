import assert from 'node:assert/strict';
import test from 'node:test';
import {validateStyleMin} from '../prototype/node_modules/@maplibre/maplibre-gl-style-spec/dist/index.mjs';
import {tileAt, tileId} from '../prototype/model.mjs';
import {defaults, overlays, prefix, regions, withOverlays} from './model.mjs';
import {authenticate, basemap, needsKey, providerInfo, styles} from './providers.mjs';

test('every preset has deterministic overlay geometry and only sampled tile relationships', () => {
  for (const preset of Object.values(regions)) {
    const data = overlays(preset.centre);
    assert.deepEqual(data, overlays(preset.centre));
    const samples = data.route.features[0].geometry.coordinates;
    const claimed = data.tiles.features.filter(tile => tile.properties.sampleBacked)
      .map(tile => tile.properties.id);
    assert.deepEqual(new Set(claimed), new Set(samples.map(point => tileId(...tileAt(point)))));
    assert.ok(data.tiles.features.some(tile => !tile.properties.sampleBacked));
    assert.deepEqual(data.effort.features[0].geometry.coordinates, samples.slice(2, 6));
    assert.equal(new Set(data.coverage.features.map(tile => tile.properties.intensity)).size, 5);
  }
});

test('overlay composition preserves camera, native attribution and independent controls', () => {
  const style = {version: 8, center: [3, 51], zoom: 14, sources: {
    base: {type: 'geojson', data: {type: 'FeatureCollection', features: []}, attribution: 'Native credit'},
  }, layers: []};
  const data = overlays(regions.surrey.centre);
  const settings = {...defaults, tiles: false, coverage: true, route: false, halo: 'none', width: 6, opacity: 0.6};
  const camera = {center: [6, 45], zoom: 16, pitch: 0, bearing: 10};
  const a = withOverlays(style, data, settings, camera);
  const b = withOverlays({...style, name: 'Replacement style', center: [0, 0], zoom: 2}, data, settings, camera);
  for (const key of Object.keys(camera)) {
    assert.deepEqual(a[key], camera[key]);
    assert.deepEqual(b[key], camera[key]);
  }
  assert.deepEqual(validateStyleMin(a), []);
  assert.deepEqual(validateStyleMin(b), []);
  assert.equal(a.sources.base.attribution, 'Native credit');
  assert.deepEqual(a.layers, b.layers);
  assert.deepEqual(a.sources, b.sources);
  assert.deepEqual(style.layers, []);
  const layer = key => a.layers.find(layer => layer.id === prefix + key);
  assert.equal(layer('tiles').layout.visibility, 'none');
  assert.equal(layer('coverage').layout.visibility, 'visible');
  assert.equal(layer('route-halo').layout.visibility, 'none');
  assert.equal(layer('effort').layout.visibility, 'visible');
  assert.equal(layer('effort').paint['line-width'], 6);
  assert.equal(layer('effort').paint['line-opacity'], 0.6);
  assert.equal(layer('effort-halo').paint['line-opacity'], 0);
});

test('provider gating, key scope and reference attribution', () => {
  const pick = id => styles.find(style => style.id === id);
  assert.throws(() => basemap(pick('streets-v4'), 'localhost'), /requires/);
  assert.throws(() => basemap(pick('dark-matter'), 'localhost'), /requires/);
  assert.equal(needsKey('stadia', '127.0.0.1'), false);
  assert.throws(() => basemap(pick('alidade_smooth'), '192.168.1.2'), /requires/);
  assert.equal(basemap(pick('liberty'), 'localhost'), 'https://tiles.openfreemap.org/styles/liberty');
  assert.throws(() => basemap(pick('liberty'), 'localhost', '', true), /No corresponding/);
  const cartoRaster = basemap(pick('dark-matter'), 'localhost', 'test key', true);
  assert.match(cartoRaster, /\{z\}.*key=test%20key/);
  assert.equal(authenticate(cartoRaster, 'carto', 'test key'), cartoRaster);
  for (const url of ['https://other.test/style', 'https://api.maptiler.com.example.test/style']) {
    assert.equal(authenticate(url, 'maptiler', 'test key'), url);
  }
  for (const name of ['maptiler', 'stadia', 'openfree', 'carto']) {
    assert.ok(providerInfo[name].credits.some(([label]) => label.includes('OpenStreetMap')));
  }
});
