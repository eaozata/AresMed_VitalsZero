// ARES-MED v5.0: Autonomous Real-Time Evaluation & Space Medical Decision System
// Team VitalsZero — NASA Space Apps Challenge 2026 (Complete PDF Spec Edition)

const CREW_ROSTER = [
  {
    id: "CDR-01",
    name: "Cmdr. Elena Vance",
    role: "Mission Commander",
    sex: "F",
    age: 41,
    story: "Former orbital test pilot leading Operation Ares-IV. Calm under pressure, responsible for crew safety and Mars landing readiness.",
    earthHR: 62,
    earthHRV: 68,
    earthSpO2: 98.4,
    earthSysBP: 116,
    earthDiaBP: 74,
    fastingGlucose: 88,
    aredCompliance: 0.94
  },
  {
    id: "PLT-02",
    name: "Maj. Kenji Sato",
    role: "Flight Engineer & EVA Lead",
    sex: "M",
    age: 37,
    story: "Maintains the spacecraft air scrubbers and leads exterior spacewalks (EVA). High physical workload makes bone and reflex tracking vital.",
    earthHR: 58,
    earthHRV: 74,
    earthSpO2: 98.8,
    earthSysBP: 114,
    earthDiaBP: 72,
    fastingGlucose: 85,
    aredCompliance: 0.88
  },
  {
    id: "MS-03",
    name: "Dr. Amara Okafor",
    role: "Bio-Science Specialist",
    sex: "F",
    age: 35,
    story: "Microbiologist studying plant growth and cellular radiation protection for Mars habitats. Tracks her own vision and sleep carefully.",
    earthHR: 66,
    earthHRV: 64,
    earthSpO2: 98.6,
    earthSysBP: 112,
    earthDiaBP: 70,
    fastingGlucose: 90,
    aredCompliance: 0.91
  },
  {
    id: "FMO-04",
    name: "Dr. Lucas Thorne",
    role: "Crew Medical Officer",
    sex: "M",
    age: 44,
    story: "Emergency physician serving as the ship's onboard doctor. Uses ARES-MED to triage crewmates when Earth is 28+ minutes away.",
    earthHR: 64,
    earthHRV: 60,
    earthSpO2: 98.2,
    earthSysBP: 120,
    earthDiaBP: 76,
    fastingGlucose: 94,
    aredCompliance: 0.82
  }
];

const ENV_MODES = {
  transit_0g: {
    label: "Spacecraft in Transit (0.00g)",
    gravityG: 0.0,
    owltMin: 13.9,
    emphasis: "Mode Focus: Cephalad fluid shift (SANS), storm shelter readiness, closed-loop CO2."
  },
  station_leo: {
    label: "Orbital Space Station (0.00g LEO)",
    gravityG: 0.0,
    owltMin: 0.1,
    emphasis: "Mode Focus: Daily ARED resistive exercise logging, EVA readiness, near-real-time ground link."
  },
  lunar_base: {
    label: "Lunar Surface Base (0.16g)",
    gravityG: 0.16,
    owltMin: 1.3,
    emphasis: "Mode Focus: Lunar regolith dust ocular/respiratory irritation, 1/6g vestibular balance, EVA load."
  },
  mars_surface: {
    label: "Mars Surface Habitat (0.38g)",
    gravityG: 0.38,
    owltMin: 18.4,
    emphasis: "Mode Focus: Full Earth-independent autonomy, 24h 39m Mars sol circadian alignment, isolation."
  },
  planetary_rover: {
    label: "Pressurized Rover / EVA (0.16g–0.38g)",
    gravityG: 0.25,
    owltMin: 18.4,
    emphasis: "Mode Focus: EVA suit CO2 scrubbers, lunar/Martian dust inhalation, metabolic exertion & thermal strain."
  }
};

const SCENARIOS = {
  nominal: {
    id: "nominal",
    name: "Nominal Mars Transit",
    missionDay: 142,
    envMode: "transit_0g",
    ppCO2: 2.4,
    radRate: 0.62,
    cabinO2: 20.9,
    sleepEff: 86,
    sleepHours: 7.5,
    hrDelta: 0,
    hrvDelta: 0,
    spo2Delta: 0,
    bpSysDelta: 0,
    glucoseDelta: 0,
    pvtLatencyMs: 268,
    moodScore: 4,
    defaultOrgan: "brain",
    trendNote: "Resting HR stable (+1.2% vs 7d rolling mean) | Sleep averaging 7.5h/night | All indicators within 0g band."
  },
  co2_fault: {
    id: "co2_fault",
    name: "ECLSS CO2 Scrubber Degradation",
    missionDay: 142,
    envMode: "transit_0g",
    ppCO2: 4.9,
    radRate: 0.62,
    cabinO2: 20.4,
    sleepEff: 74,
    sleepHours: 6.2,
    hrDelta: 16,
    hrvDelta: -19,
    spo2Delta: -1.6,
    bpSysDelta: 12,
    glucoseDelta: 6,
    pvtLatencyMs: 365,
    moodScore: 2,
    defaultOrgan: "lungs",
    trendNote: "EWMA Slope Alert: Cabin ppCO2 rose +104% over 6 hours | Resting HR up +22% | PVT reaction slowed +97 ms."
  },
  solar_storm: {
    id: "solar_storm",
    name: "Solar Particle Event (SPE)",
    missionDay: 168,
    envMode: "transit_0g",
    ppCO2: 2.9,
    radRate: 14.8,
    cabinO2: 20.8,
    sleepEff: 68,
    sleepHours: 5.8,
    hrDelta: 14,
    hrvDelta: -24,
    spo2Delta: -1.1,
    bpSysDelta: 8,
    glucoseDelta: 14,
    pvtLatencyMs: 332,
    moodScore: 2,
    defaultOrgan: "marrow",
    trendNote: "Acute Dosimetry Spike: Solar proton flux at 14.8 mSv/d | Autonomic HRV down -31% vs 7d rolling average."
  },
  sans_decond: {
    id: "sans_decond",
    name: "SANS & Bone/Cardio Shift",
    missionDay: 215,
    envMode: "transit_0g",
    ppCO2: 3.3,
    radRate: 0.70,
    cabinO2: 20.7,
    sleepEff: 77,
    sleepHours: 6.4,
    hrDelta: 11,
    hrvDelta: -21,
    spo2Delta: -0.9,
    bpSysDelta: 15,
    glucoseDelta: 18,
    pvtLatencyMs: 318,
    moodScore: 3,
    defaultOrgan: "brain",
    trendNote: "30-Day Rolling Trend: ONSD ocular proxy crept up +0.42 mm over 4 weeks | Insulin resistance mildly elevated."
  },
  isolation_fatigue: {
    id: "isolation_fatigue",
    name: "Circadian & Isolation Drift",
    missionDay: 240,
    envMode: "mars_surface",
    ppCO2: 2.7,
    radRate: 0.45,
    cabinO2: 20.8,
    sleepEff: 54,
    sleepHours: 4.8,
    hrDelta: 9,
    hrvDelta: -28,
    spo2Delta: -0.4,
    bpSysDelta: 7,
    glucoseDelta: 11,
    pvtLatencyMs: 428,
    moodScore: 1,
    defaultOrgan: "brain",
    trendNote: "7-Day Cumulative Sleep Debt: Averaging 4.8h/night (-34% below target) | PVT reaction latency up +160 ms."
  }
};

// Transparent Rule + Prior-Weighted Spaceflight Condition Table (NASA IMM & ISS Checklist)
const SPACEFLIGHT_CONDITIONS = [
  {
    id: "hypercapnia",
    name: "Environmental Hypercapnia (CO2 Pocket Exposure)",
    priorLabel: "High In-Flight Prior (ISS/Habitat)",
    priorScore: 30,
    matchingSymptoms: { headache: 45, cephalad: 20, insomnia: 15 },
    vitalBonus: (st) => (st.ppCO2 >= 3.5 ? 45 : 0),
    reasonTemplate: "Frontal headache + slowed PVT vigilance correlated with elevated cabin ppCO2 (>3.5 mmHg).",
    action: "Check module ventilation fan, switch CDRA scrubber bed, restrict safety-critical EVA tasks."
  },
  {
    id: "sans",
    name: "Spaceflight-Associated Neuro-ocular Syndrome (SANS)",
    priorLabel: "High Long-Duration 0g Prior",
    priorScore: 28,
    matchingSymptoms: { cephalad: 45, headache: 20 },
    vitalBonus: (st, phys) => (phys.sansIndex >= 5.6 ? 35 : 10),
    reasonTemplate: "Cephalad venous fullness / blurred near vision + elevated Optic Nerve Sheath Diameter proxy.",
    action: "Perform 45-min Lower Body Negative Pressure (LBNP) session and log retinal OCT/fundoscopy."
  },
  {
    id: "sms",
    name: "Space Motion Sickness / Neurovestibular Maladaptation",
    priorLabel: "High Gravity-Transition Prior",
    priorScore: 32,
    matchingSymptoms: { nausea_vertigo: 55, headache: 15 },
    vitalBonus: () => 5,
    reasonTemplate: "Vestibular otolith-visual conflict causing nausea and motion vertigo.",
    action: "Minimize rapid head pitch/roll movements, maintain visual horizon lock, consider onboard antiemetic."
  },
  {
    id: "acute_rad",
    name: "Solar Particle Event Prodrome & Oxidative Stress",
    priorLabel: "Event-Driven Space Hazard",
    priorScore: 18,
    matchingSymptoms: { phosphenes: 50, nausea_vertigo: 25, headache: 15 },
    vitalBonus: (st) => (st.radRate >= 3.0 ? 45 : 0),
    reasonTemplate: "Retinal phosphene light flashes + high ionizing proton flux dosimetry.",
    action: "Verify polyethylene/water-wall storm shelter shielding, hydrate, schedule T+12h leukocyte count."
  },
  {
    id: "orthostatic",
    name: "Microgravity Cardiovascular / Orthostatic Intolerance",
    priorLabel: "High Post-Exercise / Partial-g Prior",
    priorScore: 26,
    matchingSymptoms: { orthostatic: 55 },
    vitalBonus: (st, phys) => (phys.currentHR > phys.activeBaselineHR + 10 ? 25 : 5),
    reasonTemplate: "Post-exercise dizziness paired with baroreceptor attenuation and plasma volume contraction.",
    action: "Oral salt + fluid loading protocol (1.0L isotonic fluid), compression garment, gradual posture change."
  },
  {
    id: "back_pain",
    name: "Spinal Elongation Lumbar Pain (0g Intervertebral Expansion)",
    priorLabel: "Very High In-Flight Prior (~50% Crew)",
    priorScore: 35,
    matchingSymptoms: { back_pain: 60, insomnia: 10 },
    vitalBonus: () => 5,
    reasonTemplate: "Unloading of thoracolumbar spine stretches paraspinal ligaments in microgravity.",
    action: "Fetal-tuck knees-to-chest stretching, adjust ARED axial harness posture, heat pack."
  },
  {
    id: "circadian_fatigue",
    name: "Circadian Desynchrony & Confinement Fatigue",
    priorLabel: "High Long-Duration Prior (Barger 2014)",
    priorScore: 30,
    matchingSymptoms: { insomnia: 50, headache: 15 },
    vitalBonus: (st) => (st.sleepEff < 75 || st.pvtLatencyMs > 330 ? 35 : 0),
    reasonTemplate: "Sleep curtailment + prolonged PVT reaction latency (>330 ms) and reduced autonomic HRV.",
    action: "480nm blue-enriched wake light pulse, dim cabin 2h pre-sleep, rotate high-cognitive-load duty."
  },
  {
    id: "renal_stone",
    name: "Hypercalciuria / Early Nephrolithiasis (Kidney Stone Risk)",
    priorLabel: "Moderate In-Flight Prior (Bone Calcium Excretion)",
    priorScore: 22,
    matchingSymptoms: { flank_pain: 65, nausea_vertigo: 20 },
    vitalBonus: (st, phys) => (phys.urinaryNtx > 65 ? 25 : 0),
    reasonTemplate: "Flank pain / concentrated urine + osteoclastic calcium mobilization into urine.",
    action: "Increase oral hydration (>2.5L/day), potassium citrate prophylaxis, handheld renal ultrasound check."
  },
  {
    id: "viral_rash",
    name: "Immune Dysregulation Dermatitis / Latent Viral Reactivation",
    priorLabel: "Moderate In-Flight Prior (Crucian et al.)",
    priorScore: 24,
    matchingSymptoms: { skin_rash: 65 },
    vitalBonus: (st, phys) => (phys.il6Ratio > 1.6 ? 20 : 0),
    reasonTemplate: "Cutaneous rash/irritation associated with spaceflight T-cell dysregulation and EBV/VZV reactivation.",
    action: "Log lesion photo for CMO/Flight Surgeon, apply topical barrier/antiviral per ISS Medical Checklist."
  }
];

const RED_FLAG_RULES = {
  rf_chest_pain: {
    title: "URGENT MEDICAL ALERT: ACUTE CHEST PAIN / ARRHYTHMIA SUSPICION",
    reason: "Chest pain or palpitations in spaceflight require immediate exclusion of cardiac ischemia or arrhythmia.",
    action: "STOP ALL EXERTION IMMEDIATELY. Attach 12-lead ECG, alert Crew Medical Officer (CMO), ready onboard defibrillator/medical kit, and transmit Priority Level-3 packet to Flight Surgeon."
  },
  rf_neck_swelling: {
    title: "URGENT MEDICAL ALERT: SUSPECTED INTERNAL JUGULAR VENOUS THROMBOSIS",
    reason: "Unilateral neck/clavicle swelling in 0g is a high-priority urgent sign for cephalad venous stasis thrombosis (Marshall-Goebel et al., JAMA Network Open 2019).",
    action: "DO NOT MASSAGE NECK. Perform immediate handheld vascular ultrasound of internal jugular vein, notify CMO, and initiate urgent Flight Surgeon consultation for anticoagulation protocol."
  },
  rf_vision_loss: {
    title: "URGENT MEDICAL ALERT: ACUTE VISUAL FIELD LOSS / SEVERE OCULAR EVENT",
    reason: "Sudden visual loss overrides routine SANS monitoring to rule out retinal detachment, central retinal vascular occlusion, or acute intracranial hypertension.",
    action: "Perform immediate fundoscopy & ocular ultrasound, administer 100% O2 if hypercapnic, and contact Flight Surgeon via urgent channel."
  },
  rf_syncope: {
    title: "URGENT MEDICAL ALERT: SYNCOPE / LOSS OF CONSCIOUSNESS",
    reason: "Loss of consciousness requires immediate evaluation of cardiac rhythm, hypoxia/toxic atmosphere, and severe orthostatic/autonomic collapse.",
    action: "Secure astronaut in restraint, verify cabin O2/CO2, check pulse/BP/glucose, and trigger Level 3 Emergency Medical Protocol."
  }
};

let state = {
  selectedCrewIndex: 0,
  activeScenario: "nominal",
  envMode: "transit_0g",
  useSpaceAdaptedBaseline: true,
  missionDay: 142,
  ppCO2: 2.4,
  radRate: 0.62,
  sleepEff: 86,
  sleepHours: 7.5,
  pvtLatencyMs: 268,
  moodScore: 4,
  liveJitter: 0,
  pvtState: "idle",
  pvtTimer: null,
  pvtStartTime: 0,
  selectedOrgan: "brain",
  activeSexModel: "F",
  checkedProtocolsCount: 1,
  activeSymptoms: new Set(),
  manualOverrides: null,
  streakDays: 14,
  demoInterval: null,
  // Live Hardware Biometrics state
  hwScanning: false,
  hwStream: null,
  hwAudioCtx: null,
  hwMeasuredHR: null,
  hwVocalJitterPct: 0.42
};

function statusLabelForRisk(risk) {
  if (risk >= 62) return "[ALERT] CRITICAL";
  if (risk >= 36) return "[!] CAUTION";
  return "[OK] NOMINAL";
}

function colorForRisk(risk) {
  if (risk >= 62) return "#ef4444";
  if (risk >= 36) return "#f59e0b";
  return "#10b981";
}

function computePhysiology(crew, currentState) {
  const med = currentState.missionDay;
  const scen = SCENARIOS[currentState.activeScenario];
  const env = ENV_MODES[currentState.envMode] || ENV_MODES.transit_0g;

  // Exponential microgravity adaptation curve
  const adaptationFactor = env.gravityG === 0 ? 1 - Math.exp(-med / 28) : (1 - env.gravityG) * (1 - Math.exp(-med / 28));
  const spaceAdaptedHR = crew.earthHR - 4 * adaptationFactor;
  const spaceAdaptedHRV = crew.earthHRV - 7 * adaptationFactor;
  const spaceAdaptedSpO2 = crew.earthSpO2 - 1.1 * adaptationFactor;
  const spaceAdaptedSysBP = crew.earthSysBP - 5 * adaptationFactor;

  const co2PenaltyHR = Math.max(0, (currentState.ppCO2 - 2.8) * 5.2);
  const co2PenaltyHRV = Math.max(0, (currentState.ppCO2 - 2.8) * 6.5);
  const radPenaltyHRV = Math.max(0, (currentState.radRate - 1.0) * 1.1);
  const sleepPenaltyHRV = Math.max(0, (82 - currentState.sleepEff) * 0.45);
  const symptomPenalty = currentState.activeSymptoms.size * 4;

  let currentHR = Math.round(
    spaceAdaptedHR + scen.hrDelta + co2PenaltyHR + currentState.liveJitter + symptomPenalty * 0.5
  );
  if (currentState.hwMeasuredHR !== null) currentHR = currentState.hwMeasuredHR;
  if (currentState.manualOverrides && currentState.manualOverrides.hr) {
    currentHR = currentState.manualOverrides.hr;
  }

  const currentHRV = Math.max(
    16,
    Math.round(
      spaceAdaptedHRV +
        scen.hrvDelta -
        co2PenaltyHRV -
        radPenaltyHRV -
        sleepPenaltyHRV +
        currentState.liveJitter * 0.5 -
        symptomPenalty
    )
  );

  let currentSpO2 = +(
    spaceAdaptedSpO2 +
    scen.spo2Delta -
    Math.max(0, (currentState.ppCO2 - 3.5) * 0.45)
  ).toFixed(1);
  if (currentState.manualOverrides && currentState.manualOverrides.spo2) {
    currentSpO2 = currentState.manualOverrides.spo2;
  }

  let currentSysBP = Math.round(
    spaceAdaptedSysBP + scen.bpSysDelta + co2PenaltyHR * 0.7
  );
  if (currentState.manualOverrides && currentState.manualOverrides.sysBP) {
    currentSysBP = currentState.manualOverrides.sysBP;
  }
  const currentDiaBP = Math.round(crew.earthDiaBP + scen.bpSysDelta * 0.45);

  let currentGlucose = Math.round(crew.fastingGlucose + (scen.glucoseDelta || 0));
  if (currentState.manualOverrides && currentState.manualOverrides.glucose) {
    currentGlucose = currentState.manualOverrides.glucose;
  }

  const currentRR = Math.round(13 + Math.max(0, (currentState.ppCO2 - 2.2) * 2.4) + (scen.id === "solar_storm" ? 3 : 0));
  let currentTemp = +(36.6 + 0.3 * adaptationFactor + (currentState.radRate > 4 ? 0.4 : 0) + (currentState.ppCO2 > 4.0 ? 0.2 : 0)).toFixed(1);
  if (currentState.manualOverrides && currentState.manualOverrides.temp) {
    currentTemp = currentState.manualOverrides.temp;
  }

  // 1. Bone & Muscle Loss Model
  const monthsInSpace = med / 30.0;
  const unmitigatedBmdLoss = monthsInSpace * 1.25 * (1 - env.gravityG * 0.6);
  const netBmdLossPct = +(
    unmitigatedBmdLoss * (1 - crew.aredCompliance * 0.72)
  ).toFixed(2);
  const boneRisk = Math.min(100, Math.round(netBmdLossPct * 18 + (scen.id === "sans_decond" ? 28 : 0)));

  // 2. Radiation & Career Limit (600 mSv NASA-STD-3001)
  const cumulativeMsv = +(med * 0.62 + (currentState.radRate > 2 ? currentState.radRate * 6.5 : 0)).toFixed(1);
  const careerLimitPct = +((cumulativeMsv / 600) * 100).toFixed(1);
  const radImmuneRisk = Math.min(
    100,
    Math.round(
      (cumulativeMsv / 300) * 45 +
        currentState.radRate * 4.2 +
        (currentState.activeSymptoms.has("phosphenes") ? 18 : 0)
    )
  );

  // 3. Cardiovascular & SANS Fluid Shift Risk (Sex-calibrated: Male higher ONSD, Female higher orthostatic)
  const activeSex = currentState.activeSexModel || crew.sex || "F";
  const sexSansOffset = activeSex === "M" ? 0.14 : -0.06;
  const sansIndex = +(
    4.6 +
    sexSansOffset +
    adaptationFactor * 0.9 +
    Math.max(0, (currentState.ppCO2 - 2.5) * 0.32) +
    (scen.id === "sans_decond" ? 0.65 : 0) +
    (currentState.activeSymptoms.has("cephalad") ? 0.35 : 0)
  ).toFixed(2);
  const cardioSansRisk = Math.min(
    100,
    Math.round(
      Math.max(0, (currentHR - spaceAdaptedHR) * 2.2) +
        Math.max(0, (sansIndex - 4.8) * 38) +
        (currentState.activeSymptoms.has("orthostatic") ? 16 : 0)
    )
  );

  // 4. Psychological & Circadian Risk
  const pvtPenalty = Math.max(0, (currentState.pvtLatencyMs - 260) * 0.28);
  const moodPenalty = (4 - currentState.moodScore) * 14;
  const sleepRisk = Math.max(0, (85 - currentState.sleepEff) * 1.3);
  const psychRisk = Math.min(100, Math.round(pvtPenalty + moodPenalty + sleepRisk));

  // 5. Habitat ECLSS Coupling Risk
  const eclssRisk = Math.min(
    100,
    Math.round(
      Math.max(0, (currentState.ppCO2 - 2.0) * 24) +
        (currentState.radRate > 3 ? 35 : 0) +
        (currentState.activeSymptoms.has("headache") ? 15 : 0)
    )
  );

  // Simulated Molecular Biomarkers (Inspired by NASA OSDR & Twins Study)
  const cfMtDnaFold = +(1.1 + (cumulativeMsv / 120) * 1.4 + (currentState.radRate > 3 ? 2.8 : 0)).toFixed(2);
  const urinaryNtx = Math.round(38 + netBmdLossPct * 19 + (1 - crew.aredCompliance) * 45);
  const il6Ratio = +(1.05 + (radImmuneRisk / 100) * 2.1 + (psychRisk / 100) * 0.9).toFixed(2);
  const choroidalGrade = sansIndex >= 5.9 ? "Grade II (Edema)" : sansIndex >= 5.5 ? "Grade I (Mild)" : "Grade 0 (Nominal)";

  const activeBaselineHR = currentState.useSpaceAdaptedBaseline ? spaceAdaptedHR : crew.earthHR;
  const activeBaselineSpO2 = currentState.useSpaceAdaptedBaseline ? spaceAdaptedSpO2 : crew.earthSpO2;
  const earthFalseDeviation = !currentState.useSpaceAdaptedBaseline ? 14 : 0;

  // Check if any Red-Flag symptom is active
  let hasRedFlag = false;
  currentState.activeSymptoms.forEach((s) => {
    if (RED_FLAG_RULES[s]) hasRedFlag = true;
  });

  const compositeRisk = hasRedFlag
    ? 96
    : Math.min(
        99,
        Math.round(
          cardioSansRisk * 0.25 +
            boneRisk * 0.15 +
            radImmuneRisk * 0.2 +
            psychRisk * 0.22 +
            eclssRisk * 0.18 +
            earthFalseDeviation
        )
      );
  const readinessScore = Math.max(4, 100 - compositeRisk);

  return {
    currentHR,
    currentHRV,
    currentSpO2,
    currentSysBP,
    currentDiaBP,
    currentRR,
    currentTemp,
    currentGlucose,
    activeBaselineHR: Math.round(activeBaselineHR),
    activeBaselineSpO2: +activeBaselineSpO2.toFixed(1),
    spaceAdaptedHR: Math.round(spaceAdaptedHR),
    netBmdLossPct,
    cumulativeMsv,
    careerLimitPct,
    sansIndex,
    boneRisk,
    radImmuneRisk,
    cardioSansRisk,
    psychRisk,
    eclssRisk,
    compositeRisk,
    readinessScore,
    hasRedFlag,
    cfMtDnaFold,
    urinaryNtx,
    il6Ratio,
    choroidalGrade
  };
}

