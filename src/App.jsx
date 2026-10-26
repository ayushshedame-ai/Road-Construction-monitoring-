import React, { useState } from 'react';
import FieldMobileView from './components/FieldMobileView';
import OfficerDashboardView from './components/OfficerDashboardView';
import DatasetExplorerModal from './components/DatasetExplorerModal';
import DesignThinkingModal from './components/DesignThinkingModal';

// Authentic RoadSight 3-Stripe Brand Logo Icon
export function RoadSightLogoIcon({ className = "w-8 h-8" }) {
  return (
    <div className={`${className} bg-[#1e3a8a] rounded-xl flex items-center justify-center p-1.5 shadow-xs shrink-0`}>
      <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
        {/* Left stripe: light blue */}
        <line x1="9" y1="24" x2="15" y2="8" stroke="#60a5fa" strokeWidth="3.5" strokeLinecap="round" />
        {/* Middle stripe: white */}
        <line x1="15" y1="24" x2="21" y2="8" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
        {/* Right stripe: orange */}
        <line x1="21" y1="24" x2="27" y2="8" stroke="#ea580c" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function App() {
  const [activeMode, setActiveMode] = useState('field'); // 'field' or 'dashboard'
  const [mobileScreen, setMobileScreen] = useState('login'); // default to login or home
  const [showDatasetsModal, setShowDatasetsModal] = useState(false);
  const [showDesignThinkingModal, setShowDesignThinkingModal] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f5f9] text-slate-800 font-sans selection:bg-[#1e3a8a] selection:text-white" style={{ backgroundColor: '#f1f5f9' }}>
      
      {/* TOP NAVIGATION BAR (Matches Exact Reference Screenshots) */}
      <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-40 shadow-xs" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        
        {/* Brand Logo Card (Matches Screenshot 113332.png) */}
        <div 
          className="flex items-center space-x-2.5 cursor-pointer py-1.5 px-3 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-colors shadow-2xs"
          onClick={() => { setActiveMode('field'); setMobileScreen('home'); }}
        >
          <RoadSightLogoIcon className="w-7 h-7" />
          <div className="text-left pr-1">
            <h1 className="font-extrabold text-[15px] tracking-tight text-slate-900 leading-none">RoadSight</h1>
            <p className="text-[8px] uppercase tracking-wider text-slate-400 font-bold mt-0.5">SMART INFRASTRUCTURE</p>
          </div>
        </div>

        {/* Mode Switcher Pill: Field mobile vs Officer dashboard */}
        <div className="flex items-center bg-[#edf2f7] p-1 rounded-2xl border border-slate-200 shadow-inner" style={{ backgroundColor: '#edf2f7' }}>
          <button
            onClick={() => setActiveMode('field')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeMode === 'field'
                ? 'bg-white text-[#1e3a8a] shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
            style={activeMode === 'field' ? { backgroundColor: '#ffffff', color: '#1e3a8a' } : {}}
          >
            Field mobile
          </button>

          <button
            onClick={() => setActiveMode('dashboard')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeMode === 'dashboard'
                ? 'bg-white text-[#1e3a8a] shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
            style={activeMode === 'dashboard' ? { backgroundColor: '#ffffff', color: '#1e3a8a' } : {}}
          >
            Officer dashboard
          </button>
        </div>

        {/* Right Label (Matches Screenshot: INTERACTIVE PROTOTYPE) */}
        <div className="flex items-center">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 select-none">
            INTERACTIVE PROTOTYPE
          </span>
        </div>

      </header>

      {/* BODY CONTENT: SWITCHES BETWEEN FIELD MOBILE AND OFFICER DASHBOARD */}
      <div className="flex-1 flex flex-col">
        {activeMode === 'field' ? (
          <div className="relative">
            <FieldMobileView
              onOpenReports={() => setActiveMode('dashboard')}
              onSwitchToDashboard={() => setActiveMode('dashboard')}
              activeScreen={mobileScreen}
              onScreenChange={setMobileScreen}
            />
          </div>
        ) : (
          <OfficerDashboardView
            onSwitchToMobile={() => setActiveMode('field')}
          />
        )}
      </div>

      {/* MODALS */}
      <DatasetExplorerModal
        isOpen={showDatasetsModal}
        onClose={() => setShowDatasetsModal(false)}
      />

      <DesignThinkingModal
        isOpen={showDesignThinkingModal}
        onClose={() => setShowDesignThinkingModal(false)}
      />

    </div>
  );
}
