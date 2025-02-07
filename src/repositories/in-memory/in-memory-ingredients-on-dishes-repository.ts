import { IngredientsOnDishes, Prisma } from '@prisma/client'
import { IngredientsOnDishesRepository } from '../ingredients-on-dishes-repository'
import { randomUUID } from 'crypto'

export class InMemoryIngredientsOnDishesRepository
  implements IngredientsOnDishesRepository
{
  public items: IngredientsOnDishes[] = []

  async create(data: Prisma.IngredientsOnDishesUncheckedCreateInput) {
    const ingredientOnDish = {
      id: randomUUID(),
      quantity: data.quantity,
      ingredient_id: data.ingredient_id ?? null,
      dish_id: data.dish_id ?? null,
    }

    this.items.push(ingredientOnDish)

    return ingredientOnDish
  }

  async findByDishId(dishId: string) {
    const ingredientsOnDish = this.items.filter(
      (item) => item.dish_id === dishId,
    )
    return ingredientsOnDish
  }
}
