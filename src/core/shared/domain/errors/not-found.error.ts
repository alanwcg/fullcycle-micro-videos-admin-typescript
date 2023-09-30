import { Entity } from '../entity';

export class NotFoundError extends Error {
  constructor(id: any[] | any, entityClass: new (...args: any[]) => Entity) {
    const idsStr = Array.isArray(id) ? id.join(', ') : id;
    super(`${entityClass.name} not found using ID ${idsStr}`);
    this.name = 'NotFoundError';
  }
}
