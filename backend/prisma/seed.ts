import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Routes
  const route1 = await prisma.route.upsert({
    where: { id: 'r001' },
    update: {},
    create: {
      id: 'r001',
      name: 'R001',
      is_baseline: true,
      fuelConsumptionTonnes: 100,
      ghgIntensity: 85.0,
    },
  })

  const route2 = await prisma.route.upsert({
    where: { id: 'r002' },
    update: {},
    create: {
      id: 'r002',
      name: 'R002',
      is_baseline: false,
      fuelConsumptionTonnes: 150,
      ghgIntensity: 92.0,
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
