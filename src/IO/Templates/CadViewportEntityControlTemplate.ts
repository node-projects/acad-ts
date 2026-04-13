import { CadObject } from '../../CadObject.js';
import { ObjectType } from '../../Types/ObjectType.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadTemplate } from './CadTemplate.js';

export class CadViewportEntityControlTemplate extends CadTemplate {
	EntryHandles: Set<number> = new Set();

	constructor() {
		super(new VPEntityPlaceholder());
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);
	}
}

class VPEntityPlaceholder extends CadObject {
	override get objectType(): ObjectType { return ObjectType.INVALID; }
	override get subclassMarker(): string { return ''; }
}
