"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Toggle the current member's RSVP for an activity.
export async function toggleJoin(activityId: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signup");

  const { data: existing } = await supabase
    .from("attendees")
    .select("profile_id")
    .eq("activity_id", activityId)
    .eq("profile_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("attendees").delete().eq("activity_id", activityId).eq("profile_id", user.id);
  } else {
    // Capacity is also enforced by the UI; a future DB trigger can make it strict.
    await supabase.from("attendees").insert({ activity_id: activityId, profile_id: user.id });
  }

  revalidatePath(`/activity/${activityId}`);
  revalidatePath("/browse");
}
