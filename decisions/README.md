# Decision Records

This directory is the durable home for material Explorer architecture and
governance decisions. The [product specification](../docs/product-specification.md)
records accepted product behaviour; the [roadmap](../docs/roadmap.md) records
delivery position. Decision records explain consequential technical choices
without presenting research questions as commitments.

- [0001 — Explorer map renderer](0001-map-renderer.md)
- [0002 — Explorer application stack](0002-application-stack.md)
- [0003 — Explorer basemap strategy](0003-basemap-strategy.md)

## When to add a record

Add a decision record when a material choice affects canonical ownership, a
Platform product boundary, privacy or authentication posture, compatibility,
reproducibility, deployment responsibility or a difficult-to-reverse technical
direction. Minor implementation detail belongs in normal repository history or
task records.

## Convention

Use sequential names such as `0001-short-title.md` and include:

- status and date;
- context and decision owner;
- evidence and constraints;
- options considered;
- decision;
- consequences, risks and follow-up evidence;
- links to affected specification, roadmap or architecture sections.

Use lifecycle-accurate status language such as **Proposed** or **Accepted**.
Codex may draft a record, but only the designated owner can accept a decision.
