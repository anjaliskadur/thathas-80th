"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import type { RsvpRow } from "@/types/rsvp";

type EditForm = {
  fullName: string;
  email: string;
  phone: string;
  status: "ATTENDING" | "NOT_ATTENDING";
  guestCount: number;
  dietaryNotes: string;
  note: string;
};

function toForm(row: RsvpRow): EditForm {
  return {
    fullName: row.full_name,
    email: row.email ?? "",
    phone: row.phone ?? "",
    status: row.status,
    guestCount: row.guest_count,
    dietaryNotes: row.dietary_notes ?? "",
    note: row.note ?? "",
  };
}

export function AdminRsvpsPanel() {
  const router = useRouter();
  const [rsvps, setRsvps] = useState<RsvpRow[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EditForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  async function loadRsvps() {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch("/api/admin/rsvps");
      if (res.status === 401) {
        router.refresh();
        return;
      }
      if (!res.ok) throw new Error("Could not load RSVPs.");
      const data = await res.json();
      setRsvps(data.rsvps ?? []);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Could not load RSVPs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadRsvps();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once on mount
  }, []);

  const stats = useMemo(() => {
    const attending = rsvps.filter((r) => r.status === "ATTENDING");
    const notAttending = rsvps.filter((r) => r.status === "NOT_ATTENDING");
    const guestTotal = attending.reduce((sum, r) => sum + r.guest_count, 0);
    return {
      total: rsvps.length,
      attending: attending.length,
      notAttending: notAttending.length,
      guestTotal,
    };
  }, [rsvps]);

  function startEdit(row: RsvpRow) {
    setEditingId(row.id);
    setForm(toForm(row));
    setActionError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(null);
    setActionError(null);
  }

  async function saveEdit(event: React.FormEvent) {
    event.preventDefault();
    if (!editingId || !form) return;
    setSaving(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/admin/rsvps/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message ?? "Could not save RSVP.");
      const updated = data.rsvp as RsvpRow;
      setRsvps((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      cancelEdit();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not save RSVP.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteRsvp(id: string, name: string) {
    if (!window.confirm(`Delete RSVP for ${name}? This cannot be undone.`)) return;
    setActionError(null);
    try {
      const res = await fetch(`/api/admin/rsvps/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message ?? "Could not delete RSVP.");
      setRsvps((prev) => prev.filter((r) => r.id !== id));
      if (editingId === id) cancelEdit();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not delete RSVP.");
    }
  }

  return (
    <div className="px-6 py-10 sm:px-10">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-gold-soft)]">
        RSVPs
      </h1>
      <p className="mt-2 text-sm text-[var(--color-stone)]">
        View, edit, or delete responses. Totals update automatically.
      </p>

      <div className="mt-6 flex flex-wrap gap-4 text-sm text-[var(--color-stone)]">
        <span>
          Responses: <strong className="text-[var(--color-ivory)]">{stats.total}</strong>
        </span>
        <span>
          Attending: <strong className="text-[var(--color-ivory)]">{stats.attending}</strong>
        </span>
        <span>
          Not attending:{" "}
          <strong className="text-[var(--color-ivory)]">{stats.notAttending}</strong>
        </span>
        <span>
          Guest seats: <strong className="text-[var(--color-ivory)]">{stats.guestTotal}</strong>
        </span>
      </div>

      {loading && <p className="mt-8 text-sm text-[var(--color-stone)]">Loading RSVPs…</p>}
      {loadError && <p className="mt-8 text-sm text-red-400">{loadError}</p>}
      {actionError && <p className="mt-4 text-sm text-red-400">{actionError}</p>}

      {!loading && !loadError && rsvps.length === 0 && (
        <p className="mt-8 text-sm text-[var(--color-stone)]">No RSVPs yet.</p>
      )}

      <ul className="mt-8 flex flex-col gap-4">
        {rsvps.map((r) => {
          const isEditing = editingId === r.id;
          return (
            <li
              key={r.id}
              className="hairline rounded-xl px-5 py-5"
            >
              {isEditing && form ? (
                <form onSubmit={saveEdit} className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full name" htmlFor="fullName" required>
                    <Input
                      id="fullName"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      required
                    />
                  </Field>
                  <Field label="Status" htmlFor="status" required>
                    <Select
                      id="status"
                      value={form.status}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          status: e.target.value as EditForm["status"],
                        })
                      }
                    >
                      <option value="ATTENDING">Attending</option>
                      <option value="NOT_ATTENDING">Not attending</option>
                    </Select>
                  </Field>
                  <Field label="Guest count" htmlFor="guestCount" required>
                    <Input
                      id="guestCount"
                      type="number"
                      min={1}
                      max={10}
                      value={form.guestCount}
                      onChange={(e) =>
                        setForm({ ...form, guestCount: Number(e.target.value) || 1 })
                      }
                      required
                    />
                  </Field>
                  <Field label="Email" htmlFor="email">
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </Field>
                  <Field label="Phone" htmlFor="phone">
                    <Input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </Field>
                  <Field label="Dietary notes" htmlFor="dietaryNotes">
                    <Input
                      id="dietaryNotes"
                      value={form.dietaryNotes}
                      onChange={(e) => setForm({ ...form, dietaryNotes: e.target.value })}
                    />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Note" htmlFor="note">
                      <Textarea
                        id="note"
                        rows={3}
                        value={form.note}
                        onChange={(e) => setForm({ ...form, note: e.target.value })}
                      />
                    </Field>
                  </div>
                  <div className="flex flex-wrap gap-3 sm:col-span-2">
                    <Button type="submit" disabled={saving}>
                      {saving ? "Saving…" : "Save changes"}
                    </Button>
                    <Button type="button" variant="outline" onClick={cancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 space-y-2 text-sm">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <p className="text-lg text-[var(--color-ivory)]">{r.full_name}</p>
                      <span className="text-[var(--color-gold-soft)]">
                        {r.status === "ATTENDING" ? "Attending" : "Not attending"}
                      </span>
                      <span className="text-[var(--color-stone)]">
                        {r.guest_count} guest{r.guest_count === 1 ? "" : "s"}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 text-[var(--color-stone)]">
                      <p>
                        Email:{" "}
                        {r.email ? (
                          <a
                            href={`mailto:${r.email}`}
                            className="text-[var(--color-gold-soft)] underline-offset-2 hover:underline"
                          >
                            {r.email}
                          </a>
                        ) : (
                          <span className="text-[var(--color-stone)]/70">Not provided</span>
                        )}
                      </p>
                      <p>
                        Phone:{" "}
                        {r.phone ? (
                          <a
                            href={`tel:${r.phone.replace(/\s+/g, "")}`}
                            className="text-[var(--color-gold-soft)] underline-offset-2 hover:underline"
                          >
                            {r.phone}
                          </a>
                        ) : (
                          <span className="text-[var(--color-stone)]/70">Not provided</span>
                        )}
                      </p>
                      <p>
                        Dietary:{" "}
                        <span className="text-[var(--color-ivory)]">
                          {r.dietary_notes || "—"}
                        </span>
                      </p>
                      <p>
                        Note:{" "}
                        <span className="text-[var(--color-ivory)]">{r.note || "—"}</span>
                      </p>
                      <p className="text-xs">
                        Submitted {new Date(r.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Button type="button" variant="outline" onClick={() => startEdit(r)}>
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => void deleteRsvp(r.id, r.full_name)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
