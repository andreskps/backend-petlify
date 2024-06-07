import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // prefijo para todas las rutas
  // app.useGlobalFilters(new HttpExceptionFilter());

  const allowedOrigins = [process.env.URL_ECOMMERCE, process.env.URL_ADMIN];

  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      console.log('Origin:', origin);
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
      
        callback(null, false);
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  };

  app.enableCors(corsOptions);

  // Middleware para manejar errores CORS
  app.use((req, res, next) => {
    if (
      !req.headers.origin ||
      allowedOrigins.indexOf(req.headers.origin) !== -1
    ) {
      next();
    } else {
      res.status(403).json({ message: 'Not allowed by CORS' });
    }
  });

  app.use(cookieParser());

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

  // app.enableCors({
  //   origin:[
  //     'http://localhost:3001'
  //   ],
  //   methods:['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
  //   credentials:true
  // }); // habilita cors
  await app.listen(3000);
}
bootstrap();
