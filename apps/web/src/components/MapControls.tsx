'use client';

import React from 'react';
import { useMapStore } from '@/stores/useMapStore';
import { Flame, Trees, Wind, Layers, SlidersHorizontal, Check } from 'lucide-react';
import { SatelliteType } from '@riau-gis/types';

export function MapControls() {
  const {
    showHotspots,
    showPeatland,
    showAirQuality,
    isHeatmapMode,
    satelliteFilter,
    confidenceFilter,
    onlyPeatland,
    mapStyle,
    toggleLayer,
    setSatelliteFilter,
    setConfidenceFilter,
    setOnlyPeatland,
    setMapStyle,
  } = useMapStore();

  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl p-3 text-white shadow-xl space-y-3 w-72 text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <span className="font-semibold flex items-center gap-1.5 text-slate-200">
          <Layers className="w-4 h-4 text-orange-400" />
          Layer & Filter Peta
        </span>
      </div>

      {/* Layer Toggles */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
          Layer Spasial
        </div>

        <button
          onClick={() => toggleLayer('hotspots')}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border transition-all ${
            showHotspots
              ? 'bg-orange-500/20 border-orange-500/40 text-orange-300'
              : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Titik Panas (Hotspot)</span>
          </div>
          {showHotspots && <Check className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={() => toggleLayer('peatland')}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border transition-all ${
            showPeatland
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
              : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <Trees className="w-3.5 h-3.5 text-amber-400" />
            <span>Kawasan Lahan Gambut</span>
          </div>
          {showPeatland && <Check className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={() => toggleLayer('airQuality')}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border transition-all ${
            showAirQuality
              ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
              : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <Wind className="w-3.5 h-3.5 text-sky-400" />
            <span>Stasiun ISPU & Angin</span>
          </div>
          {showAirQuality && <Check className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Basemap Style */}
      <div className="space-y-1.5 pt-1">
        <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
          Tampilan Peta
        </div>
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={() => setMapStyle('dark')}
            className={`py-1 text-[11px] rounded border text-center transition-all ${
              mapStyle === 'dark'
                ? 'bg-orange-600/80 border-orange-500 text-white font-semibold'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800'
            }`}
          >
            Mode Gelap
          </button>
          <button
            onClick={() => setMapStyle('satellite')}
            className={`py-1 text-[11px] rounded border text-center transition-all ${
              mapStyle === 'satellite'
                ? 'bg-emerald-600/80 border-emerald-500 text-white font-semibold'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800'
            }`}
          >
            Citra Satelit
          </button>
        </div>
      </div>

      {/* Satellite Filter */}
      <div className="space-y-1.5 pt-1">
        <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
          Satelit Sensor
        </div>
        <div className="grid grid-cols-3 gap-1">
          {(['ALL', 'VIIRS_SNPP', 'MODIS'] as const).map((sat) => (
            <button
              key={sat}
              onClick={() => setSatelliteFilter(sat)}
              className={`py-1 text-[11px] rounded border text-center transition-all ${
                satelliteFilter === sat
                  ? 'bg-orange-500 border-orange-500 text-white font-semibold'
                  : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {sat === 'ALL' ? 'Semua' : sat === 'VIIRS_SNPP' ? 'VIIRS' : 'MODIS'}
            </button>
          ))}
        </div>
      </div>

      {/* Peatland Filter Checkbox */}
      <div className="pt-1">
        <label className="flex items-center space-x-2 cursor-pointer text-slate-300 hover:text-white">
          <input
            type="checkbox"
            checked={onlyPeatland}
            onChange={(e) => setOnlyPeatland(e.target.checked)}
            className="rounded border-slate-700 bg-slate-800 text-orange-500 focus:ring-orange-500"
          />
          <span className="text-[11px]">Hanya tampilkan titik di lahan gambut</span>
        </label>
      </div>
    </div>
  );
}
