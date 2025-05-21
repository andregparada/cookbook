import { IngredientOnRecipe, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'
import { IngredientsOnRecipesRepository } from '../ingredients-on-recipes-repository'

export class InMemoryIngredientsOnRecipesRepository
  implements IngredientsOnRecipesRepository
{
  public items: IngredientOnRecipe[] = []

  async create(data: Prisma.IngredientOnRecipeUncheckedCreateInput) {
    const ingredientOnRecipe = {
      id: randomUUID(),
      quantity: data.quantity,
      unit: data.unit,
      ingredientId: data.ingredientId ?? null,
      recipeId: data.recipeId ?? null,
    }

    this.items.push(ingredientOnRecipe)

    return ingredientOnRecipe
  }

  async findManyByRecipeId(recipeId: string) {
    const ingredientsOnRecipe = this.items.filter(
      (item) => item.recipeId === recipeId,
    )
    return ingredientsOnRecipe
  }
}
