import { Entity } from '../../../../domain/entity'
import { NotFoundError } from '../../../../domain/errors/not-found-error'
import { Uuid } from '../../../../domain/value-objects/uuid.vo'
import { InMemoryRepository } from '../in-memory.repository'

type EntityStubConstructorProps = {
  entity_id?: Uuid
  name: string
  price: number
}

class EntityStub extends Entity {
  entity_id: Uuid
  name: string
  price: number

  constructor(props: EntityStubConstructorProps) {
    super()
    this.entity_id = props.entity_id ?? new Uuid()
    this.name = props.name
    this.price = props.price
  }

  toJSON() {
    return {
      entity_id: this.entity_id.id,
      name: this.name,
      price: this.price,
    }
  }
}

class InMemoryRepositoryStub extends InMemoryRepository<EntityStub, Uuid> {
  getEntity(): new (...args: any[]) => EntityStub {
    return EntityStub
  }
}

describe('InMemoryRepository Unit Tests', () => {
  let repo: InMemoryRepositoryStub

  beforeEach(() => {
    repo = new InMemoryRepositoryStub()
  })

  it('should insert a new entity', async () => {
    const entity = new EntityStub({
      entity_id: new Uuid(),
      name: 'test',
      price: 100,
    })

    await repo.insert(entity)

    expect(repo.items.length).toBe(1)
    expect(repo.items[0]).toEqual(entity)
  })

  it('should bulk insert entities', async () => {
    const entities = [
      new EntityStub({
        entity_id: new Uuid(),
        name: 'test',
        price: 100,
      }),
      new EntityStub({
        entity_id: new Uuid(),
        name: 'test',
        price: 100,
      }),
    ]

    await repo.bulkInsert(entities)

    expect(repo.items).toHaveLength(2)
    expect(repo.items[0]).toEqual(entities[0])
    expect(repo.items[1]).toEqual(entities[1])
  })

  it('should return all entities', async () => {
    const entity = new EntityStub({
      entity_id: new Uuid(),
      name: 'test',
      price: 100,
    })
    repo.items = [entity]

    const entities = await repo.findAll()

    expect(entities).toEqual([entity])
  })

  it('should throws error on update when entity is not found', async () => {
    const entity = new EntityStub({
      entity_id: new Uuid(),
      name: 'test',
      price: 100,
    })

    const promise = repo.update(entity)

    await expect(promise).rejects.toThrow(
      new NotFoundError(entity.entity_id, EntityStub),
    )
  })

  it('should update an entity', async () => {
    const entity = new EntityStub({
      entity_id: new Uuid(),
      name: 'test',
      price: 100,
    })
    repo.items = [entity]
    const updatedEntity = new EntityStub({
      entity_id: entity.entity_id,
      name: 'updated',
      price: 200,
    })

    await repo.update(updatedEntity)

    expect(updatedEntity).toEqual(repo.items[0])
  })

  it('should throws error on delete when entity is not found', async () => {
    const uuid = new Uuid()

    const promise = repo.delete(uuid)

    await expect(promise).rejects.toThrow(
      new NotFoundError(uuid.id, EntityStub),
    )
  })

  it('should delete an entity', async () => {
    const entity = new EntityStub({
      entity_id: new Uuid(),
      name: 'test',
      price: 100,
    })
    repo.items = [entity]

    await repo.delete(entity.entity_id)

    expect(repo.items).toHaveLength(0)
  })
})
