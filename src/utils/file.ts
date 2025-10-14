import fs from 'fs/promises';
import { LotteryResult } from '../types/index.js';

/**
 * Read JSONL file and parse lottery results
 */
export async function readJsonLines(filePath: string): Promise<LotteryResult[]> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.trim().split('\n').filter(line => line.trim());
    return lines.map(line => JSON.parse(line));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

/**
 * Write lottery results to JSONL file
 */
export async function writeJsonLines(filePath: string, data: LotteryResult[]): Promise<void> {
  const lines = data.map(item => JSON.stringify(item)).join('\n');
  await fs.writeFile(filePath, lines + '\n', 'utf-8');
}

/**
 * Ensure directory exists
 */
export async function ensureDir(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    // Ignore if directory already exists
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error;
    }
  }
}
