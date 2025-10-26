import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('admins') // Specific route for fetching admins
  @UseGuards(JwtAuthGuard, RolesGuard) // Protect the route
  @Roles('admin') // Ensure only admins can call this
  findAllAdmins() {
    return this.usersService.findAllAdmins();
  }

  // Add other user routes here later if needed
}