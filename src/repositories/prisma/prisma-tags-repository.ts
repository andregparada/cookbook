import { Prisma } from '@prisma/client'
import { TagsRepository } from '../tags-repository'
import { prisma } from '@/lib/prisma'

export class PrismaTagsRepository implements TagsRepository {
  async create(data: Prisma.TagCreateInput) {
    const tag = await prisma.tag.create({
      data,
    })

    return tag
  }

  async connect(tagId: string, recipeId: string) {
    await prisma.recipe.update({
      where: { id: recipeId },
      data: {
        tags: {
          connect: { id: tagId },
        },
      },
    })
  }

  async findByTitle(title: string) {
    const tag = await prisma.tag.findUnique({
      where: {
        title,
      },
    })

    return tag
  }
}
