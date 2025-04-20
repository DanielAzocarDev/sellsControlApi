-- CreateEnum
CREATE TYPE "PresentationType" AS ENUM ('UNIT', 'HALF_DOZEN', 'DOZEN', 'TWENTY_FOUR_UNITS', 'THIRTY_SIX_UNITS');

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "salePrice" DOUBLE PRECISION NOT NULL,
    "units" INTEGER NOT NULL,
    "sku" TEXT NOT NULL,
    "presentation" "PresentationType" NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");
