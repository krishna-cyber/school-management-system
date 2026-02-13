import './instrument';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Required for better-auth
  });

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, disableErrorMessages: true }),
  );

  const config = new DocumentBuilder()
    .setTitle('School Management System API')
    .setDescription('The API documentation for the School Management System')
    .setVersion('1.0')
    .addTag('school-management')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
