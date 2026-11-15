import { NonGraphicalObject } from './NonGraphicalObject.js';
import { CellStyle } from '../Entities/TableEntity.js';
import type { CadObject } from '../CadObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { tableOwnedList } from '../Entities/TableOwnedList.js';
import type { CadDocument } from '../CadDocument.js';

/** Named table-cell styles stored in the table style's extension dictionary. */
export class CellStyleMap extends NonGraphicalObject {
  private _cellStyles: CellStyle[] = tableOwnedList(() => this);
  get cellStyles(): CellStyle[] { return this._cellStyles; }
  set cellStyles(value: CellStyle[]) { if (value !== this._cellStyles) { this._cellStyles.length = 0; this._cellStyles.push(...value); } }

  override get objectName(): string { return DxfFileToken.objectCellStyleMap; }
  override get subclassMarker(): string { return DxfSubclassMarker.cellStyleMap; }

  override clone(): CadObject {
    const clone = super.clone() as CellStyleMap;
    clone._cellStyles = tableOwnedList(() => clone);
    clone.cellStyles.push(...this.cellStyles.map(style => style.clone()));
    return clone;
  }
  override assignDocument(document: CadDocument): void { super.assignDocument(document); for (const style of this.cellStyles) style.owner = this; }
  override unassignDocument(): void { super.unassignDocument(); for (const style of this.cellStyles) { style.owner = null; style.owner = this; } }
}
