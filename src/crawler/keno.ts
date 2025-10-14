import { RequestKeno, LotteryResult, CrawlOptions, Task } from '../types/index.js';
import { DEFAULT_ORENDER_INFO } from '../config/request.js';
import { kenoConfig } from '../config/products.js';
import { fetchTasks, FetcherOptions } from './fetcher.js';
import { readJsonLines, writeJsonLines, ensureDir } from '../utils/file.js';
import { getCurrentDateString, getCurrentTimestamp } from '../utils/date.js';
import { logger } from '../utils/logger.js';
import path from 'path';

export class KenoCrawler {
  private readonly url = 'https://vietlott.vn/ajaxpro/Vietlott.PlugIn.WebParts.GameKenoCompareWebPart,Vietlott.PlugIn.WebParts.ashx';
  private readonly config = kenoConfig;

  private createRequestBody(pageIndex: number): RequestKeno {
    return {
      DrawDate: '',
      GameDrawNo: '',
      GameId: '6',
      ORenderInfo: DEFAULT_ORENDER_INFO,
      OddEven: 2,
      PageIndex: pageIndex,
      ProcessType: 0,
      TotalRow: 112453,
      UpperLower: 2,
      number: '',
    };
  }

  private parseResult(responseData: any, pageIndex: number): LotteryResult[] {
    const results: LotteryResult[] = [];

    try {
      const data = typeof responseData === 'string' ? JSON.parse(responseData) : responseData;

      if (!data?.value?.HtmlContent) {
        logger.warn(`No HTML content found for page ${pageIndex}`);
        return results;
      }

      const html = data.value.HtmlContent as string;

      // Parse table rows - skip first row (header)
      const rowRegex = /<tr>([\s\S]*?)<\/tr>/g;
      const rows = [];
      let match;

      while ((match = rowRegex.exec(html)) !== null) {
        rows.push(match[1]);
      }

      // Skip header row
      for (let i = 1; i < rows.length; i++) {
        const rowHtml = rows[i];

        // Extract date and ID from first <td> with <a> tags
        const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/g;
        const tds = [];
        let tdMatch;

        while ((tdMatch = tdRegex.exec(rowHtml)) !== null) {
          tds.push(tdMatch[1]);
        }

        if (tds.length < 4) continue;

        // First td: date and ID
        const aRegex = /<a[^>]*>([^<]+)<\/a>/g;
        const links = [];
        let aMatch;

        while ((aMatch = aRegex.exec(tds[0])) !== null) {
          links.push(aMatch[1].trim());
        }

        if (links.length < 2) continue;

        const dateStr = links[0]; // DD/MM/YYYY
        const id = links[1];

        // Convert date from DD/MM/YYYY to YYYY-MM-DD
        const [day, month, year] = dateStr.split('/');
        const isoDate = `${year}-${month}-${day}`;

        // Second td: result numbers in spans
        const numberRegex = /<span[^>]*>(\d+)<\/span>/g;
        const numbers: number[] = [];
        let numberMatch;

        while ((numberMatch = numberRegex.exec(tds[1])) !== null) {
          numbers.push(parseInt(numberMatch[1], 10));
        }

        // Third td: big/small
        const bigSmall = tds[2].replace(/<[^>]*>/g, '').trim();

        // Fourth td: odd/even
        const oddEven = tds[3].replace(/<[^>]*>/g, '').trim();

        if (numbers.length === 20) { // Keno has 20 numbers
          results.push({
            date: isoDate,
            id: id,
            result: numbers,
            big_small: bigSmall,
            odd_even: oddEven,
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

    logger.info(`Starting crawl for Keno`);
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
