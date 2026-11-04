import { Injectable } from '@nestjs/common';
import { HotspotService } from '../hotspot/hotspot.service';
import { AirQualityService } from '../air-quality/air-quality.service';
import { DashboardStats } from '@riau-gis/types';

@Injectable()
export class StatsService {
  constructor(
    private readonly hotspotService: HotspotService,
    private readonly airQualityService: AirQualityService,
  ) {}

  async getDashboardSummary(): Promise<DashboardStats> {
    const [hotspotsCollection, stations] = await Promise.all([
      this.hotspotService.getHotspotsGeoJson({ timeframe: '24h' }),
      this.airQualityService.getLatestStationsData(),
    ]);

    const hotspots = hotspotsCollection.features.map((f) => f.properties);
    const totalHotspots = hotspots.length;
    const highConfidence = hotspots.filter((h) => h.confidence === 'high').length;
    const peatlandHotspots = hotspots.filter((h) => h.isInPeatland).length;
    const maxFRP = hotspots.reduce((max, h) => Math.max(max, h.frp || 0), 0);

    // Count by district
    const districtCounts: Record<string, number> = {};
    hotspots.forEach((h) => {
      const dist = h.district || 'Lainnya';
      districtCounts[dist] = (districtCounts[dist] || 0) + 1;
    });

    const topDistricts = Object.entries(districtCounts)
      .map(([district, count]) => ({ district, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Worst AQI station
    const sortedStations = [...stations].sort((a, b) => b.aqi - a.aqi);
    const worstStation = sortedStations[0];
    const avgAqi = stations.length > 0 
      ? Math.round(stations.reduce((sum, s) => sum + s.aqi, 0) / stations.length) 
      : 50;

    return {
      totalHotspots24h: totalHotspots,
      highConfidenceCount: highConfidence,
      peatlandHotspotsCount: peatlandHotspots,
      maxFRP: parseFloat(maxFRP.toFixed(1)),
      topDistricts,
      worstAQIStation: worstStation,
      averageAQI: avgAqi,
      lastSyncTime: new Date().toISOString(),
    };
  }
}
