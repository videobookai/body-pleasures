-- AlterTable
ALTER TABLE "Order" ADD COLUMN "shippingCarrier" TEXT;
ALTER TABLE "Order" ADD COLUMN "shippingMethod" TEXT;

-- CreateTable
CREATE TABLE "ShippingCarrier" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "apiKey" TEXT,
    "apiSecret" TEXT,
    "accountId" TEXT,
    "minWeight" REAL NOT NULL DEFAULT 0,
    "maxWeight" REAL NOT NULL DEFAULT 70,
    "baseCost" REAL NOT NULL DEFAULT 0,
    "costPerPound" REAL NOT NULL DEFAULT 0.5,
    "realTimeRates" BOOLEAN NOT NULL DEFAULT false,
    "estimatedDaysMin" INTEGER NOT NULL DEFAULT 1,
    "estimatedDaysMax" INTEGER NOT NULL DEFAULT 5,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ShippingMethod" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "carrierId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "estimatedDaysMin" INTEGER NOT NULL,
    "estimatedDaysMax" INTEGER NOT NULL,
    CONSTRAINT "ShippingMethod_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "ShippingCarrier" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ShippingZone" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "states" TEXT NOT NULL,
    "countries" TEXT NOT NULL DEFAULT '[]',
    "zipRanges" TEXT NOT NULL DEFAULT '[]',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ShippingRate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "carrierId" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "minWeight" REAL NOT NULL,
    "maxWeight" REAL NOT NULL,
    "cost" REAL NOT NULL,
    CONSTRAINT "ShippingRate_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "ShippingCarrier" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ShippingRate_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "ShippingZone" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ShippingCarrier_name_key" ON "ShippingCarrier"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ShippingMethod_carrierId_code_key" ON "ShippingMethod"("carrierId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "ShippingRate_carrierId_zoneId_minWeight_maxWeight_key" ON "ShippingRate"("carrierId", "zoneId", "minWeight", "maxWeight");
