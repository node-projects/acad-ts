import { SpatialFilter } from '../../Objects/SpatialFilter.js';
import { CadNonGraphicalObjectTemplate } from './CadNonGraphicalObjectTemplate.js';

export class CadSpatialFilterTemplate extends CadNonGraphicalObjectTemplate {
	HasFrontPlane: boolean = false;

	InsertTransformRead: boolean = false;

	constructor(obj?: SpatialFilter) {
		super(obj ?? new SpatialFilter());
	}
}
