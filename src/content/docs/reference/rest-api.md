---
title: REST API
description: The AwareDB command endpoint — one route, sixteen commands, token auth, synchronous or async execution.
---

AwareDB exposes a single command endpoint. Every operation is a `command` posted to
the same route against a `db`.

```
POST  /rest/db/<db>/<command>/
PATCH /rest/db/<db>/<command>/
```

- `<db>` — database name or UUID.
- `<command>` — one of the commands below.
- **Auth:** `Authorization: Token <your-token>` (see
  [Authentication](/reference/authentication/)).
- **Body:** JSON with the command's parameters.
- **Response:** the result wrapped as `{"data": ...}` so scalars and lists are always
  valid JSON objects. (An empty result returns `{}`.)

## Commands

Read & write commands are gated by permission — `update`, `remove`, and `flush`
require write access; the rest require read.

| Command | Purpose |
|---|---|
| `check` | Validate token + database (used for connection probes). |
| `get` | Value at a dotted path. |
| `calculate` | Evaluate a formula (or list of formulas). |
| `query` | Nodes matching filters/conditions. |
| `update` | Upsert nodes / relations / relation types. |
| `remove` | Delete by id. |
| `flush` | Drop all nodes and relations. |
| `history` | Query the reversible change log. |
| `scenarios` | Apply overrides, return per-scenario results. |
| `impact` | Vary an input across steps, observe outputs. |
| `projection` | Walk forward in time with per-step edits. |
| `goal_seek` | Find the input that hits a target. |
| `optimize` | Maximize/minimize objectives under constraints. |
| `sensitivity` | Perturb inputs ±delta, rank response. |
| `trace` | Walk the upstream dependency tree. |
| `csp` | Constraint solve over formula constraints. |

## Examples

```http
POST /rest/db/my_db/calculate/
Authorization: Token <your-token>
Content-Type: application/json

{ "formula": "car.power * 2", "states": ["car.version.sport"] }
```

```http
POST /rest/db/my_db/get/
{ "path": "car.range", "states": [] }
```

```http
POST /rest/db/my_db/update/
{ "data": [ { "uid": "battery", "capacity": "60 kWh" } ], "partial": true }
```

```http
POST /rest/db/my_db/query/
{ "nodes": ["role"], "conditions": ["node.count > 2"], "properties": ["cost_monthly"] }
```

## Async execution

Long-running commands accept `"run_async": true` in the body. The server queues the
work and responds immediately:

```json
{ "data": {}, "run_async": true }
```

## See also

- [Python SDK](/reference/python-sdk/) — a typed wrapper over this surface.
- [Analyses](/reference/analyses/) — payload shapes for the analysis commands.
