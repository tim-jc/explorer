# VeloViewer compatibility register

**Reviewed:** 17 November 2026. **Target:** VeloViewer Explorer; Squadrats secondary.
**Status:** Evidence register, not compatibility certification or owner acceptance.

| Category | Evidence / expectation | Fixture or remaining question |
| --- | --- | --- |
| Documented external behaviour | VeloViewer's [overview](https://blog.veloviewer.com/veloviewer-explorer-overview/) identifies zoom-14 Web Mercator, an all-visited maximum square and a distinction between max connected and max cluster | `tile_geometry`, `arrangements`; the overview's printed grid count appears transposed; 2^14 is independently 16,384, not 16,348 |
| Documented external behaviour | The overview describes surrounded cluster tiles and three-wide connecting corridors | `cross-interior`, `one-wide-bridge`, `three-wide-corridor`; not a complete expansion/tie specification |
| Documented external behaviour | The [8 April 2024 update](https://blog.veloviewer.com/update-to-detailed-veloviewer-explorer-tile-ticking/) describes increased coordinate precision and segment-based corner ticking with restrictions | Do not import those restrictions as Explorer qualification thresholds; external behaviour can change |
| Independently established mathematics | [Slippy-map formulas](https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames) give 16,384 columns/rows at z14, with x eastward/y southward; bounds, projected centre and all-visited square certificates are independently auditable | `tile_geometry`, `arrangements`; cells have variable ground area |
| Empirically verified external behaviour | **None in Slice 2** | No authenticated account access or comparative output; synthetic mathematical correctness is not an empirical observation |
| Unverified external behaviour | Exact edge rounding, seam normalisation, polar-limit handling, square tie winner, complete cluster expansion/membership and historical reclassification | Fixture numeric convention and generic components must not be presented as verified VeloViewer behaviour |
| Intentional Explorer policy difference | Accepted full-resolution sample inside required; valid segment-only and corner-only crossings cannot tick tiles | `tile_evidence/segment-only`, `corner-only`; retain this rule even if headline totals differ |
| Accepted Explorer policy | Rejected/uncertain observations cannot establish visits; historical state uses that state's evidence and policy | Tile/country evidence and history fixtures; not an external qualification claim |
| Owner reference, externally unverified | Reported 42 × 42 maximum square | Kept only in the accepted specification; never a synthetic assertion or measured result |
| Secondary target | Squadrats | No per-tile or edge equivalence asserted; matching summary statistics would not prove it |

## Investigation queue

1. With later explicit authorisation, obtain non-sensitive observations of exact
   boundary/seam and cluster cases, recording product/date/input/output provenance.
   Do not use private routes or authenticated accounts under Slice 2 authority.
2. Resolve whether surrounded tiles alone form the counted cluster and how growth,
   corridors, edge members, multiple largest clusters and antimeridian adjacency
   are represented. Generic connected components remain separately labelled.
3. Agree a Platform numeric boundary policy before promoting fixture snapping,
   seam aliases or excluded southern edge to canonical behaviour.
4. Agree all-square tie output and historical event/timestamp ordering. Preserve
   all tied origins and versioned backfill/qualification invalidation meanwhile.
5. Resolve Ride Finder start/end windows, traverses composition and explicit
   evidence completeness; agree country boundary inclusion and allocation policy.

These are bounded follow-up questions, not permission to start a later slice.
Sources were read publicly on the review date. Public statements establish what
was documented; only independently recorded external outputs could establish
empirical compatibility. See [fixture semantics and validation limits](../fixtures/README.md).
