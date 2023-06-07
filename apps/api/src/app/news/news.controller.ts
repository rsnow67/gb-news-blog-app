import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommentsService } from './comments/comments.service';
import { CreateNewsDto } from './dto/create-news-dto';
import { UpdateNewsDto } from './dto/update-news-dto';
import { NewsService } from './news.service';
import { diskStorage } from 'multer';
import { HelperFileLoad } from '../utils/HelperFileLoad';
import imageFileFilter from '../utils/file-filters';
import { MailService } from '../mail/mail.service';
import { NewsEntity } from './news.entity';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '../auth/roles/roles.enum';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

const PATH_NEWS = '/news-static/';
const helperFileLoad = new HelperFileLoad();
helperFileLoad.path = PATH_NEWS;
const adminMails = ['vidmanv07@gmail.com'];

const createDataForMail = (
  oldNews: NewsEntity,
  updatedNews: NewsEntity
): Partial<NewsEntity> => {
  const data = {};
  const keys = ['title', 'description', 'cover'];

  keys.forEach((key) => {
    const oldValue = oldNews[key];
    const newValue = updatedNews[key];

    if (oldValue !== newValue) {
      data[`old-${key}`] = oldValue;
      data[`new-${key}`] = newValue;
    }
  });

  if (oldNews.user?.nickName !== updatedNews.user?.nickName) {
    data['old-user'] = oldNews.user.nickName;
    data['new-user'] = updatedNews.user.nickName;
  }

  data['id'] = updatedNews.id;

  return data;
};

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly commentsService: CommentsService,
    private readonly mailService: MailService
  ) {}

  @UseInterceptors(CacheInterceptor)
  @Get('all')
  @ApiOperation({ summary: 'Get all news' })
  @ApiOkResponse({
    description: 'Return a list of all news',
    type: NewsEntity,
    isArray: true,
  })
  @ApiNotFoundResponse({ description: 'Not found.' })
  async getAll() {
    return await this.newsService.findAll();
  }

  @UseInterceptors(CacheInterceptor)
  @Get('all/:userId')
  @ApiOperation({
    summary: 'Return a list of news based on a particular user id',
  })
  @ApiOkResponse({
    description: `Return a list of all user's news`,
    type: NewsEntity,
    isArray: true,
  })
  @ApiNotFoundResponse({ description: 'Not found.' })
  async getAllUserNews(@Param('userId', ParseIntPipe) userId: number) {
    return await this.newsService.findAllByAuthor(userId);
  }

  @UseInterceptors(CacheInterceptor)
  @Get(':id')
  @ApiOperation({ summary: 'Get the news by id' })
  @ApiOkResponse({
    description: 'Return a news based on a particular id',
    type: NewsEntity,
  })
  @ApiNotFoundResponse({ description: 'Not found.' })
  async get(@Param('id', ParseIntPipe) id: number) {
    return await this.newsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.Moderator)
  @Post()
  @ApiOperation({ summary: 'Create new news' })
  @ApiCreatedResponse({
    description: 'The news has been successfully created.',
    type: NewsEntity,
  })
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: helperFileLoad.destinationPath.bind(helperFileLoad),
        filename: helperFileLoad.customFileName.bind(helperFileLoad),
      }),
      fileFilter: imageFileFilter,
    })
  )
  async create(
    @Req() req,
    @Body() news: CreateNewsDto,
    @UploadedFile() cover: Express.Multer.File
  ) {
    const coverPath = cover?.filename ? PATH_NEWS + cover.filename : '';

    const newNews = await this.newsService.create(
      {
        ...news,
        cover: coverPath,
      },
      req.user.userId
    );

    // await this.mailService.sendNewNewsForAdmins(adminMails, newNews);

    return newNews;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Edit news by id' })
  @ApiOkResponse({
    description: 'The news has been successfully updated.',
    type: NewsEntity,
  })
  @ApiNotFoundResponse({ description: 'Not found.' })
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: helperFileLoad.destinationPath.bind(helperFileLoad),
        filename: helperFileLoad.customFileName.bind(helperFileLoad),
      }),
      fileFilter: imageFileFilter,
    })
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNewsDto: UpdateNewsDto,
    @UploadedFile() cover: Express.Multer.File
  ) {
    const data = { ...updateNewsDto };

    if (cover?.filename) data.cover = PATH_NEWS + cover.filename;

    const oldNews = await this.newsService.findOne(id);
    const updatedNews = await this.newsService.update(id, data);
    const dataForEmail = createDataForMail(oldNews, updatedNews);

    // await this.mailService.sendUpdatedNewsForAdmins(
    //   adminMails,
    //   dataForEmail,
    //   oldNews.title,
    // );

    return updatedNews;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete news by id' })
  @ApiOkResponse({
    description: 'The news has been successfully deleted.',
    type: 'string',
  })
  @ApiNotFoundResponse({ description: 'Not found.' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.newsService.remove(id);
  }
}
