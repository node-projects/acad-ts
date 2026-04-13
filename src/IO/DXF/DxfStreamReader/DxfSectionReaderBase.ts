import { Entity } from '../../../Entities/Entity.js';
import { Arc } from '../../../Entities/Arc.js';
import { AttributeEntity } from '../../../Entities/AttributeEntity.js';
import { AttributeDefinition } from '../../../Entities/AttributeDefinition.js';
import { AttributeBase } from '../../../Entities/AttributeBase.js';
import { CadBody } from '../../../Entities/CadBody.js';
import { Circle } from '../../../Entities/Circle.js';
import { Dimension } from '../../../Entities/Dimension.js';
import { DimensionLinear } from '../../../Entities/DimensionLinear.js';
import { DimensionAligned } from '../../../Entities/DimensionAligned.js';
import { DimensionDiameter } from '../../../Entities/DimensionDiameter.js';
import { DimensionAngular2Line } from '../../../Entities/DimensionAngular2Line.js';
import { DimensionAngular3Pt } from '../../../Entities/DimensionAngular3Pt.js';
import { DimensionRadius } from '../../../Entities/DimensionRadius.js';
import { DimensionOrdinate } from '../../../Entities/DimensionOrdinate.js';
import { DimensionType } from '../../../Entities/DimensionType.js';
import { Ellipse } from '../../../Entities/Ellipse.js';
import { Face3D } from '../../../Entities/Face3D.js';
import { Hatch , HatchBoundaryPathPolyline, HatchBoundaryPathEdge, HatchBoundaryPath, HatchBoundaryPathLine, HatchBoundaryPathArc, HatchBoundaryPathEllipse, HatchBoundaryPathSpline, EdgeType} from '../../../Entities/Hatch.js';
import { BoundaryPathFlags } from '../../../Entities/BoundaryPathFlags.js';
import { HatchPattern } from '../../../Entities/HatchPattern.js';
import { GradientColor } from '../../../Entities/GradientColor.js';
import { Insert } from '../../../Entities/Insert.js';
import { Leader } from '../../../Entities/Leader.js';
import { Line } from '../../../Entities/Line.js';
import { LwPolyline } from '../../../Entities/LwPolyline.js';
import { Mesh } from '../../../Entities/Mesh.js';
import { MLine } from '../../../Entities/MLine.js';
import { MText } from '../../../Entities/MText.js';
import { ColumnType } from '../../../Entities/ColumnType.js';
import { MultiLeader } from '../../../Entities/MultiLeader.js';
import { MultiLeaderObjectContextData , LeaderRoot, LeaderLine} from '../../../Objects/MultiLeaderObjectContextData.js';
import { Point } from '../../../Entities/Point.js';
import { Polyline2D } from '../../../Entities/Polyline2D.js';
import { Polyline3D } from '../../../Entities/Polyline3D.js';
import { PolyfaceMesh } from '../../../Entities/PolyfaceMesh.js';
import { PolygonMesh } from '../../../Entities/PolygonMesh.js';
import { PolygonMeshVertex } from '../../../Entities/PolygonMeshVertex.js';
import { PdfUnderlay } from '../../../Entities/PdfUnderlay.js';
import { PdfUnderlayDefinition } from '../../../Objects/PdfUnderlayDefinition.js';
import { Ole2Frame } from '../../../Entities/Ole2Frame.js';
import { Ray } from '../../../Entities/Ray.js';
import { RasterImage } from '../../../Entities/RasterImage.js';
import { Region } from '../../../Entities/Region.js';
import { Seqend } from '../../../Entities/Seqend.js';
import { Shape } from '../../../Entities/Shape.js';
import { Solid } from '../../../Entities/Solid.js';
import { Solid3D } from '../../../Entities/Solid3D.js';
import { Spline } from '../../../Entities/Spline.js';
import { TextEntity } from '../../../Entities/TextEntity.js';
import { TableEntity , CellContent, TableEntityRow, TableEntityColumn, CellType} from '../../../Entities/TableEntity.js';
import { Tolerance } from '../../../Entities/Tolerance.js';
import { Vertex2D } from '../../../Entities/Vertex2D.js';
import { Vertex3D } from '../../../Entities/Vertex3D.js';
import { VertexFaceMesh } from '../../../Entities/VertexFaceMesh.js';
import { VertexFaceRecord } from '../../../Entities/VertexFaceRecord.js';
import { Viewport } from '../../../Entities/Viewport.js';
import { Wipeout } from '../../../Entities/Wipeout.js';
import { CadWipeoutBase } from '../../../Entities/CadWipeoutBase.js';
import { XLine } from '../../../Entities/XLine.js';
import { UnknownEntity } from '../../../Entities/UnknownEntity.js';
import { ModelerGeometry } from '../../../Entities/ModelerGeometry.js';
import { Layer } from '../../../Tables/Layer.js';
import { CadTemplate } from '../../Templates/CadTemplate.js';
import { CadEntityTemplate } from '../../Templates/CadEntityTemplate.js';
import { CadAttributeTemplate } from '../../Templates/CadAttributeTemplate.js';
import { CadDimensionTemplate , DimensionPlaceholder} from '../../Templates/CadDimensionTemplate.js';
import { CadHatchTemplate } from '../../Templates/CadHatchTemplate.js';
import { CadInsertTemplate } from '../../Templates/CadInsertTemplate.js';
import { CadLeaderTemplate } from '../../Templates/CadLeaderTemplate.js';
import { CadMeshTemplate } from '../../Templates/CadMeshTemplate.js';
import { CadMLineTemplate } from '../../Templates/CadMLineTemplate.js';
import { CadMLeaderTemplate } from '../../Templates/CadMLeaderTemplate.js';
import { CadMLeaderAnnotContextTemplate } from '../../Templates/CadMLeaderAnnotContextTemplate.js';
import { CadOle2FrameTemplate } from '../../Templates/CadOle2FrameTemplate.js';
import { CadPolyLineTemplate } from '../../Templates/CadPolyLineTemplate.js';
import { CadShapeTemplate } from '../../Templates/CadShapeTemplate.js';
import { CadSolid3DTemplate } from '../../Templates/CadSolid3DTemplate.js';
import { CadSplineTemplate } from '../../Templates/CadSplineTemplate.js';
import { CadTableEntityTemplate , CadTableCellContentTemplate} from '../../Templates/CadTableEntityTemplate.js';
import { CadTextEntityTemplate } from '../../Templates/CadTextEntityTemplate.js';
import { CadToleranceTemplate } from '../../Templates/CadToleranceTemplate.js';
import { CadUnderlayTemplate } from '../../Templates/CadUnderlayTemplate.js';
import { CadVertexTemplate } from '../../Templates/CadVertexTemplate.js';
import { CadViewportTemplate } from '../../Templates/CadViewportTemplate.js';
import { CadWipeoutBaseTemplate } from '../../Templates/CadWipeoutBaseTemplate.js';
import { CadUnknownEntityTemplate } from '../../Templates/CadUnknownEntityTemplate.js';
import { CadValueTemplate } from '../../Templates/CadValueTemplate.js';
import { CadValue } from '../../../CadValue.js';
import { CadValueType } from '../../../CadValueType.js';
import { Color } from '../../../Color.js';
import { LineWeightType } from '../../../Types/LineWeightType.js';
import { DxfCode } from '../../../DxfCode.js';
import { DxfFileToken } from '../../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../../DxfSubclassMarker.js';
import { DxfMap } from '../../../DxfMap.js';
import { DxfClassMap } from '../../../DxfClassMap.js';
import { DxfProperty } from '../../../DxfProperty.js';
import { DxfReferenceType } from '../../../Types/DxfReferenceType.js';
import { ObjectType } from '../../../Types/ObjectType.js';
import { IDxfStreamReader } from './IDxfStreamReader.js';
import { DxfDocumentBuilder } from '../DxfDocumentBuilder.js';
import { NotificationType } from '../../NotificationEventHandler.js';
import { ACadVersion } from '../../../ACadVersion.js';
import { XY } from '../../../Math/XY.js';
import { XYZ } from '../../../Math/XYZ.js';
import { IVector } from '../../../Math/IVector.js';
import { MathHelper } from '../../../Math/MathHelper.js';
import { ExtendedDataRecord } from '../../../XData/ExtendedDataRecord.js';
import { ExtendedDataString } from '../../../XData/ExtendedDataString.js';
import { ExtendedDataControlString } from '../../../XData/ExtendedDataControlString.js';
import { ExtendedDataLayer } from '../../../XData/ExtendedDataLayer.js';
import { ExtendedDataBinaryChunk } from '../../../XData/ExtendedDataBinaryChunk.js';
import { ExtendedDataHandle } from '../../../XData/ExtendedDataHandle.js';
import { ExtendedDataCoordinate } from '../../../XData/ExtendedDataCoordinate.js';
import { ExtendedDataWorldCoordinate } from '../../../XData/ExtendedDataWorldCoordinate.js';
import { ExtendedDataDisplacement } from '../../../XData/ExtendedDataDisplacement.js';
import { ExtendedDataDirection } from '../../../XData/ExtendedDataDirection.js';
import { ExtendedDataReal } from '../../../XData/ExtendedDataReal.js';
import { ExtendedDataDistance } from '../../../XData/ExtendedDataDistance.js';
import { ExtendedDataScale } from '../../../XData/ExtendedDataScale.js';
import { ExtendedDataInteger16 } from '../../../XData/ExtendedDataInteger16.js';
import { ExtendedDataInteger32 } from '../../../XData/ExtendedDataInteger32.js';
import { LwPolylineVertex } from '../../../Entities/LwPolyline.js';
import { MeshEdge } from '../../../Entities/Mesh.js';
import { HatchPatternLine } from '../../../Entities/HatchPattern.js';

export type ReadEntityDelegate = (template: CadEntityTemplate, map: DxfMap, subclass?: string) => boolean;

export interface CommonObjectDataResult {
  name: string | null;
  handle: number;
  ownerHandle: number | null;
  xdictHandle: number | null;
  reactors: Set<number>;
}

interface DefinedGroupsResult {
  xdictHandle: number | null;
  reactors: Set<number>;
}

export abstract class DxfSectionReaderBase {

