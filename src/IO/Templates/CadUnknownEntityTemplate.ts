import { UnknownEntity } from '../../Entities/UnknownEntity.js';
import { UnknownNonGraphicalObject } from '../../Objects/UnknownNonGraphicalObject.js';
import { CadEntityTemplate } from './CadEntityTemplate.js';
import { CadNonGraphicalObjectTemplate } from './CadNonGraphicalObjectTemplate.js';

export class CadUnknownNonGraphicalObjectTemplate extends CadNonGraphicalObjectTemplate {
	constructor(obj: UnknownNonGraphicalObject) {
		super(obj);
	}
}

export class CadUnknownEntityTemplate extends CadEntityTemplate {
	constructor(entity: UnknownEntity) {
		super(entity);
	}
}
