import { Entity } from '../../../../domain/entity';
import { SearchParams } from '../../../../domain/repository/search-params';
import { SearchResult } from '../../../../domain/repository/search-result';
import { Uuid } from '../../../../domain/value-objects/uuid.vo';
import { InMemorySearchableRepository } from '../in-memory-searchable.repository';

type EntityStubConstructorProps = {
  entity_id?: Uuid;
  name: string;
  price: number;
};

class EntityStub extends Entity {
  entity_id: Uuid;
  name: string;
  price: number;
  constructor(props: EntityStubConstructorProps) {
    super();
    this.entity_id = props.entity_id ?? new Uuid();
    this.name = props.name;
    this.price = +props.price;
  }

  toJSON(): { id: string } & EntityStubConstructorProps {
    return {
      id: this.entity_id.id,
      name: this.name,
      price: this.price,
    };
  }
}

class InMemorySearchableRepositoryStub extends InMemorySearchableRepository<
  EntityStub,
  Uuid
> {
  sortableFields: string[] = ['name'];

  getEntity(): new (...args: any[]) => EntityStub {
    return EntityStub;
  }

  protected async applyFilter(
    items: EntityStub[],
    filter: string | null,
  ): Promise<EntityStub[]> {
    if (!filter) {
      return items;
    }

    return items.filter((i) => {
      return (
        i.name.toLowerCase().includes(filter.toLowerCase()) ||
        i.price.toString() === filter
      );
    });
  }
}

