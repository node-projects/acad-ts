import { NonGraphicalObject } from './NonGraphicalObject.js';
import { CellStyle } from '../Entities/TableEntity.js';
import type { CadObject } from '../CadObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';

/** Named table-cell styles stored in the table style's extension dictionary. */
export class CellStyleMap extends NonGraphicalObject {
  cellStyles: CellStyle[] = [];

  override get objectName(): string { return DxfFileToken.objectCellStyleMap; }
  override get subclassMarker(): string { return DxfSubclassMarker.cellStyleMap; }

  override clone(): CadObject {
    const clone = super.clone() as CellStyleMap;
    clone.cellStyles = this.cellStyles.map(style => Object.assign(new CellStyle(), style));
    return clone;
  }
}
