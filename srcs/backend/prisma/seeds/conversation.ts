import { faker } from "@faker-js/faker";

// Generate 100 conversations with memberships and messages for each conversation
export const Conversations = Array.from({ length: 100 }).map(() => ({
  name: faker.lorem.words(2),
  description: faker.lorem.words(20),
  status: "public",
  type: "group",
  createdAt: new Date(),
}));