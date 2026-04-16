import { DxfSectionReaderBase } from './DxfSectionReaderBase.js';
import { IDxfStreamReader } from './IDxfStreamReader.js';
import { DxfDocumentBuilder } from '../DxfDocumentBuilder.js';
import { CadTemplate } from '../../Templates/CadTemplate.js';
import { CadTableTemplate } from '../../Templates/CadTableTemplate.js';
import { CadTableEntryTemplate, ICadTableEntryTemplate } from '../../Templates/CadTableEntryTemplate.js';
import { CadBlockRecordTemplate } from '../../Templates/CadBlockRecordTemplate.js';
import { CadBlockCtrlObjectTemplate } from '../../Templates/CadBlockCtrlObjectTemplate.js';
import { CadDimensionStyleTemplate } from '../../Templates/CadDimensionStyleTemplate.js';
import { CadLayerTemplate } from '../../Templates/CadLayerTemplate.js';
import { CadLineTypeTemplate } from '../../Templates/CadLineTypeTemplate.js';
import { CadUcsTemplate } from '../../Templates/CadUcsTemplate.js';
import { CadViewTemplate } from '../../Templates/CadViewTemplate.js';
import { CadVPortTemplate } from '../../Templates/CadVPortTemplate.js';
import { AppId } from '../../../Tables/AppId.js';
import { BlockRecord } from '../../../Tables/BlockRecord.js';
import { DimensionStyle } from '../../../Tables/DimensionStyle.js';
import { Layer } from '../../../Tables/Layer.js';
import { LineType } from '../../../Tables/LineType.js';
import { TextStyle } from '../../../Tables/TextStyle.js';
import { UCS } from '../../../Tables/UCS.js';
import { View } from '../../../Tables/View.js';
import { VPort } from '../../../Tables/VPort.js';
import { TableEntry } from '../../../Tables/TableEntry.js';
import { AppIdsTable } from '../../../Tables/Collections/AppIdsTable.js';
import { BlockRecordsTable } from '../../../Tables/Collections/BlockRecordsTable.js';
import { VPortsTable } from '../../../Tables/Collections/VPortsTable.js';
import { LineTypesTable } from '../../../Tables/Collections/LineTypesTable.js';
import { LayersTable } from '../../../Tables/Collections/LayersTable.js';
import { TextStylesTable } from '../../../Tables/Collections/TextStylesTable.js';
import { ViewsTable } from '../../../Tables/Collections/ViewsTable.js';
import { UCSTable } from '../../../Tables/Collections/UCSTable.js';
import { DimensionStylesTable } from '../../../Tables/Collections/DimensionStylesTable.js';
import { StandardFlags } from '../../../Tables/StandardFlags.js';
import { LineWeightType } from '../../../Types/LineWeightType.js';
import { LineTypeShapeFlags } from '../../../Tables/LinetypeShapeFlags.js';
import { DimensionTextVerticalAlignment } from '../../../Tables/DimensionTextVerticalAlignment.js';
import { DimensionTextHorizontalAlignment } from '../../../Tables/DimensionTextHorizontalAlignment.js';
import { DimensionTextBackgroundFillMode } from '../../../Tables/DimensionTextBackgroundFillMode.js';
import { TextArrowFitType } from '../../../Tables/TextArrowFitType.js';
import { TextMovement } from '../../../Tables/TextMovement.js';
import { ToleranceAlignment } from '../../../Tables/ToleranceAlignment.js';
import { ZeroHandling } from '../../../Tables/ZeroHandling.js';
import { AngularZeroHandling } from '../../../Tables/ZeroHandling.js';
import { ArcLengthSymbolPosition } from '../../../Tables/ArcLengthSymbolPosition.js';
import { FractionFormat } from '../../../Tables/FractionFormat.js';
import { LinearUnitFormat } from '../../../Types/Units/LinearUnitFormat.js';
import { AngularUnitFormat } from '../../../Types/Units/AngularUnitFormat.js';
import { Color } from '../../../Color.js';
import { DxfCode } from '../../../DxfCode.js';
import { DxfFileToken } from '../../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../../DxfSubclassMarker.js';
import { DxfMap } from '../../../DxfMap.js';
import { DxfClassMap } from '../../../DxfClassMap.js';
import { NotificationType } from '../../NotificationEventHandler.js';
import { DxfException } from '../../../Exceptions/DxfException.js';
import { ExtendedDataRecord } from '../../../XData/ExtendedDataRecord.js';
import { XY } from '../../../Math/XY.js';
import { MathHelper } from '../../../Math/MathHelper.js';

