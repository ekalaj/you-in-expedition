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

// File a safety/abuse report against an activity (and its host).
export async function reportActivity(activityId: string, formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signup");

  const reason = String(formData.get("reason") || "").trim();
  const details = String(formData.get("details") || "").trim();
  if (!reason) redirect(`/activity/${activityId}?report=missing`);

  // Capture the host so operators can see who was reported.
  const { data: activity } = await supabase
    .from("activities")
    .select("host_id")
    .eq("id", activityId)
    .maybeSingle();

  await supabase.from("reports").insert({
    reporter_id: user.id,
    activity_id: activityId,
    reported_profile_id: activity?.host_id ?? null,
    reason,
    details,
  });

  redirect(`/activity/${activityId}?reported=1`);
}
