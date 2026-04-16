import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { CadObject } from '../CadObject.js';
import type { TextStyle } from './TextStyle.js';
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
	public style: TextStyle | null = null;
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
	public static get byBlock(): LineType {
		return new LineType('ByBlock');
	}

	public static get byLayer(): LineType {
		return new LineType('ByLayer');
	}

	public static get continuous(): LineType {
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
		return DxfFileToken.tableLinetype;
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
		return DxfSubclassMarker.linetype;
	}

	public static readonly byBlockName: string = 'ByBlock';
	public static readonly byLayerName: string = 'ByLayer';
	public static readonly continuousName: string = 'Continuous';

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
		clone._segments = [];
		for (const segment of this._segments) {
			clone.addSegment(segment.clone());
		}
		return clone;
	}
}

export { LineTypeShapeFlags } from './LinetypeShapeFlags.js';
