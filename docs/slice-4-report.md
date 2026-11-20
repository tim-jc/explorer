# Slice 4 renderer feasibility

**20 November 2026 · Accepted and closed.** The owner selected MapLibre GL JS
for subsequent Explorer development and formally accepted Slice 4 after
post-remediation automated, benchmark and Safari visual verification.
The closure commit already present
at commissioning was `ebc1da4eb2ae4ebfc74ce2568e2645cacfcf08d7`.
It records Slice 2 acceptance on 17 November and reconciliation acceptance on
18 November. Slice 3 remains partially delivered pending Platform G3B–G3E.

## Implementation and data

One map-first interface uses two renderer adapters. Both consume the same bytes,
initial camera and CSS layout. Leaflet uses Canvas, three batched multipolygons
and viewport-padded spatial buckets with refresh at the end of a camera move.
MapLibre uses a GeoJSON source and a class expression, allowing the renderer
to index data into tiles in its workers. A 512-pixel MapLibre zoom receives a
one-level offset relative to Leaflet's 256-pixel zoom. Both adapters use a
shared tile-address lookup for inspection. The viewport grid is separate from
visited fill and appears at Leaflet-equivalent zoom 12 or higher. Selection,
maximum square and the selected route use separate geometry. The optional
synthetic road/path layer is disabled during benchmark runs.

| Tier | Largest cluster | Other cluster | Outside clusters | Original v2 JSON bytes |
|---|---:|---:|---:|---:|
| Small | 357 | 121 | 522 | 16,849 |
| Medium | 3,720 | 1,369 | 4,911 | 142,849 |
| Large | 18,222 | 6,889 | 24,889 | 702,850 |
| Stress | 36,097 | 13,924 | 49,979 | 1,402,850 |

Seeded scattered tiles supplement dense irregular blocks and narrow corridors.
Class membership and square outlines are authored workload inputs. Every
original tier has two explicitly sample-backed inspection tiles. Other rows
exercise overlay rendering and supply neither activity claims nor chronology.
Every corrected tier withdraws the northwest tile and removes two of three
activity relationships in its eastern neighbour, updating both known visit
extrema. It retains one sample-backed tile, supplies a replacement square and
has one fewer coverage polygon. These are synthetic consumer records.

## Historical data-stage baseline (v1 input)

Median [min–max] in milliseconds across nine trials, after an untimed
warm-up for each tier. Local uncompressed files in the warm filesystem cache.
Each timed read includes UTF-8 decoding. Node 26.13.1, arm64 macOS 27.2.1
(build 26B131), 32 GiB reported memory. Exact hardware model was unavailable.
Preparation includes tile indexing, geometry and extent construction.
See the raw observations and dataset hashes in
[data-results.json](../prototype/data-results.json).

| Tiles | Read and decode | JSON parse | Shared preparation |
|---:|---:|---:|---:|
| 1,000 | 0.09 [0.07–0.13] | 0.17 [0.17–0.20] | 0.78 [0.51–1.25] |
| 10,000 | 0.30 [0.24–0.37] | 1.52 [1.48–1.63] | 3.61 [3.34–3.95] |
| 50,000 | 0.67 [0.61–0.94] | 7.54 [7.26–7.84] | 28.17 [23.81–35.06] |
| 100,000 | 1.35 [1.15–1.53] | 15.12 [14.78–15.75] | 55.42 [52.20–58.95] |

The initial Codex browser run was blocked before creating a page. The command environment
denied loopback bind and dependency DNS lookups, and locally installed Chrome
157.0.8103.79 exited with SIGABRT when launched through cached Playwright.
The intercepted-file benchmark avoids loopback networking, but still requires
launchable Chromium or Playwright WebKit and the pinned renderer distributions.
No browser rendering, interaction, memory, failure threshold, screenshots or
genuine device results were obtained in that run. The installed Chrome version is recorded
for the launch attempt only. Browser runner scenarios and timing boundaries
are in the [acceptance runbook](slice-4-validation.md).

## Comparison and recommendation

