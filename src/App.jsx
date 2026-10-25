import React, { useState } from 'react';
import {
  Layers,
  Smartphone,
  LayoutDashboard,
  Database,
  Lightbulb,
  ExternalLink,
  ShieldCheck,
  Check,
  Play
} from 'lucide-react';
import FieldMobileView from './components/FieldMobileView';
import OfficerDashboardView from './components/OfficerDashboardView';
import DatasetExplorerModal from './components/DatasetExplorerModal';
import DesignThinkingModal from './components/DesignThinkingModal';

export default function App() {
  const [activeMode, setActiveMode] = useState('field'); // 'field' or 'dashboard'
  const [mobileScreen, setMobileScreen] = useState('home');
  const [showDatasetsModal, setShowDatasetsModal] = useState(false);
  const [showDesignThinkingModal, setShowDesignThinkingModal] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800 font-sans selection:bg-brand-600 selection:text-white">
      
      {/* TOP NAVIGATION & MODE SWITCHER BAR (Matches Screenshot Top Header) */}
      <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-40 shadow-xs backdrop-blur-md">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveMode('field')}>
          <div className="flex items-center space-x-1 p-1.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="w-2.5 h-6 bg-blue-500 rounded-sm"></div>
            <div className="w-2.5 h-7 bg-brand-700 rounded-sm"></div>
            <div className="w-2.5 h-5 bg-accent-orange rounded-sm"></div>
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-slate-900 leading-none">RoadSight</h1>
            <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mt-0.5">SMART INFRASTRUCTURE</p>
          </div>
        </div>

        {/* Mode Switcher Pill (Field mobile vs Officer dashboard) */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
          <button
            onClick={() => setActiveMode('field')}
            className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeMode === 'field'
                ? 'bg-white text-brand-700 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Field mobile</span>
          </button>

          <button
            onClick={() => setActiveMode('dashboard')}
            className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeMode === 'dashboard'
                ? 'bg-white text-brand-700 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Officer dashboard</span>
          </button>
        </div>

        {/* START BUTTON */}
        <button
          onClick={() => {
            setActiveMode('field');
            setMobileScreen('capture');
            window.dispatchEvent(new CustomEvent('start-assessment'));
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all transform active:scale-95 cursor-pointer ring-2 ring-orange-300/50"
          title="Click to start site inspection and photo assessment"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>START ASSESSMENT</span>
        </button>

        {/* Right Action Helpers & Prototype Pill */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowDatasetsModal(true)}
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-brand-800 rounded-xl text-xs font-bold border border-blue-200 transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-brand-700" />
            <span>Datasets Registry</span>
          </button>

          <button
            onClick={() => setShowDesignThinkingModal(true)}
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-bold border border-amber-200 transition-colors"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
            <span>Design Thinking</span>
          </button>

          <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 bg-slate-100 border border-slate-300 rounded-full text-slate-500">
            INTERACTIVE PROTOTYPE
          </span>
        </div>

      </header>

      {/* BODY CONTENT: SWITCHES BETWEEN FIELD MOBILE AND OFFICER DASHBOARD */}
      <div className="flex-1 flex flex-col">
        {activeMode === 'field' ? (
          <div className="relative">
            {/* Quick Helper Floating Bar for Field Mobile */}
            <div className="max-w-xl mx-auto pt-4 px-4 flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold">
                Tip: Test different stages, error conditions, and photo uploads in the mobile simulator below:
              </span>
              <button
                onClick={() => setActiveMode('dashboard')}
                className="font-bold text-brand-700 hover:underline shrink-0 ml-2"
              >
                Go to Officer Dashboard &rarr;
              </button>
            </div>

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
