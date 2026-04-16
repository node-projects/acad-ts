import { CadDocument } from '../../../CadDocument.js';
import { CadObject } from '../../../CadObject.js';
import { ACadVersion } from '../../../ACadVersion.js';
import { DwgSectionIO } from '../DwgSectionIO.js';
import { DwgSectionDefinition } from '../FileHeaders/DwgSectionDefinition.js';
import { DwgReferenceType } from '../../../Types/DwgReferenceType.js';
import { CRC8StreamHandler } from '../CRC8StreamHandler.js';
import { DwgStreamWriterBase } from './DwgStreamWriterBase.js';
import { IDwgStreamWriter } from './IDwgStreamWriter.js';
import { NotificationType } from '../../NotificationEventHandler.js';
import { ObjectType } from '../../../Types/ObjectType.js';
import { CadUtils } from '../../../CadUtils.js';
import { XY, XYZ, Matrix4 } from '../../../Math/index.js';
import { Color } from '../../../Color.js';
import { Transparency } from '../../../Transparency.js';

// Entities
import { Entity } from '../../../Entities/Entity.js';
import { Arc } from '../../../Entities/Arc.js';
import { Circle } from '../../../Entities/Circle.js';
import { Dimension } from '../../../Entities/Dimension.js';
import { DimensionLinear } from '../../../Entities/DimensionLinear.js';
import { DimensionAligned } from '../../../Entities/DimensionAligned.js';
import { DimensionRadius } from '../../../Entities/DimensionRadius.js';
import { DimensionAngular2Line } from '../../../Entities/DimensionAngular2Line.js';
import { DimensionAngular3Pt } from '../../../Entities/DimensionAngular3Pt.js';
import { DimensionDiameter } from '../../../Entities/DimensionDiameter.js';
import { DimensionOrdinate } from '../../../Entities/DimensionOrdinate.js';
import { Ellipse } from '../../../Entities/Ellipse.js';
import { Insert } from '../../../Entities/Insert.js';
import { Face3D, InvisibleEdgeFlags } from '../../../Entities/Face3D.js';
import { Hatch, HatchGradientPattern, HatchPattern, BoundaryPathFlags, HatchBoundaryPathPolyline, HatchBoundaryPathLine, HatchBoundaryPathArc, HatchBoundaryPathEllipse, HatchBoundaryPathSpline } from '../../../Entities/Hatch.js';
import { Leader, HookLineDirection } from '../../../Entities/Leader.js';
import { Line } from '../../../Entities/Line.js';
import { LwPolyline, LwPolylineFlags } from '../../../Entities/LwPolyline.js';
import { Mesh } from '../../../Entities/Mesh.js';
import { MLine, MLineFlags } from '../../../Entities/MLine.js';
import { MText, BackgroundFillFlags, ColumnType } from '../../../Entities/MText.js';
import { MultiLeader } from '../../../Entities/MultiLeader.js';
import { Ole2Frame } from '../../../Entities/Ole2Frame.js';
import { PdfUnderlay } from '../../../Entities/PdfUnderlay.js';
import { Point } from '../../../Entities/Point.js';
import { PolyfaceMesh } from '../../../Entities/PolyfaceMesh.js';
import { Polyline2D } from '../../../Entities/Polyline2D.js';
import { Polyline3D } from '../../../Entities/Polyline3D.js';
import { PolygonMesh } from '../../../Entities/PolygonMesh.js';
import { Ray } from '../../../Entities/Ray.js';
import { Shape } from '../../../Entities/Shape.js';
import { Solid } from '../../../Entities/Solid.js';
import { Solid3D } from '../../../Entities/Solid3D.js';
import { ModelerGeometry, ModelerGeometryWire } from '../../../Entities/ModelerGeometry.js';
import { Spline, SplineFlags, SplineFlags1, KnotParametrization } from '../../../Entities/Spline.js';
import { CadWipeoutBase, ClipType, ClipMode } from '../../../Entities/CadWipeoutBase.js';
import { TextEntity, TextMirrorFlag, TextHorizontalAlignment, TextVerticalAlignmentType } from '../../../Entities/TextEntity.js';
import { AttributeEntity } from '../../../Entities/AttributeEntity.js';
import { AttributeDefinition } from '../../../Entities/AttributeDefinition.js';
import { AttributeBase } from '../../../Entities/AttributeBase.js';
import { Tolerance } from '../../../Entities/Tolerance.js';
import { Vertex } from '../../../Entities/Vertex.js';
import { Vertex2D } from '../../../Entities/Vertex2D.js';
import { Vertex3D } from '../../../Entities/Vertex3D.js';
import { VertexFaceRecord } from '../../../Entities/VertexFaceRecord.js';
import { VertexFaceMesh } from '../../../Entities/VertexFaceMesh.js';
import { PolygonMeshVertex } from '../../../Entities/PolygonMeshVertex.js';
import { Viewport } from '../../../Entities/Viewport.js';
import { XLine } from '../../../Entities/XLine.js';
import { Seqend } from '../../../Entities/Seqend.js';
import { Block } from '../../../Blocks/Block.js';
import { BlockEnd } from '../../../Blocks/BlockEnd.js';
import { BlockRecord, BlockTypeFlags } from '../../../Tables/BlockRecord.js';
import { UnknownEntity } from '../../../Entities/UnknownEntity.js';
import { Wall } from '../../../Entities/AecObjects/Wall.js';
import { ProxyEntity } from '../../../Entities/ProxyEntity.js';
import { TableEntity, TableEntityCell, CellType, CellBorder, CellStyle, CellEdgeFlags, ContentFormat, MarginFlags } from '../../../Entities/TableEntity.js';
import { CadBody } from '../../../Entities/CadBody.js';
import { Region } from '../../../Entities/Region.js';
import { IPolyline } from '../../../Entities/IPolyline.js';
import { LineType, LineTypeShapeFlags } from '../../../Tables/LineType.js';

// Tables
import { TableEntry, StandardFlags } from '../../../Tables/TableEntry.js';
import { Table } from '../../../Tables/Collections/Table.js';
import { AppId } from '../../../Tables/AppId.js';
import { Layer, LayerFlags } from '../../../Tables/Layer.js';
import { TextStyle, StyleFlags } from '../../../Tables/TextStyle.js';
import { UCS } from '../../../Tables/UCS.js';
import { View, ViewModeType } from '../../../Tables/View.js';
import { DimensionStyle, TextDirection } from '../../../Tables/DimensionStyle.js';
import { DimensionStylesTable } from '../../../Tables/Collections/DimensionStylesTable.js';
import { VPort, UscIconType } from '../../../Tables/VPort.js';

// Objects
import { NonGraphicalObject } from '../../../Objects/NonGraphicalObject.js';
import { CadDictionary } from '../../../Objects/CadDictionary.js';
import { CadDictionaryWithDefault } from '../../../Objects/CadDictionaryWithDefault.js';
import { DictionaryVariable } from '../../../Objects/DictionaryVariable.js';
import { DimensionAssociation, AssociativityFlags , OsnapPointRef} from '../../../Objects/DimensionAssociation.js';
import { Field } from '../../../Objects/Field.js';
import { FieldList } from '../../../Objects/FieldList.js';
import { GeoData, GeoDataVersion } from '../../../Objects/GeoData.js';
import { Group } from '../../../Objects/Group.js';
import { ImageDefinition } from '../../../Objects/ImageDefinition.js';
import { ImageDefinitionReactor } from '../../../Objects/ImageDefinitionReactor.js';
import { Layout } from '../../../Objects/Layout.js';
import { MLineStyle, MLineStyleFlags } from '../../../Objects/MLineStyle.js';
import { MultiLeaderStyle } from '../../../Objects/MultiLeaderStyle.js';
import { PdfUnderlayDefinition } from '../../../Objects/PdfUnderlayDefinition.js';
import { PlotSettings } from '../../../Objects/PlotSettings.js';
import { RasterVariables } from '../../../Objects/RasterVariables.js';
import { Scale } from '../../../Objects/Scale.js';
import { SortEntitiesTable } from '../../../Objects/SortEntitiesTable.js';
import { SpatialFilter } from '../../../Objects/SpatialFilter.js';
import { XRecord } from '../../../Objects/XRecrod.js';
import { AcdbPlaceHolder } from '../../../Objects/AcdbPlaceHolder.js';
import { BookColor } from '../../../Objects/BookColor.js';
import { CadValue, CadValueType, CadValueUnitType } from '../../../CadValue.js';
import { ObjectContextData } from '../../../Objects/ObjectContextData.js';
import { FlowDirectionType } from '../../../FlowDirectionType.js';
import { GroupCodeValue } from '../../../GroupCodeValue.js';
import { IHandledCadObject } from '../../../IHandledCadObject.js';
import { IProxy } from '../../../IProxy.js';
import { DxfClass } from '../../../Classes/DxfClass.js';

// XData
import { ExtendedDataDictionary } from '../../../XData/ExtendedDataDictionary.js';
import { ExtendedData } from '../../../XData/ExtendedData.js';
import { ExtendedDataRecord } from '../../../XData/ExtendedDataRecord.js';
import { ExtendedDataBinaryChunk } from '../../../XData/ExtendedDataBinaryChunk.js';
import { ExtendedDataControlString } from '../../../XData/ExtendedDataControlString.js';
import { ExtendedDataInteger16 } from '../../../XData/ExtendedDataInteger16.js';
import { ExtendedDataInteger32 } from '../../../XData/ExtendedDataInteger32.js';
import { ExtendedDataReal } from '../../../XData/ExtendedDataReal.js';
import { ExtendedDataScale } from '../../../XData/ExtendedDataScale.js';
import { ExtendedDataDistance } from '../../../XData/ExtendedDataDistance.js';
import { ExtendedDataDirection } from '../../../XData/ExtendedDataDirection.js';
import { ExtendedDataDisplacement } from '../../../XData/ExtendedDataDisplacement.js';
import { ExtendedDataCoordinate } from '../../../XData/ExtendedDataCoordinate.js';
import { ExtendedDataWorldCoordinate } from '../../../XData/ExtendedDataWorldCoordinate.js';
import { ExtendedDataString } from '../../../XData/ExtendedDataString.js';
import { IExtendedDataHandleReference } from '../../../XData/IExtendedDataHandleReference.js';

// Aec/Proxy objects
import { AecWallStyle } from '../../../Objects/AEC/AecWallStyle.js';
import { AecCleanupGroup } from '../../../Objects/AEC/AecCleanupGroup.js';
import { AecBinRecord } from '../../../Objects/AEC/AecBinRecord.js';
import { EvaluationGraph } from '../../../Objects/Evaluations/EvaluationGraph.js';
import { Material, ColorMethod, MapSource } from '../../../Objects/Material.js';
import { UnknownNonGraphicalObject } from '../../../Objects/UnknownNonGraphicalObject.js';
import { VisualStyle } from '../../../Objects/VisualStyle.js';
import { TableStyle } from '../../../Objects/TableStyle.js';
import { ProxyObject } from '../../../Objects/ProxyObject.js';
import { BlockRepresentationData } from '../../../Objects/BlockRepresentationData.js';
import { BlockReferenceObjectContextData } from '../../../Objects/BlockReferenceObjectContextData.js';
import { MTextAttributeObjectContextData } from '../../../Objects/MTextAttributeObjectContextData.js';
import { LeaderLine, LeaderRoot, MultiLeaderObjectContextData } from '../../../Objects/MultiLeaderObjectContextData.js';
import { GradientColor } from '../../../Entities/GradientColor.js';
import { PolylineFlags } from '../../../Entities/PolylineFlags.js';
import { AttributeType } from '../../../Entities/AttributeBase.js';
import { OrthographicType } from '../../../Types/OrthographicType.js';
import { GroupCodeValueType } from '../../../GroupCodeValueType.js';
import { AnnotScaleObjectContextData } from '../../../Objects/AnnotScaleObjectContextData.js';
import { encodeCadString, encodeUtf16Le } from '../../TextEncoding.js';

export class DwgObjectWriter extends DwgSectionIO {
	override get SectionName(): string { return DwgSectionDefinition.AcDbObjects; }

	/** Key: handle, Value: Offset */
	Map: Map<number, number> = new Map();

	WriteXRecords: boolean;
	WriteXData: boolean;
	WriteShapes: boolean = true;

	private _dictionaries: Map<number, CadDictionary> = new Map();
	private _objects: NonGraphicalObject[] = [];

	private _msmain: Uint8Array;
	private _msmainPos: number = 0;

	private _writer!: IDwgStreamWriter;

	private _stream: Uint8Array;
	private _streamPos: number = 0;

	private _document: CadDocument;

	private _prev: Entity | null = null;
	private _next: Entity | null = null;

	constructor(
		stream: Uint8Array,
		document: CadDocument,
		encoding: string,
		writeXRecords: boolean = true,
		writeXData: boolean = true,
		writeShapes: boolean = true
	) {
		super(document.header.version);

		// Ensure minimum stream capacity for object section
		this._stream = stream.length < 65536 ? new Uint8Array(1048576) : stream;
		this._document = document;

		this._msmain = new Uint8Array(65536);
		this._writer = DwgStreamWriterBase.getMergedWriter(document.header.version, this._msmain, encoding);
		this.WriteXRecords = writeXRecords;
		this.WriteXData = writeXData;
		this.WriteShapes = writeShapes;
	}

	get bytesWritten(): number { return this._streamPos; }

	getWrittenData(): Uint8Array { return this._stream.slice(0, this._streamPos); }

	private ensureStreamCapacity(needed: number): void {
		if (needed > this._stream.length) {
			const newSize = Math.max(needed, this._stream.length * 2);
			const newStream = new Uint8Array(newSize);
			newStream.set(this._stream.subarray(0, this._streamPos));
			this._stream = newStream;
		}
	}

	write(): void {
		//For R18 and later the section data (right after the page header) starts with a
		//RL value of 0x0dca (meaning unknown).
		if (this.R2004Plus) {
			this.ensureStreamCapacity(this._streamPos + 4);
			const view = new DataView(this._stream.buffer, this._stream.byteOffset + this._streamPos);
			view.setInt32(0, 0x0DCA, true);
			this._streamPos += 4;
		}

		this._objects.push(this._document.rootDictionary);

		this.writeBlockControl();
		this.writeTable(this._document.layers);
		this.writeTable(this._document.textStyles);
		this.writeLTypeControlObject();
		this.writeTable(this._document.views);
		this.writeTable(this._document.uCSs);
		this.writeTable(this._document.vPorts);
		this.writeTable(this._document.appIds);
		//For some reason the dimension must be written the last
		this.writeTable(this._document.dimensionStyles);

		if (this.R2004Pre && this._document.vEntityControl) {
			this.writeTable(this._document.vEntityControl);
		}

		this.writeBlockEntities();
		this.writeObjects();
	}

	// ==================== Main Writer Methods ====================

	private writeLTypeControlObject(): void {
		this.writeCommonNonEntityData(this._document.lineTypes);

		//Common:
		//Numentries BL 70
		this._writer.writeBitLong(this._document.lineTypes.count - 2);

		for (const item of this._document.lineTypes) {
			if (item.name.toLowerCase() === LineType.ByBlockName.toLowerCase()
				|| item.name.toLowerCase() === LineType.ByLayerName.toLowerCase()) {
				continue;
			}
			this._writer.handleReferenceTyped(DwgReferenceType.SoftOwnership, item);
		}

		this._writer.handleReferenceTyped(DwgReferenceType.HardOwnership, this._document.lineTypes.byBlock);
		this._writer.handleReferenceTyped(DwgReferenceType.HardOwnership, this._document.lineTypes.byLayer);

		this.registerObject(this._document.lineTypes);
		this.writeEntries(this._document.lineTypes);
	}

	private writeBlockControl(): void {
		this.writeCommonNonEntityData(this._document.blockRecords);

		//Common:
		//Numentries BL 70
		this._writer.writeBitLong(this._document.blockRecords.count - 2);

		for (const item of this._document.blockRecords) {
			if (item.name.toLowerCase() === BlockRecord.ModelSpaceName.toLowerCase()
				|| item.name.toLowerCase() === BlockRecord.PaperSpaceName.toLowerCase()) {
				continue;
			}
			this._writer.handleReferenceTyped(DwgReferenceType.SoftOwnership, item);
		}

		this._writer.handleReferenceTyped(DwgReferenceType.HardOwnership, this._document.modelSpace);
		this._writer.handleReferenceTyped(DwgReferenceType.HardOwnership, this._document.paperSpace);

		this.registerObject(this._document.blockRecords);
		this.writeEntries(this._document.blockRecords);
	}

	private writeTable<T extends TableEntry>(table: Table<T>): void {
		this.writeCommonNonEntityData(table);

		//Common:
		//Numentries BL 70
		this._writer.writeBitLong(table.count);

		if (this.R2000Plus && table instanceof DimensionStylesTable) {
			this._writer.writeByte(0);
		}

		for (const item of table) {
			this._writer.handleReferenceTyped(DwgReferenceType.SoftOwnership, item);
		}

		this.registerObject(table);
		this.writeEntries(table);
	}

	private writeEntries<T extends TableEntry>(table: Table<T>): void {
		for (const entry of table) {
			if (entry instanceof AppId) {
				this.writeAppId(entry);
			} else if (entry instanceof BlockRecord) {
				this.writeBlockRecord(entry);
			} else if (entry instanceof Layer) {
				this.writeLayer(entry);
			} else if (entry instanceof LineType) {
				this.writeLineType(entry);
			} else if (entry instanceof TextStyle) {
				this.writeTextStyle(entry);
			} else if (entry instanceof UCS) {
				this.writeUCS(entry);
			} else if (entry instanceof View) {
				this.writeView(entry);
			} else if (entry instanceof DimensionStyle) {
				this.writeDimensionStyle(entry);
			} else if (entry instanceof VPort) {
				this.writeVPort(entry);
			} else {
				this.notify(`Table entry not implemented : ${entry.constructor.name}`, NotificationType.NotImplemented);
			}
		}
	}

	private writeBlockEntities(): void {
		for (const blkRecord of this._document.blockRecords) {
			this.writeBlockBegin(blkRecord.blockEntity);

			this._prev = null;
			this._next = null;
			const arr = this.getCompatibleEntities(blkRecord.entities);
			for (let i = 0; i < arr.length; i++) {
				this._prev = i > 0 ? arr[i - 1] : null;
				const e = arr[i];
				this._next = i < arr.length - 1 ? arr[i + 1] : null;
				this.writeEntity(e);
			}

			this._prev = null;
			this._next = null;

			this.writeBlockEnd(blkRecord.blockEnd);
		}
	}

	private getCompatibleEntities(entities: Iterable<Entity>): Entity[] {
		return Array.from(entities).filter(e => this.isEntitySupported(e));
	}

	private isEntitySupported(entity: Entity): boolean {
		if (entity instanceof Seqend) return false;
		if (entity instanceof UnknownEntity) return false;
		if (entity instanceof Shape) return this.WriteShapes;
		return true;
	}

	// ==================== Table Entry Writers ====================

