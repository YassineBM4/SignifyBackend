import { Module } from '@nestjs/common';
import { QuizzService } from './quizz.service';
import { QuizzController } from './quizz.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizzSchema } from './schema/quizz.schema';
import { Category, CategorySchema } from 'src/category/schemas/category.schema';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'quizz'), // Correct path
      serveRoot: '/quizz', // Correct URL path for static serving
    }),
    MongooseModule.forFeature([
    {
      name: 'Quizz',
      schema: QuizzSchema
    },
    { name: Category.name, schema: CategorySchema },
  ])],
  controllers: [QuizzController],
  providers: [QuizzService],
})
export class QuizzModule { }
