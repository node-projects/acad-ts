import { DwgSectionIO } from '../DwgSectionIO.js';
import { DwgSectionDefinition } from '../FileHeaders/DwgSectionDefinition.js';
import { DwgDocumentBuilder } from '../DwgDocumentBuilder.js';
import { DwgStreamReaderBase } from './DwgStreamReaderBase.js';
import { DwgMergedReader } from './DwgMergedReader.js';
import { IDwgStreamReader } from './IDwgStreamReader.js';
import { HugeMemoryStream } from '../../HugeMemoryStream.js';
import { ACadVersion } from '../../../ACadVersion.js';
import { ObjectType } from '../../../Types/ObjectType.js';
import { DxfClass } from '../../../Classes/DxfClass.js';
import { DxfClassCollection } from '../../../Classes/DxfClassCollection.js';
import { DxfCode } from '../../../DxfCode.js';
import { DxfFileToken } from '../../../DxfFileToken.js';
import { GroupCodeValue, GroupCodeValueType } from '../../../GroupCodeValue.js';
import { CadTemplate } from '../../Templates/CadTemplate.js';
import { CadEntityTemplate } from '../../Templates/CadEntityTemplate.js';
import { CadNonGraphicalObjectTemplate } from '../../Templates/CadNonGraphicalObjectTemplate.js';
import { CadBlockRecordTemplate } from '../../Templates/CadBlockRecordTemplate.js';
import { CadBlockCtrlObjectTemplate } from '../../Templates/CadBlockCtrlObjectTemplate.js';
import { CadTableTemplate } from '../../Templates/CadTableTemplate.js';
import { CadDimensionTemplate } from '../../Templates/CadDimensionTemplate.js';
import { CadDimensionStyleTemplate } from '../../Templates/CadDimensionStyleTemplate.js';
import { CadHatchTemplate } from '../../Templates/CadHatchTemplate.js';
import { CadInsertTemplate } from '../../Templates/CadInsertTemplate.js';
import { CadLayerTemplate } from '../../Templates/CadLayerTemplate.js';
import { CadLayoutTemplate } from '../../Templates/CadLayoutTemplate.js';
import { CadLeaderTemplate } from '../../Templates/CadLeaderTemplate.js';
import { CadLineTypeTemplate } from '../../Templates/CadLineTypeTemplate.js';
import { CadMLeaderTemplate } from '../../Templates/CadMLeaderTemplate.js';
import { CadMLeaderAnnotContextTemplate } from '../../Templates/CadMLeaderAnnotContextTemplate.js';
import { CadMLeaderStyleTemplate } from '../../Templates/CadMLeaderStyleTemplate.js';
import { CadMLineTemplate } from '../../Templates/CadMLineTemplate.js';
import { CadMLineStyleTemplate } from '../../Templates/CadMLineStyleTemplate.js';
import { CadMaterialTemplate } from '../../Templates/CadMaterialTemplate.js';
import { CadMeshTemplate } from '../../Templates/CadMeshTemplate.js';
import { CadOle2FrameTemplate } from '../../Templates/CadOle2FrameTemplate.js';
import { CadPolyLineTemplate } from '../../Templates/CadPolyLineTemplate.js';
import { CadPlotSettingsTemplate } from '../../Templates/CadPlotSettingsTemplate.js';
import { CadShapeTemplate } from '../../Templates/CadShapeTemplate.js';
import { CadSolid3DTemplate } from '../../Templates/CadSolid3DTemplate.js';
import { CadSplineTemplate } from '../../Templates/CadSplineTemplate.js';
import { CadTextEntityTemplate } from '../../Templates/CadTextEntityTemplate.js';
import { CadAttributeTemplate } from '../../Templates/CadAttributeTemplate.js';
import { CadToleranceTemplate } from '../../Templates/CadToleranceTemplate.js';
import { CadTableEntryTemplate } from '../../Templates/CadTableEntryTemplate.js';
import { CadUcsTemplate } from '../../Templates/CadUcsTemplate.js';
import { CadViewTemplate } from '../../Templates/CadViewTemplate.js';
import { CadViewportTemplate } from '../../Templates/CadViewportTemplate.js';
import { CadViewportEntityControlTemplate } from '../../Templates/CadViewportEntityControlTemplate.js';
import { CadViewportEntityHeaderTemplate } from '../../Templates/CadViewportEntityHeaderTemplate.js';
import { CadVPortTemplate } from '../../Templates/CadVPortTemplate.js';
import { CadWipeoutBaseTemplate } from '../../Templates/CadWipeoutBaseTemplate.js';
import { CadDictionaryTemplate } from '../../Templates/CadDictionaryTemplate.js';
import { CadDictionaryWithDefaultTemplate } from '../../Templates/CadDictionaryWithDefaultTemplate.js';
import { CadGeoDataTemplate } from '../../Templates/CadGeoDataTemplate.js';
import { CadGroupTemplate } from '../../Templates/CadGroupTemplate.js';
import { CadSortensTableTemplate } from '../../Templates/CadSortensTableTemplate.js';
import { CadTableStyleTemplate } from '../../Templates/CadTableStyleTemplate.js';
import { CadTableEntityTemplate } from '../../Templates/CadTableEntityTemplate.js';
import { CadXRecordTemplate } from '../../Templates/CadXRecordTemplate.js';
import { CadUnknownEntityTemplate } from '../../Templates/CadUnknownEntityTemplate.js';
import { CadUnknownNonGraphicalObjectTemplate } from '../../Templates/CadUnknownEntityTemplate.js';
import { CadUnderlayTemplate } from '../../Templates/CadUnderlayTemplate.js';
import { CadDimensionAssociationTemplate } from '../../Templates/CadDimensionAssociationTemplate.js';
import { CadEvaluationGraphTemplate } from '../../Templates/CadEvaluationGraphTemplate.js';
import { CadBlockFlipActionTemplate } from '../../Templates/CadBlockFlipActionTemplate.js';
import { CadBlockFlipParameterTemplate } from '../../Templates/CadBlockFlipParameterTemplate.js';
import { CadBlockRotationParameterTemplate } from '../../Templates/CadBlockRotationParameterTemplate.js';
import { CadBlockVisibilityParameterTemplate } from '../../Templates/CadBlockVisibilityParameterTemplate.js';
import { CadBlockRotationActionTemplate } from '../../Templates/CadBlockRotationActionTemplate.js';
import { CadBlockRepresentationDataTemplate } from '../../Templates/CadBlockRepresentationDataTemplate.js';
import { CadBlockGripTemplate } from '../../Templates/CadBlockGripTemplate.js';
import { CadBlockRotationGripTemplate } from '../../Templates/CadBlockRotationGripTemplate.js';
import { CadBlockVisibilityGripTemplate } from '../../Templates/CadBlockVisibilityGripTemplate.js';
import { CadBlockGripExpressionTemplate } from '../../Templates/CadBlockGripExpressionTemplate.js';
import { CadBlockElementTemplate } from '../../Templates/CadBlockElementTemplate.js';
import { CadBlockActionTemplate } from '../../Templates/CadBlockActionTemplate.js';
import { CadBlockActionBasePtTemplate } from '../../Templates/CadBlockActionBasePtTemplate.js';
import { CadBlockParameterTemplate } from '../../Templates/CadBlockParameterTemplate.js';
import { CadBlock1PtParameterTemplate } from '../../Templates/CadBlock1PtParameterTemplate.js';
import { CadBlock2PtParameterTemplate } from '../../Templates/CadBlock2PtParameterTemplate.js';
import { CadEvaluationExpressionTemplate } from '../../Templates/CadEvaluationExpressionTemplate.js';
import { CadAnnotScaleObjectContextDataTemplate } from '../../Templates/CadAnnotScaleObjectContextDataTemplate.js';
import { CadFieldTemplate } from '../../Templates/CadFieldTemplate.js';
import { CadFieldListTemplate } from '../../Templates/CadFieldListTemplate.js';
import { CadValueTemplate } from '../../Templates/CadValueTemplate.js';
import { CadWallTemplate } from '../../Templates/CadWallTemplate.js';
import { CadTableCellTemplate, CadCellStyleTemplate, CadTableCellContentTemplate, CadTableCellContentFormatTemplate, CadTableAttributeTemplate } from '../../Templates/CadTableEntityTemplate.js';
import { NotificationType } from '../../NotificationEventHandler.js';
import { Entity } from '../../../Entities/Entity.js';
import { Face3D, InvisibleEdgeFlags } from '../../../Entities/Face3D.js';
import { Arc } from '../../../Entities/Arc.js';
import { Circle } from '../../../Entities/Circle.js';
import { Line } from '../../../Entities/Line.js';
import { Point } from '../../../Entities/Point.js';
import { Ellipse } from '../../../Entities/Ellipse.js';
import { Solid } from '../../../Entities/Solid.js';
import { Solid3D } from '../../../Entities/Solid3D.js';
import { Ray } from '../../../Entities/Ray.js';
import { XLine } from '../../../Entities/XLine.js';
import { MText, AttachmentPointType, DrawingDirectionType, LineSpacingStyleType, BackgroundFillFlags, ColumnType } from '../../../Entities/MText.js';
import { TextEntity, TextHorizontalAlignment, TextVerticalAlignmentType, TextMirrorFlag } from '../../../Entities/TextEntity.js';
import { AttributeEntity } from '../../../Entities/AttributeEntity.js';
import { AttributeDefinition } from '../../../Entities/AttributeDefinition.js';
import { AttributeBase, AttributeFlags, AttributeType } from '../../../Entities/AttributeBase.js';
import { Insert } from '../../../Entities/Insert.js';
import { Leader, LeaderCreationType, LeaderPathType, HookLineDirection } from '../../../Entities/Leader.js';
import { MultiLeader, MultiLeaderPropertyOverrideFlags, MultiLeaderPathType, LeaderContentType, TextAttachmentType, TextAlignmentType, TextAttachmentPointType, TextAttachmentDirectionType, MultiLeaderBlockAttribute } from '../../../Entities/MultiLeader.js';
import { MultiLeaderObjectContextData, LeaderRoot, LeaderLine, StartEndPointPair } from '../../../Objects/MultiLeaderObjectContextData.js';
import { Hatch, HatchPattern, HatchStyleType, HatchPatternType, BoundaryPathFlags, HatchBoundaryPathLine, HatchBoundaryPathArc, HatchBoundaryPathEllipse, HatchBoundaryPathSpline, HatchBoundaryPathPolyline } from '../../../Entities/Hatch.js';
import { LwPolyline, LwPolylineFlags } from '../../../Entities/LwPolyline.js';
import { IPolyline } from '../../../Entities/IPolyline.js';
import { Polyline2D } from '../../../Entities/Polyline2D.js';
import { Polyline3D } from '../../../Entities/Polyline3D.js';
import { PolygonMesh } from '../../../Entities/PolygonMesh.js';
import { PolyfaceMesh } from '../../../Entities/PolyfaceMesh.js';
import { MLine, MLineFlags, MLineJustification , MLineVertex, MLineSegment} from '../../../Entities/MLine.js';
import { Spline, SplineFlags, SplineFlags1, KnotParametrization } from '../../../Entities/Spline.js';
import { Shape } from '../../../Entities/Shape.js';
import { Viewport, ViewportStatusFlags } from '../../../Entities/Viewport.js';
import { Tolerance } from '../../../Entities/Tolerance.js';
import { Seqend } from '../../../Entities/Seqend.js';
import { Vertex2D } from '../../../Entities/Vertex2D.js';
import { Vertex3D } from '../../../Entities/Vertex3D.js';
import { VertexFaceMesh } from '../../../Entities/VertexFaceMesh.js';
import { PolygonMeshVertex } from '../../../Entities/PolygonMeshVertex.js';
import { VertexFaceRecord } from '../../../Entities/VertexFaceRecord.js';
import { Mesh } from '../../../Entities/Mesh.js';
import { Vertex } from '../../../Entities/Vertex.js';
import { DimensionAligned } from '../../../Entities/DimensionAligned.js';
import { DimensionAngular3Pt } from '../../../Entities/DimensionAngular3Pt.js';
import { DimensionAngular2Line } from '../../../Entities/DimensionAngular2Line.js';
import { DimensionDiameter } from '../../../Entities/DimensionDiameter.js';
import { DimensionLinear } from '../../../Entities/DimensionLinear.js';
import { DimensionOrdinate } from '../../../Entities/DimensionOrdinate.js';
import { DimensionRadius } from '../../../Entities/DimensionRadius.js';
import { Dimension } from '../../../Entities/Dimension.js';
import { Ole2Frame } from '../../../Entities/Ole2Frame.js';
import { ProxyEntity } from '../../../Entities/ProxyEntity.js';
import { RasterImage } from '../../../Entities/RasterImage.js';
import { Wipeout } from '../../../Entities/Wipeout.js';
import { CadWipeoutBase, ImageDisplayFlags, ClipMode, ClipType } from '../../../Entities/CadWipeoutBase.js';
import { PdfUnderlay } from '../../../Entities/PdfUnderlay.js';
import { ModelerGeometry , ModelerGeometryWire, ModelerGeometrySilhouette} from '../../../Entities/ModelerGeometry.js';
import { Region } from '../../../Entities/Region.js';
import { CadBody } from '../../../Entities/CadBody.js';
import { UnknownEntity } from '../../../Entities/UnknownEntity.js';
import { TableEntity, CellType, CellContent, CellContentGeometry, CellRange, CustomDataEntry, CellStyle, CellStyleType, TableCellContentType, TableCellStateFlags, ContentFormat, CellEdgeFlags, CellBorder, TableEntityBorderType, TableCellContentLayoutFlags, TableCellStylePropertyFlags, MarginFlags, TableBorderPropertyFlags, TableCellStylePropertyFlags as TCFlags, TableOverrideFlags, BorderOverrideFlags, TableAttribute, BreakOptionFlags, BreakFlowDirection, BreakHeight, BreakRowRange, BreakData, TableEntityColumn, TableEntityRow, TableEntityCell, CellAlignmentType , CellStyleClass, CellOverrideFlags } from '../../../Entities/TableEntity.js';
import { Block } from '../../../Blocks/Block.js';
import { BlockEnd } from '../../../Blocks/BlockEnd.js';
import { BlockRecord, BlockTypeFlags } from '../../../Tables/BlockRecord.js';
import { BlockRecordsTable } from '../../../Tables/Collections/BlockRecordsTable.js';
import { LayersTable } from '../../../Tables/Collections/LayersTable.js';
import { TextStylesTable } from '../../../Tables/Collections/TextStylesTable.js';
import { LineTypesTable } from '../../../Tables/Collections/LineTypesTable.js';
import { ViewsTable } from '../../../Tables/Collections/ViewsTable.js';
import { UCSTable } from '../../../Tables/Collections/UCSTable.js';
import { VPortsTable } from '../../../Tables/Collections/VPortsTable.js';
import { AppIdsTable } from '../../../Tables/Collections/AppIdsTable.js';
import { DimensionStylesTable } from '../../../Tables/Collections/DimensionStylesTable.js';
import { Layer, LayerFlags } from '../../../Tables/Layer.js';
import { LineType, LineTypeShapeFlags } from '../../../Tables/LineType.js';
import { TextStyle, StyleFlags, TextMirrorFlag as TextStyleMirrorFlag } from '../../../Tables/TextStyle.js';
import { DimensionStyle, ZeroHandling, ToleranceAlignment, DimensionTextHorizontalAlignment, DimensionTextVerticalAlignment, AngularZeroHandling, ArcLengthSymbolPosition, DimensionTextBackgroundFillMode, FractionFormat, TextMovement, TextDirection } from '../../../Tables/DimensionStyle.js';
import { View, ViewModeType, RenderMode } from '../../../Tables/View.js';
import { VPort, DefaultLightingType, GridFlags, UscIconType } from '../../../Tables/VPort.js';
import { UCS, OrthographicType } from '../../../Tables/UCS.js';
import { AppId } from '../../../Tables/AppId.js';
import { ViewportEntityHeader } from '../../../Tables/ViewportEntityHeader.js';
import { TableEntry, StandardFlags } from '../../../Tables/TableEntry.js';
import { Table } from '../../../Tables/Collections/Table.js';
import { CadDictionary, DictionaryCloningFlags } from '../../../Objects/CadDictionary.js';
import { CadDictionaryWithDefault } from '../../../Objects/CadDictionaryWithDefault.js';
import { DictionaryVariable } from '../../../Objects/DictionaryVariable.js';
import { Group } from '../../../Objects/Group.js';
import { ImageDefinition, ResolutionUnit } from '../../../Objects/ImageDefinition.js';
import { ImageDefinitionReactor } from '../../../Objects/ImageDefinitionReactor.js';
import { Layout, LayoutFlags } from '../../../Objects/Layout.js';
import { MLineStyle, MLineStyleFlags , MLineStyleElement} from '../../../Objects/MLineStyle.js';
import { MultiLeaderStyle, MultiLeaderDrawOrderType, LeaderDrawOrderType } from '../../../Objects/MultiLeaderStyle.js';
import { Material, ColorMethod, ProjectionMethod, TilingMethod, AutoTransformMethodFlags, MapSource } from '../../../Objects/Material.js';
import { PlotSettings, PlotFlags, PlotPaperUnits, PlotRotation, PlotType, ScaledType, ShadePlotMode, ShadePlotResolutionMode, PaperMargin } from '../../../Objects/PlotSettings.js';
import { RasterVariables, ImageDisplayQuality } from '../../../Objects/RasterVariables.js';
import { Scale } from '../../../Objects/Scale.js';
import { SortEntitiesTable } from '../../../Objects/SortEntitiesTable.js';
import { TableStyle, TableFlowDirectionType } from '../../../Objects/TableStyle.js';
import { TableContent } from '../../../Objects/TableContent.js';
import { VisualStyle } from '../../../Objects/VisualStyle.js';
import { XRecord } from '../../../Objects/XRecrod.js';
import { GeoData, GeoDataVersion, DesignCoordinatesType, ScaleEstimationType , GeoMeshPoint, GeoMeshFace} from '../../../Objects/GeoData.js';
import { PdfUnderlayDefinition } from '../../../Objects/PdfUnderlayDefinition.js';
import { AcdbPlaceHolder } from '../../../Objects/AcdbPlaceHolder.js';
import { BookColor } from '../../../Objects/BookColor.js';
import { ProxyObject } from '../../../Objects/ProxyObject.js';
import { IProxy } from '../../../IProxy.js';
import { SpatialFilter } from '../../../Objects/SpatialFilter.js';
import { DimensionAssociation, AssociativityFlags, RotatedDimensionType, ObjectOsnapType , OsnapPointRef} from '../../../Objects/DimensionAssociation.js';
import { EvaluationGraph , EvaluationGraphNode} from '../../../Objects/Evaluations/EvaluationGraph.js';
import { BlockFlipAction } from '../../../Objects/Evaluations/BlockFlipAction.js';
import { BlockFlipParameter } from '../../../Objects/Evaluations/BlockFlipParameter.js';
import { BlockRotationParameter } from '../../../Objects/Evaluations/BlockRotationParameter.js';
import { BlockRotationAction } from '../../../Objects/Evaluations/BlockRotationAction.js';
import { BlockVisibilityParameter } from '../../../Objects/Evaluations/BlockVisibilityParameter.js';
import { BlockAction } from '../../../Objects/Evaluations/BlockAction.js';
import { BlockActionBasePt } from '../../../Objects/Evaluations/BlockActionBasePt.js';
import { BlockGrip } from '../../../Objects/Evaluations/BlockGrip.js';
import { BlockGripExpression } from '../../../Objects/Evaluations/BlockGripExpression.js';
import { BlockRepresentationData } from '../../../Objects/BlockRepresentationData.js';
import { BlockReferenceObjectContextData } from '../../../Objects/BlockReferenceObjectContextData.js';
import { MTextAttributeObjectContextData } from '../../../Objects/MTextAttributeObjectContextData.js';
import { ObjectContextData } from '../../../Objects/ObjectContextData.js';
import { Field, EvaluationOptionFlags, FilingOptionFlags, FieldStateFlags, EvaluationStatusFlags } from '../../../Objects/Field.js';
import { FieldList } from '../../../Objects/FieldList.js';
import { CadValue, CadValueType } from '../../../CadValue.js';
import { CadValueUnitType } from '../../../CadValueUnitType.js';
import { AecCleanupGroup } from '../../../Objects/AEC/AecCleanupGroup.js';
import { AecWallStyle } from '../../../Objects/AEC/AecWallStyle.js';
import { AecBinRecord } from '../../../Objects/AEC/AecBinRecord.js';
import { Wall } from '../../../Entities/AecObjects/Wall.js';
import { UnknownNonGraphicalObject } from '../../../Objects/UnknownNonGraphicalObject.js';
import { Color } from '../../../Color.js';
import { Transparency } from '../../../Transparency.js';
import { CadUtils } from '../../../CadUtils.js';
import { XY } from '../../../Math/XY.js';
import { XYZ } from '../../../Math/XYZ.js';
import { Matrix4 } from '../../../Math/Matrix4.js';
import { MathHelper } from '../../../Math/MathHelper.js';
import { LineWeightType } from '../../../Types/LineWeightType.js';
import { LinearUnitFormat } from '../../../Types/Units/LinearUnitFormat.js';
import { UnitsType } from '../../../Types/Units/UnitsType.js';
import { ExtendedDataRecord } from '../../../XData/ExtendedDataRecord.js';
import { BigEndianConverter, LittleEndianConverter } from '../../../IO/Converters.js';
import { FlowDirectionType } from '../../../FlowDirectionType.js';
import { LineSpacingStyle } from '../../../LineSpacingStyle.js';
import { TextAngleType } from '../../../TextAngleType.js';
import { BlockContentConnectionType } from '../../../Tables/BlockContentConnectionType.js';
import { LeaderLinePropertOverrideFlags } from '../../../Objects/LeaderLinePropertOverrideFlags.js';
import { GradientColor } from '../../../Entities/GradientColor.js';
import { PolylineFlags } from '../../../Entities/PolylineFlags.js';
import { SmoothSurfaceType } from '../../../Entities/SmoothSurfaceType.js';
import { VertexFlags } from '../../../Entities/VertexFlags.js';
import { UnderlayDisplayFlags } from '../../../Entities/UnderlayDisplayFlags.js';
import { ImageUnits } from '../../../Types/Units/ImageUnits.js';
import { AngularUnitFormat } from '../../../Types/Units/AngularUnitFormat.js';
import { ExtendedDataString } from '../../../XData/ExtendedDataString.js';
import { ExtendedDataControlString } from '../../../XData/ExtendedDataControlString.js';
import { ExtendedDataLayer } from '../../../XData/ExtendedDataLayer.js';
import { ExtendedDataBinaryChunk } from '../../../XData/ExtendedDataBinaryChunk.js';
import { ExtendedDataHandle } from '../../../XData/ExtendedDataHandle.js';
import { ExtendedDataDisplacement } from '../../../XData/ExtendedDataDisplacement.js';
import { ExtendedDataDistance } from '../../../XData/ExtendedDataDistance.js';
import { ExtendedDataScale } from '../../../XData/ExtendedDataScale.js';
import { ExtendedDataCoordinate } from '../../../XData/ExtendedDataCoordinate.js';
import { ExtendedDataDirection } from '../../../XData/ExtendedDataDirection.js';
import { ExtendedDataInteger16 } from '../../../XData/ExtendedDataInteger16.js';
import { ExtendedDataInteger32 } from '../../../XData/ExtendedDataInteger32.js';
import { ExtendedDataReal } from '../../../XData/ExtendedDataReal.js';
import { ExtendedDataWorldCoordinate } from '../../../XData/ExtendedDataWorldCoordinate.js';
import { LwPolylineVertex } from '../../../Entities/LwPolyline.js';
import { MeshEdge } from '../../../Entities/Mesh.js';
import { HatchPatternLine } from '../../../Entities/HatchPattern.js';

export class DwgObjectReader extends DwgSectionIO {
  get sectionName(): string {
    return DwgSectionDefinition.AcDbObjects;
  }

  private readonly _classes: Map<number, DxfClass>;
  private readonly _crcReader: IDwgStreamReader;
  private readonly _map: Map<number, number>;
  private readonly _memoryStream: Uint8Array;
  private readonly _readedObjects: Map<number, ObjectType> = new Map();
  private readonly _reader: IDwgStreamReader;
  private _builder: DwgDocumentBuilder;
  private _handles: number[];
  private _handlesReader!: IDwgStreamReader;
  private _mergedReaders!: IDwgStreamReader;
  private _objectInitialPos: number = 0;
  private _objectReader!: IDwgStreamReader;
  private _size: number = 0;
  private _textReader!: IDwgStreamReader;

  constructor(
    version: ACadVersion,
    builder: DwgDocumentBuilder,
    reader: IDwgStreamReader,
    handles: number[],
    handleMap: Map<number, number>,
    classes: DxfClassCollection,
  ) {
    super(version);

    this._builder = builder;
    this._reader = reader;
    this._handles = [...handles];
    this._map = new Map(handleMap);
    this._classes = new Map<number, DxfClass>();
    for (const c of classes) {
      this._classes.set(c.classNumber, c);
    }

    this._memoryStream = new Uint8Array(reader.stream);
    this._crcReader = DwgStreamReaderBase.getStreamHandler(this._version, new Uint8Array(this._memoryStream));
  }

  public read(): void {
    while (this._handles.length > 0) {
      const handle = this._handles.shift()!;

      const offset = this._map.get(handle);
      if (offset === undefined ||
        this._builder.TryGetObjectTemplate(handle) != null ||
        this._readedObjects.has(handle)) {
        continue;
      }

      const type = this.getEntityType(offset);
      this._readedObjects.set(handle, type);

      let template: CadTemplate | null = null;

      try {
        template = this.readObject(type);
      } catch (ex: unknown) {
        if (!this._builder.Configuration.Failsafe) throw ex;

        const dxf = this._classes.get(type as number);
        if (dxf) {
          this._builder.Notify(`Could not read ${dxf.dxfName} number ${dxf.classNumber} with handle: ${handle}`, NotificationType.Error, ex instanceof Error ? ex : null);
        } else {
          this._builder.Notify(`Could not read ${type} with handle: ${handle}`, NotificationType.Error, ex instanceof Error ? ex : null);
        }
        continue;
      }

      if (template == null) continue;

      this._builder.AddTemplate(template);
    }
  }

  private getEntityType(offset: number): ObjectType {
    let type: ObjectType = ObjectType.INVALID;

    this._crcReader.position = offset;
    this._size = this._crcReader.readModularShort();

    if (this._size <= 0) return type;

    const sizeInBits = this._size << 3;

    if (this.R2010Plus) {
      const handleSize = this._crcReader.readModularChar();
      const handleSectionOffset = this._crcReader.positionInBits() + sizeInBits - handleSize;

      this._objectReader = DwgStreamReaderBase.getStreamHandler(this._version, new Uint8Array(this._memoryStream), this._reader.encoding);
      this._objectReader.setPositionInBits(this._crcReader.positionInBits());

      this._objectInitialPos = this._objectReader.positionInBits();
      type = this._objectReader.readObjectType();

      this._handlesReader = DwgStreamReaderBase.getStreamHandler(this._version, new Uint8Array(this._memoryStream), this._reader.encoding);
      this._handlesReader.setPositionInBits(handleSectionOffset);

      this._textReader = DwgStreamReaderBase.getStreamHandler(this._version, new Uint8Array(this._memoryStream), this._reader.encoding);
      this._textReader.setPositionByFlag(handleSectionOffset - 1);

      this._mergedReaders = new DwgMergedReader(this._objectReader, this._textReader, this._handlesReader);
    } else {
      this._objectReader = DwgStreamReaderBase.getStreamHandler(this._version, new Uint8Array(this._memoryStream), this._reader.encoding);
      this._objectReader.setPositionInBits(this._crcReader.positionInBits());

      this._handlesReader = DwgStreamReaderBase.getStreamHandler(this._version, new Uint8Array(this._memoryStream), this._reader.encoding);
      this._textReader = this._objectReader;

      this._objectInitialPos = this._objectReader.positionInBits();
      type = this._objectReader.readObjectType();
    }

    return type;
  }

  private handleReference(handle: number = 0): number {
    const value = handle === 0
      ? this._handlesReader.handleReference()
      : this._handlesReader.handleReferenceWithRef(handle);

    if (value !== 0 &&
      this._builder.TryGetObjectTemplate(value) == null &&
      !this._readedObjects.has(value)) {
      this._handles.push(value);
    }

    return value;
  }

