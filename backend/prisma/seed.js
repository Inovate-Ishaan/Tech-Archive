require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const users = require('./data/users');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log('Starting database seed...');

  await prisma.post.deleteMany();
  await prisma.otp.deleteMany();
  await prisma.user.deleteMany();

  console.log('Creating users...');
  const hashed = await bcrypt.hash('password123', 10);
  await prisma.user.createMany({
    data: users.map((u) => ({ ...u, password: hashed, emailVerified: true })),
  });
  console.log('Users seeded');

  console.log('Generating posts...');
  const dbUsers = await prisma.user.findMany();

  for (let i = 0; i < 15; i++) {
    const author = dbUsers[i % dbUsers.length];
    await prisma.post.create({
      data: {
        title: `Sample post #${i + 1}`,
        content: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        coverImage: `/posts/post${(i % 10) + 1}.jpg`,
        authorId: author.id,
        createdAt: new Date(Date.now() - randomInt(0, 90) * 86400000),
      },
    });
  }
  console.log('Posts seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
