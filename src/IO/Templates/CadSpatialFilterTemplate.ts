import { SpatialFilter } from '../../Objects/SpatialFilter.js';
import { CadNonGraphicalObjectTemplate } from './CadNonGraphicalObjectTemplate.js';

export class CadSpatialFilterTemplate extends CadNonGraphicalObjectTemplate {
	hasFrontPlane: boolean = false;

	insertTransformRead: boolean = false;

	constructor(obj?: SpatialFilter) {
		super(obj ?? new SpatialFilter());
	}
}
