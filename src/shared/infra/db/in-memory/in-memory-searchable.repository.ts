/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Entity } from '../../../domain/entity'
import { SearchParams } from '../../../domain/repository/search-params'
import { SearchResult } from '../../../domain/repository/search-result'
import { ISearchableRepository } from '../../../domain/repository/searchable-repository-interface'
import { ValueObject } from '../../../domain/value-object'
import { InMemoryRepository } from './in-memory.repository'

export abstract class InMemorySearchableRepository<
    E extends Entity,
    EntityId extends ValueObject,
    Filter = string,
  >
  extends InMemoryRepository<E, EntityId>
  implements ISearchableRepository<E, EntityId, Filter>
{
  sortableFields: string[] = []

  async search(props: SearchParams<Filter>): Promise<SearchResult<E>> {
    const filteredItems = await this.applyFilter(this.items, props.filter)
    const sortedItems = await this.applySort(
      filteredItems,
      props.sort,
      props.sort_dir,
    )
    const paginatedItems = await this.applyPagination(
      sortedItems,
      props.page,
      props.per_page,
    )

    return new SearchResult({
      items: paginatedItems,
      total: filteredItems.length,
      current_page: props.page,
      per_page: props.per_page,
    })
  }

  protected abstract applyFilter(
    items: E[],
    filter: Filter | null,
  ): Promise<E[]>

  protected async applySort(
    items: E[],
    sort: SearchParams['sort'],
    sort_dir: SearchParams['sort_dir'],
    custom_getter?: (sort: string, item: E) => any,
  ) {
    if (!sort || !this.sortableFields.includes(sort)) {
      return items
    }

    return [...items].sort((a, b) => {
      // @ts-ignore
      const aValue = custom_getter ? custom_getter(sort, a) : a[sort]
      // @ts-ignore
      const bValue = custom_getter ? custom_getter(sort, b) : b[sort]

      if (aValue < bValue) {
        return sort_dir === 'asc' ? -1 : 1
      }

      if (aValue > bValue) {
        return sort_dir === 'asc' ? 1 : -1
      }

      return 0
    })
  }

  protected async applyPagination(
    items: E[],
    page: SearchParams['page'],
    per_page: SearchParams['per_page'],
  ): Promise<E[]> {
    const start = (page - 1) * per_page // 0 * 15 = 0
    const limit = start + per_page // 0 + 15 = 15

    return items.slice(start, limit)
  }
}