export type ReadEntryDelegate<TTemplate extends CadTableEntryTemplate = CadTableEntryTemplate> = (template: TTemplate, map: DxfClassMap) => boolean;

export class DxfTablesSectionReader extends DxfSectionReaderBase {

  constructor(reader: IDxfStreamReader, builder: DxfDocumentBuilder) {
    super(reader, builder);
  }

  public read(): void {
    this._reader.readNext();

    while (this._reader.valueAsString !== DxfFileToken.endSection) {
      if (this._reader.valueAsString === DxfFileToken.tableEntry) {
        this._readTable();
      } else {
        throw new DxfException(`Unexpected token at the beginning of a table: ${this._reader.valueAsString}`, this._reader.position);
      }

      if ((this._reader.valueAsString as string) === DxfFileToken.endTable) {
        this._reader.readNext();
      } else {
        throw new DxfException(`Unexpected token at the end of a table: ${this._reader.valueAsString}`, this._reader.position);
      }
    }
  }

  private _readTable(): void {
    // Debug.Assert(this._reader.ValueAsString == DxfFileToken.TableEntry);

    this._reader.readNext();

    let nentries = 0;
    let template: CadTemplate | null = null;
    const edata = new Map<string, ExtendedDataRecord[]>();

    const commonData = this.readCommonObjectData() as { name: string | null, handle: number, ownerHandle: number | null, xdictHandle: number | null, reactors: Set<number> };
    const { name, handle, ownerHandle, xdictHandle, reactors } = commonData;

    if (this._reader.dxfCode === DxfCode.Subclass) {
      while (this._reader.code !== DxfCode.Start) {
        switch (this._reader.code as number) {
          case 70:
            nentries = this._reader.valueAsInt;
            break;
          case 100:
            if (this._reader.valueAsString === DxfSubclassMarker.dimensionStyleTable) {
              while (this._reader.code !== DxfCode.Start) {
                this._reader.readNext();
              }
              break;
            }
            // Debug.Assert(this._reader.ValueAsString == DxfSubclassMarker.Table);
            break;
          case 1001:
            this.readExtendedData(edata);
            break;
          default:
            this._builder.notify(`[AcDbSymbolTable] Unhandled dxf code ${this._reader.code} at line ${this._reader.position}.`);
            break;
        }

        if (this._reader.code === DxfCode.Start) {
          break;
        }

        this._reader.readNext();
      }
    } else if (this._reader.valueAsString === DxfFileToken.endTable) {
      return;
    } else {
      this._reader.readNext();
    }

    switch (name) {
      case DxfFileToken.tableAppId:
        template = new CadTableTemplate(new AppIdsTable());
        this._readEntries(template as CadTableTemplate<AppId>);
        template.cadObject.handle = handle;
        this._builder.appIds = template.cadObject as AppIdsTable;
        break;
      case DxfFileToken.tableBlockRecord:
        template = new CadBlockCtrlObjectTemplate(new BlockRecordsTable());
        this._readEntries(template as CadBlockCtrlObjectTemplate);
        template.cadObject.handle = handle;
        this._builder.blockRecords = template.cadObject as BlockRecordsTable;
        break;
      case DxfFileToken.tableVport:
        template = new CadTableTemplate(new VPortsTable());
        this._readEntries(template as CadTableTemplate<VPort>);
        template.cadObject.handle = handle;
        this._builder.vPorts = template.cadObject as VPortsTable;
        break;
      case DxfFileToken.tableLinetype:
        template = new CadTableTemplate(new LineTypesTable());
        this._readEntries(template as CadTableTemplate<LineType>);
        template.cadObject.handle = handle;
        this._builder.lineTypesTable = template.cadObject as LineTypesTable;
        break;
      case DxfFileToken.tableLayer:
        template = new CadTableTemplate(new LayersTable());
        this._readEntries(template as CadTableTemplate<Layer>);
        template.cadObject.handle = handle;
        this._builder.layers = template.cadObject as LayersTable;
        break;
      case DxfFileToken.tableStyle:
        template = new CadTableTemplate(new TextStylesTable());
        this._readEntries(template as CadTableTemplate<TextStyle>);
        template.cadObject.handle = handle;
        this._builder.textStyles = template.cadObject as TextStylesTable;
        break;
      case DxfFileToken.tableView:
        template = new CadTableTemplate(new ViewsTable());
        this._readEntries(template as CadTableTemplate<View>);
        template.cadObject.handle = handle;
        this._builder.views = template.cadObject as ViewsTable;
        break;
      case DxfFileToken.tableUcs:
        template = new CadTableTemplate(new UCSTable());
        this._readEntries(template as CadTableTemplate<UCS>);
        template.cadObject.handle = handle;
        this._builder.ucSs = template.cadObject as UCSTable;
        break;
      case DxfFileToken.tableDimstyle:
        template = new CadTableTemplate(new DimensionStylesTable());
        this._readEntries(template as CadTableTemplate<DimensionStyle>);
        template.cadObject.handle = handle;
        this._builder.dimensionStyles = template.cadObject as DimensionStylesTable;
        break;
      default:
        throw new DxfException(`Unknown table name ${name}`);
    }

    // Debug.Assert(ownerHandle == null || ownerHandle === 0);

    template.ownerHandle = ownerHandle ?? null;
    template.xDictHandle = xdictHandle;
    template.reactorsHandles = reactors;
    template.eDataTemplateByAppName = edata;

    this._builder.addTemplate(template);
  }

