/**
 * Logger utility using Pino
 */

import pino from 'pino';

// Map LOG_LEVEL environment variable to Pino levels
const getLogLevel = (): pino.Level => {
  const envLevel = process.env.LOG_LEVEL?.toLowerCase();
  const validLevels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];

  // Map common level names to Pino levels
  const levelMap: Record<string, pino.Level> = {
    debug: 'debug',
    info: 'info',
    warn: 'warn',
    error: 'error',
  };

  if (envLevel && validLevels.includes(envLevel)) {
    return envLevel as pino.Level;
  }

  if (envLevel && levelMap[envLevel]) {
    return levelMap[envLevel];
  }

  return 'info';
};

// Determine if we should use pretty printing
const isPretty = process.env.NODE_ENV !== 'production' && !process.env.NO_PRETTY_LOGS;

export const logger = pino({
  level: getLogLevel(),
  transport: isPretty
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
});

// Re-export LogLevel enum for backward compatibility
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}
