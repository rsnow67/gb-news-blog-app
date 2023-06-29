import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NewsModule } from './news/news.module';
import { MailModule } from './mail/mail.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    // MongooseModule.forRoot('mongodb://localhost:27017', {
    //   dbName: 'gb-news-app',
    // }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    NewsModule,
    MailModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
