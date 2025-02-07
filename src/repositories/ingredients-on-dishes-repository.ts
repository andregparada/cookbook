import { IngredientsOnDishes, Prisma } from '@prisma/client'

export interface IngredientsOnDishesRepository {
  create(
    data: Prisma.IngredientsOnDishesUncheckedCreateInput,
  ): Promise<IngredientsOnDishes>
  findByDishId(dishId: string): Promise<IngredientsOnDishes[] | null>
}
