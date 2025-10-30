import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express'; // Import express

// Add this line to handle BigInt serialization
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  // 1. Disable the default body parser
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  // 2. Add the global validation pipe (your existing code is perfect here)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 3. Manually add the body parsers for JSON and URL-encoded data.
  //    This is necessary because we disabled the default one.
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));


  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:3001', 'https://haryana-job-alerts.vercel.app', 'http://localhost:3000', "https://theharyanajobalert.com"], // Your Next.js app's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();