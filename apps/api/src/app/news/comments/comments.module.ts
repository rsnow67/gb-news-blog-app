import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './../../auth/auth.module';
import { UsersModule } from '../../users/users.module';
import { NewsModule } from '../news.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comments, CommentsSchema } from './schemas/comments.schema';
import { SocketCommentsGateway } from './sockets-comments.gateway';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, SocketCommentsGateway],
  imports: [
    MongooseModule.forFeature([
      { name: Comments.name, schema: CommentsSchema },
    ]),
    forwardRef(() => NewsModule),
    UsersModule,
    AuthModule,
  ],
  exports: [CommentsService],
})
export class CommentsModule {}
