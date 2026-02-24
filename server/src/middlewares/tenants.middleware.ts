import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantService } from 'src/tenant/tenant.service';

@Injectable()
export class TenantsMiddleware implements NestMiddleware {
  constructor(private readonly tenantService: TenantService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.headers['x-tenant-id'];
    if (!tenantId) {
      throw new BadRequestException('x-tenant-id header is required');
    }
    const tenant = await this.tenantService.findOne(tenantId.toString());
    if (!tenant) {
      throw new BadRequestException('Tenant not exists');
    }

    req['tenantId'] = tenantId;
    next();
  }
}
