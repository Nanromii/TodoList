import { PageResponse } from '../dto/response/page.response';
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export class Pagination {
  static async paginate<T extends ObjectLiteral, R>(
    queryBuilder: SelectQueryBuilder<T>,
    page = 1,
    limit = 10,
    mapper: (entity: T) => R,
  ): Promise<PageResponse<R>> {
    const skip = (page - 1) * limit;
    const [result, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();
    const data = result.map(mapper);
    return new PageResponse<R>(data, total, page, limit);
  }

  static applySort<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    sortBy: string[] | undefined,
    alias: string,
  ): SelectQueryBuilder<T> {
    if (!sortBy) return queryBuilder;
    sortBy.forEach((sort) => {
      const [field, direction] = sort.split(':');
      const dir = direction?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      queryBuilder.addOrderBy(`${alias}.${field}`, (dir as 'ASC') || 'DESC');
    });
    return queryBuilder;
  }
}