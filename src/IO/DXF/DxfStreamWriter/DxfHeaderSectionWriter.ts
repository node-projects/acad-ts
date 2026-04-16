import { DxfSectionWriterBase } from './DxfSectionWriterBase.js';
import { IDxfStreamWriter } from './IDxfStreamWriter.js';
import { CadDocument } from '../../../CadDocument.js';
import { CadObjectHolder } from '../CadObjectHolder.js';
import { DxfWriterConfiguration } from '../DxfWriterConfiguration.js';
import { DxfFileToken } from '../../../DxfFileToken.js';
import { DxfCode } from '../../../DxfCode.js';
import { DxfReferenceType } from '../../../Types/DxfReferenceType.js';
import { CadHeader } from '../../../Header/CadHeader.js';
import { CadSystemVariable } from '../../../CadSystemVariable.js';

export class DxfHeaderSectionWriter extends DxfSectionWriterBase {
  public get sectionName(): string {
    return DxfFileToken.headerSection;
  }

  public get header(): CadHeader {
    return this._document.header;
  }

  public constructor(
    writer: IDxfStreamWriter,
    document: CadDocument,
    holder: CadObjectHolder,
    configuration: DxfWriterConfiguration
  ) {
    super(writer, document, holder, configuration);
  }

  protected writeSection(): void {
    const map: Map<string, CadSystemVariable> = CadHeader.getHeaderMap();

    for (const [key, item] of map) {
      if (!this.configuration.writeAllHeaderVariables && !this.configuration.headerVariables.has(key)) {
        continue;
      }

      if ((item.referenceType & DxfReferenceType.Ignored) !== 0) {
        continue;
      }

      if (item.getValue(this.header) === null || item.getValue(this.header) === undefined) {
        continue;
      }

      this._writer.write(DxfCode.CLShapeText, key);

      if (key === '$HANDSEED') {
        this._writer.write(DxfCode.Handle, this._document.header.handleSeed);
        continue;
      }

      if (key === '$CECOLOR') {
        this._writer.write(62, this._document.header.currentEntityColor.getApproxIndex());
        continue;
      }

      for (const csv of item.dxfCodes) {
        const value = item.getSystemValue(csv, this._document.header);

        if (value === null || value === undefined) {
          continue;
        }

        this._writer.write(csv as number, value);
      }
    }
  }
}
