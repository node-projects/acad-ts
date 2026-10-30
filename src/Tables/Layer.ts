import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { Color } from '../Color.js';
import { LineWeightType } from '../Types/LineWeightType.js';
import { CadObject } from '../CadObject.js';
import type { CadDocument } from '../CadDocument.js';
import { CollectionChangedEventArgs } from '../CollectionChangedEventArgs.js';
import type { Material } from '../Objects/Material.js';
import { TableEntry } from './TableEntry.js';
import { LayerFlags } from './LayerFlags.js';
import { LineType } from './LineType.js';
import { StandardFlags } from './StandardFlags.js';

export class Layer extends TableEntry {
	public static get default(): Layer {
		return new Layer(Layer.defaultName);
	}

	public static get defpoints(): Layer {
		const l = new Layer(Layer.defpointsName);
		l.plotFlag = false;
		return l;
	}

	public get color(): Color {
		return this._color;
	}
	public set color(value: Color) {
		if (value.isByLayer || value.isByBlock) {
			throw new Error('The layer color cannot be ByLayer or ByBlock');
		}
		this._color = value;
	}

	public get layerFlags(): LayerFlags {
		return this.flags as unknown as LayerFlags;
	}
	public set layerFlags(value: LayerFlags) {
		this.flags = value as unknown as StandardFlags;
	}

	public isOn: boolean = true;

	public get lineType(): LineType { return this._lineType ??= LineType.continuous; }
	public set lineType(value: LineType | null) {
		this._lineType = this.updateTableEntry(value, lineType => this._lineType = lineType, this.document?.lineTypes ?? null);
	}

	public lineWeight: LineWeightType = LineWeightType.Default;

	public material: Material | null = null;

	public override get objectName(): string {
		return DxfFileToken.tableLayer;
	}

	public override get objectType(): ObjectType {
		return ObjectType.LAYER;
	}

	public get plotFlag(): boolean {
		if (this._name.toLowerCase() === Layer.defpointsName.toLowerCase()) {
			return false;
		}
		return this._plotFlag;
	}
	public set plotFlag(value: boolean) {
		this._plotFlag = value;
	}

	public plotStyleName: number = 0;

	public override get subclassMarker(): string {
		return DxfSubclassMarker.layer;
	}

	public static readonly defaultName: string = '0';
	public static readonly defpointsName: string = 'defpoints';

	private _color: Color = new Color(7);
	private _lineType: LineType | null = null;
	private _plotFlag: boolean = true;

	public constructor(name?: string) {
		super(name);
	}

	public override clone(): CadObject {
		const clone = super.clone() as Layer;
		clone._lineType = this._lineType?.clone() as LineType | null ?? null;
		clone.material = this.material?.clone() as Material | null ?? null;
		return clone;
	}

	/** @internal */
	assignDocument(doc: CadDocument): void {
		super.assignDocument(doc);
		this._lineType = this.updateTableEntry(this._lineType ?? LineType.continuous, lineType => this._lineType = lineType, doc.lineTypes);
		this.material = CadObject.updateCollection(this.material, doc.materials);
	}

	/** @internal */
	unassignDocument(): void {
		if (this._lineType) this.document?.lineTypes?.removeReference(this._lineType.name, this);
		super.unassignDocument();
		this._lineType = this._lineType?.clone() as LineType | null ?? null;
		this.material = this.material?.clone() as Material | null ?? null;
	}
}

export { LayerFlags } from './LayerFlags.js';
