import { HEADERS, TIMEOUT } from '../config/request.js';
import { Task } from '../types/index.js';
import { logger } from '../utils/logger.js';

export interface FetcherOptions {
  url: string;
  headers?: Record<string, string>;
  orgParams?: Record<string, any>;
  orgBody: Record<string, any>;
}

/**
 * Fetch data from Vietlott API using native fetch
 */
/**
 * Generate a curl command for debugging
 */
export function generateCurlCommand(
  url: string,
  body: any,
  headers: Record<string, string>
): string {
  const headerArgs = Object.entries(headers)
    .map(([key, value]) => `-H '${key}: ${value}'`)
    .join(' \\\n  ');

  const bodyJson = JSON.stringify(body, null, 2).replace(/'/g, "'\\''");

  return `curl -X POST '${url}' \\\n  ${headerArgs} \\\n  -d '${bodyJson}'`;
}

export async function fetchData(options: FetcherOptions, task: Task): Promise<any> {
  const { url, orgParams = {}, orgBody } = options;
  const { taskData } = task;

  const params = { ...orgParams, ...taskData.params };
  const body = { ...orgBody, ...taskData.body };

  try {
    logger.debug(`Fetching task ${task.taskId}, PageIndex: ${body.PageIndex}`);

    // Build URL with query parameters
    const urlWithParams = new URL(url);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlWithParams.searchParams.append(key, String(value));
      }
    });

    // Log curl command
    // const curlCommand = generateCurlCommand(urlWithParams.toString(), body, HEADERS);
    // logger.info('\n=== CURL Command ===');
    // logger.info(curlCommand);
    // logger.info('===================\n');

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    const response = await fetch(urlWithParams.toString(), {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    logger.debug(`Task ${task.taskId} completed successfully`);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        logger.error(`Request timeout for task ${task.taskId}`);
      } else {
        logger.error(`Request failed for task ${task.taskId}: ${error.message}`);
      }
    }
    throw error;
  }
}

/**
 * Fetch multiple tasks in parallel with controlled concurrency
 */
export async function fetchTasks(
  options: FetcherOptions,
  tasks: Task[],
  concurrency: number = 10
): Promise<any[]> {
  const results: any[] = [];

  for (let i = 0; i < tasks.length; i += concurrency) {
    const batch = tasks.slice(i, i + concurrency);
    logger.info(
      `Processing batch ${Math.floor(i / concurrency) + 1}/${Math.ceil(tasks.length / concurrency)}`
    );

    // Add delay between batches to avoid rate limiting (except for first batch)
    if (i > 0) {
      const delay = 1000 + Math.random() * 1000; // Random delay 1-2 seconds
      logger.debug(`Waiting ${Math.round(delay)}ms before next batch...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    const batchPromises = batch.map(task =>
      fetchData(options, task).catch(error => {
        logger.error(`Task ${task.taskId} failed: ${error.message}`);
        return null;
      })
    );

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults.filter(r => r !== null));
  }

  return results;
}
