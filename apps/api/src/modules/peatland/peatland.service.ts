import { Injectable } from '@nestjs/common';
import { GeoJsonFeatureCollection, PeatlandZone } from '@riau-gis/types';

@Injectable()
export class PeatlandService {
  /**
   * Return GeoJSON Polygon for prominent Riau Peatland Hydrological Units (KHG)
   */
  getPeatlandGeoJson(): GeoJsonFeatureCollection<Partial<PeatlandZone>> {
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            id: 'khg-giam-siak-kecil',
            name: 'KHG Sungai Siak Kecil - Sungai Rokan (Giam Siak Kecil)',
            type: 'GAMBUT_DALAM',
            district: 'Siak & Bengkalis',
            areaHa: 178500,
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
            district: 'Pelalawan & Siak',
            areaHa: 420000,
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
        {
          type: 'Feature',
          properties: {
            id: 'khg-pulau-bengkalis',
            name: 'KHG Pulau Bengkalis',
            type: 'GAMBUT_DALAM',
            district: 'Bengkalis',
            areaHa: 89000,
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [102.05, 1.55],
                [102.50, 1.48],
                [102.40, 1.25],
                [101.95, 1.35],
                [102.05, 1.55],
              ],
            ],
          },
        },
        {
          type: 'Feature',
          properties: {
            id: 'khg-rohil-kubah',
            name: 'KHG Kubah Gambut Rokan Hilir & Kubu',
            type: 'GAMBUT_SEDANG',
            district: 'Rokan Hilir',
            areaHa: 135000,
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [100.55, 2.15],
                [101.10, 2.05],
                [100.95, 1.65],
                [100.45, 1.75],
                [100.55, 2.15],
              ],
            ],
          },
        },
        {
          type: 'Feature',
          properties: {
            id: 'khg-kerumutan',
            name: 'Suaka Margasatwa & Kubah Gambut Kerumutan',
            type: 'GAMBUT_SANGAT_DALAM',
            district: 'Pelalawan & Inhu',
            areaHa: 120000,
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [102.30, 0.05],
                [102.80, 0.10],
                [102.75, -0.30],
                [102.25, -0.25],
                [102.30, 0.05],
              ],
            ],
          },
        },
      ],
    };
  }
}
