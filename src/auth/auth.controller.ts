import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, ValidateUserDto } from './auth.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 409, description: 'User already exists.' })
  @ApiResponse({ status: 429, description: 'Too many requests.' })
  @ApiResponse({ status: 500, description: 'Unexpected Application Error.' })
  async createUser(@Body() userInfo: CreateUserDto) {
    await this.authService.createUser(userInfo);
    return 'User created successfully';
  }

  @Post('login')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Successful login.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 429, description: 'Too many requests.' })
  @ApiResponse({ status: 500, description: 'Unexpected Application Error.' })
  async validateUser(@Body() userInfo: ValidateUserDto) {
    return this.authService.validateUser(userInfo);
  }
}
