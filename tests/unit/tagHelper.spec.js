import tagHelper from '@/helpers/tags';

describe('Test tag helper', () => {
  it('if tags.length === 0, returs title', () => {
    const title = 'Hello world';
    expect(tagHelper.toString(title, [])).toEqual(title);
  });

  it('returns title & tags', () => {
    expect(tagHelper.toString('Test', ['tag1'])).toEqual(`Test ${String.fromCodePoint(0x1f3f7)} #tag1`);
  });

  it('extract tags from string', () => {
    const string = `🧪 PhpStorm Tips & Tricks ${String.fromCodePoint(0x1f3f7)} #php #test`;
    expect(tagHelper.getTags(string)).toEqual(['php', 'test']);
  });

  it('returns empty array if the string does not contain separator', () => {
    const string = '🧪 PhpStorm Tips & Tricks #php #test';
    expect(tagHelper.getTags(string)).toEqual([]);
  });

  it('returns title without tags', () => {
    const string = `Some bookmark title ${String.fromCodePoint(0x1f3f7)} #php #js`;
    expect(tagHelper.getTitle(string)).toEqual('Some bookmark title');
  });

  it('returns string with tags (spaces)', () => {
    expect(tagHelper.toString('Hello world', ['test', 'some tag'])).toEqual(`Hello world ${String.fromCodePoint(0x1f3f7)} #test #some tag`);
  });

  it('return tags with spaces from string', () => {
    expect(tagHelper.getTags(`string -  test   ${String.fromCodePoint(0x1f3f7)} #hello world #qqq #test`)).toEqual(['hello world', 'qqq', 'test']);
  });
});
