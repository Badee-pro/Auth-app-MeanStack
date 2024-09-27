import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// import { ConfigService } from '@nestjs/config';
// import { JwtPayload } from './interfaces/jwt-payload.interface';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user.model';
import { Model } from 'mongoose';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(configService: ConfigService) {
//     // const secret = configService.get('SECRET#123');
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       // secretOrKey: configService.get<string>('SECRET#123'),
//       secretOrKey: 'Hghww9My',
//       signOptions: { expiresIn: '8h' },
//     });
//   }

//   async validate(payload: JwtPayload) {
//     return {
//       userId: payload.sub,
//       fullName: payload.fullName,
//       email: payload.email,
//     };
//   }
// }

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'Hghww9My',
    });
  }

  async validate(payload: any) {
    const user = await this.userModel.findById(payload.sub);
    if (!user) {
      throw new Error('User not found');
    }
    return { fullName: user.fullName, email: user.email };
  }
}
