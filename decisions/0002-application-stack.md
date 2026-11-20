# 0002 — Explorer application stack

**Status:** Approved by the owner, 20 November 2026.

Use TypeScript, Svelte 5, Vite, MapLibre GL JS, native CSS, Vitest and
Playwright for the permanent Explorer application. MapLibre follows
[decision 0001](0001-map-renderer.md). Svelte 5 and Vite provide the
browser UI and build. Vitest covers deterministic consumer logic and
Playwright covers browser workflows. Keep map rendering and its lifecycle
distinct from component state, with Platform retaining authority for
geographic calculations and products.

SvelteKit, an additional state-management library, CSS framework, component
library and backend are outside the approved stack. The standalone
cartography lab uses the locked Slice 4 dependencies directly. The application
scaffold belongs to 5A.2. The [basemap strategy](0003-basemap-strategy.md) is recorded separately.
Authenticated delivery and production integration remain outstanding.
