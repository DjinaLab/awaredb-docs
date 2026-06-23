---
title: Modeling guide
description: Structure a real AwareDB model — nodes and uids, abstract templates and inheritance, relations, children aggregation, and states.
---

This guide covers the building blocks you combine into a real model. For the full
formula language see [Formulas & units](/start/formulas/); for every property type
see [Data types](/start/data-types/).

## Nodes and identifiers

Every node has a stable `uid` (your identifier) and an optional human `name`. Refer
to a node from a formula by its `uid`, `name`, or id.

```python
client.update({"uid": "motor", "name": "Drive Motor", "rated_power": "250 kW"})
```

## Templates and inheritance

Mark a node `abstract: true` to make it a template that doesn't compute on its own.
Concrete nodes declare `node_type` and inherit the template's properties, overriding
only what differs.

```python
client.update([
    {"uid": "battery", "abstract": True,
     "capacity": "=(cells.voltage * cells.capacity) kWh * cells.total",
     "cells": {"voltage": "3.66 V", "capacity": "3300 mAh", "total": 0}},
    {"uid": "BATT60", "node_type": "battery", "cells": {"total": 5050}},
    {"uid": "BATT85", "node_type": "battery", "cells": {"total": 6650}},
])
```

Both packs share the `capacity` formula; only `cells.total` differs.

## Relations

Reference another node as a property value and AwareDB records a typed relation. The
engine tracks every relation crossed during a calculation, so it knows what to
recompute when something changes.

```python
client.update({
    "uid": "car", "engine": "MOT_250", "battery": "BATT60",
    "weight": "=engine.weight + battery.weight",
})
```

## Aggregating children

Sub-nodes nested under a property are **children**. Aggregate over them with
`sum`, `prod`, `max`, etc.

```python
"weight": "=sum(children.weight)",
"efficiency": "=prod(children.efficiency)",
```

## States and cases

Give a property a set of **states** to model configurations that exist
simultaneously. Link another property to those states and provide **cases** to pick
a value per state.

```python
client.update({
    "uid": "my_car",
    "version": {"states": ["eco", "sport"]},
    "engine": {"linked": "version",
               "cases": [["eco", "MOT_250"], ["sport", "MOT_450"]]},
})

client.get("my_car.engine.rated_power")                    # all cases
client.get("my_car.engine.rated_power",
           states=["my_car.version.sport"])                # one resolved value
```

States compose: a model can carry several independent state dimensions (e.g.
`version` × `package`) and resolve any combination. See the
[Electric car example](/examples/electric-car/) for a full multi-state model.

## Next

- [Formulas & units](/start/formulas/)
- [Data types](/start/data-types/)
