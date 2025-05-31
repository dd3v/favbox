import connection from './idb/connection';

export default class AttributeStorage {
  async refreshTags() {
    const flattenTags = await connection.select({
      from: 'bookmarks',
      flatten: ['tags'],
      groupBy: 'tags',
      aggregate: {
        count: ['id'],
        list: ['id'],
      },
    });
    const tags = flattenTags.map((item) => ({
      key: 'tag', value: item.tags, id: `tag-${item.tags}`, count: item['count(id)'], list: item['list(id)'],
    }));

    await connection.insert({
      into: 'attributes',
      values: tags,
      upsert: true,
      validation: false,
      skipDataCheck: true,
    });
    console.warn(tags);
  }

  async search(includes, sortColumn = 'count', sortDirection = 'desc', term = '', skip = 0, limit = 200) {
    const whereConditions = {};
    const keys = Object.entries(includes).reduce((acc, [key, value]) => {
      if (value === true) {
        acc.push(key);
      }
      return acc;
    }, []);

    if (keys.length === 0) {
      return [];
    }
    Object.assign(whereConditions, { key: { in: keys } });
    Object.assign(whereConditions, term ? { value: { like: `%${term}%` } } : {});

    return connection.select({
      from: 'attributes',
      where: Object.keys(whereConditions).length === 0 ? null : whereConditions,
      // distinct: true,
      skip,
      limit,
      order: {
        by: sortColumn,
        type: sortDirection,
      },
    });
  }

  async filterAttributesByKeyAndValue(key, value, skip, limit = 50) {
    const whereConditions = [{ key }];
    if (value) {
      whereConditions.push({
        value: { like: `${value}%` },
      });
    }
    return connection.select({
      from: 'attributes',
      distinct: true,
      limit,
      skip,
      where: whereConditions,
      order: {
        by: 'value',
        type: 'asc',
      },
    });
  }

  async refresh() {
    console.time('Execution time attributes');
    const [flattenDomains, flattenTags, flattenKeywords, flattenFolders] = await Promise.all([
      connection.select({
        from: 'bookmarks',
        aggregate: { count: ['id'], list: ['id'] },
        groupBy: 'domain',
      }),
      connection.select({
        from: 'bookmarks',
        flatten: ['tags'],
        groupBy: 'tags',
        aggregate: { count: ['id'], list: ['id'] },
      }),
      connection.select({
        from: 'bookmarks',
        flatten: ['keywords'],
        groupBy: 'keywords',
        aggregate: { count: ['id'], list: ['id'] },
      }),
      connection.select({
        from: 'bookmarks',
        groupBy: 'folderName',
        aggregate: { count: ['id'], list: ['id'] },
      }),
    ]);
    const transformData = (data, key, valueField) => data.map((item) => ({
      key,
      value: item[valueField],
      id: `${key}-${item[valueField]}`,
      count: item['count(id)'],
      list: [...new Set(item['list(id)'])],
    }));

    const domains = transformData(flattenDomains, 'domain', 'domain');
    const tags = transformData(flattenTags, 'tag', 'tags');
    const keywords = transformData(flattenKeywords, 'keyword', 'keywords');
    const folders = transformData(flattenFolders, 'folder', 'folderName');
    const result = [...domains, ...tags, ...keywords, ...folders];
    await connection.clear('attributes');
    await connection.insert({
      into: 'attributes',
      values: result,
      validation: false,
      skipDataCheck: true,
    });

    console.timeEnd('Execution time attributes');
    return result;
  }
}
