import { Controller, Post, Body, UseInterceptors, UploadedFile, Get, Param, BadRequestException } from '@nestjs/common';
import { FileUploadService } from './fileUpload.service';
import { ContentService } from './content.service';
import { AddContentDto } from './dto/addContent.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Content } from './schema/content.schema';

@Controller('content')
export class ContentController {
  constructor(
    private readonly contentService: ContentService,
    private readonly fileUploadService: FileUploadService // Inject file upload service
  ) { }

  @Post("/addContent")
  @UseInterceptors(FileInterceptor('contentImage', FileUploadService.multerOptions))
  async addContent(@Body() addContentDto: AddContentDto, @UploadedFile() file: Express.Multer.File): Promise<{ content }> {
    const { contentName, categoryName } = addContentDto;

    if (!file) {
      throw new BadRequestException('contentImage is required');
    }

    const contentImage = `uploads/images/${file.filename}`;

    return this.contentService.addContent({
      contentName,
      contentImage, // Save the file path
      categoryName,
    });
  }

  @Get('fetchContents/:categoryId')
  async findAll(@Param('categoryId') categoryId: string): Promise<{ content: Content[] }> {
    return this.contentService.findAll(categoryId);
  }

}
