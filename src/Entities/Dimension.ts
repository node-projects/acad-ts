import { Entity } from './Entity.js';
import { CadObject } from '../CadObject.js';
import { CadDocument } from '../CadDocument.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { AppId } from '../Tables/AppId.js';
import { DimensionStyle } from '../Tables/DimensionStyle.js';
import { BlockRecord } from '../Tables/BlockRecord.js';
import { Layer } from '../Tables/Layer.js';
import { DimensionType } from './DimensionType.js';
import { AttachmentPointType } from './AttachmentPointType.js';
import { LineSpacingStyleType } from './LineSpacingStyleType.js';
import { CollectionChangedEventArgs } from '../CollectionChangedEventArgs.js';
import { DxfClassMap } from '../DxfClassMap.js';
import { Line } from './Line.js';
import { MText } from './MText.js';
import { Point } from './Point.js';
import { ExtendedData } from '../XData/ExtendedData.js';
import { ExtendedDataInteger16 } from '../XData/ExtendedDataInteger16.js';
import { ExtendedDataRecord } from '../XData/ExtendedDataRecord.js';
import { XYZ } from '../Math/XYZ.js';

export abstract class Dimension extends Entity {
	attachmentPoint: AttachmentPointType = AttachmentPointType.TopLeft;

	get block(): BlockRecord | null {
		return this._block;
	}
	set block(value: BlockRecord | null) {
		if (this.document != null) {
			this._block = CadObject.updateCollection(value!, this.document.blockRecords);
		} else {
			this._block = value;
		}
	}

	definitionPoint: XYZ = new XYZ(0, 0, 0);

	get flags(): DimensionType {
		return this._flags;
	}
	/** @internal */
	set flags(value: DimensionType) {
		this._flags = value;
	}

	flipArrow1: boolean = false;

	flipArrow2: boolean = false;

	get hasStyleOverride(): boolean {
		for (const [appName, data] of this.extendedData.getExtendedDataByName()) {
			if (data.records.length > 0 && (appName === AppId.DefaultName.toUpperCase() || appName.startsWith(`${AppId.DefaultName.toUpperCase()}_DSTYLE`))) {
				return true;
			}
		}
		return false;
	}

	horizontalDirection: number = 0;

	insertionPoint: XYZ = new XYZ(0, 0, 0);

	get isAngular(): boolean {
		return (this._flags & DimensionType.Angular3Point) !== 0 || (this._flags & DimensionType.Angular) !== 0;
	}

	get isTextUserDefinedLocation(): boolean {
		return (this._flags & DimensionType.TextUserDefinedLocation) !== 0;
	}
	set isTextUserDefinedLocation(value: boolean) {
		if (value) {
			this._flags = this._flags | DimensionType.TextUserDefinedLocation;
		} else {
			this._flags = this._flags & ~DimensionType.TextUserDefinedLocation;
		}
	}

	lineSpacingFactor: number = 0;

	lineSpacingStyle: LineSpacingStyleType = LineSpacingStyleType.AtLeast;

	abstract get measurement(): number;

	normal: XYZ = new XYZ(0, 0, 1);

	get style(): DimensionStyle {
		return this._style;
	}
	set style(value: DimensionStyle) {
		if (value == null) {
			throw new Error('value cannot be null');
		}
		if (this.document != null) {
			this._style = CadObject.updateCollection(value, this.document.dimensionStyles);
		} else {
			this._style = value;
		}
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.Dimension;
	}

	text: string = '';

	textMiddlePoint: XYZ = new XYZ(0, 0, 0);

	textRotation: number = 0;

	version: number = 0;

	protected _block: BlockRecord | null = null;
	protected _flags: DimensionType;
	private _style: DimensionStyle = DimensionStyle.Default;

	protected constructor(type: DimensionType) {
		super();
		this._flags = type;
		this._flags |= DimensionType.BlockReference;
	}

	override applyTransform(transform: unknown): void {
		this.definitionPoint = this.applyTransformToPoint(transform, this.definitionPoint);
		this.insertionPoint = this.applyTransformToPoint(transform, this.insertionPoint);
		this.textMiddlePoint = this.applyTransformToPoint(transform, this.textMiddlePoint);
		this.normal = this.applyTransformToVector(transform, this.normal).normalize();
		const rotation = (transform as { eulerRotation?: { z?: unknown } } | null)?.eulerRotation?.z;
		if (typeof rotation === 'number') {
			this.textRotation += rotation;
		}
	}

	override clone(): CadObject {
		const clone = super.clone() as Dimension;
		clone._style = this._style.clone() as DimensionStyle;
		clone._block = this._block?.clone() as BlockRecord ?? null;
		return clone;
	}

