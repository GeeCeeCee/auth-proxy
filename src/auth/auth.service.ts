import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, ValidateUserDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async createUser(userInfo: CreateUserDto) {
    const userExists = await this.usersService.userExists(userInfo.email);

    if (userExists) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(userInfo.password, 10);
    await this.usersService.createUser({
      ...userInfo,
      password: hashedPassword,
    });
    this.usersService.createUser(userInfo);
    console.log('Created user');
  }

  async validateUser(userInfo: ValidateUserDto) {
    const user = await this.usersService.findByEmail(userInfo.email);

    if (user && (await bcrypt.compare(userInfo.password, user.password))) {
      const token = await this.generateToken(user);
      return { access_token: token };
    }

    throw new UnauthorizedException('Invalid email or password');
  }

  async generateToken(user: ValidateUserDto): Promise<string> {
    const payload = { username: user.email };
    console.log('Generating Token with Payload:', payload);
    return this.jwtService.sign(payload, { expiresIn: '10m' });
  }
}
