-- AlterTable
-- Non-destructive: every existing row defaults to unreviewed.
ALTER TABLE "Message" ADD COLUMN "reviewed" BOOLEAN NOT NULL DEFAULT false;
