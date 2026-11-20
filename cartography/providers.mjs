const osm = ['OpenStreetMap contributors', 'https://www.openstreetmap.org/copyright'];
const omt = ['OpenMapTiles', 'https://openmaptiles.org/'];
export const providerInfo = {
  local: {name: 'Local control', credits: []},
  maptiler: {name: 'MapTiler', key: 'key', origin: 'https://api.maptiler.com',
    credits: [['MapTiler', 'https://www.maptiler.com/copyright/'], osm]},
  stadia: {name: 'Stadia Maps', key: 'api_key', origin: 'https://tiles.stadiamaps.com',
    credits: [['Stadia Maps', 'https://stadiamaps.com/attribution/'], omt, osm]},
  openfree: {name: 'OpenFreeMap', credits: [['OpenFreeMap', 'https://openfreemap.org/'], omt, osm]},
  carto: {name: 'CARTO reference', key: 'key', origin: 'https://basemaps.cartocdn.com',
    credits: [['CARTO', 'https://carto.com/attribution/'], osm]},
};
export const styles = [
  {id: 'local-light', provider: 'local', name: 'Light control', background: '#ede9df'},
  {id: 'local-dark', provider: 'local', name: 'Dark control', background: '#202938'},
  ...[['streets-v4', 'Streets · light'], ['streets-v4-dark', 'Streets · dark'], ['outdoor-v4', 'Outdoor']]
    .map(([id, name]) => ({id, name, provider: 'maptiler', vector: `https://api.maptiler.com/maps/${id}/style.json`,
      raster: `https://api.maptiler.com/maps/${id}/256/{z}/{x}/{y}{r}.png`})),
  ...[['alidade_smooth', 'Alidade Smooth · light'], ['alidade_smooth_dark', 'Alidade Smooth Dark'],
    ['outdoors', 'Stadia Outdoors']]
    .map(([id, name]) => ({id, name, provider: 'stadia', vector: `https://tiles.stadiamaps.com/styles/${id}.json`,
      raster: `https://tiles.stadiamaps.com/tiles/${id}/{z}/{x}/{y}{r}.png`})),
  ...[['liberty', 'Liberty · light'], ['bright', 'Bright · light'], ['dark', 'Dark'], ['fiord', 'Fiord · dark']]
    .map(([id, name]) => ({id, name, provider: 'openfree', vector: `https://tiles.openfreemap.org/styles/${id}`})),
  {id: 'dark-matter', name: 'Dark Matter · raster', provider: 'carto',
    raster: 'https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png'},
];

export function needsKey(provider, hostname) {
  return provider === 'maptiler' || provider === 'carto' ||
    (provider === 'stadia' && !['localhost', '127.0.0.1'].includes(hostname));
}

export function authenticate(url, provider, key) {
  const info = providerInfo[provider];
  if (!key || !info.origin || !url.startsWith(info.origin + '/')) return url;
  if (new URL(url).searchParams.has(info.key)) return url;
  return `${url}${url.includes('?') ? '&' : '?'}${info.key}=${encodeURIComponent(key)}`;
}

export function basemap(candidate, hostname, key, raster = false) {
  if (needsKey(candidate.provider, hostname) && !key) {
    throw new Error(`${providerInfo[candidate.provider].name} requires a browser key for this host.`);
  }
  if (raster) {
    if (!candidate.raster) throw new Error('No corresponding raster endpoint is configured.');
    return authenticate(candidate.raster, candidate.provider, key);
  }
  if (candidate.vector) return candidate.vector;
  if (candidate.raster) {
    const url = candidate.raster.replace('{r}', '');
    return {version: 8, sources: {base: {type: 'raster', tiles: [url], tileSize: 256, maxzoom: 20}},
      layers: [{id: 'base', type: 'raster', source: 'base'}]};
  }
  return {version: 8, sources: {}, layers: [{id: 'base', type: 'background',
    paint: {'background-color': candidate.background}}]};
}
