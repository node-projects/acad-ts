import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { TableEntry } from './TableEntry.js';
import { StyleFlags } from './StyleFlags.js';
import { FontFlags } from './FontFlags.js';
import { StandardFlags } from './StandardFlags.js';

// TODO: TextMirrorFlag from Entities not yet converted
export enum TextMirrorFlag {
	None = 0,
	FlipX = 2,
	FlipY = 4,
}

export class TextStyle extends TableEntry {
	public static readonly DefaultName: string = 'Standard';

	public override get objectType(): ObjectType {
		return ObjectType.STYLE;
	}

	public override get objectName(): string {
		return DxfFileToken.TableStyle;
	}

	public override get subclassMarker(): string {
		return DxfSubclassMarker.TextStyle;
	}

	public static get Default(): TextStyle {
		return new TextStyle(TextStyle.DefaultName);
	}

	public get styleFlags(): StyleFlags {
		return this.flags as unknown as StyleFlags;
	}
	public set styleFlags(value: StyleFlags) {
		this.flags = value as unknown as StandardFlags;
	}

	public filename: string = '';

	public bigFontFilename: string | null = null;

	public height: number = 0;

	public width: number = 1.0;

	public lastHeight: number = 0;

	public obliqueAngle: number = 0.0;

	public mirrorFlag: TextMirrorFlag = TextMirrorFlag.None;

	public trueType: FontFlags = FontFlags.Regular;

	public get isShapeFile(): boolean {
		return (this.styleFlags & StyleFlags.IsShape) !== 0;
	}

	public constructor(name?: string) {
		super(name);
	}
}

export { StyleFlags } from './StyleFlags.js';
