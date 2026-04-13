import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { Color } from '../Color.js';
import { LineWeightType } from '../Types/LineWeightType.js';
import { CadObject } from '../CadObject.js';
import { CollectionChangedEventArgs } from '../CollectionChangedEventArgs.js';
import { TableEntry } from './TableEntry.js';
import { LayerFlags } from './LayerFlags.js';
import { LineType } from './LineType.js';
import { StandardFlags } from './StandardFlags.js';

export class Layer extends TableEntry {
	public static get Default(): Layer {
		return new Layer(Layer.DefaultName);
	}

	public static get Defpoints(): Layer {
		const l = new Layer(Layer.DefpointsName);
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

	public lineType: any /* LineType */ = null;

	public lineWeight: LineWeightType = LineWeightType.Default;

	public material: any /* Material */ = null;

	public override get objectName(): string {
		return DxfFileToken.TableLayer;
	}

	public override get objectType(): ObjectType {
		return ObjectType.LAYER;
	}

	public get plotFlag(): boolean {
		if (this._name.toLowerCase() === Layer.DefpointsName.toLowerCase()) {
			return false;
		}
		return this._plotFlag;
	}
	public set plotFlag(value: boolean) {
		this._plotFlag = value;
	}

	public plotStyleName: number = 0;

	public override get subclassMarker(): string {
		return DxfSubclassMarker.Layer;
	}

	public static readonly DefaultName: string = '0';
	public static readonly DefpointsName: string = 'defpoints';

	private _color: Color = new Color(7);
	private _plotFlag: boolean = true;

	public constructor(name?: string) {
		super(name);
	}

	public override clone(): CadObject {
		const clone = super.clone() as Layer;
		// TODO: clone.lineType = this.lineType?.clone();
		// TODO: clone.material = this.material?.clone();
		return clone;
	}

	/** @internal */
	assignDocument(doc: any): void {
		super.assignDocument(doc);
		this.lineType = CadObject.updateCollection(this.lineType ?? LineType.Continuous, doc.lineTypes);
	}

	/** @internal */
	unassignDocument(): void {
		super.unassignDocument();
		this.lineType = this.lineType?.clone?.() ?? LineType.Continuous;
	}
}

export { LayerFlags } from './LayerFlags.js';
