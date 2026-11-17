# Explorer Roadmap

> Keep this roadmap current, decision-oriented and readable in two to three
> minutes. The [product specification](product-specification.md) owns accepted
> product behaviour; this roadmap owns delivery position and next action.

**Last reviewed:** 2026-11-17

**Operational state:** Not applicable; no application exists

**Current delivery workstream:** Slice 2 — Compatibility and Evidence Fixtures

**Workstream lifecycle state:** Awaiting acceptance

## Mission

Explorer provides a map-first geographic cycling exploration experience under
Past the Grid. It consumes trusted Cycling Platform geographic products and owns
their interactive presentation, not canonical activity or geographic answers.

## Current accepted state

- Agreed product-design baseline: [Explorer product specification v0.1](product-specification.md).
- Slice 0, Repository and product foundation: **Accepted on 14 November 2026**.
- Slice 0 is documentation-only and has no deployment state.
- Slice 1, Technical feasibility investigation: **Accepted on 14 November 2026**.
- Slice 2, Compatibility and Evidence Fixtures: **Awaiting acceptance; implemented and verified on 17 November 2026**.
- Application delivery state: **Designed; no implementation**.
- The intended Platform/Explorer responsibility boundary is documented in
  [Architecture](architecture.md).
- No application, interface contract, technology selection, deployment or
  production state is claimed.
- Evidence: the owner reviewed the corrected Slice 0 report and authorised its
  acceptance, initial commit and commencement of Slice 1 on 14 November 2026.

## Target state

The next bounded target is Slice 2, Compatibility and Evidence Fixtures. It will
establish deterministic, non-sensitive evidence for tile conversion, boundary
ownership, square and cluster semantics, and three-valued Ride Finder logic. It
does not implement the Explorer application or select a technology stack.

## Delivery phases and milestones

| Phase / milestone | Outcome | State | Acceptance evidence |
| --- | --- | --- | --- |
| 0. Repository and product foundation | Durable v0.1 specification, roadmap, architecture boundary and decision convention | Accepted (14 November 2026) | Owner reviewed the corrected Slice 0 report and authorised acceptance and the initial commit |
| 1. Technical feasibility and architecture investigation | Evidence-backed answers and recommendations in the [assessment](feasibility-assessment.md) and [proposed contracts](platform-data-contracts.md); no application implementation | Accepted (14 November 2026) | Owner accepted the assessment and proposed logical contracts as-is |
| 2. Compatibility and evidence fixtures | Establish zoom-14/square expectations and three-valued evidence; expose unresolved cluster and boundary compatibility using synthetic fixtures | Awaiting acceptance | 96 synthetic cases and offline audit/mutation tests; owner acceptance pending; intentional VeloViewer differences documented |
| 3. Platform geographic foundation | Platform supplies stable activity identity, versioned qualification and minimum lifetime tile/provenance products | Designed | Platform-owned contracts accepted and representative end-to-end evidence available |
| 4. Map rendering feasibility prototype | Compare shortlisted renderers against the same synthetic desktop/mobile workload without choosing an application framework | Designed | Recorded payload, parse, frame-time, interaction and memory results support an owner technology decision |
| 5. Lifetime map vertical slice | Private map-first lifetime tiles, classification, square outline and tile inspection using trusted Platform products | Designed | Independent viewport/inspection tests and privacy-boundary evidence; no duplicated canonical calculation |
| 6. Historical exploration | Activity/date/milestone navigation, playback and aligned charts over Platform historical checkpoints | Designed | Historical fixture replay, random-seek and backfill-invalidation evidence |
| 7. Coverage and countries | Coverage-first heatmap plus country/region discovery and allocation presentation | Designed | Qualified-gap, distinct-activity, boundary-version and uncertainty fixtures |
| 8. Ride Finder | Spatial searches with starts/ends/traverses and true/false/unknown negation | Designed | Predicate truth-table, sample/segment distinction, complete-route and privacy tests |

## Active work

