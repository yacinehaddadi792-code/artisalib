-- CreateTable
CREATE TABLE "RequestQuote" (
    "id" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "workDescription" TEXT NOT NULL,
    "estimatedDelay" TEXT,
    "validUntil" TEXT,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requestId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "artisanId" TEXT NOT NULL,

    CONSTRAINT "RequestQuote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RequestQuote" ADD CONSTRAINT "RequestQuote_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestQuote" ADD CONSTRAINT "RequestQuote_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestQuote" ADD CONSTRAINT "RequestQuote_artisanId_fkey" FOREIGN KEY ("artisanId") REFERENCES "ArtisanProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
