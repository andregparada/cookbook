import { Prisma, Tag } from '@prisma/client'

export interface TagsRepository {
  create(data: Prisma.TagUncheckedCreateInput): Promise<Tag>
  connect(tagId: string, dishId: string): void
  findByTitle(title: string): Promise<Tag | null>
}
