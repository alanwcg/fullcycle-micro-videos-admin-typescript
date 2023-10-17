import { ListCategoriesInput } from '@/src/core/category/application/use-cases/list-categories/list-categories.use-case';
import { SortDirection } from '@/src/core/shared/domain/repository/search-params';

export class SearchCategoriesDto implements ListCategoriesInput {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: SortDirection;
  filter?: string;
}
