import { db } from "@/configs/db";
import { Subscriptions } from "@/configs/schema";
import { eq, and } from "drizzle-orm";

export const checkUserSubscription = async (email, unsafeIsMember) => {
  if (unsafeIsMember) return true;
  if (!email) return false;
  try {
    const result = await db.select().from(Subscriptions)
      .where(and(
        eq(Subscriptions.email, email),
        eq(Subscriptions.status, 'approved')
      ));
    return result.length > 0;
  } catch (err) {
    console.error("Error checking subscription in DB:", err);
    return false;
  }
};
