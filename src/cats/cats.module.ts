import { Module } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cat } from './entities/cat.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [ 
    TypeOrmModule.forFeature([Cat, User]),
    UsersModule],
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
