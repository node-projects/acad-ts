import { Entity } from './Entity.js';

/**
 * An array-like collection of entities that has an associated Seqend terminator entity.
 * In C# this was SeqendCollection<T>.
 */
export class SeqendCollection<T extends Entity> extends Array<T> {
  Seqend: Entity | null = null;

  constructor(...items: T[]) {
    super(...items);
    Object.setPrototypeOf(this, SeqendCollection.prototype);
  }
}
