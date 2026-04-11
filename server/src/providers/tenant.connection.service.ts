import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class TenantConnectionService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  getConnection(tenantId: string) {
    if (!tenantId) {
      throw new Error('Tenant ID is required to get the connection');
    }
    return this.connection.useDb(tenantId, { useCache: true });
  }
}
