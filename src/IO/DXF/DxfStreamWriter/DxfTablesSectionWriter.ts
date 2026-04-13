import { DxfSectionWriterBase } from './DxfSectionWriterBase.js';
import { IDxfStreamWriter } from './IDxfStreamWriter.js';
import { CadDocument } from '../../../CadDocument.js';
import { CadObjectHolder } from '../CadObjectHolder.js';
import { DxfWriterConfiguration } from '../DxfWriterConfiguration.js';
import { DxfFileToken } from '../../../DxfFileToken.js';
import { DxfCode } from '../../../DxfCode.js';
import { DxfSubclassMarker } from '../../../DxfSubclassMarker.js';
import { DxfClassMap } from '../../../DxfClassMap.js';
import { DxfMap } from '../../../DxfMap.js';
import { TableEntry } from '../../../Tables/TableEntry.js';
import { Table } from '../../../Tables/Collections/Table.js';
import { AppId } from '../../../Tables/AppId.js';
import { BlockRecord } from '../../../Tables/BlockRecord.js';
import { DimensionStyle } from '../../../Tables/DimensionStyle.js';
import { Layer } from '../../../Tables/Layer.js';
import { LineType } from '../../../Tables/LineType.js';
import { LineTypeShapeFlags } from '../../../Tables/LinetypeShapeFlags.js';
import { TextStyle } from '../../../Tables/TextStyle.js';
import { UCS } from '../../../Tables/UCS.js';
import { View } from '../../../Tables/View.js';
import { VPort } from '../../../Tables/VPort.js';
import { ArcLengthSymbolPosition } from '../../../Tables/ArcLengthSymbolPosition.js';
import { MathHelper } from '../../../Math/MathHelper.js';

export class DxfTablesSectionWriter extends DxfSectionWriterBase {
  public get SectionName(): string {
    return DxfFileToken.TablesSection;
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
    this.writeTable(this._document.vPorts);
    this.writeTable(this._document.lineTypes);
    this.writeTable(this._document.layers);
    this.writeTable(this._document.textStyles);
    this.writeTable(this._document.views);
    this.writeTable(this._document.uCSs);
    this.writeTable(this._document.appIds);
    this.writeTable(this._document.dimensionStyles, DxfSubclassMarker.DimensionStyleTable);
    this.writeTable(this._document.blockRecords);
  }

  private writeTable<T extends TableEntry>(table: Table<T>, subclass?: string): void {
    this._writer.Write(DxfCode.Start, DxfFileToken.TableEntry);
    this._writer.Write(DxfCode.SymbolTableName, table.objectName);

    this.writeCommonObjectData(table);

    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.Table);

    this._writer.Write(70, table.count);

    if (subclass) {
      this._writer.Write(DxfCode.Subclass, subclass);
    }

    for (const entry of table) {
      this.writeEntry(entry);
    }

