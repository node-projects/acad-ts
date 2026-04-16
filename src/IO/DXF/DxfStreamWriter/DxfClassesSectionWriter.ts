import { DxfSectionWriterBase } from './DxfSectionWriterBase.js';
import { IDxfStreamWriter } from './IDxfStreamWriter.js';
import { CadDocument } from '../../../CadDocument.js';
import { CadObjectHolder } from '../CadObjectHolder.js';
import { DxfWriterConfiguration } from '../DxfWriterConfiguration.js';
import { DxfFileToken } from '../../../DxfFileToken.js';
import { ACadVersion } from '../../../ACadVersion.js';

export class DxfClassesSectionWriter extends DxfSectionWriterBase {
  public get sectionName(): string {
    return DxfFileToken.classesSection;
  }

  public constructor(
    writer: IDxfStreamWriter,
    document: CadDocument,
    objectHolder: CadObjectHolder,
    configuration: DxfWriterConfiguration
  ) {
    super(writer, document, objectHolder, configuration);
  }

  protected writeSection(): void {
    const classes = this._document.classes;
    if (classes == null || typeof classes[Symbol.iterator] !== 'function') {
      return;
    }

    for (const c of classes) {
      this._writer.write(0, DxfFileToken.classEntry);
      this._writer.write(1, c.dxfName);
      this._writer.write(2, c.cppClassName);
      this._writer.write(3, c.applicationName);
      this._writer.write(90, c.proxyFlags as number);

      if (this.version > ACadVersion.AC1015) {
        this._writer.write(91, c.instanceCount);
      }

      this._writer.write(280, c.wasZombie);
      this._writer.write(281, c.isAnEntity);
    }
  }
}
