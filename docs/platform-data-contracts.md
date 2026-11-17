# Proposed Platform-to-Explorer Data Contracts

**Status:** Accepted on 14 November 2026 as proposed logical contracts; not
implemented interfaces or physical schemas

**Assessment date:** 14 November 2026

## Contract principles

- Cycling Platform owns canonical activity identity, qualified GPS evidence,
  reference-data versions, derived geographic facts, historical classifications
  and provenance.
- Explorer owns presentation, interaction, layer state, search composition,
  historical playback and other UI state.
- Every product is versioned by the policies and source/reference inputs that can
  change its meaning.
- `ACCEPTED`, `UNCERTAIN` and `REJECTED` evidence remain distinct. Absence of
  accepted evidence is not automatically a confirmed negative.
- Tile visits are sample-based. Segment intersection is a separate Ride Finder
  fact and cannot establish a tile visit.
- The contracts below describe information and access patterns, not table names,
  API shapes, storage engines or deployment choices.
- Current Platform `activity_id` is not assumed to be the final stable canonical
  key. Every product depends on the canonical identity decision.

## Shared logical envelope

Every versioned product needs enough common information to identify:

- product name and product/build version;
- generated/effective time and source cutoff;
- canonical subject/owner scope;
- qualification-policy version and fingerprint where GPS evidence contributes;
- geographic-reference dataset and version where boundaries contribute;
- algorithm/classification version;
- dependency/build lineage and invalidation status;
- completeness or partial-result state.

Exact encoding is undecided.

## Product summary

| Logical product | Primary capabilities | Typical access |
| --- | --- | --- |
| Activity geography manifest | Activity navigation, route selection, historical ordering | Ordered activity pages/ranges; lookup by canonical activity |
| Lifetime tile summary | Initial Explorer tile map, classification and fit-all | One compact lifetime snapshot; optionally viewport/tile chunks |
| Tile visit history and provenance | Tile inspection, first/last visit, backfill transparency | Point lookup by tile; paginated history |
| Historical exploration checkpoints | Through Time playback, milestones and aligned charts | Date/activity range and milestone lookup |
| Qualified route evidence | Selected complete route, heatmap input provenance | On-demand by authorised canonical activity |
| Coverage heatmap product | Coverage-first heatmap with distinct-activity weighting | Viewport/zoom chunks plus weighting metadata |
| Country/region geography product | Visited map, discoveries and distance shading | Compact snapshot plus historical milestone/range queries |
| Ride Finder evidence service/product | Starts, ends, traverses and three-valued negation | Bounded spatial predicate query, then activity/route lookup |
| Geographic reference manifest | Version transparency and reproducibility | Small metadata lookup; controlled geometry delivery as needed |

## 1. Activity geography manifest

**Purpose:** Supply the canonical activity order and geography-change metadata
used by activity navigation, historical checkpoints and selected-route lookup.

**Owner:** Cycling Platform.

**Essential information:** Canonical activity key; source provenance references;
start/end time semantics; deterministic historical order/tie-break; activity
type; GPS availability; geography-evidence state; geography-change indicators;
first/last qualified sample time where known; route-product version; supersession
or invalidation state.

**Expected volume and access:** One row/object per activity. Ordered pagination,
date ranges and direct lookup. Small relative to sample evidence.

**Update/invalidation:** Append for new activities; ordered-history invalidation
from an inserted/backfilled activity; update when canonical identity,
qualification or source evidence changes.

**Identity dependency:** Defines the stable activity key referenced by every
other contract. Current source IDs require migration/mapping rather than becoming
the permanent Explorer identity by accident.

**Outstanding decisions:** Canonical key; event-time and tie semantics; virtual
activity policy; what constitutes “no geographic change”; backfill visibility.

## 2. Lifetime tile summary

**Purpose:** Render lifetime visited tiles, largest cluster, other clusters,
visited-outside-cluster classification, maximum-square outline and fit-all
bounds without delivering raw routes.

**Owner:** Cycling Platform for tile facts/classification; Explorer for styling
and display priority.

**Essential information:** Fixed grid/version; tile `(z, x, y)` reference;
classification; first/last recorded qualified visit time/activity reference;
distinct activity count; uncertain-evidence indicator/count; cluster identity
and largest-cluster flag; maximum-square outline reference; explored bounds;
product/policy/classification versions.

**Expected volume and access:** One compact record per visited tile plus one
snapshot summary. Likely thousands to tens of thousands for a single rider, but
actual counts must be supplied without coordinates. Full snapshot may be viable;
viewport or vector-tile partitioning remains an option after measurement.

**Update/invalidation:** Append/update after qualified new visits. Rebuild from
earliest affected history for backfills; full versioned rebuild when policy or
classification changes can remove evidence.

**Identity dependency:** First/last activity and counts use canonical activity
keys.

