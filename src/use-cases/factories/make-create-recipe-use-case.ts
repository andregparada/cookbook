import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { PrismaIngredientsRepository } from '@/repositories/prisma/prisma-recipes-repository'
import { PrismaIngredientsRepository } from '@/repositories/prisma/prisma-ingredients-repository'
import { PrismaTagsRepository } from '@/repositories/prisma/prisma-tags-repository'
import { PrismaIngredientsOnRecipesRepository } from '@/repositories/prisma/prisma-ingredients-on-recipes-repository'
import { CreateRecipeUseCase } from '../recipes/create'

export function makeCreateRecipeUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const recipesRepository = new PrismaReci()
  const ingredientsRepository = new PrismaIngredientsRepository()
  const tagsRepository = new PrismaTagsRepository()
  const ingredientsOnRecipesRepository =
    new PrismaIngredientsOnRecipesRepository()
  const useCase = new CreateRecipeUseCase(
    usersRepository,
    recipesRepository,
    ingredientsRepository,
    ingredientsOnRecipesRepository,
    tagsRepository,
  )

  return useCase
}
