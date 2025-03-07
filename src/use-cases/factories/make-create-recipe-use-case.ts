import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { PrismaIngredientsRepository } from '@/repositories/prisma/prisma-dishes-repository'
import { PrismaIngredientsRepository } from '@/repositories/prisma/prisma-ingredients-repository'
import { PrismaTagsRepository } from '@/repositories/prisma/prisma-tags-repository'
import { PrismaIngredientsOnDishesRepository } from '@/repositories/prisma/prisma-ingredients-on-dishes-repository'
import { CreateRecipeUseCase } from '../recipes/create'

export function makeCreateRecipeUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const dishesRepository = new PrismaReci()
  const ingredientsRepository = new PrismaIngredientsRepository()
  const tagsRepository = new PrismaTagsRepository()
  const ingredientsOnDishesRepository =
    new PrismaIngredientsOnDishesRepository()
  const useCase = new CreateRecipeUseCase(
    usersRepository,
    dishesRepository,
    ingredientsRepository,
    ingredientsOnDishesRepository,
    tagsRepository,
  )

  return useCase
}
