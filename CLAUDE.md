# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript-based crawler for Vietnamese lottery (Vietlott) data. It fetches historical lottery results from the official Vietlott API and stores them in JSONL format. The project supports multiple lottery products: Power 6/45, Power 6/55, Power 5/35, Keno, Max 3D, Max 3D Pro, and Bingo 18.

## Common Commands

### Development
```bash
# Run in development mode with hot reload
pnpm dev

# Run specific product
pnpm dev power_655
pnpm dev keno

# Run with options (note the -- separator)
pnpm dev -- --run-date 2025-10-14
pnpm dev -- --index-from 0 --index-to 5
pnpm dev power_645 -- --run-date 2025-10-14

# Enable debug logging
LOG_LEVEL=debug pnpm dev
```

### Building and Running
```bash
# Build TypeScript to JavaScript
pnpm build

# Run compiled code
pnpm crawl
```

### Code Quality
```bash
# Lint TypeScript files
pnpm lint

# Format code with Prettier
pnpm format
```

## Architecture

### Core Concepts

1. **Product-based Architecture**: Each lottery product has its own crawler class that extends a common pattern. All crawlers follow the same lifecycle: create tasks → fetch data → parse results → merge with existing data → save to JSONL.

2. **Concurrent Fetching**: Uses batched Promise.all with configurable concurrency (`numThreads` in product config) to fetch multiple pages in parallel without overwhelming the API.

3. **Data Deduplication**: Before saving, the crawler loads existing data from JSONL, identifies new records by unique ID, merges them, sorts by date/ID, and writes back to maintain a clean dataset.

4. **Timezone Handling**: All dates use Asia/Ho_Chi_Minh timezone (date-fns-tz) to match the lottery draw schedule.

### Key Components

**Product Configuration** ([src/config/products.ts](src/config/products.ts))
- Centralized config for all lottery products
- Defines: data file path, number ranges, output size, interval days, thread count, page size
- Data files stored in `data/` directory in project root

**Crawler Classes** ([src/crawler/](src/crawler/))
- Each product has its own crawler (e.g., Power645Crawler, KenoCrawler)
- Pattern: `createRequestBody()` → `parseResult()` → `crawl()`
- `createRequestBody()`: Builds API request payload with product-specific structure
- `parseResult()`: Parses HTML response to extract lottery numbers
- `crawl()`: Orchestrates the entire fetch-parse-save pipeline

**Fetcher** ([src/crawler/fetcher.ts](src/crawler/fetcher.ts))
- Handles HTTP communication using native Node.js `fetch` API
- `fetchData()`: Fetches single task with timeout and error handling
- `fetchTasks()`: Batches multiple tasks with controlled concurrency
- Uses AbortController for request timeouts (default 120s)

**Type System** ([src/types/index.ts](src/types/index.ts))
- `RequestPower645`, `RequestKeno`, etc.: API request payloads for each product
- `LotteryResult`: Standard result format with date, id, result array, page, process_time
- `ProductConfig`: Configuration schema for lottery products
- `CrawlOptions`: Command-line options for crawl operations

**Entry Point** ([src/index.ts](src/index.ts))
- Maps product names to crawler classes in `CRAWLER_MAP`
- Parses CLI arguments: `--product`, `--run-date`, `--index-from`, `--index-to`
- Product name can be passed as first positional argument OR via `--product` flag

**Logger** ([src/utils/logger.ts](src/utils/logger.ts))
- Uses Pino for high-performance logging
- Automatically enables pretty-printing in development (colorized output with timestamps)
- JSON output in production for machine parsing
- Log levels: trace, debug, info, warn, error, fatal
- Controlled via `LOG_LEVEL` environment variable (default: info)

### Data Flow

1. User runs `pnpm dev [product] -- [options]`
2. CLI parser extracts product name and options
3. Appropriate crawler instance is created from `CRAWLER_MAP`
4. Crawler generates tasks (one per page index)
5. Fetcher processes tasks in batches with controlled concurrency
6. Parser extracts lottery data from HTML responses
7. Results are deduplicated against existing JSONL data
8. Merged data is sorted and written back to JSONL file

### File Storage

- Data files: `data/power645.jsonl`, `data/keno.jsonl`, etc.
- Format: Each line is a complete JSON object (JSONL format)
- Compatible with Python version of this crawler
- Automatic deduplication by lottery draw ID

## Important Notes

- This codebase uses ES Modules (`.js` extensions in imports despite TypeScript source)
- Native Node.js fetch API requires Node.js 18+
- When adding new lottery products, create crawler class + config + add to CRAWLER_MAP
- HTML parsing patterns in `parseResult()` methods are fragile and may break if Vietlott changes their HTML structure
- The project references a Python version that shares the same data format (see README for comparison table)
