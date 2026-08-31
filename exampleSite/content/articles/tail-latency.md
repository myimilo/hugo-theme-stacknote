---
title: "Measure the Tail, Not Just the Average"
date: 2026-08-03
description: "Average latency can improve while the users with the worst experience wait even longer."
tags: [Performance, Observability]
---

An average compresses a distribution into one comfortable number. Production latency is rarely comfortable or evenly distributed.

Suppose 99 requests finish in 40 milliseconds and one request takes four seconds. The average is about 80 milliseconds. That number describes almost nobody: most users saw half of it, while the unlucky user waited fifty times longer.

## Keep the distribution

Track at least a few percentiles and request volume together:

| Metric | Value |
|---|---:|
| P50 | 40 ms |
| P95 | 58 ms |
| P99 | 4.0 s |
| Requests | 100 |

Percentiles also need enough samples. A P99 calculated from a tiny window is mostly a story about one request, so retain histograms and compare equivalent traffic windows.

## Find the population behind the tail

Split the slow requests by endpoint, region, payload size, cache state, dependency, and retry count. Tail latency often belongs to a specific population that disappears when everything is aggregated.

Optimizing the average rewards the common path. Reliability work begins when you ask who is still waiting.
