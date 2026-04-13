import { Spline } from '../../Entities/Spline.js';
import { CadEntityTemplateT } from './CadEntityTemplate.js';

export class CadSplineTemplate extends CadEntityTemplateT<Spline> {
	constructor(entity?: Spline) {
		super(entity ?? new Spline());
	}
}
