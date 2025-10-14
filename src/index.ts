#!/usr/bin/env node

import { Power645Crawler } from './crawler/power645.js';
import { Power655Crawler } from './crawler/power655.js';
import { Power535Crawler } from './crawler/power535.js';
import { KenoCrawler } from './crawler/keno.js';
import { Max3DCrawler } from './crawler/max3d.js';
import { Max3DProCrawler } from './crawler/max3dpro.js';
import { Bingo18Crawler } from './crawler/bingo18.js';
import { logger } from './utils/logger.js';
import { getCurrentDateString } from './utils/date.js';

type ProductName = 'power_645' | 'power_655' | 'power_535' | 'keno' | '3d' | '3d_pro' | 'bingo18';

const CRAWLER_MAP = {
  power_645: Power645Crawler,
  power_655: Power655Crawler,
  power_535: Power535Crawler,
  keno: KenoCrawler,
  '3d': Max3DCrawler,
  '3d_pro': Max3DProCrawler,
  bingo18: Bingo18Crawler,
};

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options: {
    product?: ProductName;
    runDate?: string;
    indexFrom?: number;
    indexTo?: number;
    help?: boolean;
  } = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--product':
      case '-p':
        options.product = args[++i] as ProductName;
        break;
      case '--run-date':
        options.runDate = args[++i];
        break;
      case '--index-from':
        options.indexFrom = parseInt(args[++i], 10);
        break;
      case '--index-to':
        options.indexTo = parseInt(args[++i], 10);
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
      default:
        // If no flag, treat first argument as product name
        if (!options.product && !arg.startsWith('--')) {
          options.product = arg as ProductName;
        }
    }
  }

  return options;
}

/**
 * Print help message
 */
function printHelp() {
  console.log(`
Vietlott Crawler (TypeScript)

Usage: npm run crawl [PRODUCT] [OPTIONS]
   or: npm run dev [PRODUCT] [OPTIONS]

Products:
  power_645               Power 6/45 (default)
  power_655               Power 6/55
  power_535               Power 5/35
  keno                    Keno
  3d                      Max 3D
  3d_pro                  Max 3D Pro
  bingo18                 Bingo 18

Options:
  --product, -p <name>    Product to crawl (same as first positional argument)

  --run-date <date>       Specific date to crawl (YYYY-MM-DD format)
                          Default: current date in Asia/Ho_Chi_Minh timezone

  --index-from <number>   Starting page index (default: 0)

  --index-to <number>     Ending page index (default: product-specific)

  --help, -h              Show this help message

Environment Variables:
  LOG_LEVEL               Set log level: DEBUG, INFO, WARN, ERROR (default: INFO)

Examples:
  # Crawl Power 6/45 (default)
  npm run dev

  # Crawl Power 6/55
  npm run dev power_655

  # Crawl Keno with specific date
  npm run dev keno -- --run-date 2025-10-14

  # Crawl Max 3D with multiple pages
  npm run dev 3d -- --index-from 0 --index-to 5

  # Enable debug logging
  LOG_LEVEL=DEBUG npm run dev power_645
`);
}

/**
 * Main entry point
 */
async function main() {
  const options = parseArgs();

  if (options.help) {
    printHelp();
    process.exit(0);
  }

  const productName = options.product ?? 'power_645';

  if (!CRAWLER_MAP[productName]) {
    logger.error(`Unknown product: ${productName}`);
    logger.error(`Available products: ${Object.keys(CRAWLER_MAP).join(', ')}`);
    process.exit(1);
  }

  try {
    logger.info(`=== Vietlott ${productName} Crawler ===`);

    const CrawlerClass = CRAWLER_MAP[productName];
    const crawler = new CrawlerClass();

    await crawler.crawl({
      runDate: options.runDate ?? getCurrentDateString(),
      indexFrom: options.indexFrom,
      indexTo: options.indexTo,
    });

    logger.info('=== Crawl completed successfully ===');
  } catch (error) {
    logger.error(`Crawl failed: ${(error as Error).message}`);
    if ((error as Error).stack) {
      logger.error((error as Error).stack!);
    }
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  Power645Crawler,
  Power655Crawler,
  Power535Crawler,
  KenoCrawler,
  Max3DCrawler,
  Max3DProCrawler,
  Bingo18Crawler,
};
