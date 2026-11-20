# Explorer

Explorer is a standalone, map-first geographic cycling exploration application
under the Past the Grid umbrella.

> Explorer is a map with analytical capabilities, not an analytics dashboard
> containing maps.

The agreed v0.1 product-design baseline is documented in the
[Explorer product specification v0.1](docs/product-specification.md). The owner
accepted the Slice 0 repository and product foundation on 14 November 2026.
The owner accepted Slice 1, the technical feasibility investigation, on 14
November 2026. The owner accepted Slice 2, Compatibility and Evidence Fixtures,
on 17 November 2026. The fixture work is committed at `f93bedd`.

Platform G3A is accepted and available at `05dcbbe`. The bounded Slice 3 dependency
reconciliation was **accepted on 18 November 2026**. Slice 3 remains partially
delivered pending G3B–G3E. Slice 4, Map-rendering Feasibility and Selection,
was **accepted on 20 November 2026**. MapLibre GL JS is the selected renderer.

## Repository documents

- [Product specification v0.1](docs/product-specification.md) — accepted product
  behaviour and evidence rules.
- [Roadmap](docs/roadmap.md) — current delivery position, dependencies, risks and
  next action.
- [Architecture](docs/architecture.md) — intended boundary between Cycling
  Platform and Explorer.
- [Slice 1 feasibility assessment](docs/feasibility-assessment.md) — evidence,
  options, risks and provisional technical direction.
- [Proposed Platform data contracts](docs/platform-data-contracts.md) — logical
  future products and ownership boundaries, not implemented interfaces.
- [Synthetic fixtures and validation](fixtures/README.md) — 96 inspectable cases
  across seven families; offline audit instructions and limitations.
- [Compatibility register](docs/compatibility-register.md) — documented, mathematical,
  unverified and intentional differences.
- [Slice 2 completion report](docs/slice-2-report.md) — baseline, verification and
  owner review notes.
- [Slice 3 reconciliation report](docs/slice-3-report.md) — accepted G3A meanings,
  pinned conformance, remaining production dependencies and Slice 4 readiness.
- [Decision records](decisions/README.md) — convention for future durable
  technical decisions.

## Status and scope

This repository contains design documentation, synthetic fixtures, offline
validation tooling and the experimental Slice 4 map prototypes for MapLibre GL JS
and Leaflet Canvas. The owner [selected MapLibre GL JS](decisions/0001-map-renderer.md)
for subsequent development and formally accepted Slice 4 on 20 November 2026.
The prototypes use synthetic inputs. Production geographic integration remains
pending.
Detailed GPS tracks are private by default. See the
[roadmap](docs/roadmap.md) for the current investigation and delivery state.

## Slice 4 experiment

See the [local startup and acceptance runbook](docs/slice-4-validation.md) and
[renderer feasibility report](docs/slice-4-report.md).
