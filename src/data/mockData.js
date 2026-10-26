// RoadSight Mock Data and Master Specifications
import realRoadGeometries from './realRoadGeometries.json';

export const ACTIVITIES = [
  {
    id: 'road_surface',
    name: 'Road Construction & Macadamization',
    description: 'Pavement layers from subgrade excavation to bituminous concrete wearing course.',
    stages: [
      { id: 'earthwork', name: 'Earthwork / Excavation', code: 'EW', order: 1, standardDays: 20 },
      { id: 'gsb', name: 'Granular Sub-Base (GSB)', code: 'GSB', order: 2, standardDays: 25 },
      { id: 'wmm', name: 'Water Bound / Wet Mix Macadam', code: 'WBM / WMM', order: 3, standardDays: 30 },
      { id: 'dbm', name: 'Dense Bituminous Macadam', code: 'DBM', order: 4, standardDays: 20 },
      { id: 'bc', name: 'Bituminous Concrete (Asphalt)', code: 'BC / Asphalt', order: 5, standardDays: 15 },
      { id: 'markings', name: 'Surface Markings & Signage', code: 'Markings', order: 6, standardDays: 10 },
    ]
  },
  {
    id: 'utility_ducts',
    name: 'Installation of Utility Ducts',
    description: 'Underground trenches, HDPE/RCC optical fiber and power conduits.',
    stages: [
      { id: 'trench_excavation', name: 'Trench Excavation', code: 'Trench', order: 1, standardDays: 15 },
      { id: 'bedding', name: 'Sand Bedding Preparation', code: 'Bedding', order: 2, standardDays: 10 },
      { id: 'duct_laying', name: 'Duct Conduit Laying', code: 'Duct Laying', order: 3, standardDays: 20 },
      { id: 'chambers', name: 'Manhole / Chamber Construction', code: 'Chambers', order: 4, standardDays: 15 },
      { id: 'backfilling', name: 'Backfilling & Pavement Reinstatement', code: 'Restoration', order: 5, standardDays: 12 },
    ]
  },
  {
    id: 'pedestrian',
    name: 'Installment of Pedestrian Infrastructure',
    description: 'Footpaths, precast kerbstones, interlocking paver blocks, tactile tiles.',
    stages: [
      { id: 'footpath_clearing', name: 'Footpath Clearing & Subgrade', code: 'Subgrade', order: 1, standardDays: 12 },
      { id: 'kerbstone', name: 'Precast Kerbstone Alignment', code: 'Kerbing', order: 2, standardDays: 18 },
      { id: 'lean_concrete', name: 'Lean Concrete Sub-base', code: 'PCC Base', order: 3, standardDays: 15 },
      { id: 'paver_blocks', name: 'Paver Block Interlocking', code: 'Pavers', order: 4, standardDays: 20 },
      { id: 'railing_tactile', name: 'Tactile Pavers & Pedestrian Guardrails', code: 'Finishing', order: 5, standardDays: 10 },
    ]
  }
];

