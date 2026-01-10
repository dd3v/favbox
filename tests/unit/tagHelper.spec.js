import { describe, expect, it } from 'vitest';
import { joinTitleAndTags, extractTags, extractTitle } from '@/services/tags';

describe('TagHelper', () => {
  it('should return title when tags array is empty', () => {
    const title = 'Hello world';
    expect(joinTitleAndTags(title, [])).toEqual(title);
  });

  it('should return title with tags', () => {
    expect(joinTitleAndTags('Test', ['tag1'])).toEqual(
      `Test ${String.fromCodePoint(0x1f3f7)} #tag1`,
    );
  });

  it('should extract tags from string', () => {
    const string = `🧪 PhpStorm Tips & Tricks ${String.fromCodePoint(
      0x1f3f7,
    )} #php #test`;
    expect(extractTags(string)).toEqual(['php', 'test']);
  });

  it('should return empty array if string does not contain separator', () => {
    const string = '🧪 PhpStorm Tips & Tricks #php #test';
    expect(extractTags(string)).toEqual([]);
  });

  it('should return title without tags', () => {
    const string = `Some bookmark title ${String.fromCodePoint(
      0x1f3f7,
    )} #php #js`;
    expect(extractTitle(string)).toEqual('Some bookmark title');
  });

  it('should return string with tags containing spaces', () => {
    expect(joinTitleAndTags('Hello world', ['test', 'some tag'])).toEqual(
      `Hello world ${String.fromCodePoint(0x1f3f7)} #test #some tag`,
    );
  });

  it('should extract tags with spaces from string', () => {
    expect(
      extractTags(
        `string -  test   ${String.fromCodePoint(
          0x1f3f7,
        )} #hello world #qqq #test`,
      ),
    ).toEqual(['hello world', 'qqq', 'test']);
  });

  it('should return empty string when input is empty', () => {
    expect(joinTitleAndTags('', [])).toEqual('');
  });

  it('should return empty array when extractTags receives empty string', () => {
    expect(extractTags('')).toEqual([]);
  });

  it('should return empty array if string has no tags after separator', () => {
    const string = `Test ${String.fromCodePoint(0x1f3f7)}`;
    expect(extractTags(string)).toEqual([]);
  });

  it('should return correct title and empty tags if string only contains separator', () => {
    const string = `Hello ${String.fromCodePoint(0x1f3f7)}`;
    expect(extractTitle(string)).toEqual('Hello');
    expect(extractTags(string)).toEqual([]);
  });

  it('should handle tags with special characters correctly', () => {
    const string = `Test ${String.fromCodePoint(0x1f3f7)} #tag_one #tag-two #tag.three #tag@four`;
    expect(extractTags(string)).toEqual(['tag_one', 'tag-two', 'tag.three', 'tag@four']);
  });

  it('should trim extra spaces around tags', () => {
    const string = `  Test   ${String.fromCodePoint(0x1f3f7)}   #tag1   #tag2 `;
    expect(extractTags(string)).toEqual(['tag1', 'tag2']);
  });

  it('should return title if tags array contains only empty strings', () => {
    expect(joinTitleAndTags('Title', ['', ''])).toEqual('Title');
  });

  it('should filter out falsy values from tags array', () => {
    expect(joinTitleAndTags('Title', ['tag1', '', 'tag2', null, undefined])).toEqual(
      `Title ${String.fromCodePoint(0x1f3f7)} #tag1 #tag2`,
    );
  });
});
