'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { useMapStore } from '@/stores/useMapStore';
import { HotspotItem, AirQualityStation, GeoJsonFeatureCollection } from '@riau-gis/types';

interface MapViewProps {
  hotspotsData: GeoJsonFeatureCollection<HotspotItem>;
  peatlandsData: GeoJsonFeatureCollection<any>;
  stationsData: AirQualityStation[];
}

const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Compatible glyphs for both Mapbox and OpenMapTiles font stacks
const GLYPHS_URL =
  token && token.trim() !== ''
    ? 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf'
    : 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf';

const CARTO_DARK_STYLE: any = {
  version: 8,
  glyphs: GLYPHS_URL,
  sources: {
    'carto-dark': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors, © CARTO',
    },
  },
  layers: [
    {
      id: 'carto-dark-layer',
      type: 'raster',
      source: 'carto-dark',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

// High-resolution ESRI World Imagery + Boundaries/Places
// Free, fast, zero rate limit (avoids Mapbox satellite 429 Too Many Requests)
const SATELLITE_STYLE: any = {
  version: 8,
  glyphs: GLYPHS_URL,
  sources: {
    'esri-satellite': {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      ],
      tileSize: 256,
      maxzoom: 19,
      attribution:
        'Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, USDA, USGS, AeroGRID, IGN, and the GIS User Community',
    },
    'esri-boundaries': {
      type: 'raster',
      tiles: [
        'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      ],
      tileSize: 256,
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: 'esri-satellite-layer',
      type: 'raster',
      source: 'esri-satellite',
      minzoom: 0,
      maxzoom: 22,
    },
    {
      id: 'esri-boundaries-layer',
      type: 'raster',
      source: 'esri-boundaries',
      minzoom: 0,
      maxzoom: 22,
    },
  ],
};

export function MapView({ hotspotsData, peatlandsData, stationsData }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const stationMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const previousStyleRef = useRef<string>('dark');

  const hotspotsDataRef = useRef(hotspotsData);
  const peatlandsDataRef = useRef(peatlandsData);

  useEffect(() => {
    hotspotsDataRef.current = hotspotsData;
  }, [hotspotsData]);

  useEffect(() => {
    peatlandsDataRef.current = peatlandsData;
  }, [peatlandsData]);

  const {
    showHotspots,
    showPeatland,
    showAirQuality,
    mapStyle,
    setSelectedHotspot,
    setSelectedStation,
  } = useMapStore();

  const showHotspotsRef = useRef(showHotspots);
  const showPeatlandRef = useRef(showPeatland);

  useEffect(() => {
    showHotspotsRef.current = showHotspots;
  }, [showHotspots]);

  useEffect(() => {
    showPeatlandRef.current = showPeatland;
  }, [showPeatland]);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const getStyleConfig = useCallback(
    (style: 'dark' | 'satellite') => {
      if (style === 'satellite') {
        return SATELLITE_STYLE;
      }
      return token && token.trim() !== '' ? 'mapbox://styles/mapbox/dark-v11' : CARTO_DARK_STYLE;
    },
    [token]
  );

  // Helper to attach or restore spatial layers and sources
  const setupLayers = useCallback((map: mapboxgl.Map) => {
    if (!map) return;
    try {
      if (!map.getStyle()) return;
    } catch {
      return;
    }

    const currentPeatlands = peatlandsDataRef.current || { type: 'FeatureCollection', features: [] };
    const currentHotspots = hotspotsDataRef.current || { type: 'FeatureCollection', features: [] };

    // 1. Add or update Peatland Polygons Layer
    const existingPeatlandSource = map.getSource('peatlands') as mapboxgl.GeoJSONSource | undefined;
    if (existingPeatlandSource) {
      existingPeatlandSource.setData(currentPeatlands as any);
    } else {
      map.addSource('peatlands', {
        type: 'geojson',
        data: currentPeatlands as any,
      });
    }

    if (!map.getLayer('peatland-fill') && map.getSource('peatlands')) {
      map.addLayer({
        id: 'peatland-fill',
        type: 'fill',
        source: 'peatlands',
        layout: {
          visibility: showPeatlandRef.current ? 'visible' : 'none',
        },
        paint: {
          'fill-color': '#10b981',
          'fill-opacity': 0.28,
        },
      });
    }

    if (!map.getLayer('peatland-line') && map.getSource('peatlands')) {
      map.addLayer({
        id: 'peatland-line',
        type: 'line',
        source: 'peatlands',
        layout: {
          visibility: showPeatlandRef.current ? 'visible' : 'none',
        },
        paint: {
          'line-color': '#059669',
          'line-width': 1.8,
          'line-dasharray': [2, 2],
        },
      });
    }

    // 2. Add or update Hotspots Layer (with clustering)
    const existingHotspotSource = map.getSource('hotspots') as mapboxgl.GeoJSONSource | undefined;
    if (existingHotspotSource) {
      existingHotspotSource.setData(currentHotspots as any);
    } else {
      map.addSource('hotspots', {
        type: 'geojson',
        data: currentHotspots as any,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });
    }

    const hotspotVisibility = showHotspotsRef.current ? 'visible' : 'none';

    if (map.getSource('hotspots')) {
      // Clusters circle
      if (!map.getLayer('clusters')) {
        map.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'hotspots',
          filter: ['has', 'point_count'],
          layout: {
            visibility: hotspotVisibility,
          },
          paint: {
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#f97316',
              5,
              '#ea580c',
              15,
              '#dc2626',
            ],
            'circle-radius': ['step', ['get', 'point_count'], 18, 5, 24, 15, 30],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
            'circle-opacity': 0.95,
          },
        });
      }

      // Cluster count labels
      if (!map.getLayer('cluster-count')) {
        map.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'hotspots',
          filter: ['has', 'point_count'],
          layout: {
            visibility: hotspotVisibility,
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Pro Bold', 'Arial Unicode MS Bold'],
            'text-size': 12,
          },
          paint: {
            'text-color': '#ffffff',
          },
        });
      }

      // Individual unclustered hotspot points
      if (!map.getLayer('unclustered-point')) {
        map.addLayer({
          id: 'unclustered-point',
          type: 'circle',
          source: 'hotspots',
          filter: ['!', ['has', 'point_count']],
          layout: {
            visibility: hotspotVisibility,
          },
          paint: {
            'circle-color': [
              'case',
              ['==', ['get', 'confidence'], 'high'],
              '#ef4444',
              ['==', ['get', 'confidence'], 'nominal'],
              '#f97316',
              '#eab308',
            ],
            'circle-radius': 8,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
          },
        });
      }
    }
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapContainer.current) return;

    if (token && token.trim() !== '') {
      mapboxgl.accessToken = token;
    } else {
      mapboxgl.accessToken = 'dummy-token';
    }

    const styleConfig = getStyleConfig(mapStyle);
    previousStyleRef.current = mapStyle;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: styleConfig,
      projection: 'mercator', // Explicit mercator prevents globe transition threshold crash
      center: [101.70, 0.70], // Centered on Riau Province
      zoom: 7.2,
      maxZoom: 16,
      minZoom: 5.5,
    });

    mapRef.current = map;

    // Suppress minor tile/resource warnings from bubbling to console.error
    map.on('error', (e) => {
      console.warn('Mapbox notice:', e?.error?.message || e);
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), 'top-right');
    map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    // Register click and hover events once on the map instance
    map.on('click', 'clusters', (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
      if (!features.length) return;
      const clusterId = features[0].properties?.cluster_id;
      const source = map.getSource('hotspots') as mapboxgl.GeoJSONSource | undefined;
      if (!source || clusterId === undefined) return;
      source.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        map.easeTo({
          center: (features[0].geometry as any).coordinates,
          zoom: zoom ?? 9,
        });
      });
    });

    map.on('click', 'unclustered-point', (e) => {
      if (!e.features || e.features.length === 0) return;
      const props = e.features[0].properties as any;
      if (props) {
        setSelectedHotspot(props);
      }
    });

    map.on('mouseenter', 'clusters', () => {
      if (map.getCanvas()) map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', () => {
      if (map.getCanvas()) map.getCanvas().style.cursor = '';
    });
    map.on('mouseenter', 'unclustered-point', () => {
      if (map.getCanvas()) map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'unclustered-point', () => {
      if (map.getCanvas()) map.getCanvas().style.cursor = '';
    });

    map.on('load', () => {
      setupLayers(map);
    });

    map.on('style.load', () => {
      setupLayers(map);
    });

    return () => {
      mapRef.current = null;
      stationMarkersRef.current.forEach((m) => m.remove());
      stationMarkersRef.current = [];
      map.remove();
    };
  }, []); // Run once on mount

  // Switch basemap style (Dark vs Satellite Streets)
  useEffect(() => {
    if (!mapRef.current) return;
    if (previousStyleRef.current === mapStyle) return;
    previousStyleRef.current = mapStyle;

    const map = mapRef.current;
    const targetStyle = getStyleConfig(mapStyle);

    // Use { diff: false } to cleanly rebuild without failing unimplemented style diffs
    // Spatial layers are automatically restored via the map.on('style.load') listener
    map.setStyle(targetStyle, { diff: false } as any);
  }, [mapStyle, getStyleConfig]);

  // Update hotspots GeoJSON source when data changes
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const source = map.getSource('hotspots') as mapboxgl.GeoJSONSource | undefined;
    if (source && hotspotsData) {
      source.setData(hotspotsData as any);
    }
  }, [hotspotsData]);

  // Update peatlands GeoJSON source when data changes
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const source = map.getSource('peatlands') as mapboxgl.GeoJSONSource | undefined;
    if (source && peatlandsData) {
      source.setData(peatlandsData as any);
    }
  }, [peatlandsData]);

  // Update Peatlands layer visibility
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const visibility = showPeatland ? 'visible' : 'none';
    if (map.getLayer('peatland-fill')) {
      map.setLayoutProperty('peatland-fill', 'visibility', visibility);
    }
    if (map.getLayer('peatland-line')) {
      map.setLayoutProperty('peatland-line', 'visibility', visibility);
    }
  }, [showPeatland]);

  // Update Hotspots layer visibility
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const visibility = showHotspots ? 'visible' : 'none';
    ['clusters', 'cluster-count', 'unclustered-point'].forEach((layerId) => {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', visibility);
      }
    });
  }, [showHotspots]);

  // Render Air Quality Station Markers
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // Clear existing markers
    stationMarkersRef.current.forEach((m) => m.remove());
    stationMarkersRef.current = [];

    if (!showAirQuality || !stationsData || !stationsData.length) return;

    stationsData.forEach((st) => {
      const el = document.createElement('div');
      el.className = 'station-marker group cursor-pointer transition-transform hover:scale-110 select-none';

      const windDeg = st.windDirection ?? 0;
      const aqiBg =
        st.aqi <= 50
          ? 'bg-emerald-600/95 border-emerald-400'
          : st.aqi <= 100
          ? 'bg-amber-600/95 border-amber-400'
          : st.aqi <= 150
          ? 'bg-orange-600/95 border-orange-400'
          : 'bg-rose-600/95 border-rose-400';

      el.innerHTML = `
        <div class="flex items-center space-x-1.5 px-2 py-1 rounded-lg text-white font-bold text-[10px] shadow-xl border ${aqiBg} backdrop-blur-sm">
          <span>${st.city}</span>
          <span class="bg-black/40 px-1 py-0.5 rounded font-mono">${st.aqi}</span>
          <span title="Arah Angin: ${st.windCompass || windDeg + '°'}" class="inline-block text-[11px] transform origin-center transition-transform" style="transform: rotate(${windDeg}deg)">
            ➤
          </span>
        </div>
      `;

      el.addEventListener('click', () => {
        setSelectedStation(st);
      });

      try {
        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([st.longitude, st.latitude])
          .addTo(map);

        stationMarkersRef.current.push(marker);
      } catch (err) {
        console.warn('Failed to add station marker:', err);
      }
    });
  }, [stationsData, showAirQuality, setSelectedStation]);

  return <div ref={mapContainer} className="w-full h-full min-h-[600px] relative" />;
}
