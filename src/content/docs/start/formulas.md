---
title: Formulas & units
description: The AwareDB formula language — references, operators, units and conversion, conditionals, lambdas, and higher-order methods.
---

A property is a **formula** when its string starts with `=`. Without the `=`, the
string is treated as text (or an auto-detected simple value). This page covers the
language; for the function catalog see [Functions & constants](/reference/functions/).

## References

- `{{property}}` — interpolate another property's value into text or a formula.
- `node.property` — dotted path to a value on another node.
- `?.` — conditional chaining: returns "none" instead of an error if a step is
  missing (`engine?.spec?.torque`).
- Special names: `this` / `self` / `node` (the current node), `children` (its
  sub-nodes), `subnodes` / `all_subnodes` (recursive descent).

## Operators

- Arithmetic: `+ - * / ** %`
- Comparison: `== != < <= > >=`
- Logical: `&&` `||` (and `and` / `or`, case-insensitive)
- Set: `|` `&` `&-` `&*` `|+`
- Lambda / assignment: `=>`

Operators dispatch on operand **types**: quantity × scalar keeps the unit, text `+`
text concatenates, list operations broadcast element-wise, and an operation
involving an error returns the error unchanged.

## Units

Quantities are unit-aware (backed by Pint).

- **Simple unit, bare value:** `"8 hour"`, `"750000 EUR"`, `"250 kW"`.
- **Compound or named unit in a value:** write it as a formula with single quotes —
  `"=60 'EUR/hour'"`, `"=5.5 'km/kWh'"`. A bare compound like `"60 EUR/hour"` is
  intentionally **not** parsed as a quantity (it would be ambiguous) and degrades to
  a symbolic formula.
- **Conversion:** angle brackets are the conversion operator, not a literal —
  `(expr) <unit>` or `VAR<unit>`. Example: `speed<m/s>`.

Adding incompatible units doesn't fail the calculation — AwareDB records a warning
on the value, strips units, and continues. Zero is unit-agnostic.

## Conditionals

```
=if(progress >= 0.7, "on track", "behind")
=progress >= 0.7 ? "on track" : "behind"
```

## Lambdas

Parameterized formulas with `=>`. Parameters can declare an expected unit.

```
"drag": "(Cd, A, speed: 'm/s') => (0.5 * density * Cd * A * speed**2) N",
"range": "(speed: 'km/h') => (battery.capacity * 60 min / power_at_speed(speed) * speed<m/s>) km"
```

## Higher-order methods

Lists support `.map`, `.filter`, and `.reduce`:

```
[1, 2, 3].map(x => x + 1)               // [2, 3, 4]
[1, 2, 3].filter(x => x > 1)            // [2, 3]
[1, 2, 3].reduce(total, value => total + value)   // 6
```

## Next

- [Data types](/start/data-types/) — every value type a property can hold.
- [Functions & constants](/reference/functions/) — the built-in catalog.
