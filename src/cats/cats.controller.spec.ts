import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { User } from 'src/users/entities/user.entity';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './entities/cat.entity';
import { UpdateCatDto } from './dto/update-cat.dto';

describe('CatsController', () => {
  let controller: CatsController;

  const catServiceMock = {
    create: jest.fn(),
    findAllByUser: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [
        CatsService,
        {
          provide: CatsService,
          useValue: catServiceMock
        }
      ],
    }).compile();

    controller = module.get<CatsController>(CatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create cat', async () => {
    const mockUser: User = {id: 1, email: "email@email.com", password: "password", cats: []};
    
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
    
    catServiceMock.create.mockReturnValue(returnCat);
    const result = await controller.create(mockCat);
    expect(result).toEqual(returnCat);
  });

  it('should return all for user', async () => {
    const mockUser: User = {id: 1, email: "email@email.com", password: "password", cats: []};
    const mockRequest = { user: mockUser };
    const foundCat: Cat = {
      id: 1,
      name: "Regi",
      breed: "Birmanese",
      lastFed: "2024-05-08",
      owner: mockUser
    }

    const foundCats: Cat[] = [foundCat];

    catServiceMock.findAllByUser.mockReturnValue(foundCats);
    const result = await controller.findAllByUser(mockRequest);
    expect(result).toEqual(foundCats);
  });

  it('should find cat by id', async () => {
    const mockUser: User = {id: 1, email: "email@email.com", password: "password", cats: []};
    const foundCat: Cat = {
      id: 1,
      name: "Regi",
      breed: "Birmanese",
      lastFed: "2024-05-08",
      owner: mockUser
    }

    catServiceMock.findOne.mockReturnValue(foundCat);
    const result = await controller.findOne(foundCat.id);
    expect(result).toEqual(foundCat);
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

    catServiceMock.update.mockResolvedValue(updatedCat);
    const result = await controller.update(foundCat.id, mockCat);
    expect(result).toEqual(updatedCat);
  });

  it('should delete cat', async () => {
    const id =  1;
    catServiceMock.delete.mockResolvedValue(null);
    await controller.delete(id);
    expect(catServiceMock.delete).toHaveBeenCalledTimes(1);
  });
});
