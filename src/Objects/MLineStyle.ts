import { NonGraphicalObject } from './NonGraphicalObject.js';
import { CadObject } from '../CadObject.js';
import { Color } from '../Color.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { MLineStyleFlags } from './MLineStyleFlags.js';

export class MLineStyleElement {
	color: Color = Color.ByLayer;

	private _lineType: any = null; // LineType
	get lineType(): any { return this._lineType; }
	set lineType(value: any) {
		this._lineType = CadObject.updateCollectionStatic(value, this.owner?.document?.lineTypes);
	}

	offset: number = 0;
	owner: MLineStyle | null = null;

	clone(): MLineStyleElement {
		const clone = new MLineStyleElement();
		clone.color = this.color;
		clone.offset = this.offset;
		clone.owner = null;
		clone._lineType = this._lineType; // TODO: clone lineType
		return clone;
	}

	assignDocument(doc: any): void {
		this._lineType = CadObject.updateCollectionStatic(this._lineType, doc.lineTypes);
	}

	unassignDocument(): void {
		// TODO: clone lineType on unassign
	}
}

export class MLineStyle extends NonGraphicalObject {
	static get default_(): MLineStyle {
		const def = new MLineStyle(MLineStyle.DefaultName);
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
	fillColor: Color = Color.ByLayer;
	flags: MLineStyleFlags = MLineStyleFlags.None;

	override get objectName(): string { return DxfFileToken.ObjectMLineStyle; }
	override get objectType(): ObjectType { return ObjectType.MLINESTYLE; }

	startAngle: number = Math.PI / 2;

	override get subclassMarker(): string { return DxfSubclassMarker.MLineStyle; }

	static readonly DefaultName = 'Standard';

	private _elements: MLineStyleElement[] = [];

	constructor(name?: string) {
		super(name);
	}

	addElement(element: MLineStyleElement): void {
		if (element.owner != null) {
			throw new Error(`Element already assigned to a MLineStyle: ${element.owner.name}`);
		}
		element.lineType = CadObject.updateCollection(element.lineType, this.document?.lineTypes);
		element.owner = this;
		this._elements.push(element);
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
