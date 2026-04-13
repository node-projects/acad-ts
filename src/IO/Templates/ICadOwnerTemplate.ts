import { ICadObjectTemplate } from './ICadObjectTemplate.js';

export interface ICadOwnerTemplate extends ICadObjectTemplate {
	OwnedObjectsHandlers: Set<number>;
}
