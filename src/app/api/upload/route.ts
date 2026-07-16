import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { supabaseUpload } from "@/lib/supabase";

const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
const MAX_VIDEO_BYTES = 250 * 1024 * 1024;

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);
const VIDEO_TYPES = new Set(["video/mp4", "video/quicktime", "video/webm"]);

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file." }, { status: 400 });
    }

    const isVideo = file.type.startsWith("video/");
    const allowed = isVideo ? VIDEO_TYPES : IMAGE_TYPES;
    if (!allowed.has(file.type)) {
      return NextResponse.json({ error: "Unsupported file type." }, { status: 400 });
    }

    const limit = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if (file.size > limit) {
      return NextResponse.json({ error: "File is too large." }, { status: 400 });
    }

    const ext = file.name.includes(".") ? file.name.split(".").pop() : isVideo ? "mp4" : "jpg";
    const objectPath = `${nanoid()}.${ext}`;

    const result = await supabaseUpload(objectPath, file, file.type);
    if ("error" in result) {
      return NextResponse.json({ error: result.error || "Upload failed." }, { status: 400 });
    }

    return NextResponse.json({
      url: result.publicUrl,
      mediaType: isVideo ? "VIDEO" : "PHOTO",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed." },
      { status: 400 }
    );
  }
}
