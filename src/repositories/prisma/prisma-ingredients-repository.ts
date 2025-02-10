import { Prisma } from '@prisma/client'
import { IngredientsRepository } from '../ingredients-repository'
import { prisma } from '@/lib/prisma'

export class PrismaIngredientsRepository implements IngredientsRepository {
  async create(data: Prisma.IngredientUncheckedCreateInput) {
    const ingredient = await prisma.ingredient.create({
      data,
    })

    return ingredient
  }

  async findByName(name: string) {
    const ingredient = await prisma.ingredient.findUnique({
      where: {
        name,
      },
    })

    return ingredient
  }
}
