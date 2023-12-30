import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}

  async create(createConversationDto: CreateConversationDto) {
    try {
      const create = await this.prisma.conversation.create({
        data: {
          name: createConversationDto.name,
          description: createConversationDto.description,
          status: createConversationDto.status,
          type: createConversationDto.type,
          password: createConversationDto.password ? bcrypt.hashSync(createConversationDto.password, 10) : null,
        },
      });
      return {
        message: 'Conversation created successfully',
        data: create,
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      return {
        message: 'Conversation not created',
        data: error,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async findAll() {
    try {
      const conversations = await this.prisma.conversation.findMany();
      return {
        message: 'Conversations retrieved successfully',
        data: conversations,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'Conversations not retrieved',
        data: error,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async findOneByCId(cid: string) {
    try {
      const conversation = await this.prisma.conversation.findUnique({
        where: {
          cid: cid,
        },
        include: {
          messages: {
            orderBy: {
              createdAt: 'asc',
            },
            include: {
              sender: {
                select: {
                  id: true,
                  avatar: true,
                  fullname: true,
                  sender: true,
                },
              },
            },
          },
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  fullname: true,
                  avatar: true,
                  status: true,
                },
              },
            },
          },
        },
      });
  
      if (!conversation) {
        return {
          message: 'Conversation not found',
          data: null,
          status: HttpStatus.NOT_FOUND,
        };
      }
  
      return {
        message: 'Conversation retrieved successfully',
        data: conversation,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'Conversation not retrieved',
        data: error,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
  

  async findOne(id: number) {
    try {
      const conversation = await this.prisma.conversation.findUnique({
        where: {
          id: id,
        },
        include: {
          messages: {
            orderBy: {
              createdAt: 'asc',
            },
            include: {
              sender: {
                select: {
                  id: true,
                  avatar: true,
                  sender: true,
                  receiver: true,
                },
              },
            },
          },
          members: {
            select: {
              id: true,
              status: true,
              mutedEndTime: true,
            },
          },
        },
      });
      if (!conversation) {
        return {
          message: 'Conversation not found',
          data: null,
          status: HttpStatus.NOT_FOUND,
        };
      }
      return {
        message: 'Conversation retrieved successfully',
        data: conversation,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'Conversation not retrieved',
        data: error,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async findHotConversations() {
    try {
      const conversations = await this.prisma.conversation.findMany({
        where: {
          type: 'group',
        },
        include: {
          members: {
            select: {
              user: {
                select: {
                  avatar: true,
                  
                },
              },
            },
          },
        },
        orderBy: {
          members: {
            _count: 'desc',
          },
        },
        take: 30,
      });
  
      const conversationsWithMembersInfo = conversations.map((conversation) => {
        const membersInfo = conversation.members.slice(0, 2).map((member) => ({
          avatar: member.user.avatar,
        }));
  
        return {
          ...conversation,
          members: undefined,
          password: undefined,
          type: undefined,
          membersInfo: membersInfo,
          membersCount: conversation.members.length,
        };
      });
  
      return {
        message: 'Conversations retrieved successfully',
        data: conversationsWithMembersInfo,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'Conversations not retrieved',
        data: error,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
  

  async findUserConversations(userId: number) {
    try {
      const conversations = await this.prisma.conversation.findMany({
        where: {
          members: {
            some: {
              userId: userId,
            },
          },
        },
        select: {
          id: true,
          name: true,
          description: true,
          status: true,
          type: true,
          cid: true,
          avatar: true,
          createdAt: true,
          members: {
            select: {
              user: {
                select: {
                  id: true,
                  fullname: true,
                  avatar: true,
                  status: true,
                },
              },
              status: true,
              mutedEndTime: true,
            },
          },
          messages: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
            select: {
              id: true,
              content: true,
              createdAt: true,
            },
          },
        },
      });
      
      const formattedConversations = conversations.map((conversation) => {
        const lastMessage = conversation.messages[0];
        const users = conversation.members.map((member) => {
          return member.user;
        });
        return {
          id: conversation.id,
          avatar: conversation.avatar,
          name: conversation.name,
          description: conversation.description,
          status: conversation.status,
          type: conversation.type,
          cid: conversation.cid,
          createdAt : conversation.createdAt,
          users,
          lastMessage,
        };
      });
      // sort conversations by last message date
      formattedConversations.sort((a, b) => {
        if (a.lastMessage && b.lastMessage) {
          return new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime();
        }
        return 0;
      });
  
      return {
        message: 'Conversations retrieved successfully',
        data: formattedConversations,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'Conversations not retrieved',
        data: error,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
  

  async checkUserAccessByCid(conversationId: string, userId: number) {
    try {
      const conversation = await this.prisma.conversation.findUnique({
        where: {
          cid: conversationId,
        },
        include: {
          members: {
            where: {
              userId: userId,
            },
          },
        },
      });
      if (!conversation.members.length) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  async checkUserAccess(conversationId: number, userId: number) {
    try {
      const conversation = await this.prisma.conversation.findUnique({
        where: {
          id: +conversationId,
        },
        include: {
          members: {
            where: {
              userId: userId,
            },
          },
        },
      });
      if (!conversation.members.length) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  async checkUserAdmin(conversationId: string, userId: number) {
    try {
      const conversation = await this.prisma.conversation.findUnique({
        where: {
          cid: conversationId,
        },
        include: {
          members: {
            where: {
              userId: userId,
              status: 'admin',
            },
          },
        },
      });
      if (!conversation.members.length) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }


  async checkUserOwner(conversationId: string, userId: number) {
    try {
      const conversation = await this.prisma.conversation.findUnique({
        where: {
          cid: conversationId,
        },
        include: {
          members: {
            where: {
              userId: userId,
              status: 'owner'
            },
          },
        },
      });
      if (!conversation.members.length) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  async checkUserMember(conversationId: string, userId: number) {
    try {
      const conversation = await this.prisma.conversation.findUnique({
        where: {
          cid: conversationId,
        },
        include: {
          members: {
            where: {
              userId: userId,
              status: 'member',
            },
          },
        },
      });
      if (!conversation.members.length) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  async checkInvite(conversationId: string, userId: number) {
    try {
      const conversation = await this.prisma.conversation.findUnique({
        where: {
          cid: conversationId,
        },
        include: {
          members: {
            where: {
              userId: userId,
              status: 'invited',
            },
          },
        },
      });
      if (!conversation.members.length) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  async checkUserBan(conversationId: string, userId: number) {
    try {
      const conversation = await this.prisma.conversation.findUnique({
        where: {
          cid: conversationId,
        },
        include: {
          members: {
            where: {
              userId: userId,
              status: 'baned',
            },
          },
        },
      });
      if (!conversation.members.length) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  async checkUserMuted(conversationId: string, userId: number) {
    try {
      const conversation = await this.prisma.conversation.findUnique({
        where: {
          cid: conversationId,
        },
        include: {
          members: {
            where: {
              userId: userId,
              status: 'muted',
            },
          },
        },
      });
      if (conversation.members.length) {
        if (conversation.members[0].mutedEndTime > new Date()) {
          return true;
        }
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  async update(id: string, updateConversationDto: UpdateConversationDto, file: Express.Multer.File) {
    try {
      if (file) {
        file.filename = process.env.Server_URL + '/' + file.filename;
      }
      const conversation = await this.prisma.conversation.findUnique({
        where: {
          cid: id,
        },
      });
      const update = await this.prisma.conversation.update({
        where: {
          cid: id,
        },
        data: {
          name: updateConversationDto.name,
          status: updateConversationDto.status,
          type: updateConversationDto.type,
          description: updateConversationDto.description,
          password: updateConversationDto.password ? bcrypt.hashSync(updateConversationDto.password, 10) : null,
          avatar: file ? file.filename : conversation.avatar,
        },
      });
      if (!update) {
        return {
          message: 'Conversation not found',
          data: null,
          status: HttpStatus.NOT_FOUND,
        };
      }
      return {
        message: 'Conversation updated successfully',
        data: update,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'Conversation not updated',
        data: error,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async remove(id: number) {
    try {
      const remove = await this.prisma.conversation.delete({
        where: {
          id: id,
        },
      });
      if (!remove) {
        return {
          message: 'Conversation not found',
          data: null,
          status: HttpStatus.NOT_FOUND,
        };
      }
      return {
        message: 'Conversation deleted successfully',
        data: remove,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'Conversation not deleted',
        data: error,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
