import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  // UseGuards,
} from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { HelperFileLoad } from '../../utils/HelperFileLoad';
// import { JwtAuthGuard } from './../../auth/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment-dto';
import { UpdateCommentDto } from './dto/update-comment-dto';
import { CommentsService } from './comments.service';
import { CommentsEntity } from './comments.entity';

const PATH_AVATAR = '/avatar-static/';
const helperFileLoad = new HelperFileLoad();
helperFileLoad.path = PATH_AVATAR;

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // @UseGuards(JwtAuthGuard)
  @Post(':newsId')
  @ApiOperation({ summary: 'Create new comment' })
  @ApiOkResponse({
    description: 'The comment has been successfully created.',
    type: CommentsEntity,
  })
  create(
    @Param('newsId') newsId: string,
    @Body() createCommentDto: CreateCommentDto
    // @Req() req
  ) {
    const { text } = createCommentDto;
    // const jWtUserId = req.user.userId;
    const jWtUserId = '6499eaa73ba7e826112f7c74';

    return this.commentsService.create(newsId, text, jWtUserId);
  }

  @Get(':newsId')
  @ApiOperation({ summary: 'Get all comments of news' })
  @ApiOkResponse({
    description: 'Return a list of all comments of news',
    type: CommentsEntity,
    isArray: true,
  })
  @ApiNotFoundResponse({ description: 'Not found.' })
  async getAll(@Param('newsId') newsId: string) {
    return this.commentsService.findAll(newsId);
  }

  @Get('comment/:id')
  @ApiOperation({ summary: 'Get one comment by id' })
  @ApiOkResponse({
    description: 'Return a news comment based on a particular id',
    type: CommentsEntity,
  })
  @ApiNotFoundResponse({ description: 'Not found.' })
  async get(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Edit comment by id' })
  @ApiOkResponse({
    description: 'The comment has been successfully updated.',
    type: CommentsEntity,
  })
  @ApiNotFoundResponse({ description: 'Not found.' })
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(id, updateCommentDto);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete comment by id' })
  @ApiOkResponse({
    description: 'The comment has been successfully deleted.',
    type: 'string',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  remove(@Param('id') id: string, @Req() req) {
    return this.commentsService.remove(id, req.user.userId);
  }
}
