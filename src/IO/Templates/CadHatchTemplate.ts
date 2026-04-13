import { Hatch , HatchBoundaryPath} from '../../Entities/Hatch.js';
import { Entity } from '../../Entities/Entity.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadEntityTemplateT } from './CadEntityTemplate.js';
import { ICadTemplate } from './ICadTemplate.js';

export class CadHatchTemplate extends CadEntityTemplateT<Hatch> {
	HatchPatternName: string | null = null;

	PathTemplates: CadHatchTemplate.CadBoundaryPathTemplate[] = [];

	constructor(hatch?: Hatch) {
		super(hatch ?? new Hatch());
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		for (const t of this.PathTemplates) {
			(this.CadObject as Hatch).paths.push(t.Path);
			t.Build(builder);
		}
	}
}

export namespace CadHatchTemplate {
	export class CadBoundaryPathTemplate implements ICadTemplate {
		Path: HatchBoundaryPath = new HatchBoundaryPath();

		Handles: Set<number> = new Set();

		Build(builder: CadDocumentBuilder): void {
			for (const handle of this.Handles) {
				const entity = builder.TryGetCadObject<Entity>(handle);
				if (entity) {
					this.Path.entities.push(entity);
				}
			}
		}
	}
}
