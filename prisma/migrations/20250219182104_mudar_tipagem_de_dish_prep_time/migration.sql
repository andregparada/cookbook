/*
  Warnings:

  - Made the column `prep_time` on table `dishes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "dishes" ALTER COLUMN "prep_time" SET NOT NULL;
