# Pharmacy Clinical Calculator

A fast, no-dependency bedside calculator for common pharmacy clinical math. Type the patient's values and every result updates live.

**[Live demo →](https://asharaali.github.io/pharmacy-clinical-calc/)** (enable GitHub Pages on the `main` branch)

## What it calculates

| Tool | Formula |
|------|---------|
| **Creatinine Clearance** | Cockcroft-Gault, with automatic weight selection (actual / ideal / adjusted) |
| **BMI** | weight ÷ height² + category |
| **Body Surface Area** | Mosteller |
| **Ideal Body Weight** | Devine |
| **Adjusted Body Weight** | IBW + 0.4 × (actual − IBW), shown when actual > 1.2 × IBW |

## Why it's useful

- **Renal dosing** — many drugs are cleared by the kidneys, so the dose depends on creatinine clearance. Low CrCl → reduce or space out the dose (e.g. enoxaparin, DOACs, many antibiotics, gabapentin).
- **Weight-based dosing** — obese patients shouldn't be dosed on actual weight for certain drugs; ideal/adjusted weight prevents overdosing (e.g. vancomycin, aminoglycosides).
- **BSA dosing** — chemotherapy and several other agents are dosed per m² of body surface area, not by weight.
- **BMI screening** — eligibility and dosing decisions, including GLP-1 (semaglutide/tirzepatide) coverage thresholds.
- **Speed** — replaces juggling four separate formulas; everything updates live as you type.

## Who it's for

- **Pharmacy students & interns** — check your work and learn the weight-selection rules.
- **Pharmacists** — a quick bedside number without opening a heavier clinical system.
- **Prescribers & nurses** — sanity-check a renal or weight-based dose at the point of care.
- **Patients** — understand their own BMI, body-weight, and kidney-function numbers.

### Weight selection for Cockcroft-Gault
- Actual ≤ IBW → **actual weight**
- IBW < actual ≤ 1.2 × IBW → **ideal weight**
- Actual > 1.2 × IBW → **adjusted weight**

This is a common dosing convention; institutions vary — always follow your protocol.

## Features
- US (lb/in) and metric (kg/cm) units with one-click toggle
- Live recalculation as you type — no buttons
- 100% client-side, works offline, no tracking
- Single HTML/CSS/JS, no build step

## Run locally
```bash
git clone git@github.com:asharaali/pharmacy-clinical-calc.git
cd pharmacy-clinical-calc
open index.html   # or just double-click it
```

## Disclaimer
Educational tool only. Not a substitute for clinical judgment or institutional dosing protocols. Verify all results against a primary reference.

---
Built by [Ashar Ali](https://github.com/asharaali).
