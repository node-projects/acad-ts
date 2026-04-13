import { Entity } from '../../Entities/Entity.js';
import { Leader } from '../../Entities/Leader.js';
import { DimensionStyle } from '../../Tables/DimensionStyle.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadEntityTemplateT } from './CadEntityTemplate.js';

export class CadLeaderTemplate extends CadEntityTemplateT<Leader> {
	Dimasz: number = 0;

	DIMSTYLEHandle: number = 0;

	DIMSTYLEName: string = '';

	AnnotationHandle: number = 0;

	constructor(entity?: Leader) {
		super(entity ?? new Leader());
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		const leader = this.CadObject as Leader;

		const style = this.getTableReference<DimensionStyle>(builder, this.DIMSTYLEHandle, this.DIMSTYLEName);
		if (style) {
			leader.style = style;
		}

		const annotation = builder.TryGetCadObject<Entity>(this.AnnotationHandle);
		if (annotation) {
			leader.associatedAnnotation = annotation;
		}
	}
}
