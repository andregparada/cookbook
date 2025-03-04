import { Dish } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UsersRepository } from '@/repositories/users-repository'
import { DishesRepository } from '@/repositories/dishes-repository'
import { IngredientsRepository } from '@/repositories/ingredients-repository'
import { IngredientsOnDishesRepository } from '@/repositories/ingredients-on-dishes-repository'
import { TagsRepository } from '@/repositories/tags-repository'

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD'

interface CreateDishUseCaseRequest {
  user_id: string
  name: string
  description: string
  instructions: string
  duration: number | null
  difficulty: Difficulty | null
  cost: number | null
  prepTime: number | null
  cookTime: number | null
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
    user_id,
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
    const user = await this.usersRepository.findById(user_id)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const dish = await this.dishesRepository.create({
      name,
      description,
      instructions,
      duration,
      difficulty,
      cost,
      prep_time: prepTime,
      cook_time: cookTime,
      user_id,
    })

    await Promise.all(
      ingredients.map(async ({ name, quantity }) => {
        let ingredient = await this.ingredientsRepository.findByName(name)

        if (!ingredient) {
          ingredient = await this.ingredientsRepository.create({ name })
        }

        if (!ingredient || ingredient == null) {
          throw ResourceNotFoundError
        }

        await this.ingredientsOnDishesRepository.create({
          dish_id: dish.id,
          ingredient_id: ingredient.id,
          quantity,
        })
      }),
    )

    await Promise.all(
      tags.map(async (tag) => {
        let tagId = await this.tagsRepository.findByTitle(tag.title)

        if (!tagId) {
          tagId = await this.tagsRepository.create({
            title: tag.title,
          })

          if (!tagId || tag == null) {
            throw ResourceNotFoundError
          }

          await this.tagsRepository.connect(tagId.id, dish.id)
        }
      }),
    )

    return { dish }
  }
}
