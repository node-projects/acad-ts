import { ACadVersion } from '../ACadVersion.js';

export class CadNotSupportedException extends Error {
	public constructor(version?: ACadVersion) {
		if (version !== undefined) {
			super(`File version not supported: ${version}`);
		} else {
			super('File version not recognized');
		}
		this.name = 'CadNotSupportedException';
	}
}