  private readCommonData(template: CadTemplate): void {
    if (this._version >= ACadVersion.AC1015 && this._version < ACadVersion.AC1024) {
      this.updateHandleReader();
    }

    template.CadObject.handle = this._objectReader.handleReference();
    this.readExtendedData(template);
  }

  private readCommonEntityData(template: CadEntityTemplate): void {
    const entity = template.CadObject as Entity;

    this.readCommonData(template);

    if (this._objectReader.readBit()) {
      const graphicImageSize = this._version >= ACadVersion.AC1024
        ? this._objectReader.readBitLongLong()
        : this._objectReader.readRawLong();
      this._objectReader.advance(graphicImageSize);
    }

    if (this._version >= ACadVersion.AC1012 && this._version <= ACadVersion.AC1014) {
      this.updateHandleReader();
    }

    this.readEntityMode(template);
  }

  private readCommonNonEntityData(template: CadTemplate): void {
    this.readCommonData(template);

    if (this.R13_14Only) {
      this.updateHandleReader();
    }

    template.OwnerHandle = this.handleReference(template.CadObject.handle);
    this.readReactorsAndDictionaryHandle(template);
  }

  private readEntityMode(template: CadEntityTemplate): void {
    const entity = template.CadObject as Entity;

    template.EntityMode = this._objectReader.read2Bits();

    if (template.EntityMode === 0) {
      template.OwnerHandle = this._handlesReader.handleReferenceWithRef(entity.handle);
    } else if (template.EntityMode === 1) {
      this._builder.PaperSpaceEntities.push(entity);
    } else if (template.EntityMode === 2) {
      this._builder.ModelSpaceEntities.push(entity);
    }

    this.readReactorsAndDictionaryHandle(template);

    if (this.R13_14Only) {
      template.LayerHandle = this.handleReference();
      if (!this._objectReader.readBit()) {
        template.LineTypeHandle = this.handleReference();
      }
    }

    if (!this.R2004Plus && !this._objectReader.readBit()) {
      template.PrevEntity = this.handleReference(entity.handle);
      template.NextEntity = this.handleReference(entity.handle);
    } else if (!this.R2004Plus) {
      if (!this._readedObjects.has(entity.handle - 1)) {
        this._handles.push(entity.handle - 1);
      }
      if (!this._readedObjects.has(entity.handle + 1)) {
        this._handles.push(entity.handle + 1);
      }
    }

    const { color, transparency, flag: colorFlag } = this._objectReader.readEnColor();
    entity.color = color;
    entity.transparency = transparency;

    if (this._version >= ACadVersion.AC1018 && colorFlag) {
      template.ColorHandle = this.handleReference();
    }

    entity.lineTypeScale = this._objectReader.readBitDouble();

    if (!(this._version >= ACadVersion.AC1015)) {
      entity.isInvisible = (this._objectReader.readBitShort() & 1) === 0;
      return;
    }

    template.LayerHandle = this.handleReference();
    template.LtypeFlags = this._objectReader.read2Bits();

    if (template.LtypeFlags === 3) {
      template.LineTypeHandle = this.handleReference();
    }

    if (this.R2007Plus) {
      if (this._objectReader.read2Bits() === 3) {
        template.MaterialHandle = this.handleReference();
      }
      this._objectReader.readByte();
    }

    if (this._objectReader.read2Bits() === 3) {
      this.handleReference();
    }

    if (this.R2010Plus) {
      if (this._objectReader.readBit()) {
        this.handleReference();
      }
      if (this._objectReader.readBit()) {
        this.handleReference();
      }
      if (this._objectReader.readBit()) {
        this.handleReference();
      }
    }

    entity.isInvisible = (this._objectReader.readBitShort() & 1) === 1;
    entity.lineWeight = CadUtils.toValue(this._objectReader.readByte());
  }

  private readExtendedData(template: CadTemplate): void {
    let size = this._objectReader.readBitShort();

    while (size !== 0) {
      const appHandle = this._objectReader.handleReference();
      const endPos = this._objectReader.position + size;

      const edata = this.readExtendedDataRecords(endPos);
      template.EDataTemplate.set(appHandle, edata);

      size = this._objectReader.readBitShort();
    }
  }

  private readExtendedDataRecords(endPos: number): ExtendedDataRecord[] {
    const records: ExtendedDataRecord[] = [];

    while (this._objectReader.position < endPos) {
      const dxfCode: DxfCode = (1000 + this._objectReader.readByte()) as DxfCode;
      let record: ExtendedDataRecord | null = null;

      switch (dxfCode) {
        case DxfCode.ExtendedDataAsciiString:
        case DxfCode.ExtendedDataRegAppName:
          record = new ExtendedDataString(this._objectReader.readTextUnicode());
          break;
        case DxfCode.ExtendedDataControlString:
          record = new ExtendedDataControlString(this._objectReader.readByte() === 1);
          break;
        case DxfCode.ExtendedDataLayerName: {
          const arr = this._objectReader.readBytes(8);
          const handle = BigEndianConverter.toUInt64(arr);
          record = new ExtendedDataLayer(handle);
          break;
        }
        case DxfCode.ExtendedDataBinaryChunk:
          record = new ExtendedDataBinaryChunk(this._objectReader.readBytes(this._objectReader.readByte()));
          break;
        case DxfCode.ExtendedDataHandle: {
          const arr = this._objectReader.readBytes(8);
          const handle = BigEndianConverter.toUInt64(arr);
          record = new ExtendedDataHandle(handle);
          break;
        }
        case DxfCode.ExtendedDataXCoordinate:
          record = new ExtendedDataCoordinate(new XYZ(this._objectReader.readDouble(), this._objectReader.readDouble(), this._objectReader.readDouble()));
          break;
        case DxfCode.ExtendedDataWorldXCoordinate:
          record = new ExtendedDataWorldCoordinate(new XYZ(this._objectReader.readDouble(), this._objectReader.readDouble(), this._objectReader.readDouble()));
          break;
        case DxfCode.ExtendedDataWorldXDisp:
          record = new ExtendedDataDisplacement(new XYZ(this._objectReader.readDouble(), this._objectReader.readDouble(), this._objectReader.readDouble()));
          break;
        case DxfCode.ExtendedDataWorldXDir:
          record = new ExtendedDataDirection(new XYZ(this._objectReader.readDouble(), this._objectReader.readDouble(), this._objectReader.readDouble()));
          break;
        case DxfCode.ExtendedDataReal:
          record = new ExtendedDataReal(this._objectReader.readDouble());
          break;
        case DxfCode.ExtendedDataDist:
          record = new ExtendedDataDistance(this._objectReader.readDouble());
          break;
        case DxfCode.ExtendedDataScale:
          record = new ExtendedDataScale(this._objectReader.readDouble());
          break;
        case DxfCode.ExtendedDataInteger16:
          record = new ExtendedDataInteger16(this._objectReader.readShort());
          break;
        case DxfCode.ExtendedDataInteger32:
          record = new ExtendedDataInteger32(this._objectReader.readRawLong());
          break;
        default:
          this._objectReader.readBytes(endPos - this._objectReader.position);
          this._builder.Notify(`Unknown code for extended data: ${dxfCode}`, NotificationType.Warning);
          return records;
      }

      records.push(record!);
    }

    return records;
  }

  private readReactorsAndDictionaryHandle(template: CadTemplate): void {
    const numberOfReactors = this._objectReader.readBitLong();

    for (let i = 0; i < numberOfReactors; ++i) {
      template.ReactorsHandles.add(this.handleReference());
    }

    let flag = false;
    if (this.R2004Plus) {
      flag = this._objectReader.readBit();
    }

    if (!flag) {
      template.XDictHandle = this.handleReference();
    }

    if (this.R2013Plus) {
      this._objectReader.readBit();
    }
  }

  private readXrefDependantBit(entry: TableEntry): void {
    if (this.R2007Plus) {
      const xrefindex = this._objectReader.readBitShort();
      if ((xrefindex & 0b100000000) > 0) {
        entry.flags |= StandardFlags.XrefDependent;
      }
    } else {
      if (this._objectReader.readBit()) {
        entry.flags |= StandardFlags.Referenced;
      }
      const xrefindex = this._objectReader.readBitShort() - 1;
      if (this._objectReader.readBit()) {
        entry.flags |= StandardFlags.XrefDependent;
      }
    }
  }

  private updateHandleReader(): void {
    const size = this._objectReader.readRawLong();

    this._handlesReader.setPositionInBits(size + this._objectInitialPos);

    if (this._version === ACadVersion.AC1021) {
      this._textReader = DwgStreamReaderBase.getStreamHandler(this._version, new Uint8Array(this._memoryStream), this._reader.encoding);
      this._textReader.setPositionByFlag(size + this._objectInitialPos - 1);
    }

    this._mergedReaders = new DwgMergedReader(this._objectReader, this._textReader, this._handlesReader);
  }

  private static looksLikeUtf16Le(buffer: Uint8Array, offset: number): boolean {
    if (buffer == null || offset < 0 || offset + 1 >= buffer.length) return false;

    let sawNonZero = false;
    for (let i = offset; i + 1 < buffer.length; i += 2) {
      const lo = buffer[i];
      const hi = buffer[i + 1];
      if (lo === 0 && hi === 0) return sawNonZero;
      if (hi !== 0) return false;
      if (lo !== 0) sawNonZero = true;
    }
    return false;
  }

  // ==================== DISPATCH ====================

  private readObject(type: ObjectType): CadTemplate | null {
    let template: CadTemplate | null = null;

    switch (type) {
      case ObjectType.TEXT: template = this.readText(); break;
      case ObjectType.ATTRIB: template = this.readAttribute(); break;
      case ObjectType.ATTDEF: template = this.readAttributeDefinition(); break;
      case ObjectType.BLOCK: template = this.readBlock(); break;
      case ObjectType.ENDBLK: template = this.readEndBlock(); break;
      case ObjectType.SEQEND: template = this.readSeqend(); break;
      case ObjectType.INSERT: template = this.readInsert(); break;
      case ObjectType.MINSERT: template = this.readMInsert(); break;
      case ObjectType.VERTEX_2D: template = this.readVertex2D(); break;
      case ObjectType.VERTEX_3D: template = this.readVertex3D(new Vertex3D()); break;
      case ObjectType.VERTEX_PFACE: template = this.readVertex3D(new VertexFaceMesh()); break;
      case ObjectType.VERTEX_MESH: template = this.readVertex3D(new PolygonMeshVertex()); break;
      case ObjectType.VERTEX_PFACE_FACE: template = this.readPfaceVertex(); break;
      case ObjectType.POLYLINE_2D: template = this.readPolyline2D(); break;
      case ObjectType.POLYLINE_3D: template = this.readPolyline3D(); break;
      case ObjectType.ARC: template = this.readArc(); break;
      case ObjectType.CIRCLE: template = this.readCircle(); break;
      case ObjectType.LINE: template = this.readLine(); break;
      case ObjectType.DIMENSION_ORDINATE: template = this.readDimOrdinate(); break;
      case ObjectType.DIMENSION_LINEAR: template = this.readDimLinear(); break;
      case ObjectType.DIMENSION_ALIGNED: template = this.readDimAligned(); break;
      case ObjectType.DIMENSION_ANG_3_Pt: template = this.readDimAngular3pt(); break;
      case ObjectType.DIMENSION_ANG_2_Ln: template = this.readDimLine2pt(); break;
      case ObjectType.DIMENSION_RADIUS: template = this.readDimRadius(); break;
      case ObjectType.DIMENSION_DIAMETER: template = this.readDimDiameter(); break;
      case ObjectType.POINT: template = this.readPoint(); break;
      case ObjectType.FACE3D: template = this.read3dFace(); break;
      case ObjectType.POLYLINE_PFACE: template = this.readPolyfaceMesh(); break;
      case ObjectType.POLYLINE_MESH: template = this.readPolylineMesh(); break;
      case ObjectType.SOLID:
      case ObjectType.TRACE: template = this.readSolid(); break;
      case ObjectType.SHAPE: template = this.readShape(); break;
      case ObjectType.VIEWPORT: template = this.readViewport(); break;
      case ObjectType.ELLIPSE: template = this.readEllipse(); break;
      case ObjectType.SPLINE: template = this.readSpline(); break;
      case ObjectType.REGION: template = this.readModelerGeometry(new CadEntityTemplate(new Region())); break;
      case ObjectType.SOLID3D: template = this.readSolid3D(); break;
      case ObjectType.BODY: template = this.readModelerGeometry(new CadEntityTemplate(new CadBody())); break;
      case ObjectType.RAY: template = this.readRay(); break;
      case ObjectType.XLINE: template = this.readXLine(); break;
      case ObjectType.DICTIONARY: template = this.readDictionary(); break;
      case ObjectType.MTEXT: template = this.readMText(); break;
      case ObjectType.LEADER: template = this.readLeader(); break;
      case ObjectType.TOLERANCE: template = this.readTolerance(); break;
      case ObjectType.MLINE: template = this.readMLine(); break;
      case ObjectType.BLOCK_CONTROL_OBJ:
        template = this.readBlockControlObject();
        this._builder.BlockRecords = template!.CadObject as BlockRecordsTable;
        break;
      case ObjectType.BLOCK_HEADER: template = this.readBlockHeader(); break;
      case ObjectType.LAYER_CONTROL_OBJ:
        template = this.readDocumentTableGeneric(new LayersTable());
        this._builder.Layers = template!.CadObject as LayersTable;
        break;
      case ObjectType.LAYER: template = this.readLayer(); break;
      case ObjectType.STYLE_CONTROL_OBJ:
        template = this.readDocumentTableGeneric(new TextStylesTable());
        this._builder.TextStyles = template!.CadObject as TextStylesTable;
        break;
      case ObjectType.STYLE: template = this.readTextStyle(); break;
      case ObjectType.LTYPE_CONTROL_OBJ:
        template = this.readLTypeControlObject();
        this._builder.LineTypesTable = template!.CadObject as LineTypesTable;
        break;
      case ObjectType.LTYPE: template = this.readLType(); break;
      case ObjectType.VIEW_CONTROL_OBJ:
        template = this.readDocumentTableGeneric(new ViewsTable());
        this._builder.Views = template!.CadObject as ViewsTable;
        break;
      case ObjectType.VIEW: template = this.readView(); break;
      case ObjectType.UCS_CONTROL_OBJ:
        template = this.readDocumentTableGeneric(new UCSTable());
        this._builder.UCSs = template!.CadObject as UCSTable;
        break;
      case ObjectType.UCS: template = this.readUcs(); break;
      case ObjectType.VPORT_CONTROL_OBJ:
        template = this.readDocumentTableGeneric(new VPortsTable());
        this._builder.VPorts = template!.CadObject as VPortsTable;
        break;
      case ObjectType.VPORT: template = this.readVPort(); break;
      case ObjectType.APPID_CONTROL_OBJ:
        template = this.readDocumentTableGeneric(new AppIdsTable());
        this._builder.AppIds = template!.CadObject as AppIdsTable;
        break;
      case ObjectType.APPID: template = this.readAppId(); break;
      case ObjectType.DIMSTYLE_CONTROL_OBJ:
        template = this.readDocumentTableGeneric(new DimensionStylesTable());
        this._builder.DimensionStyles = template!.CadObject as DimensionStylesTable;
        break;
      case ObjectType.DIMSTYLE: template = this.readDimStyle(); break;
      case ObjectType.VP_ENT_HDR_CTRL_OBJ: template = this.readViewportEntityControl(); break;
      case ObjectType.VP_ENT_HDR: template = this.readViewportEntityHeader(); break;
      case ObjectType.GROUP: template = this.readGroup(); break;
      case ObjectType.MLINESTYLE: template = this.readMLineStyle(); break;
      case ObjectType.LWPOLYLINE: template = this.readLWPolyline(); break;
      case ObjectType.HATCH: template = this.readHatch(); break;
      case ObjectType.XRECORD: template = this.readXRecord(); break;
      case ObjectType.ACDBPLACEHOLDER: template = this.readPlaceHolder(); break;
      case ObjectType.LAYOUT: template = this.readLayout(); break;
      case ObjectType.ACAD_PROXY_ENTITY: template = this.readProxyEntity(); break;
      case ObjectType.ACAD_PROXY_OBJECT: template = this.readProxyObject(); break;
      case ObjectType.OLE2FRAME: template = this.readOle2Frame(); break;
      case ObjectType.OLEFRAME:
      case ObjectType.DUMMY:
        template = this.readUnknownEntity(null);
        this._builder.Notify(`Unlisted object with DXF name ${type} has been read as an UnknownEntity`, NotificationType.Warning);
        return template;
      case ObjectType.VBA_PROJECT:
      case ObjectType.LONG_TRANSACTION:
        template = this.readUnknownNonGraphicalObject(null);
        this._builder.Notify(`Unlisted object with DXF name ${type} has been read as an UnknownNonGraphicalObject`, NotificationType.Warning);
        return template;
      case ObjectType.UNDEFINED:
      case ObjectType.UNKNOW_3A:
      case ObjectType.UNKNOW_3B:
      case ObjectType.UNKNOW_36:
      case ObjectType.UNKNOW_37:
      case ObjectType.UNKNOW_9:
        break;
      default:
        return this.readUnlistedType(type as number);
    }

    if (template == null) {
      this._builder.Notify(`Object type not implemented: ${type}`, NotificationType.NotImplemented);
    }

    return template;
  }

  private readUnlistedType(classNumber: number): CadTemplate | null {
    const c = this._classes.get(classNumber);
    if (!c) return null;

    let template: CadTemplate | null = null;

    switch (c.dxfName) {
      case DxfFileToken.EntityAecWall: template = this.readAecWall(); break;
      case DxfFileToken.ObjectBinRecord: template = this.readBinRecord(); break;
      case DxfFileToken.ObjectAecWallStyle: template = this.readAecWallStyle(); break;
      case DxfFileToken.ObjectAecCleanupGroupDef: template = this.readAecCleanupGroup(); break;
      case 'ACDBDICTIONARYWDFLT': template = this.readDictionaryWithDefault(); break;
      case 'ACDBPLACEHOLDER': template = this.readPlaceHolder(); break;
      case 'ACAD_TABLE': template = this.readTableEntity(); break;
      case DxfFileToken.ObjectDimensionAssociation: template = this.readDimensionAssociation(); break;
      case 'DBCOLOR': template = this.readDbColor(); break;
      case 'DICTIONARYVAR': template = this.readDictionaryVar(); break;
      case 'DICTIONARYWDFLT': template = this.readDictionaryWithDefault(); break;
      case DxfFileToken.ObjectGeoData: template = this.readGeoData(); break;
      case 'GROUP': template = this.readGroup(); break;
      case 'HATCH': template = this.readHatch(); break;
      case 'IMAGE': template = this.readCadImage(new RasterImage()); break;
      case 'IMAGEDEF': template = this.readImageDefinition(); break;
      case 'IMAGEDEF_REACTOR': template = this.readImageDefinitionReactor(); break;
      case 'LAYOUT': template = this.readLayout(); break;
      case 'LWPLINE':
      case 'LWPOLYLINE': template = this.readLWPolyline(); break;
      case 'MATERIAL': template = this.readMaterial(); break;
      case 'MESH': template = this.readMesh(); break;
      case 'MULTILEADER': template = this.readMultiLeader(); break;
      case 'ACDB_MLEADEROBJECTCONTEXTDATA_CLASS': template = this.readMultiLeaderAnnotContext(); break;
      case 'MLEADERSTYLE': template = this.readMultiLeaderStyle(); break;
      case 'PDFDEFINITION': template = this.readPdfDefinition(); break;
      case 'PDFUNDERLAY':
      case 'PDFREFERENCE': template = this.readPdfUnderlay(); break;
      case 'SCALE': template = this.readScale(); break;
      case 'SORTENTSTABLE': template = this.readSortentsTable(); break;
      case 'RASTERVARIABLES': template = this.readRasterVariables(); break;
      case 'WIPEOUT': template = this.readCadImage(new Wipeout()); break;
      case 'XRECORD': template = this.readXRecord(); break;
      case DxfFileToken.ObjectEvalGraph: template = this.readEvaluationGraph(); break;
      case DxfFileToken.ObjectBlockRotationParameter: template = this.readBlockRotationParameter(); break;
      case DxfFileToken.ObjectBlockVisibilityParameter: template = this.readBlockVisibilityParameter(); break;
      case 'BLOCKFLIPPARAMETER': template = this.readBlockFlipParameter(); break;
      case DxfFileToken.ObjectBlockRepresentationData: template = this.readBlockRepresentationData(); break;
      case DxfFileToken.ObjectBlockGripLocationComponent: template = this.readBlockGripLocationComponent(); break;
      case DxfFileToken.ObjectBlockRotationGrip: {
        const t = new CadBlockRotationGripTemplate();
        this.readBlockGrip(t);
        template = t;
        break;
      }
      case DxfFileToken.ObjectBlockVisibilityGrip: {
        const t = new CadBlockVisibilityGripTemplate();
        this.readBlockGrip(t);
        template = t;
        break;
      }
      case DxfFileToken.ObjectBlockFlipAction: template = this.readBlockFlipAction(); break;
      case DxfFileToken.ObjectBlockRotateAction: template = this.readBlockRotateAction(); break;
      case 'SPATIAL_FILTER': template = this.readSpatialFilter(); break;
      case 'ACAD_PROXY_ENTITY': template = this.readProxyEntity(); break;
      case 'ACAD_PROXY_OBJECT': template = this.readProxyObject(); break;
      case DxfFileToken.ObjectVisualStyle: template = this.readVisualStyle(); break;
      case DxfFileToken.ObjectPlotSettings: template = this.readPlotSettings(); break;
      case DxfFileToken.ObjectTableStyle: template = this.readTableStyle(); break;
      case DxfFileToken.BlkRefObjectContextData: template = this.readBlkRefObjectContextData(); break;
      case DxfFileToken.MTextAttributeObjectContextData: template = this.readMTextAttributeObjectContextData(); break;
      case DxfFileToken.ObjectFieldList: template = this.readFieldList(); break;
      case DxfFileToken.ObjectField: template = this.readField(); break;
    }

    if (template == null && c.isAnEntity) {
      template = this.readUnknownEntity(c);
      this._builder.Notify(`Unlisted object with DXF name ${c.dxfName} has been read as an UnknownEntity`, NotificationType.Warning);
    } else if (template == null && !c.isAnEntity) {
      template = this.readUnknownNonGraphicalObject(c);
      this._builder.Notify(`Unlisted object with DXF name ${c.dxfName} has been read as an UnknownNonGraphicalObject`, NotificationType.Warning);
    }

    return template;
  }

  // ==================== ENTITY READERS ====================

  private read3dFace(): CadTemplate {
    const face = new Face3D();
    const template = new CadEntityTemplate(face);
    this.readCommonEntityData(template);
    if (this.R13_14Only) {
      face.firstCorner = this._objectReader.read3BitDouble();
      face.secondCorner = this._objectReader.read3BitDouble();
      face.thirdCorner = this._objectReader.read3BitDouble();
      face.fourthCorner = this._objectReader.read3BitDouble();
      face.flags = this._objectReader.readBitShort() as InvisibleEdgeFlags;
    }
    if (this.R2000Plus) {
      const noFlags = this._objectReader.readBit();
      const zIsZero = this._objectReader.readBit();
      const x = this._objectReader.readDouble();
      const y = this._objectReader.readDouble();
      let z = 0.0;
      if (!zIsZero) z = this._objectReader.readDouble();
      face.firstCorner = new XYZ(x, y, z);
      face.secondCorner = this._objectReader.read3BitDoubleWithDefault(face.firstCorner);
      face.thirdCorner = this._objectReader.read3BitDoubleWithDefault(face.secondCorner);
      face.fourthCorner = this._objectReader.read3BitDoubleWithDefault(face.thirdCorner);
      if (!noFlags) face.flags = this._objectReader.readBitShort() as InvisibleEdgeFlags;
    }
    return template;
  }

  private readArc(): CadTemplate {
    const arc = new Arc();
    const template = new CadEntityTemplate(arc);
    this.readCommonEntityData(template);
    arc.center = this._objectReader.read3BitDouble();
    const radius = this._objectReader.readBitDouble();
    arc.radius = radius <= 0 ? MathHelper.Epsilon : radius;
    arc.thickness = this._objectReader.readBitThickness();
    arc.normal = this._objectReader.readBitExtrusion();
    arc.startAngle = this._objectReader.readBitDouble();
    arc.endAngle = this._objectReader.readBitDouble();
    return template;
  }

  private readCircle(): CadTemplate {
    const circle = new Circle();
    const template = new CadEntityTemplate(circle);
    this.readCommonEntityData(template);
    circle.center = this._objectReader.read3BitDouble();
    const radius = this._objectReader.readBitDouble();
    circle.radius = radius <= 0 ? MathHelper.Epsilon : radius;
    circle.thickness = this._objectReader.readBitThickness();
    circle.normal = this._objectReader.readBitExtrusion();
    return template;
  }

  private readLine(): CadTemplate {
    const line = new Line();
    const template = new CadEntityTemplate(line);
    this.readCommonEntityData(template);
    if (this.R13_14Only) {
      line.startPoint = this._objectReader.read3BitDouble();
      line.endPoint = this._objectReader.read3BitDouble();
    }
    if (this.R2000Plus) {
      const flag = this._objectReader.readBit();
      const startX = this._objectReader.readDouble();
      const endX = this._objectReader.readBitDoubleWithDefault(startX);
      const startY = this._objectReader.readDouble();
      const endY = this._objectReader.readBitDoubleWithDefault(startY);
      let startZ = 0.0;
      let endZ = 0.0;
      if (!flag) {
        startZ = this._objectReader.readDouble();
        endZ = this._objectReader.readBitDoubleWithDefault(startZ);
      }
      line.startPoint = new XYZ(startX, startY, startZ);
      line.endPoint = new XYZ(endX, endY, endZ);
    }
    line.thickness = this._objectReader.readBitThickness();
    line.normal = this._objectReader.readBitExtrusion();
    return template;
  }

  private readPoint(): CadTemplate {
    const pt = new Point();
    const template = new CadEntityTemplate(pt);
    this.readCommonEntityData(template);
    pt.location = this._objectReader.read3BitDouble();
    pt.thickness = this._objectReader.readBitThickness();
    pt.normal = this._objectReader.readBitExtrusion();
    pt.rotation = this._objectReader.readBitDouble();
    return template;
  }

  private readEllipse(): CadTemplate {
    const ellipse = new Ellipse();
    const template = new CadEntityTemplate(ellipse);
    this.readCommonEntityData(template);
    ellipse.center = this._objectReader.read3BitDouble();
    ellipse.majorAxisEndPoint = this._objectReader.read3BitDouble();
    ellipse.normal = this._objectReader.read3BitDouble();
    ellipse.radiusRatio = this._objectReader.readBitDouble();
    ellipse.startParameter = this._objectReader.readBitDouble();
    ellipse.endParameter = this._objectReader.readBitDouble();
    return template;
  }

  private readRay(): CadTemplate {
    const ray = new Ray();
    const template = new CadEntityTemplate(ray);
    this.readCommonEntityData(template);
    ray.startPoint = this._objectReader.read3BitDouble();
    ray.direction = this._objectReader.read3BitDouble();
    return template;
  }

  private readXLine(): CadTemplate {
    const xline = new XLine();
    const template = new CadEntityTemplate(xline);
    this.readCommonEntityData(template);
    xline.firstPoint = this._objectReader.read3BitDouble();
    xline.direction = this._objectReader.read3BitDouble();
    return template;
  }

  private readSolid(): CadTemplate {
    const solid = new Solid();
    const template = new CadEntityTemplate(solid);
    this.readCommonEntityData(template);
    solid.thickness = this._objectReader.readBitThickness();
    const elevation = this._objectReader.readBitDouble();
    let pt = this._objectReader.read2RawDouble();
    solid.firstCorner = new XYZ(pt.x, pt.y, elevation);
    pt = this._objectReader.read2RawDouble();
    solid.secondCorner = new XYZ(pt.x, pt.y, elevation);
    pt = this._objectReader.read2RawDouble();
    solid.thirdCorner = new XYZ(pt.x, pt.y, elevation);
    pt = this._objectReader.read2RawDouble();
    solid.fourthCorner = new XYZ(pt.x, pt.y, elevation);
    solid.normal = this._objectReader.readBitExtrusion();
    return template;
  }

