/*
  Warnings:

  - The `tags` column on the `vacancies` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "vacancies" DROP COLUMN "tags",
ADD COLUMN     "tags" TEXT[];
