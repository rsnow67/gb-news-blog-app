import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RedisService } from '../redis/redis.service';
import { CreateNewsDto } from './dto/create-news-dto';
import { UpdateNewsDto } from './dto/update-news-dto';
import { News, NewsDocument } from './schemas/news.schema';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private newsModel: Model<NewsDocument>,
    private cacheManager: RedisService
  ) {}

  async create(
    createNewsDto: CreateNewsDto,
    userId: string
  ): Promise<NewsDocument> {
    const newNews = new this.newsModel({
      ...createNewsDto,
      userId: userId,
    });

    const savedNews = newNews.save();

    this.cacheManager.del('newsAll');

    return savedNews;
  }

  async findAll() {
    const cachedNews = await this.cacheManager.get<NewsDocument[]>('newsAll');

    if (cachedNews) {
      return cachedNews;
    }

    const news = await this.newsModel
      .find({})
      .populate(['user', 'comments'])
      .sort({ createdAt: +1 });

    await this.cacheManager.set<NewsDocument[]>('newsAll', news, 10);

    return news;
  }

  async findAllByAuthor(userId: string): Promise<NewsDocument[]> {
    const cachedUserNews = await this.cacheManager.get<NewsDocument[]>(
      `${userId}-news`
    );

    if (cachedUserNews) {
      return cachedUserNews;
    }

    const userNews = await this.newsModel
      .find({ userId })
      .populate(['user', 'comments'])
      .sort({ createdAt: +1 });

    await this.cacheManager.set<NewsDocument[]>(`${userId}-news`, userNews, 10);

    return userNews;
  }

  async findOne(id: string): Promise<NewsDocument> {
    const cachedData = await this.cacheManager.get<NewsDocument>(id);

    if (cachedData) {
      return cachedData;
    }

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

    await this.cacheManager.set<NewsDocument>(id, news, 10);

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

    await this.cacheManager.del(id);

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

    await this.cacheManager.del(id);

    return 'The news has been removed.';
  }
}
