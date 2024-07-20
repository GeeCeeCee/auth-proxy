import { Injectable } from '@nestjs/common';
import { UserInfo } from './auth.interface';
import { CreateUserDto } from './auth.dto';

@Injectable()
export class AuthService {
  createUser(createUserDto: CreateUserDto) {
    console.log('Logging from the service', createUserDto);
  }
}
