# Explorer Architecture

**Status:** Intended responsibility boundary for the accepted v0.1 design

**Implementation state:** No Explorer application or production delivery interface;
Platform G3A pure calculations accepted on 17 November 2026

## Purpose

Explorer is intended to be a presentation and interaction consumer of trusted
geographic data products from Cycling Platform. G3A now implements a pure
calculation foundation; persistent geographic products and an Explorer-facing
production delivery interface remain outstanding. This follows
the portfolio conventions of one accountable canonical owner, separation of
data products from presentation, reproducible provenance and privacy by default.

Source activity observations feed Platform-owned identity, qualification and
geographic calculations; trusted versioned products will feed Explorer's
presentation. This describes responsibility, not an implemented runtime interface,
physical schema or deployment commitment.

## Cycling Platform responsibilities

Cycling Platform owns:

- canonical activity identity;
- qualified GPS evidence, including sample and segment validity under versioned
  policies;
- Geographic Reference datasets and their versions;
- derived Gold geographic products;
- historical geographic classifications and their provenance.

Canonical results include the facts and classifications that consumers must
agree on: evidence qualification, visit evidence, historical tile membership,
cluster and maximum-square classifications, country evidence and geographic
distance allocations. Platform ownership is the intended boundary; availability
of these geographic products is not claimed. G3A logical geometry/evidence
meanings are established; production interfaces and broader classification
products remain to be delivered.

## Explorer responsibilities

Explorer owns:

- map interaction and presentation;
- layer selection and visualisation;
- the geographic search experience;
- historical navigation and playback;
- user-interface state, such as camera position, selected layers, selections and
  panel state.

Explorer may transform trusted products for presentation, but it does not
silently become a competing system of record. Reusable rules that determine
canonical geographic answers belong in Platform products; interaction-specific
formatting and view state remain in Explorer.

## Provenance and history

Platform products must make the evidence required by the
[product specification](product-specification.md) traceable and reproducible,
including activity identity, qualifying sample or segment, observation time,
policy version, reference-data version and historical classification context.
Explorer presents this provenance and uncertain evidence without upgrading it
to a definite result.

Tile visits use a strict sample-based rule: only a qualified, full-resolution
GPS sample inside a tile establishes a visit. A segment-only crossing never
establishes a tile visit. Ride Finder separately evaluates qualified sample
presence and valid-segment intersection according to the selected predicate;
one kind of evidence must not be substituted for the other, and an unknown
result remains unknown under negation.

Historical views consume classifications valid for the requested point in time.
Explorer must not reconstruct past cluster or square membership from current
classification alone.

## Privacy and access boundary

Detailed routes and coordinates are private by default. Explorer must consume
and present them only within an appropriate authenticated boundary. Any public
output requires deliberate selection, minimisation and redaction. Public Past
the Grid branding grants no permission to expose private geographic data.

The authentication model, public-output mechanism and data minimisation contract
are open investigation questions, not selected designs.

## Undecided technical design

This slice deliberately does not select:

- a frontend framework or browser-map library;
- a database or client-side storage technology;
- an API, file or streaming product interface;
- a deployment or hosting architecture;
- a concrete authentication technology.

Those choices require the feasibility work described in the
[Roadmap](roadmap.md) and should be recorded as decision records when evidence is
available.

## Synthetic evidence boundary

[Slice 2 fixtures](../fixtures/README.md) and their bounded offline audit are
test evidence only. Their mathematical checks and generic connectivity certificates
are not reusable production geographic products. Canonical algorithms and
qualification stay in Platform; Explorer may consume the expected snapshots to
test presentation without calculating competing answers.

## Accepted G3A meanings and consumer obligations

Reconciled on 18 November 2026 against Platform commit
`05dcbbe2c5d5c433216ecaa9cf8897f0fcb308b9`; see its
[accepted foundation](../../cycling-platform/docs/geographic_calculation_foundation.md)
and [logical contracts](../../cycling-platform/docs/proposals/geographic_data_contracts.md).

- Tile references are canonical `z/x/y` text on the zoom-14 Web Mercator grid.
  Bounds and geographic centres are implemented. Half-open boundaries, `1e-9`
  projected-unit snapping, +180/-180 aliasing and the excluded southern limit
  remain provisional conventions, not empirical VeloViewer compatibility.
- Valid coordinates, supplied accepted observation qualification and explicit
  full-resolution eligibility are separate requirements for positive tile
  evidence. Preserve `coordinate_status`, `qualification_status`,
  `full_resolution_eligible` and `tile_evidence_eligible` independently. Malformed
  rejected evidence remains both malformed and rejected. Accepted stationary
  samples can qualify; segment interpolation/corner clipping cannot.
- Permanent canonical `activity_key` is exact signed BIGINT identity. Consumers
  must preserve every digit across parsing, transport, state, lookup and display;
  never route it through a JavaScript Number (or another lossy floating-point
  representation). The production serialisation format remains unselected.
- One activity/tile relationship is unique; lifetime visitation counts distinct
  canonical activities, not observations or source IDs.
- Supplied unknown observation time stays unknown. Display known first/last
  extrema as **known** extrema when chronology is incomplete, not globally proven
  first/last visits. G3A breaks equal known-time ties by exact canonical key
  (smallest for first, largest for last); this does not establish temporal meaning
  for keys or solve historical checkpoint/square/cluster ordering.
- Whole-activity evidence replacement or withdrawal can remove a tile's sole
  qualifying observation population and change first/last known visits. Lifetime
  discovery counts need not increase monotonically across corrected builds.
  Replacement and full reconstruction from the same current evidence must agree.
- A lifetime calculation uses one coherent qualification-policy version. G3A
  rejects mixed populations even across different tiles. Explorer must not stitch
  incompatible versions together or assume uninterrupted historical continuity;
  show explicit version/completeness context and consume a coherent replacement
  product when available. Physical publication/invalidation is not implemented.

Canonical identity deployment and successful overnight deep validation are
owner-reported in the 18 November handoff; this reconciliation accessed no
production system. G3A consumes supplied qualification, representation identity
and timestamps; it does not make those production evidence sources authoritative.
Durable sample identity, GPS qualification, absolute chronology, persistence,
incremental invalidation, interfaces and volume/runtime evidence remain Platform
dependencies. See the [roadmap](roadmap.md) for G3B–G3E.

Explorer can use authored synthetic geographic products for a later consumer
prototype without implementing competing production algorithms, importing R
calculation functions into a browser, or inventing a physical Platform interface.
