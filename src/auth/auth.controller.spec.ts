import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/RegisterDto';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
    verifyJwt: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should login user', async () => {
    const mockUser = { id: 1, email: "email@email.com" };
    const mockToken = { access_token: "token" };

    mockAuthService.login.mockResolvedValue(mockToken);

    const mockRequest = { user: mockUser };

    const result = await controller.login(mockRequest as any);

    expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(mockToken);
  })

  it('should register user', async () => {
     const mockUser: RegisterDto = { email: "email@email.com", password: 'passwprd' };
     mockAuthService.register.mockResolvedValue(null);
     await controller.register(mockUser);
     expect(mockAuthService.register).toHaveBeenCalledWith(mockUser.email, mockUser.password);
  })
});
