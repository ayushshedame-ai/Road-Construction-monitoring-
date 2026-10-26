import React from 'react';
import {
  HardHat,
  Building2,
  ShieldCheck,
  Smartphone,
  LayoutDashboard,
  CheckCircle,
  Clock,
  MapPin,
  Camera,
  ArrowRight,
  X
} from 'lucide-react';

export default function RoleLoginModal({ isOpen, onClose, onSelectRole, currentRole }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#0d1f3d] via-brand-700 to-[#0d1f3d] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <div className="flex items-center space-x-1 p-1.5 bg-white/10 rounded-xl border border-white/20">
              <div className="w-2.5 h-6 bg-blue-400 rounded-sm"></div>
              <div className="w-2.5 h-7 bg-white rounded-sm"></div>
              <div className="w-2.5 h-5 bg-orange-400 rounded-sm"></div>
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">RoadSight Portal Access</h2>
              <p className="text-[10px] uppercase tracking-wider text-blue-200 font-bold">
                PWD & NHAI Smart Infrastructure Monitoring System
              </p>
            </div>
          </div>
          <p className="text-xs text-blue-100 max-w-lg mt-1">
            Select your authenticated role to access role-specific workflows and dashboards:
          </p>
        </div>

        {/* 2-Column Role Selection Cards */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-50">
          
          {/* ROLE 1: CONTRACTOR */}
          <div
            onClick={() => onSelectRole('contractor')}
            className={`bg-white rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between group hover:shadow-lg ${
              currentRole === 'contractor'
                ? 'border-orange-500 ring-2 ring-orange-200 bg-orange-50/20'
                : 'border-slate-200 hover:border-orange-400'
            }`}
          >
            <div>
              {/* Role Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold shadow-xs">
                  <HardHat className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-100 text-orange-800 uppercase tracking-wider">
                  Field Contractor
                </span>
              </div>

              <h3 className="font-extrabold text-base text-slate-900 group-hover:text-orange-600 transition-colors">
                Contractor Mobile Portal
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                For construction firms, site engineers & field surveyors.
              </p>

              {/* Contractor Feature Bullets */}
              <div className="mt-4 space-y-2 text-[11px] text-slate-600">
                <div className="flex items-start space-x-2">
                  <Camera className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                  <span><strong>GPS Site Photos:</strong> Capture live geotagged evidence with auto EXIF & GNSS lock</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Clock className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                  <span><strong>Deadline & Variance:</strong> Check if you're ahead, on-track, or behind schedule</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                  <span><strong>Work Percentage:</strong> Monitor chainage completed vs target contract length</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Smartphone className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                  <span><strong>Daily Report Submission:</strong> Submit verified progress reports for billing approval</span>
                </div>
              </div>

              {/* Sample Profile Badge */}
              <div className="mt-4 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[10px]">
                <p className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Sample Profile:</p>
                <p className="font-bold text-slate-800">Arjun Kulkarni · Skyline Infra Pvt. Ltd.</p>
                <p className="text-slate-500 truncate">Pune Ring Road Package 3 (PRR-P3-024)</p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectRole('contractor');
              }}
              className="mt-5 w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <span>Login as Contractor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* ROLE 2: SUPERVISING OFFICER */}
          <div
            onClick={() => onSelectRole('officer')}
            className={`bg-white rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between group hover:shadow-lg ${
              currentRole === 'officer'
                ? 'border-blue-600 ring-2 ring-blue-200 bg-blue-50/20'
                : 'border-slate-200 hover:border-blue-500'
            }`}
          >
            <div>
              {/* Role Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-100 text-brand-700 flex items-center justify-center font-bold shadow-xs">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-brand-800 uppercase tracking-wider">
                  Supervising Officer
                </span>
              </div>

              <h3 className="font-extrabold text-base text-slate-900 group-hover:text-brand-700 transition-colors">
                Officer Oversight Dashboard
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                For Executive Engineers, ULB heads, NHAI & MoRTH directors.
              </p>

              {/* Officer Feature Bullets */}
              <div className="mt-4 space-y-2 text-[11px] text-slate-600">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Citywide GIS Map:</strong> High-res curved geometry of all 124 ongoing highway projects</span>
                </div>
                <div className="flex items-start space-x-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Verification Queue:</strong> Review contractor photo submissions & AI confidence</span>
                </div>
                <div className="flex items-start space-x-2">
                  <LayoutDashboard className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Delay & Fraud Alerts:</strong> Instant notifications for blur, pHash duplicates & GPS violations</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Billing Approvals:</strong> Approve or reject contractor milestone reports with 1 click</span>
                </div>
              </div>

              {/* Sample Profile Badge */}
              <div className="mt-4 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[10px]">
                <p className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Sample Profile:</p>
                <p className="font-bold text-slate-800">Er. Rajesh Kulkarni · Executive Engineer</p>
                <p className="text-slate-500">PWD Pune Metropolitan Highway Division</p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectRole('officer');
              }}
              className="mt-5 w-full py-2.5 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <span>Login as Officer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Footer Note */}
        <div className="bg-slate-100 p-3.5 px-6 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>💡 <strong>Tip for Jury / Panel Demo:</strong> You can switch roles at any time using the header badge.</span>
          <button
            onClick={onClose}
            className="font-bold text-slate-700 hover:underline"
          >
            Dismiss
          </button>
        </div>

      </div>
    </div>
  );
}
