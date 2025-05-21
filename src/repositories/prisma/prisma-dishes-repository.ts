import { Prisma } from '@prisma/client'
import { RecipesRepository } from '../recipes-repository'
import { prisma } from '@/lib/prisma'

export class PrismaRecipesRepository implements RecipesRepository {
  async create(data: Prisma.RecipeUncheckedCreateInput) {
    const recipe = await prisma.recipe.create({
      data,
    })

    return recipe
  }
}
