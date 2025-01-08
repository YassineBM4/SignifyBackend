import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AddCategoryDto } from './dto/addCategory.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import { Model } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';

@Injectable()
export class CategoryService {
  findById(categoryId: string) {
    throw new Error('Method not implemented.');
  }

  constructor(
    @InjectModel(Category.name)
    private catModel: Model<Category>,
    @InjectModel(User.name)
    private userModel: Model<User>
  ) { }

  async addCategory(addCategoryDto: AddCategoryDto): Promise<{ category }> {
    const { catName, catIcon, catDescription, catPrice, isLocked } = addCategoryDto

    const existingCategory = await this.catModel.findOne({ catName });
    if (existingCategory) {
      throw new ConflictException('Category already exists');
    }

    const initializedPrice = catPrice ?? 0;
    const initilizedIsLocked = isLocked ?? true;

    const category = await this.catModel.create({
      catName,
      catIcon,
      catDescription,
      catPrice: initializedPrice,
      isLocked: initilizedIsLocked
    })

    return { category }
  }

  async findAll(): Promise<{ category: Category[] }> {
    const categories = await this.catModel.find();
    return { category: categories };
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
