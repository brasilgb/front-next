export function getInitials(name?: string | null): string {
  if (!name) return "";

  const ignored = ["da", "de", "do", "das", "dos", "e"];
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(p => !ignored.includes(p.toLowerCase()));

  if (parts.length === 0) return "";

  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }

  const first = parts[0][0];
  const last = parts[parts.length - 1][0];

  return (first + last).toUpperCase();
}
