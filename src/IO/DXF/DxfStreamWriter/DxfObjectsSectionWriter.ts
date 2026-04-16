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
import { CadObject } from '../../../CadObject.js';
import { NonGraphicalObject } from '../../../Objects/NonGraphicalObject.js';
import { AcdbPlaceHolder } from '../../../Objects/AcdbPlaceHolder.js';
import { BookColor } from '../../../Objects/BookColor.js';
import { CadDictionary } from '../../../Objects/CadDictionary.js';
import { CadDictionaryWithDefault } from '../../../Objects/CadDictionaryWithDefault.js';
import { DictionaryVariable } from '../../../Objects/DictionaryVariable.js';
import { DimensionAssociation , OsnapPointRef} from '../../../Objects/DimensionAssociation.js';
import { AssociativityFlags } from '../../../Objects/AssociativityFlags.js';
import { GeoData } from '../../../Objects/GeoData.js';
import { Group } from '../../../Objects/Group.js';
import { ImageDefinition } from '../../../Objects/ImageDefinition.js';
import { ImageDefinitionReactor } from '../../../Objects/ImageDefinitionReactor.js';
import { Layout } from '../../../Objects/Layout.js';
import { Field } from '../../../Objects/Field.js';
import { FieldList } from '../../../Objects/FieldList.js';
import { MLineStyle } from '../../../Objects/MLineStyle.js';
import { MultiLeaderStyle } from '../../../Objects/MultiLeaderStyle.js';
import { PlotSettings } from '../../../Objects/PlotSettings.js';
import { PdfUnderlayDefinition } from '../../../Objects/PdfUnderlayDefinition.js';
import { RasterVariables } from '../../../Objects/RasterVariables.js';
import { Scale } from '../../../Objects/Scale.js';
import { SortEntitiesTable } from '../../../Objects/SortEntitiesTable.js';
import { SpatialFilter } from '../../../Objects/SpatialFilter.js';
import { XRecord } from '../../../Objects/XRecrod.js';
import { UnknownNonGraphicalObject } from '../../../Objects/UnknownNonGraphicalObject.js';
import { AecWallStyle } from '../../../Objects/AEC/AecWallStyle.js';
import { AecCleanupGroup } from '../../../Objects/AEC/AecCleanupGroup.js';
import { AecBinRecord } from '../../../Objects/AEC/AecBinRecord.js';
import { EvaluationGraph } from '../../../Objects/Evaluations/EvaluationGraph.js';
import { Material } from '../../../Objects/Material.js';
import { MultiLeaderObjectContextData } from '../../../Objects/MultiLeaderObjectContextData.js';
import { VisualStyle } from '../../../Objects/VisualStyle.js';
import { TableStyle } from '../../../Objects/TableStyle.js';
import { ProxyObject } from '../../../Objects/ProxyObject.js';
import { BlockRepresentationData } from '../../../Objects/BlockRepresentationData.js';
import { MTextAttributeObjectContextData } from '../../../Objects/MTextAttributeObjectContextData.js';
import { BlockReferenceObjectContextData } from '../../../Objects/BlockReferenceObjectContextData.js';
import { Entity } from '../../../Entities/Entity.js';
import { GroupCodeValueType } from '../../../GroupCodeValue.js';
import { IHandledCadObject } from '../../../IHandledCadObject.js';
import { IVector } from '../../../Math/IVector.js';
import { MathHelper } from '../../../Math/MathHelper.js';
import { XYZ } from '../../../Math/XYZ.js';
import { XY } from '../../../Math/XY.js';
import { NotificationType } from '../../NotificationEventHandler.js';

export class DxfObjectsSectionWriter extends DxfSectionWriterBase {
  public get sectionName(): string {
    return DxfFileToken.objectsSection;
  }

  public constructor(
    writer: IDxfStreamWriter,
    document: CadDocument,
    holder: CadObjectHolder,
    configuration: DxfWriterConfiguration
  ) {
    super(writer, document, holder, configuration);
  }

  protected writeBookColor(color: BookColor): void {
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.dbColor);

