# Explorer Slice 1 Feasibility Assessment

**Status:** Accepted on 14 November 2026

**Assessment date:** 14 November 2026

**Scope:** Read-only technical feasibility investigation; no application
implementation, dataset selection, interface contract or technology selection

## Executive summary

Explorer v0.1 is technically feasible, but implementation should not begin with
the full experience. The strongest path is to establish deterministic geographic
evidence and small, versioned compatibility fixtures before choosing a browser
map stack or building historical playback.

The VeloViewer grid is publicly documented as zoom-14 Web Mercator/slippy-map
tiles, so coordinate-to-tile conversion, tile bounds and tile-centre conversion
are straightforward to reproduce. Public documentation also describes the
maximum square and the structural basis of clusters. It does not fully specify
all boundary, historical or cluster-growth edge cases. Moreover, VeloViewer has
changed its own detailed tile-ticking behaviour over time. Compatibility is
therefore feasible as a tested target, not as an assumption.

Cycling Platform already has an implemented Silver sample grid with sample
index, coordinates, elapsed time, distance and Raw retrieval lineage. It also
has extensive read-only GPS integrity calibration and an offline qualification
prototype. This is useful evidence, but it is not yet the qualified GPS contract
Explorer needs: positional-alignment and missing-value semantics remain under
review, numerical qualification thresholds are unapproved, and the documented
activity key remains a source identifier rather than an evidenced multi-source
canonical identity.

Historical tile, cluster and square products are computationally tractable when
derived once in Platform and updated incrementally by ordered activity. Policy
changes, backfills and evidence rejection require versioned rebuilds. Shipping
raw lifetime GPS to the browser so Explorer can derive canonical answers would
duplicate Platform logic, increase data volume and create an avoidable privacy
risk.

The provisional technical direction is:

1. prove tile conversion and classification semantics with portable fixtures;
2. agree Platform identity and qualified-evidence contracts;
3. publish compact lifetime tile and inspection products;
4. benchmark a map-only prototype against representative synthetic volumes;
5. add historical products and playback;
6. add heatmap and countries after reference-data decisions;
7. add Ride Finder last because three-valued evidence, spatial predicates and
   complete-route retrieval make it the broadest contract.

No framework, map library, database, authentication service, host or geographic
dataset is selected by this assessment.

## Evidence classification

This assessment uses three labels:

- **Documented fact:** stated by an authoritative product/source document or
  evidenced by committed repository code and contracts.
- **Repository observation:** directly observed in committed code or metadata,
  but not promoted beyond the repository's own stated lifecycle.
- **Assumption to validate:** a plausible interpretation that needs fixtures,
  owner confirmation, empirical comparison or a future contract.

Sibling repositories were inspected at their committed `HEAD`. Uncommitted
changes in Cycling Analytics and Coastal were not treated as evidence. No live
database or private GPS data was accessed.

## 1. VeloViewer Explorer compatibility

### Findings

- **Documented fact:** VeloViewer says Explorer uses the slippy-map tile grid in
  Web Mercator at zoom 14. Under the standard slippy-map definition this means
  `2^14 × 2^14` addressable tiles, indexed from 0 to 16,383 on each axis.
- **Documented fact:** standard slippy-map conversion uses longitude for `x` and
  the Web Mercator latitude transform for `y`, with integer tiles obtained by
  flooring. Inverse formulas give tile edges; the centre follows from the
  midpoint in projected tile coordinates.
- **Documented fact:** VeloViewer describes maximum square as the largest square
  consisting entirely of visited tiles.
- **Documented fact:** VeloViewer describes a cluster seed as a visited tile
  surrounded above, below, left and right by visited tiles, and describes
  three-tile-wide corridors joining cluster areas.
- **Documented fact:** VeloViewer's published calculation history says summary
  polylines can both miss and invent tile crossings, activity detail can derive
  a more definitive set from recorded data, and later edge handling may count a
  corner crossing even when no point falls in the tile.
