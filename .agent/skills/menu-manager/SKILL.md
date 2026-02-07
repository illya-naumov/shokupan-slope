---
name: Menu Manager
description: Natural language interface for updating the bakery menu and pricing.
---

# The Menu Manager 🍞

## Objective
translate natural language requests into structured data updates for the menu.

## Triggers
- User says: "Add [Item] to the menu."
- User says: "Change the price of [Item] to [Price]."

## Protocol
1.  **Parse Request**: extract:
    *   Item Name
    *   Price (Currency)
    *   Description
    *   Category (Whole Loaf, Sando, Spread)
    *   Availability (Days of week)

2.  **Locate Data**:
    *   Find `src/data/menu.json` (or similar data source).

3.  **Update**:
    *   Read the file.
    *   Append or Modify the entry.
    *   **CRITICAL**: Ensure valid JSON syntax.

4.  **Verification**:
    *   Run `npm run lint` or `npm run type-check` to ensure the change didn't break React components.

5.  **Commit**:
    *   Git commit with message: `update(menu): [Item Name]`.

## Example
User: "Add a matcha latte for $6."
Action: Adds `{ "name": "Matcha Latte", "price": 600, "category": "Beverage" }` to `menu.json`.
