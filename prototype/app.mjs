import {activityRoute, collection, feature, home, homeZoom, inspect, readDataset, ring, tiers, tileAt} from './model.mjs';
import {createRenderer} from './renderers.mjs';

const byId = id => document.getElementById(id);
const query = new URLSearchParams(location.search);
const name = query.get('renderer') === 'maplibre' ? 'maplibre' : 'leaflet';
const alternate = name === 'leaflet' ? 'maplibre' : 'leaflet';
byId('other').textContent = name === 'leaflet' ? 'Open MapLibre' : 'Open Leaflet';
query.set('renderer', alternate);
byId('other').href = `?${query}`;
if (Object.hasOwn(tiers, query.get('tier'))) byId('tier').value = query.get('tier');
if (matchMedia('(max-width: 600px)').matches) byId('panel').open = false;

let map, dataset, selected, revisionRequest = 0;
const timing = {};
const visibility = {visited: true, grid: true, outline: true, route: true};

function drawRoute() {
  const line = activityRoute(dataset.payload, byId('route').value);
  const data = collection(line ? [feature('LineString', line)] : []);
  map.set('routeHalo', data);
  map.set('route', data);
}

function renderInspection() {
  const route = byId('route');
  const previousRoute = route.value;
  route.replaceChildren(new Option('None', ''));
  byId('route-choice').hidden = true;
  if (!selected) {
    byId('inspection').textContent = 'Select a tile on the map.';
    map.set('selection', collection([]));
  } else {
    const metadata = inspect(dataset, ...selected);
    const evidenced = metadata.evidence === 'sample-backed';
    const fields = {
      Tile: metadata.id, Centre: metadata.centre.map(value => value.toFixed(6)).join(', '),
      Class: metadata.classification,
      Evidence: evidenced ? 'Accepted synthetic samples'
        : metadata.evidence === 'rendering-only' ? 'Rendering workload only' : 'Unvisited tile',
      Activities: evidenced ? metadata.activities.length : '—',
      First: metadata.first ?? (metadata.activities.length ? 'Unknown' : '—'),
      Last: metadata.last ?? (metadata.activities.length ? 'Unknown' : '—'),
      'Activity IDs': metadata.activities.join(', ') || '—',
      ...(evidenced ? {Policy: dataset.payload.provenance.policy, Lineage: dataset.payload.provenance.lineage} : {}),
    };
    const list = document.createElement('dl');
    for (const [key, value] of Object.entries(fields)) {
      const label = document.createElement('dt');
      const term = document.createElement('dd');
      label.textContent = key;
      term.textContent = value;
      list.append(label, term);
    }
    byId('inspection').replaceChildren(list);
    metadata.activities.forEach(id => route.add(new Option(id, id)));
    if (metadata.activities.includes(previousRoute)) route.value = previousRoute;
    byId('route-choice').hidden = metadata.activities.length === 0;
    map.set('selection', collection([feature('LineString', ring(...selected))]));
  }
  drawRoute();
}

async function replace(tier, corrected) {
  const request = ++revisionRequest;
  const start = performance.now();
  byId('status').textContent = 'Loading evidence…';
  const response = await fetch(`data/${tier}-${corrected ? 'corrected' : 'original'}.json`, {cache: 'no-store'});
  if (!response.ok) throw new Error('Generate the synthetic datasets before opening the prototype.');
  const json = await response.text();
  const loaded = performance.now();
  const payload = JSON.parse(json);
  const parsed = performance.now();
  const next = readDataset(payload);
  if (request !== revisionRequest) return;
  const prepared = performance.now();
  dataset = next;
  map.set('visited', dataset.visited);
  map.set('outline', dataset.outline);
  for (const [layer, lines] of Object.entries(payload.cartography)) {
    map.set(layer, collection(lines.map(line => feature('LineString', line))));
    map.visible(layer, byId('roads').checked);
  }
  renderInspection();
  await map.settled();
  if (request !== revisionRequest) return;
  const usable = performance.now();
  Object.assign(timing, {load: loaded - start, parse: parsed - loaded,
    prepare: prepared - parsed, render: usable - prepared, total: usable - start});
  byId('status').textContent = `${name === 'leaflet' ? 'Leaflet Canvas' : 'MapLibre GL JS'} · ${dataset.tiles.size.toLocaleString()} coverage tiles · ${payload.revision}`;
  return {...timing};
}

function reportError(error) {
  byId('status').textContent = error.message;
  byId('status').dataset.error = 'true';
  console.error(error);
}

try {
  map = await createRenderer(name, coordinate => {
    if (!dataset) return;
    selected = tileAt(coordinate);
    renderInspection();
    byId('panel').open = true;
  });
  byId('home').onclick = () => map.camera(home, homeZoom);
  byId('fit').onclick = () => { if (dataset) map.fit(dataset.bounds); };
  byId('zoom-in').onclick = () => map.zoom(1);
  byId('zoom-out').onclick = () => map.zoom(-1);
  byId('route').onchange = drawRoute;
  byId('roads').onchange = event => {
    for (const layer of ['minorRoads', 'paths']) map.visible(layer, event.target.checked);
  };
  for (const control of document.querySelectorAll('[data-layer]')) {
    control.onchange = () => {
      const layer = control.dataset.layer;
      visibility[layer] = control.checked;
      map.visible(layer, control.checked);
      if (layer === 'route') map.visible('routeHalo', control.checked);
    };
  }
  const load = () => replace(byId('tier').value, byId('corrected').checked).catch(reportError);
  byId('tier').onchange = load;
  byId('corrected').onchange = load;
  await replace(byId('tier').value, false);
  window.experiment = {map, timing, visibility, state: () => ({
    size: dataset.tiles.size, revision: dataset.payload.revision,
    selection: selected ? inspect(dataset, ...selected) : null,
  })};
} catch (error) {
  reportError(error);
}
