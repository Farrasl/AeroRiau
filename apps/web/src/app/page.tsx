'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { StatsCards } from '@/components/StatsCards';
import { MapControls } from '@/components/MapControls';
import { AQILegend } from '@/components/AQILegend';
import { HotspotDetailDrawer } from '@/components/HotspotDetailDrawer';
import dynamic from 'next/dynamic';
import {
  fetchHotspots,
  fetchAirQualityStations,
  fetchPeatlandPolygons,
  fetchDashboardStats,
} from '@/lib/api';

const MapView = dynamic(
  () => import('@/components/map/MapView').then((mod) => mod.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[600px] flex items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-medium">Memuat Peta Spasial Riau...</span>
        </div>
      </div>
    ),
  }
);
import {
  HotspotItem,
  AirQualityStation,
  GeoJsonFeatureCollection,
  DashboardStats,
} from '@riau-gis/types';
import { useMapStore } from '@/stores/useMapStore';
import { Clock } from 'lucide-react';

export default function DashboardPage() {
  const [hotspotsData, setHotspotsData] = useState<GeoJsonFeatureCollection<HotspotItem>>({
    type: 'FeatureCollection',
    features: [],
  });
  const [peatlandsData, setPeatlandsData] = useState<GeoJsonFeatureCollection<any>>({
    type: 'FeatureCollection',
    features: [],
  });
  const [stationsData, setStationsData] = useState<AirQualityStation[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const { timeframe, satelliteFilter, confidenceFilter, onlyPeatland, setTimeframe } =
    useMapStore();

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [hotspots, peatlands, stations, summaryStats] = await Promise.all([
        fetchHotspots({
          timeframe,
          satellite: satelliteFilter,
          confidence: confidenceFilter,
          onlyPeatland,
        }),
        fetchPeatlandPolygons(),
        fetchAirQualityStations(),
        fetchDashboardStats(),
      ]);

      // Dynamically reflect active timeframe & filters in summary stats
      const activeHotspots = hotspots.features.map((f) => f.properties);
      const highConf = activeHotspots.filter((h) => h.confidence === 'high').length;
      const peatCount = activeHotspots.filter((h) => h.isInPeatland).length;
      const maxFRP = activeHotspots.reduce((max, h) => Math.max(max, h.frp || 0), 0);

      const districtCounts: Record<string, number> = {};
      activeHotspots.forEach((h) => {
        const d = h.district || 'Lainnya';
        districtCounts[d] = (districtCounts[d] || 0) + 1;
      });
      const topDistricts = Object.entries(districtCounts)
        .map(([district, count]) => ({ district, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setHotspotsData(hotspots);
      setPeatlandsData(peatlands);
      setStationsData(stations);
      setStats({
        ...summaryStats,
        totalHotspots24h: activeHotspots.length,
        highConfidenceCount: highConf,
        peatlandHotspotsCount: peatCount,
        maxFRP: parseFloat(maxFRP.toFixed(1)),
        topDistricts,
      });
    } catch (err) {
      console.error('Error fetching GIS data:', err);
    } finally {
      setLoading(false);
    }
  }, [timeframe, satelliteFilter, confidenceFilter, onlyPeatland]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-slate-950">
      {/* 1. Header Navigation */}
      <Navbar lastSyncTime={stats?.lastSyncTime} onRefresh={loadAllData} />

      {/* 2. Top Stats Overview */}
      <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="w-full">
            <StatsCards stats={stats} timeframe={timeframe} />
          </div>
        </div>
      </div>

      {/* 3. Main GIS Map Area */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {/* The Mapbox / Leaflet Map Container */}
        <MapView
          hotspotsData={hotspotsData}
          peatlandsData={peatlandsData}
          stationsData={stationsData}
        />

        {/* Floating Top-Left Controls */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {/* Timeframe pill tabs */}
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-1.5 flex items-center space-x-1 shadow-lg text-xs">
            <div className="flex items-center px-2 text-slate-400 gap-1">
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden sm:inline">Periode:</span>
            </div>
            {(['24h', '48h', '7d'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${timeframe === tf
                  ? 'bg-orange-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
              >
                {tf === '24h' ? '24 Jam' : tf === '48h' ? '48 Jam' : '7 Hari'}
              </button>
            ))}
          </div>

          {/* Layer and Filters Toggle Card */}
          <MapControls />
        </div>

        {/* Floating Bottom-Left AQI Legend */}
        <div className="absolute bottom-6 right-4 z-10 hidden sm:block">
          <AQILegend />
        </div>

        {/* Slide-over Inspection Drawer for Hotspots & Stations */}
        <HotspotDetailDrawer />
      </div>
    </div>
  );
}
