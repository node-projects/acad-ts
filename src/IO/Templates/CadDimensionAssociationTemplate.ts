import { CadObject } from '../../CadObject.js';
import { Dimension } from '../../Entities/Dimension.js';
import { DimensionAssociation , OsnapPointRef} from '../../Objects/DimensionAssociation.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadTemplateT } from './CadTemplate[T].js';
import { ICadTemplate } from './ICadTemplate.js';

export class CadDimensionAssociationTemplate extends CadTemplateT<DimensionAssociation> {
	DimensionHandle: number | null = null;

	FirstPointRef: CadDimensionAssociationTemplate.OsnapPointRefTemplate | null = null;

	FourthPointRef: CadDimensionAssociationTemplate.OsnapPointRefTemplate | null = null;

	SecondPointRef: CadDimensionAssociationTemplate.OsnapPointRefTemplate | null = null;

	ThirdPointRef: CadDimensionAssociationTemplate.OsnapPointRefTemplate | null = null;

	constructor(obj?: DimensionAssociation) {
		super(obj ?? new DimensionAssociation());
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		const dimension = builder.TryGetCadObject<Dimension>(this.DimensionHandle);
		if (dimension) {
			this.CadObject.dimension = dimension;
		}

		if (this.FirstPointRef !== null) {
			this.CadObject.firstPointRef = this.FirstPointRef.OsnapPointRef;
			this.FirstPointRef.Build(builder);
		}

		if (this.SecondPointRef !== null) {
			this.CadObject.secondPointRef = this.SecondPointRef.OsnapPointRef;
			this.SecondPointRef.Build(builder);
		}

		if (this.ThirdPointRef !== null) {
			this.CadObject.thirdPointRef = this.ThirdPointRef.OsnapPointRef;
			this.ThirdPointRef.Build(builder);
		}

		if (this.FourthPointRef !== null) {
			this.CadObject.fourthPointRef = this.FourthPointRef.OsnapPointRef;
			this.FourthPointRef.Build(builder);
		}
	}
}

export namespace CadDimensionAssociationTemplate {
	export class OsnapPointRefTemplate implements ICadTemplate {
		ObjectHandle: number | null = null;

		OsnapPointRef: OsnapPointRef;

		constructor(pointRef: OsnapPointRef) {
			this.OsnapPointRef = pointRef;
		}

		Build(builder: CadDocumentBuilder): void {
			const obj = builder.TryGetCadObject<CadObject>(this.ObjectHandle);
			if (obj) {
				this.OsnapPointRef.geometry = obj;
			}
		}
	}
}