	private writeAppId(app: AppId): void {
		this.writeCommonNonEntityData(app);
		this._writer.writeVariableText(app.name);
		this.writeXrefDependantBit(app);
		this._writer.writeByte(0);
		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, 0);
		this.registerObject(app);
	}

	private writeBlockRecord(blkRecord: BlockRecord): void {
		this.writeBlockHeader(blkRecord);
	}

	private writeBlockHeader(record: BlockRecord): void {
		const entities = this.getCompatibleEntities(record.entities);
		const ownedEntityHandles = entities.map((entity) => entity.handle);
		const ownedObjectHandles = record.layout == null && record.ownedObjectHandles.length > 0
			? [...record.ownedObjectHandles]
			: [...ownedEntityHandles];
		for (const handle of ownedEntityHandles) {
			if (!ownedObjectHandles.includes(handle)) {
				ownedObjectHandles.push(handle);
			}
		}
		const flags = record.combinedFlags;
		const inserts = Array.from(this._document.entities)
			.filter((item): item is Insert => item instanceof Insert && item.block?.name === record.name);
		const insertHandles = inserts.map((insert) => insert.handle);
		if (record.name.toUpperCase().startsWith('*T')) {
			for (const handle of record.insertHandles) {
				if (!insertHandles.includes(handle)) {
					insertHandles.push(handle);
				}
			}
		}
		for (const insert of inserts) {
			if (!insertHandles.includes(insert.handle)) {
				insertHandles.push(insert.handle);
			}
		}
		const insertsByHandle = new Map(inserts.map((insert) => [insert.handle, insert]));

		this.writeCommonNonEntityData(record);

		//Common:
		//Entry name TV 2
		if ((flags & BlockTypeFlags.Anonymous) !== 0) {
			this._writer.writeVariableText(record.name.substring(0, 2));
		} else if (record.layout != null) {
			const processedBlockName = record.name.replace(/[0-9]/g, '');
			this._writer.writeVariableText(processedBlockName);
		} else {
			this._writer.writeVariableText(record.name);
		}

		this.writeXrefDependantBit({ flags });

		this._writer.writeBit((flags & BlockTypeFlags.Anonymous) !== 0);
		this._writer.writeBit(record.hasAttributes);
		this._writer.writeBit((flags & BlockTypeFlags.XRef) !== 0);
		this._writer.writeBit((flags & BlockTypeFlags.XRefOverlay) !== 0);

		//R2000+:
		if (this.R2000Plus) {
			this._writer.writeBit(record.isUnloaded);
		}

		//R2004+:
		if (this.R2004Plus
			&& (flags & BlockTypeFlags.XRef) === 0
			&& (flags & BlockTypeFlags.XRefOverlay) === 0) {
			this._writer.writeBitLong(ownedObjectHandles.length);
		}

		//Common:
		this._writer.write3BitDouble(record.blockEntity.basePoint);
		this._writer.writeVariableText(record.blockEntity.xRefPath);

		//R2000+:
		if (this.R2000Plus) {
			for (const _handle of insertHandles) {
				this._writer.writeByte(1);
			}
			this._writer.writeByte(0);

			this._writer.writeVariableText(record.blockEntity.comments);
			this._writer.writeBitLong(0);
		}

		//R2007+:
		if (this.R2007Plus) {
			this._writer.writeBitShort(record.units);
			this._writer.writeBit(record.isExplodable);
			this._writer.writeByte(record.canScale ? 1 : 0);
		}

		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, 0);
		this._writer.handleReferenceTyped(DwgReferenceType.HardOwnership, record.blockEntity);

		//R13-R2000:
		if (this._version >= ACadVersion.AC1012 && this._version <= ACadVersion.AC1015
			&& (flags & BlockTypeFlags.XRef) === 0
			&& (flags & BlockTypeFlags.XRefOverlay) === 0) {
			if (entities.length > 0) {
				this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, entities[0]);
				this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, entities[entities.length - 1]);
			} else {
				this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, 0);
				this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, 0);
			}
		}

		//R2004+:
		if (this.R2004Plus) {
			for (const handle of ownedObjectHandles) {
				const entity = entities.find((item) => item.handle === handle);
				if (entity) {
					this._writer.handleReferenceTyped(DwgReferenceType.HardOwnership, entity);
				} else {
					this._writer.handleReferenceTypedHandle(DwgReferenceType.HardOwnership, handle);
				}
			}
		}

		//Common:
		this._writer.handleReferenceTyped(DwgReferenceType.HardOwnership, record.blockEnd);

		//R2000+:
		if (this.R2000Plus) {
			for (const handle of insertHandles) {
				const insert = insertsByHandle.get(handle);
				if (insert) {
					this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, insert);
				} else {
					this._writer.handleReferenceTypedHandle(DwgReferenceType.SoftPointer, handle);
				}
			}
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, record.layout);
		}

		this.registerObject(record);
	}

	private writeBlockBegin(block: Block): void {
		this.writeCommonEntityData(block);
		this._writer.writeVariableText(block.name);
		this.registerObject(block);
	}

	private writeBlockEnd(blkEnd: BlockEnd): void {
		this.writeCommonEntityData(blkEnd);
		this.registerObject(blkEnd);
	}

	private writeLayer(layer: Layer): void {
		this.writeCommonNonEntityData(layer);
		this._writer.writeVariableText(layer.name);
		this.writeXrefDependantBit(layer);

		if (this.R13_14Only) {
			this._writer.writeBit((layer.flags & LayerFlags.Frozen) !== 0);
			this._writer.writeBit(layer.isOn);
			this._writer.writeBit((layer.flags & LayerFlags.FrozenNewViewports) !== 0);
			this._writer.writeBit((layer.flags & LayerFlags.Locked) !== 0);
		}

		if (this.R2000Plus) {
			let values = CadUtils.toIndex(layer.lineWeight) << 5;
			if ((layer.flags & LayerFlags.Frozen) !== 0) values |= 0b1;
			if (!layer.isOn) values |= 0b10;
			if ((layer.flags & LayerFlags.Frozen) !== 0) values |= 0b100;
			if ((layer.flags & LayerFlags.Locked) !== 0) values |= 0b1000;
			if (layer.plotFlag) values |= 0b10000;
			this._writer.writeBitShort(values);
		}

		this._writer.writeCmColor(layer.color);
		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, null);

		if (this.R2000Plus) {
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, 0);
		}
		if (this.R2007Plus) {
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, 0);
		}

		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, layer.lineType.handle);

		if (this.R2013Plus) {
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, 0);
		}

		this.registerObject(layer);
	}

	private writeLineType(ltype: LineType): void {
		this.writeCommonNonEntityData(ltype);
		this._writer.writeVariableText(ltype.name);
		this.writeXrefDependantBit(ltype);

		this._writer.writeVariableText(ltype.description);
		this._writer.writeBitDouble(ltype.patternLength);
		this._writer.writeByte((ltype.alignment?.charCodeAt(0) ?? 0) & 0xFF);
		this._writer.writeByte(ltype.segments.length);

		let hasTextSegments = false;
		for (const segment of ltype.segments) {
			if ((segment.shapeFlags & LineTypeShapeFlags.Text) !== 0) {
				hasTextSegments = true;
				break;
			}
		}

		let textArea: Uint8Array | null = null;
		let textCursor = 0;

		if (this._version <= ACadVersion.AC1018) {
			textArea = new Uint8Array(256);
			if (this._version <= ACadVersion.AC1014) textCursor = 1;
		} else if (this.R2007Plus && hasTextSegments) {
			textArea = new Uint8Array(512);
		}

		for (const segment of ltype.segments) {
			if ((segment.shapeFlags & LineTypeShapeFlags.Text) !== 0) {
				if (textArea == null || !segment.text) {
					segment.shapeNumber = 0;
				} else {
					// Write text as UTF-16LE for R2007+, otherwise single-byte
					const textBytes = this.R2007Plus
						? this.encodeUtf16LE(segment.text)
						: this.encodeText(segment.text);
					const termLen = this.R2007Plus ? 2 : 1;
					const required = textBytes.length + termLen;

					if (textCursor + required <= textArea.length) {
						segment.shapeNumber = textCursor;
						textArea.set(textBytes, textCursor);
						textCursor += textBytes.length;
						// Write null terminator
						for (let t = 0; t < termLen; t++) {
							textArea[textCursor++] = 0;
						}
					} else {
						segment.shapeNumber = 0;
					}
				}
			}

			this._writer.writeBitDouble(segment.length);
			this._writer.writeBitShort(segment.shapeNumber);
			this._writer.writeRawDouble(segment.offset.x);
			this._writer.writeRawDouble(segment.offset.y);
			this._writer.writeBitDouble(segment.scale);
			this._writer.writeBitDouble(segment.rotation);
			this._writer.writeBitShort(segment.shapeFlags);
		}

		//R2004 and earlier:
		if (this._version <= ACadVersion.AC1018) {
			const buffer = textArea ?? new Uint8Array(256);
			for (let i = 0; i < buffer.length; i++) {
				this._writer.writeByte(buffer[i]);
			}
		}

		//R2007+:
		if (this.R2007Plus && hasTextSegments) {
			const buffer = textArea ?? new Uint8Array(512);
			for (let i = 0; i < buffer.length; i++) {
				this._writer.writeByte(buffer[i]);
			}
		}

		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, 0);
		for (const segment of ltype.segments) {
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, segment.style);
		}

		this.registerObject(ltype);
	}

	private writeTextStyle(style: TextStyle): void {
		this.writeCommonNonEntityData(style);

		if (style.isShapeFile) {
			this._writer.writeVariableText('');
		} else {
			this._writer.writeVariableText(style.name);
		}

		this.writeXrefDependantBit(style);

		this._writer.writeBit((style.flags & StyleFlags.IsShape) !== 0);
		this._writer.writeBit((style.flags & StyleFlags.VerticalText) !== 0);
		this._writer.writeBitDouble(style.height);
		this._writer.writeBitDouble(style.width);
		this._writer.writeBitDouble(style.obliqueAngle);
		this._writer.writeByte(style.mirrorFlag);
		this._writer.writeBitDouble(style.lastHeight);
		this._writer.writeVariableText(style.filename);
		this._writer.writeVariableText(style.bigFontFilename);

		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, this._document.textStyles);

		this.registerObject(style);
	}

	private writeUCS(ucs: UCS): void {
		this.writeCommonNonEntityData(ucs);
		this._writer.writeVariableText(ucs.name);
		this.writeXrefDependantBit(ucs);

		this._writer.write3BitDouble(ucs.origin);
		this._writer.write3BitDouble(ucs.xAxis);
		this._writer.write3BitDouble(ucs.yAxis);

		if (this.R2000Plus) {
			this._writer.writeBitDouble(ucs.elevation);
			this._writer.writeBitShort(ucs.orthographicViewType);
			this._writer.writeBitShort(ucs.orthographicType);
		}

		this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, this._document.uCSs);

		if (this.R2000Plus) {
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, 0);
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, 0);
		}

		this.registerObject(ucs);
	}

	private writeView(view: View): void {
		this.writeCommonNonEntityData(view);
		this._writer.writeVariableText(view.name);
		this.writeXrefDependantBit(view);

		this._writer.writeBitDouble(view.height);
		this._writer.writeBitDouble(view.width);
		this._writer.write2RawDouble(view.center);
		this._writer.write3BitDouble(view.target);
		this._writer.write3BitDouble(view.direction);
		this._writer.writeBitDouble(view.angle);
		this._writer.writeBitDouble(view.lensLength);
		this._writer.writeBitDouble(view.frontClipping);
		this._writer.writeBitDouble(view.backClipping);

		this._writer.writeBit((view.viewMode & ViewModeType.PerspectiveView) !== 0);
		this._writer.writeBit((view.viewMode & ViewModeType.FrontClipping) !== 0);
		this._writer.writeBit((view.viewMode & ViewModeType.BackClipping) !== 0);
		this._writer.writeBit((view.viewMode & ViewModeType.FrontClippingZ) !== 0);

		if (this.R2000Plus) {
			this._writer.writeByte(view.renderMode);
		}

		if (this.R2007Plus) {
			this._writer.writeBit(true);
			this._writer.writeByte(1);
			this._writer.writeBitDouble(0.0);
			this._writer.writeBitDouble(0.0);
			this._writer.writeCmColor(new Color(250));
		}

		this._writer.writeBit((view.flags & 0b1) !== 0);

		if (this.R2000Plus) {
			this._writer.writeBit(view.isUcsAssociated);
			if (view.isUcsAssociated) {
				this._writer.write3BitDouble(view.ucsOrigin);
				this._writer.write3BitDouble(view.ucsXAxis);
				this._writer.write3BitDouble(view.ucsYAxis);
				this._writer.writeBitDouble(view.ucsElevation);
				this._writer.writeBitShort(view.ucsOrthographicType);
			}
		}

		this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, this._document.views);

		if (this.R2007Plus) {
			this._writer.writeBit(view.isPlottable);
			this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, 0);
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, 0);
			this._writer.handleReferenceTyped(DwgReferenceType.HardOwnership, 0);
		}

		if (this.R2000Plus && view.isUcsAssociated) {
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, 0);
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, 0);
		}

		if (this.R2007Plus) {
			this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, 0);
		}

		this.registerObject(view);
	}

	private writeDimensionStyle(dimStyle: DimensionStyle): void {
		this.writeCommonNonEntityData(dimStyle);
		this._writer.writeVariableText(dimStyle.name);
		this.writeXrefDependantBit(dimStyle);

		if (this.R13_14Only) {
			this._writer.writeBit(dimStyle.generateTolerances);
			this._writer.writeBit(dimStyle.limitsGeneration);
			this._writer.writeBit(dimStyle.textOutsideHorizontal);
			this._writer.writeBit(dimStyle.suppressFirstExtensionLine);
			this._writer.writeBit(dimStyle.suppressSecondExtensionLine);
			this._writer.writeBit(dimStyle.textInsideHorizontal);
			this._writer.writeBit(dimStyle.alternateUnitDimensioning);
			this._writer.writeBit(dimStyle.textOutsideExtensions);
			this._writer.writeBit(dimStyle.separateArrowBlocks);
			this._writer.writeBit(dimStyle.textInsideExtensions);
			this._writer.writeBit(dimStyle.suppressOutsideExtensions);
			this._writer.writeByte(dimStyle.alternateUnitDecimalPlaces);
			this._writer.writeByte(dimStyle.zeroHandling);
			this._writer.writeBit(dimStyle.suppressFirstDimensionLine);
			this._writer.writeBit(dimStyle.suppressSecondDimensionLine);
			this._writer.writeByte(dimStyle.toleranceAlignment);
			this._writer.writeByte(dimStyle.textHorizontalAlignment);
			this._writer.writeByte(dimStyle.dimensionFit);
			this._writer.writeBit(dimStyle.cursorUpdate);
			this._writer.writeByte(dimStyle.toleranceZeroHandling);
			this._writer.writeByte(dimStyle.alternateUnitZeroHandling);
			this._writer.writeByte(dimStyle.alternateUnitToleranceZeroHandling);
			this._writer.writeByte(dimStyle.textVerticalAlignment);
			this._writer.writeBitShort(dimStyle.dimensionUnit);
			this._writer.writeBitShort(dimStyle.angularUnit);
			this._writer.writeBitShort(dimStyle.decimalPlaces);
			this._writer.writeBitShort(dimStyle.toleranceDecimalPlaces);
			this._writer.writeBitShort(dimStyle.alternateUnitFormat);
			this._writer.writeBitShort(dimStyle.alternateUnitToleranceDecimalPlaces);
			this._writer.writeBitDouble(dimStyle.scaleFactor);
			this._writer.writeBitDouble(dimStyle.arrowSize);
			this._writer.writeBitDouble(dimStyle.extensionLineOffset);
			this._writer.writeBitDouble(dimStyle.dimensionLineIncrement);
			this._writer.writeBitDouble(dimStyle.extensionLineExtension);
			this._writer.writeBitDouble(dimStyle.rounding);
			this._writer.writeBitDouble(dimStyle.dimensionLineExtension);
			this._writer.writeBitDouble(dimStyle.plusTolerance);
			this._writer.writeBitDouble(dimStyle.minusTolerance);
			this._writer.writeBitDouble(dimStyle.textHeight);
			this._writer.writeBitDouble(dimStyle.centerMarkSize);
			this._writer.writeBitDouble(dimStyle.tickSize);
			this._writer.writeBitDouble(dimStyle.alternateUnitScaleFactor);
			this._writer.writeBitDouble(dimStyle.linearScaleFactor);
			this._writer.writeBitDouble(dimStyle.textVerticalPosition);
			this._writer.writeBitDouble(dimStyle.toleranceScaleFactor);
			this._writer.writeBitDouble(dimStyle.dimensionLineGap);
			this._writer.writeVariableText(dimStyle.postFix);
			this._writer.writeVariableText(dimStyle.alternateDimensioningSuffix);
			this._writer.writeVariableText(dimStyle.arrowBlock?.name ?? '');
			this._writer.writeVariableText(dimStyle.dimArrow1?.name ?? '');
			this._writer.writeVariableText(dimStyle.dimArrow2?.name ?? '');
			this._writer.writeCmColor(dimStyle.dimensionLineColor);
			this._writer.writeCmColor(dimStyle.extensionLineColor);
			this._writer.writeCmColor(dimStyle.textColor);
		}

		if (this.R2000Plus) {
			this._writer.writeVariableText(dimStyle.postFix);
			this._writer.writeVariableText(dimStyle.alternateDimensioningSuffix);
			this._writer.writeBitDouble(dimStyle.scaleFactor);
			this._writer.writeBitDouble(dimStyle.arrowSize);
			this._writer.writeBitDouble(dimStyle.extensionLineOffset);
			this._writer.writeBitDouble(dimStyle.dimensionLineIncrement);
			this._writer.writeBitDouble(dimStyle.extensionLineExtension);
			this._writer.writeBitDouble(dimStyle.rounding);
			this._writer.writeBitDouble(dimStyle.dimensionLineExtension);
			this._writer.writeBitDouble(dimStyle.plusTolerance);
			this._writer.writeBitDouble(dimStyle.minusTolerance);
		}

		if (this.R2007Plus) {
			this._writer.writeBitDouble(dimStyle.fixedExtensionLineLength);
			this._writer.writeBitDouble(dimStyle.joggedRadiusDimensionTransverseSegmentAngle);
			this._writer.writeBitShort(dimStyle.textBackgroundFillMode);
			this._writer.writeCmColor(dimStyle.textBackgroundColor);
		}

		if (this.R2000Plus) {
			this._writer.writeBit(dimStyle.generateTolerances);
			this._writer.writeBit(dimStyle.limitsGeneration);
			this._writer.writeBit(dimStyle.textInsideHorizontal);
			this._writer.writeBit(dimStyle.textOutsideHorizontal);
			this._writer.writeBit(dimStyle.suppressFirstExtensionLine);
			this._writer.writeBit(dimStyle.suppressSecondExtensionLine);
			this._writer.writeBitShort(dimStyle.textVerticalAlignment);
			this._writer.writeBitShort(dimStyle.zeroHandling);
			this._writer.writeBitShort(dimStyle.angularZeroHandling);
		}

		if (this.R2007Plus) {
			this._writer.writeBitShort(dimStyle.arcLengthSymbolPosition);
		}

		if (this.R2000Plus) {
			this._writer.writeBitDouble(dimStyle.textHeight);
			this._writer.writeBitDouble(dimStyle.centerMarkSize);
			this._writer.writeBitDouble(dimStyle.tickSize);
			this._writer.writeBitDouble(dimStyle.alternateUnitScaleFactor);
			this._writer.writeBitDouble(dimStyle.linearScaleFactor);
			this._writer.writeBitDouble(dimStyle.textVerticalPosition);
			this._writer.writeBitDouble(dimStyle.toleranceScaleFactor);
			this._writer.writeBitDouble(dimStyle.dimensionLineGap);
			this._writer.writeBitDouble(dimStyle.alternateUnitRounding);
			this._writer.writeBit(dimStyle.alternateUnitDimensioning);
			this._writer.writeBitShort(dimStyle.alternateUnitDecimalPlaces);
			this._writer.writeBit(dimStyle.textOutsideExtensions);
			this._writer.writeBit(dimStyle.separateArrowBlocks);
			this._writer.writeBit(dimStyle.textInsideExtensions);
			this._writer.writeBit(dimStyle.suppressOutsideExtensions);
			this._writer.writeCmColor(dimStyle.dimensionLineColor);
			this._writer.writeCmColor(dimStyle.extensionLineColor);
			this._writer.writeCmColor(dimStyle.textColor);
			this._writer.writeBitShort(dimStyle.angularDecimalPlaces);
			this._writer.writeBitShort(dimStyle.decimalPlaces);
			this._writer.writeBitShort(dimStyle.toleranceDecimalPlaces);
			this._writer.writeBitShort(dimStyle.alternateUnitFormat);
			this._writer.writeBitShort(dimStyle.alternateUnitToleranceDecimalPlaces);
			this._writer.writeBitShort(dimStyle.angularUnit);
			this._writer.writeBitShort(dimStyle.fractionFormat);
			this._writer.writeBitShort(dimStyle.linearUnitFormat);
			this._writer.writeBitShort(dimStyle.decimalSeparator.charCodeAt(0));
			this._writer.writeBitShort(dimStyle.textMovement);
			this._writer.writeBitShort(dimStyle.textHorizontalAlignment);
			this._writer.writeBit(dimStyle.suppressFirstDimensionLine);
			this._writer.writeBit(dimStyle.suppressSecondDimensionLine);
			this._writer.writeBitShort(dimStyle.toleranceAlignment);
			this._writer.writeBitShort(dimStyle.toleranceZeroHandling);
			this._writer.writeBitShort(dimStyle.alternateUnitZeroHandling);
			this._writer.writeBitShort(dimStyle.alternateUnitToleranceZeroHandling);
			this._writer.writeBit(dimStyle.cursorUpdate);
			this._writer.writeBitShort(3);
		}

		if (this.R2007Plus) {
			this._writer.writeBit(dimStyle.isExtensionLineLengthFixed);
		}

		if (this.R2010Plus) {
			this._writer.writeBit(dimStyle.textDirection === TextDirection.RightToLeft);
			this._writer.writeBitDouble(dimStyle.altMzf);
			this._writer.writeVariableText(dimStyle.altMzs);
			this._writer.writeBitDouble(dimStyle.mzf);
			this._writer.writeVariableText(dimStyle.mzs);
		}

		if (this.R2000Plus) {
			this._writer.writeBitShort(dimStyle.dimensionLineWeight);
			this._writer.writeBitShort(dimStyle.extensionLineWeight);
		}

		this._writer.writeBit(false);
		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, 0);
		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, dimStyle.style);

		if (this.R2000Plus) {
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, dimStyle.leaderArrow);
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, dimStyle.arrowBlock);
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, dimStyle.dimArrow1);
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, dimStyle.dimArrow2);
		}

		if (this.R2007Plus) {
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, dimStyle.lineType);
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, dimStyle.lineTypeExt1);
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, dimStyle.lineTypeExt2);
		}

		this.registerObject(dimStyle);
	}

	private writeVPort(vport: VPort): void {
		this.writeCommonNonEntityData(vport);
		this._writer.writeVariableText(vport.name);
		this.writeXrefDependantBit(vport);

		this._writer.writeBitDouble(vport.viewHeight);
		this._writer.writeBitDouble(vport.aspectRatio * vport.viewHeight);
		this._writer.write2RawDouble(vport.center);
		this._writer.write3BitDouble(vport.target);
		this._writer.write3BitDouble(vport.direction);
		this._writer.writeBitDouble(vport.twistAngle);
		this._writer.writeBitDouble(vport.lensLength);
		this._writer.writeBitDouble(vport.frontClippingPlane);
		this._writer.writeBitDouble(vport.backClippingPlane);

		this._writer.writeBit((vport.viewMode & ViewModeType.PerspectiveView) !== 0);
		this._writer.writeBit((vport.viewMode & ViewModeType.FrontClipping) !== 0);
		this._writer.writeBit((vport.viewMode & ViewModeType.BackClipping) !== 0);
		this._writer.writeBit((vport.viewMode & ViewModeType.FrontClippingZ) !== 0);

		if (this.R2000Plus) {
			this._writer.writeByte(vport.renderMode);
		}

		if (this.R2007Plus) {
			this._writer.writeBit(vport.useDefaultLighting);
			this._writer.writeByte(vport.defaultLighting);
			this._writer.writeBitDouble(vport.brightness);
			this._writer.writeBitDouble(vport.contrast);
			this._writer.writeCmColor(vport.ambientColor);
		}

		this._writer.write2RawDouble(vport.bottomLeft);
		this._writer.write2RawDouble(vport.topRight);

		this._writer.writeBit((vport.viewMode & ViewModeType.Follow) !== 0);
		this._writer.writeBitShort(vport.circleZoomPercent);
		this._writer.writeBit(true); //Fast zoom

		this._writer.writeBit((vport.ucsIconDisplay & UscIconType.OnLower) !== 0);
		this._writer.writeBit((vport.ucsIconDisplay & UscIconType.OnOrigin) !== 0);

		this._writer.writeBit(vport.showGrid);
		this._writer.write2RawDouble(vport.gridSpacing);
		this._writer.writeBit(vport.snapOn);
		this._writer.writeBit(vport.isometricSnap);
		this._writer.writeBitShort(vport.snapIsoPair);
		this._writer.writeBitDouble(vport.snapRotation);
		this._writer.write2RawDouble(vport.snapBasePoint);
		this._writer.write2RawDouble(vport.snapSpacing);

		if (this.R2000Plus) {
			this._writer.writeBit(false);
			this._writer.writeBit(true);
			this._writer.write3BitDouble(vport.origin);
			this._writer.write3BitDouble(vport.xAxis);
			this._writer.write3BitDouble(vport.yAxis);
			this._writer.writeBitDouble(vport.elevation);
			this._writer.writeBitShort(vport.orthographicType);
		}

		if (this.R2007Plus) {
			this._writer.writeBitShort(vport.gridFlags);
			this._writer.writeBitShort(vport.minorGridLinesPerMajorGridLine);
		}

		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, 0);

		if (this.R2007Plus) {
			this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, 0);
			this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, 0);
			this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, 0);
		}

		if (this.R2000Plus) {
			if (vport.orthographicType === OrthographicType.None) {
				this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, vport.namedUcs);
				this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, 0);
			} else {
				this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, 0);
				this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, vport.baseUcs);
			}
		}

		this.registerObject(vport);
	}

	// ==================== Common Methods ====================

	private registerObject(cadObject: CadObject): void {
		this._writer.writeSpearShift();

		// Update _msmainPos from writer position (C# used MemoryStream.Position)
		this._msmainPos = Math.ceil(this._writer.main.positionInBits / 8);

		// Ensure _stream has enough capacity for this object's data
		this.ensureStreamCapacity(this._streamPos + this._msmainPos + 64);

		const position = this._streamPos;
		const crc = new CRC8StreamHandler(this._stream.subarray(this._streamPos), 0xC0C1);

		const size = this._msmainPos;
		const sizeb = (this._msmainPos << 3) - this._writer.savedPositionInBits;
		this.writeSize(crc, size);

		if (this.R2010Plus) {
			this.writeSizeInBits(crc, sizeb);
		}

		crc.Write(new Uint8Array(this._writer.main.stream).subarray(0, this._msmainPos), 0, this._msmainPos);

		const seedBytes = new Uint8Array(2);
		const seedView = new DataView(seedBytes.buffer);
		seedView.setUint16(0, crc.Seed, true);
		this._stream.set(seedBytes, this._streamPos + crc.Position);
		this._streamPos += crc.Position + 2;

		this.Map.set(cadObject.handle, position);
	}

	private writeSize(stream: { Write: (data: Uint8Array, offset: number, count: number) => void; Position: number }, size: number): void {
		if (size >= 0b1000000000000000) {
			const buf = new Uint8Array(4);
			buf[0] = size & 0xFF;
			buf[1] = ((size >> 8) & 0x7F) | 0x80;
			buf[2] = (size >> 15) & 0xFF;
			buf[3] = (size >> 23) & 0xFF;
			stream.Write(buf, 0, 4);
		} else {
			const buf = new Uint8Array(2);
			buf[0] = size & 0xFF;
			buf[1] = (size >> 8) & 0xFF;
			stream.Write(buf, 0, 2);
		}
	}

	private writeSizeInBits(stream: { Write: (data: Uint8Array, offset: number, count: number) => void; Position: number }, size: number): void {
		if (size === 0) {
			stream.Write(new Uint8Array([0]), 0, 1);
			return;
		}

		let s = size;
		let shift = s >>> 7;
		while (s !== 0) {
			let b = s & 0x7F;
			if (shift !== 0) {
				b = b | 0x80;
			}
			stream.Write(new Uint8Array([b]), 0, 1);
			s = shift;
			shift = s >>> 7;
		}
	}

	private writeXrefDependantBit(entry: { flags: number }): void {
		if (this.R2007Plus) {
			this._writer.writeBitShort((entry.flags & StandardFlags.XrefDependent) !== 0 ? 0b100000000 : 0);
		} else {
			this._writer.writeBit((entry.flags & StandardFlags.Referenced) !== 0);
			this._writer.writeBitShort(0);
			this._writer.writeBit((entry.flags & StandardFlags.XrefDependent) !== 0);
		}
	}

	private writeCommonData(cadObject: CadObject): void {
		this._writer.resetStream();
		this._msmainPos = 0;

		switch (cadObject.objectType) {
			case ObjectType.LAYOUT:
				if (this.R2004Pre) {
					const dxfClassLookup = this._document.classes.tryGetByName(cadObject.objectName);
					if (dxfClassLookup.found && dxfClassLookup.result) {
						this._writer.writeObjectType(dxfClassLookup.result.classNumber);
					} else {
						this.notify(`Dxf Class not found for ${cadObject.objectType} fullname: ${cadObject.constructor.name}`, NotificationType.Warning);
						return;
					}
					break;
				}
				this._writer.writeObjectType(cadObject.objectType);
				break;
			case ObjectType.UNLISTED:
				{
					const dxfClassLookup = this._document.classes.tryGetByName(cadObject.objectName);
					if (dxfClassLookup.found && dxfClassLookup.result) {
						this._writer.writeObjectType(dxfClassLookup.result.classNumber);
					} else {
						this.notify(`Dxf Class not found for ${cadObject.objectType} fullname: ${cadObject.constructor.name}`, NotificationType.Warning);
						return;
					}
				}
				break;
			case ObjectType.INVALID:
			case ObjectType.UNDEFINED:
				this.notify(`CadObject type: ${cadObject.objectType} fullname: ${cadObject.constructor.name}`, NotificationType.NotImplemented);
				return;
			default:
				this._writer.writeObjectType(cadObject.objectType);
				break;
		}

		if (this._version >= ACadVersion.AC1015 && this._version < ACadVersion.AC1024) {
			this._writer.savePositonForSize();
		}

		this._writer.main.handleReference(cadObject);
		this.writeExtendedData(cadObject.extendedData);
	}

	private writeCommonNonEntityData(cadObject: CadObject): void {
		this.writeCommonData(cadObject);

		if (this.R13_14Only) {
			this._writer.savePositonForSize();
		}

		this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, cadObject.owner.handle);
		this.writeReactorsAndDictionaryHandle(cadObject);
	}

	private writeCommonEntityData(entity: Entity): void {
		this.writeCommonData(entity);
		this._writer.writeBit(false);

		if (this._version >= ACadVersion.AC1012 && this._version <= ACadVersion.AC1014) {
			this._writer.savePositonForSize();
		}

		this.writeEntityMode(entity);
	}

	private writeEntityMode(entity: Entity): void {
		const entmode = this.getEntMode(entity);
		this._writer.write2Bits(entmode);
		if (entmode === 0) {
			this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, entity.owner);
		}

		this.writeReactorsAndDictionaryHandle(entity);

		if (this.R13_14Only) {
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, entity.layer);
			const isbylayerlt = entity.lineType.name === LineType.ByLayerName;
			this._writer.writeBit(isbylayerlt);
			if (isbylayerlt && entity.lineType.handle !== 0) {
				this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, entity.lineType);
			}
		}

		if (!this.R2004Plus) {
			const hasLinks = this._prev != null
				&& this._prev.handle === entity.handle - 1
				&& this._next != null
				&& this._next.handle === entity.handle + 1;

			this._writer.writeBit(hasLinks);

			if (!hasLinks) {
				this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, this._prev);
				this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, this._next);
			}
		}

		this._writer.writeEnColorBook(entity.color, entity.transparency, entity.bookColor != null);

		if (this._version >= ACadVersion.AC1018 && entity.bookColor != null) {
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, entity.bookColor);
		}

		this._writer.writeBitDouble(entity.lineTypeScale);

		if (!(this._version >= ACadVersion.AC1015)) {
			this._writer.writeBitShort(entity.isInvisible ? 0 : 1);
			return;
		}

		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, entity.layer);

		if (entity.lineType.name === LineType.ByLayerName) {
			this._writer.write2Bits(0b00);
		} else if (entity.lineType.name === LineType.ByBlockName) {
			this._writer.write2Bits(0b01);
		} else if (entity.lineType.name === LineType.ContinuousName) {
			this._writer.write2Bits(0b10);
		} else {
			this._writer.write2Bits(0b11);
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, entity.lineType);
		}

		if (this.R2007Plus) {
			this._writer.write2Bits(0b00);
			this._writer.writeByte(0);
		}

		this._writer.write2Bits(0b00);

		if (this._version > ACadVersion.AC1021) {
			this._writer.writeBit(false);
			this._writer.writeBit(false);
			this._writer.writeBit(false);
		}

		this._writer.writeBitShort(entity.isInvisible ? 1 : 0);

		this._writer.writeByte(CadUtils.toIndex(entity.lineWeight));
	}

	private writeExtendedData(data: ExtendedDataDictionary): void {
		if (this.WriteXData) {
			for (const [app, entry] of data) {
				this.writeExtendedDataEntry(app as AppId, entry);
			}
		}
		this._writer.writeBitShort(0);
	}

	private writeExtendedDataEntry(app: AppId, entry: ExtendedData): void {
		const chunks: number[] = [];

		for (const record of entry.records) {
			chunks.push(record.code - 1000);

			if (record instanceof ExtendedDataBinaryChunk) {
				chunks.push(record.value.length);
				for (let i = 0; i < record.value.length; i++) chunks.push(record.value[i]);
			} else if (record instanceof ExtendedDataControlString) {
				chunks.push(record.value === '}' ? 1 : 0);
			} else if (record instanceof ExtendedDataInteger16) {
				const buf = new ArrayBuffer(2);
				new DataView(buf).setInt16(0, record.value, true);
				const bytes = new Uint8Array(buf);
				for (let i = 0; i < 2; i++) chunks.push(bytes[i]);
			} else if (record instanceof ExtendedDataInteger32) {
				const buf = new ArrayBuffer(4);
				new DataView(buf).setInt32(0, record.value, true);
				const bytes = new Uint8Array(buf);
				for (let i = 0; i < 4; i++) chunks.push(bytes[i]);
			} else if (record instanceof ExtendedDataReal ||
				record instanceof ExtendedDataScale ||
				record instanceof ExtendedDataDistance) {
				const buf = new ArrayBuffer(8);
				new DataView(buf).setFloat64(0, record.value, true);
				const bytes = new Uint8Array(buf);
				for (let i = 0; i < 8; i++) chunks.push(bytes[i]);
			} else if (record instanceof ExtendedDataDirection ||
				record instanceof ExtendedDataDisplacement ||
				record instanceof ExtendedDataCoordinate ||
				record instanceof ExtendedDataWorldCoordinate) {
				const buf = new ArrayBuffer(24);
				const dv = new DataView(buf);
				dv.setFloat64(0, record.value.x, true);
				dv.setFloat64(8, record.value.y, true);
				dv.setFloat64(16, record.value.z, true);
				const bytes = new Uint8Array(buf);
				for (let i = 0; i < 24; i++) chunks.push(bytes[i]);
			} else if ('resolveReference' in record && 'value' in record) {
				const href = record as IExtendedDataHandleReference;
				let h = href.value;
				try {
					if (href.resolveReference(this._document) == null) {
						h = 0;
					}
				} catch {
					h = 0;
				}
				const buf = new ArrayBuffer(8);
				let value = BigInt(Math.trunc(h));
				const view = new DataView(buf);
				for (let i = 7; i >= 0; i--) {
					view.setUint8(i, Number(value & 0xFFn));
					value >>= 8n;
				}
				const bytes = new Uint8Array(buf);
				for (let i = 0; i < 8; i++) chunks.push(bytes[i]);
			} else if (record instanceof ExtendedDataString) {
				if (this.R2007Plus) {
					const len = record.value.length + 1;
					const buf = new ArrayBuffer(2);
					new DataView(buf).setUint16(0, len, true);
					const lenBytes = new Uint8Array(buf);
					chunks.push(lenBytes[0], lenBytes[1]);
					const textBytes = this.encodeUtf16LE(record.value);
					for (let i = 0; i < textBytes.length; i++) chunks.push(textBytes[i]);
					chunks.push(0, 0);
				} else {
					const encodingIndex = CadUtils.getCodeIndex(CadUtils.getCodePage(this._writer.encoding));
					const textBytes = this.encodeText(record.value || '');
					const buf = new ArrayBuffer(2);
					new DataView(buf).setUint16(0, textBytes.length, true);
					const lenBytes = new Uint8Array(buf);
					chunks.push(lenBytes[0], lenBytes[1]);
					chunks.push(encodingIndex);
					for (let i = 0; i < textBytes.length; i++) chunks.push(textBytes[i]);
				}
			} else {
				throw new Error(`ExtendedDataRecord of type ${record.constructor.name} not supported.`);
			}
		}

		this._writer.writeBitShort(chunks.length);
		this._writer.main.handleReferenceTyped(DwgReferenceType.HardPointer, app.handle);
		this._writer.writeBytesOffset(new Uint8Array(chunks), 0, chunks.length);
	}

	private writeReactorsAndDictionaryHandle(cadObject: CadObject): void {
		cadObject.cleanReactors();

		this._writer.writeBitLong(cadObject.reactors.length);
		for (const item of cadObject.reactors) {
			this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, item);
		}

		const noDictionary = cadObject.xDictionary == null;

		if (this.R2004Plus) {
			this._writer.writeBit(noDictionary);
			if (!noDictionary) {
				this._writer.handleReferenceTyped(DwgReferenceType.HardOwnership, cadObject.xDictionary);
			}
		} else {
			this._writer.handleReferenceTyped(DwgReferenceType.HardOwnership, cadObject.xDictionary);
		}

		if (this.R2013Plus) {
			this._writer.writeBit(false);
		}

		if (!noDictionary) {
			this._dictionaries.set(cadObject.xDictionary!.handle, cadObject.xDictionary!);
			this._objects.push(cadObject.xDictionary!);
		}
	}

	private getEntMode(entity: Entity): number {
		if (entity.owner == null) return 0;
		if (entity.owner.handle === this._document.paperSpace.handle) return 0b01;
		if (entity.owner.handle === this._document.modelSpace.handle) return 0b10;
		return 0;
	}

	// ==================== Entity Writers ====================

	private writeEntity(entity: Entity): void {
		if (entity instanceof Seqend) {
			this.writeSeqend(entity);
			return;
		}

		const children: Entity[] = [];
		let seqend: Seqend | null = null;

		this.writeCommonEntityData(entity);

		if (entity instanceof Arc) {
			this.writeArc(entity);
		} else if (entity instanceof Circle) {
			this.writeCircle(entity);
		} else if (entity instanceof Dimension) {
			this.writeCommonDimensionData(entity);
			if (entity instanceof DimensionLinear) {
				this.writeDimensionLinear(entity);
			} else if (entity instanceof DimensionAligned) {
				this.writeDimensionAligned(entity);
			} else if (entity instanceof DimensionRadius) {
				this.writeDimensionRadius(entity);
			} else if (entity instanceof DimensionAngular2Line) {
				this.writeDimensionAngular2Line(entity);
			} else if (entity instanceof DimensionAngular3Pt) {
				this.writeDimensionAngular3Pt(entity);
			} else if (entity instanceof DimensionDiameter) {
				this.writeDimensionDiameter(entity);
			} else if (entity instanceof DimensionOrdinate) {
				this.writeDimensionOrdinate(entity);
			} else {
				throw new Error(`Dimension not implemented : ${entity.constructor.name}`);
			}
		} else if (entity instanceof Ellipse) {
			this.writeEllipse(entity);
		} else if (entity instanceof TableEntity) {
			this.writeTableEntity(entity);
		} else if (entity instanceof Insert) {
			this.writeInsert(entity);
			children.push(...entity.attributes);
			seqend = entity.attributes.Seqend;
		} else if (entity instanceof Face3D) {
			this.writeFace3D(entity);
		} else if (entity instanceof Hatch) {
			this.writeHatch(entity);
		} else if (entity instanceof Leader) {
			this.writeLeader(entity);
		} else if (entity instanceof Line) {
			this.writeLine(entity);
		} else if (entity instanceof LwPolyline) {
			this.writeLwPolyline(entity);
		} else if (entity instanceof Mesh) {
			this.writeMesh(entity);
		} else if (entity instanceof MLine) {
			this.writeMLine(entity);
		} else if (entity instanceof MText) {
			this.writeMText(entity);
		} else if (entity instanceof MultiLeader) {
			this.writeMultiLeader(entity);
		} else if (entity instanceof Ole2Frame) {
			this.writeOle2Frame(entity);
		} else if (entity instanceof PdfUnderlay) {
			this.writePdfUnderlay(entity);
		} else if (entity instanceof Point) {
			this.writePoint(entity);
		} else if (entity instanceof ProxyEntity) {
			this.writeProxyEntity(entity);
		} else if (entity instanceof Wall) {
			this.writeWall(entity);
		} else if (entity instanceof PolyfaceMesh) {
			this.writePolyfaceMesh(entity);
			children.push(...entity.faces, ...entity.vertices);
			seqend = entity.vertices.Seqend;
		} else if (entity instanceof Polyline2D) {
			this.writePolyline2D(entity);
			children.push(...entity.vertices);
			seqend = entity.vertices.Seqend;
		} else if (entity instanceof Polyline3D) {
			this.writePolyline3D(entity);
			children.push(...entity.vertices);
			seqend = entity.vertices.Seqend;
		} else if (entity instanceof PolygonMesh) {
			this.writePolygonMesh(entity);
			children.push(...entity.vertices);
			seqend = entity.vertices.Seqend;
		} else if (entity instanceof Ray) {
			this.writeRay(entity);
		} else if (entity instanceof Shape) {
			this.writeShape(entity);
		} else if (entity instanceof Solid) {
			this.writeSolid(entity);
		} else if (entity instanceof Solid3D) {
			this.writeSolid3D(entity);
		} else if (entity instanceof CadBody) {
			this.writeCadBody(entity);
		} else if (entity instanceof Region) {
			this.writeRegion(entity);
		} else if (entity instanceof Spline) {
			this.writeSpline(entity);
		} else if (entity instanceof CadWipeoutBase) {
			this.writeCadImage(entity);
		} else if (entity instanceof AttributeEntity) {
			this.writeAttribute(entity);
		} else if (entity instanceof AttributeDefinition) {
			this.writeAttDefinition(entity);
		} else if (entity instanceof TextEntity) {
			this.writeTextEntity(entity);
		} else if (entity instanceof Tolerance) {
			this.writeTolerance(entity);
		} else if (entity instanceof Vertex2D) {
			this.writeVertex2D(entity);
		} else if (entity instanceof VertexFaceRecord) {
			this.writeFaceRecord(entity);
		} else if (entity instanceof Vertex3D || entity instanceof VertexFaceMesh || entity instanceof PolygonMeshVertex) {
			this.writeVertex(entity as Vertex);
		} else if (entity instanceof Viewport) {
			this.writeViewport(entity);
		} else if (entity instanceof XLine) {
			this.writeXLine(entity);
		} else {
			throw new Error(`Entity not implemented : ${entity.constructor.name}`);
		}

		this.registerObject(entity);
		this.writeChildEntities(children, seqend);
	}

	private writePdfUnderlay(underlay: PdfUnderlay): void {
		this._writer.write3BitDouble(underlay.normal);
		this._writer.write3BitDouble(underlay.insertPoint);
		this._writer.writeBitDouble(underlay.rotation);
		this._writer.writeBitDouble(underlay.xScale);
		this._writer.writeBitDouble(underlay.yScale);
		this._writer.writeBitDouble(underlay.zScale);
		this._writer.writeByte(underlay.flags);
		this._writer.writeByte(underlay.contrast);
		this._writer.writeByte(underlay.fade);
		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, underlay.definition);
		this._writer.writeBitLong(underlay.clipBoundaryVertices.length);
		for (const v of underlay.clipBoundaryVertices) {
			this._writer.write2RawDouble(v);
		}
	}

	private enqueueObject(object: NonGraphicalObject | null | undefined): void {
		if (object == null || object.handle === 0) {
			return;
		}

		if (this.Map.has(object.handle)) {
			return;
		}

		if (this._objects.some((entry) => entry.handle === object.handle)) {
			return;
		}

		this._objects.push(object);
	}

	private writeCommonProxyData(proxy: IProxy): void {
		this._writer.writeBitLong(proxy.classId);

		if (!this.R2000Plus) {
			return;
		}

		if (this._version > ACadVersion.AC1015) {
			this._writer.writeVariableText('');
		}

		if (!this.R2018Plus) {
			this._writer.writeBitLong((proxy.version as number) | (proxy.maintenanceVersion << 16));
		} else {
			this._writer.writeBitLong(proxy.version);
			this._writer.writeBitLong(proxy.maintenanceVersion);
		}

		this._writer.writeBit(proxy.originalDataFormatDxf);
	}

	private writeArc(arc: Arc): void {
		this.writeCircle(arc);
		this._writer.writeBitDouble(arc.startAngle);
		this._writer.writeBitDouble(arc.endAngle);
	}

	private writeAttribute(att: AttributeEntity): void {
		this.writeCommonAttData(att);
	}

	private writeAttDefinition(attdef: AttributeDefinition): void {
		this.writeCommonAttData(attdef);
		if (this.R2010Plus) {
			this._writer.writeByte(attdef.version);
		}
		this._writer.writeVariableText(attdef.prompt);
	}

	private writeCommonAttData(att: AttributeBase): void {
		this.writeTextEntity(att);

		if (this.R2010Plus) {
			this._writer.writeByte(att.version);
		}

		if (this.R2018Plus) {
			this._writer.writeByte(att.attributeType);
			if (att.attributeType === AttributeType.MultiLine ||
				att.attributeType === AttributeType.ConstantMultiLine) {
				this.writeEntityMode(att.mText);
				this.writeMText(att.mText);
				this._writer.writeBitShort(0);
			}
		}

		this._writer.writeVariableText(att.tag);
		this._writer.writeBitShort(0);
		this._writer.writeByte(att.flags);

		if (this.R2007Plus) {
			this._writer.writeBit(att.isReallyLocked);
		}
	}

	private writeCircle(circle: Circle): void {
		this._writer.write3BitDouble(circle.center);
		this._writer.writeBitDouble(circle.radius);
		this._writer.writeBitThickness(circle.thickness);
		this._writer.writeBitExtrusion(circle.normal);
	}

	private writeCommonDimensionData(dimension: Dimension): void {
		if (this.R2010Plus) {
			this._writer.writeByte(dimension.version);
		}

		this._writer.write3BitDouble(dimension.normal);
		this._writer.write2RawDouble(new XY(dimension.textMiddlePoint.x, dimension.textMiddlePoint.y));
		this._writer.writeBitDouble(dimension.insertionPoint.z);

		let flags = 0;
		flags |= dimension.isTextUserDefinedLocation ? 0b00 : 0b01;
		this._writer.writeByte(flags);

		this._writer.writeVariableText(dimension.text);
		this._writer.writeBitDouble(dimension.textRotation);
		this._writer.writeBitDouble(dimension.horizontalDirection);
		this._writer.write3BitDouble(new XYZ(1, 1, 1));
		this._writer.writeBitDouble(0);

		if (this.R2000Plus) {
			this._writer.writeBitShort(dimension.attachmentPoint);
			this._writer.writeBitShort(dimension.lineSpacingStyle);
			this._writer.writeBitDouble(dimension.lineSpacingFactor);
			this._writer.writeBitDouble(dimension.measurement);
		}

		if (this.R2007Plus) {
			this._writer.writeBit(false);
			this._writer.writeBit(dimension.flipArrow1);
			this._writer.writeBit(dimension.flipArrow2);
		}

		this._writer.write2RawDouble(new XY(dimension.insertionPoint.x, dimension.insertionPoint.y));
		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, dimension.style);
		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, dimension.block);
	}

	private writeDimensionLinear(dimension: DimensionLinear): void {
		this.writeDimensionAligned(dimension);
		this._writer.writeBitDouble(dimension.rotation);
	}

	private writeDimensionAligned(dimension: DimensionAligned): void {
		this._writer.write3BitDouble(dimension.firstPoint);
		this._writer.write3BitDouble(dimension.secondPoint);
		this._writer.write3BitDouble(dimension.definitionPoint);
		this._writer.writeBitDouble(dimension.extLineRotation);
	}

	private writeDimensionRadius(dimension: DimensionRadius): void {
		this._writer.write3BitDouble(dimension.definitionPoint);
		this._writer.write3BitDouble(dimension.angleVertex);
		this._writer.writeBitDouble(dimension.leaderLength);
	}

	private writeDimensionAngular2Line(dimension: DimensionAngular2Line): void {
		this._writer.write2RawDouble(new XY(dimension.dimensionArc.x, dimension.dimensionArc.y));
		this._writer.write3BitDouble(dimension.firstPoint);
		this._writer.write3BitDouble(dimension.secondPoint);
		this._writer.write3BitDouble(dimension.angleVertex);
		this._writer.write3BitDouble(dimension.definitionPoint);
	}

	private writeDimensionAngular3Pt(dimension: DimensionAngular3Pt): void {
		this._writer.write3BitDouble(dimension.definitionPoint);
		this._writer.write3BitDouble(dimension.firstPoint);
		this._writer.write3BitDouble(dimension.secondPoint);
		this._writer.write3BitDouble(dimension.angleVertex);
	}

	private writeDimensionDiameter(dimension: DimensionDiameter): void {
		this._writer.write3BitDouble(dimension.definitionPoint);
		this._writer.write3BitDouble(dimension.angleVertex);
		this._writer.writeBitDouble(dimension.leaderLength);
	}

	private writeDimensionOrdinate(dimension: DimensionOrdinate): void {
		this._writer.write3BitDouble(dimension.definitionPoint);
		this._writer.write3BitDouble(dimension.featureLocation);
		this._writer.write3BitDouble(dimension.leaderEndpoint);
		this._writer.writeByte(dimension.isOrdinateTypeX ? 1 : 0);
	}

	private writeEllipse(ellipse: Ellipse): void {
		this._writer.write3BitDouble(ellipse.center);
		this._writer.write3BitDouble(ellipse.majorAxisEndPoint);
		this._writer.write3BitDouble(ellipse.normal);
		this._writer.writeBitDouble(ellipse.radiusRatio);
		this._writer.writeBitDouble(ellipse.startParameter);
		this._writer.writeBitDouble(ellipse.endParameter);
	}

	private writeInsert(insert: Insert): void {
		this._writer.write3BitDouble(insert.insertPoint);

		if (this.R13_14Only) {
			this._writer.writeBitDouble(insert.xScale);
			this._writer.writeBitDouble(insert.yScale);
			this._writer.writeBitDouble(insert.zScale);
		}

		if (this.R2000Plus) {
			if (insert.xScale === 1.0 && insert.yScale === 1.0 && insert.zScale === 1.0) {
				this._writer.write2Bits(3);
			} else if (insert.xScale === insert.yScale && insert.xScale === insert.zScale) {
				this._writer.write2Bits(2);
				this._writer.writeRawDouble(insert.xScale);
			} else if (insert.xScale === 1.0) {
				this._writer.write2Bits(1);
				this._writer.writeBitDoubleWithDefault(insert.yScale, 1.0);
				this._writer.writeBitDoubleWithDefault(insert.zScale, 1.0);
			} else {
				this._writer.write2Bits(0);
				this._writer.writeRawDouble(insert.xScale);
				this._writer.writeBitDoubleWithDefault(insert.yScale, insert.xScale);
				this._writer.writeBitDoubleWithDefault(insert.zScale, insert.xScale);
			}
		}

		this._writer.writeBitDouble(insert.rotation);
		this._writer.write3BitDouble(insert.normal);
		this._writer.writeBit(insert.hasAttributes);

		if (this.R2004Plus && insert.hasAttributes) {
			this._writer.writeBitLong(insert.attributes.length);
		}

		if (insert.isMultiple) {
			this._writer.writeBitShort(insert.columnCount);
			this._writer.writeBitShort(insert.rowCount);
			this._writer.writeBitDouble(insert.columnSpacing);
			this._writer.writeBitDouble(insert.rowSpacing);
		}

		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, insert.block);

		if (!insert.hasAttributes) return;

		if (this._version >= ACadVersion.AC1012 && this._version <= ACadVersion.AC1015) {
			this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, insert.attributes[0]);
			this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, insert.attributes[insert.attributes.length - 1]);
		} else if (this.R2004Plus) {
			for (const att of insert.attributes) {
				this._writer.handleReferenceTyped(DwgReferenceType.HardOwnership, att);
			}
		}

		this._writer.handleReferenceTyped(DwgReferenceType.HardOwnership, insert.attributes.Seqend);
	}

	private writeFace3D(face: Face3D): void {
		if (this.R13_14Only) {
			this._writer.write3BitDouble(face.firstCorner);
			this._writer.write3BitDouble(face.secondCorner);
			this._writer.write3BitDouble(face.thirdCorner);
			this._writer.write3BitDouble(face.fourthCorner);
			this._writer.writeBitShort(face.flags);
		}

		if (this.R2000Plus) {
			const noFlags = face.flags === InvisibleEdgeFlags.None;
			this._writer.writeBit(noFlags);
			const zIsZero = face.firstCorner.z === 0.0;
			this._writer.writeBit(zIsZero);

			this._writer.writeRawDouble(face.firstCorner.x);
			this._writer.writeRawDouble(face.firstCorner.y);
			if (!zIsZero) {
				this._writer.writeRawDouble(face.firstCorner.z);
			}

			this._writer.write3BitDoubleWithDefault(face.secondCorner, face.firstCorner);
			this._writer.write3BitDoubleWithDefault(face.thirdCorner, face.secondCorner);
			this._writer.write3BitDoubleWithDefault(face.fourthCorner, face.thirdCorner);

			if (!noFlags) {
				this._writer.writeBitShort(face.flags);
			}
		}
	}

	private writeMesh(mesh: Mesh): void {
		this._writer.writeBitShort(mesh.version);
		this._writer.writeBit(mesh.blendCrease !== 0);
		this._writer.writeBitLong(mesh.subdivisionLevel);
		this._writer.writeBitLong(mesh.vertices.length);
		for (const vertex of mesh.vertices) {
			this._writer.write3BitDouble(vertex);
		}

		const nfaces = mesh.faces.reduce((sum, f) => sum + 1 + f.length, 0);
		this._writer.writeBitLong(nfaces);
		for (const face of mesh.faces) {
			this._writer.writeBitLong(face.length);
			for (const index of face) {
				this._writer.writeBitLong(index);
			}
		}

		this._writer.writeBitLong(mesh.edges.length);
		for (const edge of mesh.edges) {
			this._writer.writeBitLong(edge.start);
			this._writer.writeBitLong(edge.end);
		}

		this._writer.writeBitLong(mesh.edges.length);
		for (const edge of mesh.edges) {
			this._writer.writeBitDouble(edge.crease ?? 0);
		}

		this._writer.writeBitLong(0);
	}

	private writeMLine(mline: MLine): void {
		this._writer.writeBitDouble(mline.scaleFactor);
		this._writer.writeByte(mline.justification);
		this._writer.write3BitDouble(mline.startPoint);
		this._writer.write3BitDouble(mline.normal);
		this._writer.writeBitShort((mline.flags & MLineFlags.Closed) !== 0 ? 3 : 1);

		let nlines = 0;
		if (mline.vertices.length > 0) {
			nlines = mline.vertices[0].segments.length;
		}
		this._writer.writeByte(nlines);
		this._writer.writeBitShort(mline.vertices.length);

		for (const v of mline.vertices) {
			this._writer.write3BitDouble(v.position);
			this._writer.write3BitDouble(v.direction);
			this._writer.write3BitDouble(v.miter);

			for (let i = 0; i < nlines; i++) {
				const element = v.segments[i];
				this._writer.writeBitShort(element.parameters.length);
				for (const p of element.parameters) {
					this._writer.writeBitDouble(p);
				}
				this._writer.writeBitShort(element.areaFillParameters.length);
				for (const afp of element.areaFillParameters) {
					this._writer.writeBitDouble(afp);
				}
			}
		}

		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, mline.style);
	}

	private writeLwPolyline(lwPolyline: LwPolyline): void {
		let nbulges = false;
		let ndiffwidth = false;
		for (const item of lwPolyline.vertices) {
			if (!nbulges && item.bulge !== 0.0) nbulges = true;
			if (!ndiffwidth && (item.startWidth !== 0.0 || item.endWidth !== 0.0)) ndiffwidth = true;
		}

		let flags = 0;
		if ((lwPolyline.flags & LwPolylineFlags.Plinegen) !== 0) flags |= 0x100;
		if ((lwPolyline.flags & LwPolylineFlags.Closed) !== 0) flags |= 0x200;
		if (lwPolyline.constantWidth !== 0.0) flags |= 0x4;
		if (lwPolyline.elevation !== 0.0) flags |= 0x8;
		if (lwPolyline.thickness !== 0.0) flags |= 2;
		if (!XYZ.equals(lwPolyline.normal, XYZ.AxisZ)) flags |= 1;
		if (nbulges) flags |= 0x10;
		if (ndiffwidth) flags |= 0x20;

		this._writer.writeBitShort(flags);

		if (lwPolyline.constantWidth !== 0.0) this._writer.writeBitDouble(lwPolyline.constantWidth);
		if (lwPolyline.elevation !== 0.0) this._writer.writeBitDouble(lwPolyline.elevation);
		if (lwPolyline.thickness !== 0.0) this._writer.writeBitDouble(lwPolyline.thickness);
		if (!XYZ.equals(lwPolyline.normal, XYZ.AxisZ)) this._writer.write3BitDouble(lwPolyline.normal);

		this._writer.writeBitLong(lwPolyline.vertices.length);
		if (nbulges) this._writer.writeBitLong(lwPolyline.vertices.length);
		if (ndiffwidth) this._writer.writeBitLong(lwPolyline.vertices.length);

		if (this.R13_14Only) {
			for (const v of lwPolyline.vertices) {
				this._writer.write2RawDouble(v.location);
			}
		}

		if (this.R2000Plus && lwPolyline.vertices.length > 0) {
			let last = lwPolyline.vertices[0];
			this._writer.write2RawDouble(last.location);
			for (let j = 1; j < lwPolyline.vertices.length; j++) {
				const curr = lwPolyline.vertices[j];
				this._writer.write2BitDoubleWithDefault(curr.location, last.location);
				last = curr;
			}
		}

		if (nbulges) {
			for (const v of lwPolyline.vertices) {
				this._writer.writeBitDouble(v.bulge);
			}
		}

		if (ndiffwidth) {
			for (const v of lwPolyline.vertices) {
				this._writer.writeBitDouble(v.startWidth);
				this._writer.writeBitDouble(v.endWidth);
			}
		}
	}

	private writeHatch(hatch: Hatch): void {
		if (this.R2004Plus) {
			const gradient = hatch.gradientColor;
			this._writer.writeBitLong(gradient.enabled ? 1 : 0);
			this._writer.writeBitLong(gradient.reserved);
			this._writer.writeBitDouble(gradient.angle);
			this._writer.writeBitDouble(gradient.shift);
			this._writer.writeBitLong(gradient.isSingleColorGradient ? 1 : 0);
			this._writer.writeBitDouble(gradient.colorTint);

			this._writer.writeBitLong(gradient.colors.length);
			for (const color of gradient.colors) {
				this._writer.writeBitDouble(color.value);
				this._writer.writeCmColor(color.color);
			}
			this._writer.writeVariableText(gradient.name);
		}

		this._writer.writeBitDouble(hatch.elevation);
		this._writer.write3BitDouble(hatch.normal);
		this._writer.writeVariableText(hatch.pattern.name);
		this._writer.writeBit(hatch.isSolid);
		this._writer.writeBit(hatch.isAssociative);

		this._writer.writeBitLong(hatch.paths.length);
		let hasDerivedBoundary = false;
		for (const boundaryPath of hatch.paths) {
			this._writer.writeBitLong(boundaryPath.flags);

			if ((boundaryPath.flags & BoundaryPathFlags.Derived) !== 0) {
				hasDerivedBoundary = true;
			}

			if ((boundaryPath.flags & BoundaryPathFlags.Polyline) !== 0) {
				const pline = boundaryPath.edges[0] as HatchBoundaryPathPolyline;
				this._writer.writeBit(pline.hasBulge);
				this._writer.writeBit(pline.isClosed);
				this._writer.writeBitLong(pline.vertices.length);
				for (const vertex of pline.vertices) {
					this._writer.write2RawDouble(new XY(vertex.X, vertex.Y));
					if (pline.hasBulge) {
						this._writer.writeBitDouble(vertex.Z);
					}
				}
			} else {
				this._writer.writeBitLong(boundaryPath.edges.length);
				for (const edge of boundaryPath.edges) {
					this._writer.writeByte(edge.type);
					if (edge instanceof HatchBoundaryPathLine) {
						this._writer.write2RawDouble(edge.start);
						this._writer.write2RawDouble(edge.end);
					} else if (edge instanceof HatchBoundaryPathArc) {
						this._writer.write2RawDouble(edge.center);
						this._writer.writeBitDouble(edge.radius);
						this._writer.writeBitDouble(edge.startAngle);
						this._writer.writeBitDouble(edge.endAngle);
						this._writer.writeBit(edge.counterClockWise);
					} else if (edge instanceof HatchBoundaryPathEllipse) {
						this._writer.write2RawDouble(edge.center);
						this._writer.write2RawDouble(edge.majorAxisEndPoint);
						this._writer.writeBitDouble(edge.minorToMajorRatio);
						this._writer.writeBitDouble(edge.startAngle);
						this._writer.writeBitDouble(edge.endAngle);
						this._writer.writeBit(edge.counterClockWise);
					} else if (edge instanceof HatchBoundaryPathSpline) {
						this._writer.writeBitLong(edge.degree);
						this._writer.writeBit(edge.isRational);
						this._writer.writeBit(edge.isPeriodic);
						this._writer.writeBitLong(edge.knots.length);
						this._writer.writeBitLong(edge.controlPoints.length);
						for (const k of edge.knots) {
							this._writer.writeBitDouble(k);
						}
						for (let p = 0; p < edge.controlPoints.length; ++p) {
							this._writer.write2RawDouble(new XY(edge.controlPoints[p].X, edge.controlPoints[p].Y));
							if (edge.isRational) {
								this._writer.writeBitDouble(edge.controlPoints[p].Z);
							}
						}

						if (this.R2010Plus) {
							this._writer.writeBitLong(edge.fitPoints.length);
							if (edge.fitPoints.length > 0) {
								for (const fp of edge.fitPoints) {
									this._writer.write2RawDouble(fp);
								}
								this._writer.write2RawDouble(edge.startTangent);
								this._writer.write2RawDouble(edge.endTangent);
							}
						}
					} else {
						throw new Error(`Unrecognized Boundary type: ${edge.constructor.name}`);
					}
				}
			}

			this._writer.writeBitLong(boundaryPath.entities.length);
			for (const e of boundaryPath.entities) {
				this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, e);
			}
		}

		this._writer.writeBitShort(hatch.style);
		this._writer.writeBitShort(hatch.patternType);

		if (!hatch.isSolid) {
			const pattern = hatch.pattern;
			this._writer.writeBitDouble(hatch.patternAngle);
			this._writer.writeBitDouble(hatch.patternScale);
			this._writer.writeBit(hatch.isDouble);

			this._writer.writeBitShort(pattern.lines.length);
			for (const line of pattern.lines) {
				this._writer.writeBitDouble(line.angle);
				this._writer.write2BitDouble(line.basePoint);
				this._writer.write2BitDouble(line.offset);
				this._writer.writeBitShort(line.dashLengths.length);
				for (const dl of line.dashLengths) {
					this._writer.writeBitDouble(dl);
				}
			}
		}

		if (hasDerivedBoundary) {
			this._writer.writeBitDouble(hatch.pixelSize);
		}

		this._writer.writeBitLong(hatch.seedPoints.length);
		for (const sp of hatch.seedPoints) {
			this._writer.write2RawDouble(sp);
		}
	}

	private writeLeader(leader: Leader): void {
		this._writer.writeBit(false);
		this._writer.writeBitShort(leader.creationType);
		this._writer.writeBitShort(leader.pathType);

		this._writer.writeBitLong(leader.vertices.length);
		for (const v of leader.vertices) {
			this._writer.write3BitDouble(v);
		}

		this._writer.write3BitDouble(leader.vertices.length > 0 ? leader.vertices[0] : XYZ.Zero);
		this._writer.write3BitDouble(leader.normal);
		this._writer.write3BitDouble(leader.horizontalDirection);
		this._writer.write3BitDouble(leader.blockOffset);

		if (this._version >= ACadVersion.AC1014) {
			this._writer.write3BitDouble(leader.annotationOffset);
		}

		if (this.R13_14Only) {
			this._writer.writeBitDouble(leader.style.dimensionLineGap);
		}

		if (this._version <= ACadVersion.AC1021) {
			this._writer.writeBitDouble(leader.textHeight);
			this._writer.writeBitDouble(leader.textWidth);
		}

		this._writer.writeBit(leader.hookLineDirection === HookLineDirection.Same);
		this._writer.writeBit(leader.arrowHeadEnabled);

		if (this.R13_14Only) {
			this._writer.writeBitShort(0);
			this._writer.writeBitDouble(leader.style.arrowSize * leader.style.scaleFactor);
			this._writer.writeBit(false);
			this._writer.writeBit(false);
			this._writer.writeBitShort(0);
			this._writer.writeBitShort(0);
			this._writer.writeBit(false);
			this._writer.writeBit(false);
		}

		if (this.R2000Plus) {
			this._writer.writeBitShort(0);
			this._writer.writeBit(false);
			this._writer.writeBit(false);
		}

		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, null);
		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, leader.style);
	}

	private writeOle2Frame(ole2Frame: Ole2Frame): void {
		this._writer.writeBitShort(ole2Frame.version);
		if (this.R2000Plus) {
			this._writer.writeBitShort(0);
		}
		this._writer.writeBitLong(ole2Frame.binaryData.length);
		this._writer.writeBytes(ole2Frame.binaryData);
		if (this.R2000Plus) {
			this._writer.writeByte(3);
		}
	}

	private writeMultiLeader(multiLeader: MultiLeader): void {
		if (this.R2010Plus) {
			this._writer.writeBitShort(2);
		}

		this.writeMultiLeaderAnnotContextSubObject(true, multiLeader.contextData);

		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, multiLeader.style);
		this._writer.writeBitLong(multiLeader.propertyOverrideFlags);
		this._writer.writeBitShort(multiLeader.pathType);
		this._writer.writeCmColor(multiLeader.lineColor);
		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, multiLeader.leaderLineType);
		this._writer.writeBitLong(multiLeader.leaderLineWeight);

		this._writer.writeBit(multiLeader.enableLanding);
		this._writer.writeBit(multiLeader.enableDogleg);
		this._writer.writeBitDouble(multiLeader.landingDistance);
		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, multiLeader.arrowhead);
		this._writer.writeBitDouble(multiLeader.arrowheadSize);
		this._writer.writeBitShort(multiLeader.contentType);
		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, multiLeader.textStyle);
		this._writer.writeBitShort(multiLeader.textLeftAttachment);
		this._writer.writeBitShort(multiLeader.textRightAttachment);
		this._writer.writeBitShort(multiLeader.textAngle);
		this._writer.writeBitShort(multiLeader.textAlignment);
		this._writer.writeCmColor(multiLeader.textColor);
		this._writer.writeBit(multiLeader.textFrame);
		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, multiLeader.blockContentId);
		this._writer.writeCmColor(multiLeader.blockContentColor);
		this._writer.write3BitDouble(multiLeader.blockContentScale);
		this._writer.writeBitDouble(multiLeader.blockContentRotation);
		this._writer.writeBitShort(multiLeader.blockContentConnection);
		this._writer.writeBit(multiLeader.enableAnnotationScale);

		if (this.R2007Pre) {
			const arrowheadEntries: Array<{ handle: BlockRecord | null; isDefault: boolean }> = [];
			if (multiLeader.arrowhead != null) {
				arrowheadEntries.push({ handle: multiLeader.arrowhead, isDefault: true });
			}
			for (const leaderRoot of multiLeader.contextData.leaderRoots) {
				for (const leaderLine of leaderRoot.lines) {
					if (leaderLine.arrowhead != null) {
						arrowheadEntries.push({ handle: leaderLine.arrowhead, isDefault: false });
					}
				}
			}

			this._writer.writeBitLong(arrowheadEntries.length);
			for (const entry of arrowheadEntries) {
				this._writer.writeBit(entry.isDefault);
				this._writer.handleReference(entry.handle);
			}
		}

		const blockLabelCount = multiLeader.blockAttributes.length;
		this._writer.writeBitLong(blockLabelCount);
		for (let bl = 0; bl < blockLabelCount; bl++) {
			const blockAttribute = multiLeader.blockAttributes[bl];
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, blockAttribute.attributeDefinition);
			this._writer.writeVariableText(blockAttribute.text);
			this._writer.writeBitShort(blockAttribute.index);
			this._writer.writeBitDouble(blockAttribute.width);
		}

		this._writer.writeBit(multiLeader.textDirectionNegative);
		this._writer.writeBitShort(multiLeader.textAligninIPE ? 1 : 0);
		this._writer.writeBitShort(multiLeader.textAttachmentPoint);
		this._writer.writeBitDouble(multiLeader.scaleFactor);

		if (this.R2010Plus) {
			this._writer.writeBitShort(multiLeader.textAttachmentDirection);
			this._writer.writeBitShort(multiLeader.textBottomAttachment);
			this._writer.writeBitShort(multiLeader.textTopAttachment);
		}

		if (this.R2013Plus) {
			this._writer.writeBit(multiLeader.extendedToText);
		}
	}

	private writeMultiLeaderAnnotContextSubObject(writeLeaderRootsCount: boolean, annotContext: MultiLeaderObjectContextData): void {
		const leaderRootCount = annotContext.leaderRoots.length;
		if (writeLeaderRootsCount) {
			this._writer.writeBitLong(leaderRootCount);
		} else {
			this._writer.writeBitLong(0);
			this._writer.writeBit(false);
			this._writer.writeBit(false);
			this._writer.writeBit(false);
			this._writer.writeBit(false);
			this._writer.writeBit(false);
			this._writer.writeBit(leaderRootCount === 2);
			this._writer.writeBit(leaderRootCount === 1);
		}

		for (let i = 0; i < leaderRootCount; i++) {
			this.writeLeaderRoot(annotContext.leaderRoots[i]);
		}

		this._writer.writeBitDouble(annotContext.scaleFactor);
		this._writer.write3BitDouble(annotContext.contentBasePoint);
		this._writer.writeBitDouble(annotContext.textHeight);
		this._writer.writeBitDouble(annotContext.arrowheadSize);
		this._writer.writeBitDouble(annotContext.landingGap);
		this._writer.writeBitShort(annotContext.textLeftAttachment);
		this._writer.writeBitShort(annotContext.textRightAttachment);
		this._writer.writeBitShort(annotContext.textAlignment);
		this._writer.writeBitShort(annotContext.blockContentConnection);
		this._writer.writeBit(annotContext.hasTextContents);

		if (annotContext.hasTextContents) {
			this._writer.writeVariableText(annotContext.textLabel);
			this._writer.write3BitDouble(annotContext.textNormal);
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, annotContext.textStyle);
			this._writer.write3BitDouble(annotContext.textLocation);
			this._writer.write3BitDouble(annotContext.direction);
			this._writer.writeBitDouble(annotContext.textRotation);
			this._writer.writeBitDouble(annotContext.boundaryWidth);
			this._writer.writeBitDouble(annotContext.boundaryHeight);
			this._writer.writeBitDouble(annotContext.lineSpacingFactor);
			this._writer.writeBitShort(annotContext.lineSpacing);
			this._writer.writeCmColor(annotContext.textColor);
			this._writer.writeBitShort(annotContext.textAttachmentPoint);
			this._writer.writeBitShort(annotContext.flowDirection);
			this._writer.writeCmColor(annotContext.backgroundFillColor);
			this._writer.writeBitDouble(annotContext.backgroundScaleFactor);
			this._writer.writeBitLong(annotContext.backgroundTransparency);
			this._writer.writeBit(annotContext.backgroundFillEnabled);
			this._writer.writeBit(annotContext.backgroundMaskFillOn);
			this._writer.writeBitShort(annotContext.columnType);
			this._writer.writeBit(annotContext.textHeightAutomatic);
			this._writer.writeBitDouble(annotContext.columnWidth);
			this._writer.writeBitDouble(annotContext.columnGutter);
			this._writer.writeBit(annotContext.columnFlowReversed);

			const columnSizesCount = annotContext.columnSizes.length;
			this._writer.writeBitLong(columnSizesCount);
			for (let i = 0; i < columnSizesCount; i++) {
				this._writer.writeBitDouble(annotContext.columnSizes[i]);
			}

			this._writer.writeBit(annotContext.wordBreak);
			this._writer.writeBit(false);
		} else {
			this._writer.writeBit(annotContext.hasContentsBlock);

			if (annotContext.hasContentsBlock) {
				this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, annotContext.blockContent);
				this._writer.write3BitDouble(annotContext.blockContentNormal);
				this._writer.write3BitDouble(annotContext.blockContentLocation);
				this._writer.write3BitDouble(annotContext.blockContentScale);
				this._writer.writeBitDouble(annotContext.blockContentRotation);
				this._writer.writeCmColor(annotContext.blockContentColor);

				const m4 = annotContext.transformationMatrix;
				this._writer.writeBitDouble(m4.M00); this._writer.writeBitDouble(m4.M10);
				this._writer.writeBitDouble(m4.M20); this._writer.writeBitDouble(m4.M30);
				this._writer.writeBitDouble(m4.M01); this._writer.writeBitDouble(m4.M11);
				this._writer.writeBitDouble(m4.M21); this._writer.writeBitDouble(m4.M31);
				this._writer.writeBitDouble(m4.M02); this._writer.writeBitDouble(m4.M12);
				this._writer.writeBitDouble(m4.M22); this._writer.writeBitDouble(m4.M32);
				this._writer.writeBitDouble(m4.M03); this._writer.writeBitDouble(m4.M13);
				this._writer.writeBitDouble(m4.M23); this._writer.writeBitDouble(m4.M33);
			}
		}

		this._writer.write3BitDouble(annotContext.basePoint);
		this._writer.write3BitDouble(annotContext.baseDirection);
		this._writer.write3BitDouble(annotContext.baseVertical);
		this._writer.writeBit(annotContext.normalReversed);

		if (this.R2010Plus) {
			this._writer.writeBitShort(annotContext.textTopAttachment);
			this._writer.writeBitShort(annotContext.textBottomAttachment);
		}
	}

	private writeLeaderRoot(leaderRoot: LeaderRoot): void {
		this._writer.writeBit(leaderRoot.contentValid);
		this._writer.writeBit(true);
		this._writer.write3BitDouble(leaderRoot.connectionPoint);
		this._writer.write3BitDouble(leaderRoot.direction);

		this._writer.writeBitLong(leaderRoot.breakStartEndPointsPairs.length);
		for (const sep of leaderRoot.breakStartEndPointsPairs) {
			this._writer.write3BitDouble(sep.startPoint);
			this._writer.write3BitDouble(sep.endPoint);
		}

		this._writer.writeBitLong(leaderRoot.leaderIndex);
		this._writer.writeBitDouble(leaderRoot.landingDistance);

		this._writer.writeBitLong(leaderRoot.lines.length);
		for (const leaderLine of leaderRoot.lines) {
			this.writeLeaderLine(leaderLine);
		}

		if (this.R2010Plus) {
			this._writer.writeBitShort(leaderRoot.textAttachmentDirection);
		}
	}

	private writeLeaderLine(leaderLine: LeaderLine): void {
		this._writer.writeBitLong(leaderLine.points.length);
		for (const point of leaderLine.points) {
			this._writer.write3BitDouble(point);
		}

		this._writer.writeBitLong(leaderLine.breakInfoCount);
		if (leaderLine.breakInfoCount > 0) {
			this._writer.writeBitLong(leaderLine.segmentIndex);
			this._writer.writeBitLong(leaderLine.startEndPoints.length);
			for (const sep of leaderLine.startEndPoints) {
				this._writer.write3BitDouble(sep.startPoint);
				this._writer.write3BitDouble(sep.endPoint);
			}
		}

		this._writer.writeBitLong(leaderLine.index);

		if (this.R2010Plus) {
			this._writer.writeBitShort(leaderLine.pathType);
			this._writer.writeCmColor(leaderLine.lineColor);
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, leaderLine.lineType);
			this._writer.writeBitLong(leaderLine.lineWeight);
			this._writer.writeBitDouble(leaderLine.arrowheadSize);
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, leaderLine.arrowhead);
			this._writer.writeBitLong(leaderLine.overrideFlags);
		}
	}

	private writeLine(line: Line): void {
		if (this.R13_14Only) {
			this._writer.write3BitDouble(line.startPoint);
			this._writer.write3BitDouble(line.endPoint);
		}

		if (this.R2000Plus) {
			const flag = line.startPoint.z === 0.0 && line.endPoint.z === 0.0;
			this._writer.writeBit(flag);
			this._writer.writeRawDouble(line.startPoint.x);
			this._writer.writeBitDoubleWithDefault(line.endPoint.x, line.startPoint.x);
			this._writer.writeRawDouble(line.startPoint.y);
			this._writer.writeBitDoubleWithDefault(line.endPoint.y, line.startPoint.y);

			if (!flag) {
				this._writer.writeRawDouble(line.startPoint.z);
				this._writer.writeBitDoubleWithDefault(line.endPoint.z, line.startPoint.z);
			}
		}

		this._writer.writeBitThickness(line.thickness);
		this._writer.writeBitExtrusion(line.normal);
	}

	private writePoint(point: Point): void {
		this._writer.write3BitDouble(point.location);
		this._writer.writeBitThickness(point.thickness);
		this._writer.writeBitExtrusion(point.normal);
		this._writer.writeBitDouble(point.rotation);
	}

	private writeProxyEntity(proxy: ProxyEntity): void {
		this.writeCommonProxyData(proxy);
	}

	private writeWall(wall: Wall): void {
		if (this.R2000Plus) {
			this._writer.writeBitLong(wall.version);
		}

		if (wall.rawData != null && wall.rawData.length > 0) {
			this._writer.writeBytes(wall.rawData);
		}

		this._writer.handleReference(wall.binRecord ?? wall.binRecordHandle ?? 0);
		this._writer.handleReference(wall.style ?? 0);
		this._writer.handleReference(wall.cleanupGroup ?? 0);

		this.enqueueObject(wall.binRecord);
		this.enqueueObject(wall.style);
		this.enqueueObject(wall.cleanupGroup);
	}

	private writePolyfaceMesh(fm: PolyfaceMesh): void {
		this._writer.writeBitShort(fm.vertices.length);
		this._writer.writeBitShort(fm.faces.length);

		if (this.R2004Plus) {
			this._writer.writeBitLong(fm.vertices.length + fm.faces.length);
			for (const v of fm.vertices) {
				this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, v);
			}
			for (const f of fm.faces) {
				this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, f);
			}
		}

		if (this.R13_15Only) {
			const child: CadObject[] = [...fm.vertices, ...fm.faces];
			this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, child.length > 0 ? child[0] : null);
			this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, child.length > 0 ? child[child.length - 1] : null);
		}

		this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, fm.vertices.Seqend);
	}

	private writePolyline2D(pline: Polyline2D): void {
		this._writer.writeBitShort(pline.flags);
		this._writer.writeBitShort(pline.smoothSurface);
		this._writer.writeBitDouble(pline.startWidth);
		this._writer.writeBitDouble(pline.endWidth);
		this._writer.writeBitThickness(pline.thickness);
		this._writer.writeBitDouble(pline.elevation);
		this._writer.writeBitExtrusion(pline.normal);

		if (this.R2004Plus) {
			this._writer.writeBitLong(pline.vertices.length);
			for (const v of pline.vertices) {
				this._writer.handleReferenceTyped(DwgReferenceType.HardOwnership, v);
			}
		}

		if (this._version >= ACadVersion.AC1012 && this._version <= ACadVersion.AC1015) {
			this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, pline.vertices.length > 0 ? pline.vertices[0] : null);
			this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, pline.vertices.length > 0 ? pline.vertices[pline.vertices.length - 1] : null);
		}

		this._writer.handleReferenceTyped(DwgReferenceType.HardOwnership, pline.vertices.Seqend);
	}

	private writePolyline3D(pline: Polyline3D): void {
		this._writer.writeByte(0);
		this._writer.writeByte((pline.flags & PolylineFlags.ClosedPolylineOrClosedPolygonMeshInM) !== 0 ? 1 : 0);

		if (this.R2004Plus) {
			this._writer.writeBitLong(pline.vertices.length);
			for (const vertex of pline.vertices) {
				this._writer.handleReferenceTyped(DwgReferenceType.HardOwnership, vertex);
			}
		}

		if (this._version >= ACadVersion.AC1012 && this._version <= ACadVersion.AC1015) {
			this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, pline.vertices.length > 0 ? pline.vertices[0] : null);
			this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, pline.vertices.length > 0 ? pline.vertices[pline.vertices.length - 1] : null);
		}

		this._writer.handleReferenceTyped(DwgReferenceType.HardOwnership, pline.vertices.Seqend);
	}

	private writePolygonMesh(pline: PolygonMesh): void {
		this._writer.writeBitShort(pline.flags);
		this._writer.writeBitShort(pline.smoothSurface);
		this._writer.writeBitShort(pline.mVertexCount);
		this._writer.writeBitShort(pline.nVertexCount);
		this._writer.writeBitShort(pline.mSmoothSurfaceDensity);
		this._writer.writeBitShort(pline.nSmoothSurfaceDensity);

		if (this._version >= ACadVersion.AC1012 && this._version <= ACadVersion.AC1015) {
			this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, pline.vertices.length > 0 ? pline.vertices[0] : null);
			this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, pline.vertices.length > 0 ? pline.vertices[pline.vertices.length - 1] : null);
		}

		if (this.R2004Plus) {
			this._writer.writeBitLong(pline.vertices.length);
			for (const vertex of pline.vertices) {
				this._writer.handleReferenceTyped(DwgReferenceType.HardOwnership, vertex);
			}
		}

		this._writer.handleReferenceTyped(DwgReferenceType.HardOwnership, pline.vertices.Seqend);
	}

	private writeSeqend(seqend: Seqend | null): void {
		if (seqend == null) return;

		const prevHolder = this._prev;
		const nextHolder = this._next;
		this._prev = null;
		this._next = null;

		this.writeCommonEntityData(seqend);
		this.registerObject(seqend);

		this._prev = prevHolder;
		this._next = nextHolder;
	}

	private writeShape(shape: Shape): void {
		this._writer.write3BitDouble(shape.insertionPoint);
		this._writer.writeBitDouble(shape.size);
		this._writer.writeBitDouble(shape.rotation);
		this._writer.writeBitDouble(shape.relativeXScale);
		this._writer.writeBitDouble(shape.obliqueAngle);
		this._writer.writeBitDouble(shape.thickness);
		this._writer.writeBitShort(shape.shapeIndex);
		this._writer.write3BitDouble(shape.normal);
		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, null);
	}

	private writeSolid(solid: Solid): void {
		this._writer.writeBitThickness(solid.thickness);
		this._writer.writeBitDouble(solid.firstCorner.z);

		this._writer.writeRawDouble(solid.firstCorner.x);
		this._writer.writeRawDouble(solid.firstCorner.y);
		this._writer.writeRawDouble(solid.secondCorner.x);
		this._writer.writeRawDouble(solid.secondCorner.y);
		this._writer.writeRawDouble(solid.thirdCorner.x);
		this._writer.writeRawDouble(solid.thirdCorner.y);
		this._writer.writeRawDouble(solid.fourthCorner.x);
		this._writer.writeRawDouble(solid.fourthCorner.y);

		this._writer.writeBitExtrusion(solid.normal);
	}

	private writeSolid3D(solid: Solid3D): void {
		this.writeModelerGeometry(solid);
		if (this.R2007Plus) {
			this._writer.handleReference(0);
		}
	}

	private writeTableEntity(table: TableEntity): void {
		this.writeInsert(table);

		if (this.R2010Plus) {
			this._writer.writeByte(table.version);
			this._writer.handleReference(0);
			this._writer.writeBitLong(0);
			if (this.R2013Plus) {
				this._writer.writeBitLong(0);
			} else {
				this._writer.writeBit(false);
			}
			return;
		}

		this._writer.writeBitShort(table.valueFlag);
		this._writer.write3BitDouble(table.horizontalDirection);
		this._writer.writeBitLong(table.columns.length);
		this._writer.writeBitLong(table.rows.length);
		for (const column of table.columns) {
			this._writer.writeBitDouble(column.width);
		}
		for (const row of table.rows) {
			this._writer.writeBitDouble(row.height);
		}

		this._writer.handleReference(table.style);
		for (const row of table.rows) {
			for (const cell of row.cells) {
				this.writeTableCell(cell);
			}
		}

		this._writer.writeBit(false);
		this._writer.writeBit(false);
		this._writer.writeBit(false);
		this._writer.writeBit(false);
	}

	private writeCadBody(body: CadBody): void {
		this.writeModelerGeometry(body);
	}

	private writeRegion(region: Region): void {
		this.writeModelerGeometry(region);
	}

	private writeModelerGeometry(geometry: ModelerGeometry): void {
		if (!this.R2013Plus) {
			this._writer.writeBit(true);
		}

		this._writer.writeBit(true);

		const hasPoint = geometry.point.x !== 0 || geometry.point.y !== 0 || geometry.point.z !== 0;
		this._writer.writeBit(hasPoint);
		if (hasPoint) {
			this._writer.write3BitDouble(geometry.point);
		}

		this._writer.writeBitLong(0);
		this._writer.writeBit(geometry.wires.length > 0);
		if (geometry.wires.length > 0) {
			this._writer.writeBitLong(geometry.wires.length);
			for (const wire of geometry.wires) {
				this.writeModelerGeometryWire(wire);
			}
		}

		this._writer.writeBitLong(geometry.silhouettes.length);
		for (const silhouette of geometry.silhouettes) {
			this._writer.writeBitLongLong(silhouette.viewportId);
			this._writer.write3BitDouble(silhouette.viewportTarget);
			this._writer.write3BitDouble(silhouette.viewportDirectionFromTarget);
			this._writer.write3BitDouble(silhouette.viewportUpDirection);
			this._writer.writeBit(silhouette.viewportPerspective);

			this._writer.writeBit(silhouette.wires.length > 0);
			if (silhouette.wires.length > 0) {
				this._writer.writeBitLong(silhouette.wires.length);
				for (const wire of silhouette.wires) {
					this.writeModelerGeometryWire(wire);
				}
			}
		}

		this._writer.writeBit(true);

		if (this.R2007Plus) {
			this._writer.writeBitLong(0);
		}
	}

	private writeModelerGeometryWire(wire: ModelerGeometryWire): void {
		this._writer.writeByte(wire.type);
		this._writer.writeBitLong(wire.selectionMarker);
		this._writer.writeBitShort(wire.color?.getApproxIndex() ?? 256);
		this._writer.writeBitLong(wire.acisIndex);
		this._writer.writeBitLong(wire.points.length);
		for (const point of wire.points) {
			this._writer.write3BitDouble(point);
		}

		this._writer.writeBit(wire.applyTransformPresent);
		if (!wire.applyTransformPresent) {
			return;
		}

		this._writer.write3BitDouble(wire.xAxis);
		this._writer.write3BitDouble(wire.yAxis);
		this._writer.write3BitDouble(wire.zAxis);
		this._writer.write3BitDouble(wire.translation);
		this._writer.writeBitDouble(wire.scale);
		this._writer.writeBit(wire.hasRotation);
		this._writer.writeBit(wire.hasReflection);
		this._writer.writeBit(wire.hasShear);
	}

	private writeTableCell(cell: TableEntityCell): void {
		this._writer.writeBitShort(cell.type);
		this._writer.writeByte(cell.edgeFlags);
		this._writer.writeBit(cell.mergedValue !== 0);
		this._writer.writeBit(cell.autoFit);
		this._writer.writeBitLong(cell.borderWidth);
		this._writer.writeBitLong(cell.borderHeight);
		this._writer.writeBitDouble(cell.rotation);

		this._writer.handleReference(0);
		if (cell.type === CellType.Text) {
			const value = cell.content?.cadValue.value;
			this._writer.writeVariableText(typeof value === 'string' ? value : value == null ? '' : String(value));
		} else if (cell.type === CellType.Block) {
			this._writer.writeBitDouble(cell.blockScale);
			this._writer.writeBit(false);
		}

		this._writer.writeBit(false);

		if (this.R2007Plus) {
			this._writer.writeBitLong(0);
			this.writeCadValue(cell.content?.cadValue ?? { ...new CadValue(), valueType: 4, value: '' } as CadValue);
		}
	}

	private writeCadImage(image: CadWipeoutBase): void {
		this._writer.writeBitLong(image.classVersion);
		this._writer.write3BitDouble(image.insertPoint);
		this._writer.write3BitDouble(image.uVector);
		this._writer.write3BitDouble(image.vVector);
		this._writer.write2RawDouble(image.size);
		this._writer.writeBitShort(image.flags);
		this._writer.writeBit(image.clippingState);
		this._writer.writeByte(image.brightness);
		this._writer.writeByte(image.contrast);
		this._writer.writeByte(image.fade);

		if (this.R2010Plus) {
			this._writer.writeBit(image.clipMode === ClipMode.Inside);
		}

		this._writer.writeBitShort(image.clipType);

		switch (image.clipType) {
			case ClipType.Rectangular:
				this._writer.write2RawDouble(image.clipBoundaryVertices[0]);
				this._writer.write2RawDouble(image.clipBoundaryVertices[1]);
				break;
			case ClipType.Polygonal:
				this._writer.writeBitLong(image.clipBoundaryVertices.length);
				for (let i = 0; i < image.clipBoundaryVertices.length; i++) {
					this._writer.write2RawDouble(image.clipBoundaryVertices[i]);
				}
				break;
		}

		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, image.definition);
		this._writer.handleReference(image.definitionReactor);

		if (image.definitionReactor != null) {
			this._objects.push(image.definitionReactor);
		}
	}

	private writeSpline(spline: Spline): void {
		let scenario: number;

		if (this.R2013Plus) {
			if (spline.knotParametrization === KnotParametrization.Custom || spline.fitPoints.length === 0) {
				scenario = 1;
				spline.flags1 &= ~SplineFlags1.UseKnotParameter;
			} else {
				scenario = 2;
				spline.flags1 |= SplineFlags1.MethodFitPoints | SplineFlags1.UseKnotParameter;
			}
			this._writer.writeBitLong(scenario);
			this._writer.writeBitLong(spline.flags1);
			this._writer.writeBitLong(spline.knotParametrization);
		} else {
			scenario = spline.fitPoints.length <= 0 ? 1 : 2;
			if (scenario === 2 && spline.knotParametrization !== 0) {
				scenario = 1;
			}
			this._writer.writeBitLong(scenario);
		}

		this._writer.writeBitLong(spline.degree);

		const flag = spline.weights.length > 0;
		switch (scenario) {
			case 1:
				this._writer.writeBit((spline.flags & SplineFlags.Rational) !== 0);
				this._writer.writeBit((spline.flags & SplineFlags.Closed) !== 0);
				this._writer.writeBit((spline.flags & SplineFlags.Periodic) !== 0);
				this._writer.writeBitDouble(spline.knotTolerance);
				this._writer.writeBitDouble(spline.controlPointTolerance);
				this._writer.writeBitLong(spline.knots.length);
				this._writer.writeBitLong(spline.controlPoints.length);
				this._writer.writeBit(flag);

				for (const k of spline.knots) {
					this._writer.writeBitDouble(k);
				}
				for (let i = 0; i < spline.controlPoints.length; i++) {
					this._writer.write3BitDouble(spline.controlPoints[i]);
					if (flag) {
						this._writer.writeBitDouble(spline.weights[i]);
					}
				}
				break;
			case 2:
				this._writer.writeBitDouble(spline.fitTolerance);
				this._writer.write3BitDouble(spline.startTangent);
				this._writer.write3BitDouble(spline.endTangent);
				this._writer.writeBitLong(spline.fitPoints.length);
				for (const fp of spline.fitPoints) {
					this._writer.write3BitDouble(fp);
				}
				break;
		}
	}

	private writeRay(ray: Ray): void {
		this._writer.write3BitDouble(ray.startPoint);
		this._writer.write3BitDouble(ray.direction);
	}

	private writeTextEntity(text: TextEntity): void {
		if (this.R13_14Only) {
			this._writer.writeBitDouble(text.insertPoint.z);
			this._writer.writeRawDouble(text.insertPoint.x);
			this._writer.writeRawDouble(text.insertPoint.y);
			this._writer.writeRawDouble(text.alignmentPoint.x);
			this._writer.writeRawDouble(text.alignmentPoint.y);
			this._writer.write3BitDouble(text.normal);
			this._writer.writeBitDouble(text.thickness);
			this._writer.writeBitDouble(text.obliqueAngle);
			this._writer.writeBitDouble(text.rotation);
			this._writer.writeBitDouble(text.height);
			this._writer.writeBitDouble(text.widthFactor);
			this._writer.writeVariableText(text.value);
			this._writer.writeBitShort(text.mirror);
			this._writer.writeBitShort(text.horizontalAlignment);
			this._writer.writeBitShort(text.verticalAlignment);
		} else {
			let dataFlags = 0;
			if (text.insertPoint.z === 0.0) dataFlags |= 0b1;
			if (XYZ.equals(text.alignmentPoint, XYZ.Zero)) dataFlags |= 0b10;
			if (text.obliqueAngle === 0.0) dataFlags |= 0b100;
			if (text.rotation === 0.0) dataFlags |= 0b1000;
			if (text.widthFactor === 1.0) dataFlags |= 0b10000;
			if (text.mirror === TextMirrorFlag.None) dataFlags |= 0b100000;
			if (text.horizontalAlignment === TextHorizontalAlignment.Left) dataFlags |= 0b1000000;
			if (text.verticalAlignment === TextVerticalAlignmentType.Baseline) dataFlags |= 0b10000000;

			this._writer.writeByte(dataFlags);

			if ((dataFlags & 0b1) === 0) this._writer.writeRawDouble(text.insertPoint.z);

			this._writer.writeRawDouble(text.insertPoint.x);
			this._writer.writeRawDouble(text.insertPoint.y);

			if ((dataFlags & 0x2) === 0) {
				this._writer.writeBitDoubleWithDefault(text.alignmentPoint.x, text.insertPoint.x);
				this._writer.writeBitDoubleWithDefault(text.alignmentPoint.y, text.insertPoint.y);
			}

			this._writer.writeBitExtrusion(text.normal);
			this._writer.writeBitThickness(text.thickness);

			if ((dataFlags & 0x4) === 0) this._writer.writeRawDouble(text.obliqueAngle);
			if ((dataFlags & 0x8) === 0) this._writer.writeRawDouble(text.rotation);
			this._writer.writeRawDouble(text.height);
			if ((dataFlags & 0x10) === 0) this._writer.writeRawDouble(text.widthFactor);
			this._writer.writeVariableText(text.value);
			if ((dataFlags & 0x20) === 0) this._writer.writeBitShort(text.mirror);
			if ((dataFlags & 0x40) === 0) this._writer.writeBitShort(text.horizontalAlignment);
			if ((dataFlags & 0x80) === 0) this._writer.writeBitShort(text.verticalAlignment);
		}

		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, text.style);
	}

	private writeMText(mtext: MText): void {
		this._writer.write3BitDouble(mtext.insertPoint);
		this._writer.write3BitDouble(mtext.normal);
		this._writer.write3BitDouble(mtext.alignmentPoint);
		this._writer.writeBitDouble(mtext.rectangleWidth);

		if (this.R2007Plus) {
			this._writer.writeBitDouble(mtext.rectangleHeight);
		}

		this._writer.writeBitDouble(mtext.height);
		this._writer.writeBitShort(mtext.attachmentPoint);
		this._writer.writeBitShort(mtext.drawingDirection);
		this._writer.writeBitDouble(0);
		this._writer.writeBitDouble(0);
		this._writer.writeVariableText(mtext.value);
		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, mtext.style);

		if (this.R2000Plus) {
			this._writer.writeBitShort(mtext.lineSpacingStyle);
			this._writer.writeBitDouble(mtext.lineSpacing);
			this._writer.writeBit(false);
		}

		if (this.R2004Plus) {
			this._writer.writeBitLong(mtext.backgroundFillFlags);

			if ((mtext.backgroundFillFlags & BackgroundFillFlags.UseBackgroundFillColor) !== BackgroundFillFlags.None
				|| (this._version > ACadVersion.AC1027 && (mtext.backgroundFillFlags & BackgroundFillFlags.TextFrame) > 0)) {
				this._writer.writeBitDouble(mtext.backgroundScale);
				this._writer.writeCmColor(mtext.backgroundColor);
				this._writer.writeBitLong(mtext.backgroundTransparency);
			}
		}

		if (!this.R2018Plus) return;

		this._writer.writeBit(!mtext.isAnnotative);
		if (mtext.isAnnotative) return;

		this._writer.writeBitShort(4);
		this._writer.writeBit(true);
		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, null);
		this._writer.writeBitLong(mtext.attachmentPoint);
		this._writer.write3BitDouble(mtext.alignmentPoint);
		this._writer.write3BitDouble(mtext.insertPoint);
		this._writer.writeBitDouble(mtext.rectangleWidth);
		this._writer.writeBitDouble(mtext.rectangleHeight);
		this._writer.writeBitDouble(mtext.horizontalWidth);
		this._writer.writeBitDouble(mtext.verticalHeight);

		const columnData = mtext.columnData;
		const columnType = columnData?.columnType ?? ColumnType.NoColumns;
		this._writer.writeBitShort(columnType);

		if (columnType === ColumnType.NoColumns || columnData == null) {
			return;
		}

		const columnCount = columnData.columnCount;
		this._writer.writeBitLong(columnCount);
		this._writer.writeBitDouble(columnData.width);
		this._writer.writeBitDouble(columnData.gutter);
		this._writer.writeBit(columnData.autoHeight);
		this._writer.writeBit(columnData.flowReversed);

		if (!columnData.autoHeight && columnType === ColumnType.DynamicColumns) {
			for (const height of columnData.heights) {
				this._writer.writeBitDouble(height);
			}
		}
	}

	private writeFaceRecord(face: VertexFaceRecord): void {
		this._writer.writeBitShort(face.index1);
		this._writer.writeBitShort(face.index2);
		this._writer.writeBitShort(face.index3);
		this._writer.writeBitShort(face.index4);
	}

	private writeVertex2D(vertex: Vertex2D): void {
		this._writer.writeByte(vertex.flags);
		this._writer.writeBitDouble(vertex.location.x);
		this._writer.writeBitDouble(vertex.location.y);
		this._writer.writeBitDouble(0.0);

		if (vertex.startWidth !== 0.0 && vertex.endWidth === vertex.startWidth) {
			this._writer.writeBitDouble(0.0 - vertex.startWidth);
		} else {
			this._writer.writeBitDouble(vertex.startWidth);
			this._writer.writeBitDouble(vertex.endWidth);
		}

		this._writer.writeBitDouble(vertex.bulge);

		if (this.R2010Plus) {
			this._writer.writeBitLong(vertex.id);
		}

		this._writer.writeBitDouble(vertex.curveTangent);
	}

	private writeVertex(vertex: Vertex): void {
		this._writer.writeByte(vertex.flags);
		this._writer.write3BitDouble(vertex.location);
	}

	private writeTolerance(tolerance: Tolerance): void {
		if (this.R13_14Only) {
			this._writer.writeBitShort(0);
			this._writer.writeBitDouble(0.0);
			this._writer.writeBitDouble(0.0);
		}

		this._writer.write3BitDouble(tolerance.insertionPoint);
		this._writer.write3BitDouble(tolerance.direction);
		this._writer.write3BitDouble(tolerance.normal);
		this._writer.writeVariableText(tolerance.text);
		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, tolerance.style);
	}

	private writeViewport(viewport: Viewport): void {
		this._writer.write3BitDouble(viewport.center);
		this._writer.writeBitDouble(viewport.width);
		this._writer.writeBitDouble(viewport.height);

		if (this.R2000Plus) {
			this._writer.write3BitDouble(viewport.viewTarget);
			this._writer.write3BitDouble(viewport.viewDirection);
			this._writer.writeBitDouble(viewport.twistAngle);
			this._writer.writeBitDouble(viewport.viewHeight);
			this._writer.writeBitDouble(viewport.lensLength);
			this._writer.writeBitDouble(viewport.frontClipPlane);
			this._writer.writeBitDouble(viewport.backClipPlane);
			this._writer.writeBitDouble(viewport.snapAngle);
			this._writer.write2RawDouble(viewport.viewCenter);
			this._writer.write2RawDouble(viewport.snapBase);
			this._writer.write2RawDouble(viewport.snapSpacing);
			this._writer.write2RawDouble(viewport.gridSpacing);
			this._writer.writeBitShort(viewport.circleZoomPercent);
		}

		if (this.R2007Plus) {
			this._writer.writeBitShort(viewport.majorGridLineFrequency);
		}

		if (this.R2000Plus) {
			this._writer.writeBitLong(viewport.frozenLayers.length);
			this._writer.writeBitLong(viewport.status);
			this._writer.writeVariableText('');
			this._writer.writeByte(viewport.renderMode);
			this._writer.writeBit(viewport.displayUcsIcon);
			this._writer.writeBit(viewport.ucsPerViewport);
			this._writer.write3BitDouble(viewport.ucsOrigin);
			this._writer.write3BitDouble(viewport.ucsXAxis);
			this._writer.write3BitDouble(viewport.ucsYAxis);
			this._writer.writeBitDouble(viewport.elevation);
			this._writer.writeBitShort(viewport.ucsOrthographicType);
		}

		if (this.R2004Plus) {
			this._writer.writeBitShort(viewport.shadePlotMode);
		}

		if (this.R2007Plus) {
			this._writer.writeBit(viewport.useDefaultLighting);
			this._writer.writeByte(viewport.defaultLightingType);
			this._writer.writeBitDouble(viewport.brightness);
			this._writer.writeBitDouble(viewport.contrast);
			this._writer.writeCmColor(viewport.ambientLightColor);
		}

		if (this.R13_14Only) {
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, null);
		}

		if (this.R2000Plus) {
			for (const layer of viewport.frozenLayers) {
				if (this.R2004Plus) {
					this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, layer);
				} else {
					this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, layer);
				}
			}
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, viewport.boundary);
		}

		if (this._version === ACadVersion.AC1015) {
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, null);
		}

		if (this.R2000Plus) {
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, null);
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, null);
		}

		if (this.R2007Plus) {
			this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, null);
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, null);
			this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, null);
			this._writer.handleReferenceTyped(DwgReferenceType.HardOwnership, null);
		}
	}

	private writeXLine(xline: XLine): void {
		this._writer.write3BitDouble(xline.firstPoint);
		this._writer.write3BitDouble(xline.direction);
	}

	private writeChildEntities(entities: Entity[], seqend: Seqend | null): void {
		if (entities.length === 0) return;

		const prevHolder = this._prev;
		const nextHolder = this._next;
		this._prev = null;
		this._next = null;

		let curr = entities[0];
		for (let i = 1; i < entities.length; i++) {
			this._next = entities[i];
			this.writeEntity(curr);
			this._prev = curr;
			curr = this._next;
		}

		this._next = null;
		this.writeEntity(curr);

		this._prev = prevHolder;
		this._next = nextHolder;

		if (seqend != null) {
			this.writeSeqend(seqend);
		}
	}

	// ==================== Object Writers ====================

	private addEntriesToWriter(dictionary: CadDictionary): void {
		for (const e of dictionary) {
			this._objects.push(e);
		}
	}

	private skipEntry(entry: NonGraphicalObject): { skip: boolean; notify: boolean } {
		if (entry instanceof XRecord && !this.WriteXRecords) return { skip: true, notify: false };
		if (entry instanceof UnknownNonGraphicalObject
		) {
			return { skip: true, notify: true };
		}
		return { skip: false, notify: false };
	}

	private write4x3Matrix(matrix: Matrix4): void {
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 4; j++) {
				this._writer.writeBitDouble(matrix.get(i, j));
			}
		}
	}

	private writeObjects(): void {
		while (this._objects.length > 0) {
			const obj = this._objects.shift()!;
			this.writeObject(obj);
		}
	}

	private writeObject(obj: NonGraphicalObject): void {
		const { skip, notify: shouldNotify } = this.skipEntry(obj);
		if (skip) {
			if (shouldNotify) {
				this.notify(`Object type not implemented ${obj.constructor.name}`, NotificationType.NotImplemented);
			}
			return;
		}

		this.writeCommonNonEntityData(obj);

		if (obj instanceof AcdbPlaceHolder) {
			this.writeAcdbPlaceHolder(obj);
		} else if (obj instanceof BookColor) {
			this.writeBookColor(obj);
		} else if (obj instanceof CadDictionaryWithDefault) {
			this.writeCadDictionaryWithDefault(obj);
		} else if (obj instanceof CadDictionary) {
			this.writeDictionary(obj);
		} else if (obj instanceof AecBinRecord) {
			this.writeAecBinRecord(obj);
		} else if (obj instanceof AecCleanupGroup) {
			this.writeAecCleanupGroup(obj);
		} else if (obj instanceof AecWallStyle) {
			this.writeAecWallStyle(obj);
		} else if (obj instanceof DictionaryVariable) {
			this.writeDictionaryVariable(obj);
		} else if (obj instanceof DimensionAssociation) {
			this.writeDimensionAssociation(obj);
		} else if (obj instanceof EvaluationGraph) {
			this.writeEvaluationGraph(obj);
		} else if (obj instanceof TableStyle) {
			this.writeTableStyle(obj);
		} else if (obj instanceof Material) {
			this.writeMaterial(obj);
		} else if (obj instanceof VisualStyle) {
			this.writeVisualStyle(obj);
		} else if (obj instanceof ProxyObject) {
			this.writeProxyObject(obj);
		} else if (obj instanceof BlockRepresentationData) {
			this.writeBlockRepresentationData(obj);
		} else if (obj instanceof BlockReferenceObjectContextData) {
			this.writeBlockReferenceObjectContextData(obj);
		} else if (obj instanceof MTextAttributeObjectContextData) {
			this.writeMTextAttributeObjectContextData(obj);
		} else if (obj instanceof GeoData) {
			this.writeGeoData(obj);
		} else if (obj instanceof Group) {
			this.writeGroup(obj);
		} else if (obj instanceof ImageDefinitionReactor) {
			this.writeImageDefinitionReactor(obj);
		} else if (obj instanceof ImageDefinition) {
			this.writeImageDefinition(obj);
		} else if (obj instanceof Layout) {
			this.writeLayout(obj);
		} else if (obj instanceof MLineStyle) {
			this.writeMLineStyle(obj);
		} else if (obj instanceof MultiLeaderStyle) {
			this.writeMultiLeaderStyle(obj);
		} else if (obj instanceof MultiLeaderObjectContextData) {
			this.writeObjectContextData(obj);
			this.writeAnnotScaleObjectContextData(obj);
			this.writeMultiLeaderAnnotContext(obj);
		} else if (obj instanceof PdfUnderlayDefinition) {
			this.writePdfDefinition(obj);
		} else if (obj instanceof PlotSettings) {
			this.writePlotSettings(obj);
		} else if (obj instanceof RasterVariables) {
			this.writeRasterVariables(obj);
		} else if (obj instanceof Scale) {
			this.writeScale(obj);
		} else if (obj instanceof SortEntitiesTable) {
			this.writeSortEntitiesTable(obj);
		} else if (obj instanceof SpatialFilter) {
			this.writeSpatialFilter(obj);
		} else if (obj instanceof Field) {
			this.writeField(obj);
		} else if (obj instanceof FieldList) {
			this.writeFieldList(obj);
		} else if (obj instanceof XRecord) {
			this.writeXRecord(obj);
		} else {
			throw new Error(`Object not implemented : ${obj.constructor.name}`);
		}

		this.registerObject(obj);
	}

	private writeAcdbPlaceHolder(_acdbPlaceHolder: AcdbPlaceHolder): void {
		// Empty in C# source
	}

	private writeAecBinRecord(binRecord: AecBinRecord): void {
		if (this.R2000Plus) {
			this._writer.writeBitLong(binRecord.version);
		}

		if (binRecord.binaryData.length > 0) {
			this._writer.writeBytes(binRecord.binaryData);
		}
	}

	private writeAecCleanupGroup(cleanupGroup: AecCleanupGroup): void {
		if (this.R2000Plus) {
			this._writer.writeBitLong(cleanupGroup.version);
		}

		this._writer.writeVariableText(cleanupGroup.description);

		if (cleanupGroup.rawData != null && cleanupGroup.rawData.length > 0) {
			this._writer.writeBytes(cleanupGroup.rawData);
		}
	}

	private writeAecWallStyle(wallStyle: AecWallStyle): void {
		if (this.R2000Plus) {
			this._writer.writeBitLong(wallStyle.version);
		}

		this._writer.writeVariableText(wallStyle.description);

		if (wallStyle.rawData != null && wallStyle.rawData.length > 0) {
			this._writer.writeBytes(wallStyle.rawData);
		}
	}

	private writeAnnotScaleObjectContextData(annotScaleObjectContextData: AnnotScaleObjectContextData): void {
		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, annotScaleObjectContextData.scale);
	}

	private writeObjectContextData(objectContextData: ObjectContextData): void {
		this._writer.writeBitShort(objectContextData.version);
		this._writer.writeBit(objectContextData.hasFileToExtensionDictionary);
		this._writer.writeBit(objectContextData.default);
	}

	private writeBookColor(color: BookColor): void {
		this._writer.writeBitShort(0);

		if (this.R2004Plus) {
			const arr = new Uint8Array([
				color.color.b,
				color.color.g,
				color.color.r,
				0b11000010
			]);
			const rgb = new DataView(arr.buffer).getUint32(0, true);
			this._writer.writeBitLong(rgb);

			let flags = 0;
			if (color.name) flags |= 1;
			if (color.bookName) flags |= 2;

			this._writer.writeByte(flags);
			if (color.colorName) this._writer.writeVariableText(color.colorName);
			if (color.bookName) this._writer.writeVariableText(color.bookName);
		}
	}

	private writeCadDictionaryWithDefault(dictionary: CadDictionaryWithDefault): void {
		this.writeDictionary(dictionary);
		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, dictionary.defaultEntry);
	}

	private writeDictionary(dictionary: CadDictionary): void {
		const entries: NonGraphicalObject[] = [];
		for (const item of dictionary) {
			if (this.skipEntry(item).skip) continue;
			entries.push(item);
		}

		this._writer.writeBitLong(entries.length);

		if (this._version === ACadVersion.AC1014) {
			this._writer.writeByte(0);
		}

		if (this.R2000Plus) {
			this._writer.writeBitShort(dictionary.clonningFlags);
			this._writer.writeByte(dictionary.hardOwnerFlag ? 1 : 0);
		}

		for (const item of entries) {
			if (this.skipEntry(item).skip) continue;
			this._writer.writeVariableText(item.name);
			this._writer.handleReferenceTyped(DwgReferenceType.SoftOwnership, item.handle);
		}

		this.addEntriesToWriter(dictionary);
	}

	private writeDictionaryVariable(dictionaryVariable: DictionaryVariable): void {
		this._writer.writeByte(0);
		this._writer.writeVariableText(dictionaryVariable.value);
	}

	private writeDimensionAssociation(association: DimensionAssociation): void {
		this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, association.dimension);
		this._writer.writeBitLong(association.associativityFlags);
		this._writer.writeBit(association.isTransSpace);
		this._writer.writeByte(association.rotatedDimensionType);

		if ((association.associativityFlags & AssociativityFlags.FirstPointReference) !== 0) {
			this.writeOsnapPointRef(association.firstPointRef);
		}
		if ((association.associativityFlags & AssociativityFlags.SecondPointReference) !== 0) {
			this.writeOsnapPointRef(association.secondPointRef);
		}
		if ((association.associativityFlags & AssociativityFlags.ThirdPointReference) !== 0) {
			this.writeOsnapPointRef(association.thirdPointRef);
		}
		if ((association.associativityFlags & AssociativityFlags.FourthPointReference) !== 0) {
			this.writeOsnapPointRef(association.fourthPointRef);
		}
	}

	private writeOsnapPointRef(osnap: OsnapPointRef): void {
		this._writer.writeVariableText(DimensionAssociation.OsnapPointRefClassName);
		this._writer.writeByte(osnap.objectOsnapType);
		this._writer.handleReferenceTyped(DwgReferenceType.Undefined, osnap.geometry);
	}

	private writeProxyObject(proxy: ProxyObject): void {
		this.writeCommonProxyData(proxy);
	}

	private writeBlockRepresentationData(representation: BlockRepresentationData): void {
		this._writer.writeBitShort(representation.value70);
		this._writer.handleReference(representation.block);
	}

	private writeBlockReferenceObjectContextData(contextData: BlockReferenceObjectContextData): void {
		this.writeObjectContextData(contextData);
		this.writeAnnotScaleObjectContextData(contextData);
		this._writer.writeBitDouble(contextData.rotation);
		this._writer.write3BitDouble(contextData.insertionPoint);
		this._writer.writeBitDouble(contextData.xScale);
		this._writer.writeBitDouble(contextData.yScale);
		this._writer.writeBitDouble(contextData.zScale);
	}

	private writeMTextAttributeObjectContextData(contextData: MTextAttributeObjectContextData): void {
		this.writeObjectContextData(contextData);
		this.writeAnnotScaleObjectContextData(contextData);
	}

	private writeEvaluationGraph(evaluationGraph: EvaluationGraph): void {
		this._writer.writeBitLong(evaluationGraph.value96);
		this._writer.writeBitLong(evaluationGraph.value97);
		this._writer.writeBitLong(evaluationGraph.nodes.length);
		for (const node of evaluationGraph.nodes) {
			this._writer.writeBitLong(node.index);
			this._writer.writeBitLong(node.flags);
			this._writer.writeBitLong(node.nextNodeIndex);
			this._writer.handleReference(node.expression ?? 0);
			this._writer.writeBitLong(node.data1);
			this._writer.writeBitLong(node.data2);
			this._writer.writeBitLong(node.data3);
			this._writer.writeBitLong(node.data4);
		}
		this._writer.writeBitLong(evaluationGraph.edges.length);
	}

	private writeVisualStyle(visualStyle: VisualStyle): void {
		this._writer.writeVariableText(visualStyle.name);
		this._writer.writeBitLong(visualStyle.type);
		this._writer.writeBitShort(0);
		this._writer.writeBit(visualStyle.internalFlag);
		this._writer.writeBitLong(0);
	}

	private writeTableStyle(tableStyle: TableStyle): void {
		if (this.R2007Plus) {
			const cellStyles = tableStyle.cellStyles.length > 0
				? tableStyle.cellStyles
				: [tableStyle.dataCellStyle, tableStyle.titleCellStyle, tableStyle.headerCellStyle];
			this._writer.writeByte(0);
			this._writer.writeVariableText(tableStyle.description);
			this._writer.writeBitLong(0);
			this._writer.writeBitLong(0);
			this._writer.handleReference(0);
			this.writeCellStyle(tableStyle.tableCellStyle);
			this._writer.writeBitLong(tableStyle.tableCellStyle.id);
			this._writer.writeBitLong(tableStyle.tableCellStyle.styleClass);
			this._writer.writeVariableText(tableStyle.tableCellStyle.name);
			this._writer.writeBitLong(cellStyles.length);
			for (const cellStyle of cellStyles) {
				this._writer.writeBitLong(0);
				this.writeCellStyle(cellStyle);
				this._writer.writeBitLong(cellStyle.id);
				this._writer.writeBitLong(cellStyle.styleClass);
				this._writer.writeVariableText(cellStyle.name);
			}
			return;
		}

		this._writer.writeVariableText(tableStyle.description);
		this._writer.writeBitShort(tableStyle.flowDirection);
		this._writer.writeBitShort(tableStyle.flags);
		this._writer.writeBitDouble(tableStyle.horizontalCellMargin);
		this._writer.writeBitDouble(tableStyle.verticalCellMargin);
		this._writer.writeBit(tableStyle.suppressTitle);
		this._writer.writeBit(tableStyle.suppressHeaderRow);
		this.writeRowCellStyle(tableStyle.dataCellStyle);
		this.writeRowCellStyle(tableStyle.titleCellStyle);
		this.writeRowCellStyle(tableStyle.headerCellStyle);
	}

	private writeRowCellStyle(style: CellStyle): void {
		this._writer.handleReference(style.textStyle);
		this._writer.writeBitDouble(style.textHeight);
		this._writer.writeBitShort(style.cellAlignment);
		this._writer.writeCmColor(style.textColor);
		this._writer.writeCmColor(style.backgroundColor);
		this._writer.writeBit(style.isFillColorOn);
		this.writeBorderStyle(style.topBorder);
		this.writeBorderStyle(style.horizontalInsideBorder);
		this.writeBorderStyle(style.bottomBorder);
		this.writeBorderStyle(style.leftBorder);
		this.writeBorderStyle(style.verticalInsideBorder);
		this.writeBorderStyle(style.rightBorder);
	}

	private writeBorderStyle(border: CellBorder): void {
		this._writer.writeBitShort(border.lineWeight);
		this._writer.writeBit(!border.isInvisible);
		this._writer.writeCmColor(border.color);
	}

	private writeCellStyle(style: CellStyle): void {
		this._writer.writeBitLong(style.cellStyleType);
		this._writer.writeBitShort(style.hasData ? 1 : 0);
		if (!style.hasData) {
			return;
		}

		this._writer.writeBitLong(style.propertyOverrideFlags);
		this._writer.writeBitLong(style.tableCellStylePropertyFlags);
		this._writer.writeCmColor(style.backgroundColor);
		this._writer.writeBitLong(style.contentLayoutFlags);
		this.writeCellContentFormat(style);
		this._writer.writeBitShort(style.marginOverrideFlags);
		if ((style.marginOverrideFlags & MarginFlags.Override) !== 0) {
			this._writer.writeBitDouble(style.verticalMargin);
			this._writer.writeBitDouble(style.horizontalMargin);
			this._writer.writeBitDouble(style.bottomMargin);
			this._writer.writeBitDouble(style.rightMargin);
			this._writer.writeBitDouble(style.marginHorizontalSpacing);
			this._writer.writeBitDouble(style.marginVerticalSpacing);
		}

		const borders = [
			style.topBorder,
			style.rightBorder,
			style.bottomBorder,
			style.leftBorder,
			style.verticalInsideBorder,
			style.horizontalInsideBorder,
		].filter((border) => border.edgeFlags !== CellEdgeFlags.Unknown);

		this._writer.writeBitLong(borders.length);
		for (const border of borders) {
			this._writer.writeBitLong(border.edgeFlags);
			this.writeBorder(border);
		}
	}

	private writeBorder(border: CellBorder): void {
		this._writer.writeBitLong(border.propertyOverrideFlags);
		this._writer.writeBitLong(border.type);
		this._writer.writeCmColor(border.color);
		this._writer.writeBitLong(border.lineWeight);
		this._writer.handleReference(0);
		this._writer.writeBitLong(border.isInvisible ? 1 : 0);
		this._writer.writeBitDouble(border.doubleLineSpacing);
	}

	private writeCellContentFormat(format: ContentFormat): void {
		this._writer.writeBitLong(format.propertyOverrideFlags);
		this._writer.writeBitLong(format.propertyFlags);
		this._writer.writeBitLong(format.valueDataType);
		this._writer.writeBitLong(format.valueUnitType);
		this._writer.writeVariableText(format.valueFormatString);
		this._writer.writeBitDouble(format.rotation);
		this._writer.writeBitDouble(format.scale);
		this._writer.writeBitLong(format.alignment);
		this._writer.writeCmColor(format.color);
		this._writer.handleReference(format.textStyle);
		this._writer.writeBitDouble(format.textHeight);
	}

	private writeMaterial(material: Material): void {
		this._writer.writeVariableText(material.name);
		this._writer.writeVariableText(material.description);

		this.writeMaterialColor(material.ambientColorMethod, material.ambientColorFactor, material.ambientColor);
		this.writeMaterialColor(material.diffuseColorMethod, material.diffuseColorFactor, material.diffuseColor);
		this._writer.writeBitDouble(material.diffuseMapBlendFactor);
		this._writer.writeByte(material.diffuseProjectionMethod);
		this._writer.writeByte(material.diffuseTilingMethod);
		this._writer.writeByte(material.diffuseAutoTransform);
		this.writeMatrix4Values(material.diffuseMatrix);
		this.writeMaterialMap(material.diffuseMapSource, material.diffuseMapFileName);

		this.writeMaterialColor(material.specularColorMethod, material.specularColorFactor, material.specularColor);
		this._writer.writeBitDouble(material.specularMapBlendFactor);
		this._writer.writeByte(material.specularProjectionMethod);
		this._writer.writeByte(material.specularTilingMethod);
		this._writer.writeByte(material.specularAutoTransform);
		this.writeMatrix4Values(material.specularMatrix);
		this.writeMaterialMap(material.specularMapSource, material.specularMapFileName);
		this._writer.writeBitDouble(material.specularGlossFactor);

		this._writer.writeBitDouble(material.reflectionMapBlendFactor);
		this._writer.writeByte(material.reflectionProjectionMethod);
		this._writer.writeByte(material.reflectionTilingMethod);
		this._writer.writeByte(material.reflectionAutoTransform);
		this.writeMatrix4Values(material.reflectionMatrix);
		this.writeMaterialMap(material.reflectionMapSource, material.reflectionMapFileName);
		this._writer.writeBitDouble(material.opacity);

		this._writer.writeBitDouble(material.opacityMapBlendFactor);
		this._writer.writeByte(material.opacityProjectionMethod);
		this._writer.writeByte(material.opacityTilingMethod);
		this._writer.writeByte(material.opacityAutoTransform);
		this.writeMatrix4Values(material.opacityMatrix);
		this.writeMaterialMap(material.opacityMapSource, material.opacityMapFileName);

		this._writer.writeBitDouble(material.bumpMapBlendFactor);
		this._writer.writeByte(material.bumpProjectionMethod);
		this._writer.writeByte(material.bumpTilingMethod);
		this._writer.writeByte(material.bumpAutoTransform);
		this.writeMatrix4Values(material.bumpMatrix);
		this.writeMaterialMap(material.bumpMapSource, material.bumpMapFileName);
		this._writer.writeBitDouble(material.refractionIndex);

		this._writer.writeBitDouble(material.refractionMapBlendFactor);
		this._writer.writeByte(material.refractionProjectionMethod);
		this._writer.writeByte(material.refractionTilingMethod);
		this._writer.writeByte(material.refractionAutoTransform);
		this.writeMatrix4Values(material.refractionMatrix);
		this.writeMaterialMap(material.refractionMapSource, material.refractionMapFileName);
	}

	private writeMaterialColor(method: ColorMethod, factor: number, color: Color): void {
		this._writer.writeByte(method);
		this._writer.writeBitDouble(factor);
		if (method === ColorMethod.Override) {
			this._writer.writeBitLong((color.b | (color.g << 8) | (color.r << 16)) >>> 0);
		}
	}

	private writeMaterialMap(source: MapSource, fileName: string): void {
		let writtenSource = source;
		if (source === MapSource.Procedural) {
			this.notify('Procedural material maps are downgraded to current-scene maps when writing DWG.', NotificationType.Warning);
			writtenSource = MapSource.UseCurrentScene;
		}
		this._writer.writeByte(writtenSource);
		if (writtenSource === MapSource.UseImageFile) {
			this._writer.writeVariableText(fileName);
		}
	}

	private writeMatrix4Values(matrix: number[]): void {
		for (let i = 0; i < 16; i++) {
			const isIdentityCell = i % 5 === 0;
			this._writer.writeBitDouble(matrix[i] ?? (isIdentityCell ? 1 : 0));
		}
	}

	private writeField(field: Field): void {
		this._writer.writeVariableText(field.evaluatorId);
		this._writer.writeVariableText(field.fieldCode);

		this._writer.writeBitLong(field.children.length);
		for (const f of field.children) {
			this._writer.handleReferenceTyped(DwgReferenceType.HardOwnership, field);
		}

		this._writer.writeBitLong(field.cadObjects.length);
		for (const cobj of field.cadObjects) {
			this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, cobj);
		}

		if (this._version < ACadVersion.AC1021) {
			this._writer.writeVariableText(field.formatString);
		}

		this._writer.writeBitLong(field.evaluationOptionFlags);
		this._writer.writeBitLong(field.filingOptionFlags);
		this._writer.writeBitLong(field.fieldStateFlags);
		this._writer.writeBitLong(field.evaluationStatusFlags);
		this._writer.writeBitLong(field.evaluationErrorCode);
		this._writer.writeVariableText(field.evaluationErrorMessage);

		this.writeCadValue(field.value);

		this._writer.writeVariableText(field.formatString);
		this._writer.writeBitLong(field.formatString.length);
		this._writer.writeBitLong(field.values.size);
		for (const [key, value] of field.values) {
			this._writer.writeVariableText(key);
			this.writeCadValue(value);
		}

		for (const c of field.children) {
			this._objects.push(c);
		}
	}

	private writeFieldList(fieldList: FieldList): void {
		this._writer.writeBitLong(fieldList.fields.length);
		this._writer.writeBit(true);
		for (const field of fieldList.fields) {
			this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, field);
		}
	}

	private writeCadValue(value: CadValue): void {
		if (this.R2007Plus) {
			this._writer.writeBitLong(value.flags);
		}

		this._writer.writeBitLong(value.valueType);
		if (!this.R2007Plus || !value.isEmpty) {
			switch (value.valueType) {
				case CadValueType.Unknown:
					this._writer.writeBitLong(0);
					break;
				case CadValueType.Long:
					this._writer.writeBitLong(value.value as number);
					break;
				case CadValueType.Double:
					this._writer.writeBitDouble(value.value as number);
					break;
				case CadValueType.General:
				case CadValueType.String:
					this.writeStringCadValue(value.value as string);
					break;
				case CadValueType.Date:
					this.writeDateCadValue(value.value as Date | null);
					break;
				case CadValueType.Point2D:
					this.writeCadValueXY(value.value as XY | null);
					break;
				case CadValueType.Point3D:
					this.writeCadValueXYZ(value.value as XYZ | null);
					break;
				case CadValueType.Handle:
					this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, value.value as IHandledCadObject);
					break;
				case CadValueType.Buffer:
				case CadValueType.ResultBuffer:
					this._writer.writeBitLong(typeof value.value === 'number' ? value.value : 0);
					break;
				default:
					this.notify(`DWG CadValue type ${value.valueType} is unsupported during writing; emitting an empty placeholder value.`, NotificationType.Warning);
					this._writer.writeBitLong(0);
					break;
			}
		}

		if (this.R2007Plus) {
			this._writer.writeBitLong(value.units);
			this._writer.writeVariableText(value.format);
			this._writer.writeVariableText(value.formattedValue);
		}
	}

	private writeCadValueXY(xy: XY | null): void {
		if (xy != null) {
			this._writer.writeBitLong(16);
			this._writer.write2RawDouble(xy);
		} else {
			this._writer.writeBitLong(0);
		}
	}

	private writeCadValueXYZ(xyz: XYZ | null): void {
		if (xyz != null) {
			this._writer.writeBitLong(24);
			this._writer.writeRawDouble(xyz.X);
			this._writer.writeRawDouble(xyz.Y);
			this._writer.writeRawDouble(xyz.Z);
		} else {
			this._writer.writeBitLong(0);
		}
	}

	private writeDateCadValue(date: Date | null): void {
		if (date != null) {
			let array: Uint8Array;
			if (this.R2007Plus) {
				array = new Uint8Array(16);
				const dv = new DataView(array.buffer);
				dv.setInt16(0, date.getFullYear(), true);
				dv.setInt16(2, date.getMonth() + 1, true);
				dv.setInt16(4, date.getDay(), true);
				dv.setInt16(6, date.getDate(), true);
				dv.setInt16(8, date.getHours(), true);
				dv.setInt16(10, date.getMinutes(), true);
				dv.setInt16(12, date.getSeconds(), true);
				dv.setInt16(14, date.getMilliseconds(), true);
			} else {
				const seconds = Math.floor((date.getTime() - new Date(1970, 0, 1).getTime()) / 1000);
				const high = (seconds >>> 32) | 0;
				const low = seconds | 0;
				array = new Uint8Array(8);
				const dv = new DataView(array.buffer);
				dv.setInt32(0, high, false);
				dv.setInt32(4, low, false);
			}

			this._writer.writeBitLong(array.length);
			this._writer.writeBytes(array);
		} else {
			this._writer.writeBitLong(0);
		}
	}

	private writeStringCadValue(value: string): void {
		if (!value) {
			this._writer.writeBitLong(0);
		}

		let bytes: Uint8Array;
		if (this.R2007Plus) {
			bytes = this.encodeUtf16LE(value);
			this._writer.writeBitLong(bytes.length + 2);
			this._writer.writeBytes(bytes);
			this._writer.writeByte(0);
			this._writer.writeByte(0);
		} else {
			bytes = this.encodeText(value);
			this._writer.writeBitLong(bytes.length + 1);
			this._writer.writeBytes(bytes);
			this._writer.writeByte(0);
		}
	}

	private writeGeoData(geodata: GeoData): void {
		this._writer.writeBitLong(geodata.version);
		this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, geodata.hostBlock);
		this._writer.writeBitShort(geodata.coordinatesType);

		switch (geodata.version) {
			case GeoDataVersion.R2009:
				this._writer.write3BitDouble(geodata.referencePoint);
				this._writer.writeBitLong(geodata.horizontalUnits);
				this._writer.write3BitDouble(geodata.designPoint);
				this._writer.write3BitDouble(XYZ.Zero);
				this._writer.write3BitDouble(geodata.upDirection);
				this._writer.writeBitDouble(Math.PI / 2.0 - geodata.northDirection.getAngle());
				this._writer.write3BitDouble(new XYZ(1, 1, 1));
				this._writer.writeVariableText(geodata.coordinateSystemDefinition);
				this._writer.writeVariableText(geodata.geoRssTag);
				this._writer.writeBitDouble(geodata.horizontalUnitScale);
				geodata.verticalUnitScale = geodata.horizontalUnitScale;
				this._writer.writeVariableText('');
				this._writer.writeVariableText('');
				break;
			case GeoDataVersion.R2010:
			case GeoDataVersion.R2013:
				this._writer.write3BitDouble(geodata.designPoint);
				this._writer.write3BitDouble(geodata.referencePoint);
				this._writer.writeBitDouble(geodata.horizontalUnitScale);
				this._writer.writeBitLong(geodata.horizontalUnits);
				this._writer.writeBitDouble(geodata.verticalUnitScale);
				this._writer.writeBitLong(geodata.horizontalUnits);
				this._writer.write3BitDouble(geodata.upDirection);
				this._writer.write2RawDouble(geodata.northDirection);
				this._writer.writeBitLong(geodata.scaleEstimationMethod);
				this._writer.writeBitDouble(geodata.userSpecifiedScaleFactor);
				this._writer.writeBit(geodata.enableSeaLevelCorrection);
				this._writer.writeBitDouble(geodata.seaLevelElevation);
				this._writer.writeBitDouble(geodata.coordinateProjectionRadius);
				this._writer.writeVariableText(geodata.coordinateSystemDefinition);
				this._writer.writeVariableText(geodata.geoRssTag);
				break;
		}

		this._writer.writeVariableText(geodata.observationFromTag);
		this._writer.writeVariableText(geodata.observationToTag);
		this._writer.writeVariableText(geodata.observationCoverageTag);

		this._writer.writeBitLong(geodata.points.length);
		for (const pt of geodata.points) {
			this._writer.write2RawDouble(pt.source);
			this._writer.write2RawDouble(pt.destination);
		}

		this._writer.writeBitLong(geodata.faces.length);
		for (const face of geodata.faces) {
			this._writer.writeBitLong(face.index1);
			this._writer.writeBitLong(face.index2);
			this._writer.writeBitLong(face.index3);
		}
	}

	private writeGroup(group: Group): void {
		this._writer.writeVariableText(group.description);
		this._writer.writeBitShort(group.isUnnamed ? 1 : 0);
		this._writer.writeBitShort(group.selectable ? 1 : 0);

		this._writer.writeBitLong(group.entities.length);
		for (const e of group.entities) {
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, e);
		}
	}

	private writeImageDefinition(definition: ImageDefinition): void {
		this._writer.writeBitLong(definition.classVersion);
		this._writer.write2RawDouble(definition.size);
		this._writer.writeVariableText(definition.fileName);
		this._writer.writeBit(definition.isLoaded);
		this._writer.writeByte(definition.units);
		this._writer.write2RawDouble(definition.defaultSize);
	}

	private writeImageDefinitionReactor(definitionReactor: ImageDefinitionReactor): void {
		this._writer.writeBitLong(definitionReactor.classVersion);
	}

	private writeLayout(layout: Layout): void {
		this.writePlotSettings(layout);
		this._writer.writeVariableText(layout.name);
		this._writer.writeBitLong(layout.tabOrder);
		this._writer.writeBitShort(layout.layoutFlags);
		this._writer.write3BitDouble(layout.origin);
		this._writer.write2RawDouble(layout.minLimits);
		this._writer.write2RawDouble(layout.minLimits);
		this._writer.write3BitDouble(layout.insertionBasePoint);
		this._writer.write3BitDouble(layout.xAxis);
		this._writer.write3BitDouble(layout.yAxis);
		this._writer.writeBitDouble(layout.elevation);
		this._writer.writeBitShort(layout.ucsOrthographicType);
		this._writer.write3BitDouble(layout.minExtents);
		this._writer.write3BitDouble(layout.maxExtents);

		if (this.R2004Plus) {
			this._writer.writeBitLong(layout.viewports.length);
		}

		this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, layout.associatedBlock);
		this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, layout.lastActiveViewport);

		if (layout.ucsOrthographicType === OrthographicType.None) {
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, null);
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, layout.ucs);
		} else {
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, layout.baseUCS);
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, null);
		}

		if (this.R2004Plus) {
			for (const viewport of layout.viewports) {
				this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, viewport);
			}
		}
	}

	private writeMLineStyle(mlineStyle: MLineStyle): void {
		this._writer.writeVariableText(mlineStyle.name);
		this._writer.writeVariableText(mlineStyle.description);

		let flags = 0;
		if ((mlineStyle.flags & MLineStyleFlags.DisplayJoints) !== 0) flags |= 1;
		if ((mlineStyle.flags & MLineStyleFlags.FillOn) !== 0) flags |= 2;
		if ((mlineStyle.flags & MLineStyleFlags.StartSquareCap) !== 0) flags |= 16;
		if ((mlineStyle.flags & MLineStyleFlags.StartRoundCap) !== 0) flags |= 0x20;
		if ((mlineStyle.flags & MLineStyleFlags.StartInnerArcsCap) !== 0) flags |= 0x40;
		if ((mlineStyle.flags & MLineStyleFlags.EndSquareCap) !== 0) flags |= 0x100;
		if ((mlineStyle.flags & MLineStyleFlags.EndRoundCap) !== 0) flags |= 0x200;
		if ((mlineStyle.flags & MLineStyleFlags.EndInnerArcsCap) !== 0) flags |= 0x400;

		this._writer.writeBitShort(flags);
		this._writer.writeCmColor(mlineStyle.fillColor);
		this._writer.writeBitDouble(mlineStyle.startAngle);
		this._writer.writeBitDouble(mlineStyle.endAngle);

		this._writer.writeByte(mlineStyle.elements.length);
		for (const element of mlineStyle.elements) {
			this._writer.writeBitDouble(element.offset);
			this._writer.writeCmColor(element.color);
			if (this.R2018Plus) {
				this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, element.lineType);
			} else {
				this._writer.writeBitShort(0);
			}
		}
	}

	private writeMultiLeaderAnnotContext(multiLeaderAnnotContext: MultiLeaderObjectContextData): void {
		this.writeMultiLeaderAnnotContextSubObject(false, multiLeaderAnnotContext);
	}

	private writeMultiLeaderStyle(mLeaderStyle: MultiLeaderStyle): void {
		if (this.R2010Plus) {
			this._writer.writeBitShort(2);
		}

		this._writer.writeBitShort(mLeaderStyle.contentType);
		this._writer.writeBitShort(mLeaderStyle.multiLeaderDrawOrder);
		this._writer.writeBitShort(mLeaderStyle.leaderDrawOrder);
		this._writer.writeBitLong(mLeaderStyle.maxLeaderSegmentsPoints);
		this._writer.writeBitDouble(mLeaderStyle.firstSegmentAngleConstraint);
		this._writer.writeBitDouble(mLeaderStyle.secondSegmentAngleConstraint);
		this._writer.writeBitShort(mLeaderStyle.pathType);
		this._writer.writeCmColor(mLeaderStyle.lineColor);
		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, mLeaderStyle.leaderLineType);
		this._writer.writeBitLong(mLeaderStyle.leaderLineWeight);
		this._writer.writeBit(mLeaderStyle.enableLanding);
		this._writer.writeBitDouble(mLeaderStyle.landingGap);
		this._writer.writeBit(mLeaderStyle.enableDogleg);
		this._writer.writeBitDouble(mLeaderStyle.landingDistance);
		this._writer.writeVariableText(mLeaderStyle.description);
		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, mLeaderStyle.arrowhead);
		this._writer.writeBitDouble(mLeaderStyle.arrowheadSize);
		this._writer.writeVariableText(mLeaderStyle.defaultTextContents);
		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, mLeaderStyle.textStyle);
		this._writer.writeBitShort(mLeaderStyle.textLeftAttachment);
		this._writer.writeBitShort(mLeaderStyle.textRightAttachment);
		this._writer.writeBitShort(mLeaderStyle.textAngle);
		this._writer.writeBitShort(mLeaderStyle.textAlignment);
		this._writer.writeCmColor(mLeaderStyle.textColor);
		this._writer.writeBitDouble(mLeaderStyle.textHeight);
		this._writer.writeBit(mLeaderStyle.textFrame);
		this._writer.writeBit(mLeaderStyle.textAlignAlwaysLeft);
		this._writer.writeBitDouble(mLeaderStyle.alignSpace);
		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, mLeaderStyle.blockContent);
		this._writer.writeCmColor(mLeaderStyle.blockContentColor);
		this._writer.write3BitDouble(mLeaderStyle.blockContentScale);
		this._writer.writeBit(mLeaderStyle.enableBlockContentScale);
		this._writer.writeBitDouble(mLeaderStyle.blockContentRotation);
		this._writer.writeBit(mLeaderStyle.enableBlockContentRotation);
		this._writer.writeBitShort(mLeaderStyle.blockContentConnection);
		this._writer.writeBitDouble(mLeaderStyle.scaleFactor);
		this._writer.writeBit(mLeaderStyle.overwritePropertyValue);
		this._writer.writeBit(mLeaderStyle.isAnnotative);
		this._writer.writeBitDouble(mLeaderStyle.breakGapSize);

		if (this.R2010Plus) {
			this._writer.writeBitShort(mLeaderStyle.textAttachmentDirection);
			this._writer.writeBitShort(mLeaderStyle.textBottomAttachment);
			this._writer.writeBitShort(mLeaderStyle.textTopAttachment);
		}

		if (this.R2013Plus) {
			this._writer.writeBit(mLeaderStyle.unknownFlag298);
		}
	}

	private writePdfDefinition(definition: PdfUnderlayDefinition): void {
		this._writer.writeVariableText(definition.file);
		this._writer.writeVariableText(definition.page);
	}

	private writePlotSettings(plot: PlotSettings): void {
		this._writer.writeVariableText(plot.pageName);
		this._writer.writeVariableText(plot.systemPrinterName);
		this._writer.writeBitShort(plot.flags);

		this._writer.writeBitDouble(plot.unprintableMargin.left);
		this._writer.writeBitDouble(plot.unprintableMargin.bottom);
		this._writer.writeBitDouble(plot.unprintableMargin.right);
		this._writer.writeBitDouble(plot.unprintableMargin.top);

		this._writer.writeBitDouble(plot.paperWidth);
		this._writer.writeBitDouble(plot.paperHeight);
		this._writer.writeVariableText(plot.paperSize);

		this._writer.writeBitDouble(plot.plotOriginX);
		this._writer.writeBitDouble(plot.plotOriginY);
		this._writer.writeBitShort(plot.paperUnits);
		this._writer.writeBitShort(plot.paperRotation);
		this._writer.writeBitShort(plot.plotType);

		this._writer.writeBitDouble(plot.windowLowerLeftX);
		this._writer.writeBitDouble(plot.windowLowerLeftY);
		this._writer.writeBitDouble(plot.windowUpperLeftX);
		this._writer.writeBitDouble(plot.windowUpperLeftY);

		if (this._version >= ACadVersion.AC1012 && this._version <= ACadVersion.AC1015) {
			this._writer.writeVariableText(plot.plotViewName);
		}

		this._writer.writeBitDouble(plot.numeratorScale);
		this._writer.writeBitDouble(plot.denominatorScale);
		this._writer.writeVariableText(plot.styleSheet);
		this._writer.writeBitShort(plot.scaledFit);
		this._writer.writeBitDouble(plot.standardScale);
		this._writer.write2BitDouble(plot.paperImageOrigin);

		if (this.R2004Plus) {
			this._writer.writeBitShort(plot.shadePlotMode);
			this._writer.writeBitShort(plot.shadePlotResolutionMode);
			this._writer.writeBitShort(plot.shadePlotDPI);
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, null);
		}

		if (this.R2007Plus) {
			this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, null);
		}
	}

	private writeRasterVariables(vars: RasterVariables): void {
		this._writer.writeBitLong(vars.classVersion);
		this._writer.writeBitShort(vars.isDisplayFrameShown ? 1 : 0);
		this._writer.writeBitShort(vars.displayQuality);
		this._writer.writeBitShort(vars.units);
	}

	private writeScale(scale: Scale): void {
		this._writer.writeBitShort(0);
		this._writer.writeVariableText(scale.name);
		this._writer.writeBitDouble(scale.paperUnits);
		this._writer.writeBitDouble(scale.drawingUnits);
		this._writer.writeBit(scale.isUnitScale);
	}

	private writeSortEntitiesTable(sortEntitiesTable: SortEntitiesTable): void {
		this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, sortEntitiesTable.blockOwner);

		const sorters = Array.from(sortEntitiesTable);
		this._writer.writeBitLong(sorters.length);
		for (const item of sorters) {
			this._writer.main.handleReference(item.sortHandle);
			this._writer.handleReferenceTyped(DwgReferenceType.SoftPointer, item.entity);
		}
	}

	private writeSpatialFilter(filter: SpatialFilter): void {
		this._writer.writeBitShort(filter.boundaryPoints.length);
		for (const pt of filter.boundaryPoints) {
			this._writer.write2RawDouble(pt);
		}

		this._writer.write3BitDouble(filter.normal);
		this._writer.write3BitDouble(filter.origin);
		this._writer.writeBitShort(filter.displayBoundary ? 1 : 0);
		this._writer.writeBitShort(filter.clipFrontPlane ? 1 : 0);
		if (filter.clipFrontPlane) {
			this._writer.writeBitDouble(filter.frontDistance);
		}

		this._writer.writeBitShort(filter.clipBackPlane ? 1 : 0);
		if (filter.clipBackPlane) {
			this._writer.writeBitDouble(filter.backDistance);
		}

		this.write4x3Matrix(filter.inverseInsertTransform);
		this.write4x3Matrix(filter.insertTransform);
	}

	private writeXRecord(xrecord: XRecord): void {
		const chunks: number[] = [];
		const getHandleValue = (value: unknown): number => {
			if (typeof value === 'number') {
				return value;
			}
			if (typeof value === 'bigint') {
				return Number(value);
			}
			if (value instanceof CadObject) {
				return value.handle;
			}
			return 0;
		};
		const pushInt16LE = (v: number) => {
			chunks.push(v & 0xFF, (v >> 8) & 0xFF);
		};
		const pushInt32LE = (v: number) => {
			chunks.push(v & 0xFF, (v >> 8) & 0xFF, (v >> 16) & 0xFF, (v >> 24) & 0xFF);
		};
		const pushInt64LE = (v: number | bigint) => {
			let value = typeof v === 'bigint' ? v : BigInt(Math.trunc(v));
			value = BigInt.asUintN(64, value);
			for (let i = 0; i < 8; i++) {
				chunks.push(Number((value >> BigInt(i * 8)) & 0xFFn));
			}
		};
		const pushFloat64LE = (v: number) => {
			const buf = new ArrayBuffer(8);
			new DataView(buf).setFloat64(0, v, true);
			const bytes = new Uint8Array(buf);
			for (let i = 0; i < 8; i++) chunks.push(bytes[i]);
		};

		for (const entry of xrecord.entries) {
			if (entry.value == null) continue;
			const groupValueType = GroupCodeValue.transformValue(entry.code);
			if ((groupValueType === GroupCodeValueType.ObjectId
				|| groupValueType === GroupCodeValueType.ExtendedDataHandle)
				&& getHandleValue(entry.value) === 0) {
				continue;
			}

			pushInt16LE(entry.code);

			switch (groupValueType) {
				case GroupCodeValueType.Byte:
				case GroupCodeValueType.Bool:
					chunks.push(Number(entry.value) & 0xFF);
					break;
				case GroupCodeValueType.Int16:
				case GroupCodeValueType.ExtendedDataInt16:
					pushInt16LE(Number(entry.value));
					break;
				case GroupCodeValueType.Int32:
				case GroupCodeValueType.ExtendedDataInt32:
					pushInt32LE(Number(entry.value));
					break;
				case GroupCodeValueType.Int64:
					pushInt64LE(Number(entry.value));
					break;
				case GroupCodeValueType.Double:
				case GroupCodeValueType.ExtendedDataDouble:
					pushFloat64LE(Number(entry.value));
					break;
				case GroupCodeValueType.Point3D: {
					const xyz = entry.value as XYZ;
					pushFloat64LE(xyz.X);
					pushFloat64LE(xyz.Y);
					pushFloat64LE(xyz.Z);
					break;
				}
				case GroupCodeValueType.Chunk:
				case GroupCodeValueType.ExtendedDataChunk: {
					const arr = entry.value as Uint8Array;
					chunks.push(arr.length & 0xFF);
					for (let i = 0; i < arr.length; i++) chunks.push(arr[i]);
					break;
				}
				case GroupCodeValueType.Handle: {
					const handle = getHandleValue(entry.value);
					const text = handle === 0 ? '' : handle.toString(16).toUpperCase();
					this.writeStringInChunks(chunks, text);
					break;
				}
				case GroupCodeValueType.String:
				case GroupCodeValueType.ExtendedDataString:
					this.writeStringInChunks(chunks, entry.value as string);
					break;
				case GroupCodeValueType.ObjectId:
				case GroupCodeValueType.ExtendedDataHandle: {
					const handle = getHandleValue(entry.value);
					pushInt64LE(handle);
					break;
				}
				default:
					throw new Error('Not supported');
			}
		}

		this._writer.writeBitLong(chunks.length);
		this._writer.writeBytesOffset(new Uint8Array(chunks), 0, chunks.length);

		if (this.R2000Plus) {
			this._writer.writeBitShort(xrecord.cloningFlags);
		}
	}

	// ==================== Utility Methods ====================

	private writeStringInChunks(chunks: number[], text: string): void {
		if (this.R2007Plus) {
			if (!text) {
				chunks.push(0, 0);
				return;
			}
			const len = text.length;
			chunks.push(len & 0xFF, (len >> 8) & 0xFF);
			const bytes = this.encodeUtf16LE(text);
			for (let i = 0; i < bytes.length; i++) chunks.push(bytes[i]);
		} else if (!text) {
			chunks.push(0, 0);
			const codeIndex = CadUtils.getCodeIndex(CadUtils.getCodePage(this._writer.encoding));
			chunks.push(codeIndex);
		} else {
			const bytes = this.encodeText(text);
			const len = bytes.length;
			chunks.push(len & 0xFF, (len >> 8) & 0xFF);
			const codeIndex = CadUtils.getCodeIndex(CadUtils.getCodePage(this._writer.encoding));
			chunks.push(codeIndex);
			for (let i = 0; i < bytes.length; i++) chunks.push(bytes[i]);
		}
	}

	private encodeUtf16LE(text: string): Uint8Array {
		return encodeUtf16Le(text);
	}

	private encodeText(text: string): Uint8Array {
		return encodeCadString(text, this._writer.encoding);
	}
}
