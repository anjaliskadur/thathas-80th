import "server-only";
import {
  siteConfigDefaults,
  type EditableSiteSettings,
  type SiteConfig,
} from "@/lib/site-config";
import { supabaseRest } from "@/lib/supabase";

type SettingsRow = {
  event_date_label: string;
  event_time_label: string;
  venue_name: string;
  venue_address: string;
  rsvp_deadline_label: string;
};

function rowToEditable(row: SettingsRow): EditableSiteSettings {
  return {
    eventDateLabel: row.event_date_label,
    eventTimeLabel: row.event_time_label,
    venueName: row.venue_name,
    venueAddress: row.venue_address,
    rsvpDeadlineLabel: row.rsvp_deadline_label,
  };
}

/** Merge Supabase site_settings over static defaults. Falls back if DB unavailable. */
export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const result = await supabaseRest<SettingsRow[]>(
      "/site_settings?id=eq.1&select=event_date_label,event_time_label,venue_name,venue_address,rsvp_deadline_label"
    );
    const row = result.data?.[0];
    if (result.error || !row) {
      return { ...siteConfigDefaults };
    }
    return {
      ...siteConfigDefaults,
      ...rowToEditable(row),
    };
  } catch {
    return { ...siteConfigDefaults };
  }
}

export async function getEditableSettings(): Promise<EditableSiteSettings> {
  const config = await getSiteConfig();
  return {
    eventDateLabel: config.eventDateLabel,
    eventTimeLabel: config.eventTimeLabel,
    venueName: config.venueName,
    venueAddress: config.venueAddress,
    rsvpDeadlineLabel: config.rsvpDeadlineLabel,
  };
}
