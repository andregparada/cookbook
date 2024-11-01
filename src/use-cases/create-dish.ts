import { Dish } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UsersRepository } from '@/repositories/users-repository'
import { DishesRepository } from '@/repositories/dishes-repository'
import { IngredientsRepository } from '@/repositories/ingredients-repository'
import { IngredientsOnDishesRepository } from '@/repositories/ingredients-on-dishes-repository'
import { TagsRepository } from '@/repositories/tags-repository'

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD'

interface CreateDishUseCaseRequest {
  userId: string
  name: string
  description: string
  instructions: string
  duration?: number
  difficulty?: Difficulty
  cost?: number
  prepTime?: number
  cookTime?: number
  ingredients: { name: string; quantity: number }[]
  tags: { title: string }[]
}

interface CreateDishUseCaseResponse {
  dish: Dish
}

export class CreateDishUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private dishesRepository: DishesRepository,
    private ingredientsRepository: IngredientsRepository,
    private ingredientsOnDishesRepository: IngredientsOnDishesRepository,
    private tagsRepository: TagsRepository,
  ) {}

  async execute({
    userId,
    name,
    description,
    instructions,
    duration,
    difficulty,
    cost,
    prepTime,
    cookTime,
    ingredients,
    tags,
  }: CreateDishUseCaseRequest): Promise<CreateDishUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const tagConnections = await Promise.all(
      tags.map(async (tag) => {
        let tagRecord = await this.tagsRepository.findByTitle(tag.title)

        if (!tagRecord) {
          tagRecord = await this.tagsRepository.create({ title: tag.title })
        }

        return { id: tagRecord.id }
      }),
    )

    const dish = await this.dishesRepository.create({
      name,
      description,
      instructions,
      duration,
      difficulty,
      cost,
      prep_time: prepTime,
      cook_time: cookTime,
      user_id: userId,
      tags: {
        connect: tagConnections,
      },
    })

    await Promise.all(
      ingredients.map(async ({ name, quantity }) => {
        let ingredient = await this.ingredientsRepository.findByName(name)

        if (!ingredient) {
          ingredient = await this.ingredientsRepository.create({ name })
        }

        await this.ingredientsOnDishesRepository.create({
          dish_id: dish.id,
          ingredient_id: ingredient.id,
          quantity,
        })
      }),
    )

    return { dish }
  }
}
