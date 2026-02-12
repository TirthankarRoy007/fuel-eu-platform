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
    },
  })
  console.log({ route1 })

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
  })
