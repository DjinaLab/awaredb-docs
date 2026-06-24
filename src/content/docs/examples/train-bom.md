---
title: Train BOM
description: A five-level bill of materials that prices itself — each level is the sum of the level below, with maintenance carried as real distances. Swap one component and the whole train recomputes.
---

A train is a deep bill of materials: a friction pad rolls into a brake system, into a
bogie, into a car, into the train, into a 30-year lifecycle cost. Write each level as
the sum of the level below — and a change to one component recomputes all five, the
ripple you never have to trace by hand.

(The full demo model lives in `examples/demo/knorr-bremse.json`; this is the shape of it.)

## 1. Five levels, each the sum of the one below

```python
client.update([
    # Level 0 — components. Costs and service distances are real quantities.
    {"uid": "friction_pad", "cost": "85 EUR",
     "maintenance_interval": "20000 km", "service_life": "80000 km"},
    {"uid": "brake_disc", "cost": "220 EUR", "maintenance_interval": "300000 km"},
    {"uid": "actuator",   "cost": "450 EUR", "maintenance_interval": "40000 km"},

    # Level 1 — brake system: pads + disc + actuator, per wheel.
    {"uid": "brake_system", "pads_per_wheel": 2,
     "cost": "=friction_pad.cost * pads_per_wheel + brake_disc.cost + actuator.cost",
     "maintenance_interval": "=min(friction_pad.maintenance_interval, actuator.maintenance_interval)"},

    # Level 2 — bogie: a brake system on each of four wheels, plus frame and suspension.
    {"uid": "bogie", "wheels": 4, "frame_cost": "3200 EUR", "suspension_cost": "1800 EUR",
     "cost": "=brake_system.cost * wheels + frame_cost + suspension_cost",
     "maintenance_interval": "=brake_system.maintenance_interval"},

    # Level 3 — car: two bogies plus the body.
    {"uid": "car", "bogies": 2, "body_cost": "45000 EUR",
     "cost": "=bogie.cost * bogies + body_cost"},

    # Level 4 — train: a rake of cars.
    {"uid": "train", "cars": 6,
     "cost": "=car.cost * cars"},
])
```

Ask for the top of the tree and every level resolves under it:

```python
client.get(["brake_system.cost", "bogie.cost", "car.cost", "train.cost"])
# brake_system.cost      840 EUR    (85·2 + 220 + 450)
# bogie.cost           8,360 EUR    (840·4 + 3,200 + 1,800)
# car.cost            61,720 EUR    (8,360·2 + 45,000)
# train.cost         370,320 EUR    (61,720·6)
```

## 2. Maintenance carried as real distances

`maintenance_interval` is a distance, and it rolls up by `min` — a system is due for
service as soon as its earliest part is. Units make the 30-year cost honest:

```python
client.update({
    "uid": "lifecycle",
    "distance": "4500000 km",                       # ~30 years of service
    "events": "=lifecycle.distance / brake_system.maintenance_interval",
    "pads": "=brake_system.pads_per_wheel * bogie.wheels * car.bogies * train.cars",
    "maintenance_cost": "=events * pads * friction_pad.cost",
    "total_cost": "=train.cost + lifecycle.maintenance_cost",
})

client.get(["brake_system.maintenance_interval", "lifecycle.maintenance_cost"])
# maintenance_interval   20000 km   (min of pad 20,000 and actuator 40,000)
# maintenance_cost    1,836,000 EUR (225 events · 96 pads · 85 EUR)
```

## 3. Swap one component — the whole train recomputes

Cheaper pads wear out faster. Carry the choice as a **state** and let the engine price
every grade through all five levels at once:

```python
client.update({
    "uid": "friction_pad",
    "grade": {"states": ["standard", "composite", "ceramic"]},
    "cost": {"linked": "grade",
             "cases": [["standard", "85 EUR"], ["composite", "125 EUR"], ["ceramic", "165 EUR"]]},
    "maintenance_interval": {"linked": "grade",
             "cases": [["standard", "20000 km"], ["composite", "30000 km"], ["ceramic", "40000 km"]]},
})

client.get(["train.cost", "lifecycle.total_cost"])
# grade       train.cost     lifecycle.total_cost
# standard    370,320 EUR    2,206,320 EUR
# composite   374,160 EUR    2,174,160 EUR
# ceramic     378,000 EUR    2,160,000 EUR   ← lowest 30-year cost
```

No formula mentions `grade`. The pad's price changed; `brake_system`, `bogie`, `car`,
`train` and the lifecycle cost re-resolved through every level, units intact. And the
engine surfaces the non-obvious answer: the pricier pads cost more up front, but the
longer service interval almost exactly repays the premium — ceramic wins the 30-year
total by a hair. That trade-off is the work you didn't write.

## What it demonstrates

- **Deep roll-up** — five levels, each a plain `sum`/arithmetic of the level below.
- **Units as proof** — EUR and km ride through the math; intervals stay distances.
- **`min` semantics** — a system inherits its earliest-due part's interval.
- **One change, full ripple** — swap a component, the whole tree recomputes itself.
- **Every state at once** — three pad grades priced through all five levels in one query.

Then [optimize](/outcomes/optimize/) for the grade with the lowest 30-year cost, or run a
[what-if](/outcomes/what-if/) on the service distance.
