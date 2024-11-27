-- CreateTable
CREATE TABLE "ContractVersion" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "sourceCode" TEXT NOT NULL,
    "bytecode" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'inactive',
    "changes" TEXT[],
    "metadata" JSONB,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContractVersion_contractId_status_idx" ON "ContractVersion"("contractId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ContractVersion_contractId_version_key" ON "ContractVersion"("contractId", "version");
