import { BlockParameter } from './BlockParameter.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';
import { XYZ } from '../../Math/XYZ.js';
import { EvalParameterProperty } from './EvalParameterProperty.js';

export abstract class Block1PtParameter extends BlockParameter {
	override get subclassMarker(): string { return DxfSubclassMarker.block1PtParameter; }

	location: XYZ = new XYZ(0, 0, 0);
	displacementX: EvalParameterProperty = new EvalParameterProperty();
	displacementY: EvalParameterProperty = new EvalParameterProperty();
	get gripId(): number { return this.value93; }
	set gripId(value: number) { this.value93 = value; }
	value93: number = 0;
	value170: number = 0;
	value171: number = 0;
}
