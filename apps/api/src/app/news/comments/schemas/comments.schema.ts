import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { User } from 'src/app/users/schemas/user.schema';
// import { News } from '../../schemas/news.schema';

export type CommentsDocument = Comments & Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true, versionKey: false },
  id: false,
})
export class Comments {
  @Prop()
  id: number;

  @Prop()
  text: string;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  // user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  userId: mongoose.ObjectId;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'News' })
  // news: News;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  newsId: mongoose.ObjectId;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

const CommentsSchema = SchemaFactory.createForClass(Comments);

CommentsSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

CommentsSchema.virtual('news', {
  ref: 'News',
  localField: 'newsId',
  foreignField: '_id',
  justOne: true,
});

export { CommentsSchema };
