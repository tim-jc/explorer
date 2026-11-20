# Slice 5A.1 — Cartographic research

**20 November 2026 · Owner accepted and closed.**

The standalone lab compares MapLibre styles while preserving the camera,
overlay data and presentation settings. A bounded Leaflet raster view uses
the same evidence-derived short synthetic trace for Best Efforts comparisons.
The lab runs from the existing locked Slice 4 dependencies. It requires no
provider account to start and defaults to a local light or dark control.
The permanent application stack is recorded in
[decision 0002](../decisions/0002-application-stack.md).

## Camera and overlay controls

Coordinates are longitude, latitude. Each location has regional, local and
road presets at MapLibre zooms **9, 13 and 16** respectively. Leaflet uses
**10, 14 and 17** for roughly equivalent scale with 256-pixel tiles.

| Preset | Camera centre | What to examine |
|---|---|---|
| Central London, Blackfriars | −0.1045, 51.5105 | Dense street labels, cycle links and crossing approaches |
| Surrey Hills, Box Hill | −0.3132, 51.2537 | Lanes, wooded paths, minor road hierarchy |
| Rural Wales, Elan Valley | −3.5857, 52.2684 | Road scarcity, minor access roads and terrain |
| French Alps, Alpe d’Huez climb | 6.0358, 45.0747 | Switchbacks, hillside contrast, contours and hillshade |
| Belgian Ardennes, La Roche | 5.5700, 50.1762 | Woodland paths, farm tracks and minor paved roads |

Panning leaves overlays anchored to the selected region. Reset restores the
preset. Style changes retain the current camera, including free navigation.
Controls adjust tile classes, grid, maximum square, coverage, activity and
effort independently. A shared opacity slider, trace width and four halo
treatments let the owner compare road detail under an overlay. The grid
appears from zoom 11. Coverage values, square and bulk classification are
authored research shapes. For the displayed synthetic activity, only tiles
containing its ordered accepted samples carry a sample-backed relationship.
Route segments are display geometry. The short effort is a subset of those
samples. Traces are deliberately synthetic and may diverge from mapped roads.

## Provider capabilities and operations

Official documentation was retrieved on **20 November 2026**. Style entries
describe documented candidates and integration settings. The capability assessment is documentation-based. Independent live evaluation
is recorded below.

