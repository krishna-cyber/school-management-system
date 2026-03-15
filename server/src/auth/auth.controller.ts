import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { TenantService } from './tenant.service';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ChangePasswordDto } from './dto/change-password.dto';
import type { Request } from 'express';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly tenantService: TenantService) {}
  @AllowAnonymous()
  @Post('/register')
  create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantService.create(createTenantDto);
  }

  @Get()
  findAll() {
    return this.tenantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tenantService.findOne(id);
  }

  @Patch('/change-password')
  changePassword(
    @Req() req: Request,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.tenantService.changePassword(req, changePasswordDto);
  }

  @Patch('/update-user')
  updateUser(@Req() req: Request, @Body() updateUserDto: UpdateTenantDto) {
    return this.tenantService.updateUser(req, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tenantService.remove(+id);
  }
}
