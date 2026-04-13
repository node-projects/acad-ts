import { DxfSectionWriterBase } from './DxfSectionWriterBase.js';
import { IDxfStreamWriter } from './IDxfStreamWriter.js';
import { CadDocument } from '../../../CadDocument.js';
import { CadObjectHolder } from '../CadObjectHolder.js';
import { DxfWriterConfiguration } from '../DxfWriterConfiguration.js';
import { DxfFileToken } from '../../../DxfFileToken.js';
import { DxfCode } from '../../../DxfCode.js';
import { DxfSubclassMarker } from '../../../DxfSubclassMarker.js';
import { DxfClassMap } from '../../../DxfClassMap.js';
import { ACadVersion } from '../../../ACadVersion.js';
import { Block } from '../../../Blocks/Block.js';
import { BlockEnd } from '../../../Blocks/BlockEnd.js';
import { BlockRecord } from '../../../Tables/BlockRecord.js';
import { Entity } from '../../../Entities/Entity.js';
import { Seqend } from '../../../Entities/Seqend.js';

export class DxfBlocksSectionWriter extends DxfSectionWriterBase {
  public get SectionName(): string {
    return DxfFileToken.BlocksSection;
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
    for (const b of this._document.blockRecords) {
      this.writeBlock(b.blockEntity);
      this.processEntities(b);
      this.writeBlockEnd(b.blockEnd);
    }
  }

  private writeBlock(block: Block): void {
    const map = DxfClassMap.Create(Block);

    this._writer.Write(DxfCode.Start, block.objectName);

    this.writeCommonObjectData(block);

    this.writeCommonEntityData(block);

    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.BlockBegin);

    if (block.xRefPath) {
      this._writer.Write(1, block.xRefPath, map);
    }
    this._writer.Write(2, block.name, map);
    this._writer.Write(70, block.flags, map);

    if (this.Version >= ACadVersion.AC1015 && block.isUnloaded) {
      this._writer.Write(71, block.isUnloaded ? 1 : 0, map);
    }

    this._writer.WriteVector(10, block.basePoint, map);

    this._writer.Write(3, block.name, map);
    this._writer.Write(4, block.comments, map);
  }

  private processEntities(b: BlockRecord): void {
    if (b.name === BlockRecord.ModelSpaceName || b.name === BlockRecord.PaperSpaceName) {
      for (const e of b.entities) {
        if (e instanceof Seqend) {
          // skip
        }

        this.Holder.Entities.push(e);
      }
    } else {
      for (const e of b.entities) {
        this.writeEntity(e);
      }
    }
  }

  private writeBlockEnd(block: BlockEnd): void {
    this._writer.Write(DxfCode.Start, block.objectName);

    this.writeCommonObjectData(block);

    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.Entity);

    this._writer.Write(8, block.layer.name);

    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.BlockEnd);
  }
}
