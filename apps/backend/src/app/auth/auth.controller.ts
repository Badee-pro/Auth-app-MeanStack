import {
  Controller,
  Post,
  Body,
  // HttpException,
  // HttpStatus,
  Request,
  Get,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('api')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    try {
      return await this.authService.signUp(signUpDto);
    } catch (error) {
      if (error.message === 'Password must be at least 6 characters long.') {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException('Sign-up failed.', HttpStatus.BAD_REQUEST);
      }
    }
  }

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    try {
      return await this.authService.signIn(signInDto);
    } catch (error) {
      if (error.message === 'User not found') {
        throw new HttpException(
          'Email is not registered.',
          HttpStatus.NOT_FOUND
        );
      } else if (error.message === 'Invalid password') {
        throw new HttpException(
          'Wrong password entered.',
          HttpStatus.UNAUTHORIZED
        );
      } else {
        throw new HttpException(
          'Authentication failed.',
          HttpStatus.UNAUTHORIZED
        );
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return { user: req.user };
  }
}
