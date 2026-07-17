"use client";

import { useState } from "react";
import { MemoryUploadForm } from "./memory-upload-form";
import { MemoryCard } from "./memory-card";
import type { MemoryDTO } from "@/types";

export function MemoryWall({ initialMemories }: { initialMemories: MemoryDTO[] }) {
  const [memories, setMemories] = useState<MemoryDTO[]>(initialMemories);

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr] lg:gap-12">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <MemoryUploadForm onCreated={(memory) => setMemories((prev) => [memory, ...prev])} />
      </div>

      <div>
        {memories.length === 0 ? (
          <div className="hairline rounded-xl px-6 py-12 text-center text-sm text-[var(--color-stone)] sm:px-8 sm:py-16 sm:text-base">
            No memories yet — be the first to leave one for Damodar.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
            {memories.map((memory) => (
              <MemoryCard
                key={memory.id}
                memory={memory}
                onUpdated={(updated) =>
                  setMemories((prev) => prev.map((m) => (m.id === updated.id ? updated : m)))
                }
                onDeleted={(id) => setMemories((prev) => prev.filter((m) => m.id !== id))}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
