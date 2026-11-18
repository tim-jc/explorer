# Slice 3 — G3A dependency reconciliation

**Date:** 18 November 2026. **Status:** Accepted by the owner on 18 November 2026.
This bounded documentation reconciliation is complete. The wider Explorer Slice 3
Platform geographic foundation is **partially delivered**, not complete.

## Baselines and evidence

| Repository | Verified committed HEAD | Initial state / tracking |
| --- | --- | --- |
| Explorer | `f93beddc07a0d2b6378a596cc1b2a9ac7f4b55ca` | Clean `main`; required revision is HEAD; zero ahead/behind cached `origin/main` |
| Cycling Platform | `05dcbbe2c5d5c433216ecaa9cf8897f0fcb308b9` | Clean `main`; zero ahead/behind cached `origin/main`; kept read-only |

Both remotes point to their expected `tim-jc` GitHub repositories. Fresh
`git ls-remote` checks failed to resolve github.com; live remote equality is not
claimed. No baseline conflict prevents reliable local reconciliation.

**Slice 2 acceptance:** The owner confirmed acceptance on 17 November 2026,
resolving the discrepancy between the original Explorer lifecycle record and the
Platform reference to accepted fixtures.

Inspected all six authoritative files at the clean Platform commit:

- `R/geography/explorer_tile_geometry.R`;
- `R/geography/geographic_tile_evidence.R`;
- `docs/geographic_calculation_foundation.md`;
- `docs/proposals/geographic_data_contracts.md`;
- `docs/reviews/geographic-calculation-foundation-g3a-001.md`;
- `tests/testthat/test-geographic-calculation-foundation.R`.

The foundation and review formally record **G3A Accepted on 17 November 2026**.
The review documents two blockers/four related defects and six remediations,
all included in formal acceptance. Code/tests evidence the corresponding
independent observation statuses, coherent policy handling, evidence validation,
identifier bounds, replacement argument checks and fixture pinning. This is not
a new independent review of the full Platform implementation.

Identity deployment and successful overnight deep validation are accepted as
owner-reported in this handoff. Platform's committed review/backlog still retain
the older commission-time pending-overnight wording and separate exact MariaDB
and named-account restore gates. No production revalidation or sibling edit was
performed; those separate verification gates are not silently closed here.

## Established consumer meanings

| Concern | Reconciled requirement |
| --- | --- |
| Geometry | Zoom-14 Web Mercator; canonical `z/x/y`; conversion, bounds and projected geographic centres implemented; numeric edge conventions still provisional |
| Tile evidence | Independent coordinate validity, accepted observation qualification and full-resolution eligibility; geographically in-tile observation required; preserve derived tile eligibility separately |
| Non-evidence | No segment, interpolation, corner clipping, reduced-resolution, rejected or uncertain observation can establish visits; accepted stationary samples can; absence of evidence is not physical absence |
| Identity/counts | Permanent exact signed-BIGINT `activity_key`; no JavaScript Number/lossy float conversion; unique activity/tile relationships and distinct canonical activity counts; transport format unselected |
| Chronology | Unknown stays unknown; incomplete chronology permits only first/last **known** extrema; exact-key tie order is deterministic, not a time ordering or square/cluster tie policy |
| Correction | Whole-activity replacement/withdrawal may remove visits, lower lifetime counts and change known chronology; replacement aggregation must equal full reconstruction |
| Policy | One coherent qualification-policy population; no mixed-policy aggregation or silent continuity across incompatible versions |

The contracts now distinguish accepted logical meanings and supplied G3A inputs
from future authoritative evidence and physical publication. Zero-based fixture
indexes and one-based current Silver indexes must not become interchangeable;
G3A preserves supplied indexes but does not establish durable sample identity.
G3A R input forms and explanatory comma-separated references do not select a
production serialisation or sample-reference encoding.

## Fixture verification and scope

Pin: Explorer `f93beddc07a0d2b6378a596cc1b2a9ac7f4b55ca`, format **1**.
SHA-256 values independently recomputed and matched to the committed Platform
foundation and test constants:

| Fixture | SHA-256 |
| --- | --- |
| `tile_geometry.json` | `f11fd577cbcdd938ed325c120d1c7e416e2ff1b0a78aae56e61147519cf187b6` |
| `tile_evidence.json` | `4627340c8c6466933a0b9c167e664dfc12ab9c59e2f12ccd622b49bd6a6bd87f` |
| `history.json` | `3c4c2f6625ccb4b2163414de3ae0d1ff2d346cda5332dcc39f41762eea25b485` |

