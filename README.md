# Vietlott Data - TypeScript Implementation

TypeScript implementation for crawling Vietnamese lottery (Vietlott) data from the official API.

## Features

- Multi-product support: Power 6/45, Power 6/55, Power 5/35, Keno, Max 3D, Max 3D Pro, Bingo 18
- Uses native Node.js `fetch` API (no external HTTP library needed)
- Concurrent fetching with configurable thread count per product
- Automatic deduplication and data merging
- JSONL storage format for efficient data storage
- Timezone-aware date handling (Asia/Ho_Chi_Minh)
- Production-ready logging with [Pino](https://github.com/pinojs/pino) and pretty-printing in development

## Requirements

- Node.js 18+ (for native `fetch` API support)

## Installation

```bash
pnpm install
```

## Usage

### Development Mode (with tsx)

```bash
# Crawl default product (Power 6/45) latest page
pnpm dev

# Crawl specific product
pnpm dev power_655
pnpm dev keno
pnpm dev max3d
pnpm dev bingo18

# Crawl with specific date
pnpm dev -- --run-date 2025-10-14
pnpm dev power_645 -- --run-date 2025-10-14

# Crawl multiple pages
pnpm dev -- --index-from 0 --index-to 5
pnpm dev keno -- --index-from 0 --index-to 10

# Enable debug logging
LOG_LEVEL=DEBUG pnpm dev
```

### Production Mode

```bash
# Build TypeScript to JavaScript
pnpm build

# Run compiled code
pnpm crawl [product] [options]
```

## Command Line Options

```
[product]               Product name (power_645, power_655, power_535, keno, max3d, max3dpro, bingo18)
                        Can also be specified with --product flag
                        Default: power_645

--run-date <date>       Specific date to crawl (YYYY-MM-DD format)
                        Default: current date in Asia/Ho_Chi_Minh timezone

--index-from <number>   Starting page index (default: 0)

--index-to <number>     Ending page index (default: 1)

--help, -h              Show help message
```

## Environment Variables

- `LOG_LEVEL`: Set log level (`trace`, `debug`, `info`, `warn`, `error`, `fatal`). Default: `info`
- `NODE_ENV`: When set to `production`, logs are output in JSON format. Otherwise, pretty-printed with colors
- `NO_PRETTY_LOGS`: Set to disable pretty-printing even in non-production environments

## Supported Lottery Products

| Product | Code | Numbers | Output Size |
|---------|------|---------|-------------|
| Power 6/45 | `power_645` | 1-45 | 6 numbers |
| Power 6/55 | `power_655` | 1-55 | 6 numbers |
| Power 5/35 | `power_535` | 1-35 | 5 numbers |
| Keno | `keno` | 1-80 | 20 numbers |
| Max 3D | `max3d` | 0-9 | 3 digits |
| Max 3D Pro | `max3dpro` | 0-9 | 6 digits |
| Bingo 18 | `bingo18` | 1-45 | 18 numbers |

## Project Structure

```
vietlott-ts/
├── src/
│   ├── config/              # Configuration files
│   │   ├── products.ts      # Product configurations for all lottery types
│   │   └── request.ts       # HTTP headers and API constants
│   ├── crawler/             # Crawler implementations
│   │   ├── fetcher.ts       # HTTP fetching utilities with concurrency
│   │   ├── power645.ts      # Power 6/45 crawler
│   │   ├── power655.ts      # Power 6/55 crawler
│   │   ├── power535.ts      # Power 5/35 crawler
│   │   ├── keno.ts          # Keno crawler
│   │   ├── max3d.ts         # Max 3D crawler
│   │   ├── max3dpro.ts      # Max 3D Pro crawler
│   │   └── bingo18.ts       # Bingo 18 crawler
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts         # All type definitions
│   ├── utils/               # Utility functions
│   │   ├── array.ts         # Array manipulation utilities
│   │   ├── date.ts          # Date/time utilities with timezone
│   │   ├── file.ts          # File I/O utilities (JSONL operations)
│   │   └── logger.ts        # Logging utilities
│   └── index.ts             # Main entry point and CLI parser
├── data/                    # Data storage directory
│   ├── power645.jsonl       # Power 6/45 results
│   ├── power655.jsonl       # Power 6/55 results
│   ├── keno.jsonl           # Keno results
│   └── ...                  # Other product data files
├── dist/                    # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
├── CLAUDE.md                # Project guidance for Claude Code
└── README.md
```

## Data Format

Data is stored in JSONL (JSON Lines) format at `data/<product>.jsonl`:

```json
{"date":"2017-10-25","id":"00198","result":[12,17,23,25,34,38],"page":99,"process_time":"2023-01-30 14:08:46.805928"}
```

Each line is a JSON object with:
- `date`: Draw date (YYYY-MM-DD)
- `id`: Draw ID
- `result`: Array of winning numbers (format varies by product)
- `page`: Page number from API
- `process_time`: Processing timestamp

## Development

### Linting

```bash
pnpm lint
```

### Formatting

```bash
pnpm format
```

## Architecture

### Core Concepts

1. **Product-based Architecture**: Each lottery product has its own crawler class that extends a common pattern. All crawlers follow the same lifecycle: create tasks → fetch data → parse results → merge with existing data → save to JSONL.

2. **Concurrent Fetching**: Uses batched Promise.all with configurable concurrency (`numThreads` in product config) to fetch multiple pages in parallel without overwhelming the API.

3. **Data Deduplication**: Before saving, the crawler loads existing data from JSONL, identifies new records by unique ID, merges them, sorts by date/ID, and writes back to maintain a clean dataset.

4. **Timezone Handling**: All dates use Asia/Ho_Chi_Minh timezone to match the lottery draw schedule.

### Adding New Products

To add a new lottery product:

1. Create a new crawler class in `src/crawler/` extending the standard pattern
2. Add product configuration in `src/config/products.ts`
3. Register the crawler in `CRAWLER_MAP` in `src/index.ts`
4. Add corresponding TypeScript types in `src/types/index.ts`

## Notes

- This codebase uses ES Modules (`.js` extensions in imports despite TypeScript source)
- HTML parsing patterns in crawler `parseResult()` methods may need adjustment if Vietlott changes their HTML structure
- Each product has its own data file to maintain separation and optimize file sizes
- Concurrent fetching is controlled by `numThreads` in the product configuration

## License

MIT