- **Accepted Explorer rule:** a visit requires a qualified full-resolution sample
  inside the tile. Segment-only and corner-only crossings do not qualify. This
  can intentionally differ from current VeloViewer results in edge cases.

### Boundary behaviour requiring validation

Standard slippy-map formulas define half-open cells after flooring, but public
VeloViewer material does not establish its floating-point policy for a sample
exactly on an east/south edge, the antimeridian, the Web Mercator latitude limit,
or coordinates rounded onto an edge. Explorer needs one versioned policy for
normalisation, numeric precision and half-open ownership, then fixtures for:

- all four sides and corners of a known tile;
- adjacent tiles around positive and negative longitude;
- latitude near the Web Mercator limit;
- antimeridian wrapping;
- repeated points and samples with rejected or uncertain qualification.

### Square, cluster and historical computation

A largest-all-visited square can be calculated in linear time over the relevant
tile envelope using dynamic programming, or over a sparse representation with a
bounded dense window. The result must include side length and outline origin, and
ties need a documented deterministic representation even if the UI can show
only one outline.

Cluster calculation is feasible with grid-neighbour operations and connected
components, but the exact VeloViewer-compatible expansion semantics are not fully
specified by the public overview. They require empirical fixtures. “Max
connected” must not be substituted for “max cluster.”

Historical reconstruction should replay newly visited tiles in canonical
activity order and materialise milestone/event products. Today's membership
cannot be projected backwards. Backfills can change first visits and insert
events into the middle of history; qualification-policy changes can add or remove
evidence, so both require invalidation and a versioned rebuild from the earliest
affected point.

### Independent validation

Independent validation is feasible at three levels:

1. mathematical fixtures for zoom-14 conversion and boundary ownership;
2. synthetic tile sets with known square and cluster results;
3. owner-authorised comparisons against exported or manually observed
   VeloViewer results for selected non-sensitive cases.

The third level must record the VeloViewer observation date and distinguish an
intentional sample-only difference from an unexplained incompatibility. Public
VeloViewer documentation alone is insufficient to certify every edge case.

## 2. GPS evidence and qualification

### Available Platform evidence

Committed Platform DDL defines `silver.activity_streams` at one row per
`activity_id` and `sample_index`, with elapsed `time_seconds`, device
`distance_metres`, latitude, longitude, Raw stream count, maximum Raw array size,
Raw retrieval time and transform time. A composite primary key supports ordered
per-activity reads. A GPS covering index begins with activity identity.

The Platform contract calls this the current canonical sample grid but explicitly
keeps positional alignment and missing-value distinctions under review. Raw
stores separate JSON stream arrays with source resolution and original size;
Silver expands them by list position. `time_seconds` is elapsed time, not an
absolute sample timestamp. A wall-clock observation time would therefore need a
defined derivation from canonical activity time plus elapsed time, including
timezone and clock semantics.

Platform's GPS integrity work already measures:

- invalid or non-finite coordinates and suspicious zero coordinates;
- non-increasing sample indexes and malformed elapsed time;
- gaps, displacement and implied speed;
- device-distance versus Haversine disagreement;
- duplicate timestamps, repeated-coordinate runs and local context;
- bounded reviewed labels of `ACCEPTED`, `UNCERTAIN`, `REJECTED` and
  `UNREVIEWED` with evidence provenance.

Its offline prototype independently classifies observations and segments. The
first structural policy rejects missing/out-of-range observations, unusable
segment endpoints and movement over non-positive time, but leaves most otherwise
valid entities uncertain because empirical thresholds are deliberately
unapproved. It does not publish a production qualification result.

### Capability-specific evidence

