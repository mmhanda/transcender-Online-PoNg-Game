import { Tiers } from "./seeds/Tiers";
import { Providers } from "./seeds/provider";
import { Matches } from "./seeds/matches";
import { Users } from "./seeds/users";
import { Prisma, PrismaClient } from "@prisma/client";
import { Conversations } from "./seeds/conversation";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  // Existing code to seed Tiers and Providers
  for (const tier of Tiers) {
    await prisma.tiers.create({
      data: tier,
    });
  }
  for (const provider of Providers) {
    await prisma.provider.create({
      data: provider as Prisma.ProviderCreateInput,
    });
  }

  for (const user of Users) {
    await prisma.user.create({
      data: {
        email: user.email,
        password: user.password,
        fullname: user.fullname,
        createdAt: user.createdAt,
      }
    });
  }

  const usersDb = await prisma.user.findMany();
  const playerStats = usersDb.map((user) => ({
    userId: user.id,
    rank: Math.floor(Math.random() * 2000),
    createdAt: new Date(),
  }));

  for (const user of playerStats) {
    await prisma.playerStats.create({
      data: {
        userId: user.userId,
        rank: user.rank,
        createdAt: user.createdAt,
      },
    });
  }

  // create conversations with memberships and messages
  for (const conversation of Conversations) {
    const newConversation = await prisma.conversation.create({
      data: conversation as Prisma.ConversationCreateInput,
    });
    const users = await prisma.user.findMany();
    for (const user of users) {
      await prisma.membership.create({
        data: {
          userId: user.id,
          conversationId: newConversation.id,
        },
      });
    }
    const messages = Array.from({ length: 100 }).map(() => ({
      content: faker.lorem.words(10),
      createdAt: new Date(),
      senderId: users[Math.floor(Math.random() * users.length)].id,
      conversationId: newConversation.id,
    }));
    for (const message of messages) {
      await prisma.message.create({
        data: message,
      });
    }
  }

  // Seed fake matches
  for (const match of Matches) {
    await prisma.match.create({
      data: match,
    });
  }
}

main()
  .catch((e) => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
