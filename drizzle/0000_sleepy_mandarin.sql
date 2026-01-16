CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" varchar(255) NOT NULL,
	"name" text NOT NULL,
	"industry" varchar(100),
	"country" varchar(100) NOT NULL,
	"state" varchar(100),
	"city" varchar(100) NOT NULL,
	"pincode" varchar(100),
	"gst" varchar(100),
	"pan" varchar(100),
	"type" varchar(100) DEFAULT 'individual',
	"status" varchar(100) DEFAULT 'active',
	"address" text,
	"shipping_address" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "company_profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" varchar(255) NOT NULL,
	"address" text,
	"tax_id" varchar(50),
	"industry" varchar(100),
	"staff" varchar(100),
	"is_onboarded" boolean DEFAULT false NOT NULL,
	"has_cloud" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "organization" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" varchar(255) NOT NULL,
	"name" varchar(256) NOT NULL,
	"sku" varchar(100),
	"category" varchar(100),
	"quantity" integer DEFAULT 0 NOT NULL,
	"price" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "quotations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" varchar(255) NOT NULL,
	"quotation_number" text NOT NULL,
	"quotation_title" varchar(256) DEFAULT 'Quotation' NOT NULL,
	"quotation_sub_title" varchar(256) DEFAULT 'QuotationSubTitle' NOT NULL,
	"quote_date" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"due_date" timestamp DEFAULT CURRENT_TIMESTAMP + INTERVAL '14 days',
	"quotation_from" varchar(256) NOT NULL,
	"quotation_to" varchar(256) NOT NULL,
	"quotation_status" varchar(256) DEFAULT 'Draft',
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" varchar(255) NOT NULL,
	"next_quotation_number" text DEFAULT '001' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "staff" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" varchar(255) NOT NULL,
	"name" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"role" varchar(50) DEFAULT 'Employee' NOT NULL,
	"phone" varchar(20),
	"status" varchar(20) DEFAULT 'Active',
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" varchar(255) NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text,
	"link" varchar(256),
	"is_completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_profile" ADD CONSTRAINT "company_profile_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settings" ADD CONSTRAINT "settings_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "clients_org_idx" ON "clients" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "profile_org_idx" ON "company_profile" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "product_org_idx" ON "products" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "quotations_org_idx" ON "quotations" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "settings_org_idx" ON "settings" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "staff_org_idx" ON "staff" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "staff_email_idx" ON "staff" USING btree ("email");--> statement-breakpoint
CREATE INDEX "task_org_idx" ON "tasks" USING btree ("org_id");