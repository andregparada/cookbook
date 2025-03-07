import { Prisma } from '@prisma/client'
import { IngredientsOnDishesRepository } from '../ingredients-on-recipes-repository'
import { prisma } from '@/lib/prisma'

export class PrismaIngredientsOnDishesRepository
  implements IngredientsOnDishesRepository
{
  async create(data: Prisma.IngredientsOnDishesUncheckedCreateInput) {
    const ingredientsOnDish = await prisma.ingredientsOnDishes.create({
      data,
    })

    return ingredientsOnDish
  }

  async findByDishId(dishId: string) {
    const ingedientsOnDish = await prisma.ingredientsOnDishes.findMany({
      where: {
        dish_id: dishId,
      },
    })

    return ingedientsOnDish
  }
}
