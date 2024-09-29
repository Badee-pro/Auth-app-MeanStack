import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { User, UserDocument } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { fullName, email, password } = signUpDto;

    if (password.length < 6) {
      throw new BadRequestException(
        'Password must be at least 6 characters long.'
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.toLowerCase())) {
      throw new BadRequestException('Invalid email format.');
    }

    const lowerCaseEmail = email.toLowerCase();

    const existingUser = await this.userModel.findOne({
      email: lowerCaseEmail,
    });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists.');
    }

    const user = new this.userModel({
      fullName,
      email: lowerCaseEmail,
      password: await bcrypt.hash(password, 10),
    });

    await user.save();
    return this.createJwtToken(user);
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const lowerCaseEmail = email.toLowerCase();

    const user = await this.userModel.findOne({ email: lowerCaseEmail });
    if (!user) {
      throw new UnauthorizedException('Email is not registered.');
    }

    if (user.loginAttempts >= 3) {
      throw new ForbiddenException('Account locked. Please contact support.');
    }

    console.log('Entered Password:', password);
    console.log('Stored Hashed Password:', user.password);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      user.loginAttempts += 1;
      await user.save();
      throw new UnauthorizedException('Incorrect password.');
    }

    if (user.loginAttempts > 0) {
      user.loginAttempts = 0;
      await user.save();
    }

    return this.createJwtToken(user);
  }

  createJwtToken(user: UserDocument) {
    const payload = { email: user.email, sub: user._id };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        fullName: user.fullName,
        email: user.email,
      },
    };
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase() });
  }

  async findById(userId: string) {
    return this.userModel.findById(userId);
  }

  async incrementLoginAttempts(email: string): Promise<void> {
    await this.usersService.incrementLoginAttempts(email);
  }

  async resetLoginAttempts(email: string): Promise<void> {
    await this.usersService.resetLoginAttempts(email);
  }
}