| Capability | Minimum evidence | Important distinction |
| --- | --- | --- |
| Tile visit | Qualified full-resolution sample, tile reference, activity identity, sample index, observation time and policy version | A valid segment crossing does not establish a visit |
| Tile history | All qualifying visit events plus invalidation/version lineage | Earliest recorded visit can move after backfill |
| Heatmap | Qualified sample sequences grouped by distinct activity, with gaps/invalid sections preserved | Frequency counts activities, not sample density |
| Ride Finder starts/ends | Qualified endpoint evidence and explicit unknown state | Missing/uncertain endpoint is not false |
| Ride Finder traverses | Qualified sample-presence result and, separately, valid-segment intersection result | Segment intersection requires segment qualification and gap policy |
| Complete route display | Ordered samples plus break markers or valid segment membership | Invalid gaps must not be drawn as connecting lines |
| Country visit | Qualified sample inside a versioned boundary | No minimum-distance threshold |
| Cross-border distance | Valid segments, boundary version and allocation/uncertainty output | Unallocatable distance remains explicit |

### Feasibility conclusion

Full-resolution samples appear structurally available, but their source
resolution must be retained and qualified; “Silver row exists” is not equivalent
to “qualified full-resolution GPS.” Explorer is blocked from canonical tile,
heatmap, country and search products until Platform approves a versioned
observation/segment qualification contract and a stable activity identity.

No new qualification threshold is proposed here. Live population volumes and
the distribution of qualification states require an authorised, read-only
Platform evidence report; Explorer should not connect to production to obtain
them.

## 3. Historical geographic computation

### Feasible computation model

Platform should order activities by a canonical event key that is stable across
backfills and ties. For each policy/reference-data version it can derive:

1. qualified sample-to-tile visit events;
2. each tile's first and subsequent activity visits;
3. the cumulative visited set after each geography-changing activity;
4. cluster membership and maximum-square geometry at those checkpoints;
5. country first visits and cumulative discoveries;
6. aligned counts for visited tiles, largest cluster and square side length.

Activities with no geographic change can retain a checkpoint reference without
duplicating complete geometry. Explorer owns navigation and optional skipping,
not historical classification.

### Cost and update strategy

Let `S` be qualified samples, `V` distinct visited tiles, `A` activities and `E`
geography-changing activities.

- Sample-to-tile assignment is `O(S)` and naturally partitions by activity.
- First visits and visit counts are linear in visit events after assignment.
- A full square calculation is linear in the bounded tile envelope; doing this
  independently for every activity would be wasteful.
- Connected-component cluster calculation is linear in visited tiles plus
  neighbour edges for one snapshot, once exact semantics are fixed.
- Incremental append processing is attractive because lifetime visits are
  normally monotonic. Only checkpoints where the visited set changes need new
  classifications or milestone evaluation.
- A backfill inserted in history invalidates milestones and classifications from
  the earliest affected activity onward.
- A qualification-policy or geographic-reference version change can remove as
  well as add evidence and should trigger a separately versioned rebuild rather
  than mutation of prior results.

The exact runtime and storage cost cannot be stated without activity/sample/tile
cardinalities. Platform should produce non-sensitive counts and benchmark a
synthetic or authorised representative corpus before physical design.

### Ownership

Platform Gold owns visit events, historical classifications, milestones,
country allocation and their provenance. Explorer owns calendar/activity/
milestone navigation, camera following, playback speed, pauses, filtering and
chart presentation. The proposed logical boundary is detailed in
[Platform data contracts](platform-data-contracts.md).

## 4. Geographic reference data

No dataset is selected or imported.

| Candidate | Strengths | Limitations and licence considerations | Provisional role |
| --- | --- | --- | --- |
| Mathematical zoom-14 Web Mercator grid | Exact, deterministic, no external polygon dataset needed | VeloViewer edge policy still needs validation | Preferred basis to investigate for Explorer tiles |
| Natural Earth Admin 0/1 | Public domain, versioned releases, compact global scales | Generalised cartography; documented accuracy omissions and disputed-boundary viewpoints make it unsuitable for precise cross-border allocation without validation | Overview rendering or low-zoom candidate |
| geoBoundaries | Global administrative levels, common formats, CC BY 4.0 | Attribution, release/version choice and disputed-area policy must be governed; accuracy must be tested at route scale | Country/region analytical candidate |
| OpenStreetMap administrative boundaries | Detailed and maintained; useful map ecosystem | ODbL attribution/share-alike obligations, complex boundary relations, edits over time and redistribution implications | Detailed candidate requiring licensing and versioning review |
| GADM | Broad administrative coverage | Official licence restricts redistribution and commercial use without permission | Poor default fit; exclude unless owner/legal review establishes a permitted use |
| National authoritative sources | Potentially best local accuracy | Country-specific formats, licences, identifiers, coverage and update cycles | Possible targeted supplement, not a simple global baseline |

