import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UsersService } from '../../users/users.service';
// import {
//   checkPermission,
//   Modules,
// } from '../../auth/roles/utils/check-permission';
import { NewsService } from '../news.service';
import { UpdateCommentDto } from './dto/update-comment-dto';
import { Comments, CommentsDocument } from './schemas/comments.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comments.name) private commentsModel: Model<CommentsDocument>,
    private newsService: NewsService,
    private usersService: UsersService,
    private eventEmitter: EventEmitter2
  ) {}

  async create(
    newsId: string,
    message: string,
    userId: string
  ): Promise<CommentsDocument> {
    const comment = new this.commentsModel({
      text: message,
      newsId,
      userId,
    });

    return comment.save();
  }

  async findAll(newsId: string): Promise<CommentsDocument[]> {
    return this.commentsModel
      .find({ newsId })
      .populate(['user', 'news'])
      .sort({ createdAt: +1 });
  }

  async findOne(id: string): Promise<CommentsDocument> {
    const comment = await this.commentsModel
      .findById(id)
      .populate(['user', 'news']);

    if (!comment) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'The comment is not found.',
        },
        HttpStatus.NOT_FOUND
      );
    }

    return comment;
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto
  ): Promise<CommentsDocument> {
    const comment = await this.commentsModel.findByIdAndUpdate(
      id,
      updateCommentDto,
      { new: true }
    );

    if (!comment) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'The comment is not found.',
        },
        HttpStatus.NOT_FOUND
      );
    }

    return comment;
  }

  async removeAll(newsId: string): Promise<string> {
    const { deletedCount } = await this.commentsModel.deleteMany({ newsId });

    if (deletedCount === 0) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'The comments are not found.',
        },
        HttpStatus.NOT_FOUND
      );
    }

    return 'The comments have been removed.';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async remove(id: string, userId: string): Promise<string> {
    const comment = await this.findOne(id);
    // const user = await this.usersService.findById(userId);

    // if (
    //   user.id !== comment.user._id &&
    //   !checkPermission(Modules.removeComment, user.roles)
    // ) {
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.FORBIDDEN,
    //       error: 'You do not have sufficient rights to delete.',
    //     },
    //     HttpStatus.FORBIDDEN,
    //   );
    // }

    await this.commentsModel.deleteOne({ id });

    this.eventEmitter.emit('comment.remove', {
      commentId: id,
      newsId: comment.newsId,
    });

    return 'The comment has been removed.';
  }
}
