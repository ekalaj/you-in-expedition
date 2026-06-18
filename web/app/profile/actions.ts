"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { areaToEwkt } from "@/lib/areas";

export async function updateProfile(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signup");

  const name = String(formData.get("name") || "").trim();
  const area = String(formData.get("area") || "");
  const time_pref = String(formData.get("time_pref") || "any");
  const interests = formData.getAll("interests").map(String);

  await supabase
    .from("profiles")
    .update({
      name,
      area,
      home: areaToEwkt(area),
      time_pref,
      interests,
    })
    .eq("id", user.id);

  revalidatePath("/profile");
  revalidatePath("/browse");
  // Send the member back with a flag so the page can show a "Saved!" confirmation.
  redirect("/profile?saved=1");
}
