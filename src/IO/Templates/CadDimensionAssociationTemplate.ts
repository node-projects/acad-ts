import { CadObject } from '../../CadObject.js';
import { Dimension } from '../../Entities/Dimension.js';
import { DimensionAssociation , OsnapPointRef} from '../../Objects/DimensionAssociation.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadTemplateT } from './CadTemplate[T].js';
import { ICadTemplate } from './ICadTemplate.js';

export class CadDimensionAssociationTemplate extends CadTemplateT<DimensionAssociation> {
	dimensionHandle: number | null = null;

	firstPointRef: CadDimensionAssociationTemplate.OsnapPointRefTemplate | null = null;

	fourthPointRef: CadDimensionAssociationTemplate.OsnapPointRefTemplate | null = null;

	secondPointRef: CadDimensionAssociationTemplate.OsnapPointRefTemplate | null = null;

	thirdPointRef: CadDimensionAssociationTemplate.OsnapPointRefTemplate | null = null;

	constructor(obj?: DimensionAssociation) {
		super(obj ?? new DimensionAssociation());
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		const dimension = builder.tryGetCadObject<Dimension>(this.dimensionHandle);
		if (dimension) {
			this.cadObject.dimension = dimension;
		}

		if (this.firstPointRef !== null) {
			this.cadObject.firstPointRef = this.firstPointRef.osnapPointRef;
			this.firstPointRef.build(builder);
		}

		if (this.secondPointRef !== null) {
			this.cadObject.secondPointRef = this.secondPointRef.osnapPointRef;
			this.secondPointRef.build(builder);
		}

		if (this.thirdPointRef !== null) {
			this.cadObject.thirdPointRef = this.thirdPointRef.osnapPointRef;
			this.thirdPointRef.build(builder);
		}

		if (this.fourthPointRef !== null) {
			this.cadObject.fourthPointRef = this.fourthPointRef.osnapPointRef;
			this.fourthPointRef.build(builder);
		}
	}
}

export namespace CadDimensionAssociationTemplate {
	export class OsnapPointRefTemplate implements ICadTemplate {
		objectHandle: number | null = null;

		osnapPointRef: OsnapPointRef;

		constructor(pointRef: OsnapPointRef) {
			this.osnapPointRef = pointRef;
		}

		build(builder: CadDocumentBuilder): void {
			const obj = builder.tryGetCadObject<CadObject>(this.objectHandle);
			if (obj) {
				this.osnapPointRef.geometry = obj;
			}
		}
	}
}
