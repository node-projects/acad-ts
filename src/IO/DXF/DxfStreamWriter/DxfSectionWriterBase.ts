import { IDxfStreamWriter } from './IDxfStreamWriter.js';
import { CadDocument } from '../../../CadDocument.js';
import { CadObjectHolder } from '../CadObjectHolder.js';
import { DxfWriterConfiguration } from '../DxfWriterConfiguration.js';
import { DxfCode } from '../../../DxfCode.js';
import { DxfFileToken } from '../../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../../DxfSubclassMarker.js';
import { DxfClassMap } from '../../../DxfClassMap.js';
import { DxfReferenceType } from '../../../Types/DxfReferenceType.js';
import { ACadVersion } from '../../../ACadVersion.js';
import { CadObject } from '../../../CadObject.js';
import { CadValue } from '../../../CadValue.js';
import { CadValueType } from '../../../CadValueType.js';
import { Entity } from '../../../Entities/Entity.js';
import { Arc } from '../../../Entities/Arc.js';
import { Circle } from '../../../Entities/Circle.js';
import { DimensionAligned } from '../../../Entities/DimensionAligned.js';
import { DimensionLinear } from '../../../Entities/DimensionLinear.js';
import { DimensionRadius } from '../../../Entities/DimensionRadius.js';
import { DimensionDiameter } from '../../../Entities/DimensionDiameter.js';
import { DimensionAngular2Line } from '../../../Entities/DimensionAngular2Line.js';
import { DimensionAngular3Pt } from '../../../Entities/DimensionAngular3Pt.js';
import { DimensionOrdinate } from '../../../Entities/DimensionOrdinate.js';
import { Dimension } from '../../../Entities/Dimension.js';
import { Ellipse } from '../../../Entities/Ellipse.js';
import { Face3D } from '../../../Entities/Face3D.js';
import { Hatch , HatchBoundaryPath, HatchBoundaryPathPolyline, HatchBoundaryPathEdge, HatchBoundaryPathLine, HatchBoundaryPathArc, HatchBoundaryPathEllipse, HatchBoundaryPathSpline} from '../../../Entities/Hatch.js';
import { HatchPattern } from '../../../Entities/HatchPattern.js';
import { Insert } from '../../../Entities/Insert.js';
import { Leader } from '../../../Entities/Leader.js';
import { Line } from '../../../Entities/Line.js';
import { LwPolyline } from '../../../Entities/LwPolyline.js';
import { Mesh } from '../../../Entities/Mesh.js';
import { MLine } from '../../../Entities/MLine.js';
import { MText } from '../../../Entities/MText.js';
import { MultiLeader } from '../../../Entities/MultiLeader.js';
import { MultiLeaderObjectContextData , LeaderRoot, LeaderLine} from '../../../Objects/MultiLeaderObjectContextData.js';
import { Ole2Frame } from '../../../Entities/Ole2Frame.js';
import { PdfUnderlay } from '../../../Entities/PdfUnderlay.js';
import { Point } from '../../../Entities/Point.js';
import { Polyline2D } from '../../../Entities/Polyline2D.js';
import { Polyline3D } from '../../../Entities/Polyline3D.js';
import { PolyfaceMesh } from '../../../Entities/PolyfaceMesh.js';
import { PolygonMesh } from '../../../Entities/PolygonMesh.js';
import { Ray } from '../../../Entities/Ray.js';
import { Shape } from '../../../Entities/Shape.js';
import { Solid } from '../../../Entities/Solid.js';
import { Spline } from '../../../Entities/Spline.js';
import { TextEntity } from '../../../Entities/TextEntity.js';
import { Tolerance } from '../../../Entities/Tolerance.js';
import { Vertex } from '../../../Entities/Vertex.js';
import { Vertex2D } from '../../../Entities/Vertex2D.js';
import { Vertex3D } from '../../../Entities/Vertex3D.js';
import { VertexFaceMesh } from '../../../Entities/VertexFaceMesh.js';
import { VertexFaceRecord } from '../../../Entities/VertexFaceRecord.js';
import { PolygonMeshVertex } from '../../../Entities/PolygonMeshVertex.js';
import { Viewport } from '../../../Entities/Viewport.js';
import { XLine } from '../../../Entities/XLine.js';
import { CadImage } from '../../../Entities/CadWipeoutBase.js';
import { RasterImage } from '../../../Entities/RasterImage.js';
import { Wipeout } from '../../../Entities/Wipeout.js';
import { Seqend } from '../../../Entities/Seqend.js';
import { AttributeBase } from '../../../Entities/AttributeBase.js';
import { AttributeEntity } from '../../../Entities/AttributeEntity.js';
import { AttributeDefinition } from '../../../Entities/AttributeDefinition.js';
import { DimensionStyle } from '../../../Tables/DimensionStyle.js';
import { BlockRecord } from '../../../Tables/BlockRecord.js';
import { Transparency } from '../../../Transparency.js';
import { Color } from '../../../Color.js';
import { IHandledCadObject } from '../../../IHandledCadObject.js';
import { IVector } from '../../../Math/IVector.js';
import { ExtendedDataDictionary } from '../../../XData/ExtendedDataDictionary.js';
import { ExtendedDataRecord } from '../../../XData/ExtendedDataRecord.js';
import { ExtendedDataBinaryChunk } from '../../../XData/ExtendedDataBinaryChunk.js';
import { ExtendedDataControlString } from '../../../XData/ExtendedDataControlString.js';
import { ExtendedDataInteger16 } from '../../../XData/ExtendedDataInteger16.js';
import { ExtendedDataInteger32 } from '../../../XData/ExtendedDataInteger32.js';
import { ExtendedDataReal } from '../../../XData/ExtendedDataReal.js';
import { ExtendedDataScale } from '../../../XData/ExtendedDataScale.js';
import { ExtendedDataDistance } from '../../../XData/ExtendedDataDistance.js';
import { ExtendedDataDisplacement } from '../../../XData/ExtendedDataDisplacement.js';
import { ExtendedDataDirection } from '../../../XData/ExtendedDataDirection.js';
import { ExtendedDataCoordinate } from '../../../XData/ExtendedDataCoordinate.js';
import { ExtendedDataWorldCoordinate } from '../../../XData/ExtendedDataWorldCoordinate.js';
import { IExtendedDataHandleReference } from '../../../XData/IExtendedDataHandleReference.js';
import { ExtendedDataString } from '../../../XData/ExtendedDataString.js';
import { NotificationEventHandler, NotificationEventArgs, NotificationType } from '../../NotificationEventHandler.js';
import { DxfMap } from '../../../DxfMap.js';
import { BoundaryPathFlags } from '../../../Entities/BoundaryPathFlags.js';
import { UnknownEntity } from '../../../Entities/UnknownEntity.js';
import { MathHelper } from '../../../Math/MathHelper.js';
import { XYZ } from '../../../Math/XYZ.js';
import { XY } from '../../../Math/XY.js';