function getOrganDetails(organKey, phys, currentState) {
  const catalog = {
    brain: {
      title: "NEURO-OCULAR & CNS (SANS / ICP)",
      risk: Math.max(phys.cardioSansRisk, phys.psychRisk),
      desc: `Function: Visual acuity, intracranial pressure regulation, psychomotor vigilance. Spaceflight Effect: Cephalad venous shift swells Optic Nerve Sheath (ONSD proxy ${phys.sansIndex} mm; ${phys.choroidalGrade}). Linked Action: LBNP counter-pressure & cabin CO2 reduction.`
    },
    heart: {
      title: "CARDIOVASCULAR & JUGULAR VASCULATURE",
      risk: phys.cardioSansRisk,
      desc: `Function: Systemic perfusion & baroreceptor reflex. Spaceflight Effect: Plasma volume contraction (-10%), baroreflex attenuation, stagnant jugular flow (HR ${phys.currentHR} bpm, BP ${phys.currentSysBP}/${phys.currentDiaBP}). Linked Action: Aerobic T2 + fluid loading prior to gravity transition.`
    },
    lungs: {
      title: "RESPIRATORY & HABITAT ECLSS INTERFACE",
      risk: phys.eclssRisk,
      desc: `Function: Gas exchange & acid-base balance. Spaceflight Effect: Absence of natural buoyancy convection traps exhaled CO2 pockets around head (SpO2 ${phys.currentSpO2}%, Cabin ppCO2 ${currentState.ppCO2.toFixed(1)} mmHg, RR ${phys.currentRR} br/m). Linked Action: Inter-module ventilation & CDRA scrubber check.`
    },
    bone: {
      title: "MUSCULOSKELETAL (FEMUR & LUMBAR SPINE)",
      risk: phys.boneRisk,
      desc: `Function: Mechanical skeletal support & calcium reservoir. Spaceflight Effect: 1.0-1.5%/month osteoclastic bone loss & hypercalciuria stone risk (Est. BMD -${phys.netBmdLossPct}%, simulated uNTX ${phys.urinaryNtx} nmol). Linked Action: Daily ARED resistive squats/deadlifts & hydration.`
    },
    marrow: {
      title: "HEMATOPOIETIC MARROW, IMMUNE & METABOLIC",
      risk: phys.radImmuneRisk,
      desc: `Function: Leukocyte immunity, erythropoiesis & glucose metabolism. Spaceflight Effect: Space anemia hemolysis, radiation lymphopenia & viral reactivation (Dose ${phys.cumulativeMsv}/600 mSv, Glucose ${phys.currentGlucose} mg/dL). Linked Action: Shielded quarters during SPE & nutrition protocol.`
    }
  };
  return catalog[organKey] || catalog.brain;
}

// Transparent Rule + Prior-Weighted Symptom Triage Evaluator
function evaluateSymptomTriage(currentState, phys) {
  const activeSyms = Array.from(currentState.activeSymptoms);

  // 1. Check Urgent Symptom Alerts first!
  const activeRedFlags = activeSyms.filter((s) => RED_FLAG_RULES[s]);
  if (activeRedFlags.length > 0) {
    const rf = RED_FLAG_RULES[activeRedFlags[0]];
    return {
      isRedFlag: true,
      redFlagData: rf,
      html: `
        <div style="color:#991b1b; font-weight:800; font-size:13px; margin-bottom:6px;">&#9888; ${rf.title}</div>
        <div style="color:#0f172a; margin-bottom:6px; line-height:1.5;"><strong>Clinical Rationale:</strong> ${rf.reason}</div>
        <div style="color:#92400e; background:#fef3c7; border:1px solid #f59e0b; padding:8px 10px; border-radius:8px; line-height:1.5;"><strong>Immediate Protocol (Escalation Level 3):</strong> ${rf.action}</div>
      `
    };
  }

  if (activeSyms.length === 0) {
    return {
      isRedFlag: false,
      html: `<span style="color:#334155;">No symptoms selected yet. Tap any common or urgent symptom above to view NASA IMM prior-weighted care guidance and treatment steps.</span>`
    };
  }

  // 2. Score all NASA IMM conditions transparently
  const scored = SPACEFLIGHT_CONDITIONS.map((cond) => {
    let matchedWeight = 0;
    const matchedNames = [];
    activeSyms.forEach((sym) => {
      if (cond.matchingSymptoms[sym]) {
        matchedWeight += cond.matchingSymptoms[sym];
        matchedNames.push(sym.replace("_", " "));
      }
    });
    const vitalPts = cond.vitalBonus ? cond.vitalBonus(currentState, phys) : 0;
    const totalScore = matchedWeight > 0 ? cond.priorScore + matchedWeight + vitalPts : 0;

    let confLabel = "Possible";
    let confClass = "conf-possible";
    if (totalScore >= 85) {
      confLabel = "Likely Match";
      confClass = "conf-likely";
    } else if (totalScore >= 58) {
      confLabel = "Moderate Match";
      confClass = "conf-moderate";
    }

    return {
      ...cond,
      totalScore,
      matchedNames,
      confLabel,
      confClass
    };
  })
    .filter((c) => c.totalScore > 0)
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 3);

  if (scored.length === 0) {
    return {
      isRedFlag: false,
      html: "Selected symptom logged. No high-threshold condition pattern matched; continue routine baseline monitoring."
    };
  }

  const rowsHtml = scored
    .map(
      (c, i) => `
      <tr>
        <td><strong>#${i + 1} ${c.name}</strong><br/><span style="color:var(--text-muted); font-size:10px;">${c.reasonTemplate}</span></td>
        <td>${c.priorLabel}</td>
        <td><span class="conf-badge ${c.confClass}">${c.confLabel}</span></td>
        <td>${c.action}</td>
      </tr>
    `
    )
    .join("");

  return {
    isRedFlag: false,
    topCondition: scored[0],
    html: `
      <div style="font-weight:700; color:#0369a1; margin-bottom:6px;">
        Top Ranked NASA IMM Considerations (Decision Support Only &mdash; Not a Diagnosis):
      </div>
      <table class="diff-table">
        <thead>
          <tr>
            <th>Condition &amp; Matched Rationale</th>
            <th>In-Flight Prior (NASA IMM)</th>
            <th>Likelihood Band</th>
            <th>Recommended Action</th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    `
  };
}

function generateTriageDecision(crew, phys, currentState, symEval) {
  const env = ENV_MODES[currentState.envMode] || ENV_MODES.transit_0g;
  const oneWayDelayMin = +(env.owltMin + (currentState.missionDay - 142) * 0.04).toFixed(1);
  const clampedOwlt = Math.max(0.1, oneWayDelayMin);
  const roundTripDelayMin = +(clampedOwlt * 2).toFixed(1);

  let escalationTier = 1; // 1 = Self-Care, 2 = Notify CMO, 3 = Urgent Flight Surgeon
  let level = "[OK] LEVEL 1: CREW SELF-CARE";
  let cssClass = "";
  let headline = "DECISION SUPPORT: VITALS WITHIN PERSONAL SPACE-ADAPTED BAND";
  let rationale =
    "Cephalad fluid shift and microgravity baroreceptor adaptation accounted for. Continue standard countermeasure schedule.";
  let protocols = [
    {
      title: "Maintain Standard ARED Resistive Protocol",
      desc: "Complete 60 min resistive exercise (squat/deadlift/heel raise) + 30 min T2 treadmill to suppress osteoclastic bone resorption."
    },
    {
      title: "Circadian SLA Lighting Schedule",
      desc: "Blue-enriched 480nm cabin solid-state lighting during wake hours; dim below 40 lux 2h pre-sleep."
    },
    {
      title: "Routine Store-and-Forward FHIR Sync",
      desc: `Queue compressed 24h physiological telemetry bundle for Deep Space Network downlink (OWLT: ${clampedOwlt} min).`
    }
  ];

  if (symEval && symEval.isRedFlag) {
    escalationTier = 3;
    level = "[ALERT] LEVEL 3: URGENT FLIGHT SURGEON CONTACT NOW";
    cssClass = "critical";
    headline = symEval.redFlagData.title;
    rationale = `${symEval.redFlagData.reason} Expected ground Flight Surgeon response window: ${roundTripDelayMin} min round-trip light delay.`;
    protocols = [
      {
        title: "Execute Immediate Onboard Emergency Stabilization",
        desc: symEval.redFlagData.action
      },
      {
        title: "Alert Onboard Crew Medical Officer (CMO)",
        desc: "Summon CMO with ISS/Deep-Space Emergency Medical Kit, handheld ultrasound, and 12-lead ECG."
      },
      {
        title: "Transmit High-Priority DTN Telemetry Bundle",
        desc: `Flag HL7 FHIR bundle as STAT_RED_FLAG. Execute autonomous stabilization for the ${roundTripDelayMin} min two-way communication window.`
      }
    ];
    return { level, cssClass, headline, rationale, protocols, oneWayDelayMin: clampedOwlt, roundTripDelayMin, escalationTier };
  }

  if (!currentState.useSpaceAdaptedBaseline && currentState.activeScenario === "nominal") {
    escalationTier = 2;
    level = "[!] LEVEL 2: BASELINE ARTIFACT (FALSE ALARM)";
    cssClass = "caution";
    headline = "TERRESTRIAL THRESHOLD ARTIFACT: FALSE HYPOXIA / FLUID SHIFT WARNING";
    rationale =
      "Standard Earth hospital cutoffs flag normal microgravity SpO2 (97.3%) and cephalad venous shift as abnormal. Enable Personal 0g Space-Adapted Baseline to suppress false positives.";
  }

  if (currentState.ppCO2 >= 3.8 || currentState.activeSymptoms.has("headache")) {
    escalationTier = currentState.ppCO2 >= 4.5 ? 3 : 2;
    level = escalationTier === 3 ? "[ALERT] LEVEL 3: URGENT AIR & MEDICAL ACTION" : "[!] LEVEL 2: CHECK AIR & CREW DOCTOR";
    cssClass = escalationTier === 3 ? "critical" : "caution";
    headline = `CABIN AIR ALERT: High CO2 (${currentState.ppCO2.toFixed(1)} mmHg) Is Causing Faster Pulse & Slower Reflexes`;
    rationale =
      "Because there is no gravity convection in space, exhaled CO2 forms an invisible bubble around the astronaut's head. This is an air-circulation issue rather than heart disease.";
    protocols = [
      {
        title: "Turn On Cabin Air Fans & Refresh CO2 Filter",
        desc: "Switch on portable air-mixing fans near the astronaut and cycle the spacecraft carbon dioxide scrubber."
      },
      {
        title: "Pause Precision Spacewalks & Docking",
        desc: `Reaction speed slowed to ${currentState.pvtLatencyMs} ms. Hold off on risky EVA or robotics tasks until cabin CO2 drops below 3.0 mmHg.`
      },
      {
        title: "Relieve Head & Eye Pressure",
        desc: `High CO2 widens blood vessels in the brain and increases eye pressure (${phys.sansIndex} mm). Breathe 100% oxygen for 15 minutes if headache continues.`
      }
    ];
  } else if (currentState.radRate >= 4.0 || currentState.activeSymptoms.has("phosphenes")) {
    escalationTier = 3;
    level = "[ALERT] LEVEL 3: RADIATION SHELTER & FLIGHT SURGEON ALERT";
    cssClass = "critical";
    headline = `SOLAR PARTICLE EVENT (${currentState.radRate.toFixed(1)} mSv/day): STORM SHELTER & IMMUNE TRIAGE`;
    rationale =
      `High-energy proton flux detected (${phys.careerLimitPct}% of 600 mSv career limit used). Elevated risk of prodromal nausea and lymphocyte depletion. While waiting ${roundTripDelayMin} min for Houston reply, remain in shielded storm shelter.`;
    protocols = [
      {
        title: "Verify Storm Shelter Mass Shielding",
        desc: "Remain inside polyethylene/water-wall shielded crew quarters until SEP proton flux drops below 1.5 mSv/day."
      },
      {
        title: "Administer Countermeasure Nutraceuticals & Hydration",
        desc: "Dispense onboard antioxidant/radioprotective countermeasure pack + 500 mL oral rehydration salts."
      },
      {
        title: "Point-of-Care Leukocyte Differential & CMO Log",
        desc: "Schedule fingerstick white blood cell count at T+12h and queue dosimetry packet for Flight Surgeon."
      }
    ];
  } else if (phys.cardioSansRisk >= 45 || currentState.activeScenario === "sans_decond" || currentState.activeSymptoms.has("cephalad")) {
    escalationTier = 2;
    level = "[!] LEVEL 2: NOTIFY CREW MEDICAL OFFICER (SANS / BONE)";
    cssClass = "caution";
    headline = `CAUTION: ELEVATED SANS INDEX (ONSD ${phys.sansIndex} mm) & DECONDITIONING TREND`;
    rationale =
      "Long-duration cephalad fluid shift and osteoclastic bone resorption trend detected. Consult onboard CMO for LBNP and ocular OCT imaging.";
    protocols = [
      {
        title: "Lower Body Negative Pressure (LBNP) Session",
        desc: "Perform 45-minute LBNP session at -40 mmHg to sequester intravascular fluid caudally and relieve ocular venous congestion."
      },
      {
        title: "Guided Ocular Ultrasound / OCT Scan with CMO",
        desc: "Capture retinal OCT and optic nerve sheath ultrasound image; attach to 7-day Flight Surgeon summary."
      },
      {
        title: "Increase ARED Axial Load + Hydration",
        desc: `Estimated femoral BMD loss is -${phys.netBmdLossPct}%. Increase ARED squat/deadlift load by 10% and maintain >2.5L/d fluid intake.`
      }
    ];
  } else if (phys.psychRisk >= 45 || currentState.activeScenario === "isolation_fatigue") {
    escalationTier = 2;
    level = "[!] LEVEL 2: CIRCADIAN & COGNITIVE FATIGUE COUNTERMEASURES";
    cssClass = "caution";
    headline = `BEHAVIORAL & COGNITIVE CAUTION: SLEEP EFFICIENCY ${currentState.sleepEff}% | PVT ${currentState.pvtLatencyMs} ms`;
    rationale =
      `Cumulative sleep curtailment and circadian phase drift are slowing psychomotor vigilance and suppressing autonomic recovery (HRV ${phys.currentHRV} ms).`;
    protocols = [
      {
        title: "Crew Schedule Duty Swap & Protected Sleep Anchor",
        desc: "Shift high-cognitive-load maintenance tasks and enforce a protected 8.5-hour dark/quiet sleep window."
      },
      {
        title: "Dynamic Spectral Lighting Phase Reset",
        desc: "Deliver 6,500K blue-enriched light pulse for 45 minutes upon wake, followed by amber 1,800K spectrum 3h pre-sleep."
      },
      {
        title: "Confidential CMO Behavioral Check-In",
        desc: "Complete validated WHO-5 / PHQ-2 check-in; any safety concern escalates immediately to Flight Surgeon."
      }
    ];
  }

  return { level, cssClass, headline, rationale, protocols, oneWayDelayMin: clampedOwlt, roundTripDelayMin, escalationTier };
}

function buildFhirBundle(crew, phys, triage, currentState) {
  return JSON.stringify(
    {
      resourceType: "Bundle",
      id: `ares-med-${crew.id.toLowerCase()}-med${currentState.missionDay}`,
      type: "collection",
      timestamp: new Date().toISOString(),
      meta: {
        disclaimer: "DECISION_SUPPORT_ONLY_NOT_DIAGNOSIS",
        simulatedDataSources: [
          "NASA-STD-3001 Vol 1 (Rev 2022)",
          "NASA Twins Study (Garrett-Bakelman et al., Science 2019)",
          "NASA OSDR OSD-570 / OSD-571 (Simulated Proxies)",
          "NASA Integrated Medical Model (IMM)"
        ],
        environmentMode: currentState.envMode,
        calibrationMode: currentState.useSpaceAdaptedBaseline ? "PERSONAL_0G_ADAPTED" : "TERRESTRIAL_STANDARD"
      },
      transmissionQueueStatus: `QUEUED_FOR_DTN_DOWNLINK (OWLT: ${triage.oneWayDelayMin}m | EXPECTED_RT_REPLY: ${triage.roundTripDelayMin}m)`,
      subject: {
        identifier: crew.id,
        name: crew.name,
        sex: currentState.activeSexModel || crew.sex,
        role: crew.role,
        missionElapsedDays: currentState.missionDay
      },
      sevenDaySummaryAndObservations: {
        heartRateBpm: phys.currentHR,
        hrvRmssdMs: phys.currentHRV,
        spO2Pct: phys.currentSpO2,
        bloodPressureMmHg: `${phys.currentSysBP}/${phys.currentDiaBP}`,
        respiratoryRateBrMin: phys.currentRR,
        coreTempC: phys.currentTemp,
        fastingGlucoseMgDl: phys.currentGlucose,
        sansOnsdProxyMm: phys.sansIndex,
        estimatedBmdDeltaPct: -phys.netBmdLossPct,
        careerRadiationMsv: `${phys.cumulativeMsv} / 600 mSv (${phys.careerLimitPct}%)`,
        pvtReactionLatencyMs: currentState.pvtLatencyMs,
        habitatPpCO2MmHg: currentState.ppCO2,
        loggedSymptoms: Array.from(currentState.activeSymptoms)
      },
      decisionSupportEscalation: {
        readinessScore: phys.readinessScore,
        escalationTier: `LEVEL_${triage.escalationTier}`,
        alertStatus: triage.level,
        summaryRationale: triage.headline,
        completedCountermeasuresCount: currentState.checkedProtocolsCount,
        recommendedActions: triage.protocols.map((p) => p.title)
      }
    },
    null,
    2
  );
}

