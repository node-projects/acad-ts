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
  public get sectionName(): string {
    return DxfFileToken.blocksSection;
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
      this._writeBlock(b.blockEntity);
      this._processEntities(b);
      this._writeBlockEnd(b.blockEnd);
    }
  }

  private _writeBlock(block: Block): void {
    const map = DxfClassMap.create(Block);

    this._writer.write(DxfCode.Start, block.objectName);

    this.writeCommonObjectData(block);

    this.writeCommonEntityData(block);

    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.blockBegin);

    if (block.xRefPath) {
      this._writer.write(1, block.xRefPath, map);
    }
    this._writer.write(2, block.name, map);
    this._writer.write(70, block.flags, map);

    if (this.version >= ACadVersion.AC1015 && block.isUnloaded) {
      this._writer.write(71, block.isUnloaded ? 1 : 0, map);
    }

    this._writer.writeVector(10, block.basePoint, map);

    this._writer.write(3, block.name, map);
    this._writer.write(4, block.comments, map);
  }

  private _processEntities(b: BlockRecord): void {
    if (b.name === BlockRecord.modelSpaceName || b.name === BlockRecord.paperSpaceName) {
      for (const e of b.entities) {
        if (e instanceof Seqend) {
          // skip
        }

        this.holder.entities.push(e);
      }
    } else {
      for (const e of b.entities) {
        this.writeEntity(e);
      }
    }
  }

  private _writeBlockEnd(block: BlockEnd): void {
    this._writer.write(DxfCode.Start, block.objectName);

    this.writeCommonObjectData(block);

    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.entity);

    this._writer.write(8, block.layer.name);

    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.blockEnd);
  }
}
