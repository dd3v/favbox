import connection from './idb/connection';

export default class BookmarkStorage {
  constructor() {
    this.tableName = 'bookmarks';
  }

  async search(query, skip = 0, limit = 50) {
    const queryParams = {};
    const whereConditions = {};
    query.forEach(({ key, value }) => {
      (queryParams[key] ??= []).push(value);
    });

    Object.assign(whereConditions, queryParams?.folder ? { folderName: { in: queryParams.folder } } : {});
    Object.assign(whereConditions, queryParams?.tag ? { tags: { in: queryParams.tag } } : {});
    Object.assign(whereConditions, queryParams?.domain ? { domain: { in: queryParams.domain } } : {});
    Object.assign(whereConditions, queryParams?.keyword ? { keywords: { in: queryParams.keyword } } : {});
    Object.assign(whereConditions, queryParams?.type ? { type: { in: queryParams.type } } : {});
    Object.assign(whereConditions, queryParams?.locale ? { locale: { in: queryParams.locale } } : {});

    if (queryParams?.term) {
      const [term] = queryParams.term;
      Object.assign(whereConditions, {
        title: { like: `%${term}%` },
        or: {
          description: { like: `%${term}%` },
          or: {
            keywords: { in: [term] },
            or: {
              tags: { in: [term] },
              or: {
                domain: { like: `%${term}%` },
              },
            },
          },
        },
      });
    }

    return connection.select({
      from: this.tableName,
      limit,
      skip,
      order: {
        by: 'id',
        type: 'desc',
      },
      where: Object.keys(whereConditions).length === 0 ? null : whereConditions,
    });
  }

  async create(entity) {
    return connection.insert({
      into: this.tableName,
      values: [entity],
    });
  }

  async update(id, data) {
    return connection.update({
      in: this.tableName,
      set: data,
      where: {
        id: Number(id),
      },
    });
  }

  async removeByIds(ids) {
    const result = await connection.remove({
      from: this.tableName,
      where: {
        id: {
          in: ids,
        },
      },
    });
    return result;
  }

  async remove(id) {
    return connection.remove({
      from: this.tableName,
      where: { id: Number(id) },
    });
  }

  async count(id) {
    return connection.count({
      from: this.tableName,
      where: {
        id: Number(id),
      },
    });
  }

  async createMultiple(data) {
    return connection.insert({
      into: this.tableName,
      values: data,
      validation: false,
      skipDataCheck: true,
      ignore: true,
    });
  }

  async getIds(ids) {
    const response = await connection.select({
      from: this.tableName,
      where: {
        id: {
          in: ids,
        },
      },
    });
    return response.map((i) => parseInt(i.id, 10));
  }

  async updateFolders(folder) {
    return connection.update({
      in: this.tableName,
      set: {
        folderName: folder.title,
        folder,
        folderId: parseInt(folder.id, 10),
      },
      where: {
        folderId: parseInt(folder.id, 10),
      },
    });
  }

  async getById(id) {
    const response = await connection.select({
      from: this.tableName,
      limit: 1,
      where: {
        id: parseInt(id, 10),
      },
    });

    return response.length === 1 ? response.shift() : null;
  }

  async getByUrl(url) {
    const response = await connection.select({
      from: this.tableName,
      limit: 1,
      where: {
        url: String(url),
      },
    });

    return response.length === 1 ? response.shift() : null;
  }

  async getTags() {
    const response = await connection.select({
      from: this.tableName,
      flatten: ['tags'],
      groupBy: 'tags',
      order: {
        by: 'tags',
        type: 'asc',
      },
    });
    return response.map((item) => item.tags);
  }

  async getDomains() {
    const response = await connection.select({
      from: this.tableName,
      groupBy: 'domain',
      order: {
        by: 'domain',
        type: 'asc',
      },
    });
    return response.map((item) => item.domain);
  }

  async getKeywords() {
    const response = await connection.select({
      from: this.tableName,
      flatten: ['keywords'],
      groupBy: 'keywords',
      order: {
        by: 'keywords',
        type: 'asc',
      },
    });
    return response.map((item) => item.keywords);
  }

