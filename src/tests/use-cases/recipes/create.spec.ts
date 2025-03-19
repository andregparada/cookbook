import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryIngredientsRepository } from '@/repositories/in-memory/in-memory-ingredients-repository'
import { InMemoryTagsRepository } from '@/repositories/in-memory/in-memory-tags-repository'
import { InMemoryRecipesRepository } from '@/repositories/in-memory/in-memory-recipes-repository'
import { CreateRecipeUseCase } from '@/use-cases/recipes/create'
import { InMemoryIngredientsOnRecipesRepository } from '@/repositories/in-memory/in-memory-ingredients-on-recipes-repository'
import { CreateRecipeData } from '@/utils/test/factories/recipe-data copy'
import { Decimal } from '@prisma/client/runtime/library'

let usersRepository: InMemoryUsersRepository
let recipesRepository: InMemoryRecipesRepository
let ingredientsRepository: InMemoryIngredientsRepository
let ingredientsOnRecipesRepository: InMemoryIngredientsOnRecipesRepository
let tagsRepository: InMemoryTagsRepository
let sut: CreateRecipeUseCase

describe('Create Recipe Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    recipesRepository = new InMemoryRecipesRepository()
    ingredientsRepository = new InMemoryIngredientsRepository()
    ingredientsOnRecipesRepository =
      new InMemoryIngredientsOnRecipesRepository()
    tagsRepository = new InMemoryTagsRepository()
    sut = new CreateRecipeUseCase(
      usersRepository,
      recipesRepository,
      ingredientsRepository,
      ingredientsOnRecipesRepository,
      tagsRepository,
    )
  })

  it('should be able to create recipe', async () => {
    const createRecipeData = new CreateRecipeData(usersRepository)
    const recipeData = await createRecipeData.execute()

    const { recipe } = await sut.execute(recipeData)

    expect(recipe).toMatchObject({
      id: expect.any(String),
      title: expect.any(String),
      description: expect.any(String),
      instructions: expect.any(String),
      cookTime: expect.any(Number),
      prepTime: expect.any(Number),
      difficulty: expect.stringMatching(/EASY|MEDIUM|HARD/), // Se for um enum
      servings: expect.any(Number),
      userId: expect.any(String),
    })
    expect(recipe.cost).toBeInstanceOf(Decimal)
  })

  it('should be able to create ingredient upon recipe creation', async () => {
    const createRecipeData = new CreateRecipeData(usersRepository)
    const recipeData = await createRecipeData.execute()

    await sut.execute(recipeData)

    const ingredient = await ingredientsRepository.findByName(
      recipeData.ingredients[0].name,
    )

    expect(ingredient?.name).toEqual(recipeData.ingredients[0].name)
    expect(ingredient).toMatchObject({
      id: expect.any(String),
      name: recipeData.ingredients[0].name,
    })
    expect(ingredient?.cost).toBeInstanceOf(Decimal)
  })

  it('should not be able to create ingredient, if it already exists', async () => {
    const createRecipeData = new CreateRecipeData(usersRepository)
    const recipeData = await createRecipeData.execute()

    await sut.execute(recipeData)

    expect(
      await ingredientsRepository.create({
        id: 'ingredient-id',
        name: recipeData.ingredients[0].name,
      }),
    ).toBe(null)
  })

  it('should be able to create tag, upon recipe creation', async () => {
    const createRecipeData = new CreateRecipeData(usersRepository)
    const recipeData = await createRecipeData.execute()

    await sut.execute(recipeData)

    const tag = await tagsRepository.findByTitle(recipeData.tags[0].title)

    expect(tag?.title).toEqual(recipeData.tags[0].title)
    expect(tag).toMatchObject({
      id: expect.any(String),
      title: recipeData.tags[0].title,
    })
  })

  it('should not be able to create tag, if it already exists', async () => {
    const createRecipeData = new CreateRecipeData(usersRepository)
    const recipeData = await createRecipeData.execute()

    await sut.execute(recipeData)

    expect(
      await tagsRepository.create({
        id: 'tag-id',
        title: recipeData.tags[0].title,
      }),
    ).toBe(null)
  })

  it('should be able to create table of ingredients on recipes, connecting ingredients with recipe ', async () => {
    const createRecipeData = new CreateRecipeData(usersRepository)
    const recipeData = await createRecipeData.execute()

    const { recipe } = await sut.execute(recipeData)
    const ingredientsOnRecipe =
      await ingredientsOnRecipesRepository.findByRecipeId(recipe.id)

    expect(ingredientsOnRecipe).not.toBeNull()
    expect(ingredientsOnRecipe![0].id).toEqual(expect.any(String))
  })
})
