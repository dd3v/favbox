import connection from './idb/connection';

export default class Bookmark {
  constructor() {
    this.tableName = 'bookmarks';
  }

  search(conditions, skip = 0, limit = 100) {
    const whereConditions = {};
    if (conditions.tags.length) {
      Object.assign(whereConditions, {
        tags: {
          in: [...conditions.tags],
        },
      });
    }
    Object.assign(whereConditions, { deleted: 0 });
    if (conditions.snippets === 'favorite') {
      Object.assign(whereConditions, { favorite: 1 });
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

  softDelete(entity) {
    return connection.update({
      in: this.tableName,
      set: {
        deleted: 1,
        updated_at: new Date().toISOString(),
      },
      where: {
        id: entity.id,
      },
    });
  }

  update(entity) {
    return connection.update({
      in: this.tableName,
      set: {
        title: entity.title,
        access_level: entity.access_level,
        code: entity.code,
        language: entity.language,
        favorite: entity.favorite,
        tags: entity.tags,
        editor_options: entity.editor_options,
        updated_at: new Date().toISOString(),
      },
      where: {
        id: entity.id,
      },
    });
  }

  async tags() {
    const response = await connection.select({
      from: this.tableName,
      where: {
        deleted: 0,
      },
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
