import {collection, home, homeZoom, palette, viewportGrid} from './model.mjs';

const colors = {minorRoads: '#788391', paths: '#adb4a0', grid: '#808c9e', outline: '#ffe181', selection: '#ffffff', routeHalo: '#101827', route: '#ff6485'};
const widths = {minorRoads: 2, paths: 1, grid: 1, outline: 2.5, selection: 3, routeHalo: 7, route: 4};
const names = ['minorRoads', 'paths', 'visited', 'grid', 'outline', 'selection', 'routeHalo', 'route'];
const empty = () => collection([]);
const point = ([lon, lat]) => [lat, lon];
const painted = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

export function asset(url, css = false) {
  return new Promise((resolve, reject) => {
    const element = document.createElement(css ? 'link' : 'script');
    if (css) Object.assign(element, {rel: 'stylesheet', href: url});
    else element.src = url;
    element.onload = resolve;
    element.onerror = () => reject(new Error(`Could not read ${url}. Install dependencies before starting.`));
    document.head.append(element);
  });
}

export async function createRenderer(name, onSelect) {
  if (name === 'maplibre') {
    const [maplibre] = await Promise.all([
      import('./node_modules/maplibre-gl/dist/maplibre-gl.mjs'),
      asset('./node_modules/maplibre-gl/dist/maplibre-gl.css', true),
    ]);
    return webgl(maplibre.Map, onSelect);
  }
  await Promise.all([
    asset('./node_modules/leaflet/dist/leaflet.js'),
    asset('./node_modules/leaflet/dist/leaflet.css', true),
  ]);
  return canvas(onSelect);
}

function boundsFor(view) {
  return [[view.getWest(), view.getSouth()], [view.getEast(), view.getNorth()]];
}

function canvas(onSelect) {
  const map = L.map('map', {
    preferCanvas: true, zoomControl: false, attributionControl: false,
    zoomSnap: 0, zoomDelta: 1, maxBounds: [[-80, -179], [80, 179]], minZoom: 3, maxZoom: 19,
  }).setView(point(home), homeZoom);
  const layers = {};

  names.forEach((name, index) => {
    map.createPane(name).style.zIndex = 410 + index;
    layers[name] = L.geoJSON(null, {
      pane: name, interactive: false,
      style: {color: colors[name], weight: widths[name], opacity: name === 'grid' ? 0.46 : 1,
        dashArray: name === 'paths' ? '3 3' : null},
    }).addTo(map);
  });

  const visited = layers.visited;
  // Batch each authored class into a Canvas path. Spatial buckets keep viewport
  // refreshes local at inspection zoom while still drawing all visible evidence at overview.
  let buckets = new Map();
  function refresh() {
    if (!map.hasLayer(visited)) return;
    const bounds = map.getBounds().pad(0.35);
    const groups = [[], [], []];
    for (const bucket of buckets.values()) {
      if (!bounds.intersects(bucket.bounds)) continue;
      for (const f of bucket.features) groups[f.properties.kind].push(f.geometry.coordinates);
    }
    visited.clearLayers();
    groups.forEach((coordinates, kind) => {
      if (!coordinates.length) return;
      const data = {type: 'Feature', properties: {}, geometry: {type: 'MultiPolygon', coordinates}};
      const layer = L.geoJSON(data, {pane: 'visited', interactive: false,
        style: {stroke: false, fillColor: palette[kind], fillOpacity: 0.62}});
      visited.addLayer(layer);
    });
  }
  function set(name, data) {
    if (name === 'visited') {
      buckets = new Map();
      for (const f of data.features) {
        const ring = f.geometry.coordinates[0];
        const [lon, lat] = ring[0];
        const key = `${Math.floor(lon)}:${Math.floor(lat)}`;
        if (!buckets.has(key)) buckets.set(key, {features: [], bounds: L.latLngBounds([])});
        const bucket = buckets.get(key);
        bucket.features.push(f);
        bucket.bounds.extend(point(ring[0])).extend(point(ring[2]));
      }
      refresh();
    } else {
      layers[name].clearLayers().addData(data);
    }
  }

  map.on('click', event => onSelect([event.latlng.lng, event.latlng.lat]));
  map.on('moveend', () => {
    refresh();
    set('grid', viewportGrid(boundsFor(map.getBounds()), map.getZoom()));
  });
  set('grid', viewportGrid(boundsFor(map.getBounds()), map.getZoom()));
  return {
    set,
    visible(name, show) {
      if (show) {
        layers[name].addTo(map);
        if (name === 'visited') refresh();
      } else map.removeLayer(layers[name]);
    },
    fit: bounds => map.fitBounds(bounds.map(point), {padding: [32, 32], animate: false}),
    camera: (centre, zoom) => map.setView(point(centre), zoom, {animate: false}),
    animate: (centre, zoom) => new Promise(resolve => {
      map.once('moveend', resolve);
      map.flyTo(point(centre), zoom, {duration: 0.4});
    }),
    project: coordinate => map.latLngToContainerPoint(point(coordinate)),
    zoom: delta => map.setZoom(map.getZoom() + delta),
    zoomLevel: () => map.getZoom(),
    settled: painted,
  };
}

async function webgl(MapLibreMap, onSelect) {

  const map = new MapLibreMap({
    container: 'map', center: home, zoom: homeZoom - 1, minZoom: 2, maxZoom: 18,
    renderWorldCopies: false, dragRotate: false, pitchWithRotate: false,
    touchPitch: false, attributionControl: false,
    maxBounds: [[-179, -80], [179, 80]],
    style: {version: 8, sources: {}, layers: [{id: 'background', type: 'background',
      paint: {'background-color': '#202a39'}}]},
  });
  map.touchZoomRotate.disableRotation();
  await new Promise((resolve, reject) => {
    map.once('load', resolve);
    map.once('error', event => reject(event.error));
  });
  for (const name of names) {
    map.addSource(name, {type: 'geojson', data: empty(), maxzoom: 14, tolerance: 0});
    map.addLayer(name === 'visited' ? {
      id: name, source: name, type: 'fill', paint: {'fill-opacity': 0.62,
        'fill-antialias': false, 'fill-color': ['match', ['get', 'kind'],
          0, palette[0], 1, palette[1], palette[2]]},
    } : {
      id: name, source: name, type: 'line',
      paint: {'line-color': colors[name], 'line-width': widths[name],
        'line-opacity': name === 'grid' ? 0.46 : 1,
        ...(name === 'paths' ? {'line-dasharray': [3, 3]} : {})},
    });
  }
  const set = (name, data) => map.getSource(name).setData(data);
  const grid = () => set('grid', viewportGrid(boundsFor(map.getBounds()), map.getZoom() + 1));
  map.on('click', event => onSelect([event.lngLat.lng, event.lngLat.lat]));
  map.on('moveend', grid);
  grid();
  return {
    set,
    visible: (name, show) => map.setLayoutProperty(name, 'visibility', show ? 'visible' : 'none'),
    fit: bounds => map.fitBounds(bounds, {padding: 32, duration: 0}),
    camera: (centre, zoom) => map.jumpTo({center: centre, zoom: zoom - 1}),
    animate: (centre, zoom) => new Promise(resolve => {
      map.once('moveend', resolve);
      map.flyTo({center: centre, zoom: zoom - 1, duration: 400, essential: true});
    }),
    project: coordinate => map.project(coordinate),
    zoom: delta => map.zoomTo(map.getZoom() + delta),
    zoomLevel: () => map.getZoom() + 1,
    async settled() {
      await new Promise(resolve => {
        map.once('idle', resolve);
        map.triggerRepaint();
      });
      await painted();
    },
  };
}
