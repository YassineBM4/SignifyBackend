import { Controller, Get, Post, Body, UploadedFiles, UseInterceptors, BadRequestException, Param, Put } from '@nestjs/common';
import { QuizzService } from './quizz.service';
import { AddQuizzDto } from './dto/addQuizz.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UpdateQuizzDto } from './dto/updateQuizz.dto';
import { Quizz } from './schema/quizz.schema';

@Controller('quizz')
export class QuizzController {
  constructor(private readonly quizzService: QuizzService) { }

  @Post('/addQuizz')
  @UseInterceptors(
    FilesInterceptor('images', 4, {
      storage: diskStorage({
        destination: './quizz',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpeg|jpg|png|gif)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async addQuizz(
    @Body() addQuizzDto: AddQuizzDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const { quizzType } = addQuizzDto;

    if (quizzType === 'single' && files.length !== 1) {
      throw new BadRequestException('Exactly 1 image is required for "single" quizzType.');
    }
    if (quizzType === 'multiple' && files.length !== 4) {
      throw new BadRequestException('Exactly 4 images are required for "multiple" quizzType.');
    }

    const imagePaths = files.map((file) => file.path.replace(/\\/g, '/'));

    return this.quizzService.addQuizz(addQuizzDto, imagePaths);
  }

  @Get('fetchQuizzes/:categoryId')
  async findAll(@Param('categoryId') categoryId: string): Promise<{ quizz: Quizz[] }> {
    return this.quizzService.findAll(categoryId);
  }

  @Post('/editQuizz/:id')
  @UseInterceptors(
    FilesInterceptor('images', 4, {
      storage: diskStorage({
        destination: './quizz',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async editQuizz(
    @Param('id') id: string,
    @Body() updateQuizzDto: UpdateQuizzDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const imagePaths = files.map(file => file.path.replace(/\\/g, '/'));
    return this.quizzService.updateQuizz(id, updateQuizzDto, imagePaths);
  }

}
