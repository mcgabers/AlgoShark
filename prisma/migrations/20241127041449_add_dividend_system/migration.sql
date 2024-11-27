-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "dividendSettings" JSONB;

-- CreateTable
CREATE TABLE "DividendDistribution" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" TEXT NOT NULL,
    "assetId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "metadata" JSONB,

    CONSTRAINT "DividendDistribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DividendPayment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "distributionId" TEXT NOT NULL,
    "holderAddress" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "txId" TEXT,
    "metadata" JSONB,

    CONSTRAINT "DividendPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DividendPayment_holderAddress_idx" ON "DividendPayment"("holderAddress");

-- CreateIndex
CREATE INDEX "DividendPayment_distributionId_status_idx" ON "DividendPayment"("distributionId", "status");

-- AddForeignKey
ALTER TABLE "DividendDistribution" ADD CONSTRAINT "DividendDistribution_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DividendPayment" ADD CONSTRAINT "DividendPayment_distributionId_fkey" FOREIGN KEY ("distributionId") REFERENCES "DividendDistribution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
