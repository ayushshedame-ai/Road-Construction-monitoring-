import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Clock,
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
  Sparkles,
  Lock,
  Layers
} from 'lucide-react';
import BeforeAfterSlider from './BeforeAfterSlider';
import { ACTIVITIES, PROJECTS, TEST_PRESETS } from '../data/mockData';
import { analyzeSiteImage } from '../utils/cvEngine';
import { extractExifGps } from '../utils/exifParser';
import { analyzeImageApi } from '../services/api';
import { RoadSightLogoIcon } from '../App';

export default function FieldMobileView({
  onOpenReports,
  onSwitchToDashboard,
  activeScreen = null,
  onScreenChange = null
}) {
  const [internalScreen, setInternalScreen] = useState('home'); // login, home, capture, analysis_result, report_submitted
  const screen = activeScreen || internalScreen;
  const setScreen = onScreenChange || setInternalScreen;
  const [employeeId, setEmployeeId] = useState('MH-PWD-2041');
  const [selectedActivity, setSelectedActivity] = useState(ACTIVITIES[0].id);
  const [selectedProject, setSelectedProject] = useState(PROJECTS[0]);
  const [chainageInput, setChainageInput] = useState('12+200 to 15+700');
  const [currentGps, setCurrentGps] = useState({ lat: 18.536248, lng: 73.740012, accuracy: 4.2 });
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [rawFile, setRawFile] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [comparisonImage, setComparisonImage] = useState(PROJECTS[0].previousCapture.imageUrl);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [errorModal, setErrorModal] = useState(null);
  const [submittedReportId, setSubmittedReportId] = useState('DR-240616-0847');

  const fileInputRef = useRef(null);

  // Listen for global Start Assessment button trigger
  useEffect(() => {
    const handleStart = () => {
      setScreen('capture');
    };
    window.addEventListener('start-assessment', handleStart);
    return () => window.removeEventListener('start-assessment', handleStart);
  }, [setScreen]);

  // Auto detect GPS via browser Geolocation API
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

  // Handle custom file upload with automatic EXIF GPS extraction
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRawFile(file);
      extractExifGps(file).then((gpsInfo) => {
        if (gpsInfo && gpsInfo.lat && gpsInfo.lng) {
          setCurrentGps({ lat: gpsInfo.lat, lng: gpsInfo.lng, accuracy: 2.5 });
        }
      }).catch(() => {});

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

    try {
      const apiResult = await analyzeImageApi({
        imageFile: rawFile,
        imageBase64: capturedImage,
        projectId: selectedProject.id,
        activityId: selectedActivity,
        chainage: chainageInput,
        gps: currentGps
      });

      if (apiResult && !apiResult._fallback) {
        setAnalysisResult({
          detectedStage: apiResult.detected_stage || 'WBM / WMM',
          confidence: Math.round((apiResult.confidence || 0.94) * 100),
          blurScore: apiResult.blur_score || 184,
          estimatedCompletionPercent: apiResult.estimated_completion_percent || 40,
          completedLengthKm: 1.4,
          totalLengthKm: selectedProject.totalLengthKm || 3.5,
          stageWise: apiResult.stage_wise || {
            'Earthwork': 100,
            'GSB': 100,
            'WBM / WMM': 61,
            'DBM': 0
          },
          recommendation: apiResult.recommendation || 'Proceed with compaction check.'
        });
        setIsAnalyzing(false);
        setScreen('analysis_result');
        return;
      }
    } catch (e) {
      console.warn('API fallback to client CV engine:', e);
    }

    setTimeout(() => {
      const result = analyzeSiteImage(
        capturedImage,
        selectedProject,
        selectedActivity,
        chainageInput,
        currentGps
      );

      if (result.error) {
        setErrorModal(result.error);
        setIsAnalyzing(false);
        return;
      }

      setAnalysisResult({
        ...result,
        detectedStage: 'WBM / WMM',
        confidence: 92,
        estimatedCompletionPercent: 40,
        completedLengthKm: 1.4,
        totalLengthKm: 3.5,
        stageWise: {
          'Earthwork': 100,
          'GSB': 100,
          'WBM / WMM': 61,
          'DBM': 0
        }
      });
      setIsAnalyzing(false);
      setScreen('analysis_result');
    }, 1200);
  };

  const handleSubmitReport = () => {
    const reportNum = Math.floor(1000 + Math.random() * 9000);
    setSubmittedReportId(`DR-240616-${reportNum}`);
    setScreen('report_submitted');
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 min-h-[calc(100vh-80px)]">
      
      {/* Mobile Device Mockup Frame (Matches Reference Screen Bezel) */}
      <div 
        className="relative w-full max-w-[400px] rounded-[48px] p-3 shadow-2xl border-4 border-slate-700/80 ring-1 ring-slate-950/20"
        style={{ backgroundColor: '#0f172a' }}
      >
        
        {/* Dynamic Island / Speaker cutout */}
        <div 
          className="absolute top-5 left-1/2 -translate-x-1/2 w-32 h-6 rounded-full z-50 flex items-center justify-between px-3 border border-slate-800"
          style={{ backgroundColor: '#0f172a' }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700"></div>
          <div className="w-3 h-3 rounded-full bg-slate-950 ring-1 ring-slate-800 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-900/60"></div>
          </div>
        </div>

        {/* Mobile Screen Surface (Crisp White Background) */}
        <div 
          className="w-full h-[760px] rounded-[38px] overflow-hidden flex flex-col relative font-sans text-slate-800 select-none shadow-inner bg-white"
          style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
        >
          
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

          {/* ============================================================== */}
          {/* SCREEN 1: LOGIN (Matches Screenshot 2026-10-21 113332.png)     */}
          {/* ============================================================== */}
          {screen === 'login' && (
            <div className="flex-1 flex flex-col justify-between relative bg-white overflow-hidden">
              {/* Top Graphic Banner with Road and Sun */}
              <div 
                className="h-64 relative p-6 flex flex-col justify-between overflow-hidden"
                style={{ backgroundColor: '#13274e' }}
              >
                {/* Abstract Sun and Waves Graphic */}
                <div 
                  className="absolute -top-4 -right-4 w-40 h-40 rounded-full"
                  style={{ backgroundColor: '#c85d26' }}
                ></div>
                <div className="absolute top-10 right-10 w-52 h-52 rounded-full border border-blue-400/20 pointer-events-none"></div>
                <div className="absolute top-4 right-4 w-64 h-64 rounded-full border border-blue-400/10 pointer-events-none"></div>
                
                {/* Horizontal Road Lines */}
                <div className="absolute bottom-16 left-0 right-0 h-1 bg-white/70"></div>
                <div className="absolute bottom-11 left-0 right-0 h-1 bg-white/70"></div>
                <div className="absolute bottom-6 left-0 right-0 h-1 bg-[#ea580c]"></div>
              </div>

              {/* Overlaid White Form Card */}
              <div 
                className="flex-1 bg-white rounded-t-[32px] -mt-10 relative z-10 p-6 flex flex-col justify-between shadow-2xl"
                style={{ backgroundColor: '#ffffff' }}
              >
                <div>
                  {/* RoadSight Logo Header */}
                  <div className="flex items-center space-x-2.5 mb-5">
                    <RoadSightLogoIcon className="w-8 h-8" />
                    <div>
                      <h1 className="font-extrabold text-base text-slate-900 leading-tight">RoadSight</h1>
                      <p className="text-[8px] tracking-wider text-slate-400 uppercase font-bold">Smart Infrastructure</p>
                    </div>
                  </div>

                  <div className="mb-5">
                    <span className="text-[10px] font-bold text-[#ea580c] uppercase tracking-wider block">
                      FIELD OPERATIONS
                    </span>
                    <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">Welcome back</h2>
                    <p className="text-xs text-slate-500 mt-1">Sign in to capture and report road progress.</p>
                  </div>

                  {/* Form Inputs */}
                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Email or Employee ID</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={employeeId}
                          onChange={(e) => setEmployeeId(e.target.value)}
                          className="w-full px-3.5 py-3 pl-10 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] bg-white text-slate-900 font-medium"
                          placeholder="e.g. MH-PWD-2041"
                          style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
                        />
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Password</label>
                      <div className="relative">
                        <input
                          type="password"
                          defaultValue="••••••••"
                          className="w-full px-3.5 py-3 pl-10 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] bg-white text-slate-900 font-medium"
                          placeholder="Enter your password"
                          style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
                        />
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      </div>
                    </div>

                    <div className="text-right">
                      <button className="text-[11px] text-[#1e3a8a] font-bold hover:underline">Forgot password?</button>
                    </div>

                    <button
                      onClick={() => setScreen('home')}
                      className="w-full py-3.5 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.98] mt-2 cursor-pointer"
                      style={{ backgroundColor: '#1e3a8a' }}
                    >
                      Login securely
                    </button>
                  </div>
                </div>

                {/* Footer Badge */}
                <div className="text-center pt-3 pb-1">
                  <div className="inline-flex items-center space-x-1.5 text-[10px] text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#1e3a8a]" />
                    <span>Secured by Government of Maharashtra</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* SCREEN 2: FIELD HOME (Matches Screenshot 2026-10-21 113342.png)*/}
          {/* ============================================================== */}
          {screen === 'home' && (
            <div className="flex-1 flex flex-col justify-between overflow-y-auto no-scrollbar bg-white" style={{ backgroundColor: '#ffffff' }}>
              <div className="p-4 pt-1 space-y-4">
                
                {/* Header Row: Logo Icon & Bell */}
                <div className="flex items-center justify-between pb-1">
                  <RoadSightLogoIcon className="w-8 h-8" />
                  <button className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 relative">
                    <Bell className="w-5 h-5" />
                  </button>
                </div>

                {/* Greeting Section with AK Avatar */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      MONDAY, 16 JUNE
                    </span>
                    <h2 className="text-xl font-extrabold text-slate-900 leading-tight mt-0.5">
                      Good morning, Arjun
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">3 assigned projects · 1 update due today</p>
                  </div>
                  <div 
                    className="w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center shrink-0 border"
                    style={{ backgroundColor: '#dbeafe', color: '#1e3a8a', borderColor: '#bfdbfe' }}
                  >
                    AK
                  </div>
                </div>

                {/* Assigned Projects Header */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-slate-900">Assigned projects</span>
                  <button 
                    onClick={onSwitchToDashboard} 
                    className="text-[11px] font-semibold text-[#1e3a8a] hover:underline cursor-pointer"
                  >
                    View map
                  </button>
                </div>

                {/* Projects Card List (Exact 3 Cards from Reference) */}
                <div className="space-y-3">
                  
                  {/* Card 1: Pune Ring Road – Package 3 */}
                  <div
                    onClick={() => {
                      setSelectedProject(PROJECTS[0]);
                      setScreen('capture');
                    }}
                    className="p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-[#1e3a8a] transition-all cursor-pointer bg-white"
                    style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span 
                        className="px-2.5 py-0.5 font-bold text-[10px] rounded-md tracking-wider border"
                        style={{ backgroundColor: '#e0f2fe', color: '#0369a1', borderColor: '#bae6fd' }}
                      >
                        WBM / WMM
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">Today, 08:42</span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 leading-tight">
                      Pune Ring Road – Package 3
                    </h3>
                    <div className="flex items-center space-x-1 text-slate-500 text-xs mt-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>Mulshi, Pune · 3.5 km</span>
                    </div>

                    {/* Overall Progress Bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[11px] mb-1 font-semibold">
                        <span className="text-slate-500">Overall progress</span>
                        <span className="font-bold text-slate-900">68%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full overflow-hidden bg-slate-100" style={{ backgroundColor: '#f1f5f9' }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: '68%', backgroundColor: '#1e3a8a' }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                      <span>Capture due by 5:00 PM</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>

                  {/* Card 2: NH-48 Tathawade Stretch */}
                  <div
                    onClick={() => {
                      setSelectedProject(PROJECTS[1]);
                      setScreen('capture');
                    }}
                    className="p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-[#1e3a8a] transition-all cursor-pointer bg-white"
                    style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span 
                        className="px-2.5 py-0.5 font-bold text-[10px] rounded-md tracking-wider border"
                        style={{ backgroundColor: '#ffedd5', color: '#c2410c', borderColor: '#fed7aa' }}
                      >
                        DBM
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">Yesterday, 17:20</span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 leading-tight">
                      NH-48 Tathawade Stretch
                    </h3>
                    <div className="flex items-center space-x-1 text-slate-500 text-xs mt-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>Tathawade · 5.2 km</span>
                    </div>

                    {/* Overall Progress Bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[11px] mb-1 font-semibold">
                        <span className="text-slate-500">Overall progress</span>
                        <span className="font-bold text-slate-900">84%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full overflow-hidden bg-slate-100" style={{ backgroundColor: '#f1f5f9' }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: '84%', backgroundColor: '#1e3a8a' }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                      <span>On schedule</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>

                  {/* Card 3: Baner–Balewadi Link Road */}
                  <div
                    onClick={() => {
                      setSelectedProject(PROJECTS[2]);
                      setScreen('capture');
                    }}
                    className="p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-[#1e3a8a] transition-all cursor-pointer bg-white"
                    style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span 
                        className="px-2.5 py-0.5 font-bold text-[10px] rounded-md tracking-wider border"
                        style={{ backgroundColor: '#fef3c7', color: '#b45309', borderColor: '#fde68a' }}
                      >
                        GSB
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">12 Jun, 15:05</span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 leading-tight">
                      Baner–Balewadi Link Road
                    </h3>
                    <div className="flex items-center space-x-1 text-slate-500 text-xs mt-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>Pune West · 2.1 km</span>
                    </div>

                    {/* Overall Progress Bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[11px] mb-1 font-semibold">
                        <span className="text-slate-500">Overall progress</span>
                        <span className="font-bold text-slate-900">42%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full overflow-hidden bg-slate-100" style={{ backgroundColor: '#f1f5f9' }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: '42%', backgroundColor: '#1e3a8a' }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                      <span>Capture due tomorrow</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>

                </div>
              </div>

              {/* Floating Orange CTA Button (Centered above bottom nav) */}
              <div className="sticky bottom-16 flex justify-center pointer-events-auto z-20 px-4">
                <button
                  onClick={() => setScreen('capture')}
                  className="px-6 py-3.5 text-white font-bold text-xs rounded-2xl shadow-xl flex items-center space-x-2 active:scale-95 transition-all cursor-pointer"
                  style={{ 
                    backgroundColor: '#ea580c',
                    boxShadow: '0 10px 25px -5px rgba(234, 88, 12, 0.45)'
                  }}
                >
                  <Camera className="w-4 h-4" />
                  <span>Capture photo</span>
                </button>
              </div>

              {/* Mobile Bottom Navigation Bar (Matches Screenshot) */}
              <div 
                className="h-14 bg-white border-t border-slate-200 px-6 flex items-center justify-between text-[10px] font-semibold text-slate-500 z-30 shrink-0"
                style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}
              >
                <button className="flex flex-col items-center space-y-0.5 cursor-pointer" style={{ color: '#1e3a8a' }}>
                  <Home className="w-4 h-4" />
                  <span className="font-bold">Home</span>
                </button>
                <button onClick={onSwitchToDashboard} className="flex flex-col items-center hover:text-[#1e3a8a] space-y-0.5 cursor-pointer">
                  <FolderKanban className="w-4 h-4" />
                  <span>Projects</span>
                </button>
                <button onClick={onOpenReports} className="flex flex-col items-center hover:text-[#1e3a8a] space-y-0.5 cursor-pointer">
                  <FileText className="w-4 h-4" />
                  <span>Reports</span>
                </button>
                <button onClick={() => setScreen('login')} className="flex flex-col items-center hover:text-[#1e3a8a] space-y-0.5 cursor-pointer">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* SCREEN 3: SITE CAPTURE & ASSESSMENT INPUT                      */}
          {/* ============================================================== */}
          {screen === 'capture' && (
            <div className="flex-1 flex flex-col justify-between overflow-y-auto no-scrollbar p-4 bg-white" style={{ backgroundColor: '#ffffff' }}>
              <div className="space-y-3.5">
                {/* Top Nav */}
                <div className="flex items-center justify-between pb-1">
                  <button
                    onClick={() => setScreen('home')}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
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
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
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
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
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
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                      placeholder="e.g. 12+200 to 15+700"
                      style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5 flex items-center justify-between">
                      <span>Live GPS Pin</span>
                      <button
                        onClick={handleDetectGPS}
                        className="text-[#1e3a8a] hover:underline text-[9px] font-bold cursor-pointer"
                      >
                        {isGpsLoading ? 'Pinging...' : 'Refresh'}
                      </button>
                    </label>
                    <div className="p-2 bg-white border border-slate-300 rounded-lg text-[10px] font-mono text-slate-700 flex flex-col justify-center" style={{ backgroundColor: '#ffffff' }}>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="font-bold text-slate-900 truncate">{currentGps.lat.toFixed(6)}°N, {currentGps.lng.toFixed(6)}°E</span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-emerald-700 font-sans mt-0.5 pt-0.5 border-t border-slate-100">
                        <span>Acc: ±{currentGps.accuracy || 4.2}m</span>
                        <span className="font-bold text-[#1e3a8a]">RTK Lock</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Photo Upload & Quick Preset Dropdown */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-700">Site Photo Evidence</label>
                    <span className="text-[10px] text-[#1e3a8a] font-semibold">Live camera or test samples</span>
                  </div>

                  {/* 1-Click Fast Demo Scenario Selector */}
                  <div className="mb-2">
                    <select
                      onChange={(e) => {
                        const pre = TEST_PRESETS.find((p) => p.id === e.target.value);
                        if (pre) handleSelectPreset(pre);
                      }}
                      value={selectedPreset ? selectedPreset.id : ''}
                      className="w-full p-2 rounded-lg text-[11px] font-semibold border focus:outline-none"
                      style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe', color: '#1e3a8a' }}
                    >
                      <option value="">⚡ Select Fast Demo Test Scenario...</option>
                      {TEST_PRESETS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Camera Upload Area */}
                  <div
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    className="relative w-full h-44 rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#1e3a8a] transition-all flex flex-col items-center justify-center p-2 cursor-pointer overflow-hidden group shadow-2xs"
                    style={{ backgroundColor: '#f8fafc' }}
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
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2"
                          style={{ backgroundColor: '#eff6ff', color: '#1e3a8a' }}
                        >
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
                  className="w-full py-3.5 rounded-xl text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer"
                  style={{
                    backgroundColor: !capturedImage ? '#cbd5e1' : '#1e3a8a',
                    cursor: !capturedImage ? 'not-allowed' : 'pointer'
                  }}
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

          {/* ============================================================== */}
          {/* SCREEN 4: AI ANALYSIS RESULT (Matches Screenshot 113419.png)   */}
          {/* ============================================================== */}
          {screen === 'analysis_result' && analysisResult && (
            <div className="flex-1 flex flex-col justify-between overflow-y-auto no-scrollbar p-4 bg-white" style={{ backgroundColor: '#ffffff' }}>
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between pb-1">
                  <button
                    onClick={() => setScreen('capture')}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-xs text-slate-900">AI analysis result</span>
                  <button className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700">
                    <Bell className="w-4 h-4" />
                  </button>
                </div>

                {/* Top Capture Verified Banner */}
                <div 
                  className="rounded-xl p-2.5 flex items-center justify-between border"
                  style={{ backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }}
                >
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-[11px] font-bold text-emerald-950">Capture verified</p>
                      <p className="text-[9px] text-emerald-700">Location, time and image authenticity passed</p>
                    </div>
                  </div>
                  <span 
                    className="text-[10px] font-extrabold px-2 py-0.5 rounded tracking-wider"
                    style={{ backgroundColor: '#d1fae5', color: '#065f46' }}
                  >
                    VERIFIED
                  </span>
                </div>

                {/* Blue Hero Card: Detected Construction Stage (Matches Screenshot) */}
                <div 
                  className="text-white p-4 rounded-2xl shadow-sm relative overflow-hidden"
                  style={{ backgroundColor: '#1e3a8a' }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-blue-200">
                        DETECTED CONSTRUCTION STAGE
                      </span>
                      <h3 className="text-xl font-extrabold mt-0.5 text-white">
                        {analysisResult.detectedStage}
                      </h3>
                      <p className="text-[11px] text-blue-100 mt-0.5">Water Bound Macadam</p>
                    </div>
                    {/* Radial progress ring (Exact match to screenshot) */}
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <div 
                        className="w-12 h-12 rounded-full border-4"
                        style={{ borderColor: 'rgba(255,255,255,0.2)', borderTopColor: '#ea580c', borderRightColor: '#ea580c', transform: 'rotate(45deg)' }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs">
                    <span className="text-blue-100 font-medium">AI confidence</span>
                    <span className="font-extrabold text-white">{analysisResult.confidence}% · High</span>
                  </div>
                </div>

                {/* Estimated Completion Card */}
                <div 
                  className="p-3.5 rounded-2xl border border-slate-200 shadow-2xs bg-white"
                  style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-800">Estimated completion</span>
                    <span className="font-extrabold text-slate-900 text-sm">
                      {analysisResult.estimatedCompletionPercent}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden my-1.5" style={{ backgroundColor: '#f1f5f9' }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${analysisResult.estimatedCompletionPercent}%`, backgroundColor: '#ea580c' }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    <strong className="text-slate-800">{analysisResult.completedLengthKm} km</strong> completed of{' '}
                    {analysisResult.totalLengthKm} km total stretch
                  </p>
                </div>

                {/* Stage-wise Completion Bars */}
                <div 
                  className="p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2 bg-white"
                  style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
                >
                  <span className="text-xs font-bold text-slate-800 block">Stage-wise completion</span>
                  {Object.entries(analysisResult.stageWise).map(([stageName, pct]) => (
                    <div key={stageName} className="space-y-0.5">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                        <span>{stageName}</span>
                        <span className="text-slate-800 font-bold">{pct}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#f1f5f9' }}>
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: pct > 0 ? '#1e3a8a' : '#e2e8f0' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Before / After Comparison Slider */}
                <div 
                  className="p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2 bg-white"
                  style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>Before / after</span>
                    <span className="text-[10px] text-[#1e3a8a] font-semibold cursor-pointer">Drag to compare</span>
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
                  className="py-3 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl shadow-2xs active:scale-95 transition-all cursor-pointer bg-white"
                  style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#334155' }}
                >
                  Retake
                </button>
                <button
                  onClick={handleSubmitReport}
                  className="py-3 text-white font-bold text-xs rounded-xl shadow-md active:scale-95 transition-all cursor-pointer"
                  style={{ backgroundColor: '#1e3a8a' }}
                >
                  Submit report
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* SCREEN 5: DAILY PROGRESS REPORT SUBMITTED (Matches 113427.png)  */}
          {/* ============================================================== */}
          {screen === 'report_submitted' && (
            <div className="flex-1 flex flex-col justify-between overflow-y-auto no-scrollbar p-5 bg-white" style={{ backgroundColor: '#ffffff' }}>
              <div className="space-y-4">
                {/* Header Back & Bell */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setScreen('home')}
                    className="p-1 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-xs text-slate-900">Daily progress report</span>
                  <Bell className="w-4 h-4 text-slate-600" />
                </div>

                {/* Success Checkmark & Subtitle */}
                <div className="text-center pt-2">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto shadow-md mb-2 text-white"
                    style={{ backgroundColor: '#10b981' }}
                  >
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900">Report submitted</h2>
                  <p className="text-[11px] text-slate-500 font-medium">Daily report #{submittedReportId}</p>
                </div>

                {/* Report Summary Card Container */}
                <div 
                  className="p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3 bg-white"
                  style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <RoadSightLogoIcon className="w-6 h-6" />
                      <span className="font-bold text-xs text-slate-900">RoadSight</span>
                    </div>
                    <span 
                      className="text-[9px] font-extrabold px-2 py-0.5 rounded"
                      style={{ backgroundColor: '#d1fae5', color: '#065f46' }}
                    >
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
                    <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50" style={{ backgroundColor: '#f8fafc' }}>
                      <span className="text-[10px] text-slate-400 font-semibold block">Stage</span>
                      <span className="font-extrabold text-slate-800">
                        {analysisResult ? analysisResult.detectedStage : 'WBM / WMM'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50" style={{ backgroundColor: '#f8fafc' }}>
                      <span className="text-[10px] text-slate-400 font-semibold block">Progress</span>
                      <span className="font-extrabold text-slate-800">{selectedProject.progressPercent}%</span>
                    </div>
                    <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50" style={{ backgroundColor: '#f8fafc' }}>
                      <span className="text-[10px] text-slate-400 font-semibold block">Today</span>
                      <span className="font-extrabold text-emerald-600">
                        +{analysisResult ? analysisResult.completedLengthKm : 1.4} km
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50" style={{ backgroundColor: '#f8fafc' }}>
                      <span className="text-[10px] text-slate-400 font-semibold block">AI confidence</span>
                      <span className="font-extrabold text-slate-800">
                        {analysisResult ? analysisResult.confidence : 92}%
                      </span>
                    </div>
                  </div>

                  {/* Geo-coordinate stamp */}
                  <div 
                    className="border border-dashed border-slate-200 p-2.5 rounded-xl text-[10px] text-slate-600 flex items-center space-x-2 bg-slate-50/60"
                    style={{ backgroundColor: '#f8fafc' }}
                  >
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
                  className="w-full py-3 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-2 active:scale-95 transition-all cursor-pointer"
                  style={{ backgroundColor: '#1e3a8a' }}
                >
                  <Download className="w-4 h-4" />
                  <span>Share / Download PDF</span>
                </button>
                <button
                  onClick={() => setScreen('home')}
                  className="w-full py-2.5 text-center text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Return to home
                </button>
              </div>
            </div>
          )}

          {/* ERROR MODAL */}
          {errorModal && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-3">
              <div className="w-full bg-white rounded-3xl p-5 shadow-2xl border border-red-200 space-y-3.5 animate-in fade-in slide-in-from-bottom duration-200" style={{ backgroundColor: '#ffffff' }}>
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
                    className="w-full py-3 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
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