  protected readonly _reader: IDxfStreamReader;
  protected readonly _builder: DxfDocumentBuilder;

  protected lockPointer: boolean = false;
  protected currentSubclass: string | null = null;

  constructor(reader: IDxfStreamReader, builder: DxfDocumentBuilder) {
    this._reader = reader;
    this._builder = builder;
  }

  public abstract Read(): void;

  protected readCommonObjectData(): CommonObjectDataResult;
  protected readCommonObjectData(template: CadTemplate): void;
  protected readCommonObjectData(template?: CadTemplate): CommonObjectDataResult | void {
    if (template !== undefined) {
      // Deprecated overload: reads common object data into a template
      while (this._reader.DxfCode !== DxfCode.Subclass) {
        switch (this._reader.Code as number) {
          case 0:
            // object name - assert matches template
            break;
          case 5:
            template.CadObject.handle = this._reader.ValueAsHandle;
            break;
          case 102:
            this.readDefinedGroups(template);
            break;
          case 330:
            template.OwnerHandle = this._reader.ValueAsHandle;
            break;
          default:
            this._builder.Notify(`Unhandled dxf code ${this._reader.Code} at line ${this._reader.Position}.`, NotificationType.None);
            break;
        }
        this._reader.ReadNext();
      }
      return;
    }

    const result: CommonObjectDataResult = {
      name: null,
      handle: 0,
      ownerHandle: null,
      xdictHandle: null,
      reactors: new Set<number>(),
    };

    if (this._reader.DxfCode === DxfCode.Start
      || this._reader.DxfCode === DxfCode.Subclass) {
      this._reader.ReadNext();
    }

    while (this._reader.DxfCode !== DxfCode.Start
      && this._reader.DxfCode !== DxfCode.Subclass) {
      switch (this._reader.Code as number) {
        case 2:
          result.name = this._reader.ValueAsString;
          break;
        case 5:
        case 105:
          result.handle = this._reader.ValueAsHandle;
          break;
        case 102: {
          const groups = this.readDefinedGroupsRaw();
          result.xdictHandle = groups.xdictHandle;
          result.reactors = groups.reactors;
          break;
        }
        case 330:
          result.ownerHandle = this._reader.ValueAsHandle;
          break;
        case 71:
        case 340:
        default:
          this._builder.Notify(`Unhandled dxf code ${this._reader.Code} at line ${this._reader.Position}.`);
          break;
      }
      this._reader.ReadNext();
    }

    return result;
  }

  protected readCommonCodes(template: CadTemplate, isExtendedData: { value: boolean }, map?: DxfMap): void {
    isExtendedData.value = false;

    switch (this._reader.Code as number) {
      case 5:
        template.CadObject.handle = this._reader.ValueAsHandle;
        break;
      case 100:
        this.currentSubclass = this._reader.ValueAsString;
        if (map && !map.subClasses.has(this._reader.ValueAsString)) {
          this._builder.Notify(`[${template.CadObject.objectName}] Unidentified subclass ${this._reader.ValueAsString}`, NotificationType.Warning);
        }
        break;
      case 102:
        this.readDefinedGroups(template);
        break;
      case 330:
        template.OwnerHandle = this._reader.ValueAsHandle;
        break;
      case 1001:
        isExtendedData.value = true;
        this.readExtendedData(template.EDataTemplateByAppName);
        break;
      default:
        this._builder.Notify(`[${this.currentSubclass}] Unhandled dxf code ${this._reader.Code} with value ${this._reader.ValueAsString}`, NotificationType.None);
        break;
    }
  }

  protected readEntity(): CadEntityTemplate | null {
    this.currentSubclass = '';
    switch (this._reader.ValueAsString as string) {
      case DxfFileToken.EntityAttribute:
        return this.readEntityCodes(new CadAttributeTemplate(new AttributeEntity()), this.readAttributeDefinition.bind(this), AttributeEntity);
      case DxfFileToken.EntityAttributeDefinition:
        return this.readEntityCodes(new CadAttributeTemplate(new AttributeDefinition()), this.readAttributeDefinition.bind(this), AttributeDefinition);
      case DxfFileToken.EntityArc:
        return this.readEntityCodes(new CadEntityTemplate(new Arc()), this.readArc.bind(this), Arc);
      case DxfFileToken.EntityBody:
        return this.readEntityCodes(new CadEntityTemplate(new CadBody()), this.readEntitySubclassMap.bind(this), CadBody);
      case DxfFileToken.EntityCircle:
        return this.readEntityCodes(new CadEntityTemplate(new Circle()), this.readCircle.bind(this), Circle);
      case DxfFileToken.EntityDimension: {
        const dimTemplate = this.readEntityCodes(new CadDimensionTemplate(), this.readDimension.bind(this), Dimension);
        if (dimTemplate.CadObject instanceof DimensionPlaceholder) {
          this._builder.Notify(`[${DxfFileToken.EntityDimension}] No subtype found, object discarded.`, NotificationType.Warning);
          return null;
        }
        return dimTemplate;
      }
      case DxfFileToken.Entity3DFace:
        return this.readEntityCodes(new CadEntityTemplate(new Face3D()), this.readEntitySubclassMap.bind(this), Face3D);
      case DxfFileToken.EntityEllipse:
        return this.readEntityCodes(new CadEntityTemplate(new Ellipse()), this.readEntitySubclassMap.bind(this), Ellipse);
      case DxfFileToken.EntityLeader:
        return this.readEntityCodes(new CadLeaderTemplate(), this.readLeader.bind(this), Leader);
      case DxfFileToken.EntityLine:
        return this.readEntityCodes(new CadEntityTemplate(new Line()), this.readEntitySubclassMap.bind(this), Line);
      case DxfFileToken.EntityLwPolyline:
        return this.readEntityCodes(new CadEntityTemplate(new LwPolyline()), this.readLwPolyline.bind(this), LwPolyline);
      case DxfFileToken.EntityMesh:
        return this.readEntityCodes(new CadMeshTemplate(), this.readMesh.bind(this), Mesh);
      case DxfFileToken.EntityHatch:
        return this.readEntityCodes(new CadHatchTemplate(), this.readHatch.bind(this), Hatch);
      case DxfFileToken.EntityInsert:
        return this.readEntityCodes(new CadInsertTemplate(), this.readInsert.bind(this), Insert);
      case DxfFileToken.EntityMText:
        return this.readEntityCodes(new CadTextEntityTemplate(new MText()), this.readTextEntity.bind(this), MText);
      case DxfFileToken.EntityMLine:
        return this.readEntityCodes(new CadMLineTemplate(), this.readMLine.bind(this), MLine);
      case DxfFileToken.EntityMultiLeader:
        return this.readEntityCodes(new CadMLeaderTemplate(), this.readMLeader.bind(this), MultiLeader);
      case DxfFileToken.EntityPdfUnderlay:
        return this.readEntityCodes(new CadUnderlayTemplate(new PdfUnderlay()), this.readUnderlayEntity.bind(this), PdfUnderlay);
      case DxfFileToken.EntityPoint:
        return this.readEntityCodes(new CadEntityTemplate(new Point()), this.readEntitySubclassMap.bind(this), Point);
      case DxfFileToken.EntityPolyline:
        return this.readPolyline();
      case DxfFileToken.EntityOle2Frame:
        return this.readEntityCodes(new CadOle2FrameTemplate(), this.readOle2Frame.bind(this), Ole2Frame);
      case DxfFileToken.EntityRay:
        return this.readEntityCodes(new CadEntityTemplate(new Ray()), this.readEntitySubclassMap.bind(this), Ray);
      case DxfFileToken.EndSequence:
        return this.readEntityCodes(new CadEntityTemplate(new Seqend()), this.readEntitySubclassMap.bind(this), Seqend);
      case DxfFileToken.EntityTrace:
      case DxfFileToken.EntitySolid:
        return this.readEntityCodes(new CadEntityTemplate(new Solid()), this.readModelerGeometry.bind(this), Solid);
      case DxfFileToken.EntityTable:
        return this.readEntityCodes(new CadTableEntityTemplate(), this.readTableEntity.bind(this), TableEntity);
      case DxfFileToken.EntityText:
        return this.readEntityCodes(new CadTextEntityTemplate(new TextEntity()), this.readTextEntity.bind(this), TextEntity);
      case DxfFileToken.EntityTolerance:
        return this.readEntityCodes(new CadToleranceTemplate(new Tolerance()), this.readTolerance.bind(this), Tolerance);
      case DxfFileToken.EntityVertex:
        return this.readEntityCodes(new CadVertexTemplate(), this.readVertex.bind(this), Entity);
      case DxfFileToken.EntityViewport:
        return this.readEntityCodes(new CadViewportTemplate(), this.readViewport.bind(this), Viewport);
      case DxfFileToken.EntityShape:
        return this.readEntityCodes(new CadShapeTemplate(new Shape()), this.readShape.bind(this), Shape);
      case DxfFileToken.EntitySpline:
        return this.readEntityCodes(new CadSplineTemplate(), this.readSpline.bind(this), Spline);
      case DxfFileToken.Entity3DSolid:
        return this.readEntityCodes(new CadSolid3DTemplate(), this.readSolid3d.bind(this), Solid3D);
      case DxfFileToken.EntityRegion:
        return this.readEntityCodes(new CadEntityTemplate(new Region()), this.readModelerGeometry.bind(this), Region);
      case DxfFileToken.EntityImage:
        return this.readEntityCodes(new CadWipeoutBaseTemplate(new RasterImage()), this.readWipeoutBase.bind(this), RasterImage);
      case DxfFileToken.EntityWipeout:
        return this.readEntityCodes(new CadWipeoutBaseTemplate(new Wipeout()), this.readWipeoutBase.bind(this), Wipeout);
      case DxfFileToken.EntityXline:
        return this.readEntityCodes(new CadEntityTemplate(new XLine()), this.readEntitySubclassMap.bind(this), XLine);
      default: {
        const map = DxfMap.create(Entity);
        let unknownEntityTemplate: CadUnknownEntityTemplate | null = null;
        const dxfClass = this._builder.DocumentToBuild.classes.tryGetByName(this._reader.ValueAsString);
        if (dxfClass) {
          this._builder.Notify(`Entity not supported read as an UnknownEntity: ${this._reader.ValueAsString}`, NotificationType.NotImplemented);
          unknownEntityTemplate = new CadUnknownEntityTemplate(new UnknownEntity(dxfClass));
        } else {
          this._builder.Notify(`Entity not supported: ${this._reader.ValueAsString}`, NotificationType.NotImplemented);
        }

        this._reader.ReadNext();

        do {
          if (unknownEntityTemplate !== null && this._builder.KeepUnknownEntities) {
            const isExtendedData = { value: false };
            this.readCommonEntityCodes(unknownEntityTemplate, isExtendedData, map);
            if (isExtendedData.value) {
              continue;
            }
          }
          this._reader.ReadNext();
        } while (this._reader.DxfCode !== DxfCode.Start);

        return unknownEntityTemplate;
      }
    }
  }

