'use client';

import React from 'react';
import { useMapStore } from '@/stores/useMapStore';
import {
  X,
  Flame,
  AlertCircle,
  Compass,
  Trees,
  Clock,
  Navigation,
  Wind,
  Thermometer,
  Droplets,
  Gauge,
  Activity,
  Calendar,
} from 'lucide-react';

export function HotspotDetailDrawer() {
  const { selectedHotspot, selectedStation, isDrawerOpen, setIsDrawerOpen } = useMapStore();

  if (!isDrawerOpen || (!selectedHotspot && !selectedStation)) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 z-50 p-5 overflow-y-auto text-white shadow-2xl transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          {selectedHotspot ? (
            <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400 shadow-md shadow-orange-500/10">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 shadow-md shadow-sky-500/10">
              <Wind className="w-5 h-5" />
            </div>
          )}
          <div>
            <h2 className="text-base font-bold leading-tight">
              {selectedHotspot ? 'Detail Titik Panas' : selectedStation?.name}
            </h2>
            <p className="text-xs text-slate-400">
              {selectedHotspot ? `ID: ${selectedHotspot.id}` : `${selectedStation?.city} • Open-Meteo Integration`}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsDrawerOpen(false)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* HOTSPOT CONTENT */}
      {selectedHotspot && (
        <div className="space-y-4 mt-4 text-xs">
          {/* Peatland Warning Banner */}
          {selectedHotspot.isInPeatland && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-amber-200">Terdeteksi di Kawasan Lahan Gambut!</span>
                Api pada lahan gambut berpotensi merambat di bawah permukaan tanah (*smoldering*) dan menghasilkan emisi asap pekat berkepanjangan.
              </div>
            </div>
          )}

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block mb-0.5">Fire Radiative Power</span>
              <span className="text-2xl font-bold text-orange-400">{selectedHotspot.frp} MW</span>
            </div>
            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block mb-0.5">Tingkat Keyakinan</span>
              <span
                className={`text-lg font-bold uppercase ${
                  selectedHotspot.confidence === 'high' ? 'text-rose-400' : 'text-amber-400'
                }`}
              >
                {selectedHotspot.confidence}
              </span>
            </div>
          </div>

          {/* Details Table */}
          <div className="bg-slate-800/40 rounded-xl p-3.5 border border-slate-800 space-y-2.5">
            <div className="flex justify-between py-1 border-b border-slate-700/40">
              <span className="text-slate-400">Wilayah / Kabupaten</span>
              <span className="font-medium text-white">{selectedHotspot.district || 'Riau'}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-700/40">
              <span className="text-slate-400">Koordinat (Lat, Lon)</span>
              <span className="font-mono text-slate-300">
                {Number(selectedHotspot.latitude || 0).toFixed(4)}, {Number(selectedHotspot.longitude || 0).toFixed(4)}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-700/40">
              <span className="text-slate-400">Satelit & Instrumen</span>
              <span className="font-medium text-white">
                {selectedHotspot.satellite} ({selectedHotspot.instrument})
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-700/40">
              <span className="text-slate-400">Kecerahan (Brightness)</span>
              <span className="text-white">{selectedHotspot.brightness} K</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-400">Waktu Deteksi Satelit</span>
              <span className="text-white">
                {selectedHotspot.acqDate} ({selectedHotspot.acqTime} UTC)
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2">
            <a
              href={`https://www.google.com/maps?q=${selectedHotspot.latitude},${selectedHotspot.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-medium transition"
            >
              <Compass className="w-4 h-4 text-orange-400" />
              <span>Buka Lokasi di Google Maps</span>
            </a>
          </div>
        </div>
      )}

      {/* AIR QUALITY & OPEN-METEO STATION CONTENT */}
      {selectedStation && (
        <div className="space-y-4 mt-4 text-xs">
          {/* Main AQI Banner */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[11px] text-slate-400 block mb-0.5">Indeks Kualitas Udara (AQI / ISPU)</span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-3xl font-extrabold text-white">{selectedStation.aqi}</span>
                <span className="text-xs text-slate-400">US AQI</span>
              </div>
            </div>
            <div className="text-right">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm ${
                  selectedStation.aqi <= 50
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : selectedStation.aqi <= 100
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : selectedStation.aqi <= 150
                    ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                }`}
              >
                {selectedStation.category}
              </span>
            </div>
          </div>

          {/* Peatland Drought & Flammability Index (Open-Meteo Soil Moisture) */}
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Trees className="w-4 h-4 text-emerald-400" />
                Indeks Kerawanan Gambut (Open-Meteo)
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedStation.peatDroughtRisk === 'EKSTRIM'
                    ? 'bg-rose-600 text-white'
                    : selectedStation.peatDroughtRisk === 'TINGGI'
                    ? 'bg-orange-500 text-white'
                    : selectedStation.peatDroughtRisk === 'SEDANG'
                    ? 'bg-amber-500 text-black'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                RISIKO {selectedStation.peatDroughtRisk ?? 'SEDANG'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Kelembaban tanah gambut: <span className="text-white font-mono">{selectedStation.soilMoisture ?? 0.35} m³/m³</span>.
              {selectedStation.soilMoisture && selectedStation.soilMoisture < 0.3
                ? ' Lapisan kubah gambut kering dan mudah terbakar jika tersulut percikan api.'
                : ' Kondisi kelembaban relatif terjaga stabil.'}
            </p>
          </div>

          {/* Particulates PM2.5 & PM10 */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block mb-0.5">PM2.5 (Debu Halus)</span>
              <span className="text-xl font-bold text-sky-400">{selectedStation.pm25} µg/m³</span>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block mb-0.5">PM10 (Debu Kasar)</span>
              <span className="text-xl font-bold text-sky-400">{selectedStation.pm10 || '-'} µg/m³</span>
            </div>
          </div>

          {/* Weather & Wind Parameters from Open-Meteo */}
          <div className="bg-slate-800/40 rounded-xl p-3.5 border border-slate-800 space-y-2">
            <div className="font-semibold text-slate-300 pb-1 border-b border-slate-700/50 flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-sky-400" />
              Parameter Meteorologi Real-Time
            </div>

            <div className="flex justify-between py-1 border-b border-slate-700/30">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" /> Suhu Udara
              </span>
              <span className="font-medium text-white">
                {selectedStation.temperature ?? 31}°C (Terasa {selectedStation.apparentTemperature ?? 34}°C)
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-700/30">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-blue-400" /> Kelembaban Udara
              </span>
              <span className="font-medium text-white">{selectedStation.humidity ?? 75}%</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-700/30">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-teal-400" /> Kecepatan Angin
              </span>
              <span className="font-medium text-white">
                {selectedStation.windSpeed ?? 8} km/h (Hembusan {selectedStation.windGusts ?? 15} km/h)
              </span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Navigation
                  className="w-3.5 h-3.5 text-orange-400 transition-transform"
                  style={{ transform: `rotate(${selectedStation.windDirection ?? 0}deg)` }}
                />
                Arah Sebaran Asap
              </span>
              <span className="font-medium text-white">
                Menuju {selectedStation.windCompass || 'Tenggara (135°)'}
              </span>
            </div>
          </div>

          {/* Chemical Pollutants */}
          {(selectedStation.co || selectedStation.no2 || selectedStation.o3 || selectedStation.so2) && (
            <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-300 block mb-2">
                Konsentrasi Gas Kimia (µg/m³)
              </span>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">CO</span>
                  <span className="font-bold text-slate-200">{selectedStation.co ?? '-'}</span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">NO₂</span>
                  <span className="font-bold text-slate-200">{selectedStation.no2 ?? '-'}</span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">O₃</span>
                  <span className="font-bold text-slate-200">{selectedStation.o3 ?? '-'}</span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">SO₂</span>
                  <span className="font-bold text-slate-200">{selectedStation.so2 ?? '-'}</span>
                </div>
              </div>
            </div>
          )}

          {/* 24-Hour Forecast Timeline */}
          {selectedStation.hourlyForecast && selectedStation.hourlyForecast.length > 0 && (
            <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-300 text-[11px] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-sky-400" />
                  Prakiraan Kualitas Udara 24 Jam (Open-Meteo)
                </span>
              </div>
              <div className="flex space-x-2 overflow-x-auto pb-1 pt-1">
                {selectedStation.hourlyForecast.slice(0, 16).map((item, idx) => {
                  const hourLabel = item.time.slice(11, 16);
                  return (
                    <div
                      key={idx}
                      className="shrink-0 bg-slate-900/80 border border-slate-800 rounded-lg p-2 text-center w-16"
                    >
                      <span className="text-[10px] text-slate-400 block">{hourLabel}</span>
                      <span
                        className={`text-xs font-bold block my-1 ${
                          item.aqi <= 50 ? 'text-emerald-400' : item.aqi <= 100 ? 'text-amber-400' : 'text-rose-400'
                        }`}
                      >
                        {item.aqi}
                      </span>
                      <span className="text-[9px] text-slate-400 block">{item.windSpeed} km/h</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
