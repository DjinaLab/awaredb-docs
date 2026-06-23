---
title: Electric car
description: A rich AwareDB model — components decomposed and recombined, two independent state dimensions, typed lambdas, units, and engineering physics.
---

This is the example to study if you want to see everything the engine does in one
model: component decomposition, multi-dimensional states, typed lambdas, inline unit
conversion, child aggregation, and real physics. Three teams model independently and
AwareDB recombines their work.

## 1. Components as templates

Each kind of part is an abstract template with concrete instances. The battery's
capacity is derived from its cells:

```python
client.update([
    {"uid": "battery", "abstract": True, "voltage": "400 V",
     "capacity": "=(cells.voltage * cells.capacity) kWh * cells.total",
     "weight": "=(cells.total * 0.075) kg",
     "cells": {"voltage": "3.66 V", "capacity": "3300 mAh", "total": 0}},
    {"uid": "BATT60", "node_type": "battery", "cells": {"total": 5050}},
    {"uid": "BATT85", "node_type": "battery", "cells": {"total": 6650}},

    {"uid": "MOT_250", "node_type": "electric_engine",
     "rated_power": "250 kW", "peak_torque": "400 Nm",
     "max_rpm": "18000 'rev/min'", "efficiency": "0.97", "weight": "80 kg"},
    {"uid": "MOT_450", "node_type": "electric_engine",
     "rated_power": "450 kW", "peak_torque": "630 Nm",
     "max_rpm": "18000 'rev/min'", "efficiency": "0.97", "weight": "95 kg"},
])
```

## 2. Reusable physics with lambdas

A `physics` node holds parameterized formulas — note the typed parameters and units:

```python
client.update({
    "uid": "physics",
    "air": {"density": "1.225 'kg/m**3'",
            "drag": "(Cd, A, speed: 'm/s') => (0.5 * density * Cd * A * speed**2) N"},
    "ground": {"gravity": "9.81 'm/s**2'",
               "friction": "(weight, Crr) => (weight * gravity * Crr) N"},
    "power_at_speed": "(Cd, A, weight, Crr, speed: 'm/s') => "
                      "((air.drag(Cd, A, speed) + ground.friction(weight, Crr)) * speed) W",
})
```

## 3. The car — two state dimensions at once

The car carries **two independent states**: `version` (eco/sport) selects the motor
and wheels; `package` (standard/long_range) selects the battery. That's four
configurations in one model.

```python
client.update({
    "uid": "my_car", "node_type": "car",
    "version": {"states": ["eco", "sport"]},
    "package": {"states": ["standard", "long_range"]},

    "powertrain": {
        "engine": {"linked": "version",
                   "cases": [["eco", "MOT_250"], ["sport", "MOT_450"]]},
        "gear": "GEAR91", "inverter": "INV550",
        "torque": "=engine.peak_torque * gear.ratio",
        "max_power": "=min(engine.rated_power, inverter.max_power)",
        "weight": "=sum(children.weight)",
    },
    "battery": {"linked": "package",
                "cases": [["standard", "BATT60"], ["long_range", "BATT85"]]},

    "weight": "=sum(children.weight)",
    "cruise_speed": "90 'km/h'",
    "range": "(speed: 'km/h') => (battery.capacity * 60 min / "
             "chassis.power_at_speed(speed) * speed<m/s>) km",
    "max_range": "=range(cruise_speed)",
    "top_speed": "=min(powertrain.top_speed_limits.rpm, powertrain.top_speed_limits.power)",
})
```

## 4. Query — all configurations, or one

Ask for a value with no state and you get every case; pin a state and you get the
single resolved number, in correct units.

```python
client.get("my_car.max_range")
# all four cases: eco/standard, eco/long_range, sport/standard, sport/long_range

client.get("my_car.max_range",
           states=["my_car.version.sport", "my_car.package.long_range"])
# one value, in km
```

## What it demonstrates

- **Decomposition & recombination** — independent teams, one assembled model.
- **Multi-dimensional superposition** — `version` × `package` resolved on demand.
- **Typed lambdas + unit conversion** — `(speed: 'm/s')`, `speed<m/s>`.
- **Child aggregation** — `sum(children.weight)`, `min(...)`.
- **Real physics** — drag, friction, power, top speed, range, all unit-correct.

Now try a [what-if](/outcomes/what-if/) (swap the battery, resize the cells) or
[optimize](/outcomes/optimize/) for the lightest config that hits a target range.
