import { ICadObjectTemplate } from './ICadObjectTemplate.js';

export interface ICadTableEntryTemplate extends ICadObjectTemplate {
	Type: string;
	Name: string;
}
