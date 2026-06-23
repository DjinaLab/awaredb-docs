---
title: How it works
description: Follow a value from a formula on a node through calculation to a unit-aware, state-resolved result — and see what makes it deterministic and reversible.
---

AwareDB takes a model you describe — nodes, the relations between them, and
formulas on their properties — and computes it. Here is the whole path, end to
end.

## 1. You describe the model

You push **nodes** with **properties**. A property is either a plain value
(`"85 kg"`) or a formula (anything starting with `=`). Nodes connect through typed
**relations**, and a node can inherit properties from an abstract template node.

```python
client.update({
    "uid": "motor",
    "rated_power": "250 kW",
    "efficiency": "0.97",
})
```

## 2. AwareDB resolves inheritance

Before evaluating anything, the engine merges inherited properties top-down: a
concrete node declaring `node_type: "engine"` inherits the `engine` template's
properties, with its own values taking precedence.

## 3. Formulas are parsed and evaluated

Each formula goes through a lexer → parser → interpreter. Identifiers resolve in a
fixed order — loop variables, then special names (`this`, `children`, …), then
properties on the current node, then other nodes in the graph. Operators dispatch
on the **types** of their operands, so `"250 kW" * "0.97"` knows it's a quantity
times a scalar and keeps the unit.

## 4. Units travel with the numbers

Quantities carry their unit (backed by Pint). `5 kg * 2 m/s²` becomes `10 kg·m/s²`.
If you add incompatible units, AwareDB doesn't crash — it records a warning on the
value, strips the units, and keeps computing, so one bad cell never takes down the
whole calculation.

## 5. States resolve

A property can hold several values at once — one per **state** (a "superposition").
Ask for it without a state and you get every case; ask with a specific state and you
get the single resolved value. This is how one model carries many configurations.

## 6. The result is a value — with diagnostics attached

Every computed value carries its own warnings, and errors are values too: an
operation involving an error returns the error unchanged rather than throwing.
You inspect the result, not catch an exception.

## 7. The change is logged and reversible

Every write is recorded in a separate history database with both the new state and
the deltas needed to revert it. You can list changes, inspect a single change, or
restore a full snapshot.

---

Next: the [vocabulary](/concepts/core-concepts/) for every term above, or jump
straight to the [Quickstart](/start/quickstart/).
