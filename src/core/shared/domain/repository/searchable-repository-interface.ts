import { Entity } from '../entity';
import { ValueObject } from '../value-object';
import { IRepository } from './repository-interface';
import { SearchParams } from './search-params';
import { SearchResult } from './search-result';

export interface ISearchableRepository<
  E extends Entity,
  EntityId extends ValueObject,
  Filter = string,
  SearchInput = SearchParams<Filter>,
  SearchOutput = SearchResult,
> extends IRepository<E, EntityId> {
  sortableFields: string[];
  search(props: SearchInput): Promise<SearchOutput>;
}
