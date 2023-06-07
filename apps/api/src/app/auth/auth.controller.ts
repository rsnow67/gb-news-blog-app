import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Controller, Post, Request, Res, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

class AuthLogin {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiCreatedResponse({
    description: 'Successful authentication.',
  })
  @ApiUnauthorizedResponse({ description: 'Incorrect email or password.' })
  @ApiBody({
    description: 'User credentials',
    type: AuthLogin,
  })
  async login(
    @Request() req,
    @Res({ passthrough: true }) res
  ): Promise<string> {
    const accessToken = await this.authService.login(req.user);

    return accessToken;
  }
}
