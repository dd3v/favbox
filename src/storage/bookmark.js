/* eslint-disable no-restricted-globals */
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
  });
}

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
      // await this.refreshAttributes();
    } catch (error) {
      console.error(`Error in createMultipleTx: ${error.message}`);
      throw error;
    }
  }

  async selectAfterId(id, limit) {
    const query = {
      from: 'bookmarks',
      limit,
      order: { by: 'id', type: 'asc' },
      where: id ? { id: { '>': id } } : null,
    };
    return connection.select(query);
  }

  async search(query, skip = 0, limit = 50, sortDirection = 'desc') {
    const queryParams = {};
    const whereConditions = [];
    query.forEach(({ key, value }) => {
      (queryParams[key] ??= []).push(value);
    });
    const conditions = [
      { key: 'folder', condition: { folderName: { in: queryParams.folder } } },
      { key: 'tag', condition: { tags: { in: queryParams.tag } } },
      { key: 'domain', condition: { domain: { in: queryParams.domain } } },
      { key: 'keyword', condition: { keywords: { in: queryParams.keyword } } },
    ];
    conditions.forEach(({ key, condition }) => {
      if (queryParams[key]) {
        whereConditions.push(condition);
      }
    });
    if (queryParams?.term) {
      const [term] = queryParams.term;
      const regexPattern = term.split(/\s+/).map((word) => `(?=.*${word})`).join('');
      const regex = new RegExp(`^${regexPattern}.*$`, 'i');
      whereConditions.push({
        title: { regex },
        or: {
          description: { regex },
          or: {
            url: { regex },
            or: {
              domain: { like: `%${term}%` },
              or: {
                keywords: { regex },
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
        by: 'dateAdded',
        type: sortDirection,
      },
      where: whereConditions.length === 0 ? null : whereConditions,
    });
  }

  async total() {
    return connection.count({
      from: 'bookmarks',
    });
  }

  async create(entity) {
    return connection.insert({
      into: 'bookmarks',
      values: [entity],
    });
  }

  async updateAttirbutes(id, data) {
    return connection.update({
      in: 'bookmarks',
      set: data,
      where: {
        id,
      },
    });
  }

  async updateHttpStatusById(id, status) {
    return connection.update({
      in: 'bookmarks',
      set: {
        httpStatus: parseInt(status, 10),
        updatedAt: new Date().toISOString(),
      },
      where: {
        id,
      },
    });
  }

  async setOK() {
    return connection.update({
      in: 'bookmarks',
      set: { httpStatus: 200 },
    });
  }

  async getPinnedBookmarks(skip = 0, limit = 50, term = '') {
    const whereConditions = [{ pinned: 1 }];
    if (term) {
      const regexPattern = term.split(/\s+/).map((word) => `(?=.*${word})`).join('');
      const regex = new RegExp(`^${regexPattern}.*$`, 'i');
      whereConditions.push({
        notes: { regex },
        or: {
          title: { regex },
          or: {
            description: { regex },
            or: {
              domain: { like: `%${term}%` },
            },
          },
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
        id,
      },
    });
  }

  async update(id, data) {
    return connection.update({
      in: 'bookmarks',
      set: data,
      where: {
        id,
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
      where: { id },
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
    return response.map((i) => i.id);
  }

  async updateFolders(folder) {
    return connection.update({
      in: 'bookmarks',
      set: {
        folderName: folder.title,
        folderId: folder.id,
      },
      where: {
        folderId: folder.id,
      },
    });
  }

  async getById(id) {
    const response = await connection.select({
      from: 'bookmarks',
      limit: 1,
      where: {
        id,
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
        id,
      },
    });
  }

  async updateImageById(id, image) {
    return connection.update({
      in: 'bookmarks',
      set: {
        image,
      },
      where: {
        id,
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

  async getTotalByHttpStatus(statuses) {
    return connection.count({
      from: 'bookmarks',
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

  async searchAttributes(key, value, skip, limit = 50) {
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

  async refreshAttributes() {
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
