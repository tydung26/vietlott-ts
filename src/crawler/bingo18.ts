import { RequestBingo18, LotteryResult, CrawlOptions, Task } from '../types/index.js';
import { DEFAULT_ORENDER_INFO } from '../config/request.js';
import { bingo18Config } from '../config/products.js';
import { fetchTasks, FetcherOptions } from './fetcher.js';
import { readJsonLines, writeJsonLines, ensureDir } from '../utils/file.js';
import { getCurrentDateString, getCurrentTimestamp } from '../utils/date.js';
import { logger } from '../utils/logger.js';
import path from 'path';

export class Bingo18Crawler {
  private readonly url = 'https://vietlott.vn/ajaxpro/Vietlott.PlugIn.WebParts.GameBingoCompareWebPart,Vietlott.PlugIn.WebParts.ashx';
  private readonly config = bingo18Config;

  private createRequestBody(pageIndex: number): RequestBingo18 {
    return {
      ORenderInfo: DEFAULT_ORENDER_INFO,
      GameId: '8',
      GameDrawNo: '',
      number: '',
      DrawDate: '',
      PageIndex: pageIndex,
      TotalRow: 43569,
    };
  }

  private parseResult(responseData: any, pageIndex: number): LotteryResult[] {
    const results: LotteryResult[] = [];

    try {
      const data = typeof responseData === 'string' ? JSON.parse(responseData) : responseData;

      // Check for HTML content in different possible locations
      let htmlContent: string | null = null;
      if (data?.value?.HtmlContent) {
        htmlContent = data.value.HtmlContent;
      } else if (typeof data?.value === 'string') {
        htmlContent = data.value;
      }

      if (!htmlContent) {
        logger.warn(`No HTML content found for page ${pageIndex}`);
        return results;
      }

      const html = htmlContent;

      // Parse table rows
      const rowRegex = /<tr>([\s\S]*?)<\/tr>/g;
      const rows = [];
      let match;

      while ((match = rowRegex.exec(html)) !== null) {
        rows.push(match[1]);
      }

      // Skip header row (first row)
      for (let i = 1; i < rows.length; i++) {
        const rowHtml = rows[i];

        // Extract tds
        const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/g;
        const tds = [];
        let tdMatch;

        while ((tdMatch = tdRegex.exec(rowHtml)) !== null) {
          tds.push(tdMatch[1]);
        }

        if (tds.length < 4) continue;

        const row: any = {};

        // First td: date and ID in <a> tags
        const aRegex = /<a[^>]*>([^<]+)<\/a>/g;
        const links = [];
        let aMatch;

        while ((aMatch = aRegex.exec(tds[0])) !== null) {
          links.push(aMatch[1].trim());
        }

        if (links.length < 2) continue;

        // Parse date
        const dateText = links[0];
        try {
          const [day, month, year] = dateText.split('/');
          row.date = `${year}-${month}-${day}`;
        } catch (error) {
          logger.warn(`Failed to parse date '${dateText}'`);
          continue;
        }

        // Extract ID (remove # prefix if present)
        row.id = links[1].replace('#', '');

        // Second td: result numbers (3 numbers from 0-9)
        const spanRegex = /<span[^>]*>(\d+)<\/span>/g;
        const numbers: number[] = [];
        let spanMatch;

        while ((spanMatch = spanRegex.exec(tds[1])) !== null) {
          const num = parseInt(spanMatch[1], 10);
          if (!isNaN(num)) {
            numbers.push(num);
          }
        }

        // Fallback: try to extract numbers from text if no spans found
        if (numbers.length === 0) {
          const textNumbers = tds[1].replace(/<[^>]*>/g, '').trim().split(/\s+/);
          for (const txt of textNumbers) {
            const num = parseInt(txt, 10);
            if (!isNaN(num)) {
              numbers.push(num);
            }
          }
        }

        row.result = numbers.slice(0, 3); // Take first 3 numbers

        // Validate result - should be exactly 3 numbers
        if (row.result.length !== 3) {
          logger.warn(`Invalid result length: ${row.result.length} for ID ${row.id}`);
          continue;
        }

        // Third td: total
        try {
          row.total = parseInt(tds[2].replace(/<[^>]*>/g, '').trim(), 10);
        } catch {
          row.total = row.result.reduce((a: number, b: number) => a + b, 0); // Calculate if not available
        }

        // Fourth td: large/small classification
        row.large_small = tds[3].replace(/<[^>]*>/g, '').trim();

        // Add metadata
        row.page = pageIndex;
        row.process_time = getCurrentTimestamp();

        results.push(row);
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

    logger.info(`Starting crawl for Bingo18`);
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
