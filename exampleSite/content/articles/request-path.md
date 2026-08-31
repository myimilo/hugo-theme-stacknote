---
title: "Trace the Request Before You Tune the Service"
date: 2026-08-17
description: "A small observability habit that prevents teams from optimizing the wrong stage of a production request."
tags: [Systems, Observability]
cover:
  image: images/request-path-cover.png
  alt: "A request flowing through four measured stages of a production system"
---

A slow endpoint is rarely one indivisible wait. It is a chain: connection setup, queueing, application work, storage, and the trip back to the caller. The useful question is not simply “why is this request slow?” but “where did this request spend its time?”

## Start with one trace

Pick one real slow request and write down its stages before changing a timeout or adding a cache.

```text
gateway       18 ms
queue        142 ms
application   31 ms
database      24 ms
response       6 ms
```

The application function is not the bottleneck in this example. Making it twice as fast saves about 15 milliseconds while the request still waits 142 milliseconds before the function starts.

## Measure boundaries you control

Add spans around queues, pools, remote calls, and serialization. Record both elapsed time and the identifiers needed to connect a slow span to resource pressure: worker pool, shard, region, or dependency.

The goal is not to produce the largest possible telemetry bill. It is to preserve enough boundaries that a future incident can distinguish waiting from working.

## Optimize the stage, not the story

Once the slow stage is known, choose the matching intervention. Queue delay may call for admission control or more workers. Database latency may call for an index or fewer round trips. Network setup may call for connection reuse.

Without that decomposition, performance work becomes a collection of plausible stories. A trace turns the story into a location.
