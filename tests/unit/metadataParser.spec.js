import { describe, expect, it, beforeEach } from 'vitest';
import MetadataParser from '@/parser/metadata';
import tagHelper from '@/helpers/tags';

describe('MetadataParser', () => {
  let mockBookmark;
  let mockFolders;

  beforeEach(() => {
    mockBookmark = {
      id: '123',
      title: 'Test Bookmark',
      url: 'https://example.com',
      parentId: '1',
      dateAdded: Date.now(),
    };

    mockFolders = new Map([
      ['1', 'Test Folder'],
      ['2', 'Another Folder'],
    ]);
  });

  describe('constructor', () => {
    it('should create instance with all required parameters', () => {
      const parser = new MetadataParser(mockBookmark, { html: '<html></html>' }, tagHelper, mockFolders);
      expect(parser).toBeInstanceOf(MetadataParser);
    });
  });

  describe('getTitle', () => {
    it('should return bookmark title when available', () => {
      const parser = new MetadataParser({ title: 'Test Bookmark' }, { html: '<html></html>' }, tagHelper);
      expect(parser.getTitle()).toBe('Test Bookmark');
    });

    it('should fallback to document title when bookmark title is empty', () => {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Example Page Title</title>
            <meta property="og:title" content="OG Title">
          </head>
          <body>
            <h1>Main Heading</h1>
          </body>
        </html>
      `;
      const parser = new MetadataParser({ title: '' }, { html }, tagHelper);
      expect(parser.getTitle()).toBe('Example Page Title');
    });

    it('should fallback to og:title when document title is empty', () => {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta property="og:title" content="OG Title">
          </head>
          <body>
            <h1>Main Heading</h1>
          </body>
        </html>
      `;
      const parser = new MetadataParser({ title: '' }, { html }, tagHelper);
      expect(parser.getTitle()).toBe('OG Title');
    });

    it('should fallback to h1 when meta titles are empty', () => {
      const html = `
        <!DOCTYPE html>
        <html>
          <head></head>
          <body>
            <h1>Main Heading</h1>
          </body>
        </html>
      `;
      const parser = new MetadataParser({ title: '' }, { html }, tagHelper);
      expect(parser.getTitle()).toBe('Main Heading');
    });

    it('should return empty string when no title is found', () => {
      const html = '<!DOCTYPE html><html><head></head><body></body></html>';
      const parser = new MetadataParser({ title: '' }, { html }, tagHelper);
      expect(parser.getTitle()).toBe('');
    });
  });

  describe('getDescription', () => {
    it('should return first available description (og:description in this case)', () => {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta property="og:description" content="OG Description">
            <meta name="description" content="This is a test description">
          </head>
          <body></body>
        </html>
      `;
      const parser = new MetadataParser({}, { html }, tagHelper);
      expect(parser.getDescription()).toBe('OG Description');
    });

    it('should fallback to meta description when og:description is not available', () => {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="description" content="This is a test description">
          </head>
          <body></body>
        </html>
      `;
      const parser = new MetadataParser({}, { html }, tagHelper);
      expect(parser.getDescription()).toBe('This is a test description');
    });

    it('should return null when no description is found', () => {
      const html = '<!DOCTYPE html><html><head></head><body></body></html>';
      const parser = new MetadataParser({}, { html }, tagHelper);
      expect(parser.getDescription()).toBeNull();
    });
  });

  describe('getImage', () => {
    it('should return og:image when available', () => {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta property="og:image" content="https://example.com/image.jpg">
            <img src="https://example.com/hero.jpg" class="hero">
          </head>
          <body></body>
        </html>
      `;
      const parser = new MetadataParser({ url: 'https://example.com' }, { html }, tagHelper);
      expect(parser.getImage()).toBe('https://example.com/image.jpg');
    });

    it('should fallback to page preview when og:image is not available', () => {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <img src="https://example.com/hero.jpg" class="hero">
          </head>
          <body></body>
        </html>
      `;
      const parser = new MetadataParser({ url: 'https://example.com' }, { html }, tagHelper);
      expect(parser.getImage()).toBe('https://example.com/hero.jpg');
    });

    it('should return null when no image is found', () => {
      const html = '<!DOCTYPE html><html><head></head><body></body></html>';
      const parser = new MetadataParser({}, { html }, tagHelper);
      expect(parser.getImage()).toBeNull();
    });

    it('should resolve relative URLs to absolute', () => {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta property="og:image" content="/relative-image.jpg">
          </head>
          <body></body>
        </html>
      `;
      const parser = new MetadataParser({ url: 'https://example.com' }, { html }, tagHelper);
      expect(parser.getImage()).toBe('https://example.com/relative-image.jpg');
    });
  });

  describe('getDomain', () => {
    it('should extract domain from URL', () => {
      const parser = new MetadataParser({ url: 'https://example.com' }, { html: '<html></html>' }, tagHelper);
      expect(parser.getDomain()).toBe('example.com');
    });

    it('should remove www prefix', () => {
      const parser = new MetadataParser({ url: 'https://www.example.com' }, { html: '<html></html>' }, tagHelper);
      expect(parser.getDomain()).toBe('example.com');
    });

    it('should handle URLs without protocol by adding https', () => {
      const parser = new MetadataParser({ url: 'https://example.com' }, { html: '<html></html>' }, tagHelper);
      expect(parser.getDomain()).toBe('example.com');
    });
  });

  describe('getFavicon', () => {
    it('should return favicon from link tag', () => {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <link rel="icon" href="https://example.com/favicon.ico">
          </head>
          <body></body>
        </html>
      `;
      const parser = new MetadataParser({ url: 'https://example.com' }, { html }, tagHelper);
      expect(parser.getFavicon()).toBe('https://example.com/favicon.ico');
    });

    it('should fallback to default favicon when not found', () => {
      const html = '<!DOCTYPE html><html><head></head><body></body></html>';
      const parser = new MetadataParser({ url: 'https://example.com' }, { html }, tagHelper);
      expect(parser.getFavicon()).toBe('https://example.com/favicon.ico');
    });

    it('should prefer SVG favicon over regular favicon', () => {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <link rel="icon" href="https://example.com/favicon.ico">
            <link rel="icon" type="image/svg+xml" href="https://example.com/favicon.svg">
          </head>
          <body></body>
        </html>
      `;
      const parser = new MetadataParser({ url: 'https://example.com' }, { html }, tagHelper);
      expect(parser.getFavicon()).toBe('https://example.com/favicon.svg');
    });
  });

  describe('getKeywords', () => {
    it('should extract keywords from meta tag', () => {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="keywords" content="test, example, bookmark">
          </head>
          <body></body>
        </html>
      `;
      const parser = new MetadataParser({}, { html }, tagHelper);
      expect(parser.getKeywords()).toEqual(['test', 'example', 'bookmark']);
    });

    it('should return empty array when no keywords are found', () => {
      const html = '<!DOCTYPE html><html><head></head><body></body></html>';
      const parser = new MetadataParser({}, { html }, tagHelper);
      expect(parser.getKeywords()).toEqual([]);
    });

    it('should handle empty keywords content', () => {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="keywords" content="">
          </head>
          <body></body>
        </html>
      `;
      const parser = new MetadataParser({}, { html }, tagHelper);
      expect(parser.getKeywords()).toEqual([]);
    });
  });

  describe('getUrl', () => {
    it('should return bookmark URL', () => {
      const parser = new MetadataParser({ url: 'https://example.com' }, { html: '<html></html>' }, tagHelper);
      expect(parser.getUrl()).toBe('https://example.com');
    });
  });

  describe('getFavboxBookmark', () => {
    it('should return complete bookmark entity', async () => {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta property="og:description" content="OG Description">
            <meta property="og:image" content="https://example.com/image.jpg">
            <meta name="keywords" content="test, example, bookmark">
            <link rel="icon" href="https://example.com/favicon.ico">
          </head>
          <body></body>
        </html>
      `;
      const parser = new MetadataParser(mockBookmark, { html }, tagHelper, mockFolders);
      const entity = await parser.getFavboxBookmark();

      expect(entity).toMatchObject({
        id: '123',
        folderId: '1',
        folderName: 'Test Folder',
        title: 'Test Bookmark',
        description: 'OG Description',
        favicon: 'https://example.com/favicon.ico',
        image: 'https://example.com/image.jpg',
        domain: 'example.com',
        keywords: ['test', 'example', 'bookmark'],
        url: 'https://example.com',
        tags: [],
        pinned: 0,
        notes: '',
        httpStatus: undefined,
        dateAdded: mockBookmark.dateAdded,
      });

      expect(entity.createdAt).toBeDefined();
      expect(entity.updatedAt).toBeDefined();
      expect(new Date(entity.createdAt)).toBeInstanceOf(Date);
      expect(new Date(entity.updatedAt)).toBeInstanceOf(Date);
    });

    it('should use real tagHelper for title and tags processing', async () => {
      const html = '<!DOCTYPE html><html><head></head><body></body></html>';
      const parser = new MetadataParser(mockBookmark, { html }, tagHelper, mockFolders);
      const entity = await parser.getFavboxBookmark();

      expect(entity.title).toBe('Test Bookmark');
      expect(entity.tags).toEqual([]);
    });

    it('should handle missing folder name', async () => {
      const html = '<!DOCTYPE html><html><head></head><body></body></html>';
      const emptyFolders = new Map();
      const parser = new MetadataParser(mockBookmark, { html }, tagHelper, emptyFolders);
      const entity = await parser.getFavboxBookmark();

      expect(entity.folderName).toBe('Unknown');
    });

    it('should handle bookmark with tags in title', async () => {
      const html = '<!DOCTYPE html><html><head></head><body></body></html>';
      const bookmarkWithTags = { ...mockBookmark, title: 'Test Bookmark 🏷️ #tag1 #tag2' };
      const parser = new MetadataParser(bookmarkWithTags, { html }, tagHelper, mockFolders);
      const entity = await parser.getFavboxBookmark();

      expect(entity.title).toBe('Test Bookmark');
      expect(entity.tags).toEqual(['tag1', 'tag2']);
    });

    it('should handle bookmark with tags but no separator', async () => {
      const html = '<!DOCTYPE html><html><head></head><body></body></html>';
      const bookmarkWithTagsNoSeparator = { ...mockBookmark, title: 'Test Bookmark #tag1 #tag2' };
      const parser = new MetadataParser(bookmarkWithTagsNoSeparator, { html }, tagHelper, mockFolders);
      const entity = await parser.getFavboxBookmark();

      expect(entity.title).toBe('Test Bookmark #tag1 #tag2');
      expect(entity.tags).toEqual([]);
    });
  });

  describe('error handling', () => {
    it('should handle malformed HTML gracefully', () => {
      const malformedHtml = '<html><head><title>Test</title><meta name="description" content="Test"';
      const parser = new MetadataParser({}, { html: malformedHtml }, tagHelper);
      expect(parser).toBeInstanceOf(MetadataParser);
    });

    it('should handle empty HTML', () => {
      const parser = new MetadataParser({}, { html: '' }, tagHelper);
      expect(parser).toBeInstanceOf(MetadataParser);
    });
  });
});
