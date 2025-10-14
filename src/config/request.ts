import { ORenderInfo } from '../types/index.js';

export const DEFAULT_ORENDER_INFO: ORenderInfo = {
  SiteId: 'main.frontend.vi',
  SiteAlias: 'main.vi',
  UserSessionId: '',
  SiteLang: 'vi',
  IsPageDesign: false,
  ExtraParam1: '',
  ExtraParam2: '',
  ExtraParam3: '',
  SiteURL: '',
  WebPage: null,
  SiteName: 'Vietlott',
  OrgPageAlias: null,
  PageAlias: null,
  RefKey: null,
  FullPageAlias: null,
};

export const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:128.0) Gecko/20100101 Firefox/128.0',
  'Accept': '*/*',
  'Accept-Language': 'en-US,en;q=0.5',
  'Content-Type': 'text/plain; charset=utf-8',
  'X-AjaxPro-Method': 'ServerSideDrawResult',
  'X-Requested-With': 'XMLHttpRequest',
  'Origin': 'https://vietlott.vn',
  'Connection': 'keep-alive',
  'Referer': 'https://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong/winning-number-645',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
};

export const TIMEOUT = 20000; // milliseconds
