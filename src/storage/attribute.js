import connection from './idb/connection';

export default class AttributeStorage {
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

  async filterByKeyAndValue(key, value, skip, limit = 50) {
    const whereConditions = [{ key }];
    if (value) {
      whereConditions.push({
        value: { like: `%${value}%` },
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

  async create(bookmark) {
    const { domain = '', tags = [], keywords = [], folderName = '' } = bookmark;

    const allAttributes = [
      domain && { key: 'domain', value: domain, id: `domain-${domain}` },
      ...tags.map((tag) => ({ key: 'tag', value: tag, id: `tag-${tag}` })),
      ...keywords.map((keyword) => ({ key: 'keyword', value: keyword, id: `keyword-${keyword}` })),
      folderName && { key: 'folder', value: folderName, id: `folder-${folderName}` },
    ].filter(Boolean);

    const existing = await connection.select({
      from: 'attributes',
      where: { id: { in: allAttributes.map((attr) => attr.id) } },
    });

    const existingMap = new Map(existing.map((r) => [r.id, r.count || 0]));

    const updatedAttributes = allAttributes.map((attr) => ({
      ...attr,
      count: (existingMap.get(attr.id) || 0) + 1,
    }));

    await connection.insert({
      into: 'attributes',
      upsert: true,
      values: updatedAttributes,
      skipDataCheck: true,
    });
  }

  async remove(bookmark) {
    const { domain = '', tags = [], keywords = [], folderName = '' } = bookmark;

    const allAttributes = [
      domain && { key: 'domain', value: domain, id: `domain-${domain}` },
      ...tags.map((tag) => ({ key: 'tag', value: tag, id: `tag-${tag}` })),
      ...keywords.map((keyword) => ({ key: 'keyword', value: keyword, id: `keyword-${keyword}` })),
      folderName && { key: 'folder', value: folderName, id: `folder-${folderName}` },
    ].filter(Boolean);

    const existing = await connection.select({
      from: 'attributes',
      where: { id: { in: allAttributes.map((attr) => attr.id) } },
    });

    const updatedAttributes = existing.map((record) => ({
      ...record,
      count: Math.max(0, (record.count || 0) - 1),
    })).filter((attr) => attr.count > 0);

    const toDelete = existing.filter((record) => (record.count || 0) <= 1).map((r) => r.id);
    if (toDelete.length > 0) {
      await connection.remove({
        from: 'attributes',
        where: { id: { in: toDelete } },
      });
    }

    if (updatedAttributes.length > 0) {
      await connection.insert({
        into: 'attributes',
        upsert: true,
        values: updatedAttributes,
        skipDataCheck: true,
      });
    }
  }

  async refreshDomains() {
    const flattenDomains = await connection.select({
      from: 'bookmarks',
      aggregate: { count: ['id'] },
      groupBy: 'domain',
    });

    const result = flattenDomains.map((item) => ({
      key: 'domain',
      value: item.domain,
      id: `domain-${item.domain}`,
      count: item['count(id)'],
    }));

    await connection.remove({
      from: 'attributes',
      where: { key: 'domain' },
    });
    await connection.insert({
      into: 'attributes',
      values: result,
      validation: false,
      skipDataCheck: true,
    });

    return result;
  }

  async refreshTags() {
    const flattenTags = await connection.select({
      from: 'bookmarks',
      flatten: ['tags'],
      groupBy: 'tags',
      aggregate: { count: ['id'] },
    });

    const result = flattenTags.map((item) => ({
      key: 'tag',
      value: item.tags,
      id: `tag-${item.tags}`,
      count: item['count(id)'],
    }));

    await connection.remove({
      from: 'attributes',
      where: { key: 'tag' },
    });
    await connection.insert({
      into: 'attributes',
      values: result,
      validation: false,
      skipDataCheck: true,
    });

    return result;
  }

  async refreshKeywords() {
    const flattenKeywords = await connection.select({
      from: 'bookmarks',
      flatten: ['keywords'],
      groupBy: 'keywords',
      aggregate: { count: ['id'] },
    });

    const result = flattenKeywords.map((item) => ({
      key: 'keyword',
      value: item.keywords,
      id: `keyword-${item.keywords}`,
      count: item['count(id)'],
    }));

    await connection.remove({
      from: 'attributes',
      where: { key: 'keyword' },
    });
    await connection.insert({
      into: 'attributes',
      values: result,
      validation: false,
      skipDataCheck: true,
    });

    return result;
  }

  async refreshFolders() {
    const flattenFolders = await connection.select({
      from: 'bookmarks',
      groupBy: 'folderName',
      aggregate: { count: ['id'] },
    });

    const result = flattenFolders.map((item) => ({
      key: 'folder',
      value: item.folderName,
      id: `folder-${item.folderName}`,
      count: item['count(id)'],
    }));

    await connection.remove({
      from: 'attributes',
      where: { key: 'folder' },
    });
    await connection.insert({
      into: 'attributes',
      values: result,
      validation: false,
      skipDataCheck: true,
    });

    return result;
  }

  async refresh() {
    console.time('Execution time attributes');

    const [domains, tags, keywords, folders] = await Promise.all([
      this.refreshDomains(),
      this.refreshTags(),
      this.refreshKeywords(),
      this.refreshFolders(),
    ]);

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
