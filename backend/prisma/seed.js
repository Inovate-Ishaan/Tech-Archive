const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// Seed script used to create a quick demo user and project in the local database.
// This helps developers test the login, OTP, and CRUD flow without manual setup.
const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_EMAIL || 'seed@iitbhilai.ac.in';
  const plain = process.env.SEED_PASSWORD || 'password123';
  const username = process.env.SEED_USERNAME || 'testuser';
  const instituteId = process.env.SEED_INSTITUTE || 'B25EC049';

  const hashed = await bcrypt.hash(plain, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      username,
      password: hashed,
      instituteId,
    },
  });

  await prisma.project.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      userId: user.id,
      title: 'Seed Project',
      description: 'A sample seeded project',
    },
  });

  console.log('Seed complete. Email:', email, 'Password:', plain);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
