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

    if(!user) throw new Error("User not found!");


    const cat = this.catRepository.create({
      name: createCatDto.name,
      breed: createCatDto.breed,
      owner: user
    });

    return this.catRepository.save(cat);
  }

  findAll() {
    return this.catRepository.find();
  }

  findOne(id: number) {
    return this.catRepository.findOne({where: {id: id}});
  }

  async update(id: number, updateCatDto: UpdateCatDto) {
    let catToUpdate = await this.catRepository.findOne({where: {id: id}});

    if(!catToUpdate) return new NotFoundException('Cat with given id not found!');

    await this.catRepository.update(id, updateCatDto);
    return this.catRepository.findOne({ where: { id } });
  }
}
