import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { faker } from '@faker-js/faker'
import { Difficulty, Dish, User } from '@prisma/client'

export class RandomDish {
  dish: Dish

  constructor(public user?: User) {
    this.user = this.createRandomMemberUser()
    this.dish = this.createRandomDish(this.user)
  }

  createRandomMemberUser(): User {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password_hash: faker.internet.password(),
      created_at: new Date(),
      role: 'MEMBER',
    }
  }

  createRandomDish(user: User): Dish {
    return {
      id: faker.string.uuid(),
      name: faker.food.dish(),
      description: faker.food.description(),
      instructions: faker.food.description(),
      user_id: user.id,
      cook_time: faker.number.int({ min: 1, max: 4320 }) ?? undefined,
      prep_time: faker.number.int({ min: 1, max: 4320 }),
      cost: faker.number.float({ min: 1, max: 3000, fractionDigits: 2 }),
      duration: faker.number.int({ min: 1, max: 4320 }),
      difficulty: faker.helpers.enumValue(Difficulty),
    }
  }
}

// ver parametros
// export function randomUserAndDishData(): { user: User; dish: Dish } {
//   const userName = faker.person.fullName()
//   const email = faker.internet.email({ firstName: userName })
//   const userId = faker.string.uuid()

//   return {
//     user: {
//       id: userId,
//       name: userName,
//       email,
//       password_hash: faker.internet.password(),
//       created_at: new Date(),
//       role: 'MEMBER',
//     },
//     dish: {
//       id: faker.string.uuid(),
//       name: faker.food.dish(),
//       description: faker.food.description(),
//       instructions: faker.food.description(),
//       user_id: userId,
//       cook_time: faker.number.int({ min: 1, max: 4320 }),
//       prep_time: faker.number.int({ min: 1, max: 4320 }),
//       cost: faker.number.float({ min: 1, max: 3000, fractionDigits: 2 }),
//       duration: faker.number.int({ min: 1, max: 4320 }),
//       difficulty: faker.helpers.enumValue(Difficulty),
//     },
//   }
// }
