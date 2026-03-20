import { config } from 'dotenv';

config();

const parseBoolean = (value: string | undefined, defaultValue = false): boolean => {
  if (!value) {
    return defaultValue;
  }

  return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
};

const parseNumber = (value: string | undefined, defaultValue: number): number => {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : defaultValue;
};

const parseList = (value: string | undefined): string[] => {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
};

export const env = {
  port: parseNumber(process.env.PORT, 3333),
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  keepAliveEnabled: parseBoolean(process.env.KEEP_ALIVE_ENABLED),
  keepAliveIntervalMs: parseNumber(process.env.KEEP_ALIVE_INTERVAL_MS, 10 * 60 * 1000),
  keepAliveTargets: parseList(process.env.KEEP_ALIVE_TARGETS),
};
