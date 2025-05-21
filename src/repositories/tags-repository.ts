import { Prisma, Tag } from '@prisma/client'

export interface TagsRepository {
  create(data: Prisma.TagUncheckedCreateInput): Promise<Tag | null>
  connect(tagId: string, recipeId: string): void
  findByTitle(title: string): Promise<Tag | null>
  findManyByRecipeId(recipeId: string): Promise<Tag[] | null>
}
