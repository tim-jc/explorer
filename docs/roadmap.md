# Explorer Roadmap

The [product specification](product-specification.md) owns accepted behaviour;
this roadmap owns delivery position and next action.

**Last reconciled:** 20 November 2026
**Operational state:** No application or production geographic delivery
**Current bounded work:** None authorised following Slice 4 closure
**Reconciliation state:** Slice 4 accepted 20 November 2026. Wider Slice 3 partially delivered.

## Current baseline and target

Explorer is a map with analytical capabilities, not an analytics dashboard
containing maps. Platform owns canonical geographic answers; Explorer owns
interactive presentation and consumer behaviour.

Slices 0 and 1 are accepted. Slice 2 is committed at
`f93beddc07a0d2b6378a596cc1b2a9ac7f4b55ca`, with 96 synthetic cases accepted
by the owner on 17 November 2026.

Accepted Platform G3A is present at
`05dcbbe2c5d5c433216ecaa9cf8897f0fcb308b9`. Its pure calculation and logical
semantics satisfy the calculation dependency for independent synthetic Explorer
work. Canonical identity is established; deployment and successful overnight deep
validation are owner-reported in the 18 November handoff, not verified through
production access here. Production geography delivery remains outstanding.

**Slice 4 — Map-rendering feasibility and selection** was accepted by the owner
on 20 November 2026. MapLibre GL JS is the selected renderer. No subsequent
slice is authorised.
See the [Slice 3 report](slice-3-report.md), [consumer contracts](platform-data-contracts.md)
and [compatibility register](compatibility-register.md).

## Delivery milestones — numbering preserved

| Slice | Outcome | Position / acceptance evidence |
| --- | --- | --- |
| 0. Repository and product foundation | Durable specification and architecture boundary | Accepted 14 November 2026 |
| 1. Technical feasibility investigation | Feasibility and proposed logical contracts | Accepted 14 November 2026 |
| 2. Compatibility and evidence fixtures | Deterministic synthetic evidence and offline audits | Accepted 17 November 2026 |
| 3. Platform geographic foundation | Identity, qualified evidence and minimum lifetime/provenance products | Partially delivered. G3A reconciliation accepted 18 November 2026. G3B–G3E outstanding. |
| 4. Map-rendering feasibility prototype | Compare renderers using identical synthetic workloads | Accepted 20 November 2026. MapLibre GL JS selected after remediation, comparative benchmarks and Safari visual acceptance. |
| 5. Lifetime map vertical slice | Consume authoritative lifetime tiles and inspection products | Designed; blocked on production geographic delivery and private access boundary |
| 6. Historical exploration | Navigation/playback over historical classification products | Designed; checkpoints, square/cluster semantics and invalidation outstanding |
| 7. Coverage and countries | Coverage-first and country presentation | Designed; qualification, aggregation and reference governance outstanding |
| 8. Ride Finder | Starts/ends/traverses with three-valued evidence | Designed; completeness, predicate and spatial evidence contracts outstanding |

## Platform dependency position

The following G3B–G3E work-package sequence is supplied by the 18 November
handoff. G3A acceptance and the G3B prerequisite boundary are confirmed in the
committed Platform foundation/review; no later implementation is inferred.

| Work package | Position |
| --- | --- |
| G3A — Geographic calculation foundation | Accepted 17 November 2026; geometry, sample-only evidence, distinct-activity visitation and replacement/reconstruction semantics |
| G3B — GPS evidence consolidation | Next Platform work package; not delivered |
| G3C — Canonical geographic evidence contracts | Outstanding |
| G3D — Lifetime coverage and incremental invalidation | Outstanding |
| G3E — Persistence, controlled backfill and consumer delivery | Outstanding |

Remaining prerequisites for authoritative data include production GPS
qualification, durable stream/representation/sample identity, authoritative
absolute UTC observation chronology, coherent qualification-policy publication,
persistent evidence/products, incremental invalidation, physical interfaces and
production volume/runtime evidence. Sample index bases and unknown chronology
must be respected. G3A's whole-activity replacement function is not an incremental
engine or publication service. Reference geography, heatmaps, countries, Ride
Finder, maximum squares/clusters and historical classification are not G3A outputs.

## Commissioned Slice 4 scope

- Compare **MapLibre GL JS and Leaflet Canvas** with identical deterministic,
  authored synthetic or fixture-backed workloads. No production API or raw owner
  routes; no competing canonical calculations. Use existing expected products
  and clearly label unresolved square/cluster fields.
- Define explicit lower/typical/upper synthetic scale assumptions. Unknown real
  production volumes do not block synthetic comparison, but prevent claims of
  validated production capacity.
