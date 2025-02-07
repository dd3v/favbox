import { describe, expect, it } from 'vitest';
import tagHelper from '@/helpers/tags';

describe('Test tag helper', () => {
  it('if tags.length === 0, returs title', () => {
    const title = 'Hello world';
    expect(tagHelper.toString(title, [])).toEqual(title);
  });

  it('returns title & tags', () => {
    expect(tagHelper.toString('Test', ['tag1'])).toEqual(
      `Test ${String.fromCodePoint(0x1f3f7)} #tag1`,
    );
  });

  it('extract tags from string', () => {
    const string = `🧪 PhpStorm Tips & Tricks ${String.fromCodePoint(
      0x1f3f7,
    )} #php #test`;
    expect(tagHelper.getTags(string)).toEqual(['php', 'test']);
  });

  it('returns null if the string does not contain separator', () => {
    const string = '🧪 PhpStorm Tips & Tricks #php #test';
    expect(tagHelper.getTags(string)).toEqual([]);
  });

  it('returns title without tags', () => {
    const string = `Some bookmark title ${String.fromCodePoint(
      0x1f3f7,
    )} #php #js`;
    expect(tagHelper.getTitle(string)).toEqual('Some bookmark title');
  });

  it('returns string with tags (spaces)', () => {
    expect(tagHelper.toString('Hello world', ['test', 'some tag'])).toEqual(
      `Hello world ${String.fromCodePoint(0x1f3f7)} #test #some tag`,
    );
  });

  it('return tags with spaces from string', () => {
    expect(
      tagHelper.getTags(
        `string -  test   ${String.fromCodePoint(
          0x1f3f7,
        )} #hello world #qqq #test`,
      ),
    ).toEqual(['hello world', 'qqq', 'test']);
  });

  it('returns empty title when input is an empty string', () => {
    expect(tagHelper.toString('', [])).toEqual('', []);
  });

  it('returns null when getTags receives an empty string', () => {
    expect(tagHelper.getTags('')).toEqual([]);
  });

  it('returns null if the string has no tags after separator', () => {
    const string = `Test ${String.fromCodePoint(0x1f3f7)}`;
    expect(tagHelper.getTags(string)).toEqual([]);
  });

  it('returns correct title and empty tags if string only contains separator', () => {
    const string = `Hello ${String.fromCodePoint(0x1f3f7)}`;
    expect(tagHelper.getTitle(string)).toEqual('Hello');
    expect(tagHelper.getTags(string)).toEqual([]);
  });

  it('handles tags with special characters correctly', () => {
    const string = `Test ${String.fromCodePoint(0x1f3f7)} #tag_one #tag-two #tag.three #tag@four`;
    expect(tagHelper.getTags(string)).toEqual(['tag_one', 'tag-two', 'tag.three', 'tag@four']);
  });

  it('trims extra spaces around tags', () => {
    const string = `  Test   ${String.fromCodePoint(0x1f3f7)}   #tag1   #tag2 `;
    expect(tagHelper.getTags(string)).toEqual(['tag1', 'tag2']);
  });

  it('returns title if tags array contains only empty strings', () => {
    expect(tagHelper.toString('Title', ['', ''])).toEqual('Title');
  });
});
