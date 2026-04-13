import { DxfSectionReaderBase } from './DxfSectionReaderBase.js';
import { IDxfStreamReader } from './IDxfStreamReader.js';
import { DxfDocumentBuilder } from '../DxfDocumentBuilder.js';
import { DxfCode } from '../../../DxfCode.js';
import { DxfFileToken } from '../../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../../DxfSubclassMarker.js';
import { DxfMap } from '../../../DxfMap.js';
import { Block } from '../../../Blocks/Block.js';
import { BlockEnd } from '../../../Blocks/BlockEnd.js';
import { BlockRecord } from '../../../Tables/BlockRecord.js';
import { CadBlockEntityTemplate } from '../../Templates/CadBlockEntityTemplate.js';
import { CadBlockRecordTemplate } from '../../Templates/CadBlockRecordTemplate.js';
import { CadEntityTemplate } from '../../Templates/CadEntityTemplate.js';
import { ICadOwnerTemplate } from '../../Templates/ICadOwnerTemplate.js';
import { DxfException } from '../../../Exceptions/DxfException.js';
import { NotificationType } from '../../NotificationEventHandler.js';

export class DxfBlockSectionReader extends DxfSectionReaderBase {
  public constructor(reader: IDxfStreamReader, builder: DxfDocumentBuilder) {
    super(reader, builder);
  }

  public override Read(): void {
    this._reader.ReadNext();

    while (this._reader.ValueAsString !== DxfFileToken.EndSection) {
      try {
        if (this._reader.ValueAsString === DxfFileToken.Block) {
          this.readBlock();
        } else {
          throw new DxfException(
            `Unexpected token at the BLOCKS table: ${this._reader.ValueAsString}`,
            this._reader.Position
          );
        }
      } catch (ex) {
        if (!this._builder.Configuration.Failsafe) {
          throw ex;
        }

        this._builder.Notify(
          `Error while reading a block at line ${this._reader.Position}`,
          NotificationType.Error,
          ex instanceof Error ? ex : undefined
        );

        while (
          !(this._reader.DxfCode === DxfCode.Start && this._reader.ValueAsString === DxfFileToken.EndSection) &&
          !(this._reader.DxfCode === DxfCode.Start && this._reader.ValueAsString === DxfFileToken.Block)
        ) {
          this._reader.ReadNext();
        }
      }
    }
  }

  private readBlock(): void {
    this._reader.ReadNext();

    const map = DxfMap.create(Block);

    const blckEntity = new Block();
    const template = new CadBlockEntityTemplate(blckEntity);

    let name: string | null = null;
    let record: BlockRecord | null = null;
    let recordTemplate: CadBlockRecordTemplate | null = null;

    while (this._reader.DxfCode !== DxfCode.Start) {
      switch (this._reader.Code as number) {
        case 2:
        case 3:
          name = this._reader.ValueAsString;
          if (name.toUpperCase() === '$MODEL_SPACE') {
            name = BlockRecord.ModelSpaceName;
          } else if (name.toUpperCase() === '$PAPER_SPACE') {
            name = BlockRecord.PaperSpaceName;
          }

          if (record === null) {
            record = this._builder.TryGetTableEntry<BlockRecord>(name);
            if (record) {
              record.blockEntity = blckEntity;
            } else {
              this._builder.Notify(
                `Block record [${name}] not found at line ${this._reader.Position}`,
                NotificationType.Warning
              );
            }
          }
          break;
        case 330:
          if (record === null) {
            record = this._builder.TryGetCadObject<BlockRecord>(this._reader.ValueAsHandle);
            if (record) {
              record.blockEntity = blckEntity;
            } else {
              this._builder.Notify(
                `Block record with handle [${this._reader.ValueAsString}] not found at line ${this._reader.Position}`,
                NotificationType.Warning
              );
            }
          }
          break;
        default:
          if (!this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(DxfSubclassMarker.BlockBegin))) {
            const isExtendedData = { value: false };
            this.readCommonEntityCodes(template, isExtendedData, map);
            if (isExtendedData.value) {
              continue;
            }
          }
          break;
      }

      this._reader.ReadNext();
    }

    if (record === null) {
      record = new BlockRecord(name ?? '');
      record.blockEntity = blckEntity;
      recordTemplate = new CadBlockRecordTemplate(record);

      this._builder.AddTemplate(recordTemplate);
      this._builder.BlockRecords.add(record);

      if (recordTemplate.CadObject.name.toUpperCase() === BlockRecord.ModelSpaceName.toUpperCase()) {
        this._builder.ModelSpaceTemplate = recordTemplate;
      }
    } else {
      recordTemplate = this._builder.TryGetObjectTemplate<CadBlockRecordTemplate>(record.handle);
      if (!recordTemplate) {
        recordTemplate = new CadBlockRecordTemplate(record);
      }
    }

    recordTemplate.BlockEntityTemplate = template;

    while (this._reader.ValueAsString !== DxfFileToken.EndBlock) {
      let entityTemplate: CadEntityTemplate | null = null;

      try {
        entityTemplate = this.readEntity();
      } catch (ex) {
        if (!this._builder.Configuration.Failsafe) {
          throw ex;
        }

        this._builder.Notify(
          `Error while reading a block with name ${record.name} at line ${this._reader.Position}`,
          NotificationType.Error,
          ex instanceof Error ? ex : undefined
        );

        while (this._reader.DxfCode !== DxfCode.Start) {
          this._reader.ReadNext();
        }
      }

      if (entityTemplate === null) {
        continue;
      }

      this._builder.AddTemplate(entityTemplate);

      if (entityTemplate.OwnerHandle === null) {
        recordTemplate.ReferenceTemplates.add(entityTemplate);
      } else {
        const owner = this._builder.TryGetObjectTemplate<ICadOwnerTemplate>(entityTemplate.OwnerHandle);
        if (owner) {
        owner.OwnedObjectsHandlers.add(entityTemplate.CadObject.handle);
        } else {
          this._builder.OrphanTemplates.push(entityTemplate);
        }
      }
    }

    this.readBlockEnd(record.blockEnd);
    this._builder.AddTemplate(template);
  }

  private readBlockEnd(block: BlockEnd): void {
    const map = DxfMap.create(BlockEnd);
    const template = new CadEntityTemplate(block);

    if (this._reader.DxfCode === DxfCode.Start) {
      this._reader.ReadNext();
    }

    while (this._reader.DxfCode !== DxfCode.Start) {
      if (!this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(DxfSubclassMarker.BlockEnd))) {
        const isExtendedData = { value: false };
        this.readCommonEntityCodes(template, isExtendedData, map);
        if (isExtendedData.value) {
          continue;
        }
      }

      this._reader.ReadNext();
    }

    this._builder.AddTemplate(template);
  }
}
