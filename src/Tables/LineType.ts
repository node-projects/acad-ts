import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { CadObject } from '../CadObject.js';
import { TableEntry } from './TableEntry.js';
import { LineTypeShapeFlags } from './LinetypeShapeFlags.js';

export class LineTypeSegment {
	public length: number = 0;
	public shapeFlags: LineTypeShapeFlags = LineTypeShapeFlags.None;
	public shapeNumber: number = 0;
	public offset: { x: number; y: number } = { x: 0, y: 0 };
	public rotation: number = 0;
	public scale: number = 0;
	public text: string = '';
	public style: any /* TextStyle */ = null;
	public owner: LineType | null = null;

	public get isShape(): boolean {
		return (this.shapeFlags & LineTypeShapeFlags.Shape) !== 0;
	}

	public clone(): LineTypeSegment {
		const clone = new LineTypeSegment();
		clone.length = this.length;
		clone.shapeFlags = this.shapeFlags;
		clone.shapeNumber = this.shapeNumber;
		clone.offset = { ...this.offset };
		clone.rotation = this.rotation;
		clone.scale = this.scale;
		clone.text = this.text;
		clone.style = this.style;
		clone.owner = null;
		return clone;
	}
}

export class LineType extends TableEntry {
	public static get ByBlock(): LineType {
		return new LineType('ByBlock');
	}

	public static get ByLayer(): LineType {
		return new LineType('ByLayer');
	}

	public static get Continuous(): LineType {
		return new LineType('Continuous');
	}

	public alignment: string = 'A';

	public description: string | null = null;

	public get hasShapes(): boolean {
		return this._segments.some(s => s.isShape);
	}

	public get isComplex(): boolean {
		return this._segments.length > 0;
	}

	public override get objectName(): string {
		return DxfFileToken.TableLinetype;
	}

	public override get objectType(): ObjectType {
		return ObjectType.LTYPE;
	}

	public get patternLength(): number {
		return this._segments.reduce((sum, s) => sum + Math.abs(s.length), 0);
	}

	public get segments(): readonly LineTypeSegment[] {
		return this._segments;
	}

	public override get subclassMarker(): string {
		return DxfSubclassMarker.Linetype;
	}

	public static readonly ByBlockName: string = 'ByBlock';
	public static readonly ByLayerName: string = 'ByLayer';
	public static readonly ContinuousName: string = 'Continuous';

	private _segments: LineTypeSegment[] = [];

	public constructor(name?: string) {
		super(name);
	}

	public addSegment(segment: LineTypeSegment): void {
		if (segment.owner != null) {
			throw new Error(`Segment already assigned to a LineType: ${segment.owner.name}`);
		}
		segment.owner = this;
		this._segments.push(segment);
	}

	public override clone(): CadObject {
		const clone = super.clone() as LineType;
		(clone as any)._segments = [];
		for (const segment of this._segments) {
			clone.addSegment(segment.clone());
		}
		return clone;
	}

	// TODO: CreateLineTypeShape requires CSMath types (IVector, XYZ, Polyline3D)
}

export { LineTypeShapeFlags } from './LinetypeShapeFlags.js';
