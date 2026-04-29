-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "budget" TEXT,
ADD COLUMN     "city" TEXT NOT NULL DEFAULT 'Non précisée',
ADD COLUMN     "trade" TEXT NOT NULL DEFAULT 'Non précisé',
ADD COLUMN     "urgency" TEXT NOT NULL DEFAULT 'Moyenne';
