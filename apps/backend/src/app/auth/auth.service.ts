import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from './user.schema';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { fullName, email, password } = signUpDto;

    // Validate password length to be greater than 6 characters
    if (password.length <= 6) {
      throw new BadRequestException(
        'Password must be more than 6 characters long.'
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

    // If user is not found, throw a specific error
    if (!user) {
      throw new BadRequestException(
        'This email is not registered. Please sign up.'
      );
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid password. Please try again.');
    }

    // Return JWT token
    return this.createJwtToken(user);
  }

  validatePassword(password: string): boolean {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return regex.test(password);
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
}
