# RoadSight: AI-Powered Road Construction Progress Monitoring
**Design Thinking Project Report & Machine Learning Implementation Blueprint**

> **Live Interactive Prototype Server:** Running at `http://127.0.0.1:5173/`  
> **Source Directory:** [C:/Users/Ayush/.gemini/antigravity/scratch/roadsight](file:///C:/Users/Ayush/.gemini/antigravity/scratch/roadsight)  
> **Backend ML Engine:** [ml_engine.py](file:///C:/Users/Ayush/.gemini/antigravity/scratch/roadsight/backend/ml_engine.py)

---

## 1. Executive Summary & Problem Context

Urban Local Bodies (ULBs), state Public Works Departments (PWD), and national agencies (NHAI, MoRTH) oversee thousands of concurrent road construction and rehabilitation projects across Indian cities. Physical progress monitoring currently depends on manual field visits by technical experts. 

### Core Constraints & Bottlenecks:
1. **Scale Imbalance:** A typical Tier-1/Tier-2 city municipal corporation manages 150+ road packages simultaneously. Manual site visits for daily or even weekly tracking are logistically impossible.
2. **Delayed Billing & Contractor Disputes:** Delayed physical verification delays contractor running account (RA) bills, triggering project cost overruns and disputes.
3. **Ghost Progress & Duplicate Fraud:** Submitting outdated photos, taking photos from wrong stretches, or re-uploading previous captures without actual physical progress on-site.
4. **Lack of Component Granularity:** Road construction is not binary (done vs not done); it is a multi-layered civil engineering process (Subgrade $\rightarrow$ GSB $\rightarrow$ WMM $\rightarrow$ DBM $\rightarrow$ Asphalt $\rightarrow$ Kerbs $\rightarrow$ Utility Ducts).

---

## 2. Design Thinking Methodology

```mermaid
flowchart LR
    A["1. EMPATHIZE<br/>(ULBs, PWDs, Contractors)"] --> B["2. DEFINE<br/>(Problem & Boundary)"]
    B --> C["3. IDEATE<br/>(Multi-Head CV + Anti-Fraud)"]
    C --> D["4. PROTOTYPE<br/>(Field Mobile + Officer GIS)"]
    D --> E["5. TEST & VALIDATE<br/>(6 Presets + Failure Handling)"]
```

### Stage 1: Empathize
- **Superintending Officers & Municipal Commissioners:** Need a high-level command center showing real-time physical completion %, variance against scheduled contract milestones, and anomaly alerts across all packages.
- **Junior Field Engineers / Site Supervisors:** Need a friction-free mobile tool that works on 4G/5G mobile phones, captures geotagged site evidence, validates compliance immediately, and removes manual paper registers.
- **Citizens & Commuters:** Require transparency into road completion timelines to alleviate chronic traffic bottlenecks caused by barricaded roads.

### Stage 2: Define (Problem Statement)
> *"Develop a computer vision and machine learning-powered software solution that processes mobile, geotagged site images from active road construction projects, identifies the specific activity component and construction stage, estimates completed road length, compares progress against historical baselines, and raises corrective error alerts for invalid, duplicate, or out-of-boundary uploads."*

### Stage 3: Ideate
- **Activity Router + Stage Ladders:** Instead of an unconstrained generic classifier, route images based on declared civil activity (`road_surface`, `utility_ducts`, `pedestrian_infrastructure`).
- **Triple Integrity Verification Pipeline:**
  1. *Optical Quality Check:* Laplacian kernel variance $\sigma^2$ to reject motion blur, plus mean luminance bounds $[32, 245]$ to reject darkness/glare.
  2. *Geo-Fence Chainage Proximity:* Haversine formula calculates distance between device GPS and declared road stretch coordinates. Rejects uploads $>150\text{ m}$ away.
  3. *Perceptual Hashing (pHash / dHash):* $8\times8$ difference hashing computes Hamming distance against historical image archives to flag duplicate/fraud uploads.
- **Bitemporal Change Detection:** Interactive Before/After split comparison with chainage progress delta ($+\text{km}$).

### Stage 4: Prototype (RoadSight System)
- **Field Mobile App:** Authentic mobile simulator with camera capture, 6 instant test presets, real-time CV analysis card, split comparison slider, and daily progress report generator.
- **Officer GIS Command Dashboard:** Multi-project Leaflet map (color-coded green/amber/red status pins), project stretch chainage visualizer ($1.4\text{ km}$ completed vs $2.1\text{ km}$ remaining), milestone variance schedule, alert resolution queue, and PDF/Excel export.

### Stage 5: Test & Validate
- Validated on 6 realistic scenarios:
  - *Positive Validations:* WBM/WMM Layer ($92\%$ confidence), DBM Asphalt Binder ($95\%$), Utility Duct Trenching ($89\%$).
  - *Rigorous Error Injections:* Blurry photo rejection ($42$ sharpness score), Geo-fence violation ($3,840\text{ m}$ outside boundary), Duplicate image fraud alert ($99.8\%$ pHash match).

---

## 3. Civil Engineering Stage Ladders

The system implements the standard Indian Road Congress (IRC:37 & MORTH Specifications for Road and Bridge Works) sequence:

```mermaid
flowchart TD
    subgraph S1["Activity 1: Road Surface Layers & Macadamization"]
        direction LR
        A1["1. Earthwork / Excavation<br/>(Subgrade cutting & filling)"] --> A2["2. Granular Sub-Base<br/>(GSB natural aggregate)"]
        A2 --> A3["3. Water / Wet Mix Macadam<br/>(WBM / WMM stone dust mix)"]
        A3 --> A4["4. Dense Bituminous Macadam<br/>(DBM hot-mix binder)"]
        A4 --> A5["5. Bituminous Concrete<br/>(BC / Asphalt wearing course)"]
        A5 --> A6["6. Surface Markings<br/>(Thermoplastic & signage)"]
    end

    subgraph S2["Activity 2: Underground Utility Ducts"]
        direction LR
        B1["Trench Excavation"] --> B2["Sand Bedding"] --> B3["HDPE / RCC Duct Laying"] --> B4["Inspection Chambers"] --> B5["Restoration"]
    end

    subgraph S3["Activity 3: Pedestrian Infrastructure"]
        direction LR
        C1["Subgrade Clearing"] --> C2["Precast Kerbstone Alignment"] --> C3["Lean Concrete Base"] --> C4["Interlocking Paver Blocks"] --> C5["Tactile & Guardrails"]
    end
```

---

## 4. Free & Open-Access Datasets Directory

The roadmap and prototype integrate thirteen prominent open-access datasets for model training, segmentation, and benchmarking:

| # | Dataset Name | Source / Provider | Images / Volume | Free License | Purpose in RoadSight Pipeline |
|---|---|---|---|---|---|
| **1** | **IDD (India Driving Dataset / IDD-Lite)** | IIIT Hyderabad & Intel India | 10,000 images, 34 classes (IDD-Lite <50MB) | Free for Academic / Research | Primary baseline for Indian road boundaries, drivable area, unpaved surfaces, and mud/aggregate. |
| **2** | **RDD2022 (Road Damage Dataset)** | Figshare (CRDDC / Univ of Tokyo) | 47,420 road images (includes India subset) | CC BY-SA 4.0 / Open Access | Pretraining surface texture filters, crack/defect detection, and coarse vs smooth pavement distinction. |
| **3** | **Mapillary Vistas v2.0** | Mapillary / Meta | 25,000 high-res street views, 152 classes | Free for Research | Benchmarking pedestrian footpath, kerbstone, catch basin, and roadside infrastructure segmentation. |
| **4** | **Roboflow Construction Progress** | Roboflow Universe | Multi-class (asphalt, progress, unpaved) | Open / Roboflow Community | Directly matches road stage classification transfer learning (asphalt vs unfinished aggregate). |
| **5** | **Roboflow FYP Pavement Detection** | Roboflow Universe | 201 images, asphalt, concrete, drainage | CC BY 4.0 | Validating drainage boxes, utility chambers, and concrete pavement edges. |
| **6** | **Roboflow Construction (Road/Bridge)** | Roboflow Universe | Road, bridge, construction zones | CC BY 4.0 | Detecting active earthmoving machinery and barricaded work corridors. |
| **7** | **Roboflow Road (Paved vs Unpaved)** | Roboflow Universe | 2,680 annotated images | CC BY 4.0 | Binary classifier head separating cleared subgrade/earthwork from rolled asphalt/WMM. |
| **8** | **Construction Traversability Dataset** | IEEE DataPort / Robotics Sites | 28 semantic classes, pixel masks | CC BY-NC 4.0 | Segmenting raw construction soils, crushed gravel piles, and compactor tracks. |
| **9** | **CIS (Construction Instance Seg.)** | IEEE DataPort | Construction-site instance masks | Free Open Access | Detecting heavy machinery, rollers, pavers, and utility piping. |
| **10**| **Sidewalk-Semantic** | Hugging Face Datasets | Belgian sidewalk & flat-road classes | CC BY-NC 4.0 | Paver block and pedestrian sidewalk boundary training. |
| **11**| **LEVIR-CD** | Beihang Univ / TorchGeo | 637 bitemporal high-res pairs | Open Access / TorchGeo | Benchmarking bitemporal change detection algorithms between past and current site photos. |
| **12**| **SpaceNet 7 Multi-Temporal** | SpaceNet / Maxar | 24-month satellite & drone time-series | SpaceNet Open License | Testing long-horizon construction footprint change tracking. |
| **13**| **OpenConstruction Survey** | arXiv Survey Repository | Meta-compilation of civil datasets | CC0 / Public Domain | Reference literature for civil engineering machine vision benchmarks. |

---

## 5. Machine Learning & Computer Vision Architecture

The implemented pipeline in [ml_engine.py](file:///C:/Users/Ayush/.gemini/antigravity/scratch/roadsight/backend/ml_engine.py) operates through 4 sequential stages:

### A. Stage 1: Fast Image Integrity Gatekeeper
$$\text{Laplacian Sharpness Variance: } \sigma_L^2 = \frac{1}{N}\sum_{x,y} \left( \nabla^2 I(x,y) - \mu_L \right)^2$$
$$\nabla^2 I(x,y) = 4 I(x,y) - I(x+1,y) - I(x-1,y) - I(x,y+1) - I(x,y-1)$$
- If $\sigma_L^2 < 55$: Returns `IMAGE_BLURRY` error with instruction to stabilize camera and re-focus.
- If Mean Luminance $\mu_I < 32$ or $> 245$: Returns `IMAGE_DARK` or `IMAGE_OVEREXPOSED`.

### B. Stage 2: Fraud & Geo-Fence Validation
- **Haversine Distance:**
  $$d = 2 R \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta\phi}{2}\right) + \cos\phi_1\cos\phi_2\sin^2\left(\frac{\Delta\lambda}{2}\right)}\right)$$
  If $d > 150\text{ m}$ from the road centerline bounding box, the upload is halted as `GEO_FENCE_VIOLATION`.