  async getBrokenBookmarks(skip = 0, limit = 50) {
    return connection.select({
      from: this.tableName,
      limit,
      skip,
      order: {
        by: 'id',
        type: 'desc',
      },
      where: {
        error: {
          '!=': 0,
        },
      },
    });
  }

  async getAttributes(include, sort, term = '') {
    const [sortColumn, sortDirection] = sort.split(':');
    const result = [];
    if (include.domain) {
      console.warn('include domain');
      const flattenDomains = await connection.select({
        from: this.tableName,
        aggregate: {
          count: ['id'],
          list: ['id'],
        },
        where: term ? { domain: { like: `%${term}%` } } : null,
        groupBy: 'domain',
      });
      const domains = flattenDomains.map((item) => ({
        key: 'domain', value: item.domain, id: `domain${item.id}`, count: item['count(id)'], list: item['list(id)'],
      }));
      result.push(...domains);
    }
    if (include.tag) {
      let flattenTags = await connection.select({
        from: this.tableName,
        flatten: ['tags'],
        groupBy: 'tags',
        aggregate: {
          count: ['id'],
          list: ['id'],
        },
        where: term ? { tags: { like: `%${term}%` } } : null,
      });
      flattenTags = term ? flattenTags.filter((item) => item.tags.includes(term)) : flattenTags;
      const tags = flattenTags.map((item) => {
        const uniqueList = [...new Set(item['list(id)'])];
        return {
          key: 'tag',
          value: item.tags,
          id: `tag${item.id}`,
          count: uniqueList.length,
          list: uniqueList,
        };
      });
      result.push(...tags);
    }
    if (include.keyword) {
      let flattenKeywords = await connection.select({
        from: this.tableName,
        flatten: ['keywords'],
        groupBy: 'keywords',
        aggregate: {
          count: ['id'],
          list: ['id'],
        },
      });
      flattenKeywords = term ? flattenKeywords.filter((item) => item.keywords.includes(term)) : flattenKeywords;
      const keywords = flattenKeywords.map((item) => {
        const uniqueList = [...new Set(item['list(id)'])];
        return {
          key: 'keyword',
          value: item.keywords,
          id: `keyword${item.id}`,
          count: uniqueList.length,
          list: uniqueList,
        };
      });
      result.push(...keywords);
    }
    if (include.type) {
      const flattenTypes = await connection.select({
        from: this.tableName,
        groupBy: 'type',
        aggregate: {
          count: ['id'],
          list: ['id'],
        },
        where: term ? { type: { like: `%${term}%` } } : null,
      });
      const types = flattenTypes.map((item) => ({
        key: 'type', value: item.type, id: `type${item.id}`, count: item['count(id)'], list: item['list(id)'],
      }));

      result.push(...types);
    }
    if (include.locale) {
      const conditions = [{ locale: { '!=': 'null' } }];
      if (term) {
        conditions.push({ locale: { like: `%${term}%` } });
      }
      const flattenLocales = await connection.select({
        from: this.tableName,
        where: conditions,
        groupBy: 'locale',
        aggregate: {
          count: ['id'],
          list: ['id'],
        },
      });
      const locales = flattenLocales.map((item) => ({
        key: 'locale', value: item.locale, id: `locale${item.id}`, count: item['count(id)'], list: item['list(id)'],
      }));

      result.push(...locales);
    }
    if (include.folder) {
      const flattenFolders = await connection.select({
        from: this.tableName,
        groupBy: 'folderName',
        aggregate: {
          count: ['id'],
          list: ['id'],
        },
        where: term ? { folderName: { like: `%${term}%` } } : null,
      });
      const folders = flattenFolders.map((item) => ({
        key: 'folder', value: item.folderName, id: `folder${item.id}`, count: item['count(id)'], list: item['list(id)'],
      }));

      result.push(...folders);
    }
    if (sortColumn === 'count') {
      if (sortDirection === 'asc') {
        result.sort((a, b) => a.count - b.count);
      } else {
        result.sort((a, b) => b.count - a.count);
      }
    }
    if (sortColumn === 'name') {
      if (sortDirection === 'asc') {
        result.sort((a, b) => a.value.localeCompare(b.value));
      } else {
        result.sort((a, b) => b.value.localeCompare(a.value));
      }
    }
    return result;
  }
}
