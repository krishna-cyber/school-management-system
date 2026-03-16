import { Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { auth } from 'src/utils/auth';
import { fromNodeHeaders } from 'better-auth/node';
import { ChangePasswordDto } from './dto/change-password.dto';
import type { Request } from 'express';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class TenantService {
  constructor() {}
  async create(createTenantDto: CreateTenantDto) {
    const betterAuthResponse = await auth.api.signUpEmail({
      body: {
        name: createTenantDto.name, // required
        email: createTenantDto.email, // required
        password: createTenantDto.password, // required
        tenantId: createTenantDto.tenantId, // required
        address: createTenantDto.address, // required
        image: createTenantDto?.image || '',
        // callbackURL: 'https://example.com/callback',
      },
      asResponse: true,
    });
    return betterAuthResponse;
  }

  async login(loginDto: LoginDto) {
    const data = await auth.api.signInEmail({
      body: {
        email: loginDto.email,
        password: loginDto.password,
        rememberMe: loginDto.rememberMe || false,
        callbackURL: loginDto.callbackURL || '/dashboard',
      },
      asResponse: true,
    });

    return data;
  }

  findAll() {
    return `This action returns all tenant`;
  }

  async changePassword(req: Request, changePasswordDto: ChangePasswordDto) {
    const data = await auth.api.changePassword({
      body: {
        newPassword: changePasswordDto.newPassword, // required
        currentPassword: changePasswordDto.currentPassword, // required
        revokeOtherSessions: changePasswordDto.revokeOtherSessions || true,
      },
      // This endpoint requires session cookies.
      headers: fromNodeHeaders(req.headers),
      asResponse: true,
    });
    return data;
  }
  findOne(id: string) {
    return auth.api.updateUser;
  }

  async updateUser(req: Request, updateUserDto: UpdateTenantDto) {
    const data = await auth.api.updateUser({
      body: {
        name: updateUserDto.name,
        address: updateUserDto.address,
        contact: updateUserDto.contact,
        image: updateUserDto.image,
        tenantId: updateUserDto.tenantId,
      },
      headers: fromNodeHeaders(req.headers),
      asResponse: true,
    });

    return data;
  }

  remove(id: number) {
    return `This action removes a #${id} tenant`;
  }
}
