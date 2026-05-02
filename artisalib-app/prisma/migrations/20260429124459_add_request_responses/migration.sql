-- CreateTable
CREATE TABLE "RequestResponse" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "amount" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requestId" TEXT NOT NULL,
    "artisanId" TEXT NOT NULL,

    CONSTRAINT "RequestResponse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RequestResponse" ADD CONSTRAINT "RequestResponse_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestResponse" ADD CONSTRAINT "RequestResponse_artisanId_fkey" FOREIGN KEY ("artisanId") REFERENCES "ArtisanProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