**Current bounded item:** Slice 2 — Compatibility and Evidence Fixtures; Awaiting
acceptance. [Fixtures and validation](../fixtures/README.md), [compatibility register](compatibility-register.md)
and [completion report](slice-2-report.md) are available for owner review.

**Position:** Slices 0 and 1 are accepted. Slice 2 implementation and automated
verification are complete; owner review and acceptance remain pending. Canonical Platform
identity, qualification and geographic-product dependencies remain outstanding;
they block later canonical product slices but do not block Slice 2's synthetic,
non-sensitive fixture work. No application implementation or technology
selection has been authorised.

**Evidence needed for acceptance:** Portable deterministic tests and documented
fixtures cover zoom-14 conversion, numeric boundary ownership, maximum-square
cases, explicitly qualified cluster assumptions, and true/false/unknown
predicate semantics. Intentional differences from VeloViewer are traceable and
no private GPS evidence is included.

## Research questions

These are questions, not implementation commitments.

1. **VeloViewer compatibility:** What tile grid, coordinate-edge behaviour,
   maximum-square rules and cluster semantics are required for compatible
   results, and how can they be tested against representative known cases?
2. **GPS evidence and quality:** Which full-resolution sample and segment fields,
   gap rules, uncertainty states and policy versions must Platform expose?
3. **Historical computation:** How should Platform reproduce tile visits,
   clusters and maximum squares as of an activity or time without relying on
   present-day classification, and what milestone events should it publish?
4. **Geographic Reference data:** Which country/region boundary sources,
   licences, versions and boundary policies satisfy reproducibility and
   cross-border allocation needs?
5. **Data-product boundary:** Which Gold products and provenance fields should
   Platform provide, and through what candidate contract can Explorer consume
   them without duplicating canonical logic?
6. **Browser maps and performance:** Which rendering approaches can display
   lifetime tiles, complete selected routes, heatmaps, history and search areas
   at representative scale on desktop and mobile?
7. **Privacy and access:** What authenticated boundary, route-data minimisation,
   redaction and deliberate public-output controls are required?

## Dependencies

- **Cycling Platform:** Owner of canonical activity identity, qualified GPS
  evidence, Geographic Reference data, derived Gold geographic products and
  historical classifications. Required condition: candidate inputs, quality
  policies and product boundaries can be inspected without production access.
- **VeloViewer behaviour:** External compatibility target. Required condition:
  lawful, representative expected results or documented behaviour are available
  for comparison.
- **Geographic Reference sources:** Required condition: suitable boundary data
  can be evaluated for accuracy, licensing, versioning and reproducibility.
- **Representative private activity evidence:** Owner-controlled dependency.
  Required condition: any later use is explicitly authorised, minimised and kept
  out of repository documentation.
- **Cycling Analytics — detailed dark Best Efforts cartography:** Improvements
  are deferred until Explorer informs the wider map provider strategy. Carry this
  dependency into Slice 4 map-rendering feasibility; Slice 2 neither investigates
  providers nor selects a shared strategy or changes Analytics.
- **Owner decisions:** Required for accepting investigation recommendations and
  commissioning any implementation slice.

## Risks and blockers

- **Compatibility ambiguity:** Undocumented edge and classification rules could
  produce results that differ from VeloViewer. Resolve with explicit test cases
  and documented tolerances; owner decides acceptable compatibility.
- **Insufficient evidence quality:** Downsampled, gapped or ambiguous GPS data
  could overstate visits and distance. Resolve through versioned qualification
  rules and preserved uncertainty.
- **Historical cost and correctness:** Reclassification may be expensive or may
  accidentally use current state. Evaluate reproducible historical products and
  representative performance before committing an approach.
- **Reference-data change:** Boundary updates can change country and distance
  results. Preserve source/version provenance and define recomputation policy.
- **Boundary duplication:** Explorer-side canonical calculation could diverge
  from Platform. Treat an explicit Platform product contract as a prerequisite.
- **Browser performance:** Combined high-volume layers and complete routes may
  exceed mobile rendering budgets. Benchmark representative volumes before
  selecting a map stack.
