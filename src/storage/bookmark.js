import useConnection from './idb/connection';

export default class BookmarkStorage {
  async createMany(data) {
    const connection = await useConnection();
    const result = await connection.insert({
      into: 'bookmarks',
      values: data,
      validation: false,
      skipDataCheck: true,
      ignore: true,
    });
    return result;
  }

  async findAfterId(id, limit) {
    const connection = await useConnection();
    const query = {
      from: 'bookmarks',
      limit,
      order: { by: 'id', type: 'asc' },
      where: id ? { id: { '>': id } } : null,
    };
    return connection.select(query);
  }

  async search(query, skip = 0, limit = 50, sortDirection = 'desc') {
    const connection = await useConnection();
    const queryParams = {};
    const whereConditions = [];
    query.forEach(({ key, value }) => {
      (queryParams[key] ??= []).push(value);
    });

    const conditions = [
      { key: 'folder', condition: { folderId: { in: queryParams.folder } } },
      { key: 'tag', condition: { tags: { in: queryParams.tag } } },
      { key: 'domain', condition: { domain: { in: queryParams.domain } } },
      { key: 'keyword', condition: { keywords: { in: queryParams.keyword } } },
      { key: 'id', condition: { id: { in: queryParams.id } } },
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
    if (queryParams?.dateAdded?.[0]) {
      const [startStr, endStr] = queryParams.dateAdded[0].split('~');
      const low = new Date(startStr).setHours(0, 0, 0, 0);
      const high = new Date(endStr).setHours(23, 59, 59, 999);
      whereConditions.push({
        dateAdded: { '-': { low, high } },
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
    const connection = await useConnection();
    return connection.count({
      from: 'bookmarks',
    });
  }

  async create(entity) {
    const connection = await useConnection();
    return connection.insert({
      into: 'bookmarks',
      values: [entity],
    });
  }

  async updateHttpStatusById(id, status) {
    const connection = await useConnection();
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
    const connection = await useConnection();
    return connection.update({
      in: 'bookmarks',
      set: { httpStatus: 200 },
    });
  }

  async findPinned(skip = 0, limit = 50, term = '') {
    const connection = await useConnection();
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
    const connection = await useConnection();
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
    const connection = await useConnection();
    return connection.update({
      in: 'bookmarks',
      set: data,
      where: {
        id,
      },
    });
  }

  async removeByIds(ids) {
    const connection = await useConnection();
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

  async removeById(id) {
    const connection = await useConnection();
    return connection.remove({
      from: 'bookmarks',
      where: { id },
    });
  }

  async getIds(ids) {
    const connection = await useConnection();
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

  async getByFolderId(folderId) {
    const connection = await useConnection();
    const response = await connection.select({
      from: 'bookmarks',
      limit: 1,
      where: {
        folderId,
      },
    });

    return response.length === 1 ? response.shift() : null;
  }

  async updateBookmarksFolderName(folderId, folderName) {
    const connection = await useConnection();
    return connection.update({
      in: 'bookmarks',
      set: {
        folderName,
        updatedAt: new Date().toISOString(),
      },
      where: {
        folderId,
      },
    });
  }

  async getById(id) {
    const connection = await useConnection();
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
    const connection = await useConnection();
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
    const connection = await useConnection();
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
    const connection = await useConnection();
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
    const connection = await useConnection();
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
    const connection = await useConnection();
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

  async findByHttpStatus(statuses, skip = 0, limit = 50) {
    const connection = await useConnection();
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
    const connection = await useConnection();
    return connection.count({
      from: 'bookmarks',
      where: {
        httpStatus: {
          in: statuses,
        },
      },
    });
  }

  async getAllIds() {
    const connection = await useConnection();
    const response = await connection.select({
      from: 'bookmarks',
      columns: ['id'],
    });
    return response.map((i) => i.id);
  }

  async getDuplicatesGrouped(skip = 0, limit = 50) {
    const connection = await useConnection();

    // Get all URLs with the number of duplicates
    const groupedResults = await connection.select({
      from: 'bookmarks',
      groupBy: 'url',
      aggregate: {
        count: ['id'],
      },
    });

    // Filter only groups with duplicates (2+ bookmarks)
    const duplicateGroups = groupedResults.filter((group) => group['count(id)'] > 1);

    // Sort by url (alphabetically)
    duplicateGroups.sort((a, b) => String(a.url).localeCompare(String(b.url)));

    // Apply pagination
    const paginatedGroups = duplicateGroups.slice(skip, skip + limit);

    // Get all bookmarks for the current page in one query
    const urls = paginatedGroups.map((group) => group.url);
    const allBookmarks = await connection.select({
      from: 'bookmarks',
      where: { url: { in: urls } },
      order: {
        by: 'dateAdded',
        type: 'desc',
      },
    });

    // Group bookmarks by URL
    const bookmarksByUrl = Object.groupBy(allBookmarks, (b) => b.url);

    // Form the result
    const groupsWithDetails = paginatedGroups.map((group) => {
      const bookmarks = bookmarksByUrl[group.url] || [];
      return {
        url: group.url,
        bookmarks,
        count: group['count(id)'],
        firstAdded: bookmarks[bookmarks.length - 1], // Oldest
        lastAdded: bookmarks[0], // Newest
      };
    });

    return {
      groups: groupsWithDetails,
      total: duplicateGroups.length,
      hasMore: skip + limit < duplicateGroups.length,
    };
  }

  async aggregateByField(field, flatten = false) {
    const connection = await useConnection();
    const query = {
      from: 'bookmarks',
      groupBy: field,
      aggregate: { count: ['id'] },
    };
    if (flatten) query.flatten = [field];

    const rows = await connection.select(query);
    return rows
      .filter((r) => r[field])
      .map((r) => ({ field, value: r[field], count: r['count(id)'] }));
  }

  async aggregateDomains() {
    return this.aggregateByField('domain');
  }

  async aggregateTags() {
    return this.aggregateByField('tags', true);
  }

  async aggregateKeywords() {
    return this.aggregateByField('keywords', true);
  }
}
