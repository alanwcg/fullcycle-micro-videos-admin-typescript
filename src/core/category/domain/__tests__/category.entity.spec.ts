import { Uuid } from '../../../shared/domain/value-objects/uuid.vo';
import { Category } from '../category.entity';

describe('Category Unit Tests', () => {
  describe('constructor', () => {
    it('should create a category with default values', () => {
      const category = new Category({
        name: 'Movie',
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe('Movie');
      expect(category.description).toBeNull();
      expect(category.is_active).toBe(true);
      expect(category.created_at).toBeInstanceOf(Date);
    });

    it('should create a category with all values', () => {
      const created_at = new Date();
      const category = new Category({
        name: 'Movie',
        description: 'Movie description',
        is_active: false,
        created_at,
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe('Movie');
      expect(category.description).toBe('Movie description');
      expect(category.is_active).toBe(false);
      expect(category.created_at).toEqual(created_at);
    });

    it('should create a category with description', () => {
      const category = new Category({
        name: 'Movie',
        description: 'Movie description',
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe('Movie');
      expect(category.description).toBe('Movie description');
      expect(category.is_active).toBe(true);
      expect(category.created_at).toBeInstanceOf(Date);
    });
  });

  describe('create command', () => {
    it('should create a category', () => {
      const category = Category.create({
        name: 'Movie',
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe('Movie');
      expect(category.description).toBeNull();
      expect(category.is_active).toBe(true);
      expect(category.created_at).toBeInstanceOf(Date);
    });

    it('should create a category with description', () => {
      const category = Category.create({
        name: 'Movie',
        description: 'Movie description',
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe('Movie');
      expect(category.description).toBe('Movie description');
      expect(category.is_active).toBe(true);
      expect(category.created_at).toBeInstanceOf(Date);
    });

    it('should create a category with is_active', () => {
      const category = Category.create({
        name: 'Movie',
        is_active: false,
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe('Movie');
      expect(category.description).toBeNull();
      expect(category.is_active).toBe(false);
      expect(category.created_at).toBeInstanceOf(Date);
    });
  });

  describe('category_id field', () => {
    const arrange = [
      { category_id: null },
      { category_id: undefined },
      { category_id: new Uuid() },
    ];

    test.each(arrange)('id = %j', ({ category_id }) => {
      const category = new Category({
        name: 'Movie',
        category_id: category_id as any,
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      if (category_id instanceof Uuid) {
        expect(category.category_id).toBe(category_id);
      }
    });
  });

  it('should change name', () => {
    const category = Category.create({
      name: 'Movie',
    });
    const validateSpy = jest.spyOn(category, 'validate');

    category.changeName('other name');

    expect(category.name).toBe('other name');
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  it('should change description', () => {
    const category = Category.create({
      name: 'Movie',
    });

    category.changeDescription('some description');

    expect(category.description).toBe('some description');
  });

  it('should update category', () => {
    const category = Category.create({
      name: 'Movie',
    });

    category.update({
      name: 'other name',
      description: 'some description',
    });

    expect(category.name).toBe('other name');
    expect(category.description).toBe('some description');
  });

  it('should activate a category', () => {
    const category = Category.create({
      name: 'Movie',
      is_active: false,
    });

    category.activate();

    expect(category.is_active).toBe(true);
  });

  it('should deactivate a category', () => {
    const category = Category.create({
      name: 'Movie',
      is_active: true,
    });

    category.deactivate();

    expect(category.is_active).toBe(false);
  });
});
