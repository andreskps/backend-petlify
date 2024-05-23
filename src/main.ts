import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // prefijo para todas las rutas
  // app.useGlobalFilters(new HttpExceptionFilter());
  
  app.enableCors(); // habilita cors

  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // transforma los datos a su tipo de dato
      transformOptions: {
        enableImplicitConversion: true, // convierte los datos a su tipo de dato
      },
    }),
  );
  await app.listen(3000);
}
bootstrap();
