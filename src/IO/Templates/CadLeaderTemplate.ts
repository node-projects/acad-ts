import { Entity } from '../../Entities/Entity.js';
import { Leader } from '../../Entities/Leader.js';
import { DimensionStyle } from '../../Tables/DimensionStyle.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadEntityTemplateT } from './CadEntityTemplate.js';

export class CadLeaderTemplate extends CadEntityTemplateT<Leader> {
	dimasz: number = 0;

	dimstyleHandle: number = 0;

	dimstyleName: string = '';

	annotationHandle: number = 0;

	constructor(entity?: Leader) {
		super(entity ?? new Leader());
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		const leader = this.cadObject as Leader;

		const style = this.getTableReference<DimensionStyle>(builder, this.dimstyleHandle, this.dimstyleName);
		if (style) {
			leader.style = style;
		}

		const annotation = builder.tryGetCadObject<Entity>(this.annotationHandle);
		if (annotation) {
			leader.associatedAnnotation = annotation;
		}
	}
}
