import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Riau GIS database...');

  // Ensure PostGIS extension
  try {
    await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS postgis;`);
    console.log('✅ PostGIS extension checked/enabled');
  } catch (e: any) {
    console.warn('⚠️ PostGIS check note:', e.message);
  }

  // Seed stations
  const stations = [
    { id: 'st-pekanbaru', name: 'Stasiun Pekanbaru (Tampan/Pusat)', city: 'Pekanbaru', latitude: 0.5071, longitude: 101.4478 },
    { id: 'st-dumai', name: 'Stasiun Kota Dumai (Pelabuhan)', city: 'Dumai', latitude: 1.6671, longitude: 101.4431 },
    { id: 'st-duri', name: 'Stasiun Mandau (Duri Camp)', city: 'Bengkalis', latitude: 1.2725, longitude: 101.2173 },
    { id: 'st-siak', name: 'Stasiun Siak Sri Indrapura', city: 'Siak', latitude: 0.7975, longitude: 102.0494 },
    { id: 'st-pelalawan', name: 'Stasiun Pangkalan Kerinci', city: 'Pelalawan', latitude: 0.3842, longitude: 101.8542 },
  ];

  for (const st of stations) {
    await prisma.airQualityStation.upsert({
      where: { name: st.name },
      update: {},
      create: {
        id: st.id,
        name: st.name,
        city: st.city,
        latitude: st.latitude,
        longitude: st.longitude,
      },
    });
  }

  console.log(`✅ Seeded ${stations.length} air quality monitoring stations in Riau.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
