import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { HttpException, HttpStatus } from '@nestjs/common';


@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ){}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);

        if (user && user.password === password) {
          const { password, ...result } = user;
          return result;
        }
        return null;
    }

    async register(email: string, password: string){
      const userDto: CreateUserDto = {
        email: email,
        password: password
      }
      this.usersService.create(userDto);
    }


    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        return {
          access_token: this.jwtService.sign(payload),
        };
    }

    async verifyJwt(jwt: string): Promise<{ exp: number }> {
      try {
        const { exp } = await this.jwtService.verifyAsync(jwt);
        return { exp };
      } catch (error) {
        throw new HttpException('Invalid JWT', HttpStatus.UNAUTHORIZED);
      }
    }
}
