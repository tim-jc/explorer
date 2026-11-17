# Slice 2 completion report

**Date:** 17 November 2026. **Lifecycle:** Awaiting acceptance.
Implementation, automated verification and self-review complete; no owner
acceptance, commit, push, deployment or subsequent-slice work implied.

## Reconciled baseline

- Repository: `/Users/tim/Documents/Cycling/explorer`.
- Branch: `main`; starting and finishing HEAD:
  `df97cf4c0bb7469b35b5ec35779d49b1a0f41c7f`.
- Commit subject: `docs: accept Explorer feasibility and data contracts`.
- Working tree initially clean; HEAD and cached `origin/main` have zero commits
  ahead/behind. Remote is `https://github.com/tim-jc/explorer.git`.
- Accepted specification, architecture, roadmap, feasibility assessment and
  proposed logical contracts confirm Slice 1 acceptance and Slice 2 as next.
  No material conflict with the handoff or unexpected edits found.
- A fresh `git ls-remote origin refs/heads/main` failed because shell access could
  not resolve github.com. Live remote equality is **not independently reverified**;
  the clean cached tracking baseline and owner handoff were sufficient to proceed.
- Roadmap moved through In progress after reconciliation and now Awaiting
  acceptance. Subsequent slices remain uncommissioned.

## Files created and modified

Created:

- `.gitignore` — Python cache exclusions only.
- `fixtures/README.md` — format, semantics, numeric assumptions, commands,
  inspection certificates, reuse and validation limits.
- `fixtures/tile_geometry.json`, `fixtures/tile_evidence.json`,
  `fixtures/arrangements.json`, `fixtures/history.json`, `fixtures/coverage.json`,
  `fixtures/countries.json`, `fixtures/ride_finder.json`.
- `scripts/validate_fixtures.py` — offline structural and bounded expectation audit.
- `tests/test_fixture_validation.py` — positive collection and mutation tests.
- `docs/compatibility-register.md` — evidence categories and investigation queue.
- `docs/slice-2-report.md` — this report.

Modified: `README.md`, `docs/roadmap.md`, `docs/architecture.md`,
`docs/platform-data-contracts.md` — links, lifecycle, synthetic evidence boundary
and Analytics dependency. Accepted product semantics and Slice 1 conclusions are
preserved; there is no sibling-repository change.

## Fixture counts and representative outcomes

| Family | Cases | Partial cases | Representative expectation |
| --- | ---: | ---: | --- |
| Tile geometry | 36 | 0 | (0°,0°) → 14/8192/8192; east/south edges belong to neighbours under the stated fixture convention |
| Tile evidence | 9 | 0 | Two samples from one activity count once; two activities count twice; segment/corner-only crossing supplies no positive visit evidence |
| Arrangements | 12 | 12 | 2x2 square has side 2 and no generic interior; diagonal cells are two generic components; equal maximum squares retain all origins |
| Historical exploration | 4 | 2 | Five checkpoints count 1,1,2,5,10 tiles; backfill moves first visit; q2 rejection removes side-3 milestone; direct 1→3 has no side-2 milestone |
| GPS coverage | 7 | 3 | Sparse/dense/repeated sample versions each represent one activity; two activities represent two; invalid gaps never gain connections |
| Countries | 8 | 1 | Accepted samples establish visits independently of distance; no-sample transit allocates 4+4 toy units, keeps 4 unallocated and establishes no visits |
| Ride Finder | 20 | 8 | All predicates have true/false/unknown and negation; NOT unknown stays unknown; completeness and conditional predicate policies remain explicit |
| **Total** | **96** | **26** | Partial cases retain independent resolved fields and explain every unresolved classification |

The other 70 cases are resolved **under their stated basis**, which includes
provisional numeric conventions; none is labelled empirically VeloViewer verified.
The [fixture guide](../fixtures/README.md) explains every family and expected-result
vocabulary. Human-inspectable JSON is the durable source; no generated geographic
asset or production implementation generates these expectations.

## Automated verification

Environment: Python 3.9.6, standard library only. From repository root:

```sh
python3 scripts/validate_fixtures.py
python3 -m unittest discover -s tests -v
git diff --check
```

Results:

- Direct audit: **PASS, 96 cases across seven families**.
- Complete unittest suite: **27 passed** — one positive collection test and
  **26 negative mutation tests**, each correctly rejected malformed input.
- Diff whitespace check: **PASS**.
- Self-review checked fixture assumptions, source/expected separation,
  all tied-square origins, historical version scope, unresolved outcomes,
  lifecycle wording, new local documentation links and the final change list.
  Review corrected an intermediate roadmap phrase that could imply acceptance.