**Outstanding decisions:** VeloViewer boundary/cluster fixtures; tie handling for
multiple maximum squares; delivery chunking; representation of uncertain-only
unvisited tiles.

## 3. Tile visit history and provenance

**Purpose:** Support visited and unvisited tile inspection, visit history,
uncertain evidence and auditable first/last visits.

**Owner:** Cycling Platform.

**Essential information:** Tile reference; classification at requested snapshot;
canonical activity key; qualifying sample index/key; derived absolute observation
time; visit ordinal or event order; evidence decision; reason/provenance
references; policy version; source resolution/full-resolution evidence; first/
last flags derived for the selected version. For unvisited tiles, return a
positive empty/uncertain result rather than fabricate a visit record.

**Expected volume and access:** Potentially many tile/activity events, but normally
point lookup for one inspected tile with paginated history. Do not load all sample
provenance into the initial map.

**Update/invalidation:** Append accepted visits; re-evaluate affected events on
backfill or policy change; preserve prior product versions for reproducibility.

**Identity dependency:** Every event references the canonical activity.

**Outstanding decisions:** Absolute sample-time derivation; sample evidence key;
provenance detail exposed to Explorer; retention of rejected evidence.

## 4. Historical exploration checkpoints

**Purpose:** Reconstruct classifications as of dates/activities and drive
calendar, activity, square-milestone and country-discovery navigation plus aligned
charts.

**Owner:** Cycling Platform for historical facts; Explorer for playback and
navigation behaviour.

**Essential information:** Checkpoint/event key; canonical activity key and event
time; prior/next checkpoint; changed tile references; cumulative visited count;
historical cluster membership or a versioned snapshot/delta reference; largest
cluster size; maximum-square side and outline; milestone events; cumulative
country discoveries; policy/reference/classification versions.

**Expected volume and access:** At most one primary checkpoint per activity, with
compact no-change references or omission plus manifest indication. Sequential
ranges, lookup by date/activity, and direct milestone access.

**Update/invalidation:** Append for ordinary new activities. Recompute from the
earliest affected activity after historical insertion. Publish a new complete
version after subtractive policy/reference changes.

**Identity dependency:** Canonical order and durable activity references are
fundamental.

**Outstanding decisions:** Snapshot versus delta cadence; random-seek performance;
tie ordering; classification algorithm; retention and compression strategy.

## 5. Qualified route evidence

**Purpose:** Display a selected complete route without artificial connections and
provide bounded provenance for inspection. It is also a governed input to other
Platform products, not a request for Explorer to calculate canonical geography.

**Owner:** Cycling Platform.

**Essential information:** Canonical activity key; ordered sample key/index;
latitude/longitude; derived observation time; observation qualification state and
reason reference; valid outgoing/incoming segment state or explicit break;
segment qualification/provenance; source resolution; policy version; route
completeness state.

**Expected volume and access:** Hundreds to tens of thousands of samples per
selected activity; exact distribution unknown. On-demand, authorised per-activity
retrieval, optionally chunked. Never part of a public static bundle.

**Update/invalidation:** Replace/version when source streams, qualification policy
or activity identity changes. Client cache must be private and version-aware.

**Identity dependency:** Direct canonical activity lookup and source mapping.

**Outstanding decisions:** Coordinate precision delivered to private clients;
absolute time; break encoding; cache retention; whether uncertain points are
shown and how.

## 6. Coverage heatmap product

**Purpose:** Render coverage-first geographic intensity based on distinct
activities with adjustable diminishing-return frequency weighting.

**Owner:** Cycling Platform for qualified coverage aggregates; Explorer for the
selected presentation weighting and layer composition. If weighting affects a
reused canonical aggregate, Platform should publish the raw distinct-activity
count rather than bake in an unaccepted formula.

**Essential information:** Spatial cell/line coverage reference at an agreed
resolution; distinct canonical activity count; coverage-present flag; optional
time range; qualification and aggregation versions; gaps/break exclusions;
source/reference lineage sufficient to audit the aggregate.

**Expected volume and access:** Potentially much larger than Explorer tiles.
Viewport/zoom partitioning or vector/raster tiles are likely candidates. Exact
volume depends on resolution and must be benchmarked.

**Update/invalidation:** Increment distinct-activity contributions for new routes;
rebuild affected partitions for source/policy changes; time-range products need
explicit cache keys.

**Identity dependency:** Deduplication counts canonical activities, not source IDs
or sample density.

**Outstanding decisions:** Coverage geometry/resolution; line versus cell
aggregation; safe client-adjustable weighting inputs; vector/raster delivery;
temporal filtering.

## 7. Country and region geography product

**Purpose:** Show visited/unvisited countries and regions, first visits,
cumulative discoveries, and optional allocated distance while preserving
uncertainty.

