import { BlockGrip } from './BlockGrip.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';
import { DxfFileToken } from '../../DxfFileToken.js';

export class BlockFlipGrip extends BlockGrip {
	override get objectName(): string { return DxfFileToken.objectBlockFlipGrip; }
	get directionX(): number { return this.value140; }
	set directionX(value: number) { this.value140 = value; }
	get directionY(): number { return this.value141; }
	set directionY(value: number) { this.value141 = value; }
	get directionZ(): number { return this.value142; }
	set directionZ(value: number) { this.value142 = value; }
	get flipExpressionId(): number { return this.value93N; }
	set flipExpressionId(value: number) { this.value93N = value; }
	override get subclassMarker(): string { return DxfSubclassMarker.blockFlipGrip; }

	value140: number = 0;
	value141: number = 0;
	value142: number = 0;
	value93N: number = 0;
}