	getActiveDimensionStyle(): DimensionStyle {
		if (!this.hasStyleOverride) {
			return this.style;
		}

		const style = this.style.clone() as DimensionStyle;
		const map = this.getStyleOverrideMap();
		if (map == null) {
			return style;
		}

		const classMap = DxfClassMap.Create(DimensionStyle);
		for (const [code, value] of map) {
			const property = classMap.dxfProperties.get(code);
			if (property != null) {
				property.setValue(code, style, value);
			}
		}

		return style;
	}

	getMeasurementText(style?: DimensionStyle): string {
		const activeStyle = style ?? this.getActiveDimensionStyle();
		const measurement = this.formatMeasurement(this.measurement, activeStyle);

		if (this.text.length > 0) {
			return this.text.includes('<>') ? this.text.replace(/<>/g, measurement) : this.text;
		}

		return `${activeStyle.prefix}${measurement}${activeStyle.suffix}`;
	}

	getStyleOverrideMap(): Map<number, unknown> | null {
		const map = new Map<number, unknown>();
		const classMap = DxfClassMap.Create(DimensionStyle);
		for (const [name, extendedData] of this.extendedData.getExtendedDataByName()) {
			if (name !== AppId.DefaultName.toUpperCase() && !name.startsWith(`${AppId.DefaultName.toUpperCase()}_${DimensionStyle.StyleOverrideEntryName}`)) {
				continue;
			}

			for (let index = 0; index < extendedData.records.length - 1; index++) {
				const codeRecord = extendedData.records[index];
				const valueRecord = extendedData.records[index + 1];
				if (!(codeRecord instanceof ExtendedDataInteger16)) {
					continue;
				}

				if (classMap.dxfProperties.has(codeRecord.value)) {
					map.set(codeRecord.value, valueRecord.rawValue);
				}
				index += 1;
			}
		}

		return map.size > 0 ? map : null;
	}

	setDimensionOverride(styleOverride: DimensionStyle): void {
		const current = this.style;
		const classMap = DxfClassMap.Create(DimensionStyle);
		const overrides = new Map<number, unknown>();

		for (const [code, property] of classMap.dxfProperties) {
			const baseValue = property.getRawValue(current);
			const overrideValue = property.getRawValue(styleOverride);
			if (overrideValue !== undefined && overrideValue !== null && overrideValue !== baseValue) {
				overrides.set(code, overrideValue);
			}
		}

		this.setStyleOverrideMap(overrides);
	}

	setStyleOverrideMap(map: Map<number, unknown> | null): void {
		const appName = `${AppId.DefaultName}_${DimensionStyle.StyleOverrideEntryName}`;
		const nextRecords: ExtendedDataRecord[] = [];
		if (map != null) {
			const classMap = DxfClassMap.Create(DimensionStyle);
			for (const [code, value] of map) {
				const property = classMap.dxfProperties.get(code);
				if (property == null) {
					continue;
				}

				property.storedValue = value;
				nextRecords.push(...property.toXDataRecords());
			}
		}

		const existing = this.extendedData.tryGetByName(appName);
		if (map == null || map.size === 0) {
			if (existing.found && existing.value != null) {
				for (const [app] of this.extendedData) {
					if (app.name.toUpperCase() === appName.toUpperCase()) {
						this.extendedData.set(app, new ExtendedData());
					}
				}
			}
			return;
		}

		const records = new ExtendedData(nextRecords);
		if (existing.found) {
			for (const [app] of this.extendedData) {
				if (app.name.toUpperCase() === appName.toUpperCase()) {
					this.extendedData.set(app, records);
				}
			}
			return;
		}

		this.extendedData.addByName(appName, records);
	}

	updateBlock(): void {
		this.createBlock();
	}

	/** @internal */
	assignDocument(doc: CadDocument): void {
		super.assignDocument(doc);
		this._style = CadObject.updateCollection(this._style, doc.dimensionStyles);
		this._block = CadObject.updateCollection(this._block!, doc.blockRecords);

		if (this._block != null) {
			this._block.name = this.generateBlockName();
		}

		this._block = CadObject.updateCollection(this._block!, doc.blockRecords);
	}

	/** @internal */
	unassignDocument(): void {
		super.unassignDocument();
		this._style = this._style?.clone() as DimensionStyle;
		this._block = this._block?.clone() as BlockRecord ?? null;
	}

	protected createBlock(): void {
		if (this._block == null) {
			this._block = new BlockRecord(this.generateBlockName());
			this._block.isAnonymous = true;
		}

		if (this.document != null) {
			this._block = CadObject.updateCollection(this._block, this.document.blockRecords);
		}

		this._block.entities.clear();
	}

	protected createDefinitionPoint(location: XYZ): Point {
		const point = new Point(new XYZ(location.x, location.y, location.z));
		point.layer = this.document?.layers.get(Layer.DefpointsName) ?? Layer.Defpoints;
		point.normal = this.normal;
		return point;
	}

