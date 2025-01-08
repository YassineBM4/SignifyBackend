import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { AddCategoryDto } from './dto/addCategory.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/addCategory')
    addCategory(@Body() addCategoryDto: AddCategoryDto): Promise<{ category }> {
        return this.categoryService.addCategory(addCategoryDto)
  }

  @Get('/fetchCategory')
  findAll(): Promise<{ category }> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
