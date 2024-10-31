/*
  Warnings:

  - You are about to drop the column `tagId` on the `tags_on_dishes` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "tags_on_dishes" DROP CONSTRAINT "tags_on_dishes_tagId_fkey";

-- AlterTable
ALTER TABLE "tags_on_dishes" DROP COLUMN "tagId",
ADD COLUMN     "tag_id" TEXT;

-- AddForeignKey
ALTER TABLE "tags_on_dishes" ADD CONSTRAINT "tags_on_dishes_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE SET NULL ON UPDATE CASCADE;