export const PROJECTS = [
  {
    id: 'pune-ring-road-p3',
    code: 'PRR-P3-024',
    name: 'Pune Ring Road – Package 3',
    location: 'Mulshi – Hinjawadi Corridor, Pune',
    totalLengthKm: 3.5,
    completedLengthKm: 1.4,
    chainage: '12+200 to 15+700',
    currentStage: 'WBM / WMM',
    stageCode: 'wmm',
    progressPercent: 68,
    status: 'ON TRACK', // ON TRACK, DELAYED, ANOMALY
    contractor: 'Skyline Infra Pvt. Ltd.',
    contractDeadline: '28 Sep 2025',
    daysRemaining: 104,
    variance: '2 days ahead',
    lastCaptureTime: 'Today, 08:42 IST',
    gpsVerified: true,
    gpsAccuracyMeters: 4.2,
    coordinates: { lat: 18.5362, lng: 73.7400 },
    bounds: {
      startLat: 18.5245, startLng: 73.7150, // Pirangut junction
      endLat: 18.5480, endLng: 73.7650     // Hinjawadi Phase 3 Ring Road junction
    },
    waypoints: realRoadGeometries['pune-ring-road-p3'],
    activityType: 'road_surface',
    stageWiseCompletion: {
      'Earthwork': 100,
      'GSB': 100,
      'WBM / WMM': 61,
      'DBM': 0,
      'BC / Asphalt': 0
    },
    milestones: [
      { name: 'Earthwork', date: '12 Mar 2025', status: 'completed' },
      { name: 'GSB', date: '28 Apr 2025', status: 'completed' },
      { name: 'WMM', date: 'In progress', status: 'active' },
      { name: 'DBM', date: '12 Aug 2025', status: 'pending' },
      { name: 'Asphalt', date: '28 Sep 2025', status: 'pending' }
    ],
    evidence: [
      { id: 'ev-1', title: 'Today · 08:42', stage: 'WBM / WMM', url: '/assets/Screenshot 2026-10-21 113427.png', thumbnail: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=600&q=80', status: 'VERIFIED' },
      { id: 'ev-2', title: '14 Jun · 17:20', stage: 'GSB Top Layer', url: '/assets/Screenshot 2026-10-21 113419.png', thumbnail: 'https://images.unsplash.com/photo-1508873696983-2df5703bc225?auto=format&fit=crop&w=600&q=80', status: 'VERIFIED' },
      { id: 'ev-3', title: '12 Jun · 08:18', stage: 'GSB Compaction', url: '/assets/Screenshot 2026-10-21 113457.png', thumbnail: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=600&q=80', status: 'VERIFIED' }
    ],
    previousCapture: {
      date: '14 Jun 2025',
      stage: 'GSB Layer Compaction',
      imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5703bc225?auto=format&fit=crop&w=800&q=80'
    }
  },
  {
    id: 'nh48-tathawade',
    code: 'NH48-TT-012',
    name: 'NH-48 Tathawade Stretch',
    location: 'Tathawade – Wakad Bypass, Pune',
    totalLengthKm: 5.2,
    completedLengthKm: 4.37,
    chainage: '84+000 to 89+200',
    currentStage: 'DBM',
    stageCode: 'dbm',
    progressPercent: 84,
    status: 'ON TRACK',
    contractor: 'L&T Transportation Infrastructure',
    contractDeadline: '15 Nov 2025',
    daysRemaining: 152,
    variance: 'On schedule',
    lastCaptureTime: 'Yesterday, 17:20 IST',
    gpsVerified: true,
    gpsAccuracyMeters: 3.8,
    coordinates: { lat: 18.6186, lng: 73.7548 },
    bounds: {
      startLat: 18.6350, startLng: 73.7420, // Ravet Chowk
      endLat: 18.5980, endLng: 73.7680     // Bhumkar Chowk / Wakad
    },
    waypoints: realRoadGeometries['nh48-tathawade'],
    activityType: 'road_surface',
    stageWiseCompletion: {
      'Earthwork': 100,
      'GSB': 100,
      'WBM / WMM': 100,
      'DBM': 68,
      'BC / Asphalt': 0
    },
    milestones: [
      { name: 'Earthwork', date: '10 Jan 2025', status: 'completed' },
      { name: 'GSB', date: '02 Mar 2025', status: 'completed' },
      { name: 'WMM', date: '15 May 2025', status: 'completed' },
      { name: 'DBM', date: 'In progress', status: 'active' },
      { name: 'Asphalt', date: '15 Nov 2025', status: 'pending' }
    ],
    evidence: [
      { id: 'ev-4', title: 'Yesterday · 17:20', stage: 'DBM Laying', url: '', thumbnail: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80', status: 'VERIFIED' }
    ],
    previousCapture: {
      date: '08 Jun 2025',
      stage: 'WMM Curing Completed',
      imageUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=800&q=80'
    }
  },
  {
    id: 'baner-balewadi',
    code: 'BBL-W04',
    name: 'Baner–Balewadi Link Road',
    location: 'Baner – Balewadi High St, Pune West',
    totalLengthKm: 2.1,
    completedLengthKm: 0.88,
    chainage: '0+000 to 2+100',
    currentStage: 'GSB',
    stageCode: 'gsb',
    progressPercent: 42,
    status: 'DELAYED',
    contractor: 'Apex Roadworks JV',
    contractDeadline: '10 Aug 2025',
    daysRemaining: 55,
    variance: '9 days behind schedule',
    lastCaptureTime: '12 Jun, 15:05 IST',
    gpsVerified: true,
    gpsAccuracyMeters: 5.1,
    coordinates: { lat: 18.5652, lng: 73.7787 },
    bounds: {
      startLat: 18.5585, startLng: 73.7885, // Baner Road junction
      endLat: 18.5720, endLng: 73.7690     // Balewadi Stadium road
    },
    waypoints: realRoadGeometries['baner-balewadi'],
    activityType: 'road_surface',
    stageWiseCompletion: {
      'Earthwork': 100,
      'GSB': 45,
      'WBM / WMM': 0,
      'DBM': 0,
      'BC / Asphalt': 0
    },
    milestones: [
      { name: 'Earthwork', date: '15 Feb 2025', status: 'completed' },
      { name: 'GSB', date: 'Delayed (Overdue)', status: 'delayed' },
      { name: 'WMM', date: '01 Jul 2025', status: 'pending' },
      { name: 'DBM', date: '25 Jul 2025', status: 'pending' },
      { name: 'Asphalt', date: '10 Aug 2025', status: 'pending' }
    ],
    evidence: [
      { id: 'ev-5', title: '12 Jun · 15:05', stage: 'GSB Rolling', url: '', thumbnail: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80', status: 'REVIEW' }
    ],
    previousCapture: {
      date: '28 May 2025',
      stage: 'Subgrade Excavation',
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80'
    }
  },
  {
    id: 'katraj-kondhwa',
    code: 'KK-EXP-08',
    name: 'Katraj–Kondhwa Road Expansion',
    location: 'Katraj – Khadi Machine, South Pune',
    totalLengthKm: 4.8,
    completedLengthKm: 1.48,
    chainage: '0+500 to 5+300',
    currentStage: 'Earthwork',
    stageCode: 'earthwork',
    progressPercent: 31,
    status: 'ANOMALY',
    contractor: 'Shree Sai Infra Concessions',
    contractDeadline: '20 Dec 2025',
    daysRemaining: 188,
    variance: 'Anomaly detected: GPS out of zone',
    lastCaptureTime: '15 Jun, 16:08 IST',
    gpsVerified: false,
    gpsAccuracyMeters: 14.5,
    coordinates: { lat: 18.4582, lng: 73.8765 },
    bounds: {
      startLat: 18.4485, startLng: 73.8580, // Katraj Chowk
      endLat: 18.4680, endLng: 73.8950     // Khadi Machine Chowk
    },
    waypoints: realRoadGeometries['katraj-kondhwa'],
    activityType: 'road_surface',
    stageWiseCompletion: {
      'Earthwork': 75,
      'GSB': 0,
      'WBM / WMM': 0,
      'DBM': 0,
      'BC / Asphalt': 0
    },
    milestones: [
      { name: 'Earthwork', date: 'In progress', status: 'active' },
      { name: 'GSB', date: '15 Jul 2025', status: 'pending' },
      { name: 'WMM', date: '30 Aug 2025', status: 'pending' },
      { name: 'DBM', date: '20 Oct 2025', status: 'pending' },
      { name: 'Asphalt', date: '20 Dec 2025', status: 'pending' }
    ],
    evidence: [
      { id: 'ev-6', title: '15 Jun · 16:08', stage: 'Earthwork cutting', url: '', thumbnail: 'https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?auto=format&fit=crop&w=600&q=80', status: 'REVIEW' }
    ],
    previousCapture: {
      date: '02 Jun 2025',
      stage: 'Clearing and Grubbing',
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80'
    }
  }
];

export const ALERTS = [
  {
    id: 'alt-1',
    severity: 'CRITICAL',
    time: '12 min ago',
    title: 'Potential duplicate image detected',
    project: 'NH-48 Tathawade Stretch',
    projectId: 'nh48-tathawade',
    description: 'pHash match found with capture from 03 June (99.4% perceptual match). Suspected image re-upload without actual physical work on site.',
    actionRequired: 'Request physical site reverification with live time-stamped video or on-duty engineer signoff.',
    status: 'OPEN'
  },
  {
    id: 'alt-2',
    severity: 'HIGH',
    time: '48 min ago',
    title: 'GPS location outside project boundary',
    project: 'Katraj–Kondhwa Road',
    projectId: 'katraj-kondhwa',
    description: 'Capture submitted 1.8 km from assigned chainage boundary (Geo-fence radius exceeded by 1,820 meters). Image location does not match package coordinates.',
    actionRequired: 'Reject submission, alert field contractor, and prompt mobile app user to re-capture inside geo-fenced coordinates.',
    status: 'OPEN'
  },
  {
    id: 'alt-3',
    severity: 'MEDIUM',
    time: '2 hours ago',
    title: 'Construction milestone delayed',
    project: 'Baner–Balewadi Link Road',
    projectId: 'baner-balewadi',
    description: 'GSB completion is 9 days behind schedule based on scheduled tender milestones. Progress velocity dropped below 150m/week.',
    actionRequired: 'Issue automated notice to Skyline Infra JV and schedule site supervisory meeting.',
    status: 'OPEN'
  },
  {
    id: 'alt-4',
    severity: 'LOW',
    time: '5 hours ago',
    title: 'No field update in 72 hours',
    project: 'Pune Ring Road – Package 3',
    projectId: 'pune-ring-road-p3',
    description: 'Last verified capture received 13 June. ULB guidelines require minimum once-per-48-hours photo monitoring for urban arterial roads.',
    actionRequired: 'Send push notification to assigned Junior Engineer Arjun Kulkarni.',
    status: 'OPEN'
  }
];

export const REPORTS = [
  {
    id: 'DR-240616-0847',
    date: '16 Jun 2025',
    project: 'Pune Ring Road – Package 3',
    projectId: 'pune-ring-road-p3',
    stage: 'WBM / WMM',
    progress: '68%',
    verification: 'VERIFIED',
    engineer: 'Arjun Kulkarni',
    coordinates: '18.536248° N, 73.740012° E',
    accuracy: '±4.2 m',
    completedToday: '+1.4 km',
    confidence: '92%'
  },
  {
    id: 'DR-240616-0741',
    date: '16 Jun 2025',
    project: 'NH-48 Tathawade Stretch',
    projectId: 'nh48-tathawade',
    stage: 'DBM',
    progress: '84%',
    verification: 'VERIFIED',
    engineer: 'Vikas Deshmukh',
    coordinates: '18.618620° N, 73.754840° E',
    accuracy: '±3.8 m',
    completedToday: '+0.8 km',
    confidence: '94%'
  },
  {
    id: 'DR-240615-1832',
    date: '15 Jun 2025',
    project: 'Baner–Balewadi Link Road',
    projectId: 'baner-balewadi',
    stage: 'GSB',
    progress: '42%',
    verification: 'VERIFIED',
    engineer: 'Priya Joshi',
    coordinates: '18.565215° N, 73.778730° E',
    accuracy: '±5.1 m',
    completedToday: '+0.3 km',
    confidence: '88%'
  },
  {
    id: 'DR-240615-1608',
    date: '15 Jun 2025',
    project: 'Katraj–Kondhwa Road',
    projectId: 'katraj-kondhwa',
    stage: 'Earthwork',
    progress: '31%',
    verification: 'REVIEW',
    engineer: 'Ramesh Patil',
    coordinates: '18.458210° N, 73.876520° E',
    accuracy: '±14.5 m',
    completedToday: '+0.0 km (GPS Anomaly)',
    confidence: '64%'
  }
];

// Presets for instant interactive testing with accurate Pune coordinates
export const TEST_PRESETS = [
  {
    id: 'preset-wmm-success',
    title: 'Preset 1: WBM / WMM Layer (Valid capture at Ch 13+600)',
    activityId: 'road_surface',
    projectId: 'pune-ring-road-p3',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=900&q=80',
    comparisonUrl: 'https://images.unsplash.com/photo-1508873696983-2df5703bc225?auto=format&fit=crop&w=900&q=80',
    gps: { lat: 18.536248, lng: 73.740012, accuracy: 4.2 },
    expectedStage: 'WBM / WMM',
    confidence: 92,
    completionKm: 1.4,
    totalKm: 3.5,
    stageProgress: { 'Earthwork': 100, 'GSB': 100, 'WBM / WMM': 61, 'DBM': 0 },
    simulatedError: null,
    badgeText: 'Location, time and image authenticity passed'
  },
  {
    id: 'preset-dbm-success',
    title: 'Preset 2: DBM / Asphalt Bitumen Laying (NH-48 Tathawade)',
    activityId: 'road_surface',
    projectId: 'nh48-tathawade',
    imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=900&q=80',
    comparisonUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=900&q=80',
    gps: { lat: 18.618620, lng: 73.754840, accuracy: 3.8 },
    expectedStage: 'DBM (Dense Bituminous Macadam)',
    confidence: 95,
    completionKm: 4.37,
    totalKm: 5.2,
    stageProgress: { 'Earthwork': 100, 'GSB': 100, 'WBM / WMM': 100, 'DBM': 68, 'BC / Asphalt': 0 },
    simulatedError: null,
    badgeText: 'Pavement binder course layer verified'
  },
  {
    id: 'preset-utility-ducts',
    title: 'Preset 3: Utility Duct Conduit Trenching (Mulshi Corridor)',
    activityId: 'utility_ducts',
    projectId: 'pune-ring-road-p3',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80',
    comparisonUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=900&q=80',
    gps: { lat: 18.535890, lng: 73.738920, accuracy: 4.5 },
    expectedStage: 'Duct Conduit Laying',
    confidence: 89,
    completionKm: 1.1,
    totalKm: 3.5,
    stageProgress: { 'Trench Excavation': 100, 'Sand Bedding': 100, 'Duct Laying': 55, 'Manholes': 20 },
    simulatedError: null,
    badgeText: 'Utility corridor geometry & bedding validated'
  },
  {
    id: 'preset-error-blur',
    title: 'Preset 4 [Error Demo]: Blurry / Motion-distorted image',
    activityId: 'road_surface',
    projectId: 'pune-ring-road-p3',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80',
    comparisonUrl: '',
    gps: { lat: 18.536248, lng: 73.740012, accuracy: 4.2 },
    expectedStage: null,
    confidence: 28,
    simulatedError: {
      type: 'IMAGE_BLURRY',
      title: 'Image Quality Verification Failed',
      message: 'Image is excessively blurry or motion-distorted (Laplacian Sharpness Variance: 42 < threshold 55). Computer Vision cannot accurately classify aggregate layer textures.',
      correctionPrompt: 'Please hold device steady, wait for camera focus, and capture in good lighting condition.'
    }
  },
  {
    id: 'preset-error-gps',
    title: 'Preset 5 [Error Demo]: GPS Outside Project Stretch (>100m)',
    activityId: 'road_surface',
    projectId: 'pune-ring-road-p3',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=900&q=80',
    comparisonUrl: '',
    gps: { lat: 18.5080, lng: 73.8050, accuracy: 6.2 }, // Kothrud / Paud Road (~7.2 km away from Mulshi/Pirangut stretch)
    expectedStage: null,
    confidence: 45,
    simulatedError: {
      type: 'GPS_OUT_OF_BOUNDS',
      title: 'Geo-Fence Boundary Violation',
      message: 'Captured GPS (18.5080° N, 73.8050° E) is 7,240 meters away from assigned road chainage (12+200 to 15+700).',
      correctionPrompt: 'Please ensure you are physically standing at the active construction road stretch and allow high-accuracy GPS on your mobile device.'
    }
  },
  {
    id: 'preset-error-duplicate',
    title: 'Preset 6 [Error Demo]: Duplicate / Reused Fraud Photo',
    activityId: 'road_surface',
    projectId: 'nh48-tathawade',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=900&q=80',
    comparisonUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=900&q=80',
    gps: { lat: 18.618620, lng: 73.754840, accuracy: 3.8 },
    expectedStage: null,
    confidence: 99,
    simulatedError: {
      type: 'DUPLICATE_IMAGE_FRAUD',
      title: 'Duplicate Capture Detected (pHash Collision)',
      message: 'This exact image was already submitted on 03 June 2025 by user MH-PWD-1902. Perceptual image hash similarity is 99.8%. Duplicate reporting is not permitted.',
      correctionPrompt: 'Take a live camera picture of current road progress. Re-uploading cached gallery pictures is prohibited under ULB audit guidelines.'
    }
  }
];

export const FREE_DATASETS = [
  {
    id: 'idd',
    name: 'India Driving Dataset (IDD & IDD-Lite)',
    provider: 'IIIT Hyderabad & Intel India',
    license: 'Free for Academic & Non-commercial Research',
    size: '10,000+ high-res images / IDD-Lite < 50 MB',
    url: 'http://idd.insaan.iiit.ac.in/',
    description: 'Crucial for Indian road conditions. Provides 34 fine-grained classes with road, unpaved road, mud, shoulder, curbs, and construction zones captured in Hyderabad and Bengaluru.',
    utility: 'Pretraining road boundary segmentation and road surface drivable area in unstructured Indian urban terrain.'
  },
  {
    id: 'rdd2022',
    name: 'Road Damage Dataset 2022 (RDD2022)',
    provider: 'Global Crowdsensing Consortium (Univ of Tokyo / Figshare)',
    license: 'CC BY-SA 4.0 / Open Access',
    size: '47,420 multi-national road images (includes India, Japan, US)',
    url: 'https://doi.org/10.6084/m9.figshare.21431547',
    description: 'Extensive dataset of road conditions, cracks, potholes, pavement distress, and texture variations across Indian national and state highways.',
    utility: 'Fine-tuning surface texture classifiers and detecting differences between degraded subgrade, fresh macadam, and wearing coats.'
  },
  {
    id: 'mapillary_vistas',
    name: 'Mapillary Vistas Dataset v2.0',
    provider: 'Mapillary / Meta',
    license: 'Free for Research (Commercial license available)',
    size: '25,000 high-resolution street-level images',
    url: 'https://www.mapillary.com/dataset/vistas',
    description: 'Pixel-accurate semantic segmentation for 152 object categories across 6 continents, including pedestrian sidewalks, kerbs, catch basins, service lanes, and road pavement.',
    utility: 'Benchmarking pedestrian infrastructure (kerbstone, footpath) and utility duct corridors.'
  },
  {
    id: 'roboflow_construction_progress',
    name: 'Roboflow Construction Progress & Pavement Datasets',
    provider: 'Roboflow Universe Community',
    license: 'CC BY 4.0 / Public Domain',
    size: 'Over 12,000 annotated images across specialized projects',
    url: 'https://universe.roboflow.com/search?q=road+construction+progress',
    description: 'Includes "construction-progress" (classes: asphalt, progress, unpaved), "FYP Pavement Detection" (classes: concrete, asphalt, drainage), and "Road Paved vs Unpaved" (2.68k images).',
    utility: 'Rapid transfer learning and object detection for road stages (Excavation, GSB, Asphalt, Drainage).'
  },
  {
    id: 'construction_traversability',
    name: 'Construction Traversability Dataset (CTD)',
    provider: 'IEEE DataPort / Robotics Sites',
    license: 'CC BY-NC 4.0',
    size: '28 semantic classes with pixel-wise masks from active earthwork sites',
    url: 'https://ieee-dataport.org/documents/construction-site-traversability',
    description: 'Annotated images from real-world heavy civil construction sites showing raw soil, aggregate gravel piles, compactor tracks, and excavated trenches.',
    utility: 'Training classifiers to identify Earthwork and GSB aggregate compaction stages.'
  },
  {
    id: 'levir_cd',
    name: 'LEVIR-CD & SpaceNet 7 Change Detection Datasets',
    provider: 'Beihang University & SpaceNet / TorchGeo',
    license: 'Open Access / Creative Commons',
    size: '637 bitemporal high-res image pairs (LEVIR-CD) + 24-month time series',
    url: 'https://justchenhao.github.io/LEVIR/',
    description: 'Standard benchmark for AI change detection between time-separated captures of the same geographic location.',
    utility: 'Testing and validating the "Compare status with previous site images" progress calculation module.'
  }
];
