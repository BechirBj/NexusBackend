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
    origin: ['https://www.your-frontend-domain.com', 'http://localhost:7373'], // Use an array or string
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Needed if you use cookies or authorization headers
    allowedHeaders: 'Content-Type, Authorization',
  });

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') ?? 7373;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}
bootstrap();