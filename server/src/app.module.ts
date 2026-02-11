/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SentryModule, SentryGlobalFilter } from '@sentry/nestjs/setup';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { logger } from '@sentry/nestjs';

@Module({
  imports: [
    SentryModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI as string, {
      onConnectionCreate(connection: Connection) {
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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
})
export class AppModule {}
