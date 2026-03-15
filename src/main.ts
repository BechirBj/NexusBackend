import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
const cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // global validation pipe for DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // parse cookies
  app.use(cookieParser());

  // enable CORS
  app.enableCors({
    exposedHeaders: ["Set-Cookie"],
    origin: /^http:\/\/localhost:\d+$/, // allow any localhost port
    credentials: true,  
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
                // allow cookies
    allowedHeaders: [
"Origin",
"Content-Type",
"Accept",
"Authorization",
"X-Request-With",
], // allow auth header
  });

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') ?? 7373;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}
bootstrap();