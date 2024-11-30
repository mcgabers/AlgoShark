/*
  Warnings:

  - You are about to drop the column `category` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `currentFunding` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `dividendSettings` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `fundingGoal` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `longDescription` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `tokenMetadata` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `tokenPrice` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `tokensAvailable` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `ContractVersion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DividendDistribution` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DividendPayment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DueDiligence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DueDiligenceComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DueDiligenceReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Investment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Proposal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TokenAction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TokenMetrics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TokenTransaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vote` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `decimals` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initialLiquidity` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initialSupply` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startingPrice` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tokenSymbol` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vestingSchedule` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DividendDistribution" DROP CONSTRAINT "DividendDistribution_projectId_fkey";

-- DropForeignKey
ALTER TABLE "DividendPayment" DROP CONSTRAINT "DividendPayment_distributionId_fkey";

-- DropForeignKey
ALTER TABLE "DueDiligence" DROP CONSTRAINT "DueDiligence_projectId_fkey";

-- DropForeignKey
ALTER TABLE "DueDiligence" DROP CONSTRAINT "DueDiligence_reviewerId_fkey";

-- DropForeignKey
ALTER TABLE "DueDiligenceComment" DROP CONSTRAINT "DueDiligenceComment_authorId_fkey";

-- DropForeignKey
ALTER TABLE "DueDiligenceComment" DROP CONSTRAINT "DueDiligenceComment_dueDiligenceId_fkey";

-- DropForeignKey
ALTER TABLE "DueDiligenceReview" DROP CONSTRAINT "DueDiligenceReview_dueDiligenceId_fkey";

-- DropForeignKey
ALTER TABLE "DueDiligenceReview" DROP CONSTRAINT "DueDiligenceReview_reviewerId_fkey";

-- DropForeignKey
ALTER TABLE "Investment" DROP CONSTRAINT "Investment_investorId_fkey";

-- DropForeignKey
ALTER TABLE "Investment" DROP CONSTRAINT "Investment_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Proposal" DROP CONSTRAINT "Proposal_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Proposal" DROP CONSTRAINT "Proposal_projectId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_delegateId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_proposalId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_voterId_fkey";

-- DropIndex
DROP INDEX "Project_assetId_key";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "category",
DROP COLUMN "currentFunding",
DROP COLUMN "dividendSettings",
DROP COLUMN "fundingGoal",
DROP COLUMN "longDescription",
DROP COLUMN "metadata",
DROP COLUMN "tags",
DROP COLUMN "title",
DROP COLUMN "tokenMetadata",
DROP COLUMN "tokenPrice",
DROP COLUMN "tokensAvailable",
DROP COLUMN "updatedAt",
ADD COLUMN     "decimals" INTEGER NOT NULL,
ADD COLUMN     "initialLiquidity" INTEGER NOT NULL,
ADD COLUMN     "initialSupply" INTEGER NOT NULL,
ADD COLUMN     "launchedAt" TIMESTAMP(3),
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "poolId" INTEGER,
ADD COLUMN     "startingPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "tokenSymbol" TEXT NOT NULL,
ADD COLUMN     "vestingContractId" INTEGER,
ADD COLUMN     "vestingSchedule" JSONB NOT NULL,
ALTER COLUMN "assetId" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'draft';

-- DropTable
DROP TABLE "ContractVersion";

-- DropTable
DROP TABLE "DividendDistribution";

-- DropTable
DROP TABLE "DividendPayment";

-- DropTable
DROP TABLE "DueDiligence";

-- DropTable
DROP TABLE "DueDiligenceComment";

-- DropTable
DROP TABLE "DueDiligenceReview";

-- DropTable
DROP TABLE "Investment";

-- DropTable
DROP TABLE "Proposal";

-- DropTable
DROP TABLE "TokenAction";

-- DropTable
DROP TABLE "TokenMetrics";

-- DropTable
DROP TABLE "TokenTransaction";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "Vote";

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "linkedIn" TEXT NOT NULL,
    "kycVerificationId" TEXT,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
