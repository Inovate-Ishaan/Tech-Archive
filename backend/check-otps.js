const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

(async () => {
  try {
    const otps = await prisma.otp.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' }
    });
    console.log(JSON.stringify(otps, null, 2));
  } finally {
    await prisma.$disconnect();
  }
})();
