import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Cat } from './entities/cat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CatsService {
  constructor(
      @InjectRepository(User) private userRepository: Repository<User>,
      @InjectRepository(Cat) private catRepository: Repository<Cat>
    ){}

  async create(createCatDto: CreateCatDto) {
    const user: User | null = await this.userRepository.findOneBy({id: createCatDto.ownerId});

    if(!user) throw new NotFoundException("User with given id not found!");


    const cat = this.catRepository.create({
      name: createCatDto.name,
      breed: createCatDto.breed,
      owner: user,
      lastFed: createCatDto.lastFed
    });

    return this.catRepository.save(cat);
  }

  async findAll() {
    return await this.catRepository.find();
  }

  async findAllByUser(ownerId: number) {
    const foundUser = await this.userRepository.findOne({where: {id: ownerId}});
    if(!foundUser) throw new NotFoundException("User not found!");

    return this.catRepository.find({
      where: {
        owner: {
          id: ownerId
        }
      },
      relations: ['owner']
    });
  }

  async findOne(id: number) {
    const foundCat: Cat | null = await this.catRepository.findOne({where: {id: id}});

    if(!foundCat) throw new NotFoundException("Cat not found!");
    return foundCat;
  }

  async update(id: number, updateCatDto: UpdateCatDto) {
    let catToUpdate = await this.catRepository.findOne({where: {id: id}});

    if(!catToUpdate) throw new NotFoundException('Cat with given id not found!');

    await this.catRepository.update(id, updateCatDto);
    return this.catRepository.findOne({ where: { id } });
  }

  async delete(id: number){
    return await this.catRepository.delete(id);
  }
}
