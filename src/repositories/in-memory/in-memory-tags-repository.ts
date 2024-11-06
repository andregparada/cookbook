import { Prisma, Tag } from '@prisma/client'
import { TagsRepository } from '../tags-repository'
import { randomUUID } from 'crypto'

export class InMemoryTagsRepository implements TagsRepository {
  public items: Tag[] = []
  public tagConnections: { tagId: string; dishId: string }[] = []

  async create(data: Prisma.TagUncheckedCreateInput) {
    const tag = {
      id: randomUUID(),
      title: data.title,
    }

    this.items.push(tag)

    return tag
  }

  async connect(tagId: string, dishId: string) {
    this.tagConnections.push({ tagId, dishId })
  }

  async findByTitle(title: string) {
    const tag = this.items.find((item) => item.title === title)

    if (!tag) {
      return null
    }

    return tag
  }
}
