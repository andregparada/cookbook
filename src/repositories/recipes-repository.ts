import { Prisma, Recipe } from '@prisma/client'

export interface RecipesRepository {
  create(data: Prisma.RecipeUncheckedCreateInput): Promise<Recipe>
  findById(recipeId: string): Prisma.RecipeGetPayload<{
    include: { ingredients: true; tags: true }
  }>
}
