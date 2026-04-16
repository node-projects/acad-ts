import { Solid3D } from '../../Entities/Solid3D.js';
import { CadEntityTemplateT } from './CadEntityTemplate.js';

export class CadSolid3DTemplate extends CadEntityTemplateT<Solid3D> {
	historyHandle: number | null = null;

	constructor(solid?: Solid3D) {
		super(solid ?? new Solid3D());
	}
}
