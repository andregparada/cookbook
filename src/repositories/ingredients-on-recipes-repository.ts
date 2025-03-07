import { IngredientOnRecipe, Prisma } from '@prisma/client'

export interface IngredientsOnRecipesRepository {
  create(
    data: Prisma.IngredientOnRecipeUncheckedCreateInput,
  ): Promise<IngredientOnRecipe>
  findByDishId(recipeId: string): Promise<IngredientOnRecipe[] | null>
}