    this._writer.Write(DxfCode.Start, DxfFileToken.EndTable);
  }

  private writeEntry<T extends TableEntry>(entry: T): void {
    const map = DxfMap.create(entry.constructor.name);

    this._writer.Write(DxfCode.Start, entry.objectName);

    this.writeCommonObjectData(entry);

    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.TableRecord);
    this._writer.Write(DxfCode.Subclass, entry.subclassMarker);

    if (entry instanceof TextStyle && (entry as TextStyle).isShapeFile) {
      this._writer.Write(DxfCode.SymbolTableName, '');
    } else {
      this._writer.Write(DxfCode.SymbolTableName, entry.name);
    }

    this._writer.Write(70, entry.flags);

    if (entry instanceof AppId) {
      // nothing
    } else if (entry instanceof BlockRecord) {
      this.writeBlockRecord(entry, map.subClasses.get(entry.subclassMarker)!);
    } else if (entry instanceof DimensionStyle) {
      this.writeDimensionStyle(entry, map.subClasses.get(entry.subclassMarker)!);
    } else if (entry instanceof Layer) {
      this.writeLayer(entry, map.subClasses.get(entry.subclassMarker)!);
    } else if (entry instanceof LineType) {
      this.writeLineType(entry, map.subClasses.get(entry.subclassMarker)!);
    } else if (entry instanceof TextStyle) {
      this.writeTextStyle(entry, map.subClasses.get(entry.subclassMarker)!);
    } else if (entry instanceof UCS) {
      this.writeUcs(entry, map.subClasses.get(entry.subclassMarker)!);
    } else if (entry instanceof View) {
      this.writeView(entry, map.subClasses.get(entry.subclassMarker)!);
    } else if (entry instanceof VPort) {
      this.writeVPort(entry, map.subClasses.get(entry.subclassMarker)!);
    }

    this.writeExtendedData(entry.extendedData);
  }

  private writeBlockRecord(block: BlockRecord, map: DxfClassMap): void {
    this._writer.WriteHandle(340, block.layout, map);

    this._writer.Write(70, block.units, map);
    this._writer.Write(280, block.isExplodable ? 1 : 0, map);
    this._writer.Write(281, block.canScale ? 1 : 0, map);
  }

  private writeDimensionStyle(style: DimensionStyle, map: DxfClassMap): void {
    this._writer.Write(3, style.postFix, map);
    this._writer.Write(4, style.alternateDimensioningSuffix, map);

    this._writer.Write(40, style.scaleFactor, map);
    this._writer.Write(41, style.arrowSize, map);
    this._writer.Write(42, style.extensionLineOffset, map);
    this._writer.Write(43, style.dimensionLineIncrement, map);
    this._writer.Write(44, style.extensionLineExtension, map);
    this._writer.Write(45, style.rounding, map);
    this._writer.Write(46, style.dimensionLineExtension, map);
    this._writer.Write(47, style.plusTolerance, map);
    this._writer.Write(48, style.minusTolerance, map);
    this._writer.Write(49, style.fixedExtensionLineLength, map);
    this._writer.Write(50, style.joggedRadiusDimensionTransverseSegmentAngle, map);

    if (style.textBackgroundFillMode !== 0) {
      this._writer.Write(69, style.textBackgroundFillMode, map);
      this._writer.Write(70, style.textBackgroundColor.getApproxIndex(), map);
    } else {
      this._writer.Write(70, 0, map);
    }

    if (style.arcLengthSymbolPosition !== ArcLengthSymbolPosition.AboveDimensionText) {
      this._writer.Write(90, style.arcLengthSymbolPosition as number);
    }

    this._writer.Write(140, style.textHeight);
    this._writer.Write(141, style.centerMarkSize);
    this._writer.Write(142, style.tickSize);
    this._writer.Write(143, style.alternateUnitScaleFactor);
    this._writer.Write(144, style.linearScaleFactor);
    this._writer.Write(145, style.textVerticalPosition);
    this._writer.Write(146, style.toleranceScaleFactor);
    this._writer.Write(147, style.dimensionLineGap);
    this._writer.Write(148, style.alternateUnitRounding);

    this._writer.Write(71, style.generateTolerances ? 1 : 0);
    this._writer.Write(72, style.limitsGeneration ? 1 : 0);
    this._writer.Write(73, style.textInsideHorizontal ? 1 : 0);
    this._writer.Write(74, style.textOutsideHorizontal ? 1 : 0);
    this._writer.Write(75, style.suppressFirstExtensionLine ? 1 : 0);
    this._writer.Write(76, style.suppressSecondExtensionLine ? 1 : 0);
    this._writer.Write(77, style.textVerticalAlignment as number);
    this._writer.Write(78, style.zeroHandling as number);
    this._writer.Write(79, style.angularZeroHandling as number);

    this._writer.Write(170, style.alternateUnitDimensioning ? 1 : 0);
    this._writer.Write(171, style.alternateUnitDecimalPlaces);
    this._writer.Write(172, style.textOutsideExtensions ? 1 : 0);
    this._writer.Write(173, style.separateArrowBlocks ? 1 : 0);
    this._writer.Write(174, style.textInsideExtensions ? 1 : 0);
    this._writer.Write(175, style.suppressOutsideExtensions ? 1 : 0);

    this._writer.Write(176, style.dimensionLineColor.getApproxIndex(), map);
    this._writer.Write(177, style.extensionLineColor.getApproxIndex(), map);
    this._writer.Write(178, style.textColor.getApproxIndex(), map);

    this._writer.Write(179, style.angularDecimalPlaces);

    this._writer.Write(271, style.decimalPlaces);
    this._writer.Write(272, style.toleranceDecimalPlaces);
    this._writer.Write(273, style.alternateUnitFormat as number);
    this._writer.Write(274, style.alternateUnitToleranceDecimalPlaces);
    this._writer.Write(275, style.angularUnit as number);
    this._writer.Write(276, style.fractionFormat as number);
    this._writer.Write(277, style.linearUnitFormat as number);
    this._writer.Write(278, (style.decimalSeparator || '.').charCodeAt(0));
    this._writer.Write(279, style.textMovement as number);
    this._writer.Write(280, style.textHorizontalAlignment as number);
    this._writer.Write(281, style.suppressFirstDimensionLine);
    this._writer.Write(282, style.suppressSecondDimensionLine);
    this._writer.Write(283, style.toleranceAlignment as number);
    this._writer.Write(284, style.toleranceZeroHandling as number);
    this._writer.Write(285, style.alternateUnitZeroHandling as number);
    this._writer.Write(286, style.alternateUnitToleranceZeroHandling as number);
    this._writer.Write(287, style.dimensionFit as number);
    this._writer.Write(288, style.cursorUpdate);
    this._writer.Write(289, style.dimensionTextArrowFit as number);
    this._writer.Write(290, style.isExtensionLineLengthFixed);

    this._writer.WriteHandle(340, style.style, map);
    this._writer.WriteHandle(341, style.leaderArrow, map);
    this._writer.WriteHandle(342, style.arrowBlock, map);
    this._writer.WriteHandle(343, style.dimArrow1, map);
    this._writer.WriteHandle(344, style.dimArrow2, map);

    this._writer.Write(371, style.dimensionLineWeight);
    this._writer.Write(372, style.extensionLineWeight);
  }

  private writeLayer(layer: Layer, map: DxfClassMap): void {
    let index = layer.color.isTrueColor ? layer.color.getApproxIndex() : layer.color.index;
    if (layer.isOn) {
      this._writer.Write(62, index, map);
    } else {
      this._writer.Write(62, -index, map);
    }

    if (layer.color.isTrueColor) {
      this._writer.Write(420, layer.color.trueColor, map);
    }

    this._writer.Write(6, layer.lineType?.name ?? 'Continuous', map);

    this._writer.Write(290, layer.plotFlag, map);

    this._writer.Write(370, layer.lineWeight, map);

    this._writer.Write(390, 0, map);
  }

  private writeLineType(linetype: LineType, map: DxfClassMap): void {
    this._writer.Write(3, linetype.description, map);

    this._writer.Write(72, linetype.alignment, map);
    this._writer.Write(73, linetype.segments.length, map);
    this._writer.Write(40, linetype.patternLength);

    for (const s of linetype.segments) {
      this._writer.Write(49, s.length);
      this._writer.Write(74, s.shapeFlags);

      if (s.shapeFlags !== LineTypeShapeFlags.None) {
        if ((s.shapeFlags & LineTypeShapeFlags.Shape) !== 0) {
          this._writer.Write(75, s.shapeNumber);
        }
        if ((s.shapeFlags & LineTypeShapeFlags.Text) !== 0) {
          this._writer.Write(75, 0);
        }

        if (s.style === null) {
          this._writer.Write(340, 0);
        } else {
          this._writer.Write(340, s.style.handle);
        }

        this._writer.Write(46, s.scale);
        this._writer.Write(50, MathHelper.RadToDeg(s.rotation));
        this._writer.Write(44, s.offset.x);
        this._writer.Write(45, s.offset.y);
        this._writer.Write(9, s.text);
      }
    }
  }

  private writeTextStyle(textStyle: TextStyle, map: DxfClassMap): void {
    if (textStyle.filename) {
      this._writer.Write(3, textStyle.filename, map);
    }

    if (textStyle.bigFontFilename) {
      this._writer.Write(4, textStyle.bigFontFilename);
    }

    this._writer.Write(40, textStyle.height, map);
    this._writer.Write(41, textStyle.width, map);
    this._writer.Write(42, textStyle.lastHeight, map);
    this._writer.Write(50, textStyle.obliqueAngle, map);
    this._writer.Write(71, textStyle.mirrorFlag, map);
  }

  private writeUcs(ucs: UCS, map: DxfClassMap): void {
    this._writer.Write(10, ucs.origin.x, map);
    this._writer.Write(20, ucs.origin.y, map);
    this._writer.Write(30, ucs.origin.z, map);

    this._writer.Write(11, ucs.xAxis.x, map);
    this._writer.Write(21, ucs.xAxis.y, map);
    this._writer.Write(31, ucs.xAxis.z, map);

    this._writer.Write(12, ucs.yAxis.x, map);
    this._writer.Write(22, ucs.yAxis.y, map);
    this._writer.Write(32, ucs.yAxis.z, map);

    this._writer.Write(71, ucs.orthographicType, map);
    this._writer.Write(79, ucs.orthographicViewType, map);
    this._writer.Write(146, ucs.elevation, map);
  }

  private writeView(view: View, map: DxfClassMap): void {
    this._writer.Write(40, view.height, map);
    this._writer.Write(41, view.width, map);

    this._writer.Write(42, view.lensLength, map);
    this._writer.Write(43, view.frontClipping, map);
    this._writer.Write(44, view.backClipping, map);

    this._writer.WriteVector(10, view.center, map);
    this._writer.WriteVector(11, view.direction, map);
    this._writer.WriteVector(12, view.target, map);

    this._writer.Write(50, view.angle, map);

    this._writer.Write(71, view.viewMode);
    this._writer.Write(72, view.isUcsAssociated, map);
    this._writer.Write(79, view.ucsOrthographicType);

    this._writer.Write(281, view.renderMode as number);

    this._writer.WriteVector(110, view.ucsOrigin);
    this._writer.WriteVector(111, view.ucsXAxis);
    this._writer.WriteVector(112, view.ucsYAxis);

    this._writer.Write(146, view.ucsElevation);
  }

  private writeVPort(vport: VPort, map: DxfClassMap): void {
    this._writer.WriteVector(10, vport.bottomLeft, map);
    this._writer.WriteVector(11, vport.topRight, map);
    this._writer.WriteVector(12, vport.center, map);
    this._writer.WriteVector(13, vport.snapBasePoint, map);
    this._writer.WriteVector(14, vport.snapSpacing, map);
    this._writer.WriteVector(15, vport.gridSpacing, map);
    this._writer.WriteVector(16, vport.direction, map);
    this._writer.WriteVector(17, vport.target, map);

    this._writer.Write(40, vport.viewHeight);
    this._writer.Write(41, vport.aspectRatio);

    this._writer.Write(75, vport.snapOn ? 1 : 0);
    this._writer.Write(76, vport.showGrid ? 1 : 0);
  }
}