  protected readEntityCodes(template: CadEntityTemplate, readEntity: ReadEntityDelegate, entityType: Function): CadEntityTemplate {
    this._reader.ReadNext();

    const map = DxfMap.create(typeof entityType === 'string' ? entityType : entityType.name);

    while (this._reader.DxfCode !== DxfCode.Start) {
      if (!readEntity(template, map)) {
        const isExtendedData = { value: false };
        this.readCommonEntityCodes(template, isExtendedData, map);
        if (isExtendedData.value) {
          continue;
        }
      }

      if (this.lockPointer) {
        this.lockPointer = false;
        continue;
      }

      if (this._reader.Code !== DxfCode.Start) {
        this._reader.ReadNext();
      }
    }

    return template;
  }

  protected readCommonEntityCodes(template: CadEntityTemplate, isExtendedData: { value: boolean }, map?: DxfMap): void {
    isExtendedData.value = false;
    switch (this._reader.Code as number) {
      case 6:
        template.LineTypeName = this._reader.ValueAsString;
        break;
      case 8:
        template.LayerName = this._reader.ValueAsString;
        break;
      case 67:
        break;
      case 92:
      case 160:
      case 310:
        break;
      case 347:
        template.MaterialHandle = this._reader.ValueAsHandle;
        break;
      case 430:
        template.bookColorName = this._reader.ValueAsString;
        break;
      default:
        if (!this.tryAssignCurrentValue(template.CadObject, map!.subClasses.get(DxfSubclassMarker.Entity)!)) {
          this.readCommonCodes(template, isExtendedData, map);
        }
        break;
    }
  }

  /** @deprecated use lockPointer instead */
  protected checkObjectEnd(template: CadTemplate, map: DxfMap, func: (template: CadTemplate, map: DxfMap) => boolean): boolean {
    if (this._reader.DxfCode === DxfCode.Start) {
      return true;
    } else {
      return func(template, map);
    }
  }

  protected checkEntityEnd(template: CadEntityTemplate, map: DxfMap, subclass: string | undefined, func: ReadEntityDelegate): boolean {
    if (this._reader.DxfCode === DxfCode.Start) {
      return true;
    } else {
      return func(template, map, subclass);
    }
  }

