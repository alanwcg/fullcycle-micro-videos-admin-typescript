import { Category } from '../category.entity'

describe('Category Validator', () => {
  describe('create command', () => {
    it('should contain error messages with name property', () => {
      expect(() =>
        Category.create({
          name: null,
        }),
      ).containsErrorMessages({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      })

      expect(() =>
        Category.create({
          name: '',
        }),
      ).containsErrorMessages({
        name: ['name should not be empty'],
      })

      expect(() =>
        Category.create({
          name: 5 as any,
        }),
      ).containsErrorMessages({
        name: [
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      })

      expect(() =>
        Category.create({
          name: 't'.repeat(256),
        }),
      ).containsErrorMessages({
        name: ['name must be shorter than or equal to 255 characters'],
      })
    })

    it('should contain error messages with description property', () => {
      expect(() =>
        Category.create({ description: 5 } as any),
      ).containsErrorMessages({
        description: ['description must be a string'],
      })
    })

    it('should a invalid category using is_active property', () => {
      expect(() =>
        Category.create({ is_active: 5 } as any),
      ).containsErrorMessages({
        is_active: ['is_active must be a boolean value'],
      })
    })
  })

  describe('changeName method', () => {
    it('should contain error messages with name property', () => {
      const category = Category.create({ name: 'Movie' })
      expect(() => category.changeName(null)).containsErrorMessages({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      })

      expect(() => category.changeName('')).containsErrorMessages({
        name: ['name should not be empty'],
      })

      expect(() => category.changeName(5 as any)).containsErrorMessages({
        name: [
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      })

      expect(() => category.changeName('t'.repeat(256))).containsErrorMessages({
        name: ['name must be shorter than or equal to 255 characters'],
      })
    })
  })

  describe('changeDescription method', () => {
    it('should contain error messages with description property', () => {
      const category = Category.create({ name: 'Movie' })
      expect(() => category.changeDescription(5 as any)).containsErrorMessages({
        description: ['description must be a string'],
      })
    })
  })
})
