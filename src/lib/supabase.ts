/**
 * Server-side Supabase helpers using the secret key.
 * New sb_secret_* keys must be sent on the `apikey` header only — not as
 * Authorization: Bearer (that expects a JWT and returns Invalid JWT).
 */

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export function getSupabaseUrl() {
  return requireEnv("SUPABASE_URL");
}

function secretKey() {
  return requireEnv("SUPABASE_SECRET_KEY");
}

type RestOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  /** Prefer header value, e.g. return=representation */
  prefer?: string;
};

export async function supabaseRest<T>(
  path: string,
  options: RestOptions = {}
): Promise<{ data: T; error: null } | { data: null; error: string; status: number }> {
  const url = `${getSupabaseUrl()}/rest/v1${path}`;
  const key = secretKey();

  const res = await fetch(url, {
    method: options.method ?? "GET",
    headers: {
      apikey: key,
      "Content-Type": "application/json",
      ...(options.prefer ? { Prefer: options.prefer } : {}),
      ...options.headers,
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return { data: null, error: text || res.statusText, status: res.status };
  }

  // 204 No Content (e.g. DELETE) — success with no JSON body.
  if (res.status === 204) {
    return { data: null as unknown as T, error: null };
  }

  const data = (await res.json()) as T;
  return { data, error: null };
}

export async function supabaseUpload(
  objectPath: string,
  file: Blob,
  contentType: string
): Promise<{ publicUrl: string } | { error: string }> {
  const key = secretKey();
  const url = `${getSupabaseUrl()}/storage/v1/object/memory-wall/${objectPath}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      apikey: key,
      "Content-Type": contentType,
      "x-upsert": "false",
    },
    body: file,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return { error: text || res.statusText };
  }

  const publicUrl = `${getSupabaseUrl()}/storage/v1/object/public/memory-wall/${objectPath}`;
  return { publicUrl };
}

export async function supabaseRemoveObject(publicUrl: string): Promise<void> {
  const prefix = `${getSupabaseUrl()}/storage/v1/object/public/memory-wall/`;
  if (!publicUrl.startsWith(prefix)) return;

  const objectPath = publicUrl.slice(prefix.length);
  const key = secretKey();
  await fetch(`${getSupabaseUrl()}/storage/v1/object/memory-wall`, {
    method: "DELETE",
    headers: {
      apikey: key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([objectPath]),
  }).catch(() => null);
}

export type MemoryRow = {
  id: string;
  author_name: string;
  message: string | null;
  media_url: string | null;
  media_type: "PHOTO" | "VIDEO" | null;
  edit_token_hash?: string;
  created_at: string;
  updated_at: string;
};

export function toMemoryDTO(row: MemoryRow) {
  return {
    id: row.id,
    authorName: row.author_name,
    message: row.message,
    mediaUrl: row.media_url,
    mediaType: row.media_type,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
