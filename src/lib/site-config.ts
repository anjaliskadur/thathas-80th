/**
 * Static defaults for the site. Editable date/venue fields are overridden at
 * runtime by Supabase site_settings via getSiteConfig().
 */
export const siteConfigDefaults = {
  honoreeName: "Damodar Kadambi",
  honoreeShortName: "Damodar",
  eventTitle: "80th Birthday Celebration",
  eventDateLabel: "Saturday, October 17, 2026",
  eventTimeLabel: "5:00 PM – 9:00 PM",
  venueName: "Venue to be announced",
  venueAddress: "Address to be announced",
  rsvpDeadlineLabel: "September 20, 2026",
  hostingNote:
    "Please join us as we celebrate eight wonderful decades of Damodar's life, love, and stories.",
  contactEmail: "family@thathas80th.com",
} as const;

export type SiteConfig = {
  honoreeName: string;
  honoreeShortName: string;
  eventTitle: string;
  eventDateLabel: string;
  eventTimeLabel: string;
  venueName: string;
  venueAddress: string;
  rsvpDeadlineLabel: string;
  hostingNote: string;
  contactEmail: string;
};

/** @deprecated Prefer getSiteConfig() for live date/venue; kept for static metadata. */
export const siteConfig = siteConfigDefaults;

export type EditableSiteSettings = {
  eventDateLabel: string;
  eventTimeLabel: string;
  venueName: string;
  venueAddress: string;
  rsvpDeadlineLabel: string;
};