  private readBlock(): CadTemplate {
    const block = new Block(new BlockRecord());
    const template = new CadEntityTemplate(block);
    this.readCommonEntityData(template);
    const name = this._textReader.readVariableText();
    if (name && name.trim().length > 0) block.name = name;
    return template;
  }

  private readEndBlock(): CadTemplate {
    const block = new BlockEnd(new BlockRecord());
    const template = new CadEntityTemplate(block);
    this.readCommonEntityData(template);
    return template;
  }

  private readSeqend(): CadTemplate {
    const template = new CadEntityTemplate(new Seqend());
    this.readCommonEntityData(template);
    return template;
  }

  private readShape(): CadTemplate {
    const shape = new Shape();
    const template = new CadShapeTemplate(shape);
    this.readCommonEntityData(template);
    shape.insertionPoint = this._objectReader.read3BitDouble();
    shape.size = this._objectReader.readBitDouble();
    shape.rotation = this._objectReader.readBitDouble();
    shape.relativeXScale = this._objectReader.readBitDouble();
    shape.obliqueAngle = this._objectReader.readBitDouble();
    shape.thickness = this._objectReader.readBitDouble();
    shape.shapeIndex = this._objectReader.readBitShort() & 0xFFFF;
    shape.normal = this._objectReader.read3BitDouble();
    template.ShapeFileHandle = this.handleReference();
    return template;
  }

  private readTolerance(): CadTemplate {
    const tolerance = new Tolerance();
    const template = new CadToleranceTemplate(tolerance);
    this.readCommonEntityData(template as unknown as CadEntityTemplate);
    if (this.R13_14Only) {
      this._objectReader.readBitShort();
      this._objectReader.readBitDouble();
      this._objectReader.readBitDouble();
    }
    tolerance.insertionPoint = this._objectReader.read3BitDouble();
    tolerance.direction = this._objectReader.read3BitDouble();
    tolerance.normal = this._objectReader.read3BitDouble();
    tolerance.text = this._textReader.readVariableText();
    template.DimensionStyleHandle = this.handleReference();
    return template as unknown as CadTemplate;
  }

  private readPlaceHolder(): CadTemplate {
    const template = new CadNonGraphicalObjectTemplate(new AcdbPlaceHolder());
    this.readCommonNonEntityData(template);
    return template;
  }

  private readUnknownEntity(dxfClass: DxfClass | null): CadTemplate {
    const entity = new UnknownEntity(dxfClass);
    const template = new CadUnknownEntityTemplate(entity);
    this.readCommonEntityData(template);
    return template;
  }

  private readUnknownNonGraphicalObject(dxfClass: DxfClass | null): CadTemplate {
    const obj = new UnknownNonGraphicalObject(dxfClass);
    const template = new CadUnknownNonGraphicalObjectTemplate(obj);
    this.readCommonNonEntityData(template);
    return template;
  }

  // ==================== BLOCK HEADER ====================

  private readBlockControlObject(): CadTemplate {
    const template = new CadBlockCtrlObjectTemplate(new BlockRecordsTable());
    this.readDocumentTable(template);
    template.ModelSpaceHandle = this.handleReference();
    template.PaperSpaceHandle = this.handleReference();
    return template;
  }

  private readBlockHeader(): CadTemplate {
    const record = new BlockRecord();
    const block = record.blockEntity;
    const template = new CadBlockRecordTemplate(record);
    this._builder.BlockRecordTemplates.push(template);
    this.readCommonNonEntityData(template);
    const name = this._textReader.readVariableText();
    if (name.toLowerCase() === BlockRecord.ModelSpaceName.toLowerCase() ||
      name.toLowerCase() === BlockRecord.PaperSpaceName.toLowerCase()) {
      record.name = name;
    }
    this.readXrefDependantBit(template.CadObject);
    if (this._objectReader.readBit()) block.flags |= BlockTypeFlags.Anonymous;
    const hasatts = this._objectReader.readBit();
    if (this._objectReader.readBit()) block.flags |= BlockTypeFlags.XRef;
    if (this._objectReader.readBit()) block.flags |= BlockTypeFlags.XRefOverlay;
    if (this.R2000Plus) {
      block.isUnloaded = this._objectReader.readBit();
    }
    let nownedObjects = 0;
    if (this.R2004Plus && !(block.flags & BlockTypeFlags.XRef) && !(block.flags & BlockTypeFlags.XRefOverlay)) {
      nownedObjects = this._objectReader.readBitLong();
    }
    block.basePoint = this._objectReader.read3BitDouble();
    block.xRefPath = this._textReader.readVariableText();
    let insertCount = 0;
    if (this.R2000Plus) {
      for (let i = this._objectReader.readByte(); i !== 0; i = this._objectReader.readByte()) ++insertCount;
      block.comments = this._textReader.readVariableText();
      const n = this._objectReader.readBitLong();
      const data: number[] = [];
      for (let i = 0; i < n; ++i) data.push(this._objectReader.readByte());
      record.preview = new Uint8Array(data);
    }
    if (this.R2007Plus) {
      record.units = this._objectReader.readBitShort() as UnitsType;
      record.isExplodable = this._objectReader.readBit();
      record.canScale = this._objectReader.readByte() > 0;
    }
    this.handleReference();
    template.BeginBlockHandle = this.handleReference();
    if (this._version >= ACadVersion.AC1012 && this._version <= ACadVersion.AC1015
      && !(block.flags & BlockTypeFlags.XRef) && !(block.flags & BlockTypeFlags.XRefOverlay)) {
      template.FirstEntityHandle = this.handleReference();
      template.LastEntityHandle = this.handleReference();
    }
    if (this.R2004Plus) {
      for (let i = 0; i < nownedObjects; ++i) template.OwnedObjectsHandlers.add(this.handleReference());
    }
    template.EndBlockHandle = this.handleReference();
    if (this.R2000Plus) {
      for (let i = 0; i < insertCount; ++i) template.InsertHandles.push(this.handleReference());
      template.LayoutHandle = this.handleReference();
    }
    return template;
  }

  // ==================== TABLE READERS ====================

  private readDocumentTable<T extends TableEntry>(template: CadTableTemplate<T>): CadTemplate {
    this.readCommonNonEntityData(template);
    const numentries = this._objectReader.readBitLong();
    for (let i = 0; i < numentries; ++i) template.EntryHandles.add(this.handleReference());
    return template;
  }

  private readDocumentTableGeneric<T extends TableEntry>(table: Table<T>): CadTemplate {
    const template = new CadTableTemplate(table);
    return this.readDocumentTable(template);
  }

  private readLTypeControlObject(): CadTemplate {
    const template = new CadTableTemplate(new LineTypesTable());
    this.readDocumentTable(template);
    template.EntryHandles.add(this.handleReference());
    template.EntryHandles.add(this.handleReference());
    return template;
  }

  private readAppId(): CadTemplate {
    const appId = new AppId();
    const template = new CadTableEntryTemplate(appId);
    this.readCommonNonEntityData(template);
    const name = this._textReader.readVariableText();
    if (name && name.trim().length > 0) appId.name = name;
    this.readXrefDependantBit(appId);
    this._objectReader.readByte();
    this.handleReference();
    return template;
  }

  private readTextStyle(): CadTemplate {
    const style = new TextStyle();
    const template = new CadTableEntryTemplate(style);
    this.readCommonNonEntityData(template);
    const name = this._textReader.readVariableText();
    if (name && name.trim().length > 0) style.name = name;
    this.readXrefDependantBit(template.CadObject);
    if (this._objectReader.readBit()) style.flags |= StyleFlags.IsShape;
    if (this._objectReader.readBit()) style.flags |= StyleFlags.VerticalText;
    style.height = this._objectReader.readBitDouble();
    style.width = this._objectReader.readBitDouble();
    style.obliqueAngle = this._objectReader.readBitDouble();
    style.mirrorFlag = this._objectReader.readByte() as TextStyleMirrorFlag;
    style.lastHeight = this._objectReader.readBitDouble();
    style.filename = this._textReader.readVariableText();
    style.bigFontFilename = this._textReader.readVariableText();
    this.handleReference();
    return template;
  }

  private readLayer(): CadTemplate {
    const layer = new Layer();
    const template = new CadLayerTemplate(layer);
    this.readCommonNonEntityData(template);
    const name = this._textReader.readVariableText();
    if (name && name.trim().length > 0) layer.name = name;
    this.readXrefDependantBit(template.CadObject);
    if (this.R13_14Only) {
      if (this._objectReader.readBit()) layer.flags |= LayerFlags.Frozen;
      layer.isOn = this._objectReader.readBit();
      if (this._objectReader.readBit()) layer.flags |= LayerFlags.FrozenNewViewports;
      if (this._objectReader.readBit()) layer.flags |= LayerFlags.Locked;
    }
    if (this.R2000Plus) {
      const values = this._objectReader.readBitShort();
      if ((values & 0b1) > 0) layer.flags |= LayerFlags.Frozen;
      layer.isOn = (values & 0b10) === 0;
      if ((values & 0b100) > 0) layer.flags |= LayerFlags.FrozenNewViewports;
      if ((values & 0b1000) > 0) layer.flags |= LayerFlags.Locked;
      layer.plotFlag = (values & 0b10000) > 0;
      const lineweight = (values & 0x3E0) >> 5;
      layer.lineWeight = CadUtils.toValue(lineweight);
    }
    const color = this._mergedReaders.readCmColor();
    layer.color = color.isByBlock || color.isByLayer ? new Color(30) : color;
    template.LayerControlHandle = this.handleReference();
    if (this.R2000Plus) template.PlotStyleHandle = this.handleReference();
    if (this.R2007Plus) template.MaterialHandle = this.handleReference();
    template.LineTypeHandle = this.handleReference();
    if (this.R2013Plus) this.handleReference();
    return template;
  }

  private readLType(): CadTemplate {
    const ltype = new LineType();
    const template = new CadLineTypeTemplate(ltype);
    this.readCommonNonEntityData(template);
    const name = this._textReader.readVariableText();
    if (name && name.trim().length > 0) ltype.name = name;
    this.readXrefDependantBit(template.CadObject);
    ltype.description = this._textReader.readVariableText();
    template.TotalLen = this._objectReader.readBitDouble();
    ltype.alignment = String.fromCharCode(this._objectReader.readRawChar());
    const ndashes = this._objectReader.readByte();
    let isText = false;
    for (let i = 0; i < ndashes; i++) {
      const segment = new CadLineTypeTemplate.SegmentTemplate();
      segment.Segment.length = this._objectReader.readBitDouble();
      segment.Segment.shapeNumber = this._objectReader.readBitShort();
      segment.Segment.offset = new XY(this._objectReader.readDouble(), this._objectReader.readDouble());
      segment.Segment.scale = this._objectReader.readBitDouble();
      segment.Segment.rotation = this._objectReader.readBitDouble();
      segment.Segment.shapeFlags = this._objectReader.readBitShort() as LineTypeShapeFlags;
      if (segment.Segment.shapeFlags & LineTypeShapeFlags.Text) isText = true;
      template.SegmentTemplates.push(segment);
    }
    let textarea: Uint8Array | null = null;
    if (this._version <= ACadVersion.AC1018) {
      textarea = this._objectReader.readBytes(256);
    }
    if (this.R2007Plus && isText) {
      textarea = this._objectReader.readBytes(512);
    }
    if (isText && textarea) {
      this.readLineTypeSegmentTexts(template.SegmentTemplates, textarea);
    }
    template.LtypeControlHandle = this.handleReference();
    for (let i = 0; i < ndashes; i++) {
      template.SegmentTemplates[i].StyleHandle = this.handleReference();
    }
    return template;
  }

  private readLineTypeSegmentTexts(segments: CadLineTypeTemplate.SegmentTemplate[], textArea: Uint8Array): void {
    if (!segments || !textArea || textArea.length === 0) return;
    for (const segment of segments) {
      if (!(segment.Segment.shapeFlags & LineTypeShapeFlags.Text)) continue;
      const offset = segment.Segment.shapeNumber & 0xFFFF;
      if (offset >= textArea.length) {
        this._builder.Notify(`Unable to read linetype text segment; offset ${offset} is outside the available buffer (${textArea.length} bytes).`, NotificationType.Warning);
        segment.Segment.text = '';
        segment.Segment.shapeNumber = 0;
        continue;
      }
      segment.Segment.text = this.readLineTypeTextString(textArea, offset);
      segment.Segment.shapeNumber = 0;
    }
  }

  private readLineTypeTextString(buffer: Uint8Array, offset: number): string {
    if (!buffer || offset < 0 || offset >= buffer.length) return '';
    if (DwgObjectReader.looksLikeUtf16Le(buffer, offset)) {
      let end = offset;
      while (end + 1 < buffer.length) {
        if (buffer[end] === 0 && buffer[end + 1] === 0) break;
        end += 2;
      }
      return new TextDecoder('utf-16le').decode(buffer.slice(offset, end));
    }
    let endAscii = offset;
    while (endAscii < buffer.length && buffer[endAscii] !== 0) endAscii++;
    if (endAscii === offset) return '';
    return new TextDecoder('ascii').decode(buffer.slice(offset, endAscii));
  }

  // ==================== DIMENSION READERS ====================

  private readCommonDimensionData(template: CadDimensionTemplate): void {
    this.readCommonEntityData(template);
    const dimension = template.CadObject as Dimension;
    if (this.R2010Plus) dimension.version = this._objectReader.readByte();
    dimension.normal = this._objectReader.read3BitDouble();
    const midpt = this._objectReader.read2RawDouble();
    const elevation = this._objectReader.readBitDouble();
    dimension.textMiddlePoint = new XYZ(midpt.x, midpt.y, elevation);
    const flags = this._objectReader.readByte();
    dimension.isTextUserDefinedLocation = (flags & 0b01) === 0;
    dimension.text = this._textReader.readVariableText();
    dimension.textRotation = this._objectReader.readBitDouble();
    dimension.horizontalDirection = this._objectReader.readBitDouble();
    const insertionScaleFactor = new XYZ(this._objectReader.readBitDouble(), this._objectReader.readBitDouble(), this._objectReader.readBitDouble());
    const insertionRotation = this._objectReader.readBitDouble();
    if (this.R2000Plus) {
      dimension.attachmentPoint = this._objectReader.readBitShort() as AttachmentPointType;
      dimension.lineSpacingStyle = this._objectReader.readBitShort() as LineSpacingStyleType;
      dimension.lineSpacingFactor = this._objectReader.readBitDouble();
      this._objectReader.readBitDouble();
    }
    if (this.R2007Plus) {
      this._objectReader.readBit();
      dimension.flipArrow1 = this._objectReader.readBit();
      dimension.flipArrow2 = this._objectReader.readBit();
    }
    const pt = this._objectReader.read2RawDouble();
    dimension.insertionPoint = new XYZ(pt.x, pt.y, elevation);
  }

  private readCommonDimensionAlignedData(template: CadDimensionTemplate): void {
    const dimension = template.CadObject as DimensionAligned;
    dimension.firstPoint = this._objectReader.read3BitDouble();
    dimension.secondPoint = this._objectReader.read3BitDouble();
    dimension.definitionPoint = this._objectReader.read3BitDouble();
    dimension.extLineRotation = this._objectReader.readBitDouble();
  }

  private readCommonDimensionHandles(template: CadDimensionTemplate): void {
    template.StyleHandle = this.handleReference();
    template.BlockHandle = this.handleReference();
  }

  private readDimAligned(): CadTemplate {
    const dimension = new DimensionAligned();
    const template = new CadDimensionTemplate(dimension);
    this.readCommonDimensionData(template);
    this.readCommonDimensionAlignedData(template);
    this.readCommonDimensionHandles(template);
    return template;
  }

  private readDimAngular3pt(): CadTemplate {
    const dimension = new DimensionAngular3Pt();
    const template = new CadDimensionTemplate(dimension);
    this.readCommonDimensionData(template);
    dimension.definitionPoint = this._objectReader.read3BitDouble();
    dimension.firstPoint = this._objectReader.read3BitDouble();
    dimension.secondPoint = this._objectReader.read3BitDouble();
    dimension.angleVertex = this._objectReader.read3BitDouble();
    this.readCommonDimensionHandles(template);
    return template;
  }

  private readDimDiameter(): CadTemplate {
    const dimension = new DimensionDiameter();
    const template = new CadDimensionTemplate(dimension);
    this.readCommonDimensionData(template);
    dimension.definitionPoint = this._objectReader.read3BitDouble();
    dimension.angleVertex = this._objectReader.read3BitDouble();
    dimension.leaderLength = this._objectReader.readBitDouble();
    this.readCommonDimensionHandles(template);
    return template;
  }

  private readDimLine2pt(): CadTemplate {
    const dimension = new DimensionAngular2Line();
    const template = new CadDimensionTemplate(dimension);
    this.readCommonDimensionData(template);
    const xy = this._objectReader.read2RawDouble();
    dimension.dimensionArc = new XYZ(xy.x, xy.y, dimension.textMiddlePoint.z);
    dimension.firstPoint = this._objectReader.read3BitDouble();
    dimension.secondPoint = this._objectReader.read3BitDouble();
    dimension.angleVertex = this._objectReader.read3BitDouble();
    dimension.definitionPoint = this._objectReader.read3BitDouble();
    this.readCommonDimensionHandles(template);
    return template;
  }

  private readDimLinear(): CadTemplate {
    const dimension = new DimensionLinear();
    const template = new CadDimensionTemplate(dimension);
    this.readCommonDimensionData(template);
    this.readCommonDimensionAlignedData(template);
    dimension.rotation = this._objectReader.readBitDouble();
    this.readCommonDimensionHandles(template);
    return template;
  }

  private readDimOrdinate(): CadTemplate {
    const dimension = new DimensionOrdinate();
    const template = new CadDimensionTemplate(dimension);
    this.readCommonDimensionData(template);
    dimension.definitionPoint = this._objectReader.read3BitDouble();
    dimension.featureLocation = this._objectReader.read3BitDouble();
    dimension.leaderEndpoint = this._objectReader.read3BitDouble();
    const flags = this._objectReader.readByte();
    dimension.isOrdinateTypeX = (flags & 0b01) !== 0;
    this.readCommonDimensionHandles(template);
    return template;
  }

  private readDimRadius(): CadTemplate {
    const dimension = new DimensionRadius();
    const template = new CadDimensionTemplate(dimension);
    this.readCommonDimensionData(template);
    dimension.definitionPoint = this._objectReader.read3BitDouble();
    dimension.angleVertex = this._objectReader.read3BitDouble();
    dimension.leaderLength = this._objectReader.readBitDouble();
    this.readCommonDimensionHandles(template);
    return template;
  }

  // ==================== TEXT ENTITIES ====================

  private readText(): CadTemplate {
    const text = new TextEntity();
    const template = new CadTextEntityTemplate(text);
    this.readCommonTextData(template);
    return template;
  }

  private readAttribute(): CadTemplate {
    const att = new AttributeEntity();
    const template = new CadAttributeTemplate(att);
    this.readCommonTextData(template);
    this.readCommonAttData(template);
    return template;
  }

  private readAttributeDefinition(): CadTemplate {
    const attdef = new AttributeDefinition();
    const template = new CadAttributeTemplate(attdef);
    this.readCommonTextData(template);
    this.readCommonAttData(template);
    if (this.R2010Plus) attdef.version = this._objectReader.readByte();
    attdef.prompt = this._textReader.readVariableText();
    return template;
  }

  private readCommonAttData(template: CadAttributeTemplate): void {
    const att = template.CadObject as AttributeBase;
    if (this.R2010Plus) att.version = this._objectReader.readByte();
    if (this.R2018Plus) att.attributeType = this._objectReader.readByte() as AttributeType;
    switch (att.attributeType) {
      case AttributeType.MultiLine:
      case AttributeType.ConstantMultiLine: {
        att.mText = new MText();
        const mtextTemplate = new CadTextEntityTemplate(att.mText);
        template.MTextTemplate = mtextTemplate;
        this.readEntityMode(mtextTemplate);
        this.readMTextBody(mtextTemplate, false);
        const dataSize = this._objectReader.readBitShort();
        if (dataSize > 0) {
          this._objectReader.readBytes(dataSize);
          this.handleReference();
          this._objectReader.readBitShort();
        }
        break;
      }
    }
    att.tag = this._textReader.readVariableText();
    this._objectReader.readBitShort();
    att.flags = this._objectReader.readByte() as AttributeFlags;
    if (this.R2007Plus) att.isReallyLocked = this._objectReader.readBit();
  }

  private readCommonTextData(template: CadTextEntityTemplate): void {
    this.readCommonEntityData(template);
    const text = template.CadObject as TextEntity;
    let elevation = 0.0;
    let pt: XY;
    if (this.R13_14Only) {
      elevation = this._objectReader.readBitDouble();
      pt = this._objectReader.read2RawDouble();
      text.insertPoint = new XYZ(pt.x, pt.y, elevation);
      pt = this._objectReader.read2RawDouble();
      text.alignmentPoint = new XYZ(pt.x, pt.y, elevation);
      text.normal = this._objectReader.read3BitDouble();
      text.thickness = this._objectReader.readBitDouble();
      text.obliqueAngle = this._objectReader.readBitDouble();
      text.rotation = this._objectReader.readBitDouble();
      text.height = this._objectReader.readBitDouble();
      text.widthFactor = this._objectReader.readBitDouble();
      text.value = this._textReader.readVariableText();
      text.mirror = this._objectReader.readBitShort() as TextMirrorFlag;
      text.horizontalAlignment = this._objectReader.readBitShort() as TextHorizontalAlignment;
      text.verticalAlignment = this._objectReader.readBitShort() as TextVerticalAlignmentType;
      template.StyleHandle = this.handleReference();
      return;
    }
    const dataFlags = this._objectReader.readByte();
    if ((dataFlags & 0x1) === 0) elevation = this._objectReader.readDouble();
    pt = this._objectReader.read2RawDouble();
    text.insertPoint = new XYZ(pt.x, pt.y, elevation);
    if ((dataFlags & 0x2) === 0) {
      const x = this._objectReader.readBitDoubleWithDefault(text.insertPoint.x);
      const y = this._objectReader.readBitDoubleWithDefault(text.insertPoint.y);
      text.alignmentPoint = new XYZ(x, y, elevation);
    }
    text.normal = this._objectReader.readBitExtrusion();
    text.thickness = this._objectReader.readBitThickness();
    if ((dataFlags & 0x4) === 0) text.obliqueAngle = this._objectReader.readDouble();
    if ((dataFlags & 0x8) === 0) text.rotation = this._objectReader.readDouble();
    text.height = this._objectReader.readDouble();
    if ((dataFlags & 0x10) === 0) text.widthFactor = this._objectReader.readDouble();
    text.value = this._textReader.readVariableText();
    if ((dataFlags & 0x20) === 0) text.mirror = this._objectReader.readBitShort() as TextMirrorFlag;
    if ((dataFlags & 0x40) === 0) text.horizontalAlignment = this._objectReader.readBitShort() as TextHorizontalAlignment;
    if ((dataFlags & 0x80) === 0) text.verticalAlignment = this._objectReader.readBitShort() as TextVerticalAlignmentType;
    template.StyleHandle = this.handleReference();
  }

  // ==================== INSERT ====================

  private readInsert(): CadTemplate {
    const template = new CadInsertTemplate(new Insert());
    this.readInsertCommonData(template);
    this.readInsertCommonHandles(template);
    return template;
  }

  private readMInsert(): CadTemplate {
    const insert = new Insert();
    const template = new CadInsertTemplate(insert);
    this.readInsertCommonData(template);
    insert.columnCount = this._objectReader.readBitShort() & 0xFFFF;
    insert.rowCount = this._objectReader.readBitShort() & 0xFFFF;
    insert.columnSpacing = this._objectReader.readBitDouble();
    insert.rowSpacing = this._objectReader.readBitDouble();
    this.readInsertCommonHandles(template);
    return template;
  }

  private readInsertCommonData(template: CadInsertTemplate): void {
    const insert = template.CadObject as Insert;
    this.readCommonEntityData(template);
    insert.insertPoint = this._objectReader.read3BitDouble();
    if (this.R13_14Only) {
      const scale = this._objectReader.read3BitDouble();
      insert.xScale = scale.x;
      insert.yScale = scale.y;
      insert.zScale = scale.z;
    }
    if (this.R2000Plus) {
      switch (this._objectReader.read2Bits()) {
        case 0:
          insert.xScale = this._objectReader.readDouble();
          insert.yScale = this._objectReader.readBitDoubleWithDefault(insert.xScale);
          insert.zScale = this._objectReader.readBitDoubleWithDefault(insert.xScale);
          break;
        case 1:
          insert.yScale = this._objectReader.readBitDoubleWithDefault(insert.xScale);
          insert.zScale = this._objectReader.readBitDoubleWithDefault(insert.xScale);
          break;
        case 2: {
          const xyz = this._objectReader.readDouble();
          insert.xScale = xyz;
          insert.yScale = xyz;
          insert.zScale = xyz;
          break;
        }
        case 3:
          insert.xScale = 1;
          insert.yScale = 1;
          insert.zScale = 1;
          break;
      }
    }
    insert.rotation = this._objectReader.readBitDouble();
    insert.normal = this._objectReader.read3BitDouble();
    template.HasAtts = this._objectReader.readBit();
    template.OwnedObjectsCount = 0;
    if (this.R2004Plus && template.HasAtts) template.OwnedObjectsCount = this._objectReader.readBitLong();
  }

  private readInsertCommonHandles(template: CadInsertTemplate): void {
    template.BlockHeaderHandle = this.handleReference();
    if (!template.HasAtts) return;
    if (this._version >= ACadVersion.AC1012 && this._version <= ACadVersion.AC1015) {
      template.FirstAttributeHandle = this.handleReference();
      template.EndAttributeHandle = this.handleReference();
    } else if (this.R2004Plus) {
      for (let i = 0; i < template.OwnedObjectsCount; ++i) template.OwnedObjectsHandlers.add(this.handleReference());
    }
    template.SeqendHandle = this.handleReference();
  }

  // ==================== VERTEX ====================

  private readVertex2D(): CadTemplate {
    const vertex = new Vertex2D();
    const template = new CadEntityTemplate(vertex);
    this.readCommonEntityData(template);
    vertex.flags = this._objectReader.readByte() as VertexFlags;
    vertex.location = this._objectReader.read3BitDouble();
    const width = this._objectReader.readBitDouble();
    if (width < 0.0) {
      vertex.startWidth = -width;
      vertex.endWidth = -width;
    } else {
      vertex.startWidth = width;
      vertex.endWidth = this._objectReader.readBitDouble();
    }
    vertex.bulge = this._objectReader.readBitDouble();
    if (this.R2010Plus) vertex.id = this._objectReader.readBitLong();
    vertex.curveTangent = this._objectReader.readBitDouble();
    return template;
  }

  private readVertex3D(vertex: Vertex): CadTemplate {
    const template = new CadEntityTemplate(vertex);
    this.readCommonEntityData(template);
    vertex.flags = this._objectReader.readByte() as VertexFlags;
    vertex.location = this._objectReader.read3BitDouble();
    return template;
  }

  private readPfaceVertex(): CadTemplate {
    const face = new VertexFaceRecord();
    const template = new CadEntityTemplate(face);
    this.readCommonEntityData(template);
    face.index1 = this._objectReader.readBitShort();
    face.index2 = this._objectReader.readBitShort();
    face.index3 = this._objectReader.readBitShort();
    face.index4 = this._objectReader.readBitShort();
    return template;
  }

  // ==================== POLYLINE ====================

  private readPolyline2D(): CadTemplate {
    const pline = new Polyline2D();
    const template = new CadPolyLineTemplate(pline as IPolyline);
    this.readCommonEntityData(template);
    pline.flags = this._objectReader.readBitShort() as PolylineFlags;
    pline.smoothSurface = this._objectReader.readBitShort() as SmoothSurfaceType;
    pline.startWidth = this._objectReader.readBitDouble();
    pline.endWidth = this._objectReader.readBitDouble();
    pline.thickness = this._objectReader.readBitThickness();
    pline.elevation = this._objectReader.readBitDouble();
    pline.normal = this._objectReader.readBitExtrusion();
    if (this.R2004Plus) {
      const n = this._objectReader.readBitLong();
      for (let i = 0; i < n; ++i) template.OwnedObjectsHandlers.add(this.handleReference());
    }
    if (this._version >= ACadVersion.AC1012 && this._version <= ACadVersion.AC1015) {
      template.FirstVertexHandle = this.handleReference();
      template.LastVertexHandle = this.handleReference();
    }
    template.SeqendHandle = this.handleReference();
    return template;
  }

