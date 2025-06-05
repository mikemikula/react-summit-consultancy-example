/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `leads` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "leads_email_key" ON "leads"("email");
