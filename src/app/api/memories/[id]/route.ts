import { NextRequest, NextResponse } from "next/server";
import { memoryUpdateSchema } from "@/lib/validation";
import { verifyEditToken } from "@/lib/edit-token";
import {
  supabaseRemoveObject,
  supabaseRest,
  toMemoryDTO,
  type MemoryRow,
} from "@/lib/supabase";

const ADMIN_HEADER = "x-admin-passcode";

async function isAuthorized(id: string, editToken: string | undefined, request: NextRequest) {
  const adminPasscode = request.headers.get(ADMIN_HEADER);
  if (adminPasscode && process.env.ADMIN_PASSCODE && adminPasscode === process.env.ADMIN_PASSCODE) {
    return true;
  }
  if (!editToken) return false;

  const result = await supabaseRest<Pick<MemoryRow, "edit_token_hash">[]>(
    `/memories?id=eq.${encodeURIComponent(id)}&select=edit_token_hash`
  );
  const row = result.data?.[0];
  if (result.error || !row?.edit_token_hash) return false;
  return verifyEditToken(editToken, row.edit_token_hash);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const parsed = memoryUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Please check the form for errors." }, { status: 400 });
  }

  const { authorName, message, editToken } = parsed.data;

  const authorized = await isAuthorized(id, editToken, request);
  if (!authorized) {
    return NextResponse.json(
      { message: "You can only edit a memory from the browser that created it." },
      { status: 403 }
    );
  }

  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (authorName) patch.author_name = authorName;
  if (message !== undefined) patch.message = message;

  const result = await supabaseRest<MemoryRow[]>(
    `/memories?id=eq.${encodeURIComponent(id)}&select=id,author_name,message,media_url,media_type,created_at,updated_at`,
    {
      method: "PATCH",
      prefer: "return=representation",
      body: patch,
    }
  );

  const updated = result.data?.[0];
  if (result.error || !updated) {
    return NextResponse.json({ message: "Could not update memory." }, { status: 500 });
  }

  return NextResponse.json({ memory: toMemoryDTO(updated) });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const editToken = request.headers.get("x-edit-token") ?? undefined;

  const authorized = await isAuthorized(id, editToken, request);
  if (!authorized) {
    return NextResponse.json(
      { message: "You can only delete a memory from the browser that created it." },
      { status: 403 }
    );
  }

  const existing = await supabaseRest<Pick<MemoryRow, "media_url">[]>(
    `/memories?id=eq.${encodeURIComponent(id)}&select=media_url`
  );
  const existingRow = existing.data?.[0];
  if (existing.error || !existingRow) {
    return NextResponse.json({ message: "Memory not found." }, { status: 404 });
  }

  const del = await supabaseRest(`/memories?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (del.error) {
    return NextResponse.json({ message: "Could not delete memory." }, { status: 500 });
  }

  if (existingRow.media_url) {
    await supabaseRemoveObject(existingRow.media_url);
  }

  return NextResponse.json({ success: true });
}
