# ARES-MED v5.0 — Audit & Architecture Changelog (Team VitalsZero)

## Stage 0 & 1: Audit Fixes, Text Encoding & Scientific Framing
- **Fixed Netlify UTF-8 Character Encoding:** Added `_headers` file (`Content-Type: text/html; charset=utf-8`), `<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />`, and converted special symbols (`•`, `₂`, `°`, `♀`, `♂`, `🔊`) to pure HTML entities and `\uXXXX` Unicode escapes in JS so no symbol can ever render garbled on Netlify or any OS locale.
- **Persistent Clinical Decision-Support Disclaimer:** Added top-of-screen banner framing `ARES-MED` strictly as **Clinical Decision Support (Not a Medical Device or Diagnosis)**.
- **Honest Simulated Data Labeling:** Explicitly labeled all molecular biomarkers (`OSD-570`, `OSD-571`, `NASA Twins Study`) as **Simulated Research Proxies Inspired by Published Studies** with a full **Sources, Reference Ranges & Methods** table in Tab 4.

## Stage 2: Transparent Health Logic, NASA IMM Symptom Engine & 3-Tier Escalation
- **Modular Config (`config.json`):** Extracted reference ranges, environment presets, and literature sources (`NASA-STD-3001 Rev 2022`, `Garrett-Bakelman et al. 2019`, `Marshall-Goebel et al. 2019`, `Barger et al. 2014`, `Sibonga et al.`, `NASA IMM`).
- **Inspectable Formula Drawers ("How is this calculated?"):** Added expandable mathematical breakdowns showing exact weights and equations for System Strain Index and all 5 NASA HRP Domain scores.
- **7-Day Rolling Trend & EWMA Slope Insights:** Added plain-language rolling trend summaries above the vitals grid.
- **Rule + Prior-Weighted NASA IMM Symptom Triage Engine:** Replaced opaque percentages with an inspectable differential table showing **In-Flight Prior (NASA IMM)**, **Matched Rationale**, **Qualitative Likelihood Band (`Likely Match`, `Moderate Match`, `Possible`)**, and **Red-Flag Overrides** (*Acute Chest Pain*, *Unilateral Neck/Clavicle Swelling [Jugular Thrombosis]*, *Sudden Visual Loss*, *Syncope*).
- **3-Tier Escalation Ladder:** Added visual progression across `Level 1: Crew Self-Care`, `Level 2: Notify Crew Medical Officer (CMO)`, and `Level 3: Urgent Flight Surgeon Contact` (showing the exact Round-Trip light-time delay window).

## Stage 3, 4 & 5: UX, Accessibility, Gamification & Offline PWA
- **Environment Mode Switcher:** Added presets for `Spacecraft in Transit (0.00g)`, `Space Station LEO (0.00g)`, `Lunar Surface Base (0.16g)`, and `Mars Surface Habitat (0.38g)`.
- **NASA-STD-3001 (2022) 600 mSv Career Radiation Limit Tracker:** Added progress bar tracking cumulative dose against the 600 mSv career limit.
- **Guided Crew Measurement Logger:** Added step-by-step manual measurement entry (HR, Systolic BP, SpO2, Core Temp, Fasting Glucose, Sleep Hours) with input validation and instant Green/Yellow/Red explanation.
- **Color + Icon + Text Accessibility Redundancy:** Added `[OK]`, `[!] CAUTION`, and `[ALERT] CRITICAL` labels to every status tile, organ node, and crew card.
- **Tasteful Crew Gamification + Auto-Play Guided Demo:** Added daily check-in streak counter, countermeasure adherence badges, and an `Auto-Play Guided Demo` + `Reset` button.

