// Lightweight anti-bot helpers for public forms — no third-party keys needed.
// Strategy: honeypot field + time-trap + per-browser cooldown.

const COOLDOWN_KEY_PREFIX = "form_cooldown_";
const MIN_FILL_MS = 1500; // bots auto-fill in <1s
const DEFAULT_COOLDOWN_MS = 30_000;

export type AntiBotCheck = { ok: true } | { ok: false; reason: string; silent?: boolean };

export function checkAntiBot(opts: {
  honeypot: string;
  mountedAt: number;
  formKey: string;
  cooldownMs?: number;
}): AntiBotCheck {
  // 1. Honeypot — silently drop (don't tell the bot)
  if (opts.honeypot && opts.honeypot.trim().length > 0) {
    return { ok: false, reason: "bot_honeypot", silent: true };
  }
  // 2. Time-trap
  if (Date.now() - opts.mountedAt < MIN_FILL_MS) {
    return { ok: false, reason: "Please take a moment before submitting." };
  }
  // 3. Cooldown
  try {
    const last = localStorage.getItem(COOLDOWN_KEY_PREFIX + opts.formKey);
    const cooldown = opts.cooldownMs ?? DEFAULT_COOLDOWN_MS;
    if (last && Date.now() - Number(last) < cooldown) {
      const wait = Math.ceil((cooldown - (Date.now() - Number(last))) / 1000);
      return { ok: false, reason: `Please wait ${wait}s before sending again.` };
    }
  } catch {
    // localStorage unavailable — skip cooldown silently
  }
  return { ok: true };
}

export function markSubmitted(formKey: string) {
  try {
    localStorage.setItem(COOLDOWN_KEY_PREFIX + formKey, String(Date.now()));
  } catch {
    // ignore
  }
}

// Tailwind classes for visually-hidden honeypot field
export const honeypotClass =
  "absolute left-[-9999px] top-[-9999px] h-0 w-0 opacity-0 pointer-events-none";
