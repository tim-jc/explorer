import {collection, coordinate, feature, ring, tileAt, tileId} from '../prototype/model.mjs';

export const regions = {
  london: {name: 'Central London · Blackfriars', centre: [-0.1045, 51.5105]},
  surrey: {name: 'Surrey Hills · Box Hill', centre: [-0.3132, 51.2537]},
  wales: {name: 'Rural Wales · Elan Valley', centre: [-3.5857, 52.2684]},
  alps: {name: 'French Alps · Alpe d’Huez climb', centre: [6.0358, 45.0747]},
  ardennes: {name: 'Belgian Ardennes · La Roche', centre: [5.5700, 50.1762]},
};
export const scales = {Regional: 9, Local: 13, Road: 16};
export const defaults = {tiles: true, grid: true, square: true, coverage: false, route: true, effort: true,
  opacity: 0.45, width: 4, halo: 'thin'};

export function overlays(centre) {
  const [x, y] = tileAt(centre);
  // Offset the sample vertices about the actual preset camera centre while
  // allowing them to fall in neighbouring tiles naturally.
  const route = [[-0.010, -0.003], [-0.004, -0.002], [-0.0017, -0.0008], [-0.0006, 0.0003],
    [0.0005, 0.0006], [0.0017, 0.0002], [0.006, 0.0007], [0.010, 0.003]]
    .map(([lon, lat]) => [centre[0] + lon, centre[1] + lat]);
  const qualified = new Set(route.map(sample => tileId(...tileAt(sample))));
  const tiles = [], coverage = [], grid = [];
  for (let row = -5; row <= 5; row++) {
    for (let col = -5; col <= 5; col++) {
      const current = [x + col, y + row];
      const id = tileId(...current);
      const sampleBacked = qualified.has(id);
      const geometry = [ring(...current)];
      if ((Math.abs(col) <= 2 && Math.abs(row) <= 2) || (2 * col + row) % 4 === 0 || sampleBacked) {
        const kind = Math.abs(col) <= 2 && Math.abs(row) <= 2 ? 0 : col < 0 ? 1 : 2;
        tiles.push(feature('Polygon', geometry, {id, kind, sampleBacked}));
        coverage.push(feature('Polygon', geometry, {intensity: 1 + ((col + 13) * (row + 9)) % 5}));
      }
    }
  }
  for (let i = -5; i <= 6; i++) {
    grid.push(feature('LineString', [coordinate(x + i, y - 5), coordinate(x + i, y + 6)]));
    grid.push(feature('LineString', [coordinate(x - 5, y + i), coordinate(x + 6, y + i)]));
  }
  return {tiles: collection(tiles), grid: collection(grid), square: collection([feature('LineString', ring(x - 2, y - 2, 5))]),
    coverage: collection(coverage), route: collection([feature('LineString', route)]),
    effort: collection([feature('LineString', route.slice(2, 6))])};
}

export const prefix = 'explorer-research-';
export function withOverlays(style, data, options, camera) {
  const sources = {...style.sources};
  const layers = [...style.layers];
  function add(key, type, paint, minzoom = 0, suffix = '') {
    const id = prefix + key;
    sources[id] = {type: 'geojson', data: data[key]};
    layers.push({id: id + suffix, source: id, type, minzoom, paint,
      layout: {visibility: options[key] ? 'visible' : 'none',
        ...(type === 'line' ? {'line-cap': 'round', 'line-join': 'round'} : {})}});
  }
  add('tiles', 'fill', {'fill-color': ['match', ['get', 'kind'], 0, '#19bd97', 1, '#8273ed', '#d8a23d'],
    'fill-opacity': options.opacity});
  add('coverage', 'fill', {'fill-color': ['interpolate', ['linear'], ['get', 'intensity'], 1, '#ffe066', 5, '#d41663'],
    'fill-opacity': options.opacity});
  add('grid', 'line', {'line-color': '#8598b1', 'line-width': 1, 'line-opacity': options.opacity}, 11);
  add('square', 'line', {'line-color': '#f3ba38', 'line-width': 2, 'line-opacity': options.opacity});
  for (const [key, colour] of [['route', '#e83f78'], ['effort', '#26d6f5']]) {
    add(key, 'line', {'line-color': options.halo === 'light' ? '#fff9ef' : '#121927',
      'line-width': options.width + (options.halo === 'thin' ? 2 : 5),
      'line-opacity': options.halo === 'none' ? 0 : options.opacity}, 0, '-halo');
    add(key, 'line', {'line-color': colour, 'line-width': options.width, 'line-opacity': options.opacity});
  }
  return {...style, ...camera, sources, layers};
}
