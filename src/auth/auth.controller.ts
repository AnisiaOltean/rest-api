import { Controller, Post, Request, Get, Body, ValidationPipe } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterDto } from './dto/RegisterDto';
import { HttpCode, HttpStatus } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService,
    ) {}

    @Post('/register')
    register(@Body(ValidationPipe) registerDto: RegisterDto){
        return this.authService.register(registerDto.email, registerDto.password);
    }

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    login(@Request() request){
        console.log(request.user);  // from validate in local.strategy.ts
        return this.authService.login(request.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() request) {
        console.log(request.user);
        return "I am protected route!";
    }

    @Post('verify-jwt')
    @HttpCode(HttpStatus.OK)
    verifyJwt(@Body() payload: { jwt: string }) {
      return this.authService.verifyJwt(payload.jwt);
    }
}
