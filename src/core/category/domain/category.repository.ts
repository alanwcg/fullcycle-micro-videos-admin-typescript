import { SearchParams } from '../../shared/domain/repository/search-params';
import { SearchResult } from '../../shared/domain/repository/search-result';
import { ISearchableRepository } from '../../shared/domain/repository/searchable-repository-interface';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { Category } from './category.entity';

export type CategoryFilter = string;

export class CategorySearchParams extends SearchParams<CategoryFilter> {}

export class CategorySearchResult extends SearchResult<Category> {}

export type ICategoryRepository = ISearchableRepository<
  Category,
  Uuid,
  CategoryFilter,
  CategorySearchParams,
  CategorySearchResult
>;
