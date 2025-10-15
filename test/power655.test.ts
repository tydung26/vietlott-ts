/**
 * Test for Power 6/55 parseResult function
 * Run with: pnpm test test/power655.test.ts
 */

import { describe, it, expect } from 'vitest';
import { Power655Crawler } from '../src/crawler/power655.js';

const testResponse = {
  value: {
    HtmlContent:
      '                         <div class="doso_output_nd table-responsive"> \r\n                             <table class="table table-hover"> \r\n                                 <thead> \r\n                                     <tr> \r\n                                         <th>Ngày</th> \r\n                                         <th>Kỳ</th> \r\n                                         <th style="text-align:center">Bộ số</th> \r\n                                     </tr> \r\n                                 </thead> \r\n                                 <tbody> \r\n                                     <tr> \r\n                                         <td>25/09/2025</td> \r\n                                         <td><a href="/vi/trung-thuong/ket-qua-trung-thuong/655?id=01247&nocatche=1" target="_self">01247</a></td> \r\n                                         <td> \r\n                                                 <div class="day_so_ket_qua_v2" style="padding-top:15px"> \r\n                                                      <span class="bong_tron ">05</span><span class="bong_tron ">17</span><span class="bong_tron ">30</span><span class="bong_tron ">31</span><span class="bong_tron ">38</span><span class="bong_tron no-margin-right ">53</span> <span class="bong_tron-sperator">|</span><span class="bong_tron no-margin-right">08</span> \r\n                                                 </div><!-- /day_so_ket_qua --> \r\n                                         </td> \r\n                                     </tr> \r\n                                     <tr> \r\n                                         <td>23/09/2025</td> \r\n                                         <td><a href="/vi/trung-thuong/ket-qua-trung-thuong/655?id=01246&nocatche=1" target="_self">01246</a></td> \r\n                                         <td> \r\n                                                 <div class="day_so_ket_qua_v2" style="padding-top:15px"> \r\n                                                      <span class="bong_tron ">08</span><span class="bong_tron ">18</span><span class="bong_tron ">19</span><span class="bong_tron ">34</span><span class="bong_tron ">41</span><span class="bong_tron no-margin-right ">46</span> <span class="bong_tron-sperator">|</span><span class="bong_tron no-margin-right">38</span> \r\n                                                 </div><!-- /day_so_ket_qua --> \r\n                                         </td> \r\n                                     </tr> \r\n                                     <tr> \r\n                                         <td>20/09/2025</td> \r\n                                         <td><a href="/vi/trung-thuong/ket-qua-trung-thuong/655?id=01245&nocatche=1" target="_self">01245</a></td> \r\n                                         <td> \r\n                                                 <div class="day_so_ket_qua_v2" style="padding-top:15px"> \r\n                                                      <span class="bong_tron ">08</span><span class="bong_tron ">13</span><span class="bong_tron ">14</span><span class="bong_tron ">19</span><span class="bong_tron ">36</span><span class="bong_tron no-margin-right ">43</span> <span class="bong_tron-sperator">|</span><span class="bong_tron no-margin-right">30</span> \r\n                                                 </div><!-- /day_so_ket_qua --> \r\n                                         </td> \r\n                                     </tr> \r\n                                     <tr> \r\n                                         <td>18/09/2025</td> \r\n                                         <td><a href="/vi/trung-thuong/ket-qua-trung-thuong/655?id=01244&nocatche=1" target="_self">01244</a></td> \r\n                                         <td> \r\n                                                 <div class="day_so_ket_qua_v2" style="padding-top:15px"> \r\n                                                      <span class="bong_tron ">02</span><span class="bong_tron ">03</span><span class="bong_tron ">08</span><span class="bong_tron ">27</span><span class="bong_tron ">38</span><span class="bong_tron no-margin-right ">55</span> <span class="bong_tron-sperator">|</span><span class="bong_tron no-margin-right">20</span> \r\n                                                 </div><!-- /day_so_ket_qua --> \r\n                                         </td> \r\n                                     </tr> \r\n                                     <tr> \r\n                                         <td>16/09/2025</td> \r\n                                         <td><a href="/vi/trung-thuong/ket-qua-trung-thuong/655?id=01243&nocatche=1" target="_self">01243</a></td> \r\n                                         <td> \r\n                                                 <div class="day_so_ket_qua_v2" style="padding-top:15px"> \r\n                                                      <span class="bong_tron ">17</span><span class="bong_tron ">19</span><span class="bong_tron ">28</span><span class="bong_tron ">39</span><span class="bong_tron ">43</span><span class="bong_tron no-margin-right ">53</span> <span class="bong_tron-sperator">|</span><span class="bong_tron no-margin-right">33</span> \r\n                                                 </div><!-- /day_so_ket_qua --> \r\n                                         </td> \r\n                                     </tr> \r\n                                     <tr> \r\n                                         <td>13/09/2025</td> \r\n                                         <td><a href="/vi/trung-thuong/ket-qua-trung-thuong/655?id=01242&nocatche=1" target="_self">01242</a></td> \r\n                                         <td> \r\n                                                 <div class="day_so_ket_qua_v2" style="padding-top:15px"> \r\n                                                      <span class="bong_tron ">02</span><span class="bong_tron ">07</span><span class="bong_tron ">15</span><span class="bong_tron ">18</span><span class="bong_tron ">24</span><span class="bong_tron no-margin-right ">27</span> <span class="bong_tron-sperator">|</span><span class="bong_tron no-margin-right">45</span> \r\n                                                 </div><!-- /day_so_ket_qua --> \r\n                                         </td> \r\n                                     </tr> \r\n                                     <tr> \r\n                                         <td>11/09/2025</td> \r\n                                         <td><a href="/vi/trung-thuong/ket-qua-trung-thuong/655?id=01241&nocatche=1" target="_self">01241</a></td> \r\n                                         <td> \r\n                                                 <div class="day_so_ket_qua_v2" style="padding-top:15px"> \r\n                                                      <span class="bong_tron ">06</span><span class="bong_tron ">16</span><span class="bong_tron ">46</span><span class="bong_tron ">49</span><span class="bong_tron ">51</span><span class="bong_tron no-margin-right ">55</span> <span class="bong_tron-sperator">|</span><span class="bong_tron no-margin-right">42</span> \r\n                                                 </div><!-- /day_so_ket_qua --> \r\n                                         </td> \r\n                                     </tr> \r\n                                     <tr> \r\n                                         <td>09/09/2025</td> \r\n                                         <td><a href="/vi/trung-thuong/ket-qua-trung-thuong/655?id=01240&nocatche=1" target="_self">01240</a></td> \r\n                                         <td> \r\n                                                 <div class="day_so_ket_qua_v2" style="padding-top:15px"> \r\n                                                      <span class="bong_tron ">16</span><span class="bong_tron ">20</span><span class="bong_tron ">21</span><span class="bong_tron ">31</span><span class="bong_tron ">40</span><span class="bong_tron no-margin-right ">52</span> <span class="bong_tron-sperator">|</span><span class="bong_tron no-margin-right">02</span> \r\n                                                 </div><!-- /day_so_ket_qua --> \r\n                                         </td> \r\n                                     </tr> \r\n                                 </tbody> \r\n                             </table> \r\n                               <div class="thanh_dieu_huong text-center">\r\n<ul class="pagination">\r\n<li><a href="javascript:NextPage(0);">«</a></li><li><a href="javascript:NextPage(0);">1</a></li><li class="disabled active"><a href="javascript:NextPage(1);">2</a></li><li><a href="javascript:NextPage(2);">3</a></li><li><a href="javascript:NextPage(3);">4</a></li><li><a href="javascript:NextPage(4);">5</a></li><li><a href="javascript:NextPage(2);">»</a></li></ul>                               </div>\r\n                         </div><!-- /doso_output --> \r\n',
    InfoMessage: null,
    JsonData: '',
    Error: false,
    Target: '_self',
    SaveFile: null,
    RetNumber: 0,
    RetNumber1: 0,
    RetNumber2: 0,
    RetNumber3: 0,
    RetNumber4: 0,
    RetNumber5: 0,
    RetDecimal: 0,
    RetDecimal1: 0,
    RetDecimal2: 0,
    RetDecimal3: 0,
    RetDecimal4: 0,
    RetDecimal5: 0,
    RetExtraParam: null,
    RetExtraParam1: null,
    RetExtraParam2: null,
    RetExtraParam3: null,
    RetExtraParam4: null,
    RetExtraParam5: null,
    RetBoolean: false,
    RefKeyId: null,
    RetUrl: null,
    RetTarget: '_self',
    FocusControl: null,
    RetObject: null,
    RetObject1: null,
    RetObject2: null,
    RetObject3: null,
    RetObject4: null,
    RetObject5: null,
    RetBytes: null,
  },
};