export abstract class DxfSectionWriterBase {
  public onNotification: NotificationEventHandler | null = null;

  public abstract get sectionName(): string;

  public get version(): ACadVersion {
    return this._document.header.version;
  }

  public holder: CadObjectHolder;

  public configuration: DxfWriterConfiguration;

  protected _writer: IDxfStreamWriter;
  protected _document: CadDocument;

  public constructor(
    writer: IDxfStreamWriter,
    document: CadDocument,
    holder: CadObjectHolder,
    configuration: DxfWriterConfiguration
  ) {
    this._writer = writer;
    this._document = document;
    this.holder = holder;
    this.configuration = configuration;
  }

  public write(): void {
    this._writer.write(DxfCode.Start, DxfFileToken.beginSection);
    this._writer.write(DxfCode.SymbolTableName, this.sectionName);

    this.writeSection();

    this._writer.write(DxfCode.Start, DxfFileToken.endSection);
  }

  protected writeCadValue(value: CadValue): void {
    this._writer.write(93, value.flags);
    this._writer.write(90, value.valueType as number);

    switch (value.valueType) {
      case CadValueType.Unknown:
        this._writer.write(91, 0);
        break;
      case CadValueType.Double:
        this._writer.write(140, Number(value.value));
        break;
      case CadValueType.Date:
        this._writer.write(91, 0);
        break;
      case CadValueType.General:
      case CadValueType.String:
        this.writeLongTextValue(1, 2, value.value as string);
        break;
      case CadValueType.Point2D:
      case CadValueType.Point3D:
        this._writer.writeVector(11, value.value as IVector);
        break;
      case CadValueType.Long:
        this._writer.write(91, Number(value.value));
        break;
      case CadValueType.Handle: {
        const handleObj = value.value as IHandledCadObject;
        if (handleObj) {
          this._writer.writeHandle(330, handleObj);
        }
        break;
      }
      case CadValueType.Buffer:
      case CadValueType.ResultBuffer:
        this._writer.write(91, 0);
        break;
    }
  }

  protected writeCommonObjectData(cadObject: CadObject): void {
    if (cadObject instanceof DimensionStyle) {
      this._writer.write(DxfCode.DimVarHandle, cadObject.handle);
    } else {
      this._writer.write(DxfCode.Handle, cadObject.handle);
    }

    if (cadObject.xDictionary !== null) {
      this._writer.write(DxfCode.ControlString, DxfFileToken.dictionaryToken);
      this._writer.write(DxfCode.HardOwnershipId, cadObject.xDictionary.handle);
      this._writer.write(DxfCode.ControlString, "}");
      this.holder.objects.push(cadObject.xDictionary);
    }

    cadObject.cleanReactors();
    if (cadObject.reactors.length > 0) {
      this._writer.write(DxfCode.ControlString, DxfFileToken.reactorsToken);
      for (const reactor of cadObject.reactors) {
        this._writer.write(DxfCode.SoftPointerId, reactor.handle);
      }
      this._writer.write(DxfCode.ControlString, "}");
    }

    this._writer.write(DxfCode.SoftPointerId, cadObject.owner!.handle);
  }

  protected writeExtendedData(xdata: ExtendedDataDictionary | null): void {
    if (xdata === null || !this.configuration.writeXData) {
      return;
    }

    for (const [appId, edataCollection] of xdata) {
      this._writer.write(DxfCode.ExtendedDataRegAppName, appId.name);

      for (const record of edataCollection.records) {
        if (record instanceof ExtendedDataBinaryChunk) {
          this._writer.write(record.code, record.value);
        } else if (record instanceof ExtendedDataControlString) {
          this._writer.write(record.code, record.value);
        } else if (record instanceof ExtendedDataInteger16) {
          this._writer.write(record.code, record.value);
        } else if (record instanceof ExtendedDataInteger32) {
          this._writer.write(record.code, record.value);
        } else if (record instanceof ExtendedDataReal) {
          this._writer.write(record.code, record.value);
        } else if (record instanceof ExtendedDataScale) {
          this._writer.write(record.code, record.value);
        } else if (record instanceof ExtendedDataDistance) {
          this._writer.write(record.code, record.value);
        } else if (record instanceof ExtendedDataDisplacement) {
          this._writer.write(record.code, record.value);
        } else if (record instanceof ExtendedDataDirection) {
          this._writer.writeVector(record.code, record.value as IVector);
        } else if (record instanceof ExtendedDataCoordinate) {
          this._writer.writeVector(record.code, record.value as IVector);
        } else if (record instanceof ExtendedDataWorldCoordinate) {
          this._writer.writeVector(record.code, record.value as IVector);
        } else if (typeof (record as Partial<IExtendedDataHandleReference>).resolveReference === 'function') {
          const handle = record as Partial<IExtendedDataHandleReference>;
          let h = handle.value;
          if (handle.resolveReference(this._document) === null) {
            h = 0;
          }
          this._writer.write(DxfCode.ExtendedDataHandle, h);
        } else if (record instanceof ExtendedDataString) {
          this._writer.write(record.code, record.value);
        } else {
          throw new Error(`ExtendedDataRecord of type ${record.constructor.name} not supported.`);
        }
      }
    }
  }

  protected writeCommonEntityData(entity: Entity): void {
    const map = DxfClassMap.create(Entity);

    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.entity);

    this._writer.write(8, entity.layer?.name ?? '0');
    this._writer.write(6, entity.lineType?.name ?? 'ByLayer');

