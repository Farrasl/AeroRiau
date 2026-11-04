import type { Metadata } from 'next';
import 'mapbox-gl/dist/mapbox-gl.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'GIS Pemantauan Titik Panas & Kualitas Udara Riau',
  description: 'Sistem Pemantauan Titik Panas (Hotspot) & Kualitas Udara Real-Time Provinsi Riau menggunakan NASA FIRMS, Open-Meteo, Next.js, dan PostGIS.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
