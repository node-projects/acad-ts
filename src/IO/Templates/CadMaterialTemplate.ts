import { Material } from '../../Objects/Material.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadTemplateT } from './CadTemplate[T].js';

export class CadMaterialTemplate extends CadTemplateT<Material> {
	constructor(material?: Material) {
		super(material ?? new Material());
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);
	}
}
