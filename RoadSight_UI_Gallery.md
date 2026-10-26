# RoadSight: Visual UI & Prototype Walkthrough

Here is the screen-by-screen progression of the **RoadSight Smart Infrastructure** monitoring system matching the reference designs.

````carousel
![Field Mobile Login](C:/Users/Ayush/.gemini/antigravity/brain/f0b57281-45bc-439c-a229-5c7b493f82f2/Screenshot 2026-10-21 113332.png)
<!-- slide -->
![Field Mobile Projects Home](C:/Users/Ayush/.gemini/antigravity/brain/f0b57281-45bc-439c-a229-5c7b493f82f2/Screenshot 2026-10-21 113342.png)
<!-- slide -->
![AI Analysis Result & Before/After Slider](C:/Users/Ayush/.gemini/antigravity/brain/f0b57281-45bc-439c-a229-5c7b493f82f2/Screenshot 2026-10-21 113419.png)
<!-- slide -->
![Daily Progress Report Submitted](C:/Users/Ayush/.gemini/antigravity/brain/f0b57281-45bc-439c-a229-5c7b493f82f2/Screenshot 2026-10-21 113427.png)
<!-- slide -->
![Officer Portal Sign-In](C:/Users/Ayush/.gemini/antigravity/brain/f0b57281-45bc-439c-a229-5c7b493f82f2/Screenshot 2026-10-21 113438.png)
<!-- slide -->
![Infrastructure Overview Dashboard](C:/Users/Ayush/.gemini/antigravity/brain/f0b57281-45bc-439c-a229-5c7b493f82f2/Screenshot 2026-10-21 113447.png)
<!-- slide -->
![Road Stretch Chainage & Milestone Schedule](C:/Users/Ayush/.gemini/antigravity/brain/f0b57281-45bc-439c-a229-5c7b493f82f2/Screenshot 2026-10-21 113457.png)
<!-- slide -->
![Alerts & Anomalies Resolution Center](C:/Users/Ayush/.gemini/antigravity/brain/f0b57281-45bc-439c-a229-5c7b493f82f2/Screenshot 2026-10-21 113503.png)
<!-- slide -->
![Verified Progress Reports Audit Ledger](C:/Users/Ayush/.gemini/antigravity/brain/f0b57281-45bc-439c-a229-5c7b493f82f2/Screenshot 2026-10-21 113512.png)
````

---

### Core Interactions Implemented in the Prototype:
1. **Field Mobile AI Inference:** 
   - Upload any site photo or choose from 6 instant presets.
   - Evaluates Laplacian blur score, luminance, and GPS distance.
   - Outputs the verified civil construction stage (`WBM / WMM`, `DBM / Asphalt`, `GSB`, `Duct Laying`, `Kerbstone`).
   - Drag the interactive **Before/After slider** to visually review work completed between previous and current captures.
2. **Executive Command GIS Dashboard:**
   - Real-time project status overview across Pune highways.
   - Interactive GIS road map with status pins.
   - Stretch completion diagram: $1.4\text{ km}$ completed (green) vs $2.1\text{ km}$ remaining (gray).
   - Anomaly detection queue for duplicate photos and out-of-boundary uploads.
   - Official progress reports with one-click export to CSV/Excel and printable PDF.
