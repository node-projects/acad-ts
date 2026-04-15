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

  public Read(): void {
    this._reader.ReadNext();

    while (this._reader.ValueAsString !== DxfFileToken.EndSection) {
      if (this._reader.ValueAsString === DxfFileToken.TableEntry) {
        this.readTable();
      } else {
        throw new DxfException(`Unexpected token at the beginning of a table: ${this._reader.ValueAsString}`, this._reader.Position);
      }

      if ((this._reader.ValueAsString as string) === DxfFileToken.EndTable) {
        this._reader.ReadNext();
      } else {
        throw new DxfException(`Unexpected token at the end of a table: ${this._reader.ValueAsString}`, this._reader.Position);
      }
    }
  }

  private readTable(): void {
    // Debug.Assert(this._reader.ValueAsString == DxfFileToken.TableEntry);

    this._reader.ReadNext();

    let nentries = 0;
    let template: CadTemplate | null = null;
    const edata = new Map<string, ExtendedDataRecord[]>();

    const commonData = this.readCommonObjectData() as { name: string | null, handle: number, ownerHandle: number | null, xdictHandle: number | null, reactors: Set<number> };
    const { name, handle, ownerHandle, xdictHandle, reactors } = commonData;

    if (this._reader.DxfCode === DxfCode.Subclass) {
      while (this._reader.Code !== DxfCode.Start) {
        switch (this._reader.Code as number) {
          case 70:
            nentries = this._reader.ValueAsInt;
            break;
          case 100:
            if (this._reader.ValueAsString === DxfSubclassMarker.DimensionStyleTable) {
              while (this._reader.Code !== DxfCode.Start) {
                this._reader.ReadNext();
              }
              break;
            }
            // Debug.Assert(this._reader.ValueAsString == DxfSubclassMarker.Table);
            break;
          case 1001:
            this.readExtendedData(edata);
            break;
          default:
            this._builder.Notify(`[AcDbSymbolTable] Unhandled dxf code ${this._reader.Code} at line ${this._reader.Position}.`);
            break;
        }

        if (this._reader.Code === DxfCode.Start) {
          break;
        }

        this._reader.ReadNext();
      }
    } else if (this._reader.ValueAsString === DxfFileToken.EndTable) {
      return;
    } else {
      this._reader.ReadNext();
    }

    switch (name) {
      case DxfFileToken.TableAppId:
        template = new CadTableTemplate(new AppIdsTable());
        this.readEntries(template as CadTableTemplate<AppId>);
        template.CadObject.handle = handle;
        this._builder.AppIds = template.CadObject as AppIdsTable;
        break;
      case DxfFileToken.TableBlockRecord:
        template = new CadBlockCtrlObjectTemplate(new BlockRecordsTable());
        this.readEntries(template as CadBlockCtrlObjectTemplate);
        template.CadObject.handle = handle;
        this._builder.BlockRecords = template.CadObject as BlockRecordsTable;
        break;
      case DxfFileToken.TableVport:
        template = new CadTableTemplate(new VPortsTable());
        this.readEntries(template as CadTableTemplate<VPort>);
        template.CadObject.handle = handle;
        this._builder.VPorts = template.CadObject as VPortsTable;
        break;
      case DxfFileToken.TableLinetype:
        template = new CadTableTemplate(new LineTypesTable());
        this.readEntries(template as CadTableTemplate<LineType>);
        template.CadObject.handle = handle;
        this._builder.LineTypesTable = template.CadObject as LineTypesTable;
        break;
      case DxfFileToken.TableLayer:
        template = new CadTableTemplate(new LayersTable());
        this.readEntries(template as CadTableTemplate<Layer>);
        template.CadObject.handle = handle;
        this._builder.Layers = template.CadObject as LayersTable;
        break;
      case DxfFileToken.TableStyle:
        template = new CadTableTemplate(new TextStylesTable());
        this.readEntries(template as CadTableTemplate<TextStyle>);
        template.CadObject.handle = handle;
        this._builder.TextStyles = template.CadObject as TextStylesTable;
        break;
      case DxfFileToken.TableView:
        template = new CadTableTemplate(new ViewsTable());
        this.readEntries(template as CadTableTemplate<View>);
        template.CadObject.handle = handle;
        this._builder.Views = template.CadObject as ViewsTable;
        break;
      case DxfFileToken.TableUcs:
        template = new CadTableTemplate(new UCSTable());
        this.readEntries(template as CadTableTemplate<UCS>);
        template.CadObject.handle = handle;
        this._builder.UCSs = template.CadObject as UCSTable;
        break;
      case DxfFileToken.TableDimstyle:
        template = new CadTableTemplate(new DimensionStylesTable());
        this.readEntries(template as CadTableTemplate<DimensionStyle>);
        template.CadObject.handle = handle;
        this._builder.DimensionStyles = template.CadObject as DimensionStylesTable;
        break;
      default:
        throw new DxfException(`Unknown table name ${name}`);
    }

    // Debug.Assert(ownerHandle == null || ownerHandle === 0);

    template.OwnerHandle = ownerHandle ?? null;
    template.XDictHandle = xdictHandle;
    template.ReactorsHandles = reactors;
    template.EDataTemplateByAppName = edata;

    this._builder.AddTemplate(template);
  }

  private readEntries<T extends TableEntry>(tableTemplate: CadTableTemplate<T>): void {
    while (this._reader.ValueAsString !== DxfFileToken.EndTable) {
      this._reader.ReadNext();

      let template: ICadTableEntryTemplate | null = null;

      switch (tableTemplate.CadObject.objectName) {
        case DxfFileToken.TableAppId:
          template = this.readTableEntry(new CadTableEntryTemplate(new AppId()), this.readAppId.bind(this));
          break;
        case DxfFileToken.TableBlockRecord: {
          const block = new CadBlockRecordTemplate();
          template = this.readTableEntry(block, this.readBlockRecord.bind(this));

          if (block.CadObject.name.toUpperCase() === BlockRecord.ModelSpaceName.toUpperCase()) {
            this._builder.ModelSpaceTemplate = block;
          }
          break;
        }
        case DxfFileToken.TableDimstyle:
          template = this.readTableEntry(new CadDimensionStyleTemplate(), this.readDimensionStyle.bind(this));
          break;
        case DxfFileToken.TableLayer:
          template = this.readTableEntry(new CadLayerTemplate(), this.readLayer.bind(this));
          break;
        case DxfFileToken.TableLinetype:
          template = this.readTableEntry(new CadLineTypeTemplate(), this.readLineType.bind(this));
          break;
        case DxfFileToken.TableStyle:
          template = this.readTableEntry(new CadTableEntryTemplate(new TextStyle()), this.readTextStyle.bind(this));
          break;
        case DxfFileToken.TableUcs:
          template = this.readTableEntry(new CadUcsTemplate(), this.readUcs.bind(this));
          break;
        case DxfFileToken.TableView:
          template = this.readTableEntry(new CadViewTemplate(), this.readView.bind(this));
          break;
        case DxfFileToken.TableVport:
          template = this.readTableEntry(new CadVPortTemplate(), this.readVPort.bind(this));
          break;
        default:
          // Debug.Fail
          break;
      }

      if (template !== null) {
        const entry = template.CadObject as T;
        if (tableTemplate.CadObject.contains(template.Name) && this._builder.Configuration.Failsafe) {
          this._builder.Notify(`Duplicated entry with name ${template.Name} found in ${template.CadObject.objectName}`, NotificationType.Warning);

          tableTemplate.CadObject.remove(template.Name);
          tableTemplate.CadObject.add(entry);
        } else {
          tableTemplate.CadObject.add(entry);
        }

        this._builder.AddTemplate(template);
      }
    }
  }

  private readTableEntry<TTemplate extends CadTableEntryTemplate>(template: TTemplate, readEntry: ReadEntryDelegate<TTemplate>): ICadTableEntryTemplate {
    const map = DxfMap.create(template.CadObject.constructor);

    while (this._reader.DxfCode !== DxfCode.Start) {
      if (!readEntry(template, map.subClasses.get(template.CadObject.subclassMarker)!)) {
        const isExtendedData = { value: false };
        this.readCommonTableEntryCodes(template, isExtendedData, map);
        if (isExtendedData.value) {
          continue;
        }
      }

      if (this._reader.Code !== DxfCode.Start) {
        this._reader.ReadNext();
      }
    }

    return template;
  }

  private readCommonTableEntryCodes<T extends TableEntry>(template: CadTableEntryTemplate<T>, isExtendedData: { value: boolean }, map?: DxfMap): void {
    isExtendedData.value = false;
    switch (this._reader.Code as number) {
      case 2:
        template.CadObject.name = this._reader.ValueAsString;
        break;
      case 70:
        template.CadObject.flags = this._reader.ValueAsUShort as StandardFlags;
        break;
      case 100:
        // Debug.Assert
        break;
      default:
        this.readCommonCodes(template, isExtendedData, map);
        break;
    }
  }

  private readAppId(template: CadTableEntryTemplate<AppId>, map: DxfClassMap): boolean {
    switch (this._reader.Code as number) {
      default:
        return this.tryAssignCurrentValue(template.CadObject, map);
    }
  }

  private readBlockRecord(template: CadBlockRecordTemplate, map: DxfClassMap): boolean {
    switch (this._reader.Code as number) {
      case 340:
        template.LayoutHandle = this._reader.ValueAsHandle;
        return true;
      default:
        return this.tryAssignCurrentValue(template.CadObject, map);
    }
  }

  private readDimensionStyle(template: CadDimensionStyleTemplate, map: DxfClassMap): boolean {
    const dimensionStyle = template.CadObject;

    switch (this._reader.Code as number) {
      case 3:
        dimensionStyle.postFix = this._reader.ValueAsString;
        return true;
      case 4:
        dimensionStyle.alternateDimensioningSuffix = this._reader.ValueAsString;
        return true;
      case 5:
        template.DIMBL_Name = this._reader.ValueAsString;
        return true;
      case 6:
        template.DIMBLK1_Name = this._reader.ValueAsString;
        return true;
      case 7:
        template.DIMBLK2_Name = this._reader.ValueAsString;
        return true;
      case 40:
        try {
          dimensionStyle.scaleFactor = this._reader.ValueAsDouble;
        } catch (ex: unknown) {
          dimensionStyle.scaleFactor = MathHelper.Epsilon;
          this._builder.Notify(`[${dimensionStyle.subclassMarker}] Assignation error for scaleFactor.`, NotificationType.Warning, ex instanceof Error ? ex : null);
        }
        return true;
      case 41:
        try {
          dimensionStyle.arrowSize = this._reader.ValueAsDouble;
        } catch (ex: unknown) {
          this._builder.Notify(`[${dimensionStyle.subclassMarker}] Assignation error for arrowSize.`, NotificationType.Warning, ex instanceof Error ? ex : null);
        }
        return true;
      case 42:
        dimensionStyle.extensionLineOffset = this._reader.ValueAsDouble;
        return true;
      case 43:
        dimensionStyle.dimensionLineIncrement = this._reader.ValueAsDouble;
        return true;
      case 44:
        dimensionStyle.extensionLineExtension = this._reader.ValueAsDouble;
        return true;
      case 45:
        dimensionStyle.rounding = this._reader.ValueAsDouble;
        return true;
      case 46:
        dimensionStyle.dimensionLineExtension = this._reader.ValueAsDouble;
        return true;
      case 47:
        dimensionStyle.plusTolerance = this._reader.ValueAsDouble;
        return true;
      case 48:
        dimensionStyle.minusTolerance = this._reader.ValueAsDouble;
        return true;
      case 49:
        dimensionStyle.fixedExtensionLineLength = this._reader.ValueAsDouble;
        return true;
      case 50:
        try {
          dimensionStyle.joggedRadiusDimensionTransverseSegmentAngle = this._reader.ValueAsAngle;
        } catch (ex: unknown) {
          this._builder.Notify(`[${dimensionStyle.subclassMarker}] Assignation error for joggedRadiusDimensionTransverseSegmentAngle.`, NotificationType.Warning, ex instanceof Error ? ex : null);
        }
        return true;
      case 69:
        dimensionStyle.textBackgroundFillMode = this._reader.ValueAsShort as DimensionTextBackgroundFillMode;
        return true;
      case 70:
        if (!template.DxfFlagsAssigned) {
          template.DxfFlagsAssigned = true;
          return true;
        } else if (this._reader.ValueAsShort >= 0) {
          dimensionStyle.textBackgroundColor = new Color(this._reader.ValueAsShort);
        }
        return true;
      case 71:
        dimensionStyle.generateTolerances = this._reader.ValueAsBool;
        return true;
      case 72:
        dimensionStyle.limitsGeneration = this._reader.ValueAsBool;
        return true;
      case 73:
        dimensionStyle.textInsideHorizontal = this._reader.ValueAsBool;
        return true;
      case 74:
        dimensionStyle.textOutsideHorizontal = this._reader.ValueAsBool;
        return true;
      case 75:
        dimensionStyle.suppressFirstExtensionLine = this._reader.ValueAsBool;
        return true;
      case 76:
        dimensionStyle.suppressSecondExtensionLine = this._reader.ValueAsBool;
        return true;
      case 77:
        dimensionStyle.textVerticalAlignment = this._reader.ValueAsShort as DimensionTextVerticalAlignment;
        return true;
      case 78:
        dimensionStyle.zeroHandling = this._reader.ValueAsShort as ZeroHandling;
        return true;
      case 79:
        dimensionStyle.angularZeroHandling = this._reader.ValueAsShort as AngularZeroHandling;
        return true;
      case 90:
        dimensionStyle.arcLengthSymbolPosition = this._reader.ValueAsShort as ArcLengthSymbolPosition;
        return true;
      case 105:
        dimensionStyle.handle = this._reader.ValueAsHandle;
        return true;
      case 140:
        try {
          dimensionStyle.textHeight = this._reader.ValueAsDouble;
        } catch (ex: unknown) {
          this._builder.Notify(`[${dimensionStyle.subclassMarker}] Assignation error for textHeight.`, NotificationType.Warning, ex instanceof Error ? ex : null);
        }
        return true;
      case 141:
        dimensionStyle.centerMarkSize = this._reader.ValueAsDouble;
        return true;
      case 142:
        dimensionStyle.tickSize = this._reader.ValueAsDouble;
        return true;
      case 143:
        dimensionStyle.alternateUnitScaleFactor = this._reader.ValueAsDouble;
        return true;
      case 144:
        dimensionStyle.linearScaleFactor = this._reader.ValueAsDouble;
        return true;
      case 145:
        dimensionStyle.textVerticalPosition = this._reader.ValueAsDouble;
        return true;
      case 146:
        dimensionStyle.toleranceScaleFactor = this._reader.ValueAsDouble;
        return true;
      case 147:
        dimensionStyle.dimensionLineGap = this._reader.ValueAsDouble;
        return true;
      case 148:
        dimensionStyle.alternateUnitRounding = this._reader.ValueAsDouble;
        return true;
      case 170:
        dimensionStyle.alternateUnitDimensioning = this._reader.ValueAsBool;
        return true;
      case 171:
        dimensionStyle.alternateUnitDecimalPlaces = this._reader.ValueAsShort;
        return true;
      case 172:
        dimensionStyle.textOutsideExtensions = this._reader.ValueAsBool;
        return true;
      case 173:
        dimensionStyle.separateArrowBlocks = this._reader.ValueAsBool;
        return true;
      case 174:
        dimensionStyle.textInsideExtensions = this._reader.ValueAsBool;
        return true;
      case 175:
        dimensionStyle.suppressOutsideExtensions = this._reader.ValueAsBool;
        return true;
      case 176:
        dimensionStyle.dimensionLineColor = new Color(this._reader.ValueAsShort);
        return true;
      case 177:
        dimensionStyle.extensionLineColor = new Color(this._reader.ValueAsShort);
        return true;
      case 178:
        dimensionStyle.textColor = new Color(this._reader.ValueAsShort);
        return true;
      case 179:
        dimensionStyle.angularDecimalPlaces = this._reader.ValueAsShort;
        return true;
      case 270:
        dimensionStyle.linearUnitFormat = this._reader.ValueAsShort as LinearUnitFormat;
        return true;
      case 271:
        dimensionStyle.decimalPlaces = this._reader.ValueAsShort;
        return true;
      case 272:
        dimensionStyle.toleranceDecimalPlaces = this._reader.ValueAsShort;
        return true;
      case 273:
        dimensionStyle.alternateUnitFormat = this._reader.ValueAsShort as LinearUnitFormat;
        return true;
      case 274:
        dimensionStyle.alternateUnitToleranceDecimalPlaces = this._reader.ValueAsShort;
        return true;
      case 275:
        dimensionStyle.angularUnit = this._reader.ValueAsShort as AngularUnitFormat;
        return true;
      case 276:
        dimensionStyle.fractionFormat = this._reader.ValueAsShort as FractionFormat;
        return true;
      case 277:
        dimensionStyle.linearUnitFormat = this._reader.ValueAsShort as LinearUnitFormat;
        return true;
      case 278:
        dimensionStyle.decimalSeparator = String.fromCharCode(this._reader.ValueAsShort);
        return true;
      case 279:
        dimensionStyle.textMovement = this._reader.ValueAsShort as TextMovement;
        return true;
      case 280:
        dimensionStyle.textHorizontalAlignment = this._reader.ValueAsShort as DimensionTextHorizontalAlignment;
        return true;
      case 281:
        dimensionStyle.suppressFirstDimensionLine = this._reader.ValueAsBool;
        return true;
      case 282:
        dimensionStyle.suppressSecondDimensionLine = this._reader.ValueAsBool;
        return true;
      case 283:
        dimensionStyle.toleranceAlignment = this._reader.ValueAsShort as ToleranceAlignment;
        return true;
      case 284:
        dimensionStyle.toleranceZeroHandling = this._reader.ValueAsShort as ZeroHandling;
        return true;
      case 285:
        dimensionStyle.alternateUnitZeroHandling = this._reader.ValueAsShort as ZeroHandling;
        return true;
      case 286:
        dimensionStyle.alternateUnitToleranceZeroHandling = this._reader.ValueAsShort as ZeroHandling;
        return true;
      case 287:
        dimensionStyle.dimensionFit = this._reader.ValueAsShort;
        return true;
      case 288:
        dimensionStyle.cursorUpdate = this._reader.ValueAsBool;
        return true;
      case 289:
        dimensionStyle.dimensionTextArrowFit = this._reader.ValueAsShort as TextArrowFitType;
        return true;
      case 290:
        dimensionStyle.isExtensionLineLengthFixed = this._reader.ValueAsBool;
        return true;
      case 340:
        template.TextStyleHandle = this._reader.ValueAsHandle;
        return true;
      case 341:
        template.DIMLDRBLK = this._reader.ValueAsHandle;
        return true;
      case 342:
        template.DIMBLK = this._reader.ValueAsHandle;
        return true;
      case 343:
        template.DIMBLK1 = this._reader.ValueAsHandle;
        return true;
      case 344:
        template.DIMBLK2 = this._reader.ValueAsHandle;
        return true;
      case 345:
        template.Dimltype = this._reader.ValueAsHandle;
        return true;
      case 346:
        template.Dimltex1 = this._reader.ValueAsHandle;
        return true;
      case 347:
        template.Dimltex2 = this._reader.ValueAsHandle;
        return true;
      case 371:
        dimensionStyle.dimensionLineWeight = this._reader.ValueAsShort as LineWeightType;
        return true;
      case 372:
        dimensionStyle.extensionLineWeight = this._reader.ValueAsShort as LineWeightType;
        return true;
      default:
        return false;
    }
  }

  private readLayer(template: CadLayerTemplate, map: DxfClassMap): boolean {
    const layer = template.CadObject;

    switch (this._reader.Code as number) {
      case 6:
        template.LineTypeName = this._reader.ValueAsString;
        return true;
      case 62: {
        let index = this._reader.ValueAsShort;
        if (index < 0) {
          layer.isOn = false;
          index = Math.abs(index);
        }

        const color = new Color(index);
        if (color.isByBlock || color.isByLayer) {
          this._builder.Notify(`Wrong index ${index} for layer ${layer.name}`, NotificationType.Warning);
        } else {
          layer.color = new Color(index);
        }
        return true;
      }
      case 347:
        template.MaterialHandle = this._reader.ValueAsHandle;
        return true;
      case 348:
        return true;
      case 390:
        layer.plotStyleName = this._reader.ValueAsHandle;
        return true;
      case 430:
        template.TrueColorName = this._reader.ValueAsString;
        return true;
      default:
        return this.tryAssignCurrentValue(template.CadObject, map);
    }
  }

  private readLineType(template: CadLineTypeTemplate, map: DxfClassMap): boolean {
    switch (this._reader.Code as number) {
      case 40:
        template.TotalLen = this._reader.ValueAsDouble;
        return true;
      case 49:
        do {
          template.SegmentTemplates.push(this.readLineTypeSegment());
        } while (this._reader.Code === 49);
        return true;
      case 73:
        return true;
      default:
        return this.tryAssignCurrentValue(template.CadObject, map);
    }
  }

  private readLineTypeSegment(): CadLineTypeTemplate.SegmentTemplate {
    const template = new CadLineTypeTemplate.SegmentTemplate();
    template.Segment.length = this._reader.ValueAsDouble;

    this._reader.ReadNext();

    while (this._reader.Code !== 49 && this._reader.Code !== 0) {
      switch (this._reader.Code as number) {
        case 9:
          template.Segment.text = this._reader.ValueAsString;
          break;
        case 44:
          template.Segment.offset = new XY(this._reader.ValueAsDouble, template.Segment.offset.y);
          break;
        case 45:
          template.Segment.offset = new XY(template.Segment.offset.x, this._reader.ValueAsDouble);
          break;
        case 46:
          template.Segment.scale = this._reader.ValueAsDouble;
          break;
        case 50:
          template.Segment.rotation = this._reader.ValueAsAngle;
          break;
        case 74:
          template.Segment.shapeFlags = this._reader.ValueAsUShort as LineTypeShapeFlags;
          break;
        case 75:
          template.Segment.shapeNumber = this._reader.ValueAsInt;
          break;
        case 340:
          break;
        default:
          this._builder.Notify(`[LineTypeSegment] Unhandled dxf code ${this._reader.Code} with value ${this._reader.ValueAsString}, position ${this._reader.Position}`, NotificationType.None);
          break;
      }

      this._reader.ReadNext();
    }

    return template;
  }

  private readTextStyle(template: CadTableEntryTemplate<TextStyle>, map: DxfClassMap): boolean {
    switch (this._reader.Code as number) {
      case 2:
        if (this._reader.ValueAsString) {
          template.CadObject.name = this._reader.ValueAsString;
        }
        return true;
      default:
        return this.tryAssignCurrentValue(template.CadObject, map);
    }
  }

  private readUcs(template: CadUcsTemplate, map: DxfClassMap): boolean {
    switch (this._reader.Code as number) {
      default:
        return this.tryAssignCurrentValue(template.CadObject, map);
    }
  }

  private readView(template: CadViewTemplate, map: DxfClassMap): boolean {
    switch (this._reader.Code as number) {
      case 348:
        template.VisualStyleHandle = this._reader.ValueAsHandle;
        return true;
      default:
        return this.tryAssignCurrentValue(template.CadObject, map);
    }
  }

  private readVPort(template: CadVPortTemplate, map: DxfClassMap): boolean {
    switch (this._reader.Code as number) {
      case 65:
      case 73:
        return true;
      case 348:
        template.StyleHandle = this._reader.ValueAsHandle;
        return true;
      default:
        return this.tryAssignCurrentValue(template.CadObject, map);
    }
  }
}
