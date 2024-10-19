import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const reqToken = request.headers.authorization;
          if (!reqToken) {
            throw new HttpException('missing-token', HttpStatus.UNAUTHORIZED);
          }

          let token = null;
          if (reqToken.startsWith('Bearer ')) {
            const tokenArray = reqToken.split(' ');
            token = tokenArray[1];
          } else {
            token = reqToken;
          }

          return token;
        },
      ]),
      // jwtFromRequest: ExtractJwt.fromHeader('authorization'),
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'hello',
    });
  }

  async validate(payload) {
    return {
      id: payload.id,
      office_id: payload.office_id,
      role: payload.role,
    };
  }
}
