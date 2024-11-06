import { Ingredient, Prisma } from '@prisma/client'
import { IngredientsRepository } from '../ingredients-repository'
import { randomUUID } from 'crypto'

export class InMemoryIngredientsRepository implements IngredientsRepository {
  public items: Ingredient[] = []

  async create(data: Prisma.IngredientCreateInput) {
    const ingredient = {
      id: randomUUID(),
      name: data.name,
      cost: data.cost ?? null,
    }

    this.items.push(ingredient)

    return ingredient
  }

  async findByName(name: string) {
    const ingredient = this.items.find((item) => item.name === name)

    if (!ingredient) {
      return null
    }

    return ingredient
  }
}
