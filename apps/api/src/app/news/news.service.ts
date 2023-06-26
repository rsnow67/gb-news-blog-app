import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { CreateNewsDto } from './dto/create-news-dto';
import { UpdateNewsDto } from './dto/update-news-dto';
import { News, NewsDocument } from './schemas/news.schema';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private newsModel: Model<NewsDocument>,
    private usersService: UsersService
  ) {}

  async create(
    createNewsDto: CreateNewsDto,
    userId: string
  ): Promise<NewsDocument> {
    const newNews = new this.newsModel({
      ...createNewsDto,
      userId: userId,
    });

    return newNews.save();
  }

  findAll(): Promise<NewsDocument[]> {
    return this.newsModel
      .find({})
      .populate(['user', 'comments'])
      .sort({ createdAt: +1 });
  }

  // findAllByAuthor(userId: number): Promise<NewsDocument[]> {
  //   return this.newsRepository.find({
  //     where: {
  //       user: {
  //         id: userId,
  //       },
  //     },
  //     relations: ['user', 'comments', 'comments.user'],
  //   });
  // }

  async findOne(id: string): Promise<NewsDocument> {
    const news = await this.newsModel
      .findById(id)
      .populate(['user', 'comments']);

    if (!news) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'The news is not found.',
        },
        HttpStatus.NOT_FOUND
      );
    }

    return news;
  }

  async update(
    id: string,
    updateNewsDto: UpdateNewsDto
  ): Promise<NewsDocument> {
    const news = await this.newsModel.findByIdAndUpdate(id, updateNewsDto, {
      new: true,
    });

    if (!news) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'The news is not found.',
        },
        HttpStatus.NOT_FOUND
      );
    }

    return news;
  }

  async remove(id: string): Promise<string> {
    const news = await this.newsModel.findByIdAndDelete(id);

    if (!news) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'The news is not found.',
        },
        HttpStatus.NOT_FOUND
      );
    }

    return 'The news has been removed.';
  }
}
