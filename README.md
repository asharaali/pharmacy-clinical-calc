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
