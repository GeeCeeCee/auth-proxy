import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, ValidateUserDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async createUser(@Body() userInfo: CreateUserDto) {
    await this.authService.createUser(userInfo);
    return 'User created successfully';
  }

  @Post('login')
  @HttpCode(200)
  async validateUser(@Body() userInfo: ValidateUserDto) {
    return this.authService.validateUser(userInfo);
  }
}
