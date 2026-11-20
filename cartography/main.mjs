import {authenticate, basemap, providerInfo, styles} from './providers.mjs';
import {defaults, overlays, prefix, withOverlays} from './model.mjs';
import {addStyles, credit, credentials, el, presets} from './controls.mjs';

addStyles(styles);
const preset = presets();
const selected = () => styles.find(candidate => candidate.id === el('style').value);
const keys = credentials(selected);
const options = {...defaults};
let data = overlays(preset().centre);
let map, active, pending, timeout, generation = 0, resourceFailed = false, fallbackMessage = '';

function readout() {
  if (!active) return;
  el('active').textContent = `${providerInfo[active.provider].name} · ${active.name} · zoom ${map.getZoom().toFixed(2)}`;
  el('active').dataset.centre = map.getCenter().toArray().map(value => value.toFixed(6)).join(',');
}

function apply(candidate, recovery = '') {
  let style;
  try {
    style = basemap(candidate, location.hostname, keys.get(candidate.provider));
  } catch (error) {
    el('status').textContent = error.message;
    return;
  }
  clearTimeout(timeout);
  const request = ++generation;
  pending = candidate;
  active = undefined;
  resourceFailed = false;
  fallbackMessage = recovery;
  el('active').textContent = 'Switching basemap';
  credit(candidate.provider);
  el('status').textContent = `Loading ${candidate.name}…`;
  timeout = candidate.provider === 'local' ? undefined : setTimeout(() => {
    if (generation !== request || !pending) return;
    el('style').value = 'local-light';
    apply(styles[0], 'Provider style did not load. Showing the local control.');
  }, 12000);
  try {
    // A transform waits for the previous style to finish loading. Discard that
    // style first so a failed or superseded provider cannot block recovery.
    map.setStyle(null, {diff: false});
    map.setStyle(style, {diff: false, transformStyle: (_, incoming) => {
      // Preserve the current camera even on the map's first complete style load.
      const camera = {center: map.getCenter().toArray(), zoom: map.getZoom(),
        bearing: map.getBearing(), pitch: map.getPitch()};
      return withOverlays({...incoming,
        metadata: {...incoming.metadata, 'explorer-research-generation': request}}, data, options, camera);
    }});
  } catch {
    clearTimeout(timeout);
    pending = undefined;
    el('status').textContent = 'Style could not be applied. Choose the local control or retry.';
  }
}

function refreshOverlays(updateGeometry = false) {
  if (!active) return;
  const currentLayers = withOverlays({sources: {}, layers: []}, data, options).layers;
  if (updateGeometry) {
    for (const [name, shape] of Object.entries(data)) map.getSource(prefix + name).setData(shape);
  }
  for (const {id, layout, paint} of currentLayers) {
    map.setLayoutProperty(id, 'visibility', layout.visibility);
    for (const [key, value] of Object.entries(paint)) map.setPaintProperty(id, key, value);
  }
}

function resetView() {
  const {centre, zoom} = preset();
  data = overlays(centre);
  refreshOverlays(true);
  map.jumpTo({center: centre, zoom, pitch: 0, bearing: 0});
}

try {
  const {Map, NavigationControl} = await import('../prototype/node_modules/maplibre-gl/dist/maplibre-gl.mjs');
  const {centre, zoom} = preset();
  map = new Map({
    container: 'map', center: centre, zoom, maxZoom: 20, renderWorldCopies: false,
    transformRequest(url) {
      const provider = (pending ?? active)?.provider;
      return {url: provider ? authenticate(url, provider, keys.get(provider)) : url};
    },
  });
  map.addControl(new NavigationControl(), 'top-right');
  map.on('style.load', () => {
    if (!pending || map.getStyle()?.metadata?.['explorer-research-generation'] !== generation) return;
    clearTimeout(timeout);
    active = pending;
    pending = undefined;
    refreshOverlays(true);
    credit(active.provider);
    readout();
    el('status').textContent = resourceFailed
      ? 'Style loaded with resource errors. Check network, key restrictions or provider availability.'
      : fallbackMessage || (active.provider === 'local' ? 'Local control · authored coverage and synthetic traces' : 'Style loaded');
  });
  map.on('error', () => {
    resourceFailed = true;
    el('status').textContent = 'A map resource failed. Check network, key restrictions, quota or provider status.';
  });
  map.on('moveend', readout);
  el('apply').onclick = () => apply(selected());
  el('region').onchange = el('scale').onchange = el('reset').onclick = resetView;
  for (const [name, label] of Object.entries({
    tiles: 'Tile classes', grid: 'Grid', square: 'Maximum square', coverage: 'Coverage', route: 'Activity', effort: 'Best Effort',
  })) {
    const row = document.createElement('label');
    const control = document.createElement('input');
    control.type = 'checkbox';
    control.checked = options[name];
    control.onchange = () => {
      options[name] = control.checked;
      refreshOverlays();
    };
    row.append(control, label);
    el('layers').append(row);
  }
  for (const name of ['width', 'opacity', 'halo']) el(name).oninput = () => {
    options[name] = name === 'halo' ? el(name).value : Number(el(name).value);
    refreshOverlays();
  };
  apply(styles[0]);
} catch {
  el('status').textContent = 'Map could not start. Check local dependencies and WebGL2, or try the Leaflet raster view.';
}
