import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //  CORS для фронтенда
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.info(`Server started: http://localhost:${port}`);
}
void bootstrap();
