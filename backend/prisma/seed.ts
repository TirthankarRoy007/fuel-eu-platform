import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Clear existing data to ensure seed values are applied
  await prisma.bankingRecord.deleteMany({});
  await prisma.route.deleteMany({});

  // Routes
  const route1 = await prisma.route.create({
    data: {
      id: 'r001',
      name: 'R001',
      is_baseline: true,
      fuelConsumptionTonnes: 100,
      ghgIntensity: 50.0, // High surplus
    },
  })

  const route2 = await prisma.route.create({
    data: {
      id: 'r002',
      name: 'R002',
      is_baseline: false,
      fuelConsumptionTonnes: 150,
      ghgIntensity: 92.0, // Deficit
    },
  })

  console.log({ route1, route2 })

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
