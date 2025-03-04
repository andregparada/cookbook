/*
  Warnings:

  - You are about to alter the column `name` on the `ingredients` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `cost` on the `ingredients` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `password_hash` on the `users` table. All the data in the column will be lost.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to drop the `_DishToTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dishes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ingredients_on_dish` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userName]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "RecipeDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- DropForeignKey
ALTER TABLE "_DishToTag" DROP CONSTRAINT "_DishToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_DishToTag" DROP CONSTRAINT "_DishToTag_B_fkey";

-- DropForeignKey
ALTER TABLE "dishes" DROP CONSTRAINT "dishes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "ingredients_on_dish" DROP CONSTRAINT "ingredients_on_dish_dish_id_fkey";

-- DropForeignKey
ALTER TABLE "ingredients_on_dish" DROP CONSTRAINT "ingredients_on_dish_ingredient_id_fkey";

-- AlterTable
ALTER TABLE "ingredients" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "cost" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "tags" ADD COLUMN     "recipeId" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "created_at",
DROP COLUMN "name",
DROP COLUMN "password_hash",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "firstName" VARCHAR(50),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastName" VARCHAR(50),
ADD COLUMN     "passwordHash" VARCHAR(255),
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "userName" VARCHAR(50),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(100);

-- DropTable
DROP TABLE "_DishToTag";

-- DropTable
DROP TABLE "dishes";

-- DropTable
DROP TABLE "ingredients_on_dish";

-- DropEnum
DROP TYPE "Difficulty";

-- CreateTable
CREATE TABLE "recipes" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "instructions" TEXT NOT NULL,
    "prepTime" INTEGER,
    "cookTime" INTEGER,
    "difficulty" "RecipeDifficulty",
    "cost" DECIMAL(65,30),
    "servings" INTEGER,
    "userId" TEXT NOT NULL,

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredientsOnRecipes" (
    "id" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,

    CONSTRAINT "ingredientsOnRecipes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "recipes_title_idx" ON "recipes"("title");

-- CreateIndex
CREATE INDEX "recipes_userId_idx" ON "recipes"("userId");

-- CreateIndex
CREATE INDEX "ingredients_name_idx" ON "ingredients"("name");

-- CreateIndex
CREATE INDEX "tags_title_idx" ON "tags"("title");

-- CreateIndex
CREATE UNIQUE INDEX "users_userName_key" ON "users"("userName");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_userName_idx" ON "users"("userName");

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredientsOnRecipes" ADD CONSTRAINT "ingredientsOnRecipes_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredientsOnRecipes" ADD CONSTRAINT "ingredientsOnRecipes_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
