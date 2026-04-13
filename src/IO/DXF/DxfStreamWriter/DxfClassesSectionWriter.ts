import { DxfSectionWriterBase } from './DxfSectionWriterBase.js';
import { IDxfStreamWriter } from './IDxfStreamWriter.js';
import { CadDocument } from '../../../CadDocument.js';
import { CadObjectHolder } from '../CadObjectHolder.js';
import { DxfWriterConfiguration } from '../DxfWriterConfiguration.js';
import { DxfFileToken } from '../../../DxfFileToken.js';
import { ACadVersion } from '../../../ACadVersion.js';

export class DxfClassesSectionWriter extends DxfSectionWriterBase {
  public get SectionName(): string {
    return DxfFileToken.ClassesSection;
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
      this._writer.Write(0, DxfFileToken.ClassEntry);
      this._writer.Write(1, c.dxfName);
      this._writer.Write(2, c.cppClassName);
      this._writer.Write(3, c.applicationName);
      this._writer.Write(90, c.proxyFlags as number);

      if (this.Version > ACadVersion.AC1015) {
        this._writer.Write(91, c.instanceCount);
      }

      this._writer.Write(280, c.wasZombie);
      this._writer.Write(281, c.isAnEntity);
    }
  }
}
