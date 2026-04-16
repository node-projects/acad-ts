import { ICadObjectTemplate } from './ICadObjectTemplate.js';

export interface ICadTableTemplate extends ICadObjectTemplate {
	entryHandles: Set<number>;
}
