/* eslint-disable class-methods-use-this */
import connection from './idb/connection';

function addBookmarks(ctx) {
  ctx.start();

  ctx.insert({
    into: 'bookmarks',
    values: ctx.data.bookmarks,
    validation: false,
    skipDataCheck: true,
    ignore: true,
    return: true,
  });
}

function addAttributes(ctx) {
  ctx.start();

  ctx.insert({
    into: 'attributes',
    values: ctx.data.attributes,
    validation: false,
    skipDataCheck: true,
    ignore: true,
    upsert: true,
    return: true,
  });
}
// eslint-disable-next-line no-restricted-globals
self.addAttributes = addAttributes;

// eslint-disable-next-line no-restricted-globals
self.addBookmarks = addBookmarks;

export default class BookmarkStorage {
  async createMultipleTx(data) {
    try {
      await connection.transaction({
        method: 'addBookmarks',
        tables: ['bookmarks'],
        data: {
          bookmarks: data,
        },
      });
      await this.refreshAttributes();
    } catch (error) {
      console.error(`Error in createMultipleTx: ${error.message}`);
      throw error;
    }
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
      from: 'bookmarks',
      distinct: true,
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
      into: 'bookmarks',
      values: [entity],
    });
  }

  async getPinnedBookmarks(skip = 0, limit = 50, term = '') {
    const whereConditions = {
      pinned: 1,
    };

    if (term) {
      Object.assign(whereConditions, {
        notes: { like: `%${term}%` },
        or: {
          title: { like: `%${term}%` },
        },
      });
    }

    return connection.select({
      from: 'bookmarks',
      limit,
      skip,
      order: {
        by: 'updatedAt',
        type: 'desc',
      },
      where: whereConditions,
    });
  }

  async updatePinStatusById(id, status) {
    return connection.update({
      in: 'bookmarks',
      set: {
        pinned: parseInt(status, 10),
        updatedAt: new Date().toISOString(),
      },
      where: {
        id: Number(id),
      },
    });
  }

  async update(id, data) {
    return connection.update({
      in: 'bookmarks',
      set: data,
      where: {
        id: Number(id),
      },
    });
  }

  async removeByIds(ids) {
    const result = await connection.remove({
      from: 'bookmarks',
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
      from: 'bookmarks',
      where: { id: Number(id) },
    });
  }

  async count(id) {
    return connection.count({
      from: 'bookmarks',
      where: {
        id: Number(id),
      },
    });
  }

  async createMultiple(data) {
    return connection.insert({
      into: 'bookmarks',
      values: data,
      validation: false,
      skipDataCheck: true,
      ignore: true,
    });
  }

  async getIds(ids) {
    const response = await connection.select({
      from: 'bookmarks',
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
      in: 'bookmarks',
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
      from: 'bookmarks',
      limit: 1,
      where: {
        id: parseInt(id, 10),
      },
    });

    return response.length === 1 ? response.shift() : null;
  }

  async getByUrl(url) {
    const response = await connection.select({
      from: 'bookmarks',
      limit: 1,
      where: {
        url: String(url),
      },
    });

    return response.length === 1 ? response.shift() : null;
  }

  async getTags() {
    const response = await connection.select({
      from: 'bookmarks',
      flatten: ['tags'],
      groupBy: 'tags',
      order: {
        by: 'tags',
        type: 'asc',
      },
    });
    return response.map((item) => item.tags);
  }

  async updateStatusByIds(status, ids) {
    return connection.update({
      in: 'bookmarks',
      set: {
        httpStatus: status,
      },
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async updateNotesById(id, notes) {
    return connection.update({
      in: 'bookmarks',
      set: {
        notes,
        updatedAt: new Date().toISOString(),
      },
      where: {
        id: parseInt(id, 10),
      },
    });
  }

  async getBookmarksByHttpStatusCode(statuses, skip = 0, limit = 50) {
    return connection.select({
      from: 'bookmarks',
      limit,
      skip,
      order: {
        by: 'id',
        type: 'desc',
      },
      where: {
        httpStatus: {
          in: statuses,
        },
      },
    });
  }

  async getAttributes(includes, sortColumn = 'count', sortDirection = 'desc', term = '', skip = 0, limit = 200) {
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

  async refreshAttributes() {
    console.time('Execution time attributes');

    const result = [];

    console.warn('include domain');
    const flattenDomains = await connection.select({
      from: 'bookmarks',
      aggregate: { count: ['id'], list: ['id'] },
      groupBy: 'domain',
    });

    console.warn('flattenDomains', flattenDomains);

    const domains = flattenDomains.map((item) => ({
      key: 'domain', value: item.domain, id: `domain-${item.domain}`, count: item['count(id)'], list: item['list(id)'],
    }));
    result.push(...domains);

    const flattenTags = await connection.select({
      from: 'bookmarks',
      flatten: ['tags'],
      groupBy: 'tags',
      aggregate: {
        count: ['id'],
        list: ['id'],
      },
    });
    const tags = flattenTags.map((item) => {
      const uniqueList = [...new Set(item['list(id)'])];
      return {
        key: 'tag',
        value: item.tags,
        id: `tag${item.tags}`,
        count: uniqueList.length,
        list: uniqueList,
      };
    });
    result.push(...tags);

    const flattenKeywords = await connection.select({
      from: 'bookmarks',
      flatten: ['keywords'],
      groupBy: 'keywords',
      aggregate: {
        count: ['id'],
        list: ['id'],
      },
    });
    const keywords = flattenKeywords.map((item) => {
      const uniqueList = [...new Set(item['list(id)'])];
      return {
        key: 'keyword',
        value: item.keywords,
        id: `keyword${item.keywords}`,
        count: uniqueList.length,
        list: uniqueList,
      };
    });
    result.push(...keywords);

    const flattenTypes = await connection.select({
      from: 'bookmarks',
      groupBy: 'type',
      aggregate: {
        count: ['id'],
        list: ['id'],
      },
    });
    const types = flattenTypes.map((item) => ({
      key: 'type', value: item.type, id: `type-${item.type}`, count: item['count(id)'], list: item['list(id)'],
    }));

    result.push(...types);

    const conditions = [{ locale: { '!=': 'null' } }];

    const flattenLocales = await connection.select({
      from: 'bookmarks',
      where: conditions,
      groupBy: 'locale',
      aggregate: {
        count: ['id'],
        list: ['id'],
      },
    });
    const locales = flattenLocales.map((item) => ({
      key: 'locale', value: item.locale, id: `locale${item.locale}`, count: item['count(id)'], list: item['list(id)'],
    }));

    result.push(...locales);

    const flattenFolders = await connection.select({
      from: 'bookmarks',
      groupBy: 'folderName',
      aggregate: {
        count: ['id'],
        list: ['id'],
      },
    });
    const folders = flattenFolders.map((item) => ({
      key: 'folder', value: item.folderName, id: `folder${item.folderName}`, count: item['count(id)'], list: item['list(id)'],
    }));

    console.warn('refresh folders', folders);

    result.push(...folders);

    await connection.clear('attributes');
    await connection.transaction({
      method: 'addAttributes',
      tables: ['attributes'],
      data: {
        attributes: result,
      },
    });

    console.timeEnd('Execution time attributes');
    return result;
  }
}
