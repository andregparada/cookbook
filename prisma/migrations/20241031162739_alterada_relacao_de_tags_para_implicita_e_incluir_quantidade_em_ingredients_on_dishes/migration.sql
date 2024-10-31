/*
  Warnings:

  - You are about to drop the `tags_on_dishes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `quantity` to the `ingredients_on_dish` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tags_on_dishes" DROP CONSTRAINT "tags_on_dishes_dish_id_fkey";

-- DropForeignKey
ALTER TABLE "tags_on_dishes" DROP CONSTRAINT "tags_on_dishes_tag_id_fkey";

-- AlterTable
ALTER TABLE "ingredients_on_dish" ADD COLUMN     "quantity" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "tags_on_dishes";

-- CreateTable
CREATE TABLE "_DishToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DishToTag_AB_unique" ON "_DishToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_DishToTag_B_index" ON "_DishToTag"("B");

-- AddForeignKey
ALTER TABLE "_DishToTag" ADD CONSTRAINT "_DishToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "dishes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DishToTag" ADD CONSTRAINT "_DishToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
