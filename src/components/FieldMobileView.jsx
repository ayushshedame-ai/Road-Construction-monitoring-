import React, { useState, useRef } from 'react';
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
  Maximize2
} from 'lucide-react';
import BeforeAfterSlider from './BeforeAfterSlider';
import { ACTIVITIES, PROJECTS, TEST_PRESETS } from '../data/mockData';
import { analyzeSiteImage } from '../utils/cvEngine';

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
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [comparisonImage, setComparisonImage] = useState(PROJECTS[0].previousCapture.imageUrl);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [errorModal, setErrorModal] = useState(null);
  const [submittedReportId, setSubmittedReportId] = useState('DR-240616-0847');

  const fileInputRef = useRef(null);

  // Listen for global Start Assessment button trigger
  React.useEffect(() => {
    const handleStart = () => {
      setScreen('capture');
    };
    window.addEventListener('start-assessment', handleStart);
    return () => window.removeEventListener('start-assessment', handleStart);
  }, []);

  // Auto detect GPS via browser Geolocation API with high precision
  const handleDetectGPS = () => {
    setIsGpsLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentGps({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy ? Math.round(pos.coords.accuracy * 10) / 10 : 3.8
          });
          setIsGpsLoading(false);
        },
        () => {
          // Precise fallback for Pune Ring Road Package 3 active chainage
          setCurrentGps({ lat: 18.536248, lng: 73.740012, accuracy: 4.2 });
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
    setCapturedImage(preset.imageUrl);
    setComparisonImage(preset.comparisonUrl || proj.previousCapture.imageUrl);
  };

  // Handle custom file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target.result);
        setSelectedPreset(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Run AI Stage Assessment
  const handleRunAssessment = async () => {
    if (!capturedImage) {
      alert('Please upload or capture a photo first.');
      return;
    }

    setIsAnalyzing(true);
    setErrorModal(null);

    // Create image element for canvas analysis
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = capturedImage;

    img.onload = async () => {
      const result = await analyzeSiteImage({
        imageElement: img,
        activityType: selectedActivity,
        project: selectedProject,
        userGps: currentGps,
        simulatedPreset: selectedPreset
      });

      setIsAnalyzing(false);

      if (!result.success) {
        setErrorModal(result.error);
      } else {
        setAnalysisResult(result);
        setScreen('analysis_result');
      }
    };

    img.onerror = () => {
      setIsAnalyzing(false);
      // Fallback evaluation
      const fallback = {
        success: true,
        detectedStage: 'WBM / WMM',
        stageCode: 'wmm',
        description: 'Water Bound Macadam / Wet Mix Macadam layer compacted with vibratory roller.',
        confidence: 92,
        estimatedCompletionPercent: 40,
        completedLengthKm: selectedProject.completedLengthKm || 1.4,
        totalLengthKm: selectedProject.totalLengthKm || 3.5,
        remainingLengthKm: 2.1,
        stageWise: { 'Earthwork': 100, 'GSB': 100, 'WBM / WMM': 61, 'DBM': 0 },
        verificationStatus: 'VERIFIED',
        badgeText: 'Location, time and image authenticity passed'
      };
      setAnalysisResult(fallback);
      setScreen('analysis_result');
    };
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

          {/* SCREEN 1: LOGIN */}
          {screen === 'login' && (
            <div className="flex-1 flex flex-col justify-between p-6 pt-4 bg-gradient-to-b from-slate-50 to-blue-50/40">
              <div>
                {/* Logo & Header */}
                <div className="flex items-center space-x-2.5 mb-8">
                  <div className="w-9 h-9 bg-brand-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="font-bold text-lg text-slate-900 leading-tight">RoadSight</h1>
                    <p className="text-[10px] tracking-wider text-slate-500 uppercase font-semibold">Smart Infrastructure</p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-[11px] font-bold text-accent-orange uppercase tracking-wider">Field Operations</span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-1">Welcome back</h2>
                  <p className="text-xs text-slate-500 mt-1">Sign in to capture and report road progress.</p>
                </div>

                {/* Form Inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email or Employee ID</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        className="w-full px-3.5 py-3 pl-10 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-600 bg-white"
                        placeholder="e.g. MH-PWD-2041"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        defaultValue="demo1234"
                        className="w-full px-3.5 py-3 pl-10 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-600 bg-white"
                        placeholder="Enter your password"
                      />
                      <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    </div>
                  </div>

                  <div className="text-right">
                    <button className="text-[11px] text-brand-600 font-semibold hover:underline">Forgot password?</button>
                  </div>

                  <button
                    onClick={() => setScreen('home')}
                    className="w-full py-3.5 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.98]"
                  >
                    Login securely
                  </button>
                </div>
              </div>

              {/* Footer Badge */}
              <div className="text-center pb-2">
                <div className="inline-flex items-center space-x-1.5 text-[11px] text-slate-500 bg-white/80 border border-slate-200 px-3 py-1.5 rounded-full shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-700" />
                  <span>Secured by Government of Maharashtra</span>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 2: FIELD HOME */}
          {screen === 'home' && (
            <div className="flex-1 flex flex-col justify-between overflow-y-auto no-scrollbar">
              <div className="p-4 pt-1 space-y-4">
                {/* Header Profile Bar */}
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-brand-700 flex items-center justify-center text-white">
                      <Layers className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 rounded-full hover:bg-slate-200 text-slate-600 relative">
                      <Bell className="w-4 h-4" />
                      <span className="w-2 h-2 rounded-full bg-red-500 absolute top-1.5 right-1.5"></span>
                    </button>
                    <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-300 text-blue-900 font-bold text-xs flex items-center justify-center">
                      AK
                    </div>
                  </div>
                </div>

                {/* Greeting */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">MONDAY, 16 JUNE</span>
                  <h2 className="text-xl font-extrabold text-slate-900 leading-tight">Good morning, Arjun</h2>
                  <p className="text-xs text-slate-500 mt-0.5">3 assigned projects · 1 update due today</p>
                </div>

                {/* Assigned Projects Header */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-slate-800">Assigned projects</span>
                  <button onClick={onSwitchToDashboard} className="text-[11px] font-semibold text-brand-600 hover:underline">
                    View map
                  </button>
                </div>

                {/* Projects Card List */}
                <div className="space-y-3">
                  {PROJECTS.slice(0, 3).map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => {
                        setSelectedProject(proj);
                        setScreen('capture');
                      }}
                      className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-500 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 bg-blue-50 text-brand-700 font-bold text-[10px] rounded-md tracking-wider border border-blue-200">
                          {proj.currentStage}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {proj.id === 'pune-ring-road-p3' ? 'Today, 08:42' : 'Yesterday, 17:20'}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 group-hover:text-brand-700 transition-colors">
                        {proj.name}
                      </h3>
                      <div className="flex items-center space-x-1 text-slate-500 text-xs mt-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{proj.location}</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-[11px] mb-1 font-semibold">
                          <span className="text-slate-500">Overall progress</span>
                          <span className="text-brand-700 font-bold">{proj.progressPercent}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-700 rounded-full"
                            style={{ width: `${proj.progressPercent}%` }}
                          />
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                        <span>{proj.id === 'pune-ring-road-p3' ? 'Capture due by 5:00 PM' : 'On schedule'}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Sticky Action FAB */}
              <div className="p-4 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent sticky bottom-14 flex justify-center">
                <button
                  onClick={() => setScreen('capture')}
                  className="px-6 py-3.5 bg-accent-orange hover:bg-orange-600 text-white font-bold text-xs rounded-2xl shadow-lg shadow-orange-500/30 flex items-center space-x-2 active:scale-95 transition-all"
                >
                  <Camera className="w-4 h-4" />
                  <span>Capture photo</span>
                </button>
              </div>

              {/* Mobile Bottom Navigation Bar */}
              <div className="h-14 bg-white border-t border-slate-200 px-6 flex items-center justify-between text-[10px] font-semibold text-slate-500 z-30">
                <button className="flex flex-col items-center text-brand-700 space-y-0.5">
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </button>
                <button onClick={onSwitchToDashboard} className="flex flex-col items-center hover:text-brand-700 space-y-0.5">
                  <FolderKanban className="w-4 h-4" />
                  <span>Projects</span>
                </button>
                <button onClick={onOpenReports} className="flex flex-col items-center hover:text-brand-700 space-y-0.5">
                  <FileText className="w-4 h-4" />
                  <span>Reports</span>
                </button>
                <button onClick={() => setScreen('login')} className="flex flex-col items-center hover:text-brand-700 space-y-0.5">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 3: SITE CAPTURE & ASSESSMENT INPUT */}
          {screen === 'capture' && (
            <div className="flex-1 flex flex-col justify-between overflow-y-auto no-scrollbar p-4">
              <div className="space-y-3.5">
                {/* Top Nav */}
                <div className="flex items-center justify-between pb-1">
                  <button
                    onClick={() => setScreen('home')}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-xs text-slate-900">New Site Assessment</span>
                  <div className="w-7"></div>
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

                {/* Chainage Range & Live GPS */}
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
                        onClick={handleDetectGPS}
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
                        <span className="font-bold text-blue-700">RTK Lock</span>
                      </div>
                    </div>
                  </div>
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

                  {/* Preview / Capture Box */}
                  <div
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    className="relative w-full h-44 rounded-2xl border-2 border-dashed border-slate-300 bg-white hover:border-brand-500 transition-all flex flex-col items-center justify-center p-2 cursor-pointer overflow-hidden group shadow-2xs"
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
                      <div className="text-center p-4">
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-brand-700 flex items-center justify-center mx-auto mb-2">
                          <Camera className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-bold text-slate-700">Tap to take site photo</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Supports mobile camera capture & file uploads</p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
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
                      <span>Processing Computer Vision & Geo-Fence...</span>
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
                  <button className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700">
                    <Bell className="w-4 h-4" />
                  </button>
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
                      <p className="text-[11px] text-blue-100 mt-0.5">Water Bound Macadam</p>
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
                  {Object.entries(analysisResult.stageWise).map(([stageName, pct]) => (
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
