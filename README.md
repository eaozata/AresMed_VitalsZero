# ARES-MED: Autonomous Real-Time Evaluation & Space Medical Decision System
**Team Name:** VitalsZero  
**Challenge:** Create Health Monitoring Software for Astronauts on Space Missions (NASA Space Apps 2026)

---

## 1. Executive Summary
Deep-space exploration missions to the Moon (Artemis) and Mars introduce two fundamental medical challenges that existing Earth-based telemetry dashboards fail to solve:
1. **Communication Delays (Up to 22-Minute One-Way Light Time):** Astronauts cannot rely on real-time flight surgeons in Houston during acute physiological, environmental, or psychological anomalies.
2. **Microgravity Physiological Baseline Shifts:** Cephalad fluid redistribution, baroreceptor reflex attenuation, space anemia, and osteoclastic bone loss alter normal human baselines. Standard Earth clinical software triggers constant false-positive alarms while missing space-specific syndromes such as **Spaceflight-Associated Neuro-ocular Syndrome (SANS)** or **localized habitat $CO_2$ pocket toxicity**.

**ARES-MED** is an offline-first, autonomous crew health monitoring and clinical decision-support prototype. It dynamically recalibrates physiological baselines by Mission Elapsed Days (MED) and gravity regime ($0g$, $0.16g$ Lunar, $0.38g$ Mars), cross-correlates wearable biometrics with spacecraft Environmental Control and Life Support System (ECLSS) telemetry, evaluates psychological/cognitive vigilance via an embedded Psychomotor Vigilance Task (PVT), and outputs actionable countermeasure protocols plus Delay-Tolerant Networking (DTN) HL7 FHIR medical bundles.

---

## 2. Key Innovations & Features

### A. Dynamic Microgravity vs. Earth Baseline Recalibration
Using exponential adaptation curves derived from NASA Human Research Program (HRP) physiology literature:
$$\text{Baseline}_{0g}(t) = \text{Baseline}_{\text{Earth}} + \Delta_{\mu g}\left(1 - e^{-t / \tau}\right)$$
Judges can click the **Calibration Mode** toggle in real time to observe how naive Earth hospital thresholds trigger false hypoxia/tachycardia alarms on nominal astronauts, whereas ARES-MED's $0g$-adapted envelope accurately isolates true pathology.

### B. 5-Domain Space Stressor Matrix
1. **Cardiovascular & Cephalad Fluid Shift (SANS):** Tracks Heart Rate, Autonomic HRV (RMSSD), SpO2, BP, and an Optic Nerve Sheath Diameter (ONSD) proxy to flag SANS risk before irreversible visual changes occur.
2. **Musculoskeletal & Bone Mineral Density (BMD) Decay:** Models monthly femoral neck osteopenia ($-1.25\%/\text{month}$ unmitigated) against Advanced Resistive Exercise Device (ARED) loading compliance.
3. **Ionizing Radiation & Immune Suppression:** Tracks cumulative mission dose (mSv) and acute Solar Particle Event (SPE) flux, triggering radioprotective and point-of-care leukocyte differential protocols.
4. **Psychological, Circadian & Cognitive Readiness:** Combines sleep architecture efficiency, subjective confinement mood check-ins, and a **live interactive Psychomotor Vigilance Task (PVT)** reaction latency test.
5. **Habitat ECLSS Environmental Cross-Correlation:** Couples cabin $ppCO_2$ and radiation sensors directly to crew vitalsâ€”allowing ARES-MED to distinguish between primary cardiac/neurological illness and a degraded $CO_2$ scrubber (CDRA).

### C. Delay-Tolerant HL7 FHIR Store-and-Forward Telemetry
Generates standardized, compressed HL7 FHIR JSON bundles tagged with One-Way Light Time (OWLT) metadata for asynchronous downlink via the Deep Space Network (DSN).

---

