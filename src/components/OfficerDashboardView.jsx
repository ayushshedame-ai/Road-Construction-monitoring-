import React, { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  AlertTriangle,
  FileText,
  Settings,
  Search,
  Bell,
  Download,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  Layers,
  ChevronRight,
  ExternalLink,
  Check,
  AlertCircle,
  X,
  FileSpreadsheet,
  Printer,
  ChevronDown
} from 'lucide-react';
import ProjectMap from './ProjectMap';
import { PROJECTS, ALERTS, REPORTS } from '../data/mockData';
import { RoadSightLogoIcon } from '../App';

export default function OfficerDashboardView({ onSwitchToMobile }) {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, project_detail, alerts, reports, verification_queue
  const [selectedProject, setSelectedProject] = useState(PROJECTS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [alertFilter, setAlertFilter] = useState('ALL');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [reportFilterStage, setReportFilterStage] = useState('All stages');
  const [reportFilterProject, setReportFilterProject] = useState('All projects');
  const [inspectedReport, setInspectedReport] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);

  // Filtered reports
  const filteredReports = REPORTS.filter((r) => {
    if (reportFilterProject !== 'All projects' && r.project !== reportFilterProject) return false;
    if (reportFilterStage !== 'All stages' && !r.stage.includes(reportFilterStage)) return false;
    return true;
  });

  return (
    <div className="flex h-[calc(100vh-68px)] overflow-hidden bg-slate-100 font-sans text-slate-800">
      
      {/* LEFT NAVIGATION SIDEBAR */}
      <aside className="w-64 bg-[#0d1f3d] text-slate-300 flex flex-col justify-between shrink-0 shadow-xl z-20">
        <div>
          {/* Brand Logo Header */}
          <div className="p-5 flex items-center space-x-3 border-b border-white/10">
            <RoadSightLogoIcon className="w-9 h-9" />
            <div>
              <h1 className="font-extrabold text-lg text-white leading-tight tracking-tight">RoadSight</h1>
              <p className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">SMART INFRASTRUCTURE</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-3 space-y-1.5 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-brand-700 text-white shadow-md'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => {
                setSelectedProject(PROJECTS[0]);
                setActiveTab('project_detail');
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'project_detail'
                  ? 'bg-brand-700 text-white shadow-md'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>Projects</span>
            </button>

            <button
              onClick={() => setActiveTab('alerts')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                activeTab === 'alerts'
                  ? 'bg-brand-700 text-white shadow-md'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Alerts</span>
              </div>
              <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                4
              </span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'reports'
                  ? 'bg-brand-700 text-white shadow-md'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Reports</span>
            </button>

            <button
              onClick={() => setActiveTab('verification_queue')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'verification_queue'
                  ? 'bg-brand-700 text-white shadow-md'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verification Queue</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer & User Profile */}
        <div className="p-4 border-t border-white/10 space-y-4">
          <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-xs">
            <div className="flex items-center space-x-2 text-white font-semibold mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Need assistance?</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">RoadSight support centre</p>
            <a
              href="#help"
              onClick={(e) => {
                e.preventDefault();
                alert('RoadSight Helpdesk: Dial 1800-120-4477 (Toll Free) or email support@roadsight.gov.in');
              }}
              className="text-[11px] font-bold text-blue-400 hover:text-blue-300 block"
            >
              View help guide &rarr;
            </a>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 font-bold text-xs flex items-center justify-center">
                SM
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white leading-tight">Sunita Mehta</p>
                <p className="text-[10px] text-slate-400">Monitoring Officer</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 sticky top-0 z-10 shadow-2xs">
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              {activeTab === 'dashboard' && 'Infrastructure overview'}
              {activeTab === 'project_detail' && `${selectedProject.name}`}
              {activeTab === 'alerts' && 'Alerts & anomalies'}
              {activeTab === 'reports' && 'Progress reports'}
              {activeTab === 'verification_queue' && 'Field Capture Verification Queue'}
            </h2>
            <p className="text-xs text-slate-500">
              Monday, 16 June 2025 · Pune Metropolitan Region (Urban Development Department)
            </p>
          </div>

          {/* Search, Notifications & Export */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects, locations..."
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-600 w-64"
              />
            </div>

            <button className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 relative">
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-red-500 absolute top-1.5 right-1.5"></span>
            </button>

            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export</span>
            </button>
          </div>
        </header>

        {/* VIEW 1: INFRASTRUCTURE OVERVIEW (DASHBOARD) */}
        {activeTab === 'dashboard' && (
          <div className="p-8 space-y-6">
            
            {/* 4 Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {/* Card 1: Total Projects */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Total Projects</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-700 flex items-center justify-center">
                    <FolderKanban className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold text-slate-900">124</span>
                  <span className="text-xs text-emerald-600 font-semibold">+8 this month</span>
                </div>
                <div className="mt-3 flex space-x-1 h-3 items-end">
                  <div className="w-1.5 h-2 bg-blue-200 rounded-2xs"></div>
                  <div className="w-1.5 h-3 bg-blue-300 rounded-2xs"></div>
                  <div className="w-1.5 h-2 bg-blue-200 rounded-2xs"></div>
                  <div className="w-1.5 h-3 bg-brand-600 rounded-2xs"></div>
                </div>
              </div>

              {/* Card 2: On Track */}
              <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-2xs hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800">On Track</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold text-slate-900">89</span>
                  <span className="text-xs text-emerald-600 font-semibold">71.8% of total</span>
                </div>
                <div className="mt-3 w-full bg-emerald-100 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[71.8%]"></div>
                </div>
              </div>

              {/* Card 3: Delayed */}
              <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-2xs hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800">Delayed</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold text-slate-900">27</span>
                  <span className="text-xs text-amber-600 font-semibold">4 need attention</span>
                </div>
                <div className="mt-3 w-full bg-amber-100 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-[21.7%]"></div>
                </div>
              </div>

              {/* Card 4: Fraud Alerts */}
              <div className="bg-white p-5 rounded-2xl border border-red-200 shadow-2xs hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-800">Fraud Alerts</span>
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold text-slate-900">8</span>
                  <span className="text-xs text-red-600 font-semibold">3 new today</span>
                </div>
                <div className="mt-3 w-full bg-red-100 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full w-[12%]"></div>
                </div>
              </div>
            </div>

            {/* Live Map & Project Status Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left 2 Cols: Interactive Leaflet GIS Map */}
              <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">Live project map</h3>
                    <p className="text-xs text-slate-500">124 active road construction projects</p>
                  </div>
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="inline-flex items-center space-x-1.5 text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <span>On track</span>
                    </span>
                    <span className="inline-flex items-center space-x-1.5 text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <span>Delayed</span>
                    </span>
                    <span className="inline-flex items-center space-x-1.5 text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                      <span>Anomaly</span>
                    </span>
                  </div>
                </div>

                <ProjectMap
                  projects={PROJECTS}
                  onSelectProject={(proj) => {
                    setSelectedProject(proj);
                    setActiveTab('project_detail');
                  }}
                  height="460px"
                  zoom={12}
                />
              </div>

              {/* Right 1 Col: Project Status Sidebar */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">Project status</h3>
                      <p className="text-[11px] text-slate-500">Updated in real time</p>
                    </div>
                    <Settings className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600" />
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl mb-4 text-xs font-semibold">
                    <button className="flex-1 py-1.5 rounded-lg bg-white text-brand-700 shadow-2xs text-center">
                      All 124
                    </button>
                    <button className="flex-1 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 text-center">
                      Attention 35
                    </button>
                    <button className="flex-1 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 text-center">
                      Completed 16
                    </button>
                  </div>

                  {/* Project Cards List */}
                  <div className="space-y-3">
                    {PROJECTS.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSelectedProject(p);
                          setActiveTab('project_detail');
                        }}
                        className="p-3.5 rounded-xl border border-slate-200 hover:border-brand-500 bg-slate-50/50 hover:bg-white transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <h4 className="font-bold text-xs text-slate-900 group-hover:text-brand-700">
                            {p.name}
                          </h4>
                          <span
                            className={`text-[9px] font-extrabold px-2 py-0.5 rounded tracking-wider ${
                              p.status === 'ON TRACK'
                                ? 'bg-emerald-100 text-emerald-800'
                                : p.status === 'DELAYED'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mb-2">{p.location}</p>
                        
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1">
                          <span className="text-[10px] text-brand-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                            {p.currentStage}
                          </span>
                          <span>{p.progressPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-brand-700 h-full rounded-full"
                            style={{ width: `${p.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('project_detail')}
                  className="w-full mt-4 py-2.5 text-center text-xs font-bold text-brand-700 hover:text-brand-900 hover:underline block"
                >
                  View all projects &rarr;
                </button>
              </div>

            </div>
          </div>
        )}

        {/* VIEW 2: PROJECT DETAIL VIEW (Matches Screenshot 113457.png) */}
        {activeTab === 'project_detail' && selectedProject && (
          <div className="p-8 space-y-6">
            
            {/* Top Detail Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-extrabold px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                    {selectedProject.status}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded">
                    {selectedProject.currentStage} stage
                  </span>
                  <span className="text-xs text-slate-500">Contractor: {selectedProject.contractor}</span>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900">{selectedProject.name}</h2>
                <p className="text-xs text-slate-500 mt-0.5">Project {selectedProject.code} · {selectedProject.location}</p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setActiveTab('verification_queue')}
                  className="px-4 py-2.5 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-2"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Open verification queue</span>
                </button>
              </div>
            </div>

            {/* 4 KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 font-semibold">Overall progress</span>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">{selectedProject.progressPercent}%</p>
                <span className="text-[11px] text-emerald-600 font-semibold">+4.2% this week</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 font-semibold">Completed stretch</span>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">{selectedProject.completedLengthKm} km</p>
                <span className="text-[11px] text-slate-500">of {selectedProject.totalLengthKm} km total</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 font-semibold">Contract deadline</span>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">{selectedProject.contractDeadline}</p>
                <span className="text-[11px] text-slate-500">{selectedProject.daysRemaining} days remaining</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 font-semibold">Last site capture</span>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">{selectedProject.lastCaptureTime}</p>
                <span className="text-[11px] text-emerald-600 font-semibold">GPS verified</span>
              </div>
            </div>

            {/* Road Stretch Progress & Stage Progress Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left 2 Cols: Road stretch GIS chainage */}
              <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">Road stretch progress</h3>
                    <p className="text-xs text-slate-500">Chainage {selectedProject.chainage}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-brand-700 border border-blue-200 rounded">
                    GPS VERIFIED
                  </span>
                </div>

                {/* Map with green completed line & gray remaining */}
                <ProjectMap
                  selectedProject={selectedProject}
                  detailMode={true}
                  height="340px"
                  zoom={14}
                />

                {/* Pill Badges */}
                <div className="flex items-center space-x-3 pt-1">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 font-bold text-xs rounded-full">
                    COMPLETED · {selectedProject.completedLengthKm} KM
                  </span>
                  <span className="px-3 py-1 bg-slate-800 text-white font-bold text-xs rounded-full">
                    REMAINING · {(selectedProject.totalLengthKm - selectedProject.completedLengthKm).toFixed(1)} KM
                  </span>
                </div>
              </div>

              {/* Right 1 Col: Stage-wise progress bars */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Stage-wise progress</h3>
                  <p className="text-xs text-slate-500">Physical completion</p>
                </div>

                <div className="space-y-4 pt-1">
                  {Object.entries(selectedProject.stageWiseCompletion).map(([stg, pct], idx) => {
                    const isDone = pct === 100;
                    const isActive = pct > 0 && pct < 100;
                    return (
                      <div key={stg} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : isActive ? (
                              <span className="w-4 h-4 rounded-full bg-accent-orange text-white text-[10px] font-bold flex items-center justify-center">
                                {idx + 1}
                              </span>
                            ) : (
                              <span className="w-4 h-4 rounded-full border border-slate-300 text-slate-400 text-[10px] flex items-center justify-center">
                                {idx + 1}
                              </span>
                            )}
                            <span className="font-bold text-slate-800">{stg}</span>
                          </div>
                          <span className="font-extrabold text-slate-900">{pct}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isDone ? 'bg-brand-700' : isActive ? 'bg-accent-orange' : 'bg-slate-300'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Milestones Timeline & Latest Evidence Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Milestones vs Contract */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">Milestones vs contract</h3>
                    <p className="text-xs text-slate-500">Current variance: {selectedProject.variance}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                    AHEAD
                  </span>
                </div>

                {/* Timeline Nodes */}
                <div className="pt-4 flex items-center justify-between relative">
                  <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 -z-0"></div>
                  {selectedProject.milestones.map((m, idx) => (
                    <div key={idx} className="flex flex-col items-center relative z-10 text-center">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs ${
                          m.status === 'completed'
                            ? 'bg-emerald-600'
                            : m.status === 'active'
                            ? 'bg-accent-orange ring-4 ring-orange-100'
                            : 'bg-slate-300'
                        }`}
                      ></div>
                      <span className="text-[11px] font-bold text-slate-800 mt-2">{m.name}</span>
                      <span className="text-[9px] text-slate-400 font-medium">{m.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Latest Evidence Photo Gallery */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">Latest evidence</h3>
                    <p className="text-xs text-slate-500">AI-verified captures</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('reports')}
                    className="text-xs font-semibold text-brand-700 hover:underline"
                  >
                    View gallery &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {selectedProject.evidence.map((ev) => (
                    <div key={ev.id} className="group relative rounded-xl overflow-hidden border border-slate-200 shadow-2xs">
                      <img
                        src={ev.thumbnail}
                        alt={ev.title}
                        className="w-full h-24 object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1.5 text-white">
                        <p className="text-[10px] font-bold truncate">{ev.title}</p>
                        <p className="text-[8px] text-slate-300">{ev.stage}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* VIEW 3: ALERTS & ANOMALIES (Matches Screenshot 113503.png) */}
        {activeTab === 'alerts' && (
          <div className="p-8 space-y-6">
            
            {/* 3 Metric Pills */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-white px-4 py-3 rounded-2xl border border-red-200 shadow-2xs flex items-center space-x-3">
                  <span className="text-2xl font-extrabold text-red-600">2</span>
                  <span className="text-xs font-bold text-slate-700">Critical / high</span>
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl border border-amber-200 shadow-2xs flex items-center space-x-3">
                  <span className="text-2xl font-extrabold text-amber-600">1</span>
                  <span className="text-xs font-bold text-slate-700">Schedule delay</span>
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl border border-blue-200 shadow-2xs flex items-center space-x-3">
                  <span className="text-2xl font-extrabold text-brand-700">1</span>
                  <span className="text-xs font-bold text-slate-700">Update reminder</span>
                </div>
              </div>

              {/* Severity Filter Dropdown */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500 font-medium">Showing open alerts</span>
                <select
                  value={alertFilter}
                  onChange={(e) => setAlertFilter(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                >
                  <option value="ALL">All severity</option>
                  <option value="CRITICAL">Critical only</option>
                  <option value="HIGH">High only</option>
                  <option value="MEDIUM">Medium only</option>
                </select>
              </div>
            </div>

            {/* Active Alerts List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Active alerts</h3>
                  <p className="text-xs text-slate-500">Prioritised by severity and detection time</p>
                </div>
                <button
                  onClick={() => alert('All non-critical notifications acknowledged.')}
                  className="text-xs font-semibold text-brand-700 hover:underline"
                >
                  Mark all as read
                </button>
              </div>

              {ALERTS.filter((a) => alertFilter === 'ALL' || a.severity === alertFilter).map((alt) => (
                <div key={alt.id} className="p-5 flex items-start justify-between hover:bg-slate-50/70 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        alt.severity === 'CRITICAL'
                          ? 'bg-red-50 text-red-600'
                          : alt.severity === 'HIGH'
                          ? 'bg-orange-50 text-accent-orange'
                          : alt.severity === 'MEDIUM'
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-blue-50 text-brand-700'
                      }`}
                    >
                      <AlertTriangle className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span
                          className={`text-[9px] font-extrabold px-2 py-0.5 rounded tracking-wider ${
                            alt.severity === 'CRITICAL'
                              ? 'bg-red-100 text-red-800'
                              : alt.severity === 'HIGH'
                              ? 'bg-orange-100 text-orange-800'
                              : alt.severity === 'MEDIUM'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {alt.severity}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">{alt.time}</span>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900">{alt.title}</h4>
                      <p className="text-xs font-semibold text-slate-700 mt-0.5">{alt.project}</p>
                      <p className="text-xs text-slate-500 mt-1 max-w-2xl">{alt.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedAlert(alt)}
                    className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-800 shadow-2xs shrink-0 ml-4"
                  >
                    View details
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* VIEW 4: PROGRESS REPORTS (Matches Screenshot 113512.png) */}
        {activeTab === 'reports' && (
          <div className="p-8 space-y-6">
            
            {/* Filter Bar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Date range</label>
                  <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none">
                    <option>01 Jun – 16 Jun 2025</option>
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Project</label>
                  <select
                    value={reportFilterProject}
                    onChange={(e) => setReportFilterProject(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none"
                  >
                    <option value="All projects">All projects</option>
                    {PROJECTS.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Stage</label>
                  <select
                    value={reportFilterStage}
                    onChange={(e) => setReportFilterStage(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none"
                  >
                    <option value="All stages">All stages</option>
                    <option value="Earthwork">Earthwork</option>
                    <option value="GSB">GSB</option>
                    <option value="WBM">WBM / WMM</option>
                    <option value="DBM">DBM</option>
                  </select>
                </div>

                <div className="self-end">
                  <button className="px-5 py-2.5 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-xl shadow-xs">
                    Apply filters
                  </button>
                </div>
              </div>

              {/* Export Buttons */}
              <div className="flex items-center space-x-2 self-end">
                <button
                  onClick={() => setShowExportModal(true)}
                  className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-2xs"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>Export PDF</span>
                </button>
                <button
                  onClick={() => {
                    // Export CSV
                    const csvContent =
                      'data:text/csv;charset=utf-8,Report ID,Date,Project,Stage,Progress,Verification\n' +
                      REPORTS.map((r) => `${r.id},${r.date},${r.project},${r.stage},${r.progress},${r.verification}`).join('\n');
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement('a');
                    link.setAttribute('href', encodedUri);
                    link.setAttribute('download', 'roadsight_progress_reports.csv');
                    document.body.appendChild(link);
                    link.click();
                  }}
                  className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-2xs"
                >
                  <FileSpreadsheet className="w-4 h-4 text-slate-500" />
                  <span>Export Excel</span>
                </button>
              </div>
            </div>

            {/* Daily Progress Reports Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Daily progress reports</h3>
                  <p className="text-xs text-slate-500">128 reports · Last updated 2 minutes ago</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-6">Report ID</th>
                      <th className="py-3 px-6">Date</th>
                      <th className="py-3 px-6">Project</th>
                      <th className="py-3 px-6">Stage</th>
                      <th className="py-3 px-6">Progress</th>
                      <th className="py-3 px-6">Verification</th>
                      <th className="py-3 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredReports.map((rep) => (
                      <tr key={rep.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-6 font-bold text-slate-900">{rep.id}</td>
                        <td className="py-4 px-6 text-slate-600">{rep.date}</td>
                        <td className="py-4 px-6 font-semibold text-slate-900">{rep.project}</td>
                        <td className="py-4 px-6">
                          <span className="px-2 py-0.5 bg-blue-50 text-brand-700 rounded-md font-bold text-[10px] border border-blue-200">
                            {rep.stage}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-900">{rep.progress}</td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold tracking-wider ${
                              rep.verification === 'VERIFIED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {rep.verification}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => setInspectedReport(rep)}
                            className="text-xs font-bold text-brand-700 hover:text-brand-900 hover:underline"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 5: VERIFICATION QUEUE (Officer Review of Field AI Inferences) */}
        {activeTab === 'verification_queue' && (
          <div className="p-8 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Field AI Inferences Pending Review</h3>
                  <p className="text-xs text-slate-500">
                    Technical supervisory audit for machine learning predictions before formal contractor milestone sign-off.
                  </p>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-brand-700 rounded-full text-xs font-bold">
                  2 Pending Sign-offs
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                {/* Item 1 */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Pune Ring Road – Package 3</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                      AI 92% CONFIDENCE
                    </span>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=700&q=80"
                    alt="Capture"
                    className="w-full h-40 object-cover rounded-lg border border-slate-200"
                  />
                  <div className="text-xs space-y-1">
                    <p><strong>Predicted Stage:</strong> WBM / WMM (Water Bound Macadam)</p>
                    <p><strong>Chainage:</strong> Ch 12+200 to 13+600 (+1.4 km done)</p>
                    <p><strong>Captured By:</strong> Arjun Kulkarni (MH-PWD-2041) at 08:42 IST</p>
                  </div>
                  <div className="pt-2 flex items-center space-x-2">
                    <button
                      onClick={() => alert('Capture approved and logged into Urban Development Department registry.')}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg"
                    >
                      Approve & Log Progress
                    </button>
                    <button
                      onClick={() => alert('Re-verification request dispatched to field engineer.')}
                      className="px-3 py-2 bg-white border border-slate-300 text-slate-700 font-bold text-xs rounded-lg hover:bg-slate-100"
                    >
                      Request Re-capture
                    </button>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Baner–Balewadi Link Road</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
                      NEEDS HUMAN AUDIT
                    </span>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1508873696983-2df5703bc225?auto=format&fit=crop&w=700&q=80"
                    alt="Capture"
                    className="w-full h-40 object-cover rounded-lg border border-slate-200"
                  />
                  <div className="text-xs space-y-1">
                    <p><strong>Predicted Stage:</strong> GSB Layer Compaction (45% Complete)</p>
                    <p><strong>Issue:</strong> Milestone progress is 9 days delayed against tender schedule.</p>
                    <p><strong>Captured By:</strong> Priya Joshi (MH-PWD-1882) at 15:05 IST</p>
                  </div>
                  <div className="pt-2 flex items-center space-x-2">
                    <button
                      onClick={() => alert('Contractor schedule delay notice issued.')}
                      className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg"
                    >
                      Issue Contractor Notice
                    </button>
                    <button
                      onClick={() => alert('Engineer contacted.')}
                      className="px-3 py-2 bg-white border border-slate-300 text-slate-700 font-bold text-xs rounded-lg hover:bg-slate-100"
                    >
                      Call Engineer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ALERT DETAILS MODAL */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    selectedAlert.severity === 'CRITICAL' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                  }`}
                >
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                    {selectedAlert.severity} ALERT
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900">{selectedAlert.title}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
              <p><strong>Project:</strong> {selectedAlert.project}</p>
              <p><strong>Detection Timestamp:</strong> {selectedAlert.time}</p>
              <p><strong>Investigation Finding:</strong> {selectedAlert.description}</p>
            </div>

            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900">
              <strong className="block text-[11px] font-bold mb-1">Recommended ULB Action:</strong>
              {selectedAlert.actionRequired}
            </div>

            <div className="pt-2 flex items-center justify-end space-x-2">
              <button
                onClick={() => setSelectedAlert(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  alert(`Official notice and re-verification request triggered for ${selectedAlert.project}.`);
                  setSelectedAlert(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Trigger Re-Inspection Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPORT INSPECTION MODAL */}
      {inspectedReport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">OFFICIAL AUDIT RECORD</span>
                <h3 className="font-extrabold text-lg text-slate-900">Progress Report #{inspectedReport.id}</h3>
              </div>
              <button onClick={() => setInspectedReport(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px] font-bold">PROJECT</span>
                <span className="font-bold text-slate-800">{inspectedReport.project}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px] font-bold">DATE & TIME</span>
                <span className="font-bold text-slate-800">{inspectedReport.date} · 08:42 IST</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px] font-bold">STAGE CLASSIFICATION</span>
                <span className="font-bold text-brand-700">{inspectedReport.stage}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px] font-bold">OVERALL PROGRESS</span>
                <span className="font-bold text-slate-800">{inspectedReport.progress} ({inspectedReport.completedToday})</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
              <p><strong>Assigned Engineer:</strong> {inspectedReport.engineer}</p>
              <p><strong>GPS Coordinates:</strong> {inspectedReport.coordinates} (Within permissible chainage)</p>
              <p><strong>AI Model Confidence:</strong> {inspectedReport.confidence} (Multi-scale aggregate convolution)</p>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official PDF</span>
              </button>
              <button
                onClick={() => setInspectedReport(null)}
                className="px-4 py-2 bg-slate-200 text-slate-800 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXPORT MODAL */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">Export Progress Intelligence</h3>
            <p className="text-xs text-slate-500">
              Download complete road physical progress registries for municipal audits, smart city mission reviews, and contractor reconciliation.
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                  setShowExportModal(false);
                }}
                className="w-full p-3 border border-slate-200 hover:border-brand-600 rounded-xl text-left flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-blue-50/50"
              >
                <div className="flex items-center space-x-2.5">
                  <FileText className="w-4 h-4 text-brand-700" />
                  <span>Executive Progress Report (PDF)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  const csvContent =
                    'data:text/csv;charset=utf-8,Project,Location,Stage,Progress,Contractor,Deadline\n' +
                    PROJECTS.map((p) => `${p.name},${p.location},${p.currentStage},${p.progressPercent}%,${p.contractor},${p.contractDeadline}`).join('\n');
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement('a');
                  link.setAttribute('href', encodedUri);
                  link.setAttribute('download', 'roadsight_projects_summary.csv');
                  document.body.appendChild(link);
                  link.click();
                  setShowExportModal(false);
                }}
                className="w-full p-3 border border-slate-200 hover:border-brand-600 rounded-xl text-left flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-blue-50/50"
              >
                <div className="flex items-center space-x-2.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Chainage Completion Ledger (Excel / CSV)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
