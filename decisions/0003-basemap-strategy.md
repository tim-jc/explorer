# 0003 — Explorer basemap strategy

**Status:** Accepted by the owner on 20 November 2026.

Use MapTiler as Explorer's primary basemap provider. Use Streets Light by
default, Streets Dark for dark cartography and MapTiler Outdoor for outdoor
cartography. Retain OpenFreeMap as the alternative provider, with Bright
the owner's preferred OpenFreeMap light style.

Keep provider, style, attribution and access configuration separate from
camera, overlay and other application behaviour. Preserve the comparison
lab as a research tool. Investigate optional terrain and contour controls
later. Custom style development is currently unnecessary.

Permanent browser key configuration, origin restrictions and usage monitoring
remain outstanding. Production geographic delivery and private authenticated
access are dependencies for 5C.

MapTiler Streets Dark is the preferred Cycling Analytics Best Efforts candidate,
subject to that application's implementation and owner acceptance. Coastal
retains its current CARTO cartography. See the
[research findings and validation](../docs/slice-5a1-report.md).
