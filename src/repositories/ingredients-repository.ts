import { Ingredient, Prisma } from '@prisma/client'

export interface IngredientsRepository {
  create(
    data: Prisma.IngredientUncheckedCreateInput,
  ): Promise<Ingredient | null>
  findByName(name: string): Promise<Ingredient | null>
}
