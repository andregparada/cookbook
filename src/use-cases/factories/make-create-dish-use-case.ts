import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { CreateDishUseCase } from '../create-dish'
import { PrismaDishesRepository } from '@/repositories/prisma/prisma-dishes-repository'
import { PrismaIngredientsRepository } from '@/repositories/prisma/prisma-ingredients-repository'
import { PrismaTagsRepository } from '@/repositories/prisma/prisma-tags-repository'
import { PrismaIngredientsOnDishesRepository } from '@/repositories/prisma/prisma-ingredients-on-dishes-repository'

export function makeCreateDishUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const dishesRepository = new PrismaDishesRepository()
  const ingredientsRepository = new PrismaIngredientsRepository()
  const tagsRepository = new PrismaTagsRepository()
  const ingredientsOnDishesRepository =
    new PrismaIngredientsOnDishesRepository()
  const useCase = new CreateDishUseCase(
    usersRepository,
    dishesRepository,
    ingredientsRepository,
    ingredientsOnDishesRepository,
    tagsRepository,
  )

  return useCase
}
