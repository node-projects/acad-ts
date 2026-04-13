import { Material } from '../../Objects/Material.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadTemplateT } from './CadTemplate[T].js';

export class CadMaterialTemplate extends CadTemplateT<Material> {
	constructor(material?: Material) {
		super(material ?? new Material());
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);
	}
}