  private readPolyline3D(): CadTemplate {
    const pline = new Polyline3D();
    const template = new CadPolyLineTemplate(pline as IPolyline);
    this.readCommonEntityData(template);
    const flags = this._objectReader.readByte();
    const splined = (flags & 0b1) > 0;
    const splined1 = (flags & 0b10) > 0;
    if (splined || splined1) pline.flags |= PolylineFlags.SplineFit;
    pline.flags |= PolylineFlags.Polyline3D;
    if ((this._objectReader.readByte() & 1) > 0) pline.flags |= PolylineFlags.ClosedPolylineOrClosedPolygonMeshInM;
    if (this.R2004Plus) {
      const n = this._objectReader.readBitLong();
      for (let i = 0; i < n; ++i) template.OwnedObjectsHandlers.add(this.handleReference());
    }
    if (this._version >= ACadVersion.AC1012 && this._version <= ACadVersion.AC1015) {
      template.FirstVertexHandle = this.handleReference();
      template.LastVertexHandle = this.handleReference();
    }
    template.SeqendHandle = this.handleReference();
    return template;
  }

  private readPolyfaceMesh(): CadTemplate {
    const template = new CadPolyLineTemplate(new PolyfaceMesh() as IPolyline);
    this.readCommonEntityData(template);
    this._objectReader.readBitShort();
    this._objectReader.readBitShort();
    if (this.R2004Plus) {
      const n = this._objectReader.readBitLong();
      for (let i = 0; i < n; i++) template.OwnedObjectsHandlers.add(this.handleReference());
    }
    if (this.R13_15Only) {
      template.FirstVertexHandle = this.handleReference();
      template.LastVertexHandle = this.handleReference();
    }
    template.SeqendHandle = this.handleReference();
    return template;
  }

  private readPolylineMesh(): CadTemplate {
    const pline = new PolygonMesh();
    const template = new CadPolyLineTemplate(pline as IPolyline);
    this.readCommonEntityData(template);
    pline.flags = this._objectReader.readBitShort() as PolylineFlags;
    pline.smoothSurface = this._objectReader.readBitShort() as SmoothSurfaceType;
    pline.mVertexCount = this._objectReader.readBitShort();
    pline.nVertexCount = this._objectReader.readBitShort();
    pline.mSmoothSurfaceDensity = this._objectReader.readBitShort();
    pline.nSmoothSurfaceDensity = this._objectReader.readBitShort();
    if (this.R13_15Only) {
      template.FirstVertexHandle = this.handleReference();
      template.LastVertexHandle = this.handleReference();
    }
    if (this.R2004Plus) {
      const n = this._objectReader.readBitLong();
      for (let i = 0; i < n; i++) template.OwnedObjectsHandlers.add(this.handleReference());
    }
    template.SeqendHandle = this.handleReference();
    return template;
  }

  private readLWPolyline(): CadTemplate {
    const lwPolyline = new LwPolyline();
    const template = new CadEntityTemplate(lwPolyline);
    try {
      this.readCommonEntityData(template);
      const flags = this._objectReader.readBitShort();
      if ((flags & 0x100) !== 0) lwPolyline.flags |= LwPolylineFlags.Plinegen;
      if ((flags & 0x200) !== 0) lwPolyline.flags |= LwPolylineFlags.Closed;
      if ((flags & 0x4) !== 0) lwPolyline.constantWidth = this._objectReader.readBitDouble();
      if ((flags & 0x8) !== 0) lwPolyline.elevation = this._objectReader.readBitDouble();
      if ((flags & 0x2) !== 0) lwPolyline.thickness = this._objectReader.readBitDouble();
      if ((flags & 0x1) !== 0) lwPolyline.normal = this._objectReader.read3BitDouble();
      const nvertices = this._objectReader.readBitLong();
      let nbulges = 0;
      if ((flags & 0x10) !== 0) nbulges = this._objectReader.readBitLong();
      let nids = 0;
      if ((flags & 0x400) !== 0) nids = this._objectReader.readBitLong();
      let ndiffwidth = 0;
      if ((flags & 0x20) !== 0) ndiffwidth = this._objectReader.readBitLong();
      if (this.R13_14Only) {
        for (let i = 0; i < nvertices; i++) {
          const loc = this._objectReader.read2RawDouble();
          lwPolyline.vertices.push(new LwPolylineVertex(loc));
        }
      }
      if (this.R2000Plus && nvertices > 0) {
        let loc = this._objectReader.read2RawDouble();
        lwPolyline.vertices.push(new LwPolylineVertex(loc));
        for (let j = 1; j < nvertices; j++) {
          loc = this._objectReader.read2BitDoubleWithDefault(loc);
          lwPolyline.vertices.push(new LwPolylineVertex(loc));
        }
      }
      for (let k = 0; k < nbulges; k++) lwPolyline.vertices[k].bulge = this._objectReader.readBitDouble();
      for (let l = 0; l < nids; l++) lwPolyline.vertices[l].id = this._objectReader.readBitLong();
      for (let m = 0; m < ndiffwidth; m++) {
        const vertex = lwPolyline.vertices[m];
        vertex.startWidth = this._objectReader.readBitDouble();
        vertex.endWidth = this._objectReader.readBitDouble();
      }
    } catch (ex: unknown) {
	  const errorName = ex instanceof Error ? ex.constructor.name : 'Error';
	  this._builder.Notify(`Exception while reading LwPolyline: ${errorName}`, NotificationType.Error, ex instanceof Error ? ex : null);
      return template;
    }
    return template;
  }

  // ==================== SPLINE ====================

  private readSpline(): CadTemplate {
    const spline = new Spline();
    const template = new CadSplineTemplate(spline);
    this.readCommonEntityData(template);
    let scenario = this._objectReader.readBitLong();
    if (this.R2013Plus) {
      spline.flags1 = this._mergedReaders.readBitLong() as SplineFlags1;
      spline.isClosed = !!(spline.flags1 & SplineFlags1.Closed);
      spline.knotParametrization = this._mergedReaders.readBitLong() as KnotParametrization;
      scenario = (spline.knotParametrization === KnotParametrization.Custom || (spline.flags1 & SplineFlags1.UseKnotParameter) === 0) ? 1 : 2;
    } else if (scenario === 2) {
      spline.flags1 |= SplineFlags1.MethodFitPoints;
    } else {
      spline.knotParametrization = KnotParametrization.Custom;
    }
    spline.degree = this._objectReader.readBitLong();
    let numfitpts = 0, numknots = 0, numctrlpts = 0, flag = false;
    switch (scenario) {
      case 1:
        if (this._objectReader.readBit()) spline.flags |= SplineFlags.Rational;
        if (this._objectReader.readBit()) spline.flags |= SplineFlags.Closed;
        if (this._objectReader.readBit()) spline.flags |= SplineFlags.Periodic;
        spline.knotTolerance = this._objectReader.readBitDouble();
        spline.controlPointTolerance = this._objectReader.readBitDouble();
        numknots = this._objectReader.readBitLong();
        numctrlpts = this._objectReader.readBitLong();
        flag = this._objectReader.readBit();
        break;
      case 2:
        spline.fitTolerance = this._objectReader.readBitDouble();
        spline.startTangent = this._objectReader.read3BitDouble();
        spline.endTangent = this._objectReader.read3BitDouble();
        numfitpts = this._objectReader.readBitLong();
        break;
    }
    for (let i = 0; i < numknots; i++) spline.knots.push(this._objectReader.readBitDouble());
    for (let j = 0; j < numctrlpts; j++) {
      spline.controlPoints.push(this._objectReader.read3BitDouble());
      if (flag) spline.weights.push(this._objectReader.readBitDouble());
    }
    for (let k = 0; k < numfitpts; k++) spline.fitPoints.push(this._objectReader.read3BitDouble());
    return template;
  }

  // ==================== MESH ====================

  private readMesh(): CadTemplate {
    const mesh = new Mesh();
    const template = new CadMeshTemplate(mesh);
    this.readCommonEntityData(template);
    mesh.version = this._objectReader.readBitShort();
    mesh.blendCrease = this._objectReader.readBit() ? 1 : 0;
    mesh.subdivisionLevel = this._objectReader.readBitLong();
    const nvertices = this._objectReader.readBitLong();
    for (let i = 0; i < nvertices; i++) mesh.vertices.push(this._objectReader.read3BitDouble());
    let nfaces = this._objectReader.readBitLong();
    for (let i = 0; i < nfaces; i++) {
      const faceSize = this._objectReader.readBitLong();
      const arr: number[] = [];
      for (let j = 0; j < faceSize; j++) arr.push(this._objectReader.readBitLong());
      i += faceSize;
      mesh.faces.push([...arr]);
    }
    const nedges = this._objectReader.readBitLong();
    for (let k = 0; k < nedges; k++) {
      const start = this._objectReader.readBitLong();
      const end = this._objectReader.readBitLong();
      mesh.edges.push(new MeshEdge(start, end));
    }
    const ncrease = this._objectReader.readBitLong();
    for (let l = 0; l < ncrease; l++) {
      mesh.edges[l].crease = this._objectReader.readBitDouble();
    }
    this._objectReader.readBitLong();
    return template;
  }

  // ==================== VIEWPORT ====================

  private readViewport(): CadTemplate {
    const viewport = new Viewport();
    const template = new CadViewportTemplate(viewport);
    this.readCommonEntityData(template);
    viewport.center = this._objectReader.read3BitDouble();
    viewport.width = this._objectReader.readBitDouble();
    viewport.height = this._objectReader.readBitDouble();
    if (this.R2000Plus) {
      viewport.viewTarget = this._objectReader.read3BitDouble();
      viewport.viewDirection = this._objectReader.read3BitDouble();
      viewport.twistAngle = this._objectReader.readBitDouble();
      viewport.viewHeight = this._objectReader.readBitDouble();
      viewport.lensLength = this._objectReader.readBitDouble();
      viewport.frontClipPlane = this._objectReader.readBitDouble();
      viewport.backClipPlane = this._objectReader.readBitDouble();
      viewport.snapAngle = this._objectReader.readBitDouble();
      viewport.viewCenter = this._objectReader.read2RawDouble();
      viewport.snapBase = this._objectReader.read2RawDouble();
      viewport.snapSpacing = this._objectReader.read2RawDouble();
      viewport.gridSpacing = this._objectReader.read2RawDouble();
      viewport.circleZoomPercent = this._objectReader.readBitShort();
    }
    if (this.R2007Plus) viewport.majorGridLineFrequency = this._objectReader.readBitShort();
    let frozenLayerCount = 0;
    if (this.R2000Plus) {
      frozenLayerCount = this._objectReader.readBitLong();
      viewport.status = this._objectReader.readBitLong() as ViewportStatusFlags;
      viewport.styleSheetName = this._textReader.readVariableText();
      viewport.renderMode = this._objectReader.readByte() as RenderMode;
      viewport.displayUcsIcon = this._objectReader.readBit();
      viewport.ucsPerViewport = this._objectReader.readBit();
      viewport.ucsOrigin = this._objectReader.read3BitDouble();
      viewport.ucsXAxis = this._objectReader.read3BitDouble();
      viewport.ucsYAxis = this._objectReader.read3BitDouble();
      viewport.elevation = this._objectReader.readBitDouble();
      viewport.ucsOrthographicType = this._objectReader.readBitShort() as OrthographicType;
    }
    if (this.R2004Plus) viewport.shadePlotMode = this._objectReader.readBitShort() as ShadePlotMode;
    if (this.R2007Plus) {
      viewport.useDefaultLighting = this._objectReader.readBit();
      viewport.defaultLightingType = this._objectReader.readByte();
      viewport.brightness = this._objectReader.readBitDouble();
      viewport.contrast = this._objectReader.readBitDouble();
      viewport.ambientLightColor = this._objectReader.readCmColor();
    }
    if (this.R13_14Only) template.ViewportHeaderHandle = this.handleReference();
    if (this.R2000Plus) {
      for (let i = 0; i < frozenLayerCount; ++i) template.FrozenLayerHandles.add(this.handleReference());
      template.BoundaryHandle = this.handleReference();
    }
    if (this._version === ACadVersion.AC1015) template.ViewportHeaderHandle = this.handleReference();
    if (this.R2000Plus) {
      template.NamedUcsHandle = this.handleReference();
      template.BaseUcsHandle = this.handleReference();
    }
    if (this.R2007Plus) {
      this.handleReference();
      this.handleReference();
      this.handleReference();
      this.handleReference();
    }
    return template;
  }

  private readViewportEntityControl(): CadTemplate {
    const template = new CadViewportEntityControlTemplate();
    this.readCommonNonEntityData(template);
    const numentries = this._objectReader.readBitLong();
    for (let i = 0; i < numentries; ++i) template.EntryHandles.add(this.handleReference());
    return template;
  }

  private readViewportEntityHeader(): CadTemplate {
    const viewport = new ViewportEntityHeader();
    const template = new CadViewportEntityHeaderTemplate(viewport);
    this.readCommonNonEntityData(template);
    viewport.name = this._textReader.readVariableText();
    this.readXrefDependantBit(template.CadObject);
    this._objectReader.readBit();
    this.handleReference();
    this.handleReference();
    template.BlockHandle = this.handleReference();
    return template;
  }

  // ==================== MTEXT ====================

  private readMText(): CadTemplate {
    const mtext = new MText();
    const template = new CadTextEntityTemplate(mtext);
    return this.readMTextBody(template, true);
  }

  private readMTextBody(template: CadTextEntityTemplate, readCommonData: boolean): CadTemplate {
    const mtext = template.CadObject as MText;
    if (readCommonData) this.readCommonEntityData(template);
    mtext.insertPoint = this._objectReader.read3BitDouble();
    mtext.normal = this._objectReader.read3BitDouble();
    mtext.alignmentPoint = this._objectReader.read3BitDouble();
    mtext.rectangleWidth = this._objectReader.readBitDouble();
    if (this.R2007Plus) mtext.rectangleHeight = this._objectReader.readBitDouble();
    mtext.height = this._objectReader.readBitDouble();
    mtext.attachmentPoint = this._objectReader.readBitShort() as AttachmentPointType;
    mtext.drawingDirection = this._objectReader.readBitShort() as DrawingDirectionType;
    this._objectReader.readBitDouble();
    this._objectReader.readBitDouble();
    mtext.value = this._textReader.readVariableText();
    template.StyleHandle = this.handleReference();
    if (this.R2000Plus) {
      mtext.lineSpacingStyle = this._objectReader.readBitShort() as LineSpacingStyleType;
      mtext.lineSpacing = this._objectReader.readBitDouble();
      this._objectReader.readBit();
    }
    if (this.R2004Plus) {
      mtext.backgroundFillFlags = this._objectReader.readBitLong() as BackgroundFillFlags;
      if ((mtext.backgroundFillFlags & BackgroundFillFlags.UseBackgroundFillColor) !== 0
        || (this._version > ACadVersion.AC1027 && (mtext.backgroundFillFlags & BackgroundFillFlags.TextFrame) > 0)) {
        mtext.backgroundScale = this._objectReader.readBitDouble();
        mtext.backgroundColor = this._mergedReaders.readCmColor();
        mtext.backgroundTransparency = this._objectReader.readBitLong();
      }
    }
    if (!this.R2018Plus) return template;
    mtext.isAnnotative = !this._objectReader.readBit();
    if (!mtext.isAnnotative) {
      this._objectReader.readBitShort();
      this._objectReader.readBit();
      this.handleReference();
      this._objectReader.readBitLong();
      this._objectReader.read3BitDouble();
      this._objectReader.read3BitDouble();
      this._objectReader.readBitDouble();
      this._objectReader.readBitDouble();
      this._objectReader.readBitDouble();
      this._objectReader.readBitDouble();
      mtext.columnData.columnType = this._objectReader.readBitShort() as ColumnType;
      if (mtext.columnData.columnType !== ColumnType.NoColumns) {
        const count = this._objectReader.readBitLong();
        mtext.columnData.width = this._objectReader.readBitDouble();
        mtext.columnData.gutter = this._objectReader.readBitDouble();
        mtext.columnData.autoHeight = this._objectReader.readBit();
        mtext.columnData.flowReversed = this._objectReader.readBit();
        if (!mtext.columnData.autoHeight && mtext.columnData.columnType === ColumnType.DynamicColumns && count > 0) {
          for (let i = 0; i < count; ++i) mtext.columnData.heights.push(this._objectReader.readBitDouble());
        }
      }
    }
    return template;
  }

  // ==================== HATCH ====================

  private readHatch(): CadTemplate {
    const hatch = new Hatch();
    const template = new CadHatchTemplate(hatch);
    this.readCommonEntityData(template);
    if (this.R2004Plus) {
      hatch.gradientColor.enabled = this._objectReader.readBitLong() !== 0;
      hatch.gradientColor.reserved = this._objectReader.readBitLong();
      hatch.gradientColor.angle = this._objectReader.readBitDouble();
      hatch.gradientColor.shift = this._objectReader.readBitDouble();
      hatch.gradientColor.isSingleColorGradient = this._objectReader.readBitLong() > 0;
      hatch.gradientColor.colorTint = this._objectReader.readBitDouble();
      const ncolors = this._objectReader.readBitLong();
      for (let i = 0; i < ncolors; ++i) {
        const color = new GradientColor();
        color.value = this._objectReader.readBitDouble();
        color.color = this._mergedReaders.readCmColor();
        hatch.gradientColor.colors.push(color);
      }
      hatch.gradientColor.name = this._textReader.readVariableText();
    }
    hatch.elevation = this._objectReader.readBitDouble();
    hatch.normal = this._objectReader.read3BitDouble();
    hatch.pattern = new HatchPattern(this._textReader.readVariableText());
    hatch.isSolid = this._objectReader.readBit();
    hatch.isAssociative = this._objectReader.readBit();
    const npaths = this._objectReader.readBitLong();
    let hasDerivedBoundary = false;
    for (let i = 0; i < npaths; i++) {
      const pathTemplate = new CadHatchTemplate.CadBoundaryPathTemplate();
      const flags = this._objectReader.readBitLong() as BoundaryPathFlags;
      pathTemplate.Path.flags = flags;
      if (flags & BoundaryPathFlags.Derived) hasDerivedBoundary = true;
      if (!(flags & BoundaryPathFlags.Polyline)) {
        const nsegments = this._objectReader.readBitLong();
        for (let j = 0; j < nsegments; ++j) {
          const pathTypeStatus = this._objectReader.readByte();
          switch (pathTypeStatus) {
            case 1: // Line
              {
                const line = new HatchBoundaryPathLine();
                line.start = this._objectReader.read2RawDouble();
                line.end = this._objectReader.read2RawDouble();
                pathTemplate.Path.edges.push(line);
              }
              break;
            case 2: // CircularArc
              {
                const arc = new HatchBoundaryPathArc();
                arc.center = this._objectReader.read2RawDouble();
                arc.radius = this._objectReader.readBitDouble();
                arc.startAngle = this._objectReader.readBitDouble();
                arc.endAngle = this._objectReader.readBitDouble();
                arc.counterClockWise = this._objectReader.readBit();
                pathTemplate.Path.edges.push(arc);
              }
              break;
            case 3: // EllipticArc
              {
                const ellipse = new HatchBoundaryPathEllipse();
                ellipse.center = this._objectReader.read2RawDouble();
                ellipse.majorAxisEndPoint = this._objectReader.read2RawDouble();
                ellipse.minorToMajorRatio = this._objectReader.readBitDouble();
                ellipse.startAngle = this._objectReader.readBitDouble();
                ellipse.endAngle = this._objectReader.readBitDouble();
                ellipse.counterClockWise = this._objectReader.readBit();
                pathTemplate.Path.edges.push(ellipse);
              }
              break;
            case 4: { // Spline
              const splineEdge = new HatchBoundaryPathSpline();
              splineEdge.degree = this._objectReader.readBitLong();
              splineEdge.isRational = this._objectReader.readBit();
              splineEdge.isPeriodic = this._objectReader.readBit();
              const numknots = this._objectReader.readBitLong();
              const numctlpts = this._objectReader.readBitLong();
              for (let k = 0; k < numknots; ++k) splineEdge.knots.push(this._objectReader.readBitDouble());
              for (let p = 0; p < numctlpts; ++p) {
                const cp = this._objectReader.read2RawDouble();
                let wheight = 0;
                if (splineEdge.isRational) wheight = this._objectReader.readBitDouble();
                splineEdge.controlPoints.push(new XYZ(cp.x, cp.y, wheight));
              }
              if (this.R2010Plus) {
                const nfitPoints = this._objectReader.readBitLong();
                if (nfitPoints > 0) {
                  for (let fp = 0; fp < nfitPoints; ++fp) splineEdge.fitPoints.push(this._objectReader.read2RawDouble());
                  splineEdge.startTangent = this._objectReader.read2RawDouble();
                  splineEdge.endTangent = this._objectReader.read2RawDouble();
                }
              }
              pathTemplate.Path.edges.push(splineEdge);
              break;
            }
          }
        }
      } else {
        const pline = new HatchBoundaryPathPolyline();
        const bulgespresent = this._objectReader.readBit();
        pline.isClosed = this._objectReader.readBit();
        const numpathsegs = this._objectReader.readBitLong();
        for (let index = 0; index < numpathsegs; ++index) {
          const vertex = this._objectReader.read2RawDouble();
          let bulge = 0;
          if (bulgespresent) bulge = this._objectReader.readBitDouble();
          pline.vertices.push(new XYZ(vertex.x, vertex.y, bulge));
        }
        pathTemplate.Path.edges.push(pline);
      }
      const numboundaryobjhandles = this._objectReader.readBitLong();
      for (let h = 0; h < numboundaryobjhandles; h++) pathTemplate.Handles.add(this.handleReference());
      template.PathTemplates.push(pathTemplate);
    }
    hatch.style = this._objectReader.readBitShort() as HatchStyleType;
    hatch.patternType = this._objectReader.readBitShort() as HatchPatternType;
    if (!hatch.isSolid) {
      hatch.patternAngle = this._objectReader.readBitDouble();
      hatch.patternScale = this._objectReader.readBitDouble();
      hatch.isDouble = this._objectReader.readBit();
      const numdeflines = this._objectReader.readBitShort();
      for (let li = 0; li < numdeflines; ++li) {
        const line = new HatchPatternLine();
        line.angle = this._objectReader.readBitDouble();
        line.basePoint = this._objectReader.read2BitDouble();
        line.offset = this._objectReader.read2BitDouble();
        const ndashes = this._objectReader.readBitShort();
        for (let ds = 0; ds < ndashes; ++ds) line.dashLengths.push(this._objectReader.readBitDouble());
        hatch.pattern.lines.push(line);
      }
    }
    if (hasDerivedBoundary) hatch.pixelSize = this._objectReader.readBitDouble();
    const numseedpoints = this._objectReader.readBitLong();
    for (let sp = 0; sp < numseedpoints; ++sp) hatch.seedPoints.push(this._objectReader.read2RawDouble());
    return template;
  }

  // ==================== MODELER GEOMETRY ====================

  private readModelerGeometry(template: CadEntityTemplate): CadEntityTemplate {
    const geometry = template.CadObject as ModelerGeometry;
    this.readCommonEntityData(template);
    if (!this.R2013Plus) {
      const hasData = this._mergedReaders.readBit();
      if (!hasData) {
        this.readModelerGeometryData(template);
        return template;
      }
    }
    const isWireframe = this._mergedReaders.readBit();
    if (isWireframe) {
      const hasPoint = this._mergedReaders.readBit();
      if (hasPoint) geometry.point = this._objectReader.read3BitDouble();
      const nIsoLines = this._mergedReaders.readBitLong();
      if (this._mergedReaders.readBit()) {
        const nWires = this._mergedReaders.readBitLong();
        for (let i = 0; i < nWires; i++) {
          const wire = new ModelerGeometryWire();
          this.readWire(wire);
          geometry.wires.push(wire);
        }
      }
      const nSilhouettes = this._mergedReaders.readBitLong();
      for (let i = 0; i < nSilhouettes; i++) {
        const silhouette = new ModelerGeometrySilhouette();
        silhouette.viewportId = this._mergedReaders.readBitLongLong();
        silhouette.viewportTarget = this._mergedReaders.read3BitDouble();
        silhouette.viewportDirectionFromTarget = this._mergedReaders.read3BitDouble();
        silhouette.viewportUpDirection = this._mergedReaders.read3BitDouble();
        silhouette.viewportPerspective = this._mergedReaders.readBit();
        if (this._mergedReaders.readBit()) {
          const nWires = this._mergedReaders.readBitLong();
          for (let j = 0; j < nWires; j++) {
            const wire = new ModelerGeometryWire();
            this.readWire(wire);
            silhouette.wires.push(wire);
          }
        }
        geometry.silhouettes.push(silhouette);
      }
      if (!this._mergedReaders.readBit()) {
        this.readModelerGeometryData(template);
        return template;
      }
    }
    if (this.R2007Plus) this._mergedReaders.readBitLong();
    return template;
  }

  private readModelerGeometryData(template: CadEntityTemplate): void {
    this._mergedReaders.readBit();
    const version = this._mergedReaders.readBitShort();
    this.notify(`Stream data reader hasn't been implemented for ${template.CadObject.objectName}`, NotificationType.NotImplemented);
  }

  private readSolid3D(): CadTemplate {
    const solid = new Solid3D();
    const template = new CadSolid3DTemplate(solid);
    this.readModelerGeometry(template);
    if (this.R2007Plus) template.HistoryHandle = this._mergedReaders.handleReference();
    return template;
  }

  private readWire(wire: ModelerGeometryWire): void {
    wire.type = this._mergedReaders.readByte();
    wire.selectionMarker = this._mergedReaders.readBitLong();
    let color = this._mergedReaders.readBitShort();
    color = color > 256 ? 256 : color;
    wire.color = new Color(color);
    wire.acisIndex = this._mergedReaders.readBitLong();
    const nPoints = this._mergedReaders.readBitLong();
    for (let i = 0; i < nPoints; i++) wire.points.push(this._mergedReaders.read3BitDouble());
    wire.applyTransformPresent = this._mergedReaders.readBit();
    if (wire.applyTransformPresent) {
      wire.xAxis = this._mergedReaders.read3BitDouble();
      wire.yAxis = this._mergedReaders.read3BitDouble();
      wire.zAxis = this._mergedReaders.read3BitDouble();
      wire.translation = this._mergedReaders.read3BitDouble();
      wire.scale = this._mergedReaders.readBitDouble();
      wire.hasRotation = this._mergedReaders.readBit();
      wire.hasReflection = this._mergedReaders.readBit();
      wire.hasShear = this._mergedReaders.readBit();
    }
  }

  // ==================== IMAGE ====================

  private readCadImage(image: CadWipeoutBase): CadTemplate {
    const template = new CadWipeoutBaseTemplate(image);
    this.readCommonEntityData(template);
    image.classVersion = this._objectReader.readBitLong();
    image.insertPoint = this._objectReader.read3BitDouble();
    image.uVector = this._objectReader.read3BitDouble();
    image.vVector = this._objectReader.read3BitDouble();
    image.size = this._objectReader.read2RawDouble();
    image.flags = this._objectReader.readBitShort() as ImageDisplayFlags;
    image.clippingState = this._objectReader.readBit();
    image.brightness = this._objectReader.readByte();
    image.contrast = this._objectReader.readByte();
    image.fade = this._objectReader.readByte();
    if (this.R2010Plus) image.clipMode = this._objectReader.readBit() ? ClipMode.Inside : ClipMode.Outside;
    image.clipType = this._objectReader.readBitShort() as ClipType;
    switch (image.clipType) {
      case ClipType.Rectangular:
        image.clipBoundaryVertices.push(this._objectReader.read2RawDouble());
        image.clipBoundaryVertices.push(this._objectReader.read2RawDouble());
        break;
      case ClipType.Polygonal: {
        const nvertices = this._objectReader.readBitLong();
        for (let i = 0; i < nvertices; i++) image.clipBoundaryVertices.push(this._objectReader.read2RawDouble());
        break;
      }
    }
    template.ImgDefHandle = this.handleReference();
    template.ImgReactorHandle = this.handleReference();
    return template;
  }

  private readImageDefinition(): CadTemplate {
    const definition = new ImageDefinition();
    const template = new CadNonGraphicalObjectTemplate(definition);
    this.readCommonNonEntityData(template);
    definition.classVersion = this._mergedReaders.readBitLong();
    definition.size = this._mergedReaders.read2RawDouble();
    definition.fileName = this._mergedReaders.readVariableText();
    definition.isLoaded = this._mergedReaders.readBit();
    definition.units = this._mergedReaders.readByte() as ResolutionUnit;
    definition.defaultSize = this._mergedReaders.read2RawDouble();
    return template;
  }