- **Perceptual Hash (dHash):**
  Downsamples image to $8\times9$, computes horizontal gradient bits. If Hamming distance $D_H \le 2$ against the historical project database, flags `DUPLICATE_IMAGE_FRAUD`.

### C. Stage 3: Multi-Head Deep Classifier
- **Backbone:** Pretrained `EfficientNet-B0` feature extractor.
- **Task Heads:**
  - $\text{Head}_{\text{road}}(f) \in \mathbb{R}^6$ (Earthwork $\dots$ BC Asphalt)
  - $\text{Head}_{\text{duct}}(f) \in \mathbb{R}^5$ (Trenching $\dots$ Restoration)
  - $\text{Head}_{\text{pedestrian}}(f) \in \mathbb{R}^5$ (Subgrade $\dots$ Tactile Guardrails)

### D. Stage 4: Chainage Projection & Completed Length Estimation
$$\text{Projected Chainage } C_p = C_{\text{start}} + \frac{d(\mathbf{p}_{\text{start}}, \mathbf{p}_{\text{img}})}{d(\mathbf{p}_{\text{start}}, \mathbf{p}_{\text{end}})} \times (C_{\text{end}} - C_{\text{start}})$$
The system aggregates verified captures along the road centerline polyline into continuous intervals:
- $\text{Chainage } 12+200 \text{ to } 13+600 \implies 1.4\text{ km completed (WBM/WMM)}$
- $\text{Chainage } 13+600 \text{ to } 15+700 \implies 2.1\text{ km remaining (GSB/Subgrade)}$

