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
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://your-frontend-domain.com",
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') ?? 7373;
  await app.listen(port);
  
  console.log(`Server running on http://localhost:${port}`);
}
bootstrap();