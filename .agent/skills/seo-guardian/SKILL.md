---
name: SEO Guardian
description: Autonomous audit of Next.js pages for SEO best practices and accessibility compliance.
---

# The SEO Guardian 🛡️

## Objective
Ensure every public page is search-engine optimized and accessible before deployment.

## Triggers
- When the user runs `npm run build`.
- When the user asks "Check SEO".

## Audit Checklist
The agent must verify:
1.  **Metadata Exports**: Every `page.tsx` must export `const metadata`.
2.  **OpenGraph**: `metadata` must include `title`, `description`, and `openGraph.images`.
3.  **Alt Text**: All `Image` components or `img` tags must have a non-empty `alt` attribute.
4.  **Structure**: Page must have exactly one `h1` tag.

## Auto-Correction Protocol
If issues are found:
1.  **Missing Description**: Generate a 150-char description based on the page's `h1` and first paragraph.
2.  **Missing Alt**: Analyze the image filename or context (surrounding text) to generate a descriptive alt tag.
3.  **Missing Title**: Use the format "Slope Shokupan | [Page Name]".

## Tools and commands
- Use `grep_search` to find `export const metadata`.
- Use `view_file` to inspect React components.
