import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/server/db/prisma";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return new Response("Error: Please add CLERK_WEBHOOK_SECRET to .env", {
      status: 500,
    });
  }

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as unknown as WebhookEvent;

  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred during verification", { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, unsafe_metadata } = evt.data;
    const email = email_addresses[0]?.email_address;
    const fullName = `${first_name || ""} ${last_name || ""}`.trim() || "User";
    const roleMeta = (unsafe_metadata?.role as string)?.toUpperCase();
    const role: Role =
      roleMeta === "BUSINESS"
        ? Role.BUSINESS
        : roleMeta === "NGO"
        ? Role.NGO
        : roleMeta === "ADMIN"
        ? Role.ADMIN
        : Role.BUYER;

    if (email) {
      await prisma.user.upsert({
        where: { clerkUserId: id },
        update: {
          email,
          fullName,
          role,
        },
        create: {
          clerkUserId: id,
          email,
          fullName,
          role,
        },
      });
    }
  } else if (eventType === "user.deleted") {
    const { id } = evt.data;
    if (id) {
      await prisma.user.deleteMany({
        where: { clerkUserId: id },
      });
    }
  }

  return new Response("Webhook processed successfully", { status: 200 });
}
