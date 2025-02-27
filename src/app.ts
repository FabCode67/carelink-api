require('dotenv').config();
import express, { Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

async function bootstrap() {
  // Health check route
  app.get('/api/healthchecker', async (_, res: Response) => {
    res.status(200).json({
      status: 'success',
      message: 'Server is running without Redis!',
    });
  });

  const port = process.env.PORT || 7000;
  app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
}

bootstrap()
  .catch((err) => {
    console.error(err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
