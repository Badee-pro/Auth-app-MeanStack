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
  UnauthorizedException,
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
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    try {
      return await this.authService.signIn(signInDto);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException(
        'Authentication failed. Please check your credentials.',
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return { user: req.user };
  }
}
