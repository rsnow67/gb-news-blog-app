import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { User } from 'src/app/users/schemas/user.schema';
// import { Comments } from '../comments/schemas/comments.schema';

export type NewsDocument = News & Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true, versionKey: false },
  id: false,
})
export class News {
  @Prop()
  id: number;

  @Prop()
  title: string;

  @Prop()
  description: string;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  // user: User;
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  userId: mongoose.ObjectId;

  @Prop()
  cover?: string;

  // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comments' }] })
  // comments: Comments[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

const NewsSchema = SchemaFactory.createForClass(News);

NewsSchema.virtual('comments', {
  ref: 'Comments',
  localField: '_id',
  foreignField: 'newsId',
  justOne: false,
});

NewsSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

export { NewsSchema };
