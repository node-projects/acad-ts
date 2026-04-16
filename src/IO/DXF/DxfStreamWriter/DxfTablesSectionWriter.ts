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
  public get sectionName(): string {
    return DxfFileToken.tablesSection;
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
    this._writeTable(this._document.vPorts);
    this._writeTable(this._document.lineTypes);
    this._writeTable(this._document.layers);
    this._writeTable(this._document.textStyles);
    this._writeTable(this._document.views);
    this._writeTable(this._document.uCSs);
    this._writeTable(this._document.appIds);
    this._writeTable(this._document.dimensionStyles, DxfSubclassMarker.dimensionStyleTable);
    this._writeTable(this._document.blockRecords);
  }

  private _writeTable<T extends TableEntry>(table: Table<T>, subclass?: string): void {
    this._writer.write(DxfCode.Start, DxfFileToken.tableEntry);
    this._writer.write(DxfCode.SymbolTableName, table.objectName);

    this.writeCommonObjectData(table);

    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.table);

    this._writer.write(70, table.count);

    if (subclass) {
      this._writer.write(DxfCode.Subclass, subclass);
    }

    for (const entry of table) {
      this._writeEntry(entry);
    }

    this._writer.write(DxfCode.Start, DxfFileToken.endTable);
  }

  private _writeEntry<T extends TableEntry>(entry: T): void {
    const map = DxfMap.create(entry.constructor.name);

    this._writer.write(DxfCode.Start, entry.objectName);

    this.writeCommonObjectData(entry);

    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.tableRecord);
    this._writer.write(DxfCode.Subclass, entry.subclassMarker);

    if (entry instanceof TextStyle && (entry as TextStyle).isShapeFile) {
      this._writer.write(DxfCode.SymbolTableName, '');
    } else {
      this._writer.write(DxfCode.SymbolTableName, entry.name);
    }

    this._writer.write(70, entry.flags);

    if (entry instanceof AppId) {
      // nothing
    } else if (entry instanceof BlockRecord) {
      this._writeBlockRecord(entry, map.subClasses.get(entry.subclassMarker)!);
    } else if (entry instanceof DimensionStyle) {
      this._writeDimensionStyle(entry, map.subClasses.get(entry.subclassMarker)!);
    } else if (entry instanceof Layer) {
      this._writeLayer(entry, map.subClasses.get(entry.subclassMarker)!);
    } else if (entry instanceof LineType) {
      this._writeLineType(entry, map.subClasses.get(entry.subclassMarker)!);
    } else if (entry instanceof TextStyle) {
      this._writeTextStyle(entry, map.subClasses.get(entry.subclassMarker)!);
    } else if (entry instanceof UCS) {
      this._writeUcs(entry, map.subClasses.get(entry.subclassMarker)!);
    } else if (entry instanceof View) {
      this._writeView(entry, map.subClasses.get(entry.subclassMarker)!);
    } else if (entry instanceof VPort) {
      this._writeVPort(entry, map.subClasses.get(entry.subclassMarker)!);
    }

    this.writeExtendedData(entry.extendedData);
  }

  private _writeBlockRecord(block: BlockRecord, map: DxfClassMap): void {
    this._writer.writeHandle(340, block.layout, map);

    this._writer.write(70, block.units, map);
    this._writer.write(280, block.isExplodable ? 1 : 0, map);
    this._writer.write(281, block.canScale ? 1 : 0, map);
  }

  private _writeDimensionStyle(style: DimensionStyle, map: DxfClassMap): void {
    this._writer.write(3, style.postFix, map);
    this._writer.write(4, style.alternateDimensioningSuffix, map);

    this._writer.write(40, style.scaleFactor, map);
    this._writer.write(41, style.arrowSize, map);
    this._writer.write(42, style.extensionLineOffset, map);
    this._writer.write(43, style.dimensionLineIncrement, map);
    this._writer.write(44, style.extensionLineExtension, map);
    this._writer.write(45, style.rounding, map);
    this._writer.write(46, style.dimensionLineExtension, map);
    this._writer.write(47, style.plusTolerance, map);
    this._writer.write(48, style.minusTolerance, map);
    this._writer.write(49, style.fixedExtensionLineLength, map);
    this._writer.write(50, style.joggedRadiusDimensionTransverseSegmentAngle, map);

    if (style.textBackgroundFillMode !== 0) {
      this._writer.write(69, style.textBackgroundFillMode, map);
      this._writer.write(70, style.textBackgroundColor.getApproxIndex(), map);
    } else {
      this._writer.write(70, 0, map);
    }

    if (style.arcLengthSymbolPosition !== ArcLengthSymbolPosition.AboveDimensionText) {
      this._writer.write(90, style.arcLengthSymbolPosition as number);
    }

    this._writer.write(140, style.textHeight);
    this._writer.write(141, style.centerMarkSize);
    this._writer.write(142, style.tickSize);
    this._writer.write(143, style.alternateUnitScaleFactor);
    this._writer.write(144, style.linearScaleFactor);
    this._writer.write(145, style.textVerticalPosition);
    this._writer.write(146, style.toleranceScaleFactor);
    this._writer.write(147, style.dimensionLineGap);
    this._writer.write(148, style.alternateUnitRounding);

    this._writer.write(71, style.generateTolerances ? 1 : 0);
    this._writer.write(72, style.limitsGeneration ? 1 : 0);
    this._writer.write(73, style.textInsideHorizontal ? 1 : 0);
    this._writer.write(74, style.textOutsideHorizontal ? 1 : 0);
    this._writer.write(75, style.suppressFirstExtensionLine ? 1 : 0);
    this._writer.write(76, style.suppressSecondExtensionLine ? 1 : 0);
    this._writer.write(77, style.textVerticalAlignment as number);
    this._writer.write(78, style.zeroHandling as number);
    this._writer.write(79, style.angularZeroHandling as number);

    this._writer.write(170, style.alternateUnitDimensioning ? 1 : 0);
    this._writer.write(171, style.alternateUnitDecimalPlaces);
    this._writer.write(172, style.textOutsideExtensions ? 1 : 0);
    this._writer.write(173, style.separateArrowBlocks ? 1 : 0);
    this._writer.write(174, style.textInsideExtensions ? 1 : 0);
    this._writer.write(175, style.suppressOutsideExtensions ? 1 : 0);

    this._writer.write(176, style.dimensionLineColor.getApproxIndex(), map);
    this._writer.write(177, style.extensionLineColor.getApproxIndex(), map);
    this._writer.write(178, style.textColor.getApproxIndex(), map);

    this._writer.write(179, style.angularDecimalPlaces);

    this._writer.write(271, style.decimalPlaces);
    this._writer.write(272, style.toleranceDecimalPlaces);
    this._writer.write(273, style.alternateUnitFormat as number);
    this._writer.write(274, style.alternateUnitToleranceDecimalPlaces);
    this._writer.write(275, style.angularUnit as number);
    this._writer.write(276, style.fractionFormat as number);
    this._writer.write(277, style.linearUnitFormat as number);
    this._writer.write(278, (style.decimalSeparator || '.').charCodeAt(0));
    this._writer.write(279, style.textMovement as number);
    this._writer.write(280, style.textHorizontalAlignment as number);
    this._writer.write(281, style.suppressFirstDimensionLine);
    this._writer.write(282, style.suppressSecondDimensionLine);
    this._writer.write(283, style.toleranceAlignment as number);
    this._writer.write(284, style.toleranceZeroHandling as number);
    this._writer.write(285, style.alternateUnitZeroHandling as number);
    this._writer.write(286, style.alternateUnitToleranceZeroHandling as number);
    this._writer.write(287, style.dimensionFit as number);
    this._writer.write(288, style.cursorUpdate);
    this._writer.write(289, style.dimensionTextArrowFit as number);
    this._writer.write(290, style.isExtensionLineLengthFixed);

    this._writer.writeHandle(340, style.style, map);
    this._writer.writeHandle(341, style.leaderArrow, map);
    this._writer.writeHandle(342, style.arrowBlock, map);
    this._writer.writeHandle(343, style.dimArrow1, map);
    this._writer.writeHandle(344, style.dimArrow2, map);

    this._writer.write(371, style.dimensionLineWeight);
    this._writer.write(372, style.extensionLineWeight);
  }

  private _writeLayer(layer: Layer, map: DxfClassMap): void {
    let index = layer.color.isTrueColor ? layer.color.getApproxIndex() : layer.color.index;
    if (layer.isOn) {
      this._writer.write(62, index, map);
    } else {
      this._writer.write(62, -index, map);
    }

    if (layer.color.isTrueColor) {
      this._writer.write(420, layer.color.trueColor, map);
    }

    this._writer.write(6, layer.lineType?.name ?? 'Continuous', map);

    this._writer.write(290, layer.plotFlag, map);

    this._writer.write(370, layer.lineWeight, map);

    this._writer.write(390, 0, map);
  }

  private _writeLineType(linetype: LineType, map: DxfClassMap): void {
    this._writer.write(3, linetype.description, map);

    this._writer.write(72, linetype.alignment, map);
    this._writer.write(73, linetype.segments.length, map);
    this._writer.write(40, linetype.patternLength);

    for (const s of linetype.segments) {
      this._writer.write(49, s.length);
      this._writer.write(74, s.shapeFlags);

      if (s.shapeFlags !== LineTypeShapeFlags.None) {
        if ((s.shapeFlags & LineTypeShapeFlags.Shape) !== 0) {
          this._writer.write(75, s.shapeNumber);
        }
        if ((s.shapeFlags & LineTypeShapeFlags.Text) !== 0) {
          this._writer.write(75, 0);
        }

        if (s.style === null) {
          this._writer.write(340, 0);
        } else {
          this._writer.write(340, s.style.handle);
        }

        this._writer.write(46, s.scale);
        this._writer.write(50, MathHelper.radToDeg(s.rotation));
        this._writer.write(44, s.offset.x);
        this._writer.write(45, s.offset.y);
        this._writer.write(9, s.text);
      }
    }
  }

  private _writeTextStyle(textStyle: TextStyle, map: DxfClassMap): void {
    if (textStyle.filename) {
      this._writer.write(3, textStyle.filename, map);
    }

    if (textStyle.bigFontFilename) {
      this._writer.write(4, textStyle.bigFontFilename);
    }

    this._writer.write(40, textStyle.height, map);
    this._writer.write(41, textStyle.width, map);
    this._writer.write(42, textStyle.lastHeight, map);
    this._writer.write(50, textStyle.obliqueAngle, map);
    this._writer.write(71, textStyle.mirrorFlag, map);
  }

  private _writeUcs(ucs: UCS, map: DxfClassMap): void {
    this._writer.write(10, ucs.origin.x, map);
    this._writer.write(20, ucs.origin.y, map);
    this._writer.write(30, ucs.origin.z, map);

    this._writer.write(11, ucs.xAxis.x, map);
    this._writer.write(21, ucs.xAxis.y, map);
    this._writer.write(31, ucs.xAxis.z, map);

    this._writer.write(12, ucs.yAxis.x, map);
    this._writer.write(22, ucs.yAxis.y, map);
    this._writer.write(32, ucs.yAxis.z, map);

    this._writer.write(71, ucs.orthographicType, map);
    this._writer.write(79, ucs.orthographicViewType, map);
    this._writer.write(146, ucs.elevation, map);
  }

  private _writeView(view: View, map: DxfClassMap): void {
    this._writer.write(40, view.height, map);
    this._writer.write(41, view.width, map);

    this._writer.write(42, view.lensLength, map);
    this._writer.write(43, view.frontClipping, map);
    this._writer.write(44, view.backClipping, map);

    this._writer.writeVector(10, view.center, map);
    this._writer.writeVector(11, view.direction, map);
    this._writer.writeVector(12, view.target, map);

    this._writer.write(50, view.angle, map);

    this._writer.write(71, view.viewMode);
    this._writer.write(72, view.isUcsAssociated, map);
    this._writer.write(79, view.ucsOrthographicType);

    this._writer.write(281, view.renderMode as number);

    this._writer.writeVector(110, view.ucsOrigin);
    this._writer.writeVector(111, view.ucsXAxis);
    this._writer.writeVector(112, view.ucsYAxis);

    this._writer.write(146, view.ucsElevation);
  }

  private _writeVPort(vport: VPort, map: DxfClassMap): void {
    this._writer.writeVector(10, vport.bottomLeft, map);
    this._writer.writeVector(11, vport.topRight, map);
    this._writer.writeVector(12, vport.center, map);
    this._writer.writeVector(13, vport.snapBasePoint, map);
    this._writer.writeVector(14, vport.snapSpacing, map);
    this._writer.writeVector(15, vport.gridSpacing, map);
    this._writer.writeVector(16, vport.direction, map);
    this._writer.writeVector(17, vport.target, map);

    this._writer.write(40, vport.viewHeight);
    this._writer.write(41, vport.aspectRatio);

    this._writer.write(75, vport.snapOn ? 1 : 0);
    this._writer.write(76, vport.showGrid ? 1 : 0);
  }
}
