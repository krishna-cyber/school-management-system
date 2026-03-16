/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
} from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { TenantService } from './tenant.service';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ChangePasswordDto } from './dto/change-password.dto';
import type { Request, Response } from 'express';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly tenantService: TenantService) {}

  @AllowAnonymous()
  @Post('/register')
  async create(@Body() createTenantDto: CreateTenantDto, @Res() res: Response) {
    const betterAuthResponse = await this.tenantService.create(createTenantDto);
    betterAuthResponse.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    return res
      .status(betterAuthResponse.status)
      .json(await betterAuthResponse.json());
  }

  @AllowAnonymous()
  @Post('/sign-in/email')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const betterAuthResponse = await this.tenantService.login(loginDto);

    betterAuthResponse.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    return res
      .status(betterAuthResponse.status)
      .json(await betterAuthResponse.json());
  }

  @Get()
  findAll() {
    console.log('hitting find all endpoint');
    return this.tenantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('hitting find one endpoint');
    return this.tenantService.findOne(id);
  }

  @Patch('/change-password')
  changePassword(
    @Req() req: Request,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    console.log('hitting change password endpoint');
    return this.tenantService.changePassword(req, changePasswordDto);
  }

  @Patch('/update-user')
  updateUser(@Req() req: Request, @Body() updateUserDto: UpdateTenantDto) {
    console.log('hitting update user endpoint');
    return this.tenantService.updateUser(req, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    console.log('hitting remove endpoint');
    return this.tenantService.remove(+id);
  }
}
