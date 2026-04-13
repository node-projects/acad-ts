import { CadObject } from '../CadObject.js';

export class CadObjectExtensions {
	public static cloneTyped<T extends CadObject>(obj: T): T {
		return obj.clone() as T;
	}
}