Committed test scope confirms coordinate conversion/error expectations,
independent bounds/centres, all **nine** tile-evidence cases, and the
`ordered-growth` history checkpoint counts and origin visit chronology.
Mandatory segment-only regression leaves target `14/8192/8192` absent while the
endpoint tiles `14/8191/8192` and `14/8193/8192` qualify. Segment intersection flags,
maximum-square/cluster fields and the other history scenarios are not asserted
as direct fixture conformance. Independent Platform tests separately exercise
replacement/withdrawal/correction; do not describe this as full historical fixture
or classification conformance.

Validation performed:

```sh
python3 -m unittest discover -s tests -v
shasum -a 256 fixtures/tile_geometry.json fixtures/tile_evidence.json fixtures/history.json
git diff --check
```

Explorer: **27 tests passed**, including positive validation of all 96 cases and
26 malformed-fixture mutation tests. Pinned hashes match; `git diff --check` and changed-document local link checks
pass. All fixture files remain
byte-for-byte identical to Explorer HEAD; no tooling or fixture edits were made.

Additionally ran only the pure focused Platform test file with `Rscript --vanilla`
and `testthat::test_file("tests/testthat/test-geographic-calculation-foundation.R")`
from the Platform directory. It completed **17 test blocks / 134 passing
expectations**, zero failures/errors/skips, including actual pinned conformance.
The handoff's “134 tests” is therefore confirmed more precisely as 134
expectations, not 134 separate test blocks. No full legacy suite or database tests
were run, and Platform remained unchanged.

Platform conformance checks exact Explorer **checkout HEAD**, format and hashes.
A later documentation-only Explorer commit changes HEAD and will fail that exact
revision check even with unchanged fixture bytes. Future runs should use a
separate read-only checkout of the recorded pin, or an explicitly coordinated
Platform pin update; a missing checkout skips conformance and is not a pass.
Future fixture amendments require coordinated revision/hash/format updates and
consumer conformance review, never silent replacement. No Platform change or
checkout reset is performed in this task.

## Compatibility limitations and remaining dependencies

The [register](compatibility-register.md) retains empirical VeloViewer validation,
maximum-square/cluster membership, historical classifications/ties, antimeridian
aliasing, southern Mercator limit and floating-point boundary ownership as open.
G3A snapping uses `<= 1e-9` projected units; the Slice 2 audit uses `< 1e-9`.
Existing pinned cases pass but do not test equivalence exactly at the threshold.
No convention or fixture was changed to hide this distinction.

VeloViewer remains canonical, Squadrats secondary; intentional sample-only
visitation is unchanged. Synthetic conformance is not empirical VeloViewer
compatibility. No external account, private route or new provider research was used.

| Platform work package | Position |
| --- | --- |
| G3A — Geographic calculation foundation | Accepted; calculation dependency satisfied |
| G3B — GPS evidence consolidation | Next; committed G3A documents retain its prerequisites |
| G3C — Canonical geographic evidence contracts | Outstanding |
| G3D — Lifetime coverage and incremental invalidation | Outstanding |
| G3E — Persistence, controlled backfill and consumer delivery | Outstanding |

G3B–G3E sequencing is recorded from the owner handoff; no later implementation
is inferred. Production qualification, durable stream/sample identity,
authoritative UTC chronology, persistent evidence/geographic products,
incremental invalidation, physical interfaces/publication and production
volume/runtime evidence remain Platform dependencies. Reference geography and
broader classification products are also outstanding.

## Slice 4 readiness and completion

The owner accepted the reconciliation and commissioned Slice 4 with synthetic or
fixture-backed data on 18 November 2026. Full Slice 3 remains partially delivered
pending G3B–G3E.

The roadmap preserves numbering and prepares Slice 4 for a MapLibre GL JS versus
Leaflet Canvas comparison using identical deterministic workloads, tile overlays
and inspection, measured responsiveness, desktop/mobile considerations and
privacy/licensing/provider evidence. It retains Cycling Analytics' deferred
detailed dark Best Efforts cartography dependency. No prototype, provider
investigation, framework/library selection or Analytics modification began.

The reconciliation updated the README, roadmap, architecture, proposed data
contracts, compatibility register and this report. Closure also records the
owner's decision in the Slice 2 report. Platform and the fixture bytes stayed
unchanged.
