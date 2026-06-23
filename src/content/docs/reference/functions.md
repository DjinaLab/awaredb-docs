---
title: Functions & constants
description: The built-in functions and constants available inside AwareDB formulas — math, stats, trig, aggregation, higher-order methods, and constructors.
---

These are callable from any formula. Aggregations work over lists and over
`children`.

## Constants

`pi`, `e`, `tau`, `nan`, `inf` — resolved at parse time.

## Special names

- `children` — the sub-nodes of the current node.
- `subnodes` / `all_subnodes` — recursive descent.
- `this` / `self` / `node` — the current node.
- `date`, `time`, `datetime` — date/time constructors.

## Aggregation

`sum`, `prod`, `avg` (mean), `min`, `max`, `count`, `len`.

```
=sum(plan.mrr)
=prod(children.efficiency)
=max(setup.children.tire.rolling_resistance_coefficient)
```

## Arithmetic & rounding

`abs`, `ceil`, `floor`, `round`, `sqrt`, `hypot`, `exp`, `log`, `ln`, `xrange`.

```
abs(-10)        // 10
sqrt(4)         // 2
round(3.14159, 2)
```

## Trigonometry

`sin`, `cos`, `tan` and their inverse (`asin`, …) and hyperbolic (`sinh`, …) forms.

```
sin(0)          // 0
```

## Statistics

`mean`, `median`, `mode`, `variance`, and correlation helpers.

```
mean([1, 2, 3, 4])   // 2.5
```

## Special functions

`gamma`, `erf`, and number checks `isfinite`, `isinf`, `isnan`.

## Higher-order methods

On lists: `.map`, `.filter`, `.reduce`.

```
[1, 2, 3].map(x => x + 1)                          // [2, 3, 4]
[1, 2, 3].filter(x => x > 1)                       // [2, 3]
[1, 2, 3].reduce(total, value => total + value)    // 6
```

## Constructors

- `matrix(...)` / `mtx(...)` — build a matrix.
- `dataset(...)` / `dts(...)` — build a dataset (with optional interpolation).
- `date(...)` / `time(...)` / `datetime(...)` — temporal values.
- geometry constructors — `point`, `line`, `polygon`, and the multi-variants.

See [Formulas & units](/start/formulas/) for operators and [Data types](/start/data-types/)
for what each constructor produces.
