-- Add tags array column to Post
ALTER TABLE "Post" ADD COLUMN "tags" TEXT[] DEFAULT '{}' NOT NULL;
