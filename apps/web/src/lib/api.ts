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
    return getFallbackHotspots(filters);
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

function getFallbackHotspots(filters: HotspotFilterParams = {}): GeoJsonFeatureCollection<HotspotItem> {
  const now = Date.now();

  // 55 Realistic hotspot distribution across Riau across 7 days
  const baseClusters = [
    { district: 'Bengkalis', sub: 'Bukit Batu', lat: 1.4582, lon: 101.9842, peat: true, peatType: 'GAMBUT_DALAM' },
    { district: 'Bengkalis', sub: 'Siak Kecil', lat: 1.2841, lon: 102.1245, peat: true, peatType: 'GAMBUT_SANGAT_DALAM' },
    { district: 'Pelalawan', sub: 'Teluk Meranti', lat: 0.3842, lon: 101.8924, peat: true, peatType: 'GAMBUT_SANGAT_DALAM' },
    { district: 'Pelalawan', sub: 'Kuala Kampar', lat: 0.5123, lon: 103.1124, peat: true, peatType: 'GAMBUT_DALAM' },
    { district: 'Rokan Hilir', sub: 'Kubu', lat: 2.1245, lon: 100.8241, peat: true, peatType: 'GAMBUT_SEDANG' },
    { district: 'Rokan Hilir', sub: 'Bangko Pusako', lat: 1.8942, lon: 100.7412, peat: true, peatType: 'GAMBUT_DALAM' },
    { district: 'Siak', sub: 'Sungai Apit', lat: 0.7812, lon: 101.9214, peat: false, peatType: undefined },
    { district: 'Siak', sub: 'Dayun', lat: 0.6912, lon: 102.0412, peat: true, peatType: 'GAMBUT_SEDANG' },
    { district: 'Dumai', sub: 'Medang Kampai', lat: 1.6214, lon: 101.4512, peat: true, peatType: 'GAMBUT_DALAM' },
    { district: 'Dumai', sub: 'Sungai Sembilan', lat: 1.7412, lon: 101.2841, peat: true, peatType: 'GAMBUT_DALAM' },
    { district: 'Indragiri Hilir', sub: 'Gaung Anak Serka', lat: -0.3124, lon: 103.0412, peat: true, peatType: 'GAMBUT_DALAM' },
    { district: 'Indragiri Hilir', sub: 'Tempuling', lat: -0.4214, lon: 102.9412, peat: true, peatType: 'GAMBUT_SANGAT_DALAM' },
    { district: 'Kampar', sub: 'Tambang', lat: 0.3541, lon: 101.2841, peat: false, peatType: undefined },
    { district: 'Rokan Hulu', sub: 'Tambusai', lat: 1.1241, lon: 100.4812, peat: false, peatType: undefined },
  ];

  const pool: { item: HotspotItem; ageHours: number }[] = [];

  // Generate 55 deterministic items across different timeframes:
  // 15 items in 0-24h, 15 items in 24-48h, 25 items in 48-168h
  for (let i = 0; i < 55; i++) {
    const cluster = baseClusters[i % baseClusters.length];
    const latOffset = (((i * 7 + 13) % 40) - 20) * 0.008;
    const lonOffset = (((i * 11 + 17) % 40) - 20) * 0.009;

    let ageHours: number;
    if (i < 15) {
      // 0 - 24 hours (today)
      ageHours = 1 + (i * 1.5);
    } else if (i < 30) {
      // 24 - 48 hours (yesterday)
      ageHours = 25 + ((i - 15) * 1.4);
    } else {
      // 48 - 168 hours (2 - 7 days ago)
      ageHours = 49 + ((i - 30) * 4.6);
    }

    const itemDate = new Date(now - ageHours * 3600 * 1000);
    const dateStr = itemDate.toISOString().split('T')[0];
    const timeStr = `${String(itemDate.getHours()).padStart(2, '0')}${String(itemDate.getMinutes()).padStart(2, '0')}`;

    const conf: 'high' | 'nominal' | 'low' =
      i % 3 === 0 ? 'high' : i % 3 === 1 ? 'nominal' : 'low';
    const sat: 'VIIRS_SNPP' | 'MODIS' = i % 4 === 0 ? 'MODIS' : 'VIIRS_SNPP';
    const frp = parseFloat((12 + ((i * 13) % 38)).toFixed(1));

    pool.push({
      ageHours,
      item: {
        id: `fallback-hs-${i + 1}`,
        latitude: parseFloat((cluster.lat + latOffset).toFixed(4)),
        longitude: parseFloat((cluster.lon + lonOffset).toFixed(4)),
        brightness: parseFloat((315 + ((i * 9) % 35)).toFixed(1)),
        acqDate: dateStr,
        acqTime: timeStr,
        satellite: sat,
        instrument: sat === 'MODIS' ? 'MODIS' : 'VIIRS',
        confidence: conf,
        frp,
        dayNight: (i % 2 === 0) ? 'D' : 'N',
        district: cluster.district,
        subDistrict: cluster.sub,
        isInPeatland: cluster.peat,
        peatlandType: cluster.peatType as any,
        createdAt: itemDate.toISOString(),
      },
    });
  }

  // Filter by timeframe
  const maxAge =
    filters.timeframe === '48h' ? 48 : filters.timeframe === '7d' ? 168 : 24;

  let filtered = pool
    .filter((entry) => entry.ageHours <= maxAge)
    .map((entry) => entry.item);

  // Filter by satellite
  if (filters.satellite && filters.satellite !== 'ALL') {
    filtered = filtered.filter((h) => h.satellite === filters.satellite);
  }

  // Filter by confidence
  if (filters.confidence === 'high') {
    filtered = filtered.filter((h) => h.confidence === 'high');
  } else if (filters.confidence === 'nominal_high') {
    filtered = filtered.filter((h) => h.confidence === 'high' || h.confidence === 'nominal');
  }

  // Filter by peatland
  if (filters.onlyPeatland) {
    filtered = filtered.filter((h) => h.isInPeatland);
  }

  return {
    type: 'FeatureCollection',
    features: filtered.map((h) => ({
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
