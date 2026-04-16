import { Hatch , HatchBoundaryPath} from '../../Entities/Hatch.js';
import { Entity } from '../../Entities/Entity.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadEntityTemplateT } from './CadEntityTemplate.js';
import { ICadTemplate } from './ICadTemplate.js';

export class CadHatchTemplate extends CadEntityTemplateT<Hatch> {
	hatchPatternName: string | null = null;

	pathTemplates: CadHatchTemplate.CadBoundaryPathTemplate[] = [];

	constructor(hatch?: Hatch) {
		super(hatch ?? new Hatch());
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		for (const t of this.pathTemplates) {
			(this.cadObject as Hatch).paths.push(t.path);
			t.build(builder);
		}
	}
}

export namespace CadHatchTemplate {
	export class CadBoundaryPathTemplate implements ICadTemplate {
		path: HatchBoundaryPath = new HatchBoundaryPath();

		handles: Set<number> = new Set();

		build(builder: CadDocumentBuilder): void {
			for (const handle of this.handles) {
				const entity = builder.tryGetCadObject<Entity>(handle);
				if (entity) {
					this.path.entities.push(entity);
				}
			}
		}
	}
}
