import cheerio from 'cheerio';

import type { NzoiProblem, ResourceId } from '../types';

import * as problemUtils from '../lib/problemUtils';

import Resource from './Resource';

export default class Problems extends Resource {
  async retrieve(id: ResourceId) {
    const response = await this.http.request({
      method: 'GET',
      // The controller method for this endpoint has a comment indicating it can be read as xml,
      // but in reality it doesn't work so we need to parse the HTML :/ Maybe raise it with NZOI?
      path: `/problems/${id}`,
    });

    const $ = cheerio.load(response.data);

    const problem: NzoiProblem = {
      id: id.toString(),
      name: $('#main-page-title-box h1').text()!,
      statement: problemUtils.serializeStatement($),
      url: this.http.makeUrl(`/problems/${id}`),

      limits: problemUtils.parseProblemLimits($),
      stats: problemUtils.parseProblemStats($),
    };
    return problem;
  }
}
