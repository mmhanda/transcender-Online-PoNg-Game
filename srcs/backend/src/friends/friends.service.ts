import { Injectable } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFriendDto: CreateFriendDto) {
    try {
      const friend = await this.prisma.friends.create({
        data: {
          senderId: createFriendDto.senderId,
          receiverId: createFriendDto.receiverId,
        },
      });
      return {
        message: 'Friend created successfully',
        friend,
      };
    } catch (error) {
      return {
        message: 'Error creating friend',
        error,
      };
    }
  }

  async findAll() {
    try {
      const friends = await this.prisma.friends.findMany();
      return {
        message: 'Friends retrieved successfully',
        friends,
      };
    } catch (error) {
      return {
        message: 'Error retrieving friends',
        error,
      };
    }
  }

  async findOne(id: number) {
    try {
      const friend = await this.prisma.friends.findUnique({
        where: {
          id: id,
        },
      });
      return {
        message: 'Friend retrieved successfully',
        friend,
      };
    } catch (error) {
      return {
        message: 'Error retrieving friend',
        error,
      };
    }
  }

  async findTwoFriends(user1: number, user2: number) {
    try {
      const friends = await this.prisma.friends.findMany({
        where: {
          OR: [
            {
              senderId: user1,
              receiverId: user2,
            },
            {
              senderId: user2,
              receiverId: user1,
            },
          ],
        },
      });
      return {
        status: 200,
        message: 'Friends retrieved successfully',
        friends,
      };
    } catch (error) {
      return {
        message: 'Error retrieving friends',
        error,
      };
    }
  }

  async findFriends(id: number) {
    try {
      const friends = await this.prisma.friends.findMany({
        where: {
          status: 'accepted',
          OR: [
            {
              senderId: id,
            },
            {
              receiverId: id,
            },
          ],
        },
        include: {
          sender: true,
          receiver: true,
        },
      });
      return {
        message: 'Friends retrieved successfully',
        friends,
      };
    } catch (error) {
      return {
        message: 'Error retrieving friends',
        error,
      };
    }
  }

  async update(id: number, updateFriendDto: UpdateFriendDto) {
    try {
      const friend = await this.prisma.friends.update({
        where: {
          id: id,
        },
        data: {
          senderId: updateFriendDto.senderId,
          receiverId: updateFriendDto.receiverId,
          status: updateFriendDto.status,
        },
      });
      return {
        message: 'Friend updated successfully',
        friend,
      };
    } catch (error) {
      return {
        message: 'Error updating friend',
        error,
      };
    }
  }

  async remove(id: number) {
    try {
      const friend = await this.prisma.friends.delete({
        where: {
          id: id,
        },
      });
      return {
        message: 'Friend deleted successfully',
        friend,
        status: 202,
      };
    } catch (error) {
      return {
        message: 'Error deleting friend',
        error,
      };
    }
  }
}