Boundary policy is as important as source choice: disputed territories, maritime
areas, enclaves, boundary points, coastline precision and country/region
identifier stability all need explicit rules. Cross-border distance allocation
requires line/polygon intersection against the exact version used for the result;
invalid or ambiguous segments remain unallocated or uncertain.

## 5. Platform-to-Explorer contracts

The minimum proposed logical products are documented in
[Platform data contracts](platform-data-contracts.md). They are future contracts,
not schemas or existing interfaces.

The key feasibility conclusion is that compact derived products can serve the
default map and history without exposing raw GPS. Detailed ordered route evidence
should be fetched only for an authorised selected activity or bounded Ride Finder
operation. This reduces browser load and privacy exposure while preserving
drill-down provenance.

Canonical activity identity is a hard dependency across every product. Current
Platform metadata describes the numeric `activity_id` as a source activity
identifier with multi-source semantics under review. Explorer must not embed
that temporary meaning into URLs, caches or durable geographic keys.

## 6. Browser map and performance

### Workload characteristics

Explorer combines regular tile polygons, outlines, potentially many route
segments, heatmap coverage, country polygons, selection geometry and time-based
state changes. The initial lifetime view should use compact derived data;
complete routes and fine-grained search results should load on demand. Unknown
real volumes prevent a defensible library selection today.

### Shortlist

| Approach | Strengths | Trade-offs | Evidence needed |
| --- | --- | --- | --- |
| MapLibre GL JS with GeoJSON initially and vector tiles when justified | WebGL, native style-layer ordering, vector-tile support, worker-based GeoJSON tiling and data-driven styling suit many tiles and playback states | More complex style/source model; feature properties can be altered by tiling; requires a suitable basemap/tile source and careful accessibility/mobile testing | Benchmark tile fills/outlines, route selection, playback updates and mobile memory |
| OpenLayers with vector/vector-tile layers | Mature projection and geometry model, strong vector and editing capabilities, raster/vector flexibility | Larger conceptual surface; its WebGL vector-tile path includes APIs whose stability must be checked; UI styling is more application-owned | Prototype polygon selection, vector-tile rendering and mobile interaction |
| Leaflet with Canvas and selective plugins | Simple interaction model; existing committed Analytics and Coastal experience; SVG/Canvas vectors and panes are well understood | Primarily DOM/Canvas rather than a unified GPU style pipeline; very large dynamic polygon/route sets may require manual tiling, aggregation or plugins | Use as performance baseline; test representative upper-bound layers rather than assume existing small-route success scales |

A deck.gl overlay is a possible specialist accelerator for very large paths or
animated layers, not a standalone basemap decision and not yet necessary. Raster
images are efficient for dense visual coverage but lose per-tile inspection and
dynamic classification; vector features are the default candidate for tiles,
outlines and search. A hybrid can rasterise/aggregate heat intensity while
keeping inspectable boundaries and selected routes as vectors.

### Provisional performance strategy

- Define non-sensitive lower/typical/upper-bound fixture volumes before the
  renderer prototype.
- Load the initial viewport and coarse lifetime summary first; fetch detail on
  selection or zoom.
- Keep tile geometry implicit from `(z, x, y)` where possible rather than repeat
  four corners in every record.
- Prefer compact typed or tiled delivery for large datasets; do not assume one
  monolithic GeoJSON response.
- Separate immutable versioned products from short-lived UI state so safe local
  caching can be evaluated.
- Benchmark pan/zoom, layer toggling, inspection, route selection and historical
  stepping on representative desktop and mobile hardware.
