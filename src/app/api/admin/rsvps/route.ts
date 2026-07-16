import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseRest } from "@/lib/supabase";
import type { RsvpRow } from "@/types/rsvp";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const result = await supabaseRest<RsvpRow[]>(
    "/rsvps?select=id,full_name,email,phone,status,guest_count,dietary_notes,note,created_at&order=created_at.desc"
  );

  if (result.error || !result.data) {
    return NextResponse.json({ message: "Could not load RSVPs." }, { status: 500 });
  }

  return NextResponse.json({ rsvps: result.data });
}
