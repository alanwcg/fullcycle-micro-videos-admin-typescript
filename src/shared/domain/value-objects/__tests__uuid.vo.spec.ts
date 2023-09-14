import { InvalidUuidError, Uuid } from './uuid.vo'
import { v4 as generateUuid, validate as uuidValidate } from 'uuid'

describe('Uuid Unit Tests', () => {
  const validateSpy = jest.spyOn(Uuid.prototype as any, 'validate')

  it('should throw error when uuid is invalid', () => {
    expect(() => {
      new Uuid('invalid-uuid')
    }).toThrowError(new InvalidUuidError())
    expect(validateSpy).toHaveBeenCalledTimes(1)
  })

  it('should create a valid uuid', () => {
    const uuid = new Uuid()

    expect(uuid.id).toBeDefined()
    expect(uuidValidate(uuid.id)).toBe(true)
    expect(validateSpy).toHaveBeenCalledTimes(1)
  })

  it('should accept a valid uuid', () => {
    const value = generateUuid()
    const uuid = new Uuid(value)

    expect(uuid.id).toBe(value)
    expect(validateSpy).toHaveBeenCalledTimes(1)
  })
})
