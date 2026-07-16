"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";

type Status = "idle" | "submitting" | "success" | "error";

export function RsvpForm() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    const payload = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      status: formData.get("status"),
      guestCount: formData.get("guestCount"),
      dietaryNotes: formData.get("dietaryNotes"),
      note: formData.get("note"),
    };

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        if (data?.fieldErrors) setFieldErrors(data.fieldErrors);
        setErrorMessage(data?.message ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      router.refresh();
    } catch {
      setErrorMessage("Something went wrong. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="hairline rounded-xl px-8 py-12 text-center">
        <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-gold-soft)]">
          Thank you!
        </p>
        <p className="mt-3 text-[var(--color-stone)]">
          Your RSVP has been received. We can&apos;t wait to celebrate together.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <Field label="Full name" htmlFor="fullName" required error={fieldErrors.fullName}>
        <Input id="fullName" name="fullName" required autoComplete="name" placeholder="Jane Kadambi" />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Email" htmlFor="email" error={fieldErrors.email}>
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="jane@example.com" />
        </Field>
        <Field label="Phone" htmlFor="phone" error={fieldErrors.phone}>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="(555) 555-5555" />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Will you be attending?" htmlFor="status" required>
          <Select id="status" name="status" defaultValue="ATTENDING" required>
            <option value="ATTENDING">Joyfully attending</option>
            <option value="NOT_ATTENDING">Sadly can&apos;t make it</option>
          </Select>
        </Field>
        <Field label="Number of guests" htmlFor="guestCount" required error={fieldErrors.guestCount}>
          <Input
            id="guestCount"
            name="guestCount"
            type="number"
            min={1}
            max={10}
            defaultValue={1}
            required
          />
        </Field>
      </div>

      <Field
        label="Dietary restrictions"
        htmlFor="dietaryNotes"
        hint="Vegetarian, allergies, etc. — optional"
        error={fieldErrors.dietaryNotes}
      >
        <Input id="dietaryNotes" name="dietaryNotes" placeholder="e.g. vegetarian, nut allergy" />
      </Field>

      <Field label="Note to the family" htmlFor="note" hint="Optional" error={fieldErrors.note}>
        <Textarea id="note" name="note" rows={3} placeholder="Anything you'd like us to know" />
      </Field>

      {errorMessage && <p className="text-sm text-red-400">{errorMessage}</p>}

      <Button type="submit" disabled={status === "submitting"} className="mt-2">
        {status === "submitting" ? "Sending…" : "Send RSVP"}
      </Button>
    </form>
  );
}
