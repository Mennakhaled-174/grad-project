import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';



async function bootstrap() {
  
  const app = await NestFactory.create(AppModule)



  
  app.use(helmet());

  
  app.enableCors({
  origin: 'http://127.0.0.1:5500', // VS Code Live Server default
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,forbidNonWhitelisted: true,transform: true,
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`Server is running on: http://localhost:${port}`);
}

bootstrap();
