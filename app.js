// Pharmacy Clinical Calculator
// Pure client-side. No dependencies.

const LB_PER_KG = 2.20462;
const IN_PER_CM = 0.393701;

let units = "us"; // "us" | "si"

const el = (id) => document.getElementById(id);

const inputs = {
  age: el("age"),
  weight: el("weight"),
  height: el("height"),
  scr: el("scr"),
};

// --- Unit handling ---------------------------------------------------------

function setUnits(next) {
  units = next;
  el("unit-us").classList.toggle("active", units === "us");
  el("unit-si").classList.toggle("active", units === "si");
  el("weight-label").textContent = units === "us" ? "Weight (lb)" : "Weight (kg)";
  el("height-label").textContent = units === "us" ? "Height (in)" : "Height (cm)";
  inputs.weight.placeholder = units === "us" ? "e.g. 187" : "e.g. 85";
  inputs.height.placeholder = units === "us" ? "e.g. 70" : "e.g. 178";
  calculate();
}

// Returns weight in kg, or NaN
function weightKg() {
  const v = parseFloat(inputs.weight.value);
  if (!isFinite(v) || v <= 0) return NaN;
  return units === "us" ? v / LB_PER_KG : v;
}

// Returns height in cm, or NaN
function heightCm() {
  const v = parseFloat(inputs.height.value);
  if (!isFinite(v) || v <= 0) return NaN;
  return units === "us" ? v / IN_PER_CM : v;
}

function getSex() {
  return document.querySelector('input[name="sex"]:checked').value;
}

// --- Clinical formulas ------------------------------------------------------

// Mosteller BSA (m^2): sqrt(height_cm * weight_kg / 3600)
function bsaMosteller(kg, cm) {
  return Math.sqrt((cm * kg) / 3600);
}

function bmi(kg, cm) {
  const m = cm / 100;
  return kg / (m * m);
}

function bmiCategory(value) {
  if (value < 18.5) return "Underweight";
  if (value < 25) return "Normal";
  if (value < 30) return "Overweight";
  return "Obese";
}

// Devine ideal body weight (kg). Height must be > 60 in (152.4 cm) for the
// standard add-on; below that we floor the add-on at 0.
function ibwDevine(sex, cm) {
  const inchesOver60 = Math.max(0, cm * IN_PER_CM - 60);
  const base = sex === "male" ? 50 : 45.5;
  return base + 2.3 * inchesOver60;
}

// Adjusted body weight (kg). Convention: only meaningful when actual > 1.2*IBW.
function adjBodyWeight(actualKg, ibw) {
  return ibw + 0.4 * (actualKg - ibw);
}

// Cockcroft-Gault creatinine clearance (mL/min).
// Uses adjusted body weight when patient is obese (actual > 1.2*IBW),
// ideal when at/above IBW, and actual when underweight — a common convention.
function cockcroftGault(age, sex, scr, actualKg, ibw) {
  let dosingWeight = actualKg;
  let weightUsed = "actual wt";
  if (actualKg > 1.2 * ibw) {
    dosingWeight = adjBodyWeight(actualKg, ibw);
    weightUsed = "adjusted wt";
  } else if (actualKg > ibw) {
    dosingWeight = ibw;
    weightUsed = "ideal wt";
  }
  const sexFactor = sex === "female" ? 0.85 : 1;
  const crcl = ((140 - age) * dosingWeight * sexFactor) / (72 * scr);
  return { crcl, weightUsed };
}

// --- Render -----------------------------------------------------------------

function fmt(value, digits = 1) {
  return isFinite(value) ? value.toFixed(digits) : "—";
}

function calculate() {
  const age = parseFloat(inputs.age.value);
  const scr = parseFloat(inputs.scr.value);
  const sex = getSex();
  const kg = weightKg();
  const cm = heightCm();

  // BMI
  if (isFinite(kg) && isFinite(cm)) {
    const b = bmi(kg, cm);
    el("r-bmi").textContent = fmt(b, 1);
    el("r-bmi-note").textContent = `kg/m² · ${bmiCategory(b)}`;
  } else {
    el("r-bmi").textContent = "—";
    el("r-bmi-note").textContent = "kg/m²";
  }

  // BSA
  el("r-bsa").textContent =
    isFinite(kg) && isFinite(cm) ? fmt(bsaMosteller(kg, cm), 2) : "—";

  // IBW
  let ibw = NaN;
  if (isFinite(cm)) {
    ibw = ibwDevine(sex, cm);
    el("r-ibw").textContent = fmt(ibw, 1);
  } else {
    el("r-ibw").textContent = "—";
  }

  // AdjBW
  if (isFinite(kg) && isFinite(ibw)) {
    if (kg > 1.2 * ibw) {
      el("r-abw").textContent = fmt(adjBodyWeight(kg, ibw), 1);
      el("r-abw-note").textContent = "obese: actual > 1.2×IBW";
    } else {
      el("r-abw").textContent = "n/a";
      el("r-abw-note").textContent = "actual ≤ 1.2×IBW";
    }
  } else {
    el("r-abw").textContent = "—";
    el("r-abw-note").textContent = "used when actual > 1.2×IBW";
  }

  // CrCl
  if (isFinite(age) && isFinite(scr) && scr > 0 && isFinite(kg) && isFinite(ibw)) {
    const { crcl, weightUsed } = cockcroftGault(age, sex, scr, kg, ibw);
    el("r-crcl").textContent = `${fmt(crcl, 1)} mL/min`;
    el("r-crcl-note").textContent = `Cockcroft-Gault · ${weightUsed}`;
  } else {
    el("r-crcl").textContent = "—";
    const needsScr = !(isFinite(scr) && scr > 0);
    el("r-crcl-note").textContent = needsScr
      ? "needs serum creatinine"
      : "needs age, weight & height";
  }
}

// --- Wiring -----------------------------------------------------------------

el("unit-us").addEventListener("click", () => setUnits("us"));
el("unit-si").addEventListener("click", () => setUnits("si"));
document.getElementById("calc-form").addEventListener("input", calculate);

calculate();
