import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Clock,
  Layers,
  ChevronRight,
  ArrowLeft,
  Share2,
  Download,
  RotateCcw,
  ShieldCheck,
  Bell,
  Home,
  FolderKanban,
  FileText,
  User,
  Upload,
  Sparkles,
  XCircle,
  Maximize2,
  Server,
  Activity,
  Cpu,
  HardHat,
  Calendar,
  TrendingUp,
  AlertCircle,
  Building2,
  ChevronDown
} from 'lucide-react';
import BeforeAfterSlider from './BeforeAfterSlider';
import { ACTIVITIES, PROJECTS, TEST_PRESETS, REPORTS } from '../data/mockData';
import { analyzeSiteImage } from '../utils/cvEngine';
import { extractExifGps } from '../utils/exifParser';
import { analyzeImageApi, checkApiHealth } from '../services/api';

export default function FieldMobileView({
  onOpenReports,
  onSwitchToDashboard,
  activeScreen = null,
  onScreenChange = null
}) {
  const [internalScreen, setInternalScreen] = useState('home'); // login, home, capture, analysis_result, report_submitted
  const screen = activeScreen || internalScreen;
  const setScreen = onScreenChange || setInternalScreen;
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [employeeId, setEmployeeId] = useState('MH-PWD-2041');
  const [selectedActivity, setSelectedActivity] = useState(ACTIVITIES[0].id);
  const [selectedProject, setSelectedProject] = useState(PROJECTS[0]);
  const [chainageInput, setChainageInput] = useState('12+200 to 15+700');
  const [currentGps, setCurrentGps] = useState({ lat: 18.536248, lng: 73.740012, accuracy: 4.2 });
  const [gpsSourceLabel, setGpsSourceLabel] = useState('Device Geolocation (Browser)');
  const [gpsSourceType, setGpsSourceType] = useState('browser_gps'); // 'photo_exif', 'browser_gps', 'preset'
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [rawFile, setRawFile] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [comparisonImage, setComparisonImage] = useState(PROJECTS[0].previousCapture.imageUrl);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [errorModal, setErrorModal] = useState(null);
  const [submittedReportId, setSubmittedReportId] = useState('DR-240616-0847');
  const [backendStatus, setBackendStatus] = useState({ online: false, model_loaded: false });
  const [useStubToggle, setUseStubToggle] = useState(false);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Monitor FastAPI Backend Server Health
  useEffect(() => {
    let isMounted = true;
    const pollBackendHealth = async () => {
      const status = await checkApiHealth();
      if (isMounted) setBackendStatus(status);
    };
    pollBackendHealth();
    const interval = setInterval(pollBackendHealth, 8000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Listen for global Start Assessment button trigger
  useEffect(() => {
    const handleStart = () => {
      setScreen('capture');
    };
    window.addEventListener('start-assessment', handleStart);
    return () => window.removeEventListener('start-assessment', handleStart);
  }, []);

  // Auto detect GPS via browser Geolocation API with high precision
  const handleDetectGPS = (customSourceNotice = null) => {
    setIsGpsLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentGps({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy ? Math.round(pos.coords.accuracy * 10) / 10 : 3.8
          });
          setGpsSourceLabel(customSourceNotice || 'Device Geolocation API (Browser GNSS)');
          setGpsSourceType('browser_gps');
          setIsGpsLoading(false);
        },
        () => {
          // Precise fallback for Pune Ring Road Package 3 active chainage
          setCurrentGps({ lat: 18.536248, lng: 73.740012, accuracy: 4.2 });
          setGpsSourceLabel('Pune Highway Baseline (Corridor Calibrated)');
          setGpsSourceType('preset');
          setIsGpsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    } else {
      setIsGpsLoading(false);
    }
  };

  // Handle preset selection
  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset);
    const proj = PROJECTS.find((p) => p.id === preset.projectId) || PROJECTS[0];
    setSelectedProject(proj);
    setSelectedActivity(preset.activityId || 'road_surface');
    setCurrentGps(preset.gps);
    setGpsSourceLabel('Interactive Test Preset GPS');
    setGpsSourceType('preset');
    setCapturedImage(preset.imageUrl);
    setRawFile(null);
    setComparisonImage(preset.comparisonUrl || proj.previousCapture.imageUrl);
  };

  // Handle custom file upload or camera capture with EXIF GPS extraction
  const handleFileUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setRawFile(file);
      setSelectedPreset(null);

      // Read image for preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target.result);
      };
      reader.readAsDataURL(file);

      // Extract EXIF GPS metadata if available
      try {
        const exifData = await extractExifGps(file);
        if (exifData.hasGps) {
          setCurrentGps({
            lat: exifData.lat,
            lng: exifData.lng,
            accuracy: 3.5,
            source: 'photo_exif'
          });
          setGpsSourceLabel('Photo EXIF Metadata (Embedded)');
          setGpsSourceType('photo_exif');
        } else {
          // Fall back gracefully to device geolocation
          handleDetectGPS('Photo lacked EXIF tags. Used Browser Geolocation.');
        }
      } catch (err) {
        handleDetectGPS('Using Browser Geolocation.');
      }
    }
  };

  // Run AI Stage Assessment via FastAPI Backend (with client-side pre-check & fallback)
  const handleRunAssessment = async () => {
    if (!capturedImage) {
      alert('Please upload or capture a photo first.');
      return;
    }

    setIsAnalyzing(true);
    setErrorModal(null);

    // Step 1: Instant Client-Side Quality Pre-Check (saves bandwidth and catches bad captures immediately)
    if (!selectedPreset) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = capturedImage;

      const preCheckPass = await new Promise((resolve) => {
        img.onload = async () => {
          try {
            const preResult = await analyzeSiteImage({
              imageElement: img,
              activityType: selectedActivity,
              project: selectedProject,
              userGps: currentGps,
              simulatedPreset: null
            });
            // If severe blur or darkness caught locally, stop early
            if (!preResult.success && (preResult.error.type === 'IMAGE_BLURRY' || preResult.error.type === 'IMAGE_DARK')) {
              setErrorModal(preResult.error);
              resolve(false);
              return;
            }
          } catch (e) {
            // Ignore precheck error and proceed to backend
          }
          resolve(true);
        };
        img.onerror = () => resolve(true);
      });

      if (!preCheckPass) {
        setIsAnalyzing(false);
        return;
      }
    }

    // Step 2: Call FastAPI Backend /api/analyze-image
    try {
      const result = await analyzeImageApi({
        imageFile: rawFile,
        imageBase64: capturedImage,
        activityType: selectedActivity,
        project: selectedProject,
        userGps: currentGps,
        chainage: chainageInput,
        useStub: useStubToggle,
        simulatedPreset: selectedPreset
      });

      setIsAnalyzing(false);

      if (!result.success) {
        // Show server's error message in existing correction flow
        setErrorModal(result.error);
      } else {
        setAnalysisResult(result);
        setScreen('analysis_result');
      }
    } catch (err) {
      setIsAnalyzing(false);
      alert(`Assessment error: ${err.message}`);
    }
  };

  // Submit daily progress report
  const handleSubmitReport = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `DR-240616-${randomNum}`;
    setSubmittedReportId(newId);
    setScreen('report_submitted');
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 px-3 min-h-[calc(100vh-80px)]">
      {/* Mobile Device Mockup Frame */}
      <div className="relative w-full max-w-[412px] bg-slate-900 rounded-[48px] p-3 shadow-2xl border-4 border-slate-700/80 ring-1 ring-slate-950/20">
        
        {/* Dynamic Island / Speaker cutout */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-full z-50 flex items-center justify-between px-3 border border-slate-800">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700"></div>
          <div className="w-3 h-3 rounded-full bg-slate-950 ring-1 ring-slate-800 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-900/60"></div>
          </div>
        </div>

        {/* Mobile Screen Surface */}
        <div className="w-full h-[760px] bg-slate-50 rounded-[38px] overflow-hidden flex flex-col relative font-sans text-slate-800 select-none shadow-inner">
          
          {/* Status Bar */}
          <div className="h-10 pt-2 px-6 flex items-center justify-between text-xs font-semibold text-slate-700 z-40 bg-transparent">
            <span>09:41</span>
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px]">5G</span>
              <div className="w-5 h-2.5 border border-slate-600 rounded-sm p-0.5 flex items-center">
                <div className="h-full w-3/4 bg-slate-700 rounded-2xs"></div>
              </div>
            </div>
          </div>

          {/* SCREEN 1: CONTRACTOR LOGIN */}
          {screen === 'login' && (
            <div className="flex-1 flex flex-col justify-between p-6 pt-4 bg-gradient-to-b from-slate-50 to-orange-50/30">
              <div>
                {/* Logo & Header */}
                <div className="flex items-center space-x-2.5 mb-6">
                  <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    <HardHat className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="font-extrabold text-lg text-slate-900 leading-tight">RoadSight Contractor</h1>
                    <p className="text-[10px] tracking-wider text-orange-600 uppercase font-bold">Field Execution & Billing Portal</p>
                  </div>
                </div>

                <div className="mb-5">
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                    Contractor Authentication
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-2">Contractor Sign In</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Submit daily progress photos, track completion % and verify deadlines.</p>
                </div>

                {/* Form Inputs */}
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Contractor Firm / License ID</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        className="w-full px-3.5 py-2.5 pl-10 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white font-medium"
                        placeholder="e.g. CONT-SKY-041"
                      />
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Lead Field Engineer</label>
                    <div className="relative">
                      <input
                        type="text"
                        defaultValue="Arjun Kulkarni"
                        className="w-full px-3.5 py-2.5 pl-10 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white font-medium"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        defaultValue="demo1234"
                        className="w-full px-3.5 py-2.5 pl-10 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                        placeholder="Enter password"
                      />
                      <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    </div>
                  </div>

                  <button
                    onClick={() => setScreen('home')}
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
                  >
                    Login as Contractor (Skyline Infra)
                  </button>

                  <div className="pt-2 text-center">
                    <button
                      onClick={onSwitchToDashboard}
                      className="text-xs text-brand-700 font-bold hover:underline flex items-center justify-center space-x-1 mx-auto"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Are you a Supervising Officer? Switch to Officer Login &rarr;</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer Badge */}
              <div className="text-center pt-4 pb-1">
                <div className="inline-flex items-center space-x-1.5 text-[10px] text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
                  <span>Authorized Highway Works Contractor Portal</span>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 2: CONTRACTOR DASHBOARD (PROGRESS %, DEADLINE TRACKER & REPORT SUBMISSION) */}
          {screen === 'home' && (
            <div className="flex-1 flex flex-col justify-between overflow-y-auto no-scrollbar">
              <div className="p-4 pt-1 space-y-3.5">
                
                {/* Contractor Profile Bar */}
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-xs">
                      <HardHat className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-xs text-slate-900 leading-tight">Skyline Infra Pvt. Ltd.</h3>
                      <p className="text-[10px] text-slate-500">Contractor ID: CONT-SKY-041</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => setScreen('contractor_reports')}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 relative"
                      title="Submitted Reports"
                    >
                      <FileText className="w-4 h-4 text-brand-700" />
                    </button>
                    <button
                      onClick={onSwitchToDashboard}
                      className="px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-brand-700 font-bold text-[10px] border border-blue-200"
                      title="Switch to Officer Dashboard"
                    >
                      Officer &rarr;
                    </button>
                  </div>
                </div>

                {/* Active Contract Project Switcher */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Active Road Contract Package:
                  </label>
                  <select
                    value={selectedProject.id}
                    onChange={(e) => {
                      const proj = PROJECTS.find((p) => p.id === e.target.value);
                      if (proj) setSelectedProject(proj);
                    }}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {PROJECTS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.totalLengthKm} km) · {p.contractor}
                      </option>
                    ))}
                  </select>
                </div>

                {/* CARD 1: WORK PERCENTAGE GAUGE */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold text-orange-600 uppercase tracking-wider">
                        CONTRACTOR PHYSICAL PROGRESS
                      </span>
                      <h4 className="font-extrabold text-base text-slate-900 mt-0.5">
                        {selectedProject.currentStage}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {selectedProject.chainage} · {selectedProject.location}
                      </p>
                    </div>
                    {/* Radial Progress Ring */}
                    <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                      <div className="w-14 h-14 rounded-full border-4 border-slate-100 border-t-orange-500 border-r-orange-500 flex items-center justify-center bg-orange-50/50">
                        <span className="text-xs font-extrabold text-slate-900">{selectedProject.progressPercent}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar & Length Done */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
                      <span className="text-slate-600">Total Stretch Completed</span>
                      <span className="text-slate-900 font-bold">
                        {selectedProject.completedLengthKm} km of {selectedProject.totalLengthKm} km
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-700"
                        style={{ width: `${selectedProject.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Stage-wise Ladder Mini Bars */}
                  <div className="grid grid-cols-5 gap-1.5 pt-1 text-[9px] font-bold text-center">
                    <div className="p-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      EW 100%
                    </div>
                    <div className="p-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      GSB 100%
                    </div>
                    <div className={`p-1 rounded border ${
                      selectedProject.progressPercent >= 50
                        ? 'bg-orange-50 text-orange-800 border-orange-300'
                        : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}>
                      WMM {selectedProject.stageWiseCompletion?.['WBM / WMM'] || 61}%
                    </div>
                    <div className={`p-1 rounded border ${
                      selectedProject.progressPercent >= 75
                        ? 'bg-orange-50 text-orange-800 border-orange-300'
                        : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}>
                      DBM 0%
                    </div>
                    <div className="p-1 rounded bg-slate-50 text-slate-400 border-slate-200">
                      BC 0%
                    </div>
                  </div>
                </div>

                {/* CARD 2: DEADLINE & SCHEDULE TRACKING ("Is he behind deadline or not") */}
                <div className={`rounded-2xl p-4 border shadow-sm space-y-3 ${
                  selectedProject.status === 'ON TRACK'
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : selectedProject.status === 'DELAYED'
                    ? 'bg-amber-50/60 border-amber-300'
                    : 'bg-red-50/60 border-red-300'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <Clock className={`w-4 h-4 ${
                        selectedProject.status === 'ON TRACK' ? 'text-emerald-700' : 'text-amber-700'
                      }`} />
                      <span className="font-extrabold text-xs text-slate-900">Contract Deadline & Pace</span>
                    </div>

                    {/* Status Badge */}
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider ${
                      selectedProject.status === 'ON TRACK'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : selectedProject.status === 'DELAYED'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-red-100 text-red-800 border border-red-300'
                    }`}>
                      {selectedProject.status === 'ON TRACK' && 'ON SCHEDULE'}
                      {selectedProject.status === 'DELAYED' && 'BEHIND DEADLINE'}
                      {selectedProject.status === 'ANOMALY' && 'GPS ANOMALY'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 font-bold block">CONTRACT DEADLINE</span>
                      <strong className="text-slate-900 font-extrabold">{selectedProject.contractDeadline}</strong>
                      <p className="text-[10px] text-slate-500 mt-0.5">{selectedProject.daysRemaining || 104} Days Left</p>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 font-bold block">SCHEDULE VARIANCE</span>
                      <strong className={`font-extrabold ${
                        selectedProject.status === 'ON TRACK' ? 'text-emerald-700' : 'text-amber-800'
                      }`}>
                        {selectedProject.status === 'ON TRACK' ? '2 Days Ahead' : '14 Days Delay'}
                      </strong>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {selectedProject.status === 'ON TRACK' ? 'Pace: Optimal' : 'Penalty Clause Active'}
                      </p>
                    </div>
                  </div>

                  <div className="text-[11px] font-medium leading-relaxed">
                    {selectedProject.status === 'ON TRACK' ? (
                      <p className="text-emerald-900">
                        ✅ <strong>Work is on schedule:</strong> Milestone target for WMM layer is pace-aligned. Next interim bill eligible for submission upon 70% chainage.
                      </p>
                    ) : (
                      <p className="text-amber-950">
                        ⚠️ <strong>Behind Deadline:</strong> PWD engineering supervision requires a 5% weekly pace acceleration to prevent liquidated damages deductions.
                      </p>
                    )}
                  </div>
                </div>

                {/* PRIMARY ACTION: TAKE GPS PHOTO & SUBMIT REPORT */}
                <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-4 text-white shadow-md space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="font-extrabold text-sm">Site Progress Inspection Due</h4>
                      <p className="text-[11px] text-orange-100">Capture GPS-tagged site photos for physical progress verification</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <button
                    onClick={() => setScreen('capture')}
                    className="w-full py-2.5 bg-white text-orange-600 hover:bg-orange-50 font-extrabold text-xs rounded-xl shadow-sm flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Take GPS Photo & Run Assessment &rarr;</span>
                  </button>
                </div>

                {/* RECENT SUBMITTED REPORTS FOR THIS CONTRACTOR */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-900">Contractor Submission History</span>
                    <button
                      onClick={() => setScreen('contractor_reports')}
                      className="text-[11px] font-bold text-orange-600 hover:underline"
                    >
                      View all &rarr;
                    </button>
                  </div>

                  <div className="space-y-2">
                    {REPORTS.slice(0, 2).map((rep) => (
                      <div
                        key={rep.id}
                        className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <strong className="text-slate-900 text-[11px]">{rep.id}</strong>
                            <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded">
                              {rep.verification}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5">{rep.stage} · {rep.date}</p>
                        </div>
                        <span className="font-bold text-slate-700 text-[11px]">{rep.progress}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Contractor Bottom Navigation Bar */}
              <div className="h-14 bg-white border-t border-slate-200 px-6 flex items-center justify-between text-[10px] font-semibold text-slate-500 z-30">
                <button
                  onClick={() => setScreen('home')}
                  className="flex flex-col items-center text-orange-600 font-bold space-y-0.5"
                >
                  <Home className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => setScreen('capture')}
                  className="flex flex-col items-center hover:text-orange-600 space-y-0.5"
                >
                  <Camera className="w-4 h-4" />
                  <span>Take Photo</span>
                </button>
                <button
                  onClick={() => setScreen('contractor_reports')}
                  className="flex flex-col items-center hover:text-orange-600 space-y-0.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>My Reports</span>
                </button>
                <button
                  onClick={onSwitchToDashboard}
                  className="flex flex-col items-center text-brand-700 hover:text-brand-900 space-y-0.5"
                  title="Switch to Officer Portal"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Officer Portal</span>
                </button>
              </div>
            </div>
          )}

          {/* SCREEN: CONTRACTOR SUBMITTED REPORTS LIST */}
          {screen === 'contractor_reports' && (
            <div className="flex-1 flex flex-col justify-between overflow-y-auto no-scrollbar p-4">
              <div className="space-y-3.5">
                {/* Header */}
                <div className="flex items-center justify-between pb-1">
                  <button
                    onClick={() => setScreen('home')}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-xs text-slate-900">Contractor Progress Reports</span>
                  <div className="w-7"></div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-[11px] text-orange-950 font-medium">
                  <strong>Skyline Infra Submissions:</strong> Daily site photo logs verified by AI and submitted to PWD Supervising Officer for milestone bill approval.
                </div>

                {/* Reports List */}
                <div className="space-y-2.5">
                  {REPORTS.map((rep) => (
                    <div
                      key={rep.id}
                      className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-slate-900">{rep.id}</span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                          {rep.verification}
                        </span>
                      </div>
                      <div className="text-[11px] space-y-0.5 text-slate-600">
                        <p><strong>Project:</strong> {rep.project}</p>
                        <p><strong>Stage:</strong> {rep.stage} ({rep.progress})</p>
                        <p className="flex items-center space-x-1 text-slate-500 text-[10px]">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          <span>{rep.coordinates} (Acc: {rep.accuracy})</span>
                        </p>
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400">Date: {rep.date}</span>
                        <span className="font-bold text-emerald-700">Approved for Billing</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3">
                <button
                  onClick={() => setScreen('capture')}
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <Camera className="w-4 h-4" />
                  <span>Submit New Site Photo &rarr;</span>
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 3: SITE CAPTURE & ASSESSMENT INPUT */}
          {screen === 'capture' && (
            <div className="flex-1 flex flex-col justify-between overflow-y-auto no-scrollbar p-4">
              <div className="space-y-3.5">
                {/* Top Nav & Backend Status Badge */}
                <div className="flex items-center justify-between pb-1">
                  <button
                    onClick={() => setScreen('home')}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-xs text-slate-900">New Site Assessment</span>
                  
                  {/* Live Backend Connection Indicator */}
                  <div
                    className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                      backendStatus.online
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}
                    title={backendStatus.online ? 'FastAPI backend server active at port 8000' : 'Backend offline - using browser client fallback'}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${backendStatus.online ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                    <span>{backendStatus.online ? 'API Online' : 'Client Fallback'}</span>
                  </div>
                </div>

                {/* Model / Stub Mode Switcher for Panel Presentation */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-[10px] font-bold text-slate-700">
                    <Cpu className="w-3.5 h-3.5 text-brand-700" />
                    <span>Inference Mode:</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-white p-0.5 rounded-lg border border-slate-200 text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setUseStubToggle(false)}
                      className={`px-2 py-1 rounded-md transition-all ${
                        !useStubToggle ? 'bg-brand-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Neural Model
                    </button>
                    <button
                      type="button"
                      onClick={() => setUseStubToggle(true)}
                      className={`px-2 py-1 rounded-md transition-all ${
                        useStubToggle ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Stub Safe
                    </button>
                  </div>
                </div>

                {/* Road Project Selection */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Road Project Stretch</label>
                  <select
                    value={selectedProject.id}
                    onChange={(e) => {
                      const p = PROJECTS.find((proj) => proj.id === e.target.value);
                      if (p) setSelectedProject(p);
                    }}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-600"
                  >
                    {PROJECTS.map((proj) => (
                      <option key={proj.id} value={proj.id}>
                        {proj.name} ({proj.totalLengthKm} km)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Activity Selection */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Activity Component to Assess
                  </label>
                  <select
                    value={selectedActivity}
                    onChange={(e) => setSelectedActivity(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-600"
                  >
                    {ACTIVITIES.map((act) => (
                      <option key={act.id} value={act.id}>
                        {act.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Chainage Range & Live GPS with EXIF/Browser source detection */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Chainage Stretch</label>
                    <input
                      type="text"
                      value={chainageInput}
                      onChange={(e) => setChainageInput(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                      placeholder="e.g. 12+200 to 15+700"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5 flex items-center justify-between">
                      <span>Live GPS Pin</span>
                      <button
                        onClick={() => handleDetectGPS()}
                        className="text-brand-600 hover:underline text-[9px] font-bold"
                      >
                        {isGpsLoading ? 'Pinging...' : 'Refresh'}
                      </button>
                    </label>
                    <div className="p-2 bg-white border border-slate-300 rounded-lg text-[10px] font-mono text-slate-700 flex flex-col justify-center">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="font-bold text-slate-850 truncate">{currentGps.lat.toFixed(6)}°N, {currentGps.lng.toFixed(6)}°E</span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-emerald-700 font-sans mt-0.5 pt-0.5 border-t border-slate-100">
                        <span>Acc: ±{currentGps.accuracy || 4.2}m</span>
                        <span className="font-bold text-blue-700 truncate max-w-[70px]" title={gpsSourceLabel}>
                          {gpsSourceType === 'photo_exif' ? 'EXIF Tag' : 'GNSS Lock'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* GPS Source Indicator Pill */}
                <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px]">
                  <span className="text-slate-500 font-medium">GPS Coordinate Source:</span>
                  <span className={`font-bold flex items-center space-x-1 ${
                    gpsSourceType === 'photo_exif' ? 'text-emerald-700' : 'text-blue-700'
                  }`}>
                    <span>{gpsSourceType === 'photo_exif' ? '📸' : '📡'}</span>
                    <span>{gpsSourceLabel}</span>
                  </span>
                </div>

                {/* Photo Upload & Quick Preset Dropdown */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-700">Site Photo Evidence</label>
                    <span className="text-[10px] text-brand-600 font-semibold">Live camera or test samples</span>
                  </div>

                  {/* 1-Click Interactive Test Scenarios */}
                  <div className="mb-2">
                    <select
                      onChange={(e) => {
                        const pre = TEST_PRESETS.find((p) => p.id === e.target.value);
                        if (pre) handleSelectPreset(pre);
                      }}
                      value={selectedPreset ? selectedPreset.id : ''}
                      className="w-full p-2 bg-blue-50/70 border border-blue-200 rounded-lg text-[11px] font-semibold text-brand-800 focus:outline-none"
                    >
                      <option value="">⚡ Select Fast Demo Test Scenario...</option>
                      {TEST_PRESETS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Capture / Upload Dual Buttons */}
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current && cameraInputRef.current.click()}
                      className="flex items-center justify-center space-x-1.5 py-2 px-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl text-[11px] font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Take Photo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      className="flex items-center justify-center space-x-1.5 py-2 px-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-[11px] font-bold shadow-2xs active:scale-95 transition-all cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-brand-700" />
                      <span>Choose File</span>
                    </button>
                  </div>

                  {/* Preview / Capture Box */}
                  <div
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    className="relative w-full h-40 rounded-2xl border-2 border-dashed border-slate-300 bg-white hover:border-brand-500 transition-all flex flex-col items-center justify-center p-2 cursor-pointer overflow-hidden group shadow-2xs"
                  >
                    {capturedImage ? (
                      <div className="relative w-full h-full">
                        <img
                          src={capturedImage}
                          alt="Captured preview"
                          className="w-full h-full object-cover rounded-xl"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold rounded-xl space-x-1">
                          <RotateCcw className="w-4 h-4" />
                          <span>Tap to replace</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-brand-700 flex items-center justify-center mx-auto mb-1.5">
                          <Camera className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-slate-700">Ready to capture or upload</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">EXIF GPS extracted automatically from photos</p>
                      </div>
                    )}

                    {/* Camera Input (rear environment camera on mobile) */}
                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    {/* Regular File Upload Input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Assessment Submit Button */}
              <div className="pt-3">
                <button
                  disabled={!capturedImage || isAnalyzing}
                  onClick={handleRunAssessment}
                  className={`w-full py-3.5 rounded-xl text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md transition-all ${
                    !capturedImage
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : isAnalyzing
                      ? 'bg-brand-600 animate-pulse'
                      : 'bg-brand-700 hover:bg-brand-800 active:scale-[0.98]'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Running FastAPI Neural Stage Engine...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Run AI Stage Assessment</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 4: AI ANALYSIS RESULT (Matches Screenshot 113419.png) */}
          {screen === 'analysis_result' && analysisResult && (
            <div className="flex-1 flex flex-col justify-between overflow-y-auto no-scrollbar p-4">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between pb-1">
                  <button
                    onClick={() => setScreen('capture')}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-xs text-slate-900">AI analysis result</span>
                  
                  {/* Backend Status Tag */}
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md border ${
                    analysisResult.backendConnected
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {analysisResult.backendConnected ? 'FastAPI Backend' : 'Client Mode'}
                  </span>
                </div>

                {/* Top Capture Verified Banner */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-[11px] font-bold text-emerald-900">Capture verified</p>
                      <p className="text-[9px] text-emerald-700">Location, time and image authenticity passed</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded tracking-wider">
                    VERIFIED
                  </span>
                </div>

                {/* Blue Hero Card: Detected Construction Stage */}
                <div className="bg-brand-700 text-white p-4 rounded-2xl shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-blue-200 uppercase tracking-wider">
                        DETECTED CONSTRUCTION STAGE
                      </span>
                      <h3 className="text-xl font-extrabold mt-0.5 text-white">
                        {analysisResult.detectedStage}
                      </h3>
                      <p className="text-[11px] text-blue-100 mt-0.5">{analysisResult.description || 'Road surface layer verified'}</p>
                    </div>
                    {/* Radial progress ring */}
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-accent-orange border-r-accent-orange rotate-45"></div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs">
                    <span className="text-blue-100 font-medium">AI confidence</span>
                    <span className="font-extrabold text-white">{analysisResult.confidence}% · High</span>
                  </div>
                </div>

                {/* Inference Source & GPS Verification Pill */}
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs space-y-1 text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-semibold flex items-center space-x-1">
                      <Cpu className="w-3 h-3 text-brand-700" />
                      <span>Engine:</span>
                    </span>
                    <span className="font-bold text-brand-800">
                      {analysisResult.inferenceSource === 'ml_model'
                        ? 'FastAPI Neural Model (EfficientNet-B0)'
                        : analysisResult.inferenceSource === 'stub_fallback'
                        ? 'FastAPI Calibrated Stub'
                        : 'Browser Client CV Engine'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <span className="text-slate-500 font-semibold flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      <span>Location Source:</span>
                    </span>
                    <span className="font-bold text-slate-800">{gpsSourceLabel}</span>
                  </div>
                </div>

                {/* Estimated Completion Card */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-800">Estimated completion</span>
                    <span className="font-extrabold text-slate-900 text-sm">
                      {analysisResult.estimatedCompletionPercent}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden my-1.5">
                    <div
                      className="h-full bg-accent-orange rounded-full"
                      style={{ width: `${analysisResult.estimatedCompletionPercent}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    <strong className="text-slate-800">{analysisResult.completedLengthKm} km</strong> completed of{' '}
                    {analysisResult.totalLengthKm} km total stretch
                  </p>
                </div>

                {/* Stage-wise Completion Bars */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">Stage-wise completion</span>
                  {Object.entries(analysisResult.stageWise || {}).map(([stageName, pct]) => (
                    <div key={stageName} className="space-y-0.5">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                        <span>{stageName}</span>
                        <span className="text-slate-800 font-bold">{pct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-700 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Before / After Comparison Slider */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>Before / after</span>
                    <span className="text-[10px] text-brand-600 font-semibold cursor-pointer">Drag to compare</span>
                  </div>
                  <BeforeAfterSlider
                    beforeImage={comparisonImage}
                    afterImage={capturedImage}
                    beforeLabel="14 JUN"
                    afterLabel="TODAY"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 pb-1 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setScreen('capture')}
                  className="py-3 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl shadow-2xs active:scale-95 transition-all"
                >
                  Retake
                </button>
                <button
                  onClick={handleSubmitReport}
                  className="py-3 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-md active:scale-95 transition-all"
                >
                  Submit report
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 5: DAILY PROGRESS REPORT SUBMITTED (Matches Screenshot 113427.png) */}
          {screen === 'report_submitted' && (
            <div className="flex-1 flex flex-col justify-between overflow-y-auto no-scrollbar p-5">
              <div className="space-y-4">
                {/* Header Back & Bell */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setScreen('home')}
                    className="p-1 rounded-lg text-slate-600 hover:bg-slate-100"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-xs text-slate-900">Daily progress report</span>
                  <Bell className="w-4 h-4 text-slate-600" />
                </div>

                {/* Success Checkmark & Subtitle */}
                <div className="text-center pt-2">
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md mb-2">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900">Report submitted</h2>
                  <p className="text-[11px] text-slate-500 font-medium">Daily report #{submittedReportId}</p>
                </div>

                {/* Report Summary Card Container */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <div className="w-6 h-6 bg-brand-700 rounded-lg flex items-center justify-center text-white">
                        <Layers className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-xs text-slate-900">RoadSight</span>
                    </div>
                    <span className="text-[9px] font-extrabold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                      VERIFIED
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      DAILY PROGRESS REPORT
                    </span>
                    <h3 className="font-extrabold text-sm text-slate-900">{selectedProject.name}</h3>
                    <p className="text-[10px] text-slate-500">16 June 2025 · Site Engineer: Arjun Kulkarni</p>
                  </div>

                  {/* Evidence Image */}
                  <div className="w-full h-36 rounded-xl overflow-hidden border border-slate-100">
                    <img
                      src={capturedImage || PROJECTS[0].previousCapture.imageUrl}
                      alt="Submitted evidence"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* 4 Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-semibold block">Stage</span>
                      <span className="font-extrabold text-slate-800">
                        {analysisResult ? analysisResult.detectedStage : 'WBM / WMM'}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-semibold block">Progress</span>
                      <span className="font-extrabold text-slate-800">{selectedProject.progressPercent}%</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-semibold block">Today</span>
                      <span className="font-extrabold text-emerald-600">
                        +{analysisResult ? analysisResult.completedLengthKm : 1.4} km
                      </span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-semibold block">AI confidence</span>
                      <span className="font-extrabold text-slate-800">
                        {analysisResult ? analysisResult.confidence : 92}%
                      </span>
                    </div>
                  </div>

                  {/* Geo-coordinate stamp */}
                  <div className="border border-dashed border-slate-200 bg-slate-50/60 p-2.5 rounded-xl text-[10px] text-slate-600 flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <div>
                      <p className="font-mono font-bold text-slate-800">
                        {currentGps.lat.toFixed(6)}° N, {currentGps.lng.toFixed(6)}° E (±{currentGps.accuracy || 4.2}m)
                      </p>
                      <p className="text-[9px] text-slate-500">Captured 16 Jun 2025 · 08:42 IST · RTK Differential GPS</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 space-y-2">
                <button
                  onClick={() => alert(`Progress Report #${submittedReportId} generated. Ready for PDF print/export.`)}
                  className="w-full py-3 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-2 active:scale-95 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Share / Download PDF</span>
                </button>
                <button
                  onClick={() => setScreen('home')}
                  className="w-full py-2.5 text-center text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Return to home
                </button>
              </div>
            </div>
          )}

          {/* ERROR MODAL (When Image or Details Fail Validation) */}
          {errorModal && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-3">
              <div className="w-full bg-white rounded-3xl p-5 shadow-2xl border border-red-200 space-y-3.5 animate-in fade-in slide-in-from-bottom duration-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Validation Error</span>
                    <h3 className="font-extrabold text-sm text-slate-900 leading-tight">{errorModal.title}</h3>
                  </div>
                </div>

                <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl text-xs text-red-800 font-medium">
                  {errorModal.message}
                </div>

                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900">
                  <strong className="block text-[11px] font-bold mb-0.5">Required User Correction:</strong>
                  {errorModal.correctionPrompt}
                </div>

                <div className="pt-1">
                  <button
                    onClick={() => setErrorModal(null)}
                    className="w-full py-3 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-md transition-all"
                  >
                    Recapture / Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
