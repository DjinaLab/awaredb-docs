---
title: Python SDK
description: The awaredb Python client — AwareDBClient, its read/write commands, analyses, history, and exceptions.
---

The `awaredb` package wraps the AwareDB REST API in a typed client. Install with
`pip install awaredb`.

## Client

```python
from awaredb import AwareDBClient

client = AwareDBClient(
    db="my_db",                  # database name or UUID (required)
    token="<token>",             # API token …
    user=None, password=None,    # … or username/password (fetches a token)
    host=None,                   # custom/self-hosted only; defaults to the hosted service
    timeout=180.0,               # seconds
    check_connection=True,       # probe /check/ on init to fail fast
)
```

`host` defaults to the hosted AwareDB service — omit it unless you're pointing at a
custom or self-hosted instance.

The client keeps a persistent connection pool — call `client.close()` or use it as a
context manager. `client.check()` returns `True` if the token and database are valid.

## Read commands

| Method | Signature | Returns |
|---|---|---|
| `get` | `get(path, states=None)` | The value at a dotted `path` (e.g. `"car.range"`). |
| `query` | `query(nodes=None, conditions=None, properties=None, states=None, show_abstract=False)` | Nodes matching the filters. `nodes=["*"]` for all. |
| `calculate` | `calculate(formula, states=None)` | The result of one formula or a list of formulas. |

```python
client.get("car.range", states=["car.version.sport"])
client.query(nodes=["role"], conditions=["node.count > 2"], properties=["cost_monthly"])
client.calculate("company.mrr * (12 'month')")
```

## Write commands

| Method | Signature | Notes |
|---|---|---|
| `update` | `update(data, partial=False)` | Upsert a node/relation/relation-type or a list of them. `partial=True` updates only the given fields. |
| `remove` | `remove(ids)` | Delete by id. |
| `flush` | `flush()` | Drop all nodes and relations. |
| `load` | `load(filepath, recursive=False, flush=False)` | Bulk-load JSON from a file or folder. |

## Analyses

Read-only — each recomputes against a temporary context and never mutates the model.
See the [Analyses reference](/reference/analyses/) for payload shapes.

```python
client.scenarios(edits, states=None)
client.impact(edit=None, states=None, **extra)
client.projection(start_from=None, unit="day", step=1, points=10, edits=None, states=None)
client.goal_seek(target, decision, states=None, **extra)
client.optimize(objectives, decisions, constraints=None, states=None, **extra)
client.sensitivity(target, inputs, states=None, **extra)
client.trace(target, depth=5, states=None)
```

## History

```python
client.history(change_id=None, ids=None, start=None, end=None, from_date=None, to_date=None)
```

Lists changes in the reversible history database; pass `change_id` for one change, or
`ids` to filter to changes that touched specific nodes/relations.

## Exceptions

All inherit from `AwareDBError`:

| Exception | Raised when |
|---|---|
| `AuthError` | Credentials rejected (401/403), or database unreachable. |
| `InvalidCommandError` | 400 — bad payload or unknown command. |
| `TransportError` | Network failure or non-2xx status. |
| `UnexpectedError` | A 2xx body that wasn't valid JSON. |

## See also

- [REST API](/reference/rest-api/) — the HTTP surface the SDK calls.
- [Authentication](/reference/authentication/) — getting a token.