| Provider | Candidate styles and delivery | Data sources and customisation |
|---|---|---|
| MapTiler | Streets v4, Streets v4 Dark, Outdoor v4. MapLibre style JSON and raster XYZ for Leaflet. | Worldwide OSM-derived streets with other sources credited as applicable. Outdoor advertises paths, contours and hillshade. Cloud style editing and APIs support custom vector styling. [Styles](https://docs.maptiler.com/sdk-js/api-reference/variables/Externals.MAP_STYLE_CONFIG/) · [Outdoor](https://www.maptiler.com/maps/outdoor-topo/) · [Maps API](https://docs.maptiler.com/cloud/api/maps/) · [Source licences](https://www.maptiler.com/copyright/) |
| Stadia Maps | Alidade Smooth, Alidade Smooth Dark and Stadia Outdoors. MapLibre JSON and Leaflet raster XYZ. | Global OSM/OpenMapTiles-based vector schema. Outdoors highlights paths and terrain-related features. Native vector source overzooms z14, so higher rendered zoom does not imply new vector detail. Customise using the documented schema and check permission before copying an existing style. [Style library](https://docs.stadiamaps.com/themes/) · [Outdoors](https://docs.stadiamaps.com/map-styles/outdoors/) · [Vector tiles](https://docs.stadiamaps.com/vector/) |
| OpenFreeMap | Liberty and Bright light options, Dark and Fiord dark options. MapLibre vector. No comparable hosted outdoor or plain Leaflet raster style was established. | Global OSM-derived OpenMapTiles data. Open styles and public vector service, with self-hosting documented. Leaflet can embed a separate MapLibre renderer if needed, which is different from using a native raster basemap. [Project](https://openfreemap.org/) · [Quick start](https://openfreemap.org/quick_start/) |
| CARTO reference | Dark Matter raster, configured for both the reference MapLibre and Leaflet views. CARTO also publishes vector styles. | OSM-derived reference for Analytics. Dark Matter’s restrained palette makes it a useful baseline for route contrast and minor-road visibility. A raster client can change its overlays but cannot change baked-in roads or labels. [Dark Matter](https://carto.com/blog/positron-dark-matter-new-look/) · [Basemaps](https://carto.com/basemaps/) |

| Provider | Access, cost and use | Attribution, caching and private-app implications |
|---|---|---|
| MapTiler | Owner browser key with HTTP origin restrictions. Free personal/non-commercial tier lists 5,000 sessions and 100,000 API requests per month. Direct MapLibre and Leaflet calls use the third-party request model. Monitor dashboard usage. | MapTiler link, OSM credit and free-plan logo. Temporary single-user caching is permitted under Cloud terms. No implied permission to redistribute Cloud tiles. Separate on-prem products have separate terms. Origin restriction protects usage better than an unrestricted key and is independent of application authentication. [Keys](https://docs.maptiler.com/guides/developer/credentials/api-key/) · [Pricing](https://www.maptiler.com/cloud/pricing/) · [Cloud terms](https://www.maptiler.com/terms/cloud/) · [Attribution](https://docs.maptiler.com/guides/map-design/attribution/add-attribution/) |
| Stadia Maps | Keyless on documented loopback hosts with strict development rate limits. Owner key for a LAN test, domain authentication available for suitable hosted browsers. Free non-commercial tier lists 200,000 monthly credits, shared across APIs. | Credit Stadia, OpenMapTiles and OSM for these styles. Client cache subject to HTTP cache lifetime, or seven days if absent. Terms restrict proxying, bulk downloads, redistribution and benchmarking against competitors. Review with Stadia and seek written permission before conducting a competitive live comparison. Hosted origin and optional EU endpoints are separate from private app login. [Auth](https://docs.stadiamaps.com/authentication) · [Pricing](https://stadiamaps.com/pricing/) · [Limits](https://docs.stadiamaps.com/limits/) · [Terms](https://stadiamaps.com/terms-of-service/) |
| OpenFreeMap | Public instance needs no registration or key. Advertises no request quotas, with as-is service and no availability guarantee. Self-hosting is possible with a separate infrastructure and update burden. | Credit OpenFreeMap, OpenMapTiles and OSM. Public terms restrict automated collection, with a bounded offline exception of 3,000 tiles or 50 MB, four parallel requests and identified client. Use published data archives and applicable licences for authorised self-hosting rather than harvesting public tiles. [Terms](https://openfreemap.org/tos/) · [Privacy](https://openfreemap.org/privacy/) · [Quick start](https://openfreemap.org/quick_start/) |
| CARTO reference | Owner-issued key, request counting across raster and vector, with five million monthly non-commercial requests under fair use. CARTO can restrict access and revise availability. | Credit CARTO and OSM. Verify current terms before redistribution, proxying or offline retention. The lab does none of these. The provider processes request data to serve the map and monitor usage, independently of any application login. [Keys](https://carto.com/basemaps/apikey/) · [Terms](https://carto.com/legal/basemap-terms/) |

Live selections contact the relevant provider/CDN for tiles and, for vector
styles, potentially style JSON, sprites, terrain, TileJSON and fonts. MapTiler
also serves its attribution logo. Tile requests reveal viewed map areas and
zoom. Providers can receive the IP, referrer/origin, user agent and key where
applicable. The browser renders the synthetic overlays locally. Private app
authentication does not conceal viewport requests from tile providers.
MapTiler and Stadia document EU endpoint options, which this lab leaves as
future deployment choices. OpenFreeMap says routine access logs omit IPs by
default, while error or security logs may include them. [MapTiler EU endpoint](https://docs.maptiler.com/guides/developer/api/eu-based-api-endpoint/) · [Stadia vector endpoints](https://docs.stadiamaps.com/vector/) · [OpenFreeMap privacy](https://openfreemap.org/privacy/)

## Cartographic evaluation matrix

Use the same camera and overlay values for a visual comparison. Record style,
preset, scale and device for each observation. The rows below are research
checks and documentation-based expectations, with owner observations recorded below.

| Criterion | Test | What to investigate if detail is missing |
|---|---|---|
| Road hierarchy, paths and surface | At Surrey and Ardennes local/road scales, follow minor lanes and compare track/path and paved/unpaved differentiation. | Look for the class and surface in the vector tile schema. If supplied, alter filter, colour, minzoom or dash treatment. |
| Cycling infrastructure | In London, check cycle tracks, crossing approaches and label overlap. | Compare tiled feature properties with public OSM mapping. Schema omissions or upstream gaps cannot be corrected by paint rules. |
| Terrain and contours | Compare Outdoor styles in Wales and Alps, with overlay off and on. | Check whether tiles include contours, elevation and/or hillshade. A vector style cannot create missing terrain data. |
| Labels and contrast | At regional and local zoom in light and dark styles, inspect place names, small roads and overlaps. | Tune label priority, font size, collision and layer ordering where licensed. |
| Grid and coverage | Start with opacity 0.45, vary 0.2–0.6, isolate grid and classification, then add coverage. | Judge whether grid alone provides enough context and whether fills obscure labels. |
| Ridden and unridden | At road zoom compare trace off/on at 2, 4 and 6 px, with no, thin dark and wide halos. | Compare low-opacity strokes and narrower halos. Qualify findings using nearby unoverlaid roads where the synthetic line diverges. |
| Short efforts | Repeat with only the cyan effort on and at the same camera in Leaflet raster. | Check usable road context at view-fit scale, especially on dark maps. Raster detail requires a different rendered style or source. |

## Owner findings and accepted strategy

| Provider and style | Owner observation |
|---|---|
| OpenFreeMap Bright | Preferred OpenFreeMap light style. Performed well in all five regions. |
| OpenFreeMap Liberty | Satisfactory cartography with a dated appearance. |
| OpenFreeMap Fiord | Better than Dark, with insufficient detail and contrast. |
| OpenFreeMap Dark | Essentially illegible for the owner's requirements. |
| MapTiler Streets Light | At least as good as OpenFreeMap Bright. |
| MapTiler Streets Dark | Strong dark option with useful geographic detail. |
| MapTiler Outdoor | Meaningful additional value. Contours are sometimes useful and can also clutter mountain views. |
| MapTiler Streets Dark in Leaflet | Visually comparable to MapLibre, with the expected discrete zoom behaviour. |

MapTiler is Explorer's primary provider. Streets Light is the default,
Streets Dark is the dark option and MapTiler Outdoor is the outdoor option.
OpenFreeMap is the alternative provider. The research lab retains its local
controls and candidate styles. See the [basemap decision](../decisions/0003-basemap-strategy.md).

## Wider cycling ecosystem

MapTiler Streets Dark is the preferred candidate for improving Cycling
Analytics Best Efforts maps, subject to application-specific implementation
and owner acceptance. Retain Coastal's existing CARTO cartography for its
restrained analytical presentation. Each application can choose cartography
that suits its purpose.

## Reproducing local validation

From the repository root, install the existing locked dependencies if needed
and launch the research server.

```sh
npm --prefix prototype ci
python3 cartography/serve.py
```

Open [comparison lab](http://127.0.0.1:8767/cartography/) in Safari. For a
physical iPhone, restart the same server with `--bind MAC_LAN_IP` on a
trusted local network, then visit `http://MAC_LAN_IP:8767/cartography/`
from the phone. Use the Mac's actual LAN address and stop the server when
finished. The server exposes only research assets and the required dependencies.

1. Start with both local controls. Choose a region and scale, pan freely,
   change style and confirm camera and overlays persist. Verify Reset view.
2. Independently toggle all six overlay categories. Vary opacity, trace width
   and halo. Check map panning and pinch gestures with panels open and closed.
3. Use live styles only after reviewing the provider terms. OpenFreeMap can
   start without a key. For MapTiler or CARTO use an owner-issued restricted
   browser key. For Stadia, loopback development needs no key, while an iPhone
   LAN address needs an owner key in this lab. Resolve Stadia comparison
   permission before a comparative live run.
4. Select the target style, open **Provider access**, paste the key, select
   **Use key in this tab**, then **Load style**. The field clears immediately.
   Keys are held in memory per tab and view, so reload or switching to the
   Leaflet page requires re-entry. Use only public browser keys with provider
   restrictions and quota protections. Requests can be inspected by the user
   and browser devtools. Keep network traces, HARs, raw URLs, provider error
   bodies and credential-entry screenshots out of shared evidence and logs.
   The app reports sanitised errors and its local server omits request logs.
5. Check provider, style, zoom and visible attribution after every successful
   switch. Try an empty key and then a network failure on a keyless style.
   Verify the error and recovery to the local control. Confirm the dark raster
   view opens from the link and inspect the short effort.
## Validation and limitations

```sh
node --test cartography/model.test.mjs
node cartography/browser-check.mjs
```

Three offline tests passed, as did 27 existing fixture tests and 10 Slice 4
model tests. The new tests cover deterministic geometry, sample-only relationships,
MapLibre schema validation, style composition with camera and source attribution, independent overlay
settings and key handling. The browser check intercepts every request and
uses a mocked provider style and failure. It exercises camera preservation,
control persistence, attribution, recovery, responsiveness and the local
Leaflet view at desktop and phone-emulation sizes. Codex's Chrome launcher failed before opening a page
(SIGABRT), and local server binding was denied during implementation.
The owner subsequently completed the following independent validation:

| Check | Owner result |
|---|---|
| Locked dependency installation | Passed |
| Cartographic model tests | 3 passed |
| Desktop and mobile-emulated browser checks | Passed |
| Geographic fixture tests | 27 passed |
| Slice 4 model regression tests | 10 passed |
| Dependency security audit | Zero reported vulnerabilities |
| Desktop Safari | Functional verification passed |
| Live basemap evaluation | OpenFreeMap and MapTiler evaluated |
| Leaflet raster comparison | MapTiler Streets Dark evaluated |
| Physical iPhone | Accepted |

## Deferred work

- Stadia live competitive comparison was deferred under its provider terms.
- Direct live CARTO comparison was deferred.
- The research server returns 404 for `/cartography`. Use `/cartography/`.
  This is a minor, non-blocking defect.
- Permanent API key configuration, origin restrictions and usage monitoring
  remain outstanding.
- Investigate optional terrain and independent contour controls in a later
  bounded increment. No custom style development is currently required.
- Production geographic delivery and private authenticated access remain
  prerequisites for 5C.

**Next proposed increment:** Slice 5A.2 — Application Foundation, pending
separate owner authorisation.
