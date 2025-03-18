import { Prisma, Recipe } from '@prisma/client'
import { randomUUID } from 'crypto'
import { RecipesRepository } from '../recipes-repository'
import { Decimal } from '@prisma/client/runtime/library'

export class InMemoryRecipesRepository implements RecipesRepository {
  public items: Recipe[] = []

  async create(data: Prisma.RecipeUncheckedCreateInput) {
    const recipe = {
      id: randomUUID(),
      userId: data.userId,
      title: data.title,
      description: data.description,
      instructions: data.instructions,
      prepTime: data.prepTime ?? null,
      cookTime: data.cookTime ?? null,
      difficulty: data.difficulty ?? null,
      cost:
        data.cost !== undefined && data.cost !== null
          ? new Decimal(data.cost.toString())
          : null,
      servings: data.servings ?? null,
    }

    this.items.push(recipe)

    return recipe
  }
}
