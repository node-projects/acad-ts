import { Mesh } from '../../Entities/Mesh.js';
import { CadEntityTemplateT } from './CadEntityTemplate.js';

export class CadMeshTemplate extends CadEntityTemplateT<Mesh> {
	subclassMarker: boolean = false;

	constructor(mesh?: Mesh) {
		super(mesh ?? new Mesh());
	}
}
