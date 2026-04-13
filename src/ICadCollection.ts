import { CadObject } from './CadObject.js';

export interface ICadCollection<T extends CadObject> extends Iterable<T> {
	tryAdd(item: T): T;
}
