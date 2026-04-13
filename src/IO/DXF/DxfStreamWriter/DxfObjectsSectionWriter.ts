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
  public get SectionName(): string {
    return DxfFileToken.ObjectsSection;
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
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.DbColor);

    this._writer.Write(62, color.color.getApproxIndex());
    this._writer.WriteTrueColor(420, color.color);
    this._writer.Write(430, `${color.name}$${color.bookName}`);
  }

  protected writeDictionary(dict: CadDictionary): void {
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.Dictionary);

    this._writer.Write(280, dict.hardOwnerFlag);
    this._writer.Write(281, dict.clonningFlags as number);

    for (const item of dict) {
      if (item instanceof XRecord && !this.Configuration.WriteXRecords) {
        continue;
      }

      this._writer.Write(3, item.name);
      this._writer.Write(350, item.handle);

      this.Holder.Objects.push(item);
    }

    if (dict instanceof CadDictionaryWithDefault) {
      this._writer.Write(100, DxfSubclassMarker.DictionaryWithDefault);
      this._writer.WriteHandle(340, dict.defaultEntry);
    }
  }

  protected writeDictionaryVariable(dictvar: DictionaryVariable): void {
    const map = DxfClassMap.Create(DictionaryVariable);

    this._writer.Write(100, DxfSubclassMarker.DictionaryVariables);

    this._writer.Write(1, dictvar.value, map);
    this._writer.Write(280, dictvar.objectSchemaNumber, map);
  }

  protected writeGeoData(geodata: GeoData): void {
    const map = DxfClassMap.Create(GeoData);

    this._writer.Write(100, DxfSubclassMarker.GeoData, map);

    switch (this.Version) {
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
        this._writer.Write(90, 1, map);
        break;
      case ACadVersion.AC1024:
        this._writer.Write(90, 2, map);
        break;
      case ACadVersion.AC1027:
      case ACadVersion.AC1032:
        this._writer.Write(90, 3, map);
        break;
    }

    if (geodata.hostBlock !== null) {
      this._writer.Write(330, geodata.hostBlock.Handle, map);
    }

    this._writer.Write(70, geodata.coordinatesType, map);

    if (this.Version <= ACadVersion.AC1021) {
      this._writer.Write(40, geodata.referencePoint.y, map);
      this._writer.Write(41, geodata.referencePoint.x, map);
      this._writer.Write(42, geodata.referencePoint.z, map);
      this._writer.Write(91, geodata.horizontalUnits as number, map);

      this._writer.WriteVector(10, geodata.designPoint, map);
      this._writer.WriteVector(11, XYZ.Zero, map);

      this._writer.WriteVector(210, geodata.upDirection, map);

      this._writer.Write(52, MathHelper.RadToDeg(Math.PI / 2.0 - geodata.northDirection.getAngle()), map);

      this._writer.Write(43, 1.0, map);
      this._writer.Write(44, 1.0, map);
      this._writer.Write(45, 1.0, map);

      this._writer.Write(301, geodata.coordinateSystemDefinition, map);
      this._writer.Write(302, geodata.geoRssTag, map);

      this._writer.Write(46, geodata.userSpecifiedScaleFactor, map);

      this._writer.Write(303, '', map);
      this._writer.Write(304, '', map);

      this._writer.Write(305, geodata.observationFromTag, map);
      this._writer.Write(306, geodata.observationToTag, map);
      this._writer.Write(307, geodata.observationCoverageTag, map);

      this._writer.Write(93, geodata.points.length, map);
      for (const pt of geodata.points) {
        this._writer.WriteVector(12, pt.source, map);
        this._writer.WriteVector(13, pt.destination, map);
      }
      this._writer.Write(96, geodata.faces.length, map);
      for (const face of geodata.faces) {
        this._writer.Write(97, face.index1, map);
        this._writer.Write(98, face.index2, map);
        this._writer.Write(99, face.index3, map);
      }
      this._writer.Write(3, 'CIVIL3D_DATA_BEGIN', map);

      this._writer.Write(292, false, map);
      this._writer.WriteVector(14, new XY(geodata.referencePoint.x, geodata.referencePoint.y), map);
      this._writer.WriteVector(15, new XY(geodata.referencePoint.x, geodata.referencePoint.y), map);
      this._writer.Write(93, 0, map);
      this._writer.Write(94, 0, map);
      this._writer.Write(293, false, map);

      this._writer.WriteVector(16, XY.Zero, map);
      this._writer.WriteVector(17, XY.Zero, map);

      this._writer.Write(54, MathHelper.RadToDeg(Math.PI / 2.0 - geodata.northDirection.getAngle()), map);
      this._writer.Write(140, Math.PI / 2.0 - geodata.northDirection.getAngle(), map);

      this._writer.Write(95, geodata.scaleEstimationMethod as number, map);
      this._writer.Write(141, geodata.userSpecifiedScaleFactor, map);
      this._writer.Write(294, geodata.enableSeaLevelCorrection, map);
      this._writer.Write(142, geodata.seaLevelElevation, map);
      this._writer.Write(143, geodata.coordinateProjectionRadius, map);

      this._writer.Write(4, 'CIVIL3D_DATA_END', map);
    } else {
      this._writer.WriteVector(10, geodata.designPoint, map);
      this._writer.WriteVector(11, geodata.referencePoint, map);
      this._writer.Write(40, geodata.verticalUnitScale, map);
      this._writer.Write(91, geodata.horizontalUnits as number, map);
      this._writer.Write(41, geodata.verticalUnitScale, map);
      this._writer.Write(92, geodata.verticalUnits as number, map);

      this._writer.WriteVector(210, geodata.upDirection, map);

      this._writer.WriteVector(12, geodata.northDirection, map);

      this._writer.Write(95, geodata.scaleEstimationMethod, map);
      this._writer.Write(141, geodata.userSpecifiedScaleFactor, map);
      this._writer.Write(294, geodata.enableSeaLevelCorrection, map);
      this._writer.Write(142, geodata.seaLevelElevation, map);
      this._writer.Write(143, geodata.coordinateProjectionRadius, map);

      this.writeLongTextValue(301, 303, geodata.coordinateSystemDefinition);

      this._writer.Write(302, geodata.geoRssTag, map);
      this._writer.Write(305, geodata.observationFromTag, map);
      this._writer.Write(306, geodata.observationToTag, map);
      this._writer.Write(307, geodata.observationCoverageTag, map);

      this._writer.Write(93, geodata.points.length, map);
      for (const pt of geodata.points) {
        this._writer.WriteVector(13, pt.source, map);
        this._writer.WriteVector(14, pt.destination, map);
      }

      this._writer.Write(96, geodata.faces.length, map);

      for (const face of geodata.faces) {
        this._writer.Write(97, face.index1, map);
        this._writer.Write(98, face.index2, map);
        this._writer.Write(99, face.index3, map);
      }
    }
  }

  protected writeGroup(group: Group): void {
    this._writer.Write(100, DxfSubclassMarker.Group);

    this._writer.Write(300, group.description);
    this._writer.Write(70, group.isUnnamed ? 1 : 0);
    this._writer.Write(71, group.selectable ? 1 : 0);

    for (const entity of group.entities) {
      this._writer.WriteHandle(340, entity);
    }
  }

  protected writeImageDefinition(definition: ImageDefinition): void {
    const map = DxfClassMap.Create(ImageDefinition);

    this._writer.Write(100, DxfSubclassMarker.RasterImageDef);

    this._writer.Write(90, definition.classVersion, map);
    this._writer.Write(1, definition.fileName, map);

    this._writer.WriteVector(10, definition.size, map);

    this._writer.Write(280, definition.isLoaded ? 1 : 0, map);

    this._writer.Write(281, definition.units as number, map);
  }

  protected writeLayout(layout: Layout): void {
    const map = DxfClassMap.Create(Layout);

    this.writePlotSettings(layout);

    this._writer.Write(100, DxfSubclassMarker.Layout);

    this._writer.Write(1, layout.name, map);

    this._writer.Write(71, layout.tabOrder, map);

    this._writer.WriteVector(10, layout.minLimits, map);
    this._writer.WriteVector(11, layout.maxLimits, map);
    this._writer.WriteVector(12, layout.insertionBasePoint, map);
    this._writer.WriteVector(13, layout.origin, map);
    this._writer.WriteVector(14, layout.minExtents, map);
    this._writer.WriteVector(15, layout.maxExtents, map);
    this._writer.WriteVector(16, layout.xAxis, map);
    this._writer.WriteVector(17, layout.yAxis, map);

    this._writer.Write(146, layout.elevation, map);

    this._writer.Write(76, 0, map);

    this._writer.WriteHandle(330, layout.associatedBlock, map);
  }

  protected writeMLineStyle(style: MLineStyle): void {
    const map = DxfClassMap.Create(MLineStyle);

    this._writer.Write(100, DxfSubclassMarker.MLineStyle);

    this._writer.Write(2, style.name, map);

    this._writer.Write(70, style.flags, map);

    this._writer.Write(3, style.description, map);

    this._writer.Write(62, style.fillColor.getApproxIndex(), map);

    this._writer.Write(51, style.startAngle, map);
    this._writer.Write(52, style.endAngle, map);
    this._writer.Write(71, style.elements.length, map);
    for (const element of style.elements) {
      this._writer.Write(49, element.offset, map);
      this._writer.Write(62, element.color.index, map);
      this._writer.Write(6, element.lineType.Name, map);
    }
  }

  protected writeMultiLeaderStyle(style: MultiLeaderStyle): void {
    const map = DxfClassMap.Create(MultiLeaderStyle);

    this._writer.Write(100, DxfSubclassMarker.MLeaderStyle);

    this._writer.Write(179, 2);
    this._writer.Write(170, style.contentType, map);
    this._writer.Write(171, style.multiLeaderDrawOrder, map);
    this._writer.Write(172, style.leaderDrawOrder, map);
    this._writer.Write(90, style.maxLeaderSegmentsPoints, map);
    this._writer.Write(40, style.firstSegmentAngleConstraint, map);
    this._writer.Write(41, style.secondSegmentAngleConstraint, map);
    this._writer.Write(173, style.pathType, map);
    this._writer.WriteCmColor(91, style.lineColor, map);
    this._writer.WriteHandle(340, style.leaderLineType);
    this._writer.Write(92, style.leaderLineWeight, map);
    this._writer.Write(290, style.enableLanding, map);
    this._writer.Write(42, style.landingGap, map);
    this._writer.Write(291, style.enableDogleg, map);
    this._writer.Write(43, style.landingDistance, map);
    this._writer.Write(3, style.description, map);
    this._writer.WriteHandle(341, style.arrowhead);
    this._writer.Write(44, style.arrowheadSize, map);
    this._writer.Write(300, style.defaultTextContents, map);
    this._writer.WriteHandle(342, style.textStyle);
    this._writer.Write(174, style.textLeftAttachment, map);
    this._writer.Write(178, style.textRightAttachment, map);
    this._writer.Write(175, style.textAngle, map);
    this._writer.Write(176, style.textAlignment, map);
    this._writer.WriteCmColor(93, style.textColor, map);
    this._writer.Write(45, style.textHeight, map);
    this._writer.Write(292, style.textFrame, map);
    this._writer.Write(297, style.textAlignAlwaysLeft, map);
    this._writer.Write(46, style.alignSpace, map);
    this._writer.WriteHandle(343, style.blockContent);
    this._writer.WriteCmColor(94, style.blockContentColor, map);

    this._writer.Write(47, style.blockContentScale.x, map);
    this._writer.Write(49, style.blockContentScale.y, map);
    this._writer.Write(140, style.blockContentScale.z, map);

    this._writer.Write(293, style.enableBlockContentScale, map);
    this._writer.Write(141, style.blockContentRotation, map);
    this._writer.Write(294, style.enableBlockContentRotation, map);
    this._writer.Write(177, style.blockContentConnection, map);
    this._writer.Write(142, style.scaleFactor, map);
    this._writer.Write(295, style.overwritePropertyValue, map);
    this._writer.Write(296, style.isAnnotative, map);
    this._writer.Write(143, style.breakGapSize, map);
    this._writer.Write(271, style.textAttachmentDirection, map);
    this._writer.Write(272, style.textBottomAttachment, map);
    this._writer.Write(273, style.textTopAttachment, map);
    this._writer.Write(298, false);
  }

  protected writeObject<T extends CadObject>(co: T): void {
    if (!this.isObjectSupported(co)) {
      return;
    }

    if (co instanceof XRecord && !this.Configuration.WriteXRecords) {
      return;
    }

    this._writer.Write(DxfCode.Start, co.objectName);

    this.writeCommonObjectData(co);

    if (co instanceof AcdbPlaceHolder) {
      this.writeAcdbPlaceHolder(co);
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
      this.writeDimensionAssociation(co);
    } else if (co instanceof GeoData) {
      this.writeGeoData(co);
    } else if (co instanceof Group) {
      this.writeGroup(co);
    } else if (co instanceof ImageDefinition) {
      this.writeImageDefinition(co);
      return;
    } else if (co instanceof ImageDefinitionReactor) {
      this.writeImageDefinitionReactor(co);
      return;
    } else if (co instanceof Layout) {
      this.writeLayout(co);
    } else if (co instanceof Field) {
      this.writeField(co);
    } else if (co instanceof FieldList) {
      this.writeFieldList(co);
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
      this.writeSpatialFilter(co);
    } else if (co instanceof SortEntitiesTable) {
      this.writeSortentsTable(co);
    } else if (co instanceof XRecord) {
      this.writeXRecord(co);
    } else {
      throw new Error(`Object not implemented : ${co.constructor.name}`);
    }

    this.writeExtendedData(co.extendedData);
  }

  protected writePdfUnderlayDefinition(definition: PdfUnderlayDefinition): void {
    const map = DxfClassMap.Create(PlotSettings);

    this._writer.Write(100, DxfSubclassMarker.UnderlayDefinition);

    this._writer.Write(1, definition.file, map);
    this._writer.Write(2, definition.page, map);
  }

  protected writePlotSettings(plot: PlotSettings): void {
    const map = DxfClassMap.Create(PlotSettings);

    this._writer.Write(100, DxfSubclassMarker.PlotSettings);

    this._writer.Write(1, plot.pageName, map);
    this._writer.Write(2, plot.systemPrinterName, map);

    this._writer.Write(4, plot.paperSize, map);

    this._writer.Write(6, plot.plotViewName, map);
    this._writer.Write(7, plot.styleSheet, map);

    this._writer.Write(40, plot.unprintableMargin.left, map);
    this._writer.Write(41, plot.unprintableMargin.bottom, map);
    this._writer.Write(42, plot.unprintableMargin.right, map);
    this._writer.Write(43, plot.unprintableMargin.top, map);
    this._writer.Write(44, plot.paperWidth, map);
    this._writer.Write(45, plot.paperHeight, map);
    this._writer.Write(46, plot.plotOriginX, map);
    this._writer.Write(47, plot.plotOriginY, map);
    this._writer.Write(48, plot.windowLowerLeftX, map);
    this._writer.Write(49, plot.windowLowerLeftY, map);

    this._writer.Write(140, plot.windowUpperLeftX, map);
    this._writer.Write(141, plot.windowUpperLeftY, map);
    this._writer.Write(142, plot.numeratorScale, map);
    this._writer.Write(143, plot.denominatorScale, map);

    this._writer.Write(70, plot.flags, map);

    this._writer.Write(72, plot.paperUnits, map);
    this._writer.Write(73, plot.paperRotation, map);
    this._writer.Write(74, plot.plotType, map);
    this._writer.Write(75, plot.scaledFit, map);
    this._writer.Write(76, plot.shadePlotMode, map);
    this._writer.Write(77, plot.shadePlotResolutionMode, map);
    this._writer.Write(78, plot.shadePlotDPI, map);
    this._writer.Write(147, plot.printScale, map);

    this._writer.Write(148, plot.paperImageOrigin.x, map);
    this._writer.Write(149, plot.paperImageOrigin.y, map);
  }

  protected writeRasterVariables(variables: RasterVariables): void {
    const map = DxfClassMap.Create(RasterVariables);

    this._writer.Write(100, DxfSubclassMarker.RasterVariables);

    this._writer.Write(90, variables.classVersion, map);
    this._writer.Write(70, variables.isDisplayFrameShown ? 1 : 0, map);
    this._writer.Write(71, variables.displayQuality, map);
    this._writer.Write(72, variables.displayQuality, map);
  }

  protected writeScale(scale: Scale): void {
    this._writer.Write(100, DxfSubclassMarker.Scale);

    this._writer.Write(70, 0);
    this._writer.Write(300, scale.name);
    this._writer.Write(140, scale.paperUnits);
    this._writer.Write(141, scale.drawingUnits);
    this._writer.Write(290, scale.isUnitScale ? 1 : 0);
  }

  protected writeSection(): void {
    while (this.Holder.Objects.length > 0) {
      const item: CadObject = this.Holder.Objects.shift()!;
      this.writeObject(item);
    }
  }

  protected writeXRecord(record: XRecord): void {
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.XRecord);

    this._writer.Write(280, record.cloningFlags);

    for (const e of record.entries) {
      switch (e.groupCode) {
        case GroupCodeValueType.None:
          break;
        case GroupCodeValueType.Point3D:
          if (e.value && typeof (e.value as any).X === 'number' && typeof (e.value as any).Y === 'number') {
            this._writer.WriteVector(e.code, e.value as IVector);
          } else {
            this._writer.Write(e.code, e.value);
          }
          break;
        case GroupCodeValueType.Handle:
        case GroupCodeValueType.ObjectId:
        case GroupCodeValueType.ExtendedDataHandle: {
          const obj = e.value as IHandledCadObject;
          this._writer.Write(e.code, obj.handle);
          break;
        }
        default:
          this._writer.Write(e.code, e.value);
          break;
      }
    }
  }

  private isObjectSupported(co: CadObject): boolean {
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

  private writeAcdbPlaceHolder(acdbPlaceHolder: AcdbPlaceHolder): void {
    // empty
  }

  private writeDimensionAssociation(dimAssociation: DimensionAssociation): void {
    const map = DxfClassMap.Create(DimensionAssociation);

    this._writer.Write(100, DxfSubclassMarker.DimensionAssociation);

    this._writer.WriteHandle(330, dimAssociation.dimension, map);
    this._writer.Write(90, dimAssociation.associativityFlags as number, map);
    this._writer.Write(70, dimAssociation.isTransSpace, map);
    this._writer.Write(71, dimAssociation.rotatedDimensionType, map);

    if ((dimAssociation.associativityFlags & AssociativityFlags.FirstPointReference) !== 0) {
      this.writeOsnapPointRef(dimAssociation.firstPointRef);
    }

    if ((dimAssociation.associativityFlags & AssociativityFlags.SecondPointReference) !== 0) {
      this.writeOsnapPointRef(dimAssociation.secondPointRef);
    }

    if ((dimAssociation.associativityFlags & AssociativityFlags.ThirdPointReference) !== 0) {
      this.writeOsnapPointRef(dimAssociation.thirdPointRef);
    }

    if ((dimAssociation.associativityFlags & AssociativityFlags.FourthPointReference) !== 0) {
      this.writeOsnapPointRef(dimAssociation.fourthPointRef);
    }
  }

  private writeField(field: Field): void {
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.Field);

    this._writer.Write(1, field.evaluatorId);

    this.writeLongTextValue(2, 3, field.fieldCode);

    this._writer.Write(90, field.children.length);
    for (const item of field.children) {
      this._writer.WriteHandle(360, item);
    }

    this._writer.Write(97, field.cadObjects.length);
    for (const item of field.cadObjects) {
      this._writer.WriteHandle(331, item);
    }

    this._writer.Write(91, field.evaluationOptionFlags as number);
    this._writer.Write(92, field.filingOptionFlags as number);
    this._writer.Write(94, field.fieldStateFlags as number);
    this._writer.Write(95, field.evaluationStatusFlags as number);
    this._writer.Write(96, field.evaluationErrorCode);
    this._writer.Write(300, field.evaluationErrorMessage);

    this._writer.Write(93, field.values.size);
    for (const [key, value] of field.values) {
      this._writer.Write(6, key);
      this.writeCadValue(value);
    }

    this._writer.Write(7, 'ACFD_FIELD_VALUE');
    this.writeCadValue(field.value);

    this.writeLongTextValue(301, 9, field.formatString);
    this._writer.Write(98, field.formatString.length);
  }

  private writeFieldList(fieldList: FieldList): void {
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.IdSet);

    this._writer.Write(90, fieldList.fields.length);
    for (const field of fieldList.fields) {
      this._writer.WriteHandle(330, field);
      this.Holder.Objects.push(field);
    }

    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.FieldList);
  }

  private writeImageDefinitionReactor(reactor: ImageDefinitionReactor): void {
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.RasterImageDefReactor);

    this._writer.Write(90, reactor.classVersion);
    this._writer.WriteHandle(330, reactor.image);
  }

  private writeOsnapPointRef(osnapPoint: OsnapPointRef | null): void {
    if (osnapPoint === null) {
      return;
    }

    this._writer.Write(1, DimensionAssociation.OsnapPointRefClassName);

    this._writer.Write(72, osnapPoint.objectOsnapType);
    this._writer.WriteHandle(331, osnapPoint.geometry);
    this._writer.Write(73, osnapPoint.subentType);
    this._writer.Write(91, osnapPoint.gsMarker);
    this._writer.Write(40, osnapPoint.geometryParameter);

    this._writer.WriteVector(10, osnapPoint.osnapPoint);

    this._writer.Write(75, osnapPoint.hasLastPointRef ? 1 : 0);
  }

  private writeSortentsTable(e: SortEntitiesTable): void {
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.SortentsTable);

    this._writer.WriteHandle(330, e.blockOwner);

    for (const item of e) {
      this._writer.WriteHandle(331, item.entity);
      this._writer.Write(5, item.sortHandle);
    }
  }

  private writeSpatialFilter(filter: SpatialFilter): void {
    const map = DxfClassMap.Create(SpatialFilter);

    this._writer.Write(100, DxfSubclassMarker.Filter);
    this._writer.Write(100, DxfSubclassMarker.SpatialFilter);

    this._writer.Write(70, filter.boundaryPoints.length, map);
    for (const pt of filter.boundaryPoints) {
      this._writer.WriteVector(10, pt, map);
    }

    this._writer.WriteVector(210, filter.normal, map);
    this._writer.WriteVector(11, filter.origin, map);
    this._writer.Write(71, filter.displayBoundary ? 1 : 0, map);

    this._writer.Write(72, filter.clipFrontPlane ? 1 : 0, map);
    if (filter.clipFrontPlane) {
      this._writer.Write(40, filter.frontDistance, map);
    }

    this._writer.Write(73, filter.clipBackPlane ? 1 : 0, map);
    if (filter.clipBackPlane) {
      this._writer.Write(41, filter.backDistance, map);
    }

    const array: number[] = [
      filter.inverseInsertTransform.M00, filter.inverseInsertTransform.M01, filter.inverseInsertTransform.M02, filter.inverseInsertTransform.M03,
      filter.inverseInsertTransform.M10, filter.inverseInsertTransform.M11, filter.inverseInsertTransform.M12, filter.inverseInsertTransform.M13,
      filter.inverseInsertTransform.M20, filter.inverseInsertTransform.M21, filter.inverseInsertTransform.M22, filter.inverseInsertTransform.M23,
      filter.insertTransform.M00, filter.insertTransform.M01, filter.insertTransform.M02, filter.insertTransform.M03,
      filter.insertTransform.M10, filter.insertTransform.M11, filter.insertTransform.M12, filter.insertTransform.M13,
      filter.insertTransform.M20, filter.insertTransform.M21, filter.insertTransform.M22, filter.insertTransform.M23,
    ];

    for (let i = 0; i < array.length; i++) {
      this._writer.Write(40, array[i]);
    }
  }
}
