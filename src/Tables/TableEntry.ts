import { CadObject } from '../CadObject.js';
import { INamedCadObject } from '../INamedCadObject.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { StandardFlags } from './StandardFlags.js';
import { OnNameChangedArgs } from '../OnNameChangedArgs.js';

export abstract class TableEntry extends CadObject implements INamedCadObject {
	public onNameChanged: ((sender: unknown, args: OnNameChangedArgs) => void) | null = null;

	public flags: StandardFlags = StandardFlags.None;

	public get name(): string {
		return this._name;
	}
	public set name(value: string) {
		if (!value || !value.trim()) {
			throw new Error(`Table entry [${this.constructor.name}] must have a name`);
		}
		if (this.onNameChanged) {
			this.onNameChanged(this, new OnNameChangedArgs(this._name, value));
		}
		this._name = value;
	}

	public override get subclassMarker(): string {
		return DxfSubclassMarker.tableRecord;
	}

	protected _name: string = '';

	public constructor(name?: string) {
		super();
		if (name !== undefined) {
			if (!name) {
				throw new Error(`${this.constructor.name} must have a name.`);
			}
			this.name = name;
		}
	}

	public override clone(): CadObject {
		const clone = super.clone() as TableEntry;
		clone.onNameChanged = null;
		return clone;
	}

	public override toString(): string {
		return `${this.objectName}:${this.name}`;
	}
}

export { StandardFlags } from './StandardFlags.js';
