import { Test, TestingModule } from '@nestjs/testing';
import { CatsService } from './cats.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Cat } from './entities/cat.entity';
import { CreateCatDto } from './dto/create-cat.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateCatDto } from './dto/update-cat.dto';


describe('CatsService', () => {
  let service: CatsService;

  const userMockRepository = {
    findOneBy: jest.fn(),
    findOne: jest.fn()
  }
  
  const catMockRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    delete: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatsService,
        {
          provide: getRepositoryToken(User),
          useValue: userMockRepository
        },
        {
          provide: getRepositoryToken(Cat),
          useValue: catMockRepository
        }
      ],
    }).compile();

    service = module.get<CatsService>(CatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create cat', async () => {
    const mockUser: User = {id: 1, email: "email@email.com", password: "password", cats: []};
    userMockRepository.findOneBy.mockReturnValue(mockUser);

    const mockCat: CreateCatDto = {
      name: "Regi",
      breed: "Birmanese",
      lastFed: "2024-05-08",
      ownerId: mockUser.id
    }

    const returnCat: Cat = {
      id: 1,
      name: "Regi",
      breed: "Birmanese",
      lastFed: "2024-05-08",
      owner: mockUser
    }

    catMockRepository.create.mockReturnValue(mockCat);
    catMockRepository.save.mockReturnValue(returnCat);
    const result = await service.create(mockCat);
    expect(result).toEqual(returnCat);
  });

  it('should get all for user', async () => {
    const mockUser: User = {id: 1, email: "email@email.com", password: "password", cats: []};
    userMockRepository.findOne.mockReturnValue(mockUser);
    const foundCat: Cat = {
      id: 1,
      name: "Regi",
      breed: "Birmanese",
      lastFed: "2024-05-08",
      owner: mockUser
    }

    const foundCats: Cat[] = [foundCat];

    catMockRepository.find.mockReturnValue(foundCats);
    const result = await service.findAllByUser(mockUser.id);
    expect(result).toEqual(foundCats);
  });

    it('should find one cat', async () => {
    const mockUser: User = {id: 1, email: "email@email.com", password: "password", cats: []};
    const foundCat: Cat = {
      id: 1,
      name: "Regi",
      breed: "Birmanese",
      lastFed: "2024-05-08",
      owner: mockUser
    }

    catMockRepository.findOne.mockReturnValue(foundCat);
    const result = await service.findOne(foundCat.id);
    expect(result).toEqual(foundCat);
  });

  it('should not find cat for invalid id', async () => {
    catMockRepository.findOne.mockResolvedValue(null); 

    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    expect(catMockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should update cat', async () => {
    const mockUser: User = {id: 1, email: "email@email.com", password: "password", cats: []};

    const mockCat: UpdateCatDto = {
      name: "Regii",
      breed: "Birmanesei",
      lastFed: "2024-05-08",
      ownerId: mockUser.id,
    }

    const foundCat: Cat = {
      id: 1,
      name: "Regi",
      breed: "Birmanese",
      lastFed: "2024-05-08",
      owner: mockUser
    }

    const updatedCat: Cat = {
      id: 1,
      name: "Regii",
      breed: "Birmanesei",
      lastFed: "2024-05-08",
      owner: mockUser
    }

    catMockRepository.findOne
    .mockResolvedValueOnce(foundCat)
    .mockResolvedValueOnce(updatedCat);
    const result = await service.update(foundCat.id, mockCat);

    expect(result).toEqual(updatedCat);
  });

  it('should delete cat', async () => {
    const id =  1;
    catMockRepository.delete.mockResolvedValue(undefined);
    await service.delete(id);
    expect(catMockRepository.delete).toHaveBeenCalledTimes(1);
  });
});
