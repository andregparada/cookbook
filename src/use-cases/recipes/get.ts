import { RecipesRepository } from '@/repositories/recipes-repository'
import { Prisma } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface GetRecipeUseCaseRequest {
  recipeId: string
}

interface GetRecipeUseCaseResponse {
  recipe: Prisma.RecipeGetPayload<{
    include: { ingredients: true; tags: true }
  }>
}

export class GetRecipeUseCase {
  constructor(private recipesRepository: RecipesRepository) {}

  async execute({
    recipeId,
  }: GetRecipeUseCaseRequest): Promise<GetRecipeUseCaseResponse> {
    const recipe = await this.recipesRepository.findById(recipeId)

    if (!recipe) {
      throw new ResourceNotFoundError()
    }

    return {
      recipe,
    }
  }
}
