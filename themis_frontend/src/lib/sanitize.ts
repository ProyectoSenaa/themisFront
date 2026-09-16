export function stripDataUrl(value?: string | null): string | undefined {
  if (!value || typeof value !== 'string') return value ?? undefined;
  const idx = value.indexOf(',');
  if (idx === -1) return value;
  return value.slice(idx + 1);
}

export function ensureBase64(value?: string | null): string | undefined {
  const v = stripDataUrl(value);
  if (!v) return undefined;
  // remove whitespace
  const cleaned = v.replace(/\s+/g, '');
  return cleaned;
}