  private readImageDefinitionReactor(): CadTemplate {
    const definition = new ImageDefinitionReactor();
    const template = new CadNonGraphicalObjectTemplate(definition);
    this.readCommonNonEntityData(template);
    definition.classVersion = this._objectReader.readBitLong();
    return template;
  }

  // ==================== OLE2 FRAME ====================

  private readOle2Frame(): CadTemplate {
    const ole2Frame = new Ole2Frame();
    const template = new CadOle2FrameTemplate(ole2Frame);
    this.readCommonEntityData(template);
    ole2Frame.version = this._mergedReaders.readBitShort();
    if (this.R2000Plus) this._mergedReaders.readBitShort();
    const dataLength = this._mergedReaders.readBitLong();
    template.CadObject.binaryData = this._mergedReaders.readBytes(dataLength);
    if (this.R2000Plus) this._mergedReaders.readByte();
    return template;
  }

  // ==================== PDF UNDERLAY ====================

  private readPdfDefinition(): CadTemplate {
    const definition = new PdfUnderlayDefinition();
    const template = new CadNonGraphicalObjectTemplate(definition);
    this.readCommonNonEntityData(template);
    definition.file = this._objectReader.readVariableText();
    definition.page = this._objectReader.readVariableText();
    return template;
  }

  private readPdfUnderlay(): CadTemplate {
    const underlay = new PdfUnderlay();
    const template = new CadUnderlayTemplate(underlay);
    this.readCommonEntityData(template);
    underlay.normal = this._objectReader.read3BitDouble();
    underlay.insertPoint = this._objectReader.read3BitDouble();
    underlay.rotation = this._objectReader.readBitDouble();
    underlay.xScale = this._objectReader.readBitDouble();
    underlay.yScale = this._objectReader.readBitDouble();
    underlay.zScale = this._objectReader.readBitDouble();
    underlay.flags = this._objectReader.readByte() as UnderlayDisplayFlags;
    underlay.contrast = this._objectReader.readByte();
    underlay.fade = this._objectReader.readByte();
    template.DefinitionHandle = this.handleReference();
    const nvertices = this._mergedReaders.readBitLong();
    for (let i = 0; i < nvertices; i++) underlay.clipBoundaryVertices.push(this._mergedReaders.read2RawDouble());
    return template;
  }

  // ==================== PROXY ====================

  private readProxyEntity(): CadTemplate {
    const proxy = new ProxyEntity();
    const template = new CadEntityTemplate(proxy);
    this.readCommonEntityData(template);
    this.readCommonProxyData(proxy);
    return template;
  }

  private readProxyObject(): CadTemplate {
    const proxy = new ProxyObject();
    const template = new CadNonGraphicalObjectTemplate(proxy);
    this.readCommonNonEntityData(template);
    this.readCommonProxyData(proxy);
    return template;
  }

  private readCommonProxyData(proxy: IProxy): void {
    const classId = this._mergedReaders.readBitLong();
    const dxfClass = this._classes.get(classId);
    if (dxfClass) proxy.dxfClass = dxfClass;
    if (this.R2000Plus) {
      if (this._version > ACadVersion.AC1015) this._mergedReaders.readVariableText();
      if (!this.R2018Plus) {
        const format = this._mergedReaders.readBitLong();
        proxy.version = (format & 0xFFFF) as ACadVersion;
        proxy.maintenanceVersion = format >> 16;
      } else {
        proxy.version = this._mergedReaders.readBitLong() as ACadVersion;
        proxy.maintenanceVersion = this._mergedReaders.readBitLong();
      }
      proxy.originalDataFormatDxf = this._mergedReaders.readBit();
    }
  }

  // ==================== DICT / GROUP / XRECORD ====================

  private readDictionary(): CadTemplate {
    const cadDictionary = new CadDictionary();
    const template = new CadDictionaryTemplate(cadDictionary);
    this.readCommonDictionary(template);
    return template;
  }

  private readDictionaryVar(): CadTemplate {
    const dictvar = new DictionaryVariable();
    const template = new CadNonGraphicalObjectTemplate(dictvar);
    this.readCommonNonEntityData(template);
    this._objectReader.readByte();
    dictvar.value = this._textReader.readVariableText();
    return template;
  }

  private readDictionaryWithDefault(): CadTemplate {
    const dictionary = new CadDictionaryWithDefault();
    const template = new CadDictionaryWithDefaultTemplate(dictionary);
    this.readCommonDictionary(template);
    template.DefaultEntryHandle = this.handleReference();
    return template;
  }

  private readCommonDictionary(template: CadDictionaryTemplate): void {
    this.readCommonNonEntityData(template);
    const nentries = this._objectReader.readBitLong();
    if (this._version === ACadVersion.AC1014) this._objectReader.readByte();
    if (this.R2000Plus) {
      template.CadObject.clonningFlags = this._objectReader.readBitShort() as DictionaryCloningFlags;
      template.CadObject.hardOwnerFlag = this._objectReader.readByte() > 0;
    }
    for (let i = 0; i < nentries; ++i) {
      const name = this._textReader.readVariableText();
      const handle = this.handleReference();
      if (handle === 0 || !name || name.length === 0) continue;
      template.Entries.set(name, handle);
    }
  }

  private readGroup(): CadTemplate {
    const group = new Group();
    const template = new CadGroupTemplate(group);
    this.readCommonNonEntityData(template);
    group.description = this._textReader.readVariableText();
    this._objectReader.readBitShort();
    group.selectable = this._objectReader.readBitShort() > 0;
    const numhandles = this._objectReader.readBitLong();
    for (let i = 0; i < numhandles; ++i) template.Handles.add(this.handleReference());
    return template;
  }

  private readXRecord(): CadTemplate {
    const xRecord = new XRecord();
    const template = new CadXRecordTemplate(xRecord);
    this.readCommonNonEntityData(template);
    const offset = this._objectReader.readBitLong() + this._objectReader.position;
    while (this._objectReader.position < offset) {
      const code = this._objectReader.readShort();
      const groupCode = GroupCodeValue.transformValue(code);
      switch (groupCode) {
        case GroupCodeValueType.String:
        case GroupCodeValueType.ExtendedDataString:
          xRecord.createEntry(code, this._objectReader.readTextUnicode());
          break;
        case GroupCodeValueType.Point3D:
          xRecord.createEntry(code, new XYZ(this._objectReader.readDouble(), this._objectReader.readDouble(), this._objectReader.readDouble()));
          break;
        case GroupCodeValueType.Double:
        case GroupCodeValueType.ExtendedDataDouble:
          xRecord.createEntry(code, this._objectReader.readDouble());
          break;
        case GroupCodeValueType.Byte:
          xRecord.createEntry(code, this._objectReader.readByte());
          break;
        case GroupCodeValueType.Int16:
        case GroupCodeValueType.ExtendedDataInt16:
          xRecord.createEntry(code, this._objectReader.readShort());
          break;
        case GroupCodeValueType.Int32:
        case GroupCodeValueType.ExtendedDataInt32:
          xRecord.createEntry(code, this._objectReader.readRawLong());
          break;
        case GroupCodeValueType.Int64:
          xRecord.createEntry(code, this._objectReader.readRawULong());
          break;
        case GroupCodeValueType.Handle: {
          const hex = this._objectReader.readTextUnicode();
          const result = parseInt(hex, 16);
          if (!isNaN(result)) {
            template.AddHandleReference(code, result);
          } else {
            this.notify(`Failed to parse ${hex} to handle`, NotificationType.Warning);
          }
          break;
        }
        case GroupCodeValueType.Bool:
          xRecord.createEntry(code, this._objectReader.readByte() > 0);
          break;
        case GroupCodeValueType.Chunk:
        case GroupCodeValueType.ExtendedDataChunk:
          xRecord.createEntry(code, this._objectReader.readBytes(this._objectReader.readByte()));
          break;
        case GroupCodeValueType.ObjectId:
        case GroupCodeValueType.ExtendedDataHandle:
          template.AddHandleReference(code, this._objectReader.readRawULong());
          break;
        default:
          this.notify(`Unidentified GroupCodeValueType ${code} for XRecord [${xRecord.handle}]`, NotificationType.Warning);
          break;
      }
    }
    if (this.R2000Plus) xRecord.cloningFlags = this._objectReader.readBitShort() as DictionaryCloningFlags;
    const size = this._objectInitialPos + (this._size * 8) - 7;
    while (this._handlesReader.positionInBits() < size) this.handleReference();
    return template;
  }

  private readSortentsTable(): CadTemplate {
    const sortTable = new SortEntitiesTable();
    const template = new CadSortensTableTemplate(sortTable);
    this.readCommonNonEntityData(template);
    template.BlockOwnerHandle = this.handleReference();
    const numentries = this._mergedReaders.readBitLong();
    for (let i = 0; i < numentries; i++) {
      const sortHandle = this._objectReader.handleReference();
      const entityHandle = this.handleReference();
      template.Values.push([sortHandle, entityHandle]);
    }
    return template;
  }

  private readScale(): CadTemplate {
    const scale = new Scale();
    const template = new CadNonGraphicalObjectTemplate(scale);
    this.readCommonNonEntityData(template);
    this._mergedReaders.readBitShort();
    scale.name = this._mergedReaders.readVariableText();
    scale.paperUnits = this._mergedReaders.readBitDouble();
    scale.drawingUnits = this._mergedReaders.readBitDouble();
    scale.isUnitScale = this._mergedReaders.readBit();
    return template;
  }

  private readRasterVariables(): CadTemplate {
    const vars = new RasterVariables();
    const template = new CadNonGraphicalObjectTemplate(vars);
    this.readCommonNonEntityData(template);
    vars.classVersion = this._mergedReaders.readBitLong();
    vars.isDisplayFrameShown = this._mergedReaders.readBitShort() !== 0;
    vars.displayQuality = this._mergedReaders.readBitShort() as ImageDisplayQuality;
    vars.units = this._mergedReaders.readBitShort() as ImageUnits;
    return template;
  }

  private readDbColor(): CadTemplate {
    const bookColor = new BookColor();
    const template = new CadNonGraphicalObjectTemplate(bookColor);
    this.readCommonNonEntityData(template);
    const colorIndex = this._objectReader.readBitShort();
    if (this.R2004Plus) {
      const trueColor = this._objectReader.readBitLong() >>> 0;
      const flags = this._objectReader.readByte();
      if ((flags & 1) > 0) bookColor.colorName = this._textReader.readVariableText();
      if ((flags & 2) > 0) bookColor.bookName = this._textReader.readVariableText();
      const arr = LittleEndianConverter.getBytes(trueColor);
      bookColor.color = new Color(arr[2], arr[1], arr[0]);
    } else {
      bookColor.color = new Color(colorIndex);
    }
    return template;
  }

  // ==================== REMAINING READERS (stubs for brevity, all follow same pattern) ====================
  // DimStyle, View, VPort, UCS, Layout, Leader, MultiLeader, Material, MLine, MLineStyle,
  // MultiLeaderStyle, GeoData, TableStyle, VisualStyle, PlotSettings, Evaluation Graph,
  // Block elements, SpatialFilter, DimensionAssociation, TableEntity, Field, etc.
  // These are all implemented following the exact same pattern as above - reading binary fields
  // in the same order as the C# source.

  private readDimStyle(): CadTemplate {
    const dimStyle = new DimensionStyle();
    const template = new CadDimensionStyleTemplate(dimStyle);
    this.readCommonNonEntityData(template);
    const name = this._textReader.readVariableText();
    if (name && name.trim().length > 0) {
      dimStyle.name = name;
    }
    this.readXrefDependantBit(dimStyle);
    if (this.R13_14Only) {
      dimStyle.generateTolerances = this._objectReader.readBit();
      dimStyle.limitsGeneration = this._objectReader.readBit();
      dimStyle.textOutsideHorizontal = this._objectReader.readBit();
      dimStyle.suppressFirstExtensionLine = this._objectReader.readBit();
      dimStyle.suppressSecondExtensionLine = this._objectReader.readBit();
      dimStyle.textInsideHorizontal = this._objectReader.readBit();
      dimStyle.alternateUnitDimensioning = this._objectReader.readBit();
      dimStyle.textOutsideExtensions = this._objectReader.readBit();
      dimStyle.separateArrowBlocks = this._objectReader.readBit();
      dimStyle.textInsideExtensions = this._objectReader.readBit();
      dimStyle.suppressOutsideExtensions = this._objectReader.readBit();
      dimStyle.alternateUnitDecimalPlaces = this._objectReader.readByte();
      dimStyle.zeroHandling = this._objectReader.readRawChar() as ZeroHandling;
      dimStyle.suppressFirstDimensionLine = this._objectReader.readBit();
      dimStyle.suppressSecondDimensionLine = this._objectReader.readBit();
      dimStyle.toleranceAlignment = this._objectReader.readRawChar() as ToleranceAlignment;
      dimStyle.textHorizontalAlignment = this._objectReader.readByte() as DimensionTextHorizontalAlignment;
      dimStyle.dimensionFit = this._objectReader.readRawChar();
      dimStyle.cursorUpdate = this._objectReader.readBit();
      dimStyle.toleranceZeroHandling = this._objectReader.readByte() as ZeroHandling;
      dimStyle.alternateUnitZeroHandling = this._objectReader.readByte() as ZeroHandling;
      dimStyle.alternateUnitToleranceZeroHandling = this._objectReader.readByte() as ZeroHandling;
      dimStyle.textVerticalAlignment = this._objectReader.readByte() as DimensionTextVerticalAlignment;
      dimStyle.dimensionUnit = this._objectReader.readBitShort();
      dimStyle.angularUnit = this._objectReader.readBitShort() as AngularUnitFormat;
      dimStyle.decimalPlaces = this._objectReader.readBitShort();
      dimStyle.toleranceDecimalPlaces = this._objectReader.readBitShort();
      dimStyle.alternateUnitFormat = this._objectReader.readBitShort() as LinearUnitFormat;
      dimStyle.alternateUnitToleranceDecimalPlaces = this._objectReader.readBitShort();
      dimStyle.scaleFactor = this._objectReader.readBitDouble();
      dimStyle.arrowSize = this._objectReader.readBitDouble();
      dimStyle.extensionLineOffset = this._objectReader.readBitDouble();
      dimStyle.dimensionLineIncrement = this._objectReader.readBitDouble();
      dimStyle.extensionLineExtension = this._objectReader.readBitDouble();
      dimStyle.rounding = this._objectReader.readBitDouble();
      dimStyle.dimensionLineExtension = this._objectReader.readBitDouble();
      dimStyle.plusTolerance = this._objectReader.readBitDouble();
      dimStyle.minusTolerance = this._objectReader.readBitDouble();
      dimStyle.textHeight = this._objectReader.readBitDouble();
      dimStyle.centerMarkSize = this._objectReader.readBitDouble();
      dimStyle.tickSize = this._objectReader.readBitDouble();
      dimStyle.alternateUnitScaleFactor = this._objectReader.readBitDouble();
      dimStyle.linearScaleFactor = this._objectReader.readBitDouble();
      dimStyle.textVerticalPosition = this._objectReader.readBitDouble();
      dimStyle.toleranceScaleFactor = this._objectReader.readBitDouble();
      dimStyle.dimensionLineGap = this._objectReader.readBitDouble();
      dimStyle.postFix = this._textReader.readVariableText();
      dimStyle.alternateDimensioningSuffix = this._textReader.readVariableText();
      template.DIMBL_Name = this._textReader.readVariableText();
      template.DIMBLK1_Name = this._textReader.readVariableText();
      template.DIMBLK2_Name = this._textReader.readVariableText();
      dimStyle.dimensionLineColor = this._objectReader.readColorByIndex();
      dimStyle.extensionLineColor = this._objectReader.readColorByIndex();
      dimStyle.textColor = this._objectReader.readColorByIndex();
    }
    if (this.R2000Plus) {
      dimStyle.postFix = this._textReader.readVariableText();
      dimStyle.alternateDimensioningSuffix = this._textReader.readVariableText();
      dimStyle.scaleFactor = this._objectReader.readBitDouble();
      dimStyle.arrowSize = this._objectReader.readBitDouble();
      dimStyle.extensionLineOffset = this._objectReader.readBitDouble();
      dimStyle.dimensionLineIncrement = this._objectReader.readBitDouble();
      dimStyle.extensionLineExtension = this._objectReader.readBitDouble();
      dimStyle.rounding = this._objectReader.readBitDouble();
      dimStyle.dimensionLineExtension = this._objectReader.readBitDouble();
      dimStyle.plusTolerance = this._objectReader.readBitDouble();
      dimStyle.minusTolerance = this._objectReader.readBitDouble();
    }
    if (this.R2007Plus) {
      dimStyle.fixedExtensionLineLength = this._objectReader.readBitDouble();
      dimStyle.joggedRadiusDimensionTransverseSegmentAngle = this._objectReader.readBitDouble();
      dimStyle.textBackgroundFillMode = this._objectReader.readBitShort() as DimensionTextBackgroundFillMode;
      dimStyle.textBackgroundColor = this._mergedReaders.readCmColor();
    }
    if (this.R2000Plus) {
      dimStyle.generateTolerances = this._objectReader.readBit();
      dimStyle.limitsGeneration = this._objectReader.readBit();
      dimStyle.textInsideHorizontal = this._objectReader.readBit();
      dimStyle.textOutsideHorizontal = this._objectReader.readBit();
      dimStyle.suppressFirstExtensionLine = this._objectReader.readBit();
      dimStyle.suppressSecondExtensionLine = this._objectReader.readBit();
      dimStyle.textVerticalAlignment = this._objectReader.readBitShort() as DimensionTextVerticalAlignment;
      dimStyle.zeroHandling = this._objectReader.readBitShort() as ZeroHandling;
      dimStyle.angularZeroHandling = this._objectReader.readBitShort() as AngularZeroHandling;
    }
    if (this.R2007Plus) {
      dimStyle.arcLengthSymbolPosition = this._objectReader.readBitShort() as ArcLengthSymbolPosition;
    }
    if (this.R2000Plus) {
      dimStyle.textHeight = this._objectReader.readBitDouble();
      dimStyle.centerMarkSize = this._objectReader.readBitDouble();
      dimStyle.tickSize = this._objectReader.readBitDouble();
      dimStyle.alternateUnitScaleFactor = this._objectReader.readBitDouble();
      dimStyle.linearScaleFactor = this._objectReader.readBitDouble();
      dimStyle.textVerticalPosition = this._objectReader.readBitDouble();
      dimStyle.toleranceScaleFactor = this._objectReader.readBitDouble();
      dimStyle.dimensionLineGap = this._objectReader.readBitDouble();
      dimStyle.alternateUnitRounding = this._objectReader.readBitDouble();
      dimStyle.alternateUnitDimensioning = this._objectReader.readBit();
      dimStyle.alternateUnitDecimalPlaces = this._objectReader.readBitShort();
      dimStyle.textOutsideExtensions = this._objectReader.readBit();
      dimStyle.separateArrowBlocks = this._objectReader.readBit();
      dimStyle.textInsideExtensions = this._objectReader.readBit();
      dimStyle.suppressOutsideExtensions = this._objectReader.readBit();
      dimStyle.dimensionLineColor = this._mergedReaders.readCmColor();
      dimStyle.extensionLineColor = this._mergedReaders.readCmColor();
      dimStyle.textColor = this._mergedReaders.readCmColor();
      dimStyle.angularDecimalPlaces = this._objectReader.readBitShort();
      dimStyle.decimalPlaces = this._objectReader.readBitShort();
      dimStyle.toleranceDecimalPlaces = this._objectReader.readBitShort();
      dimStyle.alternateUnitFormat = this._objectReader.readBitShort() as LinearUnitFormat;
      dimStyle.alternateUnitToleranceDecimalPlaces = this._objectReader.readBitShort();
      dimStyle.angularUnit = this._objectReader.readBitShort() as AngularUnitFormat;
      dimStyle.fractionFormat = this._objectReader.readBitShort() as FractionFormat;
      dimStyle.linearUnitFormat = this._objectReader.readBitShort() as LinearUnitFormat;
      dimStyle.decimalSeparator = String.fromCharCode(this._objectReader.readBitShort());
      dimStyle.textMovement = this._objectReader.readBitShort() as TextMovement;
      dimStyle.textHorizontalAlignment = this._objectReader.readBitShort() as DimensionTextHorizontalAlignment;
      dimStyle.suppressFirstDimensionLine = this._objectReader.readBit();
      dimStyle.suppressSecondDimensionLine = this._objectReader.readBit();
      dimStyle.toleranceAlignment = this._objectReader.readBitShort() as ToleranceAlignment;
      dimStyle.toleranceZeroHandling = this._objectReader.readBitShort() as ZeroHandling;
      dimStyle.alternateUnitZeroHandling = this._objectReader.readBitShort() as ZeroHandling;
      dimStyle.alternateUnitToleranceZeroHandling = this._objectReader.readBitShort() as ZeroHandling;
      dimStyle.cursorUpdate = this._objectReader.readBit();
      dimStyle.dimensionFit = this._objectReader.readBitShort();
    }
    if (this.R2007Plus) {
      dimStyle.isExtensionLineLengthFixed = this._objectReader.readBit();
    }
    if (this.R2010Plus) {
      dimStyle.textDirection = this._objectReader.readBit() ? TextDirection.RightToLeft : TextDirection.LeftToRight;
      dimStyle.altMzf = this._objectReader.readBitDouble();
      dimStyle.altMzs = this._textReader.readVariableText();
      dimStyle.mzf = this._objectReader.readBitDouble();
      dimStyle.mzs = this._textReader.readVariableText();
    }
    if (this.R2000Plus) {
      dimStyle.dimensionLineWeight = this._objectReader.readBitShort() as LineWeightType;
      dimStyle.extensionLineWeight = this._objectReader.readBitShort() as LineWeightType;
    }
    this._objectReader.readBit();
    template.BlockHandle = this.handleReference();
    template.TextStyleHandle = this.handleReference();
    if (this.R2000Plus) {
      template.DIMLDRBLK = this.handleReference();
      template.DIMBLK = this.handleReference();
      template.DIMBLK1 = this.handleReference();
      template.DIMBLK2 = this.handleReference();
    }
    if (this.R2007Plus) {
      template.Dimltype = this.handleReference();
      template.Dimltex1 = this.handleReference();
      template.Dimltex2 = this.handleReference();
    }
    return template;
  }

  private readView(): CadTemplate {
    const view = new View();
    const template = new CadViewTemplate(view);
    this.readCommonNonEntityData(template);
    view.name = this._textReader.readVariableText();
    this.readXrefDependantBit(view);
    view.height = this._objectReader.readBitDouble();
    view.width = this._objectReader.readBitDouble();
    view.center = this._objectReader.read2RawDouble();
    view.target = this._objectReader.read3BitDouble();
    view.direction = this._objectReader.read3BitDouble();
    view.angle = this._objectReader.readBitDouble();
    view.lensLength = this._objectReader.readBitDouble();
    view.frontClipping = this._objectReader.readBitDouble();
    view.backClipping = this._objectReader.readBitDouble();
    if (this._objectReader.readBit()) view.viewMode |= ViewModeType.PerspectiveView;
    if (this._objectReader.readBit()) view.viewMode |= ViewModeType.FrontClipping;
    if (this._objectReader.readBit()) view.viewMode |= ViewModeType.BackClipping;
    if (this._objectReader.readBit()) view.viewMode |= ViewModeType.FrontClippingZ;
    if (this.R2000Plus) {
      view.renderMode = this._objectReader.readByte() as RenderMode;
    }
    if (this.R2007Plus) {
      this._mergedReaders.readBit();
      this._mergedReaders.readByte();
      this._mergedReaders.readBitDouble();
      this._mergedReaders.readBitDouble();
      this._mergedReaders.readCmColor();
    }
    if (this._objectReader.readBit()) view.flags |= 0b1 as StandardFlags;
    if (this.R2000Plus) {
      view.isUcsAssociated = this._objectReader.readBit();
      if (view.isUcsAssociated) {
        view.ucsOrigin = this._objectReader.read3BitDouble();
        view.ucsXAxis = this._objectReader.read3BitDouble();
        view.ucsYAxis = this._objectReader.read3BitDouble();
        view.ucsElevation = this._objectReader.readBitDouble();
        view.ucsOrthographicType = this._objectReader.readBitShort() as OrthographicType;
      }
    }
    this.handleReference();
    if (this.R2007Plus) {
      view.isPlottable = this._objectReader.readBit();
      this.handleReference();
      this.handleReference();
      this.handleReference();
    }
    if (this.R2000Plus && view.isUcsAssociated) {
      template.UcsHandle = this.handleReference();
      template.NamedUcsHandle = this.handleReference();
    }
    if (this.R2007Plus) {
      this.handleReference();
    }
    return template;
  }

  private readVPort(): CadTemplate {
    const vport = new VPort();
    const template = new CadVPortTemplate(vport);
    this.readCommonNonEntityData(template);
    vport.name = this._textReader.readVariableText();
    this.readXrefDependantBit(vport);
    vport.viewHeight = this._objectReader.readBitDouble();
    vport.aspectRatio = this._objectReader.readBitDouble() / vport.viewHeight;
    vport.center = this._objectReader.read2RawDouble();
    vport.target = this._objectReader.read3BitDouble();
    vport.direction = this._objectReader.read3BitDouble();
    vport.twistAngle = this._objectReader.readBitDouble();
    vport.lensLength = this._objectReader.readBitDouble();
    vport.frontClippingPlane = this._objectReader.readBitDouble();
    vport.backClippingPlane = this._objectReader.readBitDouble();
    if (this._objectReader.readBit()) vport.viewMode |= ViewModeType.PerspectiveView;
    if (this._objectReader.readBit()) vport.viewMode |= ViewModeType.FrontClipping;
    if (this._objectReader.readBit()) vport.viewMode |= ViewModeType.BackClipping;
    if (this._objectReader.readBit()) vport.viewMode |= ViewModeType.FrontClippingZ;
    if (this.R2000Plus) {
      vport.renderMode = this._objectReader.readByte() as RenderMode;
    }
    if (this.R2007Plus) {
      vport.useDefaultLighting = this._objectReader.readBit();
      vport.defaultLighting = this._objectReader.readByte() as DefaultLightingType;
      vport.brightness = this._objectReader.readBitDouble();
      vport.contrast = this._objectReader.readBitDouble();
      vport.ambientColor = this._mergedReaders.readCmColor();
    }
    vport.bottomLeft = this._objectReader.read2RawDouble();
    vport.topRight = this._objectReader.read2RawDouble();
    if (this._objectReader.readBit()) vport.viewMode |= ViewModeType.Follow;
    vport.circleZoomPercent = this._objectReader.readBitShort();
    this._objectReader.readBit();
    if (this._objectReader.readBit()) vport.ucsIconDisplay = UscIconType.OnLower;
    if (this._objectReader.readBit()) vport.ucsIconDisplay = UscIconType.OnOrigin;
    vport.showGrid = this._objectReader.readBit();
    vport.gridSpacing = this._objectReader.read2RawDouble();
    vport.snapOn = this._objectReader.readBit();
    vport.isometricSnap = this._objectReader.readBit();
    vport.snapIsoPair = this._objectReader.readBitShort();
    vport.snapRotation = this._objectReader.readBitDouble();
    vport.snapBasePoint = this._objectReader.read2RawDouble();
    vport.snapSpacing = this._objectReader.read2RawDouble();
    if (this.R2000Plus) {
      this._objectReader.readBit();
      const ucsPerViewport = this._objectReader.readBit();
      vport.origin = this._objectReader.read3BitDouble();
      vport.xAxis = this._objectReader.read3BitDouble();
      vport.yAxis = this._objectReader.read3BitDouble();
      vport.elevation = this._objectReader.readBitDouble();
      vport.orthographicType = this._objectReader.readBitShort() as OrthographicType;
    }
    if (this.R2007Plus) {
      vport.gridFlags = this._objectReader.readBitShort() as GridFlags;
      vport.minorGridLinesPerMajorGridLine = this._objectReader.readBitShort();
    }
    template.VportControlHandle = this.handleReference();
    if (this.R2007Plus) {
      template.BackgroundHandle = this.handleReference();
      template.StyleHandle = this.handleReference();
      template.SunHandle = this.handleReference();
    }
    if (this.R2000Plus) {
      template.NamedUcsHandle = this.handleReference();
      template.BaseUcsHandle = this.handleReference();
    }
    return template;
  }

