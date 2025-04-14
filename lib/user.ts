import { getUserUploadCount } from "./summaries";
import { User } from "@clerk/nextjs/server";

export async function hasReachedUploadLimit(userId: string) {
  const uploadCount = await getUserUploadCount(userId);

  // Since the app is free, apply a simple static limit for all users (optional)
  const uploadLimit = 5;

  return { hasReachedLimit: uploadCount >= uploadLimit, uploadLimit };
}

export async function getSubscriptionStatus(user: User) {
  // Always return true or "free" since it's a free plan for everyone
  return true;
}

// lib/user.ts
export async function createOrUpdateUser({
  sql,
  id,
  email,
  full_name,
}: {
  sql: any;
  id: string;
  email: string;
  full_name: string;
}) {
  try {
    const result = await sql`SELECT * FROM users WHERE id = ${id}`;
    if (result.length === 0) {
      await sql`
        INSERT INTO users (id, email, full_name)
        VALUES (${id}, ${email}, ${full_name})
      `;
      return { id, email, full_name };
    } else {
      return result[0];
    }
  } catch (error) {
    console.error("Error creating or updating user", error);
    return null;
  }
}
