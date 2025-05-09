import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ){}


  async create(createUserDto: CreateUserDto) {
    const user: User = new User();
    user.email = createUserDto.email;
    user.password = createUserDto.password; 

    return this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    const foundUser: User | null = await this.userRepository.findOne({where: {id: id}});

    if(!foundUser) throw new NotFoundException("User not found!");
    return foundUser;
  }

  async delete(id: number) {
    const foundUser: User | null = await this.userRepository.findOne({where: {id: id}});

    if(!foundUser) throw new NotFoundException("User not found!");
    return await this.userRepository.delete(id);
  }


  async findByEmail(email: string) {
    const foundUser: User | null = await this.userRepository.findOne({where: {email: email}});

    if(!foundUser) throw new NotFoundException("User not found!");
    return foundUser;
  }

  async findCatsForUser(id: number){
    const userWithCats = await this.userRepository.findOne({
      where: { id: id},
      relations: ['cats'],
    });
  
    if (!userWithCats) {
      throw new NotFoundException('User not found');
    }
  
    return userWithCats.cats;
  }
}
