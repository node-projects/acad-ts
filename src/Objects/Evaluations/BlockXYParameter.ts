import { Block2PtParameter } from './Block2PtParameter.js';
import { ParameterValueSet } from './ParameterValueSet.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';

export class BlockXYParameter extends Block2PtParameter {
	descriptionX: string = '';
	descriptionY: string = '';
	labelOffsetX: number = 0;
	labelOffsetY: number = 0;
	labelX: string = '';
	labelY: string = '';
	valueSetX: ParameterValueSet = new ParameterValueSet();
	valueSetY: ParameterValueSet = new ParameterValueSet();
	override get objectName(): string { return DxfFileToken.objectBlockXYParameter; }
	override get subclassMarker(): string { return DxfSubclassMarker.blockXYParameter; }
}
