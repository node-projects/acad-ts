import { ICadObjectTemplate } from './ICadObjectTemplate.js';

export interface ICadTableTemplate extends ICadObjectTemplate {
	EntryHandles: Set<number>;
}