- **Privacy exposure:** Detailed routes can reveal sensitive locations. Define
  authenticated access and public redaction requirements before implementation.

No blocker prevented the bounded read-only investigation. Canonical application
delivery is blocked on the Platform identity, qualification and geographic
product decisions described above. Access to private evidence or production
systems is not authorised by this roadmap.

## Deferred work

- Frontend framework, map library, database and deployment selections are
  deferred until investigation evidence exists.
- Application implementation is uncommitted.
- Squadrats-specific compatibility beyond its secondary role is deferred until
  the canonical VeloViewer target is understood.
- Within-tile route coverage, combined `AND` predicates and deep links are agreed
  deferred capabilities, not commitments for Slice 0 or Phase 1.
- Subsequent slices remain Designed and unauthorised until the owner explicitly
  commissions the relevant bounded slice. Slice 2 alone was commissioned on
  17 November 2026; acceptance remains pending.

## Proposed implementation sequence and dependency boundaries

1. **Compatibility and evidence fixtures — Explorer independent.** Implement no
   application UI. Establish tile conversion/boundary fixtures, synthetic square
   and cluster sets, and three-valued predicate truth tables. Owner-authorised
   VeloViewer observations are a cross-project/external dependency.
2. **Platform geographic foundation — blocked by Platform.** Stable canonical
   activity identity, approved observation/segment qualification, reference-data
   governance, lifetime tiles and provenance are prerequisites for canonical
   end-to-end results.
3. **Renderer prototype — Explorer independent after volume assumptions.** Use
   synthetic data to compare MapLibre GL JS and Leaflet, adding OpenLayers only
   if geometry/editing needs justify it. This prototype informs but does not make
   the technology choice.
4. **Lifetime map vertical slice — cross-project.** Consume trusted Platform
   lifetime tiles and tile-history products through an authenticated/private
   boundary. This is the first candidate product implementation, subject to
   separate authorisation.
5. **Historical exploration — blocked by Platform checkpoints.** Add navigation
   and playback only after versioned historical classification products exist.
6. **Coverage and countries — blocked by qualification and reference decisions.**
   Add heatmap and country presentation after aggregation and boundary contracts
   are accepted.
7. **Ride Finder — blocked by spatial evidence service.** Add last because it
   needs bounded geometry queries, explicit unknown semantics, segment validity
   and on-demand private route retrieval.

The [feasibility assessment](feasibility-assessment.md) contains the concise
Cycling Portfolio summary and separately lists actions for the Cycling Platform
— Geospatial conversation. No sibling repository change is implied.

## Next action

**Owner review and acceptance of Slice 2.** Implementation and automated
verification are complete. Leave the work uncommitted for review; do not commence
Slice 3, renderer investigation or any subsequent slice. Review the provisional
numeric conventions and unresolved cluster/completeness policies in the report.

## Revision history

| Date | Change | Reason / evidence |
| --- | --- | --- |
| 2026-11-14 | Initial roadmap | Slice 0 transfer of the agreed Explorer v0.1 design into its owning repository |
| 2026-11-14 | Corrected acceptance candidate | Restored agreed v0.1 requirements identified by independent review and made owner acceptance the immediate next action |
| 2026-11-14 | Slice 0 accepted; Slice 1 started | Owner accepted the corrected Slice 0 report, authorised the initial commit and commenced the bounded feasibility investigation |
| 2026-11-14 | Slice 1 submitted for acceptance | Added feasibility assessment, proposed logical contracts and a dependency-aware implementation sequence; no implementation or technology selection |
| 2026-11-14 | Slice 1 accepted; Slice 2 next | Owner accepted the feasibility assessment and proposed contracts as-is; fixture work is next while Platform dependencies remain outstanding |
| 2026-11-17 | Slice 2 In progress → Awaiting acceptance | Owner-authorised synthetic fixtures and automated audit completed; cluster and predicate policy uncertainty retained; Analytics map-strategy dependency recorded |
