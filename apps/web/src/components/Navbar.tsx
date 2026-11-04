'use client';

import React, { useState } from 'react';
import { Flame, Wind, RefreshCw, Satellite, Layers, CheckCircle2 } from 'lucide-react';
import { triggerManualSync } from '@/lib/api';

interface NavbarProps {
  lastSyncTime?: string;
  onRefresh: () => void;
}

export function Navbar({ lastSyncTime, onRefresh }: NavbarProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const res = await triggerManualSync();
      setSyncStatus(`Berhasil sinkron ${res.count} titik (${res.source})`);
      onRefresh();
    } catch {
      setSyncStatus('Mode demo offline aktif');
      onRefresh();
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(null), 4000);
    }
  };

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white px-4 py-3 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-rose-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Flame className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-lg leading-tight tracking-wide">
                GIS RIAU <span className="text-orange-500">HOTSPOT & AQI</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                REAL-TIME
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Sistem Pemantauan Titik Panas & Kualitas Udara Provinsi Riau
            </p>
          </div>
        </div>

        {/* Action Controls & Sync Status */}
        <div className="flex items-center space-x-3">
          {syncStatus && (
            <span className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {syncStatus}
            </span>
          )}

          <div className="hidden sm:flex items-center text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <Satellite className="w-3.5 h-3.5 mr-1.5 text-orange-400" />
            <span>NASA FIRMS & Open-Meteo</span>
          </div>

          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-medium px-3.5 py-2 rounded-lg transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkron Data'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
