import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { MailModule } from '../mail/mail.module';
import { UsersModule } from '../users/users.module';
import { CommentsModule } from './comments/comments.module';
import { News, NewsSchema } from './schemas/news.schema';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
@Module({
  controllers: [NewsController],
  providers: [NewsService],
  imports: [
    MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }]),
    CacheModule.register({ isGlobal: true }),
    CommentsModule,
    MailModule,
    UsersModule,
  ],
  exports: [NewsService],
})
export class NewsModule {}
