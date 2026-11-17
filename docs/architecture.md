# Explorer Architecture

**Status:** Intended responsibility boundary for the accepted v0.1 design

**Implementation state:** No implementation or interface contract

## Purpose

Explorer is intended to be a presentation and interaction consumer of trusted
geographic data products from Cycling Platform. The required geographic
products are future contracts to be investigated; this document does not claim
that those products or an Explorer-facing interface already exist. This follows
the portfolio conventions of one accountable canonical owner, separation of
data products from presentation, reproducible provenance and privacy by default.

```text
Source activity and GPS observations
                 |
                 v
Cycling Platform: canonical identity, qualification, reference data,
                  derived and historical geographic products
                 |
                 | trusted, versioned products and provenance
                 v
Explorer: map interaction, visualisation, search, playback and UI state
```

The arrow expresses intended responsibility and required future contracts, not
implemented products, an implemented interface, a schema, a runtime dependency
or a deployment commitment.

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
of these geographic products is not claimed. Their exact future contracts remain
to be investigated.

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