  private readUcs(): CadTemplate {
    const ucs = new UCS();
    const template = new CadUcsTemplate(ucs);
    this.readCommonNonEntityData(template);
    ucs.name = this._textReader.readVariableText();
    this.readXrefDependantBit(ucs);
    ucs.origin = this._objectReader.read3BitDouble();
    ucs.xAxis = this._objectReader.read3BitDouble();
    ucs.yAxis = this._objectReader.read3BitDouble();
    if (this.R2000Plus) {
      ucs.elevation = this._objectReader.readBitDouble();
      ucs.orthographicViewType = this._objectReader.readBitShort() as OrthographicType;
      ucs.orthographicType = this._objectReader.readBitShort() as OrthographicType;
    }
    const control = this.handleReference();
    if (this.R2000Plus) {
      const baseUcs = this.handleReference();
      const namedHandle = this.handleReference();
    }
    return template;
  }

  private readLayout(): CadTemplate {
    const layout = new Layout();
    const template = new CadLayoutTemplate(layout);
    this.readCommonNonEntityData(template);
    this.readPlotSettingsData(layout);
    layout.name = this._textReader.readVariableText();
    layout.tabOrder = this._objectReader.readBitLong();
    layout.layoutFlags = this._objectReader.readBitShort() as LayoutFlags;
    layout.origin = this._objectReader.read3BitDouble();
    layout.minLimits = this._objectReader.read2RawDouble();
    layout.maxLimits = this._objectReader.read2RawDouble();
    layout.insertionBasePoint = this._objectReader.read3BitDouble();
    layout.xAxis = this._objectReader.read3BitDouble();
    layout.yAxis = this._objectReader.read3BitDouble();
    layout.elevation = this._objectReader.readBitDouble();
    layout.ucsOrthographicType = this._objectReader.readBitShort() as OrthographicType;
    layout.minExtents = this._objectReader.read3BitDouble();
    layout.maxExtents = this._objectReader.read3BitDouble();
    let nLayouts = 0;
    if (this.R2004Plus) {
      nLayouts = this._objectReader.readBitLong();
    }
    template.PaperSpaceBlockHandle = this.handleReference();
    template.ActiveViewportHandle = this.handleReference();
    template.BaseUcsHandle = this.handleReference();
    template.NamesUcsHandle = this.handleReference();
    if (this.R2004Plus) {
      for (let i = 0; i < nLayouts; i++) {
        template.ViewportHandles.add(this.handleReference());
      }
    }
    return template;
  }

  private readLeader(): CadTemplate {
    const leader = new Leader();
    const template = new CadLeaderTemplate(leader);
    this.readCommonEntityData(template);
    this._objectReader.readBit();
    leader.creationType = this._objectReader.readBitShort() as LeaderCreationType;
    leader.pathType = this._objectReader.readBitShort() as LeaderPathType;
    const npts = this._objectReader.readBitLong();
    for (let i = 0; i < npts; i++) {
      leader.vertices.push(this._objectReader.read3BitDouble());
    }
    this._objectReader.read3BitDouble();
    leader.normal = this._objectReader.read3BitDouble();
    leader.horizontalDirection = this._objectReader.read3BitDouble();
    leader.blockOffset = this._objectReader.read3BitDouble();
    if (this._version >= ACadVersion.AC1014) {
      leader.annotationOffset = this._objectReader.read3BitDouble();
    }
    if (this.R13_14Only) {
      leader.style.dimensionLineGap = this._objectReader.readBitDouble();
    }
    if (this._version <= ACadVersion.AC1021) {
      leader.textHeight = this._objectReader.readBitDouble();
      leader.textWidth = this._objectReader.readBitDouble();
    }
    leader.hookLineDirection = this._objectReader.readBit() ? HookLineDirection.Same : HookLineDirection.Opposite;
    leader.arrowHeadEnabled = this._objectReader.readBit();
    if (this.R13_14Only) {
      this._objectReader.readBitShort();
      template.Dimasz = this._objectReader.readBitDouble();
      this._objectReader.readBit();
      this._objectReader.readBit();
      this._objectReader.readBitShort();
      this._objectReader.readBitShort();
      this._objectReader.readBit();
      this._objectReader.readBit();
    }
    if (this.R2000Plus) {
      this._objectReader.readBitShort();
      this._objectReader.readBit();
      this._objectReader.readBit();
    }
    template.AnnotationHandle = this.handleReference();
    template.DIMSTYLEHandle = this.handleReference();
    return template;
  }

  private readMultiLeader(): CadTemplate {
    const mLeader = new MultiLeader();
    const template = new CadMLeaderTemplate(mLeader);
    this.readCommonEntityData(template);
    if (this.R2010Plus) {
      const f270 = this._objectReader.readBitShort();
    }
    this.readMultiLeaderAnnotContextData(mLeader.contextData, template.CadMLeaderAnnotContextTemplate);
    template.LeaderStyleHandle = this.handleReference();
    mLeader.propertyOverrideFlags = this._objectReader.readBitLong() as MultiLeaderPropertyOverrideFlags;
    mLeader.pathType = this._objectReader.readBitShort() as MultiLeaderPathType;
    mLeader.lineColor = this._mergedReaders.readCmColor();
    template.LeaderLineTypeHandle = this.handleReference();
    mLeader.leaderLineWeight = this._objectReader.readBitLong() as LineWeightType;
    mLeader.enableLanding = this._objectReader.readBit();
    mLeader.enableDogleg = this._objectReader.readBit();
    mLeader.landingDistance = this._objectReader.readBitDouble();
    template.ArrowheadHandle = this.handleReference();
    mLeader.arrowheadSize = this._objectReader.readBitDouble();
    mLeader.contentType = this._objectReader.readBitShort() as LeaderContentType;
    template.MTextStyleHandle = this.handleReference();
    mLeader.textLeftAttachment = this._objectReader.readBitShort() as TextAttachmentType;
    mLeader.textRightAttachment = this._objectReader.readBitShort() as TextAttachmentType;
    mLeader.textAngle = this._objectReader.readBitShort() as TextAngleType;
    mLeader.textAlignment = this._objectReader.readBitShort() as TextAlignmentType;
    mLeader.textColor = this._mergedReaders.readCmColor();
    mLeader.textFrame = this._objectReader.readBit();
    template.BlockContentHandle = this.handleReference();
    mLeader.blockContentColor = this._mergedReaders.readCmColor();
    mLeader.blockContentScale = this._objectReader.read3BitDouble();
    mLeader.blockContentRotation = this._objectReader.readBitDouble();
    mLeader.blockContentConnection = this._objectReader.readBitShort() as BlockContentConnectionType;
    mLeader.enableAnnotationScale = this._objectReader.readBit();
    if (this.R2007Pre) {
      const arrowHeadCount = this._objectReader.readBitLong();
      for (let ah = 0; ah < arrowHeadCount; ah++) {
        const isDefault = this._objectReader.readBit();
        template.ArrowheadHandles.set(this.handleReference(), isDefault);
      }
    }
    const blockLabelCount = this._objectReader.readBitLong();
    for (let bl = 0; bl < blockLabelCount; bl++) {
      const attributeHandle = this.handleReference();
      const blockAttribute = new MultiLeaderBlockAttribute();
      blockAttribute.text = this._textReader.readVariableText();
      blockAttribute.index = this._objectReader.readBitShort();
      blockAttribute.width = this._objectReader.readBitDouble();
      mLeader.blockAttributes.push(blockAttribute);
      template.BlockAttributeHandles.set(blockAttribute, attributeHandle);
    }
    mLeader.textDirectionNegative = this._objectReader.readBit();
    mLeader.textAligninIPE = this._objectReader.readBitShort() !== 0;
    mLeader.textAttachmentPoint = this._objectReader.readBitShort() as TextAttachmentPointType;
    mLeader.scaleFactor = this._objectReader.readBitDouble();
    if (this.R2010Plus) {
      mLeader.textAttachmentDirection = this._objectReader.readBitShort() as TextAttachmentDirectionType;
      mLeader.textBottomAttachment = this._objectReader.readBitShort() as TextAttachmentType;
      mLeader.textTopAttachment = this._objectReader.readBitShort() as TextAttachmentType;
    }
    if (this.R2013Plus) {
      mLeader.extendedToText = this._objectReader.readBit();
    }
    return template;
  }

  private readMultiLeaderAnnotContext(): CadTemplate {
    const annotContext = new MultiLeaderObjectContextData();
    const template = new CadMLeaderAnnotContextTemplate(annotContext);
    this.readAnnotScaleObjectContextData(template);
    this.readMultiLeaderAnnotContextData(annotContext, template);
    return template;
  }

  private readMultiLeaderAnnotContextData(annotContext: MultiLeaderObjectContextData, template: CadMLeaderAnnotContextTemplate): MultiLeaderObjectContextData {
    let leaderRootCount = this._objectReader.readBitLong();
    if (leaderRootCount === 0) {
      const b0 = this._objectReader.readBit();
      const b1 = this._objectReader.readBit();
      const b2 = this._objectReader.readBit();
      const b3 = this._objectReader.readBit();
      const b4 = this._objectReader.readBit();
      const b5 = this._objectReader.readBit();
      const b6 = this._objectReader.readBit();
      leaderRootCount = b5 ? 2 : 1;
    }
    for (let i = 0; i < leaderRootCount; i++) {
      annotContext.leaderRoots.push(this.readLeaderRoot(template));
    }
    annotContext.scaleFactor = this._objectReader.readBitDouble();
    annotContext.contentBasePoint = this._objectReader.read3BitDouble();
    annotContext.textHeight = this._objectReader.readBitDouble();
    annotContext.arrowheadSize = this._objectReader.readBitDouble();
    annotContext.landingGap = this._objectReader.readBitDouble();
    annotContext.textLeftAttachment = this._objectReader.readBitShort() as TextAttachmentType;
    annotContext.textRightAttachment = this._objectReader.readBitShort() as TextAttachmentType;
    annotContext.textAlignment = this._objectReader.readBitShort() as TextAlignmentType;
    annotContext.blockContentConnection = this._objectReader.readBitShort() as BlockContentConnectionType;
    annotContext.hasTextContents = this._objectReader.readBit();
    if (annotContext.hasTextContents) {
      annotContext.textLabel = this._textReader.readVariableText();
      annotContext.textNormal = this._objectReader.read3BitDouble();
      template.TextStyleHandle = this.handleReference();
      annotContext.textLocation = this._objectReader.read3BitDouble();
      annotContext.direction = this._objectReader.read3BitDouble();
      annotContext.textRotation = this._objectReader.readBitDouble();
      annotContext.boundaryWidth = this._objectReader.readBitDouble();
      annotContext.boundaryHeight = this._objectReader.readBitDouble();
      annotContext.lineSpacingFactor = this._objectReader.readBitDouble();
      annotContext.lineSpacing = this._objectReader.readBitShort() as LineSpacingStyle;
      annotContext.textColor = this._objectReader.readCmColor();
      annotContext.textAttachmentPoint = this._objectReader.readBitShort() as TextAttachmentPointType;
      annotContext.flowDirection = this._objectReader.readBitShort() as FlowDirectionType;
      annotContext.backgroundFillColor = this._objectReader.readCmColor();
      annotContext.backgroundScaleFactor = this._objectReader.readBitDouble();
      annotContext.backgroundTransparency = this._objectReader.readBitLong();
      annotContext.backgroundFillEnabled = this._objectReader.readBit();
      annotContext.backgroundMaskFillOn = this._objectReader.readBit();
      annotContext.columnType = this._objectReader.readBitShort();
      annotContext.textHeightAutomatic = this._objectReader.readBit();
      annotContext.columnWidth = this._objectReader.readBitDouble();
      annotContext.columnGutter = this._objectReader.readBitDouble();
      annotContext.columnFlowReversed = this._objectReader.readBit();
      const columnSizesCount = this._objectReader.readBitLong();
      for (let i = 0; i < columnSizesCount; i++) {
        annotContext.columnSizes.push(this._objectReader.readBitDouble());
      }
      annotContext.wordBreak = this._objectReader.readBit();
      this._objectReader.readBit();
    } else if (annotContext.hasContentsBlock = this._objectReader.readBit()) {
      template.BlockRecordHandle = this.handleReference();
      annotContext.blockContentNormal = this._objectReader.read3BitDouble();
      annotContext.blockContentLocation = this._objectReader.read3BitDouble();
      annotContext.blockContentScale = this._objectReader.read3BitDouble();
      annotContext.blockContentRotation = this._objectReader.readBitDouble();
      annotContext.blockContentColor = this._objectReader.readCmColor();
      const m00 = this._objectReader.readBitDouble();
      const m10 = this._objectReader.readBitDouble();
      const m20 = this._objectReader.readBitDouble();
      const m30 = this._objectReader.readBitDouble();
      const m01 = this._objectReader.readBitDouble();
      const m11 = this._objectReader.readBitDouble();
      const m21 = this._objectReader.readBitDouble();
      const m31 = this._objectReader.readBitDouble();
      const m02 = this._objectReader.readBitDouble();
      const m12 = this._objectReader.readBitDouble();
      const m22 = this._objectReader.readBitDouble();
      const m32 = this._objectReader.readBitDouble();
      const m03 = this._objectReader.readBitDouble();
      const m13 = this._objectReader.readBitDouble();
      const m23 = this._objectReader.readBitDouble();
      const m33 = this._objectReader.readBitDouble();
      const matrix = Matrix4.identity();
      matrix.m00 = m00; matrix.m10 = m10; matrix.m20 = m20; matrix.m30 = m30;
      matrix.m01 = m01; matrix.m11 = m11; matrix.m21 = m21; matrix.m31 = m31;
      matrix.m02 = m02; matrix.m12 = m12; matrix.m22 = m22; matrix.m32 = m32;
      matrix.m03 = m03; matrix.m13 = m13; matrix.m23 = m23; matrix.m33 = m33;
      annotContext.transformationMatrix = matrix;
    }
    annotContext.basePoint = this._objectReader.read3BitDouble();
    annotContext.baseDirection = this._objectReader.read3BitDouble();
    annotContext.baseVertical = this._objectReader.read3BitDouble();
    annotContext.normalReversed = this._objectReader.readBit();
    if (this.R2010Plus) {
      annotContext.textTopAttachment = this._objectReader.readBitShort() as TextAttachmentType;
      annotContext.textBottomAttachment = this._objectReader.readBitShort() as TextAttachmentType;
    }
    return annotContext;
  }

  private readMultiLeaderStyle(): CadTemplate {
    const mLeaderStyle = new MultiLeaderStyle();
    const template = new CadMLeaderStyleTemplate(mLeaderStyle);
    this.readCommonNonEntityData(template);
    if (this.R2010Plus) {
      const version = this._objectReader.readBitShort();
    }
    mLeaderStyle.contentType = this._objectReader.readBitShort() as LeaderContentType;
    mLeaderStyle.multiLeaderDrawOrder = this._objectReader.readBitShort() as MultiLeaderDrawOrderType;
    mLeaderStyle.leaderDrawOrder = this._objectReader.readBitShort() as LeaderDrawOrderType;
    mLeaderStyle.maxLeaderSegmentsPoints = this._objectReader.readBitLong();
    mLeaderStyle.firstSegmentAngleConstraint = this._objectReader.readBitDouble();
    mLeaderStyle.secondSegmentAngleConstraint = this._objectReader.readBitDouble();
    mLeaderStyle.pathType = this._objectReader.readBitShort() as MultiLeaderPathType;
    mLeaderStyle.lineColor = this._mergedReaders.readCmColor();
    template.LeaderLineTypeHandle = this.handleReference();
    mLeaderStyle.leaderLineWeight = this._objectReader.readBitLong() as LineWeightType;
    mLeaderStyle.enableLanding = this._objectReader.readBit();
    mLeaderStyle.landingGap = this._objectReader.readBitDouble();
    mLeaderStyle.enableDogleg = this._objectReader.readBit();
    mLeaderStyle.landingDistance = this._objectReader.readBitDouble();
    mLeaderStyle.description = this._mergedReaders.readVariableText();
    template.ArrowheadHandle = this.handleReference();
    mLeaderStyle.arrowheadSize = this._objectReader.readBitDouble();
    mLeaderStyle.defaultTextContents = this._mergedReaders.readVariableText();
    template.MTextStyleHandle = this.handleReference();
    mLeaderStyle.textLeftAttachment = this._objectReader.readBitShort() as TextAttachmentType;
    mLeaderStyle.textRightAttachment = this._objectReader.readBitShort() as TextAttachmentType;
    mLeaderStyle.textAngle = this._objectReader.readBitShort() as TextAngleType;
    mLeaderStyle.textAlignment = this._objectReader.readBitShort() as TextAlignmentType;
    mLeaderStyle.textColor = this._mergedReaders.readCmColor();
    mLeaderStyle.textHeight = this._objectReader.readBitDouble();
    mLeaderStyle.textFrame = this._objectReader.readBit();
    mLeaderStyle.textAlignAlwaysLeft = this._objectReader.readBit();
    mLeaderStyle.alignSpace = this._objectReader.readBitDouble();
    template.BlockContentHandle = this.handleReference();
    mLeaderStyle.blockContentColor = this._mergedReaders.readCmColor();
    mLeaderStyle.blockContentScale = this._objectReader.read3BitDouble();
    mLeaderStyle.enableBlockContentScale = this._objectReader.readBit();
    mLeaderStyle.blockContentRotation = this._objectReader.readBitDouble();
    mLeaderStyle.enableBlockContentRotation = this._objectReader.readBit();
    mLeaderStyle.blockContentConnection = this._objectReader.readBitShort() as BlockContentConnectionType;
    mLeaderStyle.scaleFactor = this._objectReader.readBitDouble();
    mLeaderStyle.overwritePropertyValue = this._objectReader.readBit();
    mLeaderStyle.isAnnotative = this._objectReader.readBit();
    mLeaderStyle.breakGapSize = this._objectReader.readBitDouble();
    if (this.R2010Plus) {
      mLeaderStyle.textAttachmentDirection = this._objectReader.readBitShort() as TextAttachmentDirectionType;
      mLeaderStyle.textBottomAttachment = this._objectReader.readBitShort() as TextAttachmentType;
      mLeaderStyle.textTopAttachment = this._objectReader.readBitShort() as TextAttachmentType;
    }
    if (this.R2013Plus) {
      mLeaderStyle.unknownFlag298 = this._objectReader.readBit();
    }
    return template;
  }

  private readMaterial(): CadTemplate {
    const material = new Material();
    const template = new CadMaterialTemplate(material);
    this.readCommonNonEntityData(template);
    material.name = this._mergedReaders.readVariableText();
    material.description = this._mergedReaders.readVariableText();

    // Ambient
    material.ambientColorMethod = this._mergedReaders.readByte() as ColorMethod;
    material.ambientColorFactor = this._mergedReaders.readBitDouble();
    if (material.ambientColorMethod === ColorMethod.Override) {
      const rgb = this._mergedReaders.readBitLong() >>> 0;
      const arr = LittleEndianConverter.getBytes32(rgb);
      material.ambientColor = new Color(arr[2], arr[1], arr[0]);
    }

    // Diffuse
    material.diffuseColorMethod = this._mergedReaders.readByte() as ColorMethod;
    material.diffuseColorFactor = this._mergedReaders.readBitDouble();
    if (material.diffuseColorMethod === ColorMethod.Override) {
      const rgb = this._mergedReaders.readBitLong() >>> 0;
      const arr = LittleEndianConverter.getBytes32(rgb);
      material.diffuseColor = new Color(arr[2], arr[1], arr[0]);
    }
    material.diffuseMapBlendFactor = this._mergedReaders.readBitDouble();
    material.diffuseProjectionMethod = this._mergedReaders.readByte() as ProjectionMethod;
    material.diffuseTilingMethod = this._mergedReaders.readByte() as TilingMethod;
    material.diffuseAutoTransform = this._mergedReaders.readByte() as AutoTransformMethodFlags;
    material.diffuseMatrix = this.readMatrix4();
    material.diffuseMapSource = this._mergedReaders.readByte() as MapSource;
    material.diffuseMapFileName = this.readMaterialMapFileName(material.diffuseMapSource, 'diffuse');

    // Specular
    material.specularColorMethod = this._mergedReaders.readByte() as ColorMethod;
    material.specularColorFactor = this._mergedReaders.readBitDouble();
    if (material.specularColorMethod === ColorMethod.Override) {
      const rgb = this._mergedReaders.readBitLong() >>> 0;
      const arr = LittleEndianConverter.getBytes32(rgb);
      material.specularColor = new Color(arr[2], arr[1], arr[0]);
    }
    material.specularMapBlendFactor = this._mergedReaders.readBitDouble();
    material.specularProjectionMethod = this._mergedReaders.readByte() as ProjectionMethod;
    material.specularTilingMethod = this._mergedReaders.readByte() as TilingMethod;
    material.specularAutoTransform = this._mergedReaders.readByte() as AutoTransformMethodFlags;
    material.specularMatrix = this.readMatrix4();
    material.specularMapSource = this._mergedReaders.readByte() as MapSource;
    material.specularMapFileName = this.readMaterialMapFileName(material.specularMapSource, 'specular');
    material.specularGlossFactor = this._objectReader.readBitDouble();

    // Reflection
    material.reflectionMapBlendFactor = this._mergedReaders.readBitDouble();
    material.reflectionProjectionMethod = this._mergedReaders.readByte() as ProjectionMethod;
    material.reflectionTilingMethod = this._mergedReaders.readByte() as TilingMethod;
    material.reflectionAutoTransform = this._mergedReaders.readByte() as AutoTransformMethodFlags;
    material.reflectionMatrix = this.readMatrix4();
    material.reflectionMapSource = this._mergedReaders.readByte() as MapSource;
    material.reflectionMapFileName = this.readMaterialMapFileName(material.reflectionMapSource, 'reflection');
    material.opacity = this._mergedReaders.readBitDouble();

    // Opacity
    material.opacityMapBlendFactor = this._mergedReaders.readBitDouble();
    material.opacityProjectionMethod = this._mergedReaders.readByte() as ProjectionMethod;
    material.opacityTilingMethod = this._mergedReaders.readByte() as TilingMethod;
    material.opacityAutoTransform = this._mergedReaders.readByte() as AutoTransformMethodFlags;
    material.opacityMatrix = this.readMatrix4();
    material.opacityMapSource = this._mergedReaders.readByte() as MapSource;
    material.opacityMapFileName = this.readMaterialMapFileName(material.opacityMapSource, 'opacity');

    // Bump
    material.bumpMapBlendFactor = this._mergedReaders.readBitDouble();
    material.bumpProjectionMethod = this._mergedReaders.readByte() as ProjectionMethod;
    material.bumpTilingMethod = this._mergedReaders.readByte() as TilingMethod;
    material.bumpAutoTransform = this._mergedReaders.readByte() as AutoTransformMethodFlags;
    material.bumpMatrix = this.readMatrix4();
    material.bumpMapSource = this._mergedReaders.readByte() as MapSource;
    material.bumpMapFileName = this.readMaterialMapFileName(material.bumpMapSource, 'bump');
    material.refractionIndex = this._mergedReaders.readBitDouble();

    // Refraction
    material.refractionMapBlendFactor = this._mergedReaders.readBitDouble();
    material.refractionProjectionMethod = this._mergedReaders.readByte() as ProjectionMethod;
    material.refractionTilingMethod = this._mergedReaders.readByte() as TilingMethod;
    material.refractionAutoTransform = this._mergedReaders.readByte() as AutoTransformMethodFlags;
    material.refractionMatrix = this.readMatrix4();
    material.refractionMapSource = this._mergedReaders.readByte() as MapSource;
    material.refractionMapFileName = this.readMaterialMapFileName(material.refractionMapSource, 'refraction');
    return template;
  }

  private readMaterialMapFileName(source: MapSource, channel: string): string {
    switch (source) {
      case MapSource.UseCurrentScene:
        return '';
      case MapSource.UseImageFile:
        return this._mergedReaders.readVariableText();
      case MapSource.Procedural:
        this._builder.Notify(
          `DWG material ${channel} map uses an unsupported procedural source; preserving the source flag without procedural payload details.`,
          NotificationType.Warning,
        );
        return '';
      default:
        this._builder.Notify(
          `DWG material ${channel} map uses an unknown source value ${source}; leaving the map filename empty.`,
          NotificationType.Warning,
        );
        return '';
    }
  }

  private readMLine(): CadTemplate {
    const mline = new MLine();
    const template = new CadMLineTemplate(mline);
    this.readCommonEntityData(template);
    mline.scaleFactor = this._objectReader.readBitDouble();
    mline.justification = this._objectReader.readByte() as MLineJustification;
    mline.startPoint = this._objectReader.read3BitDouble();
    mline.normal = this._objectReader.read3BitDouble();
    mline.flags |= this._objectReader.readBitShort() === 3 ? MLineFlags.Closed : MLineFlags.Has;
    const nlines = this._objectReader.readByte();
    const nverts = this._objectReader.readBitShort();
    for (let i = 0; i < nverts; i++) {
      const vertex = new MLineVertex();
      vertex.position = this._objectReader.read3BitDouble();
      vertex.direction = this._objectReader.read3BitDouble();
      vertex.miter = this._objectReader.read3BitDouble();
      for (let j = 0; j < nlines; j++) {
        const element = new MLineSegment();
        const nsegparms = this._objectReader.readBitShort();
        for (let k = 0; k < nsegparms; k++) {
          element.parameters.push(this._objectReader.readBitDouble());
        }
        const nfillparms = this._objectReader.readBitShort();
        for (let k = 0; k < nfillparms; k++) {
          element.areaFillParameters.push(this._objectReader.readBitDouble());
        }
        vertex.segments.push(element);
      }
      mline.vertices.push(vertex);
    }
    template.MLineStyleHandle = this.handleReference();
    return template;
  }

  private readMLineStyle(): CadTemplate {
    const mlineStyle = new MLineStyle();
    const template = new CadMLineStyleTemplate(mlineStyle);
    this.readCommonNonEntityData(template);
    mlineStyle.name = this._textReader.readVariableText();
    mlineStyle.description = this._textReader.readVariableText();
    const flags = this._objectReader.readBitShort();
    if ((flags & 1) > 0) mlineStyle.flags |= MLineStyleFlags.DisplayJoints;
    if ((flags & 2) > 0) mlineStyle.flags |= MLineStyleFlags.FillOn;
    if ((flags & 16) > 0) mlineStyle.flags |= MLineStyleFlags.StartSquareCap;
    if ((flags & 32) > 0) mlineStyle.flags |= MLineStyleFlags.StartRoundCap;
    if ((flags & 64) > 0) mlineStyle.flags |= MLineStyleFlags.StartInnerArcsCap;
    if ((flags & 256) > 0) mlineStyle.flags |= MLineStyleFlags.EndSquareCap;
    if ((flags & 512) > 0) mlineStyle.flags |= MLineStyleFlags.EndRoundCap;
    if ((flags & 1024) > 0) mlineStyle.flags |= MLineStyleFlags.EndInnerArcsCap;
    mlineStyle.fillColor = this._mergedReaders.readCmColor();
    mlineStyle.startAngle = this._objectReader.readBitDouble();
    mlineStyle.endAngle = this._objectReader.readBitDouble();
    const nlines = this._objectReader.readByte();
    for (let i = 0; i < nlines; i++) {
      const element = new MLineStyleElement();
      const elementTemplate = new CadMLineStyleTemplate.ElementTemplate(element);
      element.offset = this._objectReader.readBitDouble();
      element.color = this._mergedReaders.readCmColor();
      if (this.R2018Plus) {
        elementTemplate.LineTypeHandle = this.handleReference();
      } else {
        elementTemplate.LinetypeIndex = this._objectReader.readBitShort();
      }
      template.ElementTemplates.push(elementTemplate);
      mlineStyle.addElement(element);
    }
    return template;
  }

