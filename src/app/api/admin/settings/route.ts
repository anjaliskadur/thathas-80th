import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { getEditableSettings } from "@/lib/get-site-config";
import { supabaseRest } from "@/lib/supabase";

const settingsSchema = z.object({
  eventDateLabel: z.string().trim().min(1).max(200),
  eventTimeLabel: z.string().trim().min(1).max(200),
  venueName: z.string().trim().min(1).max(200),
  venueAddress: z.string().trim().min(1).max(300),
  rsvpDeadlineLabel: z.string().trim().min(1).max(200),
});

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }
  const settings = await getEditableSettings();
  return NextResponse.json({ settings });
}

export async function PATCH(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Please check the form for errors." }, { status: 400 });
  }

  const data = parsed.data;
  const result = await supabaseRest("/site_settings?id=eq.1", {
    method: "PATCH",
    prefer: "return=representation",
    body: {
      event_date_label: data.eventDateLabel,
      event_time_label: data.eventTimeLabel,
      venue_name: data.venueName,
      venue_address: data.venueAddress,
      rsvp_deadline_label: data.rsvpDeadlineLabel,
      updated_at: new Date().toISOString(),
    },
  });

  if (result.error) {
    return NextResponse.json(
      { message: "Could not save settings. Has site_settings been created in Supabase?" },
      { status: 500 }
    );
  }

  return NextResponse.json({ settings: data });
}
