import { IngredientsOnDishes, Prisma } from '@prisma/client'

export interface IngredientsOnDishesRepository {
  create(
    data: Prisma.IngredientsOnDishesUncheckedCreateInput,
  ): Promise<IngredientsOnDishes>
}