    if (entity.bookColor !== null) {
      this._writer.write(62, entity.bookColor.color.getApproxIndex());
      this._writer.writeTrueColor(420, entity.bookColor.color);
      this._writer.write(430, entity.bookColor.name);
    } else if (entity.color.isTrueColor) {
      this._writer.writeTrueColor(420, entity.color);
    } else {
      this._writer.write(62, entity.color.index);
    }

    if (entity.transparency.value >= 0) {
      this._writer.write(440, Transparency.toAlphaValue(entity.transparency));
    }

    this._writer.write(48, entity.lineTypeScale, map);
    this._writer.write(60, entity.isInvisible ? 1 : 0, map);

    if (entity.owner instanceof BlockRecord) {
      const record = entity.owner as BlockRecord;
      if (record.layout !== null) {
        this._writer.write(67, record.layout.isPaperSpace ? 1 : 0);
      }
    }

    this._writer.write(370, entity.lineWeight);
  }

  protected abstract writeSection(): void;

  protected writeLongTextValue(code: number, subcode: number, text: string): void {
    while (text.length > 250) {
      this._writer.write(subcode, text.substring(0, 250));
      text = text.substring(250);
    }
    this._writer.write(code, text);
  }

  protected notify(message: string, notificationType: NotificationType = NotificationType.None, ex?: Error): void {
    if (this.onNotification) {
      this.onNotification(this, new NotificationEventArgs(message, notificationType, ex));
    }
  }

  // =====================================================
  // Entity writing methods (from DxfSectionWriterBase.Entities.cs)
  // =====================================================

  protected writeEntity(entity: Entity): void {
    if (!this._isEntitySupported(entity)) {
      return;
    }

    this._writer.write(DxfCode.Start, entity.objectName);

    this.writeCommonObjectData(entity);
    this.writeCommonEntityData(entity);

    const map = DxfMap.create(entity.constructor.name);

    if (entity instanceof Arc) {
      this._writeArc(entity, map);
    } else if (entity instanceof Circle) {
      this._writeCircle(entity, map);
    } else if (entity instanceof DimensionLinear) {
      this._writeDimension(entity, map);
    } else if (entity instanceof DimensionAligned) {
      this._writeDimension(entity, map);
    } else if (entity instanceof DimensionRadius) {
      this._writeDimension(entity, map);
    } else if (entity instanceof DimensionDiameter) {
      this._writeDimension(entity, map);
    } else if (entity instanceof DimensionAngular2Line) {
      this._writeDimension(entity, map);
    } else if (entity instanceof DimensionAngular3Pt) {
      this._writeDimension(entity, map);
    } else if (entity instanceof DimensionOrdinate) {
      this._writeDimension(entity, map);
    } else if (entity instanceof Ellipse) {
      this._writeEllipse(entity, map);
    } else if (entity instanceof Face3D) {
      this._writeFace3D(entity, map);
    } else if (entity instanceof Hatch) {
      this._writeHatch(entity, map);
    } else if (entity instanceof Insert) {
      this._writeInsert(entity, map);
    } else if (entity instanceof Leader) {
      this._writeLeader(entity, map);
    } else if (entity instanceof Line) {
      this._writeLine(entity, map);
    } else if (entity instanceof LwPolyline) {
      this._writeLwPolyline(entity, map);
    } else if (entity instanceof Mesh) {
      this._writeMesh(entity, map);
    } else if (entity instanceof MLine) {
      this._writeMLine(entity, map);
    } else if (entity instanceof MText) {
      this._writeMText(entity, map);
    } else if (entity instanceof MultiLeader) {
      this._writeMultiLeader(entity, map);
    } else if (entity instanceof Ole2Frame) {
      this._writeOle2Frame(entity, map);
    } else if (entity instanceof PdfUnderlay) {
      this._writePdfUnderlay(entity, map);
    } else if (entity instanceof Point) {
      this._writePoint(entity, map);
    } else if (entity instanceof Polyline2D) {
      this._writePolyline(entity, map);
    } else if (entity instanceof Polyline3D) {
      this._writePolyline(entity, map);
    } else if (entity instanceof PolyfaceMesh) {
      this._writePolyline(entity, map);
    } else if (entity instanceof PolygonMesh) {
      this._writePolyline(entity, map);
    } else if (entity instanceof Ray) {
      this._writeRay(entity, map);
    } else if (entity instanceof Shape) {
      this._writeShape(entity, map);
    } else if (entity instanceof Solid) {
      this._writeSolid(entity, map);
    } else if (entity instanceof Spline) {
      this._writeSpline(entity, map);
    } else if (entity instanceof TextEntity) {
      this._writeTextEntity(entity, map);
    } else if (entity instanceof Tolerance) {
      this._writeTolerance(entity, map);
    } else if (entity instanceof Viewport) {
      this._writeViewport(entity, map);
    } else if (entity instanceof XLine) {
      this._writeXLine(entity, map);
    } else if (entity instanceof RasterImage || entity instanceof Wipeout) {
      this._writeCadImage(entity as CadImage, map);
    } else if (entity instanceof Seqend) {
      this._writeSeqend(entity, map);
    } else {
      this.notify(`Entity not implemented: ${entity.constructor.name}`, NotificationType.NotImplemented);
    }

    this.writeExtendedData(entity.extendedData);
  }

  private _isEntitySupported(entity: Entity): boolean {
    if (entity instanceof UnknownEntity) {
      return false;
    }
    return true;
  }

  private _writeArc(arc: Arc, map: DxfMap): void {
    this._writeCircle(arc, map);
    const subclass = map.subClasses.get(DxfSubclassMarker.arc)!;
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.arc);
    this._writer.write(50, arc.startAngle, subclass);
    this._writer.write(51, arc.endAngle, subclass);
  }

  private _writeCircle(circle: Circle, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.circle)!;
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.circle);
    this._writer.writeVector(10, circle.center, subclass);
    this._writer.write(40, circle.radius, subclass);
    this._writer.write(39, circle.thickness, subclass);
    this._writer.writeVector(210, circle.normal, subclass);
  }

  private _writeDimension(dim: Dimension, map: DxfMap): void {
    const dimMap = map.subClasses.get(DxfSubclassMarker.dimension)!;
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.dimension);

    this._writer.write(2, dim.block?.name ?? '', dimMap);
    this._writer.writeVector(10, dim.definitionPoint, dimMap);
    this._writer.writeVector(11, dim.textMiddlePoint, dimMap);
    this._writer.write(70, dim.flags, dimMap);
    this._writer.write(71, dim.attachmentPoint, dimMap);
    this._writer.write(72, dim.lineSpacingStyle, dimMap);
    this._writer.write(41, dim.lineSpacingFactor, dimMap);
    this._writer.write(42, dim.measurement, dimMap);
    this._writer.write(1, dim.text, dimMap);
    this._writer.write(53, dim.textRotation, dimMap);
    this._writer.write(51, dim.horizontalDirection, dimMap);
    this._writer.writeVector(210, dim.normal, dimMap);
    this._writer.write(3, dim.style?.name ?? '', dimMap);

    if (dim instanceof DimensionAligned) {
      this._writeDimensionAligned(dim, map);
    }
    if (dim instanceof DimensionLinear) {
      this._writeDimensionLinear(dim, map);
    }
    if (dim instanceof DimensionRadius) {
      this._writeDimensionRadius(dim, map);
    }
    if (dim instanceof DimensionDiameter) {
      this._writeDimensionDiameter(dim, map);
    }
    if (dim instanceof DimensionAngular2Line) {
      this._writeDimensionAngular2Line(dim, map);
    }
    if (dim instanceof DimensionAngular3Pt) {
      this._writeDimensionAngular3Pt(dim, map);
    }
    if (dim instanceof DimensionOrdinate) {
      this._writeDimensionOrdinate(dim, map);
    }
  }

  private _writeDimensionAligned(dim: DimensionAligned, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.alignedDimension)!;
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.alignedDimension);
    this._writer.writeVector(13, dim.firstPoint, subclass);
    this._writer.writeVector(14, dim.secondPoint, subclass);
  }

  private _writeDimensionLinear(dim: DimensionLinear, map: DxfMap): void {
    this._writeDimensionAligned(dim, map);
    const subclass = map.subClasses.get(DxfSubclassMarker.linearDimension);
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.linearDimension);
    this._writer.write(50, dim.rotation, subclass);
  }

  private _writeDimensionRadius(dim: DimensionRadius, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.radialDimension)!;
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.radialDimension);
    this._writer.writeVector(15, dim.angleVertex, subclass);
    this._writer.write(40, dim.leaderLength, subclass);
  }

  private _writeDimensionDiameter(dim: DimensionDiameter, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.diametricDimension)!;
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.diametricDimension);
    this._writer.writeVector(15, dim.angleVertex, subclass);
    this._writer.write(40, dim.leaderLength, subclass);
  }

  private _writeDimensionAngular2Line(dim: DimensionAngular2Line, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.angular2LineDimension)!;
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.angular2LineDimension);
    this._writer.writeVector(13, dim.firstPoint, subclass);
    this._writer.writeVector(14, dim.secondPoint, subclass);
    this._writer.writeVector(15, dim.angleVertex, subclass);
    this._writer.writeVector(16, dim.dimensionArc, subclass);
  }

  private _writeDimensionAngular3Pt(dim: DimensionAngular3Pt, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.angular3PointDimension)!;
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.angular3PointDimension);
    this._writer.writeVector(13, dim.firstPoint, subclass);
    this._writer.writeVector(14, dim.secondPoint, subclass);
    this._writer.writeVector(15, dim.angleVertex, subclass);
  }

  private _writeDimensionOrdinate(dim: DimensionOrdinate, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.ordinateDimension)!;
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.ordinateDimension);
    this._writer.writeVector(13, dim.featureLocation, subclass);
    this._writer.writeVector(14, dim.leaderEndpoint, subclass);
  }

  private _writeEllipse(ellipse: Ellipse, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.ellipse)!;
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.ellipse);
    this._writer.writeVector(10, ellipse.center, subclass);
    this._writer.writeVector(11, ellipse.majorAxisEndPoint, subclass);
    this._writer.writeVector(210, ellipse.normal, subclass);
    this._writer.write(40, ellipse.radiusRatio, subclass);
    this._writer.write(41, ellipse.startParameter, subclass);
    this._writer.write(42, ellipse.endParameter, subclass);
  }

  private _writeFace3D(face: Face3D, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.face3d)!;
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.face3d);
    this._writer.writeVector(10, face.firstCorner, subclass);
    this._writer.writeVector(11, face.secondCorner, subclass);
    this._writer.writeVector(12, face.thirdCorner, subclass);
    this._writer.writeVector(13, face.fourthCorner, subclass);
    this._writer.write(70, face.flags, subclass);
  }

  private _writeHatch(hatch: Hatch, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.hatch)!;
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.hatch);

    this._writer.write(30, hatch.elevation, subclass);
    this._writer.writeVector(210, hatch.normal, subclass);

    this._writer.write(2, hatch.pattern.name, subclass);
    this._writer.write(70, hatch.isSolid ? 1 : 0, subclass);
    this._writer.write(71, hatch.isAssociative ? 1 : 0, subclass);

    this._writer.write(91, hatch.paths.length);

    for (const path of hatch.paths) {
      this._writeBoundaryPath(path);
    }

    this._writer.write(75, hatch.style, subclass);
    this._writer.write(76, hatch.patternType, subclass);

    if (!hatch.isSolid) {
      this._writer.write(52, hatch.patternAngle, subclass);
      this._writer.write(41, hatch.patternScale, subclass);
      this._writer.write(77, hatch.isDouble ? 1 : 0, subclass);

      this._writer.write(78, hatch.pattern.lines.length);
      for (const line of hatch.pattern.lines) {
        this._writer.write(53, line.angle);
        this._writer.write(43, line.basePoint.x);
        this._writer.write(44, line.basePoint.y);
        this._writer.write(45, line.offset.x);
        this._writer.write(46, line.offset.y);
        this._writer.write(79, line.dashLengths.length);
        for (const dash of line.dashLengths) {
          this._writer.write(49, dash);
        }
      }
    }

    this._writer.write(47, hatch.pixelSize, subclass);

    this._writer.write(98, hatch.seedPoints.length);
    for (const pt of hatch.seedPoints) {
      this._writer.write(10, pt.x);
      this._writer.write(20, pt.y);
    }

    if (hatch.gradientColor.enabled) {
      this._writer.write(450, hatch.gradientColor.enabled ? 1 : 0);
      this._writer.write(451, hatch.gradientColor.reserved);
      this._writer.write(452, hatch.gradientColor.isSingleColorGradient ? 1 : 0);
      this._writer.write(453, hatch.gradientColor.colors.length);
      for (const gc of hatch.gradientColor.colors) {
        this._writer.write(463, gc.value);
        this._writer.write(63, gc.color.index);
        this._writer.write(421, gc.color.trueColor);
      }
      this._writer.write(460, hatch.gradientColor.angle);
      this._writer.write(461, hatch.gradientColor.shift);
      this._writer.write(462, hatch.gradientColor.colorTint);
      this._writer.write(470, hatch.gradientColor.name);
    }
  }

  private _writeBoundaryPath(path: HatchBoundaryPath): void {
    this._writer.write(92, path.flags as number);

    if ((path.flags & BoundaryPathFlags.Polyline) !== 0) {
      for (const edge of path.edges) {
        if (edge instanceof HatchBoundaryPathPolyline) {
          this._writePolylineBoundary(edge);
        }
      }
    } else {
      this._writer.write(93, path.edges.length);
      for (const edge of path.edges) {
        this._writeBoundaryEdge(edge);
      }
    }

    this._writer.write(97, path.entities.length);
    for (const entity of path.entities) {
      this._writer.write(330, entity.handle);
    }
  }

  private _writePolylineBoundary(polyline: HatchBoundaryPathPolyline): void {
    const hasBulge = polyline.vertices.some(v => v.z !== 0);
    this._writer.write(72, hasBulge ? 1 : 0);
    this._writer.write(73, polyline.isClosed ? 1 : 0);
    this._writer.write(93, polyline.vertices.length);
    for (const v of polyline.vertices) {
      this._writer.write(10, v.x);
      this._writer.write(20, v.y);
      if (hasBulge) {
        this._writer.write(42, v.z);
      }
    }
  }

  private _writeBoundaryEdge(edge: HatchBoundaryPathEdge): void {
    if (edge instanceof HatchBoundaryPathLine) {
      this._writer.write(72, 1);
      this._writer.write(10, edge.start.x);
      this._writer.write(20, edge.start.y);
      this._writer.write(11, edge.end.x);
      this._writer.write(21, edge.end.y);
    } else if (edge instanceof HatchBoundaryPathArc) {
      this._writer.write(72, 2);
      this._writer.write(10, edge.center.x);
      this._writer.write(20, edge.center.y);
      this._writer.write(40, edge.radius);
      this._writer.write(50, MathHelper.radToDeg(edge.startAngle));
      this._writer.write(51, MathHelper.radToDeg(edge.endAngle));
      this._writer.write(73, edge.counterClockWise ? 1 : 0);
    } else if (edge instanceof HatchBoundaryPathEllipse) {
      this._writer.write(72, 3);
      this._writer.write(10, edge.center.x);
      this._writer.write(20, edge.center.y);
      this._writer.write(11, edge.majorAxisEndPoint.x);
      this._writer.write(21, edge.majorAxisEndPoint.y);
      this._writer.write(40, edge.minorToMajorRatio);
      this._writer.write(50, MathHelper.radToDeg(edge.startAngle));
      this._writer.write(51, MathHelper.radToDeg(edge.endAngle));
      this._writer.write(73, edge.counterClockWise ? 1 : 0);
    } else if (edge instanceof HatchBoundaryPathSpline) {
      this._writer.write(72, 4);
      this._writer.write(94, edge.degree);
      this._writer.write(73, edge.isRational ? 1 : 0);
      this._writer.write(74, edge.isPeriodic ? 1 : 0);
      this._writer.write(95, edge.knots.length);
      this._writer.write(96, edge.controlPoints.length);
      for (const k of edge.knots) {
        this._writer.write(40, k);
      }
      for (const cp of edge.controlPoints) {
        this._writer.write(10, cp.x);
        this._writer.write(20, cp.y);
        if (edge.isRational) {
          this._writer.write(42, cp.z);
        }
      }
      if (edge.fitPoints.length > 0) {
        this._writer.write(97, edge.fitPoints.length);
        for (const fp of edge.fitPoints) {
          this._writer.write(11, fp.x);
          this._writer.write(21, fp.y);
        }
      }
      this._writer.write(12, edge.startTangent.x);
      this._writer.write(22, edge.startTangent.y);
      this._writer.write(13, edge.endTangent.x);
      this._writer.write(23, edge.endTangent.y);
    }
  }

  private _writeInsert(insert: Insert, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.insert)!;
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.insert);

    this._writer.write(66, insert.hasAttributes ? 1 : 0);
    this._writer.write(2, insert.block?.name ?? '', subclass);
    this._writer.writeVector(10, insert.insertPoint, subclass);
    this._writer.write(41, insert.xScale, subclass);
    this._writer.write(42, insert.yScale, subclass);
    this._writer.write(43, insert.zScale, subclass);
    this._writer.write(50, insert.rotation, subclass);
    this._writer.write(70, insert.columnCount, subclass);
    this._writer.write(71, insert.rowCount, subclass);
    this._writer.write(44, insert.columnSpacing, subclass);
    this._writer.write(45, insert.rowSpacing, subclass);
    this._writer.writeVector(210, insert.normal, subclass);

    for (const att of insert.attributes) {
      this.writeEntity(att);
    }

    if (insert.hasAttributes && insert.attributes.seqend) {
      this.writeEntity(insert.attributes.seqend);
    }
  }

  private _writeLeader(leader: Leader, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.leader)!;
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.leader);

    this._writer.write(3, leader.style?.name ?? '', subclass);
    this._writer.write(71, leader.arrowHeadEnabled ? 1 : 0, subclass);
    this._writer.write(72, leader.pathType, subclass);
    this._writer.write(73, leader.creationType, subclass);
    this._writer.write(74, leader.hookLineDirection ? 1 : 0, subclass);
    this._writer.write(75, leader.hasHookline ? 1 : 0, subclass);
    this._writer.write(40, leader.textHeight, subclass);
    this._writer.write(41, leader.textWidth, subclass);
    this._writer.write(76, leader.vertices.length);

    for (const v of leader.vertices) {
      this._writer.writeVector(10, v);
    }

    this._writer.write(77, leader.color ? 1 : 0, subclass);
    this._writer.writeHandle(340, leader.associatedAnnotation);
    this._writer.writeVector(210, leader.normal, subclass);
    this._writer.writeVector(211, leader.horizontalDirection, subclass);
    this._writer.writeVector(212, leader.blockOffset, subclass);
    this._writer.writeVector(213, leader.annotationOffset, subclass);
  }

  private _writeLine(line: Line, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.line)!;
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.line);
    this._writer.write(39, line.thickness, subclass);
    this._writer.writeVector(10, line.startPoint, subclass);
    this._writer.writeVector(11, line.endPoint, subclass);
    this._writer.writeVector(210, line.normal, subclass);
  }

  private _writeLwPolyline(polyline: LwPolyline, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.lwPolyline)!;
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.lwPolyline);

    this._writer.write(90, polyline.vertices.length);
    this._writer.write(70, polyline.flags, subclass);
    this._writer.write(43, polyline.constantWidth, subclass);
    this._writer.write(38, polyline.elevation, subclass);
    this._writer.write(39, polyline.thickness, subclass);
    this._writer.writeVector(210, polyline.normal, subclass);

    for (const v of polyline.vertices) {
      this._writer.write(10, v.location.x);
      this._writer.write(20, v.location.y);
      this._writer.write(40, v.startWidth);
      this._writer.write(41, v.endWidth);
      this._writer.write(42, v.bulge);
      if (v.id !== 0) {
        this._writer.write(91, v.id);
      }
    }
  }

  private _writeMesh(mesh: Mesh, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.mesh)!;
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.mesh);

    this._writer.write(71, mesh.subdivisionLevel, subclass);

    this._writer.write(72, 0); // override count
    this._writer.write(91, 0); // sub entity count

    this._writer.write(92, mesh.vertices.length);
    for (const v of mesh.vertices) {
      this._writer.writeVector(10, v);
    }

    let faceListSize = 0;
    for (const face of mesh.faces) {
      faceListSize += 1 + face.length;
    }
    this._writer.write(93, faceListSize);
    for (const face of mesh.faces) {
      this._writer.write(90, face.length);
      for (const idx of face) {
        this._writer.write(90, idx);
      }
    }

    this._writer.write(94, mesh.edges.length);
    for (const edge of mesh.edges) {
      this._writer.write(90, edge.start);
      this._writer.write(90, edge.end);
    }

    this._writer.write(95, mesh.edges.length);
    for (const edge of mesh.edges) {
      this._writer.write(140, edge.crease);
    }
  }

  private _writeMLine(mline: MLine, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.mLine)!;
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.mLine);

    this._writer.writeHandle(340, mline.style, subclass);
    this._writer.write(40, mline.scaleFactor, subclass);
    this._writer.write(70, mline.justification, subclass);
    this._writer.write(71, mline.flags, subclass);
    this._writer.write(72, mline.vertices.length);
    this._writer.write(73, mline.style?.elements.length ?? 0);

    this._writer.writeVector(10, mline.startPoint, subclass);
    this._writer.writeVector(210, mline.normal, subclass);

    for (const vertex of mline.vertices) {
      this._writer.writeVector(11, vertex.position);
      this._writer.writeVector(12, vertex.direction);
      this._writer.writeVector(13, vertex.miter);

      for (const segment of vertex.segments) {
        this._writer.write(74, segment.parameters.length);
        for (const p of segment.parameters) {
          this._writer.write(41, p);
        }
        this._writer.write(75, segment.areaFillParameters.length);
        for (const p of segment.areaFillParameters) {
          this._writer.write(42, p);
        }
      }
    }
  }

  private _writeMText(mtext: MText, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.mText)!;
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.mText);

    this._writer.writeVector(10, mtext.insertPoint, subclass);
    this._writer.write(40, mtext.height, subclass);
    this._writer.write(41, mtext.rectangleWidth, subclass);
    this._writer.write(46, mtext.rectangleHeight, subclass);
    this._writer.write(71, mtext.attachmentPoint, subclass);
    this._writer.write(72, mtext.drawingDirection, subclass);

    this.writeLongTextValue(1, 3, mtext.value ?? '');

    this._writer.write(7, mtext.style?.name ?? '', subclass);
    this._writer.writeVector(210, mtext.normal, subclass);
    this._writer.writeVector(11, mtext.alignmentPoint, subclass);
    this._writer.write(73, mtext.lineSpacingStyle, subclass);
    this._writer.write(44, mtext.lineSpacing, subclass);
    this._writer.write(90, mtext.backgroundFillFlags, subclass);

    if (mtext.backgroundFillFlags > 0) {
      this._writer.write(63, mtext.backgroundColor.index);
      this._writer.write(45, mtext.backgroundScale, subclass);
      this._writer.writeTrueColor(420, mtext.backgroundColor);
      this._writer.write(441, mtext.backgroundTransparency);
    }
  }

  private _writeMultiLeader(mleader: MultiLeader, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.leader)!;
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.leader);

    this._writer.write(270, mleader.contentType, subclass);
    this._writer.writeHandle(340, mleader.style);
    this._writer.writeHandle(341, mleader.leaderLineType);
    this._writer.writeCmColor(91, mleader.lineColor, subclass);
    this._writer.write(170, mleader.pathType, subclass);
    this._writer.write(171, mleader.lineColor, subclass);
    this._writer.writeHandle(343, mleader.textStyle);
    this._writer.write(173, mleader.textLeftAttachment, subclass);
    this._writer.write(95, mleader.textRightAttachment, subclass);

    if (mleader.contextData) {
      this._writer.write(300, "CONTEXT_DATA{");
      this._writeAnnotContext(mleader.contextData, map);
      this._writer.write(301, "}");
    }

    this._writer.write(44, mleader.scaleFactor, subclass);
    this._writer.write(294, mleader.textDirectionNegative, subclass);
    this._writer.write(274, mleader.textAligninIPE, subclass);
    this._writer.write(178, mleader.textAttachmentDirection, subclass);
    this._writer.write(175, mleader.textAttachmentDirection, subclass);
    this._writer.write(176, mleader.textAttachmentDirection, subclass);
  }

  private _writeAnnotContext(contextData: MultiLeaderObjectContextData, map: DxfMap): void {
    const ctxMap = DxfClassMap.create(MultiLeaderObjectContextData);
    this._writer.writeVector(10, contextData.contentBasePoint, ctxMap);
    this._writer.write(41, contextData.textHeight, ctxMap);
    this._writer.write(140, contextData.arrowheadSize, ctxMap);
    this._writer.write(145, contextData.landingGap, ctxMap);
    this._writer.write(174, contextData.textLeftAttachment, ctxMap);
    this._writer.write(175, contextData.textRightAttachment, ctxMap);
    this._writer.write(176, contextData.textAlignment, ctxMap);
    this._writer.write(177, contextData.blockContentConnection, ctxMap);
    this._writer.write(290, contextData.hasTextContents, ctxMap);

    this._writer.writeVector(110, contextData.contentBasePoint, ctxMap);
    this._writer.writeVector(111, contextData.baseDirection, ctxMap);
    this._writer.writeVector(112, contextData.baseVertical, ctxMap);
    this._writer.write(297, contextData.normalReversed, ctxMap);

    this._writer.writeVector(12, contextData.textLocation, ctxMap);
    this._writer.writeVector(13, contextData.direction, ctxMap);

    for (const root of contextData.leaderRoots) {
      this._writer.write(302, "LEADER{");
      this._writeLeaderRoot(root);
      this._writer.write(303, "}");
    }

    this._writer.writeHandle(340, contextData.textStyle);
  }

  private _writeLeaderRoot(root: LeaderRoot): void {
  const rootMap = DxfClassMap.create(root.constructor, 'LeaderRoot');
    this._writer.write(290, root.contentValid, rootMap);
    this._writer.writeVector(10, root.connectionPoint, rootMap);
    this._writer.writeVector(11, root.direction, rootMap);

    for (const line of root.lines) {
      this._writer.write(304, "LEADER_LINE{");
      this._writeLeaderLine(line);
      this._writer.write(305, "}");
    }

    this._writer.write(271, root.textAttachmentDirection, rootMap);
  }

  private _writeLeaderLine(line: LeaderLine): void {
    for (const pt of line.points) {
      this._writer.writeVector(10, pt);
    }
    this._writer.write(91, line.breakInfoCount);
  }

  private _writeOle2Frame(ole: Ole2Frame, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.ole2Frame)!;
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.ole2Frame);
    this._writer.write(70, ole.oleObjectType, subclass);
    this._writer.write(3, ole.sourceApplication, subclass);
    this._writer.writeVector(10, ole.upperLeftCorner, subclass);
    this._writer.writeVector(11, ole.lowerRightCorner, subclass);
  }

  private _writePdfUnderlay(underlay: PdfUnderlay, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.underlay)!;
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.underlay);
    this._writer.writeHandle(340, underlay.definition, subclass);
    this._writer.writeVector(10, underlay.insertPoint, subclass);
    this._writer.write(41, underlay.xScale, subclass);
    this._writer.write(42, underlay.yScale, subclass);
    this._writer.write(43, underlay.zScale, subclass);
    this._writer.write(50, underlay.rotation, subclass);
    this._writer.write(280, underlay.flags, subclass);
    this._writer.write(281, underlay.contrast, subclass);
    this._writer.write(282, underlay.fade, subclass);
  }

  private _writePoint(point: Point, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.point)!;
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.point);
    this._writer.writeVector(10, point.location, subclass);
    this._writer.write(39, point.thickness, subclass);
    this._writer.writeVector(210, point.normal, subclass);
    this._writer.write(50, point.rotation, subclass);
  }

  private _writePolyline(polyline: Polyline2D | Polyline3D | PolyfaceMesh | PolygonMesh, map: DxfMap): void {
    this._writer.write(DxfCode.Subclass, polyline.subclassMarker);
    this._writer.write(66, 1);
    this._writer.write(70, polyline.flags);
    this._writer.writeVector(210, polyline.normal);

    for (const vertex of polyline.vertices) {
      if (vertex instanceof Vertex) {
        this._writeVertex(vertex, map);
      }
    }

    this._writeSeqend(polyline.vertices.seqend, map);
  }

  private _writeVertex(vertex: Vertex, map: DxfMap): void {
    this._writer.write(DxfCode.Start, vertex.objectName);
    this.writeCommonObjectData(vertex);
    this.writeCommonEntityData(vertex);

    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.vertex);
    this._writer.write(DxfCode.Subclass, vertex.subclassMarker);
    this._writer.writeVector(10, vertex.location);
    this._writer.write(70, vertex.flags);

    if (vertex instanceof Vertex2D) {
      this._writer.write(40, vertex.startWidth);
      this._writer.write(41, vertex.endWidth);
      this._writer.write(42, vertex.bulge);
      this._writer.write(50, vertex.curveTangent);
    } else if (vertex instanceof VertexFaceRecord) {
      this._writer.write(71, vertex.index1);
      this._writer.write(72, vertex.index2);
      this._writer.write(73, vertex.index3);
      this._writer.write(74, vertex.index4);
    }
  }

  private _writeRay(ray: Ray, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.ray)!;
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.ray);
    this._writer.writeVector(10, ray.startPoint, subclass);
    this._writer.writeVector(11, ray.direction, subclass);
  }

  private _writeShape(shape: Shape, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.shape)!;
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.shape);
    this._writer.writeVector(10, shape.insertionPoint, subclass);
    this._writer.write(40, shape.size, subclass);
    this._writer.write(2, shape.shapeIndex, subclass);
    this._writer.write(50, shape.rotation, subclass);
    this._writer.write(41, shape.relativeXScale, subclass);
    this._writer.write(51, shape.obliqueAngle, subclass);
    this._writer.write(39, shape.thickness, subclass);
    this._writer.writeVector(210, shape.normal, subclass);
  }

  private _writeSolid(solid: Solid, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.solid)!;
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.solid);
    this._writer.writeVector(10, solid.firstCorner, subclass);
    this._writer.writeVector(11, solid.secondCorner, subclass);
    this._writer.writeVector(12, solid.thirdCorner, subclass);
    this._writer.writeVector(13, solid.fourthCorner, subclass);
    this._writer.write(39, solid.thickness, subclass);
    this._writer.writeVector(210, solid.normal, subclass);
  }

  private _writeSpline(spline: Spline, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.spline)!;
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.spline);
    this._writer.writeVector(210, spline.normal, subclass);
    this._writer.write(70, spline.flags, subclass);
    this._writer.write(71, spline.degree, subclass);
    this._writer.write(72, spline.knots.length);
    this._writer.write(73, spline.controlPoints.length);
    this._writer.write(74, spline.fitPoints.length);
    this._writer.write(42, spline.knotTolerance, subclass);
    this._writer.write(43, spline.controlPointTolerance, subclass);
    this._writer.write(44, spline.fitTolerance, subclass);

    if (spline.startTangent) {
      this._writer.writeVector(12, spline.startTangent);
    }
    if (spline.endTangent) {
      this._writer.writeVector(13, spline.endTangent);
    }

    for (const k of spline.knots) {
      this._writer.write(40, k);
    }
    for (let i = 0; i < spline.controlPoints.length; i++) {
      this._writer.writeVector(10, spline.controlPoints[i]);
      if (i < spline.weights.length) {
        this._writer.write(41, spline.weights[i]);
      }
    }
    for (const fp of spline.fitPoints) {
      this._writer.writeVector(11, fp);
    }
  }

  private _writeTextEntity(text: TextEntity, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.text)!;
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.text);

    this._writer.write(39, text.thickness, subclass);
    this._writer.writeVector(10, text.insertPoint, subclass);
    this._writer.write(40, text.height, subclass);
    this._writer.write(1, text.value ?? '', subclass);
    this._writer.write(50, text.rotation, subclass);
    this._writer.write(41, text.widthFactor, subclass);
    this._writer.write(51, text.obliqueAngle, subclass);
    this._writer.write(7, text.style?.name ?? '', subclass);
    this._writer.write(71, text.mirror, subclass);
    this._writer.write(72, text.horizontalAlignment, subclass);
    this._writer.writeVector(11, text.alignmentPoint, subclass);
    this._writer.writeVector(210, text.normal, subclass);

    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.text);
    this._writer.write(73, text.verticalAlignment, subclass);
  }

  private _writeTolerance(tolerance: Tolerance, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.tolerance)!;
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.tolerance);
    this._writer.write(3, tolerance.style?.name ?? '', subclass);
    this._writer.writeVector(10, tolerance.insertionPoint, subclass);
    this._writer.write(1, tolerance.text ?? '', subclass);
    this._writer.writeVector(11, tolerance.direction, subclass);
    this._writer.writeVector(210, tolerance.normal, subclass);
  }

  private _writeViewport(viewport: Viewport, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.viewport)!;
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.viewport);
    this._writer.writeVector(10, viewport.center, subclass);
    this._writer.write(40, viewport.width, subclass);
    this._writer.write(41, viewport.height, subclass);
    this._writer.write(68, viewport.id, subclass);
    this._writer.writeVector(12, viewport.viewCenter, subclass);
    this._writer.writeVector(13, viewport.snapBase, subclass);
    this._writer.writeVector(14, viewport.snapSpacing, subclass);
    this._writer.writeVector(15, viewport.gridSpacing, subclass);
    this._writer.writeVector(16, viewport.viewDirection, subclass);
    this._writer.writeVector(17, viewport.viewTarget, subclass);
    this._writer.write(42, viewport.lensLength, subclass);
    this._writer.write(43, viewport.frontClipPlane, subclass);
    this._writer.write(44, viewport.backClipPlane, subclass);
    this._writer.write(45, viewport.viewHeight, subclass);
    this._writer.write(50, viewport.twistAngle, subclass);
    this._writer.write(51, viewport.circleZoomPercent, subclass);
    this._writer.write(72, viewport.displayUcsIcon, subclass);
    this._writer.write(90, viewport.status, subclass);
    this._writer.write(110, viewport.ucsOrigin, subclass);
    this._writer.write(111, viewport.ucsXAxis, subclass);
    this._writer.write(112, viewport.ucsYAxis, subclass);
    this._writer.write(281, viewport.renderMode, subclass);

    for (const layer of viewport.frozenLayers) {
      this._writer.writeHandle(331, layer);
    }
  }

  private _writeXLine(xline: XLine, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.xLine)!;
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.xLine);
    this._writer.writeVector(10, xline.firstPoint, subclass);
    this._writer.writeVector(11, xline.direction, subclass);
  }

  private _writeCadImage(image: CadImage, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.rasterImage)!;
    this._writer.write(DxfCode.Subclass, DxfSubclassMarker.rasterImage);
    this._writer.write(90, image.classVersion, subclass);
    this._writer.writeVector(10, image.insertPoint, subclass);
    this._writer.writeVector(11, image.uVector, subclass);
    this._writer.writeVector(12, image.vVector, subclass);
    this._writer.writeVector(13, image.size, subclass);
    this._writer.writeHandle(340, image.definition, subclass);
    this._writer.write(70, image.flags, subclass);
    this._writer.write(280, image.clippingState, subclass);
    this._writer.write(281, image.brightness, subclass);
    this._writer.write(282, image.contrast, subclass);
    this._writer.write(283, image.fade, subclass);
    this._writer.writeHandle(360, image.definitionReactor, subclass);
    this._writer.write(71, image.clipType, subclass);
    this._writer.write(91, image.clipBoundaryVertices.length);
    for (const v of image.clipBoundaryVertices) {
      this._writer.write(14, v.x);
      this._writer.write(24, v.y);
    }
  }

  private _writeSeqend(seqend: Seqend, map: DxfMap): void {
    if (!seqend) return;
    this._writer.write(DxfCode.Start, seqend.objectName);
    this.writeCommonObjectData(seqend);
    this.writeCommonEntityData(seqend);
  }

  private _writeAttributeBase(att: AttributeBase, map: DxfMap): void {
    this._writer.write(DxfCode.Subclass, att.subclassMarker);
    this._writer.write(2, att.tag);
    this._writer.write(70, att.flags);
    this._writer.writeVector(10, att.insertPoint);
    this._writer.write(40, att.height);
    this._writer.write(1, att.value ?? '');
    this._writer.write(7, att.style?.name ?? '');
    this._writer.write(41, att.widthFactor);
    this._writer.write(50, att.rotation);
    this._writer.write(51, att.obliqueAngle);
    this._writer.writeVector(11, att.alignmentPoint);
    this._writer.write(71, att.mirror);
    this._writer.write(72, att.horizontalAlignment);
    this._writer.write(73, att.verticalAlignment);
    this._writer.writeVector(210, att.normal);
  }
}