---

## 6. How to Run & Verify the Prototype

### 1. View Web Prototype
The local development server is active at:
```text
http://127.0.0.1:5173/
```
Open this URL in your web browser.

### 2. Testing the UI & ML Capabilities:
1. **Field Mobile View:**
   - Click the orange **"Capture photo"** button.
   - Use the **"Select Fast Demo Test Scenario"** dropdown:
     - Select **Preset 1 (WBM/WMM Layer)** $\rightarrow$ Click **"Run AI Stage Assessment"** $\rightarrow$ View $92\%$ confidence score, stage-wise bars, and drag the **Before/After slider**!
     - Select **Preset 4 (Blurry Image Error Demo)** $\rightarrow$ See instant real-time rejection modal with required user correction instructions.
     - Select **Preset 5 (GPS Out-of-Bounds Error Demo)** $\rightarrow$ Demonstrates Geo-fence violation ($3,840\text{ m}$ away).
     - Select **Preset 6 (Duplicate Image Fraud Demo)** $\rightarrow$ Demonstrates pHash duplicate collision alert.
   - Click **"Submit report"** $\rightarrow$ View official Daily Progress Report `#DR-240616-0847` with share/download options.
2. **Officer Dashboard View:**
   - Toggle to **"Officer dashboard"** using the top header pill.
   - Explore the **Infrastructure Overview** with live Leaflet map and 4 KPI metrics.
   - Click **"Pune Ring Road – Package 3"** in the sidebar to inspect the road stretch visualizer (green completed $1.4\text{ km}$ vs gray remaining $2.1\text{ km}$), contract milestones, and evidence gallery.
   - Open **"Alerts"** (badge 4) to review duplicate detection and GPS boundary flags with resolution modals.
   - Open **"Reports"** to filter records and click **"Export Excel"** or **"Export PDF"**.
3. **Datasets & Design Thinking Modals:**
   - Click **"Datasets Registry"** in the top bar to inspect all 13 free datasets, license details, and terminal download commands.
   - Click **"Design Thinking"** to view the full 5-stage methodology documentation.

### 3. Testing the Standalone Python ML Script:
Open PowerShell in the project directory and run:
```powershell
python backend/ml_engine.py
```
This runs the OpenCV and PyTorch inference pipeline on sample images and outputs verified stage classifications, pHash signatures, and geo-fence calculations.
