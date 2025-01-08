import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Quizz } from './schema/quizz.schema';
import { isValidObjectId, Model } from 'mongoose';
import { Category } from 'src/category/schemas/category.schema';
import { AddQuizzDto } from './dto/addQuizz.dto';
import { UpdateQuizzDto } from './dto/updateQuizz.dto';

@Injectable()
export class QuizzService {
  constructor(
    @InjectModel(Quizz.name)
    private quizzModel: Model<Quizz>,
    @InjectModel(Category.name)
    private categoryModel: Model<Category>
  ) { }

  async addQuizz(addQuizzDto: AddQuizzDto, imagePaths: string[]): Promise<{ quizz }> {
    const { quizzType, quizzQuestion, reponseCorrecte, categoryName } = addQuizzDto;

    const category = await this.categoryModel.findOne({ catName: categoryName });
    
    if (!category) {
      throw new BadRequestException(`Category with name ${categoryName} not found.`);
    }

    if (quizzType === 'multiple' && (!reponseCorrecte || ![1, 2, 3, 4].includes(Number(reponseCorrecte)))) {
      throw new BadRequestException('reponseCorrecte must be a valid index (1, 2, 3, or 4) for "multiple" quizzType.');
    }

    const quizzData: any = {
      quizzType,
      quizzQuestion,
      reponseCorrecte,
      category: category._id,
    };

    if (quizzType === 'single') {
      quizzData.quizzImage1 = imagePaths[0];
    } else if (quizzType === 'multiple') {
      quizzData.quizzImage1 = imagePaths[0];
      quizzData.quizzImage2 = imagePaths[1];
      quizzData.quizzImage3 = imagePaths[2];
      quizzData.quizzImage4 = imagePaths[3];
    }

    const quizz = await this.quizzModel.create(quizzData);
    return { quizz };
  }

  async findAll(categoryId?: string): Promise<{ quizz: Quizz[] }> {
    const query = categoryId ? { category: categoryId } : {};
    const quizzes = await this.quizzModel.find(query).exec();
    return { quizz: quizzes };
  }

  async updateQuizz(
    id: string,
    updateQuizzDto: UpdateQuizzDto,
    imagePaths: string[],
  ): Promise<{ quizz }> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format.');
    }

    const quizz = await this.quizzModel.findById(id);
    if (!quizz) {
      throw new BadRequestException('Quizz not found.');
    }

    // Determine the quizzType to validate against
    const quizzType = updateQuizzDto.quizzType || quizz.quizzType;

    // Update the category if necessary
    if (updateQuizzDto.categoryName) {
      const category = await this.categoryModel.findOne({ catName: updateQuizzDto.categoryName });
      if (!category) {
        throw new BadRequestException(`Category with name ${updateQuizzDto.categoryName} not found.`);
      }
      updateQuizzDto.categoryName = category._id;
    }

    // Prepare the updated data
    const updatedQuizzData: any = {
      ...quizz.toObject(),
      ...updateQuizzDto, // Merge updated data like question, answer, category
    };

    if (imagePaths.length > 0) {
      if (quizzType === 'single' && imagePaths.length === 1) {
        updatedQuizzData.quizzImage1 = imagePaths[0];
      } else if (quizzType === 'multiple' && imagePaths.length === 4) {
        updatedQuizzData.quizzImage1 = imagePaths[0];
        updatedQuizzData.quizzImage2 = imagePaths[1];
        updatedQuizzData.quizzImage3 = imagePaths[2];
        updatedQuizzData.quizzImage4 = imagePaths[3];
      } else {
        throw new BadRequestException(
          quizzType === 'single'
            ? 'Exactly 1 image is required for "single" quizzType.'
            : 'Exactly 4 images are required for "multiple" quizzType.'
        );
      }
    }

    // Update the quiz and return it
    const updatedQuizz = await this.quizzModel.findByIdAndUpdate(id, updatedQuizzData, { new: true });
    return { quizz: updatedQuizz };
  }
}
