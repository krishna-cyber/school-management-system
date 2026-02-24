import { InternalServerErrorException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

export const TenantConnectionProvider = {
  provide: 'TENANT_CONNECTION',
  useFactory: (request, connection: Connection) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!request?.tenantId) {
      throw new InternalServerErrorException(
        'Apply TenantsMiddleware to the route to use tenant connection',
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return connection.useDb(request?.tenantId, { useCache: true });
  },
  inject: [REQUEST, getConnectionToken()],
};
