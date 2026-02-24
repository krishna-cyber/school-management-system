import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { FeeService } from './fee.service';
import { FeeController } from './fee.controller';

import { TenantsMiddleware } from 'src/middlewares/tenants.middleware';
import { TenantConnectionProvider } from 'src/providers/tenant-connection.provider';
import { ModelProvider } from 'src/providers/tenant-models.provider';

@Module({
  imports: [],
  controllers: [FeeController],
  providers: [
    FeeService,
    TenantConnectionProvider,
    ModelProvider.feeModel,
    ModelProvider.studentModel,
  ],
})
export class FeeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddleware).forRoutes(FeeController);
  }
}
