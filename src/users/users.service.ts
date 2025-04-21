import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ){}


  create(createUserDto: CreateUserDto) {
    const user: User = new User();
    user.email = createUserDto.email;
    user.password = createUserDto.password; 

    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOne({where: {id: id}});
  }

  async findCatsForUser(id: number){
    const userWithCats = await this.userRepository.findOne({
      where: { id: id},
      relations: ['cats'], // this tells TypeORM to fetch related cats
    });
  
    if (!userWithCats) {
      throw new Error('User not found');
    }
  
    return userWithCats.cats;
  }
}
