-- AlterTable
ALTER TABLE "Service" DROP COLUMN "passwordEncrypted",
ADD COLUMN     "password" TEXT;