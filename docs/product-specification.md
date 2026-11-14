# Explorer Product Specification v0.1

**Status:** Accepted design baseline

**Implementation state:** Designed; no implementation

**Product family:** Past the Grid

## Product intent

Explorer is a standalone geographic cycling exploration application. Its
guiding principle is:

> Explorer is a map with analytical capabilities, not an analytics dashboard
> containing maps.

The map is the primary workspace. Analytical controls and detail views support
geographic exploration without displacing it.

## Evidence terms

- A **qualified GPS sample** is a full-resolution sample accepted under the
  applicable versioned data-quality policy.
- **Uncertain evidence** is evidence that cannot establish a positive or
  negative result under that policy. It is preserved where required for review,
  but does not establish a visit.
- A **qualified segment** is a track segment accepted for segment-based
  measurement or intersection under the applicable policy. Sample presence and
  valid segment intersection are distinct facts.
- Canonical activity identity, evidence qualification, geographic reference
  data and derived geographic classifications are supplied by Cycling Platform,
  as described in [Architecture](architecture.md).

## Explorer tiles

VeloViewer Explorer tiles and its maximum-square and cluster semantics are the
canonical external compatibility target. Squadrats compatibility is secondary.

- A tile is visited only when a qualified, full-resolution GPS sample falls
  inside it.
- A segment-only crossing does not establish a tile visit.
- Rejected or uncertain evidence does not establish a visit.
- Tile provenance is traceable to the canonical activity, sample, sample time
  and evidence-policy version.
- Both visited and unvisited tiles can be inspected. Inspection includes the
  tile reference, geographic coordinates, classification, first recorded visit,
  last visit, activity count, visit history and uncertain evidence.
- Tile references and geographic coordinates can be converted in both
  directions, and the tile-centre coordinates can be copied.
- The unvisited grid is visible only at a sufficiently close zoom to avoid
  obscuring the map at broader scales.
- Tile classification and display priority is: largest cluster, other clusters,
  visited tiles outside clusters, then unvisited tiles.
- The maximum square is an independent geometric outline rather than another
  tile classification.
- A tile's first recorded visit can change when historical activities or GPS
  evidence are backfilled.
- Selecting an activity displays its complete route.

## Exploration Through Time

Explorer reconstructs geographic achievements as they stood at historical dates
and after historical activities.

- Navigation supports calendar dates, activities, maximum-square milestones and
  country discoveries.
- Activity navigation can optionally skip activities that produce no geographic
  change.
- Maximum-square milestone navigation includes only sizes actually attained.
- Navigating to a maximum-square milestone frames the relevant square.
- Historical cluster and square membership comes from the classification
  applicable at that point in history; it is not inferred from today's
  classification.
- The camera position is preserved by default. The user may optionally follow
  newly explored territory. Manual panning suspends automatic following until
  the user explicitly resumes it.
- Playback speed is independent of the selected navigation resolution, and
  playback can optionally pause at milestones.
- The currently externally reported maximum square is **42 × 42**. This value is
  explicitly unverified and is not acceptance evidence or a computed result.
- Aligned historical charts show visited-tile count, largest-cluster size and
  maximum-square side length.

## Heatmap

The heatmap prioritises geographic coverage over ride frequency. Roads ridden
once remain visible so repeated riding does not erase the coverage story.

- Coverage counts distinct activities rather than GPS sample density.
- Frequency weighting is adjustable and applies diminishing returns. Logarithmic
  weighting is a candidate for investigation, not a selected algorithm.
- Coverage dominates by default; frequency remains a secondary visual signal.
- Coverage uses qualified, full-resolution GPS evidence.
- Gaps and invalid track sections do not create artificial connections.
- The heatmap and Explorer tiles can be displayed independently or together.
  When combined, tile fills are translucent, the heatmap remains visible
  underneath, and tile boundaries and the maximum-square outline remain above.

## Countries and regions

- A country visit is established by qualified GPS sample evidence inside the
  applicable country boundary.
- Country qualification has no arbitrary minimum-distance threshold.
- Countries and regions default to a visited/unvisited presentation, with
  optional distance-based shading.
- Explorer presents first recorded visits and historical discoveries.
- Historical navigation shows cumulative country discoveries.
- Cross-border distance is allocated separately using qualified segments and
  geographic boundaries.
- Unallocated or uncertain distance evidence is preserved rather than forced
  into a country total.
- Geographic reference data is versioned so results remain reproducible.

## Ride Finder

- Search areas may be rectangles, polygons, point/radius areas or Explorer
  tiles.
- Predicates include starts, ends and traverses.
- Each predicate uses explicit **true**, **false** or **unknown** evidence
  semantics.
- Negation is available for starts, ends and traverses. It preserves **unknown**
  rather than turning unknown GPS evidence into a definite negative.
- Qualified sample presence and valid segment intersection are distinct evidence
  tests and are not treated as interchangeable.
- Results show matching activities and their complete routes while retaining
  the search area on the map.

## Map interaction

- The initial view shows lifetime Explorer tiles centred on the owner's home
  region in southwest London. No precise home coordinate is recorded here.
- On subsequent visits, Explorer restores the previous map position and zoom.
  The user can also reset to home and fit all explored territory.
- Desktop uses a side panel; mobile uses a bottom sheet.
- The map has priority over surrounding analytical controls.

## Privacy

- Detailed GPS tracks are private by default.
- Public outputs require deliberate selection and appropriate redaction.
- Public Past the Grid branding does not imply that route data is public.
- Presentation controls alone are not an access-control boundary; authenticated
  access and public-output controls remain investigation topics.

## Product boundary and non-commitments

Explorer consumes trusted Cycling Platform products rather than calculating
competing canonical answers. The responsibility boundary is defined in
[Architecture](architecture.md).

This specification does not select a frontend framework, database technology or
deployment architecture. It describes accepted product behaviour, not features
that currently exist. Research topics and delivery position are recorded in the
[Roadmap](roadmap.md).

The following agreed capabilities are deferred and are not implementation
commitments in this slice:

- within-tile route coverage;
- combined `AND` predicates in Ride Finder;
- deep links to reproducible views or selections.
