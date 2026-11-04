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
    frp: number;
    dayNight: 'D' | 'N';
    district?: string;
    subDistrict?: string;
    isInPeatland: boolean;
    peatlandType?: string;
    distanceToPeatlandMeters?: number;
    createdAt: string;
}
export type AQICategory = 'GOOD' | 'MODERATE' | 'UNHEALTHY_SENSITIVE' | 'UNHEALTHY' | 'VERY_UNHEALTHY' | 'HAZARDOUS';
export interface AirQualityStation {
    id: string;
    name: string;
    city: string;
    district?: string;
    latitude: number;
    longitude: number;
    aqi: number;
    category: AQICategory;
    pm25: number;
    pm10?: number;
    co?: number;
    no2?: number;
    o3?: number;
    so2?: number;
    temperature?: number;
    apparentTemperature?: number;
    humidity?: number;
    windSpeed?: number;
    windDirection?: number;
    windGusts?: number;
    windCompass?: string;
    soilMoisture?: number;
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
    geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon;
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
    topDistricts: Array<{
        district: string;
        count: number;
    }>;
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
