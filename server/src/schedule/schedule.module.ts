import {
  MiddlewareConsumer,
  Module,
  NestMiddleware,
  NestModule,
} from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { TenantsMiddleware } from 'src/middlewares/tenants.middleware'
import { TenantConnectionProvider } from 'src/providers/tenant-connection.provider'
import { ModelProvider } from 'src/providers/tenant-models.provider'
import { ScheduleController } from './schedule.controller'
import { ScheduleService } from './schedule.service'
import { ScheduleSchema } from './schemas/schedule.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Schedule', schema: ScheduleSchema }]),
  ],
  controllers: [ScheduleController],
  providers: [
    ScheduleService,
    TenantConnectionProvider,
    ModelProvider.scheduleModel,
  ],
})
export class ScheduleModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddleware).forRoutes('*') // apply tenant middleware to all routes
  }
}
