import { Global, Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { AuthController } from './auth.controller';

@Global()
@Module({
  imports: [],
  controllers: [AuthController],
  providers: [TenantService],
  exports: [TenantService],
})
export class AuthModule {}
