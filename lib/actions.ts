"use server"

import { supabase } from "./supabase"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function handleSignOut() {
  await supabase.auth.signOut()
  revalidatePath("/")
  redirect("/auth")
}
