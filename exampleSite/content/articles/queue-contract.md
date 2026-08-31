---
title: "The Queue Is Part of Your API Contract"
date: 2026-08-10
description: "Retries, deadlines, idempotency, and backpressure determine what an asynchronous API actually promises."
tags: [Systems, Reliability]
---

Moving work behind a queue changes latency, ownership, and failure semantics. It does not make those concerns disappear.

## Acknowledgement is not completion

An HTTP `202 Accepted` response says the server accepted responsibility for attempting the job. It should not imply that the job succeeded, or even that a worker has started it.

Clients need a durable job identifier and a status model they can understand:

```json
{
  "job_id": "job_7f31",
  "state": "queued",
  "status_url": "/jobs/job_7f31"
}
```

## Retries create duplicates

A worker can finish the side effect and crash before acknowledging the message. The queue then delivers the same message again. That is ordinary at-least-once delivery, not an exotic edge case.

Use an idempotency key, a unique database constraint, or a state transition that can be applied safely more than once. The invariant belongs where the side effect is committed.

## Backpressure is a product decision

An unbounded queue converts overload into delayed failure. Set limits, publish queue age, and decide what the system rejects when it cannot keep up. A clear `429` or `503` today is often kinder than silently completing a time-sensitive job tomorrow.

The queue is part of the API because its semantics become the client's semantics. Document them with the endpoint.
