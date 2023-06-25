import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { CommentsModule } from './comments/comments.module';
import { MailModule } from '../mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsEntity } from './news.entity';
import { UsersModule } from '../users/users.module';
@Module({
  controllers: [NewsController],
  providers: [NewsService],
  imports: [
    TypeOrmModule.forFeature([NewsEntity]),
    CacheModule.register({ isGlobal: true }),
    CommentsModule,
    MailModule,
    UsersModule,
  ],
  exports: [TypeOrmModule.forFeature([NewsEntity]), NewsService],
})
export class NewsModule {}
