import { NonGraphicalObject } from './NonGraphicalObject.js';
import { CadObject } from '../CadObject.js';
import type { CadDocument } from '../CadDocument.js';
import { Color } from '../Color.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import type { LineType } from '../Tables/LineType.js';
import { MLineStyleFlags } from './MLineStyleFlags.js';

export class MLineStyleElement {
	color: Color = Color.byLayer;

	private _lineType: LineType | null = null;
	get lineType(): LineType | null { return this._lineType; }
	set lineType(value: LineType | null) {
		if (this.owner?.document?.lineTypes) {
			this._lineType = this.owner.updateElementLineType(value, lineType => this._lineType = lineType);
		} else {
			this._lineType = value;
		}
	}

	offset: number = 0;
	owner: MLineStyle | null = null;

	clone(): MLineStyleElement {
		const clone = new MLineStyleElement();
		clone.color = this.color;
		clone.offset = this.offset;
		clone.owner = null;
		clone._lineType = this._lineType?.clone() as LineType | null ?? null;
		return clone;
	}

	assignDocument(doc: CadDocument): void {
		if (this.owner) this._lineType = this.owner.updateElementLineType(this._lineType, lineType => this._lineType = lineType);
	}

	unassignDocument(): void {
		this.owner?.document?.lineTypes?.removeReference(this._lineType?.name, this.owner);
		this._lineType = this._lineType?.clone() as LineType | null ?? null;
	}
}

export class MLineStyle extends NonGraphicalObject {
	static get default_(): MLineStyle {
		const def = new MLineStyle(MLineStyle.defaultName);
		def.startAngle = Math.PI / 2;
		def.endAngle = Math.PI / 2;
		const e1 = new MLineStyleElement();
		e1.offset = 0.5;
		def.addElement(e1);
		const e2 = new MLineStyleElement();
		e2.offset = -0.5;
		def.addElement(e2);
		return def;
	}

	description: string = '';

	get elements(): readonly MLineStyleElement[] {
		return this._elements;
	}

	endAngle: number = Math.PI / 2;
	fillColor: Color = Color.byLayer;
	flags: MLineStyleFlags = MLineStyleFlags.None;

	override get objectName(): string { return DxfFileToken.objectMLineStyle; }
	override get objectType(): ObjectType { return ObjectType.MLINESTYLE; }

	startAngle: number = Math.PI / 2;

	override get subclassMarker(): string { return DxfSubclassMarker.mLineStyle; }

	static readonly defaultName = 'Standard';

	private _elements: MLineStyleElement[] = [];

	constructor(name?: string) {
		super(name);
	}

	addElement(element: MLineStyleElement): void {
		if (element.owner != null) {
			throw new Error(`Element already assigned to a MLineStyle: ${element.owner.name}`);
		}
		element.owner = this;
		element.lineType = element.lineType;
		this._elements.push(element);
	}

	updateElementLineType(value: LineType | null, assign: (lineType: LineType) => void): LineType | null {
		return this.updateTableEntry(value, assign, this.document?.lineTypes ?? null);
	}

	override assignDocument(doc: CadDocument): void {
		super.assignDocument(doc);
		for (const element of this._elements) element.assignDocument(doc);
	}

	override unassignDocument(): void {
		for (const element of this._elements) element.unassignDocument();
		super.unassignDocument();
	}

	override clone(): CadObject {
		const clone = super.clone() as MLineStyle;
		clone._elements = [];
		for (const element of this._elements) {
			clone.addElement(element.clone());
		}
		return clone;
	}
}

export { MLineStyleFlags } from './MLineStyleFlags.js';
