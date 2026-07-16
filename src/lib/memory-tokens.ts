const STORAGE_KEY = "thathas80th:memory-edit-tokens";

type TokenMap = Record<string, string>;

function readAll(): TokenMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TokenMap) : {};
  } catch {
    return {};
  }
}

function writeAll(map: TokenMap) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // Storage may be unavailable (private browsing, quota) - editing this
    // session's own entries just won't be possible, which is a safe failure.
  }
}

export function saveMemoryEditToken(memoryId: string, token: string) {
  const map = readAll();
  map[memoryId] = token;
  writeAll(map);
}

export function getMemoryEditToken(memoryId: string): string | null {
  return readAll()[memoryId] ?? null;
}

export function removeMemoryEditToken(memoryId: string) {
  const map = readAll();
  delete map[memoryId];
  writeAll(map);
}
