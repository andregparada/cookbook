import { InMemoryRecipesRepository } from '@/repositories/in-memory/in-memory-recipes-repository'
import { GetRecipeUseCase } from '@/use-cases/recipes/get'
import { beforeEach, describe } from 'vitest'

let recipesRepository: InMemoryRecipesRepository
let sut: GetRecipeUseCase

describe('Get Recipe Use Case', () => {
  beforeEach(() => {
    recipesRepository = new InMemoryRecipesRepository()
    sut = new GetRecipeUseCase(recipesRepository)
  })
})
