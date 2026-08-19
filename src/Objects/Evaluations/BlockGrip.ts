import { BlockElement } from './BlockElement.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';
import { XYZ } from '../../Math/XYZ.js';

export abstract class BlockGrip extends BlockElement {
	location: XYZ = new XYZ(0, 0, 0);

	override get subclassMarker(): string { return DxfSubclassMarker.blockGrip; }

	value280: number = 0;
	value91: number = 0;
	value92: number = 0;
	value93: number = 0;
	get cycling(): boolean { return this.value280 !== 0; }
	set cycling(value: boolean) { this.value280 = value ? 1 : 0; }
	get expressionId1(): number { return this.value91; }
	set expressionId1(value: number) { this.value91 = value; }
	get expressionId2(): number { return this.value92; }
	set expressionId2(value: number) { this.value92 = value; }
}