  private _readEntries<T extends TableEntry>(tableTemplate: CadTableTemplate<T>): void {
    while (this._reader.valueAsString !== DxfFileToken.endTable) {
      this._reader.readNext();

      let template: ICadTableEntryTemplate | null = null;

      switch (tableTemplate.cadObject.objectName) {
        case DxfFileToken.tableAppId:
          template = this._readTableEntry(new CadTableEntryTemplate(new AppId()), this._readAppId.bind(this));
          break;
        case DxfFileToken.tableBlockRecord: {
          const block = new CadBlockRecordTemplate();
          template = this._readTableEntry(block, this._readBlockRecord.bind(this));

          if (block.cadObject.name.toUpperCase() === BlockRecord.modelSpaceName.toUpperCase()) {
            this._builder.modelSpaceTemplate = block;
          }
          break;
        }
        case DxfFileToken.tableDimstyle:
          template = this._readTableEntry(new CadDimensionStyleTemplate(), this._readDimensionStyle.bind(this));
          break;
        case DxfFileToken.tableLayer:
          template = this._readTableEntry(new CadLayerTemplate(), this._readLayer.bind(this));
          break;
        case DxfFileToken.tableLinetype:
          template = this._readTableEntry(new CadLineTypeTemplate(), this._readLineType.bind(this));
          break;
        case DxfFileToken.tableStyle:
          template = this._readTableEntry(new CadTableEntryTemplate(new TextStyle()), this._readTextStyle.bind(this));
          break;
        case DxfFileToken.tableUcs:
          template = this._readTableEntry(new CadUcsTemplate(), this._readUcs.bind(this));
          break;
        case DxfFileToken.tableView:
          template = this._readTableEntry(new CadViewTemplate(), this._readView.bind(this));
          break;
        case DxfFileToken.tableVport:
          template = this._readTableEntry(new CadVPortTemplate(), this._readVPort.bind(this));
          break;
        default:
          // Debug.Fail
          break;
      }

      if (template !== null) {
        const entry = template.cadObject as T;
        if (tableTemplate.cadObject.contains(template.name) && this._builder.configuration.failsafe) {
          this._builder.notify(`Duplicated entry with name ${template.name} found in ${template.cadObject.objectName}`, NotificationType.Warning);

          tableTemplate.cadObject.remove(template.name);
          tableTemplate.cadObject.add(entry);
        } else {
          tableTemplate.cadObject.add(entry);
        }

        this._builder.addTemplate(template);
      }
    }
  }

