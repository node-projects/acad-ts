import { ACadVersion } from '../../../ACadVersion.js';
import { Dwg21CompressedMetadata } from './Dwg21CompressedMetadata.js';
import { DwgFileHeaderAC18 } from './DwgFileHeaderAC18.js';

export class DwgFileHeaderAC21 extends DwgFileHeaderAC18 {
	CompressedMetadata!: Dwg21CompressedMetadata;

	constructor(version?: ACadVersion) {
		super(version);
	}
}
