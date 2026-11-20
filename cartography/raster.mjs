import {basemap, providerInfo, styles} from './providers.mjs';
import {overlays} from './model.mjs';
import {addStyles, credit, credentials, el, presets} from './controls.mjs';

const candidates = styles.filter(candidate =>
  ['local-dark', 'streets-v4-dark', 'alidade_smooth_dark', 'dark-matter'].includes(candidate.id));
addStyles(candidates);
const preset = presets();
el('scale').value = 'Road';
const selected = () => candidates.find(candidate => candidate.id === el('style').value);
const keys = credentials(selected);
let map, base, active = selected();
const leafletPoint = ([lon, lat]) => [lat, lon];

function readout() {
  el('active').textContent = `${providerInfo[active.provider].name} · ${active.name} · Leaflet zoom ${map.getZoom()}`;
}

try {
  map = L.map('map', {zoomControl: false, attributionControl: false, preferCanvas: true, maxZoom: 21});
  L.control.zoom({position: 'topright'}).addTo(map);
  map.getContainer().style.backgroundColor = '#202938';
  const halo = L.polyline([], {interactive: false}).addTo(map);
  const effort = L.polyline([], {interactive: false, color: '#26d6f5'}).addTo(map);
  function appearance() {
    const opacity = Number(el('opacity').value);
    const weight = Number(el('width').value);
    const treatment = el('halo').value;
    effort.setStyle({opacity, weight});
    halo.setStyle({opacity: treatment === 'none' ? 0 : opacity,
      weight: weight + (treatment === 'thin' ? 2 : 5), color: treatment === 'light' ? '#fff9ef' : '#121927'});
  }
  function reset() {
    const {centre, zoom} = preset();
    const line = overlays(centre).effort.features[0].geometry.coordinates.map(leafletPoint);
    halo.setLatLngs(line);
    effort.setLatLngs(line);
    map.setView(leafletPoint(centre), zoom + 1, {animate: false});
  }
  function apply() {
    const candidate = selected();
    let url;
    try {
      if (candidate.raster) url = basemap(candidate, location.hostname, keys.get(candidate.provider), true);
    } catch (error) {
      el('status').textContent = error.message;
      return;
    }
    if (base) map.removeLayer(base);
    active = candidate;
    credit(active.provider);
    readout();
    el('status').textContent = url ? 'Loading raster tiles…' : 'Local control · synthetic Best Effort';
    if (!url) return;
    let failed = false;
    base = L.tileLayer(url, {maxNativeZoom: 20, maxZoom: 21});
    const layer = base;
    base.on('tileerror', () => {
      failed = true;
      if (base === layer) el('status').textContent = 'Raster tile failed. Check network, key restrictions, quota or availability.';
    });
    base.on('load', () => {
      if (!failed && base === layer) el('status').textContent = 'Raster tiles loaded';
    });
    base.addTo(map);
  }
  el('apply').onclick = apply;
  el('region').onchange = el('scale').onchange = el('reset').onclick = reset;
  for (const name of ['width', 'opacity', 'halo']) el(name).oninput = appearance;
  map.on('zoomend', readout);
  reset();
  appearance();
  apply();
} catch {
  el('status').textContent = 'Raster view could not start. Check that local dependencies are installed.';
}
