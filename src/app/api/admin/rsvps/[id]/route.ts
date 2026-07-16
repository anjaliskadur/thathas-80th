import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseRest } from "@/lib/supabase";
import { rsvpSchema } from "@/lib/validation";
import type { RsvpRow } from "@/types/rsvp";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = rsvpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Please check the form for errors." }, { status: 400 });
  }

  const data = parsed.data;
  const result = await supabaseRest<RsvpRow[]>(
    `/rsvps?id=eq.${encodeURIComponent(id)}&select=id,full_name,email,phone,status,guest_count,dietary_notes,note,created_at`,
    {
      method: "PATCH",
      prefer: "return=representation",
      body: {
        full_name: data.fullName,
        email: data.email || null,
        phone: data.phone || null,
        status: data.status,
        guest_count: data.guestCount,
        dietary_notes: data.dietaryNotes || null,
        note: data.note || null,
        updated_at: new Date().toISOString(),
      },
    }
  );

  const updated = result.data?.[0];
  if (result.error || !updated) {
    return NextResponse.json({ message: "Could not update RSVP." }, { status: 500 });
  }

  return NextResponse.json({ rsvp: updated });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const result = await supabaseRest(`/rsvps?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  if (result.error) {
    return NextResponse.json({ message: "Could not delete RSVP." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
