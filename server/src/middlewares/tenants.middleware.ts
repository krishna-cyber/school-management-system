import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class TenantsMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.headers['x-tenant-id'];

    if (!tenantId) {
      throw new BadRequestException('x-tenant-id header is required');
    }
    const tenant = await this.authService.findOne(tenantId as string);
    console.log('tenant', tenant);
    if (!tenant) {
      throw new BadRequestException('Tenant not exists');
    }

    req['tenantId'] = tenantId;
    next();
  }
}
