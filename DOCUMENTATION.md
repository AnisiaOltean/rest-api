# NestJS Proof of Concept app
### This application is a proof of concept app that uses NestJS framework to build a REST API that provides CRUD Controllers for two entities: users and cats.
### A sqlite3 database along with TypeORM are integrated to persist data long term.

### Features
1. Authentication
- Defined in the auth module, where AuthService deals with the business logic and AuthController exposes the /login and /register endpoints. For authentication, the Passport library (@nestjs/passport) is used which abstracts the logic needed for veryfing the user's credentials using the local-startegy; additionally, we have also extended the authentication logic to include JWT, also done by the jwt-strategy.
- users authenticate in the app using an email and a passport; we are using the local-strategy in passport to verify the user's credentials by defining a validateUser method inside the AuthService class:
```
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


    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        return {
          access_token: this.jwtService.sign(payload),
        };
      }
}

```
- notice here that AuthService uses UsersService (so that the password credential can be checked in our validation function); the AuthModule has to import UsersModule to be able to use UsersService
```
auth.module.ts 

Module({
    imports: [
        UsersModule, 
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '60s' },
          }),
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy]
})
export class AuthModule {}
```
- and UsersService to be exported in UsersModule so that it can be accessed from other modules
```
users.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
```
- the validateUser function is called from a custom LocalStrategy passport strategy; each strategy needs a set of options and a validate() function that calls the validateUser method
```
local.strategy.ts
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({usernameField: 'email'});
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
```
-  this strategy will automatically create a user object (based on the return value of the ValidateUser method) and assigns it to the request object in the AuthController /login route. Guards are then used to check whether a client request will be handled by our route or not; in the /login route, the local AuthGuard will just check if the provided email and passports are valid user credentials and if so, return a JWT (json web token) 
- in the case of invalid credentials a 401 Unauthorized response is generated
 ```
AuthController

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
        return this.authService.login(request.user);
    }
}

```
- the LocalAuthGuard defined extends the built-in local AuthGuard provided by passport
```
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
```

- after authentication is complete, the JWT will have to be sent as Bearer token in the authorization headers for future requests
- JWT authentication works similarly, but uses a different strategy called jwt-strategy in passport; to implement that, the login function in AuthService returns a token by using the JwtService .sign() method in which we will provide the users id as subject (sub) claim:
```
    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        return {
          access_token: this.jwtService.sign(payload),
        };
    }
```
- the JWT module is registered in the AuthModule import statement by also specifying the secret key used by the signature part of jwt (and the expiration time)
```
@Module({
    imports: [
        UsersModule, 
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '360s' },
          }),
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy]
})
export class AuthModule {}
```
- lastly, the jwt-strategy is implemented so that it can be used in our guards to secure our API endpoints; the validate() method returns the id and email of our user, populating again the request.user object in the controller request 
```
jwt.strategy.ts 
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, email: payload.email };
  }
}
```
- the AuthController then makes use of the JwrAuthGuard `export class JwtAuthGuard extends AuthGuard('jwt') {}` to control the secured acces on the API route by automatically invoking out jwt-strategy defined above
```
AuthController 

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() request) {
        console.log(request.user);
        return "I am protected route!";
    }
```
- all routes in the app (/users, /cats) are protected by the JWT Guard (using the @UseGuards() decorator)

2. CRUD operations for the two entities:
 - for users: 
    - create(createUserDto: CreateUserDto)
    - async findAll()
    - async findOne(id: number)
    - async delete(id: number)
    - async findByEmail(email: string)
    - async findCatsForUser(id: number)

- for cats:
    - async create(createCatDto: CreateCatDto)
    - async findAll()
    - async findOne(id: number)
    -  async update(id: number, updateCatDto: UpdateCatDto)
The idea here is to allow users to use this PoC app as a pet management application; each user can register its cats and update their properties (isFed - to check if it was fed today)


## Controllers
- `nest g controller [resource]`
## Services 
- `nest g services [resource]`
## Modules 
- `nest g module [resource]`
## Or create the CRUD altogether
= `nest g resource [resource]`

## Run TypeORM migrations
### Generate the new migration
- `npm run migration:generate -- db/migrations/new-migration-name`
### And then apply the changes
- `npm run migration:run`

## Run app
- `npm run start:dev` or `npm start`