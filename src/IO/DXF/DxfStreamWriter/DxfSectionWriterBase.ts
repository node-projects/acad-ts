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
  public OnNotification: NotificationEventHandler | null = null;

  public abstract get SectionName(): string;

  public get Version(): ACadVersion {
    return this._document.header.Version;
  }

  public Holder: CadObjectHolder;

  public Configuration: DxfWriterConfiguration;

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
    this.Holder = holder;
    this.Configuration = configuration;
  }

  public Write(): void {
    this._writer.Write(DxfCode.Start, DxfFileToken.BeginSection);
    this._writer.Write(DxfCode.SymbolTableName, this.SectionName);

    this.writeSection();

    this._writer.Write(DxfCode.Start, DxfFileToken.EndSection);
  }

  protected writeCadValue(value: CadValue): void {
    this._writer.Write(93, value.flags);
    this._writer.Write(90, value.valueType as number);

    switch (value.valueType) {
      case CadValueType.Unknown:
        this._writer.Write(91, 0);
        break;
      case CadValueType.Double:
        this._writer.Write(140, Number(value.value));
        break;
      case CadValueType.Date:
        this._writer.Write(91, 0);
        break;
      case CadValueType.General:
      case CadValueType.String:
        this.writeLongTextValue(1, 2, value.value as string);
        break;
      case CadValueType.Point2D:
      case CadValueType.Point3D:
        this._writer.WriteVector(11, value.value as IVector);
        break;
      case CadValueType.Long:
        this._writer.Write(91, Number(value.value));
        break;
      case CadValueType.Handle: {
        const handleObj = value.value as IHandledCadObject;
        if (handleObj) {
          this._writer.WriteHandle(330, handleObj);
        }
        break;
      }
      case CadValueType.Buffer:
      case CadValueType.ResultBuffer:
        this._writer.Write(91, 0);
        break;
    }
  }

  protected writeCommonObjectData(cadObject: CadObject): void {
    if (cadObject instanceof DimensionStyle) {
      this._writer.Write(DxfCode.DimVarHandle, cadObject.handle);
    } else {
      this._writer.Write(DxfCode.Handle, cadObject.handle);
    }

    if (cadObject.xDictionary !== null) {
      this._writer.Write(DxfCode.ControlString, DxfFileToken.DictionaryToken);
      this._writer.Write(DxfCode.HardOwnershipId, cadObject.xDictionary.handle);
      this._writer.Write(DxfCode.ControlString, "}");
      this.Holder.Objects.push(cadObject.xDictionary);
    }

    cadObject.cleanReactors();
    if (cadObject.reactors.length > 0) {
      this._writer.Write(DxfCode.ControlString, DxfFileToken.ReactorsToken);
      for (const reactor of cadObject.reactors) {
        this._writer.Write(DxfCode.SoftPointerId, reactor.handle);
      }
      this._writer.Write(DxfCode.ControlString, "}");
    }

    this._writer.Write(DxfCode.SoftPointerId, cadObject.owner!.handle);
  }

  protected writeExtendedData(xdata: ExtendedDataDictionary | null): void {
    if (xdata === null || !this.Configuration.WriteXData) {
      return;
    }

    for (const [appId, edataCollection] of xdata) {
      this._writer.Write(DxfCode.ExtendedDataRegAppName, appId.name);

      for (const record of edataCollection.records) {
        if (record instanceof ExtendedDataBinaryChunk) {
          this._writer.Write(record.code, record.value);
        } else if (record instanceof ExtendedDataControlString) {
          this._writer.Write(record.code, record.value);
        } else if (record instanceof ExtendedDataInteger16) {
          this._writer.Write(record.code, record.value);
        } else if (record instanceof ExtendedDataInteger32) {
          this._writer.Write(record.code, record.value);
        } else if (record instanceof ExtendedDataReal) {
          this._writer.Write(record.code, record.value);
        } else if (record instanceof ExtendedDataScale) {
          this._writer.Write(record.code, record.value);
        } else if (record instanceof ExtendedDataDistance) {
          this._writer.Write(record.code, record.value);
        } else if (record instanceof ExtendedDataDisplacement) {
          this._writer.Write(record.code, record.value);
        } else if (record instanceof ExtendedDataDirection) {
          this._writer.WriteVector(record.code, record.value as IVector);
        } else if (record instanceof ExtendedDataCoordinate) {
          this._writer.WriteVector(record.code, record.value as IVector);
        } else if (record instanceof ExtendedDataWorldCoordinate) {
          this._writer.WriteVector(record.code, record.value as IVector);
        } else if ((record as any).ResolveReference) {
          const handle = record as unknown as IExtendedDataHandleReference;
          let h = handle.value;
          if (handle.resolveReference(this._document) === null) {
            h = 0;
          }
          this._writer.Write(DxfCode.ExtendedDataHandle, h);
        } else if (record instanceof ExtendedDataString) {
          this._writer.Write(record.code, record.value);
        } else {
          throw new Error(`ExtendedDataRecord of type ${record.constructor.name} not supported.`);
        }
      }
    }
  }

  protected writeCommonEntityData(entity: Entity): void {
    const map = DxfClassMap.Create(Entity);

    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.Entity);

    this._writer.Write(8, entity.layer?.name ?? '0');
    this._writer.Write(6, entity.lineType?.name ?? 'ByLayer');

    if (entity.bookColor !== null) {
      this._writer.Write(62, entity.bookColor.Color.GetApproxIndex());
      this._writer.WriteTrueColor(420, entity.bookColor.Color);
      this._writer.Write(430, entity.bookColor.Name);
    } else if (entity.color.isTrueColor) {
      this._writer.WriteTrueColor(420, entity.color);
    } else {
      this._writer.Write(62, entity.color.index);
    }

    if (entity.transparency.value >= 0) {
      this._writer.Write(440, Transparency.toAlphaValue(entity.transparency));
    }

    this._writer.Write(48, entity.lineTypeScale, map);
    this._writer.Write(60, entity.isInvisible ? 1 : 0, map);

    if (entity.owner instanceof BlockRecord) {
      const record = entity.owner as BlockRecord;
      if (record.layout !== null) {
        this._writer.Write(67, record.layout.IsPaperSpace ? 1 : 0);
      }
    }

    this._writer.Write(370, entity.lineWeight);
  }

  protected abstract writeSection(): void;

  protected writeLongTextValue(code: number, subcode: number, text: string): void {
    while (text.length > 250) {
      this._writer.Write(subcode, text.substring(0, 250));
      text = text.substring(250);
    }
    this._writer.Write(code, text);
  }

  protected notify(message: string, notificationType: NotificationType = NotificationType.None, ex?: Error): void {
    if (this.OnNotification) {
      this.OnNotification(this, new NotificationEventArgs(message, notificationType, ex));
    }
  }

  // =====================================================
  // Entity writing methods (from DxfSectionWriterBase.Entities.cs)
  // =====================================================

  protected writeEntity(entity: Entity): void {
    if (!this.isEntitySupported(entity)) {
      return;
    }

    this._writer.Write(DxfCode.Start, entity.objectName);

    this.writeCommonObjectData(entity);
    this.writeCommonEntityData(entity);

    const map = DxfMap.create(entity.constructor.name);

    if (entity instanceof Arc) {
      this.writeArc(entity, map);
    } else if (entity instanceof Circle) {
      this.writeCircle(entity, map);
    } else if (entity instanceof DimensionLinear) {
      this.writeDimension(entity, map);
    } else if (entity instanceof DimensionAligned) {
      this.writeDimension(entity, map);
    } else if (entity instanceof DimensionRadius) {
      this.writeDimension(entity, map);
    } else if (entity instanceof DimensionDiameter) {
      this.writeDimension(entity, map);
    } else if (entity instanceof DimensionAngular2Line) {
      this.writeDimension(entity, map);
    } else if (entity instanceof DimensionAngular3Pt) {
      this.writeDimension(entity, map);
    } else if (entity instanceof DimensionOrdinate) {
      this.writeDimension(entity, map);
    } else if (entity instanceof Ellipse) {
      this.writeEllipse(entity, map);
    } else if (entity instanceof Face3D) {
      this.writeFace3D(entity, map);
    } else if (entity instanceof Hatch) {
      this.writeHatch(entity, map);
    } else if (entity instanceof Insert) {
      this.writeInsert(entity, map);
    } else if (entity instanceof Leader) {
      this.writeLeader(entity, map);
    } else if (entity instanceof Line) {
      this.writeLine(entity, map);
    } else if (entity instanceof LwPolyline) {
      this.writeLwPolyline(entity, map);
    } else if (entity instanceof Mesh) {
      this.writeMesh(entity, map);
    } else if (entity instanceof MLine) {
      this.writeMLine(entity, map);
    } else if (entity instanceof MText) {
      this.writeMText(entity, map);
    } else if (entity instanceof MultiLeader) {
      this.writeMultiLeader(entity, map);
    } else if (entity instanceof Ole2Frame) {
      this.writeOle2Frame(entity, map);
    } else if (entity instanceof PdfUnderlay) {
      this.writePdfUnderlay(entity, map);
    } else if (entity instanceof Point) {
      this.writePoint(entity, map);
    } else if (entity instanceof Polyline2D) {
      this.writePolyline(entity, map);
    } else if (entity instanceof Polyline3D) {
      this.writePolyline(entity, map);
    } else if (entity instanceof PolyfaceMesh) {
      this.writePolyline(entity, map);
    } else if (entity instanceof PolygonMesh) {
      this.writePolyline(entity, map);
    } else if (entity instanceof Ray) {
      this.writeRay(entity, map);
    } else if (entity instanceof Shape) {
      this.writeShape(entity, map);
    } else if (entity instanceof Solid) {
      this.writeSolid(entity, map);
    } else if (entity instanceof Spline) {
      this.writeSpline(entity, map);
    } else if (entity instanceof TextEntity) {
      this.writeTextEntity(entity, map);
    } else if (entity instanceof Tolerance) {
      this.writeTolerance(entity, map);
    } else if (entity instanceof Viewport) {
      this.writeViewport(entity, map);
    } else if (entity instanceof XLine) {
      this.writeXLine(entity, map);
    } else if (entity instanceof RasterImage || entity instanceof Wipeout) {
      this.writeCadImage(entity as CadImage, map);
    } else if (entity instanceof Seqend) {
      this.writeSeqend(entity, map);
    } else {
      this.notify(`Entity not implemented: ${entity.constructor.name}`, NotificationType.NotImplemented);
    }

    this.writeExtendedData(entity.extendedData);
  }

  private isEntitySupported(entity: Entity): boolean {
    if (entity instanceof UnknownEntity) {
      return false;
    }
    return true;
  }

  private writeArc(arc: Arc, map: DxfMap): void {
    this.writeCircle(arc, map);
    const subclass = map.subClasses.get(DxfSubclassMarker.Arc)!;
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.Arc);
    this._writer.Write(50, arc.startAngle, subclass);
    this._writer.Write(51, arc.endAngle, subclass);
  }

  private writeCircle(circle: Circle, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.Circle)!;
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.Circle);
    this._writer.WriteVector(10, circle.center, subclass);
    this._writer.Write(40, circle.radius, subclass);
    this._writer.Write(39, circle.thickness, subclass);
    this._writer.WriteVector(210, circle.normal, subclass);
  }

  private writeDimension(dim: Dimension, map: DxfMap): void {
    const dimMap = map.subClasses.get(DxfSubclassMarker.Dimension)!;
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.Dimension);

    this._writer.Write(2, dim.block?.name ?? '', dimMap);
    this._writer.WriteVector(10, dim.definitionPoint, dimMap);
    this._writer.WriteVector(11, dim.textMiddlePoint, dimMap);
    this._writer.Write(70, dim.flags, dimMap);
    this._writer.Write(71, dim.attachmentPoint, dimMap);
    this._writer.Write(72, dim.lineSpacingStyle, dimMap);
    this._writer.Write(41, dim.lineSpacingFactor, dimMap);
    this._writer.Write(42, dim.measurement, dimMap);
    this._writer.Write(1, dim.text, dimMap);
    this._writer.Write(53, dim.textRotation, dimMap);
    this._writer.Write(51, dim.horizontalDirection, dimMap);
    this._writer.WriteVector(210, dim.normal, dimMap);
    this._writer.Write(3, dim.style?.name ?? '', dimMap);

    if (dim instanceof DimensionAligned) {
      this.writeDimensionAligned(dim, map);
    }
    if (dim instanceof DimensionLinear) {
      this.writeDimensionLinear(dim, map);
    }
    if (dim instanceof DimensionRadius) {
      this.writeDimensionRadius(dim, map);
    }
    if (dim instanceof DimensionDiameter) {
      this.writeDimensionDiameter(dim, map);
    }
    if (dim instanceof DimensionAngular2Line) {
      this.writeDimensionAngular2Line(dim, map);
    }
    if (dim instanceof DimensionAngular3Pt) {
      this.writeDimensionAngular3Pt(dim, map);
    }
    if (dim instanceof DimensionOrdinate) {
      this.writeDimensionOrdinate(dim, map);
    }
  }

  private writeDimensionAligned(dim: DimensionAligned, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.AlignedDimension)!;
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.AlignedDimension);
    this._writer.WriteVector(13, dim.firstPoint, subclass);
    this._writer.WriteVector(14, dim.secondPoint, subclass);
  }

  private writeDimensionLinear(dim: DimensionLinear, map: DxfMap): void {
    this.writeDimensionAligned(dim, map);
    const subclass = map.subClasses.get(DxfSubclassMarker.LinearDimension);
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.LinearDimension);
    this._writer.Write(50, dim.rotation, subclass);
  }

  private writeDimensionRadius(dim: DimensionRadius, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.RadialDimension)!;
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.RadialDimension);
    this._writer.WriteVector(15, dim.angleVertex, subclass);
    this._writer.Write(40, dim.leaderLength, subclass);
  }

  private writeDimensionDiameter(dim: DimensionDiameter, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.DiametricDimension)!;
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.DiametricDimension);
    this._writer.WriteVector(15, dim.angleVertex, subclass);
    this._writer.Write(40, dim.leaderLength, subclass);
  }

  private writeDimensionAngular2Line(dim: DimensionAngular2Line, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.Angular2LineDimension)!;
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.Angular2LineDimension);
    this._writer.WriteVector(13, dim.firstPoint, subclass);
    this._writer.WriteVector(14, dim.secondPoint, subclass);
    this._writer.WriteVector(15, dim.angleVertex, subclass);
    this._writer.WriteVector(16, dim.dimensionArc, subclass);
  }

  private writeDimensionAngular3Pt(dim: DimensionAngular3Pt, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.Angular3PointDimension)!;
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.Angular3PointDimension);
    this._writer.WriteVector(13, dim.firstPoint, subclass);
    this._writer.WriteVector(14, dim.secondPoint, subclass);
    this._writer.WriteVector(15, dim.angleVertex, subclass);
  }

  private writeDimensionOrdinate(dim: DimensionOrdinate, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.OrdinateDimension)!;
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.OrdinateDimension);
    this._writer.WriteVector(13, dim.featureLocation, subclass);
    this._writer.WriteVector(14, dim.leaderEndpoint, subclass);
  }

  private writeEllipse(ellipse: Ellipse, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.Ellipse)!;
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.Ellipse);
    this._writer.WriteVector(10, ellipse.center, subclass);
    this._writer.WriteVector(11, ellipse.majorAxisEndPoint, subclass);
    this._writer.WriteVector(210, ellipse.normal, subclass);
    this._writer.Write(40, ellipse.radiusRatio, subclass);
    this._writer.Write(41, ellipse.startParameter, subclass);
    this._writer.Write(42, ellipse.endParameter, subclass);
  }

  private writeFace3D(face: Face3D, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.Face3d)!;
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.Face3d);
    this._writer.WriteVector(10, face.firstCorner, subclass);
    this._writer.WriteVector(11, face.secondCorner, subclass);
    this._writer.WriteVector(12, face.thirdCorner, subclass);
    this._writer.WriteVector(13, face.fourthCorner, subclass);
    this._writer.Write(70, face.flags, subclass);
  }

  private writeHatch(hatch: Hatch, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.Hatch)!;
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.Hatch);

    this._writer.Write(30, hatch.elevation, subclass);
    this._writer.WriteVector(210, hatch.normal, subclass);

    this._writer.Write(2, hatch.pattern.name, subclass);
    this._writer.Write(70, hatch.isSolid ? 1 : 0, subclass);
    this._writer.Write(71, hatch.isAssociative ? 1 : 0, subclass);

    this._writer.Write(91, hatch.paths.length);

    for (const path of hatch.paths) {
      this.writeBoundaryPath(path);
    }

    this._writer.Write(75, hatch.style, subclass);
    this._writer.Write(76, hatch.patternType, subclass);

    if (!hatch.isSolid) {
      this._writer.Write(52, hatch.patternAngle, subclass);
      this._writer.Write(41, hatch.patternScale, subclass);
      this._writer.Write(77, hatch.isDouble ? 1 : 0, subclass);

      this._writer.Write(78, hatch.pattern.lines.length);
      for (const line of hatch.pattern.lines) {
        this._writer.Write(53, line.angle);
        this._writer.Write(43, line.basePoint.x);
        this._writer.Write(44, line.basePoint.y);
        this._writer.Write(45, line.offset.x);
        this._writer.Write(46, line.offset.y);
        this._writer.Write(79, line.dashLengths.length);
        for (const dash of line.dashLengths) {
          this._writer.Write(49, dash);
        }
      }
    }

    this._writer.Write(47, hatch.pixelSize, subclass);

    this._writer.Write(98, hatch.seedPoints.length);
    for (const pt of hatch.seedPoints) {
      this._writer.Write(10, pt.x);
      this._writer.Write(20, pt.y);
    }

    if (hatch.gradientColor.enabled) {
      this._writer.Write(450, hatch.gradientColor.enabled ? 1 : 0);
      this._writer.Write(451, hatch.gradientColor.reserved);
      this._writer.Write(452, hatch.gradientColor.isSingleColorGradient ? 1 : 0);
      this._writer.Write(453, hatch.gradientColor.colors.length);
      for (const gc of hatch.gradientColor.colors) {
        this._writer.Write(463, gc.value);
        this._writer.Write(63, gc.color.index);
        this._writer.Write(421, gc.color.trueColor);
      }
      this._writer.Write(460, hatch.gradientColor.angle);
      this._writer.Write(461, hatch.gradientColor.shift);
      this._writer.Write(462, hatch.gradientColor.colorTint);
      this._writer.Write(470, hatch.gradientColor.name);
    }
  }

  private writeBoundaryPath(path: HatchBoundaryPath): void {
    this._writer.Write(92, path.flags as number);

    if ((path.flags & BoundaryPathFlags.Polyline) !== 0) {
      for (const edge of path.edges) {
        if (edge instanceof HatchBoundaryPathPolyline) {
          this.writePolylineBoundary(edge);
        }
      }
    } else {
      this._writer.Write(93, path.edges.length);
      for (const edge of path.edges) {
        this.writeBoundaryEdge(edge);
      }
    }

    this._writer.Write(97, path.entities.length);
    for (const entity of path.entities) {
      this._writer.Write(330, entity.handle);
    }
  }

  private writePolylineBoundary(polyline: HatchBoundaryPathPolyline): void {
    const hasBulge = polyline.vertices.some(v => v.Z !== 0);
    this._writer.Write(72, hasBulge ? 1 : 0);
    this._writer.Write(73, polyline.isClosed ? 1 : 0);
    this._writer.Write(93, polyline.vertices.length);
    for (const v of polyline.vertices) {
      this._writer.Write(10, v.X);
      this._writer.Write(20, v.Y);
      if (hasBulge) {
        this._writer.Write(42, v.Z);
      }
    }
  }

  private writeBoundaryEdge(edge: HatchBoundaryPathEdge): void {
    if (edge instanceof HatchBoundaryPathLine) {
      this._writer.Write(72, 1);
      this._writer.Write(10, edge.start.X);
      this._writer.Write(20, edge.start.Y);
      this._writer.Write(11, edge.end.X);
      this._writer.Write(21, edge.end.Y);
    } else if (edge instanceof HatchBoundaryPathArc) {
      this._writer.Write(72, 2);
      this._writer.Write(10, edge.center.X);
      this._writer.Write(20, edge.center.Y);
      this._writer.Write(40, edge.radius);
      this._writer.Write(50, MathHelper.RadToDeg(edge.startAngle));
      this._writer.Write(51, MathHelper.RadToDeg(edge.endAngle));
      this._writer.Write(73, edge.counterClockWise ? 1 : 0);
    } else if (edge instanceof HatchBoundaryPathEllipse) {
      this._writer.Write(72, 3);
      this._writer.Write(10, edge.center.X);
      this._writer.Write(20, edge.center.Y);
      this._writer.Write(11, edge.majorAxisEndPoint.X);
      this._writer.Write(21, edge.majorAxisEndPoint.Y);
      this._writer.Write(40, edge.minorToMajorRatio);
      this._writer.Write(50, MathHelper.RadToDeg(edge.startAngle));
      this._writer.Write(51, MathHelper.RadToDeg(edge.endAngle));
      this._writer.Write(73, edge.counterClockWise ? 1 : 0);
    } else if (edge instanceof HatchBoundaryPathSpline) {
      this._writer.Write(72, 4);
      this._writer.Write(94, edge.degree);
      this._writer.Write(73, edge.isRational ? 1 : 0);
      this._writer.Write(74, edge.isPeriodic ? 1 : 0);
      this._writer.Write(95, edge.knots.length);
      this._writer.Write(96, edge.controlPoints.length);
      for (const k of edge.knots) {
        this._writer.Write(40, k);
      }
      for (const cp of edge.controlPoints) {
        this._writer.Write(10, cp.X);
        this._writer.Write(20, cp.Y);
        if (edge.isRational) {
          this._writer.Write(42, cp.Z);
        }
      }
      if (edge.fitPoints.length > 0) {
        this._writer.Write(97, edge.fitPoints.length);
        for (const fp of edge.fitPoints) {
          this._writer.Write(11, fp.X);
          this._writer.Write(21, fp.Y);
        }
      }
      this._writer.Write(12, edge.startTangent.X);
      this._writer.Write(22, edge.startTangent.Y);
      this._writer.Write(13, edge.endTangent.X);
      this._writer.Write(23, edge.endTangent.Y);
    }
  }

  private writeInsert(insert: Insert, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.Insert)!;
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.Insert);

    this._writer.Write(66, insert.hasAttributes ? 1 : 0);
    this._writer.Write(2, insert.block?.name ?? '', subclass);
    this._writer.WriteVector(10, insert.insertPoint, subclass);
    this._writer.Write(41, insert.xScale, subclass);
    this._writer.Write(42, insert.yScale, subclass);
    this._writer.Write(43, insert.zScale, subclass);
    this._writer.Write(50, insert.rotation, subclass);
    this._writer.Write(70, insert.columnCount, subclass);
    this._writer.Write(71, insert.rowCount, subclass);
    this._writer.Write(44, insert.columnSpacing, subclass);
    this._writer.Write(45, insert.rowSpacing, subclass);
    this._writer.WriteVector(210, insert.normal, subclass);

    for (const att of insert.attributes) {
      this.writeEntity(att);
    }

    if (insert.hasAttributes && insert.attributes.Seqend) {
      this.writeEntity(insert.attributes.Seqend);
    }
  }

  private writeLeader(leader: Leader, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.Leader)!;
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.Leader);

    this._writer.Write(3, leader.style?.name ?? '', subclass);
    this._writer.Write(71, leader.arrowHeadEnabled ? 1 : 0, subclass);
    this._writer.Write(72, leader.pathType, subclass);
    this._writer.Write(73, leader.creationType, subclass);
    this._writer.Write(74, leader.hookLineDirection ? 1 : 0, subclass);
    this._writer.Write(75, leader.hasHookline ? 1 : 0, subclass);
    this._writer.Write(40, leader.textHeight, subclass);
    this._writer.Write(41, leader.textWidth, subclass);
    this._writer.Write(76, leader.vertices.length);

    for (const v of leader.vertices) {
      this._writer.WriteVector(10, v);
    }

    this._writer.Write(77, leader.color ? 1 : 0, subclass);
    this._writer.WriteHandle(340, leader.associatedAnnotation);
    this._writer.WriteVector(210, leader.normal, subclass);
    this._writer.WriteVector(211, leader.horizontalDirection, subclass);
    this._writer.WriteVector(212, leader.blockOffset, subclass);
    this._writer.WriteVector(213, leader.annotationOffset, subclass);
  }

  private writeLine(line: Line, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.Line)!;
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.Line);
    this._writer.Write(39, line.thickness, subclass);
    this._writer.WriteVector(10, line.startPoint, subclass);
    this._writer.WriteVector(11, line.endPoint, subclass);
    this._writer.WriteVector(210, line.normal, subclass);
  }

  private writeLwPolyline(polyline: LwPolyline, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.LwPolyline)!;
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.LwPolyline);

    this._writer.Write(90, polyline.vertices.length);
    this._writer.Write(70, polyline.flags, subclass);
    this._writer.Write(43, polyline.constantWidth, subclass);
    this._writer.Write(38, polyline.elevation, subclass);
    this._writer.Write(39, polyline.thickness, subclass);
    this._writer.WriteVector(210, polyline.normal, subclass);

    for (const v of polyline.vertices) {
      this._writer.Write(10, v.location.x);
      this._writer.Write(20, v.location.y);
      this._writer.Write(40, v.startWidth);
      this._writer.Write(41, v.endWidth);
      this._writer.Write(42, v.bulge);
      if (v.id !== 0) {
        this._writer.Write(91, v.id);
      }
    }
  }

  private writeMesh(mesh: Mesh, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.Mesh)!;
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.Mesh);

    this._writer.Write(71, mesh.subdivisionLevel, subclass);

    this._writer.Write(72, 0); // override count
    this._writer.Write(91, 0); // sub entity count

    this._writer.Write(92, mesh.vertices.length);
    for (const v of mesh.vertices) {
      this._writer.WriteVector(10, v);
    }

    let faceListSize = 0;
    for (const face of mesh.faces) {
      faceListSize += 1 + face.length;
    }
    this._writer.Write(93, faceListSize);
    for (const face of mesh.faces) {
      this._writer.Write(90, face.length);
      for (const idx of face) {
        this._writer.Write(90, idx);
      }
    }

    this._writer.Write(94, mesh.edges.length);
    for (const edge of mesh.edges) {
      this._writer.Write(90, edge.start);
      this._writer.Write(90, edge.end);
    }

    this._writer.Write(95, mesh.edges.length);
    for (const edge of mesh.edges) {
      this._writer.Write(140, edge.crease);
    }
  }

  private writeMLine(mline: MLine, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.MLine)!;
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.MLine);

    this._writer.WriteHandle(340, mline.style, subclass);
    this._writer.Write(40, mline.scaleFactor, subclass);
    this._writer.Write(70, mline.justification, subclass);
    this._writer.Write(71, mline.flags, subclass);
    this._writer.Write(72, mline.vertices.length);
    this._writer.Write(73, mline.style?.Elements?.length ?? 0);

    this._writer.WriteVector(10, mline.startPoint, subclass);
    this._writer.WriteVector(210, mline.normal, subclass);

    for (const vertex of mline.vertices) {
      this._writer.WriteVector(11, vertex.position);
      this._writer.WriteVector(12, vertex.direction);
      this._writer.WriteVector(13, vertex.miter);

      for (const segment of vertex.segments) {
        this._writer.Write(74, segment.parameters.length);
        for (const p of segment.parameters) {
          this._writer.Write(41, p);
        }
        this._writer.Write(75, segment.areaFillParameters.length);
        for (const p of segment.areaFillParameters) {
          this._writer.Write(42, p);
        }
      }
    }
  }

  private writeMText(mtext: MText, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.MText)!;
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.MText);

    this._writer.WriteVector(10, mtext.insertPoint, subclass);
    this._writer.Write(40, mtext.height, subclass);
    this._writer.Write(41, mtext.rectangleWidth, subclass);
    this._writer.Write(46, mtext.rectangleHeight, subclass);
    this._writer.Write(71, mtext.attachmentPoint, subclass);
    this._writer.Write(72, mtext.drawingDirection, subclass);

    this.writeLongTextValue(1, 3, mtext.value ?? '');

    this._writer.Write(7, mtext.style?.name ?? '', subclass);
    this._writer.WriteVector(210, mtext.normal, subclass);
    this._writer.WriteVector(11, mtext.alignmentPoint, subclass);
    this._writer.Write(73, mtext.lineSpacingStyle, subclass);
    this._writer.Write(44, mtext.lineSpacing, subclass);
    this._writer.Write(90, mtext.backgroundFillFlags, subclass);

    if (mtext.backgroundFillFlags > 0) {
      this._writer.Write(63, mtext.backgroundColor.index);
      this._writer.Write(45, mtext.backgroundScale, subclass);
      this._writer.WriteTrueColor(420, mtext.backgroundColor);
      this._writer.Write(441, mtext.backgroundTransparency);
    }
  }

  private writeMultiLeader(mleader: MultiLeader, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.Leader)!;
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.Leader);

    this._writer.Write(270, mleader.contentType, subclass);
    this._writer.WriteHandle(340, mleader.style);
    this._writer.WriteHandle(341, mleader.leaderLineType);
    this._writer.WriteCmColor(91, mleader.lineColor, subclass);
    this._writer.Write(170, mleader.pathType, subclass);
    this._writer.Write(171, mleader.lineColor, subclass);
    this._writer.WriteHandle(343, mleader.textStyle);
    this._writer.Write(173, mleader.textLeftAttachment, subclass);
    this._writer.Write(95, mleader.textRightAttachment, subclass);

    if (mleader.contextData) {
      this._writer.Write(300, "CONTEXT_DATA{");
      this.writeAnnotContext(mleader.contextData, map);
      this._writer.Write(301, "}");
    }

    this._writer.Write(44, mleader.scaleFactor, subclass);
    this._writer.Write(294, mleader.textDirectionNegative, subclass);
    this._writer.Write(274, mleader.textAligninIPE, subclass);
    this._writer.Write(178, mleader.textAttachmentDirection, subclass);
    this._writer.Write(175, mleader.textAttachmentDirection, subclass);
    this._writer.Write(176, mleader.textAttachmentDirection, subclass);
  }

  private writeAnnotContext(contextData: MultiLeaderObjectContextData, map: DxfMap): void {
    const ctxMap = DxfClassMap.Create(MultiLeaderObjectContextData);
    this._writer.WriteVector(10, contextData.contentBasePoint, ctxMap);
    this._writer.Write(41, contextData.textHeight, ctxMap);
    this._writer.Write(140, contextData.arrowheadSize, ctxMap);
    this._writer.Write(145, contextData.landingGap, ctxMap);
    this._writer.Write(174, contextData.textLeftAttachment, ctxMap);
    this._writer.Write(175, contextData.textRightAttachment, ctxMap);
    this._writer.Write(176, contextData.textAlignment, ctxMap);
    this._writer.Write(177, contextData.blockContentConnection, ctxMap);
    this._writer.Write(290, contextData.hasTextContents, ctxMap);

    this._writer.WriteVector(110, contextData.contentBasePoint, ctxMap);
    this._writer.WriteVector(111, contextData.baseDirection, ctxMap);
    this._writer.WriteVector(112, contextData.baseVertical, ctxMap);
    this._writer.Write(297, contextData.normalReversed, ctxMap);

    this._writer.WriteVector(12, contextData.textLocation, ctxMap);
    this._writer.WriteVector(13, contextData.direction, ctxMap);

    for (const root of contextData.leaderRoots) {
      this._writer.Write(302, "LEADER{");
      this.writeLeaderRoot(root);
      this._writer.Write(303, "}");
    }

    this._writer.WriteHandle(340, contextData.textStyle);
  }

  private writeLeaderRoot(root: LeaderRoot): void {
    const rootMap = DxfClassMap.Create(root.constructor.name);
    this._writer.Write(290, root.contentValid, rootMap);
    this._writer.WriteVector(10, root.connectionPoint, rootMap);
    this._writer.WriteVector(11, root.direction, rootMap);

    for (const line of root.lines) {
      this._writer.Write(304, "LEADER_LINE{");
      this.writeLeaderLine(line);
      this._writer.Write(305, "}");
    }

    this._writer.Write(271, root.textAttachmentDirection, rootMap);
  }

  private writeLeaderLine(line: LeaderLine): void {
    for (const pt of line.points) {
      this._writer.WriteVector(10, pt);
    }
    this._writer.Write(91, line.breakInfoCount);
  }

  private writeOle2Frame(ole: Ole2Frame, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.Ole2Frame)!;
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.Ole2Frame);
    this._writer.Write(70, ole.oleObjectType, subclass);
    this._writer.Write(3, ole.sourceApplication, subclass);
    this._writer.WriteVector(10, ole.upperLeftCorner, subclass);
    this._writer.WriteVector(11, ole.lowerRightCorner, subclass);
  }

  private writePdfUnderlay(underlay: PdfUnderlay, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.Underlay)!;
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.Underlay);
    this._writer.WriteHandle(340, underlay.definition, subclass);
    this._writer.WriteVector(10, underlay.insertPoint, subclass);
    this._writer.Write(41, underlay.xScale, subclass);
    this._writer.Write(42, underlay.yScale, subclass);
    this._writer.Write(43, underlay.zScale, subclass);
    this._writer.Write(50, underlay.rotation, subclass);
    this._writer.Write(280, underlay.flags, subclass);
    this._writer.Write(281, underlay.contrast, subclass);
    this._writer.Write(282, underlay.fade, subclass);
  }

  private writePoint(point: Point, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.Point)!;
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.Point);
    this._writer.WriteVector(10, point.location, subclass);
    this._writer.Write(39, point.thickness, subclass);
    this._writer.WriteVector(210, point.normal, subclass);
    this._writer.Write(50, point.rotation, subclass);
  }

  private writePolyline(polyline: Polyline2D | Polyline3D | PolyfaceMesh | PolygonMesh, map: DxfMap): void {
    this._writer.Write(DxfCode.Subclass, polyline.subclassMarker);
    this._writer.Write(66, 1);
    this._writer.Write(70, polyline.flags);
    this._writer.WriteVector(210, polyline.normal);

    for (const vertex of polyline.vertices) {
      if (vertex instanceof Vertex) {
        this.writeVertex(vertex, map);
      }
    }

    this.writeSeqend(polyline.vertices.Seqend, map);
  }

  private writeVertex(vertex: Vertex, map: DxfMap): void {
    this._writer.Write(DxfCode.Start, vertex.objectName);
    this.writeCommonObjectData(vertex);
    this.writeCommonEntityData(vertex);

    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.Vertex);
    this._writer.Write(DxfCode.Subclass, vertex.subclassMarker);
    this._writer.WriteVector(10, vertex.location);
    this._writer.Write(70, vertex.flags);

    if (vertex instanceof Vertex2D) {
      this._writer.Write(40, vertex.startWidth);
      this._writer.Write(41, vertex.endWidth);
      this._writer.Write(42, vertex.bulge);
      this._writer.Write(50, vertex.curveTangent);
    } else if (vertex instanceof VertexFaceRecord) {
      this._writer.Write(71, vertex.index1);
      this._writer.Write(72, vertex.index2);
      this._writer.Write(73, vertex.index3);
      this._writer.Write(74, vertex.index4);
    }
  }

  private writeRay(ray: Ray, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.Ray)!;
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.Ray);
    this._writer.WriteVector(10, ray.startPoint, subclass);
    this._writer.WriteVector(11, ray.direction, subclass);
  }

  private writeShape(shape: Shape, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.Shape)!;
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.Shape);
    this._writer.WriteVector(10, shape.insertionPoint, subclass);
    this._writer.Write(40, shape.size, subclass);
    this._writer.Write(2, shape.shapeIndex, subclass);
    this._writer.Write(50, shape.rotation, subclass);
    this._writer.Write(41, shape.relativeXScale, subclass);
    this._writer.Write(51, shape.obliqueAngle, subclass);
    this._writer.Write(39, shape.thickness, subclass);
    this._writer.WriteVector(210, shape.normal, subclass);
  }

  private writeSolid(solid: Solid, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.Solid)!;
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.Solid);
    this._writer.WriteVector(10, solid.firstCorner, subclass);
    this._writer.WriteVector(11, solid.secondCorner, subclass);
    this._writer.WriteVector(12, solid.thirdCorner, subclass);
    this._writer.WriteVector(13, solid.fourthCorner, subclass);
    this._writer.Write(39, solid.thickness, subclass);
    this._writer.WriteVector(210, solid.normal, subclass);
  }

  private writeSpline(spline: Spline, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.Spline)!;
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.Spline);
    this._writer.WriteVector(210, spline.normal, subclass);
    this._writer.Write(70, spline.flags, subclass);
    this._writer.Write(71, spline.degree, subclass);
    this._writer.Write(72, spline.knots.length);
    this._writer.Write(73, spline.controlPoints.length);
    this._writer.Write(74, spline.fitPoints.length);
    this._writer.Write(42, spline.knotTolerance, subclass);
    this._writer.Write(43, spline.controlPointTolerance, subclass);
    this._writer.Write(44, spline.fitTolerance, subclass);

    if (spline.startTangent) {
      this._writer.WriteVector(12, spline.startTangent);
    }
    if (spline.endTangent) {
      this._writer.WriteVector(13, spline.endTangent);
    }

    for (const k of spline.knots) {
      this._writer.Write(40, k);
    }
    for (let i = 0; i < spline.controlPoints.length; i++) {
      this._writer.WriteVector(10, spline.controlPoints[i]);
      if (i < spline.weights.length) {
        this._writer.Write(41, spline.weights[i]);
      }
    }
    for (const fp of spline.fitPoints) {
      this._writer.WriteVector(11, fp);
    }
  }

  private writeTextEntity(text: TextEntity, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.Text)!;
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.Text);

    this._writer.Write(39, text.thickness, subclass);
    this._writer.WriteVector(10, text.insertPoint, subclass);
    this._writer.Write(40, text.height, subclass);
    this._writer.Write(1, text.value ?? '', subclass);
    this._writer.Write(50, text.rotation, subclass);
    this._writer.Write(41, text.widthFactor, subclass);
    this._writer.Write(51, text.obliqueAngle, subclass);
    this._writer.Write(7, text.style?.name ?? '', subclass);
    this._writer.Write(71, text.mirror, subclass);
    this._writer.Write(72, text.horizontalAlignment, subclass);
    this._writer.WriteVector(11, text.alignmentPoint, subclass);
    this._writer.WriteVector(210, text.normal, subclass);

    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.Text);
    this._writer.Write(73, text.verticalAlignment, subclass);
  }

  private writeTolerance(tolerance: Tolerance, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.Tolerance)!;
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.Tolerance);
    this._writer.Write(3, tolerance.style?.name ?? '', subclass);
    this._writer.WriteVector(10, tolerance.insertionPoint, subclass);
    this._writer.Write(1, tolerance.text ?? '', subclass);
    this._writer.WriteVector(11, tolerance.direction, subclass);
    this._writer.WriteVector(210, tolerance.normal, subclass);
  }

  private writeViewport(viewport: Viewport, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.Viewport)!;
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.Viewport);
    this._writer.WriteVector(10, viewport.center, subclass);
    this._writer.Write(40, viewport.width, subclass);
    this._writer.Write(41, viewport.height, subclass);
    this._writer.Write(68, viewport.id, subclass);
    this._writer.WriteVector(12, viewport.viewCenter, subclass);
    this._writer.WriteVector(13, viewport.snapBase, subclass);
    this._writer.WriteVector(14, viewport.snapSpacing, subclass);
    this._writer.WriteVector(15, viewport.gridSpacing, subclass);
    this._writer.WriteVector(16, viewport.viewDirection, subclass);
    this._writer.WriteVector(17, viewport.viewTarget, subclass);
    this._writer.Write(42, viewport.lensLength, subclass);
    this._writer.Write(43, viewport.frontClipPlane, subclass);
    this._writer.Write(44, viewport.backClipPlane, subclass);
    this._writer.Write(45, viewport.viewHeight, subclass);
    this._writer.Write(50, viewport.twistAngle, subclass);
    this._writer.Write(51, viewport.circleZoomPercent, subclass);
    this._writer.Write(72, viewport.displayUcsIcon, subclass);
    this._writer.Write(90, viewport.status, subclass);
    this._writer.Write(110, viewport.ucsOrigin, subclass);
    this._writer.Write(111, viewport.ucsXAxis, subclass);
    this._writer.Write(112, viewport.ucsYAxis, subclass);
    this._writer.Write(281, viewport.renderMode, subclass);

    for (const layer of viewport.frozenLayers) {
      this._writer.WriteHandle(331, layer);
    }
  }

  private writeXLine(xline: XLine, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.XLine)!;
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.XLine);
    this._writer.WriteVector(10, xline.firstPoint, subclass);
    this._writer.WriteVector(11, xline.direction, subclass);
  }

  private writeCadImage(image: CadImage, map: DxfMap): void {
    const subclass = map.subClasses.get(DxfSubclassMarker.RasterImage)!;
    this._writer.Write(DxfCode.Subclass, DxfSubclassMarker.RasterImage);
    this._writer.Write(90, image.classVersion, subclass);
    this._writer.WriteVector(10, image.insertPoint, subclass);
    this._writer.WriteVector(11, image.uVector, subclass);
    this._writer.WriteVector(12, image.vVector, subclass);
    this._writer.WriteVector(13, image.size, subclass);
    this._writer.WriteHandle(340, image.definition, subclass);
    this._writer.Write(70, image.flags, subclass);
    this._writer.Write(280, image.clippingState, subclass);
    this._writer.Write(281, image.brightness, subclass);
    this._writer.Write(282, image.contrast, subclass);
    this._writer.Write(283, image.fade, subclass);
    this._writer.WriteHandle(360, image.definitionReactor, subclass);
    this._writer.Write(71, image.clipType, subclass);
    this._writer.Write(91, image.clipBoundaryVertices.length);
    for (const v of image.clipBoundaryVertices) {
      this._writer.Write(14, v.X);
      this._writer.Write(24, v.Y);
    }
  }

  private writeSeqend(seqend: Seqend, map: DxfMap): void {
    if (!seqend) return;
    this._writer.Write(DxfCode.Start, seqend.objectName);
    this.writeCommonObjectData(seqend);
    this.writeCommonEntityData(seqend);
  }

  private writeAttributeBase(att: AttributeBase, map: DxfMap): void {
    this._writer.Write(DxfCode.Subclass, att.subclassMarker);
    this._writer.Write(2, att.tag);
    this._writer.Write(70, att.flags);
    this._writer.WriteVector(10, att.insertPoint);
    this._writer.Write(40, att.height);
    this._writer.Write(1, att.value ?? '');
    this._writer.Write(7, att.style?.name ?? '');
    this._writer.Write(41, att.widthFactor);
    this._writer.Write(50, att.rotation);
    this._writer.Write(51, att.obliqueAngle);
    this._writer.WriteVector(11, att.alignmentPoint);
    this._writer.Write(71, att.mirror);
    this._writer.Write(72, att.horizontalAlignment);
    this._writer.Write(73, att.verticalAlignment);
    this._writer.WriteVector(210, att.normal);
  }
}
