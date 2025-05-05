import { Controller, Get, Post, Body, Patch, Param, Query, ParseIntPipe, ValidationPipe, UseGuards } from '@nestjs/common';
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
  findAllByUser(@Query('ownerId') ownerId: number){
    return this.catsService.findAllByUser(ownerId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.catsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) updateCatDto: UpdateCatDto) {
    return this.catsService.update(+id, updateCatDto);
  }
}