| Dimension | Leaflet Canvas | MapLibre GL JS |
|---|---|---|
| Rendering | Canvas batches and prunes at inspection zoom. Overview work can still grow with every visible polygon and move-end reconstruction can affect interaction. | Worker-indexed GeoJSON and GPU fills. Tile boundary behavior and transient GPU/source memory during replacement require measurement. |
| Geographic correctness | Shared geographic address lookup, irrespective of Canvas hit testing. | Same lookup. Verify geometry at tile boundaries, overview zooms and after source replacement. |
| Interaction and display | Standard pan, zoom and taps. Uses the same inspection layout, colors and route halo. | Same intended interactions, with rotation and pitch gestures disabled. Verify touch and high-density rendering on Safari. |
| Architecture | Small raster-oriented integration. Time playback or dense heatmaps may need incremental batching, rasterization or viewport tiles. | Data-driven styles and vector tiling are promising for playback, coverage heatmaps and detailed country layers. Frequent source replacements can still be costly. |
| Future tools | Ride Finder can use a shared tile selection and route display model. Country overlays need an appropriate geometry budget. | Ride Finder shares the same selection model. Inspect which time filters can be expressed as style operations over coherent evidence. |
| Maintainability and operations | Fewer moving parts and no WebGL dependency. Prototype performs its own viewport batching. | More browser and worker dependencies. Native vector styles and layer expressions reduce custom cartography code. |
| Delivery and privacy | Local static assets with Canvas. Optional raster provider traffic would disclose viewed areas. | Local static assets with WebGL. A vector provider could also receive tile, style, glyph and sprite requests. |

The owner selected MapLibre GL JS after the comparative benchmark and
physical-device assessment. See the [decision record](../decisions/0001-map-renderer.md)
and the owner evidence below.

## Cartography

Keep the neutral local background for renderer timing. Turn on synthetic roads
and paths to assess road/route contrast under the grid. For provider evaluation
use the same zoom, route width and halo on each style. Score minor roads and
paths, labels, grid readability and route prominence separately at overview and
close zoom. Provider findings below are from documentation. Live provider
appearance, latency and quota behavior were not measured.

