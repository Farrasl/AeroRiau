export type SatelliteType = 'VIIRS_SNPP' | 'VIIRS_NOAA20' | 'MODIS';

export type HotspotConfidence = 'low' | 'nominal' | 'high' | 'provisional';

export interface HotspotItem {
  id: string;
  latitude: number;
  longitude: number;
  brightness: number;
  scan?: number;
  track?: number;
  acqDate: string;
  acqTime: string;
  satellite: SatelliteType;
  instrument: 'VIIRS' | 'MODIS';
  confidence: HotspotConfidence;
  frp: number; // Fire Radiative Power (MW)
  dayNight: 'D' | 'N';
  district?: string;
  subDistrict?: string;
  isInPeatland: boolean;
  peatlandType?: string;
  distanceToPeatlandMeters?: number;
  createdAt: string;
}

export type AQICategory = 
  | 'GOOD'          // 0 - 50 (Hijau)
  | 'MODERATE'      // 51 - 100 (Biru)
  | 'UNHEALTHY_SENSITIVE' // 101 - 150 (Kuning)
  | 'UNHEALTHY'     // 151 - 200 (Merah)
  | 'VERY_UNHEALTHY'// 201 - 300 (Ungu)
  | 'HAZARDOUS';    // 300+ (Hitam/Coklat pekat)

export interface AirQualityStation {
  id: string;
  name: string;
  city: string;
  district?: string;
  latitude: number;
  longitude: number;
  aqi: number;
  category: AQICategory;
  pm25: number;           // µg/m³
  pm10?: number;          // µg/m³
  co?: number;            // µg/m³
  no2?: number;           // µg/m³
  o3?: number;            // µg/m³
  so2?: number;           // µg/m³
  temperature?: number;   // °C
  apparentTemperature?: number; // °C
  humidity?: number;      // %
  windSpeed?: number;     // km/h
  windDirection?: number; // 0-360 derajat
  windGusts?: number;     // km/h
  windCompass?: string;   // misal: 'Tenggara (135°)'
  soilMoisture?: number;  // m³/m³ (Indikator kelembaban gambut)
  peatDroughtRisk?: 'RENDAH' | 'SEDANG' | 'TINGGI' | 'EKSTRIM';
  hourlyForecast?: Array<{
    time: string;
    aqi: number;
    pm25: number;
    windSpeed: number;
    windDirection: number;
  }>;
  updatedAt: string;
}

export interface PeatlandZone {
  id: string;
  name: string;
  type: 'GAMBUT_DANGKAL' | 'GAMBUT_SEDANG' | 'GAMBUT_DALAM' | 'GAMBUT_SANGAT_DALAM' | 'KONSESI';
  district: string;
  areaHa: number;
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: any;
  };
}

export interface HotspotFilterParams {
  timeframe?: '24h' | '48h' | '7d' | '30d';
  satellite?: SatelliteType | 'ALL';
  confidence?: 'ALL' | 'nominal_high' | 'high';
  onlyPeatland?: boolean;
  district?: string;
}

export interface DashboardStats {
  totalHotspots24h: number;
  highConfidenceCount: number;
  peatlandHotspotsCount: number;
  maxFRP: number;
  topDistricts: Array<{ district: string; count: number }>;
  worstAQIStation?: AirQualityStation;
  averageAQI: number;
  lastSyncTime: string;
}

export interface GeoJsonFeatureCollection<T = any> {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    geometry: {
      type: 'Point' | 'Polygon' | 'MultiPolygon';
      coordinates: any;
    };
    properties: T;
  }>;
}
