import { CellStyleMap } from '../../Objects/CellStyleMap.js';
import { CellStyle } from '../../Entities/TableEntity.js';
import { CadTemplate } from './CadTemplate.js';
import { CadCellStyleTemplate } from './CadTableEntityTemplate.js';
import type { CadDocumentBuilder } from '../CadDocumentBuilder.js';

export class CadCellStyleMapTemplate extends CadTemplate<CellStyleMap> {
  styles: CadCellStyleTemplate[] = [];
  currentEntry?: CellStyle;

  constructor() { super(new CellStyleMap()); }

  addEntry(): void {
    this.currentEntry = new CellStyle();
    (this.cadObject as CellStyleMap).cellStyles.push(this.currentEntry);
    this.styles.push(new CadCellStyleTemplate(this.currentEntry));
  }

  protected override _build(builder: CadDocumentBuilder): void {
    super._build(builder);
    for (const style of this.styles) style.build(builder);
  }
}