| Candidate | Fit and constraints |
|---|---|
| OpenFreeMap vector | Compare Liberty or Bright for light detail and Dark or Fiord for dark detail. A custom style can promote minor roads and tracks at effort zoom and mute labels at Explorer grid zoom. Public use is advertised as free with no account or key. Review fair-use and availability terms, display OpenStreetMap/OpenMapTiles attribution, and review host access/error logging. [Quick start](https://openfreemap.org/quick_start/) · [Terms](https://openfreemap.org/tos/) · [Privacy](https://openfreemap.org/privacy/) |
| CARTO raster | Positron and Dark Matter provide restrained reference backgrounds and straightforward Leaflet integration. Fixed raster styling limits promotion of minor roads, so Dark Matter is a useful control for the Analytics detail complaint. Confirm plan eligibility, key requirements, quotas and cost before use. CARTO and OpenStreetMap attribution apply. [Basemap terms](https://www.carto.com/legal/basemap-terms/) |
| OpenStreetMap Standard raster | Detail-rich light reference for road/path comparison. Fixed palette and labels. Public service has usage, attribution, caching and identification requirements and can restrict traffic. [Tile policy](https://operations.osmfoundation.org/policies/tiles/) |

For Explorer, test a light and a dark vector style that keep the grid
readable and subordinate minor-road detail at coverage zoom. For Analytics
Best Efforts, compare a detail-forward dark style at the short route's fitted
zoom with restrained Dark Matter, keeping a high-contrast route and halo.
Consider a locally rendered static raster derivative of a shared style so
Analytics can retain its existing presentation stack. Share visual criteria,
road/path semantics, attribution and privacy decisions across projects.
Renderer and basemap choices can then follow each product's workload.

External map calls reveal requested area and zoom to the provider, along with
network/request metadata. Provider style, glyph and sprite fetches add service
dependencies. A private application login does not constrain provider logs.
Licensed self-hosted regional tiles or locally rendered backgrounds are
potential alternatives, with storage, update and availability costs to evaluate.
The prototype loads only local dependencies and synthetic data.

## Verification and repository status

- Explorer fixtures: 27 tests, pinned hashes verified, fixtures byte-identical.
- Platform focused G3A: 134 expectations, no failures, warnings or skips.
  Ran using an isolated exact Explorer fixture checkout at `f93bedd`.
- Initial prototype model: seven tests covering all tiers, metadata, exact identity,
  chronology, replacement and grid geometry.
- Two browser adapters and the smoke/benchmark code passed JavaScript syntax
  checks. Initial browser execution was unavailable.

Slice 4 implementation and documentation are uncommitted. Platform and
Analytics were left unchanged. No private inputs, providers, paid services,
deployment or external hosting were used. The only closure commit in scope is
the existing `ebc1da4` commit. No push or Slice 5 work was performed.

## Dependency remediation on 20 November 2026

Baseline remained `main` at `ebc1da4eb2ae4ebfc74ce2568e2645cacfcf08d7`.
The Slice 4 implementation and owner-generated lockfile were uncommitted.
Manifest, lockfile and installed tree initially agreed on Leaflet 1.9.4,
MapLibre 5.6.2 and Playwright 1.55.0, including Playwright Core 1.55.0.

| Package | Installed and locked at baseline | New manifest target | Advisory and first patched release |
|---|---:|---:|---|
| MapLibre GL JS | 5.6.2 | 6.19.0 | Critical, affected through 6.4.0, fixed in 6.4.1. [GHSA-jrc7-96c5-q579](https://github.com/advisories/GHSA-jrc7-96c5-q579) |
| Playwright | 1.55.0 | 1.65.1 | High, affected before 1.55.1, fixed in 1.55.1. [GHSA-7mvr-c777-76hp](https://github.com/advisories/GHSA-7mvr-c777-76hp) |
| Leaflet | 1.9.4 | 1.9.4 | Existing comparison pin retained. |

The new pins are the stable npm releases reported by the owner's audit and
confirmed in cached registry metadata. They are above the patched minimums
and align with the current stable releases rather than beta or nightly tags.
Playwright is separate browser tooling and its Node requirement is covered
by the runbook. MapLibre v6 requires browser ESM and WebGL2. The adapter loads
the local named `Map` export from `dist/maplibre-gl.mjs`, with stylesheet and
worker assets served locally. Worker URL discovery is handled by the browser
bundle. The prototype does not use the removed UMD global, internal transform,
nested GeoJSON properties, custom style-image callbacks or altered overscaling
options. Playwright's browser launch and interaction APIs have no required
source migration for this runner based on API review. The runner now reports
the actual installed versions and rejects stale installs. The Leaflet link
remains available when MapLibre cannot start. [MapLibre migration guide](https://maplibre.org/maplibre-gl-js/docs/guides/v5-to-v6-migration-guide/)

The previous lockfile records optional Darwin-only `fsevents@2.3.2` under
Playwright 1.55.0. Its lifecycle script rebuilds a native file-watching binding.
The benchmark launches a browser and reads files directly, so it has no need
for the native watcher. The existing install already omitted that optional
package. The 1.65.1 registry metadata has no direct `fsevents` dependency.
The local npm configuration disables dependency install scripts. Browser
installation remains an explicit Playwright command. No lifecycle script was
approved.

**Initial Codex environment limitation.** Registry DNS failed on baseline audit, lockfile
refresh and final audit. Offline resolution using a writable copy of npm's
cache also failed because replacement transitive metadata, including
`@maplibre/geojson-vt`, was absent. At that point the owner-generated lockfile and installed tree
still held the original pins. The manifest and migration were prepared.
The owner subsequently verified the replacement graph, lockfile, clean install
and clean audit on the Mac as recorded below.

The 27 fixture tests and seven prototype model tests passed again. Git
verified the pinned fixture tree byte-for-byte. Dataset generation and
JavaScript syntax checks passed. Nine new Node-only data-stage runs per tier
are in [data-results-remediation.json](../prototype/data-results-remediation.json).
All four payload hashes match the earlier data run. At 100,000 tiles, median
parse was 14.86 ms (14.63–15.37 ms) and median shared preparation was
53.61 ms (52.28–57.16 ms). The earlier results above are retained as historical
data-stage evidence. Neither data-stage run loads either renderer or Playwright.

The comparative benchmark rejected the stale installed versions before
launch. An isolated blank-page launch probe using the existing Playwright
installation then reproduced Chrome SIGABRT in both headed and headless modes.
The cached Playwright installation had no bundled Chromium executable.
That probe produced no measurements. The subsequent owner run succeeded.

## Owner benchmark and device evidence, 20 November

The [original owner result](../prototype/research/benchmark-owner-2026-11-20-pre-evidence.json)
is preserved byte-for-byte. It contains 42 successful scenarios and zero
failed scenarios. Environment was arm64 macOS 27.2.1, 12 logical CPUs, 32 GiB,
Node 26.13.1, headless Chromium 157.0.8103.79, Leaflet 1.9.4, MapLibre 6.19.0
and Playwright/Core 1.65.1. Five desktop repetitions per renderer and tier,
plus one phone-emulation repetition per renderer. Local intercepted files
only, with a fresh browser context per trial.

| Tiles | Usable Leaflet | Usable MapLibre | Data-to-render Leaflet | Data-to-render MapLibre |
|---:|---:|---:|---:|---:|
| 1,000 | 72.3 ms | 438 ms | 34.1 ms | 339 ms |
| 10,000 | 67.7 ms | 436 ms | 29.1 ms | 341 ms |
| 50,000 | 126 ms | 617 ms | 90 ms | 524 ms |
| 100,000 | 190 ms | 986.5 ms | 154 ms | 891 ms |

| Desktop stress median | Leaflet | MapLibre |
|---|---:|---:|
| Selection round trip | 47.9 ms | 71.1 ms |
| Four layer toggles round trip | 297 ms | 330 ms |
| Dataset replacement | 155 ms | 812.5 ms |
| Pan/zoom settlement | 450 ms | 780 ms |
| P95 frame gap | 16.8 ms | 16.7 ms |

Both were usable within one second under stress. The frame interval is
consistent with approximately 60 FPS on the sampled desktop animations.
Settlement includes renderer idle behavior and differs from subjective
navigation fluidity. Browser JS heap samples are inconclusive because they
may reflect garbage collection and exclude GPU and native memory.

Owner checks passed for desktop map interaction, grid and tile inspection,
evidence correction and withdrawal, revised activity counts and chronology,
route and layer controls, and the 100,000-tile workload. Safari on the Mac
felt markedly smoother for trackpad zoom with MapLibre at small and stress
sizes. Leaflet showed a mesh-like pattern inside contiguous coverage at
stress overview, with cause undetermined. MapLibre's comparable coverage
looked continuous. Both were comparably responsive to selection. On the
physical iPhone both navigated smoothly, including the stress workload,
and the tile inspection panel needed scrolling. The phone observations are
qualitative. Exact iPhone model and OS version were not supplied.

The owner also confirmed lockfile generation, successful npm ci, zero npm
audit findings, successful dataset generation and all seven then-existing
model tests. The current manifest, lockfile and locally installed versions
agree. This session's audit endpoint remained inaccessible due to DNS.

## Synthetic evidence correction

The v1 generator assigned activity relationships arithmetically from tile
insertion indices. It built each display route separately from a fixed local
coordinate motif. There was no accepted sample stream supporting those claims.
In the owner-reported example every route vertex for activity
`9007199254740997` fell outside `14/8180/5600`. Comparing all original
claims to displayed vertices found 4/2,029 matches at small, 5/20,285 at medium,
4/101,429 at large and 4/202,857 at stress. The corrected variants had the
same overlaid match counts against 2,026, 20,282, 101,426 and 202,854 claims.
Even coincident vertices in v1 had no declared qualifying sample evidence.

The v2 generator derives relationships exclusively from the tile containing
each accepted full-resolution sample in four small ordered synthetic tracks.
The displayed lines use those same points directly. Connecting segments
provide geographic context and contribute zero visits. The corrected edition
removes the withdrawn sample streams and the corresponding selected route
options. Both prototypes consume identical v2 inputs. Rendering-only polygons
retain their authored coverage classes and expose no visit claims.

All 27 fixture tests and all ten prototype model tests passed, including
the reported tile, both revisions of every workload, segment-only crossings
and withdrawal. All eight generated files matched on regeneration. Accepted
fixture bytes remain unchanged. [New Node-only data-stage results](../prototype/research/data-results-post-evidence.json)
measure the leaner v2 payloads and are separate from the owner benchmark.
Polygon counts are equivalent across versions, but payload, inspection data
and route values changed, so the owner repeated the browser measurements and
visual checks. The Codex environment's Chrome launch limitation remained an
environment-specific limitation rather than an acceptance blocker.

## Post-remediation acceptance evidence

The owner completed all ten model tests, regenerated all synthetic datasets,
confirmed zero `npm audit` findings, completed all four smoke scenarios and all
42 full comparative benchmark scenarios, and passed the final visual checks in
both renderers in Safari. The full result is preserved separately as
[post-remediation benchmark evidence](../prototype/research/benchmark-owner-2026-11-20-post-evidence.json),
alongside the unchanged
[pre-remediation benchmark](../prototype/research/benchmark-owner-2026-11-20-pre-evidence.json).
The smoke result is retained as separate
[acceptance evidence](../prototype/research/benchmark-smoke-2026-11-20-post-evidence.json).

Desktop median total processing and rendering times, rounded to milliseconds:

| Visited tiles | Leaflet | MapLibre |
|---:|---:|---:|
| 1,000 | 35 ms | 339 ms |
| 10,000 | 35 ms | 340 ms |
| 50,000 | 57 ms | 524 ms |
| 100,000 | 91 ms | 890 ms |

MapLibre performance remained consistent with the pre-remediation baseline.
The evidence payloads differ between generations, so the two benchmark files
are separately identified rather than treated as a controlled before/after
performance comparison. The results do not alter the renderer selection.

Visual acceptance confirmed that the corrected northwest activity route visits
its associated tile, rendering-only tiles expose no unsupported activity claims,
evidence withdrawal removes the qualifying tile and route, and the revised east
tile exposes only activity `9007199254740993`.

During final Safari verification both prototypes initially stalled at
“Loading map…”. Reloading from origin resolved the issue immediately. Caching
is suspected but not established. Application and geographic dataset release
cache invalidation is therefore deferred; no immediate remediation is required.

## Acceptance

The owner formally accepted Slice 4 on 20 November 2026. MapLibre GL JS is the
selected renderer. Both prototypes and both generations of comparative evidence
remain research artefacts. Route styling over road detail, grid contrast against
real cartography, a collapsible mobile inspection panel, incremental historical
updates and release cache invalidation remain deferred. No production geographic
delivery, application framework, basemap provider or hosting choice is implied.