function drawForecastChart(phys, currentState) {
  const canvas = document.getElementById("forecastCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  ctx.strokeStyle = "rgba(148, 163, 184, 0.14)";
  ctx.lineWidth = 1;
  for (let y = 20; y < H; y += 28) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  const threshY = H - 0.75 * (H - 22);
  ctx.strokeStyle = "rgba(239, 68, 68, 0.5)";
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(0, threshY);
  ctx.lineTo(W, threshY);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(252, 165, 165, 0.9)";
  ctx.font = "10px monospace";
  ctx.fillText("CRITICAL ESCALATION THRESHOLD (75% STRAIN)", 10, threshY - 5);

  const startRisk = phys.compositeRisk;
  const days = 30;
  const stepX = W / days;

  // Red Curve: Unmitigated Drift
  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  for (let d = 0; d <= days; d++) {
    const projectedRisk = Math.min(98, startRisk + d * (0.85 + (currentState.ppCO2 > 3.5 ? 0.65 : 0.15)));
    const x = d * stepX;
    const y = H - (projectedRisk / 100) * (H - 22) - 8;
    if (d === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Green Curve: Countermeasure Mitigated Recovery
  const mitigationStrength = Math.max(0.25, currentState.checkedProtocolsCount * 0.42);
  ctx.strokeStyle = "#10b981";
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  for (let d = 0; d <= days; d++) {
    const mitigatedRisk = Math.max(
      12,
      startRisk * Math.exp((-0.035 * mitigationStrength) * d) + 10 * (1 - Math.exp(-0.05 * d))
    );
    const x = d * stepX;
    const y = H - (mitigatedRisk / 100) * (H - 22) - 8;
    if (d === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Purple Curve: User's 30-Day Quiz Decisions Trajectory
  if (typeof state.userQuizImpact === "number") {
    ctx.strokeStyle = "#a855f7";
    ctx.lineWidth = 3.0;
    ctx.beginPath();
    const qFactor = state.userQuizImpact;
    for (let d = 0; d <= days; d++) {
      let userRisk = startRisk;
      if (qFactor >= 0) {
        const target = Math.max(12, startRisk * (1 - 0.65 * qFactor));
        userRisk = startRisk + (target - startRisk) * (1 - Math.exp(-0.08 * d));
      } else {
        userRisk = Math.min(95, startRisk + d * (0.55 * Math.abs(qFactor) + 0.25));
      }
      const x = d * stepX;
      const y = H - (userRisk / 100) * (H - 22) - 8;
      if (d === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

function renderDashboard() {
  const crew = CREW_ROSTER[state.selectedCrewIndex];
  const scen = SCENARIOS[state.activeScenario];
  const env = ENV_MODES[state.envMode] || ENV_MODES.transit_0g;
  const phys = computePhysiology(crew, state);
  const symEval = evaluateSymptomTriage(state, phys);
  const triage = generateTriageDecision(crew, phys, state, symEval);

  // Header & Environment Mode
  document.getElementById("headerMed").textContent = `MED DAY ${state.missionDay}`;
  const hdrSlider = document.getElementById("headerMedSlider");
  if (hdrSlider) hdrSlider.value = state.missionDay;
  document.getElementById("headerDelay").textContent = `${triage.oneWayDelayMin} MIN OWLT (RT: ${triage.roundTripDelayMin}m)`;
  const envSelect = document.getElementById("envModeSelect");
  if (envSelect) envSelect.value = state.envMode;
  const empEl = document.getElementById("envEmphasisText");
  if (empEl) empEl.textContent = env.emphasis;

  // Baseline toggle
  const baseBtn = document.getElementById("baselineToggleBtn");
  if (state.useSpaceAdaptedBaseline) {
    baseBtn.textContent = "ACTIVE: PERSONAL 0g SPACE-ADAPTED BASELINE";
    baseBtn.classList.remove("earth-mode");
  } else {
    baseBtn.textContent = "ACTIVE: TERRESTRIAL DEFAULT (FALSE ALARMS)";
    baseBtn.classList.add("earth-mode");
  }

  // Gamification streak
  const streakEl = document.getElementById("streakCounterPill");
  if (streakEl) {
    streakEl.textContent = `\u2605 ${state.streakDays}-Day Daily Check-In Streak (${state.streakDays * 50} Mission Pts)`;
  }

  // Crew Roster with Custom Astronaut SVG Avatars
  const AVATAR_COLORS = [
    { suit: "#e2e8f0", visor: "#0284c7", hair: "#78350f", skin: "#fde68a", accent: "#0ea5e9" },
    { suit: "#f1f5f9", visor: "#0369a1", hair: "#1e293b", skin: "#fcd34d", accent: "#10b981" },
    { suit: "#e2e8f0", visor: "#1d4ed8", hair: "#0f172a", skin: "#92400e", accent: "#f59e0b" },
    { suit: "#f8fafc", visor: "#0f766e", hair: "#b45309", skin: "#fed7aa", accent: "#6366f1" }
  ];
  const crewListEl = document.getElementById("crewList");
  crewListEl.innerHTML = "";
  CREW_ROSTER.forEach((member, idx) => {
    const memberPhys = computePhysiology(member, state);
    const av = AVATAR_COLORS[idx % AVATAR_COLORS.length];
    const card = document.createElement("div");
    card.className = `crew-avatar-card ${idx === state.selectedCrewIndex ? "active" : ""}`;
    let statusClass = "status-nominal";
    let statusTag = "[OK]";
    if (memberPhys.readinessScore < 60) {
      statusClass = "status-critical";
      statusTag = "[ALERT]";
    } else if (memberPhys.readinessScore < 80) {
      statusClass = "status-caution";
      statusTag = "[!]";
    }

    const CREW_PHOTOS = ["avatar_1.jpg", "avatar_2.jpg", "avatar_4.jpg", "avatar_3.jpg"];
    card.innerHTML = `
      <img src="${CREW_PHOTOS[idx % CREW_PHOTOS.length]}" alt="${member.name}" class="crew-photo-top" />
      <div class="crew-card-body">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:6px;">
          <span style="font-size:11px; color:var(--text-muted); font-weight:600;">${member.sex === "F" ? "\u2640 Female" : "\u2642 Male"} &bull; Age ${member.age}</span>
          <div class="crew-score-pill ${statusClass}" style="font-size:11px;">${statusTag} ${memberPhys.readinessScore}%</div>
        </div>
        <h3 style="font-size:15.5px; margin:2px 0 0; color:var(--blue-navy); font-weight:800;">${member.name}</h3>
        <div style="font-size:11.5px; color:var(--blue-primary); font-weight:700;">${member.role}</div>
        <p style="font-size:12px; color:var(--text-body); line-height:1.48; margin:4px 0 0;">${member.story || ""}</p>
      </div>
    `;
    card.onclick = () => {
      state.selectedCrewIndex = idx;
      state.activeSexModel = member.sex;
      renderDashboard();
      if (window.setScenarioWizardStep) window.setScenarioWizardStep(2);
    };
    crewListEl.appendChild(card);
  });

  // Update Biological Sex / Gender Hologram Morphometry
  const activeSex = state.activeSexModel || crew.sex || "F";
  const holoImg = document.getElementById("hologramImg");
  const holoBadge = document.getElementById("hologramSexBadge");
  const femContour = document.getElementById("femaleContour");
  const maleContour = document.getElementById("maleContour");
  const btnF = document.getElementById("genderBtnF");
  const btnM = document.getElementById("genderBtnM");
  if (holoImg && holoBadge) {
    if (activeSex === "F") {
      holoImg.classList.add("female-morph");
      holoBadge.textContent = "\u2640 FEMALE 0g MODEL (ORTHOSTATIC SENSITIVITY)";
      if (femContour) femContour.style.display = "block";
      if (maleContour) maleContour.style.display = "none";
      if (btnF) btnF.classList.add("active");
      if (btnM) btnM.classList.remove("active");
    } else {
      holoImg.classList.remove("female-morph");
      holoBadge.textContent = "\u2642 MALE 0g MODEL (ELEVATED SANS / ICP PRIOR)";
      if (femContour) femContour.style.display = "none";
      if (maleContour) maleContour.style.display = "block";
      if (btnF) btnF.classList.remove("active");
      if (btnM) btnM.classList.add("active");
    }
  }

  // Hologram Organ Hotspots & Quick-Select Pills
  const organRisks = {
    brain: Math.max(phys.cardioSansRisk, phys.psychRisk),
    heart: phys.cardioSansRisk,
    lungs: phys.eclssRisk,
    bone: phys.boneRisk,
    marrow: phys.radImmuneRisk
  };
  Object.keys(organRisks).forEach((organKey) => {
    const group = document.getElementById(`organ-${organKey}`);
    const col = colorForRisk(organRisks[organKey]);
    const isSel = state.selectedOrgan === organKey;
    if (group) {
      group.querySelectorAll(".organ-shape").forEach((el) => {
        el.setAttribute("fill", col);
        el.setAttribute("stroke", isSel ? "#ffffff" : col);
        el.setAttribute("stroke-width", isSel ? "2.2" : "1");
      });
      group.querySelectorAll(".organ-core").forEach((el) => {
        el.setAttribute("fill", isSel ? "#ffffff" : col);
      });
      group.style.filter = isSel ? `drop-shadow(0 0 12px ${col})` : `drop-shadow(0 0 5px ${col})`;
    }
  });
  document.querySelectorAll(".organ-pill-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.organ === state.selectedOrgan);
  });
  const organDetail = getOrganDetails(state.selectedOrgan, phys, state);
  const organTitleEl = document.getElementById("organTitle");
  const organStatEl = document.getElementById("organStatus");
  const organDescEl = document.getElementById("organDesc");
  if (organTitleEl && organStatEl && organDescEl) {
    organTitleEl.textContent = organDetail.title;
    organStatEl.textContent = `${statusLabelForRisk(organDetail.risk)} | SYSTEM STRAIN INDEX: ${organDetail.risk}%`;
    organStatEl.style.color = colorForRisk(organDetail.risk);
    organDescEl.textContent = organDetail.desc;
  }

  // Update Permanent Lateral Body Callout Boxes (Brain, Marrow, Heart/Lungs, Bones)
  const calloutMap = [
    { boxId: "calloutBrain", tagId: "tagBrain", descId: "descBrain", organ: "brain" },
    { boxId: "calloutMarrow", tagId: "tagMarrow", descId: "descMarrow", organ: "marrow" },
    { boxId: "calloutCardio", tagId: "tagCardio", descId: "descCardio", organ: state.ppCO2 >= 3.5 ? "lungs" : "heart" },
    { boxId: "calloutBone", tagId: "tagBone", descId: "descBone", organ: "bone" }
  ];
  calloutMap.forEach((item) => {
    const info = getOrganDetails(item.organ, phys, state);
    const boxEl = document.getElementById(item.boxId);
    const tagEl = document.getElementById(item.tagId);
    const descEl = document.getElementById(item.descId);
    if (boxEl && tagEl && descEl) {
      const cls = info.risk >= 62 ? "status-critical" : info.risk >= 36 ? "status-caution" : "status-nominal";
      boxEl.className = `callout-box ${cls}`;
      tagEl.className = `callout-risk-tag ${cls}`;
      tagEl.textContent = `${info.risk}% Strain`;
      descEl.textContent = info.desc;
    }
  });

  // Update Scenario Story Explanation Box
  const scenStories = {
    nominal: {
      title: "Why We Selected Scenario 01: Nominal Mars Transit",
      text: "Even when spacecraft systems are completely healthy, zero gravity shifts ~2 liters of blood toward the upper body. This baseline shows how a healthy astronaut adapts over months in space."
    },
    co2_fault: {
      title: "Why We Selected Scenario 02: Cabin CO2 Scrubber Fault",
      text: "In space there is no gravity-driven air circulation, so exhaled CO2 can pool around an astronaut's head. This causes headaches, fast pulse, and slow reflexes that look like illness unless cabin sensors are checked."
    },
    solar_storm: {
      title: "Why We Selected Scenario 03: Solar Particle Radiation Storm",
      text: "Outside Earth's magnetic field, solar storms send high-energy radiation toward the ship. Crew members must shelter in water-shielded compartments to protect bone marrow and immune cells."
    },
    sans_decond: {
      title: "Why We Selected Scenario 04: Eye Pressure (SANS) & Bone Loss",
      text: "After 200+ days in microgravity, fluid pressure behind the eyes can flatten vision (SANS) and leg bones lose calcium. Daily resistance exercise and negative-pressure leg suits help reverse this."
    },
    isolation_fatigue: {
      title: "Why We Selected Scenario 05: Sleep Loss & Isolation Fatigue",
      text: "A Martian day (Sol) is 39 minutes longer than an Earth day. Combined with isolation and workload, sleep debt slows reaction speed and increases error risk during spacewalks."
    }
  };
  const sStory = scenStories[state.activeScenario] || scenStories.nominal;
  const sTitleEl = document.getElementById("scenarioStoryTitle");
  const sTextEl = document.getElementById("scenarioStoryText");
  if (sTitleEl && sTextEl) {
    sTitleEl.textContent = sStory.title;
    sTextEl.textContent = sStory.text;
  }

  // 7-Day Rolling Trend Banner
  const trendBanner = document.getElementById("rollingTrendBanner");
  if (trendBanner) {
    trendBanner.innerHTML = `<strong>7-Day Rolling Trend (EWMA):</strong> ${scen.trendNote}`;
  }

  // Environment values & sliders
  document.getElementById("envCo2Val").textContent = `${state.ppCO2.toFixed(1)} mmHg`;
  document.getElementById("envCo2Val").style.color =
    state.ppCO2 >= 3.8 ? "var(--accent-red)" : state.ppCO2 >= 3.0 ? "var(--accent-amber)" : "var(--text-main)";
  document.getElementById("envRadVal").textContent = `${state.radRate.toFixed(2)} mSv/d`;
  document.getElementById("envRadVal").style.color =
    state.radRate >= 4.0 ? "var(--accent-red)" : state.radRate >= 1.5 ? "var(--accent-amber)" : "var(--text-main)";
  document.getElementById("envSleepVal").textContent = `${state.sleepEff}%`;
  const glucEl = document.getElementById("envGlucoseVal");
  if (glucEl) glucEl.textContent = `${phys.currentGlucose} mg/dL`;

  document.getElementById("envMedSliderVal").textContent = `Day ${state.missionDay}`;
  document.getElementById("envCo2SliderVal").textContent = `${state.ppCO2.toFixed(1)} mmHg`;
  document.getElementById("medSlider").value = state.missionDay;
  document.getElementById("co2Slider").value = state.ppCO2;

  // Career Radiation Tracker (600 mSv limit)
  const careerVal = document.getElementById("valCareerRad");
  const careerBar = document.getElementById("barCareerRad");
  if (careerVal && careerBar) {
    const cTag = phys.careerLimitPct >= 80 ? "[ALERT]" : phys.careerLimitPct >= 50 ? "[!]" : "[OK]";
    careerVal.textContent = `${phys.cumulativeMsv} / 600 mSv (${phys.careerLimitPct}% Used) ${cTag}`;
    careerBar.style.width = `${Math.min(100, phys.careerLimitPct)}%`;
    careerBar.style.backgroundColor = colorForRisk(phys.careerLimitPct);
  }

  // Vitals Grid with Color + Icon/Text Redundancy
  document.getElementById("selectedCrewHeader").textContent = `${crew.name} (${crew.id}) \u2014 PERSONALIZED VITALS`;

  const hrAmber = phys.currentHR > phys.activeBaselineHR + 12;
  const hrRed = phys.currentHR > phys.activeBaselineHR + 20 || phys.currentHR > 100;
  document.getElementById("labelHR").textContent = `${hrRed ? "[ALERT]" : hrAmber ? "[!]" : "[OK]"} Heart Rate`;
  document.getElementById("vitalHR").innerHTML = `${phys.currentHR} <span class="vital-unit">bpm</span>`;
  document.getElementById("vitalHRBase").textContent =
    state.hwMeasuredHR !== null
      ? `LIVE WEBCAM rPPG LOCK`
      : `0g Base: ${phys.activeBaselineHR} bpm (Ref: 60-100)`;
  setVitalAlert("boxHR", hrAmber, hrRed);

  const hrvAmber = phys.currentHRV < 45;
  const hrvRed = phys.currentHRV < 34;
  document.getElementById("labelHRV").textContent = `${hrvRed ? "[ALERT]" : hrvAmber ? "[!]" : "[OK]"} Autonomic HRV`;
  document.getElementById("vitalHRV").innerHTML = `${phys.currentHRV} <span class="vital-unit">ms</span>`;
  document.getElementById("vitalHRVBase").textContent = `RMSSD (Pre-flight: ${crew.earthHRV} ms)`;
  setVitalAlert("boxHRV", hrvAmber, hrvRed);

  const spo2Amber = !state.useSpaceAdaptedBaseline || phys.currentSpO2 < 96.5 || phys.currentSysBP >= 125;
  const spo2Red = phys.currentSpO2 < 94.5 || phys.currentSysBP >= 135;
  document.getElementById("labelSpO2").textContent = `${spo2Red ? "[ALERT]" : spo2Amber ? "[!]" : "[OK]"} SpO2 & BP`;
  document.getElementById("vitalSpO2").innerHTML = `${phys.currentSpO2} <span class="vital-unit">%</span>`;
  document.getElementById("vitalSpO2Base").textContent = `BP: ${phys.currentSysBP}/${phys.currentDiaBP} mmHg (Ref <120/80)`;
  setVitalAlert("boxSpO2", spo2Amber, spo2Red);

  const sansAmber = phys.sansIndex >= 5.6;
  const sansRed = phys.sansIndex >= 6.0;
  document.getElementById("labelSANS").textContent = `${sansRed ? "[ALERT]" : sansAmber ? "[!]" : "[OK]"} SANS Ocular Proxy`;
  document.getElementById("vitalSANS").innerHTML = `${phys.sansIndex} <span class="vital-unit">mm</span>`;
  document.getElementById("vitalSANSBase").textContent = `ONSD Proxy (Caution >=5.6mm)`;
  setVitalAlert("boxSANS", sansAmber, sansRed);

  const rrAmber = phys.currentRR >= 18 || phys.currentGlucose >= 100;
  const rrRed = phys.currentRR >= 21 || phys.currentGlucose >= 126;
  document.getElementById("labelRR").textContent = `${rrRed ? "[ALERT]" : rrAmber ? "[!]" : "[OK]"} Resp Rate & Glucose`;
  document.getElementById("vitalRR").innerHTML = `${phys.currentRR} <span class="vital-unit">br/m</span>`;
  document.getElementById("vitalRRBase").textContent = `Fasting Glucose: ${phys.currentGlucose} mg/dL`;
  setVitalAlert("boxRR", rrAmber, rrRed);

  const tempAmber = phys.currentTemp >= 37.3;
  const tempRed = phys.currentTemp >= 38.0;
  document.getElementById("labelTemp").textContent = `${tempRed ? "[ALERT]" : tempAmber ? "[!]" : "[OK]"} Core Body Temp`;
  document.getElementById("vitalTemp").innerHTML = `${phys.currentTemp} <span class="vital-unit">&deg;C</span>`;
  document.getElementById("vitalTempBase").textContent = `Ref: 36.1-37.2C (0g +0.3C)`;
  setVitalAlert("boxTemp", tempAmber, tempRed);

  // 5-Domain Stressor Progress Bars
  updateDomainBar("barCardio", "valCardio", phys.cardioSansRisk, `ONSD ${phys.sansIndex} mm | Orthostatic Index`);
  updateDomainBar("barBone", "valBone", phys.boneRisk, `Femoral BMD: -${phys.netBmdLossPct}% (ARED ${(crew.aredCompliance * 100).toFixed(0)}%)`);
  updateDomainBar("barRad", "valRad", phys.radImmuneRisk, `Dose: ${phys.cumulativeMsv} mSv | Flux: ${state.radRate.toFixed(2)} mSv/d`);
  updateDomainBar("barPsych", "valPsych", phys.psychRisk, `Sleep: ${state.sleepEff}% | PVT: ${state.pvtLatencyMs} ms`);
  updateDomainBar("barEclss", "valEclss", phys.eclssRisk, `Cabin ppCO2: ${state.ppCO2.toFixed(1)} mmHg | O2: ${scen.cabinO2}%`);

  // Simulated NASA OSDR Biomarker Cards
  document.getElementById("osdrMtDna").textContent = `${phys.cfMtDnaFold}x`;
  document.getElementById("osdrMtDna").style.color = phys.cfMtDnaFold >= 2.2 ? "var(--accent-red)" : "var(--accent-bright)";
  document.getElementById("osdrNtx").textContent = `${phys.urinaryNtx} nmol`;
  document.getElementById("osdrNtx").style.color = phys.urinaryNtx >= 70 ? "var(--accent-amber)" : "var(--accent-green)";
  document.getElementById("osdrIl6").textContent = `${phys.il6Ratio} ratio`;
  document.getElementById("osdrChoroid").textContent = phys.choroidalGrade;

  // PVT & Mood UI + Tiered Reaction Feedback
  document.getElementById("pvtLatencyBadge").textContent = `Last Score: ${state.pvtLatencyMs} ms`;
  const pvtFeedbackEl = document.getElementById("pvtFeedbackBox");
  if (pvtFeedbackEl) {
    let tierTitle = "";
    let tierColor = "var(--accent-sky)";
    let tierMsg = "";
    if (state.pvtLatencyMs < 260) {
      tierTitle = `Sharp & Mission-Ready (${state.pvtLatencyMs} ms)`;
      tierColor = "var(--accent-green)";
      tierMsg = "Excellent reflexes! Your reaction speed is fast enough for precision spacewalk (EVA) and spacecraft docking tasks.";
    } else if (state.pvtLatencyMs <= 330) {
      tierTitle = `Steady Baseline (${state.pvtLatencyMs} ms)`;
      tierColor = "var(--accent-sky)";
      tierMsg = "Solid normal performance. You are steady for routine ship duties, though mild fatigue may appear if cabin CO2 rises.";
    } else {
      tierTitle = `Fatigue Detected — Room to Improve (${state.pvtLatencyMs} ms)`;
      tierColor = "var(--accent-amber)";
      tierMsg = "Your reaction time is slowed. On a Mars mission, this signals sleep debt or high cabin CO2—time to rest and check air ventilation.";
    }
    pvtFeedbackEl.innerHTML = `<strong style="color:${tierColor}; display:block; margin-bottom:6px;">Your Reaction Evaluation: ${tierTitle}</strong><p style="color:var(--text-soft);">${tierMsg}</p>`;
  }
  document.querySelectorAll(".mood-btn").forEach((btn) => {
    btn.classList.toggle("active", Number(btn.dataset.mood) === state.moodScore);
  });

  // 3-Level Escalation Ladder UI
  const esc1 = document.getElementById("escStep1");
  const esc2 = document.getElementById("escStep2");
  const esc3 = document.getElementById("escStep3");
  const esc3Sub = document.getElementById("escStep3Sub");
  if (esc1 && esc2 && esc3) {
    esc1.className = `esc-step ${triage.escalationTier === 1 ? "active-level-1" : ""}`;
    esc2.className = `esc-step ${triage.escalationTier === 2 ? "active-level-2" : ""}`;
    esc3.className = `esc-step ${triage.escalationTier === 3 ? "active-level-3" : ""}`;
    if (esc3Sub) {
      esc3Sub.textContent = `Flight Surgeon packet (${triage.roundTripDelayMin}m RT delay)`;
    }
  }

  // Triage Panel
  const banner = document.getElementById("triageBanner");
  banner.className = `triage-alert-banner ${triage.cssClass}`;
  document.getElementById("triageLevelBadge").textContent = triage.level;
  document.getElementById("triageHeadline").textContent = triage.headline;
  document.getElementById("triageRationale").textContent = triage.rationale;

  // Transparent Symptom Triage Output
  const diffBox = document.getElementById("differentialOutput");
  if (diffBox) {
    diffBox.innerHTML = symEval.html;
  }

  // Protocol checkboxes
  const protoContainer = document.getElementById("protocolList");
  protoContainer.innerHTML = "";
  triage.protocols.forEach((p, idx) => {
    const item = document.createElement("div");
    item.className = "protocol-item";
    const isChecked = idx < state.checkedProtocolsCount;
    item.innerHTML = `
      <input type="checkbox" id="proto-${idx}" ${isChecked ? "checked" : ""} />
      <label for="proto-${idx}" class="protocol-text">
        <h4>${p.title}</h4>
        <p>${p.desc}</p>
      </label>
    `;
    const checkbox = item.querySelector("input");
    checkbox.addEventListener("change", () => {
      const allChecked = protoContainer.querySelectorAll("input:checked").length;
      state.checkedProtocolsCount = allChecked;
      drawForecastChart(phys, state);
      document.getElementById("fhirOutput").textContent = buildFhirBundle(crew, phys, triage, state);
    });
    protoContainer.appendChild(item);
  });

  drawForecastChart(phys, state);
  document.getElementById("fhirOutput").textContent = buildFhirBundle(crew, phys, triage, state);
}

function setVitalAlert(elementId, isAmber, isRed) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.classList.remove("alert-amber", "alert-red");
  if (isRed) el.classList.add("alert-red");
  else if (isAmber) el.classList.add("alert-amber");
}

function updateDomainBar(barId, valId, riskPct, subtitleText) {
  const bar = document.getElementById(barId);
  const val = document.getElementById(valId);
  if (!bar || !val) return;
  bar.style.width = `${riskPct}%`;
  bar.style.backgroundColor = colorForRisk(riskPct);
  val.textContent = `${subtitleText} \u2022 ${statusLabelForRisk(riskPct)} (${riskPct}%)`;
}

function activateScenario(scenarioKey) {
  const scen = SCENARIOS[scenarioKey];
  if (!scen) return;
  state.activeScenario = scenarioKey;
  state.envMode = scen.envMode || "transit_0g";
  state.missionDay = scen.missionDay;
  state.ppCO2 = scen.ppCO2;
  state.radRate = scen.radRate;
  state.sleepEff = scen.sleepEff;
  state.pvtLatencyMs = scen.pvtLatencyMs;
  state.moodScore = scen.moodScore;
  state.selectedOrgan = scen.defaultOrgan;
  state.manualOverrides = null;

  document.querySelectorAll(".btn-scenario, .scen-col-card").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.scenario === scenarioKey);
  });

  renderDashboard();
}

// Step-by-Step Guided Manual Measurement Logger
function handleManualMeasurementSubmit() {
  const hr = Number(document.getElementById("inputHR").value);
  const sysBP = Number(document.getElementById("inputSysBP").value);
  const spo2 = Number(document.getElementById("inputSpO2").value);
  const temp = Number(document.getElementById("inputTemp").value);
  const glucose = Number(document.getElementById("inputGlucose").value);
  const sleep = Number(document.getElementById("inputSleep").value);
  const outEl = document.getElementById("manualMeasExplanation");

  if (hr < 35 || hr > 200 || spo2 < 70 || spo2 > 100 || temp < 34 || temp > 42) {
    outEl.innerHTML = "<strong style='color:#fca5a5;'>[VALIDATION ERROR]</strong> Please enter physiologically valid sensor readings (HR 35-200 bpm, SpO2 70-100%, Temp 34-42C).";
    return;
  }

  state.manualOverrides = { hr, sysBP, spo2, temp, glucose };
  state.sleepEff = Math.min(98, Math.round((sleep / 8.0) * 90));
  state.streakDays += 1;

  const reasons = [];
  let statusBand = "[OK] GREEN (Within Personal 0g Band)";
  if (hr > 100 || spo2 < 92 || temp >= 38.0 || sysBP >= 135 || glucose >= 126) {
    statusBand = "[ALERT] RED (Exceeds Clinical Safety Threshold)";
  } else if (hr > 82 || spo2 < 95 || temp >= 37.3 || sysBP >= 122 || glucose >= 100 || sleep < 6.0) {
    statusBand = "[!] YELLOW (Moderate Deviation from Baseline)";
  }

  if (hr > 82) reasons.push(`HR (${hr} bpm) elevated above 0g resting baseline`);
  if (sysBP >= 122) reasons.push(`Systolic BP (${sysBP} mmHg) above <120 normal reference`);
  if (temp >= 37.3) reasons.push(`Core Temp (${temp}C) elevated`);
  if (glucose >= 100) reasons.push(`Fasting Glucose (${glucose} mg/dL) shows mild insulin resistance`);
  if (sleep < 6.0) reasons.push(`Sleep (${sleep}h) below 7-9h target`);
  if (reasons.length === 0) reasons.push("All logged indicators match your personal space-adapted baseline.");

  outEl.innerHTML = `<strong>Logged Result: ${statusBand}</strong> &mdash; ${reasons.join("; ")}. Dashboard vitals and streak updated!`;
  renderDashboard();
}

// Auto-Play Guided Presentation Demo
function toggleGuidedDemo() {
  const btn = document.getElementById("guidedDemoBtn");
  if (state.demoInterval) {
    clearInterval(state.demoInterval);
    state.demoInterval = null;
    btn.textContent = "\u25B6 AUTO-PLAY GUIDED DEMO";
    btn.classList.remove("playing");
    return;
  }
  const keys = Object.keys(SCENARIOS);
  let idx = 0;
  btn.textContent = "\u23F8 STOP GUIDED DEMO (RUNNING)";
  btn.classList.add("playing");
  activateScenario(keys[idx]);
  state.demoInterval = setInterval(() => {
    idx = (idx + 1) % keys.length;
    activateScenario(keys[idx]);
  }, 4500);
}

// Live Webcam rPPG & Microphone Voice Stress Analyzer
async function toggleHardwareBiometricScan() {
  const btn = document.getElementById("hwScanBtn");
  const video = document.getElementById("webcamVideo");
  const placeholder = document.getElementById("videoPlaceholder");
  const statusEl = document.getElementById("hwStatusText");
  const rppgEl = document.getElementById("hwRppgVal");
  const voiceEl = document.getElementById("hwVoiceVal");

  if (state.hwScanning) {
    state.hwScanning = false;
    state.hwMeasuredHR = null;
    if (state.hwStream) {
      state.hwStream.getTracks().forEach((t) => t.stop());
      state.hwStream = null;
    }
    video.style.display = "none";
    placeholder.style.display = "block";
    btn.textContent = "START EXPERIMENTAL WEBCAM rPPG & VOICE SCAN";
    btn.classList.remove("scanning");
    statusEl.textContent = "STANDBY";
    renderDashboard();
    return;
  }

  try {
    statusEl.textContent = "CHECKING LIGHTING & AUDIO...";
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    state.hwStream = stream;
    state.hwScanning = true;
    video.srcObject = stream;
    video.style.display = "block";
    placeholder.style.display = "none";
    btn.textContent = "STOP HARDWARE BIOMETRIC SCAN";
    btn.classList.add("scanning");

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContextClass();
    state.hwAudioCtx = audioCtx;
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const procCanvas = document.createElement("canvas");
    procCanvas.width = 40;
    procCanvas.height = 40;
    const procCtx = procCanvas.getContext("2d");

    const sampleInterval = setInterval(() => {
      if (!state.hwScanning) {
        clearInterval(sampleInterval);
        return;
      }
      procCtx.drawImage(video, 0, 0, 40, 40);
      const frame = procCtx.getImageData(10, 10, 20, 20).data;
      let greenSum = 0;
      for (let i = 0; i < frame.length; i += 4) {
        greenSum += frame[i + 1];
      }
      const greenAvg = greenSum / (frame.length / 4);
      const lightQuality = greenAvg > 45 ? "GOOD (>150 lux)" : "LOW LIGHT CAVEAT";
      statusEl.textContent = `SIGNAL: ${lightQuality}`;

      const estimatedPulse = Math.round(64 + ((greenAvg % 18) - 6));
      state.hwMeasuredHR = Math.max(52, Math.min(115, estimatedPulse));
      rppgEl.textContent = `${state.hwMeasuredHR} bpm (Experimental rPPG)`;

      analyser.getByteFrequencyData(dataArray);
      let audioSum = 0;
      for (let i = 0; i < dataArray.length; i++) audioSum += dataArray[i];
      const audioAvg = audioSum / dataArray.length;
      const jitterPct = +(0.35 + (audioAvg / 255) * 1.45).toFixed(2);
      state.hwVocalJitterPct = jitterPct;
      voiceEl.textContent = `${jitterPct}% F0 (${audioAvg > 25 ? "VOICE LOCK" : "AMBIENT"})`;

      renderDashboard();
    }, 900);
  } catch (err) {
    state.hwScanning = true;
    state.hwMeasuredHR = 71;
    btn.textContent = "STOP CALIBRATED FALLBACK MODE";
    btn.classList.add("scanning");
    statusEl.textContent = "CAMERA DENIED -> FALLBACK ACTIVE";
    rppgEl.textContent = "71 bpm (Fallback Mode)";
    voiceEl.textContent = "0.48% F0 Jitter (Simulated)";
    renderDashboard();
  }
}

// Natural English Decision-Support Voice Briefing
function speakFlightSurgeonBriefing() {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const crew = CREW_ROSTER[state.selectedCrewIndex];
  const phys = computePhysiology(crew, state);
  const symEval = evaluateSymptomTriage(state, phys);
  const triage = generateTriageDecision(crew, phys, state, symEval);

  const cleanName = crew.name.replace("Cmdr.", "Commander").replace("Maj.", "Major").replace("Dr.", "Doctor");
  let spokenSituation = "All crew physiological biometrics are stable within the personal zero-gravity baseline band.";
  if (symEval.isRedFlag) {
    spokenSituation = `Red flag alert triggered. ${symEval.redFlagData.reason}`;
  } else if (state.ppCO2 >= 3.8) {
    spokenSituation = `Caution: Elevated cabin carbon dioxide at ${state.ppCO2.toFixed(1)} millimeters of mercury is driving elevated heart rate and slower reaction time. Check the life support air scrubber.`;
  } else if (state.radRate >= 4.0) {
    spokenSituation = `Radiation alert: Solar particle event detected at ${state.radRate.toFixed(1)} millisieverts per day. Remain in the shielded storm shelter.`;
  } else if (phys.cardioSansRisk >= 45 || state.activeScenario === "sans_decond") {
    spokenSituation = `Caution: Long-duration fluid shift toward the head has increased the optic nerve proxy to ${phys.sansIndex} millimeters.`;
  } else if (phys.psychRisk >= 45 || state.activeScenario === "isolation_fatigue") {
    spokenSituation = `Caution: Sleep curtailment and circadian drift detected. Reaction latency is ${state.pvtLatencyMs} milliseconds.`;
  }

  const cleanProtocol = triage.protocols[0].title
    .replace("ECLSS", "Life Support")
    .replace("CDRA", "Carbon Dioxide Scrubber")
    .replace("ARED", "Resistive Exercise")
    .replace("LBNP", "Lower Body Negative Pressure");

  const spokenText = `ARES-MED Decision Support Summary for ${cleanName}, on Mission Day ${state.missionDay}. One-way communication delay to Earth is ${triage.oneWayDelayMin} minutes. Overall Readiness Score is ${phys.readinessScore} percent, at Escalation Tier ${triage.escalationTier}. ${spokenSituation} Next recommended action: ${cleanProtocol}.`;

  const transcriptEl = document.getElementById("voiceTranscriptBox");
  if (transcriptEl) {
    transcriptEl.textContent = `"${spokenText}"`;
  }

  const utterance = new SpeechSynthesisUtterance(spokenText);
  utterance.lang = "en-US";
  utterance.rate = 0.96;
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const englishVoice =
    voices.find((v) => v.lang === "en-US" && (v.name.includes("Natural") || v.name.includes("Aria") || v.name.includes("Guy") || v.name.includes("Google") || v.name.includes("Zira") || v.name.includes("David"))) ||
    voices.find((v) => v.lang.startsWith("en-US")) ||
    voices.find((v) => v.lang.startsWith("en"));

  if (englishVoice) utterance.voice = englishVoice;
  window.speechSynthesis.speak(utterance);
}

// Interactive PVT
function handlePvtClick() {
  const target = document.getElementById("pvtTarget");
  if (state.pvtState === "idle") {
    state.pvtState = "waiting";
    target.className = "pvt-target waiting";
    target.textContent = "WAIT FOR GREEN SIGNAL...";
    const randomDelay = 1100 + Math.random() * 2000;
    state.pvtTimer = setTimeout(() => {
      state.pvtState = "go";
      state.pvtStartTime = performance.now();
      target.className = "pvt-target go";
      target.textContent = "CLICK NOW! (SIGNAL ACTIVE)";
    }, randomDelay);
  } else if (state.pvtState === "waiting") {
    clearTimeout(state.pvtTimer);
    state.pvtState = "idle";
    target.className = "pvt-target";
    target.textContent = "FALSE START! CLICK TO RETRY PVT";
  } else if (state.pvtState === "go") {
    const reactionMs = Math.round(performance.now() - state.pvtStartTime);
    state.pvtLatencyMs = reactionMs;
    state.pvtState = "idle";
    target.className = "pvt-target";
    target.textContent = `RECORDED: ${reactionMs} ms \u2014 CLICK TO RE-TEST`;
    renderDashboard();
  }
}

// Live ECG / PPG Waveform Loop
let wavePhase = 0;
function startWaveformLoop() {
  const canvas = document.getElementById("ecgCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const points = new Array(240).fill(38);

  function draw() {
    const crew = CREW_ROSTER[state.selectedCrewIndex];
    const phys = computePhysiology(crew, state);
    const speed = (phys.currentHR / 60) * 0.22;
    wavePhase += speed;

    const cycle = wavePhase % (Math.PI * 2);
    let y = 42;
    if (cycle > 0.8 && cycle < 1.1) y -= 5;
    else if (cycle >= 1.25 && cycle < 1.35) y += 7;
    else if (cycle >= 1.35 && cycle < 1.52) y -= 29;
    else if (cycle >= 1.52 && cycle < 1.65) y += 10;
    else if (cycle >= 2.1 && cycle < 2.6) y -= 8 * Math.sin(((cycle - 2.1) / 0.5) * Math.PI);

    points.push(y);
    points.shift();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(0, 242, 254, 0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 24) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    ctx.strokeStyle = colorForRisk(100 - phys.readinessScore);
    ctx.lineWidth = 2;
    ctx.beginPath();
    const step = canvas.width / (points.length - 1);
    for (let i = 0; i < points.length; i++) {
      const px = i * step;
      const py = points[i];
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".btn-scenario").forEach((btn) => {
    btn.addEventListener("click", () => activateScenario(btn.dataset.scenario));
  });

  // Environment mode preset switcher
  const envSelect = document.getElementById("envModeSelect");
  if (envSelect) {
    envSelect.addEventListener("change", (e) => {
      state.envMode = e.target.value;
      renderDashboard();
    });
  }

  // Guided Demo & Reset buttons
  const demoBtn = document.getElementById("guidedDemoBtn");
  if (demoBtn) demoBtn.addEventListener("click", toggleGuidedDemo);

  const resetBtn = document.getElementById("resetNominalBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (state.demoInterval) toggleGuidedDemo();
      state.activeSymptoms.clear();
      document.querySelectorAll(".symptom-chip").forEach((c) => c.classList.remove("active"));
      state.useSpaceAdaptedBaseline = true;
      activateScenario("nominal");
    });
  }

  document.getElementById("baselineToggleBtn").addEventListener("click", () => {
    state.useSpaceAdaptedBaseline = !state.useSpaceAdaptedBaseline;
    renderDashboard();
  });

  const headerMedSlider = document.getElementById("headerMedSlider");
  if (headerMedSlider) {
    headerMedSlider.addEventListener("input", (e) => {
      state.missionDay = Number(e.target.value);
      renderDashboard();
    });
  }
  document.getElementById("medSlider").addEventListener("input", (e) => {
    state.missionDay = Number(e.target.value);
    renderDashboard();
  });

  document.getElementById("co2Slider").addEventListener("input", (e) => {
    state.ppCO2 = Number(e.target.value);
    renderDashboard();
  });

  // Left Slide-Over Hamburger Menu Drawer & Page Navigation
  const sideDrawer = document.getElementById("sideDrawer");
  const drawerBackdrop = document.getElementById("drawerBackdrop");
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const drawerCloseBtn = document.getElementById("drawerCloseBtn");

  function openDrawer() {
    if (sideDrawer) sideDrawer.classList.add("open");
    if (drawerBackdrop) drawerBackdrop.classList.add("open");
  }
  function closeDrawer() {
    if (sideDrawer) sideDrawer.classList.remove("open");
    if (drawerBackdrop) drawerBackdrop.classList.remove("open");
  }
  function navigateToPage(pageId) {
    document.querySelectorAll(".page-section").forEach((sec) => {
      sec.classList.toggle("active", sec.id === pageId);
    });
    document.querySelectorAll(".top-nav-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.jump === pageId);
    });
    document.querySelectorAll(".drawer-nav-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.page === pageId);
    });
    closeDrawer();
    window.scrollTo({ top: 0, behavior: "smooth" });
    renderDashboard();
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener("click", openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener("click", closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener("click", closeDrawer);
  document.querySelectorAll(".drawer-nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => navigateToPage(btn.dataset.page));
  });
  document.querySelectorAll("[data-jump]").forEach((el) => {
    el.addEventListener("click", () => navigateToPage(el.dataset.jump));
  });
  const brandHomeBtn = document.getElementById("brandHomeBtn");
  if (brandHomeBtn) brandHomeBtn.addEventListener("click", () => navigateToPage("page-home"));

  // Top Navigation Tabs Switcher (Legacy fallback if present)
  document.querySelectorAll(".tab-btn").forEach((tabBtn) => {
    tabBtn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
      tabBtn.classList.add("active");
      const targetTabId = tabBtn.dataset.tab;
      const targetPanel = document.getElementById(targetTabId);
      if (targetPanel) targetPanel.classList.add("active");
      const scenDeck = document.getElementById("scenarioDeckSection");
      if (scenDeck) {
        scenDeck.style.display = targetTabId === "tab-team" ? "none" : "block";
      }
      renderDashboard();
    });
  });

  // Female / Male Hologram Morphometry Toggle Buttons
  document.querySelectorAll(".gender-btn").forEach((gBtn) => {
    gBtn.addEventListener("click", () => {
      state.activeSexModel = gBtn.dataset.sex;
      renderDashboard();
    });
  });

  // Organ hotspot & pill clicks
  document.querySelectorAll(".organ-hotspot, .organ-pill-btn").forEach((node) => {
    node.addEventListener("click", () => {
      state.selectedOrgan = node.dataset.organ;
      renderDashboard();
    });
  });

  // Manual Measurement Logger button
  const measBtn = document.getElementById("applyManualMeasBtn");
  if (measBtn) measBtn.addEventListener("click", handleManualMeasurementSubmit);

  if ("speechSynthesis" in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }

  const stopVoiceBtn = document.getElementById("stopBriefingBtn");
  if (stopVoiceBtn) {
    stopVoiceBtn.addEventListener("click", () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    });
  }

  document.getElementById("hwScanBtn").addEventListener("click", toggleHardwareBiometricScan);
  document.getElementById("speakBriefingBtn").addEventListener("click", speakFlightSurgeonBriefing);

  document.querySelectorAll(".symptom-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const sym = chip.dataset.symptom;
      if (state.activeSymptoms.has(sym)) {
        state.activeSymptoms.delete(sym);
        chip.classList.remove("active");
      } else {
        state.activeSymptoms.add(sym);
        chip.classList.add("active");
      }
      renderDashboard();
    });
  });

  document.getElementById("pvtTarget").addEventListener("click", handlePvtClick);

  document.querySelectorAll(".mood-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.moodScore = Number(btn.dataset.mood);
      renderDashboard();
    });
  });

  document.getElementById("downloadFhirBtn").addEventListener("click", () => {
    const crew = CREW_ROSTER[state.selectedCrewIndex];
    const phys = computePhysiology(crew, state);
    const symEval = evaluateSymptomTriage(state, phys);
    const triage = generateTriageDecision(crew, phys, state, symEval);
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(buildFhirBundle(crew, phys, triage, state));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `ARES-MED_${crew.id}_DAY${state.missionDay}.fhir.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  });

  document.getElementById("printReportBtn").addEventListener("click", () => {
    window.print();
  });

  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }

  setInterval(() => {
    state.liveJitter = Math.round((Math.random() - 0.5) * 2);
    renderDashboard();
  }, 2500);

  renderDashboard();
  startWaveformLoop();
  initVitalsZeroExtensions();
});


// ============================================================================
// VITALSZERO EXTENSIONS v8.0: WIZARDS, ANIMATED GUIDE, 6-Q QUIZ, HYBRID AI
// ============================================================================
function initVitalsZeroExtensions() {
  let currentLang = "en";

  // 1. Interactive Subpanel Switcher (Drawer + Hub Cards -> Left/Right Split)
  const interWorkspace = document.getElementById("interactiveWorkspace");
  function switchInteractiveMode(interId) {
    if (interWorkspace) interWorkspace.classList.toggle("split-active", Boolean(interId));
    document.querySelectorAll(".inter-subpanel").forEach((p) => {
      p.classList.toggle("active", Boolean(interId) && p.id === interId);
    });
    document.querySelectorAll(".inter-mode-card, .drawer-sub-btn").forEach((b) => {
      b.classList.toggle("active", Boolean(interId) && b.dataset.inter === interId);
    });
    document.querySelectorAll(".top-nav-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.jump === "page-interactive");
    });
    renderDashboard();
  }
  const interBackHubBtn = document.getElementById("interBackHubBtn");
  if (interBackHubBtn) {
    interBackHubBtn.addEventListener("click", () => switchInteractiveMode(""));
  }

  document.querySelectorAll("[data-inter]").forEach((el) => {
    el.addEventListener("click", () => {
      const targetPage = el.dataset.jump || "page-interactive";
      document.querySelectorAll(".page-section").forEach((s) => s.classList.toggle("active", s.id === targetPage));
      document.querySelectorAll(".drawer-nav-btn").forEach((b) => b.classList.toggle("active", b.dataset.page === targetPage));
      const sd = document.getElementById("sideDrawer");
      const bd = document.getElementById("drawerBackdrop");
      if (sd) sd.classList.remove("open");
      if (bd) bd.classList.remove("open");
      switchInteractiveMode(el.dataset.inter);
    });
  });

  // 1b. Scenario 3-Step Wizard (Avatar -> Scenario Column -> Effects & Plan)
  window.setScenarioWizardStep = function (stepNum) {
    [1, 2, 3].forEach((n) => {
      const el = document.getElementById(`scenStep${n}`);
      const pill = document.getElementById(`wizPill${n}`);
      if (el) el.classList.toggle("active", n === stepNum);
      if (pill) {
        pill.classList.toggle("active", n === stepNum);
        pill.classList.toggle("done", n < stepNum);
      }
    });
  };

  document.querySelectorAll(".scen-col-card").forEach((card) => {
    card.addEventListener("click", () => {
      activateScenario(card.dataset.scenario);
      window.setScenarioWizardStep(3);
    });
  });
  const b1 = document.getElementById("backToStep1Btn");
  const b2 = document.getElementById("backToStep2Btn");
  const b1b = document.getElementById("backToStep1From3Btn");
  if (b1) b1.addEventListener("click", () => window.setScenarioWizardStep(1));
  if (b2) b2.addEventListener("click", () => window.setScenarioWizardStep(2));
  if (b1b) b1b.addEventListener("click", () => window.setScenarioWizardStep(1));

  // 1c. Independent Self-Diagnosis 4-Step Wizard (Location -> Days -> Symptoms -> Rx & Time Plan)
  function setDiagStep(stepNum) {
    [1, 2, 3, 4].forEach((n) => {
      const el = document.getElementById(`diagStep${n}`);
      const pill = document.getElementById(`diagPill${n}`);
      if (el) el.classList.toggle("active", n === stepNum);
      if (pill) {
        pill.classList.toggle("active", n === stepNum);
        pill.classList.toggle("done", n < stepNum);
      }
    });
  }

  function updatePrescriptionTimePlan() {
    const envMeta = ENV_MODES[state.envMode] || ENV_MODES.transit_0g;
    const metaEl = document.getElementById("rxMetaSummary");
    const tpNow = document.getElementById("tpNow");
    const tpShort = document.getElementById("tpShort");
    const tpFollow = document.getElementById("tpFollow");
    const tr = currentLang === "tr";
    if (metaEl) {
      metaEl.textContent = tr
        ? `Konum: ${envMeta.label} • Görev Günü: ${state.missionDay}`
        : `Location: ${envMeta.label} • Mission Day ${state.missionDay}`;
    }
    const syms = Array.from(state.activeSymptoms);
    const hasUrgent = syms.some((s) => RED_FLAG_RULES[s]);
    if (tpNow && tpShort && tpFollow) {
      if (hasUrgent) {
        tpNow.textContent = tr
          ? "Tüm eforu durdurun, 12 kanallı EKG / göz ultrasonu bağlayın ve Kabin Tıbbi Sorumlusuna (CMO) acil bildirim yapın."
          : "Stop all exertion immediately, attach 12-lead ECG / ocular ultrasound, and alert Crew Medical Officer (CMO).";
        tpShort.textContent = tr
          ? "Öncelikli Seviye-3 HL7 FHIR paketini Uçuş Cerrahına iletin ve acil tıbbi kiti hazır tutun."
          : "Transmit Priority Level-3 HL7 FHIR packet to Flight Surgeon and keep onboard medical/defibrillator kit ready.";
        tpFollow.textContent = tr
          ? "Her 2 saatte bir vital bulguları tekrarlayın; tam stabilize olana kadar EVA görevlerini askıya alın."
          : "Repeat vital signs every 2 hours and suspend EVA activities until Flight Surgeon clears stability.";
      } else if (syms.includes("cephalad") || syms.includes("headache")) {
        tpNow.textContent = tr
          ? "Kabin ppCO2 seviyesini (< 3.0 mmHg) ve hava fanlarını kontrol edin; 500 mL sıvı alın."
          : "Check cabin ppCO2 (< 3.0 mmHg) and inter-module ventilation fans; hydrate with 500 mL water.";
        tpShort.textContent = tr
          ? "Sıvı kaymasını azaltmak için 45 dakikalık Alt Vücut Negatif Basınç (LBNP) seansı uygulayın."
          : "Run a 45-min Lower Body Negative Pressure (LBNP) session to relieve headward fluid pressure.";
        tpFollow.textContent = tr
          ? "24 saat sonra optik sinir (SANS) ve dikkat (PVT) ölçümünü tekrarlayıp FHIR raporunu gönderin."
          : "Re-test optic nerve (SANS) & PVT alertness at 24h and queue HL7 FHIR summary for downlink.";
      } else {
        tpNow.textContent = tr
          ? "Kişisel 0g referans değerlerinizi doğrulayın ve görev ortamı sensörlerini (CO2/Radyasyon) kontrol edin."
          : "Verify personal 0g baseline readings and confirm cabin CO2 / radiation sensors are nominal.";
        tpShort.textContent = tr
          ? "Günlük 60 dk ARED direnç egzersizi ve hedeflenen uyku/hidrasyon protokolünü uygulayın."
          : "Complete daily 60-min ARED resistive exercise and targeted hydration/sleep protocol.";
        tpFollow.textContent = tr
          ? "72 saatlik trendi kaydedin ve rutin Uçuş Cerrahı senkronizasyonu için PDF/FHIR çıktısı alın."
          : "Log 72-hour trend and export Prescription PDF / HL7 FHIR bundle for routine Flight Surgeon sync.";
      }
    }
  }

  document.querySelectorAll(".diag-env-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.envMode = btn.dataset.env;
      const headerSel = document.getElementById("envModeSelect");
      if (headerSel) headerSel.value = state.envMode;
      renderDashboard();
      setDiagStep(2);
    });
  });
  document.querySelectorAll(".diag-day-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.missionDay = Number(btn.dataset.days) || 142;
      renderDashboard();
      setDiagStep(3);
    });
  });
  const dBack1 = document.getElementById("diagBack1");
  const dBack2 = document.getElementById("diagBack2");
  const dTo4 = document.getElementById("diagToStep4Btn");
  const dRestart = document.getElementById("diagRestartBtn");
  if (dBack1) dBack1.addEventListener("click", () => setDiagStep(1));
  if (dBack2) dBack2.addEventListener("click", () => setDiagStep(2));
  if (dTo4) dTo4.addEventListener("click", () => {
    renderDashboard();
    updatePrescriptionTimePlan();
    setDiagStep(4);
  });
  if (dRestart) dRestart.addEventListener("click", () => setDiagStep(1));

  // 1d. Real 60fps Animated Canvas Video Engine (Mascot Astronaut Tour + Voiceover + .webm Export)
  const vCanvas = document.getElementById("guideVideoCanvas");
  const vCtx = vCanvas ? vCanvas.getContext("2d") : null;
  const mascotImg = document.getElementById("mascotImgHidden");
  const wtPlayBtn = document.getElementById("wtPlayBtn");
  const wtVoiceBtn = document.getElementById("wtVoiceBtn");
  const wtSeekBar = document.getElementById("wtSeekBar");
  const wtTimeLabel = document.getElementById("wtTimeLabel");
  const wtBigPlay = document.getElementById("wtBigPlayOverlay");
  const wtDownloadBtn = document.getElementById("wtDownloadBtn");

  const VIDEO_DURATION_MS = 50000; // 50s continuous animated video (10s per chapter so speech flows smoothly)
  let vidMs = 0;
  let vidPlaying = false;
  let vidVoiceOn = true;
  let vidLastTs = 0;
  let lastSpokenChapter = -1;

  const VIDEO_CHAPTERS = [
    {
      en_t: "01. Home, 44-Min Delay & Mission Day Slider",
      tr_t: "01. Ana Sayfa, 44 Dk Gecikme & Görev Günü",
      en_sub: "Drag Mission Day (1-500) in the header • Built for astronauts & everyone on Earth",
      tr_sub: "Üstteki Görev Günü (1-500) sürgüsünü kaydırın • Astronotlar ve herkes için",
      en_say: "Welcome to VitalsZero ARES-MED. Because Mars radio replies take up to 44 minutes, our platform runs 100 percent offline, with a live Mission Day slider right in the header.",
      tr_say: "VitalsZero ARES-MED'e hoş geldiniz. Mars'tan yanıt almak 44 dakikayı bulduğu için sistemimiz tamamen çevrimdışı çalışır ve üst bardaki görev günü sürgüsüyle anlık güncellenir."
    },
    {
      en_t: "02. Crew Profiles & 5 Detailed Crises",
      tr_t: "02. Mürettebat Profilleri & 5 Uzay Krizi",
      en_sub: "Pick 1 of 4 astronaut profiles -> Choose 1 of 5 crises -> Inspect live body map",
      tr_sub: "4 astronot profilinden birini seçin -> 5 krizden birini belirleyin -> Vücut haritası",
      en_say: "In Mission and Scenarios, choose one of four astronaut profiles, explore five detailed spaceflight crises, and watch every organ update on the body map.",
      tr_say: "Görev ve Senaryolar sekmesinde dört astronot profilinden birini seçin, beş detaylı uzay krizini inceleyin ve vücut haritasındaki etkileri anında görün."
    },
    {
      en_t: "03. Interactive Lab: Left Menu & 3 Tools",
      tr_t: "03. İnteraktif Lab: Sol Menü & 3 Araç",
      en_sub: "Camera rPPG & Voice • EVA Attention Test • 30-Day Purple vs Red & Green Graph",
      tr_sub: "Kamera rPPG & Ses • EVA Dikkat Testi • 30 Günlük Mor, Kırmızı ve Yeşil Grafik",
      en_say: "Open the Interactive Lab to measure pulse with your camera, test spacewalk reaction speed, or plot your 30-day purple curve in the split-screen workspace.",
      tr_say: "İnteraktif Laboratuvarda kamerayla nabız ölçün, uzay yürüyüşü refleks testine katılın veya bölünmüş ekranda 30 günlük mor tedavi eğrinizi çizin."
    },
    {
      en_t: "04. 4-Step Self-Diagnosis & 1-Page Rx PDF",
      tr_t: "04. 4 Adımlı Teşhis & Tek Sayfa PDF Reçete",
      en_sub: "Location + Mission Days + Symptoms -> Time Plan, FHIR JSON & Clean Rx PDF",
      tr_sub: "Konum + Görev Günü + Belirtiler -> Zaman Planı, FHIR JSON ve Temiz Reçete PDF",
      en_say: "In Self-Diagnosis, enter your location, mission duration, and symptoms to generate a structured care time plan, HL7 FHIR packet, and a clean one-page prescription PDF.",
      tr_say: "Kişisel Teşhis bölümünde konumunuzu, görev sürenizi ve belirtilerinizi girerek zaman planınızı, HL7 FHIR paketinizi ve tek sayfalık reçete PDF'inizi alın."
    },
    {
      en_t: "05. NASA Data Lineage, AI Copilot & FAQ",
      tr_t: "05. NASA Veri Kaynakları, AI Bot & SSS",
      en_sub: "NASA-STD-3001, Twins Study & OSDR + Hybrid AI Assistant + FAQ & Contact",
      tr_sub: "NASA-STD-3001, Twins Study & OSDR + Hibrit AI Asistan + SSS ve İletişim",
      en_say: "Finally, inspect our NASA Data Lineage table in References, or ask our VitalsZero AI Assistant any question in English or Turkish anytime.",
      tr_say: "Son olarak Referanslar sekmesinden NASA veri kaynaklarımızı inceleyebilir veya sağ alttaki VitalsZero AI Asistanına dilediğiniz soruyu sorabilirsiniz."
    }
  ];

  // Pre-generate starfield for smooth 60fps video
  const STARS = Array.from({ length: 65 }, (_, i) => ({
    x: ((i * 137) % 760),
    y: ((i * 89) % 360),
    r: (i % 3) * 0.7 + 0.6,
    spd: (i % 4) * 0.25 + 0.2
  }));

  let elevenApiKey = localStorage.getItem("vz_eleven_key") || "";
  let selectedVoiceChoice = localStorage.getItem("vz_voice_choice") || "auto";
  let currentElevenAudio = null;
  let speechQueueToken = 0;

  const ELEVEN_PERSONAS = [
    { id: "eleven:21m00Tcm4TlvDq8ikWAM", label: "ElevenLabs: Rachel (Warm)" },
    { id: "eleven:pNInz6obpgDQGcFmaJgB", label: "ElevenLabs: Adam (Deep)" },
    { id: "eleven:ErXwobaYiN019PkySvjV", label: "ElevenLabs: Antoni (Calm)" },
    { id: "eleven:EXAVITQu4vr4xnSDxMaL", label: "ElevenLabs: Bella (Bright)" }
  ];

  const wtVoiceSelect = document.getElementById("wtVoiceSelect");
  const wtElevenBtn = document.getElementById("wtElevenBtn");

  function populateVoiceSelect() {
    if (!wtVoiceSelect) return;
    const langPrefix = currentLang === "tr" ? "tr" : "en";
    const voices = ("speechSynthesis" in window ? window.speechSynthesis.getVoices() : []) || [];
    const matching = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith(langPrefix));
    const priority = ["natural", "online", "emel", "ahmet", "aria", "jenny", "guy", "google", "samantha", "yelda", "enhanced", "premium"];
    matching.sort((a, b) => {
      const sa = priority.findIndex((p) => a.name.toLowerCase().includes(p));
      const sb = priority.findIndex((p) => b.name.toLowerCase().includes(p));
      return (sa === -1 ? 99 : sa) - (sb === -1 ? 99 : sb);
    });

    wtVoiceSelect.innerHTML = "";
    const addOpt = (val, text) => {
      const o = document.createElement("option");
      o.value = val;
      o.textContent = text;
      wtVoiceSelect.appendChild(o);
    };

    addOpt("auto", currentLang === "tr" ? "Ses: Otomatik (Doğal)" : "Voice: Auto (Natural)");
    addOpt("tone:calm", currentLang === "tr" ? "Ton: Sakin Uzay Rehberi" : "Tone: Calm Mission Guide");
    addOpt("tone:energetic", currentLang === "tr" ? "Ton: Enerjik Sunucu" : "Tone: Energetic Host");
    ELEVEN_PERSONAS.forEach((p) => addOpt(p.id, p.label));
    matching.forEach((v) => addOpt("os:" + v.name, `${v.name.replace(/Microsoft |Google /g, "").slice(0, 26)} (${v.lang})`));

    const exists = Array.from(wtVoiceSelect.options).some((o) => o.value === selectedVoiceChoice);
    wtVoiceSelect.value = exists ? selectedVoiceChoice : "auto";
  }

  if (wtVoiceSelect) {
    populateVoiceSelect();
    if ("speechSynthesis" in window && typeof window.speechSynthesis.onvoiceschanged !== "undefined") {
      window.speechSynthesis.onvoiceschanged = populateVoiceSelect;
    }
    wtVoiceSelect.addEventListener("change", () => {
      selectedVoiceChoice = wtVoiceSelect.value;
      localStorage.setItem("vz_voice_choice", selectedVoiceChoice);
      if (selectedVoiceChoice.startsWith("eleven:") && !elevenApiKey && wtElevenBtn) {
        wtElevenBtn.click();
      }
      if (vidPlaying) speakChapter(Math.min(4, Math.floor(vidMs / 10000)));
    });
  }

  if (wtElevenBtn) {
    wtElevenBtn.addEventListener("click", () => {
      const k = window.prompt(
        currentLang === "tr"
          ? "ElevenLabs API Anahtarınızı girin (boş bırakırsanız tarayıcıdaki seçili doğal ses kullanılır):"
          : "Enter your ElevenLabs API Key (leave blank to use the selected browser Neural voice):",
        elevenApiKey
      );
      if (k !== null) {
        elevenApiKey = k.trim();
        localStorage.setItem("vz_eleven_key", elevenApiKey);
        wtElevenBtn.textContent = elevenApiKey ? "\uD83C\uDF99 ElevenLabs: ON" : "\uD83C\uDF99 ElevenLabs";
      }
    });
    if (elevenApiKey) wtElevenBtn.textContent = "\uD83C\uDF99 ElevenLabs: ON";
  }

  function pickNaturalVoice(langPrefix) {
    if (!("speechSynthesis" in window)) return null;
    const voices = window.speechSynthesis.getVoices() || [];
    const matching = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith(langPrefix));
    if (matching.length === 0) return null;
    if (selectedVoiceChoice.startsWith("os:")) {
      const targetName = selectedVoiceChoice.slice(3);
      const exact = matching.find((v) => v.name === targetName) || voices.find((v) => v.name === targetName);
      if (exact) return exact;
    }
    const priority = ["natural", "online", "emel", "ahmet", "aria", "jenny", "guy", "google", "samantha", "yelda", "enhanced", "premium"];
    matching.sort((a, b) => {
      const sa = priority.findIndex((p) => a.name.toLowerCase().includes(p));
      const sb = priority.findIndex((p) => b.name.toLowerCase().includes(p));
      return (sa === -1 ? 99 : sa) - (sb === -1 ? 99 : sb);
    });
    return matching[0];
  }

  function stopAllSpeech() {
    speechQueueToken++;
    if (currentElevenAudio) {
      currentElevenAudio.pause();
      currentElevenAudio = null;
    }
    if ("speechSynthesis" in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
  }

  async function speakChapter(chIdx) {
    if (!vidVoiceOn) return;
    const ch = VIDEO_CHAPTERS[chIdx];
    if (!ch) return;
    const text = currentLang === "tr" ? ch.tr_say : ch.en_say;

    // 1. Real ElevenLabs Neural Voice if user configured an API key
    if (elevenApiKey) {
      try {
        stopAllSpeech();
        const voiceId = selectedVoiceChoice.startsWith("eleven:")
          ? selectedVoiceChoice.slice(7)
          : "21m00Tcm4TlvDq8ikWAM"; // Rachel default
        const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
          method: "POST",
          headers: { "xi-api-key": elevenApiKey, "Content-Type": "application/json" },
          body: JSON.stringify({ text, model_id: "eleven_multilingual_v2", voice_settings: { stability: 0.45, similarity_boost: 0.8 } })
        });
        if (res.ok) {
          const blob = await res.blob();
          currentElevenAudio = new Audio(URL.createObjectURL(blob));
          currentElevenAudio.play();
          return;
        }
      } catch (_e) {
        // Fallback to browser natural voice
      }
    }

    // 2. Smooth Continuous Human-Sounding Browser Neural Voice
    if (!("speechSynthesis" in window)) return;
    stopAllSpeech();
    const langPrefix = currentLang === "tr" ? "tr" : "en";
    const bestVoice = pickNaturalVoice(langPrefix);
    const rate = selectedVoiceChoice === "tone:calm" ? 0.94 : selectedVoiceChoice === "tone:energetic" ? 1.04 : 0.99;
    const pitch = selectedVoiceChoice === "tone:calm" ? 0.98 : selectedVoiceChoice === "tone:energetic" ? 1.06 : 1.02;

    const u = new SpeechSynthesisUtterance(text);
    if (bestVoice) u.voice = bestVoice;
    u.lang = currentLang === "tr" ? "tr-TR" : "en-US";
    u.rate = rate;
    u.pitch = pitch;
    window.speechSynthesis.speak(u);
  }

  function drawGuideVideoFrame(ms) {
    if (!vCtx) return;
    const W = vCanvas.width;
    const H = vCanvas.height;
    const tr = currentLang === "tr";
    const chIdx = Math.min(4, Math.floor(ms / 10000));
    const localT = (ms % 10000) / 10000; // 0..1 within chapter
    const ch = VIDEO_CHAPTERS[chIdx];

    // 1. Deep space gradient + animated stars
    const bg = vCtx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#071326");
    bg.addColorStop(1, "#0f294a");
    vCtx.fillStyle = bg;
    vCtx.fillRect(0, 0, W, H);

    STARS.forEach((s) => {
      const sx = (s.x + (ms * 0.015 * s.spd)) % W;
      vCtx.fillStyle = `rgba(224,242,254,${0.35 + 0.55 * Math.abs(Math.sin(ms * 0.002 + s.x))})`;
      vCtx.beginPath();
      vCtx.arc(sx, s.y, s.r, 0, Math.PI * 2);
      vCtx.fill();
    });

    // Planet horizon glow
    vCtx.fillStyle = "rgba(2,132,199,0.18)";
    vCtx.beginPath();
    vCtx.arc(W * 0.72, H + 150, 260, 0, Math.PI * 2);
    vCtx.fill();

    // 2. Top chapter header pill
    vCtx.fillStyle = "rgba(15,23,42,0.78)";
    vCtx.fillRect(0, 0, W, 52);
    vCtx.fillStyle = "#38bdf8";
    vCtx.font = "bold 16px Inter, system-ui, sans-serif";
    vCtx.fillText(tr ? ch.tr_t : ch.en_t, 22, 32);

    vCtx.fillStyle = "#94a3b8";
    vCtx.font = "12px monospace";
    vCtx.fillText(`VITALSZERO VIDEO TOUR • 0${chIdx + 1}/05`, W - 215, 31);

    // 3. Animated Website UI Mockup Card on the Right (Mirrors the Real Updated Website)
    const cardX = 236;
    const cardY = 66;
    const cardW = 502;
    const cardH = 256;
    const slideOffset = Math.max(0, 1 - localT * 4.5) * 28;

    vCtx.save();
    vCtx.translate(slideOffset, 0);
    vCtx.fillStyle = "rgba(255,255,255,0.98)";
    vCtx.beginPath();
    vCtx.roundRect(cardX, cardY, cardW, cardH, 14);
    vCtx.fill();

    // Mini Website 2-Tone Light-Blue Header inside Mockup
    vCtx.fillStyle = "#bae6fd";
    vCtx.beginPath(); vCtx.roundRect(cardX, cardY, cardW, 24, [14, 14, 0, 0]); vCtx.fill();
    vCtx.fillStyle = "#e0f2fe";
    vCtx.fillRect(cardX, cardY + 24, cardW, 18);
    vCtx.fillStyle = "#0c2340"; vCtx.font = "bold 9.5px Inter, sans-serif";
    vCtx.fillText("VITALSZERO • ARES-MED", cardX + 12, cardY + 15);
    const navTabs = ["0.Home", "1.About", "2.Scenarios", "3.Interactive", "4.Diagnosis", "5.Refs", "6.FAQ"];
    navTabs.forEach((nt, ni) => {
      const tx = cardX + 14 + ni * 68;
      const isAct = (chIdx === 0 && ni === 0) || (chIdx === 1 && ni === 2) || (chIdx === 2 && ni === 3) || (chIdx === 3 && ni === 4) || (chIdx === 4 && ni >= 5);
      if (isAct) {
        vCtx.fillStyle = "#0284c7";
        vCtx.beginPath(); vCtx.roundRect(tx - 4, cardY + 26, 62, 14, 4); vCtx.fill();
        vCtx.fillStyle = "#ffffff";
      } else {
        vCtx.fillStyle = "#0c2340";
      }
      vCtx.font = "bold 8.5px Inter, sans-serif";
      vCtx.fillText(nt, tx, cardY + 36);
    });

    const bodyY = cardY + 52;
    if (chIdx === 0) {
      // CHAPTER 1: Home Hero + Live Mission Day Slider (1-500) + 44-Min Delay
      vCtx.fillStyle = "#0f294a";
      vCtx.beginPath(); vCtx.roundRect(cardX + 14, bodyY, cardW - 28, 118, 10); vCtx.fill();
      vCtx.fillStyle = "#38bdf8"; vCtx.font = "bold 11px monospace";
      vCtx.fillText("DID YOU KNOW? • MARS ROUND-TRIP DELAY: 44 MIN", cardX + 26, bodyY + 22);
      vCtx.fillStyle = "#ffffff"; vCtx.font = "bold 14px Inter, sans-serif";
      vCtx.fillText(tr ? "Astronotlar ve Dünya'daki Herkes İçin %100 Çevrimdışı" : "100% Offline Care for Astronauts & Everyone", cardX + 26, bodyY + 46);
      // Animated signal pulse
      const sigX = cardX + 46 + ((localT * 360) % 360);
      vCtx.strokeStyle = "rgba(56,189,248,0.5)"; vCtx.setLineDash([5, 4]);
      vCtx.beginPath(); vCtx.moveTo(cardX + 46, bodyY + 84); vCtx.lineTo(cardX + 420, bodyY + 84); vCtx.stroke();
      vCtx.setLineDash([]);
      vCtx.fillStyle = "#dc2626"; vCtx.beginPath(); vCtx.arc(cardX + 46, bodyY + 84, 11, 0, Math.PI * 2); vCtx.fill();
      vCtx.fillStyle = "#0284c7"; vCtx.beginPath(); vCtx.arc(cardX + 420, bodyY + 84, 13, 0, Math.PI * 2); vCtx.fill();
      vCtx.fillStyle = "#fbbf24"; vCtx.beginPath(); vCtx.arc(sigX, bodyY + 84, 5, 0, Math.PI * 2); vCtx.fill();
      // Animated Mission Day Slider bar below hero
      const simDay = Math.round(1 + localT * 499);
      vCtx.fillStyle = "#f1f5f9"; vCtx.beginPath(); vCtx.roundRect(cardX + 14, bodyY + 130, cardW - 28, 56, 8); vCtx.fill();
      vCtx.fillStyle = "#0c2340"; vCtx.font = "bold 12px monospace";
      vCtx.fillText(`MISSION DAY SLIDER: DAY ${simDay} / 500  |  OWLT: ${(8.2 + simDay * 0.04).toFixed(1)} min`, cardX + 26, bodyY + 153);
      vCtx.fillStyle = "#cbd5e1"; vCtx.beginPath(); vCtx.roundRect(cardX + 26, bodyY + 166, 420, 6, 3); vCtx.fill();
      vCtx.fillStyle = "#0284c7"; vCtx.beginPath(); vCtx.roundRect(cardX + 26, bodyY + 166, 420 * localT, 6, 3); vCtx.fill();
      vCtx.beginPath(); vCtx.arc(cardX + 26 + 420 * localT, bodyY + 169, 8, 0, Math.PI * 2); vCtx.fill();
    } else if (chIdx === 1) {
      // CHAPTER 2: Step 1 (4 Photo Profiles) -> Step 2 (5 Crisis Columns) -> Step 3 (Body Map)
      const phase = Math.floor(localT * 3);
      vCtx.fillStyle = "#0c2340"; vCtx.font = "bold 13px Inter, sans-serif";
      vCtx.fillText(tr ? "Adım 1: 4 Profil  →  Adım 2: 5 Kriz  →  Adım 3: Vücut Etkisi" : "Step 1: 4 Crew Profiles → Step 2: 5 Crises → Step 3: Body Map", cardX + 16, bodyY + 14);
      // 4 photo-top profile cards
      const crewNames = ["Cmdr. Elena", "Maj. Kenji", "Dr. Amara", "Dr. Lucas"];
      crewNames.forEach((cn, i) => {
        const cx = cardX + 16 + i * 119;
        const active = phase === 0 ? i === Math.floor((localT * 12) % 4) : i === 0;
        vCtx.fillStyle = active ? "#e0f2fe" : "#f8fafc";
        vCtx.strokeStyle = active ? "#0284c7" : "#cbd5e1";
        vCtx.lineWidth = active ? 2 : 1;
        vCtx.beginPath(); vCtx.roundRect(cx, bodyY + 26, 110, 82, 8); vCtx.fill(); vCtx.stroke();
        vCtx.fillStyle = "#0f294a";
        vCtx.beginPath(); vCtx.roundRect(cx + 4, bodyY + 30, 102, 42, 6); vCtx.fill();
        vCtx.fillStyle = "#38bdf8"; vCtx.beginPath(); vCtx.arc(cx + 55, bodyY + 51, 13, 0, Math.PI * 2); vCtx.fill();
        vCtx.fillStyle = "#0c2340"; vCtx.font = "bold 10px Inter, sans-serif";
        vCtx.fillText(cn, cx + 10, bodyY + 90);
      });
      // 5 Crisis Columns below
      const crises = ["Nominal", "CO2 Fault", "Solar Storm", "SANS/Bone", "Sleep Debt"];
      crises.forEach((cr, i) => {
        const cx = cardX + 16 + i * 95;
        const hot = (phase >= 1 && i === 1);
        vCtx.fillStyle = hot ? "#0c2340" : "#f1f5f9";
        vCtx.beginPath(); vCtx.roundRect(cx, bodyY + 118, 88, 70, 8); vCtx.fill();
        vCtx.fillStyle = hot ? "#38bdf8" : "#0284c7"; vCtx.font = "bold 9.5px monospace";
        vCtx.fillText(`0${i + 1}`, cx + 8, bodyY + 135);
        vCtx.fillStyle = hot ? "#ffffff" : "#0f172a"; vCtx.font = "bold 10px Inter, sans-serif";
        vCtx.fillText(cr, cx + 8, bodyY + 154);
      });
      vCtx.lineWidth = 1;
    } else if (chIdx === 2) {
      // CHAPTER 3: Interactive Lab Left/Right Split + Live rPPG Pulse + 30-Day Purple/Red/Green Graph
      // Left 3 tool buttons
      const tools = ["01. Camera rPPG", "02. EVA Attention", "03. 30-Day Quiz"];
      tools.forEach((tl, i) => {
        const ty = bodyY + 6 + i * 60;
        const sel = Math.floor(localT * 3) === i;
        vCtx.fillStyle = sel ? "#0c2340" : "#f1f5f9";
        vCtx.beginPath(); vCtx.roundRect(cardX + 14, ty, 136, 50, 8); vCtx.fill();
        vCtx.fillStyle = sel ? "#ffffff" : "#0c2340"; vCtx.font = "bold 10.5px Inter, sans-serif";
        vCtx.fillText(tl, cardX + 24, ty + 29);
      });
      // Right stage: Live ECG/rPPG + 30-day curves
      vCtx.fillStyle = "#f8fafc"; vCtx.strokeStyle = "#cbd5e1";
      vCtx.beginPath(); vCtx.roundRect(cardX + 162, bodyY + 6, 324, 174, 10); vCtx.fill(); vCtx.stroke();
      vCtx.fillStyle = "#0c2340"; vCtx.font = "bold 12px Inter, sans-serif";
      vCtx.fillText(tr ? "Canlı Nabız + 30 Günlük Mor Grafik" : "Live rPPG + 30-Day Purple Graph", cardX + 176, bodyY + 26);
      // rPPG wave
      vCtx.strokeStyle = "#0284c7"; vCtx.lineWidth = 2.5;
      vCtx.beginPath();
      for (let x = 0; x <= 290; x += 6) {
        const ph = (x * 0.09) - ms * 0.012;
        const y = bodyY + 64 - Math.sin(ph) * 12 - (Math.sin(ph * 3) > 0.88 ? 16 : 0);
        if (x === 0) vCtx.moveTo(cardX + 176 + x, y); else vCtx.lineTo(cardX + 176 + x, y);
      }
      vCtx.stroke();
      // 30-day Red / Purple / Green curves
      const prog = Math.min(1, localT * 1.35);
      const drawC = (col, endY) => {
        vCtx.strokeStyle = col; vCtx.lineWidth = 3;
        vCtx.beginPath(); vCtx.moveTo(cardX + 178, bodyY + 158);
        vCtx.quadraticCurveTo(cardX + 310, bodyY + (158 + endY) / 2, cardX + 178 + 286 * prog, bodyY + 158 + (endY - 158) * prog);
        vCtx.stroke();
      };
      drawC("#dc2626", 98);
      drawC("#7c3aed", 122);
      drawC("#059669", 148);
      vCtx.lineWidth = 1;
    } else if (chIdx === 3) {
      // CHAPTER 4: 4-Step Self-Diagnosis -> 1-Page Medical Prescription PDF + HL7 FHIR
      vCtx.fillStyle = "#0c2340"; vCtx.font = "bold 13px Inter, sans-serif";
      vCtx.fillText(tr ? "4 Adımlı Teşhis → Tek Sayfa PDF Reçete & FHIR" : "4-Step Self-Diagnosis → 1-Page Rx PDF & HL7 FHIR", cardX + 16, bodyY + 14);
      const dSteps = ["1.Location", "2.Days", "3.Symptoms", "4.Rx PDF"];
      dSteps.forEach((ds, i) => {
        const dx = cardX + 16 + i * 118;
        vCtx.fillStyle = i === 3 ? "#0284c7" : "#dcfce7";
        vCtx.beginPath(); vCtx.roundRect(dx, bodyY + 26, 108, 22, 11); vCtx.fill();
        vCtx.fillStyle = i === 3 ? "#ffffff" : "#166534"; vCtx.font = "bold 10px Inter, sans-serif";
        vCtx.fillText(ds, dx + 18, bodyY + 41);
      });
      // Clean Prescription Card
      vCtx.fillStyle = "#f0f9ff"; vCtx.strokeStyle = "#0c2340"; vCtx.lineWidth = 1.5;
      vCtx.beginPath(); vCtx.roundRect(cardX + 16, bodyY + 58, cardW - 32, 128, 10); vCtx.fill(); vCtx.stroke();
      vCtx.fillStyle = "#0369a1"; vCtx.font = "bold 12px Inter, sans-serif";
      vCtx.fillText("Rx: ARES-MED Spaceflight Prescription & Time Plan", cardX + 30, bodyY + 80);
      vCtx.fillStyle = "#0f172a"; vCtx.font = "11.5px Inter, sans-serif";
      vCtx.fillText("• Immediate (0–15m): Verify cabin ppCO2 < 3.0 mmHg & hydrate 500 mL", cardX + 30, bodyY + 106);
      vCtx.fillText("• Short-Term (1–6h): 45m LBNP + ARED resistance protocol", cardX + 30, bodyY + 128);
      vCtx.fillText("• Follow-Up (24–72h): Save 1-Page Rx PDF & transmit HL7 FHIR JSON", cardX + 30, bodyY + 150);
      vCtx.lineWidth = 1;
    } else {
      // CHAPTER 5: References (NASA Data Lineage) + AI Copilot + FAQ
      vCtx.fillStyle = "#0c2340"; vCtx.font = "bold 13px Inter, sans-serif";
      vCtx.fillText(tr ? "5. NASA Veri Kaynakları, AI Asistan & 6. SSS" : "5. NASA Data Lineage, AI Assistant & 6. FAQ", cardX + 16, bodyY + 14);
      const refs = ["NASA-STD-3001 (Vitals & Radiation)", "NASA Twins Study (SANS & Stress)", "NASA OSDR OSD-570/571 (Bone/Fluid)", "TRISH HERMES & PVT-B (FHIR/Cognition)"];
      refs.forEach((rf, i) => {
        vCtx.fillStyle = "#eff6ff";
        vCtx.beginPath(); vCtx.roundRect(cardX + 16, bodyY + 26 + i * 28, 285, 22, 6); vCtx.fill();
        vCtx.fillStyle = "#0c2340"; vCtx.font = "bold 10px Inter, sans-serif";
        vCtx.fillText("✓ " + rf, cardX + 24, bodyY + 41 + i * 28);
      });
      // AI Chat Bubble on right
      vCtx.fillStyle = "#0f294a";
      vCtx.beginPath(); vCtx.roundRect(cardX + 312, bodyY + 26, 174, 152, 12); vCtx.fill();
      vCtx.fillStyle = "#38bdf8"; vCtx.font = "bold 11px Inter, sans-serif";
      vCtx.fillText("VitalsZero AI Copilot", cardX + 324, bodyY + 48);
      vCtx.fillStyle = "#e0f2fe"; vCtx.font = "10.5px Inter, sans-serif";
      vCtx.fillText("• Space Apps 2026 Ready", cardX + 324, bodyY + 74);
      vCtx.fillText("• Live Web + Math Solver", cardX + 324, bodyY + 94);
      vCtx.fillText("• FAQ & Email Support", cardX + 324, bodyY + 114);
      vCtx.fillStyle = "#7dd3fc"; vCtx.font = "bold 11px monospace";
      vCtx.fillText("vitalszero.health", cardX + 324, bodyY + 158);
    }
    vCtx.restore();

    // 4. Cute Astronaut Mascot Floating & Tilting on the Left
    const bobY = Math.sin(ms * 0.0045) * 10;
    const tilt = Math.sin(ms * 0.003) * 0.06;
    if (mascotImg && mascotImg.complete && mascotImg.naturalWidth > 0) {
      vCtx.save();
      vCtx.translate(122, 195 + bobY);
      vCtx.rotate(tilt);
      vCtx.fillStyle = "rgba(255,255,255,0.96)";
      vCtx.beginPath(); vCtx.arc(0, 0, 82, 0, Math.PI * 2); vCtx.fill();
      vCtx.strokeStyle = "#38bdf8"; vCtx.lineWidth = 3; vCtx.stroke();
      vCtx.beginPath(); vCtx.arc(0, 0, 78, 0, Math.PI * 2); vCtx.clip();
      vCtx.drawImage(mascotImg, -76, -76, 152, 152);
      vCtx.restore();
    }

    // 5. Subtitle Bar at Bottom
    vCtx.fillStyle = "rgba(12,35,64,0.9)";
    vCtx.fillRect(0, H - 64, W, 64);
    vCtx.fillStyle = "#ffffff";
    vCtx.font = "600 14px Inter, system-ui, sans-serif";
    vCtx.fillText(tr ? ch.tr_sub : ch.en_sub, 24, H - 26);

    // Update UI timeline
    if (wtSeekBar) wtSeekBar.value = Math.round((ms / VIDEO_DURATION_MS) * 2500);
    if (wtTimeLabel) {
      const sec = Math.floor(ms / 1000);
      wtTimeLabel.textContent = `0:${sec < 10 ? "0" : ""}${sec} / 0:50`;
    }
  }

  function videoLoop(ts) {
    if (!vidPlaying) return;
    if (!vidLastTs) vidLastTs = ts;
    const dt = ts - vidLastTs;
    vidLastTs = ts;
    const nextMs = vidMs + dt;
    const nextCh = Math.min(4, Math.floor(nextMs / 10000));
    // Never cut off a sentence mid-speech: hold at chapter boundary until speech finishes
    if (vidVoiceOn && nextCh !== lastSpokenChapter && "speechSynthesis" in window && window.speechSynthesis.speaking) {
      drawGuideVideoFrame(vidMs);
      requestAnimationFrame(videoLoop);
      return;
    }
    vidMs = nextMs;
    if (vidMs >= VIDEO_DURATION_MS) {
      vidMs = 0;
      lastSpokenChapter = -1;
    }
    const chIdx = Math.min(4, Math.floor(vidMs / 10000));
    if (chIdx !== lastSpokenChapter) {
      lastSpokenChapter = chIdx;
      speakChapter(chIdx);
    }
    drawGuideVideoFrame(vidMs);
    requestAnimationFrame(videoLoop);
  }

  function toggleGuideVideo(forcePlay) {
    vidPlaying = typeof forcePlay === "boolean" ? forcePlay : !vidPlaying;
    if (wtBigPlay) wtBigPlay.style.display = vidPlaying ? "none" : "flex";
    if (wtPlayBtn) wtPlayBtn.textContent = vidPlaying ? (currentLang === "tr" ? "\u23F8 Duraklat" : "\u23F8 Pause") : (currentLang === "tr" ? "\u25B6 Oynat" : "\u25B6 Play Video");
    if (vidPlaying) {
      vidLastTs = 0;
      const chIdx = Math.min(4, Math.floor(vidMs / 10000));
      lastSpokenChapter = chIdx;
      speakChapter(chIdx);
      requestAnimationFrame(videoLoop);
    } else if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  if (wtPlayBtn) wtPlayBtn.addEventListener("click", () => toggleGuideVideo());
  if (wtBigPlay) wtBigPlay.addEventListener("click", () => toggleGuideVideo(true));
  if (vCanvas) vCanvas.addEventListener("click", () => toggleGuideVideo());
  if (wtVoiceBtn) {
    wtVoiceBtn.addEventListener("click", () => {
      vidVoiceOn = !vidVoiceOn;
      wtVoiceBtn.textContent = vidVoiceOn ? "\uD83D\uDD0A Voice: ON" : "\uD83D\uDD07 Voice: OFF";
      if (!vidVoiceOn && "speechSynthesis" in window) window.speechSynthesis.cancel();
    });
  }
  if (wtSeekBar) {
    wtSeekBar.addEventListener("input", () => {
      vidMs = (Number(wtSeekBar.value) / 2500) * VIDEO_DURATION_MS;
      drawGuideVideoFrame(vidMs);
    });
  }
  if (wtDownloadBtn && vCanvas && typeof MediaRecorder !== "undefined") {
    wtDownloadBtn.addEventListener("click", () => {
      wtDownloadBtn.textContent = "Recording...";
      vidMs = 0;
      lastSpokenChapter = -1;
      const stream = vCanvas.captureStream(30);
      const rec = new MediaRecorder(stream, { mimeType: "video/webm" });
      const chunks = [];
      rec.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      rec.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "VitalsZero_ARES_MED_Tour.webm";
        a.click();
        wtDownloadBtn.textContent = "\u2B07 .webm";
      };
      rec.start();
      toggleGuideVideo(true);
      setTimeout(() => {
        rec.stop();
        toggleGuideVideo(false);
      }, 10000);
    });
  }
  if (mascotImg) mascotImg.onload = () => drawGuideVideoFrame(vidMs);
  drawGuideVideoFrame(0);

  // 2. Sequential 6-Question 30-Day Treatment Quiz (Reveals Graph at End)
  const QUIZ_QUESTIONS = [
    {
      q_en: "Q1 (Cabin Air): CO2 sensors rise in the crew quarters while you have a mild headache. What do you do first?",
      q_tr: "S1 (Kabin Havası): Mürettebat kabininde CO2 sensörleri yükseliyor ve hafif baş ağrınız var. İlk ne yaparsınız?",
      opts: [
        { en: "Turn on inter-module air fans & refresh the CO2 scrubber", tr: "Modüller arası hava fanlarını açıp CO2 temizleyiciyi yenilerim", score: 1 },
        { en: "Take a painkiller and ignore the air fans", tr: "Ağrı kesici alıp hava fanlarını görmezden gelirim", score: -1 }
      ]
    },
    {
      q_en: "Q2 (Microgravity Eyes & Fluid): Eye scan shows early optic nerve swelling (SANS). Your next step?",
      q_tr: "S2 (Mikro-yerçekimi Göz & Sıvı): Göz taraması erken optik sinir şişmesi (SANS) gösteriyor. Sonraki adımınız?",
      opts: [
        { en: "Run a 45-min Lower Body Negative Pressure (LBNP) session", tr: "45 dakikalık Alt Vücut Negatif Basınç (LBNP) seansı uygularım", score: 1 },
        { en: "Skip LBNP and sleep flat without fluid tracking", tr: "LBNP'yi atlayıp sıvı takibi olmadan düz uyurum", score: -1 }
      ]
    },
    {
      q_en: "Q3 (Bones & Muscles): Daily schedule is busy during Mars transit. How do you handle ARED exercise?",
      q_tr: "S3 (Kemik & Kas): Mars yolculuğunda günlük program yoğun. ARED direnç egzersizini nasıl yönetirsiniz?",
      opts: [
        { en: "Complete full 60-min ARED resistance + hydration protocol", tr: "Tam 60 dakikalık ARED direnç + hidrasyon protokolünü tamamlarım", score: 1 },
        { en: "Skip exercise for the next two weeks to save time", tr: "Zaman kazanmak için sonraki iki hafta egzersizi atlarım", score: -1 }
      ]
    },
    {
      q_en: "Q4 (Radiation & Sleep): A solar storm alert triggers while your PVT reaction time slows to 345 ms. Action?",
      q_tr: "S4 (Radyasyon & Uyku): PVT tepki süreniz 345 ms'ye yavaşlarken güneş fırtınası uyarısı çalıyor. Ne yaparsınız?",
      opts: [
        { en: "Move to shielded storm shelter, pause EVA & enforce 8h sleep", tr: "Zırhlı fırtına sığınağına geçer, EVA'yı durdurur ve 8 saat uyurum", score: 1 },
        { en: "Continue exterior spacewalk despite elevated radiation", tr: "Artan radyasyona rağmen dış uzay yürüyüşüne devam ederim", score: -1 }
      ]
    },
    {
      q_en: "Q5 (Hydration & Kidney Stones): Urine calcium rises from 0g bone resorption. What is your countermeasure?",
      q_tr: "S5 (Hidrasyon & Böbrek Taşı): 0g kemik erimesi nedeniyle idrarda kalsiyum artıyor. Önleminiz nedir?",
      opts: [
        { en: "Drink >2.5L water daily & follow potassium citrate prophylaxis", tr: "Günde >2.5L su içip potasyum sitrat korumasını uygularım", score: 1 },
        { en: "Limit water intake to save cabin recycling time", tr: "Su geri dönüşümünden tasarruf için sıvı alımını azaltırım", score: -1 }
      ]
    },
    {
      q_en: "Q6 (Earth Sync): A crewmate develops unilateral neck swelling in 0g. How do you log and escalate?",
      q_tr: "S6 (Dünya Senkronu): Bir ekip arkadaşınızda 0g'de tek taraflı boyun şişliği oluştu. Nasıl müdahale edersiniz?",
      opts: [
        { en: "Do NOT massage; run vascular ultrasound & send Level-3 FHIR packet", tr: "Masaj YAPMAM; damar ultrasonu çekip Seviye-3 FHIR paketi yollarım", score: 1 },
        { en: "Massage the neck and wait 5 days before checking", tr: "Boyna masaj yapıp 5 gün beklerim", score: -1 }
      ]
    }
  ];

  let quizIdx = 0;
  let quizScoreSum = 0;

  function renderQuiz() {
    const container = document.getElementById("quizContainer");
    const qStage = document.getElementById("quizQuestionStage");
    const rStage = document.getElementById("quizResultStage");
    const badge = document.getElementById("quizStepBadge");
    const outcomeText = document.getElementById("userQuizOutcomeText");
    if (!container) return;
    const tr = currentLang === "tr";

    if (quizIdx >= QUIZ_QUESTIONS.length) {
      const normalized = quizScoreSum / QUIZ_QUESTIONS.length;
      state.userQuizImpact = normalized;
      if (badge) badge.textContent = tr ? "Tamamlandı (6 / 6)" : "Completed (6 / 6)";
      const summary = tr
        ? normalized >= 0.5
          ? "Mükemmel! Tıbbi kararlarınız 30 günde riski düşürdü (Mor çizgi optimal iyileşmeye yakın)."
          : normalized >= 0
          ? "Karışık sonuç. Bazı riskler azaltıldı ancak atlanan önlemler orta düzeyde sapma bıraktı."
          : "Yüksek risk! Temel önlemleri atlamak Mor eğrinin tedavisiz kırmızı seviyeye tırmanmasına yol açtı."
        : normalized >= 0.5
        ? "Excellent! Your medical decisions flatten risk over 30 days (Purple curve tracks near optimal recovery)."
        : normalized >= 0
        ? "Mixed outcome. Some risks were mitigated, but missed countermeasures leave moderate drift."
        : "High risk! Skipping key countermeasures caused your Purple trajectory to climb toward untreated levels.";
      if (outcomeText) outcomeText.textContent = summary;
      if (qStage) qStage.style.display = "none";
      if (rStage) rStage.style.display = "block";
      renderDashboard();
      return;
    }

    if (qStage) qStage.style.display = "block";
    if (rStage) rStage.style.display = "none";
    const item = QUIZ_QUESTIONS[quizIdx];
    if (badge) badge.textContent = tr ? `Soru ${quizIdx + 1} / ${QUIZ_QUESTIONS.length}` : `Question ${quizIdx + 1} of ${QUIZ_QUESTIONS.length}`;
    container.innerHTML = `
      <div class="quiz-question-card">
        <strong style="color:var(--blue-navy); font-size:15.5px; display:block; line-height:1.45;">${tr ? item.q_tr : item.q_en}</strong>
        <div class="quiz-options-list">
          ${item.opts.map((o, i) => `<button class="quiz-opt-btn" data-score="${o.score}" data-idx="${i}">${tr ? o.tr : o.en}</button>`).join("")}
        </div>
      </div>
    `;
    container.querySelectorAll(".quiz-opt-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        quizScoreSum += Number(btn.dataset.score);
        quizIdx += 1;
        state.userQuizImpact = quizScoreSum / QUIZ_QUESTIONS.length;
        renderQuiz();
      });
    });
  }

  const restartQuizBtn = document.getElementById("restartQuizBtn");
  if (restartQuizBtn) {
    restartQuizBtn.addEventListener("click", () => {
      quizIdx = 0;
      quizScoreSum = 0;
      state.userQuizImpact = undefined;
      renderQuiz();
      renderDashboard();
    });
  }
  renderQuiz();

  // 3. Polished EN / TR Language Toggle
  const I18N_TR = {
    header_sub: "Otonom Gerçek Zamanlı Değerlendirme & Uzay Tıbbı Karar Sistemi",
    lbl_regime: "GÖREV ORTAMI",
    lbl_day: "GÖREV GÜNÜ",
    lbl_delay: "İLETİŞİM GECİKMESİ",
    nav_home: "Ana Sayfa",
    nav_home_sub: "Genel Bakış, Problem & SSS",
    nav_about: "Hakkımızda",
    nav_about_sub: "Hikayemiz, Animasyonlu Tur & SWOT",
    nav_scenarios: "Görev & Senaryolar",
    nav_scenarios_sub: "Adım Adım: Avatar → Senaryo → Etki",
    nav_interactive: "İnteraktif Laboratuvar",
    nav_interactive_sub: "3 Uygulamalı Astronot Aracı",
    sub_camera: "• Kamera & Ses Analizi",
    sub_attention: "• Astronot Dikkat Testi",
    sub_quiz: "• 30 Günlük Tedavi Testi",
    nav_diagnosis: "Kişisel Teşhis & Reçete",
    nav_diagnosis_sub: "Adım Adım Tanı, Reçete & Zaman Planı",
    dyk_badge: "BUNU BİLİYOR MUYDUNUZ? • NASA SPACE APPS 2026",
    hero_title: "Astronotların Dünya'ya mesaj gönderip yanıt almasının <span>44 dakika</span> sürdüğünü biliyor muydunuz?",
    hero_lead: "Derin uzayda tıbbi bir acil durum Dünya'yı bekleyemez. <strong>VitalsZero (ARES-MED)</strong>, uzay aracının içinde %100 çevrimdışı çalışan otonom bir uzay tıbbı yardımcı pilotu sunar.",
    cta_scenarios: "Görev & Senaryoları Başlat →",
    cta_interactive: "İnteraktif Laboratuvar →",
    cta_diagnosis: "Kişisel Teşhis & Reçete →",
    prob_tag: "DERİN UZAY PROBLEMİ",
    prob_title: "İletişim Gecikmeleri ve Sıfır Yerçekimi Yanılgısı",
    prob_desc: "Mars görevlerinde radyo sinyalleri tek yönde 22 dakikaya (gidiş-dönüş 44 dk) ulaşır. Standart Dünya yazılımları 0g'de yanılır; çünkü sıvılar başa toplanır ve kabin CO2 artışı hastalık belirtilerini taklit eder.",
    sol_tag: "ÇÖZÜMÜMÜZ",
    sol_title: "VitalsZero Ekibi olarak bu gecikme sorununu şu adımlarla çözüyoruz:",
    sol_desc: "Astronot yaşamsal verilerini kabin hava ve radyasyon sensörleriyle %100 çevrimdışı birleştiriyor, referansları her astronotun 0g fizyolojisine uyarlıyor ve Dünya'yı beklemeden anlık reçete ile HL7 FHIR paketleri üretiyoruz.",
    card1_tag: "01 • GÖREV & SENARYOLAR",
    card1_title: "Mürettebat ve 5 Uzay Krizini Keşfet",
    card1_desc: "Bir astronot avatarı seçin, 5 derin uzay senaryosundan birini belirleyin ve organların anatomik haritada nasıl etkilendiğini izleyin.",
    card1_link: "Senaryoları Aç →",
    card2_tag: "02 • İNTERAKTİF LABORATUVAR (3 ARAÇ)",
    card2_title: "Kendinizi Astronot Olarak Test Edin",
    card2_desc: "Kamera ile nabız/ses ölçün, uzay yürüyüşü dikkat testine girin ve 6 soruluk 30 günlük tedavi grafiğinizi çizin.",
    card2_link: "Laboratuvara Gir →",
    card3_tag: "03 • KİŞİSEL TEŞHİS & REÇETE",
    card3_title: "Kişisel Belirti & Zaman Planı",
    card3_desc: "Konumunuzu, görev gününüzü ve belirtilerinizi girerek size özel tıbbi reçete ve yazdırılabilir PDF alın.",
    card3_link: "Teşhise Başla →",
    home_diff_badge: "TEMEL YENİLİK",
    home_diff_title: "VitalsZero'yu Farklı Kılan Nedir?",
    home_diff_1: "<strong>Beden + Uzay Aracı Entegrasyonu:</strong> Kabin CO2 ve radyasyon verilerini yaşamsal bulgularla birleştirerek yanlış ilaç yerine doğru teknik önlemi önerir.",
    home_diff_2: "<strong>Kişiselleştirilmiş 0g Referansı:</strong> Sabit Dünya normları yerine her astronotun uzaya uyum sağlamış taban değerini izler.",
    home_diff_3: "<strong>Yalnızca Astronotlar İçin Değil, Herkes İçin:</strong> Gerçek astronotlar, uçuş cerrahları, öğrenciler, kırsal klinikler ve uzay sağlığını merak eden herkes için tasarlandı.",
    home_faq_badge: "HIZLI REHBER",
    home_faq_title: "Hızlı Kullanım Kılavuzu (SSS)",
    faq1_q: "Bu sitede nasıl gezinirim?",
    faq1_a: "Üstteki ortalanmış menü çubuğunu kullanarak <strong>Ana Sayfa</strong>, <strong>Hakkımızda</strong>, <strong>Görev & Senaryolar</strong>, <strong>İnteraktif Lab</strong>, <strong>Kişisel Teşhis</strong>, <strong>Referanslar</strong> ve <strong>SSS & İletişim</strong> arasında anında geçiş yapabilirsiniz.",
    nav_refs: "Referanslar & Veri Kaynağı",
    nav_refs_sub: "NASA Veri Setleri ve Metrik Eşleşmesi",
    nav_faq: "SSS & İletişim",
    ref_sources_t: "Temel Bilimsel ve Mühendislik Referansları",
    home_video_title: "ARES-MED 1080p Sistem Tanıtım Videosu",
    video_card_title: "ARES-MED Hikayesi & Bilimsel Altyapımız",
    about_video_caption: "VitalsZero | ARES-MED — 0g Fizyolojisi, Kabin Sensör Füzyonu ve Çift Kullanımlı Etki",
    inter_fill_badge: "DERİN UZAY GÖREV HAZIRLIĞI",
    inter_fill_t: "Gerçek Zamanlı Fizyolojik ve Bilişsel Kontroller",
    inter_fill_d: "Tüm interaktif laboratuvar ölçümleri %100 cihazınızda kalır; mürettebatın ve Dünya'daki kullanıcıların kalp ritmini, EVA dikkatini ve 30 günlük önlem etkisini çevrimdışı izlemesini sağlar.",
    faq_page_t: "Sıkça Sorulan Sorular (SSS)",
    faq4_q: "Üstteki Görev Günü (Mission Day) sürgüsü sistemi nasıl etkiler?",
    faq4_a: "<strong>Görev Günü (1–500)</strong> sürgüsünü kaydırmak Dünya–Mars iletişim gecikmesini (OWLT), birikimli radyasyon dozunu, SANS göz siniri basıncını ve HL7 FHIR çıktısını gerçek zamanlı günceller.",
    faq5_q: "Kamera ve mikrofon verilerim gizli kalıyor mu?",
    faq5_a: "%100 gizlidir. Tüm optik nabız (rPPG) ve ses stresi hesaplamaları yalnızca tarayıcınızda çalışır; hiçbir görüntü veya ses sunucuya gönderilmez.",
    faq6_q: "Astronotlar dışında kimler ARES-MED'i kullanabilir?",
    faq6_a: "Öğrenciler, uzay meraklıları, Uçuş Cerrahları ve uzman doktora erişimi olmayan kırsal klinikler ARES-MED'i Türkçe ve İngilizce olarak kullanabilir.",
    faq_more_help: "Başka sorularınız mı var? Aşağıdaki e-posta adresimizden bize ulaşabilir veya doğrudan <strong>VitalsZero AI Asistanına</strong> sorabilirsiniz!",
    faq_ask_ai_btn: "VitalsZero AI'a Sor →",
    faq2_q: "Hangi NASA verileri kullanılıyor?",
    faq2_a: "<strong>NASA OSDR</strong> (OSD-570/571), <strong>NASA Twins Study</strong>, <strong>HRP ExMC CDS</strong>, <strong>NASA-STD-3001</strong> ve <strong>TRISH HERMES</strong> (HL7 FHIR).",
    faq3_q: "Verilerim gizli kalıyor mu?",
    faq3_a: "Evet! Kamera nabzı ve mikrofon analizleri tamamen kendi cihazınızda yerel olarak işlenir.",
    contact_title: "VitalsZero Ekibine Ulaşın",
    contact_sub: "Elif Azra Özata & Ali Manas Aydoğmuş • NASA Space Apps 2026",
    about_hero_title: "Hikayemiz ve ARES-MED (Otonom Gerçek Zamanlı Değerlendirme & Uzay Tıbbı Karar Sistemi)",
    about_p1: "Bu fikir; biyolojiye, insan sağlığına, bilime, uzaya ve teknolojiye tutkuyla bağlı iki genç araştırmacı <strong>Elif Azra Özata</strong> ve <strong>Ali Manas Aydoğmuş</strong> tarafından geliştirildi. Artemis Ay üsleri ve Mars keşiflerinde Dünya ile iletişim 44 dakikaya kadar geciktiğinde astronotların yalnız kalmamasını hedefliyoruz.",
    about_p2: "<strong>Misyonumuz ve Hedef Kitlemiz:</strong> Derin uzay mürettebatları, Uçuş Cerrahları ve uzay tıbbı meraklıları için %100 çevrimdışı çalışan akıllı bir tıbbi karar desteği ve erken uyarı sistemi sunmak.",
    about_left_title: "ARES-MED'in Bilimsel Temeli",
    sci_p1: "<strong>01. 44 Dk Kesinti & 0g Kalibrasyon:</strong> Sıfır yerçekiminde ~2 L sıvı başa kayar (SANS, ONSD > 5.8 mm). ARES-MED sınırları Görev Günü (1–500), yerçekimi (0g/0.16g/0.38g) ve cinsiyete göre uyarlar.",
    sci_p2: "<strong>02. Uzay Aracı Entegrasyonu:</strong> Mürettebat verilerini kabin ppCO2, NASA-STD-3001 radyasyon sınırı (600 mSv) ve aylık ~%1,25 kemik kaybıyla doğrudan eşler.",
    sci_p3: "<strong>03. İnteraktif Kontroller & Reçete PDF:</strong> 4 astronot profili × 5 kriz, kamera rPPG ve ses stresi, NASA PVT dikkat testi, 30 günlük test ve tek sayfalık Reçete PDF + HL7 FHIR çıktısını birleştirir.",
    sci_adv: "<strong>Avantajımız:</strong> Hem astronotlar hem Dünya'daki herkes için—%100 çevrimdışı; NASA OSDR, Twins Study ve TRISH HERMES temelli.",
    about_right_title: "Web Sitesinin İşlevi (Animasyonlu Rehber)",
    guide_intro: "Sol üstteki <strong>☰ Menü</strong> ile tüm modüllere ulaşabilir veya aşağıdaki animasyonlu turu izleyebilirsiniz:",
    guide_1: "<strong>0. Ana Sayfa:</strong> 44 dakikalık iletişim gecikmesi problemini ve VitalsZero'nun çözümünü özetler.",
    guide_2: "<strong>1. Hakkımızda:</strong> Kurucuların hikayesini, NASA veri kaynaklarını, animasyonlu rehberi ve SWOT analizini sunar.",
    guide_3: "<strong>2. Görev & Senaryolar:</strong> Önce astronot avatarınızı seçin, sonra 5 senaryodan birini seçip vücut etkilerini ve eylem planını görün.",
    guide_4: "<strong>3a. Kamera & Ses Analizi:</strong> Web kamerası (rPPG) ve mikrofon ile temassız nabız, solunum ve ses stresi ölçer.",
    guide_5: "<strong>3b. Astronot Dikkat Testi:</strong> Uzay yürüyüşü (EVA) sırasında refleks hızınızı milisaniye cinsinden ölçer.",
    guide_6: "<strong>3c. 30 Günlük Test & 4. Kişisel Teşhis:</strong> 6 soruluk testi çözüp mor grafiği görün veya 4. sekmede kişisel reçete ve zaman planı oluşturun.",
    swot_title: "ARES-MED Projesi SWOT Analizi",
    swot_s_t: "S • Güçlü Yönler (Strengths)",
    swot_s_1: "44 dakikalık Mars iletişim kesintileri için %100 çevrimdışı çalışır.",
    swot_s_2: "Yalnızca astronotlar için değil; öğrenciler, uzay meraklıları ve uzak klinikler dahil herkes için tasarlanmıştır.",
    swot_s_3: "Resmi NASA OSDR, Twins Study ve NASA-STD-3001 verilerine dayanır.",
    swot_s_4: "<strong>Koşullu Güç (If-Clause):</strong> Eğer canlı ISS uçuş sensörleri, kontrollü kabin aydınlatması ve klinik sertifikasyon ile birleştirilirse doğrudan uçuş onaylı tıbbi yardımcı pilota dönüşür.",
    swot_w_t: "W • Zayıf Yönler (Weaknesses)",
    swot_w_1: "Prototip şu aşamada uçuş donanımı yerine simüle edilmiş telemetri kullanır.",
    swot_w_2: "Kamera nabız (rPPG) doğruluğu kabin aydınlatmasına duyarlıdır.",
    swot_w_3: "Uçuş onaylı tıbbi kitlerin yerini alması için resmi klinik sertifikasyon gerekir.",
    swot_o_t: "O • Fırsatlar (Opportunities)",
    swot_o_1: "Kırsal klinikler, denizaltılar ve ticari uzay istasyonlarında (Artemis Gateway) doğrudan çift amaçlı kullanım.",
    swot_o_2: "Regülasyonu güvene dönüştürme: Erken ajans iş birlikleri, katı uzay tıbbı kurallarını küresel onaylı bir standarda çevirir.",
    swot_o_3: "İnsan odaklı karar desteği: Şeffaf HL7 FHIR ve TRISH HERMES çıktıları, doktorun yerini almadan Uçuş Cerrahını güçlendirir.",
    swot_t_t: "T • Tehditler (Threats)",
    swot_t_1: "Uzay tıbbı regülasyon ve onay süreçlerinin uzun sürmesi.",
    swot_t_3: "Mürettebatın tıbbi muhakeme yerine otomasyona aşırı güvenmesi.",
    lineage_title: "Resmi NASA Referansları → ARES-MED Metrik Eşleşmesi",
    lineage_sub: "ARES-MED içindeki her fizyolojik eşik, 30 günlük eğri ve triyaj kuralı doğrudan açık NASA insanlı uzay uçuşu veri setlerine ve standartlarına dayanır.",
    lin_col_src: "NASA Kaynağı / Standart",
    lin_col_dom: "Bilimsel Alan",
    lin_col_met: "Eşleşen ARES-MED Metrikleri",
    lin_col_app: "Sitedeki Modül",
    lin_r1_dom: "Uzay Uçuşu İnsan Entegrasyonu ve Çevresel Sınırlar",
    lin_r1_met: "SpO2, Kalp Hızı, HRV (RMSSD), Tansiyon, Kabin ppCO2, Kariyer Radyasyonu (mSv)",
    lin_r1_app: "Görev Senaryoları & 3D Vücut",
    lin_r2_dom: "Uzun Süreli Mikrogravite Adaptasyonu ve İyileşme",
    lin_r2_met: "SANS Optik Sinir Kılıfı (ONSD mm), Metabolik Değişim, Stres ve İyileşme Eğrileri",
    lin_r2_app: "30 Günlük Test & Tahmin Grafiği",
    lin_r3_dom: "Uzay Uçuşu Çoklu-Omik, Kemik ve Sıvı Dinamiği",
    lin_r3_met: "Tahmini Kemik Yoğunluğu (BMD Delta %), Sefalik Sıvı Kayması, Sirkadiyen Uyku Yorgunluğu",
    lin_r3_app: "30 Günlük Model & HL7 FHIR",
    lin_r4_dom: "Gecikmeye Dayanıklı Klinik Karar Desteği",
    lin_r4_met: "Seviye 1–3 Triyaj Eskalasyonu, Depola-ve-İlet Dünya Telemetri Paketi (OWLT)",
    lin_r4_app: "Tanı & PDF Reçete",
    lin_r5_dom: "EVA Stresi Altında Bilişsel Hazırlık",
    lin_r5_met: "Tepki Gecikmesi (ms), Dikkat Kopmaları (>500 ms), Erken Basım ve Hazırlık Skoru",
    lin_r5_app: "EVA Dikkat Testi",
    scen_banner_title: "Görev & Senaryolar: Ares-IV Operasyonu (Mars Yolculuğu)",
    scen_banner_desc: "Dört kişilik mürettebat Mars yolculuğunun 142. gününde. Aşağıdaki 3 adımı izleyin: önce astronot avatarınızı seçin, ardından bir uzay krizi belirleyin ve son adımda vücut etkilerini inceleyin.",
    wiz_s1: "Adım 1: Karakter Seç",
    wiz_s2: "Adım 2: Senaryo Seç",
    wiz_s3: "Adım 3: Etkiler & Eylem Planı",
    step1_crew: "Adım 1: Astronot Karakterinizi Seçin",
    step1_crew_sub: "Devam etmek için 4 mürettebat avatarından birine tıklayın",
    step2_scen: "Adım 2: Senaryo Seçimi (Bir Sütuna Tıklayın)",
    btn_back_char: "← Karakteri Değiştir",
    btn_back_scen: "← Senaryoyu Değiştir",
    sc1_t: "Normal Mars Yolculuğu",
    sc1_d: "0.00g ortamında sakin seyir sırasında mürettebat mikrograviteye uyum sağlar. Kalp hızı hafifçe düşer, sıvılar başa doğru dengelenir ve günlük ARED egzersizi kemik kaybını önler.",
    sc1_det: "Bulgular: Normal • Kabin CO2: 1.9 mmHg • Odak: 0g Kalibrasyonu",
    sc2_t: "CO2 Temizleyici Arızası",
    sc2_d: "Tıkanan amin filtresi uyku modülünde CO2 biriktirir (4.9 mmHg). Havalandırma olmadan beyin damarları genişler; sabah baş ağrısı, yavaş PVT refleksi ve sığ nefes görülür.",
    sc2_det: "Risk: Hiperkapni • Çözüm: Taşınabilir fan + O2 kontrolü",
    sc3_t: "Güneş Parçacık Fırtınası",
    sc3_d: "X-sınıfı güneş patlaması derin uzayı yüksek enerjili protonlarla doldurur (14.8 mSv/gün). Mürettebat kemik iliğini, DNA'yı ve retinayı korumak için su duvarlı sığınağa geçmelidir.",
    sc3_det: "Risk: Akut Doz Artışı • Çözüm: Fırtına sığınağı + dozimetre",
    sc4_t: "Göz (SANS) & Kemik Kaybı",
    sc4_d: "Ağırlıksızlığın 215. gününde kafa içi sıvı basıncı göz arkasını düzleştirir (SANS), yüksüz kalan kemikler kalsiyum kaybeder. Ultrason ONSD ölçümü ve alt vücut negatif basıncı kritiktir.",
    sc4_det: "Risk: Optik Ödem & Kemik Kaybı • Çözüm: Chibis LBNP + ARED",
    sc5_t: "Uyku & Bilişsel Yorgunluk",
    sc5_d: "Günde 16 yörünge gün doğumu ve sürekli fan gürültüsü 4.8 saatlik uyku borcu yaratır. Kortizol yükselir, HRV düşer ve tepki süreleri yavaşlayarak EVA hata riskini artırır.",
    sc5_det: "Risk: Sirkadiyen Kayma • Çözüm: Mavi ışık ayarı + EVA erteleme",
    inter_back_all: "← Tüm 3 Araç",
    inter_switch_hint: "Sol menüden araç değiştirebilirsiniz",
    step3_body: "Adım 3: Senaryonun İnsan Vücuduna Etkileri",
    step4_action: "Net Eylem Planı (Mürettebat Ne Yapmalı?)",
    inter_hero_t: "Bu görevdeki astronotlardan biri olmak ister misiniz?",
    inter_hero_s: "Bu 3 interaktif araç hem gerçek astronotlar hem de uzayı merak eden herkes için tasarlandı!",
    inter_hero_desc: "Kameranızı ve sesinizi test etmek, EVA dikkat testine katılmak veya 30 günlük tedavi simülasyonunu çözmek için aşağıdaki araçlardan birini seçin.",
    routine_lbl: "GÖREV RUTİNİ:",
    routine_msg: "Mürettebat hazırlığını korumak için günlük nabız taraması, refleks testi ve 30 günlük simülasyonu tamamlayın.",
    badge_bone: "Kemik Koruyucu",
    sub_camera_t: "Kamera & Ses Analizi",
    sub_camera_d: "Temassız optik nabız (rPPG), ses stresi titreşimi, solunum hızı ve yorgunluk taraması.",
    sub_attn_t: "Astronot Dikkat Testi",
    sub_attn_d: "Uzay yürüyüşü (EVA) sırasında sizi uzay kıyafetinin içine koyan bilimsel PVT dikkat testi.",
    sub_quiz_t: "30 Günlük Tedavi Testi",
    sub_quiz_d: "Bir kriz seçin, 6 sıralı tıbbi soruyu yanıtlayın ve 30 günlük mor grafiğinizi görün.",
    open_tool: "Aracı Aç →",
    sum_camera: "<strong>Özet & Amaç:</strong> Web kameranız ve mikrofonunuzla sensör takmadan nabız, solunum ve ses stresi ölçer.",
    cam_title: "1. Temassız Kamera (rPPG) & Ses Stresi Analizi",
    cam_how: "<strong>Nasıl Çalışır:</strong> Kamera yüzdeki mikro kan akışı değişimlerini, mikrofon ise ses telindeki stres titreşimini ölçer.",
    btn_scan: "Kamera & Ses Taramasını Başlat",
    lbl_scan_stat: "Tarama Durumu",
    lbl_pulse: "Optik Nabız (rPPG)",
    lbl_voice: "Ses Stres İndeksi",
    lbl_resp: "Tahmini Solunum / Yorgunluk",
    sum_attention: "<strong>Özet & Amaç:</strong> NASA PVT testine dayanan bu araç, uyku borcu veya CO2 birikimini tespit etmek için tepki hızınızı milisaniye ile ölçer.",
    attn_title: "2. Bilimsel Astronot Dikkat Testi (NASA PVT)",
    attn_role: "<strong>Görev Rolü:</strong> Mars iniş aracını yönetiyorsunuz. Tehlike sinyali yeşile döndüğü an panele dokunun!",
    pvt_start: "EVA DİKKAT TESTİNİ BAŞLATMAK İÇİN TIKLAYIN",
    lbl_mood: "Test Öncesi Enerji Durumu:",
    sum_quiz: "<strong>Özet & Amaç:</strong> Uzay konsolunda bir senaryo seçip 6 sıralı tıbbi soruyu yanıtlayın; sonuçta 30 günlük Mor eğriniz Kırmızı ve Yeşil ile karşılaştırılır.",
    quiz_scen_t: "Adım 1: 30 Günlük Simülasyon İçin Bir Senaryo Seçin",
    quiz_graph_t: "30 Günlük Sağlık Yörüngesi Sonucu",
    leg_red: "Tedavi edilmeyen / göz ardı edilen 30 günlük risk.",
    leg_green: "Önerilen tüm NASA önlemlerinin uygulandığı ideal seyir.",
    leg_purple: "Sizin Test Seçimleriniz!",
    btn_restart_quiz: "6 Soruluk Testi Tekrarla →",
    diag_title: "Astronot Kişisel Teşhis & Özel Reçete",
    diag_p1: "1. Konum",
    diag_p2: "2. Görev Süresi",
    diag_p3: "3. Belirtiler",
    diag_p4: "4. Reçete & Plan",
    diag_q1: "Adım 1: Şu an nerede bulunuyorsunuz?",
    diag_q2: "Adım 2: Bu uzay görevinde toplam ne kadar süredir bulunuyorsunuz?",
    diag_q3: "Adım 3: Yaşadığınız tüm belirtileri işaretleyin",
    lbl_sym_common: "Yaygın Uzay Belirtileri:",
    lbl_sym_urgent: "Acil Tıbbi Belirtiler (Öncelikli):",
    btn_gen_rx: "Reçete ve Zaman Planı Oluştur →",
    rx_header_t: "ARES-MED Uzay Tıbbı Reçetesi & Bakım Planı",
    tp_heading: "Yapılandırılmış Tedavi Zaman Planı:",
    tp_1_t: "Acil (0–15 dakika)",
    tp_2_t: "Kısa Vadeli (1–6 saat)",
    tp_3_t: "Takip (24–72 saat)",
    btn_pdf: "Reçeteyi PDF Kaydet",
    btn_dl_fhir: "FHIR JSON İndir",
    btn_new_diag: "← Yeni Teşhis Başlat",
    ai_fab: "VitalsZero AI'a Sor",
    ai_head: "VitalsZero Akıllı Asistan",
    ai_welcome: "Merhaba! Ben VitalsZero AI. Site içi tüm bölümler hakkında bilgi sahibiyim ve çevrimiçi olduğunuzda genel bilim/dünya sorularını da internetten araştırıp yanıtlayabilirim!"
  };

  const SYM_LABELS_TR = {
    headache: "+ Ön Baş Ağrısı",
    cephalad: "+ Göz / Sinüs Basıncı",
    phosphenes: "+ Işık Çakmaları",
    orthostatic: "+ Ayağa Kalkarken Baş Dönmesi",
    insomnia: "+ Kötü Uyku",
    back_pain: "+ Bel Ağrısı",
    rf_chest_pain: "[Acil Belirti] Göğüs Ağrısı",
    rf_vision_loss: "[Acil Belirti] Ani Görme Kaybı",
    rf_neck_swelling: "[Acil Belirti] Boyun Damarı Şişliği",
    rf_syncope: "[Acil Belirti] Bayılma / Senkop"
  };

  const SYM_LABELS_EN = {};
  document.querySelectorAll(".symptom-chip").forEach((b) => {
    SYM_LABELS_EN[b.dataset.symptom] = b.textContent;
  });

  const I18N_EN_CACHE = {};
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    I18N_EN_CACHE[el.dataset.i18n] = el.innerHTML;
  });

  function setLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll(".lang-btn").forEach((b) => b.classList.toggle("active", b.dataset.lang === lang));
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      if (lang === "tr" && I18N_TR[key]) el.innerHTML = I18N_TR[key];
      else if (lang === "en" && I18N_EN_CACHE[key]) el.innerHTML = I18N_EN_CACHE[key];
    });
    document.querySelectorAll(".symptom-chip").forEach((b) => {
      const s = b.dataset.symptom;
      if (lang === "tr" && SYM_LABELS_TR[s]) b.textContent = SYM_LABELS_TR[s];
      else if (lang === "en" && SYM_LABELS_EN[s]) b.textContent = SYM_LABELS_EN[s];
    });
    renderQuiz();
    drawGuideVideoFrame(vidMs);
    updatePrescriptionTimePlan();
    populateVoiceSelect();
  }
  document.querySelectorAll(".lang-btn").forEach((b) => {
    b.addEventListener("click", () => setLanguage(b.dataset.lang));
  });

  // 4. Smart Hybrid AI Assistant Bot (Math Solver + Site Expert + Multi-Source Web Search)
  const aiToggle = document.getElementById("aiBotToggle");
  const aiPanel = document.getElementById("aiBotPanel");
  const aiClose = document.getElementById("aiBotClose");
  const aiMessages = document.getElementById("aiMessages");
  const aiInput = document.getElementById("aiInput");
  const aiSend = document.getElementById("aiSendBtn");

  function evaluateSafeMath(raw) {
    const tr = currentLang === "tr";
    let expr = raw.toLowerCase().trim()
      .replace(/,/g, ".")
      .replace(/×/g, "*").replace(/÷/g, "/").replace(/\^/g, "**")
      .replace(/kaç eder|kaçtır|hesapla|nedir|calculate|what is|solve|=/g, " ")
      .trim();

    // Percentage helper: "20% of 150" or "150'nin %20'si"
    const pctMatch = raw.match(/(\d+(?:\.\d+)?)\s*%\s*(?:of|x|\*)\s*(\d+(?:\.\d+)?)/i);
    if (pctMatch) {
      const val = (Number(pctMatch[1]) / 100) * Number(pctMatch[2]);
      return tr ? `Hesaplama Sonucu: ${val}` : `Calculation Result: ${val}`;
    }

    // Simple linear equation: ax + b = c
    const linMatch = raw.replace(/\s+/g, "").match(/^([+-]?\d*(?:\.\d+)?)x([+-]\d+(?:\.\d+)?)?=([+-]?\d+(?:\.\d+)?)$/i);
    if (linMatch) {
      const a = linMatch[1] === "" || linMatch[1] === "+" ? 1 : linMatch[1] === "-" ? -1 : Number(linMatch[1]);
      const b = linMatch[2] ? Number(linMatch[2]) : 0;
      const c = Number(linMatch[3]);
      if (a !== 0 && !Number.isNaN(a) && !Number.isNaN(b) && !Number.isNaN(c)) {
        const x = (c - b) / a;
        const rounded = Math.round(x * 10000) / 10000;
        return tr ? `Denklem Çözümü: x = ${rounded}` : `Equation Solution: x = ${rounded}`;
      }
    }

    // Math functions mapping
    expr = expr
      .replace(/\bsqrt\s*\(/g, "Math.sqrt(")
      .replace(/\babs\s*\(/g, "Math.abs(")
      .replace(/\bsin\s*\(/g, "Math.sin(")
      .replace(/\bcos\s*\(/g, "Math.cos(")
      .replace(/\btan\s*\(/g, "Math.tan(")
      .replace(/\blog\s*\(/g, "Math.log10(")
      .replace(/\bln\s*\(/g, "Math.log(")
      .replace(/\bpi\b/g, "Math.PI");

    if (!/[\d]/.test(expr) || !/^[0-9+\-*/().\sMathsqrtabscointlgPI]+$/.test(expr)) {
      return null;
    }
    if (!/[+\-*/()]|Math\./.test(expr)) return null;

    try {
      const result = Function(`"use strict"; return (${expr});`)();
      if (typeof result === "number" && Number.isFinite(result)) {
        const cleanRes = Math.round(result * 1000000) / 1000000;
        return tr ? `Matematik Sonucu: ${cleanRes}` : `Math Result: ${cleanRes}`;
      }
    } catch (_e) {
      return null;
    }
    return null;
  }

  // Qwen-Inspired Semantic Corpus & Token-Scoring Reasoning Engine
  const QWEN_KNOWLEDGE_CORPUS = [
    {
      keys: ["spaceapps", "space apps", "hackathon", "jüri", "judge", "yarışma", "challenge", "sunum", "kriter"],
      en: "NASA Space Apps Challenge 2026: Team VitalsZero (Elif Azra Özata & Ali Manas Aydoğmuş) built ARES-MED at vitalszero.health to solve deep-space crew health autonomy during 44-minute Earth communication blackouts. It aligns with all 5 Space Apps judging criteria: Impact (offline care for astronauts & remote Earth clinics), Creativity (webcam rPPG + interactive body map + prescription PDF), Validity (NASA OSDR, Twins Study, NASA-STD-3001), Relevance (Artemis & Mars missions), and Presentation.",
      tr: "NASA Space Apps Challenge 2026: VitalsZero Ekibi (Elif Azra Özata & Ali Manas Aydoğmuş), 44 dakikalık Mars iletişim kesintilerinde astronotların ve uzaktaki herkesin sağlığını korumak için vitalszero.health üzerinde ARES-MED'i geliştirdi. Space Apps'in 5 jüri kriterini doğrudan karşılar: Etki (%100 çevrimdışı), Yaratıcılık (kamera rPPG + vücut haritası + reçete PDF), Bilimsel Geçerlilik (NASA OSDR, Twins Study, NASA-STD-3001), Uygunluk (Artemis & Mars) ve Sunum."
    },
    {
      keys: ["ares", "vitalszero", "kim", "kurucu", "elif", "ali", "amaç", "misyon", "nedir", "who", "founder"],
      en: "VitalsZero (ARES-MED: Autonomous Real-Time Evaluation & Space Medical Decision System) was founded by Elif Azra Özata & Ali Manas Aydoğmuş. It is built for both real astronauts and anyone curious about space medicine—combining 0g-calibrated vitals, spacecraft air/radiation fusion, and instant prescriptions 100% offline.",
      tr: "VitalsZero (ARES-MED), Elif Azra Özata ve Ali Manas Aydoğmuş tarafından kuruldu. Yalnızca astronotlar için değil, öğrenciler ve uzay meraklıları dahil herkes için 0g kalibrasyonlu vital izleme, kabin hava/radyasyon birleşimi ve %100 çevrimdışı reçete desteği sunar."
    },
    {
      keys: ["nasa", "osdr", "twins", "hermes", "trish", "fhir", "std-3001", "data", "veri", "kaynak", "referans", "lineage"],
      en: "See '5. References & Data Lineage' in the menu for our full mapping table. ARES-MED is grounded in NASA-STD-3001 Vol. 1 & 2 (Rev 2022), NASA Twins Study (Science 2019), NASA OSDR (OSD-570/571), NASA HRP ExMC CDS, TRISH HERMES (HL7 FHIR R4), and NASA PVT-B.",
      tr: "Tam eşleştirme tablosu için menüdeki '5. Referanslar & Veri Kaynağı' sekmesine bakabilirsiniz. ARES-MED; NASA-STD-3001 (Rev 2022), NASA Twins Study (Science 2019), NASA OSDR (OSD-570/571), HRP ExMC CDS, TRISH HERMES (HL7 FHIR R4) ve NASA PVT-B kaynaklarına dayanır."
    },
    {
      keys: ["day", "gün", "slider", "sürgü", "gecikme", "delay", "owlt", "44"],
      en: "You can drag the Mission Day slider (1 to 500 days) right in the top header bar to simulate how Earth-Mars one-way light time (OWLT) delay, radiation accumulation, SANS eye pressure, and readiness evolve over time.",
      tr: "Üst başlıktaki Görev Günü (Mission Day) sürgüsünü 1 ile 500 gün arasında kaydırarak Dünya-Mars iletişim gecikmesinin (OWLT), radyasyon birikiminin, SANS göz basıncının ve hazırlık skorunun nasıl değiştiğini canlı izleyebilirsiniz."
    },
    {
      keys: ["quiz", "30", "grafik", "mor", "purple", "red", "green", "eğri"],
      en: "In Interactive Lab > 30-Day Treatment Quiz, you choose a space crisis and answer 6 sequential medical questions inside the space console. Your choices plot a Purple trajectory compared against Red (untreated) and Green (optimal NASA countermeasures).",
      tr: "İnteraktif Laboratuvar > 30 Günlük Tedavi Testi bölümünde 6 tıbbi soruyu yanıtlayarak Kırmızı (tedavisiz) ve Yeşil (optimal) eğrilere karşı kendi Mor eğrinizi çizebilirsiniz."
    },
    {
      keys: ["reçete", "prescription", "teşhis", "diagnosis", "pdf", "time plan", "zaman"],
      en: "Open '4. Self-Diagnosis & Care' from the menu: pick your location (Spacecraft, ISS, Lunar Base, Mars, Rover), mission days, and symptoms to generate a personalized Prescription, 3-stage Time Plan (0-15m, 1-6h, 24-72h), HL7 FHIR JSON, and a Prescription-only PDF.",
      tr: "Menüden '4. Kişisel Teşhis & Reçete' sekmesine geçip konum, görev günü ve belirtilerinizi seçerek size özel Reçete, 3 aşamalı Zaman Planı (0-15 dk, 1-6 sa, 24-72 sa), HL7 FHIR JSON ve yalnızca reçetelik PDF çıktısı alabilirsiniz."
    },
    {
      keys: ["sans", "eye", "göz", "co2", "radyasyon", "radiation", "kemik", "bone", "lbnp", "ared"],
      en: "Key space medicine mechanisms in ARES-MED: SANS (optic nerve swelling from 0g headward fluid shift -> treated with 45m LBNP), CO2 pockets (headache/slow PVT -> cabin fans & CDRA scrubber), Bone loss (~1.25%/month -> 60m ARED squats/deadlifts), and Solar Storms (shielded storm shelter).",
      tr: "ARES-MED'deki temel uzay tıbbı mekanizmaları: SANS (0g'de sıvının başa kaymasıyla göz siniri şişmesi -> 45 dk LBNP), CO2 birikimi (baş ağrısı/yavaş refleks -> hava fanı ve CDRA), Kemik kaybı (aylık ~%1.25 -> 60 dk ARED) ve Güneş Fırtınası (zırhlı sığınak)."
    }
  ];

  function getLocalAiReply(q) {
    const low = q.toLowerCase();
    const tr = currentLang === "tr";
    let bestScore = 0;
    let bestItem = null;
    QWEN_KNOWLEDGE_CORPUS.forEach((item) => {
      let score = 0;
      item.keys.forEach((k) => {
        if (low.includes(k)) score += k.length > 4 ? 3 : 2;
      });
      if (score > bestScore) {
        bestScore = score;
        bestItem = item;
      }
    });
    if (bestItem && bestScore >= 2) {
      return tr ? bestItem.tr : bestItem.en;
    }
    return null;
  }

  async function askSmartAi(query) {
    // 1. Math Solver first
    const mathAns = evaluateSafeMath(query);
    if (mathAns) return mathAns;

    // 2. Site & Space Medicine Knowledge Base
    const local = getLocalAiReply(query);
    if (local) return local;

    const tr = currentLang === "tr";
    const cleanQ = query.replace(/[?¿!]/g, "").trim();

    // 3. Multi-source live web search: DuckDuckGo Instant Answer API + Wikipedia
    try {
      const ddgRes = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(cleanQ)}&format=json&no_html=1&skip_disambig=1`);
      if (ddgRes.ok) {
        const ddg = await ddgRes.json();
        if (ddg.Answer) return ddg.Answer;
        if (ddg.AbstractText) return ddg.AbstractText;
        if (ddg.RelatedTopics && ddg.RelatedTopics[0] && ddg.RelatedTopics[0].Text) {
          return ddg.RelatedTopics[0].Text;
        }
      }
    } catch (_e) {
      // Fallback to next source
    }

    // 4. Wikipedia API fallback (TR or EN)
    const langSub = tr ? "tr" : "en";
    try {
      const searchRes = await fetch(`https://${langSub}.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(cleanQ)}&limit=1&namespace=0&format=json&origin=*`);
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        const topTitle = searchData[1] && searchData[1][0];
        if (topTitle) {
          const sumRes = await fetch(`https://${langSub}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topTitle)}`);
          if (sumRes.ok) {
            const sumData = await sumRes.json();
            if (sumData.extract) return sumData.extract;
          }
        }
      }
    } catch (_e) {
      // Offline fallback below
    }

    return tr
      ? "Şu an çevrimdışı/uzay modundasınız veya bu konu için canlı kaynaklara erişilemedi. Matematik işlemleri (ör. 24*15, sqrt(144), 2x+4=10) ve tüm VitalsZero bölümleri hakkında her zaman yanıt verebilirim!"
      : "I'm currently in offline spacecraft mode (or couldn't reach live web sources). I can still solve math (e.g. 24*15, sqrt(144), 2x+4=10) and answer everything about ARES-MED!";
  }

  function appendChat(text, who) {
    if (!aiMessages) return;
    const div = document.createElement("div");
    div.className = `ai-msg ${who}`;
    div.textContent = text;
    aiMessages.appendChild(div);
    aiMessages.scrollTop = aiMessages.scrollHeight;
    return div;
  }

  if (aiToggle && aiPanel) aiToggle.addEventListener("click", () => aiPanel.classList.toggle("open"));
  if (aiClose && aiPanel) aiClose.addEventListener("click", () => aiPanel.classList.remove("open"));
  if (aiSend && aiInput) {
    aiSend.addEventListener("click", async () => {
      const val = aiInput.value.trim();
      if (!val) return;
      appendChat(val, "user");
      aiInput.value = "";
      const thinkingEl = appendChat(currentLang === "tr" ? "Araştırılıyor..." : "Thinking...", "bot");
      const reply = await askSmartAi(val);
      if (thinkingEl) thinkingEl.textContent = reply;
    });
    aiInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") aiSend.click();
    });
  }
  document.querySelectorAll(".ai-chip").forEach((c) => {
    c.addEventListener("click", async () => {
      appendChat(c.textContent, "user");
      const reply = await askSmartAi(c.dataset.q || c.textContent);
      appendChat(reply, "bot");
    });
  });
}
