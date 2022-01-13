import type { CheerioAPI, Element, Node } from 'cheerio';

import type { NzoiProblemLimits, NzoiProblemStatistics } from '../types';

export const parseProblemLimits = (cheerio: CheerioAPI): NzoiProblemLimits => {
  const filterTags = ['div', 'ul', 'br'];

  let root: Node | null = cheerio('#main-container').children().toArray()[0];
  let text = '';

  const isSkip = (el: any) => !!el && el.type === 'tag' && filterTags.includes(el.name);
  const isTerminal = (el: any) => !!el && el.type === 'tag' && el.name === 'ul';
  const isText = (el: any): el is Text => !!el && el.type === 'text';

  while (root && !isTerminal(root)) {
    if (isSkip(root)) {
      // Do nothing
      root = root.next;
      continue;
    }

    if (isText(root)) {
      text += root.data;
    } else {
      text += cheerio.text([root]);
    }

    root = root.next;
  }

  const memoryString = text.match(/Memory limit: (\d+) (.*)\n/);
  const timeString = text.match(/Time limit: ((\d*\.)?\d+)/);

  const timeLimitSeconds =
    timeString && timeString.length == 3 ? Number.parseFloat(timeString[1]) : -1;

  return {
    time: timeLimitSeconds,
    memory: getMemoryLimitBytes(),
  };

  function getMemoryLimitBytes() {
    const units = new Map<string, number>([
      ['byte', 1],
      ['bytes', 1],
      ['kilobyte', 1_024],
      ['kilobytes', 1_024],
      ['megabyte', 1_024 ** 2],
      ['megabytes', 1_024 ** 2],
    ]);

    if (!memoryString || memoryString.length !== 3 || !units.has(memoryString[2])) {
      return -1;
    }

    const limit = Number.parseFloat(memoryString[1]) * units.get(memoryString[2])!;
    return Number.isNaN(limit) ? -1 : limit;
  }
};

export const parseProblemStats = (cheerio: CheerioAPI): NzoiProblemStatistics => {
  let correct = 0;
  let incorrect = 0;

  cheerio('.progress_link').each((_index, element) => {
    const text = cheerio.text([element]).trim();
    if (text === '100%') {
      correct++;
    } else {
      incorrect++;
    }
  });

  return {
    correct,
    incorrect,
    total: correct + incorrect,
  };
};

// Janky statement parser; turns it into kinda-Markdown
// TODO: Handle lists and other header types
export const serializeStatement = (cheerio: CheerioAPI) => {
  const statement: string[] = [];
  cheerio('.statement')
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

  return statement.join('\n');

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
};
