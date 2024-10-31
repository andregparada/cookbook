import { Dish, Prisma } from '@prisma/client'

export interface DishesRepository {
  create(data: Prisma.DishUncheckedCreateInput): Promise<Dish>
}
