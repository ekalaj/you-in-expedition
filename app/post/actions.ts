"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { areaToEwkt } from "@/lib/areas";

export async function createActivity(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signup");

  const title = String(formData.get("title") || "").trim();
  const category = String(formData.get("category") || "");
  const date = String(formData.get("date") || "");
  const time = String(formData.get("time") || "");
  const place = String(formData.get("place") || "").trim();
  const area = String(formData.get("area") || "");
  const capacity = parseInt(String(formData.get("capacity") || "8"), 10) || 8;
  const description = String(formData.get("description") || "").trim();

  if (!title || !category || !date || !time || !place || !area) {
    redirect("/post?error=missing");
  }

  const startsAt = new Date(`${date}T${time}`).toISOString();

  const { data, error } = await supabase
    .from("activities")
    .insert({
      host_id: user.id,
      title,
      category,
      starts_at: startsAt,
      place,
      area,
      location: areaToEwkt(area),
      capacity,
      description,
    })
    .select("id")
    .single();

  if (error || !data) redirect("/post?error=failed");

  // The DB trigger adds the host as the first attendee.
  redirect(`/activity/${data.id}`);
}
