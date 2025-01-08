import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', // Allows all origins to make requests
  });

  app.use(bodyParser.json({ limit: '50mb' }));  
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,  // Strips out any properties not defined in the DTO
      forbidNonWhitelisted: true,  // Throws error if extra properties are sent
      transform: true,  // Automatically transforms payloads to DTO instances
    }),
  );

  await app.listen(3000);
}

bootstrap();
