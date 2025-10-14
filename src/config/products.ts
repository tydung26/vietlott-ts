import { ProductConfig } from '../types/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Project root is two levels up from src/config
const projectRoot = path.resolve(__dirname, '../..');
const dataDir = path.join(projectRoot, 'data');

export const power645Config: ProductConfig = {
  name: 'power_645',
  rawPath: path.join(dataDir, 'power645.jsonl'),
  minValue: 1,
  maxValue: 45,
  sizeOutput: 6,
  intervalDays: 2,
  numThreads: 10,
  useCookies: false,
  defaultIndexTo: 1,
  pageSize: 6,
};

export const power655Config: ProductConfig = {
  name: 'power_655',
  rawPath: path.join(dataDir, 'power655.jsonl'),
  minValue: 1,
  maxValue: 55,
  sizeOutput: 6,
  intervalDays: 2,
  numThreads: 10,
  useCookies: false,
  defaultIndexTo: 1,
  pageSize: 6,
};

export const power535Config: ProductConfig = {
  name: 'power_535',
  rawPath: path.join(dataDir, 'power535.jsonl'),
  minValue: 1,
  maxValue: 35,
  sizeOutput: 5,
  intervalDays: 2,
  numThreads: 10,
  useCookies: false,
  defaultIndexTo: 1,
  pageSize: 6,
};

export const kenoConfig: ProductConfig = {
  name: 'keno',
  rawPath: path.join(dataDir, 'keno.jsonl'),
  minValue: 1,
  maxValue: 80,
  sizeOutput: 20,
  intervalDays: 0, // Runs every 10 minutes
  numThreads: 20,
  useCookies: false,
  defaultIndexTo: 24,
  pageSize: 6,
};

export const max3dConfig: ProductConfig = {
  name: '3d',
  rawPath: path.join(dataDir, '3d.jsonl'),
  minValue: 0,
  maxValue: 999,
  sizeOutput: 6,
  intervalDays: 2,
  numThreads: 20,
  useCookies: false,
  defaultIndexTo: 1,
  pageSize: 5,
};

export const max3dProConfig: ProductConfig = {
  name: '3d_pro',
  rawPath: path.join(dataDir, '3d_pro.jsonl'),
  minValue: 0,
  maxValue: 999,
  sizeOutput: 6,
  intervalDays: 2,
  numThreads: 20,
  useCookies: false,
  defaultIndexTo: 1,
  pageSize: 5,
};

export const bingo18Config: ProductConfig = {
  name: 'bingo18',
  rawPath: path.join(dataDir, 'bingo18.jsonl'),
  minValue: 0,
  maxValue: 9,
  sizeOutput: 3,
  intervalDays: 0, // Runs every 5 minutes
  numThreads: 10,
  useCookies: false,
  defaultIndexTo: 1,
  pageSize: 6,
};

export const productConfigMap: Record<string, ProductConfig> = {
  power_645: power645Config,
  power_655: power655Config,
  power_535: power535Config,
  keno: kenoConfig,
  '3d': max3dConfig,
  '3d_pro': max3dProConfig,
  bingo18: bingo18Config,
};

export function getConfig(name: string): ProductConfig {
  const config = productConfigMap[name];
  if (!config) {
    throw new Error(`Unknown product: ${name}`);
  }
  return config;
}
