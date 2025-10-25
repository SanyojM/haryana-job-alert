import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { user_role } from '../../generated/prisma'; // Import the enum

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAllAdmins() {
    return this.prisma.users.findMany({
      where: {
        role: 'admin', // Filter by the 'admin' role using the enum
      },
      select: {
        // Only select the fields needed for the dropdown
        id: true,
        full_name: true,
        email: true, // Keep email if helpful for identification
        role: true,
      },
      orderBy: {
        full_name: 'asc', // Order alphabetically
      },
    });
  }

  // Add other user-related methods here in the future if needed (e.g., getUserById)
}