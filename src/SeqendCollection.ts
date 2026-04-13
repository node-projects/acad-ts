import { CadObject } from './CadObject.js';
import { CadObjectCollection } from './CadObjectCollection.js';
import { CollectionChangedEventArgs } from './CollectionChangedEventArgs.js';
import { Seqend } from './Entities/Seqend.js';
import { ISeqendCollection } from './ISeqendColleciton.js';

export class SeqendCollection<T extends CadObject> extends CadObjectCollection<T> implements ISeqendCollection {
	public onSeqendAdded: ((sender: any, args: CollectionChangedEventArgs) => void) | null = null;
	public onSeqendRemoved: ((sender: any, args: CollectionChangedEventArgs) => void) | null = null;

	public get seqend(): Seqend | null {
		if (this._entries.size > 0) return this._seqend;
		return null;
	}
	public set seqend(value: Seqend) {
		this._seqend = value;
		this._seqend.owner = this.owner;
	}

	private _seqend: Seqend;

	constructor(owner: CadObject) {
		super(owner);
		this._seqend = new Seqend(owner);
	}

	public override add(item: T): void {
		let addSeqend = false;
		if (this._entries.size === 0) {
			addSeqend = true;
		}

		super.add(item);

		if (addSeqend && this._entries.size > 0) {
			this.onSeqendAdded?.(this, new CollectionChangedEventArgs(this._seqend));
		}
	}

	public override remove(item: T): T | null {
		const e = super.remove(item);
		if (e != null) {
			this.onSeqendRemoved?.(this, new CollectionChangedEventArgs(this._seqend));
		}
		return e;
	}

	[Symbol.iterator](): Iterator<any> {
		return this._entries[Symbol.iterator]();
	}
}
