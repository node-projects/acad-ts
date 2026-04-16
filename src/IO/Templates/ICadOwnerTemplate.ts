import { ICadObjectTemplate } from './ICadObjectTemplate.js';

export interface ICadOwnerTemplate extends ICadObjectTemplate {
	ownedObjectsHandlers: Set<number>;
}
