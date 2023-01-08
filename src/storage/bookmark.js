import connection from './idb/connection';

export default class Bookmark {
  constructor() {
    this.tableName = 'bookmarks';
  }

  search(conditions, skip = 0, limit = 100) {
    const whereConditions = null;
    if (conditions.tags.length) {
      Object.assign(whereConditions, {
        tags: {
          in: [...conditions.tags],
        },
      });
    }
    if (conditions.term.trim().length) {
      Object.assign(whereConditions, { title: { like: `%${conditions.term}%` } });
    }
    return connection.select({
      from: this.tableName,
      distinct: true,
      limit,
      skip,
      order: {
        by: 'id',
        type: conditions.sort,
      },
      where: whereConditions,
    });
  }

  create(entity) {
    return connection.insert({
      into: this.tableName,
      values: [entity],
      return: true,
    });
  }

  update(entity) {
    return connection.update({
      in: this.tableName,
      set: {
        title: entity.title,
      },
      where: {
        id: entity.id,
      },
    });
  }

  async tags() {
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
}
