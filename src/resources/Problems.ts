import cheerio, { Element } from 'cheerio';

import type { NzoiProblem, ResourceId } from '../types';

import Resource from './Resource';

function elementToString(element: Element) {
  let text: string = '';
  element.children.forEach((child) => {
    if (child.type === 'text') {
      // @ts-ignore
      text += child.data;
    } else if (child.type === 'tag') {
      // @ts-ignore
      text += elementToString(child);
    }
  });

  return text;
}

export default class Problems extends Resource {
  async retrieve(id: ResourceId) {
    const response = await this.http.request({
      method: 'GET',
      // The controller method for this endpoint has a comment indicating it can be read as xml,
      // but in reality it doesn't work so we need to parse the HTML :/ Maybe raise it with NZOI?
      path: `/problems/${id}`,
    });

    const $ = cheerio.load(response.data);

    // Janky statement parser; turns it into kinda-Markdown
    // TODO: Handle lists and other header types
    const statement: string[] = [];
    $('.statement')
      .children()
      .each((_index, element) => {
        if (element.type !== 'tag') return;

        switch (element.name) {
          case 'p':
            statement.push(`${elementToString(element)}\n`);
            break;

          case 'h3':
            statement.push(`### ${elementToString(element)}\n`);
            break;
        }
      });

    // Determine submission statistics
    let successfulSubmissions = 0;
    let failedSubmissions = 0;
    $('.progress_link').each((_index, element) => {
      if ($.text([element]).trim() === '100%') {
        successfulSubmissions++;
      } else {
        failedSubmissions++;
      }
    });

    const problem: NzoiProblem = {
      id: id.toString(),
      name: $('#main-page-title-box h1').text()!,
      statement: statement.join('\n'),

      limits: {
        memory: 0,
        time: 0,
      },
      submissions: {
        correct: successfulSubmissions,
        incorrect: failedSubmissions,
      },
    };
    return problem;
  }
}
