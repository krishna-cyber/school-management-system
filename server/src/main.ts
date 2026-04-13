// THIS MUST BE THE FIRST IMPORT
import './tracer'
import { ValidationPipe } from '@nestjs/common'
// Now import NestJS and other application modules
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Logger } from 'pino-nestjs'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    bufferLogs: true,
  })

  app.useLogger(app.get(Logger))

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, disableErrorMessages: false }),
  )

  app.enableCors({
    origin: 'http://localhost:3001', // ✅ Next.js port
    credentials: true,
  })

  const config = new DocumentBuilder()
    .setTitle('School Management System API')
    .setDescription('The API documentation for the School Management System')
    .setVersion('1.0')
    .addTag('school-management')
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, documentFactory)
  await app.listen(process.env.PORT ?? 3000)
  console.log(`Server is running on port ${process.env.PORT ?? 3000}`)
}
bootstrap()