- Measure payload/parse time, initial render, pan/zoom responsiveness, frame time,
  memory, layer toggling, tile overlays and inspection interactions with the same
  workload and measurement method. Record environment and reproducibility.
- Include desktop/mobile interaction and layout constraints, touch inspection,
  accessibility and device limits. Distinguish actual device measurements from
  desktop viewport simulation; representative mobile hardware remains to be agreed.
- Investigate privacy, request/data leakage, attribution/licensing, provider terms
  and detailed dark cartography suitable for short routes. Identify provider
  considerations as evidence for a later decision, not an automatic selection.
- Carry the **Cycling Analytics detailed dark Best Efforts cartography** dependency:
  Analytics deferred improvements until Explorer informs the wider map provider
  strategy. Evaluate relevance in the prototype without modifying Analytics or
  assuming one renderer/provider must serve both products.

The later prototype should produce a comparison and owner decision evidence,
not select an application framework or quietly adopt a production map stack.
No provider investigation, benchmark, application build or new synthetic assets
were started during this reconciliation.

## Risks and unresolved questions

- G3A synthetic conformance is not empirical VeloViewer compatibility. Keep
  VeloViewer canonical and Squadrats secondary; retain sample-only visitation.
- Numerical half-open/snapping, antimeridian and southern-limit conventions are
  provisional; the exact snap-threshold distinction is documented in the register.
- Maximum-square/cluster membership, historical classifications and their ties
  remain open; known-visit key tie ordering solves only G3A extrema determinism.
- Preserve exact BIGINT activity identity across browser consumers without a
  JavaScript Number conversion; production serialisation remains undecided.
- Unknown chronology stays unknown; correction can reduce lifetime counts and
  remove visited tiles. Products must use coherent policies and version context;
  incompatible populations cannot be stitched into apparent continuous history.
- Authenticated delivery, route privacy, reference licensing/worldview and
  production capacity remain later prerequisites. A static public bundle is not
  permission to expose private routes.

## Next action and deferred work

Slice 4 is closed and the [MapLibre decision](../decisions/0001-map-renderer.md)
is accepted. Do not commence a subsequent Explorer slice without owner
authorisation. Full Slice 3 production delivery remains dependent on Platform
G3B–G3E.

Within-tile coverage, combined AND predicates, deep links and secondary
Squadrats-specific compatibility remain deferred as in the accepted baseline.

## Deferred interaction and cartography work

- Route cartography. Evaluate width, opacity, halo and zoom-dependent styling
  against real basemaps. The owner found that the prototype route obscured its
  underlying road.
- Grid visibility. Check grid contrast and legibility against real cartography.
- Mobile tile inspection. Implement the collapsible bottom sheet envisaged for
  the product. The experimental panel required scrolling on the owner's iPhone.
- Exploration Through Time. Investigate incremental updates and measure them
  against repeated whole-dataset replacement.
- Release cache invalidation. Define how application and geographic dataset
  releases invalidate browser caches. During final Safari verification both
  prototypes initially remained at “Loading map…” and recovered immediately
  after a reload from origin; caching is suspected but not established.

## Revision history

| Date | Change | Reason / evidence |
| --- | --- | --- |
| 2026-11-14 | Initial roadmap | Slice 0 transfer of the agreed Explorer v0.1 design into its owning repository |
| 2026-11-14 | Corrected acceptance candidate | Restored agreed v0.1 requirements identified by independent review and made owner acceptance the immediate next action |
| 2026-11-14 | Slice 0 accepted; Slice 1 started | Owner accepted the corrected Slice 0 report, authorised the initial commit and commenced the bounded feasibility investigation |
| 2026-11-14 | Slice 1 submitted for acceptance | Added feasibility assessment, proposed logical contracts and a dependency-aware implementation sequence; no implementation or technology selection |
| 2026-11-14 | Slice 1 accepted; Slice 2 next | Owner accepted the feasibility assessment and proposed contracts as-is; fixture work is next while Platform dependencies remain outstanding |
| 2026-11-17 | Slice 2 In progress → Awaiting acceptance | Owner-authorised synthetic fixtures and automated audit completed; cluster and predicate policy uncertainty retained; Analytics map-strategy dependency recorded |
| 2026-11-18 | G3A dependency reconciliation accepted and Slice 4 commissioned | Recorded Slice 2 acceptance and retained outstanding G3B–G3E dependencies |
| 2026-11-20 | Owner selected MapLibre GL JS | Recorded benchmark and device evidence. Synthetic evidence correction awaits owner verification. |
| 2026-11-20 | Slice 4 accepted and closed | Owner completed dependency, model, generation, smoke, full comparative and Safari visual verification after evidence remediation; MapLibre selection confirmed. |
