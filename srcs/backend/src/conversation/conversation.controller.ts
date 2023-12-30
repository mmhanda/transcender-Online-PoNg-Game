import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common'; 
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto'; 
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import { UserInConversationGuard } from './guard/UserInConversation.guard';
import { MembershipService } from 'src/membership/membership.service';
import { ValidUserIdGuard } from './guard/create.guard';
import { UpdateGuard } from './guard/Update.guard';
// import { JoinGuard } from './guard/join.guard';
import { KickedGuard } from './guard/kick.guard';
import { InviteGuard } from './guard/invite.guard';
import { multerConfig } from 'src/tools/multer.config';
import { FileInterceptor } from '@nestjs/platform-express';
import { JoinGuard } from './guard/join.guard';
import { BanGuard } from './guard/banUnban.guard';
import { MutedGuard } from './guard/mute.guard';
import { UsersService } from 'src/users/users.service';

@Controller('conversation')
@ApiTags('conversation')
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly memberShipService: MembershipService,
    private readonly userService: UsersService,
  ) {}

  @Post()
  @UseGuards(AuthGuard, ValidUserIdGuard)
  async create(
    @Body() createConversationDto: CreateConversationDto,
    @Req() req: any,
    @Res() res: any,
  ) {
    if (createConversationDto.type === 'direct') {
      const existingConversation = await this.memberShipService.findByTwoId(req.user.id, createConversationDto.guestId);
      if (existingConversation.status === 200 && existingConversation.data.conversation.type === 'direct') {
        return res.status(200).json({
          message: 'Conversation already exists',
          data: {
            id: existingConversation.data.conversation.id,
            cid: existingConversation.data.conversation.cid,
            name: existingConversation.data.conversation.name,
            type: existingConversation.data.conversation.type,
            status: existingConversation.data.conversation.status,
            avatar: existingConversation.data.conversation.avatar,
            createdAt: existingConversation.data.conversation.createdAt,
            description: existingConversation.data.conversation.description,
            members: [],
            messages: [],
            UserStatus: 'member',
          },
        });
      }
    }
    const conversation = await this.conversationService.create(
      createConversationDto,
      );
      if (conversation.status === 201) {
        await this.memberShipService.create({
          userId: req.user.id,
          status: 'owner',
          conversationId: conversation.data.id,
          unread: 0,
        });
        if (conversation.data.type === 'direct') {
          await this.memberShipService.create({
          userId: createConversationDto.guestId,
          status: 'admin',
          conversationId: conversation.data.id,
          unread: 0,
        });
      }
    }
    return res.status(conversation.status).json(conversation);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(@Req() req: any) {
    const id = req.user.id;
    const conversation = await this.conversationService.findUserConversations(id);
    conversation.data.map(conversation => {
      if(conversation.type == 'direct') {
        conversation.users.map(user => {
          if(user.id != id) {
            conversation.users = user
          }
        });
      }
      else {
        // count how many users in conversation
        let count = 0;
        conversation.users.map(() => {
            count++;
        });
        conversation.users = []
        conversation.count = count;
      }
    });
    return conversation;
  }

  @Get('hotChaneels')
  findHotConversations() {
    return this.conversationService.findHotConversations();
  }

  // change member status to admin
  @Get('admin/:id/:memberId')
  @UseGuards(AuthGuard, KickedGuard)
  async changeMemberToAdmin(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
  ) {
    const conversation = await this.conversationService.findOneByCId(id);
    if (conversation.status === 404) {
      return conversation;
    }
    const membership = await this.memberShipService.update(+memberId, { status: 'admin' }, 0);
    return { membership };
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id;
    const conversation = await this.conversationService.findOneByCId(id);
    if (conversation.status === 404) {
      return conversation;
    }
    const membership = await this.conversationService.checkUserAccess( conversation.data.id, userId);
    if (membership === false) {
      return {
        message: 'You are not a member of this conversation',
        data: {
        id: conversation.data.id,
        cid: conversation.data.cid,
        name: conversation.data.name,
        type: conversation.data.type,
        status: conversation.data.status,
        avatar: conversation.data.avatar,
        createdAt: conversation.data.createdAt,
        description: conversation.data.description,
        members: [],
        messages: [],
        UserStatus: 'requested',
        },
      }
    }
    if (conversation.data.messages === undefined) {
      conversation.data.messages = [];
    }
    conversation.data.messages.map((message) => {
      message.me = (message.senderId == userId)
      
      if  ( Array.isArray(message.sender.sender) && message.sender.sender.length)
        message.sender.sender.map ((senderMessage) => {
          message.sender.isFriend = (senderMessage.senderId !== userId || senderMessage.recieverId !== userId)
        });
      delete message.sender.sender;
      message.sender.conversationCid = conversation.data.cid;
      
      conversation.data.members.map((member) => {
        if (member.userId === message.senderId){
          message.sender.memberId = member.id;
          message.sender.status = member.status;
        }
      });
    });
    conversation.data.members.map((member) => {
      member.isMe = (member.userId !== userId)
        
      if (member.userId === userId)
      conversation.data.UserStatus = member.status;
    if(member.status !== 'member' && member.status !== 'admin' && member.status !== 'owner' && member.status !== 'muted')
      conversation.data.members.splice(conversation.data.members.indexOf(member), 1);
    member.conversationCid = conversation.data.cid;
    });

    conversation.data.messages = await Promise.all( conversation.data.messages.map(async (message) => {
        return await this.userService.checkUserBlocked(message.senderId, userId) === false || message.senderId == userId ? message : null;
      })
    ).then((messages) => {
      return messages.filter((message) => message !== null);
    });
    return conversation;
  }

  @Post('join/:id')
  @UseGuards(AuthGuard, JoinGuard)
  async joinConversation(
    @Param('id') id: string, 
    @Req() req: any,
  ) {
    const userId = req.user.id;
    const conversation = await this.conversationService.findOneByCId(id);
    if (conversation.status === 404) {
      return conversation;
    }
    conversation.data.messages.map((message) => {
      message.me = (message.senderId == userId)
      
      if  ( Array.isArray(message.sender.sender) && message.sender.sender.length)
        message.sender.sender.map ((senderMessage) => {
          message.sender.isFriend = (senderMessage.senderId !== userId || senderMessage.recieverId !== userId)
        });
      delete message.sender.sender;
      message.sender.conversationCid = conversation.data.cid;
      
      conversation.data.members.map((member) => {
        if (member.userId === message.senderId){
          message.sender.memberId = member.id;
          message.sender.status = member.status;
        }
      });
    });
    conversation.data.members.map((member) => {
      member.isMe = (member.userId !== userId)
        
      if (member.userId === userId)
      conversation.data.UserStatus = member.status;
    if(member.status !== 'member' && member.status !== 'admin' && member.status !== 'owner' && member.status !== 'muted')
      conversation.data.members.splice(conversation.data.members.indexOf(member), 1);
    member.conversationCid = conversation.data.cid;
    });
    const membership = await this.memberShipService.create({
      userId: req.user.id,
      status: 'member',
      conversationId: conversation.data.id,
      unread: 0,
    });
    return { membership, conversation };
  }

  @Get('invite/:id/:guestId')
  @UseGuards(AuthGuard, InviteGuard)
  async inviteUser(
    @Param('id') id: string,
    @Param('guestId') guestId: number,
  ) {
    const conversation = await this.conversationService.findOneByCId(id);
    if (conversation.status === 404) {
      return conversation;
    }
    const membership = await this.memberShipService.create({
      userId: +guestId,
      status: 'invited',
      conversationId: conversation.data.id,
      unread: 0,
    });
    return { membership };
  }

  @Get('kick/:id/:memberId')
  @UseGuards(AuthGuard, KickedGuard)
  async kickUser(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
  ) {
    const conversation = await this.conversationService.findOneByCId(id);
    if (conversation.status === 404) {
      return conversation;
    }
    const membership = await this.memberShipService.remove(+memberId);
    return { membership };
  }

  @Get('ban/:id/:memberId')
  @UseGuards(AuthGuard, BanGuard)
  async banUser(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
  ) {
    const conversation = await this.conversationService.findOneByCId(id);
    if (conversation.status === 404) {
      return conversation;
    }
    const membership = await this.memberShipService.update(+memberId, { status: 'baned' }, 0);
    return { membership };
  }

  @Get('unban/:id/:memberId')
  @UseGuards(AuthGuard, KickedGuard)
  async unbanUser(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
  ) {
    const conversation = await this.conversationService.findOneByCId(id);
    if (conversation.status === 404) {
      return conversation;
    }
    const membership = await this.memberShipService.remove(+memberId);
    return { membership };
  }

  @Post('mute')
  @UseGuards(AuthGuard, MutedGuard)
  async muteUser(
    @Body('id') id: string,
    @Body('memberId') memberId: string,
    @Body('time') time: number,
  ) {
    const conversation = await this.conversationService.findOneByCId(id);
    if (conversation.status === 404) {
      return conversation;
    }
    time = time * 60;
    const membership = await this.memberShipService.update(+memberId, { status: 'muted'}, time);
    return { membership };
  }

  @Post('unmute')
  @UseGuards(AuthGuard, MutedGuard)
  async unmuteUser(
    @Body('id') id: string,
    @Body('memberId') memberId: string,
  ) {
    const conversation = await this.conversationService.findOneByCId(id);
    if (conversation.status === 404) {
      return conversation;
    }
    const membership = await this.memberShipService.update(+memberId, { status: 'member'}, 0);
    return { membership };
  }

  @Get('leave/:id')
  @UseGuards(AuthGuard, UserInConversationGuard)
  async leaveConversation(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const conversation = await this.conversationService.findOne(+id);
    if (conversation.data.members.length === 1) {
      return this.conversationService.remove(+id);
    }
    const user = await this.memberShipService.findByUserIdConversationId(req.user.id, +id);
    if (user.status === 404) {
      return user;
    }
    const membership = await this.memberShipService.remove(user.data.id);
    return { membership };
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @UseGuards(AuthGuard, UpdateGuard)
  update(
    @Param('id') id: string,
    @Body() updateConversationDto: UpdateConversationDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.conversationService.update(id, updateConversationDto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conversationService.remove(+id);
  }
}
