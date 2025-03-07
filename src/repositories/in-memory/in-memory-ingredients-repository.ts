import { Ingredient, Prisma } from '@prisma/client'
import { IngredientsRepository } from '../ingredients-repository'
import { randomUUID } from 'crypto'
import { Decimal } from '@prisma/client/runtime/library'

export class InMemoryIngredientsRepository implements IngredientsRepository {
  public items: Ingredient[] = []

  async create(data: Prisma.IngredientCreateInput) {
    if (await this.findByName(data.name)) return null

    const ingredient = {
      id: randomUUID(),
      name: data.name,
      cost: data.cost instanceof Decimal ? new Decimal(data.cost) : null,
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