  private readCircle(template: CadEntityTemplate, map: DxfMap, subclass?: string): boolean {
    const circle = template.CadObject as Circle;

    switch (this._reader.Code as number) {
      case 40: {
        const radius = this._reader.ValueAsDouble;
        if (radius <= 0) {
          circle.radius = MathHelper.Epsilon;
        } else {
          circle.radius = radius;
        }
        return true;
      }
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(DxfSubclassMarker.Circle)!);
    }
  }

  private readArc(template: CadEntityTemplate, map: DxfMap, subclass?: string): boolean {
    switch (this._reader.Code as number) {
      default:
        if (!this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(DxfSubclassMarker.Arc)!)) {
          return this.readCircle(template, map, DxfSubclassMarker.Circle);
        }
        return true;
    }
  }

  private readAttributeDefinition(template: CadEntityTemplate, map: DxfMap, subclass?: string): boolean {
    const emap = map.subClasses.get(template.CadObject.subclassMarker)!;
    const tmp = template as CadAttributeTemplate;

    switch (this._reader.Code as number) {
      case 44:
      case 46:
        return true;
      case 101: {
        const att = tmp.CadObject as AttributeBase;
        att.mText = new MText();
        const mtextTemplate = new CadTextEntityTemplate(att.mText);
        tmp.MTextTemplate = mtextTemplate;
        this.readEntityCodes(mtextTemplate, this.readTextEntity.bind(this), MText);
        return true;
      }
      default:
        if (!this.tryAssignCurrentValue(template.CadObject, emap)) {
          return this.readTextEntity(template, map, DxfSubclassMarker.Text);
        }
        return true;
    }
  }

  private readTableEntity(template: CadEntityTemplate, map: DxfMap, subclass?: string): boolean {
    const mapName = !subclass ? template.CadObject.subclassMarker : subclass;
    const tmp = template as CadTableEntityTemplate;
    const table = tmp.CadObject as TableEntity;

    switch (this._reader.Code as number) {
      case 1: {
        let content: CellContent;
        if (tmp.CurrentCell.content === null) {
          content = new CellContent();
          content.cadValue.valueType = CadValueType.String;
          tmp.CurrentCell.contents.push(content);
        } else {
          content = tmp.CurrentCell.content;
        }

        if (content.cadValue.value === null) {
          content.cadValue.setValue(this._reader.ValueAsString, CadValueType.String);
        } else {
          let str = content.cadValue.value as string;
          str += this._reader.ValueAsString;
          content.cadValue.setValue(str, CadValueType.String);
        }
        return true;
      }
      case 2: {
        if (this.currentSubclass !== null && this.currentSubclass.toUpperCase() === DxfSubclassMarker.TableEntity.toUpperCase()) {
          const content = tmp.CurrentCell.content!;
          if (content.cadValue.value === null) {
            content.cadValue.setValue(this._reader.ValueAsString, CadValueType.String);
          } else {
            let str = content.cadValue.value as string;
            str += this._reader.ValueAsString;
            content.cadValue.setValue(str, CadValueType.String);
          }
        } else {
          tmp.BlockName = this._reader.ValueAsString;
        }
        return true;
      }
      case 177:
        return true;
      case 279:
        tmp.CurrentCell.styleOverride.topBorder.lineWeight = this._reader.ValueAsShort as LineWeightType;
        return true;
      case 275:
        tmp.CurrentCell.styleOverride.rightBorder.lineWeight = this._reader.ValueAsShort as LineWeightType;
        return true;
      case 276:
        tmp.CurrentCell.styleOverride.bottomBorder.lineWeight = this._reader.ValueAsShort as LineWeightType;
        return true;
      case 278:
        tmp.CurrentCell.styleOverride.leftBorder.lineWeight = this._reader.ValueAsShort as LineWeightType;
        return true;
      case 69:
        tmp.CurrentCell.styleOverride.topBorder.color = new Color(this._reader.ValueAsShort);
        return true;
      case 65:
        tmp.CurrentCell.styleOverride.rightBorder.color = new Color(this._reader.ValueAsShort);
        return true;
      case 66:
        tmp.CurrentCell.styleOverride.bottomBorder.color = new Color(this._reader.ValueAsShort);
        return true;
      case 68:
        tmp.CurrentCell.styleOverride.leftBorder.color = new Color(this._reader.ValueAsShort);
        return true;
      case 40:
        tmp.HorizontalMargin = this._reader.ValueAsDouble;
        return true;
      case 63:
        tmp.CurrentCell.styleOverride.backgroundColor = new Color(this._reader.ValueAsShort);
        return true;
      case 64:
        tmp.CurrentCell.styleOverride.contentColor = new Color(this._reader.ValueAsShort);
        return true;
      case 140:
        if (tmp.CurrentCellTemplate !== null) {
          tmp.CurrentCellTemplate.FormatTextHeight = this._reader.ValueAsDouble;
        }
        return true;
      case 283:
        tmp.CurrentCell.styleOverride.isFillColorOn = this._reader.ValueAsBool;
        return true;
      case 342:
        tmp.styleHandle = this._reader.ValueAsHandle;
        return true;
      case 343:
        tmp.BlockOwnerHandle = this._reader.ValueAsHandle;
        return true;
      case 141: {
        const row = new TableEntityRow();
        row.height = this._reader.ValueAsDouble;
        table.rows.push(row);
        return true;
      }
      case 142: {
        const col = new TableEntityColumn();
        col.width = this._reader.ValueAsDouble;
        table.columns.push(col);
        return true;
      }
      case 144:
        tmp.CurrentCellTemplate.FormatTextHeight = this._reader.ValueAsDouble;
        return true;
      case 145:
        tmp.CurrentCell.rotation = this._reader.ValueAsDouble;
        return true;
      case 170:
        return true;
      case 171:
        tmp.CreateCell(this._reader.ValueAsInt as CellType);
        return true;
      case 172:
        tmp.CurrentCell.edgeFlags = this._reader.ValueAsShort;
        return true;
      case 173:
        tmp.CurrentCell.mergedValue = this._reader.ValueAsShort;
        return true;
      case 174:
        tmp.CurrentCell.autoFit = this._reader.ValueAsBool;
        return true;
      case 175:
        tmp.CurrentCell.borderWidth = this._reader.ValueAsInt;
        return true;
      case 176:
        tmp.CurrentCell.borderHeight = this._reader.ValueAsInt;
        return true;
      case 178:
        tmp.CurrentCell.virtualEdgeFlag = this._reader.ValueAsShort;
        return true;
      case 179:
        return true;
      case 301: {
        const content = new CellContent();
        const contentTemplate = new CadTableCellContentTemplate(content);
        tmp.CurrentCell.contents.push(content);
        const valTemplate = this.readCadValue(content.cadValue);
        contentTemplate.CadValueTemplate = valTemplate;
        return true;
      }
      case 340:
        tmp.CurrentCellTemplate.ValueHandle = this._reader.ValueAsHandle;
        return true;
      default:
        if (!this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(DxfSubclassMarker.Insert)!)) {
          return this.readEntitySubclassMap(template, map, DxfSubclassMarker.TableEntity);
        }
        return true;
    }
  }

  protected readCadValue(value: CadValue): CadValueTemplate {
    this._reader.ReadNext();

    const template = new CadValueTemplate(value);
    const map = DxfClassMap.Create(value.constructor, 'CadValue');

    while (this._reader.Code !== 304) {
      switch (this._reader.Code as number) {
        case 1:
          value.setValue(this._reader.ValueAsString);
          break;
        case 2:
          value.setValue((value.value as string) + this._reader.ValueAsString);
          break;
        case 11: {
          const xyz = new XYZ();
          xyz.X = this._reader.ValueAsDouble;
          value.setValue(xyz);
          break;
        }
        case 21: {
          const v = value.value as IVector;
          v[1] = this._reader.ValueAsDouble;
          value.setValue(v);
          break;
        }
        case 31: {
		  const current = value.value as XY | XYZ | null;
		  const v = new XYZ(current?.x ?? 0, current?.y ?? 0, this._reader.ValueAsDouble);
		  value.setValue(v);
          break;
        }
        case 91:
          value.setValue(this._reader.ValueAsInt);
          break;
        case 140:
          value.setValue(this._reader.ValueAsDouble);
          break;
        case 330:
          template.ValueHandle = this._reader.ValueAsHandle;
          break;
        default:
          if (!this.tryAssignCurrentValue(value, map)) {
            this._builder.Notify(`Unhandled dxf code ${this._reader.Code} value ${this._reader.ValueAsString} at readCadValue method.`, NotificationType.None);
          }
          break;
      }
      this._reader.ReadNext();
    }

    return template;
  }

  private readTextEntity(template: CadEntityTemplate, map: DxfMap, subclass?: string): boolean {
    const mapName = !subclass ? template.CadObject.subclassMarker : subclass;
    const tmp = template as CadTextEntityTemplate;

    switch (this._reader.Code as number) {
      case 1:
      case 3:
        if (tmp.CadObject instanceof MText) {
          (tmp.CadObject as MText).value += this._reader.ValueAsString;
          return true;
        }
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(mapName)!);
      case 50:
        if (tmp.CadObject instanceof MText) {
          const angle = this._reader.ValueAsAngle;
          (tmp.CadObject as MText).alignmentPoint = new XYZ(Math.cos(angle), Math.sin(angle), 0.0);
          return true;
        }
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(mapName)!);
      case 7:
        tmp.StyleName = this._reader.ValueAsString;
        return true;
      case 101:
        if (tmp.CadObject instanceof MText) {
          this.readColumnData(tmp.CadObject as MText);
          this.lockPointer = true;
          return true;
        }
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(mapName)!);
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(mapName)!);
    }
  }

  private readColumnData(mtext: MText): void {
    this._reader.ReadNext();
    while (this._reader.DxfCode !== DxfCode.Start) {
      switch (this._reader.Code as number) {
        case 70:
          break;
        case 71:
          mtext.columnData.columnType = this._reader.ValueAsShort as ColumnType;
          break;
        case 72:
          mtext.columnData.columnCount = this._reader.ValueAsInt;
          break;
        case 10:
        case 20:
        case 30:
        case 11:
        case 21:
        case 31:
        case 40:
        case 41:
        case 42:
        case 43:
          break;
        case 44:
          mtext.columnData.width = this._reader.ValueAsDouble;
          break;
        case 45:
          mtext.columnData.gutter = this._reader.ValueAsDouble;
          break;
        case 46:
          mtext.columnData.heights.push(this._reader.ValueAsDouble);
          break;
        case 73:
          mtext.columnData.autoHeight = this._reader.ValueAsBool;
          break;
        case 74:
          mtext.columnData.flowReversed = this._reader.ValueAsBool;
          break;
        default:
          this._builder.Notify(`[MText.ColumnData] unknown dxf code ${this._reader.Code}.`, NotificationType.None);
          break;
      }
      this._reader.ReadNext();
    }
  }

  private readTolerance(template: CadEntityTemplate, map: DxfMap, subclass?: string): boolean {
    const tmp = template as CadToleranceTemplate;

    switch (this._reader.Code as number) {
      case 3:
        tmp.DimensionStyleName = this._reader.ValueAsString;
        return true;
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(template.CadObject.subclassMarker)!);
    }
  }

  private readDimension(template: CadEntityTemplate, map: DxfMap, subclass?: string): boolean {
    const tmp = template as CadDimensionTemplate;

    switch (this._reader.Code as number) {
      case 2:
        tmp.BlockName = this._reader.ValueAsString;
        return true;
      case 3:
        tmp.StyleName = this._reader.ValueAsString;
        return true;
      case 50: {
        const dim = new DimensionLinear();
        tmp.SetDimensionObject(dim);
        dim.rotation = this._reader.ValueAsAngle;
        if (!map.subClasses.has(DxfSubclassMarker.LinearDimension)) {
          map.subClasses.set(DxfSubclassMarker.LinearDimension, DxfClassMap.Create(DimensionLinear));
        }
        return true;
      }
      case 70: {
        tmp.SetDimensionFlags(this._reader.ValueAsShort as DimensionType);

        if (tmp.CadObject instanceof DimensionPlaceholder && this._builder.Version < ACadVersion.AC1012) {
          const placeholder = tmp.CadObject as DimensionPlaceholder;
          switch (placeholder.flags) {
            case DimensionType.Linear:
              tmp.SetDimensionObject(new DimensionLinear());
              map.subClasses.set(DxfSubclassMarker.AlignedDimension, DxfClassMap.Create(DimensionAligned));
              map.subClasses.set(DxfSubclassMarker.LinearDimension, DxfClassMap.Create(DimensionLinear));
              break;
            case DimensionType.Aligned:
              tmp.SetDimensionObject(new DimensionAligned());
              map.subClasses.set(DxfSubclassMarker.AlignedDimension, DxfClassMap.Create(DimensionAligned));
              break;
            case DimensionType.Angular:
              tmp.SetDimensionObject(new DimensionAngular2Line());
              map.subClasses.set(DxfSubclassMarker.Angular2LineDimension, DxfClassMap.Create(DimensionAngular2Line));
              break;
            case DimensionType.Diameter:
              tmp.SetDimensionObject(new DimensionDiameter());
              map.subClasses.set(DxfSubclassMarker.DiametricDimension, DxfClassMap.Create(DimensionDiameter));
              break;
            case DimensionType.Radius:
              tmp.SetDimensionObject(new DimensionRadius());
              map.subClasses.set(DxfSubclassMarker.RadialDimension, DxfClassMap.Create(DimensionRadius));
              break;
            case DimensionType.Angular3Point:
              tmp.SetDimensionObject(new DimensionAngular3Pt());
              map.subClasses.set(DxfSubclassMarker.Angular3PointDimension, DxfClassMap.Create(DimensionAngular3Pt));
              break;
            case DimensionType.Ordinate:
            case DimensionType.OrdinateTypeX:
            case DimensionType.Ordinate | DimensionType.OrdinateTypeX:
              tmp.SetDimensionObject(new DimensionOrdinate());
              map.subClasses.set(DxfSubclassMarker.OrdinateDimension, DxfClassMap.Create(DimensionOrdinate));
              break;
            case DimensionType.BlockReference:
            case DimensionType.TextUserDefinedLocation:
            default:
              break;
          }
        }
        return true;
      }
      case 42:
        return true;
      case 73:
      case 74:
      case 75:
      case 90:
      case 361:
        return true;
      case 100:
        switch (this._reader.ValueAsString as string) {
          case DxfSubclassMarker.Dimension:
            return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(DxfSubclassMarker.Dimension)!);
          case DxfSubclassMarker.AlignedDimension:
            tmp.SetDimensionObject(new DimensionAligned());
            map.subClasses.set(this._reader.ValueAsString, DxfClassMap.Create(DimensionAligned));
            return true;
          case DxfSubclassMarker.DiametricDimension:
            tmp.SetDimensionObject(new DimensionDiameter());
            map.subClasses.set(this._reader.ValueAsString, DxfClassMap.Create(DimensionDiameter));
            return true;
          case DxfSubclassMarker.Angular2LineDimension:
            tmp.SetDimensionObject(new DimensionAngular2Line());
            map.subClasses.set(this._reader.ValueAsString, DxfClassMap.Create(DimensionAngular2Line));
            return true;
          case DxfSubclassMarker.Angular3PointDimension:
            tmp.SetDimensionObject(new DimensionAngular3Pt());
            map.subClasses.set(this._reader.ValueAsString, DxfClassMap.Create(DimensionAngular3Pt));
            return true;
          case DxfSubclassMarker.RadialDimension:
            tmp.SetDimensionObject(new DimensionRadius());
            map.subClasses.set(this._reader.ValueAsString, DxfClassMap.Create(DimensionRadius));
            return true;
          case DxfSubclassMarker.OrdinateDimension:
            tmp.SetDimensionObject(new DimensionOrdinate());
            map.subClasses.set(this._reader.ValueAsString, DxfClassMap.Create(DimensionOrdinate));
            return true;
          case DxfSubclassMarker.LinearDimension:
            return true;
          default:
            return false;
        }
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(tmp.CadObject.subclassMarker)!);
    }
  }

  protected readHatch(template: CadEntityTemplate, map: DxfMap, subclass?: string): boolean {
    const tmp = template as CadHatchTemplate;
    const hatch = tmp.CadObject as Hatch;

    let seedPoint = new XY();

    switch (this._reader.Code as number) {
      case 2:
        hatch.pattern.name = this._reader.ValueAsString;
        return true;
      case 10:
        seedPoint.X = this._reader.ValueAsDouble;
        hatch.seedPoints.push(seedPoint);
        return true;
      case 20: {
        seedPoint = hatch.seedPoints[hatch.seedPoints.length - 1];
        seedPoint.Y = this._reader.ValueAsDouble;
        hatch.seedPoints[hatch.seedPoints.length - 1] = seedPoint;
        return true;
      }
      case 30:
        hatch.elevation = this._reader.ValueAsDouble;
        return true;
      case 53:
        hatch.patternAngle = this._reader.ValueAsAngle;
        return true;
      case 90:
        return true;
      case 75:
        return true;
      case 78:
        this.readPattern(hatch.pattern, this._reader.ValueAsInt);
        this.lockPointer = true;
        return true;
      case 91:
        this.readLoops(tmp, this._reader.ValueAsInt);
        this.lockPointer = true;
        return true;
      case 98:
        return true;
      case 450:
        hatch.gradientColor.enabled = this._reader.ValueAsBool;
        return true;
      case 451:
        hatch.gradientColor.reserved = this._reader.ValueAsInt;
        return true;
      case 452:
        hatch.gradientColor.isSingleColorGradient = this._reader.ValueAsBool;
        return true;
      case 453:
        return true;
      case 460:
        hatch.gradientColor.angle = this._reader.ValueAsDouble;
        return true;
      case 461:
        hatch.gradientColor.shift = this._reader.ValueAsDouble;
        return true;
      case 462:
        hatch.gradientColor.colorTint = this._reader.ValueAsDouble;
        return true;
      case 463: {
        const gradient = new GradientColor();
        gradient.value = this._reader.ValueAsDouble;
        hatch.gradientColor.colors.push(gradient);
        return true;
      }
      case 63: {
        const colorByIndex = hatch.gradientColor.colors[hatch.gradientColor.colors.length - 1];
        if (colorByIndex) {
          colorByIndex.color = new Color(this._reader.ValueAsUShort);
        }
        return true;
      }
      case 421: {
        // const colorByRgb = hatch.GradientColor.Colors[hatch.GradientColor.Colors.length - 1];
        // TODO: Hatch assign color by true color
        // TODO: Is always duplicated by 63, is it needed??
        return true;
      }
      case 470:
        hatch.gradientColor.name = this._reader.ValueAsString;
        return true;
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(template.CadObject.subclassMarker)!);
    }
  }

  private readInsert(template: CadEntityTemplate, map: DxfMap, subclass?: string): boolean {
    const tmp = template as CadInsertTemplate;

    switch (this._reader.Code as number) {
      case 2:
        tmp.BlockName = this._reader.ValueAsString;
        return true;
      case 100:
        return true;
      case 66:
        return true;
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(DxfSubclassMarker.Insert)!);
    }
  }

  private readPolyline(): CadEntityTemplate | null {
    if (this._builder.Version === ACadVersion.Unknown
      || this._builder.Version === ACadVersion.AC1009) {
      return this.readLegacyPolyline();
    }

    const template = new CadPolyLineTemplate();
    this.readEntityCodes(template, this.readPolylineCodes.bind(this), Entity);

    if (template.CadObject.objectType === ObjectType.INVALID) {
      this._builder.Notify(`[${DxfFileToken.EntityPolyline}] Subclass not found, entity discarded`, NotificationType.Warning);
      return null;
    }

    while (this._reader.Code === 0 && this._reader.ValueAsString === DxfFileToken.EntityVertex) {
      const vertexTemplate = this.readEntityCodes(new CadVertexTemplate(), this.readVertex.bind(this), Entity);

      if (vertexTemplate.OwnerHandle === null) {
        vertexTemplate.OwnerHandle = template.CadObject.handle;
      }

      template.OwnedObjectsHandlers.add(vertexTemplate.CadObject.handle);
      this._builder.AddTemplate(vertexTemplate);
    }

    while (this._reader.Code === 0 && this._reader.ValueAsString === DxfFileToken.EndSequence) {
      const seqend = new Seqend();
      const seqendTemplate = new CadEntityTemplate(seqend);
      this.readEntityCodes(seqendTemplate, this.readEntitySubclassMap.bind(this), Seqend);

      if (seqendTemplate.OwnerHandle === null) {
        seqendTemplate.OwnerHandle = template.CadObject.handle;
      }

      template.OwnedObjectsHandlers.add(seqendTemplate.CadObject.handle);
      this._builder.AddTemplate(seqendTemplate);
    }

    return template;
  }

  private readLegacyPolyline(): CadEntityTemplate {
    const polyline = new Polyline2D();
    const template = new CadPolyLineTemplate(polyline as any);
    this.readEntityCodes(template, this.readPolylineCodes.bind(this), Polyline2D);

    while (this._reader.Code === 0 && this._reader.ValueAsString === DxfFileToken.EntityVertex) {
      const v = new Vertex2D();
      const vertexTemplate = new CadVertexTemplate(v);
      this.readEntityCodes(vertexTemplate, this.readVertex.bind(this), Vertex2D);

      if (vertexTemplate.Vertex.handle === 0) {
        polyline.vertices.push(v);
      } else {
        template.OwnedObjectsHandlers.add(vertexTemplate.Vertex.handle);
        this._builder.AddTemplate(vertexTemplate);
      }
    }

    while (this._reader.Code === 0 && this._reader.ValueAsString === DxfFileToken.EndSequence) {
      const seqend = new Seqend();
      const seqendTemplate = new CadEntityTemplate(seqend);
      this.readEntityCodes(seqendTemplate, this.readEntitySubclassMap.bind(this), Seqend);

      polyline.vertices.Seqend = seqend;
    }

    return template;
  }

  private readPolylineCodes(template: CadEntityTemplate, map: DxfMap, subclass?: string): boolean {
    const tmp = template as CadPolyLineTemplate;

    switch (this._reader.Code as number) {
      case 10:
      case 20:
      case 66:
        return true;
      case 100:
        switch (this._reader.ValueAsString as string) {
          case DxfSubclassMarker.Polyline:
            tmp.SetPolyLineObject(new Polyline2D());
            map.subClasses.set(DxfSubclassMarker.Polyline, DxfClassMap.Create(Polyline2D));
            return true;
          case DxfSubclassMarker.Polyline3d:
            tmp.SetPolyLineObject(new Polyline3D());
            map.subClasses.set(DxfSubclassMarker.Polyline3d, DxfClassMap.Create(Polyline3D));
            return true;
          case DxfSubclassMarker.PolyfaceMesh:
            tmp.SetPolyLineObject(new PolyfaceMesh());
            map.subClasses.set(DxfSubclassMarker.PolyfaceMesh, DxfClassMap.Create(PolyfaceMesh));
            return true;
          case DxfSubclassMarker.PolygonMesh:
            tmp.SetPolyLineObject(new PolygonMesh());
            map.subClasses.set(DxfSubclassMarker.PolygonMesh, DxfClassMap.Create(PolygonMesh));
            return true;
          default:
            return false;
        }
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(tmp.CadObject.subclassMarker)!);
    }
  }

  private readLeader(template: CadEntityTemplate, map: DxfMap, subclass?: string): boolean {
    const tmp = template as CadLeaderTemplate;

    switch (this._reader.Code as number) {
      case 3:
        tmp.DIMSTYLEName = this._reader.ValueAsString;
        return true;
      case 10:
        tmp.CadObject.vertices.push(new XYZ(this._reader.ValueAsDouble, 0, 0));
        return true;
      case 20: {
        const y = tmp.CadObject.vertices[tmp.CadObject.vertices.length - 1];
        y.y = this._reader.ValueAsDouble;
        tmp.CadObject.vertices[tmp.CadObject.vertices.length - 1] = y;
        return true;
      }
      case 30: {
        const z = tmp.CadObject.vertices[tmp.CadObject.vertices.length - 1];
        z.z = this._reader.ValueAsDouble;
        tmp.CadObject.vertices[tmp.CadObject.vertices.length - 1] = z;
        return true;
      }
      case 340:
        tmp.AnnotationHandle = this._reader.ValueAsHandle;
        return true;
      case 75:
      case 76:
        return true;
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(tmp.CadObject.subclassMarker)!);
    }
  }

  private readLwPolyline(template: CadEntityTemplate, map: DxfMap, subclass?: string): boolean {
    const tmp = template as CadEntityTemplate;
    const lwPoly = tmp.CadObject as LwPolyline;

    const last = lwPoly.vertices[lwPoly.vertices.length - 1] ?? null;

    switch (this._reader.Code as number) {
      case 10:
        lwPoly.vertices.push(new LwPolylineVertex(new XY(this._reader.ValueAsDouble, 0)));
        return true;
      case 20:
        if (last !== null) {
          last.location = new XY(last.location.x, this._reader.ValueAsDouble);
        }
        return true;
      case 40:
        if (last !== null) {
          last.startWidth = this._reader.ValueAsDouble;
        }
        return true;
      case 41:
        if (last !== null) {
          last.endWidth = this._reader.ValueAsDouble;
        }
        return true;
      case 42:
        if (last !== null) {
          last.bulge = this._reader.ValueAsDouble;
        }
        return true;
      case 50:
        if (last !== null) {
          last.curveTangent = this._reader.ValueAsDouble;
        }
        return true;
      case 66:
      case 90:
        return true;
      case 91:
        if (last !== null) {
          last.id = this._reader.ValueAsInt;
        }
        return true;
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(tmp.CadObject.subclassMarker)!);
    }
  }

  private readMesh(template: CadEntityTemplate, map: DxfMap, subclass?: string): boolean {
    const tmp = template as CadMeshTemplate;

    switch (this._reader.Code as number) {
      case 100:
        if (this._reader.ValueAsString.toUpperCase() === DxfSubclassMarker.Mesh.toUpperCase()) {
          tmp.SubclassMarker = true;
        }
        return true;
      case 90:
        return true;
      case 92: {
        if (!tmp.SubclassMarker) {
          return false;
        }

        const nvertices = this._reader.ValueAsInt;
        for (let i = 0; i < nvertices; i++) {
          this._reader.ReadNext();
          const x = this._reader.ValueAsDouble;
          this._reader.ReadNext();
          const y = this._reader.ValueAsDouble;
          this._reader.ReadNext();
          const z = this._reader.ValueAsDouble;
          tmp.CadObject.vertices.push(new XYZ(x, y, z));
        }
        return true;
      }
      case 93: {
        const size = this._reader.ValueAsInt;
        this._reader.ReadNext();

        let indexes = 0;
        for (let i = 0; i < size; i += indexes + 1) {
          indexes = this._reader.ValueAsInt;
          this._reader.ReadNext();

          const face: number[] = new Array(indexes);
          for (let j = 0; j < indexes; j++) {
            face[j] = this._reader.ValueAsInt;

            if ((i + j + 2) < size) {
              this._reader.ReadNext();
            }
          }

          tmp.CadObject.faces.push(face);
        }

        // Debug.Assert(this._reader.Code == 90);

        return true;
      }
      case 94: {
        const numEdges = this._reader.ValueAsInt;
        this._reader.ReadNext();
        for (let i = 0; i < numEdges; i++) {
          const edge = new MeshEdge(0, 0);

          edge.start = this._reader.ValueAsInt;
          this._reader.ReadNext();
          edge.end = this._reader.ValueAsInt;

          if (i < numEdges - 1) {
            this._reader.ReadNext();
          }

          tmp.CadObject.edges.push(edge);
        }

        // Debug.Assert(this._reader.Code == 90);

        return true;
      }
      case 95: {
        this._reader.ReadNext();
        for (let i = 0; i < tmp.CadObject.edges.length; i++) {
          const edge = tmp.CadObject.edges[i];
          edge.crease = this._reader.ValueAsDouble;

          tmp.CadObject.edges[i] = edge;

          if (i < tmp.CadObject.edges.length - 1) {
            this._reader.ReadNext();
          }
        }

        // Debug.Assert(this._reader.Code == 140);

        return true;
      }
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(tmp.CadObject.subclassMarker)!);
    }
  }

  private readMLine(template: CadEntityTemplate, map: DxfMap, subclass?: string): boolean {
    const tmp = template as CadMLineTemplate;

    switch (this._reader.Code as number) {
      case 2:
        tmp.MLineStyleName = this._reader.ValueAsString;
        return true;
      case 72:
        tmp.NVertex = this._reader.ValueAsInt;
        return true;
      case 73:
        tmp.NElements = this._reader.ValueAsInt;
        return true;
      case 340:
        tmp.MLineStyleHandle = this._reader.ValueAsHandle;
        return true;
      default:
        if (!tmp.TryReadVertex(this._reader.Code, this._reader.Value)) {
          return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(tmp.CadObject.subclassMarker)!);
        }
        return true;
    }
  }

  private readMLeader(template: CadEntityTemplate, map: DxfMap, subclass?: string): boolean {
    const tmp = template as CadMLeaderTemplate;

    switch (this._reader.Code as number) {
      case 270:
        return true;
      case 300:
        this.readMultiLeaderObjectContextData(tmp.CadMLeaderAnnotContextTemplate);
        return true;
      case 340:
        tmp.LeaderStyleHandle = this._reader.ValueAsHandle;
        return true;
      case 341:
        tmp.LeaderLineTypeHandle = this._reader.ValueAsHandle;
        return true;
      case 343:
        tmp.MTextStyleHandle = this._reader.ValueAsHandle;
        return true;
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(tmp.CadObject.subclassMarker)!);
    }
  }

  private readMultiLeaderObjectContextData(template: CadMLeaderAnnotContextTemplate): void {
    this._reader.ReadNext();

    const map = DxfClassMap.Create(MultiLeaderObjectContextData);
    const contextData = template.CadObject as MultiLeaderObjectContextData;

    let end = false;
    while (this._reader.DxfCode !== DxfCode.Start) {
      switch (this._reader.Code as number) {
        case 301:
          if (this._reader.ValueAsString === '}') {
            end = true;
          }
          break;
        case 302:
          if (this._reader.ValueAsString === 'LEADER{') {
            contextData.leaderRoots.push(this.readMultiLeaderLeader(template));
          }
          break;
        case 340:
          template.TextStyleHandle = this._reader.ValueAsHandle;
          break;
        default:
          if (!this.tryAssignCurrentValue(contextData, map)) {
            this._builder.Notify(`[AcDbMLeaderObjectContextData] Unhandled dxf code ${this._reader.Code} with value ${this._reader.ValueAsString}`, NotificationType.None);
          }
          break;
      }

      if (end) {
        break;
      }

      this._reader.ReadNext();
    }
  }

  private readMultiLeaderLeader(template: CadMLeaderAnnotContextTemplate): LeaderRoot {
    const root = new LeaderRoot();
    const map = DxfClassMap.Create(root.constructor, 'LeaderRoot');

    this._reader.ReadNext();

    let end = false;
    while (this._reader.DxfCode !== DxfCode.Start) {
      switch (this._reader.Code as number) {
        case 303:
          if (this._reader.ValueAsString === '}') {
            end = true;
          }
          break;
        case 304:
          if (this._reader.ValueAsString === 'LEADER_LINE{') {
            const lineTemplate = new CadMLeaderAnnotContextTemplate.LeaderLineTemplate();
            template.leaderLineTemplates.push(lineTemplate);
            root.lines.push(this.readMultiLeaderLine(lineTemplate));
          }
          break;
        default:
          if (!this.tryAssignCurrentValue(root, map)) {
            this._builder.Notify(`[LeaderRoot] Unhandled dxf code ${this._reader.Code} with value ${this._reader.ValueAsString}`, NotificationType.None);
          }
          break;
      }

      if (end) {
        break;
      }

      this._reader.ReadNext();
    }

    return root;
  }

  private readMultiLeaderLine(template: CadMLeaderAnnotContextTemplate.LeaderLineTemplate): LeaderLine {
    const line = template.LeaderLine;
    const map = DxfClassMap.Create(line.constructor, 'LeaderLine');

    this._reader.ReadNext();

    let end = false;
    while (this._reader.DxfCode !== DxfCode.Start) {
      switch (this._reader.Code as number) {
        case 10: {
          const pt = new XYZ(this._reader.ValueAsDouble, 0, 0);
          line.points.push(pt);
          break;
        }
        case 20: {
          const pt = line.points[line.points.length - 1];
          pt.Y = this._reader.ValueAsDouble;
          line.points[line.points.length - 1] = pt;
          break;
        }
        case 30: {
          const pt = line.points[line.points.length - 1];
          pt.Z = this._reader.ValueAsDouble;
          line.points[line.points.length - 1] = pt;
          break;
        }
        case 305:
          if (this._reader.ValueAsString === '}') {
            end = true;
          }
          break;
        default:
          if (!this.tryAssignCurrentValue(line, map)) {
            this._builder.Notify(`[LeaderLine] Unhandled dxf code ${this._reader.Code} with value ${this._reader.ValueAsString}`, NotificationType.None);
          }
          break;
      }

      if (end) {
        break;
      }

      this._reader.ReadNext();
    }

    return line;
  }

  private readShape(template: CadEntityTemplate, map: DxfMap, subclass?: string): boolean {
    const tmp = template as CadShapeTemplate;

    switch (this._reader.Code as number) {
      case 2:
        tmp.ShapeFileName = this._reader.ValueAsString;
        return true;
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(tmp.CadObject.subclassMarker)!);
    }
  }

  private readWipeoutBase(template: CadEntityTemplate, map: DxfMap, subclass?: string): boolean {
    const tmp = template as CadWipeoutBaseTemplate;
    const wipeout = tmp.CadObject as CadWipeoutBase;

    switch (this._reader.Code as number) {
      case 91: {
        const nvertices = this._reader.ValueAsInt;
        for (let i = 0; i < nvertices; i++) {
          this._reader.ReadNext();
          const x = this._reader.ValueAsDouble;
          this._reader.ReadNext();
          const y = this._reader.ValueAsDouble;

          wipeout.clipBoundaryVertices.push(new XY(x, y));
        }

        this._reader.ReadNext();

        return this.checkEntityEnd(template, map, subclass, this.readWipeoutBase.bind(this));
      }
      case 340:
        tmp.ImgDefHandle = this._reader.ValueAsHandle;
        return true;
      case 360:
        tmp.ImgReactorHandle = this._reader.ValueAsHandle;
        return true;
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(tmp.CadObject.subclassMarker)!);
    }
  }

  private readOle2Frame(template: CadEntityTemplate, map: DxfMap, subclass?: string): boolean {
    const tmp = template as CadOle2FrameTemplate;

    switch (this._reader.Code as number) {
      case 1:
      case 90:
      case 73:
        return true;
      case 310:
        tmp.Chunks.push(this._reader.ValueAsBinaryChunk);
        return true;
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(tmp.CadObject.subclassMarker)!);
    }
  }

  private readModelerGeometry(template: CadEntityTemplate, map: DxfMap, subclass?: string): boolean {
    const tmp = template as CadSolid3DTemplate;
    const mapName = !subclass ? template.CadObject.subclassMarker : subclass;
    const geometry = template.CadObject as ModelerGeometry;

    switch (this._reader.Code as number) {
      case 1:
      case 3:
        geometry.proprietaryData += this._reader.ValueAsString + '\n';
        return true;
      case 2:
        geometry.guid = this._reader.ValueAsString;
        return true;
      case 290:
        return true;
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(mapName)!);
    }
  }

  private readSolid3d(template: CadEntityTemplate, map: DxfMap, subclass?: string): boolean {
    const tmp = template as CadSolid3DTemplate;

    switch (this._reader.Code as number) {
      case 350:
        tmp.HistoryHandle = this._reader.ValueAsHandle;
        return true;
      default:
        return this.readModelerGeometry(template, map, DxfSubclassMarker.ModelerGeometry);
    }
  }

  private readSpline(template: CadEntityTemplate, map: DxfMap, subclass?: string): boolean {
    const tmp = template as CadSplineTemplate;

    let controlPoint: XYZ;
    let fitPoint: XYZ;

    switch (this._reader.Code as number) {
      case 10:
        controlPoint = new XYZ(this._reader.ValueAsDouble, 0, 0);
        tmp.CadObject.controlPoints.push(controlPoint);
        return true;
      case 20:
        controlPoint = tmp.CadObject.controlPoints[tmp.CadObject.controlPoints.length - 1];
        controlPoint.Y = this._reader.ValueAsDouble;
        tmp.CadObject.controlPoints[tmp.CadObject.controlPoints.length - 1] = controlPoint;
        return true;
      case 30:
        controlPoint = tmp.CadObject.controlPoints[tmp.CadObject.controlPoints.length - 1];
        controlPoint.Z = this._reader.ValueAsDouble;
        tmp.CadObject.controlPoints[tmp.CadObject.controlPoints.length - 1] = controlPoint;
        return true;
      case 11:
        fitPoint = new XYZ(this._reader.ValueAsDouble, 0, 0);
        tmp.CadObject.fitPoints.push(fitPoint);
        return true;
      case 21:
        fitPoint = tmp.CadObject.fitPoints[tmp.CadObject.fitPoints.length - 1];
        fitPoint.Y = this._reader.ValueAsDouble;
        tmp.CadObject.fitPoints[tmp.CadObject.fitPoints.length - 1] = fitPoint;
        return true;
      case 31:
        fitPoint = tmp.CadObject.fitPoints[tmp.CadObject.fitPoints.length - 1];
        fitPoint.Z = this._reader.ValueAsDouble;
        tmp.CadObject.fitPoints[tmp.CadObject.fitPoints.length - 1] = fitPoint;
        return true;
      case 40:
        tmp.CadObject.knots.push(this._reader.ValueAsDouble);
        return true;
      case 41:
        tmp.CadObject.weights.push(this._reader.ValueAsDouble);
        return true;
      case 72:
      case 73:
      case 74:
        return true;
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(tmp.CadObject.subclassMarker)!);
    }
  }

  private readUnderlayEntity(template: CadEntityTemplate, map: DxfMap, subclass?: string): boolean {
    const tmp = template as CadUnderlayTemplate;

    switch (this._reader.Code as number) {
      case 340:
        tmp.DefinitionHandle = this._reader.ValueAsHandle;
        return true;
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(tmp.CadObject.subclassMarker)!);
    }
  }

  private readVertex(template: CadEntityTemplate, map: DxfMap, subclass?: string): boolean {
    const tmp = template as CadVertexTemplate;

    switch (this._reader.Code as number) {
      case 100:
        switch (this._reader.ValueAsString as string) {
          case DxfSubclassMarker.Vertex:
            return true;
          case DxfSubclassMarker.PolylineVertex:
            tmp.SetVertexObject(new Vertex2D());
            map.subClasses.set(DxfSubclassMarker.PolylineVertex, DxfClassMap.Create(Vertex2D));
            return true;
          case DxfSubclassMarker.Polyline3dVertex:
            tmp.SetVertexObject(new Vertex3D());
            map.subClasses.set(DxfSubclassMarker.Polyline3dVertex, DxfClassMap.Create(Vertex3D));
            return true;
          case DxfSubclassMarker.PolyfaceMeshVertex:
            tmp.SetVertexObject(new VertexFaceMesh());
            map.subClasses.set(DxfSubclassMarker.PolyfaceMeshVertex, DxfClassMap.Create(VertexFaceMesh));
            return true;
          case DxfSubclassMarker.PolyfaceMeshFace:
            tmp.SetVertexObject(new VertexFaceRecord());
            map.subClasses.set(DxfSubclassMarker.PolyfaceMeshFace, DxfClassMap.Create(VertexFaceRecord));
            return true;
          case DxfSubclassMarker.PolygonMeshVertex:
            tmp.SetVertexObject(new PolygonMeshVertex());
            map.subClasses.set(DxfSubclassMarker.PolygonMeshVertex, DxfClassMap.Create(PolygonMeshVertex));
            return true;
          default:
            return false;
        }
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(tmp.CadObject.subclassMarker)!);
    }
  }

  private readViewport(template: CadEntityTemplate, map: DxfMap, subclass?: string): boolean {
    const tmp = template as CadViewportTemplate;

    switch (this._reader.Code as number) {
      case 67:
      case 68:
        return true;
      case 69:
        tmp.ViewportId = this._reader.ValueAsShort;
        return true;
      case 331:
        tmp.FrozenLayerHandles.add(this._reader.ValueAsHandle);
        return true;
      case 348:
        tmp.VisualStyleHandle = this._reader.ValueAsHandle;
        return true;
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(DxfSubclassMarker.Viewport)!);
    }
  }

  private readEntitySubclassMap(template: CadEntityTemplate, map: DxfMap, subclass?: string): boolean {
    const mapName = !subclass ? template.CadObject.subclassMarker : subclass;

    switch (this._reader.Code as number) {
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(mapName)!);
    }
  }

  protected readExtendedData(edata: Map<string, ExtendedDataRecord[]>): void {
    const records: ExtendedDataRecord[] = [];
    edata.set(this._reader.ValueAsString, records);

    this._reader.ReadNext();

    while (this._reader.DxfCode >= DxfCode.ExtendedDataAsciiString) {
      if (this._reader.DxfCode === DxfCode.ExtendedDataRegAppName) {
        this.readExtendedData(edata);
        break;
      }

      let record: ExtendedDataRecord | null = null;
      let x = 0;
      let y = 0;
      let z = 0;

      switch (this._reader.DxfCode) {
        case DxfCode.ExtendedDataAsciiString:
          record = new ExtendedDataString(this._reader.ValueAsString);
          break;
        case DxfCode.ExtendedDataControlString:
          record = new ExtendedDataControlString(this._reader.ValueAsString === '}');
          break;
        case DxfCode.ExtendedDataLayerName: {
          const layer = this._builder.Layers.get(this._reader.ValueAsString);
          if (layer) {
            record = new ExtendedDataLayer(layer.handle);
          } else {
            this._builder.Notify(`[XData] Could not found the linked Layer ${this._reader.ValueAsString}.`, NotificationType.Warning);
          }
          break;
        }
        case DxfCode.ExtendedDataBinaryChunk:
          record = new ExtendedDataBinaryChunk(this._reader.ValueAsBinaryChunk);
          break;
        case DxfCode.ExtendedDataHandle:
          record = new ExtendedDataHandle(this._reader.ValueAsHandle);
          break;
        case DxfCode.ExtendedDataXCoordinate:
          x = this._reader.ValueAsDouble;
          this._reader.ReadNext();
          y = this._reader.ValueAsDouble;
          this._reader.ReadNext();
          z = this._reader.ValueAsDouble;
          record = new ExtendedDataCoordinate(new XYZ(x, y, z));
          break;
        case DxfCode.ExtendedDataWorldXCoordinate:
          x = this._reader.ValueAsDouble;
          this._reader.ReadNext();
          y = this._reader.ValueAsDouble;
          this._reader.ReadNext();
          z = this._reader.ValueAsDouble;
          record = new ExtendedDataWorldCoordinate(new XYZ(x, y, z));
          break;
        case DxfCode.ExtendedDataWorldXDisp:
          x = this._reader.ValueAsDouble;
          this._reader.ReadNext();
          y = this._reader.ValueAsDouble;
          this._reader.ReadNext();
          z = this._reader.ValueAsDouble;
          record = new ExtendedDataDisplacement(new XYZ(x, y, z));
          break;
        case DxfCode.ExtendedDataWorldXDir:
          x = this._reader.ValueAsDouble;
          this._reader.ReadNext();
          y = this._reader.ValueAsDouble;
          this._reader.ReadNext();
          z = this._reader.ValueAsDouble;
          record = new ExtendedDataDirection(new XYZ(x, y, z));
          break;
        case DxfCode.ExtendedDataReal:
          record = new ExtendedDataReal(this._reader.ValueAsDouble);
          break;
        case DxfCode.ExtendedDataDist:
          record = new ExtendedDataDistance(this._reader.ValueAsDouble);
          break;
        case DxfCode.ExtendedDataScale:
          record = new ExtendedDataScale(this._reader.ValueAsDouble);
          break;
        case DxfCode.ExtendedDataInteger16:
          record = new ExtendedDataInteger16(this._reader.ValueAsShort);
          break;
        case DxfCode.ExtendedDataInteger32:
          record = new ExtendedDataInteger32(this._reader.ValueAsInt);
          break;
        default:
          this._builder.Notify(`Unknown code for extended data: ${this._reader.DxfCode}`, NotificationType.Warning);
          break;
      }

      if (record !== null) {
        records.push(record);
      }

      this._reader.ReadNext();
    }
  }

  private readPattern(pattern: HatchPattern, nlines: number): void {
    this._reader.ReadNext();

    for (let i = 0; i < nlines; i++) {
      const line = new HatchPatternLine();
      let basePoint = new XY();
      let offset = new XY();

      let end = false;
      const codes = new Set<number>();

      while (!end) {
        if (codes.has(this._reader.Code)) {
          break;
        } else {
          codes.add(this._reader.Code);
        }

        switch (this._reader.Code as number) {
          case 53:
            line.angle = this._reader.ValueAsAngle;
            break;
          case 43:
            basePoint.X = this._reader.ValueAsDouble;
            break;
          case 44:
            basePoint.Y = this._reader.ValueAsDouble;
            line.basePoint = basePoint;
            break;
          case 45:
            offset.X = this._reader.ValueAsDouble;
            line.offset = offset;
            break;
          case 46:
            offset.Y = this._reader.ValueAsDouble;
            line.offset = offset;
            break;
          case 79: {
            const ndash = this._reader.ValueAsInt;
            for (let j = 0; j < ndash; j++) {
              this._reader.ReadNext();
              line.dashLengths.push(this._reader.ValueAsDouble);
            }
            break;
          }
          case 49:
            line.dashLengths.push(this._reader.ValueAsDouble);
            break;
          default:
            end = true;
            break;
        }
        this._reader.ReadNext();
      }

      pattern.lines.push(line);
    }
  }

  private readLoops(template: CadHatchTemplate, count: number): void {
    if (this._reader.Code === 91) {
      this._reader.ReadNext();
    }

    for (let i = 0; i < count; i++) {
      if (this._reader.Code !== 92) {
        this._builder.Notify(`Boundary path should start with code 92 but was ${this._reader.Code}`);
        break;
      }

      const path = this.readLoop();
      if (path !== null) {
        template.PathTemplates.push(path);
      }
    }
  }

  private readLoop(): CadHatchTemplate.CadBoundaryPathTemplate | null {
    const template = new CadHatchTemplate.CadBoundaryPathTemplate();
    const flags = this._reader.ValueAsInt as BoundaryPathFlags;
    template.Path.flags = flags;

    if ((flags & BoundaryPathFlags.Polyline) !== 0) {
      const pl = this.readPolylineBoundary();
      if (pl) {
        template.Path.edges.push(pl);
      }
    } else {
      this._reader.ReadNext();

      if (this._reader.Code !== 93) {
        this._builder.Notify(`Edge Boundary path should start with code 93 but was ${this._reader.Code}`);
        return null;
      }

      const edges = this._reader.ValueAsInt;
      this._reader.ReadNext();

      for (let i = 0; i < edges; i++) {
        const edge = this.readEdge();
        if (edge !== null) {
          template.Path.edges.push(edge);
        }
      }
    }

    let end = false;
    while (!end) {
      switch (this._reader.Code as number) {
        case 97:
          break;
        case 330:
          template.Handles.add(this._reader.ValueAsHandle);
          break;
        default:
          end = true;
          continue;
      }

      this._reader.ReadNext();
    }

    return template;
  }

  private readPolylineBoundary(): HatchBoundaryPathPolyline | null {
    const boundary = new HatchBoundaryPathPolyline();

    this._reader.ReadNext();

    if (this._reader.Code !== 72) {
      this._builder.Notify(`Polyline Boundary path should start with code 72 but was ${this._reader.Code}`);
      return null;
    }

    let end = false;
    let hasBulge = false;
    while (!end) {
      switch (this._reader.Code as number) {
        case 72:
          hasBulge = this._reader.ValueAsBool;
          break;
        case 73:
          boundary.isClosed = this._reader.ValueAsBool;
          break;
        case 93: {
          const nvertices = this._reader.ValueAsInt;
          this._reader.ReadNext();

          for (let i = 0; i < nvertices; i++) {
            let bulge = 0.0;

            const x = this._reader.ValueAsDouble;
            this._reader.ReadNext();
            const y = this._reader.ValueAsDouble;
            this._reader.ReadNext();

            if (hasBulge) {
              bulge = this._reader.ValueAsDouble;
              this._reader.ReadNext();
            }

            boundary.vertices.push(new XYZ(x, y, bulge));
          }
          continue;
        }
        default:
          end = true;
          continue;
      }

      this._reader.ReadNext();
    }

    return boundary;
  }

  private readEdge(): HatchBoundaryPathEdge | null {
    if (this._reader.Code !== 72) {
      this._builder.Notify(`Edge Boundary path should define the type with code 72 but was ${this._reader.Code}`);
      return null;
    }

    const type = this._reader.ValueAsInt as EdgeType;
    this._reader.ReadNext();

    switch (type) {
      case EdgeType.Line: {
        const line = new HatchBoundaryPathLine();
        while (true) {
          switch (this._reader.Code as number) {
            case 10:
              line.start = new XY(this._reader.ValueAsDouble, line.start.Y);
              break;
            case 20:
              line.start = new XY(line.start.X, this._reader.ValueAsDouble);
              break;
            case 11:
              line.end = new XY(this._reader.ValueAsDouble, line.end.Y);
              break;
            case 21:
              line.end = new XY(line.end.X, this._reader.ValueAsDouble);
              break;
            default:
              return line;
          }
          this._reader.ReadNext();
        }
      }
      case EdgeType.CircularArc: {
        const arc = new HatchBoundaryPathArc();
        while (true) {
          switch (this._reader.Code as number) {
            case 10:
              arc.center = new XY(this._reader.ValueAsDouble, arc.center.Y);
              break;
            case 20:
              arc.center = new XY(arc.center.X, this._reader.ValueAsDouble);
              break;
            case 40:
              arc.radius = this._reader.ValueAsDouble;
              break;
            case 50:
              arc.startAngle = MathHelper.DegToRad(this._reader.ValueAsDouble);
              break;
            case 51:
              arc.endAngle = MathHelper.DegToRad(this._reader.ValueAsDouble);
              break;
            case 73:
              arc.counterClockWise = this._reader.ValueAsBool;
              break;
            default:
              return arc;
          }
          this._reader.ReadNext();
        }
      }
      case EdgeType.EllipticArc: {
        const ellipse = new HatchBoundaryPathEllipse();
        while (true) {
          switch (this._reader.Code as number) {
            case 10:
              ellipse.center = new XY(this._reader.ValueAsDouble, ellipse.center.Y);
              break;
            case 20:
              ellipse.center = new XY(ellipse.center.X, this._reader.ValueAsDouble);
              break;
            case 11:
              ellipse.majorAxisEndPoint = new XY(this._reader.ValueAsDouble, ellipse.center.Y);
              break;
            case 21:
              ellipse.majorAxisEndPoint = new XY(ellipse.center.X, this._reader.ValueAsDouble);
              break;
            case 40:
              ellipse.minorToMajorRatio = this._reader.ValueAsDouble;
              break;
            case 50:
              ellipse.startAngle = MathHelper.DegToRad(this._reader.ValueAsDouble);
              break;
            case 51:
              ellipse.endAngle = MathHelper.DegToRad(this._reader.ValueAsDouble);
              break;
            case 73:
              ellipse.counterClockWise = this._reader.ValueAsBool;
              break;
            default:
              return ellipse;
          }
          this._reader.ReadNext();
        }
      }
      case EdgeType.Spline: {
        const spline = new HatchBoundaryPathSpline();
        let nKnots = 0;
        let nCtrlPoints = 0;
        let nFitPoints = 0;

        let controlPoint = new XYZ();
        let fitPoint = new XY();

        while (true) {
          switch (this._reader.Code as number) {
            case 10:
              controlPoint = new XYZ(this._reader.ValueAsDouble, 0, 1);
              break;
            case 20:
              controlPoint = new XYZ(controlPoint.X, this._reader.ValueAsDouble, controlPoint.Z);
              spline.controlPoints.push(controlPoint);
              break;
            case 11:
              fitPoint = new XY(this._reader.ValueAsDouble, 0);
              break;
            case 21:
              fitPoint = new XY(fitPoint.X, this._reader.ValueAsDouble);
              spline.fitPoints.push(fitPoint);
              break;
            case 42: {
              const last = spline.controlPoints[spline.controlPoints.length - 1];
              spline.controlPoints[spline.controlPoints.length - 1] = new XYZ(last.X, last.Y, this._reader.ValueAsDouble);
              break;
            }
            case 12:
              spline.startTangent = new XY(this._reader.ValueAsDouble, spline.startTangent.Y);
              break;
            case 22:
              spline.startTangent = new XY(spline.startTangent.X, this._reader.ValueAsDouble);
              break;
            case 13:
              spline.endTangent = new XY(this._reader.ValueAsDouble, spline.endTangent.Y);
              break;
            case 23:
              spline.endTangent = new XY(spline.endTangent.X, this._reader.ValueAsDouble);
              break;
            case 94:
              spline.degree = this._reader.ValueAsInt;
              break;
            case 73:
              spline.isRational = this._reader.ValueAsBool;
              break;
            case 74:
              spline.isPeriodic = this._reader.ValueAsBool;
              break;
            case 95:
              nKnots = this._reader.ValueAsInt;
              break;
            case 96:
              nCtrlPoints = this._reader.ValueAsInt;
              break;
            case 97:
              nFitPoints = this._reader.ValueAsInt;
              break;
            case 40:
              spline.knots.push(this._reader.ValueAsDouble);
              break;
            default:
              return spline;
          }
          this._reader.ReadNext();
        }
      }
    }

    return null;
  }

  private readDefinedGroups(template: CadTemplate): void;
  private readDefinedGroups(): void;
  private readDefinedGroups(template?: CadTemplate): void {
    if (template !== undefined) {
      const { xdictHandle, reactors } = this.readDefinedGroupsRaw();

      if (xdictHandle !== null) {
        template.XDictHandle = xdictHandle;
      }
      reactors.forEach(r => template.ReactorsHandles.add(r));
    }
  }

  private readDefinedGroupsRaw(): DefinedGroupsResult {
    let xdictHandle: number | null = null;
    let reactors = new Set<number>();

    switch (this._reader.ValueAsString as string) {
      case DxfFileToken.DictionaryToken:
        this._reader.ReadNext();
        xdictHandle = this._reader.ValueAsHandle;
        this._reader.ReadNext();
        // Debug.Assert(this._reader.DxfCode == DxfCode.ControlString);
        return { xdictHandle, reactors };
      case DxfFileToken.ReactorsToken:
        reactors = this.readReactors();
        break;
      case DxfFileToken.BlkRefToken:
      default:
        do {
          this._reader.ReadNext();
        } while (this._reader.DxfCode !== DxfCode.ControlString);
        return { xdictHandle, reactors };
    }

    return { xdictHandle, reactors };
  }

  private readReactors(): Set<number> {
    const reactors = new Set<number>();

    this._reader.ReadNext();

    while (this._reader.DxfCode !== DxfCode.ControlString) {
      reactors.add(this._reader.ValueAsHandle);
      this._reader.ReadNext();
    }

    return reactors;
  }

  protected tryAssignCurrentValue(cadObject: object, map: DxfMap): boolean;
  protected tryAssignCurrentValue(cadObject: object, map: DxfClassMap): boolean;
  protected tryAssignCurrentValue(cadObject: object, map: DxfMap | DxfClassMap): boolean {
    if (map instanceof DxfMap) {
      if (!this.currentSubclass) {
        return false;
      }

      const subClass = map.subClasses.get(this.currentSubclass);
      if (subClass) {
        return this.tryAssignCurrentValue(cadObject, subClass);
      } else {
        return false;
      }
    }

    try {
      const dxfProperty = map.dxfProperties.get(this._reader.Code);
      if (dxfProperty) {
        if ((dxfProperty.referenceType & DxfReferenceType.Count) !== 0) {
          return true;
        }

        if ((dxfProperty.referenceType & DxfReferenceType.Handle) !== 0
          || (dxfProperty.referenceType & DxfReferenceType.Name) !== 0) {
          return false;
        }

        let value: any = this._reader.Value;

        if ((dxfProperty.referenceType & DxfReferenceType.IsAngle) !== 0) {
          value = MathHelper.DegToRad(value as number);
        }

        dxfProperty.setValue(this._reader.Code, cadObject, value);

        return true;
      }
    } catch (ex: any) {
      if (!this._builder.Configuration.Failsafe) {
        throw ex;
      } else {
        this._builder.Notify('An error occurred while assigning a property using mapper', NotificationType.Error, ex);
      }
    }

    return false;
  }
}
