import { Entity } from '../entity'
import { ValueObject } from '../value-object'

export interface IRepository<E extends Entity, EntityId extends ValueObject> {
  insert(entity: Entity): Promise<void>
  bulkInsert(entities: E[]): Promise<void>
  update(entity: Entity): Promise<void>
  delete(entity_id: EntityId): Promise<void>

  findById(entity_id: EntityId): Promise<E | null>
  findAll(): Promise<E[]>

  getEntity(): new (...args: any[]) => E
}
