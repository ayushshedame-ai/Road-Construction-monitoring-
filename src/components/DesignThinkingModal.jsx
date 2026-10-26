import React from 'react';
import { X, Lightbulb, Users, Target, Compass, CheckCircle2, AlertOctagon, Sparkles } from 'lucide-react';

export default function DesignThinkingModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full h-[640px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-6 bg-brand-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white">
              <Lightbulb className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">
                DESIGN THINKING FRAMEWORK & METHODOLOGY
              </span>
              <h3 className="font-extrabold text-lg text-white">
                RoadSight: AI-Powered Physical Progress Monitoring
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed">
          
          {/* Phase 1: Empathize */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center space-x-2 text-brand-800 font-extrabold text-sm">
              <Users className="w-4 h-4 text-brand-700" />
              <span>1. EMPATHIZE — Stakeholder Pain Points</span>
            </div>
            <p>
              In Indian Urban Local Bodies (ULBs) and State PWD agencies, thousands of road stretches (Smart Cities Mission, PMGSY, Municipal wards) are under simultaneous construction.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <strong className="block text-slate-900 mb-1">ULB Superintending Engineers</strong>
                Field visits take 4–6 hours per site. Physical monitoring of 100+ projects daily is humanly impossible, resulting in delayed bill approvals and milestone blindspots.
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <strong className="block text-slate-900 mb-1">Contractor Field Teams</strong>
                Pressure to report daily progress without standardized objective verification; dispute-prone manual logs and paper measurements.
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <strong className="block text-slate-900 mb-1">Municipal Citizens & Taxpayers</strong>
                Suffer from chronic road digging, stalled projects, and lack of accountability regarding actual stage-wise completion.
              </div>
            </div>
          </div>

          {/* Phase 2: Define */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center space-x-2 text-brand-800 font-extrabold text-sm">
              <Target className="w-4 h-4 text-brand-700" />
              <span>2. DEFINE — The Core Problem Statement</span>
            </div>
            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl font-medium text-slate-800 italic">
              "How might we empower ULBs and highway agencies with an automated, tamper-proof computer vision system that classifies construction stages, calculates completed stretch lengths, detects project anomalies, and compares historical site captures without requiring daily manual technical inspections?"
            </div>
          </div>

          {/* Phase 3: Ideate */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center space-x-2 text-brand-800 font-extrabold text-sm">
              <Lightbulb className="w-4 h-4 text-brand-700" />
              <span>3. IDEATE — Multi-Layered Technical Innovation</span>
            </div>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Component-Aware Model Routing:</strong> Because road construction includes distinct activities (macadamization layers, utility duct trenching, pedestrian kerbing), a top-level router directs the image to specialized classification models.
              </li>
              <li>
                <strong>Multi-Factor Authenticity Checks:</strong> Preventing fraud using <strong>Geo-Fencing</strong> (Haversine chainage projection), <strong>Perceptual Hashing (pHash)</strong> to eliminate duplicate gallery re-uploads, and <strong>Laplacian sharpness variance</strong> to reject blurry/dark photos.
              </li>
              <li>
                <strong>Bitemporal Change Detection & Length Projection:</strong> Comparing past captures with today’s photo using split-sliders and chainage interpolation to calculate actual added progress in kilometers.
              </li>
            </ul>
          </div>

          {/* Phase 4: Prototype */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center space-x-2 text-brand-800 font-extrabold text-sm">
              <Sparkles className="w-4 h-4 text-brand-700" />
              <span>4. PROTOTYPE — System Architecture</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <strong className="block text-slate-900 mb-1">Field Mobile Web Application</strong>
                Lightweight mobile client with live GPS auto-capture, fast photo upload, local edge validation, instant stage inference, and interactive before/after diff slider.
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <strong className="block text-slate-900 mb-1">Executive Officer GIS Dashboard</strong>
                Full-screen supervisory command center featuring interactive Leaflet GIS road maps, real-time fraud alerts, stage milestone timelines, and automated PDF export.
              </div>
            </div>
          </div>

          {/* Phase 5: Test & Validate */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center space-x-2 text-brand-800 font-extrabold text-sm">
              <CheckCircle2 className="w-4 h-4 text-brand-700" />
              <span>5. TEST — Validation & Error Mitigation</span>
            </div>
            <p>
              Tested with 6 distinct real-world presets including positive validations (WBM/WMM, DBM asphalt, utility ducts) and rigorous negative test cases (blurry capture rejection, geo-fence violation alert, and duplicate image fraud detection).
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">Design Thinking Academic & Technical Report</span>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl"
          >
            Print Design Thinking Summary
          </button>
        </div>

      </div>
    </div>
  );
}
