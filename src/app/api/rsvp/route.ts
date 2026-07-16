import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { supabaseRest } from "@/lib/supabase";
import { rsvpSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const parsed = rsvpSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json(
      { message: "Please check the form for errors.", fieldErrors },
      { status: 400 }
    );
  }

  const { fullName, email, phone, status, guestCount, dietaryNotes, note } = parsed.data;
  const id = nanoid();

  const result = await supabaseRest<{ id: string }[]>("/rsvps", {
    method: "POST",
    prefer: "return=representation",
    body: {
      id,
      full_name: fullName,
      email: email || null,
      phone: phone || null,
      status,
      guest_count: guestCount,
      dietary_notes: dietaryNotes || null,
      note: note || null,
    },
  });

  if (result.error) {
    return NextResponse.json(
      { message: "Could not save RSVP. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ id: result.data?.[0]?.id ?? id }, { status: 201 });
}
