import React, { useState } from 'react';
import { X, ExternalLink, Database, Layers, CheckCircle, Download, BookOpen, Cpu } from 'lucide-react';
import { FREE_DATASETS } from '../data/mockData';

export default function DatasetExplorerModal({ isOpen, onClose }) {
  const [selectedDataset, setSelectedDataset] = useState(FREE_DATASETS[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full h-[620px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-700 flex items-center justify-center text-white">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider">
                FREE & OPEN-ACCESS DATASET REGISTRY
              </span>
              <h3 className="font-extrabold text-lg text-white">Road & Construction Datasets for ML Testing</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Split layout */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left list of datasets */}
          <div className="w-72 border-r border-slate-200 bg-slate-50 overflow-y-auto no-scrollbar p-3 space-y-2 shrink-0">
            {FREE_DATASETS.map((ds) => (
              <div
                key={ds.id}
                onClick={() => setSelectedDataset(ds)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedDataset.id === ds.id
                    ? 'bg-white border-brand-600 shadow-sm text-brand-900'
                    : 'bg-white/60 border-slate-200 hover:bg-white text-slate-700'
                }`}
              >
                <span className="text-[9px] font-bold px-2 py-0.5 bg-blue-50 text-brand-700 rounded-md block w-fit mb-1">
                  {ds.provider.split('&')[0]}
                </span>
                <h4 className="font-bold text-xs leading-snug">{ds.name}</h4>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{ds.size}</p>
              </div>
            ))}
          </div>

          {/* Right details view */}
          <div className="flex-1 p-6 overflow-y-auto space-y-5 bg-white">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200">
                  {selectedDataset.license}
                </span>
                <a
                  href={selectedDataset.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-700 hover:underline"
                >
                  <span>Open Official Repository</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-2">{selectedDataset.name}</h2>
              <p className="text-xs text-slate-500 font-medium">Maintained by {selectedDataset.provider}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center space-x-1.5">
                <BookOpen className="w-4 h-4 text-brand-700" />
                <span>Dataset Overview</span>
              </h4>
              <p className="leading-relaxed">{selectedDataset.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-100">
                <span className="text-[10px] font-bold text-brand-700 uppercase block mb-1">VOLUME & SCOPE</span>
                <span className="font-semibold text-slate-800">{selectedDataset.size}</span>
              </div>
              <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <span className="text-[10px] font-bold text-emerald-700 uppercase block mb-1">PRACTICAL UTILITY</span>
                <span className="font-semibold text-slate-800">{selectedDataset.utility}</span>
              </div>
            </div>

            {/* Practical implementation code snippet */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-slate-900 flex items-center space-x-1.5">
                <Cpu className="w-4 h-4 text-brand-700" />
                <span>Quick Training & Preprocessing Command</span>
              </h4>
              <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed">
                {selectedDataset.id === 'idd' && (
                  <code>
                    # Download IDD-Lite (~50 MB) for rapid fine-tuning<br/>
                    wget http://idd.insaan.iiit.ac.in/dataset/download/idd-lite.tar.gz<br/>
                    tar -xzf idd-lite.tar.gz<br/>
                    python -m pip install torch torchvision albumentations
                  </code>
                )}
                {selectedDataset.id === 'rdd2022' && (
                  <code>
                    # Download RDD2022 India subset from Figshare API<br/>
                    curl -L "https://doi.org/10.6084/m9.figshare.21431547" -o rdd2022.zip<br/>
                    unzip rdd2022.zip -d ./datasets/rdd2022/<br/>
                    # Contains 47,420 road images with pavement texture labels
                  </code>
                )}
                {selectedDataset.id === 'roboflow_construction_progress' && (
                  <code>
                    # Download with Roboflow Python SDK (Free CC BY 4.0)<br/>
                    pip install roboflow<br/>
                    from roboflow import Roboflow<br/>
                    rf = Roboflow(api_key="PUBLIC_TEST_KEY")<br/>
                    project = rf.workspace("progress").project("road-construction-stages")
                  </code>
                )}
                {selectedDataset.id !== 'idd' && selectedDataset.id !== 'rdd2022' && selectedDataset.id !== 'roboflow_construction_progress' && (
                  <code>
                    # TorchGeo datamodule loading for change detection & segmentation<br/>
                    from torchgeo.datasets import LEVIRCD<br/>
                    dataset = LEVIRCD(root="./data/levir", split="train", download=True)
                  </code>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
