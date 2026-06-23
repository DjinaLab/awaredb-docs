---
title: Quickstart
description: Install the AwareDB Python client, push your first nodes with formulas, and read back computed values.
---

This gets you from zero to a computed value in a few minutes using the Python SDK.

## 1. Install

```bash
pip install awaredb
```

## 2. Connect

You need a database name (or UUID) and an [API token](/reference/authentication/).

```python
from awaredb import AwareDBClient

client = AwareDBClient(db="my_db", token="<your-token>")
```

The client points at the hosted service by default. Only pass `host` if you run a
custom or self-hosted instance:

```python
client = AwareDBClient(db="my_db", token="<your-token>", host="https://awaredb.example.com")
```

Or authenticate with a username and password — the client fetches a token for you:

```python
client = AwareDBClient(db="my_db", user="alice", password="<password>")
```

Use it as a context manager to release the connection when done:

```python
with AwareDBClient(db="my_db", token="<your-token>") as client:
    ...
```

## 3. Create your first nodes

A property starting with `=` is a formula; `{{name}}` references another property.

```python
client.update({
    "uid": "myFirstNode",
    "hello": "Hello",
    "world": "World",
    "full_text": "={{hello}} {{world}}!",
})
```

## 4. Read a computed value

```python
client.get("myFirstNode.full_text")
# "Hello World!"
```

## 5. Add some math — with units

```python
client.update([
    {"uid": "battery", "capacity": "60 kWh"},
    {"uid": "engine", "km_per_kwh": "=5.5 'km/kWh'"},
    {"uid": "car",
     "battery": "battery", "engine": "engine",
     "range": "=battery.capacity * engine.km_per_kwh"},
])

client.get("car.range")
# "330.0 km"   ← units carried through automatically
```

## 6. Ask a what-if

```python
client.scenarios(edits=[{"path": "battery.capacity", "value": "85 kWh"}])
```

## Next steps

- [Modeling guide](/start/modeling/) — structure a real model with templates,
  relations, and states.
- [Formulas & units](/start/formulas/) — the formula language in full.
- [What you can do](/outcomes/model/) — organized by outcome.
