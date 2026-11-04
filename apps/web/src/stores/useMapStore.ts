import { create } from 'zustand';
import { HotspotItem, AirQualityStation, SatelliteType } from '@riau-gis/types';

interface MapState {
  // Selections
  selectedHotspot: HotspotItem | null;
  selectedStation: AirQualityStation | null;
  isDrawerOpen: boolean;

  // Layer Toggles
  showHotspots: boolean;
  showPeatland: boolean;
  showAirQuality: boolean;
  isHeatmapMode: boolean;
  mapStyle: 'dark' | 'satellite';

  // Filters
  timeframe: '24h' | '48h' | '7d';
  satelliteFilter: SatelliteType | 'ALL';
  confidenceFilter: 'ALL' | 'nominal_high' | 'high';
  onlyPeatland: boolean;

  // Actions
  setSelectedHotspot: (hotspot: HotspotItem | null) => void;
  setSelectedStation: (station: AirQualityStation | null) => void;
  setIsDrawerOpen: (open: boolean) => void;
  toggleLayer: (layer: 'hotspots' | 'peatland' | 'airQuality' | 'heatmap') => void;
  setMapStyle: (style: 'dark' | 'satellite') => void;
  setTimeframe: (tf: '24h' | '48h' | '7d') => void;
  setSatelliteFilter: (sat: SatelliteType | 'ALL') => void;
  setConfidenceFilter: (conf: 'ALL' | 'nominal_high' | 'high') => void;
  setOnlyPeatland: (only: boolean) => void;
}

export const useMapStore = create<MapState>((set) => ({
  selectedHotspot: null,
  selectedStation: null,
  isDrawerOpen: false,

  showHotspots: true,
  showPeatland: true,
  showAirQuality: true,
  isHeatmapMode: false,
  mapStyle: 'dark',

  timeframe: '24h',
  satelliteFilter: 'ALL',
  confidenceFilter: 'ALL',
  onlyPeatland: false,

  setSelectedHotspot: (hotspot) =>
    set({
      selectedHotspot: hotspot,
      selectedStation: null,
      isDrawerOpen: hotspot !== null,
    }),

  setSelectedStation: (station) =>
    set({
      selectedStation: station,
      selectedHotspot: null,
      isDrawerOpen: station !== null,
    }),

  setIsDrawerOpen: (open) => set({ isDrawerOpen: open }),

  setMapStyle: (mapStyle) => set({ mapStyle }),

  toggleLayer: (layer) =>
    set((state) => {
      switch (layer) {
        case 'hotspots':
          return { showHotspots: !state.showHotspots };
        case 'peatland':
          return { showPeatland: !state.showPeatland };
        case 'airQuality':
          return { showAirQuality: !state.showAirQuality };
        case 'heatmap':
          return { isHeatmapMode: !state.isHeatmapMode };
      }
    }),

  setTimeframe: (timeframe) => set({ timeframe }),
  setSatelliteFilter: (satelliteFilter) => set({ satelliteFilter }),
  setConfidenceFilter: (confidenceFilter) => set({ confidenceFilter }),
  setOnlyPeatland: (onlyPeatland) => set({ onlyPeatland }),
}));
