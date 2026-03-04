# Power 6/45 — 6 Combinations for 2026-03-04 (Wednesday)

**Dataset:** 1,281 draws (2017-10-25 to 2026-03-01)
**Last draw:** #01478 (2026-03-01) → `16, 22, 23, 35, 44, 45` sum=185

---

## Strategy Shift: Coverage over Prediction

### Lessons from Previous Failures

| Old Approach     | Problem                                     |
| ---------------- | ------------------------------------------- |
| Hot/cold numbers | Gambler's fallacy — lottery is memoryless   |
| Overdue numbers  | No predictive power — each draw independent |
| Sum targeting    | 36% of draws fall outside target range      |
| Strong pairs     | Statistical noise, not signal               |

### New Approach: Maximum Coverage

**Goal:** Target 5/6 match (1 in 34,808) instead of jackpot (1 in 8.1M)

**Method:**

- Maximize unique numbers across 6 tickets
- Ensure full zone coverage (5 zones: 1-9, 10-18, 19-27, 28-36, 37-45)
- 55% of draws hit 4 zones, 15% hit all 5 zones — all tickets hit 5/5

---

## Key Statistics

| Metric                      | Value                                           |
| --------------------------- | ----------------------------------------------- |
| Historical avg sum          | 138                                             |
| Last 10 sums                | 116, 199, 172, 108, 120, 169, 168, 111, 74, 185 |
| Zone coverage in draws      | 55% hit 4 zones, 15% hit all 5                  |
| Consecutive repeats         | 41% have 0, 42% have 1, 15% have 2+             |
| Position 1 (lowest) favors  | 1, 2, 4, 3, 5                                   |
| Position 6 (highest) favors | 45, 44, 43, 42, 41                              |

---

## 6 Combinations

### #1 — Full Zone Spread (Top Frequency)

| Numbers                    | Sum | Zones | Rationale                               |
| -------------------------- | --- | ----- | --------------------------------------- |
| **02, 10, 20, 28, 37, 45** | 142 | 5/5   | All top-frequency numbers, one per zone |

---

### #2 — Recent Hot + Zone Coverage

| Numbers                    | Sum | Zones | Rationale                         |
| -------------------------- | --- | ----- | --------------------------------- |
| **04, 16, 22, 30, 41, 44** | 157 | 5/5   | 4, 16, 22, 44 hot in recent draws |

---

### #3 — All-Time Leaders + Anchors

| Numbers                    | Sum | Zones | Rationale                            |
| -------------------------- | --- | ----- | ------------------------------------ |
| **01, 07, 19, 24, 34, 43** | 128 | 5/5   | 7, 19, 24 = top 4 all-time frequency |

---

### #4 — Ultra-Hot 23 + Balanced

| Numbers                    | Sum | Zones | Rationale                       |
| -------------------------- | --- | ----- | ------------------------------- |
| **05, 15, 23, 29, 38, 42** | 152 | 5/5   | 23 appeared 7x in last 20 draws |

---

### #5 — Gap Fillers

| Numbers                    | Sum | Zones | Rationale                         |
| -------------------------- | --- | ----- | --------------------------------- |
| **03, 12, 18, 27, 35, 40** | 135 | 5/5   | Underrepresented in other tickets |

---

### #6 — Remaining Coverage

| Numbers                    | Sum | Zones | Rationale           |
| -------------------------- | --- | ----- | ------------------- |
| **06, 13, 21, 31, 36, 39** | 146 | 5/5   | Fill remaining gaps |

---

## Quick Reference

| #   | Combination         | Sum | Strategy           |
| --- | ------------------- | --- | ------------------ |
| 1   | `02-10-20-28-37-45` | 142 | Full Zone Spread   |
| 2   | `04-16-22-30-41-44` | 157 | Recent Hot         |
| 3   | `01-07-19-24-34-43` | 128 | All-Time Leaders   |
| 4   | `05-15-23-29-38-42` | 152 | Ultra-Hot 23       |
| 5   | `03-12-18-27-35-40` | 135 | Gap Fillers        |
| 6   | `06-13-21-31-36-39` | 146 | Remaining Coverage |

**6 tickets cover 36 unique numbers out of 45** (80% coverage).
**Missing:** 8, 9, 11, 14, 17, 25, 26, 32, 33

---

## Copy-Paste Ready

### All 6 Tickets (space-separated)

```
02 10 20 28 37 45
04 16 22 30 41 44
01 07 19 24 34 43
05 15 23 29 38 42
03 12 18 27 35 40
06 13 21 31 36 39
```

### Comma-separated format

```
02, 10, 20, 28, 37, 45
04, 16, 22, 30, 41, 44
01, 07, 19, 24, 34, 43
05, 15, 23, 29, 38, 42
03, 12, 18, 27, 35, 40
06, 13, 21, 31, 36, 39
```

### Single line (all tickets)

```
02-10-20-28-37-45 | 04-16-22-30-41-44 | 01-07-19-24-34-43 | 05-15-23-29-38-42 | 03-12-18-27-35-40 | 06-13-21-31-36-39
```

---

## Odds Reality Check

| Match         | Odds per ticket | With 6 tickets |
| ------------- | --------------- | -------------- |
| 6/6 (Jackpot) | 1 in 8,145,060  | 1 in 1,357,510 |
| 5/6           | 1 in 34,808     | 1 in 5,801     |
| 4/6           | 1 in 733        | 1 in 122       |
| 3/6           | 1 in 45         | ~1 in 7.5      |

**Expected outcome:** Most likely 0-2 matches per ticket. ~13% chance of at least one 3/6 win (~30K VND).

---

> **Disclaimer:** Lottery is purely random. Each draw is independent — past results have zero predictive power. Coverage strategy doesn't increase win probability, only ensures if winning numbers fall in our pool, we have tickets that include them. Odds remain terrible. Play responsibly.
