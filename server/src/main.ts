import './instrument';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { auth } from './utils/auth';
import { toNodeHandler } from 'better-auth/node';
import { LoggingInterceptor } from './interceptors/logger.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    logger: ['log', 'error', 'warn', 'debug', 'verbose', 'fatal'],
  });
  app.useGlobalInterceptors(new LoggingInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, disableErrorMessages: false }),
  );

  app.enableCors({
    origin: 'http://localhost:3001', // ✅ Next.js port
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('School Management System API')
    .setDescription('The API documentation for the School Management System')
    .setVersion('1.0')
    .addTag('school-management')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  app.use('/api/auth', toNodeHandler(auth.handler));
  await app.listen(process.env.PORT ?? 3000);
  Logger.log('App running on port 3000');
}
bootstrap();
