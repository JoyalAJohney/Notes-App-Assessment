import { AuthService } from './auth.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { LoginDto, SignUpDto } from './dto/user.dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignUpDto) {
    return this.authService.userSignUp(signupDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.userLogin(loginDto);
  }
}
