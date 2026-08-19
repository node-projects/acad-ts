import { Entity } from '../../Entities/Entity.js';
import { ModelerGeometry } from '../../Entities/ModelerGeometry.js';
import { CadObject } from '../../CadObject.js';

export class CadObjectHolder {
  public entities: Entity[] = [];

  public modelerGeometries: ModelerGeometry[] = [];

  public objects: CadObject[] = [];
}
