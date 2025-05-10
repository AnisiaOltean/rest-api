import { Controller, Get, Post, Delete, Body, Patch, Param, ParseIntPipe, ValidationPipe, UseGuards, Request } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('cats')
@UseGuards(JwtAuthGuard)
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  create(@Body(ValidationPipe) createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto);
  }

  @Get()
  findAllByUser(@Request() request){
    console.log(request.user.id);
    return this.catsService.findAllByUser(+request.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.catsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) updateCatDto: UpdateCatDto) {
    return this.catsService.update(id, updateCatDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number){
    return this.catsService.delete(id);
  }
}
