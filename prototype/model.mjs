export const tiers = {small: 1000, medium: 10000, large: 50000, stress: 100000};
export const homeTile = [8180, 5600];
export const palette = ['#50b7a1', '#8796ef', '#c29159'];
export const collection = features => ({type: 'FeatureCollection', features});
export const feature = (type, coordinates, properties = {}) => ({
  type: 'Feature', geometry: {type, coordinates}, properties,
});

export function coordinate(x, y) {
  return [x / 16384 * 360 - 180, Math.atan(Math.sinh(Math.PI * (1 - y / 8192))) * 180 / Math.PI];
}

export function tileAt([lon, lat]) {
  const radians = lat * Math.PI / 180;
  return [Math.floor((lon + 180) / 360 * 16384),
    Math.floor((1 - Math.asinh(Math.tan(radians)) / Math.PI) * 8192)];
}

export function ring(x, y, width = 1) {
  return [coordinate(x, y), coordinate(x, y + width), coordinate(x + width, y + width),
    coordinate(x + width, y), coordinate(x, y)];
}

export const tileId = (x, y) => `14/${x}/${y}`;
export const home = coordinate(homeTile[0] + 2.5, homeTile[1] + 2.5);
export const homeZoom = 12;

export function readDataset(payload) {
  const tiles = new Map(payload.tiles.map(row => [tileId(row[0], row[1]), row]));
  const visited = collection(payload.tiles.map(([x, y, kind]) =>
    feature('Polygon', [ring(x, y)], {kind})));
  const outline = collection([feature('LineString', ring(...payload.square))]);
  const bounds = [[180, 90], [-180, -90]];
  for (const [x, y] of tiles.values()) {
    const [west, north] = coordinate(x, y);
    const [east, south] = coordinate(x + 1, y + 1);
    bounds[0][0] = Math.min(bounds[0][0], west);
    bounds[0][1] = Math.min(bounds[0][1], south);
    bounds[1][0] = Math.max(bounds[1][0], east);
    bounds[1][1] = Math.max(bounds[1][1], north);
  }
  return {tiles, visited, outline, bounds, payload};
}

// Display the same ordered samples that qualify visits. Connecting segments
// are visual context and never contribute new visits.
export function activityRoute(payload, id) {
  const samples = payload.acceptedSamples[id];
  return samples?.length >= 2 ? samples : null;
}

export function inspect(dataset, x, y) {
  const id = tileId(x, y);
  const row = dataset.tiles.get(id);
  const centre = coordinate(x + 0.5, y + 0.5);
  if (!row) return {id, centre, classification: 'Unvisited', evidence: 'unvisited', activities: [], first: null, last: null};
  const [, , kind, indices, first, last] = row;
  return {
    id, centre, classification: ['Largest cluster', 'Other cluster', 'Outside clusters'][kind],
    evidence: indices ? 'sample-backed' : 'rendering-only',
    activities: indices?.map(index => dataset.payload.activities[index]) ?? [],
    first: first ?? null, last: last ?? null,
  };
}

export function viewportGrid(bounds, zoom) {
  if (zoom < 12) return collection([]);
  const [left, top] = tileAt([bounds[0][0], bounds[1][1]]);
  const [right, bottom] = tileAt([bounds[1][0], bounds[0][1]]);
  const lines = [];
  for (let x = Math.max(left, 0); x <= Math.min(right + 1, 16384); x++) {
    lines.push(feature('LineString', [coordinate(x, top), coordinate(x, bottom + 1)]));
  }
  for (let y = Math.max(top, 0); y <= Math.min(bottom + 1, 16384); y++) {
    lines.push(feature('LineString', [coordinate(left, y), coordinate(right + 1, y)]));
  }
  return collection(lines);
}
