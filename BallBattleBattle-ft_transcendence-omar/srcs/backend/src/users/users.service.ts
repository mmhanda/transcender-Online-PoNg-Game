import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserproviderService } from '../userprovider/userprovider.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly userprovider: UserproviderService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const fullnameExist = await this.prisma.user.findFirst({
        where: {
          fullname: {
            equals: createUserDto.fullname,
            mode: 'insensitive',
          },
        },
      });
      if (fullnameExist) {
        throw { meta: { target: 'fullname' } }; 
      }
      const user = await this.prisma.user.create({
        data: {
          fullname: createUserDto.fullname,
          email: createUserDto.email,
          password: hashedPassword,
        },
      });
      const { password, ...userData } = user;
      return {
        message: 'User created successfully',
        data: userData,
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      return {
        message:  error.meta.target == 'email' ? 'Email already exist' : 'Fullname already exist', // 'Fullname already exist
        status: HttpStatus.AMBIGUOUS,
      };
    }
  }

  async createWithProvider(User: any) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: User.provider == 42 ? User.emails[0].value : User.email,
        },
      });
      const fullnameExist = await this.prisma.user.findFirst({
        where: {
          fullname: {
            equals: User.displayName,
            mode: 'insensitive',
          },
        },
      });
      if (!user) {
        const user = await this.prisma.user.create({
          data: {
            fullname: fullnameExist ? User.displayName + fullnameExist.id : User.displayName,
            email: User.provider == 42 ? User.emails[0].value : User.email,
            avatar: User.provider == 42 ? User._json.image.link : User.photos,
          },
        });
        const provider = await this.userprovider.create(
          user.id,
          User.provider == 42 ? 2 : 1,
          User.id,
        );
        return {
          message: 'User created successfully',
          data: { user, provider },
          status: HttpStatus.CREATED,
        };
      } else {
        const provider = await this.userprovider.create(
          user.id,
          User.provider == 42 ? 2 : 1,
          User.id,
        );
        return {
          message: 'Provider created successfully',
          data: { user, provider },
          status: HttpStatus.CREATED,
        };
      }
    } catch (error) {
      return {
        message: 'User not created',
        data: error,
        status: HttpStatus.AMBIGUOUS,
      };
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany();
      return {
        message: 'Users retrieved successfully',
        data: users,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'Users not retrieved',
        data: error,
        status: HttpStatus.AMBIGUOUS,
      };
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
        select: {
          id: true,
          fullname: true,
          email: true,
          avatar: true,
          status: true,
          lastSeen: true,
          table_style: true,
          twoFactorEnabled: true,
          twoFactorSecret: true,
          updatedAt: true,
          createdAt: true,
          password: true,
          playerStats: {
            include: {
              host: true,
              guest: true,
              win: true,
            },
          },
          sender: true,
          receiver: true,
        },
      });
      if (!user) {
        return {
          message: 'User not found',
          data: null,
          status: HttpStatus.NOT_FOUND,
        };
      }
      return {
        message: 'User retrieved successfully',
        data: user,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'User not retrieved',
        data: error,
        status: HttpStatus.AMBIGUOUS,
      };
    }
  }

  async findLLTiers() {
    const tiers = await this.prisma.tiers.findMany({
      orderBy: {
        id: 'asc',
      },
    });
    return tiers
  }

  async findOneByUsername(username: string) {
    try {
      const user = await this.prisma.user.findMany({
        where: {
          OR: [
            {
              fullname: {
                contains: username.trim(),
                mode: 'insensitive',
              },
            },
            {
              id : isNaN(+username) ? 0 : +username,
            },
          ],
        },
        select: {
          id: true,
          fullname:true,
          email: true,
          avatar: true,
          status: true,
          lastSeen: true,
          table_style: true,
          updatedAt: true,
          createdAt: true
        }
      });
      if (!user) {
        return {
          message: 'User not found',
          data: null,
          status: HttpStatus.NOT_FOUND,
        };
      }
      return {
        message: 'User retrieved successfully',
        data: user,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'User not retrieved',
        data: error,
        status: HttpStatus.AMBIGUOUS,
      };
    }
  }

  async findOneByEmail(email: string, password: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (user) {
        if (await bcrypt.compare(password, user.password)) {
          const { password, ...result } = user;
          return result;
        }
        return null;
      }
    } catch (error) {
      
      return {
        message: 'User not retrieved',
        data: error,
        status: HttpStatus.AMBIGUOUS,
      };
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto, file: Express.Multer.File) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
      });
      const fullnameExist = await this.prisma.user.findFirst({
        where: {
          fullname: {
            equals: updateUserDto.fullname,
            mode: 'insensitive',
          },
        },
      });
      if (updateUserDto.fullname && fullnameExist && user.fullname != updateUserDto.fullname)
        {
          return {
            message: 'Fullname already exist',
            data: null,
            status: 300,
          };
        }
      if(user.password && updateUserDto.oldPassword && updateUserDto.password && updateUserDto.confirmPassword){
        if (!await bcrypt.compare(updateUserDto.password, user.password)) {
          return {
            message: 'Password and confirm password are not the same',
            data: null,
            status: 300, 
          }
        }
      }
      const update = await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          fullname: updateUserDto.fullname,
          email: updateUserDto.email,
          avatar: file ? file.filename : user.avatar,
          table_style: updateUserDto.table_style ? updateUserDto.table_style : user.table_style,
          password: updateUserDto.password ? await bcrypt.hash(updateUserDto.password, 10) : user.password,
          updatedAt: new Date(),
        },
      });
      if (!update) {
        return {
          message: 'User not found',
          data: null,
          status: HttpStatus.NOT_FOUND,
        };
      }
      return {
        message: 'User updated successfully',
        data: update,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'User not updated',
        data: error,
        status: 230,
      };
    }
  }

  async updateStatus(id: number, status: string) {
    try {
      await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          status: status,
        },
      });
    } catch (error) {
      return {
        message: 'User not updated',
        data: error,
        status: HttpStatus.AMBIGUOUS,
      };
    }
  }

  async updateUnreadNotification(number: number){
    try{
      const user = await this.prisma.user.update({
        where: {
          id: number,
        },
        data: {
          unreadNotification: 0,
        },
      });
      return user;
    }
    catch(err){
      
      return err;
    }
  }

  async updateTwofactorAuth(userid: number, secret: string) {
    try {
      let update;
      if(!secret){
        update = await this.prisma.user.update({
          where: {
            id: +userid,
          },
          data: {
            twoFactorSecret: null,
            twoFactorEnabled: false
          },
        });
      }
      else{
        update = await this.prisma.user.update({
          where: {
            id: +userid,
          },
          data: {
            twoFactorSecret: secret,
            twoFactorEnabled: true
          },
        });
      }
      if (!update) {
        return {
          message: 'User not found',
          data: null,
          status: HttpStatus.NOT_FOUND,
        };
      }
      return {
        message: 'User updated successfully',
        data: update,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'User not updated',
        data: error,
        status: HttpStatus.AMBIGUOUS,
      };
    }
  }

  async checkUserBlocked(id: number, blockedId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
        include: {
          blocked: true,
          blocker: true,
        },
      });
      const blocked = user.blocked.filter((user) => user.blockedId === blockedId || user.blockerId === blockedId);
      const blocker = user.blocker.filter((user) => user.blockerId === blockedId || user.blockedId === blockedId);
      if (blocked.length > 0 || blocker.length > 0) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  async checkUserFriend(id: number, friendId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
        include: {
          sender: true,
          receiver: true,
        },
      });
      const sender = user.sender.filter((user) => user.receiverId === friendId);
      const receiver = user.receiver.filter((user) => user.senderId === friendId);
      if (sender.length > 0 || receiver.length > 0) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  async remove(id: number) {
    try {
      const remove = await this.prisma.user.delete({
        where: {
          id: id,
        },
      });
      if (!remove) {
        return {
          message: 'User not found',
          data: null,
          status: HttpStatus.NOT_FOUND,
        };
      }
      return {
        message: 'User deleted successfully',
        data: remove,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'User not deleted',
        data: error,
        status: HttpStatus.AMBIGUOUS,
      };
    }
  }
}
