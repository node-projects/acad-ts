import { Entity } from '../../Entities/Entity.js';
import { CadObject } from '../../CadObject.js';

export class CadObjectHolder {
  public Entities: Entity[] = [];

  public Objects: CadObject[] = [];
}
