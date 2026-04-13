import { Block } from '../../Blocks/Block.js';
import { CadEntityTemplate } from './CadEntityTemplate.js';
import { ICadOwnerTemplate } from './ICadOwnerTemplate.js';

export class CadBlockEntityTemplate extends CadEntityTemplate implements ICadOwnerTemplate {
	OwnedObjectsHandlers: Set<number> = new Set();

	constructor(entity: Block) {
		super(entity);
	}
}
