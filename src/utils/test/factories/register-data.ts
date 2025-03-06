import { faker } from '@faker-js/faker'
import { Prisma } from '@prisma/client'

export function createRegisterData(): Prisma.UserCreateInput {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const email = faker.internet.email({ firstName, lastName })

  return {
    firstName,
    lastName,
    userName: firstName,
    email,
    passwordHash: faker.internet.password(),
  }
}
