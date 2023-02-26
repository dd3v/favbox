import { describe, expect, it } from 'vitest';

import { parseHTML } from 'linkedom';
import Parser from '@/libs/parser';
import cases from './cases.json';

describe('Test cases for DOM parsing', () => {
  [...cases].forEach(({ title, input, output }) => {
    it(`${title}`, () => {
      const { document } = parseHTML(input.text);
      const parser = new Parser(input.url, document);
      expect(parser.getTitle()).toBe(output.title);
      expect(parser.getDescription()).toBe(output.description);
      expect(parser.getFavicon()).toBe(output.favicon);
      expect(parser.getDomain()).toBe(output.domain);
    });
  });
});
