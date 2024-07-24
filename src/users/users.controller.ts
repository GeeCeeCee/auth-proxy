import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Import JwtAuthGuard
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Throttle({ default: { limit: 5, ttl: 5000 } })
  @Get()
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'User details.' })
  @ApiResponse({
    status: 401,
    description: 'Token invalid or No token provided.',
  })
  @ApiResponse({ status: 429, description: 'Too many requests.' })
  @ApiResponse({ status: 500, description: 'Unexpected Application Error.' })
  async getAllUsers(@Query('email') email: string) {
    if (!email) {
      throw new BadRequestException('Email query parameter is required');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user['_id'],
      name: user.name,
      email: user.email,
    };
  }
}