- Measure payload bytes, parse time, render time, frame rate and peak memory.

The prototype should compare at least MapLibre and Leaflet; include OpenLayers
if selection/editing requirements or projection handling expose a meaningful
gap. This is a benchmark recommendation, not a technology choice.

## 7. Privacy, authentication and hosting

A fully public static site cannot safely contain private route or provenance
files: unlinked filenames, hidden layers and client-side route guards are not
access control. OWASP recommends authorisation on every resource request and
explicit protection for static resources.

Feasible architectural shapes include:

| Shape | Feasibility | Privacy implications |
| --- | --- | --- |
| Static public shell plus authenticated API | Strong candidate: public code/assets can be cached while private geographic responses are authorised server-side | Requires an API/gateway and careful response caching; no private fallback data in the static bundle |
| Entire site behind an authenticated edge/gateway | Feasible and operationally simple for a private single-owner application | Every document and asset is protected; still requires correct cache and origin controls |
| Local-only generated application/data | Feasible for initial private use and strongest isolation from public hosting | Limits multi-device access and background refresh; local files and browser storage still require device-level protection |
| Pre-generated private static data behind signed/authorised delivery | Feasible only if every object is protected and expiry/invalidation is reliable | Object URLs, CDN caching and revocation become security-critical; not equivalent to a public static site |

Personalised responses must not enter shared caches. `Cache-Control: private`
prevents shared-cache storage; especially sensitive or revocable route responses
may require `no-store`, accepting its usability/performance cost. Browser storage,
service workers, offline support and telemetry all need a data-retention threat
review before use.

Authentication and hosting products remain unselected. Before implementation,
the owner must decide the intended access population, device/session expectations,
whether local-only operation is acceptable, and whether any deliberately
redacted public outputs are in scope.

## Recommended technical direction

The following direction is provisional pending owner acceptance and Platform
decisions:

1. Treat zoom-14 slippy-map conversion as the tile-geometry candidate and prove
   it with boundary fixtures plus owner-authorised VeloViewer comparisons.
2. Keep sample qualification, segment qualification, geographic classification,
   history and reference versions in Platform-owned Gold products.
3. Require a stable canonical activity key before durable Explorer products.
4. Deliver compact lifetime tile summaries before detailed routes; retrieve
   private route/provenance data on demand through an authorised boundary.
5. Compare MapLibre GL JS and Leaflet against the same synthetic workload;
   include OpenLayers only where its geometry/editing strengths materially
   address a tested need.
6. Defer physical data format, database, framework, authentication and hosting
   decisions until contract volumes and prototype evidence exist.

## Risks and dependencies

- **Compatibility drift:** VeloViewer behaviour can change and is not a formal
  public specification. Mitigation: dated fixtures and explicit intentional
  deviations.
- **Qualification not production-ready:** structural research exists, but
  empirical thresholds and publication policy are unapproved. Owner: Platform.
- **Identity instability:** current source activity IDs do not evidence the
  intended cross-source canonical identity. Owner: Platform.
- **Historical invalidation:** backfills and policy/reference changes can rewrite
  milestones. Mitigation: versioned builds and dependency fingerprints.
- **Boundary/legal ambiguity:** dataset accuracy, disputed areas and licences can
  change outputs and redistribution rights. Owner decision plus dataset review.
- **Unknown volume:** no live cardinalities were queried. Mitigation: authorised
  aggregate counts and synthetic/representative benchmarks.
- **Privacy leakage:** static assets, caches, logs or telemetry can expose routes.
  Mitigation: server-side/edge authorisation, data minimisation and cache policy.
- **Cross-project sequencing:** Explorer presentation cannot validate end-to-end
  canonical results until Platform products exist.

## Unresolved questions

### Owner decisions

- What difference from VeloViewer is acceptable when its corner-crossing rule
  conflicts with Explorer's accepted sample-only rule?
