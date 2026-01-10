import hashCode from '@/services/hash';
import useConnection from './idb/connection';

export default class AttributeStorage {
  async search(includes, sortColumn = 'count', sortDirection = 'desc', term = '', skip = 0, limit = 200) {
    const connection = await useConnection();
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
    const connection = await useConnection();
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

  getAttributesFromBookmark(bookmark) {
    const { domain = '', tags = [], keywords = [] } = bookmark;
    const isValid = (v) => typeof v === 'string' && v.trim().length > 0;
    return [
      isValid(domain) && { key: 'domain', value: domain.trim(), id: hashCode('domain', domain.trim()) },
      ...tags.filter(isValid).map((tag) => ({ key: 'tag', value: tag.trim(), id: hashCode('tag', tag.trim()) })),
      ...keywords.filter(isValid).map((keyword) => ({ key: 'keyword', value: keyword.trim(), id: hashCode('keyword', keyword.trim()) })),
    ].filter(Boolean);
  }

  async create(bookmark) {
    const connection = await useConnection();
    const allAttributes = this.getAttributesFromBookmark(bookmark);
    if (allAttributes.length === 0) return;
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
    const connection = await useConnection();
    const allAttributes = this.getAttributesFromBookmark(bookmark);
    if (allAttributes.length === 0) return;
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

  /**
   * Update attributes when bookmark changes.
   * Removes old attributes and adds new ones incrementally.
   * @param {object} newBookmark - Updated bookmark
   * @param {object} oldBookmark - Previous bookmark state
   */
  async update(newBookmark, oldBookmark) {
    if (oldBookmark) {
      await this.remove(oldBookmark);
    }
    await this.create(newBookmark);
  }

  /**
   * Refresh attributes from aggregated data.
   * @param {Array} domains - Array of {field: 'domain', value: string, count: number}
   * @param {Array} tags - Array of {field: 'tags', value: string, count: number}
   * @param {Array} keywords - Array of {field: 'keywords', value: string, count: number}
   * @param {boolean} truncate - Whether to clear existing attributes before inserting
   */
  async refreshFromAggregated(domains = [], tags = [], keywords = [], truncate = true) {
    const connection = await useConnection();

    const toAttribute = (key, { value, count }) => ({
      key,
      value: String(value).trim(),
      id: hashCode(key, String(value).trim()),
      count,
    });

    const attributes = [
      ...domains.map((r) => toAttribute('domain', r)),
      ...tags.map((r) => toAttribute('tag', r)),
      ...keywords.map((r) => toAttribute('keyword', r)),
    ];

    if (truncate) {
      await connection.clear('attributes');
    }

    if (attributes.length > 0) {
      await connection.insert({
        into: 'attributes',
        values: attributes,
        validation: false,
        skipDataCheck: true,
      });
    }

    return attributes;
  }

  async clear() {
    const connection = await useConnection();
    await connection.clear('attributes');
  }

  async saveMany(attributes) {
    if (!attributes.length) return;
    const connection = await useConnection();
    await connection.insert({
      into: 'attributes',
      values: attributes,
      validation: false,
      skipDataCheck: true,
    });
  }
}