	protected createTextEntity(insertPoint: XYZ, text: string): MText {
		const style = this.getActiveDimensionStyle();
		const entity = new MText();
		entity.insertPoint = new XYZ(insertPoint.x, insertPoint.y, insertPoint.z);
		entity.alignmentPoint = new XYZ(Math.cos(this.textRotation), Math.sin(this.textRotation), 0);
		entity.attachmentPoint = this.attachmentPoint;
		entity.color = style.textColor;
		entity.height = style.textHeight;
		entity.layer = this.layer;
		entity.lineSpacing = this.lineSpacingFactor === 0 ? entity.lineSpacing : this.lineSpacingFactor;
		entity.lineSpacingStyle = this.lineSpacingStyle;
		entity.normal = this.normal;
		entity.rotation = this.textRotation;
		entity.style = style.style;
		entity.value = text;
		return entity;
	}

	protected populateBlock(lineSegments: Array<readonly [XYZ, XYZ]>, definitionPoints: XYZ[], textPoint: XYZ = this.textMiddlePoint): void {
		this.createBlock();

		for (const [start, end] of lineSegments) {
			this.addBlockLine(start, end);
		}

		const seenPoints = new Set<string>();
		for (const point of definitionPoints) {
			if (!this.isFinitePoint(point)) {
				continue;
			}

			const key = `${point.x}:${point.y}:${point.z}`;
			if (seenPoints.has(key)) {
				continue;
			}

			seenPoints.add(key);
			this._block!.entities.add(this.createDefinitionPoint(point));
		}

		if (this.isFinitePoint(textPoint)) {
			this._block!.entities.add(this.createTextEntity(textPoint, this.getMeasurementText()));
		}
	}

	protected static angleBetweenVectors(first: XYZ, second: XYZ): number {
		const lengthProduct = first.getLength() * second.getLength();
		if (lengthProduct === 0) {
			return 0;
		}

		const cosine = first.dot(second) / lengthProduct;
		const clamped = Math.max(-1, Math.min(1, cosine));
		return Math.acos(clamped);
	}

	protected static areParallel(first: XYZ, second: XYZ): boolean {
		return Dimension.isZeroVector(first.cross(second));
	}

	protected isFinitePoint(point: XYZ): boolean {
		return Number.isFinite(point.x) && Number.isFinite(point.y) && Number.isFinite(point.z);
	}

	private addBlockLine(start: XYZ, end: XYZ): void {
		if (!this.isFinitePoint(start) || !this.isFinitePoint(end) || start.equals(end)) {
			return;
		}

		const line = new Line(
			new XYZ(start.x, start.y, start.z),
			new XYZ(end.x, end.y, end.z),
		);
		line.layer = this.layer;
		line.normal = this.normal;
		this._block!.entities.add(line);
	}

	protected static intersectLinesXY(firstStart: XYZ, firstEnd: XYZ, secondStart: XYZ, secondEnd: XYZ): XYZ {
		const denominator =
			(firstStart.x - firstEnd.x) * (secondStart.y - secondEnd.y) -
			(firstStart.y - firstEnd.y) * (secondStart.x - secondEnd.x);
		if (Math.abs(denominator) <= 1e-12) {
			return XYZ.NaN;
		}

		const firstDeterminant = firstStart.x * firstEnd.y - firstStart.y * firstEnd.x;
		const secondDeterminant = secondStart.x * secondEnd.y - secondStart.y * secondEnd.x;

		return new XYZ(
			(firstDeterminant * (secondStart.x - secondEnd.x) - (firstStart.x - firstEnd.x) * secondDeterminant) / denominator,
			(firstDeterminant * (secondStart.y - secondEnd.y) - (firstStart.y - firstEnd.y) * secondDeterminant) / denominator,
			firstStart.z,
		);
	}

	protected static isZeroVector(vector: XYZ, epsilon: number = 1e-12): boolean {
		return Math.abs(vector.x) <= epsilon && Math.abs(vector.y) <= epsilon && Math.abs(vector.z) <= epsilon;
	}

	protected static subtractPoints(first: XYZ, second: XYZ): XYZ {
		return new XYZ(first.x - second.x, first.y - second.y, first.z - second.z);
	}

	protected override _tableOnRemove(sender: unknown, e: CollectionChangedEventArgs): void {
		super._tableOnRemove(sender, e);

		if (e.item === this._style) {
			this._style = this.document!.dimensionStyles.get(DimensionStyle.DefaultName)!;
		}

		if (e.item === this._block) {
			this._block = null;
		}
	}

	private generateBlockName(): string {
		return `*D${this.handle}`;
	}

	private formatMeasurement(value: number, style: DimensionStyle): string {
		if (!Number.isFinite(value)) {
			return '';
		}

		let measurement = value;
		if (style.rounding > 0) {
			measurement = Math.round(measurement / style.rounding) * style.rounding;
		}

		return measurement.toFixed(style.decimalPlaces);
	}
}

export { DimensionType } from './DimensionType.js';
