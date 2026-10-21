# Mobile check

Before the pull request:

1. Open the page at 360px wide and at 390px wide. Scroll from top to bottom.
2. Fix sideways scrolling, clipped text, overlapping sections, images wider than the screen, and buttons shorter than 44px.
3. Run `node mobile-check.mjs` until it prints PASS.

Result:
- Script: PASS
- Look at 360px and 390px: PASS — no horizontal scroll, images and CTAs fit the viewport, fixed WhatsApp chip clears footer contact lines. Equestrian layout uses stacked hero photo, two-column job grid on small screens, and readable section ledes.
