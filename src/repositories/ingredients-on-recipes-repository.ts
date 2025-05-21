import { IngredientOnRecipe, Prisma } from '@prisma/client'

export interface IngredientsOnRecipesRepository {
  create(
    data: Prisma.IngredientOnRecipeUncheckedCreateInput,
  ): Promise<IngredientOnRecipe>
  findManyByRecipeId(recipeId: string): Promise<IngredientOnRecipe[] | null>
}
