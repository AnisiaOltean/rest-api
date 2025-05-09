import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  const mockUserRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository
        }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create user', async () => {
    const mockUser: CreateUserDto = { email: 'user@example.com', password: 'password' };
    
    mockUserRepository.save.mockReturnValue(mockUser);
    const result = await service.create(mockUser);

    expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(mockUser);
  });

  it('should find by email', async () => {
    const mockUser: User = { id: 1, email: 'user@example.com', password: 'password', cats: [] };
    mockUserRepository.findOne.mockReturnValue(mockUser);
    const result = await service.findByEmail(mockUser.email);
    expect(result).toEqual(mockUser);
    expect(mockUserRepository.findOne).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({where: {email: mockUser.email}});
  });
});