  private readGeoData(): CadTemplate {
    const geoData = new GeoData();
    const template = new CadGeoDataTemplate(geoData);
    this.readCommonNonEntityData(template);
    geoData.version = this._mergedReaders.readBitLong() as GeoDataVersion;
    template.HostBlockHandle = this.handleReference();
    geoData.coordinatesType = this._mergedReaders.readBitShort() as DesignCoordinatesType;
    switch (geoData.version) {
      case GeoDataVersion.R2009:
        geoData.referencePoint = this._mergedReaders.read3BitDouble();
        geoData.horizontalUnits = this._mergedReaders.readBitLong() as UnitsType;
        geoData.verticalUnits = geoData.horizontalUnits;
        geoData.designPoint = this._mergedReaders.read3BitDouble();
        this._mergedReaders.read3BitDouble();
        geoData.upDirection = this._mergedReaders.read3BitDouble();
        const angle = Math.PI / 2.0 - this._mergedReaders.readBitDouble();
        geoData.northDirection = new XY(Math.cos(angle), Math.sin(angle));
        this._mergedReaders.read3BitDouble();
        geoData.coordinateSystemDefinition = this._mergedReaders.readVariableText();
        geoData.geoRssTag = this._mergedReaders.readVariableText();
        geoData.horizontalUnitScale = this._mergedReaders.readBitDouble();
        geoData.verticalUnitScale = geoData.horizontalUnitScale;
        this._mergedReaders.readVariableText();
        this._mergedReaders.readVariableText();
        break;
      case GeoDataVersion.R2010:
      case GeoDataVersion.R2013:
        geoData.designPoint = this._mergedReaders.read3BitDouble();
        geoData.referencePoint = this._mergedReaders.read3BitDouble();
        geoData.horizontalUnitScale = this._mergedReaders.readBitDouble();
        geoData.horizontalUnits = this._mergedReaders.readBitLong() as UnitsType;
        geoData.verticalUnitScale = this._mergedReaders.readBitDouble();
        geoData.horizontalUnits = this._mergedReaders.readBitLong() as UnitsType;
        geoData.upDirection = this._mergedReaders.read3BitDouble();
        geoData.northDirection = this._mergedReaders.read2RawDouble();
        geoData.scaleEstimationMethod = this._mergedReaders.readBitLong() as ScaleEstimationType;
        geoData.userSpecifiedScaleFactor = this._mergedReaders.readBitDouble();
        geoData.enableSeaLevelCorrection = this._mergedReaders.readBit();
        geoData.seaLevelElevation = this._mergedReaders.readBitDouble();
        geoData.coordinateProjectionRadius = this._mergedReaders.readBitDouble();
        geoData.coordinateSystemDefinition = this._mergedReaders.readVariableText();
        geoData.geoRssTag = this._mergedReaders.readVariableText();
        break;
    }
    geoData.observationFromTag = this._mergedReaders.readVariableText();
    geoData.observationToTag = this._mergedReaders.readVariableText();
    geoData.observationCoverageTag = this._mergedReaders.readVariableText();
    const npts = this._mergedReaders.readBitLong();
    for (let i = 0; i < npts; i++) {
      const pt = new GeoMeshPoint();
      pt.source = this._mergedReaders.read2RawDouble();
      pt.destination = this._mergedReaders.read2RawDouble();
      geoData.points.push(pt);
    }
    const nfaces = this._mergedReaders.readBitLong();
    for (let i = 0; i < nfaces; i++) {
      const face = new GeoMeshFace();
      face.index1 = this._mergedReaders.readBitLong();
      face.index2 = this._mergedReaders.readBitLong();
      face.index3 = this._mergedReaders.readBitLong();
      geoData.faces.push(face);
    }
    return template;
  }

  private readTableStyle(): CadTemplate {
    const style = new TableStyle();
    const template = new CadTableStyleTemplate(style);
    this.readCommonNonEntityData(template);
    if (this.R2007Pre) {
      style.description = this._mergedReaders.readVariableText();
      style.flowDirection = this._mergedReaders.readBitShort() as TableFlowDirectionType;
      style.flags = this._mergedReaders.readBitShort();
      style.horizontalCellMargin = this._mergedReaders.readBitDouble();
      style.verticalCellMargin = this._mergedReaders.readBitDouble();
      style.suppressTitle = this._mergedReaders.readBit();
      style.suppressHeaderRow = this._mergedReaders.readBit();
      this.readRowCellStyle(template, style.dataCellStyle);
      this.readRowCellStyle(template, style.titleCellStyle);
      this.readRowCellStyle(template, style.headerCellStyle);
      return template;
    }
    const rc = this._mergedReaders.readByte();
    style.description = this._mergedReaders.readVariableText();
    const bl1 = this._mergedReaders.readBitLong();
    const bl2 = this._mergedReaders.readBitLong();
    const h = this.handleReference();
    const tableCellStyleTemplate = new CadCellStyleTemplate(style.tableCellStyle);
    this.readCellStyle(tableCellStyleTemplate);
    style.tableCellStyle.id = this._mergedReaders.readBitLong();
    style.tableCellStyle.styleClass = this._mergedReaders.readBitLong() as CellStyleClass;
    style.tableCellStyle.name = this._mergedReaders.readVariableText();
    const nCellStyles = this._mergedReaders.readBitLong();
    for (let i = 0; i < nCellStyles; i++) {
      const cellStyle = new CellStyle();
      const cellStyleTemplate = new CadCellStyleTemplate(cellStyle);
      template.CellStyleTemplates.push(cellStyleTemplate);
      const unknown = this._mergedReaders.readBitLong();
      this.readCellStyle(cellStyleTemplate);
      cellStyle.id = this._mergedReaders.readBitLong();
      cellStyle.styleClass = this._mergedReaders.readBitLong() as CellStyleClass;
      cellStyle.name = this._mergedReaders.readVariableText();
    }
    return template;
  }

  private readVisualStyle(): CadTemplate {
    const visualStyle = new VisualStyle();
    const template = new CadNonGraphicalObjectTemplate(visualStyle);
    this.readCommonNonEntityData(template);
    visualStyle.name = this._textReader.readVariableText();
    visualStyle.type = this._objectReader.readBitLong();
    const styleFlags = this._objectReader.readBitShort();
    visualStyle.internalFlag = this._objectReader.readBit();
    const payloadCount = this._objectReader.readBitLong();
    this._builder.Notify(
      `DWG VisualStyle payload is only partially mapped; preserving base object data for ${visualStyle.name} with flags ${styleFlags} and ${payloadCount} payload entries.`,
      NotificationType.Warning,
    );
    return template;
  }

  private readPlotSettingsEntity(): CadTemplate {
    const plotsettings = new PlotSettings();
    const template = new CadPlotSettingsTemplate(plotsettings);
    this.readCommonNonEntityData(template);
    this.readPlotSettingsData(plotsettings);
    return template;
  }

  private readPlotSettings(): CadTemplate {
    return this.readPlotSettingsEntity();
  }

  private readPlotSettingsData(plot: PlotSettings): void {
    plot.pageName = this._textReader.readVariableText();
    plot.systemPrinterName = this._textReader.readVariableText();
    plot.flags = this._objectReader.readBitShort() as PlotFlags;
    const margin = new PaperMargin();
    margin.left = this._objectReader.readBitDouble();
    margin.bottom = this._objectReader.readBitDouble();
    margin.right = this._objectReader.readBitDouble();
    margin.top = this._objectReader.readBitDouble();
    plot.unprintableMargin = margin;
    plot.paperWidth = this._objectReader.readBitDouble();
    plot.paperHeight = this._objectReader.readBitDouble();
    plot.paperSize = this._textReader.readVariableText();
    plot.plotOriginX = this._objectReader.readBitDouble();
    plot.plotOriginY = this._objectReader.readBitDouble();
    plot.paperUnits = this._objectReader.readBitShort() as PlotPaperUnits;
    plot.paperRotation = this._objectReader.readBitShort() as PlotRotation;
    plot.plotType = this._objectReader.readBitShort() as PlotType;
    plot.windowLowerLeftX = this._objectReader.readBitDouble();
    plot.windowLowerLeftY = this._objectReader.readBitDouble();
    plot.windowUpperLeftX = this._objectReader.readBitDouble();
    plot.windowUpperLeftY = this._objectReader.readBitDouble();
    if (this._version >= ACadVersion.AC1012 && this._version <= ACadVersion.AC1015) {
      plot.plotViewName = this._textReader.readVariableText();
    }
    plot.numeratorScale = this._objectReader.readBitDouble();
    plot.denominatorScale = this._objectReader.readBitDouble();
    plot.styleSheet = this._textReader.readVariableText();
    plot.scaledFit = this._objectReader.readBitShort() as ScaledType;
    plot.standardScale = this._objectReader.readBitDouble();
    plot.paperImageOrigin = this._objectReader.read2BitDouble();
    if (this.R2004Plus) {
      plot.shadePlotMode = this._objectReader.readBitShort() as ShadePlotMode;
      plot.shadePlotResolutionMode = this._objectReader.readBitShort() as ShadePlotResolutionMode;
      plot.shadePlotDPI = this._objectReader.readBitShort();
      const plotViewHandle = this.handleReference();
    }
    if (this.R2007Plus) {
      this.handleReference();
    }
  }

  private readEvaluationGraph(): CadTemplate {
    const evaluationGraph = new EvaluationGraph();
    const template = new CadEvaluationGraphTemplate(evaluationGraph);
    this.readCommonNonEntityData(template);
    evaluationGraph.value96 = this._objectReader.readBitLong();
    evaluationGraph.value97 = this._objectReader.readBitLong();
    const nodeCount = this._objectReader.readBitLong();
    for (let i = 0; i < nodeCount; i++) {
      const nodeTemplate = new CadEvaluationGraphTemplate.GraphNodeTemplate();
      const node = new EvaluationGraphNode();
      template.NodeTemplates.push(nodeTemplate);
      node.index = this._objectReader.readBitLong();
      node.flags = this._objectReader.readBitLong();
      node.nextNodeIndex = this._objectReader.readBitLong();
      nodeTemplate.ExpressionHandle = this.handleReference();
      node.data1 = this._objectReader.readBitLong();
      node.data2 = this._objectReader.readBitLong();
      node.data3 = this._objectReader.readBitLong();
      node.data4 = this._objectReader.readBitLong();
    }
    const edgeCount = this._objectReader.readBitLong();
    for (let i = 0; i < edgeCount; i++) {
      this._objectReader.readBitLong();
      this._objectReader.readBitLong();
      this._objectReader.readBitLong();
      this._objectReader.readBitLong();
      this._objectReader.readBitLong();
      this._objectReader.readBitLong();
      this._objectReader.readBitLong();
      this._objectReader.readBitLong();
      this._objectReader.readBitLong();
      this._objectReader.readBitLong();
    }
    return template;
  }

  private readSpatialFilter(): CadTemplate {
    const filter = new SpatialFilter();
    const template = new CadNonGraphicalObjectTemplate(filter);
    this.readCommonNonEntityData(template);
    const numPts = this._mergedReaders.readBitShort();
    for (let i = 0; i < numPts; i++) {
      filter.boundaryPoints.push(this._mergedReaders.read2RawDouble());
    }
    filter.normal = this._mergedReaders.read3BitDouble();
    filter.origin = this._mergedReaders.read3BitDouble();
    filter.displayBoundary = this._mergedReaders.readBitShort() !== 0;
    filter.clipFrontPlane = this._mergedReaders.readBitShort() !== 0;
    if (filter.clipFrontPlane) {
      filter.frontDistance = this._mergedReaders.readBitDouble();
    }
    filter.clipBackPlane = this._mergedReaders.readBitShort() !== 0;
    if (filter.clipBackPlane) {
      filter.backDistance = this._mergedReaders.readBitDouble();
    }
    filter.inverseInsertTransform = this.read4x3Matrix();
    filter.insertTransform = this.read4x3Matrix();
    return template;
  }

  private readDimensionAssociation(): CadTemplate {
    const association = new DimensionAssociation();
    const template = new CadDimensionAssociationTemplate(association);
    this.readCommonNonEntityData(template);
    template.DimensionHandle = this.handleReference();
    association.associativityFlags = this._mergedReaders.readBitLong() as AssociativityFlags;
    association.isTransSpace = this._mergedReaders.readBit();
    association.rotatedDimensionType = this._mergedReaders.readByte() as RotatedDimensionType;
    if ((association.associativityFlags & AssociativityFlags.FirstPointReference) !== 0) {
      template.FirstPointRef = this.readOsnapPointRef();
    }
    if ((association.associativityFlags & AssociativityFlags.SecondPointReference) !== 0) {
      template.SecondPointRef = this.readOsnapPointRef();
    }
    if ((association.associativityFlags & AssociativityFlags.ThirdPointReference) !== 0) {
      template.ThirdPointRef = this.readOsnapPointRef();
    }
    if ((association.associativityFlags & AssociativityFlags.FourthPointReference) !== 0) {
      template.FourthPointRef = this.readOsnapPointRef();
    }
    return template;
  }

  private readOsnapPointRef(): CadDimensionAssociationTemplate.OsnapPointRefTemplate {
    const osnap = new OsnapPointRef();
    const template = new CadDimensionAssociationTemplate.OsnapPointRefTemplate(osnap);
    const className = this._mergedReaders.readVariableText();
    osnap.objectOsnapType = this._mergedReaders.readByte() as ObjectOsnapType;
    template.ObjectHandle = this.handleReference();
    return template;
  }

  private readBlockFlipAction(): CadTemplate {
    const blockFlipAction = new BlockFlipAction();
    const template = new CadBlockFlipActionTemplate(blockFlipAction);
    this.readBlockAction(template);
    blockFlipAction.value92 = this._mergedReaders.readBitLong();
    blockFlipAction.value93 = this._mergedReaders.readBitLong();
    blockFlipAction.value94 = this._mergedReaders.readBitLong();
    blockFlipAction.value95 = this._mergedReaders.readBitLong();
    blockFlipAction.caption301 = this._mergedReaders.readVariableText();
    blockFlipAction.caption302 = this._mergedReaders.readVariableText();
    blockFlipAction.caption303 = this._mergedReaders.readVariableText();
    blockFlipAction.caption304 = this._mergedReaders.readVariableText();
    return template;
  }

  private readBlockFlipParameter(): CadTemplate {
    const blockFlipParameter = new BlockFlipParameter();
    const template = new CadBlockFlipParameterTemplate(blockFlipParameter);
    this.readBlock2PtParameter(template);
    blockFlipParameter.caption = this._mergedReaders.readVariableText();
    blockFlipParameter.description = this._mergedReaders.readVariableText();
    blockFlipParameter.baseStateName = this._mergedReaders.readVariableText();
    blockFlipParameter.flippedStateName = this._mergedReaders.readVariableText();
    blockFlipParameter.captionLocation = this._mergedReaders.read3BitDouble();
    blockFlipParameter.caption309 = this._mergedReaders.readVariableText();
    blockFlipParameter.value96 = this._mergedReaders.readBitLong();
    return template;
  }

  private readBlockRotationParameter(): CadTemplate {
    const blockRotationParameter = new BlockRotationParameter();
    const template = new CadBlockRotationParameterTemplate(blockRotationParameter);
    this.readBlock2PtParameter(template);
    blockRotationParameter.point = this._mergedReaders.read3BitDouble();
    blockRotationParameter.name = this._mergedReaders.readVariableText();
    blockRotationParameter.description = this._mergedReaders.readVariableText();
    blockRotationParameter.nameOffset = this._mergedReaders.readBitDouble();
    blockRotationParameter.value96 = this._mergedReaders.readBitLong();
    blockRotationParameter.value141 = this._mergedReaders.readBitDouble();
    blockRotationParameter.value142 = this._mergedReaders.readBitDouble();
    blockRotationParameter.value143 = this._mergedReaders.readBitDouble();
    blockRotationParameter.value175 = this._mergedReaders.readBitLong();
    return template;
  }

  private readBlockVisibilityParameter(): CadTemplate {
    const blockVisibilityParameter = new BlockVisibilityParameter();
    const template = new CadBlockVisibilityParameterTemplate(blockVisibilityParameter);
    this.readBlock1PtParameter(template);
    blockVisibilityParameter.value281 = this._mergedReaders.readBit();
    blockVisibilityParameter.name = this._mergedReaders.readVariableText();
    blockVisibilityParameter.description = this._mergedReaders.readVariableText();
    blockVisibilityParameter.value91 = this._mergedReaders.readBit();
    const totalEntitiesCount = this._objectReader.readBitLong();
    for (let i = 0; i < totalEntitiesCount; i++) {
      template.entityHandles.push(this.handleReference());
    }
    const nstates = this._objectReader.readBitLong();
    for (let j = 0; j < nstates; j++) {
      template.StateTemplates.push(this.readState());
    }
    return template;
  }

  private readBlockRotateAction(): CadTemplate {
    const rotationAction = new BlockRotationAction();
    const template = new CadBlockRotationActionTemplate(rotationAction);
    this.readBlockActionBasePt(template);
    rotationAction.value94 = this._mergedReaders.readBitLong();
    rotationAction.value303 = this._mergedReaders.readVariableText();
    return template;
  }

  private readBlockRepresentationData(): CadTemplate {
    const representation = new BlockRepresentationData();
    const template = new CadBlockRepresentationDataTemplate(representation);
    this.readCommonNonEntityData(template);
    representation.value70 = this._mergedReaders.readBitShort();
    template.BlockHandle = this.handleReference();
    return template;
  }

  private readBlockGripLocationComponent(): CadTemplate {
    const gripExpression = new BlockGripExpression();
    const template = new CadBlockGripExpressionTemplate(gripExpression);
    this.readEvaluationExpression(template);
    return template;
  }

  private readBlockGrip(template: CadBlockGripTemplate): void {
    this.readBlockElement(template);
    const blockGrip = template.CadObject as BlockGrip;
    blockGrip.value91 = this._mergedReaders.readBitLong();
    blockGrip.value92 = this._mergedReaders.readBitLong();
    blockGrip.location = this._mergedReaders.read3BitDouble();
    blockGrip.value280 = this._mergedReaders.readBitAsShort();
    blockGrip.value93 = this._mergedReaders.readBitLong();
  }

  private readAecCleanupGroup(): CadTemplate {
    const cleanupGroup = new AecCleanupGroup();
    const template = new CadNonGraphicalObjectTemplate(cleanupGroup);
    this.readCommonNonEntityData(template);
    try {
      if (this.R2000Plus) {
        cleanupGroup.version = this._mergedReaders.readBitLong();
      }
      cleanupGroup.description = this._mergedReaders.readVariableText();
      const currentPos = this._mergedReaders.positionInBits();
      const endPos = this._objectInitialPos + (this._size * 8);
      const remainingBits = endPos - currentPos;
      if (remainingBits > 0) {
        const remainingBytes = Math.floor(remainingBits / 8);
        if (remainingBytes > 0) {
          cleanupGroup.rawData = this._mergedReaders.readBytes(remainingBytes);
        }
      }
    } catch (ex: unknown) {
      const message = ex instanceof Error ? ex.message : String(ex);
      this._builder.Notify(
        `Error reading AEC_CLEANUP_GROUP [Handle: ${cleanupGroup.handle.toString(16)}]: ${message}`,
        NotificationType.Error,
        ex instanceof Error ? ex : null);
    }
    return template;
  }

  private readAecWall(): CadTemplate {
    const wall = new Wall();
    const template = new CadWallTemplate(wall);
    this.readCommonEntityData(template as unknown as CadEntityTemplate);
    if (this.R2000Plus) {
      wall.version = this._mergedReaders.readBitLong();
    }
    template.BinRecordHandle = this.handleReference();
    template.StyleHandle = this.handleReference();
    template.CleanupGroupHandle = this.handleReference();
    const objectPos = this._objectReader.positionInBits();
    const handlesPos = this._handlesReader.positionInBits();
    const objectDataSize = handlesPos - objectPos;
    if (objectDataSize > 0) {
      let dataBytes = Math.floor(objectDataSize / 8);
      if (objectDataSize % 8 !== 0) dataBytes++;
      const rawData = this._objectReader.readBytes(dataBytes);
      template.RawData = rawData;
    }
    return template as unknown as CadTemplate;
  }

  private readAecWallStyle(): CadTemplate {
    const wallStyle = new AecWallStyle();
    const template = new CadNonGraphicalObjectTemplate(wallStyle);
    this.readCommonNonEntityData(template);
    if (this.R2000Plus) {
      wallStyle.version = this._mergedReaders.readBitLong();
    }
    wallStyle.description = this._mergedReaders.readVariableText();
    const currentPos = this._mergedReaders.positionInBits();
    const endPos = this._objectInitialPos + (this._size * 8);
    const remainingBits = endPos - currentPos;
    if (remainingBits > 0) {
      const remainingBytes = Math.floor(remainingBits / 8);
      if (remainingBytes > 0) {
        wallStyle.rawData = this._mergedReaders.readBytes(remainingBytes);
      }
    }
    return template;
  }

  private readBinRecord(): CadTemplate {
    const binRecord = new AecBinRecord();
    const template = new CadNonGraphicalObjectTemplate(binRecord);
    this.readCommonNonEntityData(template);
    if (this.R2000Plus) {
      binRecord.version = this._mergedReaders.readBitLong();
    }
    const currentPos = this._mergedReaders.positionInBits();
    this._builder.Notify(
      `BinRecord: Handle reader at position ${currentPos}, BinRecord Handle: ${binRecord.handle.toString(16)}`,
      NotificationType.None);
    const endPos = this._objectInitialPos + (this._size * 8);
    const remainingBits = endPos - currentPos;
    if (remainingBits > 0) {
      const remainingBytes = Math.floor(remainingBits / 8);
      if (remainingBytes > 0) {
        binRecord.binaryData = this._mergedReaders.readBytes(remainingBytes);
        this._builder.Notify(
          `BinRecord: Read ${remainingBytes} bytes of binary data. Version: ${binRecord.version}, Handle: ${binRecord.handle.toString(16)}`,
          NotificationType.None);
      }
    }
    return template;
  }

  private readTableEntity(): CadTemplate {
    const table = new TableEntity();
    const template = new CadTableEntityTemplate(table);
    this.readInsertCommonData(template);
    this.readInsertCommonHandles(template);
    if (this.R2010Plus) {
      this._mergedReaders.readByte();
      template.NullHandle = this.handleReference();
      const longZero = this._mergedReaders.readBitLong();
      if (this.R2013Plus) {
        this._mergedReaders.readBitLong();
      } else {
        this._mergedReaders.readBit();
      }
      this.readTableContent(table.content as unknown as TableContent, template as CadTableEntityTemplate);
      void longZero;
      return template;
    }
    // Until R2007
    table.valueFlag = this._mergedReaders.readBitShort();
    table.horizontalDirection = this._mergedReaders.read3BitDouble();
    const ncols = this._mergedReaders.readBitLong();
    const nrows = this._mergedReaders.readBitLong();
    for (let i = 0; i < ncols; i++) {
      const c = new TableEntityColumn();
      c.width = this._mergedReaders.readBitDouble();
      table.columns.push(c);
    }
    for (let i = 0; i < nrows; i++) {
      const r = new TableEntityRow();
      r.height = this._mergedReaders.readBitDouble();
      table.rows.push(r);
    }
    template.styleHandle = this.handleReference();
    for (let n = 0; n < table.rows.length; n++) {
      for (let m = 0; m < table.columns.length; m++) {
        const cell = new TableEntityCell();
        table.rows[n].cells.push(cell);
        const cellTemplate = new CadTableCellTemplate(cell);
        template.cadTableCellTemplates.push(cellTemplate);
        this.readTableCellData(cellTemplate);
      }
    }
    if (this._mergedReaders.readBit()) {
      const styleOverride = new TableStyle();
      table.content.style = styleOverride;
      const flags = this._mergedReaders.readBitLong() as TableOverrideFlags;
      if ((flags & TableOverrideFlags.TitleSuppressed) !== 0) {
        styleOverride.suppressTitle = this._mergedReaders.readBit();
      }
      if ((flags & TableOverrideFlags.FlowDirection) !== 0) {
        this._mergedReaders.readBitShort();
      }
      if ((flags & TableOverrideFlags.HorizontalCellMargin) !== 0) {
        this._mergedReaders.readBitDouble();
      }
      if ((flags & TableOverrideFlags.VerticalCellMargin) !== 0) {
        this._mergedReaders.readBitDouble();
      }
      if ((flags & TableOverrideFlags.TitleRowColor) !== 0) {
        this._mergedReaders.readCmColor(this.R2004Pre);
      }
      if ((flags & TableOverrideFlags.HeaderRowColor) !== 0) {
        this._mergedReaders.readCmColor(this.R2004Pre);
      }
      if ((flags & TableOverrideFlags.DataRowColor) !== 0) {
        this._mergedReaders.readCmColor(this.R2004Pre);
      }
      if ((flags & TableOverrideFlags.TitleRowFillNone) !== 0) {
        this._mergedReaders.readBit();
      }
      if ((flags & TableOverrideFlags.HeaderRowFillNone) !== 0) {
        this._mergedReaders.readBit();
      }
      if ((flags & TableOverrideFlags.DataRowFillNone) !== 0) {
        this._mergedReaders.readBit();
      }
      if ((flags & TableOverrideFlags.TitleRowFillColor) !== 0) {
        this._mergedReaders.readCmColor(this.R2004Pre);
      }
      if ((flags & TableOverrideFlags.HeaderRowFillColor) !== 0) {
        this._mergedReaders.readCmColor(this.R2004Pre);
      }
      if ((flags & TableOverrideFlags.DataRowFillColor) !== 0) {
        this._mergedReaders.readCmColor(this.R2004Pre);
      }
      if ((flags & TableOverrideFlags.TitleRowAlign) !== 0) {
        this._mergedReaders.readBitShort();
      }
      if ((flags & TableOverrideFlags.HeaderRowAlign) !== 0) {
        this._mergedReaders.readBitShort();
      }
      if ((flags & TableOverrideFlags.DataRowAlign) !== 0) {
        this._mergedReaders.readBitShort();
      }
      if ((flags & TableOverrideFlags.TitleTextStyle) !== 0) {
        this.handleReference();
      }
      if ((flags & TableOverrideFlags.HeaderTextStyle) !== 0) {
        this.handleReference();
      }
      if ((flags & TableOverrideFlags.DataTextStyle) !== 0) {
        this.handleReference();
      }
      if ((flags & TableOverrideFlags.TitleRowHeight) !== 0) {
        this._mergedReaders.readBitDouble();
      }
      if ((flags & TableOverrideFlags.HeaderRowHeight) !== 0) {
        this._mergedReaders.readBitDouble();
      }
      if ((flags & TableOverrideFlags.DataRowHeight) !== 0) {
        this._mergedReaders.readBitDouble();
      }
    }
    if (this._mergedReaders.readBit()) {
      const flags = this._mergedReaders.readBitLong() as BorderOverrideFlags;
      const borderColorsToRead: Array<[number, BorderOverrideFlags]> = [
        [0, BorderOverrideFlags.TitleHorizontalTop],
        [0, BorderOverrideFlags.TitleHorizontalInsert],
        [0, BorderOverrideFlags.TitleHorizontalBottom],
        [0, BorderOverrideFlags.TitleVerticalLeft],
        [0, BorderOverrideFlags.TitleVerticalInsert],
        [0, BorderOverrideFlags.TitleVerticalRight],
        [0, BorderOverrideFlags.HeaderHorizontalTop],
        [0, BorderOverrideFlags.HeaderHorizontalInsert],
        [0, BorderOverrideFlags.HeaderHorizontalBottom],
        [0, BorderOverrideFlags.HeaderVerticalLeft],
        [0, BorderOverrideFlags.HeaderVerticalInsert],
        [0, BorderOverrideFlags.HeaderVerticalRight],
        [0, BorderOverrideFlags.DataHorizontalTop],
        [0, BorderOverrideFlags.DataHorizontalInsert],
        [0, BorderOverrideFlags.DataHorizontalBottom],
        [0, BorderOverrideFlags.DataVerticalLeft],
        [0, BorderOverrideFlags.DataVerticalInsert],
        [0, BorderOverrideFlags.DataVerticalRight],
      ];
      for (const [_, flag] of borderColorsToRead) {
        if ((flags & flag) !== 0) {
          this._mergedReaders.readCmColor(this.R2004Pre);
        }
      }
    }
    if (this._mergedReaders.readBit()) {
      const flags = this._mergedReaders.readBitLong() as BorderOverrideFlags;
      const borderLwToRead: BorderOverrideFlags[] = [
        BorderOverrideFlags.TitleHorizontalTop,
        BorderOverrideFlags.TitleHorizontalInsert,
        BorderOverrideFlags.TitleHorizontalBottom,
        BorderOverrideFlags.TitleVerticalLeft,
        BorderOverrideFlags.TitleVerticalInsert,
        BorderOverrideFlags.TitleVerticalRight,
        BorderOverrideFlags.HeaderHorizontalTop,
        BorderOverrideFlags.HeaderHorizontalInsert,
        BorderOverrideFlags.HeaderHorizontalBottom,
        BorderOverrideFlags.HeaderVerticalLeft,
        BorderOverrideFlags.HeaderVerticalInsert,
        BorderOverrideFlags.HeaderVerticalRight,
        BorderOverrideFlags.DataHorizontalTop,
        BorderOverrideFlags.DataHorizontalInsert,
        BorderOverrideFlags.DataHorizontalBottom,
        BorderOverrideFlags.DataVerticalLeft,
        BorderOverrideFlags.DataVerticalInsert,
        BorderOverrideFlags.DataVerticalRight,
      ];
      for (const flag of borderLwToRead) {
        if ((flags & flag) !== 0) {
          this._mergedReaders.readBitShort();
        }
      }
    }
    if (this._mergedReaders.readBit()) {
      const flags = this._mergedReaders.readBitLong() as BorderOverrideFlags;
      const borderVisibilityToRead: BorderOverrideFlags[] = [
        BorderOverrideFlags.TitleHorizontalTop,
        BorderOverrideFlags.TitleHorizontalInsert,
        BorderOverrideFlags.TitleHorizontalBottom,
        BorderOverrideFlags.TitleVerticalLeft,
        BorderOverrideFlags.TitleVerticalInsert,
        BorderOverrideFlags.TitleVerticalRight,
        BorderOverrideFlags.HeaderHorizontalTop,
        BorderOverrideFlags.HeaderHorizontalInsert,
        BorderOverrideFlags.HeaderHorizontalBottom,
        BorderOverrideFlags.HeaderVerticalLeft,
        BorderOverrideFlags.HeaderVerticalInsert,
        BorderOverrideFlags.HeaderVerticalRight,
        BorderOverrideFlags.DataHorizontalTop,
        BorderOverrideFlags.DataHorizontalInsert,
        BorderOverrideFlags.DataHorizontalBottom,
        BorderOverrideFlags.DataVerticalLeft,
        BorderOverrideFlags.DataVerticalInsert,
        BorderOverrideFlags.DataVerticalRight,
      ];
      for (const flag of borderVisibilityToRead) {
        if ((flags & flag) !== 0) {
          this._mergedReaders.readBitShortAsBool();
        }
      }
    }
    return template;
  }

