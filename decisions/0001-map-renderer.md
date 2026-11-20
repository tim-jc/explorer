# 0001 — Explorer map renderer

**Status:** Accepted by the owner on 20 November 2026.

Use MapLibre GL JS as Explorer's renderer for subsequent development. Retain
Leaflet Canvas and the comparative benchmark as Slice 4 research artefacts.

Both candidates support the map-first interactions tested. Leaflet started
and replaced datasets considerably faster. Both became usable within one
second in the 100,000-tile headless workload. The owner found MapLibre's Mac
trackpad zoom smoother and its contiguous stress-workload coverage visually
cleaner. Tile interaction was comparable, and both were smooth on the
physical iPhone. Native vector styling and layer controls also suit Explorer's
future map views.

MapLibre needs WebGL2. Future development should evaluate incremental updates
for historical playback given the measured whole-dataset replacement cost.
The choice applies to Explorer's renderer. Application framework, basemap
provider, hosting and production data delivery are separate future decisions.
Cycling Analytics makes its own presentation choices.

See the [Slice 4 report](../docs/slice-4-report.md) for benchmark evidence,
device observations and acceptance evidence.
