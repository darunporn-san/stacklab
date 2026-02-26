export function formatTimestamp(unix: number, timezone?: string): string {
  const date = new Date(unix * 1000);
  return date.toLocaleString("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function formatUtc(unix: number): string {
  return formatTimestamp(unix, "UTC") + " UTC";
}

export function formatLocal(unix: number): string {
  const tz = getUserTimezone();
  return formatTimestamp(unix, tz) + ` (${tz})`;
}

export function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC";
  }
}

export function getRelativeTime(unix: number): string {
  const now = Date.now() / 1000;
  const diff = now - unix;
  const abs = Math.abs(diff);
  const future = diff < 0;

  if (abs < 60) return future ? "in a few seconds" : "just now";
  if (abs < 3600) {
    const m = Math.floor(abs / 60);
    return future ? `in ${m}m` : `${m}m ago`;
  }
  if (abs < 86400) {
    const h = Math.floor(abs / 3600);
    return future ? `in ${h}h` : `${h}h ago`;
  }
  const d = Math.floor(abs / 86400);
  return future ? `in ${d}d` : `${d}d ago`;
}

export function formatCountdown(secondsRemaining: number): string {
  if (secondsRemaining <= 0) return "Expired";
  const h = Math.floor(secondsRemaining / 3600);
  const m = Math.floor((secondsRemaining % 3600) / 60);
  const s = Math.floor(secondsRemaining % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
