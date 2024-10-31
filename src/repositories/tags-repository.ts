import { Prisma, Tag } from '@prisma/client'

export interface TagsRepository {
  create(data: Prisma.TagUncheckedCreateInput): Promise<Tag>
  findByTitle(title: string): Promise<Tag | null>
}