describe('Power655Crawler', () => {
  describe('parseResult', () => {
    it('should parse 8 results from HTML response', () => {
      const crawler = new Power655Crawler();
      const results = crawler.parseResult(testResponse, 1);

      expect(results).toHaveLength(8);
    });

    it('should correctly parse draw ID 01247', () => {
      const crawler = new Power655Crawler();
      const results = crawler.parseResult(testResponse, 1);

      const result = results[0];
      expect(result).toBeDefined();
      expect(result.date).toBe('2025-09-25');
      expect(result.id).toBe('01247');
      expect(result.result).toEqual([5, 17, 30, 31, 38, 53, 8]);
      expect(result.page).toBe(1);
    });

    it('should correctly parse draw ID 01246', () => {
      const crawler = new Power655Crawler();
      const results = crawler.parseResult(testResponse, 1);

      const result = results[1];
      expect(result).toBeDefined();
      expect(result.date).toBe('2025-09-23');
      expect(result.id).toBe('01246');
      expect(result.result).toEqual([8, 18, 19, 34, 41, 46, 38]);
    });

    it('should correctly parse draw ID 01245', () => {
      const crawler = new Power655Crawler();
      const results = crawler.parseResult(testResponse, 1);

      const result = results[2];
      expect(result).toBeDefined();
      expect(result.date).toBe('2025-09-20');
      expect(result.id).toBe('01245');
      expect(result.result).toEqual([8, 13, 14, 19, 36, 43, 30]);
    });

    it('should correctly parse draw ID 01244', () => {
      const crawler = new Power655Crawler();
      const results = crawler.parseResult(testResponse, 1);

      const result = results[3];
      expect(result).toBeDefined();
      expect(result.date).toBe('2025-09-18');
      expect(result.id).toBe('01244');
      expect(result.result).toEqual([2, 3, 8, 27, 38, 55, 20]);
    });

    it('should correctly parse draw ID 01243', () => {
      const crawler = new Power655Crawler();
      const results = crawler.parseResult(testResponse, 1);

      const result = results[4];
      expect(result).toBeDefined();
      expect(result.date).toBe('2025-09-16');
      expect(result.id).toBe('01243');
      expect(result.result).toEqual([17, 19, 28, 39, 43, 53, 33]);
    });

    it('should correctly parse draw ID 01242', () => {
      const crawler = new Power655Crawler();
      const results = crawler.parseResult(testResponse, 1);

      const result = results[5];
      expect(result).toBeDefined();
      expect(result.date).toBe('2025-09-13');
      expect(result.id).toBe('01242');
      expect(result.result).toEqual([2, 7, 15, 18, 24, 27, 45]);
    });

    it('should correctly parse draw ID 01241', () => {
      const crawler = new Power655Crawler();
      const results = crawler.parseResult(testResponse, 1);

      const result = results[6];
      expect(result).toBeDefined();
      expect(result.date).toBe('2025-09-11');
      expect(result.id).toBe('01241');
      expect(result.result).toEqual([6, 16, 46, 49, 51, 55, 42]);
    });

    it('should correctly parse draw ID 01240', () => {
      const crawler = new Power655Crawler();
      const results = crawler.parseResult(testResponse, 1);

      const result = results[7];
      expect(result).toBeDefined();
      expect(result.date).toBe('2025-09-09');
      expect(result.id).toBe('01240');
      expect(result.result).toEqual([16, 20, 21, 31, 40, 52, 2]);
    });

    it('should parse exactly 7 numbers per result (6 main + 1 bonus)', () => {
      const crawler = new Power655Crawler();
      const results = crawler.parseResult(testResponse, 1);

      results.forEach((result) => {
        expect(result.result).toHaveLength(7);
      });
    });

    it('should convert DD/MM/YYYY dates to YYYY-MM-DD format', () => {
      const crawler = new Power655Crawler();
      const results = crawler.parseResult(testResponse, 1);

      results.forEach((result) => {
        expect(result.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });

    it('should handle IDs wrapped in anchor tags', () => {
      const crawler = new Power655Crawler();
      const results = crawler.parseResult(testResponse, 1);

      // All IDs should be 5-digit strings
      results.forEach((result) => {
        expect(result.id).toMatch(/^\d{5}$/);
      });
    });
  });
});
