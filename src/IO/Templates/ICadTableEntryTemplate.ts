import { ICadObjectTemplate } from './ICadObjectTemplate.js';

export interface ICadTableEntryTemplate extends ICadObjectTemplate {
	type: string;
	name: string;
}
