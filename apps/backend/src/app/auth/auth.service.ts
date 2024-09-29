import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { User, UserDocument } from './user.schema'; // Ensure correct import
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>, // Ensure correct Model
    private jwtService: JwtService
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { fullName, email, password } = signUpDto;

    // Validate password length
    if (password.length < 6) {
      throw new BadRequestException(
        'Password must be at least 6 characters long.'
      );
    }

    // Convert email to lowercase
    const lowerCaseEmail = email.toLowerCase();

    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      email: lowerCaseEmail,
    });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists.');
    }

    // Create and save new user
    const user = new this.userModel({
      fullName,
      email: lowerCaseEmail,
      password,
    });
    await user.save();

    // Return JWT token
    return this.createJwtToken(user);
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;

    // Convert email to lowercase
    const lowerCaseEmail = email.toLowerCase();

    // Find user by email
    const user = await this.userModel.findOne({ email: lowerCaseEmail });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    // Return JWT token
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
    // Convert email to lowercase
    return this.userModel.findOne({ email: email.toLowerCase() });
  }

  async findById(userId: string) {
    return this.userModel.findById(userId);
  }
}
