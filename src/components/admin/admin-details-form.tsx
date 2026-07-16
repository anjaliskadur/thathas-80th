"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import type { EditableSiteSettings } from "@/lib/site-config";

export function AdminDetailsForm({ initialSettings }: { initialSettings: EditableSiteSettings }) {
  const [settings, setSettings] = useState(initialSettings);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSaveSettings(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setSaveMessage(null);
    setSaveError(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message ?? "Could not save.");
      setSaveMessage("Saved. The public site will show the new details.");
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="px-6 py-10 sm:px-10">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-gold-soft)]">
        Event details
      </h1>
      <p className="mt-2 text-sm text-[var(--color-stone)]">
        These appear on the homepage and RSVP page.
      </p>
      <form onSubmit={handleSaveSettings} className="mt-8 grid max-w-xl gap-5">
        <Field label="Date" htmlFor="eventDateLabel" required>
          <Input
            id="eventDateLabel"
            value={settings.eventDateLabel}
            onChange={(e) => setSettings((s) => ({ ...s, eventDateLabel: e.target.value }))}
            required
          />
        </Field>
        <Field label="Time" htmlFor="eventTimeLabel" required>
          <Input
            id="eventTimeLabel"
            value={settings.eventTimeLabel}
            onChange={(e) => setSettings((s) => ({ ...s, eventTimeLabel: e.target.value }))}
            required
          />
        </Field>
        <Field label="Venue name" htmlFor="venueName" required>
          <Input
            id="venueName"
            value={settings.venueName}
            onChange={(e) => setSettings((s) => ({ ...s, venueName: e.target.value }))}
            required
          />
        </Field>
        <Field label="Venue address" htmlFor="venueAddress" required>
          <Input
            id="venueAddress"
            value={settings.venueAddress}
            onChange={(e) => setSettings((s) => ({ ...s, venueAddress: e.target.value }))}
            required
          />
        </Field>
        <Field label="RSVP deadline" htmlFor="rsvpDeadlineLabel" required>
          <Input
            id="rsvpDeadlineLabel"
            value={settings.rsvpDeadlineLabel}
            onChange={(e) => setSettings((s) => ({ ...s, rsvpDeadlineLabel: e.target.value }))}
            required
          />
        </Field>
        {saveMessage && <p className="text-sm text-[var(--color-gold-soft)]">{saveMessage}</p>}
        {saveError && <p className="text-sm text-red-400">{saveError}</p>}
        <Button type="submit" disabled={saving} className="self-start">
          {saving ? "Saving…" : "Save details"}
        </Button>
      </form>
    </div>
  );
}
