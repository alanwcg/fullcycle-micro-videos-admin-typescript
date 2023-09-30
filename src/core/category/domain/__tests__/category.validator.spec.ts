import { Category } from '../category.entity';

describe('Category Validator', () => {
  describe('create command', () => {
    it('should contain error messages with name property', () => {
      const category = Category.create({ name: 't'.repeat(256) });

      expect(category.notification.hasErrors()).toBe(true);
      expect(category.notification).notificationContainsErrorMessages([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    });
  });

  describe('changeName method', () => {
    it('should contain error messages with name property', () => {
      const category = Category.create({ name: 'Movie' });

      category.changeName('t'.repeat(256));

      expect(category.notification.hasErrors()).toBe(true);
      expect(category.notification).notificationContainsErrorMessages([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    });
  });
});
