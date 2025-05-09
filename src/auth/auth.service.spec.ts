import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';

describe('AuthService', () => {
  let authService: AuthService;

  const mockUserRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verifyAsync: jest.fn(),
  };
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
       providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should create user', async () => {
    const createUserDto: CreateUserDto = {
      email:"test@email.com",
      password: "password"
    };

    const createdUser: User = {
      id: 1,
      email: createUserDto.email,
      password: createUserDto.password,
      cats: []
    }

    // Arrange
    mockUsersService.create.mockResolvedValue(createdUser);
    mockUserRepository.save.mockResolvedValue(createdUser);

    // Act
    await authService.register(createUserDto.email, createUserDto.password);

    // Assert
    expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    expect(mockUsersService.create).toHaveBeenCalledTimes(1);
  });

  it('should login user', async () => {
    const user = { id: 1, email: 'test@email.com' };
    const token = 'mocked.jwt.token';

    mockJwtService.sign.mockReturnValue(token);

    const result = await authService.login(user);
    expect(mockJwtService.sign).toHaveBeenCalledWith({
      email: user.email,
      sub: user.id,
    });

    expect(result).toEqual({ access_token: token });
  });

  it('should verify token', async () => {
    const expiration = { exp: 123456789 };
    mockJwtService.verifyAsync.mockResolvedValue(expiration);

    const result = await authService.verifyJwt('valid.jwt.token');
    expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('valid.jwt.token');
    expect(result).toEqual({ exp: expiration.exp });
  });
});
