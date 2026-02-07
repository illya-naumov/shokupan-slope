---
name: Competitor Watch
description: Market intelligence agent that monitors local competitor pricing.
---

# The Competitor Watch 🕵️‍♀️

## Objective
Provide real-time pricing intelligence from local competitors to inform Slope Shokupan's pricing strategy.

## Triggers
- User says: "Check competitor prices."
- User says: "Are we priced correctly?"

## Targets
1.  **Breads Bakery** (Benchmark: Volume)
2.  **UnD** (Benchmark: Aesthetics)
3.  **Taku Sando** (Benchmark: Specificity)

## Protocol
1.  **Browse**:
    *   Use `browser_subagent` to visit competitor sites.
    *   Navigate to "Order" or "Menu" pages.
2.  **Extract**:
    *   Look for "Shokupan", "Milk Bread", or "Katsu Sando".
    *   Record Price and Weight (if available).
3.  **Analyze**:
    *   Calculate average market price per loaf/sando.
    *   Compare with `src/data/menu.json`.
4.  **Report**:
    *   Generate `MARKET_REPORT.md` in the `brain/` directory.
    *   Alert if Slope Shokupan is >20% higher or lower than average.

## Safety
*   Respect `robots.txt`.
*   Do not perform high-frequency scraping (max 1 request per 5 seconds).
