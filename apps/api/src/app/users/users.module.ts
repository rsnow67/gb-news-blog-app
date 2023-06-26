import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './../auth/auth.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    // TypeOrmModule.forFeature([UsersEntity]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule),
  ],
  // exports: [UsersService, TypeOrmModule.forFeature([UsersEntity])],
  exports: [UsersService],
})
export class UsersModule {}
