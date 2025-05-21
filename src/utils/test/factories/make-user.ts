import { faker } from '@faker-js/faker'
import { User } from '@prisma/client'

export function makeUser(override?: Partial<User>): User {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const email = faker.internet.email({ firstName, lastName })

  return {
    id: faker.string.uuid(),
    firstName,
    lastName,
    userName: firstName,
    email,
    passwordHash: faker.internet.password(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    role: 'MEMBER',
    isActive: true,
    ...override,
  }
}