Negative tests cover duplicate case/sample IDs; missing family/fields/provenance;
invalid qualification, timestamp, coordinate or tile; accepted missing coordinates;
non-synthetic identity; dangling segment/base-case references; unexplained partial
results; fabricated square size or omitted tie; sample density used as activity
coverage; broken distance conservation; current-state counts in past checkpoints;
and both per-case and explicit-table unknown-negation errors.

**Limits:** this verifies fixture structure and selected independent mathematical
or semantic invariants. No production algorithm conformance test or empirical
VeloViewer comparison has run. It is not a general schema engine, polygon/query
engine, qualification policy, heatmap aggregate or credential scanner. Country
intersection and Ride Finder geometric outcomes remain small authored examples
with manual inspection certificates pending future independent adapters.

## Compatibility findings and implementation decisions

The [register](compatibility-register.md) separates documented external behaviour,
mathematics, empirical observations (none), unverified behaviour and intentional
Explorer differences. Public documentation was consulted without authenticated
access. The zoom-14 formulas and square geometry do not certify full VeloViewer
compatibility. Its overview's printed grid count appears transposed relative to
2^14; fixtures follow the accepted zoom-14 grid, not that printed count.

Choices made for this reversible fixture work:

1. JSON format 1, stable `family/id` keys and explicit case-level basis/status;
   no dependency on a specific application language or product schema.
2. Python standard-library audit and mutation tests, no third-party packages.
3. Float64 decimal inputs, explicit half-open ownership, +180 seam alias and
   north-included/south-excluded Mercator limits as **fixture conventions**;
   1e-9 projected tile-unit edge snap and 1e-12-degree inverse tolerance are
   audit assumptions, not canonical policy or GPS thresholds.
4. All maximum-square tie origins supplied, no tie winner selected. Generic
   four-neighbour components/interiors are labelled separately from VeloViewer
   cluster membership. All exact VeloViewer cluster counts remain unresolved.
5. Preassigned tile visit events for historical tests; no alternate canonical GPS
   calculation. Backfill and invalidation refer to explicit versioned base cases.
6. Linear toy-country fractions in supplied arbitrary units. No dataset, political
   worldview, distance algorithm or minimum country-visit distance selected.
7. Starts/ends and traverses examples conditional on supplied exact endpoint or
   segment-intersection semantics, with unresolved policy cases retained.

Accepted sample-only qualification is preserved even where VeloViewer's documented
segment-only ticking differs. No headline-statistic matching is attempted. The
owner's externally reported 42 × 42 remains unverified and absent from fixture
expectations. Squadrats remains secondary with no equivalence claim.

## Platform dependencies and follow-up questions

These do not block acceptance of the bounded fixture work, but do block promotion
of provisional cases into canonical conformance expectations:

- Establish stable canonical activity identity and absolute-time/event ordering.
- Publish approved versioned sample/segment qualification and full-resolution
  evidence. What explicitly proves route or endpoint completeness?
- Agree numeric ownership, seam/polar handling, precision and square tie output.
- Validate cluster membership, boundary expansion, narrow corridors, ties and
  historical rebuild semantics against suitable non-sensitive external evidence.
- Define starts/ends windows and traverses sample-versus-segment composition.
- Decide country boundary inclusion, reference governance and allocation uncertainty.
- Define product version retention and earliest affected invalidation after
  backfill or qualification changes. Supply non-sensitive volume assumptions for
  any later renderer investigation.

Platform can implement independent test adapters against agreed fields; Explorer
can inject expected snapshots to test presentation. Neither should import the
fixture audit as its canonical geography implementation.

## Cross-project dependency and final state

The roadmap records that **Cycling Analytics has deferred detailed dark Best
Efforts cartography until Explorer informs the wider map provider strategy**.
It is carried to Slice 4 map-rendering feasibility. Slice 2 investigated no
provider, selected no shared strategy and changed no Analytics files.

Final git state: `main` at the starting commit, four tracked documentation files
modified; `.gitignore`, two new documentation files, the fixtures, script and test
are untracked/uncommitted. Cached origin tracking remains zero ahead/behind.
The complete added/modified file list is above. Python cache output is ignored.

All operational constraints observed: no commits/pushes, deployment, production
access, owner routes/private activity data or credentials, sibling modifications,
production geographic products/algorithms, application/map/provider selection,
infrastructure change, or commencement of a subsequent slice. Only public source
reading, repository-local fixture/test/documentation work and temporary scratch
authoring were performed. Work stops here for owner review and acceptance.
