'use client';

import React from 'react';
import { Flame, Trees, AlertTriangle, Wind, Compass } from 'lucide-react';
import { DashboardStats } from '@riau-gis/types';

interface StatsCardsProps {
  stats: DashboardStats | null;
  timeframe?: '24h' | '48h' | '7d';
}

export function StatsCards({ stats, timeframe = '24h' }: StatsCardsProps) {
  if (!stats) return null;

  const timeframeLabel =
    timeframe === '48h' ? '48 Jam' : timeframe === '7d' ? '7 Hari' : '24 Jam';

  const topDistrictText = stats.topDistricts && stats.topDistricts.length > 0 
    ? `${stats.topDistricts[0].district} (${stats.topDistricts[0].count})` 
    : '-';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Total Hotspot */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 shadow-sm">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
          <span>Total Hotspot ({timeframeLabel})</span>
          <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400">
            <Flame className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-white">{stats.totalHotspots24h}</span>
          <span className="text-xs text-orange-400 font-medium">Titik Api</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          {stats.highConfidenceCount} titik kepercayaan tinggi
        </p>
      </div>

      {/* Lahan Gambut */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 shadow-sm">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
          <span>Di Kawasan Gambut</span>
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Trees className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-amber-400">{stats.peatlandHotspotsCount}</span>
          <span className="text-xs text-slate-400">
            ({stats.totalHotspots24h > 0 ? Math.round((stats.peatlandHotspotsCount / stats.totalHotspots24h) * 100) : 0}%)
          </span>
        </div>
        <p className="text-[11px] text-amber-500/80 mt-1">
          Rentan kebakaran bawah permukaan
        </p>
      </div>

      {/* Daerah Paling Rawan */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 shadow-sm">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
          <span>Kabupaten Terbanyak</span>
          <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="text-lg font-bold text-rose-400 truncate">
          {topDistrictText}
        </div>
        <p className="text-[11px] text-slate-400 mt-1 truncate">
          Max FRP: <span className="text-white font-semibold">{stats.maxFRP} MW</span>
        </p>
      </div>

      {/* Rata-rata Kualitas Udara */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 shadow-sm">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
          <span>Rata-rata ISPU / AQI</span>
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
            <Wind className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className={`text-2xl font-bold ${getAqiColor(stats.averageAQI)}`}>
            {stats.averageAQI}
          </span>
          <span className="text-xs text-slate-400">US AQI</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          {stats.worstAQIStation ? `Stasiun kritis: ${stats.worstAQIStation.city}` : 'Status Terpantau'}
        </p>
      </div>
    </div>
  );
}

function getAqiColor(aqi: number) {
  if (aqi <= 50) return 'text-emerald-400';
  if (aqi <= 100) return 'text-amber-400';
  if (aqi <= 150) return 'text-orange-400';
  if (aqi <= 200) return 'text-rose-500';
  return 'text-purple-400';
}
