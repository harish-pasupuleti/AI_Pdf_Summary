import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getDbConnection } from "@/lib/db";
import { createOrUpdateUser } from "@/lib/user";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const svix_id = req.headers.get("svix-id") as string | null;
  const svix_timestamp = req.headers.get("svix-timestamp") as string | null;
  const svix_signature = req.headers.get("svix-signature") as string | null;
  
  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Do something with the payload
  // For this guide, you simply log the payload to the console
  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses,  first_name, last_name, username } =
      evt.data;

    const user = {
      clerkId: id,
      email: email_addresses[0].email_address,
      name: username!,
      firstName: first_name,
      lastName: last_name,
    };

    const sql = await getDbConnection();

    await createOrUpdateUser({
      sql,
      id: user.clerkId,
      email: user.email,
      full_name: `${user.firstName} ${user.firstName}`,
    });
    return NextResponse.json({ message: "New user created", user });
  }

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", body);

  return new Response("", { status: 200 });
}