    this._writer.write(62, color.color.getApproxIndex());
    this._writer.writeTrueColor(420, color.color);
    this._writer.write(430, `${color.name}$${color.bookName}`);
  }

  protected writeDictionary(dict: CadDictionary): void {
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.dictionary);

    this._writer.write(280, dict.hardOwnerFlag);
    this._writer.write(281, dict.clonningFlags as number);

    for (const item of dict) {
      if (item instanceof XRecord && !this.configuration.writeXRecords) {
        continue;
      }

      this._writer.write(3, item.name);
      this._writer.write(350, item.handle);

      this.holder.objects.push(item);
    }

    if (dict instanceof CadDictionaryWithDefault) {
      this._writer.write(100, DxfSubclassMarker.dictionaryWithDefault);
      this._writer.writeHandle(340, dict.defaultEntry);
    }
  }

  protected writeDictionaryVariable(dictvar: DictionaryVariable): void {
    const map = DxfClassMap.create(DictionaryVariable);

    this._writer.write(100, DxfSubclassMarker.dictionaryVariables);

    this._writer.write(1, dictvar.value, map);
    this._writer.write(280, dictvar.objectSchemaNumber, map);
  }

  protected writeGeoData(geodata: GeoData): void {
    const map = DxfClassMap.create(GeoData);

    this._writer.write(100, DxfSubclassMarker.geoData, map);

    switch (this.version) {
      case ACadVersion.Unknown:
      case ACadVersion.MC0_0:
      case ACadVersion.AC1_2:
      case ACadVersion.AC1_4:
      case ACadVersion.AC1_50:
      case ACadVersion.AC2_10:
      case ACadVersion.AC1002:
      case ACadVersion.AC1003:
      case ACadVersion.AC1004:
      case ACadVersion.AC1006:
      case ACadVersion.AC1009:
      case ACadVersion.AC1012:
      case ACadVersion.AC1014:
      case ACadVersion.AC1015:
      case ACadVersion.AC1018:
      case ACadVersion.AC1021:
        this._writer.write(90, 1, map);
        break;
      case ACadVersion.AC1024:
        this._writer.write(90, 2, map);
        break;
      case ACadVersion.AC1027:
      case ACadVersion.AC1032:
        this._writer.write(90, 3, map);
        break;
    }

    if (geodata.hostBlock !== null) {
      this._writer.write(330, geodata.hostBlock.handle, map);
    }

    this._writer.write(70, geodata.coordinatesType, map);

    if (this.version <= ACadVersion.AC1021) {
      this._writer.write(40, geodata.referencePoint.y, map);
      this._writer.write(41, geodata.referencePoint.x, map);
      this._writer.write(42, geodata.referencePoint.z, map);
      this._writer.write(91, geodata.horizontalUnits as number, map);

      this._writer.writeVector(10, geodata.designPoint, map);
      this._writer.writeVector(11, XYZ.zero, map);

      this._writer.writeVector(210, geodata.upDirection, map);

      this._writer.write(52, MathHelper.radToDeg(Math.PI / 2.0 - geodata.northDirection.getAngle()), map);

      this._writer.write(43, 1.0, map);
      this._writer.write(44, 1.0, map);
      this._writer.write(45, 1.0, map);

      this._writer.write(301, geodata.coordinateSystemDefinition, map);
      this._writer.write(302, geodata.geoRssTag, map);

      this._writer.write(46, geodata.userSpecifiedScaleFactor, map);

      this._writer.write(303, '', map);
      this._writer.write(304, '', map);

      this._writer.write(305, geodata.observationFromTag, map);
      this._writer.write(306, geodata.observationToTag, map);
      this._writer.write(307, geodata.observationCoverageTag, map);

      this._writer.write(93, geodata.points.length, map);
      for (const pt of geodata.points) {
        this._writer.writeVector(12, pt.source, map);
        this._writer.writeVector(13, pt.destination, map);
      }
      this._writer.write(96, geodata.faces.length, map);
      for (const face of geodata.faces) {
        this._writer.write(97, face.index1, map);
        this._writer.write(98, face.index2, map);
        this._writer.write(99, face.index3, map);
      }
      this._writer.write(3, 'CIVIL3D_DATA_BEGIN', map);

      this._writer.write(292, false, map);
      this._writer.writeVector(14, new XY(geodata.referencePoint.x, geodata.referencePoint.y), map);
      this._writer.writeVector(15, new XY(geodata.referencePoint.x, geodata.referencePoint.y), map);
      this._writer.write(93, 0, map);
      this._writer.write(94, 0, map);
      this._writer.write(293, false, map);

      this._writer.writeVector(16, XY.zero, map);
      this._writer.writeVector(17, XY.zero, map);

      this._writer.write(54, MathHelper.radToDeg(Math.PI / 2.0 - geodata.northDirection.getAngle()), map);
      this._writer.write(140, Math.PI / 2.0 - geodata.northDirection.getAngle(), map);

      this._writer.write(95, geodata.scaleEstimationMethod as number, map);
      this._writer.write(141, geodata.userSpecifiedScaleFactor, map);
      this._writer.write(294, geodata.enableSeaLevelCorrection, map);
      this._writer.write(142, geodata.seaLevelElevation, map);
      this._writer.write(143, geodata.coordinateProjectionRadius, map);

      this._writer.write(4, 'CIVIL3D_DATA_END', map);
    } else {
      this._writer.writeVector(10, geodata.designPoint, map);
      this._writer.writeVector(11, geodata.referencePoint, map);
      this._writer.write(40, geodata.verticalUnitScale, map);
      this._writer.write(91, geodata.horizontalUnits as number, map);
      this._writer.write(41, geodata.verticalUnitScale, map);
      this._writer.write(92, geodata.verticalUnits as number, map);

      this._writer.writeVector(210, geodata.upDirection, map);

      this._writer.writeVector(12, geodata.northDirection, map);

      this._writer.write(95, geodata.scaleEstimationMethod, map);
      this._writer.write(141, geodata.userSpecifiedScaleFactor, map);
      this._writer.write(294, geodata.enableSeaLevelCorrection, map);
      this._writer.write(142, geodata.seaLevelElevation, map);
      this._writer.write(143, geodata.coordinateProjectionRadius, map);

      this.writeLongTextValue(301, 303, geodata.coordinateSystemDefinition);

      this._writer.write(302, geodata.geoRssTag, map);
      this._writer.write(305, geodata.observationFromTag, map);
      this._writer.write(306, geodata.observationToTag, map);
      this._writer.write(307, geodata.observationCoverageTag, map);

      this._writer.write(93, geodata.points.length, map);
      for (const pt of geodata.points) {
        this._writer.writeVector(13, pt.source, map);
        this._writer.writeVector(14, pt.destination, map);
      }

      this._writer.write(96, geodata.faces.length, map);

      for (const face of geodata.faces) {
        this._writer.write(97, face.index1, map);
        this._writer.write(98, face.index2, map);
        this._writer.write(99, face.index3, map);
      }
    }
  }

  protected writeGroup(group: Group): void {
    this._writer.write(100, DxfSubclassMarker.group);

    this._writer.write(300, group.description);
    this._writer.write(70, group.isUnnamed ? 1 : 0);
    this._writer.write(71, group.selectable ? 1 : 0);

    for (const entity of group.entities) {
      this._writer.writeHandle(340, entity);
    }
  }

  protected writeImageDefinition(definition: ImageDefinition): void {
    const map = DxfClassMap.create(ImageDefinition);

    this._writer.write(100, DxfSubclassMarker.rasterImageDef);

    this._writer.write(90, definition.classVersion, map);
    this._writer.write(1, definition.fileName, map);

    this._writer.writeVector(10, definition.size, map);

    this._writer.write(280, definition.isLoaded ? 1 : 0, map);

    this._writer.write(281, definition.units as number, map);
  }

  protected writeLayout(layout: Layout): void {
    const map = DxfClassMap.create(Layout);

    this.writePlotSettings(layout);

    this._writer.write(100, DxfSubclassMarker.layout);

    this._writer.write(1, layout.name, map);

    this._writer.write(71, layout.tabOrder, map);

    this._writer.writeVector(10, layout.minLimits, map);
    this._writer.writeVector(11, layout.maxLimits, map);
    this._writer.writeVector(12, layout.insertionBasePoint, map);
    this._writer.writeVector(13, layout.origin, map);
    this._writer.writeVector(14, layout.minExtents, map);
    this._writer.writeVector(15, layout.maxExtents, map);
    this._writer.writeVector(16, layout.xAxis, map);
    this._writer.writeVector(17, layout.yAxis, map);

    this._writer.write(146, layout.elevation, map);

    this._writer.write(76, 0, map);

    this._writer.writeHandle(330, layout.associatedBlock, map);
  }

  protected writeMLineStyle(style: MLineStyle): void {
    const map = DxfClassMap.create(MLineStyle);

    this._writer.write(100, DxfSubclassMarker.mLineStyle);

    this._writer.write(2, style.name, map);

    this._writer.write(70, style.flags, map);

    this._writer.write(3, style.description, map);

    this._writer.write(62, style.fillColor.getApproxIndex(), map);

    this._writer.write(51, style.startAngle, map);
    this._writer.write(52, style.endAngle, map);
    this._writer.write(71, style.elements.length, map);
    for (const element of style.elements) {
      this._writer.write(49, element.offset, map);
      this._writer.write(62, element.color.index, map);
      this._writer.write(6, element.lineType?.name ?? 'ByLayer', map);
    }
  }

  protected writeMultiLeaderStyle(style: MultiLeaderStyle): void {
    const map = DxfClassMap.create(MultiLeaderStyle);

    this._writer.write(100, DxfSubclassMarker.mLeaderStyle);

    this._writer.write(179, 2);
    this._writer.write(170, style.contentType, map);
    this._writer.write(171, style.multiLeaderDrawOrder, map);
    this._writer.write(172, style.leaderDrawOrder, map);
    this._writer.write(90, style.maxLeaderSegmentsPoints, map);
    this._writer.write(40, style.firstSegmentAngleConstraint, map);
    this._writer.write(41, style.secondSegmentAngleConstraint, map);
    this._writer.write(173, style.pathType, map);
    this._writer.writeCmColor(91, style.lineColor, map);
    this._writer.writeHandle(340, style.leaderLineType);
    this._writer.write(92, style.leaderLineWeight, map);
    this._writer.write(290, style.enableLanding, map);
    this._writer.write(42, style.landingGap, map);
    this._writer.write(291, style.enableDogleg, map);
    this._writer.write(43, style.landingDistance, map);
    this._writer.write(3, style.description, map);
    this._writer.writeHandle(341, style.arrowhead);
    this._writer.write(44, style.arrowheadSize, map);
    this._writer.write(300, style.defaultTextContents, map);
    this._writer.writeHandle(342, style.textStyle);
    this._writer.write(174, style.textLeftAttachment, map);
    this._writer.write(178, style.textRightAttachment, map);
    this._writer.write(175, style.textAngle, map);
    this._writer.write(176, style.textAlignment, map);
    this._writer.writeCmColor(93, style.textColor, map);
    this._writer.write(45, style.textHeight, map);
    this._writer.write(292, style.textFrame, map);
    this._writer.write(297, style.textAlignAlwaysLeft, map);
    this._writer.write(46, style.alignSpace, map);
    this._writer.writeHandle(343, style.blockContent);
    this._writer.writeCmColor(94, style.blockContentColor, map);

    this._writer.write(47, style.blockContentScale.x, map);
    this._writer.write(49, style.blockContentScale.y, map);
    this._writer.write(140, style.blockContentScale.z, map);

    this._writer.write(293, style.enableBlockContentScale, map);
    this._writer.write(141, style.blockContentRotation, map);
    this._writer.write(294, style.enableBlockContentRotation, map);
    this._writer.write(177, style.blockContentConnection, map);
    this._writer.write(142, style.scaleFactor, map);
    this._writer.write(295, style.overwritePropertyValue, map);
    this._writer.write(296, style.isAnnotative, map);
    this._writer.write(143, style.breakGapSize, map);
    this._writer.write(271, style.textAttachmentDirection, map);
    this._writer.write(272, style.textBottomAttachment, map);
    this._writer.write(273, style.textTopAttachment, map);
    this._writer.write(298, false);
  }

  protected writeObject<T extends CadObject>(co: T): void {
    if (!this._isObjectSupported(co)) {
      return;
    }

    if (co instanceof XRecord && !this.configuration.writeXRecords) {
      return;
    }

    this._writer.write(DxfCode.Start, co.objectName);

    this.writeCommonObjectData(co);

    if (co instanceof AcdbPlaceHolder) {
      this._writeAcdbPlaceHolder(co);
      return;
    } else if (co instanceof BookColor) {
      this.writeBookColor(co);
      return;
    } else if (co instanceof CadDictionary) {
      this.writeDictionary(co);
      return;
    } else if (co instanceof DictionaryVariable) {
      this.writeDictionaryVariable(co);
    } else if (co instanceof DimensionAssociation) {
      this._writeDimensionAssociation(co);
    } else if (co instanceof GeoData) {
      this.writeGeoData(co);
    } else if (co instanceof Group) {
      this.writeGroup(co);
    } else if (co instanceof ImageDefinition) {
      this.writeImageDefinition(co);
      return;
    } else if (co instanceof ImageDefinitionReactor) {
      this._writeImageDefinitionReactor(co);
      return;
    } else if (co instanceof Layout) {
      this.writeLayout(co);
    } else if (co instanceof Field) {
      this._writeField(co);
    } else if (co instanceof FieldList) {
      this._writeFieldList(co);
    } else if (co instanceof MLineStyle) {
      this.writeMLineStyle(co);
    } else if (co instanceof MultiLeaderStyle) {
      this.writeMultiLeaderStyle(co);
    } else if (co instanceof PlotSettings) {
      this.writePlotSettings(co);
    } else if (co instanceof PdfUnderlayDefinition) {
      this.writePdfUnderlayDefinition(co);
    } else if (co instanceof RasterVariables) {
      this.writeRasterVariables(co);
    } else if (co instanceof Scale) {
      this.writeScale(co);
    } else if (co instanceof SpatialFilter) {
      this._writeSpatialFilter(co);
    } else if (co instanceof SortEntitiesTable) {
      this._writeSortentsTable(co);
    } else if (co instanceof XRecord) {
      this.writeXRecord(co);
    } else {
      throw new Error(`Object not implemented : ${co.constructor.name}`);
    }

    this.writeExtendedData(co.extendedData);
  }

  protected writePdfUnderlayDefinition(definition: PdfUnderlayDefinition): void {
    const map = DxfClassMap.create(PlotSettings);

    this._writer.write(100, DxfSubclassMarker.underlayDefinition);

    this._writer.write(1, definition.file, map);
    this._writer.write(2, definition.page, map);
  }

  protected writePlotSettings(plot: PlotSettings): void {
    const map = DxfClassMap.create(PlotSettings);

    this._writer.write(100, DxfSubclassMarker.plotSettings);

    this._writer.write(1, plot.pageName, map);
    this._writer.write(2, plot.systemPrinterName, map);

    this._writer.write(4, plot.paperSize, map);

    this._writer.write(6, plot.plotViewName, map);
    this._writer.write(7, plot.styleSheet, map);

    this._writer.write(40, plot.unprintableMargin.left, map);
    this._writer.write(41, plot.unprintableMargin.bottom, map);
    this._writer.write(42, plot.unprintableMargin.right, map);
    this._writer.write(43, plot.unprintableMargin.top, map);
    this._writer.write(44, plot.paperWidth, map);
    this._writer.write(45, plot.paperHeight, map);
    this._writer.write(46, plot.plotOriginX, map);
    this._writer.write(47, plot.plotOriginY, map);
    this._writer.write(48, plot.windowLowerLeftX, map);
    this._writer.write(49, plot.windowLowerLeftY, map);

    this._writer.write(140, plot.windowUpperLeftX, map);
    this._writer.write(141, plot.windowUpperLeftY, map);
    this._writer.write(142, plot.numeratorScale, map);
    this._writer.write(143, plot.denominatorScale, map);

    this._writer.write(70, plot.flags, map);

    this._writer.write(72, plot.paperUnits, map);
    this._writer.write(73, plot.paperRotation, map);
    this._writer.write(74, plot.plotType, map);
    this._writer.write(75, plot.scaledFit, map);
    this._writer.write(76, plot.shadePlotMode, map);
    this._writer.write(77, plot.shadePlotResolutionMode, map);
    this._writer.write(78, plot.shadePlotDPI, map);
    this._writer.write(147, plot.printScale, map);

    this._writer.write(148, plot.paperImageOrigin.x, map);
    this._writer.write(149, plot.paperImageOrigin.y, map);
  }

  protected writeRasterVariables(variables: RasterVariables): void {
    const map = DxfClassMap.create(RasterVariables);

    this._writer.write(100, DxfSubclassMarker.rasterVariables);

    this._writer.write(90, variables.classVersion, map);
    this._writer.write(70, variables.isDisplayFrameShown ? 1 : 0, map);
    this._writer.write(71, variables.displayQuality, map);
    this._writer.write(72, variables.displayQuality, map);
  }

  protected writeScale(scale: Scale): void {
    this._writer.write(100, DxfSubclassMarker.scale);

    this._writer.write(70, 0);
    this._writer.write(300, scale.name);
    this._writer.write(140, scale.paperUnits);
    this._writer.write(141, scale.drawingUnits);
    this._writer.write(290, scale.isUnitScale ? 1 : 0);
  }

  protected writeSection(): void {
    while (this.holder.objects.length > 0) {
      const item: CadObject = this.holder.objects.shift()!;
      this.writeObject(item);
    }
  }

  protected writeXRecord(record: XRecord): void {
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.xRecord);

    this._writer.write(280, record.cloningFlags);

    for (const e of record.entries) {
      switch (e.groupCode) {
        case GroupCodeValueType.None:
          break;
        case GroupCodeValueType.Point3D:
          const point = e.value as { x?: unknown; y?: unknown } | null;
          if (point && typeof point.x === 'number' && typeof point.y === 'number') {
            this._writer.writeVector(e.code, e.value as IVector);
          } else {
            this._writer.write(e.code, e.value);
          }
          break;
        case GroupCodeValueType.Handle:
        case GroupCodeValueType.ObjectId:
        case GroupCodeValueType.ExtendedDataHandle: {
          const obj = e.value as IHandledCadObject;
          this._writer.write(e.code, obj.handle);
          break;
        }
        default:
          this._writer.write(e.code, e.value);
          break;
      }
    }
  }

  private _isObjectSupported(co: CadObject): boolean {
    if (co instanceof UnknownNonGraphicalObject) {
      return false;
    }
    if (
      co instanceof AecWallStyle ||
      co instanceof AecCleanupGroup ||
      co instanceof AecBinRecord ||
      co instanceof DimensionAssociation ||
      co instanceof EvaluationGraph ||
      co instanceof Material ||
      co instanceof MultiLeaderObjectContextData ||
      co instanceof VisualStyle ||
      co instanceof TableStyle ||
      co instanceof ProxyObject ||
      co instanceof BlockRepresentationData ||
      co instanceof MTextAttributeObjectContextData ||
      co instanceof BlockReferenceObjectContextData
    ) {
      this.notify(`Object not implemented : ${co.constructor.name}`, NotificationType.NotImplemented);
      return false;
    }
    return true;
  }

  private _writeAcdbPlaceHolder(acdbPlaceHolder: AcdbPlaceHolder): void {
    // empty
  }

  private _writeDimensionAssociation(dimAssociation: DimensionAssociation): void {
    const map = DxfClassMap.create(DimensionAssociation);

    this._writer.write(100, DxfSubclassMarker.dimensionAssociation);

    this._writer.writeHandle(330, dimAssociation.dimension, map);
    this._writer.write(90, dimAssociation.associativityFlags as number, map);
    this._writer.write(70, dimAssociation.isTransSpace, map);
    this._writer.write(71, dimAssociation.rotatedDimensionType, map);

    if ((dimAssociation.associativityFlags & AssociativityFlags.FirstPointReference) !== 0) {
      this._writeOsnapPointRef(dimAssociation.firstPointRef);
    }

    if ((dimAssociation.associativityFlags & AssociativityFlags.SecondPointReference) !== 0) {
      this._writeOsnapPointRef(dimAssociation.secondPointRef);
    }

    if ((dimAssociation.associativityFlags & AssociativityFlags.ThirdPointReference) !== 0) {
      this._writeOsnapPointRef(dimAssociation.thirdPointRef);
    }

    if ((dimAssociation.associativityFlags & AssociativityFlags.FourthPointReference) !== 0) {
      this._writeOsnapPointRef(dimAssociation.fourthPointRef);
    }
  }

  private _writeField(field: Field): void {
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.field);

    this._writer.write(1, field.evaluatorId);

    this.writeLongTextValue(2, 3, field.fieldCode);

    this._writer.write(90, field.children.length);
    for (const item of field.children) {
      this._writer.writeHandle(360, item);
    }

    this._writer.write(97, field.cadObjects.length);
    for (const item of field.cadObjects) {
      this._writer.writeHandle(331, item);
    }

    this._writer.write(91, field.evaluationOptionFlags as number);
    this._writer.write(92, field.filingOptionFlags as number);
    this._writer.write(94, field.fieldStateFlags as number);
    this._writer.write(95, field.evaluationStatusFlags as number);
    this._writer.write(96, field.evaluationErrorCode);
    this._writer.write(300, field.evaluationErrorMessage);

    this._writer.write(93, field.values.size);
    for (const [key, value] of field.values) {
      this._writer.write(6, key);
      this.writeCadValue(value);
    }

    this._writer.write(7, 'ACFD_FIELD_VALUE');
    this.writeCadValue(field.value);

    this.writeLongTextValue(301, 9, field.formatString);
    this._writer.write(98, field.formatString.length);
  }

  private _writeFieldList(fieldList: FieldList): void {
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.idSet);

    this._writer.write(90, fieldList.fields.length);
    for (const field of fieldList.fields) {
      this._writer.writeHandle(330, field);
      this.holder.objects.push(field);
    }

    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.fieldList);
  }

  private _writeImageDefinitionReactor(reactor: ImageDefinitionReactor): void {
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.rasterImageDefReactor);

    this._writer.write(90, reactor.classVersion);
    this._writer.writeHandle(330, reactor.image);
  }

  private _writeOsnapPointRef(osnapPoint: OsnapPointRef | null): void {
    if (osnapPoint === null) {
      return;
    }

    this._writer.write(1, DimensionAssociation.osnapPointRefClassName);

    this._writer.write(72, osnapPoint.objectOsnapType);
    this._writer.writeHandle(331, osnapPoint.geometry);
    this._writer.write(73, osnapPoint.subentType);
    this._writer.write(91, osnapPoint.gsMarker);
    this._writer.write(40, osnapPoint.geometryParameter);

    this._writer.writeVector(10, osnapPoint.osnapPoint);

    this._writer.write(75, osnapPoint.hasLastPointRef ? 1 : 0);
  }

  private _writeSortentsTable(e: SortEntitiesTable): void {
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.sortentsTable);

    this._writer.writeHandle(330, e.blockOwner);

    for (const item of e) {
      this._writer.writeHandle(331, item.entity);
      this._writer.write(5, item.sortHandle);
    }
  }

  private _writeSpatialFilter(filter: SpatialFilter): void {
    const map = DxfClassMap.create(SpatialFilter);

    this._writer.write(100, DxfSubclassMarker.filter);
    this._writer.write(100, DxfSubclassMarker.spatialFilter);

    this._writer.write(70, filter.boundaryPoints.length, map);
    for (const pt of filter.boundaryPoints) {
      this._writer.writeVector(10, pt, map);
    }

    this._writer.writeVector(210, filter.normal, map);
    this._writer.writeVector(11, filter.origin, map);
    this._writer.write(71, filter.displayBoundary ? 1 : 0, map);

    this._writer.write(72, filter.clipFrontPlane ? 1 : 0, map);
    if (filter.clipFrontPlane) {
      this._writer.write(40, filter.frontDistance, map);
    }

    this._writer.write(73, filter.clipBackPlane ? 1 : 0, map);
    if (filter.clipBackPlane) {
      this._writer.write(41, filter.backDistance, map);
    }

    const array: number[] = [
      filter.inverseInsertTransform.m00, filter.inverseInsertTransform.m01, filter.inverseInsertTransform.m02, filter.inverseInsertTransform.m03,
      filter.inverseInsertTransform.m10, filter.inverseInsertTransform.m11, filter.inverseInsertTransform.m12, filter.inverseInsertTransform.m13,
      filter.inverseInsertTransform.m20, filter.inverseInsertTransform.m21, filter.inverseInsertTransform.m22, filter.inverseInsertTransform.m23,
      filter.insertTransform.m00, filter.insertTransform.m01, filter.insertTransform.m02, filter.insertTransform.m03,
      filter.insertTransform.m10, filter.insertTransform.m11, filter.insertTransform.m12, filter.insertTransform.m13,
      filter.insertTransform.m20, filter.insertTransform.m21, filter.insertTransform.m22, filter.insertTransform.m23,
    ];

    for (let i = 0; i < array.length; i++) {
      this._writer.write(40, array[i]);
    }
  }
}
