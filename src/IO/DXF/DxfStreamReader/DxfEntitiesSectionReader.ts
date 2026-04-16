import { DxfSectionReaderBase } from './DxfSectionReaderBase.js';
import { IDxfStreamReader } from './IDxfStreamReader.js';
import { DxfDocumentBuilder } from '../DxfDocumentBuilder.js';
import { DxfCode } from '../../../DxfCode.js';
import { DxfFileToken } from '../../../DxfFileToken.js';
import { CadEntityTemplate } from '../../Templates/CadEntityTemplate.js';
import { ICadOwnerTemplate } from '../../Templates/ICadOwnerTemplate.js';
import { NotificationType } from '../../NotificationEventHandler.js';

export class DxfEntitiesSectionReader extends DxfSectionReaderBase {
  public constructor(reader: IDxfStreamReader, builder: DxfDocumentBuilder) {
    super(reader, builder);
  }

  public override read(): void {
    this._reader.readNext();

    while (this._reader.valueAsString !== DxfFileToken.endSection) {
      let template: CadEntityTemplate | null = null;

      try {
        template = this.readEntity();
      } catch (ex) {
        if (!this._builder.configuration.failsafe) {
          throw ex;
        }

        this._builder.notify(
          `Error while reading an entity at line ${this._reader.position}`,
          NotificationType.Error,
          ex instanceof Error ? ex : undefined
        );

        while (this._reader.dxfCode !== DxfCode.Start) {
          this._reader.readNext();
        }
      }

      if (template === null) {
        continue;
      }

      this._builder.addTemplate(template);

      const owner = this._builder.tryGetObjectTemplate<ICadOwnerTemplate>(template.ownerHandle);

      if (template.ownerHandle === null) {
        this._builder.modelSpaceEntities.add(template.cadObject);
      } else if (owner) {
        owner.ownedObjectsHandlers.add(template.cadObject.handle);
      } else {
        this._builder.orphanTemplates.push(template);
      }
    }
  }
}
