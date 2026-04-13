import { CadObject } from './CadObject.js';

export class CollectionChangedEventArgs {
	public readonly item: CadObject;

	constructor(item: CadObject) {
		this.item = item;
	}
}
