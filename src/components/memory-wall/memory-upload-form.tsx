"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { formatBytes } from "@/lib/utils";
import { saveMemoryEditToken } from "@/lib/memory-tokens";
import type { MemoryDTO } from "@/types";

type Status = "idle" | "uploading" | "saving" | "success" | "error";

const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
const MAX_VIDEO_BYTES = 250 * 1024 * 1024;

export function MemoryUploadForm({ onCreated }: { onCreated: (memory: MemoryDTO) => void }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    if (!selected) {
      setFile(null);
      return;
    }
    const isVideo = selected.type.startsWith("video/");
    const limit = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if (selected.size > limit) {
      setErrorMessage(
        `That file is too large. ${isVideo ? "Videos" : "Photos"} must be under ${formatBytes(limit)}.`
      );
      event.target.value = "";
      setFile(null);
      return;
    }
    setErrorMessage(null);
    setFile(selected);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const authorName = String(formData.get("authorName") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!authorName) {
      setErrorMessage("Please share your name.");
      return;
    }
    if (!message && !file) {
      setErrorMessage("Add a message, a photo, or a video before submitting.");
      return;
    }

    try {
      let mediaUrl: string | undefined;
      let mediaType: "PHOTO" | "VIDEO" | undefined;

      if (file) {
        setStatus("uploading");
        const uploadData = new FormData();
        uploadData.append("file", file);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });
        if (!uploadRes.ok) {
          const data = await uploadRes.json().catch(() => null);
          throw new Error(data?.error ?? "Upload failed. Please try again.");
        }
        const uploaded = await uploadRes.json();
        mediaUrl = uploaded.url;
        mediaType = uploaded.mediaType;
      }

      setStatus("saving");
      const res = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorName, message, mediaUrl, mediaType }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "Something went wrong. Please try again.");
      }

      const data = await res.json();
      saveMemoryEditToken(data.memory.id, data.editToken);
      onCreated(data.memory);

      formRef.current?.reset();
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setStatus("success");
      setTimeout(() => setStatus("idle"), 2500);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong.");
      setStatus("error");
    }
  }

  const busy = status === "uploading" || status === "saving";

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="hairline flex flex-col gap-5 rounded-xl p-5 sm:p-8">
      <div>
        <p className="font-[family-name:var(--font-display)] text-xl text-[var(--color-gold-soft)]">
          Leave a memory
        </p>
        <p className="mt-1 text-sm text-[var(--color-stone)]">
          A photo, a video, or just a few words — all welcome.
        </p>
      </div>

      <Field label="Your name" htmlFor="authorName" required>
        <Input id="authorName" name="authorName" required placeholder="Your name" maxLength={120} />
      </Field>

      <Field label="Message" htmlFor="message" hint="Optional if you're attaching a photo or video">
        <Textarea id="message" name="message" rows={4} placeholder={`A memory or wish for Damodar…`} maxLength={1000} />
      </Field>

      <Field label="Photo or video" htmlFor="mediaFile" hint="Images up to 20 MB, videos up to 250 MB">
        <input
          ref={fileInputRef}
          id="mediaFile"
          name="mediaFile"
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="w-full text-sm text-[var(--color-stone)] file:mr-3 file:rounded-full file:border-0 file:bg-[var(--color-gold)] file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-[var(--color-ink)] hover:file:bg-[var(--color-gold-soft)]"
        />
      </Field>

      {file && (
        <p className="text-xs text-[var(--color-stone)]">
          Selected: {file.name} ({formatBytes(file.size)})
        </p>
      )}

      {errorMessage && <p className="text-sm text-red-400">{errorMessage}</p>}
      {status === "success" && (
        <p className="text-sm text-[var(--color-gold-soft)]">Thank you — your memory has been added.</p>
      )}

      <Button type="submit" disabled={busy} className="w-full sm:w-auto sm:self-start">
        {status === "uploading" ? "Uploading…" : status === "saving" ? "Saving…" : "Add to the wall"}
      </Button>
    </form>
  );
}
