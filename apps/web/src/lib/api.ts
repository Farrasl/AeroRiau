import {
  GeoJsonFeatureCollection,
  HotspotItem,
  AirQualityStation,
  DashboardStats,
  HotspotFilterParams,
} from '@riau-gis/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function fetchHotspots(
  filters: HotspotFilterParams = {}
): Promise<GeoJsonFeatureCollection<HotspotItem>> {
  try {
    const params = new URLSearchParams();
    if (filters.timeframe) params.append('timeframe', filters.timeframe);
    if (filters.satellite) params.append('satellite', filters.satellite);
    if (filters.confidence) params.append('confidence', filters.confidence);
    if (filters.onlyPeatland) params.append('onlyPeatland', 'true');

    const res = await fetch(`${API_BASE}/hotspots?${params.toString()}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch hotspots');
    return await res.json();
  } catch {
    // Fallback client mock if backend is starting or offline
    return getFallbackHotspots();
  }
}

export async function fetchAirQualityStations(refresh = false): Promise<AirQualityStation[]> {
  try {
    const url = refresh
      ? `${API_BASE}/air-quality/stations?refresh=true`
      : `${API_BASE}/air-quality/stations`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch stations');
    return await res.json();
  } catch {
    return getFallbackStations();
  }
}

export async function fetchPeatlandPolygons(): Promise<GeoJsonFeatureCollection<any>> {
  try {
    const res = await fetch(`${API_BASE}/peatlands`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch peatlands');
    return await res.json();
  } catch {
    return getFallbackPeatlands();
  }
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const res = await fetch(`${API_BASE}/stats/summary`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch summary stats');
    return await res.json();
  } catch {
    return {
      totalHotspots24h: 38,
      highConfidenceCount: 14,
      peatlandHotspotsCount: 26,
      maxFRP: 42.6,
      topDistricts: [
        { district: 'Bengkalis', count: 12 },
        { district: 'Pelalawan', count: 9 },
        { district: 'Rokan Hilir', count: 8 },
        { district: 'Siak', count: 5 },
        { district: 'Dumai', count: 4 },
      ],
      averageAQI: 78,
      lastSyncTime: new Date().toISOString(),
    };
  }
}

export async function triggerManualSync(): Promise<{ count: number; source: string }> {
  const res = await fetch(`${API_BASE}/hotspots/sync`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to trigger sync');
  return await res.json();
}

// -------------------------------------------------------------
// Fallback data helpers for offline / instant render
// -------------------------------------------------------------

function getFallbackHotspots(): GeoJsonFeatureCollection<HotspotItem> {
  const mockItems: HotspotItem[] = [
    {
      id: 'hs-1',
      latitude: 1.4582,
      longitude: 101.9842,
      brightness: 334.5,
      acqDate: new Date().toISOString().split('T')[0],
      acqTime: '0630',
      satellite: 'VIIRS_SNPP',
      instrument: 'VIIRS',
      confidence: 'high',
      frp: 32.4,
      dayNight: 'D',
      district: 'Bengkalis',
      subDistrict: 'Bukit Batu',
      isInPeatland: true,
      peatlandType: 'GAMBUT_DALAM',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'hs-2',
      latitude: 0.3842,
      longitude: 101.8924,
      brightness: 328.2,
      acqDate: new Date().toISOString().split('T')[0],
      acqTime: '0635',
      satellite: 'VIIRS_SNPP',
      instrument: 'VIIRS',
      confidence: 'nominal',
      frp: 18.2,
      dayNight: 'D',
      district: 'Pelalawan',
      subDistrict: 'Teluk Meranti',
      isInPeatland: true,
      peatlandType: 'GAMBUT_SANGAT_DALAM',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'hs-3',
      latitude: 2.1245,
      longitude: 100.8241,
      brightness: 341.0,
      acqDate: new Date().toISOString().split('T')[0],
      acqTime: '0632',
      satellite: 'MODIS',
      instrument: 'MODIS',
      confidence: 'high',
      frp: 41.5,
      dayNight: 'D',
      district: 'Rokan Hilir',
      subDistrict: 'Kubu',
      isInPeatland: true,
      peatlandType: 'GAMBUT_SEDANG',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'hs-4',
      latitude: 0.7812,
      longitude: 101.9214,
      brightness: 318.5,
      acqDate: new Date().toISOString().split('T')[0],
      acqTime: '0630',
      satellite: 'VIIRS_SNPP',
      instrument: 'VIIRS',
      confidence: 'nominal',
      frp: 12.0,
      dayNight: 'D',
      district: 'Siak',
      subDistrict: 'Sungai Apit',
      isInPeatland: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'hs-5',
      latitude: 1.6214,
      longitude: 101.4512,
      brightness: 322.8,
      acqDate: new Date().toISOString().split('T')[0],
      acqTime: '0638',
      satellite: 'VIIRS_SNPP',
      instrument: 'VIIRS',
      confidence: 'high',
      frp: 28.1,
      dayNight: 'D',
      district: 'Dumai',
      subDistrict: 'Medang Kampai',
      isInPeatland: true,
      peatlandType: 'GAMBUT_DALAM',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'hs-6',
      latitude: -0.3124,
      longitude: 103.0412,
      brightness: 312.4,
      acqDate: new Date().toISOString().split('T')[0],
      acqTime: '0640',
      satellite: 'VIIRS_SNPP',
      instrument: 'VIIRS',
      confidence: 'low',
      frp: 6.8,
      dayNight: 'D',
      district: 'Indragiri Hilir',
      subDistrict: 'Gaung Anak Serka',
      isInPeatland: true,
      peatlandType: 'GAMBUT_DALAM',
      createdAt: new Date().toISOString(),
    },
  ];

  return {
    type: 'FeatureCollection',
    features: mockItems.map((h) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [h.longitude, h.latitude] },
      properties: h,
    })),
  };
}

function getFallbackStations(): AirQualityStation[] {
  return [
    {
      id: 'st-pekanbaru',
      name: 'Stasiun Pekanbaru (Tampan/Pusat)',
      city: 'Pekanbaru',
      latitude: 0.5071,
      longitude: 101.4478,
      aqi: 68,
      category: 'MODERATE',
      pm25: 24.5,
      pm10: 42.0,
      temperature: 31.2,
      humidity: 74,
      windSpeed: 8.5,
      windDirection: 135,
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'st-dumai',
      name: 'Stasiun Kota Dumai (Pelabuhan)',
      city: 'Dumai',
      latitude: 1.6671,
      longitude: 101.4431,
      aqi: 112,
      category: 'UNHEALTHY_SENSITIVE',
      pm25: 45.2,
      pm10: 68.0,
      temperature: 32.5,
      humidity: 71,
      windSpeed: 12.0,
      windDirection: 140,
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'st-duri',
      name: 'Stasiun Mandau (Duri Camp)',
      city: 'Bengkalis',
      latitude: 1.2725,
      longitude: 101.2173,
      aqi: 154,
      category: 'UNHEALTHY',
      pm25: 64.0,
      pm10: 95.5,
      temperature: 30.8,
      humidity: 76,
      windSpeed: 10.2,
      windDirection: 120,
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'st-siak',
      name: 'Stasiun Siak Sri Indrapura',
      city: 'Siak',
      latitude: 0.7975,
      longitude: 102.0494,
      aqi: 75,
      category: 'MODERATE',
      pm25: 28.0,
      pm10: 48.0,
      temperature: 31.0,
      humidity: 72,
      windSpeed: 7.4,
      windDirection: 130,
      updatedAt: new Date().toISOString(),
    },
  ];
}

function getFallbackPeatlands(): GeoJsonFeatureCollection<any> {
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          id: 'khg-giam-siak-kecil',
          name: 'KHG Sungai Siak Kecil - Giam Siak Kecil',
          type: 'GAMBUT_DALAM',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [101.85, 1.15],
              [102.20, 1.25],
              [102.35, 1.05],
              [102.10, 0.85],
              [101.75, 0.95],
              [101.85, 1.15],
            ],
          ],
        },
      },
      {
        type: 'Feature',
        properties: {
          id: 'khg-semenanjung-kampar',
          name: 'KHG Semenanjung Kampar (Kubah Gambut Sangat Dalam)',
          type: 'GAMBUT_SANGAT_DALAM',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [102.15, 0.65],
              [103.10, 0.70],
              [103.25, 0.25],
              [102.50, 0.15],
              [102.15, 0.65],
            ],
          ],
        },
      },
    ],
  };
}
