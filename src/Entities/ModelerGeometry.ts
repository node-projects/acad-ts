import { Entity } from './Entity.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { Color } from '../Color.js';
import { XYZ } from '../Math/XYZ.js';

export class ModelerGeometryWire {
	acisIndex: number = 0;
	applyTransformPresent: boolean = false;
	color: Color = Color.byLayer;
	hasRotation: boolean = false;
	hasShear: boolean = false;
	points: XYZ[] = [];
	scale: number = 0;
	selectionMarker: number = 0;
	translation: XYZ = new XYZ(0, 0, 0);
	type: number = 0;
	xAxis: XYZ = new XYZ(0, 0, 0);
	yAxis: XYZ = new XYZ(0, 0, 0);
	zAxis: XYZ = new XYZ(0, 0, 0);
	/** @internal */
	hasReflection: boolean = false;
}

export class ModelerGeometrySilhouette {
	viewportDirectionFromTarget: XYZ = new XYZ(0, 0, 0);
	viewportId: number = 0;
	viewportPerspective: boolean = false;
	viewportTarget: XYZ = new XYZ(0, 0, 0);
	viewportUpDirection: XYZ = new XYZ(0, 0, 0);
	wires: ModelerGeometryWire[] = [];
}

export abstract class ModelerGeometry extends Entity {
	point: XYZ = new XYZ(0, 0, 0);

	silhouettes: ModelerGeometrySilhouette[] = [];

	override get subclassMarker(): string {
		return DxfSubclassMarker.modelerGeometry;
	}

	wires: ModelerGeometryWire[] = [];

	/** @internal */
	private _guid: string = '';
	get guid(): string {
		if (this._guid) return this._guid;
		if (!(this.revisionMajor || this.revisionMinor1 || this.revisionMinor2 || this.revisionBytes.some(byte => byte !== 0))) return '';
		const hex = (value: number, length: number) => (value >>> 0).toString(16).padStart(length, '0');
		const tail = [...this.revisionBytes].map(byte => hex(byte, 2)).join('');
		return `{${hex(this.revisionMajor, 8)}-${hex(this.revisionMinor1, 4)}-${hex(this.revisionMinor2, 4)}-${tail.slice(0, 4)}-${tail.slice(4)}}`;
	}
	set guid(value: string) {
		if (!value) value = '{00000000-0000-0000-0000-000000000000}';
		this._guid = value;
		const match = /^\{?([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})\}?$/i.exec(value);
		if (!match) return;
		this.revisionMajor = parseInt(match[1], 16);
		this.revisionMinor1 = parseInt(match[2], 16);
		this.revisionMinor2 = parseInt(match[3], 16);
		const tail = match[4] + match[5];
		this.revisionBytes = Uint8Array.from({ length: 8 }, (_, i) => parseInt(tail.slice(i * 2, i * 2 + 2), 16));
		this.revisionGuidPresent = !!(this.revisionMajor || this.revisionMinor1 || this.revisionMinor2 || this.revisionBytes.some(byte => byte !== 0));
		if (!this.revisionGuidPresent) this._guid = '';
	}
	/** @internal */ acisTextEncoded: boolean | null = null;

	/** Auxiliary DWG edge/silhouette stream, independent of the primary body. */
	secondaryAcisData: Uint8Array = new Uint8Array(0);
	get wireframeAcisData(): Uint8Array { return this.secondaryAcisData; }
	set wireframeAcisData(value: Uint8Array) { this.secondaryAcisData = value; }
	secondaryModelerDataFlag: boolean | null = null;
	secondaryModelerFormatVersion: number | null = null;

	modelerFormatVersion: number = 1;
	get hasWireframeData(): boolean { return this.wires.length > 0 || this.silhouettes.length > 0 || this.secondaryAcisData.length > 0; }
	/** Undocumented bit preceding the inline ACIS version; retain it when rewriting. */
	modelerDataFlag: boolean | null = null;
	materialMappings: { arrayIndex: number; absoluteReference: number; materialHandle: number }[] = [];
	revisionGuidPresent: boolean = false;
	revisionMajor: number = 0;
	revisionMinor1: number = 0;
	revisionMinor2: number = 0;
	revisionBytes: Uint8Array = new Uint8Array(8);
	revisionEndMarker: number = 0;

	/** Raw primary SAT/SAB/ASM modeler payload. */
	binaryData: Uint8Array = new Uint8Array(0);

	get acisData(): Uint8Array { return this.binaryData; }
	set acisData(value: Uint8Array) { this.binaryData = value; }

	get isBinaryAcisData(): boolean { return ModelerGeometry.isBinaryPayload(this.binaryData); }

	static isAsmPayload(data: Uint8Array): boolean {
		return new TextDecoder().decode(data.subarray(0, 14)) === 'ASM BinaryFile';
	}

	static isBinaryPayload(data: Uint8Array): boolean {
		return ['ACIS BinaryFile', 'ASM BinaryFile'].some(signature =>
			data.length >= signature.length &&
			[...signature].every((character, i) => data[i] === character.charCodeAt(0)));
	}

	getAcisText(): string | null {
		if (this.binaryData.length === 0 || this.isBinaryAcisData) return null;
		return new TextDecoder('ascii').decode(this.binaryData);
	}

	proprietaryData: string = '';

	override applyTransform(transform: unknown): void {
		this.point = this.applyTransformToPoint(transform, this.point);
		for (const wire of this.wires) {
			wire.points = wire.points.map((point) => this.applyTransformToPoint(transform, point));
			wire.translation = this.applyTransformToPoint(transform, wire.translation);
			wire.xAxis = this.applyTransformToVector(transform, wire.xAxis);
			wire.yAxis = this.applyTransformToVector(transform, wire.yAxis);
			wire.zAxis = this.applyTransformToVector(transform, wire.zAxis);
		}
		for (const silhouette of this.silhouettes) {
			silhouette.viewportDirectionFromTarget = this.applyTransformToVector(transform, silhouette.viewportDirectionFromTarget);
			silhouette.viewportTarget = this.applyTransformToPoint(transform, silhouette.viewportTarget);
			silhouette.viewportUpDirection = this.applyTransformToVector(transform, silhouette.viewportUpDirection);
			for (const wire of silhouette.wires) {
				wire.points = wire.points.map((point) => this.applyTransformToPoint(transform, point));
				wire.translation = this.applyTransformToPoint(transform, wire.translation);
				wire.xAxis = this.applyTransformToVector(transform, wire.xAxis);
				wire.yAxis = this.applyTransformToVector(transform, wire.yAxis);
				wire.zAxis = this.applyTransformToVector(transform, wire.zAxis);
			}
		}
	}

	override getBoundingBox(): BoundingBox {
		const points: XYZ[] = [this.point];
		for (const wire of this.wires) {
			points.push(...wire.points);
		}
		for (const silhouette of this.silhouettes) {
			points.push(silhouette.viewportTarget);
			for (const wire of silhouette.wires) {
				points.push(...wire.points);
			}
		}

		return BoundingBox.fromPoints(points);
	}
}