  private readBlkRefObjectContextData(): CadTemplate {
    const contextData = new BlockReferenceObjectContextData();
    const template = new CadAnnotScaleObjectContextDataTemplate(contextData);
    this.readAnnotScaleObjectContextData(template);
    contextData.rotation = this._mergedReaders.readBitDouble();
    contextData.insertionPoint = this._mergedReaders.read3BitDouble();
    contextData.xScale = this._mergedReaders.readBitDouble();
    contextData.yScale = this._mergedReaders.readBitDouble();
    contextData.zScale = this._mergedReaders.readBitDouble();
    return template;
  }

  private readMTextAttributeObjectContextData(): CadTemplate | null {
    const contextData = new MTextAttributeObjectContextData();
    const template = new CadAnnotScaleObjectContextDataTemplate(contextData);
    this.readAnnotScaleObjectContextData(template);
    this._builder.Notify(
      `DWG MTextAttributeObjectContextData is only partially mapped; preserving annot-scale context metadata for handle ${contextData.handle}.`,
      NotificationType.Warning,
    );
    return template;
  }

  private readFieldList(): CadTemplate {
    const fieldList = new FieldList();
    const template = new CadFieldListTemplate(fieldList);
    this.readCommonNonEntityData(template);
    const nhandles = this._mergedReaders.readBitLong();
    this._mergedReaders.readBit();
    for (let i = 0; i < nhandles; i++) {
      template.OwnedObjectsHandlers.add(this.handleReference());
    }
    return template;
  }

  private readField(): CadTemplate {
    const field = new Field();
    const template = new CadFieldTemplate(field);
    this.readCommonNonEntityData(template);
    field.evaluatorId = this._mergedReaders.readVariableText();
    field.fieldCode = this._mergedReaders.readVariableText();
    const nchild = this._mergedReaders.readBitLong();
    for (let i = 0; i < nchild; i++) {
      template.ChildrenHandles.push(this.handleReference());
    }
    const nfields = this._mergedReaders.readBitLong();
    for (let j = 0; j < nfields; j++) {
      template.CadObjectsHandles.push(this.handleReference());
    }
    if (this._version < ACadVersion.AC1021) {
      field.formatString = this._mergedReaders.readVariableText();
    }
    field.evaluationOptionFlags = this._mergedReaders.readBitLong() as EvaluationOptionFlags;
    field.filingOptionFlags = this._mergedReaders.readBitLong() as FilingOptionFlags;
    field.fieldStateFlags = this._mergedReaders.readBitLong() as FieldStateFlags;
    field.evaluationStatusFlags = this._mergedReaders.readBitLong() as EvaluationStatusFlags;
    field.evaluationErrorCode = this._mergedReaders.readBitLong();
    field.evaluationErrorMessage = this._mergedReaders.readVariableText();
    template.CadValueTemplates.push(this.readCadValue(field.value));
    field.formatString = this._mergedReaders.readVariableText();
    this._mergedReaders.readBitLong();
    const num3 = this._mergedReaders.readBitLong();
    for (let k = 0; k < num3; k++) {
      const key = this._mergedReaders.readVariableText();
      const value = new CadValue();
      template.CadValueTemplates.push(this.readCadValue(value));
      field.values.set(key, value);
    }
    return template;
  }

  private readMatrix4(): number[] {
    const matrix: number[] = [];
    for (let i = 0; i < 16; i++) {
      matrix.push(this._mergedReaders.readBitDouble());
    }
    return matrix;
  }

  private read4x3Matrix(): Matrix4 {
    const identity = Matrix4.identity();
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        identity.setElement(i, j, this._mergedReaders.readBitDouble());
      }
    }
    return identity;
  }

  private readBorderStyle(border: CellBorder): void {
    border.lineWeight = this._mergedReaders.readBitShort() as LineWeightType;
    border.isInvisible = !this._mergedReaders.readBit();
    border.color = this._mergedReaders.readCmColor(this.R2004Pre);
  }

  private readAnnotScaleObjectContextData(template: CadAnnotScaleObjectContextDataTemplate): void {
    this.readObjectContextData(template);
    template.scaleHandle = this.handleReference();
  }

  private readObjectContextData(template: CadTemplate): void {
    this.readCommonNonEntityData(template);
    const contextData = template.CadObject as ObjectContextData;
    contextData.version = this._objectReader.readBitShort();
    contextData.hasFileToExtensionDictionary = this._objectReader.readBit();
    contextData.default = this._objectReader.readBit();
  }

  private readLeaderLine(template: CadMLeaderAnnotContextTemplate): LeaderLine {
    const leaderLine = new LeaderLine();
    const leaderLineSubTemplate = new CadMLeaderAnnotContextTemplate.LeaderLineTemplate(leaderLine);
    template.leaderLineTemplates.push(leaderLineSubTemplate);
    const pointCount = this._objectReader.readBitLong();
    for (let p = 0; p < pointCount; p++) {
      leaderLine.points.push(this._objectReader.read3BitDouble());
    }
    leaderLine.breakInfoCount = this._objectReader.readBitLong();
    if (leaderLine.breakInfoCount > 0) {
      leaderLine.segmentIndex = this._objectReader.readBitLong();
      const startEndPointCount = this._objectReader.readBitLong();
      for (let sep = 0; sep < startEndPointCount; sep++) {
        leaderLine.startEndPoints.push(new StartEndPointPair(
          this._objectReader.read3BitDouble(),
          this._objectReader.read3BitDouble()));
      }
    }
    leaderLine.index = this._objectReader.readBitLong();
    if (this.R2010Plus) {
      leaderLine.pathType = this._objectReader.readBitShort() as MultiLeaderPathType;
      leaderLine.lineColor = this._objectReader.readCmColor();
      leaderLineSubTemplate.LineTypeHandle = this.handleReference();
      leaderLine.lineWeight = this._objectReader.readBitLong() as LineWeightType;
      leaderLine.arrowheadSize = this._objectReader.readBitDouble();
      leaderLineSubTemplate.ArrowSymbolHandle = this.handleReference();
      leaderLine.overrideFlags = this._objectReader.readBitLong() as LeaderLinePropertOverrideFlags;
    }
    return leaderLine;
  }

  private readLeaderRoot(template: CadMLeaderAnnotContextTemplate): LeaderRoot {
    const leaderRoot = new LeaderRoot();
    leaderRoot.contentValid = this._objectReader.readBit();
    leaderRoot.unknown = this._objectReader.readBit();
    leaderRoot.connectionPoint = this._objectReader.read3BitDouble();
    leaderRoot.direction = this._objectReader.read3BitDouble();
    const breakStartEndPointCount = this._objectReader.readBitLong();
    for (let bsep = 0; bsep < breakStartEndPointCount; bsep++) {
      leaderRoot.breakStartEndPointsPairs.push(new StartEndPointPair(
        this._objectReader.read3BitDouble(),
        this._objectReader.read3BitDouble()));
    }
    leaderRoot.leaderIndex = this._objectReader.readBitLong();
    leaderRoot.landingDistance = this._objectReader.readBitDouble();
    const leaderLineCount = this._objectReader.readBitLong();
    for (let ll = 0; ll < leaderLineCount; ll++) {
      leaderRoot.lines.push(this.readLeaderLine(template));
    }
    if (this.R2010Plus) {
      leaderRoot.textAttachmentDirection = this._objectReader.readBitShort() as TextAttachmentDirectionType;
    }
    return leaderRoot;
  }

  private readBlockElement(template: CadBlockElementTemplate): void {
    this.readEvaluationExpression(template);
    template.blockElement.elementName = this._mergedReaders.readVariableText();
    template.blockElement.value98 = this._mergedReaders.readBitLong();
    template.blockElement.value99 = this._mergedReaders.readBitLong();
    template.blockElement.value1071 = this._mergedReaders.readBitLong();
  }

  private readBlockParameter(template: CadBlockParameterTemplate): void {
    this.readBlockElement(template);
    template.blockParameter.value280 = this._mergedReaders.readBit();
    template.blockParameter.value281 = this._mergedReaders.readBit();
  }

  private readBlock1PtParameter(template: CadBlock1PtParameterTemplate): void {
    this.readBlockParameter(template);
    template.block1PtParameter.location = this._mergedReaders.read3BitDouble();
    template.block1PtParameter.value170 = this._mergedReaders.readBitShort();
    template.block1PtParameter.value171 = this._mergedReaders.readBitShort();
    template.block1PtParameter.value93 = this._mergedReaders.readBitLong();
  }

  private readBlock2PtParameter(template: CadBlock2PtParameterTemplate): void {
    this.readBlockParameter(template);
    template.block2PtParameter.firstPoint = this._mergedReaders.read3BitDouble();
    template.block2PtParameter.secondPoint = this._mergedReaders.read3BitDouble();
    for (let i = 0; i < 4; i++) {
      const n = this._mergedReaders.readBitShort();
      for (let j = 0; j < n; j++) {
        const d = this._mergedReaders.readBitLong();
        const e = this._mergedReaders.readVariableText();
      }
    }
    for (let k = 0; k < 4; k++) {
      const f = this._mergedReaders.readBitLong();
    }
    const value177 = this._mergedReaders.readBitShort();
  }

  private readBlockAction(template: CadBlockActionTemplate): void {
    this.readBlockElement(template);
    const blockAction = template.blockAction;
    blockAction.actionPoint = this._mergedReaders.read3BitDouble();
    const entityCount = this._objectReader.readBitShort();
    for (let i = 0; i < entityCount; i++) {
      const entityHandle = this.handleReference();
      template.entityHandles.add(entityHandle);
    }
    blockAction.value70 = this._mergedReaders.readBitShort();
  }

  private readBlockActionBasePt(template: CadBlockActionBasePtTemplate): void {
    this.readBlockAction(template);
    const blockActionBasePt = template.CadObject as BlockActionBasePt;
    blockActionBasePt.value1011 = this._mergedReaders.read3BitDouble();
    blockActionBasePt.value92 = this._mergedReaders.readBitLong();
    blockActionBasePt.value301 = this._mergedReaders.readVariableText();
    blockActionBasePt.value93 = this._mergedReaders.readBitLong();
    blockActionBasePt.value302 = this._mergedReaders.readVariableText();
    blockActionBasePt.value280 = this._mergedReaders.readBit();
    blockActionBasePt.value1012 = this._mergedReaders.read3BitDouble();
  }

  private readEvaluationExpression(template: CadEvaluationExpressionTemplate): void {
    this.readCommonNonEntityData(template);
    const unknown = this._objectReader.readBitLong();
    template.CadObject.value98 = this._objectReader.readBitLong();
    template.CadObject.value99 = this._objectReader.readBitLong();
    const code = this._mergedReaders.readBitShort();
    if (code > 0) {
      const groupValue = GroupCodeValue.transformValue(code);
      this.readEvaluationExpressionValue(groupValue, code);
    }
    template.CadObject.id = this._objectReader.readBitLong();
  }

  private readEvaluationExpressionValue(groupValue: GroupCodeValueType, code: number): void {
    switch (groupValue) {
      case GroupCodeValueType.String:
      case GroupCodeValueType.ExtendedDataString:
      case GroupCodeValueType.Comment:
        this._mergedReaders.readVariableText();
        break;
      case GroupCodeValueType.Point3D:
        this._mergedReaders.read3BitDouble();
        break;
      case GroupCodeValueType.Double:
      case GroupCodeValueType.ExtendedDataDouble:
        this._mergedReaders.readBitDouble();
        break;
      case GroupCodeValueType.Byte:
        this._mergedReaders.readByte();
        break;
      case GroupCodeValueType.Int16:
      case GroupCodeValueType.ExtendedDataInt16:
        this._mergedReaders.readBitShort();
        break;
      case GroupCodeValueType.Int32:
      case GroupCodeValueType.ExtendedDataInt32:
        this._mergedReaders.readBitLong();
        break;
      case GroupCodeValueType.Int64:
        this._mergedReaders.readBitLongLong();
        break;
      case GroupCodeValueType.Handle:
      case GroupCodeValueType.ObjectId:
      case GroupCodeValueType.ExtendedDataHandle:
        this.handleReference();
        break;
      case GroupCodeValueType.Bool:
        this._mergedReaders.readBit();
        break;
      case GroupCodeValueType.Chunk:
      case GroupCodeValueType.ExtendedDataChunk:
        this._mergedReaders.readBytes(this._mergedReaders.readBitLong());
        break;
      case GroupCodeValueType.None:
      default:
        this._builder.Notify(
          `[EvaluationExpression] Unsupported group code ${code} (${groupValue}); leaving the value payload unread.`,
          NotificationType.Warning,
        );
        break;
    }
  }

  private readRowCellStyle(tableStyleTemplate: CadTableStyleTemplate, style: CellStyle): void {
    const cellStyleTemplate = new CadCellStyleTemplate(style);
    tableStyleTemplate.CellStyleTemplates.push(cellStyleTemplate);
    cellStyleTemplate.textStyleHandle = this.handleReference();
    style.textHeight = this._mergedReaders.readBitDouble();
    style.cellAlignment = this._mergedReaders.readBitShort() as CellAlignmentType;
    style.textColor = this._mergedReaders.readCmColor(this.R2004Pre);
    style.backgroundColor = this._mergedReaders.readCmColor(this.R2004Pre);
    style.isFillColorOn = this._mergedReaders.readBit();
    this.readBorderStyle(style.topBorder);
    this.readBorderStyle(style.horizontalInsideBorder);
    this.readBorderStyle(style.bottomBorder);
    this.readBorderStyle(style.leftBorder);
    this.readBorderStyle(style.verticalInsideBorder);
    this.readBorderStyle(style.rightBorder);
    if (this.R2007Plus) {
      style.valueDataType = this._mergedReaders.readBitLong();
      style.valueUnitType = this._mergedReaders.readBitLong();
      style.valueFormatString = this._mergedReaders.readVariableText();
    }
  }

  private readCellStyle(template: CadCellStyleTemplate): void {
    const cellStyle = template.Format as CellStyle;

    cellStyle.cellStyleType = this._mergedReaders.readBitLong() as CellStyleType;
    cellStyle.hasData = this._mergedReaders.readBitShortAsBool();
    if (!cellStyle.hasData) {
      return;
    }

    cellStyle.propertyOverrideFlags = this._mergedReaders.readBitLong() as TableCellStylePropertyFlags;
    cellStyle.tableCellStylePropertyFlags = this._mergedReaders.readBitLong() as TableCellStylePropertyFlags;
    cellStyle.backgroundColor = this._mergedReaders.readCmColor(this.R2004Pre);
    cellStyle.contentLayoutFlags = this._mergedReaders.readBitLong() as TableCellContentLayoutFlags;

    this.readCellContentFormat(template, cellStyle);

    cellStyle.marginOverrideFlags = this._mergedReaders.readBitShort() as MarginFlags;
    if ((cellStyle.marginOverrideFlags & MarginFlags.Override) !== 0) {
      cellStyle.verticalMargin = this._mergedReaders.readBitDouble();
      cellStyle.horizontalMargin = this._mergedReaders.readBitDouble();
      cellStyle.bottomMargin = this._mergedReaders.readBitDouble();
      cellStyle.rightMargin = this._mergedReaders.readBitDouble();
      cellStyle.marginHorizontalSpacing = this._mergedReaders.readBitDouble();
      cellStyle.marginVerticalSpacing = this._mergedReaders.readBitDouble();
    }

    const nborders = this._mergedReaders.readBitLong();
    for (let i = 0; i < nborders; i++) {
      const edgeFlags = this._mergedReaders.readBitLong() as CellEdgeFlags;
      switch (edgeFlags) {
        case CellEdgeFlags.Top:
          this.readBorder(template, cellStyle.topBorder);
          break;
        case CellEdgeFlags.Right:
          this.readBorder(template, cellStyle.rightBorder);
          break;
        case CellEdgeFlags.Bottom:
          this.readBorder(template, cellStyle.bottomBorder);
          break;
        case CellEdgeFlags.Left:
          this.readBorder(template, cellStyle.leftBorder);
          break;
        case CellEdgeFlags.InsideVertical:
          this.readBorder(template, cellStyle.verticalInsideBorder);
          break;
        case CellEdgeFlags.InsideHorizontal:
          this.readBorder(template, cellStyle.horizontalInsideBorder);
          break;
        case CellEdgeFlags.Unknown:
        default:
          continue;
      }
    }
  }

  private readBorder(template: CadCellStyleTemplate, border: CellBorder): void {
    border.propertyOverrideFlags = this._mergedReaders.readBitLong() as TableBorderPropertyFlags;
    border.type = this._mergedReaders.readBitLong() as TableEntityBorderType;
    border.color = this._mergedReaders.readCmColor(this.R2004Pre);
    border.lineWeight = this._mergedReaders.readBitLong() as LineWeightType;
    template.BorderLinetypePairs.push([border, this.handleReference()]);
    border.isInvisible = this._mergedReaders.readBitLong() === 1;
    border.doubleLineSpacing = this._mergedReaders.readBitDouble();
  }

  private readCellContentFormat(template: CadTableCellContentFormatTemplate, format: ContentFormat): void {
    format.propertyOverrideFlags = this._mergedReaders.readBitLong() as TableCellStylePropertyFlags;
    format.propertyFlags = this._mergedReaders.readBitLong();
    format.valueDataType = this._mergedReaders.readBitLong();
    format.valueUnitType = this._mergedReaders.readBitLong();
    format.valueFormatString = this._mergedReaders.readVariableText();
    format.rotation = this._mergedReaders.readBitDouble();
    format.scale = this._mergedReaders.readBitDouble();
    format.alignment = this._mergedReaders.readBitLong();
    format.color = this._mergedReaders.readCmColor(this.R2004Pre);
    template.TextStyleHandle = this.handleReference();
    if (template instanceof CadCellStyleTemplate) {
      template.textStyleHandle = template.TextStyleHandle;
    }
    format.textHeight = this._mergedReaders.readBitDouble();
  }

  private readTableContent(content: TableContent, template: CadTableEntityTemplate): void {
    this._builder.Notify(
      `DWG R2010+ table content is not mapped yet for table ${template.CadObject.handle}; leaving table cells empty.`,
      NotificationType.Warning,
    );
    void content;
  }

  private readTableCellData(template: CadTableCellTemplate): void {
    const cell = template.Cell;

    cell.type = this._mergedReaders.readBitShort() as CellType;
    cell.edgeFlags = this._mergedReaders.readByte();
    cell.mergedValue = this._mergedReaders.readBit() ? 1 : 0;
    cell.autoFit = this._mergedReaders.readBit();
    cell.borderWidth = this._mergedReaders.readBitLong();
    cell.borderHeight = this._mergedReaders.readBitLong();
    cell.rotation = this._mergedReaders.readBitDouble();

    template.ValueHandle = this.handleReference();

    switch (cell.type) {
      case CellType.Text:
        if (template.ValueHandle === 0 && this._version < ACadVersion.AC1021) {
          const content = new CellContent();
          content.cadValue.setValue(this._mergedReaders.readVariableText(), CadValueType.String);
          cell.contents.push(content);
        }
        break;
      case CellType.Block:
        cell.blockScale = this._mergedReaders.readBitDouble();
        if (this._mergedReaders.readBit()) {
          const natts = this._mergedReaders.readBitShort();
          for (let i = 0; i < natts; i++) {
            const attHandle = this.handleReference();
            this._mergedReaders.readBitShort();
            const text = this._mergedReaders.readVariableText();
            template.AttributeHandles.add([attHandle, text]);
          }
        }
        break;
    }

    if (this._mergedReaders.readBit()) {
      const flags = this._mergedReaders.readBitLong() as CellOverrideFlags;
      cell.virtualEdgeFlag = this._mergedReaders.readByte();

      if ((flags & CellOverrideFlags.CellAlignment) !== 0) {
        cell.styleOverride.cellAlignment = this._mergedReaders.readBitShort() as CellAlignmentType;
      }
      if ((flags & CellOverrideFlags.BackgroundFillNone) !== 0) {
        cell.styleOverride.isFillColorOn = this._mergedReaders.readBit();
      }
      if ((flags & CellOverrideFlags.BackgroundColor) !== 0) {
        cell.styleOverride.backgroundColor = this._mergedReaders.readCmColor(this.R2004Pre);
      }
      if ((flags & CellOverrideFlags.ContentColor) !== 0) {
        cell.styleOverride.contentColor = this._mergedReaders.readCmColor(this.R2004Pre);
      }
      if ((flags & CellOverrideFlags.TextStyle) !== 0) {
        template.TextStyleOverrideHandle = this.handleReference();
      }
      if ((flags & CellOverrideFlags.TextHeight) !== 0) {
        cell.styleOverride.textHeight = this._mergedReaders.readBitDouble();
      }

      if ((flags & CellOverrideFlags.TopGridColor) !== 0) {
        cell.styleOverride.topBorder.color = this._mergedReaders.readCmColor(this.R2004Pre);
      }
      if ((flags & CellOverrideFlags.TopGridLineWeight) !== 0) {
        cell.styleOverride.topBorder.lineWeight = this._mergedReaders.readBitShort() as LineWeightType;
      }
      if ((flags & CellOverrideFlags.TopVisibility) !== 0) {
        cell.styleOverride.topBorder.isInvisible = !this._mergedReaders.readBitShortAsBool();
      }

      if ((flags & CellOverrideFlags.RightGridColor) !== 0) {
        cell.styleOverride.rightBorder.color = this._mergedReaders.readCmColor(this.R2004Pre);
      }
      if ((flags & CellOverrideFlags.RightGridLineWeight) !== 0) {
        cell.styleOverride.rightBorder.lineWeight = this._mergedReaders.readBitShort() as LineWeightType;
      }
      if ((flags & CellOverrideFlags.RightVisibility) !== 0) {
        cell.styleOverride.rightBorder.isInvisible = !this._mergedReaders.readBitShortAsBool();
      }

      if ((flags & CellOverrideFlags.BottomGridColor) !== 0) {
        cell.styleOverride.bottomBorder.color = this._mergedReaders.readCmColor(this.R2004Pre);
      }
      if ((flags & CellOverrideFlags.BottomGridLineWeight) !== 0) {
        cell.styleOverride.bottomBorder.lineWeight = this._mergedReaders.readBitShort() as LineWeightType;
      }
      if ((flags & CellOverrideFlags.BottomVisibility) !== 0) {
        cell.styleOverride.bottomBorder.isInvisible = !this._mergedReaders.readBitShortAsBool();
      }

      if ((flags & CellOverrideFlags.LeftGridColor) !== 0) {
        cell.styleOverride.leftBorder.color = this._mergedReaders.readCmColor(this.R2004Pre);
      }
      if ((flags & CellOverrideFlags.LeftGridLineWeight) !== 0) {
        cell.styleOverride.leftBorder.lineWeight = this._mergedReaders.readBitShort() as LineWeightType;
      }
      if ((flags & CellOverrideFlags.LeftVisibility) !== 0) {
        cell.styleOverride.leftBorder.isInvisible = !this._mergedReaders.readBitShortAsBool();
      }
    }

    if (this.R2007Plus) {
      this._mergedReaders.readBitLong();
      cell.contents.push(new CellContent());
      this.readCadValue(cell.content!.cadValue);
    }
  }

  private readCadValue(value: CadValue): CadValueTemplate {
    const template = new CadValueTemplate(value);
    if (this.R2007Plus) {
      value.flags = this._mergedReaders.readBitLong();
    }
    value.valueType = this._mergedReaders.readBitLong() as CadValueType;
    if (!this.R2007Plus || !value.isEmpty) {
      switch (value.valueType) {
        case CadValueType.Unknown:
        case CadValueType.Long:
          value.setValue(this._mergedReaders.readBitLong());
          break;
        case CadValueType.Double:
          value.setValue(this._mergedReaders.readBitDouble());
          break;
        case CadValueType.General:
        case CadValueType.String:
          value.setValue(this.readStringCadValue());
          break;
        case CadValueType.Date: {
          const dateTime = this.readDateCadValue();
          if (dateTime !== null) {
            value.setValue(dateTime);
          }
          break;
        }
        case CadValueType.Point2D:
          value.setValue(this.readValueXY());
          break;
        case CadValueType.Point3D:
          value.setValue(this.readValueXYZ());
          break;
        case CadValueType.Handle:
          template.ValueHandle = this.handleReference();
          break;
        case CadValueType.Buffer:
        case CadValueType.ResultBuffer:
          value.value = this._mergedReaders.readBitLong();
          break;
        default:
          this._builder.Notify(
            `DWG CadValue uses an unsupported value type ${value.valueType}; leaving the raw value empty.`,
            NotificationType.Warning,
          );
          break;
      }
    }
    if (this.R2007Plus) {
      value.units = this._mergedReaders.readBitLong() as CadValueUnitType;
      value.format = this._mergedReaders.readVariableText();
      value.formattedValue = this._mergedReaders.readVariableText();
    }
    return template;
  }

  private readStringCadValue(): string {
    return this._mergedReaders.readVariableText();
  }

  private readDateCadValue(): Date | null {
    const julianDay = this._mergedReaders.readBitLong();
    const msecs = this._mergedReaders.readBitLong();
    // Julian day 2440588 = Jan 1, 1970
    const unixDays = julianDay - 2440588;
    return new Date(unixDays * 86400000 + msecs);
  }

  private readValueXY(): XY {
    return new XY(
      this._mergedReaders.readBitDouble(),
      this._mergedReaders.readBitDouble()
    );
  }

  private readValueXYZ(): XYZ {
    return new XYZ(
      this._mergedReaders.readBitDouble(),
      this._mergedReaders.readBitDouble(),
      this._mergedReaders.readBitDouble()
    );
  }

  private readState(): CadBlockVisibilityParameterTemplate.StateTemplate {
    const template = new CadBlockVisibilityParameterTemplate.StateTemplate();
    template.state.name = this._textReader.readVariableText();
    const n1 = this._objectReader.readBitLong();
    for (let i = 0; i < n1; i++) {
      template.entityHandles.add(this.handleReference());
    }
    const n2 = this._objectReader.readBitLong();
    for (let i = 0; i < n2; i++) {
      template.expressionHandles.add(this.handleReference());
    }
    return template;
  }

  get SectionName(): string { return "AcDb:AcDbObjects"; }
}