  private _readTableEntry<TTemplate extends CadTableEntryTemplate>(template: TTemplate, readEntry: ReadEntryDelegate<TTemplate>): ICadTableEntryTemplate {
    const map = DxfMap.create(template.cadObject.constructor);

    while (this._reader.dxfCode !== DxfCode.Start) {
      if (!readEntry(template, map.subClasses.get(template.cadObject.subclassMarker)!)) {
        const isExtendedData = { value: false };
        this._readCommonTableEntryCodes(template, isExtendedData, map);
        if (isExtendedData.value) {
          continue;
        }
      }

      if (this._reader.code !== DxfCode.Start) {
        this._reader.readNext();
      }
    }

    return template;
  }

  private _readCommonTableEntryCodes<T extends TableEntry>(template: CadTableEntryTemplate<T>, isExtendedData: { value: boolean }, map?: DxfMap): void {
    isExtendedData.value = false;
    switch (this._reader.code as number) {
      case 2: {
        const name = this._reader.valueAsString || (template.cadObject instanceof VPort ? VPort.defaultName : '');
        template.cadObject.name = name;
        break;
      }
      case 70:
        template.cadObject.flags = this._reader.valueAsUShort as StandardFlags;
        break;
      case 100:
        // Debug.Assert
        break;
      default:
        this.readCommonCodes(template, isExtendedData, map);
        break;
    }
  }

  private _readAppId(template: CadTableEntryTemplate<AppId>, map: DxfClassMap): boolean {
    switch (this._reader.code as number) {
      default:
        return this.tryAssignCurrentValue(template.cadObject, map);
    }
  }

  private _readBlockRecord(template: CadBlockRecordTemplate, map: DxfClassMap): boolean {
    switch (this._reader.code as number) {
      case 340:
        template.layoutHandle = this._reader.valueAsHandle;
        return true;
      default:
        return this.tryAssignCurrentValue(template.cadObject, map);
    }
  }

