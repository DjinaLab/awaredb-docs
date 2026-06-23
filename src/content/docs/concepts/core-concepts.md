---
title: Core concepts
description: The vocabulary of an AwareDB model — node, property, value, relation, state, abstract node, units, and history.
---

Everything in AwareDB is built from a small set of pieces.

## Node

The basic unit — an object, person, component, or concept. A node has a stable
`uid`, a `name`, and a bag of **properties**. Nodes are the vertices of the graph.

## Property

A named attribute on a node. Either a **static value** (`"85 kg"`, `"electric"`,
`true`) or a **formula** — any string starting with `=` (`"=rated_power * efficiency"`).
Anything that doesn't start with `=` is treated as text or an auto-detected value.

## Value

The **computed result** of a property after calculation. A static property's value
is itself; a formula's value is what it evaluates to — a quantity, a list, a
matrix, a boolean, an error, and so on. Reading a value is what `get` and `query`
return.

## Relation & RelationType

A **relation** is a directed, typed edge between two nodes. A **relation type** is
the *schema* of that edge — it has a name, a reverse name, and rules for how impact
flows across it. Relations are how nodes reference and depend on each other.

## Abstract node (template)

A node marked `abstract: true` doesn't compute on its own — it's a template. Concrete
nodes declare `node_type: "<template-uid>"` and **inherit** its properties, overriding
what they need. This is how you define a "battery pack" once and stamp out `BATT60`
and `BATT85`.

## States (superposition)

A property can hold **multiple values at once**, one per state — for example a car
that exists in both `eco` and `sport` versions. Query without specifying a state and
you get all cases; query with a state and you get the one resolved value. States can
be **linked**, so activating a parent state selects the matching child case.

```json
{
  "uid": "my_car",
  "version": { "states": ["eco", "sport"] },
  "engine": { "linked": "version", "cases": [["eco", "MOT_250"], ["sport", "MOT_450"]] }
}
```

## Units

Quantities are unit-aware (`"250 kW"`, `"60 kWh"`, `"90 'km/h'"`). Arithmetic
respects units; conversions are explicit. Compound or named units inside a value are
written with single quotes (`"=60 'EUR/hour'"`); `<unit>` is the conversion operator
(`speed<m/s>`). See [Formulas & units](/start/formulas/).

## History

Every structural change is logged to a separate history database and is reversible —
list changes, inspect one, or restore a full snapshot. This is the audit and
point-in-time-recovery mechanism. See [Forecast / reference](/reference/python-sdk/).

---

With the vocabulary in hand, see what you can build — organized
[by outcome](/outcomes/model/) — or jump to the [Quickstart](/start/quickstart/).
