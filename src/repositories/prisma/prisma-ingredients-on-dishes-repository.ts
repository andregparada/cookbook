import { Prisma } from '@prisma/client'
import { IngredientsOnRecipesRepository } from '../ingredients-on-recipes-repository'
import { prisma } from '@/lib/prisma'

export class PrismaIngredientsOnRecipesRepository
  implements IngredientsOnRecipesRepository
{
  async create(data: Prisma.IngredientsOnRecipesUncheckedCreateInput) {
    const ingredientsOnRecipes = await prisma.ingredientsOnRecipes.create({
      data,
    })

    return ingredientsOnRecipes
  }

  async findByRecipesId(recipesId: string) {
    const ingedientsOnRecipes = await prisma.ingredientsOnRecipes.findMany({
      where: {
        recipes_id: recipesId,
      },
    })

    return ingedientsOnRecipes
  }
}
