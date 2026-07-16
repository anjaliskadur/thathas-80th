import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { memoryCreateSchema } from "@/lib/validation";
import { generateEditToken, hashEditToken } from "@/lib/edit-token";
import { supabaseRest, toMemoryDTO, type MemoryRow } from "@/lib/supabase";

export async function GET() {
  const result = await supabaseRest<MemoryRow[]>(
    "/memories?select=id,author_name,message,media_url,media_type,created_at,updated_at&order=created_at.desc"
  );

  if (result.error) {
    return NextResponse.json({ message: "Could not load memories." }, { status: 500 });
  }

  return NextResponse.json({ memories: result.data.map(toMemoryDTO) });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const parsed = memoryCreateSchema.safeParse(body);
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

  const { authorName, message, mediaUrl, mediaType } = parsed.data;

  if (!message?.trim() && !mediaUrl) {
    return NextResponse.json(
      { message: "Add a message, a photo, or a video before submitting." },
      { status: 400 }
    );
  }

  const editToken = generateEditToken();
  const id = nanoid();
  const now = new Date().toISOString();

  const result = await supabaseRest<MemoryRow[]>("/memories", {
    method: "POST",
    prefer: "return=representation",
    body: {
      id,
      author_name: authorName,
      message: message || null,
      media_url: mediaUrl || null,
      media_type: mediaUrl ? mediaType : null,
      edit_token_hash: hashEditToken(editToken),
      created_at: now,
      updated_at: now,
    },
  });

  if (result.error || !result.data?.[0]) {
    return NextResponse.json(
      { message: "Could not save memory. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { memory: toMemoryDTO(result.data[0]), editToken },
    { status: 201 }
  );
}
