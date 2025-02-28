-- CreateTable
CREATE TABLE "Dependant" (
    "id" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "relationship" TEXT NOT NULL,

    CONSTRAINT "Dependant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDependant" (
    "userId" TEXT NOT NULL,
    "dependantId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserDependant_pkey" PRIMARY KEY ("userId","dependantId")
);

-- AddForeignKey
ALTER TABLE "UserDependant" ADD CONSTRAINT "UserDependant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDependant" ADD CONSTRAINT "UserDependant_dependantId_fkey" FOREIGN KEY ("dependantId") REFERENCES "Dependant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
