const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_IN_MS);
}

export function diffInDays(from: Date, to: Date): number {
  const fromStart = Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate());
  const toStart = Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate());
  const diff = Math.floor((toStart - fromStart) / DAY_IN_MS);

  return Math.max(0, diff);
}
