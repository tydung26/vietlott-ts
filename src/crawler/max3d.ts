import { RequestMax3D, LotteryResult, CrawlOptions, Task } from '../types/index.js';
import { DEFAULT_ORENDER_INFO } from '../config/request.js';
import { max3dConfig } from '../config/products.js';
import { fetchTasks, FetcherOptions } from './fetcher.js';
import { readJsonLines, writeJsonLines, ensureDir } from '../utils/file.js';
import { getCurrentDateString, getCurrentTimestamp } from '../utils/date.js';
import { logger } from '../utils/logger.js';
import { chunksIter } from '../utils/array.js';
import path from 'path';

export class Max3DCrawler {
  private readonly url = 'https://vietlott.vn/ajaxpro/Vietlott.PlugIn.WebParts.GameMax3DCompareWebPart,Vietlott.PlugIn.WebParts.ashx';
  private readonly config = max3dConfig;

  private createRequestBody(pageIndex: number): RequestMax3D {
    return {
      CheckMulti: 0,
      GameDrawId: '',
      GameId: '5',
      ORenderInfo: DEFAULT_ORENDER_INFO,
      PageIndex: pageIndex,
      number01: '123',
      number02: '321',
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

      // Parse table rows
      const rowRegex = /<tr>([\s\S]*?)<\/tr>/g;
      const rows = [];
      let match;

      while ((match = rowRegex.exec(html)) !== null) {
        rows.push(match[1]);
      }

      for (const rowHtml of rows) {
        const row: any = {};

        // Extract all divs
        const divRegex = /<div[^>]*>([\s\S]*?)<\/div>/g;
        const divs = [];
        let divMatch;

        while ((divMatch = divRegex.exec(rowHtml)) !== null) {
          divs.push(divMatch[1]);
        }

        if (divs.length === 0) continue;

        // Extract date from first div after "Ngày:"
        const dateMatch = divs[0].match(/Ngày:\s*(\d{2}\/\d{2}\/\d{4})/);
        if (!dateMatch) continue;

        const dateStr = dateMatch[1];
        const [day, month, year] = dateStr.split('/');
        row.date = `${year}-${month}-${day}`;

        // Extract tds
        const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/g;
        const tds = [];
        let tdMatch;

        while ((tdMatch = tdRegex.exec(rowHtml)) !== null) {
          tds.push(tdMatch[1]);
        }

        if (tds.length === 0) continue;

        // Extract ID from first td with <a>
        const aMatch = tds[0].match(/<a[^>]*>([^<]+)<\/a>/);
        if (!aMatch) continue;

        row.id = aMatch[1].trim();

        // Find the div with class "tong_day_so_ket_qua" containing all result numbers
        const resultDivMatch = rowHtml.match(/<div[^>]*class="tong_day_so_ket_qua"[^>]*>([\s\S]*?)<\/div>/);
        if (!resultDivMatch) continue;

        const resultHtml = resultDivMatch[1];

        // Extract all spans with class "bong_tron"
        const spanRegex = /<span[^>]*class="bong_tron"[^>]*>(\d+)<\/span>/g;
        const allSpans = [];
        let spanMatch;

        while ((spanMatch = spanRegex.exec(resultHtml)) !== null) {
          allSpans.push(spanMatch[1]);
        }

        // Define prizes and their counts
        const prizes = [
          { name: 'Giải Đặc biệt', count: 6 },
          { name: 'Giải Nhất', count: 12 },
          { name: 'Giải Nhì', count: 18 },
          { name: 'Giải ba', count: 24 },
        ];

        const prizeResults: Record<string, string[]> = {};
        let curIdx = 0;

        for (const prize of prizes) {
          const prizeNumbers = allSpans.slice(curIdx, curIdx + prize.count);
          // Group every 3 digits into a number
          prizeResults[prize.name] = chunksIter(prizeNumbers, 3).map(chunk => chunk.join(''));
          curIdx += prize.count;
        }

        row.result = prizeResults;
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

    logger.info(`Starting crawl for Max3D`);
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
