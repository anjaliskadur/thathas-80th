"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Pencil, Trash2, X, Check } from "lucide-react";
import { Textarea } from "@/components/ui/field";
import { getMemoryEditToken, removeMemoryEditToken } from "@/lib/memory-tokens";
import type { MemoryDTO } from "@/types";

// localStorage never changes from outside this tab during a session, so no
// real subscription is needed - just a snapshot getter with an SSR fallback.
const noopSubscribe = () => () => {};

function useOwnEditToken(memoryId: string) {
  return useSyncExternalStore(
    noopSubscribe,
    () => getMemoryEditToken(memoryId),
    () => null
  );
}

export function MemoryCard({
  memory,
  onUpdated,
  onDeleted,
}: {
  memory: MemoryDTO;
  onUpdated: (memory: MemoryDTO) => void;
  onDeleted: (id: string) => void;
}) {
  const editToken = useOwnEditToken(memory.id);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(memory.message ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canManage = Boolean(editToken);

  async function handleSave() {
    if (!editToken) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/memories/${memory.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: draft, editToken }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "Couldn't save your changes.");
      }
      const data = await res.json();
      onUpdated(data.memory);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save your changes.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!editToken) return;
    if (!window.confirm("Remove this memory from the wall? This can't be undone.")) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/memories/${memory.id}`, {
        method: "DELETE",
        headers: { "x-edit-token": editToken },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "Couldn't delete this memory.");
      }
      removeMemoryEditToken(memory.id);
      onDeleted(memory.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't delete this memory.");
      setBusy(false);
    }
  }

  return (
    <article className="hairline flex flex-col overflow-hidden rounded-xl bg-[var(--color-ink-raised)]">
      {memory.mediaUrl && memory.mediaType === "PHOTO" && (
        <div className="relative aspect-[4/3] w-full bg-black">
          <Image src={memory.mediaUrl} alt={`Memory from ${memory.authorName}`} fill className="object-cover" />
        </div>
      )}
      {memory.mediaUrl && memory.mediaType === "VIDEO" && (
        <video src={memory.mediaUrl} controls className="aspect-[4/3] w-full bg-black object-cover" />
      )}

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-[family-name:var(--font-display)] text-lg text-[var(--color-gold-soft)]">
              {memory.authorName}
            </p>
            <p className="text-xs text-[var(--color-stone)]">
              {format(new Date(memory.createdAt), "MMM d, yyyy")}
            </p>
          </div>

          {canManage && !isEditing && (
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                aria-label="Edit memory"
                onClick={() => {
                  setDraft(memory.message ?? "");
                  setIsEditing(true);
                }}
                className="rounded-full p-1.5 text-[var(--color-stone)] hover:text-[var(--color-gold-soft)]"
              >
                <Pencil size={16} />
              </button>
              <button
                type="button"
                aria-label="Delete memory"
                onClick={handleDelete}
                disabled={busy}
                className="rounded-full p-1.5 text-[var(--color-stone)] hover:text-red-400"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="flex flex-col gap-2">
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              maxLength={1000}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={busy}
                className="inline-flex items-center gap-1 rounded-full bg-[var(--color-gold)] px-3 py-1.5 text-xs font-medium text-[var(--color-ink)] hover:bg-[var(--color-gold-soft)] disabled:opacity-50"
              >
                <Check size={14} /> Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                disabled={busy}
                className="inline-flex items-center gap-1 rounded-full border border-[var(--color-gold-dim)] px-3 py-1.5 text-xs text-[var(--color-stone)] hover:text-[var(--color-ivory)]"
              >
                <X size={14} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          memory.message && (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-ivory)]">
              {memory.message}
            </p>
          )
        )}

        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    </article>
  );
}
