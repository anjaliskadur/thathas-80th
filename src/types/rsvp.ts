export type RsvpRow = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  status: "ATTENDING" | "NOT_ATTENDING";
  guest_count: number;
  dietary_notes: string | null;
  note: string | null;
  created_at: string;
};
