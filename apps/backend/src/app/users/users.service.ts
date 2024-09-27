import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../auth/user.schema';
import { SignUpDto } from '../auth/dto/sign-up.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Find user by email
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  // Update this method to return a UserDocument
  async findById(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user; // Return UserDocument
  }

  // Update this method to return a UserDocument
  async createUser(signUpDto: SignUpDto): Promise<UserDocument> {
    const { fullName, email, password } = signUpDto;

    // Check if the user already exists
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      fullName,
      email,
      password: hashedPassword,
    });

    return newUser.save(); // Return UserDocument
  }

  // Method to compare passwords
  async comparePasswords(
    storedPassword: string,
    providedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(providedPassword, storedPassword);
  }
}
