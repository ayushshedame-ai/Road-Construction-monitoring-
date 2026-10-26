# RoadSight - Smart Road Construction Progress Monitoring System

> **AI/ML-Powered Physical Progress Monitoring, Verification & Anomaly Detection for Urban Local Bodies (ULBs) and Highway Authorities.**

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-blue.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38bdf8.svg)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/GIS-Leaflet%20Maps-10b981.svg)](https://leafletjs.com/)
[![PyTorch](https://img.shields.io/badge/ML%20Engine-PyTorch%20%7C%20EfficientNet-ee4c2c.svg)](https://pytorch.org/)

---

## 📌 Problem Statement

Monitoring the physical progress of ongoing road construction typically requires frequent on-site inspections by technical experts. In rapidly growing Indian cities with hundreds of simultaneous stretches, daily or weekly technical visits are logistically and financially unfeasible. 

**RoadSight** provides an end-to-end computer vision and geospatial software solution allowing ULBs, state road agencies, and central authorities (e.g., MoRTH, NHAI) to monitor physical progress daily using geotagged site photographs.

---

## 🌟 Key Features

1. **Multi-Stage Physical Progress Classification (IRC / MoRTH Standards):**
   - Stage 0: Earthwork & Embankment
   - Stage 1: Granular Sub-Base (GSB)
   - Stage 2: Wet Mix Macadam (WMM / WBM)
   - Stage 3: Dense Bituminous Macadam (DBM Binder Layer)
   - Stage 4: Bituminous Concrete (BC Wearing Course)
   - Stage 5: Road Markings, Kerbing & Signage

2. **Geospatial Route Snapping & Precision GIS:**
   - Real-world curved road layouts using high-density OSRM GPS waypoints (150–356 coordinates per stretch).
   - Google Maps-style dual-layer ribbon rendering (completed chainage vs active construction front).
   - Sub-5m RTK GPS differential geofencing validation.

3. **Automated Fraud & Quality Control:**
   - **Blur Rejection:** Laplacian variance checks reject unusable or unfocused field captures.
   - **pHash Deduplication:** Perceptual hash verification detects duplicate or recycled images across inspection dates.
   - **Geofence Enforcement:** Haversine distance verifies whether the inspector is physically within $\pm 25\text{m}$ of the designated road alignment.

4. **Bitemporal Split-Screen Progress Comparison:**
   - Interactive before-and-after image slider allowing inspectors and officers to track incremental chainage completion.

5. **Integrated ML Training Pipeline:**
   - PyTorch-based training pipeline (`backend/train_model.py`) with Ordinal-Penalized Loss for sequential civil engineering stages.
   - Site-grouped cross-validation to prevent background-memorization data leakage.

---

## 🚀 Quick Start

### 1. Web Application (Frontend)

```bash
# Clone the repository
git clone https://github.com/ayushshedame-ai/Road-Construction-monitoring-.git
cd Road-Construction-monitoring-

# Switch to the prototype branch
git checkout roadsight-prototype

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

### 2. Standalone Offline Preview

Open `preview.html` directly in any web browser without needing Node.js or a backend server.

### 3. ML Model Training Pipeline

```bash
# Set up Python environment
cd backend
pip install torch torchvision timm pillow numpy albumentations

# Train EfficientNet-B0 on civil road stages
python train_model.py
```

---

## 📂 Project Structure

```
├── backend/
│   └── train_model.py          # PyTorch training pipeline with Ordinal-Penalized Loss
├── dataset/                    # Sample road stage images organized by IRC classification
├── models/                     # Saved model checkpoints (.pth)
├── src/
│   ├── components/             # React UI components (ProjectMap, ImageUploadModal, etc.)
│   ├── data/
│   │   ├── mockData.js         # Road projects, inspections, and metadata
│   │   └── realRoadGeometries.json # Snapped highway curves and GIS waypoints
│   ├── App.jsx                 # Main application dashboard
│   └── index.css               # Tailwind & custom styling
├── preview.html                # Standalone zero-dependency preview
├── MODEL_TRAINING_GUIDE.md     # Detailed dataset curation & training manual
└── RoadSight_Project_Report.md # Full design thinking & technical project report
```

---

## 📜 License

Licensed under the MIT License. See [LICENSE](LICENSE) for details.
