import { CategoryOutputMapper } from '@/src/core/category/application/use-cases/common/category-output.mapper';
import { ICategoryRepository } from '@/src/core/category/domain/category.repository';
import { Uuid } from '@/src/core/shared/domain/value-objects/uuid.vo';
import { CategoriesController } from '@/src/nest-modules/categories-module/categories.controller';
import { CATEGORY_PROVIDERS } from '@/src/nest-modules/categories-module/categories.providers';
import { CreateCategoryFixture } from '@/src/nest-modules/categories-module/testing/category-fixture';
import { startApp } from '@/src/nest-modules/shared-module/testing/helpers';
import { instanceToPlain } from 'class-transformer';
import request from 'supertest';

describe('CategoriesController (e2e)', () => {
  const appHelper = startApp();
  let repository: ICategoryRepository;

  beforeEach(async () => {
    repository = appHelper.app.get<ICategoryRepository>(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );
  });

  describe('[POST] /categories', () => {
    describe('should return a response error with status code 422 when request body is invalid', () => {
      const invalidRequests = CreateCategoryFixture.arrangeInvalidRequest();
      const arrange = Object.keys(invalidRequests).map((key) => ({
        label: key,
        value: invalidRequests[key],
      }));

      test.each(arrange)('when body is $label', async ({ value }) => {
        return request(appHelper.app.getHttpServer())
          .post('/categories')
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should return a response error with status code 422 when throw EntityValidationError', () => {
      const invalidRequests =
        CreateCategoryFixture.arrangeForEntityValidationError();
      const arrange = Object.keys(invalidRequests).map((key) => ({
        label: key,
        value: invalidRequests[key],
      }));

      test.each(arrange)('when body is $label', async ({ value }) => {
        return request(appHelper.app.getHttpServer())
          .post('/categories')
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should create a category', () => {
      const arrange = CreateCategoryFixture.arrangeForCreate();

      test.each(arrange)(
        'when body is $send_data',
        async ({ send_data, expected }) => {
          const res = await request(appHelper.app.getHttpServer())
            .post('/categories')
            .send(send_data)
            .expect(201);

          const keysInResponse = CreateCategoryFixture.keysInResponse;
          expect(Object.keys(res.body)).toStrictEqual(['data']);
          expect(Object.keys(res.body.data)).toStrictEqual(keysInResponse);

          const id = res.body.data.id;
          const category = await repository.findById(new Uuid(id));
          const presenter = CategoriesController.serialize(
            CategoryOutputMapper.toOutput(category),
          );
          const serialized = instanceToPlain(presenter);
          expect(res.body.data).toStrictEqual({
            id: serialized.id,
            created_at: serialized.created_at,
            ...expected,
          });
        },
      );
    });
  });
});
