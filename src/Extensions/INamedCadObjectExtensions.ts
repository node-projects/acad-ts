import { INamedCadObject } from '../INamedCadObject.js';
import { ACadVersion } from '../ACadVersion.js';

export class INamedCadObjectExtensions {
	public static readonly InvalidCharacters: string[] = ['\\', '/', ':', '*', '?', '"', '<', '>', '|', ';', ',', '=', '`'];

	public static isValidDxfName(namedCadObject: INamedCadObject, version: ACadVersion = ACadVersion.AC1032): boolean {
		if (!namedCadObject.name) {
			return false;
		}

		if (version <= ACadVersion.AC1015 && namedCadObject.name.length > 31) {
			return false;
		} else if (namedCadObject.name.length > 255) {
			return false;
		}

		for (const ch of INamedCadObjectExtensions.InvalidCharacters) {
			if (namedCadObject.name.includes(ch)) {
				return false;
			}
		}

		return true;
	}
}
