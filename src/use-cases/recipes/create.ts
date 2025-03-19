import { UsersRepository } from '@/repositories/users-repository'
import { RecipesRepository } from '@/repositories/recipes-repository'
import { IngredientsRepository } from '@/repositories/ingredients-repository'
import { IngredientsOnRecipesRepository } from '@/repositories/ingredients-on-recipes-repository'
import { TagsRepository } from '@/repositories/tags-repository'
import { Recipe } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD'

export interface CreateRecipeUseCaseRequest {
  userId: string
  title: string
  description: string
  instructions: string
  prepTime?: number
  cookTime?: number
  difficulty?: Difficulty
  cost?: number
  servings?: number
  ingredients: { name: string; unit: string; quantity: number; cost?: number }[]
  tags: { title: string }[]
}

interface CreateRecipeUseCaseResponse {
  recipe: Recipe
}

export class CreateRecipeUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private recipesRepository: RecipesRepository,
    private ingredientsRepository: IngredientsRepository,
    private ingredientsOnRecipesRepository: IngredientsOnRecipesRepository,
    private tagsRepository: TagsRepository,
  ) {}

  async execute({
    userId,
    title,
    description,
    instructions,
    prepTime,
    cookTime,
    difficulty,
    cost,
    servings,
    ingredients,
    tags,
  }: CreateRecipeUseCaseRequest): Promise<CreateRecipeUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const recipe = await this.recipesRepository.create({
      userId,
      title,
      description,
      instructions,
      prepTime: prepTime ?? null,
      cookTime: cookTime ?? null,
      difficulty: difficulty ?? null,
      cost: cost ?? null,
      servings: servings ?? null,
    })

    await Promise.all(
      ingredients.map(async ({ name, quantity, unit, cost }) => {
        let ingredient = await this.ingredientsRepository.findByName(name)

        if (!ingredient) {
          ingredient = await this.ingredientsRepository.create({ name, cost })
        }

        if (!ingredient || ingredient == null) {
          throw ResourceNotFoundError
        }

        await this.ingredientsOnRecipesRepository.create({
          recipeId: recipe.id,
          ingredientId: ingredient.id,
          quantity,
          unit,
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

          await this.tagsRepository.connect(tagId.id, recipe.id)
        }
      }),
    )

    return { recipe }
  }
}
