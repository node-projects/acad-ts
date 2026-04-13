import { Entity } from '../../Entities/Entity.js';
import { CadTemplate } from '../Templates/CadTemplate.js';
import { CadObject } from '../../CadObject.js';
import { CadDictionary } from '../../Objects/CadDictionary.js';
import { CadEntityTemplate } from '../Templates/CadEntityTemplate.js';
import { CadBlockRecordTemplate } from '../Templates/CadBlockRecordTemplate.js';
import { CadPolyLineTemplate } from '../Templates/CadPolyLineTemplate.js';
import { CadInsertTemplate } from '../Templates/CadInsertTemplate.js';
import { Vertex } from '../../Entities/Vertex.js';
import { Seqend } from '../../Entities/Seqend.js';
import { AttributeEntity } from '../../Entities/AttributeEntity.js';
import { BlockRecord } from '../../Tables/BlockRecord.js';
import { ACadVersion } from '../../ACadVersion.js';
import { CadDocument } from '../../CadDocument.js';
import { DxfReaderConfiguration } from './DxfReaderConfiguration.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { ICadOwnerTemplate } from '../Templates/ICadOwnerTemplate.js';

export class DxfDocumentBuilder extends CadDocumentBuilder {
  public Configuration: DxfReaderConfiguration;

  public override get KeepUnknownEntities(): boolean {
    return this.Configuration.KeepUnknownEntities;
  }

  public override get KeepUnknownNonGraphicalObjects(): boolean {
    return this.Configuration.KeepUnknownNonGraphicalObjects;
  }

  public ModelSpaceEntities: Set<Entity> = new Set<Entity>();

  public ModelSpaceTemplate: CadBlockRecordTemplate | null = null;

  public OrphanTemplates: CadTemplate[] = [];

  public constructor(version: ACadVersion, document: CadDocument, configuration: DxfReaderConfiguration) {
    super(version, document);
    this.Configuration = configuration;
  }

  public override BuildDocument(): void {
    if (this.ModelSpaceTemplate === null) {
      const record = BlockRecord.ModelSpace;
      this.BlockRecords.add(record);
      this.ModelSpaceTemplate = new CadBlockRecordTemplate(record);
      this.AddTemplate(this.ModelSpaceTemplate);
    }

    this.createMissingHandles();

    for (const entity of this.ModelSpaceEntities) {
      this.ModelSpaceTemplate!.OwnedObjectsHandlers.add(entity.handle);
    }

    this.RegisterTables();

    this.BuildTables();

    this.buildDictionaries();

    for (const template of this.OrphanTemplates) {
      this.assignOwner(template);
    }

    super.BuildDocument();

    if (this.Configuration.CreateDefaults) {
      this.DocumentToBuild.createDefaults();
    }
  }

  public BuildEntities(): Entity[] {
    const entities: Entity[] = [];

    for (const item of this.cadObjectsTemplates.values()) {
      if (item instanceof CadEntityTemplate) {
        item.Build(this);
        item.SetUnlinkedReferences();
      }
    }

    for (const item of this.cadObjectsTemplates.values()) {
      if (item instanceof CadEntityTemplate && item.CadObject.owner === null) {
        item.CadObject.handle = 0;
        entities.push(item.CadObject);
      }
    }

    return entities;
  }

  private assignOwner(template: CadTemplate): void {
    if (template.CadObject.owner !== null || template.CadObject instanceof CadDictionary || !template.OwnerHandle) {
      return;
    }

    const ownerResult = this.TryGetObjectTemplate(template.OwnerHandle);
    if (ownerResult) {
      const owner = ownerResult;
      if (owner instanceof CadBlockRecordTemplate && template.CadObject instanceof Entity) {
        // The entries should be assigned in the blocks or entities section
      } else if (owner instanceof CadPolyLineTemplate && template.CadObject instanceof Vertex) {
        owner.OwnedObjectsHandlers.add(template.CadObject.handle);
      } else if (owner instanceof CadPolyLineTemplate && template.CadObject instanceof Seqend) {
        owner.SeqendHandle = template.CadObject.handle;
      } else if (owner instanceof CadInsertTemplate && template.CadObject instanceof AttributeEntity) {
        owner.OwnedObjectsHandlers.add(template.CadObject.handle);
      } else if (owner instanceof CadInsertTemplate && template.CadObject instanceof Seqend) {
        owner.SeqendHandle = template.CadObject.handle;
      } else {
        this.Notify(`Owner ${owner.constructor.name} with handle ${template.OwnerHandle} assignation not implemented for ${template.CadObject.constructor.name} with handle ${template.CadObject.handle}`, NotificationType.Warning);
      }
    } else {
      this.Notify(`Owner ${template.OwnerHandle} not found for ${template.constructor.name} with handle ${template.CadObject.handle}`, NotificationType.Warning);
    }
  }
}
