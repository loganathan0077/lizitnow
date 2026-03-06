-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;

-- Add googleId column
ALTER TABLE "User" ADD COLUMN "googleId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
