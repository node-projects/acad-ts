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

export type ReadEntryDelegate = (template: CadTableEntryTemplate, map: DxfClassMap) => boolean;

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

  private readEntries(tableTemplate: CadTableTemplate<any>): void {
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
        if (tableTemplate.CadObject.contains(template.Name) && this._builder.Configuration.Failsafe) {
          this._builder.Notify(`Duplicated entry with name ${template.Name} found in ${template.CadObject.objectName}`, NotificationType.Warning);

          tableTemplate.CadObject.remove(template.Name);
          tableTemplate.CadObject.add(template.CadObject);
        } else {
          tableTemplate.CadObject.add(template.CadObject);
        }

        this._builder.AddTemplate(template);
      }
    }
  }

  private readTableEntry(template: CadTableEntryTemplate, readEntry: ReadEntryDelegate): ICadTableEntryTemplate {
    const map = DxfMap.create(template.CadObject.constructor);

    while (this._reader.DxfCode !== DxfCode.Start) {
      if (!readEntry(template, map.subClasses.get(template.CadObject.SubclassMarker)!)) {
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

  private readCommonTableEntryCodes(template: CadTableEntryTemplate, isExtendedData: { value: boolean }, map?: DxfMap): void {
    isExtendedData.value = false;
    switch (this._reader.Code as number) {
      case 2:
        template.CadObject.Name = this._reader.ValueAsString;
        break;
      case 70:
        template.CadObject.Flags = this._reader.ValueAsUShort as StandardFlags;
        break;
      case 100:
        // Debug.Assert
        break;
      default:
        this.readCommonCodes(template, isExtendedData, map);
        break;
    }
  }

  private readAppId(template: CadTableEntryTemplate, map: DxfClassMap): boolean {
    switch (this._reader.Code as number) {
      default:
        return this.tryAssignCurrentValue(template.CadObject, map);
    }
  }

  private readBlockRecord(template: CadTableEntryTemplate, map: DxfClassMap): boolean {
    const tmp = template as CadBlockRecordTemplate;

    switch (this._reader.Code as number) {
      case 340:
        tmp.LayoutHandle = this._reader.ValueAsHandle;
        return true;
      default:
        return this.tryAssignCurrentValue(template.CadObject, map);
    }
  }

  private readDimensionStyle(template: CadTableEntryTemplate, map: DxfClassMap): boolean {
    const tmp = template as CadDimensionStyleTemplate;

    switch (this._reader.Code as number) {
      case 3:
        template.CadObject.PostFix = this._reader.ValueAsString;
        return true;
      case 4:
        template.CadObject.AlternateDimensioningSuffix = this._reader.ValueAsString;
        return true;
      case 5:
        tmp.DIMBL_Name = this._reader.ValueAsString;
        return true;
      case 6:
        tmp.DIMBLK1_Name = this._reader.ValueAsString;
        return true;
      case 7:
        tmp.DIMBLK2_Name = this._reader.ValueAsString;
        return true;
      case 40:
        try {
          template.CadObject.ScaleFactor = this._reader.ValueAsDouble;
        } catch (ex: any) {
          template.CadObject.ScaleFactor = MathHelper.Epsilon;
          this._builder.Notify(`[${template.CadObject.SubclassMarker}] Assignation error for ScaleFactor.`, NotificationType.Warning, ex);
        }
        return true;
      case 41:
        try {
          template.CadObject.ArrowSize = this._reader.ValueAsDouble;
        } catch (ex: any) {
          this._builder.Notify(`[${template.CadObject.SubclassMarker}] Assignation error for ArrowSize.`, NotificationType.Warning, ex);
        }
        return true;
      case 42:
        template.CadObject.ExtensionLineOffset = this._reader.ValueAsDouble;
        return true;
      case 43:
        template.CadObject.DimensionLineIncrement = this._reader.ValueAsDouble;
        return true;
      case 44:
        template.CadObject.ExtensionLineExtension = this._reader.ValueAsDouble;
        return true;
      case 45:
        template.CadObject.Rounding = this._reader.ValueAsDouble;
        return true;
      case 46:
        template.CadObject.DimensionLineExtension = this._reader.ValueAsDouble;
        return true;
      case 47:
        template.CadObject.PlusTolerance = this._reader.ValueAsDouble;
        return true;
      case 48:
        template.CadObject.MinusTolerance = this._reader.ValueAsDouble;
        return true;
      case 49:
        template.CadObject.FixedExtensionLineLength = this._reader.ValueAsDouble;
        return true;
      case 50:
        try {
          template.CadObject.JoggedRadiusDimensionTransverseSegmentAngle = this._reader.ValueAsAngle;
        } catch (ex: any) {
          this._builder.Notify(`[${template.CadObject.SubclassMarker}] Assignation error for JoggedRadiusDimensionTransverseSegmentAngle.`, NotificationType.Warning, ex);
        }
        return true;
      case 69:
        template.CadObject.TextBackgroundFillMode = this._reader.ValueAsShort as DimensionTextBackgroundFillMode;
        return true;
      case 70:
        if (!tmp.DxfFlagsAssigned) {
          tmp.DxfFlagsAssigned = true;
          return true;
        } else if (this._reader.ValueAsShort >= 0) {
          template.CadObject.TextBackgroundColor = new Color(this._reader.ValueAsShort);
        }
        return true;
      case 71:
        template.CadObject.GenerateTolerances = this._reader.ValueAsBool;
        return true;
      case 72:
        template.CadObject.LimitsGeneration = this._reader.ValueAsBool;
        return true;
      case 73:
        template.CadObject.TextInsideHorizontal = this._reader.ValueAsBool;
        return true;
      case 74:
        template.CadObject.TextOutsideHorizontal = this._reader.ValueAsBool;
        return true;
      case 75:
        template.CadObject.SuppressFirstExtensionLine = this._reader.ValueAsBool;
        return true;
      case 76:
        template.CadObject.SuppressSecondExtensionLine = this._reader.ValueAsBool;
        return true;
      case 77:
        template.CadObject.TextVerticalAlignment = this._reader.ValueAsShort as DimensionTextVerticalAlignment;
        return true;
      case 78:
        template.CadObject.ZeroHandling = this._reader.ValueAsShort as ZeroHandling;
        return true;
      case 79:
        template.CadObject.AngularZeroHandling = this._reader.ValueAsShort as AngularZeroHandling;
        return true;
      case 90:
        template.CadObject.ArcLengthSymbolPosition = this._reader.ValueAsShort as ArcLengthSymbolPosition;
        return true;
      case 105:
        template.CadObject.Handle = this._reader.ValueAsHandle;
        return true;
      case 140:
        try {
          template.CadObject.TextHeight = this._reader.ValueAsDouble;
        } catch (ex: any) {
          this._builder.Notify(`[${template.CadObject.SubclassMarker}] Assignation error for TextHeight.`, NotificationType.Warning, ex);
        }
        return true;
      case 141:
        template.CadObject.CenterMarkSize = this._reader.ValueAsDouble;
        return true;
      case 142:
        template.CadObject.TickSize = this._reader.ValueAsDouble;
        return true;
      case 143:
        template.CadObject.AlternateUnitScaleFactor = this._reader.ValueAsDouble;
        return true;
      case 144:
        template.CadObject.LinearScaleFactor = this._reader.ValueAsDouble;
        return true;
      case 145:
        template.CadObject.TextVerticalPosition = this._reader.ValueAsDouble;
        return true;
      case 146:
        template.CadObject.ToleranceScaleFactor = this._reader.ValueAsDouble;
        return true;
      case 147:
        template.CadObject.DimensionLineGap = this._reader.ValueAsDouble;
        return true;
      case 148:
        template.CadObject.AlternateUnitRounding = this._reader.ValueAsDouble;
        return true;
      case 170:
        template.CadObject.AlternateUnitDimensioning = this._reader.ValueAsBool;
        return true;
      case 171:
        template.CadObject.AlternateUnitDecimalPlaces = this._reader.ValueAsShort;
        return true;
      case 172:
        template.CadObject.TextOutsideExtensions = this._reader.ValueAsBool;
        return true;
      case 173:
        template.CadObject.SeparateArrowBlocks = this._reader.ValueAsBool;
        return true;
      case 174:
        template.CadObject.TextInsideExtensions = this._reader.ValueAsBool;
        return true;
      case 175:
        template.CadObject.SuppressOutsideExtensions = this._reader.ValueAsBool;
        return true;
      case 176:
        template.CadObject.DimensionLineColor = new Color(this._reader.ValueAsShort);
        return true;
      case 177:
        template.CadObject.ExtensionLineColor = new Color(this._reader.ValueAsShort);
        return true;
      case 178:
        template.CadObject.TextColor = new Color(this._reader.ValueAsShort);
        return true;
      case 179:
        template.CadObject.AngularDecimalPlaces = this._reader.ValueAsShort;
        return true;
      case 270:
        template.CadObject.LinearUnitFormat = this._reader.ValueAsShort as LinearUnitFormat;
        return true;
      case 271:
        template.CadObject.DecimalPlaces = this._reader.ValueAsShort;
        return true;
      case 272:
        template.CadObject.ToleranceDecimalPlaces = this._reader.ValueAsShort;
        return true;
      case 273:
        template.CadObject.AlternateUnitFormat = this._reader.ValueAsShort as LinearUnitFormat;
        return true;
      case 274:
        template.CadObject.AlternateUnitToleranceDecimalPlaces = this._reader.ValueAsShort;
        return true;
      case 275:
        template.CadObject.AngularUnit = this._reader.ValueAsShort as AngularUnitFormat;
        return true;
      case 276:
        template.CadObject.FractionFormat = this._reader.ValueAsShort as FractionFormat;
        return true;
      case 277:
        template.CadObject.LinearUnitFormat = this._reader.ValueAsShort as LinearUnitFormat;
        return true;
      case 278:
        template.CadObject.DecimalSeparator = String.fromCharCode(this._reader.ValueAsShort);
        return true;
      case 279:
        template.CadObject.TextMovement = this._reader.ValueAsShort as TextMovement;
        return true;
      case 280:
        template.CadObject.TextHorizontalAlignment = this._reader.ValueAsShort as DimensionTextHorizontalAlignment;
        return true;
      case 281:
        template.CadObject.SuppressFirstDimensionLine = this._reader.ValueAsBool;
        return true;
      case 282:
        template.CadObject.SuppressSecondDimensionLine = this._reader.ValueAsBool;
        return true;
      case 283:
        template.CadObject.ToleranceAlignment = this._reader.ValueAsShort as ToleranceAlignment;
        return true;
      case 284:
        template.CadObject.ToleranceZeroHandling = this._reader.ValueAsShort as ZeroHandling;
        return true;
      case 285:
        template.CadObject.AlternateUnitZeroHandling = this._reader.ValueAsShort as ZeroHandling;
        return true;
      case 286:
        template.CadObject.AlternateUnitToleranceZeroHandling = this._reader.ValueAsShort as ZeroHandling;
        return true;
      case 287:
        template.CadObject.DimensionFit = this._reader.ValueAsShort;
        return true;
      case 288:
        template.CadObject.CursorUpdate = this._reader.ValueAsBool;
        return true;
      case 289:
        template.CadObject.DimensionTextArrowFit = this._reader.ValueAsShort as TextArrowFitType;
        return true;
      case 290:
        template.CadObject.IsExtensionLineLengthFixed = this._reader.ValueAsBool;
        return true;
      case 340:
        tmp.TextStyleHandle = this._reader.ValueAsHandle;
        return true;
      case 341:
        tmp.DIMLDRBLK = this._reader.ValueAsHandle;
        return true;
      case 342:
        tmp.DIMBLK = this._reader.ValueAsHandle;
        return true;
      case 343:
        tmp.DIMBLK1 = this._reader.ValueAsHandle;
        return true;
      case 344:
        tmp.DIMBLK2 = this._reader.ValueAsHandle;
        return true;
      case 345:
        tmp.Dimltype = this._reader.ValueAsHandle;
        return true;
      case 346:
        tmp.Dimltex1 = this._reader.ValueAsHandle;
        return true;
      case 347:
        tmp.Dimltex2 = this._reader.ValueAsHandle;
        return true;
      case 371:
        template.CadObject.DimensionLineWeight = this._reader.ValueAsShort as LineWeightType;
        return true;
      case 372:
        template.CadObject.ExtensionLineWeight = this._reader.ValueAsShort as LineWeightType;
        return true;
      default:
        return false;
    }
  }

  private readLayer(template: CadTableEntryTemplate, map: DxfClassMap): boolean {
    const tmp = template as CadLayerTemplate;

    switch (this._reader.Code as number) {
      case 6:
        tmp.LineTypeName = this._reader.ValueAsString;
        return true;
      case 62: {
        let index = this._reader.ValueAsShort;
        if (index < 0) {
          template.CadObject.IsOn = false;
          index = Math.abs(index);
        }

        const color = new Color(index);
        if (color.isByBlock || color.isByLayer) {
          this._builder.Notify(`Wrong index ${index} for layer ${template.CadObject.Name}`, NotificationType.Warning);
        } else {
          template.CadObject.Color = new Color(index);
        }
        return true;
      }
      case 347:
        tmp.MaterialHandle = this._reader.ValueAsHandle;
        return true;
      case 348:
        return true;
      case 390:
        template.CadObject.PlotStyleName = this._reader.ValueAsHandle;
        return true;
      case 430:
        tmp.TrueColorName = this._reader.ValueAsString;
        return true;
      default:
        return this.tryAssignCurrentValue(template.CadObject, map);
    }
  }

  private readLineType(template: CadTableEntryTemplate, map: DxfClassMap): boolean {
    const tmp = template as CadLineTypeTemplate;

    switch (this._reader.Code as number) {
      case 40:
        tmp.TotalLen = this._reader.ValueAsDouble;
        return true;
      case 49:
        do {
          tmp.SegmentTemplates.push(this.readLineTypeSegment());
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

  private readTextStyle(template: CadTableEntryTemplate, map: DxfClassMap): boolean {
    switch (this._reader.Code as number) {
      case 2:
        if (this._reader.ValueAsString) {
          template.CadObject.Name = this._reader.ValueAsString;
        }
        return true;
      default:
        return this.tryAssignCurrentValue(template.CadObject, map);
    }
  }

  private readUcs(template: CadTableEntryTemplate, map: DxfClassMap): boolean {
    switch (this._reader.Code as number) {
      default:
        return this.tryAssignCurrentValue(template.CadObject, map);
    }
  }

  private readView(template: CadTableEntryTemplate, map: DxfClassMap): boolean {
    const tmp = template as CadViewTemplate;

    switch (this._reader.Code as number) {
      case 348:
        tmp.VisualStyleHandle = this._reader.ValueAsHandle;
        return true;
      default:
        return this.tryAssignCurrentValue(template.CadObject, map);
    }
  }

  private readVPort(template: CadTableEntryTemplate, map: DxfClassMap): boolean {
    const tmp = template as CadVPortTemplate;

    switch (this._reader.Code as number) {
      case 65:
      case 73:
        return true;
      case 348:
        tmp.StyleHandle = this._reader.ValueAsHandle;
        return true;
      default:
        return this.tryAssignCurrentValue(template.CadObject, map);
    }
  }
}