  private _readDimensionStyle(template: CadDimensionStyleTemplate, map: DxfClassMap): boolean {
    const dimensionStyle = template.cadObject;

    switch (this._reader.code as number) {
      case 3:
        dimensionStyle.postFix = this._reader.valueAsString;
        return true;
      case 4:
        dimensionStyle.alternateDimensioningSuffix = this._reader.valueAsString;
        return true;
      case 5:
        template.dimbL_Name = this._reader.valueAsString;
        return true;
      case 6:
        template.dimblK1_Name = this._reader.valueAsString;
        return true;
      case 7:
        template.dimblK2_Name = this._reader.valueAsString;
        return true;
      case 40:
        try {
          dimensionStyle.scaleFactor = this._reader.valueAsDouble;
        } catch (ex: unknown) {
          dimensionStyle.scaleFactor = MathHelper.epsilon;
          this._builder.notify(`[${dimensionStyle.subclassMarker}] Assignation error for scaleFactor.`, NotificationType.Warning, ex instanceof Error ? ex : null);
        }
        return true;
      case 41:
        try {
          dimensionStyle.arrowSize = this._reader.valueAsDouble;
        } catch (ex: unknown) {
          this._builder.notify(`[${dimensionStyle.subclassMarker}] Assignation error for arrowSize.`, NotificationType.Warning, ex instanceof Error ? ex : null);
        }
        return true;
      case 42:
        dimensionStyle.extensionLineOffset = this._reader.valueAsDouble;
        return true;
      case 43:
        dimensionStyle.dimensionLineIncrement = this._reader.valueAsDouble;
        return true;
      case 44:
        dimensionStyle.extensionLineExtension = this._reader.valueAsDouble;
        return true;
      case 45:
        dimensionStyle.rounding = this._reader.valueAsDouble;
        return true;
      case 46:
        dimensionStyle.dimensionLineExtension = this._reader.valueAsDouble;
        return true;
      case 47:
        dimensionStyle.plusTolerance = this._reader.valueAsDouble;
        return true;
      case 48:
        dimensionStyle.minusTolerance = this._reader.valueAsDouble;
        return true;
      case 49:
        dimensionStyle.fixedExtensionLineLength = this._reader.valueAsDouble;
        return true;
      case 50:
        try {
          dimensionStyle.joggedRadiusDimensionTransverseSegmentAngle = this._reader.valueAsAngle;
        } catch (ex: unknown) {
          this._builder.notify(`[${dimensionStyle.subclassMarker}] Assignation error for joggedRadiusDimensionTransverseSegmentAngle.`, NotificationType.Warning, ex instanceof Error ? ex : null);
        }
        return true;
      case 69:
        dimensionStyle.textBackgroundFillMode = this._reader.valueAsShort as DimensionTextBackgroundFillMode;
        return true;
      case 70:
        if (!template.dxfFlagsAssigned) {
          template.dxfFlagsAssigned = true;
          return true;
        } else if (this._reader.valueAsShort >= 0) {
          dimensionStyle.textBackgroundColor = new Color(this._reader.valueAsShort);
        }
        return true;
      case 71:
        dimensionStyle.generateTolerances = this._reader.valueAsBool;
        return true;
      case 72:
        dimensionStyle.limitsGeneration = this._reader.valueAsBool;
        return true;
      case 73:
        dimensionStyle.textInsideHorizontal = this._reader.valueAsBool;
        return true;
      case 74:
        dimensionStyle.textOutsideHorizontal = this._reader.valueAsBool;
        return true;
      case 75:
        dimensionStyle.suppressFirstExtensionLine = this._reader.valueAsBool;
        return true;
      case 76:
        dimensionStyle.suppressSecondExtensionLine = this._reader.valueAsBool;
        return true;
      case 77:
        dimensionStyle.textVerticalAlignment = this._reader.valueAsShort as DimensionTextVerticalAlignment;
        return true;
      case 78:
        dimensionStyle.zeroHandling = this._reader.valueAsShort as ZeroHandling;
        return true;
      case 79:
        dimensionStyle.angularZeroHandling = this._reader.valueAsShort as AngularZeroHandling;
        return true;
      case 90:
        dimensionStyle.arcLengthSymbolPosition = this._reader.valueAsShort as ArcLengthSymbolPosition;
        return true;
      case 105:
        dimensionStyle.handle = this._reader.valueAsHandle;
        return true;
      case 140:
        try {
          dimensionStyle.textHeight = this._reader.valueAsDouble;
        } catch (ex: unknown) {
          this._builder.notify(`[${dimensionStyle.subclassMarker}] Assignation error for textHeight.`, NotificationType.Warning, ex instanceof Error ? ex : null);
        }
        return true;
      case 141:
        dimensionStyle.centerMarkSize = this._reader.valueAsDouble;
        return true;
      case 142:
        dimensionStyle.tickSize = this._reader.valueAsDouble;
        return true;
      case 143:
        dimensionStyle.alternateUnitScaleFactor = this._reader.valueAsDouble;
        return true;
      case 144:
        dimensionStyle.linearScaleFactor = this._reader.valueAsDouble;
        return true;
      case 145:
        dimensionStyle.textVerticalPosition = this._reader.valueAsDouble;
        return true;
      case 146:
        dimensionStyle.toleranceScaleFactor = this._reader.valueAsDouble;
        return true;
      case 147:
        dimensionStyle.dimensionLineGap = this._reader.valueAsDouble;
        return true;
      case 148:
        dimensionStyle.alternateUnitRounding = this._reader.valueAsDouble;
        return true;
      case 170:
        dimensionStyle.alternateUnitDimensioning = this._reader.valueAsBool;
        return true;
      case 171:
        dimensionStyle.alternateUnitDecimalPlaces = this._reader.valueAsShort;
        return true;
      case 172:
        dimensionStyle.textOutsideExtensions = this._reader.valueAsBool;
        return true;
      case 173:
        dimensionStyle.separateArrowBlocks = this._reader.valueAsBool;
        return true;
      case 174:
        dimensionStyle.textInsideExtensions = this._reader.valueAsBool;
        return true;
      case 175:
        dimensionStyle.suppressOutsideExtensions = this._reader.valueAsBool;
        return true;
      case 176:
        dimensionStyle.dimensionLineColor = new Color(this._reader.valueAsShort);
        return true;
      case 177:
        dimensionStyle.extensionLineColor = new Color(this._reader.valueAsShort);
        return true;
      case 178:
        dimensionStyle.textColor = new Color(this._reader.valueAsShort);
        return true;
      case 179:
        dimensionStyle.angularDecimalPlaces = this._reader.valueAsShort;
        return true;
      case 270:
        dimensionStyle.linearUnitFormat = this._reader.valueAsShort as LinearUnitFormat;
        return true;
      case 271:
        dimensionStyle.decimalPlaces = this._reader.valueAsShort;
        return true;
      case 272:
        dimensionStyle.toleranceDecimalPlaces = this._reader.valueAsShort;
        return true;
      case 273:
        dimensionStyle.alternateUnitFormat = this._reader.valueAsShort as LinearUnitFormat;
        return true;
      case 274:
        dimensionStyle.alternateUnitToleranceDecimalPlaces = this._reader.valueAsShort;
        return true;
      case 275:
        dimensionStyle.angularUnit = this._reader.valueAsShort as AngularUnitFormat;
        return true;
      case 276:
        dimensionStyle.fractionFormat = this._reader.valueAsShort as FractionFormat;
        return true;
      case 277:
        dimensionStyle.linearUnitFormat = this._reader.valueAsShort as LinearUnitFormat;
        return true;
      case 278:
        dimensionStyle.decimalSeparator = String.fromCharCode(this._reader.valueAsShort);
        return true;
      case 279:
        dimensionStyle.textMovement = this._reader.valueAsShort as TextMovement;
        return true;
      case 280:
        dimensionStyle.textHorizontalAlignment = this._reader.valueAsShort as DimensionTextHorizontalAlignment;
        return true;
      case 281:
        dimensionStyle.suppressFirstDimensionLine = this._reader.valueAsBool;
        return true;
      case 282:
        dimensionStyle.suppressSecondDimensionLine = this._reader.valueAsBool;
        return true;
      case 283:
        dimensionStyle.toleranceAlignment = this._reader.valueAsShort as ToleranceAlignment;
        return true;
      case 284:
        dimensionStyle.toleranceZeroHandling = this._reader.valueAsShort as ZeroHandling;
        return true;
      case 285:
        dimensionStyle.alternateUnitZeroHandling = this._reader.valueAsShort as ZeroHandling;
        return true;
      case 286:
        dimensionStyle.alternateUnitToleranceZeroHandling = this._reader.valueAsShort as ZeroHandling;
        return true;
      case 287:
        dimensionStyle.dimensionFit = this._reader.valueAsShort;
        return true;
      case 288:
        dimensionStyle.cursorUpdate = this._reader.valueAsBool;
        return true;
      case 289:
        dimensionStyle.dimensionTextArrowFit = this._reader.valueAsShort as TextArrowFitType;
        return true;
      case 290:
        dimensionStyle.isExtensionLineLengthFixed = this._reader.valueAsBool;
        return true;
      case 340:
        template.textStyleHandle = this._reader.valueAsHandle;
        return true;
      case 341:
        template.dimldrblk = this._reader.valueAsHandle;
        return true;
      case 342:
        template.dimblk = this._reader.valueAsHandle;
        return true;
      case 343:
        template.dimblk1 = this._reader.valueAsHandle;
        return true;
      case 344:
        template.dimblk2 = this._reader.valueAsHandle;
        return true;
      case 345:
        template.dimltype = this._reader.valueAsHandle;
        return true;
      case 346:
        template.dimltex1 = this._reader.valueAsHandle;
        return true;
      case 347:
        template.dimltex2 = this._reader.valueAsHandle;
        return true;
      case 371:
        dimensionStyle.dimensionLineWeight = this._reader.valueAsShort as LineWeightType;
        return true;
      case 372:
        dimensionStyle.extensionLineWeight = this._reader.valueAsShort as LineWeightType;
        return true;
      default:
        return false;
    }
  }

