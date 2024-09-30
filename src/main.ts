import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.setGlobalPrefix('api', {
    exclude: [
      //
    ],
  });

  await app.listen(3000, function() {
    console.log('App is ready at http://localhost:3000');
  });
}
bootstrap();
