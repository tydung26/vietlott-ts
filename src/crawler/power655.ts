import { RequestPower655, LotteryResult, CrawlOptions, Task } from '../types/index.js';
import { DEFAULT_ORENDER_INFO } from '../config/request.js';
import { power655Config } from '../config/products.js';
import { fetchTasks, FetcherOptions } from './fetcher.js';
import { readJsonLines, writeJsonLines, ensureDir } from '../utils/file.js';
import { getCurrentDateString, getCurrentTimestamp } from '../utils/date.js';
import { logger } from '../utils/logger.js';
import path from 'path';

export class Power655Crawler {
  private readonly url =
    'https://vietlott.vn/ajaxpro/Vietlott.PlugIn.WebParts.Game655CompareWebPart,Vietlott.PlugIn.WebParts.ashx';
  private readonly config = power655Config;

  private createRequestBody(pageIndex: number): RequestPower655 {
    return {
      ORenderInfo: DEFAULT_ORENDER_INFO,
      Key: '23bbd667',
      GameDrawId: '',
      ArrayNumbers: Array(5)
        .fill(null)
        .map(() => Array(18).fill('')),
      CheckMulti: false,
      PageIndex: pageIndex,
    };
  }

  public parseResult(responseData: any, pageIndex: number): LotteryResult[] {
    const results: LotteryResult[] = [];

    try {
      const data = typeof responseData === 'string' ? JSON.parse(responseData) : responseData;

      if (!data?.value?.HtmlContent) {
        logger.warn(`No HTML content found for page ${pageIndex}`);
        return results;
      }

      const html = data.value.HtmlContent as string;

      // Parse each table row - Power 655 has ID wrapped in <a> tag
      const rowRegex =
        /<tr>\s*<td>(\d{2}\/\d{2}\/\d{4})<\/td>\s*<td[^>]*><a[^>]*>([^<]+)<\/a><\/td>\s*<td>([\s\S]*?)<\/td>\s*<\/tr>/g;

      let match;
      while ((match = rowRegex.exec(html)) !== null) {
        const dateStr = match[1]; // DD/MM/YYYY format
        const id = match[2].trim();
        const numbersHtml = match[3];

        // Extract lottery numbers from <span> tags, excluding pipes
        const numberRegex = /<span[^>]*>(\d+)<\/span>/g;
        const numbers: number[] = [];
        let numberMatch;

        while ((numberMatch = numberRegex.exec(numbersHtml)) !== null) {
          numbers.push(parseInt(numberMatch[1], 10));
        }

        // Convert date from DD/MM/YYYY to YYYY-MM-DD
        const [day, month, year] = dateStr.split('/');
        const isoDate = `${year}-${month}-${day}`;

        if (numbers.length === 7) {
          // 6 main numbers + 1 bonus number
          results.push({
            date: isoDate,
            id: id,
            result: numbers,
            page: pageIndex,
            process_time: getCurrentTimestamp(),
          });
        } else {
          logger.warn(`Invalid number count (${numbers.length}) for ID ${id} on page ${pageIndex}`);
        }
      }

      logger.debug(`Parsed ${results.length} results from page ${pageIndex}`);
    } catch (error) {
      logger.error(`Error parsing results for page ${pageIndex}: ${(error as Error).message}`);
    }

    return results;
  }

  async crawl(options: CrawlOptions = {}): Promise<void> {
    const {
      runDate = getCurrentDateString(),
      indexFrom = 0,
      indexTo = this.config.defaultIndexTo,
    } = options;

    logger.info(`Starting crawl for Power 6/55`);
    logger.info(`Date: ${runDate}, Pages: ${indexFrom} to ${indexTo}`);

    // Create tasks
    const tasks: Task[] = [];
    for (let i = indexFrom; i <= indexTo; i++) {
      tasks.push({
        taskId: i,
        taskData: {
          params: {},
          body: { PageIndex: i },
          runDateStr: runDate,
        },
      });
    }

    logger.info(`Created ${tasks.length} tasks`);

    // Fetch data
    const fetcherOptions: FetcherOptions = {
      url: this.url,
      orgBody: this.createRequestBody(0),
    };

    const responses = await fetchTasks(fetcherOptions, tasks, this.config.numThreads);
    logger.info(`Fetched ${responses.length} responses`);

    // Parse results
    const allResults: LotteryResult[] = [];
    for (let i = 0; i < responses.length; i++) {
      const results = this.parseResult(responses[i], tasks[i].taskId);
      allResults.push(...results);
    }

    if (allResults.length === 0) {
      logger.info('No results to save');
      return;
    }

    logger.info(`Parsed ${allResults.length} results`);

    // Load existing data
    await ensureDir(path.dirname(this.config.rawPath));
    const existingData = await readJsonLines(this.config.rawPath);
    const existingIds = new Set(existingData.map(r => r.id));

    logger.info(`Existing data: ${existingData.length} records`);

    // Merge new data
    const newResults = allResults.filter(r => !existingIds.has(r.id));
    const mergedData = [...existingData, ...newResults];

    // Sort by date and id
    mergedData.sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      return a.id.localeCompare(b.id);
    });

    logger.info(`Adding ${newResults.length} new records`);
    logger.info(`Total records: ${mergedData.length}`);

    // Save to file
    await writeJsonLines(this.config.rawPath, mergedData);
    logger.info(`Saved to ${this.config.rawPath}`);

    // Log statistics
    if (mergedData.length > 0) {
      const dates = mergedData.map(r => r.date);
      const ids = mergedData.map(r => r.id);
      logger.info(`Date range: ${dates[0]} to ${dates[dates.length - 1]}`);
      logger.info(`ID range: ${ids[0]} to ${ids[ids.length - 1]}`);
    }
  }
}