  private _readLayer(template: CadLayerTemplate, map: DxfClassMap): boolean {
    const layer = template.cadObject;

    switch (this._reader.code as number) {
      case 6:
        template.lineTypeName = this._reader.valueAsString;
        return true;
      case 62: {
        let index = this._reader.valueAsShort;
        if (index < 0) {
          layer.isOn = false;
          index = Math.abs(index);
        }

        const color = new Color(index);
        if (color.isByBlock || color.isByLayer) {
          this._builder.notify(`Wrong index ${index} for layer ${layer.name}`, NotificationType.Warning);
        } else {
          layer.color = new Color(index);
        }
        return true;
      }
      case 347:
        template.materialHandle = this._reader.valueAsHandle;
        return true;
      case 348:
        return true;
      case 390:
        layer.plotStyleName = this._reader.valueAsHandle;
        return true;
      case 430:
        template.trueColorName = this._reader.valueAsString;
        return true;
      default:
        return this.tryAssignCurrentValue(template.cadObject, map);
    }
  }

  private _readLineType(template: CadLineTypeTemplate, map: DxfClassMap): boolean {
    switch (this._reader.code as number) {
      case 40:
        template.totalLen = this._reader.valueAsDouble;
        return true;
      case 49:
        do {
          template.segmentTemplates.push(this._readLineTypeSegment());
        } while (this._reader.code === 49);
        return true;
      case 73:
        return true;
      default:
        return this.tryAssignCurrentValue(template.cadObject, map);
    }
  }

