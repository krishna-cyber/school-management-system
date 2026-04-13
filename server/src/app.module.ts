import { createKeyv } from '@keyv/redis'
import { BullModule } from '@nestjs/bullmq'
import { CacheModule } from '@nestjs/cache-manager'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { AuthModule } from '@thallesp/nestjs-better-auth'
import { LoggerModule } from 'pino-nestjs'
import { AnalyticsModule } from './analytics/analytics.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AttendanceModule } from './attendance/attendance.module'
import { AuthModule as AuthMo } from './auth/auth.module'
import { ClassModule } from './class/class.module'
import configuration from './config/configuration'
import { ExamModule } from './exam/exam.module'
import { FeeModule } from './fee/fee.module'
import { logger } from './logger.service'
import { LoggerMiddleware } from './middlewares/logger.middleware'
import { StudentModule } from './student/student.module'
import { TeacherModule } from './teacher/teacher.module'
import { auth } from './utils/auth'
@Module({
  imports: [
    AuthModule.forRoot({
      auth,
      bodyParser: {
        json: { limit: '2mb' },
        urlencoded: { limit: '2mb', extended: true },
        rawBody: true,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule, LoggerModule.forRoot()],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.connectionString'),
        autoIndex: true,
        onConnectionCreate(connection) {
          connection.on('connected', () => {
            logger.info('MongoDB connection established successfully', {
              connectionId: connection.id,
              connectionHost: connection.host,
              connectionPort: connection.port,
            })
          })
          connection.on('disconnected', () => {
            logger.warn('MongoDB connection disconnected', {
              connectionId: connection.id,
              connectionHost: connection.host,
              connectionPort: connection.port,
            })
          })
          return connection
        },
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        { name: 'short', limit: 3, ttl: seconds(4) },
        { name: 'medium', limit: 15, ttl: seconds(30) },
        { name: 'long', limit: 25, ttl: seconds(80) },
      ],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
        },
        defaultJobOptions: { attempts: 3 },
      }),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: (configService: ConfigService) => ({
        ttl: seconds(300), // default cache TTL of 5 minutes
        stores: [
          createKeyv(
            `redis://${configService.get('redis.host')}:${configService.get('redis.port')}`,
          ),
        ],
      }),
      inject: [ConfigService],
    }),
    StudentModule,
    TeacherModule,
    AnalyticsModule,
    ExamModule,
    ClassModule,
    FeeModule,
    AuthMo,
    AttendanceModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [MongooseModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*') // log all routes
  }
}