**Owner:** Cycling Platform.

**Essential information:** Stable geography ID/name/type; boundary dataset,
version and worldview; visited evidence state; first qualified sample/activity/
time; discovery order; qualified allocated distance; unallocated and uncertain
distance; contributing activity count; product/policy versions.

**Expected volume and access:** Small global/regional summary plus optional
boundary geometry appropriate to zoom. Lifetime snapshot and historical range/
milestone lookups.

**Update/invalidation:** New qualified visits/distances update summaries.
Boundary, policy or source changes require versioned reallocation and may change
first visits.

**Identity dependency:** First visits and distinct activity counts require
canonical activities.

**Outstanding decisions:** Dataset/licence/worldview; boundary-point rule;
maritime treatment; region scope; line/polygon allocation semantics; precision
and rounding.

## 8. Ride Finder evidence service/product

**Purpose:** Evaluate starts, ends and traverses against rectangle, polygon,
point/radius or Explorer-tile areas while retaining explicit true/false/unknown
semantics and complete matching routes.

**Owner:** Cycling Platform for evidence predicates and canonical result state;
Explorer for drawing areas, composing one predicate/negation, presenting results
and retaining the search area.

**Essential information:** Search request identity/normalised geometry reference;
predicate and negation; canonical activity key; qualified sample-presence result;
valid-segment-intersection result; combined predicate result in
`TRUE`/`FALSE`/`UNKNOWN`; determining evidence/provenance reference; policy and
reference versions; activity summary; route lookup reference.

**Expected volume and access:** Interactive bounded spatial queries returning
paginated activity matches and counts. Complete routes load separately on demand.
Spatial indexing/partitioning is likely needed, but no database is selected.

**Update/invalidation:** Results are versioned/query-time views and invalidate
when activity evidence, qualification policy or relevant reference geometry
changes. Negation must be evaluated using three-valued logic, not by subtracting
positive matches from all activities.

**Identity dependency:** Search universe and results require canonical activity
identity and explicit GPS-availability state.

**Outstanding decisions:** Exact starts/ends window; point/radius distance model;
sample-versus-segment predicate rules for each operation; query limits; polygon
complexity; privacy/audit controls; whether reusable results are materialised.

## 9. Geographic reference manifest

**Purpose:** Make tile geometry and country/region results reproducible and expose
licence/attribution requirements without forcing Explorer to own reference data.

**Owner:** Cycling Platform Geographic Reference.

**Essential information:** Dataset ID/version/release date; source and licence;
attribution/redistribution obligations; worldview/dispute policy; CRS; geometry
precision/generalisation; effective dates; checksum; supersession; supported
geography types; known limitations.

**Expected volume and access:** Small metadata manifest. Actual geometry can be a
separate versioned product appropriate to the view and licence.

**Update/invalidation:** New reference releases create new versions; dependent
products declare the exact version and are not silently mutated.

**Identity dependency:** Geography identity is separate from activity identity,
but allocations link both.

**Outstanding decisions:** Source selection; identifier crosswalks; retention;
licence review; disputed-boundary and boundary-point policies.

## Cross-contract invalidation matrix

| Change | Minimum affected products |
| --- | --- |
| New activity appended | Manifest, lifetime tiles/history, historical checkpoints, heatmap, country/region, Ride Finder index |
| Historical activity backfill | Same products from earliest affected event; first visits/milestones can change |
| Activity identity remap | Every activity-referencing product and cache key |
| Observation qualification change | Tiles/history/checkpoints, routes, heatmap, countries and Ride Finder |
| Segment qualification change | Routes, heatmap where segment geometry contributes, cross-border distance and Ride Finder intersections |
| Tile algorithm change | Lifetime tiles and historical checkpoints; compatibility version changes |
| Boundary dataset/policy change | Country/region product, cross-border allocation and reference manifest |
| Source stream correction | Route and every downstream product depending on affected evidence |

## Decisions required before physical design

1. Canonical activity identity and migration contract.
2. Versioned observation/segment qualification publication policy.
3. VeloViewer compatibility fixtures and intentional-deviation policy.
4. Country/region source, licence, worldview and boundary policy.
5. Non-sensitive volume/cardinality evidence and latency objectives.
6. Authentication boundary and cache/retention policy for private routes.
7. Snapshot/delta strategy for historical random access.
8. Query semantics and resource limits for Ride Finder.

Only after those decisions should a physical schema, API style, database,
serialization or hosting design be proposed.

## Synthetic contract evidence

[Slice 2 fixtures](../fixtures/README.md) provide portable synthetic inputs and
authored expected results for future contract tests. They do not implement or
accept a physical interface. Platform adapters should explicitly agree provisional
conventions, preserve partial/unknown results and compare independently computed
results; Explorer tests may inject expected snapshots solely for presentation.
