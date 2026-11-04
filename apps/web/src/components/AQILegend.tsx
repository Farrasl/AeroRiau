'use client';

import React from 'react';

export function AQILegend() {
  const levels = [
    { label: 'Baik (0-50)', color: 'bg-emerald-500', desc: 'Aman untuk semua aktivitas' },
    { label: 'Sedang (51-100)', color: 'bg-amber-400', desc: 'Dapat diterima' },
    { label: 'Sensitif (101-150)', color: 'bg-orange-500', desc: 'Rentan bagi anak & lansia' },
    { label: 'Tidak Sehat (151-200)', color: 'bg-rose-500', desc: 'Gunakan masker' },
    { label: 'Berbahaya (>200)', color: 'bg-purple-600', desc: 'Hindari aktivitas luar' },
  ];

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 text-white shadow-lg text-xs w-64 space-y-2">
      <div className="font-semibold text-slate-200 border-b border-slate-800 pb-1 text-[11px] uppercase tracking-wider">
        Indeks Kualitas Udara (AQI / ISPU)
      </div>
      <div className="space-y-1.5">
        {levels.map((lvl) => (
          <div key={lvl.label} className="flex items-center space-x-2">
            <span className={`w-3 h-3 rounded-full ${lvl.color} shrink-0 shadow-sm`} />
            <div className="flex justify-between w-full text-[11px]">
              <span className="font-medium text-slate-300">{lvl.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
