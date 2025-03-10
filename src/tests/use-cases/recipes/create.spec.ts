import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryIngredientsRepository } from '@/repositories/in-memory/in-memory-ingredients-repository'
import { IngredientsRepository } from '@/repositories/ingredients-repository'
import { TagsRepository } from '@/repositories/tags-repository'
import { InMemoryTagsRepository } from '@/repositories/in-memory/in-memory-tags-repository'
import { InMemoryRecipesRepository } from '@/repositories/in-memory/in-memory-recipes-repository'
import { CreateRecipeUseCase } from '@/use-cases/recipes/create'
import { InMemoryIngredientsOnRecipesRepository } from '@/repositories/in-memory/in-memory-ingredients-on-recipes-repository'
import { createUserData } from '@/utils/test/factories/user-data'
import { CreateRecipeData } from '@/utils/test/factories/recipe-data'

let usersRepository: InMemoryUsersRepository
let recipesRepository: InMemoryRecipesRepository
let ingredientsRepository: IngredientsRepository
let ingredientsOnRecipesRepository: InMemoryIngredientsOnRecipesRepository
let tagsRepository: TagsRepository
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

  it.only('should be able to create dish', async () => {
    // const createRandomData = new CreateRandomData()
    // const userData = randomUserData()
    const randomDish = new RandomDish()

    const user = await usersRepository.create(randomDish.user!)
    console.log(user)

    const { dish } = await sut.execute({
      ...randomDish.dish,
      user_id: user.id,
      ingredients: [{ name: 'name', quantity: 1 }],
      tags: [{ title: 'title' }],
    })

    expect(dish.id).toEqual(expect.any(String))
  })

  it.only('should be able to create recipe', async () => {
    // const createRandomData = new CreateRandomData()
    const userData = createUserData()
    const createRecipeData = new CreateRecipeData()

    const user = await usersRepository.create(userData)

    const recipeData = createRecipeData.createRecipeData(user)

    const { recipe } = await sut.execute({
      ...recipeData,
      userId: user.id,
      ingredients: [{ name: 'name', quantity: 1, unit: 'grams' }],
      tags: [{ title: 'title' }],
    })

    expect(recipe.id).toEqual(expect.any(String))
  })

  it('should be able to create ingredient upon dish creation', async () => {
    const userData = randomUserData()

    const user = await usersRepository.create(userData)

    await sut.execute({
      name: 'Dish name',
      instructions: 'Dish instructions',
      description: 'Dish description',
      userId: user.id,
      ingredients: [
        { name: 'Dish ingredient 1', quantity: 1 },
        { name: 'Dish ingredient 2', quantity: 1 },
      ],
      tags: [{ title: 'Tag title' }],
    })

    const ingredient =
      await ingredientsRepository.findByName('Dish ingredient 1')

    expect(ingredient?.name).toEqual('Dish ingredient 1')
  })

  it('should not be able to create ingredient, if it already exists', async () => {
    const userData = randomUserData()

    const user = await usersRepository.create(userData)

    await sut.execute({
      name: 'Dish name',
      instructions: 'Dish instructions',
      description: 'Dish description',
      userId: user.id,
      ingredients: [
        { name: 'Dish ingredient 1', quantity: 1 },
        { name: 'Dish ingredient 2', quantity: 1 },
      ],
      tags: [{ title: 'Tag title' }],
    })

    expect(
      await ingredientsRepository.create({
        id: 'ingredient-id',
        name: 'Dish ingredient 1',
      }),
    ).toBe(null)
  })

  it('should be able to create tag, upon dish creation', async () => {
    const userData = randomUserData()

    const user = await usersRepository.create(userData)

    await sut.execute({
      name: 'Dish name',
      instructions: 'Dish instructions',
      description: 'Dish description',
      userId: user.id,
      ingredients: [
        { name: 'Dish ingredient 1', quantity: 1 },
        { name: 'Dish ingredient 2', quantity: 1 },
      ],
      tags: [{ title: 'Tag title' }],
    })

    const tag = await tagsRepository.findByTitle('Tag title')

    expect(tag?.title).toEqual('Tag title')
  })

  it('should not be able to create tag, if it already exists', async () => {
    const userData = randomUserData()

    const user = await usersRepository.create(userData)

    await sut.execute({
      name: 'Dish name',
      instructions: 'Dish instructions',
      description: 'Dish description',
      userId: user.id,
      ingredients: [
        { name: 'Dish ingredient 1', quantity: 1 },
        { name: 'Dish ingredient 2', quantity: 1 },
      ],
      tags: [{ title: 'Tag title' }],
    })

    expect(
      await tagsRepository.create({
        id: 'tag-id',
        title: 'Tag title',
      }),
    ).toBe(null)
  })

  it('should be able to create table of ingredients on dishes, connecting ingredients with dish ', async () => {
    const userData = randomUserData()

    const user = await usersRepository.create(userData)

    const { dish } = await sut.execute({
      name: 'Dish name',
      instructions: 'Dish instructions',
      description: 'Dish description',
      userId: user.id,
      ingredients: [
        { name: 'Dish ingredient 1', quantity: 1 },
        { name: 'Dish ingredient 2', quantity: 1 },
      ],
      tags: [{ title: 'Tag title' }],
    })

    const ingredientsOnDish = await ingredientsOnDishesRepository.findByDishId(
      dish.id,
    )

    expect(ingredientsOnDish).not.toBeNull()
    expect(ingredientsOnDish![0].id).toEqual(expect.any(String))
  })
})
