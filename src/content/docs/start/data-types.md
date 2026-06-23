---
title: Data types
description: Every value type an AwareDB property can hold — quantities, text, booleans, dates, lists, matrices, dicts, cases, datasets, states, functions, geometry, and none.
---

Every value AwareDB computes is a typed value. A property's type is inferred from
what you write; formulas produce whichever type the expression yields.

## Scalars

| Type | Write it as | Notes |
|---|---|---|
| **Quantity** | `"4.5 kg"`, `"=60 'EUR/hour'"` | Magnitude + optional unit. Compound units need quotes in a formula. |
| **Boolean** | `true`, `"true"` | Coerces to `1`/`0` in arithmetic. |
| **Text** | `"electric"` | `+` concatenates; `*` by a dimensionless quantity repeats. |
| **Date** | `"2026-01-01"` (ISO auto-detected) | `date` / `time` / `datetime` / `timedelta`; arithmetic with quantities offsets it. |
| **None** | — | Sentinel for missing values. Collapses to `0` in arithmetic; only `==`/`!=` compare. |

## Collections

```json
"weights": ["2 g", "5 kg", "300 g"],          // List — ops broadcast element-wise
"grid":    [[1, 2], [3, 4]],                   // Matrix — supports @ (matmul)
"specs":   { "voltage": "400 V", "cells": 5050 }  // Dict — ops broadcast over values
```

- **List** — ordered collection; arithmetic broadcasts across elements.
- **Matrix** — 2D array of values; `@` does matrix multiplication. Build with
  `matrix(...)` / `mtx(...)`.
- **Dict** — key→value map; operations broadcast over values, merge keys on mismatch.

## Conditional & tabular

- **Cases** — a value that depends on conditions or linked states; first match wins.

  ```json
  "battery": { "linked": "package",
               "cases": [["standard", "BATT60"], ["long_range", "BATT85"]] }
  ```

- **Dataset** — tabular data with input/output columns; supports linear or stepwise
  interpolation. Build with `dataset(...)` / `dts(...)`.

## States

A property holding multiple values at once, one per active state. See
[Modeling guide](/start/modeling/#states-and-cases).

```json
"version": { "states": ["eco", "sport"] }
```

## Functions (lambdas)

Parameterized formulas with `=>`, optionally typing each parameter's unit. See
[Formulas & units](/start/formulas/#lambdas).

```json
"area": "(w, h: 'm') => (w * h) 'm**2'"
```

## Geometry

`point`, `line`, `polygon`, `multiline`, `multipolygon` — geographic primitives with
distance and set operations (union/intersection), built with the matching
constructor functions.

## Errors & warnings as values

Diagnostics are first-class values, not exceptions. An operation involving an
**error** returns the error unchanged (short-circuit); a **warning** accumulates on
the value and computation continues. Inspect `.error` / `.warnings` on a result
rather than catching exceptions.

## Next

- [Functions & constants](/reference/functions/) — the built-in catalog.
- [Electric car example](/examples/electric-car/) — many of these types in one model.
