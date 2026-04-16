import { DxfSectionWriterBase } from './DxfSectionWriterBase.js';
import { IDxfStreamWriter } from './IDxfStreamWriter.js';
import { CadDocument } from '../../../CadDocument.js';
import { CadObjectHolder } from '../CadObjectHolder.js';
import { DxfWriterConfiguration } from '../DxfWriterConfiguration.js';
import { DxfFileToken } from '../../../DxfFileToken.js';
import { Entity } from '../../../Entities/Entity.js';

export class DxfEntitiesSectionWriter extends DxfSectionWriterBase {
  public get sectionName(): string {
    return DxfFileToken.entitiesSection;
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
    while (this.holder.entities.length > 0) {
      const item: Entity = this.holder.entities.shift()!;
      this.writeEntity(item);
    }
  }
}
