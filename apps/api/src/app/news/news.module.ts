import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module';
import { CommentsModule } from './comments/comments.module';
import { News, NewsSchema } from './schemas/news.schema';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { RedisModule } from '../redis/redis.module';
@Module({
  controllers: [NewsController],
  providers: [NewsService],
  imports: [
    MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }]),
    CommentsModule,
    MailModule,
    RedisModule,
  ],
  exports: [NewsService],
})
export class NewsModule {}
