import { CadObject } from './CadObject.js';

type ReferenceHolder<TValue> = {
	owner: CadObject;
	assignTo: (value: TValue) => void;
};

export class CadObjectReferenceHandler<TKey, TValue> {
	private readonly _references = new Map<TKey, Set<ReferenceHolder<TValue>>>();
	private readonly _referencesByOwner = new Map<CadObject, ReferenceHolder<TValue>>();

	addReference(key: TKey, owner: CadObject, assignTo: (value: TValue) => void): void {
		const previous = this._referencesByOwner.get(owner);
		if (previous) {
			for (const [previousKey, holders] of this._references) {
				if (holders.delete(previous) && holders.size === 0) this._references.delete(previousKey);
			}
		}
		const holder = { owner, assignTo };
		const holders = this._references.get(key) ?? new Set<ReferenceHolder<TValue>>();
		holders.add(holder);
		this._references.set(key, holders);
		this._referencesByOwner.set(owner, holder);
	}

	removeReference(key: TKey, owner: CadObject): void {
		const holder = this._referencesByOwner.get(owner);
		const holders = this._references.get(key);
		if (!holder || !holders) return;
		holders.delete(holder);
		this._referencesByOwner.delete(owner);
		if (holders.size === 0) this._references.delete(key);
	}

	changeKey(current: TKey, next: TKey): void {
		const holders = this._references.get(current);
		if (!holders) return;
		this._references.delete(current);
		this._references.set(next, holders);
	}

	getReferences(key: TKey): Iterable<CadObject> {
		const holders = this._references.get(key);
		return holders ? [...holders].map(holder => holder.owner) : [];
	}

	assignAndRemove(key: TKey, value: TValue): void {
		const holders = this._references.get(key);
		if (!holders) return;
		this._references.delete(key);
		for (const holder of holders) {
			this._referencesByOwner.delete(holder.owner);
			holder.assignTo(value);
		}
	}
}
