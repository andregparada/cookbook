import { UsersRepository } from '@/repositories/users-repository'
import { faker } from '@faker-js/faker'
import { RecipeDifficulty } from '@prisma/client'

export class CreateRecipeData {
  constructor(private usersRepository: UsersRepository) {}

  async execute() {
    const user = await this.usersRepository.create({
      id: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      userName: faker.person.fullName(),
      email: faker.internet.email(),
      passwordHash: faker.internet.password(),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      isActive: true,
      role: 'MEMBER',
    })

    return {
      title: faker.food.dish(),
      description: faker.food.description(),
      instructions: faker.food.description(),
      cookTime: faker.number.int({ min: 1, max: 4320 }) ?? undefined,
      prepTime: faker.number.int({ min: 1, max: 4320 }) ?? undefined,
      difficulty: faker.helpers.enumValue(RecipeDifficulty) ?? undefined,
      cost:
        faker.number.float({ min: 1, max: 3000, fractionDigits: 2 }) ??
        undefined,
      servings: faker.number.int({ min: 1, max: 100 }) ?? undefined,
      userId: user.id,
      ingredients: [
        {
          name: faker.food.ingredient(),
          quantity: faker.number.int({ min: 1, max: 100 }),
          unit: 'grams',
        },
      ],
      tags: [{ title: faker.food.adjective() }],
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
