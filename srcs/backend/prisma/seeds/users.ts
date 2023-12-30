import { faker } from '@faker-js/faker'

// Generate 100 users
export const Users = Array.from({ length: 100 }).map(() => ({
  email: faker.internet.email(),
  password: "$2b$10$3iCDnwqjdjHGayne0Jch8.EbWX3VFQOHtdekWxTaUEVIsDd02cyWm",
  // full name must be unique
  fullname: faker.person.fullName(),
  createdAt: new Date(),
}));