describe('InMemorySearchableRepository Unit Tests', () => {
  let repository: InMemorySearchableRepositoryStub;

  beforeEach(() => (repository = new InMemorySearchableRepositoryStub()));

  describe('applyFilter method', () => {
    it('should no filter items when filter param is null', async () => {
      const items = [new EntityStub({ name: 'name value', price: 5 })];
      const filterMethodSpy = jest.spyOn(items, 'filter' as any);
      const filteredItems = await repository['applyFilter'](items, null);
      expect(filteredItems).toStrictEqual(items);
      expect(filterMethodSpy).not.toHaveBeenCalled();
    });

    it('should filter using a filter param', async () => {
      const items = [
        new EntityStub({ name: 'test', price: 5 }),
        new EntityStub({ name: 'TEST', price: 5 }),
        new EntityStub({ name: 'fake', price: 0 }),
      ];

      const filterMethodSpy = jest.spyOn(items, 'filter' as any);
      let itemsFiltered = await repository['applyFilter'](items, 'TEST');

      expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
      expect(filterMethodSpy).toHaveBeenCalledTimes(1);

      itemsFiltered = await repository['applyFilter'](items, '5');
      expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
      expect(filterMethodSpy).toHaveBeenCalledTimes(2);

      itemsFiltered = await repository['applyFilter'](items, 'no-filter');
      expect(itemsFiltered).toHaveLength(0);
      expect(filterMethodSpy).toHaveBeenCalledTimes(3);
    });
  });

  describe('applySort method', () => {
    it('should no sort items', async () => {
      const items = [
        new EntityStub({ name: 'b', price: 5 }),
        new EntityStub({ name: 'a', price: 5 }),
      ];

      let sortedItems = await repository['applySort'](items, null, null);
      expect(sortedItems).toStrictEqual(items);

      sortedItems = await repository['applySort'](items, 'price', 'asc');
      expect(sortedItems).toStrictEqual(items);
    });

    it('should sort items', async () => {
      const items = [
        new EntityStub({ name: 'b', price: 5 }),
        new EntityStub({ name: 'a', price: 5 }),
        new EntityStub({ name: 'c', price: 5 }),
      ];

      let sortedItems = await repository['applySort'](items, 'name', 'asc');
      expect(sortedItems).toStrictEqual([items[1], items[0], items[2]]);

      sortedItems = await repository['applySort'](items, 'name', 'desc');
      expect(sortedItems).toStrictEqual([items[2], items[0], items[1]]);
    });
  });

  describe('applyPagination method', () => {
    it('should paginate items', async () => {
      const items = [
        new EntityStub({ name: 'a', price: 5 }),
        new EntityStub({ name: 'b', price: 5 }),
        new EntityStub({ name: 'c', price: 5 }),
        new EntityStub({ name: 'd', price: 5 }),
        new EntityStub({ name: 'e', price: 5 }),
      ];

      let paginatedItems = await repository['applyPagination'](items, 1, 2);
      expect(paginatedItems).toStrictEqual([items[0], items[1]]);

      paginatedItems = await repository['applyPagination'](items, 2, 2);
      expect(paginatedItems).toStrictEqual([items[2], items[3]]);

      paginatedItems = await repository['applyPagination'](items, 3, 2);
      expect(paginatedItems).toStrictEqual([items[4]]);

      paginatedItems = await repository['applyPagination'](items, 4, 2);
      expect(paginatedItems).toStrictEqual([]);
    });
  });

  describe('search method', () => {
    it('should apply only pagination when other params are null', async () => {
      const entity = new EntityStub({ name: 'a', price: 5 });
      const items = Array(16).fill(entity);
      repository.items = items;

      const result = await repository.search(new SearchParams());
      expect(result).toStrictEqual(
        new SearchResult({
          items: Array(15).fill(entity),
          total: 16,
          current_page: 1,
          per_page: 15,
        }),
      );
    });

    it('should apply pagination and filter', async () => {
      const items = [
        new EntityStub({ name: 'test', price: 5 }),
        new EntityStub({ name: 'a', price: 5 }),
        new EntityStub({ name: 'TEST', price: 5 }),
        new EntityStub({ name: 'TeSt', price: 5 }),
      ];
      repository.items = items;

      let result = await repository.search(
        new SearchParams({ page: 1, per_page: 2, filter: 'TEST' }),
      );
      expect(result).toStrictEqual(
        new SearchResult({
          items: [items[0], items[2]],
          total: 3,
          current_page: 1,
          per_page: 2,
        }),
      );

      result = await repository.search(
        new SearchParams({ page: 2, per_page: 2, filter: 'TEST' }),
      );
      expect(result).toStrictEqual(
        new SearchResult({
          items: [items[3]],
          total: 3,
          current_page: 2,
          per_page: 2,
        }),
      );
    });

    describe('should apply pagination and sort', () => {
      const items = [
        new EntityStub({ name: 'b', price: 5 }),
        new EntityStub({ name: 'a', price: 5 }),
        new EntityStub({ name: 'd', price: 5 }),
        new EntityStub({ name: 'e', price: 5 }),
        new EntityStub({ name: 'c', price: 5 }),
      ];
      const arrange = [
        {
          search_params: new SearchParams({
            page: 1,
            per_page: 2,
            sort: 'name',
          }),
          search_result: new SearchResult({
            items: [items[1], items[0]],
            total: 5,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          search_params: new SearchParams({
            page: 2,
            per_page: 2,
            sort: 'name',
          }),
          search_result: new SearchResult({
            items: [items[4], items[2]],
            total: 5,
            current_page: 2,
            per_page: 2,
          }),
        },
        {
          search_params: new SearchParams({
            page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
          }),
          search_result: new SearchResult({
            items: [items[3], items[2]],
            total: 5,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          search_params: new SearchParams({
            page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
          }),
          search_result: new SearchResult({
            items: [items[4], items[0]],
            total: 5,
            current_page: 2,
            per_page: 2,
          }),
        },
      ];

      beforeEach(() => {
        repository.items = items;
      });

      test.each(arrange)(
        'when value is %j',
        async ({ search_params, search_result }) => {
          const result = await repository.search(search_params);
          expect(result).toStrictEqual(search_result);
        },
      );
    });

    describe('should search using filter, sort and pagination', () => {
      const items = [
        new EntityStub({ name: 'test', price: 5 }),
        new EntityStub({ name: 'a', price: 5 }),
        new EntityStub({ name: 'TEST', price: 5 }),
        new EntityStub({ name: 'e', price: 5 }),
        new EntityStub({ name: 'TeSt', price: 5 }),
      ];

      const arrange = [
        {
          search_params: new SearchParams({
            page: 1,
            per_page: 2,
            sort: 'name',
            filter: 'TEST',
          }),
          search_result: new SearchResult({
            items: [items[2], items[4]],
            total: 3,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          search_params: new SearchParams({
            page: 2,
            per_page: 2,
            sort: 'name',
            filter: 'TEST',
          }),
          search_result: new SearchResult({
            items: [items[0]],
            total: 3,
            current_page: 2,
            per_page: 2,
          }),
        },
      ];

      beforeEach(() => {
        repository.items = items;
      });

      test.each(arrange)(
        'when value is %j',
        async ({ search_params, search_result }) => {
          const result = await repository.search(search_params);
          expect(result).toStrictEqual(search_result);
        },
      );
    });
  });
});