## 3. How to Launch the Prototype
Zero installation or external server dependencies required:
1. Open [index.html](file:///c:/Users/ozata/Documents/tau_propagation/output/ares_med/index.html) directly in any modern browser (Chrome, Edge, Firefox, Safari).
2. Click through the **5 Mission Scenario Simulators** at the top of the console, drag the **Mission Elapsed Days** and **Cabin $ppCO_2$** sliders, test your own reaction speed in the **Live PVT Check-In**, and export an **HL7 FHIR Medical Packet**.

---

## 4. NASA Data & Scientific References
* **NASA Open Science Data Repository (OSDR) / GeneLab:** Physiological, hematological, and immune spaceflight adaptation benchmarks.
* **NASA Human Research Program (HRP) Integrated Research Plan:** Risk of Spaceflight-Associated Neuro-ocular Syndrome (SANS), Risk of Bone Fracture due to Spaceflight-induced Changes to Bone, and Risk of Adverse Cognitive or Behavioral Conditions.
* **NASA Astroskin / Bio-Monitor Wearable Architecture:** Continuous Lead-II ECG, PPG, SpO2, and activity telemetry standards.
* **NASA-STD-3001 (Space Flight Human-System Standard, Vol. 1 & 2):** Cabin partial pressure of $CO_2$ ($ppCO_2 < 3.0\text{ mmHg}$ nominal target) and ionizing radiation exposure limits.

---

## 5. Winning 2-Minute Pitch & Demo Script (For Video or Live Judging)

**[0:00 â€“ 0:25] The Hook (The Mars Blackout Problem)**
> *"Imagine you are 142 days into a transit to Mars. A crew member develops a pounding headache, elevated heart rate of 78 bpm, dropped heart-rate variability, and a 100-millisecond lag in reaction time. Communication with Houston has a 14-minute one-way light delayâ€”nearly 30 minutes round-trip. Worse yet, standard Earth medical software is flashing false hypoxia alarms because microgravity shifts fluids toward the head and alters resting baselines. Thatâ€™s why we built **ARES-MED**."*

**[0:25 â€“ 0:55] Live Demo: Space-Adapted Baselines & ECLSS Coupling**
> *(Show `index.html` on screen. Click the Calibration Mode toggle, then click Scenario 2: ECLSS CO2 Scrubber Fault.)*  
> *"First, ARES-MED replaces static Earth hospital thresholds with a dynamic microgravity adaptation curve calibrated by Mission Elapsed Days. Second, watch what happens when we trigger Scenario 2. Instead of misdiagnosing our astronaut with a primary cardiac or neurological emergency, ARES-MED cross-correlates the crew memberâ€™s rising heart rate and cognitive lag with habitat ECLSS sensorsâ€”instantly pinpointing a 4.9 mmHg $CO_2$ pocket from a degraded scrubber and prescribing immediate ventilation and CDRA bed switching."*

**[0:55 â€“ 1:30] Live Demo: 5-Domain Stressors & Interactive Cognitive PVT**
> *(Click Scenario 3: Solar Storm and Scenario 4: SANS, then click the Green PVT Reaction Test button live.)*  
> *"Across the center console, ARES-MED tracks all five NASA Human Research Program priorities: SANS ocular fluid shifts, femoral bone loss versus ARED resistive exercise load, ionizing radiation immune suppression, habitat air quality, and behavioral health. Astronauts complete a 10-second Psychomotor Vigilance reaction test and behavioral check-in right in the console to catch circadian drift before high-risk EVAs."*

**[1:30 â€“ 2:00] Autonomous Triage & HL7 FHIR Export**
> *(Point to Right Column & click Export HL7 FHIR Packet.)*  
> *"Every alert generates an immediate, step-by-step autonomous countermeasure checklistâ€”from Lower Body Negative Pressure sessions to circadian lighting shiftsâ€”while packaging an encrypted, Delay-Tolerant HL7 FHIR medical bundle ready for Deep Space Network downlink. With ARES-MED, astronauts donâ€™t wait 40 minutes for Earth to tell them whatâ€™s wrongâ€”they have an autonomous flight surgeon on board."*


