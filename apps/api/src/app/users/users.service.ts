import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { checkPermission } from './../auth/roles/utils/check-permission';
import { Modules } from '../auth/roles/utils/check-permission';
import { hash } from '../utils/crypto';
import { CreateUserDto } from './dto/create-user-dto';
import UpdateUserDto from './dto/update-user-dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<Partial<UserDocument>> {
    const passwordHash = await hash(createUserDto.password);

    const newUser = new this.userModel({
      ...createUserDto,
      password: passwordHash,
    });

    await newUser.save();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithOutPassword } = newUser.toObject();

    return userWithOutPassword;
  }

  async findAll(): Promise<UserDocument[]> {
    const users = await this.userModel
      .find({})
      .populate(['news', 'comments'])
      .sort({ createdAt: +1 });

    return users;
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel
      .findById(id)
      .populate(['news', 'comments']);

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'The user is not found.',
        },
        HttpStatus.NOT_FOUND
      );
    }

    return user;
  }

  async findByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email }).select('+password');

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'The user is not found.',
        },
        HttpStatus.NOT_FOUND
      );
    }

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto
  ): Promise<Partial<UserDocument>> {
    const data = { ...updateUserDto };

    if (data.password) {
      data.password = await hash(data.password);
    }

    if (!checkPermission(Modules.changeRole, data.roles)) {
      delete data.roles;
    }

    const user = await this.userModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'The user is not found.',
        },
        HttpStatus.NOT_FOUND
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithOutPassword } = user;

    return userWithOutPassword;
  }

  async remove(id: string): Promise<string> {
    const user = await this.userModel.findByIdAndDelete(id);

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'The user is not found.',
        },
        HttpStatus.NOT_FOUND
      );
    }

    return `The user ${user.nickName} has been removed.`;
  }
}