  private _readLineTypeSegment(): CadLineTypeTemplate.SegmentTemplate {
    const template = new CadLineTypeTemplate.SegmentTemplate();
    template.segment.length = this._reader.valueAsDouble;

    this._reader.readNext();

    while (this._reader.code !== 49 && this._reader.code !== 0) {
      switch (this._reader.code as number) {
        case 9:
          template.segment.text = this._reader.valueAsString;
          break;
        case 44:
          template.segment.offset = new XY(this._reader.valueAsDouble, template.segment.offset.y);
          break;
        case 45:
          template.segment.offset = new XY(template.segment.offset.x, this._reader.valueAsDouble);
          break;
        case 46:
          template.segment.scale = this._reader.valueAsDouble;
          break;
        case 50:
          template.segment.rotation = this._reader.valueAsAngle;
          break;
        case 74:
          template.segment.shapeFlags = this._reader.valueAsUShort as LineTypeShapeFlags;
          break;
        case 75:
          template.segment.shapeNumber = this._reader.valueAsInt;
          break;
        case 340:
          break;
        default:
          this._builder.notify(`[LineTypeSegment] Unhandled dxf code ${this._reader.code} with value ${this._reader.valueAsString}, position ${this._reader.position}`, NotificationType.None);
          break;
      }

      this._reader.readNext();
    }

    return template;
  }

  private _readTextStyle(template: CadTableEntryTemplate<TextStyle>, map: DxfClassMap): boolean {
    switch (this._reader.code as number) {
      case 2:
        if (this._reader.valueAsString) {
          template.cadObject.name = this._reader.valueAsString;
        }
        return true;
      default:
        return this.tryAssignCurrentValue(template.cadObject, map);
    }
  }

  private _readUcs(template: CadUcsTemplate, map: DxfClassMap): boolean {
    switch (this._reader.code as number) {
      default:
        return this.tryAssignCurrentValue(template.cadObject, map);
    }
  }

  private _readView(template: CadViewTemplate, map: DxfClassMap): boolean {
    switch (this._reader.code as number) {
      case 348:
        template.visualStyleHandle = this._reader.valueAsHandle;
        return true;
      default:
        return this.tryAssignCurrentValue(template.cadObject, map);
    }
  }

  private _readVPort(template: CadVPortTemplate, map: DxfClassMap): boolean {
    switch (this._reader.code as number) {
      case 65:
      case 73:
        return true;
      case 348:
        template.styleHandle = this._reader.valueAsHandle;
        return true;
      default:
        return this.tryAssignCurrentValue(template.cadObject, map);
    }
  }
}
