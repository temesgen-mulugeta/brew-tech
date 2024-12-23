CREATE TYPE "public"."roles" AS ENUM('user', 'root');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('other', 'deleted', 'active', 'inactive', 'pending', 'banned', 'limited');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "email_verification_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(8) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"user_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"fresh" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"normalized_username" varchar(255) NOT NULL,
	"email" varchar(255),
	"email_verified" boolean DEFAULT false,
	"phone_number" varchar(255),
	"phone_number_verified" boolean DEFAULT false,
	"address" varchar(255),
	"status" "user_status" DEFAULT 'pending' NOT NULL,
	"role" "roles" DEFAULT 'user' NOT NULL,
	"agreed_to_terms" boolean DEFAULT false,
	"hashed_password" varchar DEFAULT '' NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_verification_codes" ADD CONSTRAINT "email_verification_codes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "normalized_username_idx" ON "users" USING btree ("normalized_username");