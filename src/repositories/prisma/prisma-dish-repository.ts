import { Prisma } from '@prisma/client'
import { DishesRepository } from '../dishes-repository'
import { prisma } from '@/lib/prisma'

export class PrismaDishesRepository implements DishesRepository {
  async create(data: Prisma.DishUncheckedCreateInput) {
    const user = await prisma.dish.create({
      data,
    })

    return user
  }
}
