import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentSchema } from './schema/content.schema';
import { Category, CategorySchema } from 'src/category/schemas/category.schema';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FileUploadService } from './fileUpload.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads', 'images'), // Correct path
      serveRoot: '/uploads/images', // Correct URL path for static serving
    }),
    MongooseModule.forFeature([
      {
        name: 'Content',
        schema: ContentSchema
      },
      { name: Category.name, schema: CategorySchema },
    ])],
  controllers: [ContentController],
  providers: [ContentService, FileUploadService],
})
export class ContentModule {}