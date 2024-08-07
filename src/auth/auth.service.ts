import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, ValidateUserDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoggerService } from 'src/common/logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly logger: LoggerService,
  ) {}

  async createUser(userInfo: CreateUserDto) {
    const userExists = await this.usersService.userExists(userInfo.email);

    if (userExists) {
      this.logger.error('User already exists.');
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(userInfo.password, 10);
    await this.usersService.createUser({
      ...userInfo,
      password: hashedPassword,
    });
    this.usersService.createUser(userInfo);
    this.logger.error('User Created.');
  }

  async validateUser(userInfo: ValidateUserDto) {
    const user = await this.usersService.findByEmail(userInfo.email);

    if (user && (await bcrypt.compare(userInfo.password, user.password))) {
      const token = await this.generateToken(user);
      this.logger.log('User was validated successfully');
      return {
        access_token: token,
      };
    }

    this.logger.log('User could not be validated');
    throw new UnauthorizedException('Invalid email or password');
  }

  async generateToken(user: ValidateUserDto): Promise<string> {
    const payload = { username: user.email };
    console.log('Generating Token with Payload:', payload);
    return this.jwtService.sign(payload, { expiresIn: '10m' });
  }
}
