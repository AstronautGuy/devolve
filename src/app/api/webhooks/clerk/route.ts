import { Webhook } from "svix";
import { headers } from "next/headers";
import { auth, type WebhookEvent } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { organizations, settings, tasks } from "~/server/db/schema"; // <--- Added companyProfiles
import { eq } from "drizzle-orm";
import { env } from "~/env";

export async function POST(req: Request) {
  // Use the validated env object
  const WEBHOOK_SECRET = env.CLERK_WEBHOOK_SECRET;

  // 1. Verify Headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing svix headers", { status: 400 });
  }

  // 2. Verify Payload
  const payload = (await req.json()) as Record<string, unknown>;
  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error: Verification failed", { status: 400 });
  }

  // 3. HANDLE EVENTS
  const eventType = evt.type;

  // A. Organization Created
  if (eventType === "organization.created") {
    const { id, name } = evt.data as { id: string; name: string };

    // 1. Sync Organization
    await db.insert(organizations).values({
      id: id,
      name: name,
    });

    await db.insert(settings).values({
      orgId: id,
      nextQuotationNumber: '001',
    })

    // 2. Create Onboarding Task
    await db.insert(tasks).values({
      orgId: id,
      title: "Action Required: Complete Setup",
      description:
        "Please update your company settings to unlock all features.",
      link: "/onboarding",
      isCompleted: false,
    });

    console.log(`Synced New Org & Created Task: ${name} (${id})`);
  }

  // B. Organization Updated (e.g. Renamed in Clerk)
  if (eventType === "organization.updated") {
    const { id, name } = evt.data as { id: string; name: string };

    await db
      .update(organizations)
      .set({ name: name })
      .where(eq(organizations.id, id));

    console.log(`Updated Org Name: ${name}`);
  }

  // C. Organization Deleted
  if (eventType === "organization.deleted") {
    const { id } = evt.data as { id: string };

    if (id) {
      await db.delete(organizations).where(eq(organizations.id, id));

      console.log(`Deleted Org and all associated data: ${id}`);
    }
  }

  return new Response("Webhook Processed", { status: 200 });
}
