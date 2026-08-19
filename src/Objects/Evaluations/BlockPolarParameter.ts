import { Block2PtParameter } from './Block2PtParameter.js';
import { ParameterValueSet } from './ParameterValueSet.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';

export class BlockPolarParameter extends Block2PtParameter {
	angleValueSet: ParameterValueSet = new ParameterValueSet();
	angleDescription: string = '';
	angleName: string = '';
	description: string = '';
	distanceValueSet: ParameterValueSet = new ParameterValueSet();
	label: string = '';
	labelOffset: number = 0;
	override get objectName(): string { return DxfFileToken.objectBlockPolarParameter; }
	override get subclassMarker(): string { return DxfSubclassMarker.blockPolarParameter; }
}
