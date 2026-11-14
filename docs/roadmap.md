# Explorer Roadmap

> Keep this roadmap current, decision-oriented and readable in two to three
> minutes. The [product specification](product-specification.md) owns accepted
> product behaviour; this roadmap owns delivery position and next action.

**Last reviewed:** 2026-11-14

**Operational state:** Not applicable; no application exists

**Current delivery workstream:** Slice 1 — Technical feasibility investigation

**Workstream lifecycle state:** In progress

## Mission

Explorer provides a map-first geographic cycling exploration experience under
Past the Grid. It consumes trusted Cycling Platform geographic products and owns
their interactive presentation, not canonical activity or geographic answers.

## Current accepted state

- Agreed product-design baseline: [Explorer product specification v0.1](product-specification.md).
- Slice 0, Repository and product foundation: **Accepted on 14 November 2026**.
- Slice 0 is documentation-only and has no deployment state.
- Slice 1, Technical feasibility investigation: **In progress**.
- Application delivery state: **Designed; no implementation**.
- The intended Platform/Explorer responsibility boundary is documented in
  [Architecture](architecture.md).
- No application, interface contract, technology selection, deployment or
  production state is claimed.
- Evidence: the owner reviewed the corrected Slice 0 report and authorised its
  acceptance, initial commit and commencement of Slice 1 on 14 November 2026.

## Target state

The immediate target is completion of the bounded Slice 1 technical feasibility
investigation. It will produce evidence and provisional recommendations without
committing application implementation or preselecting a technology stack.

## Delivery phases and milestones

| Phase / milestone | Outcome | State | Acceptance evidence |
| --- | --- | --- | --- |
| 0. Repository and product foundation | Durable v0.1 specification, roadmap, architecture boundary and decision convention | Accepted (14 November 2026) | Owner reviewed the corrected Slice 0 report and authorised acceptance and the initial commit |
| 1. Technical feasibility and architecture investigation | Evidence-backed answers and recommendations for the research questions below; no application implementation | In progress | Reviewed investigation report, representative feasibility evidence, identified contracts and recorded owner decisions; no unsupported implementation commitment |
| 2. First implementation slice | Not yet defined or committed | Proposed | To be defined only after Phase 1 findings and owner direction |

## Active work

**Current bounded item:** Complete the bounded Slice 1 technical feasibility
investigation.

**Position:** Slice 0 is accepted. Slice 1 investigation is authorised and in
progress. No application implementation, feasibility conclusion or technology
selection exists yet.

**Evidence needed for acceptance:** A reviewed Slice 1 assessment that answers or
explicitly bounds each research area; cites representative compatibility,
data-quality, rendering and privacy evidence; identifies required Platform data
products; separates findings from recommendations; and records unresolved owner
decisions.

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

No current blocker prevents the investigation from being scoped. Access to
private evidence or production systems is not authorised by this roadmap.

## Deferred work

- Frontend framework, map library, database and deployment selections are
  deferred until investigation evidence exists.
- Application implementation is uncommitted.
- Squadrats-specific compatibility beyond its secondary role is deferred until
  the canonical VeloViewer target is understood.
- Within-tile route coverage, combined `AND` predicates and deep links are agreed
  deferred capabilities, not commitments for Slice 0 or Phase 1.

## Next action

**Complete the bounded Slice 1 feasibility investigation and submit its
assessment, proposed Platform data contracts and implementation sequence for
owner review; this does not authorise application implementation.**

## Revision history

| Date | Change | Reason / evidence |
| --- | --- | --- |
| 2026-11-14 | Initial roadmap | Slice 0 transfer of the agreed Explorer v0.1 design into its owning repository |
| 2026-11-14 | Corrected acceptance candidate | Restored agreed v0.1 requirements identified by independent review and made owner acceptance the immediate next action |
| 2026-11-14 | Slice 0 accepted; Slice 1 started | Owner accepted the corrected Slice 0 report, authorised the initial commit and commenced the bounded feasibility investigation |
