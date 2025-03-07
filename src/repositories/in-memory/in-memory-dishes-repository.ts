import { Dish, Prisma } from '@prisma/client'
import { DishesRepository } from '../recipes-repository'
import { randomUUID } from 'crypto'

export class InMemoryDishesRepository implements DishesRepository {
  public items: Dish[] = []

  async create(data: Prisma.DishCreateInput) {
    const dish = {
      id: randomUUID(),
      name: data.name,
      description: data.description,
      instructions: data.instructions,
      duration: data.duration ?? null,
      difficulty: data.difficulty ?? null,
      cost: data.cost ?? null,
      prep_time: data.prep_time ?? null,
      cook_time: data.cook_time ?? null,
      user_id: typeof data.user === 'string' ? data.user : null,
    }

    this.items.push(dish)

    return dish
  }
}
