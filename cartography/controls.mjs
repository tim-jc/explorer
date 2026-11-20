import {regions, scales} from './model.mjs';
import {providerInfo} from './providers.mjs';

export const el = id => document.getElementById(id);
export function addStyles(candidates) {
  const groups = new Map();
  for (const style of candidates) {
    if (!groups.has(style.provider)) {
      const group = document.createElement('optgroup');
      group.label = providerInfo[style.provider].name;
      groups.set(style.provider, group);
      el('style').append(group);
    }
    groups.get(style.provider).append(new Option(style.name, style.id));
  }
}
export function presets() {
  for (const [id, region] of Object.entries(regions)) el('region').add(new Option(region.name, id));
  for (const scale of Object.keys(scales)) el('scale').add(new Option(scale, scale));
  el('scale').value = 'Local';
  return () => ({centre: regions[el('region').value].centre, zoom: scales[el('scale').value]});
}
export function credentials(candidate) {
  const keys = new Map();
  el('save-key').onclick = () => {
    const {provider} = candidate();
    const info = providerInfo[provider];
    const key = el('key').value.trim();
    el('key').value = '';
    if (!info.key) {
      el('status').textContent = 'This provider needs no browser key.';
      return;
    }
    if (key) keys.set(provider, key);
    else keys.delete(provider);
    el('status').textContent = key ? 'Key stored for this tab. Select Load style to use it.' : 'Key removed.';
  };
  return keys;
}
export function credit(provider) {
  const links = providerInfo[provider].credits.map(([label, href]) => {
    const link = document.createElement('a');
    link.textContent = label;
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    return link;
  });
  el('credit').replaceChildren();
  if (!links.length) {
    el('credit').textContent = 'Synthetic overlays · no external basemap';
    return;
  }
  if (provider === 'maptiler') {
    const logo = document.createElement('img');
    logo.src = 'https://api.maptiler.com/resources/logo.svg';
    logo.alt = 'MapTiler';
    logo.width = 72;
    links[0].prepend(logo, ' ');
  }
  el('credit').append('© ', ...links.flatMap((link, i) => i ? [' · ', link] : [link]));
}