- Is the first usable release local-only, remotely authenticated, or both?
- Which devices and representative scale define acceptable map performance?
- Which political-boundary worldview should country results use?
- May owner-authorised, non-sensitive VeloViewer observations be recorded as
  compatibility fixtures without including private routes?

### Cycling Platform — Geospatial actions

- Establish the stable canonical activity identity and migration semantics.
- Complete Silver stream alignment and missing-value semantic review.
- Approve versioned observation and segment qualification contracts, including
  policy fingerprints and full-resolution/source-resolution evidence.
- Define absolute sample-time derivation and provenance.
- Supply non-sensitive counts for activities, samples, distinct tiles and track
  sizes; do not expose coordinates.
- Investigate and propose versioned Gold products from
  [Platform data contracts](platform-data-contracts.md).
- Decide country/region reference-source governance, boundary policy and
  cross-border uncertainty semantics.
- Define rebuild/invalidation behaviour for backfills, qualification changes and
  reference-data updates.

## Cross-project dependency summary for Cycling Portfolio

Explorer Slice 1 finds the v0.1 experience feasible but dependent on new,
versioned Cycling Platform geospatial products. Platform has full-resolution-like
Silver sample rows and mature diagnostic research, but production qualification,
stable cross-source activity identity, geographic reference governance and
historical Gold classifications are not evidenced as implemented. Explorer can
independently validate zoom-14 tile maths, build synthetic classification
fixtures, define presentation states and benchmark browser renderers. Canonical
tile visits, clusters, squares, countries, heatmap evidence and three-valued
Ride Finder results remain Platform/cross-project work. No technology or dataset
selection is yet justified.

## Evidence and references

### Local committed evidence

- Explorer [product specification](product-specification.md) and
  [architecture](architecture.md).
- Cycling Platform [Silver activity-stream contract](../../cycling-platform/docs/data-contracts/silver/activity_streams.md),
  [mechanical schema](../../cycling-platform/metadata/silver/activity_streams.json),
  [GPS integrity POC](../../cycling-platform/docs/gps_track_integrity_poc.md) and
  [calibration/qualification record](../../cycling-platform/docs/gps_track_integrity_calibration.md).
- Cycling Analytics committed Activity Inspector
  [design](../../cycling-analytics/docs/activity-inspector.md), demonstrating
  ordered full-route presentation with invalid-coordinate breaks while retaining
  sample indexes.
- Coastal committed [data contract](../../coastal/docs/data-contract.md),
  demonstrating read-only ordered sample-index consumption while retaining
  domain-specific boundary curation locally.

### External technical references

- [VeloViewer Explorer overview](https://blog.veloviewer.com/veloviewer-explorer-overview/)
  — zoom-14 grid, square and cluster descriptions.
- [VeloViewer tile calculation updates](https://blog.veloviewer.com/explorer-tile-calculation-updates/)
  and [detailed ticking update](https://blog.veloviewer.com/update-to-detailed-veloviewer-explorer-tile-ticking/)
  — calculation history and edge behaviour.
- [OpenStreetMap slippy-map tilenames](https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames)
  — forward/inverse Web Mercator tile formulas.
- [Natural Earth terms](https://www.naturalearthdata.com/about/terms-of-use/),
  [geoBoundaries](https://www.geoboundaries.org/),
  [OpenStreetMap copyright/licence](https://www.openstreetmap.org/copyright)
  and [GADM licence](https://gadm.org/license.html) — candidate reference-data
  licensing and limitations.
- [MapLibre GL JS documentation](https://maplibre.org/maplibre-gl-js/docs/),
  [MapLibre large-data guidance](https://maplibre.org/maplibre-gl-js/docs/guides/large-data/),
  [Leaflet reference](https://leafletjs.com/reference) and
  [OpenLayers WebGL vector-tile example](https://openlayers.org/en/latest/examples/webgl-vector-tiles.html)
  — renderer capabilities and trade-offs.
- [OWASP authorisation guidance](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
  and [MDN HTTP caching guidance](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control)
  — private resource enforcement and cache semantics.
