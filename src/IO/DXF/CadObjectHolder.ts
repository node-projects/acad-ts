import { Entity } from '../../Entities/Entity.js';
import { CadObject } from '../../CadObject.js';

export class CadObjectHolder {
  public entities: Entity[] = [];

  public objects: CadObject[] = [];
}
