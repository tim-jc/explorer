# Slice 4 local evaluation

## Acceptance record

The owner formally accepted Slice 4 on 20 November 2026 after completing all
ten model tests, deterministic dataset regeneration, a zero-vulnerability npm
audit, four smoke benchmark scenarios, 42 full comparative scenarios and final
Safari visual checks in both renderers. The post-remediation benchmark files are
preserved under `prototype/research/`; the commands below remain the reproducible
validation procedure rather than outstanding acceptance work.

Use Node 22 or newer, npm and Python 3. The dependency remediation was prepared
with Node 26.13.1 and npm 11.20.0. MapLibre v6 requires WebGL2. Leaflet uses
Canvas. Registry access is needed for dependency downloads and the live audit.

The owner verified the retained lockfile with `npm ci` and `npm audit`
(zero vulnerabilities). From the repository root:

```sh
cd prototype
npm ci
npm ls leaflet maplibre-gl playwright playwright-core
npm audit
```

Keep `package-lock.json` with the project. Use `npm install --package-lock-only`
when deliberately changing dependency pins, then review the lockfile diff
and verify with `npm ci`. Plain `npm audit` includes development dependencies.

The project sets `ignore-scripts=true` in its local `.npmrc` to disable
dependency lifecycle scripts. The benchmark does not use native file watching.
The old Playwright version could install the optional macOS-only `fsevents`
dependency, which requested `node-gyp rebuild`. No script approval is required
for these commands. Browser downloads, when needed, are explicit.

```sh
npm test
npm start
```

Open [Leaflet](http://127.0.0.1:8765/?renderer=leaflet) and
[MapLibre](http://127.0.0.1:8765/?renderer=maplibre) in Safari on the Mac.
The local server binds to loopback. For a deliberate iPhone test on a trusted
local network, stop it, run `python3 -m http.server 8765 --bind MAC_LAN_IP`
from `prototype`, and open `http://MAC_LAN_IP:8765/` from the iPhone. Replace
`MAC_LAN_IP` with the Mac's local Wi-Fi address and stop the server when done.
The contents are synthetic. Use the neutral background while measuring.

## Manual exercise

1. In both views start at 1,000 tiles. Pan and zoom, use Fit and Home, and
   verify the grid appears as you zoom in. Check that the green, violet and
   ochre fills represent largest, other and outside-cluster visits and that
   the yellow outline independently marks the square.
2. At Home select the northwest corner tile `14/8180/5600`. It has one
   activity, `9007199254740997`, and unknown first and last visits. Select
   its route and confirm it is inside the selected tile. Select a nearby bulk
   coverage tile and verify inspection labels it as rendering workload only
   and supplies no activity metadata. Return to the northwest tile and toggle Grid, Visited, Maximum square and Activity route
   independently. Check that selection remains legible over each layer.
3. Enable Corrected evidence with that tile still selected. Its fill and
   associated route should disappear, status should show 999, and inspection
   should show Unvisited. Select the tile immediately to the east. It should
   show one activity, `9007199254740993`, and matching known dates in 2025.
   Switch back to original evidence and compare the three exact activity IDs.
4. Select route `9007199254740992` on the east tile in the original data.
   Turn on synthetic roads and paths, zoom in near the short route, and
   compare the route halo, road/path visibility and grid contrast.
5. Repeat Fit, Home, zoom and replacement at all tiers. Record Mac and
   iPhone model, OS/browser versions, display density, and observed lag or
   loss of detail. On iPhone check pinch zoom, single-tap selection, panel
   scrolling and collapse, landscape layout, and accidental selection
   during gesture use. Record WebGL failure or context loss if encountered.
   The Leaflet link remains available if MapLibre cannot start.

## Automated checks and browser benchmark

```sh
# From the repository root
python3 -m unittest discover -s tests -v
git diff f93bedd --exit-code -- fixtures

cd prototype
npm run generate
node --expose-gc benchmark-data.mjs
npm run benchmark
```

Browser automation uses locally installed Google Chrome by default. If Chrome
is installed elsewhere, supply its executable path via `BROWSER_PATH`.
The runner checks installed versions against the manifest and records
Playwright, Playwright Core and both renderer versions from their packages.
`HEADED=1 npm run benchmark` attempts a headed run. For Playwright WebKit,
install its engine with `npx playwright install webkit`, then run
`ENGINE=webkit npm run benchmark`. Playwright WebKit and phone emulation
are separate from testing the owner's Safari or iPhone. Configure a quick
smoke run with `TIERS=small REPETITIONS=1 npm run benchmark`.

The runner serves local files via browser request interception, blocks external
requests and uses a fresh browser context for every trial. It alternates
renderer order, runs five desktop repetitions per renderer and tier by default
at 1365×900 DPR 1, and runs one small-workload phone-emulation pass at
390×664 DPR 3 with touch. Measure the same tile at Home, perform four
off/on toggles, replace evidence, fit/reset and fly over the same camera
path. The benchmark uses each renderer's built-in animation with a 400 ms
target duration, so easing can differ. Browser results go to
`benchmark-results.json` and captures to `screenshots/`.

Load measures response and text decoding, parse is JSON parse, prepare is
shared geometry/index construction, render ends after renderer settlement and
two animation frames. Navigation to usable includes application and renderer
startup. Selection and toggle timings include automation round trips.
Pan/zoom reports settlement, frame count and 95th percentile inter-frame gap.
Browser-exposed JS heap is sampled where available and excludes GPU/native
memory. Fresh browser contexts avoid borrowing provider caches. Host filesystem
cache may still be warm. Use medians and ranges within each renderer/tier/profile.
A recorded failure is a failed scenario, with separate diagnosis needed to
establish any feature-count threshold. Owner acceptance includes visual review,
Mac/iPhone device results and an explicit technology decision.

## Focused final owner verification

After regenerating v2 datasets, on Mac Safari check the northwest route,
rendering-only tile and corrected evidence using steps 2–3 on both renderers.
Confirm the corrected east tile offers only `9007199254740993`. Repeat the
northwest route and correction on iPhone if convenient. Compare the proved
behaviours to the [feasibility report](slice-4-report.md) before formal acceptance.

Run a smoke pass and the full comparison with separate output paths:

```sh
TIERS=small REPETITIONS=1 RESULT_PATH=benchmark-results-smoke-v2.json npm run benchmark
RESULT_PATH=benchmark-results-post-evidence.json npm run benchmark
```

The pre-remediation owner baseline is preserved under `prototype/research/`.
Both versions draw the same number of coverage polygons per tier and revision.
Their payload sizes, inspection metadata and route geometries differ, so load,
parse, selection and replacement timings need that context.
