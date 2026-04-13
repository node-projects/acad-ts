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

  public override Read(): void {
    this._reader.ReadNext();

    while (this._reader.ValueAsString !== DxfFileToken.EndSection) {
      let template: CadEntityTemplate | null = null;

      try {
        template = this.readEntity();
      } catch (ex) {
        if (!this._builder.Configuration.Failsafe) {
          throw ex;
        }

        this._builder.Notify(
          `Error while reading an entity at line ${this._reader.Position}`,
          NotificationType.Error,
          ex instanceof Error ? ex : undefined
        );

        while (this._reader.DxfCode !== DxfCode.Start) {
          this._reader.ReadNext();
        }
      }

      if (template === null) {
        continue;
      }

      this._builder.AddTemplate(template);

      const owner = this._builder.TryGetObjectTemplate<ICadOwnerTemplate>(template.OwnerHandle);

      if (template.OwnerHandle === null) {
        this._builder.ModelSpaceEntities.add(template.CadObject);
      } else if (owner) {
        owner.OwnedObjectsHandlers.add(template.CadObject.handle);
      } else {
        this._builder.OrphanTemplates.push(template);
      }
    }
  }
}
