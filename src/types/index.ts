/**
 * Type definitions for Vietlott API requests and responses
 */

export interface ORenderInfo {
  SiteId: string;
  SiteAlias: string;
  UserSessionId: string;
  SiteLang: string;
  IsPageDesign: boolean;
  ExtraParam1: string;
  ExtraParam2: string;
  ExtraParam3: string;
  SiteURL: string;
  WebPage: string | null;
  SiteName: string;
  OrgPageAlias: string | null;
  PageAlias: string | null;
  RefKey: string | null;
  FullPageAlias: string | null;
}

export interface RequestPower645 {
  ORenderInfo: ORenderInfo;
  Key: string;
  GameDrawId: string;
  ArrayNumbers: string[][];
  CheckMulti: boolean;
  PageIndex: number;
}

export interface RequestPower655 {
  ORenderInfo: ORenderInfo;
  Key: string;
  GameDrawId: string;
  ArrayNumbers: string[][];
  CheckMulti: boolean;
  PageIndex: number;
}

export interface RequestPower535 {
  ORenderInfo: ORenderInfo;
  Key: string;
  GameDrawId: string;
  ArrayNumbers: string[][];
  CheckMulti: boolean;
  PageIndex: number;
}

export interface RequestKeno {
  DrawDate: string;
  GameDrawNo: string;
  GameId: string;
  ORenderInfo: ORenderInfo;
  OddEven: number;
  PageIndex: number;
  ProcessType: number;
  TotalRow: number;
  UpperLower: number;
  number: string;
}

export interface RequestMax3D {
  CheckMulti: number;
  GameDrawId: string;
  GameId: string;
  ORenderInfo: ORenderInfo;
  PageIndex: number;
  number01: string;
  number02: string;
}

export interface RequestMax3DPro {
  CheckMulti: number;
  GameDrawId: string;
  GameId: string;
  ORenderInfo: ORenderInfo;
  PageIndex: number;
  number01: string;
  number02: string;
}

export interface RequestBingo18 {
  ORenderInfo: ORenderInfo;
  GameId: string;
  GameDrawNo: string;
  number: string;
  DrawDate: string;
  PageIndex: number;
  TotalRow: number;
}

export interface LotteryResult {
  date: string;
  id: string;
  result: number[] | string[] | Record<string, string[]>;
  page: number;
  process_time: string;
  [key: string]: any; // Allow additional fields for specific products
}

export interface ProductConfig {
  name: string;
  rawPath: string;
  minValue: number;
  maxValue: number;
  sizeOutput: number;
  intervalDays: number;
  numThreads: number;
  useCookies: boolean;
  defaultIndexTo: number;
  pageSize: number;
}

export interface CrawlOptions {
  runDate?: string;
  indexFrom?: number;
  indexTo?: number;
}

export interface TaskData {
  params: Record<string, any>;
  body: Record<string, any>;
  runDateStr: string;
}

export interface Task {
  taskId: number;
  taskData: TaskData;
}
