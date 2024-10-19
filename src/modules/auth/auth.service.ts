import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    await this.usersService.checkUnique(registerDto);

    const createdUser = await this.usersService.create({
      ...registerDto,
    });
    delete createdUser.password;

    const payload = {
      id: createdUser.id,
    };
    const access_token = this.getJwtAccessToken(payload);
    return {
      ...createdUser,
      access_token,
    };
  }

  async login(loginDto: LoginDto) {
    const user: User = await this.getAuthenticatedUser(
      loginDto.email,
      loginDto.password,
    );

    const payload = {
      id: user.id,
    };
    const access_token = this.getJwtAccessToken(payload);
    return {
      access_token,
    };
  }

  private getJwtAccessToken(user) {
    const payload = {
      id: user.id,
    };
    const token = this.jwtService.sign(payload, {
      secret: 'hello',
      expiresIn: '1d',
    });
    return token;
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException('invalid-credentials', HttpStatus.BAD_REQUEST);
    }
  }

  async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.usersService.findOneByEmail(email);
      await this.verifyPassword(plainTextPassword, user.password);
      delete user.password;
      return user;
    } catch (error) {
      throw new HttpException('invalid-credentials', HttpStatus.BAD_REQUEST);
    }
  }
}
