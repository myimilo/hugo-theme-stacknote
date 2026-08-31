---
title: "A Small Checklist for Shipping Technical Notes"
date: 2026-07-27
description: "A repeatable publishing pass for links, code, metadata, accessibility, and the final production build."
tags: [Hugo, Writing]
---

A publishing checklist should be short enough to use every time. Mine asks five questions.

1. Does the opening state the problem without requiring a page of background?
2. Do commands and code samples still run?
3. Do external claims link to the original source?
4. Does every informative image have useful alternative text?
5. Does the production build complete without warnings?

For a Hugo site, the final check can remain pleasantly boring:

```bash
hugo --panicOnWarning --minify
```

Preview the generated site at both narrow and wide viewport sizes. Long titles, tables, code blocks, and navigation labels expose layout assumptions faster than placeholder text ever will.

The purpose of the checklist is not ceremony. It is to move recurring mistakes out of memory and into a process that remains reliable on a busy day.
