import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from './schemas/category.schema';
import { User, UserSchema } from 'src/auth/schemas/user.schema';

@Module({
  imports:[MongooseModule.forFeature([
    {
     name: 'Category',
     schema: CategorySchema
    },
    { name: User.name, schema: UserSchema },
  ])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
