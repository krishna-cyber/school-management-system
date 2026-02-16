/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SentryModule, SentryGlobalFilter } from '@sentry/nestjs/setup';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { logger } from '@sentry/nestjs';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ExamModule } from './exam/exam.module';
import { ClassModule } from './class/class.module';
import { FeeModule } from './fee/fee.module';
import configuration from './config/configuration';
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    SentryModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.connectionString'),
        autoIndex: true,
        onConnectionCreate(connection) {
          connection.on('connected', () => {
            logger.info('MongoDB connection established successfully', {
              connectionId: connection.id,
              connectionHost: connection.host,
              connectionPort: connection.port,
            });
          });
          connection.on('disconnected', () => {
            logger.warn('MongoDB connection disconnected', {
              connectionId: connection.id,
              connectionHost: connection.host,
              connectionPort: connection.port,
            });
          });
          return connection;
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
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
        },
      }),
      inject: [ConfigService],
    }),
    StudentModule,
    TeacherModule,
    AnalyticsModule,
    ExamModule,
    ClassModule,
    FeeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [MongooseModule],
})
export class AppModule {}
