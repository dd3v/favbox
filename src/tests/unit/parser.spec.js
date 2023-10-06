import { describe, expect, it } from 'vitest';
import Parser from '@/helpers/parser';

const fs = require('fs');
const path = require('path');

describe('Parser Tests', () => {
  it('Test case 1. Default test case', async () => {
    const filePath = path.join(__dirname, './testdata/case_1.html');
    const file = await fs.readFileSync(filePath);
    const response = {
      html: file.toString(),
      bookmark: {
        title: 'examples/screenshot/main.go at master · chromedp/examples',
        url: 'https://github.com/chromedp/examples/blob/master/screenshot/main.go#L42',
      },
      hasError: 0,
    };
    const parser = new Parser(response);
    expect(parser.getTitle()).toBe('examples/screenshot/main.go at master · chromedp/examples');
    expect(parser.getDescription()).toBe('chromedp code examples. Contribute to chromedp/examples development by creating an account on GitHub.');
    expect(await parser.getFavicon()).toBe('https://github.githubassets.com/favicons/favicon.svg');
    expect(parser.getDomain()).toBe('github.com');
    expect(parser.getImage()).toBe('https://opengraph.githubassets.com/43afb82228294a6b45d9c10e0b8dd42890be6069e81c0262c861b7c1f5b30d91/chromedp/examples');
  });

  it('Test case 2: When there are no images', async () => {
    const filePath = path.join(__dirname, './testdata/case_2.html');
    const file = await fs.readFileSync(filePath);
    const response = {
      html: file.toString(),
      bookmark: {
        title: 'Advanced Encoding and Decoding Techniques in Go',
        url: 'https://blog.gopheracademy.com/advent-2016/advanced-encoding-decoding/',
      },
      hasError: 0,
    };
    const parser = new Parser(response);
    expect(parser.getTitle()).toBe('Advanced Encoding and Decoding Techniques in Go');
    expect(parser.getDescription()).toBe('Advanced Encoding and Decoding Techniques Go’s standard library comes packed with some great encoding and decoding packages covering a wide array of encoding schemes. Everything from CSV, XML, JSON, and even gob - a Go specific encoding format - is covered, and all of these packages are incredibly easy to get started with.');
    expect(await parser.getFavicon()).toBe(null);
    expect(parser.getDomain()).toBe('blog.gopheracademy.com');
    expect(parser.getImage()).toBe(null);
  });

  it('Test case 3: When favicon path is relative', async () => {
    const filePath = path.join(__dirname, './testdata/case_3.html');
    const file = await fs.readFileSync(filePath);
    const response = {
      html: file.toString(),
      bookmark: {
        title: 'Backend from the Beginning, part 3: Databases, Dependency Injection, Middleware, and Routing',
        url: 'https://eblog.fly.dev/backendbasics3.html',
      },
      hasError: 0,
    };
    const parser = new Parser(response);
    expect(parser.getTitle()).toBe('Backend from the Beginning, part 3: Databases, Dependency Injection, Middleware, and Routing');
    expect(parser.getDescription()).toBe(null);
    expect(await parser.getFavicon()).toBe('https://eblog.fly.dev/favicon.ico');
    expect(parser.getDomain()).toBe('eblog.fly.dev');
    expect(parser.getImage()).toBe(null);
  });
});
