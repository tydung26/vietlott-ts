# Vietlott Data - TypeScript Implementation

TypeScript implementation of the Power 6/45 lottery data crawler.

## Features

- TypeScript-based crawler for Power 6/45 lottery data
- Uses native Node.js `fetch` API (no external HTTP library needed)
- Concurrent fetching with configurable thread count
- Automatic deduplication and data merging
- JSONL storage format (compatible with Python version)
- Timezone-aware date handling (Asia/Ho_Chi_Minh)
- Comprehensive logging system

## Requirements

- Node.js 18+ (for native `fetch` API support)

## Installation

```bash
cd src-js
npm install
```

## Usage

### Development Mode (with tsx)

```bash
# Crawl latest page
npm run dev

# Crawl specific date
npm run dev -- --run-date 2025-10-14

# Crawl multiple pages
npm run dev -- --index-from 0 --index-to 5

# Enable debug logging
LOG_LEVEL=DEBUG npm run dev
```

### Production Mode

```bash
# Build TypeScript to JavaScript
npm run build

# Run compiled code
npm run crawl
```

## Command Line Options

```
--run-date <date>       Specific date to crawl (YYYY-MM-DD format)
                        Default: current date in Asia/Ho_Chi_Minh timezone

--index-from <number>   Starting page index (default: 0)

--index-to <number>     Ending page index (default: 1)

--help, -h              Show help message
```

## Environment Variables

- `LOG_LEVEL`: Set log level (`DEBUG`, `INFO`, `WARN`, `ERROR`). Default: `INFO`

## Project Structure

```
src-js/
├── src/
│   ├── config/          # Configuration files
│   │   ├── products.ts  # Product configurations
│   │   └── request.ts   # HTTP headers and constants
│   ├── crawler/         # Crawler implementations
│   │   ├── fetcher.ts   # HTTP fetching utilities
│   │   └── power645.ts  # Power 6/45 crawler
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/           # Utility functions
│   │   ├── date.ts      # Date/time utilities
│   │   ├── file.ts      # File I/O utilities
│   │   └── logger.ts    # Logging utilities
│   └── index.ts         # Main entry point
├── dist/                # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Data Format

Data is stored in JSONL (JSON Lines) format at `../data/power645.jsonl`:

```json
{"date":"2017-10-25","id":"00198","result":[12,17,23,25,34,38],"page":99,"process_time":"2023-01-30 14:08:46.805928"}
```

Each line is a JSON object with:
- `date`: Draw date (YYYY-MM-DD)
- `id`: Draw ID
- `result`: Array of winning numbers
- `page`: Page number from API
- `process_time`: Processing timestamp

## Development

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

## Notes

- The TypeScript implementation is compatible with the Python version's data format
- Both implementations can read/write to the same JSONL data files
- The parser in `power645.ts` may need adjustment based on actual API response format
- Concurrent fetching is controlled by `numThreads` in the product configuration

## Architecture Comparison with Python

| Aspect | Python | TypeScript |
|--------|--------|------------|
| Language | Python 3.11+ | TypeScript/Node.js 18+ |
| HTTP Client | requests | Native fetch API |
| Concurrency | ThreadPoolExecutor | Promise.all with batching |
| Date/Time | pendulum | date-fns + date-fns-tz |
| Logging | loguru | Custom logger |
| CLI | click | Native argument parsing |
| Data Serialization | cattrs | Native JSON |

## License

MIT
