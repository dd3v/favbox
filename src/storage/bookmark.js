import connection from './idb/connection';

export default class BookmarkStorage {
  constructor() {
    this.tableName = 'bookmarks';
  }

  async search(conditions, skip = 0, limit = 50) {
    console.warn('search query', conditions);

    const whereConditions = {};
    if (conditions.tag.length) {
      Object.assign(whereConditions, {
        tags: {
          in: [...conditions.tag],
        },
      });
    }
    if (conditions.folder.length) {
      Object.assign(whereConditions, {
        folderName: {
          in: [...conditions.folder],
        },
      });
    }
    if (conditions.domain.length) {
      Object.assign(whereConditions, {
        domain: {
          in: [...conditions.domain],
        },
      });
    }
    if (conditions.keyword.length) {
      Object.assign(whereConditions, {
        keywords: {
          in: [...conditions.keyword],
        },
      });
    }
    if (conditions.type.length) {
      Object.assign(whereConditions, {
        type: {
          in: [...conditions.type],
        },
      });
    }
    if (conditions.locale.length) {
      Object.assign(whereConditions, {
        locale: {
          in: [...conditions.locale],
        },
      });
    }
    if (conditions.error === true) {
      Object.assign(whereConditions, {
        error: { '!=': 0 },
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

  async getAttributes() {
    const flattenDomains = await connection.select({
      from: this.tableName,
      aggregate: {
        count: ['id'],
        list: ['id'],
      },
      groupBy: 'domain',
    });
    const domains = flattenDomains.map((item) => ({
      key: 'domain', value: item.domain, id: `domain${item.id}`, count: item['count(id)'], list: item['list(id)'],
    })).slice(0, 5);

    const flattenTags = await connection.select({
      from: this.tableName,
      flatten: ['tags'],
      groupBy: 'tags',
      aggregate: {
        list: ['id'],
      },
      order: {
        by: 'tags',
        type: 'asc',
      },
    });

    console.warn('flattenTags', flattenTags);

    const tags = flattenTags.map((item) => {
      const uniqueList = [...new Set(item['list(id)'])];
      return {
        key: 'tag',
        value: item.tags,
        id: `tag${item.id}`,
        count: uniqueList.length,
        list: uniqueList,
      };
    }).slice(0, 5);

    const flattenKeywords = await connection.select({
      from: this.tableName,
      flatten: ['keywords'],
      groupBy: 'keywords',
      aggregate: {
        count: ['id'],
        list: ['id'],
      },
      order: {
        by: 'keywords',
        type: 'asc',
      },
    });
    const keywords = flattenKeywords.map((item) => {
      const uniqueList = [...new Set(item['list(id)'])];
      return {
        key: 'keyword',
        value: item.keywords,
        id: `keyword${item.id}`,
        count: uniqueList.length,
        list: uniqueList,
      };
    }).slice(0, 5);

    const flattenTypes = await connection.select({
      from: this.tableName,
      groupBy: 'type',
      aggregate: {
        count: ['id'],
        list: ['id'],
      },
    });
    const types = flattenTypes.map((item) => ({
      key: 'type', value: item.type, id: `type${item.id}`, count: item['count(id)'], list: item['list(id)'],
    })).slice(0, 5);

    const flattenLocales = await connection.select({
      from: this.tableName,
      where: {
        locale: {
          '!=': 'null',
        },
      },
      groupBy: 'locale',
      aggregate: {
        count: ['id'],
        list: ['id'],
      },
    });
    const locales = flattenLocales.map((item) => ({
      key: 'locale', value: item.locale, id: `locale${item.id}`, count: item['count(id)'], list: item['list(id)'],
    }));

    const flattenFolders = await connection.select({
      from: this.tableName,
      aggregate: {
        count: ['id'],
        list: ['id'],
      },
      groupBy: 'folderName',
    });

    console.warn(flattenFolders);

    const folders = flattenFolders.map((item) => ({
      key: 'folder', value: item.folderName, id: `folder${item.id}`, count: item['count(id)'], list: item['list(id)'],
    })).slice(0, 125);

    // return [];
    return [...keywords, ...tags, ...domains, ...types, ...locales, ...folders];
  }
}
