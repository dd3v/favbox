import connection from './idb/connection';

export default class BookmarkStorage {
  constructor() {
    this.tableName = 'bookmarks';
  }

  search(conditions, skip = 0, limit = 50) {
    const whereConditions = {};
    if (conditions.tags.length) {
      Object.assign(whereConditions, {
        tags: {
          in: [...conditions.tags],
        },
      });
    }
    if (conditions.folders.length) {
      Object.assign(whereConditions, {
        folderName: {
          in: [...conditions.folders],
        },
      });
    }
    if (conditions.error === 1) {
      console.warn('GOOGOGOGO');
      Object.assign(whereConditions, {
        error: {
          in: [404, 410],
        }
      });
    }
    if (conditions.domains.length) {
      Object.assign(whereConditions, {
        domain: {
          in: [...conditions.domains],
        },
      });
    }
    if (conditions.term.length) {
      Object.assign(whereConditions, {
        searchKeyPath: { like: `%${conditions.term}%` },
      });
    }
    return connection.select({
      from: this.tableName,
      limit,
      skip,
      order: {
        by: 'id',
        type: conditions.sort,
      },
      where: Object.keys(whereConditions).length === 0 ? null : whereConditions,
    });
  }

  create(entity) {
    return connection.insert({
      into: this.tableName,
      values: [entity],
      return: true,
    });
  }

  update(id, data) {
    return connection.update({
      in: this.tableName,
      set: data,
      where: {
        id: Number(id),
      },
    });
  }

  remove(id) {
    return connection.remove({
      from: this.tableName,
      where: { id: Number(id) },
    });
  }

  count(id) {
    return connection.count({
      from: this.tableName,
      where: {
        id: Number(id),
      },
    });
  }

  createMultiple(data) {
    return connection.insert({
      into: this.tableName,
      values: data,
      validation: false,
      skipDataCheck: true,
      ignore: true,
    });
  }

  getByIds(ids) {
    console.warn(ids);
    return connection.select({
      from: this.tableName,
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  updateFolders(id, folder) {
    return connection.update({
      in: this.tableName,
      set: {
        folderName: folder,
      },
      where: {
        folderId: id,
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
      // flatten: ['domain'],
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
}
