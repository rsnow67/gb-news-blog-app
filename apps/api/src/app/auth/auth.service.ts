import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersEntity } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { compare } from '../utils/crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(
    email: string,
    password: string
  ): Promise<Partial<UsersEntity> | null> {
    const user = await this.usersService.findByEmail(email);
    const isPasswordCorrect = await compare(password, user.password);

    if (user && isPasswordCorrect) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: Partial<UsersEntity>): Promise<string> {
    const payload = { id: user.id };

    return this.jwtService.sign(payload);
  }

  async verify(token: string) {
    return this.jwtService.verify(token);
  }

  async decode(token: string) {
    return this.jwtService.decode(token);
  }
}
