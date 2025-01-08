import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Content } from './schema/content.schema';
import { Model } from 'mongoose';
import { AddContentDto } from './dto/addContent.dto';
import { User } from 'src/auth/schemas/user.schema';
import { Category } from 'src/category/schemas/category.schema';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(Content.name) private contentModel: Model<Content>,
    @InjectModel(Category.name) private categoryModel: Model<Category>
  ) { }

  async addContent(addContentDto: AddContentDto): Promise<{ content }> {
    const { contentName, contentImage, categoryName } = addContentDto;

    if (!contentImage) {
      throw new ConflictException("Content image path is empty");
    }

    const category = await this.categoryModel.findOne({ catName: categoryName });
    if (!category) {
      throw new ConflictException(`Category with name "${categoryName}" does not exist`);
    }

    const existingContent = await this.contentModel.findOne({ contentName });
    if (existingContent) {
      throw new ConflictException("Content with this name already exists");
    }

    const content = await this.contentModel.create({
      contentName,
      contentImage,
      category: category._id,
    });

    return { content };
  }

  async findAll(categoryId?: string): Promise<{ content: Content[] }> {
    const query = categoryId ? { category: categoryId } : {};
    const contents = await this.contentModel.find(query).exec();
    return { content: contents };
  }
  
}
