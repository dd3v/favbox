import tagHelper from '@/helpers/tags';

describe('Test tag helper', () => {
  it('if tags.length === 0, returs title', () => {
    const title = 'Hello world';
    expect(tagHelper.toString(title, [])).toEqual(title);
  });

  it('returns title & tags', () => {
    expect(tagHelper.toString('Test', ['tag1'])).toEqual('Test ||| #tag1');
  });

  it('extract tags from string', () => {
    const string = '🧪 PhpStorm Tips & Tricks ||| #php #test';
    expect(tagHelper.getTags(string)).toEqual(['php', 'test']);
  });

  it('returns empty array if the string does not contain separator', () => {
    const string = '🧪 PhpStorm Tips & Tricks #php #test';
    expect(tagHelper.getTags(string)).toEqual([]);
  });

  it('returns title without tags', () => {
    const string = 'Some bookmark title ||| #php #js';
    expect(tagHelper.getTitle(string)).toEqual('Some bookmark title');
  });
});
