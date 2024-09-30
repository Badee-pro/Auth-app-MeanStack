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
      const user = await this.authService.signUp(signUpDto);
      return {
        message: 'User registered successfully',
        user: { email: user.user.email, fullName: user.user.fullName },
      };
    } catch (error) {
      this.handleSignUpErrors(error);
    }
  }

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    try {
      const { accessToken, user } = await this.authService.signIn(signInDto);
      return { accessToken, user };
    } catch (error) {
      this.handleSignInErrors(error);
    }
  }

  private handleSignUpErrors(error: Error) {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(
      'Sign-up failed. Please try again.',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }

  private handleSignInErrors(error: Error) {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(
      'Authentication failed. Please try again.',
      HttpStatus.UNAUTHORIZED
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return { user: req.user };
  }
}
