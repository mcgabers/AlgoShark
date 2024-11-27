-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "tokenMetadata" JSONB;

-- CreateTable
CREATE TABLE "TokenTransaction" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION,
    "fromAddress" TEXT NOT NULL,
    "toAddress" TEXT NOT NULL,
    "assetId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "txId" TEXT NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "TokenTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenAction" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "assetId" INTEGER NOT NULL,
    "targetAddress" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "txId" TEXT NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "TokenAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenMetrics" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "assetId" INTEGER NOT NULL,
    "totalHolders" INTEGER NOT NULL,
    "totalSupply" DOUBLE PRECISION NOT NULL,
    "circulatingSupply" DOUBLE PRECISION NOT NULL,
    "dailyVolume" DOUBLE PRECISION NOT NULL,
    "dailyTransactions" INTEGER NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TokenMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TokenTransaction_txId_key" ON "TokenTransaction"("txId");

-- CreateIndex
CREATE UNIQUE INDEX "TokenAction_txId_key" ON "TokenAction"("txId");

-- CreateIndex
CREATE UNIQUE INDEX "TokenMetrics_assetId_key" ON "TokenMetrics"("assetId");
