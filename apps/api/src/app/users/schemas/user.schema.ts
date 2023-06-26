// eslint-disable-next-line @typescript-eslint/no-unused-vars
import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from 'src/app/auth/roles/roles.enum';
// import { News } from 'src/app/news/schemas/news.schema';
// import { Comments } from 'src/app/news/comments/schemas/comments.schema';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true, versionKey: false },
  id: false,
})
export class User {
  @Prop({ required: true })
  nickName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, type: String, select: false })
  password: string;

  @Prop({ type: String, enum: Role })
  roles: Role;

  @Prop()
  avatar?: string;

  // @Prop({
  //   type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'News' }],
  // })
  // news: News[];

  // @Prop({
  //   type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comments' }],
  // })
  // comments: Comments[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('news', {
  ref: 'News',
  localField: '_id',
  foreignField: 'userId',
  justOne: false,
});

UserSchema.virtual('comments', {
  ref: 'Comments',
  localField: '_id',
  foreignField: 'userId',
  justOne: false,
});

export { UserSchema };
